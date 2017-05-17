import { SelectBox } from './selectbox';
import { ListSelectorConfig } from './listselector';
import { UIInstanceManager } from '../uimanager';
/**
 * A select box providing a selection of different playback speeds.
 */
export declare class PlaybackSpeedSelectBox extends SelectBox {
    constructor(config?: ListSelectorConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
