import { ContainerConfig, Container } from './container';
import { SelectBox } from './selectbox';
import { UIInstanceManager } from '../uimanager';
import { Event, NoArgs } from '../eventdispatcher';
/**
 * Configuration interface for a {@link SettingsPanel}.
 */
export interface SettingsPanelConfig extends ContainerConfig {
    /**
     * The delay in milliseconds after which the settings panel will be hidden when there is no user interaction.
     * Set to -1 to disable automatic hiding.
     * Default: 3 seconds (3000)
     */
    hideDelay?: number;
}
/**
 * A panel containing a list of {@link SettingsPanelItem items} that represent labelled settings.
 */
export declare class SettingsPanel extends Container<SettingsPanelConfig> {
    private static readonly CLASS_LAST;
    private settingsPanelEvents;
    private hideTimeout;
    constructor(config: SettingsPanelConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    release(): void;
    /**
     * Checks if there are active settings within this settings panel. An active setting is a setting that is visible
     * and enabled, which the user can interact with.
     * @returns {boolean} true if there are active settings, false if the panel is functionally empty to a user
     */
    hasActiveSettings(): boolean;
    private getItems();
    protected onSettingsStateChangedEvent(): void;
    /**
     * Gets the event that is fired when one or more {@link SettingsPanelItem items} have changed state.
     * @returns {Event<SettingsPanel, NoArgs>}
     */
    readonly onSettingsStateChanged: Event<SettingsPanel, NoArgs>;
}
/**
 * An item for a {@link SettingsPanel}, containing a {@link Label} and a component that configures a setting.
 * Supported setting components: {@link SelectBox}
 */
export declare class SettingsPanelItem extends Container<ContainerConfig> {
    private label;
    private setting;
    private settingsPanelItemEvents;
    constructor(label: string, selectBox: SelectBox, config?: ContainerConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    /**
     * Checks if this settings panel item is active, i.e. visible and enabled and a user can interact with it.
     * @returns {boolean} true if the panel is active, else false
     */
    isActive(): boolean;
    protected onActiveChangedEvent(): void;
    /**
     * Gets the event that is fired when the 'active' state of this item changes.
     * @see #isActive
     * @returns {Event<SettingsPanelItem, NoArgs>}
     */
    readonly onActiveChanged: Event<SettingsPanelItem, NoArgs>;
}
