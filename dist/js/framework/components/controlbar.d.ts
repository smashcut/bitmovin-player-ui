import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
/**
 * Configuration interface for the {@link ControlBar}.
 */
export interface ControlBarConfig extends ContainerConfig {
}
/**
 * A container for main player control components, e.g. play toggle button, seek bar, volume control, fullscreen toggle
 * button.
 */
export declare class ControlBar extends Container<ControlBarConfig> {
    constructor(config: ControlBarConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
