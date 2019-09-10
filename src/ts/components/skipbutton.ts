import { UIInstanceManager } from "../uimanager";
import { Button, ButtonConfig } from "./button";
import { Tooltip } from "./tooltip";
import { PlayerAPI } from "bitmovin-player";

/**
 * Configuration interface for a toggle button component.
 */
export interface SkipButtonConfig extends ButtonConfig {
  /**
   * How much time and in which direction to skip
   */
  duration?: number;
  text?: string;
}

/**
 * A button skips the video for [duration] seconds.
 */
export class SkipButton extends Button<SkipButtonConfig> {
  private static readonly CSS_CLASS_DISABLED = "disabled";

  constructor(config: SkipButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClass:
          config.duration > 0
            ? "ui-skipbutton-forward"
            : "ui-skipbutton-backward",
        text: "Skip"
      },
      this.config
    );
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let isSeeking = false;

    if (this.hasTooltip()) {
      const config = <SkipButtonConfig>this.getConfig();
      const tooltip = this.getTooltip();

      this.getDomElement().on("mouseleave", () => {
        tooltip.setText("", 0, 0, false);
      });

      this.getDomElement().on("mouseover", e => {
        const target = e.target as HTMLTextAreaElement;
        const left = target.offsetLeft - target.offsetWidth - 15;
        const top = target.offsetTop;
        tooltip.setText(
          config.duration > 0 ? "Forward 10s" : "Backward 10s",
          left,
          top,
          false
        );
      });
    }

    // Control player by button events
    // When a button event triggers a player API call,
    // events are fired which in turn call the event handler
    // above that updated the button state.
    this.onClick.subscribe(e => {
      if (isSeeking) {
        return;
      }
      let currentTime = player.getCurrentTime();
      if (
        currentTime <= 0.1 &&
        this.config.cssClass === "ui-skipbutton-backward"
      ) {
        return;
      }
      let duration = player.getDuration();
      let nextTime = Math.min(
        duration,
        Math.max(0, currentTime + (<SkipButtonConfig>this.config).duration)
      );

      if (nextTime !== currentTime) {
        player.seek(nextTime);
        this.getDomElement().dispatchSmashcutPlayerUiEvent({
          action: "seeking-end",
          e,
          position: (nextTime * 100) / duration,
          originator: "SkipButton"
        });
      }
    });

    let playbackTimeHandler = () => {
      let skipJumpDuration = (<SkipButtonConfig>this.config).duration;
      if (skipJumpDuration < 0) {
        this.setDisabled(player.getCurrentTime() <= 0);
      } else {
        this.setDisabled(player.getCurrentTime() >= player.getDuration());
      }
    };

    player.on(player.exports.PlayerEvent.TimeChanged, playbackTimeHandler);
    player.on(player.exports.PlayerEvent.Seeked, playbackTimeHandler);

    /* there seems to be no related event in v8 PlayerEvent
    player.on(
      player.EVENT.ON_CAST_TIME_UPDATED,
      playbackTimeHandler
    );
    */

    // Track UI seeking status
    uimanager.onSeek.subscribe(() => {
      isSeeking = true;
    });
    uimanager.onSeeked.subscribe(() => {
      isSeeking = false;
    });

    playbackTimeHandler();
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.getDomElement().addClass(
        this.prefixCss(SkipButton.CSS_CLASS_DISABLED)
      );
    } else {
      this.getDomElement().removeClass(
        this.prefixCss(SkipButton.CSS_CLASS_DISABLED)
      );
    }
  }
}
