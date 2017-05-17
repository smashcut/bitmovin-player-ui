import { ToggleButton, ToggleButtonConfig } from './togglebutton';
import { SettingsPanel } from './settingspanel';
import { UIInstanceManager } from '../uimanager';
/**
 * Configuration interface for the {@link SettingsToggleButton}.
 */
export interface SettingsToggleButtonConfig extends ToggleButtonConfig {
    /**
     * The settings panel whose visibility the button should toggle.
     */
    settingsPanel: SettingsPanel;
    /**
     * Decides if the button should be automatically hidden when the settings panel does not contain any active settings.
     * Default: true
     */
    autoHideWhenNoActiveSettings?: boolean;
}
/**
 * A button that toggles visibility of a settings panel.
 */
export declare class SettingsToggleButton extends ToggleButton<SettingsToggleButtonConfig> {
    constructor(config: SettingsToggleButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
