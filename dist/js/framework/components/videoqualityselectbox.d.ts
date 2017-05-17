import { SelectBox } from './selectbox';
import { ListSelectorConfig } from './listselector';
import { UIInstanceManager } from '../uimanager';
/**
 * A select box providing a selection between 'auto' and the available video qualities.
 */
export declare class VideoQualitySelectBox extends SelectBox {
    constructor(config?: ListSelectorConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
