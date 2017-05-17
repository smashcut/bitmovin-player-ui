import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';
/**
 * A button that toggles between playback and pause.
 */
export declare class PlaybackToggleButton extends ToggleButton<ToggleButtonConfig> {
    private static readonly CLASS_STOPTOGGLE;
    constructor(config?: ToggleButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager, handleClickEvent?: boolean): void;
}
