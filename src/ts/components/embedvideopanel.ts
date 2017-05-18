import {ContainerConfig, Container} from './container';
import {UIInstanceManager, UISingleEmbedVideoConfig} from '../uimanager';
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
    this.codeField = new Label({cssClass: 'ui-embedvideo-panel-codefield'});


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
    let uiconfig = uimanager.getConfig();

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
      this.getDomElement().on('click', () => {
        // Reset timeout on interaction
        this.hideTimeout.reset();
      });
      this.onHide.subscribe(() => {
        // Clear timeout when hidden from outside
        this.hideTimeout.clear();
      });
    };

    let init = () => {
      if (uiconfig && uiconfig.metadata && uiconfig.metadata.embedVideo) {
        let ev = uiconfig.metadata.embedVideo
        if (this.showCommentsCheckbox.isOn && ev.withComments) {
          this.setEmbedVideo(ev.withComments);
        } else {
          this.setEmbedVideo(ev.default);
        }
      } else if (player.getConfig().source && player.getConfig().source.embedVideo) {
        let ev = player.getConfig().source.embedVideo
        if (this.showCommentsCheckbox.isOn && ev.withComments) {
          this.setEmbedVideo(ev.withComments);
        } else {
          this.setEmbedVideo(ev.default);
        }
      }
    };

    let unload = () => {
      this.setHtmlCode(null);
    };

    // Init label
    init();

    // Reinit label when a new source is loaded
    player.addEventHandler(player.EVENT.ON_SOURCE_LOADED, init);
    // Clear labels when source is unloaded
    player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, unload);

    // update when checkbox is changed
    this.showCommentsCheckbox.onChange.subscribe(init);

    // update when shown
    this.onShow.subscribe(init);
  }

  release(): void {
    super.release();
    if (this.hideTimeout) {
      this.hideTimeout.clear();
    }
  }

  setEmbedVideo(htmlCode: string): void {
    if (htmlCode) {
      let code = this.toHtmlEntities(htmlCode)
      this.setHtmlCode(code)
      this.copyTextToClipboard(htmlCode)
    } else {
      this.setHtmlCode(null)
    }
  }

  setHtmlCode(code: string): void {
    this.codeField.setText(code)
  }

  toHtmlEntities(s: string): string {
    return s.replace(/./gm, function (s) {
      return '&#' + s.charCodeAt(0) + ';';
    });
  }

  copyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
    }
    document.body.removeChild(textArea)
  }
}

