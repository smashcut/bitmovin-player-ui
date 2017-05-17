import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';
/**
 * A button that toggles Apple AirPlay.
 */
export declare class AirPlayToggleButton extends ToggleButton<ToggleButtonConfig> {
    constructor(config?: ToggleButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
