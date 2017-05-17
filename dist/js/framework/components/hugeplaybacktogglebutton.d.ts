import { ToggleButtonConfig } from './togglebutton';
import { PlaybackToggleButton } from './playbacktogglebutton';
import { DOM } from '../dom';
import { UIInstanceManager } from '../uimanager';
/**
 * A button that overlays the video and toggles between playback and pause.
 */
export declare class HugePlaybackToggleButton extends PlaybackToggleButton {
    constructor(config?: ToggleButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    protected toDomElement(): DOM;
}
