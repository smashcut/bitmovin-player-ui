import { Component, ComponentConfig } from './component';
/**
 * A dummy component that just reserves some space and does nothing else.
 */
export declare class Spacer extends Component<ComponentConfig> {
    constructor(config?: ComponentConfig);
    protected onShowEvent(): void;
    protected onHideEvent(): void;
    protected onHoverChangedEvent(hovered: boolean): void;
}
