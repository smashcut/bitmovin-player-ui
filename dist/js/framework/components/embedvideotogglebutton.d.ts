import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { EmbedVideoPanel } from './embedvideopanel';
import { UIInstanceManager } from '../uimanager';
/**
 * Configuration interface for the {@link EmbedVideoToggleButton}.
 */
export interface EmbedVideoToggleButtonConfig extends ToggleButtonConfig {
    /**
     * The embedVideo panel whose visibility the button should toggle.
     */
    embedVideoPanel: EmbedVideoPanel;
}
/**
 * A button that toggles visibility of a embedVideo panel.
 */
export declare class EmbedVideoToggleButton extends ToggleButton<EmbedVideoToggleButtonConfig> {
    constructor(config: EmbedVideoToggleButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
