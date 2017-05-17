import { ContainerConfig, Container } from './container';
import { UIInstanceManager } from '../uimanager';
/**
 * Configuration interface for a {@link EmbedVideoPanel}.
 */
export interface EmbedVideoPanelConfig extends ContainerConfig {
    /**
     * The delay in milliseconds after which the embedVideo panel will be hidden when there is no user interaction.
     * Set to -1 to disable automatic hiding.
     * Default: 3 seconds (3000)
     */
    hideDelay?: number;
}
/**
 * A panel containing a list of {@link EmbedVideoPanelItem items} that represent labelled embedVideo.
 */
export declare class EmbedVideoPanel extends Container<EmbedVideoPanelConfig> {
    private closeButton;
    private title;
    private showCommentsCheckbox;
    private codeField;
    private hideTimeout;
    constructor(config: EmbedVideoPanelConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    release(): void;
    toHtmlEntities(s: string): string;
}
