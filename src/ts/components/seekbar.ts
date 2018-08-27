import {Component, ComponentConfig} from './component';
import {DOM} from '../dom';
import {Event, EventDispatcher, NoArgs} from '../eventdispatcher';
import {SeekBarLabel} from './seekbarlabel';
import {UIInstanceManager, TimelineMarker, SeekPreviewArgs} from '../uimanager';
import {Timeout} from '../timeout';
import {PlayerUtils} from '../playerutils';
import TimeShiftAvailabilityChangedArgs = PlayerUtils.TimeShiftAvailabilityChangedArgs;
import LiveStreamDetectorEventArgs = PlayerUtils.LiveStreamDetectorEventArgs;
import PlayerEvent = bitmovin.PlayerAPI.PlayerEvent;
import {ShowSuggestionsButton} from './showsuggestionsbutton';
import PlayerAPI = bitmovin.PlayerAPI;

/**
 * Configuration interface for the {@link SeekBar} component.
 */
export interface SeekBarConfig extends ComponentConfig {
  /**
   * The label above the seek position.
   */
  label?: SeekBarLabel;
  /**
   * The button used for showing suggestions
   */
  showSuggestionButton?: ShowSuggestionsButton;
  /**
   * Bar will be vertical instead of horizontal if set to true.
   */
  vertical?: boolean;
  /**
   * The interval in milliseconds in which the playback position on the seek bar will be updated. The shorter the
   * interval, the smoother it looks and the more resource intense it is. The update interval will be kept as steady
   * as possible to avoid jitter.
   * Set to -1 to disable smooth updating and update it on player ON_TIME_CHANGED events instead.
   * Default: 50 (50ms = 20fps).
   */
  smoothPlaybackPositionUpdateIntervalMs?: number;
}

/**
 * Event argument interface for a seek preview event.
 */
export interface SeekPreviewEventArgs extends SeekPreviewArgs {
  /**
   * Tells if the seek preview event comes from a scrubbing.
   */
  scrubbing: boolean;
  /**
   * Tells if the mouse is over a marker.
   */
  isOverMarker: boolean;
}

/**
 * A seek bar to seek within the player's media. It displays the current playback position, amount of buffed data, seek
 * target, and keeps status about an ongoing seek.
 *
 * The seek bar displays different 'bars':
 *  - the playback position, i.e. the position in the media at which the player current playback pointer is positioned
 *  - the buffer position, which usually is the playback position plus the time span that is already buffered ahead
 *  - the seek position, used to preview to where in the timeline a seek will jump to
 */
export class SeekBar extends Component<SeekBarConfig> {

  public static readonly SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED = -1;

  /**
   * The CSS class that is added to the DOM element while the seek bar is in 'seeking' state.
   */
  private static readonly CLASS_SEEKING = 'seeking';

  private player: PlayerAPI;
  private seekBar: DOM;
  private seekBarPlaybackPosition: DOM;
  private seekBarPlaybackPositionMarker: DOM;
  private seekBarBufferPosition: DOM;
  private seekBarSeekPosition: DOM;
  private seekBarBackdrop: DOM;
  private seekBarMarkersContainer: DOM;

  private label: SeekBarLabel;
  private showSuggestionButton: ShowSuggestionsButton;

  private timelineMarkers: TimelineMarker[];

  private _commentsOn: boolean = true;
  private snappedMarker: TimelineMarker;


  /**
   * Buffer of the the current playback position. The position must be buffered in case the element
   * needs to be refreshed with {@link #refreshPlaybackPosition}.
   * @type {number}
   */
  private playbackPositionPercentage = 0;

  private smoothPlaybackPositionUpdater: Timeout;

  // https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
  private touchSupported = ('ontouchstart' in window);

  private seekBarEvents = {
    /**
     * Fired when a scrubbing seek operation is started.
     */
    onSeek: new EventDispatcher<SeekBar, NoArgs>(),
    /**
     * Fired during a scrubbing seek to indicate that the seek preview (i.e. the video frame) should be updated.
     */
    onSeekPreview: new EventDispatcher<SeekBar, SeekPreviewEventArgs>(),
    /**
     * Fired when a scrubbing seek has finished or when a direct seek is issued.
     */
    onSeeked: new EventDispatcher<SeekBar, number>(),

    /**
     * Fire when commentsOn is toggled
     */
    onChangeCommentsOn: new EventDispatcher<SeekBar, boolean>(),
  };

  constructor(config: SeekBarConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-seekbar',
      vertical: false,
      smoothPlaybackPositionUpdateIntervalMs: 50,
    }, this.config);

    this.label = this.config.label;
    this.showSuggestionButton = this.config.showSuggestionButton;
    this.timelineMarkers = [];
  }

  initialize(): void {
    super.initialize();

    if (this.hasLabel()) {
      this.getLabel().initialize();
    }

    if (this.showSuggestionButton) {
      this.showSuggestionButton.initialize();
    }
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager, configureSeek: boolean = true): void {
    super.configure(player, uimanager);

    this.player = player;

    if (!configureSeek) {
      // The configureSeek flag can be used by subclasses to disable configuration as seek bar. E.g. the volume
      // slider is reusing this component but adds its own functionality, and does not need the seek functionality.
      // This is actually a hack, the proper solution would be for both seek bar and volume sliders to extend
      // a common base slider component and implement their functionality there.
      return;
    }

    let isPlaying = false;
    let isSeeking = false;

    let dispatchMarkerEvent = (type: string, marker: TimelineMarker) => {
      this.seekBar.dispatchSmashcutPlayerUiEvent({action: 'marker-' + type, marker});
    };

    const updateShowSuggestionButton = (currentTime: number, playbackPositionPercentage: number) => {
      const snappedMarker = this.getMarkerAtPosition(playbackPositionPercentage);

      if (snappedMarker && snappedMarker.markerType === 'note') {

        this.getShowSuggestionsButton().configWithoutArgs({
          currentMarker: snappedMarker,
        });

        this.showSuggestionsButton();
      } else {
        this.hideSuggestionsButton();
      }
    };

    // Update playback and buffer positions
    let playbackPositionHandler = (event: PlayerEvent = null, forceUpdate: boolean = false) => {
      if (isSeeking) {
        // We caught a seek preview seek, do not update the seekbar
        return;
      }

      if (player.isLive()) {
        if (player.getMaxTimeShift() === 0) {
          // This case must be explicitly handled to avoid division by zero
          this.setPlaybackPosition(100);
        }
        else {
          let playbackPositionPercentage = 100 - (100 / player.getMaxTimeShift() * player.getTimeShift());
          this.setPlaybackPosition(playbackPositionPercentage);
        }

        // Always show full buffer for live streams
        this.setBufferPosition(100);
      }
      else {
        let currentTime = player.getCurrentTime();
        let playbackPositionPercentage = 100 / player.getDuration() * currentTime;
        updateShowSuggestionButton(currentTime, playbackPositionPercentage);

        let videoBufferLength = player.getVideoBufferLength();
        let audioBufferLength = player.getAudioBufferLength();
        // Calculate the buffer length which is the smaller length of the audio and video buffers. If one of these
        // buffers is not available, we set it's value to MAX_VALUE to make sure that the other real value is taken
        // as the buffer length.
        let bufferLength = Math.min(
          videoBufferLength != null ? videoBufferLength : Number.MAX_VALUE,
          audioBufferLength != null ? audioBufferLength : Number.MAX_VALUE);
        // If both buffer lengths are missing, we set the buffer length to zero
        if (bufferLength === Number.MAX_VALUE) {
          bufferLength = 0;
        }

        let bufferPercentage = 100 / player.getDuration() * bufferLength;

        // Update playback position only in paused state or in the initial startup state where player is neither
        // paused nor playing. Playback updates are handled in the Timeout below.
        if (this.config.smoothPlaybackPositionUpdateIntervalMs === SeekBar.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED
          || forceUpdate || player.isPaused() || (player.isPaused() === player.isPlaying())) {
          this.setPlaybackPosition(playbackPositionPercentage);
        }

        this.setBufferPosition(playbackPositionPercentage + bufferPercentage);
      }
    };

    // Update seekbar upon these events
    // init playback position when the player is ready
    player.addEventHandler(player.EVENT.ON_READY, playbackPositionHandler);
    // update playback position when it changes
    player.addEventHandler(player.EVENT.ON_TIME_CHANGED, playbackPositionHandler);
    // update bufferlevel when buffering is complete
    player.addEventHandler(player.EVENT.ON_STALL_ENDED, playbackPositionHandler);
    // update playback position when a seek has finished
    player.addEventHandler(player.EVENT.ON_SEEKED, playbackPositionHandler);
    // update playback position when a timeshift has finished
    player.addEventHandler(player.EVENT.ON_TIME_SHIFTED, playbackPositionHandler);
    // update bufferlevel when a segment has been downloaded
    player.addEventHandler(player.EVENT.ON_SEGMENT_REQUEST_FINISHED, playbackPositionHandler);
    // update playback position of Cast playback
    player.addEventHandler(player.EVENT.ON_CAST_TIME_UPDATED, playbackPositionHandler);

    this.configureLivePausedTimeshiftUpdater(player, uimanager, playbackPositionHandler);

    // Seek handling
    player.addEventHandler(player.EVENT.ON_SEEK, () => {
      this.setSeeking(true);
    });
    player.addEventHandler(player.EVENT.ON_SEEKED, () => {
      this.setSeeking(false);
    });
    player.addEventHandler(player.EVENT.ON_TIME_SHIFT, () => {
      this.setSeeking(true);
    });
    player.addEventHandler(player.EVENT.ON_TIME_SHIFTED, () => {
      this.setSeeking(false);
    });

    let seek = (percentage: number) => {
      if (player.isLive()) {
        player.timeShift(player.getMaxTimeShift() - (player.getMaxTimeShift() * (percentage / 100)), 'ui');
      } else {
        player.seek(player.getDuration() * (percentage / 100), 'ui');
      }
    };

    this.onSeek.subscribe((sender) => {
      isSeeking = true; // track seeking status so we can catch events from seek preview seeks

      // Notify UI manager of started seek
      uimanager.onSeek.dispatch(sender);

      // Save current playback state
      isPlaying = player.isPlaying();

      // Pause playback while seeking
      if (isPlaying) {
        player.pause('ui');
      }
    });

    this.onSeekPreview.subscribe((sender: SeekBar, args: SeekPreviewEventArgs) => {
      // Notify UI manager of seek preview
      uimanager.onSeekPreview.dispatch(sender, args);
    });

    this.onSeekPreview.subscribeRateLimited((sender: SeekBar, args: SeekPreviewEventArgs) => {
      // Rate-limited scrubbing seek
      if (args.scrubbing) {
        seek(args.position);
      }
    }, 200);

    this.onSeeked.subscribe((sender, percentage) => {
      isSeeking = false;

      // Do the seek
      seek(percentage);

      // Continue playback after seek if player was playing when seek started
      if (isPlaying) {
        player.play('ui');
      }

      // Notify UI manager of finished seek
      uimanager.onSeeked.dispatch(sender);
    });

    if (this.hasLabel()) {
      // Configure a seekbar label that is internal to the seekbar)
      this.getLabel().configure(player, uimanager);
    }

    // Hide seekbar for live sources without timeshift
    let isLive = false;
    let hasTimeShift = false;
    let switchVisibility = (isLive: boolean, hasTimeShift: boolean) => {
      if (isLive && !hasTimeShift) {
        this.hide();
      } else {
        this.show();
      }
      playbackPositionHandler(null, true);
      this.refreshPlaybackPosition();
    };
    let liveStreamDetector = new PlayerUtils.LiveStreamDetector(player);
    liveStreamDetector.onLiveChanged.subscribe((sender, args: LiveStreamDetectorEventArgs) => {
      isLive = args.live;
      switchVisibility(isLive, hasTimeShift);
    });
    let timeShiftDetector = new PlayerUtils.TimeShiftAvailabilityDetector(player);
    timeShiftDetector.onTimeShiftAvailabilityChanged.subscribe((sender, args: TimeShiftAvailabilityChangedArgs) => {
        hasTimeShift = args.timeShiftAvailable;
        switchVisibility(isLive, hasTimeShift);
      }
    );
    // Initial detection
    liveStreamDetector.detect();
    timeShiftDetector.detect();

    // Refresh the playback position when the player resized or the UI is configured. The playback position marker
    // is positioned absolutely and must therefore be updated when the size of the seekbar changes.
    player.addEventHandler(player.EVENT.ON_PLAYER_RESIZE, () => {
      this.refreshPlaybackPosition();
    });
    // Additionally, when this code is called, the seekbar is not part of the UI yet and therefore does not have a size,
    // resulting in a wrong initial position of the marker. Refreshing it once the UI is configured solved this issue.
    uimanager.onConfigured.subscribe(() => {
      this.refreshPlaybackPosition();
    });
    // It can also happen that the value changes once the player is ready, or when a new source is loaded, so we need
    // to update on ON_READY too
    player.addEventHandler(player.EVENT.ON_READY, () => {
      this.refreshPlaybackPosition();
    });

    // Initialize seekbar
    playbackPositionHandler(); // Set the playback position
    this.setBufferPosition(0);
    this.setSeekPosition(0);
    if (this.config.smoothPlaybackPositionUpdateIntervalMs !== SeekBar.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED) {
      this.configureSmoothPlaybackPositionUpdater(player, uimanager);
    }
    this.configureMarkers(player, uimanager);
  }

  /**
   * Update seekbar while a live stream with DVR window is paused.
   * The playback position stays still and the position indicator visually moves towards the back.
   */
  private configureLivePausedTimeshiftUpdater(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager,
                                              playbackPositionHandler: () => void): void {
    // Regularly update the playback position while the timeout is active
    const pausedTimeshiftUpdater = new Timeout(1000, playbackPositionHandler, true);

    // Start updater when a live stream with timeshift window is paused
    player.addEventHandler(player.EVENT.ON_PAUSED, () => {
      if (player.isLive() && player.getMaxTimeShift() < 0) {
        pausedTimeshiftUpdater.start();
      }
    });

    // Stop updater when playback continues (no matter if the updater was started before)
    player.addEventHandler(player.EVENT.ON_PLAY, () => pausedTimeshiftUpdater.clear());
  }

  private configureSmoothPlaybackPositionUpdater(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    /*
     * Playback position update
     *
     * We do not update the position directly from the ON_TIME_CHANGED event, because it arrives very jittery and
     * results in a jittery position indicator since the CSS transition time is statically set.
     * To work around this issue, we maintain a local playback position that is updated in a stable regular interval
     * and kept in sync with the player.
     */
    let currentTimeSeekBar = 0;
    let currentTimePlayer = 0;
    let updateIntervalMs = 50;
    let currentTimeUpdateDeltaSecs = updateIntervalMs / 1000;

    this.smoothPlaybackPositionUpdater = new Timeout(updateIntervalMs, () => {
      currentTimeSeekBar += currentTimeUpdateDeltaSecs;
      currentTimePlayer = player.getCurrentTime();

      // Sync currentTime of seekbar to player
      let currentTimeDelta = currentTimeSeekBar - currentTimePlayer;
      // If the delta is larger that 2 secs, directly jump the seekbar to the
      // player time instead of smoothly fast forwarding/rewinding.
      if (Math.abs(currentTimeDelta) > 2) {
        currentTimeSeekBar = currentTimePlayer;
      }
      // If currentTimeDelta is negative and below the adjustment threshold,
      // the player is ahead of the seekbar and we 'fast forward' the seekbar
      else if (currentTimeDelta <= -currentTimeUpdateDeltaSecs) {
        currentTimeSeekBar += currentTimeUpdateDeltaSecs;
      }
      // If currentTimeDelta is positive and above the adjustment threshold,
      // the player is behind the seekbar and we 'rewind' the seekbar
      else if (currentTimeDelta >= currentTimeUpdateDeltaSecs) {
        currentTimeSeekBar -= currentTimeUpdateDeltaSecs;
      }

      let playbackPositionPercentage = 100 / player.getDuration() * currentTimeSeekBar;
      this.setPlaybackPosition(playbackPositionPercentage);
    }, true);

    let startSmoothPlaybackPositionUpdater = () => {
      if (!player.isLive()) {
        currentTimeSeekBar = player.getCurrentTime();
        this.smoothPlaybackPositionUpdater.start();
      }
    };

    let stopSmoothPlaybackPositionUpdater = () => {
      this.smoothPlaybackPositionUpdater.clear();
    };

    player.addEventHandler(player.EVENT.ON_PLAY, startSmoothPlaybackPositionUpdater);
    player.addEventHandler(player.EVENT.ON_CAST_PLAYING, startSmoothPlaybackPositionUpdater);
    player.addEventHandler(player.EVENT.ON_PAUSED, stopSmoothPlaybackPositionUpdater);
    player.addEventHandler(player.EVENT.ON_CAST_PAUSED, stopSmoothPlaybackPositionUpdater);
    player.addEventHandler(player.EVENT.ON_PLAYBACK_FINISHED, stopSmoothPlaybackPositionUpdater);
    player.addEventHandler(player.EVENT.ON_SEEKED, () => {
      currentTimeSeekBar = player.getCurrentTime();
    });

    if (player.isPlaying()) {
      startSmoothPlaybackPositionUpdater();
    }
  }

  private configureMarkers(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    let clearMarkers = () => {
      this.timelineMarkers = [];
      this.updateMarkers();
    };

    let setupMarkers = () => {
      clearMarkers();

      let hasMarkersInUiConfig = uimanager.getConfig().metadata && uimanager.getConfig().metadata.markers
        && uimanager.getConfig().metadata.markers.length > 0;
      let hasMarkersInPlayerConfig = player.getConfig().source && player.getConfig().source.markers
        && player.getConfig().source.markers.length > 0;

      // Take markers from the UI config. If no markers defined, try to take them from the player's source config.
      let markers = hasMarkersInUiConfig ? uimanager.getConfig().metadata.markers :
        hasMarkersInPlayerConfig ? player.getConfig().source.markers : null;

      // Generate timeline markers from the config if we have markers and if we have a duration
      // The duration check is for buggy platforms where the duration is not available instantly (Chrome on Android 4.3)
      if (markers && player.getDuration() !== Infinity) {
        let duration = player.getDuration();
        for (let o of markers) {
          if (o.time <= duration) {
            let marker = {
              avatar: o.avatar,
              text: o.text || o.comment || '',
              markerType: o.markerType || 'default',
              originalData: o,
              time: o.time,
              timePercentage: 100 / duration * o.time, // convert time to percentage
              title: o.title,
            };
            this.timelineMarkers.push(marker);
          }
        }
      }

      // Populate the timeline with the markers
      this.updateMarkers();
    };

    // Add markers when a source is loaded
    player.addEventHandler(player.EVENT.ON_READY, setupMarkers);
    // Remove markers when unloaded
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, clearMarkers);

    // Init markers at startup
    setupMarkers();
  }

  release(): void {
    super.release();

    if (this.smoothPlaybackPositionUpdater) { // object must not necessarily exist, e.g. in volume slider subclass
      this.smoothPlaybackPositionUpdater.clear();
    }
  }

  protected toDomElement(): DOM {
    if (this.config.vertical) {
      this.config.cssClasses.push('vertical');
    }

    let seekBarContainer = new DOM('div', {
      'id': this.config.id,
      'class': this.getCssClasses(),
    });

    let seekBar = new DOM('div', {
      'class': this.prefixCss('seekbar'),
    });
    this.seekBar = seekBar;

    // Indicator that shows the buffer fill level
    let seekBarBufferLevel = new DOM('div', {
      'class': this.prefixCss('seekbar-bufferlevel'),
    });
    this.seekBarBufferPosition = seekBarBufferLevel;

    // Indicator that shows the current playback position
    let seekBarPlaybackPosition = new DOM('div', {
      'class': this.prefixCss('seekbar-playbackposition'),
    });
    this.seekBarPlaybackPosition = seekBarPlaybackPosition;

    // A marker of the current playback position, e.g. a dot or line
    let seekBarPlaybackPositionMarker = new DOM('div', {
      'class': this.prefixCss('seekbar-playbackposition-marker'),
    });
    this.seekBarPlaybackPositionMarker = seekBarPlaybackPositionMarker;

    // Indicator that show where a seek will go to
    let seekBarSeekPosition = new DOM('div', {
      'class': this.prefixCss('seekbar-seekposition'),
    });
    this.seekBarSeekPosition = seekBarSeekPosition;

    // Indicator that shows the full seekbar
    let seekBarBackdrop = new DOM('div', {
      'class': this.prefixCss('seekbar-backdrop'),
    });
    this.seekBarBackdrop = seekBarBackdrop;

    let seekBarChapterMarkersContainer = new DOM('div', {
      'class': this.prefixCss('seekbar-markers'),
    });
    this.seekBarMarkersContainer = seekBarChapterMarkersContainer;

    seekBar.append(this.seekBarBackdrop, this.seekBarBufferPosition, this.seekBarPlaybackPosition,
      this.seekBarSeekPosition, this.seekBarMarkersContainer, this.seekBarPlaybackPositionMarker);

    let seeking = false;

    // Define handler functions so we can attach/remove them later
    let mouseTouchMoveHandler = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      // Avoid propagation to VR handler
      e.stopPropagation();

      let targetPercentage = 100 * this.getOffset(e);
      seekBar.dispatchSmashcutPlayerUiEvent({
        action: 'seeking-change',
        e,
        position: targetPercentage,
        originator: 'SeekBar',
      });
      this.setSeekPosition(targetPercentage);
      this.setPlaybackPosition(targetPercentage);
      this.onSeekPreviewEvent(targetPercentage, true);
    };
    let mouseTouchUpHandler = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      // Remove handlers, seek operation is finished
      new DOM(document).off('touchmove mousemove', mouseTouchMoveHandler);
      new DOM(document).off('touchend mouseup', mouseTouchUpHandler);

      let targetPercentage = 100 * this.getOffset(e);
      let snappedMarker = this.getMarkerAtPosition(targetPercentage);

      seekBar.dispatchSmashcutPlayerUiEvent({
        action: 'seeking-end',
        e,
        position: targetPercentage,
        originator: 'SeekBar',
      });

      if (snappedMarker) {
        seekBar.dispatchSmashcutPlayerUiEvent({
          action: 'marker-click',
          e,
          marker: snappedMarker,
        });

        if (snappedMarker.markerType === 'note') {
          this.snappedMarker = null;
          this.hideLabel();
        }
      }

      this.setSeeking(false);
      seeking = false;

      // Fire seeked event
      this.onSeekedEvent(snappedMarker ? snappedMarker.timePercentage : targetPercentage);
    };

    // A seek always start with a touchstart or mousedown directly on the seekbar.
    // To track a mouse seek also outside the seekbar (for touch events this works automatically),
    // so the user does not need to take care that the mouse always stays on the seekbar, we attach the mousemove
    // and mouseup handlers to the whole document. A seek is triggered when the user lifts the mouse key.
    // A seek mouse gesture is thus basically a click with a long time frame between down and up events.
    seekBar.on('touchstart mousedown', (e: MouseEvent | TouchEvent) => {
      let isTouchEvent = this.touchSupported && e instanceof TouchEvent;

      // Prevent selection of DOM elements (also prevents mousedown if current event is touchstart)
      e.preventDefault();
      // Avoid propagation to VR handler
      e.stopPropagation();

      seekBar.dispatchSmashcutPlayerUiEvent({action: 'seeking-start', e, originator: 'SeekBar'});

      this.setSeeking(true); // Set seeking class on DOM element
      seeking = true; // Set seek tracking flag

      // Fire seeked event
      this.onSeekEvent();

      // Add handler to track the seek operation over the whole document
      new DOM(document).on(isTouchEvent ? 'touchmove' : 'mousemove', mouseTouchMoveHandler);
      new DOM(document).on(isTouchEvent ? 'touchend' : 'mouseup', mouseTouchUpHandler);
    });

    // Display seek target indicator when mouse hovers or finger slides over seekbar
    seekBar.on('touchmove mousemove', (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      let isOverMarker = false;

      if (e.target instanceof Element && (e.target as Element).className.indexOf('seekbar-markers') === -1) {
        isOverMarker = true;
      }

      if (seeking) {
        // During a seek (when mouse is down or touch move active), we need to stop propagation to avoid
        // the VR viewport reacting to the moves.
        e.stopPropagation();
        // Because the stopped propagation inhibits the event on the document, we need to call it from here
        mouseTouchMoveHandler(e);
      }

      let position = 100 * this.getOffset(e);

      const snappedMarker = this.getMarkerAtPosition(position);

      if (!isOverMarker) {
        this.setSeekPosition(position);
      }

      this.onSeekPreviewEvent(position, false, isOverMarker);

      if (snappedMarker && snappedMarker.markerType === 'note') {
        this.getShowSuggestionsButton().configWithoutArgs({
          currentMarker: snappedMarker,
        });

        this.showSuggestionsButton();
      }

      if (!snappedMarker) {
        this.hideSuggestionsButton();
      }

      this.showLabel();
      this.hideSuggestionsButton();

      if (isOverMarker && snappedMarker) {
        const markerEl = this.seekBarMarkersContainer.find(`[data-marker-time="${snappedMarker.time}"]`);

        this.removeBiggerMarkers();
        markerEl.addClass('bigger');

        this.showLabel();
        this.getLabel().setSmashcutData(snappedMarker);
        this.getLabel().setTimeText(null);
        this.getLabel().setThumbnail(null, 180);
      }
    });

    // Hide seek target indicator when mouse or finger leaves seekbar
    seekBar.on('touchend mouseleave', (e: MouseEvent | TouchEvent) => {
      const label = this.getLabel();

      e.preventDefault();

      if (label) {
        this.setSeekPosition(0);
        this.snappedMarker = null;

        if (label.getCurrentMarker() && label.getIsOverMarker()) {
          setTimeout(() => {
            if (!this.labelIsHovered()) {
              this.hideLabel();
            }
          }, 200);
        } else {
          this.hideLabel();
        }

        this.removeBiggerMarkers();
      }
    });

    seekBarContainer.append(seekBar);

    if (this.label) {
      seekBarContainer.append(this.label.getDomElement());
    }

    return seekBarContainer;
  }

  protected updateMarkers(): void {
    this.seekBarMarkersContainer.empty();

    if (!this._commentsOn) {
      return;
    }

    for (let marker of this.timelineMarkers) {
      let className = this.prefixCss('seekbar-marker-type-' + marker.markerType);

      let markerDom = new DOM('div', {
        'class': className,
        'data-marker-time': String(marker.time),
        'data-marker-title': String(marker.title),
      }).css({
        'left': `${marker.timePercentage}%`,
      });
      this.seekBarMarkersContainer.append(markerDom);
    }
  }

  protected getMarkerAtPosition(percentage: number): TimelineMarker | null {
    let snappedMarker: TimelineMarker = null;
    // Current position of the player
    const position = (percentage / 100 * this.player.getDuration());

    if (this.timelineMarkers.length > 0) {
      // 3.5 seconds to the left or right of the marker
      const snappingRange = 3.5;
      const snappedMarkers = this.timelineMarkers.filter(marker =>
        position >= (marker.time - snappingRange) &&
        position <= (marker.time + snappingRange)
      );

      if (snappedMarkers.length > 0) {
        snappedMarker = snappedMarkers.pop();

        for (const marker of snappedMarkers) {
          if (
            Math.abs(marker.time - position) <
            Math.abs(snappedMarker.time - position)
          ) {
            snappedMarker = marker;
          }
        }
      }
    }

    return snappedMarker;
  }

  /**
   * Gets the horizontal offset of a mouse/touch event point from the left edge of the seek bar.
   * @param eventPageX the pageX coordinate of an event to calculate the offset from
   * @returns {number} a number in the range of [0, 1], where 0 is the left edge and 1 is the right edge
   */
  private getHorizontalOffset(eventPageX: number): number {
    let elementOffsetPx = this.seekBar.offset().left;
    let widthPx = this.seekBar.width();
    let offsetPx = eventPageX - elementOffsetPx;
    let offset = 1 / widthPx * offsetPx;

    return this.sanitizeOffset(offset);
  }

  /**
   * Gets the vertical offset of a mouse/touch event point from the bottom edge of the seek bar.
   * @param eventPageY the pageX coordinate of an event to calculate the offset from
   * @returns {number} a number in the range of [0, 1], where 0 is the bottom edge and 1 is the top edge
   */
  private getVerticalOffset(eventPageY: number): number {
    let elementOffsetPx = this.seekBar.offset().top;
    let widthPx = this.seekBar.height();
    let offsetPx = eventPageY - elementOffsetPx;
    let offset = 1 / widthPx * offsetPx;

    return 1 - this.sanitizeOffset(offset);
  }

  /**
   * Gets the mouse or touch event offset for the current configuration (horizontal or vertical).
   * @param e the event to calculate the offset from
   * @returns {number} a number in the range of [0, 1]
   * @see #getHorizontalOffset
   * @see #getVerticalOffset
   */
  private getOffset(e: MouseEvent | TouchEvent): number {
    if (this.touchSupported && e instanceof TouchEvent) {
      if (this.config.vertical) {
        return this.getVerticalOffset(e.type === 'touchend' ? e.changedTouches[0].pageY : e.touches[0].pageY);
      } else {
        return this.getHorizontalOffset(e.type === 'touchend' ? e.changedTouches[0].pageX : e.touches[0].pageX);
      }
    }
    else if (e instanceof MouseEvent) {
      if (this.config.vertical) {
        return this.getVerticalOffset(e.pageY);
      } else {
        return this.getHorizontalOffset(e.pageX);
      }
    }
    else {
      if (console) {
        console.warn('invalid event');
      }
      return 0;
    }
  }

  /**
   * Sanitizes the mouse offset to the range of [0, 1].
   *
   * When tracking the mouse outside the seek bar, the offset can be outside the desired range and this method
   * limits it to the desired range. E.g. a mouse event left of the left edge of a seek bar yields an offset below
   * zero, but to display the seek target on the seek bar, we need to limit it to zero.
   *
   * @param offset the offset to sanitize
   * @returns {number} the sanitized offset.
   */
  private sanitizeOffset(offset: number) {
    // Since we track mouse moves over the whole document, the target can be outside the seek range,
    // and we need to limit it to the [0, 1] range.
    if (offset < 0) {
      offset = 0;
    } else if (offset > 1) {
      offset = 1;
    }

    return offset;
  }

  /**
   * Sets the position of the playback position indicator.
   * @param percent a number between 0 and 100 as returned by the player
   * @param volume - if true that means that the function is called from the volume slider
   */
  setPlaybackPosition(percent: number, volume: boolean = false) {
    this.playbackPositionPercentage = percent;

    // Set position of the bar
    this.setPosition(this.seekBarPlaybackPosition, percent, volume);

    // Set position of the marker
    let totalSize = (this.config.vertical ? (this.seekBar.height() - this.seekBarPlaybackPositionMarker.height()) : this.seekBar.width());
    let px = (totalSize) / 100 * percent;
    if (this.config.vertical) {
      px = this.seekBar.height() - px - this.seekBarPlaybackPositionMarker.height();
    }
    let style = this.config.vertical ?
      // -ms-transform required for IE9
      {'transform': 'translateY(' + px + 'px)', '-ms-transform': 'translateY(' + px + 'px)'} :
      {'transform': 'translateX(' + px + 'px)', '-ms-transform': 'translateX(' + px + 'px)'};
    this.seekBarPlaybackPositionMarker.css(style);
  }

  /**
   * Refreshes the playback position. Can be used by subclasses to refresh the position when
   * the size of the component changes.
   */
  protected refreshPlaybackPosition(volume: boolean = false) {
    this.setPlaybackPosition(this.playbackPositionPercentage, volume);
  }

  /**
   * Sets the position until which media is buffered.
   * @param percent a number between 0 and 100
   * @param volume - if true that means that the function is called from the volume slider
   */
  setBufferPosition(percent: number, volume: boolean = false) {
    this.setPosition(this.seekBarBufferPosition, percent, volume);
  }

  /**
   * Sets the position where a seek, if executed, would jump to.
   * @param percent a number between 0 and 100
   */
  setSeekPosition(percent: number) {
    this.setPosition(this.seekBarSeekPosition, percent);
  }

  /**
   * Set the actual position (width or height) of a DOM element that represent a bar in the seek bar.
   * @param element the element to set the position for
   * @param percent a number between 0 and 100
   * @param volume - if true that means that the function is called from the volume slider
   */
  private setPosition(element: DOM, percent: number, volume: boolean = false) {
    const vertical = this.config.vertical;
    let scale = percent / 100 * (vertical ? this.seekBar.height() : this.seekBar.width());
    let style = vertical ?
      {'height': `${scale}px`} :
      {'width': `${scale}px`};

    scale = Math.min(100, Math.max(0, percent)) / 100;

    let volumeStyle = vertical ?
      // -ms-transform required for IE9
      { 'transform': 'scaleY(' + scale + ')', '-ms-transform': 'scaleY(' + scale + ')' } :
      { 'transform': 'scaleX(' + scale + ')', '-ms-transform': 'scaleX(' + scale + ')' };

    element.css(volume ? volumeStyle : style);
  }

  /**
   * Puts the seek bar into or out of seeking state by adding/removing a class to the DOM element. This can be used
   * to adjust the styling while seeking.
   *
   * @param seeking should be true when entering seek state, false when exiting the seek state
   */
  setSeeking(seeking: boolean) {
    if (seeking) {
      this.getDomElement().addClass(this.prefixCss(SeekBar.CLASS_SEEKING));
    } else {
      this.getDomElement().removeClass(this.prefixCss(SeekBar.CLASS_SEEKING));
    }
  }

  /**
   * Checks if the seek bar is currently in the seek state.
   * @returns {boolean} true if in seek state, else false
   */
  isSeeking(): boolean {
    return this.getDomElement().hasClass(this.prefixCss(SeekBar.CLASS_SEEKING));
  }

  /**
   * Checks if the seek bar has a {@link SeekBarLabel}.
   * @returns {boolean} true if the seek bar has a label, else false
   */
  hasLabel(): boolean {
    return this.label != null;
  }

  /**
   * Gets the label of this seek bar.
   * @returns {SeekBarLabel} the label if this seek bar has a label, else null
   */
  getLabel(): SeekBarLabel | null {
    return this.label;
  }

  /**
   * Gets the label of this seek bar.
   * @returns number
   */
  getLabelWidth(): string {
    return this.label ? this.label.getDomElement().css('width') : '0px';
  }

  /**
   * Returns the hovered status of the label
   * @returns {boolean}
   */
  labelIsHovered(): boolean {
    return this.hasLabel() && this.getLabel().isHovered();
  }

  /**
   * Shows the label.
   */
  showLabel() {
    if (this.hasLabel() && this.getLabel().isHidden()) {
      this.getLabel().show();
    }
  }

  /**
   * Hides the label.
   */
  hideLabel() {
    if (this.hasLabel() && this.getLabel().isShown()) {
      this.getLabel().hide();
    }
  }

  /**
   * Check if the view has a {@link ShowSuggestionsButton}
   * @returns {boolean}
   */
  hasShowSuggestionButton(): boolean {
    return !!this.showSuggestionButton;
  }

  /**
   * Gets the show suggestions button.
   * @returns {ShowSuggestionsButton}
   */
  getShowSuggestionsButton(): ShowSuggestionsButton {
    return this.showSuggestionButton;
  }

  /**
   * Shows the suggestions button.
   */
  showSuggestionsButton() {
    if (this.hasShowSuggestionButton() && this.getShowSuggestionsButton().isHidden()) {
      this.getShowSuggestionsButton().show();
    }
  }

  /**
   * Hides the suggestions button.
   */
  hideSuggestionsButton() {
    if (this.hasShowSuggestionButton() && this.getShowSuggestionsButton().isShown()) {
      this.getShowSuggestionsButton().hide();
    }
  }

  protected onSeekEvent() {
    this.seekBarEvents.onSeek.dispatch(this);
  }

  protected removeBiggerMarkers() {
    const markers = this.seekBarMarkersContainer.find('[data-marker-time]');

    markers.removeClass('bigger');
  }

  protected onSeekPreviewEvent(percentage: number, scrubbing: boolean, isOverMarker: boolean = false) {
    const parentWidth = parseFloat(this.getDomElement().css('width'));
    const labelWidth = parseFloat(this.getLabelWidth());

    /**
     * The left margin is just the percentage of (15% of the labelWidth) from the parentWidth
     * @type {number}
     */
    const leftMargin = (labelWidth * 0.15) * 100 / parentWidth;
    /**
     * The right margin is the percentage of (85% of the labelWidth) since we have
     * a left: -15% on the container
     * @type {number}
     */
    const rightMargin = 100 - ((labelWidth * 0.85) * 100 / parentWidth);

    const isBetweenMargins = percentage > leftMargin && percentage < rightMargin;
    /**
     * We use this variable to set the thumbnail position
     * @type {number}
     */
    const thumbnailPercentage = !isBetweenMargins
      ? (percentage <= leftMargin ? leftMargin : rightMargin)
      : percentage;

    let snappedMarker = this.getMarkerAtPosition(percentage);
    this.snappedMarker = snappedMarker;

    const holdSnappedPosition = isOverMarker && snappedMarker;

    if (this.label) {
      this.label.getDomElement().css({
        'left': (holdSnappedPosition ? snappedMarker.timePercentage : thumbnailPercentage) + '%',
      });
    }

    let arrowPosition = 15;

    if (!isBetweenMargins && labelWidth && !holdSnappedPosition) {
      let seekPositionInPx = percentage / 100 * parentWidth;
      let extraLeft = 1;

      if (percentage >= rightMargin) {
        seekPositionInPx = parentWidth - seekPositionInPx;
        extraLeft = -3;
      }

      arrowPosition = (seekPositionInPx + extraLeft) * 100 / labelWidth;

      if (percentage >= rightMargin) {
        arrowPosition = 100 - arrowPosition;
      }
    }

    if (this.label) {
      this.label.getArrow().getDomElement().css({
        'left': arrowPosition + '%',
      });
    }

    this.seekBarEvents.onSeekPreview.dispatch(this, {
      scrubbing: scrubbing,
      position: percentage,
      marker: snappedMarker,
      isOverMarker: isOverMarker,
    });
  }

  protected onSeekedEvent(percentage: number) {
    this.seekBarEvents.onSeeked.dispatch(this, percentage);
  }

  /**
   * Gets the event that is fired when a scrubbing seek operation is started.
   * @returns {Event<SeekBar, NoArgs>}
   */
  get onSeek(): Event<SeekBar, NoArgs> {
    return this.seekBarEvents.onSeek.getEvent();
  }

  /**
   * Gets the event that is fired during a scrubbing seek (to indicate that the seek preview, i.e. the video frame,
   * should be updated), or during a normal seek preview when the seek bar is hovered (and the seek target,
   * i.e. the seek bar label, should be updated).
   * @returns {Event<SeekBar, SeekPreviewEventArgs>}
   */
  get onSeekPreview(): Event<SeekBar, SeekPreviewEventArgs> {
    return this.seekBarEvents.onSeekPreview.getEvent();
  }

  /**
   * Gets the event that is fired when a scrubbing seek has finished or when a direct seek is issued.
   * @returns {Event<SeekBar, number>}
   */
  get onSeeked(): Event<SeekBar, number> {
    return this.seekBarEvents.onSeeked.getEvent();
  }

  protected onChangeCommentsOnEvent(on: boolean) {
    this.seekBarEvents.onChangeCommentsOn.dispatch(this, on);
  }

  get onChangeCommentsOn(): Event<SeekBar, boolean> {
    return this.seekBarEvents.onChangeCommentsOn.getEvent();
  }

  toggleCommentsOn(): void {
    this._commentsOn = !this._commentsOn;
    this.onChangeCommentsOnEvent(this._commentsOn);
    this.updateMarkers();
  }

  get commentsOn(): boolean {
    return this._commentsOn;
  }

  protected onShowEvent(): void {
    super.onShowEvent();

    // Refresh the position of the playback position when the seek bar becomes visible. To correctly set the position,
    // the DOM element must be fully initialized an have its size calculated, because the position is set as an absolute
    // value calculated from the size. This required size is not known when it is hidden.
    // For such cases, we refresh the position here in onShow because here it is guaranteed that the component knows
    // its size and can set the position correctly.
    this.refreshPlaybackPosition();
  }
}
