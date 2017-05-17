import { UIInstanceManager } from '../uimanager';
import { Container, ContainerConfig } from './container';
import { Event, NoArgs } from '../eventdispatcher';
/**
 * Configuration interface for a {@link Checkbox}.
 */
export interface CheckboxConfig extends ContainerConfig {
    /**
     * The label for the checkbox.
     */
    text: string;
}
export declare class Checkbox extends Container<CheckboxConfig> {
    private label;
    private button;
    private buttonEvents;
    constructor(config?: CheckboxConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
    /**
     * Sets arbitrary text on the label.
     * @param text the text to show on the label
     */
    setText(text: string): void;
    protected onClickEvent(): void;
    /**
     * Gets the event that is fired when the button is clicked.
     * @returns {Event<Checkbox, NoArgs>}
     */
    readonly onClick: Event<Checkbox, NoArgs>;
}
