import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {EmbedVideoPanel} from './embedvideopanel';
import {UIInstanceManager} from '../uimanager';

/**
 * Configuration interface for the {@link EmbedVideoToggleButton}.
 */
export interface EmbedVideoToggleButtonConfig extends ToggleButtonConfig {
  /**
   * The embedVideo panel whose visibility the button should toggle.
   */
  embedVideoPanel: EmbedVideoPanel;
}

/**
 * A button that toggles visibility of a embedVideo panel.
 */
export class EmbedVideoToggleButton extends ToggleButton<EmbedVideoToggleButtonConfig> {

  constructor(config: EmbedVideoToggleButtonConfig) {
    super(config);

    if (!config.embedVideoPanel) {
      throw new Error('Required EmbedVideoPanel is missing');
    }

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-embedvideo-togglebutton',
      text: 'Embed Video',
      embedVideoPanel: null
    }, <EmbedVideoToggleButtonConfig>this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let config = <EmbedVideoToggleButtonConfig>this.getConfig(); // TODO fix generics type inference
    let embedVideoPanel = config.embedVideoPanel;

    this.onClick.subscribe(() => {
      console.log('onClick hidden:', embedVideoPanel.isHidden())
      embedVideoPanel.toggleHidden();
    });

    embedVideoPanel.onShow.subscribe(() => {
      // Set toggle status to on when the embedVideo panel shows
      this.on();
    });

    embedVideoPanel.onHide.subscribe(() => {
      // Set toggle status to off when the embedVideo panel hides
      this.off();
    });
  }
}