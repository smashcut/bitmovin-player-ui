import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import SkipMessage = bitmovin.player.SkipMessage;
/**
 * Configuration interface for the {@link AdSkipButton}.
 */
export interface AdSkipButtonConfig extends ButtonConfig {
    skipMessage?: SkipMessage;
}
/**
 * A button that is displayed during ads and can be used to skip the ad.
 */
export declare class AdSkipButton extends Button<AdSkipButtonConfig> {
    constructor(config?: AdSkipButtonConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
