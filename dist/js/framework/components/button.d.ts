import { ComponentConfig, Component } from './component';
import { DOM } from '../dom';
import { NoArgs, Event } from '../eventdispatcher';
/**
 * Configuration interface for a {@link Button} component.
 */
export interface ButtonConfig extends ComponentConfig {
    /**
     * The text on the button.
     */
    text?: string;
}
/**
 * A simple clickable button.
 */
export declare class Button<Config extends ButtonConfig> extends Component<ButtonConfig> {
    private buttonEvents;
    constructor(config: ButtonConfig);
    protected toDomElement(): DOM;
    /**
     * Sets text on the label of the button.
     * @param text the text to put into the label of the button
     */
    setText(text: string): void;
    protected onClickEvent(): void;
    /**
     * Gets the event that is fired when the button is clicked.
     * @returns {Event<Button<Config>, NoArgs>}
     */
    readonly onClick: Event<Button<Config>, NoArgs>;
}
