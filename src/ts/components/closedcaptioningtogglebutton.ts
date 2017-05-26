import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {UIInstanceManager} from '../uimanager';

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
      text: 'Closed Captioning'
    }, <ClosedCaptioningToggleButtonConfig>this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let config = <ClosedCaptioningToggleButtonConfig>this.getConfig(); // TODO fix generics type inference

    this.onClick.subscribe(() => {
      console.log('closed captioning button clicked')
    });
  }
}