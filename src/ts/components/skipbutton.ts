import {UIInstanceManager} from '../uimanager';
import PlayerEvent = bitmovin.PlayerAPI.PlayerEvent;
import {PlayerUtils} from '../playerutils';
import TimeShiftAvailabilityChangedArgs = PlayerUtils.TimeShiftAvailabilityChangedArgs;
import {Button, ButtonConfig} from './button';
import {ToggleButton} from './togglebutton';

/**
 * Configuration interface for a toggle button component.
 */
export interface SkipButtonConfig extends ButtonConfig {
  /**
   * How much time and in which direction to skip
   */
  duration?: number;
}

/**
 * A button skips the video for [duration] seconds.
 */
export class SkipButton extends Button<SkipButtonConfig> {

  private static readonly CLASS_DISABLED = 'disabled';

  constructor(config: SkipButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: config.duration > 0 ? 'ui-skipbutton-forward' : 'ui-skipbutton-backward',
      text: 'Skip',
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let isSeeking = false;

    // Control player by button events
    // When a button event triggers a player API call,
    // events are fired which in turn call the event handler
    // above that updated the button state.
    this.onClick.subscribe(e => {
      if (isSeeking) {
        return;
      }
      let currentTime = player.getCurrentTime();
      let duration = player.getDuration();
      let nextTime = Math.min(duration, Math.max(0, currentTime + (<SkipButtonConfig>this.config).duration));

      if (nextTime !== currentTime) {
        player.seek(nextTime);
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

    player.addEventHandler(player.EVENT.ON_TIME_CHANGED, playbackTimeHandler);
    player.addEventHandler(player.EVENT.ON_SEEKED, playbackTimeHandler);
    player.addEventHandler(player.EVENT.ON_CAST_TIME_UPDATED, playbackTimeHandler);

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
      this.getDomElement().addClass(this.prefixCss(SkipButton.CLASS_DISABLED));
    } else {
      this.getDomElement().removeClass(this.prefixCss(SkipButton.CLASS_DISABLED));
    }
  }

}