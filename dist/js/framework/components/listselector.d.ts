import { Component, ComponentConfig } from './component';
import { Event } from '../eventdispatcher';
/**
 * A map of items (key/value -> label} for a {@link ListSelector} in a {@link ListSelectorConfig}.
 */
export interface ListItem {
    key: string;
    label: string;
}
/**
 * Configuration interface for a {@link ListSelector}.
 */
export interface ListSelectorConfig extends ComponentConfig {
    items?: ListItem[];
}
export declare abstract class ListSelector<Config extends ListSelectorConfig> extends Component<ListSelectorConfig> {
    protected items: ListItem[];
    protected selectedItem: string;
    private listSelectorEvents;
    constructor(config?: ListSelectorConfig);
    private getItemIndex(key);
    /**
     * Checks if the specified item is part of this selector.
     * @param key the key of the item to check
     * @returns {boolean} true if the item is part of this selector, else false
     */
    hasItem(key: string): boolean;
    /**
     * Adds an item to this selector by appending it to the end of the list of items. If an item with the specified
     * key already exists, it is replaced.
     * @param key the key of the item to add
     * @param label the (human-readable) label of the item to add
     */
    addItem(key: string, label: string): void;
    /**
     * Removes an item from this selector.
     * @param key the key of the item to remove
     * @returns {boolean} true if removal was successful, false if the item is not part of this selector
     */
    removeItem(key: string): boolean;
    /**
     * Selects an item from the items in this selector.
     * @param key the key of the item to select
     * @returns {boolean} true is the selection was successful, false if the selected item is not part of the selector
     */
    selectItem(key: string): boolean;
    /**
     * Returns the key of the selected item.
     * @returns {string} the key of the selected item or null if no item is selected
     */
    getSelectedItem(): string | null;
    /**
     * Removes all items from this selector.
     */
    clearItems(): void;
    /**
     * Returns the number of items in this selector.
     * @returns {number}
     */
    itemCount(): number;
    protected onItemAddedEvent(key: string): void;
    protected onItemRemovedEvent(key: string): void;
    protected onItemSelectedEvent(key: string): void;
    /**
     * Gets the event that is fired when an item is added to the list of items.
     * @returns {Event<ListSelector<Config>, string>}
     */
    readonly onItemAdded: Event<ListSelector<Config>, string>;
    /**
     * Gets the event that is fired when an item is removed from the list of items.
     * @returns {Event<ListSelector<Config>, string>}
     */
    readonly onItemRemoved: Event<ListSelector<Config>, string>;
    /**
     * Gets the event that is fired when an item is selected from the list of items.
     * @returns {Event<ListSelector<Config>, string>}
     */
    readonly onItemSelected: Event<ListSelector<Config>, string>;
}
