import {UIInstanceManager} from '../uimanager';
import PlayerEvent = bitmovin.PlayerAPI.PlayerEvent;
import {PlayerUtils} from '../playerutils';
import TimeShiftAvailabilityChangedArgs = PlayerUtils.TimeShiftAvailabilityChangedArgs;
import {Button, ButtonConfig} from './button';

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

  private static readonly CLASS_LIVE_VIDEO = 'live-video';

  constructor(config: SkipButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      hidden: true,
      cssClass: config.duration > 0 ? 'ui-skipforwardbutton' : 'ui-skipbackwardsbutton',
      text: 'Skip',
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let isSeeking = false;

    // Detect absence of timeshifting on live streams and add tagging class to convert button icons
    let timeShiftDetector = new PlayerUtils.TimeShiftAvailabilityDetector(player);
    timeShiftDetector.onTimeShiftAvailabilityChanged.subscribe(
      (sender, args: TimeShiftAvailabilityChangedArgs) => {
        if (!args.timeShiftAvailable) {
          this.getDomElement().addClass(this.prefixCss(SkipButton.CLASS_LIVE_VIDEO));
        } else {
          this.getDomElement().removeClass(this.prefixCss(SkipButton.CLASS_LIVE_VIDEO));
        }
      }
    );
    timeShiftDetector.detect(); // Initial detection

    // Control player by button events
    // When a button event triggers a player API call, events are fired which in turn call the event handler
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

    // Track UI seeking status
    uimanager.onSeek.subscribe(() => {
      isSeeking = true;
    });
    uimanager.onSeeked.subscribe(() => {
      isSeeking = false;
    });

    uimanager.onControlsShow.subscribe(() => {
      this.show();
    });
    uimanager.onControlsHide.subscribe(() => {
      this.hide();
    });
  }
}