import { LabelConfig, Label } from './label';
import { UIInstanceManager } from '../uimanager';
/**
 * Enumerates the types of content that the {@link MetadataLabel} can display.
 */
export declare enum MetadataLabelContent {
    /**
     * Title of the data source.
     */
    Title = 0,
    /**
     * Description fo the data source.
     */
    Description = 1,
}
/**
 * Configuration interface for {@link MetadataLabel}.
 */
export interface MetadataLabelConfig extends LabelConfig {
    /**
     * The type of content that should be displayed in the label.
     */
    content: MetadataLabelContent;
}
/**
 * A label that can be configured to display certain metadata.
 */
export declare class MetadataLabel extends Label<MetadataLabelConfig> {
    constructor(config: MetadataLabelConfig);
    configure(player: bitmovin.player.Player, uimanager: UIInstanceManager): void;
}
