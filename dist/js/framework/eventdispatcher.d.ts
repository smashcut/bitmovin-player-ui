/**
 * Function interface for event listeners on the {@link EventDispatcher}.
 */
export interface EventListener<Sender, Args> {
    (sender: Sender, args: Args): void;
}
/**
 * Empty type for creating {@link EventDispatcher event dispatchers} that do not carry any arguments.
 */
export interface NoArgs {
}
/**
 * Event args for an event that can be canceled.
 */
export interface CancelEventArgs extends NoArgs {
    /**
     * Gets or sets a flag whether the event should be canceled.
     */
    cancel?: boolean;
}
/**
 * Public interface that represents an event. Can be used to subscribe to and unsubscribe from events.
 */
export interface Event<Sender, Args> {
    /**
     * Subscribes an event listener to this event dispatcher.
     * @param listener the listener to add
     */
    subscribe(listener: EventListener<Sender, Args>): void;
    /**
     * Subscribes an event listener to this event dispatcher that is only called once.
     * @param listener the listener to add
     */
    subscribeOnce(listener: EventListener<Sender, Args>): void;
    /**
     * Subscribes an event listener to this event dispatcher that will be called at a limited rate with a minimum
     * interval of the specified milliseconds.
     * @param listener the listener to add
     * @param rateMs the rate in milliseconds to which calling of the listeners should be limited
     */
    subscribeRateLimited(listener: EventListener<Sender, Args>, rateMs: number): void;
    /**
     * Unsubscribes a subscribed event listener from this dispatcher.
     * @param listener the listener to remove
     * @returns {boolean} true if the listener was successfully unsubscribed, false if it isn't subscribed on this
     *   dispatcher
     */
    unsubscribe(listener: EventListener<Sender, Args>): boolean;
}
/**
 * Event dispatcher to subscribe and trigger events. Each event should have its own dispatcher.
 */
export declare class EventDispatcher<Sender, Args> implements Event<Sender, Args> {
    private listeners;
    constructor();
    /**
     * {@inheritDoc}
     */
    subscribe(listener: EventListener<Sender, Args>): void;
    /**
     * {@inheritDoc}
     */
    subscribeOnce(listener: EventListener<Sender, Args>): void;
    /**
     * {@inheritDoc}
     */
    subscribeRateLimited(listener: EventListener<Sender, Args>, rateMs: number): void;
    /**
     * {@inheritDoc}
     */
    unsubscribe(listener: EventListener<Sender, Args>): boolean;
    /**
     * Removes all listeners from this dispatcher.
     */
    unsubscribeAll(): void;
    /**
     * Dispatches an event to all subscribed listeners.
     * @param sender the source of the event
     * @param args the arguments for the event
     */
    dispatch(sender: Sender, args?: Args): void;
    /**
     * Returns the event that this dispatcher manages and on which listeners can subscribe and unsubscribe event handlers.
     * @returns {Event}
     */
    getEvent(): Event<Sender, Args>;
}
