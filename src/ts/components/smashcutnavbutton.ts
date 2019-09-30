import {ButtonConfig, Button} from './button';
import {DOM} from '../dom';
import {UIInstanceManager} from '../uimanager';

export interface SmashcutNavButtonConfig extends ButtonConfig {
  action?: string;
}
/**
 * A button to play previous or next video.
 */
export class SmashcutNavButton extends Button<SmashcutNavButtonConfig> {

  constructor(config: SmashcutNavButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-smashcutnavbutton',
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    const action = (<SmashcutNavButtonConfig>this.config).action;
    this.onClick.subscribe(() => {
      this.getDomElement().dispatchSmashcutPlayerUiEvent({action, originator: 'SmashcutNavButton'});
    });
  }

  protected toDomElement(): DOM {
    let buttonElement = super.toDomElement();

    // Add child that contains the play button image
    // Setting the image directly on the button does not work together with scaling animations, because the button
    // can cover the whole video player are and scaling would extend it beyond. By adding an inner element, confined
    // to the size if the image, it can scale inside the player without overshooting.
    buttonElement.append(new DOM('div', {
      'class': this.prefixCss('image'),
    }));

    return buttonElement;
  }
}