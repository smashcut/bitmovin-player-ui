import {Container, ContainerConfig} from './container';
import {Label, LabelConfig} from './label';
import {Component, ComponentConfig} from './component';
import {UIInstanceManager, TimelineMarker} from '../uimanager';
import {SeekPreviewEventArgs} from './seekbar';
import {StringUtils} from '../stringutils';
import {ImageLoader} from '../imageloader';

/**
 * Configuration interface for a {@link SeekBarLabel}.
 */
export interface SeekBarLabelConfig extends ContainerConfig {
  // nothing yet
}

/**
 * A label for a {@link SeekBar} that can display the seek target time, a thumbnail, and title (e.g. chapter title).
 */
export class SeekBarLabel extends Container<SeekBarLabelConfig> {


  private innerSeekbar: Component<ComponentConfig>;
  private timeLabel: Label<LabelConfig>;
  private titleLabel: Label<LabelConfig>;
  private thumbnail: Component<ComponentConfig>;

  private thumbnailImageLoader: ImageLoader;

  private avatarLabel: Label<LabelConfig>;
  private commentLabel: Label<LabelConfig>;
  private logo: Component<ComponentConfig>;
  private markerType: Component<ComponentConfig>;
  private metadata: Component<ComponentConfig>;
  private arrow: Component<ComponentConfig>;

  private currentMarker: TimelineMarker;
  private isOverMarker: boolean;
  private markerTypeClass: string;

  private timeFormat: string;

  constructor(config: SeekBarLabelConfig = {}) {
    super(config);

    this.timeLabel = new Label({cssClasses: ['seekbar-label-time']});
    this.titleLabel = new Label({cssClasses: ['seekbar-label-title']});
    this.thumbnail = new Component({cssClasses: ['seekbar-thumbnail']});
    this.thumbnailImageLoader = new ImageLoader();

    this.avatarLabel = new Label({cssClasses: ['seekbar-label-avatar']});
    this.commentLabel = new Label({cssClasses: ['seekbar-label-comment']});
    this.logo = new Component({cssClasses: ['seekbar-label-logo']});
    this.markerType = new Component({cssClasses: ['seekbar-label-marker-type']});

    this.metadata = new Container({
      components: [
        new Container({
          components: [
            this.avatarLabel,
            new Container({
              components: [
                this.titleLabel,
                this.markerType,
              ],
              cssClass: 'seekbar-label-metadata-title-marker',
            }),
          ],
          cssClass: 'seekbar-label-metadata-title',
        }),
        new Container({
          components: [
            this.commentLabel,
            this.timeLabel,
          ],
          cssClass: 'seekbar-label-metadata-content',
        }),
      ],
      cssClass: 'seekbar-label-metadata',
    });

    this.arrow = new Component<ComponentConfig>({ tag: 'span', cssClass: 'ui-label-arrow' });

    this.innerSeekbar = new Container({
      components: [
        this.thumbnail,
        this.logo,
        this.metadata,
        this.arrow,
      ],
      cssClass: 'seekbar-label-inner',
    });
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-seekbar-label',
      components: [this.innerSeekbar],
      hidden: true,
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    uimanager.onSeekPreview.subscribeRateLimited((sender, args: SeekPreviewEventArgs) => {
      this.currentMarker = args.marker;
      this.isOverMarker = args.isOverMarker;

      if (player.isLive()) {
        let maxTimeShift = player.getMaxTimeShift();
        let time = maxTimeShift - maxTimeShift * (args.position / 100);
        this.setTime(time);
      } else if (!this.isOverMarker) {
        this.setSmashcutData(null);
        let percentage = args.position;
        let time = player.getDuration() * (percentage / 100);
        this.setTime(time);
        this.setThumbnail(player.getThumb(time));
      }
    }, 100);

    let init = () => {
      // Set time format depending on source duration
      this.timeFormat = Math.abs(player.isLive() ? player.getMaxTimeShift() : player.getDuration()) >= 3600 ?
        StringUtils.FORMAT_HHMMSS : StringUtils.FORMAT_MMSS;
    };

    this.innerSeekbar.getDomElement().on('mouseleave', () => {
      this.hide();
    });

    player.addEventHandler(player.EVENT.ON_READY, init);
    init();
  }

  /**
   * Sets arbitrary text on the label.
   * @param text the text to show on the label
   */
  setTimeText(text: string) {
    this.timeLabel.setText(text);
  }

  /**
   * Sets a time to be displayed on the label.
   * @param seconds the time in seconds to display on the label
   */
  setTime(seconds: number) {
    this.setTimeText(StringUtils.secondsToTime(seconds, this.timeFormat));
  }

  /**
   * Sets the text on the title label.
   * @param text the text to show on the label
   */
  setTitleText(text: string) {
    this.titleLabel.setText(text);
  }

  /**
   * Returns the arrow element
   * @returns {Component<ComponentConfig>}
   */
  getArrow() {
    return this.arrow;
  }

  /**
   * Returns the current marker.
   * @returns {TimelineMarker}
   */
  getCurrentMarker() {
    return this.currentMarker;
  }

  /**
   * Returns if the mouse is over marker.
   * @returns {TimelineMarker}
   */
  getIsOverMarker() {
    return this.isOverMarker;
  }

  setSmashcutData(marker: any) {
    if (marker) {
      let text = marker.text || '';

      if (text.length > 250) {
        const words = text.split(' ');
        let length = text.length;

        while (length > 250) {
          const word = words.pop();
          length -= word.length + 1;
        }

        text = words.join(' ') + ' ...';
      }

      if (marker.markerType === 'note') {
        this.titleLabel.getDomElement().addClass('note');
      } else {
        this.titleLabel.getDomElement().removeClass('note');
      }

      this.titleLabel.setText(marker.title);
      this.commentLabel.setText(text);
      this.avatarLabel.setText(marker.avatar);
      // Removing margin if the user doesn't have an avatar
      this.avatarLabel
        .getDomElement()
        .css('margin', marker.avatar ? null : '0');
      this.setMarkerType(marker.markerType);
      this.setBackground(true);
      this.setLogo(false);
    } else {
      this.titleLabel.getDomElement().removeClass('note');
      this.titleLabel.setText(null);
      this.commentLabel.setText(null);
      this.avatarLabel.setText(null);
      this.setMarkerType(null);
      this.setBackground(false);
      this.setLogo(false);
    }
  }

  setMarkerType(type: string) {
    let dom = this.markerType.getDomElement();

    if (this.markerTypeClass) {
      dom.removeClass(this.markerTypeClass);
    }

    this.markerTypeClass = type;

    if (this.markerTypeClass) {
      dom.addClass(type);
    }
  }

  setLogo(onOff: boolean) {
    if (onOff) {
      this.logo.show();
    } else {
      this.logo.hide();
    }
  }

  /**
   * Sets or removes a thumbnail on the label.
   * @param thumbnail the thumbnail to display on the label or null to remove a displayed thumbnail
   * @param width
   */
  setThumbnail(thumbnail: bitmovin.PlayerAPI.Thumbnail = null, width: number = 180) {
    let thumbnailElement = this.thumbnail.getDomElement();
    let metadataElement = this.metadata.getDomElement();

    if (thumbnail == null) {
      this.getDomElement().css({
        'margin-bottom': '32px',
      });

      metadataElement.addClass('marker');
      thumbnailElement.css({
        'background-image': null,
        'display': null,
        'width': width + 'px',
        'height': null,
      });

      // max width for the note is 280px
      let newWidth = 280;

      metadataElement.css('width', newWidth + 'px');

      /*
      Using a for statement to avoid infinite loop.
      Usually the width won't be lower than 80px.
      This loop tries to find the biggest width (max 280) for the note.
       */
      for (let i = 0; i < 200; i++) {
        const oldHeight = metadataElement.css('height');

        // We reduce the width by 10px each time
        newWidth -= 10;

        metadataElement.css('width', newWidth + 'px');

        /*
        If the height of the element changed it means there is enough text to fit the previous width,
        which means we found the right width (the previous one)
         */
        if (oldHeight !== metadataElement.css('height')) {
          newWidth += 10;
          break;
        }
      }

      // We remove the seekbar border (used only for thumbnails)
      this.innerSeekbar.getDomElement().addClass('no-border');

      // We set the new width of the metadata element
      metadataElement.css('width', newWidth + 'px');
    } else {
      this.getDomElement().css({
        'margin-bottom': '',
      });
      metadataElement.removeClass('marker');
      metadataElement.css('width', null);
      this.innerSeekbar.getDomElement().removeClass('no-border');
      // We use the thumbnail image loader to make sure the thumbnail is loaded and it's size is known before be can
      // calculate the CSS properties and set them on the element.
      this.thumbnailImageLoader.load(thumbnail.url, (url, width, height) => {
        let thumbnailCountX = width / thumbnail.w;
        let thumbnailCountY = height / thumbnail.h;

        let thumbnailIndexX = thumbnail.x / thumbnail.w;
        let thumbnailIndexY = thumbnail.y / thumbnail.h;

        let sizeX = 100 * thumbnailCountX;
        let sizeY = 100 * thumbnailCountY;

        let offsetX = 100 * thumbnailIndexX;
        let offsetY = 100 * thumbnailIndexY;

        let aspectRatio = 1 / thumbnail.w * thumbnail.h;

        // The thumbnail size is set by setting the CSS 'width' and 'padding-bottom' properties. 'padding-bottom' is
        // used because it is relative to the width and can be used to set the aspect ratio of the thumbnail.
        // A default value for width is set in the stylesheet and can be overwritten from there or anywhere else.
        thumbnailElement.css({
          'display': 'inherit',
          'background-image': `url(${thumbnail.url})`,
          'width': thumbnail.w + 'px',
          'padding-bottom': `${100 * aspectRatio}%`,
          'background-size': `${sizeX}% ${sizeY}%`,
          'background-position': `-${offsetX}% -${offsetY}%`,
        });
      });
    }
  }

  setBackground(onOff: boolean) {
    let metadataElement = this.metadata.getDomElement();

    if (onOff) {
      metadataElement.css({
        'background': '#fff',
        'color': '#000',
      });
    }
    else {
      metadataElement.css({
        'background': 'initial',
        'color': '#fff',
      });
    }
  }
}