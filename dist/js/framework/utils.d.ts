import { Event, NoArgs } from './eventdispatcher';
import { Component, ComponentConfig } from './components/component';
export declare namespace ArrayUtils {
    /**
     * Removes an item from an array.
     * @param array the array that may contain the item to remove
     * @param item the item to remove from the array
     * @returns {any} the removed item or null if it wasn't part of the array
     */
    function remove<T>(array: T[], item: T): T | null;
}
export declare namespace StringUtils {
    let FORMAT_HHMMSS: string;
    let FORMAT_MMSS: string;
    /**
     * Formats a number of seconds into a time string with the pattern hh:mm:ss.
     *
     * @param totalSeconds the total number of seconds to format to string
     * @param format the time format to output (default: hh:mm:ss)
     * @returns {string} the formatted time string
     */
    function secondsToTime(totalSeconds: number, format?: string): string;
    /**
     * Fills out placeholders in an ad message.
     *
     * Has the placeholders '{remainingTime[formatString]}', '{playedTime[formatString]}' and
     * '{adDuration[formatString]}', which are replaced by the remaining time until the ad can be skipped, the current
     * time or the ad duration. The format string is optional. If not specified, the placeholder is replaced by the time
     * in seconds. If specified, it must be of the following format:
     * - %d - Inserts the time as an integer.
     * - %0Nd - Inserts the time as an integer with leading zeroes, if the length of the time string is smaller than N.
     * - %f - Inserts the time as a float.
     * - %0Nf - Inserts the time as a float with leading zeroes.
     * - %.Mf - Inserts the time as a float with M decimal places. Can be combined with %0Nf, e.g. %04.2f (the time
     * 10.123
     * would be printed as 0010.12).
     * - %hh:mm:ss
     * - %mm:ss
     *
     * @param adMessage an ad message with optional placeholders to fill
     * @param skipOffset if specified, {remainingTime} will be filled with the remaining time until the ad can be skipped
     * @param player the player to get the time data from
     * @returns {string} the ad message with filled placeholders
     */
    function replaceAdMessagePlaceholders(adMessage: string, skipOffset: number, player: bitmovin.player.Player): string;
}
export declare namespace PlayerUtils {
    import Player = bitmovin.player.Player;
    enum PlayerState {
        IDLE = 0,
        PREPARED = 1,
        PLAYING = 2,
        PAUSED = 3,
        FINISHED = 4,
    }
    function isSourceLoaded(player: Player): boolean;
    function isTimeShiftAvailable(player: Player): boolean;
    function getState(player: Player): PlayerState;
    interface TimeShiftAvailabilityChangedArgs extends NoArgs {
        timeShiftAvailable: boolean;
    }
    class TimeShiftAvailabilityDetector {
        private timeShiftAvailabilityChangedEvent;
        constructor(player: Player);
        readonly onTimeShiftAvailabilityChanged: Event<Player, TimeShiftAvailabilityChangedArgs>;
    }
    interface LiveStreamDetectorEventArgs extends NoArgs {
        live: boolean;
    }
    /**
     * Detects changes of the stream type, i.e. changes of the return value of the player#isLive method.
     * Normally, a stream cannot change its type during playback, it's either VOD or live. Due to bugs on some
     * platforms or browsers, it can still change. It is therefore unreliable to just check #isLive and this detector
     * should be used as a workaround instead.
     *
     * Known cases:
     *
     * - HLS VOD on Android 4.3
     * Video duration is initially 'Infinity' and only gets available after playback starts, so streams are wrongly
     * reported as 'live' before playback (the live-check in the player checks for infinite duration).
     */
    class LiveStreamDetector {
        private liveChangedEvent;
        constructor(player: Player);
        readonly onLiveChanged: Event<Player, LiveStreamDetectorEventArgs>;
    }
}
export declare namespace UIUtils {
    interface TreeTraversalCallback {
        (component: Component<ComponentConfig>, parent?: Component<ComponentConfig>): void;
    }
    function traverseTree(component: Component<ComponentConfig>, visit: TreeTraversalCallback): void;
}
export declare namespace BrowserUtils {
    const isMobile: boolean;
    const isChrome: boolean;
    const isAndroid: boolean;
}
