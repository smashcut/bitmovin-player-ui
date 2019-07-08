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

    this.onClick.subscribe(() => {
      if (player.isFullscreen()) {
        player.exitFullscreen();
      } else {
        player.enterFullscreen();
      }
    });

    const config = <ToggleButtonConfig>this.getConfig();
    
    this.getDomElement().on('mouseover', (e) => {
      const target = e.target as HTMLTextAreaElement;
      const left = target.offsetLeft - target.offsetWidth - 53;
      const top = target.offsetTop;
      config && config.tooltip && config.tooltip.setText(player.isFullscreen() ? 'Exit full screen' : 'Full screen', left, top, true);
    });

    this.getDomElement().on('mouseleave', () => {
      config && config.tooltip && config.tooltip.setText('', 0, 0, false);
    });

  }
}