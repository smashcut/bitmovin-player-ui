import {ContainerConfig, Container} from './container';
import {UIInstanceManager} from '../uimanager';
import {SmashcutNavButton} from './smashcutnavbutton';

/**
 * Overlays the player and displays recommended videos.
 */
export class SmashcutNavOverlay extends Container<ContainerConfig> {

  private replayButton: SmashcutNavButton;
  private prevButton: SmashcutNavButton;
  private nextButton: SmashcutNavButton;

  constructor(config: ContainerConfig = {}) {
    super(config);

    this.replayButton = new SmashcutNavButton({cssClass: 'ui-smashcutnavbutton', text: 'REPLAY'});
    this.prevButton = new SmashcutNavButton({cssClass: 'ui-smashcutnavbutton prev', text: 'PREVIOUS'});
    this.nextButton = new SmashcutNavButton({cssClass: 'ui-smashcutnavbutton next', text: 'NEXT'});

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-smashcutnav-overlay',
      hidden: true,
      components: [this.prevButton, this.replayButton, this.nextButton],
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.replayButton.onClick.subscribe(() => player.play());

    // Remove recommendations and hide overlay when source is unloaded
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, () => {
      this.hide();
    });
    // Display recommendations when playback has finished
    player.addEventHandler(player.EVENT.ON_PLAYBACK_FINISHED, () => {
      // Dismiss ON_PLAYBACK_FINISHED events at the end of ads
      // TODO remove this workaround once issue #1278 is solved
      if (player.isAd()) {
        return;
      }

      this.show();
    });
    // Hide recommendations when playback starts, e.g. a restart
    player.addEventHandler(player.EVENT.ON_PLAY, () => {
      this.hide();
    });

    // Hide recommendations when seek starts
    player.addEventHandler(player.EVENT.ON_SEEK, () => {
      this.hide();
    });

    // Hide recommendations when seek ends
    player.addEventHandler(player.EVENT.ON_SEEKED, () => {
      this.hide();
    });
  }
}
