import {Button, ButtonConfig} from './button';

export class ReturnButton extends Button<ButtonConfig> {

  constructor(config: ButtonConfig = {}) {
    super(config);
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-return-button',
      text: 'Return'
    }, this.config);
  }

  configure(): void {
    this.onClick.subscribe(e => window.history.back());
  }

}