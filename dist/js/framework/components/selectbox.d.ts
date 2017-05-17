import { ListSelector, ListSelectorConfig } from './listselector';
import { DOM } from '../dom';
/**
 * A simple select box providing the possibility to select a single item out of a list of available items.
 *
 * DOM example:
 * <code>
 *     <select class='ui-selectbox'>
 *         <option value='key'>label</option>
 *         ...
 *     </select>
 * </code>
 */
export declare class SelectBox extends ListSelector<ListSelectorConfig> {
    private selectElement;
    constructor(config?: ListSelectorConfig);
    protected toDomElement(): DOM;
    protected updateDomItems(selectedValue?: string): void;
    protected onItemAddedEvent(value: string): void;
    protected onItemRemovedEvent(value: string): void;
    protected onItemSelectedEvent(value: string, updateDomItems?: boolean): void;
}
