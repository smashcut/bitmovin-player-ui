import {Event, EventDispatcher, NoArgs} from './eventdispatcher';
import {BrowserUtils} from './browserutils';

export namespace PlayerUtils {

  import PlayerAPI = bitmovin.PlayerAPI;

  export enum PlayerState {
    IDLE,
    PREPARED,
    PLAYING,
    PAUSED,
    FINISHED,
  }

  export function isSourceLoaded(player: bitmovin.PlayerAPI): boolean {
    return player.getConfig().source !== undefined;
  }

  export function isTimeShiftAvailable(player: bitmovin.PlayerAPI): boolean {
    return player.isLive() && player.getMaxTimeShift() !== 0;
  }

  export function getState(player: PlayerAPI): PlayerState {
    if (player.hasEnded()) {
      return PlayerState.FINISHED;
    } else if (player.isPlaying()) {
      return PlayerState.PLAYING;
    } else if (player.isPaused()) {
      return PlayerState.PAUSED;
    } else if (isSourceLoaded(player)) {
      return PlayerState.PREPARED;
    } else {
      return PlayerState.IDLE;
    }
  }

  export interface TimeShiftAvailabilityChangedArgs extends NoArgs {
    timeShiftAvailable: boolean;
  }

  export class TimeShiftAvailabilityDetector {

    private player: PlayerAPI;
    private timeShiftAvailable: boolean;
    private timeShiftAvailabilityChangedEvent = new EventDispatcher<PlayerAPI, TimeShiftAvailabilityChangedArgs>();

    constructor(player: PlayerAPI) {
      this.player = player;
      this.timeShiftAvailable = undefined;

      let timeShiftDetector = () => {
        this.detect();
      };
      // Try to detect timeshift availability in ON_READY, which works for DASH streams
      player.addEventHandler(player.EVENT.ON_READY, timeShiftDetector);
      // With HLS/NativePlayer streams, getMaxTimeShift can be 0 before the buffer fills, so we need to additionally
      // check timeshift availability in ON_TIME_CHANGED
      player.addEventHandler(player.EVENT.ON_TIME_CHANGED, timeShiftDetector);
    }

    detect(): void {
      if (this.player.isLive()) {
        let timeShiftAvailableNow = PlayerUtils.isTimeShiftAvailable(this.player);

        // When the availability changes, we fire the event
        if (timeShiftAvailableNow !== this.timeShiftAvailable) {
          this.timeShiftAvailabilityChangedEvent.dispatch(this.player, { timeShiftAvailable: timeShiftAvailableNow });
          this.timeShiftAvailable = timeShiftAvailableNow;
        }
      }
    }

    get onTimeShiftAvailabilityChanged(): Event<PlayerAPI, TimeShiftAvailabilityChangedArgs> {
      return this.timeShiftAvailabilityChangedEvent.getEvent();
    }
  }

  export interface LiveStreamDetectorEventArgs extends NoArgs {
    live: boolean;
  }

  /**
   * Detects changes of the stream type, i.e. changes of the return value of the player#isLive method.
   * Normally, a stream cannot change its type during playback, it's either VOD or live. Due to bugs on some
   * platforms or browsers, it can still change. It is therefore unreliable to just check #isLive and this detector
   * should be used as a workaround instead.
   *
   * Known cases:
   *
   * - HLS VOD on Android 4.3
   * Video duration is initially 'Infinity' and only gets available after playback starts, so streams are wrongly
   * reported as 'live' before playback (the live-check in the player checks for infinite duration).
   */
  export class LiveStreamDetector {

    private player: PlayerAPI;
    private live: boolean;
    private liveChangedEvent = new EventDispatcher<PlayerAPI, LiveStreamDetectorEventArgs>();

    constructor(player: PlayerAPI) {
      this.player = player;
      this.live = undefined;

      let liveDetector = () => {
        this.detect();
      };
      // Initialize when player is ready
      player.addEventHandler(player.EVENT.ON_READY, liveDetector);
      // Re-evaluate when playback starts
      player.addEventHandler(player.EVENT.ON_PLAY, liveDetector);

      // HLS live detection workaround for Android:
      // Also re-evaluate during playback, because that is when the live flag might change.
      // (Doing it only in Android Chrome saves unnecessary overhead on other plattforms)
      if (BrowserUtils.isAndroid && BrowserUtils.isChrome) {
        player.addEventHandler(player.EVENT.ON_TIME_CHANGED, liveDetector);
      }
    }

    detect(): void {
      let liveNow = this.player.isLive();

      // Compare current to previous live state flag and fire event when it changes. Since we initialize the flag
      // with undefined, there is always at least an initial event fired that tells listeners the live state.
      if (liveNow !== this.live) {
        this.liveChangedEvent.dispatch(this.player, { live: liveNow });
        this.live = liveNow;
      }
    }

    get onLiveChanged(): Event<PlayerAPI, LiveStreamDetectorEventArgs> {
      return this.liveChangedEvent.getEvent();
    }
  }
}