import { SelectBox } from './selectbox';
import { ListSelectorConfig } from './listselector';
import { UIInstanceManager } from '../uimanager';
/**
 * A select box providing a selection between available audio tracks (e.g. different languages).
 */
export declare class AudioTrackSelectBox extends SelectBox {
    constructor(config?: ListSelectorConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
