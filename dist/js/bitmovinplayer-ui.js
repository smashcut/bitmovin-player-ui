(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var clickoverlay_1 = require("./clickoverlay");
/**
 * A simple click capture overlay for clickThroughUrls of ads.
 */
var AdClickOverlay = (function (_super) {
    __extends(AdClickOverlay, _super);
    function AdClickOverlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdClickOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var clickThroughUrl = null;
        var clickThroughEnabled = !player.getConfig().advertising
            || !player.getConfig().advertising.hasOwnProperty('clickThroughEnabled')
            || player.getConfig().advertising.clickThroughEnabled;
        player.addEventHandler(player.EVENT.ON_AD_STARTED, function (event) {
            clickThroughUrl = event.clickThroughUrl;
            if (clickThroughEnabled) {
                _this.setUrl(clickThroughUrl);
            }
            else {
                // If click-through is disabled, we set the url to null to avoid it open
                _this.setUrl(null);
            }
        });
        // Clear click-through URL when ad has finished
        var adFinishedHandler = function () {
            _this.setUrl(null);
        };
        player.addEventHandler(player.EVENT.ON_AD_FINISHED, adFinishedHandler);
        player.addEventHandler(player.EVENT.ON_AD_SKIPPED, adFinishedHandler);
        player.addEventHandler(player.EVENT.ON_AD_ERROR, adFinishedHandler);
        this.onClick.subscribe(function () {
            // Pause the ad when overlay is clicked
            player.pause('ui-content-click');
            // Notify the player of the clicked ad
            player.fireEvent(player.EVENT.ON_AD_CLICKED, {
                clickThroughUrl: clickThroughUrl
            });
        });
    };
    return AdClickOverlay;
}(clickoverlay_1.ClickOverlay));
exports.AdClickOverlay = AdClickOverlay;

},{"./clickoverlay":12}],2:[function(require,module,exports){
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
var label_1 = require("./label");
var utils_1 = require("../utils");
/**
 * A label that displays a message about a running ad, optionally with a countdown.
 */
var AdMessageLabel = (function (_super) {
    __extends(AdMessageLabel, _super);
    function AdMessageLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-label-ad-message',
            text: 'This ad will end in {remainingTime} seconds.'
        }, _this.config);
        return _this;
    }
    AdMessageLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var text = this.getConfig().text;
        var updateMessageHandler = function () {
            _this.setText(utils_1.StringUtils.replaceAdMessagePlaceholders(text, null, player));
        };
        var adStartHandler = function (event) {
            text = event.adMessage || text;
            updateMessageHandler();
            player.addEventHandler(player.EVENT.ON_TIME_CHANGED, updateMessageHandler);
            player.addEventHandler(player.EVENT.ON_CAST_TIME_UPDATED, updateMessageHandler);
        };
        var adEndHandler = function () {
            player.removeEventHandler(player.EVENT.ON_TIME_CHANGED, updateMessageHandler);
            player.removeEventHandler(player.EVENT.ON_CAST_TIME_UPDATED, updateMessageHandler);
        };
        player.addEventHandler(player.EVENT.ON_AD_STARTED, adStartHandler);
        player.addEventHandler(player.EVENT.ON_AD_SKIPPED, adEndHandler);
        player.addEventHandler(player.EVENT.ON_AD_ERROR, adEndHandler);
        player.addEventHandler(player.EVENT.ON_AD_FINISHED, adEndHandler);
    };
    return AdMessageLabel;
}(label_1.Label));
exports.AdMessageLabel = AdMessageLabel;

},{"../utils":54,"./label":21}],3:[function(require,module,exports){
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
var button_1 = require("./button");
var utils_1 = require("../utils");
/**
 * A button that is displayed during ads and can be used to skip the ad.
 */
var AdSkipButton = (function (_super) {
    __extends(AdSkipButton, _super);
    function AdSkipButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-button-ad-skip',
            skipMessage: {
                countdown: 'Skip ad in {remainingTime}',
                skip: 'Skip ad'
            }
        }, _this.config);
        return _this;
    }
    AdSkipButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig(); // TODO get rid of generic cast
        var skipMessage = config.skipMessage;
        var adEvent = null;
        var updateSkipMessageHandler = function () {
            // Display this button only if ad is skippable
            if (adEvent.skipOffset) {
                _this.show();
            }
            else {
                _this.hide();
            }
            // Update the skip message on the button
            if (player.getCurrentTime() < adEvent.skipOffset) {
                _this.setText(utils_1.StringUtils.replaceAdMessagePlaceholders(config.skipMessage.countdown, adEvent.skipOffset, player));
            }
            else {
                _this.setText(config.skipMessage.skip);
            }
        };
        var adStartHandler = function (event) {
            adEvent = event;
            skipMessage = adEvent.skipMessage || skipMessage;
            updateSkipMessageHandler();
            player.addEventHandler(player.EVENT.ON_TIME_CHANGED, updateSkipMessageHandler);
            player.addEventHandler(player.EVENT.ON_CAST_TIME_UPDATED, updateSkipMessageHandler);
        };
        var adEndHandler = function () {
            player.removeEventHandler(player.EVENT.ON_TIME_CHANGED, updateSkipMessageHandler);
            player.removeEventHandler(player.EVENT.ON_CAST_TIME_UPDATED, updateSkipMessageHandler);
        };
        player.addEventHandler(player.EVENT.ON_AD_STARTED, adStartHandler);
        player.addEventHandler(player.EVENT.ON_AD_SKIPPED, adEndHandler);
        player.addEventHandler(player.EVENT.ON_AD_ERROR, adEndHandler);
        player.addEventHandler(player.EVENT.ON_AD_FINISHED, adEndHandler);
        this.onClick.subscribe(function () {
            // Try to skip the ad (this only works if it is skippable so we don't need to take extra care of that here)
            player.skipAd();
        });
    };
    return AdSkipButton;
}(button_1.Button));
exports.AdSkipButton = AdSkipButton;

},{"../utils":54,"./button":8}],4:[function(require,module,exports){
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
 * A button that toggles Apple AirPlay.
 */
var AirPlayToggleButton = (function (_super) {
    __extends(AirPlayToggleButton, _super);
    function AirPlayToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-airplaytogglebutton',
            text: 'Apple AirPlay'
        }, _this.config);
        return _this;
    }
    AirPlayToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            if (player.isAirplayAvailable()) {
                player.showAirplayTargetPicker();
            }
            else {
                if (console) {
                    console.log('AirPlay unavailable');
                }
            }
        });
        var airPlayAvailableHandler = function () {
            if (player.isAirplayAvailable()) {
                _this.show();
            }
            else {
                _this.hide();
            }
        };
        player.addEventHandler(player.EVENT.ON_AIRPLAY_AVAILABLE, airPlayAvailableHandler);
        // Startup init
        airPlayAvailableHandler(); // Hide button if AirPlay is not available
    };
    return AirPlayToggleButton;
}(togglebutton_1.ToggleButton));
exports.AirPlayToggleButton = AirPlayToggleButton;

},{"./togglebutton":39}],5:[function(require,module,exports){
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
var selectbox_1 = require("./selectbox");
/**
 * A select box providing a selection between 'auto' and the available audio qualities.
 */
var AudioQualitySelectBox = (function (_super) {
    __extends(AudioQualitySelectBox, _super);
    function AudioQualitySelectBox(config) {
        if (config === void 0) { config = {}; }
        return _super.call(this, config) || this;
    }
    AudioQualitySelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var updateAudioQualities = function () {
            var audioQualities = player.getAvailableAudioQualities();
            _this.clearItems();
            // Add entry for automatic quality switching (default setting)
            _this.addItem('auto', 'auto');
            // Add audio qualities
            for (var _i = 0, audioQualities_1 = audioQualities; _i < audioQualities_1.length; _i++) {
                var audioQuality = audioQualities_1[_i];
                _this.addItem(audioQuality.id, audioQuality.label);
            }
        };
        this.onItemSelected.subscribe(function (sender, value) {
            player.setAudioQuality(value);
        });
        // Update qualities when audio track has changed
        player.addEventHandler(player.EVENT.ON_AUDIO_CHANGED, updateAudioQualities);
        // Update qualities when source goes away
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, updateAudioQualities);
        // Update qualities when a new source is loaded
        player.addEventHandler(player.EVENT.ON_READY, updateAudioQualities);
        // Update quality selection when quality is changed (from outside)
        player.addEventHandler(player.EVENT.ON_AUDIO_DOWNLOAD_QUALITY_CHANGE, function () {
            var data = player.getDownloadedAudioData();
            _this.selectItem(data.isAuto ? 'auto' : data.id);
        });
        // Populate qualities at startup
        updateAudioQualities();
    };
    return AudioQualitySelectBox;
}(selectbox_1.SelectBox));
exports.AudioQualitySelectBox = AudioQualitySelectBox;

},{"./selectbox":32}],6:[function(require,module,exports){
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
var selectbox_1 = require("./selectbox");
/**
 * A select box providing a selection between available audio tracks (e.g. different languages).
 */
var AudioTrackSelectBox = (function (_super) {
    __extends(AudioTrackSelectBox, _super);
    function AudioTrackSelectBox(config) {
        if (config === void 0) { config = {}; }
        return _super.call(this, config) || this;
    }
    AudioTrackSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var updateAudioTracks = function () {
            var audioTracks = player.getAvailableAudio();
            _this.clearItems();
            // Add audio tracks
            for (var _i = 0, audioTracks_1 = audioTracks; _i < audioTracks_1.length; _i++) {
                var audioTrack = audioTracks_1[_i];
                _this.addItem(audioTrack.id, audioTrack.label);
            }
        };
        this.onItemSelected.subscribe(function (sender, value) {
            player.setAudio(value);
        });
        var audioTrackHandler = function () {
            var currentAudioTrack = player.getAudio();
            // HLS streams don't always provide this, so we have to check
            if (currentAudioTrack) {
                _this.selectItem(currentAudioTrack.id);
            }
        };
        // Update selection when selected track has changed
        player.addEventHandler(player.EVENT.ON_AUDIO_CHANGED, audioTrackHandler);
        // Update tracks when source goes away
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, updateAudioTracks);
        // Update tracks when a new source is loaded
        player.addEventHandler(player.EVENT.ON_READY, updateAudioTracks);
        // Populate tracks at startup
        updateAudioTracks();
        // When `playback.audioLanguage` is set, the `ON_AUDIO_CHANGED` event for that change is triggered before the
        // UI is created. Therefore we need to set the audio track on configure.
        audioTrackHandler();
    };
    return AudioTrackSelectBox;
}(selectbox_1.SelectBox));
exports.AudioTrackSelectBox = AudioTrackSelectBox;

},{"./selectbox":32}],7:[function(require,module,exports){
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
var container_1 = require("./container");
var component_1 = require("./component");
var timeout_1 = require("../timeout");
/**
 * Overlays the player and displays a buffering indicator.
 */
var BufferingOverlay = (function (_super) {
    __extends(BufferingOverlay, _super);
    function BufferingOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.indicators = [
            new component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator' }),
            new component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator' }),
            new component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator' }),
        ];
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-buffering-overlay',
            hidden: true,
            components: _this.indicators,
            showDelayMs: 1000,
        }, _this.config);
        return _this;
    }
    BufferingOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var overlayShowTimeout = new timeout_1.Timeout(config.showDelayMs, function () {
            _this.show();
        });
        var showOverlay = function () {
            overlayShowTimeout.start();
        };
        var hideOverlay = function () {
            overlayShowTimeout.clear();
            _this.hide();
        };
        player.addEventHandler(player.EVENT.ON_STALL_STARTED, showOverlay);
        player.addEventHandler(player.EVENT.ON_STALL_ENDED, hideOverlay);
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, hideOverlay);
        // Show overlay if player is already stalled at init
        if (player.isStalled()) {
            this.show();
        }
    };
    return BufferingOverlay;
}(container_1.Container));
exports.BufferingOverlay = BufferingOverlay;

},{"../timeout":52,"./component":14,"./container":15}],8:[function(require,module,exports){
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
var component_1 = require("./component");
var dom_1 = require("../dom");
var eventdispatcher_1 = require("../eventdispatcher");
/**
 * A simple clickable button.
 */
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(config) {
        var _this = _super.call(this, config) || this;
        _this.buttonEvents = {
            onClick: new eventdispatcher_1.EventDispatcher()
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-button'
        }, _this.config);
        return _this;
    }
    Button.prototype.toDomElement = function () {
        var _this = this;
        // Create the button element with the text label
        var buttonElement = new dom_1.DOM('button', {
            'type': 'button',
            'id': this.config.id,
            'class': this.getCssClasses()
        }).append(new dom_1.DOM('span', {
            'class': this.prefixCss('label')
        }).html(this.config.text));
        // Listen for the click event on the button element and trigger the corresponding event on the button component
        buttonElement.on('click', function () {
            _this.onClickEvent();
        });
        return buttonElement;
    };
    /**
     * Sets text on the label of the button.
     * @param text the text to put into the label of the button
     */
    Button.prototype.setText = function (text) {
        this.getDomElement().find('.' + this.prefixCss('label')).html(text);
    };
    Button.prototype.onClickEvent = function () {
        this.buttonEvents.onClick.dispatch(this);
    };
    Object.defineProperty(Button.prototype, "onClick", {
        /**
         * Gets the event that is fired when the button is clicked.
         * @returns {Event<Button<Config>, NoArgs>}
         */
        get: function () {
            return this.buttonEvents.onClick.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    return Button;
}(component_1.Component));
exports.Button = Button;

},{"../dom":48,"../eventdispatcher":49,"./component":14}],9:[function(require,module,exports){
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
var container_1 = require("./container");
var label_1 = require("./label");
/**
 * Overlays the player and displays the status of a Cast session.
 */
var CastStatusOverlay = (function (_super) {
    __extends(CastStatusOverlay, _super);
    function CastStatusOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.statusLabel = new label_1.Label({ cssClass: 'ui-cast-status-label' });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-cast-status-overlay',
            components: [_this.statusLabel],
            hidden: true
        }, _this.config);
        return _this;
    }
    CastStatusOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        player.addEventHandler(player.EVENT.ON_CAST_WAITING_FOR_DEVICE, function (event) {
            _this.show();
            // Get device name and update status text while connecting
            var castDeviceName = event.castPayload.deviceName;
            _this.statusLabel.setText("Connecting to <strong>" + castDeviceName + "</strong>...");
        });
        player.addEventHandler(player.EVENT.ON_CAST_STARTED, function (event) {
            // Session is started or resumed
            // For cases when a session is resumed, we do not receive the previous events and therefore show the status panel
            // here too
            _this.show();
            var castDeviceName = event.deviceName;
            _this.statusLabel.setText("Playing on <strong>" + castDeviceName + "</strong>");
        });
        player.addEventHandler(player.EVENT.ON_CAST_STOPPED, function (event) {
            // Cast session gone, hide the status panel
            _this.hide();
        });
    };
    return CastStatusOverlay;
}(container_1.Container));
exports.CastStatusOverlay = CastStatusOverlay;

},{"./container":15,"./label":21}],10:[function(require,module,exports){
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
 * A button that toggles casting to a Cast receiver.
 */
var CastToggleButton = (function (_super) {
    __extends(CastToggleButton, _super);
    function CastToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-casttogglebutton',
            text: 'Google Cast'
        }, _this.config);
        return _this;
    }
    CastToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            if (player.isCastAvailable()) {
                if (player.isCasting()) {
                    player.castStop();
                }
                else {
                    player.castVideo();
                }
            }
            else {
                if (console) {
                    console.log('Cast unavailable');
                }
            }
        });
        var castAvailableHander = function () {
            if (player.isCastAvailable()) {
                _this.show();
            }
            else {
                _this.hide();
            }
        };
        player.addEventHandler(player.EVENT.ON_CAST_AVAILABLE, castAvailableHander);
        // Toggle button 'on' state
        player.addEventHandler(player.EVENT.ON_CAST_WAITING_FOR_DEVICE, function () {
            _this.on();
        });
        player.addEventHandler(player.EVENT.ON_CAST_STARTED, function () {
            // When a session is resumed, there is no ON_CAST_START event, so we also need to toggle here for such cases
            _this.on();
        });
        player.addEventHandler(player.EVENT.ON_CAST_STOPPED, function () {
            _this.off();
        });
        // Startup init
        castAvailableHander(); // Hide button if Cast not available
        if (player.isCasting()) {
            this.on();
        }
    };
    return CastToggleButton;
}(togglebutton_1.ToggleButton));
exports.CastToggleButton = CastToggleButton;

},{"./togglebutton":39}],11:[function(require,module,exports){
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
var uicontainer_1 = require("./uicontainer");
var timeout_1 = require("../timeout");
/**
 * The base container for Cast receivers that contains all of the UI and takes care that the UI is shown on
 * certain playback events.
 */
var CastUIContainer = (function (_super) {
    __extends(CastUIContainer, _super);
    function CastUIContainer(config) {
        return _super.call(this, config) || this;
    }
    CastUIContainer.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        /*
         * Show UI on Cast devices at certain playback events
         *
         * Since a Cast receiver does not have a direct HCI, we show the UI on certain playback events to give the user
         * a chance to see on the screen what's going on, e.g. on play/pause or a seek the UI is shown and the user can
         * see the current time and position on the seek bar.
         * The UI is shown permanently while playback is paused, otherwise hides automatically after the configured
         * hide delay time.
         */
        var isUiShown = false;
        var hideUi = function () {
            uimanager.onControlsHide.dispatch(_this);
            isUiShown = false;
        };
        this.castUiHideTimeout = new timeout_1.Timeout(config.hideDelay, hideUi);
        var showUi = function () {
            if (!isUiShown) {
                uimanager.onControlsShow.dispatch(_this);
                isUiShown = true;
            }
        };
        var showUiPermanently = function () {
            showUi();
            _this.castUiHideTimeout.clear();
        };
        var showUiWithTimeout = function () {
            showUi();
            _this.castUiHideTimeout.start();
        };
        var showUiAfterSeek = function () {
            if (player.isPlaying()) {
                showUiWithTimeout();
            }
            else {
                showUiPermanently();
            }
        };
        player.addEventHandler(player.EVENT.ON_READY, showUiWithTimeout);
        player.addEventHandler(player.EVENT.ON_SOURCE_LOADED, showUiWithTimeout);
        player.addEventHandler(player.EVENT.ON_PLAY, showUiWithTimeout);
        player.addEventHandler(player.EVENT.ON_PAUSED, showUiPermanently);
        player.addEventHandler(player.EVENT.ON_SEEK, showUiPermanently);
        player.addEventHandler(player.EVENT.ON_SEEKED, showUiAfterSeek);
    };
    CastUIContainer.prototype.release = function () {
        _super.prototype.release.call(this);
        this.castUiHideTimeout.clear();
    };
    return CastUIContainer;
}(uicontainer_1.UIContainer));
exports.CastUIContainer = CastUIContainer;

},{"../timeout":52,"./uicontainer":41}],12:[function(require,module,exports){
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
var button_1 = require("./button");
/**
 * A click overlay that opens an url in a new tab if clicked.
 */
var ClickOverlay = (function (_super) {
    __extends(ClickOverlay, _super);
    function ClickOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-clickoverlay'
        }, _this.config);
        return _this;
    }
    ClickOverlay.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.setUrl(this.config.url);
        var element = this.getDomElement();
        element.on('click', function () {
            if (element.data('url')) {
                window.open(element.data('url'), '_blank');
            }
        });
    };
    /**
     * Gets the URL that should be followed when the watermark is clicked.
     * @returns {string} the watermark URL
     */
    ClickOverlay.prototype.getUrl = function () {
        return this.getDomElement().data('url');
    };
    ClickOverlay.prototype.setUrl = function (url) {
        if (url === undefined || url == null) {
            url = '';
        }
        this.getDomElement().data('url', url);
    };
    return ClickOverlay;
}(button_1.Button));
exports.ClickOverlay = ClickOverlay;

},{"./button":8}],13:[function(require,module,exports){
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
var button_1 = require("./button");
/**
 * A button that closes (hides) a configured component.
 */
var CloseButton = (function (_super) {
    __extends(CloseButton, _super);
    function CloseButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-closebutton',
            text: 'Close'
        }, _this.config);
        return _this;
    }
    CloseButton.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        this.onClick.subscribe(function () {
            config.target.hide();
        });
    };
    return CloseButton;
}(button_1.Button));
exports.CloseButton = CloseButton;

},{"./button":8}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guid_1 = require("../guid");
var dom_1 = require("../dom");
var eventdispatcher_1 = require("../eventdispatcher");
/**
 * The base class of the UI framework.
 * Each component must extend this class and optionally the config interface.
 */
var Component = (function () {
    /**
     * Constructs a component with an optionally supplied config. All subclasses must call the constructor of their
     * superclass and then merge their configuration into the component's configuration.
     * @param config the configuration for the component
     */
    function Component(config) {
        if (config === void 0) { config = {}; }
        /**
         * The list of events that this component offers. These events should always be private and only directly
         * accessed from within the implementing component.
         *
         * Because TypeScript does not support private properties with the same name on different class hierarchy levels
         * (i.e. superclass and subclass cannot contain a private property with the same name), the default naming
         * convention for the event list of a component that should be followed by subclasses is the concatenation of the
         * camel-cased class name + 'Events' (e.g. SubClass extends Component => subClassEvents).
         * See {@link #componentEvents} for an example.
         *
         * Event properties should be named in camel case with an 'on' prefix and in the present tense. Async events may
         * have a start event (when the operation starts) in the present tense, and must have an end event (when the
         * operation ends) in the past tense (or present tense in special cases (e.g. onStart/onStarted or onPlay/onPlaying).
         * See {@link #componentEvents#onShow} for an example.
         *
         * Each event should be accompanied with a protected method named by the convention eventName + 'Event'
         * (e.g. onStartEvent), that actually triggers the event by calling {@link EventDispatcher#dispatch dispatch} and
         * passing a reference to the component as first parameter. Components should always trigger their events with these
         * methods. Implementing this pattern gives subclasses means to directly listen to the events by overriding the
         * method (and saving the overhead of passing a handler to the event dispatcher) and more importantly to trigger
         * these events without having access to the private event list.
         * See {@link #onShow} for an example.
         *
         * To provide external code the possibility to listen to this component's events (subscribe, unsubscribe, etc.),
         * each event should also be accompanied by a public getter function with the same name as the event's property,
         * that returns the {@link Event} obtained from the event dispatcher by calling {@link EventDispatcher#getEvent}.
         * See {@link #onShow} for an example.
         *
         * Full example for an event representing an example action in a example component:
         *
         * <code>
         * // Define an example component class with an example event
         * class ExampleComponent extends Component<ComponentConfig> {
           *
           *     private exampleComponentEvents = {
           *         onExampleAction: new EventDispatcher<ExampleComponent, NoArgs>()
           *     }
           *
           *     // constructor and other stuff...
           *
           *     protected onExampleActionEvent() {
           *        this.exampleComponentEvents.onExampleAction.dispatch(this);
           *    }
           *
           *    get onExampleAction(): Event<ExampleComponent, NoArgs> {
           *        return this.exampleComponentEvents.onExampleAction.getEvent();
           *    }
           * }
         *
         * // Create an instance of the component somewhere
         * var exampleComponentInstance = new ExampleComponent();
         *
         * // Subscribe to the example event on the component
         * exampleComponentInstance.onExampleAction.subscribe(function (sender: ExampleComponent) {
           *     console.log('onExampleAction of ' + sender + ' has fired!');
           * });
         * </code>
         */
        this.componentEvents = {
            onShow: new eventdispatcher_1.EventDispatcher(),
            onHide: new eventdispatcher_1.EventDispatcher(),
            onHoverChanged: new eventdispatcher_1.EventDispatcher(),
        };
        // Create the configuration for this component
        this.config = this.mergeConfig(config, {
            tag: 'div',
            id: 'bmpui-id-' + guid_1.Guid.next(),
            cssPrefix: 'bmpui',
            cssClass: 'ui-component',
            cssClasses: [],
            hidden: false
        }, {});
    }
    /**
     * Initializes the component, e.g. by applying config settings.
     * This method must not be called from outside the UI framework.
     *
     * This method is automatically called by the {@link UIInstanceManager}. If the component is an inner component of
     * some component, and thus encapsulated abd managed internally and never directly exposed to the UIManager,
     * this method must be called from the managing component's {@link #initialize} method.
     */
    Component.prototype.initialize = function () {
        this.hidden = this.config.hidden;
        // Hide the component at initialization if it is configured to be hidden
        if (this.isHidden()) {
            this.hidden = false; // Set flag to false for the following hide() call to work (hide() checks the flag)
            this.hide();
        }
    };
    /**
     * Configures the component for the supplied Player and UIInstanceManager. This is the place where all the magic
     * happens, where components typically subscribe and react to events (on their DOM element, the Player, or the
     * UIInstanceManager), and basically everything that makes them interactive.
     * This method is called only once, when the UIManager initializes the UI.
     *
     * Subclasses usually overwrite this method to add their own functionality.
     *
     * @param player the player which this component controls
     * @param uimanager the UIInstanceManager that manages this component
     */
    Component.prototype.configure = function (player, uimanager) {
        var _this = this;
        this.onShow.subscribe(function () {
            uimanager.onComponentShow.dispatch(_this);
        });
        this.onHide.subscribe(function () {
            uimanager.onComponentHide.dispatch(_this);
        });
        // Track the hovered state of the element
        this.getDomElement().on('mouseenter', function () {
            _this.onHoverChangedEvent(true);
        });
        this.getDomElement().on('mouseleave', function () {
            _this.onHoverChangedEvent(false);
        });
    };
    /**
     * Releases all resources and dependencies that the component holds. Player, DOM, and UIManager events are
     * automatically removed during release and do not explicitly need to be removed here.
     * This method is called by the UIManager when it releases the UI.
     *
     * Subclasses that need to release resources should override this method and call super.release().
     */
    Component.prototype.release = function () {
        // Nothing to do here, override where necessary
    };
    /**
     * Generate the DOM element for this component.
     *
     * Subclasses usually overwrite this method to extend or replace the DOM element with their own design.
     */
    Component.prototype.toDomElement = function () {
        var element = new dom_1.DOM(this.config.tag, {
            'id': this.config.id,
            'class': this.getCssClasses()
        });
        return element;
    };
    /**
     * Returns the DOM element of this component. Creates the DOM element if it does not yet exist.
     *
     * Should not be overwritten by subclasses.
     *
     * @returns {DOM}
     */
    Component.prototype.getDomElement = function () {
        if (!this.element) {
            this.element = this.toDomElement();
        }
        return this.element;
    };
    /**
     * Merges a configuration with a default configuration and a base configuration from the superclass.
     *
     * @param config the configuration settings for the components, as usually passed to the constructor
     * @param defaults a default configuration for settings that are not passed with the configuration
     * @param base configuration inherited from a superclass
     * @returns {Config}
     */
    Component.prototype.mergeConfig = function (config, defaults, base) {
        // Extend default config with supplied config
        var merged = Object.assign({}, base, defaults, config);
        // Return the extended config
        return merged;
    };
    /**
     * Helper method that returns a string of all CSS classes of the component.
     *
     * @returns {string}
     */
    Component.prototype.getCssClasses = function () {
        var _this = this;
        // Merge all CSS classes into single array
        var flattenedArray = [this.config.cssClass].concat(this.config.cssClasses);
        // Prefix classes
        flattenedArray = flattenedArray.map(function (css) {
            return _this.prefixCss(css);
        });
        // Join array values into a string
        var flattenedString = flattenedArray.join(' ');
        // Return trimmed string to prevent whitespace at the end from the join operation
        return flattenedString.trim();
    };
    Component.prototype.prefixCss = function (cssClassOrId) {
        return this.config.cssPrefix + '-' + cssClassOrId;
    };
    /**
     * Returns the configuration object of the component.
     * @returns {Config}
     */
    Component.prototype.getConfig = function () {
        return this.config;
    };
    /**
     * Hides the component if shown.
     * This method basically transfers the component into the hidden state. Actual hiding is done via CSS.
     */
    Component.prototype.hide = function () {
        if (!this.hidden) {
            this.hidden = true;
            this.getDomElement().addClass(this.prefixCss(Component.CLASS_HIDDEN));
            this.onHideEvent();
        }
    };
    /**
     * Shows the component if hidden.
     */
    Component.prototype.show = function () {
        if (this.hidden) {
            this.getDomElement().removeClass(this.prefixCss(Component.CLASS_HIDDEN));
            this.hidden = false;
            this.onShowEvent();
        }
    };
    /**
     * Determines if the component is hidden.
     * @returns {boolean} true if the component is hidden, else false
     */
    Component.prototype.isHidden = function () {
        return this.hidden;
    };
    /**
     * Determines if the component is shown.
     * @returns {boolean} true if the component is visible, else false
     */
    Component.prototype.isShown = function () {
        return !this.isHidden();
    };
    /**
     * Toggles the hidden state by hiding the component if it is shown, or showing it if hidden.
     */
    Component.prototype.toggleHidden = function () {
        if (this.isHidden()) {
            this.show();
        }
        else {
            this.hide();
        }
    };
    /**
     * Determines if the component is currently hovered.
     * @returns {boolean} true if the component is hovered, else false
     */
    Component.prototype.isHovered = function () {
        return this.hovered;
    };
    /**
     * Fires the onShow event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onShowEvent = function () {
        this.componentEvents.onShow.dispatch(this);
    };
    /**
     * Fires the onHide event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onHideEvent = function () {
        this.componentEvents.onHide.dispatch(this);
    };
    /**
     * Fires the onHoverChanged event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onHoverChangedEvent = function (hovered) {
        this.hovered = hovered;
        this.componentEvents.onHoverChanged.dispatch(this, { hovered: hovered });
    };
    Object.defineProperty(Component.prototype, "onShow", {
        /**
         * Gets the event that is fired when the component is showing.
         * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
         * @returns {Event<Component<Config>, NoArgs>}
         */
        get: function () {
            return this.componentEvents.onShow.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onHide", {
        /**
         * Gets the event that is fired when the component is hiding.
         * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
         * @returns {Event<Component<Config>, NoArgs>}
         */
        get: function () {
            return this.componentEvents.onHide.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onHoverChanged", {
        /**
         * Gets the event that is fired when the component's hover-state is changing.
         * @returns {Event<Component<Config>, ComponentHoverChangedEventArgs>}
         */
        get: function () {
            return this.componentEvents.onHoverChanged.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    return Component;
}());
/**
 * The classname that is attached to the element when it is in the hidden state.
 * @type {string}
 */
Component.CLASS_HIDDEN = 'hidden';
exports.Component = Component;

},{"../dom":48,"../eventdispatcher":49,"../guid":50}],15:[function(require,module,exports){
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
var component_1 = require("./component");
var dom_1 = require("../dom");
var utils_1 = require("../utils");
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
var Container = (function (_super) {
    __extends(Container, _super);
    function Container(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-container',
            components: []
        }, _this.config);
        return _this;
    }
    /**
     * Adds a child component to the container.
     * @param component the component to add
     */
    Container.prototype.addComponent = function (component) {
        this.config.components.push(component);
    };
    /**
     * Removes a child component from the container.
     * @param component the component to remove
     * @returns {boolean} true if the component has been removed, false if it is not contained in this container
     */
    Container.prototype.removeComponent = function (component) {
        return utils_1.ArrayUtils.remove(this.config.components, component) != null;
    };
    /**
     * Gets an array of all child components in this container.
     * @returns {Component<ComponentConfig>[]}
     */
    Container.prototype.getComponents = function () {
        return this.config.components;
    };
    /**
     * Removes all child components from the container.
     */
    Container.prototype.removeComponents = function () {
        for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
            var component = _a[_i];
            this.removeComponent(component);
        }
    };
    /**
     * Updates the DOM of the container with the current components.
     */
    Container.prototype.updateComponents = function () {
        this.innerContainerElement.empty();
        for (var _i = 0, _a = this.config.components; _i < _a.length; _i++) {
            var component = _a[_i];
            this.innerContainerElement.append(component.getDomElement());
        }
    };
    Container.prototype.toDomElement = function () {
        // Create the container element (the outer <div>)
        var containerElement = new dom_1.DOM(this.config.tag, {
            'id': this.config.id,
            'class': this.getCssClasses()
        });
        // Create the inner container element (the inner <div>) that will contain the components
        var innerContainer = new dom_1.DOM(this.config.tag, {
            'class': this.prefixCss('container-wrapper')
        });
        this.innerContainerElement = innerContainer;
        this.updateComponents();
        containerElement.append(innerContainer);
        return containerElement;
    };
    return Container;
}(component_1.Component));
exports.Container = Container;

},{"../dom":48,"../utils":54,"./component":14}],16:[function(require,module,exports){
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
var container_1 = require("./container");
var utils_1 = require("../utils");
var spacer_1 = require("./spacer");
/**
 * A container for main player control components, e.g. play toggle button, seek bar, volume control, fullscreen toggle
 * button.
 */
var ControlBar = (function (_super) {
    __extends(ControlBar, _super);
    function ControlBar(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-controlbar',
            hidden: true,
        }, _this.config);
        return _this;
    }
    ControlBar.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        // Counts how many components are hovered and block hiding of the control bar
        var hoverStackCount = 0;
        // Track hover status of child components
        utils_1.UIUtils.traverseTree(this, function (component) {
            // Do not track hover status of child containers or spacers, only of 'real' controls
            if (component instanceof container_1.Container || component instanceof spacer_1.Spacer) {
                return;
            }
            // Subscribe hover event and keep a count of the number of hovered children
            component.onHoverChanged.subscribe(function (sender, args) {
                if (args.hovered) {
                    hoverStackCount++;
                }
                else {
                    hoverStackCount--;
                }
            });
        });
        uimanager.onControlsShow.subscribe(function () {
            _this.show();
        });
        uimanager.onPreviewControlsHide.subscribe(function (sender, args) {
            // Cancel the hide event if hovered child components block hiding
            args.cancel = (hoverStackCount > 0);
        });
        uimanager.onControlsHide.subscribe(function () {
            _this.hide();
        });
    };
    return ControlBar;
}(container_1.Container));
exports.ControlBar = ControlBar;

},{"../utils":54,"./container":15,"./spacer":35}],17:[function(require,module,exports){
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
var container_1 = require("./container");
var label_1 = require("./label");
var tvnoisecanvas_1 = require("./tvnoisecanvas");
/**
 * Overlays the player and displays error messages.
 */
var ErrorMessageOverlay = (function (_super) {
    __extends(ErrorMessageOverlay, _super);
    function ErrorMessageOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.errorLabel = new label_1.Label({ cssClass: 'ui-errormessage-label' });
        _this.tvNoiseBackground = new tvnoisecanvas_1.TvNoiseCanvas();
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-errormessage-overlay',
            components: [_this.tvNoiseBackground, _this.errorLabel],
            hidden: true
        }, _this.config);
        return _this;
    }
    ErrorMessageOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        player.addEventHandler(player.EVENT.ON_ERROR, function (event) {
            var message = event.message;
            // Process message translations
            if (config.messages) {
                if (typeof config.messages === 'function') {
                    // Translation function for all errors
                    message = config.messages(event);
                }
                else if (config.messages[event.code]) {
                    // It's not a translation function, so it must be a map of strings or translation functions
                    var customMessage = config.messages[event.code];
                    if (typeof customMessage === 'string') {
                        message = customMessage;
                    }
                    else {
                        // The message is a translation function, so we call it
                        message = customMessage(event);
                    }
                }
            }
            _this.errorLabel.setText(message);
            _this.tvNoiseBackground.start();
            _this.show();
        });
        player.addEventHandler(player.EVENT.ON_SOURCE_LOADED, function (event) {
            if (_this.isShown()) {
                _this.tvNoiseBackground.stop();
                _this.hide();
            }
        });
    };
    return ErrorMessageOverlay;
}(container_1.Container));
exports.ErrorMessageOverlay = ErrorMessageOverlay;

},{"./container":15,"./label":21,"./tvnoisecanvas":40}],18:[function(require,module,exports){
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
 * A button that toggles the player between windowed and fullscreen view.
 */
var FullscreenToggleButton = (function (_super) {
    __extends(FullscreenToggleButton, _super);
    function FullscreenToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-fullscreentogglebutton',
            text: 'Fullscreen'
        }, _this.config);
        return _this;
    }
    FullscreenToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var fullscreenStateHandler = function () {
            if (player.isFullscreen()) {
                _this.on();
            }
            else {
                _this.off();
            }
        };
        player.addEventHandler(player.EVENT.ON_FULLSCREEN_ENTER, fullscreenStateHandler);
        player.addEventHandler(player.EVENT.ON_FULLSCREEN_EXIT, fullscreenStateHandler);
        this.onClick.subscribe(function () {
            if (player.isFullscreen()) {
                player.exitFullscreen();
            }
            else {
                player.enterFullscreen();
            }
        });
        // Startup init
        fullscreenStateHandler();
    };
    return FullscreenToggleButton;
}(togglebutton_1.ToggleButton));
exports.FullscreenToggleButton = FullscreenToggleButton;

},{"./togglebutton":39}],19:[function(require,module,exports){
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
var playbacktogglebutton_1 = require("./playbacktogglebutton");
var dom_1 = require("../dom");
/**
 * A button that overlays the video and toggles between playback and pause.
 */
var HugePlaybackToggleButton = (function (_super) {
    __extends(HugePlaybackToggleButton, _super);
    function HugePlaybackToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-hugeplaybacktogglebutton',
            text: 'Play/Pause'
        }, _this.config);
        return _this;
    }
    HugePlaybackToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        // Update button state through API events
        _super.prototype.configure.call(this, player, uimanager, false);
        var togglePlayback = function () {
            if (player.isPlaying()) {
                player.pause('ui-overlay');
            }
            else {
                player.play('ui-overlay');
            }
        };
        var toggleFullscreen = function () {
            if (player.isFullscreen()) {
                player.exitFullscreen();
            }
            else {
                player.enterFullscreen();
            }
        };
        var firstPlay = true;
        var clickTime = 0;
        var doubleClickTime = 0;
        /*
         * YouTube-style toggle button handling
         *
         * The goal is to prevent a short pause or playback interval between a click, that toggles playback, and a
         * double click, that toggles fullscreen. In this naive approach, the first click would e.g. start playback,
         * the second click would be detected as double click and toggle to fullscreen, and as second normal click stop
         * playback, which results is a short playback interval with max length of the double click detection
         * period (usually 500ms).
         *
         * To solve this issue, we defer handling of the first click for 200ms, which is almost unnoticeable to the user,
         * and just toggle playback if no second click (double click) has been registered during this period. If a double
         * click is registered, we just toggle the fullscreen. In the first 200ms, undesired playback changes thus cannot
         * happen. If a double click is registered within 500ms, we undo the playback change and switch fullscreen mode.
         * In the end, this method basically introduces a 200ms observing interval in which playback changes are prevented
         * if a double click happens.
         */
        this.onClick.subscribe(function () {
            // Directly start playback on first click of the button.
            // This is a required workaround for mobile browsers where video playback needs to be triggered directly
            // by the user. A deferred playback start through the timeout below is not considered as user action and
            // therefore ignored by mobile browsers.
            if (firstPlay) {
                // Try to start playback. Then we wait for ON_PLAY and only when it arrives, we disable the firstPlay flag.
                // If we disable the flag here, onClick was triggered programmatically instead of by a user interaction, and
                // playback is blocked (e.g. on mobile devices due to the programmatic play() call), we loose the chance to
                // ever start playback through a user interaction again with this button.
                togglePlayback();
                return;
            }
            var now = Date.now();
            if (now - clickTime < 200) {
                // We have a double click inside the 200ms interval, just toggle fullscreen mode
                toggleFullscreen();
                doubleClickTime = now;
                return;
            }
            else if (now - clickTime < 500) {
                // We have a double click inside the 500ms interval, undo playback toggle and toggle fullscreen mode
                toggleFullscreen();
                togglePlayback();
                doubleClickTime = now;
                return;
            }
            clickTime = now;
            setTimeout(function () {
                if (Date.now() - doubleClickTime > 200) {
                    // No double click detected, so we toggle playback and wait what happens next
                    togglePlayback();
                }
            }, 200);
        });
        player.addEventHandler(player.EVENT.ON_PLAY, function () {
            // Playback has really started, we can disable the flag to switch to normal toggle button handling
            firstPlay = false;
        });
        // Hide button while initializing a Cast session
        var castInitializationHandler = function (event) {
            if (event.type === player.EVENT.ON_CAST_START) {
                // Hide button when session is being initialized
                _this.hide();
            }
            else {
                // Show button when session is established or initialization was aborted
                _this.show();
            }
        };
        player.addEventHandler(player.EVENT.ON_CAST_START, castInitializationHandler);
        player.addEventHandler(player.EVENT.ON_CAST_STARTED, castInitializationHandler);
        player.addEventHandler(player.EVENT.ON_CAST_STOPPED, castInitializationHandler);
    };
    HugePlaybackToggleButton.prototype.toDomElement = function () {
        var buttonElement = _super.prototype.toDomElement.call(this);
        // Add child that contains the play button image
        // Setting the image directly on the button does not work together with scaling animations, because the button
        // can cover the whole video player are and scaling would extend it beyond. By adding an inner element, confined
        // to the size if the image, it can scale inside the player without overshooting.
        buttonElement.append(new dom_1.DOM('div', {
            'class': this.prefixCss('image')
        }));
        return buttonElement;
    };
    return HugePlaybackToggleButton;
}(playbacktogglebutton_1.PlaybackToggleButton));
exports.HugePlaybackToggleButton = HugePlaybackToggleButton;

},{"../dom":48,"./playbacktogglebutton":27}],20:[function(require,module,exports){
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
var button_1 = require("./button");
var dom_1 = require("../dom");
/**
 * A button to play/replay a video.
 */
var HugeReplayButton = (function (_super) {
    __extends(HugeReplayButton, _super);
    function HugeReplayButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-hugereplaybutton',
            text: 'Replay'
        }, _this.config);
        return _this;
    }
    HugeReplayButton.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            player.play('ui-overlay');
        });
    };
    HugeReplayButton.prototype.toDomElement = function () {
        var buttonElement = _super.prototype.toDomElement.call(this);
        // Add child that contains the play button image
        // Setting the image directly on the button does not work together with scaling animations, because the button
        // can cover the whole video player are and scaling would extend it beyond. By adding an inner element, confined
        // to the size if the image, it can scale inside the player without overshooting.
        buttonElement.append(new dom_1.DOM('div', {
            'class': this.prefixCss('image')
        }));
        return buttonElement;
    };
    return HugeReplayButton;
}(button_1.Button));
exports.HugeReplayButton = HugeReplayButton;

},{"../dom":48,"./button":8}],21:[function(require,module,exports){
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
var component_1 = require("./component");
var dom_1 = require("../dom");
var eventdispatcher_1 = require("../eventdispatcher");
/**
 * A simple text label.
 *
 * DOM example:
 * <code>
 *     <span class='ui-label'>...some text...</span>
 * </code>
 */
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.labelEvents = {
            onClick: new eventdispatcher_1.EventDispatcher(),
            onTextChanged: new eventdispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-label'
        }, _this.config);
        _this.text = _this.config.text;
        return _this;
    }
    Label.prototype.toDomElement = function () {
        var _this = this;
        var labelElement = new dom_1.DOM('span', {
            'id': this.config.id,
            'class': this.getCssClasses()
        }).html(this.text);
        labelElement.on('click', function () {
            _this.onClickEvent();
        });
        return labelElement;
    };
    /**
     * Set the text on this label.
     * @param text
     */
    Label.prototype.setText = function (text) {
        this.text = text;
        this.getDomElement().html(text);
        this.onTextChangedEvent(text);
    };
    /**
     * Gets the text on this label.
     * @return {string} The text on the label
     */
    Label.prototype.getText = function () {
        return this.text;
    };
    /**
     * Clears the text on this label.
     */
    Label.prototype.clearText = function () {
        this.getDomElement().html('');
        this.onTextChangedEvent(null);
    };
    /**
     * Tests if the label is empty and does not contain any text.
     * @return {boolean} True if the label is empty, else false
     */
    Label.prototype.isEmpty = function () {
        return !this.text;
    };
    /**
     * Fires the {@link #onClick} event.
     * Can be used by subclasses to listen to this event without subscribing an event listener by overwriting the method
     * and calling the super method.
     */
    Label.prototype.onClickEvent = function () {
        this.labelEvents.onClick.dispatch(this);
    };
    /**
     * Fires the {@link #onClick} event.
     * Can be used by subclasses to listen to this event without subscribing an event listener by overwriting the method
     * and calling the super method.
     */
    Label.prototype.onTextChangedEvent = function (text) {
        this.labelEvents.onTextChanged.dispatch(this, text);
    };
    Object.defineProperty(Label.prototype, "onClick", {
        /**
         * Gets the event that is fired when the label is clicked.
         * @returns {Event<Label<LabelConfig>, NoArgs>}
         */
        get: function () {
            return this.labelEvents.onClick.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "onTextChanged", {
        /**
         * Gets the event that is fired when the text on the label is changed.
         * @returns {Event<Label<LabelConfig>, string>}
         */
        get: function () {
            return this.labelEvents.onTextChanged.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    return Label;
}(component_1.Component));
exports.Label = Label;

},{"../dom":48,"../eventdispatcher":49,"./component":14}],22:[function(require,module,exports){
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
var component_1 = require("./component");
var eventdispatcher_1 = require("../eventdispatcher");
var utils_1 = require("../utils");
var ListSelector = (function (_super) {
    __extends(ListSelector, _super);
    function ListSelector(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.listSelectorEvents = {
            onItemAdded: new eventdispatcher_1.EventDispatcher(),
            onItemRemoved: new eventdispatcher_1.EventDispatcher(),
            onItemSelected: new eventdispatcher_1.EventDispatcher()
        };
        _this.config = _this.mergeConfig(config, {
            items: [],
            cssClass: 'ui-listselector'
        }, _this.config);
        _this.items = _this.config.items;
        return _this;
    }
    ListSelector.prototype.getItemIndex = function (key) {
        for (var index in this.items) {
            if (key === this.items[index].key) {
                return parseInt(index);
            }
        }
        return -1;
    };
    /**
     * Checks if the specified item is part of this selector.
     * @param key the key of the item to check
     * @returns {boolean} true if the item is part of this selector, else false
     */
    ListSelector.prototype.hasItem = function (key) {
        return this.getItemIndex(key) > -1;
    };
    /**
     * Adds an item to this selector by appending it to the end of the list of items. If an item with the specified
     * key already exists, it is replaced.
     * @param key the key of the item to add
     * @param label the (human-readable) label of the item to add
     */
    ListSelector.prototype.addItem = function (key, label) {
        this.removeItem(key); // Try to remove key first to get overwrite behavior and avoid duplicate keys
        this.items.push({ key: key, label: label });
        this.onItemAddedEvent(key);
    };
    /**
     * Removes an item from this selector.
     * @param key the key of the item to remove
     * @returns {boolean} true if removal was successful, false if the item is not part of this selector
     */
    ListSelector.prototype.removeItem = function (key) {
        var index = this.getItemIndex(key);
        if (index > -1) {
            utils_1.ArrayUtils.remove(this.items, this.items[index]);
            this.onItemRemovedEvent(key);
            return true;
        }
        return false;
    };
    /**
     * Selects an item from the items in this selector.
     * @param key the key of the item to select
     * @returns {boolean} true is the selection was successful, false if the selected item is not part of the selector
     */
    ListSelector.prototype.selectItem = function (key) {
        if (key === this.selectedItem) {
            // itemConfig is already selected, suppress any further action
            return true;
        }
        var index = this.getItemIndex(key);
        if (index > -1) {
            this.selectedItem = key;
            this.onItemSelectedEvent(key);
            return true;
        }
        return false;
    };
    /**
     * Returns the key of the selected item.
     * @returns {string} the key of the selected item or null if no item is selected
     */
    ListSelector.prototype.getSelectedItem = function () {
        return this.selectedItem;
    };
    /**
     * Removes all items from this selector.
     */
    ListSelector.prototype.clearItems = function () {
        var items = this.items; // local copy for iteration after clear
        this.items = []; // clear items
        // fire events
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            this.onItemRemovedEvent(item.key);
        }
    };
    /**
     * Returns the number of items in this selector.
     * @returns {number}
     */
    ListSelector.prototype.itemCount = function () {
        return Object.keys(this.items).length;
    };
    ListSelector.prototype.onItemAddedEvent = function (key) {
        this.listSelectorEvents.onItemAdded.dispatch(this, key);
    };
    ListSelector.prototype.onItemRemovedEvent = function (key) {
        this.listSelectorEvents.onItemRemoved.dispatch(this, key);
    };
    ListSelector.prototype.onItemSelectedEvent = function (key) {
        this.listSelectorEvents.onItemSelected.dispatch(this, key);
    };
    Object.defineProperty(ListSelector.prototype, "onItemAdded", {
        /**
         * Gets the event that is fired when an item is added to the list of items.
         * @returns {Event<ListSelector<Config>, string>}
         */
        get: function () {
            return this.listSelectorEvents.onItemAdded.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListSelector.prototype, "onItemRemoved", {
        /**
         * Gets the event that is fired when an item is removed from the list of items.
         * @returns {Event<ListSelector<Config>, string>}
         */
        get: function () {
            return this.listSelectorEvents.onItemRemoved.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListSelector.prototype, "onItemSelected", {
        /**
         * Gets the event that is fired when an item is selected from the list of items.
         * @returns {Event<ListSelector<Config>, string>}
         */
        get: function () {
            return this.listSelectorEvents.onItemSelected.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    return ListSelector;
}(component_1.Component));
exports.ListSelector = ListSelector;

},{"../eventdispatcher":49,"../utils":54,"./component":14}],23:[function(require,module,exports){
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
var label_1 = require("./label");
/**
 * Enumerates the types of content that the {@link MetadataLabel} can display.
 */
var MetadataLabelContent;
(function (MetadataLabelContent) {
    /**
     * Title of the data source.
     */
    MetadataLabelContent[MetadataLabelContent["Title"] = 0] = "Title";
    /**
     * Description fo the data source.
     */
    MetadataLabelContent[MetadataLabelContent["Description"] = 1] = "Description";
})(MetadataLabelContent = exports.MetadataLabelContent || (exports.MetadataLabelContent = {}));
/**
 * A label that can be configured to display certain metadata.
 */
var MetadataLabel = (function (_super) {
    __extends(MetadataLabel, _super);
    function MetadataLabel(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['label-metadata', 'label-metadata-' + MetadataLabelContent[config.content].toLowerCase()]
        }, _this.config);
        return _this;
    }
    MetadataLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var uiconfig = uimanager.getConfig();
        var init = function () {
            switch (config.content) {
                case MetadataLabelContent.Title:
                    if (uiconfig && uiconfig.metadata && uiconfig.metadata.title) {
                        _this.setText(uiconfig.metadata.title);
                    }
                    else if (player.getConfig().source && player.getConfig().source.title) {
                        _this.setText(player.getConfig().source.title);
                    }
                    break;
                case MetadataLabelContent.Description:
                    if (uiconfig && uiconfig.metadata && uiconfig.metadata.description) {
                        _this.setText(uiconfig.metadata.description);
                    }
                    else if (player.getConfig().source && player.getConfig().source.description) {
                        _this.setText(player.getConfig().source.description);
                    }
                    break;
            }
        };
        var unload = function () {
            _this.setText(null);
        };
        // Init label
        init();
        // Reinit label when a new source is loaded
        player.addEventHandler(player.EVENT.ON_SOURCE_LOADED, init);
        // Clear labels when source is unloaded
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, unload);
    };
    return MetadataLabel;
}(label_1.Label));
exports.MetadataLabel = MetadataLabel;

},{"./label":21}],24:[function(require,module,exports){
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
 * A button that toggles Apple macOS picture-in-picture mode.
 */
var PictureInPictureToggleButton = (function (_super) {
    __extends(PictureInPictureToggleButton, _super);
    function PictureInPictureToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-piptogglebutton',
            text: 'Picture-in-Picture'
        }, _this.config);
        return _this;
    }
    PictureInPictureToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            if (player.isPictureInPictureAvailable()) {
                if (player.isPictureInPicture()) {
                    player.exitPictureInPicture();
                }
                else {
                    player.enterPictureInPicture();
                }
            }
            else {
                if (console) {
                    console.log('PIP unavailable');
                }
            }
        });
        var pipAvailableHander = function () {
            if (player.isPictureInPictureAvailable()) {
                _this.show();
            }
            else {
                _this.hide();
            }
        };
        player.addEventHandler(player.EVENT.ON_READY, pipAvailableHander);
        // Toggle button 'on' state
        player.addEventHandler(player.EVENT.ON_PICTURE_IN_PICTURE_ENTER, function () {
            _this.on();
        });
        player.addEventHandler(player.EVENT.ON_PICTURE_IN_PICTURE_EXIT, function () {
            _this.off();
        });
        // Startup init
        pipAvailableHander(); // Hide button if PIP not available
        if (player.isPictureInPicture()) {
            this.on();
        }
    };
    return PictureInPictureToggleButton;
}(togglebutton_1.ToggleButton));
exports.PictureInPictureToggleButton = PictureInPictureToggleButton;

},{"./togglebutton":39}],25:[function(require,module,exports){
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
var selectbox_1 = require("./selectbox");
/**
 * A select box providing a selection of different playback speeds.
 */
var PlaybackSpeedSelectBox = (function (_super) {
    __extends(PlaybackSpeedSelectBox, _super);
    function PlaybackSpeedSelectBox(config) {
        if (config === void 0) { config = {}; }
        return _super.call(this, config) || this;
    }
    PlaybackSpeedSelectBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem('0.25', '0.25x');
        this.addItem('0.5', '0.5x');
        this.addItem('1', 'Normal');
        this.addItem('1.5', '1.5x');
        this.addItem('2', '2x');
        this.selectItem('1');
        this.onItemSelected.subscribe(function (sender, value) {
            player.setPlaybackSpeed(parseFloat(value));
        });
    };
    return PlaybackSpeedSelectBox;
}(selectbox_1.SelectBox));
exports.PlaybackSpeedSelectBox = PlaybackSpeedSelectBox;

},{"./selectbox":32}],26:[function(require,module,exports){
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
var label_1 = require("./label");
var utils_1 = require("../utils");
var PlaybackTimeLabelMode;
(function (PlaybackTimeLabelMode) {
    PlaybackTimeLabelMode[PlaybackTimeLabelMode["CurrentTime"] = 0] = "CurrentTime";
    PlaybackTimeLabelMode[PlaybackTimeLabelMode["TotalTime"] = 1] = "TotalTime";
    PlaybackTimeLabelMode[PlaybackTimeLabelMode["CurrentAndTotalTime"] = 2] = "CurrentAndTotalTime";
})(PlaybackTimeLabelMode = exports.PlaybackTimeLabelMode || (exports.PlaybackTimeLabelMode = {}));
/**
 * A label that display the current playback time and the total time through {@link PlaybackTimeLabel#setTime setTime}
 * or any string through {@link PlaybackTimeLabel#setText setText}.
 */
var PlaybackTimeLabel = (function (_super) {
    __extends(PlaybackTimeLabel, _super);
    function PlaybackTimeLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-playbacktimelabel',
            timeLabelMode: PlaybackTimeLabelMode.CurrentAndTotalTime,
            hideInLivePlayback: false,
        }, _this.config);
        return _this;
    }
    PlaybackTimeLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var live = false;
        var liveCssClass = this.prefixCss('ui-playbacktimelabel-live');
        var liveEdgeCssClass = this.prefixCss('ui-playbacktimelabel-live-edge');
        var minWidth = 0;
        var liveClickHandler = function () {
            player.timeShift(0);
        };
        var updateLiveState = function () {
            // Player is playing a live stream when the duration is infinite
            live = player.isLive();
            // Attach/detach live marker class
            if (live) {
                _this.getDomElement().addClass(liveCssClass);
                _this.setText('Live');
                if (config.hideInLivePlayback) {
                    _this.hide();
                }
                _this.onClick.subscribe(liveClickHandler);
                updateLiveTimeshiftState();
            }
            else {
                _this.getDomElement().removeClass(liveCssClass);
                _this.getDomElement().removeClass(liveEdgeCssClass);
                _this.show();
                _this.onClick.unsubscribe(liveClickHandler);
            }
        };
        new utils_1.PlayerUtils.LiveStreamDetector(player).onLiveChanged.subscribe(function (sender, args) {
            live = args.live;
            updateLiveState();
        });
        var updateLiveTimeshiftState = function () {
            if (player.getTimeShift() === 0) {
                _this.getDomElement().addClass(liveEdgeCssClass);
            }
            else {
                _this.getDomElement().removeClass(liveEdgeCssClass);
            }
        };
        var playbackTimeHandler = function () {
            if (!live && player.getDuration() !== Infinity) {
                _this.setTime(player.getCurrentTime(), player.getDuration());
            }
            // To avoid 'jumping' in the UI by varying label sizes due to non-monospaced fonts,
            // we gradually increase the min-width with the content to reach a stable size.
            var width = _this.getDomElement().width();
            if (width > minWidth) {
                minWidth = width;
                _this.getDomElement().css({
                    'min-width': minWidth + 'px'
                });
            }
        };
        player.addEventHandler(player.EVENT.ON_TIME_CHANGED, playbackTimeHandler);
        player.addEventHandler(player.EVENT.ON_SEEKED, playbackTimeHandler);
        player.addEventHandler(player.EVENT.ON_CAST_TIME_UPDATED, playbackTimeHandler);
        player.addEventHandler(player.EVENT.ON_TIME_SHIFT, updateLiveTimeshiftState);
        player.addEventHandler(player.EVENT.ON_TIME_SHIFTED, updateLiveTimeshiftState);
        var init = function () {
            // Reset min-width when a new source is ready (especially for switching VOD/Live modes where the label content
            // changes)
            minWidth = 0;
            _this.getDomElement().css({
                'min-width': null
            });
            // Set time format depending on source duration
            _this.timeFormat = Math.abs(player.isLive() ? player.getMaxTimeShift() : player.getDuration()) >= 3600 ?
                utils_1.StringUtils.FORMAT_HHMMSS : utils_1.StringUtils.FORMAT_MMSS;
            // Update time after the format has been set
            playbackTimeHandler();
        };
        player.addEventHandler(player.EVENT.ON_READY, init);
        init();
    };
    /**
     * Sets the current playback time and total duration.
     * @param playbackSeconds the current playback time in seconds
     * @param durationSeconds the total duration in seconds
     */
    PlaybackTimeLabel.prototype.setTime = function (playbackSeconds, durationSeconds) {
        var currentTime = utils_1.StringUtils.secondsToTime(playbackSeconds, this.timeFormat);
        var totalTime = utils_1.StringUtils.secondsToTime(durationSeconds, this.timeFormat);
        switch (this.config.timeLabelMode) {
            case PlaybackTimeLabelMode.CurrentTime:
                this.setText("" + currentTime);
                break;
            case PlaybackTimeLabelMode.TotalTime:
                this.setText("" + totalTime);
                break;
            case PlaybackTimeLabelMode.CurrentAndTotalTime:
                this.setText(currentTime + " / " + totalTime);
                break;
        }
    };
    return PlaybackTimeLabel;
}(label_1.Label));
exports.PlaybackTimeLabel = PlaybackTimeLabel;

},{"../utils":54,"./label":21}],27:[function(require,module,exports){
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
var utils_1 = require("../utils");
/**
 * A button that toggles between playback and pause.
 */
var PlaybackToggleButton = (function (_super) {
    __extends(PlaybackToggleButton, _super);
    function PlaybackToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-playbacktogglebutton',
            text: 'Play/Pause'
        }, _this.config);
        return _this;
    }
    PlaybackToggleButton.prototype.configure = function (player, uimanager, handleClickEvent) {
        var _this = this;
        if (handleClickEvent === void 0) { handleClickEvent = true; }
        _super.prototype.configure.call(this, player, uimanager);
        var isSeeking = false;
        // Handler to update button state based on player state
        var playbackStateHandler = function (event) {
            // If the UI is currently seeking, playback is temporarily stopped but the buttons should
            // not reflect that and stay as-is (e.g indicate playback while seeking).
            if (isSeeking) {
                return;
            }
            if (player.isPlaying()) {
                _this.on();
            }
            else {
                _this.off();
            }
        };
        // Call handler upon these events
        player.addEventHandler(player.EVENT.ON_PLAY, playbackStateHandler);
        player.addEventHandler(player.EVENT.ON_PAUSED, playbackStateHandler);
        // when playback finishes, player turns to paused mode
        player.addEventHandler(player.EVENT.ON_PLAYBACK_FINISHED, playbackStateHandler);
        player.addEventHandler(player.EVENT.ON_CAST_STARTED, playbackStateHandler);
        player.addEventHandler(player.EVENT.ON_CAST_PLAYING, playbackStateHandler);
        player.addEventHandler(player.EVENT.ON_CAST_PAUSED, playbackStateHandler);
        player.addEventHandler(player.EVENT.ON_CAST_PLAYBACK_FINISHED, playbackStateHandler);
        // Detect absence of timeshifting on live streams and add tagging class to convert button icons to play/stop
        new utils_1.PlayerUtils.TimeShiftAvailabilityDetector(player).onTimeShiftAvailabilityChanged.subscribe(function (sender, args) {
            if (!args.timeShiftAvailable) {
                _this.getDomElement().addClass(_this.prefixCss(PlaybackToggleButton.CLASS_STOPTOGGLE));
            }
            else {
                _this.getDomElement().removeClass(_this.prefixCss(PlaybackToggleButton.CLASS_STOPTOGGLE));
            }
        });
        if (handleClickEvent) {
            // Control player by button events
            // When a button event triggers a player API call, events are fired which in turn call the event handler
            // above that updated the button state.
            this.onClick.subscribe(function () {
                if (player.isPlaying()) {
                    player.pause('ui-button');
                }
                else {
                    player.play('ui-button');
                }
            });
        }
        // Track UI seeking status
        uimanager.onSeek.subscribe(function () {
            isSeeking = true;
        });
        uimanager.onSeeked.subscribe(function () {
            isSeeking = false;
        });
        // Startup init
        playbackStateHandler(null);
    };
    return PlaybackToggleButton;
}(togglebutton_1.ToggleButton));
PlaybackToggleButton.CLASS_STOPTOGGLE = 'stoptoggle';
exports.PlaybackToggleButton = PlaybackToggleButton;

},{"../utils":54,"./togglebutton":39}],28:[function(require,module,exports){
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
var container_1 = require("./container");
var hugeplaybacktogglebutton_1 = require("./hugeplaybacktogglebutton");
/**
 * Overlays the player and displays error messages.
 */
var PlaybackToggleOverlay = (function (_super) {
    __extends(PlaybackToggleOverlay, _super);
    function PlaybackToggleOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.playbackToggleButton = new hugeplaybacktogglebutton_1.HugePlaybackToggleButton();
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-playbacktoggle-overlay',
            components: [_this.playbackToggleButton]
        }, _this.config);
        return _this;
    }
    return PlaybackToggleOverlay;
}(container_1.Container));
exports.PlaybackToggleOverlay = PlaybackToggleOverlay;

},{"./container":15,"./hugeplaybacktogglebutton":19}],29:[function(require,module,exports){
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
var container_1 = require("./container");
var component_1 = require("./component");
var dom_1 = require("../dom");
var utils_1 = require("../utils");
var hugereplaybutton_1 = require("./hugereplaybutton");
/**
 * Overlays the player and displays recommended videos.
 */
var RecommendationOverlay = (function (_super) {
    __extends(RecommendationOverlay, _super);
    function RecommendationOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.replayButton = new hugereplaybutton_1.HugeReplayButton();
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-recommendation-overlay',
            hidden: true,
            components: [_this.replayButton]
        }, _this.config);
        return _this;
    }
    RecommendationOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var clearRecommendations = function () {
            for (var _i = 0, _a = _this.getComponents(); _i < _a.length; _i++) {
                var component = _a[_i];
                if (component instanceof RecommendationItem) {
                    _this.removeComponent(component);
                }
            }
            _this.updateComponents();
            _this.getDomElement().removeClass(_this.prefixCss('recommendations'));
        };
        var setupRecommendations = function () {
            clearRecommendations();
            var hasRecommendationsInUiConfig = uimanager.getConfig().recommendations
                && uimanager.getConfig().recommendations.length > 0;
            var hasRecommendationsInPlayerConfig = player.getConfig().source && player.getConfig().source.recommendations
                && player.getConfig().source.recommendations.length > 0;
            // Take markers from the UI config. If no markers defined, try to take them from the player's source config.
            var recommendations = hasRecommendationsInUiConfig ? uimanager.getConfig().recommendations :
                hasRecommendationsInPlayerConfig ? player.getConfig().source.recommendations : null;
            // Generate timeline markers from the config if we have markers and if we have a duration
            // The duration check is for buggy platforms where the duration is not available instantly (Chrome on Android 4.3)
            if (recommendations) {
                var index = 1;
                for (var _i = 0, recommendations_1 = recommendations; _i < recommendations_1.length; _i++) {
                    var item = recommendations_1[_i];
                    _this.addComponent(new RecommendationItem({
                        itemConfig: item,
                        cssClasses: ['recommendation-item-' + (index++)]
                    }));
                }
                _this.updateComponents(); // create container DOM elements
                _this.getDomElement().addClass(_this.prefixCss('recommendations'));
            }
        };
        // Add recommendation when a source is loaded
        player.addEventHandler(player.EVENT.ON_READY, setupRecommendations);
        // Remove recommendations and hide overlay when source is unloaded
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, function () {
            clearRecommendations();
            _this.hide();
        });
        // Display recommendations when playback has finished
        player.addEventHandler(player.EVENT.ON_PLAYBACK_FINISHED, function () {
            // Dismiss ON_PLAYBACK_FINISHED events at the end of ads
            // TODO remove this workaround once issue #1278 is solved
            if (player.isAd()) {
                return;
            }
            _this.show();
        });
        // Hide recommendations when playback starts, e.g. a restart
        player.addEventHandler(player.EVENT.ON_PLAY, function () {
            _this.hide();
        });
        // Init on startup
        setupRecommendations();
    };
    return RecommendationOverlay;
}(container_1.Container));
exports.RecommendationOverlay = RecommendationOverlay;
/**
 * An item of the {@link RecommendationOverlay}. Used only internally in {@link RecommendationOverlay}.
 */
var RecommendationItem = (function (_super) {
    __extends(RecommendationItem, _super);
    function RecommendationItem(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-recommendation-item',
            itemConfig: null // this must be passed in from outside
        }, _this.config);
        return _this;
    }
    RecommendationItem.prototype.toDomElement = function () {
        var config = this.config.itemConfig; // TODO fix generics and get rid of cast
        var itemElement = new dom_1.DOM('a', {
            'id': this.config.id,
            'class': this.getCssClasses(),
            'href': config.url
        }).css({ 'background-image': "url(" + config.thumbnail + ")" });
        var bgElement = new dom_1.DOM('div', {
            'class': this.prefixCss('background')
        });
        itemElement.append(bgElement);
        var titleElement = new dom_1.DOM('span', {
            'class': this.prefixCss('title')
        }).append(new dom_1.DOM('span', {
            'class': this.prefixCss('innertitle')
        }).html(config.title));
        itemElement.append(titleElement);
        var timeElement = new dom_1.DOM('span', {
            'class': this.prefixCss('duration')
        }).append(new dom_1.DOM('span', {
            'class': this.prefixCss('innerduration')
        }).html(config.duration ? utils_1.StringUtils.secondsToTime(config.duration) : ''));
        itemElement.append(timeElement);
        return itemElement;
    };
    return RecommendationItem;
}(component_1.Component));

},{"../dom":48,"../utils":54,"./component":14,"./container":15,"./hugereplaybutton":20}],30:[function(require,module,exports){
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
var component_1 = require("./component");
var dom_1 = require("../dom");
var eventdispatcher_1 = require("../eventdispatcher");
var timeout_1 = require("../timeout");
var utils_1 = require("../utils");
/**
 * A seek bar to seek within the player's media. It displays the current playback position, amount of buffed data, seek
 * target, and keeps status about an ongoing seek.
 *
 * The seek bar displays different 'bars':
 *  - the playback position, i.e. the position in the media at which the player current playback pointer is positioned
 *  - the buffer position, which usually is the playback position plus the time span that is already buffered ahead
 *  - the seek position, used to preview to where in the timeline a seek will jump to
 */
var SeekBar = (function (_super) {
    __extends(SeekBar, _super);
    function SeekBar(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        /**
         * Buffer of the the current playback position. The position must be buffered in case the element
         * needs to be refreshed with {@link #refreshPlaybackPosition}.
         * @type {number}
         */
        _this.playbackPositionPercentage = 0;
        // https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
        _this.touchSupported = ('ontouchstart' in window);
        _this.seekBarEvents = {
            /**
             * Fired when a scrubbing seek operation is started.
             */
            onSeek: new eventdispatcher_1.EventDispatcher(),
            /**
             * Fired during a scrubbing seek to indicate that the seek preview (i.e. the video frame) should be updated.
             */
            onSeekPreview: new eventdispatcher_1.EventDispatcher(),
            /**
             * Fired when a scrubbing seek has finished or when a direct seek is issued.
             */
            onSeeked: new eventdispatcher_1.EventDispatcher()
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-seekbar',
            vertical: false,
            smoothPlaybackPositionUpdateIntervalMs: 50,
        }, _this.config);
        _this.label = _this.config.label;
        _this.timelineMarkers = [];
        return _this;
    }
    SeekBar.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (this.hasLabel()) {
            this.getLabel().initialize();
        }
    };
    SeekBar.prototype.configure = function (player, uimanager, configureSeek) {
        var _this = this;
        if (configureSeek === void 0) { configureSeek = true; }
        _super.prototype.configure.call(this, player, uimanager);
        if (!configureSeek) {
            // The configureSeek flag can be used by subclasses to disable configuration as seek bar. E.g. the volume
            // slider is reusing this component but adds its own functionality, and does not need the seek functionality.
            // This is actually a hack, the proper solution would be for both seek bar and volume sliders to extend
            // a common base slider component and implement their functionality there.
            return;
        }
        var playbackNotInitialized = true;
        var isPlaying = false;
        var isSeeking = false;
        // Update playback and buffer positions
        var playbackPositionHandler = function (event, forceUpdate) {
            if (event === void 0) { event = null; }
            if (forceUpdate === void 0) { forceUpdate = false; }
            // Once this handler os called, playback has been started and we set the flag to false
            playbackNotInitialized = false;
            if (isSeeking) {
                // We caught a seek preview seek, do not update the seekbar
                return;
            }
            if (player.isLive()) {
                if (player.getMaxTimeShift() === 0) {
                    // This case must be explicitly handled to avoid division by zero
                    _this.setPlaybackPosition(100);
                }
                else {
                    var playbackPositionPercentage = 100 - (100 / player.getMaxTimeShift() * player.getTimeShift());
                    _this.setPlaybackPosition(playbackPositionPercentage);
                }
                // Always show full buffer for live streams
                _this.setBufferPosition(100);
            }
            else {
                var playbackPositionPercentage = 100 / player.getDuration() * player.getCurrentTime();
                var videoBufferLength = player.getVideoBufferLength();
                var audioBufferLength = player.getAudioBufferLength();
                // Calculate the buffer length which is the smaller length of the audio and video buffers. If one of these
                // buffers is not available, we set it's value to MAX_VALUE to make sure that the other real value is taken
                // as the buffer length.
                var bufferLength = Math.min(videoBufferLength != null ? videoBufferLength : Number.MAX_VALUE, audioBufferLength != null ? audioBufferLength : Number.MAX_VALUE);
                // If both buffer lengths are missing, we set the buffer length to zero
                if (bufferLength === Number.MAX_VALUE) {
                    bufferLength = 0;
                }
                var bufferPercentage = 100 / player.getDuration() * bufferLength;
                // Update playback position only in paused state or in the initial startup state where player is neither
                // paused nor playing. Playback updates are handled in the Timeout below.
                if (_this.config.smoothPlaybackPositionUpdateIntervalMs === SeekBar.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED
                    || forceUpdate || player.isPaused() || (player.isPaused() === player.isPlaying())) {
                    _this.setPlaybackPosition(playbackPositionPercentage);
                }
                _this.setBufferPosition(playbackPositionPercentage + bufferPercentage);
            }
        };
        // Update seekbar upon these events
        // init playback position when the player is ready
        player.addEventHandler(player.EVENT.ON_READY, playbackPositionHandler);
        // update playback position when it changes
        player.addEventHandler(player.EVENT.ON_TIME_CHANGED, playbackPositionHandler);
        // update bufferlevel when buffering is complete
        player.addEventHandler(player.EVENT.ON_STALL_ENDED, playbackPositionHandler);
        // update playback position when a seek has finished
        player.addEventHandler(player.EVENT.ON_SEEKED, playbackPositionHandler);
        // update playback position when a timeshift has finished
        player.addEventHandler(player.EVENT.ON_TIME_SHIFTED, playbackPositionHandler);
        // update bufferlevel when a segment has been downloaded
        player.addEventHandler(player.EVENT.ON_SEGMENT_REQUEST_FINISHED, playbackPositionHandler);
        // update playback position of Cast playback
        player.addEventHandler(player.EVENT.ON_CAST_TIME_UPDATED, playbackPositionHandler);
        // Seek handling
        player.addEventHandler(player.EVENT.ON_SEEK, function () {
            _this.setSeeking(true);
        });
        player.addEventHandler(player.EVENT.ON_SEEKED, function () {
            _this.setSeeking(false);
        });
        player.addEventHandler(player.EVENT.ON_TIME_SHIFT, function () {
            _this.setSeeking(true);
        });
        player.addEventHandler(player.EVENT.ON_TIME_SHIFTED, function () {
            _this.setSeeking(false);
        });
        var seek = function (percentage) {
            if (player.isLive()) {
                player.timeShift(player.getMaxTimeShift() - (player.getMaxTimeShift() * (percentage / 100)));
            }
            else {
                player.seek(player.getDuration() * (percentage / 100));
            }
        };
        this.onSeek.subscribe(function (sender) {
            isSeeking = true; // track seeking status so we can catch events from seek preview seeks
            // Notify UI manager of started seek
            uimanager.onSeek.dispatch(sender);
            // Save current playback state
            isPlaying = player.isPlaying();
            // Pause playback while seeking
            if (isPlaying) {
                player.pause('ui-seek');
            }
        });
        this.onSeekPreview.subscribe(function (sender, args) {
            // Notify UI manager of seek preview
            uimanager.onSeekPreview.dispatch(sender, args);
        });
        this.onSeekPreview.subscribeRateLimited(function (sender, args) {
            // Rate-limited scrubbing seek
            if (args.scrubbing) {
                seek(args.position);
            }
        }, 200);
        this.onSeeked.subscribe(function (sender, percentage) {
            isSeeking = false;
            // Do the seek
            seek(percentage);
            // Continue playback after seek if player was playing when seek started
            if (isPlaying) {
                player.play('ui-seek');
            }
            // Notify UI manager of finished seek
            uimanager.onSeeked.dispatch(sender);
        });
        if (this.hasLabel()) {
            // Configure a seekbar label that is internal to the seekbar)
            this.getLabel().configure(player, uimanager);
        }
        // Hide seekbar for live sources without timeshift
        var isLive = false;
        var hasTimeShift = false;
        var switchVisibility = function (isLive, hasTimeShift) {
            if (isLive && !hasTimeShift) {
                _this.hide();
            }
            else {
                _this.show();
            }
            playbackPositionHandler(null, true);
            _this.refreshPlaybackPosition();
        };
        new utils_1.PlayerUtils.LiveStreamDetector(player).onLiveChanged.subscribe(function (sender, args) {
            isLive = args.live;
            switchVisibility(isLive, hasTimeShift);
        });
        new utils_1.PlayerUtils.TimeShiftAvailabilityDetector(player).onTimeShiftAvailabilityChanged.subscribe(function (sender, args) {
            hasTimeShift = args.timeShiftAvailable;
            switchVisibility(isLive, hasTimeShift);
        });
        // Refresh the playback position when the player resized or the UI is configured. The playback position marker
        // is positioned absolutely and must therefore be updated when the size of the seekbar changes.
        player.addEventHandler(player.EVENT.ON_PLAYER_RESIZE, function () {
            _this.refreshPlaybackPosition();
        });
        // Additionally, when this code is called, the seekbar is not part of the UI yet and therefore does not have a size,
        // resulting in a wrong initial position of the marker. Refreshing it once the UI is configured solved this issue.
        uimanager.onConfigured.subscribe(function () {
            _this.refreshPlaybackPosition();
        });
        // It can also happen that the value changes once the player is ready, or when a new source is loaded, so we need
        // to update on ON_READY too
        player.addEventHandler(player.EVENT.ON_READY, function () {
            _this.refreshPlaybackPosition();
        });
        // Initialize seekbar
        playbackPositionHandler(); // Set the playback position
        this.setBufferPosition(0);
        this.setSeekPosition(0);
        if (this.config.smoothPlaybackPositionUpdateIntervalMs !== SeekBar.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED) {
            this.configureSmoothPlaybackPositionUpdater(player, uimanager);
        }
        this.configureMarkers(player, uimanager);
    };
    SeekBar.prototype.configureSmoothPlaybackPositionUpdater = function (player, uimanager) {
        var _this = this;
        /*
         * Playback position update
         *
         * We do not update the position directly from the ON_TIME_CHANGED event, because it arrives very jittery and
         * results in a jittery position indicator since the CSS transition time is statically set.
         * To work around this issue, we maintain a local playback position that is updated in a stable regular interval
         * and kept in sync with the player.
         */
        var currentTimeSeekBar = 0;
        var currentTimePlayer = 0;
        var updateIntervalMs = 50;
        var currentTimeUpdateDeltaSecs = updateIntervalMs / 1000;
        this.smoothPlaybackPositionUpdater = new timeout_1.Timeout(updateIntervalMs, function () {
            currentTimeSeekBar += currentTimeUpdateDeltaSecs;
            currentTimePlayer = player.getCurrentTime();
            // Sync currentTime of seekbar to player
            var currentTimeDelta = currentTimeSeekBar - currentTimePlayer;
            // If the delta is larger that 2 secs, directly jump the seekbar to the
            // player time instead of smoothly fast forwarding/rewinding.
            if (Math.abs(currentTimeDelta) > 2) {
                currentTimeSeekBar = currentTimePlayer;
            }
            else if (currentTimeDelta <= -currentTimeUpdateDeltaSecs) {
                currentTimeSeekBar += currentTimeUpdateDeltaSecs;
            }
            else if (currentTimeDelta >= currentTimeUpdateDeltaSecs) {
                currentTimeSeekBar -= currentTimeUpdateDeltaSecs;
            }
            var playbackPositionPercentage = 100 / player.getDuration() * currentTimeSeekBar;
            _this.setPlaybackPosition(playbackPositionPercentage);
        }, true);
        var startSmoothPlaybackPositionUpdater = function () {
            if (!player.isLive()) {
                currentTimeSeekBar = player.getCurrentTime();
                _this.smoothPlaybackPositionUpdater.start();
            }
        };
        var stopSmoothPlaybackPositionUpdater = function () {
            _this.smoothPlaybackPositionUpdater.clear();
        };
        player.addEventHandler(player.EVENT.ON_PLAY, startSmoothPlaybackPositionUpdater);
        player.addEventHandler(player.EVENT.ON_CAST_PLAYING, startSmoothPlaybackPositionUpdater);
        player.addEventHandler(player.EVENT.ON_PAUSED, stopSmoothPlaybackPositionUpdater);
        player.addEventHandler(player.EVENT.ON_CAST_PAUSED, stopSmoothPlaybackPositionUpdater);
        player.addEventHandler(player.EVENT.ON_SEEKED, function () {
            currentTimeSeekBar = player.getCurrentTime();
        });
        if (player.isPlaying()) {
            startSmoothPlaybackPositionUpdater();
        }
    };
    SeekBar.prototype.configureMarkers = function (player, uimanager) {
        var _this = this;
        var clearMarkers = function () {
            _this.timelineMarkers = [];
            _this.updateMarkers();
        };
        var setupMarkers = function () {
            clearMarkers();
            var hasMarkersInUiConfig = uimanager.getConfig().metadata && uimanager.getConfig().metadata.markers
                && uimanager.getConfig().metadata.markers.length > 0;
            var hasMarkersInPlayerConfig = player.getConfig().source && player.getConfig().source.markers
                && player.getConfig().source.markers.length > 0;
            // Take markers from the UI config. If no markers defined, try to take them from the player's source config.
            var markers = hasMarkersInUiConfig ? uimanager.getConfig().metadata.markers :
                hasMarkersInPlayerConfig ? player.getConfig().source.markers : null;
            // Generate timeline markers from the config if we have markers and if we have a duration
            // The duration check is for buggy platforms where the duration is not available instantly (Chrome on Android 4.3)
            if (markers && player.getDuration() !== Infinity) {
                for (var _i = 0, markers_1 = markers; _i < markers_1.length; _i++) {
                    var o = markers_1[_i];
                    var marker = {
                        time: 100 / player.getDuration() * o.time,
                        title: o.title,
                        markerType: '' + (o.markerType || 1),
                        comment: o.comment || '',
                        avatar: o.avatar,
                        number: o.number || ''
                    };
                    _this.timelineMarkers.push(marker);
                }
            }
            // Populate the timeline with the markers
            _this.updateMarkers();
        };
        // Add markers when a source is loaded
        player.addEventHandler(player.EVENT.ON_READY, setupMarkers);
        // Remove markers when unloaded
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, clearMarkers);
        // Init markers at startup
        setupMarkers();
    };
    SeekBar.prototype.release = function () {
        _super.prototype.release.call(this);
        if (this.smoothPlaybackPositionUpdater) {
            this.smoothPlaybackPositionUpdater.clear();
        }
    };
    SeekBar.prototype.toDomElement = function () {
        var _this = this;
        if (this.config.vertical) {
            this.config.cssClasses.push('vertical');
        }
        var seekBarContainer = new dom_1.DOM('div', {
            'id': this.config.id,
            'class': this.getCssClasses()
        });
        var seekBar = new dom_1.DOM('div', {
            'class': this.prefixCss('seekbar')
        });
        this.seekBar = seekBar;
        // Indicator that shows the buffer fill level
        var seekBarBufferLevel = new dom_1.DOM('div', {
            'class': this.prefixCss('seekbar-bufferlevel')
        });
        this.seekBarBufferPosition = seekBarBufferLevel;
        // Indicator that shows the current playback position
        var seekBarPlaybackPosition = new dom_1.DOM('div', {
            'class': this.prefixCss('seekbar-playbackposition')
        });
        this.seekBarPlaybackPosition = seekBarPlaybackPosition;
        // A marker of the current playback position, e.g. a dot or line
        var seekBarPlaybackPositionMarker = new dom_1.DOM('div', {
            'class': this.prefixCss('seekbar-playbackposition-marker')
        });
        this.seekBarPlaybackPositionMarker = seekBarPlaybackPositionMarker;
        // Indicator that show where a seek will go to
        var seekBarSeekPosition = new dom_1.DOM('div', {
            'class': this.prefixCss('seekbar-seekposition')
        });
        this.seekBarSeekPosition = seekBarSeekPosition;
        // Indicator that shows the full seekbar
        var seekBarBackdrop = new dom_1.DOM('div', {
            'class': this.prefixCss('seekbar-backdrop')
        });
        this.seekBarBackdrop = seekBarBackdrop;
        var seekBarChapterMarkersContainer = new dom_1.DOM('div', {
            'class': this.prefixCss('seekbar-markers')
        });
        this.seekBarMarkersContainer = seekBarChapterMarkersContainer;
        seekBar.append(seekBarBackdrop, seekBarBufferLevel, seekBarSeekPosition, seekBarPlaybackPosition, seekBarChapterMarkersContainer, seekBarPlaybackPositionMarker);
        var seeking = false;
        // Define handler functions so we can attach/remove them later
        var mouseTouchMoveHandler = function (e) {
            e.preventDefault();
            // Avoid propagation to VR handler
            e.stopPropagation();
            var targetPercentage = 100 * _this.getOffset(e);
            _this.setSeekPosition(targetPercentage);
            _this.setPlaybackPosition(targetPercentage);
            _this.onSeekPreviewEvent(targetPercentage, true);
        };
        var mouseTouchUpHandler = function (e) {
            e.preventDefault();
            // Remove handlers, seek operation is finished
            new dom_1.DOM(document).off('touchmove mousemove', mouseTouchMoveHandler);
            new dom_1.DOM(document).off('touchend mouseup', mouseTouchUpHandler);
            var targetPercentage = 100 * _this.getOffset(e);
            var snappedChapter = _this.getMarkerAtPosition(targetPercentage);
            _this.setSeeking(false);
            seeking = false;
            // Fire seeked event
            _this.onSeekedEvent(snappedChapter ? snappedChapter.time : targetPercentage);
        };
        // A seek always start with a touchstart or mousedown directly on the seekbar.
        // To track a mouse seek also outside the seekbar (for touch events this works automatically),
        // so the user does not need to take care that the mouse always stays on the seekbar, we attach the mousemove
        // and mouseup handlers to the whole document. A seek is triggered when the user lifts the mouse key.
        // A seek mouse gesture is thus basically a click with a long time frame between down and up events.
        seekBar.on('touchstart mousedown', function (e) {
            var isTouchEvent = _this.touchSupported && e instanceof TouchEvent;
            // Prevent selection of DOM elements (also prevents mousedown if current event is touchstart)
            e.preventDefault();
            // Avoid propagation to VR handler
            e.stopPropagation();
            _this.setSeeking(true); // Set seeking class on DOM element
            seeking = true; // Set seek tracking flag
            // Fire seeked event
            _this.onSeekEvent();
            // Add handler to track the seek operation over the whole document
            new dom_1.DOM(document).on(isTouchEvent ? 'touchmove' : 'mousemove', mouseTouchMoveHandler);
            new dom_1.DOM(document).on(isTouchEvent ? 'touchend' : 'mouseup', mouseTouchUpHandler);
        });
        // Display seek target indicator when mouse hovers or finger slides over seekbar
        seekBar.on('touchmove mousemove', function (e) {
            e.preventDefault();
            if (seeking) {
                // During a seek (when mouse is down or touch move active), we need to stop propagation to avoid
                // the VR viewport reacting to the moves.
                e.stopPropagation();
                // Because the stopped propagation inhibits the event on the document, we need to call it from here
                mouseTouchMoveHandler(e);
            }
            var position = 100 * _this.getOffset(e);
            _this.setSeekPosition(position);
            _this.onSeekPreviewEvent(position, false);
            if (_this.hasLabel() && _this.getLabel().isHidden()) {
                _this.getLabel().show();
            }
        });
        // Hide seek target indicator when mouse or finger leaves seekbar
        seekBar.on('touchend mouseleave', function (e) {
            e.preventDefault();
            _this.setSeekPosition(0);
            if (_this.hasLabel()) {
                _this.getLabel().hide();
            }
        });
        seekBarContainer.append(seekBar);
        if (this.label) {
            seekBarContainer.append(this.label.getDomElement());
        }
        return seekBarContainer;
    };
    SeekBar.prototype.updateMarkers = function () {
        this.seekBarMarkersContainer.empty();
        for (var _i = 0, _a = this.timelineMarkers; _i < _a.length; _i++) {
            var marker = _a[_i];
            var className = marker.markerType === '2' ? this.prefixCss('seekbar-marker-typetwo') : this.prefixCss('seekbar-marker');
            var markerDom = new dom_1.DOM('div', {
                'class': className,
                'data-marker-time': String(marker.time),
                'data-marker-title': String(marker.title),
            }).css({
                'width': marker.time + '%',
            });
            this.seekBarMarkersContainer.append(markerDom);
        }
    };
    SeekBar.prototype.getMarkerAtPosition = function (percentage) {
        var snappedMarker = null;
        var snappingRange = 1;
        if (this.timelineMarkers.length > 0) {
            for (var _i = 0, _a = this.timelineMarkers; _i < _a.length; _i++) {
                var marker = _a[_i];
                if (percentage >= marker.time - snappingRange && percentage <= marker.time + snappingRange) {
                    snappedMarker = marker;
                    break;
                }
            }
        }
        return snappedMarker;
    };
    /**
     * Gets the horizontal offset of a mouse/touch event point from the left edge of the seek bar.
     * @param eventPageX the pageX coordinate of an event to calculate the offset from
     * @returns {number} a number in the range of [0, 1], where 0 is the left edge and 1 is the right edge
     */
    SeekBar.prototype.getHorizontalOffset = function (eventPageX) {
        var elementOffsetPx = this.seekBar.offset().left;
        var widthPx = this.seekBar.width();
        var offsetPx = eventPageX - elementOffsetPx;
        var offset = 1 / widthPx * offsetPx;
        return this.sanitizeOffset(offset);
    };
    /**
     * Gets the vertical offset of a mouse/touch event point from the bottom edge of the seek bar.
     * @param eventPageY the pageX coordinate of an event to calculate the offset from
     * @returns {number} a number in the range of [0, 1], where 0 is the bottom edge and 1 is the top edge
     */
    SeekBar.prototype.getVerticalOffset = function (eventPageY) {
        var elementOffsetPx = this.seekBar.offset().top;
        var widthPx = this.seekBar.height();
        var offsetPx = eventPageY - elementOffsetPx;
        var offset = 1 / widthPx * offsetPx;
        return 1 - this.sanitizeOffset(offset);
    };
    /**
     * Gets the mouse or touch event offset for the current configuration (horizontal or vertical).
     * @param e the event to calculate the offset from
     * @returns {number} a number in the range of [0, 1]
     * @see #getHorizontalOffset
     * @see #getVerticalOffset
     */
    SeekBar.prototype.getOffset = function (e) {
        if (this.touchSupported && e instanceof TouchEvent) {
            if (this.config.vertical) {
                return this.getVerticalOffset(e.type === 'touchend' ? e.changedTouches[0].pageY : e.touches[0].pageY);
            }
            else {
                return this.getHorizontalOffset(e.type === 'touchend' ? e.changedTouches[0].pageX : e.touches[0].pageX);
            }
        }
        else if (e instanceof MouseEvent) {
            if (this.config.vertical) {
                return this.getVerticalOffset(e.pageY);
            }
            else {
                return this.getHorizontalOffset(e.pageX);
            }
        }
        else {
            if (console) {
                console.warn('invalid event');
            }
            return 0;
        }
    };
    /**
     * Sanitizes the mouse offset to the range of [0, 1].
     *
     * When tracking the mouse outside the seek bar, the offset can be outside the desired range and this method
     * limits it to the desired range. E.g. a mouse event left of the left edge of a seek bar yields an offset below
     * zero, but to display the seek target on the seek bar, we need to limit it to zero.
     *
     * @param offset the offset to sanitize
     * @returns {number} the sanitized offset.
     */
    SeekBar.prototype.sanitizeOffset = function (offset) {
        // Since we track mouse moves over the whole document, the target can be outside the seek range,
        // and we need to limit it to the [0, 1] range.
        if (offset < 0) {
            offset = 0;
        }
        else if (offset > 1) {
            offset = 1;
        }
        return offset;
    };
    /**
     * Sets the position of the playback position indicator.
     * @param percent a number between 0 and 100 as returned by the player
     */
    SeekBar.prototype.setPlaybackPosition = function (percent) {
        this.playbackPositionPercentage = percent;
        // Set position of the bar
        this.setPosition(this.seekBarPlaybackPosition, percent);
        // Set position of the marker
        var px = (this.config.vertical ? this.seekBar.height() : this.seekBar.width()) / 100 * percent;
        if (this.config.vertical) {
            px = this.seekBar.height() - px;
        }
        var style = this.config.vertical ?
            // -ms-transform required for IE9
            { 'transform': 'translateY(' + px + 'px)', '-ms-transform': 'translateY(' + px + 'px)' } :
            { 'transform': 'translateX(' + px + 'px)', '-ms-transform': 'translateX(' + px + 'px)' };
        this.seekBarPlaybackPositionMarker.css(style);
    };
    /**
     * Refreshes the playback position. Can be used by subclasses to refresh the position when
     * the size of the component changes.
     */
    SeekBar.prototype.refreshPlaybackPosition = function () {
        this.setPlaybackPosition(this.playbackPositionPercentage);
    };
    /**
     * Sets the position until which media is buffered.
     * @param percent a number between 0 and 100
     */
    SeekBar.prototype.setBufferPosition = function (percent) {
        this.setPosition(this.seekBarBufferPosition, percent);
    };
    /**
     * Sets the position where a seek, if executed, would jump to.
     * @param percent a number between 0 and 100
     */
    SeekBar.prototype.setSeekPosition = function (percent) {
        this.setPosition(this.seekBarSeekPosition, percent);
    };
    /**
     * Set the actual position (width or height) of a DOM element that represent a bar in the seek bar.
     * @param element the element to set the position for
     * @param percent a number between 0 and 100
     */
    SeekBar.prototype.setPosition = function (element, percent) {
        var scale = percent / 100;
        var style = this.config.vertical ?
            // -ms-transform required for IE9
            { 'transform': 'scaleY(' + scale + ')', '-ms-transform': 'scaleY(' + scale + ')' } :
            { 'transform': 'scaleX(' + scale + ')', '-ms-transform': 'scaleX(' + scale + ')' };
        element.css(style);
    };
    /**
     * Puts the seek bar into or out of seeking state by adding/removing a class to the DOM element. This can be used
     * to adjust the styling while seeking.
     *
     * @param seeking should be true when entering seek state, false when exiting the seek state
     */
    SeekBar.prototype.setSeeking = function (seeking) {
        if (seeking) {
            this.getDomElement().addClass(this.prefixCss(SeekBar.CLASS_SEEKING));
        }
        else {
            this.getDomElement().removeClass(this.prefixCss(SeekBar.CLASS_SEEKING));
        }
    };
    /**
     * Checks if the seek bar is currently in the seek state.
     * @returns {boolean} true if in seek state, else false
     */
    SeekBar.prototype.isSeeking = function () {
        return this.getDomElement().hasClass(this.prefixCss(SeekBar.CLASS_SEEKING));
    };
    /**
     * Checks if the seek bar has a {@link SeekBarLabel}.
     * @returns {boolean} true if the seek bar has a label, else false
     */
    SeekBar.prototype.hasLabel = function () {
        return this.label != null;
    };
    /**
     * Gets the label of this seek bar.
     * @returns {SeekBarLabel} the label if this seek bar has a label, else null
     */
    SeekBar.prototype.getLabel = function () {
        return this.label;
    };
    SeekBar.prototype.onSeekEvent = function () {
        this.seekBarEvents.onSeek.dispatch(this);
    };
    SeekBar.prototype.onSeekPreviewEvent = function (percentage, scrubbing) {
        var snappedMarker = this.getMarkerAtPosition(percentage);
        if (this.label) {
            this.label.getDomElement().css({
                'left': (snappedMarker ? snappedMarker.time : percentage) + '%'
            });
        }
        this.seekBarEvents.onSeekPreview.dispatch(this, {
            scrubbing: scrubbing,
            position: percentage,
            marker: snappedMarker,
        });
    };
    SeekBar.prototype.onSeekedEvent = function (percentage) {
        this.seekBarEvents.onSeeked.dispatch(this, percentage);
    };
    Object.defineProperty(SeekBar.prototype, "onSeek", {
        /**
         * Gets the event that is fired when a scrubbing seek operation is started.
         * @returns {Event<SeekBar, NoArgs>}
         */
        get: function () {
            return this.seekBarEvents.onSeek.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SeekBar.prototype, "onSeekPreview", {
        /**
         * Gets the event that is fired during a scrubbing seek (to indicate that the seek preview, i.e. the video frame,
         * should be updated), or during a normal seek preview when the seek bar is hovered (and the seek target,
         * i.e. the seek bar label, should be updated).
         * @returns {Event<SeekBar, SeekPreviewEventArgs>}
         */
        get: function () {
            return this.seekBarEvents.onSeekPreview.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SeekBar.prototype, "onSeeked", {
        /**
         * Gets the event that is fired when a scrubbing seek has finished or when a direct seek is issued.
         * @returns {Event<SeekBar, number>}
         */
        get: function () {
            return this.seekBarEvents.onSeeked.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    SeekBar.prototype.onShowEvent = function () {
        _super.prototype.onShowEvent.call(this);
        // Refresh the position of the playback position when the seek bar becomes visible. To correctly set the position,
        // the DOM element must be fully initialized an have its size calculated, because the position is set as an absolute
        // value calculated from the size. This required size is not known when it is hidden.
        // For such cases, we refresh the position here in onShow because here it is guaranteed that the component knows
        // its size and can set the position correctly.
        this.refreshPlaybackPosition();
    };
    return SeekBar;
}(component_1.Component));
SeekBar.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED = -1;
/**
 * The CSS class that is added to the DOM element while the seek bar is in 'seeking' state.
 */
SeekBar.CLASS_SEEKING = 'seeking';
exports.SeekBar = SeekBar;

},{"../dom":48,"../eventdispatcher":49,"../timeout":52,"../utils":54,"./component":14}],31:[function(require,module,exports){
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
var container_1 = require("./container");
var label_1 = require("./label");
var component_1 = require("./component");
var utils_1 = require("../utils");
/**
 * A label for a {@link SeekBar} that can display the seek target time, a thumbnail, and title (e.g. chapter title).
 */
var SeekBarLabel = (function (_super) {
    __extends(SeekBarLabel, _super);
    function SeekBarLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.timeLabel = new label_1.Label({ cssClasses: ['seekbar-label-time'] });
        _this.titleLabel = new label_1.Label({ cssClasses: ['seekbar-label-title'] });
        _this.commentLabel = new label_1.Label({ cssClasses: ['seekbar-label-comment'] });
        _this.numberLabel = new label_1.Label({ cssClasses: ['seekbar-label-number'] });
        _this.avatarLabel = new label_1.Label({ cssClasses: ['seekbar-label-avatar'] });
        _this.thumbnail = new component_1.Component({ cssClasses: ['seekbar-thumbnail'] });
        _this.metadata = new container_1.Container({
            components: [
                new container_1.Container({
                    components: [
                        _this.avatarLabel,
                        _this.titleLabel,
                        _this.numberLabel
                    ],
                    cssClass: 'seekbar-label-metadata-title',
                }),
                new container_1.Container({
                    components: [
                        _this.commentLabel,
                        _this.timeLabel
                    ],
                    cssClass: 'seekbar-label-metadata-content',
                }),
            ],
            cssClass: 'seekbar-label-metadata'
        });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-seekbar-label',
            components: [new container_1.Container({
                    components: [
                        _this.thumbnail,
                        _this.metadata
                    ],
                    cssClass: 'seekbar-label-inner',
                })],
            hidden: true
        }, _this.config);
        return _this;
    }
    SeekBarLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        uimanager.onSeekPreview.subscribe(function (sender, args) {
            if (player.isLive()) {
                var time = player.getMaxTimeShift() - player.getMaxTimeShift() * (args.position / 100);
                _this.setTime(time);
            }
            else {
                var percentage = 0;
                if (args.marker) {
                    _this.setTitleText(args.marker.title);
                    _this.setSmashcutData(args.marker);
                    _this.setTime(args.marker.time);
                    _this.setThumbnail(null);
                    _this.setBackground(true);
                }
                else {
                    percentage = args.position;
                    _this.setTitleText(null);
                    _this.setSmashcutData(null);
                    var time = player.getDuration() * (percentage / 100);
                    _this.setTime(time);
                    _this.setThumbnail(player.getThumb(time));
                    _this.setBackground(false);
                }
            }
        });
        var init = function () {
            // Set time format depending on source duration
            _this.timeFormat = Math.abs(player.isLive() ? player.getMaxTimeShift() : player.getDuration()) >= 3600 ?
                utils_1.StringUtils.FORMAT_HHMMSS : utils_1.StringUtils.FORMAT_MMSS;
        };
        player.addEventHandler(player.EVENT.ON_READY, init);
        init();
    };
    /**
     * Sets arbitrary text on the label.
     * @param text the text to show on the label
     */
    SeekBarLabel.prototype.setText = function (text) {
        this.timeLabel.setText(text);
    };
    /**
     * Sets a time to be displayed on the label.
     * @param seconds the time in seconds to display on the label
     */
    SeekBarLabel.prototype.setTime = function (seconds) {
        this.setText(utils_1.StringUtils.secondsToTime(seconds, this.timeFormat));
    };
    /**
     * Sets the text on the title label.
     * @param text the text to show on the label
     */
    SeekBarLabel.prototype.setTitleText = function (text) {
        this.titleLabel.setText(text);
    };
    SeekBarLabel.prototype.setSmashcutData = function (marker) {
        if (marker) {
            this.commentLabel.setText(marker.comment);
            this.numberLabel.setText(marker.number);
            this.avatarLabel.setText(marker.avatar);
        }
        else {
            this.commentLabel.setText(null);
            this.numberLabel.setText(null);
            this.avatarLabel.setText(null);
        }
    };
    /**
     * Sets or removes a thumbnail on the label.
     * @param thumbnail the thumbnail to display on the label or null to remove a displayed thumbnail
     */
    SeekBarLabel.prototype.setThumbnail = function (thumbnail) {
        if (thumbnail === void 0) { thumbnail = null; }
        var thumbnailElement = this.thumbnail.getDomElement();
        if (thumbnail == null) {
            thumbnailElement.css({
                'background-image': null,
                'display': 'null',
                'width': 'null',
                'height': 'null'
            });
        }
        else {
            thumbnailElement.css({
                'display': 'inherit',
                'background-image': "url(" + thumbnail.url + ")",
                'width': thumbnail.w + 'px',
                'height': thumbnail.h + 'px',
                'background-position': "-" + thumbnail.x + "px -" + thumbnail.y + "px"
            });
        }
    };
    SeekBarLabel.prototype.setBackground = function (onOff) {
        var metadataElement = this.metadata.getDomElement();
        if (onOff) {
            metadataElement.css({
                'background': '#000'
            });
        }
        else {
            metadataElement.css({
                'background': 'initial'
            });
        }
    };
    return SeekBarLabel;
}(container_1.Container));
exports.SeekBarLabel = SeekBarLabel;

},{"../utils":54,"./component":14,"./container":15,"./label":21}],32:[function(require,module,exports){
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
var listselector_1 = require("./listselector");
var dom_1 = require("../dom");
/**
 * A simple select box providing the possibility to select a single item out of a list of available items.
 *
 * DOM example:
 * <code>
 *     <select class='ui-selectbox'>
 *         <option value='key'>label</option>
 *         ...
 *     </select>
 * </code>
 */
var SelectBox = (function (_super) {
    __extends(SelectBox, _super);
    function SelectBox(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-selectbox'
        }, _this.config);
        return _this;
    }
    SelectBox.prototype.toDomElement = function () {
        var _this = this;
        var selectElement = new dom_1.DOM('select', {
            'id': this.config.id,
            'class': this.getCssClasses()
        });
        this.selectElement = selectElement;
        this.updateDomItems();
        selectElement.on('change', function () {
            var value = selectElement.val();
            _this.onItemSelectedEvent(value, false);
        });
        return selectElement;
    };
    SelectBox.prototype.updateDomItems = function (selectedValue) {
        if (selectedValue === void 0) { selectedValue = null; }
        // Delete all children
        this.selectElement.empty();
        // Add updated children
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var optionElement = new dom_1.DOM('option', {
                'value': item.key
            }).html(item.label);
            if (item.key === selectedValue + '') {
                optionElement.attr('selected', 'selected');
            }
            this.selectElement.append(optionElement);
        }
    };
    SelectBox.prototype.onItemAddedEvent = function (value) {
        _super.prototype.onItemAddedEvent.call(this, value);
        this.updateDomItems(this.selectedItem);
    };
    SelectBox.prototype.onItemRemovedEvent = function (value) {
        _super.prototype.onItemRemovedEvent.call(this, value);
        this.updateDomItems(this.selectedItem);
    };
    SelectBox.prototype.onItemSelectedEvent = function (value, updateDomItems) {
        if (updateDomItems === void 0) { updateDomItems = true; }
        _super.prototype.onItemSelectedEvent.call(this, value);
        if (updateDomItems) {
            this.updateDomItems(value);
        }
    };
    return SelectBox;
}(listselector_1.ListSelector));
exports.SelectBox = SelectBox;

},{"../dom":48,"./listselector":22}],33:[function(require,module,exports){
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
var container_1 = require("./container");
var label_1 = require("./label");
var videoqualityselectbox_1 = require("./videoqualityselectbox");
var audioqualityselectbox_1 = require("./audioqualityselectbox");
var timeout_1 = require("../timeout");
var eventdispatcher_1 = require("../eventdispatcher");
/**
 * A panel containing a list of {@link SettingsPanelItem items} that represent labelled settings.
 */
var SettingsPanel = (function (_super) {
    __extends(SettingsPanel, _super);
    function SettingsPanel(config) {
        var _this = _super.call(this, config) || this;
        _this.settingsPanelEvents = {
            onSettingsStateChanged: new eventdispatcher_1.EventDispatcher()
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel',
            hideDelay: 3000
        }, _this.config);
        return _this;
    }
    SettingsPanel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig(); // TODO fix generics type inference
        if (config.hideDelay > -1) {
            this.hideTimeout = new timeout_1.Timeout(config.hideDelay, function () {
                _this.hide();
            });
            this.onShow.subscribe(function () {
                // Activate timeout when shown
                _this.hideTimeout.start();
            });
            this.getDomElement().on('mousemove', function () {
                // Reset timeout on interaction
                _this.hideTimeout.reset();
            });
            this.onHide.subscribe(function () {
                // Clear timeout when hidden from outside
                _this.hideTimeout.clear();
            });
        }
        // Fire event when the state of a settings-item has changed
        var settingsStateChangedHandler = function () {
            _this.onSettingsStateChangedEvent();
            // Attach marker class to last visible item
            var lastShownItem = null;
            for (var _i = 0, _a = _this.getItems(); _i < _a.length; _i++) {
                var component = _a[_i];
                if (component instanceof SettingsPanelItem) {
                    component.getDomElement().removeClass(_this.prefixCss(SettingsPanel.CLASS_LAST));
                    if (component.isShown()) {
                        lastShownItem = component;
                    }
                }
            }
            if (lastShownItem) {
                lastShownItem.getDomElement().addClass(_this.prefixCss(SettingsPanel.CLASS_LAST));
            }
        };
        for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
            var component = _a[_i];
            if (component instanceof SettingsPanelItem) {
                component.onActiveChanged.subscribe(settingsStateChangedHandler);
            }
        }
    };
    SettingsPanel.prototype.release = function () {
        _super.prototype.release.call(this);
        if (this.hideTimeout) {
            this.hideTimeout.clear();
        }
    };
    /**
     * Checks if there are active settings within this settings panel. An active setting is a setting that is visible
     * and enabled, which the user can interact with.
     * @returns {boolean} true if there are active settings, false if the panel is functionally empty to a user
     */
    SettingsPanel.prototype.hasActiveSettings = function () {
        for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.isActive()) {
                return true;
            }
        }
        return false;
    };
    SettingsPanel.prototype.getItems = function () {
        return this.config.components;
    };
    SettingsPanel.prototype.onSettingsStateChangedEvent = function () {
        this.settingsPanelEvents.onSettingsStateChanged.dispatch(this);
    };
    Object.defineProperty(SettingsPanel.prototype, "onSettingsStateChanged", {
        /**
         * Gets the event that is fired when one or more {@link SettingsPanelItem items} have changed state.
         * @returns {Event<SettingsPanel, NoArgs>}
         */
        get: function () {
            return this.settingsPanelEvents.onSettingsStateChanged.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    return SettingsPanel;
}(container_1.Container));
SettingsPanel.CLASS_LAST = 'last';
exports.SettingsPanel = SettingsPanel;
/**
 * An item for a {@link SettingsPanel}, containing a {@link Label} and a component that configures a setting.
 * Supported setting components: {@link SelectBox}
 */
var SettingsPanelItem = (function (_super) {
    __extends(SettingsPanelItem, _super);
    function SettingsPanelItem(label, selectBox, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.settingsPanelItemEvents = {
            onActiveChanged: new eventdispatcher_1.EventDispatcher()
        };
        _this.label = new label_1.Label({ text: label });
        _this.setting = selectBox;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel-item',
            components: [_this.label, _this.setting]
        }, _this.config);
        return _this;
    }
    SettingsPanelItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        var handleConfigItemChanged = function () {
            // The minimum number of items that must be available for the setting to be displayed
            // By default, at least two items must be available, else a selection is not possible
            var minItemsToDisplay = 2;
            // Audio/video quality select boxes contain an additional 'auto' mode, which in combination with a single
            // available quality also does not make sense
            if (_this.setting instanceof videoqualityselectbox_1.VideoQualitySelectBox || _this.setting instanceof audioqualityselectbox_1.AudioQualitySelectBox) {
                minItemsToDisplay = 3;
            }
            // Hide the setting if no meaningful choice is available
            if (_this.setting.itemCount() < minItemsToDisplay) {
                _this.hide();
            }
            else {
                _this.show();
            }
            // Visibility might have changed and therefore the active state might have changed so we fire the event
            // TODO fire only when state has really changed (e.g. check if visibility has really changed)
            _this.onActiveChangedEvent();
        };
        this.setting.onItemAdded.subscribe(handleConfigItemChanged);
        this.setting.onItemRemoved.subscribe(handleConfigItemChanged);
        // Initialize hidden state
        handleConfigItemChanged();
    };
    /**
     * Checks if this settings panel item is active, i.e. visible and enabled and a user can interact with it.
     * @returns {boolean} true if the panel is active, else false
     */
    SettingsPanelItem.prototype.isActive = function () {
        return this.isShown();
    };
    SettingsPanelItem.prototype.onActiveChangedEvent = function () {
        this.settingsPanelItemEvents.onActiveChanged.dispatch(this);
    };
    Object.defineProperty(SettingsPanelItem.prototype, "onActiveChanged", {
        /**
         * Gets the event that is fired when the 'active' state of this item changes.
         * @see #isActive
         * @returns {Event<SettingsPanelItem, NoArgs>}
         */
        get: function () {
            return this.settingsPanelItemEvents.onActiveChanged.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    return SettingsPanelItem;
}(container_1.Container));
exports.SettingsPanelItem = SettingsPanelItem;

},{"../eventdispatcher":49,"../timeout":52,"./audioqualityselectbox":5,"./container":15,"./label":21,"./videoqualityselectbox":42}],34:[function(require,module,exports){
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
 * A button that toggles visibility of a settings panel.
 */
var SettingsToggleButton = (function (_super) {
    __extends(SettingsToggleButton, _super);
    function SettingsToggleButton(config) {
        var _this = _super.call(this, config) || this;
        if (!config.settingsPanel) {
            throw new Error('Required SettingsPanel is missing');
        }
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settingstogglebutton',
            text: 'Settings',
            settingsPanel: null,
            autoHideWhenNoActiveSettings: true
        }, _this.config);
        return _this;
    }
    SettingsToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig(); // TODO fix generics type inference
        var settingsPanel = config.settingsPanel;
        this.onClick.subscribe(function () {
            settingsPanel.toggleHidden();
        });
        settingsPanel.onShow.subscribe(function () {
            // Set toggle status to on when the settings panel shows
            _this.on();
        });
        settingsPanel.onHide.subscribe(function () {
            // Set toggle status to off when the settings panel hides
            _this.off();
        });
        // Handle automatic hiding of the button if there are no settings for the user to interact with
        if (config.autoHideWhenNoActiveSettings) {
            // Setup handler to show/hide button when the settings change
            var settingsPanelItemsChangedHandler = function () {
                if (settingsPanel.hasActiveSettings()) {
                    if (_this.isHidden()) {
                        _this.show();
                    }
                }
                else {
                    if (_this.isShown()) {
                        _this.hide();
                    }
                }
            };
            // Wire the handler to the event
            settingsPanel.onSettingsStateChanged.subscribe(settingsPanelItemsChangedHandler);
            // Call handler for first init at startup
            settingsPanelItemsChangedHandler();
        }
    };
    return SettingsToggleButton;
}(togglebutton_1.ToggleButton));
exports.SettingsToggleButton = SettingsToggleButton;

},{"./togglebutton":39}],35:[function(require,module,exports){
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
var component_1 = require("./component");
/**
 * A dummy component that just reserves some space and does nothing else.
 */
var Spacer = (function (_super) {
    __extends(Spacer, _super);
    function Spacer(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-spacer',
        }, _this.config);
        return _this;
    }
    Spacer.prototype.onShowEvent = function () {
        // disable event firing by overwriting and not calling super
    };
    Spacer.prototype.onHideEvent = function () {
        // disable event firing by overwriting and not calling super
    };
    Spacer.prototype.onHoverChangedEvent = function (hovered) {
        // disable event firing by overwriting and not calling super
    };
    return Spacer;
}(component_1.Component));
exports.Spacer = Spacer;

},{"./component":14}],36:[function(require,module,exports){
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
var container_1 = require("./container");
var label_1 = require("./label");
var controlbar_1 = require("./controlbar");
/**
 * Overlays the player to display subtitles.
 */
var SubtitleOverlay = (function (_super) {
    __extends(SubtitleOverlay, _super);
    function SubtitleOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-subtitle-overlay',
        }, _this.config);
        return _this;
    }
    SubtitleOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var subtitleManager = new ActiveSubtitleManager();
        player.addEventHandler(player.EVENT.ON_CUE_ENTER, function (event) {
            var labelToAdd = subtitleManager.cueEnter(event);
            _this.addComponent(labelToAdd);
            _this.updateComponents();
            _this.show();
        });
        player.addEventHandler(player.EVENT.ON_CUE_EXIT, function (event) {
            var labelToRemove = subtitleManager.cueExit(event);
            _this.removeComponent(labelToRemove);
            _this.updateComponents();
            if (!subtitleManager.hasCues) {
                _this.hide();
            }
        });
        var subtitleClearHandler = function () {
            _this.hide();
            subtitleManager.clear();
            _this.removeComponents();
            _this.updateComponents();
        };
        player.addEventHandler(player.EVENT.ON_AUDIO_CHANGED, subtitleClearHandler);
        player.addEventHandler(player.EVENT.ON_SUBTITLE_CHANGED, subtitleClearHandler);
        player.addEventHandler(player.EVENT.ON_SEEK, subtitleClearHandler);
        player.addEventHandler(player.EVENT.ON_TIME_SHIFT, subtitleClearHandler);
        player.addEventHandler(player.EVENT.ON_PLAYBACK_FINISHED, subtitleClearHandler);
        uimanager.onComponentShow.subscribe(function (component) {
            if (component instanceof controlbar_1.ControlBar) {
                _this.getDomElement().addClass(_this.prefixCss(SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE));
            }
        });
        uimanager.onComponentHide.subscribe(function (component) {
            if (component instanceof controlbar_1.ControlBar) {
                _this.getDomElement().removeClass(_this.prefixCss(SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE));
            }
        });
        // Init
        subtitleClearHandler();
    };
    return SubtitleOverlay;
}(container_1.Container));
SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE = 'controlbar-visible';
exports.SubtitleOverlay = SubtitleOverlay;
var SubtitleLabel = (function (_super) {
    __extends(SubtitleLabel, _super);
    function SubtitleLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-subtitle-label'
        }, _this.config);
        return _this;
    }
    return SubtitleLabel;
}(label_1.Label));
var ActiveSubtitleManager = (function () {
    function ActiveSubtitleManager() {
        this.activeSubtitleCueMap = {};
    }
    /**
     * Calculates a unique ID for a subtitle cue, which is needed to associate an ON_CUE_ENTER with its ON_CUE_EXIT
     * event so we can remove the correct subtitle in ON_CUE_EXIT when multiple subtitles are active at the same time.
     * The start time plus the text should make a unique identifier, and in the only case where a collision
     * can happen, two similar texts will displayed at a similar time so it does not matter which one we delete.
     * The start time should always be known, because it is required to schedule the ON_CUE_ENTER event. The end time
     * must not necessarily be known and therefore cannot be used for the ID.
     * @param event
     * @return {string}
     */
    ActiveSubtitleManager.calculateId = function (event) {
        return event.start + event.text;
    };
    /**
     * Adds a subtitle cue to the manager and returns the label that should be added to the subtitle overlay.
     * @param event
     * @return {SubtitleLabel}
     */
    ActiveSubtitleManager.prototype.cueEnter = function (event) {
        var id = ActiveSubtitleManager.calculateId(event);
        var label = new SubtitleLabel({
            // Prefer the HTML subtitle text if set, else use the plain text
            text: event.html || event.text
        });
        this.activeSubtitleCueMap[id] = { event: event, label: label };
        return label;
    };
    /**
     * Removes the subtitle cue from the manager and returns the label that should be removed from the subtitle overlay.
     * @param event
     * @return {SubtitleLabel}
     */
    ActiveSubtitleManager.prototype.cueExit = function (event) {
        var id = ActiveSubtitleManager.calculateId(event);
        var activeSubtitleCue = this.activeSubtitleCueMap[id];
        delete this.activeSubtitleCueMap[id];
        return activeSubtitleCue.label;
    };
    Object.defineProperty(ActiveSubtitleManager.prototype, "cueCount", {
        /**
         * Returns the number of active subtitle cues.
         * @return {number}
         */
        get: function () {
            return Object.keys(this.activeSubtitleCueMap).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActiveSubtitleManager.prototype, "hasCues", {
        /**
         * Returns true if there are active subtitle cues, else false.
         * @return {boolean}
         */
        get: function () {
            return this.cueCount > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Removes all subtitle cues from the manager.
     */
    ActiveSubtitleManager.prototype.clear = function () {
        this.activeSubtitleCueMap = {};
    };
    return ActiveSubtitleManager;
}());

},{"./container":15,"./controlbar":16,"./label":21}],37:[function(require,module,exports){
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
var selectbox_1 = require("./selectbox");
/**
 * A select box providing a selection between available subtitle and caption tracks.
 */
var SubtitleSelectBox = (function (_super) {
    __extends(SubtitleSelectBox, _super);
    function SubtitleSelectBox(config) {
        if (config === void 0) { config = {}; }
        return _super.call(this, config) || this;
    }
    SubtitleSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var updateSubtitles = function () {
            _this.clearItems();
            for (var _i = 0, _a = player.getAvailableSubtitles(); _i < _a.length; _i++) {
                var subtitle = _a[_i];
                _this.addItem(subtitle.id, subtitle.label);
            }
        };
        this.onItemSelected.subscribe(function (sender, value) {
            player.setSubtitle(value === 'null' ? null : value);
        });
        // React to API events
        player.addEventHandler(player.EVENT.ON_SUBTITLE_ADDED, function (event) {
            _this.addItem(event.subtitle.id, event.subtitle.label);
        });
        player.addEventHandler(player.EVENT.ON_SUBTITLE_CHANGED, function (event) {
            _this.selectItem(event.targetSubtitle.id);
        });
        player.addEventHandler(player.EVENT.ON_SUBTITLE_REMOVED, function (event) {
            _this.removeItem(event.subtitleId);
        });
        // Update subtitles when source goes away
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, updateSubtitles);
        // Update subtitles when a new source is loaded
        player.addEventHandler(player.EVENT.ON_READY, updateSubtitles);
        // Populate subtitles at startup
        updateSubtitles();
    };
    return SubtitleSelectBox;
}(selectbox_1.SelectBox));
exports.SubtitleSelectBox = SubtitleSelectBox;

},{"./selectbox":32}],38:[function(require,module,exports){
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
var container_1 = require("./container");
var metadatalabel_1 = require("./metadatalabel");
/**
 * Displays a title bar containing a label with the title of the video.
 */
var TitleBar = (function (_super) {
    __extends(TitleBar, _super);
    function TitleBar(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-titlebar',
            hidden: true,
            components: [
                new metadatalabel_1.MetadataLabel({ content: metadatalabel_1.MetadataLabelContent.Title }),
                new metadatalabel_1.MetadataLabel({ content: metadatalabel_1.MetadataLabelContent.Description })
            ],
            keepHiddenWithoutMetadata: false,
        }, _this.config);
        return _this;
    }
    TitleBar.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var shouldBeShown = !this.isHidden();
        var hasMetadataText = true; // Flag to track if any metadata label contains text
        var checkMetadataTextAndUpdateVisibility = function () {
            hasMetadataText = false;
            // Iterate through metadata labels and check if at least one of them contains text
            for (var _i = 0, _a = _this.getComponents(); _i < _a.length; _i++) {
                var component = _a[_i];
                if (component instanceof metadatalabel_1.MetadataLabel) {
                    if (!component.isEmpty()) {
                        hasMetadataText = true;
                        break;
                    }
                }
            }
            if (_this.isShown()) {
                // Hide a visible titlebar if it does not contain any text and the hidden flag is set
                if (config.keepHiddenWithoutMetadata && !hasMetadataText) {
                    _this.hide();
                }
            }
            else if (shouldBeShown) {
                // Show a hidden titlebar if it should actually be shown
                _this.show();
            }
        };
        // Listen to text change events to update the hasMetadataText flag when the metadata dynamically changes
        for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
            var component = _a[_i];
            if (component instanceof metadatalabel_1.MetadataLabel) {
                component.onTextChanged.subscribe(checkMetadataTextAndUpdateVisibility);
            }
        }
        uimanager.onControlsShow.subscribe(function () {
            shouldBeShown = true;
            if (!(config.keepHiddenWithoutMetadata && !hasMetadataText)) {
                _this.show();
            }
        });
        uimanager.onControlsHide.subscribe(function () {
            shouldBeShown = false;
            _this.hide();
        });
        // init
        checkMetadataTextAndUpdateVisibility();
    };
    return TitleBar;
}(container_1.Container));
exports.TitleBar = TitleBar;

},{"./container":15,"./metadatalabel":23}],39:[function(require,module,exports){
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
var button_1 = require("./button");
var eventdispatcher_1 = require("../eventdispatcher");
/**
 * A button that can be toggled between 'on' and 'off' states.
 */
var ToggleButton = (function (_super) {
    __extends(ToggleButton, _super);
    function ToggleButton(config) {
        var _this = _super.call(this, config) || this;
        _this.toggleButtonEvents = {
            onToggle: new eventdispatcher_1.EventDispatcher(),
            onToggleOn: new eventdispatcher_1.EventDispatcher(),
            onToggleOff: new eventdispatcher_1.EventDispatcher()
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-togglebutton'
        }, _this.config);
        return _this;
    }
    /**
     * Toggles the button to the 'on' state.
     */
    ToggleButton.prototype.on = function () {
        if (this.isOff()) {
            this.onState = true;
            this.getDomElement().removeClass(this.prefixCss(ToggleButton.CLASS_OFF));
            this.getDomElement().addClass(this.prefixCss(ToggleButton.CLASS_ON));
            this.onToggleEvent();
            this.onToggleOnEvent();
        }
    };
    /**
     * Toggles the button to the 'off' state.
     */
    ToggleButton.prototype.off = function () {
        if (this.isOn()) {
            this.onState = false;
            this.getDomElement().removeClass(this.prefixCss(ToggleButton.CLASS_ON));
            this.getDomElement().addClass(this.prefixCss(ToggleButton.CLASS_OFF));
            this.onToggleEvent();
            this.onToggleOffEvent();
        }
    };
    /**
     * Toggle the button 'on' if it is 'off', or 'off' if it is 'on'.
     */
    ToggleButton.prototype.toggle = function () {
        if (this.isOn()) {
            this.off();
        }
        else {
            this.on();
        }
    };
    /**
     * Checks if the toggle button is in the 'on' state.
     * @returns {boolean} true if button is 'on', false if 'off'
     */
    ToggleButton.prototype.isOn = function () {
        return this.onState;
    };
    /**
     * Checks if the toggle button is in the 'off' state.
     * @returns {boolean} true if button is 'off', false if 'on'
     */
    ToggleButton.prototype.isOff = function () {
        return !this.isOn();
    };
    ToggleButton.prototype.onClickEvent = function () {
        _super.prototype.onClickEvent.call(this);
        // Fire the toggle event together with the click event
        // (they are technically the same, only the semantics are different)
        this.onToggleEvent();
    };
    ToggleButton.prototype.onToggleEvent = function () {
        this.toggleButtonEvents.onToggle.dispatch(this);
    };
    ToggleButton.prototype.onToggleOnEvent = function () {
        this.toggleButtonEvents.onToggleOn.dispatch(this);
    };
    ToggleButton.prototype.onToggleOffEvent = function () {
        this.toggleButtonEvents.onToggleOff.dispatch(this);
    };
    Object.defineProperty(ToggleButton.prototype, "onToggle", {
        /**
         * Gets the event that is fired when the button is toggled.
         * @returns {Event<ToggleButton<Config>, NoArgs>}
         */
        get: function () {
            return this.toggleButtonEvents.onToggle.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToggleButton.prototype, "onToggleOn", {
        /**
         * Gets the event that is fired when the button is toggled 'on'.
         * @returns {Event<ToggleButton<Config>, NoArgs>}
         */
        get: function () {
            return this.toggleButtonEvents.onToggleOn.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToggleButton.prototype, "onToggleOff", {
        /**
         * Gets the event that is fired when the button is toggled 'off'.
         * @returns {Event<ToggleButton<Config>, NoArgs>}
         */
        get: function () {
            return this.toggleButtonEvents.onToggleOff.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    return ToggleButton;
}(button_1.Button));
ToggleButton.CLASS_ON = 'on';
ToggleButton.CLASS_OFF = 'off';
exports.ToggleButton = ToggleButton;

},{"../eventdispatcher":49,"./button":8}],40:[function(require,module,exports){
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
var component_1 = require("./component");
var dom_1 = require("../dom");
/**
 * Animated analog TV static noise.
 */
var TvNoiseCanvas = (function (_super) {
    __extends(TvNoiseCanvas, _super);
    function TvNoiseCanvas(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.canvasWidth = 160;
        _this.canvasHeight = 90;
        _this.interferenceHeight = 50;
        _this.lastFrameUpdate = 0;
        _this.frameInterval = 60;
        _this.useAnimationFrame = !!window.requestAnimationFrame;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-tvnoisecanvas'
        }, _this.config);
        return _this;
    }
    TvNoiseCanvas.prototype.toDomElement = function () {
        return this.canvas = new dom_1.DOM('canvas', { 'class': this.getCssClasses() });
    };
    TvNoiseCanvas.prototype.start = function () {
        this.canvasElement = this.canvas.getElements()[0];
        this.canvasContext = this.canvasElement.getContext('2d');
        this.noiseAnimationWindowPos = -this.canvasHeight;
        this.lastFrameUpdate = 0;
        this.canvasElement.width = this.canvasWidth;
        this.canvasElement.height = this.canvasHeight;
        this.renderFrame();
    };
    TvNoiseCanvas.prototype.stop = function () {
        if (this.useAnimationFrame) {
            cancelAnimationFrame(this.frameUpdateHandlerId);
        }
        else {
            clearTimeout(this.frameUpdateHandlerId);
        }
    };
    TvNoiseCanvas.prototype.renderFrame = function () {
        // This code has been copied from the player controls.js and simplified
        if (this.lastFrameUpdate + this.frameInterval > new Date().getTime()) {
            // It's too early to render the next frame
            this.scheduleNextRender();
            return;
        }
        var currentPixelOffset;
        var canvasWidth = this.canvasWidth;
        var canvasHeight = this.canvasHeight;
        // Create texture
        var noiseImage = this.canvasContext.createImageData(canvasWidth, canvasHeight);
        // Fill texture with noise
        for (var y = 0; y < canvasHeight; y++) {
            for (var x = 0; x < canvasWidth; x++) {
                currentPixelOffset = (canvasWidth * y * 4) + x * 4;
                noiseImage.data[currentPixelOffset] = Math.random() * 255;
                if (y < this.noiseAnimationWindowPos || y > this.noiseAnimationWindowPos + this.interferenceHeight) {
                    noiseImage.data[currentPixelOffset] *= 0.85;
                }
                noiseImage.data[currentPixelOffset + 1] = noiseImage.data[currentPixelOffset];
                noiseImage.data[currentPixelOffset + 2] = noiseImage.data[currentPixelOffset];
                noiseImage.data[currentPixelOffset + 3] = 50;
            }
        }
        // Put texture onto canvas
        this.canvasContext.putImageData(noiseImage, 0, 0);
        this.lastFrameUpdate = new Date().getTime();
        this.noiseAnimationWindowPos += 7;
        if (this.noiseAnimationWindowPos > canvasHeight) {
            this.noiseAnimationWindowPos = -canvasHeight;
        }
        this.scheduleNextRender();
    };
    TvNoiseCanvas.prototype.scheduleNextRender = function () {
        if (this.useAnimationFrame) {
            this.frameUpdateHandlerId = window.requestAnimationFrame(this.renderFrame.bind(this));
        }
        else {
            this.frameUpdateHandlerId = setTimeout(this.renderFrame.bind(this), this.frameInterval);
        }
    };
    return TvNoiseCanvas;
}(component_1.Component));
exports.TvNoiseCanvas = TvNoiseCanvas;

},{"../dom":48,"./component":14}],41:[function(require,module,exports){
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
var container_1 = require("./container");
var dom_1 = require("../dom");
var timeout_1 = require("../timeout");
var utils_1 = require("../utils");
/**
 * The base container that contains all of the UI. The UIContainer is passed to the {@link UIManager} to build and
 * setup the UI.
 */
var UIContainer = (function (_super) {
    __extends(UIContainer, _super);
    function UIContainer(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-uicontainer',
            hideDelay: 5000,
        }, _this.config);
        return _this;
    }
    UIContainer.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        this.configureUIShowHide(player, uimanager);
        this.configurePlayerStates(player, uimanager);
    };
    UIContainer.prototype.configureUIShowHide = function (player, uimanager) {
        var _this = this;
        var container = this.getDomElement();
        var config = this.getConfig();
        var isUiShown = false;
        var isSeeking = false;
        var isFirstTouch = true;
        var showUi = function () {
            if (!isUiShown) {
                // Let subscribers know that they should reveal themselves
                uimanager.onControlsShow.dispatch(_this);
                isUiShown = true;
            }
            // Don't trigger timeout while seeking (it will be triggered once the seek is finished) or casting
            if (!isSeeking && !player.isCasting()) {
                _this.uiHideTimeout.start();
            }
        };
        var hideUi = function () {
            // Hide the UI only if it is shown, and if not casting
            if (isUiShown && !player.isCasting()) {
                // Issue a preview event to check if we are good to hide the controls
                var previewHideEventArgs = {};
                uimanager.onPreviewControlsHide.dispatch(_this, previewHideEventArgs);
                if (!previewHideEventArgs.cancel) {
                    // If the preview wasn't canceled, let subscribers know that they should now hide themselves
                    uimanager.onControlsHide.dispatch(_this);
                    isUiShown = false;
                }
                else {
                    // If the hide preview was canceled, continue to show UI
                    showUi();
                }
            }
        };
        // Timeout to defer UI hiding by the configured delay time
        this.uiHideTimeout = new timeout_1.Timeout(config.hideDelay, hideUi);
        // On touch displays, the first touch reveals the UI
        container.on('touchend', function (e) {
            if (!isUiShown) {
                // Only if the UI is hidden, we prevent other actions (except for the first touch) and reveal the UI instead.
                // The first touch is not prevented to let other listeners receive the event and trigger an initial action, e.g.
                // the huge playback button can directly start playback instead of requiring a double tap which 1. reveals
                // the UI and 2. starts playback.
                if (isFirstTouch) {
                    isFirstTouch = false;
                }
                else {
                    e.preventDefault();
                }
                showUi();
            }
        });
        // When the mouse enters, we show the UI
        container.on('mouseenter', function () {
            showUi();
        });
        // When the mouse moves within, we show the UI
        container.on('mousemove', function () {
            showUi();
        });
        // When the mouse leaves, we can prepare to hide the UI, except a seek is going on
        container.on('mouseleave', function () {
            // When a seek is going on, the seek scrub pointer may exit the UI area while still seeking, and we do not hide
            // the UI in such cases
            if (!isSeeking) {
                _this.uiHideTimeout.start();
            }
        });
        uimanager.onSeek.subscribe(function () {
            _this.uiHideTimeout.clear(); // Don't hide UI while a seek is in progress
            isSeeking = true;
        });
        uimanager.onSeeked.subscribe(function () {
            isSeeking = false;
            _this.uiHideTimeout.start(); // Re-enable UI hide timeout after a seek
        });
        player.addEventHandler(player.EVENT.ON_CAST_STARTED, function () {
            showUi(); // Show UI when a Cast session has started (UI will then stay permanently on during the session)
        });
    };
    UIContainer.prototype.configurePlayerStates = function (player, uimanager) {
        var _this = this;
        var container = this.getDomElement();
        // Convert player states into CSS class names
        var stateClassNames = [];
        for (var state in utils_1.PlayerUtils.PlayerState) {
            if (isNaN(Number(state))) {
                var enumName = utils_1.PlayerUtils.PlayerState[utils_1.PlayerUtils.PlayerState[state]];
                stateClassNames[utils_1.PlayerUtils.PlayerState[state]] =
                    this.prefixCss(UIContainer.STATE_PREFIX + enumName.toLowerCase());
            }
        }
        var removeStates = function () {
            container.removeClass(stateClassNames[utils_1.PlayerUtils.PlayerState.IDLE]);
            container.removeClass(stateClassNames[utils_1.PlayerUtils.PlayerState.PREPARED]);
            container.removeClass(stateClassNames[utils_1.PlayerUtils.PlayerState.PLAYING]);
            container.removeClass(stateClassNames[utils_1.PlayerUtils.PlayerState.PAUSED]);
            container.removeClass(stateClassNames[utils_1.PlayerUtils.PlayerState.FINISHED]);
        };
        player.addEventHandler(player.EVENT.ON_READY, function () {
            removeStates();
            container.addClass(stateClassNames[utils_1.PlayerUtils.PlayerState.PREPARED]);
        });
        player.addEventHandler(player.EVENT.ON_PLAY, function () {
            removeStates();
            container.addClass(stateClassNames[utils_1.PlayerUtils.PlayerState.PLAYING]);
        });
        player.addEventHandler(player.EVENT.ON_PAUSED, function () {
            removeStates();
            container.addClass(stateClassNames[utils_1.PlayerUtils.PlayerState.PAUSED]);
        });
        player.addEventHandler(player.EVENT.ON_PLAYBACK_FINISHED, function () {
            removeStates();
            container.addClass(stateClassNames[utils_1.PlayerUtils.PlayerState.FINISHED]);
        });
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, function () {
            removeStates();
            container.addClass(stateClassNames[utils_1.PlayerUtils.PlayerState.IDLE]);
        });
        // Init in current player state
        container.addClass(stateClassNames[utils_1.PlayerUtils.getState(player)]);
        // Fullscreen marker class
        player.addEventHandler(player.EVENT.ON_FULLSCREEN_ENTER, function () {
            container.addClass(_this.prefixCss(UIContainer.FULLSCREEN));
        });
        player.addEventHandler(player.EVENT.ON_FULLSCREEN_EXIT, function () {
            container.removeClass(_this.prefixCss(UIContainer.FULLSCREEN));
        });
        // Init fullscreen state
        if (player.isFullscreen()) {
            container.addClass(this.prefixCss(UIContainer.FULLSCREEN));
        }
        // Buffering marker class
        player.addEventHandler(player.EVENT.ON_STALL_STARTED, function () {
            container.addClass(_this.prefixCss(UIContainer.BUFFERING));
        });
        player.addEventHandler(player.EVENT.ON_STALL_ENDED, function () {
            container.removeClass(_this.prefixCss(UIContainer.BUFFERING));
        });
        // Init buffering state
        if (player.isStalled()) {
            container.addClass(this.prefixCss(UIContainer.BUFFERING));
        }
        // RemoteControl marker class
        player.addEventHandler(player.EVENT.ON_CAST_STARTED, function () {
            container.addClass(_this.prefixCss(UIContainer.REMOTE_CONTROL));
        });
        player.addEventHandler(player.EVENT.ON_CAST_STOPPED, function () {
            container.removeClass(_this.prefixCss(UIContainer.REMOTE_CONTROL));
        });
        // Init RemoteControl state
        if (player.isCasting()) {
            container.addClass(this.prefixCss(UIContainer.REMOTE_CONTROL));
        }
        // Controls visibility marker class
        uimanager.onControlsShow.subscribe(function () {
            container.removeClass(_this.prefixCss(UIContainer.CONTROLS_HIDDEN));
            container.addClass(_this.prefixCss(UIContainer.CONTROLS_SHOWN));
        });
        uimanager.onControlsHide.subscribe(function () {
            container.removeClass(_this.prefixCss(UIContainer.CONTROLS_SHOWN));
            container.addClass(_this.prefixCss(UIContainer.CONTROLS_HIDDEN));
        });
        // Layout size classes
        var updateLayoutSizeClasses = function (width, height) {
            container.removeClass(_this.prefixCss('layout-max-width-400'));
            container.removeClass(_this.prefixCss('layout-max-width-600'));
            container.removeClass(_this.prefixCss('layout-max-width-800'));
            container.removeClass(_this.prefixCss('layout-max-width-1200'));
            if (width <= 400) {
                container.addClass(_this.prefixCss('layout-max-width-400'));
            }
            else if (width <= 600) {
                container.addClass(_this.prefixCss('layout-max-width-600'));
            }
            else if (width <= 800) {
                container.addClass(_this.prefixCss('layout-max-width-800'));
            }
            else if (width <= 1200) {
                container.addClass(_this.prefixCss('layout-max-width-1200'));
            }
        };
        player.addEventHandler(player.EVENT.ON_PLAYER_RESIZE, function (e) {
            // Convert strings (with "px" suffix) to ints
            var width = Math.round(Number(e.width.substring(0, e.width.length - 2)));
            var height = Math.round(Number(e.height.substring(0, e.height.length - 2)));
            updateLayoutSizeClasses(width, height);
        });
        // Init layout state
        updateLayoutSizeClasses(new dom_1.DOM(player.getFigure()).width(), new dom_1.DOM(player.getFigure()).height());
    };
    UIContainer.prototype.release = function () {
        _super.prototype.release.call(this);
        this.uiHideTimeout.clear();
    };
    UIContainer.prototype.toDomElement = function () {
        var container = _super.prototype.toDomElement.call(this);
        // Detect flexbox support (not supported in IE9)
        if (document && typeof document.createElement('p').style.flex !== 'undefined') {
            container.addClass(this.prefixCss('flexbox'));
        }
        else {
            container.addClass(this.prefixCss('no-flexbox'));
        }
        return container;
    };
    return UIContainer;
}(container_1.Container));
UIContainer.STATE_PREFIX = 'player-state-';
UIContainer.FULLSCREEN = 'fullscreen';
UIContainer.BUFFERING = 'buffering';
UIContainer.REMOTE_CONTROL = 'remote-control';
UIContainer.CONTROLS_SHOWN = 'controls-shown';
UIContainer.CONTROLS_HIDDEN = 'controls-hidden';
exports.UIContainer = UIContainer;

},{"../dom":48,"../timeout":52,"../utils":54,"./container":15}],42:[function(require,module,exports){
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
var selectbox_1 = require("./selectbox");
/**
 * A select box providing a selection between 'auto' and the available video qualities.
 */
var VideoQualitySelectBox = (function (_super) {
    __extends(VideoQualitySelectBox, _super);
    function VideoQualitySelectBox(config) {
        if (config === void 0) { config = {}; }
        return _super.call(this, config) || this;
    }
    VideoQualitySelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var updateVideoQualities = function () {
            var videoQualities = player.getAvailableVideoQualities();
            _this.clearItems();
            // Add entry for automatic quality switching (default setting)
            _this.addItem('auto', 'auto');
            // Add video qualities
            for (var _i = 0, videoQualities_1 = videoQualities; _i < videoQualities_1.length; _i++) {
                var videoQuality = videoQualities_1[_i];
                _this.addItem(videoQuality.id, videoQuality.label);
            }
        };
        this.onItemSelected.subscribe(function (sender, value) {
            player.setVideoQuality(value);
        });
        // Update qualities when source goes away
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, updateVideoQualities);
        // Update qualities when a new source is loaded
        player.addEventHandler(player.EVENT.ON_READY, updateVideoQualities);
        // Update quality selection when quality is changed (from outside)
        player.addEventHandler(player.EVENT.ON_VIDEO_DOWNLOAD_QUALITY_CHANGE, function () {
            var data = player.getDownloadedVideoData();
            _this.selectItem(data.isAuto ? 'auto' : data.id);
        });
        // Populate qualities at startup
        updateVideoQualities();
    };
    return VideoQualitySelectBox;
}(selectbox_1.SelectBox));
exports.VideoQualitySelectBox = VideoQualitySelectBox;

},{"./selectbox":32}],43:[function(require,module,exports){
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
var container_1 = require("./container");
var volumeslider_1 = require("./volumeslider");
var volumetogglebutton_1 = require("./volumetogglebutton");
var timeout_1 = require("../timeout");
/**
 * A composite volume control that consists of and internally manages a volume control button that can be used
 * for muting, and a (depending on the CSS style, e.g. slide-out) volume control bar.
 */
var VolumeControlButton = (function (_super) {
    __extends(VolumeControlButton, _super);
    function VolumeControlButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.volumeToggleButton = new volumetogglebutton_1.VolumeToggleButton();
        _this.volumeSlider = new volumeslider_1.VolumeSlider({
            vertical: config.vertical != null ? config.vertical : true,
            hidden: true
        });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-volumecontrolbutton',
            components: [_this.volumeToggleButton, _this.volumeSlider],
            hideDelay: 500
        }, _this.config);
        return _this;
    }
    VolumeControlButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var volumeToggleButton = this.getVolumeToggleButton();
        var volumeSlider = this.getVolumeSlider();
        this.volumeSliderHideTimeout = new timeout_1.Timeout(this.getConfig().hideDelay, function () {
            volumeSlider.hide();
        });
        /*
         * Volume Slider visibility handling
         *
         * The volume slider shall be visible while the user hovers the mute toggle button, while the user hovers the
         * volume slider, and while the user slides the volume slider. If none of these situations are true, the slider
         * shall disappear.
         */
        var volumeSliderHovered = false;
        volumeToggleButton.getDomElement().on('mouseenter', function () {
            // Show volume slider when mouse enters the button area
            if (volumeSlider.isHidden()) {
                volumeSlider.show();
            }
            // Avoid hiding of the slider when button is hovered
            _this.volumeSliderHideTimeout.clear();
        });
        volumeToggleButton.getDomElement().on('mouseleave', function () {
            // Hide slider delayed when button is left
            _this.volumeSliderHideTimeout.reset();
        });
        volumeSlider.getDomElement().on('mouseenter', function () {
            // When the slider is entered, cancel the hide timeout activated by leaving the button
            _this.volumeSliderHideTimeout.clear();
            volumeSliderHovered = true;
        });
        volumeSlider.getDomElement().on('mouseleave', function () {
            // When mouse leaves the slider, only hide it if there is no slide operation in progress
            if (volumeSlider.isSeeking()) {
                _this.volumeSliderHideTimeout.clear();
            }
            else {
                _this.volumeSliderHideTimeout.reset();
            }
            volumeSliderHovered = false;
        });
        volumeSlider.onSeeked.subscribe(function () {
            // When a slide operation is done and the slider not hovered (mouse outside slider), hide slider delayed
            if (!volumeSliderHovered) {
                _this.volumeSliderHideTimeout.reset();
            }
        });
    };
    VolumeControlButton.prototype.release = function () {
        _super.prototype.release.call(this);
        this.volumeSliderHideTimeout.clear();
    };
    /**
     * Provides access to the internally managed volume toggle button.
     * @returns {VolumeToggleButton}
     */
    VolumeControlButton.prototype.getVolumeToggleButton = function () {
        return this.volumeToggleButton;
    };
    /**
     * Provides access to the internally managed volume silder.
     * @returns {VolumeSlider}
     */
    VolumeControlButton.prototype.getVolumeSlider = function () {
        return this.volumeSlider;
    };
    return VolumeControlButton;
}(container_1.Container));
exports.VolumeControlButton = VolumeControlButton;

},{"../timeout":52,"./container":15,"./volumeslider":44,"./volumetogglebutton":45}],44:[function(require,module,exports){
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
var seekbar_1 = require("./seekbar");
/**
 * A simple volume slider component to adjust the player's volume setting.
 */
var VolumeSlider = (function (_super) {
    __extends(VolumeSlider, _super);
    function VolumeSlider(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-volumeslider',
            hideIfVolumeControlProhibited: true,
        }, _this.config);
        return _this;
    }
    VolumeSlider.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager, false);
        var config = this.getConfig();
        if (config.hideIfVolumeControlProhibited && !this.detectVolumeControlAvailability(player)) {
            this.hide();
            // We can just return from here, because the user will never interact with the control and any configured
            // functionality would only eat resources for no reason.
            return;
        }
        var volumeChangeHandler = function () {
            if (player.isMuted()) {
                _this.setPlaybackPosition(0);
                _this.setBufferPosition(0);
            }
            else {
                _this.setPlaybackPosition(player.getVolume());
                _this.setBufferPosition(player.getVolume());
            }
        };
        player.addEventHandler(player.EVENT.ON_READY, volumeChangeHandler);
        player.addEventHandler(player.EVENT.ON_VOLUME_CHANGED, volumeChangeHandler);
        player.addEventHandler(player.EVENT.ON_MUTED, volumeChangeHandler);
        player.addEventHandler(player.EVENT.ON_UNMUTED, volumeChangeHandler);
        this.onSeekPreview.subscribe(function (sender, args) {
            if (args.scrubbing) {
                player.setVolume(args.position);
            }
        });
        this.onSeeked.subscribe(function (sender, percentage) {
            player.setVolume(percentage);
        });
        // Update the volume slider marker when the player resized, a source is loaded and player is ready,
        // or the UI is configured. Check the seekbar for a detailed description.
        player.addEventHandler(player.EVENT.ON_PLAYER_RESIZE, function () {
            _this.refreshPlaybackPosition();
        });
        player.addEventHandler(player.EVENT.ON_READY, function () {
            _this.refreshPlaybackPosition();
        });
        uimanager.onConfigured.subscribe(function () {
            _this.refreshPlaybackPosition();
        });
        // Init volume bar
        volumeChangeHandler();
    };
    VolumeSlider.prototype.detectVolumeControlAvailability = function (player) {
        // Store current player state so we can restore it later
        var volume = player.getVolume();
        var muted = player.isMuted();
        var playing = player.isPlaying();
        /*
         * "On iOS devices, the audio level is always under the user’s physical control. The volume property is not
         * settable in JavaScript. Reading the volume property always returns 1."
         * https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html
         *
         * Our player API returns a volume range of [0, 100] so we need to check for 100 instead of 1.
         */
        // Only if the volume is 100, there's the possibility we are on a volume-control-restricted iOS device
        if (volume === 100) {
            // We set the volume to zero (that's the only value that does not unmute a muted player!)
            player.setVolume(0);
            // Then we check if the value is still 100
            if (player.getVolume() === 100) {
                // If the volume stayed at 100, we're on a volume-control-restricted device
                return false;
            }
            else {
                // We can control volume, so we must restore the previous player state
                player.setVolume(volume);
                if (muted) {
                    player.mute();
                }
                if (playing) {
                    // The volume restore above pauses autoplay on mobile devices (e.g. Android) so we need to resume playback
                    // (We cannot check isPaused() here because it is not set when playback is prohibited by the mobile platform)
                    player.play();
                }
                return true;
            }
        }
        else {
            // Volume is not 100, so we're definitely not on a volume-control-restricted iOS device
            return true;
        }
    };
    return VolumeSlider;
}(seekbar_1.SeekBar));
exports.VolumeSlider = VolumeSlider;

},{"./seekbar":30}],45:[function(require,module,exports){
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
 * A button that toggles audio muting.
 */
var VolumeToggleButton = (function (_super) {
    __extends(VolumeToggleButton, _super);
    function VolumeToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-volumetogglebutton',
            text: 'Volume/Mute'
        }, _this.config);
        return _this;
    }
    VolumeToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var muteStateHandler = function () {
            if (player.isMuted()) {
                _this.on();
            }
            else {
                _this.off();
            }
        };
        var volumeLevelHandler = function () {
            // Toggle low class to display low volume icon below 50% volume
            if (player.getVolume() < 50) {
                _this.getDomElement().addClass(_this.prefixCss('low'));
            }
            else {
                _this.getDomElement().removeClass(_this.prefixCss('low'));
            }
        };
        player.addEventHandler(player.EVENT.ON_MUTED, muteStateHandler);
        player.addEventHandler(player.EVENT.ON_UNMUTED, muteStateHandler);
        player.addEventHandler(player.EVENT.ON_VOLUME_CHANGED, volumeLevelHandler);
        this.onClick.subscribe(function () {
            if (player.isMuted()) {
                player.unmute();
            }
            else {
                player.mute();
            }
        });
        // Startup init
        muteStateHandler();
        volumeLevelHandler();
    };
    return VolumeToggleButton;
}(togglebutton_1.ToggleButton));
exports.VolumeToggleButton = VolumeToggleButton;

},{"./togglebutton":39}],46:[function(require,module,exports){
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
 * A button that toggles the video view between normal/mono and VR/stereo.
 */
var VRToggleButton = (function (_super) {
    __extends(VRToggleButton, _super);
    function VRToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-vrtogglebutton',
            text: 'VR'
        }, _this.config);
        return _this;
    }
    VRToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var isVRConfigured = function () {
            // VR availability cannot be checked through getVRStatus() because it is asynchronously populated and not
            // available at UI initialization. As an alternative, we check the VR settings in the config.
            // TODO use getVRStatus() through isVRStereoAvailable() once the player has been rewritten and the status is
            // available in ON_READY
            var config = player.getConfig();
            return config.source && config.source.vr && config.source.vr.contentType !== 'none';
        };
        var isVRStereoAvailable = function () {
            return player.getVRStatus().contentType !== 'none';
        };
        var vrStateHandler = function () {
            if (isVRConfigured() && isVRStereoAvailable()) {
                _this.show(); // show button in case it is hidden
                if (player.getVRStatus().isStereo) {
                    _this.on();
                }
                else {
                    _this.off();
                }
            }
            else {
                _this.hide(); // hide button if no stereo mode available
            }
        };
        var vrButtonVisibilityHandler = function () {
            if (isVRConfigured()) {
                _this.show();
            }
            else {
                _this.hide();
            }
        };
        player.addEventHandler(player.EVENT.ON_VR_MODE_CHANGED, vrStateHandler);
        player.addEventHandler(player.EVENT.ON_VR_STEREO_CHANGED, vrStateHandler);
        player.addEventHandler(player.EVENT.ON_VR_ERROR, vrStateHandler);
        // Hide button when VR source goes away
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, vrButtonVisibilityHandler);
        // Show button when a new source is loaded and it's VR
        player.addEventHandler(player.EVENT.ON_READY, vrButtonVisibilityHandler);
        this.onClick.subscribe(function () {
            if (!isVRStereoAvailable()) {
                if (console) {
                    console.log('No VR content');
                }
            }
            else {
                if (player.getVRStatus().isStereo) {
                    player.setVRStereo(false);
                }
                else {
                    player.setVRStereo(true);
                }
            }
        });
        // Set startup visibility
        vrButtonVisibilityHandler();
    };
    return VRToggleButton;
}(togglebutton_1.ToggleButton));
exports.VRToggleButton = VRToggleButton;

},{"./togglebutton":39}],47:[function(require,module,exports){
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
var clickoverlay_1 = require("./clickoverlay");
/**
 * A watermark overlay with a clickable logo.
 */
var Watermark = (function (_super) {
    __extends(Watermark, _super);
    function Watermark(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-watermark',
            url: 'http://bitmovin.com'
        }, _this.config);
        return _this;
    }
    return Watermark;
}(clickoverlay_1.ClickOverlay));
exports.Watermark = Watermark;

},{"./clickoverlay":12}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simple DOM manipulation and DOM element event handling modeled after jQuery (as replacement for jQuery).
 *
 * Like jQuery, DOM operates on single elements and lists of elements. For example: creating an element returns a DOM
 * instance with a single element, selecting elements returns a DOM instance with zero, one, or many elements. Similar
 * to jQuery, setters usually affect all elements, while getters operate on only the first element.
 * Also similar to jQuery, most methods (except getters) return the DOM instance facilitating easy chaining of method
 * calls.
 *
 * Built with the help of: http://youmightnotneedjquery.com/
 */
var DOM = (function () {
    function DOM(something, attributes) {
        this.document = document; // Set the global document to the local document field
        if (something instanceof Array) {
            if (something.length > 0 && something[0] instanceof HTMLElement) {
                var elements = something;
                this.elements = elements;
            }
        }
        else if (something instanceof HTMLElement) {
            var element = something;
            this.elements = [element];
        }
        else if (something instanceof Document) {
            // When a document is passed in, we do not do anything with it, but by setting this.elements to null
            // we give the event handling method a means to detect if the events should be registered on the document
            // instead of elements.
            this.elements = null;
        }
        else if (attributes) {
            var tagName = something;
            var element = document.createElement(tagName);
            for (var attributeName in attributes) {
                var attributeValue = attributes[attributeName];
                element.setAttribute(attributeName, attributeValue);
            }
            this.elements = [element];
        }
        else {
            var selector = something;
            this.elements = this.findChildElements(selector);
        }
    }
    Object.defineProperty(DOM.prototype, "length", {
        /**
         * Gets the number of elements that this DOM instance currently holds.
         * @returns {number} the number of elements
         */
        get: function () {
            return this.elements ? this.elements.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the HTML elements that this DOM instance currently holds.
     * @returns {HTMLElement[]} the raw HTML elements
     */
    DOM.prototype.getElements = function () {
        return this.elements;
    };
    /**
     * A shortcut method for iterating all elements. Shorts this.elements.forEach(...) to this.forEach(...).
     * @param handler the handler to execute an operation on an element
     */
    DOM.prototype.forEach = function (handler) {
        this.elements.forEach(function (element) {
            handler(element);
        });
    };
    DOM.prototype.findChildElementsOfElement = function (element, selector) {
        var childElements = element.querySelectorAll(selector);
        // Convert NodeList to Array
        // https://toddmotto.com/a-comprehensive-dive-into-nodelists-arrays-converting-nodelists-and-understanding-the-dom/
        return [].slice.call(childElements);
    };
    DOM.prototype.findChildElements = function (selector) {
        var _this = this;
        var allChildElements = [];
        if (this.elements) {
            this.forEach(function (element) {
                allChildElements = allChildElements.concat(_this.findChildElementsOfElement(element, selector));
            });
        }
        else {
            return this.findChildElementsOfElement(document, selector);
        }
        return allChildElements;
    };
    /**
     * Finds all child elements of all elements matching the supplied selector.
     * @param selector the selector to match with child elements
     * @returns {DOM} a new DOM instance representing all matched children
     */
    DOM.prototype.find = function (selector) {
        var allChildElements = this.findChildElements(selector);
        return new DOM(allChildElements);
    };
    DOM.prototype.html = function (content) {
        if (arguments.length > 0) {
            return this.setHtml(content);
        }
        else {
            return this.getHtml();
        }
    };
    DOM.prototype.getHtml = function () {
        return this.elements[0].innerHTML;
    };
    DOM.prototype.setHtml = function (content) {
        if (content === undefined || content == null) {
            // Set to empty string to avoid innerHTML getting set to 'undefined' (all browsers) or 'null' (IE9)
            content = '';
        }
        this.forEach(function (element) {
            element.innerHTML = content;
        });
        return this;
    };
    /**
     * Clears the inner HTML of all elements (deletes all children).
     * @returns {DOM}
     */
    DOM.prototype.empty = function () {
        this.forEach(function (element) {
            element.innerHTML = '';
        });
        return this;
    };
    /**
     * Returns the current value of the first form element, e.g. the selected value of a select box or the text if an
     * input field.
     * @returns {string} the value of a form element
     */
    DOM.prototype.val = function () {
        var element = this.elements[0];
        if (element instanceof HTMLSelectElement || element instanceof HTMLInputElement) {
            return element.value;
        }
        else {
            // TODO add support for missing form elements
            throw new Error("val() not supported for " + typeof element);
        }
    };
    DOM.prototype.attr = function (attribute, value) {
        if (arguments.length > 1) {
            return this.setAttr(attribute, value);
        }
        else {
            return this.getAttr(attribute);
        }
    };
    DOM.prototype.getAttr = function (attribute) {
        return this.elements[0].getAttribute(attribute);
    };
    DOM.prototype.setAttr = function (attribute, value) {
        this.forEach(function (element) {
            element.setAttribute(attribute, value);
        });
        return this;
    };
    DOM.prototype.data = function (dataAttribute, value) {
        if (arguments.length > 1) {
            return this.setData(dataAttribute, value);
        }
        else {
            return this.getData(dataAttribute);
        }
    };
    DOM.prototype.getData = function (dataAttribute) {
        return this.elements[0].getAttribute('data-' + dataAttribute);
    };
    DOM.prototype.setData = function (dataAttribute, value) {
        this.forEach(function (element) {
            element.setAttribute('data-' + dataAttribute, value);
        });
        return this;
    };
    /**
     * Appends one or more DOM elements as children to all elements.
     * @param childElements the chrild elements to append
     * @returns {DOM}
     */
    DOM.prototype.append = function () {
        var childElements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            childElements[_i] = arguments[_i];
        }
        this.forEach(function (element) {
            childElements.forEach(function (childElement) {
                childElement.elements.forEach(function (_, index) {
                    element.appendChild(childElement.elements[index]);
                });
            });
        });
        return this;
    };
    /**
     * Removes all elements from the DOM.
     */
    DOM.prototype.remove = function () {
        this.forEach(function (element) {
            var parent = element.parentNode;
            if (parent) {
                parent.removeChild(element);
            }
        });
    };
    /**
     * Returns the offset of the first element from the document's top left corner.
     * @returns {Offset}
     */
    DOM.prototype.offset = function () {
        var element = this.elements[0];
        var elementRect = element.getBoundingClientRect();
        var htmlRect = document.body.parentElement.getBoundingClientRect();
        // Virtual viewport scroll handling (e.g. pinch zoomed viewports in mobile browsers or desktop Chrome/Edge)
        // 'normal' zooms and virtual viewport zooms (aka layout viewport) result in different
        // element.getBoundingClientRect() results:
        //  - with normal scrolls, the clientRect decreases with an increase in scroll(Top|Left)/page(X|Y)Offset
        //  - with pinch zoom scrolls, the clientRect stays the same while scroll/pageOffset changes
        // This means, that the combination of clientRect + scroll/pageOffset does not work to calculate the offset
        // from the document's upper left origin when pinch zoom is used.
        // To work around this issue, we do not use scroll/pageOffset but get the clientRect of the html element and
        // subtract it from the element's rect, which always results in the offset from the document origin.
        // NOTE: the current way of offset calculation was implemented specifically to track event positions on the
        // seek bar, and it might break compatibility with jQuery's offset() method. If this ever turns out to be a
        // problem, this method should be reverted to the old version and the offset calculation moved to the seek bar.
        return {
            top: elementRect.top - htmlRect.top,
            left: elementRect.left - htmlRect.left
        };
    };
    /**
     * Returns the width of the first element.
     * @returns {number} the width of the first element
     */
    DOM.prototype.width = function () {
        // TODO check if this is the same as jQuery's width() (probably not)
        return this.elements[0].offsetWidth;
    };
    /**
     * Returns the height of the first element.
     * @returns {number} the height of the first element
     */
    DOM.prototype.height = function () {
        // TODO check if this is the same as jQuery's height() (probably not)
        return this.elements[0].offsetHeight;
    };
    /**
     * Attaches an event handler to one or more events on all elements.
     * @param eventName the event name (or multiple names separated by space) to listen to
     * @param eventHandler the event handler to call when the event fires
     * @returns {DOM}
     */
    DOM.prototype.on = function (eventName, eventHandler) {
        var _this = this;
        var events = eventName.split(' ');
        events.forEach(function (event) {
            if (_this.elements == null) {
                _this.document.addEventListener(event, eventHandler);
            }
            else {
                _this.forEach(function (element) {
                    element.addEventListener(event, eventHandler);
                });
            }
        });
        return this;
    };
    /**
     * Removes an event handler from one or more events on all elements.
     * @param eventName the event name (or multiple names separated by space) to remove the handler from
     * @param eventHandler the event handler to remove
     * @returns {DOM}
     */
    DOM.prototype.off = function (eventName, eventHandler) {
        var _this = this;
        var events = eventName.split(' ');
        events.forEach(function (event) {
            if (_this.elements == null) {
                _this.document.removeEventListener(event, eventHandler);
            }
            else {
                _this.forEach(function (element) {
                    element.removeEventListener(event, eventHandler);
                });
            }
        });
        return this;
    };
    /**
     * Adds the specified class(es) to all elements.
     * @param className the class(es) to add, multiple classes separated by space
     * @returns {DOM}
     */
    DOM.prototype.addClass = function (className) {
        this.forEach(function (element) {
            if (element.classList) {
                element.classList.add(className);
            }
            else {
                element.className += ' ' + className;
            }
        });
        return this;
    };
    /**
     * Removed the specified class(es) from all elements.
     * @param className the class(es) to remove, multiple classes separated by space
     * @returns {DOM}
     */
    DOM.prototype.removeClass = function (className) {
        this.forEach(function (element) {
            if (element.classList) {
                element.classList.remove(className);
            }
            else {
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        });
        return this;
    };
    /**
     * Checks if any of the elements has the specified class.
     * @param className the class name to check
     * @returns {boolean} true if one of the elements has the class attached, else if no element has it attached
     */
    DOM.prototype.hasClass = function (className) {
        var hasClass = false;
        this.forEach(function (element) {
            if (element.classList) {
                if (element.classList.contains(className)) {
                    // Since we are inside a handler, we can't just 'return true'. Instead, we save it to a variable
                    // and return it at the end of the function body.
                    hasClass = true;
                }
            }
            else {
                if (new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className)) {
                    // See comment above
                    hasClass = true;
                }
            }
        });
        return hasClass;
    };
    DOM.prototype.css = function (propertyNameOrCollection, value) {
        if (typeof propertyNameOrCollection === 'string') {
            var propertyName = propertyNameOrCollection;
            if (arguments.length === 2) {
                return this.setCss(propertyName, value);
            }
            else {
                return this.getCss(propertyName);
            }
        }
        else {
            var propertyValueCollection = propertyNameOrCollection;
            return this.setCssCollection(propertyValueCollection);
        }
    };
    DOM.prototype.getCss = function (propertyName) {
        return getComputedStyle(this.elements[0])[propertyName];
    };
    DOM.prototype.setCss = function (propertyName, value) {
        this.forEach(function (element) {
            // <any> cast to resolve TS7015: http://stackoverflow.com/a/36627114/370252
            element.style[propertyName] = value;
        });
        return this;
    };
    DOM.prototype.setCssCollection = function (ruleValueCollection) {
        this.forEach(function (element) {
            // http://stackoverflow.com/a/34490573/370252
            Object.assign(element.style, ruleValueCollection);
        });
        return this;
    };
    return DOM;
}());
exports.DOM = DOM;

},{}],49:[function(require,module,exports){
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
var utils_1 = require("./utils");
/**
 * Event dispatcher to subscribe and trigger events. Each event should have its own dispatcher.
 */
var EventDispatcher = (function () {
    function EventDispatcher() {
        this.listeners = [];
    }
    /**
     * {@inheritDoc}
     */
    EventDispatcher.prototype.subscribe = function (listener) {
        this.listeners.push(new EventListenerWrapper(listener));
    };
    /**
     * {@inheritDoc}
     */
    EventDispatcher.prototype.subscribeOnce = function (listener) {
        this.listeners.push(new EventListenerWrapper(listener, true));
    };
    /**
     * {@inheritDoc}
     */
    EventDispatcher.prototype.subscribeRateLimited = function (listener, rateMs) {
        this.listeners.push(new RateLimitedEventListenerWrapper(listener, rateMs));
    };
    /**
     * {@inheritDoc}
     */
    EventDispatcher.prototype.unsubscribe = function (listener) {
        // Iterate through listeners, compare with parameter, and remove if found
        for (var i = 0; i < this.listeners.length; i++) {
            var subscribedListener = this.listeners[i];
            if (subscribedListener.listener === listener) {
                utils_1.ArrayUtils.remove(this.listeners, subscribedListener);
                return true;
            }
        }
        return false;
    };
    /**
     * Removes all listeners from this dispatcher.
     */
    EventDispatcher.prototype.unsubscribeAll = function () {
        this.listeners = [];
    };
    /**
     * Dispatches an event to all subscribed listeners.
     * @param sender the source of the event
     * @param args the arguments for the event
     */
    EventDispatcher.prototype.dispatch = function (sender, args) {
        if (args === void 0) { args = null; }
        var listenersToRemove = [];
        // Call every listener
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener.fire(sender, args);
            if (listener.isOnce()) {
                listenersToRemove.push(listener);
            }
        }
        // Remove one-time listener
        for (var _b = 0, listenersToRemove_1 = listenersToRemove; _b < listenersToRemove_1.length; _b++) {
            var listenerToRemove = listenersToRemove_1[_b];
            utils_1.ArrayUtils.remove(this.listeners, listenerToRemove);
        }
    };
    /**
     * Returns the event that this dispatcher manages and on which listeners can subscribe and unsubscribe event handlers.
     * @returns {Event}
     */
    EventDispatcher.prototype.getEvent = function () {
        // For now, just cast the event dispatcher to the event interface. At some point in the future when the
        // codebase grows, it might make sense to split the dispatcher into separate dispatcher and event classes.
        return this;
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
/**
 * A basic event listener wrapper to manage listeners within the {@link EventDispatcher}. This is a 'private' class
 * for internal dispatcher use and it is therefore not exported.
 */
var EventListenerWrapper = (function () {
    function EventListenerWrapper(listener, once) {
        if (once === void 0) { once = false; }
        this.eventListener = listener;
        this.once = once;
    }
    Object.defineProperty(EventListenerWrapper.prototype, "listener", {
        /**
         * Returns the wrapped event listener.
         * @returns {EventListener<Sender, Args>}
         */
        get: function () {
            return this.eventListener;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Fires the wrapped event listener with the given arguments.
     * @param sender
     * @param args
     */
    EventListenerWrapper.prototype.fire = function (sender, args) {
        this.eventListener(sender, args);
    };
    /**
     * Checks if this listener is scheduled to be called only once.
     * @returns {boolean} once if true
     */
    EventListenerWrapper.prototype.isOnce = function () {
        return this.once;
    };
    return EventListenerWrapper;
}());
/**
 * Extends the basic {@link EventListenerWrapper} with rate-limiting functionality.
 */
var RateLimitedEventListenerWrapper = (function (_super) {
    __extends(RateLimitedEventListenerWrapper, _super);
    function RateLimitedEventListenerWrapper(listener, rateMs) {
        var _this = _super.call(this, listener) || this;
        _this.rateMs = rateMs;
        _this.lastFireTime = 0;
        // Wrap the event listener with an event listener that does the rate-limiting
        _this.rateLimitingEventListener = function (sender, args) {
            if (Date.now() - _this.lastFireTime > _this.rateMs) {
                // Only if enough time since the previous call has passed, call the
                // actual event listener and record the current time
                _this.fireSuper(sender, args);
                _this.lastFireTime = Date.now();
            }
        };
        return _this;
    }
    RateLimitedEventListenerWrapper.prototype.fireSuper = function (sender, args) {
        // Fire the actual external event listener
        _super.prototype.fire.call(this, sender, args);
    };
    RateLimitedEventListenerWrapper.prototype.fire = function (sender, args) {
        // Fire the internal rate-limiting listener instead of the external event listener
        this.rateLimitingEventListener(sender, args);
    };
    return RateLimitedEventListenerWrapper;
}(EventListenerWrapper));

},{"./utils":54}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid;
(function (Guid) {
    var guid = 1;
    function next() {
        return guid++;
    }
    Guid.next = next;
})(Guid = exports.Guid || (exports.Guid = {}));

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='player.d.ts' />
var uimanager_1 = require("./uimanager");
var button_1 = require("./components/button");
var controlbar_1 = require("./components/controlbar");
var fullscreentogglebutton_1 = require("./components/fullscreentogglebutton");
var hugeplaybacktogglebutton_1 = require("./components/hugeplaybacktogglebutton");
var playbacktimelabel_1 = require("./components/playbacktimelabel");
var playbacktogglebutton_1 = require("./components/playbacktogglebutton");
var seekbar_1 = require("./components/seekbar");
var selectbox_1 = require("./components/selectbox");
var settingspanel_1 = require("./components/settingspanel");
var settingstogglebutton_1 = require("./components/settingstogglebutton");
var togglebutton_1 = require("./components/togglebutton");
var videoqualityselectbox_1 = require("./components/videoqualityselectbox");
var volumetogglebutton_1 = require("./components/volumetogglebutton");
var vrtogglebutton_1 = require("./components/vrtogglebutton");
var watermark_1 = require("./components/watermark");
var uicontainer_1 = require("./components/uicontainer");
var container_1 = require("./components/container");
var label_1 = require("./components/label");
var audioqualityselectbox_1 = require("./components/audioqualityselectbox");
var audiotrackselectbox_1 = require("./components/audiotrackselectbox");
var caststatusoverlay_1 = require("./components/caststatusoverlay");
var casttogglebutton_1 = require("./components/casttogglebutton");
var component_1 = require("./components/component");
var errormessageoverlay_1 = require("./components/errormessageoverlay");
var recommendationoverlay_1 = require("./components/recommendationoverlay");
var seekbarlabel_1 = require("./components/seekbarlabel");
var subtitleoverlay_1 = require("./components/subtitleoverlay");
var subtitleselectbox_1 = require("./components/subtitleselectbox");
var titlebar_1 = require("./components/titlebar");
var volumecontrolbutton_1 = require("./components/volumecontrolbutton");
var clickoverlay_1 = require("./components/clickoverlay");
var adskipbutton_1 = require("./components/adskipbutton");
var admessagelabel_1 = require("./components/admessagelabel");
var adclickoverlay_1 = require("./components/adclickoverlay");
var playbackspeedselectbox_1 = require("./components/playbackspeedselectbox");
var hugereplaybutton_1 = require("./components/hugereplaybutton");
var bufferingoverlay_1 = require("./components/bufferingoverlay");
var castuicontainer_1 = require("./components/castuicontainer");
var playbacktoggleoverlay_1 = require("./components/playbacktoggleoverlay");
var closebutton_1 = require("./components/closebutton");
var metadatalabel_1 = require("./components/metadatalabel");
var airplaytogglebutton_1 = require("./components/airplaytogglebutton");
var volumeslider_1 = require("./components/volumeslider");
var pictureinpicturetogglebutton_1 = require("./components/pictureinpicturetogglebutton");
var spacer_1 = require("./components/spacer");
var utils_1 = require("./utils");
// Object.assign polyfill for ES5/IE9
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
// Expose classes to window
window.bitmovin.playerui = {
    // Management
    UIManager: uimanager_1.UIManager,
    UIInstanceManager: uimanager_1.UIInstanceManager,
    // Utils
    ArrayUtils: utils_1.ArrayUtils,
    StringUtils: utils_1.StringUtils,
    PlayerUtils: utils_1.PlayerUtils,
    UIUtils: utils_1.UIUtils,
    BrowserUtils: utils_1.BrowserUtils,
    // Components
    AdClickOverlay: adclickoverlay_1.AdClickOverlay,
    AdMessageLabel: admessagelabel_1.AdMessageLabel,
    AdSkipButton: adskipbutton_1.AdSkipButton,
    AirPlayToggleButton: airplaytogglebutton_1.AirPlayToggleButton,
    AudioQualitySelectBox: audioqualityselectbox_1.AudioQualitySelectBox,
    AudioTrackSelectBox: audiotrackselectbox_1.AudioTrackSelectBox,
    BufferingOverlay: bufferingoverlay_1.BufferingOverlay,
    Button: button_1.Button,
    CastStatusOverlay: caststatusoverlay_1.CastStatusOverlay,
    CastToggleButton: casttogglebutton_1.CastToggleButton,
    CastUIContainer: castuicontainer_1.CastUIContainer,
    ClickOverlay: clickoverlay_1.ClickOverlay,
    CloseButton: closebutton_1.CloseButton,
    Component: component_1.Component,
    Container: container_1.Container,
    ControlBar: controlbar_1.ControlBar,
    ErrorMessageOverlay: errormessageoverlay_1.ErrorMessageOverlay,
    FullscreenToggleButton: fullscreentogglebutton_1.FullscreenToggleButton,
    HugePlaybackToggleButton: hugeplaybacktogglebutton_1.HugePlaybackToggleButton,
    HugeReplayButton: hugereplaybutton_1.HugeReplayButton,
    Label: label_1.Label,
    MetadataLabel: metadatalabel_1.MetadataLabel,
    MetadataLabelContent: metadatalabel_1.MetadataLabelContent,
    PictureInPictureToggleButton: pictureinpicturetogglebutton_1.PictureInPictureToggleButton,
    PlaybackSpeedSelectBox: playbackspeedselectbox_1.PlaybackSpeedSelectBox,
    PlaybackTimeLabel: playbacktimelabel_1.PlaybackTimeLabel,
    PlaybackTimeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode,
    PlaybackToggleButton: playbacktogglebutton_1.PlaybackToggleButton,
    PlaybackToggleOverlay: playbacktoggleoverlay_1.PlaybackToggleOverlay,
    RecommendationOverlay: recommendationoverlay_1.RecommendationOverlay,
    SeekBar: seekbar_1.SeekBar,
    SeekBarLabel: seekbarlabel_1.SeekBarLabel,
    SelectBox: selectbox_1.SelectBox,
    SettingsPanel: settingspanel_1.SettingsPanel,
    SettingsPanelItem: settingspanel_1.SettingsPanelItem,
    SettingsToggleButton: settingstogglebutton_1.SettingsToggleButton,
    Spacer: spacer_1.Spacer,
    SubtitleOverlay: subtitleoverlay_1.SubtitleOverlay,
    SubtitleSelectBox: subtitleselectbox_1.SubtitleSelectBox,
    TitleBar: titlebar_1.TitleBar,
    ToggleButton: togglebutton_1.ToggleButton,
    UIContainer: uicontainer_1.UIContainer,
    VideoQualitySelectBox: videoqualityselectbox_1.VideoQualitySelectBox,
    VolumeControlButton: volumecontrolbutton_1.VolumeControlButton,
    VolumeSlider: volumeslider_1.VolumeSlider,
    VolumeToggleButton: volumetogglebutton_1.VolumeToggleButton,
    VRToggleButton: vrtogglebutton_1.VRToggleButton,
    Watermark: watermark_1.Watermark,
};

},{"./components/adclickoverlay":1,"./components/admessagelabel":2,"./components/adskipbutton":3,"./components/airplaytogglebutton":4,"./components/audioqualityselectbox":5,"./components/audiotrackselectbox":6,"./components/bufferingoverlay":7,"./components/button":8,"./components/caststatusoverlay":9,"./components/casttogglebutton":10,"./components/castuicontainer":11,"./components/clickoverlay":12,"./components/closebutton":13,"./components/component":14,"./components/container":15,"./components/controlbar":16,"./components/errormessageoverlay":17,"./components/fullscreentogglebutton":18,"./components/hugeplaybacktogglebutton":19,"./components/hugereplaybutton":20,"./components/label":21,"./components/metadatalabel":23,"./components/pictureinpicturetogglebutton":24,"./components/playbackspeedselectbox":25,"./components/playbacktimelabel":26,"./components/playbacktogglebutton":27,"./components/playbacktoggleoverlay":28,"./components/recommendationoverlay":29,"./components/seekbar":30,"./components/seekbarlabel":31,"./components/selectbox":32,"./components/settingspanel":33,"./components/settingstogglebutton":34,"./components/spacer":35,"./components/subtitleoverlay":36,"./components/subtitleselectbox":37,"./components/titlebar":38,"./components/togglebutton":39,"./components/uicontainer":41,"./components/videoqualityselectbox":42,"./components/volumecontrolbutton":43,"./components/volumeslider":44,"./components/volumetogglebutton":45,"./components/vrtogglebutton":46,"./components/watermark":47,"./uimanager":53,"./utils":54}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO change to internal (not exported) class, how to use in other files?
/**
 * Executes a callback after a specified amount of time,
 * optionally repeatedly until stopped. When delay is <= 0
 * the timeout is disabled
 */
var Timeout = (function () {
    /**
     * Creates a new timeout callback handler.
     * @param delay the delay in milliseconds after which the callback should be executed
     * @param callback the callback to execute after the delay time
     * @param repeat if true, call the callback repeatedly in delay intervals
     */
    function Timeout(delay, callback, repeat) {
        if (repeat === void 0) { repeat = false; }
        this.delay = delay;
        this.callback = callback;
        this.repeat = repeat;
        this.timeoutHandle = 0;
    }
    /**
     * Starts the timeout and calls the callback when the timeout delay has passed.
     * @returns {Timeout} the current timeout (so the start call can be chained to the constructor)
     */
    Timeout.prototype.start = function () {
        this.reset();
        return this;
    };
    /**
     * Clears the timeout. The callback will not be called if clear is called during the timeout.
     */
    Timeout.prototype.clear = function () {
        clearTimeout(this.timeoutHandle);
    };
    /**
     * Resets the passed timeout delay to zero. Can be used to defer the calling of the callback.
     */
    Timeout.prototype.reset = function () {
        var _this = this;
        var lastScheduleTime = 0;
        var delayAdjust = 0;
        this.clear();
        var internalCallback = function () {
            _this.callback();
            if (_this.repeat) {
                var now = Date.now();
                // The time of one iteration from scheduling to executing the callback (usually a bit longer than the delay
                // time)
                var delta = now - lastScheduleTime;
                // Calculate the delay adjustment for the next schedule to keep a steady delay interval over time
                delayAdjust = _this.delay - delta + delayAdjust;
                lastScheduleTime = now;
                // Schedule next execution by the adjusted delay
                _this.timeoutHandle = setTimeout(internalCallback, _this.delay + delayAdjust);
            }
        };
        lastScheduleTime = Date.now();
        if (this.delay > 0) {
            this.timeoutHandle = setTimeout(internalCallback, this.delay);
        }
    };
    return Timeout;
}());
exports.Timeout = Timeout;

},{}],53:[function(require,module,exports){
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
var uicontainer_1 = require("./components/uicontainer");
var dom_1 = require("./dom");
var container_1 = require("./components/container");
var playbacktogglebutton_1 = require("./components/playbacktogglebutton");
var fullscreentogglebutton_1 = require("./components/fullscreentogglebutton");
var vrtogglebutton_1 = require("./components/vrtogglebutton");
var volumetogglebutton_1 = require("./components/volumetogglebutton");
var seekbar_1 = require("./components/seekbar");
var playbacktimelabel_1 = require("./components/playbacktimelabel");
var controlbar_1 = require("./components/controlbar");
var eventdispatcher_1 = require("./eventdispatcher");
var settingstogglebutton_1 = require("./components/settingstogglebutton");
var settingspanel_1 = require("./components/settingspanel");
var videoqualityselectbox_1 = require("./components/videoqualityselectbox");
var watermark_1 = require("./components/watermark");
var audioqualityselectbox_1 = require("./components/audioqualityselectbox");
var audiotrackselectbox_1 = require("./components/audiotrackselectbox");
var seekbarlabel_1 = require("./components/seekbarlabel");
var volumeslider_1 = require("./components/volumeslider");
var subtitleselectbox_1 = require("./components/subtitleselectbox");
var subtitleoverlay_1 = require("./components/subtitleoverlay");
var volumecontrolbutton_1 = require("./components/volumecontrolbutton");
var casttogglebutton_1 = require("./components/casttogglebutton");
var caststatusoverlay_1 = require("./components/caststatusoverlay");
var errormessageoverlay_1 = require("./components/errormessageoverlay");
var titlebar_1 = require("./components/titlebar");
var recommendationoverlay_1 = require("./components/recommendationoverlay");
var admessagelabel_1 = require("./components/admessagelabel");
var adskipbutton_1 = require("./components/adskipbutton");
var adclickoverlay_1 = require("./components/adclickoverlay");
var utils_1 = require("./utils");
var playbackspeedselectbox_1 = require("./components/playbackspeedselectbox");
var bufferingoverlay_1 = require("./components/bufferingoverlay");
var castuicontainer_1 = require("./components/castuicontainer");
var playbacktoggleoverlay_1 = require("./components/playbacktoggleoverlay");
var closebutton_1 = require("./components/closebutton");
var metadatalabel_1 = require("./components/metadatalabel");
var label_1 = require("./components/label");
var airplaytogglebutton_1 = require("./components/airplaytogglebutton");
var pictureinpicturetogglebutton_1 = require("./components/pictureinpicturetogglebutton");
var spacer_1 = require("./components/spacer");
var UIManager = (function () {
    function UIManager(player, playerUiOrUiVariants, config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        if (playerUiOrUiVariants instanceof uicontainer_1.UIContainer) {
            // Single-UI constructor has been called, transform arguments to UIVariant[] signature
            var playerUi = playerUiOrUiVariants;
            var adsUi = null;
            var uiVariants = [];
            // Add the ads UI if defined
            if (adsUi) {
                uiVariants.push({
                    ui: adsUi,
                    condition: function (context) {
                        return context.isAdWithUI;
                    },
                });
            }
            // Add the default player UI
            uiVariants.push({ ui: playerUi });
            this.uiVariants = uiVariants;
        }
        else {
            // Default constructor (UIVariant[]) has been called
            this.uiVariants = playerUiOrUiVariants;
        }
        this.player = player;
        this.config = config;
        this.managerPlayerWrapper = new PlayerWrapper(player);
        this.playerElement = new dom_1.DOM(player.getFigure());
        // Create UI instance managers for the UI variants
        // The instance managers map to the corresponding UI variants by their array index
        this.uiInstanceManagers = [];
        var uiVariantsWithoutCondition = [];
        for (var _i = 0, _a = this.uiVariants; _i < _a.length; _i++) {
            var uiVariant = _a[_i];
            if (uiVariant.condition == null) {
                // Collect variants without conditions for error checking
                uiVariantsWithoutCondition.push(uiVariant);
            }
            // Create the instance manager for a UI variant
            this.uiInstanceManagers.push(new InternalUIInstanceManager(player, uiVariant.ui, this.config));
        }
        // Make sure that there is only one UI variant without a condition
        // It does not make sense to have multiple variants without condition, because only the first one in the list
        // (the one with the lowest index) will ever be selected.
        if (uiVariantsWithoutCondition.length > 1) {
            throw Error('Too many UIs without a condition: You cannot have more than one default UI');
        }
        // Make sure that the default UI variant, if defined, is at the end of the list (last index)
        // If it comes earlier, the variants with conditions that come afterwards will never be selected because the
        // default variant without a condition always evaluates to 'true'
        if (uiVariantsWithoutCondition.length > 0
            && uiVariantsWithoutCondition[0] !== this.uiVariants[this.uiVariants.length - 1]) {
            throw Error('Invalid UI variant order: the default UI (without condition) must be at the end of the list');
        }
        var adStartedEvent = null; // keep the event stored here during ad playback
        var isMobile = utils_1.BrowserUtils.isMobile;
        // Dynamically select a UI variant that matches the current UI condition.
        var resolveUiVariant = function (event) {
            // Make sure that the ON_AD_STARTED event data is persisted through ad playback in case other events happen
            // in the meantime, e.g. player resize. We need to store this data because there is no other way to find out
            // ad details (e.g. the ad client) while an ad is playing.
            // Existing event data signals that an ad is currently active. We cannot use player.isAd() because it returns
            // true on ad start and also on ad end events, which is problematic.
            if (event != null) {
                switch (event.type) {
                    // When the ad starts, we store the event data
                    case player.EVENT.ON_AD_STARTED:
                        adStartedEvent = event;
                        break;
                    // When the ad ends, we delete the event data
                    case player.EVENT.ON_AD_FINISHED:
                    case player.EVENT.ON_AD_SKIPPED:
                    case player.EVENT.ON_AD_ERROR:
                        adStartedEvent = null;
                }
            }
            // Detect if an ad has started
            var ad = adStartedEvent != null;
            var adWithUI = ad && adStartedEvent.clientType === 'vast';
            // Determine the current context for which the UI variant will be resolved
            var context = {
                isAd: ad,
                isAdWithUI: adWithUI,
                isFullscreen: _this.player.isFullscreen(),
                isMobile: isMobile,
                width: _this.playerElement.width(),
                documentWidth: document.body.clientWidth,
            };
            var nextUi = null;
            var uiVariantChanged = false;
            // Select new UI variant
            // If no variant condition is fulfilled, we switch to *no* UI
            for (var _i = 0, _a = _this.uiVariants; _i < _a.length; _i++) {
                var uiVariant = _a[_i];
                if (uiVariant.condition == null || uiVariant.condition(context) === true) {
                    nextUi = _this.uiInstanceManagers[_this.uiVariants.indexOf(uiVariant)];
                    break;
                }
            }
            // Determine if the UI variant is changing
            if (nextUi !== _this.currentUi) {
                uiVariantChanged = true;
                // console.log('switched from ', this.currentUi ? this.currentUi.getUI() : 'none',
                //   ' to ', nextUi ? nextUi.getUI() : 'none');
            }
            // Only if the UI variant is changing, we need to do some stuff. Else we just leave everything as-is.
            if (uiVariantChanged) {
                // Hide the currently active UI variant
                if (_this.currentUi) {
                    _this.currentUi.getUI().hide();
                }
                // Assign the new UI variant as current UI
                _this.currentUi = nextUi;
                // When we switch to a different UI instance, there's some additional stuff to manage. If we do not switch
                // to an instance, we're done here.
                if (_this.currentUi != null) {
                    // Add the UI to the DOM (and configure it) the first time it is selected
                    if (!_this.currentUi.isConfigured()) {
                        _this.addUi(_this.currentUi);
                    }
                    // If this is an ad UI, we need to relay the saved ON_AD_STARTED event data so ad components can configure
                    // themselves for the current ad.
                    if (context.isAd) {
                        /* Relay the ON_AD_STARTED event to the ads UI
                         *
                         * Because the ads UI is initialized in the ON_AD_STARTED handler, i.e. when the ON_AD_STARTED event has
                         * already been fired, components in the ads UI that listen for the ON_AD_STARTED event never receive it.
                         * Since this can break functionality of components that rely on this event, we relay the event to the
                         * ads UI components with the following call.
                         */
                        _this.currentUi.getWrappedPlayer().fireEventInUI(_this.player.EVENT.ON_AD_STARTED, adStartedEvent);
                    }
                    _this.currentUi.getUI().show();
                }
            }
        };
        // Listen to the following events to trigger UI variant resolution
        this.managerPlayerWrapper.getPlayer().addEventHandler(this.player.EVENT.ON_AD_STARTED, resolveUiVariant);
        this.managerPlayerWrapper.getPlayer().addEventHandler(this.player.EVENT.ON_AD_FINISHED, resolveUiVariant);
        this.managerPlayerWrapper.getPlayer().addEventHandler(this.player.EVENT.ON_AD_SKIPPED, resolveUiVariant);
        this.managerPlayerWrapper.getPlayer().addEventHandler(this.player.EVENT.ON_AD_ERROR, resolveUiVariant);
        this.managerPlayerWrapper.getPlayer().addEventHandler(this.player.EVENT.ON_PLAYER_RESIZE, resolveUiVariant);
        this.managerPlayerWrapper.getPlayer().addEventHandler(this.player.EVENT.ON_FULLSCREEN_ENTER, resolveUiVariant);
        this.managerPlayerWrapper.getPlayer().addEventHandler(this.player.EVENT.ON_FULLSCREEN_EXIT, resolveUiVariant);
        // Initialize the UI
        resolveUiVariant(null);
    }
    UIManager.prototype.getConfig = function () {
        return this.config;
    };
    UIManager.prototype.addUi = function (ui) {
        var dom = ui.getUI().getDomElement();
        ui.configureControls();
        /* Append the UI DOM after configuration to avoid CSS transitions at initialization
         * Example: Components are hidden during configuration and these hides may trigger CSS transitions that are
         * undesirable at this time. */
        /* Append ui to parent instead of player */
        var parentElement = new dom_1.DOM(this.playerElement.getElements()[0].parentElement);
        parentElement.addClass('smashcut-custom-ui-bitmovin-player-holder');
        parentElement.append(dom);
        // Fire onConfigured after UI DOM elements are successfully added. When fired immediately, the DOM elements
        // might not be fully configured and e.g. do not have a size.
        // https://swizec.com/blog/how-to-properly-wait-for-dom-elements-to-show-up-in-modern-browsers/swizec/6663
        if (window.requestAnimationFrame) {
            requestAnimationFrame(function () {
                ui.onConfigured.dispatch(ui.getUI());
            });
        }
        else {
            // IE9 fallback
            setTimeout(function () {
                ui.onConfigured.dispatch(ui.getUI());
            }, 0);
        }
    };
    UIManager.prototype.releaseUi = function (ui) {
        ui.releaseControls();
        ui.getUI().getDomElement().remove();
        ui.clearEventHandlers();
    };
    UIManager.prototype.release = function () {
        for (var _i = 0, _a = this.uiInstanceManagers; _i < _a.length; _i++) {
            var uiInstanceManager = _a[_i];
            this.releaseUi(uiInstanceManager);
        }
        this.managerPlayerWrapper.clearEventHandlers();
    };
    return UIManager;
}());
exports.UIManager = UIManager;
(function (UIManager) {
    var Factory;
    (function (Factory) {
        function buildDefaultUI(player, config) {
            if (config === void 0) { config = {}; }
            return UIManager.Factory.buildModernUI(player, config);
        }
        Factory.buildDefaultUI = buildDefaultUI;
        function buildDefaultSmallScreenUI(player, config) {
            if (config === void 0) { config = {}; }
            return UIManager.Factory.buildModernSmallScreenUI(player, config);
        }
        Factory.buildDefaultSmallScreenUI = buildDefaultSmallScreenUI;
        function buildDefaultCastReceiverUI(player, config) {
            if (config === void 0) { config = {}; }
            return UIManager.Factory.buildModernCastReceiverUI(player, config);
        }
        Factory.buildDefaultCastReceiverUI = buildDefaultCastReceiverUI;
        function smashcutUi() {
            var settingsPanel = new settingspanel_1.SettingsPanel({
                components: [
                    new settingspanel_1.SettingsPanelItem('Video Quality', new videoqualityselectbox_1.VideoQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Speed', new playbackspeedselectbox_1.PlaybackSpeedSelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Track', new audiotrackselectbox_1.AudioTrackSelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Quality', new audioqualityselectbox_1.AudioQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Subtitles', new subtitleselectbox_1.SubtitleSelectBox())
                ],
                hidden: true
            });
            var controlBarTop = new container_1.Container({
                cssClasses: ['controlbar-top'],
                components: [
                    new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                    new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                ]
            });
            var controlBarMiddle = new container_1.Container({
                cssClasses: ['controlbar-middle'],
                components: [
                    new seekbar_1.SeekBar({ label: new seekbarlabel_1.SeekBarLabel() }),
                ]
            });
            var controlBarBottom = new container_1.Container({
                cssClasses: ['controlbar-bottom'],
                components: [
                    new spacer_1.Spacer(),
                    new volumeslider_1.VolumeSlider(),
                    new volumetogglebutton_1.VolumeToggleButton(),
                    new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                    new fullscreentogglebutton_1.FullscreenToggleButton(),
                ]
            });
            var controlBar = new controlbar_1.ControlBar({
                components: [
                    new playbacktogglebutton_1.PlaybackToggleButton(),
                    new container_1.Container({
                        cssClasses: ['controlbar-inner'],
                        components: [
                            settingsPanel,
                            controlBarTop,
                            controlBarMiddle,
                            controlBarBottom,
                        ]
                    })
                ]
            });
            return new uicontainer_1.UIContainer({
                hideDelay: 0,
                cssClasses: ['ui-skin-modern ui-skin-smashcut'],
                components: [
                    new subtitleoverlay_1.SubtitleOverlay(),
                    new bufferingoverlay_1.BufferingOverlay(),
                    /** new PlaybackToggleOverlay(), **/
                    controlBar,
                    new titlebar_1.TitleBar(),
                    new recommendationoverlay_1.RecommendationOverlay(),
                    new errormessageoverlay_1.ErrorMessageOverlay()
                ]
            });
        }
        function modernUI() {
            var settingsPanel = new settingspanel_1.SettingsPanel({
                components: [
                    new settingspanel_1.SettingsPanelItem('Video Quality', new videoqualityselectbox_1.VideoQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Speed', new playbackspeedselectbox_1.PlaybackSpeedSelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Track', new audiotrackselectbox_1.AudioTrackSelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Quality', new audioqualityselectbox_1.AudioQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Subtitles', new subtitleselectbox_1.SubtitleSelectBox())
                ],
                hidden: true
            });
            var controlBar = new controlbar_1.ControlBar({
                components: [
                    settingsPanel,
                    new container_1.Container({
                        components: [
                            new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                            new seekbar_1.SeekBar({ label: new seekbarlabel_1.SeekBarLabel() }),
                            new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                        ],
                        cssClasses: ['controlbar-top']
                    }),
                    new container_1.Container({
                        components: [
                            new playbacktogglebutton_1.PlaybackToggleButton(),
                            new volumetogglebutton_1.VolumeToggleButton(),
                            new volumeslider_1.VolumeSlider(),
                            new spacer_1.Spacer(),
                            new pictureinpicturetogglebutton_1.PictureInPictureToggleButton(),
                            new airplaytogglebutton_1.AirPlayToggleButton(),
                            new casttogglebutton_1.CastToggleButton(),
                            new vrtogglebutton_1.VRToggleButton(),
                            new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                            new fullscreentogglebutton_1.FullscreenToggleButton(),
                        ],
                        cssClasses: ['controlbar-bottom']
                    }),
                ]
            });
            return new uicontainer_1.UIContainer({
                components: [
                    new subtitleoverlay_1.SubtitleOverlay(),
                    new bufferingoverlay_1.BufferingOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                    new caststatusoverlay_1.CastStatusOverlay(),
                    controlBar,
                    new titlebar_1.TitleBar(),
                    new recommendationoverlay_1.RecommendationOverlay(),
                    new watermark_1.Watermark(),
                    new errormessageoverlay_1.ErrorMessageOverlay()
                ], cssClasses: ['ui-skin-modern']
            });
        }
        function modernAdsUI() {
            return new uicontainer_1.UIContainer({
                components: [
                    new bufferingoverlay_1.BufferingOverlay(),
                    new adclickoverlay_1.AdClickOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                    new container_1.Container({
                        components: [
                            new admessagelabel_1.AdMessageLabel({ text: 'Ad: {remainingTime} secs' }),
                            new adskipbutton_1.AdSkipButton()
                        ],
                        cssClass: 'ui-ads-status'
                    }),
                    new controlbar_1.ControlBar({
                        components: [
                            new container_1.Container({
                                components: [
                                    new playbacktogglebutton_1.PlaybackToggleButton(),
                                    new volumetogglebutton_1.VolumeToggleButton(),
                                    new volumeslider_1.VolumeSlider(),
                                    new spacer_1.Spacer(),
                                    new fullscreentogglebutton_1.FullscreenToggleButton(),
                                ],
                                cssClasses: ['controlbar-bottom']
                            }),
                        ]
                    })
                ], cssClasses: ['ui-skin-modern', 'ui-skin-ads']
            });
        }
        function modernSmallScreenUI() {
            var settingsPanel = new settingspanel_1.SettingsPanel({
                components: [
                    new settingspanel_1.SettingsPanelItem('Video Quality', new videoqualityselectbox_1.VideoQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Speed', new playbackspeedselectbox_1.PlaybackSpeedSelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Track', new audiotrackselectbox_1.AudioTrackSelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Quality', new audioqualityselectbox_1.AudioQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Subtitles', new subtitleselectbox_1.SubtitleSelectBox())
                ],
                hidden: true,
                hideDelay: -1,
            });
            settingsPanel.addComponent(new closebutton_1.CloseButton({ target: settingsPanel }));
            var controlBar = new controlbar_1.ControlBar({
                components: [
                    new container_1.Container({
                        components: [
                            new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                            new seekbar_1.SeekBar({ label: new seekbarlabel_1.SeekBarLabel() }),
                            new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                        ],
                        cssClasses: ['controlbar-top']
                    }),
                ]
            });
            return new uicontainer_1.UIContainer({
                components: [
                    new subtitleoverlay_1.SubtitleOverlay(),
                    new bufferingoverlay_1.BufferingOverlay(),
                    new caststatusoverlay_1.CastStatusOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                    controlBar,
                    new titlebar_1.TitleBar({
                        components: [
                            new metadatalabel_1.MetadataLabel({ content: metadatalabel_1.MetadataLabelContent.Title }),
                            new casttogglebutton_1.CastToggleButton(),
                            /*new VRToggleButton(),*/
                            new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                            new fullscreentogglebutton_1.FullscreenToggleButton(),
                        ]
                    }),
                    settingsPanel,
                    new recommendationoverlay_1.RecommendationOverlay(),
                    new watermark_1.Watermark(),
                    new errormessageoverlay_1.ErrorMessageOverlay()
                ], cssClasses: ['ui-skin-modern', 'ui-skin-smallscreen']
            });
        }
        function modernSmallScreenAdsUI() {
            return new uicontainer_1.UIContainer({
                components: [
                    new bufferingoverlay_1.BufferingOverlay(),
                    new adclickoverlay_1.AdClickOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                    new titlebar_1.TitleBar({
                        components: [
                            // dummy label with no content to move buttons to the right
                            new label_1.Label({ cssClass: 'label-metadata-title' }),
                            new fullscreentogglebutton_1.FullscreenToggleButton(),
                        ]
                    }),
                    new container_1.Container({
                        components: [
                            new admessagelabel_1.AdMessageLabel({ text: 'Ad: {remainingTime} secs' }),
                            new adskipbutton_1.AdSkipButton()
                        ],
                        cssClass: 'ui-ads-status'
                    }),
                ], cssClasses: ['ui-skin-modern', 'ui-skin-ads', 'ui-skin-smallscreen']
            });
        }
        function modernCastReceiverUI() {
            var controlBar = new controlbar_1.ControlBar({
                components: [
                    new container_1.Container({
                        components: [
                            new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                            new seekbar_1.SeekBar({ smoothPlaybackPositionUpdateIntervalMs: -1 }),
                            new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                        ],
                        cssClasses: ['controlbar-top']
                    }),
                ]
            });
            return new castuicontainer_1.CastUIContainer({
                components: [
                    new subtitleoverlay_1.SubtitleOverlay(),
                    new bufferingoverlay_1.BufferingOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                    new watermark_1.Watermark(),
                    controlBar,
                    new titlebar_1.TitleBar({ keepHiddenWithoutMetadata: true }),
                    new errormessageoverlay_1.ErrorMessageOverlay()
                ], cssClasses: ['ui-skin-modern', 'ui-skin-cast-receiver']
            });
        }
        function buildModernUI(player, config) {
            if (config === void 0) { config = {}; }
            // show smallScreen UI only on mobile/handheld devices
            var smallScreenSwitchWidth = 600;
            return new UIManager(player, [{
                    ui: modernSmallScreenAdsUI(),
                    condition: function (context) {
                        return context.isMobile && context.documentWidth < smallScreenSwitchWidth && context.isAdWithUI;
                    }
                }, {
                    ui: modernAdsUI(),
                    condition: function (context) {
                        return context.isAdWithUI;
                    }
                }, {
                    ui: modernSmallScreenUI(),
                    condition: function (context) {
                        return context.isMobile && context.documentWidth < smallScreenSwitchWidth;
                    }
                }, {
                    ui: smashcutUi()
                }], config);
        }
        Factory.buildModernUI = buildModernUI;
        function buildModernSmallScreenUI(player, config) {
            if (config === void 0) { config = {}; }
            return new UIManager(player, [{
                    ui: modernSmallScreenAdsUI(),
                    condition: function (context) {
                        return context.isAdWithUI;
                    }
                }, {
                    ui: modernSmallScreenUI()
                }], config);
        }
        Factory.buildModernSmallScreenUI = buildModernSmallScreenUI;
        function buildModernCastReceiverUI(player, config) {
            if (config === void 0) { config = {}; }
            return new UIManager(player, modernCastReceiverUI(), config);
        }
        Factory.buildModernCastReceiverUI = buildModernCastReceiverUI;
        function legacyUI() {
            var settingsPanel = new settingspanel_1.SettingsPanel({
                components: [
                    new settingspanel_1.SettingsPanelItem('Video Quality', new videoqualityselectbox_1.VideoQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Track', new audiotrackselectbox_1.AudioTrackSelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Quality', new audioqualityselectbox_1.AudioQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Subtitles', new subtitleselectbox_1.SubtitleSelectBox())
                ],
                hidden: true
            });
            var controlBar = new controlbar_1.ControlBar({
                components: [
                    settingsPanel,
                    new playbacktogglebutton_1.PlaybackToggleButton(),
                    new seekbar_1.SeekBar({ label: new seekbarlabel_1.SeekBarLabel() }),
                    new playbacktimelabel_1.PlaybackTimeLabel(),
                    new vrtogglebutton_1.VRToggleButton(),
                    new volumecontrolbutton_1.VolumeControlButton(),
                    new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                    new casttogglebutton_1.CastToggleButton(),
                    new fullscreentogglebutton_1.FullscreenToggleButton()
                ]
            });
            return new uicontainer_1.UIContainer({
                components: [
                    new subtitleoverlay_1.SubtitleOverlay(),
                    new caststatusoverlay_1.CastStatusOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                    new watermark_1.Watermark(),
                    new recommendationoverlay_1.RecommendationOverlay(),
                    controlBar,
                    new titlebar_1.TitleBar(),
                    new errormessageoverlay_1.ErrorMessageOverlay()
                ], cssClasses: ['ui-skin-legacy']
            });
        }
        function legacyAdsUI() {
            return new uicontainer_1.UIContainer({
                components: [
                    new adclickoverlay_1.AdClickOverlay(),
                    new controlbar_1.ControlBar({
                        components: [
                            new playbacktogglebutton_1.PlaybackToggleButton(),
                            new admessagelabel_1.AdMessageLabel(),
                            new volumecontrolbutton_1.VolumeControlButton(),
                            new fullscreentogglebutton_1.FullscreenToggleButton()
                        ]
                    }),
                    new adskipbutton_1.AdSkipButton()
                ], cssClasses: ['ui-skin-legacy', 'ui-skin-ads']
            });
        }
        function legacyCastReceiverUI() {
            var controlBar = new controlbar_1.ControlBar({
                components: [
                    new seekbar_1.SeekBar(),
                    new playbacktimelabel_1.PlaybackTimeLabel(),
                ]
            });
            return new uicontainer_1.UIContainer({
                components: [
                    new subtitleoverlay_1.SubtitleOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                    new watermark_1.Watermark(),
                    controlBar,
                    new titlebar_1.TitleBar(),
                    new errormessageoverlay_1.ErrorMessageOverlay()
                ], cssClasses: ['ui-skin-legacy', 'ui-skin-cast-receiver']
            });
        }
        function legacyTestUI() {
            var settingsPanel = new settingspanel_1.SettingsPanel({
                components: [
                    new settingspanel_1.SettingsPanelItem('Video Quality', new videoqualityselectbox_1.VideoQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Track', new audiotrackselectbox_1.AudioTrackSelectBox()),
                    new settingspanel_1.SettingsPanelItem('Audio Quality', new audioqualityselectbox_1.AudioQualitySelectBox()),
                    new settingspanel_1.SettingsPanelItem('Subtitles', new subtitleselectbox_1.SubtitleSelectBox())
                ],
                hidden: true
            });
            var controlBar = new controlbar_1.ControlBar({
                components: [settingsPanel,
                    new playbacktogglebutton_1.PlaybackToggleButton(),
                    new seekbar_1.SeekBar({ label: new seekbarlabel_1.SeekBarLabel() }),
                    new playbacktimelabel_1.PlaybackTimeLabel(),
                    new vrtogglebutton_1.VRToggleButton(),
                    new volumetogglebutton_1.VolumeToggleButton(),
                    new volumeslider_1.VolumeSlider(),
                    new volumecontrolbutton_1.VolumeControlButton(),
                    new volumecontrolbutton_1.VolumeControlButton({ vertical: false }),
                    new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                    new casttogglebutton_1.CastToggleButton(),
                    new fullscreentogglebutton_1.FullscreenToggleButton()
                ]
            });
            return new uicontainer_1.UIContainer({
                components: [
                    new subtitleoverlay_1.SubtitleOverlay(),
                    new caststatusoverlay_1.CastStatusOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
                    new watermark_1.Watermark(),
                    new recommendationoverlay_1.RecommendationOverlay(),
                    controlBar,
                    new titlebar_1.TitleBar(),
                    new errormessageoverlay_1.ErrorMessageOverlay()
                ], cssClasses: ['ui-skin-legacy']
            });
        }
        function buildLegacyUI(player, config) {
            if (config === void 0) { config = {}; }
            return new UIManager(player, [{
                    ui: legacyAdsUI(),
                    condition: function (context) {
                        return context.isAdWithUI;
                    }
                }, {
                    ui: legacyUI()
                }], config);
        }
        Factory.buildLegacyUI = buildLegacyUI;
        function buildLegacyCastReceiverUI(player, config) {
            if (config === void 0) { config = {}; }
            return new UIManager(player, legacyCastReceiverUI(), config);
        }
        Factory.buildLegacyCastReceiverUI = buildLegacyCastReceiverUI;
        function buildLegacyTestUI(player, config) {
            if (config === void 0) { config = {}; }
            return new UIManager(player, legacyTestUI(), config);
        }
        Factory.buildLegacyTestUI = buildLegacyTestUI;
    })(Factory = UIManager.Factory || (UIManager.Factory = {}));
})(UIManager = exports.UIManager || (exports.UIManager = {}));
exports.UIManager = UIManager;
/**
 * Encapsulates functionality to manage a UI instance. Used by the {@link UIManager} to manage multiple UI instances.
 */
var UIInstanceManager = (function () {
    function UIInstanceManager(player, ui, config) {
        if (config === void 0) { config = {}; }
        this.events = {
            onConfigured: new eventdispatcher_1.EventDispatcher(),
            onSeek: new eventdispatcher_1.EventDispatcher(),
            onSeekPreview: new eventdispatcher_1.EventDispatcher(),
            onSeeked: new eventdispatcher_1.EventDispatcher(),
            onComponentShow: new eventdispatcher_1.EventDispatcher(),
            onComponentHide: new eventdispatcher_1.EventDispatcher(),
            onControlsShow: new eventdispatcher_1.EventDispatcher(),
            onPreviewControlsHide: new eventdispatcher_1.EventDispatcher(),
            onControlsHide: new eventdispatcher_1.EventDispatcher(),
        };
        this.playerWrapper = new PlayerWrapper(player);
        this.ui = ui;
        this.config = config;
    }
    UIInstanceManager.prototype.getConfig = function () {
        return this.config;
    };
    UIInstanceManager.prototype.getUI = function () {
        return this.ui;
    };
    UIInstanceManager.prototype.getPlayer = function () {
        return this.playerWrapper.getPlayer();
    };
    Object.defineProperty(UIInstanceManager.prototype, "onConfigured", {
        /**
         * Fires when the UI is fully configured and added to the DOM.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onConfigured;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onSeek", {
        /**
         * Fires when a seek starts.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onSeek;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onSeekPreview", {
        /**
         * Fires when the seek timeline is scrubbed.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onSeekPreview;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onSeeked", {
        /**
         * Fires when a seek is finished.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onSeeked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onComponentShow", {
        /**
         * Fires when a component is showing.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onComponentShow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onComponentHide", {
        /**
         * Fires when a component is hiding.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onComponentHide;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onControlsShow", {
        /**
         * Fires when the UI controls are showing.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onControlsShow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onPreviewControlsHide", {
        /**
         * Fires before the UI controls are hiding to check if they are allowed to hide.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onPreviewControlsHide;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UIInstanceManager.prototype, "onControlsHide", {
        /**
         * Fires when the UI controls are hiding.
         * @returns {EventDispatcher}
         */
        get: function () {
            return this.events.onControlsHide;
        },
        enumerable: true,
        configurable: true
    });
    UIInstanceManager.prototype.clearEventHandlers = function () {
        this.playerWrapper.clearEventHandlers();
        var events = this.events; // avoid TS7017
        for (var event_1 in events) {
            var dispatcher = events[event_1];
            dispatcher.unsubscribeAll();
        }
    };
    return UIInstanceManager;
}());
exports.UIInstanceManager = UIInstanceManager;
/**
 * Extends the {@link UIInstanceManager} for internal use in the {@link UIManager} and provides access to functionality
 * that components receiving a reference to the {@link UIInstanceManager} should not have access to.
 */
var InternalUIInstanceManager = (function (_super) {
    __extends(InternalUIInstanceManager, _super);
    function InternalUIInstanceManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InternalUIInstanceManager.prototype.getWrappedPlayer = function () {
        // TODO find a non-hacky way to provide the WrappedPlayer to the UIManager without exporting it
        // getPlayer() actually returns the WrappedPlayer but its return type is set to Player so the WrappedPlayer does
        // not need to be exported
        return this.getPlayer();
    };
    InternalUIInstanceManager.prototype.configureControls = function () {
        this.configureControlsTree(this.getUI());
        this.configured = true;
    };
    InternalUIInstanceManager.prototype.isConfigured = function () {
        return this.configured;
    };
    InternalUIInstanceManager.prototype.configureControlsTree = function (component) {
        var _this = this;
        var configuredComponents = [];
        utils_1.UIUtils.traverseTree(component, function (component) {
            // First, check if we have already configured a component, and throw an error if we did. Multiple configuration
            // of the same component leads to unexpected UI behavior. Also, a component that is in the UI tree multiple
            // times hints at a wrong UI structure.
            // We could just skip configuration in such a case and not throw an exception, but enforcing a clean UI tree
            // seems like the better choice.
            for (var _i = 0, configuredComponents_1 = configuredComponents; _i < configuredComponents_1.length; _i++) {
                var configuredComponent = configuredComponents_1[_i];
                if (configuredComponent === component) {
                    // Write the component to the console to simplify identification of the culprit
                    // (e.g. by inspecting the config)
                    if (console) {
                        console.error('Circular reference in UI tree', component);
                    }
                    // Additionally throw an error, because this case must not happen and leads to unexpected UI behavior.
                    throw Error('Circular reference in UI tree: ' + component.constructor.name);
                }
            }
            component.initialize();
            component.configure(_this.getPlayer(), _this);
            configuredComponents.push(component);
        });
    };
    InternalUIInstanceManager.prototype.releaseControls = function () {
        // Do not call release methods if the components have never been configured; this can result in exceptions
        if (this.configured) {
            this.releaseControlsTree(this.getUI());
            this.configured = false;
        }
        this.released = true;
    };
    InternalUIInstanceManager.prototype.isReleased = function () {
        return this.released;
    };
    InternalUIInstanceManager.prototype.releaseControlsTree = function (component) {
        component.release();
        if (component instanceof container_1.Container) {
            for (var _i = 0, _a = component.getComponents(); _i < _a.length; _i++) {
                var childComponent = _a[_i];
                this.releaseControlsTree(childComponent);
            }
        }
    };
    InternalUIInstanceManager.prototype.clearEventHandlers = function () {
        _super.prototype.clearEventHandlers.call(this);
    };
    return InternalUIInstanceManager;
}(UIInstanceManager));
/**
 * Wraps the player to track event handlers and provide a simple method to remove all registered event
 * handlers from the player.
 */
var PlayerWrapper = (function () {
    function PlayerWrapper(player) {
        var _this = this;
        this.eventHandlers = {};
        this.player = player;
        // Collect all public API methods of the player
        var methods = [];
        for (var member in player) {
            if (typeof player[member] === 'function') {
                methods.push(member);
            }
        }
        // Create wrapper object and add function wrappers for all API methods that do nothing but calling the base method
        // on the player
        var wrapper = {};
        var _loop_1 = function (member) {
            wrapper[member] = function () {
                // console.log('called ' + member); // track method calls on the player
                return player[member].apply(player, arguments);
            };
        };
        for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
            var member = methods_1[_i];
            _loop_1(member);
        }
        // Collect all public properties of the player and add it to the wrapper
        for (var member in player) {
            if (typeof player[member] !== 'function') {
                wrapper[member] = player[member];
            }
        }
        // Explicitly add a wrapper method for 'addEventHandler' that adds added event handlers to the event list
        wrapper.addEventHandler = function (eventType, callback) {
            player.addEventHandler(eventType, callback);
            if (!_this.eventHandlers[eventType]) {
                _this.eventHandlers[eventType] = [];
            }
            _this.eventHandlers[eventType].push(callback);
            return wrapper;
        };
        // Explicitly add a wrapper method for 'removeEventHandler' that removes removed event handlers from the event list
        wrapper.removeEventHandler = function (eventType, callback) {
            player.removeEventHandler(eventType, callback);
            if (_this.eventHandlers[eventType]) {
                utils_1.ArrayUtils.remove(_this.eventHandlers[eventType], callback);
            }
            return wrapper;
        };
        wrapper.fireEventInUI = function (event, data) {
            if (_this.eventHandlers[event]) {
                // Extend the data object with default values to convert it to a {@link PlayerEvent} object.
                var playerEventData = Object.assign({}, {
                    timestamp: Date.now(),
                    type: event,
                    // Add a marker property so the UI can detect UI-internal player events
                    uiSourced: true,
                }, data);
                // Execute the registered callbacks
                for (var _i = 0, _a = _this.eventHandlers[event]; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback(playerEventData);
                }
            }
        };
        this.wrapper = wrapper;
    }
    /**
     * Returns a wrapped player object that can be used on place of the normal player object.
     * @returns {WrappedPlayer} a wrapped player
     */
    PlayerWrapper.prototype.getPlayer = function () {
        return this.wrapper;
    };
    /**
     * Clears all registered event handlers from the player that were added through the wrapped player.
     */
    PlayerWrapper.prototype.clearEventHandlers = function () {
        for (var eventType in this.eventHandlers) {
            for (var _i = 0, _a = this.eventHandlers[eventType]; _i < _a.length; _i++) {
                var callback = _a[_i];
                this.player.removeEventHandler(eventType, callback);
            }
        }
    };
    return PlayerWrapper;
}());

},{"./components/adclickoverlay":1,"./components/admessagelabel":2,"./components/adskipbutton":3,"./components/airplaytogglebutton":4,"./components/audioqualityselectbox":5,"./components/audiotrackselectbox":6,"./components/bufferingoverlay":7,"./components/caststatusoverlay":9,"./components/casttogglebutton":10,"./components/castuicontainer":11,"./components/closebutton":13,"./components/container":15,"./components/controlbar":16,"./components/errormessageoverlay":17,"./components/fullscreentogglebutton":18,"./components/label":21,"./components/metadatalabel":23,"./components/pictureinpicturetogglebutton":24,"./components/playbackspeedselectbox":25,"./components/playbacktimelabel":26,"./components/playbacktogglebutton":27,"./components/playbacktoggleoverlay":28,"./components/recommendationoverlay":29,"./components/seekbar":30,"./components/seekbarlabel":31,"./components/settingspanel":33,"./components/settingstogglebutton":34,"./components/spacer":35,"./components/subtitleoverlay":36,"./components/subtitleselectbox":37,"./components/titlebar":38,"./components/uicontainer":41,"./components/videoqualityselectbox":42,"./components/volumecontrolbutton":43,"./components/volumeslider":44,"./components/volumetogglebutton":45,"./components/vrtogglebutton":46,"./components/watermark":47,"./dom":48,"./eventdispatcher":49,"./utils":54}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eventdispatcher_1 = require("./eventdispatcher");
var container_1 = require("./components/container");
var ArrayUtils;
(function (ArrayUtils) {
    /**
     * Removes an item from an array.
     * @param array the array that may contain the item to remove
     * @param item the item to remove from the array
     * @returns {any} the removed item or null if it wasn't part of the array
     */
    function remove(array, item) {
        var index = array.indexOf(item);
        if (index > -1) {
            return array.splice(index, 1)[0];
        }
        else {
            return null;
        }
    }
    ArrayUtils.remove = remove;
})(ArrayUtils = exports.ArrayUtils || (exports.ArrayUtils = {}));
var StringUtils;
(function (StringUtils) {
    StringUtils.FORMAT_HHMMSS = 'hh:mm:ss';
    StringUtils.FORMAT_MMSS = 'mm:ss';
    /**
     * Formats a number of seconds into a time string with the pattern hh:mm:ss.
     *
     * @param totalSeconds the total number of seconds to format to string
     * @param format the time format to output (default: hh:mm:ss)
     * @returns {string} the formatted time string
     */
    function secondsToTime(totalSeconds, format) {
        if (format === void 0) { format = StringUtils.FORMAT_HHMMSS; }
        var isNegative = totalSeconds < 0;
        if (isNegative) {
            // If the time is negative, we make it positive for the calculation below
            // (else we'd get all negative numbers) and reattach the negative sign later.
            totalSeconds = -totalSeconds;
        }
        // Split into separate time parts
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor(totalSeconds / 60) - hours * 60;
        var seconds = Math.floor(totalSeconds) % 60;
        return (isNegative ? '-' : '') + format
            .replace('hh', leftPadWithZeros(hours, 2))
            .replace('mm', leftPadWithZeros(minutes, 2))
            .replace('ss', leftPadWithZeros(seconds, 2));
    }
    StringUtils.secondsToTime = secondsToTime;
    /**
     * Converts a number to a string and left-pads it with zeros to the specified length.
     * Example: leftPadWithZeros(123, 5) => '00123'
     *
     * @param num the number to convert to string and pad with zeros
     * @param length the desired length of the padded string
     * @returns {string} the padded number as string
     */
    function leftPadWithZeros(num, length) {
        var text = num + '';
        var padding = '0000000000'.substr(0, length - text.length);
        return padding + text;
    }
    /**
     * Fills out placeholders in an ad message.
     *
     * Has the placeholders '{remainingTime[formatString]}', '{playedTime[formatString]}' and
     * '{adDuration[formatString]}', which are replaced by the remaining time until the ad can be skipped, the current
     * time or the ad duration. The format string is optional. If not specified, the placeholder is replaced by the time
     * in seconds. If specified, it must be of the following format:
     * - %d - Inserts the time as an integer.
     * - %0Nd - Inserts the time as an integer with leading zeroes, if the length of the time string is smaller than N.
     * - %f - Inserts the time as a float.
     * - %0Nf - Inserts the time as a float with leading zeroes.
     * - %.Mf - Inserts the time as a float with M decimal places. Can be combined with %0Nf, e.g. %04.2f (the time
     * 10.123
     * would be printed as 0010.12).
     * - %hh:mm:ss
     * - %mm:ss
     *
     * @param adMessage an ad message with optional placeholders to fill
     * @param skipOffset if specified, {remainingTime} will be filled with the remaining time until the ad can be skipped
     * @param player the player to get the time data from
     * @returns {string} the ad message with filled placeholders
     */
    function replaceAdMessagePlaceholders(adMessage, skipOffset, player) {
        var adMessagePlaceholderRegex = new RegExp('\\{(remainingTime|playedTime|adDuration)(}|%((0[1-9]\\d*(\\.\\d+(d|f)|d|f)|\\.\\d+f|d|f)|hh:mm:ss|mm:ss)})', 'g');
        return adMessage.replace(adMessagePlaceholderRegex, function (formatString) {
            var time = 0;
            if (formatString.indexOf('remainingTime') > -1) {
                if (skipOffset) {
                    time = Math.ceil(skipOffset - player.getCurrentTime());
                }
                else {
                    time = player.getDuration() - player.getCurrentTime();
                }
            }
            else if (formatString.indexOf('playedTime') > -1) {
                time = player.getCurrentTime();
            }
            else if (formatString.indexOf('adDuration') > -1) {
                time = player.getDuration();
            }
            return formatNumber(time, formatString);
        });
    }
    StringUtils.replaceAdMessagePlaceholders = replaceAdMessagePlaceholders;
    function formatNumber(time, format) {
        var formatStringValidationRegex = /%((0[1-9]\d*(\.\d+(d|f)|d|f)|\.\d+f|d|f)|hh:mm:ss|mm:ss)/;
        var leadingZeroesRegex = /(%0[1-9]\d*)(?=(\.\d+f|f|d))/;
        var decimalPlacesRegex = /\.\d*(?=f)/;
        if (!formatStringValidationRegex.test(format)) {
            // If the format is invalid, we set a default fallback format
            format = '%d';
        }
        // Determine the number of leading zeros
        var leadingZeroes = 0;
        var leadingZeroesMatches = format.match(leadingZeroesRegex);
        if (leadingZeroesMatches) {
            leadingZeroes = parseInt(leadingZeroesMatches[0].substring(2));
        }
        // Determine the number of decimal places
        var numDecimalPlaces = null;
        var decimalPlacesMatches = format.match(decimalPlacesRegex);
        if (decimalPlacesMatches && !isNaN(parseInt(decimalPlacesMatches[0].substring(1)))) {
            numDecimalPlaces = parseInt(decimalPlacesMatches[0].substring(1));
            if (numDecimalPlaces > 20) {
                numDecimalPlaces = 20;
            }
        }
        // Float format
        if (format.indexOf('f') > -1) {
            var timeString = '';
            if (numDecimalPlaces !== null) {
                // Apply fixed number of decimal places
                timeString = time.toFixed(numDecimalPlaces);
            }
            else {
                timeString = '' + time;
            }
            // Apply leading zeros
            if (timeString.indexOf('.') > -1) {
                return leftPadWithZeros(timeString, timeString.length + (leadingZeroes - timeString.indexOf('.')));
            }
            else {
                return leftPadWithZeros(timeString, leadingZeroes);
            }
        }
        else if (format.indexOf(':') > -1) {
            var totalSeconds = Math.ceil(time);
            // hh:mm:ss format
            if (format.indexOf('hh') > -1) {
                return secondsToTime(totalSeconds);
            }
            else {
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = totalSeconds % 60;
                return leftPadWithZeros(minutes, 2) + ':' + leftPadWithZeros(seconds, 2);
            }
        }
        else {
            return leftPadWithZeros(Math.ceil(time), leadingZeroes);
        }
    }
})(StringUtils = exports.StringUtils || (exports.StringUtils = {}));
var PlayerUtils;
(function (PlayerUtils) {
    var PlayerState;
    (function (PlayerState) {
        PlayerState[PlayerState["IDLE"] = 0] = "IDLE";
        PlayerState[PlayerState["PREPARED"] = 1] = "PREPARED";
        PlayerState[PlayerState["PLAYING"] = 2] = "PLAYING";
        PlayerState[PlayerState["PAUSED"] = 3] = "PAUSED";
        PlayerState[PlayerState["FINISHED"] = 4] = "FINISHED";
    })(PlayerState = PlayerUtils.PlayerState || (PlayerUtils.PlayerState = {}));
    function isSourceLoaded(player) {
        return player.getConfig().source !== undefined;
    }
    PlayerUtils.isSourceLoaded = isSourceLoaded;
    function isTimeShiftAvailable(player) {
        return player.isLive() && player.getMaxTimeShift() !== 0;
    }
    PlayerUtils.isTimeShiftAvailable = isTimeShiftAvailable;
    function getState(player) {
        if (player.hasEnded()) {
            return PlayerState.FINISHED;
        }
        else if (player.isPlaying()) {
            return PlayerState.PLAYING;
        }
        else if (player.isPaused()) {
            return PlayerState.PAUSED;
        }
        else if (isSourceLoaded(player)) {
            return PlayerState.PREPARED;
        }
        else {
            return PlayerState.IDLE;
        }
    }
    PlayerUtils.getState = getState;
    var TimeShiftAvailabilityDetector = (function () {
        function TimeShiftAvailabilityDetector(player) {
            var _this = this;
            this.timeShiftAvailabilityChangedEvent = new eventdispatcher_1.EventDispatcher();
            var timeShiftAvailable = undefined;
            var timeShiftDetector = function () {
                if (player.isLive()) {
                    var timeShiftAvailableNow = PlayerUtils.isTimeShiftAvailable(player);
                    // When the availability changes, we fire the event
                    if (timeShiftAvailableNow !== timeShiftAvailable) {
                        _this.timeShiftAvailabilityChangedEvent.dispatch(player, { timeShiftAvailable: timeShiftAvailableNow });
                        timeShiftAvailable = timeShiftAvailableNow;
                    }
                }
            };
            // Try to detect timeshift availability in ON_READY, which works for DASH streams
            player.addEventHandler(player.EVENT.ON_READY, timeShiftDetector);
            // With HLS/NativePlayer streams, getMaxTimeShift can be 0 before the buffer fills, so we need to additionally
            // check timeshift availability in ON_TIME_CHANGED
            player.addEventHandler(player.EVENT.ON_TIME_CHANGED, timeShiftDetector);
        }
        Object.defineProperty(TimeShiftAvailabilityDetector.prototype, "onTimeShiftAvailabilityChanged", {
            get: function () {
                return this.timeShiftAvailabilityChangedEvent.getEvent();
            },
            enumerable: true,
            configurable: true
        });
        return TimeShiftAvailabilityDetector;
    }());
    PlayerUtils.TimeShiftAvailabilityDetector = TimeShiftAvailabilityDetector;
    /**
     * Detects changes of the stream type, i.e. changes of the return value of the player#isLive method.
     * Normally, a stream cannot change its type during playback, it's either VOD or live. Due to bugs on some
     * platforms or browsers, it can still change. It is therefore unreliable to just check #isLive and this detector
     * should be used as a workaround instead.
     *
     * Known cases:
     *
     * - HLS VOD on Android 4.3
     * Video duration is initially 'Infinity' and only gets available after playback starts, so streams are wrongly
     * reported as 'live' before playback (the live-check in the player checks for infinite duration).
     */
    var LiveStreamDetector = (function () {
        function LiveStreamDetector(player) {
            var _this = this;
            this.liveChangedEvent = new eventdispatcher_1.EventDispatcher();
            var live = undefined;
            var liveDetector = function () {
                var liveNow = player.isLive();
                // Compare current to previous live state flag and fire event when it changes. Since we initialize the flag
                // with undefined, there is always at least an initial event fired that tells listeners the live state.
                if (liveNow !== live) {
                    _this.liveChangedEvent.dispatch(player, { live: liveNow });
                    live = liveNow;
                }
            };
            // Initialize when player is ready
            player.addEventHandler(player.EVENT.ON_READY, liveDetector);
            // Re-evaluate when playback starts
            player.addEventHandler(player.EVENT.ON_PLAY, liveDetector);
            // HLS live detection workaround for Android:
            // Also re-evaluate during playback, because that is when the live flag might change.
            // (Doing it only in Android Chrome saves unnecessary overhead on other plattforms)
            if (BrowserUtils.isAndroid && BrowserUtils.isChrome) {
                player.addEventHandler(player.EVENT.ON_TIME_CHANGED, liveDetector);
            }
        }
        Object.defineProperty(LiveStreamDetector.prototype, "onLiveChanged", {
            get: function () {
                return this.liveChangedEvent.getEvent();
            },
            enumerable: true,
            configurable: true
        });
        return LiveStreamDetector;
    }());
    PlayerUtils.LiveStreamDetector = LiveStreamDetector;
})(PlayerUtils = exports.PlayerUtils || (exports.PlayerUtils = {}));
var UIUtils;
(function (UIUtils) {
    function traverseTree(component, visit) {
        var recursiveTreeWalker = function (component, parent) {
            visit(component, parent);
            // If the current component is a container, visit it's children
            if (component instanceof container_1.Container) {
                for (var _i = 0, _a = component.getComponents(); _i < _a.length; _i++) {
                    var childComponent = _a[_i];
                    recursiveTreeWalker(childComponent, component);
                }
            }
        };
        // Walk and configure the component tree
        recursiveTreeWalker(component);
    }
    UIUtils.traverseTree = traverseTree;
})(UIUtils = exports.UIUtils || (exports.UIUtils = {}));
var BrowserUtils;
(function (BrowserUtils) {
    // isMobile only needs to be evaluated once (it cannot change during a browser session)
    // Mobile detection according to Mozilla recommendation: "In summary, we recommend looking for the string “Mobi”
    // anywhere in the User Agent to detect a mobile device."
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
    BrowserUtils.isMobile = navigator && navigator.userAgent && /Mobi/.test(navigator.userAgent);
    BrowserUtils.isChrome = navigator && navigator.userAgent && /Chrome/.test(navigator.userAgent);
    BrowserUtils.isAndroid = navigator && navigator.userAgent && /Android/.test(navigator.userAgent);
})(BrowserUtils = exports.BrowserUtils || (exports.BrowserUtils = {}));

},{"./components/container":15,"./eventdispatcher":49}]},{},[51])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvY29tcG9uZW50cy9hZGNsaWNrb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL2FkbWVzc2FnZWxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYWRza2lwYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYWlycGxheXRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2F1ZGlvcXVhbGl0eXNlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL2F1ZGlvdHJhY2tzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9idWZmZXJpbmdvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2FzdHN0YXR1c292ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jYXN0dG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2FzdHVpY29udGFpbmVyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2xpY2tvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2xvc2VidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9jb21wb25lbnQudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jb250YWluZXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jb250cm9sYmFyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvZXJyb3JtZXNzYWdlb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL2Z1bGxzY3JlZW50b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9odWdlcGxheWJhY2t0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9odWdlcmVwbGF5YnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvbGFiZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9saXN0c2VsZWN0b3IudHMiLCJzcmMvdHMvY29tcG9uZW50cy9tZXRhZGF0YWxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcGljdHVyZWlucGljdHVyZXRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL3BsYXliYWNrc3BlZWRzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9wbGF5YmFja3RpbWVsYWJlbC50cyIsInNyYy90cy9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcGxheWJhY2t0b2dnbGVvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcmVjb21tZW5kYXRpb25vdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc2Vla2Jhci50cyIsInNyYy90cy9jb21wb25lbnRzL3NlZWtiYXJsYWJlbC50cyIsInNyYy90cy9jb21wb25lbnRzL3NlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL3NldHRpbmdzcGFuZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9zZXR0aW5nc3RvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL3NwYWNlci50cyIsInNyYy90cy9jb21wb25lbnRzL3N1YnRpdGxlb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL3N1YnRpdGxlc2VsZWN0Ym94LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdGl0bGViYXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy90b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy90dm5vaXNlY2FudmFzLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdWljb250YWluZXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy92aWRlb3F1YWxpdHlzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy92b2x1bWVjb250cm9sYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdm9sdW1lc2xpZGVyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdm9sdW1ldG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdnJ0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy93YXRlcm1hcmsudHMiLCJzcmMvdHMvZG9tLnRzIiwic3JjL3RzL2V2ZW50ZGlzcGF0Y2hlci50cyIsInNyYy90cy9ndWlkLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvdGltZW91dC50cyIsInNyYy90cy91aW1hbmFnZXIudHMiLCJzcmMvdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7QUNBQSwrQ0FBNEM7QUFHNUM7O0dBRUc7QUFDSDtJQUFvQyxrQ0FBWTtJQUFoRDs7SUF1Q0EsQ0FBQztJQXJDQyxrQ0FBUyxHQUFULFVBQVUsTUFBOEIsRUFBRSxTQUE0QjtRQUF0RSxpQkFvQ0M7UUFuQ0MsaUJBQU0sU0FBUyxZQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVuQyxJQUFJLGVBQWUsR0FBVyxJQUFJLENBQUM7UUFDbkMsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXO2VBQ3BELENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUM7ZUFDckUsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQztRQUV4RCxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFVBQUMsS0FBcUM7WUFDdkYsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFFeEMsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixLQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQy9CLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTix3RUFBd0U7Z0JBQ3hFLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxD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NUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtDbGlja092ZXJsYXl9IGZyb20gJy4vY2xpY2tvdmVybGF5JztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBzaW1wbGUgY2xpY2sgY2FwdHVyZSBvdmVybGF5IGZvciBjbGlja1Rocm91Z2hVcmxzIG9mIGFkcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFkQ2xpY2tPdmVybGF5IGV4dGVuZHMgQ2xpY2tPdmVybGF5IHtcblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjbGlja1Rocm91Z2hVcmwgPSA8c3RyaW5nPm51bGw7XG4gICAgbGV0IGNsaWNrVGhyb3VnaEVuYWJsZWQgPSAhcGxheWVyLmdldENvbmZpZygpLmFkdmVydGlzaW5nXG4gICAgICB8fCAhcGxheWVyLmdldENvbmZpZygpLmFkdmVydGlzaW5nLmhhc093blByb3BlcnR5KCdjbGlja1Rocm91Z2hFbmFibGVkJylcbiAgICAgIHx8IHBsYXllci5nZXRDb25maWcoKS5hZHZlcnRpc2luZy5jbGlja1Rocm91Z2hFbmFibGVkO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfU1RBUlRFRCwgKGV2ZW50OiBiaXRtb3Zpbi5wbGF5ZXIuQWRTdGFydGVkRXZlbnQpID0+IHtcbiAgICAgIGNsaWNrVGhyb3VnaFVybCA9IGV2ZW50LmNsaWNrVGhyb3VnaFVybDtcblxuICAgICAgaWYgKGNsaWNrVGhyb3VnaEVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5zZXRVcmwoY2xpY2tUaHJvdWdoVXJsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIGNsaWNrLXRocm91Z2ggaXMgZGlzYWJsZWQsIHdlIHNldCB0aGUgdXJsIHRvIG51bGwgdG8gYXZvaWQgaXQgb3BlblxuICAgICAgICB0aGlzLnNldFVybChudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENsZWFyIGNsaWNrLXRocm91Z2ggVVJMIHdoZW4gYWQgaGFzIGZpbmlzaGVkXG4gICAgbGV0IGFkRmluaXNoZWRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRVcmwobnVsbCk7XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgYWRGaW5pc2hlZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX1NLSVBQRUQsIGFkRmluaXNoZWRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9FUlJPUiwgYWRGaW5pc2hlZEhhbmRsZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBQYXVzZSB0aGUgYWQgd2hlbiBvdmVybGF5IGlzIGNsaWNrZWRcbiAgICAgIHBsYXllci5wYXVzZSgndWktY29udGVudC1jbGljaycpO1xuXG4gICAgICAvLyBOb3RpZnkgdGhlIHBsYXllciBvZiB0aGUgY2xpY2tlZCBhZFxuICAgICAgcGxheWVyLmZpcmVFdmVudChwbGF5ZXIuRVZFTlQuT05fQURfQ0xJQ0tFRCwge1xuICAgICAgICBjbGlja1Rocm91Z2hVcmw6IGNsaWNrVGhyb3VnaFVybFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtTdHJpbmdVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIEEgbGFiZWwgdGhhdCBkaXNwbGF5cyBhIG1lc3NhZ2UgYWJvdXQgYSBydW5uaW5nIGFkLCBvcHRpb25hbGx5IHdpdGggYSBjb3VudGRvd24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBZE1lc3NhZ2VMYWJlbCBleHRlbmRzIExhYmVsPExhYmVsQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktbGFiZWwtYWQtbWVzc2FnZScsXG4gICAgICB0ZXh0OiAnVGhpcyBhZCB3aWxsIGVuZCBpbiB7cmVtYWluaW5nVGltZX0gc2Vjb25kcy4nXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgdGV4dCA9IHRoaXMuZ2V0Q29uZmlnKCkudGV4dDtcblxuICAgIGxldCB1cGRhdGVNZXNzYWdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0VGV4dChTdHJpbmdVdGlscy5yZXBsYWNlQWRNZXNzYWdlUGxhY2Vob2xkZXJzKHRleHQsIG51bGwsIHBsYXllcikpO1xuICAgIH07XG5cbiAgICBsZXQgYWRTdGFydEhhbmRsZXIgPSAoZXZlbnQ6IGJpdG1vdmluLnBsYXllci5BZFN0YXJ0ZWRFdmVudCkgPT4ge1xuICAgICAgdGV4dCA9IGV2ZW50LmFkTWVzc2FnZSB8fCB0ZXh0O1xuICAgICAgdXBkYXRlTWVzc2FnZUhhbmRsZXIoKTtcblxuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCB1cGRhdGVNZXNzYWdlSGFuZGxlcik7XG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgdXBkYXRlTWVzc2FnZUhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBsZXQgYWRFbmRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgcGxheWVyLnJlbW92ZUV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCB1cGRhdGVNZXNzYWdlSGFuZGxlcik7XG4gICAgICBwbGF5ZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgdXBkYXRlTWVzc2FnZUhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVELCBhZFN0YXJ0SGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfU0tJUFBFRCwgYWRFbmRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9FUlJPUiwgYWRFbmRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgYWRFbmRIYW5kbGVyKTtcbiAgfVxufSIsImltcG9ydCB7QnV0dG9uQ29uZmlnLCBCdXR0b259IGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgU2tpcE1lc3NhZ2UgPSBiaXRtb3Zpbi5wbGF5ZXIuU2tpcE1lc3NhZ2U7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQWRTa2lwQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZFNraXBCdXR0b25Db25maWcgZXh0ZW5kcyBCdXR0b25Db25maWcge1xuICBza2lwTWVzc2FnZT86IFNraXBNZXNzYWdlO1xufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgaXMgZGlzcGxheWVkIGR1cmluZyBhZHMgYW5kIGNhbiBiZSB1c2VkIHRvIHNraXAgdGhlIGFkLlxuICovXG5leHBvcnQgY2xhc3MgQWRTa2lwQnV0dG9uIGV4dGVuZHMgQnV0dG9uPEFkU2tpcEJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQWRTa2lwQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywgPEFkU2tpcEJ1dHRvbkNvbmZpZz57XG4gICAgICBjc3NDbGFzczogJ3VpLWJ1dHRvbi1hZC1za2lwJyxcbiAgICAgIHNraXBNZXNzYWdlOiB7XG4gICAgICAgIGNvdW50ZG93bjogJ1NraXAgYWQgaW4ge3JlbWFpbmluZ1RpbWV9JyxcbiAgICAgICAgc2tpcDogJ1NraXAgYWQnXG4gICAgICB9XG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPEFkU2tpcEJ1dHRvbkNvbmZpZz50aGlzLmdldENvbmZpZygpOyAvLyBUT0RPIGdldCByaWQgb2YgZ2VuZXJpYyBjYXN0XG4gICAgbGV0IHNraXBNZXNzYWdlID0gY29uZmlnLnNraXBNZXNzYWdlO1xuICAgIGxldCBhZEV2ZW50ID0gPGJpdG1vdmluLnBsYXllci5BZFN0YXJ0ZWRFdmVudD5udWxsO1xuXG4gICAgbGV0IHVwZGF0ZVNraXBNZXNzYWdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIC8vIERpc3BsYXkgdGhpcyBidXR0b24gb25seSBpZiBhZCBpcyBza2lwcGFibGVcbiAgICAgIGlmIChhZEV2ZW50LnNraXBPZmZzZXQpIHtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVXBkYXRlIHRoZSBza2lwIG1lc3NhZ2Ugb24gdGhlIGJ1dHRvblxuICAgICAgaWYgKHBsYXllci5nZXRDdXJyZW50VGltZSgpIDwgYWRFdmVudC5za2lwT2Zmc2V0KSB7XG4gICAgICAgIHRoaXMuc2V0VGV4dChcbiAgICAgICAgICBTdHJpbmdVdGlscy5yZXBsYWNlQWRNZXNzYWdlUGxhY2Vob2xkZXJzKGNvbmZpZy5za2lwTWVzc2FnZS5jb3VudGRvd24sIGFkRXZlbnQuc2tpcE9mZnNldCwgcGxheWVyKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFRleHQoY29uZmlnLnNraXBNZXNzYWdlLnNraXApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgYWRTdGFydEhhbmRsZXIgPSAoZXZlbnQ6IGJpdG1vdmluLnBsYXllci5BZFN0YXJ0ZWRFdmVudCkgPT4ge1xuICAgICAgYWRFdmVudCA9IGV2ZW50O1xuICAgICAgc2tpcE1lc3NhZ2UgPSBhZEV2ZW50LnNraXBNZXNzYWdlIHx8IHNraXBNZXNzYWdlO1xuICAgICAgdXBkYXRlU2tpcE1lc3NhZ2VIYW5kbGVyKCk7XG5cbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgdXBkYXRlU2tpcE1lc3NhZ2VIYW5kbGVyKTtcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfVElNRV9VUERBVEVELCB1cGRhdGVTa2lwTWVzc2FnZUhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBsZXQgYWRFbmRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgcGxheWVyLnJlbW92ZUV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCB1cGRhdGVTa2lwTWVzc2FnZUhhbmRsZXIpO1xuICAgICAgcGxheWVyLnJlbW92ZUV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9USU1FX1VQREFURUQsIHVwZGF0ZVNraXBNZXNzYWdlSGFuZGxlcik7XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX1NUQVJURUQsIGFkU3RhcnRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9TS0lQUEVELCBhZEVuZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX0VSUk9SLCBhZEVuZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX0ZJTklTSEVELCBhZEVuZEhhbmRsZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBUcnkgdG8gc2tpcCB0aGUgYWQgKHRoaXMgb25seSB3b3JrcyBpZiBpdCBpcyBza2lwcGFibGUgc28gd2UgZG9uJ3QgbmVlZCB0byB0YWtlIGV4dHJhIGNhcmUgb2YgdGhhdCBoZXJlKVxuICAgICAgcGxheWVyLnNraXBBZCgpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgQXBwbGUgQWlyUGxheS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFpclBsYXlUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWFpcnBsYXl0b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ0FwcGxlIEFpclBsYXknXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNBaXJwbGF5QXZhaWxhYmxlKCkpIHtcbiAgICAgICAgcGxheWVyLnNob3dBaXJwbGF5VGFyZ2V0UGlja2VyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29uc29sZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdBaXJQbGF5IHVuYXZhaWxhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBhaXJQbGF5QXZhaWxhYmxlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNBaXJwbGF5QXZhaWxhYmxlKCkpIHtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQUlSUExBWV9BVkFJTEFCTEUsIGFpclBsYXlBdmFpbGFibGVIYW5kbGVyKTtcblxuICAgIC8vIFN0YXJ0dXAgaW5pdFxuICAgIGFpclBsYXlBdmFpbGFibGVIYW5kbGVyKCk7IC8vIEhpZGUgYnV0dG9uIGlmIEFpclBsYXkgaXMgbm90IGF2YWlsYWJsZVxuICB9XG59IiwiaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vc2VsZWN0Ym94JztcbmltcG9ydCB7TGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2VsZWN0IGJveCBwcm92aWRpbmcgYSBzZWxlY3Rpb24gYmV0d2VlbiAnYXV0bycgYW5kIHRoZSBhdmFpbGFibGUgYXVkaW8gcXVhbGl0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9RdWFsaXR5U2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IHVwZGF0ZUF1ZGlvUXVhbGl0aWVzID0gKCkgPT4ge1xuICAgICAgbGV0IGF1ZGlvUXVhbGl0aWVzID0gcGxheWVyLmdldEF2YWlsYWJsZUF1ZGlvUXVhbGl0aWVzKCk7XG5cbiAgICAgIHRoaXMuY2xlYXJJdGVtcygpO1xuXG4gICAgICAvLyBBZGQgZW50cnkgZm9yIGF1dG9tYXRpYyBxdWFsaXR5IHN3aXRjaGluZyAoZGVmYXVsdCBzZXR0aW5nKVxuICAgICAgdGhpcy5hZGRJdGVtKCdhdXRvJywgJ2F1dG8nKTtcblxuICAgICAgLy8gQWRkIGF1ZGlvIHF1YWxpdGllc1xuICAgICAgZm9yIChsZXQgYXVkaW9RdWFsaXR5IG9mIGF1ZGlvUXVhbGl0aWVzKSB7XG4gICAgICAgIHRoaXMuYWRkSXRlbShhdWRpb1F1YWxpdHkuaWQsIGF1ZGlvUXVhbGl0eS5sYWJlbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IEF1ZGlvUXVhbGl0eVNlbGVjdEJveCwgdmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgcGxheWVyLnNldEF1ZGlvUXVhbGl0eSh2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgcXVhbGl0aWVzIHdoZW4gYXVkaW8gdHJhY2sgaGFzIGNoYW5nZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BVURJT19DSEFOR0VELCB1cGRhdGVBdWRpb1F1YWxpdGllcyk7XG4gICAgLy8gVXBkYXRlIHF1YWxpdGllcyB3aGVuIHNvdXJjZSBnb2VzIGF3YXlcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHVwZGF0ZUF1ZGlvUXVhbGl0aWVzKTtcbiAgICAvLyBVcGRhdGUgcXVhbGl0aWVzIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB1cGRhdGVBdWRpb1F1YWxpdGllcyk7XG4gICAgLy8gVXBkYXRlIHF1YWxpdHkgc2VsZWN0aW9uIHdoZW4gcXVhbGl0eSBpcyBjaGFuZ2VkIChmcm9tIG91dHNpZGUpXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fRE9XTkxPQURfUVVBTElUWV9DSEFOR0UsICgpID0+IHtcbiAgICAgIGxldCBkYXRhID0gcGxheWVyLmdldERvd25sb2FkZWRBdWRpb0RhdGEoKTtcbiAgICAgIHRoaXMuc2VsZWN0SXRlbShkYXRhLmlzQXV0byA/ICdhdXRvJyA6IGRhdGEuaWQpO1xuICAgIH0pO1xuXG4gICAgLy8gUG9wdWxhdGUgcXVhbGl0aWVzIGF0IHN0YXJ0dXBcbiAgICB1cGRhdGVBdWRpb1F1YWxpdGllcygpO1xuICB9XG59IiwiaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vc2VsZWN0Ym94JztcbmltcG9ydCB7TGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2VsZWN0IGJveCBwcm92aWRpbmcgYSBzZWxlY3Rpb24gYmV0d2VlbiBhdmFpbGFibGUgYXVkaW8gdHJhY2tzIChlLmcuIGRpZmZlcmVudCBsYW5ndWFnZXMpLlxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9UcmFja1NlbGVjdEJveCBleHRlbmRzIFNlbGVjdEJveCB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMaXN0U2VsZWN0b3JDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB1cGRhdGVBdWRpb1RyYWNrcyA9ICgpID0+IHtcbiAgICAgIGxldCBhdWRpb1RyYWNrcyA9IHBsYXllci5nZXRBdmFpbGFibGVBdWRpbygpO1xuXG4gICAgICB0aGlzLmNsZWFySXRlbXMoKTtcblxuICAgICAgLy8gQWRkIGF1ZGlvIHRyYWNrc1xuICAgICAgZm9yIChsZXQgYXVkaW9UcmFjayBvZiBhdWRpb1RyYWNrcykge1xuICAgICAgICB0aGlzLmFkZEl0ZW0oYXVkaW9UcmFjay5pZCwgYXVkaW9UcmFjay5sYWJlbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IEF1ZGlvVHJhY2tTZWxlY3RCb3gsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHBsYXllci5zZXRBdWRpbyh2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBsZXQgYXVkaW9UcmFja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBsZXQgY3VycmVudEF1ZGlvVHJhY2sgPSBwbGF5ZXIuZ2V0QXVkaW8oKTtcblxuICAgICAgLy8gSExTIHN0cmVhbXMgZG9uJ3QgYWx3YXlzIHByb3ZpZGUgdGhpcywgc28gd2UgaGF2ZSB0byBjaGVja1xuICAgICAgaWYgKGN1cnJlbnRBdWRpb1RyYWNrKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0SXRlbShjdXJyZW50QXVkaW9UcmFjay5pZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFVwZGF0ZSBzZWxlY3Rpb24gd2hlbiBzZWxlY3RlZCB0cmFjayBoYXMgY2hhbmdlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FVRElPX0NIQU5HRUQsIGF1ZGlvVHJhY2tIYW5kbGVyKTtcbiAgICAvLyBVcGRhdGUgdHJhY2tzIHdoZW4gc291cmNlIGdvZXMgYXdheVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgdXBkYXRlQXVkaW9UcmFja3MpO1xuICAgIC8vIFVwZGF0ZSB0cmFja3Mgd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHVwZGF0ZUF1ZGlvVHJhY2tzKTtcblxuICAgIC8vIFBvcHVsYXRlIHRyYWNrcyBhdCBzdGFydHVwXG4gICAgdXBkYXRlQXVkaW9UcmFja3MoKTtcblxuICAgIC8vIFdoZW4gYHBsYXliYWNrLmF1ZGlvTGFuZ3VhZ2VgIGlzIHNldCwgdGhlIGBPTl9BVURJT19DSEFOR0VEYCBldmVudCBmb3IgdGhhdCBjaGFuZ2UgaXMgdHJpZ2dlcmVkIGJlZm9yZSB0aGVcbiAgICAvLyBVSSBpcyBjcmVhdGVkLiBUaGVyZWZvcmUgd2UgbmVlZCB0byBzZXQgdGhlIGF1ZGlvIHRyYWNrIG9uIGNvbmZpZ3VyZS5cbiAgICBhdWRpb1RyYWNrSGFuZGxlcigpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQnVmZmVyaW5nT3ZlcmxheX0gY29tcG9uZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1ZmZlcmluZ092ZXJsYXlDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogRGVsYXkgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSBidWZmZXJpbmcgb3ZlcmxheSB3aWxsIGJlIGRpc3BsYXllZC4gVXNlZnVsIHRvIGJ5cGFzcyBzaG9ydCBzdGFsbHMgd2l0aG91dFxuICAgKiBkaXNwbGF5aW5nIHRoZSBvdmVybGF5LiBTZXQgdG8gMCB0byBkaXNwbGF5IHRoZSBvdmVybGF5IGluc3RhbnRseS5cbiAgICogRGVmYXVsdDogMTAwMG1zICgxIHNlY29uZClcbiAgICovXG4gIHNob3dEZWxheU1zPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgYW5kIGRpc3BsYXlzIGEgYnVmZmVyaW5nIGluZGljYXRvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1ZmZlcmluZ092ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8QnVmZmVyaW5nT3ZlcmxheUNvbmZpZz4ge1xuXG4gIHByaXZhdGUgaW5kaWNhdG9yczogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz5bXTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEJ1ZmZlcmluZ092ZXJsYXlDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmluZGljYXRvcnMgPSBbXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgXTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIDxCdWZmZXJpbmdPdmVybGF5Q29uZmlnPntcbiAgICAgIGNzc0NsYXNzOiAndWktYnVmZmVyaW5nLW92ZXJsYXknLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgY29tcG9uZW50czogdGhpcy5pbmRpY2F0b3JzLFxuICAgICAgc2hvd0RlbGF5TXM6IDEwMDAsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPEJ1ZmZlcmluZ092ZXJsYXlDb25maWc+dGhpcy5nZXRDb25maWcoKTtcblxuICAgIGxldCBvdmVybGF5U2hvd1RpbWVvdXQgPSBuZXcgVGltZW91dChjb25maWcuc2hvd0RlbGF5TXMsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0pO1xuXG4gICAgbGV0IHNob3dPdmVybGF5ID0gKCkgPT4ge1xuICAgICAgb3ZlcmxheVNob3dUaW1lb3V0LnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIGxldCBoaWRlT3ZlcmxheSA9ICgpID0+IHtcbiAgICAgIG92ZXJsYXlTaG93VGltZW91dC5jbGVhcigpO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX1NUQVJURUQsIHNob3dPdmVybGF5KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TVEFMTF9FTkRFRCwgaGlkZU92ZXJsYXkpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgaGlkZU92ZXJsYXkpO1xuXG4gICAgLy8gU2hvdyBvdmVybGF5IGlmIHBsYXllciBpcyBhbHJlYWR5IHN0YWxsZWQgYXQgaW5pdFxuICAgIGlmIChwbGF5ZXIuaXNTdGFsbGVkKCkpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnRDb25maWcsIENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgTm9BcmdzLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgQnV0dG9ufSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQnV0dG9uQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSB0ZXh0IG9uIHRoZSBidXR0b24uXG4gICAqL1xuICB0ZXh0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgc2ltcGxlIGNsaWNrYWJsZSBidXR0b24uXG4gKi9cbmV4cG9ydCBjbGFzcyBCdXR0b248Q29uZmlnIGV4dGVuZHMgQnV0dG9uQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxCdXR0b25Db25maWc+IHtcblxuICBwcml2YXRlIGJ1dHRvbkV2ZW50cyA9IHtcbiAgICBvbkNsaWNrOiBuZXcgRXZlbnREaXNwYXRjaGVyPEJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+KClcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWJ1dHRvbidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBidXR0b24gZWxlbWVudCB3aXRoIHRoZSB0ZXh0IGxhYmVsXG4gICAgbGV0IGJ1dHRvbkVsZW1lbnQgPSBuZXcgRE9NKCdidXR0b24nLCB7XG4gICAgICAndHlwZSc6ICdidXR0b24nLFxuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKVxuICAgIH0pLmFwcGVuZChuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2xhYmVsJylcbiAgICB9KS5odG1sKHRoaXMuY29uZmlnLnRleHQpKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBidXR0b24gZWxlbWVudCBhbmQgdHJpZ2dlciB0aGUgY29ycmVzcG9uZGluZyBldmVudCBvbiB0aGUgYnV0dG9uIGNvbXBvbmVudFxuICAgIGJ1dHRvbkVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkNsaWNrRXZlbnQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBidXR0b25FbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGV4dCBvbiB0aGUgbGFiZWwgb2YgdGhlIGJ1dHRvbi5cbiAgICogQHBhcmFtIHRleHQgdGhlIHRleHQgdG8gcHV0IGludG8gdGhlIGxhYmVsIG9mIHRoZSBidXR0b25cbiAgICovXG4gIHNldFRleHQodGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5nZXREb21FbGVtZW50KCkuZmluZCgnLicgKyB0aGlzLnByZWZpeENzcygnbGFiZWwnKSkuaHRtbCh0ZXh0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNsaWNrRXZlbnQoKSB7XG4gICAgdGhpcy5idXR0b25FdmVudHMub25DbGljay5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8QnV0dG9uPENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25DbGljaygpOiBFdmVudDxCdXR0b248Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uRXZlbnRzLm9uQ2xpY2suZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7TGFiZWwsIExhYmVsQ29uZmlnfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgQ2FzdFdhaXRpbmdGb3JEZXZpY2VFdmVudCA9IGJpdG1vdmluLnBsYXllci5DYXN0V2FpdGluZ0ZvckRldmljZUV2ZW50O1xuaW1wb3J0IENhc3RTdGFydGVkRXZlbnQgPSBiaXRtb3Zpbi5wbGF5ZXIuQ2FzdFN0YXJ0ZWRFdmVudDtcblxuLyoqXG4gKiBPdmVybGF5cyB0aGUgcGxheWVyIGFuZCBkaXNwbGF5cyB0aGUgc3RhdHVzIG9mIGEgQ2FzdCBzZXNzaW9uLlxuICovXG5leHBvcnQgY2xhc3MgQ2FzdFN0YXR1c092ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0dXNMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5zdGF0dXNMYWJlbCA9IG5ldyBMYWJlbDxMYWJlbENvbmZpZz4oeyBjc3NDbGFzczogJ3VpLWNhc3Qtc3RhdHVzLWxhYmVsJyB9KTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2FzdC1zdGF0dXMtb3ZlcmxheScsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy5zdGF0dXNMYWJlbF0sXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfV0FJVElOR19GT1JfREVWSUNFLFxuICAgICAgKGV2ZW50OiBDYXN0V2FpdGluZ0ZvckRldmljZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAvLyBHZXQgZGV2aWNlIG5hbWUgYW5kIHVwZGF0ZSBzdGF0dXMgdGV4dCB3aGlsZSBjb25uZWN0aW5nXG4gICAgICAgIGxldCBjYXN0RGV2aWNlTmFtZSA9IGV2ZW50LmNhc3RQYXlsb2FkLmRldmljZU5hbWU7XG4gICAgICAgIHRoaXMuc3RhdHVzTGFiZWwuc2V0VGV4dChgQ29ubmVjdGluZyB0byA8c3Ryb25nPiR7Y2FzdERldmljZU5hbWV9PC9zdHJvbmc+Li4uYCk7XG4gICAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsIChldmVudDogQ2FzdFN0YXJ0ZWRFdmVudCkgPT4ge1xuICAgICAgLy8gU2Vzc2lvbiBpcyBzdGFydGVkIG9yIHJlc3VtZWRcbiAgICAgIC8vIEZvciBjYXNlcyB3aGVuIGEgc2Vzc2lvbiBpcyByZXN1bWVkLCB3ZSBkbyBub3QgcmVjZWl2ZSB0aGUgcHJldmlvdXMgZXZlbnRzIGFuZCB0aGVyZWZvcmUgc2hvdyB0aGUgc3RhdHVzIHBhbmVsXG4gICAgICAvLyBoZXJlIHRvb1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgICBsZXQgY2FzdERldmljZU5hbWUgPSBldmVudC5kZXZpY2VOYW1lO1xuICAgICAgdGhpcy5zdGF0dXNMYWJlbC5zZXRUZXh0KGBQbGF5aW5nIG9uIDxzdHJvbmc+JHtjYXN0RGV2aWNlTmFtZX08L3N0cm9uZz5gKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUT1BQRUQsIChldmVudCkgPT4ge1xuICAgICAgLy8gQ2FzdCBzZXNzaW9uIGdvbmUsIGhpZGUgdGhlIHN0YXR1cyBwYW5lbFxuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyBjYXN0aW5nIHRvIGEgQ2FzdCByZWNlaXZlci5cbiAqL1xuZXhwb3J0IGNsYXNzIENhc3RUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNhc3R0b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ0dvb2dsZSBDYXN0J1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzQ2FzdEF2YWlsYWJsZSgpKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgICAgICBwbGF5ZXIuY2FzdFN0b3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5ZXIuY2FzdFZpZGVvKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Nhc3QgdW5hdmFpbGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGNhc3RBdmFpbGFibGVIYW5kZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzQ2FzdEF2YWlsYWJsZSgpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfQVZBSUxBQkxFLCBjYXN0QXZhaWxhYmxlSGFuZGVyKTtcblxuICAgIC8vIFRvZ2dsZSBidXR0b24gJ29uJyBzdGF0ZVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfV0FJVElOR19GT1JfREVWSUNFLCAoKSA9PiB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVEVELCAoKSA9PiB7XG4gICAgICAvLyBXaGVuIGEgc2Vzc2lvbiBpcyByZXN1bWVkLCB0aGVyZSBpcyBubyBPTl9DQVNUX1NUQVJUIGV2ZW50LCBzbyB3ZSBhbHNvIG5lZWQgdG8gdG9nZ2xlIGhlcmUgZm9yIHN1Y2ggY2FzZXNcbiAgICAgIHRoaXMub24oKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUT1BQRUQsICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBjYXN0QXZhaWxhYmxlSGFuZGVyKCk7IC8vIEhpZGUgYnV0dG9uIGlmIENhc3Qgbm90IGF2YWlsYWJsZVxuICAgIGlmIChwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgIHRoaXMub24oKTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge1VJQ29udGFpbmVyLCBVSUNvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi91aWNvbnRhaW5lcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcblxuLyoqXG4gKiBUaGUgYmFzZSBjb250YWluZXIgZm9yIENhc3QgcmVjZWl2ZXJzIHRoYXQgY29udGFpbnMgYWxsIG9mIHRoZSBVSSBhbmQgdGFrZXMgY2FyZSB0aGF0IHRoZSBVSSBpcyBzaG93biBvblxuICogY2VydGFpbiBwbGF5YmFjayBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXN0VUlDb250YWluZXIgZXh0ZW5kcyBVSUNvbnRhaW5lciB7XG5cbiAgcHJpdmF0ZSBjYXN0VWlIaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFVJQ29udGFpbmVyQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxVSUNvbnRhaW5lckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgLypcbiAgICAgKiBTaG93IFVJIG9uIENhc3QgZGV2aWNlcyBhdCBjZXJ0YWluIHBsYXliYWNrIGV2ZW50c1xuICAgICAqXG4gICAgICogU2luY2UgYSBDYXN0IHJlY2VpdmVyIGRvZXMgbm90IGhhdmUgYSBkaXJlY3QgSENJLCB3ZSBzaG93IHRoZSBVSSBvbiBjZXJ0YWluIHBsYXliYWNrIGV2ZW50cyB0byBnaXZlIHRoZSB1c2VyXG4gICAgICogYSBjaGFuY2UgdG8gc2VlIG9uIHRoZSBzY3JlZW4gd2hhdCdzIGdvaW5nIG9uLCBlLmcuIG9uIHBsYXkvcGF1c2Ugb3IgYSBzZWVrIHRoZSBVSSBpcyBzaG93biBhbmQgdGhlIHVzZXIgY2FuXG4gICAgICogc2VlIHRoZSBjdXJyZW50IHRpbWUgYW5kIHBvc2l0aW9uIG9uIHRoZSBzZWVrIGJhci5cbiAgICAgKiBUaGUgVUkgaXMgc2hvd24gcGVybWFuZW50bHkgd2hpbGUgcGxheWJhY2sgaXMgcGF1c2VkLCBvdGhlcndpc2UgaGlkZXMgYXV0b21hdGljYWxseSBhZnRlciB0aGUgY29uZmlndXJlZFxuICAgICAqIGhpZGUgZGVsYXkgdGltZS5cbiAgICAgKi9cblxuICAgIGxldCBpc1VpU2hvd24gPSBmYWxzZTtcblxuICAgIGxldCBoaWRlVWkgPSAoKSA9PiB7XG4gICAgICB1aW1hbmFnZXIub25Db250cm9sc0hpZGUuZGlzcGF0Y2godGhpcyk7XG4gICAgICBpc1VpU2hvd24gPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdGhpcy5jYXN0VWlIaWRlVGltZW91dCA9IG5ldyBUaW1lb3V0KGNvbmZpZy5oaWRlRGVsYXksIGhpZGVVaSk7XG5cbiAgICBsZXQgc2hvd1VpID0gKCkgPT4ge1xuICAgICAgaWYgKCFpc1VpU2hvd24pIHtcbiAgICAgICAgdWltYW5hZ2VyLm9uQ29udHJvbHNTaG93LmRpc3BhdGNoKHRoaXMpO1xuICAgICAgICBpc1VpU2hvd24gPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgc2hvd1VpUGVybWFuZW50bHkgPSAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICAgIHRoaXMuY2FzdFVpSGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICB9O1xuXG4gICAgbGV0IHNob3dVaVdpdGhUaW1lb3V0ID0gKCkgPT4ge1xuICAgICAgc2hvd1VpKCk7XG4gICAgICB0aGlzLmNhc3RVaUhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIGxldCBzaG93VWlBZnRlclNlZWsgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzUGxheWluZygpKSB7XG4gICAgICAgIHNob3dVaVdpdGhUaW1lb3V0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaG93VWlQZXJtYW5lbnRseSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgc2hvd1VpV2l0aFRpbWVvdXQpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9MT0FERUQsIHNob3dVaVdpdGhUaW1lb3V0KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCBzaG93VWlXaXRoVGltZW91dCk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUEFVU0VELCBzaG93VWlQZXJtYW5lbnRseSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFSywgc2hvd1VpUGVybWFuZW50bHkpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgc2hvd1VpQWZ0ZXJTZWVrKTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIHRoaXMuY2FzdFVpSGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgfVxufSIsImltcG9ydCB7QnV0dG9uLCBCdXR0b25Db25maWd9IGZyb20gJy4vYnV0dG9uJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgQ2xpY2tPdmVybGF5fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGlja092ZXJsYXlDb25maWcgZXh0ZW5kcyBCdXR0b25Db25maWcge1xuICAvKipcbiAgICogVGhlIHVybCB0byBvcGVuIHdoZW4gdGhlIG92ZXJsYXkgaXMgY2xpY2tlZC4gU2V0IHRvIG51bGwgdG8gZGlzYWJsZSB0aGUgY2xpY2sgaGFuZGxlci5cbiAgICovXG4gIHVybD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGNsaWNrIG92ZXJsYXkgdGhhdCBvcGVucyBhbiB1cmwgaW4gYSBuZXcgdGFiIGlmIGNsaWNrZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbGlja092ZXJsYXkgZXh0ZW5kcyBCdXR0b248Q2xpY2tPdmVybGF5Q29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDbGlja092ZXJsYXlDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNsaWNrb3ZlcmxheSdcbiAgICB9LCA8Q2xpY2tPdmVybGF5Q29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5zZXRVcmwoKDxDbGlja092ZXJsYXlDb25maWc+dGhpcy5jb25maWcpLnVybCk7XG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLmdldERvbUVsZW1lbnQoKTtcbiAgICBlbGVtZW50Lm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmIChlbGVtZW50LmRhdGEoJ3VybCcpKSB7XG4gICAgICAgIHdpbmRvdy5vcGVuKGVsZW1lbnQuZGF0YSgndXJsJyksICdfYmxhbmsnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBVUkwgdGhhdCBzaG91bGQgYmUgZm9sbG93ZWQgd2hlbiB0aGUgd2F0ZXJtYXJrIGlzIGNsaWNrZWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSB3YXRlcm1hcmsgVVJMXG4gICAqL1xuICBnZXRVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXREb21FbGVtZW50KCkuZGF0YSgndXJsJyk7XG4gIH1cblxuICBzZXRVcmwodXJsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodXJsID09PSB1bmRlZmluZWQgfHwgdXJsID09IG51bGwpIHtcbiAgICAgIHVybCA9ICcnO1xuICAgIH1cbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kYXRhKCd1cmwnLCB1cmwpO1xuICB9XG59IiwiaW1wb3J0IHtCdXR0b25Db25maWcsIEJ1dHRvbn0gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBDbG9zZUJ1dHRvbn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvc2VCdXR0b25Db25maWcgZXh0ZW5kcyBCdXR0b25Db25maWcge1xuICAvKipcbiAgICogVGhlIGNvbXBvbmVudCB0aGF0IHNob3VsZCBiZSBjbG9zZWQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gICAqL1xuICB0YXJnZXQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+O1xufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgY2xvc2VzIChoaWRlcykgYSBjb25maWd1cmVkIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIENsb3NlQnV0dG9uIGV4dGVuZHMgQnV0dG9uPENsb3NlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDbG9zZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNsb3NlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdDbG9zZSdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8Q2xvc2VCdXR0b25Db25maWc+dGhpcy5nZXRDb25maWcoKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29uZmlnLnRhcmdldC5oaWRlKCk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge0d1aWR9IGZyb20gJy4uL2d1aWQnO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgTm9BcmdzLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQmFzZSBjb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSBjb21wb25lbnQuXG4gKiBTaG91bGQgYmUgZXh0ZW5kZWQgYnkgY29tcG9uZW50cyB0aGF0IHdhbnQgdG8gYWRkIGFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudENvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgSFRNTCB0YWcgbmFtZSBvZiB0aGUgY29tcG9uZW50LlxuICAgKiBEZWZhdWx0OiAnZGl2J1xuICAgKi9cbiAgdGFnPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIEhUTUwgSUQgb2YgdGhlIGNvbXBvbmVudC5cbiAgICogRGVmYXVsdDogYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgd2l0aCBwYXR0ZXJuICd1aS1pZC17Z3VpZH0nLlxuICAgKi9cbiAgaWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgcHJlZml4IHRvIHByZXBlbmQgYWxsIENTUyBjbGFzc2VzIHdpdGguXG4gICAqL1xuICBjc3NQcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBDU1MgY2xhc3NlcyBvZiB0aGUgY29tcG9uZW50LiBUaGlzIGlzIHVzdWFsbHkgdGhlIGNsYXNzIGZyb20gd2hlcmUgdGhlIGNvbXBvbmVudCB0YWtlcyBpdHMgc3R5bGluZy5cbiAgICovXG4gIGNzc0NsYXNzPzogc3RyaW5nOyAvLyAnY2xhc3MnIGlzIGEgcmVzZXJ2ZWQga2V5d29yZCwgc28gd2UgbmVlZCB0byBtYWtlIHRoZSBuYW1lIG1vcmUgY29tcGxpY2F0ZWRcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBDU1MgY2xhc3NlcyBvZiB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgY3NzQ2xhc3Nlcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaWYgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgaGlkZGVuIGF0IHN0YXJ0dXAuXG4gICAqIERlZmF1bHQ6IGZhbHNlXG4gICAqL1xuICBoaWRkZW4/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudEhvdmVyQ2hhbmdlZEV2ZW50QXJncyBleHRlbmRzIE5vQXJncyB7XG4gIC8qKlxuICAgKiBUcnVlIGlzIHRoZSBjb21wb25lbnQgaXMgaG92ZXJlZCwgZWxzZSBmYWxzZS5cbiAgICovXG4gIGhvdmVyZWQ6IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIGJhc2UgY2xhc3Mgb2YgdGhlIFVJIGZyYW1ld29yay5cbiAqIEVhY2ggY29tcG9uZW50IG11c3QgZXh0ZW5kIHRoaXMgY2xhc3MgYW5kIG9wdGlvbmFsbHkgdGhlIGNvbmZpZyBpbnRlcmZhY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb25lbnQ8Q29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnPiB7XG5cbiAgLyoqXG4gICAqIFRoZSBjbGFzc25hbWUgdGhhdCBpcyBhdHRhY2hlZCB0byB0aGUgZWxlbWVudCB3aGVuIGl0IGlzIGluIHRoZSBoaWRkZW4gc3RhdGUuXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDTEFTU19ISURERU4gPSAnaGlkZGVuJztcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBvYmplY3Qgb2YgdGhpcyBjb21wb25lbnQuXG4gICAqL1xuICBwcm90ZWN0ZWQgY29uZmlnOiBDb25maWc7XG5cbiAgLyoqXG4gICAqIFRoZSBjb21wb25lbnQncyBET00gZWxlbWVudC5cbiAgICovXG4gIHByaXZhdGUgZWxlbWVudDogRE9NO1xuXG4gIC8qKlxuICAgKiBGbGFnIHRoYXQga2VlcHMgdHJhY2sgb2YgdGhlIGhpZGRlbiBzdGF0ZS5cbiAgICovXG4gIHByaXZhdGUgaGlkZGVuOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBGbGFnIHRoYXQga2VlcHMgdHJhY2sgb2YgdGhlIGhvdmVyIHN0YXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBob3ZlcmVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBldmVudHMgdGhhdCB0aGlzIGNvbXBvbmVudCBvZmZlcnMuIFRoZXNlIGV2ZW50cyBzaG91bGQgYWx3YXlzIGJlIHByaXZhdGUgYW5kIG9ubHkgZGlyZWN0bHlcbiAgICogYWNjZXNzZWQgZnJvbSB3aXRoaW4gdGhlIGltcGxlbWVudGluZyBjb21wb25lbnQuXG4gICAqXG4gICAqIEJlY2F1c2UgVHlwZVNjcmlwdCBkb2VzIG5vdCBzdXBwb3J0IHByaXZhdGUgcHJvcGVydGllcyB3aXRoIHRoZSBzYW1lIG5hbWUgb24gZGlmZmVyZW50IGNsYXNzIGhpZXJhcmNoeSBsZXZlbHNcbiAgICogKGkuZS4gc3VwZXJjbGFzcyBhbmQgc3ViY2xhc3MgY2Fubm90IGNvbnRhaW4gYSBwcml2YXRlIHByb3BlcnR5IHdpdGggdGhlIHNhbWUgbmFtZSksIHRoZSBkZWZhdWx0IG5hbWluZ1xuICAgKiBjb252ZW50aW9uIGZvciB0aGUgZXZlbnQgbGlzdCBvZiBhIGNvbXBvbmVudCB0aGF0IHNob3VsZCBiZSBmb2xsb3dlZCBieSBzdWJjbGFzc2VzIGlzIHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZVxuICAgKiBjYW1lbC1jYXNlZCBjbGFzcyBuYW1lICsgJ0V2ZW50cycgKGUuZy4gU3ViQ2xhc3MgZXh0ZW5kcyBDb21wb25lbnQgPT4gc3ViQ2xhc3NFdmVudHMpLlxuICAgKiBTZWUge0BsaW5rICNjb21wb25lbnRFdmVudHN9IGZvciBhbiBleGFtcGxlLlxuICAgKlxuICAgKiBFdmVudCBwcm9wZXJ0aWVzIHNob3VsZCBiZSBuYW1lZCBpbiBjYW1lbCBjYXNlIHdpdGggYW4gJ29uJyBwcmVmaXggYW5kIGluIHRoZSBwcmVzZW50IHRlbnNlLiBBc3luYyBldmVudHMgbWF5XG4gICAqIGhhdmUgYSBzdGFydCBldmVudCAod2hlbiB0aGUgb3BlcmF0aW9uIHN0YXJ0cykgaW4gdGhlIHByZXNlbnQgdGVuc2UsIGFuZCBtdXN0IGhhdmUgYW4gZW5kIGV2ZW50ICh3aGVuIHRoZVxuICAgKiBvcGVyYXRpb24gZW5kcykgaW4gdGhlIHBhc3QgdGVuc2UgKG9yIHByZXNlbnQgdGVuc2UgaW4gc3BlY2lhbCBjYXNlcyAoZS5nLiBvblN0YXJ0L29uU3RhcnRlZCBvciBvblBsYXkvb25QbGF5aW5nKS5cbiAgICogU2VlIHtAbGluayAjY29tcG9uZW50RXZlbnRzI29uU2hvd30gZm9yIGFuIGV4YW1wbGUuXG4gICAqXG4gICAqIEVhY2ggZXZlbnQgc2hvdWxkIGJlIGFjY29tcGFuaWVkIHdpdGggYSBwcm90ZWN0ZWQgbWV0aG9kIG5hbWVkIGJ5IHRoZSBjb252ZW50aW9uIGV2ZW50TmFtZSArICdFdmVudCdcbiAgICogKGUuZy4gb25TdGFydEV2ZW50KSwgdGhhdCBhY3R1YWxseSB0cmlnZ2VycyB0aGUgZXZlbnQgYnkgY2FsbGluZyB7QGxpbmsgRXZlbnREaXNwYXRjaGVyI2Rpc3BhdGNoIGRpc3BhdGNofSBhbmRcbiAgICogcGFzc2luZyBhIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGFzIGZpcnN0IHBhcmFtZXRlci4gQ29tcG9uZW50cyBzaG91bGQgYWx3YXlzIHRyaWdnZXIgdGhlaXIgZXZlbnRzIHdpdGggdGhlc2VcbiAgICogbWV0aG9kcy4gSW1wbGVtZW50aW5nIHRoaXMgcGF0dGVybiBnaXZlcyBzdWJjbGFzc2VzIG1lYW5zIHRvIGRpcmVjdGx5IGxpc3RlbiB0byB0aGUgZXZlbnRzIGJ5IG92ZXJyaWRpbmcgdGhlXG4gICAqIG1ldGhvZCAoYW5kIHNhdmluZyB0aGUgb3ZlcmhlYWQgb2YgcGFzc2luZyBhIGhhbmRsZXIgdG8gdGhlIGV2ZW50IGRpc3BhdGNoZXIpIGFuZCBtb3JlIGltcG9ydGFudGx5IHRvIHRyaWdnZXJcbiAgICogdGhlc2UgZXZlbnRzIHdpdGhvdXQgaGF2aW5nIGFjY2VzcyB0byB0aGUgcHJpdmF0ZSBldmVudCBsaXN0LlxuICAgKiBTZWUge0BsaW5rICNvblNob3d9IGZvciBhbiBleGFtcGxlLlxuICAgKlxuICAgKiBUbyBwcm92aWRlIGV4dGVybmFsIGNvZGUgdGhlIHBvc3NpYmlsaXR5IHRvIGxpc3RlbiB0byB0aGlzIGNvbXBvbmVudCdzIGV2ZW50cyAoc3Vic2NyaWJlLCB1bnN1YnNjcmliZSwgZXRjLiksXG4gICAqIGVhY2ggZXZlbnQgc2hvdWxkIGFsc28gYmUgYWNjb21wYW5pZWQgYnkgYSBwdWJsaWMgZ2V0dGVyIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgbmFtZSBhcyB0aGUgZXZlbnQncyBwcm9wZXJ0eSxcbiAgICogdGhhdCByZXR1cm5zIHRoZSB7QGxpbmsgRXZlbnR9IG9idGFpbmVkIGZyb20gdGhlIGV2ZW50IGRpc3BhdGNoZXIgYnkgY2FsbGluZyB7QGxpbmsgRXZlbnREaXNwYXRjaGVyI2dldEV2ZW50fS5cbiAgICogU2VlIHtAbGluayAjb25TaG93fSBmb3IgYW4gZXhhbXBsZS5cbiAgICpcbiAgICogRnVsbCBleGFtcGxlIGZvciBhbiBldmVudCByZXByZXNlbnRpbmcgYW4gZXhhbXBsZSBhY3Rpb24gaW4gYSBleGFtcGxlIGNvbXBvbmVudDpcbiAgICpcbiAgICogPGNvZGU+XG4gICAqIC8vIERlZmluZSBhbiBleGFtcGxlIGNvbXBvbmVudCBjbGFzcyB3aXRoIGFuIGV4YW1wbGUgZXZlbnRcbiAgICogY2xhc3MgRXhhbXBsZUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudDxDb21wb25lbnRDb25maWc+IHtcbiAgICAgKlxuICAgICAqICAgICBwcml2YXRlIGV4YW1wbGVDb21wb25lbnRFdmVudHMgPSB7XG4gICAgICogICAgICAgICBvbkV4YW1wbGVBY3Rpb246IG5ldyBFdmVudERpc3BhdGNoZXI8RXhhbXBsZUNvbXBvbmVudCwgTm9BcmdzPigpXG4gICAgICogICAgIH1cbiAgICAgKlxuICAgICAqICAgICAvLyBjb25zdHJ1Y3RvciBhbmQgb3RoZXIgc3R1ZmYuLi5cbiAgICAgKlxuICAgICAqICAgICBwcm90ZWN0ZWQgb25FeGFtcGxlQWN0aW9uRXZlbnQoKSB7XG4gICAgICogICAgICAgIHRoaXMuZXhhbXBsZUNvbXBvbmVudEV2ZW50cy5vbkV4YW1wbGVBY3Rpb24uZGlzcGF0Y2godGhpcyk7XG4gICAgICogICAgfVxuICAgICAqXG4gICAgICogICAgZ2V0IG9uRXhhbXBsZUFjdGlvbigpOiBFdmVudDxFeGFtcGxlQ29tcG9uZW50LCBOb0FyZ3M+IHtcbiAgICAgKiAgICAgICAgcmV0dXJuIHRoaXMuZXhhbXBsZUNvbXBvbmVudEV2ZW50cy5vbkV4YW1wbGVBY3Rpb24uZ2V0RXZlbnQoKTtcbiAgICAgKiAgICB9XG4gICAgICogfVxuICAgKlxuICAgKiAvLyBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBzb21ld2hlcmVcbiAgICogdmFyIGV4YW1wbGVDb21wb25lbnRJbnN0YW5jZSA9IG5ldyBFeGFtcGxlQ29tcG9uZW50KCk7XG4gICAqXG4gICAqIC8vIFN1YnNjcmliZSB0byB0aGUgZXhhbXBsZSBldmVudCBvbiB0aGUgY29tcG9uZW50XG4gICAqIGV4YW1wbGVDb21wb25lbnRJbnN0YW5jZS5vbkV4YW1wbGVBY3Rpb24uc3Vic2NyaWJlKGZ1bmN0aW9uIChzZW5kZXI6IEV4YW1wbGVDb21wb25lbnQpIHtcbiAgICAgKiAgICAgY29uc29sZS5sb2coJ29uRXhhbXBsZUFjdGlvbiBvZiAnICsgc2VuZGVyICsgJyBoYXMgZmlyZWQhJyk7XG4gICAgICogfSk7XG4gICAqIDwvY29kZT5cbiAgICovXG4gIHByaXZhdGUgY29tcG9uZW50RXZlbnRzID0ge1xuICAgIG9uU2hvdzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uSGlkZTogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uSG92ZXJDaGFuZ2VkOiBuZXcgRXZlbnREaXNwYXRjaGVyPENvbXBvbmVudDxDb25maWc+LCBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3M+KCksXG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBjb21wb25lbnQgd2l0aCBhbiBvcHRpb25hbGx5IHN1cHBsaWVkIGNvbmZpZy4gQWxsIHN1YmNsYXNzZXMgbXVzdCBjYWxsIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGVpclxuICAgKiBzdXBlcmNsYXNzIGFuZCB0aGVuIG1lcmdlIHRoZWlyIGNvbmZpZ3VyYXRpb24gaW50byB0aGUgY29tcG9uZW50J3MgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIGNvbXBvbmVudFxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb21wb25lbnRDb25maWcgPSB7fSkge1xuICAgIC8vIENyZWF0ZSB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhpcyBjb21wb25lbnRcbiAgICB0aGlzLmNvbmZpZyA9IDxDb25maWc+dGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIHRhZzogJ2RpdicsXG4gICAgICBpZDogJ2JtcHVpLWlkLScgKyBHdWlkLm5leHQoKSxcbiAgICAgIGNzc1ByZWZpeDogJ2JtcHVpJyxcbiAgICAgIGNzc0NsYXNzOiAndWktY29tcG9uZW50JyxcbiAgICAgIGNzc0NsYXNzZXM6IFtdLFxuICAgICAgaGlkZGVuOiBmYWxzZVxuICAgIH0sIHt9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgY29tcG9uZW50LCBlLmcuIGJ5IGFwcGx5aW5nIGNvbmZpZyBzZXR0aW5ncy5cbiAgICogVGhpcyBtZXRob2QgbXVzdCBub3QgYmUgY2FsbGVkIGZyb20gb3V0c2lkZSB0aGUgVUkgZnJhbWV3b3JrLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBhdXRvbWF0aWNhbGx5IGNhbGxlZCBieSB0aGUge0BsaW5rIFVJSW5zdGFuY2VNYW5hZ2VyfS4gSWYgdGhlIGNvbXBvbmVudCBpcyBhbiBpbm5lciBjb21wb25lbnQgb2ZcbiAgICogc29tZSBjb21wb25lbnQsIGFuZCB0aHVzIGVuY2Fwc3VsYXRlZCBhYmQgbWFuYWdlZCBpbnRlcm5hbGx5IGFuZCBuZXZlciBkaXJlY3RseSBleHBvc2VkIHRvIHRoZSBVSU1hbmFnZXIsXG4gICAqIHRoaXMgbWV0aG9kIG11c3QgYmUgY2FsbGVkIGZyb20gdGhlIG1hbmFnaW5nIGNvbXBvbmVudCdzIHtAbGluayAjaW5pdGlhbGl6ZX0gbWV0aG9kLlxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmhpZGRlbiA9IHRoaXMuY29uZmlnLmhpZGRlbjtcblxuICAgIC8vIEhpZGUgdGhlIGNvbXBvbmVudCBhdCBpbml0aWFsaXphdGlvbiBpZiBpdCBpcyBjb25maWd1cmVkIHRvIGJlIGhpZGRlblxuICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgIHRoaXMuaGlkZGVuID0gZmFsc2U7IC8vIFNldCBmbGFnIHRvIGZhbHNlIGZvciB0aGUgZm9sbG93aW5nIGhpZGUoKSBjYWxsIHRvIHdvcmsgKGhpZGUoKSBjaGVja3MgdGhlIGZsYWcpXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgY29tcG9uZW50IGZvciB0aGUgc3VwcGxpZWQgUGxheWVyIGFuZCBVSUluc3RhbmNlTWFuYWdlci4gVGhpcyBpcyB0aGUgcGxhY2Ugd2hlcmUgYWxsIHRoZSBtYWdpY1xuICAgKiBoYXBwZW5zLCB3aGVyZSBjb21wb25lbnRzIHR5cGljYWxseSBzdWJzY3JpYmUgYW5kIHJlYWN0IHRvIGV2ZW50cyAob24gdGhlaXIgRE9NIGVsZW1lbnQsIHRoZSBQbGF5ZXIsIG9yIHRoZVxuICAgKiBVSUluc3RhbmNlTWFuYWdlciksIGFuZCBiYXNpY2FsbHkgZXZlcnl0aGluZyB0aGF0IG1ha2VzIHRoZW0gaW50ZXJhY3RpdmUuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBvbmx5IG9uY2UsIHdoZW4gdGhlIFVJTWFuYWdlciBpbml0aWFsaXplcyB0aGUgVUkuXG4gICAqXG4gICAqIFN1YmNsYXNzZXMgdXN1YWxseSBvdmVyd3JpdGUgdGhpcyBtZXRob2QgdG8gYWRkIHRoZWlyIG93biBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiBAcGFyYW0gcGxheWVyIHRoZSBwbGF5ZXIgd2hpY2ggdGhpcyBjb21wb25lbnQgY29udHJvbHNcbiAgICogQHBhcmFtIHVpbWFuYWdlciB0aGUgVUlJbnN0YW5jZU1hbmFnZXIgdGhhdCBtYW5hZ2VzIHRoaXMgY29tcG9uZW50XG4gICAqL1xuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgdGhpcy5vblNob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudFNob3cuZGlzcGF0Y2godGhpcyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkhpZGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudEhpZGUuZGlzcGF0Y2godGhpcyk7XG4gICAgfSk7XG5cbiAgICAvLyBUcmFjayB0aGUgaG92ZXJlZCBzdGF0ZSBvZiB0aGUgZWxlbWVudFxuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkhvdmVyQ2hhbmdlZEV2ZW50KHRydWUpO1xuICAgIH0pO1xuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkhvdmVyQ2hhbmdlZEV2ZW50KGZhbHNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlcyBhbGwgcmVzb3VyY2VzIGFuZCBkZXBlbmRlbmNpZXMgdGhhdCB0aGUgY29tcG9uZW50IGhvbGRzLiBQbGF5ZXIsIERPTSwgYW5kIFVJTWFuYWdlciBldmVudHMgYXJlXG4gICAqIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBkdXJpbmcgcmVsZWFzZSBhbmQgZG8gbm90IGV4cGxpY2l0bHkgbmVlZCB0byBiZSByZW1vdmVkIGhlcmUuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgVUlNYW5hZ2VyIHdoZW4gaXQgcmVsZWFzZXMgdGhlIFVJLlxuICAgKlxuICAgKiBTdWJjbGFzc2VzIHRoYXQgbmVlZCB0byByZWxlYXNlIHJlc291cmNlcyBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QgYW5kIGNhbGwgc3VwZXIucmVsZWFzZSgpLlxuICAgKi9cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICAvLyBOb3RoaW5nIHRvIGRvIGhlcmUsIG92ZXJyaWRlIHdoZXJlIG5lY2Vzc2FyeVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBET00gZWxlbWVudCBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAqXG4gICAqIFN1YmNsYXNzZXMgdXN1YWxseSBvdmVyd3JpdGUgdGhpcyBtZXRob2QgdG8gZXh0ZW5kIG9yIHJlcGxhY2UgdGhlIERPTSBlbGVtZW50IHdpdGggdGhlaXIgb3duIGRlc2lnbi5cbiAgICovXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBsZXQgZWxlbWVudCA9IG5ldyBET00odGhpcy5jb25maWcudGFnLCB7XG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBET00gZWxlbWVudCBvZiB0aGlzIGNvbXBvbmVudC4gQ3JlYXRlcyB0aGUgRE9NIGVsZW1lbnQgaWYgaXQgZG9lcyBub3QgeWV0IGV4aXN0LlxuICAgKlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIGJ5IHN1YmNsYXNzZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtET019XG4gICAqL1xuICBnZXREb21FbGVtZW50KCk6IERPTSB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMudG9Eb21FbGVtZW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZXMgYSBjb25maWd1cmF0aW9uIHdpdGggYSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gYW5kIGEgYmFzZSBjb25maWd1cmF0aW9uIGZyb20gdGhlIHN1cGVyY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWcgdGhlIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MgZm9yIHRoZSBjb21wb25lbnRzLCBhcyB1c3VhbGx5IHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIGRlZmF1bHRzIGEgZGVmYXVsdCBjb25maWd1cmF0aW9uIGZvciBzZXR0aW5ncyB0aGF0IGFyZSBub3QgcGFzc2VkIHdpdGggdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIGJhc2UgY29uZmlndXJhdGlvbiBpbmhlcml0ZWQgZnJvbSBhIHN1cGVyY2xhc3NcbiAgICogQHJldHVybnMge0NvbmZpZ31cbiAgICovXG4gIHByb3RlY3RlZCBtZXJnZUNvbmZpZzxDb25maWc+KGNvbmZpZzogQ29uZmlnLCBkZWZhdWx0czogQ29uZmlnLCBiYXNlOiBDb25maWcpOiBDb25maWcge1xuICAgIC8vIEV4dGVuZCBkZWZhdWx0IGNvbmZpZyB3aXRoIHN1cHBsaWVkIGNvbmZpZ1xuICAgIGxldCBtZXJnZWQgPSBPYmplY3QuYXNzaWduKHt9LCBiYXNlLCBkZWZhdWx0cywgY29uZmlnKTtcblxuICAgIC8vIFJldHVybiB0aGUgZXh0ZW5kZWQgY29uZmlnXG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRoYXQgcmV0dXJucyBhIHN0cmluZyBvZiBhbGwgQ1NTIGNsYXNzZXMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHByb3RlY3RlZCBnZXRDc3NDbGFzc2VzKCk6IHN0cmluZyB7XG4gICAgLy8gTWVyZ2UgYWxsIENTUyBjbGFzc2VzIGludG8gc2luZ2xlIGFycmF5XG4gICAgbGV0IGZsYXR0ZW5lZEFycmF5ID0gW3RoaXMuY29uZmlnLmNzc0NsYXNzXS5jb25jYXQodGhpcy5jb25maWcuY3NzQ2xhc3Nlcyk7XG4gICAgLy8gUHJlZml4IGNsYXNzZXNcbiAgICBmbGF0dGVuZWRBcnJheSA9IGZsYXR0ZW5lZEFycmF5Lm1hcCgoY3NzKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXhDc3MoY3NzKTtcbiAgICB9KTtcbiAgICAvLyBKb2luIGFycmF5IHZhbHVlcyBpbnRvIGEgc3RyaW5nXG4gICAgbGV0IGZsYXR0ZW5lZFN0cmluZyA9IGZsYXR0ZW5lZEFycmF5LmpvaW4oJyAnKTtcbiAgICAvLyBSZXR1cm4gdHJpbW1lZCBzdHJpbmcgdG8gcHJldmVudCB3aGl0ZXNwYWNlIGF0IHRoZSBlbmQgZnJvbSB0aGUgam9pbiBvcGVyYXRpb25cbiAgICByZXR1cm4gZmxhdHRlbmVkU3RyaW5nLnRyaW0oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwcmVmaXhDc3MoY3NzQ2xhc3NPcklkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5jc3NQcmVmaXggKyAnLScgKyBjc3NDbGFzc09ySWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY29uZmlndXJhdGlvbiBvYmplY3Qgb2YgdGhlIGNvbXBvbmVudC5cbiAgICogQHJldHVybnMge0NvbmZpZ31cbiAgICovXG4gIHB1YmxpYyBnZXRDb25maWcoKTogQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cblxuICAvKipcbiAgICogSGlkZXMgdGhlIGNvbXBvbmVudCBpZiBzaG93bi5cbiAgICogVGhpcyBtZXRob2QgYmFzaWNhbGx5IHRyYW5zZmVycyB0aGUgY29tcG9uZW50IGludG8gdGhlIGhpZGRlbiBzdGF0ZS4gQWN0dWFsIGhpZGluZyBpcyBkb25lIHZpYSBDU1MuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIGlmICghdGhpcy5oaWRkZW4pIHtcbiAgICAgIHRoaXMuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKENvbXBvbmVudC5DTEFTU19ISURERU4pKTtcbiAgICAgIHRoaXMub25IaWRlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvd3MgdGhlIGNvbXBvbmVudCBpZiBoaWRkZW4uXG4gICAqL1xuICBzaG93KCkge1xuICAgIGlmICh0aGlzLmhpZGRlbikge1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoQ29tcG9uZW50LkNMQVNTX0hJRERFTikpO1xuICAgICAgdGhpcy5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMub25TaG93RXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY29tcG9uZW50IGlzIGhpZGRlbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBpcyBoaWRkZW4sIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzSGlkZGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhpZGRlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBjb21wb25lbnQgaXMgc2hvd24uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBjb21wb25lbnQgaXMgdmlzaWJsZSwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaXNTaG93bigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNIaWRkZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBoaWRkZW4gc3RhdGUgYnkgaGlkaW5nIHRoZSBjb21wb25lbnQgaWYgaXQgaXMgc2hvd24sIG9yIHNob3dpbmcgaXQgaWYgaGlkZGVuLlxuICAgKi9cbiAgdG9nZ2xlSGlkZGVuKCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY29tcG9uZW50IGlzIGN1cnJlbnRseSBob3ZlcmVkLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgY29tcG9uZW50IGlzIGhvdmVyZWQsIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5ob3ZlcmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvblNob3cgZXZlbnQuXG4gICAqIFNlZSB0aGUgZGV0YWlsZWQgZXhwbGFuYXRpb24gb24gZXZlbnQgYXJjaGl0ZWN0dXJlIG9uIHRoZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyBldmVudHMgbGlzdH0uXG4gICAqL1xuICBwcm90ZWN0ZWQgb25TaG93RXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRFdmVudHMub25TaG93LmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvbkhpZGUgZXZlbnQuXG4gICAqIFNlZSB0aGUgZGV0YWlsZWQgZXhwbGFuYXRpb24gb24gZXZlbnQgYXJjaGl0ZWN0dXJlIG9uIHRoZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyBldmVudHMgbGlzdH0uXG4gICAqL1xuICBwcm90ZWN0ZWQgb25IaWRlRXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRFdmVudHMub25IaWRlLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvbkhvdmVyQ2hhbmdlZCBldmVudC5cbiAgICogU2VlIHRoZSBkZXRhaWxlZCBleHBsYW5hdGlvbiBvbiBldmVudCBhcmNoaXRlY3R1cmUgb24gdGhlIHtAbGluayAjY29tcG9uZW50RXZlbnRzIGV2ZW50cyBsaXN0fS5cbiAgICovXG4gIHByb3RlY3RlZCBvbkhvdmVyQ2hhbmdlZEV2ZW50KGhvdmVyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmhvdmVyZWQgPSBob3ZlcmVkO1xuICAgIHRoaXMuY29tcG9uZW50RXZlbnRzLm9uSG92ZXJDaGFuZ2VkLmRpc3BhdGNoKHRoaXMsIHsgaG92ZXJlZDogaG92ZXJlZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBzaG93aW5nLlxuICAgKiBTZWUgdGhlIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9uIGV2ZW50IGFyY2hpdGVjdHVyZSBvbiB0aGUge0BsaW5rICNjb21wb25lbnRFdmVudHMgZXZlbnRzIGxpc3R9LlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25TaG93KCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25TaG93LmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgaGlkaW5nLlxuICAgKiBTZWUgdGhlIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9uIGV2ZW50IGFyY2hpdGVjdHVyZSBvbiB0aGUge0BsaW5rICNjb21wb25lbnRFdmVudHMgZXZlbnRzIGxpc3R9LlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25IaWRlKCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25IaWRlLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb21wb25lbnQncyBob3Zlci1zdGF0ZSBpcyBjaGFuZ2luZy5cbiAgICogQHJldHVybnMge0V2ZW50PENvbXBvbmVudDxDb25maWc+LCBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uSG92ZXJDaGFuZ2VkKCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25Ib3ZlckNoYW5nZWQuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50Q29uZmlnLCBDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtBcnJheVV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIENvbnRhaW5lcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGFpbmVyQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgLyoqXG4gICAqIENoaWxkIGNvbXBvbmVudHMgb2YgdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIGNvbXBvbmVudHM/OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPltdO1xufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGNhbiBjb250YWluIGEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb21wb25lbnRzLlxuICogQ29tcG9uZW50cyBjYW4gYmUgYWRkZWQgYXQgY29uc3RydWN0aW9uIHRpbWUgdGhyb3VnaCB0aGUge0BsaW5rIENvbnRhaW5lckNvbmZpZyNjb21wb25lbnRzfSBzZXR0aW5nLCBvciBsYXRlclxuICogdGhyb3VnaCB0aGUge0BsaW5rIENvbnRhaW5lciNhZGRDb21wb25lbnR9IG1ldGhvZC4gVGhlIFVJTWFuYWdlciBhdXRvbWF0aWNhbGx5IHRha2VzIGNhcmUgb2YgYWxsIGNvbXBvbmVudHMsIGkuZS4gaXRcbiAqIGluaXRpYWxpemVzIGFuZCBjb25maWd1cmVzIHRoZW0gYXV0b21hdGljYWxseS5cbiAqXG4gKiBJbiB0aGUgRE9NLCB0aGUgY29udGFpbmVyIGNvbnNpc3RzIG9mIGFuIG91dGVyIDxkaXY+ICh0aGF0IGNhbiBiZSBjb25maWd1cmVkIGJ5IHRoZSBjb25maWcpIGFuZCBhbiBpbm5lciB3cmFwcGVyXG4gKiA8ZGl2PiB0aGF0IGNvbnRhaW5zIHRoZSBjb21wb25lbnRzLiBUaGlzIGRvdWJsZS08ZGl2Pi1zdHJ1Y3R1cmUgaXMgb2Z0ZW4gcmVxdWlyZWQgdG8gYWNoaWV2ZSBtYW55IGFkdmFuY2VkIGVmZmVjdHNcbiAqIGluIENTUyBhbmQvb3IgSlMsIGUuZy4gYW5pbWF0aW9ucyBhbmQgY2VydGFpbiBmb3JtYXR0aW5nIHdpdGggYWJzb2x1dGUgcG9zaXRpb25pbmcuXG4gKlxuICogRE9NIGV4YW1wbGU6XG4gKiA8Y29kZT5cbiAqICAgICA8ZGl2IGNsYXNzPSd1aS1jb250YWluZXInPlxuICogICAgICAgICA8ZGl2IGNsYXNzPSdjb250YWluZXItd3JhcHBlcic+XG4gKiAgICAgICAgICAgICAuLi4gY2hpbGQgY29tcG9uZW50cyAuLi5cbiAqICAgICAgICAgPC9kaXY+XG4gKiAgICAgPC9kaXY+XG4gKiA8L2NvZGU+XG4gKi9cbmV4cG9ydCBjbGFzcyBDb250YWluZXI8Q29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxDb250YWluZXJDb25maWc+IHtcblxuICAvKipcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIGlubmVyIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgY29tcG9uZW50cyBvZiB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBpbm5lckNvbnRhaW5lckVsZW1lbnQ6IERPTTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbnRhaW5lckNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNvbnRhaW5lcicsXG4gICAgICBjb21wb25lbnRzOiBbXVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY2hpbGQgY29tcG9uZW50IHRvIHRoZSBjb250YWluZXIuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCB0byBhZGRcbiAgICovXG4gIGFkZENvbXBvbmVudChjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSB7XG4gICAgdGhpcy5jb25maWcuY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNoaWxkIGNvbXBvbmVudCBmcm9tIHRoZSBjb250YWluZXIuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCB0byByZW1vdmVcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiByZW1vdmVkLCBmYWxzZSBpZiBpdCBpcyBub3QgY29udGFpbmVkIGluIHRoaXMgY29udGFpbmVyXG4gICAqL1xuICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmNvbmZpZy5jb21wb25lbnRzLCBjb21wb25lbnQpICE9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBhcnJheSBvZiBhbGwgY2hpbGQgY29tcG9uZW50cyBpbiB0aGlzIGNvbnRhaW5lci5cbiAgICogQHJldHVybnMge0NvbXBvbmVudDxDb21wb25lbnRDb25maWc+W119XG4gICAqL1xuICBnZXRDb21wb25lbnRzKCk6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+W10ge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5jb21wb25lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGNoaWxkIGNvbXBvbmVudHMgZnJvbSB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcmVtb3ZlQ29tcG9uZW50cygpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5nZXRDb21wb25lbnRzKCkpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIERPTSBvZiB0aGUgY29udGFpbmVyIHdpdGggdGhlIGN1cnJlbnQgY29tcG9uZW50cy5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVDb21wb25lbnRzKCk6IHZvaWQge1xuICAgIHRoaXMuaW5uZXJDb250YWluZXJFbGVtZW50LmVtcHR5KCk7XG5cbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5jb25maWcuY29tcG9uZW50cykge1xuICAgICAgdGhpcy5pbm5lckNvbnRhaW5lckVsZW1lbnQuYXBwZW5kKGNvbXBvbmVudC5nZXREb21FbGVtZW50KCkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICAvLyBDcmVhdGUgdGhlIGNvbnRhaW5lciBlbGVtZW50ICh0aGUgb3V0ZXIgPGRpdj4pXG4gICAgbGV0IGNvbnRhaW5lckVsZW1lbnQgPSBuZXcgRE9NKHRoaXMuY29uZmlnLnRhZywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKVxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBpbm5lciBjb250YWluZXIgZWxlbWVudCAodGhlIGlubmVyIDxkaXY+KSB0aGF0IHdpbGwgY29udGFpbiB0aGUgY29tcG9uZW50c1xuICAgIGxldCBpbm5lckNvbnRhaW5lciA9IG5ldyBET00odGhpcy5jb25maWcudGFnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnY29udGFpbmVyLXdyYXBwZXInKVxuICAgIH0pO1xuICAgIHRoaXMuaW5uZXJDb250YWluZXJFbGVtZW50ID0gaW5uZXJDb250YWluZXI7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcblxuICAgIGNvbnRhaW5lckVsZW1lbnQuYXBwZW5kKGlubmVyQ29udGFpbmVyKTtcblxuICAgIHJldHVybiBjb250YWluZXJFbGVtZW50O1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VUlVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtTcGFjZXJ9IGZyb20gJy4vc3BhY2VyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBDb250cm9sQmFyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250cm9sQmFyQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLy8gbm90aGluZyB5ZXRcbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBmb3IgbWFpbiBwbGF5ZXIgY29udHJvbCBjb21wb25lbnRzLCBlLmcuIHBsYXkgdG9nZ2xlIGJ1dHRvbiwgc2VlayBiYXIsIHZvbHVtZSBjb250cm9sLCBmdWxsc2NyZWVuIHRvZ2dsZVxuICogYnV0dG9uLlxuICovXG5leHBvcnQgY2xhc3MgQ29udHJvbEJhciBleHRlbmRzIENvbnRhaW5lcjxDb250cm9sQmFyQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb250cm9sQmFyQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY29udHJvbGJhcicsXG4gICAgICBoaWRkZW46IHRydWUsXG4gICAgfSwgPENvbnRyb2xCYXJDb25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICAvLyBDb3VudHMgaG93IG1hbnkgY29tcG9uZW50cyBhcmUgaG92ZXJlZCBhbmQgYmxvY2sgaGlkaW5nIG9mIHRoZSBjb250cm9sIGJhclxuICAgIGxldCBob3ZlclN0YWNrQ291bnQgPSAwO1xuXG4gICAgLy8gVHJhY2sgaG92ZXIgc3RhdHVzIG9mIGNoaWxkIGNvbXBvbmVudHNcbiAgICBVSVV0aWxzLnRyYXZlcnNlVHJlZSh0aGlzLCAoY29tcG9uZW50KSA9PiB7XG4gICAgICAvLyBEbyBub3QgdHJhY2sgaG92ZXIgc3RhdHVzIG9mIGNoaWxkIGNvbnRhaW5lcnMgb3Igc3BhY2Vycywgb25seSBvZiAncmVhbCcgY29udHJvbHNcbiAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb250YWluZXIgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgU3BhY2VyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gU3Vic2NyaWJlIGhvdmVyIGV2ZW50IGFuZCBrZWVwIGEgY291bnQgb2YgdGhlIG51bWJlciBvZiBob3ZlcmVkIGNoaWxkcmVuXG4gICAgICBjb21wb25lbnQub25Ib3ZlckNoYW5nZWQuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGFyZ3MuaG92ZXJlZCkge1xuICAgICAgICAgIGhvdmVyU3RhY2tDb3VudCsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhvdmVyU3RhY2tDb3VudC0tO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzU2hvdy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uUHJldmlld0NvbnRyb2xzSGlkZS5zdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xuICAgICAgLy8gQ2FuY2VsIHRoZSBoaWRlIGV2ZW50IGlmIGhvdmVyZWQgY2hpbGQgY29tcG9uZW50cyBibG9jayBoaWRpbmdcbiAgICAgIGFyZ3MuY2FuY2VsID0gKGhvdmVyU3RhY2tDb3VudCA+IDApO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lckNvbmZpZywgQ29udGFpbmVyfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IEVycm9yRXZlbnQgPSBiaXRtb3Zpbi5wbGF5ZXIuRXJyb3JFdmVudDtcbmltcG9ydCB7VHZOb2lzZUNhbnZhc30gZnJvbSAnLi90dm5vaXNlY2FudmFzJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLnBsYXllci5QbGF5ZXJFdmVudDtcblxuZXhwb3J0IGludGVyZmFjZSBFcnJvck1lc3NhZ2VUcmFuc2xhdG9yIHtcbiAgKGVycm9yOiBFcnJvckV2ZW50KTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yTWVzc2FnZU1hcCB7XG4gIFtjb2RlOiBudW1iZXJdOiBzdHJpbmcgfCBFcnJvck1lc3NhZ2VUcmFuc2xhdG9yO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIEVycm9yTWVzc2FnZU92ZXJsYXl9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yTWVzc2FnZU92ZXJsYXlDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogQWxsb3dzIG92ZXJ3cml0aW5nIG9mIHRoZSBlcnJvciBtZXNzYWdlcyBkaXNwbGF5ZWQgaW4gdGhlIG92ZXJsYXkgZm9yIGN1c3RvbWl6YXRpb24gYW5kIGxvY2FsaXphdGlvbi5cbiAgICogVGhpcyBpcyBlaXRoZXIgYSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGFueSB7QGxpbmsgRXJyb3JFdmVudH0gYXMgcGFyYW1ldGVyIGFuZCB0cmFuc2xhdGVzIGVycm9yIG1lc3NhZ2VzLFxuICAgKiBvciBhIG1hcCBvZiBlcnJvciBjb2RlcyB0aGF0IG92ZXJ3cml0ZXMgc3BlY2lmaWMgZXJyb3IgbWVzc2FnZXMgd2l0aCBhIHBsYWluIHN0cmluZyBvciBhIGZ1bmN0aW9uIHRoYXRcbiAgICogcmVjZWl2ZXMgdGhlIHtAbGluayBFcnJvckV2ZW50fSBhcyBwYXJhbWV0ZXIgYW5kIHJldHVybnMgYSBjdXN0b21pemVkIHN0cmluZy5cbiAgICogVGhlIHRyYW5zbGF0aW9uIGZ1bmN0aW9ucyBjYW4gYmUgdXNlZCB0byBleHRyYWN0IGRhdGEgKGUuZy4gcGFyYW1ldGVycykgZnJvbSB0aGUgb3JpZ2luYWwgZXJyb3IgbWVzc2FnZS5cbiAgICpcbiAgICogRXhhbXBsZSAxIChjYXRjaC1hbGwgdHJhbnNsYXRpb24gZnVuY3Rpb24pOlxuICAgKiA8Y29kZT5cbiAgICogZXJyb3JNZXNzYWdlT3ZlcmxheUNvbmZpZyA9IHtcbiAgICogICBtZXNzYWdlczogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgIHN3aXRjaCAoZXJyb3IuY29kZSkge1xuICAgKiAgICAgICAvLyBPdmVyd3JpdGUgZXJyb3IgMzAwMCAnVW5rbm93biBlcnJvcidcbiAgICogICAgICAgY2FzZSAzMDAwOlxuICAgKiAgICAgICAgIHJldHVybiAnSG91c3Rvbiwgd2UgaGF2ZSBhIHByb2JsZW0nXG4gICAqXG4gICAqICAgICAgIC8vIFRyYW5zZm9ybSBlcnJvciAzMDAxICdVbnN1cHBvcnRlZCBtYW5pZmVzdCBmb3JtYXQnIHRvIHVwcGVyY2FzZVxuICAgKiAgICAgICBjYXNlIDMwMDE6XG4gICAqICAgICAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2UudG9VcHBlckNhc2UoKTtcbiAgICpcbiAgICogICAgICAgLy8gQ3VzdG9taXplIGVycm9yIDMwMDYgJ0NvdWxkIG5vdCBsb2FkIG1hbmlmZXN0LCBnb3QgSFRUUCBzdGF0dXMgY29kZSBYWFgnXG4gICAqICAgICAgIGNhc2UgMzAwNjpcbiAgICogICAgICAgICB2YXIgc3RhdHVzQ29kZSA9IGVycm9yLm1lc3NhZ2Uuc3Vic3RyaW5nKDQ2KTtcbiAgICogICAgICAgICByZXR1cm4gJ01hbmlmZXN0IGxvYWRpbmcgZmFpbGVkIHdpdGggSFRUUCBlcnJvciAnICsgc3RhdHVzQ29kZTtcbiAgICogICAgIH1cbiAgICogICAgIC8vIFJldHVybiB1bm1vZGlmaWVkIGVycm9yIG1lc3NhZ2UgZm9yIGFsbCBvdGhlciBlcnJvcnNcbiAgICogICAgIHJldHVybiBlcnJvci5tZXNzYWdlO1xuICAgKiAgIH1cbiAgICogfTtcbiAgICogPC9jb2RlPlxuICAgKlxuICAgKiBFeGFtcGxlIDIgKHRyYW5zbGF0aW5nIHNwZWNpZmljIGVycm9ycyk6XG4gICAqIDxjb2RlPlxuICAgKiBlcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnID0ge1xuICAgKiAgIG1lc3NhZ2VzOiB7XG4gICAqICAgICAvLyBPdmVyd3JpdGUgZXJyb3IgMzAwMCAnVW5rbm93biBlcnJvcidcbiAgICogICAgIDMwMDA6ICdIb3VzdG9uLCB3ZSBoYXZlIGEgcHJvYmxlbScsXG4gICAqXG4gICAqICAgICAvLyBUcmFuc2Zvcm0gZXJyb3IgMzAwMSAnVW5zdXBwb3J0ZWQgbWFuaWZlc3QgZm9ybWF0JyB0byB1cHBlcmNhc2VcbiAgICogICAgIDMwMDE6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAgIHJldHVybiBlcnJvci5tZXNzYWdlLnRvVXBwZXJDYXNlKCk7XG4gICAqICAgICB9LFxuICAgKlxuICAgKiAgICAgLy8gQ3VzdG9taXplIGVycm9yIDMwMDYgJ0NvdWxkIG5vdCBsb2FkIG1hbmlmZXN0LCBnb3QgSFRUUCBzdGF0dXMgY29kZSBYWFgnXG4gICAqICAgICAzMDA2OiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICB2YXIgc3RhdHVzQ29kZSA9IGVycm9yLm1lc3NhZ2Uuc3Vic3RyaW5nKDQ2KTtcbiAgICogICAgICAgcmV0dXJuICdNYW5pZmVzdCBsb2FkaW5nIGZhaWxlZCB3aXRoIEhUVFAgZXJyb3IgJyArIHN0YXR1c0NvZGU7XG4gICAqICAgICB9XG4gICAqICAgfVxuICAgKiB9O1xuICAgKiA8L2NvZGU+XG4gICAqL1xuICBtZXNzYWdlcz86IEVycm9yTWVzc2FnZU1hcCB8IEVycm9yTWVzc2FnZVRyYW5zbGF0b3I7XG59XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgZXJyb3IgbWVzc2FnZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBFcnJvck1lc3NhZ2VPdmVybGF5IGV4dGVuZHMgQ29udGFpbmVyPEVycm9yTWVzc2FnZU92ZXJsYXlDb25maWc+IHtcblxuICBwcml2YXRlIGVycm9yTGFiZWw6IExhYmVsPExhYmVsQ29uZmlnPjtcbiAgcHJpdmF0ZSB0dk5vaXNlQmFja2dyb3VuZDogVHZOb2lzZUNhbnZhcztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEVycm9yTWVzc2FnZU92ZXJsYXlDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmVycm9yTGFiZWwgPSBuZXcgTGFiZWw8TGFiZWxDb25maWc+KHsgY3NzQ2xhc3M6ICd1aS1lcnJvcm1lc3NhZ2UtbGFiZWwnIH0pO1xuICAgIHRoaXMudHZOb2lzZUJhY2tncm91bmQgPSBuZXcgVHZOb2lzZUNhbnZhcygpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1lcnJvcm1lc3NhZ2Utb3ZlcmxheScsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy50dk5vaXNlQmFja2dyb3VuZCwgdGhpcy5lcnJvckxhYmVsXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9FUlJPUiwgKGV2ZW50OiBFcnJvckV2ZW50KSA9PiB7XG4gICAgICBsZXQgbWVzc2FnZSA9IGV2ZW50Lm1lc3NhZ2U7XG5cbiAgICAgIC8vIFByb2Nlc3MgbWVzc2FnZSB0cmFuc2xhdGlvbnNcbiAgICAgIGlmIChjb25maWcubWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcubWVzc2FnZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAvLyBUcmFuc2xhdGlvbiBmdW5jdGlvbiBmb3IgYWxsIGVycm9yc1xuICAgICAgICAgIG1lc3NhZ2UgPSBjb25maWcubWVzc2FnZXMoZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5tZXNzYWdlc1tldmVudC5jb2RlXSkge1xuICAgICAgICAgIC8vIEl0J3Mgbm90IGEgdHJhbnNsYXRpb24gZnVuY3Rpb24sIHNvIGl0IG11c3QgYmUgYSBtYXAgb2Ygc3RyaW5ncyBvciB0cmFuc2xhdGlvbiBmdW5jdGlvbnNcbiAgICAgICAgICBsZXQgY3VzdG9tTWVzc2FnZSA9IGNvbmZpZy5tZXNzYWdlc1tldmVudC5jb2RlXTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgY3VzdG9tTWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBjdXN0b21NZXNzYWdlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaGUgbWVzc2FnZSBpcyBhIHRyYW5zbGF0aW9uIGZ1bmN0aW9uLCBzbyB3ZSBjYWxsIGl0XG4gICAgICAgICAgICBtZXNzYWdlID0gY3VzdG9tTWVzc2FnZShldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZXJyb3JMYWJlbC5zZXRUZXh0KG1lc3NhZ2UpO1xuICAgICAgdGhpcy50dk5vaXNlQmFja2dyb3VuZC5zdGFydCgpO1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfTE9BREVELCAoZXZlbnQ6IFBsYXllckV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgdGhpcy50dk5vaXNlQmFja2dyb3VuZC5zdG9wKCk7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIHBsYXllciBiZXR3ZWVuIHdpbmRvd2VkIGFuZCBmdWxsc2NyZWVuIHZpZXcuXG4gKi9cbmV4cG9ydCBjbGFzcyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1mdWxsc2NyZWVudG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdGdWxsc2NyZWVuJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGZ1bGxzY3JlZW5TdGF0ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICAgIHRoaXMub24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub2ZmKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRU5URVIsIGZ1bGxzY3JlZW5TdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRVhJVCwgZnVsbHNjcmVlblN0YXRlSGFuZGxlcik7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNGdWxsc2NyZWVuKCkpIHtcbiAgICAgICAgcGxheWVyLmV4aXRGdWxsc2NyZWVuKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIuZW50ZXJGdWxsc2NyZWVuKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBmdWxsc2NyZWVuU3RhdGVIYW5kbGVyKCk7XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtQbGF5YmFja1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9wbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyRXZlbnQ7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCBvdmVybGF5cyB0aGUgdmlkZW8gYW5kIHRvZ2dsZXMgYmV0d2VlbiBwbGF5YmFjayBhbmQgcGF1c2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24gZXh0ZW5kcyBQbGF5YmFja1RvZ2dsZUJ1dHRvbiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWh1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnUGxheS9QYXVzZSdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgLy8gVXBkYXRlIGJ1dHRvbiBzdGF0ZSB0aHJvdWdoIEFQSSBldmVudHNcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIsIGZhbHNlKTtcblxuICAgIGxldCB0b2dnbGVQbGF5YmFjayA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgICAgcGxheWVyLnBhdXNlKCd1aS1vdmVybGF5Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIucGxheSgndWktb3ZlcmxheScpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdG9nZ2xlRnVsbHNjcmVlbiA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNGdWxsc2NyZWVuKCkpIHtcbiAgICAgICAgcGxheWVyLmV4aXRGdWxsc2NyZWVuKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIuZW50ZXJGdWxsc2NyZWVuKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCBmaXJzdFBsYXkgPSB0cnVlO1xuICAgIGxldCBjbGlja1RpbWUgPSAwO1xuICAgIGxldCBkb3VibGVDbGlja1RpbWUgPSAwO1xuXG4gICAgLypcbiAgICAgKiBZb3VUdWJlLXN0eWxlIHRvZ2dsZSBidXR0b24gaGFuZGxpbmdcbiAgICAgKlxuICAgICAqIFRoZSBnb2FsIGlzIHRvIHByZXZlbnQgYSBzaG9ydCBwYXVzZSBvciBwbGF5YmFjayBpbnRlcnZhbCBiZXR3ZWVuIGEgY2xpY2ssIHRoYXQgdG9nZ2xlcyBwbGF5YmFjaywgYW5kIGFcbiAgICAgKiBkb3VibGUgY2xpY2ssIHRoYXQgdG9nZ2xlcyBmdWxsc2NyZWVuLiBJbiB0aGlzIG5haXZlIGFwcHJvYWNoLCB0aGUgZmlyc3QgY2xpY2sgd291bGQgZS5nLiBzdGFydCBwbGF5YmFjayxcbiAgICAgKiB0aGUgc2Vjb25kIGNsaWNrIHdvdWxkIGJlIGRldGVjdGVkIGFzIGRvdWJsZSBjbGljayBhbmQgdG9nZ2xlIHRvIGZ1bGxzY3JlZW4sIGFuZCBhcyBzZWNvbmQgbm9ybWFsIGNsaWNrIHN0b3BcbiAgICAgKiBwbGF5YmFjaywgd2hpY2ggcmVzdWx0cyBpcyBhIHNob3J0IHBsYXliYWNrIGludGVydmFsIHdpdGggbWF4IGxlbmd0aCBvZiB0aGUgZG91YmxlIGNsaWNrIGRldGVjdGlvblxuICAgICAqIHBlcmlvZCAodXN1YWxseSA1MDBtcykuXG4gICAgICpcbiAgICAgKiBUbyBzb2x2ZSB0aGlzIGlzc3VlLCB3ZSBkZWZlciBoYW5kbGluZyBvZiB0aGUgZmlyc3QgY2xpY2sgZm9yIDIwMG1zLCB3aGljaCBpcyBhbG1vc3QgdW5ub3RpY2VhYmxlIHRvIHRoZSB1c2VyLFxuICAgICAqIGFuZCBqdXN0IHRvZ2dsZSBwbGF5YmFjayBpZiBubyBzZWNvbmQgY2xpY2sgKGRvdWJsZSBjbGljaykgaGFzIGJlZW4gcmVnaXN0ZXJlZCBkdXJpbmcgdGhpcyBwZXJpb2QuIElmIGEgZG91YmxlXG4gICAgICogY2xpY2sgaXMgcmVnaXN0ZXJlZCwgd2UganVzdCB0b2dnbGUgdGhlIGZ1bGxzY3JlZW4uIEluIHRoZSBmaXJzdCAyMDBtcywgdW5kZXNpcmVkIHBsYXliYWNrIGNoYW5nZXMgdGh1cyBjYW5ub3RcbiAgICAgKiBoYXBwZW4uIElmIGEgZG91YmxlIGNsaWNrIGlzIHJlZ2lzdGVyZWQgd2l0aGluIDUwMG1zLCB3ZSB1bmRvIHRoZSBwbGF5YmFjayBjaGFuZ2UgYW5kIHN3aXRjaCBmdWxsc2NyZWVuIG1vZGUuXG4gICAgICogSW4gdGhlIGVuZCwgdGhpcyBtZXRob2QgYmFzaWNhbGx5IGludHJvZHVjZXMgYSAyMDBtcyBvYnNlcnZpbmcgaW50ZXJ2YWwgaW4gd2hpY2ggcGxheWJhY2sgY2hhbmdlcyBhcmUgcHJldmVudGVkXG4gICAgICogaWYgYSBkb3VibGUgY2xpY2sgaGFwcGVucy5cbiAgICAgKi9cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIERpcmVjdGx5IHN0YXJ0IHBsYXliYWNrIG9uIGZpcnN0IGNsaWNrIG9mIHRoZSBidXR0b24uXG4gICAgICAvLyBUaGlzIGlzIGEgcmVxdWlyZWQgd29ya2Fyb3VuZCBmb3IgbW9iaWxlIGJyb3dzZXJzIHdoZXJlIHZpZGVvIHBsYXliYWNrIG5lZWRzIHRvIGJlIHRyaWdnZXJlZCBkaXJlY3RseVxuICAgICAgLy8gYnkgdGhlIHVzZXIuIEEgZGVmZXJyZWQgcGxheWJhY2sgc3RhcnQgdGhyb3VnaCB0aGUgdGltZW91dCBiZWxvdyBpcyBub3QgY29uc2lkZXJlZCBhcyB1c2VyIGFjdGlvbiBhbmRcbiAgICAgIC8vIHRoZXJlZm9yZSBpZ25vcmVkIGJ5IG1vYmlsZSBicm93c2Vycy5cbiAgICAgIGlmIChmaXJzdFBsYXkpIHtcbiAgICAgICAgLy8gVHJ5IHRvIHN0YXJ0IHBsYXliYWNrLiBUaGVuIHdlIHdhaXQgZm9yIE9OX1BMQVkgYW5kIG9ubHkgd2hlbiBpdCBhcnJpdmVzLCB3ZSBkaXNhYmxlIHRoZSBmaXJzdFBsYXkgZmxhZy5cbiAgICAgICAgLy8gSWYgd2UgZGlzYWJsZSB0aGUgZmxhZyBoZXJlLCBvbkNsaWNrIHdhcyB0cmlnZ2VyZWQgcHJvZ3JhbW1hdGljYWxseSBpbnN0ZWFkIG9mIGJ5IGEgdXNlciBpbnRlcmFjdGlvbiwgYW5kXG4gICAgICAgIC8vIHBsYXliYWNrIGlzIGJsb2NrZWQgKGUuZy4gb24gbW9iaWxlIGRldmljZXMgZHVlIHRvIHRoZSBwcm9ncmFtbWF0aWMgcGxheSgpIGNhbGwpLCB3ZSBsb29zZSB0aGUgY2hhbmNlIHRvXG4gICAgICAgIC8vIGV2ZXIgc3RhcnQgcGxheWJhY2sgdGhyb3VnaCBhIHVzZXIgaW50ZXJhY3Rpb24gYWdhaW4gd2l0aCB0aGlzIGJ1dHRvbi5cbiAgICAgICAgdG9nZ2xlUGxheWJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgICAgaWYgKG5vdyAtIGNsaWNrVGltZSA8IDIwMCkge1xuICAgICAgICAvLyBXZSBoYXZlIGEgZG91YmxlIGNsaWNrIGluc2lkZSB0aGUgMjAwbXMgaW50ZXJ2YWwsIGp1c3QgdG9nZ2xlIGZ1bGxzY3JlZW4gbW9kZVxuICAgICAgICB0b2dnbGVGdWxsc2NyZWVuKCk7XG4gICAgICAgIGRvdWJsZUNsaWNrVGltZSA9IG5vdztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChub3cgLSBjbGlja1RpbWUgPCA1MDApIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBhIGRvdWJsZSBjbGljayBpbnNpZGUgdGhlIDUwMG1zIGludGVydmFsLCB1bmRvIHBsYXliYWNrIHRvZ2dsZSBhbmQgdG9nZ2xlIGZ1bGxzY3JlZW4gbW9kZVxuICAgICAgICB0b2dnbGVGdWxsc2NyZWVuKCk7XG4gICAgICAgIHRvZ2dsZVBsYXliYWNrKCk7XG4gICAgICAgIGRvdWJsZUNsaWNrVGltZSA9IG5vdztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjbGlja1RpbWUgPSBub3c7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIGRvdWJsZUNsaWNrVGltZSA+IDIwMCkge1xuICAgICAgICAgIC8vIE5vIGRvdWJsZSBjbGljayBkZXRlY3RlZCwgc28gd2UgdG9nZ2xlIHBsYXliYWNrIGFuZCB3YWl0IHdoYXQgaGFwcGVucyBuZXh0XG4gICAgICAgICAgdG9nZ2xlUGxheWJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfSwgMjAwKTtcbiAgICB9KTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVksICgpID0+IHtcbiAgICAgIC8vIFBsYXliYWNrIGhhcyByZWFsbHkgc3RhcnRlZCwgd2UgY2FuIGRpc2FibGUgdGhlIGZsYWcgdG8gc3dpdGNoIHRvIG5vcm1hbCB0b2dnbGUgYnV0dG9uIGhhbmRsaW5nXG4gICAgICBmaXJzdFBsYXkgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIC8vIEhpZGUgYnV0dG9uIHdoaWxlIGluaXRpYWxpemluZyBhIENhc3Qgc2Vzc2lvblxuICAgIGxldCBjYXN0SW5pdGlhbGl6YXRpb25IYW5kbGVyID0gKGV2ZW50OiBQbGF5ZXJFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJUKSB7XG4gICAgICAgIC8vIEhpZGUgYnV0dG9uIHdoZW4gc2Vzc2lvbiBpcyBiZWluZyBpbml0aWFsaXplZFxuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNob3cgYnV0dG9uIHdoZW4gc2Vzc2lvbiBpcyBlc3RhYmxpc2hlZCBvciBpbml0aWFsaXphdGlvbiB3YXMgYWJvcnRlZFxuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlQsIGNhc3RJbml0aWFsaXphdGlvbkhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlRFRCwgY2FzdEluaXRpYWxpemF0aW9uSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVE9QUEVELCBjYXN0SW5pdGlhbGl6YXRpb25IYW5kbGVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBsZXQgYnV0dG9uRWxlbWVudCA9IHN1cGVyLnRvRG9tRWxlbWVudCgpO1xuXG4gICAgLy8gQWRkIGNoaWxkIHRoYXQgY29udGFpbnMgdGhlIHBsYXkgYnV0dG9uIGltYWdlXG4gICAgLy8gU2V0dGluZyB0aGUgaW1hZ2UgZGlyZWN0bHkgb24gdGhlIGJ1dHRvbiBkb2VzIG5vdCB3b3JrIHRvZ2V0aGVyIHdpdGggc2NhbGluZyBhbmltYXRpb25zLCBiZWNhdXNlIHRoZSBidXR0b25cbiAgICAvLyBjYW4gY292ZXIgdGhlIHdob2xlIHZpZGVvIHBsYXllciBhcmUgYW5kIHNjYWxpbmcgd291bGQgZXh0ZW5kIGl0IGJleW9uZC4gQnkgYWRkaW5nIGFuIGlubmVyIGVsZW1lbnQsIGNvbmZpbmVkXG4gICAgLy8gdG8gdGhlIHNpemUgaWYgdGhlIGltYWdlLCBpdCBjYW4gc2NhbGUgaW5zaWRlIHRoZSBwbGF5ZXIgd2l0aG91dCBvdmVyc2hvb3RpbmcuXG4gICAgYnV0dG9uRWxlbWVudC5hcHBlbmQobmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2ltYWdlJylcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gYnV0dG9uRWxlbWVudDtcbiAgfVxufSIsImltcG9ydCB7QnV0dG9uQ29uZmlnLCBCdXR0b259IGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLnBsYXllci5QbGF5ZXJFdmVudDtcblxuLyoqXG4gKiBBIGJ1dHRvbiB0byBwbGF5L3JlcGxheSBhIHZpZGVvLlxuICovXG5leHBvcnQgY2xhc3MgSHVnZVJlcGxheUJ1dHRvbiBleHRlbmRzIEJ1dHRvbjxCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktaHVnZXJlcGxheWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnUmVwbGF5J1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBwbGF5ZXIucGxheSgndWktb3ZlcmxheScpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGxldCBidXR0b25FbGVtZW50ID0gc3VwZXIudG9Eb21FbGVtZW50KCk7XG5cbiAgICAvLyBBZGQgY2hpbGQgdGhhdCBjb250YWlucyB0aGUgcGxheSBidXR0b24gaW1hZ2VcbiAgICAvLyBTZXR0aW5nIHRoZSBpbWFnZSBkaXJlY3RseSBvbiB0aGUgYnV0dG9uIGRvZXMgbm90IHdvcmsgdG9nZXRoZXIgd2l0aCBzY2FsaW5nIGFuaW1hdGlvbnMsIGJlY2F1c2UgdGhlIGJ1dHRvblxuICAgIC8vIGNhbiBjb3ZlciB0aGUgd2hvbGUgdmlkZW8gcGxheWVyIGFyZSBhbmQgc2NhbGluZyB3b3VsZCBleHRlbmQgaXQgYmV5b25kLiBCeSBhZGRpbmcgYW4gaW5uZXIgZWxlbWVudCwgY29uZmluZWRcbiAgICAvLyB0byB0aGUgc2l6ZSBpZiB0aGUgaW1hZ2UsIGl0IGNhbiBzY2FsZSBpbnNpZGUgdGhlIHBsYXllciB3aXRob3V0IG92ZXJzaG9vdGluZy5cbiAgICBidXR0b25FbGVtZW50LmFwcGVuZChuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnaW1hZ2UnKVxuICAgIH0pKTtcblxuICAgIHJldHVybiBidXR0b25FbGVtZW50O1xuICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnRDb25maWcsIENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgRXZlbnQsIE5vQXJnc30gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgTGFiZWx9IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYWJlbENvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdGV4dCBvbiB0aGUgbGFiZWwuXG4gICAqL1xuICB0ZXh0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgc2ltcGxlIHRleHQgbGFiZWwuXG4gKlxuICogRE9NIGV4YW1wbGU6XG4gKiA8Y29kZT5cbiAqICAgICA8c3BhbiBjbGFzcz0ndWktbGFiZWwnPi4uLnNvbWUgdGV4dC4uLjwvc3Bhbj5cbiAqIDwvY29kZT5cbiAqL1xuZXhwb3J0IGNsYXNzIExhYmVsPENvbmZpZyBleHRlbmRzIExhYmVsQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxMYWJlbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgdGV4dDogc3RyaW5nO1xuXG4gIHByaXZhdGUgbGFiZWxFdmVudHMgPSB7XG4gICAgb25DbGljazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMYWJlbDxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25UZXh0Q2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMYWJlbDxDb25maWc+LCBzdHJpbmc+KCksXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktbGFiZWwnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy50ZXh0ID0gdGhpcy5jb25maWcudGV4dDtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBsZXQgbGFiZWxFbGVtZW50ID0gbmV3IERPTSgnc3BhbicsIHtcbiAgICAgICdpZCc6IHRoaXMuY29uZmlnLmlkLFxuICAgICAgJ2NsYXNzJzogdGhpcy5nZXRDc3NDbGFzc2VzKClcbiAgICB9KS5odG1sKHRoaXMudGV4dCk7XG5cbiAgICBsYWJlbEVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkNsaWNrRXZlbnQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsYWJlbEVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSB0ZXh0IG9uIHRoaXMgbGFiZWwuXG4gICAqIEBwYXJhbSB0ZXh0XG4gICAqL1xuICBzZXRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy5nZXREb21FbGVtZW50KCkuaHRtbCh0ZXh0KTtcbiAgICB0aGlzLm9uVGV4dENoYW5nZWRFdmVudCh0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB0ZXh0IG9uIHRoaXMgbGFiZWwuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRleHQgb24gdGhlIGxhYmVsXG4gICAqL1xuICBnZXRUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIHRleHQgb24gdGhpcyBsYWJlbC5cbiAgICovXG4gIGNsZWFyVGV4dCgpIHtcbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5odG1sKCcnKTtcbiAgICB0aGlzLm9uVGV4dENoYW5nZWRFdmVudChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiB0aGUgbGFiZWwgaXMgZW1wdHkgYW5kIGRvZXMgbm90IGNvbnRhaW4gYW55IHRleHQuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIGxhYmVsIGlzIGVtcHR5LCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy50ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSB7QGxpbmsgI29uQ2xpY2t9IGV2ZW50LlxuICAgKiBDYW4gYmUgdXNlZCBieSBzdWJjbGFzc2VzIHRvIGxpc3RlbiB0byB0aGlzIGV2ZW50IHdpdGhvdXQgc3Vic2NyaWJpbmcgYW4gZXZlbnQgbGlzdGVuZXIgYnkgb3ZlcndyaXRpbmcgdGhlIG1ldGhvZFxuICAgKiBhbmQgY2FsbGluZyB0aGUgc3VwZXIgbWV0aG9kLlxuICAgKi9cbiAgcHJvdGVjdGVkIG9uQ2xpY2tFdmVudCgpIHtcbiAgICB0aGlzLmxhYmVsRXZlbnRzLm9uQ2xpY2suZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgdGhlIHtAbGluayAjb25DbGlja30gZXZlbnQuXG4gICAqIENhbiBiZSB1c2VkIGJ5IHN1YmNsYXNzZXMgdG8gbGlzdGVuIHRvIHRoaXMgZXZlbnQgd2l0aG91dCBzdWJzY3JpYmluZyBhbiBldmVudCBsaXN0ZW5lciBieSBvdmVyd3JpdGluZyB0aGUgbWV0aG9kXG4gICAqIGFuZCBjYWxsaW5nIHRoZSBzdXBlciBtZXRob2QuXG4gICAqL1xuICBwcm90ZWN0ZWQgb25UZXh0Q2hhbmdlZEV2ZW50KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMubGFiZWxFdmVudHMub25UZXh0Q2hhbmdlZC5kaXNwYXRjaCh0aGlzLCB0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGxhYmVsIGlzIGNsaWNrZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25DbGljaygpOiBFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmxhYmVsRXZlbnRzLm9uQ2xpY2suZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIHRleHQgb24gdGhlIGxhYmVsIGlzIGNoYW5nZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25UZXh0Q2hhbmdlZCgpOiBFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmxhYmVsRXZlbnRzLm9uVGV4dENoYW5nZWQuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCB7QXJyYXlVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIEEgbWFwIG9mIGl0ZW1zIChrZXkvdmFsdWUgLT4gbGFiZWx9IGZvciBhIHtAbGluayBMaXN0U2VsZWN0b3J9IGluIGEge0BsaW5rIExpc3RTZWxlY3RvckNvbmZpZ30uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdEl0ZW0ge1xuICBrZXk6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgTGlzdFNlbGVjdG9yfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaXN0U2VsZWN0b3JDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICBpdGVtcz86IExpc3RJdGVtW107XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMaXN0U2VsZWN0b3I8Q29uZmlnIGV4dGVuZHMgTGlzdFNlbGVjdG9yQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxMaXN0U2VsZWN0b3JDb25maWc+IHtcblxuICBwcm90ZWN0ZWQgaXRlbXM6IExpc3RJdGVtW107XG4gIHByb3RlY3RlZCBzZWxlY3RlZEl0ZW06IHN0cmluZztcblxuICBwcml2YXRlIGxpc3RTZWxlY3RvckV2ZW50cyA9IHtcbiAgICBvbkl0ZW1BZGRlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPigpLFxuICAgIG9uSXRlbVJlbW92ZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4oKSxcbiAgICBvbkl0ZW1TZWxlY3RlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPigpXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMaXN0U2VsZWN0b3JDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBpdGVtczogW10sXG4gICAgICBjc3NDbGFzczogJ3VpLWxpc3RzZWxlY3RvcidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG5cbiAgICB0aGlzLml0ZW1zID0gdGhpcy5jb25maWcuaXRlbXM7XG4gIH1cblxuICBwcml2YXRlIGdldEl0ZW1JbmRleChrZXk6IHN0cmluZyk6IG51bWJlciB7XG4gICAgZm9yIChsZXQgaW5kZXggaW4gdGhpcy5pdGVtcykge1xuICAgICAgaWYgKGtleSA9PT0gdGhpcy5pdGVtc1tpbmRleF0ua2V5KSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChpbmRleCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCBpdGVtIGlzIHBhcnQgb2YgdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIGNoZWNrXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBpdGVtIGlzIHBhcnQgb2YgdGhpcyBzZWxlY3RvciwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaGFzSXRlbShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW1JbmRleChrZXkpID4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpdGVtIHRvIHRoaXMgc2VsZWN0b3IgYnkgYXBwZW5kaW5nIGl0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgaXRlbXMuIElmIGFuIGl0ZW0gd2l0aCB0aGUgc3BlY2lmaWVkXG4gICAqIGtleSBhbHJlYWR5IGV4aXN0cywgaXQgaXMgcmVwbGFjZWQuXG4gICAqIEBwYXJhbSBrZXkgdGhlIGtleSBvZiB0aGUgaXRlbSB0byBhZGRcbiAgICogQHBhcmFtIGxhYmVsIHRoZSAoaHVtYW4tcmVhZGFibGUpIGxhYmVsIG9mIHRoZSBpdGVtIHRvIGFkZFxuICAgKi9cbiAgYWRkSXRlbShrZXk6IHN0cmluZywgbGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMucmVtb3ZlSXRlbShrZXkpOyAvLyBUcnkgdG8gcmVtb3ZlIGtleSBmaXJzdCB0byBnZXQgb3ZlcndyaXRlIGJlaGF2aW9yIGFuZCBhdm9pZCBkdXBsaWNhdGUga2V5c1xuICAgIHRoaXMuaXRlbXMucHVzaCh7IGtleToga2V5LCBsYWJlbDogbGFiZWwgfSk7XG4gICAgdGhpcy5vbkl0ZW1BZGRlZEV2ZW50KGtleSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiByZW1vdmFsIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBpZiB0aGUgaXRlbSBpcyBub3QgcGFydCBvZiB0aGlzIHNlbGVjdG9yXG4gICAqL1xuICByZW1vdmVJdGVtKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoa2V5KTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgQXJyYXlVdGlscy5yZW1vdmUodGhpcy5pdGVtcywgdGhpcy5pdGVtc1tpbmRleF0pO1xuICAgICAgdGhpcy5vbkl0ZW1SZW1vdmVkRXZlbnQoa2V5KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGFuIGl0ZW0gZnJvbSB0aGUgaXRlbXMgaW4gdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpcyB0aGUgc2VsZWN0aW9uIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBpZiB0aGUgc2VsZWN0ZWQgaXRlbSBpcyBub3QgcGFydCBvZiB0aGUgc2VsZWN0b3JcbiAgICovXG4gIHNlbGVjdEl0ZW0oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoa2V5ID09PSB0aGlzLnNlbGVjdGVkSXRlbSkge1xuICAgICAgLy8gaXRlbUNvbmZpZyBpcyBhbHJlYWR5IHNlbGVjdGVkLCBzdXBwcmVzcyBhbnkgZnVydGhlciBhY3Rpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGtleSk7XG5cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSBrZXk7XG4gICAgICB0aGlzLm9uSXRlbVNlbGVjdGVkRXZlbnQoa2V5KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBrZXkgb2YgdGhlIHNlbGVjdGVkIGl0ZW0uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBrZXkgb2YgdGhlIHNlbGVjdGVkIGl0ZW0gb3IgbnVsbCBpZiBubyBpdGVtIGlzIHNlbGVjdGVkXG4gICAqL1xuICBnZXRTZWxlY3RlZEl0ZW0oKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGl0ZW1zIGZyb20gdGhpcyBzZWxlY3Rvci5cbiAgICovXG4gIGNsZWFySXRlbXMoKSB7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtczsgLy8gbG9jYWwgY29weSBmb3IgaXRlcmF0aW9uIGFmdGVyIGNsZWFyXG4gICAgdGhpcy5pdGVtcyA9IFtdOyAvLyBjbGVhciBpdGVtc1xuXG4gICAgLy8gZmlyZSBldmVudHNcbiAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICB0aGlzLm9uSXRlbVJlbW92ZWRFdmVudChpdGVtLmtleSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGlzIHNlbGVjdG9yLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgaXRlbUNvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1BZGRlZEV2ZW50KGtleTogc3RyaW5nKSB7XG4gICAgdGhpcy5saXN0U2VsZWN0b3JFdmVudHMub25JdGVtQWRkZWQuZGlzcGF0Y2godGhpcywga2V5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1SZW1vdmVkRXZlbnQoa2V5OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1SZW1vdmVkLmRpc3BhdGNoKHRoaXMsIGtleSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtU2VsZWN0ZWRFdmVudChrZXk6IHN0cmluZykge1xuICAgIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbVNlbGVjdGVkLmRpc3BhdGNoKHRoaXMsIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGFuIGl0ZW0gaXMgYWRkZWQgdG8gdGhlIGxpc3Qgb2YgaXRlbXMuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPn1cbiAgICovXG4gIGdldCBvbkl0ZW1BZGRlZCgpOiBFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbUFkZGVkLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGFuIGl0ZW0gaXMgcmVtb3ZlZCBmcm9tIHRoZSBsaXN0IG9mIGl0ZW1zLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25JdGVtUmVtb3ZlZCgpOiBFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbVJlbW92ZWQuZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gYW4gaXRlbSBpcyBzZWxlY3RlZCBmcm9tIHRoZSBsaXN0IG9mIGl0ZW1zLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25JdGVtU2VsZWN0ZWQoKTogRXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1TZWxlY3RlZC5nZXRFdmVudCgpO1xuICB9XG59IiwiaW1wb3J0IHtMYWJlbENvbmZpZywgTGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBFbnVtZXJhdGVzIHRoZSB0eXBlcyBvZiBjb250ZW50IHRoYXQgdGhlIHtAbGluayBNZXRhZGF0YUxhYmVsfSBjYW4gZGlzcGxheS5cbiAqL1xuZXhwb3J0IGVudW0gTWV0YWRhdGFMYWJlbENvbnRlbnQge1xuICAvKipcbiAgICogVGl0bGUgb2YgdGhlIGRhdGEgc291cmNlLlxuICAgKi9cbiAgVGl0bGUsXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBmbyB0aGUgZGF0YSBzb3VyY2UuXG4gICAqL1xuICBEZXNjcmlwdGlvbixcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3Ige0BsaW5rIE1ldGFkYXRhTGFiZWx9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldGFkYXRhTGFiZWxDb25maWcgZXh0ZW5kcyBMYWJlbENvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBjb250ZW50IHRoYXQgc2hvdWxkIGJlIGRpc3BsYXllZCBpbiB0aGUgbGFiZWwuXG4gICAqL1xuICBjb250ZW50OiBNZXRhZGF0YUxhYmVsQ29udGVudDtcbn1cblxuLyoqXG4gKiBBIGxhYmVsIHRoYXQgY2FuIGJlIGNvbmZpZ3VyZWQgdG8gZGlzcGxheSBjZXJ0YWluIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY2xhc3MgTWV0YWRhdGFMYWJlbCBleHRlbmRzIExhYmVsPE1ldGFkYXRhTGFiZWxDb25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE1ldGFkYXRhTGFiZWxDb25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3NlczogWydsYWJlbC1tZXRhZGF0YScsICdsYWJlbC1tZXRhZGF0YS0nICsgTWV0YWRhdGFMYWJlbENvbnRlbnRbY29uZmlnLmNvbnRlbnRdLnRvTG93ZXJDYXNlKCldXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPE1ldGFkYXRhTGFiZWxDb25maWc+dGhpcy5nZXRDb25maWcoKTtcbiAgICBsZXQgdWljb25maWcgPSB1aW1hbmFnZXIuZ2V0Q29uZmlnKCk7XG5cbiAgICBsZXQgaW5pdCA9ICgpID0+IHtcbiAgICAgIHN3aXRjaCAoY29uZmlnLmNvbnRlbnQpIHtcbiAgICAgICAgY2FzZSBNZXRhZGF0YUxhYmVsQ29udGVudC5UaXRsZTpcbiAgICAgICAgICBpZiAodWljb25maWcgJiYgdWljb25maWcubWV0YWRhdGEgJiYgdWljb25maWcubWV0YWRhdGEudGl0bGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dCh1aWNvbmZpZy5tZXRhZGF0YS50aXRsZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UudGl0bGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLnRpdGxlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgTWV0YWRhdGFMYWJlbENvbnRlbnQuRGVzY3JpcHRpb246XG4gICAgICAgICAgaWYgKHVpY29uZmlnICYmIHVpY29uZmlnLm1ldGFkYXRhICYmIHVpY29uZmlnLm1ldGFkYXRhLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRleHQodWljb25maWcubWV0YWRhdGEuZGVzY3JpcHRpb24pO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdldENvbmZpZygpLnNvdXJjZSAmJiBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRleHQocGxheWVyLmdldENvbmZpZygpLnNvdXJjZS5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdW5sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRUZXh0KG51bGwpO1xuICAgIH07XG5cbiAgICAvLyBJbml0IGxhYmVsXG4gICAgaW5pdCgpO1xuICAgIC8vIFJlaW5pdCBsYWJlbCB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfTE9BREVELCBpbml0KTtcbiAgICAvLyBDbGVhciBsYWJlbHMgd2hlbiBzb3VyY2UgaXMgdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHVubG9hZCk7XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyBBcHBsZSBtYWNPUyBwaWN0dXJlLWluLXBpY3R1cmUgbW9kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBpY3R1cmVJblBpY3R1cmVUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXBpcHRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnUGljdHVyZS1pbi1QaWN0dXJlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzUGljdHVyZUluUGljdHVyZUF2YWlsYWJsZSgpKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuaXNQaWN0dXJlSW5QaWN0dXJlKCkpIHtcbiAgICAgICAgICBwbGF5ZXIuZXhpdFBpY3R1cmVJblBpY3R1cmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5ZXIuZW50ZXJQaWN0dXJlSW5QaWN0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1BJUCB1bmF2YWlsYWJsZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcGlwQXZhaWxhYmxlSGFuZGVyID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc1BpY3R1cmVJblBpY3R1cmVBdmFpbGFibGUoKSkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgcGlwQXZhaWxhYmxlSGFuZGVyKTtcblxuICAgIC8vIFRvZ2dsZSBidXR0b24gJ29uJyBzdGF0ZVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BJQ1RVUkVfSU5fUElDVFVSRV9FTlRFUiwgKCkgPT4ge1xuICAgICAgdGhpcy5vbigpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BJQ1RVUkVfSU5fUElDVFVSRV9FWElULCAoKSA9PiB7XG4gICAgICB0aGlzLm9mZigpO1xuICAgIH0pO1xuXG4gICAgLy8gU3RhcnR1cCBpbml0XG4gICAgcGlwQXZhaWxhYmxlSGFuZGVyKCk7IC8vIEhpZGUgYnV0dG9uIGlmIFBJUCBub3QgYXZhaWxhYmxlXG4gICAgaWYgKHBsYXllci5pc1BpY3R1cmVJblBpY3R1cmUoKSkge1xuICAgICAgdGhpcy5vbigpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7U2VsZWN0Qm94fSBmcm9tICcuL3NlbGVjdGJveCc7XG5pbXBvcnQge0xpc3RTZWxlY3RvckNvbmZpZ30gZnJvbSAnLi9saXN0c2VsZWN0b3InO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIHNlbGVjdCBib3ggcHJvdmlkaW5nIGEgc2VsZWN0aW9uIG9mIGRpZmZlcmVudCBwbGF5YmFjayBzcGVlZHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQbGF5YmFja1NwZWVkU2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5hZGRJdGVtKCcwLjI1JywgJzAuMjV4Jyk7XG4gICAgdGhpcy5hZGRJdGVtKCcwLjUnLCAnMC41eCcpO1xuICAgIHRoaXMuYWRkSXRlbSgnMScsICdOb3JtYWwnKTtcbiAgICB0aGlzLmFkZEl0ZW0oJzEuNScsICcxLjV4Jyk7XG4gICAgdGhpcy5hZGRJdGVtKCcyJywgJzJ4Jyk7XG5cbiAgICB0aGlzLnNlbGVjdEl0ZW0oJzEnKTtcblxuXG4gICAgdGhpcy5vbkl0ZW1TZWxlY3RlZC5zdWJzY3JpYmUoKHNlbmRlcjogUGxheWJhY2tTcGVlZFNlbGVjdEJveCwgdmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgcGxheWVyLnNldFBsYXliYWNrU3BlZWQocGFyc2VGbG9hdCh2YWx1ZSkpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtMYWJlbENvbmZpZywgTGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7U3RyaW5nVXRpbHMsIFBsYXllclV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzID0gUGxheWVyVXRpbHMuTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzO1xuXG5leHBvcnQgZW51bSBQbGF5YmFja1RpbWVMYWJlbE1vZGUge1xuICBDdXJyZW50VGltZSxcbiAgVG90YWxUaW1lLFxuICBDdXJyZW50QW5kVG90YWxUaW1lLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsYXliYWNrVGltZUxhYmVsQ29uZmlnIGV4dGVuZHMgTGFiZWxDb25maWcge1xuICB0aW1lTGFiZWxNb2RlPzogUGxheWJhY2tUaW1lTGFiZWxNb2RlO1xuICBoaWRlSW5MaXZlUGxheWJhY2s/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgbGFiZWwgdGhhdCBkaXNwbGF5IHRoZSBjdXJyZW50IHBsYXliYWNrIHRpbWUgYW5kIHRoZSB0b3RhbCB0aW1lIHRocm91Z2gge0BsaW5rIFBsYXliYWNrVGltZUxhYmVsI3NldFRpbWUgc2V0VGltZX1cbiAqIG9yIGFueSBzdHJpbmcgdGhyb3VnaCB7QGxpbmsgUGxheWJhY2tUaW1lTGFiZWwjc2V0VGV4dCBzZXRUZXh0fS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXliYWNrVGltZUxhYmVsIGV4dGVuZHMgTGFiZWw8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+IHtcblxuICBwcml2YXRlIHRpbWVGb3JtYXQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFBsYXliYWNrVGltZUxhYmVsQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywgPFBsYXliYWNrVGltZUxhYmVsQ29uZmlnPntcbiAgICAgIGNzc0NsYXNzOiAndWktcGxheWJhY2t0aW1lbGFiZWwnLFxuICAgICAgdGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRBbmRUb3RhbFRpbWUsXG4gICAgICBoaWRlSW5MaXZlUGxheWJhY2s6IGZhbHNlLFxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxQbGF5YmFja1RpbWVMYWJlbENvbmZpZz50aGlzLmdldENvbmZpZygpO1xuICAgIGxldCBsaXZlID0gZmFsc2U7XG4gICAgbGV0IGxpdmVDc3NDbGFzcyA9IHRoaXMucHJlZml4Q3NzKCd1aS1wbGF5YmFja3RpbWVsYWJlbC1saXZlJyk7XG4gICAgbGV0IGxpdmVFZGdlQ3NzQ2xhc3MgPSB0aGlzLnByZWZpeENzcygndWktcGxheWJhY2t0aW1lbGFiZWwtbGl2ZS1lZGdlJyk7XG4gICAgbGV0IG1pbldpZHRoID0gMDtcblxuICAgIGxldCBsaXZlQ2xpY2tIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgcGxheWVyLnRpbWVTaGlmdCgwKTtcbiAgICB9O1xuXG4gICAgbGV0IHVwZGF0ZUxpdmVTdGF0ZSA9ICgpID0+IHtcbiAgICAgIC8vIFBsYXllciBpcyBwbGF5aW5nIGEgbGl2ZSBzdHJlYW0gd2hlbiB0aGUgZHVyYXRpb24gaXMgaW5maW5pdGVcbiAgICAgIGxpdmUgPSBwbGF5ZXIuaXNMaXZlKCk7XG5cbiAgICAgIC8vIEF0dGFjaC9kZXRhY2ggbGl2ZSBtYXJrZXIgY2xhc3NcbiAgICAgIGlmIChsaXZlKSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKGxpdmVDc3NDbGFzcyk7XG4gICAgICAgIHRoaXMuc2V0VGV4dCgnTGl2ZScpO1xuICAgICAgICBpZiAoY29uZmlnLmhpZGVJbkxpdmVQbGF5YmFjaykge1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUobGl2ZUNsaWNrSGFuZGxlcik7XG4gICAgICAgIHVwZGF0ZUxpdmVUaW1lc2hpZnRTdGF0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3MobGl2ZUNzc0NsYXNzKTtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3MobGl2ZUVkZ2VDc3NDbGFzcyk7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB0aGlzLm9uQ2xpY2sudW5zdWJzY3JpYmUobGl2ZUNsaWNrSGFuZGxlcik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG5ldyBQbGF5ZXJVdGlscy5MaXZlU3RyZWFtRGV0ZWN0b3IocGxheWVyKS5vbkxpdmVDaGFuZ2VkLnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzOiBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MpID0+IHtcbiAgICAgIGxpdmUgPSBhcmdzLmxpdmU7XG4gICAgICB1cGRhdGVMaXZlU3RhdGUoKTtcbiAgICB9KTtcblxuICAgIGxldCB1cGRhdGVMaXZlVGltZXNoaWZ0U3RhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldFRpbWVTaGlmdCgpID09PSAwKSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKGxpdmVFZGdlQ3NzQ2xhc3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3MobGl2ZUVkZ2VDc3NDbGFzcyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCBwbGF5YmFja1RpbWVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgaWYgKCFsaXZlICYmIHBsYXllci5nZXREdXJhdGlvbigpICE9PSBJbmZpbml0eSkge1xuICAgICAgICB0aGlzLnNldFRpbWUocGxheWVyLmdldEN1cnJlbnRUaW1lKCksIHBsYXllci5nZXREdXJhdGlvbigpKTtcbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgJ2p1bXBpbmcnIGluIHRoZSBVSSBieSB2YXJ5aW5nIGxhYmVsIHNpemVzIGR1ZSB0byBub24tbW9ub3NwYWNlZCBmb250cyxcbiAgICAgIC8vIHdlIGdyYWR1YWxseSBpbmNyZWFzZSB0aGUgbWluLXdpZHRoIHdpdGggdGhlIGNvbnRlbnQgdG8gcmVhY2ggYSBzdGFibGUgc2l6ZS5cbiAgICAgIGxldCB3aWR0aCA9IHRoaXMuZ2V0RG9tRWxlbWVudCgpLndpZHRoKCk7XG4gICAgICBpZiAod2lkdGggPiBtaW5XaWR0aCkge1xuICAgICAgICBtaW5XaWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5jc3Moe1xuICAgICAgICAgICdtaW4td2lkdGgnOiBtaW5XaWR0aCArICdweCdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgcGxheWJhY2tUaW1lSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCBwbGF5YmFja1RpbWVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgcGxheWJhY2tUaW1lSGFuZGxlcik7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZULCB1cGRhdGVMaXZlVGltZXNoaWZ0U3RhdGUpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfU0hJRlRFRCwgdXBkYXRlTGl2ZVRpbWVzaGlmdFN0YXRlKTtcblxuICAgIGxldCBpbml0ID0gKCkgPT4ge1xuICAgICAgLy8gUmVzZXQgbWluLXdpZHRoIHdoZW4gYSBuZXcgc291cmNlIGlzIHJlYWR5IChlc3BlY2lhbGx5IGZvciBzd2l0Y2hpbmcgVk9EL0xpdmUgbW9kZXMgd2hlcmUgdGhlIGxhYmVsIGNvbnRlbnRcbiAgICAgIC8vIGNoYW5nZXMpXG4gICAgICBtaW5XaWR0aCA9IDA7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5jc3Moe1xuICAgICAgICAnbWluLXdpZHRoJzogbnVsbFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFNldCB0aW1lIGZvcm1hdCBkZXBlbmRpbmcgb24gc291cmNlIGR1cmF0aW9uXG4gICAgICB0aGlzLnRpbWVGb3JtYXQgPSBNYXRoLmFicyhwbGF5ZXIuaXNMaXZlKCkgPyBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgOiBwbGF5ZXIuZ2V0RHVyYXRpb24oKSkgPj0gMzYwMCA/XG4gICAgICAgIFN0cmluZ1V0aWxzLkZPUk1BVF9ISE1NU1MgOiBTdHJpbmdVdGlscy5GT1JNQVRfTU1TUztcblxuICAgICAgLy8gVXBkYXRlIHRpbWUgYWZ0ZXIgdGhlIGZvcm1hdCBoYXMgYmVlbiBzZXRcbiAgICAgIHBsYXliYWNrVGltZUhhbmRsZXIoKTtcbiAgICB9O1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBpbml0KTtcblxuICAgIGluaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjdXJyZW50IHBsYXliYWNrIHRpbWUgYW5kIHRvdGFsIGR1cmF0aW9uLlxuICAgKiBAcGFyYW0gcGxheWJhY2tTZWNvbmRzIHRoZSBjdXJyZW50IHBsYXliYWNrIHRpbWUgaW4gc2Vjb25kc1xuICAgKiBAcGFyYW0gZHVyYXRpb25TZWNvbmRzIHRoZSB0b3RhbCBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gICAqL1xuICBzZXRUaW1lKHBsYXliYWNrU2Vjb25kczogbnVtYmVyLCBkdXJhdGlvblNlY29uZHM6IG51bWJlcikge1xuICAgIGxldCBjdXJyZW50VGltZSA9IFN0cmluZ1V0aWxzLnNlY29uZHNUb1RpbWUocGxheWJhY2tTZWNvbmRzLCB0aGlzLnRpbWVGb3JtYXQpO1xuICAgIGxldCB0b3RhbFRpbWUgPSBTdHJpbmdVdGlscy5zZWNvbmRzVG9UaW1lKGR1cmF0aW9uU2Vjb25kcywgdGhpcy50aW1lRm9ybWF0KTtcblxuICAgIHN3aXRjaCAoKDxQbGF5YmFja1RpbWVMYWJlbENvbmZpZz50aGlzLmNvbmZpZykudGltZUxhYmVsTW9kZSkge1xuICAgICAgY2FzZSBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudFRpbWU6XG4gICAgICAgIHRoaXMuc2V0VGV4dChgJHtjdXJyZW50VGltZX1gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBsYXliYWNrVGltZUxhYmVsTW9kZS5Ub3RhbFRpbWU6XG4gICAgICAgIHRoaXMuc2V0VGV4dChgJHt0b3RhbFRpbWV9YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudEFuZFRvdGFsVGltZTpcbiAgICAgICAgdGhpcy5zZXRUZXh0KGAke2N1cnJlbnRUaW1lfSAvICR7dG90YWxUaW1lfWApO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IFBsYXllckV2ZW50ID0gYml0bW92aW4ucGxheWVyLlBsYXllckV2ZW50O1xuaW1wb3J0IHtQbGF5ZXJVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzID0gUGxheWVyVXRpbHMuVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3M7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIGJldHdlZW4gcGxheWJhY2sgYW5kIHBhdXNlLlxuICovXG5leHBvcnQgY2xhc3MgUGxheWJhY2tUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfU1RPUFRPR0dMRSA9ICdzdG9wdG9nZ2xlJztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktcGxheWJhY2t0b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ1BsYXkvUGF1c2UnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlciwgaGFuZGxlQ2xpY2tFdmVudDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGlzU2Vla2luZyA9IGZhbHNlO1xuXG4gICAgLy8gSGFuZGxlciB0byB1cGRhdGUgYnV0dG9uIHN0YXRlIGJhc2VkIG9uIHBsYXllciBzdGF0ZVxuICAgIGxldCBwbGF5YmFja1N0YXRlSGFuZGxlciA9IChldmVudDogUGxheWVyRXZlbnQpID0+IHtcbiAgICAgIC8vIElmIHRoZSBVSSBpcyBjdXJyZW50bHkgc2Vla2luZywgcGxheWJhY2sgaXMgdGVtcG9yYXJpbHkgc3RvcHBlZCBidXQgdGhlIGJ1dHRvbnMgc2hvdWxkXG4gICAgICAvLyBub3QgcmVmbGVjdCB0aGF0IGFuZCBzdGF5IGFzLWlzIChlLmcgaW5kaWNhdGUgcGxheWJhY2sgd2hpbGUgc2Vla2luZykuXG4gICAgICBpZiAoaXNTZWVraW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHBsYXllci5pc1BsYXlpbmcoKSkge1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9mZigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDYWxsIGhhbmRsZXIgdXBvbiB0aGVzZSBldmVudHNcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCBwbGF5YmFja1N0YXRlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUEFVU0VELCBwbGF5YmFja1N0YXRlSGFuZGxlcik7XG4gICAgLy8gd2hlbiBwbGF5YmFjayBmaW5pc2hlcywgcGxheWVyIHR1cm5zIHRvIHBhdXNlZCBtb2RlXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUJBQ0tfRklOSVNIRUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1BMQVlJTkcsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1BBVVNFRCwgcGxheWJhY2tTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfUExBWUJBQ0tfRklOSVNIRUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcblxuICAgIC8vIERldGVjdCBhYnNlbmNlIG9mIHRpbWVzaGlmdGluZyBvbiBsaXZlIHN0cmVhbXMgYW5kIGFkZCB0YWdnaW5nIGNsYXNzIHRvIGNvbnZlcnQgYnV0dG9uIGljb25zIHRvIHBsYXkvc3RvcFxuICAgIG5ldyBQbGF5ZXJVdGlscy5UaW1lU2hpZnRBdmFpbGFiaWxpdHlEZXRlY3RvcihwbGF5ZXIpLm9uVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZC5zdWJzY3JpYmUoXG4gICAgICAoc2VuZGVyLCBhcmdzOiBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncykgPT4ge1xuICAgICAgICBpZiAoIWFyZ3MudGltZVNoaWZ0QXZhaWxhYmxlKSB7XG4gICAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoUGxheWJhY2tUb2dnbGVCdXR0b24uQ0xBU1NfU1RPUFRPR0dMRSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFBsYXliYWNrVG9nZ2xlQnV0dG9uLkNMQVNTX1NUT1BUT0dHTEUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoaGFuZGxlQ2xpY2tFdmVudCkge1xuICAgICAgLy8gQ29udHJvbCBwbGF5ZXIgYnkgYnV0dG9uIGV2ZW50c1xuICAgICAgLy8gV2hlbiBhIGJ1dHRvbiBldmVudCB0cmlnZ2VycyBhIHBsYXllciBBUEkgY2FsbCwgZXZlbnRzIGFyZSBmaXJlZCB3aGljaCBpbiB0dXJuIGNhbGwgdGhlIGV2ZW50IGhhbmRsZXJcbiAgICAgIC8vIGFib3ZlIHRoYXQgdXBkYXRlZCB0aGUgYnV0dG9uIHN0YXRlLlxuICAgICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgICAgICBwbGF5ZXIucGF1c2UoJ3VpLWJ1dHRvbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYXllci5wbGF5KCd1aS1idXR0b24nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVHJhY2sgVUkgc2Vla2luZyBzdGF0dXNcbiAgICB1aW1hbmFnZXIub25TZWVrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSB0cnVlO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vblNlZWtlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaXNTZWVraW5nID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBwbGF5YmFja1N0YXRlSGFuZGxlcihudWxsKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7SHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2h1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgZXJyb3IgbWVzc2FnZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBwbGF5YmFja1RvZ2dsZUJ1dHRvbjogSHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5wbGF5YmFja1RvZ2dsZUJ1dHRvbiA9IG5ldyBIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24oKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktcGxheWJhY2t0b2dnbGUtb3ZlcmxheScsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy5wbGF5YmFja1RvZ2dsZUJ1dHRvbl1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lckNvbmZpZywgQ29udGFpbmVyfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXIsIFVJUmVjb21tZW5kYXRpb25Db25maWd9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0h1Z2VSZXBsYXlCdXR0b259IGZyb20gJy4vaHVnZXJlcGxheWJ1dHRvbic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgcmVjb21tZW5kZWQgdmlkZW9zLlxuICovXG5leHBvcnQgY2xhc3MgUmVjb21tZW5kYXRpb25PdmVybGF5IGV4dGVuZHMgQ29udGFpbmVyPENvbnRhaW5lckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgcmVwbGF5QnV0dG9uOiBIdWdlUmVwbGF5QnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5yZXBsYXlCdXR0b24gPSBuZXcgSHVnZVJlcGxheUJ1dHRvbigpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1yZWNvbW1lbmRhdGlvbi1vdmVybGF5JyxcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLnJlcGxheUJ1dHRvbl1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjbGVhclJlY29tbWVuZGF0aW9ucyA9ICgpID0+IHtcbiAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldENvbXBvbmVudHMoKSkge1xuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgUmVjb21tZW5kYXRpb25JdGVtKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVDb21wb25lbnRzKCk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcygncmVjb21tZW5kYXRpb25zJykpO1xuICAgIH07XG5cbiAgICBsZXQgc2V0dXBSZWNvbW1lbmRhdGlvbnMgPSAoKSA9PiB7XG4gICAgICBjbGVhclJlY29tbWVuZGF0aW9ucygpO1xuXG4gICAgICBsZXQgaGFzUmVjb21tZW5kYXRpb25zSW5VaUNvbmZpZyA9IHVpbWFuYWdlci5nZXRDb25maWcoKS5yZWNvbW1lbmRhdGlvbnNcbiAgICAgICAgJiYgdWltYW5hZ2VyLmdldENvbmZpZygpLnJlY29tbWVuZGF0aW9ucy5sZW5ndGggPiAwO1xuICAgICAgbGV0IGhhc1JlY29tbWVuZGF0aW9uc0luUGxheWVyQ29uZmlnID0gcGxheWVyLmdldENvbmZpZygpLnNvdXJjZSAmJiBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLnJlY29tbWVuZGF0aW9uc1xuICAgICAgICAmJiBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLnJlY29tbWVuZGF0aW9ucy5sZW5ndGggPiAwO1xuXG4gICAgICAvLyBUYWtlIG1hcmtlcnMgZnJvbSB0aGUgVUkgY29uZmlnLiBJZiBubyBtYXJrZXJzIGRlZmluZWQsIHRyeSB0byB0YWtlIHRoZW0gZnJvbSB0aGUgcGxheWVyJ3Mgc291cmNlIGNvbmZpZy5cbiAgICAgIGxldCByZWNvbW1lbmRhdGlvbnMgPSBoYXNSZWNvbW1lbmRhdGlvbnNJblVpQ29uZmlnID8gdWltYW5hZ2VyLmdldENvbmZpZygpLnJlY29tbWVuZGF0aW9ucyA6XG4gICAgICAgIGhhc1JlY29tbWVuZGF0aW9uc0luUGxheWVyQ29uZmlnID8gcGxheWVyLmdldENvbmZpZygpLnNvdXJjZS5yZWNvbW1lbmRhdGlvbnMgOiBudWxsO1xuXG4gICAgICAvLyBHZW5lcmF0ZSB0aW1lbGluZSBtYXJrZXJzIGZyb20gdGhlIGNvbmZpZyBpZiB3ZSBoYXZlIG1hcmtlcnMgYW5kIGlmIHdlIGhhdmUgYSBkdXJhdGlvblxuICAgICAgLy8gVGhlIGR1cmF0aW9uIGNoZWNrIGlzIGZvciBidWdneSBwbGF0Zm9ybXMgd2hlcmUgdGhlIGR1cmF0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW5zdGFudGx5IChDaHJvbWUgb24gQW5kcm9pZCA0LjMpXG4gICAgICBpZiAocmVjb21tZW5kYXRpb25zKSB7XG4gICAgICAgIGxldCBpbmRleCA9IDE7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVjb21tZW5kYXRpb25zKSB7XG4gICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQobmV3IFJlY29tbWVuZGF0aW9uSXRlbSh7XG4gICAgICAgICAgICBpdGVtQ29uZmlnOiBpdGVtLFxuICAgICAgICAgICAgY3NzQ2xhc3NlczogWydyZWNvbW1lbmRhdGlvbi1pdGVtLScgKyAoaW5kZXgrKyldXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50cygpOyAvLyBjcmVhdGUgY29udGFpbmVyIERPTSBlbGVtZW50c1xuXG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCdyZWNvbW1lbmRhdGlvbnMnKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIEFkZCByZWNvbW1lbmRhdGlvbiB3aGVuIGEgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBzZXR1cFJlY29tbWVuZGF0aW9ucyk7XG4gICAgLy8gUmVtb3ZlIHJlY29tbWVuZGF0aW9ucyBhbmQgaGlkZSBvdmVybGF5IHdoZW4gc291cmNlIGlzIHVubG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCAoKSA9PiB7XG4gICAgICBjbGVhclJlY29tbWVuZGF0aW9ucygpO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSk7XG4gICAgLy8gRGlzcGxheSByZWNvbW1lbmRhdGlvbnMgd2hlbiBwbGF5YmFjayBoYXMgZmluaXNoZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZQkFDS19GSU5JU0hFRCwgKCkgPT4ge1xuICAgICAgLy8gRGlzbWlzcyBPTl9QTEFZQkFDS19GSU5JU0hFRCBldmVudHMgYXQgdGhlIGVuZCBvZiBhZHNcbiAgICAgIC8vIFRPRE8gcmVtb3ZlIHRoaXMgd29ya2Fyb3VuZCBvbmNlIGlzc3VlICMxMjc4IGlzIHNvbHZlZFxuICAgICAgaWYgKHBsYXllci5pc0FkKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9KTtcbiAgICAvLyBIaWRlIHJlY29tbWVuZGF0aW9ucyB3aGVuIHBsYXliYWNrIHN0YXJ0cywgZS5nLiBhIHJlc3RhcnRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCAoKSA9PiB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcblxuICAgIC8vIEluaXQgb24gc3RhcnR1cFxuICAgIHNldHVwUmVjb21tZW5kYXRpb25zKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBSZWNvbW1lbmRhdGlvbkl0ZW19XG4gKi9cbmludGVyZmFjZSBSZWNvbW1lbmRhdGlvbkl0ZW1Db25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICBpdGVtQ29uZmlnOiBVSVJlY29tbWVuZGF0aW9uQ29uZmlnO1xufVxuXG4vKipcbiAqIEFuIGl0ZW0gb2YgdGhlIHtAbGluayBSZWNvbW1lbmRhdGlvbk92ZXJsYXl9LiBVc2VkIG9ubHkgaW50ZXJuYWxseSBpbiB7QGxpbmsgUmVjb21tZW5kYXRpb25PdmVybGF5fS5cbiAqL1xuY2xhc3MgUmVjb21tZW5kYXRpb25JdGVtIGV4dGVuZHMgQ29tcG9uZW50PFJlY29tbWVuZGF0aW9uSXRlbUNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogUmVjb21tZW5kYXRpb25JdGVtQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktcmVjb21tZW5kYXRpb24taXRlbScsXG4gICAgICBpdGVtQ29uZmlnOiBudWxsIC8vIHRoaXMgbXVzdCBiZSBwYXNzZWQgaW4gZnJvbSBvdXRzaWRlXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGxldCBjb25maWcgPSAoPFJlY29tbWVuZGF0aW9uSXRlbUNvbmZpZz50aGlzLmNvbmZpZykuaXRlbUNvbmZpZzsgLy8gVE9ETyBmaXggZ2VuZXJpY3MgYW5kIGdldCByaWQgb2YgY2FzdFxuXG4gICAgbGV0IGl0ZW1FbGVtZW50ID0gbmV3IERPTSgnYScsIHtcbiAgICAgICdpZCc6IHRoaXMuY29uZmlnLmlkLFxuICAgICAgJ2NsYXNzJzogdGhpcy5nZXRDc3NDbGFzc2VzKCksXG4gICAgICAnaHJlZic6IGNvbmZpZy51cmxcbiAgICB9KS5jc3MoeyAnYmFja2dyb3VuZC1pbWFnZSc6IGB1cmwoJHtjb25maWcudGh1bWJuYWlsfSlgIH0pO1xuXG4gICAgbGV0IGJnRWxlbWVudCA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdiYWNrZ3JvdW5kJylcbiAgICB9KTtcbiAgICBpdGVtRWxlbWVudC5hcHBlbmQoYmdFbGVtZW50KTtcblxuICAgIGxldCB0aXRsZUVsZW1lbnQgPSBuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3RpdGxlJylcbiAgICB9KS5hcHBlbmQobmV3IERPTSgnc3BhbicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdpbm5lcnRpdGxlJylcbiAgICB9KS5odG1sKGNvbmZpZy50aXRsZSkpO1xuICAgIGl0ZW1FbGVtZW50LmFwcGVuZCh0aXRsZUVsZW1lbnQpO1xuXG4gICAgbGV0IHRpbWVFbGVtZW50ID0gbmV3IERPTSgnc3BhbicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdkdXJhdGlvbicpXG4gICAgfSkuYXBwZW5kKG5ldyBET00oJ3NwYW4nLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnaW5uZXJkdXJhdGlvbicpXG4gICAgfSkuaHRtbChjb25maWcuZHVyYXRpb24gPyBTdHJpbmdVdGlscy5zZWNvbmRzVG9UaW1lKGNvbmZpZy5kdXJhdGlvbikgOiAnJykpO1xuICAgIGl0ZW1FbGVtZW50LmFwcGVuZCh0aW1lRWxlbWVudCk7XG5cbiAgICByZXR1cm4gaXRlbUVsZW1lbnQ7XG4gIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7RXZlbnQsIEV2ZW50RGlzcGF0Y2hlciwgTm9BcmdzfSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuaW1wb3J0IHtTZWVrQmFyTGFiZWx9IGZyb20gJy4vc2Vla2JhcmxhYmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXIsIFRpbWVsaW5lTWFya2VyLCBTZWVrUHJldmlld0FyZ3N9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1RpbWVvdXR9IGZyb20gJy4uL3RpbWVvdXQnO1xuaW1wb3J0IHtQbGF5ZXJVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzID0gUGxheWVyVXRpbHMuVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3M7XG5pbXBvcnQgTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzID0gUGxheWVyVXRpbHMuTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzO1xuaW1wb3J0IFBsYXllckV2ZW50ID0gYml0bW92aW4ucGxheWVyLlBsYXllckV2ZW50O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIFNlZWtCYXJ9IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWVrQmFyQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBsYWJlbCBhYm92ZSB0aGUgc2VlayBwb3NpdGlvbi5cbiAgICovXG4gIGxhYmVsPzogU2Vla0JhckxhYmVsO1xuICAvKipcbiAgICogQmFyIHdpbGwgYmUgdmVydGljYWwgaW5zdGVhZCBvZiBob3Jpem9udGFsIGlmIHNldCB0byB0cnVlLlxuICAgKi9cbiAgdmVydGljYWw/OiBib29sZWFuO1xuICAvKipcbiAgICogVGhlIGludGVydmFsIGluIG1pbGxpc2Vjb25kcyBpbiB3aGljaCB0aGUgcGxheWJhY2sgcG9zaXRpb24gb24gdGhlIHNlZWsgYmFyIHdpbGwgYmUgdXBkYXRlZC4gVGhlIHNob3J0ZXIgdGhlXG4gICAqIGludGVydmFsLCB0aGUgc21vb3RoZXIgaXQgbG9va3MgYW5kIHRoZSBtb3JlIHJlc291cmNlIGludGVuc2UgaXQgaXMuIFRoZSB1cGRhdGUgaW50ZXJ2YWwgd2lsbCBiZSBrZXB0IGFzIHN0ZWFkeVxuICAgKiBhcyBwb3NzaWJsZSB0byBhdm9pZCBqaXR0ZXIuXG4gICAqIFNldCB0byAtMSB0byBkaXNhYmxlIHNtb290aCB1cGRhdGluZyBhbmQgdXBkYXRlIGl0IG9uIHBsYXllciBPTl9USU1FX0NIQU5HRUQgZXZlbnRzIGluc3RlYWQuXG4gICAqIERlZmF1bHQ6IDUwICg1MG1zID0gMjBmcHMpLlxuICAgKi9cbiAgc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZUludGVydmFsTXM/OiBudW1iZXI7XG59XG5cbi8qKlxuICogRXZlbnQgYXJndW1lbnQgaW50ZXJmYWNlIGZvciBhIHNlZWsgcHJldmlldyBldmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWVrUHJldmlld0V2ZW50QXJncyBleHRlbmRzIFNlZWtQcmV2aWV3QXJncyB7XG4gIC8qKlxuICAgKiBUZWxscyBpZiB0aGUgc2VlayBwcmV2aWV3IGV2ZW50IGNvbWVzIGZyb20gYSBzY3J1YmJpbmcuXG4gICAqL1xuICBzY3J1YmJpbmc6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBzZWVrIGJhciB0byBzZWVrIHdpdGhpbiB0aGUgcGxheWVyJ3MgbWVkaWEuIEl0IGRpc3BsYXlzIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uLCBhbW91bnQgb2YgYnVmZmVkIGRhdGEsIHNlZWtcbiAqIHRhcmdldCwgYW5kIGtlZXBzIHN0YXR1cyBhYm91dCBhbiBvbmdvaW5nIHNlZWsuXG4gKlxuICogVGhlIHNlZWsgYmFyIGRpc3BsYXlzIGRpZmZlcmVudCAnYmFycyc6XG4gKiAgLSB0aGUgcGxheWJhY2sgcG9zaXRpb24sIGkuZS4gdGhlIHBvc2l0aW9uIGluIHRoZSBtZWRpYSBhdCB3aGljaCB0aGUgcGxheWVyIGN1cnJlbnQgcGxheWJhY2sgcG9pbnRlciBpcyBwb3NpdGlvbmVkXG4gKiAgLSB0aGUgYnVmZmVyIHBvc2l0aW9uLCB3aGljaCB1c3VhbGx5IGlzIHRoZSBwbGF5YmFjayBwb3NpdGlvbiBwbHVzIHRoZSB0aW1lIHNwYW4gdGhhdCBpcyBhbHJlYWR5IGJ1ZmZlcmVkIGFoZWFkXG4gKiAgLSB0aGUgc2VlayBwb3NpdGlvbiwgdXNlZCB0byBwcmV2aWV3IHRvIHdoZXJlIGluIHRoZSB0aW1lbGluZSBhIHNlZWsgd2lsbCBqdW1wIHRvXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWVrQmFyIGV4dGVuZHMgQ29tcG9uZW50PFNlZWtCYXJDb25maWc+IHtcblxuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNNT09USF9QTEFZQkFDS19QT1NJVElPTl9VUERBVEVfRElTQUJMRUQgPSAtMTtcblxuICAvKipcbiAgICogVGhlIENTUyBjbGFzcyB0aGF0IGlzIGFkZGVkIHRvIHRoZSBET00gZWxlbWVudCB3aGlsZSB0aGUgc2VlayBiYXIgaXMgaW4gJ3NlZWtpbmcnIHN0YXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfU0VFS0lORyA9ICdzZWVraW5nJztcblxuICBwcml2YXRlIHNlZWtCYXI6IERPTTtcbiAgcHJpdmF0ZSBzZWVrQmFyUGxheWJhY2tQb3NpdGlvbjogRE9NO1xuICBwcml2YXRlIHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyOiBET007XG4gIHByaXZhdGUgc2Vla0JhckJ1ZmZlclBvc2l0aW9uOiBET007XG4gIHByaXZhdGUgc2Vla0JhclNlZWtQb3NpdGlvbjogRE9NO1xuICBwcml2YXRlIHNlZWtCYXJCYWNrZHJvcDogRE9NO1xuICBwcml2YXRlIHNlZWtCYXJNYXJrZXJzQ29udGFpbmVyOiBET007XG5cbiAgcHJpdmF0ZSBsYWJlbDogU2Vla0JhckxhYmVsO1xuXG4gIHByaXZhdGUgdGltZWxpbmVNYXJrZXJzOiBUaW1lbGluZU1hcmtlcltdO1xuXG4gIC8qKlxuICAgKiBCdWZmZXIgb2YgdGhlIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uLiBUaGUgcG9zaXRpb24gbXVzdCBiZSBidWZmZXJlZCBpbiBjYXNlIHRoZSBlbGVtZW50XG4gICAqIG5lZWRzIHRvIGJlIHJlZnJlc2hlZCB3aXRoIHtAbGluayAjcmVmcmVzaFBsYXliYWNrUG9zaXRpb259LlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgcHJpdmF0ZSBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDA7XG5cbiAgcHJpdmF0ZSBzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcjogVGltZW91dDtcblxuICAvLyBodHRwczovL2hhY2tzLm1vemlsbGEub3JnLzIwMTMvMDQvZGV0ZWN0aW5nLXRvdWNoLWl0cy10aGUtd2h5LW5vdC10aGUtaG93L1xuICBwcml2YXRlIHRvdWNoU3VwcG9ydGVkID0gKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyk7XG5cbiAgcHJpdmF0ZSBzZWVrQmFyRXZlbnRzID0ge1xuICAgIC8qKlxuICAgICAqIEZpcmVkIHdoZW4gYSBzY3J1YmJpbmcgc2VlayBvcGVyYXRpb24gaXMgc3RhcnRlZC5cbiAgICAgKi9cbiAgICBvblNlZWs6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPigpLFxuICAgIC8qKlxuICAgICAqIEZpcmVkIGR1cmluZyBhIHNjcnViYmluZyBzZWVrIHRvIGluZGljYXRlIHRoYXQgdGhlIHNlZWsgcHJldmlldyAoaS5lLiB0aGUgdmlkZW8gZnJhbWUpIHNob3VsZCBiZSB1cGRhdGVkLlxuICAgICAqL1xuICAgIG9uU2Vla1ByZXZpZXc6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgU2Vla1ByZXZpZXdFdmVudEFyZ3M+KCksXG4gICAgLyoqXG4gICAgICogRmlyZWQgd2hlbiBhIHNjcnViYmluZyBzZWVrIGhhcyBmaW5pc2hlZCBvciB3aGVuIGEgZGlyZWN0IHNlZWsgaXMgaXNzdWVkLlxuICAgICAqL1xuICAgIG9uU2Vla2VkOiBuZXcgRXZlbnREaXNwYXRjaGVyPFNlZWtCYXIsIG51bWJlcj4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogU2Vla0JhckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc2Vla2JhcicsXG4gICAgICB2ZXJ0aWNhbDogZmFsc2UsXG4gICAgICBzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNczogNTAsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy5sYWJlbCA9IHRoaXMuY29uZmlnLmxhYmVsO1xuICAgIHRoaXMudGltZWxpbmVNYXJrZXJzID0gW107XG4gIH1cblxuICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIGlmICh0aGlzLmhhc0xhYmVsKCkpIHtcbiAgICAgIHRoaXMuZ2V0TGFiZWwoKS5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlciwgY29uZmlndXJlU2VlazogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgaWYgKCFjb25maWd1cmVTZWVrKSB7XG4gICAgICAvLyBUaGUgY29uZmlndXJlU2VlayBmbGFnIGNhbiBiZSB1c2VkIGJ5IHN1YmNsYXNzZXMgdG8gZGlzYWJsZSBjb25maWd1cmF0aW9uIGFzIHNlZWsgYmFyLiBFLmcuIHRoZSB2b2x1bWVcbiAgICAgIC8vIHNsaWRlciBpcyByZXVzaW5nIHRoaXMgY29tcG9uZW50IGJ1dCBhZGRzIGl0cyBvd24gZnVuY3Rpb25hbGl0eSwgYW5kIGRvZXMgbm90IG5lZWQgdGhlIHNlZWsgZnVuY3Rpb25hbGl0eS5cbiAgICAgIC8vIFRoaXMgaXMgYWN0dWFsbHkgYSBoYWNrLCB0aGUgcHJvcGVyIHNvbHV0aW9uIHdvdWxkIGJlIGZvciBib3RoIHNlZWsgYmFyIGFuZCB2b2x1bWUgc2xpZGVycyB0byBleHRlbmRcbiAgICAgIC8vIGEgY29tbW9uIGJhc2Ugc2xpZGVyIGNvbXBvbmVudCBhbmQgaW1wbGVtZW50IHRoZWlyIGZ1bmN0aW9uYWxpdHkgdGhlcmUuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBsYXliYWNrTm90SW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIGxldCBpc1BsYXlpbmcgPSBmYWxzZTtcbiAgICBsZXQgaXNTZWVraW5nID0gZmFsc2U7XG5cbiAgICAvLyBVcGRhdGUgcGxheWJhY2sgYW5kIGJ1ZmZlciBwb3NpdGlvbnNcbiAgICBsZXQgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIgPSAoZXZlbnQ6IFBsYXllckV2ZW50ID0gbnVsbCwgZm9yY2VVcGRhdGU6IGJvb2xlYW4gPSBmYWxzZSkgPT4ge1xuICAgICAgLy8gT25jZSB0aGlzIGhhbmRsZXIgb3MgY2FsbGVkLCBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGFuZCB3ZSBzZXQgdGhlIGZsYWcgdG8gZmFsc2VcbiAgICAgIHBsYXliYWNrTm90SW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKGlzU2Vla2luZykge1xuICAgICAgICAvLyBXZSBjYXVnaHQgYSBzZWVrIHByZXZpZXcgc2VlaywgZG8gbm90IHVwZGF0ZSB0aGUgc2Vla2JhclxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChwbGF5ZXIuaXNMaXZlKCkpIHtcbiAgICAgICAgaWYgKHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSA9PT0gMCkge1xuICAgICAgICAgIC8vIFRoaXMgY2FzZSBtdXN0IGJlIGV4cGxpY2l0bHkgaGFuZGxlZCB0byBhdm9pZCBkaXZpc2lvbiBieSB6ZXJvXG4gICAgICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKDEwMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbGV0IHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlID0gMTAwIC0gKDEwMCAvIHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAqIHBsYXllci5nZXRUaW1lU2hpZnQoKSk7XG4gICAgICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsd2F5cyBzaG93IGZ1bGwgYnVmZmVyIGZvciBsaXZlIHN0cmVhbXNcbiAgICAgICAgdGhpcy5zZXRCdWZmZXJQb3NpdGlvbigxMDApO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxldCBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDEwMCAvIHBsYXllci5nZXREdXJhdGlvbigpICogcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG5cbiAgICAgICAgbGV0IHZpZGVvQnVmZmVyTGVuZ3RoID0gcGxheWVyLmdldFZpZGVvQnVmZmVyTGVuZ3RoKCk7XG4gICAgICAgIGxldCBhdWRpb0J1ZmZlckxlbmd0aCA9IHBsYXllci5nZXRBdWRpb0J1ZmZlckxlbmd0aCgpO1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGJ1ZmZlciBsZW5ndGggd2hpY2ggaXMgdGhlIHNtYWxsZXIgbGVuZ3RoIG9mIHRoZSBhdWRpbyBhbmQgdmlkZW8gYnVmZmVycy4gSWYgb25lIG9mIHRoZXNlXG4gICAgICAgIC8vIGJ1ZmZlcnMgaXMgbm90IGF2YWlsYWJsZSwgd2Ugc2V0IGl0J3MgdmFsdWUgdG8gTUFYX1ZBTFVFIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBvdGhlciByZWFsIHZhbHVlIGlzIHRha2VuXG4gICAgICAgIC8vIGFzIHRoZSBidWZmZXIgbGVuZ3RoLlxuICAgICAgICBsZXQgYnVmZmVyTGVuZ3RoID0gTWF0aC5taW4oXG4gICAgICAgICAgdmlkZW9CdWZmZXJMZW5ndGggIT0gbnVsbCA/IHZpZGVvQnVmZmVyTGVuZ3RoIDogTnVtYmVyLk1BWF9WQUxVRSxcbiAgICAgICAgICBhdWRpb0J1ZmZlckxlbmd0aCAhPSBudWxsID8gYXVkaW9CdWZmZXJMZW5ndGggOiBOdW1iZXIuTUFYX1ZBTFVFKTtcbiAgICAgICAgLy8gSWYgYm90aCBidWZmZXIgbGVuZ3RocyBhcmUgbWlzc2luZywgd2Ugc2V0IHRoZSBidWZmZXIgbGVuZ3RoIHRvIHplcm9cbiAgICAgICAgaWYgKGJ1ZmZlckxlbmd0aCA9PT0gTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgICAgIGJ1ZmZlckxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYnVmZmVyUGVyY2VudGFnZSA9IDEwMCAvIHBsYXllci5nZXREdXJhdGlvbigpICogYnVmZmVyTGVuZ3RoO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBwbGF5YmFjayBwb3NpdGlvbiBvbmx5IGluIHBhdXNlZCBzdGF0ZSBvciBpbiB0aGUgaW5pdGlhbCBzdGFydHVwIHN0YXRlIHdoZXJlIHBsYXllciBpcyBuZWl0aGVyXG4gICAgICAgIC8vIHBhdXNlZCBub3IgcGxheWluZy4gUGxheWJhY2sgdXBkYXRlcyBhcmUgaGFuZGxlZCBpbiB0aGUgVGltZW91dCBiZWxvdy5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zID09PSBTZWVrQmFyLlNNT09USF9QTEFZQkFDS19QT1NJVElPTl9VUERBVEVfRElTQUJMRURcbiAgICAgICAgICB8fCBmb3JjZVVwZGF0ZSB8fCBwbGF5ZXIuaXNQYXVzZWQoKSB8fCAocGxheWVyLmlzUGF1c2VkKCkgPT09IHBsYXllci5pc1BsYXlpbmcoKSkpIHtcbiAgICAgICAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24ocGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRCdWZmZXJQb3NpdGlvbihwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSArIGJ1ZmZlclBlcmNlbnRhZ2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBVcGRhdGUgc2Vla2JhciB1cG9uIHRoZXNlIGV2ZW50c1xuICAgIC8vIGluaXQgcGxheWJhY2sgcG9zaXRpb24gd2hlbiB0aGUgcGxheWVyIGlzIHJlYWR5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHBsYXliYWNrUG9zaXRpb25IYW5kbGVyKTtcbiAgICAvLyB1cGRhdGUgcGxheWJhY2sgcG9zaXRpb24gd2hlbiBpdCBjaGFuZ2VzXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIGJ1ZmZlcmxldmVsIHdoZW4gYnVmZmVyaW5nIGlzIGNvbXBsZXRlXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1RBTExfRU5ERUQsIHBsYXliYWNrUG9zaXRpb25IYW5kbGVyKTtcbiAgICAvLyB1cGRhdGUgcGxheWJhY2sgcG9zaXRpb24gd2hlbiBhIHNlZWsgaGFzIGZpbmlzaGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gYSB0aW1lc2hpZnQgaGFzIGZpbmlzaGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVEVELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIGJ1ZmZlcmxldmVsIHdoZW4gYSBzZWdtZW50IGhhcyBiZWVuIGRvd25sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TRUdNRU5UX1JFUVVFU1RfRklOSVNIRUQsIHBsYXliYWNrUG9zaXRpb25IYW5kbGVyKTtcbiAgICAvLyB1cGRhdGUgcGxheWJhY2sgcG9zaXRpb24gb2YgQ2FzdCBwbGF5YmFja1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfVElNRV9VUERBVEVELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG5cblxuICAgIC8vIFNlZWsgaGFuZGxpbmdcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TRUVLLCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFNlZWtpbmcodHJ1ZSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFNlZWtpbmcoZmFsc2UpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfU0hJRlQsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U2Vla2luZyh0cnVlKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZURUQsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U2Vla2luZyhmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBsZXQgc2VlayA9IChwZXJjZW50YWdlOiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNMaXZlKCkpIHtcbiAgICAgICAgcGxheWVyLnRpbWVTaGlmdChwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgLSAocGxheWVyLmdldE1heFRpbWVTaGlmdCgpICogKHBlcmNlbnRhZ2UgLyAxMDApKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIuc2VlayhwbGF5ZXIuZ2V0RHVyYXRpb24oKSAqIChwZXJjZW50YWdlIC8gMTAwKSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLm9uU2Vlay5zdWJzY3JpYmUoKHNlbmRlcikgPT4ge1xuICAgICAgaXNTZWVraW5nID0gdHJ1ZTsgLy8gdHJhY2sgc2Vla2luZyBzdGF0dXMgc28gd2UgY2FuIGNhdGNoIGV2ZW50cyBmcm9tIHNlZWsgcHJldmlldyBzZWVrc1xuXG4gICAgICAvLyBOb3RpZnkgVUkgbWFuYWdlciBvZiBzdGFydGVkIHNlZWtcbiAgICAgIHVpbWFuYWdlci5vblNlZWsuZGlzcGF0Y2goc2VuZGVyKTtcblxuICAgICAgLy8gU2F2ZSBjdXJyZW50IHBsYXliYWNrIHN0YXRlXG4gICAgICBpc1BsYXlpbmcgPSBwbGF5ZXIuaXNQbGF5aW5nKCk7XG5cbiAgICAgIC8vIFBhdXNlIHBsYXliYWNrIHdoaWxlIHNlZWtpbmdcbiAgICAgIGlmIChpc1BsYXlpbmcpIHtcbiAgICAgICAgcGxheWVyLnBhdXNlKCd1aS1zZWVrJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5vblNlZWtQcmV2aWV3LnN1YnNjcmliZSgoc2VuZGVyOiBTZWVrQmFyLCBhcmdzOiBTZWVrUHJldmlld0V2ZW50QXJncykgPT4ge1xuICAgICAgLy8gTm90aWZ5IFVJIG1hbmFnZXIgb2Ygc2VlayBwcmV2aWV3XG4gICAgICB1aW1hbmFnZXIub25TZWVrUHJldmlldy5kaXNwYXRjaChzZW5kZXIsIGFyZ3MpO1xuICAgIH0pO1xuICAgIHRoaXMub25TZWVrUHJldmlldy5zdWJzY3JpYmVSYXRlTGltaXRlZCgoc2VuZGVyOiBTZWVrQmFyLCBhcmdzOiBTZWVrUHJldmlld0V2ZW50QXJncykgPT4ge1xuICAgICAgLy8gUmF0ZS1saW1pdGVkIHNjcnViYmluZyBzZWVrXG4gICAgICBpZiAoYXJncy5zY3J1YmJpbmcpIHtcbiAgICAgICAgc2VlayhhcmdzLnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9LCAyMDApO1xuICAgIHRoaXMub25TZWVrZWQuc3Vic2NyaWJlKChzZW5kZXIsIHBlcmNlbnRhZ2UpID0+IHtcbiAgICAgIGlzU2Vla2luZyA9IGZhbHNlO1xuXG4gICAgICAvLyBEbyB0aGUgc2Vla1xuICAgICAgc2VlayhwZXJjZW50YWdlKTtcblxuICAgICAgLy8gQ29udGludWUgcGxheWJhY2sgYWZ0ZXIgc2VlayBpZiBwbGF5ZXIgd2FzIHBsYXlpbmcgd2hlbiBzZWVrIHN0YXJ0ZWRcbiAgICAgIGlmIChpc1BsYXlpbmcpIHtcbiAgICAgICAgcGxheWVyLnBsYXkoJ3VpLXNlZWsnKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90aWZ5IFVJIG1hbmFnZXIgb2YgZmluaXNoZWQgc2Vla1xuICAgICAgdWltYW5hZ2VyLm9uU2Vla2VkLmRpc3BhdGNoKHNlbmRlcik7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5oYXNMYWJlbCgpKSB7XG4gICAgICAvLyBDb25maWd1cmUgYSBzZWVrYmFyIGxhYmVsIHRoYXQgaXMgaW50ZXJuYWwgdG8gdGhlIHNlZWtiYXIpXG4gICAgICB0aGlzLmdldExhYmVsKCkuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHNlZWtiYXIgZm9yIGxpdmUgc291cmNlcyB3aXRob3V0IHRpbWVzaGlmdFxuICAgIGxldCBpc0xpdmUgPSBmYWxzZTtcbiAgICBsZXQgaGFzVGltZVNoaWZ0ID0gZmFsc2U7XG4gICAgbGV0IHN3aXRjaFZpc2liaWxpdHkgPSAoaXNMaXZlOiBib29sZWFuLCBoYXNUaW1lU2hpZnQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGlmIChpc0xpdmUgJiYgIWhhc1RpbWVTaGlmdCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfVxuICAgICAgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIobnVsbCwgdHJ1ZSk7XG4gICAgICB0aGlzLnJlZnJlc2hQbGF5YmFja1Bvc2l0aW9uKCk7XG4gICAgfTtcbiAgICBuZXcgUGxheWVyVXRpbHMuTGl2ZVN0cmVhbURldGVjdG9yKHBsYXllcikub25MaXZlQ2hhbmdlZC5zdWJzY3JpYmUoKHNlbmRlciwgYXJnczogTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzKSA9PiB7XG4gICAgICBpc0xpdmUgPSBhcmdzLmxpdmU7XG4gICAgICBzd2l0Y2hWaXNpYmlsaXR5KGlzTGl2ZSwgaGFzVGltZVNoaWZ0KTtcbiAgICB9KTtcbiAgICBuZXcgUGxheWVyVXRpbHMuVGltZVNoaWZ0QXZhaWxhYmlsaXR5RGV0ZWN0b3IocGxheWVyKS5vblRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWQuc3Vic2NyaWJlKFxuICAgICAgKHNlbmRlciwgYXJnczogVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3MpID0+IHtcbiAgICAgICAgaGFzVGltZVNoaWZ0ID0gYXJncy50aW1lU2hpZnRBdmFpbGFibGU7XG4gICAgICAgIHN3aXRjaFZpc2liaWxpdHkoaXNMaXZlLCBoYXNUaW1lU2hpZnQpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBSZWZyZXNoIHRoZSBwbGF5YmFjayBwb3NpdGlvbiB3aGVuIHRoZSBwbGF5ZXIgcmVzaXplZCBvciB0aGUgVUkgaXMgY29uZmlndXJlZC4gVGhlIHBsYXliYWNrIHBvc2l0aW9uIG1hcmtlclxuICAgIC8vIGlzIHBvc2l0aW9uZWQgYWJzb2x1dGVseSBhbmQgbXVzdCB0aGVyZWZvcmUgYmUgdXBkYXRlZCB3aGVuIHRoZSBzaXplIG9mIHRoZSBzZWVrYmFyIGNoYW5nZXMuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUVSX1JFU0laRSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuICAgIC8vIEFkZGl0aW9uYWxseSwgd2hlbiB0aGlzIGNvZGUgaXMgY2FsbGVkLCB0aGUgc2Vla2JhciBpcyBub3QgcGFydCBvZiB0aGUgVUkgeWV0IGFuZCB0aGVyZWZvcmUgZG9lcyBub3QgaGF2ZSBhIHNpemUsXG4gICAgLy8gcmVzdWx0aW5nIGluIGEgd3JvbmcgaW5pdGlhbCBwb3NpdGlvbiBvZiB0aGUgbWFya2VyLiBSZWZyZXNoaW5nIGl0IG9uY2UgdGhlIFVJIGlzIGNvbmZpZ3VyZWQgc29sdmVkIHRoaXMgaXNzdWUuXG4gICAgdWltYW5hZ2VyLm9uQ29uZmlndXJlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuICAgIC8vIEl0IGNhbiBhbHNvIGhhcHBlbiB0aGF0IHRoZSB2YWx1ZSBjaGFuZ2VzIG9uY2UgdGhlIHBsYXllciBpcyByZWFkeSwgb3Igd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkLCBzbyB3ZSBuZWVkXG4gICAgLy8gdG8gdXBkYXRlIG9uIE9OX1JFQURZIHRvb1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hQbGF5YmFja1Bvc2l0aW9uKCk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0aWFsaXplIHNlZWtiYXJcbiAgICBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcigpOyAvLyBTZXQgdGhlIHBsYXliYWNrIHBvc2l0aW9uXG4gICAgdGhpcy5zZXRCdWZmZXJQb3NpdGlvbigwKTtcbiAgICB0aGlzLnNldFNlZWtQb3NpdGlvbigwKTtcbiAgICBpZiAodGhpcy5jb25maWcuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZUludGVydmFsTXMgIT09IFNlZWtCYXIuU01PT1RIX1BMQVlCQUNLX1BPU0lUSU9OX1VQREFURV9ESVNBQkxFRCkge1xuICAgICAgdGhpcy5jb25maWd1cmVTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcihwbGF5ZXIsIHVpbWFuYWdlcik7XG4gICAgfVxuICAgIHRoaXMuY29uZmlndXJlTWFya2VycyhwbGF5ZXIsIHVpbWFuYWdlcik7XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZVNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIC8qXG4gICAgICogUGxheWJhY2sgcG9zaXRpb24gdXBkYXRlXG4gICAgICpcbiAgICAgKiBXZSBkbyBub3QgdXBkYXRlIHRoZSBwb3NpdGlvbiBkaXJlY3RseSBmcm9tIHRoZSBPTl9USU1FX0NIQU5HRUQgZXZlbnQsIGJlY2F1c2UgaXQgYXJyaXZlcyB2ZXJ5IGppdHRlcnkgYW5kXG4gICAgICogcmVzdWx0cyBpbiBhIGppdHRlcnkgcG9zaXRpb24gaW5kaWNhdG9yIHNpbmNlIHRoZSBDU1MgdHJhbnNpdGlvbiB0aW1lIGlzIHN0YXRpY2FsbHkgc2V0LlxuICAgICAqIFRvIHdvcmsgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIG1haW50YWluIGEgbG9jYWwgcGxheWJhY2sgcG9zaXRpb24gdGhhdCBpcyB1cGRhdGVkIGluIGEgc3RhYmxlIHJlZ3VsYXIgaW50ZXJ2YWxcbiAgICAgKiBhbmQga2VwdCBpbiBzeW5jIHdpdGggdGhlIHBsYXllci5cbiAgICAgKi9cbiAgICBsZXQgY3VycmVudFRpbWVTZWVrQmFyID0gMDtcbiAgICBsZXQgY3VycmVudFRpbWVQbGF5ZXIgPSAwO1xuICAgIGxldCB1cGRhdGVJbnRlcnZhbE1zID0gNTA7XG4gICAgbGV0IGN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzID0gdXBkYXRlSW50ZXJ2YWxNcyAvIDEwMDA7XG5cbiAgICB0aGlzLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyID0gbmV3IFRpbWVvdXQodXBkYXRlSW50ZXJ2YWxNcywgKCkgPT4ge1xuICAgICAgY3VycmVudFRpbWVTZWVrQmFyICs9IGN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzO1xuICAgICAgY3VycmVudFRpbWVQbGF5ZXIgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcblxuICAgICAgLy8gU3luYyBjdXJyZW50VGltZSBvZiBzZWVrYmFyIHRvIHBsYXllclxuICAgICAgbGV0IGN1cnJlbnRUaW1lRGVsdGEgPSBjdXJyZW50VGltZVNlZWtCYXIgLSBjdXJyZW50VGltZVBsYXllcjtcbiAgICAgIC8vIElmIHRoZSBkZWx0YSBpcyBsYXJnZXIgdGhhdCAyIHNlY3MsIGRpcmVjdGx5IGp1bXAgdGhlIHNlZWtiYXIgdG8gdGhlXG4gICAgICAvLyBwbGF5ZXIgdGltZSBpbnN0ZWFkIG9mIHNtb290aGx5IGZhc3QgZm9yd2FyZGluZy9yZXdpbmRpbmcuXG4gICAgICBpZiAoTWF0aC5hYnMoY3VycmVudFRpbWVEZWx0YSkgPiAyKSB7XG4gICAgICAgIGN1cnJlbnRUaW1lU2Vla0JhciA9IGN1cnJlbnRUaW1lUGxheWVyO1xuICAgICAgfVxuICAgICAgLy8gSWYgY3VycmVudFRpbWVEZWx0YSBpcyBuZWdhdGl2ZSBhbmQgYmVsb3cgdGhlIGFkanVzdG1lbnQgdGhyZXNob2xkLFxuICAgICAgLy8gdGhlIHBsYXllciBpcyBhaGVhZCBvZiB0aGUgc2Vla2JhciBhbmQgd2UgJ2Zhc3QgZm9yd2FyZCcgdGhlIHNlZWtiYXJcbiAgICAgIGVsc2UgaWYgKGN1cnJlbnRUaW1lRGVsdGEgPD0gLWN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzKSB7XG4gICAgICAgIGN1cnJlbnRUaW1lU2Vla0JhciArPSBjdXJyZW50VGltZVVwZGF0ZURlbHRhU2VjcztcbiAgICAgIH1cbiAgICAgIC8vIElmIGN1cnJlbnRUaW1lRGVsdGEgaXMgcG9zaXRpdmUgYW5kIGFib3ZlIHRoZSBhZGp1c3RtZW50IHRocmVzaG9sZCxcbiAgICAgIC8vIHRoZSBwbGF5ZXIgaXMgYmVoaW5kIHRoZSBzZWVrYmFyIGFuZCB3ZSAncmV3aW5kJyB0aGUgc2Vla2JhclxuICAgICAgZWxzZSBpZiAoY3VycmVudFRpbWVEZWx0YSA+PSBjdXJyZW50VGltZVVwZGF0ZURlbHRhU2Vjcykge1xuICAgICAgICBjdXJyZW50VGltZVNlZWtCYXIgLT0gY3VycmVudFRpbWVVcGRhdGVEZWx0YVNlY3M7XG4gICAgICB9XG5cbiAgICAgIGxldCBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDEwMCAvIHBsYXllci5nZXREdXJhdGlvbigpICogY3VycmVudFRpbWVTZWVrQmFyO1xuICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIGxldCBzdGFydFNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyID0gKCkgPT4ge1xuICAgICAgaWYgKCFwbGF5ZXIuaXNMaXZlKCkpIHtcbiAgICAgICAgY3VycmVudFRpbWVTZWVrQmFyID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuY2xlYXIoKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgc3RhcnRTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9QTEFZSU5HLCBzdGFydFNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QQVVTRUQsIHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9QQVVTRUQsIHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCAoKSA9PiB7XG4gICAgICBjdXJyZW50VGltZVNlZWtCYXIgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgIHN0YXJ0U21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZU1hcmtlcnMocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgbGV0IGNsZWFyTWFya2VycyA9ICgpID0+IHtcbiAgICAgIHRoaXMudGltZWxpbmVNYXJrZXJzID0gW107XG4gICAgICB0aGlzLnVwZGF0ZU1hcmtlcnMoKTtcbiAgICB9O1xuXG4gICAgbGV0IHNldHVwTWFya2VycyA9ICgpID0+IHtcbiAgICAgIGNsZWFyTWFya2VycygpO1xuXG4gICAgICBsZXQgaGFzTWFya2Vyc0luVWlDb25maWcgPSB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEgJiYgdWltYW5hZ2VyLmdldENvbmZpZygpLm1ldGFkYXRhLm1hcmtlcnNcbiAgICAgICAgJiYgdWltYW5hZ2VyLmdldENvbmZpZygpLm1ldGFkYXRhLm1hcmtlcnMubGVuZ3RoID4gMDtcbiAgICAgIGxldCBoYXNNYXJrZXJzSW5QbGF5ZXJDb25maWcgPSBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UubWFya2Vyc1xuICAgICAgICAmJiBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLm1hcmtlcnMubGVuZ3RoID4gMDtcblxuICAgICAgLy8gVGFrZSBtYXJrZXJzIGZyb20gdGhlIFVJIGNvbmZpZy4gSWYgbm8gbWFya2VycyBkZWZpbmVkLCB0cnkgdG8gdGFrZSB0aGVtIGZyb20gdGhlIHBsYXllcidzIHNvdXJjZSBjb25maWcuXG4gICAgICBsZXQgbWFya2VycyA9IGhhc01hcmtlcnNJblVpQ29uZmlnID8gdWltYW5hZ2VyLmdldENvbmZpZygpLm1ldGFkYXRhLm1hcmtlcnMgOlxuICAgICAgICBoYXNNYXJrZXJzSW5QbGF5ZXJDb25maWcgPyBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLm1hcmtlcnMgOiBudWxsO1xuXG4gICAgICAvLyBHZW5lcmF0ZSB0aW1lbGluZSBtYXJrZXJzIGZyb20gdGhlIGNvbmZpZyBpZiB3ZSBoYXZlIG1hcmtlcnMgYW5kIGlmIHdlIGhhdmUgYSBkdXJhdGlvblxuICAgICAgLy8gVGhlIGR1cmF0aW9uIGNoZWNrIGlzIGZvciBidWdneSBwbGF0Zm9ybXMgd2hlcmUgdGhlIGR1cmF0aW9uIGlzIG5vdCBhdmFpbGFibGUgaW5zdGFudGx5IChDaHJvbWUgb24gQW5kcm9pZCA0LjMpXG4gICAgICBpZiAobWFya2VycyAmJiBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgZm9yIChsZXQgbyBvZiBtYXJrZXJzKSB7XG4gICAgICAgICAgbGV0IG1hcmtlciA9IHtcbiAgICAgICAgICAgIHRpbWU6IDEwMCAvIHBsYXllci5nZXREdXJhdGlvbigpICogby50aW1lLCAvLyBjb252ZXJ0IHRpbWUgdG8gcGVyY2VudGFnZVxuICAgICAgICAgICAgdGl0bGU6IG8udGl0bGUsXG4gICAgICAgICAgICBtYXJrZXJUeXBlOiAnJyArIChvLm1hcmtlclR5cGUgfHwgMSksXG4gICAgICAgICAgICBjb21tZW50OiBvLmNvbW1lbnQgfHwgJycsXG4gICAgICAgICAgICBhdmF0YXI6IG8uYXZhdGFyLFxuICAgICAgICAgICAgbnVtYmVyOiBvLm51bWJlciB8fCAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRpbWVsaW5lTWFya2Vycy5wdXNoKG1hcmtlcilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgdGltZWxpbmUgd2l0aCB0aGUgbWFya2Vyc1xuICAgICAgdGhpcy51cGRhdGVNYXJrZXJzKCk7XG4gICAgfTtcblxuICAgIC8vIEFkZCBtYXJrZXJzIHdoZW4gYSBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHNldHVwTWFya2Vycyk7XG4gICAgLy8gUmVtb3ZlIG1hcmtlcnMgd2hlbiB1bmxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgY2xlYXJNYXJrZXJzKTtcblxuICAgIC8vIEluaXQgbWFya2VycyBhdCBzdGFydHVwXG4gICAgc2V0dXBNYXJrZXJzKCk7XG4gIH1cblxuICByZWxlYXNlKCk6IHZvaWQge1xuICAgIHN1cGVyLnJlbGVhc2UoKTtcblxuICAgIGlmICh0aGlzLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyKSB7IC8vIG9iamVjdCBtdXN0IG5vdCBuZWNlc3NhcmlseSBleGlzdCwgZS5nLiBpbiB2b2x1bWUgc2xpZGVyIHN1YmNsYXNzXG4gICAgICB0aGlzLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyLmNsZWFyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGlmICh0aGlzLmNvbmZpZy52ZXJ0aWNhbCkge1xuICAgICAgdGhpcy5jb25maWcuY3NzQ2xhc3Nlcy5wdXNoKCd2ZXJ0aWNhbCcpO1xuICAgIH1cblxuICAgIGxldCBzZWVrQmFyQ29udGFpbmVyID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKVxuICAgIH0pO1xuXG4gICAgbGV0IHNlZWtCYXIgPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnc2Vla2JhcicpXG4gICAgfSk7XG4gICAgdGhpcy5zZWVrQmFyID0gc2Vla0JhcjtcblxuICAgIC8vIEluZGljYXRvciB0aGF0IHNob3dzIHRoZSBidWZmZXIgZmlsbCBsZXZlbFxuICAgIGxldCBzZWVrQmFyQnVmZmVyTGV2ZWwgPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1idWZmZXJsZXZlbCcpXG4gICAgfSk7XG4gICAgdGhpcy5zZWVrQmFyQnVmZmVyUG9zaXRpb24gPSBzZWVrQmFyQnVmZmVyTGV2ZWw7XG5cbiAgICAvLyBJbmRpY2F0b3IgdGhhdCBzaG93cyB0aGUgY3VycmVudCBwbGF5YmFjayBwb3NpdGlvblxuICAgIGxldCBzZWVrQmFyUGxheWJhY2tQb3NpdGlvbiA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLXBsYXliYWNrcG9zaXRpb24nKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhclBsYXliYWNrUG9zaXRpb24gPSBzZWVrQmFyUGxheWJhY2tQb3NpdGlvbjtcblxuICAgIC8vIEEgbWFya2VyIG9mIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uLCBlLmcuIGEgZG90IG9yIGxpbmVcbiAgICBsZXQgc2Vla0JhclBsYXliYWNrUG9zaXRpb25NYXJrZXIgPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1wbGF5YmFja3Bvc2l0aW9uLW1hcmtlcicpXG4gICAgfSk7XG4gICAgdGhpcy5zZWVrQmFyUGxheWJhY2tQb3NpdGlvbk1hcmtlciA9IHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyO1xuXG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgc2hvdyB3aGVyZSBhIHNlZWsgd2lsbCBnbyB0b1xuICAgIGxldCBzZWVrQmFyU2Vla1Bvc2l0aW9uID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItc2Vla3Bvc2l0aW9uJylcbiAgICB9KTtcbiAgICB0aGlzLnNlZWtCYXJTZWVrUG9zaXRpb24gPSBzZWVrQmFyU2Vla1Bvc2l0aW9uO1xuXG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgc2hvd3MgdGhlIGZ1bGwgc2Vla2JhclxuICAgIGxldCBzZWVrQmFyQmFja2Ryb3AgPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1iYWNrZHJvcCcpXG4gICAgfSk7XG4gICAgdGhpcy5zZWVrQmFyQmFja2Ryb3AgPSBzZWVrQmFyQmFja2Ryb3A7XG5cbiAgICBsZXQgc2Vla0JhckNoYXB0ZXJNYXJrZXJzQ29udGFpbmVyID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItbWFya2VycycpXG4gICAgfSk7XG4gICAgdGhpcy5zZWVrQmFyTWFya2Vyc0NvbnRhaW5lciA9IHNlZWtCYXJDaGFwdGVyTWFya2Vyc0NvbnRhaW5lcjtcblxuICAgIHNlZWtCYXIuYXBwZW5kKHNlZWtCYXJCYWNrZHJvcCwgc2Vla0JhckJ1ZmZlckxldmVsLCBzZWVrQmFyU2Vla1Bvc2l0aW9uLFxuICAgICAgc2Vla0JhclBsYXliYWNrUG9zaXRpb24sIHNlZWtCYXJDaGFwdGVyTWFya2Vyc0NvbnRhaW5lciwgc2Vla0JhclBsYXliYWNrUG9zaXRpb25NYXJrZXIpO1xuXG4gICAgbGV0IHNlZWtpbmcgPSBmYWxzZTtcblxuICAgIC8vIERlZmluZSBoYW5kbGVyIGZ1bmN0aW9ucyBzbyB3ZSBjYW4gYXR0YWNoL3JlbW92ZSB0aGVtIGxhdGVyXG4gICAgbGV0IG1vdXNlVG91Y2hNb3ZlSGFuZGxlciA9IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpb24gdG8gVlIgaGFuZGxlclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgbGV0IHRhcmdldFBlcmNlbnRhZ2UgPSAxMDAgKiB0aGlzLmdldE9mZnNldChlKTtcbiAgICAgIHRoaXMuc2V0U2Vla1Bvc2l0aW9uKHRhcmdldFBlcmNlbnRhZ2UpO1xuICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHRhcmdldFBlcmNlbnRhZ2UpO1xuICAgICAgdGhpcy5vblNlZWtQcmV2aWV3RXZlbnQodGFyZ2V0UGVyY2VudGFnZSwgdHJ1ZSk7XG4gICAgfTtcbiAgICBsZXQgbW91c2VUb3VjaFVwSGFuZGxlciA9IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAvLyBSZW1vdmUgaGFuZGxlcnMsIHNlZWsgb3BlcmF0aW9uIGlzIGZpbmlzaGVkXG4gICAgICBuZXcgRE9NKGRvY3VtZW50KS5vZmYoJ3RvdWNobW92ZSBtb3VzZW1vdmUnLCBtb3VzZVRvdWNoTW92ZUhhbmRsZXIpO1xuICAgICAgbmV3IERPTShkb2N1bWVudCkub2ZmKCd0b3VjaGVuZCBtb3VzZXVwJywgbW91c2VUb3VjaFVwSGFuZGxlcik7XG5cbiAgICAgIGxldCB0YXJnZXRQZXJjZW50YWdlID0gMTAwICogdGhpcy5nZXRPZmZzZXQoZSk7XG4gICAgICBsZXQgc25hcHBlZENoYXB0ZXIgPSB0aGlzLmdldE1hcmtlckF0UG9zaXRpb24odGFyZ2V0UGVyY2VudGFnZSk7XG5cbiAgICAgIHRoaXMuc2V0U2Vla2luZyhmYWxzZSk7XG4gICAgICBzZWVraW5nID0gZmFsc2U7XG5cbiAgICAgIC8vIEZpcmUgc2Vla2VkIGV2ZW50XG4gICAgICB0aGlzLm9uU2Vla2VkRXZlbnQoc25hcHBlZENoYXB0ZXIgPyBzbmFwcGVkQ2hhcHRlci50aW1lIDogdGFyZ2V0UGVyY2VudGFnZSk7XG4gICAgfTtcblxuICAgIC8vIEEgc2VlayBhbHdheXMgc3RhcnQgd2l0aCBhIHRvdWNoc3RhcnQgb3IgbW91c2Vkb3duIGRpcmVjdGx5IG9uIHRoZSBzZWVrYmFyLlxuICAgIC8vIFRvIHRyYWNrIGEgbW91c2Ugc2VlayBhbHNvIG91dHNpZGUgdGhlIHNlZWtiYXIgKGZvciB0b3VjaCBldmVudHMgdGhpcyB3b3JrcyBhdXRvbWF0aWNhbGx5KSxcbiAgICAvLyBzbyB0aGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIHRha2UgY2FyZSB0aGF0IHRoZSBtb3VzZSBhbHdheXMgc3RheXMgb24gdGhlIHNlZWtiYXIsIHdlIGF0dGFjaCB0aGUgbW91c2Vtb3ZlXG4gICAgLy8gYW5kIG1vdXNldXAgaGFuZGxlcnMgdG8gdGhlIHdob2xlIGRvY3VtZW50LiBBIHNlZWsgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgbGlmdHMgdGhlIG1vdXNlIGtleS5cbiAgICAvLyBBIHNlZWsgbW91c2UgZ2VzdHVyZSBpcyB0aHVzIGJhc2ljYWxseSBhIGNsaWNrIHdpdGggYSBsb25nIHRpbWUgZnJhbWUgYmV0d2VlbiBkb3duIGFuZCB1cCBldmVudHMuXG4gICAgc2Vla0Jhci5vbigndG91Y2hzdGFydCBtb3VzZWRvd24nLCAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCBpc1RvdWNoRXZlbnQgPSB0aGlzLnRvdWNoU3VwcG9ydGVkICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50O1xuXG4gICAgICAvLyBQcmV2ZW50IHNlbGVjdGlvbiBvZiBET00gZWxlbWVudHMgKGFsc28gcHJldmVudHMgbW91c2Vkb3duIGlmIGN1cnJlbnQgZXZlbnQgaXMgdG91Y2hzdGFydClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW9uIHRvIFZSIGhhbmRsZXJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMuc2V0U2Vla2luZyh0cnVlKTsgLy8gU2V0IHNlZWtpbmcgY2xhc3Mgb24gRE9NIGVsZW1lbnRcbiAgICAgIHNlZWtpbmcgPSB0cnVlOyAvLyBTZXQgc2VlayB0cmFja2luZyBmbGFnXG5cbiAgICAgIC8vIEZpcmUgc2Vla2VkIGV2ZW50XG4gICAgICB0aGlzLm9uU2Vla0V2ZW50KCk7XG5cbiAgICAgIC8vIEFkZCBoYW5kbGVyIHRvIHRyYWNrIHRoZSBzZWVrIG9wZXJhdGlvbiBvdmVyIHRoZSB3aG9sZSBkb2N1bWVudFxuICAgICAgbmV3IERPTShkb2N1bWVudCkub24oaXNUb3VjaEV2ZW50ID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJywgbW91c2VUb3VjaE1vdmVIYW5kbGVyKTtcbiAgICAgIG5ldyBET00oZG9jdW1lbnQpLm9uKGlzVG91Y2hFdmVudCA/ICd0b3VjaGVuZCcgOiAnbW91c2V1cCcsIG1vdXNlVG91Y2hVcEhhbmRsZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gRGlzcGxheSBzZWVrIHRhcmdldCBpbmRpY2F0b3Igd2hlbiBtb3VzZSBob3ZlcnMgb3IgZmluZ2VyIHNsaWRlcyBvdmVyIHNlZWtiYXJcbiAgICBzZWVrQmFyLm9uKCd0b3VjaG1vdmUgbW91c2Vtb3ZlJywgKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGlmIChzZWVraW5nKSB7XG4gICAgICAgIC8vIER1cmluZyBhIHNlZWsgKHdoZW4gbW91c2UgaXMgZG93biBvciB0b3VjaCBtb3ZlIGFjdGl2ZSksIHdlIG5lZWQgdG8gc3RvcCBwcm9wYWdhdGlvbiB0byBhdm9pZFxuICAgICAgICAvLyB0aGUgVlIgdmlld3BvcnQgcmVhY3RpbmcgdG8gdGhlIG1vdmVzLlxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyBCZWNhdXNlIHRoZSBzdG9wcGVkIHByb3BhZ2F0aW9uIGluaGliaXRzIHRoZSBldmVudCBvbiB0aGUgZG9jdW1lbnQsIHdlIG5lZWQgdG8gY2FsbCBpdCBmcm9tIGhlcmVcbiAgICAgICAgbW91c2VUb3VjaE1vdmVIYW5kbGVyKGUpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcG9zaXRpb24gPSAxMDAgKiB0aGlzLmdldE9mZnNldChlKTtcbiAgICAgIHRoaXMuc2V0U2Vla1Bvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgIHRoaXMub25TZWVrUHJldmlld0V2ZW50KHBvc2l0aW9uLCBmYWxzZSk7XG5cbiAgICAgIGlmICh0aGlzLmhhc0xhYmVsKCkgJiYgdGhpcy5nZXRMYWJlbCgpLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy5nZXRMYWJlbCgpLnNob3coKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEhpZGUgc2VlayB0YXJnZXQgaW5kaWNhdG9yIHdoZW4gbW91c2Ugb3IgZmluZ2VyIGxlYXZlcyBzZWVrYmFyXG4gICAgc2Vla0Jhci5vbigndG91Y2hlbmQgbW91c2VsZWF2ZScsIChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLnNldFNlZWtQb3NpdGlvbigwKTtcblxuICAgICAgaWYgKHRoaXMuaGFzTGFiZWwoKSkge1xuICAgICAgICB0aGlzLmdldExhYmVsKCkuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2Vla0JhckNvbnRhaW5lci5hcHBlbmQoc2Vla0Jhcik7XG5cbiAgICBpZiAodGhpcy5sYWJlbCkge1xuICAgICAgc2Vla0JhckNvbnRhaW5lci5hcHBlbmQodGhpcy5sYWJlbC5nZXREb21FbGVtZW50KCkpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWVrQmFyQ29udGFpbmVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZU1hcmtlcnMoKTogdm9pZCB7XG4gICAgdGhpcy5zZWVrQmFyTWFya2Vyc0NvbnRhaW5lci5lbXB0eSgpO1xuXG4gICAgZm9yIChsZXQgbWFya2VyIG9mIHRoaXMudGltZWxpbmVNYXJrZXJzKSB7XG4gICAgICBsZXQgY2xhc3NOYW1lID0gbWFya2VyLm1hcmtlclR5cGUgPT09ICcyJyA/IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLW1hcmtlci10eXBldHdvJykgOiB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1tYXJrZXInKVxuXG4gICAgICBsZXQgbWFya2VyRG9tID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgICAnY2xhc3MnOiBjbGFzc05hbWUsXG4gICAgICAgICdkYXRhLW1hcmtlci10aW1lJzogU3RyaW5nKG1hcmtlci50aW1lKSxcbiAgICAgICAgJ2RhdGEtbWFya2VyLXRpdGxlJzogU3RyaW5nKG1hcmtlci50aXRsZSksXG4gICAgICB9KS5jc3Moe1xuICAgICAgICAnd2lkdGgnOiBtYXJrZXIudGltZSArICclJyxcbiAgICAgIH0pXG4gICAgICB0aGlzLnNlZWtCYXJNYXJrZXJzQ29udGFpbmVyLmFwcGVuZChtYXJrZXJEb20pXG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldE1hcmtlckF0UG9zaXRpb24ocGVyY2VudGFnZTogbnVtYmVyKTogVGltZWxpbmVNYXJrZXIgfCBudWxsIHtcbiAgICBsZXQgc25hcHBlZE1hcmtlcjogVGltZWxpbmVNYXJrZXIgPSBudWxsO1xuICAgIGxldCBzbmFwcGluZ1JhbmdlID0gMTtcbiAgICBpZiAodGhpcy50aW1lbGluZU1hcmtlcnMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgbWFya2VyIG9mIHRoaXMudGltZWxpbmVNYXJrZXJzKSB7XG4gICAgICAgIGlmIChwZXJjZW50YWdlID49IG1hcmtlci50aW1lIC0gc25hcHBpbmdSYW5nZSAmJiBwZXJjZW50YWdlIDw9IG1hcmtlci50aW1lICsgc25hcHBpbmdSYW5nZSkge1xuICAgICAgICAgIHNuYXBwZWRNYXJrZXIgPSBtYXJrZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc25hcHBlZE1hcmtlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBob3Jpem9udGFsIG9mZnNldCBvZiBhIG1vdXNlL3RvdWNoIGV2ZW50IHBvaW50IGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgc2VlayBiYXIuXG4gICAqIEBwYXJhbSBldmVudFBhZ2VYIHRoZSBwYWdlWCBjb29yZGluYXRlIG9mIGFuIGV2ZW50IHRvIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0IGZyb21cbiAgICogQHJldHVybnMge251bWJlcn0gYSBudW1iZXIgaW4gdGhlIHJhbmdlIG9mIFswLCAxXSwgd2hlcmUgMCBpcyB0aGUgbGVmdCBlZGdlIGFuZCAxIGlzIHRoZSByaWdodCBlZGdlXG4gICAqL1xuICBwcml2YXRlIGdldEhvcml6b250YWxPZmZzZXQoZXZlbnRQYWdlWDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBsZXQgZWxlbWVudE9mZnNldFB4ID0gdGhpcy5zZWVrQmFyLm9mZnNldCgpLmxlZnQ7XG4gICAgbGV0IHdpZHRoUHggPSB0aGlzLnNlZWtCYXIud2lkdGgoKTtcbiAgICBsZXQgb2Zmc2V0UHggPSBldmVudFBhZ2VYIC0gZWxlbWVudE9mZnNldFB4O1xuICAgIGxldCBvZmZzZXQgPSAxIC8gd2lkdGhQeCAqIG9mZnNldFB4O1xuXG4gICAgcmV0dXJuIHRoaXMuc2FuaXRpemVPZmZzZXQob2Zmc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2ZXJ0aWNhbCBvZmZzZXQgb2YgYSBtb3VzZS90b3VjaCBldmVudCBwb2ludCBmcm9tIHRoZSBib3R0b20gZWRnZSBvZiB0aGUgc2VlayBiYXIuXG4gICAqIEBwYXJhbSBldmVudFBhZ2VZIHRoZSBwYWdlWCBjb29yZGluYXRlIG9mIGFuIGV2ZW50IHRvIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0IGZyb21cbiAgICogQHJldHVybnMge251bWJlcn0gYSBudW1iZXIgaW4gdGhlIHJhbmdlIG9mIFswLCAxXSwgd2hlcmUgMCBpcyB0aGUgYm90dG9tIGVkZ2UgYW5kIDEgaXMgdGhlIHRvcCBlZGdlXG4gICAqL1xuICBwcml2YXRlIGdldFZlcnRpY2FsT2Zmc2V0KGV2ZW50UGFnZVk6IG51bWJlcik6IG51bWJlciB7XG4gICAgbGV0IGVsZW1lbnRPZmZzZXRQeCA9IHRoaXMuc2Vla0Jhci5vZmZzZXQoKS50b3A7XG4gICAgbGV0IHdpZHRoUHggPSB0aGlzLnNlZWtCYXIuaGVpZ2h0KCk7XG4gICAgbGV0IG9mZnNldFB4ID0gZXZlbnRQYWdlWSAtIGVsZW1lbnRPZmZzZXRQeDtcbiAgICBsZXQgb2Zmc2V0ID0gMSAvIHdpZHRoUHggKiBvZmZzZXRQeDtcblxuICAgIHJldHVybiAxIC0gdGhpcy5zYW5pdGl6ZU9mZnNldChvZmZzZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1vdXNlIG9yIHRvdWNoIGV2ZW50IG9mZnNldCBmb3IgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiAoaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCkuXG4gICAqIEBwYXJhbSBlIHRoZSBldmVudCB0byBjYWxjdWxhdGUgdGhlIG9mZnNldCBmcm9tXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGEgbnVtYmVyIGluIHRoZSByYW5nZSBvZiBbMCwgMV1cbiAgICogQHNlZSAjZ2V0SG9yaXpvbnRhbE9mZnNldFxuICAgKiBAc2VlICNnZXRWZXJ0aWNhbE9mZnNldFxuICAgKi9cbiAgcHJpdmF0ZSBnZXRPZmZzZXQoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLnRvdWNoU3VwcG9ydGVkICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5jb25maWcudmVydGljYWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmVydGljYWxPZmZzZXQoZS50eXBlID09PSAndG91Y2hlbmQnID8gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWSA6IGUudG91Y2hlc1swXS5wYWdlWSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRIb3Jpem9udGFsT2Zmc2V0KGUudHlwZSA9PT0gJ3RvdWNoZW5kJyA/IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggOiBlLnRvdWNoZXNbMF0ucGFnZVgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChlIGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnZlcnRpY2FsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZlcnRpY2FsT2Zmc2V0KGUucGFnZVkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SG9yaXpvbnRhbE9mZnNldChlLnBhZ2VYKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoY29uc29sZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ2ludmFsaWQgZXZlbnQnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYW5pdGl6ZXMgdGhlIG1vdXNlIG9mZnNldCB0byB0aGUgcmFuZ2Ugb2YgWzAsIDFdLlxuICAgKlxuICAgKiBXaGVuIHRyYWNraW5nIHRoZSBtb3VzZSBvdXRzaWRlIHRoZSBzZWVrIGJhciwgdGhlIG9mZnNldCBjYW4gYmUgb3V0c2lkZSB0aGUgZGVzaXJlZCByYW5nZSBhbmQgdGhpcyBtZXRob2RcbiAgICogbGltaXRzIGl0IHRvIHRoZSBkZXNpcmVkIHJhbmdlLiBFLmcuIGEgbW91c2UgZXZlbnQgbGVmdCBvZiB0aGUgbGVmdCBlZGdlIG9mIGEgc2VlayBiYXIgeWllbGRzIGFuIG9mZnNldCBiZWxvd1xuICAgKiB6ZXJvLCBidXQgdG8gZGlzcGxheSB0aGUgc2VlayB0YXJnZXQgb24gdGhlIHNlZWsgYmFyLCB3ZSBuZWVkIHRvIGxpbWl0IGl0IHRvIHplcm8uXG4gICAqXG4gICAqIEBwYXJhbSBvZmZzZXQgdGhlIG9mZnNldCB0byBzYW5pdGl6ZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgc2FuaXRpemVkIG9mZnNldC5cbiAgICovXG4gIHByaXZhdGUgc2FuaXRpemVPZmZzZXQob2Zmc2V0OiBudW1iZXIpIHtcbiAgICAvLyBTaW5jZSB3ZSB0cmFjayBtb3VzZSBtb3ZlcyBvdmVyIHRoZSB3aG9sZSBkb2N1bWVudCwgdGhlIHRhcmdldCBjYW4gYmUgb3V0c2lkZSB0aGUgc2VlayByYW5nZSxcbiAgICAvLyBhbmQgd2UgbmVlZCB0byBsaW1pdCBpdCB0byB0aGUgWzAsIDFdIHJhbmdlLlxuICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICBvZmZzZXQgPSAwO1xuICAgIH0gZWxzZSBpZiAob2Zmc2V0ID4gMSkge1xuICAgICAgb2Zmc2V0ID0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwbGF5YmFjayBwb3NpdGlvbiBpbmRpY2F0b3IuXG4gICAqIEBwYXJhbSBwZXJjZW50IGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMTAwIGFzIHJldHVybmVkIGJ5IHRoZSBwbGF5ZXJcbiAgICovXG4gIHNldFBsYXliYWNrUG9zaXRpb24ocGVyY2VudDogbnVtYmVyKSB7XG4gICAgdGhpcy5wbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IHBlcmNlbnQ7XG5cbiAgICAvLyBTZXQgcG9zaXRpb24gb2YgdGhlIGJhclxuICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5zZWVrQmFyUGxheWJhY2tQb3NpdGlvbiwgcGVyY2VudCk7XG5cbiAgICAvLyBTZXQgcG9zaXRpb24gb2YgdGhlIG1hcmtlclxuICAgIGxldCBweCA9ICh0aGlzLmNvbmZpZy52ZXJ0aWNhbCA/IHRoaXMuc2Vla0Jhci5oZWlnaHQoKSA6IHRoaXMuc2Vla0Jhci53aWR0aCgpKSAvIDEwMCAqIHBlcmNlbnQ7XG4gICAgaWYgKHRoaXMuY29uZmlnLnZlcnRpY2FsKSB7XG4gICAgICBweCA9IHRoaXMuc2Vla0Jhci5oZWlnaHQoKSAtIHB4O1xuICAgIH1cbiAgICBsZXQgc3R5bGUgPSB0aGlzLmNvbmZpZy52ZXJ0aWNhbCA/XG4gICAgICAvLyAtbXMtdHJhbnNmb3JtIHJlcXVpcmVkIGZvciBJRTlcbiAgICAgIHsgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKCcgKyBweCArICdweCknLCAnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKCcgKyBweCArICdweCknIH0gOlxuICAgICAgeyAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoJyArIHB4ICsgJ3B4KScsICctbXMtdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoJyArIHB4ICsgJ3B4KScgfTtcbiAgICB0aGlzLnNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyLmNzcyhzdHlsZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVmcmVzaGVzIHRoZSBwbGF5YmFjayBwb3NpdGlvbi4gQ2FuIGJlIHVzZWQgYnkgc3ViY2xhc3NlcyB0byByZWZyZXNoIHRoZSBwb3NpdGlvbiB3aGVuXG4gICAqIHRoZSBzaXplIG9mIHRoZSBjb21wb25lbnQgY2hhbmdlcy5cbiAgICovXG4gIHByb3RlY3RlZCByZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpIHtcbiAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24odGhpcy5wbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcG9zaXRpb24gdW50aWwgd2hpY2ggbWVkaWEgaXMgYnVmZmVyZWQuXG4gICAqIEBwYXJhbSBwZXJjZW50IGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMTAwXG4gICAqL1xuICBzZXRCdWZmZXJQb3NpdGlvbihwZXJjZW50OiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc2Vla0JhckJ1ZmZlclBvc2l0aW9uLCBwZXJjZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwb3NpdGlvbiB3aGVyZSBhIHNlZWssIGlmIGV4ZWN1dGVkLCB3b3VsZCBqdW1wIHRvLlxuICAgKiBAcGFyYW0gcGVyY2VudCBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEwMFxuICAgKi9cbiAgc2V0U2Vla1Bvc2l0aW9uKHBlcmNlbnQ6IG51bWJlcikge1xuICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5zZWVrQmFyU2Vla1Bvc2l0aW9uLCBwZXJjZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGFjdHVhbCBwb3NpdGlvbiAod2lkdGggb3IgaGVpZ2h0KSBvZiBhIERPTSBlbGVtZW50IHRoYXQgcmVwcmVzZW50IGEgYmFyIGluIHRoZSBzZWVrIGJhci5cbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gc2V0IHRoZSBwb3NpdGlvbiBmb3JcbiAgICogQHBhcmFtIHBlcmNlbnQgYSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxMDBcbiAgICovXG4gIHByaXZhdGUgc2V0UG9zaXRpb24oZWxlbWVudDogRE9NLCBwZXJjZW50OiBudW1iZXIpIHtcbiAgICBsZXQgc2NhbGUgPSBwZXJjZW50IC8gMTAwO1xuICAgIGxldCBzdHlsZSA9IHRoaXMuY29uZmlnLnZlcnRpY2FsID9cbiAgICAgIC8vIC1tcy10cmFuc2Zvcm0gcmVxdWlyZWQgZm9yIElFOVxuICAgICAgeyAndHJhbnNmb3JtJzogJ3NjYWxlWSgnICsgc2NhbGUgKyAnKScsICctbXMtdHJhbnNmb3JtJzogJ3NjYWxlWSgnICsgc2NhbGUgKyAnKScgfSA6XG4gICAgICB7ICd0cmFuc2Zvcm0nOiAnc2NhbGVYKCcgKyBzY2FsZSArICcpJywgJy1tcy10cmFuc2Zvcm0nOiAnc2NhbGVYKCcgKyBzY2FsZSArICcpJyB9O1xuICAgIGVsZW1lbnQuY3NzKHN0eWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXRzIHRoZSBzZWVrIGJhciBpbnRvIG9yIG91dCBvZiBzZWVraW5nIHN0YXRlIGJ5IGFkZGluZy9yZW1vdmluZyBhIGNsYXNzIHRvIHRoZSBET00gZWxlbWVudC4gVGhpcyBjYW4gYmUgdXNlZFxuICAgKiB0byBhZGp1c3QgdGhlIHN0eWxpbmcgd2hpbGUgc2Vla2luZy5cbiAgICpcbiAgICogQHBhcmFtIHNlZWtpbmcgc2hvdWxkIGJlIHRydWUgd2hlbiBlbnRlcmluZyBzZWVrIHN0YXRlLCBmYWxzZSB3aGVuIGV4aXRpbmcgdGhlIHNlZWsgc3RhdGVcbiAgICovXG4gIHNldFNlZWtpbmcoc2Vla2luZzogYm9vbGVhbikge1xuICAgIGlmIChzZWVraW5nKSB7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhTZWVrQmFyLkNMQVNTX1NFRUtJTkcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoU2Vla0Jhci5DTEFTU19TRUVLSU5HKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgc2VlayBiYXIgaXMgY3VycmVudGx5IGluIHRoZSBzZWVrIHN0YXRlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbiBzZWVrIHN0YXRlLCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc1NlZWtpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmhhc0NsYXNzKHRoaXMucHJlZml4Q3NzKFNlZWtCYXIuQ0xBU1NfU0VFS0lORykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgc2VlayBiYXIgaGFzIGEge0BsaW5rIFNlZWtCYXJMYWJlbH0uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBzZWVrIGJhciBoYXMgYSBsYWJlbCwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaGFzTGFiZWwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWwgIT0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsYWJlbCBvZiB0aGlzIHNlZWsgYmFyLlxuICAgKiBAcmV0dXJucyB7U2Vla0JhckxhYmVsfSB0aGUgbGFiZWwgaWYgdGhpcyBzZWVrIGJhciBoYXMgYSBsYWJlbCwgZWxzZSBudWxsXG4gICAqL1xuICBnZXRMYWJlbCgpOiBTZWVrQmFyTGFiZWwgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblNlZWtFdmVudCgpIHtcbiAgICB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uU2Vla1ByZXZpZXdFdmVudChwZXJjZW50YWdlOiBudW1iZXIsIHNjcnViYmluZzogYm9vbGVhbikge1xuICAgIGxldCBzbmFwcGVkTWFya2VyID0gdGhpcy5nZXRNYXJrZXJBdFBvc2l0aW9uKHBlcmNlbnRhZ2UpO1xuXG4gICAgaWYgKHRoaXMubGFiZWwpIHtcbiAgICAgIHRoaXMubGFiZWwuZ2V0RG9tRWxlbWVudCgpLmNzcyh7XG4gICAgICAgICdsZWZ0JzogKHNuYXBwZWRNYXJrZXIgPyBzbmFwcGVkTWFya2VyLnRpbWUgOiBwZXJjZW50YWdlKSArICclJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWVrQmFyRXZlbnRzLm9uU2Vla1ByZXZpZXcuZGlzcGF0Y2godGhpcywge1xuICAgICAgc2NydWJiaW5nOiBzY3J1YmJpbmcsXG4gICAgICBwb3NpdGlvbjogcGVyY2VudGFnZSxcbiAgICAgIG1hcmtlcjogc25hcHBlZE1hcmtlcixcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblNlZWtlZEV2ZW50KHBlcmNlbnRhZ2U6IG51bWJlcikge1xuICAgIHRoaXMuc2Vla0JhckV2ZW50cy5vblNlZWtlZC5kaXNwYXRjaCh0aGlzLCBwZXJjZW50YWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gYSBzY3J1YmJpbmcgc2VlayBvcGVyYXRpb24gaXMgc3RhcnRlZC5cbiAgICogQHJldHVybnMge0V2ZW50PFNlZWtCYXIsIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25TZWVrKCk6IEV2ZW50PFNlZWtCYXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCBkdXJpbmcgYSBzY3J1YmJpbmcgc2VlayAodG8gaW5kaWNhdGUgdGhhdCB0aGUgc2VlayBwcmV2aWV3LCBpLmUuIHRoZSB2aWRlbyBmcmFtZSxcbiAgICogc2hvdWxkIGJlIHVwZGF0ZWQpLCBvciBkdXJpbmcgYSBub3JtYWwgc2VlayBwcmV2aWV3IHdoZW4gdGhlIHNlZWsgYmFyIGlzIGhvdmVyZWQgKGFuZCB0aGUgc2VlayB0YXJnZXQsXG4gICAqIGkuZS4gdGhlIHNlZWsgYmFyIGxhYmVsLCBzaG91bGQgYmUgdXBkYXRlZCkuXG4gICAqIEByZXR1cm5zIHtFdmVudDxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz59XG4gICAqL1xuICBnZXQgb25TZWVrUHJldmlldygpOiBFdmVudDxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrUHJldmlldy5nZXRFdmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiBhIHNjcnViYmluZyBzZWVrIGhhcyBmaW5pc2hlZCBvciB3aGVuIGEgZGlyZWN0IHNlZWsgaXMgaXNzdWVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8U2Vla0JhciwgbnVtYmVyPn1cbiAgICovXG4gIGdldCBvblNlZWtlZCgpOiBFdmVudDxTZWVrQmFyLCBudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5zZWVrQmFyRXZlbnRzLm9uU2Vla2VkLmdldEV2ZW50KCk7XG4gIH1cblxuXG4gIHByb3RlY3RlZCBvblNob3dFdmVudCgpOiB2b2lkIHtcbiAgICBzdXBlci5vblNob3dFdmVudCgpO1xuXG4gICAgLy8gUmVmcmVzaCB0aGUgcG9zaXRpb24gb2YgdGhlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gdGhlIHNlZWsgYmFyIGJlY29tZXMgdmlzaWJsZS4gVG8gY29ycmVjdGx5IHNldCB0aGUgcG9zaXRpb24sXG4gICAgLy8gdGhlIERPTSBlbGVtZW50IG11c3QgYmUgZnVsbHkgaW5pdGlhbGl6ZWQgYW4gaGF2ZSBpdHMgc2l6ZSBjYWxjdWxhdGVkLCBiZWNhdXNlIHRoZSBwb3NpdGlvbiBpcyBzZXQgYXMgYW4gYWJzb2x1dGVcbiAgICAvLyB2YWx1ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHNpemUuIFRoaXMgcmVxdWlyZWQgc2l6ZSBpcyBub3Qga25vd24gd2hlbiBpdCBpcyBoaWRkZW4uXG4gICAgLy8gRm9yIHN1Y2ggY2FzZXMsIHdlIHJlZnJlc2ggdGhlIHBvc2l0aW9uIGhlcmUgaW4gb25TaG93IGJlY2F1c2UgaGVyZSBpdCBpcyBndWFyYW50ZWVkIHRoYXQgdGhlIGNvbXBvbmVudCBrbm93c1xuICAgIC8vIGl0cyBzaXplIGFuZCBjYW4gc2V0IHRoZSBwb3NpdGlvbiBjb3JyZWN0bHkuXG4gICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlciwgU2Vla1ByZXZpZXdBcmdzfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtTdHJpbmdVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBTZWVrQmFyTGFiZWx9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlZWtCYXJMYWJlbENvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8vIG5vdGhpbmcgeWV0XG59XG5cbi8qKlxuICogQSBsYWJlbCBmb3IgYSB7QGxpbmsgU2Vla0Jhcn0gdGhhdCBjYW4gZGlzcGxheSB0aGUgc2VlayB0YXJnZXQgdGltZSwgYSB0aHVtYm5haWwsIGFuZCB0aXRsZSAoZS5nLiBjaGFwdGVyIHRpdGxlKS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlZWtCYXJMYWJlbCBleHRlbmRzIENvbnRhaW5lcjxTZWVrQmFyTGFiZWxDb25maWc+IHtcblxuICBwcml2YXRlIHRpbWVMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIHRpdGxlTGFiZWw6IExhYmVsPExhYmVsQ29uZmlnPjtcbiAgcHJpdmF0ZSBudW1iZXJMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIGNvbW1lbnRMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIGF2YXRhckxhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgdGh1bWJuYWlsOiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPjtcbiAgcHJpdmF0ZSBtZXRhZGF0YTogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz47XG5cbiAgcHJpdmF0ZSB0aW1lRm9ybWF0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZWVrQmFyTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLnRpbWVMYWJlbCA9IG5ldyBMYWJlbCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLWxhYmVsLXRpbWUnXX0pO1xuICAgIHRoaXMudGl0bGVMYWJlbCA9IG5ldyBMYWJlbCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLWxhYmVsLXRpdGxlJ119KTtcbiAgICB0aGlzLmNvbW1lbnRMYWJlbCA9IG5ldyBMYWJlbCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLWxhYmVsLWNvbW1lbnQnXX0pO1xuICAgIHRoaXMubnVtYmVyTGFiZWwgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzZXM6IFsnc2Vla2Jhci1sYWJlbC1udW1iZXInXX0pO1xuICAgIHRoaXMuYXZhdGFyTGFiZWwgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzZXM6IFsnc2Vla2Jhci1sYWJlbC1hdmF0YXInXX0pO1xuICAgIHRoaXMudGh1bWJuYWlsID0gbmV3IENvbXBvbmVudCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLXRodW1ibmFpbCddfSk7XG4gICAgdGhpcy5tZXRhZGF0YSA9IG5ldyBDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICB0aGlzLmF2YXRhckxhYmVsLFxuICAgICAgICAgICAgdGhpcy50aXRsZUxhYmVsLFxuICAgICAgICAgICAgdGhpcy5udW1iZXJMYWJlbF0sXG4gICAgICAgICAgY3NzQ2xhc3M6ICdzZWVrYmFyLWxhYmVsLW1ldGFkYXRhLXRpdGxlJyxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIHRoaXMuY29tbWVudExhYmVsLFxuICAgICAgICAgICAgdGhpcy50aW1lTGFiZWxdLFxuICAgICAgICAgIGNzc0NsYXNzOiAnc2Vla2Jhci1sYWJlbC1tZXRhZGF0YS1jb250ZW50JyxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgICAgY3NzQ2xhc3M6ICdzZWVrYmFyLWxhYmVsLW1ldGFkYXRhJ1xuICAgIH0pO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZWVrYmFyLWxhYmVsJyxcbiAgICAgIGNvbXBvbmVudHM6IFtuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgIHRoaXMudGh1bWJuYWlsLFxuICAgICAgICAgIHRoaXMubWV0YWRhdGFcbiAgICAgICAgXSxcbiAgICAgICAgY3NzQ2xhc3M6ICdzZWVrYmFyLWxhYmVsLWlubmVyJyxcbiAgICAgIH0pXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdWltYW5hZ2VyLm9uU2Vla1ByZXZpZXcuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3M6IFNlZWtQcmV2aWV3QXJncykgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0xpdmUoKSkge1xuICAgICAgICBsZXQgdGltZSA9IHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAtIHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAqIChhcmdzLnBvc2l0aW9uIC8gMTAwKTtcbiAgICAgICAgdGhpcy5zZXRUaW1lKHRpbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSAwO1xuICAgICAgICBpZiAoYXJncy5tYXJrZXIpIHtcbiAgICAgICAgICB0aGlzLnNldFRpdGxlVGV4dChhcmdzLm1hcmtlci50aXRsZSk7XG4gICAgICAgICAgdGhpcy5zZXRTbWFzaGN1dERhdGEoYXJncy5tYXJrZXIpO1xuICAgICAgICAgIHRoaXMuc2V0VGltZShhcmdzLm1hcmtlci50aW1lKTtcbiAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbChudWxsKTtcbiAgICAgICAgICB0aGlzLnNldEJhY2tncm91bmQodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVyY2VudGFnZSA9IGFyZ3MucG9zaXRpb247XG4gICAgICAgICAgdGhpcy5zZXRUaXRsZVRleHQobnVsbCk7XG4gICAgICAgICAgdGhpcy5zZXRTbWFzaGN1dERhdGEobnVsbCk7XG4gICAgICAgICAgbGV0IHRpbWUgPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAqIChwZXJjZW50YWdlIC8gMTAwKTtcbiAgICAgICAgICB0aGlzLnNldFRpbWUodGltZSk7XG4gICAgICAgICAgdGhpcy5zZXRUaHVtYm5haWwocGxheWVyLmdldFRodW1iKHRpbWUpKTtcbiAgICAgICAgICB0aGlzLnNldEJhY2tncm91bmQoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgaW5pdCA9ICgpID0+IHtcbiAgICAgIC8vIFNldCB0aW1lIGZvcm1hdCBkZXBlbmRpbmcgb24gc291cmNlIGR1cmF0aW9uXG4gICAgICB0aGlzLnRpbWVGb3JtYXQgPSBNYXRoLmFicyhwbGF5ZXIuaXNMaXZlKCkgPyBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgOiBwbGF5ZXIuZ2V0RHVyYXRpb24oKSkgPj0gMzYwMCA/XG4gICAgICAgIFN0cmluZ1V0aWxzLkZPUk1BVF9ISE1NU1MgOiBTdHJpbmdVdGlscy5GT1JNQVRfTU1TUztcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIGluaXQpO1xuICAgIGluaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFyYml0cmFyeSB0ZXh0IG9uIHRoZSBsYWJlbC5cbiAgICogQHBhcmFtIHRleHQgdGhlIHRleHQgdG8gc2hvdyBvbiB0aGUgbGFiZWxcbiAgICovXG4gIHNldFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy50aW1lTGFiZWwuc2V0VGV4dCh0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgdGltZSB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIGxhYmVsLlxuICAgKiBAcGFyYW0gc2Vjb25kcyB0aGUgdGltZSBpbiBzZWNvbmRzIHRvIGRpc3BsYXkgb24gdGhlIGxhYmVsXG4gICAqL1xuICBzZXRUaW1lKHNlY29uZHM6IG51bWJlcikge1xuICAgIHRoaXMuc2V0VGV4dChTdHJpbmdVdGlscy5zZWNvbmRzVG9UaW1lKHNlY29uZHMsIHRoaXMudGltZUZvcm1hdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHRleHQgb24gdGhlIHRpdGxlIGxhYmVsLlxuICAgKiBAcGFyYW0gdGV4dCB0aGUgdGV4dCB0byBzaG93IG9uIHRoZSBsYWJlbFxuICAgKi9cbiAgc2V0VGl0bGVUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMudGl0bGVMYWJlbC5zZXRUZXh0KHRleHQpO1xuICB9XG5cbiAgc2V0U21hc2hjdXREYXRhKG1hcmtlcjogYW55KSB7XG4gICAgaWYgKG1hcmtlcikge1xuICAgICAgdGhpcy5jb21tZW50TGFiZWwuc2V0VGV4dChtYXJrZXIuY29tbWVudCk7XG4gICAgICB0aGlzLm51bWJlckxhYmVsLnNldFRleHQobWFya2VyLm51bWJlcik7XG4gICAgICB0aGlzLmF2YXRhckxhYmVsLnNldFRleHQobWFya2VyLmF2YXRhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29tbWVudExhYmVsLnNldFRleHQobnVsbCk7XG4gICAgICB0aGlzLm51bWJlckxhYmVsLnNldFRleHQobnVsbCk7XG4gICAgICB0aGlzLmF2YXRhckxhYmVsLnNldFRleHQobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgb3IgcmVtb3ZlcyBhIHRodW1ibmFpbCBvbiB0aGUgbGFiZWwuXG4gICAqIEBwYXJhbSB0aHVtYm5haWwgdGhlIHRodW1ibmFpbCB0byBkaXNwbGF5IG9uIHRoZSBsYWJlbCBvciBudWxsIHRvIHJlbW92ZSBhIGRpc3BsYXllZCB0aHVtYm5haWxcbiAgICovXG4gIHNldFRodW1ibmFpbCh0aHVtYm5haWw6IGJpdG1vdmluLnBsYXllci5UaHVtYm5haWwgPSBudWxsKSB7XG4gICAgbGV0IHRodW1ibmFpbEVsZW1lbnQgPSB0aGlzLnRodW1ibmFpbC5nZXREb21FbGVtZW50KCk7XG5cbiAgICBpZiAodGh1bWJuYWlsID09IG51bGwpIHtcbiAgICAgIHRodW1ibmFpbEVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiBudWxsLFxuICAgICAgICAnZGlzcGxheSc6ICdudWxsJyxcbiAgICAgICAgJ3dpZHRoJzogJ251bGwnLFxuICAgICAgICAnaGVpZ2h0JzogJ251bGwnXG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHVtYm5haWxFbGVtZW50LmNzcyh7XG4gICAgICAgICdkaXNwbGF5JzogJ2luaGVyaXQnLFxuICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6IGB1cmwoJHt0aHVtYm5haWwudXJsfSlgLFxuICAgICAgICAnd2lkdGgnOiB0aHVtYm5haWwudyArICdweCcsXG4gICAgICAgICdoZWlnaHQnOiB0aHVtYm5haWwuaCArICdweCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uJzogYC0ke3RodW1ibmFpbC54fXB4IC0ke3RodW1ibmFpbC55fXB4YFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0QmFja2dyb3VuZChvbk9mZjogYm9vbGVhbikge1xuICAgIGxldCBtZXRhZGF0YUVsZW1lbnQgPSB0aGlzLm1ldGFkYXRhLmdldERvbUVsZW1lbnQoKTtcblxuICAgIGlmIChvbk9mZikge1xuICAgICAgbWV0YWRhdGFFbGVtZW50LmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kJzogJyMwMDAnXG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBtZXRhZGF0YUVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ2JhY2tncm91bmQnOiAnaW5pdGlhbCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7TGlzdFNlbGVjdG9yLCBMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuXG4vKipcbiAqIEEgc2ltcGxlIHNlbGVjdCBib3ggcHJvdmlkaW5nIHRoZSBwb3NzaWJpbGl0eSB0byBzZWxlY3QgYSBzaW5nbGUgaXRlbSBvdXQgb2YgYSBsaXN0IG9mIGF2YWlsYWJsZSBpdGVtcy5cbiAqXG4gKiBET00gZXhhbXBsZTpcbiAqIDxjb2RlPlxuICogICAgIDxzZWxlY3QgY2xhc3M9J3VpLXNlbGVjdGJveCc+XG4gKiAgICAgICAgIDxvcHRpb24gdmFsdWU9J2tleSc+bGFiZWw8L29wdGlvbj5cbiAqICAgICAgICAgLi4uXG4gKiAgICAgPC9zZWxlY3Q+XG4gKiA8L2NvZGU+XG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3RCb3ggZXh0ZW5kcyBMaXN0U2VsZWN0b3I8TGlzdFNlbGVjdG9yQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzZWxlY3RFbGVtZW50OiBET007XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMaXN0U2VsZWN0b3JDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNlbGVjdGJveCdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IHNlbGVjdEVsZW1lbnQgPSBuZXcgRE9NKCdzZWxlY3QnLCB7XG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdEVsZW1lbnQgPSBzZWxlY3RFbGVtZW50O1xuICAgIHRoaXMudXBkYXRlRG9tSXRlbXMoKTtcblxuICAgIHNlbGVjdEVsZW1lbnQub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IHNlbGVjdEVsZW1lbnQudmFsKCk7XG4gICAgICB0aGlzLm9uSXRlbVNlbGVjdGVkRXZlbnQodmFsdWUsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RFbGVtZW50O1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZURvbUl0ZW1zKHNlbGVjdGVkVmFsdWU6IHN0cmluZyA9IG51bGwpIHtcbiAgICAvLyBEZWxldGUgYWxsIGNoaWxkcmVuXG4gICAgdGhpcy5zZWxlY3RFbGVtZW50LmVtcHR5KCk7XG5cbiAgICAvLyBBZGQgdXBkYXRlZCBjaGlsZHJlblxuICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xuICAgICAgbGV0IG9wdGlvbkVsZW1lbnQgPSBuZXcgRE9NKCdvcHRpb24nLCB7XG4gICAgICAgICd2YWx1ZSc6IGl0ZW0ua2V5XG4gICAgICB9KS5odG1sKGl0ZW0ubGFiZWwpO1xuXG4gICAgICBpZiAoaXRlbS5rZXkgPT09IHNlbGVjdGVkVmFsdWUgKyAnJykgeyAvLyBjb252ZXJ0IHNlbGVjdGVkVmFsdWUgdG8gc3RyaW5nIHRvIGNhdGNoICdudWxsJy9udWxsIGNhc2VcbiAgICAgICAgb3B0aW9uRWxlbWVudC5hdHRyKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlbGVjdEVsZW1lbnQuYXBwZW5kKG9wdGlvbkVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1BZGRlZEV2ZW50KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5vbkl0ZW1BZGRlZEV2ZW50KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZURvbUl0ZW1zKHRoaXMuc2VsZWN0ZWRJdGVtKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1SZW1vdmVkRXZlbnQodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyLm9uSXRlbVJlbW92ZWRFdmVudCh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVEb21JdGVtcyh0aGlzLnNlbGVjdGVkSXRlbSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtU2VsZWN0ZWRFdmVudCh2YWx1ZTogc3RyaW5nLCB1cGRhdGVEb21JdGVtczogYm9vbGVhbiA9IHRydWUpIHtcbiAgICBzdXBlci5vbkl0ZW1TZWxlY3RlZEV2ZW50KHZhbHVlKTtcbiAgICBpZiAodXBkYXRlRG9tSXRlbXMpIHtcbiAgICAgIHRoaXMudXBkYXRlRG9tSXRlbXModmFsdWUpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7U2VsZWN0Qm94fSBmcm9tICcuL3NlbGVjdGJveCc7XG5pbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtWaWRlb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vdmlkZW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7QXVkaW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2F1ZGlvcXVhbGl0eXNlbGVjdGJveCc7XG5pbXBvcnQge1RpbWVvdXR9IGZyb20gJy4uL3RpbWVvdXQnO1xuaW1wb3J0IHtFdmVudCwgRXZlbnREaXNwYXRjaGVyLCBOb0FyZ3N9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIFNldHRpbmdzUGFuZWx9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzUGFuZWxDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgc2V0dGluZ3MgcGFuZWwgd2lsbCBiZSBoaWRkZW4gd2hlbiB0aGVyZSBpcyBubyB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBTZXQgdG8gLTEgdG8gZGlzYWJsZSBhdXRvbWF0aWMgaGlkaW5nLlxuICAgKiBEZWZhdWx0OiAzIHNlY29uZHMgKDMwMDApXG4gICAqL1xuICBoaWRlRGVsYXk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQSBwYW5lbCBjb250YWluaW5nIGEgbGlzdCBvZiB7QGxpbmsgU2V0dGluZ3NQYW5lbEl0ZW0gaXRlbXN9IHRoYXQgcmVwcmVzZW50IGxhYmVsbGVkIHNldHRpbmdzLlxuICovXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NQYW5lbCBleHRlbmRzIENvbnRhaW5lcjxTZXR0aW5nc1BhbmVsQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfTEFTVCA9ICdsYXN0JztcblxuICBwcml2YXRlIHNldHRpbmdzUGFuZWxFdmVudHMgPSB7XG4gICAgb25TZXR0aW5nc1N0YXRlQ2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZXR0aW5nc1BhbmVsLCBOb0FyZ3M+KClcbiAgfTtcblxuICBwcml2YXRlIGhpZGVUaW1lb3V0OiBUaW1lb3V0O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogU2V0dGluZ3NQYW5lbENvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWc8U2V0dGluZ3NQYW5lbENvbmZpZz4oY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNldHRpbmdzLXBhbmVsJyxcbiAgICAgIGhpZGVEZWxheTogMzAwMFxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxTZXR0aW5nc1BhbmVsQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7IC8vIFRPRE8gZml4IGdlbmVyaWNzIHR5cGUgaW5mZXJlbmNlXG5cbiAgICBpZiAoY29uZmlnLmhpZGVEZWxheSA+IC0xKSB7XG4gICAgICB0aGlzLmhpZGVUaW1lb3V0ID0gbmV3IFRpbWVvdXQoY29uZmlnLmhpZGVEZWxheSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9uU2hvdy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBBY3RpdmF0ZSB0aW1lb3V0IHdoZW4gc2hvd25cbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5zdGFydCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgICAgICAvLyBSZXNldCB0aW1lb3V0IG9uIGludGVyYWN0aW9uXG4gICAgICAgIHRoaXMuaGlkZVRpbWVvdXQucmVzZXQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5vbkhpZGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgLy8gQ2xlYXIgdGltZW91dCB3aGVuIGhpZGRlbiBmcm9tIG91dHNpZGVcbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5jbGVhcigpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRmlyZSBldmVudCB3aGVuIHRoZSBzdGF0ZSBvZiBhIHNldHRpbmdzLWl0ZW0gaGFzIGNoYW5nZWRcbiAgICBsZXQgc2V0dGluZ3NTdGF0ZUNoYW5nZWRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5vblNldHRpbmdzU3RhdGVDaGFuZ2VkRXZlbnQoKTtcblxuICAgICAgLy8gQXR0YWNoIG1hcmtlciBjbGFzcyB0byBsYXN0IHZpc2libGUgaXRlbVxuICAgICAgbGV0IGxhc3RTaG93bkl0ZW0gPSBudWxsO1xuICAgICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0SXRlbXMoKSkge1xuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgU2V0dGluZ3NQYW5lbEl0ZW0pIHtcbiAgICAgICAgICBjb21wb25lbnQuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFNldHRpbmdzUGFuZWwuQ0xBU1NfTEFTVCkpO1xuICAgICAgICAgIGlmIChjb21wb25lbnQuaXNTaG93bigpKSB7XG4gICAgICAgICAgICBsYXN0U2hvd25JdGVtID0gY29tcG9uZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGxhc3RTaG93bkl0ZW0pIHtcbiAgICAgICAgbGFzdFNob3duSXRlbS5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoU2V0dGluZ3NQYW5lbC5DTEFTU19MQVNUKSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5nZXRJdGVtcygpKSB7XG4gICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgU2V0dGluZ3NQYW5lbEl0ZW0pIHtcbiAgICAgICAgY29tcG9uZW50Lm9uQWN0aXZlQ2hhbmdlZC5zdWJzY3JpYmUoc2V0dGluZ3NTdGF0ZUNoYW5nZWRIYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWxlYXNlKCk6IHZvaWQge1xuICAgIHN1cGVyLnJlbGVhc2UoKTtcbiAgICBpZiAodGhpcy5oaWRlVGltZW91dCkge1xuICAgICAgdGhpcy5oaWRlVGltZW91dC5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlcmUgYXJlIGFjdGl2ZSBzZXR0aW5ncyB3aXRoaW4gdGhpcyBzZXR0aW5ncyBwYW5lbC4gQW4gYWN0aXZlIHNldHRpbmcgaXMgYSBzZXR0aW5nIHRoYXQgaXMgdmlzaWJsZVxuICAgKiBhbmQgZW5hYmxlZCwgd2hpY2ggdGhlIHVzZXIgY2FuIGludGVyYWN0IHdpdGguXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZXJlIGFyZSBhY3RpdmUgc2V0dGluZ3MsIGZhbHNlIGlmIHRoZSBwYW5lbCBpcyBmdW5jdGlvbmFsbHkgZW1wdHkgdG8gYSB1c2VyXG4gICAqL1xuICBoYXNBY3RpdmVTZXR0aW5ncygpOiBib29sZWFuIHtcbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5nZXRJdGVtcygpKSB7XG4gICAgICBpZiAoY29tcG9uZW50LmlzQWN0aXZlKCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRJdGVtcygpOiBTZXR0aW5nc1BhbmVsSXRlbVtdIHtcbiAgICByZXR1cm4gPFNldHRpbmdzUGFuZWxJdGVtW10+dGhpcy5jb25maWcuY29tcG9uZW50cztcbiAgfVxuXG4gIHByb3RlY3RlZCBvblNldHRpbmdzU3RhdGVDaGFuZ2VkRXZlbnQoKSB7XG4gICAgdGhpcy5zZXR0aW5nc1BhbmVsRXZlbnRzLm9uU2V0dGluZ3NTdGF0ZUNoYW5nZWQuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIG9uZSBvciBtb3JlIHtAbGluayBTZXR0aW5nc1BhbmVsSXRlbSBpdGVtc30gaGF2ZSBjaGFuZ2VkIHN0YXRlLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8U2V0dGluZ3NQYW5lbCwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvblNldHRpbmdzU3RhdGVDaGFuZ2VkKCk6IEV2ZW50PFNldHRpbmdzUGFuZWwsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzUGFuZWxFdmVudHMub25TZXR0aW5nc1N0YXRlQ2hhbmdlZC5nZXRFdmVudCgpO1xuICB9XG59XG5cbi8qKlxuICogQW4gaXRlbSBmb3IgYSB7QGxpbmsgU2V0dGluZ3NQYW5lbH0sIGNvbnRhaW5pbmcgYSB7QGxpbmsgTGFiZWx9IGFuZCBhIGNvbXBvbmVudCB0aGF0IGNvbmZpZ3VyZXMgYSBzZXR0aW5nLlxuICogU3VwcG9ydGVkIHNldHRpbmcgY29tcG9uZW50czoge0BsaW5rIFNlbGVjdEJveH1cbiAqL1xuZXhwb3J0IGNsYXNzIFNldHRpbmdzUGFuZWxJdGVtIGV4dGVuZHMgQ29udGFpbmVyPENvbnRhaW5lckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgbGFiZWw6IExhYmVsPExhYmVsQ29uZmlnPjtcbiAgcHJpdmF0ZSBzZXR0aW5nOiBTZWxlY3RCb3g7XG5cbiAgcHJpdmF0ZSBzZXR0aW5nc1BhbmVsSXRlbUV2ZW50cyA9IHtcbiAgICBvbkFjdGl2ZUNoYW5nZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8U2V0dGluZ3NQYW5lbEl0ZW0sIE5vQXJncz4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGxhYmVsOiBzdHJpbmcsIHNlbGVjdEJveDogU2VsZWN0Qm94LCBjb25maWc6IENvbnRhaW5lckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMubGFiZWwgPSBuZXcgTGFiZWwoeyB0ZXh0OiBsYWJlbCB9KTtcbiAgICB0aGlzLnNldHRpbmcgPSBzZWxlY3RCb3g7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNldHRpbmdzLXBhbmVsLWl0ZW0nLFxuICAgICAgY29tcG9uZW50czogW3RoaXMubGFiZWwsIHRoaXMuc2V0dGluZ11cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgbGV0IGhhbmRsZUNvbmZpZ0l0ZW1DaGFuZ2VkID0gKCkgPT4ge1xuICAgICAgLy8gVGhlIG1pbmltdW0gbnVtYmVyIG9mIGl0ZW1zIHRoYXQgbXVzdCBiZSBhdmFpbGFibGUgZm9yIHRoZSBzZXR0aW5nIHRvIGJlIGRpc3BsYXllZFxuICAgICAgLy8gQnkgZGVmYXVsdCwgYXQgbGVhc3QgdHdvIGl0ZW1zIG11c3QgYmUgYXZhaWxhYmxlLCBlbHNlIGEgc2VsZWN0aW9uIGlzIG5vdCBwb3NzaWJsZVxuICAgICAgbGV0IG1pbkl0ZW1zVG9EaXNwbGF5ID0gMjtcbiAgICAgIC8vIEF1ZGlvL3ZpZGVvIHF1YWxpdHkgc2VsZWN0IGJveGVzIGNvbnRhaW4gYW4gYWRkaXRpb25hbCAnYXV0bycgbW9kZSwgd2hpY2ggaW4gY29tYmluYXRpb24gd2l0aCBhIHNpbmdsZVxuICAgICAgLy8gYXZhaWxhYmxlIHF1YWxpdHkgYWxzbyBkb2VzIG5vdCBtYWtlIHNlbnNlXG4gICAgICBpZiAodGhpcy5zZXR0aW5nIGluc3RhbmNlb2YgVmlkZW9RdWFsaXR5U2VsZWN0Qm94IHx8IHRoaXMuc2V0dGluZyBpbnN0YW5jZW9mIEF1ZGlvUXVhbGl0eVNlbGVjdEJveCkge1xuICAgICAgICBtaW5JdGVtc1RvRGlzcGxheSA9IDM7XG4gICAgICB9XG5cbiAgICAgIC8vIEhpZGUgdGhlIHNldHRpbmcgaWYgbm8gbWVhbmluZ2Z1bCBjaG9pY2UgaXMgYXZhaWxhYmxlXG4gICAgICBpZiAodGhpcy5zZXR0aW5nLml0ZW1Db3VudCgpIDwgbWluSXRlbXNUb0Rpc3BsYXkpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH1cblxuICAgICAgLy8gVmlzaWJpbGl0eSBtaWdodCBoYXZlIGNoYW5nZWQgYW5kIHRoZXJlZm9yZSB0aGUgYWN0aXZlIHN0YXRlIG1pZ2h0IGhhdmUgY2hhbmdlZCBzbyB3ZSBmaXJlIHRoZSBldmVudFxuICAgICAgLy8gVE9ETyBmaXJlIG9ubHkgd2hlbiBzdGF0ZSBoYXMgcmVhbGx5IGNoYW5nZWQgKGUuZy4gY2hlY2sgaWYgdmlzaWJpbGl0eSBoYXMgcmVhbGx5IGNoYW5nZWQpXG4gICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlZEV2ZW50KCk7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0dGluZy5vbkl0ZW1BZGRlZC5zdWJzY3JpYmUoaGFuZGxlQ29uZmlnSXRlbUNoYW5nZWQpO1xuICAgIHRoaXMuc2V0dGluZy5vbkl0ZW1SZW1vdmVkLnN1YnNjcmliZShoYW5kbGVDb25maWdJdGVtQ2hhbmdlZCk7XG5cbiAgICAvLyBJbml0aWFsaXplIGhpZGRlbiBzdGF0ZVxuICAgIGhhbmRsZUNvbmZpZ0l0ZW1DaGFuZ2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoaXMgc2V0dGluZ3MgcGFuZWwgaXRlbSBpcyBhY3RpdmUsIGkuZS4gdmlzaWJsZSBhbmQgZW5hYmxlZCBhbmQgYSB1c2VyIGNhbiBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgcGFuZWwgaXMgYWN0aXZlLCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc0FjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1Nob3duKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25BY3RpdmVDaGFuZ2VkRXZlbnQoKSB7XG4gICAgdGhpcy5zZXR0aW5nc1BhbmVsSXRlbUV2ZW50cy5vbkFjdGl2ZUNoYW5nZWQuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSAnYWN0aXZlJyBzdGF0ZSBvZiB0aGlzIGl0ZW0gY2hhbmdlcy5cbiAgICogQHNlZSAjaXNBY3RpdmVcbiAgICogQHJldHVybnMge0V2ZW50PFNldHRpbmdzUGFuZWxJdGVtLCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uQWN0aXZlQ2hhbmdlZCgpOiBFdmVudDxTZXR0aW5nc1BhbmVsSXRlbSwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NQYW5lbEl0ZW1FdmVudHMub25BY3RpdmVDaGFuZ2VkLmdldEV2ZW50KCk7XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1NldHRpbmdzUGFuZWx9IGZyb20gJy4vc2V0dGluZ3NwYW5lbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIFNldHRpbmdzVG9nZ2xlQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5nc1RvZ2dsZUJ1dHRvbkNvbmZpZyBleHRlbmRzIFRvZ2dsZUJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgc2V0dGluZ3MgcGFuZWwgd2hvc2UgdmlzaWJpbGl0eSB0aGUgYnV0dG9uIHNob3VsZCB0b2dnbGUuXG4gICAqL1xuICBzZXR0aW5nc1BhbmVsOiBTZXR0aW5nc1BhbmVsO1xuXG4gIC8qKlxuICAgKiBEZWNpZGVzIGlmIHRoZSBidXR0b24gc2hvdWxkIGJlIGF1dG9tYXRpY2FsbHkgaGlkZGVuIHdoZW4gdGhlIHNldHRpbmdzIHBhbmVsIGRvZXMgbm90IGNvbnRhaW4gYW55IGFjdGl2ZSBzZXR0aW5ncy5cbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgYXV0b0hpZGVXaGVuTm9BY3RpdmVTZXR0aW5ncz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIHZpc2liaWxpdHkgb2YgYSBzZXR0aW5ncyBwYW5lbC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNldHRpbmdzVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZXR0aW5nc1RvZ2dsZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICBpZiAoIWNvbmZpZy5zZXR0aW5nc1BhbmVsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIFNldHRpbmdzUGFuZWwgaXMgbWlzc2luZycpO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc2V0dGluZ3N0b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ1NldHRpbmdzJyxcbiAgICAgIHNldHRpbmdzUGFuZWw6IG51bGwsXG4gICAgICBhdXRvSGlkZVdoZW5Ob0FjdGl2ZVNldHRpbmdzOiB0cnVlXG4gICAgfSwgPFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxTZXR0aW5nc1RvZ2dsZUJ1dHRvbkNvbmZpZz50aGlzLmdldENvbmZpZygpOyAvLyBUT0RPIGZpeCBnZW5lcmljcyB0eXBlIGluZmVyZW5jZVxuICAgIGxldCBzZXR0aW5nc1BhbmVsID0gY29uZmlnLnNldHRpbmdzUGFuZWw7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHNldHRpbmdzUGFuZWwudG9nZ2xlSGlkZGVuKCk7XG4gICAgfSk7XG4gICAgc2V0dGluZ3NQYW5lbC5vblNob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIFNldCB0b2dnbGUgc3RhdHVzIHRvIG9uIHdoZW4gdGhlIHNldHRpbmdzIHBhbmVsIHNob3dzXG4gICAgICB0aGlzLm9uKCk7XG4gICAgfSk7XG4gICAgc2V0dGluZ3NQYW5lbC5vbkhpZGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIFNldCB0b2dnbGUgc3RhdHVzIHRvIG9mZiB3aGVuIHRoZSBzZXR0aW5ncyBwYW5lbCBoaWRlc1xuICAgICAgdGhpcy5vZmYoKTtcbiAgICB9KTtcblxuICAgIC8vIEhhbmRsZSBhdXRvbWF0aWMgaGlkaW5nIG9mIHRoZSBidXR0b24gaWYgdGhlcmUgYXJlIG5vIHNldHRpbmdzIGZvciB0aGUgdXNlciB0byBpbnRlcmFjdCB3aXRoXG4gICAgaWYgKGNvbmZpZy5hdXRvSGlkZVdoZW5Ob0FjdGl2ZVNldHRpbmdzKSB7XG4gICAgICAvLyBTZXR1cCBoYW5kbGVyIHRvIHNob3cvaGlkZSBidXR0b24gd2hlbiB0aGUgc2V0dGluZ3MgY2hhbmdlXG4gICAgICBsZXQgc2V0dGluZ3NQYW5lbEl0ZW1zQ2hhbmdlZEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgIGlmIChzZXR0aW5nc1BhbmVsLmhhc0FjdGl2ZVNldHRpbmdzKCkpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNTaG93bigpKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAvLyBXaXJlIHRoZSBoYW5kbGVyIHRvIHRoZSBldmVudFxuICAgICAgc2V0dGluZ3NQYW5lbC5vblNldHRpbmdzU3RhdGVDaGFuZ2VkLnN1YnNjcmliZShzZXR0aW5nc1BhbmVsSXRlbXNDaGFuZ2VkSGFuZGxlcik7XG4gICAgICAvLyBDYWxsIGhhbmRsZXIgZm9yIGZpcnN0IGluaXQgYXQgc3RhcnR1cFxuICAgICAgc2V0dGluZ3NQYW5lbEl0ZW1zQ2hhbmdlZEhhbmRsZXIoKTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbi8qKlxuICogQSBkdW1teSBjb21wb25lbnQgdGhhdCBqdXN0IHJlc2VydmVzIHNvbWUgc3BhY2UgYW5kIGRvZXMgbm90aGluZyBlbHNlLlxuICovXG5leHBvcnQgY2xhc3MgU3BhY2VyIGV4dGVuZHMgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29tcG9uZW50Q29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zcGFjZXInLFxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG5cbiAgcHJvdGVjdGVkIG9uU2hvd0V2ZW50KCk6IHZvaWQge1xuICAgIC8vIGRpc2FibGUgZXZlbnQgZmlyaW5nIGJ5IG92ZXJ3cml0aW5nIGFuZCBub3QgY2FsbGluZyBzdXBlclxuICB9XG5cbiAgcHJvdGVjdGVkIG9uSGlkZUV2ZW50KCk6IHZvaWQge1xuICAgIC8vIGRpc2FibGUgZXZlbnQgZmlyaW5nIGJ5IG92ZXJ3cml0aW5nIGFuZCBub3QgY2FsbGluZyBzdXBlclxuICB9XG5cbiAgcHJvdGVjdGVkIG9uSG92ZXJDaGFuZ2VkRXZlbnQoaG92ZXJlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIC8vIGRpc2FibGUgZXZlbnQgZmlyaW5nIGJ5IG92ZXJ3cml0aW5nIGFuZCBub3QgY2FsbGluZyBzdXBlclxuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBTdWJ0aXRsZUN1ZUV2ZW50ID0gYml0bW92aW4ucGxheWVyLlN1YnRpdGxlQ3VlRXZlbnQ7XG5pbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge0NvbXBvbmVudENvbmZpZywgQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0NvbnRyb2xCYXJ9IGZyb20gJy4vY29udHJvbGJhcic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciB0byBkaXNwbGF5IHN1YnRpdGxlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnRpdGxlT3ZlcmxheSBleHRlbmRzIENvbnRhaW5lcjxDb250YWluZXJDb25maWc+IHtcblxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDTEFTU19DT05UUk9MQkFSX1ZJU0lCTEUgPSAnY29udHJvbGJhci12aXNpYmxlJztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbnRhaW5lckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc3VidGl0bGUtb3ZlcmxheScsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgc3VidGl0bGVNYW5hZ2VyID0gbmV3IEFjdGl2ZVN1YnRpdGxlTWFuYWdlcigpO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ1VFX0VOVEVSLCAoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpID0+IHtcbiAgICAgIGxldCBsYWJlbFRvQWRkID0gc3VidGl0bGVNYW5hZ2VyLmN1ZUVudGVyKGV2ZW50KTtcblxuICAgICAgdGhpcy5hZGRDb21wb25lbnQobGFiZWxUb0FkZCk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcblxuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ1VFX0VYSVQsIChldmVudDogU3VidGl0bGVDdWVFdmVudCkgPT4ge1xuICAgICAgbGV0IGxhYmVsVG9SZW1vdmUgPSBzdWJ0aXRsZU1hbmFnZXIuY3VlRXhpdChldmVudCk7XG5cbiAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KGxhYmVsVG9SZW1vdmUpO1xuICAgICAgdGhpcy51cGRhdGVDb21wb25lbnRzKCk7XG5cbiAgICAgIGlmICghc3VidGl0bGVNYW5hZ2VyLmhhc0N1ZXMpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgc3VidGl0bGVDbGVhckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIHN1YnRpdGxlTWFuYWdlci5jbGVhcigpO1xuICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnRzKCk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fQ0hBTkdFRCwgc3VidGl0bGVDbGVhckhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NVQlRJVExFX0NIQU5HRUQsIHN1YnRpdGxlQ2xlYXJIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TRUVLLCBzdWJ0aXRsZUNsZWFySGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVCwgc3VidGl0bGVDbGVhckhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlCQUNLX0ZJTklTSEVELCBzdWJ0aXRsZUNsZWFySGFuZGxlcik7XG5cbiAgICB1aW1hbmFnZXIub25Db21wb25lbnRTaG93LnN1YnNjcmliZSgoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPikgPT4ge1xuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbnRyb2xCYXIpIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoU3VidGl0bGVPdmVybGF5LkNMQVNTX0NPTlRST0xCQVJfVklTSUJMRSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudEhpZGUuc3Vic2NyaWJlKChjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSA9PiB7XG4gICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29udHJvbEJhcikge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhTdWJ0aXRsZU92ZXJsYXkuQ0xBU1NfQ09OVFJPTEJBUl9WSVNJQkxFKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBJbml0XG4gICAgc3VidGl0bGVDbGVhckhhbmRsZXIoKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgQWN0aXZlU3VidGl0bGVDdWUge1xuICBldmVudDogU3VidGl0bGVDdWVFdmVudDtcbiAgbGFiZWw6IFN1YnRpdGxlTGFiZWw7XG59XG5cbmludGVyZmFjZSBBY3RpdmVTdWJ0aXRsZUN1ZU1hcCB7XG4gIFtpZDogc3RyaW5nXTogQWN0aXZlU3VidGl0bGVDdWU7XG59XG5cbmNsYXNzIFN1YnRpdGxlTGFiZWwgZXh0ZW5kcyBMYWJlbDxMYWJlbENvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXN1YnRpdGxlLWxhYmVsJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxufVxuXG5jbGFzcyBBY3RpdmVTdWJ0aXRsZU1hbmFnZXIge1xuXG4gIHByaXZhdGUgYWN0aXZlU3VidGl0bGVDdWVNYXA6IEFjdGl2ZVN1YnRpdGxlQ3VlTWFwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlU3VidGl0bGVDdWVNYXAgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGEgdW5pcXVlIElEIGZvciBhIHN1YnRpdGxlIGN1ZSwgd2hpY2ggaXMgbmVlZGVkIHRvIGFzc29jaWF0ZSBhbiBPTl9DVUVfRU5URVIgd2l0aCBpdHMgT05fQ1VFX0VYSVRcbiAgICogZXZlbnQgc28gd2UgY2FuIHJlbW92ZSB0aGUgY29ycmVjdCBzdWJ0aXRsZSBpbiBPTl9DVUVfRVhJVCB3aGVuIG11bHRpcGxlIHN1YnRpdGxlcyBhcmUgYWN0aXZlIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqIFRoZSBzdGFydCB0aW1lIHBsdXMgdGhlIHRleHQgc2hvdWxkIG1ha2UgYSB1bmlxdWUgaWRlbnRpZmllciwgYW5kIGluIHRoZSBvbmx5IGNhc2Ugd2hlcmUgYSBjb2xsaXNpb25cbiAgICogY2FuIGhhcHBlbiwgdHdvIHNpbWlsYXIgdGV4dHMgd2lsbCBkaXNwbGF5ZWQgYXQgYSBzaW1pbGFyIHRpbWUgc28gaXQgZG9lcyBub3QgbWF0dGVyIHdoaWNoIG9uZSB3ZSBkZWxldGUuXG4gICAqIFRoZSBzdGFydCB0aW1lIHNob3VsZCBhbHdheXMgYmUga25vd24sIGJlY2F1c2UgaXQgaXMgcmVxdWlyZWQgdG8gc2NoZWR1bGUgdGhlIE9OX0NVRV9FTlRFUiBldmVudC4gVGhlIGVuZCB0aW1lXG4gICAqIG11c3Qgbm90IG5lY2Vzc2FyaWx5IGJlIGtub3duIGFuZCB0aGVyZWZvcmUgY2Fubm90IGJlIHVzZWQgZm9yIHRoZSBJRC5cbiAgICogQHBhcmFtIGV2ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZUlkKGV2ZW50OiBTdWJ0aXRsZUN1ZUV2ZW50KTogc3RyaW5nIHtcbiAgICByZXR1cm4gZXZlbnQuc3RhcnQgKyBldmVudC50ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdWJ0aXRsZSBjdWUgdG8gdGhlIG1hbmFnZXIgYW5kIHJldHVybnMgdGhlIGxhYmVsIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBzdWJ0aXRsZSBvdmVybGF5LlxuICAgKiBAcGFyYW0gZXZlbnRcbiAgICogQHJldHVybiB7U3VidGl0bGVMYWJlbH1cbiAgICovXG4gIGN1ZUVudGVyKGV2ZW50OiBTdWJ0aXRsZUN1ZUV2ZW50KTogU3VidGl0bGVMYWJlbCB7XG4gICAgbGV0IGlkID0gQWN0aXZlU3VidGl0bGVNYW5hZ2VyLmNhbGN1bGF0ZUlkKGV2ZW50KTtcblxuICAgIGxldCBsYWJlbCA9IG5ldyBTdWJ0aXRsZUxhYmVsKHtcbiAgICAgIC8vIFByZWZlciB0aGUgSFRNTCBzdWJ0aXRsZSB0ZXh0IGlmIHNldCwgZWxzZSB1c2UgdGhlIHBsYWluIHRleHRcbiAgICAgIHRleHQ6IGV2ZW50Lmh0bWwgfHwgZXZlbnQudGV4dFxuICAgIH0pO1xuXG4gICAgdGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcFtpZF0gPSB7IGV2ZW50LCBsYWJlbCB9O1xuXG4gICAgcmV0dXJuIGxhYmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHN1YnRpdGxlIGN1ZSBmcm9tIHRoZSBtYW5hZ2VyIGFuZCByZXR1cm5zIHRoZSBsYWJlbCB0aGF0IHNob3VsZCBiZSByZW1vdmVkIGZyb20gdGhlIHN1YnRpdGxlIG92ZXJsYXkuXG4gICAqIEBwYXJhbSBldmVudFxuICAgKiBAcmV0dXJuIHtTdWJ0aXRsZUxhYmVsfVxuICAgKi9cbiAgY3VlRXhpdChldmVudDogU3VidGl0bGVDdWVFdmVudCk6IFN1YnRpdGxlTGFiZWwge1xuICAgIGxldCBpZCA9IEFjdGl2ZVN1YnRpdGxlTWFuYWdlci5jYWxjdWxhdGVJZChldmVudCk7XG4gICAgbGV0IGFjdGl2ZVN1YnRpdGxlQ3VlID0gdGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcFtpZF07XG4gICAgZGVsZXRlIHRoaXMuYWN0aXZlU3VidGl0bGVDdWVNYXBbaWRdO1xuICAgIHJldHVybiBhY3RpdmVTdWJ0aXRsZUN1ZS5sYWJlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgYWN0aXZlIHN1YnRpdGxlIGN1ZXMuXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBjdWVDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwKS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZXJlIGFyZSBhY3RpdmUgc3VidGl0bGUgY3VlcywgZWxzZSBmYWxzZS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBoYXNDdWVzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1ZUNvdW50ID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCBzdWJ0aXRsZSBjdWVzIGZyb20gdGhlIG1hbmFnZXIuXG4gICAqL1xuICBjbGVhcigpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwID0ge307XG4gIH1cbn0iLCJpbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgU3VidGl0bGVBZGRlZEV2ZW50ID0gYml0bW92aW4ucGxheWVyLlN1YnRpdGxlQWRkZWRFdmVudDtcbmltcG9ydCBTdWJ0aXRsZUNoYW5nZWRFdmVudCA9IGJpdG1vdmluLnBsYXllci5TdWJ0aXRsZUNoYW5nZWRFdmVudDtcbmltcG9ydCBTdWJ0aXRsZVJlbW92ZWRFdmVudCA9IGJpdG1vdmluLnBsYXllci5TdWJ0aXRsZVJlbW92ZWRFdmVudDtcblxuLyoqXG4gKiBBIHNlbGVjdCBib3ggcHJvdmlkaW5nIGEgc2VsZWN0aW9uIGJldHdlZW4gYXZhaWxhYmxlIHN1YnRpdGxlIGFuZCBjYXB0aW9uIHRyYWNrcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnRpdGxlU2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IHVwZGF0ZVN1YnRpdGxlcyA9ICgpID0+IHtcbiAgICAgIHRoaXMuY2xlYXJJdGVtcygpO1xuXG4gICAgICBmb3IgKGxldCBzdWJ0aXRsZSBvZiBwbGF5ZXIuZ2V0QXZhaWxhYmxlU3VidGl0bGVzKCkpIHtcbiAgICAgICAgdGhpcy5hZGRJdGVtKHN1YnRpdGxlLmlkLCBzdWJ0aXRsZS5sYWJlbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IFN1YnRpdGxlU2VsZWN0Qm94LCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0U3VidGl0bGUodmFsdWUgPT09ICdudWxsJyA/IG51bGwgOiB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBSZWFjdCB0byBBUEkgZXZlbnRzXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1VCVElUTEVfQURERUQsIChldmVudDogU3VidGl0bGVBZGRlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmFkZEl0ZW0oZXZlbnQuc3VidGl0bGUuaWQsIGV2ZW50LnN1YnRpdGxlLmxhYmVsKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TVUJUSVRMRV9DSEFOR0VELCAoZXZlbnQ6IFN1YnRpdGxlQ2hhbmdlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLnNlbGVjdEl0ZW0oZXZlbnQudGFyZ2V0U3VidGl0bGUuaWQpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NVQlRJVExFX1JFTU9WRUQsIChldmVudDogU3VidGl0bGVSZW1vdmVkRXZlbnQpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlSXRlbShldmVudC5zdWJ0aXRsZUlkKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzdWJ0aXRsZXMgd2hlbiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1cGRhdGVTdWJ0aXRsZXMpO1xuICAgIC8vIFVwZGF0ZSBzdWJ0aXRsZXMgd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHVwZGF0ZVN1YnRpdGxlcyk7XG5cbiAgICAvLyBQb3B1bGF0ZSBzdWJ0aXRsZXMgYXQgc3RhcnR1cFxuICAgIHVwZGF0ZVN1YnRpdGxlcygpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7TWV0YWRhdGFMYWJlbCwgTWV0YWRhdGFMYWJlbENvbnRlbnR9IGZyb20gJy4vbWV0YWRhdGFsYWJlbCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIFRpdGxlQmFyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaXRsZUJhckNvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaWYgdGhlIHRpdGxlIGJhciBzaG91bGQgc3RheSBoaWRkZW4gd2hlbiBubyBtZXRhZGF0YSBsYWJlbCBjb250YWlucyBhbnkgdGV4dC4gRG9lcyBub3QgbWFrZSBhIGxvdFxuICAgKiBvZiBzZW5zZSBpZiB0aGUgdGl0bGUgYmFyIGNvbnRhaW5zIG90aGVyIGNvbXBvbmVudHMgdGhhbiBqdXN0IE1ldGFkYXRhTGFiZWxzIChsaWtlIGluIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24pLlxuICAgKiBEZWZhdWx0OiBmYWxzZVxuICAgKi9cbiAga2VlcEhpZGRlbldpdGhvdXRNZXRhZGF0YT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogRGlzcGxheXMgYSB0aXRsZSBiYXIgY29udGFpbmluZyBhIGxhYmVsIHdpdGggdGhlIHRpdGxlIG9mIHRoZSB2aWRlby5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpdGxlQmFyIGV4dGVuZHMgQ29udGFpbmVyPFRpdGxlQmFyQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUaXRsZUJhckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdGl0bGViYXInLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgTWV0YWRhdGFMYWJlbCh7IGNvbnRlbnQ6IE1ldGFkYXRhTGFiZWxDb250ZW50LlRpdGxlIH0pLFxuICAgICAgICBuZXcgTWV0YWRhdGFMYWJlbCh7IGNvbnRlbnQ6IE1ldGFkYXRhTGFiZWxDb250ZW50LkRlc2NyaXB0aW9uIH0pXG4gICAgICBdLFxuICAgICAga2VlcEhpZGRlbldpdGhvdXRNZXRhZGF0YTogZmFsc2UsXG4gICAgfSwgPFRpdGxlQmFyQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxUaXRsZUJhckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuICAgIGxldCBzaG91bGRCZVNob3duID0gIXRoaXMuaXNIaWRkZW4oKTtcbiAgICBsZXQgaGFzTWV0YWRhdGFUZXh0ID0gdHJ1ZTsgLy8gRmxhZyB0byB0cmFjayBpZiBhbnkgbWV0YWRhdGEgbGFiZWwgY29udGFpbnMgdGV4dFxuXG4gICAgbGV0IGNoZWNrTWV0YWRhdGFUZXh0QW5kVXBkYXRlVmlzaWJpbGl0eSA9ICgpID0+IHtcbiAgICAgIGhhc01ldGFkYXRhVGV4dCA9IGZhbHNlO1xuXG4gICAgICAvLyBJdGVyYXRlIHRocm91Z2ggbWV0YWRhdGEgbGFiZWxzIGFuZCBjaGVjayBpZiBhdCBsZWFzdCBvbmUgb2YgdGhlbSBjb250YWlucyB0ZXh0XG4gICAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5nZXRDb21wb25lbnRzKCkpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE1ldGFkYXRhTGFiZWwpIHtcbiAgICAgICAgICBpZiAoIWNvbXBvbmVudC5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgIGhhc01ldGFkYXRhVGV4dCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaXNTaG93bigpKSB7XG4gICAgICAgIC8vIEhpZGUgYSB2aXNpYmxlIHRpdGxlYmFyIGlmIGl0IGRvZXMgbm90IGNvbnRhaW4gYW55IHRleHQgYW5kIHRoZSBoaWRkZW4gZmxhZyBpcyBzZXRcbiAgICAgICAgaWYgKGNvbmZpZy5rZWVwSGlkZGVuV2l0aG91dE1ldGFkYXRhICYmICFoYXNNZXRhZGF0YVRleHQpIHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzaG91bGRCZVNob3duKSB7XG4gICAgICAgIC8vIFNob3cgYSBoaWRkZW4gdGl0bGViYXIgaWYgaXQgc2hvdWxkIGFjdHVhbGx5IGJlIHNob3duXG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBMaXN0ZW4gdG8gdGV4dCBjaGFuZ2UgZXZlbnRzIHRvIHVwZGF0ZSB0aGUgaGFzTWV0YWRhdGFUZXh0IGZsYWcgd2hlbiB0aGUgbWV0YWRhdGEgZHluYW1pY2FsbHkgY2hhbmdlc1xuICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldENvbXBvbmVudHMoKSkge1xuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE1ldGFkYXRhTGFiZWwpIHtcbiAgICAgICAgY29tcG9uZW50Lm9uVGV4dENoYW5nZWQuc3Vic2NyaWJlKGNoZWNrTWV0YWRhdGFUZXh0QW5kVXBkYXRlVmlzaWJpbGl0eSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNTaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzaG91bGRCZVNob3duID0gdHJ1ZTtcbiAgICAgIGlmICghKGNvbmZpZy5rZWVwSGlkZGVuV2l0aG91dE1ldGFkYXRhICYmICFoYXNNZXRhZGF0YVRleHQpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgc2hvdWxkQmVTaG93biA9IGZhbHNlO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBpbml0XG4gICAgY2hlY2tNZXRhZGF0YVRleHRBbmRVcGRhdGVWaXNpYmlsaXR5KCk7XG4gIH1cbn0iLCJpbXBvcnQge0J1dHRvbiwgQnV0dG9uQ29uZmlnfSBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQge05vQXJncywgRXZlbnREaXNwYXRjaGVyLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB0b2dnbGUgYnV0dG9uIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUb2dnbGVCdXR0b25Db25maWcgZXh0ZW5kcyBCdXR0b25Db25maWcge1xuICAvKipcbiAgICogVGhlIHRleHQgb24gdGhlIGJ1dHRvbi5cbiAgICovXG4gIHRleHQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCBjYW4gYmUgdG9nZ2xlZCBiZXR3ZWVuICdvbicgYW5kICdvZmYnIHN0YXRlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvZ2dsZUJ1dHRvbjxDb25maWcgZXh0ZW5kcyBUb2dnbGVCdXR0b25Db25maWc+IGV4dGVuZHMgQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENMQVNTX09OID0gJ29uJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfT0ZGID0gJ29mZic7XG5cbiAgcHJpdmF0ZSBvblN0YXRlOiBib29sZWFuO1xuXG4gIHByaXZhdGUgdG9nZ2xlQnV0dG9uRXZlbnRzID0ge1xuICAgIG9uVG9nZ2xlOiBuZXcgRXZlbnREaXNwYXRjaGVyPFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25Ub2dnbGVPbjogbmV3IEV2ZW50RGlzcGF0Y2hlcjxUb2dnbGVCdXR0b248Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uVG9nZ2xlT2ZmOiBuZXcgRXZlbnREaXNwYXRjaGVyPFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+KClcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXRvZ2dsZWJ1dHRvbidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgYnV0dG9uIHRvIHRoZSAnb24nIHN0YXRlLlxuICAgKi9cbiAgb24oKSB7XG4gICAgaWYgKHRoaXMuaXNPZmYoKSkge1xuICAgICAgdGhpcy5vblN0YXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFRvZ2dsZUJ1dHRvbi5DTEFTU19PRkYpKTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFRvZ2dsZUJ1dHRvbi5DTEFTU19PTikpO1xuXG4gICAgICB0aGlzLm9uVG9nZ2xlRXZlbnQoKTtcbiAgICAgIHRoaXMub25Ub2dnbGVPbkV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGJ1dHRvbiB0byB0aGUgJ29mZicgc3RhdGUuXG4gICAqL1xuICBvZmYoKSB7XG4gICAgaWYgKHRoaXMuaXNPbigpKSB7XG4gICAgICB0aGlzLm9uU3RhdGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFRvZ2dsZUJ1dHRvbi5DTEFTU19PTikpO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVG9nZ2xlQnV0dG9uLkNMQVNTX09GRikpO1xuXG4gICAgICB0aGlzLm9uVG9nZ2xlRXZlbnQoKTtcbiAgICAgIHRoaXMub25Ub2dnbGVPZmZFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIGJ1dHRvbiAnb24nIGlmIGl0IGlzICdvZmYnLCBvciAnb2ZmJyBpZiBpdCBpcyAnb24nLlxuICAgKi9cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLmlzT24oKSkge1xuICAgICAgdGhpcy5vZmYoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHRvZ2dsZSBidXR0b24gaXMgaW4gdGhlICdvbicgc3RhdGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGJ1dHRvbiBpcyAnb24nLCBmYWxzZSBpZiAnb2ZmJ1xuICAgKi9cbiAgaXNPbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vblN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgdG9nZ2xlIGJ1dHRvbiBpcyBpbiB0aGUgJ29mZicgc3RhdGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGJ1dHRvbiBpcyAnb2ZmJywgZmFsc2UgaWYgJ29uJ1xuICAgKi9cbiAgaXNPZmYoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzT24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNsaWNrRXZlbnQoKSB7XG4gICAgc3VwZXIub25DbGlja0V2ZW50KCk7XG5cbiAgICAvLyBGaXJlIHRoZSB0b2dnbGUgZXZlbnQgdG9nZXRoZXIgd2l0aCB0aGUgY2xpY2sgZXZlbnRcbiAgICAvLyAodGhleSBhcmUgdGVjaG5pY2FsbHkgdGhlIHNhbWUsIG9ubHkgdGhlIHNlbWFudGljcyBhcmUgZGlmZmVyZW50KVxuICAgIHRoaXMub25Ub2dnbGVFdmVudCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uVG9nZ2xlRXZlbnQoKSB7XG4gICAgdGhpcy50b2dnbGVCdXR0b25FdmVudHMub25Ub2dnbGUuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Ub2dnbGVPbkV2ZW50KCkge1xuICAgIHRoaXMudG9nZ2xlQnV0dG9uRXZlbnRzLm9uVG9nZ2xlT24uZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Ub2dnbGVPZmZFdmVudCgpIHtcbiAgICB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZU9mZi5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGJ1dHRvbiBpcyB0b2dnbGVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25Ub2dnbGUoKTogRXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZS5nZXRFdmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgYnV0dG9uIGlzIHRvZ2dsZWQgJ29uJy5cbiAgICogQHJldHVybnMge0V2ZW50PFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uVG9nZ2xlT24oKTogRXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZU9uLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBidXR0b24gaXMgdG9nZ2xlZCAnb2ZmJy5cbiAgICogQHJldHVybnMge0V2ZW50PFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uVG9nZ2xlT2ZmKCk6IEV2ZW50PFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGVCdXR0b25FdmVudHMub25Ub2dnbGVPZmYuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuXG4vKipcbiAqIEFuaW1hdGVkIGFuYWxvZyBUViBzdGF0aWMgbm9pc2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBUdk5vaXNlQ2FudmFzIGV4dGVuZHMgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4ge1xuXG4gIHByaXZhdGUgY2FudmFzOiBET007XG5cbiAgcHJpdmF0ZSBjYW52YXNFbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgcHJpdmF0ZSBjYW52YXNDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHByaXZhdGUgY2FudmFzV2lkdGggPSAxNjA7XG4gIHByaXZhdGUgY2FudmFzSGVpZ2h0ID0gOTA7XG4gIHByaXZhdGUgaW50ZXJmZXJlbmNlSGVpZ2h0ID0gNTA7XG4gIHByaXZhdGUgbGFzdEZyYW1lVXBkYXRlOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGZyYW1lSW50ZXJ2YWw6IG51bWJlciA9IDYwO1xuICBwcml2YXRlIHVzZUFuaW1hdGlvbkZyYW1lOiBib29sZWFuID0gISF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICBwcml2YXRlIG5vaXNlQW5pbWF0aW9uV2luZG93UG9zOiBudW1iZXI7XG4gIHByaXZhdGUgZnJhbWVVcGRhdGVIYW5kbGVySWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbXBvbmVudENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdHZub2lzZWNhbnZhcydcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgcmV0dXJuIHRoaXMuY2FudmFzID0gbmV3IERPTSgnY2FudmFzJywgeyAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKSB9KTtcbiAgfVxuXG4gIHN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD50aGlzLmNhbnZhcy5nZXRFbGVtZW50cygpWzBdO1xuICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IHRoaXMuY2FudmFzRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgPSAtdGhpcy5jYW52YXNIZWlnaHQ7XG4gICAgdGhpcy5sYXN0RnJhbWVVcGRhdGUgPSAwO1xuXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICB0aGlzLnJlbmRlckZyYW1lKCk7XG4gIH1cblxuICBzdG9wKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnVzZUFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmZyYW1lVXBkYXRlSGFuZGxlcklkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZnJhbWVVcGRhdGVIYW5kbGVySWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRnJhbWUoKTogdm9pZCB7XG4gICAgLy8gVGhpcyBjb2RlIGhhcyBiZWVuIGNvcGllZCBmcm9tIHRoZSBwbGF5ZXIgY29udHJvbHMuanMgYW5kIHNpbXBsaWZpZWRcblxuICAgIGlmICh0aGlzLmxhc3RGcmFtZVVwZGF0ZSArIHRoaXMuZnJhbWVJbnRlcnZhbCA+IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAvLyBJdCdzIHRvbyBlYXJseSB0byByZW5kZXIgdGhlIG5leHQgZnJhbWVcbiAgICAgIHRoaXMuc2NoZWR1bGVOZXh0UmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGN1cnJlbnRQaXhlbE9mZnNldDtcbiAgICBsZXQgY2FudmFzV2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGxldCBjYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIC8vIENyZWF0ZSB0ZXh0dXJlXG4gICAgbGV0IG5vaXNlSW1hZ2UgPSB0aGlzLmNhbnZhc0NvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuXG4gICAgLy8gRmlsbCB0ZXh0dXJlIHdpdGggbm9pc2VcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGNhbnZhc0hlaWdodDsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNhbnZhc1dpZHRoOyB4KyspIHtcbiAgICAgICAgY3VycmVudFBpeGVsT2Zmc2V0ID0gKGNhbnZhc1dpZHRoICogeSAqIDQpICsgeCAqIDQ7XG4gICAgICAgIG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXRdID0gTWF0aC5yYW5kb20oKSAqIDI1NTtcbiAgICAgICAgaWYgKHkgPCB0aGlzLm5vaXNlQW5pbWF0aW9uV2luZG93UG9zIHx8IHkgPiB0aGlzLm5vaXNlQW5pbWF0aW9uV2luZG93UG9zICsgdGhpcy5pbnRlcmZlcmVuY2VIZWlnaHQpIHtcbiAgICAgICAgICBub2lzZUltYWdlLmRhdGFbY3VycmVudFBpeGVsT2Zmc2V0XSAqPSAwLjg1O1xuICAgICAgICB9XG4gICAgICAgIG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXQgKyAxXSA9IG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXRdO1xuICAgICAgICBub2lzZUltYWdlLmRhdGFbY3VycmVudFBpeGVsT2Zmc2V0ICsgMl0gPSBub2lzZUltYWdlLmRhdGFbY3VycmVudFBpeGVsT2Zmc2V0XTtcbiAgICAgICAgbm9pc2VJbWFnZS5kYXRhW2N1cnJlbnRQaXhlbE9mZnNldCArIDNdID0gNTA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUHV0IHRleHR1cmUgb250byBjYW52YXNcbiAgICB0aGlzLmNhbnZhc0NvbnRleHQucHV0SW1hZ2VEYXRhKG5vaXNlSW1hZ2UsIDAsIDApO1xuXG4gICAgdGhpcy5sYXN0RnJhbWVVcGRhdGUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLm5vaXNlQW5pbWF0aW9uV2luZG93UG9zICs9IDc7XG4gICAgaWYgKHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgPiBjYW52YXNIZWlnaHQpIHtcbiAgICAgIHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgPSAtY2FudmFzSGVpZ2h0O1xuICAgIH1cblxuICAgIHRoaXMuc2NoZWR1bGVOZXh0UmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIHNjaGVkdWxlTmV4dFJlbmRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy51c2VBbmltYXRpb25GcmFtZSkge1xuICAgICAgdGhpcy5mcmFtZVVwZGF0ZUhhbmRsZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXJGcmFtZS5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mcmFtZVVwZGF0ZUhhbmRsZXJJZCA9IHNldFRpbWVvdXQodGhpcy5yZW5kZXJGcmFtZS5iaW5kKHRoaXMpLCB0aGlzLmZyYW1lSW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5pbXBvcnQge1BsYXllclV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgUGxheWVyUmVzaXplRXZlbnQgPSBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyUmVzaXplRXZlbnQ7XG5pbXBvcnQge0NhbmNlbEV2ZW50QXJnc30gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgVUlDb250YWluZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVJQ29udGFpbmVyQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIGNvbnRyb2wgYmFyIHdpbGwgYmUgaGlkZGVuIHdoZW4gdGhlcmUgaXMgbm8gdXNlciBpbnRlcmFjdGlvbi5cbiAgICogRGVmYXVsdDogNSBzZWNvbmRzICg1MDAwKVxuICAgKi9cbiAgaGlkZURlbGF5PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIGFsbCBvZiB0aGUgVUkuIFRoZSBVSUNvbnRhaW5lciBpcyBwYXNzZWQgdG8gdGhlIHtAbGluayBVSU1hbmFnZXJ9IHRvIGJ1aWxkIGFuZFxuICogc2V0dXAgdGhlIFVJLlxuICovXG5leHBvcnQgY2xhc3MgVUlDb250YWluZXIgZXh0ZW5kcyBDb250YWluZXI8VUlDb250YWluZXJDb25maWc+IHtcblxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTVEFURV9QUkVGSVggPSAncGxheWVyLXN0YXRlLSc7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRlVMTFNDUkVFTiA9ICdmdWxsc2NyZWVuJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQlVGRkVSSU5HID0gJ2J1ZmZlcmluZyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFJFTU9URV9DT05UUk9MID0gJ3JlbW90ZS1jb250cm9sJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ09OVFJPTFNfU0hPV04gPSAnY29udHJvbHMtc2hvd24nO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT05UUk9MU19ISURERU4gPSAnY29udHJvbHMtaGlkZGVuJztcblxuICBwcml2YXRlIHVpSGlkZVRpbWVvdXQ6IFRpbWVvdXQ7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBVSUNvbnRhaW5lckNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCA8VUlDb250YWluZXJDb25maWc+e1xuICAgICAgY3NzQ2xhc3M6ICd1aS11aWNvbnRhaW5lcicsXG4gICAgICBoaWRlRGVsYXk6IDUwMDAsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVVJU2hvd0hpZGUocGxheWVyLCB1aW1hbmFnZXIpO1xuICAgIHRoaXMuY29uZmlndXJlUGxheWVyU3RhdGVzKHBsYXllciwgdWltYW5hZ2VyKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlVUlTaG93SGlkZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgY29udGFpbmVyID0gdGhpcy5nZXREb21FbGVtZW50KCk7XG4gICAgbGV0IGNvbmZpZyA9IDxVSUNvbnRhaW5lckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgbGV0IGlzVWlTaG93biA9IGZhbHNlO1xuICAgIGxldCBpc1NlZWtpbmcgPSBmYWxzZTtcbiAgICBsZXQgaXNGaXJzdFRvdWNoID0gdHJ1ZTtcblxuICAgIGxldCBzaG93VWkgPSAoKSA9PiB7XG4gICAgICBpZiAoIWlzVWlTaG93bikge1xuICAgICAgICAvLyBMZXQgc3Vic2NyaWJlcnMga25vdyB0aGF0IHRoZXkgc2hvdWxkIHJldmVhbCB0aGVtc2VsdmVzXG4gICAgICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzU2hvdy5kaXNwYXRjaCh0aGlzKTtcbiAgICAgICAgaXNVaVNob3duID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIERvbid0IHRyaWdnZXIgdGltZW91dCB3aGlsZSBzZWVraW5nIChpdCB3aWxsIGJlIHRyaWdnZXJlZCBvbmNlIHRoZSBzZWVrIGlzIGZpbmlzaGVkKSBvciBjYXN0aW5nXG4gICAgICBpZiAoIWlzU2Vla2luZyAmJiAhcGxheWVyLmlzQ2FzdGluZygpKSB7XG4gICAgICAgIHRoaXMudWlIaWRlVGltZW91dC5zdGFydCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgaGlkZVVpID0gKCkgPT4ge1xuICAgICAgLy8gSGlkZSB0aGUgVUkgb25seSBpZiBpdCBpcyBzaG93biwgYW5kIGlmIG5vdCBjYXN0aW5nXG4gICAgICBpZiAoaXNVaVNob3duICYmICFwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgICAgLy8gSXNzdWUgYSBwcmV2aWV3IGV2ZW50IHRvIGNoZWNrIGlmIHdlIGFyZSBnb29kIHRvIGhpZGUgdGhlIGNvbnRyb2xzXG4gICAgICAgIGxldCBwcmV2aWV3SGlkZUV2ZW50QXJncyA9IDxDYW5jZWxFdmVudEFyZ3M+e307XG4gICAgICAgIHVpbWFuYWdlci5vblByZXZpZXdDb250cm9sc0hpZGUuZGlzcGF0Y2godGhpcywgcHJldmlld0hpZGVFdmVudEFyZ3MpO1xuXG4gICAgICAgIGlmICghcHJldmlld0hpZGVFdmVudEFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIHByZXZpZXcgd2Fzbid0IGNhbmNlbGVkLCBsZXQgc3Vic2NyaWJlcnMga25vdyB0aGF0IHRoZXkgc2hvdWxkIG5vdyBoaWRlIHRoZW1zZWx2ZXNcbiAgICAgICAgICB1aW1hbmFnZXIub25Db250cm9sc0hpZGUuZGlzcGF0Y2godGhpcyk7XG4gICAgICAgICAgaXNVaVNob3duID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGhpZGUgcHJldmlldyB3YXMgY2FuY2VsZWQsIGNvbnRpbnVlIHRvIHNob3cgVUlcbiAgICAgICAgICBzaG93VWkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUaW1lb3V0IHRvIGRlZmVyIFVJIGhpZGluZyBieSB0aGUgY29uZmlndXJlZCBkZWxheSB0aW1lXG4gICAgdGhpcy51aUhpZGVUaW1lb3V0ID0gbmV3IFRpbWVvdXQoY29uZmlnLmhpZGVEZWxheSwgaGlkZVVpKTtcblxuICAgIC8vIE9uIHRvdWNoIGRpc3BsYXlzLCB0aGUgZmlyc3QgdG91Y2ggcmV2ZWFscyB0aGUgVUlcbiAgICBjb250YWluZXIub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcbiAgICAgIGlmICghaXNVaVNob3duKSB7XG4gICAgICAgIC8vIE9ubHkgaWYgdGhlIFVJIGlzIGhpZGRlbiwgd2UgcHJldmVudCBvdGhlciBhY3Rpb25zIChleGNlcHQgZm9yIHRoZSBmaXJzdCB0b3VjaCkgYW5kIHJldmVhbCB0aGUgVUkgaW5zdGVhZC5cbiAgICAgICAgLy8gVGhlIGZpcnN0IHRvdWNoIGlzIG5vdCBwcmV2ZW50ZWQgdG8gbGV0IG90aGVyIGxpc3RlbmVycyByZWNlaXZlIHRoZSBldmVudCBhbmQgdHJpZ2dlciBhbiBpbml0aWFsIGFjdGlvbiwgZS5nLlxuICAgICAgICAvLyB0aGUgaHVnZSBwbGF5YmFjayBidXR0b24gY2FuIGRpcmVjdGx5IHN0YXJ0IHBsYXliYWNrIGluc3RlYWQgb2YgcmVxdWlyaW5nIGEgZG91YmxlIHRhcCB3aGljaCAxLiByZXZlYWxzXG4gICAgICAgIC8vIHRoZSBVSSBhbmQgMi4gc3RhcnRzIHBsYXliYWNrLlxuICAgICAgICBpZiAoaXNGaXJzdFRvdWNoKSB7XG4gICAgICAgICAgaXNGaXJzdFRvdWNoID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIHNob3dVaSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIFdoZW4gdGhlIG1vdXNlIGVudGVycywgd2Ugc2hvdyB0aGUgVUlcbiAgICBjb250YWluZXIub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICB9KTtcbiAgICAvLyBXaGVuIHRoZSBtb3VzZSBtb3ZlcyB3aXRoaW4sIHdlIHNob3cgdGhlIFVJXG4gICAgY29udGFpbmVyLm9uKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICB9KTtcbiAgICAvLyBXaGVuIHRoZSBtb3VzZSBsZWF2ZXMsIHdlIGNhbiBwcmVwYXJlIHRvIGhpZGUgdGhlIFVJLCBleGNlcHQgYSBzZWVrIGlzIGdvaW5nIG9uXG4gICAgY29udGFpbmVyLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gV2hlbiBhIHNlZWsgaXMgZ29pbmcgb24sIHRoZSBzZWVrIHNjcnViIHBvaW50ZXIgbWF5IGV4aXQgdGhlIFVJIGFyZWEgd2hpbGUgc3RpbGwgc2Vla2luZywgYW5kIHdlIGRvIG5vdCBoaWRlXG4gICAgICAvLyB0aGUgVUkgaW4gc3VjaCBjYXNlc1xuICAgICAgaWYgKCFpc1NlZWtpbmcpIHtcbiAgICAgICAgdGhpcy51aUhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB1aW1hbmFnZXIub25TZWVrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnVpSGlkZVRpbWVvdXQuY2xlYXIoKTsgLy8gRG9uJ3QgaGlkZSBVSSB3aGlsZSBhIHNlZWsgaXMgaW4gcHJvZ3Jlc3NcbiAgICAgIGlzU2Vla2luZyA9IHRydWU7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uU2Vla2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMudWlIaWRlVGltZW91dC5zdGFydCgpOyAvLyBSZS1lbmFibGUgVUkgaGlkZSB0aW1lb3V0IGFmdGVyIGEgc2Vla1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlRFRCwgKCkgPT4ge1xuICAgICAgc2hvd1VpKCk7IC8vIFNob3cgVUkgd2hlbiBhIENhc3Qgc2Vzc2lvbiBoYXMgc3RhcnRlZCAoVUkgd2lsbCB0aGVuIHN0YXkgcGVybWFuZW50bHkgb24gZHVyaW5nIHRoZSBzZXNzaW9uKVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVQbGF5ZXJTdGF0ZXMocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgbGV0IGNvbnRhaW5lciA9IHRoaXMuZ2V0RG9tRWxlbWVudCgpO1xuXG4gICAgLy8gQ29udmVydCBwbGF5ZXIgc3RhdGVzIGludG8gQ1NTIGNsYXNzIG5hbWVzXG4gICAgbGV0IHN0YXRlQ2xhc3NOYW1lcyA9IDxhbnk+W107XG4gICAgZm9yIChsZXQgc3RhdGUgaW4gUGxheWVyVXRpbHMuUGxheWVyU3RhdGUpIHtcbiAgICAgIGlmIChpc05hTihOdW1iZXIoc3RhdGUpKSkge1xuICAgICAgICBsZXQgZW51bU5hbWUgPSBQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZVs8YW55PlBsYXllclV0aWxzLlBsYXllclN0YXRlW3N0YXRlXV07XG4gICAgICAgIHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZVtzdGF0ZV1dID1cbiAgICAgICAgICB0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5TVEFURV9QUkVGSVggKyBlbnVtTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVtb3ZlU3RhdGVzID0gKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZS5JRExFXSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBSRVBBUkVEXSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBMQVlJTkddKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUEFVU0VEXSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLkZJTklTSEVEXSk7XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgKCkgPT4ge1xuICAgICAgcmVtb3ZlU3RhdGVzKCk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBSRVBBUkVEXSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgKCkgPT4ge1xuICAgICAgcmVtb3ZlU3RhdGVzKCk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBMQVlJTkddKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QQVVTRUQsICgpID0+IHtcbiAgICAgIHJlbW92ZVN0YXRlcygpO1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZS5QQVVTRURdKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZQkFDS19GSU5JU0hFRCwgKCkgPT4ge1xuICAgICAgcmVtb3ZlU3RhdGVzKCk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLkZJTklTSEVEXSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCAoKSA9PiB7XG4gICAgICByZW1vdmVTdGF0ZXMoKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuSURMRV0pO1xuICAgIH0pO1xuICAgIC8vIEluaXQgaW4gY3VycmVudCBwbGF5ZXIgc3RhdGVcbiAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLmdldFN0YXRlKHBsYXllcildKTtcblxuICAgIC8vIEZ1bGxzY3JlZW4gbWFya2VyIGNsYXNzXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fRlVMTFNDUkVFTl9FTlRFUiwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkZVTExTQ1JFRU4pKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9GVUxMU0NSRUVOX0VYSVQsICgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5GVUxMU0NSRUVOKSk7XG4gICAgfSk7XG4gICAgLy8gSW5pdCBmdWxsc2NyZWVuIHN0YXRlXG4gICAgaWYgKHBsYXllci5pc0Z1bGxzY3JlZW4oKSkge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkZVTExTQ1JFRU4pKTtcbiAgICB9XG5cbiAgICAvLyBCdWZmZXJpbmcgbWFya2VyIGNsYXNzXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1RBTExfU1RBUlRFRCwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkJVRkZFUklORykpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX0VOREVELCAoKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQlVGRkVSSU5HKSk7XG4gICAgfSk7XG4gICAgLy8gSW5pdCBidWZmZXJpbmcgc3RhdGVcbiAgICBpZiAocGxheWVyLmlzU3RhbGxlZCgpKSB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQlVGRkVSSU5HKSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3RlQ29udHJvbCBtYXJrZXIgY2xhc3NcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsICgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5SRU1PVEVfQ09OVFJPTCkpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RPUFBFRCwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLlJFTU9URV9DT05UUk9MKSk7XG4gICAgfSk7XG4gICAgLy8gSW5pdCBSZW1vdGVDb250cm9sIHN0YXRlXG4gICAgaWYgKHBsYXllci5pc0Nhc3RpbmcoKSkge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLlJFTU9URV9DT05UUk9MKSk7XG4gICAgfVxuXG4gICAgLy8gQ29udHJvbHMgdmlzaWJpbGl0eSBtYXJrZXIgY2xhc3NcbiAgICB1aW1hbmFnZXIub25Db250cm9sc1Nob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5DT05UUk9MU19ISURERU4pKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5DT05UUk9MU19TSE9XTikpO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkNPTlRST0xTX1NIT1dOKSk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQ09OVFJPTFNfSElEREVOKSk7XG4gICAgfSk7XG5cbiAgICAvLyBMYXlvdXQgc2l6ZSBjbGFzc2VzXG4gICAgbGV0IHVwZGF0ZUxheW91dFNpemVDbGFzc2VzID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtNDAwJykpO1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTYwMCcpKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC04MDAnKSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtMTIwMCcpKTtcblxuICAgICAgaWYgKHdpZHRoIDw9IDQwMCkge1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtNDAwJykpO1xuICAgICAgfSBlbHNlIGlmICh3aWR0aCA8PSA2MDApIHtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTYwMCcpKTtcbiAgICAgIH0gZWxzZSBpZiAod2lkdGggPD0gODAwKSB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC04MDAnKSk7XG4gICAgICB9IGVsc2UgaWYgKHdpZHRoIDw9IDEyMDApIHtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTEyMDAnKSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZRVJfUkVTSVpFLCAoZTogUGxheWVyUmVzaXplRXZlbnQpID0+IHtcbiAgICAgIC8vIENvbnZlcnQgc3RyaW5ncyAod2l0aCBcInB4XCIgc3VmZml4KSB0byBpbnRzXG4gICAgICBsZXQgd2lkdGggPSBNYXRoLnJvdW5kKE51bWJlcihlLndpZHRoLnN1YnN0cmluZygwLCBlLndpZHRoLmxlbmd0aCAtIDIpKSk7XG4gICAgICBsZXQgaGVpZ2h0ID0gTWF0aC5yb3VuZChOdW1iZXIoZS5oZWlnaHQuc3Vic3RyaW5nKDAsIGUuaGVpZ2h0Lmxlbmd0aCAtIDIpKSk7XG5cbiAgICAgIHVwZGF0ZUxheW91dFNpemVDbGFzc2VzKHdpZHRoLCBoZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdCBsYXlvdXQgc3RhdGVcbiAgICB1cGRhdGVMYXlvdXRTaXplQ2xhc3NlcyhuZXcgRE9NKHBsYXllci5nZXRGaWd1cmUoKSkud2lkdGgoKSwgbmV3IERPTShwbGF5ZXIuZ2V0RmlndXJlKCkpLmhlaWdodCgpKTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIHRoaXMudWlIaWRlVGltZW91dC5jbGVhcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGxldCBjb250YWluZXIgPSBzdXBlci50b0RvbUVsZW1lbnQoKTtcblxuICAgIC8vIERldGVjdCBmbGV4Ym94IHN1cHBvcnQgKG5vdCBzdXBwb3J0ZWQgaW4gSUU5KVxuICAgIGlmIChkb2N1bWVudCAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnN0eWxlLmZsZXggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2ZsZXhib3gnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbm8tZmxleGJveCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG59IiwiaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vc2VsZWN0Ym94JztcbmltcG9ydCB7TGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2VsZWN0IGJveCBwcm92aWRpbmcgYSBzZWxlY3Rpb24gYmV0d2VlbiAnYXV0bycgYW5kIHRoZSBhdmFpbGFibGUgdmlkZW8gcXVhbGl0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9RdWFsaXR5U2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIsIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IHVwZGF0ZVZpZGVvUXVhbGl0aWVzID0gKCkgPT4ge1xuICAgICAgbGV0IHZpZGVvUXVhbGl0aWVzID0gcGxheWVyLmdldEF2YWlsYWJsZVZpZGVvUXVhbGl0aWVzKCk7XG5cbiAgICAgIHRoaXMuY2xlYXJJdGVtcygpO1xuXG4gICAgICAvLyBBZGQgZW50cnkgZm9yIGF1dG9tYXRpYyBxdWFsaXR5IHN3aXRjaGluZyAoZGVmYXVsdCBzZXR0aW5nKVxuICAgICAgdGhpcy5hZGRJdGVtKCdhdXRvJywgJ2F1dG8nKTtcblxuICAgICAgLy8gQWRkIHZpZGVvIHF1YWxpdGllc1xuICAgICAgZm9yIChsZXQgdmlkZW9RdWFsaXR5IG9mIHZpZGVvUXVhbGl0aWVzKSB7XG4gICAgICAgIHRoaXMuYWRkSXRlbSh2aWRlb1F1YWxpdHkuaWQsIHZpZGVvUXVhbGl0eS5sYWJlbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IFZpZGVvUXVhbGl0eVNlbGVjdEJveCwgdmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgcGxheWVyLnNldFZpZGVvUXVhbGl0eSh2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgcXVhbGl0aWVzIHdoZW4gc291cmNlIGdvZXMgYXdheVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgdXBkYXRlVmlkZW9RdWFsaXRpZXMpO1xuICAgIC8vIFVwZGF0ZSBxdWFsaXRpZXMgd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHVwZGF0ZVZpZGVvUXVhbGl0aWVzKTtcbiAgICAvLyBVcGRhdGUgcXVhbGl0eSBzZWxlY3Rpb24gd2hlbiBxdWFsaXR5IGlzIGNoYW5nZWQgKGZyb20gb3V0c2lkZSlcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9WSURFT19ET1dOTE9BRF9RVUFMSVRZX0NIQU5HRSwgKCkgPT4ge1xuICAgICAgbGV0IGRhdGEgPSBwbGF5ZXIuZ2V0RG93bmxvYWRlZFZpZGVvRGF0YSgpO1xuICAgICAgdGhpcy5zZWxlY3RJdGVtKGRhdGEuaXNBdXRvID8gJ2F1dG8nIDogZGF0YS5pZCk7XG4gICAgfSk7XG5cbiAgICAvLyBQb3B1bGF0ZSBxdWFsaXRpZXMgYXQgc3RhcnR1cFxuICAgIHVwZGF0ZVZpZGVvUXVhbGl0aWVzKCk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lciwgQ29udGFpbmVyQ29uZmlnfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge1ZvbHVtZVNsaWRlcn0gZnJvbSAnLi92b2x1bWVzbGlkZXInO1xuaW1wb3J0IHtWb2x1bWVUb2dnbGVCdXR0b259IGZyb20gJy4vdm9sdW1ldG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1RpbWVvdXR9IGZyb20gJy4uL3RpbWVvdXQnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBWb2x1bWVDb250cm9sQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWb2x1bWVDb250cm9sQnV0dG9uQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBkZWxheSBhZnRlciB3aGljaCB0aGUgdm9sdW1lIHNsaWRlciB3aWxsIGJlIGhpZGRlbiB3aGVuIHRoZXJlIGlzIG5vIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAqIENhcmUgbXVzdCBiZSB0YWtlbiB0aGF0IHRoZSBkZWxheSBpcyBsb25nIGVub3VnaCBzbyB1c2VycyBjYW4gcmVhY2ggdGhlIHNsaWRlciBmcm9tIHRoZSB0b2dnbGUgYnV0dG9uLCBlLmcuIGJ5XG4gICAqIG1vdXNlIG1vdmVtZW50LiBJZiB0aGUgZGVsYXkgaXMgdG9vIHNob3J0LCB0aGUgc2xpZGVycyBkaXNhcHBlYXJzIGJlZm9yZSB0aGUgbW91c2UgcG9pbnRlciBoYXMgcmVhY2hlZCBpdCBhbmRcbiAgICogdGhlIHVzZXIgaXMgbm90IGFibGUgdG8gdXNlIGl0LlxuICAgKiBEZWZhdWx0OiA1MDBtc1xuICAgKi9cbiAgaGlkZURlbGF5PzogbnVtYmVyO1xuICAvKipcbiAgICogU3BlY2lmaWVzIGlmIHRoZSB2b2x1bWUgc2xpZGVyIHNob3VsZCBiZSB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseSBhbGlnbmVkLlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICB2ZXJ0aWNhbD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBjb21wb3NpdGUgdm9sdW1lIGNvbnRyb2wgdGhhdCBjb25zaXN0cyBvZiBhbmQgaW50ZXJuYWxseSBtYW5hZ2VzIGEgdm9sdW1lIGNvbnRyb2wgYnV0dG9uIHRoYXQgY2FuIGJlIHVzZWRcbiAqIGZvciBtdXRpbmcsIGFuZCBhIChkZXBlbmRpbmcgb24gdGhlIENTUyBzdHlsZSwgZS5nLiBzbGlkZS1vdXQpIHZvbHVtZSBjb250cm9sIGJhci5cbiAqL1xuZXhwb3J0IGNsYXNzIFZvbHVtZUNvbnRyb2xCdXR0b24gZXh0ZW5kcyBDb250YWluZXI8Vm9sdW1lQ29udHJvbEJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgdm9sdW1lVG9nZ2xlQnV0dG9uOiBWb2x1bWVUb2dnbGVCdXR0b247XG4gIHByaXZhdGUgdm9sdW1lU2xpZGVyOiBWb2x1bWVTbGlkZXI7XG5cbiAgcHJpdmF0ZSB2b2x1bWVTbGlkZXJIaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFZvbHVtZUNvbnRyb2xCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLnZvbHVtZVRvZ2dsZUJ1dHRvbiA9IG5ldyBWb2x1bWVUb2dnbGVCdXR0b24oKTtcbiAgICB0aGlzLnZvbHVtZVNsaWRlciA9IG5ldyBWb2x1bWVTbGlkZXIoe1xuICAgICAgdmVydGljYWw6IGNvbmZpZy52ZXJ0aWNhbCAhPSBudWxsID8gY29uZmlnLnZlcnRpY2FsIDogdHJ1ZSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS12b2x1bWVjb250cm9sYnV0dG9uJyxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLnZvbHVtZVRvZ2dsZUJ1dHRvbiwgdGhpcy52b2x1bWVTbGlkZXJdLFxuICAgICAgaGlkZURlbGF5OiA1MDBcbiAgICB9LCA8Vm9sdW1lQ29udHJvbEJ1dHRvbkNvbmZpZz50aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB2b2x1bWVUb2dnbGVCdXR0b24gPSB0aGlzLmdldFZvbHVtZVRvZ2dsZUJ1dHRvbigpO1xuICAgIGxldCB2b2x1bWVTbGlkZXIgPSB0aGlzLmdldFZvbHVtZVNsaWRlcigpO1xuXG4gICAgdGhpcy52b2x1bWVTbGlkZXJIaWRlVGltZW91dCA9IG5ldyBUaW1lb3V0KCg8Vm9sdW1lQ29udHJvbEJ1dHRvbkNvbmZpZz50aGlzLmdldENvbmZpZygpKS5oaWRlRGVsYXksICgpID0+IHtcbiAgICAgIHZvbHVtZVNsaWRlci5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICAvKlxuICAgICAqIFZvbHVtZSBTbGlkZXIgdmlzaWJpbGl0eSBoYW5kbGluZ1xuICAgICAqXG4gICAgICogVGhlIHZvbHVtZSBzbGlkZXIgc2hhbGwgYmUgdmlzaWJsZSB3aGlsZSB0aGUgdXNlciBob3ZlcnMgdGhlIG11dGUgdG9nZ2xlIGJ1dHRvbiwgd2hpbGUgdGhlIHVzZXIgaG92ZXJzIHRoZVxuICAgICAqIHZvbHVtZSBzbGlkZXIsIGFuZCB3aGlsZSB0aGUgdXNlciBzbGlkZXMgdGhlIHZvbHVtZSBzbGlkZXIuIElmIG5vbmUgb2YgdGhlc2Ugc2l0dWF0aW9ucyBhcmUgdHJ1ZSwgdGhlIHNsaWRlclxuICAgICAqIHNoYWxsIGRpc2FwcGVhci5cbiAgICAgKi9cbiAgICBsZXQgdm9sdW1lU2xpZGVySG92ZXJlZCA9IGZhbHNlO1xuICAgIHZvbHVtZVRvZ2dsZUJ1dHRvbi5nZXREb21FbGVtZW50KCkub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAvLyBTaG93IHZvbHVtZSBzbGlkZXIgd2hlbiBtb3VzZSBlbnRlcnMgdGhlIGJ1dHRvbiBhcmVhXG4gICAgICBpZiAodm9sdW1lU2xpZGVyLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdm9sdW1lU2xpZGVyLnNob3coKTtcbiAgICAgIH1cbiAgICAgIC8vIEF2b2lkIGhpZGluZyBvZiB0aGUgc2xpZGVyIHdoZW4gYnV0dG9uIGlzIGhvdmVyZWRcbiAgICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICB9KTtcbiAgICB2b2x1bWVUb2dnbGVCdXR0b24uZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gSGlkZSBzbGlkZXIgZGVsYXllZCB3aGVuIGJ1dHRvbiBpcyBsZWZ0XG4gICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgfSk7XG4gICAgdm9sdW1lU2xpZGVyLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIC8vIFdoZW4gdGhlIHNsaWRlciBpcyBlbnRlcmVkLCBjYW5jZWwgdGhlIGhpZGUgdGltZW91dCBhY3RpdmF0ZWQgYnkgbGVhdmluZyB0aGUgYnV0dG9uXG4gICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB2b2x1bWVTbGlkZXJIb3ZlcmVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICB2b2x1bWVTbGlkZXIuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gV2hlbiBtb3VzZSBsZWF2ZXMgdGhlIHNsaWRlciwgb25seSBoaWRlIGl0IGlmIHRoZXJlIGlzIG5vIHNsaWRlIG9wZXJhdGlvbiBpbiBwcm9ncmVzc1xuICAgICAgaWYgKHZvbHVtZVNsaWRlci5pc1NlZWtpbmcoKSkge1xuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgICB9XG4gICAgICB2b2x1bWVTbGlkZXJIb3ZlcmVkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdm9sdW1lU2xpZGVyLm9uU2Vla2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBXaGVuIGEgc2xpZGUgb3BlcmF0aW9uIGlzIGRvbmUgYW5kIHRoZSBzbGlkZXIgbm90IGhvdmVyZWQgKG1vdXNlIG91dHNpZGUgc2xpZGVyKSwgaGlkZSBzbGlkZXIgZGVsYXllZFxuICAgICAgaWYgKCF2b2x1bWVTbGlkZXJIb3ZlcmVkKSB7XG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQucmVzZXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGludGVybmFsbHkgbWFuYWdlZCB2b2x1bWUgdG9nZ2xlIGJ1dHRvbi5cbiAgICogQHJldHVybnMge1ZvbHVtZVRvZ2dsZUJ1dHRvbn1cbiAgICovXG4gIGdldFZvbHVtZVRvZ2dsZUJ1dHRvbigpOiBWb2x1bWVUb2dnbGVCdXR0b24ge1xuICAgIHJldHVybiB0aGlzLnZvbHVtZVRvZ2dsZUJ1dHRvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGludGVybmFsbHkgbWFuYWdlZCB2b2x1bWUgc2lsZGVyLlxuICAgKiBAcmV0dXJucyB7Vm9sdW1lU2xpZGVyfVxuICAgKi9cbiAgZ2V0Vm9sdW1lU2xpZGVyKCk6IFZvbHVtZVNsaWRlciB7XG4gICAgcmV0dXJuIHRoaXMudm9sdW1lU2xpZGVyO1xuICB9XG59IiwiaW1wb3J0IHtTZWVrQmFyLCBTZWVrQmFyQ29uZmlnfSBmcm9tICcuL3NlZWtiYXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBWb2x1bWVTbGlkZXJ9IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWb2x1bWVTbGlkZXJDb25maWcgZXh0ZW5kcyBTZWVrQmFyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiB0aGUgdm9sdW1lIHNsaWRlciBzaG91bGQgYmUgYXV0b21hdGljYWxseSBoaWRkZW4gd2hlbiB2b2x1bWUgY29udHJvbCBpcyBwcm9oaWJpdGVkIGJ5IHRoZVxuICAgKiBicm93c2VyIG9yIHBsYXRmb3JtLiBUaGlzIGN1cnJlbnRseSBvbmx5IGFwcGxpZXMgdG8gaU9TLlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBoaWRlSWZWb2x1bWVDb250cm9sUHJvaGliaXRlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSB2b2x1bWUgc2xpZGVyIGNvbXBvbmVudCB0byBhZGp1c3QgdGhlIHBsYXllcidzIHZvbHVtZSBzZXR0aW5nLlxuICovXG5leHBvcnQgY2xhc3MgVm9sdW1lU2xpZGVyIGV4dGVuZHMgU2Vla0JhciB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZWVrQmFyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywgPFZvbHVtZVNsaWRlckNvbmZpZz57XG4gICAgICBjc3NDbGFzczogJ3VpLXZvbHVtZXNsaWRlcicsXG4gICAgICBoaWRlSWZWb2x1bWVDb250cm9sUHJvaGliaXRlZDogdHJ1ZSxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyLCBmYWxzZSk7XG5cbiAgICBsZXQgY29uZmlnID0gPFZvbHVtZVNsaWRlckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgaWYgKGNvbmZpZy5oaWRlSWZWb2x1bWVDb250cm9sUHJvaGliaXRlZCAmJiAhdGhpcy5kZXRlY3RWb2x1bWVDb250cm9sQXZhaWxhYmlsaXR5KHBsYXllcikpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuXG4gICAgICAvLyBXZSBjYW4ganVzdCByZXR1cm4gZnJvbSBoZXJlLCBiZWNhdXNlIHRoZSB1c2VyIHdpbGwgbmV2ZXIgaW50ZXJhY3Qgd2l0aCB0aGUgY29udHJvbCBhbmQgYW55IGNvbmZpZ3VyZWRcbiAgICAgIC8vIGZ1bmN0aW9uYWxpdHkgd291bGQgb25seSBlYXQgcmVzb3VyY2VzIGZvciBubyByZWFzb24uXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHZvbHVtZUNoYW5nZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTXV0ZWQoKSkge1xuICAgICAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24oMCk7XG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24oMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24ocGxheWVyLmdldFZvbHVtZSgpKTtcblxuICAgICAgICB0aGlzLnNldEJ1ZmZlclBvc2l0aW9uKHBsYXllci5nZXRWb2x1bWUoKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB2b2x1bWVDaGFuZ2VIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9WT0xVTUVfQ0hBTkdFRCwgdm9sdW1lQ2hhbmdlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fTVVURUQsIHZvbHVtZUNoYW5nZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1VOTVVURUQsIHZvbHVtZUNoYW5nZUhhbmRsZXIpO1xuXG4gICAgdGhpcy5vblNlZWtQcmV2aWV3LnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XG4gICAgICBpZiAoYXJncy5zY3J1YmJpbmcpIHtcbiAgICAgICAgcGxheWVyLnNldFZvbHVtZShhcmdzLnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uU2Vla2VkLnN1YnNjcmliZSgoc2VuZGVyLCBwZXJjZW50YWdlKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0Vm9sdW1lKHBlcmNlbnRhZ2UpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSB2b2x1bWUgc2xpZGVyIG1hcmtlciB3aGVuIHRoZSBwbGF5ZXIgcmVzaXplZCwgYSBzb3VyY2UgaXMgbG9hZGVkIGFuZCBwbGF5ZXIgaXMgcmVhZHksXG4gICAgLy8gb3IgdGhlIFVJIGlzIGNvbmZpZ3VyZWQuIENoZWNrIHRoZSBzZWVrYmFyIGZvciBhIGRldGFpbGVkIGRlc2NyaXB0aW9uLlxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsICgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbmZpZ3VyZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcblxuICAgIC8vIEluaXQgdm9sdW1lIGJhclxuICAgIHZvbHVtZUNoYW5nZUhhbmRsZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZGV0ZWN0Vm9sdW1lQ29udHJvbEF2YWlsYWJpbGl0eShwbGF5ZXI6IGJpdG1vdmluLnBsYXllci5QbGF5ZXIpOiBib29sZWFuIHtcbiAgICAvLyBTdG9yZSBjdXJyZW50IHBsYXllciBzdGF0ZSBzbyB3ZSBjYW4gcmVzdG9yZSBpdCBsYXRlclxuICAgIGxldCB2b2x1bWUgPSBwbGF5ZXIuZ2V0Vm9sdW1lKCk7XG4gICAgbGV0IG11dGVkID0gcGxheWVyLmlzTXV0ZWQoKTtcbiAgICBsZXQgcGxheWluZyA9IHBsYXllci5pc1BsYXlpbmcoKTtcblxuICAgIC8qXG4gICAgICogXCJPbiBpT1MgZGV2aWNlcywgdGhlIGF1ZGlvIGxldmVsIGlzIGFsd2F5cyB1bmRlciB0aGUgdXNlcuKAmXMgcGh5c2ljYWwgY29udHJvbC4gVGhlIHZvbHVtZSBwcm9wZXJ0eSBpcyBub3RcbiAgICAgKiBzZXR0YWJsZSBpbiBKYXZhU2NyaXB0LiBSZWFkaW5nIHRoZSB2b2x1bWUgcHJvcGVydHkgYWx3YXlzIHJldHVybnMgMS5cIlxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLmFwcGxlLmNvbS9saWJyYXJ5L2NvbnRlbnQvZG9jdW1lbnRhdGlvbi9BdWRpb1ZpZGVvL0NvbmNlcHR1YWwvVXNpbmdfSFRNTDVfQXVkaW9fVmlkZW8vRGV2aWNlLVNwZWNpZmljQ29uc2lkZXJhdGlvbnMvRGV2aWNlLVNwZWNpZmljQ29uc2lkZXJhdGlvbnMuaHRtbFxuICAgICAqXG4gICAgICogT3VyIHBsYXllciBBUEkgcmV0dXJucyBhIHZvbHVtZSByYW5nZSBvZiBbMCwgMTAwXSBzbyB3ZSBuZWVkIHRvIGNoZWNrIGZvciAxMDAgaW5zdGVhZCBvZiAxLlxuICAgICAqL1xuXG4gICAgLy8gT25seSBpZiB0aGUgdm9sdW1lIGlzIDEwMCwgdGhlcmUncyB0aGUgcG9zc2liaWxpdHkgd2UgYXJlIG9uIGEgdm9sdW1lLWNvbnRyb2wtcmVzdHJpY3RlZCBpT1MgZGV2aWNlXG4gICAgaWYgKHZvbHVtZSA9PT0gMTAwKSB7XG4gICAgICAvLyBXZSBzZXQgdGhlIHZvbHVtZSB0byB6ZXJvICh0aGF0J3MgdGhlIG9ubHkgdmFsdWUgdGhhdCBkb2VzIG5vdCB1bm11dGUgYSBtdXRlZCBwbGF5ZXIhKVxuICAgICAgcGxheWVyLnNldFZvbHVtZSgwKTtcbiAgICAgIC8vIFRoZW4gd2UgY2hlY2sgaWYgdGhlIHZhbHVlIGlzIHN0aWxsIDEwMFxuICAgICAgaWYgKHBsYXllci5nZXRWb2x1bWUoKSA9PT0gMTAwKSB7XG4gICAgICAgIC8vIElmIHRoZSB2b2x1bWUgc3RheWVkIGF0IDEwMCwgd2UncmUgb24gYSB2b2x1bWUtY29udHJvbC1yZXN0cmljdGVkIGRldmljZVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSBjYW4gY29udHJvbCB2b2x1bWUsIHNvIHdlIG11c3QgcmVzdG9yZSB0aGUgcHJldmlvdXMgcGxheWVyIHN0YXRlXG4gICAgICAgIHBsYXllci5zZXRWb2x1bWUodm9sdW1lKTtcbiAgICAgICAgaWYgKG11dGVkKSB7XG4gICAgICAgICAgcGxheWVyLm11dGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxheWluZykge1xuICAgICAgICAgIC8vIFRoZSB2b2x1bWUgcmVzdG9yZSBhYm92ZSBwYXVzZXMgYXV0b3BsYXkgb24gbW9iaWxlIGRldmljZXMgKGUuZy4gQW5kcm9pZCkgc28gd2UgbmVlZCB0byByZXN1bWUgcGxheWJhY2tcbiAgICAgICAgICAvLyAoV2UgY2Fubm90IGNoZWNrIGlzUGF1c2VkKCkgaGVyZSBiZWNhdXNlIGl0IGlzIG5vdCBzZXQgd2hlbiBwbGF5YmFjayBpcyBwcm9oaWJpdGVkIGJ5IHRoZSBtb2JpbGUgcGxhdGZvcm0pXG4gICAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVm9sdW1lIGlzIG5vdCAxMDAsIHNvIHdlJ3JlIGRlZmluaXRlbHkgbm90IG9uIGEgdm9sdW1lLWNvbnRyb2wtcmVzdHJpY3RlZCBpT1MgZGV2aWNlXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyBhdWRpbyBtdXRpbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBWb2x1bWVUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXZvbHVtZXRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnVm9sdW1lL011dGUnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4ucGxheWVyLlBsYXllciwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgbXV0ZVN0YXRlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNNdXRlZCgpKSB7XG4gICAgICAgIHRoaXMub24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub2ZmKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCB2b2x1bWVMZXZlbEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAvLyBUb2dnbGUgbG93IGNsYXNzIHRvIGRpc3BsYXkgbG93IHZvbHVtZSBpY29uIGJlbG93IDUwJSB2b2x1bWVcbiAgICAgIGlmIChwbGF5ZXIuZ2V0Vm9sdW1lKCkgPCA1MCkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbG93JykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xvdycpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fTVVURUQsIG11dGVTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1VOTVVURUQsIG11dGVTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZPTFVNRV9DSEFOR0VELCB2b2x1bWVMZXZlbEhhbmRsZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTXV0ZWQoKSkge1xuICAgICAgICBwbGF5ZXIudW5tdXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIubXV0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU3RhcnR1cCBpbml0XG4gICAgbXV0ZVN0YXRlSGFuZGxlcigpO1xuICAgIHZvbHVtZUxldmVsSGFuZGxlcigpO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIHZpZGVvIHZpZXcgYmV0d2VlbiBub3JtYWwvbW9ubyBhbmQgVlIvc3RlcmVvLlxuICovXG5leHBvcnQgY2xhc3MgVlJUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXZydG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdWUidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBpc1ZSQ29uZmlndXJlZCA9ICgpID0+IHtcbiAgICAgIC8vIFZSIGF2YWlsYWJpbGl0eSBjYW5ub3QgYmUgY2hlY2tlZCB0aHJvdWdoIGdldFZSU3RhdHVzKCkgYmVjYXVzZSBpdCBpcyBhc3luY2hyb25vdXNseSBwb3B1bGF0ZWQgYW5kIG5vdFxuICAgICAgLy8gYXZhaWxhYmxlIGF0IFVJIGluaXRpYWxpemF0aW9uLiBBcyBhbiBhbHRlcm5hdGl2ZSwgd2UgY2hlY2sgdGhlIFZSIHNldHRpbmdzIGluIHRoZSBjb25maWcuXG4gICAgICAvLyBUT0RPIHVzZSBnZXRWUlN0YXR1cygpIHRocm91Z2ggaXNWUlN0ZXJlb0F2YWlsYWJsZSgpIG9uY2UgdGhlIHBsYXllciBoYXMgYmVlbiByZXdyaXR0ZW4gYW5kIHRoZSBzdGF0dXMgaXNcbiAgICAgIC8vIGF2YWlsYWJsZSBpbiBPTl9SRUFEWVxuICAgICAgbGV0IGNvbmZpZyA9IHBsYXllci5nZXRDb25maWcoKTtcbiAgICAgIHJldHVybiBjb25maWcuc291cmNlICYmIGNvbmZpZy5zb3VyY2UudnIgJiYgY29uZmlnLnNvdXJjZS52ci5jb250ZW50VHlwZSAhPT0gJ25vbmUnO1xuICAgIH07XG5cbiAgICBsZXQgaXNWUlN0ZXJlb0F2YWlsYWJsZSA9ICgpID0+IHtcbiAgICAgIHJldHVybiBwbGF5ZXIuZ2V0VlJTdGF0dXMoKS5jb250ZW50VHlwZSAhPT0gJ25vbmUnO1xuICAgIH07XG5cbiAgICBsZXQgdnJTdGF0ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoaXNWUkNvbmZpZ3VyZWQoKSAmJiBpc1ZSU3RlcmVvQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgdGhpcy5zaG93KCk7IC8vIHNob3cgYnV0dG9uIGluIGNhc2UgaXQgaXMgaGlkZGVuXG5cbiAgICAgICAgaWYgKHBsYXllci5nZXRWUlN0YXR1cygpLmlzU3RlcmVvKSB7XG4gICAgICAgICAgdGhpcy5vbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2ZmKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpOyAvLyBoaWRlIGJ1dHRvbiBpZiBubyBzdGVyZW8gbW9kZSBhdmFpbGFibGVcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHZyQnV0dG9uVmlzaWJpbGl0eUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoaXNWUkNvbmZpZ3VyZWQoKSkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9WUl9NT0RFX0NIQU5HRUQsIHZyU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9WUl9TVEVSRU9fQ0hBTkdFRCwgdnJTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZSX0VSUk9SLCB2clN0YXRlSGFuZGxlcik7XG4gICAgLy8gSGlkZSBidXR0b24gd2hlbiBWUiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB2ckJ1dHRvblZpc2liaWxpdHlIYW5kbGVyKTtcbiAgICAvLyBTaG93IGJ1dHRvbiB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWQgYW5kIGl0J3MgVlJcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgdnJCdXR0b25WaXNpYmlsaXR5SGFuZGxlcik7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICghaXNWUlN0ZXJlb0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vIFZSIGNvbnRlbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHBsYXllci5nZXRWUlN0YXR1cygpLmlzU3RlcmVvKSB7XG4gICAgICAgICAgcGxheWVyLnNldFZSU3RlcmVvKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5ZXIuc2V0VlJTdGVyZW8odHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNldCBzdGFydHVwIHZpc2liaWxpdHlcbiAgICB2ckJ1dHRvblZpc2liaWxpdHlIYW5kbGVyKCk7XG4gIH1cbn0iLCJpbXBvcnQge0NsaWNrT3ZlcmxheSwgQ2xpY2tPdmVybGF5Q29uZmlnfSBmcm9tICcuL2NsaWNrb3ZlcmxheSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIENsaWNrT3ZlcmxheX0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2F0ZXJtYXJrQ29uZmlnIGV4dGVuZHMgQ2xpY2tPdmVybGF5Q29uZmlnIHtcbiAgLy8gbm90aGluZyB5ZXRcbn1cblxuLyoqXG4gKiBBIHdhdGVybWFyayBvdmVybGF5IHdpdGggYSBjbGlja2FibGUgbG9nby5cbiAqL1xuZXhwb3J0IGNsYXNzIFdhdGVybWFyayBleHRlbmRzIENsaWNrT3ZlcmxheSB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBXYXRlcm1hcmtDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXdhdGVybWFyaycsXG4gICAgICB1cmw6ICdodHRwOi8vYml0bW92aW4uY29tJ1xuICAgIH0sIDxXYXRlcm1hcmtDb25maWc+dGhpcy5jb25maWcpO1xuICB9XG59IiwiZXhwb3J0IGludGVyZmFjZSBPZmZzZXQge1xuICBsZWZ0OiBudW1iZXI7XG4gIHRvcDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFNpbXBsZSBET00gbWFuaXB1bGF0aW9uIGFuZCBET00gZWxlbWVudCBldmVudCBoYW5kbGluZyBtb2RlbGVkIGFmdGVyIGpRdWVyeSAoYXMgcmVwbGFjZW1lbnQgZm9yIGpRdWVyeSkuXG4gKlxuICogTGlrZSBqUXVlcnksIERPTSBvcGVyYXRlcyBvbiBzaW5nbGUgZWxlbWVudHMgYW5kIGxpc3RzIG9mIGVsZW1lbnRzLiBGb3IgZXhhbXBsZTogY3JlYXRpbmcgYW4gZWxlbWVudCByZXR1cm5zIGEgRE9NXG4gKiBpbnN0YW5jZSB3aXRoIGEgc2luZ2xlIGVsZW1lbnQsIHNlbGVjdGluZyBlbGVtZW50cyByZXR1cm5zIGEgRE9NIGluc3RhbmNlIHdpdGggemVybywgb25lLCBvciBtYW55IGVsZW1lbnRzLiBTaW1pbGFyXG4gKiB0byBqUXVlcnksIHNldHRlcnMgdXN1YWxseSBhZmZlY3QgYWxsIGVsZW1lbnRzLCB3aGlsZSBnZXR0ZXJzIG9wZXJhdGUgb24gb25seSB0aGUgZmlyc3QgZWxlbWVudC5cbiAqIEFsc28gc2ltaWxhciB0byBqUXVlcnksIG1vc3QgbWV0aG9kcyAoZXhjZXB0IGdldHRlcnMpIHJldHVybiB0aGUgRE9NIGluc3RhbmNlIGZhY2lsaXRhdGluZyBlYXN5IGNoYWluaW5nIG9mIG1ldGhvZFxuICogY2FsbHMuXG4gKlxuICogQnVpbHQgd2l0aCB0aGUgaGVscCBvZjogaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vXG4gKi9cbmV4cG9ydCBjbGFzcyBET00ge1xuXG4gIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBlbGVtZW50cyB0aGF0IHRoZSBpbnN0YW5jZSB3cmFwcy4gVGFrZSBjYXJlIHRoYXQgbm90IGFsbCBtZXRob2RzIGNhbiBvcGVyYXRlIG9uIHRoZSB3aG9sZSBsaXN0LFxuICAgKiBnZXR0ZXJzIHVzdWFsbHkganVzdCB3b3JrIG9uIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBlbGVtZW50czogSFRNTEVsZW1lbnRbXTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50LlxuICAgKiBAcGFyYW0gdGFnTmFtZSB0aGUgdGFnIG5hbWUgb2YgdGhlIERPTSBlbGVtZW50XG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVzIGEgbGlzdCBvZiBhdHRyaWJ1dGVzIG9mIHRoZSBlbGVtZW50XG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0YWdOYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSk7XG4gIC8qKlxuICAgKiBTZWxlY3RzIGFsbCBlbGVtZW50cyBmcm9tIHRoZSBET00gdGhhdCBtYXRjaCB0aGUgc3BlY2lmaWVkIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgdGhlIHNlbGVjdG9yIHRvIG1hdGNoIERPTSBlbGVtZW50cyB3aXRoXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvcjogc3RyaW5nKTtcbiAgLyoqXG4gICAqIFdyYXBzIGEgcGxhaW4gSFRNTEVsZW1lbnQgd2l0aCBhIERPTSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIEhUTUxFbGVtZW50IHRvIHdyYXAgd2l0aCBET01cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTtcbiAgLyoqXG4gICAqIFdyYXBzIGEgbGlzdCBvZiBwbGFpbiBIVE1MRWxlbWVudHMgd2l0aCBhIERPTSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIEhUTUxFbGVtZW50cyB0byB3cmFwIHdpdGggRE9NXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50czogSFRNTEVsZW1lbnRbXSk7XG4gIC8qKlxuICAgKiBXcmFwcyB0aGUgZG9jdW1lbnQgd2l0aCBhIERPTSBpbnN0YW5jZS4gVXNlZnVsIHRvIGF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIGRvY3VtZW50LlxuICAgKiBAcGFyYW0gZG9jdW1lbnQgdGhlIGRvY3VtZW50IHRvIHdyYXBcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRvY3VtZW50OiBEb2N1bWVudCk7XG4gIGNvbnN0cnVjdG9yKHNvbWV0aGluZzogc3RyaW5nIHwgSFRNTEVsZW1lbnQgfCBIVE1MRWxlbWVudFtdIHwgRG9jdW1lbnQsIGF0dHJpYnV0ZXM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30pIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7IC8vIFNldCB0aGUgZ2xvYmFsIGRvY3VtZW50IHRvIHRoZSBsb2NhbCBkb2N1bWVudCBmaWVsZFxuXG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBpZiAoc29tZXRoaW5nLmxlbmd0aCA+IDAgJiYgc29tZXRoaW5nWzBdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGVsZW1lbnRzID0gc29tZXRoaW5nO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHM7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBsZXQgZWxlbWVudCA9IHNvbWV0aGluZztcbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbZWxlbWVudF07XG4gICAgfVxuICAgIGVsc2UgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIERvY3VtZW50KSB7XG4gICAgICAvLyBXaGVuIGEgZG9jdW1lbnQgaXMgcGFzc2VkIGluLCB3ZSBkbyBub3QgZG8gYW55dGhpbmcgd2l0aCBpdCwgYnV0IGJ5IHNldHRpbmcgdGhpcy5lbGVtZW50cyB0byBudWxsXG4gICAgICAvLyB3ZSBnaXZlIHRoZSBldmVudCBoYW5kbGluZyBtZXRob2QgYSBtZWFucyB0byBkZXRlY3QgaWYgdGhlIGV2ZW50cyBzaG91bGQgYmUgcmVnaXN0ZXJlZCBvbiB0aGUgZG9jdW1lbnRcbiAgICAgIC8vIGluc3RlYWQgb2YgZWxlbWVudHMuXG4gICAgICB0aGlzLmVsZW1lbnRzID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSBpZiAoYXR0cmlidXRlcykge1xuICAgICAgbGV0IHRhZ05hbWUgPSBzb21ldGhpbmc7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBsZXQgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbZWxlbWVudF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHNlbGVjdG9yID0gc29tZXRoaW5nO1xuICAgICAgdGhpcy5lbGVtZW50cyA9IHRoaXMuZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdGhhdCB0aGlzIERPTSBpbnN0YW5jZSBjdXJyZW50bHkgaG9sZHMuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHNcbiAgICovXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50cyA/IHRoaXMuZWxlbWVudHMubGVuZ3RoIDogMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBIVE1MIGVsZW1lbnRzIHRoYXQgdGhpcyBET00gaW5zdGFuY2UgY3VycmVudGx5IGhvbGRzLlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX0gdGhlIHJhdyBIVE1MIGVsZW1lbnRzXG4gICAqL1xuICBnZXRFbGVtZW50cygpOiBIVE1MRWxlbWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IG1ldGhvZCBmb3IgaXRlcmF0aW5nIGFsbCBlbGVtZW50cy4gU2hvcnRzIHRoaXMuZWxlbWVudHMuZm9yRWFjaCguLi4pIHRvIHRoaXMuZm9yRWFjaCguLi4pLlxuICAgKiBAcGFyYW0gaGFuZGxlciB0aGUgaGFuZGxlciB0byBleGVjdXRlIGFuIG9wZXJhdGlvbiBvbiBhbiBlbGVtZW50XG4gICAqL1xuICBwcml2YXRlIGZvckVhY2goaGFuZGxlcjogKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBoYW5kbGVyKGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQ2hpbGRFbGVtZW50c09mRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IERvY3VtZW50LCBzZWxlY3Rvcjogc3RyaW5nKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgbGV0IGNoaWxkRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgLy8gQ29udmVydCBOb2RlTGlzdCB0byBBcnJheVxuICAgIC8vIGh0dHBzOi8vdG9kZG1vdHRvLmNvbS9hLWNvbXByZWhlbnNpdmUtZGl2ZS1pbnRvLW5vZGVsaXN0cy1hcnJheXMtY29udmVydGluZy1ub2RlbGlzdHMtYW5kLXVuZGVyc3RhbmRpbmctdGhlLWRvbS9cbiAgICByZXR1cm4gW10uc2xpY2UuY2FsbChjaGlsZEVsZW1lbnRzKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3I6IHN0cmluZyk6IEhUTUxFbGVtZW50W10ge1xuICAgIGxldCBhbGxDaGlsZEVsZW1lbnRzID0gPEhUTUxFbGVtZW50W10+W107XG5cbiAgICBpZiAodGhpcy5lbGVtZW50cykge1xuICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGFsbENoaWxkRWxlbWVudHMgPSBhbGxDaGlsZEVsZW1lbnRzLmNvbmNhdCh0aGlzLmZpbmRDaGlsZEVsZW1lbnRzT2ZFbGVtZW50KGVsZW1lbnQsIHNlbGVjdG9yKSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kQ2hpbGRFbGVtZW50c09mRWxlbWVudChkb2N1bWVudCwgc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBhbGxDaGlsZEVsZW1lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFsbCBjaGlsZCBlbGVtZW50cyBvZiBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIHN1cHBsaWVkIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgdGhlIHNlbGVjdG9yIHRvIG1hdGNoIHdpdGggY2hpbGQgZWxlbWVudHNcbiAgICogQHJldHVybnMge0RPTX0gYSBuZXcgRE9NIGluc3RhbmNlIHJlcHJlc2VudGluZyBhbGwgbWF0Y2hlZCBjaGlsZHJlblxuICAgKi9cbiAgZmluZChzZWxlY3Rvcjogc3RyaW5nKTogRE9NIHtcbiAgICBsZXQgYWxsQ2hpbGRFbGVtZW50cyA9IHRoaXMuZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIHJldHVybiBuZXcgRE9NKGFsbENoaWxkRWxlbWVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgb2YgdGhlIGlubmVyIEhUTUwgY29udGVudCBvZiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICovXG4gIGh0bWwoKTogc3RyaW5nO1xuICAvKipcbiAgICogU2V0cyB0aGUgaW5uZXIgSFRNTCBjb250ZW50IG9mIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGNvbnRlbnQgYSBzdHJpbmcgb2YgcGxhaW4gdGV4dCBvciBIVE1MIG1hcmt1cFxuICAgKi9cbiAgaHRtbChjb250ZW50OiBzdHJpbmcpOiBET007XG4gIGh0bWwoY29udGVudD86IHN0cmluZyk6IHN0cmluZyB8IERPTSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRIdG1sKGNvbnRlbnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEh0bWwoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEh0bWwoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHNbMF0uaW5uZXJIVE1MO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRIdG1sKGNvbnRlbnQ6IHN0cmluZyk6IERPTSB7XG4gICAgaWYgKGNvbnRlbnQgPT09IHVuZGVmaW5lZCB8fCBjb250ZW50ID09IG51bGwpIHtcbiAgICAgIC8vIFNldCB0byBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgaW5uZXJIVE1MIGdldHRpbmcgc2V0IHRvICd1bmRlZmluZWQnIChhbGwgYnJvd3NlcnMpIG9yICdudWxsJyAoSUU5KVxuICAgICAgY29udGVudCA9ICcnO1xuICAgIH1cblxuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBpbm5lciBIVE1MIG9mIGFsbCBlbGVtZW50cyAoZGVsZXRlcyBhbGwgY2hpbGRyZW4pLlxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgZW1wdHkoKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZmlyc3QgZm9ybSBlbGVtZW50LCBlLmcuIHRoZSBzZWxlY3RlZCB2YWx1ZSBvZiBhIHNlbGVjdCBib3ggb3IgdGhlIHRleHQgaWYgYW5cbiAgICogaW5wdXQgZmllbGQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSB2YWx1ZSBvZiBhIGZvcm0gZWxlbWVudFxuICAgKi9cbiAgdmFsKCk6IHN0cmluZyB7XG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzWzBdO1xuXG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCB8fCBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gVE9ETyBhZGQgc3VwcG9ydCBmb3IgbWlzc2luZyBmb3JtIGVsZW1lbnRzXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZhbCgpIG5vdCBzdXBwb3J0ZWQgZm9yICR7dHlwZW9mIGVsZW1lbnR9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZSBvbiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZVxuICAgKi9cbiAgYXR0cihhdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG4gIC8qKlxuICAgKiBTZXRzIGFuIGF0dHJpYnV0ZSBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGUgdGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGVcbiAgICovXG4gIGF0dHIoYXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBET007XG4gIGF0dHIoYXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IERPTSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRBdHRyKGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoYXR0cmlidXRlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEF0dHIoYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0QXR0cihhdHRyaWJ1dGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIGRhdGEgZWxlbWVudCBvbiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICogQHBhcmFtIGRhdGFBdHRyaWJ1dGUgdGhlIG5hbWUgb2YgdGhlIGRhdGEgYXR0cmlidXRlIHdpdGhvdXQgdGhlICdkYXRhLScgcHJlZml4XG4gICAqL1xuICBkYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG4gIC8qKlxuICAgKiBTZXRzIGEgZGF0YSBhdHRyaWJ1dGUgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gZGF0YUF0dHJpYnV0ZSB0aGUgbmFtZSBvZiB0aGUgZGF0YSBhdHRyaWJ1dGUgd2l0aG91dCB0aGUgJ2RhdGEtJyBwcmVmaXhcbiAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSBvZiB0aGUgZGF0YSBhdHRyaWJ1dGVcbiAgICovXG4gIGRhdGEoZGF0YUF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NO1xuICBkYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZywgdmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHwgRE9NIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldERhdGEoZGF0YUF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERhdGEoZGF0YUF0dHJpYnV0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgZGF0YUF0dHJpYnV0ZSk7XG4gIH1cblxuICBwcml2YXRlIHNldERhdGEoZGF0YUF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBkYXRhQXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBvbmUgb3IgbW9yZSBET00gZWxlbWVudHMgYXMgY2hpbGRyZW4gdG8gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gY2hpbGRFbGVtZW50cyB0aGUgY2hyaWxkIGVsZW1lbnRzIHRvIGFwcGVuZFxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgYXBwZW5kKC4uLmNoaWxkRWxlbWVudHM6IERPTVtdKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNoaWxkRWxlbWVudHMuZm9yRWFjaCgoY2hpbGRFbGVtZW50KSA9PiB7XG4gICAgICAgIGNoaWxkRWxlbWVudC5lbGVtZW50cy5mb3JFYWNoKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LmVsZW1lbnRzW2luZGV4XSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgZWxlbWVudHMgZnJvbSB0aGUgRE9NLlxuICAgKi9cbiAgcmVtb3ZlKCk6IHZvaWQge1xuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgbGV0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgZmlyc3QgZWxlbWVudCBmcm9tIHRoZSBkb2N1bWVudCdzIHRvcCBsZWZ0IGNvcm5lci5cbiAgICogQHJldHVybnMge09mZnNldH1cbiAgICovXG4gIG9mZnNldCgpOiBPZmZzZXQge1xuICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1swXTtcbiAgICBsZXQgZWxlbWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCBodG1sUmVjdCA9IGRvY3VtZW50LmJvZHkucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIC8vIFZpcnR1YWwgdmlld3BvcnQgc2Nyb2xsIGhhbmRsaW5nIChlLmcuIHBpbmNoIHpvb21lZCB2aWV3cG9ydHMgaW4gbW9iaWxlIGJyb3dzZXJzIG9yIGRlc2t0b3AgQ2hyb21lL0VkZ2UpXG4gICAgLy8gJ25vcm1hbCcgem9vbXMgYW5kIHZpcnR1YWwgdmlld3BvcnQgem9vbXMgKGFrYSBsYXlvdXQgdmlld3BvcnQpIHJlc3VsdCBpbiBkaWZmZXJlbnRcbiAgICAvLyBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHJlc3VsdHM6XG4gICAgLy8gIC0gd2l0aCBub3JtYWwgc2Nyb2xscywgdGhlIGNsaWVudFJlY3QgZGVjcmVhc2VzIHdpdGggYW4gaW5jcmVhc2UgaW4gc2Nyb2xsKFRvcHxMZWZ0KS9wYWdlKFh8WSlPZmZzZXRcbiAgICAvLyAgLSB3aXRoIHBpbmNoIHpvb20gc2Nyb2xscywgdGhlIGNsaWVudFJlY3Qgc3RheXMgdGhlIHNhbWUgd2hpbGUgc2Nyb2xsL3BhZ2VPZmZzZXQgY2hhbmdlc1xuICAgIC8vIFRoaXMgbWVhbnMsIHRoYXQgdGhlIGNvbWJpbmF0aW9uIG9mIGNsaWVudFJlY3QgKyBzY3JvbGwvcGFnZU9mZnNldCBkb2VzIG5vdCB3b3JrIHRvIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0XG4gICAgLy8gZnJvbSB0aGUgZG9jdW1lbnQncyB1cHBlciBsZWZ0IG9yaWdpbiB3aGVuIHBpbmNoIHpvb20gaXMgdXNlZC5cbiAgICAvLyBUbyB3b3JrIGFyb3VuZCB0aGlzIGlzc3VlLCB3ZSBkbyBub3QgdXNlIHNjcm9sbC9wYWdlT2Zmc2V0IGJ1dCBnZXQgdGhlIGNsaWVudFJlY3Qgb2YgdGhlIGh0bWwgZWxlbWVudCBhbmRcbiAgICAvLyBzdWJ0cmFjdCBpdCBmcm9tIHRoZSBlbGVtZW50J3MgcmVjdCwgd2hpY2ggYWx3YXlzIHJlc3VsdHMgaW4gdGhlIG9mZnNldCBmcm9tIHRoZSBkb2N1bWVudCBvcmlnaW4uXG4gICAgLy8gTk9URTogdGhlIGN1cnJlbnQgd2F5IG9mIG9mZnNldCBjYWxjdWxhdGlvbiB3YXMgaW1wbGVtZW50ZWQgc3BlY2lmaWNhbGx5IHRvIHRyYWNrIGV2ZW50IHBvc2l0aW9ucyBvbiB0aGVcbiAgICAvLyBzZWVrIGJhciwgYW5kIGl0IG1pZ2h0IGJyZWFrIGNvbXBhdGliaWxpdHkgd2l0aCBqUXVlcnkncyBvZmZzZXQoKSBtZXRob2QuIElmIHRoaXMgZXZlciB0dXJucyBvdXQgdG8gYmUgYVxuICAgIC8vIHByb2JsZW0sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSByZXZlcnRlZCB0byB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBvZmZzZXQgY2FsY3VsYXRpb24gbW92ZWQgdG8gdGhlIHNlZWsgYmFyLlxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogZWxlbWVudFJlY3QudG9wIC0gaHRtbFJlY3QudG9wLFxuICAgICAgbGVmdDogZWxlbWVudFJlY3QubGVmdCAtIGh0bWxSZWN0LmxlZnRcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgd2lkdGggb2YgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICovXG4gIHdpZHRoKCk6IG51bWJlciB7XG4gICAgLy8gVE9ETyBjaGVjayBpZiB0aGlzIGlzIHRoZSBzYW1lIGFzIGpRdWVyeSdzIHdpZHRoKCkgKHByb2JhYmx5IG5vdClcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5vZmZzZXRXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBoZWlnaHQgb2YgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICovXG4gIGhlaWdodCgpOiBudW1iZXIge1xuICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhpcyBpcyB0aGUgc2FtZSBhcyBqUXVlcnkncyBoZWlnaHQoKSAocHJvYmFibHkgbm90KVxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzWzBdLm9mZnNldEhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhbiBldmVudCBoYW5kbGVyIHRvIG9uZSBvciBtb3JlIGV2ZW50cyBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBldmVudE5hbWUgdGhlIGV2ZW50IG5hbWUgKG9yIG11bHRpcGxlIG5hbWVzIHNlcGFyYXRlZCBieSBzcGFjZSkgdG8gbGlzdGVuIHRvXG4gICAqIEBwYXJhbSBldmVudEhhbmRsZXIgdGhlIGV2ZW50IGhhbmRsZXIgdG8gY2FsbCB3aGVuIHRoZSBldmVudCBmaXJlc1xuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgb24oZXZlbnROYW1lOiBzdHJpbmcsIGV2ZW50SGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCk6IERPTSB7XG4gICAgbGV0IGV2ZW50cyA9IGV2ZW50TmFtZS5zcGxpdCgnICcpO1xuXG4gICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5lbGVtZW50cyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZXZlbnRIYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBldmVudCBoYW5kbGVyIGZyb20gb25lIG9yIG1vcmUgZXZlbnRzIG9uIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGV2ZW50TmFtZSB0aGUgZXZlbnQgbmFtZSAob3IgbXVsdGlwbGUgbmFtZXMgc2VwYXJhdGVkIGJ5IHNwYWNlKSB0byByZW1vdmUgdGhlIGhhbmRsZXIgZnJvbVxuICAgKiBAcGFyYW0gZXZlbnRIYW5kbGVyIHRoZSBldmVudCBoYW5kbGVyIHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgb2ZmKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3QpOiBET00ge1xuICAgIGxldCBldmVudHMgPSBldmVudE5hbWUuc3BsaXQoJyAnKTtcblxuICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudEhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIHNwZWNpZmllZCBjbGFzcyhlcykgdG8gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lIHRoZSBjbGFzcyhlcykgdG8gYWRkLCBtdWx0aXBsZSBjbGFzc2VzIHNlcGFyYXRlZCBieSBzcGFjZVxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgYWRkQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpOiBET00ge1xuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZWQgdGhlIHNwZWNpZmllZCBjbGFzcyhlcykgZnJvbSBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgdGhlIGNsYXNzKGVzKSB0byByZW1vdmUsIG11bHRpcGxlIGNsYXNzZXMgc2VwYXJhdGVkIGJ5IHNwYWNlXG4gICAqIEByZXR1cm5zIHtET019XG4gICAqL1xuICByZW1vdmVDbGFzcyhjbGFzc05hbWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKFxuICAgICAgICAgIG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYW55IG9mIHRoZSBlbGVtZW50cyBoYXMgdGhlIHNwZWNpZmllZCBjbGFzcy5cbiAgICogQHBhcmFtIGNsYXNzTmFtZSB0aGUgY2xhc3MgbmFtZSB0byBjaGVja1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBvbmUgb2YgdGhlIGVsZW1lbnRzIGhhcyB0aGUgY2xhc3MgYXR0YWNoZWQsIGVsc2UgaWYgbm8gZWxlbWVudCBoYXMgaXQgYXR0YWNoZWRcbiAgICovXG4gIGhhc0NsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgbGV0IGhhc0NsYXNzID0gZmFsc2U7XG5cbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgICAgICAgIC8vIFNpbmNlIHdlIGFyZSBpbnNpZGUgYSBoYW5kbGVyLCB3ZSBjYW4ndCBqdXN0ICdyZXR1cm4gdHJ1ZScuIEluc3RlYWQsIHdlIHNhdmUgaXQgdG8gYSB2YXJpYWJsZVxuICAgICAgICAgIC8vIGFuZCByZXR1cm4gaXQgYXQgdGhlIGVuZCBvZiB0aGUgZnVuY3Rpb24gYm9keS5cbiAgICAgICAgICBoYXNDbGFzcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cCgnKF58ICknICsgY2xhc3NOYW1lICsgJyggfCQpJywgJ2dpJykudGVzdChlbGVtZW50LmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAvLyBTZWUgY29tbWVudCBhYm92ZVxuICAgICAgICAgIGhhc0NsYXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhhc0NsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGEgQ1NTIHByb3BlcnR5IG9mIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIHRoZSBuYW1lIG9mIHRoZSBDU1MgcHJvcGVydHkgdG8gcmV0cmlldmUgdGhlIHZhbHVlIG9mXG4gICAqL1xuICBjc3MocHJvcGVydHlOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsO1xuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBDU1MgcHJvcGVydHkgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIHRoZSBuYW1lIG9mIHRoZSBDU1MgcHJvcGVydHkgdG8gc2V0IHRoZSB2YWx1ZSBmb3JcbiAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byBzZXQgZm9yIHRoZSBnaXZlbiBDU1MgcHJvcGVydHlcbiAgICovXG4gIGNzcyhwcm9wZXJ0eU5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTTtcbiAgLyoqXG4gICAqIFNldHMgYSBjb2xsZWN0aW9uIG9mIENTUyBwcm9wZXJ0aWVzIGFuZCB0aGVpciB2YWx1ZXMgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gcHJvcGVydHlWYWx1ZUNvbGxlY3Rpb24gYW4gb2JqZWN0IGNvbnRhaW5pbmcgcGFpcnMgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHRoZWlyIHZhbHVlc1xuICAgKi9cbiAgY3NzKHByb3BlcnR5VmFsdWVDb2xsZWN0aW9uOiB7W3Byb3BlcnR5TmFtZTogc3RyaW5nXTogc3RyaW5nfSk6IERPTTtcbiAgY3NzKHByb3BlcnR5TmFtZU9yQ29sbGVjdGlvbjogc3RyaW5nIHwge1twcm9wZXJ0eU5hbWU6IHN0cmluZ106IHN0cmluZ30sIHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IERPTSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWVPckNvbGxlY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lT3JDb2xsZWN0aW9uO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDc3MocHJvcGVydHlOYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3NzKHByb3BlcnR5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHByb3BlcnR5VmFsdWVDb2xsZWN0aW9uID0gcHJvcGVydHlOYW1lT3JDb2xsZWN0aW9uO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0Q3NzQ29sbGVjdGlvbihwcm9wZXJ0eVZhbHVlQ29sbGVjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRDc3MocHJvcGVydHlOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnRzWzBdKVs8YW55PnByb3BlcnR5TmFtZV07XG4gIH1cblxuICBwcml2YXRlIHNldENzcyhwcm9wZXJ0eU5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyA8YW55PiBjYXN0IHRvIHJlc29sdmUgVFM3MDE1OiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNjYyNzExNC8zNzAyNTJcbiAgICAgIGVsZW1lbnQuc3R5bGVbPGFueT5wcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIHNldENzc0NvbGxlY3Rpb24ocnVsZVZhbHVlQ29sbGVjdGlvbjoge1tydWxlTmFtZTogc3RyaW5nXTogc3RyaW5nfSk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDQ5MDU3My8zNzAyNTJcbiAgICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwgcnVsZVZhbHVlQ29sbGVjdGlvbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiaW1wb3J0IHtBcnJheVV0aWxzfSBmcm9tICcuL3V0aWxzJztcbi8qKlxuICogRnVuY3Rpb24gaW50ZXJmYWNlIGZvciBldmVudCBsaXN0ZW5lcnMgb24gdGhlIHtAbGluayBFdmVudERpc3BhdGNoZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiB7XG4gIChzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncyk6IHZvaWQ7XG59XG5cbi8qKlxuICogRW1wdHkgdHlwZSBmb3IgY3JlYXRpbmcge0BsaW5rIEV2ZW50RGlzcGF0Y2hlciBldmVudCBkaXNwYXRjaGVyc30gdGhhdCBkbyBub3QgY2FycnkgYW55IGFyZ3VtZW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb0FyZ3Mge1xufVxuXG4vKipcbiAqIEV2ZW50IGFyZ3MgZm9yIGFuIGV2ZW50IHRoYXQgY2FuIGJlIGNhbmNlbGVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhbmNlbEV2ZW50QXJncyBleHRlbmRzIE5vQXJncyB7XG4gIC8qKlxuICAgKiBHZXRzIG9yIHNldHMgYSBmbGFnIHdoZXRoZXIgdGhlIGV2ZW50IHNob3VsZCBiZSBjYW5jZWxlZC5cbiAgICovXG4gIGNhbmNlbD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUHVibGljIGludGVyZmFjZSB0aGF0IHJlcHJlc2VudHMgYW4gZXZlbnQuIENhbiBiZSB1c2VkIHRvIHN1YnNjcmliZSB0byBhbmQgdW5zdWJzY3JpYmUgZnJvbSBldmVudHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnQ8U2VuZGVyLCBBcmdzPiB7XG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoaXMgZXZlbnQgZGlzcGF0Y2hlci5cbiAgICogQHBhcmFtIGxpc3RlbmVyIHRoZSBsaXN0ZW5lciB0byBhZGRcbiAgICovXG4gIHN1YnNjcmliZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KTogdm9pZDtcblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGlzIGV2ZW50IGRpc3BhdGNoZXIgdGhhdCBpcyBvbmx5IGNhbGxlZCBvbmNlLlxuICAgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGFkZFxuICAgKi9cbiAgc3Vic2NyaWJlT25jZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KTogdm9pZDtcblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGlzIGV2ZW50IGRpc3BhdGNoZXIgdGhhdCB3aWxsIGJlIGNhbGxlZCBhdCBhIGxpbWl0ZWQgcmF0ZSB3aXRoIGEgbWluaW11bVxuICAgKiBpbnRlcnZhbCBvZiB0aGUgc3BlY2lmaWVkIG1pbGxpc2Vjb25kcy5cbiAgICogQHBhcmFtIGxpc3RlbmVyIHRoZSBsaXN0ZW5lciB0byBhZGRcbiAgICogQHBhcmFtIHJhdGVNcyB0aGUgcmF0ZSBpbiBtaWxsaXNlY29uZHMgdG8gd2hpY2ggY2FsbGluZyBvZiB0aGUgbGlzdGVuZXJzIHNob3VsZCBiZSBsaW1pdGVkXG4gICAqL1xuICBzdWJzY3JpYmVSYXRlTGltaXRlZChsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+LCByYXRlTXM6IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlcyBhIHN1YnNjcmliZWQgZXZlbnQgbGlzdGVuZXIgZnJvbSB0aGlzIGRpc3BhdGNoZXIuXG4gICAqIEBwYXJhbSBsaXN0ZW5lciB0aGUgbGlzdGVuZXIgdG8gcmVtb3ZlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBsaXN0ZW5lciB3YXMgc3VjY2Vzc2Z1bGx5IHVuc3Vic2NyaWJlZCwgZmFsc2UgaWYgaXQgaXNuJ3Qgc3Vic2NyaWJlZCBvbiB0aGlzXG4gICAqICAgZGlzcGF0Y2hlclxuICAgKi9cbiAgdW5zdWJzY3JpYmUobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPik6IGJvb2xlYW47XG59XG5cbi8qKlxuICogRXZlbnQgZGlzcGF0Y2hlciB0byBzdWJzY3JpYmUgYW5kIHRyaWdnZXIgZXZlbnRzLiBFYWNoIGV2ZW50IHNob3VsZCBoYXZlIGl0cyBvd24gZGlzcGF0Y2hlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxTZW5kZXIsIEFyZ3M+IGltcGxlbWVudHMgRXZlbnQ8U2VuZGVyLCBBcmdzPiB7XG5cbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IEV2ZW50TGlzdGVuZXJXcmFwcGVyPFNlbmRlciwgQXJncz5bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvY31cbiAgICovXG4gIHN1YnNjcmliZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KSB7XG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChuZXcgRXZlbnRMaXN0ZW5lcldyYXBwZXIobGlzdGVuZXIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2N9XG4gICAqL1xuICBzdWJzY3JpYmVPbmNlKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4pIHtcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKG5ldyBFdmVudExpc3RlbmVyV3JhcHBlcihsaXN0ZW5lciwgdHJ1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvY31cbiAgICovXG4gIHN1YnNjcmliZVJhdGVMaW1pdGVkKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4sIHJhdGVNczogbnVtYmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChuZXcgUmF0ZUxpbWl0ZWRFdmVudExpc3RlbmVyV3JhcHBlcihsaXN0ZW5lciwgcmF0ZU1zKSk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jfVxuICAgKi9cbiAgdW5zdWJzY3JpYmUobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPik6IGJvb2xlYW4ge1xuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBsaXN0ZW5lcnMsIGNvbXBhcmUgd2l0aCBwYXJhbWV0ZXIsIGFuZCByZW1vdmUgaWYgZm91bmRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgc3Vic2NyaWJlZExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcnNbaV07XG4gICAgICBpZiAoc3Vic2NyaWJlZExpc3RlbmVyLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmxpc3RlbmVycywgc3Vic2NyaWJlZExpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIHRoaXMgZGlzcGF0Y2hlci5cbiAgICovXG4gIHVuc3Vic2NyaWJlQWxsKCk6IHZvaWQge1xuICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhbiBldmVudCB0byBhbGwgc3Vic2NyaWJlZCBsaXN0ZW5lcnMuXG4gICAqIEBwYXJhbSBzZW5kZXIgdGhlIHNvdXJjZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIGFyZ3MgdGhlIGFyZ3VtZW50cyBmb3IgdGhlIGV2ZW50XG4gICAqL1xuICBkaXNwYXRjaChzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncyA9IG51bGwpIHtcbiAgICBsZXQgbGlzdGVuZXJzVG9SZW1vdmUgPSBbXTtcblxuICAgIC8vIENhbGwgZXZlcnkgbGlzdGVuZXJcbiAgICBmb3IgKGxldCBsaXN0ZW5lciBvZiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIuZmlyZShzZW5kZXIsIGFyZ3MpO1xuXG4gICAgICBpZiAobGlzdGVuZXIuaXNPbmNlKCkpIHtcbiAgICAgICAgbGlzdGVuZXJzVG9SZW1vdmUucHVzaChsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVyXG4gICAgZm9yIChsZXQgbGlzdGVuZXJUb1JlbW92ZSBvZiBsaXN0ZW5lcnNUb1JlbW92ZSkge1xuICAgICAgQXJyYXlVdGlscy5yZW1vdmUodGhpcy5saXN0ZW5lcnMsIGxpc3RlbmVyVG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBldmVudCB0aGF0IHRoaXMgZGlzcGF0Y2hlciBtYW5hZ2VzIGFuZCBvbiB3aGljaCBsaXN0ZW5lcnMgY2FuIHN1YnNjcmliZSBhbmQgdW5zdWJzY3JpYmUgZXZlbnQgaGFuZGxlcnMuXG4gICAqIEByZXR1cm5zIHtFdmVudH1cbiAgICovXG4gIGdldEV2ZW50KCk6IEV2ZW50PFNlbmRlciwgQXJncz4ge1xuICAgIC8vIEZvciBub3csIGp1c3QgY2FzdCB0aGUgZXZlbnQgZGlzcGF0Y2hlciB0byB0aGUgZXZlbnQgaW50ZXJmYWNlLiBBdCBzb21lIHBvaW50IGluIHRoZSBmdXR1cmUgd2hlbiB0aGVcbiAgICAvLyBjb2RlYmFzZSBncm93cywgaXQgbWlnaHQgbWFrZSBzZW5zZSB0byBzcGxpdCB0aGUgZGlzcGF0Y2hlciBpbnRvIHNlcGFyYXRlIGRpc3BhdGNoZXIgYW5kIGV2ZW50IGNsYXNzZXMuXG4gICAgcmV0dXJuIDxFdmVudDxTZW5kZXIsIEFyZ3M+PnRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGJhc2ljIGV2ZW50IGxpc3RlbmVyIHdyYXBwZXIgdG8gbWFuYWdlIGxpc3RlbmVycyB3aXRoaW4gdGhlIHtAbGluayBFdmVudERpc3BhdGNoZXJ9LiBUaGlzIGlzIGEgJ3ByaXZhdGUnIGNsYXNzXG4gKiBmb3IgaW50ZXJuYWwgZGlzcGF0Y2hlciB1c2UgYW5kIGl0IGlzIHRoZXJlZm9yZSBub3QgZXhwb3J0ZWQuXG4gKi9cbmNsYXNzIEV2ZW50TGlzdGVuZXJXcmFwcGVyPFNlbmRlciwgQXJncz4ge1xuXG4gIHByaXZhdGUgZXZlbnRMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+O1xuICBwcml2YXRlIG9uY2U6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiwgb25jZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5ldmVudExpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgdGhpcy5vbmNlID0gb25jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3cmFwcGVkIGV2ZW50IGxpc3RlbmVyLlxuICAgKiBAcmV0dXJucyB7RXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+fVxuICAgKi9cbiAgZ2V0IGxpc3RlbmVyKCk6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRMaXN0ZW5lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB0aGUgd3JhcHBlZCBldmVudCBsaXN0ZW5lciB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMuXG4gICAqIEBwYXJhbSBzZW5kZXJcbiAgICogQHBhcmFtIGFyZ3NcbiAgICovXG4gIGZpcmUoc2VuZGVyOiBTZW5kZXIsIGFyZ3M6IEFyZ3MpIHtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXIoc2VuZGVyLCBhcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhpcyBsaXN0ZW5lciBpcyBzY2hlZHVsZWQgdG8gYmUgY2FsbGVkIG9ubHkgb25jZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IG9uY2UgaWYgdHJ1ZVxuICAgKi9cbiAgaXNPbmNlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9uY2U7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRlbmRzIHRoZSBiYXNpYyB7QGxpbmsgRXZlbnRMaXN0ZW5lcldyYXBwZXJ9IHdpdGggcmF0ZS1saW1pdGluZyBmdW5jdGlvbmFsaXR5LlxuICovXG5jbGFzcyBSYXRlTGltaXRlZEV2ZW50TGlzdGVuZXJXcmFwcGVyPFNlbmRlciwgQXJncz4gZXh0ZW5kcyBFdmVudExpc3RlbmVyV3JhcHBlcjxTZW5kZXIsIEFyZ3M+IHtcblxuICBwcml2YXRlIHJhdGVNczogbnVtYmVyO1xuICBwcml2YXRlIHJhdGVMaW1pdGluZ0V2ZW50TGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPjtcblxuICBwcml2YXRlIGxhc3RGaXJlVGltZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4sIHJhdGVNczogbnVtYmVyKSB7XG4gICAgc3VwZXIobGlzdGVuZXIpOyAvLyBzZXRzIHRoZSBldmVudCBsaXN0ZW5lciBzaW5rXG5cbiAgICB0aGlzLnJhdGVNcyA9IHJhdGVNcztcbiAgICB0aGlzLmxhc3RGaXJlVGltZSA9IDA7XG5cbiAgICAvLyBXcmFwIHRoZSBldmVudCBsaXN0ZW5lciB3aXRoIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgZG9lcyB0aGUgcmF0ZS1saW1pdGluZ1xuICAgIHRoaXMucmF0ZUxpbWl0aW5nRXZlbnRMaXN0ZW5lciA9IChzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncykgPT4ge1xuICAgICAgaWYgKERhdGUubm93KCkgLSB0aGlzLmxhc3RGaXJlVGltZSA+IHRoaXMucmF0ZU1zKSB7XG4gICAgICAgIC8vIE9ubHkgaWYgZW5vdWdoIHRpbWUgc2luY2UgdGhlIHByZXZpb3VzIGNhbGwgaGFzIHBhc3NlZCwgY2FsbCB0aGVcbiAgICAgICAgLy8gYWN0dWFsIGV2ZW50IGxpc3RlbmVyIGFuZCByZWNvcmQgdGhlIGN1cnJlbnQgdGltZVxuICAgICAgICB0aGlzLmZpcmVTdXBlcihzZW5kZXIsIGFyZ3MpO1xuICAgICAgICB0aGlzLmxhc3RGaXJlVGltZSA9IERhdGUubm93KCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZmlyZVN1cGVyKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzKSB7XG4gICAgLy8gRmlyZSB0aGUgYWN0dWFsIGV4dGVybmFsIGV2ZW50IGxpc3RlbmVyXG4gICAgc3VwZXIuZmlyZShzZW5kZXIsIGFyZ3MpO1xuICB9XG5cbiAgZmlyZShzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncykge1xuICAgIC8vIEZpcmUgdGhlIGludGVybmFsIHJhdGUtbGltaXRpbmcgbGlzdGVuZXIgaW5zdGVhZCBvZiB0aGUgZXh0ZXJuYWwgZXZlbnQgbGlzdGVuZXJcbiAgICB0aGlzLnJhdGVMaW1pdGluZ0V2ZW50TGlzdGVuZXIoc2VuZGVyLCBhcmdzKTtcbiAgfVxufSIsImV4cG9ydCBuYW1lc3BhY2UgR3VpZCB7XG5cbiAgbGV0IGd1aWQgPSAxO1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBuZXh0KCkge1xuICAgIHJldHVybiBndWlkKys7XG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9J3BsYXllci5kLnRzJyAvPlxuaW1wb3J0IHtVSU1hbmFnZXIsIFVJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuL3VpbWFuYWdlcic7XG5pbXBvcnQge0J1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2J1dHRvbic7XG5pbXBvcnQge0NvbnRyb2xCYXJ9IGZyb20gJy4vY29tcG9uZW50cy9jb250cm9sYmFyJztcbmltcG9ydCB7RnVsbHNjcmVlblRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bGxzY3JlZW50b2dnbGVidXR0b24nO1xuaW1wb3J0IHtIdWdlUGxheWJhY2tUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9odWdlcGxheWJhY2t0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtQbGF5YmFja1RpbWVMYWJlbCwgUGxheWJhY2tUaW1lTGFiZWxNb2RlfSBmcm9tICcuL2NvbXBvbmVudHMvcGxheWJhY2t0aW1lbGFiZWwnO1xuaW1wb3J0IHtQbGF5YmFja1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U2Vla0Jhcn0gZnJvbSAnLi9jb21wb25lbnRzL3NlZWtiYXInO1xuaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3Rib3gnO1xuaW1wb3J0IHtTZXR0aW5nc1BhbmVsLCBTZXR0aW5nc1BhbmVsSXRlbX0gZnJvbSAnLi9jb21wb25lbnRzL3NldHRpbmdzcGFuZWwnO1xuaW1wb3J0IHtTZXR0aW5nc1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3NldHRpbmdzdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VmlkZW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvdmlkZW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7Vm9sdW1lVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1ldG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VlJUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy92cnRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1dhdGVybWFya30gZnJvbSAnLi9jb21wb25lbnRzL3dhdGVybWFyayc7XG5pbXBvcnQge1VJQ29udGFpbmVyfSBmcm9tICcuL2NvbXBvbmVudHMvdWljb250YWluZXInO1xuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL2xhYmVsJztcbmltcG9ydCB7QXVkaW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvYXVkaW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7QXVkaW9UcmFja1NlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL2F1ZGlvdHJhY2tzZWxlY3Rib3gnO1xuaW1wb3J0IHtDYXN0U3RhdHVzT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3RzdGF0dXNvdmVybGF5JztcbmltcG9ydCB7Q2FzdFRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3R0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9jb21wb25lbnQnO1xuaW1wb3J0IHtFcnJvck1lc3NhZ2VPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JtZXNzYWdlb3ZlcmxheSc7XG5pbXBvcnQge1JlY29tbWVuZGF0aW9uT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3JlY29tbWVuZGF0aW9ub3ZlcmxheSc7XG5pbXBvcnQge1NlZWtCYXJMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL3NlZWtiYXJsYWJlbCc7XG5pbXBvcnQge1N1YnRpdGxlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3N1YnRpdGxlb3ZlcmxheSc7XG5pbXBvcnQge1N1YnRpdGxlU2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvc3VidGl0bGVzZWxlY3Rib3gnO1xuaW1wb3J0IHtUaXRsZUJhcn0gZnJvbSAnLi9jb21wb25lbnRzL3RpdGxlYmFyJztcbmltcG9ydCB7Vm9sdW1lQ29udHJvbEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZWNvbnRyb2xidXR0b24nO1xuaW1wb3J0IHtDbGlja092ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9jbGlja292ZXJsYXknO1xuaW1wb3J0IHtBZFNraXBCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9hZHNraXBidXR0b24nO1xuaW1wb3J0IHtBZE1lc3NhZ2VMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL2FkbWVzc2FnZWxhYmVsJztcbmltcG9ydCB7QWRDbGlja092ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9hZGNsaWNrb3ZlcmxheSc7XG5pbXBvcnQge1BsYXliYWNrU3BlZWRTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9wbGF5YmFja3NwZWVkc2VsZWN0Ym94JztcbmltcG9ydCB7SHVnZVJlcGxheUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2h1Z2VyZXBsYXlidXR0b24nO1xuaW1wb3J0IHtCdWZmZXJpbmdPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvYnVmZmVyaW5nb3ZlcmxheSc7XG5pbXBvcnQge0Nhc3RVSUNvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3R1aWNvbnRhaW5lcic7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlb3ZlcmxheSc7XG5pbXBvcnQge0Nsb3NlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2xvc2VidXR0b24nO1xuaW1wb3J0IHtNZXRhZGF0YUxhYmVsLCBNZXRhZGF0YUxhYmVsQ29udGVudH0gZnJvbSAnLi9jb21wb25lbnRzL21ldGFkYXRhbGFiZWwnO1xuaW1wb3J0IHtBaXJQbGF5VG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvYWlycGxheXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1ZvbHVtZVNsaWRlcn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZXNsaWRlcic7XG5pbXBvcnQge1BpY3R1cmVJblBpY3R1cmVUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9waWN0dXJlaW5waWN0dXJldG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U3BhY2VyfSBmcm9tICcuL2NvbXBvbmVudHMvc3BhY2VyJztcbmltcG9ydCB7QXJyYXlVdGlscywgU3RyaW5nVXRpbHMsIFBsYXllclV0aWxzLCBVSVV0aWxzLCBCcm93c2VyVXRpbHN9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyBPYmplY3QuYXNzaWduIHBvbHlmaWxsIGZvciBFUzUvSUU5XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kZS9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG5pZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gIT09ICdmdW5jdGlvbicpIHtcbiAgT2JqZWN0LmFzc2lnbiA9IGZ1bmN0aW9uKHRhcmdldDogYW55KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGlmICh0YXJnZXQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgfVxuXG4gICAgdGFyZ2V0ID0gT2JqZWN0KHRhcmdldCk7XG4gICAgZm9yIChsZXQgaW5kZXggPSAxOyBpbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGxldCBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcbn1cblxuLy8gRXhwb3NlIGNsYXNzZXMgdG8gd2luZG93XG4od2luZG93IGFzIGFueSkuYml0bW92aW4ucGxheWVydWkgPSB7XG4gIC8vIE1hbmFnZW1lbnRcbiAgVUlNYW5hZ2VyLFxuICBVSUluc3RhbmNlTWFuYWdlcixcbiAgLy8gVXRpbHNcbiAgQXJyYXlVdGlscyxcbiAgU3RyaW5nVXRpbHMsXG4gIFBsYXllclV0aWxzLFxuICBVSVV0aWxzLFxuICBCcm93c2VyVXRpbHMsXG4gIC8vIENvbXBvbmVudHNcbiAgQWRDbGlja092ZXJsYXksXG4gIEFkTWVzc2FnZUxhYmVsLFxuICBBZFNraXBCdXR0b24sXG4gIEFpclBsYXlUb2dnbGVCdXR0b24sXG4gIEF1ZGlvUXVhbGl0eVNlbGVjdEJveCxcbiAgQXVkaW9UcmFja1NlbGVjdEJveCxcbiAgQnVmZmVyaW5nT3ZlcmxheSxcbiAgQnV0dG9uLFxuICBDYXN0U3RhdHVzT3ZlcmxheSxcbiAgQ2FzdFRvZ2dsZUJ1dHRvbixcbiAgQ2FzdFVJQ29udGFpbmVyLFxuICBDbGlja092ZXJsYXksXG4gIENsb3NlQnV0dG9uLFxuICBDb21wb25lbnQsXG4gIENvbnRhaW5lcixcbiAgQ29udHJvbEJhcixcbiAgRXJyb3JNZXNzYWdlT3ZlcmxheSxcbiAgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbixcbiAgSHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9uLFxuICBIdWdlUmVwbGF5QnV0dG9uLFxuICBMYWJlbCxcbiAgTWV0YWRhdGFMYWJlbCxcbiAgTWV0YWRhdGFMYWJlbENvbnRlbnQsXG4gIFBpY3R1cmVJblBpY3R1cmVUb2dnbGVCdXR0b24sXG4gIFBsYXliYWNrU3BlZWRTZWxlY3RCb3gsXG4gIFBsYXliYWNrVGltZUxhYmVsLFxuICBQbGF5YmFja1RpbWVMYWJlbE1vZGUsXG4gIFBsYXliYWNrVG9nZ2xlQnV0dG9uLFxuICBQbGF5YmFja1RvZ2dsZU92ZXJsYXksXG4gIFJlY29tbWVuZGF0aW9uT3ZlcmxheSxcbiAgU2Vla0JhcixcbiAgU2Vla0JhckxhYmVsLFxuICBTZWxlY3RCb3gsXG4gIFNldHRpbmdzUGFuZWwsXG4gIFNldHRpbmdzUGFuZWxJdGVtLFxuICBTZXR0aW5nc1RvZ2dsZUJ1dHRvbixcbiAgU3BhY2VyLFxuICBTdWJ0aXRsZU92ZXJsYXksXG4gIFN1YnRpdGxlU2VsZWN0Qm94LFxuICBUaXRsZUJhcixcbiAgVG9nZ2xlQnV0dG9uLFxuICBVSUNvbnRhaW5lcixcbiAgVmlkZW9RdWFsaXR5U2VsZWN0Qm94LFxuICBWb2x1bWVDb250cm9sQnV0dG9uLFxuICBWb2x1bWVTbGlkZXIsXG4gIFZvbHVtZVRvZ2dsZUJ1dHRvbixcbiAgVlJUb2dnbGVCdXR0b24sXG4gIFdhdGVybWFyayxcbn07IiwiLy8gVE9ETyBjaGFuZ2UgdG8gaW50ZXJuYWwgKG5vdCBleHBvcnRlZCkgY2xhc3MsIGhvdyB0byB1c2UgaW4gb3RoZXIgZmlsZXM/XG4vKipcbiAqIEV4ZWN1dGVzIGEgY2FsbGJhY2sgYWZ0ZXIgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUsXG4gKiBvcHRpb25hbGx5IHJlcGVhdGVkbHkgdW50aWwgc3RvcHBlZC4gV2hlbiBkZWxheSBpcyA8PSAwXG4gKiB0aGUgdGltZW91dCBpcyBkaXNhYmxlZFxuICovXG5leHBvcnQgY2xhc3MgVGltZW91dCB7XG5cbiAgcHJpdmF0ZSBkZWxheTogbnVtYmVyO1xuICBwcml2YXRlIGNhbGxiYWNrOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIHJlcGVhdDogYm9vbGVhbjtcbiAgcHJpdmF0ZSB0aW1lb3V0SGFuZGxlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgdGltZW91dCBjYWxsYmFjayBoYW5kbGVyLlxuICAgKiBAcGFyYW0gZGVsYXkgdGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgY2FsbGJhY2sgc2hvdWxkIGJlIGV4ZWN1dGVkXG4gICAqIEBwYXJhbSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBhZnRlciB0aGUgZGVsYXkgdGltZVxuICAgKiBAcGFyYW0gcmVwZWF0IGlmIHRydWUsIGNhbGwgdGhlIGNhbGxiYWNrIHJlcGVhdGVkbHkgaW4gZGVsYXkgaW50ZXJ2YWxzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZWxheTogbnVtYmVyLCBjYWxsYmFjazogKCkgPT4gdm9pZCwgcmVwZWF0OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuICAgIHRoaXMudGltZW91dEhhbmRsZSA9IDA7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSB0aW1lb3V0IGFuZCBjYWxscyB0aGUgY2FsbGJhY2sgd2hlbiB0aGUgdGltZW91dCBkZWxheSBoYXMgcGFzc2VkLlxuICAgKiBAcmV0dXJucyB7VGltZW91dH0gdGhlIGN1cnJlbnQgdGltZW91dCAoc28gdGhlIHN0YXJ0IGNhbGwgY2FuIGJlIGNoYWluZWQgdG8gdGhlIGNvbnN0cnVjdG9yKVxuICAgKi9cbiAgc3RhcnQoKTogdGhpcyB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgdGltZW91dC4gVGhlIGNhbGxiYWNrIHdpbGwgbm90IGJlIGNhbGxlZCBpZiBjbGVhciBpcyBjYWxsZWQgZHVyaW5nIHRoZSB0aW1lb3V0LlxuICAgKi9cbiAgY2xlYXIoKTogdm9pZCB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dEhhbmRsZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBwYXNzZWQgdGltZW91dCBkZWxheSB0byB6ZXJvLiBDYW4gYmUgdXNlZCB0byBkZWZlciB0aGUgY2FsbGluZyBvZiB0aGUgY2FsbGJhY2suXG4gICAqL1xuICByZXNldCgpOiB2b2lkIHtcbiAgICBsZXQgbGFzdFNjaGVkdWxlVGltZSA9IDA7XG4gICAgbGV0IGRlbGF5QWRqdXN0ID0gMDtcblxuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIGxldCBpbnRlcm5hbENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpcy5jYWxsYmFjaygpO1xuXG4gICAgICBpZiAodGhpcy5yZXBlYXQpIHtcbiAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICAgICAgLy8gVGhlIHRpbWUgb2Ygb25lIGl0ZXJhdGlvbiBmcm9tIHNjaGVkdWxpbmcgdG8gZXhlY3V0aW5nIHRoZSBjYWxsYmFjayAodXN1YWxseSBhIGJpdCBsb25nZXIgdGhhbiB0aGUgZGVsYXlcbiAgICAgICAgLy8gdGltZSlcbiAgICAgICAgbGV0IGRlbHRhID0gbm93IC0gbGFzdFNjaGVkdWxlVGltZTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRlbGF5IGFkanVzdG1lbnQgZm9yIHRoZSBuZXh0IHNjaGVkdWxlIHRvIGtlZXAgYSBzdGVhZHkgZGVsYXkgaW50ZXJ2YWwgb3ZlciB0aW1lXG4gICAgICAgIGRlbGF5QWRqdXN0ID0gdGhpcy5kZWxheSAtIGRlbHRhICsgZGVsYXlBZGp1c3Q7XG5cbiAgICAgICAgbGFzdFNjaGVkdWxlVGltZSA9IG5vdztcblxuICAgICAgICAvLyBTY2hlZHVsZSBuZXh0IGV4ZWN1dGlvbiBieSB0aGUgYWRqdXN0ZWQgZGVsYXlcbiAgICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChpbnRlcm5hbENhbGxiYWNrLCB0aGlzLmRlbGF5ICsgZGVsYXlBZGp1c3QpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsYXN0U2NoZWR1bGVUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBpZiAodGhpcy5kZWxheSA+IDApIHtcbiAgICAgIHRoaXMudGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaW50ZXJuYWxDYWxsYmFjaywgdGhpcy5kZWxheSk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtVSUNvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL3VpY29udGFpbmVyJztcbmltcG9ydCB7RE9NfSBmcm9tICcuL2RvbSc7XG5pbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudHMvY29tcG9uZW50JztcbmltcG9ydCB7Q29udGFpbmVyfSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVyJztcbmltcG9ydCB7UGxheWJhY2tUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9wbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0Z1bGxzY3JlZW5Ub2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9mdWxsc2NyZWVudG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VlJUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy92cnRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1ZvbHVtZVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1NlZWtCYXJ9IGZyb20gJy4vY29tcG9uZW50cy9zZWVrYmFyJztcbmltcG9ydCB7UGxheWJhY2tUaW1lTGFiZWwsIFBsYXliYWNrVGltZUxhYmVsTW9kZX0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdGltZWxhYmVsJztcbmltcG9ydCB7Q29udHJvbEJhcn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRyb2xiYXInO1xuaW1wb3J0IHtOb0FyZ3MsIEV2ZW50RGlzcGF0Y2hlciwgQ2FuY2VsRXZlbnRBcmdzfSBmcm9tICcuL2V2ZW50ZGlzcGF0Y2hlcic7XG5pbXBvcnQge1NldHRpbmdzVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvc2V0dGluZ3N0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtTZXR0aW5nc1BhbmVsLCBTZXR0aW5nc1BhbmVsSXRlbX0gZnJvbSAnLi9jb21wb25lbnRzL3NldHRpbmdzcGFuZWwnO1xuaW1wb3J0IHtWaWRlb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy92aWRlb3F1YWxpdHlzZWxlY3Rib3gnO1xuaW1wb3J0IHtXYXRlcm1hcmt9IGZyb20gJy4vY29tcG9uZW50cy93YXRlcm1hcmsnO1xuaW1wb3J0IHtBdWRpb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9hdWRpb3F1YWxpdHlzZWxlY3Rib3gnO1xuaW1wb3J0IHtBdWRpb1RyYWNrU2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvYXVkaW90cmFja3NlbGVjdGJveCc7XG5pbXBvcnQge1NlZWtCYXJMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL3NlZWtiYXJsYWJlbCc7XG5pbXBvcnQge1ZvbHVtZVNsaWRlcn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZXNsaWRlcic7XG5pbXBvcnQge1N1YnRpdGxlU2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvc3VidGl0bGVzZWxlY3Rib3gnO1xuaW1wb3J0IHtTdWJ0aXRsZU92ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9zdWJ0aXRsZW92ZXJsYXknO1xuaW1wb3J0IHtWb2x1bWVDb250cm9sQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1lY29udHJvbGJ1dHRvbic7XG5pbXBvcnQge0Nhc3RUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9jYXN0dG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7Q2FzdFN0YXR1c092ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9jYXN0c3RhdHVzb3ZlcmxheSc7XG5pbXBvcnQge0Vycm9yTWVzc2FnZU92ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvcm1lc3NhZ2VvdmVybGF5JztcbmltcG9ydCB7VGl0bGVCYXJ9IGZyb20gJy4vY29tcG9uZW50cy90aXRsZWJhcic7XG5pbXBvcnQgUGxheWVyID0gYml0bW92aW4ucGxheWVyLlBsYXllcjtcbmltcG9ydCB7UmVjb21tZW5kYXRpb25PdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvcmVjb21tZW5kYXRpb25vdmVybGF5JztcbmltcG9ydCB7QWRNZXNzYWdlTGFiZWx9IGZyb20gJy4vY29tcG9uZW50cy9hZG1lc3NhZ2VsYWJlbCc7XG5pbXBvcnQge0FkU2tpcEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Fkc2tpcGJ1dHRvbic7XG5pbXBvcnQge0FkQ2xpY2tPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvYWRjbGlja292ZXJsYXknO1xuaW1wb3J0IEVWRU5UID0gYml0bW92aW4ucGxheWVyLkVWRU5UO1xuaW1wb3J0IFBsYXllckV2ZW50Q2FsbGJhY2sgPSBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyRXZlbnRDYWxsYmFjaztcbmltcG9ydCBBZFN0YXJ0ZWRFdmVudCA9IGJpdG1vdmluLnBsYXllci5BZFN0YXJ0ZWRFdmVudDtcbmltcG9ydCB7QXJyYXlVdGlscywgVUlVdGlscywgQnJvd3NlclV0aWxzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7UGxheWJhY2tTcGVlZFNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrc3BlZWRzZWxlY3Rib3gnO1xuaW1wb3J0IHtCdWZmZXJpbmdPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvYnVmZmVyaW5nb3ZlcmxheSc7XG5pbXBvcnQge0Nhc3RVSUNvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3R1aWNvbnRhaW5lcic7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlb3ZlcmxheSc7XG5pbXBvcnQge0Nsb3NlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2xvc2VidXR0b24nO1xuaW1wb3J0IHtNZXRhZGF0YUxhYmVsLCBNZXRhZGF0YUxhYmVsQ29udGVudH0gZnJvbSAnLi9jb21wb25lbnRzL21ldGFkYXRhbGFiZWwnO1xuaW1wb3J0IHtMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL2xhYmVsJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLnBsYXllci5QbGF5ZXJFdmVudDtcbmltcG9ydCB7QWlyUGxheVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2FpcnBsYXl0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtQaWN0dXJlSW5QaWN0dXJlVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvcGljdHVyZWlucGljdHVyZXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1NwYWNlcn0gZnJvbSAnLi9jb21wb25lbnRzL3NwYWNlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVUlSZWNvbW1lbmRhdGlvbkNvbmZpZyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aHVtYm5haWw/OiBzdHJpbmc7XG4gIGR1cmF0aW9uPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVsaW5lTWFya2VyIHtcbiAgdGltZTogbnVtYmVyO1xuICB0aXRsZT86IHN0cmluZztcbiAgbWFya2VyVHlwZT86IHN0cmluZztcbiAgY29tbWVudD86IHN0cmluZztcbiAgYXZhdGFyPzogc3RyaW5nO1xuICBudW1iZXI/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVUlDb25maWcge1xuICBtZXRhZGF0YT86IHtcbiAgICB0aXRsZT86IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgICBtYXJrZXJzPzogVGltZWxpbmVNYXJrZXJbXTtcbiAgfTtcbiAgcmVjb21tZW5kYXRpb25zPzogVUlSZWNvbW1lbmRhdGlvbkNvbmZpZ1tdO1xufVxuXG4vKipcbiAqIFRoZSBjb250ZXh0IHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gYSB7QGxpbmsgVUlDb25kaXRpb25SZXNvbHZlcn0gdG8gZGV0ZXJtaW5lIGlmIGl0J3MgY29uZGl0aW9ucyBmdWxmaWwgdGhlIGNvbnRleHQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVUlDb25kaXRpb25Db250ZXh0IHtcbiAgaXNBZDogYm9vbGVhbjtcbiAgaXNBZFdpdGhVSTogYm9vbGVhbjtcbiAgaXNGdWxsc2NyZWVuOiBib29sZWFuO1xuICBpc01vYmlsZTogYm9vbGVhbjtcbiAgZG9jdW1lbnRXaWR0aDogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlc29sdmVzIHRoZSBjb25kaXRpb25zIG9mIGl0cyBhc3NvY2lhdGVkIFVJIGluIGEge0BsaW5rIFVJVmFyaWFudH0gdXBvbiBhIHtAbGluayBVSUNvbmRpdGlvbkNvbnRleHR9IGFuZCBkZWNpZGVzXG4gKiBpZiB0aGUgVUkgc2hvdWxkIGJlIGRpc3BsYXllZC4gSWYgaXQgcmV0dXJucyB0cnVlLCB0aGUgVUkgaXMgYSBjYW5kaWRhdGUgZm9yIGRpc3BsYXk7IGlmIGl0IHJldHVybnMgZmFsc2UsIGl0IHdpbGxcbiAqIG5vdCBiZSBkaXNwbGF5ZWQgaW4gdGhlIGdpdmVuIGNvbnRleHQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVUlDb25kaXRpb25SZXNvbHZlciB7XG4gIChjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEFzc29jaWF0ZXMgYSBVSSBpbnN0YW5jZSB3aXRoIGFuIG9wdGlvbmFsIHtAbGluayBVSUNvbmRpdGlvblJlc29sdmVyfSB0aGF0IGRldGVybWluZXMgaWYgdGhlIFVJIHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVUlWYXJpYW50IHtcbiAgdWk6IFVJQ29udGFpbmVyO1xuICBjb25kaXRpb24/OiBVSUNvbmRpdGlvblJlc29sdmVyO1xufVxuXG5leHBvcnQgY2xhc3MgVUlNYW5hZ2VyIHtcblxuICBwcml2YXRlIHBsYXllcjogUGxheWVyO1xuICBwcml2YXRlIHBsYXllckVsZW1lbnQ6IERPTTtcbiAgcHJpdmF0ZSB1aVZhcmlhbnRzOiBVSVZhcmlhbnRbXTtcbiAgcHJpdmF0ZSB1aUluc3RhbmNlTWFuYWdlcnM6IEludGVybmFsVUlJbnN0YW5jZU1hbmFnZXJbXTtcbiAgcHJpdmF0ZSBjdXJyZW50VWk6IEludGVybmFsVUlJbnN0YW5jZU1hbmFnZXI7XG4gIHByaXZhdGUgY29uZmlnOiBVSUNvbmZpZztcbiAgcHJpdmF0ZSBtYW5hZ2VyUGxheWVyV3JhcHBlcjogUGxheWVyV3JhcHBlcjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIFVJIG1hbmFnZXIgd2l0aCBhIHNpbmdsZSBVSSB2YXJpYW50IHRoYXQgd2lsbCBiZSBwZXJtYW5lbnRseSBzaG93bi5cbiAgICogQHBhcmFtIHBsYXllciB0aGUgYXNzb2NpYXRlZCBwbGF5ZXIgb2YgdGhpcyBVSVxuICAgKiBAcGFyYW0gdWkgdGhlIFVJIHRvIGFkZCB0byB0aGUgcGxheWVyXG4gICAqIEBwYXJhbSBjb25maWcgb3B0aW9uYWwgVUkgY29uZmlndXJhdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3IocGxheWVyOiBQbGF5ZXIsIHVpOiBVSUNvbnRhaW5lciwgY29uZmlnPzogVUlDb25maWcpO1xuICAvKipcbiAgICogQ3JlYXRlcyBhIFVJIG1hbmFnZXIgd2l0aCBhIGxpc3Qgb2YgVUkgdmFyaWFudHMgdGhhdCB3aWxsIGJlIGR5bmFtaWNhbGx5IHNlbGVjdGVkIGFuZCBzd2l0Y2hlZCBhY2NvcmRpbmcgdG9cbiAgICogdGhlIGNvbnRleHQgb2YgdGhlIFVJLlxuICAgKlxuICAgKiBFdmVyeSB0aW1lIHRoZSBVSSBjb250ZXh0IGNoYW5nZXMsIHRoZSBjb25kaXRpb25zIG9mIHRoZSBVSSB2YXJpYW50cyB3aWxsIGJlIHNlcXVlbnRpYWxseSByZXNvbHZlZCBhbmQgdGhlIGZpcnN0XG4gICAqIFVJLCB3aG9zZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWUsIHdpbGwgYmUgc2VsZWN0ZWQgYW5kIGRpc3BsYXllZC4gVGhlIGxhc3QgdmFyaWFudCBpbiB0aGUgbGlzdCBtaWdodCBvbWl0IHRoZVxuICAgKiBjb25kaXRpb24gcmVzb2x2ZXIgYW5kIHdpbGwgYmUgc2VsZWN0ZWQgYXMgZGVmYXVsdC9mYWxsYmFjayBVSSB3aGVuIGFsbCBvdGhlciBjb25kaXRpb25zIGZhaWwuIElmIHRoZXJlIGlzIG5vXG4gICAqIGZhbGxiYWNrIFVJIGFuZCBhbGwgY29uZGl0aW9ucyBmYWlsLCBubyBVSSB3aWxsIGJlIGRpc3BsYXllZC5cbiAgICpcbiAgICogQHBhcmFtIHBsYXllciB0aGUgYXNzb2NpYXRlZCBwbGF5ZXIgb2YgdGhpcyBVSVxuICAgKiBAcGFyYW0gdWlWYXJpYW50cyBhIGxpc3Qgb2YgVUkgdmFyaWFudHMgdGhhdCB3aWxsIGJlIGR5bmFtaWNhbGx5IHN3aXRjaGVkXG4gICAqIEBwYXJhbSBjb25maWcgb3B0aW9uYWwgVUkgY29uZmlndXJhdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3IocGxheWVyOiBQbGF5ZXIsIHVpVmFyaWFudHM6IFVJVmFyaWFudFtdLCBjb25maWc/OiBVSUNvbmZpZyk7XG4gIGNvbnN0cnVjdG9yKHBsYXllcjogUGxheWVyLCBwbGF5ZXJVaU9yVWlWYXJpYW50czogVUlDb250YWluZXIgfCBVSVZhcmlhbnRbXSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KSB7XG4gICAgaWYgKHBsYXllclVpT3JVaVZhcmlhbnRzIGluc3RhbmNlb2YgVUlDb250YWluZXIpIHtcbiAgICAgIC8vIFNpbmdsZS1VSSBjb25zdHJ1Y3RvciBoYXMgYmVlbiBjYWxsZWQsIHRyYW5zZm9ybSBhcmd1bWVudHMgdG8gVUlWYXJpYW50W10gc2lnbmF0dXJlXG4gICAgICBsZXQgcGxheWVyVWkgPSA8VUlDb250YWluZXI+cGxheWVyVWlPclVpVmFyaWFudHM7XG4gICAgICBsZXQgYWRzVWkgPSBudWxsO1xuXG4gICAgICBsZXQgdWlWYXJpYW50cyA9IFtdO1xuXG4gICAgICAvLyBBZGQgdGhlIGFkcyBVSSBpZiBkZWZpbmVkXG4gICAgICBpZiAoYWRzVWkpIHtcbiAgICAgICAgdWlWYXJpYW50cy5wdXNoKHtcbiAgICAgICAgICB1aTogYWRzVWksXG4gICAgICAgICAgY29uZGl0aW9uOiAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5pc0FkV2l0aFVJO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhlIGRlZmF1bHQgcGxheWVyIFVJXG4gICAgICB1aVZhcmlhbnRzLnB1c2goe3VpOiBwbGF5ZXJVaX0pO1xuXG4gICAgICB0aGlzLnVpVmFyaWFudHMgPSB1aVZhcmlhbnRzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIERlZmF1bHQgY29uc3RydWN0b3IgKFVJVmFyaWFudFtdKSBoYXMgYmVlbiBjYWxsZWRcbiAgICAgIHRoaXMudWlWYXJpYW50cyA9IDxVSVZhcmlhbnRbXT5wbGF5ZXJVaU9yVWlWYXJpYW50cztcbiAgICB9XG5cbiAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyID0gbmV3IFBsYXllcldyYXBwZXIocGxheWVyKTtcbiAgICB0aGlzLnBsYXllckVsZW1lbnQgPSBuZXcgRE9NKHBsYXllci5nZXRGaWd1cmUoKSk7XG5cbiAgICAvLyBDcmVhdGUgVUkgaW5zdGFuY2UgbWFuYWdlcnMgZm9yIHRoZSBVSSB2YXJpYW50c1xuICAgIC8vIFRoZSBpbnN0YW5jZSBtYW5hZ2VycyBtYXAgdG8gdGhlIGNvcnJlc3BvbmRpbmcgVUkgdmFyaWFudHMgYnkgdGhlaXIgYXJyYXkgaW5kZXhcbiAgICB0aGlzLnVpSW5zdGFuY2VNYW5hZ2VycyA9IFtdO1xuICAgIGxldCB1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvbiA9IFtdO1xuICAgIGZvciAobGV0IHVpVmFyaWFudCBvZiB0aGlzLnVpVmFyaWFudHMpIHtcbiAgICAgIGlmICh1aVZhcmlhbnQuY29uZGl0aW9uID09IG51bGwpIHtcbiAgICAgICAgLy8gQ29sbGVjdCB2YXJpYW50cyB3aXRob3V0IGNvbmRpdGlvbnMgZm9yIGVycm9yIGNoZWNraW5nXG4gICAgICAgIHVpVmFyaWFudHNXaXRob3V0Q29uZGl0aW9uLnB1c2godWlWYXJpYW50KTtcbiAgICAgIH1cbiAgICAgIC8vIENyZWF0ZSB0aGUgaW5zdGFuY2UgbWFuYWdlciBmb3IgYSBVSSB2YXJpYW50XG4gICAgICB0aGlzLnVpSW5zdGFuY2VNYW5hZ2Vycy5wdXNoKG5ldyBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyKHBsYXllciwgdWlWYXJpYW50LnVpLCB0aGlzLmNvbmZpZykpO1xuICAgIH1cbiAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGVyZSBpcyBvbmx5IG9uZSBVSSB2YXJpYW50IHdpdGhvdXQgYSBjb25kaXRpb25cbiAgICAvLyBJdCBkb2VzIG5vdCBtYWtlIHNlbnNlIHRvIGhhdmUgbXVsdGlwbGUgdmFyaWFudHMgd2l0aG91dCBjb25kaXRpb24sIGJlY2F1c2Ugb25seSB0aGUgZmlyc3Qgb25lIGluIHRoZSBsaXN0XG4gICAgLy8gKHRoZSBvbmUgd2l0aCB0aGUgbG93ZXN0IGluZGV4KSB3aWxsIGV2ZXIgYmUgc2VsZWN0ZWQuXG4gICAgaWYgKHVpVmFyaWFudHNXaXRob3V0Q29uZGl0aW9uLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IEVycm9yKCdUb28gbWFueSBVSXMgd2l0aG91dCBhIGNvbmRpdGlvbjogWW91IGNhbm5vdCBoYXZlIG1vcmUgdGhhbiBvbmUgZGVmYXVsdCBVSScpO1xuICAgIH1cbiAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgZGVmYXVsdCBVSSB2YXJpYW50LCBpZiBkZWZpbmVkLCBpcyBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0IChsYXN0IGluZGV4KVxuICAgIC8vIElmIGl0IGNvbWVzIGVhcmxpZXIsIHRoZSB2YXJpYW50cyB3aXRoIGNvbmRpdGlvbnMgdGhhdCBjb21lIGFmdGVyd2FyZHMgd2lsbCBuZXZlciBiZSBzZWxlY3RlZCBiZWNhdXNlIHRoZVxuICAgIC8vIGRlZmF1bHQgdmFyaWFudCB3aXRob3V0IGEgY29uZGl0aW9uIGFsd2F5cyBldmFsdWF0ZXMgdG8gJ3RydWUnXG4gICAgaWYgKHVpVmFyaWFudHNXaXRob3V0Q29uZGl0aW9uLmxlbmd0aCA+IDBcbiAgICAgICYmIHVpVmFyaWFudHNXaXRob3V0Q29uZGl0aW9uWzBdICE9PSB0aGlzLnVpVmFyaWFudHNbdGhpcy51aVZhcmlhbnRzLmxlbmd0aCAtIDFdKSB7XG4gICAgICB0aHJvdyBFcnJvcignSW52YWxpZCBVSSB2YXJpYW50IG9yZGVyOiB0aGUgZGVmYXVsdCBVSSAod2l0aG91dCBjb25kaXRpb24pIG11c3QgYmUgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdCcpO1xuICAgIH1cblxuICAgIGxldCBhZFN0YXJ0ZWRFdmVudDogQWRTdGFydGVkRXZlbnQgPSBudWxsOyAvLyBrZWVwIHRoZSBldmVudCBzdG9yZWQgaGVyZSBkdXJpbmcgYWQgcGxheWJhY2tcbiAgICBsZXQgaXNNb2JpbGUgPSBCcm93c2VyVXRpbHMuaXNNb2JpbGU7XG5cbiAgICAvLyBEeW5hbWljYWxseSBzZWxlY3QgYSBVSSB2YXJpYW50IHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCBVSSBjb25kaXRpb24uXG4gICAgbGV0IHJlc29sdmVVaVZhcmlhbnQgPSAoZXZlbnQ6IFBsYXllckV2ZW50KSA9PiB7XG4gICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgT05fQURfU1RBUlRFRCBldmVudCBkYXRhIGlzIHBlcnNpc3RlZCB0aHJvdWdoIGFkIHBsYXliYWNrIGluIGNhc2Ugb3RoZXIgZXZlbnRzIGhhcHBlblxuICAgICAgLy8gaW4gdGhlIG1lYW50aW1lLCBlLmcuIHBsYXllciByZXNpemUuIFdlIG5lZWQgdG8gc3RvcmUgdGhpcyBkYXRhIGJlY2F1c2UgdGhlcmUgaXMgbm8gb3RoZXIgd2F5IHRvIGZpbmQgb3V0XG4gICAgICAvLyBhZCBkZXRhaWxzIChlLmcuIHRoZSBhZCBjbGllbnQpIHdoaWxlIGFuIGFkIGlzIHBsYXlpbmcuXG4gICAgICAvLyBFeGlzdGluZyBldmVudCBkYXRhIHNpZ25hbHMgdGhhdCBhbiBhZCBpcyBjdXJyZW50bHkgYWN0aXZlLiBXZSBjYW5ub3QgdXNlIHBsYXllci5pc0FkKCkgYmVjYXVzZSBpdCByZXR1cm5zXG4gICAgICAvLyB0cnVlIG9uIGFkIHN0YXJ0IGFuZCBhbHNvIG9uIGFkIGVuZCBldmVudHMsIHdoaWNoIGlzIHByb2JsZW1hdGljLlxuICAgICAgaWYgKGV2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgICAgLy8gV2hlbiB0aGUgYWQgc3RhcnRzLCB3ZSBzdG9yZSB0aGUgZXZlbnQgZGF0YVxuICAgICAgICAgIGNhc2UgcGxheWVyLkVWRU5ULk9OX0FEX1NUQVJURUQ6XG4gICAgICAgICAgICBhZFN0YXJ0ZWRFdmVudCA9IDxBZFN0YXJ0ZWRFdmVudD5ldmVudDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIC8vIFdoZW4gdGhlIGFkIGVuZHMsIHdlIGRlbGV0ZSB0aGUgZXZlbnQgZGF0YVxuICAgICAgICAgIGNhc2UgcGxheWVyLkVWRU5ULk9OX0FEX0ZJTklTSEVEOlxuICAgICAgICAgIGNhc2UgcGxheWVyLkVWRU5ULk9OX0FEX1NLSVBQRUQ6XG4gICAgICAgICAgY2FzZSBwbGF5ZXIuRVZFTlQuT05fQURfRVJST1I6XG4gICAgICAgICAgICBhZFN0YXJ0ZWRFdmVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRGV0ZWN0IGlmIGFuIGFkIGhhcyBzdGFydGVkXG4gICAgICBsZXQgYWQgPSBhZFN0YXJ0ZWRFdmVudCAhPSBudWxsO1xuICAgICAgbGV0IGFkV2l0aFVJID0gYWQgJiYgYWRTdGFydGVkRXZlbnQuY2xpZW50VHlwZSA9PT0gJ3Zhc3QnO1xuXG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIGN1cnJlbnQgY29udGV4dCBmb3Igd2hpY2ggdGhlIFVJIHZhcmlhbnQgd2lsbCBiZSByZXNvbHZlZFxuICAgICAgbGV0IGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCA9IHtcbiAgICAgICAgaXNBZDogYWQsXG4gICAgICAgIGlzQWRXaXRoVUk6IGFkV2l0aFVJLFxuICAgICAgICBpc0Z1bGxzY3JlZW46IHRoaXMucGxheWVyLmlzRnVsbHNjcmVlbigpLFxuICAgICAgICBpc01vYmlsZTogaXNNb2JpbGUsXG4gICAgICAgIHdpZHRoOiB0aGlzLnBsYXllckVsZW1lbnQud2lkdGgoKSxcbiAgICAgICAgZG9jdW1lbnRXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCxcbiAgICAgIH07XG5cbiAgICAgIGxldCBuZXh0VWk6IEludGVybmFsVUlJbnN0YW5jZU1hbmFnZXIgPSBudWxsO1xuICAgICAgbGV0IHVpVmFyaWFudENoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgLy8gU2VsZWN0IG5ldyBVSSB2YXJpYW50XG4gICAgICAvLyBJZiBubyB2YXJpYW50IGNvbmRpdGlvbiBpcyBmdWxmaWxsZWQsIHdlIHN3aXRjaCB0byAqbm8qIFVJXG4gICAgICBmb3IgKGxldCB1aVZhcmlhbnQgb2YgdGhpcy51aVZhcmlhbnRzKSB7XG4gICAgICAgIGlmICh1aVZhcmlhbnQuY29uZGl0aW9uID09IG51bGwgfHwgdWlWYXJpYW50LmNvbmRpdGlvbihjb250ZXh0KSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIG5leHRVaSA9IHRoaXMudWlJbnN0YW5jZU1hbmFnZXJzW3RoaXMudWlWYXJpYW50cy5pbmRleE9mKHVpVmFyaWFudCldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERldGVybWluZSBpZiB0aGUgVUkgdmFyaWFudCBpcyBjaGFuZ2luZ1xuICAgICAgaWYgKG5leHRVaSAhPT0gdGhpcy5jdXJyZW50VWkpIHtcbiAgICAgICAgdWlWYXJpYW50Q2hhbmdlZCA9IHRydWU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzd2l0Y2hlZCBmcm9tICcsIHRoaXMuY3VycmVudFVpID8gdGhpcy5jdXJyZW50VWkuZ2V0VUkoKSA6ICdub25lJyxcbiAgICAgICAgLy8gICAnIHRvICcsIG5leHRVaSA/IG5leHRVaS5nZXRVSSgpIDogJ25vbmUnKTtcbiAgICAgIH1cblxuICAgICAgLy8gT25seSBpZiB0aGUgVUkgdmFyaWFudCBpcyBjaGFuZ2luZywgd2UgbmVlZCB0byBkbyBzb21lIHN0dWZmLiBFbHNlIHdlIGp1c3QgbGVhdmUgZXZlcnl0aGluZyBhcy1pcy5cbiAgICAgIGlmICh1aVZhcmlhbnRDaGFuZ2VkKSB7XG4gICAgICAgIC8vIEhpZGUgdGhlIGN1cnJlbnRseSBhY3RpdmUgVUkgdmFyaWFudFxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VWkpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5nZXRVSSgpLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFzc2lnbiB0aGUgbmV3IFVJIHZhcmlhbnQgYXMgY3VycmVudCBVSVxuICAgICAgICB0aGlzLmN1cnJlbnRVaSA9IG5leHRVaTtcblxuICAgICAgICAvLyBXaGVuIHdlIHN3aXRjaCB0byBhIGRpZmZlcmVudCBVSSBpbnN0YW5jZSwgdGhlcmUncyBzb21lIGFkZGl0aW9uYWwgc3R1ZmYgdG8gbWFuYWdlLiBJZiB3ZSBkbyBub3Qgc3dpdGNoXG4gICAgICAgIC8vIHRvIGFuIGluc3RhbmNlLCB3ZSdyZSBkb25lIGhlcmUuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRVaSAhPSBudWxsKSB7XG4gICAgICAgICAgLy8gQWRkIHRoZSBVSSB0byB0aGUgRE9NIChhbmQgY29uZmlndXJlIGl0KSB0aGUgZmlyc3QgdGltZSBpdCBpcyBzZWxlY3RlZFxuICAgICAgICAgIGlmICghdGhpcy5jdXJyZW50VWkuaXNDb25maWd1cmVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVWkodGhpcy5jdXJyZW50VWkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoaXMgaXMgYW4gYWQgVUksIHdlIG5lZWQgdG8gcmVsYXkgdGhlIHNhdmVkIE9OX0FEX1NUQVJURUQgZXZlbnQgZGF0YSBzbyBhZCBjb21wb25lbnRzIGNhbiBjb25maWd1cmVcbiAgICAgICAgICAvLyB0aGVtc2VsdmVzIGZvciB0aGUgY3VycmVudCBhZC5cbiAgICAgICAgICBpZiAoY29udGV4dC5pc0FkKSB7XG4gICAgICAgICAgICAvKiBSZWxheSB0aGUgT05fQURfU1RBUlRFRCBldmVudCB0byB0aGUgYWRzIFVJXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQmVjYXVzZSB0aGUgYWRzIFVJIGlzIGluaXRpYWxpemVkIGluIHRoZSBPTl9BRF9TVEFSVEVEIGhhbmRsZXIsIGkuZS4gd2hlbiB0aGUgT05fQURfU1RBUlRFRCBldmVudCBoYXNcbiAgICAgICAgICAgICAqIGFscmVhZHkgYmVlbiBmaXJlZCwgY29tcG9uZW50cyBpbiB0aGUgYWRzIFVJIHRoYXQgbGlzdGVuIGZvciB0aGUgT05fQURfU1RBUlRFRCBldmVudCBuZXZlciByZWNlaXZlIGl0LlxuICAgICAgICAgICAgICogU2luY2UgdGhpcyBjYW4gYnJlYWsgZnVuY3Rpb25hbGl0eSBvZiBjb21wb25lbnRzIHRoYXQgcmVseSBvbiB0aGlzIGV2ZW50LCB3ZSByZWxheSB0aGUgZXZlbnQgdG8gdGhlXG4gICAgICAgICAgICAgKiBhZHMgVUkgY29tcG9uZW50cyB3aXRoIHRoZSBmb2xsb3dpbmcgY2FsbC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VWkuZ2V0V3JhcHBlZFBsYXllcigpLmZpcmVFdmVudEluVUkodGhpcy5wbGF5ZXIuRVZFTlQuT05fQURfU1RBUlRFRCwgYWRTdGFydGVkRXZlbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY3VycmVudFVpLmdldFVJKCkuc2hvdygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIExpc3RlbiB0byB0aGUgZm9sbG93aW5nIGV2ZW50cyB0byB0cmlnZ2VyIFVJIHZhcmlhbnQgcmVzb2x1dGlvblxuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX0FEX1NUQVJURUQsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX0FEX0ZJTklTSEVELCByZXNvbHZlVWlWYXJpYW50KTtcbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9BRF9TS0lQUEVELCByZXNvbHZlVWlWYXJpYW50KTtcbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9BRF9FUlJPUiwgcmVzb2x2ZVVpVmFyaWFudCk7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fUExBWUVSX1JFU0laRSwgcmVzb2x2ZVVpVmFyaWFudCk7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fRlVMTFNDUkVFTl9FTlRFUiwgcmVzb2x2ZVVpVmFyaWFudCk7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fRlVMTFNDUkVFTl9FWElULCByZXNvbHZlVWlWYXJpYW50KTtcblxuICAgIC8vIEluaXRpYWxpemUgdGhlIFVJXG4gICAgcmVzb2x2ZVVpVmFyaWFudChudWxsKTtcbiAgfVxuXG4gIGdldENvbmZpZygpOiBVSUNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRVaSh1aTogSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIGxldCBkb20gPSB1aS5nZXRVSSgpLmdldERvbUVsZW1lbnQoKTtcbiAgICB1aS5jb25maWd1cmVDb250cm9scygpO1xuICAgIC8qIEFwcGVuZCB0aGUgVUkgRE9NIGFmdGVyIGNvbmZpZ3VyYXRpb24gdG8gYXZvaWQgQ1NTIHRyYW5zaXRpb25zIGF0IGluaXRpYWxpemF0aW9uXG4gICAgICogRXhhbXBsZTogQ29tcG9uZW50cyBhcmUgaGlkZGVuIGR1cmluZyBjb25maWd1cmF0aW9uIGFuZCB0aGVzZSBoaWRlcyBtYXkgdHJpZ2dlciBDU1MgdHJhbnNpdGlvbnMgdGhhdCBhcmVcbiAgICAgKiB1bmRlc2lyYWJsZSBhdCB0aGlzIHRpbWUuICovXG5cbiAgICAvKiBBcHBlbmQgdWkgdG8gcGFyZW50IGluc3RlYWQgb2YgcGxheWVyICovXG4gICAgbGV0IHBhcmVudEVsZW1lbnQgPSBuZXcgRE9NKHRoaXMucGxheWVyRWxlbWVudC5nZXRFbGVtZW50cygpWzBdLnBhcmVudEVsZW1lbnQpO1xuICAgIHBhcmVudEVsZW1lbnQuYWRkQ2xhc3MoJ3NtYXNoY3V0LWN1c3RvbS11aS1iaXRtb3Zpbi1wbGF5ZXItaG9sZGVyJyk7XG4gICAgcGFyZW50RWxlbWVudC5hcHBlbmQoZG9tKTtcblxuICAgIC8vIEZpcmUgb25Db25maWd1cmVkIGFmdGVyIFVJIERPTSBlbGVtZW50cyBhcmUgc3VjY2Vzc2Z1bGx5IGFkZGVkLiBXaGVuIGZpcmVkIGltbWVkaWF0ZWx5LCB0aGUgRE9NIGVsZW1lbnRzXG4gICAgLy8gbWlnaHQgbm90IGJlIGZ1bGx5IGNvbmZpZ3VyZWQgYW5kIGUuZy4gZG8gbm90IGhhdmUgYSBzaXplLlxuICAgIC8vIGh0dHBzOi8vc3dpemVjLmNvbS9ibG9nL2hvdy10by1wcm9wZXJseS13YWl0LWZvci1kb20tZWxlbWVudHMtdG8tc2hvdy11cC1pbi1tb2Rlcm4tYnJvd3NlcnMvc3dpemVjLzY2NjNcbiAgICBpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdWkub25Db25maWd1cmVkLmRpc3BhdGNoKHVpLmdldFVJKCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElFOSBmYWxsYmFja1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHVpLm9uQ29uZmlndXJlZC5kaXNwYXRjaCh1aS5nZXRVSSgpKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVsZWFzZVVpKHVpOiBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgdWkucmVsZWFzZUNvbnRyb2xzKCk7XG4gICAgdWkuZ2V0VUkoKS5nZXREb21FbGVtZW50KCkucmVtb3ZlKCk7XG4gICAgdWkuY2xlYXJFdmVudEhhbmRsZXJzKCk7XG4gIH1cblxuICByZWxlYXNlKCk6IHZvaWQge1xuICAgIGZvciAobGV0IHVpSW5zdGFuY2VNYW5hZ2VyIG9mIHRoaXMudWlJbnN0YW5jZU1hbmFnZXJzKSB7XG4gICAgICB0aGlzLnJlbGVhc2VVaSh1aUluc3RhbmNlTWFuYWdlcik7XG4gICAgfVxuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuY2xlYXJFdmVudEhhbmRsZXJzKCk7XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBVSU1hbmFnZXIuRmFjdG9yeSB7XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRGVmYXVsdFVJKHBsYXllcjogUGxheWVyLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBVSU1hbmFnZXIuRmFjdG9yeS5idWlsZE1vZGVyblVJKHBsYXllciwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZERlZmF1bHRTbWFsbFNjcmVlblVJKHBsYXllcjogUGxheWVyLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBVSU1hbmFnZXIuRmFjdG9yeS5idWlsZE1vZGVyblNtYWxsU2NyZWVuVUkocGxheWVyLCBjb25maWcpO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRGVmYXVsdENhc3RSZWNlaXZlclVJKHBsYXllcjogUGxheWVyLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBVSU1hbmFnZXIuRmFjdG9yeS5idWlsZE1vZGVybkNhc3RSZWNlaXZlclVJKHBsYXllciwgY29uZmlnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNtYXNoY3V0VWkoKSB7XG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3BlZWQnLCBuZXcgUGxheWJhY2tTcGVlZFNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IGNvbnRyb2xCYXJUb3AgPSBuZXcgQ29udGFpbmVyKHtcbiAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci10b3AnXSxcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudFRpbWUsIGhpZGVJbkxpdmVQbGF5YmFjazogdHJ1ZX0pLFxuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoe3RpbWVMYWJlbE1vZGU6IFBsYXliYWNrVGltZUxhYmVsTW9kZS5Ub3RhbFRpbWUsIGNzc0NsYXNzZXM6IFsndGV4dC1yaWdodCddfSksXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhck1pZGRsZSA9IG5ldyBDb250YWluZXIoe1xuICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLW1pZGRsZSddLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU2Vla0Jhcih7bGFiZWw6IG5ldyBTZWVrQmFyTGFiZWwoKX0pLFxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgbGV0IGNvbnRyb2xCYXJCb3R0b20gPSBuZXcgQ29udGFpbmVyKHtcbiAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci1ib3R0b20nXSxcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFNwYWNlcigpLFxuICAgICAgICBuZXcgVm9sdW1lU2xpZGVyKCksXG4gICAgICAgIG5ldyBWb2x1bWVUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IFNldHRpbmdzVG9nZ2xlQnV0dG9uKHtzZXR0aW5nc1BhbmVsOiBzZXR0aW5nc1BhbmVsfSksXG4gICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKCksXG4gICAgICBdXG4gICAgfSk7XG5cblxuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLWlubmVyJ10sXG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgICAgIGNvbnRyb2xCYXJUb3AsXG4gICAgICAgICAgICBjb250cm9sQmFyTWlkZGxlLFxuICAgICAgICAgICAgY29udHJvbEJhckJvdHRvbSxcbiAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGhpZGVEZWxheTogMCxcbiAgICAgIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4gdWktc2tpbi1zbWFzaGN1dCddLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIC8qKiBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksICoqL1xuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoKSxcbiAgICAgICAgbmV3IFJlY29tbWVuZGF0aW9uT3ZlcmxheSgpLFxuICAgICAgICBuZXcgRXJyb3JNZXNzYWdlT3ZlcmxheSgpXG4gICAgICBdXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5VSSgpIHtcbiAgICBsZXQgc2V0dGluZ3NQYW5lbCA9IG5ldyBTZXR0aW5nc1BhbmVsKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdWaWRlbyBRdWFsaXR5JywgbmV3IFZpZGVvUXVhbGl0eVNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdTcGVlZCcsIG5ldyBQbGF5YmFja1NwZWVkU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFRyYWNrJywgbmV3IEF1ZGlvVHJhY2tTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gUXVhbGl0eScsIG5ldyBBdWRpb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3VidGl0bGVzJywgbmV3IFN1YnRpdGxlU2VsZWN0Qm94KCkpXG4gICAgICBdLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudFRpbWUsIGhpZGVJbkxpdmVQbGF5YmFjazogdHJ1ZX0pLFxuICAgICAgICAgICAgbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KSxcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci10b3AnXVxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgVm9sdW1lU2xpZGVyKCksXG4gICAgICAgICAgICBuZXcgU3BhY2VyKCksXG4gICAgICAgICAgICBuZXcgUGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgbmV3IEFpclBsYXlUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBDYXN0VG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgVlJUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBTZXR0aW5nc1RvZ2dsZUJ1dHRvbih7c2V0dGluZ3NQYW5lbDogc2V0dGluZ3NQYW5lbH0pLFxuICAgICAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci1ib3R0b20nXVxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IENhc3RTdGF0dXNPdmVybGF5KCksXG4gICAgICAgIGNvbnRyb2xCYXIsXG4gICAgICAgIG5ldyBUaXRsZUJhcigpLFxuICAgICAgICBuZXcgUmVjb21tZW5kYXRpb25PdmVybGF5KCksXG4gICAgICAgIG5ldyBXYXRlcm1hcmsoKSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXSwgY3NzQ2xhc3NlczogWyd1aS1za2luLW1vZGVybiddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5BZHNVSSgpIHtcbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IEJ1ZmZlcmluZ092ZXJsYXkoKSxcbiAgICAgICAgbmV3IEFkQ2xpY2tPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IEFkTWVzc2FnZUxhYmVsKHt0ZXh0OiAnQWQ6IHtyZW1haW5pbmdUaW1lfSBzZWNzJ30pLFxuICAgICAgICAgICAgbmV3IEFkU2tpcEJ1dHRvbigpXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjc3NDbGFzczogJ3VpLWFkcy1zdGF0dXMnXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgQ29udHJvbEJhcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICAgICAgICAgIG5ldyBTcGFjZXIoKSxcbiAgICAgICAgICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItYm90dG9tJ11cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF1cbiAgICAgICAgfSlcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nLCAndWktc2tpbi1hZHMnXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuU21hbGxTY3JlZW5VSSgpIHtcbiAgICBsZXQgc2V0dGluZ3NQYW5lbCA9IG5ldyBTZXR0aW5nc1BhbmVsKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdWaWRlbyBRdWFsaXR5JywgbmV3IFZpZGVvUXVhbGl0eVNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdTcGVlZCcsIG5ldyBQbGF5YmFja1NwZWVkU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFRyYWNrJywgbmV3IEF1ZGlvVHJhY2tTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gUXVhbGl0eScsIG5ldyBBdWRpb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3VidGl0bGVzJywgbmV3IFN1YnRpdGxlU2VsZWN0Qm94KCkpXG4gICAgICBdLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgaGlkZURlbGF5OiAtMSxcbiAgICB9KTtcbiAgICBzZXR0aW5nc1BhbmVsLmFkZENvbXBvbmVudChuZXcgQ2xvc2VCdXR0b24oe3RhcmdldDogc2V0dGluZ3NQYW5lbH0pKTtcblxuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoe3RpbWVMYWJlbE1vZGU6IFBsYXliYWNrVGltZUxhYmVsTW9kZS5DdXJyZW50VGltZSwgaGlkZUluTGl2ZVBsYXliYWNrOiB0cnVlfSksXG4gICAgICAgICAgICBuZXcgU2Vla0Jhcih7bGFiZWw6IG5ldyBTZWVrQmFyTGFiZWwoKX0pLFxuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuVG90YWxUaW1lLCBjc3NDbGFzc2VzOiBbJ3RleHQtcmlnaHQnXX0pLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLXRvcCddXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTdWJ0aXRsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IEJ1ZmZlcmluZ092ZXJsYXkoKSxcbiAgICAgICAgbmV3IENhc3RTdGF0dXNPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBuZXcgTWV0YWRhdGFMYWJlbCh7Y29udGVudDogTWV0YWRhdGFMYWJlbENvbnRlbnQuVGl0bGV9KSxcbiAgICAgICAgICAgIG5ldyBDYXN0VG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICAvKm5ldyBWUlRvZ2dsZUJ1dHRvbigpLCovXG4gICAgICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgXVxuICAgICAgICB9KSxcbiAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgbmV3IFJlY29tbWVuZGF0aW9uT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nLCAndWktc2tpbi1zbWFsbHNjcmVlbiddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5TbWFsbFNjcmVlbkFkc1VJKCkge1xuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgQnVmZmVyaW5nT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQWRDbGlja092ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgVGl0bGVCYXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIC8vIGR1bW15IGxhYmVsIHdpdGggbm8gY29udGVudCB0byBtb3ZlIGJ1dHRvbnMgdG8gdGhlIHJpZ2h0XG4gICAgICAgICAgICBuZXcgTGFiZWwoe2Nzc0NsYXNzOiAnbGFiZWwtbWV0YWRhdGEtdGl0bGUnfSksXG4gICAgICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgIF1cbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBBZE1lc3NhZ2VMYWJlbCh7dGV4dDogJ0FkOiB7cmVtYWluaW5nVGltZX0gc2Vjcyd9KSxcbiAgICAgICAgICAgIG5ldyBBZFNraXBCdXR0b24oKVxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3NzQ2xhc3M6ICd1aS1hZHMtc3RhdHVzJ1xuICAgICAgICB9KSxcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nLCAndWktc2tpbi1hZHMnLCAndWktc2tpbi1zbWFsbHNjcmVlbiddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5DYXN0UmVjZWl2ZXJVSSgpIHtcbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudFRpbWUsIGhpZGVJbkxpdmVQbGF5YmFjazogdHJ1ZX0pLFxuICAgICAgICAgICAgbmV3IFNlZWtCYXIoe3Ntb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zOiAtMX0pLFxuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuVG90YWxUaW1lLCBjc3NDbGFzc2VzOiBbJ3RleHQtcmlnaHQnXX0pLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLXRvcCddXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBDYXN0VUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFdhdGVybWFyaygpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoe2tlZXBIaWRkZW5XaXRob3V0TWV0YWRhdGE6IHRydWV9KSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXSwgY3NzQ2xhc3NlczogWyd1aS1za2luLW1vZGVybicsICd1aS1za2luLWNhc3QtcmVjZWl2ZXInXVxuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTW9kZXJuVUkocGxheWVyOiBQbGF5ZXIsIGNvbmZpZzogVUlDb25maWcgPSB7fSk6IFVJTWFuYWdlciB7XG4gICAgLy8gc2hvdyBzbWFsbFNjcmVlbiBVSSBvbmx5IG9uIG1vYmlsZS9oYW5kaGVsZCBkZXZpY2VzXG4gICAgbGV0IHNtYWxsU2NyZWVuU3dpdGNoV2lkdGggPSA2MDA7XG5cbiAgICByZXR1cm4gbmV3IFVJTWFuYWdlcihwbGF5ZXIsIFt7XG4gICAgICB1aTogbW9kZXJuU21hbGxTY3JlZW5BZHNVSSgpLFxuICAgICAgY29uZGl0aW9uOiAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmlzTW9iaWxlICYmIGNvbnRleHQuZG9jdW1lbnRXaWR0aCA8IHNtYWxsU2NyZWVuU3dpdGNoV2lkdGggJiYgY29udGV4dC5pc0FkV2l0aFVJO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHVpOiBtb2Rlcm5BZHNVSSgpLFxuICAgICAgY29uZGl0aW9uOiAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmlzQWRXaXRoVUk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgdWk6IG1vZGVyblNtYWxsU2NyZWVuVUkoKSxcbiAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5pc01vYmlsZSAmJiBjb250ZXh0LmRvY3VtZW50V2lkdGggPCBzbWFsbFNjcmVlblN3aXRjaFdpZHRoO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHVpOiBzbWFzaGN1dFVpKClcbiAgICB9XSwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZE1vZGVyblNtYWxsU2NyZWVuVUkocGxheWVyOiBQbGF5ZXIsIGNvbmZpZzogVUlDb25maWcgPSB7fSk6IFVJTWFuYWdlciB7XG4gICAgcmV0dXJuIG5ldyBVSU1hbmFnZXIocGxheWVyLCBbe1xuICAgICAgdWk6IG1vZGVyblNtYWxsU2NyZWVuQWRzVUkoKSxcbiAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5pc0FkV2l0aFVJO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHVpOiBtb2Rlcm5TbWFsbFNjcmVlblVJKClcbiAgICB9XSwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZE1vZGVybkNhc3RSZWNlaXZlclVJKHBsYXllcjogUGxheWVyLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgbW9kZXJuQ2FzdFJlY2VpdmVyVUkoKSwgY29uZmlnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlZ2FjeVVJKCkge1xuICAgIGxldCBzZXR0aW5nc1BhbmVsID0gbmV3IFNldHRpbmdzUGFuZWwoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1ZpZGVvIFF1YWxpdHknLCBuZXcgVmlkZW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFRyYWNrJywgbmV3IEF1ZGlvVHJhY2tTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gUXVhbGl0eScsIG5ldyBBdWRpb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3VidGl0bGVzJywgbmV3IFN1YnRpdGxlU2VsZWN0Qm94KCkpXG4gICAgICBdLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBTZWVrQmFyKHtsYWJlbDogbmV3IFNlZWtCYXJMYWJlbCgpfSksXG4gICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCgpLFxuICAgICAgICBuZXcgVlJUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IFZvbHVtZUNvbnRyb2xCdXR0b24oKSxcbiAgICAgICAgbmV3IFNldHRpbmdzVG9nZ2xlQnV0dG9uKHtzZXR0aW5nc1BhbmVsOiBzZXR0aW5nc1BhbmVsfSksXG4gICAgICAgIG5ldyBDYXN0VG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKClcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBDYXN0U3RhdHVzT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBXYXRlcm1hcmsoKSxcbiAgICAgICAgbmV3IFJlY29tbWVuZGF0aW9uT3ZlcmxheSgpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoKSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXSwgY3NzQ2xhc3NlczogWyd1aS1za2luLWxlZ2FjeSddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBsZWdhY3lBZHNVSSgpIHtcbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IEFkQ2xpY2tPdmVybGF5KCksXG4gICAgICAgIG5ldyBDb250cm9sQmFyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBBZE1lc3NhZ2VMYWJlbCgpLFxuICAgICAgICAgICAgbmV3IFZvbHVtZUNvbnRyb2xCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKClcbiAgICAgICAgICBdXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgQWRTa2lwQnV0dG9uKClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1sZWdhY3knLCAndWktc2tpbi1hZHMnXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVnYWN5Q2FzdFJlY2VpdmVyVUkoKSB7XG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZWVrQmFyKCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCgpLFxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTdWJ0aXRsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIGNvbnRyb2xCYXIsXG4gICAgICAgIG5ldyBUaXRsZUJhcigpLFxuICAgICAgICBuZXcgRXJyb3JNZXNzYWdlT3ZlcmxheSgpXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbGVnYWN5JywgJ3VpLXNraW4tY2FzdC1yZWNlaXZlciddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBsZWdhY3lUZXN0VUkoKSB7XG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gVHJhY2snLCBuZXcgQXVkaW9UcmFja1NlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBRdWFsaXR5JywgbmV3IEF1ZGlvUXVhbGl0eVNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdTdWJ0aXRsZXMnLCBuZXcgU3VidGl0bGVTZWxlY3RCb3goKSlcbiAgICAgIF0sXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9KTtcblxuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW3NldHRpbmdzUGFuZWwsXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgU2Vla0Jhcih7bGFiZWw6IG5ldyBTZWVrQmFyTGFiZWwoKX0pLFxuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoKSxcbiAgICAgICAgbmV3IFZSVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBWb2x1bWVUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICBuZXcgVm9sdW1lQ29udHJvbEJ1dHRvbigpLFxuICAgICAgICBuZXcgVm9sdW1lQ29udHJvbEJ1dHRvbih7dmVydGljYWw6IGZhbHNlfSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1RvZ2dsZUJ1dHRvbih7c2V0dGluZ3NQYW5lbDogc2V0dGluZ3NQYW5lbH0pLFxuICAgICAgICBuZXcgQ2FzdFRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFN1YnRpdGxlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQ2FzdFN0YXR1c092ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIG5ldyBSZWNvbW1lbmRhdGlvbk92ZXJsYXkoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKCksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1sZWdhY3knXVxuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTGVnYWN5VUkocGxheWVyOiBQbGF5ZXIsIGNvbmZpZzogVUlDb25maWcgPSB7fSk6IFVJTWFuYWdlciB7XG4gICAgcmV0dXJuIG5ldyBVSU1hbmFnZXIocGxheWVyLCBbe1xuICAgICAgdWk6IGxlZ2FjeUFkc1VJKCksXG4gICAgICBjb25kaXRpb246IChjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQuaXNBZFdpdGhVSTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB1aTogbGVnYWN5VUkoKVxuICAgIH1dLCBjb25maWcpO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTGVnYWN5Q2FzdFJlY2VpdmVyVUkocGxheWVyOiBQbGF5ZXIsIGNvbmZpZzogVUlDb25maWcgPSB7fSk6IFVJTWFuYWdlciB7XG4gICAgcmV0dXJuIG5ldyBVSU1hbmFnZXIocGxheWVyLCBsZWdhY3lDYXN0UmVjZWl2ZXJVSSgpLCBjb25maWcpO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTGVnYWN5VGVzdFVJKHBsYXllcjogUGxheWVyLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgbGVnYWN5VGVzdFVJKCksIGNvbmZpZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZWVrUHJldmlld0FyZ3MgZXh0ZW5kcyBOb0FyZ3Mge1xuICAvKipcbiAgICogVGhlIHRpbWVsaW5lIHBvc2l0aW9uIGluIHBlcmNlbnQgd2hlcmUgdGhlIGV2ZW50IG9yaWdpbmF0ZXMgZnJvbS5cbiAgICovXG4gIHBvc2l0aW9uOiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgdGltZWxpbmUgbWFya2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBwb3NpdGlvbiwgaWYgZXhpc3RpbmcuXG4gICAqL1xuICBtYXJrZXI/OiBUaW1lbGluZU1hcmtlcjtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgZnVuY3Rpb25hbGl0eSB0byBtYW5hZ2UgYSBVSSBpbnN0YW5jZS4gVXNlZCBieSB0aGUge0BsaW5rIFVJTWFuYWdlcn0gdG8gbWFuYWdlIG11bHRpcGxlIFVJIGluc3RhbmNlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFVJSW5zdGFuY2VNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBwbGF5ZXJXcmFwcGVyOiBQbGF5ZXJXcmFwcGVyO1xuICBwcml2YXRlIHVpOiBVSUNvbnRhaW5lcjtcbiAgcHJpdmF0ZSBjb25maWc6IFVJQ29uZmlnO1xuXG4gIHByaXZhdGUgZXZlbnRzID0ge1xuICAgIG9uQ29uZmlndXJlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxVSUNvbnRhaW5lciwgTm9BcmdzPigpLFxuICAgIG9uU2VlazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBOb0FyZ3M+KCksXG4gICAgb25TZWVrUHJldmlldzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBTZWVrUHJldmlld0FyZ3M+KCksXG4gICAgb25TZWVrZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPigpLFxuICAgIG9uQ29tcG9uZW50U2hvdzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uQ29tcG9uZW50SGlkZTogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uQ29udHJvbHNTaG93OiBuZXcgRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+KCksXG4gICAgb25QcmV2aWV3Q29udHJvbHNIaWRlOiBuZXcgRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBDYW5jZWxFdmVudEFyZ3M+KCksXG4gICAgb25Db250cm9sc0hpZGU6IG5ldyBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4oKSxcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllciwgdWk6IFVJQ29udGFpbmVyLCBjb25maWc6IFVJQ29uZmlnID0ge30pIHtcbiAgICB0aGlzLnBsYXllcldyYXBwZXIgPSBuZXcgUGxheWVyV3JhcHBlcihwbGF5ZXIpO1xuICAgIHRoaXMudWkgPSB1aTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgfVxuXG4gIGdldENvbmZpZygpOiBVSUNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICB9XG5cbiAgZ2V0VUkoKTogVUlDb250YWluZXIge1xuICAgIHJldHVybiB0aGlzLnVpO1xuICB9XG5cbiAgZ2V0UGxheWVyKCk6IFBsYXllciB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB3aGVuIHRoZSBVSSBpcyBmdWxseSBjb25maWd1cmVkIGFuZCBhZGRlZCB0byB0aGUgRE9NLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uQ29uZmlndXJlZCgpOiBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbmZpZ3VyZWQ7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiBhIHNlZWsgc3RhcnRzLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uU2VlaygpOiBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9uU2VlaztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB3aGVuIHRoZSBzZWVrIHRpbWVsaW5lIGlzIHNjcnViYmVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uU2Vla1ByZXZpZXcoKTogRXZlbnREaXNwYXRjaGVyPFNlZWtCYXIsIFNlZWtQcmV2aWV3QXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vblNlZWtQcmV2aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gYSBzZWVrIGlzIGZpbmlzaGVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uU2Vla2VkKCk6IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25TZWVrZWQ7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiBhIGNvbXBvbmVudCBpcyBzaG93aW5nLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uQ29tcG9uZW50U2hvdygpOiBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbXBvbmVudFNob3c7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiBhIGNvbXBvbmVudCBpcyBoaWRpbmcuXG4gICAqIEByZXR1cm5zIHtFdmVudERpc3BhdGNoZXJ9XG4gICAqL1xuICBnZXQgb25Db21wb25lbnRIaWRlKCk6IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9uQ29tcG9uZW50SGlkZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB3aGVuIHRoZSBVSSBjb250cm9scyBhcmUgc2hvd2luZy5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvbkNvbnRyb2xzU2hvdygpOiBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbnRyb2xzU2hvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyBiZWZvcmUgdGhlIFVJIGNvbnRyb2xzIGFyZSBoaWRpbmcgdG8gY2hlY2sgaWYgdGhleSBhcmUgYWxsb3dlZCB0byBoaWRlLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uUHJldmlld0NvbnRyb2xzSGlkZSgpOiBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIENhbmNlbEV2ZW50QXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vblByZXZpZXdDb250cm9sc0hpZGU7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiB0aGUgVUkgY29udHJvbHMgYXJlIGhpZGluZy5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvbkNvbnRyb2xzSGlkZSgpOiBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbnRyb2xzSGlkZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjbGVhckV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XG4gICAgdGhpcy5wbGF5ZXJXcmFwcGVyLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuXG4gICAgbGV0IGV2ZW50cyA9IDxhbnk+dGhpcy5ldmVudHM7IC8vIGF2b2lkIFRTNzAxN1xuICAgIGZvciAobGV0IGV2ZW50IGluIGV2ZW50cykge1xuICAgICAgbGV0IGRpc3BhdGNoZXIgPSA8RXZlbnREaXNwYXRjaGVyPE9iamVjdCwgT2JqZWN0Pj5ldmVudHNbZXZlbnRdO1xuICAgICAgZGlzcGF0Y2hlci51bnN1YnNjcmliZUFsbCgpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV4dGVuZHMgdGhlIHtAbGluayBVSUluc3RhbmNlTWFuYWdlcn0gZm9yIGludGVybmFsIHVzZSBpbiB0aGUge0BsaW5rIFVJTWFuYWdlcn0gYW5kIHByb3ZpZGVzIGFjY2VzcyB0byBmdW5jdGlvbmFsaXR5XG4gKiB0aGF0IGNvbXBvbmVudHMgcmVjZWl2aW5nIGEgcmVmZXJlbmNlIHRvIHRoZSB7QGxpbmsgVUlJbnN0YW5jZU1hbmFnZXJ9IHNob3VsZCBub3QgaGF2ZSBhY2Nlc3MgdG8uXG4gKi9cbmNsYXNzIEludGVybmFsVUlJbnN0YW5jZU1hbmFnZXIgZXh0ZW5kcyBVSUluc3RhbmNlTWFuYWdlciB7XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVkOiBib29sZWFuO1xuICBwcml2YXRlIHJlbGVhc2VkOiBib29sZWFuO1xuXG4gIGdldFdyYXBwZWRQbGF5ZXIoKTogV3JhcHBlZFBsYXllciB7XG4gICAgLy8gVE9ETyBmaW5kIGEgbm9uLWhhY2t5IHdheSB0byBwcm92aWRlIHRoZSBXcmFwcGVkUGxheWVyIHRvIHRoZSBVSU1hbmFnZXIgd2l0aG91dCBleHBvcnRpbmcgaXRcbiAgICAvLyBnZXRQbGF5ZXIoKSBhY3R1YWxseSByZXR1cm5zIHRoZSBXcmFwcGVkUGxheWVyIGJ1dCBpdHMgcmV0dXJuIHR5cGUgaXMgc2V0IHRvIFBsYXllciBzbyB0aGUgV3JhcHBlZFBsYXllciBkb2VzXG4gICAgLy8gbm90IG5lZWQgdG8gYmUgZXhwb3J0ZWRcbiAgICByZXR1cm4gPFdyYXBwZWRQbGF5ZXI+dGhpcy5nZXRQbGF5ZXIoKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZUNvbnRyb2xzKCk6IHZvaWQge1xuICAgIHRoaXMuY29uZmlndXJlQ29udHJvbHNUcmVlKHRoaXMuZ2V0VUkoKSk7XG4gICAgdGhpcy5jb25maWd1cmVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlzQ29uZmlndXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVDb250cm9sc1RyZWUoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPikge1xuICAgIGxldCBjb25maWd1cmVkQ29tcG9uZW50czogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz5bXSA9IFtdO1xuXG4gICAgVUlVdGlscy50cmF2ZXJzZVRyZWUoY29tcG9uZW50LCAoY29tcG9uZW50KSA9PiB7XG4gICAgICAvLyBGaXJzdCwgY2hlY2sgaWYgd2UgaGF2ZSBhbHJlYWR5IGNvbmZpZ3VyZWQgYSBjb21wb25lbnQsIGFuZCB0aHJvdyBhbiBlcnJvciBpZiB3ZSBkaWQuIE11bHRpcGxlIGNvbmZpZ3VyYXRpb25cbiAgICAgIC8vIG9mIHRoZSBzYW1lIGNvbXBvbmVudCBsZWFkcyB0byB1bmV4cGVjdGVkIFVJIGJlaGF2aW9yLiBBbHNvLCBhIGNvbXBvbmVudCB0aGF0IGlzIGluIHRoZSBVSSB0cmVlIG11bHRpcGxlXG4gICAgICAvLyB0aW1lcyBoaW50cyBhdCBhIHdyb25nIFVJIHN0cnVjdHVyZS5cbiAgICAgIC8vIFdlIGNvdWxkIGp1c3Qgc2tpcCBjb25maWd1cmF0aW9uIGluIHN1Y2ggYSBjYXNlIGFuZCBub3QgdGhyb3cgYW4gZXhjZXB0aW9uLCBidXQgZW5mb3JjaW5nIGEgY2xlYW4gVUkgdHJlZVxuICAgICAgLy8gc2VlbXMgbGlrZSB0aGUgYmV0dGVyIGNob2ljZS5cbiAgICAgIGZvciAobGV0IGNvbmZpZ3VyZWRDb21wb25lbnQgb2YgY29uZmlndXJlZENvbXBvbmVudHMpIHtcbiAgICAgICAgaWYgKGNvbmZpZ3VyZWRDb21wb25lbnQgPT09IGNvbXBvbmVudCkge1xuICAgICAgICAgIC8vIFdyaXRlIHRoZSBjb21wb25lbnQgdG8gdGhlIGNvbnNvbGUgdG8gc2ltcGxpZnkgaWRlbnRpZmljYXRpb24gb2YgdGhlIGN1bHByaXRcbiAgICAgICAgICAvLyAoZS5nLiBieSBpbnNwZWN0aW5nIHRoZSBjb25maWcpXG4gICAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBpbiBVSSB0cmVlJywgY29tcG9uZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBZGRpdGlvbmFsbHkgdGhyb3cgYW4gZXJyb3IsIGJlY2F1c2UgdGhpcyBjYXNlIG11c3Qgbm90IGhhcHBlbiBhbmQgbGVhZHMgdG8gdW5leHBlY3RlZCBVSSBiZWhhdmlvci5cbiAgICAgICAgICB0aHJvdyBFcnJvcignQ2lyY3VsYXIgcmVmZXJlbmNlIGluIFVJIHRyZWU6ICcgKyBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50LmluaXRpYWxpemUoKTtcbiAgICAgIGNvbXBvbmVudC5jb25maWd1cmUodGhpcy5nZXRQbGF5ZXIoKSwgdGhpcyk7XG4gICAgICBjb25maWd1cmVkQ29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgfSk7XG4gIH1cblxuICByZWxlYXNlQ29udHJvbHMoKTogdm9pZCB7XG4gICAgLy8gRG8gbm90IGNhbGwgcmVsZWFzZSBtZXRob2RzIGlmIHRoZSBjb21wb25lbnRzIGhhdmUgbmV2ZXIgYmVlbiBjb25maWd1cmVkOyB0aGlzIGNhbiByZXN1bHQgaW4gZXhjZXB0aW9uc1xuICAgIGlmICh0aGlzLmNvbmZpZ3VyZWQpIHtcbiAgICAgIHRoaXMucmVsZWFzZUNvbnRyb2xzVHJlZSh0aGlzLmdldFVJKCkpO1xuICAgICAgdGhpcy5jb25maWd1cmVkID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMucmVsZWFzZWQgPSB0cnVlO1xuICB9XG5cbiAgaXNSZWxlYXNlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yZWxlYXNlZDtcbiAgfVxuXG4gIHByaXZhdGUgcmVsZWFzZUNvbnRyb2xzVHJlZShjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSB7XG4gICAgY29tcG9uZW50LnJlbGVhc2UoKTtcblxuICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb250YWluZXIpIHtcbiAgICAgIGZvciAobGV0IGNoaWxkQ29tcG9uZW50IG9mIGNvbXBvbmVudC5nZXRDb21wb25lbnRzKCkpIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlQ29udHJvbHNUcmVlKGNoaWxkQ29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbGVhckV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XG4gICAgc3VwZXIuY2xlYXJFdmVudEhhbmRsZXJzKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRlbmRlZCBpbnRlcmZhY2Ugb2YgdGhlIHtAbGluayBQbGF5ZXJ9IGZvciB1c2UgaW4gdGhlIFVJLlxuICovXG5pbnRlcmZhY2UgV3JhcHBlZFBsYXllciBleHRlbmRzIFBsYXllciB7XG4gIC8qKlxuICAgKiBGaXJlcyBhbiBldmVudCBvbiB0aGUgcGxheWVyIHRoYXQgdGFyZ2V0cyBhbGwgaGFuZGxlcnMgaW4gdGhlIFVJIGJ1dCBuZXZlciBlbnRlcnMgdGhlIHJlYWwgcGxheWVyLlxuICAgKiBAcGFyYW0gZXZlbnQgdGhlIGV2ZW50IHRvIGZpcmVcbiAgICogQHBhcmFtIGRhdGEgZGF0YSB0byBzZW5kIHdpdGggdGhlIGV2ZW50XG4gICAqL1xuICBmaXJlRXZlbnRJblVJKGV2ZW50OiBFVkVOVCwgZGF0YToge30pOiB2b2lkO1xufVxuXG4vKipcbiAqIFdyYXBzIHRoZSBwbGF5ZXIgdG8gdHJhY2sgZXZlbnQgaGFuZGxlcnMgYW5kIHByb3ZpZGUgYSBzaW1wbGUgbWV0aG9kIHRvIHJlbW92ZSBhbGwgcmVnaXN0ZXJlZCBldmVudFxuICogaGFuZGxlcnMgZnJvbSB0aGUgcGxheWVyLlxuICovXG5jbGFzcyBQbGF5ZXJXcmFwcGVyIHtcblxuICBwcml2YXRlIHBsYXllcjogUGxheWVyO1xuICBwcml2YXRlIHdyYXBwZXI6IFdyYXBwZWRQbGF5ZXI7XG5cbiAgcHJpdmF0ZSBldmVudEhhbmRsZXJzOiB7IFtldmVudFR5cGU6IHN0cmluZ106IFBsYXllckV2ZW50Q2FsbGJhY2tbXTsgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHBsYXllcjogUGxheWVyKSB7XG4gICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBwdWJsaWMgQVBJIG1ldGhvZHMgb2YgdGhlIHBsYXllclxuICAgIGxldCBtZXRob2RzID0gPGFueVtdPltdO1xuICAgIGZvciAobGV0IG1lbWJlciBpbiBwbGF5ZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgKDxhbnk+cGxheWVyKVttZW1iZXJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1ldGhvZHMucHVzaChtZW1iZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSB3cmFwcGVyIG9iamVjdCBhbmQgYWRkIGZ1bmN0aW9uIHdyYXBwZXJzIGZvciBhbGwgQVBJIG1ldGhvZHMgdGhhdCBkbyBub3RoaW5nIGJ1dCBjYWxsaW5nIHRoZSBiYXNlIG1ldGhvZFxuICAgIC8vIG9uIHRoZSBwbGF5ZXJcbiAgICBsZXQgd3JhcHBlciA9IDxhbnk+e307XG4gICAgZm9yIChsZXQgbWVtYmVyIG9mIG1ldGhvZHMpIHtcbiAgICAgIHdyYXBwZXJbbWVtYmVyXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxlZCAnICsgbWVtYmVyKTsgLy8gdHJhY2sgbWV0aG9kIGNhbGxzIG9uIHRoZSBwbGF5ZXJcbiAgICAgICAgcmV0dXJuICg8YW55PnBsYXllcilbbWVtYmVyXS5hcHBseShwbGF5ZXIsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIENvbGxlY3QgYWxsIHB1YmxpYyBwcm9wZXJ0aWVzIG9mIHRoZSBwbGF5ZXIgYW5kIGFkZCBpdCB0byB0aGUgd3JhcHBlclxuICAgIGZvciAobGV0IG1lbWJlciBpbiBwbGF5ZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgKDxhbnk+cGxheWVyKVttZW1iZXJdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHdyYXBwZXJbbWVtYmVyXSA9ICg8YW55PnBsYXllcilbbWVtYmVyXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeHBsaWNpdGx5IGFkZCBhIHdyYXBwZXIgbWV0aG9kIGZvciAnYWRkRXZlbnRIYW5kbGVyJyB0aGF0IGFkZHMgYWRkZWQgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGV2ZW50IGxpc3RcbiAgICB3cmFwcGVyLmFkZEV2ZW50SGFuZGxlciA9IChldmVudFR5cGU6IEVWRU5ULCBjYWxsYmFjazogUGxheWVyRXZlbnRDYWxsYmFjaykgPT4ge1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihldmVudFR5cGUsIGNhbGxiYWNrKTtcblxuICAgICAgaWYgKCF0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSkge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSA9IFtdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXS5wdXNoKGNhbGxiYWNrKTtcblxuICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfTtcblxuICAgIC8vIEV4cGxpY2l0bHkgYWRkIGEgd3JhcHBlciBtZXRob2QgZm9yICdyZW1vdmVFdmVudEhhbmRsZXInIHRoYXQgcmVtb3ZlcyByZW1vdmVkIGV2ZW50IGhhbmRsZXJzIGZyb20gdGhlIGV2ZW50IGxpc3RcbiAgICB3cmFwcGVyLnJlbW92ZUV2ZW50SGFuZGxlciA9IChldmVudFR5cGU6IEVWRU5ULCBjYWxsYmFjazogUGxheWVyRXZlbnRDYWxsYmFjaykgPT4ge1xuICAgICAgcGxheWVyLnJlbW92ZUV2ZW50SGFuZGxlcihldmVudFR5cGUsIGNhbGxiYWNrKTtcblxuICAgICAgaWYgKHRoaXMuZXZlbnRIYW5kbGVyc1tldmVudFR5cGVdKSB7XG4gICAgICAgIEFycmF5VXRpbHMucmVtb3ZlKHRoaXMuZXZlbnRIYW5kbGVyc1tldmVudFR5cGVdLCBjYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH07XG5cbiAgICB3cmFwcGVyLmZpcmVFdmVudEluVUkgPSAoZXZlbnQ6IEVWRU5ULCBkYXRhOiB7fSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZXZlbnRIYW5kbGVyc1tldmVudF0pIHsgLy8gY2hlY2sgaWYgdGhlcmUgYXJlIGhhbmRsZXJzIGZvciB0aGlzIGV2ZW50IHJlZ2lzdGVyZWRcbiAgICAgICAgLy8gRXh0ZW5kIHRoZSBkYXRhIG9iamVjdCB3aXRoIGRlZmF1bHQgdmFsdWVzIHRvIGNvbnZlcnQgaXQgdG8gYSB7QGxpbmsgUGxheWVyRXZlbnR9IG9iamVjdC5cbiAgICAgICAgbGV0IHBsYXllckV2ZW50RGF0YSA9IDxQbGF5ZXJFdmVudD5PYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgIHR5cGU6IGV2ZW50LFxuICAgICAgICAgIC8vIEFkZCBhIG1hcmtlciBwcm9wZXJ0eSBzbyB0aGUgVUkgY2FuIGRldGVjdCBVSS1pbnRlcm5hbCBwbGF5ZXIgZXZlbnRzXG4gICAgICAgICAgdWlTb3VyY2VkOiB0cnVlLFxuICAgICAgICB9LCBkYXRhKTtcblxuICAgICAgICAvLyBFeGVjdXRlIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrc1xuICAgICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRdKSB7XG4gICAgICAgICAgY2FsbGJhY2socGxheWVyRXZlbnREYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLndyYXBwZXIgPSA8V3JhcHBlZFBsYXllcj53cmFwcGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB3cmFwcGVkIHBsYXllciBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCBvbiBwbGFjZSBvZiB0aGUgbm9ybWFsIHBsYXllciBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtXcmFwcGVkUGxheWVyfSBhIHdyYXBwZWQgcGxheWVyXG4gICAqL1xuICBnZXRQbGF5ZXIoKTogV3JhcHBlZFBsYXllciB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIHJlZ2lzdGVyZWQgZXZlbnQgaGFuZGxlcnMgZnJvbSB0aGUgcGxheWVyIHRoYXQgd2VyZSBhZGRlZCB0aHJvdWdoIHRoZSB3cmFwcGVkIHBsYXllci5cbiAgICovXG4gIGNsZWFyRXZlbnRIYW5kbGVycygpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBldmVudFR5cGUgaW4gdGhpcy5ldmVudEhhbmRsZXJzKSB7XG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSkge1xuICAgICAgICB0aGlzLnBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgRXZlbnQsIE5vQXJnc30gZnJvbSAnLi9ldmVudGRpc3BhdGNoZXInO1xuaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnRzL2NvbXBvbmVudCc7XG5pbXBvcnQge0NvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcic7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQXJyYXlVdGlscyB7XG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSBhbiBhcnJheS5cbiAgICogQHBhcmFtIGFycmF5IHRoZSBhcnJheSB0aGF0IG1heSBjb250YWluIHRoZSBpdGVtIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gaXRlbSB0aGUgaXRlbSB0byByZW1vdmUgZnJvbSB0aGUgYXJyYXlcbiAgICogQHJldHVybnMge2FueX0gdGhlIHJlbW92ZWQgaXRlbSBvciBudWxsIGlmIGl0IHdhc24ndCBwYXJ0IG9mIHRoZSBhcnJheVxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZTxUPihhcnJheTogVFtdLCBpdGVtOiBUKTogVCB8IG51bGwge1xuICAgIGxldCBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgcmV0dXJuIGFycmF5LnNwbGljZShpbmRleCwgMSlbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIFN0cmluZ1V0aWxzIHtcblxuICBleHBvcnQgbGV0IEZPUk1BVF9ISE1NU1M6IHN0cmluZyA9ICdoaDptbTpzcyc7XG4gIGV4cG9ydCBsZXQgRk9STUFUX01NU1M6IHN0cmluZyA9ICdtbTpzcyc7XG5cbiAgLyoqXG4gICAqIEZvcm1hdHMgYSBudW1iZXIgb2Ygc2Vjb25kcyBpbnRvIGEgdGltZSBzdHJpbmcgd2l0aCB0aGUgcGF0dGVybiBoaDptbTpzcy5cbiAgICpcbiAgICogQHBhcmFtIHRvdGFsU2Vjb25kcyB0aGUgdG90YWwgbnVtYmVyIG9mIHNlY29uZHMgdG8gZm9ybWF0IHRvIHN0cmluZ1xuICAgKiBAcGFyYW0gZm9ybWF0IHRoZSB0aW1lIGZvcm1hdCB0byBvdXRwdXQgKGRlZmF1bHQ6IGhoOm1tOnNzKVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZm9ybWF0dGVkIHRpbWUgc3RyaW5nXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gc2Vjb25kc1RvVGltZSh0b3RhbFNlY29uZHM6IG51bWJlciwgZm9ybWF0OiBzdHJpbmcgPSBGT1JNQVRfSEhNTVNTKTogc3RyaW5nIHtcbiAgICBsZXQgaXNOZWdhdGl2ZSA9IHRvdGFsU2Vjb25kcyA8IDA7XG5cbiAgICBpZiAoaXNOZWdhdGl2ZSkge1xuICAgICAgLy8gSWYgdGhlIHRpbWUgaXMgbmVnYXRpdmUsIHdlIG1ha2UgaXQgcG9zaXRpdmUgZm9yIHRoZSBjYWxjdWxhdGlvbiBiZWxvd1xuICAgICAgLy8gKGVsc2Ugd2UnZCBnZXQgYWxsIG5lZ2F0aXZlIG51bWJlcnMpIGFuZCByZWF0dGFjaCB0aGUgbmVnYXRpdmUgc2lnbiBsYXRlci5cbiAgICAgIHRvdGFsU2Vjb25kcyA9IC10b3RhbFNlY29uZHM7XG4gICAgfVxuXG4gICAgLy8gU3BsaXQgaW50byBzZXBhcmF0ZSB0aW1lIHBhcnRzXG4gICAgbGV0IGhvdXJzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyAzNjAwKTtcbiAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApIC0gaG91cnMgKiA2MDtcbiAgICBsZXQgc2Vjb25kcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzKSAlIDYwO1xuXG4gICAgcmV0dXJuIChpc05lZ2F0aXZlID8gJy0nIDogJycpICsgZm9ybWF0XG4gICAgICAgIC5yZXBsYWNlKCdoaCcsIGxlZnRQYWRXaXRoWmVyb3MoaG91cnMsIDIpKVxuICAgICAgICAucmVwbGFjZSgnbW0nLCBsZWZ0UGFkV2l0aFplcm9zKG1pbnV0ZXMsIDIpKVxuICAgICAgICAucmVwbGFjZSgnc3MnLCBsZWZ0UGFkV2l0aFplcm9zKHNlY29uZHMsIDIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG51bWJlciB0byBhIHN0cmluZyBhbmQgbGVmdC1wYWRzIGl0IHdpdGggemVyb3MgdG8gdGhlIHNwZWNpZmllZCBsZW5ndGguXG4gICAqIEV4YW1wbGU6IGxlZnRQYWRXaXRoWmVyb3MoMTIzLCA1KSA9PiAnMDAxMjMnXG4gICAqXG4gICAqIEBwYXJhbSBudW0gdGhlIG51bWJlciB0byBjb252ZXJ0IHRvIHN0cmluZyBhbmQgcGFkIHdpdGggemVyb3NcbiAgICogQHBhcmFtIGxlbmd0aCB0aGUgZGVzaXJlZCBsZW5ndGggb2YgdGhlIHBhZGRlZCBzdHJpbmdcbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHBhZGRlZCBudW1iZXIgYXMgc3RyaW5nXG4gICAqL1xuICBmdW5jdGlvbiBsZWZ0UGFkV2l0aFplcm9zKG51bTogbnVtYmVyIHwgc3RyaW5nLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgbGV0IHRleHQgPSBudW0gKyAnJztcbiAgICBsZXQgcGFkZGluZyA9ICcwMDAwMDAwMDAwJy5zdWJzdHIoMCwgbGVuZ3RoIC0gdGV4dC5sZW5ndGgpO1xuICAgIHJldHVybiBwYWRkaW5nICsgdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxscyBvdXQgcGxhY2Vob2xkZXJzIGluIGFuIGFkIG1lc3NhZ2UuXG4gICAqXG4gICAqIEhhcyB0aGUgcGxhY2Vob2xkZXJzICd7cmVtYWluaW5nVGltZVtmb3JtYXRTdHJpbmddfScsICd7cGxheWVkVGltZVtmb3JtYXRTdHJpbmddfScgYW5kXG4gICAqICd7YWREdXJhdGlvbltmb3JtYXRTdHJpbmddfScsIHdoaWNoIGFyZSByZXBsYWNlZCBieSB0aGUgcmVtYWluaW5nIHRpbWUgdW50aWwgdGhlIGFkIGNhbiBiZSBza2lwcGVkLCB0aGUgY3VycmVudFxuICAgKiB0aW1lIG9yIHRoZSBhZCBkdXJhdGlvbi4gVGhlIGZvcm1hdCBzdHJpbmcgaXMgb3B0aW9uYWwuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBwbGFjZWhvbGRlciBpcyByZXBsYWNlZCBieSB0aGUgdGltZVxuICAgKiBpbiBzZWNvbmRzLiBJZiBzcGVjaWZpZWQsIGl0IG11c3QgYmUgb2YgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAqIC0gJWQgLSBJbnNlcnRzIHRoZSB0aW1lIGFzIGFuIGludGVnZXIuXG4gICAqIC0gJTBOZCAtIEluc2VydHMgdGhlIHRpbWUgYXMgYW4gaW50ZWdlciB3aXRoIGxlYWRpbmcgemVyb2VzLCBpZiB0aGUgbGVuZ3RoIG9mIHRoZSB0aW1lIHN0cmluZyBpcyBzbWFsbGVyIHRoYW4gTi5cbiAgICogLSAlZiAtIEluc2VydHMgdGhlIHRpbWUgYXMgYSBmbG9hdC5cbiAgICogLSAlME5mIC0gSW5zZXJ0cyB0aGUgdGltZSBhcyBhIGZsb2F0IHdpdGggbGVhZGluZyB6ZXJvZXMuXG4gICAqIC0gJS5NZiAtIEluc2VydHMgdGhlIHRpbWUgYXMgYSBmbG9hdCB3aXRoIE0gZGVjaW1hbCBwbGFjZXMuIENhbiBiZSBjb21iaW5lZCB3aXRoICUwTmYsIGUuZy4gJTA0LjJmICh0aGUgdGltZVxuICAgKiAxMC4xMjNcbiAgICogd291bGQgYmUgcHJpbnRlZCBhcyAwMDEwLjEyKS5cbiAgICogLSAlaGg6bW06c3NcbiAgICogLSAlbW06c3NcbiAgICpcbiAgICogQHBhcmFtIGFkTWVzc2FnZSBhbiBhZCBtZXNzYWdlIHdpdGggb3B0aW9uYWwgcGxhY2Vob2xkZXJzIHRvIGZpbGxcbiAgICogQHBhcmFtIHNraXBPZmZzZXQgaWYgc3BlY2lmaWVkLCB7cmVtYWluaW5nVGltZX0gd2lsbCBiZSBmaWxsZWQgd2l0aCB0aGUgcmVtYWluaW5nIHRpbWUgdW50aWwgdGhlIGFkIGNhbiBiZSBza2lwcGVkXG4gICAqIEBwYXJhbSBwbGF5ZXIgdGhlIHBsYXllciB0byBnZXQgdGhlIHRpbWUgZGF0YSBmcm9tXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBhZCBtZXNzYWdlIHdpdGggZmlsbGVkIHBsYWNlaG9sZGVyc1xuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VBZE1lc3NhZ2VQbGFjZWhvbGRlcnMoYWRNZXNzYWdlOiBzdHJpbmcsIHNraXBPZmZzZXQ6IG51bWJlciwgcGxheWVyOiBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyKSB7XG4gICAgbGV0IGFkTWVzc2FnZVBsYWNlaG9sZGVyUmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgJ1xcXFx7KHJlbWFpbmluZ1RpbWV8cGxheWVkVGltZXxhZER1cmF0aW9uKSh9fCUoKDBbMS05XVxcXFxkKihcXFxcLlxcXFxkKyhkfGYpfGR8Zil8XFxcXC5cXFxcZCtmfGR8Zil8aGg6bW06c3N8bW06c3MpfSknLFxuICAgICAgJ2cnXG4gICAgKTtcblxuICAgIHJldHVybiBhZE1lc3NhZ2UucmVwbGFjZShhZE1lc3NhZ2VQbGFjZWhvbGRlclJlZ2V4LCAoZm9ybWF0U3RyaW5nKSA9PiB7XG4gICAgICBsZXQgdGltZSA9IDA7XG4gICAgICBpZiAoZm9ybWF0U3RyaW5nLmluZGV4T2YoJ3JlbWFpbmluZ1RpbWUnKSA+IC0xKSB7XG4gICAgICAgIGlmIChza2lwT2Zmc2V0KSB7XG4gICAgICAgICAgdGltZSA9IE1hdGguY2VpbChza2lwT2Zmc2V0IC0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpbWUgPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAtIHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGZvcm1hdFN0cmluZy5pbmRleE9mKCdwbGF5ZWRUaW1lJykgPiAtMSkge1xuICAgICAgICB0aW1lID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICB9IGVsc2UgaWYgKGZvcm1hdFN0cmluZy5pbmRleE9mKCdhZER1cmF0aW9uJykgPiAtMSkge1xuICAgICAgICB0aW1lID0gcGxheWVyLmdldER1cmF0aW9uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZm9ybWF0TnVtYmVyKHRpbWUsIGZvcm1hdFN0cmluZyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXROdW1iZXIodGltZTogbnVtYmVyLCBmb3JtYXQ6IHN0cmluZykge1xuICAgIGxldCBmb3JtYXRTdHJpbmdWYWxpZGF0aW9uUmVnZXggPSAvJSgoMFsxLTldXFxkKihcXC5cXGQrKGR8Zil8ZHxmKXxcXC5cXGQrZnxkfGYpfGhoOm1tOnNzfG1tOnNzKS87XG4gICAgbGV0IGxlYWRpbmdaZXJvZXNSZWdleCA9IC8oJTBbMS05XVxcZCopKD89KFxcLlxcZCtmfGZ8ZCkpLztcbiAgICBsZXQgZGVjaW1hbFBsYWNlc1JlZ2V4ID0gL1xcLlxcZCooPz1mKS87XG5cbiAgICBpZiAoIWZvcm1hdFN0cmluZ1ZhbGlkYXRpb25SZWdleC50ZXN0KGZvcm1hdCkpIHtcbiAgICAgIC8vIElmIHRoZSBmb3JtYXQgaXMgaW52YWxpZCwgd2Ugc2V0IGEgZGVmYXVsdCBmYWxsYmFjayBmb3JtYXRcbiAgICAgIGZvcm1hdCA9ICclZCc7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgbGVhZGluZyB6ZXJvc1xuICAgIGxldCBsZWFkaW5nWmVyb2VzID0gMDtcbiAgICBsZXQgbGVhZGluZ1plcm9lc01hdGNoZXMgPSBmb3JtYXQubWF0Y2gobGVhZGluZ1plcm9lc1JlZ2V4KTtcbiAgICBpZiAobGVhZGluZ1plcm9lc01hdGNoZXMpIHtcbiAgICAgIGxlYWRpbmdaZXJvZXMgPSBwYXJzZUludChsZWFkaW5nWmVyb2VzTWF0Y2hlc1swXS5zdWJzdHJpbmcoMikpO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gICAgbGV0IG51bURlY2ltYWxQbGFjZXMgPSBudWxsO1xuICAgIGxldCBkZWNpbWFsUGxhY2VzTWF0Y2hlcyA9IGZvcm1hdC5tYXRjaChkZWNpbWFsUGxhY2VzUmVnZXgpO1xuICAgIGlmIChkZWNpbWFsUGxhY2VzTWF0Y2hlcyAmJiAhaXNOYU4ocGFyc2VJbnQoZGVjaW1hbFBsYWNlc01hdGNoZXNbMF0uc3Vic3RyaW5nKDEpKSkpIHtcbiAgICAgIG51bURlY2ltYWxQbGFjZXMgPSBwYXJzZUludChkZWNpbWFsUGxhY2VzTWF0Y2hlc1swXS5zdWJzdHJpbmcoMSkpO1xuICAgICAgaWYgKG51bURlY2ltYWxQbGFjZXMgPiAyMCkge1xuICAgICAgICBudW1EZWNpbWFsUGxhY2VzID0gMjA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRmxvYXQgZm9ybWF0XG4gICAgaWYgKGZvcm1hdC5pbmRleE9mKCdmJykgPiAtMSkge1xuICAgICAgbGV0IHRpbWVTdHJpbmcgPSAnJztcblxuICAgICAgaWYgKG51bURlY2ltYWxQbGFjZXMgIT09IG51bGwpIHtcbiAgICAgICAgLy8gQXBwbHkgZml4ZWQgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gICAgICAgIHRpbWVTdHJpbmcgPSB0aW1lLnRvRml4ZWQobnVtRGVjaW1hbFBsYWNlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lU3RyaW5nID0gJycgKyB0aW1lO1xuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBsZWFkaW5nIHplcm9zXG4gICAgICBpZiAodGltZVN0cmluZy5pbmRleE9mKCcuJykgPiAtMSkge1xuICAgICAgICByZXR1cm4gbGVmdFBhZFdpdGhaZXJvcyh0aW1lU3RyaW5nLCB0aW1lU3RyaW5nLmxlbmd0aCArIChsZWFkaW5nWmVyb2VzIC0gdGltZVN0cmluZy5pbmRleE9mKCcuJykpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKHRpbWVTdHJpbmcsIGxlYWRpbmdaZXJvZXMpO1xuICAgICAgfVxuXG4gICAgfVxuICAgIC8vIFRpbWUgZm9ybWF0XG4gICAgZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICBsZXQgdG90YWxTZWNvbmRzID0gTWF0aC5jZWlsKHRpbWUpO1xuXG4gICAgICAvLyBoaDptbTpzcyBmb3JtYXRcbiAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignaGgnKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBzZWNvbmRzVG9UaW1lKHRvdGFsU2Vjb25kcyk7XG4gICAgICB9XG4gICAgICAvLyBtbTpzcyBmb3JtYXRcbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApO1xuICAgICAgICBsZXQgc2Vjb25kcyA9IHRvdGFsU2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKG1pbnV0ZXMsIDIpICsgJzonICsgbGVmdFBhZFdpdGhaZXJvcyhzZWNvbmRzLCAyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSW50ZWdlciBmb3JtYXRcbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKE1hdGguY2VpbCh0aW1lKSwgbGVhZGluZ1plcm9lcyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgUGxheWVyVXRpbHMge1xuXG4gIGltcG9ydCBQbGF5ZXIgPSBiaXRtb3Zpbi5wbGF5ZXIuUGxheWVyO1xuXG4gIGV4cG9ydCBlbnVtIFBsYXllclN0YXRlIHtcbiAgICBJRExFLFxuICAgIFBSRVBBUkVELFxuICAgIFBMQVlJTkcsXG4gICAgUEFVU0VELFxuICAgIEZJTklTSEVELFxuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGlzU291cmNlTG9hZGVkKHBsYXllcjogUGxheWVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpc1RpbWVTaGlmdEF2YWlsYWJsZShwbGF5ZXI6IFBsYXllcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBwbGF5ZXIuaXNMaXZlKCkgJiYgcGxheWVyLmdldE1heFRpbWVTaGlmdCgpICE9PSAwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRlKHBsYXllcjogUGxheWVyKTogUGxheWVyU3RhdGUge1xuICAgIGlmIChwbGF5ZXIuaGFzRW5kZWQoKSkge1xuICAgICAgcmV0dXJuIFBsYXllclN0YXRlLkZJTklTSEVEO1xuICAgIH0gZWxzZSBpZiAocGxheWVyLmlzUGxheWluZygpKSB7XG4gICAgICByZXR1cm4gUGxheWVyU3RhdGUuUExBWUlORztcbiAgICB9IGVsc2UgaWYgKHBsYXllci5pc1BhdXNlZCgpKSB7XG4gICAgICByZXR1cm4gUGxheWVyU3RhdGUuUEFVU0VEO1xuICAgIH0gZWxzZSBpZiAoaXNTb3VyY2VMb2FkZWQocGxheWVyKSkge1xuICAgICAgcmV0dXJuIFBsYXllclN0YXRlLlBSRVBBUkVEO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUGxheWVyU3RhdGUuSURMRTtcbiAgICB9XG4gIH1cblxuICBleHBvcnQgaW50ZXJmYWNlIFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzIGV4dGVuZHMgTm9BcmdzIHtcbiAgICB0aW1lU2hpZnRBdmFpbGFibGU6IGJvb2xlYW47XG4gIH1cblxuICBleHBvcnQgY2xhc3MgVGltZVNoaWZ0QXZhaWxhYmlsaXR5RGV0ZWN0b3Ige1xuXG4gICAgcHJpdmF0ZSB0aW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkRXZlbnQgPSBuZXcgRXZlbnREaXNwYXRjaGVyPFBsYXllciwgVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3M+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllcikge1xuICAgICAgbGV0IHRpbWVTaGlmdEF2YWlsYWJsZTogYm9vbGVhbiA9IHVuZGVmaW5lZDtcblxuICAgICAgbGV0IHRpbWVTaGlmdERldGVjdG9yID0gKCkgPT4ge1xuICAgICAgICBpZiAocGxheWVyLmlzTGl2ZSgpKSB7XG4gICAgICAgICAgbGV0IHRpbWVTaGlmdEF2YWlsYWJsZU5vdyA9IFBsYXllclV0aWxzLmlzVGltZVNoaWZ0QXZhaWxhYmxlKHBsYXllcik7XG5cbiAgICAgICAgICAvLyBXaGVuIHRoZSBhdmFpbGFiaWxpdHkgY2hhbmdlcywgd2UgZmlyZSB0aGUgZXZlbnRcbiAgICAgICAgICBpZiAodGltZVNoaWZ0QXZhaWxhYmxlTm93ICE9PSB0aW1lU2hpZnRBdmFpbGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMudGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEV2ZW50LmRpc3BhdGNoKHBsYXllciwgeyB0aW1lU2hpZnRBdmFpbGFibGU6IHRpbWVTaGlmdEF2YWlsYWJsZU5vdyB9KTtcbiAgICAgICAgICAgIHRpbWVTaGlmdEF2YWlsYWJsZSA9IHRpbWVTaGlmdEF2YWlsYWJsZU5vdztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAvLyBUcnkgdG8gZGV0ZWN0IHRpbWVzaGlmdCBhdmFpbGFiaWxpdHkgaW4gT05fUkVBRFksIHdoaWNoIHdvcmtzIGZvciBEQVNIIHN0cmVhbXNcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB0aW1lU2hpZnREZXRlY3Rvcik7XG4gICAgICAvLyBXaXRoIEhMUy9OYXRpdmVQbGF5ZXIgc3RyZWFtcywgZ2V0TWF4VGltZVNoaWZ0IGNhbiBiZSAwIGJlZm9yZSB0aGUgYnVmZmVyIGZpbGxzLCBzbyB3ZSBuZWVkIHRvIGFkZGl0aW9uYWxseVxuICAgICAgLy8gY2hlY2sgdGltZXNoaWZ0IGF2YWlsYWJpbGl0eSBpbiBPTl9USU1FX0NIQU5HRURcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgdGltZVNoaWZ0RGV0ZWN0b3IpO1xuICAgIH1cblxuICAgIGdldCBvblRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWQoKTogRXZlbnQ8UGxheWVyLCBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncz4ge1xuICAgICAgcmV0dXJuIHRoaXMudGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEV2ZW50LmdldEV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgZXhwb3J0IGludGVyZmFjZSBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MgZXh0ZW5kcyBOb0FyZ3Mge1xuICAgIGxpdmU6IGJvb2xlYW47XG4gIH1cblxuICAvKipcbiAgICogRGV0ZWN0cyBjaGFuZ2VzIG9mIHRoZSBzdHJlYW0gdHlwZSwgaS5lLiBjaGFuZ2VzIG9mIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIHBsYXllciNpc0xpdmUgbWV0aG9kLlxuICAgKiBOb3JtYWxseSwgYSBzdHJlYW0gY2Fubm90IGNoYW5nZSBpdHMgdHlwZSBkdXJpbmcgcGxheWJhY2ssIGl0J3MgZWl0aGVyIFZPRCBvciBsaXZlLiBEdWUgdG8gYnVncyBvbiBzb21lXG4gICAqIHBsYXRmb3JtcyBvciBicm93c2VycywgaXQgY2FuIHN0aWxsIGNoYW5nZS4gSXQgaXMgdGhlcmVmb3JlIHVucmVsaWFibGUgdG8ganVzdCBjaGVjayAjaXNMaXZlIGFuZCB0aGlzIGRldGVjdG9yXG4gICAqIHNob3VsZCBiZSB1c2VkIGFzIGEgd29ya2Fyb3VuZCBpbnN0ZWFkLlxuICAgKlxuICAgKiBLbm93biBjYXNlczpcbiAgICpcbiAgICogLSBITFMgVk9EIG9uIEFuZHJvaWQgNC4zXG4gICAqIFZpZGVvIGR1cmF0aW9uIGlzIGluaXRpYWxseSAnSW5maW5pdHknIGFuZCBvbmx5IGdldHMgYXZhaWxhYmxlIGFmdGVyIHBsYXliYWNrIHN0YXJ0cywgc28gc3RyZWFtcyBhcmUgd3JvbmdseVxuICAgKiByZXBvcnRlZCBhcyAnbGl2ZScgYmVmb3JlIHBsYXliYWNrICh0aGUgbGl2ZS1jaGVjayBpbiB0aGUgcGxheWVyIGNoZWNrcyBmb3IgaW5maW5pdGUgZHVyYXRpb24pLlxuICAgKi9cbiAgZXhwb3J0IGNsYXNzIExpdmVTdHJlYW1EZXRlY3RvciB7XG5cbiAgICBwcml2YXRlIGxpdmVDaGFuZ2VkRXZlbnQgPSBuZXcgRXZlbnREaXNwYXRjaGVyPFBsYXllciwgTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzPigpO1xuXG4gICAgY29uc3RydWN0b3IocGxheWVyOiBQbGF5ZXIpIHtcbiAgICAgIGxldCBsaXZlOiBib29sZWFuID0gdW5kZWZpbmVkO1xuXG4gICAgICBsZXQgbGl2ZURldGVjdG9yID0gKCkgPT4ge1xuICAgICAgICBsZXQgbGl2ZU5vdyA9IHBsYXllci5pc0xpdmUoKTtcblxuICAgICAgICAvLyBDb21wYXJlIGN1cnJlbnQgdG8gcHJldmlvdXMgbGl2ZSBzdGF0ZSBmbGFnIGFuZCBmaXJlIGV2ZW50IHdoZW4gaXQgY2hhbmdlcy4gU2luY2Ugd2UgaW5pdGlhbGl6ZSB0aGUgZmxhZ1xuICAgICAgICAvLyB3aXRoIHVuZGVmaW5lZCwgdGhlcmUgaXMgYWx3YXlzIGF0IGxlYXN0IGFuIGluaXRpYWwgZXZlbnQgZmlyZWQgdGhhdCB0ZWxscyBsaXN0ZW5lcnMgdGhlIGxpdmUgc3RhdGUuXG4gICAgICAgIGlmIChsaXZlTm93ICE9PSBsaXZlKSB7XG4gICAgICAgICAgdGhpcy5saXZlQ2hhbmdlZEV2ZW50LmRpc3BhdGNoKHBsYXllciwgeyBsaXZlOiBsaXZlTm93IH0pO1xuICAgICAgICAgIGxpdmUgPSBsaXZlTm93O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gSW5pdGlhbGl6ZSB3aGVuIHBsYXllciBpcyByZWFkeVxuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIGxpdmVEZXRlY3Rvcik7XG4gICAgICAvLyBSZS1ldmFsdWF0ZSB3aGVuIHBsYXliYWNrIHN0YXJ0c1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgbGl2ZURldGVjdG9yKTtcblxuICAgICAgLy8gSExTIGxpdmUgZGV0ZWN0aW9uIHdvcmthcm91bmQgZm9yIEFuZHJvaWQ6XG4gICAgICAvLyBBbHNvIHJlLWV2YWx1YXRlIGR1cmluZyBwbGF5YmFjaywgYmVjYXVzZSB0aGF0IGlzIHdoZW4gdGhlIGxpdmUgZmxhZyBtaWdodCBjaGFuZ2UuXG4gICAgICAvLyAoRG9pbmcgaXQgb25seSBpbiBBbmRyb2lkIENocm9tZSBzYXZlcyB1bm5lY2Vzc2FyeSBvdmVyaGVhZCBvbiBvdGhlciBwbGF0dGZvcm1zKVxuICAgICAgaWYgKEJyb3dzZXJVdGlscy5pc0FuZHJvaWQgJiYgQnJvd3NlclV0aWxzLmlzQ2hyb21lKSB7XG4gICAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgbGl2ZURldGVjdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgb25MaXZlQ2hhbmdlZCgpOiBFdmVudDxQbGF5ZXIsIExpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncz4ge1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZUNoYW5nZWRFdmVudC5nZXRFdmVudCgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIFVJVXRpbHMge1xuICBleHBvcnQgaW50ZXJmYWNlIFRyZWVUcmF2ZXJzYWxDYWxsYmFjayB7XG4gICAgKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIHBhcmVudD86IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KTogdm9pZDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB0cmF2ZXJzZVRyZWUoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgdmlzaXQ6IFRyZWVUcmF2ZXJzYWxDYWxsYmFjayk6IHZvaWQge1xuICAgIGxldCByZWN1cnNpdmVUcmVlV2Fsa2VyID0gKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIHBhcmVudD86IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSA9PiB7XG4gICAgICB2aXNpdChjb21wb25lbnQsIHBhcmVudCk7XG5cbiAgICAgIC8vIElmIHRoZSBjdXJyZW50IGNvbXBvbmVudCBpcyBhIGNvbnRhaW5lciwgdmlzaXQgaXQncyBjaGlsZHJlblxuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbnRhaW5lcikge1xuICAgICAgICBmb3IgKGxldCBjaGlsZENvbXBvbmVudCBvZiBjb21wb25lbnQuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICAgICAgcmVjdXJzaXZlVHJlZVdhbGtlcihjaGlsZENvbXBvbmVudCwgY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBXYWxrIGFuZCBjb25maWd1cmUgdGhlIGNvbXBvbmVudCB0cmVlXG4gICAgcmVjdXJzaXZlVHJlZVdhbGtlcihjb21wb25lbnQpO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQnJvd3NlclV0aWxzIHtcblxuICAvLyBpc01vYmlsZSBvbmx5IG5lZWRzIHRvIGJlIGV2YWx1YXRlZCBvbmNlIChpdCBjYW5ub3QgY2hhbmdlIGR1cmluZyBhIGJyb3dzZXIgc2Vzc2lvbilcbiAgLy8gTW9iaWxlIGRldGVjdGlvbiBhY2NvcmRpbmcgdG8gTW96aWxsYSByZWNvbW1lbmRhdGlvbjogXCJJbiBzdW1tYXJ5LCB3ZSByZWNvbW1lbmQgbG9va2luZyBmb3IgdGhlIHN0cmluZyDigJxNb2Jp4oCdXG4gIC8vIGFueXdoZXJlIGluIHRoZSBVc2VyIEFnZW50IHRvIGRldGVjdCBhIG1vYmlsZSBkZXZpY2UuXCJcbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9Ccm93c2VyX2RldGVjdGlvbl91c2luZ190aGVfdXNlcl9hZ2VudFxuICBleHBvcnQgY29uc3QgaXNNb2JpbGUgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvTW9iaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuICBleHBvcnQgY29uc3QgaXNDaHJvbWUgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvQ2hyb21lLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG4gIGV4cG9ydCBjb25zdCBpc0FuZHJvaWQgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbn0iXX0=
