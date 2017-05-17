import {ContainerConfig, Container} from './container';
import {UIInstanceManager} from '../uimanager';
import {Timeout} from '../timeout';
import {Label, LabelConfig} from './label';
import {CloseButton} from './closebutton';
import {Checkbox} from './checkbox';

/**
 * Configuration interface for a {@link EmbedVideoPanel}.
 */
export interface EmbedVideoPanelConfig extends ContainerConfig {
  /**
   * The delay in milliseconds after which the embedVideo panel will be hidden when there is no user interaction.
   * Set to -1 to disable automatic hiding.
   * Default: 3 seconds (3000)
   */
  hideDelay?: number;
}

/**
 * A panel containing a list of {@link EmbedVideoPanelItem items} that represent labelled embedVideo.
 */
export class EmbedVideoPanel extends Container<EmbedVideoPanelConfig> {

  private closeButton: CloseButton;
  private title: Label<LabelConfig>;
  private showCommentsCheckbox: Checkbox;
  private codeField: Label<LabelConfig>;


  private hideTimeout: Timeout;

  constructor(config: EmbedVideoPanelConfig) {
    super(config);

    this.title = new Label({text: 'Embed Video', cssClass: 'ui-embedvideo-panel-title'});
    this.closeButton = new CloseButton({target: this});
    this.showCommentsCheckbox = new Checkbox({text: 'Show comments'});
    this.codeField = new Label({
      text: this.toHtmlEntities('<iframe></iframe>'),
      cssClass: 'ui-embedvideo-panel-codefield'
    });


    this.config = this.mergeConfig<EmbedVideoPanelConfig>(config, {
        cssClass: 'ui-embedvideo-panel',
        hideDelay: 3000,
        components: [
          new Container({
            cssClass: 'ui-embedvideo-panel-header',
            components: [
              this.title,
              this.closeButton,
            ]
          }),
          this.showCommentsCheckbox,
          this.codeField
        ]
      },
      this.config
    )
    ;
  }

  configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let config = <EmbedVideoPanelConfig>this.getConfig(); // TODO fix generics type inference

    if (config.hideDelay > -1) {
      this.hideTimeout = new Timeout(config.hideDelay, () => {
        this.hide();
      });

      this.onShow.subscribe(() => {
        // Activate timeout when shown
        this.hideTimeout.start();
      });
      this.getDomElement().on('mousemove', () => {
        // Reset timeout on interaction
        this.hideTimeout.reset();
      });
      this.onHide.subscribe(() => {
        // Clear timeout when hidden from outside
        this.hideTimeout.clear();
      });
    }
  }

  release(): void {
    super.release();
    if (this.hideTimeout) {
      this.hideTimeout.clear();
    }
  }

  toHtmlEntities(s: string): string {
    return s.replace(/./gm, function (s) {
      return '&#' + s.charCodeAt(0) + ';';
    });
  }
}

