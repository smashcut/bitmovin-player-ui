import { ComponentConfig, Component } from "./component";
import { DOM } from "../dom";
import { EventDispatcher, NoArgs, Event } from "../eventdispatcher";
import { Tooltip } from "./tooltip";

/**
 * Configuration interface for a {@link Button} component.
 */
export interface ButtonConfig extends ComponentConfig {
  /**
   * The text on the button.
   */
  text?: string;

  /*
   * The label below the icon (smallscreen)
   */
  label?: string;
  tooltip?: Tooltip;
}

/**
 * A simple clickable button.
 */
export class Button<Config extends ButtonConfig> extends Component<Config> {
  private buttonEvents = {
    onClick: new EventDispatcher<Button<Config>, NoArgs>()
  };

  private tooltip: Tooltip;

  constructor(config: Config) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClass: "ui-button"
      } as Config,
      this.config
    );

    this.tooltip = config.tooltip;
  }

  initialize(): void {
    super.initialize();

    if (this.hasTooltip()) {
      this.getTooltip().initialize();
    }
  }

  hasTooltip(): boolean {
    return this.tooltip != null;
  }

  getTooltip(): Tooltip | null {
    return this.tooltip;
  }

  protected toDomElement(): DOM {
    // Create the button element with the text label
    let buttonElement = new DOM("button", {
      type: "button",
      id: this.config.id,
      class: this.getCssClasses()
    });

    if (this.config.text) {
      buttonElement.append(
        new DOM("span", { class: this.prefixCss("text") }).html(
          this.config.text
        )
      );
    }

    if (this.config.label) {
      buttonElement.append(
        new DOM("span", { class: this.prefixCss("label") }).html(
          this.config.label
        )
      );
    }

    // Listen for the click event on the button element and trigger the corresponding event on the button component
    buttonElement.on("click", () => {
      this.onClickEvent();
    });

    return buttonElement;
  }

  /**
   * Sets text on the label of the button.
   * @param text the text to put into the label of the button
   */
  setText(text: string): void {
    this.getDomElement()
      .find("." + this.prefixCss("text"))
      .html(text);
  }

  setLabel(label: string): void {
    this.getDomElement()
      .find("." + this.prefixCss("label"))
      .html(label);
  }

  protected onClickEvent() {
    this.buttonEvents.onClick.dispatch(this);
  }

  /**
   * Gets the event that is fired when the button is clicked.
   * @returns {Event<Button<Config>, NoArgs>}
   */
  get onClick(): Event<Button<Config>, NoArgs> {
    return this.buttonEvents.onClick.getEvent();
  }
}
