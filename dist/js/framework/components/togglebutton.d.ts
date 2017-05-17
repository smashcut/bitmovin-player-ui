import { Button, ButtonConfig } from './button';
import { NoArgs, Event } from '../eventdispatcher';
/**
 * Configuration interface for a toggle button component.
 */
export interface ToggleButtonConfig extends ButtonConfig {
    /**
     * The text on the button.
     */
    text?: string;
}
/**
 * A button that can be toggled between 'on' and 'off' states.
 */
export declare class ToggleButton<Config extends ToggleButtonConfig> extends Button<ToggleButtonConfig> {
    private static readonly CLASS_ON;
    private static readonly CLASS_OFF;
    private onState;
    private toggleButtonEvents;
    constructor(config: ToggleButtonConfig);
    /**
     * Toggles the button to the 'on' state.
     */
    on(): void;
    /**
     * Toggles the button to the 'off' state.
     */
    off(): void;
    /**
     * Toggle the button 'on' if it is 'off', or 'off' if it is 'on'.
     */
    toggle(): void;
    /**
     * Checks if the toggle button is in the 'on' state.
     * @returns {boolean} true if button is 'on', false if 'off'
     */
    isOn(): boolean;
    /**
     * Checks if the toggle button is in the 'off' state.
     * @returns {boolean} true if button is 'off', false if 'on'
     */
    isOff(): boolean;
    protected onClickEvent(): void;
    protected onToggleEvent(): void;
    protected onToggleOnEvent(): void;
    protected onToggleOffEvent(): void;
    /**
     * Gets the event that is fired when the button is toggled.
     * @returns {Event<ToggleButton<Config>, NoArgs>}
     */
    readonly onToggle: Event<ToggleButton<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the button is toggled 'on'.
     * @returns {Event<ToggleButton<Config>, NoArgs>}
     */
    readonly onToggleOn: Event<ToggleButton<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the button is toggled 'off'.
     * @returns {Event<ToggleButton<Config>, NoArgs>}
     */
    readonly onToggleOff: Event<ToggleButton<Config>, NoArgs>;
}
