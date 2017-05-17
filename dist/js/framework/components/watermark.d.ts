import { ClickOverlay, ClickOverlayConfig } from './clickoverlay';
/**
 * Configuration interface for a {@link ClickOverlay}.
 */
export interface WatermarkConfig extends ClickOverlayConfig {
}
/**
 * A watermark overlay with a clickable logo.
 */
export declare class Watermark extends ClickOverlay {
    constructor(config?: WatermarkConfig);
}
