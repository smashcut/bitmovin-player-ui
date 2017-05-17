import { UIContainer } from './components/uicontainer';
import { Component, ComponentConfig } from './components/component';
import { SeekBar } from './components/seekbar';
import { NoArgs, EventDispatcher, CancelEventArgs } from './eventdispatcher';
import Player = bitmovin.player.Player;
export interface UIRecommendationConfig {
    title: string;
    url: string;
    thumbnail?: string;
    duration?: number;
}
export interface TimelineMarker {
    time: number;
    title?: string;
    markerType?: string;
    comment?: string;
    avatar?: string;
    number?: string;
}
export interface UIConfig {
    metadata?: {
        title?: string;
        description?: string;
        markers?: TimelineMarker[];
    };
    recommendations?: UIRecommendationConfig[];
}
/**
 * The context that will be passed to a {@link UIConditionResolver} to determine if it's conditions fulfil the context.
 */
export interface UIConditionContext {
    isAd: boolean;
    isAdWithUI: boolean;
    isFullscreen: boolean;
    isMobile: boolean;
    documentWidth: number;
    width: number;
}
/**
 * Resolves the conditions of its associated UI in a {@link UIVariant} upon a {@link UIConditionContext} and decides
 * if the UI should be displayed. If it returns true, the UI is a candidate for display; if it returns false, it will
 * not be displayed in the given context.
 */
export interface UIConditionResolver {
    (context: UIConditionContext): boolean;
}
/**
 * Associates a UI instance with an optional {@link UIConditionResolver} that determines if the UI should be displayed.
 */
export interface UIVariant {
    ui: UIContainer;
    condition?: UIConditionResolver;
}
export declare class UIManager {
    private player;
    private playerElement;
    private uiVariants;
    private uiInstanceManagers;
    private currentUi;
    private config;
    private managerPlayerWrapper;
    /**
     * Creates a UI manager with a single UI variant that will be permanently shown.
     * @param player the associated player of this UI
     * @param ui the UI to add to the player
     * @param config optional UI configuration
     */
    constructor(player: Player, ui: UIContainer, config?: UIConfig);
    /**
     * Creates a UI manager with a list of UI variants that will be dynamically selected and switched according to
     * the context of the UI.
     *
     * Every time the UI context changes, the conditions of the UI variants will be sequentially resolved and the first
     * UI, whose condition evaluates to true, will be selected and displayed. The last variant in the list might omit the
     * condition resolver and will be selected as default/fallback UI when all other conditions fail. If there is no
     * fallback UI and all conditions fail, no UI will be displayed.
     *
     * @param player the associated player of this UI
     * @param uiVariants a list of UI variants that will be dynamically switched
     * @param config optional UI configuration
     */
    constructor(player: Player, uiVariants: UIVariant[], config?: UIConfig);
    getConfig(): UIConfig;
    private addUi(ui);
    private releaseUi(ui);
    release(): void;
}
export declare namespace UIManager.Factory {
    function buildDefaultUI(player: Player, config?: UIConfig): UIManager;
    function buildDefaultSmallScreenUI(player: Player, config?: UIConfig): UIManager;
    function buildDefaultCastReceiverUI(player: Player, config?: UIConfig): UIManager;
    function buildModernUI(player: Player, config?: UIConfig): UIManager;
    function buildModernSmallScreenUI(player: Player, config?: UIConfig): UIManager;
    function buildModernCastReceiverUI(player: Player, config?: UIConfig): UIManager;
    function buildLegacyUI(player: Player, config?: UIConfig): UIManager;
    function buildLegacyCastReceiverUI(player: Player, config?: UIConfig): UIManager;
    function buildLegacyTestUI(player: Player, config?: UIConfig): UIManager;
}
export interface SeekPreviewArgs extends NoArgs {
    /**
     * The timeline position in percent where the event originates from.
     */
    position: number;
    /**
     * The timeline marker associated with the current position, if existing.
     */
    marker?: TimelineMarker;
}
/**
 * Encapsulates functionality to manage a UI instance. Used by the {@link UIManager} to manage multiple UI instances.
 */
export declare class UIInstanceManager {
    private playerWrapper;
    private ui;
    private config;
    private events;
    constructor(player: Player, ui: UIContainer, config?: UIConfig);
    getConfig(): UIConfig;
    getUI(): UIContainer;
    getPlayer(): Player;
    /**
     * Fires when the UI is fully configured and added to the DOM.
     * @returns {EventDispatcher}
     */
    readonly onConfigured: EventDispatcher<UIContainer, NoArgs>;
    /**
     * Fires when a seek starts.
     * @returns {EventDispatcher}
     */
    readonly onSeek: EventDispatcher<SeekBar, NoArgs>;
    /**
     * Fires when the seek timeline is scrubbed.
     * @returns {EventDispatcher}
     */
    readonly onSeekPreview: EventDispatcher<SeekBar, SeekPreviewArgs>;
    /**
     * Fires when a seek is finished.
     * @returns {EventDispatcher}
     */
    readonly onSeeked: EventDispatcher<SeekBar, NoArgs>;
    /**
     * Fires when a component is showing.
     * @returns {EventDispatcher}
     */
    readonly onComponentShow: EventDispatcher<Component<ComponentConfig>, NoArgs>;
    /**
     * Fires when a component is hiding.
     * @returns {EventDispatcher}
     */
    readonly onComponentHide: EventDispatcher<Component<ComponentConfig>, NoArgs>;
    /**
     * Fires when the UI controls are showing.
     * @returns {EventDispatcher}
     */
    readonly onControlsShow: EventDispatcher<UIContainer, NoArgs>;
    /**
     * Fires before the UI controls are hiding to check if they are allowed to hide.
     * @returns {EventDispatcher}
     */
    readonly onPreviewControlsHide: EventDispatcher<UIContainer, CancelEventArgs>;
    /**
     * Fires when the UI controls are hiding.
     * @returns {EventDispatcher}
     */
    readonly onControlsHide: EventDispatcher<UIContainer, NoArgs>;
    protected clearEventHandlers(): void;
}
