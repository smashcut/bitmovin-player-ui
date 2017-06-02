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

},{"./clickoverlay":13}],2:[function(require,module,exports){
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

},{"../utils":58,"./label":25}],3:[function(require,module,exports){
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

},{"../utils":58,"./button":8}],4:[function(require,module,exports){
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
        if (!player.isAirplayAvailable) {
            // If the player does not support Airplay (player 7.0), we just hide this component and skip configuration
            this.hide();
            return;
        }
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

},{"./togglebutton":43}],5:[function(require,module,exports){
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
            _this.addItem('Auto', 'Auto');
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
            _this.selectItem(data.isAuto ? 'Auto' : data.id);
        });
        // Populate qualities at startup
        updateAudioQualities();
    };
    return AudioQualitySelectBox;
}(selectbox_1.SelectBox));
exports.AudioQualitySelectBox = AudioQualitySelectBox;

},{"./selectbox":36}],6:[function(require,module,exports){
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
        // TODO Move to config?
        var getAudioTrackLabel = function (id) {
            switch (id) {
                case 'en_stereo':
                    return 'English - Stereo';
                case 'no-voices_stereo':
                    return 'No Voices - Stereo';
                case 'en_surround':
                    return 'English - Surround';
                default:
                    return id;
            }
        };
        var updateAudioTracks = function () {
            var audioTracks = player.getAvailableAudio();
            _this.clearItems();
            // Add audio tracks
            for (var _i = 0, audioTracks_1 = audioTracks; _i < audioTracks_1.length; _i++) {
                var audioTrack = audioTracks_1[_i];
                _this.addItem(audioTrack.id, getAudioTrackLabel(audioTrack.label));
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
        // Update tracks when a track is added or removed (since player 7.1.4)
        if (player.EVENT.ON_AUDIO_ADDED && player.EVENT.ON_AUDIO_REMOVED) {
            player.addEventHandler(player.EVENT.ON_AUDIO_ADDED, updateAudioTracks);
            player.addEventHandler(player.EVENT.ON_AUDIO_REMOVED, updateAudioTracks);
        }
        // Populate tracks at startup
        updateAudioTracks();
        // When `playback.audioLanguage` is set, the `ON_AUDIO_CHANGED` event for that change is triggered before the
        // UI is created. Therefore we need to set the audio track on configure.
        audioTrackHandler();
    };
    return AudioTrackSelectBox;
}(selectbox_1.SelectBox));
exports.AudioTrackSelectBox = AudioTrackSelectBox;

},{"./selectbox":36}],7:[function(require,module,exports){
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

},{"../timeout":56,"./component":17,"./container":18}],8:[function(require,module,exports){
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

},{"../dom":52,"../eventdispatcher":53,"./component":17}],9:[function(require,module,exports){
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

},{"./container":18,"./label":25}],10:[function(require,module,exports){
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

},{"./togglebutton":43}],11:[function(require,module,exports){
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

},{"../timeout":56,"./uicontainer":45}],12:[function(require,module,exports){
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
        _this.checkboxEvents = {
            onClick: new eventdispatcher_1.EventDispatcher(),
            onChange: new eventdispatcher_1.EventDispatcher()
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
        // trigger the corresponding events on the button component
        this.getDomElement().on('click', function () {
            _this.button.toggle();
            _this.onClickEvent();
            _this.onChangeEvent();
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
        this.checkboxEvents.onClick.dispatch(this);
    };
    Checkbox.prototype.onChangeEvent = function () {
        this.checkboxEvents.onChange.dispatch(this);
    };
    Object.defineProperty(Checkbox.prototype, "onClick", {
        /**
         * Gets the event that is fired when the button is clicked.
         * @returns {Event<Checkbox, NoArgs>}
         */
        get: function () {
            return this.checkboxEvents.onClick.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "onChange", {
        /**
         * Gets the event that is fired when the value is changed
         * @returns {Event<Checkbox, NoArgs>}
         */
        get: function () {
            return this.checkboxEvents.onChange.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "isOn", {
        get: function () {
            return this.button.isOn();
        },
        enumerable: true,
        configurable: true
    });
    return Checkbox;
}(container_1.Container));
exports.Checkbox = Checkbox;

},{"../eventdispatcher":53,"./container":18,"./label":25,"./togglebutton":43}],13:[function(require,module,exports){
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

},{"./button":8}],14:[function(require,module,exports){
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

},{"./button":8}],15:[function(require,module,exports){
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
var ClosedCaptioningToggleButton = (function (_super) {
    __extends(ClosedCaptioningToggleButton, _super);
    function ClosedCaptioningToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-closedcaptioning-togglebutton',
            text: 'Closed Captioning'
        }, _this.config);
        return _this;
    }
    ClosedCaptioningToggleButton.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig(); // TODO fix generics type inference
        this.onClick.subscribe(function () {
            console.log('closed captioning button clicked');
        });
    };
    return ClosedCaptioningToggleButton;
}(togglebutton_1.ToggleButton));
exports.ClosedCaptioningToggleButton = ClosedCaptioningToggleButton;

},{"./togglebutton":43}],16:[function(require,module,exports){
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
var CommentsToggleButton = (function (_super) {
    __extends(CommentsToggleButton, _super);
    function CommentsToggleButton(config) {
        var _this = _super.call(this, config) || this;
        if (!config.seekBar) {
            throw new Error('Required SeekBar is missing');
        }
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-comments-togglebutton',
            text: 'Comments',
            seekBar: null
        }, _this.config);
        return _this;
    }
    CommentsToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig(); // TODO fix generics type inference
        var seekBar = config.seekBar;
        this.onClick.subscribe(function () {
            seekBar.toggleCommentsOn();
        });
        var updateOnOff = function () {
            if (seekBar.commentsOn) {
                _this.on();
            }
            else {
                _this.off();
            }
        };
        seekBar.onChangeCommentsOn.subscribe(function (e, on) {
            updateOnOff();
        });
        updateOnOff();
    };
    return CommentsToggleButton;
}(togglebutton_1.ToggleButton));
exports.CommentsToggleButton = CommentsToggleButton;

},{"./togglebutton":43}],17:[function(require,module,exports){
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

},{"../dom":52,"../eventdispatcher":53,"../guid":54}],18:[function(require,module,exports){
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

},{"../dom":52,"../utils":58,"./component":17}],19:[function(require,module,exports){
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

},{"../utils":58,"./container":18,"./spacer":39}],20:[function(require,module,exports){
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
var timeout_1 = require("../timeout");
var label_1 = require("./label");
var closebutton_1 = require("./closebutton");
var checkbox_1 = require("./checkbox");
/**
 * A panel containing a list of {@link EmbedVideoPanelItem items} that represent labelled embedVideo.
 */
var EmbedVideoPanel = (function (_super) {
    __extends(EmbedVideoPanel, _super);
    function EmbedVideoPanel(config) {
        var _this = _super.call(this, config) || this;
        _this.title = new label_1.Label({ text: 'Embed Video', cssClass: 'ui-embedvideo-panel-title' });
        _this.closeButton = new closebutton_1.CloseButton({ target: _this });
        _this.showCommentsCheckbox = new checkbox_1.Checkbox({ text: 'Show comments' });
        _this.codeField = new label_1.Label({ cssClass: 'ui-embedvideo-panel-codefield' });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-embedvideo-panel',
            hideDelay: 3000,
            components: [
                new container_1.Container({
                    cssClass: 'ui-embedvideo-panel-header',
                    components: [
                        _this.title,
                        _this.closeButton,
                    ]
                }),
                _this.showCommentsCheckbox,
                _this.codeField
            ]
        }, _this.config);
        return _this;
    }
    EmbedVideoPanel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig(); // TODO fix generics type inference
        var uiconfig = uimanager.getConfig();
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
            this.getDomElement().on('click', function () {
                // Reset timeout on interaction
                _this.hideTimeout.reset();
            });
            this.onHide.subscribe(function () {
                // Clear timeout when hidden from outside
                _this.hideTimeout.clear();
            });
        }
        ;
        var init = function () {
            if (uiconfig && uiconfig.metadata && uiconfig.metadata.embedVideo) {
                var ev = uiconfig.metadata.embedVideo;
                if (_this.showCommentsCheckbox.isOn && ev.withComments) {
                    _this.setEmbedVideo(ev.withComments);
                }
                else {
                    _this.setEmbedVideo(ev.default);
                }
            }
            else if (player.getConfig().source && player.getConfig().source.embedVideo) {
                var ev = player.getConfig().source.embedVideo;
                if (_this.showCommentsCheckbox.isOn && ev.withComments) {
                    _this.setEmbedVideo(ev.withComments);
                }
                else {
                    _this.setEmbedVideo(ev.default);
                }
            }
        };
        var unload = function () {
            _this.setHtmlCode(null);
        };
        // Init label
        init();
        // Reinit label when a new source is loaded
        player.addEventHandler(player.EVENT.ON_SOURCE_LOADED, init);
        // Clear labels when source is unloaded
        player.addEventHandler(player.EVENT.ON_SOURCE_UNLOADED, unload);
        // update when checkbox is changed
        this.showCommentsCheckbox.onChange.subscribe(init);
        // update when shown
        this.onShow.subscribe(init);
    };
    EmbedVideoPanel.prototype.release = function () {
        _super.prototype.release.call(this);
        if (this.hideTimeout) {
            this.hideTimeout.clear();
        }
    };
    EmbedVideoPanel.prototype.setEmbedVideo = function (htmlCode) {
        if (htmlCode) {
            var code = this.toHtmlEntities(htmlCode);
            this.setHtmlCode(code);
            this.copyTextToClipboard(htmlCode);
        }
        else {
            this.setHtmlCode(null);
        }
    };
    EmbedVideoPanel.prototype.setHtmlCode = function (code) {
        this.codeField.setText(code);
    };
    EmbedVideoPanel.prototype.toHtmlEntities = function (s) {
        return s.replace(/./gm, function (s) {
            return '&#' + s.charCodeAt(0) + ';';
        });
    };
    EmbedVideoPanel.prototype.copyTextToClipboard = function (text) {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
        }
        catch (err) {
        }
        document.body.removeChild(textArea);
    };
    return EmbedVideoPanel;
}(container_1.Container));
exports.EmbedVideoPanel = EmbedVideoPanel;

},{"../timeout":56,"./checkbox":12,"./closebutton":14,"./container":18,"./label":25}],21:[function(require,module,exports){
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

},{"./container":18,"./label":25,"./tvnoisecanvas":44}],22:[function(require,module,exports){
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

},{"./togglebutton":43}],23:[function(require,module,exports){
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
                _this.getDomElement().dispatchSmashcutPlayerUiEvent({ action: 'pause', originator: 'HugePlaybackToggleButton' });
                player.pause('ui-overlay');
            }
            else {
                _this.getDomElement().dispatchSmashcutPlayerUiEvent({ action: 'play', originator: 'HugePlaybackToggleButton' });
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

},{"../dom":52,"./playbacktogglebutton":31}],24:[function(require,module,exports){
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
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            _this.getDomElement().dispatchSmashcutPlayerUiEvent({ action: 'play', originator: 'HugeReplayButton' });
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

},{"../dom":52,"./button":8}],25:[function(require,module,exports){
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

},{"../dom":52,"../eventdispatcher":53,"./component":17}],26:[function(require,module,exports){
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

},{"../eventdispatcher":53,"../utils":58,"./component":17}],27:[function(require,module,exports){
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

},{"./label":25}],28:[function(require,module,exports){
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
        if (!player.isPictureInPictureAvailable) {
            // If the player does not support PIP (player 7.0), we just hide this component and skip configuration
            this.hide();
            return;
        }
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

},{"./togglebutton":43}],29:[function(require,module,exports){
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

},{"./selectbox":36}],30:[function(require,module,exports){
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
 * or any string through {@link PlaybackTimeLabel#setText setTimeText}.
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
        var updateLiveTimeshiftState = function () {
            if (player.getTimeShift() === 0) {
                _this.getDomElement().addClass(liveEdgeCssClass);
            }
            else {
                _this.getDomElement().removeClass(liveEdgeCssClass);
            }
        };
        var liveStreamDetector = new utils_1.PlayerUtils.LiveStreamDetector(player);
        liveStreamDetector.onLiveChanged.subscribe(function (sender, args) {
            live = args.live;
            updateLiveState();
        });
        liveStreamDetector.detect(); // Initial detection
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

},{"../utils":58,"./label":25}],31:[function(require,module,exports){
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
        var timeShiftDetector = new utils_1.PlayerUtils.TimeShiftAvailabilityDetector(player);
        timeShiftDetector.onTimeShiftAvailabilityChanged.subscribe(function (sender, args) {
            if (!args.timeShiftAvailable) {
                _this.getDomElement().addClass(_this.prefixCss(PlaybackToggleButton.CLASS_STOPTOGGLE));
            }
            else {
                _this.getDomElement().removeClass(_this.prefixCss(PlaybackToggleButton.CLASS_STOPTOGGLE));
            }
        });
        timeShiftDetector.detect(); // Initial detection
        if (handleClickEvent) {
            // Control player by button events
            // When a button event triggers a player API call, events are fired which in turn call the event handler
            // above that updated the button state.
            this.onClick.subscribe(function (e) {
                if (player.isPlaying()) {
                    _this.getDomElement().dispatchSmashcutPlayerUiEvent({ action: 'pause', e: e, originator: 'PlaybackToggleButton' });
                    player.pause('ui-button');
                }
                else {
                    _this.getDomElement().dispatchSmashcutPlayerUiEvent({ action: 'play', e: e, originator: 'PlaybackToggleButton' });
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

},{"../utils":58,"./togglebutton":43}],32:[function(require,module,exports){
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

},{"./container":18,"./hugeplaybacktogglebutton":23}],33:[function(require,module,exports){
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

},{"../dom":52,"../utils":58,"./component":17,"./container":18,"./hugereplaybutton":24}],34:[function(require,module,exports){
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
        _this._commentsOn = true;
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
            onSeeked: new eventdispatcher_1.EventDispatcher(),
            /**
             * Fire when commentsOn is toggled
             */
            onChangeCommentsOn: new eventdispatcher_1.EventDispatcher()
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
        var liveStreamDetector = new utils_1.PlayerUtils.LiveStreamDetector(player);
        liveStreamDetector.onLiveChanged.subscribe(function (sender, args) {
            isLive = args.live;
            switchVisibility(isLive, hasTimeShift);
        });
        var timeShiftDetector = new utils_1.PlayerUtils.TimeShiftAvailabilityDetector(player);
        timeShiftDetector.onTimeShiftAvailabilityChanged.subscribe(function (sender, args) {
            hasTimeShift = args.timeShiftAvailable;
            switchVisibility(isLive, hasTimeShift);
        });
        // Initial detection
        liveStreamDetector.detect();
        timeShiftDetector.detect();
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
                var duration = player.getDuration();
                for (var _i = 0, markers_1 = markers; _i < markers_1.length; _i++) {
                    var o = markers_1[_i];
                    var marker = {
                        time: o.time,
                        timePercentage: 100 / duration * o.time,
                        title: o.title,
                        markerType: o.markerType || 'default',
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
            seekBar.dispatchSmashcutPlayerUiEvent({
                action: 'seeking-change',
                e: e,
                position: targetPercentage,
                originator: 'SeekBar'
            });
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
            seekBar.dispatchSmashcutPlayerUiEvent({
                action: 'seeking-end',
                e: e,
                position: targetPercentage,
                originator: 'SeekBar'
            });
            _this.setSeeking(false);
            seeking = false;
            // Fire seeked event
            _this.onSeekedEvent(snappedChapter ? snappedChapter.timePercentage : targetPercentage);
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
            seekBar.dispatchSmashcutPlayerUiEvent({ action: 'seeking-start', e: e, originator: 'SeekBar' });
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
        if (!this._commentsOn) {
            return;
        }
        for (var _i = 0, _a = this.timelineMarkers; _i < _a.length; _i++) {
            var marker = _a[_i];
            var className = this.prefixCss('seekbar-marker-type-' + marker.markerType);
            var markerDom = new dom_1.DOM('div', {
                'class': className,
                'data-marker-time': String(marker.time),
                'data-marker-title': String(marker.title),
            }).css({
                'left': marker.timePercentage + '%',
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
                if (percentage >= marker.timePercentage - snappingRange && percentage <= marker.timePercentage + snappingRange) {
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
                'left': (snappedMarker ? snappedMarker.timePercentage : percentage) + '%'
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
    SeekBar.prototype.onChangeCommentsOnEvent = function (on) {
        this.seekBarEvents.onChangeCommentsOn.dispatch(this, on);
    };
    Object.defineProperty(SeekBar.prototype, "onChangeCommentsOn", {
        get: function () {
            return this.seekBarEvents.onChangeCommentsOn.getEvent();
        },
        enumerable: true,
        configurable: true
    });
    SeekBar.prototype.toggleCommentsOn = function () {
        this._commentsOn = !this._commentsOn;
        this.onChangeCommentsOnEvent(this._commentsOn);
        this.updateMarkers();
    };
    Object.defineProperty(SeekBar.prototype, "commentsOn", {
        get: function () {
            return this._commentsOn;
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

},{"../dom":52,"../eventdispatcher":53,"../timeout":56,"../utils":58,"./component":17}],35:[function(require,module,exports){
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
        _this.avatarLabel = new label_1.Label({ cssClasses: ['seekbar-label-avatar'] });
        _this.commentLabel = new label_1.Label({ cssClasses: ['seekbar-label-comment'] });
        _this.markerType = new component_1.Component({ cssClasses: ['seekbar-label-marker-type'] });
        _this.thumbnail = new component_1.Component({ cssClasses: ['seekbar-thumbnail'] });
        _this.timeLabel = new label_1.Label({ cssClasses: ['seekbar-label-time'] });
        _this.titleLabel = new label_1.Label({ cssClasses: ['seekbar-label-title'] });
        _this.metadata = new container_1.Container({
            components: [
                new container_1.Container({
                    components: [
                        _this.avatarLabel,
                        _this.titleLabel,
                        _this.markerType
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
                if (args.marker) {
                    _this.setTitleText(args.marker.title);
                    _this.setSmashcutData(args.marker);
                    _this.setTimeText(null);
                    _this.setThumbnail(null);
                    _this.setBackground(true);
                }
                else {
                    var percentage = args.position;
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
    SeekBarLabel.prototype.setTimeText = function (text) {
        this.timeLabel.setText(text);
    };
    /**
     * Sets a time to be displayed on the label.
     * @param seconds the time in seconds to display on the label
     */
    SeekBarLabel.prototype.setTime = function (seconds) {
        this.setTimeText(utils_1.StringUtils.secondsToTime(seconds, this.timeFormat));
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
            this.commentLabel.setText('"' + marker.comment + '"');
            this.avatarLabel.setText(marker.avatar);
            this.setMarkerType(marker.markerType);
        }
        else {
            this.commentLabel.setText(null);
            this.avatarLabel.setText(null);
            this.setMarkerType(null);
        }
    };
    SeekBarLabel.prototype.setMarkerType = function (type) {
        var dom = this.markerType.getDomElement();
        if (this.markerTypeClass) {
            dom.removeClass(this.markerTypeClass);
        }
        this.markerTypeClass = type;
        if (this.markerTypeClass) {
            dom.addClass(type);
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
                'width': '180px',
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
                'background': '#fff',
                'color': '#000'
            });
        }
        else {
            metadataElement.css({
                'background': 'initial',
                'color': '#fff'
            });
        }
    };
    return SeekBarLabel;
}(container_1.Container));
exports.SeekBarLabel = SeekBarLabel;

},{"../utils":58,"./component":17,"./container":18,"./label":25}],36:[function(require,module,exports){
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

},{"../dom":52,"./listselector":26}],37:[function(require,module,exports){
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
            this.getDomElement().on('mouseenter', function () {
                // On mouse enter clear the timeout
                _this.hideTimeout.clear();
            });
            this.getDomElement().on('mouseleave', function () {
                // On mouse leave activate the timeout
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

},{"../eventdispatcher":53,"../timeout":56,"./audioqualityselectbox":5,"./container":18,"./label":25,"./videoqualityselectbox":46}],38:[function(require,module,exports){
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

},{"./togglebutton":43}],39:[function(require,module,exports){
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

},{"./component":17}],40:[function(require,module,exports){
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
            if (labelToRemove) {
                _this.removeComponent(labelToRemove);
                _this.updateComponents();
            }
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
     * Removes the subtitle cue from the manager and returns the label that should be removed from the subtitle overlay,
     * or null if there is no associated label existing (e.g. because all labels have been {@link #clear cleared}.
     * @param event
     * @return {SubtitleLabel|null}
     */
    ActiveSubtitleManager.prototype.cueExit = function (event) {
        var id = ActiveSubtitleManager.calculateId(event);
        var activeSubtitleCue = this.activeSubtitleCueMap[id];
        if (activeSubtitleCue) {
            delete this.activeSubtitleCueMap[id];
            return activeSubtitleCue.label;
        }
        else {
            return null;
        }
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

},{"./container":18,"./controlbar":19,"./label":25}],41:[function(require,module,exports){
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
        var getLabel = function (id) {
            switch (id) {
                case 'off':
                    return 'Off';
                case 'en':
                    return 'English';
                case 'fr':
                    return 'Francais';
                case 'de':
                    return 'Deutsch';
                case 'es':
                    return 'Espaniol';
                default:
                    return id;
            }
        };
        var updateSubtitles = function () {
            _this.clearItems();
            for (var _i = 0, _a = player.getAvailableSubtitles(); _i < _a.length; _i++) {
                var subtitle = _a[_i];
                _this.addItem(subtitle.id, getLabel(subtitle.label));
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

},{"./selectbox":36}],42:[function(require,module,exports){
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

},{"./container":18,"./metadatalabel":27}],43:[function(require,module,exports){
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

},{"../eventdispatcher":53,"./button":8}],44:[function(require,module,exports){
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

},{"../dom":52,"./component":17}],45:[function(require,module,exports){
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

},{"../dom":52,"../timeout":56,"../utils":58,"./container":18}],46:[function(require,module,exports){
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
            _this.addItem('Auto', 'Auto');
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
            _this.selectItem(data.isAuto ? 'Auto' : data.id);
        });
        // Populate qualities at startup
        updateVideoQualities();
    };
    return VideoQualitySelectBox;
}(selectbox_1.SelectBox));
exports.VideoQualitySelectBox = VideoQualitySelectBox;

},{"./selectbox":36}],47:[function(require,module,exports){
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

},{"../timeout":56,"./container":18,"./volumeslider":48,"./volumetogglebutton":49}],48:[function(require,module,exports){
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

},{"./seekbar":34}],49:[function(require,module,exports){
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

},{"./togglebutton":43}],50:[function(require,module,exports){
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

},{"./togglebutton":43}],51:[function(require,module,exports){
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

},{"./clickoverlay":13}],52:[function(require,module,exports){
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
     * Allow to dispatch browser events
     * @param event
     */
    DOM.prototype.dispatchEvent = function (event) {
        if (this.elements == null) {
            this.document.dispatchEvent(event);
        }
        else {
            this.forEach(function (element) {
                element.dispatchEvent(event);
            });
        }
    };
    DOM.prototype.dispatchSmashcutPlayerUiEvent = function (data) {
        this.dispatchEvent(new CustomEvent('smashcutplayerui', { detail: data, bubbles: true, cancelable: true }));
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

},{"./utils":58}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{"./components/adclickoverlay":1,"./components/admessagelabel":2,"./components/adskipbutton":3,"./components/airplaytogglebutton":4,"./components/audioqualityselectbox":5,"./components/audiotrackselectbox":6,"./components/bufferingoverlay":7,"./components/button":8,"./components/caststatusoverlay":9,"./components/casttogglebutton":10,"./components/castuicontainer":11,"./components/clickoverlay":13,"./components/closebutton":14,"./components/component":17,"./components/container":18,"./components/controlbar":19,"./components/errormessageoverlay":21,"./components/fullscreentogglebutton":22,"./components/hugeplaybacktogglebutton":23,"./components/hugereplaybutton":24,"./components/label":25,"./components/metadatalabel":27,"./components/pictureinpicturetogglebutton":28,"./components/playbackspeedselectbox":29,"./components/playbacktimelabel":30,"./components/playbacktogglebutton":31,"./components/playbacktoggleoverlay":32,"./components/recommendationoverlay":33,"./components/seekbar":34,"./components/seekbarlabel":35,"./components/selectbox":36,"./components/settingspanel":37,"./components/settingstogglebutton":38,"./components/spacer":39,"./components/subtitleoverlay":40,"./components/subtitleselectbox":41,"./components/titlebar":42,"./components/togglebutton":43,"./components/uicontainer":45,"./components/videoqualityselectbox":46,"./components/volumecontrolbutton":47,"./components/volumeslider":48,"./components/volumetogglebutton":49,"./components/vrtogglebutton":50,"./components/watermark":51,"./uimanager":57,"./utils":58}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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
var embedvideopanel_1 = require("./components/embedvideopanel");
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
var commentstogglebutton_1 = require("./components/commentstogglebutton");
var closedcaptioningtogglebutton_1 = require("./components/closedcaptioningtogglebutton");
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
        var uiDom = ui.getUI().getDomElement();
        ui.configureControls();
        /* Append the UI DOM after configuration to avoid CSS transitions at initialization
         * Example: Components are hidden during configuration and these hides may trigger CSS transitions that are
         * undesirable at this time. */
        /* Append ui to parent instead of player */
        var parentElement = new dom_1.DOM(this.playerElement.getElements()[0].parentElement);
        parentElement.addClass('smashcut-custom-ui-bitmovin-player-holder');
        parentElement.append(uiDom);
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
            var embedVideoPanel = new embedvideopanel_1.EmbedVideoPanel({
                hidden: true
            });
            var controlBarTop = new container_1.Container({
                cssClasses: ['controlbar-top'],
                components: [
                    new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                    new playbacktimelabel_1.PlaybackTimeLabel({ timeLabelMode: playbacktimelabel_1.PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                ]
            });
            var seekBar = new seekbar_1.SeekBar({ label: new seekbarlabel_1.SeekBarLabel() });
            var controlBarMiddle = new container_1.Container({
                cssClasses: ['controlbar-middle'],
                components: [seekBar]
            });
            var controlBarBottom = new container_1.Container({
                cssClasses: ['controlbar-bottom'],
                components: [
                    new spacer_1.Spacer(),
                    new volumeslider_1.VolumeSlider(),
                    new volumetogglebutton_1.VolumeToggleButton(),
                    new commentstogglebutton_1.CommentsToggleButton({ seekBar: seekBar }),
                    new closedcaptioningtogglebutton_1.ClosedCaptioningToggleButton(),
                    new settingstogglebutton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                    //new EmbedVideoToggleButton({embedVideoPanel: embedVideoPanel}),
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
                            embedVideoPanel,
                            controlBarTop,
                            controlBarMiddle,
                            controlBarBottom,
                        ]
                    })
                ]
            });
            return new uicontainer_1.UIContainer({
                hideDelay: 5000,
                cssClasses: ['ui-skin-modern ui-skin-smashcut'],
                components: [
                    new subtitleoverlay_1.SubtitleOverlay(),
                    new bufferingoverlay_1.BufferingOverlay(),
                    new playbacktoggleoverlay_1.PlaybackToggleOverlay(),
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

},{"./components/adclickoverlay":1,"./components/admessagelabel":2,"./components/adskipbutton":3,"./components/airplaytogglebutton":4,"./components/audioqualityselectbox":5,"./components/audiotrackselectbox":6,"./components/bufferingoverlay":7,"./components/caststatusoverlay":9,"./components/casttogglebutton":10,"./components/castuicontainer":11,"./components/closebutton":14,"./components/closedcaptioningtogglebutton":15,"./components/commentstogglebutton":16,"./components/container":18,"./components/controlbar":19,"./components/embedvideopanel":20,"./components/errormessageoverlay":21,"./components/fullscreentogglebutton":22,"./components/label":25,"./components/metadatalabel":27,"./components/pictureinpicturetogglebutton":28,"./components/playbackspeedselectbox":29,"./components/playbacktimelabel":30,"./components/playbacktogglebutton":31,"./components/playbacktoggleoverlay":32,"./components/recommendationoverlay":33,"./components/seekbar":34,"./components/seekbarlabel":35,"./components/settingspanel":37,"./components/settingstogglebutton":38,"./components/spacer":39,"./components/subtitleoverlay":40,"./components/subtitleselectbox":41,"./components/titlebar":42,"./components/uicontainer":45,"./components/videoqualityselectbox":46,"./components/volumecontrolbutton":47,"./components/volumeslider":48,"./components/volumetogglebutton":49,"./components/vrtogglebutton":50,"./components/watermark":51,"./dom":52,"./eventdispatcher":53,"./utils":58}],58:[function(require,module,exports){
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
            this.player = player;
            this.timeShiftAvailable = undefined;
            var timeShiftDetector = function () {
                _this.detect();
            };
            // Try to detect timeshift availability in ON_READY, which works for DASH streams
            player.addEventHandler(player.EVENT.ON_READY, timeShiftDetector);
            // With HLS/NativePlayer streams, getMaxTimeShift can be 0 before the buffer fills, so we need to additionally
            // check timeshift availability in ON_TIME_CHANGED
            player.addEventHandler(player.EVENT.ON_TIME_CHANGED, timeShiftDetector);
        }
        TimeShiftAvailabilityDetector.prototype.detect = function () {
            if (this.player.isLive()) {
                var timeShiftAvailableNow = PlayerUtils.isTimeShiftAvailable(this.player);
                // When the availability changes, we fire the event
                if (timeShiftAvailableNow !== this.timeShiftAvailable) {
                    this.timeShiftAvailabilityChangedEvent.dispatch(this.player, { timeShiftAvailable: timeShiftAvailableNow });
                    this.timeShiftAvailable = timeShiftAvailableNow;
                }
            }
        };
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
            this.player = player;
            this.live = undefined;
            var liveDetector = function () {
                _this.detect();
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
        LiveStreamDetector.prototype.detect = function () {
            var liveNow = this.player.isLive();
            // Compare current to previous live state flag and fire event when it changes. Since we initialize the flag
            // with undefined, there is always at least an initial event fired that tells listeners the live state.
            if (liveNow !== this.live) {
                this.liveChangedEvent.dispatch(this.player, { live: liveNow });
                this.live = liveNow;
            }
        };
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

},{"./components/container":18,"./eventdispatcher":53}]},{},[55])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvY29tcG9uZW50cy9hZGNsaWNrb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL2FkbWVzc2FnZWxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYWRza2lwYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYWlycGxheXRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2F1ZGlvcXVhbGl0eXNlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL2F1ZGlvdHJhY2tzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9idWZmZXJpbmdvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2FzdHN0YXR1c292ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jYXN0dG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2FzdHVpY29udGFpbmVyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2hlY2tib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jbGlja292ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jbG9zZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2Nsb3NlZGNhcHRpb25pbmd0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9jb21tZW50c3RvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbXBvbmVudC50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbnRhaW5lci50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbnRyb2xiYXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy9lbWJlZHZpZGVvcGFuZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9lcnJvcm1lc3NhZ2VvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvZnVsbHNjcmVlbnRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2h1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2h1Z2VyZXBsYXlidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9sYWJlbC50cyIsInNyYy90cy9jb21wb25lbnRzL2xpc3RzZWxlY3Rvci50cyIsInNyYy90cy9jb21wb25lbnRzL21ldGFkYXRhbGFiZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9waWN0dXJlaW5waWN0dXJldG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcGxheWJhY2tzcGVlZHNlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL3BsYXliYWNrdGltZWxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcGxheWJhY2t0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9wbGF5YmFja3RvZ2dsZW92ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9yZWNvbW1lbmRhdGlvbm92ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9zZWVrYmFyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc2Vla2JhcmxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc2VsZWN0Ym94LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc2V0dGluZ3NwYW5lbC50cyIsInNyYy90cy9jb21wb25lbnRzL3NldHRpbmdzdG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc3BhY2VyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc3VidGl0bGVvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc3VidGl0bGVzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy90aXRsZWJhci50cyIsInNyYy90cy9jb21wb25lbnRzL3RvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL3R2bm9pc2VjYW52YXMudHMiLCJzcmMvdHMvY29tcG9uZW50cy91aWNvbnRhaW5lci50cyIsInNyYy90cy9jb21wb25lbnRzL3ZpZGVvcXVhbGl0eXNlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL3ZvbHVtZWNvbnRyb2xidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy92b2x1bWVzbGlkZXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy92b2x1bWV0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy92cnRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL3dhdGVybWFyay50cyIsInNyYy90cy9kb20udHMiLCJzcmMvdHMvZXZlbnRkaXNwYXRjaGVyLnRzIiwic3JjL3RzL2d1aWQudHMiLCJzcmMvdHMvbWFpbi50cyIsInNyYy90cy90aW1lb3V0LnRzIiwic3JjL3RzL3VpbWFuYWdlci50cyIsInNyYy90cy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztBQ0FBLCtDQUE0QztBQUc1Qzs7R0FFRztBQUNIO0lBQW9DLGtDQUFZO0lBQWhEOztJQXVDQSxDQUFDO0lBckNDLGtDQUFTLEdBQVQsVUFBVSxNQUEwQixFQUFFLFNBQTRCO1FBQWxFLGlCQW9DQztRQW5DQyxpQkFBTSxTQUFTLFlBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRW5DLElBQUksZUFBZSxHQUFXLElBQUksQ0FBQztRQUNuQyxJQUFJLG1CQUFtQixHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVc7ZUFDcEQsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQztlQUNyRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDO1FBRXhELE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsVUFBQyxLQUF3QztZQUMxRixlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUs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d0NBQXdDO1FBQ3hDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFkZSxvQkFBWSxlQWMzQixDQUFBO0FBQ0gsQ0FBQyxFQXBCZ0IsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBb0J2QjtBQUVELElBQWlCLFlBQVksQ0FXNUI7QUFYRCxXQUFpQixZQUFZO0lBRTNCLHVGQUF1RjtJQUN2RixnSEFBZ0g7SUFDaEgseURBQXlEO0lBQ3pELDJGQUEyRjtJQUM5RSxxQkFBUSxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRWhGLHFCQUFRLEdBQUcsU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFbEYsc0JBQVMsR0FBRyxTQUFTLElBQUksU0FBUyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuRyxDQUFDLEVBWGdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBVzVCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7Q2xpY2tPdmVybGF5fSBmcm9tICcuL2NsaWNrb3ZlcmxheSc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2ltcGxlIGNsaWNrIGNhcHR1cmUgb3ZlcmxheSBmb3IgY2xpY2tUaHJvdWdoVXJscyBvZiBhZHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBZENsaWNrT3ZlcmxheSBleHRlbmRzIENsaWNrT3ZlcmxheSB7XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjbGlja1Rocm91Z2hVcmwgPSA8c3RyaW5nPm51bGw7XG4gICAgbGV0IGNsaWNrVGhyb3VnaEVuYWJsZWQgPSAhcGxheWVyLmdldENvbmZpZygpLmFkdmVydGlzaW5nXG4gICAgICB8fCAhcGxheWVyLmdldENvbmZpZygpLmFkdmVydGlzaW5nLmhhc093blByb3BlcnR5KCdjbGlja1Rocm91Z2hFbmFibGVkJylcbiAgICAgIHx8IHBsYXllci5nZXRDb25maWcoKS5hZHZlcnRpc2luZy5jbGlja1Rocm91Z2hFbmFibGVkO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfU1RBUlRFRCwgKGV2ZW50OiBiaXRtb3Zpbi5QbGF5ZXJBUEkuQWRTdGFydGVkRXZlbnQpID0+IHtcbiAgICAgIGNsaWNrVGhyb3VnaFVybCA9IGV2ZW50LmNsaWNrVGhyb3VnaFVybDtcblxuICAgICAgaWYgKGNsaWNrVGhyb3VnaEVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5zZXRVcmwoY2xpY2tUaHJvdWdoVXJsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIGNsaWNrLXRocm91Z2ggaXMgZGlzYWJsZWQsIHdlIHNldCB0aGUgdXJsIHRvIG51bGwgdG8gYXZvaWQgaXQgb3BlblxuICAgICAgICB0aGlzLnNldFVybChudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENsZWFyIGNsaWNrLXRocm91Z2ggVVJMIHdoZW4gYWQgaGFzIGZpbmlzaGVkXG4gICAgbGV0IGFkRmluaXNoZWRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRVcmwobnVsbCk7XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgYWRGaW5pc2hlZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX1NLSVBQRUQsIGFkRmluaXNoZWRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9FUlJPUiwgYWRGaW5pc2hlZEhhbmRsZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBQYXVzZSB0aGUgYWQgd2hlbiBvdmVybGF5IGlzIGNsaWNrZWRcbiAgICAgIHBsYXllci5wYXVzZSgndWktY29udGVudC1jbGljaycpO1xuXG4gICAgICAvLyBOb3RpZnkgdGhlIHBsYXllciBvZiB0aGUgY2xpY2tlZCBhZFxuICAgICAgcGxheWVyLmZpcmVFdmVudChwbGF5ZXIuRVZFTlQuT05fQURfQ0xJQ0tFRCwge1xuICAgICAgICBjbGlja1Rocm91Z2hVcmw6IGNsaWNrVGhyb3VnaFVybFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtTdHJpbmdVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIEEgbGFiZWwgdGhhdCBkaXNwbGF5cyBhIG1lc3NhZ2UgYWJvdXQgYSBydW5uaW5nIGFkLCBvcHRpb25hbGx5IHdpdGggYSBjb3VudGRvd24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBZE1lc3NhZ2VMYWJlbCBleHRlbmRzIExhYmVsPExhYmVsQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktbGFiZWwtYWQtbWVzc2FnZScsXG4gICAgICB0ZXh0OiAnVGhpcyBhZCB3aWxsIGVuZCBpbiB7cmVtYWluaW5nVGltZX0gc2Vjb25kcy4nXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB0ZXh0ID0gdGhpcy5nZXRDb25maWcoKS50ZXh0O1xuXG4gICAgbGV0IHVwZGF0ZU1lc3NhZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRUZXh0KFN0cmluZ1V0aWxzLnJlcGxhY2VBZE1lc3NhZ2VQbGFjZWhvbGRlcnModGV4dCwgbnVsbCwgcGxheWVyKSk7XG4gICAgfTtcblxuICAgIGxldCBhZFN0YXJ0SGFuZGxlciA9IChldmVudDogYml0bW92aW4uUGxheWVyQVBJLkFkU3RhcnRlZEV2ZW50KSA9PiB7XG4gICAgICB0ZXh0ID0gZXZlbnQuYWRNZXNzYWdlIHx8IHRleHQ7XG4gICAgICB1cGRhdGVNZXNzYWdlSGFuZGxlcigpO1xuXG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHVwZGF0ZU1lc3NhZ2VIYW5kbGVyKTtcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfVElNRV9VUERBVEVELCB1cGRhdGVNZXNzYWdlSGFuZGxlcik7XG4gICAgfTtcblxuICAgIGxldCBhZEVuZEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBwbGF5ZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHVwZGF0ZU1lc3NhZ2VIYW5kbGVyKTtcbiAgICAgIHBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfVElNRV9VUERBVEVELCB1cGRhdGVNZXNzYWdlSGFuZGxlcik7XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX1NUQVJURUQsIGFkU3RhcnRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9TS0lQUEVELCBhZEVuZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX0VSUk9SLCBhZEVuZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX0ZJTklTSEVELCBhZEVuZEhhbmRsZXIpO1xuICB9XG59IiwiaW1wb3J0IHtCdXR0b25Db25maWcsIEJ1dHRvbn0gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBTa2lwTWVzc2FnZSA9IGJpdG1vdmluLlBsYXllckFQSS5Ta2lwTWVzc2FnZTtcbmltcG9ydCB7U3RyaW5nVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBBZFNraXBCdXR0b259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkU2tpcEJ1dHRvbkNvbmZpZyBleHRlbmRzIEJ1dHRvbkNvbmZpZyB7XG4gIHNraXBNZXNzYWdlPzogU2tpcE1lc3NhZ2U7XG59XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCBpcyBkaXNwbGF5ZWQgZHVyaW5nIGFkcyBhbmQgY2FuIGJlIHVzZWQgdG8gc2tpcCB0aGUgYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBBZFNraXBCdXR0b24gZXh0ZW5kcyBCdXR0b248QWRTa2lwQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBBZFNraXBCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCA8QWRTa2lwQnV0dG9uQ29uZmlnPntcbiAgICAgIGNzc0NsYXNzOiAndWktYnV0dG9uLWFkLXNraXAnLFxuICAgICAgc2tpcE1lc3NhZ2U6IHtcbiAgICAgICAgY291bnRkb3duOiAnU2tpcCBhZCBpbiB7cmVtYWluaW5nVGltZX0nLFxuICAgICAgICBza2lwOiAnU2tpcCBhZCdcbiAgICAgIH1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxBZFNraXBCdXR0b25Db25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBnZXQgcmlkIG9mIGdlbmVyaWMgY2FzdFxuICAgIGxldCBza2lwTWVzc2FnZSA9IGNvbmZpZy5za2lwTWVzc2FnZTtcbiAgICBsZXQgYWRFdmVudCA9IDxiaXRtb3Zpbi5QbGF5ZXJBUEkuQWRTdGFydGVkRXZlbnQ+bnVsbDtcblxuICAgIGxldCB1cGRhdGVTa2lwTWVzc2FnZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAvLyBEaXNwbGF5IHRoaXMgYnV0dG9uIG9ubHkgaWYgYWQgaXMgc2tpcHBhYmxlXG4gICAgICBpZiAoYWRFdmVudC5za2lwT2Zmc2V0KSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgc2tpcCBtZXNzYWdlIG9uIHRoZSBidXR0b25cbiAgICAgIGlmIChwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKSA8IGFkRXZlbnQuc2tpcE9mZnNldCkge1xuICAgICAgICB0aGlzLnNldFRleHQoXG4gICAgICAgICAgU3RyaW5nVXRpbHMucmVwbGFjZUFkTWVzc2FnZVBsYWNlaG9sZGVycyhjb25maWcuc2tpcE1lc3NhZ2UuY291bnRkb3duLCBhZEV2ZW50LnNraXBPZmZzZXQsIHBsYXllcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRUZXh0KGNvbmZpZy5za2lwTWVzc2FnZS5za2lwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGFkU3RhcnRIYW5kbGVyID0gKGV2ZW50OiBiaXRtb3Zpbi5QbGF5ZXJBUEkuQWRTdGFydGVkRXZlbnQpID0+IHtcbiAgICAgIGFkRXZlbnQgPSBldmVudDtcbiAgICAgIHNraXBNZXNzYWdlID0gYWRFdmVudC5za2lwTWVzc2FnZSB8fCBza2lwTWVzc2FnZTtcbiAgICAgIHVwZGF0ZVNraXBNZXNzYWdlSGFuZGxlcigpO1xuXG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHVwZGF0ZVNraXBNZXNzYWdlSGFuZGxlcik7XG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgdXBkYXRlU2tpcE1lc3NhZ2VIYW5kbGVyKTtcbiAgICB9O1xuXG4gICAgbGV0IGFkRW5kSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgdXBkYXRlU2tpcE1lc3NhZ2VIYW5kbGVyKTtcbiAgICAgIHBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfVElNRV9VUERBVEVELCB1cGRhdGVTa2lwTWVzc2FnZUhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVELCBhZFN0YXJ0SGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfU0tJUFBFRCwgYWRFbmRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9FUlJPUiwgYWRFbmRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgYWRFbmRIYW5kbGVyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gVHJ5IHRvIHNraXAgdGhlIGFkICh0aGlzIG9ubHkgd29ya3MgaWYgaXQgaXMgc2tpcHBhYmxlIHNvIHdlIGRvbid0IG5lZWQgdG8gdGFrZSBleHRyYSBjYXJlIG9mIHRoYXQgaGVyZSlcbiAgICAgIHBsYXllci5za2lwQWQoKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIEFwcGxlIEFpclBsYXkuXG4gKi9cbmV4cG9ydCBjbGFzcyBBaXJQbGF5VG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1haXJwbGF5dG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdBcHBsZSBBaXJQbGF5J1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBpZiAoIXBsYXllci5pc0FpcnBsYXlBdmFpbGFibGUpIHtcbiAgICAgIC8vIElmIHRoZSBwbGF5ZXIgZG9lcyBub3Qgc3VwcG9ydCBBaXJwbGF5IChwbGF5ZXIgNy4wKSwgd2UganVzdCBoaWRlIHRoaXMgY29tcG9uZW50IGFuZCBza2lwIGNvbmZpZ3VyYXRpb25cbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0FpcnBsYXlBdmFpbGFibGUoKSkge1xuICAgICAgICBwbGF5ZXIuc2hvd0FpcnBsYXlUYXJnZXRQaWNrZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0FpclBsYXkgdW5hdmFpbGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGFpclBsYXlBdmFpbGFibGVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0FpcnBsYXlBdmFpbGFibGUoKSkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BSVJQTEFZX0FWQUlMQUJMRSwgYWlyUGxheUF2YWlsYWJsZUhhbmRsZXIpO1xuXG4gICAgLy8gU3RhcnR1cCBpbml0XG4gICAgYWlyUGxheUF2YWlsYWJsZUhhbmRsZXIoKTsgLy8gSGlkZSBidXR0b24gaWYgQWlyUGxheSBpcyBub3QgYXZhaWxhYmxlXG4gIH1cbn0iLCJpbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBzZWxlY3QgYm94IHByb3ZpZGluZyBhIHNlbGVjdGlvbiBiZXR3ZWVuICdhdXRvJyBhbmQgdGhlIGF2YWlsYWJsZSBhdWRpbyBxdWFsaXRpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBdWRpb1F1YWxpdHlTZWxlY3RCb3ggZXh0ZW5kcyBTZWxlY3RCb3gge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB1cGRhdGVBdWRpb1F1YWxpdGllcyA9ICgpID0+IHtcbiAgICAgIGxldCBhdWRpb1F1YWxpdGllcyA9IHBsYXllci5nZXRBdmFpbGFibGVBdWRpb1F1YWxpdGllcygpO1xuXG4gICAgICB0aGlzLmNsZWFySXRlbXMoKTtcblxuICAgICAgLy8gQWRkIGVudHJ5IGZvciBhdXRvbWF0aWMgcXVhbGl0eSBzd2l0Y2hpbmcgKGRlZmF1bHQgc2V0dGluZylcbiAgICAgIHRoaXMuYWRkSXRlbSgnQXV0bycsICdBdXRvJyk7XG5cbiAgICAgIC8vIEFkZCBhdWRpbyBxdWFsaXRpZXNcbiAgICAgIGZvciAobGV0IGF1ZGlvUXVhbGl0eSBvZiBhdWRpb1F1YWxpdGllcykge1xuICAgICAgICB0aGlzLmFkZEl0ZW0oYXVkaW9RdWFsaXR5LmlkLCBhdWRpb1F1YWxpdHkubGFiZWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uSXRlbVNlbGVjdGVkLnN1YnNjcmliZSgoc2VuZGVyOiBBdWRpb1F1YWxpdHlTZWxlY3RCb3gsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHBsYXllci5zZXRBdWRpb1F1YWxpdHkodmFsdWUpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHF1YWxpdGllcyB3aGVuIGF1ZGlvIHRyYWNrIGhhcyBjaGFuZ2VkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fQ0hBTkdFRCwgdXBkYXRlQXVkaW9RdWFsaXRpZXMpO1xuICAgIC8vIFVwZGF0ZSBxdWFsaXRpZXMgd2hlbiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1cGRhdGVBdWRpb1F1YWxpdGllcyk7XG4gICAgLy8gVXBkYXRlIHF1YWxpdGllcyB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgdXBkYXRlQXVkaW9RdWFsaXRpZXMpO1xuICAgIC8vIFVwZGF0ZSBxdWFsaXR5IHNlbGVjdGlvbiB3aGVuIHF1YWxpdHkgaXMgY2hhbmdlZCAoZnJvbSBvdXRzaWRlKVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FVRElPX0RPV05MT0FEX1FVQUxJVFlfQ0hBTkdFLCAoKSA9PiB7XG4gICAgICBsZXQgZGF0YSA9IHBsYXllci5nZXREb3dubG9hZGVkQXVkaW9EYXRhKCk7XG4gICAgICB0aGlzLnNlbGVjdEl0ZW0oZGF0YS5pc0F1dG8gPyAnQXV0bycgOiBkYXRhLmlkKTtcbiAgICB9KTtcblxuICAgIC8vIFBvcHVsYXRlIHF1YWxpdGllcyBhdCBzdGFydHVwXG4gICAgdXBkYXRlQXVkaW9RdWFsaXRpZXMoKTtcbiAgfVxufSIsImltcG9ydCB7U2VsZWN0Qm94fSBmcm9tICcuL3NlbGVjdGJveCc7XG5pbXBvcnQge0xpc3RTZWxlY3RvckNvbmZpZ30gZnJvbSAnLi9saXN0c2VsZWN0b3InO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIHNlbGVjdCBib3ggcHJvdmlkaW5nIGEgc2VsZWN0aW9uIGJldHdlZW4gYXZhaWxhYmxlIGF1ZGlvIHRyYWNrcyAoZS5nLiBkaWZmZXJlbnQgbGFuZ3VhZ2VzKS5cbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvVHJhY2tTZWxlY3RCb3ggZXh0ZW5kcyBTZWxlY3RCb3gge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIC8vIFRPRE8gTW92ZSB0byBjb25maWc/XG4gICAgbGV0IGdldEF1ZGlvVHJhY2tMYWJlbCA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgICBzd2l0Y2ggKGlkKSB7XG4gICAgICAgIGNhc2UgJ2VuX3N0ZXJlbyc6XG4gICAgICAgICAgcmV0dXJuICdFbmdsaXNoIC0gU3RlcmVvJztcbiAgICAgICAgY2FzZSAnbm8tdm9pY2VzX3N0ZXJlbyc6XG4gICAgICAgICAgcmV0dXJuICdObyBWb2ljZXMgLSBTdGVyZW8nO1xuICAgICAgICBjYXNlICdlbl9zdXJyb3VuZCc6XG4gICAgICAgICAgcmV0dXJuICdFbmdsaXNoIC0gU3Vycm91bmQnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB1cGRhdGVBdWRpb1RyYWNrcyA9ICgpID0+IHtcbiAgICAgIGxldCBhdWRpb1RyYWNrcyA9IHBsYXllci5nZXRBdmFpbGFibGVBdWRpbygpO1xuXG4gICAgICB0aGlzLmNsZWFySXRlbXMoKTtcblxuICAgICAgLy8gQWRkIGF1ZGlvIHRyYWNrc1xuICAgICAgZm9yIChsZXQgYXVkaW9UcmFjayBvZiBhdWRpb1RyYWNrcykge1xuICAgICAgICB0aGlzLmFkZEl0ZW0oYXVkaW9UcmFjay5pZCwgZ2V0QXVkaW9UcmFja0xhYmVsKGF1ZGlvVHJhY2subGFiZWwpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5vbkl0ZW1TZWxlY3RlZC5zdWJzY3JpYmUoKHNlbmRlcjogQXVkaW9UcmFja1NlbGVjdEJveCwgdmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgcGxheWVyLnNldEF1ZGlvKHZhbHVlKTtcbiAgICB9KTtcblxuICAgIGxldCBhdWRpb1RyYWNrSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGxldCBjdXJyZW50QXVkaW9UcmFjayA9IHBsYXllci5nZXRBdWRpbygpO1xuXG4gICAgICAvLyBITFMgc3RyZWFtcyBkb24ndCBhbHdheXMgcHJvdmlkZSB0aGlzLCBzbyB3ZSBoYXZlIHRvIGNoZWNrXG4gICAgICBpZiAoY3VycmVudEF1ZGlvVHJhY2spIHtcbiAgICAgICAgdGhpcy5zZWxlY3RJdGVtKGN1cnJlbnRBdWRpb1RyYWNrLmlkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVXBkYXRlIHNlbGVjdGlvbiB3aGVuIHNlbGVjdGVkIHRyYWNrIGhhcyBjaGFuZ2VkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fQ0hBTkdFRCwgYXVkaW9UcmFja0hhbmRsZXIpO1xuICAgIC8vIFVwZGF0ZSB0cmFja3Mgd2hlbiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1cGRhdGVBdWRpb1RyYWNrcyk7XG4gICAgLy8gVXBkYXRlIHRyYWNrcyB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgdXBkYXRlQXVkaW9UcmFja3MpO1xuICAgIC8vIFVwZGF0ZSB0cmFja3Mgd2hlbiBhIHRyYWNrIGlzIGFkZGVkIG9yIHJlbW92ZWQgKHNpbmNlIHBsYXllciA3LjEuNClcbiAgICBpZiAocGxheWVyLkVWRU5ULk9OX0FVRElPX0FEREVEICYmIHBsYXllci5FVkVOVC5PTl9BVURJT19SRU1PVkVEKSB7XG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BVURJT19BRERFRCwgdXBkYXRlQXVkaW9UcmFja3MpO1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fUkVNT1ZFRCwgdXBkYXRlQXVkaW9UcmFja3MpO1xuICAgIH1cblxuICAgIC8vIFBvcHVsYXRlIHRyYWNrcyBhdCBzdGFydHVwXG4gICAgdXBkYXRlQXVkaW9UcmFja3MoKTtcblxuICAgIC8vIFdoZW4gYHBsYXliYWNrLmF1ZGlvTGFuZ3VhZ2VgIGlzIHNldCwgdGhlIGBPTl9BVURJT19DSEFOR0VEYCBldmVudCBmb3IgdGhhdCBjaGFuZ2UgaXMgdHJpZ2dlcmVkIGJlZm9yZSB0aGVcbiAgICAvLyBVSSBpcyBjcmVhdGVkLiBUaGVyZWZvcmUgd2UgbmVlZCB0byBzZXQgdGhlIGF1ZGlvIHRyYWNrIG9uIGNvbmZpZ3VyZS5cbiAgICBhdWRpb1RyYWNrSGFuZGxlcigpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQnVmZmVyaW5nT3ZlcmxheX0gY29tcG9uZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1ZmZlcmluZ092ZXJsYXlDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogRGVsYXkgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSBidWZmZXJpbmcgb3ZlcmxheSB3aWxsIGJlIGRpc3BsYXllZC4gVXNlZnVsIHRvIGJ5cGFzcyBzaG9ydCBzdGFsbHMgd2l0aG91dFxuICAgKiBkaXNwbGF5aW5nIHRoZSBvdmVybGF5LiBTZXQgdG8gMCB0byBkaXNwbGF5IHRoZSBvdmVybGF5IGluc3RhbnRseS5cbiAgICogRGVmYXVsdDogMTAwMG1zICgxIHNlY29uZClcbiAgICovXG4gIHNob3dEZWxheU1zPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgYW5kIGRpc3BsYXlzIGEgYnVmZmVyaW5nIGluZGljYXRvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1ZmZlcmluZ092ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8QnVmZmVyaW5nT3ZlcmxheUNvbmZpZz4ge1xuXG4gIHByaXZhdGUgaW5kaWNhdG9yczogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz5bXTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEJ1ZmZlcmluZ092ZXJsYXlDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmluZGljYXRvcnMgPSBbXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgXTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIDxCdWZmZXJpbmdPdmVybGF5Q29uZmlnPntcbiAgICAgIGNzc0NsYXNzOiAndWktYnVmZmVyaW5nLW92ZXJsYXknLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgY29tcG9uZW50czogdGhpcy5pbmRpY2F0b3JzLFxuICAgICAgc2hvd0RlbGF5TXM6IDEwMDAsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8QnVmZmVyaW5nT3ZlcmxheUNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgbGV0IG92ZXJsYXlTaG93VGltZW91dCA9IG5ldyBUaW1lb3V0KGNvbmZpZy5zaG93RGVsYXlNcywgKCkgPT4ge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG5cbiAgICBsZXQgc2hvd092ZXJsYXkgPSAoKSA9PiB7XG4gICAgICBvdmVybGF5U2hvd1RpbWVvdXQuc3RhcnQoKTtcbiAgICB9O1xuXG4gICAgbGV0IGhpZGVPdmVybGF5ID0gKCkgPT4ge1xuICAgICAgb3ZlcmxheVNob3dUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1RBTExfU1RBUlRFRCwgc2hvd092ZXJsYXkpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX0VOREVELCBoaWRlT3ZlcmxheSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCBoaWRlT3ZlcmxheSk7XG5cbiAgICAvLyBTaG93IG92ZXJsYXkgaWYgcGxheWVyIGlzIGFscmVhZHkgc3RhbGxlZCBhdCBpbml0XG4gICAgaWYgKHBsYXllci5pc1N0YWxsZWQoKSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudENvbmZpZywgQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyLCBOb0FyZ3MsIEV2ZW50fSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBCdXR0b259IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdXR0b25Db25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICAvKipcbiAgICogVGhlIHRleHQgb24gdGhlIGJ1dHRvbi5cbiAgICovXG4gIHRleHQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBzaW1wbGUgY2xpY2thYmxlIGJ1dHRvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1dHRvbjxDb25maWcgZXh0ZW5kcyBCdXR0b25Db25maWc+IGV4dGVuZHMgQ29tcG9uZW50PEJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgYnV0dG9uRXZlbnRzID0ge1xuICAgIG9uQ2xpY2s6IG5ldyBFdmVudERpc3BhdGNoZXI8QnV0dG9uPENvbmZpZz4sIE5vQXJncz4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQnV0dG9uQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktYnV0dG9uJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICAvLyBDcmVhdGUgdGhlIGJ1dHRvbiBlbGVtZW50IHdpdGggdGhlIHRleHQgbGFiZWxcbiAgICBsZXQgYnV0dG9uRWxlbWVudCA9IG5ldyBET00oJ2J1dHRvbicsIHtcbiAgICAgICd0eXBlJzogJ2J1dHRvbicsXG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSkuYXBwZW5kKG5ldyBET00oJ3NwYW4nLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnbGFiZWwnKVxuICAgIH0pLmh0bWwodGhpcy5jb25maWcudGV4dCkpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGJ1dHRvbiBlbGVtZW50IGFuZCB0cmlnZ2VyIHRoZSBjb3JyZXNwb25kaW5nIGV2ZW50IG9uIHRoZSBidXR0b24gY29tcG9uZW50XG4gICAgYnV0dG9uRWxlbWVudC5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLm9uQ2xpY2tFdmVudCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGJ1dHRvbkVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0ZXh0IG9uIHRoZSBsYWJlbCBvZiB0aGUgYnV0dG9uLlxuICAgKiBAcGFyYW0gdGV4dCB0aGUgdGV4dCB0byBwdXQgaW50byB0aGUgbGFiZWwgb2YgdGhlIGJ1dHRvblxuICAgKi9cbiAgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5maW5kKCcuJyArIHRoaXMucHJlZml4Q3NzKCdsYWJlbCcpKS5odG1sKHRleHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uQ2xpY2tFdmVudCgpIHtcbiAgICB0aGlzLmJ1dHRvbkV2ZW50cy5vbkNsaWNrLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxCdXR0b248Q29uZmlnPiwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvbkNsaWNrKCk6IEV2ZW50PEJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5idXR0b25FdmVudHMub25DbGljay5nZXRFdmVudCgpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBDYXN0V2FpdGluZ0ZvckRldmljZUV2ZW50ID0gYml0bW92aW4uUGxheWVyQVBJLkNhc3RXYWl0aW5nRm9yRGV2aWNlRXZlbnQ7XG5pbXBvcnQgQ2FzdFN0YXJ0ZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5DYXN0U3RhcnRlZEV2ZW50O1xuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgYW5kIGRpc3BsYXlzIHRoZSBzdGF0dXMgb2YgYSBDYXN0IHNlc3Npb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXN0U3RhdHVzT3ZlcmxheSBleHRlbmRzIENvbnRhaW5lcjxDb250YWluZXJDb25maWc+IHtcblxuICBwcml2YXRlIHN0YXR1c0xhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb250YWluZXJDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLnN0YXR1c0xhYmVsID0gbmV3IExhYmVsPExhYmVsQ29uZmlnPih7IGNzc0NsYXNzOiAndWktY2FzdC1zdGF0dXMtbGFiZWwnIH0pO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1jYXN0LXN0YXR1cy1vdmVybGF5JyxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLnN0YXR1c0xhYmVsXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1dBSVRJTkdfRk9SX0RFVklDRSxcbiAgICAgIChldmVudDogQ2FzdFdhaXRpbmdGb3JEZXZpY2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgLy8gR2V0IGRldmljZSBuYW1lIGFuZCB1cGRhdGUgc3RhdHVzIHRleHQgd2hpbGUgY29ubmVjdGluZ1xuICAgICAgICBsZXQgY2FzdERldmljZU5hbWUgPSBldmVudC5jYXN0UGF5bG9hZC5kZXZpY2VOYW1lO1xuICAgICAgICB0aGlzLnN0YXR1c0xhYmVsLnNldFRleHQoYENvbm5lY3RpbmcgdG8gPHN0cm9uZz4ke2Nhc3REZXZpY2VOYW1lfTwvc3Ryb25nPi4uLmApO1xuICAgICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVEVELCAoZXZlbnQ6IENhc3RTdGFydGVkRXZlbnQpID0+IHtcbiAgICAgIC8vIFNlc3Npb24gaXMgc3RhcnRlZCBvciByZXN1bWVkXG4gICAgICAvLyBGb3IgY2FzZXMgd2hlbiBhIHNlc3Npb24gaXMgcmVzdW1lZCwgd2UgZG8gbm90IHJlY2VpdmUgdGhlIHByZXZpb3VzIGV2ZW50cyBhbmQgdGhlcmVmb3JlIHNob3cgdGhlIHN0YXR1cyBwYW5lbFxuICAgICAgLy8gaGVyZSB0b29cbiAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgbGV0IGNhc3REZXZpY2VOYW1lID0gZXZlbnQuZGV2aWNlTmFtZTtcbiAgICAgIHRoaXMuc3RhdHVzTGFiZWwuc2V0VGV4dChgUGxheWluZyBvbiA8c3Ryb25nPiR7Y2FzdERldmljZU5hbWV9PC9zdHJvbmc+YCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVE9QUEVELCAoZXZlbnQpID0+IHtcbiAgICAgIC8vIENhc3Qgc2Vzc2lvbiBnb25lLCBoaWRlIHRoZSBzdGF0dXMgcGFuZWxcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgY2FzdGluZyB0byBhIENhc3QgcmVjZWl2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXN0VG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1jYXN0dG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdHb29nbGUgQ2FzdCdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzQ2FzdEF2YWlsYWJsZSgpKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgICAgICBwbGF5ZXIuY2FzdFN0b3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5ZXIuY2FzdFZpZGVvKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Nhc3QgdW5hdmFpbGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGNhc3RBdmFpbGFibGVIYW5kZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzQ2FzdEF2YWlsYWJsZSgpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfQVZBSUxBQkxFLCBjYXN0QXZhaWxhYmxlSGFuZGVyKTtcblxuICAgIC8vIFRvZ2dsZSBidXR0b24gJ29uJyBzdGF0ZVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfV0FJVElOR19GT1JfREVWSUNFLCAoKSA9PiB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVEVELCAoKSA9PiB7XG4gICAgICAvLyBXaGVuIGEgc2Vzc2lvbiBpcyByZXN1bWVkLCB0aGVyZSBpcyBubyBPTl9DQVNUX1NUQVJUIGV2ZW50LCBzbyB3ZSBhbHNvIG5lZWQgdG8gdG9nZ2xlIGhlcmUgZm9yIHN1Y2ggY2FzZXNcbiAgICAgIHRoaXMub24oKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUT1BQRUQsICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBjYXN0QXZhaWxhYmxlSGFuZGVyKCk7IC8vIEhpZGUgYnV0dG9uIGlmIENhc3Qgbm90IGF2YWlsYWJsZVxuICAgIGlmIChwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgIHRoaXMub24oKTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge1VJQ29udGFpbmVyLCBVSUNvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi91aWNvbnRhaW5lcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcblxuLyoqXG4gKiBUaGUgYmFzZSBjb250YWluZXIgZm9yIENhc3QgcmVjZWl2ZXJzIHRoYXQgY29udGFpbnMgYWxsIG9mIHRoZSBVSSBhbmQgdGFrZXMgY2FyZSB0aGF0IHRoZSBVSSBpcyBzaG93biBvblxuICogY2VydGFpbiBwbGF5YmFjayBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXN0VUlDb250YWluZXIgZXh0ZW5kcyBVSUNvbnRhaW5lciB7XG5cbiAgcHJpdmF0ZSBjYXN0VWlIaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFVJQ29udGFpbmVyQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPFVJQ29udGFpbmVyQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICAvKlxuICAgICAqIFNob3cgVUkgb24gQ2FzdCBkZXZpY2VzIGF0IGNlcnRhaW4gcGxheWJhY2sgZXZlbnRzXG4gICAgICpcbiAgICAgKiBTaW5jZSBhIENhc3QgcmVjZWl2ZXIgZG9lcyBub3QgaGF2ZSBhIGRpcmVjdCBIQ0ksIHdlIHNob3cgdGhlIFVJIG9uIGNlcnRhaW4gcGxheWJhY2sgZXZlbnRzIHRvIGdpdmUgdGhlIHVzZXJcbiAgICAgKiBhIGNoYW5jZSB0byBzZWUgb24gdGhlIHNjcmVlbiB3aGF0J3MgZ29pbmcgb24sIGUuZy4gb24gcGxheS9wYXVzZSBvciBhIHNlZWsgdGhlIFVJIGlzIHNob3duIGFuZCB0aGUgdXNlciBjYW5cbiAgICAgKiBzZWUgdGhlIGN1cnJlbnQgdGltZSBhbmQgcG9zaXRpb24gb24gdGhlIHNlZWsgYmFyLlxuICAgICAqIFRoZSBVSSBpcyBzaG93biBwZXJtYW5lbnRseSB3aGlsZSBwbGF5YmFjayBpcyBwYXVzZWQsIG90aGVyd2lzZSBoaWRlcyBhdXRvbWF0aWNhbGx5IGFmdGVyIHRoZSBjb25maWd1cmVkXG4gICAgICogaGlkZSBkZWxheSB0aW1lLlxuICAgICAqL1xuXG4gICAgbGV0IGlzVWlTaG93biA9IGZhbHNlO1xuXG4gICAgbGV0IGhpZGVVaSA9ICgpID0+IHtcbiAgICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzSGlkZS5kaXNwYXRjaCh0aGlzKTtcbiAgICAgIGlzVWlTaG93biA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB0aGlzLmNhc3RVaUhpZGVUaW1lb3V0ID0gbmV3IFRpbWVvdXQoY29uZmlnLmhpZGVEZWxheSwgaGlkZVVpKTtcblxuICAgIGxldCBzaG93VWkgPSAoKSA9PiB7XG4gICAgICBpZiAoIWlzVWlTaG93bikge1xuICAgICAgICB1aW1hbmFnZXIub25Db250cm9sc1Nob3cuZGlzcGF0Y2godGhpcyk7XG4gICAgICAgIGlzVWlTaG93biA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCBzaG93VWlQZXJtYW5lbnRseSA9ICgpID0+IHtcbiAgICAgIHNob3dVaSgpO1xuICAgICAgdGhpcy5jYXN0VWlIaWRlVGltZW91dC5jbGVhcigpO1xuICAgIH07XG5cbiAgICBsZXQgc2hvd1VpV2l0aFRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICAgIHRoaXMuY2FzdFVpSGlkZVRpbWVvdXQuc3RhcnQoKTtcbiAgICB9O1xuXG4gICAgbGV0IHNob3dVaUFmdGVyU2VlayA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgICAgc2hvd1VpV2l0aFRpbWVvdXQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dVaVBlcm1hbmVudGx5KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBzaG93VWlXaXRoVGltZW91dCk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX0xPQURFRCwgc2hvd1VpV2l0aFRpbWVvdXQpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVksIHNob3dVaVdpdGhUaW1lb3V0KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QQVVTRUQsIHNob3dVaVBlcm1hbmVudGx5KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TRUVLLCBzaG93VWlQZXJtYW5lbnRseSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCBzaG93VWlBZnRlclNlZWspO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBzdXBlci5yZWxlYXNlKCk7XG4gICAgdGhpcy5jYXN0VWlIaWRlVGltZW91dC5jbGVhcigpO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7TGFiZWwsIExhYmVsQ29uZmlnfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7RXZlbnQsIEV2ZW50RGlzcGF0Y2hlciwgTm9BcmdzfSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuaW1wb3J0IENvbmZpZyA9IGJpdG1vdmluLlBsYXllckFQSS5Db25maWc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIENoZWNrYm94fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDaGVja2JveENvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgbGFiZWwgZm9yIHRoZSBjaGVja2JveC5cbiAgICovXG4gIHRleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENoZWNrYm94IGV4dGVuZHMgQ29udGFpbmVyPENoZWNrYm94Q29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBsYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIGJ1dHRvbjogVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz47XG5cbiAgcHJpdmF0ZSBjaGVja2JveEV2ZW50cyA9IHtcbiAgICBvbkNsaWNrOiBuZXcgRXZlbnREaXNwYXRjaGVyPENoZWNrYm94LCBOb0FyZ3M+KCksXG4gICAgb25DaGFuZ2U6IG5ldyBFdmVudERpc3BhdGNoZXI8Q2hlY2tib3gsIE5vQXJncz4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ2hlY2tib3hDb25maWcgPSB7dGV4dDogJyd9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMubGFiZWwgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzZXM6IFsnY2hlY2tib3gtbGFiZWwnXSwgdGV4dDogY29uZmlnLnRleHR9KTtcbiAgICB0aGlzLmJ1dHRvbiA9IG5ldyBUb2dnbGVCdXR0b24oe2Nzc0NsYXNzZXM6IFsnY2hlY2tib3gtYnV0dG9uJ119KTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2hlY2tib3gnLFxuICAgICAgY29tcG9uZW50czogW3RoaXMuYnV0dG9uLCB0aGlzLmxhYmVsXVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBjbGljayBldmVudCBvbiB0aGUgZWxlbWVudCBhbmRcbiAgICAvLyB0cmlnZ2VyIHRoZSBjb3JyZXNwb25kaW5nIGV2ZW50cyBvbiB0aGUgYnV0dG9uIGNvbXBvbmVudFxuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuYnV0dG9uLnRvZ2dsZSgpXG4gICAgICB0aGlzLm9uQ2xpY2tFdmVudCgpXG4gICAgICB0aGlzLm9uQ2hhbmdlRXZlbnQoKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYXJiaXRyYXJ5IHRleHQgb24gdGhlIGxhYmVsLlxuICAgKiBAcGFyYW0gdGV4dCB0aGUgdGV4dCB0byBzaG93IG9uIHRoZSBsYWJlbFxuICAgKi9cbiAgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxhYmVsLnNldFRleHQodGV4dCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25DbGlja0V2ZW50KCkge1xuICAgIHRoaXMuY2hlY2tib3hFdmVudHMub25DbGljay5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNoYW5nZUV2ZW50KCkge1xuICAgIHRoaXMuY2hlY2tib3hFdmVudHMub25DaGFuZ2UuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAgICogQHJldHVybnMge0V2ZW50PENoZWNrYm94LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uQ2xpY2soKTogRXZlbnQ8Q2hlY2tib3gsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrYm94RXZlbnRzLm9uQ2xpY2suZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICogQHJldHVybnMge0V2ZW50PENoZWNrYm94LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uQ2hhbmdlKCk6IEV2ZW50PENoZWNrYm94LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jaGVja2JveEV2ZW50cy5vbkNoYW5nZS5nZXRFdmVudCgpO1xuICB9XG5cbiAgZ2V0IGlzT24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uLmlzT24oKVxuICB9XG59IiwiaW1wb3J0IHtCdXR0b24sIEJ1dHRvbkNvbmZpZ30gZnJvbSAnLi9idXR0b24nO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBDbGlja092ZXJsYXl9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsaWNrT3ZlcmxheUNvbmZpZyBleHRlbmRzIEJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdXJsIHRvIG9wZW4gd2hlbiB0aGUgb3ZlcmxheSBpcyBjbGlja2VkLiBTZXQgdG8gbnVsbCB0byBkaXNhYmxlIHRoZSBjbGljayBoYW5kbGVyLlxuICAgKi9cbiAgdXJsPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgY2xpY2sgb3ZlcmxheSB0aGF0IG9wZW5zIGFuIHVybCBpbiBhIG5ldyB0YWIgaWYgY2xpY2tlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIENsaWNrT3ZlcmxheSBleHRlbmRzIEJ1dHRvbjxDbGlja092ZXJsYXlDb25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENsaWNrT3ZlcmxheUNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2xpY2tvdmVybGF5J1xuICAgIH0sIDxDbGlja092ZXJsYXlDb25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLnNldFVybCgoPENsaWNrT3ZlcmxheUNvbmZpZz50aGlzLmNvbmZpZykudXJsKTtcbiAgICBsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RG9tRWxlbWVudCgpO1xuICAgIGVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQuZGF0YSgndXJsJykpIHtcbiAgICAgICAgd2luZG93Lm9wZW4oZWxlbWVudC5kYXRhKCd1cmwnKSwgJ19ibGFuaycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIFVSTCB0aGF0IHNob3VsZCBiZSBmb2xsb3dlZCB3aGVuIHRoZSB3YXRlcm1hcmsgaXMgY2xpY2tlZC5cbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHdhdGVybWFyayBVUkxcbiAgICovXG4gIGdldFVybCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldERvbUVsZW1lbnQoKS5kYXRhKCd1cmwnKTtcbiAgfVxuXG4gIHNldFVybCh1cmw6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT0gbnVsbCkge1xuICAgICAgdXJsID0gJyc7XG4gICAgfVxuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmRhdGEoJ3VybCcsIHVybCk7XG4gIH1cbn0iLCJpbXBvcnQge0J1dHRvbkNvbmZpZywgQnV0dG9ufSBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIENsb3NlQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbG9zZUJ1dHRvbkNvbmZpZyBleHRlbmRzIEJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIGNsb3NlZCB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAgICovXG4gIHRhcmdldDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz47XG59XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCBjbG9zZXMgKGhpZGVzKSBhIGNvbmZpZ3VyZWQgY29tcG9uZW50LlxuICovXG5leHBvcnQgY2xhc3MgQ2xvc2VCdXR0b24gZXh0ZW5kcyBCdXR0b248Q2xvc2VCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENsb3NlQnV0dG9uQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2xvc2VidXR0b24nLFxuICAgICAgdGV4dDogJ0Nsb3NlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPENsb3NlQnV0dG9uQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbmZpZy50YXJnZXQuaGlkZSgpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9uQ29uZmlnIGV4dGVuZHMgVG9nZ2xlQnV0dG9uQ29uZmlnIHtcblxufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyB2aXNpYmlsaXR5IG9mIGEgZW1iZWRWaWRlbyBwYW5lbC5cbiAqL1xuZXhwb3J0IGNsYXNzIENsb3NlZENhcHRpb25pbmdUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248Q2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2xvc2VkY2FwdGlvbmluZy10b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ0Nsb3NlZCBDYXB0aW9uaW5nJ1xuICAgIH0sIDxDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPENsb3NlZENhcHRpb25pbmdUb2dnbGVCdXR0b25Db25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBmaXggZ2VuZXJpY3MgdHlwZSBpbmZlcmVuY2VcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2Nsb3NlZCBjYXB0aW9uaW5nIGJ1dHRvbiBjbGlja2VkJylcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1NlZWtCYXJ9IGZyb20gJy4vc2Vla2Jhcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQ29tbWVudHNUb2dnbGVCdXR0b259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbW1lbnRzVG9nZ2xlQnV0dG9uQ29uZmlnIGV4dGVuZHMgVG9nZ2xlQnV0dG9uQ29uZmlnIHtcbiAgc2Vla0JhcjogU2Vla0JhclxufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyB2aXNpYmlsaXR5IG9mIGEgZW1iZWRWaWRlbyBwYW5lbC5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbW1lbnRzVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPENvbW1lbnRzVG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzZWVrQmFyOiBTZWVrQmFyXG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb21tZW50c1RvZ2dsZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICBpZiAoIWNvbmZpZy5zZWVrQmFyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIFNlZWtCYXIgaXMgbWlzc2luZycpO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY29tbWVudHMtdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdDb21tZW50cycsXG4gICAgICBzZWVrQmFyOiBudWxsXG4gICAgfSwgPENvbW1lbnRzVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPENvbW1lbnRzVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7IC8vIFRPRE8gZml4IGdlbmVyaWNzIHR5cGUgaW5mZXJlbmNlXG4gICAgbGV0IHNlZWtCYXIgPSBjb25maWcuc2Vla0JhclxuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzZWVrQmFyLnRvZ2dsZUNvbW1lbnRzT24oKVxuICAgIH0pO1xuXG4gICAgbGV0IHVwZGF0ZU9uT2ZmID0gKCkgPT4ge1xuICAgICAgaWYgKHNlZWtCYXIuY29tbWVudHNPbikge1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9mZigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNlZWtCYXIub25DaGFuZ2VDb21tZW50c09uLnN1YnNjcmliZSgoZSwgb24pID0+IHtcbiAgICAgIHVwZGF0ZU9uT2ZmKCk7XG4gICAgfSk7XG5cbiAgICB1cGRhdGVPbk9mZigpO1xuICB9XG59IiwiaW1wb3J0IHtHdWlkfSBmcm9tICcuLi9ndWlkJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtFdmVudERpc3BhdGNoZXIsIE5vQXJncywgRXZlbnR9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEJhc2UgY29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEgY29tcG9uZW50LlxuICogU2hvdWxkIGJlIGV4dGVuZGVkIGJ5IGNvbXBvbmVudHMgdGhhdCB3YW50IHRvIGFkZCBhZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRDb25maWcge1xuICAvKipcbiAgICogVGhlIEhUTUwgdGFnIG5hbWUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICogRGVmYXVsdDogJ2RpdidcbiAgICovXG4gIHRhZz86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBIVE1MIElEIG9mIHRoZSBjb21wb25lbnQuXG4gICAqIERlZmF1bHQ6IGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIHdpdGggcGF0dGVybiAndWktaWQte2d1aWR9Jy5cbiAgICovXG4gIGlkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHByZWZpeCB0byBwcmVwZW5kIGFsbCBDU1MgY2xhc3NlcyB3aXRoLlxuICAgKi9cbiAgY3NzUHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzZXMgb2YgdGhlIGNvbXBvbmVudC4gVGhpcyBpcyB1c3VhbGx5IHRoZSBjbGFzcyBmcm9tIHdoZXJlIHRoZSBjb21wb25lbnQgdGFrZXMgaXRzIHN0eWxpbmcuXG4gICAqL1xuICBjc3NDbGFzcz86IHN0cmluZzsgLy8gJ2NsYXNzJyBpcyBhIHJlc2VydmVkIGtleXdvcmQsIHNvIHdlIG5lZWQgdG8gbWFrZSB0aGUgbmFtZSBtb3JlIGNvbXBsaWNhdGVkXG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgQ1NTIGNsYXNzZXMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIGNzc0NsYXNzZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGlmIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGhpZGRlbiBhdCBzdGFydHVwLlxuICAgKiBEZWZhdWx0OiBmYWxzZVxuICAgKi9cbiAgaGlkZGVuPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3MgZXh0ZW5kcyBOb0FyZ3Mge1xuICAvKipcbiAgICogVHJ1ZSBpcyB0aGUgY29tcG9uZW50IGlzIGhvdmVyZWQsIGVsc2UgZmFsc2UuXG4gICAqL1xuICBob3ZlcmVkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIG9mIHRoZSBVSSBmcmFtZXdvcmsuXG4gKiBFYWNoIGNvbXBvbmVudCBtdXN0IGV4dGVuZCB0aGlzIGNsYXNzIGFuZCBvcHRpb25hbGx5IHRoZSBjb25maWcgaW50ZXJmYWNlLlxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PENvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZz4ge1xuXG4gIC8qKlxuICAgKiBUaGUgY2xhc3NuYW1lIHRoYXQgaXMgYXR0YWNoZWQgdG8gdGhlIGVsZW1lbnQgd2hlbiBpdCBpcyBpbiB0aGUgaGlkZGVuIHN0YXRlLlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfSElEREVOID0gJ2hpZGRlbic7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gb2JqZWN0IG9mIHRoaXMgY29tcG9uZW50LlxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbmZpZzogQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBUaGUgY29tcG9uZW50J3MgRE9NIGVsZW1lbnQuXG4gICAqL1xuICBwcml2YXRlIGVsZW1lbnQ6IERPTTtcblxuICAvKipcbiAgICogRmxhZyB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBoaWRkZW4gc3RhdGUuXG4gICAqL1xuICBwcml2YXRlIGhpZGRlbjogYm9vbGVhbjtcblxuICAvKipcbiAgICogRmxhZyB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBob3ZlciBzdGF0ZS5cbiAgICovXG4gIHByaXZhdGUgaG92ZXJlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgZXZlbnRzIHRoYXQgdGhpcyBjb21wb25lbnQgb2ZmZXJzLiBUaGVzZSBldmVudHMgc2hvdWxkIGFsd2F5cyBiZSBwcml2YXRlIGFuZCBvbmx5IGRpcmVjdGx5XG4gICAqIGFjY2Vzc2VkIGZyb20gd2l0aGluIHRoZSBpbXBsZW1lbnRpbmcgY29tcG9uZW50LlxuICAgKlxuICAgKiBCZWNhdXNlIFR5cGVTY3JpcHQgZG9lcyBub3Qgc3VwcG9ydCBwcml2YXRlIHByb3BlcnRpZXMgd2l0aCB0aGUgc2FtZSBuYW1lIG9uIGRpZmZlcmVudCBjbGFzcyBoaWVyYXJjaHkgbGV2ZWxzXG4gICAqIChpLmUuIHN1cGVyY2xhc3MgYW5kIHN1YmNsYXNzIGNhbm5vdCBjb250YWluIGEgcHJpdmF0ZSBwcm9wZXJ0eSB3aXRoIHRoZSBzYW1lIG5hbWUpLCB0aGUgZGVmYXVsdCBuYW1pbmdcbiAgICogY29udmVudGlvbiBmb3IgdGhlIGV2ZW50IGxpc3Qgb2YgYSBjb21wb25lbnQgdGhhdCBzaG91bGQgYmUgZm9sbG93ZWQgYnkgc3ViY2xhc3NlcyBpcyB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGVcbiAgICogY2FtZWwtY2FzZWQgY2xhc3MgbmFtZSArICdFdmVudHMnIChlLmcuIFN1YkNsYXNzIGV4dGVuZHMgQ29tcG9uZW50ID0+IHN1YkNsYXNzRXZlbnRzKS5cbiAgICogU2VlIHtAbGluayAjY29tcG9uZW50RXZlbnRzfSBmb3IgYW4gZXhhbXBsZS5cbiAgICpcbiAgICogRXZlbnQgcHJvcGVydGllcyBzaG91bGQgYmUgbmFtZWQgaW4gY2FtZWwgY2FzZSB3aXRoIGFuICdvbicgcHJlZml4IGFuZCBpbiB0aGUgcHJlc2VudCB0ZW5zZS4gQXN5bmMgZXZlbnRzIG1heVxuICAgKiBoYXZlIGEgc3RhcnQgZXZlbnQgKHdoZW4gdGhlIG9wZXJhdGlvbiBzdGFydHMpIGluIHRoZSBwcmVzZW50IHRlbnNlLCBhbmQgbXVzdCBoYXZlIGFuIGVuZCBldmVudCAod2hlbiB0aGVcbiAgICogb3BlcmF0aW9uIGVuZHMpIGluIHRoZSBwYXN0IHRlbnNlIChvciBwcmVzZW50IHRlbnNlIGluIHNwZWNpYWwgY2FzZXMgKGUuZy4gb25TdGFydC9vblN0YXJ0ZWQgb3Igb25QbGF5L29uUGxheWluZykuXG4gICAqIFNlZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyNvblNob3d9IGZvciBhbiBleGFtcGxlLlxuICAgKlxuICAgKiBFYWNoIGV2ZW50IHNob3VsZCBiZSBhY2NvbXBhbmllZCB3aXRoIGEgcHJvdGVjdGVkIG1ldGhvZCBuYW1lZCBieSB0aGUgY29udmVudGlvbiBldmVudE5hbWUgKyAnRXZlbnQnXG4gICAqIChlLmcuIG9uU3RhcnRFdmVudCksIHRoYXQgYWN0dWFsbHkgdHJpZ2dlcnMgdGhlIGV2ZW50IGJ5IGNhbGxpbmcge0BsaW5rIEV2ZW50RGlzcGF0Y2hlciNkaXNwYXRjaCBkaXNwYXRjaH0gYW5kXG4gICAqIHBhc3NpbmcgYSByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBhcyBmaXJzdCBwYXJhbWV0ZXIuIENvbXBvbmVudHMgc2hvdWxkIGFsd2F5cyB0cmlnZ2VyIHRoZWlyIGV2ZW50cyB3aXRoIHRoZXNlXG4gICAqIG1ldGhvZHMuIEltcGxlbWVudGluZyB0aGlzIHBhdHRlcm4gZ2l2ZXMgc3ViY2xhc3NlcyBtZWFucyB0byBkaXJlY3RseSBsaXN0ZW4gdG8gdGhlIGV2ZW50cyBieSBvdmVycmlkaW5nIHRoZVxuICAgKiBtZXRob2QgKGFuZCBzYXZpbmcgdGhlIG92ZXJoZWFkIG9mIHBhc3NpbmcgYSBoYW5kbGVyIHRvIHRoZSBldmVudCBkaXNwYXRjaGVyKSBhbmQgbW9yZSBpbXBvcnRhbnRseSB0byB0cmlnZ2VyXG4gICAqIHRoZXNlIGV2ZW50cyB3aXRob3V0IGhhdmluZyBhY2Nlc3MgdG8gdGhlIHByaXZhdGUgZXZlbnQgbGlzdC5cbiAgICogU2VlIHtAbGluayAjb25TaG93fSBmb3IgYW4gZXhhbXBsZS5cbiAgICpcbiAgICogVG8gcHJvdmlkZSBleHRlcm5hbCBjb2RlIHRoZSBwb3NzaWJpbGl0eSB0byBsaXN0ZW4gdG8gdGhpcyBjb21wb25lbnQncyBldmVudHMgKHN1YnNjcmliZSwgdW5zdWJzY3JpYmUsIGV0Yy4pLFxuICAgKiBlYWNoIGV2ZW50IHNob3VsZCBhbHNvIGJlIGFjY29tcGFuaWVkIGJ5IGEgcHVibGljIGdldHRlciBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgdGhlIGV2ZW50J3MgcHJvcGVydHksXG4gICAqIHRoYXQgcmV0dXJucyB0aGUge0BsaW5rIEV2ZW50fSBvYnRhaW5lZCBmcm9tIHRoZSBldmVudCBkaXNwYXRjaGVyIGJ5IGNhbGxpbmcge0BsaW5rIEV2ZW50RGlzcGF0Y2hlciNnZXRFdmVudH0uXG4gICAqIFNlZSB7QGxpbmsgI29uU2hvd30gZm9yIGFuIGV4YW1wbGUuXG4gICAqXG4gICAqIEZ1bGwgZXhhbXBsZSBmb3IgYW4gZXZlbnQgcmVwcmVzZW50aW5nIGFuIGV4YW1wbGUgYWN0aW9uIGluIGEgZXhhbXBsZSBjb21wb25lbnQ6XG4gICAqXG4gICAqIDxjb2RlPlxuICAgKiAvLyBEZWZpbmUgYW4gZXhhbXBsZSBjb21wb25lbnQgY2xhc3Mgd2l0aCBhbiBleGFtcGxlIGV2ZW50XG4gICAqIGNsYXNzIEV4YW1wbGVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiB7XG4gICAgICpcbiAgICAgKiAgICAgcHJpdmF0ZSBleGFtcGxlQ29tcG9uZW50RXZlbnRzID0ge1xuICAgICAqICAgICAgICAgb25FeGFtcGxlQWN0aW9uOiBuZXcgRXZlbnREaXNwYXRjaGVyPEV4YW1wbGVDb21wb25lbnQsIE5vQXJncz4oKVxuICAgICAqICAgICB9XG4gICAgICpcbiAgICAgKiAgICAgLy8gY29uc3RydWN0b3IgYW5kIG90aGVyIHN0dWZmLi4uXG4gICAgICpcbiAgICAgKiAgICAgcHJvdGVjdGVkIG9uRXhhbXBsZUFjdGlvbkV2ZW50KCkge1xuICAgICAqICAgICAgICB0aGlzLmV4YW1wbGVDb21wb25lbnRFdmVudHMub25FeGFtcGxlQWN0aW9uLmRpc3BhdGNoKHRoaXMpO1xuICAgICAqICAgIH1cbiAgICAgKlxuICAgICAqICAgIGdldCBvbkV4YW1wbGVBY3Rpb24oKTogRXZlbnQ8RXhhbXBsZUNvbXBvbmVudCwgTm9BcmdzPiB7XG4gICAgICogICAgICAgIHJldHVybiB0aGlzLmV4YW1wbGVDb21wb25lbnRFdmVudHMub25FeGFtcGxlQWN0aW9uLmdldEV2ZW50KCk7XG4gICAgICogICAgfVxuICAgICAqIH1cbiAgICpcbiAgICogLy8gQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgc29tZXdoZXJlXG4gICAqIHZhciBleGFtcGxlQ29tcG9uZW50SW5zdGFuY2UgPSBuZXcgRXhhbXBsZUNvbXBvbmVudCgpO1xuICAgKlxuICAgKiAvLyBTdWJzY3JpYmUgdG8gdGhlIGV4YW1wbGUgZXZlbnQgb24gdGhlIGNvbXBvbmVudFxuICAgKiBleGFtcGxlQ29tcG9uZW50SW5zdGFuY2Uub25FeGFtcGxlQWN0aW9uLnN1YnNjcmliZShmdW5jdGlvbiAoc2VuZGVyOiBFeGFtcGxlQ29tcG9uZW50KSB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKCdvbkV4YW1wbGVBY3Rpb24gb2YgJyArIHNlbmRlciArICcgaGFzIGZpcmVkIScpO1xuICAgICAqIH0pO1xuICAgKiA8L2NvZGU+XG4gICAqL1xuICBwcml2YXRlIGNvbXBvbmVudEV2ZW50cyA9IHtcbiAgICBvblNob3c6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvbkhpZGU6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvbkhvdmVyQ2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29uZmlnPiwgQ29tcG9uZW50SG92ZXJDaGFuZ2VkRXZlbnRBcmdzPigpLFxuICB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgY29tcG9uZW50IHdpdGggYW4gb3B0aW9uYWxseSBzdXBwbGllZCBjb25maWcuIEFsbCBzdWJjbGFzc2VzIG11c3QgY2FsbCB0aGUgY29uc3RydWN0b3Igb2YgdGhlaXJcbiAgICogc3VwZXJjbGFzcyBhbmQgdGhlbiBtZXJnZSB0aGVpciBjb25maWd1cmF0aW9uIGludG8gdGhlIGNvbXBvbmVudCdzIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBjb21wb25lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29tcG9uZW50Q29uZmlnID0ge30pIHtcbiAgICAvLyBDcmVhdGUgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoaXMgY29tcG9uZW50XG4gICAgdGhpcy5jb25maWcgPSA8Q29uZmlnPnRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICB0YWc6ICdkaXYnLFxuICAgICAgaWQ6ICdibXB1aS1pZC0nICsgR3VpZC5uZXh0KCksXG4gICAgICBjc3NQcmVmaXg6ICdibXB1aScsXG4gICAgICBjc3NDbGFzczogJ3VpLWNvbXBvbmVudCcsXG4gICAgICBjc3NDbGFzc2VzOiBbXSxcbiAgICAgIGhpZGRlbjogZmFsc2VcbiAgICB9LCB7fSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGNvbXBvbmVudCwgZS5nLiBieSBhcHBseWluZyBjb25maWcgc2V0dGluZ3MuXG4gICAqIFRoaXMgbWV0aG9kIG11c3Qgbm90IGJlIGNhbGxlZCBmcm9tIG91dHNpZGUgdGhlIFVJIGZyYW1ld29yay5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgYnkgdGhlIHtAbGluayBVSUluc3RhbmNlTWFuYWdlcn0uIElmIHRoZSBjb21wb25lbnQgaXMgYW4gaW5uZXIgY29tcG9uZW50IG9mXG4gICAqIHNvbWUgY29tcG9uZW50LCBhbmQgdGh1cyBlbmNhcHN1bGF0ZWQgYWJkIG1hbmFnZWQgaW50ZXJuYWxseSBhbmQgbmV2ZXIgZGlyZWN0bHkgZXhwb3NlZCB0byB0aGUgVUlNYW5hZ2VyLFxuICAgKiB0aGlzIG1ldGhvZCBtdXN0IGJlIGNhbGxlZCBmcm9tIHRoZSBtYW5hZ2luZyBjb21wb25lbnQncyB7QGxpbmsgI2luaXRpYWxpemV9IG1ldGhvZC5cbiAgICovXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgdGhpcy5oaWRkZW4gPSB0aGlzLmNvbmZpZy5oaWRkZW47XG5cbiAgICAvLyBIaWRlIHRoZSBjb21wb25lbnQgYXQgaW5pdGlhbGl6YXRpb24gaWYgaXQgaXMgY29uZmlndXJlZCB0byBiZSBoaWRkZW5cbiAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICB0aGlzLmhpZGRlbiA9IGZhbHNlOyAvLyBTZXQgZmxhZyB0byBmYWxzZSBmb3IgdGhlIGZvbGxvd2luZyBoaWRlKCkgY2FsbCB0byB3b3JrIChoaWRlKCkgY2hlY2tzIHRoZSBmbGFnKVxuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIGNvbXBvbmVudCBmb3IgdGhlIHN1cHBsaWVkIFBsYXllciBhbmQgVUlJbnN0YW5jZU1hbmFnZXIuIFRoaXMgaXMgdGhlIHBsYWNlIHdoZXJlIGFsbCB0aGUgbWFnaWNcbiAgICogaGFwcGVucywgd2hlcmUgY29tcG9uZW50cyB0eXBpY2FsbHkgc3Vic2NyaWJlIGFuZCByZWFjdCB0byBldmVudHMgKG9uIHRoZWlyIERPTSBlbGVtZW50LCB0aGUgUGxheWVyLCBvciB0aGVcbiAgICogVUlJbnN0YW5jZU1hbmFnZXIpLCBhbmQgYmFzaWNhbGx5IGV2ZXJ5dGhpbmcgdGhhdCBtYWtlcyB0aGVtIGludGVyYWN0aXZlLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgb25seSBvbmNlLCB3aGVuIHRoZSBVSU1hbmFnZXIgaW5pdGlhbGl6ZXMgdGhlIFVJLlxuICAgKlxuICAgKiBTdWJjbGFzc2VzIHVzdWFsbHkgb3ZlcndyaXRlIHRoaXMgbWV0aG9kIHRvIGFkZCB0aGVpciBvd24gZnVuY3Rpb25hbGl0eS5cbiAgICpcbiAgICogQHBhcmFtIHBsYXllciB0aGUgcGxheWVyIHdoaWNoIHRoaXMgY29tcG9uZW50IGNvbnRyb2xzXG4gICAqIEBwYXJhbSB1aW1hbmFnZXIgdGhlIFVJSW5zdGFuY2VNYW5hZ2VyIHRoYXQgbWFuYWdlcyB0aGlzIGNvbXBvbmVudFxuICAgKi9cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgdGhpcy5vblNob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudFNob3cuZGlzcGF0Y2godGhpcyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkhpZGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudEhpZGUuZGlzcGF0Y2godGhpcyk7XG4gICAgfSk7XG5cbiAgICAvLyBUcmFjayB0aGUgaG92ZXJlZCBzdGF0ZSBvZiB0aGUgZWxlbWVudFxuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkhvdmVyQ2hhbmdlZEV2ZW50KHRydWUpO1xuICAgIH0pO1xuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkhvdmVyQ2hhbmdlZEV2ZW50KGZhbHNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlcyBhbGwgcmVzb3VyY2VzIGFuZCBkZXBlbmRlbmNpZXMgdGhhdCB0aGUgY29tcG9uZW50IGhvbGRzLiBQbGF5ZXIsIERPTSwgYW5kIFVJTWFuYWdlciBldmVudHMgYXJlXG4gICAqIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBkdXJpbmcgcmVsZWFzZSBhbmQgZG8gbm90IGV4cGxpY2l0bHkgbmVlZCB0byBiZSByZW1vdmVkIGhlcmUuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgVUlNYW5hZ2VyIHdoZW4gaXQgcmVsZWFzZXMgdGhlIFVJLlxuICAgKlxuICAgKiBTdWJjbGFzc2VzIHRoYXQgbmVlZCB0byByZWxlYXNlIHJlc291cmNlcyBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QgYW5kIGNhbGwgc3VwZXIucmVsZWFzZSgpLlxuICAgKi9cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICAvLyBOb3RoaW5nIHRvIGRvIGhlcmUsIG92ZXJyaWRlIHdoZXJlIG5lY2Vzc2FyeVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBET00gZWxlbWVudCBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAqXG4gICAqIFN1YmNsYXNzZXMgdXN1YWxseSBvdmVyd3JpdGUgdGhpcyBtZXRob2QgdG8gZXh0ZW5kIG9yIHJlcGxhY2UgdGhlIERPTSBlbGVtZW50IHdpdGggdGhlaXIgb3duIGRlc2lnbi5cbiAgICovXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBsZXQgZWxlbWVudCA9IG5ldyBET00odGhpcy5jb25maWcudGFnLCB7XG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBET00gZWxlbWVudCBvZiB0aGlzIGNvbXBvbmVudC4gQ3JlYXRlcyB0aGUgRE9NIGVsZW1lbnQgaWYgaXQgZG9lcyBub3QgeWV0IGV4aXN0LlxuICAgKlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIGJ5IHN1YmNsYXNzZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtET019XG4gICAqL1xuICBnZXREb21FbGVtZW50KCk6IERPTSB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMudG9Eb21FbGVtZW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZXMgYSBjb25maWd1cmF0aW9uIHdpdGggYSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gYW5kIGEgYmFzZSBjb25maWd1cmF0aW9uIGZyb20gdGhlIHN1cGVyY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWcgdGhlIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MgZm9yIHRoZSBjb21wb25lbnRzLCBhcyB1c3VhbGx5IHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIGRlZmF1bHRzIGEgZGVmYXVsdCBjb25maWd1cmF0aW9uIGZvciBzZXR0aW5ncyB0aGF0IGFyZSBub3QgcGFzc2VkIHdpdGggdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIGJhc2UgY29uZmlndXJhdGlvbiBpbmhlcml0ZWQgZnJvbSBhIHN1cGVyY2xhc3NcbiAgICogQHJldHVybnMge0NvbmZpZ31cbiAgICovXG4gIHByb3RlY3RlZCBtZXJnZUNvbmZpZzxDb25maWc+KGNvbmZpZzogQ29uZmlnLCBkZWZhdWx0czogQ29uZmlnLCBiYXNlOiBDb25maWcpOiBDb25maWcge1xuICAgIC8vIEV4dGVuZCBkZWZhdWx0IGNvbmZpZyB3aXRoIHN1cHBsaWVkIGNvbmZpZ1xuICAgIGxldCBtZXJnZWQgPSBPYmplY3QuYXNzaWduKHt9LCBiYXNlLCBkZWZhdWx0cywgY29uZmlnKTtcblxuICAgIC8vIFJldHVybiB0aGUgZXh0ZW5kZWQgY29uZmlnXG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRoYXQgcmV0dXJucyBhIHN0cmluZyBvZiBhbGwgQ1NTIGNsYXNzZXMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHByb3RlY3RlZCBnZXRDc3NDbGFzc2VzKCk6IHN0cmluZyB7XG4gICAgLy8gTWVyZ2UgYWxsIENTUyBjbGFzc2VzIGludG8gc2luZ2xlIGFycmF5XG4gICAgbGV0IGZsYXR0ZW5lZEFycmF5ID0gW3RoaXMuY29uZmlnLmNzc0NsYXNzXS5jb25jYXQodGhpcy5jb25maWcuY3NzQ2xhc3Nlcyk7XG4gICAgLy8gUHJlZml4IGNsYXNzZXNcbiAgICBmbGF0dGVuZWRBcnJheSA9IGZsYXR0ZW5lZEFycmF5Lm1hcCgoY3NzKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXhDc3MoY3NzKTtcbiAgICB9KTtcbiAgICAvLyBKb2luIGFycmF5IHZhbHVlcyBpbnRvIGEgc3RyaW5nXG4gICAgbGV0IGZsYXR0ZW5lZFN0cmluZyA9IGZsYXR0ZW5lZEFycmF5LmpvaW4oJyAnKTtcbiAgICAvLyBSZXR1cm4gdHJpbW1lZCBzdHJpbmcgdG8gcHJldmVudCB3aGl0ZXNwYWNlIGF0IHRoZSBlbmQgZnJvbSB0aGUgam9pbiBvcGVyYXRpb25cbiAgICByZXR1cm4gZmxhdHRlbmVkU3RyaW5nLnRyaW0oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwcmVmaXhDc3MoY3NzQ2xhc3NPcklkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5jc3NQcmVmaXggKyAnLScgKyBjc3NDbGFzc09ySWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY29uZmlndXJhdGlvbiBvYmplY3Qgb2YgdGhlIGNvbXBvbmVudC5cbiAgICogQHJldHVybnMge0NvbmZpZ31cbiAgICovXG4gIHB1YmxpYyBnZXRDb25maWcoKTogQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cblxuICAvKipcbiAgICogSGlkZXMgdGhlIGNvbXBvbmVudCBpZiBzaG93bi5cbiAgICogVGhpcyBtZXRob2QgYmFzaWNhbGx5IHRyYW5zZmVycyB0aGUgY29tcG9uZW50IGludG8gdGhlIGhpZGRlbiBzdGF0ZS4gQWN0dWFsIGhpZGluZyBpcyBkb25lIHZpYSBDU1MuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIGlmICghdGhpcy5oaWRkZW4pIHtcbiAgICAgIHRoaXMuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKENvbXBvbmVudC5DTEFTU19ISURERU4pKTtcbiAgICAgIHRoaXMub25IaWRlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvd3MgdGhlIGNvbXBvbmVudCBpZiBoaWRkZW4uXG4gICAqL1xuICBzaG93KCkge1xuICAgIGlmICh0aGlzLmhpZGRlbikge1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoQ29tcG9uZW50LkNMQVNTX0hJRERFTikpO1xuICAgICAgdGhpcy5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMub25TaG93RXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY29tcG9uZW50IGlzIGhpZGRlbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBpcyBoaWRkZW4sIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzSGlkZGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhpZGRlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBjb21wb25lbnQgaXMgc2hvd24uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBjb21wb25lbnQgaXMgdmlzaWJsZSwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaXNTaG93bigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNIaWRkZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBoaWRkZW4gc3RhdGUgYnkgaGlkaW5nIHRoZSBjb21wb25lbnQgaWYgaXQgaXMgc2hvd24sIG9yIHNob3dpbmcgaXQgaWYgaGlkZGVuLlxuICAgKi9cbiAgdG9nZ2xlSGlkZGVuKCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY29tcG9uZW50IGlzIGN1cnJlbnRseSBob3ZlcmVkLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgY29tcG9uZW50IGlzIGhvdmVyZWQsIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5ob3ZlcmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvblNob3cgZXZlbnQuXG4gICAqIFNlZSB0aGUgZGV0YWlsZWQgZXhwbGFuYXRpb24gb24gZXZlbnQgYXJjaGl0ZWN0dXJlIG9uIHRoZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyBldmVudHMgbGlzdH0uXG4gICAqL1xuICBwcm90ZWN0ZWQgb25TaG93RXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRFdmVudHMub25TaG93LmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvbkhpZGUgZXZlbnQuXG4gICAqIFNlZSB0aGUgZGV0YWlsZWQgZXhwbGFuYXRpb24gb24gZXZlbnQgYXJjaGl0ZWN0dXJlIG9uIHRoZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyBldmVudHMgbGlzdH0uXG4gICAqL1xuICBwcm90ZWN0ZWQgb25IaWRlRXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRFdmVudHMub25IaWRlLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvbkhvdmVyQ2hhbmdlZCBldmVudC5cbiAgICogU2VlIHRoZSBkZXRhaWxlZCBleHBsYW5hdGlvbiBvbiBldmVudCBhcmNoaXRlY3R1cmUgb24gdGhlIHtAbGluayAjY29tcG9uZW50RXZlbnRzIGV2ZW50cyBsaXN0fS5cbiAgICovXG4gIHByb3RlY3RlZCBvbkhvdmVyQ2hhbmdlZEV2ZW50KGhvdmVyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmhvdmVyZWQgPSBob3ZlcmVkO1xuICAgIHRoaXMuY29tcG9uZW50RXZlbnRzLm9uSG92ZXJDaGFuZ2VkLmRpc3BhdGNoKHRoaXMsIHsgaG92ZXJlZDogaG92ZXJlZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBzaG93aW5nLlxuICAgKiBTZWUgdGhlIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9uIGV2ZW50IGFyY2hpdGVjdHVyZSBvbiB0aGUge0BsaW5rICNjb21wb25lbnRFdmVudHMgZXZlbnRzIGxpc3R9LlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25TaG93KCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25TaG93LmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgaGlkaW5nLlxuICAgKiBTZWUgdGhlIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9uIGV2ZW50IGFyY2hpdGVjdHVyZSBvbiB0aGUge0BsaW5rICNjb21wb25lbnRFdmVudHMgZXZlbnRzIGxpc3R9LlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25IaWRlKCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25IaWRlLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb21wb25lbnQncyBob3Zlci1zdGF0ZSBpcyBjaGFuZ2luZy5cbiAgICogQHJldHVybnMge0V2ZW50PENvbXBvbmVudDxDb25maWc+LCBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uSG92ZXJDaGFuZ2VkKCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25Ib3ZlckNoYW5nZWQuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50Q29uZmlnLCBDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtBcnJheVV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIENvbnRhaW5lcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGFpbmVyQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgLyoqXG4gICAqIENoaWxkIGNvbXBvbmVudHMgb2YgdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIGNvbXBvbmVudHM/OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPltdO1xufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGNhbiBjb250YWluIGEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb21wb25lbnRzLlxuICogQ29tcG9uZW50cyBjYW4gYmUgYWRkZWQgYXQgY29uc3RydWN0aW9uIHRpbWUgdGhyb3VnaCB0aGUge0BsaW5rIENvbnRhaW5lckNvbmZpZyNjb21wb25lbnRzfSBzZXR0aW5nLCBvciBsYXRlclxuICogdGhyb3VnaCB0aGUge0BsaW5rIENvbnRhaW5lciNhZGRDb21wb25lbnR9IG1ldGhvZC4gVGhlIFVJTWFuYWdlciBhdXRvbWF0aWNhbGx5IHRha2VzIGNhcmUgb2YgYWxsIGNvbXBvbmVudHMsIGkuZS4gaXRcbiAqIGluaXRpYWxpemVzIGFuZCBjb25maWd1cmVzIHRoZW0gYXV0b21hdGljYWxseS5cbiAqXG4gKiBJbiB0aGUgRE9NLCB0aGUgY29udGFpbmVyIGNvbnNpc3RzIG9mIGFuIG91dGVyIDxkaXY+ICh0aGF0IGNhbiBiZSBjb25maWd1cmVkIGJ5IHRoZSBjb25maWcpIGFuZCBhbiBpbm5lciB3cmFwcGVyXG4gKiA8ZGl2PiB0aGF0IGNvbnRhaW5zIHRoZSBjb21wb25lbnRzLiBUaGlzIGRvdWJsZS08ZGl2Pi1zdHJ1Y3R1cmUgaXMgb2Z0ZW4gcmVxdWlyZWQgdG8gYWNoaWV2ZSBtYW55IGFkdmFuY2VkIGVmZmVjdHNcbiAqIGluIENTUyBhbmQvb3IgSlMsIGUuZy4gYW5pbWF0aW9ucyBhbmQgY2VydGFpbiBmb3JtYXR0aW5nIHdpdGggYWJzb2x1dGUgcG9zaXRpb25pbmcuXG4gKlxuICogRE9NIGV4YW1wbGU6XG4gKiA8Y29kZT5cbiAqICAgICA8ZGl2IGNsYXNzPSd1aS1jb250YWluZXInPlxuICogICAgICAgICA8ZGl2IGNsYXNzPSdjb250YWluZXItd3JhcHBlcic+XG4gKiAgICAgICAgICAgICAuLi4gY2hpbGQgY29tcG9uZW50cyAuLi5cbiAqICAgICAgICAgPC9kaXY+XG4gKiAgICAgPC9kaXY+XG4gKiA8L2NvZGU+XG4gKi9cbmV4cG9ydCBjbGFzcyBDb250YWluZXI8Q29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxDb250YWluZXJDb25maWc+IHtcblxuICAvKipcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIGlubmVyIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgY29tcG9uZW50cyBvZiB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBpbm5lckNvbnRhaW5lckVsZW1lbnQ6IERPTTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbnRhaW5lckNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNvbnRhaW5lcicsXG4gICAgICBjb21wb25lbnRzOiBbXVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY2hpbGQgY29tcG9uZW50IHRvIHRoZSBjb250YWluZXIuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCB0byBhZGRcbiAgICovXG4gIGFkZENvbXBvbmVudChjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSB7XG4gICAgdGhpcy5jb25maWcuY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNoaWxkIGNvbXBvbmVudCBmcm9tIHRoZSBjb250YWluZXIuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCB0byByZW1vdmVcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiByZW1vdmVkLCBmYWxzZSBpZiBpdCBpcyBub3QgY29udGFpbmVkIGluIHRoaXMgY29udGFpbmVyXG4gICAqL1xuICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmNvbmZpZy5jb21wb25lbnRzLCBjb21wb25lbnQpICE9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBhcnJheSBvZiBhbGwgY2hpbGQgY29tcG9uZW50cyBpbiB0aGlzIGNvbnRhaW5lci5cbiAgICogQHJldHVybnMge0NvbXBvbmVudDxDb21wb25lbnRDb25maWc+W119XG4gICAqL1xuICBnZXRDb21wb25lbnRzKCk6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+W10ge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5jb21wb25lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGNoaWxkIGNvbXBvbmVudHMgZnJvbSB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcmVtb3ZlQ29tcG9uZW50cygpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5nZXRDb21wb25lbnRzKCkpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIERPTSBvZiB0aGUgY29udGFpbmVyIHdpdGggdGhlIGN1cnJlbnQgY29tcG9uZW50cy5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVDb21wb25lbnRzKCk6IHZvaWQge1xuICAgIHRoaXMuaW5uZXJDb250YWluZXJFbGVtZW50LmVtcHR5KCk7XG5cbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5jb25maWcuY29tcG9uZW50cykge1xuICAgICAgdGhpcy5pbm5lckNvbnRhaW5lckVsZW1lbnQuYXBwZW5kKGNvbXBvbmVudC5nZXREb21FbGVtZW50KCkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICAvLyBDcmVhdGUgdGhlIGNvbnRhaW5lciBlbGVtZW50ICh0aGUgb3V0ZXIgPGRpdj4pXG4gICAgbGV0IGNvbnRhaW5lckVsZW1lbnQgPSBuZXcgRE9NKHRoaXMuY29uZmlnLnRhZywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKVxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBpbm5lciBjb250YWluZXIgZWxlbWVudCAodGhlIGlubmVyIDxkaXY+KSB0aGF0IHdpbGwgY29udGFpbiB0aGUgY29tcG9uZW50c1xuICAgIGxldCBpbm5lckNvbnRhaW5lciA9IG5ldyBET00odGhpcy5jb25maWcudGFnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnY29udGFpbmVyLXdyYXBwZXInKVxuICAgIH0pO1xuICAgIHRoaXMuaW5uZXJDb250YWluZXJFbGVtZW50ID0gaW5uZXJDb250YWluZXI7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcblxuICAgIGNvbnRhaW5lckVsZW1lbnQuYXBwZW5kKGlubmVyQ29udGFpbmVyKTtcblxuICAgIHJldHVybiBjb250YWluZXJFbGVtZW50O1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VUlVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtTcGFjZXJ9IGZyb20gJy4vc3BhY2VyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBDb250cm9sQmFyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250cm9sQmFyQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLy8gbm90aGluZyB5ZXRcbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBmb3IgbWFpbiBwbGF5ZXIgY29udHJvbCBjb21wb25lbnRzLCBlLmcuIHBsYXkgdG9nZ2xlIGJ1dHRvbiwgc2VlayBiYXIsIHZvbHVtZSBjb250cm9sLCBmdWxsc2NyZWVuIHRvZ2dsZVxuICogYnV0dG9uLlxuICovXG5leHBvcnQgY2xhc3MgQ29udHJvbEJhciBleHRlbmRzIENvbnRhaW5lcjxDb250cm9sQmFyQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb250cm9sQmFyQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY29udHJvbGJhcicsXG4gICAgICBoaWRkZW46IHRydWUsXG4gICAgfSwgPENvbnRyb2xCYXJDb25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIC8vIENvdW50cyBob3cgbWFueSBjb21wb25lbnRzIGFyZSBob3ZlcmVkIGFuZCBibG9jayBoaWRpbmcgb2YgdGhlIGNvbnRyb2wgYmFyXG4gICAgbGV0IGhvdmVyU3RhY2tDb3VudCA9IDA7XG5cbiAgICAvLyBUcmFjayBob3ZlciBzdGF0dXMgb2YgY2hpbGQgY29tcG9uZW50c1xuICAgIFVJVXRpbHMudHJhdmVyc2VUcmVlKHRoaXMsIChjb21wb25lbnQpID0+IHtcbiAgICAgIC8vIERvIG5vdCB0cmFjayBob3ZlciBzdGF0dXMgb2YgY2hpbGQgY29udGFpbmVycyBvciBzcGFjZXJzLCBvbmx5IG9mICdyZWFsJyBjb250cm9sc1xuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbnRhaW5lciB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBTcGFjZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBTdWJzY3JpYmUgaG92ZXIgZXZlbnQgYW5kIGtlZXAgYSBjb3VudCBvZiB0aGUgbnVtYmVyIG9mIGhvdmVyZWQgY2hpbGRyZW5cbiAgICAgIGNvbXBvbmVudC5vbkhvdmVyQ2hhbmdlZC5zdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xuICAgICAgICBpZiAoYXJncy5ob3ZlcmVkKSB7XG4gICAgICAgICAgaG92ZXJTdGFja0NvdW50Kys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaG92ZXJTdGFja0NvdW50LS07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNTaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9KTtcbiAgICB1aW1hbmFnZXIub25QcmV2aWV3Q29udHJvbHNIaWRlLnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XG4gICAgICAvLyBDYW5jZWwgdGhlIGhpZGUgZXZlbnQgaWYgaG92ZXJlZCBjaGlsZCBjb21wb25lbnRzIGJsb2NrIGhpZGluZ1xuICAgICAgYXJncy5jYW5jZWwgPSAoaG92ZXJTdGFja0NvdW50ID4gMCk7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNIaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1RpbWVvdXR9IGZyb20gJy4uL3RpbWVvdXQnO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtDbG9zZUJ1dHRvbn0gZnJvbSAnLi9jbG9zZWJ1dHRvbic7XG5pbXBvcnQge0NoZWNrYm94fSBmcm9tICcuL2NoZWNrYm94JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgRW1iZWRWaWRlb1BhbmVsfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbWJlZFZpZGVvUGFuZWxDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgZW1iZWRWaWRlbyBwYW5lbCB3aWxsIGJlIGhpZGRlbiB3aGVuIHRoZXJlIGlzIG5vIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAqIFNldCB0byAtMSB0byBkaXNhYmxlIGF1dG9tYXRpYyBoaWRpbmcuXG4gICAqIERlZmF1bHQ6IDMgc2Vjb25kcyAoMzAwMClcbiAgICovXG4gIGhpZGVEZWxheT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBIHBhbmVsIGNvbnRhaW5pbmcgYSBsaXN0IG9mIHtAbGluayBFbWJlZFZpZGVvUGFuZWxJdGVtIGl0ZW1zfSB0aGF0IHJlcHJlc2VudCBsYWJlbGxlZCBlbWJlZFZpZGVvLlxuICovXG5leHBvcnQgY2xhc3MgRW1iZWRWaWRlb1BhbmVsIGV4dGVuZHMgQ29udGFpbmVyPEVtYmVkVmlkZW9QYW5lbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgY2xvc2VCdXR0b246IENsb3NlQnV0dG9uO1xuICBwcml2YXRlIHRpdGxlOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgc2hvd0NvbW1lbnRzQ2hlY2tib3g6IENoZWNrYm94O1xuICBwcml2YXRlIGNvZGVGaWVsZDogTGFiZWw8TGFiZWxDb25maWc+O1xuXG5cbiAgcHJpdmF0ZSBoaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEVtYmVkVmlkZW9QYW5lbENvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLnRpdGxlID0gbmV3IExhYmVsKHt0ZXh0OiAnRW1iZWQgVmlkZW8nLCBjc3NDbGFzczogJ3VpLWVtYmVkdmlkZW8tcGFuZWwtdGl0bGUnfSk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG5ldyBDbG9zZUJ1dHRvbih7dGFyZ2V0OiB0aGlzfSk7XG4gICAgdGhpcy5zaG93Q29tbWVudHNDaGVja2JveCA9IG5ldyBDaGVja2JveCh7dGV4dDogJ1Nob3cgY29tbWVudHMnfSk7XG4gICAgdGhpcy5jb2RlRmllbGQgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzOiAndWktZW1iZWR2aWRlby1wYW5lbC1jb2RlZmllbGQnfSk7XG5cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZzxFbWJlZFZpZGVvUGFuZWxDb25maWc+KGNvbmZpZywge1xuICAgICAgICBjc3NDbGFzczogJ3VpLWVtYmVkdmlkZW8tcGFuZWwnLFxuICAgICAgICBoaWRlRGVsYXk6IDMwMDAsXG4gICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICAgIGNzc0NsYXNzOiAndWktZW1iZWR2aWRlby1wYW5lbC1oZWFkZXInLFxuICAgICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgICB0aGlzLnRpdGxlLFxuICAgICAgICAgICAgICB0aGlzLmNsb3NlQnV0dG9uLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRoaXMuc2hvd0NvbW1lbnRzQ2hlY2tib3gsXG4gICAgICAgICAgdGhpcy5jb2RlRmllbGRcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHRoaXMuY29uZmlnXG4gICAgKVxuICAgIDtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPEVtYmVkVmlkZW9QYW5lbENvbmZpZz50aGlzLmdldENvbmZpZygpOyAvLyBUT0RPIGZpeCBnZW5lcmljcyB0eXBlIGluZmVyZW5jZVxuICAgIGxldCB1aWNvbmZpZyA9IHVpbWFuYWdlci5nZXRDb25maWcoKTtcblxuICAgIGlmIChjb25maWcuaGlkZURlbGF5ID4gLTEpIHtcbiAgICAgIHRoaXMuaGlkZVRpbWVvdXQgPSBuZXcgVGltZW91dChjb25maWcuaGlkZURlbGF5LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub25TaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIEFjdGl2YXRlIHRpbWVvdXQgd2hlbiBzaG93blxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgICAgIC8vIFJlc2V0IHRpbWVvdXQgb24gaW50ZXJhY3Rpb25cbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIC8vIFJlc2V0IHRpbWVvdXQgb24gaW50ZXJhY3Rpb25cbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm9uSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBDbGVhciB0aW1lb3V0IHdoZW4gaGlkZGVuIGZyb20gb3V0c2lkZVxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IGluaXQgPSAoKSA9PiB7XG4gICAgICBpZiAodWljb25maWcgJiYgdWljb25maWcubWV0YWRhdGEgJiYgdWljb25maWcubWV0YWRhdGEuZW1iZWRWaWRlbykge1xuICAgICAgICBsZXQgZXYgPSB1aWNvbmZpZy5tZXRhZGF0YS5lbWJlZFZpZGVvXG4gICAgICAgIGlmICh0aGlzLnNob3dDb21tZW50c0NoZWNrYm94LmlzT24gJiYgZXYud2l0aENvbW1lbnRzKSB7XG4gICAgICAgICAgdGhpcy5zZXRFbWJlZFZpZGVvKGV2LndpdGhDb21tZW50cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRFbWJlZFZpZGVvKGV2LmRlZmF1bHQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UgJiYgcGxheWVyLmdldENvbmZpZygpLnNvdXJjZS5lbWJlZFZpZGVvKSB7XG4gICAgICAgIGxldCBldiA9IHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UuZW1iZWRWaWRlb1xuICAgICAgICBpZiAodGhpcy5zaG93Q29tbWVudHNDaGVja2JveC5pc09uICYmIGV2LndpdGhDb21tZW50cykge1xuICAgICAgICAgIHRoaXMuc2V0RW1iZWRWaWRlbyhldi53aXRoQ29tbWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0RW1iZWRWaWRlbyhldi5kZWZhdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdW5sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRIdG1sQ29kZShudWxsKTtcbiAgICB9O1xuXG4gICAgLy8gSW5pdCBsYWJlbFxuICAgIGluaXQoKTtcblxuICAgIC8vIFJlaW5pdCBsYWJlbCB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfTE9BREVELCBpbml0KTtcbiAgICAvLyBDbGVhciBsYWJlbHMgd2hlbiBzb3VyY2UgaXMgdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHVubG9hZCk7XG5cbiAgICAvLyB1cGRhdGUgd2hlbiBjaGVja2JveCBpcyBjaGFuZ2VkXG4gICAgdGhpcy5zaG93Q29tbWVudHNDaGVja2JveC5vbkNoYW5nZS5zdWJzY3JpYmUoaW5pdCk7XG5cbiAgICAvLyB1cGRhdGUgd2hlbiBzaG93blxuICAgIHRoaXMub25TaG93LnN1YnNjcmliZShpbml0KTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIGlmICh0aGlzLmhpZGVUaW1lb3V0KSB7XG4gICAgICB0aGlzLmhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0RW1iZWRWaWRlbyhodG1sQ29kZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGh0bWxDb2RlKSB7XG4gICAgICBsZXQgY29kZSA9IHRoaXMudG9IdG1sRW50aXRpZXMoaHRtbENvZGUpXG4gICAgICB0aGlzLnNldEh0bWxDb2RlKGNvZGUpXG4gICAgICB0aGlzLmNvcHlUZXh0VG9DbGlwYm9hcmQoaHRtbENvZGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0SHRtbENvZGUobnVsbClcbiAgICB9XG4gIH1cblxuICBzZXRIdG1sQ29kZShjb2RlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGVGaWVsZC5zZXRUZXh0KGNvZGUpXG4gIH1cblxuICB0b0h0bWxFbnRpdGllcyhzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzLnJlcGxhY2UoLy4vZ20sIGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gJyYjJyArIHMuY2hhckNvZGVBdCgwKSArICc7JztcbiAgICB9KTtcbiAgfVxuXG4gIGNvcHlUZXh0VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dEFyZWEudmFsdWUgPSB0ZXh0XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0QXJlYSlcbiAgICB0ZXh0QXJlYS5zZWxlY3QoKVxuICAgIHRyeSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGV4dEFyZWEpXG4gIH1cbn1cblxuIiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBFcnJvckV2ZW50ID0gYml0bW92aW4uUGxheWVyQVBJLkVycm9yRXZlbnQ7XG5pbXBvcnQge1R2Tm9pc2VDYW52YXN9IGZyb20gJy4vdHZub2lzZWNhbnZhcyc7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JNZXNzYWdlVHJhbnNsYXRvciB7XG4gIChlcnJvcjogRXJyb3JFdmVudCk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFcnJvck1lc3NhZ2VNYXAge1xuICBbY29kZTogbnVtYmVyXTogc3RyaW5nIHwgRXJyb3JNZXNzYWdlVHJhbnNsYXRvcjtcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBFcnJvck1lc3NhZ2VPdmVybGF5fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIEFsbG93cyBvdmVyd3JpdGluZyBvZiB0aGUgZXJyb3IgbWVzc2FnZXMgZGlzcGxheWVkIGluIHRoZSBvdmVybGF5IGZvciBjdXN0b21pemF0aW9uIGFuZCBsb2NhbGl6YXRpb24uXG4gICAqIFRoaXMgaXMgZWl0aGVyIGEgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhbnkge0BsaW5rIEVycm9yRXZlbnR9IGFzIHBhcmFtZXRlciBhbmQgdHJhbnNsYXRlcyBlcnJvciBtZXNzYWdlcyxcbiAgICogb3IgYSBtYXAgb2YgZXJyb3IgY29kZXMgdGhhdCBvdmVyd3JpdGVzIHNwZWNpZmljIGVycm9yIG1lc3NhZ2VzIHdpdGggYSBwbGFpbiBzdHJpbmcgb3IgYSBmdW5jdGlvbiB0aGF0XG4gICAqIHJlY2VpdmVzIHRoZSB7QGxpbmsgRXJyb3JFdmVudH0gYXMgcGFyYW1ldGVyIGFuZCByZXR1cm5zIGEgY3VzdG9taXplZCBzdHJpbmcuXG4gICAqIFRoZSB0cmFuc2xhdGlvbiBmdW5jdGlvbnMgY2FuIGJlIHVzZWQgdG8gZXh0cmFjdCBkYXRhIChlLmcuIHBhcmFtZXRlcnMpIGZyb20gdGhlIG9yaWdpbmFsIGVycm9yIG1lc3NhZ2UuXG4gICAqXG4gICAqIEV4YW1wbGUgMSAoY2F0Y2gtYWxsIHRyYW5zbGF0aW9uIGZ1bmN0aW9uKTpcbiAgICogPGNvZGU+XG4gICAqIGVycm9yTWVzc2FnZU92ZXJsYXlDb25maWcgPSB7XG4gICAqICAgbWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICBzd2l0Y2ggKGVycm9yLmNvZGUpIHtcbiAgICogICAgICAgLy8gT3ZlcndyaXRlIGVycm9yIDMwMDAgJ1Vua25vd24gZXJyb3InXG4gICAqICAgICAgIGNhc2UgMzAwMDpcbiAgICogICAgICAgICByZXR1cm4gJ0hvdXN0b24sIHdlIGhhdmUgYSBwcm9ibGVtJ1xuICAgKlxuICAgKiAgICAgICAvLyBUcmFuc2Zvcm0gZXJyb3IgMzAwMSAnVW5zdXBwb3J0ZWQgbWFuaWZlc3QgZm9ybWF0JyB0byB1cHBlcmNhc2VcbiAgICogICAgICAgY2FzZSAzMDAxOlxuICAgKiAgICAgICAgIHJldHVybiBlcnJvci5tZXNzYWdlLnRvVXBwZXJDYXNlKCk7XG4gICAqXG4gICAqICAgICAgIC8vIEN1c3RvbWl6ZSBlcnJvciAzMDA2ICdDb3VsZCBub3QgbG9hZCBtYW5pZmVzdCwgZ290IEhUVFAgc3RhdHVzIGNvZGUgWFhYJ1xuICAgKiAgICAgICBjYXNlIDMwMDY6XG4gICAqICAgICAgICAgdmFyIHN0YXR1c0NvZGUgPSBlcnJvci5tZXNzYWdlLnN1YnN0cmluZyg0Nik7XG4gICAqICAgICAgICAgcmV0dXJuICdNYW5pZmVzdCBsb2FkaW5nIGZhaWxlZCB3aXRoIEhUVFAgZXJyb3IgJyArIHN0YXR1c0NvZGU7XG4gICAqICAgICB9XG4gICAqICAgICAvLyBSZXR1cm4gdW5tb2RpZmllZCBlcnJvciBtZXNzYWdlIGZvciBhbGwgb3RoZXIgZXJyb3JzXG4gICAqICAgICByZXR1cm4gZXJyb3IubWVzc2FnZTtcbiAgICogICB9XG4gICAqIH07XG4gICAqIDwvY29kZT5cbiAgICpcbiAgICogRXhhbXBsZSAyICh0cmFuc2xhdGluZyBzcGVjaWZpYyBlcnJvcnMpOlxuICAgKiA8Y29kZT5cbiAgICogZXJyb3JNZXNzYWdlT3ZlcmxheUNvbmZpZyA9IHtcbiAgICogICBtZXNzYWdlczoge1xuICAgKiAgICAgLy8gT3ZlcndyaXRlIGVycm9yIDMwMDAgJ1Vua25vd24gZXJyb3InXG4gICAqICAgICAzMDAwOiAnSG91c3Rvbiwgd2UgaGF2ZSBhIHByb2JsZW0nLFxuICAgKlxuICAgKiAgICAgLy8gVHJhbnNmb3JtIGVycm9yIDMwMDEgJ1Vuc3VwcG9ydGVkIG1hbmlmZXN0IGZvcm1hdCcgdG8gdXBwZXJjYXNlXG4gICAqICAgICAzMDAxOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICByZXR1cm4gZXJyb3IubWVzc2FnZS50b1VwcGVyQ2FzZSgpO1xuICAgKiAgICAgfSxcbiAgICpcbiAgICogICAgIC8vIEN1c3RvbWl6ZSBlcnJvciAzMDA2ICdDb3VsZCBub3QgbG9hZCBtYW5pZmVzdCwgZ290IEhUVFAgc3RhdHVzIGNvZGUgWFhYJ1xuICAgKiAgICAgMzAwNjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgICAgdmFyIHN0YXR1c0NvZGUgPSBlcnJvci5tZXNzYWdlLnN1YnN0cmluZyg0Nik7XG4gICAqICAgICAgIHJldHVybiAnTWFuaWZlc3QgbG9hZGluZyBmYWlsZWQgd2l0aCBIVFRQIGVycm9yICcgKyBzdGF0dXNDb2RlO1xuICAgKiAgICAgfVxuICAgKiAgIH1cbiAgICogfTtcbiAgICogPC9jb2RlPlxuICAgKi9cbiAgbWVzc2FnZXM/OiBFcnJvck1lc3NhZ2VNYXAgfCBFcnJvck1lc3NhZ2VUcmFuc2xhdG9yO1xufVxuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgYW5kIGRpc3BsYXlzIGVycm9yIG1lc3NhZ2VzLlxuICovXG5leHBvcnQgY2xhc3MgRXJyb3JNZXNzYWdlT3ZlcmxheSBleHRlbmRzIENvbnRhaW5lcjxFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBlcnJvckxhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgdHZOb2lzZUJhY2tncm91bmQ6IFR2Tm9pc2VDYW52YXM7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5lcnJvckxhYmVsID0gbmV3IExhYmVsPExhYmVsQ29uZmlnPih7IGNzc0NsYXNzOiAndWktZXJyb3JtZXNzYWdlLWxhYmVsJyB9KTtcbiAgICB0aGlzLnR2Tm9pc2VCYWNrZ3JvdW5kID0gbmV3IFR2Tm9pc2VDYW52YXMoKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktZXJyb3JtZXNzYWdlLW92ZXJsYXknLFxuICAgICAgY29tcG9uZW50czogW3RoaXMudHZOb2lzZUJhY2tncm91bmQsIHRoaXMuZXJyb3JMYWJlbF0sXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9FUlJPUiwgKGV2ZW50OiBFcnJvckV2ZW50KSA9PiB7XG4gICAgICBsZXQgbWVzc2FnZSA9IGV2ZW50Lm1lc3NhZ2U7XG5cbiAgICAgIC8vIFByb2Nlc3MgbWVzc2FnZSB0cmFuc2xhdGlvbnNcbiAgICAgIGlmIChjb25maWcubWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcubWVzc2FnZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAvLyBUcmFuc2xhdGlvbiBmdW5jdGlvbiBmb3IgYWxsIGVycm9yc1xuICAgICAgICAgIG1lc3NhZ2UgPSBjb25maWcubWVzc2FnZXMoZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5tZXNzYWdlc1tldmVudC5jb2RlXSkge1xuICAgICAgICAgIC8vIEl0J3Mgbm90IGEgdHJhbnNsYXRpb24gZnVuY3Rpb24sIHNvIGl0IG11c3QgYmUgYSBtYXAgb2Ygc3RyaW5ncyBvciB0cmFuc2xhdGlvbiBmdW5jdGlvbnNcbiAgICAgICAgICBsZXQgY3VzdG9tTWVzc2FnZSA9IGNvbmZpZy5tZXNzYWdlc1tldmVudC5jb2RlXTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgY3VzdG9tTWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBjdXN0b21NZXNzYWdlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaGUgbWVzc2FnZSBpcyBhIHRyYW5zbGF0aW9uIGZ1bmN0aW9uLCBzbyB3ZSBjYWxsIGl0XG4gICAgICAgICAgICBtZXNzYWdlID0gY3VzdG9tTWVzc2FnZShldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZXJyb3JMYWJlbC5zZXRUZXh0KG1lc3NhZ2UpO1xuICAgICAgdGhpcy50dk5vaXNlQmFja2dyb3VuZC5zdGFydCgpO1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfTE9BREVELCAoZXZlbnQ6IFBsYXllckV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgdGhpcy50dk5vaXNlQmFja2dyb3VuZC5zdG9wKCk7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIHBsYXllciBiZXR3ZWVuIHdpbmRvd2VkIGFuZCBmdWxsc2NyZWVuIHZpZXcuXG4gKi9cbmV4cG9ydCBjbGFzcyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1mdWxsc2NyZWVudG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdGdWxsc2NyZWVuJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgZnVsbHNjcmVlblN0YXRlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNGdWxsc2NyZWVuKCkpIHtcbiAgICAgICAgdGhpcy5vbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vZmYoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fRlVMTFNDUkVFTl9FTlRFUiwgZnVsbHNjcmVlblN0YXRlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fRlVMTFNDUkVFTl9FWElULCBmdWxsc2NyZWVuU3RhdGVIYW5kbGVyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0Z1bGxzY3JlZW4oKSkge1xuICAgICAgICBwbGF5ZXIuZXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5lbnRlckZ1bGxzY3JlZW4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFN0YXJ0dXAgaW5pdFxuICAgIGZ1bGxzY3JlZW5TdGF0ZUhhbmRsZXIoKTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlQnV0dG9ufSBmcm9tICcuL3BsYXliYWNrdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJFdmVudDtcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IG92ZXJsYXlzIHRoZSB2aWRlbyBhbmQgdG9nZ2xlcyBiZXR3ZWVuIHBsYXliYWNrIGFuZCBwYXVzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEh1Z2VQbGF5YmFja1RvZ2dsZUJ1dHRvbiBleHRlbmRzIFBsYXliYWNrVG9nZ2xlQnV0dG9uIHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktaHVnZXBsYXliYWNrdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdQbGF5L1BhdXNlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIC8vIFVwZGF0ZSBidXR0b24gc3RhdGUgdGhyb3VnaCBBUEkgZXZlbnRzXG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyLCBmYWxzZSk7XG5cbiAgICBsZXQgdG9nZ2xlUGxheWJhY2sgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzUGxheWluZygpKSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmRpc3BhdGNoU21hc2hjdXRQbGF5ZXJVaUV2ZW50KHthY3Rpb246ICdwYXVzZScsIG9yaWdpbmF0b3I6ICdIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24nfSlcbiAgICAgICAgcGxheWVyLnBhdXNlKCd1aS1vdmVybGF5Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7YWN0aW9uOiAncGxheScsIG9yaWdpbmF0b3I6ICdIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24nfSlcbiAgICAgICAgcGxheWVyLnBsYXkoJ3VpLW92ZXJsYXknKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHRvZ2dsZUZ1bGxzY3JlZW4gPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICAgIHBsYXllci5leGl0RnVsbHNjcmVlbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLmVudGVyRnVsbHNjcmVlbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgZmlyc3RQbGF5ID0gdHJ1ZTtcbiAgICBsZXQgY2xpY2tUaW1lID0gMDtcbiAgICBsZXQgZG91YmxlQ2xpY2tUaW1lID0gMDtcblxuICAgIC8qXG4gICAgICogWW91VHViZS1zdHlsZSB0b2dnbGUgYnV0dG9uIGhhbmRsaW5nXG4gICAgICpcbiAgICAgKiBUaGUgZ29hbCBpcyB0byBwcmV2ZW50IGEgc2hvcnQgcGF1c2Ugb3IgcGxheWJhY2sgaW50ZXJ2YWwgYmV0d2VlbiBhIGNsaWNrLCB0aGF0IHRvZ2dsZXMgcGxheWJhY2ssIGFuZCBhXG4gICAgICogZG91YmxlIGNsaWNrLCB0aGF0IHRvZ2dsZXMgZnVsbHNjcmVlbi4gSW4gdGhpcyBuYWl2ZSBhcHByb2FjaCwgdGhlIGZpcnN0IGNsaWNrIHdvdWxkIGUuZy4gc3RhcnQgcGxheWJhY2ssXG4gICAgICogdGhlIHNlY29uZCBjbGljayB3b3VsZCBiZSBkZXRlY3RlZCBhcyBkb3VibGUgY2xpY2sgYW5kIHRvZ2dsZSB0byBmdWxsc2NyZWVuLCBhbmQgYXMgc2Vjb25kIG5vcm1hbCBjbGljayBzdG9wXG4gICAgICogcGxheWJhY2ssIHdoaWNoIHJlc3VsdHMgaXMgYSBzaG9ydCBwbGF5YmFjayBpbnRlcnZhbCB3aXRoIG1heCBsZW5ndGggb2YgdGhlIGRvdWJsZSBjbGljayBkZXRlY3Rpb25cbiAgICAgKiBwZXJpb2QgKHVzdWFsbHkgNTAwbXMpLlxuICAgICAqXG4gICAgICogVG8gc29sdmUgdGhpcyBpc3N1ZSwgd2UgZGVmZXIgaGFuZGxpbmcgb2YgdGhlIGZpcnN0IGNsaWNrIGZvciAyMDBtcywgd2hpY2ggaXMgYWxtb3N0IHVubm90aWNlYWJsZSB0byB0aGUgdXNlcixcbiAgICAgKiBhbmQganVzdCB0b2dnbGUgcGxheWJhY2sgaWYgbm8gc2Vjb25kIGNsaWNrIChkb3VibGUgY2xpY2spIGhhcyBiZWVuIHJlZ2lzdGVyZWQgZHVyaW5nIHRoaXMgcGVyaW9kLiBJZiBhIGRvdWJsZVxuICAgICAqIGNsaWNrIGlzIHJlZ2lzdGVyZWQsIHdlIGp1c3QgdG9nZ2xlIHRoZSBmdWxsc2NyZWVuLiBJbiB0aGUgZmlyc3QgMjAwbXMsIHVuZGVzaXJlZCBwbGF5YmFjayBjaGFuZ2VzIHRodXMgY2Fubm90XG4gICAgICogaGFwcGVuLiBJZiBhIGRvdWJsZSBjbGljayBpcyByZWdpc3RlcmVkIHdpdGhpbiA1MDBtcywgd2UgdW5kbyB0aGUgcGxheWJhY2sgY2hhbmdlIGFuZCBzd2l0Y2ggZnVsbHNjcmVlbiBtb2RlLlxuICAgICAqIEluIHRoZSBlbmQsIHRoaXMgbWV0aG9kIGJhc2ljYWxseSBpbnRyb2R1Y2VzIGEgMjAwbXMgb2JzZXJ2aW5nIGludGVydmFsIGluIHdoaWNoIHBsYXliYWNrIGNoYW5nZXMgYXJlIHByZXZlbnRlZFxuICAgICAqIGlmIGEgZG91YmxlIGNsaWNrIGhhcHBlbnMuXG4gICAgICovXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBEaXJlY3RseSBzdGFydCBwbGF5YmFjayBvbiBmaXJzdCBjbGljayBvZiB0aGUgYnV0dG9uLlxuICAgICAgLy8gVGhpcyBpcyBhIHJlcXVpcmVkIHdvcmthcm91bmQgZm9yIG1vYmlsZSBicm93c2VycyB3aGVyZSB2aWRlbyBwbGF5YmFjayBuZWVkcyB0byBiZSB0cmlnZ2VyZWQgZGlyZWN0bHlcbiAgICAgIC8vIGJ5IHRoZSB1c2VyLiBBIGRlZmVycmVkIHBsYXliYWNrIHN0YXJ0IHRocm91Z2ggdGhlIHRpbWVvdXQgYmVsb3cgaXMgbm90IGNvbnNpZGVyZWQgYXMgdXNlciBhY3Rpb24gYW5kXG4gICAgICAvLyB0aGVyZWZvcmUgaWdub3JlZCBieSBtb2JpbGUgYnJvd3NlcnMuXG4gICAgICBpZiAoZmlyc3RQbGF5KSB7XG4gICAgICAgIC8vIFRyeSB0byBzdGFydCBwbGF5YmFjay4gVGhlbiB3ZSB3YWl0IGZvciBPTl9QTEFZIGFuZCBvbmx5IHdoZW4gaXQgYXJyaXZlcywgd2UgZGlzYWJsZSB0aGUgZmlyc3RQbGF5IGZsYWcuXG4gICAgICAgIC8vIElmIHdlIGRpc2FibGUgdGhlIGZsYWcgaGVyZSwgb25DbGljayB3YXMgdHJpZ2dlcmVkIHByb2dyYW1tYXRpY2FsbHkgaW5zdGVhZCBvZiBieSBhIHVzZXIgaW50ZXJhY3Rpb24sIGFuZFxuICAgICAgICAvLyBwbGF5YmFjayBpcyBibG9ja2VkIChlLmcuIG9uIG1vYmlsZSBkZXZpY2VzIGR1ZSB0byB0aGUgcHJvZ3JhbW1hdGljIHBsYXkoKSBjYWxsKSwgd2UgbG9vc2UgdGhlIGNoYW5jZSB0b1xuICAgICAgICAvLyBldmVyIHN0YXJ0IHBsYXliYWNrIHRocm91Z2ggYSB1c2VyIGludGVyYWN0aW9uIGFnYWluIHdpdGggdGhpcyBidXR0b24uXG4gICAgICAgIHRvZ2dsZVBsYXliYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICAgIGlmIChub3cgLSBjbGlja1RpbWUgPCAyMDApIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBhIGRvdWJsZSBjbGljayBpbnNpZGUgdGhlIDIwMG1zIGludGVydmFsLCBqdXN0IHRvZ2dsZSBmdWxsc2NyZWVuIG1vZGVcbiAgICAgICAgdG9nZ2xlRnVsbHNjcmVlbigpO1xuICAgICAgICBkb3VibGVDbGlja1RpbWUgPSBub3c7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAobm93IC0gY2xpY2tUaW1lIDwgNTAwKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgYSBkb3VibGUgY2xpY2sgaW5zaWRlIHRoZSA1MDBtcyBpbnRlcnZhbCwgdW5kbyBwbGF5YmFjayB0b2dnbGUgYW5kIHRvZ2dsZSBmdWxsc2NyZWVuIG1vZGVcbiAgICAgICAgdG9nZ2xlRnVsbHNjcmVlbigpO1xuICAgICAgICB0b2dnbGVQbGF5YmFjaygpO1xuICAgICAgICBkb3VibGVDbGlja1RpbWUgPSBub3c7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY2xpY2tUaW1lID0gbm93O1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSBkb3VibGVDbGlja1RpbWUgPiAyMDApIHtcbiAgICAgICAgICAvLyBObyBkb3VibGUgY2xpY2sgZGV0ZWN0ZWQsIHNvIHdlIHRvZ2dsZSBwbGF5YmFjayBhbmQgd2FpdCB3aGF0IGhhcHBlbnMgbmV4dFxuICAgICAgICAgIHRvZ2dsZVBsYXliYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDIwMCk7XG4gICAgfSk7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCAoKSA9PiB7XG4gICAgICAvLyBQbGF5YmFjayBoYXMgcmVhbGx5IHN0YXJ0ZWQsIHdlIGNhbiBkaXNhYmxlIHRoZSBmbGFnIHRvIHN3aXRjaCB0byBub3JtYWwgdG9nZ2xlIGJ1dHRvbiBoYW5kbGluZ1xuICAgICAgZmlyc3RQbGF5ID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBIaWRlIGJ1dHRvbiB3aGlsZSBpbml0aWFsaXppbmcgYSBDYXN0IHNlc3Npb25cbiAgICBsZXQgY2FzdEluaXRpYWxpemF0aW9uSGFuZGxlciA9IChldmVudDogUGxheWVyRXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSBwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVCkge1xuICAgICAgICAvLyBIaWRlIGJ1dHRvbiB3aGVuIHNlc3Npb24gaXMgYmVpbmcgaW5pdGlhbGl6ZWRcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTaG93IGJ1dHRvbiB3aGVuIHNlc3Npb24gaXMgZXN0YWJsaXNoZWQgb3IgaW5pdGlhbGl6YXRpb24gd2FzIGFib3J0ZWRcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJULCBjYXN0SW5pdGlhbGl6YXRpb25IYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsIGNhc3RJbml0aWFsaXphdGlvbkhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RPUFBFRCwgY2FzdEluaXRpYWxpemF0aW9uSGFuZGxlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGJ1dHRvbkVsZW1lbnQgPSBzdXBlci50b0RvbUVsZW1lbnQoKTtcblxuICAgIC8vIEFkZCBjaGlsZCB0aGF0IGNvbnRhaW5zIHRoZSBwbGF5IGJ1dHRvbiBpbWFnZVxuICAgIC8vIFNldHRpbmcgdGhlIGltYWdlIGRpcmVjdGx5IG9uIHRoZSBidXR0b24gZG9lcyBub3Qgd29yayB0b2dldGhlciB3aXRoIHNjYWxpbmcgYW5pbWF0aW9ucywgYmVjYXVzZSB0aGUgYnV0dG9uXG4gICAgLy8gY2FuIGNvdmVyIHRoZSB3aG9sZSB2aWRlbyBwbGF5ZXIgYXJlIGFuZCBzY2FsaW5nIHdvdWxkIGV4dGVuZCBpdCBiZXlvbmQuIEJ5IGFkZGluZyBhbiBpbm5lciBlbGVtZW50LCBjb25maW5lZFxuICAgIC8vIHRvIHRoZSBzaXplIGlmIHRoZSBpbWFnZSwgaXQgY2FuIHNjYWxlIGluc2lkZSB0aGUgcGxheWVyIHdpdGhvdXQgb3ZlcnNob290aW5nLlxuICAgIGJ1dHRvbkVsZW1lbnQuYXBwZW5kKG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdpbWFnZScpXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIGJ1dHRvbkVsZW1lbnQ7XG4gIH1cbn0iLCJpbXBvcnQge0J1dHRvbkNvbmZpZywgQnV0dG9ufSBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5cbi8qKlxuICogQSBidXR0b24gdG8gcGxheS9yZXBsYXkgYSB2aWRlby5cbiAqL1xuZXhwb3J0IGNsYXNzIEh1Z2VSZXBsYXlCdXR0b24gZXh0ZW5kcyBCdXR0b248QnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWh1Z2VyZXBsYXlidXR0b24nLFxuICAgICAgdGV4dDogJ1JlcGxheSdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7YWN0aW9uOiAncGxheScsIG9yaWdpbmF0b3I6ICdIdWdlUmVwbGF5QnV0dG9uJ30pXG4gICAgICBwbGF5ZXIucGxheSgndWktb3ZlcmxheScpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGxldCBidXR0b25FbGVtZW50ID0gc3VwZXIudG9Eb21FbGVtZW50KCk7XG5cbiAgICAvLyBBZGQgY2hpbGQgdGhhdCBjb250YWlucyB0aGUgcGxheSBidXR0b24gaW1hZ2VcbiAgICAvLyBTZXR0aW5nIHRoZSBpbWFnZSBkaXJlY3RseSBvbiB0aGUgYnV0dG9uIGRvZXMgbm90IHdvcmsgdG9nZXRoZXIgd2l0aCBzY2FsaW5nIGFuaW1hdGlvbnMsIGJlY2F1c2UgdGhlIGJ1dHRvblxuICAgIC8vIGNhbiBjb3ZlciB0aGUgd2hvbGUgdmlkZW8gcGxheWVyIGFyZSBhbmQgc2NhbGluZyB3b3VsZCBleHRlbmQgaXQgYmV5b25kLiBCeSBhZGRpbmcgYW4gaW5uZXIgZWxlbWVudCwgY29uZmluZWRcbiAgICAvLyB0byB0aGUgc2l6ZSBpZiB0aGUgaW1hZ2UsIGl0IGNhbiBzY2FsZSBpbnNpZGUgdGhlIHBsYXllciB3aXRob3V0IG92ZXJzaG9vdGluZy5cbiAgICBidXR0b25FbGVtZW50LmFwcGVuZChuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnaW1hZ2UnKVxuICAgIH0pKTtcblxuICAgIHJldHVybiBidXR0b25FbGVtZW50O1xuICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnRDb25maWcsIENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgRXZlbnQsIE5vQXJnc30gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgTGFiZWx9IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYWJlbENvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdGV4dCBvbiB0aGUgbGFiZWwuXG4gICAqL1xuICB0ZXh0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgc2ltcGxlIHRleHQgbGFiZWwuXG4gKlxuICogRE9NIGV4YW1wbGU6XG4gKiA8Y29kZT5cbiAqICAgICA8c3BhbiBjbGFzcz0ndWktbGFiZWwnPi4uLnNvbWUgdGV4dC4uLjwvc3Bhbj5cbiAqIDwvY29kZT5cbiAqL1xuZXhwb3J0IGNsYXNzIExhYmVsPENvbmZpZyBleHRlbmRzIExhYmVsQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxMYWJlbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgdGV4dDogc3RyaW5nO1xuXG4gIHByaXZhdGUgbGFiZWxFdmVudHMgPSB7XG4gICAgb25DbGljazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMYWJlbDxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25UZXh0Q2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMYWJlbDxDb25maWc+LCBzdHJpbmc+KCksXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktbGFiZWwnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy50ZXh0ID0gdGhpcy5jb25maWcudGV4dDtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBsZXQgbGFiZWxFbGVtZW50ID0gbmV3IERPTSgnc3BhbicsIHtcbiAgICAgICdpZCc6IHRoaXMuY29uZmlnLmlkLFxuICAgICAgJ2NsYXNzJzogdGhpcy5nZXRDc3NDbGFzc2VzKClcbiAgICB9KS5odG1sKHRoaXMudGV4dCk7XG5cbiAgICBsYWJlbEVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkNsaWNrRXZlbnQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsYWJlbEVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSB0ZXh0IG9uIHRoaXMgbGFiZWwuXG4gICAqIEBwYXJhbSB0ZXh0XG4gICAqL1xuICBzZXRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy5nZXREb21FbGVtZW50KCkuaHRtbCh0ZXh0KTtcbiAgICB0aGlzLm9uVGV4dENoYW5nZWRFdmVudCh0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB0ZXh0IG9uIHRoaXMgbGFiZWwuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRleHQgb24gdGhlIGxhYmVsXG4gICAqL1xuICBnZXRUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIHRleHQgb24gdGhpcyBsYWJlbC5cbiAgICovXG4gIGNsZWFyVGV4dCgpIHtcbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5odG1sKCcnKTtcbiAgICB0aGlzLm9uVGV4dENoYW5nZWRFdmVudChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiB0aGUgbGFiZWwgaXMgZW1wdHkgYW5kIGRvZXMgbm90IGNvbnRhaW4gYW55IHRleHQuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIGxhYmVsIGlzIGVtcHR5LCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy50ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSB7QGxpbmsgI29uQ2xpY2t9IGV2ZW50LlxuICAgKiBDYW4gYmUgdXNlZCBieSBzdWJjbGFzc2VzIHRvIGxpc3RlbiB0byB0aGlzIGV2ZW50IHdpdGhvdXQgc3Vic2NyaWJpbmcgYW4gZXZlbnQgbGlzdGVuZXIgYnkgb3ZlcndyaXRpbmcgdGhlIG1ldGhvZFxuICAgKiBhbmQgY2FsbGluZyB0aGUgc3VwZXIgbWV0aG9kLlxuICAgKi9cbiAgcHJvdGVjdGVkIG9uQ2xpY2tFdmVudCgpIHtcbiAgICB0aGlzLmxhYmVsRXZlbnRzLm9uQ2xpY2suZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgdGhlIHtAbGluayAjb25DbGlja30gZXZlbnQuXG4gICAqIENhbiBiZSB1c2VkIGJ5IHN1YmNsYXNzZXMgdG8gbGlzdGVuIHRvIHRoaXMgZXZlbnQgd2l0aG91dCBzdWJzY3JpYmluZyBhbiBldmVudCBsaXN0ZW5lciBieSBvdmVyd3JpdGluZyB0aGUgbWV0aG9kXG4gICAqIGFuZCBjYWxsaW5nIHRoZSBzdXBlciBtZXRob2QuXG4gICAqL1xuICBwcm90ZWN0ZWQgb25UZXh0Q2hhbmdlZEV2ZW50KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMubGFiZWxFdmVudHMub25UZXh0Q2hhbmdlZC5kaXNwYXRjaCh0aGlzLCB0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGxhYmVsIGlzIGNsaWNrZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25DbGljaygpOiBFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmxhYmVsRXZlbnRzLm9uQ2xpY2suZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIHRleHQgb24gdGhlIGxhYmVsIGlzIGNoYW5nZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25UZXh0Q2hhbmdlZCgpOiBFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmxhYmVsRXZlbnRzLm9uVGV4dENoYW5nZWQuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCB7QXJyYXlVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIEEgbWFwIG9mIGl0ZW1zIChrZXkvdmFsdWUgLT4gbGFiZWx9IGZvciBhIHtAbGluayBMaXN0U2VsZWN0b3J9IGluIGEge0BsaW5rIExpc3RTZWxlY3RvckNvbmZpZ30uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdEl0ZW0ge1xuICBrZXk6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgTGlzdFNlbGVjdG9yfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaXN0U2VsZWN0b3JDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICBpdGVtcz86IExpc3RJdGVtW107XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMaXN0U2VsZWN0b3I8Q29uZmlnIGV4dGVuZHMgTGlzdFNlbGVjdG9yQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxMaXN0U2VsZWN0b3JDb25maWc+IHtcblxuICBwcm90ZWN0ZWQgaXRlbXM6IExpc3RJdGVtW107XG4gIHByb3RlY3RlZCBzZWxlY3RlZEl0ZW06IHN0cmluZztcblxuICBwcml2YXRlIGxpc3RTZWxlY3RvckV2ZW50cyA9IHtcbiAgICBvbkl0ZW1BZGRlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPigpLFxuICAgIG9uSXRlbVJlbW92ZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4oKSxcbiAgICBvbkl0ZW1TZWxlY3RlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPigpXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMaXN0U2VsZWN0b3JDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBpdGVtczogW10sXG4gICAgICBjc3NDbGFzczogJ3VpLWxpc3RzZWxlY3RvcidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG5cbiAgICB0aGlzLml0ZW1zID0gdGhpcy5jb25maWcuaXRlbXM7XG4gIH1cblxuICBwcml2YXRlIGdldEl0ZW1JbmRleChrZXk6IHN0cmluZyk6IG51bWJlciB7XG4gICAgZm9yIChsZXQgaW5kZXggaW4gdGhpcy5pdGVtcykge1xuICAgICAgaWYgKGtleSA9PT0gdGhpcy5pdGVtc1tpbmRleF0ua2V5KSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChpbmRleCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCBpdGVtIGlzIHBhcnQgb2YgdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIGNoZWNrXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBpdGVtIGlzIHBhcnQgb2YgdGhpcyBzZWxlY3RvciwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaGFzSXRlbShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW1JbmRleChrZXkpID4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpdGVtIHRvIHRoaXMgc2VsZWN0b3IgYnkgYXBwZW5kaW5nIGl0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgaXRlbXMuIElmIGFuIGl0ZW0gd2l0aCB0aGUgc3BlY2lmaWVkXG4gICAqIGtleSBhbHJlYWR5IGV4aXN0cywgaXQgaXMgcmVwbGFjZWQuXG4gICAqIEBwYXJhbSBrZXkgdGhlIGtleSBvZiB0aGUgaXRlbSB0byBhZGRcbiAgICogQHBhcmFtIGxhYmVsIHRoZSAoaHVtYW4tcmVhZGFibGUpIGxhYmVsIG9mIHRoZSBpdGVtIHRvIGFkZFxuICAgKi9cbiAgYWRkSXRlbShrZXk6IHN0cmluZywgbGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMucmVtb3ZlSXRlbShrZXkpOyAvLyBUcnkgdG8gcmVtb3ZlIGtleSBmaXJzdCB0byBnZXQgb3ZlcndyaXRlIGJlaGF2aW9yIGFuZCBhdm9pZCBkdXBsaWNhdGUga2V5c1xuICAgIHRoaXMuaXRlbXMucHVzaCh7IGtleToga2V5LCBsYWJlbDogbGFiZWwgfSk7XG4gICAgdGhpcy5vbkl0ZW1BZGRlZEV2ZW50KGtleSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiByZW1vdmFsIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBpZiB0aGUgaXRlbSBpcyBub3QgcGFydCBvZiB0aGlzIHNlbGVjdG9yXG4gICAqL1xuICByZW1vdmVJdGVtKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoa2V5KTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgQXJyYXlVdGlscy5yZW1vdmUodGhpcy5pdGVtcywgdGhpcy5pdGVtc1tpbmRleF0pO1xuICAgICAgdGhpcy5vbkl0ZW1SZW1vdmVkRXZlbnQoa2V5KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGFuIGl0ZW0gZnJvbSB0aGUgaXRlbXMgaW4gdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpcyB0aGUgc2VsZWN0aW9uIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBpZiB0aGUgc2VsZWN0ZWQgaXRlbSBpcyBub3QgcGFydCBvZiB0aGUgc2VsZWN0b3JcbiAgICovXG4gIHNlbGVjdEl0ZW0oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoa2V5ID09PSB0aGlzLnNlbGVjdGVkSXRlbSkge1xuICAgICAgLy8gaXRlbUNvbmZpZyBpcyBhbHJlYWR5IHNlbGVjdGVkLCBzdXBwcmVzcyBhbnkgZnVydGhlciBhY3Rpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGtleSk7XG5cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSBrZXk7XG4gICAgICB0aGlzLm9uSXRlbVNlbGVjdGVkRXZlbnQoa2V5KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBrZXkgb2YgdGhlIHNlbGVjdGVkIGl0ZW0uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBrZXkgb2YgdGhlIHNlbGVjdGVkIGl0ZW0gb3IgbnVsbCBpZiBubyBpdGVtIGlzIHNlbGVjdGVkXG4gICAqL1xuICBnZXRTZWxlY3RlZEl0ZW0oKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGl0ZW1zIGZyb20gdGhpcyBzZWxlY3Rvci5cbiAgICovXG4gIGNsZWFySXRlbXMoKSB7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtczsgLy8gbG9jYWwgY29weSBmb3IgaXRlcmF0aW9uIGFmdGVyIGNsZWFyXG4gICAgdGhpcy5pdGVtcyA9IFtdOyAvLyBjbGVhciBpdGVtc1xuXG4gICAgLy8gZmlyZSBldmVudHNcbiAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICB0aGlzLm9uSXRlbVJlbW92ZWRFdmVudChpdGVtLmtleSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGlzIHNlbGVjdG9yLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgaXRlbUNvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1BZGRlZEV2ZW50KGtleTogc3RyaW5nKSB7XG4gICAgdGhpcy5saXN0U2VsZWN0b3JFdmVudHMub25JdGVtQWRkZWQuZGlzcGF0Y2godGhpcywga2V5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1SZW1vdmVkRXZlbnQoa2V5OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1SZW1vdmVkLmRpc3BhdGNoKHRoaXMsIGtleSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtU2VsZWN0ZWRFdmVudChrZXk6IHN0cmluZykge1xuICAgIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbVNlbGVjdGVkLmRpc3BhdGNoKHRoaXMsIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGFuIGl0ZW0gaXMgYWRkZWQgdG8gdGhlIGxpc3Qgb2YgaXRlbXMuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPn1cbiAgICovXG4gIGdldCBvbkl0ZW1BZGRlZCgpOiBFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbUFkZGVkLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGFuIGl0ZW0gaXMgcmVtb3ZlZCBmcm9tIHRoZSBsaXN0IG9mIGl0ZW1zLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25JdGVtUmVtb3ZlZCgpOiBFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbVJlbW92ZWQuZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gYW4gaXRlbSBpcyBzZWxlY3RlZCBmcm9tIHRoZSBsaXN0IG9mIGl0ZW1zLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25JdGVtU2VsZWN0ZWQoKTogRXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1TZWxlY3RlZC5nZXRFdmVudCgpO1xuICB9XG59IiwiaW1wb3J0IHtMYWJlbENvbmZpZywgTGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBFbnVtZXJhdGVzIHRoZSB0eXBlcyBvZiBjb250ZW50IHRoYXQgdGhlIHtAbGluayBNZXRhZGF0YUxhYmVsfSBjYW4gZGlzcGxheS5cbiAqL1xuZXhwb3J0IGVudW0gTWV0YWRhdGFMYWJlbENvbnRlbnQge1xuICAvKipcbiAgICogVGl0bGUgb2YgdGhlIGRhdGEgc291cmNlLlxuICAgKi9cbiAgVGl0bGUsXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBmbyB0aGUgZGF0YSBzb3VyY2UuXG4gICAqL1xuICBEZXNjcmlwdGlvbixcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3Ige0BsaW5rIE1ldGFkYXRhTGFiZWx9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldGFkYXRhTGFiZWxDb25maWcgZXh0ZW5kcyBMYWJlbENvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBjb250ZW50IHRoYXQgc2hvdWxkIGJlIGRpc3BsYXllZCBpbiB0aGUgbGFiZWwuXG4gICAqL1xuICBjb250ZW50OiBNZXRhZGF0YUxhYmVsQ29udGVudDtcbn1cblxuLyoqXG4gKiBBIGxhYmVsIHRoYXQgY2FuIGJlIGNvbmZpZ3VyZWQgdG8gZGlzcGxheSBjZXJ0YWluIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY2xhc3MgTWV0YWRhdGFMYWJlbCBleHRlbmRzIExhYmVsPE1ldGFkYXRhTGFiZWxDb25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE1ldGFkYXRhTGFiZWxDb25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3NlczogWydsYWJlbC1tZXRhZGF0YScsICdsYWJlbC1tZXRhZGF0YS0nICsgTWV0YWRhdGFMYWJlbENvbnRlbnRbY29uZmlnLmNvbnRlbnRdLnRvTG93ZXJDYXNlKCldXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8TWV0YWRhdGFMYWJlbENvbmZpZz50aGlzLmdldENvbmZpZygpO1xuICAgIGxldCB1aWNvbmZpZyA9IHVpbWFuYWdlci5nZXRDb25maWcoKTtcblxuICAgIGxldCBpbml0ID0gKCkgPT4ge1xuICAgICAgc3dpdGNoIChjb25maWcuY29udGVudCkge1xuICAgICAgICBjYXNlIE1ldGFkYXRhTGFiZWxDb250ZW50LlRpdGxlOlxuICAgICAgICAgIGlmICh1aWNvbmZpZyAmJiB1aWNvbmZpZy5tZXRhZGF0YSAmJiB1aWNvbmZpZy5tZXRhZGF0YS50aXRsZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0KHVpY29uZmlnLm1ldGFkYXRhLnRpdGxlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UgJiYgcGxheWVyLmdldENvbmZpZygpLnNvdXJjZS50aXRsZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0KHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UudGl0bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBNZXRhZGF0YUxhYmVsQ29udGVudC5EZXNjcmlwdGlvbjpcbiAgICAgICAgICBpZiAodWljb25maWcgJiYgdWljb25maWcubWV0YWRhdGEgJiYgdWljb25maWcubWV0YWRhdGEuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dCh1aWNvbmZpZy5tZXRhZGF0YS5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCB1bmxvYWQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFRleHQobnVsbCk7XG4gICAgfTtcblxuICAgIC8vIEluaXQgbGFiZWxcbiAgICBpbml0KCk7XG4gICAgLy8gUmVpbml0IGxhYmVsIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9MT0FERUQsIGluaXQpO1xuICAgIC8vIENsZWFyIGxhYmVscyB3aGVuIHNvdXJjZSBpcyB1bmxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgdW5sb2FkKTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIEFwcGxlIG1hY09TIHBpY3R1cmUtaW4tcGljdHVyZSBtb2RlLlxuICovXG5leHBvcnQgY2xhc3MgUGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbiBleHRlbmRzIFRvZ2dsZUJ1dHRvbjxUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktcGlwdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdQaWN0dXJlLWluLVBpY3R1cmUnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGlmICghcGxheWVyLmlzUGljdHVyZUluUGljdHVyZUF2YWlsYWJsZSkge1xuICAgICAgLy8gSWYgdGhlIHBsYXllciBkb2VzIG5vdCBzdXBwb3J0IFBJUCAocGxheWVyIDcuMCksIHdlIGp1c3QgaGlkZSB0aGlzIGNvbXBvbmVudCBhbmQgc2tpcCBjb25maWd1cmF0aW9uXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNQaWN0dXJlSW5QaWN0dXJlQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgaWYgKHBsYXllci5pc1BpY3R1cmVJblBpY3R1cmUoKSkge1xuICAgICAgICAgIHBsYXllci5leGl0UGljdHVyZUluUGljdHVyZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYXllci5lbnRlclBpY3R1cmVJblBpY3R1cmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUElQIHVuYXZhaWxhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBwaXBBdmFpbGFibGVIYW5kZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzUGljdHVyZUluUGljdHVyZUF2YWlsYWJsZSgpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBwaXBBdmFpbGFibGVIYW5kZXIpO1xuXG4gICAgLy8gVG9nZ2xlIGJ1dHRvbiAnb24nIHN0YXRlXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUElDVFVSRV9JTl9QSUNUVVJFX0VOVEVSLCAoKSA9PiB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUElDVFVSRV9JTl9QSUNUVVJFX0VYSVQsICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBwaXBBdmFpbGFibGVIYW5kZXIoKTsgLy8gSGlkZSBidXR0b24gaWYgUElQIG5vdCBhdmFpbGFibGVcbiAgICBpZiAocGxheWVyLmlzUGljdHVyZUluUGljdHVyZSgpKSB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vc2VsZWN0Ym94JztcbmltcG9ydCB7TGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2VsZWN0IGJveCBwcm92aWRpbmcgYSBzZWxlY3Rpb24gb2YgZGlmZmVyZW50IHBsYXliYWNrIHNwZWVkcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXliYWNrU3BlZWRTZWxlY3RCb3ggZXh0ZW5kcyBTZWxlY3RCb3gge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIHRoaXMuYWRkSXRlbSgnMC4yNScsICcwLjI1eCcpO1xuICAgIHRoaXMuYWRkSXRlbSgnMC41JywgJzAuNXgnKTtcbiAgICB0aGlzLmFkZEl0ZW0oJzEnLCAnTm9ybWFsJyk7XG4gICAgdGhpcy5hZGRJdGVtKCcxLjUnLCAnMS41eCcpO1xuICAgIHRoaXMuYWRkSXRlbSgnMicsICcyeCcpO1xuXG4gICAgdGhpcy5zZWxlY3RJdGVtKCcxJyk7XG5cblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IFBsYXliYWNrU3BlZWRTZWxlY3RCb3gsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHBsYXllci5zZXRQbGF5YmFja1NwZWVkKHBhcnNlRmxvYXQodmFsdWUpKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7TGFiZWxDb25maWcsIExhYmVsfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1N0cmluZ1V0aWxzLCBQbGF5ZXJVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IExpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncyA9IFBsYXllclV0aWxzLkxpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncztcblxuZXhwb3J0IGVudW0gUGxheWJhY2tUaW1lTGFiZWxNb2RlIHtcbiAgQ3VycmVudFRpbWUsXG4gIFRvdGFsVGltZSxcbiAgQ3VycmVudEFuZFRvdGFsVGltZSxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbGF5YmFja1RpbWVMYWJlbENvbmZpZyBleHRlbmRzIExhYmVsQ29uZmlnIHtcbiAgdGltZUxhYmVsTW9kZT86IFBsYXliYWNrVGltZUxhYmVsTW9kZTtcbiAgaGlkZUluTGl2ZVBsYXliYWNrPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGxhYmVsIHRoYXQgZGlzcGxheSB0aGUgY3VycmVudCBwbGF5YmFjayB0aW1lIGFuZCB0aGUgdG90YWwgdGltZSB0aHJvdWdoIHtAbGluayBQbGF5YmFja1RpbWVMYWJlbCNzZXRUaW1lIHNldFRpbWV9XG4gKiBvciBhbnkgc3RyaW5nIHRocm91Z2gge0BsaW5rIFBsYXliYWNrVGltZUxhYmVsI3NldFRleHQgc2V0VGltZVRleHR9LlxuICovXG5leHBvcnQgY2xhc3MgUGxheWJhY2tUaW1lTGFiZWwgZXh0ZW5kcyBMYWJlbDxQbGF5YmFja1RpbWVMYWJlbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgdGltZUZvcm1hdDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogUGxheWJhY2tUaW1lTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCA8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+e1xuICAgICAgY3NzQ2xhc3M6ICd1aS1wbGF5YmFja3RpbWVsYWJlbCcsXG4gICAgICB0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudEFuZFRvdGFsVGltZSxcbiAgICAgIGhpZGVJbkxpdmVQbGF5YmFjazogZmFsc2UsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+dGhpcy5nZXRDb25maWcoKTtcbiAgICBsZXQgbGl2ZSA9IGZhbHNlO1xuICAgIGxldCBsaXZlQ3NzQ2xhc3MgPSB0aGlzLnByZWZpeENzcygndWktcGxheWJhY2t0aW1lbGFiZWwtbGl2ZScpO1xuICAgIGxldCBsaXZlRWRnZUNzc0NsYXNzID0gdGhpcy5wcmVmaXhDc3MoJ3VpLXBsYXliYWNrdGltZWxhYmVsLWxpdmUtZWRnZScpO1xuICAgIGxldCBtaW5XaWR0aCA9IDA7XG5cbiAgICBsZXQgbGl2ZUNsaWNrSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHBsYXllci50aW1lU2hpZnQoMCk7XG4gICAgfTtcblxuICAgIGxldCB1cGRhdGVMaXZlU3RhdGUgPSAoKSA9PiB7XG4gICAgICAvLyBQbGF5ZXIgaXMgcGxheWluZyBhIGxpdmUgc3RyZWFtIHdoZW4gdGhlIGR1cmF0aW9uIGlzIGluZmluaXRlXG4gICAgICBsaXZlID0gcGxheWVyLmlzTGl2ZSgpO1xuXG4gICAgICAvLyBBdHRhY2gvZGV0YWNoIGxpdmUgbWFya2VyIGNsYXNzXG4gICAgICBpZiAobGl2ZSkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyhsaXZlQ3NzQ2xhc3MpO1xuICAgICAgICB0aGlzLnNldFRleHQoJ0xpdmUnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5oaWRlSW5MaXZlUGxheWJhY2spIHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKGxpdmVDbGlja0hhbmRsZXIpO1xuICAgICAgICB1cGRhdGVMaXZlVGltZXNoaWZ0U3RhdGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVDc3NDbGFzcyk7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVFZGdlQ3NzQ2xhc3MpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgdGhpcy5vbkNsaWNrLnVuc3Vic2NyaWJlKGxpdmVDbGlja0hhbmRsZXIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdXBkYXRlTGl2ZVRpbWVzaGlmdFN0YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5nZXRUaW1lU2hpZnQoKSA9PT0gMCkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyhsaXZlRWRnZUNzc0NsYXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVFZGdlQ3NzQ2xhc3MpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgbGl2ZVN0cmVhbURldGVjdG9yID0gbmV3IFBsYXllclV0aWxzLkxpdmVTdHJlYW1EZXRlY3RvcihwbGF5ZXIpO1xuICAgIGxpdmVTdHJlYW1EZXRlY3Rvci5vbkxpdmVDaGFuZ2VkLnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzOiBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MpID0+IHtcbiAgICAgIGxpdmUgPSBhcmdzLmxpdmU7XG4gICAgICB1cGRhdGVMaXZlU3RhdGUoKTtcbiAgICB9KTtcbiAgICBsaXZlU3RyZWFtRGV0ZWN0b3IuZGV0ZWN0KCk7IC8vIEluaXRpYWwgZGV0ZWN0aW9uXG5cbiAgICBsZXQgcGxheWJhY2tUaW1lSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmICghbGl2ZSAmJiBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgdGhpcy5zZXRUaW1lKHBsYXllci5nZXRDdXJyZW50VGltZSgpLCBwbGF5ZXIuZ2V0RHVyYXRpb24oKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkICdqdW1waW5nJyBpbiB0aGUgVUkgYnkgdmFyeWluZyBsYWJlbCBzaXplcyBkdWUgdG8gbm9uLW1vbm9zcGFjZWQgZm9udHMsXG4gICAgICAvLyB3ZSBncmFkdWFsbHkgaW5jcmVhc2UgdGhlIG1pbi13aWR0aCB3aXRoIHRoZSBjb250ZW50IHRvIHJlYWNoIGEgc3RhYmxlIHNpemUuXG4gICAgICBsZXQgd2lkdGggPSB0aGlzLmdldERvbUVsZW1lbnQoKS53aWR0aCgpO1xuICAgICAgaWYgKHdpZHRoID4gbWluV2lkdGgpIHtcbiAgICAgICAgbWluV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgICAnbWluLXdpZHRoJzogbWluV2lkdGggKyAncHgnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHBsYXliYWNrVGltZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgcGxheWJhY2tUaW1lSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9USU1FX1VQREFURUQsIHBsYXliYWNrVGltZUhhbmRsZXIpO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVCwgdXBkYXRlTGl2ZVRpbWVzaGlmdFN0YXRlKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZURUQsIHVwZGF0ZUxpdmVUaW1lc2hpZnRTdGF0ZSk7XG5cbiAgICBsZXQgaW5pdCA9ICgpID0+IHtcbiAgICAgIC8vIFJlc2V0IG1pbi13aWR0aCB3aGVuIGEgbmV3IHNvdXJjZSBpcyByZWFkeSAoZXNwZWNpYWxseSBmb3Igc3dpdGNoaW5nIFZPRC9MaXZlIG1vZGVzIHdoZXJlIHRoZSBsYWJlbCBjb250ZW50XG4gICAgICAvLyBjaGFuZ2VzKVxuICAgICAgbWluV2lkdGggPSAwO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgJ21pbi13aWR0aCc6IG51bGxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTZXQgdGltZSBmb3JtYXQgZGVwZW5kaW5nIG9uIHNvdXJjZSBkdXJhdGlvblxuICAgICAgdGhpcy50aW1lRm9ybWF0ID0gTWF0aC5hYnMocGxheWVyLmlzTGl2ZSgpID8gcGxheWVyLmdldE1heFRpbWVTaGlmdCgpIDogcGxheWVyLmdldER1cmF0aW9uKCkpID49IDM2MDAgP1xuICAgICAgICBTdHJpbmdVdGlscy5GT1JNQVRfSEhNTVNTIDogU3RyaW5nVXRpbHMuRk9STUFUX01NU1M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0aW1lIGFmdGVyIHRoZSBmb3JtYXQgaGFzIGJlZW4gc2V0XG4gICAgICBwbGF5YmFja1RpbWVIYW5kbGVyKCk7XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgaW5pdCk7XG5cbiAgICBpbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY3VycmVudCBwbGF5YmFjayB0aW1lIGFuZCB0b3RhbCBkdXJhdGlvbi5cbiAgICogQHBhcmFtIHBsYXliYWNrU2Vjb25kcyB0aGUgY3VycmVudCBwbGF5YmFjayB0aW1lIGluIHNlY29uZHNcbiAgICogQHBhcmFtIGR1cmF0aW9uU2Vjb25kcyB0aGUgdG90YWwgZHVyYXRpb24gaW4gc2Vjb25kc1xuICAgKi9cbiAgc2V0VGltZShwbGF5YmFja1NlY29uZHM6IG51bWJlciwgZHVyYXRpb25TZWNvbmRzOiBudW1iZXIpIHtcbiAgICBsZXQgY3VycmVudFRpbWUgPSBTdHJpbmdVdGlscy5zZWNvbmRzVG9UaW1lKHBsYXliYWNrU2Vjb25kcywgdGhpcy50aW1lRm9ybWF0KTtcbiAgICBsZXQgdG90YWxUaW1lID0gU3RyaW5nVXRpbHMuc2Vjb25kc1RvVGltZShkdXJhdGlvblNlY29uZHMsIHRoaXMudGltZUZvcm1hdCk7XG5cbiAgICBzd2l0Y2ggKCg8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+dGhpcy5jb25maWcpLnRpbWVMYWJlbE1vZGUpIHtcbiAgICAgIGNhc2UgUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRUaW1lOlxuICAgICAgICB0aGlzLnNldFRleHQoYCR7Y3VycmVudFRpbWV9YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQbGF5YmFja1RpbWVMYWJlbE1vZGUuVG90YWxUaW1lOlxuICAgICAgICB0aGlzLnNldFRleHQoYCR7dG90YWxUaW1lfWApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRBbmRUb3RhbFRpbWU6XG4gICAgICAgIHRoaXMuc2V0VGV4dChgJHtjdXJyZW50VGltZX0gLyAke3RvdGFsVGltZX1gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJFdmVudDtcbmltcG9ydCB7UGxheWVyVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncyA9IFBsYXllclV0aWxzLlRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzO1xuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyBiZXR3ZWVuIHBsYXliYWNrIGFuZCBwYXVzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXliYWNrVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENMQVNTX1NUT1BUT0dHTEUgPSAnc3RvcHRvZ2dsZSc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXBsYXliYWNrdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdQbGF5L1BhdXNlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlciwgaGFuZGxlQ2xpY2tFdmVudDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGlzU2Vla2luZyA9IGZhbHNlO1xuXG4gICAgLy8gSGFuZGxlciB0byB1cGRhdGUgYnV0dG9uIHN0YXRlIGJhc2VkIG9uIHBsYXllciBzdGF0ZVxuICAgIGxldCBwbGF5YmFja1N0YXRlSGFuZGxlciA9IChldmVudDogUGxheWVyRXZlbnQpID0+IHtcbiAgICAgIC8vIElmIHRoZSBVSSBpcyBjdXJyZW50bHkgc2Vla2luZywgcGxheWJhY2sgaXMgdGVtcG9yYXJpbHkgc3RvcHBlZCBidXQgdGhlIGJ1dHRvbnMgc2hvdWxkXG4gICAgICAvLyBub3QgcmVmbGVjdCB0aGF0IGFuZCBzdGF5IGFzLWlzIChlLmcgaW5kaWNhdGUgcGxheWJhY2sgd2hpbGUgc2Vla2luZykuXG4gICAgICBpZiAoaXNTZWVraW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHBsYXllci5pc1BsYXlpbmcoKSkge1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9mZigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDYWxsIGhhbmRsZXIgdXBvbiB0aGVzZSBldmVudHNcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCBwbGF5YmFja1N0YXRlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUEFVU0VELCBwbGF5YmFja1N0YXRlSGFuZGxlcik7XG4gICAgLy8gd2hlbiBwbGF5YmFjayBmaW5pc2hlcywgcGxheWVyIHR1cm5zIHRvIHBhdXNlZCBtb2RlXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUJBQ0tfRklOSVNIRUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1BMQVlJTkcsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1BBVVNFRCwgcGxheWJhY2tTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfUExBWUJBQ0tfRklOSVNIRUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcblxuICAgIC8vIERldGVjdCBhYnNlbmNlIG9mIHRpbWVzaGlmdGluZyBvbiBsaXZlIHN0cmVhbXMgYW5kIGFkZCB0YWdnaW5nIGNsYXNzIHRvIGNvbnZlcnQgYnV0dG9uIGljb25zIHRvIHBsYXkvc3RvcFxuICAgIGxldCB0aW1lU2hpZnREZXRlY3RvciA9IG5ldyBQbGF5ZXJVdGlscy5UaW1lU2hpZnRBdmFpbGFiaWxpdHlEZXRlY3RvcihwbGF5ZXIpO1xuICAgIHRpbWVTaGlmdERldGVjdG9yLm9uVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZC5zdWJzY3JpYmUoXG4gICAgICAoc2VuZGVyLCBhcmdzOiBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncykgPT4ge1xuICAgICAgICBpZiAoIWFyZ3MudGltZVNoaWZ0QXZhaWxhYmxlKSB7XG4gICAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoUGxheWJhY2tUb2dnbGVCdXR0b24uQ0xBU1NfU1RPUFRPR0dMRSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFBsYXliYWNrVG9nZ2xlQnV0dG9uLkNMQVNTX1NUT1BUT0dHTEUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gICAgdGltZVNoaWZ0RGV0ZWN0b3IuZGV0ZWN0KCk7IC8vIEluaXRpYWwgZGV0ZWN0aW9uXG5cbiAgICBpZiAoaGFuZGxlQ2xpY2tFdmVudCkge1xuICAgICAgLy8gQ29udHJvbCBwbGF5ZXIgYnkgYnV0dG9uIGV2ZW50c1xuICAgICAgLy8gV2hlbiBhIGJ1dHRvbiBldmVudCB0cmlnZ2VycyBhIHBsYXllciBBUEkgY2FsbCwgZXZlbnRzIGFyZSBmaXJlZCB3aGljaCBpbiB0dXJuIGNhbGwgdGhlIGV2ZW50IGhhbmRsZXJcbiAgICAgIC8vIGFib3ZlIHRoYXQgdXBkYXRlZCB0aGUgYnV0dG9uIHN0YXRlLlxuICAgICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoZSkgPT4ge1xuICAgICAgICBpZiAocGxheWVyLmlzUGxheWluZygpKSB7XG4gICAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoe2FjdGlvbjogJ3BhdXNlJywgZSwgb3JpZ2luYXRvcjogJ1BsYXliYWNrVG9nZ2xlQnV0dG9uJ30pXG4gICAgICAgICAgcGxheWVyLnBhdXNlKCd1aS1idXR0b24nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7YWN0aW9uOiAncGxheScsIGUsIG9yaWdpbmF0b3I6ICdQbGF5YmFja1RvZ2dsZUJ1dHRvbid9KVxuICAgICAgICAgIHBsYXllci5wbGF5KCd1aS1idXR0b24nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVHJhY2sgVUkgc2Vla2luZyBzdGF0dXNcbiAgICB1aW1hbmFnZXIub25TZWVrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSB0cnVlO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vblNlZWtlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaXNTZWVraW5nID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBwbGF5YmFja1N0YXRlSGFuZGxlcihudWxsKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7SHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2h1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgZXJyb3IgbWVzc2FnZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBwbGF5YmFja1RvZ2dsZUJ1dHRvbjogSHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5wbGF5YmFja1RvZ2dsZUJ1dHRvbiA9IG5ldyBIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24oKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktcGxheWJhY2t0b2dnbGUtb3ZlcmxheScsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy5wbGF5YmFja1RvZ2dsZUJ1dHRvbl1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lckNvbmZpZywgQ29udGFpbmVyfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXIsIFVJUmVjb21tZW5kYXRpb25Db25maWd9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0h1Z2VSZXBsYXlCdXR0b259IGZyb20gJy4vaHVnZXJlcGxheWJ1dHRvbic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgcmVjb21tZW5kZWQgdmlkZW9zLlxuICovXG5leHBvcnQgY2xhc3MgUmVjb21tZW5kYXRpb25PdmVybGF5IGV4dGVuZHMgQ29udGFpbmVyPENvbnRhaW5lckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgcmVwbGF5QnV0dG9uOiBIdWdlUmVwbGF5QnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5yZXBsYXlCdXR0b24gPSBuZXcgSHVnZVJlcGxheUJ1dHRvbigpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1yZWNvbW1lbmRhdGlvbi1vdmVybGF5JyxcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLnJlcGxheUJ1dHRvbl1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNsZWFyUmVjb21tZW5kYXRpb25zID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBSZWNvbW1lbmRhdGlvbkl0ZW0pIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKCdyZWNvbW1lbmRhdGlvbnMnKSk7XG4gICAgfTtcblxuICAgIGxldCBzZXR1cFJlY29tbWVuZGF0aW9ucyA9ICgpID0+IHtcbiAgICAgIGNsZWFyUmVjb21tZW5kYXRpb25zKCk7XG5cbiAgICAgIGxldCBoYXNSZWNvbW1lbmRhdGlvbnNJblVpQ29uZmlnID0gdWltYW5hZ2VyLmdldENvbmZpZygpLnJlY29tbWVuZGF0aW9uc1xuICAgICAgICAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkucmVjb21tZW5kYXRpb25zLmxlbmd0aCA+IDA7XG4gICAgICBsZXQgaGFzUmVjb21tZW5kYXRpb25zSW5QbGF5ZXJDb25maWcgPSBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UucmVjb21tZW5kYXRpb25zXG4gICAgICAgICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UucmVjb21tZW5kYXRpb25zLmxlbmd0aCA+IDA7XG5cbiAgICAgIC8vIFRha2UgbWFya2VycyBmcm9tIHRoZSBVSSBjb25maWcuIElmIG5vIG1hcmtlcnMgZGVmaW5lZCwgdHJ5IHRvIHRha2UgdGhlbSBmcm9tIHRoZSBwbGF5ZXIncyBzb3VyY2UgY29uZmlnLlxuICAgICAgbGV0IHJlY29tbWVuZGF0aW9ucyA9IGhhc1JlY29tbWVuZGF0aW9uc0luVWlDb25maWcgPyB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkucmVjb21tZW5kYXRpb25zIDpcbiAgICAgICAgaGFzUmVjb21tZW5kYXRpb25zSW5QbGF5ZXJDb25maWcgPyBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLnJlY29tbWVuZGF0aW9ucyA6IG51bGw7XG5cbiAgICAgIC8vIEdlbmVyYXRlIHRpbWVsaW5lIG1hcmtlcnMgZnJvbSB0aGUgY29uZmlnIGlmIHdlIGhhdmUgbWFya2VycyBhbmQgaWYgd2UgaGF2ZSBhIGR1cmF0aW9uXG4gICAgICAvLyBUaGUgZHVyYXRpb24gY2hlY2sgaXMgZm9yIGJ1Z2d5IHBsYXRmb3JtcyB3aGVyZSB0aGUgZHVyYXRpb24gaXMgbm90IGF2YWlsYWJsZSBpbnN0YW50bHkgKENocm9tZSBvbiBBbmRyb2lkIDQuMylcbiAgICAgIGlmIChyZWNvbW1lbmRhdGlvbnMpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gMTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZWNvbW1lbmRhdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgUmVjb21tZW5kYXRpb25JdGVtKHtcbiAgICAgICAgICAgIGl0ZW1Db25maWc6IGl0ZW0sXG4gICAgICAgICAgICBjc3NDbGFzc2VzOiBbJ3JlY29tbWVuZGF0aW9uLWl0ZW0tJyArIChpbmRleCsrKV1cbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVDb21wb25lbnRzKCk7IC8vIGNyZWF0ZSBjb250YWluZXIgRE9NIGVsZW1lbnRzXG5cbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ3JlY29tbWVuZGF0aW9ucycpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQWRkIHJlY29tbWVuZGF0aW9uIHdoZW4gYSBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHNldHVwUmVjb21tZW5kYXRpb25zKTtcbiAgICAvLyBSZW1vdmUgcmVjb21tZW5kYXRpb25zIGFuZCBoaWRlIG92ZXJsYXkgd2hlbiBzb3VyY2UgaXMgdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsICgpID0+IHtcbiAgICAgIGNsZWFyUmVjb21tZW5kYXRpb25zKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcbiAgICAvLyBEaXNwbGF5IHJlY29tbWVuZGF0aW9ucyB3aGVuIHBsYXliYWNrIGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlCQUNLX0ZJTklTSEVELCAoKSA9PiB7XG4gICAgICAvLyBEaXNtaXNzIE9OX1BMQVlCQUNLX0ZJTklTSEVEIGV2ZW50cyBhdCB0aGUgZW5kIG9mIGFkc1xuICAgICAgLy8gVE9ETyByZW1vdmUgdGhpcyB3b3JrYXJvdW5kIG9uY2UgaXNzdWUgIzEyNzggaXMgc29sdmVkXG4gICAgICBpZiAocGxheWVyLmlzQWQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0pO1xuICAgIC8vIEhpZGUgcmVjb21tZW5kYXRpb25zIHdoZW4gcGxheWJhY2sgc3RhcnRzLCBlLmcuIGEgcmVzdGFydFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVksICgpID0+IHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdCBvbiBzdGFydHVwXG4gICAgc2V0dXBSZWNvbW1lbmRhdGlvbnMoKTtcbiAgfVxufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIFJlY29tbWVuZGF0aW9uSXRlbX1cbiAqL1xuaW50ZXJmYWNlIFJlY29tbWVuZGF0aW9uSXRlbUNvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gIGl0ZW1Db25maWc6IFVJUmVjb21tZW5kYXRpb25Db25maWc7XG59XG5cbi8qKlxuICogQW4gaXRlbSBvZiB0aGUge0BsaW5rIFJlY29tbWVuZGF0aW9uT3ZlcmxheX0uIFVzZWQgb25seSBpbnRlcm5hbGx5IGluIHtAbGluayBSZWNvbW1lbmRhdGlvbk92ZXJsYXl9LlxuICovXG5jbGFzcyBSZWNvbW1lbmRhdGlvbkl0ZW0gZXh0ZW5kcyBDb21wb25lbnQ8UmVjb21tZW5kYXRpb25JdGVtQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBSZWNvbW1lbmRhdGlvbkl0ZW1Db25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1yZWNvbW1lbmRhdGlvbi1pdGVtJyxcbiAgICAgIGl0ZW1Db25maWc6IG51bGwgLy8gdGhpcyBtdXN0IGJlIHBhc3NlZCBpbiBmcm9tIG91dHNpZGVcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGNvbmZpZyA9ICg8UmVjb21tZW5kYXRpb25JdGVtQ29uZmlnPnRoaXMuY29uZmlnKS5pdGVtQ29uZmlnOyAvLyBUT0RPIGZpeCBnZW5lcmljcyBhbmQgZ2V0IHJpZCBvZiBjYXN0XG5cbiAgICBsZXQgaXRlbUVsZW1lbnQgPSBuZXcgRE9NKCdhJywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKSxcbiAgICAgICdocmVmJzogY29uZmlnLnVybFxuICAgIH0pLmNzcyh7ICdiYWNrZ3JvdW5kLWltYWdlJzogYHVybCgke2NvbmZpZy50aHVtYm5haWx9KWAgfSk7XG5cbiAgICBsZXQgYmdFbGVtZW50ID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2JhY2tncm91bmQnKVxuICAgIH0pO1xuICAgIGl0ZW1FbGVtZW50LmFwcGVuZChiZ0VsZW1lbnQpO1xuXG4gICAgbGV0IHRpdGxlRWxlbWVudCA9IG5ldyBET00oJ3NwYW4nLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygndGl0bGUnKVxuICAgIH0pLmFwcGVuZChuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2lubmVydGl0bGUnKVxuICAgIH0pLmh0bWwoY29uZmlnLnRpdGxlKSk7XG4gICAgaXRlbUVsZW1lbnQuYXBwZW5kKHRpdGxlRWxlbWVudCk7XG5cbiAgICBsZXQgdGltZUVsZW1lbnQgPSBuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2R1cmF0aW9uJylcbiAgICB9KS5hcHBlbmQobmV3IERPTSgnc3BhbicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdpbm5lcmR1cmF0aW9uJylcbiAgICB9KS5odG1sKGNvbmZpZy5kdXJhdGlvbiA/IFN0cmluZ1V0aWxzLnNlY29uZHNUb1RpbWUoY29uZmlnLmR1cmF0aW9uKSA6ICcnKSk7XG4gICAgaXRlbUVsZW1lbnQuYXBwZW5kKHRpbWVFbGVtZW50KTtcblxuICAgIHJldHVybiBpdGVtRWxlbWVudDtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtFdmVudCwgRXZlbnREaXNwYXRjaGVyLCBOb0FyZ3N9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5pbXBvcnQge1NlZWtCYXJMYWJlbH0gZnJvbSAnLi9zZWVrYmFybGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlciwgVGltZWxpbmVNYXJrZXIsIFNlZWtQcmV2aWV3QXJnc30gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5pbXBvcnQge1BsYXllclV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3MgPSBQbGF5ZXJVdGlscy5UaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncztcbmltcG9ydCBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MgPSBQbGF5ZXJVdGlscy5MaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3M7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgU2Vla0Jhcn0gY29tcG9uZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlZWtCYXJDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICAvKipcbiAgICogVGhlIGxhYmVsIGFib3ZlIHRoZSBzZWVrIHBvc2l0aW9uLlxuICAgKi9cbiAgbGFiZWw/OiBTZWVrQmFyTGFiZWw7XG4gIC8qKlxuICAgKiBCYXIgd2lsbCBiZSB2ZXJ0aWNhbCBpbnN0ZWFkIG9mIGhvcml6b250YWwgaWYgc2V0IHRvIHRydWUuXG4gICAqL1xuICB2ZXJ0aWNhbD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGUgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGluIHdoaWNoIHRoZSBwbGF5YmFjayBwb3NpdGlvbiBvbiB0aGUgc2VlayBiYXIgd2lsbCBiZSB1cGRhdGVkLiBUaGUgc2hvcnRlciB0aGVcbiAgICogaW50ZXJ2YWwsIHRoZSBzbW9vdGhlciBpdCBsb29rcyBhbmQgdGhlIG1vcmUgcmVzb3VyY2UgaW50ZW5zZSBpdCBpcy4gVGhlIHVwZGF0ZSBpbnRlcnZhbCB3aWxsIGJlIGtlcHQgYXMgc3RlYWR5XG4gICAqIGFzIHBvc3NpYmxlIHRvIGF2b2lkIGppdHRlci5cbiAgICogU2V0IHRvIC0xIHRvIGRpc2FibGUgc21vb3RoIHVwZGF0aW5nIGFuZCB1cGRhdGUgaXQgb24gcGxheWVyIE9OX1RJTUVfQ0hBTkdFRCBldmVudHMgaW5zdGVhZC5cbiAgICogRGVmYXVsdDogNTAgKDUwbXMgPSAyMGZwcykuXG4gICAqL1xuICBzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNcz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBFdmVudCBhcmd1bWVudCBpbnRlcmZhY2UgZm9yIGEgc2VlayBwcmV2aWV3IGV2ZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlZWtQcmV2aWV3RXZlbnRBcmdzIGV4dGVuZHMgU2Vla1ByZXZpZXdBcmdzIHtcbiAgLyoqXG4gICAqIFRlbGxzIGlmIHRoZSBzZWVrIHByZXZpZXcgZXZlbnQgY29tZXMgZnJvbSBhIHNjcnViYmluZy5cbiAgICovXG4gIHNjcnViYmluZzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIHNlZWsgYmFyIHRvIHNlZWsgd2l0aGluIHRoZSBwbGF5ZXIncyBtZWRpYS4gSXQgZGlzcGxheXMgdGhlIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb24sIGFtb3VudCBvZiBidWZmZWQgZGF0YSwgc2Vla1xuICogdGFyZ2V0LCBhbmQga2VlcHMgc3RhdHVzIGFib3V0IGFuIG9uZ29pbmcgc2Vlay5cbiAqXG4gKiBUaGUgc2VlayBiYXIgZGlzcGxheXMgZGlmZmVyZW50ICdiYXJzJzpcbiAqICAtIHRoZSBwbGF5YmFjayBwb3NpdGlvbiwgaS5lLiB0aGUgcG9zaXRpb24gaW4gdGhlIG1lZGlhIGF0IHdoaWNoIHRoZSBwbGF5ZXIgY3VycmVudCBwbGF5YmFjayBwb2ludGVyIGlzIHBvc2l0aW9uZWRcbiAqICAtIHRoZSBidWZmZXIgcG9zaXRpb24sIHdoaWNoIHVzdWFsbHkgaXMgdGhlIHBsYXliYWNrIHBvc2l0aW9uIHBsdXMgdGhlIHRpbWUgc3BhbiB0aGF0IGlzIGFscmVhZHkgYnVmZmVyZWQgYWhlYWRcbiAqICAtIHRoZSBzZWVrIHBvc2l0aW9uLCB1c2VkIHRvIHByZXZpZXcgdG8gd2hlcmUgaW4gdGhlIHRpbWVsaW5lIGEgc2VlayB3aWxsIGp1bXAgdG9cbiAqL1xuZXhwb3J0IGNsYXNzIFNlZWtCYXIgZXh0ZW5kcyBDb21wb25lbnQ8U2Vla0JhckNvbmZpZz4ge1xuXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU01PT1RIX1BMQVlCQUNLX1BPU0lUSU9OX1VQREFURV9ESVNBQkxFRCA9IC0xO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzIHRoYXQgaXMgYWRkZWQgdG8gdGhlIERPTSBlbGVtZW50IHdoaWxlIHRoZSBzZWVrIGJhciBpcyBpbiAnc2Vla2luZycgc3RhdGUuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDTEFTU19TRUVLSU5HID0gJ3NlZWtpbmcnO1xuXG4gIHByaXZhdGUgc2Vla0JhcjogRE9NO1xuICBwcml2YXRlIHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uOiBET007XG4gIHByaXZhdGUgc2Vla0JhclBsYXliYWNrUG9zaXRpb25NYXJrZXI6IERPTTtcbiAgcHJpdmF0ZSBzZWVrQmFyQnVmZmVyUG9zaXRpb246IERPTTtcbiAgcHJpdmF0ZSBzZWVrQmFyU2Vla1Bvc2l0aW9uOiBET007XG4gIHByaXZhdGUgc2Vla0JhckJhY2tkcm9wOiBET007XG4gIHByaXZhdGUgc2Vla0Jhck1hcmtlcnNDb250YWluZXI6IERPTTtcblxuICBwcml2YXRlIGxhYmVsOiBTZWVrQmFyTGFiZWw7XG5cbiAgcHJpdmF0ZSBfY29tbWVudHNPbjogYm9vbGVhbiA9IHRydWU7XG4gIHByaXZhdGUgdGltZWxpbmVNYXJrZXJzOiBUaW1lbGluZU1hcmtlcltdO1xuXG4gIC8qKlxuICAgKiBCdWZmZXIgb2YgdGhlIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uLiBUaGUgcG9zaXRpb24gbXVzdCBiZSBidWZmZXJlZCBpbiBjYXNlIHRoZSBlbGVtZW50XG4gICAqIG5lZWRzIHRvIGJlIHJlZnJlc2hlZCB3aXRoIHtAbGluayAjcmVmcmVzaFBsYXliYWNrUG9zaXRpb259LlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgcHJpdmF0ZSBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDA7XG5cbiAgcHJpdmF0ZSBzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcjogVGltZW91dDtcblxuXG4gIC8vIGh0dHBzOi8vaGFja3MubW96aWxsYS5vcmcvMjAxMy8wNC9kZXRlY3RpbmctdG91Y2gtaXRzLXRoZS13aHktbm90LXRoZS1ob3cvXG4gIHByaXZhdGUgdG91Y2hTdXBwb3J0ZWQgPSAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KTtcblxuICBwcml2YXRlIHNlZWtCYXJFdmVudHMgPSB7XG4gICAgLyoqXG4gICAgICogRmlyZWQgd2hlbiBhIHNjcnViYmluZyBzZWVrIG9wZXJhdGlvbiBpcyBzdGFydGVkLlxuICAgICAqL1xuICAgIG9uU2VlazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBOb0FyZ3M+KCksXG4gICAgLyoqXG4gICAgICogRmlyZWQgZHVyaW5nIGEgc2NydWJiaW5nIHNlZWsgdG8gaW5kaWNhdGUgdGhhdCB0aGUgc2VlayBwcmV2aWV3IChpLmUuIHRoZSB2aWRlbyBmcmFtZSkgc2hvdWxkIGJlIHVwZGF0ZWQuXG4gICAgICovXG4gICAgb25TZWVrUHJldmlldzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz4oKSxcbiAgICAvKipcbiAgICAgKiBGaXJlZCB3aGVuIGEgc2NydWJiaW5nIHNlZWsgaGFzIGZpbmlzaGVkIG9yIHdoZW4gYSBkaXJlY3Qgc2VlayBpcyBpc3N1ZWQuXG4gICAgICovXG4gICAgb25TZWVrZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgbnVtYmVyPigpLFxuXG4gICAgLyoqXG4gICAgICogRmlyZSB3aGVuIGNvbW1lbnRzT24gaXMgdG9nZ2xlZFxuICAgICAqL1xuICAgIG9uQ2hhbmdlQ29tbWVudHNPbjogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBib29sZWFuPigpXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZWVrQmFyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZWVrYmFyJyxcbiAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgIHNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zOiA1MCxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG5cbiAgICB0aGlzLmxhYmVsID0gdGhpcy5jb25maWcubGFiZWw7XG4gICAgdGhpcy50aW1lbGluZU1hcmtlcnMgPSBbXTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKHRoaXMuaGFzTGFiZWwoKSkge1xuICAgICAgdGhpcy5nZXRMYWJlbCgpLmluaXRpYWxpemUoKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIsIGNvbmZpZ3VyZVNlZWs6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGlmICghY29uZmlndXJlU2Vlaykge1xuICAgICAgLy8gVGhlIGNvbmZpZ3VyZVNlZWsgZmxhZyBjYW4gYmUgdXNlZCBieSBzdWJjbGFzc2VzIHRvIGRpc2FibGUgY29uZmlndXJhdGlvbiBhcyBzZWVrIGJhci4gRS5nLiB0aGUgdm9sdW1lXG4gICAgICAvLyBzbGlkZXIgaXMgcmV1c2luZyB0aGlzIGNvbXBvbmVudCBidXQgYWRkcyBpdHMgb3duIGZ1bmN0aW9uYWxpdHksIGFuZCBkb2VzIG5vdCBuZWVkIHRoZSBzZWVrIGZ1bmN0aW9uYWxpdHkuXG4gICAgICAvLyBUaGlzIGlzIGFjdHVhbGx5IGEgaGFjaywgdGhlIHByb3BlciBzb2x1dGlvbiB3b3VsZCBiZSBmb3IgYm90aCBzZWVrIGJhciBhbmQgdm9sdW1lIHNsaWRlcnMgdG8gZXh0ZW5kXG4gICAgICAvLyBhIGNvbW1vbiBiYXNlIHNsaWRlciBjb21wb25lbnQgYW5kIGltcGxlbWVudCB0aGVpciBmdW5jdGlvbmFsaXR5IHRoZXJlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwbGF5YmFja05vdEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBsZXQgaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgbGV0IGlzU2Vla2luZyA9IGZhbHNlO1xuXG4gICAgLy8gVXBkYXRlIHBsYXliYWNrIGFuZCBidWZmZXIgcG9zaXRpb25zXG4gICAgbGV0IHBsYXliYWNrUG9zaXRpb25IYW5kbGVyID0gKGV2ZW50OiBQbGF5ZXJFdmVudCA9IG51bGwsIGZvcmNlVXBkYXRlOiBib29sZWFuID0gZmFsc2UpID0+IHtcbiAgICAgIC8vIE9uY2UgdGhpcyBoYW5kbGVyIG9zIGNhbGxlZCwgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBhbmQgd2Ugc2V0IHRoZSBmbGFnIHRvIGZhbHNlXG4gICAgICBwbGF5YmFja05vdEluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChpc1NlZWtpbmcpIHtcbiAgICAgICAgLy8gV2UgY2F1Z2h0IGEgc2VlayBwcmV2aWV3IHNlZWssIGRvIG5vdCB1cGRhdGUgdGhlIHNlZWtiYXJcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGxheWVyLmlzTGl2ZSgpKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgPT09IDApIHtcbiAgICAgICAgICAvLyBUaGlzIGNhc2UgbXVzdCBiZSBleHBsaWNpdGx5IGhhbmRsZWQgdG8gYXZvaWQgZGl2aXNpb24gYnkgemVyb1xuICAgICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbigxMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGxldCBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDEwMCAtICgxMDAgLyBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgKiBwbGF5ZXIuZ2V0VGltZVNoaWZ0KCkpO1xuICAgICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbihwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHdheXMgc2hvdyBmdWxsIGJ1ZmZlciBmb3IgbGl2ZSBzdHJlYW1zXG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24oMTAwKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgcGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgPSAxMDAgLyBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAqIHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xuXG4gICAgICAgIGxldCB2aWRlb0J1ZmZlckxlbmd0aCA9IHBsYXllci5nZXRWaWRlb0J1ZmZlckxlbmd0aCgpO1xuICAgICAgICBsZXQgYXVkaW9CdWZmZXJMZW5ndGggPSBwbGF5ZXIuZ2V0QXVkaW9CdWZmZXJMZW5ndGgoKTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBidWZmZXIgbGVuZ3RoIHdoaWNoIGlzIHRoZSBzbWFsbGVyIGxlbmd0aCBvZiB0aGUgYXVkaW8gYW5kIHZpZGVvIGJ1ZmZlcnMuIElmIG9uZSBvZiB0aGVzZVxuICAgICAgICAvLyBidWZmZXJzIGlzIG5vdCBhdmFpbGFibGUsIHdlIHNldCBpdCdzIHZhbHVlIHRvIE1BWF9WQUxVRSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgb3RoZXIgcmVhbCB2YWx1ZSBpcyB0YWtlblxuICAgICAgICAvLyBhcyB0aGUgYnVmZmVyIGxlbmd0aC5cbiAgICAgICAgbGV0IGJ1ZmZlckxlbmd0aCA9IE1hdGgubWluKFxuICAgICAgICAgIHZpZGVvQnVmZmVyTGVuZ3RoICE9IG51bGwgPyB2aWRlb0J1ZmZlckxlbmd0aCA6IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgYXVkaW9CdWZmZXJMZW5ndGggIT0gbnVsbCA/IGF1ZGlvQnVmZmVyTGVuZ3RoIDogTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgIC8vIElmIGJvdGggYnVmZmVyIGxlbmd0aHMgYXJlIG1pc3NpbmcsIHdlIHNldCB0aGUgYnVmZmVyIGxlbmd0aCB0byB6ZXJvXG4gICAgICAgIGlmIChidWZmZXJMZW5ndGggPT09IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICAgICAgICBidWZmZXJMZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJ1ZmZlclBlcmNlbnRhZ2UgPSAxMDAgLyBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAqIGJ1ZmZlckxlbmd0aDtcblxuICAgICAgICAvLyBVcGRhdGUgcGxheWJhY2sgcG9zaXRpb24gb25seSBpbiBwYXVzZWQgc3RhdGUgb3IgaW4gdGhlIGluaXRpYWwgc3RhcnR1cCBzdGF0ZSB3aGVyZSBwbGF5ZXIgaXMgbmVpdGhlclxuICAgICAgICAvLyBwYXVzZWQgbm9yIHBsYXlpbmcuIFBsYXliYWNrIHVwZGF0ZXMgYXJlIGhhbmRsZWQgaW4gdGhlIFRpbWVvdXQgYmVsb3cuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNcyA9PT0gU2Vla0Jhci5TTU9PVEhfUExBWUJBQ0tfUE9TSVRJT05fVVBEQVRFX0RJU0FCTEVEXG4gICAgICAgICAgfHwgZm9yY2VVcGRhdGUgfHwgcGxheWVyLmlzUGF1c2VkKCkgfHwgKHBsYXllci5pc1BhdXNlZCgpID09PSBwbGF5ZXIuaXNQbGF5aW5nKCkpKSB7XG4gICAgICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24ocGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgKyBidWZmZXJQZXJjZW50YWdlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVXBkYXRlIHNlZWtiYXIgdXBvbiB0aGVzZSBldmVudHNcbiAgICAvLyBpbml0IHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gaXQgY2hhbmdlc1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBidWZmZXJsZXZlbCB3aGVuIGJ1ZmZlcmluZyBpcyBjb21wbGV0ZVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX0VOREVELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gYSBzZWVrIGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBwbGF5YmFjayBwb3NpdGlvbiB3aGVuIGEgdGltZXNoaWZ0IGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfU0hJRlRFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBidWZmZXJsZXZlbCB3aGVuIGEgc2VnbWVudCBoYXMgYmVlbiBkb3dubG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VHTUVOVF9SRVFVRVNUX0ZJTklTSEVELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIG9mIENhc3QgcGxheWJhY2tcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuXG5cbiAgICAvLyBTZWVrIGhhbmRsaW5nXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFSywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTZWVraW5nKHRydWUpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTZWVraW5nKGZhbHNlKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZULCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFNlZWtpbmcodHJ1ZSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVEVELCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFNlZWtpbmcoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgbGV0IHNlZWsgPSAocGVyY2VudGFnZTogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTGl2ZSgpKSB7XG4gICAgICAgIHBsYXllci50aW1lU2hpZnQocGxheWVyLmdldE1heFRpbWVTaGlmdCgpIC0gKHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAqIChwZXJjZW50YWdlIC8gMTAwKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLnNlZWsocGxheWVyLmdldER1cmF0aW9uKCkgKiAocGVyY2VudGFnZSAvIDEwMCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5vblNlZWsuc3Vic2NyaWJlKChzZW5kZXIpID0+IHtcbiAgICAgIGlzU2Vla2luZyA9IHRydWU7IC8vIHRyYWNrIHNlZWtpbmcgc3RhdHVzIHNvIHdlIGNhbiBjYXRjaCBldmVudHMgZnJvbSBzZWVrIHByZXZpZXcgc2Vla3NcblxuICAgICAgLy8gTm90aWZ5IFVJIG1hbmFnZXIgb2Ygc3RhcnRlZCBzZWVrXG4gICAgICB1aW1hbmFnZXIub25TZWVrLmRpc3BhdGNoKHNlbmRlcik7XG5cbiAgICAgIC8vIFNhdmUgY3VycmVudCBwbGF5YmFjayBzdGF0ZVxuICAgICAgaXNQbGF5aW5nID0gcGxheWVyLmlzUGxheWluZygpO1xuXG4gICAgICAvLyBQYXVzZSBwbGF5YmFjayB3aGlsZSBzZWVraW5nXG4gICAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXllci5wYXVzZSgndWktc2VlaycpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMub25TZWVrUHJldmlldy5zdWJzY3JpYmUoKHNlbmRlcjogU2Vla0JhciwgYXJnczogU2Vla1ByZXZpZXdFdmVudEFyZ3MpID0+IHtcbiAgICAgIC8vIE5vdGlmeSBVSSBtYW5hZ2VyIG9mIHNlZWsgcHJldmlld1xuICAgICAgdWltYW5hZ2VyLm9uU2Vla1ByZXZpZXcuZGlzcGF0Y2goc2VuZGVyLCBhcmdzKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uU2Vla1ByZXZpZXcuc3Vic2NyaWJlUmF0ZUxpbWl0ZWQoKHNlbmRlcjogU2Vla0JhciwgYXJnczogU2Vla1ByZXZpZXdFdmVudEFyZ3MpID0+IHtcbiAgICAgIC8vIFJhdGUtbGltaXRlZCBzY3J1YmJpbmcgc2Vla1xuICAgICAgaWYgKGFyZ3Muc2NydWJiaW5nKSB7XG4gICAgICAgIHNlZWsoYXJncy5wb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSwgMjAwKTtcbiAgICB0aGlzLm9uU2Vla2VkLnN1YnNjcmliZSgoc2VuZGVyLCBwZXJjZW50YWdlKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gRG8gdGhlIHNlZWtcbiAgICAgIHNlZWsocGVyY2VudGFnZSk7XG5cbiAgICAgIC8vIENvbnRpbnVlIHBsYXliYWNrIGFmdGVyIHNlZWsgaWYgcGxheWVyIHdhcyBwbGF5aW5nIHdoZW4gc2VlayBzdGFydGVkXG4gICAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXllci5wbGF5KCd1aS1zZWVrJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdGlmeSBVSSBtYW5hZ2VyIG9mIGZpbmlzaGVkIHNlZWtcbiAgICAgIHVpbWFuYWdlci5vblNlZWtlZC5kaXNwYXRjaChzZW5kZXIpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuaGFzTGFiZWwoKSkge1xuICAgICAgLy8gQ29uZmlndXJlIGEgc2Vla2JhciBsYWJlbCB0aGF0IGlzIGludGVybmFsIHRvIHRoZSBzZWVrYmFyKVxuICAgICAgdGhpcy5nZXRMYWJlbCgpLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBzZWVrYmFyIGZvciBsaXZlIHNvdXJjZXMgd2l0aG91dCB0aW1lc2hpZnRcbiAgICBsZXQgaXNMaXZlID0gZmFsc2U7XG4gICAgbGV0IGhhc1RpbWVTaGlmdCA9IGZhbHNlO1xuICAgIGxldCBzd2l0Y2hWaXNpYmlsaXR5ID0gKGlzTGl2ZTogYm9vbGVhbiwgaGFzVGltZVNoaWZ0OiBib29sZWFuKSA9PiB7XG4gICAgICBpZiAoaXNMaXZlICYmICFoYXNUaW1lU2hpZnQpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH1cbiAgICAgIHBsYXliYWNrUG9zaXRpb25IYW5kbGVyKG51bGwsIHRydWUpO1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH07XG4gICAgbGV0IGxpdmVTdHJlYW1EZXRlY3RvciA9IG5ldyBQbGF5ZXJVdGlscy5MaXZlU3RyZWFtRGV0ZWN0b3IocGxheWVyKTtcbiAgICBsaXZlU3RyZWFtRGV0ZWN0b3Iub25MaXZlQ2hhbmdlZC5zdWJzY3JpYmUoKHNlbmRlciwgYXJnczogTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzKSA9PiB7XG4gICAgICBpc0xpdmUgPSBhcmdzLmxpdmU7XG4gICAgICBzd2l0Y2hWaXNpYmlsaXR5KGlzTGl2ZSwgaGFzVGltZVNoaWZ0KTtcbiAgICB9KTtcbiAgICBsZXQgdGltZVNoaWZ0RGV0ZWN0b3IgPSBuZXcgUGxheWVyVXRpbHMuVGltZVNoaWZ0QXZhaWxhYmlsaXR5RGV0ZWN0b3IocGxheWVyKTtcbiAgICB0aW1lU2hpZnREZXRlY3Rvci5vblRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWQuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3M6IFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzKSA9PiB7XG4gICAgICAgIGhhc1RpbWVTaGlmdCA9IGFyZ3MudGltZVNoaWZ0QXZhaWxhYmxlO1xuICAgICAgICBzd2l0Y2hWaXNpYmlsaXR5KGlzTGl2ZSwgaGFzVGltZVNoaWZ0KTtcbiAgICAgIH1cbiAgICApO1xuICAgIC8vIEluaXRpYWwgZGV0ZWN0aW9uXG4gICAgbGl2ZVN0cmVhbURldGVjdG9yLmRldGVjdCgpO1xuICAgIHRpbWVTaGlmdERldGVjdG9yLmRldGVjdCgpO1xuXG4gICAgLy8gUmVmcmVzaCB0aGUgcGxheWJhY2sgcG9zaXRpb24gd2hlbiB0aGUgcGxheWVyIHJlc2l6ZWQgb3IgdGhlIFVJIGlzIGNvbmZpZ3VyZWQuIFRoZSBwbGF5YmFjayBwb3NpdGlvbiBtYXJrZXJcbiAgICAvLyBpcyBwb3NpdGlvbmVkIGFic29sdXRlbHkgYW5kIG11c3QgdGhlcmVmb3JlIGJlIHVwZGF0ZWQgd2hlbiB0aGUgc2l6ZSBvZiB0aGUgc2Vla2JhciBjaGFuZ2VzLlxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsICgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICAvLyBBZGRpdGlvbmFsbHksIHdoZW4gdGhpcyBjb2RlIGlzIGNhbGxlZCwgdGhlIHNlZWtiYXIgaXMgbm90IHBhcnQgb2YgdGhlIFVJIHlldCBhbmQgdGhlcmVmb3JlIGRvZXMgbm90IGhhdmUgYSBzaXplLFxuICAgIC8vIHJlc3VsdGluZyBpbiBhIHdyb25nIGluaXRpYWwgcG9zaXRpb24gb2YgdGhlIG1hcmtlci4gUmVmcmVzaGluZyBpdCBvbmNlIHRoZSBVSSBpcyBjb25maWd1cmVkIHNvbHZlZCB0aGlzIGlzc3VlLlxuICAgIHVpbWFuYWdlci5vbkNvbmZpZ3VyZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICAvLyBJdCBjYW4gYWxzbyBoYXBwZW4gdGhhdCB0aGUgdmFsdWUgY2hhbmdlcyBvbmNlIHRoZSBwbGF5ZXIgaXMgcmVhZHksIG9yIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZCwgc28gd2UgbmVlZFxuICAgIC8vIHRvIHVwZGF0ZSBvbiBPTl9SRUFEWSB0b29cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzZWVrYmFyXG4gICAgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIoKTsgLy8gU2V0IHRoZSBwbGF5YmFjayBwb3NpdGlvblxuICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24oMCk7XG4gICAgdGhpcy5zZXRTZWVrUG9zaXRpb24oMCk7XG4gICAgaWYgKHRoaXMuY29uZmlnLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zICE9PSBTZWVrQmFyLlNNT09USF9QTEFZQkFDS19QT1NJVElPTl9VUERBVEVfRElTQUJMRUQpIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIocGxheWVyLCB1aW1hbmFnZXIpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ3VyZU1hcmtlcnMocGxheWVyLCB1aW1hbmFnZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcihwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIC8qXG4gICAgICogUGxheWJhY2sgcG9zaXRpb24gdXBkYXRlXG4gICAgICpcbiAgICAgKiBXZSBkbyBub3QgdXBkYXRlIHRoZSBwb3NpdGlvbiBkaXJlY3RseSBmcm9tIHRoZSBPTl9USU1FX0NIQU5HRUQgZXZlbnQsIGJlY2F1c2UgaXQgYXJyaXZlcyB2ZXJ5IGppdHRlcnkgYW5kXG4gICAgICogcmVzdWx0cyBpbiBhIGppdHRlcnkgcG9zaXRpb24gaW5kaWNhdG9yIHNpbmNlIHRoZSBDU1MgdHJhbnNpdGlvbiB0aW1lIGlzIHN0YXRpY2FsbHkgc2V0LlxuICAgICAqIFRvIHdvcmsgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIG1haW50YWluIGEgbG9jYWwgcGxheWJhY2sgcG9zaXRpb24gdGhhdCBpcyB1cGRhdGVkIGluIGEgc3RhYmxlIHJlZ3VsYXIgaW50ZXJ2YWxcbiAgICAgKiBhbmQga2VwdCBpbiBzeW5jIHdpdGggdGhlIHBsYXllci5cbiAgICAgKi9cbiAgICBsZXQgY3VycmVudFRpbWVTZWVrQmFyID0gMDtcbiAgICBsZXQgY3VycmVudFRpbWVQbGF5ZXIgPSAwO1xuICAgIGxldCB1cGRhdGVJbnRlcnZhbE1zID0gNTA7XG4gICAgbGV0IGN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzID0gdXBkYXRlSW50ZXJ2YWxNcyAvIDEwMDA7XG5cbiAgICB0aGlzLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyID0gbmV3IFRpbWVvdXQodXBkYXRlSW50ZXJ2YWxNcywgKCkgPT4ge1xuICAgICAgY3VycmVudFRpbWVTZWVrQmFyICs9IGN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzO1xuICAgICAgY3VycmVudFRpbWVQbGF5ZXIgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcblxuICAgICAgLy8gU3luYyBjdXJyZW50VGltZSBvZiBzZWVrYmFyIHRvIHBsYXllclxuICAgICAgbGV0IGN1cnJlbnRUaW1lRGVsdGEgPSBjdXJyZW50VGltZVNlZWtCYXIgLSBjdXJyZW50VGltZVBsYXllcjtcbiAgICAgIC8vIElmIHRoZSBkZWx0YSBpcyBsYXJnZXIgdGhhdCAyIHNlY3MsIGRpcmVjdGx5IGp1bXAgdGhlIHNlZWtiYXIgdG8gdGhlXG4gICAgICAvLyBwbGF5ZXIgdGltZSBpbnN0ZWFkIG9mIHNtb290aGx5IGZhc3QgZm9yd2FyZGluZy9yZXdpbmRpbmcuXG4gICAgICBpZiAoTWF0aC5hYnMoY3VycmVudFRpbWVEZWx0YSkgPiAyKSB7XG4gICAgICAgIGN1cnJlbnRUaW1lU2Vla0JhciA9IGN1cnJlbnRUaW1lUGxheWVyO1xuICAgICAgfVxuICAgICAgLy8gSWYgY3VycmVudFRpbWVEZWx0YSBpcyBuZWdhdGl2ZSBhbmQgYmVsb3cgdGhlIGFkanVzdG1lbnQgdGhyZXNob2xkLFxuICAgICAgLy8gdGhlIHBsYXllciBpcyBhaGVhZCBvZiB0aGUgc2Vla2JhciBhbmQgd2UgJ2Zhc3QgZm9yd2FyZCcgdGhlIHNlZWtiYXJcbiAgICAgIGVsc2UgaWYgKGN1cnJlbnRUaW1lRGVsdGEgPD0gLWN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzKSB7XG4gICAgICAgIGN1cnJlbnRUaW1lU2Vla0JhciArPSBjdXJyZW50VGltZVVwZGF0ZURlbHRhU2VjcztcbiAgICAgIH1cbiAgICAgIC8vIElmIGN1cnJlbnRUaW1lRGVsdGEgaXMgcG9zaXRpdmUgYW5kIGFib3ZlIHRoZSBhZGp1c3RtZW50IHRocmVzaG9sZCxcbiAgICAgIC8vIHRoZSBwbGF5ZXIgaXMgYmVoaW5kIHRoZSBzZWVrYmFyIGFuZCB3ZSAncmV3aW5kJyB0aGUgc2Vla2JhclxuICAgICAgZWxzZSBpZiAoY3VycmVudFRpbWVEZWx0YSA+PSBjdXJyZW50VGltZVVwZGF0ZURlbHRhU2Vjcykge1xuICAgICAgICBjdXJyZW50VGltZVNlZWtCYXIgLT0gY3VycmVudFRpbWVVcGRhdGVEZWx0YVNlY3M7XG4gICAgICB9XG5cbiAgICAgIGxldCBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDEwMCAvIHBsYXllci5nZXREdXJhdGlvbigpICogY3VycmVudFRpbWVTZWVrQmFyO1xuICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIGxldCBzdGFydFNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyID0gKCkgPT4ge1xuICAgICAgaWYgKCFwbGF5ZXIuaXNMaXZlKCkpIHtcbiAgICAgICAgY3VycmVudFRpbWVTZWVrQmFyID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuY2xlYXIoKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgc3RhcnRTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9QTEFZSU5HLCBzdGFydFNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QQVVTRUQsIHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9QQVVTRUQsIHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCAoKSA9PiB7XG4gICAgICBjdXJyZW50VGltZVNlZWtCYXIgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgIHN0YXJ0U21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZU1hcmtlcnMocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgY2xlYXJNYXJrZXJzID0gKCkgPT4ge1xuICAgICAgdGhpcy50aW1lbGluZU1hcmtlcnMgPSBbXTtcbiAgICAgIHRoaXMudXBkYXRlTWFya2VycygpO1xuICAgIH07XG5cbiAgICBsZXQgc2V0dXBNYXJrZXJzID0gKCkgPT4ge1xuICAgICAgY2xlYXJNYXJrZXJzKCk7XG5cbiAgICAgIGxldCBoYXNNYXJrZXJzSW5VaUNvbmZpZyA9IHVpbWFuYWdlci5nZXRDb25maWcoKS5tZXRhZGF0YSAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2Vyc1xuICAgICAgICAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2Vycy5sZW5ndGggPiAwO1xuICAgICAgbGV0IGhhc01hcmtlcnNJblBsYXllckNvbmZpZyA9IHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UgJiYgcGxheWVyLmdldENvbmZpZygpLnNvdXJjZS5tYXJrZXJzXG4gICAgICAgICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UubWFya2Vycy5sZW5ndGggPiAwO1xuXG4gICAgICAvLyBUYWtlIG1hcmtlcnMgZnJvbSB0aGUgVUkgY29uZmlnLiBJZiBubyBtYXJrZXJzIGRlZmluZWQsIHRyeSB0byB0YWtlIHRoZW0gZnJvbSB0aGUgcGxheWVyJ3Mgc291cmNlIGNvbmZpZy5cbiAgICAgIGxldCBtYXJrZXJzID0gaGFzTWFya2Vyc0luVWlDb25maWcgPyB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2VycyA6XG4gICAgICAgIGhhc01hcmtlcnNJblBsYXllckNvbmZpZyA/IHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UubWFya2VycyA6IG51bGw7XG5cbiAgICAgIC8vIEdlbmVyYXRlIHRpbWVsaW5lIG1hcmtlcnMgZnJvbSB0aGUgY29uZmlnIGlmIHdlIGhhdmUgbWFya2VycyBhbmQgaWYgd2UgaGF2ZSBhIGR1cmF0aW9uXG4gICAgICAvLyBUaGUgZHVyYXRpb24gY2hlY2sgaXMgZm9yIGJ1Z2d5IHBsYXRmb3JtcyB3aGVyZSB0aGUgZHVyYXRpb24gaXMgbm90IGF2YWlsYWJsZSBpbnN0YW50bHkgKENocm9tZSBvbiBBbmRyb2lkIDQuMylcbiAgICAgIGlmIChtYXJrZXJzICYmIHBsYXllci5nZXREdXJhdGlvbigpICE9PSBJbmZpbml0eSkge1xuICAgICAgICBsZXQgZHVyYXRpb24gPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKVxuICAgICAgICBmb3IgKGxldCBvIG9mIG1hcmtlcnMpIHtcbiAgICAgICAgICBsZXQgbWFya2VyID0ge1xuICAgICAgICAgICAgdGltZTogby50aW1lLFxuICAgICAgICAgICAgdGltZVBlcmNlbnRhZ2U6IDEwMCAvIGR1cmF0aW9uICogby50aW1lLCAvLyBjb252ZXJ0IHRpbWUgdG8gcGVyY2VudGFnZVxuICAgICAgICAgICAgdGl0bGU6IG8udGl0bGUsXG4gICAgICAgICAgICBtYXJrZXJUeXBlOiBvLm1hcmtlclR5cGUgfHwgJ2RlZmF1bHQnLFxuICAgICAgICAgICAgY29tbWVudDogby5jb21tZW50IHx8ICcnLFxuICAgICAgICAgICAgYXZhdGFyOiBvLmF2YXRhcixcbiAgICAgICAgICAgIG51bWJlcjogby5udW1iZXIgfHwgJydcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50aW1lbGluZU1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHRpbWVsaW5lIHdpdGggdGhlIG1hcmtlcnNcbiAgICAgIHRoaXMudXBkYXRlTWFya2VycygpO1xuICAgIH07XG5cbiAgICAvLyBBZGQgbWFya2VycyB3aGVuIGEgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBzZXR1cE1hcmtlcnMpO1xuICAgIC8vIFJlbW92ZSBtYXJrZXJzIHdoZW4gdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIGNsZWFyTWFya2Vycyk7XG5cbiAgICAvLyBJbml0IG1hcmtlcnMgYXQgc3RhcnR1cFxuICAgIHNldHVwTWFya2VycygpO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBzdXBlci5yZWxlYXNlKCk7XG5cbiAgICBpZiAodGhpcy5zbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcikgeyAvLyBvYmplY3QgbXVzdCBub3QgbmVjZXNzYXJpbHkgZXhpc3QsIGUuZy4gaW4gdm9sdW1lIHNsaWRlciBzdWJjbGFzc1xuICAgICAgdGhpcy5zbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlci5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBpZiAodGhpcy5jb25maWcudmVydGljYWwpIHtcbiAgICAgIHRoaXMuY29uZmlnLmNzc0NsYXNzZXMucHVzaCgndmVydGljYWwnKTtcbiAgICB9XG5cbiAgICBsZXQgc2Vla0JhckNvbnRhaW5lciA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdpZCc6IHRoaXMuY29uZmlnLmlkLFxuICAgICAgJ2NsYXNzJzogdGhpcy5nZXRDc3NDbGFzc2VzKClcbiAgICB9KTtcblxuICAgIGxldCBzZWVrQmFyID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXInKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhciA9IHNlZWtCYXI7XG5cbiAgICAvLyBJbmRpY2F0b3IgdGhhdCBzaG93cyB0aGUgYnVmZmVyIGZpbGwgbGV2ZWxcbiAgICBsZXQgc2Vla0JhckJ1ZmZlckxldmVsID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItYnVmZmVybGV2ZWwnKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhckJ1ZmZlclBvc2l0aW9uID0gc2Vla0JhckJ1ZmZlckxldmVsO1xuXG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgc2hvd3MgdGhlIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb25cbiAgICBsZXQgc2Vla0JhclBsYXliYWNrUG9zaXRpb24gPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1wbGF5YmFja3Bvc2l0aW9uJylcbiAgICB9KTtcbiAgICB0aGlzLnNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uID0gc2Vla0JhclBsYXliYWNrUG9zaXRpb247XG5cbiAgICAvLyBBIG1hcmtlciBvZiB0aGUgY3VycmVudCBwbGF5YmFjayBwb3NpdGlvbiwgZS5nLiBhIGRvdCBvciBsaW5lXG4gICAgbGV0IHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItcGxheWJhY2twb3NpdGlvbi1tYXJrZXInKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhclBsYXliYWNrUG9zaXRpb25NYXJrZXIgPSBzZWVrQmFyUGxheWJhY2tQb3NpdGlvbk1hcmtlcjtcblxuICAgIC8vIEluZGljYXRvciB0aGF0IHNob3cgd2hlcmUgYSBzZWVrIHdpbGwgZ28gdG9cbiAgICBsZXQgc2Vla0JhclNlZWtQb3NpdGlvbiA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLXNlZWtwb3NpdGlvbicpXG4gICAgfSk7XG4gICAgdGhpcy5zZWVrQmFyU2Vla1Bvc2l0aW9uID0gc2Vla0JhclNlZWtQb3NpdGlvbjtcblxuICAgIC8vIEluZGljYXRvciB0aGF0IHNob3dzIHRoZSBmdWxsIHNlZWtiYXJcbiAgICBsZXQgc2Vla0JhckJhY2tkcm9wID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItYmFja2Ryb3AnKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhckJhY2tkcm9wID0gc2Vla0JhckJhY2tkcm9wO1xuXG4gICAgbGV0IHNlZWtCYXJDaGFwdGVyTWFya2Vyc0NvbnRhaW5lciA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLW1hcmtlcnMnKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0Jhck1hcmtlcnNDb250YWluZXIgPSBzZWVrQmFyQ2hhcHRlck1hcmtlcnNDb250YWluZXI7XG5cbiAgICBzZWVrQmFyLmFwcGVuZChzZWVrQmFyQmFja2Ryb3AsIHNlZWtCYXJCdWZmZXJMZXZlbCwgc2Vla0JhclNlZWtQb3NpdGlvbixcbiAgICAgIHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uLCBzZWVrQmFyQ2hhcHRlck1hcmtlcnNDb250YWluZXIsIHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyKTtcblxuICAgIGxldCBzZWVraW5nID0gZmFsc2U7XG5cbiAgICAvLyBEZWZpbmUgaGFuZGxlciBmdW5jdGlvbnMgc28gd2UgY2FuIGF0dGFjaC9yZW1vdmUgdGhlbSBsYXRlclxuICAgIGxldCBtb3VzZVRvdWNoTW92ZUhhbmRsZXIgPSAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW9uIHRvIFZSIGhhbmRsZXJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGxldCB0YXJnZXRQZXJjZW50YWdlID0gMTAwICogdGhpcy5nZXRPZmZzZXQoZSk7XG4gICAgICBzZWVrQmFyLmRpc3BhdGNoU21hc2hjdXRQbGF5ZXJVaUV2ZW50KHtcbiAgICAgICAgYWN0aW9uOiAnc2Vla2luZy1jaGFuZ2UnLFxuICAgICAgICBlLFxuICAgICAgICBwb3NpdGlvbjogdGFyZ2V0UGVyY2VudGFnZSxcbiAgICAgICAgb3JpZ2luYXRvcjogJ1NlZWtCYXInXG4gICAgICB9KVxuICAgICAgdGhpcy5zZXRTZWVrUG9zaXRpb24odGFyZ2V0UGVyY2VudGFnZSk7XG4gICAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24odGFyZ2V0UGVyY2VudGFnZSk7XG4gICAgICB0aGlzLm9uU2Vla1ByZXZpZXdFdmVudCh0YXJnZXRQZXJjZW50YWdlLCB0cnVlKTtcbiAgICB9O1xuICAgIGxldCBtb3VzZVRvdWNoVXBIYW5kbGVyID0gKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIC8vIFJlbW92ZSBoYW5kbGVycywgc2VlayBvcGVyYXRpb24gaXMgZmluaXNoZWRcbiAgICAgIG5ldyBET00oZG9jdW1lbnQpLm9mZigndG91Y2htb3ZlIG1vdXNlbW92ZScsIG1vdXNlVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICBuZXcgRE9NKGRvY3VtZW50KS5vZmYoJ3RvdWNoZW5kIG1vdXNldXAnLCBtb3VzZVRvdWNoVXBIYW5kbGVyKTtcblxuICAgICAgbGV0IHRhcmdldFBlcmNlbnRhZ2UgPSAxMDAgKiB0aGlzLmdldE9mZnNldChlKTtcbiAgICAgIGxldCBzbmFwcGVkQ2hhcHRlciA9IHRoaXMuZ2V0TWFya2VyQXRQb3NpdGlvbih0YXJnZXRQZXJjZW50YWdlKTtcblxuICAgICAgc2Vla0Jhci5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7XG4gICAgICAgIGFjdGlvbjogJ3NlZWtpbmctZW5kJyxcbiAgICAgICAgZSxcbiAgICAgICAgcG9zaXRpb246IHRhcmdldFBlcmNlbnRhZ2UsXG4gICAgICAgIG9yaWdpbmF0b3I6ICdTZWVrQmFyJ1xuICAgICAgfSlcblxuICAgICAgdGhpcy5zZXRTZWVraW5nKGZhbHNlKTtcbiAgICAgIHNlZWtpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gRmlyZSBzZWVrZWQgZXZlbnRcbiAgICAgIHRoaXMub25TZWVrZWRFdmVudChzbmFwcGVkQ2hhcHRlciA/IHNuYXBwZWRDaGFwdGVyLnRpbWVQZXJjZW50YWdlIDogdGFyZ2V0UGVyY2VudGFnZSk7XG4gICAgfTtcblxuICAgIC8vIEEgc2VlayBhbHdheXMgc3RhcnQgd2l0aCBhIHRvdWNoc3RhcnQgb3IgbW91c2Vkb3duIGRpcmVjdGx5IG9uIHRoZSBzZWVrYmFyLlxuICAgIC8vIFRvIHRyYWNrIGEgbW91c2Ugc2VlayBhbHNvIG91dHNpZGUgdGhlIHNlZWtiYXIgKGZvciB0b3VjaCBldmVudHMgdGhpcyB3b3JrcyBhdXRvbWF0aWNhbGx5KSxcbiAgICAvLyBzbyB0aGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIHRha2UgY2FyZSB0aGF0IHRoZSBtb3VzZSBhbHdheXMgc3RheXMgb24gdGhlIHNlZWtiYXIsIHdlIGF0dGFjaCB0aGUgbW91c2Vtb3ZlXG4gICAgLy8gYW5kIG1vdXNldXAgaGFuZGxlcnMgdG8gdGhlIHdob2xlIGRvY3VtZW50LiBBIHNlZWsgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgbGlmdHMgdGhlIG1vdXNlIGtleS5cbiAgICAvLyBBIHNlZWsgbW91c2UgZ2VzdHVyZSBpcyB0aHVzIGJhc2ljYWxseSBhIGNsaWNrIHdpdGggYSBsb25nIHRpbWUgZnJhbWUgYmV0d2VlbiBkb3duIGFuZCB1cCBldmVudHMuXG4gICAgc2Vla0Jhci5vbigndG91Y2hzdGFydCBtb3VzZWRvd24nLCAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCBpc1RvdWNoRXZlbnQgPSB0aGlzLnRvdWNoU3VwcG9ydGVkICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50O1xuXG4gICAgICAvLyBQcmV2ZW50IHNlbGVjdGlvbiBvZiBET00gZWxlbWVudHMgKGFsc28gcHJldmVudHMgbW91c2Vkb3duIGlmIGN1cnJlbnQgZXZlbnQgaXMgdG91Y2hzdGFydClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW9uIHRvIFZSIGhhbmRsZXJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHNlZWtCYXIuZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoe2FjdGlvbjogJ3NlZWtpbmctc3RhcnQnLCBlLCBvcmlnaW5hdG9yOiAnU2Vla0Jhcid9KVxuXG4gICAgICB0aGlzLnNldFNlZWtpbmcodHJ1ZSk7IC8vIFNldCBzZWVraW5nIGNsYXNzIG9uIERPTSBlbGVtZW50XG4gICAgICBzZWVraW5nID0gdHJ1ZTsgLy8gU2V0IHNlZWsgdHJhY2tpbmcgZmxhZ1xuXG4gICAgICAvLyBGaXJlIHNlZWtlZCBldmVudFxuICAgICAgdGhpcy5vblNlZWtFdmVudCgpO1xuXG4gICAgICAvLyBBZGQgaGFuZGxlciB0byB0cmFjayB0aGUgc2VlayBvcGVyYXRpb24gb3ZlciB0aGUgd2hvbGUgZG9jdW1lbnRcbiAgICAgIG5ldyBET00oZG9jdW1lbnQpLm9uKGlzVG91Y2hFdmVudCA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZScsIG1vdXNlVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICBuZXcgRE9NKGRvY3VtZW50KS5vbihpc1RvdWNoRXZlbnQgPyAndG91Y2hlbmQnIDogJ21vdXNldXAnLCBtb3VzZVRvdWNoVXBIYW5kbGVyKTtcbiAgICB9KTtcblxuICAgIC8vIERpc3BsYXkgc2VlayB0YXJnZXQgaW5kaWNhdG9yIHdoZW4gbW91c2UgaG92ZXJzIG9yIGZpbmdlciBzbGlkZXMgb3ZlciBzZWVrYmFyXG4gICAgc2Vla0Jhci5vbigndG91Y2htb3ZlIG1vdXNlbW92ZScsIChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoc2Vla2luZykge1xuICAgICAgICAvLyBEdXJpbmcgYSBzZWVrICh3aGVuIG1vdXNlIGlzIGRvd24gb3IgdG91Y2ggbW92ZSBhY3RpdmUpLCB3ZSBuZWVkIHRvIHN0b3AgcHJvcGFnYXRpb24gdG8gYXZvaWRcbiAgICAgICAgLy8gdGhlIFZSIHZpZXdwb3J0IHJlYWN0aW5nIHRvIHRoZSBtb3Zlcy5cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQmVjYXVzZSB0aGUgc3RvcHBlZCBwcm9wYWdhdGlvbiBpbmhpYml0cyB0aGUgZXZlbnQgb24gdGhlIGRvY3VtZW50LCB3ZSBuZWVkIHRvIGNhbGwgaXQgZnJvbSBoZXJlXG4gICAgICAgIG1vdXNlVG91Y2hNb3ZlSGFuZGxlcihlKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHBvc2l0aW9uID0gMTAwICogdGhpcy5nZXRPZmZzZXQoZSk7XG4gICAgICB0aGlzLnNldFNlZWtQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICB0aGlzLm9uU2Vla1ByZXZpZXdFdmVudChwb3NpdGlvbiwgZmFsc2UpO1xuXG4gICAgICBpZiAodGhpcy5oYXNMYWJlbCgpICYmIHRoaXMuZ2V0TGFiZWwoKS5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMuZ2V0TGFiZWwoKS5zaG93KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBIaWRlIHNlZWsgdGFyZ2V0IGluZGljYXRvciB3aGVuIG1vdXNlIG9yIGZpbmdlciBsZWF2ZXMgc2Vla2JhclxuICAgIHNlZWtCYXIub24oJ3RvdWNoZW5kIG1vdXNlbGVhdmUnLCAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5zZXRTZWVrUG9zaXRpb24oMCk7XG5cbiAgICAgIGlmICh0aGlzLmhhc0xhYmVsKCkpIHtcbiAgICAgICAgdGhpcy5nZXRMYWJlbCgpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlZWtCYXJDb250YWluZXIuYXBwZW5kKHNlZWtCYXIpO1xuXG4gICAgaWYgKHRoaXMubGFiZWwpIHtcbiAgICAgIHNlZWtCYXJDb250YWluZXIuYXBwZW5kKHRoaXMubGFiZWwuZ2V0RG9tRWxlbWVudCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2Vla0JhckNvbnRhaW5lcjtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVNYXJrZXJzKCk6IHZvaWQge1xuICAgIHRoaXMuc2Vla0Jhck1hcmtlcnNDb250YWluZXIuZW1wdHkoKTtcblxuICAgIGlmICghdGhpcy5fY29tbWVudHNPbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IG1hcmtlciBvZiB0aGlzLnRpbWVsaW5lTWFya2Vycykge1xuICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLW1hcmtlci10eXBlLScgKyBtYXJrZXIubWFya2VyVHlwZSk7XG5cbiAgICAgIGxldCBtYXJrZXJEb20gPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAgICdjbGFzcyc6IGNsYXNzTmFtZSxcbiAgICAgICAgJ2RhdGEtbWFya2VyLXRpbWUnOiBTdHJpbmcobWFya2VyLnRpbWUpLFxuICAgICAgICAnZGF0YS1tYXJrZXItdGl0bGUnOiBTdHJpbmcobWFya2VyLnRpdGxlKSxcbiAgICAgIH0pLmNzcyh7XG4gICAgICAgICdsZWZ0JzogbWFya2VyLnRpbWVQZXJjZW50YWdlICsgJyUnLFxuICAgICAgfSlcbiAgICAgIHRoaXMuc2Vla0Jhck1hcmtlcnNDb250YWluZXIuYXBwZW5kKG1hcmtlckRvbSlcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TWFya2VyQXRQb3NpdGlvbihwZXJjZW50YWdlOiBudW1iZXIpOiBUaW1lbGluZU1hcmtlciB8IG51bGwge1xuICAgIGxldCBzbmFwcGVkTWFya2VyOiBUaW1lbGluZU1hcmtlciA9IG51bGw7XG4gICAgbGV0IHNuYXBwaW5nUmFuZ2UgPSAxO1xuICAgIGlmICh0aGlzLnRpbWVsaW5lTWFya2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBtYXJrZXIgb2YgdGhpcy50aW1lbGluZU1hcmtlcnMpIHtcbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPj0gbWFya2VyLnRpbWVQZXJjZW50YWdlIC0gc25hcHBpbmdSYW5nZSAmJiBwZXJjZW50YWdlIDw9IG1hcmtlci50aW1lUGVyY2VudGFnZSArIHNuYXBwaW5nUmFuZ2UpIHtcbiAgICAgICAgICBzbmFwcGVkTWFya2VyID0gbWFya2VyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNuYXBwZWRNYXJrZXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaG9yaXpvbnRhbCBvZmZzZXQgb2YgYSBtb3VzZS90b3VjaCBldmVudCBwb2ludCBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIHNlZWsgYmFyLlxuICAgKiBAcGFyYW0gZXZlbnRQYWdlWCB0aGUgcGFnZVggY29vcmRpbmF0ZSBvZiBhbiBldmVudCB0byBjYWxjdWxhdGUgdGhlIG9mZnNldCBmcm9tXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGEgbnVtYmVyIGluIHRoZSByYW5nZSBvZiBbMCwgMV0sIHdoZXJlIDAgaXMgdGhlIGxlZnQgZWRnZSBhbmQgMSBpcyB0aGUgcmlnaHQgZWRnZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRIb3Jpem9udGFsT2Zmc2V0KGV2ZW50UGFnZVg6IG51bWJlcik6IG51bWJlciB7XG4gICAgbGV0IGVsZW1lbnRPZmZzZXRQeCA9IHRoaXMuc2Vla0Jhci5vZmZzZXQoKS5sZWZ0O1xuICAgIGxldCB3aWR0aFB4ID0gdGhpcy5zZWVrQmFyLndpZHRoKCk7XG4gICAgbGV0IG9mZnNldFB4ID0gZXZlbnRQYWdlWCAtIGVsZW1lbnRPZmZzZXRQeDtcbiAgICBsZXQgb2Zmc2V0ID0gMSAvIHdpZHRoUHggKiBvZmZzZXRQeDtcblxuICAgIHJldHVybiB0aGlzLnNhbml0aXplT2Zmc2V0KG9mZnNldCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmVydGljYWwgb2Zmc2V0IG9mIGEgbW91c2UvdG91Y2ggZXZlbnQgcG9pbnQgZnJvbSB0aGUgYm90dG9tIGVkZ2Ugb2YgdGhlIHNlZWsgYmFyLlxuICAgKiBAcGFyYW0gZXZlbnRQYWdlWSB0aGUgcGFnZVggY29vcmRpbmF0ZSBvZiBhbiBldmVudCB0byBjYWxjdWxhdGUgdGhlIG9mZnNldCBmcm9tXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGEgbnVtYmVyIGluIHRoZSByYW5nZSBvZiBbMCwgMV0sIHdoZXJlIDAgaXMgdGhlIGJvdHRvbSBlZGdlIGFuZCAxIGlzIHRoZSB0b3AgZWRnZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRWZXJ0aWNhbE9mZnNldChldmVudFBhZ2VZOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGxldCBlbGVtZW50T2Zmc2V0UHggPSB0aGlzLnNlZWtCYXIub2Zmc2V0KCkudG9wO1xuICAgIGxldCB3aWR0aFB4ID0gdGhpcy5zZWVrQmFyLmhlaWdodCgpO1xuICAgIGxldCBvZmZzZXRQeCA9IGV2ZW50UGFnZVkgLSBlbGVtZW50T2Zmc2V0UHg7XG4gICAgbGV0IG9mZnNldCA9IDEgLyB3aWR0aFB4ICogb2Zmc2V0UHg7XG5cbiAgICByZXR1cm4gMSAtIHRoaXMuc2FuaXRpemVPZmZzZXQob2Zmc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtb3VzZSBvciB0b3VjaCBldmVudCBvZmZzZXQgZm9yIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gKGhvcml6b250YWwgb3IgdmVydGljYWwpLlxuICAgKiBAcGFyYW0gZSB0aGUgZXZlbnQgdG8gY2FsY3VsYXRlIHRoZSBvZmZzZXQgZnJvbVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBhIG51bWJlciBpbiB0aGUgcmFuZ2Ugb2YgWzAsIDFdXG4gICAqIEBzZWUgI2dldEhvcml6b250YWxPZmZzZXRcbiAgICogQHNlZSAjZ2V0VmVydGljYWxPZmZzZXRcbiAgICovXG4gIHByaXZhdGUgZ2V0T2Zmc2V0KGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy50b3VjaFN1cHBvcnRlZCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnZlcnRpY2FsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZlcnRpY2FsT2Zmc2V0KGUudHlwZSA9PT0gJ3RvdWNoZW5kJyA/IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVkgOiBlLnRvdWNoZXNbMF0ucGFnZVkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SG9yaXpvbnRhbE9mZnNldChlLnR5cGUgPT09ICd0b3VjaGVuZCcgPyBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIDogZS50b3VjaGVzWzBdLnBhZ2VYKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLmNvbmZpZy52ZXJ0aWNhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWZXJ0aWNhbE9mZnNldChlLnBhZ2VZKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhvcml6b250YWxPZmZzZXQoZS5wYWdlWCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdpbnZhbGlkIGV2ZW50Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemVzIHRoZSBtb3VzZSBvZmZzZXQgdG8gdGhlIHJhbmdlIG9mIFswLCAxXS5cbiAgICpcbiAgICogV2hlbiB0cmFja2luZyB0aGUgbW91c2Ugb3V0c2lkZSB0aGUgc2VlayBiYXIsIHRoZSBvZmZzZXQgY2FuIGJlIG91dHNpZGUgdGhlIGRlc2lyZWQgcmFuZ2UgYW5kIHRoaXMgbWV0aG9kXG4gICAqIGxpbWl0cyBpdCB0byB0aGUgZGVzaXJlZCByYW5nZS4gRS5nLiBhIG1vdXNlIGV2ZW50IGxlZnQgb2YgdGhlIGxlZnQgZWRnZSBvZiBhIHNlZWsgYmFyIHlpZWxkcyBhbiBvZmZzZXQgYmVsb3dcbiAgICogemVybywgYnV0IHRvIGRpc3BsYXkgdGhlIHNlZWsgdGFyZ2V0IG9uIHRoZSBzZWVrIGJhciwgd2UgbmVlZCB0byBsaW1pdCBpdCB0byB6ZXJvLlxuICAgKlxuICAgKiBAcGFyYW0gb2Zmc2V0IHRoZSBvZmZzZXQgdG8gc2FuaXRpemVcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIHNhbml0aXplZCBvZmZzZXQuXG4gICAqL1xuICBwcml2YXRlIHNhbml0aXplT2Zmc2V0KG9mZnNldDogbnVtYmVyKSB7XG4gICAgLy8gU2luY2Ugd2UgdHJhY2sgbW91c2UgbW92ZXMgb3ZlciB0aGUgd2hvbGUgZG9jdW1lbnQsIHRoZSB0YXJnZXQgY2FuIGJlIG91dHNpZGUgdGhlIHNlZWsgcmFuZ2UsXG4gICAgLy8gYW5kIHdlIG5lZWQgdG8gbGltaXQgaXQgdG8gdGhlIFswLCAxXSByYW5nZS5cbiAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgb2Zmc2V0ID0gMDtcbiAgICB9IGVsc2UgaWYgKG9mZnNldCA+IDEpIHtcbiAgICAgIG9mZnNldCA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcGxheWJhY2sgcG9zaXRpb24gaW5kaWNhdG9yLlxuICAgKiBAcGFyYW0gcGVyY2VudCBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEwMCBhcyByZXR1cm5lZCBieSB0aGUgcGxheWVyXG4gICAqL1xuICBzZXRQbGF5YmFja1Bvc2l0aW9uKHBlcmNlbnQ6IG51bWJlcikge1xuICAgIHRoaXMucGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgPSBwZXJjZW50O1xuXG4gICAgLy8gU2V0IHBvc2l0aW9uIG9mIHRoZSBiYXJcbiAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc2Vla0JhclBsYXliYWNrUG9zaXRpb24sIHBlcmNlbnQpO1xuXG4gICAgLy8gU2V0IHBvc2l0aW9uIG9mIHRoZSBtYXJrZXJcbiAgICBsZXQgcHggPSAodGhpcy5jb25maWcudmVydGljYWwgPyB0aGlzLnNlZWtCYXIuaGVpZ2h0KCkgOiB0aGlzLnNlZWtCYXIud2lkdGgoKSkgLyAxMDAgKiBwZXJjZW50O1xuICAgIGlmICh0aGlzLmNvbmZpZy52ZXJ0aWNhbCkge1xuICAgICAgcHggPSB0aGlzLnNlZWtCYXIuaGVpZ2h0KCkgLSBweDtcbiAgICB9XG4gICAgbGV0IHN0eWxlID0gdGhpcy5jb25maWcudmVydGljYWwgP1xuICAgICAgLy8gLW1zLXRyYW5zZm9ybSByZXF1aXJlZCBmb3IgSUU5XG4gICAgICB7J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKCcgKyBweCArICdweCknLCAnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKCcgKyBweCArICdweCknfSA6XG4gICAgICB7J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcgKyBweCArICdweCknLCAnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcgKyBweCArICdweCknfTtcbiAgICB0aGlzLnNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyLmNzcyhzdHlsZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVmcmVzaGVzIHRoZSBwbGF5YmFjayBwb3NpdGlvbi4gQ2FuIGJlIHVzZWQgYnkgc3ViY2xhc3NlcyB0byByZWZyZXNoIHRoZSBwb3NpdGlvbiB3aGVuXG4gICAqIHRoZSBzaXplIG9mIHRoZSBjb21wb25lbnQgY2hhbmdlcy5cbiAgICovXG4gIHByb3RlY3RlZCByZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpIHtcbiAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24odGhpcy5wbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcG9zaXRpb24gdW50aWwgd2hpY2ggbWVkaWEgaXMgYnVmZmVyZWQuXG4gICAqIEBwYXJhbSBwZXJjZW50IGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMTAwXG4gICAqL1xuICBzZXRCdWZmZXJQb3NpdGlvbihwZXJjZW50OiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc2Vla0JhckJ1ZmZlclBvc2l0aW9uLCBwZXJjZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwb3NpdGlvbiB3aGVyZSBhIHNlZWssIGlmIGV4ZWN1dGVkLCB3b3VsZCBqdW1wIHRvLlxuICAgKiBAcGFyYW0gcGVyY2VudCBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEwMFxuICAgKi9cbiAgc2V0U2Vla1Bvc2l0aW9uKHBlcmNlbnQ6IG51bWJlcikge1xuICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5zZWVrQmFyU2Vla1Bvc2l0aW9uLCBwZXJjZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGFjdHVhbCBwb3NpdGlvbiAod2lkdGggb3IgaGVpZ2h0KSBvZiBhIERPTSBlbGVtZW50IHRoYXQgcmVwcmVzZW50IGEgYmFyIGluIHRoZSBzZWVrIGJhci5cbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gc2V0IHRoZSBwb3NpdGlvbiBmb3JcbiAgICogQHBhcmFtIHBlcmNlbnQgYSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxMDBcbiAgICovXG4gIHByaXZhdGUgc2V0UG9zaXRpb24oZWxlbWVudDogRE9NLCBwZXJjZW50OiBudW1iZXIpIHtcbiAgICBsZXQgc2NhbGUgPSBwZXJjZW50IC8gMTAwO1xuICAgIGxldCBzdHlsZSA9IHRoaXMuY29uZmlnLnZlcnRpY2FsID9cbiAgICAgIC8vIC1tcy10cmFuc2Zvcm0gcmVxdWlyZWQgZm9yIElFOVxuICAgICAgeyd0cmFuc2Zvcm0nOiAnc2NhbGVZKCcgKyBzY2FsZSArICcpJywgJy1tcy10cmFuc2Zvcm0nOiAnc2NhbGVZKCcgKyBzY2FsZSArICcpJ30gOlxuICAgICAgeyd0cmFuc2Zvcm0nOiAnc2NhbGVYKCcgKyBzY2FsZSArICcpJywgJy1tcy10cmFuc2Zvcm0nOiAnc2NhbGVYKCcgKyBzY2FsZSArICcpJ307XG4gICAgZWxlbWVudC5jc3Moc3R5bGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIHNlZWsgYmFyIGludG8gb3Igb3V0IG9mIHNlZWtpbmcgc3RhdGUgYnkgYWRkaW5nL3JlbW92aW5nIGEgY2xhc3MgdG8gdGhlIERPTSBlbGVtZW50LiBUaGlzIGNhbiBiZSB1c2VkXG4gICAqIHRvIGFkanVzdCB0aGUgc3R5bGluZyB3aGlsZSBzZWVraW5nLlxuICAgKlxuICAgKiBAcGFyYW0gc2Vla2luZyBzaG91bGQgYmUgdHJ1ZSB3aGVuIGVudGVyaW5nIHNlZWsgc3RhdGUsIGZhbHNlIHdoZW4gZXhpdGluZyB0aGUgc2VlayBzdGF0ZVxuICAgKi9cbiAgc2V0U2Vla2luZyhzZWVraW5nOiBib29sZWFuKSB7XG4gICAgaWYgKHNlZWtpbmcpIHtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFNlZWtCYXIuQ0xBU1NfU0VFS0lORykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhTZWVrQmFyLkNMQVNTX1NFRUtJTkcpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzZWVrIGJhciBpcyBjdXJyZW50bHkgaW4gdGhlIHNlZWsgc3RhdGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluIHNlZWsgc3RhdGUsIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzU2Vla2luZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXREb21FbGVtZW50KCkuaGFzQ2xhc3ModGhpcy5wcmVmaXhDc3MoU2Vla0Jhci5DTEFTU19TRUVLSU5HKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzZWVrIGJhciBoYXMgYSB7QGxpbmsgU2Vla0JhckxhYmVsfS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHNlZWsgYmFyIGhhcyBhIGxhYmVsLCBlbHNlIGZhbHNlXG4gICAqL1xuICBoYXNMYWJlbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbCAhPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxhYmVsIG9mIHRoaXMgc2VlayBiYXIuXG4gICAqIEByZXR1cm5zIHtTZWVrQmFyTGFiZWx9IHRoZSBsYWJlbCBpZiB0aGlzIHNlZWsgYmFyIGhhcyBhIGxhYmVsLCBlbHNlIG51bGxcbiAgICovXG4gIGdldExhYmVsKCk6IFNlZWtCYXJMYWJlbCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmxhYmVsO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uU2Vla0V2ZW50KCkge1xuICAgIHRoaXMuc2Vla0JhckV2ZW50cy5vblNlZWsuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25TZWVrUHJldmlld0V2ZW50KHBlcmNlbnRhZ2U6IG51bWJlciwgc2NydWJiaW5nOiBib29sZWFuKSB7XG4gICAgbGV0IHNuYXBwZWRNYXJrZXIgPSB0aGlzLmdldE1hcmtlckF0UG9zaXRpb24ocGVyY2VudGFnZSk7XG5cbiAgICBpZiAodGhpcy5sYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbC5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgJ2xlZnQnOiAoc25hcHBlZE1hcmtlciA/IHNuYXBwZWRNYXJrZXIudGltZVBlcmNlbnRhZ2UgOiBwZXJjZW50YWdlKSArICclJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWVrQmFyRXZlbnRzLm9uU2Vla1ByZXZpZXcuZGlzcGF0Y2godGhpcywge1xuICAgICAgc2NydWJiaW5nOiBzY3J1YmJpbmcsXG4gICAgICBwb3NpdGlvbjogcGVyY2VudGFnZSxcbiAgICAgIG1hcmtlcjogc25hcHBlZE1hcmtlcixcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblNlZWtlZEV2ZW50KHBlcmNlbnRhZ2U6IG51bWJlcikge1xuICAgIHRoaXMuc2Vla0JhckV2ZW50cy5vblNlZWtlZC5kaXNwYXRjaCh0aGlzLCBwZXJjZW50YWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gYSBzY3J1YmJpbmcgc2VlayBvcGVyYXRpb24gaXMgc3RhcnRlZC5cbiAgICogQHJldHVybnMge0V2ZW50PFNlZWtCYXIsIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25TZWVrKCk6IEV2ZW50PFNlZWtCYXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCBkdXJpbmcgYSBzY3J1YmJpbmcgc2VlayAodG8gaW5kaWNhdGUgdGhhdCB0aGUgc2VlayBwcmV2aWV3LCBpLmUuIHRoZSB2aWRlbyBmcmFtZSxcbiAgICogc2hvdWxkIGJlIHVwZGF0ZWQpLCBvciBkdXJpbmcgYSBub3JtYWwgc2VlayBwcmV2aWV3IHdoZW4gdGhlIHNlZWsgYmFyIGlzIGhvdmVyZWQgKGFuZCB0aGUgc2VlayB0YXJnZXQsXG4gICAqIGkuZS4gdGhlIHNlZWsgYmFyIGxhYmVsLCBzaG91bGQgYmUgdXBkYXRlZCkuXG4gICAqIEByZXR1cm5zIHtFdmVudDxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz59XG4gICAqL1xuICBnZXQgb25TZWVrUHJldmlldygpOiBFdmVudDxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrUHJldmlldy5nZXRFdmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiBhIHNjcnViYmluZyBzZWVrIGhhcyBmaW5pc2hlZCBvciB3aGVuIGEgZGlyZWN0IHNlZWsgaXMgaXNzdWVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8U2Vla0JhciwgbnVtYmVyPn1cbiAgICovXG4gIGdldCBvblNlZWtlZCgpOiBFdmVudDxTZWVrQmFyLCBudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5zZWVrQmFyRXZlbnRzLm9uU2Vla2VkLmdldEV2ZW50KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25DaGFuZ2VDb21tZW50c09uRXZlbnQob246IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNlZWtCYXJFdmVudHMub25DaGFuZ2VDb21tZW50c09uLmRpc3BhdGNoKHRoaXMsIG9uKTtcbiAgfVxuXG4gIGdldCBvbkNoYW5nZUNvbW1lbnRzT24oKTogRXZlbnQ8U2Vla0JhciwgYm9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25DaGFuZ2VDb21tZW50c09uLmdldEV2ZW50KCk7XG4gIH1cblxuICB0b2dnbGVDb21tZW50c09uKCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbW1lbnRzT24gPSAhdGhpcy5fY29tbWVudHNPbjtcbiAgICB0aGlzLm9uQ2hhbmdlQ29tbWVudHNPbkV2ZW50KHRoaXMuX2NvbW1lbnRzT24pO1xuICAgIHRoaXMudXBkYXRlTWFya2VycygpO1xuICB9XG5cbiAgZ2V0IGNvbW1lbnRzT24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1lbnRzT25cbiAgfVxuXG4gIHByb3RlY3RlZCBvblNob3dFdmVudCgpOiB2b2lkIHtcbiAgICBzdXBlci5vblNob3dFdmVudCgpO1xuXG4gICAgLy8gUmVmcmVzaCB0aGUgcG9zaXRpb24gb2YgdGhlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gdGhlIHNlZWsgYmFyIGJlY29tZXMgdmlzaWJsZS4gVG8gY29ycmVjdGx5IHNldCB0aGUgcG9zaXRpb24sXG4gICAgLy8gdGhlIERPTSBlbGVtZW50IG11c3QgYmUgZnVsbHkgaW5pdGlhbGl6ZWQgYW4gaGF2ZSBpdHMgc2l6ZSBjYWxjdWxhdGVkLCBiZWNhdXNlIHRoZSBwb3NpdGlvbiBpcyBzZXQgYXMgYW4gYWJzb2x1dGVcbiAgICAvLyB2YWx1ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHNpemUuIFRoaXMgcmVxdWlyZWQgc2l6ZSBpcyBub3Qga25vd24gd2hlbiBpdCBpcyBoaWRkZW4uXG4gICAgLy8gRm9yIHN1Y2ggY2FzZXMsIHdlIHJlZnJlc2ggdGhlIHBvc2l0aW9uIGhlcmUgaW4gb25TaG93IGJlY2F1c2UgaGVyZSBpdCBpcyBndWFyYW50ZWVkIHRoYXQgdGhlIGNvbXBvbmVudCBrbm93c1xuICAgIC8vIGl0cyBzaXplIGFuZCBjYW4gc2V0IHRoZSBwb3NpdGlvbiBjb3JyZWN0bHkuXG4gICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlciwgU2Vla1ByZXZpZXdBcmdzfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtTdHJpbmdVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtET019IGZyb20gXCIuLi9kb21cIjtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgU2Vla0JhckxhYmVsfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWVrQmFyTGFiZWxDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvLyBub3RoaW5nIHlldFxufVxuXG4vKipcbiAqIEEgbGFiZWwgZm9yIGEge0BsaW5rIFNlZWtCYXJ9IHRoYXQgY2FuIGRpc3BsYXkgdGhlIHNlZWsgdGFyZ2V0IHRpbWUsIGEgdGh1bWJuYWlsLCBhbmQgdGl0bGUgKGUuZy4gY2hhcHRlciB0aXRsZSkuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWVrQmFyTGFiZWwgZXh0ZW5kcyBDb250YWluZXI8U2Vla0JhckxhYmVsQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBhdmF0YXJMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIGNvbW1lbnRMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIG1hcmtlclR5cGU6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+O1xuICBwcml2YXRlIG1ldGFkYXRhOiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPjtcbiAgcHJpdmF0ZSB0aHVtYm5haWw6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+O1xuICBwcml2YXRlIHRpbWVMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIHRpdGxlTGFiZWw6IExhYmVsPExhYmVsQ29uZmlnPjtcblxuICBwcml2YXRlIG1hcmtlclR5cGVDbGFzczogc3RyaW5nO1xuICBwcml2YXRlIHRpbWVGb3JtYXQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFNlZWtCYXJMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuYXZhdGFyTGFiZWwgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzZXM6IFsnc2Vla2Jhci1sYWJlbC1hdmF0YXInXX0pO1xuICAgIHRoaXMuY29tbWVudExhYmVsID0gbmV3IExhYmVsKHtjc3NDbGFzc2VzOiBbJ3NlZWtiYXItbGFiZWwtY29tbWVudCddfSk7XG4gICAgdGhpcy5tYXJrZXJUeXBlID0gbmV3IENvbXBvbmVudCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLWxhYmVsLW1hcmtlci10eXBlJ119KTtcbiAgICB0aGlzLnRodW1ibmFpbCA9IG5ldyBDb21wb25lbnQoe2Nzc0NsYXNzZXM6IFsnc2Vla2Jhci10aHVtYm5haWwnXX0pO1xuICAgIHRoaXMudGltZUxhYmVsID0gbmV3IExhYmVsKHtjc3NDbGFzc2VzOiBbJ3NlZWtiYXItbGFiZWwtdGltZSddfSk7XG4gICAgdGhpcy50aXRsZUxhYmVsID0gbmV3IExhYmVsKHtjc3NDbGFzc2VzOiBbJ3NlZWtiYXItbGFiZWwtdGl0bGUnXX0pO1xuXG4gICAgdGhpcy5tZXRhZGF0YSA9IG5ldyBDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICB0aGlzLmF2YXRhckxhYmVsLFxuICAgICAgICAgICAgdGhpcy50aXRsZUxhYmVsLFxuICAgICAgICAgICAgdGhpcy5tYXJrZXJUeXBlXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjc3NDbGFzczogJ3NlZWtiYXItbGFiZWwtbWV0YWRhdGEtdGl0bGUnLFxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgdGhpcy5jb21tZW50TGFiZWwsXG4gICAgICAgICAgICB0aGlzLnRpbWVMYWJlbF0sXG4gICAgICAgICAgY3NzQ2xhc3M6ICdzZWVrYmFyLWxhYmVsLW1ldGFkYXRhLWNvbnRlbnQnLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICBjc3NDbGFzczogJ3NlZWtiYXItbGFiZWwtbWV0YWRhdGEnXG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNlZWtiYXItbGFiZWwnLFxuICAgICAgY29tcG9uZW50czogW25ldyBDb250YWluZXIoe1xuICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgdGhpcy50aHVtYm5haWwsXG4gICAgICAgICAgdGhpcy5tZXRhZGF0YVxuICAgICAgICBdLFxuICAgICAgICBjc3NDbGFzczogJ3NlZWtiYXItbGFiZWwtaW5uZXInLFxuICAgICAgfSldLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIHVpbWFuYWdlci5vblNlZWtQcmV2aWV3LnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzOiBTZWVrUHJldmlld0FyZ3MpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNMaXZlKCkpIHtcbiAgICAgICAgbGV0IHRpbWUgPSBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgLSBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgKiAoYXJncy5wb3NpdGlvbiAvIDEwMCk7XG4gICAgICAgIHRoaXMuc2V0VGltZSh0aW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChhcmdzLm1hcmtlcikge1xuICAgICAgICAgIHRoaXMuc2V0VGl0bGVUZXh0KGFyZ3MubWFya2VyLnRpdGxlKTtcbiAgICAgICAgICB0aGlzLnNldFNtYXNoY3V0RGF0YShhcmdzLm1hcmtlcik7XG4gICAgICAgICAgdGhpcy5zZXRUaW1lVGV4dChudWxsKTtcbiAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbChudWxsKTtcbiAgICAgICAgICB0aGlzLnNldEJhY2tncm91bmQodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBhcmdzLnBvc2l0aW9uO1xuICAgICAgICAgIHRoaXMuc2V0VGl0bGVUZXh0KG51bGwpO1xuICAgICAgICAgIHRoaXMuc2V0U21hc2hjdXREYXRhKG51bGwpO1xuICAgICAgICAgIGxldCB0aW1lID0gcGxheWVyLmdldER1cmF0aW9uKCkgKiAocGVyY2VudGFnZSAvIDEwMCk7XG4gICAgICAgICAgdGhpcy5zZXRUaW1lKHRpbWUpO1xuICAgICAgICAgIHRoaXMuc2V0VGh1bWJuYWlsKHBsYXllci5nZXRUaHVtYih0aW1lKSk7XG4gICAgICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGluaXQgPSAoKSA9PiB7XG4gICAgICAvLyBTZXQgdGltZSBmb3JtYXQgZGVwZW5kaW5nIG9uIHNvdXJjZSBkdXJhdGlvblxuICAgICAgdGhpcy50aW1lRm9ybWF0ID0gTWF0aC5hYnMocGxheWVyLmlzTGl2ZSgpID8gcGxheWVyLmdldE1heFRpbWVTaGlmdCgpIDogcGxheWVyLmdldER1cmF0aW9uKCkpID49IDM2MDAgP1xuICAgICAgICBTdHJpbmdVdGlscy5GT1JNQVRfSEhNTVNTIDogU3RyaW5nVXRpbHMuRk9STUFUX01NU1M7XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBpbml0KTtcbiAgICBpbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhcmJpdHJhcnkgdGV4dCBvbiB0aGUgbGFiZWwuXG4gICAqIEBwYXJhbSB0ZXh0IHRoZSB0ZXh0IHRvIHNob3cgb24gdGhlIGxhYmVsXG4gICAqL1xuICBzZXRUaW1lVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLnRpbWVMYWJlbC5zZXRUZXh0KHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB0aW1lIHRvIGJlIGRpc3BsYXllZCBvbiB0aGUgbGFiZWwuXG4gICAqIEBwYXJhbSBzZWNvbmRzIHRoZSB0aW1lIGluIHNlY29uZHMgdG8gZGlzcGxheSBvbiB0aGUgbGFiZWxcbiAgICovXG4gIHNldFRpbWUoc2Vjb25kczogbnVtYmVyKSB7XG4gICAgdGhpcy5zZXRUaW1lVGV4dChTdHJpbmdVdGlscy5zZWNvbmRzVG9UaW1lKHNlY29uZHMsIHRoaXMudGltZUZvcm1hdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHRleHQgb24gdGhlIHRpdGxlIGxhYmVsLlxuICAgKiBAcGFyYW0gdGV4dCB0aGUgdGV4dCB0byBzaG93IG9uIHRoZSBsYWJlbFxuICAgKi9cbiAgc2V0VGl0bGVUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMudGl0bGVMYWJlbC5zZXRUZXh0KHRleHQpO1xuICB9XG5cbiAgc2V0U21hc2hjdXREYXRhKG1hcmtlcjogYW55KSB7XG4gICAgaWYgKG1hcmtlcikge1xuICAgICAgdGhpcy5jb21tZW50TGFiZWwuc2V0VGV4dCgnXCInICsgbWFya2VyLmNvbW1lbnQgKyAnXCInKTtcbiAgICAgIHRoaXMuYXZhdGFyTGFiZWwuc2V0VGV4dChtYXJrZXIuYXZhdGFyKTtcbiAgICAgIHRoaXMuc2V0TWFya2VyVHlwZShtYXJrZXIubWFya2VyVHlwZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb21tZW50TGFiZWwuc2V0VGV4dChudWxsKTtcbiAgICAgIHRoaXMuYXZhdGFyTGFiZWwuc2V0VGV4dChudWxsKTtcbiAgICAgIHRoaXMuc2V0TWFya2VyVHlwZShudWxsKVxuICAgIH1cbiAgfVxuXG4gIHNldE1hcmtlclR5cGUodHlwZTpzdHJpbmcpe1xuICAgIGxldCBkb20gPSB0aGlzLm1hcmtlclR5cGUuZ2V0RG9tRWxlbWVudCgpXG4gICAgaWYodGhpcy5tYXJrZXJUeXBlQ2xhc3MpIHtcbiAgICAgIGRvbS5yZW1vdmVDbGFzcyh0aGlzLm1hcmtlclR5cGVDbGFzcylcbiAgICB9XG4gICAgdGhpcy5tYXJrZXJUeXBlQ2xhc3MgPSB0eXBlXG4gICAgaWYodGhpcy5tYXJrZXJUeXBlQ2xhc3MpIHtcbiAgICAgIGRvbS5hZGRDbGFzcyh0eXBlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIG9yIHJlbW92ZXMgYSB0aHVtYm5haWwgb24gdGhlIGxhYmVsLlxuICAgKiBAcGFyYW0gdGh1bWJuYWlsIHRoZSB0aHVtYm5haWwgdG8gZGlzcGxheSBvbiB0aGUgbGFiZWwgb3IgbnVsbCB0byByZW1vdmUgYSBkaXNwbGF5ZWQgdGh1bWJuYWlsXG4gICAqL1xuICBzZXRUaHVtYm5haWwodGh1bWJuYWlsOiBiaXRtb3Zpbi5QbGF5ZXJBUEkuVGh1bWJuYWlsID0gbnVsbCkge1xuICAgIGxldCB0aHVtYm5haWxFbGVtZW50ID0gdGhpcy50aHVtYm5haWwuZ2V0RG9tRWxlbWVudCgpO1xuXG4gICAgaWYgKHRodW1ibmFpbCA9PSBudWxsKSB7XG4gICAgICB0aHVtYm5haWxFbGVtZW50LmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogbnVsbCxcbiAgICAgICAgJ2Rpc3BsYXknOiAnbnVsbCcsXG4gICAgICAgICd3aWR0aCc6ICcxODBweCcsXG4gICAgICAgICdoZWlnaHQnOiAnbnVsbCdcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRodW1ibmFpbEVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ2Rpc3BsYXknOiAnaW5oZXJpdCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogYHVybCgke3RodW1ibmFpbC51cmx9KWAsXG4gICAgICAgICd3aWR0aCc6IHRodW1ibmFpbC53ICsgJ3B4JyxcbiAgICAgICAgJ2hlaWdodCc6IHRodW1ibmFpbC5oICsgJ3B4JyxcbiAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24nOiBgLSR7dGh1bWJuYWlsLnh9cHggLSR7dGh1bWJuYWlsLnl9cHhgXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXRCYWNrZ3JvdW5kKG9uT2ZmOiBib29sZWFuKSB7XG4gICAgbGV0IG1ldGFkYXRhRWxlbWVudCA9IHRoaXMubWV0YWRhdGEuZ2V0RG9tRWxlbWVudCgpO1xuXG4gICAgaWYgKG9uT2ZmKSB7XG4gICAgICBtZXRhZGF0YUVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ2JhY2tncm91bmQnOiAnI2ZmZicsXG4gICAgICAgICdjb2xvcic6ICcjMDAwJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbWV0YWRhdGFFbGVtZW50LmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kJzogJ2luaXRpYWwnLFxuICAgICAgICAnY29sb3InOiAnI2ZmZidcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7TGlzdFNlbGVjdG9yLCBMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuXG4vKipcbiAqIEEgc2ltcGxlIHNlbGVjdCBib3ggcHJvdmlkaW5nIHRoZSBwb3NzaWJpbGl0eSB0byBzZWxlY3QgYSBzaW5nbGUgaXRlbSBvdXQgb2YgYSBsaXN0IG9mIGF2YWlsYWJsZSBpdGVtcy5cbiAqXG4gKiBET00gZXhhbXBsZTpcbiAqIDxjb2RlPlxuICogICAgIDxzZWxlY3QgY2xhc3M9J3VpLXNlbGVjdGJveCc+XG4gKiAgICAgICAgIDxvcHRpb24gdmFsdWU9J2tleSc+bGFiZWw8L29wdGlvbj5cbiAqICAgICAgICAgLi4uXG4gKiAgICAgPC9zZWxlY3Q+XG4gKiA8L2NvZGU+XG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3RCb3ggZXh0ZW5kcyBMaXN0U2VsZWN0b3I8TGlzdFNlbGVjdG9yQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzZWxlY3RFbGVtZW50OiBET007XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMaXN0U2VsZWN0b3JDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNlbGVjdGJveCdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IHNlbGVjdEVsZW1lbnQgPSBuZXcgRE9NKCdzZWxlY3QnLCB7XG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdEVsZW1lbnQgPSBzZWxlY3RFbGVtZW50O1xuICAgIHRoaXMudXBkYXRlRG9tSXRlbXMoKTtcblxuICAgIHNlbGVjdEVsZW1lbnQub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IHNlbGVjdEVsZW1lbnQudmFsKCk7XG4gICAgICB0aGlzLm9uSXRlbVNlbGVjdGVkRXZlbnQodmFsdWUsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RFbGVtZW50O1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZURvbUl0ZW1zKHNlbGVjdGVkVmFsdWU6IHN0cmluZyA9IG51bGwpIHtcbiAgICAvLyBEZWxldGUgYWxsIGNoaWxkcmVuXG4gICAgdGhpcy5zZWxlY3RFbGVtZW50LmVtcHR5KCk7XG5cbiAgICAvLyBBZGQgdXBkYXRlZCBjaGlsZHJlblxuICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xuICAgICAgbGV0IG9wdGlvbkVsZW1lbnQgPSBuZXcgRE9NKCdvcHRpb24nLCB7XG4gICAgICAgICd2YWx1ZSc6IGl0ZW0ua2V5XG4gICAgICB9KS5odG1sKGl0ZW0ubGFiZWwpO1xuXG4gICAgICBpZiAoaXRlbS5rZXkgPT09IHNlbGVjdGVkVmFsdWUgKyAnJykgeyAvLyBjb252ZXJ0IHNlbGVjdGVkVmFsdWUgdG8gc3RyaW5nIHRvIGNhdGNoICdudWxsJy9udWxsIGNhc2VcbiAgICAgICAgb3B0aW9uRWxlbWVudC5hdHRyKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlbGVjdEVsZW1lbnQuYXBwZW5kKG9wdGlvbkVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1BZGRlZEV2ZW50KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5vbkl0ZW1BZGRlZEV2ZW50KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZURvbUl0ZW1zKHRoaXMuc2VsZWN0ZWRJdGVtKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1SZW1vdmVkRXZlbnQodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyLm9uSXRlbVJlbW92ZWRFdmVudCh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVEb21JdGVtcyh0aGlzLnNlbGVjdGVkSXRlbSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtU2VsZWN0ZWRFdmVudCh2YWx1ZTogc3RyaW5nLCB1cGRhdGVEb21JdGVtczogYm9vbGVhbiA9IHRydWUpIHtcbiAgICBzdXBlci5vbkl0ZW1TZWxlY3RlZEV2ZW50KHZhbHVlKTtcbiAgICBpZiAodXBkYXRlRG9tSXRlbXMpIHtcbiAgICAgIHRoaXMudXBkYXRlRG9tSXRlbXModmFsdWUpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7U2VsZWN0Qm94fSBmcm9tICcuL3NlbGVjdGJveCc7XG5pbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtWaWRlb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vdmlkZW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7QXVkaW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2F1ZGlvcXVhbGl0eXNlbGVjdGJveCc7XG5pbXBvcnQge1RpbWVvdXR9IGZyb20gJy4uL3RpbWVvdXQnO1xuaW1wb3J0IHtFdmVudCwgRXZlbnREaXNwYXRjaGVyLCBOb0FyZ3N9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIFNldHRpbmdzUGFuZWx9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzUGFuZWxDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgc2V0dGluZ3MgcGFuZWwgd2lsbCBiZSBoaWRkZW4gd2hlbiB0aGVyZSBpcyBubyB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBTZXQgdG8gLTEgdG8gZGlzYWJsZSBhdXRvbWF0aWMgaGlkaW5nLlxuICAgKiBEZWZhdWx0OiAzIHNlY29uZHMgKDMwMDApXG4gICAqL1xuICBoaWRlRGVsYXk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQSBwYW5lbCBjb250YWluaW5nIGEgbGlzdCBvZiB7QGxpbmsgU2V0dGluZ3NQYW5lbEl0ZW0gaXRlbXN9IHRoYXQgcmVwcmVzZW50IGxhYmVsbGVkIHNldHRpbmdzLlxuICovXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NQYW5lbCBleHRlbmRzIENvbnRhaW5lcjxTZXR0aW5nc1BhbmVsQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfTEFTVCA9ICdsYXN0JztcblxuICBwcml2YXRlIHNldHRpbmdzUGFuZWxFdmVudHMgPSB7XG4gICAgb25TZXR0aW5nc1N0YXRlQ2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZXR0aW5nc1BhbmVsLCBOb0FyZ3M+KClcbiAgfTtcblxuICBwcml2YXRlIGhpZGVUaW1lb3V0OiBUaW1lb3V0O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogU2V0dGluZ3NQYW5lbENvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWc8U2V0dGluZ3NQYW5lbENvbmZpZz4oY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNldHRpbmdzLXBhbmVsJyxcbiAgICAgIGhpZGVEZWxheTogMzAwMFxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPFNldHRpbmdzUGFuZWxDb25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBmaXggZ2VuZXJpY3MgdHlwZSBpbmZlcmVuY2VcblxuICAgIGlmIChjb25maWcuaGlkZURlbGF5ID4gLTEpIHtcbiAgICAgIHRoaXMuaGlkZVRpbWVvdXQgPSBuZXcgVGltZW91dChjb25maWcuaGlkZURlbGF5LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub25TaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIEFjdGl2YXRlIHRpbWVvdXQgd2hlbiBzaG93blxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICAvLyBPbiBtb3VzZSBlbnRlciBjbGVhciB0aGUgdGltZW91dFxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICAvLyBPbiBtb3VzZSBsZWF2ZSBhY3RpdmF0ZSB0aGUgdGltZW91dFxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub25IaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIENsZWFyIHRpbWVvdXQgd2hlbiBoaWRkZW4gZnJvbSBvdXRzaWRlXG4gICAgICAgIHRoaXMuaGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEZpcmUgZXZlbnQgd2hlbiB0aGUgc3RhdGUgb2YgYSBzZXR0aW5ncy1pdGVtIGhhcyBjaGFuZ2VkXG4gICAgbGV0IHNldHRpbmdzU3RhdGVDaGFuZ2VkSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMub25TZXR0aW5nc1N0YXRlQ2hhbmdlZEV2ZW50KCk7XG5cbiAgICAgIC8vIEF0dGFjaCBtYXJrZXIgY2xhc3MgdG8gbGFzdCB2aXNpYmxlIGl0ZW1cbiAgICAgIGxldCBsYXN0U2hvd25JdGVtID0gbnVsbDtcbiAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldEl0ZW1zKCkpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIFNldHRpbmdzUGFuZWxJdGVtKSB7XG4gICAgICAgICAgY29tcG9uZW50LmdldERvbUVsZW1lbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhTZXR0aW5nc1BhbmVsLkNMQVNTX0xBU1QpKTtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmlzU2hvd24oKSkge1xuICAgICAgICAgICAgbGFzdFNob3duSXRlbSA9IGNvbXBvbmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsYXN0U2hvd25JdGVtKSB7XG4gICAgICAgIGxhc3RTaG93bkl0ZW0uZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFNldHRpbmdzUGFuZWwuQ0xBU1NfTEFTVCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0SXRlbXMoKSkge1xuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIFNldHRpbmdzUGFuZWxJdGVtKSB7XG4gICAgICAgIGNvbXBvbmVudC5vbkFjdGl2ZUNoYW5nZWQuc3Vic2NyaWJlKHNldHRpbmdzU3RhdGVDaGFuZ2VkSGFuZGxlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBzdXBlci5yZWxlYXNlKCk7XG4gICAgaWYgKHRoaXMuaGlkZVRpbWVvdXQpIHtcbiAgICAgIHRoaXMuaGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZXJlIGFyZSBhY3RpdmUgc2V0dGluZ3Mgd2l0aGluIHRoaXMgc2V0dGluZ3MgcGFuZWwuIEFuIGFjdGl2ZSBzZXR0aW5nIGlzIGEgc2V0dGluZyB0aGF0IGlzIHZpc2libGVcbiAgICogYW5kIGVuYWJsZWQsIHdoaWNoIHRoZSB1c2VyIGNhbiBpbnRlcmFjdCB3aXRoLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBhcmUgYWN0aXZlIHNldHRpbmdzLCBmYWxzZSBpZiB0aGUgcGFuZWwgaXMgZnVuY3Rpb25hbGx5IGVtcHR5IHRvIGEgdXNlclxuICAgKi9cbiAgaGFzQWN0aXZlU2V0dGluZ3MoKTogYm9vbGVhbiB7XG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0SXRlbXMoKSkge1xuICAgICAgaWYgKGNvbXBvbmVudC5pc0FjdGl2ZSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SXRlbXMoKTogU2V0dGluZ3NQYW5lbEl0ZW1bXSB7XG4gICAgcmV0dXJuIDxTZXR0aW5nc1BhbmVsSXRlbVtdPnRoaXMuY29uZmlnLmNvbXBvbmVudHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25TZXR0aW5nc1N0YXRlQ2hhbmdlZEV2ZW50KCkge1xuICAgIHRoaXMuc2V0dGluZ3NQYW5lbEV2ZW50cy5vblNldHRpbmdzU3RhdGVDaGFuZ2VkLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiBvbmUgb3IgbW9yZSB7QGxpbmsgU2V0dGluZ3NQYW5lbEl0ZW0gaXRlbXN9IGhhdmUgY2hhbmdlZCBzdGF0ZS5cbiAgICogQHJldHVybnMge0V2ZW50PFNldHRpbmdzUGFuZWwsIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25TZXR0aW5nc1N0YXRlQ2hhbmdlZCgpOiBFdmVudDxTZXR0aW5nc1BhbmVsLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1BhbmVsRXZlbnRzLm9uU2V0dGluZ3NTdGF0ZUNoYW5nZWQuZ2V0RXZlbnQoKTtcbiAgfVxufVxuXG4vKipcbiAqIEFuIGl0ZW0gZm9yIGEge0BsaW5rIFNldHRpbmdzUGFuZWx9LCBjb250YWluaW5nIGEge0BsaW5rIExhYmVsfSBhbmQgYSBjb21wb25lbnQgdGhhdCBjb25maWd1cmVzIGEgc2V0dGluZy5cbiAqIFN1cHBvcnRlZCBzZXR0aW5nIGNvbXBvbmVudHM6IHtAbGluayBTZWxlY3RCb3h9XG4gKi9cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1BhbmVsSXRlbSBleHRlbmRzIENvbnRhaW5lcjxDb250YWluZXJDb25maWc+IHtcblxuICBwcml2YXRlIGxhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgc2V0dGluZzogU2VsZWN0Qm94O1xuXG4gIHByaXZhdGUgc2V0dGluZ3NQYW5lbEl0ZW1FdmVudHMgPSB7XG4gICAgb25BY3RpdmVDaGFuZ2VkOiBuZXcgRXZlbnREaXNwYXRjaGVyPFNldHRpbmdzUGFuZWxJdGVtLCBOb0FyZ3M+KClcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihsYWJlbDogc3RyaW5nLCBzZWxlY3RCb3g6IFNlbGVjdEJveCwgY29uZmlnOiBDb250YWluZXJDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmxhYmVsID0gbmV3IExhYmVsKHsgdGV4dDogbGFiZWwgfSk7XG4gICAgdGhpcy5zZXR0aW5nID0gc2VsZWN0Qm94O1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZXR0aW5ncy1wYW5lbC1pdGVtJyxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLmxhYmVsLCB0aGlzLnNldHRpbmddXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgbGV0IGhhbmRsZUNvbmZpZ0l0ZW1DaGFuZ2VkID0gKCkgPT4ge1xuICAgICAgLy8gVGhlIG1pbmltdW0gbnVtYmVyIG9mIGl0ZW1zIHRoYXQgbXVzdCBiZSBhdmFpbGFibGUgZm9yIHRoZSBzZXR0aW5nIHRvIGJlIGRpc3BsYXllZFxuICAgICAgLy8gQnkgZGVmYXVsdCwgYXQgbGVhc3QgdHdvIGl0ZW1zIG11c3QgYmUgYXZhaWxhYmxlLCBlbHNlIGEgc2VsZWN0aW9uIGlzIG5vdCBwb3NzaWJsZVxuICAgICAgbGV0IG1pbkl0ZW1zVG9EaXNwbGF5ID0gMjtcbiAgICAgIC8vIEF1ZGlvL3ZpZGVvIHF1YWxpdHkgc2VsZWN0IGJveGVzIGNvbnRhaW4gYW4gYWRkaXRpb25hbCAnYXV0bycgbW9kZSwgd2hpY2ggaW4gY29tYmluYXRpb24gd2l0aCBhIHNpbmdsZVxuICAgICAgLy8gYXZhaWxhYmxlIHF1YWxpdHkgYWxzbyBkb2VzIG5vdCBtYWtlIHNlbnNlXG4gICAgICBpZiAodGhpcy5zZXR0aW5nIGluc3RhbmNlb2YgVmlkZW9RdWFsaXR5U2VsZWN0Qm94IHx8IHRoaXMuc2V0dGluZyBpbnN0YW5jZW9mIEF1ZGlvUXVhbGl0eVNlbGVjdEJveCkge1xuICAgICAgICBtaW5JdGVtc1RvRGlzcGxheSA9IDM7XG4gICAgICB9XG5cbiAgICAgIC8vIEhpZGUgdGhlIHNldHRpbmcgaWYgbm8gbWVhbmluZ2Z1bCBjaG9pY2UgaXMgYXZhaWxhYmxlXG4gICAgICBpZiAodGhpcy5zZXR0aW5nLml0ZW1Db3VudCgpIDwgbWluSXRlbXNUb0Rpc3BsYXkpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH1cblxuICAgICAgLy8gVmlzaWJpbGl0eSBtaWdodCBoYXZlIGNoYW5nZWQgYW5kIHRoZXJlZm9yZSB0aGUgYWN0aXZlIHN0YXRlIG1pZ2h0IGhhdmUgY2hhbmdlZCBzbyB3ZSBmaXJlIHRoZSBldmVudFxuICAgICAgLy8gVE9ETyBmaXJlIG9ubHkgd2hlbiBzdGF0ZSBoYXMgcmVhbGx5IGNoYW5nZWQgKGUuZy4gY2hlY2sgaWYgdmlzaWJpbGl0eSBoYXMgcmVhbGx5IGNoYW5nZWQpXG4gICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlZEV2ZW50KCk7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0dGluZy5vbkl0ZW1BZGRlZC5zdWJzY3JpYmUoaGFuZGxlQ29uZmlnSXRlbUNoYW5nZWQpO1xuICAgIHRoaXMuc2V0dGluZy5vbkl0ZW1SZW1vdmVkLnN1YnNjcmliZShoYW5kbGVDb25maWdJdGVtQ2hhbmdlZCk7XG5cbiAgICAvLyBJbml0aWFsaXplIGhpZGRlbiBzdGF0ZVxuICAgIGhhbmRsZUNvbmZpZ0l0ZW1DaGFuZ2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoaXMgc2V0dGluZ3MgcGFuZWwgaXRlbSBpcyBhY3RpdmUsIGkuZS4gdmlzaWJsZSBhbmQgZW5hYmxlZCBhbmQgYSB1c2VyIGNhbiBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgcGFuZWwgaXMgYWN0aXZlLCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc0FjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1Nob3duKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25BY3RpdmVDaGFuZ2VkRXZlbnQoKSB7XG4gICAgdGhpcy5zZXR0aW5nc1BhbmVsSXRlbUV2ZW50cy5vbkFjdGl2ZUNoYW5nZWQuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSAnYWN0aXZlJyBzdGF0ZSBvZiB0aGlzIGl0ZW0gY2hhbmdlcy5cbiAgICogQHNlZSAjaXNBY3RpdmVcbiAgICogQHJldHVybnMge0V2ZW50PFNldHRpbmdzUGFuZWxJdGVtLCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uQWN0aXZlQ2hhbmdlZCgpOiBFdmVudDxTZXR0aW5nc1BhbmVsSXRlbSwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NQYW5lbEl0ZW1FdmVudHMub25BY3RpdmVDaGFuZ2VkLmdldEV2ZW50KCk7XG4gIH1cbn1cbiIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U2V0dGluZ3NQYW5lbH0gZnJvbSAnLi9zZXR0aW5nc3BhbmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgU2V0dGluZ3NUb2dnbGVCdXR0b259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnIGV4dGVuZHMgVG9nZ2xlQnV0dG9uQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBzZXR0aW5ncyBwYW5lbCB3aG9zZSB2aXNpYmlsaXR5IHRoZSBidXR0b24gc2hvdWxkIHRvZ2dsZS5cbiAgICovXG4gIHNldHRpbmdzUGFuZWw6IFNldHRpbmdzUGFuZWw7XG5cbiAgLyoqXG4gICAqIERlY2lkZXMgaWYgdGhlIGJ1dHRvbiBzaG91bGQgYmUgYXV0b21hdGljYWxseSBoaWRkZW4gd2hlbiB0aGUgc2V0dGluZ3MgcGFuZWwgZG9lcyBub3QgY29udGFpbiBhbnkgYWN0aXZlIHNldHRpbmdzLlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBhdXRvSGlkZVdoZW5Ob0FjdGl2ZVNldHRpbmdzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdmlzaWJpbGl0eSBvZiBhIHNldHRpbmdzIHBhbmVsLlxuICovXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248U2V0dGluZ3NUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIGlmICghY29uZmlnLnNldHRpbmdzUGFuZWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWlyZWQgU2V0dGluZ3NQYW5lbCBpcyBtaXNzaW5nJyk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZXR0aW5nc3RvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnU2V0dGluZ3MnLFxuICAgICAgc2V0dGluZ3NQYW5lbDogbnVsbCxcbiAgICAgIGF1dG9IaWRlV2hlbk5vQWN0aXZlU2V0dGluZ3M6IHRydWVcbiAgICB9LCA8U2V0dGluZ3NUb2dnbGVCdXR0b25Db25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8U2V0dGluZ3NUb2dnbGVCdXR0b25Db25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBmaXggZ2VuZXJpY3MgdHlwZSBpbmZlcmVuY2VcbiAgICBsZXQgc2V0dGluZ3NQYW5lbCA9IGNvbmZpZy5zZXR0aW5nc1BhbmVsO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzZXR0aW5nc1BhbmVsLnRvZ2dsZUhpZGRlbigpO1xuICAgIH0pO1xuICAgIHNldHRpbmdzUGFuZWwub25TaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBTZXQgdG9nZ2xlIHN0YXR1cyB0byBvbiB3aGVuIHRoZSBzZXR0aW5ncyBwYW5lbCBzaG93c1xuICAgICAgdGhpcy5vbigpO1xuICAgIH0pO1xuICAgIHNldHRpbmdzUGFuZWwub25IaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBTZXQgdG9nZ2xlIHN0YXR1cyB0byBvZmYgd2hlbiB0aGUgc2V0dGluZ3MgcGFuZWwgaGlkZXNcbiAgICAgIHRoaXMub2ZmKCk7XG4gICAgfSk7XG5cbiAgICAvLyBIYW5kbGUgYXV0b21hdGljIGhpZGluZyBvZiB0aGUgYnV0dG9uIGlmIHRoZXJlIGFyZSBubyBzZXR0aW5ncyBmb3IgdGhlIHVzZXIgdG8gaW50ZXJhY3Qgd2l0aFxuICAgIGlmIChjb25maWcuYXV0b0hpZGVXaGVuTm9BY3RpdmVTZXR0aW5ncykge1xuICAgICAgLy8gU2V0dXAgaGFuZGxlciB0byBzaG93L2hpZGUgYnV0dG9uIHdoZW4gdGhlIHNldHRpbmdzIGNoYW5nZVxuICAgICAgbGV0IHNldHRpbmdzUGFuZWxJdGVtc0NoYW5nZWRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICBpZiAoc2V0dGluZ3NQYW5lbC5oYXNBY3RpdmVTZXR0aW5ncygpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLmlzU2hvd24oKSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gV2lyZSB0aGUgaGFuZGxlciB0byB0aGUgZXZlbnRcbiAgICAgIHNldHRpbmdzUGFuZWwub25TZXR0aW5nc1N0YXRlQ2hhbmdlZC5zdWJzY3JpYmUoc2V0dGluZ3NQYW5lbEl0ZW1zQ2hhbmdlZEhhbmRsZXIpO1xuICAgICAgLy8gQ2FsbCBoYW5kbGVyIGZvciBmaXJzdCBpbml0IGF0IHN0YXJ0dXBcbiAgICAgIHNldHRpbmdzUGFuZWxJdGVtc0NoYW5nZWRIYW5kbGVyKCk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuXG4vKipcbiAqIEEgZHVtbXkgY29tcG9uZW50IHRoYXQganVzdCByZXNlcnZlcyBzb21lIHNwYWNlIGFuZCBkb2VzIG5vdGhpbmcgZWxzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwYWNlciBleHRlbmRzIENvbXBvbmVudDxDb21wb25lbnRDb25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbXBvbmVudENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc3BhY2VyJyxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuXG4gIHByb3RlY3RlZCBvblNob3dFdmVudCgpOiB2b2lkIHtcbiAgICAvLyBkaXNhYmxlIGV2ZW50IGZpcmluZyBieSBvdmVyd3JpdGluZyBhbmQgbm90IGNhbGxpbmcgc3VwZXJcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkhpZGVFdmVudCgpOiB2b2lkIHtcbiAgICAvLyBkaXNhYmxlIGV2ZW50IGZpcmluZyBieSBvdmVyd3JpdGluZyBhbmQgbm90IGNhbGxpbmcgc3VwZXJcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkhvdmVyQ2hhbmdlZEV2ZW50KGhvdmVyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAvLyBkaXNhYmxlIGV2ZW50IGZpcmluZyBieSBvdmVyd3JpdGluZyBhbmQgbm90IGNhbGxpbmcgc3VwZXJcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgU3VidGl0bGVDdWVFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5TdWJ0aXRsZUN1ZUV2ZW50O1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtDb21wb25lbnRDb25maWcsIENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtDb250cm9sQmFyfSBmcm9tICcuL2NvbnRyb2xiYXInO1xuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgdG8gZGlzcGxheSBzdWJ0aXRsZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJ0aXRsZU92ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfQ09OVFJPTEJBUl9WSVNJQkxFID0gJ2NvbnRyb2xiYXItdmlzaWJsZSc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb250YWluZXJDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXN1YnRpdGxlLW92ZXJsYXknLFxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgc3VidGl0bGVNYW5hZ2VyID0gbmV3IEFjdGl2ZVN1YnRpdGxlTWFuYWdlcigpO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ1VFX0VOVEVSLCAoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpID0+IHtcbiAgICAgIGxldCBsYWJlbFRvQWRkID0gc3VidGl0bGVNYW5hZ2VyLmN1ZUVudGVyKGV2ZW50KTtcblxuICAgICAgdGhpcy5hZGRDb21wb25lbnQobGFiZWxUb0FkZCk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcblxuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ1VFX0VYSVQsIChldmVudDogU3VidGl0bGVDdWVFdmVudCkgPT4ge1xuICAgICAgbGV0IGxhYmVsVG9SZW1vdmUgPSBzdWJ0aXRsZU1hbmFnZXIuY3VlRXhpdChldmVudCk7XG5cbiAgICAgIGlmIChsYWJlbFRvUmVtb3ZlKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KGxhYmVsVG9SZW1vdmUpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzdWJ0aXRsZU1hbmFnZXIuaGFzQ3Vlcykge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBzdWJ0aXRsZUNsZWFySGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgc3VidGl0bGVNYW5hZ2VyLmNsZWFyKCk7XG4gICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50cygpO1xuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BVURJT19DSEFOR0VELCBzdWJ0aXRsZUNsZWFySGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1VCVElUTEVfQ0hBTkdFRCwgc3VidGl0bGVDbGVhckhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUssIHN1YnRpdGxlQ2xlYXJIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZULCBzdWJ0aXRsZUNsZWFySGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUJBQ0tfRklOSVNIRUQsIHN1YnRpdGxlQ2xlYXJIYW5kbGVyKTtcblxuICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudFNob3cuc3Vic2NyaWJlKChjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSA9PiB7XG4gICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29udHJvbEJhcikge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhTdWJ0aXRsZU92ZXJsYXkuQ0xBU1NfQ09OVFJPTEJBUl9WSVNJQkxFKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29tcG9uZW50SGlkZS5zdWJzY3JpYmUoKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4pID0+IHtcbiAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb250cm9sQmFyKSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFN1YnRpdGxlT3ZlcmxheS5DTEFTU19DT05UUk9MQkFSX1ZJU0lCTEUpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEluaXRcbiAgICBzdWJ0aXRsZUNsZWFySGFuZGxlcigpO1xuICB9XG59XG5cbmludGVyZmFjZSBBY3RpdmVTdWJ0aXRsZUN1ZSB7XG4gIGV2ZW50OiBTdWJ0aXRsZUN1ZUV2ZW50O1xuICBsYWJlbDogU3VidGl0bGVMYWJlbDtcbn1cblxuaW50ZXJmYWNlIEFjdGl2ZVN1YnRpdGxlQ3VlTWFwIHtcbiAgW2lkOiBzdHJpbmddOiBBY3RpdmVTdWJ0aXRsZUN1ZTtcbn1cblxuY2xhc3MgU3VidGl0bGVMYWJlbCBleHRlbmRzIExhYmVsPExhYmVsQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc3VidGl0bGUtbGFiZWwnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG59XG5cbmNsYXNzIEFjdGl2ZVN1YnRpdGxlTWFuYWdlciB7XG5cbiAgcHJpdmF0ZSBhY3RpdmVTdWJ0aXRsZUN1ZU1hcDogQWN0aXZlU3VidGl0bGVDdWVNYXA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcCA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYSB1bmlxdWUgSUQgZm9yIGEgc3VidGl0bGUgY3VlLCB3aGljaCBpcyBuZWVkZWQgdG8gYXNzb2NpYXRlIGFuIE9OX0NVRV9FTlRFUiB3aXRoIGl0cyBPTl9DVUVfRVhJVFxuICAgKiBldmVudCBzbyB3ZSBjYW4gcmVtb3ZlIHRoZSBjb3JyZWN0IHN1YnRpdGxlIGluIE9OX0NVRV9FWElUIHdoZW4gbXVsdGlwbGUgc3VidGl0bGVzIGFyZSBhY3RpdmUgYXQgdGhlIHNhbWUgdGltZS5cbiAgICogVGhlIHN0YXJ0IHRpbWUgcGx1cyB0aGUgdGV4dCBzaG91bGQgbWFrZSBhIHVuaXF1ZSBpZGVudGlmaWVyLCBhbmQgaW4gdGhlIG9ubHkgY2FzZSB3aGVyZSBhIGNvbGxpc2lvblxuICAgKiBjYW4gaGFwcGVuLCB0d28gc2ltaWxhciB0ZXh0cyB3aWxsIGRpc3BsYXllZCBhdCBhIHNpbWlsYXIgdGltZSBzbyBpdCBkb2VzIG5vdCBtYXR0ZXIgd2hpY2ggb25lIHdlIGRlbGV0ZS5cbiAgICogVGhlIHN0YXJ0IHRpbWUgc2hvdWxkIGFsd2F5cyBiZSBrbm93biwgYmVjYXVzZSBpdCBpcyByZXF1aXJlZCB0byBzY2hlZHVsZSB0aGUgT05fQ1VFX0VOVEVSIGV2ZW50LiBUaGUgZW5kIHRpbWVcbiAgICogbXVzdCBub3QgbmVjZXNzYXJpbHkgYmUga25vd24gYW5kIHRoZXJlZm9yZSBjYW5ub3QgYmUgdXNlZCBmb3IgdGhlIElELlxuICAgKiBAcGFyYW0gZXZlbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlSWQoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpOiBzdHJpbmcge1xuICAgIHJldHVybiBldmVudC5zdGFydCArIGV2ZW50LnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN1YnRpdGxlIGN1ZSB0byB0aGUgbWFuYWdlciBhbmQgcmV0dXJucyB0aGUgbGFiZWwgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHN1YnRpdGxlIG92ZXJsYXkuXG4gICAqIEBwYXJhbSBldmVudFxuICAgKiBAcmV0dXJuIHtTdWJ0aXRsZUxhYmVsfVxuICAgKi9cbiAgY3VlRW50ZXIoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpOiBTdWJ0aXRsZUxhYmVsIHtcbiAgICBsZXQgaWQgPSBBY3RpdmVTdWJ0aXRsZU1hbmFnZXIuY2FsY3VsYXRlSWQoZXZlbnQpO1xuXG4gICAgbGV0IGxhYmVsID0gbmV3IFN1YnRpdGxlTGFiZWwoe1xuICAgICAgLy8gUHJlZmVyIHRoZSBIVE1MIHN1YnRpdGxlIHRleHQgaWYgc2V0LCBlbHNlIHVzZSB0aGUgcGxhaW4gdGV4dFxuICAgICAgdGV4dDogZXZlbnQuaHRtbCB8fCBldmVudC50ZXh0XG4gICAgfSk7XG5cbiAgICB0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwW2lkXSA9IHsgZXZlbnQsIGxhYmVsIH07XG5cbiAgICByZXR1cm4gbGFiZWw7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgc3VidGl0bGUgY3VlIGZyb20gdGhlIG1hbmFnZXIgYW5kIHJldHVybnMgdGhlIGxhYmVsIHRoYXQgc2hvdWxkIGJlIHJlbW92ZWQgZnJvbSB0aGUgc3VidGl0bGUgb3ZlcmxheSxcbiAgICogb3IgbnVsbCBpZiB0aGVyZSBpcyBubyBhc3NvY2lhdGVkIGxhYmVsIGV4aXN0aW5nIChlLmcuIGJlY2F1c2UgYWxsIGxhYmVscyBoYXZlIGJlZW4ge0BsaW5rICNjbGVhciBjbGVhcmVkfS5cbiAgICogQHBhcmFtIGV2ZW50XG4gICAqIEByZXR1cm4ge1N1YnRpdGxlTGFiZWx8bnVsbH1cbiAgICovXG4gIGN1ZUV4aXQoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpOiBTdWJ0aXRsZUxhYmVsIHtcbiAgICBsZXQgaWQgPSBBY3RpdmVTdWJ0aXRsZU1hbmFnZXIuY2FsY3VsYXRlSWQoZXZlbnQpO1xuICAgIGxldCBhY3RpdmVTdWJ0aXRsZUN1ZSA9IHRoaXMuYWN0aXZlU3VidGl0bGVDdWVNYXBbaWRdO1xuXG4gICAgaWYgKGFjdGl2ZVN1YnRpdGxlQ3VlKSB7XG4gICAgICBkZWxldGUgdGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcFtpZF07XG4gICAgICByZXR1cm4gYWN0aXZlU3VidGl0bGVDdWUubGFiZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgYWN0aXZlIHN1YnRpdGxlIGN1ZXMuXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBjdWVDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwKS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZXJlIGFyZSBhY3RpdmUgc3VidGl0bGUgY3VlcywgZWxzZSBmYWxzZS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBoYXNDdWVzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1ZUNvdW50ID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCBzdWJ0aXRsZSBjdWVzIGZyb20gdGhlIG1hbmFnZXIuXG4gICAqL1xuICBjbGVhcigpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwID0ge307XG4gIH1cbn0iLCJpbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgU3VidGl0bGVBZGRlZEV2ZW50ID0gYml0bW92aW4uUGxheWVyQVBJLlN1YnRpdGxlQWRkZWRFdmVudDtcbmltcG9ydCBTdWJ0aXRsZUNoYW5nZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5TdWJ0aXRsZUNoYW5nZWRFdmVudDtcbmltcG9ydCBTdWJ0aXRsZVJlbW92ZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5TdWJ0aXRsZVJlbW92ZWRFdmVudDtcblxuLyoqXG4gKiBBIHNlbGVjdCBib3ggcHJvdmlkaW5nIGEgc2VsZWN0aW9uIGJldHdlZW4gYXZhaWxhYmxlIHN1YnRpdGxlIGFuZCBjYXB0aW9uIHRyYWNrcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnRpdGxlU2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgZ2V0TGFiZWwgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgc3dpdGNoIChpZCkge1xuICAgICAgICBjYXNlICdvZmYnIDpcbiAgICAgICAgICByZXR1cm4gJ09mZidcbiAgICAgICAgY2FzZSAnZW4nIDpcbiAgICAgICAgICByZXR1cm4gJ0VuZ2xpc2gnXG4gICAgICAgIGNhc2UgJ2ZyJyA6XG4gICAgICAgICAgcmV0dXJuICdGcmFuY2FpcydcbiAgICAgICAgY2FzZSAnZGUnIDpcbiAgICAgICAgICByZXR1cm4gJ0RldXRzY2gnXG4gICAgICAgIGNhc2UgJ2VzJyA6XG4gICAgICAgICAgcmV0dXJuICdFc3BhbmlvbCdcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gaWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdXBkYXRlU3VidGl0bGVzID0gKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckl0ZW1zKCk7XG5cbiAgICAgIGZvciAobGV0IHN1YnRpdGxlIG9mIHBsYXllci5nZXRBdmFpbGFibGVTdWJ0aXRsZXMoKSkge1xuICAgICAgICB0aGlzLmFkZEl0ZW0oc3VidGl0bGUuaWQsIGdldExhYmVsKHN1YnRpdGxlLmxhYmVsKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IFN1YnRpdGxlU2VsZWN0Qm94LCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0U3VidGl0bGUodmFsdWUgPT09ICdudWxsJyA/IG51bGwgOiB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBSZWFjdCB0byBBUEkgZXZlbnRzXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1VCVElUTEVfQURERUQsIChldmVudDogU3VidGl0bGVBZGRlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmFkZEl0ZW0oZXZlbnQuc3VidGl0bGUuaWQsIGV2ZW50LnN1YnRpdGxlLmxhYmVsKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TVUJUSVRMRV9DSEFOR0VELCAoZXZlbnQ6IFN1YnRpdGxlQ2hhbmdlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLnNlbGVjdEl0ZW0oZXZlbnQudGFyZ2V0U3VidGl0bGUuaWQpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NVQlRJVExFX1JFTU9WRUQsIChldmVudDogU3VidGl0bGVSZW1vdmVkRXZlbnQpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlSXRlbShldmVudC5zdWJ0aXRsZUlkKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzdWJ0aXRsZXMgd2hlbiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1cGRhdGVTdWJ0aXRsZXMpO1xuICAgIC8vIFVwZGF0ZSBzdWJ0aXRsZXMgd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHVwZGF0ZVN1YnRpdGxlcyk7XG5cbiAgICAvLyBQb3B1bGF0ZSBzdWJ0aXRsZXMgYXQgc3RhcnR1cFxuICAgIHVwZGF0ZVN1YnRpdGxlcygpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7TWV0YWRhdGFMYWJlbCwgTWV0YWRhdGFMYWJlbENvbnRlbnR9IGZyb20gJy4vbWV0YWRhdGFsYWJlbCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIFRpdGxlQmFyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaXRsZUJhckNvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaWYgdGhlIHRpdGxlIGJhciBzaG91bGQgc3RheSBoaWRkZW4gd2hlbiBubyBtZXRhZGF0YSBsYWJlbCBjb250YWlucyBhbnkgdGV4dC4gRG9lcyBub3QgbWFrZSBhIGxvdFxuICAgKiBvZiBzZW5zZSBpZiB0aGUgdGl0bGUgYmFyIGNvbnRhaW5zIG90aGVyIGNvbXBvbmVudHMgdGhhbiBqdXN0IE1ldGFkYXRhTGFiZWxzIChsaWtlIGluIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24pLlxuICAgKiBEZWZhdWx0OiBmYWxzZVxuICAgKi9cbiAga2VlcEhpZGRlbldpdGhvdXRNZXRhZGF0YT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogRGlzcGxheXMgYSB0aXRsZSBiYXIgY29udGFpbmluZyBhIGxhYmVsIHdpdGggdGhlIHRpdGxlIG9mIHRoZSB2aWRlby5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpdGxlQmFyIGV4dGVuZHMgQ29udGFpbmVyPFRpdGxlQmFyQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUaXRsZUJhckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdGl0bGViYXInLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgTWV0YWRhdGFMYWJlbCh7IGNvbnRlbnQ6IE1ldGFkYXRhTGFiZWxDb250ZW50LlRpdGxlIH0pLFxuICAgICAgICBuZXcgTWV0YWRhdGFMYWJlbCh7IGNvbnRlbnQ6IE1ldGFkYXRhTGFiZWxDb250ZW50LkRlc2NyaXB0aW9uIH0pXG4gICAgICBdLFxuICAgICAga2VlcEhpZGRlbldpdGhvdXRNZXRhZGF0YTogZmFsc2UsXG4gICAgfSwgPFRpdGxlQmFyQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPFRpdGxlQmFyQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG4gICAgbGV0IHNob3VsZEJlU2hvd24gPSAhdGhpcy5pc0hpZGRlbigpO1xuICAgIGxldCBoYXNNZXRhZGF0YVRleHQgPSB0cnVlOyAvLyBGbGFnIHRvIHRyYWNrIGlmIGFueSBtZXRhZGF0YSBsYWJlbCBjb250YWlucyB0ZXh0XG5cbiAgICBsZXQgY2hlY2tNZXRhZGF0YVRleHRBbmRVcGRhdGVWaXNpYmlsaXR5ID0gKCkgPT4ge1xuICAgICAgaGFzTWV0YWRhdGFUZXh0ID0gZmFsc2U7XG5cbiAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBtZXRhZGF0YSBsYWJlbHMgYW5kIGNoZWNrIGlmIGF0IGxlYXN0IG9uZSBvZiB0aGVtIGNvbnRhaW5zIHRleHRcbiAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldENvbXBvbmVudHMoKSkge1xuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgTWV0YWRhdGFMYWJlbCkge1xuICAgICAgICAgIGlmICghY29tcG9uZW50LmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgaGFzTWV0YWRhdGFUZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgLy8gSGlkZSBhIHZpc2libGUgdGl0bGViYXIgaWYgaXQgZG9lcyBub3QgY29udGFpbiBhbnkgdGV4dCBhbmQgdGhlIGhpZGRlbiBmbGFnIGlzIHNldFxuICAgICAgICBpZiAoY29uZmlnLmtlZXBIaWRkZW5XaXRob3V0TWV0YWRhdGEgJiYgIWhhc01ldGFkYXRhVGV4dCkge1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNob3VsZEJlU2hvd24pIHtcbiAgICAgICAgLy8gU2hvdyBhIGhpZGRlbiB0aXRsZWJhciBpZiBpdCBzaG91bGQgYWN0dWFsbHkgYmUgc2hvd25cbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIExpc3RlbiB0byB0ZXh0IGNoYW5nZSBldmVudHMgdG8gdXBkYXRlIHRoZSBoYXNNZXRhZGF0YVRleHQgZmxhZyB3aGVuIHRoZSBtZXRhZGF0YSBkeW5hbWljYWxseSBjaGFuZ2VzXG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgTWV0YWRhdGFMYWJlbCkge1xuICAgICAgICBjb21wb25lbnQub25UZXh0Q2hhbmdlZC5zdWJzY3JpYmUoY2hlY2tNZXRhZGF0YVRleHRBbmRVcGRhdGVWaXNpYmlsaXR5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1aW1hbmFnZXIub25Db250cm9sc1Nob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHNob3VsZEJlU2hvd24gPSB0cnVlO1xuICAgICAgaWYgKCEoY29uZmlnLmtlZXBIaWRkZW5XaXRob3V0TWV0YWRhdGEgJiYgIWhhc01ldGFkYXRhVGV4dCkpIHtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNIaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzaG91bGRCZVNob3duID0gZmFsc2U7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcblxuICAgIC8vIGluaXRcbiAgICBjaGVja01ldGFkYXRhVGV4dEFuZFVwZGF0ZVZpc2liaWxpdHkoKTtcbiAgfVxufSIsImltcG9ydCB7QnV0dG9uLCBCdXR0b25Db25maWd9IGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCB7Tm9BcmdzLCBFdmVudERpc3BhdGNoZXIsIEV2ZW50fSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHRvZ2dsZSBidXR0b24gY29tcG9uZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRvZ2dsZUJ1dHRvbkNvbmZpZyBleHRlbmRzIEJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdGV4dCBvbiB0aGUgYnV0dG9uLlxuICAgKi9cbiAgdGV4dD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IGNhbiBiZSB0b2dnbGVkIGJldHdlZW4gJ29uJyBhbmQgJ29mZicgc3RhdGVzLlxuICovXG5leHBvcnQgY2xhc3MgVG9nZ2xlQnV0dG9uPENvbmZpZyBleHRlbmRzIFRvZ2dsZUJ1dHRvbkNvbmZpZz4gZXh0ZW5kcyBCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfT04gPSAnb24nO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDTEFTU19PRkYgPSAnb2ZmJztcblxuICBwcml2YXRlIG9uU3RhdGU6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSB0b2dnbGVCdXR0b25FdmVudHMgPSB7XG4gICAgb25Ub2dnbGU6IG5ldyBFdmVudERpc3BhdGNoZXI8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvblRvZ2dsZU9uOiBuZXcgRXZlbnREaXNwYXRjaGVyPFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25Ub2dnbGVPZmY6IG5ldyBFdmVudERpc3BhdGNoZXI8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdG9nZ2xlYnV0dG9uJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBidXR0b24gdG8gdGhlICdvbicgc3RhdGUuXG4gICAqL1xuICBvbigpIHtcbiAgICBpZiAodGhpcy5pc09mZigpKSB7XG4gICAgICB0aGlzLm9uU3RhdGUgPSB0cnVlO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVG9nZ2xlQnV0dG9uLkNMQVNTX09GRikpO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVG9nZ2xlQnV0dG9uLkNMQVNTX09OKSk7XG5cbiAgICAgIHRoaXMub25Ub2dnbGVFdmVudCgpO1xuICAgICAgdGhpcy5vblRvZ2dsZU9uRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgYnV0dG9uIHRvIHRoZSAnb2ZmJyBzdGF0ZS5cbiAgICovXG4gIG9mZigpIHtcbiAgICBpZiAodGhpcy5pc09uKCkpIHtcbiAgICAgIHRoaXMub25TdGF0ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVG9nZ2xlQnV0dG9uLkNMQVNTX09OKSk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhUb2dnbGVCdXR0b24uQ0xBU1NfT0ZGKSk7XG5cbiAgICAgIHRoaXMub25Ub2dnbGVFdmVudCgpO1xuICAgICAgdGhpcy5vblRvZ2dsZU9mZkV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgYnV0dG9uICdvbicgaWYgaXQgaXMgJ29mZicsIG9yICdvZmYnIGlmIGl0IGlzICdvbicuXG4gICAqL1xuICB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMuaXNPbigpKSB7XG4gICAgICB0aGlzLm9mZigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgdG9nZ2xlIGJ1dHRvbiBpcyBpbiB0aGUgJ29uJyBzdGF0ZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgYnV0dG9uIGlzICdvbicsIGZhbHNlIGlmICdvZmYnXG4gICAqL1xuICBpc09uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9uU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSB0b2dnbGUgYnV0dG9uIGlzIGluIHRoZSAnb2ZmJyBzdGF0ZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgYnV0dG9uIGlzICdvZmYnLCBmYWxzZSBpZiAnb24nXG4gICAqL1xuICBpc09mZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNPbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uQ2xpY2tFdmVudCgpIHtcbiAgICBzdXBlci5vbkNsaWNrRXZlbnQoKTtcblxuICAgIC8vIEZpcmUgdGhlIHRvZ2dsZSBldmVudCB0b2dldGhlciB3aXRoIHRoZSBjbGljayBldmVudFxuICAgIC8vICh0aGV5IGFyZSB0ZWNobmljYWxseSB0aGUgc2FtZSwgb25seSB0aGUgc2VtYW50aWNzIGFyZSBkaWZmZXJlbnQpXG4gICAgdGhpcy5vblRvZ2dsZUV2ZW50KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Ub2dnbGVFdmVudCgpIHtcbiAgICB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZS5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblRvZ2dsZU9uRXZlbnQoKSB7XG4gICAgdGhpcy50b2dnbGVCdXR0b25FdmVudHMub25Ub2dnbGVPbi5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblRvZ2dsZU9mZkV2ZW50KCkge1xuICAgIHRoaXMudG9nZ2xlQnV0dG9uRXZlbnRzLm9uVG9nZ2xlT2ZmLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgYnV0dG9uIGlzIHRvZ2dsZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxUb2dnbGVCdXR0b248Q29uZmlnPiwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvblRvZ2dsZSgpOiBFdmVudDxUb2dnbGVCdXR0b248Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlQnV0dG9uRXZlbnRzLm9uVG9nZ2xlLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBidXR0b24gaXMgdG9nZ2xlZCAnb24nLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25Ub2dnbGVPbigpOiBFdmVudDxUb2dnbGVCdXR0b248Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlQnV0dG9uRXZlbnRzLm9uVG9nZ2xlT24uZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGJ1dHRvbiBpcyB0b2dnbGVkICdvZmYnLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25Ub2dnbGVPZmYoKTogRXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZU9mZi5nZXRFdmVudCgpO1xuICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5cbi8qKlxuICogQW5pbWF0ZWQgYW5hbG9nIFRWIHN0YXRpYyBub2lzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFR2Tm9pc2VDYW52YXMgZXh0ZW5kcyBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBjYW52YXM6IERPTTtcblxuICBwcml2YXRlIGNhbnZhc0VsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50O1xuICBwcml2YXRlIGNhbnZhc0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJpdmF0ZSBjYW52YXNXaWR0aCA9IDE2MDtcbiAgcHJpdmF0ZSBjYW52YXNIZWlnaHQgPSA5MDtcbiAgcHJpdmF0ZSBpbnRlcmZlcmVuY2VIZWlnaHQgPSA1MDtcbiAgcHJpdmF0ZSBsYXN0RnJhbWVVcGRhdGU6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgZnJhbWVJbnRlcnZhbDogbnVtYmVyID0gNjA7XG4gIHByaXZhdGUgdXNlQW5pbWF0aW9uRnJhbWU6IGJvb2xlYW4gPSAhIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIHByaXZhdGUgbm9pc2VBbmltYXRpb25XaW5kb3dQb3M6IG51bWJlcjtcbiAgcHJpdmF0ZSBmcmFtZVVwZGF0ZUhhbmRsZXJJZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29tcG9uZW50Q29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS10dm5vaXNlY2FudmFzJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICByZXR1cm4gdGhpcy5jYW52YXMgPSBuZXcgRE9NKCdjYW52YXMnLCB7ICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpIH0pO1xuICB9XG5cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5jYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PnRoaXMuY2FudmFzLmdldEVsZW1lbnRzKClbMF07XG4gICAgdGhpcy5jYW52YXNDb250ZXh0ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5ub2lzZUFuaW1hdGlvbldpbmRvd1BvcyA9IC10aGlzLmNhbnZhc0hlaWdodDtcbiAgICB0aGlzLmxhc3RGcmFtZVVwZGF0ZSA9IDA7XG5cbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIHRoaXMucmVuZGVyRnJhbWUoKTtcbiAgfVxuXG4gIHN0b3AoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudXNlQW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuZnJhbWVVcGRhdGVIYW5kbGVySWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mcmFtZVVwZGF0ZUhhbmRsZXJJZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJGcmFtZSgpOiB2b2lkIHtcbiAgICAvLyBUaGlzIGNvZGUgaGFzIGJlZW4gY29waWVkIGZyb20gdGhlIHBsYXllciBjb250cm9scy5qcyBhbmQgc2ltcGxpZmllZFxuXG4gICAgaWYgKHRoaXMubGFzdEZyYW1lVXBkYXRlICsgdGhpcy5mcmFtZUludGVydmFsID4gbmV3IERhdGUoKS5nZXRUaW1lKCkpIHtcbiAgICAgIC8vIEl0J3MgdG9vIGVhcmx5IHRvIHJlbmRlciB0aGUgbmV4dCBmcmFtZVxuICAgICAgdGhpcy5zY2hlZHVsZU5leHRSZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY3VycmVudFBpeGVsT2Zmc2V0O1xuICAgIGxldCBjYW52YXNXaWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgbGV0IGNhbnZhc0hlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgLy8gQ3JlYXRlIHRleHR1cmVcbiAgICBsZXQgbm9pc2VJbWFnZSA9IHRoaXMuY2FudmFzQ29udGV4dC5jcmVhdGVJbWFnZURhdGEoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5cbiAgICAvLyBGaWxsIHRleHR1cmUgd2l0aCBub2lzZVxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgY2FudmFzSGVpZ2h0OyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY2FudmFzV2lkdGg7IHgrKykge1xuICAgICAgICBjdXJyZW50UGl4ZWxPZmZzZXQgPSAoY2FudmFzV2lkdGggKiB5ICogNCkgKyB4ICogNDtcbiAgICAgICAgbm9pc2VJbWFnZS5kYXRhW2N1cnJlbnRQaXhlbE9mZnNldF0gPSBNYXRoLnJhbmRvbSgpICogMjU1O1xuICAgICAgICBpZiAoeSA8IHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgfHwgeSA+IHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgKyB0aGlzLmludGVyZmVyZW5jZUhlaWdodCkge1xuICAgICAgICAgIG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXRdICo9IDAuODU7XG4gICAgICAgIH1cbiAgICAgICAgbm9pc2VJbWFnZS5kYXRhW2N1cnJlbnRQaXhlbE9mZnNldCArIDFdID0gbm9pc2VJbWFnZS5kYXRhW2N1cnJlbnRQaXhlbE9mZnNldF07XG4gICAgICAgIG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXQgKyAyXSA9IG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXRdO1xuICAgICAgICBub2lzZUltYWdlLmRhdGFbY3VycmVudFBpeGVsT2Zmc2V0ICsgM10gPSA1MDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQdXQgdGV4dHVyZSBvbnRvIGNhbnZhc1xuICAgIHRoaXMuY2FudmFzQ29udGV4dC5wdXRJbWFnZURhdGEobm9pc2VJbWFnZSwgMCwgMCk7XG5cbiAgICB0aGlzLmxhc3RGcmFtZVVwZGF0ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgKz0gNztcbiAgICBpZiAodGhpcy5ub2lzZUFuaW1hdGlvbldpbmRvd1BvcyA+IGNhbnZhc0hlaWdodCkge1xuICAgICAgdGhpcy5ub2lzZUFuaW1hdGlvbldpbmRvd1BvcyA9IC1jYW52YXNIZWlnaHQ7XG4gICAgfVxuXG4gICAgdGhpcy5zY2hlZHVsZU5leHRSZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGVOZXh0UmVuZGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnVzZUFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICB0aGlzLmZyYW1lVXBkYXRlSGFuZGxlcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlckZyYW1lLmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZyYW1lVXBkYXRlSGFuZGxlcklkID0gc2V0VGltZW91dCh0aGlzLnJlbmRlckZyYW1lLmJpbmQodGhpcyksIHRoaXMuZnJhbWVJbnRlcnZhbCk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcbmltcG9ydCB7UGxheWVyVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBQbGF5ZXJSZXNpemVFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJSZXNpemVFdmVudDtcbmltcG9ydCB7Q2FuY2VsRXZlbnRBcmdzfSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBVSUNvbnRhaW5lcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVUlDb250YWluZXJDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgY29udHJvbCBiYXIgd2lsbCBiZSBoaWRkZW4gd2hlbiB0aGVyZSBpcyBubyB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBEZWZhdWx0OiA1IHNlY29uZHMgKDUwMDApXG4gICAqL1xuICBoaWRlRGVsYXk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgY29udGFpbmVyIHRoYXQgY29udGFpbnMgYWxsIG9mIHRoZSBVSS4gVGhlIFVJQ29udGFpbmVyIGlzIHBhc3NlZCB0byB0aGUge0BsaW5rIFVJTWFuYWdlcn0gdG8gYnVpbGQgYW5kXG4gKiBzZXR1cCB0aGUgVUkuXG4gKi9cbmV4cG9ydCBjbGFzcyBVSUNvbnRhaW5lciBleHRlbmRzIENvbnRhaW5lcjxVSUNvbnRhaW5lckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFNUQVRFX1BSRUZJWCA9ICdwbGF5ZXItc3RhdGUtJztcblxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGVUxMU0NSRUVOID0gJ2Z1bGxzY3JlZW4nO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBCVUZGRVJJTkcgPSAnYnVmZmVyaW5nJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUkVNT1RFX0NPTlRST0wgPSAncmVtb3RlLWNvbnRyb2wnO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT05UUk9MU19TSE9XTiA9ICdjb250cm9scy1zaG93bic7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENPTlRST0xTX0hJRERFTiA9ICdjb250cm9scy1oaWRkZW4nO1xuXG4gIHByaXZhdGUgdWlIaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFVJQ29udGFpbmVyQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIDxVSUNvbnRhaW5lckNvbmZpZz57XG4gICAgICBjc3NDbGFzczogJ3VpLXVpY29udGFpbmVyJyxcbiAgICAgIGhpZGVEZWxheTogNTAwMCxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5jb25maWd1cmVVSVNob3dIaWRlKHBsYXllciwgdWltYW5hZ2VyKTtcbiAgICB0aGlzLmNvbmZpZ3VyZVBsYXllclN0YXRlcyhwbGF5ZXIsIHVpbWFuYWdlcik7XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZVVJU2hvd0hpZGUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgY29udGFpbmVyID0gdGhpcy5nZXREb21FbGVtZW50KCk7XG4gICAgbGV0IGNvbmZpZyA9IDxVSUNvbnRhaW5lckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgbGV0IGlzVWlTaG93biA9IGZhbHNlO1xuICAgIGxldCBpc1NlZWtpbmcgPSBmYWxzZTtcbiAgICBsZXQgaXNGaXJzdFRvdWNoID0gdHJ1ZTtcblxuICAgIGxldCBzaG93VWkgPSAoKSA9PiB7XG4gICAgICBpZiAoIWlzVWlTaG93bikge1xuICAgICAgICAvLyBMZXQgc3Vic2NyaWJlcnMga25vdyB0aGF0IHRoZXkgc2hvdWxkIHJldmVhbCB0aGVtc2VsdmVzXG4gICAgICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzU2hvdy5kaXNwYXRjaCh0aGlzKTtcbiAgICAgICAgaXNVaVNob3duID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIERvbid0IHRyaWdnZXIgdGltZW91dCB3aGlsZSBzZWVraW5nIChpdCB3aWxsIGJlIHRyaWdnZXJlZCBvbmNlIHRoZSBzZWVrIGlzIGZpbmlzaGVkKSBvciBjYXN0aW5nXG4gICAgICBpZiAoIWlzU2Vla2luZyAmJiAhcGxheWVyLmlzQ2FzdGluZygpKSB7XG4gICAgICAgIHRoaXMudWlIaWRlVGltZW91dC5zdGFydCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgaGlkZVVpID0gKCkgPT4ge1xuICAgICAgLy8gSGlkZSB0aGUgVUkgb25seSBpZiBpdCBpcyBzaG93biwgYW5kIGlmIG5vdCBjYXN0aW5nXG4gICAgICBpZiAoaXNVaVNob3duICYmICFwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgICAgLy8gSXNzdWUgYSBwcmV2aWV3IGV2ZW50IHRvIGNoZWNrIGlmIHdlIGFyZSBnb29kIHRvIGhpZGUgdGhlIGNvbnRyb2xzXG4gICAgICAgIGxldCBwcmV2aWV3SGlkZUV2ZW50QXJncyA9IDxDYW5jZWxFdmVudEFyZ3M+e307XG4gICAgICAgIHVpbWFuYWdlci5vblByZXZpZXdDb250cm9sc0hpZGUuZGlzcGF0Y2godGhpcywgcHJldmlld0hpZGVFdmVudEFyZ3MpO1xuXG4gICAgICAgIGlmICghcHJldmlld0hpZGVFdmVudEFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIHByZXZpZXcgd2Fzbid0IGNhbmNlbGVkLCBsZXQgc3Vic2NyaWJlcnMga25vdyB0aGF0IHRoZXkgc2hvdWxkIG5vdyBoaWRlIHRoZW1zZWx2ZXNcbiAgICAgICAgICB1aW1hbmFnZXIub25Db250cm9sc0hpZGUuZGlzcGF0Y2godGhpcyk7XG4gICAgICAgICAgaXNVaVNob3duID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGhpZGUgcHJldmlldyB3YXMgY2FuY2VsZWQsIGNvbnRpbnVlIHRvIHNob3cgVUlcbiAgICAgICAgICBzaG93VWkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUaW1lb3V0IHRvIGRlZmVyIFVJIGhpZGluZyBieSB0aGUgY29uZmlndXJlZCBkZWxheSB0aW1lXG4gICAgdGhpcy51aUhpZGVUaW1lb3V0ID0gbmV3IFRpbWVvdXQoY29uZmlnLmhpZGVEZWxheSwgaGlkZVVpKTtcblxuICAgIC8vIE9uIHRvdWNoIGRpc3BsYXlzLCB0aGUgZmlyc3QgdG91Y2ggcmV2ZWFscyB0aGUgVUlcbiAgICBjb250YWluZXIub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcbiAgICAgIGlmICghaXNVaVNob3duKSB7XG4gICAgICAgIC8vIE9ubHkgaWYgdGhlIFVJIGlzIGhpZGRlbiwgd2UgcHJldmVudCBvdGhlciBhY3Rpb25zIChleGNlcHQgZm9yIHRoZSBmaXJzdCB0b3VjaCkgYW5kIHJldmVhbCB0aGUgVUkgaW5zdGVhZC5cbiAgICAgICAgLy8gVGhlIGZpcnN0IHRvdWNoIGlzIG5vdCBwcmV2ZW50ZWQgdG8gbGV0IG90aGVyIGxpc3RlbmVycyByZWNlaXZlIHRoZSBldmVudCBhbmQgdHJpZ2dlciBhbiBpbml0aWFsIGFjdGlvbiwgZS5nLlxuICAgICAgICAvLyB0aGUgaHVnZSBwbGF5YmFjayBidXR0b24gY2FuIGRpcmVjdGx5IHN0YXJ0IHBsYXliYWNrIGluc3RlYWQgb2YgcmVxdWlyaW5nIGEgZG91YmxlIHRhcCB3aGljaCAxLiByZXZlYWxzXG4gICAgICAgIC8vIHRoZSBVSSBhbmQgMi4gc3RhcnRzIHBsYXliYWNrLlxuICAgICAgICBpZiAoaXNGaXJzdFRvdWNoKSB7XG4gICAgICAgICAgaXNGaXJzdFRvdWNoID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIHNob3dVaSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIFdoZW4gdGhlIG1vdXNlIGVudGVycywgd2Ugc2hvdyB0aGUgVUlcbiAgICBjb250YWluZXIub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICB9KTtcbiAgICAvLyBXaGVuIHRoZSBtb3VzZSBtb3ZlcyB3aXRoaW4sIHdlIHNob3cgdGhlIFVJXG4gICAgY29udGFpbmVyLm9uKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICB9KTtcbiAgICAvLyBXaGVuIHRoZSBtb3VzZSBsZWF2ZXMsIHdlIGNhbiBwcmVwYXJlIHRvIGhpZGUgdGhlIFVJLCBleGNlcHQgYSBzZWVrIGlzIGdvaW5nIG9uXG4gICAgY29udGFpbmVyLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gV2hlbiBhIHNlZWsgaXMgZ29pbmcgb24sIHRoZSBzZWVrIHNjcnViIHBvaW50ZXIgbWF5IGV4aXQgdGhlIFVJIGFyZWEgd2hpbGUgc3RpbGwgc2Vla2luZywgYW5kIHdlIGRvIG5vdCBoaWRlXG4gICAgICAvLyB0aGUgVUkgaW4gc3VjaCBjYXNlc1xuICAgICAgaWYgKCFpc1NlZWtpbmcpIHtcbiAgICAgICAgdGhpcy51aUhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB1aW1hbmFnZXIub25TZWVrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnVpSGlkZVRpbWVvdXQuY2xlYXIoKTsgLy8gRG9uJ3QgaGlkZSBVSSB3aGlsZSBhIHNlZWsgaXMgaW4gcHJvZ3Jlc3NcbiAgICAgIGlzU2Vla2luZyA9IHRydWU7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uU2Vla2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMudWlIaWRlVGltZW91dC5zdGFydCgpOyAvLyBSZS1lbmFibGUgVUkgaGlkZSB0aW1lb3V0IGFmdGVyIGEgc2Vla1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlRFRCwgKCkgPT4ge1xuICAgICAgc2hvd1VpKCk7IC8vIFNob3cgVUkgd2hlbiBhIENhc3Qgc2Vzc2lvbiBoYXMgc3RhcnRlZCAoVUkgd2lsbCB0aGVuIHN0YXkgcGVybWFuZW50bHkgb24gZHVyaW5nIHRoZSBzZXNzaW9uKVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVQbGF5ZXJTdGF0ZXMocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgY29udGFpbmVyID0gdGhpcy5nZXREb21FbGVtZW50KCk7XG5cbiAgICAvLyBDb252ZXJ0IHBsYXllciBzdGF0ZXMgaW50byBDU1MgY2xhc3MgbmFtZXNcbiAgICBsZXQgc3RhdGVDbGFzc05hbWVzID0gPGFueT5bXTtcbiAgICBmb3IgKGxldCBzdGF0ZSBpbiBQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZSkge1xuICAgICAgaWYgKGlzTmFOKE51bWJlcihzdGF0ZSkpKSB7XG4gICAgICAgIGxldCBlbnVtTmFtZSA9IFBsYXllclV0aWxzLlBsYXllclN0YXRlWzxhbnk+UGxheWVyVXRpbHMuUGxheWVyU3RhdGVbc3RhdGVdXTtcbiAgICAgICAgc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlW3N0YXRlXV0gPVxuICAgICAgICAgIHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLlNUQVRFX1BSRUZJWCArIGVudW1OYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZW1vdmVTdGF0ZXMgPSAoKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLklETEVdKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUFJFUEFSRURdKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUExBWUlOR10pO1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZS5QQVVTRURdKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuRklOSVNIRURdKTtcbiAgICB9O1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCAoKSA9PiB7XG4gICAgICByZW1vdmVTdGF0ZXMoKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUFJFUEFSRURdKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCAoKSA9PiB7XG4gICAgICByZW1vdmVTdGF0ZXMoKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUExBWUlOR10pO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BBVVNFRCwgKCkgPT4ge1xuICAgICAgcmVtb3ZlU3RhdGVzKCk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBBVVNFRF0pO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlCQUNLX0ZJTklTSEVELCAoKSA9PiB7XG4gICAgICByZW1vdmVTdGF0ZXMoKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuRklOSVNIRURdKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsICgpID0+IHtcbiAgICAgIHJlbW92ZVN0YXRlcygpO1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZS5JRExFXSk7XG4gICAgfSk7XG4gICAgLy8gSW5pdCBpbiBjdXJyZW50IHBsYXllciBzdGF0ZVxuICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuZ2V0U3RhdGUocGxheWVyKV0pO1xuXG4gICAgLy8gRnVsbHNjcmVlbiBtYXJrZXIgY2xhc3NcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9GVUxMU0NSRUVOX0VOVEVSLCAoKSA9PiB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuRlVMTFNDUkVFTikpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRVhJVCwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkZVTExTQ1JFRU4pKTtcbiAgICB9KTtcbiAgICAvLyBJbml0IGZ1bGxzY3JlZW4gc3RhdGVcbiAgICBpZiAocGxheWVyLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuRlVMTFNDUkVFTikpO1xuICAgIH1cblxuICAgIC8vIEJ1ZmZlcmluZyBtYXJrZXIgY2xhc3NcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TVEFMTF9TVEFSVEVELCAoKSA9PiB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQlVGRkVSSU5HKSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1RBTExfRU5ERUQsICgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5CVUZGRVJJTkcpKTtcbiAgICB9KTtcbiAgICAvLyBJbml0IGJ1ZmZlcmluZyBzdGF0ZVxuICAgIGlmIChwbGF5ZXIuaXNTdGFsbGVkKCkpIHtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5CVUZGRVJJTkcpKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdGVDb250cm9sIG1hcmtlciBjbGFzc1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlRFRCwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLlJFTU9URV9DT05UUk9MKSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVE9QUEVELCAoKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuUkVNT1RFX0NPTlRST0wpKTtcbiAgICB9KTtcbiAgICAvLyBJbml0IFJlbW90ZUNvbnRyb2wgc3RhdGVcbiAgICBpZiAocGxheWVyLmlzQ2FzdGluZygpKSB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuUkVNT1RFX0NPTlRST0wpKTtcbiAgICB9XG5cbiAgICAvLyBDb250cm9scyB2aXNpYmlsaXR5IG1hcmtlciBjbGFzc1xuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzU2hvdy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkNPTlRST0xTX0hJRERFTikpO1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkNPTlRST0xTX1NIT1dOKSk7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNIaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQ09OVFJPTFNfU0hPV04pKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5DT05UUk9MU19ISURERU4pKTtcbiAgICB9KTtcblxuICAgIC8vIExheW91dCBzaXplIGNsYXNzZXNcbiAgICBsZXQgdXBkYXRlTGF5b3V0U2l6ZUNsYXNzZXMgPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC00MDAnKSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtNjAwJykpO1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTgwMCcpKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC0xMjAwJykpO1xuXG4gICAgICBpZiAod2lkdGggPD0gNDAwKSB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC00MDAnKSk7XG4gICAgICB9IGVsc2UgaWYgKHdpZHRoIDw9IDYwMCkge1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtNjAwJykpO1xuICAgICAgfSBlbHNlIGlmICh3aWR0aCA8PSA4MDApIHtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTgwMCcpKTtcbiAgICAgIH0gZWxzZSBpZiAod2lkdGggPD0gMTIwMCkge1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtMTIwMCcpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsIChlOiBQbGF5ZXJSZXNpemVFdmVudCkgPT4ge1xuICAgICAgLy8gQ29udmVydCBzdHJpbmdzICh3aXRoIFwicHhcIiBzdWZmaXgpIHRvIGludHNcbiAgICAgIGxldCB3aWR0aCA9IE1hdGgucm91bmQoTnVtYmVyKGUud2lkdGguc3Vic3RyaW5nKDAsIGUud2lkdGgubGVuZ3RoIC0gMikpKTtcbiAgICAgIGxldCBoZWlnaHQgPSBNYXRoLnJvdW5kKE51bWJlcihlLmhlaWdodC5zdWJzdHJpbmcoMCwgZS5oZWlnaHQubGVuZ3RoIC0gMikpKTtcblxuICAgICAgdXBkYXRlTGF5b3V0U2l6ZUNsYXNzZXMod2lkdGgsIGhlaWdodCk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0IGxheW91dCBzdGF0ZVxuICAgIHVwZGF0ZUxheW91dFNpemVDbGFzc2VzKG5ldyBET00ocGxheWVyLmdldEZpZ3VyZSgpKS53aWR0aCgpLCBuZXcgRE9NKHBsYXllci5nZXRGaWd1cmUoKSkuaGVpZ2h0KCkpO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBzdXBlci5yZWxlYXNlKCk7XG4gICAgdGhpcy51aUhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IHN1cGVyLnRvRG9tRWxlbWVudCgpO1xuXG4gICAgLy8gRGV0ZWN0IGZsZXhib3ggc3VwcG9ydCAobm90IHN1cHBvcnRlZCBpbiBJRTkpXG4gICAgaWYgKGRvY3VtZW50ICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykuc3R5bGUuZmxleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnZmxleGJveCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCduby1mbGV4Ym94JykpO1xuICAgIH1cblxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cbn0iLCJpbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBzZWxlY3QgYm94IHByb3ZpZGluZyBhIHNlbGVjdGlvbiBiZXR3ZWVuICdhdXRvJyBhbmQgdGhlIGF2YWlsYWJsZSB2aWRlbyBxdWFsaXRpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1F1YWxpdHlTZWxlY3RCb3ggZXh0ZW5kcyBTZWxlY3RCb3gge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB1cGRhdGVWaWRlb1F1YWxpdGllcyA9ICgpID0+IHtcbiAgICAgIGxldCB2aWRlb1F1YWxpdGllcyA9IHBsYXllci5nZXRBdmFpbGFibGVWaWRlb1F1YWxpdGllcygpO1xuXG4gICAgICB0aGlzLmNsZWFySXRlbXMoKTtcblxuICAgICAgLy8gQWRkIGVudHJ5IGZvciBhdXRvbWF0aWMgcXVhbGl0eSBzd2l0Y2hpbmcgKGRlZmF1bHQgc2V0dGluZylcbiAgICAgIHRoaXMuYWRkSXRlbSgnQXV0bycsICdBdXRvJyk7XG5cbiAgICAgIC8vIEFkZCB2aWRlbyBxdWFsaXRpZXNcbiAgICAgIGZvciAobGV0IHZpZGVvUXVhbGl0eSBvZiB2aWRlb1F1YWxpdGllcykge1xuICAgICAgICB0aGlzLmFkZEl0ZW0odmlkZW9RdWFsaXR5LmlkLCB2aWRlb1F1YWxpdHkubGFiZWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uSXRlbVNlbGVjdGVkLnN1YnNjcmliZSgoc2VuZGVyOiBWaWRlb1F1YWxpdHlTZWxlY3RCb3gsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHBsYXllci5zZXRWaWRlb1F1YWxpdHkodmFsdWUpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHF1YWxpdGllcyB3aGVuIHNvdXJjZSBnb2VzIGF3YXlcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHVwZGF0ZVZpZGVvUXVhbGl0aWVzKTtcbiAgICAvLyBVcGRhdGUgcXVhbGl0aWVzIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB1cGRhdGVWaWRlb1F1YWxpdGllcyk7XG4gICAgLy8gVXBkYXRlIHF1YWxpdHkgc2VsZWN0aW9uIHdoZW4gcXVhbGl0eSBpcyBjaGFuZ2VkIChmcm9tIG91dHNpZGUpXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVklERU9fRE9XTkxPQURfUVVBTElUWV9DSEFOR0UsICgpID0+IHtcbiAgICAgIGxldCBkYXRhID0gcGxheWVyLmdldERvd25sb2FkZWRWaWRlb0RhdGEoKTtcbiAgICAgIHRoaXMuc2VsZWN0SXRlbShkYXRhLmlzQXV0byA/ICdBdXRvJyA6IGRhdGEuaWQpO1xuICAgIH0pO1xuXG4gICAgLy8gUG9wdWxhdGUgcXVhbGl0aWVzIGF0IHN0YXJ0dXBcbiAgICB1cGRhdGVWaWRlb1F1YWxpdGllcygpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtWb2x1bWVTbGlkZXJ9IGZyb20gJy4vdm9sdW1lc2xpZGVyJztcbmltcG9ydCB7Vm9sdW1lVG9nZ2xlQnV0dG9ufSBmcm9tICcuL3ZvbHVtZXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgVm9sdW1lQ29udHJvbEJ1dHRvbn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVm9sdW1lQ29udHJvbEJ1dHRvbkNvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgZGVsYXkgYWZ0ZXIgd2hpY2ggdGhlIHZvbHVtZSBzbGlkZXIgd2lsbCBiZSBoaWRkZW4gd2hlbiB0aGVyZSBpcyBubyB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBDYXJlIG11c3QgYmUgdGFrZW4gdGhhdCB0aGUgZGVsYXkgaXMgbG9uZyBlbm91Z2ggc28gdXNlcnMgY2FuIHJlYWNoIHRoZSBzbGlkZXIgZnJvbSB0aGUgdG9nZ2xlIGJ1dHRvbiwgZS5nLiBieVxuICAgKiBtb3VzZSBtb3ZlbWVudC4gSWYgdGhlIGRlbGF5IGlzIHRvbyBzaG9ydCwgdGhlIHNsaWRlcnMgZGlzYXBwZWFycyBiZWZvcmUgdGhlIG1vdXNlIHBvaW50ZXIgaGFzIHJlYWNoZWQgaXQgYW5kXG4gICAqIHRoZSB1c2VyIGlzIG5vdCBhYmxlIHRvIHVzZSBpdC5cbiAgICogRGVmYXVsdDogNTAwbXNcbiAgICovXG4gIGhpZGVEZWxheT86IG51bWJlcjtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiB0aGUgdm9sdW1lIHNsaWRlciBzaG91bGQgYmUgdmVydGljYWxseSBvciBob3Jpem9udGFsbHkgYWxpZ25lZC5cbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgdmVydGljYWw/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgY29tcG9zaXRlIHZvbHVtZSBjb250cm9sIHRoYXQgY29uc2lzdHMgb2YgYW5kIGludGVybmFsbHkgbWFuYWdlcyBhIHZvbHVtZSBjb250cm9sIGJ1dHRvbiB0aGF0IGNhbiBiZSB1c2VkXG4gKiBmb3IgbXV0aW5nLCBhbmQgYSAoZGVwZW5kaW5nIG9uIHRoZSBDU1Mgc3R5bGUsIGUuZy4gc2xpZGUtb3V0KSB2b2x1bWUgY29udHJvbCBiYXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBWb2x1bWVDb250cm9sQnV0dG9uIGV4dGVuZHMgQ29udGFpbmVyPFZvbHVtZUNvbnRyb2xCdXR0b25Db25maWc+IHtcblxuICBwcml2YXRlIHZvbHVtZVRvZ2dsZUJ1dHRvbjogVm9sdW1lVG9nZ2xlQnV0dG9uO1xuICBwcml2YXRlIHZvbHVtZVNsaWRlcjogVm9sdW1lU2xpZGVyO1xuXG4gIHByaXZhdGUgdm9sdW1lU2xpZGVySGlkZVRpbWVvdXQ6IFRpbWVvdXQ7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBWb2x1bWVDb250cm9sQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy52b2x1bWVUb2dnbGVCdXR0b24gPSBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCk7XG4gICAgdGhpcy52b2x1bWVTbGlkZXIgPSBuZXcgVm9sdW1lU2xpZGVyKHtcbiAgICAgIHZlcnRpY2FsOiBjb25maWcudmVydGljYWwgIT0gbnVsbCA/IGNvbmZpZy52ZXJ0aWNhbCA6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9KTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdm9sdW1lY29udHJvbGJ1dHRvbicsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy52b2x1bWVUb2dnbGVCdXR0b24sIHRoaXMudm9sdW1lU2xpZGVyXSxcbiAgICAgIGhpZGVEZWxheTogNTAwXG4gICAgfSwgPFZvbHVtZUNvbnRyb2xCdXR0b25Db25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB2b2x1bWVUb2dnbGVCdXR0b24gPSB0aGlzLmdldFZvbHVtZVRvZ2dsZUJ1dHRvbigpO1xuICAgIGxldCB2b2x1bWVTbGlkZXIgPSB0aGlzLmdldFZvbHVtZVNsaWRlcigpO1xuXG4gICAgdGhpcy52b2x1bWVTbGlkZXJIaWRlVGltZW91dCA9IG5ldyBUaW1lb3V0KCg8Vm9sdW1lQ29udHJvbEJ1dHRvbkNvbmZpZz50aGlzLmdldENvbmZpZygpKS5oaWRlRGVsYXksICgpID0+IHtcbiAgICAgIHZvbHVtZVNsaWRlci5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICAvKlxuICAgICAqIFZvbHVtZSBTbGlkZXIgdmlzaWJpbGl0eSBoYW5kbGluZ1xuICAgICAqXG4gICAgICogVGhlIHZvbHVtZSBzbGlkZXIgc2hhbGwgYmUgdmlzaWJsZSB3aGlsZSB0aGUgdXNlciBob3ZlcnMgdGhlIG11dGUgdG9nZ2xlIGJ1dHRvbiwgd2hpbGUgdGhlIHVzZXIgaG92ZXJzIHRoZVxuICAgICAqIHZvbHVtZSBzbGlkZXIsIGFuZCB3aGlsZSB0aGUgdXNlciBzbGlkZXMgdGhlIHZvbHVtZSBzbGlkZXIuIElmIG5vbmUgb2YgdGhlc2Ugc2l0dWF0aW9ucyBhcmUgdHJ1ZSwgdGhlIHNsaWRlclxuICAgICAqIHNoYWxsIGRpc2FwcGVhci5cbiAgICAgKi9cbiAgICBsZXQgdm9sdW1lU2xpZGVySG92ZXJlZCA9IGZhbHNlO1xuICAgIHZvbHVtZVRvZ2dsZUJ1dHRvbi5nZXREb21FbGVtZW50KCkub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAvLyBTaG93IHZvbHVtZSBzbGlkZXIgd2hlbiBtb3VzZSBlbnRlcnMgdGhlIGJ1dHRvbiBhcmVhXG4gICAgICBpZiAodm9sdW1lU2xpZGVyLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdm9sdW1lU2xpZGVyLnNob3coKTtcbiAgICAgIH1cbiAgICAgIC8vIEF2b2lkIGhpZGluZyBvZiB0aGUgc2xpZGVyIHdoZW4gYnV0dG9uIGlzIGhvdmVyZWRcbiAgICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICB9KTtcbiAgICB2b2x1bWVUb2dnbGVCdXR0b24uZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gSGlkZSBzbGlkZXIgZGVsYXllZCB3aGVuIGJ1dHRvbiBpcyBsZWZ0XG4gICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgfSk7XG4gICAgdm9sdW1lU2xpZGVyLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIC8vIFdoZW4gdGhlIHNsaWRlciBpcyBlbnRlcmVkLCBjYW5jZWwgdGhlIGhpZGUgdGltZW91dCBhY3RpdmF0ZWQgYnkgbGVhdmluZyB0aGUgYnV0dG9uXG4gICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB2b2x1bWVTbGlkZXJIb3ZlcmVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICB2b2x1bWVTbGlkZXIuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gV2hlbiBtb3VzZSBsZWF2ZXMgdGhlIHNsaWRlciwgb25seSBoaWRlIGl0IGlmIHRoZXJlIGlzIG5vIHNsaWRlIG9wZXJhdGlvbiBpbiBwcm9ncmVzc1xuICAgICAgaWYgKHZvbHVtZVNsaWRlci5pc1NlZWtpbmcoKSkge1xuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgICB9XG4gICAgICB2b2x1bWVTbGlkZXJIb3ZlcmVkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdm9sdW1lU2xpZGVyLm9uU2Vla2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBXaGVuIGEgc2xpZGUgb3BlcmF0aW9uIGlzIGRvbmUgYW5kIHRoZSBzbGlkZXIgbm90IGhvdmVyZWQgKG1vdXNlIG91dHNpZGUgc2xpZGVyKSwgaGlkZSBzbGlkZXIgZGVsYXllZFxuICAgICAgaWYgKCF2b2x1bWVTbGlkZXJIb3ZlcmVkKSB7XG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQucmVzZXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGludGVybmFsbHkgbWFuYWdlZCB2b2x1bWUgdG9nZ2xlIGJ1dHRvbi5cbiAgICogQHJldHVybnMge1ZvbHVtZVRvZ2dsZUJ1dHRvbn1cbiAgICovXG4gIGdldFZvbHVtZVRvZ2dsZUJ1dHRvbigpOiBWb2x1bWVUb2dnbGVCdXR0b24ge1xuICAgIHJldHVybiB0aGlzLnZvbHVtZVRvZ2dsZUJ1dHRvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGludGVybmFsbHkgbWFuYWdlZCB2b2x1bWUgc2lsZGVyLlxuICAgKiBAcmV0dXJucyB7Vm9sdW1lU2xpZGVyfVxuICAgKi9cbiAgZ2V0Vm9sdW1lU2xpZGVyKCk6IFZvbHVtZVNsaWRlciB7XG4gICAgcmV0dXJuIHRoaXMudm9sdW1lU2xpZGVyO1xuICB9XG59IiwiaW1wb3J0IHtTZWVrQmFyLCBTZWVrQmFyQ29uZmlnfSBmcm9tICcuL3NlZWtiYXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBWb2x1bWVTbGlkZXJ9IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWb2x1bWVTbGlkZXJDb25maWcgZXh0ZW5kcyBTZWVrQmFyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiB0aGUgdm9sdW1lIHNsaWRlciBzaG91bGQgYmUgYXV0b21hdGljYWxseSBoaWRkZW4gd2hlbiB2b2x1bWUgY29udHJvbCBpcyBwcm9oaWJpdGVkIGJ5IHRoZVxuICAgKiBicm93c2VyIG9yIHBsYXRmb3JtLiBUaGlzIGN1cnJlbnRseSBvbmx5IGFwcGxpZXMgdG8gaU9TLlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBoaWRlSWZWb2x1bWVDb250cm9sUHJvaGliaXRlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSB2b2x1bWUgc2xpZGVyIGNvbXBvbmVudCB0byBhZGp1c3QgdGhlIHBsYXllcidzIHZvbHVtZSBzZXR0aW5nLlxuICovXG5leHBvcnQgY2xhc3MgVm9sdW1lU2xpZGVyIGV4dGVuZHMgU2Vla0JhciB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZWVrQmFyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywgPFZvbHVtZVNsaWRlckNvbmZpZz57XG4gICAgICBjc3NDbGFzczogJ3VpLXZvbHVtZXNsaWRlcicsXG4gICAgICBoaWRlSWZWb2x1bWVDb250cm9sUHJvaGliaXRlZDogdHJ1ZSxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIsIGZhbHNlKTtcblxuICAgIGxldCBjb25maWcgPSA8Vm9sdW1lU2xpZGVyQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICBpZiAoY29uZmlnLmhpZGVJZlZvbHVtZUNvbnRyb2xQcm9oaWJpdGVkICYmICF0aGlzLmRldGVjdFZvbHVtZUNvbnRyb2xBdmFpbGFiaWxpdHkocGxheWVyKSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG5cbiAgICAgIC8vIFdlIGNhbiBqdXN0IHJldHVybiBmcm9tIGhlcmUsIGJlY2F1c2UgdGhlIHVzZXIgd2lsbCBuZXZlciBpbnRlcmFjdCB3aXRoIHRoZSBjb250cm9sIGFuZCBhbnkgY29uZmlndXJlZFxuICAgICAgLy8gZnVuY3Rpb25hbGl0eSB3b3VsZCBvbmx5IGVhdCByZXNvdXJjZXMgZm9yIG5vIHJlYXNvbi5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdm9sdW1lQ2hhbmdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNNdXRlZCgpKSB7XG4gICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbigwKTtcbiAgICAgICAgdGhpcy5zZXRCdWZmZXJQb3NpdGlvbigwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbihwbGF5ZXIuZ2V0Vm9sdW1lKCkpO1xuXG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24ocGxheWVyLmdldFZvbHVtZSgpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHZvbHVtZUNoYW5nZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZPTFVNRV9DSEFOR0VELCB2b2x1bWVDaGFuZ2VIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9NVVRFRCwgdm9sdW1lQ2hhbmdlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVU5NVVRFRCwgdm9sdW1lQ2hhbmdlSGFuZGxlcik7XG5cbiAgICB0aGlzLm9uU2Vla1ByZXZpZXcuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcbiAgICAgIGlmIChhcmdzLnNjcnViYmluZykge1xuICAgICAgICBwbGF5ZXIuc2V0Vm9sdW1lKGFyZ3MucG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMub25TZWVrZWQuc3Vic2NyaWJlKChzZW5kZXIsIHBlcmNlbnRhZ2UpID0+IHtcbiAgICAgIHBsYXllci5zZXRWb2x1bWUocGVyY2VudGFnZSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIHZvbHVtZSBzbGlkZXIgbWFya2VyIHdoZW4gdGhlIHBsYXllciByZXNpemVkLCBhIHNvdXJjZSBpcyBsb2FkZWQgYW5kIHBsYXllciBpcyByZWFkeSxcbiAgICAvLyBvciB0aGUgVUkgaXMgY29uZmlndXJlZC4gQ2hlY2sgdGhlIHNlZWtiYXIgZm9yIGEgZGV0YWlsZWQgZGVzY3JpcHRpb24uXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUVSX1JFU0laRSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hQbGF5YmFja1Bvc2l0aW9uKCk7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29uZmlndXJlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdCB2b2x1bWUgYmFyXG4gICAgdm9sdW1lQ2hhbmdlSGFuZGxlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXRlY3RWb2x1bWVDb250cm9sQXZhaWxhYmlsaXR5KHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJKTogYm9vbGVhbiB7XG4gICAgLy8gU3RvcmUgY3VycmVudCBwbGF5ZXIgc3RhdGUgc28gd2UgY2FuIHJlc3RvcmUgaXQgbGF0ZXJcbiAgICBsZXQgdm9sdW1lID0gcGxheWVyLmdldFZvbHVtZSgpO1xuICAgIGxldCBtdXRlZCA9IHBsYXllci5pc011dGVkKCk7XG4gICAgbGV0IHBsYXlpbmcgPSBwbGF5ZXIuaXNQbGF5aW5nKCk7XG5cbiAgICAvKlxuICAgICAqIFwiT24gaU9TIGRldmljZXMsIHRoZSBhdWRpbyBsZXZlbCBpcyBhbHdheXMgdW5kZXIgdGhlIHVzZXLigJlzIHBoeXNpY2FsIGNvbnRyb2wuIFRoZSB2b2x1bWUgcHJvcGVydHkgaXMgbm90XG4gICAgICogc2V0dGFibGUgaW4gSmF2YVNjcmlwdC4gUmVhZGluZyB0aGUgdm9sdW1lIHByb3BlcnR5IGFsd2F5cyByZXR1cm5zIDEuXCJcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5hcHBsZS5jb20vbGlicmFyeS9jb250ZW50L2RvY3VtZW50YXRpb24vQXVkaW9WaWRlby9Db25jZXB0dWFsL1VzaW5nX0hUTUw1X0F1ZGlvX1ZpZGVvL0RldmljZS1TcGVjaWZpY0NvbnNpZGVyYXRpb25zL0RldmljZS1TcGVjaWZpY0NvbnNpZGVyYXRpb25zLmh0bWxcbiAgICAgKlxuICAgICAqIE91ciBwbGF5ZXIgQVBJIHJldHVybnMgYSB2b2x1bWUgcmFuZ2Ugb2YgWzAsIDEwMF0gc28gd2UgbmVlZCB0byBjaGVjayBmb3IgMTAwIGluc3RlYWQgb2YgMS5cbiAgICAgKi9cblxuICAgIC8vIE9ubHkgaWYgdGhlIHZvbHVtZSBpcyAxMDAsIHRoZXJlJ3MgdGhlIHBvc3NpYmlsaXR5IHdlIGFyZSBvbiBhIHZvbHVtZS1jb250cm9sLXJlc3RyaWN0ZWQgaU9TIGRldmljZVxuICAgIGlmICh2b2x1bWUgPT09IDEwMCkge1xuICAgICAgLy8gV2Ugc2V0IHRoZSB2b2x1bWUgdG8gemVybyAodGhhdCdzIHRoZSBvbmx5IHZhbHVlIHRoYXQgZG9lcyBub3QgdW5tdXRlIGEgbXV0ZWQgcGxheWVyISlcbiAgICAgIHBsYXllci5zZXRWb2x1bWUoMCk7XG4gICAgICAvLyBUaGVuIHdlIGNoZWNrIGlmIHRoZSB2YWx1ZSBpcyBzdGlsbCAxMDBcbiAgICAgIGlmIChwbGF5ZXIuZ2V0Vm9sdW1lKCkgPT09IDEwMCkge1xuICAgICAgICAvLyBJZiB0aGUgdm9sdW1lIHN0YXllZCBhdCAxMDAsIHdlJ3JlIG9uIGEgdm9sdW1lLWNvbnRyb2wtcmVzdHJpY3RlZCBkZXZpY2VcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2UgY2FuIGNvbnRyb2wgdm9sdW1lLCBzbyB3ZSBtdXN0IHJlc3RvcmUgdGhlIHByZXZpb3VzIHBsYXllciBzdGF0ZVxuICAgICAgICBwbGF5ZXIuc2V0Vm9sdW1lKHZvbHVtZSk7XG4gICAgICAgIGlmIChtdXRlZCkge1xuICAgICAgICAgIHBsYXllci5tdXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYXlpbmcpIHtcbiAgICAgICAgICAvLyBUaGUgdm9sdW1lIHJlc3RvcmUgYWJvdmUgcGF1c2VzIGF1dG9wbGF5IG9uIG1vYmlsZSBkZXZpY2VzIChlLmcuIEFuZHJvaWQpIHNvIHdlIG5lZWQgdG8gcmVzdW1lIHBsYXliYWNrXG4gICAgICAgICAgLy8gKFdlIGNhbm5vdCBjaGVjayBpc1BhdXNlZCgpIGhlcmUgYmVjYXVzZSBpdCBpcyBub3Qgc2V0IHdoZW4gcGxheWJhY2sgaXMgcHJvaGliaXRlZCBieSB0aGUgbW9iaWxlIHBsYXRmb3JtKVxuICAgICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFZvbHVtZSBpcyBub3QgMTAwLCBzbyB3ZSdyZSBkZWZpbml0ZWx5IG5vdCBvbiBhIHZvbHVtZS1jb250cm9sLXJlc3RyaWN0ZWQgaU9TIGRldmljZVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgYXVkaW8gbXV0aW5nLlxuICovXG5leHBvcnQgY2xhc3MgVm9sdW1lVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS12b2x1bWV0b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ1ZvbHVtZS9NdXRlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgbXV0ZVN0YXRlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNNdXRlZCgpKSB7XG4gICAgICAgIHRoaXMub24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub2ZmKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCB2b2x1bWVMZXZlbEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAvLyBUb2dnbGUgbG93IGNsYXNzIHRvIGRpc3BsYXkgbG93IHZvbHVtZSBpY29uIGJlbG93IDUwJSB2b2x1bWVcbiAgICAgIGlmIChwbGF5ZXIuZ2V0Vm9sdW1lKCkgPCA1MCkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbG93JykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xvdycpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fTVVURUQsIG11dGVTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1VOTVVURUQsIG11dGVTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZPTFVNRV9DSEFOR0VELCB2b2x1bWVMZXZlbEhhbmRsZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTXV0ZWQoKSkge1xuICAgICAgICBwbGF5ZXIudW5tdXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIubXV0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU3RhcnR1cCBpbml0XG4gICAgbXV0ZVN0YXRlSGFuZGxlcigpO1xuICAgIHZvbHVtZUxldmVsSGFuZGxlcigpO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIHZpZGVvIHZpZXcgYmV0d2VlbiBub3JtYWwvbW9ubyBhbmQgVlIvc3RlcmVvLlxuICovXG5leHBvcnQgY2xhc3MgVlJUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXZydG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdWUidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGlzVlJDb25maWd1cmVkID0gKCkgPT4ge1xuICAgICAgLy8gVlIgYXZhaWxhYmlsaXR5IGNhbm5vdCBiZSBjaGVja2VkIHRocm91Z2ggZ2V0VlJTdGF0dXMoKSBiZWNhdXNlIGl0IGlzIGFzeW5jaHJvbm91c2x5IHBvcHVsYXRlZCBhbmQgbm90XG4gICAgICAvLyBhdmFpbGFibGUgYXQgVUkgaW5pdGlhbGl6YXRpb24uIEFzIGFuIGFsdGVybmF0aXZlLCB3ZSBjaGVjayB0aGUgVlIgc2V0dGluZ3MgaW4gdGhlIGNvbmZpZy5cbiAgICAgIC8vIFRPRE8gdXNlIGdldFZSU3RhdHVzKCkgdGhyb3VnaCBpc1ZSU3RlcmVvQXZhaWxhYmxlKCkgb25jZSB0aGUgcGxheWVyIGhhcyBiZWVuIHJld3JpdHRlbiBhbmQgdGhlIHN0YXR1cyBpc1xuICAgICAgLy8gYXZhaWxhYmxlIGluIE9OX1JFQURZXG4gICAgICBsZXQgY29uZmlnID0gcGxheWVyLmdldENvbmZpZygpO1xuICAgICAgcmV0dXJuIGNvbmZpZy5zb3VyY2UgJiYgY29uZmlnLnNvdXJjZS52ciAmJiBjb25maWcuc291cmNlLnZyLmNvbnRlbnRUeXBlICE9PSAnbm9uZSc7XG4gICAgfTtcblxuICAgIGxldCBpc1ZSU3RlcmVvQXZhaWxhYmxlID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIHBsYXllci5nZXRWUlN0YXR1cygpLmNvbnRlbnRUeXBlICE9PSAnbm9uZSc7XG4gICAgfTtcblxuICAgIGxldCB2clN0YXRlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChpc1ZSQ29uZmlndXJlZCgpICYmIGlzVlJTdGVyZW9BdmFpbGFibGUoKSkge1xuICAgICAgICB0aGlzLnNob3coKTsgLy8gc2hvdyBidXR0b24gaW4gY2FzZSBpdCBpcyBoaWRkZW5cblxuICAgICAgICBpZiAocGxheWVyLmdldFZSU3RhdHVzKCkuaXNTdGVyZW8pIHtcbiAgICAgICAgICB0aGlzLm9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vZmYoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7IC8vIGhpZGUgYnV0dG9uIGlmIG5vIHN0ZXJlbyBtb2RlIGF2YWlsYWJsZVxuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdnJCdXR0b25WaXNpYmlsaXR5SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChpc1ZSQ29uZmlndXJlZCgpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZSX01PREVfQ0hBTkdFRCwgdnJTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZSX1NURVJFT19DSEFOR0VELCB2clN0YXRlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVlJfRVJST1IsIHZyU3RhdGVIYW5kbGVyKTtcbiAgICAvLyBIaWRlIGJ1dHRvbiB3aGVuIFZSIHNvdXJjZSBnb2VzIGF3YXlcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHZyQnV0dG9uVmlzaWJpbGl0eUhhbmRsZXIpO1xuICAgIC8vIFNob3cgYnV0dG9uIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZCBhbmQgaXQncyBWUlxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB2ckJ1dHRvblZpc2liaWxpdHlIYW5kbGVyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKCFpc1ZSU3RlcmVvQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gVlIgY29udGVudCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGxheWVyLmdldFZSU3RhdHVzKCkuaXNTdGVyZW8pIHtcbiAgICAgICAgICBwbGF5ZXIuc2V0VlJTdGVyZW8oZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYXllci5zZXRWUlN0ZXJlbyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0IHN0YXJ0dXAgdmlzaWJpbGl0eVxuICAgIHZyQnV0dG9uVmlzaWJpbGl0eUhhbmRsZXIoKTtcbiAgfVxufSIsImltcG9ydCB7Q2xpY2tPdmVybGF5LCBDbGlja092ZXJsYXlDb25maWd9IGZyb20gJy4vY2xpY2tvdmVybGF5JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgQ2xpY2tPdmVybGF5fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBXYXRlcm1hcmtDb25maWcgZXh0ZW5kcyBDbGlja092ZXJsYXlDb25maWcge1xuICAvLyBub3RoaW5nIHlldFxufVxuXG4vKipcbiAqIEEgd2F0ZXJtYXJrIG92ZXJsYXkgd2l0aCBhIGNsaWNrYWJsZSBsb2dvLlxuICovXG5leHBvcnQgY2xhc3MgV2F0ZXJtYXJrIGV4dGVuZHMgQ2xpY2tPdmVybGF5IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFdhdGVybWFya0NvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktd2F0ZXJtYXJrJyxcbiAgICAgIHVybDogJ2h0dHA6Ly9iaXRtb3Zpbi5jb20nXG4gICAgfSwgPFdhdGVybWFya0NvbmZpZz50aGlzLmNvbmZpZyk7XG4gIH1cbn0iLCJleHBvcnQgaW50ZXJmYWNlIE9mZnNldCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG59XG5cbi8qKlxuICogU2ltcGxlIERPTSBtYW5pcHVsYXRpb24gYW5kIERPTSBlbGVtZW50IGV2ZW50IGhhbmRsaW5nIG1vZGVsZWQgYWZ0ZXIgalF1ZXJ5IChhcyByZXBsYWNlbWVudCBmb3IgalF1ZXJ5KS5cbiAqXG4gKiBMaWtlIGpRdWVyeSwgRE9NIG9wZXJhdGVzIG9uIHNpbmdsZSBlbGVtZW50cyBhbmQgbGlzdHMgb2YgZWxlbWVudHMuIEZvciBleGFtcGxlOiBjcmVhdGluZyBhbiBlbGVtZW50IHJldHVybnMgYSBET01cbiAqIGluc3RhbmNlIHdpdGggYSBzaW5nbGUgZWxlbWVudCwgc2VsZWN0aW5nIGVsZW1lbnRzIHJldHVybnMgYSBET00gaW5zdGFuY2Ugd2l0aCB6ZXJvLCBvbmUsIG9yIG1hbnkgZWxlbWVudHMuIFNpbWlsYXJcbiAqIHRvIGpRdWVyeSwgc2V0dGVycyB1c3VhbGx5IGFmZmVjdCBhbGwgZWxlbWVudHMsIHdoaWxlIGdldHRlcnMgb3BlcmF0ZSBvbiBvbmx5IHRoZSBmaXJzdCBlbGVtZW50LlxuICogQWxzbyBzaW1pbGFyIHRvIGpRdWVyeSwgbW9zdCBtZXRob2RzIChleGNlcHQgZ2V0dGVycykgcmV0dXJuIHRoZSBET00gaW5zdGFuY2UgZmFjaWxpdGF0aW5nIGVhc3kgY2hhaW5pbmcgb2YgbWV0aG9kXG4gKiBjYWxscy5cbiAqXG4gKiBCdWlsdCB3aXRoIHRoZSBoZWxwIG9mOiBodHRwOi8veW91bWlnaHRub3RuZWVkanF1ZXJ5LmNvbS9cbiAqL1xuZXhwb3J0IGNsYXNzIERPTSB7XG5cbiAgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGVsZW1lbnRzIHRoYXQgdGhlIGluc3RhbmNlIHdyYXBzLiBUYWtlIGNhcmUgdGhhdCBub3QgYWxsIG1ldGhvZHMgY2FuIG9wZXJhdGUgb24gdGhlIHdob2xlIGxpc3QsXG4gICAqIGdldHRlcnMgdXN1YWxseSBqdXN0IHdvcmsgb24gdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqL1xuICBwcml2YXRlIGVsZW1lbnRzOiBIVE1MRWxlbWVudFtdO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgRE9NIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB0YWdOYW1lIHRoZSB0YWcgbmFtZSBvZiB0aGUgRE9NIGVsZW1lbnRcbiAgICogQHBhcmFtIGF0dHJpYnV0ZXMgYSBsaXN0IG9mIGF0dHJpYnV0ZXMgb2YgdGhlIGVsZW1lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHRhZ05hbWU6IHN0cmluZywgYXR0cmlidXRlczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0pO1xuICAvKipcbiAgICogU2VsZWN0cyBhbGwgZWxlbWVudHMgZnJvbSB0aGUgRE9NIHRoYXQgbWF0Y2ggdGhlIHNwZWNpZmllZCBzZWxlY3Rvci5cbiAgICogQHBhcmFtIHNlbGVjdG9yIHRoZSBzZWxlY3RvciB0byBtYXRjaCBET00gZWxlbWVudHMgd2l0aFxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3I6IHN0cmluZyk7XG4gIC8qKlxuICAgKiBXcmFwcyBhIHBsYWluIEhUTUxFbGVtZW50IHdpdGggYSBET00gaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBlbGVtZW50IHRoZSBIVE1MRWxlbWVudCB0byB3cmFwIHdpdGggRE9NXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCk7XG4gIC8qKlxuICAgKiBXcmFwcyBhIGxpc3Qgb2YgcGxhaW4gSFRNTEVsZW1lbnRzIHdpdGggYSBET00gaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBlbGVtZW50IHRoZSBIVE1MRWxlbWVudHMgdG8gd3JhcCB3aXRoIERPTVxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudHM6IEhUTUxFbGVtZW50W10pO1xuICAvKipcbiAgICogV3JhcHMgdGhlIGRvY3VtZW50IHdpdGggYSBET00gaW5zdGFuY2UuIFVzZWZ1bCB0byBhdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBkb2N1bWVudC5cbiAgICogQHBhcmFtIGRvY3VtZW50IHRoZSBkb2N1bWVudCB0byB3cmFwXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihkb2N1bWVudDogRG9jdW1lbnQpO1xuICBjb25zdHJ1Y3Rvcihzb21ldGhpbmc6IHN0cmluZyB8IEhUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IERvY3VtZW50LCBhdHRyaWJ1dGVzPzogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7IC8vIFNldCB0aGUgZ2xvYmFsIGRvY3VtZW50IHRvIHRoZSBsb2NhbCBkb2N1bWVudCBmaWVsZFxuXG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBpZiAoc29tZXRoaW5nLmxlbmd0aCA+IDAgJiYgc29tZXRoaW5nWzBdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGVsZW1lbnRzID0gc29tZXRoaW5nO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHM7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBsZXQgZWxlbWVudCA9IHNvbWV0aGluZztcbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbZWxlbWVudF07XG4gICAgfVxuICAgIGVsc2UgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIERvY3VtZW50KSB7XG4gICAgICAvLyBXaGVuIGEgZG9jdW1lbnQgaXMgcGFzc2VkIGluLCB3ZSBkbyBub3QgZG8gYW55dGhpbmcgd2l0aCBpdCwgYnV0IGJ5IHNldHRpbmcgdGhpcy5lbGVtZW50cyB0byBudWxsXG4gICAgICAvLyB3ZSBnaXZlIHRoZSBldmVudCBoYW5kbGluZyBtZXRob2QgYSBtZWFucyB0byBkZXRlY3QgaWYgdGhlIGV2ZW50cyBzaG91bGQgYmUgcmVnaXN0ZXJlZCBvbiB0aGUgZG9jdW1lbnRcbiAgICAgIC8vIGluc3RlYWQgb2YgZWxlbWVudHMuXG4gICAgICB0aGlzLmVsZW1lbnRzID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSBpZiAoYXR0cmlidXRlcykge1xuICAgICAgbGV0IHRhZ05hbWUgPSBzb21ldGhpbmc7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBsZXQgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbZWxlbWVudF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHNlbGVjdG9yID0gc29tZXRoaW5nO1xuICAgICAgdGhpcy5lbGVtZW50cyA9IHRoaXMuZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdGhhdCB0aGlzIERPTSBpbnN0YW5jZSBjdXJyZW50bHkgaG9sZHMuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHNcbiAgICovXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50cyA/IHRoaXMuZWxlbWVudHMubGVuZ3RoIDogMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBIVE1MIGVsZW1lbnRzIHRoYXQgdGhpcyBET00gaW5zdGFuY2UgY3VycmVudGx5IGhvbGRzLlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX0gdGhlIHJhdyBIVE1MIGVsZW1lbnRzXG4gICAqL1xuICBnZXRFbGVtZW50cygpOiBIVE1MRWxlbWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IG1ldGhvZCBmb3IgaXRlcmF0aW5nIGFsbCBlbGVtZW50cy4gU2hvcnRzIHRoaXMuZWxlbWVudHMuZm9yRWFjaCguLi4pIHRvIHRoaXMuZm9yRWFjaCguLi4pLlxuICAgKiBAcGFyYW0gaGFuZGxlciB0aGUgaGFuZGxlciB0byBleGVjdXRlIGFuIG9wZXJhdGlvbiBvbiBhbiBlbGVtZW50XG4gICAqL1xuICBwcml2YXRlIGZvckVhY2goaGFuZGxlcjogKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBoYW5kbGVyKGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQ2hpbGRFbGVtZW50c09mRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IERvY3VtZW50LCBzZWxlY3Rvcjogc3RyaW5nKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgbGV0IGNoaWxkRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgLy8gQ29udmVydCBOb2RlTGlzdCB0byBBcnJheVxuICAgIC8vIGh0dHBzOi8vdG9kZG1vdHRvLmNvbS9hLWNvbXByZWhlbnNpdmUtZGl2ZS1pbnRvLW5vZGVsaXN0cy1hcnJheXMtY29udmVydGluZy1ub2RlbGlzdHMtYW5kLXVuZGVyc3RhbmRpbmctdGhlLWRvbS9cbiAgICByZXR1cm4gW10uc2xpY2UuY2FsbChjaGlsZEVsZW1lbnRzKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3I6IHN0cmluZyk6IEhUTUxFbGVtZW50W10ge1xuICAgIGxldCBhbGxDaGlsZEVsZW1lbnRzID0gPEhUTUxFbGVtZW50W10+W107XG5cbiAgICBpZiAodGhpcy5lbGVtZW50cykge1xuICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGFsbENoaWxkRWxlbWVudHMgPSBhbGxDaGlsZEVsZW1lbnRzLmNvbmNhdCh0aGlzLmZpbmRDaGlsZEVsZW1lbnRzT2ZFbGVtZW50KGVsZW1lbnQsIHNlbGVjdG9yKSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kQ2hpbGRFbGVtZW50c09mRWxlbWVudChkb2N1bWVudCwgc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBhbGxDaGlsZEVsZW1lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFsbCBjaGlsZCBlbGVtZW50cyBvZiBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIHN1cHBsaWVkIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgdGhlIHNlbGVjdG9yIHRvIG1hdGNoIHdpdGggY2hpbGQgZWxlbWVudHNcbiAgICogQHJldHVybnMge0RPTX0gYSBuZXcgRE9NIGluc3RhbmNlIHJlcHJlc2VudGluZyBhbGwgbWF0Y2hlZCBjaGlsZHJlblxuICAgKi9cbiAgZmluZChzZWxlY3Rvcjogc3RyaW5nKTogRE9NIHtcbiAgICBsZXQgYWxsQ2hpbGRFbGVtZW50cyA9IHRoaXMuZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIHJldHVybiBuZXcgRE9NKGFsbENoaWxkRWxlbWVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgb2YgdGhlIGlubmVyIEhUTUwgY29udGVudCBvZiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICovXG4gIGh0bWwoKTogc3RyaW5nO1xuICAvKipcbiAgICogU2V0cyB0aGUgaW5uZXIgSFRNTCBjb250ZW50IG9mIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGNvbnRlbnQgYSBzdHJpbmcgb2YgcGxhaW4gdGV4dCBvciBIVE1MIG1hcmt1cFxuICAgKi9cbiAgaHRtbChjb250ZW50OiBzdHJpbmcpOiBET007XG4gIGh0bWwoY29udGVudD86IHN0cmluZyk6IHN0cmluZyB8IERPTSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRIdG1sKGNvbnRlbnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEh0bWwoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEh0bWwoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHNbMF0uaW5uZXJIVE1MO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRIdG1sKGNvbnRlbnQ6IHN0cmluZyk6IERPTSB7XG4gICAgaWYgKGNvbnRlbnQgPT09IHVuZGVmaW5lZCB8fCBjb250ZW50ID09IG51bGwpIHtcbiAgICAgIC8vIFNldCB0byBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgaW5uZXJIVE1MIGdldHRpbmcgc2V0IHRvICd1bmRlZmluZWQnIChhbGwgYnJvd3NlcnMpIG9yICdudWxsJyAoSUU5KVxuICAgICAgY29udGVudCA9ICcnO1xuICAgIH1cblxuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBpbm5lciBIVE1MIG9mIGFsbCBlbGVtZW50cyAoZGVsZXRlcyBhbGwgY2hpbGRyZW4pLlxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgZW1wdHkoKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZmlyc3QgZm9ybSBlbGVtZW50LCBlLmcuIHRoZSBzZWxlY3RlZCB2YWx1ZSBvZiBhIHNlbGVjdCBib3ggb3IgdGhlIHRleHQgaWYgYW5cbiAgICogaW5wdXQgZmllbGQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSB2YWx1ZSBvZiBhIGZvcm0gZWxlbWVudFxuICAgKi9cbiAgdmFsKCk6IHN0cmluZyB7XG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzWzBdO1xuXG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCB8fCBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gVE9ETyBhZGQgc3VwcG9ydCBmb3IgbWlzc2luZyBmb3JtIGVsZW1lbnRzXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZhbCgpIG5vdCBzdXBwb3J0ZWQgZm9yICR7dHlwZW9mIGVsZW1lbnR9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZSBvbiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZVxuICAgKi9cbiAgYXR0cihhdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG4gIC8qKlxuICAgKiBTZXRzIGFuIGF0dHJpYnV0ZSBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGUgdGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGVcbiAgICovXG4gIGF0dHIoYXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBET007XG4gIGF0dHIoYXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IERPTSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRBdHRyKGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoYXR0cmlidXRlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEF0dHIoYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0QXR0cihhdHRyaWJ1dGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIGRhdGEgZWxlbWVudCBvbiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICogQHBhcmFtIGRhdGFBdHRyaWJ1dGUgdGhlIG5hbWUgb2YgdGhlIGRhdGEgYXR0cmlidXRlIHdpdGhvdXQgdGhlICdkYXRhLScgcHJlZml4XG4gICAqL1xuICBkYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG4gIC8qKlxuICAgKiBTZXRzIGEgZGF0YSBhdHRyaWJ1dGUgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gZGF0YUF0dHJpYnV0ZSB0aGUgbmFtZSBvZiB0aGUgZGF0YSBhdHRyaWJ1dGUgd2l0aG91dCB0aGUgJ2RhdGEtJyBwcmVmaXhcbiAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSBvZiB0aGUgZGF0YSBhdHRyaWJ1dGVcbiAgICovXG4gIGRhdGEoZGF0YUF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NO1xuICBkYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZywgdmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHwgRE9NIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldERhdGEoZGF0YUF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERhdGEoZGF0YUF0dHJpYnV0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgZGF0YUF0dHJpYnV0ZSk7XG4gIH1cblxuICBwcml2YXRlIHNldERhdGEoZGF0YUF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBkYXRhQXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBvbmUgb3IgbW9yZSBET00gZWxlbWVudHMgYXMgY2hpbGRyZW4gdG8gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gY2hpbGRFbGVtZW50cyB0aGUgY2hyaWxkIGVsZW1lbnRzIHRvIGFwcGVuZFxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgYXBwZW5kKC4uLmNoaWxkRWxlbWVudHM6IERPTVtdKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNoaWxkRWxlbWVudHMuZm9yRWFjaCgoY2hpbGRFbGVtZW50KSA9PiB7XG4gICAgICAgIGNoaWxkRWxlbWVudC5lbGVtZW50cy5mb3JFYWNoKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LmVsZW1lbnRzW2luZGV4XSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgZWxlbWVudHMgZnJvbSB0aGUgRE9NLlxuICAgKi9cbiAgcmVtb3ZlKCk6IHZvaWQge1xuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgbGV0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgZmlyc3QgZWxlbWVudCBmcm9tIHRoZSBkb2N1bWVudCdzIHRvcCBsZWZ0IGNvcm5lci5cbiAgICogQHJldHVybnMge09mZnNldH1cbiAgICovXG4gIG9mZnNldCgpOiBPZmZzZXQge1xuICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1swXTtcbiAgICBsZXQgZWxlbWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCBodG1sUmVjdCA9IGRvY3VtZW50LmJvZHkucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIC8vIFZpcnR1YWwgdmlld3BvcnQgc2Nyb2xsIGhhbmRsaW5nIChlLmcuIHBpbmNoIHpvb21lZCB2aWV3cG9ydHMgaW4gbW9iaWxlIGJyb3dzZXJzIG9yIGRlc2t0b3AgQ2hyb21lL0VkZ2UpXG4gICAgLy8gJ25vcm1hbCcgem9vbXMgYW5kIHZpcnR1YWwgdmlld3BvcnQgem9vbXMgKGFrYSBsYXlvdXQgdmlld3BvcnQpIHJlc3VsdCBpbiBkaWZmZXJlbnRcbiAgICAvLyBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHJlc3VsdHM6XG4gICAgLy8gIC0gd2l0aCBub3JtYWwgc2Nyb2xscywgdGhlIGNsaWVudFJlY3QgZGVjcmVhc2VzIHdpdGggYW4gaW5jcmVhc2UgaW4gc2Nyb2xsKFRvcHxMZWZ0KS9wYWdlKFh8WSlPZmZzZXRcbiAgICAvLyAgLSB3aXRoIHBpbmNoIHpvb20gc2Nyb2xscywgdGhlIGNsaWVudFJlY3Qgc3RheXMgdGhlIHNhbWUgd2hpbGUgc2Nyb2xsL3BhZ2VPZmZzZXQgY2hhbmdlc1xuICAgIC8vIFRoaXMgbWVhbnMsIHRoYXQgdGhlIGNvbWJpbmF0aW9uIG9mIGNsaWVudFJlY3QgKyBzY3JvbGwvcGFnZU9mZnNldCBkb2VzIG5vdCB3b3JrIHRvIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0XG4gICAgLy8gZnJvbSB0aGUgZG9jdW1lbnQncyB1cHBlciBsZWZ0IG9yaWdpbiB3aGVuIHBpbmNoIHpvb20gaXMgdXNlZC5cbiAgICAvLyBUbyB3b3JrIGFyb3VuZCB0aGlzIGlzc3VlLCB3ZSBkbyBub3QgdXNlIHNjcm9sbC9wYWdlT2Zmc2V0IGJ1dCBnZXQgdGhlIGNsaWVudFJlY3Qgb2YgdGhlIGh0bWwgZWxlbWVudCBhbmRcbiAgICAvLyBzdWJ0cmFjdCBpdCBmcm9tIHRoZSBlbGVtZW50J3MgcmVjdCwgd2hpY2ggYWx3YXlzIHJlc3VsdHMgaW4gdGhlIG9mZnNldCBmcm9tIHRoZSBkb2N1bWVudCBvcmlnaW4uXG4gICAgLy8gTk9URTogdGhlIGN1cnJlbnQgd2F5IG9mIG9mZnNldCBjYWxjdWxhdGlvbiB3YXMgaW1wbGVtZW50ZWQgc3BlY2lmaWNhbGx5IHRvIHRyYWNrIGV2ZW50IHBvc2l0aW9ucyBvbiB0aGVcbiAgICAvLyBzZWVrIGJhciwgYW5kIGl0IG1pZ2h0IGJyZWFrIGNvbXBhdGliaWxpdHkgd2l0aCBqUXVlcnkncyBvZmZzZXQoKSBtZXRob2QuIElmIHRoaXMgZXZlciB0dXJucyBvdXQgdG8gYmUgYVxuICAgIC8vIHByb2JsZW0sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSByZXZlcnRlZCB0byB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBvZmZzZXQgY2FsY3VsYXRpb24gbW92ZWQgdG8gdGhlIHNlZWsgYmFyLlxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogZWxlbWVudFJlY3QudG9wIC0gaHRtbFJlY3QudG9wLFxuICAgICAgbGVmdDogZWxlbWVudFJlY3QubGVmdCAtIGh0bWxSZWN0LmxlZnRcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgd2lkdGggb2YgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICovXG4gIHdpZHRoKCk6IG51bWJlciB7XG4gICAgLy8gVE9ETyBjaGVjayBpZiB0aGlzIGlzIHRoZSBzYW1lIGFzIGpRdWVyeSdzIHdpZHRoKCkgKHByb2JhYmx5IG5vdClcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5vZmZzZXRXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBoZWlnaHQgb2YgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICovXG4gIGhlaWdodCgpOiBudW1iZXIge1xuICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhpcyBpcyB0aGUgc2FtZSBhcyBqUXVlcnkncyBoZWlnaHQoKSAocHJvYmFibHkgbm90KVxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzWzBdLm9mZnNldEhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhbiBldmVudCBoYW5kbGVyIHRvIG9uZSBvciBtb3JlIGV2ZW50cyBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBldmVudE5hbWUgdGhlIGV2ZW50IG5hbWUgKG9yIG11bHRpcGxlIG5hbWVzIHNlcGFyYXRlZCBieSBzcGFjZSkgdG8gbGlzdGVuIHRvXG4gICAqIEBwYXJhbSBldmVudEhhbmRsZXIgdGhlIGV2ZW50IGhhbmRsZXIgdG8gY2FsbCB3aGVuIHRoZSBldmVudCBmaXJlc1xuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgb24oZXZlbnROYW1lOiBzdHJpbmcsIGV2ZW50SGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCk6IERPTSB7XG4gICAgbGV0IGV2ZW50cyA9IGV2ZW50TmFtZS5zcGxpdCgnICcpO1xuXG4gICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5lbGVtZW50cyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZXZlbnRIYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBldmVudCBoYW5kbGVyIGZyb20gb25lIG9yIG1vcmUgZXZlbnRzIG9uIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGV2ZW50TmFtZSB0aGUgZXZlbnQgbmFtZSAob3IgbXVsdGlwbGUgbmFtZXMgc2VwYXJhdGVkIGJ5IHNwYWNlKSB0byByZW1vdmUgdGhlIGhhbmRsZXIgZnJvbVxuICAgKiBAcGFyYW0gZXZlbnRIYW5kbGVyIHRoZSBldmVudCBoYW5kbGVyIHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgb2ZmKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3QpOiBET00ge1xuICAgIGxldCBldmVudHMgPSBldmVudE5hbWUuc3BsaXQoJyAnKTtcblxuICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudEhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIGRpc3BhdGNoIGJyb3dzZXIgZXZlbnRzXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgZGlzcGF0Y2hFdmVudChldmVudDogRXZlbnQpOiBhbnkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRzID09IG51bGwpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBkaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudChkYXRhOiBhbnkpOiBhbnkge1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3NtYXNoY3V0cGxheWVydWknLCB7ZGV0YWlsOiBkYXRhLCBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiB0cnVlfSkpXG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgc3BlY2lmaWVkIGNsYXNzKGVzKSB0byBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgdGhlIGNsYXNzKGVzKSB0byBhZGQsIG11bHRpcGxlIGNsYXNzZXMgc2VwYXJhdGVkIGJ5IHNwYWNlXG4gICAqIEByZXR1cm5zIHtET019XG4gICAqL1xuICBhZGRDbGFzcyhjbGFzc05hbWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlZCB0aGUgc3BlY2lmaWVkIGNsYXNzKGVzKSBmcm9tIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGNsYXNzTmFtZSB0aGUgY2xhc3MoZXMpIHRvIHJlbW92ZSwgbXVsdGlwbGUgY2xhc3NlcyBzZXBhcmF0ZWQgYnkgc3BhY2VcbiAgICogQHJldHVybnMge0RPTX1cbiAgICovXG4gIHJlbW92ZUNsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIGNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbnkgb2YgdGhlIGVsZW1lbnRzIGhhcyB0aGUgc3BlY2lmaWVkIGNsYXNzLlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lIHRoZSBjbGFzcyBuYW1lIHRvIGNoZWNrXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIG9uZSBvZiB0aGUgZWxlbWVudHMgaGFzIHRoZSBjbGFzcyBhdHRhY2hlZCwgZWxzZSBpZiBubyBlbGVtZW50IGhhcyBpdCBhdHRhY2hlZFxuICAgKi9cbiAgaGFzQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBsZXQgaGFzQ2xhc3MgPSBmYWxzZTtcblxuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICAgICAgLy8gU2luY2Ugd2UgYXJlIGluc2lkZSBhIGhhbmRsZXIsIHdlIGNhbid0IGp1c3QgJ3JldHVybiB0cnVlJy4gSW5zdGVhZCwgd2Ugc2F2ZSBpdCB0byBhIHZhcmlhYmxlXG4gICAgICAgICAgLy8gYW5kIHJldHVybiBpdCBhdCB0aGUgZW5kIG9mIHRoZSBmdW5jdGlvbiBib2R5LlxuICAgICAgICAgIGhhc0NsYXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChuZXcgUmVnRXhwKCcoXnwgKScgKyBjbGFzc05hbWUgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGVsZW1lbnQuY2xhc3NOYW1lKSkge1xuICAgICAgICAgIC8vIFNlZSBjb21tZW50IGFib3ZlXG4gICAgICAgICAgaGFzQ2xhc3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaGFzQ2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBDU1MgcHJvcGVydHkgb2YgdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgdGhlIG5hbWUgb2YgdGhlIENTUyBwcm9wZXJ0eSB0byByZXRyaWV2ZSB0aGUgdmFsdWUgb2ZcbiAgICovXG4gIGNzcyhwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIENTUyBwcm9wZXJ0eSBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgdGhlIG5hbWUgb2YgdGhlIENTUyBwcm9wZXJ0eSB0byBzZXQgdGhlIHZhbHVlIGZvclxuICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIHNldCBmb3IgdGhlIGdpdmVuIENTUyBwcm9wZXJ0eVxuICAgKi9cbiAgY3NzKHByb3BlcnR5TmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NO1xuICAvKipcbiAgICogU2V0cyBhIGNvbGxlY3Rpb24gb2YgQ1NTIHByb3BlcnRpZXMgYW5kIHRoZWlyIHZhbHVlcyBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBwcm9wZXJ0eVZhbHVlQ29sbGVjdGlvbiBhbiBvYmplY3QgY29udGFpbmluZyBwYWlycyBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgdGhlaXIgdmFsdWVzXG4gICAqL1xuICBjc3MocHJvcGVydHlWYWx1ZUNvbGxlY3Rpb246IHsgW3Byb3BlcnR5TmFtZTogc3RyaW5nXTogc3RyaW5nIH0pOiBET007XG4gIGNzcyhwcm9wZXJ0eU5hbWVPckNvbGxlY3Rpb246IHN0cmluZyB8IHsgW3Byb3BlcnR5TmFtZTogc3RyaW5nXTogc3RyaW5nIH0sIHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IERPTSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWVPckNvbGxlY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lT3JDb2xsZWN0aW9uO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDc3MocHJvcGVydHlOYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3NzKHByb3BlcnR5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHByb3BlcnR5VmFsdWVDb2xsZWN0aW9uID0gcHJvcGVydHlOYW1lT3JDb2xsZWN0aW9uO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0Q3NzQ29sbGVjdGlvbihwcm9wZXJ0eVZhbHVlQ29sbGVjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRDc3MocHJvcGVydHlOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnRzWzBdKVs8YW55PnByb3BlcnR5TmFtZV07XG4gIH1cblxuICBwcml2YXRlIHNldENzcyhwcm9wZXJ0eU5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyA8YW55PiBjYXN0IHRvIHJlc29sdmUgVFM3MDE1OiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNjYyNzExNC8zNzAyNTJcbiAgICAgIGVsZW1lbnQuc3R5bGVbPGFueT5wcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIHNldENzc0NvbGxlY3Rpb24ocnVsZVZhbHVlQ29sbGVjdGlvbjogeyBbcnVsZU5hbWU6IHN0cmluZ106IHN0cmluZyB9KTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0NDkwNTczLzM3MDI1MlxuICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBydWxlVmFsdWVDb2xsZWN0aW9uKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQge0FycmF5VXRpbHN9IGZyb20gJy4vdXRpbHMnO1xuLyoqXG4gKiBGdW5jdGlvbiBpbnRlcmZhY2UgZm9yIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUge0BsaW5rIEV2ZW50RGlzcGF0Y2hlcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+IHtcbiAgKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzKTogdm9pZDtcbn1cblxuLyoqXG4gKiBFbXB0eSB0eXBlIGZvciBjcmVhdGluZyB7QGxpbmsgRXZlbnREaXNwYXRjaGVyIGV2ZW50IGRpc3BhdGNoZXJzfSB0aGF0IGRvIG5vdCBjYXJyeSBhbnkgYXJndW1lbnRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5vQXJncyB7XG59XG5cbi8qKlxuICogRXZlbnQgYXJncyBmb3IgYW4gZXZlbnQgdGhhdCBjYW4gYmUgY2FuY2VsZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FuY2VsRXZlbnRBcmdzIGV4dGVuZHMgTm9BcmdzIHtcbiAgLyoqXG4gICAqIEdldHMgb3Igc2V0cyBhIGZsYWcgd2hldGhlciB0aGUgZXZlbnQgc2hvdWxkIGJlIGNhbmNlbGVkLlxuICAgKi9cbiAgY2FuY2VsPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBQdWJsaWMgaW50ZXJmYWNlIHRoYXQgcmVwcmVzZW50cyBhbiBldmVudC4gQ2FuIGJlIHVzZWQgdG8gc3Vic2NyaWJlIHRvIGFuZCB1bnN1YnNjcmliZSBmcm9tIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudDxTZW5kZXIsIEFyZ3M+IHtcbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhpcyBldmVudCBkaXNwYXRjaGVyLlxuICAgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGFkZFxuICAgKi9cbiAgc3Vic2NyaWJlKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoaXMgZXZlbnQgZGlzcGF0Y2hlciB0aGF0IGlzIG9ubHkgY2FsbGVkIG9uY2UuXG4gICAqIEBwYXJhbSBsaXN0ZW5lciB0aGUgbGlzdGVuZXIgdG8gYWRkXG4gICAqL1xuICBzdWJzY3JpYmVPbmNlKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoaXMgZXZlbnQgZGlzcGF0Y2hlciB0aGF0IHdpbGwgYmUgY2FsbGVkIGF0IGEgbGltaXRlZCByYXRlIHdpdGggYSBtaW5pbXVtXG4gICAqIGludGVydmFsIG9mIHRoZSBzcGVjaWZpZWQgbWlsbGlzZWNvbmRzLlxuICAgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGFkZFxuICAgKiBAcGFyYW0gcmF0ZU1zIHRoZSByYXRlIGluIG1pbGxpc2Vjb25kcyB0byB3aGljaCBjYWxsaW5nIG9mIHRoZSBsaXN0ZW5lcnMgc2hvdWxkIGJlIGxpbWl0ZWRcbiAgICovXG4gIHN1YnNjcmliZVJhdGVMaW1pdGVkKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4sIHJhdGVNczogbnVtYmVyKTogdm9pZDtcblxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIGEgc3Vic2NyaWJlZCBldmVudCBsaXN0ZW5lciBmcm9tIHRoaXMgZGlzcGF0Y2hlci5cbiAgICogQHBhcmFtIGxpc3RlbmVyIHRoZSBsaXN0ZW5lciB0byByZW1vdmVcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGxpc3RlbmVyIHdhcyBzdWNjZXNzZnVsbHkgdW5zdWJzY3JpYmVkLCBmYWxzZSBpZiBpdCBpc24ndCBzdWJzY3JpYmVkIG9uIHRoaXNcbiAgICogICBkaXNwYXRjaGVyXG4gICAqL1xuICB1bnN1YnNjcmliZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBFdmVudCBkaXNwYXRjaGVyIHRvIHN1YnNjcmliZSBhbmQgdHJpZ2dlciBldmVudHMuIEVhY2ggZXZlbnQgc2hvdWxkIGhhdmUgaXRzIG93biBkaXNwYXRjaGVyLlxuICovXG5leHBvcnQgY2xhc3MgRXZlbnREaXNwYXRjaGVyPFNlbmRlciwgQXJncz4gaW1wbGVtZW50cyBFdmVudDxTZW5kZXIsIEFyZ3M+IHtcblxuICBwcml2YXRlIGxpc3RlbmVyczogRXZlbnRMaXN0ZW5lcldyYXBwZXI8U2VuZGVyLCBBcmdzPltdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jfVxuICAgKi9cbiAgc3Vic2NyaWJlKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4pIHtcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKG5ldyBFdmVudExpc3RlbmVyV3JhcHBlcihsaXN0ZW5lcikpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvY31cbiAgICovXG4gIHN1YnNjcmliZU9uY2UobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPikge1xuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobmV3IEV2ZW50TGlzdGVuZXJXcmFwcGVyKGxpc3RlbmVyLCB0cnVlKSk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jfVxuICAgKi9cbiAgc3Vic2NyaWJlUmF0ZUxpbWl0ZWQobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiwgcmF0ZU1zOiBudW1iZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKG5ldyBSYXRlTGltaXRlZEV2ZW50TGlzdGVuZXJXcmFwcGVyKGxpc3RlbmVyLCByYXRlTXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2N9XG4gICAqL1xuICB1bnN1YnNjcmliZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KTogYm9vbGVhbiB7XG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGxpc3RlbmVycywgY29tcGFyZSB3aXRoIHBhcmFtZXRlciwgYW5kIHJlbW92ZSBpZiBmb3VuZFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzdWJzY3JpYmVkTGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyc1tpXTtcbiAgICAgIGlmIChzdWJzY3JpYmVkTGlzdGVuZXIubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIEFycmF5VXRpbHMucmVtb3ZlKHRoaXMubGlzdGVuZXJzLCBzdWJzY3JpYmVkTGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIGZyb20gdGhpcyBkaXNwYXRjaGVyLlxuICAgKi9cbiAgdW5zdWJzY3JpYmVBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGFuIGV2ZW50IHRvIGFsbCBzdWJzY3JpYmVkIGxpc3RlbmVycy5cbiAgICogQHBhcmFtIHNlbmRlciB0aGUgc291cmNlIG9mIHRoZSBldmVudFxuICAgKiBAcGFyYW0gYXJncyB0aGUgYXJndW1lbnRzIGZvciB0aGUgZXZlbnRcbiAgICovXG4gIGRpc3BhdGNoKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzID0gbnVsbCkge1xuICAgIGxldCBsaXN0ZW5lcnNUb1JlbW92ZSA9IFtdO1xuXG4gICAgLy8gQ2FsbCBldmVyeSBsaXN0ZW5lclxuICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICBsaXN0ZW5lci5maXJlKHNlbmRlciwgYXJncyk7XG5cbiAgICAgIGlmIChsaXN0ZW5lci5pc09uY2UoKSkge1xuICAgICAgICBsaXN0ZW5lcnNUb1JlbW92ZS5wdXNoKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgb25lLXRpbWUgbGlzdGVuZXJcbiAgICBmb3IgKGxldCBsaXN0ZW5lclRvUmVtb3ZlIG9mIGxpc3RlbmVyc1RvUmVtb3ZlKSB7XG4gICAgICBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmxpc3RlbmVycywgbGlzdGVuZXJUb1JlbW92ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGV2ZW50IHRoYXQgdGhpcyBkaXNwYXRjaGVyIG1hbmFnZXMgYW5kIG9uIHdoaWNoIGxpc3RlbmVycyBjYW4gc3Vic2NyaWJlIGFuZCB1bnN1YnNjcmliZSBldmVudCBoYW5kbGVycy5cbiAgICogQHJldHVybnMge0V2ZW50fVxuICAgKi9cbiAgZ2V0RXZlbnQoKTogRXZlbnQ8U2VuZGVyLCBBcmdzPiB7XG4gICAgLy8gRm9yIG5vdywganVzdCBjYXN0IHRoZSBldmVudCBkaXNwYXRjaGVyIHRvIHRoZSBldmVudCBpbnRlcmZhY2UuIEF0IHNvbWUgcG9pbnQgaW4gdGhlIGZ1dHVyZSB3aGVuIHRoZVxuICAgIC8vIGNvZGViYXNlIGdyb3dzLCBpdCBtaWdodCBtYWtlIHNlbnNlIHRvIHNwbGl0IHRoZSBkaXNwYXRjaGVyIGludG8gc2VwYXJhdGUgZGlzcGF0Y2hlciBhbmQgZXZlbnQgY2xhc3Nlcy5cbiAgICByZXR1cm4gPEV2ZW50PFNlbmRlciwgQXJncz4+dGhpcztcbiAgfVxufVxuXG4vKipcbiAqIEEgYmFzaWMgZXZlbnQgbGlzdGVuZXIgd3JhcHBlciB0byBtYW5hZ2UgbGlzdGVuZXJzIHdpdGhpbiB0aGUge0BsaW5rIEV2ZW50RGlzcGF0Y2hlcn0uIFRoaXMgaXMgYSAncHJpdmF0ZScgY2xhc3NcbiAqIGZvciBpbnRlcm5hbCBkaXNwYXRjaGVyIHVzZSBhbmQgaXQgaXMgdGhlcmVmb3JlIG5vdCBleHBvcnRlZC5cbiAqL1xuY2xhc3MgRXZlbnRMaXN0ZW5lcldyYXBwZXI8U2VuZGVyLCBBcmdzPiB7XG5cbiAgcHJpdmF0ZSBldmVudExpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz47XG4gIHByaXZhdGUgb25jZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+LCBvbmNlOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICB0aGlzLm9uY2UgPSBvbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdyYXBwZWQgZXZlbnQgbGlzdGVuZXIuXG4gICAqIEByZXR1cm5zIHtFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz59XG4gICAqL1xuICBnZXQgbGlzdGVuZXIoKTogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudExpc3RlbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSB3cmFwcGVkIGV2ZW50IGxpc3RlbmVyIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cy5cbiAgICogQHBhcmFtIHNlbmRlclxuICAgKiBAcGFyYW0gYXJnc1xuICAgKi9cbiAgZmlyZShzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncykge1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcihzZW5kZXIsIGFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGlzIGxpc3RlbmVyIGlzIHNjaGVkdWxlZCB0byBiZSBjYWxsZWQgb25seSBvbmNlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gb25jZSBpZiB0cnVlXG4gICAqL1xuICBpc09uY2UoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub25jZTtcbiAgfVxufVxuXG4vKipcbiAqIEV4dGVuZHMgdGhlIGJhc2ljIHtAbGluayBFdmVudExpc3RlbmVyV3JhcHBlcn0gd2l0aCByYXRlLWxpbWl0aW5nIGZ1bmN0aW9uYWxpdHkuXG4gKi9cbmNsYXNzIFJhdGVMaW1pdGVkRXZlbnRMaXN0ZW5lcldyYXBwZXI8U2VuZGVyLCBBcmdzPiBleHRlbmRzIEV2ZW50TGlzdGVuZXJXcmFwcGVyPFNlbmRlciwgQXJncz4ge1xuXG4gIHByaXZhdGUgcmF0ZU1zOiBudW1iZXI7XG4gIHByaXZhdGUgcmF0ZUxpbWl0aW5nRXZlbnRMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+O1xuXG4gIHByaXZhdGUgbGFzdEZpcmVUaW1lOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiwgcmF0ZU1zOiBudW1iZXIpIHtcbiAgICBzdXBlcihsaXN0ZW5lcik7IC8vIHNldHMgdGhlIGV2ZW50IGxpc3RlbmVyIHNpbmtcblxuICAgIHRoaXMucmF0ZU1zID0gcmF0ZU1zO1xuICAgIHRoaXMubGFzdEZpcmVUaW1lID0gMDtcblxuICAgIC8vIFdyYXAgdGhlIGV2ZW50IGxpc3RlbmVyIHdpdGggYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCBkb2VzIHRoZSByYXRlLWxpbWl0aW5nXG4gICAgdGhpcy5yYXRlTGltaXRpbmdFdmVudExpc3RlbmVyID0gKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzKSA9PiB7XG4gICAgICBpZiAoRGF0ZS5ub3coKSAtIHRoaXMubGFzdEZpcmVUaW1lID4gdGhpcy5yYXRlTXMpIHtcbiAgICAgICAgLy8gT25seSBpZiBlbm91Z2ggdGltZSBzaW5jZSB0aGUgcHJldmlvdXMgY2FsbCBoYXMgcGFzc2VkLCBjYWxsIHRoZVxuICAgICAgICAvLyBhY3R1YWwgZXZlbnQgbGlzdGVuZXIgYW5kIHJlY29yZCB0aGUgY3VycmVudCB0aW1lXG4gICAgICAgIHRoaXMuZmlyZVN1cGVyKHNlbmRlciwgYXJncyk7XG4gICAgICAgIHRoaXMubGFzdEZpcmVUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBmaXJlU3VwZXIoc2VuZGVyOiBTZW5kZXIsIGFyZ3M6IEFyZ3MpIHtcbiAgICAvLyBGaXJlIHRoZSBhY3R1YWwgZXh0ZXJuYWwgZXZlbnQgbGlzdGVuZXJcbiAgICBzdXBlci5maXJlKHNlbmRlciwgYXJncyk7XG4gIH1cblxuICBmaXJlKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzKSB7XG4gICAgLy8gRmlyZSB0aGUgaW50ZXJuYWwgcmF0ZS1saW1pdGluZyBsaXN0ZW5lciBpbnN0ZWFkIG9mIHRoZSBleHRlcm5hbCBldmVudCBsaXN0ZW5lclxuICAgIHRoaXMucmF0ZUxpbWl0aW5nRXZlbnRMaXN0ZW5lcihzZW5kZXIsIGFyZ3MpO1xuICB9XG59IiwiZXhwb3J0IG5hbWVzcGFjZSBHdWlkIHtcblxuICBsZXQgZ3VpZCA9IDE7XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgcmV0dXJuIGd1aWQrKztcbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD0ncGxheWVyLmQudHMnIC8+XG5pbXBvcnQge1VJTWFuYWdlciwgVUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4vdWltYW5hZ2VyJztcbmltcG9ydCB7QnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvYnV0dG9uJztcbmltcG9ydCB7Q29udHJvbEJhcn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRyb2xiYXInO1xuaW1wb3J0IHtGdWxsc2NyZWVuVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvZnVsbHNjcmVlbnRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0h1Z2VQbGF5YmFja1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2h1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1BsYXliYWNrVGltZUxhYmVsLCBQbGF5YmFja1RpbWVMYWJlbE1vZGV9IGZyb20gJy4vY29tcG9uZW50cy9wbGF5YmFja3RpbWVsYWJlbCc7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvcGxheWJhY2t0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtTZWVrQmFyfSBmcm9tICcuL2NvbXBvbmVudHMvc2Vla2Jhcic7XG5pbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3NlbGVjdGJveCc7XG5pbXBvcnQge1NldHRpbmdzUGFuZWwsIFNldHRpbmdzUGFuZWxJdGVtfSBmcm9tICcuL2NvbXBvbmVudHMvc2V0dGluZ3NwYW5lbCc7XG5pbXBvcnQge1NldHRpbmdzVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvc2V0dGluZ3N0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtWaWRlb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy92aWRlb3F1YWxpdHlzZWxlY3Rib3gnO1xuaW1wb3J0IHtWb2x1bWVUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy92b2x1bWV0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtWUlRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZydG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7V2F0ZXJtYXJrfSBmcm9tICcuL2NvbXBvbmVudHMvd2F0ZXJtYXJrJztcbmltcG9ydCB7VUlDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy91aWNvbnRhaW5lcic7XG5pbXBvcnQge0NvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcic7XG5pbXBvcnQge0xhYmVsfSBmcm9tICcuL2NvbXBvbmVudHMvbGFiZWwnO1xuaW1wb3J0IHtBdWRpb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9hdWRpb3F1YWxpdHlzZWxlY3Rib3gnO1xuaW1wb3J0IHtBdWRpb1RyYWNrU2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvYXVkaW90cmFja3NlbGVjdGJveCc7XG5pbXBvcnQge0Nhc3RTdGF0dXNPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHN0YXR1c292ZXJsYXknO1xuaW1wb3J0IHtDYXN0VG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbXBvbmVudCc7XG5pbXBvcnQge0Vycm9yTWVzc2FnZU92ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvcm1lc3NhZ2VvdmVybGF5JztcbmltcG9ydCB7UmVjb21tZW5kYXRpb25PdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvcmVjb21tZW5kYXRpb25vdmVybGF5JztcbmltcG9ydCB7U2Vla0JhckxhYmVsfSBmcm9tICcuL2NvbXBvbmVudHMvc2Vla2JhcmxhYmVsJztcbmltcG9ydCB7U3VidGl0bGVPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvc3VidGl0bGVvdmVybGF5JztcbmltcG9ydCB7U3VidGl0bGVTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9zdWJ0aXRsZXNlbGVjdGJveCc7XG5pbXBvcnQge1RpdGxlQmFyfSBmcm9tICcuL2NvbXBvbmVudHMvdGl0bGViYXInO1xuaW1wb3J0IHtWb2x1bWVDb250cm9sQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1lY29udHJvbGJ1dHRvbic7XG5pbXBvcnQge0NsaWNrT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2NsaWNrb3ZlcmxheSc7XG5pbXBvcnQge0FkU2tpcEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Fkc2tpcGJ1dHRvbic7XG5pbXBvcnQge0FkTWVzc2FnZUxhYmVsfSBmcm9tICcuL2NvbXBvbmVudHMvYWRtZXNzYWdlbGFiZWwnO1xuaW1wb3J0IHtBZENsaWNrT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2FkY2xpY2tvdmVybGF5JztcbmltcG9ydCB7UGxheWJhY2tTcGVlZFNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrc3BlZWRzZWxlY3Rib3gnO1xuaW1wb3J0IHtIdWdlUmVwbGF5QnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvaHVnZXJlcGxheWJ1dHRvbic7XG5pbXBvcnQge0J1ZmZlcmluZ092ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9idWZmZXJpbmdvdmVybGF5JztcbmltcG9ydCB7Q2FzdFVJQ29udGFpbmVyfSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHVpY29udGFpbmVyJztcbmltcG9ydCB7UGxheWJhY2tUb2dnbGVPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvcGxheWJhY2t0b2dnbGVvdmVybGF5JztcbmltcG9ydCB7Q2xvc2VCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9jbG9zZWJ1dHRvbic7XG5pbXBvcnQge01ldGFkYXRhTGFiZWwsIE1ldGFkYXRhTGFiZWxDb250ZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbWV0YWRhdGFsYWJlbCc7XG5pbXBvcnQge0FpclBsYXlUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9haXJwbGF5dG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7Vm9sdW1lU2xpZGVyfSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1lc2xpZGVyJztcbmltcG9ydCB7UGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3BpY3R1cmVpbnBpY3R1cmV0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtTcGFjZXJ9IGZyb20gJy4vY29tcG9uZW50cy9zcGFjZXInO1xuaW1wb3J0IHtBcnJheVV0aWxzLCBTdHJpbmdVdGlscywgUGxheWVyVXRpbHMsIFVJVXRpbHMsIEJyb3dzZXJVdGlsc30gZnJvbSAnLi91dGlscyc7XG5cbi8vIE9iamVjdC5hc3NpZ24gcG9seWZpbGwgZm9yIEVTNS9JRTlcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RlL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykge1xuICBPYmplY3QuYXNzaWduID0gZnVuY3Rpb24odGFyZ2V0OiBhbnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcbiAgICB9XG5cbiAgICB0YXJnZXQgPSBPYmplY3QodGFyZ2V0KTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgbGV0IHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICBpZiAoc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xufVxuXG4vLyBFeHBvc2UgY2xhc3NlcyB0byB3aW5kb3dcbih3aW5kb3cgYXMgYW55KS5iaXRtb3Zpbi5wbGF5ZXJ1aSA9IHtcbiAgLy8gTWFuYWdlbWVudFxuICBVSU1hbmFnZXIsXG4gIFVJSW5zdGFuY2VNYW5hZ2VyLFxuICAvLyBVdGlsc1xuICBBcnJheVV0aWxzLFxuICBTdHJpbmdVdGlscyxcbiAgUGxheWVyVXRpbHMsXG4gIFVJVXRpbHMsXG4gIEJyb3dzZXJVdGlscyxcbiAgLy8gQ29tcG9uZW50c1xuICBBZENsaWNrT3ZlcmxheSxcbiAgQWRNZXNzYWdlTGFiZWwsXG4gIEFkU2tpcEJ1dHRvbixcbiAgQWlyUGxheVRvZ2dsZUJ1dHRvbixcbiAgQXVkaW9RdWFsaXR5U2VsZWN0Qm94LFxuICBBdWRpb1RyYWNrU2VsZWN0Qm94LFxuICBCdWZmZXJpbmdPdmVybGF5LFxuICBCdXR0b24sXG4gIENhc3RTdGF0dXNPdmVybGF5LFxuICBDYXN0VG9nZ2xlQnV0dG9uLFxuICBDYXN0VUlDb250YWluZXIsXG4gIENsaWNrT3ZlcmxheSxcbiAgQ2xvc2VCdXR0b24sXG4gIENvbXBvbmVudCxcbiAgQ29udGFpbmVyLFxuICBDb250cm9sQmFyLFxuICBFcnJvck1lc3NhZ2VPdmVybGF5LFxuICBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uLFxuICBIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24sXG4gIEh1Z2VSZXBsYXlCdXR0b24sXG4gIExhYmVsLFxuICBNZXRhZGF0YUxhYmVsLFxuICBNZXRhZGF0YUxhYmVsQ29udGVudCxcbiAgUGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbixcbiAgUGxheWJhY2tTcGVlZFNlbGVjdEJveCxcbiAgUGxheWJhY2tUaW1lTGFiZWwsXG4gIFBsYXliYWNrVGltZUxhYmVsTW9kZSxcbiAgUGxheWJhY2tUb2dnbGVCdXR0b24sXG4gIFBsYXliYWNrVG9nZ2xlT3ZlcmxheSxcbiAgUmVjb21tZW5kYXRpb25PdmVybGF5LFxuICBTZWVrQmFyLFxuICBTZWVrQmFyTGFiZWwsXG4gIFNlbGVjdEJveCxcbiAgU2V0dGluZ3NQYW5lbCxcbiAgU2V0dGluZ3NQYW5lbEl0ZW0sXG4gIFNldHRpbmdzVG9nZ2xlQnV0dG9uLFxuICBTcGFjZXIsXG4gIFN1YnRpdGxlT3ZlcmxheSxcbiAgU3VidGl0bGVTZWxlY3RCb3gsXG4gIFRpdGxlQmFyLFxuICBUb2dnbGVCdXR0b24sXG4gIFVJQ29udGFpbmVyLFxuICBWaWRlb1F1YWxpdHlTZWxlY3RCb3gsXG4gIFZvbHVtZUNvbnRyb2xCdXR0b24sXG4gIFZvbHVtZVNsaWRlcixcbiAgVm9sdW1lVG9nZ2xlQnV0dG9uLFxuICBWUlRvZ2dsZUJ1dHRvbixcbiAgV2F0ZXJtYXJrLFxufTsiLCIvLyBUT0RPIGNoYW5nZSB0byBpbnRlcm5hbCAobm90IGV4cG9ydGVkKSBjbGFzcywgaG93IHRvIHVzZSBpbiBvdGhlciBmaWxlcz9cbi8qKlxuICogRXhlY3V0ZXMgYSBjYWxsYmFjayBhZnRlciBhIHNwZWNpZmllZCBhbW91bnQgb2YgdGltZSxcbiAqIG9wdGlvbmFsbHkgcmVwZWF0ZWRseSB1bnRpbCBzdG9wcGVkLiBXaGVuIGRlbGF5IGlzIDw9IDBcbiAqIHRoZSB0aW1lb3V0IGlzIGRpc2FibGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW1lb3V0IHtcblxuICBwcml2YXRlIGRlbGF5OiBudW1iZXI7XG4gIHByaXZhdGUgY2FsbGJhY2s6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgcmVwZWF0OiBib29sZWFuO1xuICBwcml2YXRlIHRpbWVvdXRIYW5kbGU6IG51bWJlcjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyB0aW1lb3V0IGNhbGxiYWNrIGhhbmRsZXIuXG4gICAqIEBwYXJhbSBkZWxheSB0aGUgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSBjYWxsYmFjayBzaG91bGQgYmUgZXhlY3V0ZWRcbiAgICogQHBhcmFtIGNhbGxiYWNrIHRoZSBjYWxsYmFjayB0byBleGVjdXRlIGFmdGVyIHRoZSBkZWxheSB0aW1lXG4gICAqIEBwYXJhbSByZXBlYXQgaWYgdHJ1ZSwgY2FsbCB0aGUgY2FsbGJhY2sgcmVwZWF0ZWRseSBpbiBkZWxheSBpbnRlcnZhbHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlbGF5OiBudW1iZXIsIGNhbGxiYWNrOiAoKSA9PiB2b2lkLCByZXBlYXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgdGhpcy50aW1lb3V0SGFuZGxlID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIHRpbWVvdXQgYW5kIGNhbGxzIHRoZSBjYWxsYmFjayB3aGVuIHRoZSB0aW1lb3V0IGRlbGF5IGhhcyBwYXNzZWQuXG4gICAqIEByZXR1cm5zIHtUaW1lb3V0fSB0aGUgY3VycmVudCB0aW1lb3V0IChzbyB0aGUgc3RhcnQgY2FsbCBjYW4gYmUgY2hhaW5lZCB0byB0aGUgY29uc3RydWN0b3IpXG4gICAqL1xuICBzdGFydCgpOiB0aGlzIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSB0aW1lb3V0LiBUaGUgY2FsbGJhY2sgd2lsbCBub3QgYmUgY2FsbGVkIGlmIGNsZWFyIGlzIGNhbGxlZCBkdXJpbmcgdGhlIHRpbWVvdXQuXG4gICAqL1xuICBjbGVhcigpOiB2b2lkIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SGFuZGxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIHBhc3NlZCB0aW1lb3V0IGRlbGF5IHRvIHplcm8uIENhbiBiZSB1c2VkIHRvIGRlZmVyIHRoZSBjYWxsaW5nIG9mIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIGxldCBsYXN0U2NoZWR1bGVUaW1lID0gMDtcbiAgICBsZXQgZGVsYXlBZGp1c3QgPSAwO1xuXG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgbGV0IGludGVybmFsQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzLmNhbGxiYWNrKCk7XG5cbiAgICAgIGlmICh0aGlzLnJlcGVhdCkge1xuICAgICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAvLyBUaGUgdGltZSBvZiBvbmUgaXRlcmF0aW9uIGZyb20gc2NoZWR1bGluZyB0byBleGVjdXRpbmcgdGhlIGNhbGxiYWNrICh1c3VhbGx5IGEgYml0IGxvbmdlciB0aGFuIHRoZSBkZWxheVxuICAgICAgICAvLyB0aW1lKVxuICAgICAgICBsZXQgZGVsdGEgPSBub3cgLSBsYXN0U2NoZWR1bGVUaW1lO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGVsYXkgYWRqdXN0bWVudCBmb3IgdGhlIG5leHQgc2NoZWR1bGUgdG8ga2VlcCBhIHN0ZWFkeSBkZWxheSBpbnRlcnZhbCBvdmVyIHRpbWVcbiAgICAgICAgZGVsYXlBZGp1c3QgPSB0aGlzLmRlbGF5IC0gZGVsdGEgKyBkZWxheUFkanVzdDtcblxuICAgICAgICBsYXN0U2NoZWR1bGVUaW1lID0gbm93O1xuXG4gICAgICAgIC8vIFNjaGVkdWxlIG5leHQgZXhlY3V0aW9uIGJ5IHRoZSBhZGp1c3RlZCBkZWxheVxuICAgICAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGludGVybmFsQ2FsbGJhY2ssIHRoaXMuZGVsYXkgKyBkZWxheUFkanVzdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxhc3RTY2hlZHVsZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGlmICh0aGlzLmRlbGF5ID4gMCkge1xuICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChpbnRlcm5hbENhbGxiYWNrLCB0aGlzLmRlbGF5KTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge1VJQ29udGFpbmVyfSBmcm9tICcuL2NvbXBvbmVudHMvdWljb250YWluZXInO1xuaW1wb3J0IHtET019IGZyb20gJy4vZG9tJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50cy9jb21wb25lbnQnO1xuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXInO1xuaW1wb3J0IHtQbGF5YmFja1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7RnVsbHNjcmVlblRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bGxzY3JlZW50b2dnbGVidXR0b24nO1xuaW1wb3J0IHtWUlRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZydG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7Vm9sdW1lVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1ldG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U2Vla0Jhcn0gZnJvbSAnLi9jb21wb25lbnRzL3NlZWtiYXInO1xuaW1wb3J0IHtQbGF5YmFja1RpbWVMYWJlbCwgUGxheWJhY2tUaW1lTGFiZWxNb2RlfSBmcm9tICcuL2NvbXBvbmVudHMvcGxheWJhY2t0aW1lbGFiZWwnO1xuaW1wb3J0IHtDb250cm9sQmFyfSBmcm9tICcuL2NvbXBvbmVudHMvY29udHJvbGJhcic7XG5pbXBvcnQge05vQXJncywgRXZlbnREaXNwYXRjaGVyLCBDYW5jZWxFdmVudEFyZ3N9IGZyb20gJy4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCB7RW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2VtYmVkdmlkZW90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtFbWJlZFZpZGVvUGFuZWx9IGZyb20gJy4vY29tcG9uZW50cy9lbWJlZHZpZGVvcGFuZWwnO1xuaW1wb3J0IHtTZXR0aW5nc1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3NldHRpbmdzdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U2V0dGluZ3NQYW5lbCwgU2V0dGluZ3NQYW5lbEl0ZW19IGZyb20gJy4vY29tcG9uZW50cy9zZXR0aW5nc3BhbmVsJztcbmltcG9ydCB7VmlkZW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvdmlkZW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7V2F0ZXJtYXJrfSBmcm9tICcuL2NvbXBvbmVudHMvd2F0ZXJtYXJrJztcbmltcG9ydCB7QXVkaW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvYXVkaW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7QXVkaW9UcmFja1NlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL2F1ZGlvdHJhY2tzZWxlY3Rib3gnO1xuaW1wb3J0IHtTZWVrQmFyTGFiZWx9IGZyb20gJy4vY29tcG9uZW50cy9zZWVrYmFybGFiZWwnO1xuaW1wb3J0IHtWb2x1bWVTbGlkZXJ9IGZyb20gJy4vY29tcG9uZW50cy92b2x1bWVzbGlkZXInO1xuaW1wb3J0IHtTdWJ0aXRsZVNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3N1YnRpdGxlc2VsZWN0Ym94JztcbmltcG9ydCB7U3VidGl0bGVPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvc3VidGl0bGVvdmVybGF5JztcbmltcG9ydCB7Vm9sdW1lQ29udHJvbEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZWNvbnRyb2xidXR0b24nO1xuaW1wb3J0IHtDYXN0VG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0Nhc3RTdGF0dXNPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHN0YXR1c292ZXJsYXknO1xuaW1wb3J0IHtFcnJvck1lc3NhZ2VPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JtZXNzYWdlb3ZlcmxheSc7XG5pbXBvcnQge1RpdGxlQmFyfSBmcm9tICcuL2NvbXBvbmVudHMvdGl0bGViYXInO1xuaW1wb3J0IFBsYXllckFQSSA9IGJpdG1vdmluLlBsYXllckFQSTtcbmltcG9ydCB7UmVjb21tZW5kYXRpb25PdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvcmVjb21tZW5kYXRpb25vdmVybGF5JztcbmltcG9ydCB7QWRNZXNzYWdlTGFiZWx9IGZyb20gJy4vY29tcG9uZW50cy9hZG1lc3NhZ2VsYWJlbCc7XG5pbXBvcnQge0FkU2tpcEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Fkc2tpcGJ1dHRvbic7XG5pbXBvcnQge0FkQ2xpY2tPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvYWRjbGlja292ZXJsYXknO1xuaW1wb3J0IEVWRU5UID0gYml0bW92aW4uUGxheWVyQVBJLkVWRU5UO1xuaW1wb3J0IFBsYXllckV2ZW50Q2FsbGJhY2sgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnRDYWxsYmFjaztcbmltcG9ydCBBZFN0YXJ0ZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5BZFN0YXJ0ZWRFdmVudDtcbmltcG9ydCB7QXJyYXlVdGlscywgVUlVdGlscywgQnJvd3NlclV0aWxzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7UGxheWJhY2tTcGVlZFNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrc3BlZWRzZWxlY3Rib3gnO1xuaW1wb3J0IHtCdWZmZXJpbmdPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvYnVmZmVyaW5nb3ZlcmxheSc7XG5pbXBvcnQge0Nhc3RVSUNvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3R1aWNvbnRhaW5lcic7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlb3ZlcmxheSc7XG5pbXBvcnQge0Nsb3NlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2xvc2VidXR0b24nO1xuaW1wb3J0IHtNZXRhZGF0YUxhYmVsLCBNZXRhZGF0YUxhYmVsQ29udGVudH0gZnJvbSAnLi9jb21wb25lbnRzL21ldGFkYXRhbGFiZWwnO1xuaW1wb3J0IHtMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL2xhYmVsJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJFdmVudDtcbmltcG9ydCB7QWlyUGxheVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2FpcnBsYXl0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtQaWN0dXJlSW5QaWN0dXJlVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvcGljdHVyZWlucGljdHVyZXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1NwYWNlcn0gZnJvbSAnLi9jb21wb25lbnRzL3NwYWNlcic7XG5pbXBvcnQge0NvbW1lbnRzVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY29tbWVudHN0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2xvc2VkY2FwdGlvbmluZ3RvZ2dsZWJ1dHRvbic7XG5cblxuZXhwb3J0IGludGVyZmFjZSBVSVJlY29tbWVuZGF0aW9uQ29uZmlnIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRodW1ibmFpbD86IHN0cmluZztcbiAgZHVyYXRpb24/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVUlFbWJlZFZpZGVvQ29uZmlnIHtcbiAgZGVmYXVsdDogc3RyaW5nO1xuICB3aXRoQ29tbWVudHM/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZWxpbmVNYXJrZXIge1xuICB0aW1lOiBudW1iZXI7XG4gIHRpbWVQZXJjZW50YWdlPzogbnVtYmVyXG4gIHRpdGxlPzogc3RyaW5nO1xuICBtYXJrZXJUeXBlPzogc3RyaW5nO1xuICBjb21tZW50Pzogc3RyaW5nO1xuICBhdmF0YXI/OiBzdHJpbmc7XG4gIG51bWJlcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVSUNvbmZpZyB7XG4gIG1ldGFkYXRhPzoge1xuICAgIHRpdGxlPzogc3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICAgIG1hcmtlcnM/OiBUaW1lbGluZU1hcmtlcltdO1xuICAgIGVtYmVkVmlkZW8/OiBVSUVtYmVkVmlkZW9Db25maWc7XG4gIH07XG4gIHJlY29tbWVuZGF0aW9ucz86IFVJUmVjb21tZW5kYXRpb25Db25maWdbXTtcbn1cblxuLyoqXG4gKiBUaGUgY29udGV4dCB0aGF0IHdpbGwgYmUgcGFzc2VkIHRvIGEge0BsaW5rIFVJQ29uZGl0aW9uUmVzb2x2ZXJ9IHRvIGRldGVybWluZSBpZiBpdCdzIGNvbmRpdGlvbnMgZnVsZmlsIHRoZSBjb250ZXh0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVJQ29uZGl0aW9uQ29udGV4dCB7XG4gIGlzQWQ6IGJvb2xlYW47XG4gIGlzQWRXaXRoVUk6IGJvb2xlYW47XG4gIGlzRnVsbHNjcmVlbjogYm9vbGVhbjtcbiAgaXNNb2JpbGU6IGJvb2xlYW47XG4gIGRvY3VtZW50V2lkdGg6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyB0aGUgY29uZGl0aW9ucyBvZiBpdHMgYXNzb2NpYXRlZCBVSSBpbiBhIHtAbGluayBVSVZhcmlhbnR9IHVwb24gYSB7QGxpbmsgVUlDb25kaXRpb25Db250ZXh0fSBhbmQgZGVjaWRlc1xuICogaWYgdGhlIFVJIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIGl0IHJldHVybnMgdHJ1ZSwgdGhlIFVJIGlzIGEgY2FuZGlkYXRlIGZvciBkaXNwbGF5OyBpZiBpdCByZXR1cm5zIGZhbHNlLCBpdCB3aWxsXG4gKiBub3QgYmUgZGlzcGxheWVkIGluIHRoZSBnaXZlbiBjb250ZXh0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVJQ29uZGl0aW9uUmVzb2x2ZXIge1xuICAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBc3NvY2lhdGVzIGEgVUkgaW5zdGFuY2Ugd2l0aCBhbiBvcHRpb25hbCB7QGxpbmsgVUlDb25kaXRpb25SZXNvbHZlcn0gdGhhdCBkZXRlcm1pbmVzIGlmIHRoZSBVSSBzaG91bGQgYmUgZGlzcGxheWVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVJVmFyaWFudCB7XG4gIHVpOiBVSUNvbnRhaW5lcjtcbiAgY29uZGl0aW9uPzogVUlDb25kaXRpb25SZXNvbHZlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFVJTWFuYWdlciB7XG5cbiAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllckFQSTtcbiAgcHJpdmF0ZSBwbGF5ZXJFbGVtZW50OiBET007XG4gIHByaXZhdGUgdWlWYXJpYW50czogVUlWYXJpYW50W107XG4gIHByaXZhdGUgdWlJbnN0YW5jZU1hbmFnZXJzOiBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyW107XG4gIHByaXZhdGUgY3VycmVudFVpOiBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyO1xuICBwcml2YXRlIGNvbmZpZzogVUlDb25maWc7XG4gIHByaXZhdGUgbWFuYWdlclBsYXllcldyYXBwZXI6IFBsYXllcldyYXBwZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBVSSBtYW5hZ2VyIHdpdGggYSBzaW5nbGUgVUkgdmFyaWFudCB0aGF0IHdpbGwgYmUgcGVybWFuZW50bHkgc2hvd24uXG4gICAqIEBwYXJhbSBwbGF5ZXIgdGhlIGFzc29jaWF0ZWQgcGxheWVyIG9mIHRoaXMgVUlcbiAgICogQHBhcmFtIHVpIHRoZSBVSSB0byBhZGQgdG8gdGhlIHBsYXllclxuICAgKiBAcGFyYW0gY29uZmlnIG9wdGlvbmFsIFVJIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBsYXllcjogUGxheWVyQVBJLCB1aTogVUlDb250YWluZXIsIGNvbmZpZz86IFVJQ29uZmlnKTtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBVSSBtYW5hZ2VyIHdpdGggYSBsaXN0IG9mIFVJIHZhcmlhbnRzIHRoYXQgd2lsbCBiZSBkeW5hbWljYWxseSBzZWxlY3RlZCBhbmQgc3dpdGNoZWQgYWNjb3JkaW5nIHRvXG4gICAqIHRoZSBjb250ZXh0IG9mIHRoZSBVSS5cbiAgICpcbiAgICogRXZlcnkgdGltZSB0aGUgVUkgY29udGV4dCBjaGFuZ2VzLCB0aGUgY29uZGl0aW9ucyBvZiB0aGUgVUkgdmFyaWFudHMgd2lsbCBiZSBzZXF1ZW50aWFsbHkgcmVzb2x2ZWQgYW5kIHRoZSBmaXJzdFxuICAgKiBVSSwgd2hvc2UgY29uZGl0aW9uIGV2YWx1YXRlcyB0byB0cnVlLCB3aWxsIGJlIHNlbGVjdGVkIGFuZCBkaXNwbGF5ZWQuIFRoZSBsYXN0IHZhcmlhbnQgaW4gdGhlIGxpc3QgbWlnaHQgb21pdCB0aGVcbiAgICogY29uZGl0aW9uIHJlc29sdmVyIGFuZCB3aWxsIGJlIHNlbGVjdGVkIGFzIGRlZmF1bHQvZmFsbGJhY2sgVUkgd2hlbiBhbGwgb3RoZXIgY29uZGl0aW9ucyBmYWlsLiBJZiB0aGVyZSBpcyBub1xuICAgKiBmYWxsYmFjayBVSSBhbmQgYWxsIGNvbmRpdGlvbnMgZmFpbCwgbm8gVUkgd2lsbCBiZSBkaXNwbGF5ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBwbGF5ZXIgdGhlIGFzc29jaWF0ZWQgcGxheWVyIG9mIHRoaXMgVUlcbiAgICogQHBhcmFtIHVpVmFyaWFudHMgYSBsaXN0IG9mIFVJIHZhcmlhbnRzIHRoYXQgd2lsbCBiZSBkeW5hbWljYWxseSBzd2l0Y2hlZFxuICAgKiBAcGFyYW0gY29uZmlnIG9wdGlvbmFsIFVJIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBsYXllcjogUGxheWVyQVBJLCB1aVZhcmlhbnRzOiBVSVZhcmlhbnRbXSwgY29uZmlnPzogVUlDb25maWcpO1xuICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSwgcGxheWVyVWlPclVpVmFyaWFudHM6IFVJQ29udGFpbmVyIHwgVUlWYXJpYW50W10sIGNvbmZpZzogVUlDb25maWcgPSB7fSkge1xuICAgIGlmIChwbGF5ZXJVaU9yVWlWYXJpYW50cyBpbnN0YW5jZW9mIFVJQ29udGFpbmVyKSB7XG4gICAgICAvLyBTaW5nbGUtVUkgY29uc3RydWN0b3IgaGFzIGJlZW4gY2FsbGVkLCB0cmFuc2Zvcm0gYXJndW1lbnRzIHRvIFVJVmFyaWFudFtdIHNpZ25hdHVyZVxuICAgICAgbGV0IHBsYXllclVpID0gPFVJQ29udGFpbmVyPnBsYXllclVpT3JVaVZhcmlhbnRzO1xuICAgICAgbGV0IGFkc1VpID0gbnVsbDtcblxuICAgICAgbGV0IHVpVmFyaWFudHMgPSBbXTtcblxuICAgICAgLy8gQWRkIHRoZSBhZHMgVUkgaWYgZGVmaW5lZFxuICAgICAgaWYgKGFkc1VpKSB7XG4gICAgICAgIHVpVmFyaWFudHMucHVzaCh7XG4gICAgICAgICAgdWk6IGFkc1VpLFxuICAgICAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuaXNBZFdpdGhVSTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoZSBkZWZhdWx0IHBsYXllciBVSVxuICAgICAgdWlWYXJpYW50cy5wdXNoKHt1aTogcGxheWVyVWl9KTtcblxuICAgICAgdGhpcy51aVZhcmlhbnRzID0gdWlWYXJpYW50cztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBEZWZhdWx0IGNvbnN0cnVjdG9yIChVSVZhcmlhbnRbXSkgaGFzIGJlZW4gY2FsbGVkXG4gICAgICB0aGlzLnVpVmFyaWFudHMgPSA8VUlWYXJpYW50W10+cGxheWVyVWlPclVpVmFyaWFudHM7XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlciA9IG5ldyBQbGF5ZXJXcmFwcGVyKHBsYXllcik7XG4gICAgdGhpcy5wbGF5ZXJFbGVtZW50ID0gbmV3IERPTShwbGF5ZXIuZ2V0RmlndXJlKCkpO1xuXG4gICAgLy8gQ3JlYXRlIFVJIGluc3RhbmNlIG1hbmFnZXJzIGZvciB0aGUgVUkgdmFyaWFudHNcbiAgICAvLyBUaGUgaW5zdGFuY2UgbWFuYWdlcnMgbWFwIHRvIHRoZSBjb3JyZXNwb25kaW5nIFVJIHZhcmlhbnRzIGJ5IHRoZWlyIGFycmF5IGluZGV4XG4gICAgdGhpcy51aUluc3RhbmNlTWFuYWdlcnMgPSBbXTtcbiAgICBsZXQgdWlWYXJpYW50c1dpdGhvdXRDb25kaXRpb24gPSBbXTtcbiAgICBmb3IgKGxldCB1aVZhcmlhbnQgb2YgdGhpcy51aVZhcmlhbnRzKSB7XG4gICAgICBpZiAodWlWYXJpYW50LmNvbmRpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgIC8vIENvbGxlY3QgdmFyaWFudHMgd2l0aG91dCBjb25kaXRpb25zIGZvciBlcnJvciBjaGVja2luZ1xuICAgICAgICB1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvbi5wdXNoKHVpVmFyaWFudCk7XG4gICAgICB9XG4gICAgICAvLyBDcmVhdGUgdGhlIGluc3RhbmNlIG1hbmFnZXIgZm9yIGEgVUkgdmFyaWFudFxuICAgICAgdGhpcy51aUluc3RhbmNlTWFuYWdlcnMucHVzaChuZXcgSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlcihwbGF5ZXIsIHVpVmFyaWFudC51aSwgdGhpcy5jb25maWcpKTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlcmUgaXMgb25seSBvbmUgVUkgdmFyaWFudCB3aXRob3V0IGEgY29uZGl0aW9uXG4gICAgLy8gSXQgZG9lcyBub3QgbWFrZSBzZW5zZSB0byBoYXZlIG11bHRpcGxlIHZhcmlhbnRzIHdpdGhvdXQgY29uZGl0aW9uLCBiZWNhdXNlIG9ubHkgdGhlIGZpcnN0IG9uZSBpbiB0aGUgbGlzdFxuICAgIC8vICh0aGUgb25lIHdpdGggdGhlIGxvd2VzdCBpbmRleCkgd2lsbCBldmVyIGJlIHNlbGVjdGVkLlxuICAgIGlmICh1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBFcnJvcignVG9vIG1hbnkgVUlzIHdpdGhvdXQgYSBjb25kaXRpb246IFlvdSBjYW5ub3QgaGF2ZSBtb3JlIHRoYW4gb25lIGRlZmF1bHQgVUknKTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIGRlZmF1bHQgVUkgdmFyaWFudCwgaWYgZGVmaW5lZCwgaXMgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdCAobGFzdCBpbmRleClcbiAgICAvLyBJZiBpdCBjb21lcyBlYXJsaWVyLCB0aGUgdmFyaWFudHMgd2l0aCBjb25kaXRpb25zIHRoYXQgY29tZSBhZnRlcndhcmRzIHdpbGwgbmV2ZXIgYmUgc2VsZWN0ZWQgYmVjYXVzZSB0aGVcbiAgICAvLyBkZWZhdWx0IHZhcmlhbnQgd2l0aG91dCBhIGNvbmRpdGlvbiBhbHdheXMgZXZhbHVhdGVzIHRvICd0cnVlJ1xuICAgIGlmICh1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvbi5sZW5ndGggPiAwXG4gICAgICAmJiB1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvblswXSAhPT0gdGhpcy51aVZhcmlhbnRzW3RoaXMudWlWYXJpYW50cy5sZW5ndGggLSAxXSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgVUkgdmFyaWFudCBvcmRlcjogdGhlIGRlZmF1bHQgVUkgKHdpdGhvdXQgY29uZGl0aW9uKSBtdXN0IGJlIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QnKTtcbiAgICB9XG5cbiAgICBsZXQgYWRTdGFydGVkRXZlbnQ6IEFkU3RhcnRlZEV2ZW50ID0gbnVsbDsgLy8ga2VlcCB0aGUgZXZlbnQgc3RvcmVkIGhlcmUgZHVyaW5nIGFkIHBsYXliYWNrXG4gICAgbGV0IGlzTW9iaWxlID0gQnJvd3NlclV0aWxzLmlzTW9iaWxlO1xuXG4gICAgLy8gRHluYW1pY2FsbHkgc2VsZWN0IGEgVUkgdmFyaWFudCB0aGF0IG1hdGNoZXMgdGhlIGN1cnJlbnQgVUkgY29uZGl0aW9uLlxuICAgIGxldCByZXNvbHZlVWlWYXJpYW50ID0gKGV2ZW50OiBQbGF5ZXJFdmVudCkgPT4ge1xuICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIE9OX0FEX1NUQVJURUQgZXZlbnQgZGF0YSBpcyBwZXJzaXN0ZWQgdGhyb3VnaCBhZCBwbGF5YmFjayBpbiBjYXNlIG90aGVyIGV2ZW50cyBoYXBwZW5cbiAgICAgIC8vIGluIHRoZSBtZWFudGltZSwgZS5nLiBwbGF5ZXIgcmVzaXplLiBXZSBuZWVkIHRvIHN0b3JlIHRoaXMgZGF0YSBiZWNhdXNlIHRoZXJlIGlzIG5vIG90aGVyIHdheSB0byBmaW5kIG91dFxuICAgICAgLy8gYWQgZGV0YWlscyAoZS5nLiB0aGUgYWQgY2xpZW50KSB3aGlsZSBhbiBhZCBpcyBwbGF5aW5nLlxuICAgICAgLy8gRXhpc3RpbmcgZXZlbnQgZGF0YSBzaWduYWxzIHRoYXQgYW4gYWQgaXMgY3VycmVudGx5IGFjdGl2ZS4gV2UgY2Fubm90IHVzZSBwbGF5ZXIuaXNBZCgpIGJlY2F1c2UgaXQgcmV0dXJuc1xuICAgICAgLy8gdHJ1ZSBvbiBhZCBzdGFydCBhbmQgYWxzbyBvbiBhZCBlbmQgZXZlbnRzLCB3aGljaCBpcyBwcm9ibGVtYXRpYy5cbiAgICAgIGlmIChldmVudCAhPSBudWxsKSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgIC8vIFdoZW4gdGhlIGFkIHN0YXJ0cywgd2Ugc3RvcmUgdGhlIGV2ZW50IGRhdGFcbiAgICAgICAgICBjYXNlIHBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVEOlxuICAgICAgICAgICAgYWRTdGFydGVkRXZlbnQgPSA8QWRTdGFydGVkRXZlbnQ+ZXZlbnQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAvLyBXaGVuIHRoZSBhZCBlbmRzLCB3ZSBkZWxldGUgdGhlIGV2ZW50IGRhdGFcbiAgICAgICAgICBjYXNlIHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRDpcbiAgICAgICAgICBjYXNlIHBsYXllci5FVkVOVC5PTl9BRF9TS0lQUEVEOlxuICAgICAgICAgIGNhc2UgcGxheWVyLkVWRU5ULk9OX0FEX0VSUk9SOlxuICAgICAgICAgICAgYWRTdGFydGVkRXZlbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERldGVjdCBpZiBhbiBhZCBoYXMgc3RhcnRlZFxuICAgICAgbGV0IGFkID0gYWRTdGFydGVkRXZlbnQgIT0gbnVsbDtcbiAgICAgIGxldCBhZFdpdGhVSSA9IGFkICYmIGFkU3RhcnRlZEV2ZW50LmNsaWVudFR5cGUgPT09ICd2YXN0JztcblxuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBjdXJyZW50IGNvbnRleHQgZm9yIHdoaWNoIHRoZSBVSSB2YXJpYW50IHdpbGwgYmUgcmVzb2x2ZWRcbiAgICAgIGxldCBjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQgPSB7XG4gICAgICAgIGlzQWQ6IGFkLFxuICAgICAgICBpc0FkV2l0aFVJOiBhZFdpdGhVSSxcbiAgICAgICAgaXNGdWxsc2NyZWVuOiB0aGlzLnBsYXllci5pc0Z1bGxzY3JlZW4oKSxcbiAgICAgICAgaXNNb2JpbGU6IGlzTW9iaWxlLFxuICAgICAgICB3aWR0aDogdGhpcy5wbGF5ZXJFbGVtZW50LndpZHRoKCksXG4gICAgICAgIGRvY3VtZW50V2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsXG4gICAgICB9O1xuXG4gICAgICBsZXQgbmV4dFVpOiBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyID0gbnVsbDtcbiAgICAgIGxldCB1aVZhcmlhbnRDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgIC8vIFNlbGVjdCBuZXcgVUkgdmFyaWFudFxuICAgICAgLy8gSWYgbm8gdmFyaWFudCBjb25kaXRpb24gaXMgZnVsZmlsbGVkLCB3ZSBzd2l0Y2ggdG8gKm5vKiBVSVxuICAgICAgZm9yIChsZXQgdWlWYXJpYW50IG9mIHRoaXMudWlWYXJpYW50cykge1xuICAgICAgICBpZiAodWlWYXJpYW50LmNvbmRpdGlvbiA9PSBudWxsIHx8IHVpVmFyaWFudC5jb25kaXRpb24oY29udGV4dCkgPT09IHRydWUpIHtcbiAgICAgICAgICBuZXh0VWkgPSB0aGlzLnVpSW5zdGFuY2VNYW5hZ2Vyc1t0aGlzLnVpVmFyaWFudHMuaW5kZXhPZih1aVZhcmlhbnQpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIFVJIHZhcmlhbnQgaXMgY2hhbmdpbmdcbiAgICAgIGlmIChuZXh0VWkgIT09IHRoaXMuY3VycmVudFVpKSB7XG4gICAgICAgIHVpVmFyaWFudENoYW5nZWQgPSB0cnVlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3dpdGNoZWQgZnJvbSAnLCB0aGlzLmN1cnJlbnRVaSA/IHRoaXMuY3VycmVudFVpLmdldFVJKCkgOiAnbm9uZScsXG4gICAgICAgIC8vICAgJyB0byAnLCBuZXh0VWkgPyBuZXh0VWkuZ2V0VUkoKSA6ICdub25lJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE9ubHkgaWYgdGhlIFVJIHZhcmlhbnQgaXMgY2hhbmdpbmcsIHdlIG5lZWQgdG8gZG8gc29tZSBzdHVmZi4gRWxzZSB3ZSBqdXN0IGxlYXZlIGV2ZXJ5dGhpbmcgYXMtaXMuXG4gICAgICBpZiAodWlWYXJpYW50Q2hhbmdlZCkge1xuICAgICAgICAvLyBIaWRlIHRoZSBjdXJyZW50bHkgYWN0aXZlIFVJIHZhcmlhbnRcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFVpKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50VWkuZ2V0VUkoKS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBc3NpZ24gdGhlIG5ldyBVSSB2YXJpYW50IGFzIGN1cnJlbnQgVUlcbiAgICAgICAgdGhpcy5jdXJyZW50VWkgPSBuZXh0VWk7XG5cbiAgICAgICAgLy8gV2hlbiB3ZSBzd2l0Y2ggdG8gYSBkaWZmZXJlbnQgVUkgaW5zdGFuY2UsIHRoZXJlJ3Mgc29tZSBhZGRpdGlvbmFsIHN0dWZmIHRvIG1hbmFnZS4gSWYgd2UgZG8gbm90IHN3aXRjaFxuICAgICAgICAvLyB0byBhbiBpbnN0YW5jZSwgd2UncmUgZG9uZSBoZXJlLlxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VWkgIT0gbnVsbCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgVUkgdG8gdGhlIERPTSAoYW5kIGNvbmZpZ3VyZSBpdCkgdGhlIGZpcnN0IHRpbWUgaXQgaXMgc2VsZWN0ZWRcbiAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudFVpLmlzQ29uZmlndXJlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFVpKHRoaXMuY3VycmVudFVpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIGFkIFVJLCB3ZSBuZWVkIHRvIHJlbGF5IHRoZSBzYXZlZCBPTl9BRF9TVEFSVEVEIGV2ZW50IGRhdGEgc28gYWQgY29tcG9uZW50cyBjYW4gY29uZmlndXJlXG4gICAgICAgICAgLy8gdGhlbXNlbHZlcyBmb3IgdGhlIGN1cnJlbnQgYWQuXG4gICAgICAgICAgaWYgKGNvbnRleHQuaXNBZCkge1xuICAgICAgICAgICAgLyogUmVsYXkgdGhlIE9OX0FEX1NUQVJURUQgZXZlbnQgdG8gdGhlIGFkcyBVSVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEJlY2F1c2UgdGhlIGFkcyBVSSBpcyBpbml0aWFsaXplZCBpbiB0aGUgT05fQURfU1RBUlRFRCBoYW5kbGVyLCBpLmUuIHdoZW4gdGhlIE9OX0FEX1NUQVJURUQgZXZlbnQgaGFzXG4gICAgICAgICAgICAgKiBhbHJlYWR5IGJlZW4gZmlyZWQsIGNvbXBvbmVudHMgaW4gdGhlIGFkcyBVSSB0aGF0IGxpc3RlbiBmb3IgdGhlIE9OX0FEX1NUQVJURUQgZXZlbnQgbmV2ZXIgcmVjZWl2ZSBpdC5cbiAgICAgICAgICAgICAqIFNpbmNlIHRoaXMgY2FuIGJyZWFrIGZ1bmN0aW9uYWxpdHkgb2YgY29tcG9uZW50cyB0aGF0IHJlbHkgb24gdGhpcyBldmVudCwgd2UgcmVsYXkgdGhlIGV2ZW50IHRvIHRoZVxuICAgICAgICAgICAgICogYWRzIFVJIGNvbXBvbmVudHMgd2l0aCB0aGUgZm9sbG93aW5nIGNhbGwuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFVpLmdldFdyYXBwZWRQbGF5ZXIoKS5maXJlRXZlbnRJblVJKHRoaXMucGxheWVyLkVWRU5ULk9OX0FEX1NUQVJURUQsIGFkU3RhcnRlZEV2ZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5nZXRVSSgpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBMaXN0ZW4gdG8gdGhlIGZvbGxvd2luZyBldmVudHMgdG8gdHJpZ2dlciBVSSB2YXJpYW50IHJlc29sdXRpb25cbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVELCByZXNvbHZlVWlWYXJpYW50KTtcbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgcmVzb2x2ZVVpVmFyaWFudCk7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fQURfU0tJUFBFRCwgcmVzb2x2ZVVpVmFyaWFudCk7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fQURfRVJST1IsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRU5URVIsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRVhJVCwgcmVzb2x2ZVVpVmFyaWFudCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBVSVxuICAgIHJlc29sdmVVaVZhcmlhbnQobnVsbCk7XG4gIH1cblxuICBnZXRDb25maWcoKTogVUlDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxuXG4gIHByaXZhdGUgYWRkVWkodWk6IEludGVybmFsVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgdWlEb20gPSB1aS5nZXRVSSgpLmdldERvbUVsZW1lbnQoKTtcbiAgICB1aS5jb25maWd1cmVDb250cm9scygpO1xuXG4gICAgLyogQXBwZW5kIHRoZSBVSSBET00gYWZ0ZXIgY29uZmlndXJhdGlvbiB0byBhdm9pZCBDU1MgdHJhbnNpdGlvbnMgYXQgaW5pdGlhbGl6YXRpb25cbiAgICAgKiBFeGFtcGxlOiBDb21wb25lbnRzIGFyZSBoaWRkZW4gZHVyaW5nIGNvbmZpZ3VyYXRpb24gYW5kIHRoZXNlIGhpZGVzIG1heSB0cmlnZ2VyIENTUyB0cmFuc2l0aW9ucyB0aGF0IGFyZVxuICAgICAqIHVuZGVzaXJhYmxlIGF0IHRoaXMgdGltZS4gKi9cblxuICAgIC8qIEFwcGVuZCB1aSB0byBwYXJlbnQgaW5zdGVhZCBvZiBwbGF5ZXIgKi9cbiAgICBsZXQgcGFyZW50RWxlbWVudCA9IG5ldyBET00odGhpcy5wbGF5ZXJFbGVtZW50LmdldEVsZW1lbnRzKClbMF0ucGFyZW50RWxlbWVudCk7XG4gICAgcGFyZW50RWxlbWVudC5hZGRDbGFzcygnc21hc2hjdXQtY3VzdG9tLXVpLWJpdG1vdmluLXBsYXllci1ob2xkZXInKTtcbiAgICBwYXJlbnRFbGVtZW50LmFwcGVuZCh1aURvbSk7XG5cbiAgICAvLyBGaXJlIG9uQ29uZmlndXJlZCBhZnRlciBVSSBET00gZWxlbWVudHMgYXJlIHN1Y2Nlc3NmdWxseSBhZGRlZC4gV2hlbiBmaXJlZCBpbW1lZGlhdGVseSwgdGhlIERPTSBlbGVtZW50c1xuICAgIC8vIG1pZ2h0IG5vdCBiZSBmdWxseSBjb25maWd1cmVkIGFuZCBlLmcuIGRvIG5vdCBoYXZlIGEgc2l6ZS5cbiAgICAvLyBodHRwczovL3N3aXplYy5jb20vYmxvZy9ob3ctdG8tcHJvcGVybHktd2FpdC1mb3ItZG9tLWVsZW1lbnRzLXRvLXNob3ctdXAtaW4tbW9kZXJuLWJyb3dzZXJzL3N3aXplYy82NjYzXG4gICAgaWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHVpLm9uQ29uZmlndXJlZC5kaXNwYXRjaCh1aS5nZXRVSSgpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJRTkgZmFsbGJhY2tcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB1aS5vbkNvbmZpZ3VyZWQuZGlzcGF0Y2godWkuZ2V0VUkoKSk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbGVhc2VVaSh1aTogSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHVpLnJlbGVhc2VDb250cm9scygpO1xuICAgIHVpLmdldFVJKCkuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZSgpO1xuICAgIHVpLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBmb3IgKGxldCB1aUluc3RhbmNlTWFuYWdlciBvZiB0aGlzLnVpSW5zdGFuY2VNYW5hZ2Vycykge1xuICAgICAgdGhpcy5yZWxlYXNlVWkodWlJbnN0YW5jZU1hbmFnZXIpO1xuICAgIH1cbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgVUlNYW5hZ2VyLkZhY3Rvcnkge1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZERlZmF1bHRVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5VSShwbGF5ZXIsIGNvbmZpZyk7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gYnVpbGREZWZhdWx0U21hbGxTY3JlZW5VSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5TbWFsbFNjcmVlblVJKHBsYXllciwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZERlZmF1bHRDYXN0UmVjZWl2ZXJVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5DYXN0UmVjZWl2ZXJVSShwbGF5ZXIsIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBzbWFzaGN1dFVpKCkge1xuXG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3BlZWQnLCBuZXcgUGxheWJhY2tTcGVlZFNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IGVtYmVkVmlkZW9QYW5lbCA9IG5ldyBFbWJlZFZpZGVvUGFuZWwoe1xuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhclRvcCA9IG5ldyBDb250YWluZXIoe1xuICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLXRvcCddLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoe3RpbWVMYWJlbE1vZGU6IFBsYXliYWNrVGltZUxhYmVsTW9kZS5DdXJyZW50VGltZSwgaGlkZUluTGl2ZVBsYXliYWNrOiB0cnVlfSksXG4gICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIGxldCBzZWVrQmFyID0gbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KTtcblxuICAgIGxldCBjb250cm9sQmFyTWlkZGxlID0gbmV3IENvbnRhaW5lcih7XG4gICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItbWlkZGxlJ10sXG4gICAgICBjb21wb25lbnRzOiBbc2Vla0Jhcl1cbiAgICB9KTtcblxuICAgIGxldCBjb250cm9sQmFyQm90dG9tID0gbmV3IENvbnRhaW5lcih7XG4gICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItYm90dG9tJ10sXG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTcGFjZXIoKSxcbiAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBDb21tZW50c1RvZ2dsZUJ1dHRvbih7c2Vla0Jhcjogc2Vla0Jhcn0pLFxuICAgICAgICBuZXcgQ2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgLy9uZXcgRW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbih7ZW1iZWRWaWRlb1BhbmVsOiBlbWJlZFZpZGVvUGFuZWx9KSxcbiAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKSxcbiAgICAgIF1cbiAgICB9KTtcblxuXG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItaW5uZXInXSxcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBzZXR0aW5nc1BhbmVsLFxuICAgICAgICAgICAgZW1iZWRWaWRlb1BhbmVsLFxuICAgICAgICAgICAgY29udHJvbEJhclRvcCxcbiAgICAgICAgICAgIGNvbnRyb2xCYXJNaWRkbGUsXG4gICAgICAgICAgICBjb250cm9sQmFyQm90dG9tLFxuICAgICAgICAgIF1cbiAgICAgICAgfSlcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgaGlkZURlbGF5OiA1MDAwLFxuICAgICAgY3NzQ2xhc3NlczogWyd1aS1za2luLW1vZGVybiB1aS1za2luLXNtYXNoY3V0J10sXG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTdWJ0aXRsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IEJ1ZmZlcmluZ092ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoKSxcbiAgICAgICAgbmV3IFJlY29tbWVuZGF0aW9uT3ZlcmxheSgpLFxuICAgICAgICBuZXcgRXJyb3JNZXNzYWdlT3ZlcmxheSgpXG4gICAgICBdXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5VSSgpIHtcbiAgICBsZXQgc2V0dGluZ3NQYW5lbCA9IG5ldyBTZXR0aW5nc1BhbmVsKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdWaWRlbyBRdWFsaXR5JywgbmV3IFZpZGVvUXVhbGl0eVNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdTcGVlZCcsIG5ldyBQbGF5YmFja1NwZWVkU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFRyYWNrJywgbmV3IEF1ZGlvVHJhY2tTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gUXVhbGl0eScsIG5ldyBBdWRpb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3VidGl0bGVzJywgbmV3IFN1YnRpdGxlU2VsZWN0Qm94KCkpXG4gICAgICBdLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudFRpbWUsIGhpZGVJbkxpdmVQbGF5YmFjazogdHJ1ZX0pLFxuICAgICAgICAgICAgbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KSxcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci10b3AnXVxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgVm9sdW1lU2xpZGVyKCksXG4gICAgICAgICAgICBuZXcgU3BhY2VyKCksXG4gICAgICAgICAgICBuZXcgUGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgbmV3IEFpclBsYXlUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBDYXN0VG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgVlJUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBTZXR0aW5nc1RvZ2dsZUJ1dHRvbih7c2V0dGluZ3NQYW5lbDogc2V0dGluZ3NQYW5lbH0pLFxuICAgICAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci1ib3R0b20nXVxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IENhc3RTdGF0dXNPdmVybGF5KCksXG4gICAgICAgIGNvbnRyb2xCYXIsXG4gICAgICAgIG5ldyBUaXRsZUJhcigpLFxuICAgICAgICBuZXcgUmVjb21tZW5kYXRpb25PdmVybGF5KCksXG4gICAgICAgIG5ldyBXYXRlcm1hcmsoKSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXSwgY3NzQ2xhc3NlczogWyd1aS1za2luLW1vZGVybiddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5BZHNVSSgpIHtcbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IEJ1ZmZlcmluZ092ZXJsYXkoKSxcbiAgICAgICAgbmV3IEFkQ2xpY2tPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IEFkTWVzc2FnZUxhYmVsKHt0ZXh0OiAnQWQ6IHtyZW1haW5pbmdUaW1lfSBzZWNzJ30pLFxuICAgICAgICAgICAgbmV3IEFkU2tpcEJ1dHRvbigpXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjc3NDbGFzczogJ3VpLWFkcy1zdGF0dXMnXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgQ29udHJvbEJhcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICAgICAgICAgIG5ldyBTcGFjZXIoKSxcbiAgICAgICAgICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItYm90dG9tJ11cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF1cbiAgICAgICAgfSlcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nLCAndWktc2tpbi1hZHMnXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuU21hbGxTY3JlZW5VSSgpIHtcbiAgICBsZXQgc2V0dGluZ3NQYW5lbCA9IG5ldyBTZXR0aW5nc1BhbmVsKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdWaWRlbyBRdWFsaXR5JywgbmV3IFZpZGVvUXVhbGl0eVNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdTcGVlZCcsIG5ldyBQbGF5YmFja1NwZWVkU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFRyYWNrJywgbmV3IEF1ZGlvVHJhY2tTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gUXVhbGl0eScsIG5ldyBBdWRpb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3VidGl0bGVzJywgbmV3IFN1YnRpdGxlU2VsZWN0Qm94KCkpXG4gICAgICBdLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgaGlkZURlbGF5OiAtMSxcbiAgICB9KTtcbiAgICBzZXR0aW5nc1BhbmVsLmFkZENvbXBvbmVudChuZXcgQ2xvc2VCdXR0b24oe3RhcmdldDogc2V0dGluZ3NQYW5lbH0pKTtcblxuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoe3RpbWVMYWJlbE1vZGU6IFBsYXliYWNrVGltZUxhYmVsTW9kZS5DdXJyZW50VGltZSwgaGlkZUluTGl2ZVBsYXliYWNrOiB0cnVlfSksXG4gICAgICAgICAgICBuZXcgU2Vla0Jhcih7bGFiZWw6IG5ldyBTZWVrQmFyTGFiZWwoKX0pLFxuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuVG90YWxUaW1lLCBjc3NDbGFzc2VzOiBbJ3RleHQtcmlnaHQnXX0pLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLXRvcCddXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTdWJ0aXRsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IEJ1ZmZlcmluZ092ZXJsYXkoKSxcbiAgICAgICAgbmV3IENhc3RTdGF0dXNPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBuZXcgTWV0YWRhdGFMYWJlbCh7Y29udGVudDogTWV0YWRhdGFMYWJlbENvbnRlbnQuVGl0bGV9KSxcbiAgICAgICAgICAgIG5ldyBDYXN0VG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICAvKm5ldyBWUlRvZ2dsZUJ1dHRvbigpLCovXG4gICAgICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgXVxuICAgICAgICB9KSxcbiAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgbmV3IFJlY29tbWVuZGF0aW9uT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nLCAndWktc2tpbi1zbWFsbHNjcmVlbiddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5TbWFsbFNjcmVlbkFkc1VJKCkge1xuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgQnVmZmVyaW5nT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQWRDbGlja092ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgVGl0bGVCYXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIC8vIGR1bW15IGxhYmVsIHdpdGggbm8gY29udGVudCB0byBtb3ZlIGJ1dHRvbnMgdG8gdGhlIHJpZ2h0XG4gICAgICAgICAgICBuZXcgTGFiZWwoe2Nzc0NsYXNzOiAnbGFiZWwtbWV0YWRhdGEtdGl0bGUnfSksXG4gICAgICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgIF1cbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBBZE1lc3NhZ2VMYWJlbCh7dGV4dDogJ0FkOiB7cmVtYWluaW5nVGltZX0gc2Vjcyd9KSxcbiAgICAgICAgICAgIG5ldyBBZFNraXBCdXR0b24oKVxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3NzQ2xhc3M6ICd1aS1hZHMtc3RhdHVzJ1xuICAgICAgICB9KSxcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nLCAndWktc2tpbi1hZHMnLCAndWktc2tpbi1zbWFsbHNjcmVlbiddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5DYXN0UmVjZWl2ZXJVSSgpIHtcbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudFRpbWUsIGhpZGVJbkxpdmVQbGF5YmFjazogdHJ1ZX0pLFxuICAgICAgICAgICAgbmV3IFNlZWtCYXIoe3Ntb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zOiAtMX0pLFxuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuVG90YWxUaW1lLCBjc3NDbGFzc2VzOiBbJ3RleHQtcmlnaHQnXX0pLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLXRvcCddXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBDYXN0VUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFdhdGVybWFyaygpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoe2tlZXBIaWRkZW5XaXRob3V0TWV0YWRhdGE6IHRydWV9KSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXSwgY3NzQ2xhc3NlczogWyd1aS1za2luLW1vZGVybicsICd1aS1za2luLWNhc3QtcmVjZWl2ZXInXVxuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTW9kZXJuVUkocGxheWVyOiBQbGF5ZXJBUEksIGNvbmZpZzogVUlDb25maWcgPSB7fSk6IFVJTWFuYWdlciB7XG4gICAgLy8gc2hvdyBzbWFsbFNjcmVlbiBVSSBvbmx5IG9uIG1vYmlsZS9oYW5kaGVsZCBkZXZpY2VzXG4gICAgbGV0IHNtYWxsU2NyZWVuU3dpdGNoV2lkdGggPSA2MDA7XG5cbiAgICByZXR1cm4gbmV3IFVJTWFuYWdlcihwbGF5ZXIsIFt7XG4gICAgICB1aTogbW9kZXJuU21hbGxTY3JlZW5BZHNVSSgpLFxuICAgICAgY29uZGl0aW9uOiAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmlzTW9iaWxlICYmIGNvbnRleHQuZG9jdW1lbnRXaWR0aCA8IHNtYWxsU2NyZWVuU3dpdGNoV2lkdGggJiYgY29udGV4dC5pc0FkV2l0aFVJO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHVpOiBtb2Rlcm5BZHNVSSgpLFxuICAgICAgY29uZGl0aW9uOiAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmlzQWRXaXRoVUk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgdWk6IG1vZGVyblNtYWxsU2NyZWVuVUkoKSxcbiAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5pc01vYmlsZSAmJiBjb250ZXh0LmRvY3VtZW50V2lkdGggPCBzbWFsbFNjcmVlblN3aXRjaFdpZHRoO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHVpOiBzbWFzaGN1dFVpKClcbiAgICB9XSwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZE1vZGVyblNtYWxsU2NyZWVuVUkocGxheWVyOiBQbGF5ZXJBUEksIGNvbmZpZzogVUlDb25maWcgPSB7fSk6IFVJTWFuYWdlciB7XG4gICAgcmV0dXJuIG5ldyBVSU1hbmFnZXIocGxheWVyLCBbe1xuICAgICAgdWk6IG1vZGVyblNtYWxsU2NyZWVuQWRzVUkoKSxcbiAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5pc0FkV2l0aFVJO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHVpOiBtb2Rlcm5TbWFsbFNjcmVlblVJKClcbiAgICB9XSwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZE1vZGVybkNhc3RSZWNlaXZlclVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgbW9kZXJuQ2FzdFJlY2VpdmVyVUkoKSwgY29uZmlnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlZ2FjeVVJKCkge1xuICAgIGxldCBzZXR0aW5nc1BhbmVsID0gbmV3IFNldHRpbmdzUGFuZWwoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1ZpZGVvIFF1YWxpdHknLCBuZXcgVmlkZW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFRyYWNrJywgbmV3IEF1ZGlvVHJhY2tTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gUXVhbGl0eScsIG5ldyBBdWRpb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3VidGl0bGVzJywgbmV3IFN1YnRpdGxlU2VsZWN0Qm94KCkpXG4gICAgICBdLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBTZWVrQmFyKHtsYWJlbDogbmV3IFNlZWtCYXJMYWJlbCgpfSksXG4gICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCgpLFxuICAgICAgICBuZXcgVlJUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IFZvbHVtZUNvbnRyb2xCdXR0b24oKSxcbiAgICAgICAgbmV3IFNldHRpbmdzVG9nZ2xlQnV0dG9uKHtzZXR0aW5nc1BhbmVsOiBzZXR0aW5nc1BhbmVsfSksXG4gICAgICAgIG5ldyBDYXN0VG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKClcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBDYXN0U3RhdHVzT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBXYXRlcm1hcmsoKSxcbiAgICAgICAgbmV3IFJlY29tbWVuZGF0aW9uT3ZlcmxheSgpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoKSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXSwgY3NzQ2xhc3NlczogWyd1aS1za2luLWxlZ2FjeSddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBsZWdhY3lBZHNVSSgpIHtcbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IEFkQ2xpY2tPdmVybGF5KCksXG4gICAgICAgIG5ldyBDb250cm9sQmFyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBBZE1lc3NhZ2VMYWJlbCgpLFxuICAgICAgICAgICAgbmV3IFZvbHVtZUNvbnRyb2xCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKClcbiAgICAgICAgICBdXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgQWRTa2lwQnV0dG9uKClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1sZWdhY3knLCAndWktc2tpbi1hZHMnXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVnYWN5Q2FzdFJlY2VpdmVyVUkoKSB7XG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZWVrQmFyKCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCgpLFxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTdWJ0aXRsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIGNvbnRyb2xCYXIsXG4gICAgICAgIG5ldyBUaXRsZUJhcigpLFxuICAgICAgICBuZXcgRXJyb3JNZXNzYWdlT3ZlcmxheSgpXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbGVnYWN5JywgJ3VpLXNraW4tY2FzdC1yZWNlaXZlciddXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBsZWdhY3lUZXN0VUkoKSB7XG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gVHJhY2snLCBuZXcgQXVkaW9UcmFja1NlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBRdWFsaXR5JywgbmV3IEF1ZGlvUXVhbGl0eVNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdTdWJ0aXRsZXMnLCBuZXcgU3VidGl0bGVTZWxlY3RCb3goKSlcbiAgICAgIF0sXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9KTtcblxuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW3NldHRpbmdzUGFuZWwsXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgU2Vla0Jhcih7bGFiZWw6IG5ldyBTZWVrQmFyTGFiZWwoKX0pLFxuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoKSxcbiAgICAgICAgbmV3IFZSVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBWb2x1bWVUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICBuZXcgVm9sdW1lQ29udHJvbEJ1dHRvbigpLFxuICAgICAgICBuZXcgVm9sdW1lQ29udHJvbEJ1dHRvbih7dmVydGljYWw6IGZhbHNlfSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1RvZ2dsZUJ1dHRvbih7c2V0dGluZ3NQYW5lbDogc2V0dGluZ3NQYW5lbH0pLFxuICAgICAgICBuZXcgQ2FzdFRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFN1YnRpdGxlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQ2FzdFN0YXR1c092ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIG5ldyBSZWNvbW1lbmRhdGlvbk92ZXJsYXkoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKCksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1sZWdhY3knXVxuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTGVnYWN5VUkocGxheWVyOiBQbGF5ZXJBUEksIGNvbmZpZzogVUlDb25maWcgPSB7fSk6IFVJTWFuYWdlciB7XG4gICAgcmV0dXJuIG5ldyBVSU1hbmFnZXIocGxheWVyLCBbe1xuICAgICAgdWk6IGxlZ2FjeUFkc1VJKCksXG4gICAgICBjb25kaXRpb246IChjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQuaXNBZFdpdGhVSTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB1aTogbGVnYWN5VUkoKVxuICAgIH1dLCBjb25maWcpO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTGVnYWN5Q2FzdFJlY2VpdmVyVUkocGxheWVyOiBQbGF5ZXJBUEksIGNvbmZpZzogVUlDb25maWcgPSB7fSk6IFVJTWFuYWdlciB7XG4gICAgcmV0dXJuIG5ldyBVSU1hbmFnZXIocGxheWVyLCBsZWdhY3lDYXN0UmVjZWl2ZXJVSSgpLCBjb25maWcpO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTGVnYWN5VGVzdFVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgbGVnYWN5VGVzdFVJKCksIGNvbmZpZyk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZWVrUHJldmlld0FyZ3MgZXh0ZW5kcyBOb0FyZ3Mge1xuICAvKipcbiAgICogVGhlIHRpbWVsaW5lIHBvc2l0aW9uIGluIHBlcmNlbnQgd2hlcmUgdGhlIGV2ZW50IG9yaWdpbmF0ZXMgZnJvbS5cbiAgICovXG4gIHBvc2l0aW9uOiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgdGltZWxpbmUgbWFya2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBwb3NpdGlvbiwgaWYgZXhpc3RpbmcuXG4gICAqL1xuICBtYXJrZXI/OiBUaW1lbGluZU1hcmtlcjtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgZnVuY3Rpb25hbGl0eSB0byBtYW5hZ2UgYSBVSSBpbnN0YW5jZS4gVXNlZCBieSB0aGUge0BsaW5rIFVJTWFuYWdlcn0gdG8gbWFuYWdlIG11bHRpcGxlIFVJIGluc3RhbmNlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFVJSW5zdGFuY2VNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBwbGF5ZXJXcmFwcGVyOiBQbGF5ZXJXcmFwcGVyO1xuICBwcml2YXRlIHVpOiBVSUNvbnRhaW5lcjtcbiAgcHJpdmF0ZSBjb25maWc6IFVJQ29uZmlnO1xuXG4gIHByaXZhdGUgZXZlbnRzID0ge1xuICAgIG9uQ29uZmlndXJlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxVSUNvbnRhaW5lciwgTm9BcmdzPigpLFxuICAgIG9uU2VlazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBOb0FyZ3M+KCksXG4gICAgb25TZWVrUHJldmlldzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBTZWVrUHJldmlld0FyZ3M+KCksXG4gICAgb25TZWVrZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPigpLFxuICAgIG9uQ29tcG9uZW50U2hvdzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uQ29tcG9uZW50SGlkZTogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uQ29udHJvbHNTaG93OiBuZXcgRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+KCksXG4gICAgb25QcmV2aWV3Q29udHJvbHNIaWRlOiBuZXcgRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBDYW5jZWxFdmVudEFyZ3M+KCksXG4gICAgb25Db250cm9sc0hpZGU6IG5ldyBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4oKSxcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSwgdWk6IFVJQ29udGFpbmVyLCBjb25maWc6IFVJQ29uZmlnID0ge30pIHtcbiAgICB0aGlzLnBsYXllcldyYXBwZXIgPSBuZXcgUGxheWVyV3JhcHBlcihwbGF5ZXIpO1xuICAgIHRoaXMudWkgPSB1aTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgfVxuXG4gIGdldENvbmZpZygpOiBVSUNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICB9XG5cbiAgZ2V0VUkoKTogVUlDb250YWluZXIge1xuICAgIHJldHVybiB0aGlzLnVpO1xuICB9XG5cbiAgZ2V0UGxheWVyKCk6IFBsYXllckFQSSB7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB3aGVuIHRoZSBVSSBpcyBmdWxseSBjb25maWd1cmVkIGFuZCBhZGRlZCB0byB0aGUgRE9NLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uQ29uZmlndXJlZCgpOiBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbmZpZ3VyZWQ7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiBhIHNlZWsgc3RhcnRzLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uU2VlaygpOiBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9uU2VlaztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB3aGVuIHRoZSBzZWVrIHRpbWVsaW5lIGlzIHNjcnViYmVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uU2Vla1ByZXZpZXcoKTogRXZlbnREaXNwYXRjaGVyPFNlZWtCYXIsIFNlZWtQcmV2aWV3QXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vblNlZWtQcmV2aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gYSBzZWVrIGlzIGZpbmlzaGVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uU2Vla2VkKCk6IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25TZWVrZWQ7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiBhIGNvbXBvbmVudCBpcyBzaG93aW5nLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uQ29tcG9uZW50U2hvdygpOiBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbXBvbmVudFNob3c7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiBhIGNvbXBvbmVudCBpcyBoaWRpbmcuXG4gICAqIEByZXR1cm5zIHtFdmVudERpc3BhdGNoZXJ9XG4gICAqL1xuICBnZXQgb25Db21wb25lbnRIaWRlKCk6IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9uQ29tcG9uZW50SGlkZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB3aGVuIHRoZSBVSSBjb250cm9scyBhcmUgc2hvd2luZy5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvbkNvbnRyb2xzU2hvdygpOiBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbnRyb2xzU2hvdztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyBiZWZvcmUgdGhlIFVJIGNvbnRyb2xzIGFyZSBoaWRpbmcgdG8gY2hlY2sgaWYgdGhleSBhcmUgYWxsb3dlZCB0byBoaWRlLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uUHJldmlld0NvbnRyb2xzSGlkZSgpOiBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIENhbmNlbEV2ZW50QXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vblByZXZpZXdDb250cm9sc0hpZGU7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiB0aGUgVUkgY29udHJvbHMgYXJlIGhpZGluZy5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvbkNvbnRyb2xzSGlkZSgpOiBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbnRyb2xzSGlkZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjbGVhckV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XG4gICAgdGhpcy5wbGF5ZXJXcmFwcGVyLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuXG4gICAgbGV0IGV2ZW50cyA9IDxhbnk+dGhpcy5ldmVudHM7IC8vIGF2b2lkIFRTNzAxN1xuICAgIGZvciAobGV0IGV2ZW50IGluIGV2ZW50cykge1xuICAgICAgbGV0IGRpc3BhdGNoZXIgPSA8RXZlbnREaXNwYXRjaGVyPE9iamVjdCwgT2JqZWN0Pj5ldmVudHNbZXZlbnRdO1xuICAgICAgZGlzcGF0Y2hlci51bnN1YnNjcmliZUFsbCgpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV4dGVuZHMgdGhlIHtAbGluayBVSUluc3RhbmNlTWFuYWdlcn0gZm9yIGludGVybmFsIHVzZSBpbiB0aGUge0BsaW5rIFVJTWFuYWdlcn0gYW5kIHByb3ZpZGVzIGFjY2VzcyB0byBmdW5jdGlvbmFsaXR5XG4gKiB0aGF0IGNvbXBvbmVudHMgcmVjZWl2aW5nIGEgcmVmZXJlbmNlIHRvIHRoZSB7QGxpbmsgVUlJbnN0YW5jZU1hbmFnZXJ9IHNob3VsZCBub3QgaGF2ZSBhY2Nlc3MgdG8uXG4gKi9cbmNsYXNzIEludGVybmFsVUlJbnN0YW5jZU1hbmFnZXIgZXh0ZW5kcyBVSUluc3RhbmNlTWFuYWdlciB7XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVkOiBib29sZWFuO1xuICBwcml2YXRlIHJlbGVhc2VkOiBib29sZWFuO1xuXG4gIGdldFdyYXBwZWRQbGF5ZXIoKTogV3JhcHBlZFBsYXllciB7XG4gICAgLy8gVE9ETyBmaW5kIGEgbm9uLWhhY2t5IHdheSB0byBwcm92aWRlIHRoZSBXcmFwcGVkUGxheWVyIHRvIHRoZSBVSU1hbmFnZXIgd2l0aG91dCBleHBvcnRpbmcgaXRcbiAgICAvLyBnZXRQbGF5ZXIoKSBhY3R1YWxseSByZXR1cm5zIHRoZSBXcmFwcGVkUGxheWVyIGJ1dCBpdHMgcmV0dXJuIHR5cGUgaXMgc2V0IHRvIFBsYXllciBzbyB0aGUgV3JhcHBlZFBsYXllciBkb2VzXG4gICAgLy8gbm90IG5lZWQgdG8gYmUgZXhwb3J0ZWRcbiAgICByZXR1cm4gPFdyYXBwZWRQbGF5ZXI+dGhpcy5nZXRQbGF5ZXIoKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZUNvbnRyb2xzKCk6IHZvaWQge1xuICAgIHRoaXMuY29uZmlndXJlQ29udHJvbHNUcmVlKHRoaXMuZ2V0VUkoKSk7XG4gICAgdGhpcy5jb25maWd1cmVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlzQ29uZmlndXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVDb250cm9sc1RyZWUoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPikge1xuICAgIGxldCBjb25maWd1cmVkQ29tcG9uZW50czogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz5bXSA9IFtdO1xuXG4gICAgVUlVdGlscy50cmF2ZXJzZVRyZWUoY29tcG9uZW50LCAoY29tcG9uZW50KSA9PiB7XG4gICAgICAvLyBGaXJzdCwgY2hlY2sgaWYgd2UgaGF2ZSBhbHJlYWR5IGNvbmZpZ3VyZWQgYSBjb21wb25lbnQsIGFuZCB0aHJvdyBhbiBlcnJvciBpZiB3ZSBkaWQuIE11bHRpcGxlIGNvbmZpZ3VyYXRpb25cbiAgICAgIC8vIG9mIHRoZSBzYW1lIGNvbXBvbmVudCBsZWFkcyB0byB1bmV4cGVjdGVkIFVJIGJlaGF2aW9yLiBBbHNvLCBhIGNvbXBvbmVudCB0aGF0IGlzIGluIHRoZSBVSSB0cmVlIG11bHRpcGxlXG4gICAgICAvLyB0aW1lcyBoaW50cyBhdCBhIHdyb25nIFVJIHN0cnVjdHVyZS5cbiAgICAgIC8vIFdlIGNvdWxkIGp1c3Qgc2tpcCBjb25maWd1cmF0aW9uIGluIHN1Y2ggYSBjYXNlIGFuZCBub3QgdGhyb3cgYW4gZXhjZXB0aW9uLCBidXQgZW5mb3JjaW5nIGEgY2xlYW4gVUkgdHJlZVxuICAgICAgLy8gc2VlbXMgbGlrZSB0aGUgYmV0dGVyIGNob2ljZS5cbiAgICAgIGZvciAobGV0IGNvbmZpZ3VyZWRDb21wb25lbnQgb2YgY29uZmlndXJlZENvbXBvbmVudHMpIHtcbiAgICAgICAgaWYgKGNvbmZpZ3VyZWRDb21wb25lbnQgPT09IGNvbXBvbmVudCkge1xuICAgICAgICAgIC8vIFdyaXRlIHRoZSBjb21wb25lbnQgdG8gdGhlIGNvbnNvbGUgdG8gc2ltcGxpZnkgaWRlbnRpZmljYXRpb24gb2YgdGhlIGN1bHByaXRcbiAgICAgICAgICAvLyAoZS5nLiBieSBpbnNwZWN0aW5nIHRoZSBjb25maWcpXG4gICAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBpbiBVSSB0cmVlJywgY29tcG9uZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBZGRpdGlvbmFsbHkgdGhyb3cgYW4gZXJyb3IsIGJlY2F1c2UgdGhpcyBjYXNlIG11c3Qgbm90IGhhcHBlbiBhbmQgbGVhZHMgdG8gdW5leHBlY3RlZCBVSSBiZWhhdmlvci5cbiAgICAgICAgICB0aHJvdyBFcnJvcignQ2lyY3VsYXIgcmVmZXJlbmNlIGluIFVJIHRyZWU6ICcgKyBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50LmluaXRpYWxpemUoKTtcbiAgICAgIGNvbXBvbmVudC5jb25maWd1cmUodGhpcy5nZXRQbGF5ZXIoKSwgdGhpcyk7XG4gICAgICBjb25maWd1cmVkQ29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgfSk7XG4gIH1cblxuICByZWxlYXNlQ29udHJvbHMoKTogdm9pZCB7XG4gICAgLy8gRG8gbm90IGNhbGwgcmVsZWFzZSBtZXRob2RzIGlmIHRoZSBjb21wb25lbnRzIGhhdmUgbmV2ZXIgYmVlbiBjb25maWd1cmVkOyB0aGlzIGNhbiByZXN1bHQgaW4gZXhjZXB0aW9uc1xuICAgIGlmICh0aGlzLmNvbmZpZ3VyZWQpIHtcbiAgICAgIHRoaXMucmVsZWFzZUNvbnRyb2xzVHJlZSh0aGlzLmdldFVJKCkpO1xuICAgICAgdGhpcy5jb25maWd1cmVkID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMucmVsZWFzZWQgPSB0cnVlO1xuICB9XG5cbiAgaXNSZWxlYXNlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yZWxlYXNlZDtcbiAgfVxuXG4gIHByaXZhdGUgcmVsZWFzZUNvbnRyb2xzVHJlZShjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSB7XG4gICAgY29tcG9uZW50LnJlbGVhc2UoKTtcblxuICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb250YWluZXIpIHtcbiAgICAgIGZvciAobGV0IGNoaWxkQ29tcG9uZW50IG9mIGNvbXBvbmVudC5nZXRDb21wb25lbnRzKCkpIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlQ29udHJvbHNUcmVlKGNoaWxkQ29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbGVhckV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XG4gICAgc3VwZXIuY2xlYXJFdmVudEhhbmRsZXJzKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRlbmRlZCBpbnRlcmZhY2Ugb2YgdGhlIHtAbGluayBQbGF5ZXJ9IGZvciB1c2UgaW4gdGhlIFVJLlxuICovXG5pbnRlcmZhY2UgV3JhcHBlZFBsYXllciBleHRlbmRzIFBsYXllckFQSSB7XG4gIC8qKlxuICAgKiBGaXJlcyBhbiBldmVudCBvbiB0aGUgcGxheWVyIHRoYXQgdGFyZ2V0cyBhbGwgaGFuZGxlcnMgaW4gdGhlIFVJIGJ1dCBuZXZlciBlbnRlcnMgdGhlIHJlYWwgcGxheWVyLlxuICAgKiBAcGFyYW0gZXZlbnQgdGhlIGV2ZW50IHRvIGZpcmVcbiAgICogQHBhcmFtIGRhdGEgZGF0YSB0byBzZW5kIHdpdGggdGhlIGV2ZW50XG4gICAqL1xuICBmaXJlRXZlbnRJblVJKGV2ZW50OiBFVkVOVCwgZGF0YToge30pOiB2b2lkO1xufVxuXG4vKipcbiAqIFdyYXBzIHRoZSBwbGF5ZXIgdG8gdHJhY2sgZXZlbnQgaGFuZGxlcnMgYW5kIHByb3ZpZGUgYSBzaW1wbGUgbWV0aG9kIHRvIHJlbW92ZSBhbGwgcmVnaXN0ZXJlZCBldmVudFxuICogaGFuZGxlcnMgZnJvbSB0aGUgcGxheWVyLlxuICovXG5jbGFzcyBQbGF5ZXJXcmFwcGVyIHtcblxuICBwcml2YXRlIHBsYXllcjogUGxheWVyQVBJO1xuICBwcml2YXRlIHdyYXBwZXI6IFdyYXBwZWRQbGF5ZXI7XG5cbiAgcHJpdmF0ZSBldmVudEhhbmRsZXJzOiB7IFtldmVudFR5cGU6IHN0cmluZ106IFBsYXllckV2ZW50Q2FsbGJhY2tbXTsgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHBsYXllcjogUGxheWVyQVBJKSB7XG4gICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBwdWJsaWMgQVBJIG1ldGhvZHMgb2YgdGhlIHBsYXllclxuICAgIGxldCBtZXRob2RzID0gPGFueVtdPltdO1xuICAgIGZvciAobGV0IG1lbWJlciBpbiBwbGF5ZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgKDxhbnk+cGxheWVyKVttZW1iZXJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1ldGhvZHMucHVzaChtZW1iZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSB3cmFwcGVyIG9iamVjdCBhbmQgYWRkIGZ1bmN0aW9uIHdyYXBwZXJzIGZvciBhbGwgQVBJIG1ldGhvZHMgdGhhdCBkbyBub3RoaW5nIGJ1dCBjYWxsaW5nIHRoZSBiYXNlIG1ldGhvZFxuICAgIC8vIG9uIHRoZSBwbGF5ZXJcbiAgICBsZXQgd3JhcHBlciA9IDxhbnk+e307XG4gICAgZm9yIChsZXQgbWVtYmVyIG9mIG1ldGhvZHMpIHtcbiAgICAgIHdyYXBwZXJbbWVtYmVyXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxlZCAnICsgbWVtYmVyKTsgLy8gdHJhY2sgbWV0aG9kIGNhbGxzIG9uIHRoZSBwbGF5ZXJcbiAgICAgICAgcmV0dXJuICg8YW55PnBsYXllcilbbWVtYmVyXS5hcHBseShwbGF5ZXIsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIENvbGxlY3QgYWxsIHB1YmxpYyBwcm9wZXJ0aWVzIG9mIHRoZSBwbGF5ZXIgYW5kIGFkZCBpdCB0byB0aGUgd3JhcHBlclxuICAgIGZvciAobGV0IG1lbWJlciBpbiBwbGF5ZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgKDxhbnk+cGxheWVyKVttZW1iZXJdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHdyYXBwZXJbbWVtYmVyXSA9ICg8YW55PnBsYXllcilbbWVtYmVyXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeHBsaWNpdGx5IGFkZCBhIHdyYXBwZXIgbWV0aG9kIGZvciAnYWRkRXZlbnRIYW5kbGVyJyB0aGF0IGFkZHMgYWRkZWQgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGV2ZW50IGxpc3RcbiAgICB3cmFwcGVyLmFkZEV2ZW50SGFuZGxlciA9IChldmVudFR5cGU6IEVWRU5ULCBjYWxsYmFjazogUGxheWVyRXZlbnRDYWxsYmFjaykgPT4ge1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihldmVudFR5cGUsIGNhbGxiYWNrKTtcblxuICAgICAgaWYgKCF0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSkge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSA9IFtdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXS5wdXNoKGNhbGxiYWNrKTtcblxuICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfTtcblxuICAgIC8vIEV4cGxpY2l0bHkgYWRkIGEgd3JhcHBlciBtZXRob2QgZm9yICdyZW1vdmVFdmVudEhhbmRsZXInIHRoYXQgcmVtb3ZlcyByZW1vdmVkIGV2ZW50IGhhbmRsZXJzIGZyb20gdGhlIGV2ZW50IGxpc3RcbiAgICB3cmFwcGVyLnJlbW92ZUV2ZW50SGFuZGxlciA9IChldmVudFR5cGU6IEVWRU5ULCBjYWxsYmFjazogUGxheWVyRXZlbnRDYWxsYmFjaykgPT4ge1xuICAgICAgcGxheWVyLnJlbW92ZUV2ZW50SGFuZGxlcihldmVudFR5cGUsIGNhbGxiYWNrKTtcblxuICAgICAgaWYgKHRoaXMuZXZlbnRIYW5kbGVyc1tldmVudFR5cGVdKSB7XG4gICAgICAgIEFycmF5VXRpbHMucmVtb3ZlKHRoaXMuZXZlbnRIYW5kbGVyc1tldmVudFR5cGVdLCBjYWxsYmFjayk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH07XG5cbiAgICB3cmFwcGVyLmZpcmVFdmVudEluVUkgPSAoZXZlbnQ6IEVWRU5ULCBkYXRhOiB7fSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZXZlbnRIYW5kbGVyc1tldmVudF0pIHsgLy8gY2hlY2sgaWYgdGhlcmUgYXJlIGhhbmRsZXJzIGZvciB0aGlzIGV2ZW50IHJlZ2lzdGVyZWRcbiAgICAgICAgLy8gRXh0ZW5kIHRoZSBkYXRhIG9iamVjdCB3aXRoIGRlZmF1bHQgdmFsdWVzIHRvIGNvbnZlcnQgaXQgdG8gYSB7QGxpbmsgUGxheWVyRXZlbnR9IG9iamVjdC5cbiAgICAgICAgbGV0IHBsYXllckV2ZW50RGF0YSA9IDxQbGF5ZXJFdmVudD5PYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgIHR5cGU6IGV2ZW50LFxuICAgICAgICAgIC8vIEFkZCBhIG1hcmtlciBwcm9wZXJ0eSBzbyB0aGUgVUkgY2FuIGRldGVjdCBVSS1pbnRlcm5hbCBwbGF5ZXIgZXZlbnRzXG4gICAgICAgICAgdWlTb3VyY2VkOiB0cnVlLFxuICAgICAgICB9LCBkYXRhKTtcblxuICAgICAgICAvLyBFeGVjdXRlIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrc1xuICAgICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRdKSB7XG4gICAgICAgICAgY2FsbGJhY2socGxheWVyRXZlbnREYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLndyYXBwZXIgPSA8V3JhcHBlZFBsYXllcj53cmFwcGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB3cmFwcGVkIHBsYXllciBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCBvbiBwbGFjZSBvZiB0aGUgbm9ybWFsIHBsYXllciBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtXcmFwcGVkUGxheWVyfSBhIHdyYXBwZWQgcGxheWVyXG4gICAqL1xuICBnZXRQbGF5ZXIoKTogV3JhcHBlZFBsYXllciB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIHJlZ2lzdGVyZWQgZXZlbnQgaGFuZGxlcnMgZnJvbSB0aGUgcGxheWVyIHRoYXQgd2VyZSBhZGRlZCB0aHJvdWdoIHRoZSB3cmFwcGVkIHBsYXllci5cbiAgICovXG4gIGNsZWFyRXZlbnRIYW5kbGVycygpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBldmVudFR5cGUgaW4gdGhpcy5ldmVudEhhbmRsZXJzKSB7XG4gICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSkge1xuICAgICAgICB0aGlzLnBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgRXZlbnQsIE5vQXJnc30gZnJvbSAnLi9ldmVudGRpc3BhdGNoZXInO1xuaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnRzL2NvbXBvbmVudCc7XG5pbXBvcnQge0NvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcic7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQXJyYXlVdGlscyB7XG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSBhbiBhcnJheS5cbiAgICogQHBhcmFtIGFycmF5IHRoZSBhcnJheSB0aGF0IG1heSBjb250YWluIHRoZSBpdGVtIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gaXRlbSB0aGUgaXRlbSB0byByZW1vdmUgZnJvbSB0aGUgYXJyYXlcbiAgICogQHJldHVybnMge2FueX0gdGhlIHJlbW92ZWQgaXRlbSBvciBudWxsIGlmIGl0IHdhc24ndCBwYXJ0IG9mIHRoZSBhcnJheVxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZTxUPihhcnJheTogVFtdLCBpdGVtOiBUKTogVCB8IG51bGwge1xuICAgIGxldCBpbmRleCA9IGFycmF5LmluZGV4T2YoaXRlbSk7XG5cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgcmV0dXJuIGFycmF5LnNwbGljZShpbmRleCwgMSlbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIFN0cmluZ1V0aWxzIHtcblxuICBleHBvcnQgbGV0IEZPUk1BVF9ISE1NU1M6IHN0cmluZyA9ICdoaDptbTpzcyc7XG4gIGV4cG9ydCBsZXQgRk9STUFUX01NU1M6IHN0cmluZyA9ICdtbTpzcyc7XG5cbiAgLyoqXG4gICAqIEZvcm1hdHMgYSBudW1iZXIgb2Ygc2Vjb25kcyBpbnRvIGEgdGltZSBzdHJpbmcgd2l0aCB0aGUgcGF0dGVybiBoaDptbTpzcy5cbiAgICpcbiAgICogQHBhcmFtIHRvdGFsU2Vjb25kcyB0aGUgdG90YWwgbnVtYmVyIG9mIHNlY29uZHMgdG8gZm9ybWF0IHRvIHN0cmluZ1xuICAgKiBAcGFyYW0gZm9ybWF0IHRoZSB0aW1lIGZvcm1hdCB0byBvdXRwdXQgKGRlZmF1bHQ6IGhoOm1tOnNzKVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZm9ybWF0dGVkIHRpbWUgc3RyaW5nXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gc2Vjb25kc1RvVGltZSh0b3RhbFNlY29uZHM6IG51bWJlciwgZm9ybWF0OiBzdHJpbmcgPSBGT1JNQVRfSEhNTVNTKTogc3RyaW5nIHtcbiAgICBsZXQgaXNOZWdhdGl2ZSA9IHRvdGFsU2Vjb25kcyA8IDA7XG5cbiAgICBpZiAoaXNOZWdhdGl2ZSkge1xuICAgICAgLy8gSWYgdGhlIHRpbWUgaXMgbmVnYXRpdmUsIHdlIG1ha2UgaXQgcG9zaXRpdmUgZm9yIHRoZSBjYWxjdWxhdGlvbiBiZWxvd1xuICAgICAgLy8gKGVsc2Ugd2UnZCBnZXQgYWxsIG5lZ2F0aXZlIG51bWJlcnMpIGFuZCByZWF0dGFjaCB0aGUgbmVnYXRpdmUgc2lnbiBsYXRlci5cbiAgICAgIHRvdGFsU2Vjb25kcyA9IC10b3RhbFNlY29uZHM7XG4gICAgfVxuXG4gICAgLy8gU3BsaXQgaW50byBzZXBhcmF0ZSB0aW1lIHBhcnRzXG4gICAgbGV0IGhvdXJzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyAzNjAwKTtcbiAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApIC0gaG91cnMgKiA2MDtcbiAgICBsZXQgc2Vjb25kcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzKSAlIDYwO1xuXG4gICAgcmV0dXJuIChpc05lZ2F0aXZlID8gJy0nIDogJycpICsgZm9ybWF0XG4gICAgICAgIC5yZXBsYWNlKCdoaCcsIGxlZnRQYWRXaXRoWmVyb3MoaG91cnMsIDIpKVxuICAgICAgICAucmVwbGFjZSgnbW0nLCBsZWZ0UGFkV2l0aFplcm9zKG1pbnV0ZXMsIDIpKVxuICAgICAgICAucmVwbGFjZSgnc3MnLCBsZWZ0UGFkV2l0aFplcm9zKHNlY29uZHMsIDIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG51bWJlciB0byBhIHN0cmluZyBhbmQgbGVmdC1wYWRzIGl0IHdpdGggemVyb3MgdG8gdGhlIHNwZWNpZmllZCBsZW5ndGguXG4gICAqIEV4YW1wbGU6IGxlZnRQYWRXaXRoWmVyb3MoMTIzLCA1KSA9PiAnMDAxMjMnXG4gICAqXG4gICAqIEBwYXJhbSBudW0gdGhlIG51bWJlciB0byBjb252ZXJ0IHRvIHN0cmluZyBhbmQgcGFkIHdpdGggemVyb3NcbiAgICogQHBhcmFtIGxlbmd0aCB0aGUgZGVzaXJlZCBsZW5ndGggb2YgdGhlIHBhZGRlZCBzdHJpbmdcbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHBhZGRlZCBudW1iZXIgYXMgc3RyaW5nXG4gICAqL1xuICBmdW5jdGlvbiBsZWZ0UGFkV2l0aFplcm9zKG51bTogbnVtYmVyIHwgc3RyaW5nLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgbGV0IHRleHQgPSBudW0gKyAnJztcbiAgICBsZXQgcGFkZGluZyA9ICcwMDAwMDAwMDAwJy5zdWJzdHIoMCwgbGVuZ3RoIC0gdGV4dC5sZW5ndGgpO1xuICAgIHJldHVybiBwYWRkaW5nICsgdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWxscyBvdXQgcGxhY2Vob2xkZXJzIGluIGFuIGFkIG1lc3NhZ2UuXG4gICAqXG4gICAqIEhhcyB0aGUgcGxhY2Vob2xkZXJzICd7cmVtYWluaW5nVGltZVtmb3JtYXRTdHJpbmddfScsICd7cGxheWVkVGltZVtmb3JtYXRTdHJpbmddfScgYW5kXG4gICAqICd7YWREdXJhdGlvbltmb3JtYXRTdHJpbmddfScsIHdoaWNoIGFyZSByZXBsYWNlZCBieSB0aGUgcmVtYWluaW5nIHRpbWUgdW50aWwgdGhlIGFkIGNhbiBiZSBza2lwcGVkLCB0aGUgY3VycmVudFxuICAgKiB0aW1lIG9yIHRoZSBhZCBkdXJhdGlvbi4gVGhlIGZvcm1hdCBzdHJpbmcgaXMgb3B0aW9uYWwuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBwbGFjZWhvbGRlciBpcyByZXBsYWNlZCBieSB0aGUgdGltZVxuICAgKiBpbiBzZWNvbmRzLiBJZiBzcGVjaWZpZWQsIGl0IG11c3QgYmUgb2YgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAqIC0gJWQgLSBJbnNlcnRzIHRoZSB0aW1lIGFzIGFuIGludGVnZXIuXG4gICAqIC0gJTBOZCAtIEluc2VydHMgdGhlIHRpbWUgYXMgYW4gaW50ZWdlciB3aXRoIGxlYWRpbmcgemVyb2VzLCBpZiB0aGUgbGVuZ3RoIG9mIHRoZSB0aW1lIHN0cmluZyBpcyBzbWFsbGVyIHRoYW4gTi5cbiAgICogLSAlZiAtIEluc2VydHMgdGhlIHRpbWUgYXMgYSBmbG9hdC5cbiAgICogLSAlME5mIC0gSW5zZXJ0cyB0aGUgdGltZSBhcyBhIGZsb2F0IHdpdGggbGVhZGluZyB6ZXJvZXMuXG4gICAqIC0gJS5NZiAtIEluc2VydHMgdGhlIHRpbWUgYXMgYSBmbG9hdCB3aXRoIE0gZGVjaW1hbCBwbGFjZXMuIENhbiBiZSBjb21iaW5lZCB3aXRoICUwTmYsIGUuZy4gJTA0LjJmICh0aGUgdGltZVxuICAgKiAxMC4xMjNcbiAgICogd291bGQgYmUgcHJpbnRlZCBhcyAwMDEwLjEyKS5cbiAgICogLSAlaGg6bW06c3NcbiAgICogLSAlbW06c3NcbiAgICpcbiAgICogQHBhcmFtIGFkTWVzc2FnZSBhbiBhZCBtZXNzYWdlIHdpdGggb3B0aW9uYWwgcGxhY2Vob2xkZXJzIHRvIGZpbGxcbiAgICogQHBhcmFtIHNraXBPZmZzZXQgaWYgc3BlY2lmaWVkLCB7cmVtYWluaW5nVGltZX0gd2lsbCBiZSBmaWxsZWQgd2l0aCB0aGUgcmVtYWluaW5nIHRpbWUgdW50aWwgdGhlIGFkIGNhbiBiZSBza2lwcGVkXG4gICAqIEBwYXJhbSBwbGF5ZXIgdGhlIHBsYXllciB0byBnZXQgdGhlIHRpbWUgZGF0YSBmcm9tXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBhZCBtZXNzYWdlIHdpdGggZmlsbGVkIHBsYWNlaG9sZGVyc1xuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VBZE1lc3NhZ2VQbGFjZWhvbGRlcnMoYWRNZXNzYWdlOiBzdHJpbmcsIHNraXBPZmZzZXQ6IG51bWJlciwgcGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEkpIHtcbiAgICBsZXQgYWRNZXNzYWdlUGxhY2Vob2xkZXJSZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAnXFxcXHsocmVtYWluaW5nVGltZXxwbGF5ZWRUaW1lfGFkRHVyYXRpb24pKH18JSgoMFsxLTldXFxcXGQqKFxcXFwuXFxcXGQrKGR8Zil8ZHxmKXxcXFxcLlxcXFxkK2Z8ZHxmKXxoaDptbTpzc3xtbTpzcyl9KScsXG4gICAgICAnZydcbiAgICApO1xuXG4gICAgcmV0dXJuIGFkTWVzc2FnZS5yZXBsYWNlKGFkTWVzc2FnZVBsYWNlaG9sZGVyUmVnZXgsIChmb3JtYXRTdHJpbmcpID0+IHtcbiAgICAgIGxldCB0aW1lID0gMDtcbiAgICAgIGlmIChmb3JtYXRTdHJpbmcuaW5kZXhPZigncmVtYWluaW5nVGltZScpID4gLTEpIHtcbiAgICAgICAgaWYgKHNraXBPZmZzZXQpIHtcbiAgICAgICAgICB0aW1lID0gTWF0aC5jZWlsKHNraXBPZmZzZXQgLSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGltZSA9IHBsYXllci5nZXREdXJhdGlvbigpIC0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZm9ybWF0U3RyaW5nLmluZGV4T2YoJ3BsYXllZFRpbWUnKSA+IC0xKSB7XG4gICAgICAgIHRpbWUgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICAgIH0gZWxzZSBpZiAoZm9ybWF0U3RyaW5nLmluZGV4T2YoJ2FkRHVyYXRpb24nKSA+IC0xKSB7XG4gICAgICAgIHRpbWUgPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmb3JtYXROdW1iZXIodGltZSwgZm9ybWF0U3RyaW5nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE51bWJlcih0aW1lOiBudW1iZXIsIGZvcm1hdDogc3RyaW5nKSB7XG4gICAgbGV0IGZvcm1hdFN0cmluZ1ZhbGlkYXRpb25SZWdleCA9IC8lKCgwWzEtOV1cXGQqKFxcLlxcZCsoZHxmKXxkfGYpfFxcLlxcZCtmfGR8Zil8aGg6bW06c3N8bW06c3MpLztcbiAgICBsZXQgbGVhZGluZ1plcm9lc1JlZ2V4ID0gLyglMFsxLTldXFxkKikoPz0oXFwuXFxkK2Z8ZnxkKSkvO1xuICAgIGxldCBkZWNpbWFsUGxhY2VzUmVnZXggPSAvXFwuXFxkKig/PWYpLztcblxuICAgIGlmICghZm9ybWF0U3RyaW5nVmFsaWRhdGlvblJlZ2V4LnRlc3QoZm9ybWF0KSkge1xuICAgICAgLy8gSWYgdGhlIGZvcm1hdCBpcyBpbnZhbGlkLCB3ZSBzZXQgYSBkZWZhdWx0IGZhbGxiYWNrIGZvcm1hdFxuICAgICAgZm9ybWF0ID0gJyVkJztcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm9zXG4gICAgbGV0IGxlYWRpbmdaZXJvZXMgPSAwO1xuICAgIGxldCBsZWFkaW5nWmVyb2VzTWF0Y2hlcyA9IGZvcm1hdC5tYXRjaChsZWFkaW5nWmVyb2VzUmVnZXgpO1xuICAgIGlmIChsZWFkaW5nWmVyb2VzTWF0Y2hlcykge1xuICAgICAgbGVhZGluZ1plcm9lcyA9IHBhcnNlSW50KGxlYWRpbmdaZXJvZXNNYXRjaGVzWzBdLnN1YnN0cmluZygyKSk7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXNcbiAgICBsZXQgbnVtRGVjaW1hbFBsYWNlcyA9IG51bGw7XG4gICAgbGV0IGRlY2ltYWxQbGFjZXNNYXRjaGVzID0gZm9ybWF0Lm1hdGNoKGRlY2ltYWxQbGFjZXNSZWdleCk7XG4gICAgaWYgKGRlY2ltYWxQbGFjZXNNYXRjaGVzICYmICFpc05hTihwYXJzZUludChkZWNpbWFsUGxhY2VzTWF0Y2hlc1swXS5zdWJzdHJpbmcoMSkpKSkge1xuICAgICAgbnVtRGVjaW1hbFBsYWNlcyA9IHBhcnNlSW50KGRlY2ltYWxQbGFjZXNNYXRjaGVzWzBdLnN1YnN0cmluZygxKSk7XG4gICAgICBpZiAobnVtRGVjaW1hbFBsYWNlcyA+IDIwKSB7XG4gICAgICAgIG51bURlY2ltYWxQbGFjZXMgPSAyMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGbG9hdCBmb3JtYXRcbiAgICBpZiAoZm9ybWF0LmluZGV4T2YoJ2YnKSA+IC0xKSB7XG4gICAgICBsZXQgdGltZVN0cmluZyA9ICcnO1xuXG4gICAgICBpZiAobnVtRGVjaW1hbFBsYWNlcyAhPT0gbnVsbCkge1xuICAgICAgICAvLyBBcHBseSBmaXhlZCBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXNcbiAgICAgICAgdGltZVN0cmluZyA9IHRpbWUudG9GaXhlZChudW1EZWNpbWFsUGxhY2VzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVTdHJpbmcgPSAnJyArIHRpbWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGxlYWRpbmcgemVyb3NcbiAgICAgIGlmICh0aW1lU3RyaW5nLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKHRpbWVTdHJpbmcsIHRpbWVTdHJpbmcubGVuZ3RoICsgKGxlYWRpbmdaZXJvZXMgLSB0aW1lU3RyaW5nLmluZGV4T2YoJy4nKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxlZnRQYWRXaXRoWmVyb3ModGltZVN0cmluZywgbGVhZGluZ1plcm9lcyk7XG4gICAgICB9XG5cbiAgICB9XG4gICAgLy8gVGltZSBmb3JtYXRcbiAgICBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZignOicpID4gLTEpIHtcbiAgICAgIGxldCB0b3RhbFNlY29uZHMgPSBNYXRoLmNlaWwodGltZSk7XG5cbiAgICAgIC8vIGhoOm1tOnNzIGZvcm1hdFxuICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdoaCcpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHNlY29uZHNUb1RpbWUodG90YWxTZWNvbmRzKTtcbiAgICAgIH1cbiAgICAgIC8vIG1tOnNzIGZvcm1hdFxuICAgICAgZWxzZSB7XG4gICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyA2MCk7XG4gICAgICAgIGxldCBzZWNvbmRzID0gdG90YWxTZWNvbmRzICUgNjA7XG5cbiAgICAgICAgcmV0dXJuIGxlZnRQYWRXaXRoWmVyb3MobWludXRlcywgMikgKyAnOicgKyBsZWZ0UGFkV2l0aFplcm9zKHNlY29uZHMsIDIpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJbnRlZ2VyIGZvcm1hdFxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIGxlZnRQYWRXaXRoWmVyb3MoTWF0aC5jZWlsKHRpbWUpLCBsZWFkaW5nWmVyb2VzKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBQbGF5ZXJVdGlscyB7XG5cbiAgaW1wb3J0IFBsYXllckFQSSA9IGJpdG1vdmluLlBsYXllckFQSTtcblxuICBleHBvcnQgZW51bSBQbGF5ZXJTdGF0ZSB7XG4gICAgSURMRSxcbiAgICBQUkVQQVJFRCxcbiAgICBQTEFZSU5HLFxuICAgIFBBVVNFRCxcbiAgICBGSU5JU0hFRCxcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBpc1NvdXJjZUxvYWRlZChwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaXNUaW1lU2hpZnRBdmFpbGFibGUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcGxheWVyLmlzTGl2ZSgpICYmIHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAhPT0gMDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZShwbGF5ZXI6IFBsYXllckFQSSk6IFBsYXllclN0YXRlIHtcbiAgICBpZiAocGxheWVyLmhhc0VuZGVkKCkpIHtcbiAgICAgIHJldHVybiBQbGF5ZXJTdGF0ZS5GSU5JU0hFRDtcbiAgICB9IGVsc2UgaWYgKHBsYXllci5pc1BsYXlpbmcoKSkge1xuICAgICAgcmV0dXJuIFBsYXllclN0YXRlLlBMQVlJTkc7XG4gICAgfSBlbHNlIGlmIChwbGF5ZXIuaXNQYXVzZWQoKSkge1xuICAgICAgcmV0dXJuIFBsYXllclN0YXRlLlBBVVNFRDtcbiAgICB9IGVsc2UgaWYgKGlzU291cmNlTG9hZGVkKHBsYXllcikpIHtcbiAgICAgIHJldHVybiBQbGF5ZXJTdGF0ZS5QUkVQQVJFRDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFBsYXllclN0YXRlLklETEU7XG4gICAgfVxuICB9XG5cbiAgZXhwb3J0IGludGVyZmFjZSBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncyBleHRlbmRzIE5vQXJncyB7XG4gICAgdGltZVNoaWZ0QXZhaWxhYmxlOiBib29sZWFuO1xuICB9XG5cbiAgZXhwb3J0IGNsYXNzIFRpbWVTaGlmdEF2YWlsYWJpbGl0eURldGVjdG9yIHtcblxuICAgIHByaXZhdGUgcGxheWVyOiBQbGF5ZXJBUEk7XG4gICAgcHJpdmF0ZSB0aW1lU2hpZnRBdmFpbGFibGU6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSB0aW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkRXZlbnQgPSBuZXcgRXZlbnREaXNwYXRjaGVyPFBsYXllckFQSSwgVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3M+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSkge1xuICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICB0aGlzLnRpbWVTaGlmdEF2YWlsYWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgbGV0IHRpbWVTaGlmdERldGVjdG9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmRldGVjdCgpO1xuICAgICAgfTtcbiAgICAgIC8vIFRyeSB0byBkZXRlY3QgdGltZXNoaWZ0IGF2YWlsYWJpbGl0eSBpbiBPTl9SRUFEWSwgd2hpY2ggd29ya3MgZm9yIERBU0ggc3RyZWFtc1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHRpbWVTaGlmdERldGVjdG9yKTtcbiAgICAgIC8vIFdpdGggSExTL05hdGl2ZVBsYXllciBzdHJlYW1zLCBnZXRNYXhUaW1lU2hpZnQgY2FuIGJlIDAgYmVmb3JlIHRoZSBidWZmZXIgZmlsbHMsIHNvIHdlIG5lZWQgdG8gYWRkaXRpb25hbGx5XG4gICAgICAvLyBjaGVjayB0aW1lc2hpZnQgYXZhaWxhYmlsaXR5IGluIE9OX1RJTUVfQ0hBTkdFRFxuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCB0aW1lU2hpZnREZXRlY3Rvcik7XG4gICAgfVxuXG4gICAgZGV0ZWN0KCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMucGxheWVyLmlzTGl2ZSgpKSB7XG4gICAgICAgIGxldCB0aW1lU2hpZnRBdmFpbGFibGVOb3cgPSBQbGF5ZXJVdGlscy5pc1RpbWVTaGlmdEF2YWlsYWJsZSh0aGlzLnBsYXllcik7XG5cbiAgICAgICAgLy8gV2hlbiB0aGUgYXZhaWxhYmlsaXR5IGNoYW5nZXMsIHdlIGZpcmUgdGhlIGV2ZW50XG4gICAgICAgIGlmICh0aW1lU2hpZnRBdmFpbGFibGVOb3cgIT09IHRoaXMudGltZVNoaWZ0QXZhaWxhYmxlKSB7XG4gICAgICAgICAgdGhpcy50aW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkRXZlbnQuZGlzcGF0Y2godGhpcy5wbGF5ZXIsIHsgdGltZVNoaWZ0QXZhaWxhYmxlOiB0aW1lU2hpZnRBdmFpbGFibGVOb3cgfSk7XG4gICAgICAgICAgdGhpcy50aW1lU2hpZnRBdmFpbGFibGUgPSB0aW1lU2hpZnRBdmFpbGFibGVOb3c7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgb25UaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkKCk6IEV2ZW50PFBsYXllckFQSSwgVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3M+IHtcbiAgICAgIHJldHVybiB0aGlzLnRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRFdmVudC5nZXRFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIGV4cG9ydCBpbnRlcmZhY2UgTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzIGV4dGVuZHMgTm9BcmdzIHtcbiAgICBsaXZlOiBib29sZWFuO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVjdHMgY2hhbmdlcyBvZiB0aGUgc3RyZWFtIHR5cGUsIGkuZS4gY2hhbmdlcyBvZiB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBwbGF5ZXIjaXNMaXZlIG1ldGhvZC5cbiAgICogTm9ybWFsbHksIGEgc3RyZWFtIGNhbm5vdCBjaGFuZ2UgaXRzIHR5cGUgZHVyaW5nIHBsYXliYWNrLCBpdCdzIGVpdGhlciBWT0Qgb3IgbGl2ZS4gRHVlIHRvIGJ1Z3Mgb24gc29tZVxuICAgKiBwbGF0Zm9ybXMgb3IgYnJvd3NlcnMsIGl0IGNhbiBzdGlsbCBjaGFuZ2UuIEl0IGlzIHRoZXJlZm9yZSB1bnJlbGlhYmxlIHRvIGp1c3QgY2hlY2sgI2lzTGl2ZSBhbmQgdGhpcyBkZXRlY3RvclxuICAgKiBzaG91bGQgYmUgdXNlZCBhcyBhIHdvcmthcm91bmQgaW5zdGVhZC5cbiAgICpcbiAgICogS25vd24gY2FzZXM6XG4gICAqXG4gICAqIC0gSExTIFZPRCBvbiBBbmRyb2lkIDQuM1xuICAgKiBWaWRlbyBkdXJhdGlvbiBpcyBpbml0aWFsbHkgJ0luZmluaXR5JyBhbmQgb25seSBnZXRzIGF2YWlsYWJsZSBhZnRlciBwbGF5YmFjayBzdGFydHMsIHNvIHN0cmVhbXMgYXJlIHdyb25nbHlcbiAgICogcmVwb3J0ZWQgYXMgJ2xpdmUnIGJlZm9yZSBwbGF5YmFjayAodGhlIGxpdmUtY2hlY2sgaW4gdGhlIHBsYXllciBjaGVja3MgZm9yIGluZmluaXRlIGR1cmF0aW9uKS5cbiAgICovXG4gIGV4cG9ydCBjbGFzcyBMaXZlU3RyZWFtRGV0ZWN0b3Ige1xuXG4gICAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllckFQSTtcbiAgICBwcml2YXRlIGxpdmU6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBsaXZlQ2hhbmdlZEV2ZW50ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxQbGF5ZXJBUEksIExpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncz4oKTtcblxuICAgIGNvbnN0cnVjdG9yKHBsYXllcjogUGxheWVyQVBJKSB7XG4gICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgIHRoaXMubGl2ZSA9IHVuZGVmaW5lZDtcblxuICAgICAgbGV0IGxpdmVEZXRlY3RvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5kZXRlY3QoKTtcbiAgICAgIH07XG4gICAgICAvLyBJbml0aWFsaXplIHdoZW4gcGxheWVyIGlzIHJlYWR5XG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgbGl2ZURldGVjdG9yKTtcbiAgICAgIC8vIFJlLWV2YWx1YXRlIHdoZW4gcGxheWJhY2sgc3RhcnRzXG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCBsaXZlRGV0ZWN0b3IpO1xuXG4gICAgICAvLyBITFMgbGl2ZSBkZXRlY3Rpb24gd29ya2Fyb3VuZCBmb3IgQW5kcm9pZDpcbiAgICAgIC8vIEFsc28gcmUtZXZhbHVhdGUgZHVyaW5nIHBsYXliYWNrLCBiZWNhdXNlIHRoYXQgaXMgd2hlbiB0aGUgbGl2ZSBmbGFnIG1pZ2h0IGNoYW5nZS5cbiAgICAgIC8vIChEb2luZyBpdCBvbmx5IGluIEFuZHJvaWQgQ2hyb21lIHNhdmVzIHVubmVjZXNzYXJ5IG92ZXJoZWFkIG9uIG90aGVyIHBsYXR0Zm9ybXMpXG4gICAgICBpZiAoQnJvd3NlclV0aWxzLmlzQW5kcm9pZCAmJiBCcm93c2VyVXRpbHMuaXNDaHJvbWUpIHtcbiAgICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCBsaXZlRGV0ZWN0b3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRldGVjdCgpOiB2b2lkIHtcbiAgICAgIGxldCBsaXZlTm93ID0gdGhpcy5wbGF5ZXIuaXNMaXZlKCk7XG5cbiAgICAgIC8vIENvbXBhcmUgY3VycmVudCB0byBwcmV2aW91cyBsaXZlIHN0YXRlIGZsYWcgYW5kIGZpcmUgZXZlbnQgd2hlbiBpdCBjaGFuZ2VzLiBTaW5jZSB3ZSBpbml0aWFsaXplIHRoZSBmbGFnXG4gICAgICAvLyB3aXRoIHVuZGVmaW5lZCwgdGhlcmUgaXMgYWx3YXlzIGF0IGxlYXN0IGFuIGluaXRpYWwgZXZlbnQgZmlyZWQgdGhhdCB0ZWxscyBsaXN0ZW5lcnMgdGhlIGxpdmUgc3RhdGUuXG4gICAgICBpZiAobGl2ZU5vdyAhPT0gdGhpcy5saXZlKSB7XG4gICAgICAgIHRoaXMubGl2ZUNoYW5nZWRFdmVudC5kaXNwYXRjaCh0aGlzLnBsYXllciwgeyBsaXZlOiBsaXZlTm93IH0pO1xuICAgICAgICB0aGlzLmxpdmUgPSBsaXZlTm93O1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBvbkxpdmVDaGFuZ2VkKCk6IEV2ZW50PFBsYXllckFQSSwgTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzPiB7XG4gICAgICByZXR1cm4gdGhpcy5saXZlQ2hhbmdlZEV2ZW50LmdldEV2ZW50KCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgVUlVdGlscyB7XG4gIGV4cG9ydCBpbnRlcmZhY2UgVHJlZVRyYXZlcnNhbENhbGxiYWNrIHtcbiAgICAoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgcGFyZW50PzogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4pOiB2b2lkO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHRyYXZlcnNlVHJlZShjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+LCB2aXNpdDogVHJlZVRyYXZlcnNhbENhbGxiYWNrKTogdm9pZCB7XG4gICAgbGV0IHJlY3Vyc2l2ZVRyZWVXYWxrZXIgPSAoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgcGFyZW50PzogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4pID0+IHtcbiAgICAgIHZpc2l0KGNvbXBvbmVudCwgcGFyZW50KTtcblxuICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgY29tcG9uZW50IGlzIGEgY29udGFpbmVyLCB2aXNpdCBpdCdzIGNoaWxkcmVuXG4gICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29udGFpbmVyKSB7XG4gICAgICAgIGZvciAobGV0IGNoaWxkQ29tcG9uZW50IG9mIGNvbXBvbmVudC5nZXRDb21wb25lbnRzKCkpIHtcbiAgICAgICAgICByZWN1cnNpdmVUcmVlV2Fsa2VyKGNoaWxkQ29tcG9uZW50LCBjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFdhbGsgYW5kIGNvbmZpZ3VyZSB0aGUgY29tcG9uZW50IHRyZWVcbiAgICByZWN1cnNpdmVUcmVlV2Fsa2VyKGNvbXBvbmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBCcm93c2VyVXRpbHMge1xuXG4gIC8vIGlzTW9iaWxlIG9ubHkgbmVlZHMgdG8gYmUgZXZhbHVhdGVkIG9uY2UgKGl0IGNhbm5vdCBjaGFuZ2UgZHVyaW5nIGEgYnJvd3NlciBzZXNzaW9uKVxuICAvLyBNb2JpbGUgZGV0ZWN0aW9uIGFjY29yZGluZyB0byBNb3ppbGxhIHJlY29tbWVuZGF0aW9uOiBcIkluIHN1bW1hcnksIHdlIHJlY29tbWVuZCBsb29raW5nIGZvciB0aGUgc3RyaW5nIOKAnE1vYmnigJ1cbiAgLy8gYW55d2hlcmUgaW4gdGhlIFVzZXIgQWdlbnQgdG8gZGV0ZWN0IGEgbW9iaWxlIGRldmljZS5cIlxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVFRQL0Jyb3dzZXJfZGV0ZWN0aW9uX3VzaW5nX3RoZV91c2VyX2FnZW50XG4gIGV4cG9ydCBjb25zdCBpc01vYmlsZSA9IG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIC9Nb2JpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG4gIGV4cG9ydCBjb25zdCBpc0Nocm9tZSA9IG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIC9DaHJvbWUvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbiAgZXhwb3J0IGNvbnN0IGlzQW5kcm9pZCA9IG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIC9BbmRyb2lkLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xufSJdfQ==
