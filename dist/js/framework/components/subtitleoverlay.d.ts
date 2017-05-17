import { Container, ContainerConfig } from './container';
import { UIInstanceManager } from '../uimanager';
/**
 * Overlays the player to display subtitles.
 */
export declare class SubtitleOverlay extends Container<ContainerConfig> {
    private static readonly CLASS_CONTROLBAR_VISIBLE;
    constructor(config?: ContainerConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
