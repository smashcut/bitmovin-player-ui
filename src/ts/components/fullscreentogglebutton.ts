import { ToggleButton, ToggleButtonConfig } from "./togglebutton";
import { UIInstanceManager } from "../uimanager";
import { PlayerAPI } from "bitmovin-player";

/**
 * A button that toggles the player between windowed and fullscreen view.
 */
export class FullscreenToggleButton extends ToggleButton<ToggleButtonConfig> {
  constructor(config: ToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClass: "ui-fullscreentogglebutton",
        text: "Fullscreen"
      },
      this.config
    );
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let fullscreenStateHandler = () => {
      if (player.getViewMode() === player.exports.ViewMode.Fullscreen) {
        this.on();
      } else {
        this.off();
      }
    };

    player.on(
      player.exports.PlayerEvent.ViewModeChanged,
      fullscreenStateHandler
    );

    this.onClick.subscribe(() => {
      if (player.getViewMode() === player.exports.ViewMode.Fullscreen) {
        player.setViewMode(player.exports.ViewMode.Inline);
      } else {
        player.setViewMode(player.exports.ViewMode.Fullscreen);
      }
    });

    const config = <ToggleButtonConfig>this.getConfig();

    this.getDomElement().on("mouseover", e => {
      const target = e.target as HTMLTextAreaElement;
      const left = target.offsetLeft - target.offsetWidth - 53;
      const top = target.offsetTop;
      const isFullscreen =
        player.getViewMode() === player.exports.ViewMode.Fullscreen;
      config &&
        config.tooltip &&
        config.tooltip.setText(
          isFullscreen ? "Exit full screen" : "Full screen",
          left,
          top,
          true
        );
    });

    this.getDomElement().on("mouseleave", () => {
      config && config.tooltip && config.tooltip.setText("", 0, 0, false);
    });

    // Startup init
    fullscreenStateHandler();
  }
}
