import { Component, ComponentConfig } from './component';
import { DOM } from '../dom';
import { Event, NoArgs } from '../eventdispatcher';
import { SeekBarLabel } from './seekbarlabel';
import { UIInstanceManager, TimelineMarker, SeekPreviewArgs } from '../uimanager';
/**
 * Configuration interface for the {@link SeekBar} component.
 */
export interface SeekBarConfig extends ComponentConfig {
    /**
     * The label above the seek position.
     */
    label?: SeekBarLabel;
    /**
     * Bar will be vertical instead of horizontal if set to true.
     */
    vertical?: boolean;
    /**
     * The interval in milliseconds in which the playback position on the seek bar will be updated. The shorter the
     * interval, the smoother it looks and the more resource intense it is. The update interval will be kept as steady
     * as possible to avoid jitter.
     * Set to -1 to disable smooth updating and update it on player ON_TIME_CHANGED events instead.
     * Default: 50 (50ms = 20fps).
     */
    smoothPlaybackPositionUpdateIntervalMs?: number;
}
/**
 * Event argument interface for a seek preview event.
 */
export interface SeekPreviewEventArgs extends SeekPreviewArgs {
    /**
     * Tells if the seek preview event comes from a scrubbing.
     */
    scrubbing: boolean;
}
/**
 * A seek bar to seek within the player's media. It displays the current playback position, amount of buffed data, seek
 * target, and keeps status about an ongoing seek.
 *
 * The seek bar displays different 'bars':
 *  - the playback position, i.e. the position in the media at which the player current playback pointer is positioned
 *  - the buffer position, which usually is the playback position plus the time span that is already buffered ahead
 *  - the seek position, used to preview to where in the timeline a seek will jump to
 */
export declare class SeekBar extends Component<SeekBarConfig> {
    static readonly SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED: number;
    /**
     * The CSS class that is added to the DOM element while the seek bar is in 'seeking' state.
     */
    private static readonly CLASS_SEEKING;
    private seekBar;
    private seekBarPlaybackPosition;
    private seekBarPlaybackPositionMarker;
    private seekBarBufferPosition;
    private seekBarSeekPosition;
    private seekBarBackdrop;
    private seekBarMarkersContainer;
    private label;
    private timelineMarkers;
    /**
     * Buffer of the the current playback position. The position must be buffered in case the element
     * needs to be refreshed with {@link #refreshPlaybackPosition}.
     * @type {number}
     */
    private playbackPositionPercentage;
    private smoothPlaybackPositionUpdater;
    private touchSupported;
    private seekBarEvents;
    constructor(config?: SeekBarConfig);
    initialize(): void;
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager, configureSeek?: boolean): void;
    private configureSmoothPlaybackPositionUpdater(player, uimanager);
    private configureMarkers(player, uimanager);
    release(): void;
    protected toDomElement(): DOM;
    protected updateMarkers(): void;
    protected getMarkerAtPosition(percentage: number): TimelineMarker | null;
    /**
     * Gets the horizontal offset of a mouse/touch event point from the left edge of the seek bar.
     * @param eventPageX the pageX coordinate of an event to calculate the offset from
     * @returns {number} a number in the range of [0, 1], where 0 is the left edge and 1 is the right edge
     */
    private getHorizontalOffset(eventPageX);
    /**
     * Gets the vertical offset of a mouse/touch event point from the bottom edge of the seek bar.
     * @param eventPageY the pageX coordinate of an event to calculate the offset from
     * @returns {number} a number in the range of [0, 1], where 0 is the bottom edge and 1 is the top edge
     */
    private getVerticalOffset(eventPageY);
    /**
     * Gets the mouse or touch event offset for the current configuration (horizontal or vertical).
     * @param e the event to calculate the offset from
     * @returns {number} a number in the range of [0, 1]
     * @see #getHorizontalOffset
     * @see #getVerticalOffset
     */
    private getOffset(e);
    /**
     * Sanitizes the mouse offset to the range of [0, 1].
     *
     * When tracking the mouse outside the seek bar, the offset can be outside the desired range and this method
     * limits it to the desired range. E.g. a mouse event left of the left edge of a seek bar yields an offset below
     * zero, but to display the seek target on the seek bar, we need to limit it to zero.
     *
     * @param offset the offset to sanitize
     * @returns {number} the sanitized offset.
     */
    private sanitizeOffset(offset);
    /**
     * Sets the position of the playback position indicator.
     * @param percent a number between 0 and 100 as returned by the player
     */
    setPlaybackPosition(percent: number): void;
    /**
     * Refreshes the playback position. Can be used by subclasses to refresh the position when
     * the size of the component changes.
     */
    protected refreshPlaybackPosition(): void;
    /**
     * Sets the position until which media is buffered.
     * @param percent a number between 0 and 100
     */
    setBufferPosition(percent: number): void;
    /**
     * Sets the position where a seek, if executed, would jump to.
     * @param percent a number between 0 and 100
     */
    setSeekPosition(percent: number): void;
    /**
     * Set the actual position (width or height) of a DOM element that represent a bar in the seek bar.
     * @param element the element to set the position for
     * @param percent a number between 0 and 100
     */
    private setPosition(element, percent);
    /**
     * Puts the seek bar into or out of seeking state by adding/removing a class to the DOM element. This can be used
     * to adjust the styling while seeking.
     *
     * @param seeking should be true when entering seek state, false when exiting the seek state
     */
    setSeeking(seeking: boolean): void;
    /**
     * Checks if the seek bar is currently in the seek state.
     * @returns {boolean} true if in seek state, else false
     */
    isSeeking(): boolean;
    /**
     * Checks if the seek bar has a {@link SeekBarLabel}.
     * @returns {boolean} true if the seek bar has a label, else false
     */
    hasLabel(): boolean;
    /**
     * Gets the label of this seek bar.
     * @returns {SeekBarLabel} the label if this seek bar has a label, else null
     */
    getLabel(): SeekBarLabel | null;
    protected onSeekEvent(): void;
    protected onSeekPreviewEvent(percentage: number, scrubbing: boolean): void;
    protected onSeekedEvent(percentage: number): void;
    /**
     * Gets the event that is fired when a scrubbing seek operation is started.
     * @returns {Event<SeekBar, NoArgs>}
     */
    readonly onSeek: Event<SeekBar, NoArgs>;
    /**
     * Gets the event that is fired during a scrubbing seek (to indicate that the seek preview, i.e. the video frame,
     * should be updated), or during a normal seek preview when the seek bar is hovered (and the seek target,
     * i.e. the seek bar label, should be updated).
     * @returns {Event<SeekBar, SeekPreviewEventArgs>}
     */
    readonly onSeekPreview: Event<SeekBar, SeekPreviewEventArgs>;
    /**
     * Gets the event that is fired when a scrubbing seek has finished or when a direct seek is issued.
     * @returns {Event<SeekBar, number>}
     */
    readonly onSeeked: Event<SeekBar, number>;
    protected onShowEvent(): void;
}
