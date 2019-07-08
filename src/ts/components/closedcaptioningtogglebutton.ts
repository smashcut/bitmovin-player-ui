import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';

/**
 * Configuration interface for the {@link ClosedCaptioningToggleButton}.
 */
export interface ClosedCaptioningToggleButtonConfig extends ToggleButtonConfig {

}

/**
 * A button that toggles visibility of a embedVideo panel.
 */
export class ClosedCaptioningToggleButton extends ToggleButton<ClosedCaptioningToggleButtonConfig> {

  constructor(config: ClosedCaptioningToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-closedcaptioning-togglebutton',
      text: 'Closed Captioning',
    }, <ClosedCaptioningToggleButtonConfig>this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      console.log('closed captioning button clicked');
    });

    const config = <ToggleButtonConfig>this.getConfig();

    this.getDomElement().on('mouseover', (e) => {
      const target = e.target as HTMLTextAreaElement;
      const left = target.offsetLeft - target.offsetWidth - 24;
      const top = target.offsetTop;
      config && config.tooltip && config.tooltip.setText('Closed captions', left, top, false);
    });

    this.getDomElement().on('mouseleave', () => {
      config && config.tooltip && config.tooltip.setText('', 0, 0, false);
    });

  }
}