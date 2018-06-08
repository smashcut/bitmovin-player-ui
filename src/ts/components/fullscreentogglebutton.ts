import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {UIInstanceManager} from '../uimanager';

/**
 * A button that toggles the player between windowed and fullscreen view.
 */
export class FullscreenToggleButton extends ToggleButton<ToggleButtonConfig> {

  constructor(config: ToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-fullscreentogglebutton',
      text: 'Fullscreen',
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // TODO: Commenting this since we don't need to hide the control bar right now
    /*let fullscreenStateHandler = () => {
      if (player.isFullscreen()) {
        this.on();
      } else {
        this.off();
      }
    };

    player.addEventHandler(player.EVENT.ON_FULLSCREEN_ENTER, fullscreenStateHandler);
    player.addEventHandler(player.EVENT.ON_FULLSCREEN_EXIT, fullscreenStateHandler);
    // Startup init
    fullscreenStateHandler();
    */

    this.onClick.subscribe(() => {
      if (player.isFullscreen()) {
        player.exitFullscreen();
      } else {
        player.enterFullscreen();
      }
    });
  }
}