import { Container, ContainerConfig } from './container';
import { UIInstanceManager } from '../uimanager';
/**
 * Configuration interface for a {@link TitleBar}.
 */
export interface TitleBarConfig extends ContainerConfig {
    /**
     * Specifies if the title bar should stay hidden when no metadata label contains any text. Does not make a lot
     * of sense if the title bar contains other components than just MetadataLabels (like in the default configuration).
     * Default: false
     */
    keepHiddenWithoutMetadata?: boolean;
}
/**
 * Displays a title bar containing a label with the title of the video.
 */
export declare class TitleBar extends Container<TitleBarConfig> {
    constructor(config?: TitleBarConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
