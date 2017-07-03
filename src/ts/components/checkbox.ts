import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {UIInstanceManager} from '../uimanager';
import {Container, ContainerConfig} from './container';
import {Label, LabelConfig} from './label';
import {Event, EventDispatcher, NoArgs} from '../eventdispatcher';

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

  private checkboxEvents = {
    onClick: new EventDispatcher<Checkbox, NoArgs>(),
    onChange: new EventDispatcher<Checkbox, NoArgs>(),
  };

  constructor(config: CheckboxConfig = {text: ''}) {
    super(config);

    this.label = new Label({cssClasses: ['checkbox-label'], text: config.text});
    this.button = new ToggleButton({cssClasses: ['checkbox-button']});

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-checkbox',
      components: [this.button, this.label],
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // Listen for the click event on the element and
    // trigger the corresponding events on the button component
    this.getDomElement().on('click', () => {
      this.button.toggle();
      this.onClickEvent();
      this.onChangeEvent();
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
    this.checkboxEvents.onClick.dispatch(this);
  }

  protected onChangeEvent() {
    this.checkboxEvents.onChange.dispatch(this);
  }

  /**
   * Gets the event that is fired when the button is clicked.
   * @returns {Event<Checkbox, NoArgs>}
   */
  get onClick(): Event<Checkbox, NoArgs> {
    return this.checkboxEvents.onClick.getEvent();
  }

  /**
   * Gets the event that is fired when the value is changed
   * @returns {Event<Checkbox, NoArgs>}
   */
  get onChange(): Event<Checkbox, NoArgs> {
    return this.checkboxEvents.onChange.getEvent();
  }

  get isOn(): boolean {
    return this.button.isOn();
  }
}