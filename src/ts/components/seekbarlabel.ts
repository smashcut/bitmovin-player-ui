import {Container, ContainerConfig} from './container';
import {Label, LabelConfig} from './label';
import {Component, ComponentConfig} from './component';
import {UIInstanceManager, SeekPreviewArgs} from '../uimanager';
import {StringUtils} from '../utils';

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

  private avatarLabel: Label<LabelConfig>;
  private commentLabel: Label<LabelConfig>;
  private metadata: Component<ComponentConfig>;
  private thumbnail: Component<ComponentConfig>;
  private timeLabel: Label<LabelConfig>;
  private titleLabel: Label<LabelConfig>;

  private timeFormat: string;

  constructor(config: SeekBarLabelConfig = {}) {
    super(config);

    this.avatarLabel = new Label({cssClasses: ['seekbar-label-avatar']});
    this.commentLabel = new Label({cssClasses: ['seekbar-label-comment']});
    this.thumbnail = new Component({cssClasses: ['seekbar-thumbnail']});
    this.timeLabel = new Label({cssClasses: ['seekbar-label-time']});
    this.titleLabel = new Label({cssClasses: ['seekbar-label-title']});

    this.metadata = new Container({
      components: [
        new Container({
          components: [
            this.avatarLabel,
            this.titleLabel
          ],
          cssClass: 'seekbar-label-metadata-title',
        }),
        new Container({
          components: [
            this.commentLabel,
            this.timeLabel],
          cssClass: 'seekbar-label-metadata-content',
        }),
      ],
      cssClass: 'seekbar-label-metadata'
    });

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-seekbar-label',
      components: [new Container({
        components: [
          this.thumbnail,
          this.metadata
        ],
        cssClass: 'seekbar-label-inner',
      })],
      hidden: true
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    uimanager.onSeekPreview.subscribe((sender, args: SeekPreviewArgs) => {
      if (player.isLive()) {
        let time = player.getMaxTimeShift() - player.getMaxTimeShift() * (args.position / 100);
        this.setTime(time);
      } else {
        if (args.marker) {
          this.setTitleText(args.marker.title);
          this.setSmashcutData(args.marker);
          this.setTimeText(null);
          this.setThumbnail(null);
          this.setBackground(true);
        } else {
          let percentage = args.position;
          this.setTitleText(null);
          this.setSmashcutData(null);
          let time = player.getDuration() * (percentage / 100);
          this.setTime(time);
          this.setThumbnail(player.getThumb(time));
          this.setBackground(false);
        }
      }
    });

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
      this.commentLabel.setText('"' + marker.comment + '"');
      this.avatarLabel.setText(marker.avatar);
    } else {
      this.commentLabel.setText(null);
      this.avatarLabel.setText(null);
    }
  }

  /**
   * Sets or removes a thumbnail on the label.
   * @param thumbnail the thumbnail to display on the label or null to remove a displayed thumbnail
   */
  setThumbnail(thumbnail: bitmovin.PlayerAPI.Thumbnail = null) {
    let thumbnailElement = this.thumbnail.getDomElement();

    if (thumbnail == null) {
      thumbnailElement.css({
        'background-image': null,
        'display': 'null',
        'width': '180px',
        'height': 'null'
      });
    }
    else {
      thumbnailElement.css({
        'display': 'inherit',
        'background-image': `url(${thumbnail.url})`,
        'width': thumbnail.w + 'px',
        'height': thumbnail.h + 'px',
        'background-position': `-${thumbnail.x}px -${thumbnail.y}px`
      });
    }
  }

  setBackground(onOff: boolean) {
    let metadataElement = this.metadata.getDomElement();

    if (onOff) {
      metadataElement.css({
        'background': '#fff',
        'color': '#000'
      });
    }
    else {
      metadataElement.css({
        'background': 'initial',
        'color': '#fff'
      });
    }
  }
}