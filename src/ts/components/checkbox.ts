import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {UIInstanceManager} from '../uimanager';
import {Container, ContainerConfig} from './container';
import {Label, LabelConfig} from './label';
import {Event, EventDispatcher, NoArgs} from '../eventdispatcher';
import Config = bitmovin.player.Config;

/**
 * Configuration interface for a {@link Checkbox}.
 */
export interface CheckboxConfig extends ContainerConfig {
  /**
   * The label for the checkbox.
   */
  text: string;
}

export class Checkbox extends Container<CheckboxConfig> {

  private label: Label<LabelConfig>;
  private button: ToggleButton<ToggleButtonConfig>;

  private buttonEvents = {
    onClick: new EventDispatcher<Checkbox, NoArgs>()
  };

  constructor(config: CheckboxConfig = {text: ''}) {
    super(config);

    this.label = new Label({cssClasses: ['checkbox-label'], text: config.text});
    this.button = new ToggleButton({cssClasses: ['checkbox-button']});

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-checkbox',
      components: [this.button, this.label]
    }, this.config);
  }

  configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // Listen for the click event on the element and
    // trigger the corresponding event on the button component
    this.getDomElement().on('click', () => {
      this.onClickEvent()
      this.button.toggle()
    });
  }

  /**
   * Sets arbitrary text on the label.
   * @param text the text to show on the label
   */
  setText(text: string) {
    this.label.setText(text);
  }

  protected onClickEvent() {
    this.buttonEvents.onClick.dispatch(this);
  }

  /**
   * Gets the event that is fired when the button is clicked.
   * @returns {Event<Checkbox, NoArgs>}
   */
  get onClick(): Event<Checkbox, NoArgs> {
    return this.buttonEvents.onClick.getEvent();
  }
}