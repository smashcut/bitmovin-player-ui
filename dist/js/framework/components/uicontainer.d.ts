import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
import { DOM } from '../dom';
/**
 * Configuration interface for a {@link UIContainer}.
 */
export interface UIContainerConfig extends ContainerConfig {
    /**
     * The delay in milliseconds after which the control bar will be hidden when there is no user interaction.
     * Default: 5 seconds (5000)
     */
    hideDelay?: number;
}
/**
 * The base container that contains all of the UI. The UIContainer is passed to the {@link UIManager} to build and
 * setup the UI.
 */
export declare class UIContainer extends Container<UIContainerConfig> {
    private static readonly STATE_PREFIX;
    private static readonly FULLSCREEN;
    private static readonly BUFFERING;
    private static readonly REMOTE_CONTROL;
    private static readonly CONTROLS_SHOWN;
    private static readonly CONTROLS_HIDDEN;
    private uiHideTimeout;
    constructor(config: UIContainerConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    private configureUIShowHide(player, uimanager);
    private configurePlayerStates(player, uimanager);
    release(): void;
    protected toDomElement(): DOM;
}
