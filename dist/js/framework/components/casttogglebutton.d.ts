import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';
/**
 * A button that toggles casting to a Cast receiver.
 */
export declare class CastToggleButton extends ToggleButton<ToggleButtonConfig> {
    constructor(config?: ToggleButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
