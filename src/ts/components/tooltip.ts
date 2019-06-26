import { ContainerConfig, Container } from './container';

export class Tooltip extends Container<ContainerConfig> {

    private label: string;

    constructor(config: ContainerConfig = {}) {
        super(config);
        this.config = this.mergeConfig({}, { cssClass: 'ui-tooltip-box' }, this.config);
        this.label = '';
        this.setText(this.label, 10000, 10000)
    }
    setText(text: string, left: number, top: number) {
        this.label = text;
        this.getDomElement()
            .html(text)
            .css({
                'left': left + 'px',
                'top': top + 'px'
            });
    }
}