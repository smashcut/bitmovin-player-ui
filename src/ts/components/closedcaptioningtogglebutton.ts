import { ToggleButton, ToggleButtonConfig } from "./togglebutton";
import { UIInstanceManager } from "../uimanager";
import { PlayerAPI } from "bitmovin-player";

/**
 * Configuration interface for the {@link ClosedCaptioningToggleButton}.
 */
export interface ClosedCaptioningToggleButtonConfig
  extends ToggleButtonConfig {}

/**
 * A button that toggles visibility of a embedVideo panel.
 */
export class ClosedCaptioningToggleButton extends ToggleButton<
  ClosedCaptioningToggleButtonConfig
> {
  constructor(config: ClosedCaptioningToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClass: "ui-closedcaptioning-togglebutton",
        text: "Closed Captioning"
      },
      <ClosedCaptioningToggleButtonConfig>this.config
    );
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      console.log("closed captioning button clicked");
    });

    if (this.hasTooltip()) {
      const tooltip = this.getTooltip();

      this.getDomElement().on("mouseleave", () => {
        tooltip.setText("", 0, 0, false);
      });

      this.getDomElement().on("mouseover", e => {
        const target = e.target as HTMLTextAreaElement;
        const left = target.offsetLeft - target.offsetWidth - 24;
        const top = target.offsetTop;
        tooltip.setText("Closed captions", left, top, false);
      });
    }
  }
}
