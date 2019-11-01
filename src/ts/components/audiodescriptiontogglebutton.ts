import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {UIInstanceManager} from '../uimanager';

export class AudioDescriptionToggleButton extends ToggleButton<ToggleButtonConfig> {

  constructor(config: ToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-audiodescription-togglebutton',
      text: 'Audio Description',
    }, <ToggleButtonConfig>this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    const config = <ToggleButtonConfig>this.getConfig();

    this.onClick.subscribe(() => {
      this.isOff() ? this.on() : this.off();
      this.getDomElement().dispatchSmashcutPlayerUiEvent({
        action: 'toggle-audio-description',
        originator: 'AudioDescriptionToggleButton',
        isOn: this.isOn(),
      });
      config && config.tooltip && config.tooltip.updateText(`Audio Description ${this.isOff() ? 'On' : 'Off'}`);
    });

    this.getDomElement().on('mouseover', (e) => {
      const target = e.target as HTMLTextAreaElement;
      const left = target.offsetLeft - target.offsetWidth - 24;
      const top = target.offsetTop;
      config && config.tooltip && config.tooltip.setText(`Audio Description ${this.isOff() ? 'On' : 'Off'}`, left, top, false);
    });

    this.getDomElement().on('mouseleave', () => {
      config && config.tooltip && config.tooltip.setText('', 0, 0, false);
    });

    this.off();

  }
}