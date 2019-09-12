import { ToggleButton, ToggleButtonConfig } from "./togglebutton";
import { UIInstanceManager } from "../uimanager";
import { PlayerUtils } from "../playerutils";
import TimeShiftAvailabilityChangedArgs = PlayerUtils.TimeShiftAvailabilityChangedArgs;
import { PlayerAPI, WarningEvent } from "bitmovin-player";

/**
 * A button that toggles between playback and pause.
 */
export class PlaybackToggleButton extends ToggleButton<ToggleButtonConfig> {
  private static readonly CLASS_STOPTOGGLE = "stoptoggle";
  protected isPlayInitiated: boolean;

  constructor(config: ToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClass: "ui-playbacktogglebutton",
        text: "Play/Pause"
      },
      this.config
    );

    this.isPlayInitiated = false;
  }

  configure(
    player: PlayerAPI,
    uimanager: UIInstanceManager,
    handleClickEvent: boolean = true
  ): void {
    super.configure(player, uimanager);

    let isSeeking = false;

    const config = <ToggleButtonConfig>this.getConfig();

    this.getDomElement().on("mouseover", e => {
      if (player.isPlaying()) {
        config &&
          config.tooltip &&
          config.tooltip.setText("Pause", -14, 0, false);
      } else {
        config &&
          config.tooltip &&
          config.tooltip.setText("Play", -14, 0, false);
      }
    });

    this.getDomElement().on("mouseleave", () => {
      config && config.tooltip && config.tooltip.setText("", 0, 0, false);
    });

    // Handler to update button state based on player state
    let playbackStateHandler = () => {
      // If the UI is currently seeking, playback is temporarily stopped but the buttons should
      // not reflect that and stay as-is (e.g indicate playback while seeking).
      if (isSeeking) {
        return;
      }

      if (player.isPlaying() || this.isPlayInitiated) {
        this.on();
      } else {
        this.off();
      }
    };

    // Call handler upon these events
    player.on(player.exports.PlayerEvent.Play, e => {
      this.isPlayInitiated = true;
      playbackStateHandler();
    });

    player.on(player.exports.PlayerEvent.Paused, e => {
      this.isPlayInitiated = false;
      playbackStateHandler();
    });

    player.on(player.exports.PlayerEvent.Playing, e => {
      this.isPlayInitiated = false;
      playbackStateHandler();
    });
    // after unloading + loading a new source, the player might be in a different playing state (from playing into stopped)
    player.on(player.exports.PlayerEvent.SourceLoaded, playbackStateHandler);
    uimanager.getConfig().events.onUpdated.subscribe(playbackStateHandler);
    player.on(player.exports.PlayerEvent.SourceUnloaded, playbackStateHandler);
    // when playback finishes, player turns to paused mode
    player.on(
      player.exports.PlayerEvent.PlaybackFinished,
      playbackStateHandler
    );
    player.on(player.exports.PlayerEvent.CastStarted, playbackStateHandler);

    // When a playback attempt is rejected with warning 5008, we switch the button state back to off
    // This is required for blocked autoplay, because there is no Paused event in such case
    player.on(player.exports.PlayerEvent.Warning, (event: WarningEvent) => {
      if (
        event.code === player.exports.WarningCode.PLAYBACK_COULD_NOT_BE_STARTED
      ) {
        this.isPlayInitiated = false;
        this.off();
      }
    });

    // Detect absence of timeshifting on live streams and add tagging class to convert button icons to play/stop
    let timeShiftDetector = new PlayerUtils.TimeShiftAvailabilityDetector(
      player
    );
    timeShiftDetector.onTimeShiftAvailabilityChanged.subscribe(
      (sender, args: TimeShiftAvailabilityChangedArgs) => {
        if (!args.timeShiftAvailable) {
          this.getDomElement().addClass(
            this.prefixCss(PlaybackToggleButton.CLASS_STOPTOGGLE)
          );
        } else {
          this.getDomElement().removeClass(
            this.prefixCss(PlaybackToggleButton.CLASS_STOPTOGGLE)
          );
        }
      }
    );
    timeShiftDetector.detect(); // Initial detection

    if (handleClickEvent) {
      // Control player by button events
      // When a button event triggers a player API call, events are fired which in turn call the event handler
      // above that updated the button state.
      this.onClick.subscribe(e => {
        if (player.isPlaying() || this.isPlayInitiated) {
          this.getDomElement().dispatchSmashcutPlayerUiEvent({
            action: "pause",
            e,
            originator: "PlaybackToggleButton"
          });
          player.pause("ui");
        } else {
          this.getDomElement().dispatchSmashcutPlayerUiEvent({
            action: "play",
            e,
            originator: "PlaybackToggleButton"
          });
          player.play("ui");
        }
      });
    }

    // Track UI seeking status
    uimanager.onSeek.subscribe(() => {
      isSeeking = true;
    });
    uimanager.onSeeked.subscribe(() => {
      isSeeking = false;
    });

    // Startup init
    playbackStateHandler();
  }

  on() {
    super.on();
    this.setLabel("Pause");
  }

  off() {
    super.off();
    this.setLabel("Play");
  }
}
