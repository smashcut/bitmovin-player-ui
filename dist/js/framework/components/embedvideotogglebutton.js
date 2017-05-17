"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var togglebutton_1 = require("./togglebutton");
/**
 * A button that toggles visibility of a embedVideo panel.
 */
var EmbedVideoToggleButton = (function (_super) {
    __extends(EmbedVideoToggleButton, _super);
    function EmbedVideoToggleButton(config) {
        var _this = _super.call(this, config) || this;
        if (!config.embedVideoPanel) {
            throw new Error('Required EmbedVideoPanel is missing');
        }
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-embedvideo-togglebutton',
            text: 'Embed Video',
            embedVideoPanel: null
        }, _this.config);
        return _this;
    }
    EmbedVideoToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig(); // TODO fix generics type inference
        var embedVideoPanel = config.embedVideoPanel;
        this.onClick.subscribe(function () {
            console.log('onClick hidden:', embedVideoPanel.isHidden());
            embedVideoPanel.toggleHidden();
        });
        embedVideoPanel.onShow.subscribe(function () {
            // Set toggle status to on when the embedVideo panel shows
            _this.on();
        });
        embedVideoPanel.onHide.subscribe(function () {
            // Set toggle status to off when the embedVideo panel hides
            _this.off();
        });
    };
    return EmbedVideoToggleButton;
}(togglebutton_1.ToggleButton));
exports.EmbedVideoToggleButton = EmbedVideoToggleButton;
