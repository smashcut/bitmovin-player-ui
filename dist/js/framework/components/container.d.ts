import { ComponentConfig, Component } from './component';
import { DOM } from '../dom';
/**
 * Configuration interface for a {@link Container}.
 */
export interface ContainerConfig extends ComponentConfig {
    /**
     * Child components of the container.
     */
    components?: Component<ComponentConfig>[];
}
/**
 * A container component that can contain a collection of child components.
 * Components can be added at construction time through the {@link ContainerConfig#components} setting, or later
 * through the {@link Container#addComponent} method. The UIManager automatically takes care of all components, i.e. it
 * initializes and configures them automatically.
 *
 * In the DOM, the container consists of an outer <div> (that can be configured by the config) and an inner wrapper
 * <div> that contains the components. This double-<div>-structure is often required to achieve many advanced effects
 * in CSS and/or JS, e.g. animations and certain formatting with absolute positioning.
 *
 * DOM example:
 * <code>
 *     <div class='ui-container'>
 *         <div class='container-wrapper'>
 *             ... child components ...
 *         </div>
 *     </div>
 * </code>
 */
export declare class Container<Config extends ContainerConfig> extends Component<ContainerConfig> {
    /**
     * A reference to the inner element that contains the components of the container.
     */
    private innerContainerElement;
    constructor(config: ContainerConfig);
    /**
     * Adds a child component to the container.
     * @param component the component to add
     */
    addComponent(component: Component<ComponentConfig>): void;
    /**
     * Removes a child component from the container.
     * @param component the component to remove
     * @returns {boolean} true if the component has been removed, false if it is not contained in this container
     */
    removeComponent(component: Component<ComponentConfig>): boolean;
    /**
     * Gets an array of all child components in this container.
     * @returns {Component<ComponentConfig>[]}
     */
    getComponents(): Component<ComponentConfig>[];
    /**
     * Removes all child components from the container.
     */
    removeComponents(): void;
    /**
     * Updates the DOM of the container with the current components.
     */
    protected updateComponents(): void;
    protected toDomElement(): DOM;
}
