import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {UIInstanceManager} from '../uimanager';
import {SeekBar} from './seekbar';

/**
 * Configuration interface for the {@link CommentsToggleButton}.
 */
export interface CommentsToggleButtonConfig extends ToggleButtonConfig {
  seekBar: SeekBar;
}

/**
 * A button that toggles visibility of a embedVideo panel.
 */
export class CommentsToggleButton extends ToggleButton<CommentsToggleButtonConfig> {

  constructor(config: CommentsToggleButtonConfig) {
    super(config);

    if (!config.seekBar) {
      throw new Error('Required SeekBar is missing');
    }

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-comments-togglebutton',
      text: 'Comments',
      seekBar: null,
    }, <CommentsToggleButtonConfig>this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let config = <CommentsToggleButtonConfig>this.getConfig(); // TODO fix generics type inference
    let seekBar = config.seekBar;

    this.onClick.subscribe(() => {
      seekBar.toggleCommentsOn();
    });

    let updateOnOff = () => {
      if (seekBar.commentsOn) {
        this.on();
      } else {
        this.off();
      }
    };

    seekBar.onChangeCommentsOn.subscribe((e, on) => {
      updateOnOff();
    });

    updateOnOff();
  }
}