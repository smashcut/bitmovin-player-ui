import { ClickOverlay } from './clickoverlay';
import { UIInstanceManager } from '../uimanager';
/**
 * A simple click capture overlay for clickThroughUrls of ads.
 */
export declare class AdClickOverlay extends ClickOverlay {
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
