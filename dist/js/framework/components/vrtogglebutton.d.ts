import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { UIInstanceManager } from '../uimanager';
/**
 * A button that toggles the video view between normal/mono and VR/stereo.
 */
export declare class VRToggleButton extends ToggleButton<ToggleButtonConfig> {
    constructor(config?: ToggleButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
