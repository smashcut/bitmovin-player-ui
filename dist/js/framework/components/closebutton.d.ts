import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { Component, ComponentConfig } from './component';
/**
 * Configuration interface for the {@link CloseButton}.
 */
export interface CloseButtonConfig extends ButtonConfig {
    /**
     * The component that should be closed when the button is clicked.
     */
    target: Component<ComponentConfig>;
}
/**
 * A button that closes (hides) a configured component.
 */
export declare class CloseButton extends Button<CloseButtonConfig> {
    constructor(config: CloseButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
