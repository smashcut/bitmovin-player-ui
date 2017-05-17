import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
/**
 * Overlays the player and displays the status of a Cast session.
 */
export declare class CastStatusOverlay extends Container<ContainerConfig> {
    private statusLabel;
    constructor(config?: ContainerConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
