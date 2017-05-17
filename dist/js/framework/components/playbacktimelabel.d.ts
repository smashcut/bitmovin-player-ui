import { LabelConfig, Label } from './label';
import { UIInstanceManager } from '../uimanager';
export declare enum PlaybackTimeLabelMode {
    CurrentTime = 0,
    TotalTime = 1,
    CurrentAndTotalTime = 2,
}
export interface PlaybackTimeLabelConfig extends LabelConfig {
    timeLabelMode?: PlaybackTimeLabelMode;
    hideInLivePlayback?: boolean;
}
/**
 * A label that display the current playback time and the total time through {@link PlaybackTimeLabel#setTime setTime}
 * or any string through {@link PlaybackTimeLabel#setText setText}.
 */
export declare class PlaybackTimeLabel extends Label<PlaybackTimeLabelConfig> {
    private timeFormat;
    constructor(config?: PlaybackTimeLabelConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    /**
     * Sets the current playback time and total duration.
     * @param playbackSeconds the current playback time in seconds
     * @param durationSeconds the total duration in seconds
     */
    setTime(playbackSeconds: number, durationSeconds: number): void;
}
