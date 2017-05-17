import { Component, ComponentConfig } from './component';
import { DOM } from '../dom';
/**
 * Animated analog TV static noise.
 */
export declare class TvNoiseCanvas extends Component<ComponentConfig> {
    private canvas;
    private canvasElement;
    private canvasContext;
    private canvasWidth;
    private canvasHeight;
    private interferenceHeight;
    private lastFrameUpdate;
    private frameInterval;
    private useAnimationFrame;
    private noiseAnimationWindowPos;
    private frameUpdateHandlerId;
    constructor(config?: ComponentConfig);
    protected toDomElement(): DOM;
    start(): void;
    stop(): void;
    private renderFrame();
    private scheduleNextRender();
}
