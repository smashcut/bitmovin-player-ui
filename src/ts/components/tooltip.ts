import { ContainerConfig, Container } from "./container";

export class Tooltip extends Container<ContainerConfig> {
  private label: string;

  constructor(config: ContainerConfig = {}) {
    super(config);
    this.config = this.mergeConfig(
      {},
      { cssClass: "ui-tooltip-box" },
      this.config
    );
    this.label = "";
    this.setText(this.label, 0, 0, false);
  }

  setText(text: string, left: number, top: number, rightSideArrow: boolean) {
    console.log("Tooltip.setText", text, left, top, rightSideArrow);
    this.getDomElement().removeClass("rightSideArrow");
    if (rightSideArrow) {
      this.getDomElement().addClass("rightSideArrow");
    }
    this.label = text;
    this.getDomElement()
      .html(text)
      .css({
        left: left + "px",
        top: top + "px"
      });
  }
}
