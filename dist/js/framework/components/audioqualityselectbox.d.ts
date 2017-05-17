import { SelectBox } from './selectbox';
import { ListSelectorConfig } from './listselector';
import { UIInstanceManager } from '../uimanager';
/**
 * A select box providing a selection between 'auto' and the available audio qualities.
 */
export declare class AudioQualitySelectBox extends SelectBox {
    constructor(config?: ListSelectorConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
