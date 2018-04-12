import {ButtonConfig, Button} from './button';
import {TimelineMarker, UIInstanceManager} from '../uimanager';

/**
 * Configuration interface for the {@link ShowSuggestionsButton}.
 */
export interface ShowSuggestionsButtonConfig extends ButtonConfig {
  /**
   * The component that should be closed when the button is clicked.
   */
  currentMarker?: TimelineMarker;
}

/**
 * A button that closes (hides) a configured component.
 */
export class ShowSuggestionsButton extends Button<ShowSuggestionsButtonConfig> {

  private hideTimeoutHandle: any;
  private currentMarker: TimelineMarker;

  constructor(config: ShowSuggestionsButtonConfig) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-showsuggestions',
      text: 'SHOW SUGGESTIONS',
      hidden: true,
    }, this.config);
  }

  clickHandler = (e: any) => {
    const elem = this.getDomElement();

    elem.dispatchSmashcutPlayerUiEvent({
      action: 'marker-click',
      e,
      marker: this.currentMarker,
    });
  };

  configWithoutArgs(config: ShowSuggestionsButtonConfig) {
    this.onClick.unsubscribe(this.clickHandler);

    this.currentMarker = config.currentMarker;

    this.onClick.subscribe(this.clickHandler);
  }

  /**
   * When a delay is supplied, the function waits until
   * the component is not hovered, but only for notes
   * @param delay
   */
  hide(delay: number = 0) {
    if (delay > 0 &&
      this.currentMarker &&
      this.currentMarker.markerType === 'note') {
      let checkHovered = () => {
        if (this.isHovered()) {
          this.hide(delay);
        } else {
          super.hide();
        }
      };
      clearTimeout(this.hideTimeoutHandle);
      this.hideTimeoutHandle = setTimeout(checkHovered, delay);
    } else {
      super.hide();
    }
  }

  show() {
    clearTimeout(this.hideTimeoutHandle);
    super.show();
  }
}