import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {UIInstanceManager} from '../uimanager';

/**
 * Configuration interface for the {@link CommentsToggleButton}.
 */
export interface CommentsToggleButtonConfig extends ToggleButtonConfig {

}

/**
 * A button that toggles visibility of a embedVideo panel.
 */
export class CommentsToggleButton extends ToggleButton<CommentsToggleButtonConfig> {

  constructor(config: CommentsToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-comments-togglebutton',
      text: 'Comments'
    }, <CommentsToggleButtonConfig>this.config);
  }

  configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let config = <CommentsToggleButtonConfig>this.getConfig(); // TODO fix generics type inference

    this.onClick.subscribe(() => {
      console.log('comments button clicked')
    });
  }
}