import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
/**
 * Overlays the player and displays recommended videos.
 */
export declare class RecommendationOverlay extends Container<ContainerConfig> {
    private replayButton;
    constructor(config?: ContainerConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
