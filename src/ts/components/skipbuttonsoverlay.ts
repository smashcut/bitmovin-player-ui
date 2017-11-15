import {Container, ContainerConfig} from './container';
import {SkipButton} from './skipbutton';

/**
 * Overlays the player and displays skip buttons
 */
export class SkipButtonsOverlay extends Container<ContainerConfig> {

  private skipForwardButton: SkipButton;
  private skipBackwardButton: SkipButton;

  constructor(config: ContainerConfig = {}) {
    super(config);

    this.skipForwardButton = new SkipButton({duration: 10});
    this.skipBackwardButton = new SkipButton({duration: -10});

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-skipbuttons-overlay',
      components: [this.skipBackwardButton, this.skipForwardButton],
    }, this.config);
  }
}