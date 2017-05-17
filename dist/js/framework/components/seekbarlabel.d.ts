import { Container, ContainerConfig } from './container';
import { UIInstanceManager } from '../uimanager';
/**
 * Configuration interface for a {@link SeekBarLabel}.
 */
export interface SeekBarLabelConfig extends ContainerConfig {
}
/**
 * A label for a {@link SeekBar} that can display the seek target time, a thumbnail, and title (e.g. chapter title).
 */
export declare class SeekBarLabel extends Container<SeekBarLabelConfig> {
    private timeLabel;
    private titleLabel;
    private numberLabel;
    private commentLabel;
    private avatarLabel;
    private thumbnail;
    private metadata;
    private timeFormat;
    constructor(config?: SeekBarLabelConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    /**
     * Sets arbitrary text on the label.
     * @param text the text to show on the label
     */
    setText(text: string): void;
    /**
     * Sets a time to be displayed on the label.
     * @param seconds the time in seconds to display on the label
     */
    setTime(seconds: number): void;
    /**
     * Sets the text on the title label.
     * @param text the text to show on the label
     */
    setTitleText(text: string): void;
    setSmashcutData(marker: any): void;
    /**
     * Sets or removes a thumbnail on the label.
     * @param thumbnail the thumbnail to display on the label or null to remove a displayed thumbnail
     */
    setThumbnail(thumbnail?: bitmovin.player.Thumbnail): void;
    setBackground(onOff: boolean): void;
}
