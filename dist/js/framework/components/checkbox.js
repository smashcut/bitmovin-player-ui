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
var container_1 = require("./container");
var label_1 = require("./label");
var eventdispatcher_1 = require("../eventdispatcher");
var Checkbox = (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox(config) {
        if (config === void 0) { config = { text: '' }; }
        var _this = _super.call(this, config) || this;
        _this.buttonEvents = {
            onClick: new eventdispatcher_1.EventDispatcher()
        };
        _this.label = new label_1.Label({ cssClasses: ['checkbox-label'], text: config.text });
        _this.button = new togglebutton_1.ToggleButton({ cssClasses: ['checkbox-button'] });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-checkbox',
            components: [_this.button, _this.label]
        }, _this.config);
        return _this;
    }
    Checkbox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        // Listen for the click event on the element and
        // trigger the corresponding event on the button component
        this.getDomElement().on('click', function () {
            _this.onClickEvent();
            _this.button.toggle();
        });
    };
    /**
     * Sets arbitrary text on the label.
     * @param text the text to show on the label
     */
    Checkbox.prototype.setText = function (text) {
        this.label.setText(text);
    };
    Checkbox.prototype.onClickEvent = function () {
        this.buttonEvents.onClick.dispatch(this);
    };
    Object.defineProperty(Checkbox.prototype, "onClick", {
        /**
         * Gets the event that is fired when the button is clicked.
         * @returns {Event<Checkbox, NoArgs>}
         */
        get: function () {
            return this.buttonEvents.onClick.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    return Checkbox;
}(container_1.Container));
exports.Checkbox = Checkbox;
