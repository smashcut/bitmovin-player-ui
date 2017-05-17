import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
/**
 * Configuration interface for the {@link BufferingOverlay} component.
 */
export interface BufferingOverlayConfig extends ContainerConfig {
    /**
     * Delay in milliseconds after which the buffering overlay will be displayed. Useful to bypass short stalls without
     * displaying the overlay. Set to 0 to display the overlay instantly.
     * Default: 1000ms (1 second)
     */
    showDelayMs?: number;
}
/**
 * Overlays the player and displays a buffering indicator.
 */
export declare class BufferingOverlay extends Container<BufferingOverlayConfig> {
    private indicators;
    constructor(config?: BufferingOverlayConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
