import {Container, ContainerConfig} from './container';
import {Label, LabelConfig} from './label';
import {Component, ComponentConfig} from './component';
import {UIInstanceManager, SeekPreviewArgs, TimelineMarker} from '../uimanager';
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


  private timeLabel: Label<LabelConfig>;
  private titleLabel: Label<LabelConfig>;
  private thumbnail: Component<ComponentConfig>;

  private thumbnailImageLoader: ImageLoader;

  private avatarLabel: Label<LabelConfig>;
  private commentLabel: Label<LabelConfig>;
  private logo: Component<ComponentConfig>;
  private markerType: Component<ComponentConfig>;
  private metadata: Component<ComponentConfig>;

  private currentMarker: TimelineMarker;
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

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-seekbar-label',
      components: [new Container({
        components: [
          this.thumbnail,
          this.logo,
          this.metadata,
        ],
        cssClass: 'seekbar-label-inner',
      })],
      hidden: true,
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    uimanager.onSeekPreview.subscribeRateLimited((sender, args: SeekPreviewArgs) => {
      this.currentMarker = args.marker;
      if (player.isLive()) {
        let maxTimeShift = player.getMaxTimeShift();
        let time = maxTimeShift - maxTimeShift * (args.position / 100);
        this.setTime(time);
      } else {
        if (args.marker) {
          this.setSmashcutData(args.marker);
          this.setTimeText(null);
          this.setThumbnail(null, 180);
        } else {
          this.setSmashcutData(null);
          let percentage = args.position;
          let time = player.getDuration() * (percentage / 100);
          this.setTime(time);
          this.setThumbnail(player.getThumb(time));
        }
      }
    }, 100);

    let init = () => {
      // Set time format depending on source duration
      this.timeFormat = Math.abs(player.isLive() ? player.getMaxTimeShift() : player.getDuration()) >= 3600 ?
        StringUtils.FORMAT_HHMMSS : StringUtils.FORMAT_MMSS;
    };

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

  setSmashcutData(marker: any) {
    if (marker) {
      this.titleLabel.setText(marker.title);
      this.commentLabel.setText('"' + marker.text + '"');
      this.avatarLabel.setText(marker.avatar);
      this.setMarkerType(marker.markerType);
      this.setBackground(true);
      this.setLogo(false);
    } else {
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
   */
  setThumbnail(thumbnail: bitmovin.PlayerAPI.Thumbnail = null, width: number = 180) {
    let thumbnailElement = this.thumbnail.getDomElement();
    let metadataElement = this.metadata.getDomElement();

    if (thumbnail == null) {
      metadataElement.addClass('marker');
      thumbnailElement.css({
        'background-image': null,
        'display': null,
        'width': width + 'px',
        'height': null,
      });
    }
    else {
      metadataElement.removeClass('marker');
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