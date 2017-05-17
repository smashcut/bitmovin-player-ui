import { UIContainer, UIContainerConfig } from './uicontainer';
import { UIInstanceManager } from '../uimanager';
/**
 * The base container for Cast receivers that contains all of the UI and takes care that the UI is shown on
 * certain playback events.
 */
export declare class CastUIContainer extends UIContainer {
    private castUiHideTimeout;
    constructor(config: UIContainerConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    release(): void;
}
