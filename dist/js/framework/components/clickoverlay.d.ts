import { Button, ButtonConfig } from './button';
/**
 * Configuration interface for a {@link ClickOverlay}.
 */
export interface ClickOverlayConfig extends ButtonConfig {
    /**
     * The url to open when the overlay is clicked. Set to null to disable the click handler.
     */
    url?: string;
}
/**
 * A click overlay that opens an url in a new tab if clicked.
 */
export declare class ClickOverlay extends Button<ClickOverlayConfig> {
    constructor(config?: ClickOverlayConfig);
    initialize(): void;
    /**
     * Gets the URL that should be followed when the watermark is clicked.
     * @returns {string} the watermark URL
     */
    getUrl(): string;
    setUrl(url: string): void;
}
