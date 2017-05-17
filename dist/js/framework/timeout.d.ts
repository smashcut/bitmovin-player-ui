/**
 * Executes a callback after a specified amount of time,
 * optionally repeatedly until stopped. When delay is <= 0
 * the timeout is disabled
 */
export declare class Timeout {
    private delay;
    private callback;
    private repeat;
    private timeoutHandle;
    /**
     * Creates a new timeout callback handler.
     * @param delay the delay in milliseconds after which the callback should be executed
     * @param callback the callback to execute after the delay time
     * @param repeat if true, call the callback repeatedly in delay intervals
     */
    constructor(delay: number, callback: () => void, repeat?: boolean);
    /**
     * Starts the timeout and calls the callback when the timeout delay has passed.
     * @returns {Timeout} the current timeout (so the start call can be chained to the constructor)
     */
    start(): this;
    /**
     * Clears the timeout. The callback will not be called if clear is called during the timeout.
     */
    clear(): void;
    /**
     * Resets the passed timeout delay to zero. Can be used to defer the calling of the callback.
     */
    reset(): void;
}
