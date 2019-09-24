import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';
import {SubtitleOverlay} from './subtitleoverlay';

/**
 * Configuration interface for the {@link ClosedCaptioningToggleButton}.
 */
export interface ClosedCaptioningToggleButtonConfig extends ToggleButtonConfig {
  subtitleOverlay?: SubtitleOverlay;
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

    const subtitleOverlay = (<ClosedCaptioningToggleButtonConfig> this.config).subtitleOverlay;
    const config = <ToggleButtonConfig>this.getConfig();

    this.onClick.subscribe(() => {
      // console.log('closed captioning button clicked');
      subtitleOverlay.toggleSubtitlesOn();
    });

    let updateOnOff = () => {
      if (subtitleOverlay.subtitlesOn) {
        this.on();
      } else {
        this.off();
      }
      config && config.tooltip && config.tooltip.updateText(`Closed Captions ${this.isOff() ? 'On' : 'Off'}`);
    };

    subtitleOverlay.onChangeSubtitlesOn.subscribe((e, on) => {
      updateOnOff();
    });

    updateOnOff();

    this.getDomElement().on('mouseover', (e) => {
      const target = e.target as HTMLTextAreaElement;
      const left = target.offsetLeft - target.offsetWidth - 24;
      const top = target.offsetTop;
      config && config.tooltip && config.tooltip.setText(`Closed captions ${this.isOff() ? 'On' : 'Off'}`, left, top, false);
    });

    this.getDomElement().on('mouseleave', () => {
      config && config.tooltip && config.tooltip.setText('', 0, 0, false);
    });

  }
}