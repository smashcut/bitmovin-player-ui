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

},{"../utils":59,"./label":26}],3:[function(require,module,exports){
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

},{"../utils":59,"./button":8}],4:[function(require,module,exports){
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

},{"./togglebutton":44}],5:[function(require,module,exports){
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

},{"./selectbox":37}],6:[function(require,module,exports){
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

},{"./selectbox":37}],7:[function(require,module,exports){
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

},{"../timeout":57,"./component":17,"./container":18}],8:[function(require,module,exports){
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

},{"../dom":53,"../eventdispatcher":54,"./component":17}],9:[function(require,module,exports){
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

},{"./container":18,"./label":26}],10:[function(require,module,exports){
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

},{"./togglebutton":44}],11:[function(require,module,exports){
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

},{"../timeout":57,"./uicontainer":46}],12:[function(require,module,exports){
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

},{"../eventdispatcher":54,"./container":18,"./label":26,"./togglebutton":44}],13:[function(require,module,exports){
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

},{"./togglebutton":44}],16:[function(require,module,exports){
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

},{"./togglebutton":44}],17:[function(require,module,exports){
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

},{"../dom":53,"../eventdispatcher":54,"../guid":55}],18:[function(require,module,exports){
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

},{"../dom":53,"../utils":59,"./component":17}],19:[function(require,module,exports){
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

},{"../utils":59,"./container":18,"./spacer":40}],20:[function(require,module,exports){
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

},{"../timeout":57,"./checkbox":12,"./closebutton":14,"./container":18,"./label":26}],21:[function(require,module,exports){
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

},{"./togglebutton":44}],22:[function(require,module,exports){
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

},{"./container":18,"./label":26,"./tvnoisecanvas":45}],23:[function(require,module,exports){
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

},{"./togglebutton":44}],24:[function(require,module,exports){
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

},{"../dom":53,"./playbacktogglebutton":32}],25:[function(require,module,exports){
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

},{"../dom":53,"./button":8}],26:[function(require,module,exports){
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

},{"../dom":53,"../eventdispatcher":54,"./component":17}],27:[function(require,module,exports){
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

},{"../eventdispatcher":54,"../utils":59,"./component":17}],28:[function(require,module,exports){
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

},{"./label":26}],29:[function(require,module,exports){
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

},{"./togglebutton":44}],30:[function(require,module,exports){
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

},{"./selectbox":37}],31:[function(require,module,exports){
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

},{"../utils":59,"./label":26}],32:[function(require,module,exports){
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

},{"../utils":59,"./togglebutton":44}],33:[function(require,module,exports){
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

},{"./container":18,"./hugeplaybacktogglebutton":24}],34:[function(require,module,exports){
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

},{"../dom":53,"../utils":59,"./component":17,"./container":18,"./hugereplaybutton":25}],35:[function(require,module,exports){
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

},{"../dom":53,"../eventdispatcher":54,"../timeout":57,"../utils":59,"./component":17}],36:[function(require,module,exports){
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

},{"../utils":59,"./component":17,"./container":18,"./label":26}],37:[function(require,module,exports){
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

},{"../dom":53,"./listselector":27}],38:[function(require,module,exports){
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

},{"../eventdispatcher":54,"../timeout":57,"./audioqualityselectbox":5,"./container":18,"./label":26,"./videoqualityselectbox":47}],39:[function(require,module,exports){
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

},{"./togglebutton":44}],40:[function(require,module,exports){
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

},{"./component":17}],41:[function(require,module,exports){
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

},{"./container":18,"./controlbar":19,"./label":26}],42:[function(require,module,exports){
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

},{"./selectbox":37}],43:[function(require,module,exports){
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

},{"./container":18,"./metadatalabel":28}],44:[function(require,module,exports){
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

},{"../eventdispatcher":54,"./button":8}],45:[function(require,module,exports){
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

},{"../dom":53,"./component":17}],46:[function(require,module,exports){
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

},{"../dom":53,"../timeout":57,"../utils":59,"./container":18}],47:[function(require,module,exports){
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

},{"./selectbox":37}],48:[function(require,module,exports){
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

},{"../timeout":57,"./container":18,"./volumeslider":49,"./volumetogglebutton":50}],49:[function(require,module,exports){
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

},{"./seekbar":35}],50:[function(require,module,exports){
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

},{"./togglebutton":44}],51:[function(require,module,exports){
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

},{"./togglebutton":44}],52:[function(require,module,exports){
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

},{"./clickoverlay":13}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
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

},{"./utils":59}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{"./components/adclickoverlay":1,"./components/admessagelabel":2,"./components/adskipbutton":3,"./components/airplaytogglebutton":4,"./components/audioqualityselectbox":5,"./components/audiotrackselectbox":6,"./components/bufferingoverlay":7,"./components/button":8,"./components/caststatusoverlay":9,"./components/casttogglebutton":10,"./components/castuicontainer":11,"./components/clickoverlay":13,"./components/closebutton":14,"./components/component":17,"./components/container":18,"./components/controlbar":19,"./components/errormessageoverlay":22,"./components/fullscreentogglebutton":23,"./components/hugeplaybacktogglebutton":24,"./components/hugereplaybutton":25,"./components/label":26,"./components/metadatalabel":28,"./components/pictureinpicturetogglebutton":29,"./components/playbackspeedselectbox":30,"./components/playbacktimelabel":31,"./components/playbacktogglebutton":32,"./components/playbacktoggleoverlay":33,"./components/recommendationoverlay":34,"./components/seekbar":35,"./components/seekbarlabel":36,"./components/selectbox":37,"./components/settingspanel":38,"./components/settingstogglebutton":39,"./components/spacer":40,"./components/subtitleoverlay":41,"./components/subtitleselectbox":42,"./components/titlebar":43,"./components/togglebutton":44,"./components/uicontainer":46,"./components/videoqualityselectbox":47,"./components/volumecontrolbutton":48,"./components/volumeslider":49,"./components/volumetogglebutton":50,"./components/vrtogglebutton":51,"./components/watermark":52,"./uimanager":58,"./utils":59}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
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
var embedvideotogglebutton_1 = require("./components/embedvideotogglebutton");
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
        if (!parentElement.hasClass('smashcut-custom-ui-bitmovin-player-holder')) {
            parentElement.addClass('smashcut-custom-ui-bitmovin-player-holder');
            parentElement.append(uiDom);
        }
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
                    new embedvideotogglebutton_1.EmbedVideoToggleButton({ embedVideoPanel: embedVideoPanel }),
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

},{"./components/adclickoverlay":1,"./components/admessagelabel":2,"./components/adskipbutton":3,"./components/airplaytogglebutton":4,"./components/audioqualityselectbox":5,"./components/audiotrackselectbox":6,"./components/bufferingoverlay":7,"./components/caststatusoverlay":9,"./components/casttogglebutton":10,"./components/castuicontainer":11,"./components/closebutton":14,"./components/closedcaptioningtogglebutton":15,"./components/commentstogglebutton":16,"./components/container":18,"./components/controlbar":19,"./components/embedvideopanel":20,"./components/embedvideotogglebutton":21,"./components/errormessageoverlay":22,"./components/fullscreentogglebutton":23,"./components/label":26,"./components/metadatalabel":28,"./components/pictureinpicturetogglebutton":29,"./components/playbackspeedselectbox":30,"./components/playbacktimelabel":31,"./components/playbacktogglebutton":32,"./components/playbacktoggleoverlay":33,"./components/recommendationoverlay":34,"./components/seekbar":35,"./components/seekbarlabel":36,"./components/settingspanel":38,"./components/settingstogglebutton":39,"./components/spacer":40,"./components/subtitleoverlay":41,"./components/subtitleselectbox":42,"./components/titlebar":43,"./components/uicontainer":46,"./components/videoqualityselectbox":47,"./components/volumecontrolbutton":48,"./components/volumeslider":49,"./components/volumetogglebutton":50,"./components/vrtogglebutton":51,"./components/watermark":52,"./dom":53,"./eventdispatcher":54,"./utils":59}],59:[function(require,module,exports){
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

},{"./components/container":18,"./eventdispatcher":54}]},{},[56])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvY29tcG9uZW50cy9hZGNsaWNrb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL2FkbWVzc2FnZWxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYWRza2lwYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYWlycGxheXRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2F1ZGlvcXVhbGl0eXNlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL2F1ZGlvdHJhY2tzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9idWZmZXJpbmdvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2FzdHN0YXR1c292ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jYXN0dG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2FzdHVpY29udGFpbmVyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2hlY2tib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jbGlja292ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jbG9zZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2Nsb3NlZGNhcHRpb25pbmd0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9jb21tZW50c3RvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbXBvbmVudC50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbnRhaW5lci50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbnRyb2xiYXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy9lbWJlZHZpZGVvcGFuZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9lbWJlZHZpZGVvdG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvZXJyb3JtZXNzYWdlb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL2Z1bGxzY3JlZW50b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9odWdlcGxheWJhY2t0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9odWdlcmVwbGF5YnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvbGFiZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9saXN0c2VsZWN0b3IudHMiLCJzcmMvdHMvY29tcG9uZW50cy9tZXRhZGF0YWxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcGljdHVyZWlucGljdHVyZXRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL3BsYXliYWNrc3BlZWRzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9wbGF5YmFja3RpbWVsYWJlbC50cyIsInNyYy90cy9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcGxheWJhY2t0b2dnbGVvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcmVjb21tZW5kYXRpb25vdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc2Vla2Jhci50cyIsInNyYy90cy9jb21wb25lbnRzL3NlZWtiYXJsYWJlbC50cyIsInNyYy90cy9jb21wb25lbnRzL3NlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL3NldHRpbmdzcGFuZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9zZXR0aW5nc3RvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL3NwYWNlci50cyIsInNyYy90cy9jb21wb25lbnRzL3N1YnRpdGxlb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL3N1YnRpdGxlc2VsZWN0Ym94LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdGl0bGViYXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy90b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy90dm5vaXNlY2FudmFzLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdWljb250YWluZXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy92aWRlb3F1YWxpdHlzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy92b2x1bWVjb250cm9sYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdm9sdW1lc2xpZGVyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdm9sdW1ldG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdnJ0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy93YXRlcm1hcmsudHMiLCJzcmMvdHMvZG9tLnRzIiwic3JjL3RzL2V2ZW50ZGlzcGF0Y2hlci50cyIsInNyYy90cy9ndWlkLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvdGltZW91dC50cyIsInNyYy90cy91aW1hbmFnZXIudHMiLCJzcmMvdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7QUNBQSwrQ0FBNEM7QUFHNUM7O0dBRUc7QUFDSDtJQUFvQyxrQ0FBWTtJQUFoRDs7SUF1Q0EsQ0FBQztJQXJDQyxrQ0FBUyxHQUFULFVBQVUsTUFBMEIsRUFBRSxTQUE0QjtRQUFsRSxpQkFvQ0M7UUFuQ0MsaUJBQU0sU0FBUyxZQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVuQyxJQUFJLGVBQWUsR0FBVyxJQUFJLENBQUM7UUFDbkMsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXO2VBQ3BELENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUM7ZUFDckUsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQztRQUV4RCxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxF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WTtJQUUzQix1RkFBdUY7SUFDdkYsZ0hBQWdIO0lBQ2hILHlEQUF5RDtJQUN6RCwyRkFBMkY7SUFDOUUscUJBQVEsR0FBRyxTQUFTLElBQUksU0FBUyxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUVoRixxQkFBUSxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRWxGLHNCQUFTLEdBQUcsU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkcsQ0FBQyxFQVhnQixZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQVc1QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0NsaWNrT3ZlcmxheX0gZnJvbSAnLi9jbGlja292ZXJsYXknO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIHNpbXBsZSBjbGljayBjYXB0dXJlIG92ZXJsYXkgZm9yIGNsaWNrVGhyb3VnaFVybHMgb2YgYWRzLlxuICovXG5leHBvcnQgY2xhc3MgQWRDbGlja092ZXJsYXkgZXh0ZW5kcyBDbGlja092ZXJsYXkge1xuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY2xpY2tUaHJvdWdoVXJsID0gPHN0cmluZz5udWxsO1xuICAgIGxldCBjbGlja1Rocm91Z2hFbmFibGVkID0gIXBsYXllci5nZXRDb25maWcoKS5hZHZlcnRpc2luZ1xuICAgICAgfHwgIXBsYXllci5nZXRDb25maWcoKS5hZHZlcnRpc2luZy5oYXNPd25Qcm9wZXJ0eSgnY2xpY2tUaHJvdWdoRW5hYmxlZCcpXG4gICAgICB8fCBwbGF5ZXIuZ2V0Q29uZmlnKCkuYWR2ZXJ0aXNpbmcuY2xpY2tUaHJvdWdoRW5hYmxlZDtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX1NUQVJURUQsIChldmVudDogYml0bW92aW4uUGxheWVyQVBJLkFkU3RhcnRlZEV2ZW50KSA9PiB7XG4gICAgICBjbGlja1Rocm91Z2hVcmwgPSBldmVudC5jbGlja1Rocm91Z2hVcmw7XG5cbiAgICAgIGlmIChjbGlja1Rocm91Z2hFbmFibGVkKSB7XG4gICAgICAgIHRoaXMuc2V0VXJsKGNsaWNrVGhyb3VnaFVybCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiBjbGljay10aHJvdWdoIGlzIGRpc2FibGVkLCB3ZSBzZXQgdGhlIHVybCB0byBudWxsIHRvIGF2b2lkIGl0IG9wZW5cbiAgICAgICAgdGhpcy5zZXRVcmwobnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDbGVhciBjbGljay10aHJvdWdoIFVSTCB3aGVuIGFkIGhhcyBmaW5pc2hlZFxuICAgIGxldCBhZEZpbmlzaGVkSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0VXJsKG51bGwpO1xuICAgIH07XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfRklOSVNIRUQsIGFkRmluaXNoZWRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9TS0lQUEVELCBhZEZpbmlzaGVkSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfRVJST1IsIGFkRmluaXNoZWRIYW5kbGVyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gUGF1c2UgdGhlIGFkIHdoZW4gb3ZlcmxheSBpcyBjbGlja2VkXG4gICAgICBwbGF5ZXIucGF1c2UoJ3VpLWNvbnRlbnQtY2xpY2snKTtcblxuICAgICAgLy8gTm90aWZ5IHRoZSBwbGF5ZXIgb2YgdGhlIGNsaWNrZWQgYWRcbiAgICAgIHBsYXllci5maXJlRXZlbnQocGxheWVyLkVWRU5ULk9OX0FEX0NMSUNLRUQsIHtcbiAgICAgICAgY2xpY2tUaHJvdWdoVXJsOiBjbGlja1Rocm91Z2hVcmxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7U3RyaW5nVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcblxuLyoqXG4gKiBBIGxhYmVsIHRoYXQgZGlzcGxheXMgYSBtZXNzYWdlIGFib3V0IGEgcnVubmluZyBhZCwgb3B0aW9uYWxseSB3aXRoIGEgY291bnRkb3duLlxuICovXG5leHBvcnQgY2xhc3MgQWRNZXNzYWdlTGFiZWwgZXh0ZW5kcyBMYWJlbDxMYWJlbENvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWxhYmVsLWFkLW1lc3NhZ2UnLFxuICAgICAgdGV4dDogJ1RoaXMgYWQgd2lsbCBlbmQgaW4ge3JlbWFpbmluZ1RpbWV9IHNlY29uZHMuJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgdGV4dCA9IHRoaXMuZ2V0Q29uZmlnKCkudGV4dDtcblxuICAgIGxldCB1cGRhdGVNZXNzYWdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0VGV4dChTdHJpbmdVdGlscy5yZXBsYWNlQWRNZXNzYWdlUGxhY2Vob2xkZXJzKHRleHQsIG51bGwsIHBsYXllcikpO1xuICAgIH07XG5cbiAgICBsZXQgYWRTdGFydEhhbmRsZXIgPSAoZXZlbnQ6IGJpdG1vdmluLlBsYXllckFQSS5BZFN0YXJ0ZWRFdmVudCkgPT4ge1xuICAgICAgdGV4dCA9IGV2ZW50LmFkTWVzc2FnZSB8fCB0ZXh0O1xuICAgICAgdXBkYXRlTWVzc2FnZUhhbmRsZXIoKTtcblxuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCB1cGRhdGVNZXNzYWdlSGFuZGxlcik7XG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgdXBkYXRlTWVzc2FnZUhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBsZXQgYWRFbmRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgcGxheWVyLnJlbW92ZUV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCB1cGRhdGVNZXNzYWdlSGFuZGxlcik7XG4gICAgICBwbGF5ZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgdXBkYXRlTWVzc2FnZUhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVELCBhZFN0YXJ0SGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfU0tJUFBFRCwgYWRFbmRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9FUlJPUiwgYWRFbmRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgYWRFbmRIYW5kbGVyKTtcbiAgfVxufSIsImltcG9ydCB7QnV0dG9uQ29uZmlnLCBCdXR0b259IGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgU2tpcE1lc3NhZ2UgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuU2tpcE1lc3NhZ2U7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQWRTa2lwQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZFNraXBCdXR0b25Db25maWcgZXh0ZW5kcyBCdXR0b25Db25maWcge1xuICBza2lwTWVzc2FnZT86IFNraXBNZXNzYWdlO1xufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgaXMgZGlzcGxheWVkIGR1cmluZyBhZHMgYW5kIGNhbiBiZSB1c2VkIHRvIHNraXAgdGhlIGFkLlxuICovXG5leHBvcnQgY2xhc3MgQWRTa2lwQnV0dG9uIGV4dGVuZHMgQnV0dG9uPEFkU2tpcEJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQWRTa2lwQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywgPEFkU2tpcEJ1dHRvbkNvbmZpZz57XG4gICAgICBjc3NDbGFzczogJ3VpLWJ1dHRvbi1hZC1za2lwJyxcbiAgICAgIHNraXBNZXNzYWdlOiB7XG4gICAgICAgIGNvdW50ZG93bjogJ1NraXAgYWQgaW4ge3JlbWFpbmluZ1RpbWV9JyxcbiAgICAgICAgc2tpcDogJ1NraXAgYWQnXG4gICAgICB9XG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8QWRTa2lwQnV0dG9uQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7IC8vIFRPRE8gZ2V0IHJpZCBvZiBnZW5lcmljIGNhc3RcbiAgICBsZXQgc2tpcE1lc3NhZ2UgPSBjb25maWcuc2tpcE1lc3NhZ2U7XG4gICAgbGV0IGFkRXZlbnQgPSA8Yml0bW92aW4uUGxheWVyQVBJLkFkU3RhcnRlZEV2ZW50Pm51bGw7XG5cbiAgICBsZXQgdXBkYXRlU2tpcE1lc3NhZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgLy8gRGlzcGxheSB0aGlzIGJ1dHRvbiBvbmx5IGlmIGFkIGlzIHNraXBwYWJsZVxuICAgICAgaWYgKGFkRXZlbnQuc2tpcE9mZnNldCkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBVcGRhdGUgdGhlIHNraXAgbWVzc2FnZSBvbiB0aGUgYnV0dG9uXG4gICAgICBpZiAocGxheWVyLmdldEN1cnJlbnRUaW1lKCkgPCBhZEV2ZW50LnNraXBPZmZzZXQpIHtcbiAgICAgICAgdGhpcy5zZXRUZXh0KFxuICAgICAgICAgIFN0cmluZ1V0aWxzLnJlcGxhY2VBZE1lc3NhZ2VQbGFjZWhvbGRlcnMoY29uZmlnLnNraXBNZXNzYWdlLmNvdW50ZG93biwgYWRFdmVudC5za2lwT2Zmc2V0LCBwbGF5ZXIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0VGV4dChjb25maWcuc2tpcE1lc3NhZ2Uuc2tpcCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCBhZFN0YXJ0SGFuZGxlciA9IChldmVudDogYml0bW92aW4uUGxheWVyQVBJLkFkU3RhcnRlZEV2ZW50KSA9PiB7XG4gICAgICBhZEV2ZW50ID0gZXZlbnQ7XG4gICAgICBza2lwTWVzc2FnZSA9IGFkRXZlbnQuc2tpcE1lc3NhZ2UgfHwgc2tpcE1lc3NhZ2U7XG4gICAgICB1cGRhdGVTa2lwTWVzc2FnZUhhbmRsZXIoKTtcblxuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9DSEFOR0VELCB1cGRhdGVTa2lwTWVzc2FnZUhhbmRsZXIpO1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9USU1FX1VQREFURUQsIHVwZGF0ZVNraXBNZXNzYWdlSGFuZGxlcik7XG4gICAgfTtcblxuICAgIGxldCBhZEVuZEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBwbGF5ZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHVwZGF0ZVNraXBNZXNzYWdlSGFuZGxlcik7XG4gICAgICBwbGF5ZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgdXBkYXRlU2tpcE1lc3NhZ2VIYW5kbGVyKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfU1RBUlRFRCwgYWRTdGFydEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX1NLSVBQRUQsIGFkRW5kSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfRVJST1IsIGFkRW5kSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfRklOSVNIRUQsIGFkRW5kSGFuZGxlcik7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIFRyeSB0byBza2lwIHRoZSBhZCAodGhpcyBvbmx5IHdvcmtzIGlmIGl0IGlzIHNraXBwYWJsZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHRha2UgZXh0cmEgY2FyZSBvZiB0aGF0IGhlcmUpXG4gICAgICBwbGF5ZXIuc2tpcEFkKCk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyBBcHBsZSBBaXJQbGF5LlxuICovXG5leHBvcnQgY2xhc3MgQWlyUGxheVRvZ2dsZUJ1dHRvbiBleHRlbmRzIFRvZ2dsZUJ1dHRvbjxUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktYWlycGxheXRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnQXBwbGUgQWlyUGxheSdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgaWYgKCFwbGF5ZXIuaXNBaXJwbGF5QXZhaWxhYmxlKSB7XG4gICAgICAvLyBJZiB0aGUgcGxheWVyIGRvZXMgbm90IHN1cHBvcnQgQWlycGxheSAocGxheWVyIDcuMCksIHdlIGp1c3QgaGlkZSB0aGlzIGNvbXBvbmVudCBhbmQgc2tpcCBjb25maWd1cmF0aW9uXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNBaXJwbGF5QXZhaWxhYmxlKCkpIHtcbiAgICAgICAgcGxheWVyLnNob3dBaXJwbGF5VGFyZ2V0UGlja2VyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29uc29sZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdBaXJQbGF5IHVuYXZhaWxhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBhaXJQbGF5QXZhaWxhYmxlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNBaXJwbGF5QXZhaWxhYmxlKCkpIHtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQUlSUExBWV9BVkFJTEFCTEUsIGFpclBsYXlBdmFpbGFibGVIYW5kbGVyKTtcblxuICAgIC8vIFN0YXJ0dXAgaW5pdFxuICAgIGFpclBsYXlBdmFpbGFibGVIYW5kbGVyKCk7IC8vIEhpZGUgYnV0dG9uIGlmIEFpclBsYXkgaXMgbm90IGF2YWlsYWJsZVxuICB9XG59IiwiaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vc2VsZWN0Ym94JztcbmltcG9ydCB7TGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2VsZWN0IGJveCBwcm92aWRpbmcgYSBzZWxlY3Rpb24gYmV0d2VlbiAnYXV0bycgYW5kIHRoZSBhdmFpbGFibGUgYXVkaW8gcXVhbGl0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9RdWFsaXR5U2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgdXBkYXRlQXVkaW9RdWFsaXRpZXMgPSAoKSA9PiB7XG4gICAgICBsZXQgYXVkaW9RdWFsaXRpZXMgPSBwbGF5ZXIuZ2V0QXZhaWxhYmxlQXVkaW9RdWFsaXRpZXMoKTtcblxuICAgICAgdGhpcy5jbGVhckl0ZW1zKCk7XG5cbiAgICAgIC8vIEFkZCBlbnRyeSBmb3IgYXV0b21hdGljIHF1YWxpdHkgc3dpdGNoaW5nIChkZWZhdWx0IHNldHRpbmcpXG4gICAgICB0aGlzLmFkZEl0ZW0oJ0F1dG8nLCAnQXV0bycpO1xuXG4gICAgICAvLyBBZGQgYXVkaW8gcXVhbGl0aWVzXG4gICAgICBmb3IgKGxldCBhdWRpb1F1YWxpdHkgb2YgYXVkaW9RdWFsaXRpZXMpIHtcbiAgICAgICAgdGhpcy5hZGRJdGVtKGF1ZGlvUXVhbGl0eS5pZCwgYXVkaW9RdWFsaXR5LmxhYmVsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5vbkl0ZW1TZWxlY3RlZC5zdWJzY3JpYmUoKHNlbmRlcjogQXVkaW9RdWFsaXR5U2VsZWN0Qm94LCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0QXVkaW9RdWFsaXR5KHZhbHVlKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBxdWFsaXRpZXMgd2hlbiBhdWRpbyB0cmFjayBoYXMgY2hhbmdlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FVRElPX0NIQU5HRUQsIHVwZGF0ZUF1ZGlvUXVhbGl0aWVzKTtcbiAgICAvLyBVcGRhdGUgcXVhbGl0aWVzIHdoZW4gc291cmNlIGdvZXMgYXdheVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgdXBkYXRlQXVkaW9RdWFsaXRpZXMpO1xuICAgIC8vIFVwZGF0ZSBxdWFsaXRpZXMgd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHVwZGF0ZUF1ZGlvUXVhbGl0aWVzKTtcbiAgICAvLyBVcGRhdGUgcXVhbGl0eSBzZWxlY3Rpb24gd2hlbiBxdWFsaXR5IGlzIGNoYW5nZWQgKGZyb20gb3V0c2lkZSlcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BVURJT19ET1dOTE9BRF9RVUFMSVRZX0NIQU5HRSwgKCkgPT4ge1xuICAgICAgbGV0IGRhdGEgPSBwbGF5ZXIuZ2V0RG93bmxvYWRlZEF1ZGlvRGF0YSgpO1xuICAgICAgdGhpcy5zZWxlY3RJdGVtKGRhdGEuaXNBdXRvID8gJ0F1dG8nIDogZGF0YS5pZCk7XG4gICAgfSk7XG5cbiAgICAvLyBQb3B1bGF0ZSBxdWFsaXRpZXMgYXQgc3RhcnR1cFxuICAgIHVwZGF0ZUF1ZGlvUXVhbGl0aWVzKCk7XG4gIH1cbn0iLCJpbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBzZWxlY3QgYm94IHByb3ZpZGluZyBhIHNlbGVjdGlvbiBiZXR3ZWVuIGF2YWlsYWJsZSBhdWRpbyB0cmFja3MgKGUuZy4gZGlmZmVyZW50IGxhbmd1YWdlcykuXG4gKi9cbmV4cG9ydCBjbGFzcyBBdWRpb1RyYWNrU2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICAvLyBUT0RPIE1vdmUgdG8gY29uZmlnP1xuICAgIGxldCBnZXRBdWRpb1RyYWNrTGFiZWwgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgc3dpdGNoIChpZCkge1xuICAgICAgICBjYXNlICdlbl9zdGVyZW8nOlxuICAgICAgICAgIHJldHVybiAnRW5nbGlzaCAtIFN0ZXJlbyc7XG4gICAgICAgIGNhc2UgJ25vLXZvaWNlc19zdGVyZW8nOlxuICAgICAgICAgIHJldHVybiAnTm8gVm9pY2VzIC0gU3RlcmVvJztcbiAgICAgICAgY2FzZSAnZW5fc3Vycm91bmQnOlxuICAgICAgICAgIHJldHVybiAnRW5nbGlzaCAtIFN1cnJvdW5kJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gaWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdXBkYXRlQXVkaW9UcmFja3MgPSAoKSA9PiB7XG4gICAgICBsZXQgYXVkaW9UcmFja3MgPSBwbGF5ZXIuZ2V0QXZhaWxhYmxlQXVkaW8oKTtcblxuICAgICAgdGhpcy5jbGVhckl0ZW1zKCk7XG5cbiAgICAgIC8vIEFkZCBhdWRpbyB0cmFja3NcbiAgICAgIGZvciAobGV0IGF1ZGlvVHJhY2sgb2YgYXVkaW9UcmFja3MpIHtcbiAgICAgICAgdGhpcy5hZGRJdGVtKGF1ZGlvVHJhY2suaWQsIGdldEF1ZGlvVHJhY2tMYWJlbChhdWRpb1RyYWNrLmxhYmVsKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IEF1ZGlvVHJhY2tTZWxlY3RCb3gsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHBsYXllci5zZXRBdWRpbyh2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBsZXQgYXVkaW9UcmFja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBsZXQgY3VycmVudEF1ZGlvVHJhY2sgPSBwbGF5ZXIuZ2V0QXVkaW8oKTtcblxuICAgICAgLy8gSExTIHN0cmVhbXMgZG9uJ3QgYWx3YXlzIHByb3ZpZGUgdGhpcywgc28gd2UgaGF2ZSB0byBjaGVja1xuICAgICAgaWYgKGN1cnJlbnRBdWRpb1RyYWNrKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0SXRlbShjdXJyZW50QXVkaW9UcmFjay5pZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFVwZGF0ZSBzZWxlY3Rpb24gd2hlbiBzZWxlY3RlZCB0cmFjayBoYXMgY2hhbmdlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FVRElPX0NIQU5HRUQsIGF1ZGlvVHJhY2tIYW5kbGVyKTtcbiAgICAvLyBVcGRhdGUgdHJhY2tzIHdoZW4gc291cmNlIGdvZXMgYXdheVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgdXBkYXRlQXVkaW9UcmFja3MpO1xuICAgIC8vIFVwZGF0ZSB0cmFja3Mgd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHVwZGF0ZUF1ZGlvVHJhY2tzKTtcbiAgICAvLyBVcGRhdGUgdHJhY2tzIHdoZW4gYSB0cmFjayBpcyBhZGRlZCBvciByZW1vdmVkIChzaW5jZSBwbGF5ZXIgNy4xLjQpXG4gICAgaWYgKHBsYXllci5FVkVOVC5PTl9BVURJT19BRERFRCAmJiBwbGF5ZXIuRVZFTlQuT05fQVVESU9fUkVNT1ZFRCkge1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fQURERUQsIHVwZGF0ZUF1ZGlvVHJhY2tzKTtcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FVRElPX1JFTU9WRUQsIHVwZGF0ZUF1ZGlvVHJhY2tzKTtcbiAgICB9XG5cbiAgICAvLyBQb3B1bGF0ZSB0cmFja3MgYXQgc3RhcnR1cFxuICAgIHVwZGF0ZUF1ZGlvVHJhY2tzKCk7XG5cbiAgICAvLyBXaGVuIGBwbGF5YmFjay5hdWRpb0xhbmd1YWdlYCBpcyBzZXQsIHRoZSBgT05fQVVESU9fQ0hBTkdFRGAgZXZlbnQgZm9yIHRoYXQgY2hhbmdlIGlzIHRyaWdnZXJlZCBiZWZvcmUgdGhlXG4gICAgLy8gVUkgaXMgY3JlYXRlZC4gVGhlcmVmb3JlIHdlIG5lZWQgdG8gc2V0IHRoZSBhdWRpbyB0cmFjayBvbiBjb25maWd1cmUuXG4gICAgYXVkaW9UcmFja0hhbmRsZXIoKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge1RpbWVvdXR9IGZyb20gJy4uL3RpbWVvdXQnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIEJ1ZmZlcmluZ092ZXJsYXl9IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdWZmZXJpbmdPdmVybGF5Q29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIERlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgYnVmZmVyaW5nIG92ZXJsYXkgd2lsbCBiZSBkaXNwbGF5ZWQuIFVzZWZ1bCB0byBieXBhc3Mgc2hvcnQgc3RhbGxzIHdpdGhvdXRcbiAgICogZGlzcGxheWluZyB0aGUgb3ZlcmxheS4gU2V0IHRvIDAgdG8gZGlzcGxheSB0aGUgb3ZlcmxheSBpbnN0YW50bHkuXG4gICAqIERlZmF1bHQ6IDEwMDBtcyAoMSBzZWNvbmQpXG4gICAqL1xuICBzaG93RGVsYXlNcz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBPdmVybGF5cyB0aGUgcGxheWVyIGFuZCBkaXNwbGF5cyBhIGJ1ZmZlcmluZyBpbmRpY2F0b3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBCdWZmZXJpbmdPdmVybGF5IGV4dGVuZHMgQ29udGFpbmVyPEJ1ZmZlcmluZ092ZXJsYXlDb25maWc+IHtcblxuICBwcml2YXRlIGluZGljYXRvcnM6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+W107XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBCdWZmZXJpbmdPdmVybGF5Q29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5pbmRpY2F0b3JzID0gW1xuICAgICAgbmV3IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KHsgdGFnOiAnZGl2JywgY3NzQ2xhc3M6ICd1aS1idWZmZXJpbmctb3ZlcmxheS1pbmRpY2F0b3InIH0pLFxuICAgICAgbmV3IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KHsgdGFnOiAnZGl2JywgY3NzQ2xhc3M6ICd1aS1idWZmZXJpbmctb3ZlcmxheS1pbmRpY2F0b3InIH0pLFxuICAgICAgbmV3IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KHsgdGFnOiAnZGl2JywgY3NzQ2xhc3M6ICd1aS1idWZmZXJpbmctb3ZlcmxheS1pbmRpY2F0b3InIH0pLFxuICAgIF07XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCA8QnVmZmVyaW5nT3ZlcmxheUNvbmZpZz57XG4gICAgICBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5JyxcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGNvbXBvbmVudHM6IHRoaXMuaW5kaWNhdG9ycyxcbiAgICAgIHNob3dEZWxheU1zOiAxMDAwLFxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPEJ1ZmZlcmluZ092ZXJsYXlDb25maWc+dGhpcy5nZXRDb25maWcoKTtcblxuICAgIGxldCBvdmVybGF5U2hvd1RpbWVvdXQgPSBuZXcgVGltZW91dChjb25maWcuc2hvd0RlbGF5TXMsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0pO1xuXG4gICAgbGV0IHNob3dPdmVybGF5ID0gKCkgPT4ge1xuICAgICAgb3ZlcmxheVNob3dUaW1lb3V0LnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIGxldCBoaWRlT3ZlcmxheSA9ICgpID0+IHtcbiAgICAgIG92ZXJsYXlTaG93VGltZW91dC5jbGVhcigpO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX1NUQVJURUQsIHNob3dPdmVybGF5KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TVEFMTF9FTkRFRCwgaGlkZU92ZXJsYXkpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgaGlkZU92ZXJsYXkpO1xuXG4gICAgLy8gU2hvdyBvdmVybGF5IGlmIHBsYXllciBpcyBhbHJlYWR5IHN0YWxsZWQgYXQgaW5pdFxuICAgIGlmIChwbGF5ZXIuaXNTdGFsbGVkKCkpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnRDb25maWcsIENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgTm9BcmdzLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgQnV0dG9ufSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQnV0dG9uQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSB0ZXh0IG9uIHRoZSBidXR0b24uXG4gICAqL1xuICB0ZXh0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgc2ltcGxlIGNsaWNrYWJsZSBidXR0b24uXG4gKi9cbmV4cG9ydCBjbGFzcyBCdXR0b248Q29uZmlnIGV4dGVuZHMgQnV0dG9uQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxCdXR0b25Db25maWc+IHtcblxuICBwcml2YXRlIGJ1dHRvbkV2ZW50cyA9IHtcbiAgICBvbkNsaWNrOiBuZXcgRXZlbnREaXNwYXRjaGVyPEJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+KClcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWJ1dHRvbidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBidXR0b24gZWxlbWVudCB3aXRoIHRoZSB0ZXh0IGxhYmVsXG4gICAgbGV0IGJ1dHRvbkVsZW1lbnQgPSBuZXcgRE9NKCdidXR0b24nLCB7XG4gICAgICAndHlwZSc6ICdidXR0b24nLFxuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKVxuICAgIH0pLmFwcGVuZChuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2xhYmVsJylcbiAgICB9KS5odG1sKHRoaXMuY29uZmlnLnRleHQpKTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBidXR0b24gZWxlbWVudCBhbmQgdHJpZ2dlciB0aGUgY29ycmVzcG9uZGluZyBldmVudCBvbiB0aGUgYnV0dG9uIGNvbXBvbmVudFxuICAgIGJ1dHRvbkVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkNsaWNrRXZlbnQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBidXR0b25FbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGV4dCBvbiB0aGUgbGFiZWwgb2YgdGhlIGJ1dHRvbi5cbiAgICogQHBhcmFtIHRleHQgdGhlIHRleHQgdG8gcHV0IGludG8gdGhlIGxhYmVsIG9mIHRoZSBidXR0b25cbiAgICovXG4gIHNldFRleHQodGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5nZXREb21FbGVtZW50KCkuZmluZCgnLicgKyB0aGlzLnByZWZpeENzcygnbGFiZWwnKSkuaHRtbCh0ZXh0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNsaWNrRXZlbnQoKSB7XG4gICAgdGhpcy5idXR0b25FdmVudHMub25DbGljay5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8QnV0dG9uPENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25DbGljaygpOiBFdmVudDxCdXR0b248Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uRXZlbnRzLm9uQ2xpY2suZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7TGFiZWwsIExhYmVsQ29uZmlnfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgQ2FzdFdhaXRpbmdGb3JEZXZpY2VFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5DYXN0V2FpdGluZ0ZvckRldmljZUV2ZW50O1xuaW1wb3J0IENhc3RTdGFydGVkRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuQ2FzdFN0YXJ0ZWRFdmVudDtcblxuLyoqXG4gKiBPdmVybGF5cyB0aGUgcGxheWVyIGFuZCBkaXNwbGF5cyB0aGUgc3RhdHVzIG9mIGEgQ2FzdCBzZXNzaW9uLlxuICovXG5leHBvcnQgY2xhc3MgQ2FzdFN0YXR1c092ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0dXNMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5zdGF0dXNMYWJlbCA9IG5ldyBMYWJlbDxMYWJlbENvbmZpZz4oeyBjc3NDbGFzczogJ3VpLWNhc3Qtc3RhdHVzLWxhYmVsJyB9KTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2FzdC1zdGF0dXMtb3ZlcmxheScsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy5zdGF0dXNMYWJlbF0sXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9XQUlUSU5HX0ZPUl9ERVZJQ0UsXG4gICAgICAoZXZlbnQ6IENhc3RXYWl0aW5nRm9yRGV2aWNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgIC8vIEdldCBkZXZpY2UgbmFtZSBhbmQgdXBkYXRlIHN0YXR1cyB0ZXh0IHdoaWxlIGNvbm5lY3RpbmdcbiAgICAgICAgbGV0IGNhc3REZXZpY2VOYW1lID0gZXZlbnQuY2FzdFBheWxvYWQuZGV2aWNlTmFtZTtcbiAgICAgICAgdGhpcy5zdGF0dXNMYWJlbC5zZXRUZXh0KGBDb25uZWN0aW5nIHRvIDxzdHJvbmc+JHtjYXN0RGV2aWNlTmFtZX08L3N0cm9uZz4uLi5gKTtcbiAgICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlRFRCwgKGV2ZW50OiBDYXN0U3RhcnRlZEV2ZW50KSA9PiB7XG4gICAgICAvLyBTZXNzaW9uIGlzIHN0YXJ0ZWQgb3IgcmVzdW1lZFxuICAgICAgLy8gRm9yIGNhc2VzIHdoZW4gYSBzZXNzaW9uIGlzIHJlc3VtZWQsIHdlIGRvIG5vdCByZWNlaXZlIHRoZSBwcmV2aW91cyBldmVudHMgYW5kIHRoZXJlZm9yZSBzaG93IHRoZSBzdGF0dXMgcGFuZWxcbiAgICAgIC8vIGhlcmUgdG9vXG4gICAgICB0aGlzLnNob3coKTtcbiAgICAgIGxldCBjYXN0RGV2aWNlTmFtZSA9IGV2ZW50LmRldmljZU5hbWU7XG4gICAgICB0aGlzLnN0YXR1c0xhYmVsLnNldFRleHQoYFBsYXlpbmcgb24gPHN0cm9uZz4ke2Nhc3REZXZpY2VOYW1lfTwvc3Ryb25nPmApO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RPUFBFRCwgKGV2ZW50KSA9PiB7XG4gICAgICAvLyBDYXN0IHNlc3Npb24gZ29uZSwgaGlkZSB0aGUgc3RhdHVzIHBhbmVsXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIGNhc3RpbmcgdG8gYSBDYXN0IHJlY2VpdmVyLlxuICovXG5leHBvcnQgY2xhc3MgQ2FzdFRvZ2dsZUJ1dHRvbiBleHRlbmRzIFRvZ2dsZUJ1dHRvbjxUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2FzdHRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnR29vZ2xlIENhc3QnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0Nhc3RBdmFpbGFibGUoKSkge1xuICAgICAgICBpZiAocGxheWVyLmlzQ2FzdGluZygpKSB7XG4gICAgICAgICAgcGxheWVyLmNhc3RTdG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGxheWVyLmNhc3RWaWRlbygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29uc29sZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdDYXN0IHVuYXZhaWxhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBjYXN0QXZhaWxhYmxlSGFuZGVyID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0Nhc3RBdmFpbGFibGUoKSkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX0FWQUlMQUJMRSwgY2FzdEF2YWlsYWJsZUhhbmRlcik7XG5cbiAgICAvLyBUb2dnbGUgYnV0dG9uICdvbicgc3RhdGVcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1dBSVRJTkdfRk9SX0RFVklDRSwgKCkgPT4ge1xuICAgICAgdGhpcy5vbigpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlRFRCwgKCkgPT4ge1xuICAgICAgLy8gV2hlbiBhIHNlc3Npb24gaXMgcmVzdW1lZCwgdGhlcmUgaXMgbm8gT05fQ0FTVF9TVEFSVCBldmVudCwgc28gd2UgYWxzbyBuZWVkIHRvIHRvZ2dsZSBoZXJlIGZvciBzdWNoIGNhc2VzXG4gICAgICB0aGlzLm9uKCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVE9QUEVELCAoKSA9PiB7XG4gICAgICB0aGlzLm9mZigpO1xuICAgIH0pO1xuXG4gICAgLy8gU3RhcnR1cCBpbml0XG4gICAgY2FzdEF2YWlsYWJsZUhhbmRlcigpOyAvLyBIaWRlIGJ1dHRvbiBpZiBDYXN0IG5vdCBhdmFpbGFibGVcbiAgICBpZiAocGxheWVyLmlzQ2FzdGluZygpKSB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtVSUNvbnRhaW5lciwgVUlDb250YWluZXJDb25maWd9IGZyb20gJy4vdWljb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5cbi8qKlxuICogVGhlIGJhc2UgY29udGFpbmVyIGZvciBDYXN0IHJlY2VpdmVycyB0aGF0IGNvbnRhaW5zIGFsbCBvZiB0aGUgVUkgYW5kIHRha2VzIGNhcmUgdGhhdCB0aGUgVUkgaXMgc2hvd24gb25cbiAqIGNlcnRhaW4gcGxheWJhY2sgZXZlbnRzLlxuICovXG5leHBvcnQgY2xhc3MgQ2FzdFVJQ29udGFpbmVyIGV4dGVuZHMgVUlDb250YWluZXIge1xuXG4gIHByaXZhdGUgY2FzdFVpSGlkZVRpbWVvdXQ6IFRpbWVvdXQ7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBVSUNvbnRhaW5lckNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxVSUNvbnRhaW5lckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgLypcbiAgICAgKiBTaG93IFVJIG9uIENhc3QgZGV2aWNlcyBhdCBjZXJ0YWluIHBsYXliYWNrIGV2ZW50c1xuICAgICAqXG4gICAgICogU2luY2UgYSBDYXN0IHJlY2VpdmVyIGRvZXMgbm90IGhhdmUgYSBkaXJlY3QgSENJLCB3ZSBzaG93IHRoZSBVSSBvbiBjZXJ0YWluIHBsYXliYWNrIGV2ZW50cyB0byBnaXZlIHRoZSB1c2VyXG4gICAgICogYSBjaGFuY2UgdG8gc2VlIG9uIHRoZSBzY3JlZW4gd2hhdCdzIGdvaW5nIG9uLCBlLmcuIG9uIHBsYXkvcGF1c2Ugb3IgYSBzZWVrIHRoZSBVSSBpcyBzaG93biBhbmQgdGhlIHVzZXIgY2FuXG4gICAgICogc2VlIHRoZSBjdXJyZW50IHRpbWUgYW5kIHBvc2l0aW9uIG9uIHRoZSBzZWVrIGJhci5cbiAgICAgKiBUaGUgVUkgaXMgc2hvd24gcGVybWFuZW50bHkgd2hpbGUgcGxheWJhY2sgaXMgcGF1c2VkLCBvdGhlcndpc2UgaGlkZXMgYXV0b21hdGljYWxseSBhZnRlciB0aGUgY29uZmlndXJlZFxuICAgICAqIGhpZGUgZGVsYXkgdGltZS5cbiAgICAgKi9cblxuICAgIGxldCBpc1VpU2hvd24gPSBmYWxzZTtcblxuICAgIGxldCBoaWRlVWkgPSAoKSA9PiB7XG4gICAgICB1aW1hbmFnZXIub25Db250cm9sc0hpZGUuZGlzcGF0Y2godGhpcyk7XG4gICAgICBpc1VpU2hvd24gPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdGhpcy5jYXN0VWlIaWRlVGltZW91dCA9IG5ldyBUaW1lb3V0KGNvbmZpZy5oaWRlRGVsYXksIGhpZGVVaSk7XG5cbiAgICBsZXQgc2hvd1VpID0gKCkgPT4ge1xuICAgICAgaWYgKCFpc1VpU2hvd24pIHtcbiAgICAgICAgdWltYW5hZ2VyLm9uQ29udHJvbHNTaG93LmRpc3BhdGNoKHRoaXMpO1xuICAgICAgICBpc1VpU2hvd24gPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgc2hvd1VpUGVybWFuZW50bHkgPSAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICAgIHRoaXMuY2FzdFVpSGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICB9O1xuXG4gICAgbGV0IHNob3dVaVdpdGhUaW1lb3V0ID0gKCkgPT4ge1xuICAgICAgc2hvd1VpKCk7XG4gICAgICB0aGlzLmNhc3RVaUhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIGxldCBzaG93VWlBZnRlclNlZWsgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzUGxheWluZygpKSB7XG4gICAgICAgIHNob3dVaVdpdGhUaW1lb3V0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaG93VWlQZXJtYW5lbnRseSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgc2hvd1VpV2l0aFRpbWVvdXQpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9MT0FERUQsIHNob3dVaVdpdGhUaW1lb3V0KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCBzaG93VWlXaXRoVGltZW91dCk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUEFVU0VELCBzaG93VWlQZXJtYW5lbnRseSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFSywgc2hvd1VpUGVybWFuZW50bHkpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgc2hvd1VpQWZ0ZXJTZWVrKTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIHRoaXMuY2FzdFVpSGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge0NvbnRhaW5lciwgQ29udGFpbmVyQ29uZmlnfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge0V2ZW50LCBFdmVudERpc3BhdGNoZXIsIE5vQXJnc30gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCBDb25maWcgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuQ29uZmlnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBDaGVja2JveH0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2hlY2tib3hDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGxhYmVsIGZvciB0aGUgY2hlY2tib3guXG4gICAqL1xuICB0ZXh0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBDaGVja2JveCBleHRlbmRzIENvbnRhaW5lcjxDaGVja2JveENvbmZpZz4ge1xuXG4gIHByaXZhdGUgbGFiZWw6IExhYmVsPExhYmVsQ29uZmlnPjtcbiAgcHJpdmF0ZSBidXR0b246IFRvZ2dsZUJ1dHRvbjxUb2dnbGVCdXR0b25Db25maWc+O1xuXG4gIHByaXZhdGUgY2hlY2tib3hFdmVudHMgPSB7XG4gICAgb25DbGljazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDaGVja2JveCwgTm9BcmdzPigpLFxuICAgIG9uQ2hhbmdlOiBuZXcgRXZlbnREaXNwYXRjaGVyPENoZWNrYm94LCBOb0FyZ3M+KClcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENoZWNrYm94Q29uZmlnID0ge3RleHQ6ICcnfSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmxhYmVsID0gbmV3IExhYmVsKHtjc3NDbGFzc2VzOiBbJ2NoZWNrYm94LWxhYmVsJ10sIHRleHQ6IGNvbmZpZy50ZXh0fSk7XG4gICAgdGhpcy5idXR0b24gPSBuZXcgVG9nZ2xlQnV0dG9uKHtjc3NDbGFzc2VzOiBbJ2NoZWNrYm94LWJ1dHRvbiddfSk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNoZWNrYm94JyxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLmJ1dHRvbiwgdGhpcy5sYWJlbF1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGVsZW1lbnQgYW5kXG4gICAgLy8gdHJpZ2dlciB0aGUgY29ycmVzcG9uZGluZyBldmVudHMgb24gdGhlIGJ1dHRvbiBjb21wb25lbnRcbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmJ1dHRvbi50b2dnbGUoKVxuICAgICAgdGhpcy5vbkNsaWNrRXZlbnQoKVxuICAgICAgdGhpcy5vbkNoYW5nZUV2ZW50KClcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFyYml0cmFyeSB0ZXh0IG9uIHRoZSBsYWJlbC5cbiAgICogQHBhcmFtIHRleHQgdGhlIHRleHQgdG8gc2hvdyBvbiB0aGUgbGFiZWxcbiAgICovXG4gIHNldFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy5sYWJlbC5zZXRUZXh0KHRleHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uQ2xpY2tFdmVudCgpIHtcbiAgICB0aGlzLmNoZWNrYm94RXZlbnRzLm9uQ2xpY2suZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25DaGFuZ2VFdmVudCgpIHtcbiAgICB0aGlzLmNoZWNrYm94RXZlbnRzLm9uQ2hhbmdlLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxDaGVja2JveCwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvbkNsaWNrKCk6IEV2ZW50PENoZWNrYm94LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jaGVja2JveEV2ZW50cy5vbkNsaWNrLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqIEByZXR1cm5zIHtFdmVudDxDaGVja2JveCwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvbkNoYW5nZSgpOiBFdmVudDxDaGVja2JveCwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2tib3hFdmVudHMub25DaGFuZ2UuZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIGdldCBpc09uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmJ1dHRvbi5pc09uKClcbiAgfVxufSIsImltcG9ydCB7QnV0dG9uLCBCdXR0b25Db25maWd9IGZyb20gJy4vYnV0dG9uJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgQ2xpY2tPdmVybGF5fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGlja092ZXJsYXlDb25maWcgZXh0ZW5kcyBCdXR0b25Db25maWcge1xuICAvKipcbiAgICogVGhlIHVybCB0byBvcGVuIHdoZW4gdGhlIG92ZXJsYXkgaXMgY2xpY2tlZC4gU2V0IHRvIG51bGwgdG8gZGlzYWJsZSB0aGUgY2xpY2sgaGFuZGxlci5cbiAgICovXG4gIHVybD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGNsaWNrIG92ZXJsYXkgdGhhdCBvcGVucyBhbiB1cmwgaW4gYSBuZXcgdGFiIGlmIGNsaWNrZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbGlja092ZXJsYXkgZXh0ZW5kcyBCdXR0b248Q2xpY2tPdmVybGF5Q29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDbGlja092ZXJsYXlDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNsaWNrb3ZlcmxheSdcbiAgICB9LCA8Q2xpY2tPdmVybGF5Q29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5zZXRVcmwoKDxDbGlja092ZXJsYXlDb25maWc+dGhpcy5jb25maWcpLnVybCk7XG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLmdldERvbUVsZW1lbnQoKTtcbiAgICBlbGVtZW50Lm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgIGlmIChlbGVtZW50LmRhdGEoJ3VybCcpKSB7XG4gICAgICAgIHdpbmRvdy5vcGVuKGVsZW1lbnQuZGF0YSgndXJsJyksICdfYmxhbmsnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBVUkwgdGhhdCBzaG91bGQgYmUgZm9sbG93ZWQgd2hlbiB0aGUgd2F0ZXJtYXJrIGlzIGNsaWNrZWQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSB3YXRlcm1hcmsgVVJMXG4gICAqL1xuICBnZXRVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXREb21FbGVtZW50KCkuZGF0YSgndXJsJyk7XG4gIH1cblxuICBzZXRVcmwodXJsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodXJsID09PSB1bmRlZmluZWQgfHwgdXJsID09IG51bGwpIHtcbiAgICAgIHVybCA9ICcnO1xuICAgIH1cbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kYXRhKCd1cmwnLCB1cmwpO1xuICB9XG59IiwiaW1wb3J0IHtCdXR0b25Db25maWcsIEJ1dHRvbn0gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBDbG9zZUJ1dHRvbn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvc2VCdXR0b25Db25maWcgZXh0ZW5kcyBCdXR0b25Db25maWcge1xuICAvKipcbiAgICogVGhlIGNvbXBvbmVudCB0aGF0IHNob3VsZCBiZSBjbG9zZWQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gICAqL1xuICB0YXJnZXQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+O1xufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgY2xvc2VzIChoaWRlcykgYSBjb25maWd1cmVkIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIENsb3NlQnV0dG9uIGV4dGVuZHMgQnV0dG9uPENsb3NlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDbG9zZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNsb3NlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdDbG9zZSdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxDbG9zZUJ1dHRvbkNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25maWcudGFyZ2V0LmhpZGUoKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQ2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbkNvbmZpZyBleHRlbmRzIFRvZ2dsZUJ1dHRvbkNvbmZpZyB7XG5cbn1cblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdmlzaWJpbGl0eSBvZiBhIGVtYmVkVmlkZW8gcGFuZWwuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPENsb3NlZENhcHRpb25pbmdUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENsb3NlZENhcHRpb25pbmdUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNsb3NlZGNhcHRpb25pbmctdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdDbG9zZWQgQ2FwdGlvbmluZydcbiAgICB9LCA8Q2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbkNvbmZpZz50aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7IC8vIFRPRE8gZml4IGdlbmVyaWNzIHR5cGUgaW5mZXJlbmNlXG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdjbG9zZWQgY2FwdGlvbmluZyBidXR0b24gY2xpY2tlZCcpXG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtTZWVrQmFyfSBmcm9tICcuL3NlZWtiYXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIENvbW1lbnRzVG9nZ2xlQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21tZW50c1RvZ2dsZUJ1dHRvbkNvbmZpZyBleHRlbmRzIFRvZ2dsZUJ1dHRvbkNvbmZpZyB7XG4gIHNlZWtCYXI6IFNlZWtCYXJcbn1cblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdmlzaWJpbGl0eSBvZiBhIGVtYmVkVmlkZW8gcGFuZWwuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21tZW50c1RvZ2dsZUJ1dHRvbiBleHRlbmRzIFRvZ2dsZUJ1dHRvbjxDb21tZW50c1RvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc2Vla0JhcjogU2Vla0JhclxuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29tbWVudHNUb2dnbGVCdXR0b25Db25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgaWYgKCFjb25maWcuc2Vla0Jhcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCBTZWVrQmFyIGlzIG1pc3NpbmcnKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNvbW1lbnRzLXRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnQ29tbWVudHMnLFxuICAgICAgc2Vla0JhcjogbnVsbFxuICAgIH0sIDxDb21tZW50c1RvZ2dsZUJ1dHRvbkNvbmZpZz50aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxDb21tZW50c1RvZ2dsZUJ1dHRvbkNvbmZpZz50aGlzLmdldENvbmZpZygpOyAvLyBUT0RPIGZpeCBnZW5lcmljcyB0eXBlIGluZmVyZW5jZVxuICAgIGxldCBzZWVrQmFyID0gY29uZmlnLnNlZWtCYXJcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgc2Vla0Jhci50b2dnbGVDb21tZW50c09uKClcbiAgICB9KTtcblxuICAgIGxldCB1cGRhdGVPbk9mZiA9ICgpID0+IHtcbiAgICAgIGlmIChzZWVrQmFyLmNvbW1lbnRzT24pIHtcbiAgICAgICAgdGhpcy5vbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vZmYoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZWVrQmFyLm9uQ2hhbmdlQ29tbWVudHNPbi5zdWJzY3JpYmUoKGUsIG9uKSA9PiB7XG4gICAgICB1cGRhdGVPbk9mZigpO1xuICAgIH0pO1xuXG4gICAgdXBkYXRlT25PZmYoKTtcbiAgfVxufSIsImltcG9ydCB7R3VpZH0gZnJvbSAnLi4vZ3VpZCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyLCBOb0FyZ3MsIEV2ZW50fSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBCYXNlIGNvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIGNvbXBvbmVudC5cbiAqIFNob3VsZCBiZSBleHRlbmRlZCBieSBjb21wb25lbnRzIHRoYXQgd2FudCB0byBhZGQgYWRkaXRpb25hbCBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50Q29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBIVE1MIHRhZyBuYW1lIG9mIHRoZSBjb21wb25lbnQuXG4gICAqIERlZmF1bHQ6ICdkaXYnXG4gICAqL1xuICB0YWc/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgSFRNTCBJRCBvZiB0aGUgY29tcG9uZW50LlxuICAgKiBEZWZhdWx0OiBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCB3aXRoIHBhdHRlcm4gJ3VpLWlkLXtndWlkfScuXG4gICAqL1xuICBpZD86IHN0cmluZztcblxuICAvKipcbiAgICogQSBwcmVmaXggdG8gcHJlcGVuZCBhbGwgQ1NTIGNsYXNzZXMgd2l0aC5cbiAgICovXG4gIGNzc1ByZWZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIENTUyBjbGFzc2VzIG9mIHRoZSBjb21wb25lbnQuIFRoaXMgaXMgdXN1YWxseSB0aGUgY2xhc3MgZnJvbSB3aGVyZSB0aGUgY29tcG9uZW50IHRha2VzIGl0cyBzdHlsaW5nLlxuICAgKi9cbiAgY3NzQ2xhc3M/OiBzdHJpbmc7IC8vICdjbGFzcycgaXMgYSByZXNlcnZlZCBrZXl3b3JkLCBzbyB3ZSBuZWVkIHRvIG1ha2UgdGhlIG5hbWUgbW9yZSBjb21wbGljYXRlZFxuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIENTUyBjbGFzc2VzIG9mIHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBjc3NDbGFzc2VzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBoaWRkZW4gYXQgc3RhcnR1cC5cbiAgICogRGVmYXVsdDogZmFsc2VcbiAgICovXG4gIGhpZGRlbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50SG92ZXJDaGFuZ2VkRXZlbnRBcmdzIGV4dGVuZHMgTm9BcmdzIHtcbiAgLyoqXG4gICAqIFRydWUgaXMgdGhlIGNvbXBvbmVudCBpcyBob3ZlcmVkLCBlbHNlIGZhbHNlLlxuICAgKi9cbiAgaG92ZXJlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBjbGFzcyBvZiB0aGUgVUkgZnJhbWV3b3JrLlxuICogRWFjaCBjb21wb25lbnQgbXVzdCBleHRlbmQgdGhpcyBjbGFzcyBhbmQgb3B0aW9uYWxseSB0aGUgY29uZmlnIGludGVyZmFjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbXBvbmVudDxDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWc+IHtcblxuICAvKipcbiAgICogVGhlIGNsYXNzbmFtZSB0aGF0IGlzIGF0dGFjaGVkIHRvIHRoZSBlbGVtZW50IHdoZW4gaXQgaXMgaW4gdGhlIGhpZGRlbiBzdGF0ZS5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENMQVNTX0hJRERFTiA9ICdoaWRkZW4nO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIG9iamVjdCBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICovXG4gIHByb3RlY3RlZCBjb25maWc6IENvbmZpZztcblxuICAvKipcbiAgICogVGhlIGNvbXBvbmVudCdzIERPTSBlbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBlbGVtZW50OiBET007XG5cbiAgLyoqXG4gICAqIEZsYWcgdGhhdCBrZWVwcyB0cmFjayBvZiB0aGUgaGlkZGVuIHN0YXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBoaWRkZW46IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEZsYWcgdGhhdCBrZWVwcyB0cmFjayBvZiB0aGUgaG92ZXIgc3RhdGUuXG4gICAqL1xuICBwcml2YXRlIGhvdmVyZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGV2ZW50cyB0aGF0IHRoaXMgY29tcG9uZW50IG9mZmVycy4gVGhlc2UgZXZlbnRzIHNob3VsZCBhbHdheXMgYmUgcHJpdmF0ZSBhbmQgb25seSBkaXJlY3RseVxuICAgKiBhY2Nlc3NlZCBmcm9tIHdpdGhpbiB0aGUgaW1wbGVtZW50aW5nIGNvbXBvbmVudC5cbiAgICpcbiAgICogQmVjYXVzZSBUeXBlU2NyaXB0IGRvZXMgbm90IHN1cHBvcnQgcHJpdmF0ZSBwcm9wZXJ0aWVzIHdpdGggdGhlIHNhbWUgbmFtZSBvbiBkaWZmZXJlbnQgY2xhc3MgaGllcmFyY2h5IGxldmVsc1xuICAgKiAoaS5lLiBzdXBlcmNsYXNzIGFuZCBzdWJjbGFzcyBjYW5ub3QgY29udGFpbiBhIHByaXZhdGUgcHJvcGVydHkgd2l0aCB0aGUgc2FtZSBuYW1lKSwgdGhlIGRlZmF1bHQgbmFtaW5nXG4gICAqIGNvbnZlbnRpb24gZm9yIHRoZSBldmVudCBsaXN0IG9mIGEgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIGZvbGxvd2VkIGJ5IHN1YmNsYXNzZXMgaXMgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlXG4gICAqIGNhbWVsLWNhc2VkIGNsYXNzIG5hbWUgKyAnRXZlbnRzJyAoZS5nLiBTdWJDbGFzcyBleHRlbmRzIENvbXBvbmVudCA9PiBzdWJDbGFzc0V2ZW50cykuXG4gICAqIFNlZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50c30gZm9yIGFuIGV4YW1wbGUuXG4gICAqXG4gICAqIEV2ZW50IHByb3BlcnRpZXMgc2hvdWxkIGJlIG5hbWVkIGluIGNhbWVsIGNhc2Ugd2l0aCBhbiAnb24nIHByZWZpeCBhbmQgaW4gdGhlIHByZXNlbnQgdGVuc2UuIEFzeW5jIGV2ZW50cyBtYXlcbiAgICogaGF2ZSBhIHN0YXJ0IGV2ZW50ICh3aGVuIHRoZSBvcGVyYXRpb24gc3RhcnRzKSBpbiB0aGUgcHJlc2VudCB0ZW5zZSwgYW5kIG11c3QgaGF2ZSBhbiBlbmQgZXZlbnQgKHdoZW4gdGhlXG4gICAqIG9wZXJhdGlvbiBlbmRzKSBpbiB0aGUgcGFzdCB0ZW5zZSAob3IgcHJlc2VudCB0ZW5zZSBpbiBzcGVjaWFsIGNhc2VzIChlLmcuIG9uU3RhcnQvb25TdGFydGVkIG9yIG9uUGxheS9vblBsYXlpbmcpLlxuICAgKiBTZWUge0BsaW5rICNjb21wb25lbnRFdmVudHMjb25TaG93fSBmb3IgYW4gZXhhbXBsZS5cbiAgICpcbiAgICogRWFjaCBldmVudCBzaG91bGQgYmUgYWNjb21wYW5pZWQgd2l0aCBhIHByb3RlY3RlZCBtZXRob2QgbmFtZWQgYnkgdGhlIGNvbnZlbnRpb24gZXZlbnROYW1lICsgJ0V2ZW50J1xuICAgKiAoZS5nLiBvblN0YXJ0RXZlbnQpLCB0aGF0IGFjdHVhbGx5IHRyaWdnZXJzIHRoZSBldmVudCBieSBjYWxsaW5nIHtAbGluayBFdmVudERpc3BhdGNoZXIjZGlzcGF0Y2ggZGlzcGF0Y2h9IGFuZFxuICAgKiBwYXNzaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQgYXMgZmlyc3QgcGFyYW1ldGVyLiBDb21wb25lbnRzIHNob3VsZCBhbHdheXMgdHJpZ2dlciB0aGVpciBldmVudHMgd2l0aCB0aGVzZVxuICAgKiBtZXRob2RzLiBJbXBsZW1lbnRpbmcgdGhpcyBwYXR0ZXJuIGdpdmVzIHN1YmNsYXNzZXMgbWVhbnMgdG8gZGlyZWN0bHkgbGlzdGVuIHRvIHRoZSBldmVudHMgYnkgb3ZlcnJpZGluZyB0aGVcbiAgICogbWV0aG9kIChhbmQgc2F2aW5nIHRoZSBvdmVyaGVhZCBvZiBwYXNzaW5nIGEgaGFuZGxlciB0byB0aGUgZXZlbnQgZGlzcGF0Y2hlcikgYW5kIG1vcmUgaW1wb3J0YW50bHkgdG8gdHJpZ2dlclxuICAgKiB0aGVzZSBldmVudHMgd2l0aG91dCBoYXZpbmcgYWNjZXNzIHRvIHRoZSBwcml2YXRlIGV2ZW50IGxpc3QuXG4gICAqIFNlZSB7QGxpbmsgI29uU2hvd30gZm9yIGFuIGV4YW1wbGUuXG4gICAqXG4gICAqIFRvIHByb3ZpZGUgZXh0ZXJuYWwgY29kZSB0aGUgcG9zc2liaWxpdHkgdG8gbGlzdGVuIHRvIHRoaXMgY29tcG9uZW50J3MgZXZlbnRzIChzdWJzY3JpYmUsIHVuc3Vic2NyaWJlLCBldGMuKSxcbiAgICogZWFjaCBldmVudCBzaG91bGQgYWxzbyBiZSBhY2NvbXBhbmllZCBieSBhIHB1YmxpYyBnZXR0ZXIgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBuYW1lIGFzIHRoZSBldmVudCdzIHByb3BlcnR5LFxuICAgKiB0aGF0IHJldHVybnMgdGhlIHtAbGluayBFdmVudH0gb2J0YWluZWQgZnJvbSB0aGUgZXZlbnQgZGlzcGF0Y2hlciBieSBjYWxsaW5nIHtAbGluayBFdmVudERpc3BhdGNoZXIjZ2V0RXZlbnR9LlxuICAgKiBTZWUge0BsaW5rICNvblNob3d9IGZvciBhbiBleGFtcGxlLlxuICAgKlxuICAgKiBGdWxsIGV4YW1wbGUgZm9yIGFuIGV2ZW50IHJlcHJlc2VudGluZyBhbiBleGFtcGxlIGFjdGlvbiBpbiBhIGV4YW1wbGUgY29tcG9uZW50OlxuICAgKlxuICAgKiA8Y29kZT5cbiAgICogLy8gRGVmaW5lIGFuIGV4YW1wbGUgY29tcG9uZW50IGNsYXNzIHdpdGggYW4gZXhhbXBsZSBldmVudFxuICAgKiBjbGFzcyBFeGFtcGxlQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4ge1xuICAgICAqXG4gICAgICogICAgIHByaXZhdGUgZXhhbXBsZUNvbXBvbmVudEV2ZW50cyA9IHtcbiAgICAgKiAgICAgICAgIG9uRXhhbXBsZUFjdGlvbjogbmV3IEV2ZW50RGlzcGF0Y2hlcjxFeGFtcGxlQ29tcG9uZW50LCBOb0FyZ3M+KClcbiAgICAgKiAgICAgfVxuICAgICAqXG4gICAgICogICAgIC8vIGNvbnN0cnVjdG9yIGFuZCBvdGhlciBzdHVmZi4uLlxuICAgICAqXG4gICAgICogICAgIHByb3RlY3RlZCBvbkV4YW1wbGVBY3Rpb25FdmVudCgpIHtcbiAgICAgKiAgICAgICAgdGhpcy5leGFtcGxlQ29tcG9uZW50RXZlbnRzLm9uRXhhbXBsZUFjdGlvbi5kaXNwYXRjaCh0aGlzKTtcbiAgICAgKiAgICB9XG4gICAgICpcbiAgICAgKiAgICBnZXQgb25FeGFtcGxlQWN0aW9uKCk6IEV2ZW50PEV4YW1wbGVDb21wb25lbnQsIE5vQXJncz4ge1xuICAgICAqICAgICAgICByZXR1cm4gdGhpcy5leGFtcGxlQ29tcG9uZW50RXZlbnRzLm9uRXhhbXBsZUFjdGlvbi5nZXRFdmVudCgpO1xuICAgICAqICAgIH1cbiAgICAgKiB9XG4gICAqXG4gICAqIC8vIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IHNvbWV3aGVyZVxuICAgKiB2YXIgZXhhbXBsZUNvbXBvbmVudEluc3RhbmNlID0gbmV3IEV4YW1wbGVDb21wb25lbnQoKTtcbiAgICpcbiAgICogLy8gU3Vic2NyaWJlIHRvIHRoZSBleGFtcGxlIGV2ZW50IG9uIHRoZSBjb21wb25lbnRcbiAgICogZXhhbXBsZUNvbXBvbmVudEluc3RhbmNlLm9uRXhhbXBsZUFjdGlvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKHNlbmRlcjogRXhhbXBsZUNvbXBvbmVudCkge1xuICAgICAqICAgICBjb25zb2xlLmxvZygnb25FeGFtcGxlQWN0aW9uIG9mICcgKyBzZW5kZXIgKyAnIGhhcyBmaXJlZCEnKTtcbiAgICAgKiB9KTtcbiAgICogPC9jb2RlPlxuICAgKi9cbiAgcHJpdmF0ZSBjb21wb25lbnRFdmVudHMgPSB7XG4gICAgb25TaG93OiBuZXcgRXZlbnREaXNwYXRjaGVyPENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25IaWRlOiBuZXcgRXZlbnREaXNwYXRjaGVyPENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25Ib3ZlckNoYW5nZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbmZpZz4sIENvbXBvbmVudEhvdmVyQ2hhbmdlZEV2ZW50QXJncz4oKSxcbiAgfTtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIGNvbXBvbmVudCB3aXRoIGFuIG9wdGlvbmFsbHkgc3VwcGxpZWQgY29uZmlnLiBBbGwgc3ViY2xhc3NlcyBtdXN0IGNhbGwgdGhlIGNvbnN0cnVjdG9yIG9mIHRoZWlyXG4gICAqIHN1cGVyY2xhc3MgYW5kIHRoZW4gbWVyZ2UgdGhlaXIgY29uZmlndXJhdGlvbiBpbnRvIHRoZSBjb21wb25lbnQncyBjb25maWd1cmF0aW9uLlxuICAgKiBAcGFyYW0gY29uZmlnIHRoZSBjb25maWd1cmF0aW9uIGZvciB0aGUgY29tcG9uZW50XG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbXBvbmVudENvbmZpZyA9IHt9KSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBjb25maWd1cmF0aW9uIGZvciB0aGlzIGNvbXBvbmVudFxuICAgIHRoaXMuY29uZmlnID0gPENvbmZpZz50aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgdGFnOiAnZGl2JyxcbiAgICAgIGlkOiAnYm1wdWktaWQtJyArIEd1aWQubmV4dCgpLFxuICAgICAgY3NzUHJlZml4OiAnYm1wdWknLFxuICAgICAgY3NzQ2xhc3M6ICd1aS1jb21wb25lbnQnLFxuICAgICAgY3NzQ2xhc3NlczogW10sXG4gICAgICBoaWRkZW46IGZhbHNlXG4gICAgfSwge30pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBjb21wb25lbnQsIGUuZy4gYnkgYXBwbHlpbmcgY29uZmlnIHNldHRpbmdzLlxuICAgKiBUaGlzIG1ldGhvZCBtdXN0IG5vdCBiZSBjYWxsZWQgZnJvbSBvdXRzaWRlIHRoZSBVSSBmcmFtZXdvcmsuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIGJ5IHRoZSB7QGxpbmsgVUlJbnN0YW5jZU1hbmFnZXJ9LiBJZiB0aGUgY29tcG9uZW50IGlzIGFuIGlubmVyIGNvbXBvbmVudCBvZlxuICAgKiBzb21lIGNvbXBvbmVudCwgYW5kIHRodXMgZW5jYXBzdWxhdGVkIGFiZCBtYW5hZ2VkIGludGVybmFsbHkgYW5kIG5ldmVyIGRpcmVjdGx5IGV4cG9zZWQgdG8gdGhlIFVJTWFuYWdlcixcbiAgICogdGhpcyBtZXRob2QgbXVzdCBiZSBjYWxsZWQgZnJvbSB0aGUgbWFuYWdpbmcgY29tcG9uZW50J3Mge0BsaW5rICNpbml0aWFsaXplfSBtZXRob2QuXG4gICAqL1xuICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIHRoaXMuaGlkZGVuID0gdGhpcy5jb25maWcuaGlkZGVuO1xuXG4gICAgLy8gSGlkZSB0aGUgY29tcG9uZW50IGF0IGluaXRpYWxpemF0aW9uIGlmIGl0IGlzIGNvbmZpZ3VyZWQgdG8gYmUgaGlkZGVuXG4gICAgaWYgKHRoaXMuaXNIaWRkZW4oKSkge1xuICAgICAgdGhpcy5oaWRkZW4gPSBmYWxzZTsgLy8gU2V0IGZsYWcgdG8gZmFsc2UgZm9yIHRoZSBmb2xsb3dpbmcgaGlkZSgpIGNhbGwgdG8gd29yayAoaGlkZSgpIGNoZWNrcyB0aGUgZmxhZylcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBjb21wb25lbnQgZm9yIHRoZSBzdXBwbGllZCBQbGF5ZXIgYW5kIFVJSW5zdGFuY2VNYW5hZ2VyLiBUaGlzIGlzIHRoZSBwbGFjZSB3aGVyZSBhbGwgdGhlIG1hZ2ljXG4gICAqIGhhcHBlbnMsIHdoZXJlIGNvbXBvbmVudHMgdHlwaWNhbGx5IHN1YnNjcmliZSBhbmQgcmVhY3QgdG8gZXZlbnRzIChvbiB0aGVpciBET00gZWxlbWVudCwgdGhlIFBsYXllciwgb3IgdGhlXG4gICAqIFVJSW5zdGFuY2VNYW5hZ2VyKSwgYW5kIGJhc2ljYWxseSBldmVyeXRoaW5nIHRoYXQgbWFrZXMgdGhlbSBpbnRlcmFjdGl2ZS5cbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIG9ubHkgb25jZSwgd2hlbiB0aGUgVUlNYW5hZ2VyIGluaXRpYWxpemVzIHRoZSBVSS5cbiAgICpcbiAgICogU3ViY2xhc3NlcyB1c3VhbGx5IG92ZXJ3cml0ZSB0aGlzIG1ldGhvZCB0byBhZGQgdGhlaXIgb3duIGZ1bmN0aW9uYWxpdHkuXG4gICAqXG4gICAqIEBwYXJhbSBwbGF5ZXIgdGhlIHBsYXllciB3aGljaCB0aGlzIGNvbXBvbmVudCBjb250cm9sc1xuICAgKiBAcGFyYW0gdWltYW5hZ2VyIHRoZSBVSUluc3RhbmNlTWFuYWdlciB0aGF0IG1hbmFnZXMgdGhpcyBjb21wb25lbnRcbiAgICovXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHRoaXMub25TaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB1aW1hbmFnZXIub25Db21wb25lbnRTaG93LmRpc3BhdGNoKHRoaXMpO1xuICAgIH0pO1xuICAgIHRoaXMub25IaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB1aW1hbmFnZXIub25Db21wb25lbnRIaWRlLmRpc3BhdGNoKHRoaXMpO1xuICAgIH0pO1xuXG4gICAgLy8gVHJhY2sgdGhlIGhvdmVyZWQgc3RhdGUgb2YgdGhlIGVsZW1lbnRcbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIHRoaXMub25Ib3ZlckNoYW5nZWRFdmVudCh0cnVlKTtcbiAgICB9KTtcbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIHRoaXMub25Ib3ZlckNoYW5nZWRFdmVudChmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZXMgYWxsIHJlc291cmNlcyBhbmQgZGVwZW5kZW5jaWVzIHRoYXQgdGhlIGNvbXBvbmVudCBob2xkcy4gUGxheWVyLCBET00sIGFuZCBVSU1hbmFnZXIgZXZlbnRzIGFyZVxuICAgKiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgZHVyaW5nIHJlbGVhc2UgYW5kIGRvIG5vdCBleHBsaWNpdGx5IG5lZWQgdG8gYmUgcmVtb3ZlZCBoZXJlLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIFVJTWFuYWdlciB3aGVuIGl0IHJlbGVhc2VzIHRoZSBVSS5cbiAgICpcbiAgICogU3ViY2xhc3NlcyB0aGF0IG5lZWQgdG8gcmVsZWFzZSByZXNvdXJjZXMgc2hvdWxkIG92ZXJyaWRlIHRoaXMgbWV0aG9kIGFuZCBjYWxsIHN1cGVyLnJlbGVhc2UoKS5cbiAgICovXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgLy8gTm90aGluZyB0byBkbyBoZXJlLCBvdmVycmlkZSB3aGVyZSBuZWNlc3NhcnlcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSB0aGUgRE9NIGVsZW1lbnQgZm9yIHRoaXMgY29tcG9uZW50LlxuICAgKlxuICAgKiBTdWJjbGFzc2VzIHVzdWFsbHkgb3ZlcndyaXRlIHRoaXMgbWV0aG9kIHRvIGV4dGVuZCBvciByZXBsYWNlIHRoZSBET00gZWxlbWVudCB3aXRoIHRoZWlyIG93biBkZXNpZ24uXG4gICAqL1xuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGVsZW1lbnQgPSBuZXcgRE9NKHRoaXMuY29uZmlnLnRhZywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgRE9NIGVsZW1lbnQgb2YgdGhpcyBjb21wb25lbnQuIENyZWF0ZXMgdGhlIERPTSBlbGVtZW50IGlmIGl0IGRvZXMgbm90IHlldCBleGlzdC5cbiAgICpcbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiBieSBzdWJjbGFzc2VzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgZ2V0RG9tRWxlbWVudCgpOiBET00ge1xuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSB0aGlzLnRvRG9tRWxlbWVudCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VzIGEgY29uZmlndXJhdGlvbiB3aXRoIGEgZGVmYXVsdCBjb25maWd1cmF0aW9uIGFuZCBhIGJhc2UgY29uZmlndXJhdGlvbiBmcm9tIHRoZSBzdXBlcmNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gY29uZmlnIHRoZSBjb25maWd1cmF0aW9uIHNldHRpbmdzIGZvciB0aGUgY29tcG9uZW50cywgYXMgdXN1YWxseSBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBkZWZhdWx0cyBhIGRlZmF1bHQgY29uZmlndXJhdGlvbiBmb3Igc2V0dGluZ3MgdGhhdCBhcmUgbm90IHBhc3NlZCB3aXRoIHRoZSBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBiYXNlIGNvbmZpZ3VyYXRpb24gaW5oZXJpdGVkIGZyb20gYSBzdXBlcmNsYXNzXG4gICAqIEByZXR1cm5zIHtDb25maWd9XG4gICAqL1xuICBwcm90ZWN0ZWQgbWVyZ2VDb25maWc8Q29uZmlnPihjb25maWc6IENvbmZpZywgZGVmYXVsdHM6IENvbmZpZywgYmFzZTogQ29uZmlnKTogQ29uZmlnIHtcbiAgICAvLyBFeHRlbmQgZGVmYXVsdCBjb25maWcgd2l0aCBzdXBwbGllZCBjb25maWdcbiAgICBsZXQgbWVyZ2VkID0gT2JqZWN0LmFzc2lnbih7fSwgYmFzZSwgZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICAvLyBSZXR1cm4gdGhlIGV4dGVuZGVkIGNvbmZpZ1xuICAgIHJldHVybiBtZXJnZWQ7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0aGF0IHJldHVybnMgYSBzdHJpbmcgb2YgYWxsIENTUyBjbGFzc2VzIG9mIHRoZSBjb21wb25lbnQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0Q3NzQ2xhc3NlcygpOiBzdHJpbmcge1xuICAgIC8vIE1lcmdlIGFsbCBDU1MgY2xhc3NlcyBpbnRvIHNpbmdsZSBhcnJheVxuICAgIGxldCBmbGF0dGVuZWRBcnJheSA9IFt0aGlzLmNvbmZpZy5jc3NDbGFzc10uY29uY2F0KHRoaXMuY29uZmlnLmNzc0NsYXNzZXMpO1xuICAgIC8vIFByZWZpeCBjbGFzc2VzXG4gICAgZmxhdHRlbmVkQXJyYXkgPSBmbGF0dGVuZWRBcnJheS5tYXAoKGNzcykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4Q3NzKGNzcyk7XG4gICAgfSk7XG4gICAgLy8gSm9pbiBhcnJheSB2YWx1ZXMgaW50byBhIHN0cmluZ1xuICAgIGxldCBmbGF0dGVuZWRTdHJpbmcgPSBmbGF0dGVuZWRBcnJheS5qb2luKCcgJyk7XG4gICAgLy8gUmV0dXJuIHRyaW1tZWQgc3RyaW5nIHRvIHByZXZlbnQgd2hpdGVzcGFjZSBhdCB0aGUgZW5kIGZyb20gdGhlIGpvaW4gb3BlcmF0aW9uXG4gICAgcmV0dXJuIGZsYXR0ZW5lZFN0cmluZy50cmltKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcHJlZml4Q3NzKGNzc0NsYXNzT3JJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWcuY3NzUHJlZml4ICsgJy0nICsgY3NzQ2xhc3NPcklkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG9mIHRoZSBjb21wb25lbnQuXG4gICAqIEByZXR1cm5zIHtDb25maWd9XG4gICAqL1xuICBwdWJsaWMgZ2V0Q29uZmlnKCk6IENvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGVzIHRoZSBjb21wb25lbnQgaWYgc2hvd24uXG4gICAqIFRoaXMgbWV0aG9kIGJhc2ljYWxseSB0cmFuc2ZlcnMgdGhlIGNvbXBvbmVudCBpbnRvIHRoZSBoaWRkZW4gc3RhdGUuIEFjdHVhbCBoaWRpbmcgaXMgZG9uZSB2aWEgQ1NTLlxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICBpZiAoIXRoaXMuaGlkZGVuKSB7XG4gICAgICB0aGlzLmhpZGRlbiA9IHRydWU7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhDb21wb25lbnQuQ0xBU1NfSElEREVOKSk7XG4gICAgICB0aGlzLm9uSGlkZUV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3dzIHRoZSBjb21wb25lbnQgaWYgaGlkZGVuLlxuICAgKi9cbiAgc2hvdygpIHtcbiAgICBpZiAodGhpcy5oaWRkZW4pIHtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKENvbXBvbmVudC5DTEFTU19ISURERU4pKTtcbiAgICAgIHRoaXMuaGlkZGVuID0gZmFsc2U7XG4gICAgICB0aGlzLm9uU2hvd0V2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhlIGNvbXBvbmVudCBpcyBoaWRkZW4uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBjb21wb25lbnQgaXMgaGlkZGVuLCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc0hpZGRlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5oaWRkZW47XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY29tcG9uZW50IGlzIHNob3duLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgY29tcG9uZW50IGlzIHZpc2libGUsIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzU2hvd24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzSGlkZGVuKCk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgaGlkZGVuIHN0YXRlIGJ5IGhpZGluZyB0aGUgY29tcG9uZW50IGlmIGl0IGlzIHNob3duLCBvciBzaG93aW5nIGl0IGlmIGhpZGRlbi5cbiAgICovXG4gIHRvZ2dsZUhpZGRlbigpIHtcbiAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhlIGNvbXBvbmVudCBpcyBjdXJyZW50bHkgaG92ZXJlZC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBpcyBob3ZlcmVkLCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaG92ZXJlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB0aGUgb25TaG93IGV2ZW50LlxuICAgKiBTZWUgdGhlIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9uIGV2ZW50IGFyY2hpdGVjdHVyZSBvbiB0aGUge0BsaW5rICNjb21wb25lbnRFdmVudHMgZXZlbnRzIGxpc3R9LlxuICAgKi9cbiAgcHJvdGVjdGVkIG9uU2hvd0V2ZW50KCk6IHZvaWQge1xuICAgIHRoaXMuY29tcG9uZW50RXZlbnRzLm9uU2hvdy5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB0aGUgb25IaWRlIGV2ZW50LlxuICAgKiBTZWUgdGhlIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9uIGV2ZW50IGFyY2hpdGVjdHVyZSBvbiB0aGUge0BsaW5rICNjb21wb25lbnRFdmVudHMgZXZlbnRzIGxpc3R9LlxuICAgKi9cbiAgcHJvdGVjdGVkIG9uSGlkZUV2ZW50KCk6IHZvaWQge1xuICAgIHRoaXMuY29tcG9uZW50RXZlbnRzLm9uSGlkZS5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB0aGUgb25Ib3ZlckNoYW5nZWQgZXZlbnQuXG4gICAqIFNlZSB0aGUgZGV0YWlsZWQgZXhwbGFuYXRpb24gb24gZXZlbnQgYXJjaGl0ZWN0dXJlIG9uIHRoZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyBldmVudHMgbGlzdH0uXG4gICAqL1xuICBwcm90ZWN0ZWQgb25Ib3ZlckNoYW5nZWRFdmVudChob3ZlcmVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5ob3ZlcmVkID0gaG92ZXJlZDtcbiAgICB0aGlzLmNvbXBvbmVudEV2ZW50cy5vbkhvdmVyQ2hhbmdlZC5kaXNwYXRjaCh0aGlzLCB7IGhvdmVyZWQ6IGhvdmVyZWQgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgc2hvd2luZy5cbiAgICogU2VlIHRoZSBkZXRhaWxlZCBleHBsYW5hdGlvbiBvbiBldmVudCBhcmNoaXRlY3R1cmUgb24gdGhlIHtAbGluayAjY29tcG9uZW50RXZlbnRzIGV2ZW50cyBsaXN0fS5cbiAgICogQHJldHVybnMge0V2ZW50PENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uU2hvdygpOiBFdmVudDxDb21wb25lbnQ8Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50RXZlbnRzLm9uU2hvdy5nZXRFdmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGhpZGluZy5cbiAgICogU2VlIHRoZSBkZXRhaWxlZCBleHBsYW5hdGlvbiBvbiBldmVudCBhcmNoaXRlY3R1cmUgb24gdGhlIHtAbGluayAjY29tcG9uZW50RXZlbnRzIGV2ZW50cyBsaXN0fS5cbiAgICogQHJldHVybnMge0V2ZW50PENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uSGlkZSgpOiBFdmVudDxDb21wb25lbnQ8Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50RXZlbnRzLm9uSGlkZS5nZXRFdmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgY29tcG9uZW50J3MgaG92ZXItc3RhdGUgaXMgY2hhbmdpbmcuXG4gICAqIEByZXR1cm5zIHtFdmVudDxDb21wb25lbnQ8Q29uZmlnPiwgQ29tcG9uZW50SG92ZXJDaGFuZ2VkRXZlbnRBcmdzPn1cbiAgICovXG4gIGdldCBvbkhvdmVyQ2hhbmdlZCgpOiBFdmVudDxDb21wb25lbnQ8Q29uZmlnPiwgQ29tcG9uZW50SG92ZXJDaGFuZ2VkRXZlbnRBcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50RXZlbnRzLm9uSG92ZXJDaGFuZ2VkLmdldEV2ZW50KCk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudENvbmZpZywgQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7QXJyYXlVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBDb250YWluZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbnRhaW5lckNvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gIC8qKlxuICAgKiBDaGlsZCBjb21wb25lbnRzIG9mIHRoZSBjb250YWluZXIuXG4gICAqL1xuICBjb21wb25lbnRzPzogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz5bXTtcbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBjb21wb25lbnQgdGhhdCBjYW4gY29udGFpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29tcG9uZW50cy5cbiAqIENvbXBvbmVudHMgY2FuIGJlIGFkZGVkIGF0IGNvbnN0cnVjdGlvbiB0aW1lIHRocm91Z2ggdGhlIHtAbGluayBDb250YWluZXJDb25maWcjY29tcG9uZW50c30gc2V0dGluZywgb3IgbGF0ZXJcbiAqIHRocm91Z2ggdGhlIHtAbGluayBDb250YWluZXIjYWRkQ29tcG9uZW50fSBtZXRob2QuIFRoZSBVSU1hbmFnZXIgYXV0b21hdGljYWxseSB0YWtlcyBjYXJlIG9mIGFsbCBjb21wb25lbnRzLCBpLmUuIGl0XG4gKiBpbml0aWFsaXplcyBhbmQgY29uZmlndXJlcyB0aGVtIGF1dG9tYXRpY2FsbHkuXG4gKlxuICogSW4gdGhlIERPTSwgdGhlIGNvbnRhaW5lciBjb25zaXN0cyBvZiBhbiBvdXRlciA8ZGl2PiAodGhhdCBjYW4gYmUgY29uZmlndXJlZCBieSB0aGUgY29uZmlnKSBhbmQgYW4gaW5uZXIgd3JhcHBlclxuICogPGRpdj4gdGhhdCBjb250YWlucyB0aGUgY29tcG9uZW50cy4gVGhpcyBkb3VibGUtPGRpdj4tc3RydWN0dXJlIGlzIG9mdGVuIHJlcXVpcmVkIHRvIGFjaGlldmUgbWFueSBhZHZhbmNlZCBlZmZlY3RzXG4gKiBpbiBDU1MgYW5kL29yIEpTLCBlLmcuIGFuaW1hdGlvbnMgYW5kIGNlcnRhaW4gZm9ybWF0dGluZyB3aXRoIGFic29sdXRlIHBvc2l0aW9uaW5nLlxuICpcbiAqIERPTSBleGFtcGxlOlxuICogPGNvZGU+XG4gKiAgICAgPGRpdiBjbGFzcz0ndWktY29udGFpbmVyJz5cbiAqICAgICAgICAgPGRpdiBjbGFzcz0nY29udGFpbmVyLXdyYXBwZXInPlxuICogICAgICAgICAgICAgLi4uIGNoaWxkIGNvbXBvbmVudHMgLi4uXG4gKiAgICAgICAgIDwvZGl2PlxuICogICAgIDwvZGl2PlxuICogPC9jb2RlPlxuICovXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyPENvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZz4gZXh0ZW5kcyBDb21wb25lbnQ8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgLyoqXG4gICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBpbm5lciBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIGNvbXBvbmVudHMgb2YgdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIHByaXZhdGUgaW5uZXJDb250YWluZXJFbGVtZW50OiBET007XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb250YWluZXJDb25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1jb250YWluZXInLFxuICAgICAgY29tcG9uZW50czogW11cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNoaWxkIGNvbXBvbmVudCB0byB0aGUgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gY29tcG9uZW50IHRoZSBjb21wb25lbnQgdG8gYWRkXG4gICAqL1xuICBhZGRDb21wb25lbnQoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPikge1xuICAgIHRoaXMuY29uZmlnLmNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjaGlsZCBjb21wb25lbnQgZnJvbSB0aGUgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gY29tcG9uZW50IHRoZSBjb21wb25lbnQgdG8gcmVtb3ZlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gcmVtb3ZlZCwgZmFsc2UgaWYgaXQgaXMgbm90IGNvbnRhaW5lZCBpbiB0aGlzIGNvbnRhaW5lclxuICAgKi9cbiAgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gQXJyYXlVdGlscy5yZW1vdmUodGhpcy5jb25maWcuY29tcG9uZW50cywgY29tcG9uZW50KSAhPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gYXJyYXkgb2YgYWxsIGNoaWxkIGNvbXBvbmVudHMgaW4gdGhpcyBjb250YWluZXIuXG4gICAqIEByZXR1cm5zIHtDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPltdfVxuICAgKi9cbiAgZ2V0Q29tcG9uZW50cygpOiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPltdIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWcuY29tcG9uZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCBjaGlsZCBjb21wb25lbnRzIGZyb20gdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIHJlbW92ZUNvbXBvbmVudHMoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBET00gb2YgdGhlIGNvbnRhaW5lciB3aXRoIHRoZSBjdXJyZW50IGNvbXBvbmVudHMuXG4gICAqL1xuICBwcm90ZWN0ZWQgdXBkYXRlQ29tcG9uZW50cygpOiB2b2lkIHtcbiAgICB0aGlzLmlubmVyQ29udGFpbmVyRWxlbWVudC5lbXB0eSgpO1xuXG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuY29uZmlnLmNvbXBvbmVudHMpIHtcbiAgICAgIHRoaXMuaW5uZXJDb250YWluZXJFbGVtZW50LmFwcGVuZChjb21wb25lbnQuZ2V0RG9tRWxlbWVudCgpKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBjb250YWluZXIgZWxlbWVudCAodGhlIG91dGVyIDxkaXY+KVxuICAgIGxldCBjb250YWluZXJFbGVtZW50ID0gbmV3IERPTSh0aGlzLmNvbmZpZy50YWcsIHtcbiAgICAgICdpZCc6IHRoaXMuY29uZmlnLmlkLFxuICAgICAgJ2NsYXNzJzogdGhpcy5nZXRDc3NDbGFzc2VzKClcbiAgICB9KTtcblxuICAgIC8vIENyZWF0ZSB0aGUgaW5uZXIgY29udGFpbmVyIGVsZW1lbnQgKHRoZSBpbm5lciA8ZGl2PikgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGNvbXBvbmVudHNcbiAgICBsZXQgaW5uZXJDb250YWluZXIgPSBuZXcgRE9NKHRoaXMuY29uZmlnLnRhZywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2NvbnRhaW5lci13cmFwcGVyJylcbiAgICB9KTtcbiAgICB0aGlzLmlubmVyQ29udGFpbmVyRWxlbWVudCA9IGlubmVyQ29udGFpbmVyO1xuXG4gICAgdGhpcy51cGRhdGVDb21wb25lbnRzKCk7XG5cbiAgICBjb250YWluZXJFbGVtZW50LmFwcGVuZChpbm5lckNvbnRhaW5lcik7XG5cbiAgICByZXR1cm4gY29udGFpbmVyRWxlbWVudDtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1VJVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7U3BhY2VyfSBmcm9tICcuL3NwYWNlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQ29udHJvbEJhcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udHJvbEJhckNvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8vIG5vdGhpbmcgeWV0XG59XG5cbi8qKlxuICogQSBjb250YWluZXIgZm9yIG1haW4gcGxheWVyIGNvbnRyb2wgY29tcG9uZW50cywgZS5nLiBwbGF5IHRvZ2dsZSBidXR0b24sIHNlZWsgYmFyLCB2b2x1bWUgY29udHJvbCwgZnVsbHNjcmVlbiB0b2dnbGVcbiAqIGJ1dHRvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbnRyb2xCYXIgZXh0ZW5kcyBDb250YWluZXI8Q29udHJvbEJhckNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udHJvbEJhckNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNvbnRyb2xiYXInLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgIH0sIDxDb250cm9sQmFyQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICAvLyBDb3VudHMgaG93IG1hbnkgY29tcG9uZW50cyBhcmUgaG92ZXJlZCBhbmQgYmxvY2sgaGlkaW5nIG9mIHRoZSBjb250cm9sIGJhclxuICAgIGxldCBob3ZlclN0YWNrQ291bnQgPSAwO1xuXG4gICAgLy8gVHJhY2sgaG92ZXIgc3RhdHVzIG9mIGNoaWxkIGNvbXBvbmVudHNcbiAgICBVSVV0aWxzLnRyYXZlcnNlVHJlZSh0aGlzLCAoY29tcG9uZW50KSA9PiB7XG4gICAgICAvLyBEbyBub3QgdHJhY2sgaG92ZXIgc3RhdHVzIG9mIGNoaWxkIGNvbnRhaW5lcnMgb3Igc3BhY2Vycywgb25seSBvZiAncmVhbCcgY29udHJvbHNcbiAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb250YWluZXIgfHwgY29tcG9uZW50IGluc3RhbmNlb2YgU3BhY2VyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gU3Vic2NyaWJlIGhvdmVyIGV2ZW50IGFuZCBrZWVwIGEgY291bnQgb2YgdGhlIG51bWJlciBvZiBob3ZlcmVkIGNoaWxkcmVuXG4gICAgICBjb21wb25lbnQub25Ib3ZlckNoYW5nZWQuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGFyZ3MuaG92ZXJlZCkge1xuICAgICAgICAgIGhvdmVyU3RhY2tDb3VudCsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhvdmVyU3RhY2tDb3VudC0tO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzU2hvdy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uUHJldmlld0NvbnRyb2xzSGlkZS5zdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xuICAgICAgLy8gQ2FuY2VsIHRoZSBoaWRlIGV2ZW50IGlmIGhvdmVyZWQgY2hpbGQgY29tcG9uZW50cyBibG9jayBoaWRpbmdcbiAgICAgIGFyZ3MuY2FuY2VsID0gKGhvdmVyU3RhY2tDb3VudCA+IDApO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lckNvbmZpZywgQ29udGFpbmVyfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcbmltcG9ydCB7TGFiZWwsIExhYmVsQ29uZmlnfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7Q2xvc2VCdXR0b259IGZyb20gJy4vY2xvc2VidXR0b24nO1xuaW1wb3J0IHtDaGVja2JveH0gZnJvbSAnLi9jaGVja2JveCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIEVtYmVkVmlkZW9QYW5lbH0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW1iZWRWaWRlb1BhbmVsQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIGVtYmVkVmlkZW8gcGFuZWwgd2lsbCBiZSBoaWRkZW4gd2hlbiB0aGVyZSBpcyBubyB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBTZXQgdG8gLTEgdG8gZGlzYWJsZSBhdXRvbWF0aWMgaGlkaW5nLlxuICAgKiBEZWZhdWx0OiAzIHNlY29uZHMgKDMwMDApXG4gICAqL1xuICBoaWRlRGVsYXk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQSBwYW5lbCBjb250YWluaW5nIGEgbGlzdCBvZiB7QGxpbmsgRW1iZWRWaWRlb1BhbmVsSXRlbSBpdGVtc30gdGhhdCByZXByZXNlbnQgbGFiZWxsZWQgZW1iZWRWaWRlby5cbiAqL1xuZXhwb3J0IGNsYXNzIEVtYmVkVmlkZW9QYW5lbCBleHRlbmRzIENvbnRhaW5lcjxFbWJlZFZpZGVvUGFuZWxDb25maWc+IHtcblxuICBwcml2YXRlIGNsb3NlQnV0dG9uOiBDbG9zZUJ1dHRvbjtcbiAgcHJpdmF0ZSB0aXRsZTogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIHNob3dDb21tZW50c0NoZWNrYm94OiBDaGVja2JveDtcbiAgcHJpdmF0ZSBjb2RlRmllbGQ6IExhYmVsPExhYmVsQ29uZmlnPjtcblxuXG4gIHByaXZhdGUgaGlkZVRpbWVvdXQ6IFRpbWVvdXQ7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBFbWJlZFZpZGVvUGFuZWxDb25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy50aXRsZSA9IG5ldyBMYWJlbCh7dGV4dDogJ0VtYmVkIFZpZGVvJywgY3NzQ2xhc3M6ICd1aS1lbWJlZHZpZGVvLXBhbmVsLXRpdGxlJ30pO1xuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBuZXcgQ2xvc2VCdXR0b24oe3RhcmdldDogdGhpc30pO1xuICAgIHRoaXMuc2hvd0NvbW1lbnRzQ2hlY2tib3ggPSBuZXcgQ2hlY2tib3goe3RleHQ6ICdTaG93IGNvbW1lbnRzJ30pO1xuICAgIHRoaXMuY29kZUZpZWxkID0gbmV3IExhYmVsKHtjc3NDbGFzczogJ3VpLWVtYmVkdmlkZW8tcGFuZWwtY29kZWZpZWxkJ30pO1xuXG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWc8RW1iZWRWaWRlb1BhbmVsQ29uZmlnPihjb25maWcsIHtcbiAgICAgICAgY3NzQ2xhc3M6ICd1aS1lbWJlZHZpZGVvLXBhbmVsJyxcbiAgICAgICAgaGlkZURlbGF5OiAzMDAwLFxuICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgICBjc3NDbGFzczogJ3VpLWVtYmVkdmlkZW8tcGFuZWwtaGVhZGVyJyxcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgICAgdGhpcy50aXRsZSxcbiAgICAgICAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbixcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0aGlzLnNob3dDb21tZW50c0NoZWNrYm94LFxuICAgICAgICAgIHRoaXMuY29kZUZpZWxkXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB0aGlzLmNvbmZpZ1xuICAgIClcbiAgICA7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxFbWJlZFZpZGVvUGFuZWxDb25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBmaXggZ2VuZXJpY3MgdHlwZSBpbmZlcmVuY2VcbiAgICBsZXQgdWljb25maWcgPSB1aW1hbmFnZXIuZ2V0Q29uZmlnKCk7XG5cbiAgICBpZiAoY29uZmlnLmhpZGVEZWxheSA+IC0xKSB7XG4gICAgICB0aGlzLmhpZGVUaW1lb3V0ID0gbmV3IFRpbWVvdXQoY29uZmlnLmhpZGVEZWxheSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9uU2hvdy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBBY3RpdmF0ZSB0aW1lb3V0IHdoZW4gc2hvd25cbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5zdGFydCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgICAgICAvLyBSZXNldCB0aW1lb3V0IG9uIGludGVyYWN0aW9uXG4gICAgICAgIHRoaXMuaGlkZVRpbWVvdXQucmVzZXQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAvLyBSZXNldCB0aW1lb3V0IG9uIGludGVyYWN0aW9uXG4gICAgICAgIHRoaXMuaGlkZVRpbWVvdXQucmVzZXQoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5vbkhpZGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgLy8gQ2xlYXIgdGltZW91dCB3aGVuIGhpZGRlbiBmcm9tIG91dHNpZGVcbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5jbGVhcigpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxldCBpbml0ID0gKCkgPT4ge1xuICAgICAgaWYgKHVpY29uZmlnICYmIHVpY29uZmlnLm1ldGFkYXRhICYmIHVpY29uZmlnLm1ldGFkYXRhLmVtYmVkVmlkZW8pIHtcbiAgICAgICAgbGV0IGV2ID0gdWljb25maWcubWV0YWRhdGEuZW1iZWRWaWRlb1xuICAgICAgICBpZiAodGhpcy5zaG93Q29tbWVudHNDaGVja2JveC5pc09uICYmIGV2LndpdGhDb21tZW50cykge1xuICAgICAgICAgIHRoaXMuc2V0RW1iZWRWaWRlbyhldi53aXRoQ29tbWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0RW1iZWRWaWRlbyhldi5kZWZhdWx0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UuZW1iZWRWaWRlbykge1xuICAgICAgICBsZXQgZXYgPSBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLmVtYmVkVmlkZW9cbiAgICAgICAgaWYgKHRoaXMuc2hvd0NvbW1lbnRzQ2hlY2tib3guaXNPbiAmJiBldi53aXRoQ29tbWVudHMpIHtcbiAgICAgICAgICB0aGlzLnNldEVtYmVkVmlkZW8oZXYud2l0aENvbW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEVtYmVkVmlkZW8oZXYuZGVmYXVsdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHVubG9hZCA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0SHRtbENvZGUobnVsbCk7XG4gICAgfTtcblxuICAgIC8vIEluaXQgbGFiZWxcbiAgICBpbml0KCk7XG5cbiAgICAvLyBSZWluaXQgbGFiZWwgd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX0xPQURFRCwgaW5pdCk7XG4gICAgLy8gQ2xlYXIgbGFiZWxzIHdoZW4gc291cmNlIGlzIHVubG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1bmxvYWQpO1xuXG4gICAgLy8gdXBkYXRlIHdoZW4gY2hlY2tib3ggaXMgY2hhbmdlZFxuICAgIHRoaXMuc2hvd0NvbW1lbnRzQ2hlY2tib3gub25DaGFuZ2Uuc3Vic2NyaWJlKGluaXQpO1xuXG4gICAgLy8gdXBkYXRlIHdoZW4gc2hvd25cbiAgICB0aGlzLm9uU2hvdy5zdWJzY3JpYmUoaW5pdCk7XG4gIH1cblxuICByZWxlYXNlKCk6IHZvaWQge1xuICAgIHN1cGVyLnJlbGVhc2UoKTtcbiAgICBpZiAodGhpcy5oaWRlVGltZW91dCkge1xuICAgICAgdGhpcy5oaWRlVGltZW91dC5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIHNldEVtYmVkVmlkZW8oaHRtbENvZGU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChodG1sQ29kZSkge1xuICAgICAgbGV0IGNvZGUgPSB0aGlzLnRvSHRtbEVudGl0aWVzKGh0bWxDb2RlKVxuICAgICAgdGhpcy5zZXRIdG1sQ29kZShjb2RlKVxuICAgICAgdGhpcy5jb3B5VGV4dFRvQ2xpcGJvYXJkKGh0bWxDb2RlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEh0bWxDb2RlKG51bGwpXG4gICAgfVxuICB9XG5cbiAgc2V0SHRtbENvZGUoY29kZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5jb2RlRmllbGQuc2V0VGV4dChjb2RlKVxuICB9XG5cbiAgdG9IdG1sRW50aXRpZXMoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKC8uL2dtLCBmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuICcmIycgKyBzLmNoYXJDb2RlQXQoMCkgKyAnOyc7XG4gICAgfSk7XG4gIH1cblxuICBjb3B5VGV4dFRvQ2xpcGJvYXJkKHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHRleHRBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRBcmVhLnZhbHVlID0gdGV4dFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dEFyZWEpXG4gICAgdGV4dEFyZWEuc2VsZWN0KClcbiAgICB0cnkge1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRleHRBcmVhKVxuICB9XG59XG5cbiIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7RW1iZWRWaWRlb1BhbmVsfSBmcm9tICcuL2VtYmVkdmlkZW9wYW5lbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIEVtYmVkVmlkZW9Ub2dnbGVCdXR0b259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVtYmVkVmlkZW9Ub2dnbGVCdXR0b25Db25maWcgZXh0ZW5kcyBUb2dnbGVCdXR0b25Db25maWcge1xuICAvKipcbiAgICogVGhlIGVtYmVkVmlkZW8gcGFuZWwgd2hvc2UgdmlzaWJpbGl0eSB0aGUgYnV0dG9uIHNob3VsZCB0b2dnbGUuXG4gICAqL1xuICBlbWJlZFZpZGVvUGFuZWw6IEVtYmVkVmlkZW9QYW5lbDtcbn1cblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdmlzaWJpbGl0eSBvZiBhIGVtYmVkVmlkZW8gcGFuZWwuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbWJlZFZpZGVvVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPEVtYmVkVmlkZW9Ub2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEVtYmVkVmlkZW9Ub2dnbGVCdXR0b25Db25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgaWYgKCFjb25maWcuZW1iZWRWaWRlb1BhbmVsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIEVtYmVkVmlkZW9QYW5lbCBpcyBtaXNzaW5nJyk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1lbWJlZHZpZGVvLXRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnRW1iZWQgVmlkZW8nLFxuICAgICAgZW1iZWRWaWRlb1BhbmVsOiBudWxsXG4gICAgfSwgPEVtYmVkVmlkZW9Ub2dnbGVCdXR0b25Db25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8RW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbkNvbmZpZz50aGlzLmdldENvbmZpZygpOyAvLyBUT0RPIGZpeCBnZW5lcmljcyB0eXBlIGluZmVyZW5jZVxuICAgIGxldCBlbWJlZFZpZGVvUGFuZWwgPSBjb25maWcuZW1iZWRWaWRlb1BhbmVsO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnb25DbGljayBoaWRkZW46JywgZW1iZWRWaWRlb1BhbmVsLmlzSGlkZGVuKCkpXG4gICAgICBlbWJlZFZpZGVvUGFuZWwudG9nZ2xlSGlkZGVuKCk7XG4gICAgfSk7XG5cbiAgICBlbWJlZFZpZGVvUGFuZWwub25TaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBTZXQgdG9nZ2xlIHN0YXR1cyB0byBvbiB3aGVuIHRoZSBlbWJlZFZpZGVvIHBhbmVsIHNob3dzXG4gICAgICB0aGlzLm9uKCk7XG4gICAgfSk7XG5cbiAgICBlbWJlZFZpZGVvUGFuZWwub25IaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBTZXQgdG9nZ2xlIHN0YXR1cyB0byBvZmYgd2hlbiB0aGUgZW1iZWRWaWRlbyBwYW5lbCBoaWRlc1xuICAgICAgdGhpcy5vZmYoKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7TGFiZWwsIExhYmVsQ29uZmlnfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgRXJyb3JFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5FcnJvckV2ZW50O1xuaW1wb3J0IHtUdk5vaXNlQ2FudmFzfSBmcm9tICcuL3R2bm9pc2VjYW52YXMnO1xuaW1wb3J0IFBsYXllckV2ZW50ID0gYml0bW92aW4uUGxheWVyQVBJLlBsYXllckV2ZW50O1xuXG5leHBvcnQgaW50ZXJmYWNlIEVycm9yTWVzc2FnZVRyYW5zbGF0b3Ige1xuICAoZXJyb3I6IEVycm9yRXZlbnQpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JNZXNzYWdlTWFwIHtcbiAgW2NvZGU6IG51bWJlcl06IHN0cmluZyB8IEVycm9yTWVzc2FnZVRyYW5zbGF0b3I7XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgRXJyb3JNZXNzYWdlT3ZlcmxheX0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JNZXNzYWdlT3ZlcmxheUNvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8qKlxuICAgKiBBbGxvd3Mgb3ZlcndyaXRpbmcgb2YgdGhlIGVycm9yIG1lc3NhZ2VzIGRpc3BsYXllZCBpbiB0aGUgb3ZlcmxheSBmb3IgY3VzdG9taXphdGlvbiBhbmQgbG9jYWxpemF0aW9uLlxuICAgKiBUaGlzIGlzIGVpdGhlciBhIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYW55IHtAbGluayBFcnJvckV2ZW50fSBhcyBwYXJhbWV0ZXIgYW5kIHRyYW5zbGF0ZXMgZXJyb3IgbWVzc2FnZXMsXG4gICAqIG9yIGEgbWFwIG9mIGVycm9yIGNvZGVzIHRoYXQgb3ZlcndyaXRlcyBzcGVjaWZpYyBlcnJvciBtZXNzYWdlcyB3aXRoIGEgcGxhaW4gc3RyaW5nIG9yIGEgZnVuY3Rpb24gdGhhdFxuICAgKiByZWNlaXZlcyB0aGUge0BsaW5rIEVycm9yRXZlbnR9IGFzIHBhcmFtZXRlciBhbmQgcmV0dXJucyBhIGN1c3RvbWl6ZWQgc3RyaW5nLlxuICAgKiBUaGUgdHJhbnNsYXRpb24gZnVuY3Rpb25zIGNhbiBiZSB1c2VkIHRvIGV4dHJhY3QgZGF0YSAoZS5nLiBwYXJhbWV0ZXJzKSBmcm9tIHRoZSBvcmlnaW5hbCBlcnJvciBtZXNzYWdlLlxuICAgKlxuICAgKiBFeGFtcGxlIDEgKGNhdGNoLWFsbCB0cmFuc2xhdGlvbiBmdW5jdGlvbik6XG4gICAqIDxjb2RlPlxuICAgKiBlcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnID0ge1xuICAgKiAgIG1lc3NhZ2VzOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgc3dpdGNoIChlcnJvci5jb2RlKSB7XG4gICAqICAgICAgIC8vIE92ZXJ3cml0ZSBlcnJvciAzMDAwICdVbmtub3duIGVycm9yJ1xuICAgKiAgICAgICBjYXNlIDMwMDA6XG4gICAqICAgICAgICAgcmV0dXJuICdIb3VzdG9uLCB3ZSBoYXZlIGEgcHJvYmxlbSdcbiAgICpcbiAgICogICAgICAgLy8gVHJhbnNmb3JtIGVycm9yIDMwMDEgJ1Vuc3VwcG9ydGVkIG1hbmlmZXN0IGZvcm1hdCcgdG8gdXBwZXJjYXNlXG4gICAqICAgICAgIGNhc2UgMzAwMTpcbiAgICogICAgICAgICByZXR1cm4gZXJyb3IubWVzc2FnZS50b1VwcGVyQ2FzZSgpO1xuICAgKlxuICAgKiAgICAgICAvLyBDdXN0b21pemUgZXJyb3IgMzAwNiAnQ291bGQgbm90IGxvYWQgbWFuaWZlc3QsIGdvdCBIVFRQIHN0YXR1cyBjb2RlIFhYWCdcbiAgICogICAgICAgY2FzZSAzMDA2OlxuICAgKiAgICAgICAgIHZhciBzdGF0dXNDb2RlID0gZXJyb3IubWVzc2FnZS5zdWJzdHJpbmcoNDYpO1xuICAgKiAgICAgICAgIHJldHVybiAnTWFuaWZlc3QgbG9hZGluZyBmYWlsZWQgd2l0aCBIVFRQIGVycm9yICcgKyBzdGF0dXNDb2RlO1xuICAgKiAgICAgfVxuICAgKiAgICAgLy8gUmV0dXJuIHVubW9kaWZpZWQgZXJyb3IgbWVzc2FnZSBmb3IgYWxsIG90aGVyIGVycm9yc1xuICAgKiAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2U7XG4gICAqICAgfVxuICAgKiB9O1xuICAgKiA8L2NvZGU+XG4gICAqXG4gICAqIEV4YW1wbGUgMiAodHJhbnNsYXRpbmcgc3BlY2lmaWMgZXJyb3JzKTpcbiAgICogPGNvZGU+XG4gICAqIGVycm9yTWVzc2FnZU92ZXJsYXlDb25maWcgPSB7XG4gICAqICAgbWVzc2FnZXM6IHtcbiAgICogICAgIC8vIE92ZXJ3cml0ZSBlcnJvciAzMDAwICdVbmtub3duIGVycm9yJ1xuICAgKiAgICAgMzAwMDogJ0hvdXN0b24sIHdlIGhhdmUgYSBwcm9ibGVtJyxcbiAgICpcbiAgICogICAgIC8vIFRyYW5zZm9ybSBlcnJvciAzMDAxICdVbnN1cHBvcnRlZCBtYW5pZmVzdCBmb3JtYXQnIHRvIHVwcGVyY2FzZVxuICAgKiAgICAgMzAwMTogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2UudG9VcHBlckNhc2UoKTtcbiAgICogICAgIH0sXG4gICAqXG4gICAqICAgICAvLyBDdXN0b21pemUgZXJyb3IgMzAwNiAnQ291bGQgbm90IGxvYWQgbWFuaWZlc3QsIGdvdCBIVFRQIHN0YXR1cyBjb2RlIFhYWCdcbiAgICogICAgIDMwMDY6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICAgIHZhciBzdGF0dXNDb2RlID0gZXJyb3IubWVzc2FnZS5zdWJzdHJpbmcoNDYpO1xuICAgKiAgICAgICByZXR1cm4gJ01hbmlmZXN0IGxvYWRpbmcgZmFpbGVkIHdpdGggSFRUUCBlcnJvciAnICsgc3RhdHVzQ29kZTtcbiAgICogICAgIH1cbiAgICogICB9XG4gICAqIH07XG4gICAqIDwvY29kZT5cbiAgICovXG4gIG1lc3NhZ2VzPzogRXJyb3JNZXNzYWdlTWFwIHwgRXJyb3JNZXNzYWdlVHJhbnNsYXRvcjtcbn1cblxuLyoqXG4gKiBPdmVybGF5cyB0aGUgcGxheWVyIGFuZCBkaXNwbGF5cyBlcnJvciBtZXNzYWdlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEVycm9yTWVzc2FnZU92ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8RXJyb3JNZXNzYWdlT3ZlcmxheUNvbmZpZz4ge1xuXG4gIHByaXZhdGUgZXJyb3JMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIHR2Tm9pc2VCYWNrZ3JvdW5kOiBUdk5vaXNlQ2FudmFzO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogRXJyb3JNZXNzYWdlT3ZlcmxheUNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuZXJyb3JMYWJlbCA9IG5ldyBMYWJlbDxMYWJlbENvbmZpZz4oeyBjc3NDbGFzczogJ3VpLWVycm9ybWVzc2FnZS1sYWJlbCcgfSk7XG4gICAgdGhpcy50dk5vaXNlQmFja2dyb3VuZCA9IG5ldyBUdk5vaXNlQ2FudmFzKCk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWVycm9ybWVzc2FnZS1vdmVybGF5JyxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLnR2Tm9pc2VCYWNrZ3JvdW5kLCB0aGlzLmVycm9yTGFiZWxdLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8RXJyb3JNZXNzYWdlT3ZlcmxheUNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fRVJST1IsIChldmVudDogRXJyb3JFdmVudCkgPT4ge1xuICAgICAgbGV0IG1lc3NhZ2UgPSBldmVudC5tZXNzYWdlO1xuXG4gICAgICAvLyBQcm9jZXNzIG1lc3NhZ2UgdHJhbnNsYXRpb25zXG4gICAgICBpZiAoY29uZmlnLm1lc3NhZ2VzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm1lc3NhZ2VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgLy8gVHJhbnNsYXRpb24gZnVuY3Rpb24gZm9yIGFsbCBlcnJvcnNcbiAgICAgICAgICBtZXNzYWdlID0gY29uZmlnLm1lc3NhZ2VzKGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIGlmIChjb25maWcubWVzc2FnZXNbZXZlbnQuY29kZV0pIHtcbiAgICAgICAgICAvLyBJdCdzIG5vdCBhIHRyYW5zbGF0aW9uIGZ1bmN0aW9uLCBzbyBpdCBtdXN0IGJlIGEgbWFwIG9mIHN0cmluZ3Mgb3IgdHJhbnNsYXRpb24gZnVuY3Rpb25zXG4gICAgICAgICAgbGV0IGN1c3RvbU1lc3NhZ2UgPSBjb25maWcubWVzc2FnZXNbZXZlbnQuY29kZV07XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1c3RvbU1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBtZXNzYWdlID0gY3VzdG9tTWVzc2FnZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhlIG1lc3NhZ2UgaXMgYSB0cmFuc2xhdGlvbiBmdW5jdGlvbiwgc28gd2UgY2FsbCBpdFxuICAgICAgICAgICAgbWVzc2FnZSA9IGN1c3RvbU1lc3NhZ2UoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVycm9yTGFiZWwuc2V0VGV4dChtZXNzYWdlKTtcbiAgICAgIHRoaXMudHZOb2lzZUJhY2tncm91bmQuc3RhcnQoKTtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0pO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX0xPQURFRCwgKGV2ZW50OiBQbGF5ZXJFdmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNTaG93bigpKSB7XG4gICAgICAgIHRoaXMudHZOb2lzZUJhY2tncm91bmQuc3RvcCgpO1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIHRoZSBwbGF5ZXIgYmV0d2VlbiB3aW5kb3dlZCBhbmQgZnVsbHNjcmVlbiB2aWV3LlxuICovXG5leHBvcnQgY2xhc3MgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbiBleHRlbmRzIFRvZ2dsZUJ1dHRvbjxUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktZnVsbHNjcmVlbnRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnRnVsbHNjcmVlbidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGZ1bGxzY3JlZW5TdGF0ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICAgIHRoaXMub24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub2ZmKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRU5URVIsIGZ1bGxzY3JlZW5TdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRVhJVCwgZnVsbHNjcmVlblN0YXRlSGFuZGxlcik7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNGdWxsc2NyZWVuKCkpIHtcbiAgICAgICAgcGxheWVyLmV4aXRGdWxsc2NyZWVuKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIuZW50ZXJGdWxsc2NyZWVuKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBmdWxsc2NyZWVuU3RhdGVIYW5kbGVyKCk7XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtQbGF5YmFja1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9wbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCBvdmVybGF5cyB0aGUgdmlkZW8gYW5kIHRvZ2dsZXMgYmV0d2VlbiBwbGF5YmFjayBhbmQgcGF1c2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24gZXh0ZW5kcyBQbGF5YmFja1RvZ2dsZUJ1dHRvbiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWh1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnUGxheS9QYXVzZSdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICAvLyBVcGRhdGUgYnV0dG9uIHN0YXRlIHRocm91Z2ggQVBJIGV2ZW50c1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlciwgZmFsc2UpO1xuXG4gICAgbGV0IHRvZ2dsZVBsYXliYWNrID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc1BsYXlpbmcoKSkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7YWN0aW9uOiAncGF1c2UnLCBvcmlnaW5hdG9yOiAnSHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9uJ30pXG4gICAgICAgIHBsYXllci5wYXVzZSgndWktb3ZlcmxheScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoe2FjdGlvbjogJ3BsYXknLCBvcmlnaW5hdG9yOiAnSHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9uJ30pXG4gICAgICAgIHBsYXllci5wbGF5KCd1aS1vdmVybGF5Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCB0b2dnbGVGdWxsc2NyZWVuID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0Z1bGxzY3JlZW4oKSkge1xuICAgICAgICBwbGF5ZXIuZXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5lbnRlckZ1bGxzY3JlZW4oKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGZpcnN0UGxheSA9IHRydWU7XG4gICAgbGV0IGNsaWNrVGltZSA9IDA7XG4gICAgbGV0IGRvdWJsZUNsaWNrVGltZSA9IDA7XG5cbiAgICAvKlxuICAgICAqIFlvdVR1YmUtc3R5bGUgdG9nZ2xlIGJ1dHRvbiBoYW5kbGluZ1xuICAgICAqXG4gICAgICogVGhlIGdvYWwgaXMgdG8gcHJldmVudCBhIHNob3J0IHBhdXNlIG9yIHBsYXliYWNrIGludGVydmFsIGJldHdlZW4gYSBjbGljaywgdGhhdCB0b2dnbGVzIHBsYXliYWNrLCBhbmQgYVxuICAgICAqIGRvdWJsZSBjbGljaywgdGhhdCB0b2dnbGVzIGZ1bGxzY3JlZW4uIEluIHRoaXMgbmFpdmUgYXBwcm9hY2gsIHRoZSBmaXJzdCBjbGljayB3b3VsZCBlLmcuIHN0YXJ0IHBsYXliYWNrLFxuICAgICAqIHRoZSBzZWNvbmQgY2xpY2sgd291bGQgYmUgZGV0ZWN0ZWQgYXMgZG91YmxlIGNsaWNrIGFuZCB0b2dnbGUgdG8gZnVsbHNjcmVlbiwgYW5kIGFzIHNlY29uZCBub3JtYWwgY2xpY2sgc3RvcFxuICAgICAqIHBsYXliYWNrLCB3aGljaCByZXN1bHRzIGlzIGEgc2hvcnQgcGxheWJhY2sgaW50ZXJ2YWwgd2l0aCBtYXggbGVuZ3RoIG9mIHRoZSBkb3VibGUgY2xpY2sgZGV0ZWN0aW9uXG4gICAgICogcGVyaW9kICh1c3VhbGx5IDUwMG1zKS5cbiAgICAgKlxuICAgICAqIFRvIHNvbHZlIHRoaXMgaXNzdWUsIHdlIGRlZmVyIGhhbmRsaW5nIG9mIHRoZSBmaXJzdCBjbGljayBmb3IgMjAwbXMsIHdoaWNoIGlzIGFsbW9zdCB1bm5vdGljZWFibGUgdG8gdGhlIHVzZXIsXG4gICAgICogYW5kIGp1c3QgdG9nZ2xlIHBsYXliYWNrIGlmIG5vIHNlY29uZCBjbGljayAoZG91YmxlIGNsaWNrKSBoYXMgYmVlbiByZWdpc3RlcmVkIGR1cmluZyB0aGlzIHBlcmlvZC4gSWYgYSBkb3VibGVcbiAgICAgKiBjbGljayBpcyByZWdpc3RlcmVkLCB3ZSBqdXN0IHRvZ2dsZSB0aGUgZnVsbHNjcmVlbi4gSW4gdGhlIGZpcnN0IDIwMG1zLCB1bmRlc2lyZWQgcGxheWJhY2sgY2hhbmdlcyB0aHVzIGNhbm5vdFxuICAgICAqIGhhcHBlbi4gSWYgYSBkb3VibGUgY2xpY2sgaXMgcmVnaXN0ZXJlZCB3aXRoaW4gNTAwbXMsIHdlIHVuZG8gdGhlIHBsYXliYWNrIGNoYW5nZSBhbmQgc3dpdGNoIGZ1bGxzY3JlZW4gbW9kZS5cbiAgICAgKiBJbiB0aGUgZW5kLCB0aGlzIG1ldGhvZCBiYXNpY2FsbHkgaW50cm9kdWNlcyBhIDIwMG1zIG9ic2VydmluZyBpbnRlcnZhbCBpbiB3aGljaCBwbGF5YmFjayBjaGFuZ2VzIGFyZSBwcmV2ZW50ZWRcbiAgICAgKiBpZiBhIGRvdWJsZSBjbGljayBoYXBwZW5zLlxuICAgICAqL1xuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gRGlyZWN0bHkgc3RhcnQgcGxheWJhY2sgb24gZmlyc3QgY2xpY2sgb2YgdGhlIGJ1dHRvbi5cbiAgICAgIC8vIFRoaXMgaXMgYSByZXF1aXJlZCB3b3JrYXJvdW5kIGZvciBtb2JpbGUgYnJvd3NlcnMgd2hlcmUgdmlkZW8gcGxheWJhY2sgbmVlZHMgdG8gYmUgdHJpZ2dlcmVkIGRpcmVjdGx5XG4gICAgICAvLyBieSB0aGUgdXNlci4gQSBkZWZlcnJlZCBwbGF5YmFjayBzdGFydCB0aHJvdWdoIHRoZSB0aW1lb3V0IGJlbG93IGlzIG5vdCBjb25zaWRlcmVkIGFzIHVzZXIgYWN0aW9uIGFuZFxuICAgICAgLy8gdGhlcmVmb3JlIGlnbm9yZWQgYnkgbW9iaWxlIGJyb3dzZXJzLlxuICAgICAgaWYgKGZpcnN0UGxheSkge1xuICAgICAgICAvLyBUcnkgdG8gc3RhcnQgcGxheWJhY2suIFRoZW4gd2Ugd2FpdCBmb3IgT05fUExBWSBhbmQgb25seSB3aGVuIGl0IGFycml2ZXMsIHdlIGRpc2FibGUgdGhlIGZpcnN0UGxheSBmbGFnLlxuICAgICAgICAvLyBJZiB3ZSBkaXNhYmxlIHRoZSBmbGFnIGhlcmUsIG9uQ2xpY2sgd2FzIHRyaWdnZXJlZCBwcm9ncmFtbWF0aWNhbGx5IGluc3RlYWQgb2YgYnkgYSB1c2VyIGludGVyYWN0aW9uLCBhbmRcbiAgICAgICAgLy8gcGxheWJhY2sgaXMgYmxvY2tlZCAoZS5nLiBvbiBtb2JpbGUgZGV2aWNlcyBkdWUgdG8gdGhlIHByb2dyYW1tYXRpYyBwbGF5KCkgY2FsbCksIHdlIGxvb3NlIHRoZSBjaGFuY2UgdG9cbiAgICAgICAgLy8gZXZlciBzdGFydCBwbGF5YmFjayB0aHJvdWdoIGEgdXNlciBpbnRlcmFjdGlvbiBhZ2FpbiB3aXRoIHRoaXMgYnV0dG9uLlxuICAgICAgICB0b2dnbGVQbGF5YmFjaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgICBpZiAobm93IC0gY2xpY2tUaW1lIDwgMjAwKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgYSBkb3VibGUgY2xpY2sgaW5zaWRlIHRoZSAyMDBtcyBpbnRlcnZhbCwganVzdCB0b2dnbGUgZnVsbHNjcmVlbiBtb2RlXG4gICAgICAgIHRvZ2dsZUZ1bGxzY3JlZW4oKTtcbiAgICAgICAgZG91YmxlQ2xpY2tUaW1lID0gbm93O1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKG5vdyAtIGNsaWNrVGltZSA8IDUwMCkge1xuICAgICAgICAvLyBXZSBoYXZlIGEgZG91YmxlIGNsaWNrIGluc2lkZSB0aGUgNTAwbXMgaW50ZXJ2YWwsIHVuZG8gcGxheWJhY2sgdG9nZ2xlIGFuZCB0b2dnbGUgZnVsbHNjcmVlbiBtb2RlXG4gICAgICAgIHRvZ2dsZUZ1bGxzY3JlZW4oKTtcbiAgICAgICAgdG9nZ2xlUGxheWJhY2soKTtcbiAgICAgICAgZG91YmxlQ2xpY2tUaW1lID0gbm93O1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNsaWNrVGltZSA9IG5vdztcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gZG91YmxlQ2xpY2tUaW1lID4gMjAwKSB7XG4gICAgICAgICAgLy8gTm8gZG91YmxlIGNsaWNrIGRldGVjdGVkLCBzbyB3ZSB0b2dnbGUgcGxheWJhY2sgYW5kIHdhaXQgd2hhdCBoYXBwZW5zIG5leHRcbiAgICAgICAgICB0b2dnbGVQbGF5YmFjaygpO1xuICAgICAgICB9XG4gICAgICB9LCAyMDApO1xuICAgIH0pO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgKCkgPT4ge1xuICAgICAgLy8gUGxheWJhY2sgaGFzIHJlYWxseSBzdGFydGVkLCB3ZSBjYW4gZGlzYWJsZSB0aGUgZmxhZyB0byBzd2l0Y2ggdG8gbm9ybWFsIHRvZ2dsZSBidXR0b24gaGFuZGxpbmdcbiAgICAgIGZpcnN0UGxheSA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gSGlkZSBidXR0b24gd2hpbGUgaW5pdGlhbGl6aW5nIGEgQ2FzdCBzZXNzaW9uXG4gICAgbGV0IGNhc3RJbml0aWFsaXphdGlvbkhhbmRsZXIgPSAoZXZlbnQ6IFBsYXllckV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gcGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlQpIHtcbiAgICAgICAgLy8gSGlkZSBidXR0b24gd2hlbiBzZXNzaW9uIGlzIGJlaW5nIGluaXRpYWxpemVkXG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU2hvdyBidXR0b24gd2hlbiBzZXNzaW9uIGlzIGVzdGFibGlzaGVkIG9yIGluaXRpYWxpemF0aW9uIHdhcyBhYm9ydGVkXG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfVxuICAgIH07XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVCwgY2FzdEluaXRpYWxpemF0aW9uSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVEVELCBjYXN0SW5pdGlhbGl6YXRpb25IYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUT1BQRUQsIGNhc3RJbml0aWFsaXphdGlvbkhhbmRsZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGxldCBidXR0b25FbGVtZW50ID0gc3VwZXIudG9Eb21FbGVtZW50KCk7XG5cbiAgICAvLyBBZGQgY2hpbGQgdGhhdCBjb250YWlucyB0aGUgcGxheSBidXR0b24gaW1hZ2VcbiAgICAvLyBTZXR0aW5nIHRoZSBpbWFnZSBkaXJlY3RseSBvbiB0aGUgYnV0dG9uIGRvZXMgbm90IHdvcmsgdG9nZXRoZXIgd2l0aCBzY2FsaW5nIGFuaW1hdGlvbnMsIGJlY2F1c2UgdGhlIGJ1dHRvblxuICAgIC8vIGNhbiBjb3ZlciB0aGUgd2hvbGUgdmlkZW8gcGxheWVyIGFyZSBhbmQgc2NhbGluZyB3b3VsZCBleHRlbmQgaXQgYmV5b25kLiBCeSBhZGRpbmcgYW4gaW5uZXIgZWxlbWVudCwgY29uZmluZWRcbiAgICAvLyB0byB0aGUgc2l6ZSBpZiB0aGUgaW1hZ2UsIGl0IGNhbiBzY2FsZSBpbnNpZGUgdGhlIHBsYXllciB3aXRob3V0IG92ZXJzaG9vdGluZy5cbiAgICBidXR0b25FbGVtZW50LmFwcGVuZChuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnaW1hZ2UnKVxuICAgIH0pKTtcblxuICAgIHJldHVybiBidXR0b25FbGVtZW50O1xuICB9XG59IiwiaW1wb3J0IHtCdXR0b25Db25maWcsIEJ1dHRvbn0gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IFBsYXllckV2ZW50ID0gYml0bW92aW4uUGxheWVyQVBJLlBsYXllckV2ZW50O1xuXG4vKipcbiAqIEEgYnV0dG9uIHRvIHBsYXkvcmVwbGF5IGEgdmlkZW8uXG4gKi9cbmV4cG9ydCBjbGFzcyBIdWdlUmVwbGF5QnV0dG9uIGV4dGVuZHMgQnV0dG9uPEJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1odWdlcmVwbGF5YnV0dG9uJyxcbiAgICAgIHRleHQ6ICdSZXBsYXknXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgcGxheWVyLnBsYXkoJ3VpLW92ZXJsYXknKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBsZXQgYnV0dG9uRWxlbWVudCA9IHN1cGVyLnRvRG9tRWxlbWVudCgpO1xuXG4gICAgLy8gQWRkIGNoaWxkIHRoYXQgY29udGFpbnMgdGhlIHBsYXkgYnV0dG9uIGltYWdlXG4gICAgLy8gU2V0dGluZyB0aGUgaW1hZ2UgZGlyZWN0bHkgb24gdGhlIGJ1dHRvbiBkb2VzIG5vdCB3b3JrIHRvZ2V0aGVyIHdpdGggc2NhbGluZyBhbmltYXRpb25zLCBiZWNhdXNlIHRoZSBidXR0b25cbiAgICAvLyBjYW4gY292ZXIgdGhlIHdob2xlIHZpZGVvIHBsYXllciBhcmUgYW5kIHNjYWxpbmcgd291bGQgZXh0ZW5kIGl0IGJleW9uZC4gQnkgYWRkaW5nIGFuIGlubmVyIGVsZW1lbnQsIGNvbmZpbmVkXG4gICAgLy8gdG8gdGhlIHNpemUgaWYgdGhlIGltYWdlLCBpdCBjYW4gc2NhbGUgaW5zaWRlIHRoZSBwbGF5ZXIgd2l0aG91dCBvdmVyc2hvb3RpbmcuXG4gICAgYnV0dG9uRWxlbWVudC5hcHBlbmQobmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2ltYWdlJylcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gYnV0dG9uRWxlbWVudDtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50Q29uZmlnLCBDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtFdmVudERpc3BhdGNoZXIsIEV2ZW50LCBOb0FyZ3N9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIExhYmVsfSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGFiZWxDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICAvKipcbiAgICogVGhlIHRleHQgb24gdGhlIGxhYmVsLlxuICAgKi9cbiAgdGV4dD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSB0ZXh0IGxhYmVsLlxuICpcbiAqIERPTSBleGFtcGxlOlxuICogPGNvZGU+XG4gKiAgICAgPHNwYW4gY2xhc3M9J3VpLWxhYmVsJz4uLi5zb21lIHRleHQuLi48L3NwYW4+XG4gKiA8L2NvZGU+XG4gKi9cbmV4cG9ydCBjbGFzcyBMYWJlbDxDb25maWcgZXh0ZW5kcyBMYWJlbENvbmZpZz4gZXh0ZW5kcyBDb21wb25lbnQ8TGFiZWxDb25maWc+IHtcblxuICBwcml2YXRlIHRleHQ6IHN0cmluZztcblxuICBwcml2YXRlIGxhYmVsRXZlbnRzID0ge1xuICAgIG9uQ2xpY2s6IG5ldyBFdmVudERpc3BhdGNoZXI8TGFiZWw8Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uVGV4dENoYW5nZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8TGFiZWw8Q29uZmlnPiwgc3RyaW5nPigpLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWxhYmVsJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcblxuICAgIHRoaXMudGV4dCA9IHRoaXMuY29uZmlnLnRleHQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGxhYmVsRWxlbWVudCA9IG5ldyBET00oJ3NwYW4nLCB7XG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSkuaHRtbCh0aGlzLnRleHQpO1xuXG4gICAgbGFiZWxFbGVtZW50Lm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMub25DbGlja0V2ZW50KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGFiZWxFbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdGV4dCBvbiB0aGlzIGxhYmVsLlxuICAgKiBAcGFyYW0gdGV4dFxuICAgKi9cbiAgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmh0bWwodGV4dCk7XG4gICAgdGhpcy5vblRleHRDaGFuZ2VkRXZlbnQodGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdGV4dCBvbiB0aGlzIGxhYmVsLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSB0ZXh0IG9uIHRoZSBsYWJlbFxuICAgKi9cbiAgZ2V0VGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSB0ZXh0IG9uIHRoaXMgbGFiZWwuXG4gICAqL1xuICBjbGVhclRleHQoKSB7XG4gICAgdGhpcy5nZXREb21FbGVtZW50KCkuaHRtbCgnJyk7XG4gICAgdGhpcy5vblRleHRDaGFuZ2VkRXZlbnQobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgdGhlIGxhYmVsIGlzIGVtcHR5IGFuZCBkb2VzIG5vdCBjb250YWluIGFueSB0ZXh0LlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBsYWJlbCBpcyBlbXB0eSwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMudGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB0aGUge0BsaW5rICNvbkNsaWNrfSBldmVudC5cbiAgICogQ2FuIGJlIHVzZWQgYnkgc3ViY2xhc3NlcyB0byBsaXN0ZW4gdG8gdGhpcyBldmVudCB3aXRob3V0IHN1YnNjcmliaW5nIGFuIGV2ZW50IGxpc3RlbmVyIGJ5IG92ZXJ3cml0aW5nIHRoZSBtZXRob2RcbiAgICogYW5kIGNhbGxpbmcgdGhlIHN1cGVyIG1ldGhvZC5cbiAgICovXG4gIHByb3RlY3RlZCBvbkNsaWNrRXZlbnQoKSB7XG4gICAgdGhpcy5sYWJlbEV2ZW50cy5vbkNsaWNrLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSB7QGxpbmsgI29uQ2xpY2t9IGV2ZW50LlxuICAgKiBDYW4gYmUgdXNlZCBieSBzdWJjbGFzc2VzIHRvIGxpc3RlbiB0byB0aGlzIGV2ZW50IHdpdGhvdXQgc3Vic2NyaWJpbmcgYW4gZXZlbnQgbGlzdGVuZXIgYnkgb3ZlcndyaXRpbmcgdGhlIG1ldGhvZFxuICAgKiBhbmQgY2FsbGluZyB0aGUgc3VwZXIgbWV0aG9kLlxuICAgKi9cbiAgcHJvdGVjdGVkIG9uVGV4dENoYW5nZWRFdmVudCh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxhYmVsRXZlbnRzLm9uVGV4dENoYW5nZWQuZGlzcGF0Y2godGhpcywgdGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBsYWJlbCBpcyBjbGlja2VkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGFiZWw8TGFiZWxDb25maWc+LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uQ2xpY2soKTogRXZlbnQ8TGFiZWw8TGFiZWxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbEV2ZW50cy5vbkNsaWNrLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSB0ZXh0IG9uIHRoZSBsYWJlbCBpcyBjaGFuZ2VkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGFiZWw8TGFiZWxDb25maWc+LCBzdHJpbmc+fVxuICAgKi9cbiAgZ2V0IG9uVGV4dENoYW5nZWQoKTogRXZlbnQ8TGFiZWw8TGFiZWxDb25maWc+LCBzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbEV2ZW50cy5vblRleHRDaGFuZ2VkLmdldEV2ZW50KCk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgRXZlbnR9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5pbXBvcnQge0FycmF5VXRpbHN9IGZyb20gJy4uL3V0aWxzJztcblxuLyoqXG4gKiBBIG1hcCBvZiBpdGVtcyAoa2V5L3ZhbHVlIC0+IGxhYmVsfSBmb3IgYSB7QGxpbmsgTGlzdFNlbGVjdG9yfSBpbiBhIHtAbGluayBMaXN0U2VsZWN0b3JDb25maWd9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExpc3RJdGVtIHtcbiAga2V5OiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIExpc3RTZWxlY3Rvcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdFNlbGVjdG9yQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgaXRlbXM/OiBMaXN0SXRlbVtdO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGlzdFNlbGVjdG9yPENvbmZpZyBleHRlbmRzIExpc3RTZWxlY3RvckNvbmZpZz4gZXh0ZW5kcyBDb21wb25lbnQ8TGlzdFNlbGVjdG9yQ29uZmlnPiB7XG5cbiAgcHJvdGVjdGVkIGl0ZW1zOiBMaXN0SXRlbVtdO1xuICBwcm90ZWN0ZWQgc2VsZWN0ZWRJdGVtOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBsaXN0U2VsZWN0b3JFdmVudHMgPSB7XG4gICAgb25JdGVtQWRkZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4oKSxcbiAgICBvbkl0ZW1SZW1vdmVkOiBuZXcgRXZlbnREaXNwYXRjaGVyPExpc3RTZWxlY3RvcjxDb25maWc+LCBzdHJpbmc+KCksXG4gICAgb25JdGVtU2VsZWN0ZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgaXRlbXM6IFtdLFxuICAgICAgY3NzQ2xhc3M6ICd1aS1saXN0c2VsZWN0b3InXG4gICAgfSwgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuY29uZmlnLml0ZW1zO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRJdGVtSW5kZXgoa2V5OiBzdHJpbmcpOiBudW1iZXIge1xuICAgIGZvciAobGV0IGluZGV4IGluIHRoaXMuaXRlbXMpIHtcbiAgICAgIGlmIChrZXkgPT09IHRoaXMuaXRlbXNbaW5kZXhdLmtleSkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoaW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgaXRlbSBpcyBwYXJ0IG9mIHRoaXMgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSBrZXkgdGhlIGtleSBvZiB0aGUgaXRlbSB0byBjaGVja1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgaXRlbSBpcyBwYXJ0IG9mIHRoaXMgc2VsZWN0b3IsIGVsc2UgZmFsc2VcbiAgICovXG4gIGhhc0l0ZW0oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtSW5kZXgoa2V5KSA+IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaXRlbSB0byB0aGlzIHNlbGVjdG9yIGJ5IGFwcGVuZGluZyBpdCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIGl0ZW1zLiBJZiBhbiBpdGVtIHdpdGggdGhlIHNwZWNpZmllZFxuICAgKiBrZXkgYWxyZWFkeSBleGlzdHMsIGl0IGlzIHJlcGxhY2VkLlxuICAgKiBAcGFyYW0ga2V5IHRoZSBrZXkgb2YgdGhlIGl0ZW0gdG8gYWRkXG4gICAqIEBwYXJhbSBsYWJlbCB0aGUgKGh1bWFuLXJlYWRhYmxlKSBsYWJlbCBvZiB0aGUgaXRlbSB0byBhZGRcbiAgICovXG4gIGFkZEl0ZW0oa2V5OiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLnJlbW92ZUl0ZW0oa2V5KTsgLy8gVHJ5IHRvIHJlbW92ZSBrZXkgZmlyc3QgdG8gZ2V0IG92ZXJ3cml0ZSBiZWhhdmlvciBhbmQgYXZvaWQgZHVwbGljYXRlIGtleXNcbiAgICB0aGlzLml0ZW1zLnB1c2goeyBrZXk6IGtleSwgbGFiZWw6IGxhYmVsIH0pO1xuICAgIHRoaXMub25JdGVtQWRkZWRFdmVudChrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoaXMgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSBrZXkgdGhlIGtleSBvZiB0aGUgaXRlbSB0byByZW1vdmVcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgcmVtb3ZhbCB3YXMgc3VjY2Vzc2Z1bCwgZmFsc2UgaWYgdGhlIGl0ZW0gaXMgbm90IHBhcnQgb2YgdGhpcyBzZWxlY3RvclxuICAgKi9cbiAgcmVtb3ZlSXRlbShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGtleSk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIEFycmF5VXRpbHMucmVtb3ZlKHRoaXMuaXRlbXMsIHRoaXMuaXRlbXNbaW5kZXhdKTtcbiAgICAgIHRoaXMub25JdGVtUmVtb3ZlZEV2ZW50KGtleSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBhbiBpdGVtIGZyb20gdGhlIGl0ZW1zIGluIHRoaXMgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSBrZXkgdGhlIGtleSBvZiB0aGUgaXRlbSB0byBzZWxlY3RcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaXMgdGhlIHNlbGVjdGlvbiB3YXMgc3VjY2Vzc2Z1bCwgZmFsc2UgaWYgdGhlIHNlbGVjdGVkIGl0ZW0gaXMgbm90IHBhcnQgb2YgdGhlIHNlbGVjdG9yXG4gICAqL1xuICBzZWxlY3RJdGVtKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKGtleSA9PT0gdGhpcy5zZWxlY3RlZEl0ZW0pIHtcbiAgICAgIC8vIGl0ZW1Db25maWcgaXMgYWxyZWFkeSBzZWxlY3RlZCwgc3VwcHJlc3MgYW55IGZ1cnRoZXIgYWN0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChrZXkpO1xuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0ga2V5O1xuICAgICAgdGhpcy5vbkl0ZW1TZWxlY3RlZEV2ZW50KGtleSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUga2V5IG9mIHRoZSBzZWxlY3RlZCBpdGVtLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUga2V5IG9mIHRoZSBzZWxlY3RlZCBpdGVtIG9yIG51bGwgaWYgbm8gaXRlbSBpcyBzZWxlY3RlZFxuICAgKi9cbiAgZ2V0U2VsZWN0ZWRJdGVtKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCBpdGVtcyBmcm9tIHRoaXMgc2VsZWN0b3IuXG4gICAqL1xuICBjbGVhckl0ZW1zKCkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXM7IC8vIGxvY2FsIGNvcHkgZm9yIGl0ZXJhdGlvbiBhZnRlciBjbGVhclxuICAgIHRoaXMuaXRlbXMgPSBbXTsgLy8gY2xlYXIgaXRlbXNcblxuICAgIC8vIGZpcmUgZXZlbnRzXG4gICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xuICAgICAgdGhpcy5vbkl0ZW1SZW1vdmVkRXZlbnQoaXRlbS5rZXkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgaXRlbXMgaW4gdGhpcyBzZWxlY3Rvci5cbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIGl0ZW1Db3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLml0ZW1zKS5sZW5ndGg7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtQWRkZWRFdmVudChrZXk6IHN0cmluZykge1xuICAgIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbUFkZGVkLmRpc3BhdGNoKHRoaXMsIGtleSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtUmVtb3ZlZEV2ZW50KGtleTogc3RyaW5nKSB7XG4gICAgdGhpcy5saXN0U2VsZWN0b3JFdmVudHMub25JdGVtUmVtb3ZlZC5kaXNwYXRjaCh0aGlzLCBrZXkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uSXRlbVNlbGVjdGVkRXZlbnQoa2V5OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1TZWxlY3RlZC5kaXNwYXRjaCh0aGlzLCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiBhbiBpdGVtIGlzIGFkZGVkIHRvIHRoZSBsaXN0IG9mIGl0ZW1zLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25JdGVtQWRkZWQoKTogRXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1BZGRlZC5nZXRFdmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiBhbiBpdGVtIGlzIHJlbW92ZWQgZnJvbSB0aGUgbGlzdCBvZiBpdGVtcy5cbiAgICogQHJldHVybnMge0V2ZW50PExpc3RTZWxlY3RvcjxDb25maWc+LCBzdHJpbmc+fVxuICAgKi9cbiAgZ2V0IG9uSXRlbVJlbW92ZWQoKTogRXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1SZW1vdmVkLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGFuIGl0ZW0gaXMgc2VsZWN0ZWQgZnJvbSB0aGUgbGlzdCBvZiBpdGVtcy5cbiAgICogQHJldHVybnMge0V2ZW50PExpc3RTZWxlY3RvcjxDb25maWc+LCBzdHJpbmc+fVxuICAgKi9cbiAgZ2V0IG9uSXRlbVNlbGVjdGVkKCk6IEV2ZW50PExpc3RTZWxlY3RvcjxDb25maWc+LCBzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5saXN0U2VsZWN0b3JFdmVudHMub25JdGVtU2VsZWN0ZWQuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7TGFiZWxDb25maWcsIExhYmVsfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogRW51bWVyYXRlcyB0aGUgdHlwZXMgb2YgY29udGVudCB0aGF0IHRoZSB7QGxpbmsgTWV0YWRhdGFMYWJlbH0gY2FuIGRpc3BsYXkuXG4gKi9cbmV4cG9ydCBlbnVtIE1ldGFkYXRhTGFiZWxDb250ZW50IHtcbiAgLyoqXG4gICAqIFRpdGxlIG9mIHRoZSBkYXRhIHNvdXJjZS5cbiAgICovXG4gIFRpdGxlLFxuICAvKipcbiAgICogRGVzY3JpcHRpb24gZm8gdGhlIGRhdGEgc291cmNlLlxuICAgKi9cbiAgRGVzY3JpcHRpb24sXG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHtAbGluayBNZXRhZGF0YUxhYmVsfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRhZGF0YUxhYmVsQ29uZmlnIGV4dGVuZHMgTGFiZWxDb25maWcge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgY29udGVudCB0aGF0IHNob3VsZCBiZSBkaXNwbGF5ZWQgaW4gdGhlIGxhYmVsLlxuICAgKi9cbiAgY29udGVudDogTWV0YWRhdGFMYWJlbENvbnRlbnQ7XG59XG5cbi8qKlxuICogQSBsYWJlbCB0aGF0IGNhbiBiZSBjb25maWd1cmVkIHRvIGRpc3BsYXkgY2VydGFpbiBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1ldGFkYXRhTGFiZWwgZXh0ZW5kcyBMYWJlbDxNZXRhZGF0YUxhYmVsQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBNZXRhZGF0YUxhYmVsQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzZXM6IFsnbGFiZWwtbWV0YWRhdGEnLCAnbGFiZWwtbWV0YWRhdGEtJyArIE1ldGFkYXRhTGFiZWxDb250ZW50W2NvbmZpZy5jb250ZW50XS50b0xvd2VyQ2FzZSgpXVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPE1ldGFkYXRhTGFiZWxDb25maWc+dGhpcy5nZXRDb25maWcoKTtcbiAgICBsZXQgdWljb25maWcgPSB1aW1hbmFnZXIuZ2V0Q29uZmlnKCk7XG5cbiAgICBsZXQgaW5pdCA9ICgpID0+IHtcbiAgICAgIHN3aXRjaCAoY29uZmlnLmNvbnRlbnQpIHtcbiAgICAgICAgY2FzZSBNZXRhZGF0YUxhYmVsQ29udGVudC5UaXRsZTpcbiAgICAgICAgICBpZiAodWljb25maWcgJiYgdWljb25maWcubWV0YWRhdGEgJiYgdWljb25maWcubWV0YWRhdGEudGl0bGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dCh1aWNvbmZpZy5tZXRhZGF0YS50aXRsZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UudGl0bGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLnRpdGxlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgTWV0YWRhdGFMYWJlbENvbnRlbnQuRGVzY3JpcHRpb246XG4gICAgICAgICAgaWYgKHVpY29uZmlnICYmIHVpY29uZmlnLm1ldGFkYXRhICYmIHVpY29uZmlnLm1ldGFkYXRhLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRleHQodWljb25maWcubWV0YWRhdGEuZGVzY3JpcHRpb24pO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdldENvbmZpZygpLnNvdXJjZSAmJiBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRleHQocGxheWVyLmdldENvbmZpZygpLnNvdXJjZS5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdW5sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRUZXh0KG51bGwpO1xuICAgIH07XG5cbiAgICAvLyBJbml0IGxhYmVsXG4gICAgaW5pdCgpO1xuICAgIC8vIFJlaW5pdCBsYWJlbCB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfTE9BREVELCBpbml0KTtcbiAgICAvLyBDbGVhciBsYWJlbHMgd2hlbiBzb3VyY2UgaXMgdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHVubG9hZCk7XG4gIH1cbn0iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyBBcHBsZSBtYWNPUyBwaWN0dXJlLWluLXBpY3R1cmUgbW9kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBpY3R1cmVJblBpY3R1cmVUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXBpcHRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnUGljdHVyZS1pbi1QaWN0dXJlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBpZiAoIXBsYXllci5pc1BpY3R1cmVJblBpY3R1cmVBdmFpbGFibGUpIHtcbiAgICAgIC8vIElmIHRoZSBwbGF5ZXIgZG9lcyBub3Qgc3VwcG9ydCBQSVAgKHBsYXllciA3LjApLCB3ZSBqdXN0IGhpZGUgdGhpcyBjb21wb25lbnQgYW5kIHNraXAgY29uZmlndXJhdGlvblxuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzUGljdHVyZUluUGljdHVyZUF2YWlsYWJsZSgpKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuaXNQaWN0dXJlSW5QaWN0dXJlKCkpIHtcbiAgICAgICAgICBwbGF5ZXIuZXhpdFBpY3R1cmVJblBpY3R1cmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5ZXIuZW50ZXJQaWN0dXJlSW5QaWN0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1BJUCB1bmF2YWlsYWJsZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcGlwQXZhaWxhYmxlSGFuZGVyID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc1BpY3R1cmVJblBpY3R1cmVBdmFpbGFibGUoKSkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgcGlwQXZhaWxhYmxlSGFuZGVyKTtcblxuICAgIC8vIFRvZ2dsZSBidXR0b24gJ29uJyBzdGF0ZVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BJQ1RVUkVfSU5fUElDVFVSRV9FTlRFUiwgKCkgPT4ge1xuICAgICAgdGhpcy5vbigpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BJQ1RVUkVfSU5fUElDVFVSRV9FWElULCAoKSA9PiB7XG4gICAgICB0aGlzLm9mZigpO1xuICAgIH0pO1xuXG4gICAgLy8gU3RhcnR1cCBpbml0XG4gICAgcGlwQXZhaWxhYmxlSGFuZGVyKCk7IC8vIEhpZGUgYnV0dG9uIGlmIFBJUCBub3QgYXZhaWxhYmxlXG4gICAgaWYgKHBsYXllci5pc1BpY3R1cmVJblBpY3R1cmUoKSkge1xuICAgICAgdGhpcy5vbigpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7U2VsZWN0Qm94fSBmcm9tICcuL3NlbGVjdGJveCc7XG5pbXBvcnQge0xpc3RTZWxlY3RvckNvbmZpZ30gZnJvbSAnLi9saXN0c2VsZWN0b3InO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIHNlbGVjdCBib3ggcHJvdmlkaW5nIGEgc2VsZWN0aW9uIG9mIGRpZmZlcmVudCBwbGF5YmFjayBzcGVlZHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQbGF5YmFja1NwZWVkU2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICB0aGlzLmFkZEl0ZW0oJzAuMjUnLCAnMC4yNXgnKTtcbiAgICB0aGlzLmFkZEl0ZW0oJzAuNScsICcwLjV4Jyk7XG4gICAgdGhpcy5hZGRJdGVtKCcxJywgJ05vcm1hbCcpO1xuICAgIHRoaXMuYWRkSXRlbSgnMS41JywgJzEuNXgnKTtcbiAgICB0aGlzLmFkZEl0ZW0oJzInLCAnMngnKTtcblxuICAgIHRoaXMuc2VsZWN0SXRlbSgnMScpO1xuXG5cbiAgICB0aGlzLm9uSXRlbVNlbGVjdGVkLnN1YnNjcmliZSgoc2VuZGVyOiBQbGF5YmFja1NwZWVkU2VsZWN0Qm94LCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0UGxheWJhY2tTcGVlZChwYXJzZUZsb2F0KHZhbHVlKSk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge0xhYmVsQ29uZmlnLCBMYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtTdHJpbmdVdGlscywgUGxheWVyVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MgPSBQbGF5ZXJVdGlscy5MaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3M7XG5cbmV4cG9ydCBlbnVtIFBsYXliYWNrVGltZUxhYmVsTW9kZSB7XG4gIEN1cnJlbnRUaW1lLFxuICBUb3RhbFRpbWUsXG4gIEN1cnJlbnRBbmRUb3RhbFRpbWUsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGxheWJhY2tUaW1lTGFiZWxDb25maWcgZXh0ZW5kcyBMYWJlbENvbmZpZyB7XG4gIHRpbWVMYWJlbE1vZGU/OiBQbGF5YmFja1RpbWVMYWJlbE1vZGU7XG4gIGhpZGVJbkxpdmVQbGF5YmFjaz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBsYWJlbCB0aGF0IGRpc3BsYXkgdGhlIGN1cnJlbnQgcGxheWJhY2sgdGltZSBhbmQgdGhlIHRvdGFsIHRpbWUgdGhyb3VnaCB7QGxpbmsgUGxheWJhY2tUaW1lTGFiZWwjc2V0VGltZSBzZXRUaW1lfVxuICogb3IgYW55IHN0cmluZyB0aHJvdWdoIHtAbGluayBQbGF5YmFja1RpbWVMYWJlbCNzZXRUZXh0IHNldFRleHR9LlxuICovXG5leHBvcnQgY2xhc3MgUGxheWJhY2tUaW1lTGFiZWwgZXh0ZW5kcyBMYWJlbDxQbGF5YmFja1RpbWVMYWJlbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgdGltZUZvcm1hdDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogUGxheWJhY2tUaW1lTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCA8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+e1xuICAgICAgY3NzQ2xhc3M6ICd1aS1wbGF5YmFja3RpbWVsYWJlbCcsXG4gICAgICB0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudEFuZFRvdGFsVGltZSxcbiAgICAgIGhpZGVJbkxpdmVQbGF5YmFjazogZmFsc2UsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+dGhpcy5nZXRDb25maWcoKTtcbiAgICBsZXQgbGl2ZSA9IGZhbHNlO1xuICAgIGxldCBsaXZlQ3NzQ2xhc3MgPSB0aGlzLnByZWZpeENzcygndWktcGxheWJhY2t0aW1lbGFiZWwtbGl2ZScpO1xuICAgIGxldCBsaXZlRWRnZUNzc0NsYXNzID0gdGhpcy5wcmVmaXhDc3MoJ3VpLXBsYXliYWNrdGltZWxhYmVsLWxpdmUtZWRnZScpO1xuICAgIGxldCBtaW5XaWR0aCA9IDA7XG5cbiAgICBsZXQgbGl2ZUNsaWNrSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHBsYXllci50aW1lU2hpZnQoMCk7XG4gICAgfTtcblxuICAgIGxldCB1cGRhdGVMaXZlU3RhdGUgPSAoKSA9PiB7XG4gICAgICAvLyBQbGF5ZXIgaXMgcGxheWluZyBhIGxpdmUgc3RyZWFtIHdoZW4gdGhlIGR1cmF0aW9uIGlzIGluZmluaXRlXG4gICAgICBsaXZlID0gcGxheWVyLmlzTGl2ZSgpO1xuXG4gICAgICAvLyBBdHRhY2gvZGV0YWNoIGxpdmUgbWFya2VyIGNsYXNzXG4gICAgICBpZiAobGl2ZSkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyhsaXZlQ3NzQ2xhc3MpO1xuICAgICAgICB0aGlzLnNldFRleHQoJ0xpdmUnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5oaWRlSW5MaXZlUGxheWJhY2spIHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKGxpdmVDbGlja0hhbmRsZXIpO1xuICAgICAgICB1cGRhdGVMaXZlVGltZXNoaWZ0U3RhdGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVDc3NDbGFzcyk7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVFZGdlQ3NzQ2xhc3MpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgdGhpcy5vbkNsaWNrLnVuc3Vic2NyaWJlKGxpdmVDbGlja0hhbmRsZXIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdXBkYXRlTGl2ZVRpbWVzaGlmdFN0YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5nZXRUaW1lU2hpZnQoKSA9PT0gMCkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyhsaXZlRWRnZUNzc0NsYXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVFZGdlQ3NzQ2xhc3MpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgbGl2ZVN0cmVhbURldGVjdG9yID0gbmV3IFBsYXllclV0aWxzLkxpdmVTdHJlYW1EZXRlY3RvcihwbGF5ZXIpO1xuICAgIGxpdmVTdHJlYW1EZXRlY3Rvci5vbkxpdmVDaGFuZ2VkLnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzOiBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MpID0+IHtcbiAgICAgIGxpdmUgPSBhcmdzLmxpdmU7XG4gICAgICB1cGRhdGVMaXZlU3RhdGUoKTtcbiAgICB9KTtcbiAgICBsaXZlU3RyZWFtRGV0ZWN0b3IuZGV0ZWN0KCk7IC8vIEluaXRpYWwgZGV0ZWN0aW9uXG5cbiAgICBsZXQgcGxheWJhY2tUaW1lSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmICghbGl2ZSAmJiBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgdGhpcy5zZXRUaW1lKHBsYXllci5nZXRDdXJyZW50VGltZSgpLCBwbGF5ZXIuZ2V0RHVyYXRpb24oKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkICdqdW1waW5nJyBpbiB0aGUgVUkgYnkgdmFyeWluZyBsYWJlbCBzaXplcyBkdWUgdG8gbm9uLW1vbm9zcGFjZWQgZm9udHMsXG4gICAgICAvLyB3ZSBncmFkdWFsbHkgaW5jcmVhc2UgdGhlIG1pbi13aWR0aCB3aXRoIHRoZSBjb250ZW50IHRvIHJlYWNoIGEgc3RhYmxlIHNpemUuXG4gICAgICBsZXQgd2lkdGggPSB0aGlzLmdldERvbUVsZW1lbnQoKS53aWR0aCgpO1xuICAgICAgaWYgKHdpZHRoID4gbWluV2lkdGgpIHtcbiAgICAgICAgbWluV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgICAnbWluLXdpZHRoJzogbWluV2lkdGggKyAncHgnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHBsYXliYWNrVGltZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgcGxheWJhY2tUaW1lSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9USU1FX1VQREFURUQsIHBsYXliYWNrVGltZUhhbmRsZXIpO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVCwgdXBkYXRlTGl2ZVRpbWVzaGlmdFN0YXRlKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZURUQsIHVwZGF0ZUxpdmVUaW1lc2hpZnRTdGF0ZSk7XG5cbiAgICBsZXQgaW5pdCA9ICgpID0+IHtcbiAgICAgIC8vIFJlc2V0IG1pbi13aWR0aCB3aGVuIGEgbmV3IHNvdXJjZSBpcyByZWFkeSAoZXNwZWNpYWxseSBmb3Igc3dpdGNoaW5nIFZPRC9MaXZlIG1vZGVzIHdoZXJlIHRoZSBsYWJlbCBjb250ZW50XG4gICAgICAvLyBjaGFuZ2VzKVxuICAgICAgbWluV2lkdGggPSAwO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgJ21pbi13aWR0aCc6IG51bGxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTZXQgdGltZSBmb3JtYXQgZGVwZW5kaW5nIG9uIHNvdXJjZSBkdXJhdGlvblxuICAgICAgdGhpcy50aW1lRm9ybWF0ID0gTWF0aC5hYnMocGxheWVyLmlzTGl2ZSgpID8gcGxheWVyLmdldE1heFRpbWVTaGlmdCgpIDogcGxheWVyLmdldER1cmF0aW9uKCkpID49IDM2MDAgP1xuICAgICAgICBTdHJpbmdVdGlscy5GT1JNQVRfSEhNTVNTIDogU3RyaW5nVXRpbHMuRk9STUFUX01NU1M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0aW1lIGFmdGVyIHRoZSBmb3JtYXQgaGFzIGJlZW4gc2V0XG4gICAgICBwbGF5YmFja1RpbWVIYW5kbGVyKCk7XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgaW5pdCk7XG5cbiAgICBpbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY3VycmVudCBwbGF5YmFjayB0aW1lIGFuZCB0b3RhbCBkdXJhdGlvbi5cbiAgICogQHBhcmFtIHBsYXliYWNrU2Vjb25kcyB0aGUgY3VycmVudCBwbGF5YmFjayB0aW1lIGluIHNlY29uZHNcbiAgICogQHBhcmFtIGR1cmF0aW9uU2Vjb25kcyB0aGUgdG90YWwgZHVyYXRpb24gaW4gc2Vjb25kc1xuICAgKi9cbiAgc2V0VGltZShwbGF5YmFja1NlY29uZHM6IG51bWJlciwgZHVyYXRpb25TZWNvbmRzOiBudW1iZXIpIHtcbiAgICBsZXQgY3VycmVudFRpbWUgPSBTdHJpbmdVdGlscy5zZWNvbmRzVG9UaW1lKHBsYXliYWNrU2Vjb25kcywgdGhpcy50aW1lRm9ybWF0KTtcbiAgICBsZXQgdG90YWxUaW1lID0gU3RyaW5nVXRpbHMuc2Vjb25kc1RvVGltZShkdXJhdGlvblNlY29uZHMsIHRoaXMudGltZUZvcm1hdCk7XG5cbiAgICBzd2l0Y2ggKCg8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+dGhpcy5jb25maWcpLnRpbWVMYWJlbE1vZGUpIHtcbiAgICAgIGNhc2UgUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRUaW1lOlxuICAgICAgICB0aGlzLnNldFRleHQoYCR7Y3VycmVudFRpbWV9YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQbGF5YmFja1RpbWVMYWJlbE1vZGUuVG90YWxUaW1lOlxuICAgICAgICB0aGlzLnNldFRleHQoYCR7dG90YWxUaW1lfWApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRBbmRUb3RhbFRpbWU6XG4gICAgICAgIHRoaXMuc2V0VGV4dChgJHtjdXJyZW50VGltZX0gLyAke3RvdGFsVGltZX1gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJFdmVudDtcbmltcG9ydCB7UGxheWVyVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncyA9IFBsYXllclV0aWxzLlRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzO1xuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyBiZXR3ZWVuIHBsYXliYWNrIGFuZCBwYXVzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXliYWNrVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENMQVNTX1NUT1BUT0dHTEUgPSAnc3RvcHRvZ2dsZSc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXBsYXliYWNrdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdQbGF5L1BhdXNlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlciwgaGFuZGxlQ2xpY2tFdmVudDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGlzU2Vla2luZyA9IGZhbHNlO1xuXG4gICAgLy8gSGFuZGxlciB0byB1cGRhdGUgYnV0dG9uIHN0YXRlIGJhc2VkIG9uIHBsYXllciBzdGF0ZVxuICAgIGxldCBwbGF5YmFja1N0YXRlSGFuZGxlciA9IChldmVudDogUGxheWVyRXZlbnQpID0+IHtcbiAgICAgIC8vIElmIHRoZSBVSSBpcyBjdXJyZW50bHkgc2Vla2luZywgcGxheWJhY2sgaXMgdGVtcG9yYXJpbHkgc3RvcHBlZCBidXQgdGhlIGJ1dHRvbnMgc2hvdWxkXG4gICAgICAvLyBub3QgcmVmbGVjdCB0aGF0IGFuZCBzdGF5IGFzLWlzIChlLmcgaW5kaWNhdGUgcGxheWJhY2sgd2hpbGUgc2Vla2luZykuXG4gICAgICBpZiAoaXNTZWVraW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHBsYXllci5pc1BsYXlpbmcoKSkge1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9mZigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDYWxsIGhhbmRsZXIgdXBvbiB0aGVzZSBldmVudHNcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCBwbGF5YmFja1N0YXRlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUEFVU0VELCBwbGF5YmFja1N0YXRlSGFuZGxlcik7XG4gICAgLy8gd2hlbiBwbGF5YmFjayBmaW5pc2hlcywgcGxheWVyIHR1cm5zIHRvIHBhdXNlZCBtb2RlXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUJBQ0tfRklOSVNIRUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1BMQVlJTkcsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1BBVVNFRCwgcGxheWJhY2tTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfUExBWUJBQ0tfRklOSVNIRUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcblxuICAgIC8vIERldGVjdCBhYnNlbmNlIG9mIHRpbWVzaGlmdGluZyBvbiBsaXZlIHN0cmVhbXMgYW5kIGFkZCB0YWdnaW5nIGNsYXNzIHRvIGNvbnZlcnQgYnV0dG9uIGljb25zIHRvIHBsYXkvc3RvcFxuICAgIGxldCB0aW1lU2hpZnREZXRlY3RvciA9IG5ldyBQbGF5ZXJVdGlscy5UaW1lU2hpZnRBdmFpbGFiaWxpdHlEZXRlY3RvcihwbGF5ZXIpO1xuICAgIHRpbWVTaGlmdERldGVjdG9yLm9uVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZC5zdWJzY3JpYmUoXG4gICAgICAoc2VuZGVyLCBhcmdzOiBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncykgPT4ge1xuICAgICAgICBpZiAoIWFyZ3MudGltZVNoaWZ0QXZhaWxhYmxlKSB7XG4gICAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoUGxheWJhY2tUb2dnbGVCdXR0b24uQ0xBU1NfU1RPUFRPR0dMRSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFBsYXliYWNrVG9nZ2xlQnV0dG9uLkNMQVNTX1NUT1BUT0dHTEUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gICAgdGltZVNoaWZ0RGV0ZWN0b3IuZGV0ZWN0KCk7IC8vIEluaXRpYWwgZGV0ZWN0aW9uXG5cbiAgICBpZiAoaGFuZGxlQ2xpY2tFdmVudCkge1xuICAgICAgLy8gQ29udHJvbCBwbGF5ZXIgYnkgYnV0dG9uIGV2ZW50c1xuICAgICAgLy8gV2hlbiBhIGJ1dHRvbiBldmVudCB0cmlnZ2VycyBhIHBsYXllciBBUEkgY2FsbCwgZXZlbnRzIGFyZSBmaXJlZCB3aGljaCBpbiB0dXJuIGNhbGwgdGhlIGV2ZW50IGhhbmRsZXJcbiAgICAgIC8vIGFib3ZlIHRoYXQgdXBkYXRlZCB0aGUgYnV0dG9uIHN0YXRlLlxuICAgICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoZSkgPT4ge1xuICAgICAgICBpZiAocGxheWVyLmlzUGxheWluZygpKSB7XG4gICAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoe2FjdGlvbjogJ3BhdXNlJywgZSwgb3JpZ2luYXRvcjogJ1BsYXliYWNrVG9nZ2xlQnV0dG9uJ30pXG4gICAgICAgICAgcGxheWVyLnBhdXNlKCd1aS1idXR0b24nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7YWN0aW9uOiAncGxheScsIGUsIG9yaWdpbmF0b3I6ICdQbGF5YmFja1RvZ2dsZUJ1dHRvbid9KVxuICAgICAgICAgIHBsYXllci5wbGF5KCd1aS1idXR0b24nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVHJhY2sgVUkgc2Vla2luZyBzdGF0dXNcbiAgICB1aW1hbmFnZXIub25TZWVrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSB0cnVlO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vblNlZWtlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaXNTZWVraW5nID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBwbGF5YmFja1N0YXRlSGFuZGxlcihudWxsKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7SHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2h1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgZXJyb3IgbWVzc2FnZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBwbGF5YmFja1RvZ2dsZUJ1dHRvbjogSHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5wbGF5YmFja1RvZ2dsZUJ1dHRvbiA9IG5ldyBIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24oKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktcGxheWJhY2t0b2dnbGUtb3ZlcmxheScsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy5wbGF5YmFja1RvZ2dsZUJ1dHRvbl1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lckNvbmZpZywgQ29udGFpbmVyfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXIsIFVJUmVjb21tZW5kYXRpb25Db25maWd9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0h1Z2VSZXBsYXlCdXR0b259IGZyb20gJy4vaHVnZXJlcGxheWJ1dHRvbic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgcmVjb21tZW5kZWQgdmlkZW9zLlxuICovXG5leHBvcnQgY2xhc3MgUmVjb21tZW5kYXRpb25PdmVybGF5IGV4dGVuZHMgQ29udGFpbmVyPENvbnRhaW5lckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgcmVwbGF5QnV0dG9uOiBIdWdlUmVwbGF5QnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5yZXBsYXlCdXR0b24gPSBuZXcgSHVnZVJlcGxheUJ1dHRvbigpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1yZWNvbW1lbmRhdGlvbi1vdmVybGF5JyxcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLnJlcGxheUJ1dHRvbl1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNsZWFyUmVjb21tZW5kYXRpb25zID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBSZWNvbW1lbmRhdGlvbkl0ZW0pIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKCdyZWNvbW1lbmRhdGlvbnMnKSk7XG4gICAgfTtcblxuICAgIGxldCBzZXR1cFJlY29tbWVuZGF0aW9ucyA9ICgpID0+IHtcbiAgICAgIGNsZWFyUmVjb21tZW5kYXRpb25zKCk7XG5cbiAgICAgIGxldCBoYXNSZWNvbW1lbmRhdGlvbnNJblVpQ29uZmlnID0gdWltYW5hZ2VyLmdldENvbmZpZygpLnJlY29tbWVuZGF0aW9uc1xuICAgICAgICAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkucmVjb21tZW5kYXRpb25zLmxlbmd0aCA+IDA7XG4gICAgICBsZXQgaGFzUmVjb21tZW5kYXRpb25zSW5QbGF5ZXJDb25maWcgPSBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UucmVjb21tZW5kYXRpb25zXG4gICAgICAgICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UucmVjb21tZW5kYXRpb25zLmxlbmd0aCA+IDA7XG5cbiAgICAgIC8vIFRha2UgbWFya2VycyBmcm9tIHRoZSBVSSBjb25maWcuIElmIG5vIG1hcmtlcnMgZGVmaW5lZCwgdHJ5IHRvIHRha2UgdGhlbSBmcm9tIHRoZSBwbGF5ZXIncyBzb3VyY2UgY29uZmlnLlxuICAgICAgbGV0IHJlY29tbWVuZGF0aW9ucyA9IGhhc1JlY29tbWVuZGF0aW9uc0luVWlDb25maWcgPyB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkucmVjb21tZW5kYXRpb25zIDpcbiAgICAgICAgaGFzUmVjb21tZW5kYXRpb25zSW5QbGF5ZXJDb25maWcgPyBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLnJlY29tbWVuZGF0aW9ucyA6IG51bGw7XG5cbiAgICAgIC8vIEdlbmVyYXRlIHRpbWVsaW5lIG1hcmtlcnMgZnJvbSB0aGUgY29uZmlnIGlmIHdlIGhhdmUgbWFya2VycyBhbmQgaWYgd2UgaGF2ZSBhIGR1cmF0aW9uXG4gICAgICAvLyBUaGUgZHVyYXRpb24gY2hlY2sgaXMgZm9yIGJ1Z2d5IHBsYXRmb3JtcyB3aGVyZSB0aGUgZHVyYXRpb24gaXMgbm90IGF2YWlsYWJsZSBpbnN0YW50bHkgKENocm9tZSBvbiBBbmRyb2lkIDQuMylcbiAgICAgIGlmIChyZWNvbW1lbmRhdGlvbnMpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gMTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZWNvbW1lbmRhdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgUmVjb21tZW5kYXRpb25JdGVtKHtcbiAgICAgICAgICAgIGl0ZW1Db25maWc6IGl0ZW0sXG4gICAgICAgICAgICBjc3NDbGFzc2VzOiBbJ3JlY29tbWVuZGF0aW9uLWl0ZW0tJyArIChpbmRleCsrKV1cbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVDb21wb25lbnRzKCk7IC8vIGNyZWF0ZSBjb250YWluZXIgRE9NIGVsZW1lbnRzXG5cbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ3JlY29tbWVuZGF0aW9ucycpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQWRkIHJlY29tbWVuZGF0aW9uIHdoZW4gYSBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHNldHVwUmVjb21tZW5kYXRpb25zKTtcbiAgICAvLyBSZW1vdmUgcmVjb21tZW5kYXRpb25zIGFuZCBoaWRlIG92ZXJsYXkgd2hlbiBzb3VyY2UgaXMgdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsICgpID0+IHtcbiAgICAgIGNsZWFyUmVjb21tZW5kYXRpb25zKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcbiAgICAvLyBEaXNwbGF5IHJlY29tbWVuZGF0aW9ucyB3aGVuIHBsYXliYWNrIGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlCQUNLX0ZJTklTSEVELCAoKSA9PiB7XG4gICAgICAvLyBEaXNtaXNzIE9OX1BMQVlCQUNLX0ZJTklTSEVEIGV2ZW50cyBhdCB0aGUgZW5kIG9mIGFkc1xuICAgICAgLy8gVE9ETyByZW1vdmUgdGhpcyB3b3JrYXJvdW5kIG9uY2UgaXNzdWUgIzEyNzggaXMgc29sdmVkXG4gICAgICBpZiAocGxheWVyLmlzQWQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0pO1xuICAgIC8vIEhpZGUgcmVjb21tZW5kYXRpb25zIHdoZW4gcGxheWJhY2sgc3RhcnRzLCBlLmcuIGEgcmVzdGFydFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVksICgpID0+IHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdCBvbiBzdGFydHVwXG4gICAgc2V0dXBSZWNvbW1lbmRhdGlvbnMoKTtcbiAgfVxufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIFJlY29tbWVuZGF0aW9uSXRlbX1cbiAqL1xuaW50ZXJmYWNlIFJlY29tbWVuZGF0aW9uSXRlbUNvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gIGl0ZW1Db25maWc6IFVJUmVjb21tZW5kYXRpb25Db25maWc7XG59XG5cbi8qKlxuICogQW4gaXRlbSBvZiB0aGUge0BsaW5rIFJlY29tbWVuZGF0aW9uT3ZlcmxheX0uIFVzZWQgb25seSBpbnRlcm5hbGx5IGluIHtAbGluayBSZWNvbW1lbmRhdGlvbk92ZXJsYXl9LlxuICovXG5jbGFzcyBSZWNvbW1lbmRhdGlvbkl0ZW0gZXh0ZW5kcyBDb21wb25lbnQ8UmVjb21tZW5kYXRpb25JdGVtQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBSZWNvbW1lbmRhdGlvbkl0ZW1Db25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1yZWNvbW1lbmRhdGlvbi1pdGVtJyxcbiAgICAgIGl0ZW1Db25maWc6IG51bGwgLy8gdGhpcyBtdXN0IGJlIHBhc3NlZCBpbiBmcm9tIG91dHNpZGVcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGNvbmZpZyA9ICg8UmVjb21tZW5kYXRpb25JdGVtQ29uZmlnPnRoaXMuY29uZmlnKS5pdGVtQ29uZmlnOyAvLyBUT0RPIGZpeCBnZW5lcmljcyBhbmQgZ2V0IHJpZCBvZiBjYXN0XG5cbiAgICBsZXQgaXRlbUVsZW1lbnQgPSBuZXcgRE9NKCdhJywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKSxcbiAgICAgICdocmVmJzogY29uZmlnLnVybFxuICAgIH0pLmNzcyh7ICdiYWNrZ3JvdW5kLWltYWdlJzogYHVybCgke2NvbmZpZy50aHVtYm5haWx9KWAgfSk7XG5cbiAgICBsZXQgYmdFbGVtZW50ID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2JhY2tncm91bmQnKVxuICAgIH0pO1xuICAgIGl0ZW1FbGVtZW50LmFwcGVuZChiZ0VsZW1lbnQpO1xuXG4gICAgbGV0IHRpdGxlRWxlbWVudCA9IG5ldyBET00oJ3NwYW4nLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygndGl0bGUnKVxuICAgIH0pLmFwcGVuZChuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2lubmVydGl0bGUnKVxuICAgIH0pLmh0bWwoY29uZmlnLnRpdGxlKSk7XG4gICAgaXRlbUVsZW1lbnQuYXBwZW5kKHRpdGxlRWxlbWVudCk7XG5cbiAgICBsZXQgdGltZUVsZW1lbnQgPSBuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2R1cmF0aW9uJylcbiAgICB9KS5hcHBlbmQobmV3IERPTSgnc3BhbicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdpbm5lcmR1cmF0aW9uJylcbiAgICB9KS5odG1sKGNvbmZpZy5kdXJhdGlvbiA/IFN0cmluZ1V0aWxzLnNlY29uZHNUb1RpbWUoY29uZmlnLmR1cmF0aW9uKSA6ICcnKSk7XG4gICAgaXRlbUVsZW1lbnQuYXBwZW5kKHRpbWVFbGVtZW50KTtcblxuICAgIHJldHVybiBpdGVtRWxlbWVudDtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtFdmVudCwgRXZlbnREaXNwYXRjaGVyLCBOb0FyZ3N9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5pbXBvcnQge1NlZWtCYXJMYWJlbH0gZnJvbSAnLi9zZWVrYmFybGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlciwgVGltZWxpbmVNYXJrZXIsIFNlZWtQcmV2aWV3QXJnc30gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5pbXBvcnQge1BsYXllclV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3MgPSBQbGF5ZXJVdGlscy5UaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncztcbmltcG9ydCBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MgPSBQbGF5ZXJVdGlscy5MaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3M7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgU2Vla0Jhcn0gY29tcG9uZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlZWtCYXJDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICAvKipcbiAgICogVGhlIGxhYmVsIGFib3ZlIHRoZSBzZWVrIHBvc2l0aW9uLlxuICAgKi9cbiAgbGFiZWw/OiBTZWVrQmFyTGFiZWw7XG4gIC8qKlxuICAgKiBCYXIgd2lsbCBiZSB2ZXJ0aWNhbCBpbnN0ZWFkIG9mIGhvcml6b250YWwgaWYgc2V0IHRvIHRydWUuXG4gICAqL1xuICB2ZXJ0aWNhbD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGUgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGluIHdoaWNoIHRoZSBwbGF5YmFjayBwb3NpdGlvbiBvbiB0aGUgc2VlayBiYXIgd2lsbCBiZSB1cGRhdGVkLiBUaGUgc2hvcnRlciB0aGVcbiAgICogaW50ZXJ2YWwsIHRoZSBzbW9vdGhlciBpdCBsb29rcyBhbmQgdGhlIG1vcmUgcmVzb3VyY2UgaW50ZW5zZSBpdCBpcy4gVGhlIHVwZGF0ZSBpbnRlcnZhbCB3aWxsIGJlIGtlcHQgYXMgc3RlYWR5XG4gICAqIGFzIHBvc3NpYmxlIHRvIGF2b2lkIGppdHRlci5cbiAgICogU2V0IHRvIC0xIHRvIGRpc2FibGUgc21vb3RoIHVwZGF0aW5nIGFuZCB1cGRhdGUgaXQgb24gcGxheWVyIE9OX1RJTUVfQ0hBTkdFRCBldmVudHMgaW5zdGVhZC5cbiAgICogRGVmYXVsdDogNTAgKDUwbXMgPSAyMGZwcykuXG4gICAqL1xuICBzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNcz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBFdmVudCBhcmd1bWVudCBpbnRlcmZhY2UgZm9yIGEgc2VlayBwcmV2aWV3IGV2ZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlZWtQcmV2aWV3RXZlbnRBcmdzIGV4dGVuZHMgU2Vla1ByZXZpZXdBcmdzIHtcbiAgLyoqXG4gICAqIFRlbGxzIGlmIHRoZSBzZWVrIHByZXZpZXcgZXZlbnQgY29tZXMgZnJvbSBhIHNjcnViYmluZy5cbiAgICovXG4gIHNjcnViYmluZzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIHNlZWsgYmFyIHRvIHNlZWsgd2l0aGluIHRoZSBwbGF5ZXIncyBtZWRpYS4gSXQgZGlzcGxheXMgdGhlIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb24sIGFtb3VudCBvZiBidWZmZWQgZGF0YSwgc2Vla1xuICogdGFyZ2V0LCBhbmQga2VlcHMgc3RhdHVzIGFib3V0IGFuIG9uZ29pbmcgc2Vlay5cbiAqXG4gKiBUaGUgc2VlayBiYXIgZGlzcGxheXMgZGlmZmVyZW50ICdiYXJzJzpcbiAqICAtIHRoZSBwbGF5YmFjayBwb3NpdGlvbiwgaS5lLiB0aGUgcG9zaXRpb24gaW4gdGhlIG1lZGlhIGF0IHdoaWNoIHRoZSBwbGF5ZXIgY3VycmVudCBwbGF5YmFjayBwb2ludGVyIGlzIHBvc2l0aW9uZWRcbiAqICAtIHRoZSBidWZmZXIgcG9zaXRpb24sIHdoaWNoIHVzdWFsbHkgaXMgdGhlIHBsYXliYWNrIHBvc2l0aW9uIHBsdXMgdGhlIHRpbWUgc3BhbiB0aGF0IGlzIGFscmVhZHkgYnVmZmVyZWQgYWhlYWRcbiAqICAtIHRoZSBzZWVrIHBvc2l0aW9uLCB1c2VkIHRvIHByZXZpZXcgdG8gd2hlcmUgaW4gdGhlIHRpbWVsaW5lIGEgc2VlayB3aWxsIGp1bXAgdG9cbiAqL1xuZXhwb3J0IGNsYXNzIFNlZWtCYXIgZXh0ZW5kcyBDb21wb25lbnQ8U2Vla0JhckNvbmZpZz4ge1xuXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU01PT1RIX1BMQVlCQUNLX1BPU0lUSU9OX1VQREFURV9ESVNBQkxFRCA9IC0xO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzIHRoYXQgaXMgYWRkZWQgdG8gdGhlIERPTSBlbGVtZW50IHdoaWxlIHRoZSBzZWVrIGJhciBpcyBpbiAnc2Vla2luZycgc3RhdGUuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDTEFTU19TRUVLSU5HID0gJ3NlZWtpbmcnO1xuXG4gIHByaXZhdGUgc2Vla0JhcjogRE9NO1xuICBwcml2YXRlIHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uOiBET007XG4gIHByaXZhdGUgc2Vla0JhclBsYXliYWNrUG9zaXRpb25NYXJrZXI6IERPTTtcbiAgcHJpdmF0ZSBzZWVrQmFyQnVmZmVyUG9zaXRpb246IERPTTtcbiAgcHJpdmF0ZSBzZWVrQmFyU2Vla1Bvc2l0aW9uOiBET007XG4gIHByaXZhdGUgc2Vla0JhckJhY2tkcm9wOiBET007XG4gIHByaXZhdGUgc2Vla0Jhck1hcmtlcnNDb250YWluZXI6IERPTTtcblxuICBwcml2YXRlIGxhYmVsOiBTZWVrQmFyTGFiZWw7XG5cbiAgcHJpdmF0ZSBfY29tbWVudHNPbjogYm9vbGVhbiA9IHRydWU7XG4gIHByaXZhdGUgdGltZWxpbmVNYXJrZXJzOiBUaW1lbGluZU1hcmtlcltdO1xuXG4gIC8qKlxuICAgKiBCdWZmZXIgb2YgdGhlIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uLiBUaGUgcG9zaXRpb24gbXVzdCBiZSBidWZmZXJlZCBpbiBjYXNlIHRoZSBlbGVtZW50XG4gICAqIG5lZWRzIHRvIGJlIHJlZnJlc2hlZCB3aXRoIHtAbGluayAjcmVmcmVzaFBsYXliYWNrUG9zaXRpb259LlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgcHJpdmF0ZSBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDA7XG5cbiAgcHJpdmF0ZSBzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcjogVGltZW91dDtcblxuXG4gIC8vIGh0dHBzOi8vaGFja3MubW96aWxsYS5vcmcvMjAxMy8wNC9kZXRlY3RpbmctdG91Y2gtaXRzLXRoZS13aHktbm90LXRoZS1ob3cvXG4gIHByaXZhdGUgdG91Y2hTdXBwb3J0ZWQgPSAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KTtcblxuICBwcml2YXRlIHNlZWtCYXJFdmVudHMgPSB7XG4gICAgLyoqXG4gICAgICogRmlyZWQgd2hlbiBhIHNjcnViYmluZyBzZWVrIG9wZXJhdGlvbiBpcyBzdGFydGVkLlxuICAgICAqL1xuICAgIG9uU2VlazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBOb0FyZ3M+KCksXG4gICAgLyoqXG4gICAgICogRmlyZWQgZHVyaW5nIGEgc2NydWJiaW5nIHNlZWsgdG8gaW5kaWNhdGUgdGhhdCB0aGUgc2VlayBwcmV2aWV3IChpLmUuIHRoZSB2aWRlbyBmcmFtZSkgc2hvdWxkIGJlIHVwZGF0ZWQuXG4gICAgICovXG4gICAgb25TZWVrUHJldmlldzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz4oKSxcbiAgICAvKipcbiAgICAgKiBGaXJlZCB3aGVuIGEgc2NydWJiaW5nIHNlZWsgaGFzIGZpbmlzaGVkIG9yIHdoZW4gYSBkaXJlY3Qgc2VlayBpcyBpc3N1ZWQuXG4gICAgICovXG4gICAgb25TZWVrZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgbnVtYmVyPigpLFxuXG4gICAgLyoqXG4gICAgICogRmlyZSB3aGVuIGNvbW1lbnRzT24gaXMgdG9nZ2xlZFxuICAgICAqL1xuICAgIG9uQ2hhbmdlQ29tbWVudHNPbjogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBib29sZWFuPigpXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZWVrQmFyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZWVrYmFyJyxcbiAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgIHNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zOiA1MCxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG5cbiAgICB0aGlzLmxhYmVsID0gdGhpcy5jb25maWcubGFiZWw7XG4gICAgdGhpcy50aW1lbGluZU1hcmtlcnMgPSBbXTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKHRoaXMuaGFzTGFiZWwoKSkge1xuICAgICAgdGhpcy5nZXRMYWJlbCgpLmluaXRpYWxpemUoKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIsIGNvbmZpZ3VyZVNlZWs6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGlmICghY29uZmlndXJlU2Vlaykge1xuICAgICAgLy8gVGhlIGNvbmZpZ3VyZVNlZWsgZmxhZyBjYW4gYmUgdXNlZCBieSBzdWJjbGFzc2VzIHRvIGRpc2FibGUgY29uZmlndXJhdGlvbiBhcyBzZWVrIGJhci4gRS5nLiB0aGUgdm9sdW1lXG4gICAgICAvLyBzbGlkZXIgaXMgcmV1c2luZyB0aGlzIGNvbXBvbmVudCBidXQgYWRkcyBpdHMgb3duIGZ1bmN0aW9uYWxpdHksIGFuZCBkb2VzIG5vdCBuZWVkIHRoZSBzZWVrIGZ1bmN0aW9uYWxpdHkuXG4gICAgICAvLyBUaGlzIGlzIGFjdHVhbGx5IGEgaGFjaywgdGhlIHByb3BlciBzb2x1dGlvbiB3b3VsZCBiZSBmb3IgYm90aCBzZWVrIGJhciBhbmQgdm9sdW1lIHNsaWRlcnMgdG8gZXh0ZW5kXG4gICAgICAvLyBhIGNvbW1vbiBiYXNlIHNsaWRlciBjb21wb25lbnQgYW5kIGltcGxlbWVudCB0aGVpciBmdW5jdGlvbmFsaXR5IHRoZXJlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwbGF5YmFja05vdEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBsZXQgaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgbGV0IGlzU2Vla2luZyA9IGZhbHNlO1xuXG4gICAgLy8gVXBkYXRlIHBsYXliYWNrIGFuZCBidWZmZXIgcG9zaXRpb25zXG4gICAgbGV0IHBsYXliYWNrUG9zaXRpb25IYW5kbGVyID0gKGV2ZW50OiBQbGF5ZXJFdmVudCA9IG51bGwsIGZvcmNlVXBkYXRlOiBib29sZWFuID0gZmFsc2UpID0+IHtcbiAgICAgIC8vIE9uY2UgdGhpcyBoYW5kbGVyIG9zIGNhbGxlZCwgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBhbmQgd2Ugc2V0IHRoZSBmbGFnIHRvIGZhbHNlXG4gICAgICBwbGF5YmFja05vdEluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChpc1NlZWtpbmcpIHtcbiAgICAgICAgLy8gV2UgY2F1Z2h0IGEgc2VlayBwcmV2aWV3IHNlZWssIGRvIG5vdCB1cGRhdGUgdGhlIHNlZWtiYXJcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGxheWVyLmlzTGl2ZSgpKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgPT09IDApIHtcbiAgICAgICAgICAvLyBUaGlzIGNhc2UgbXVzdCBiZSBleHBsaWNpdGx5IGhhbmRsZWQgdG8gYXZvaWQgZGl2aXNpb24gYnkgemVyb1xuICAgICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbigxMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGxldCBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDEwMCAtICgxMDAgLyBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgKiBwbGF5ZXIuZ2V0VGltZVNoaWZ0KCkpO1xuICAgICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbihwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHdheXMgc2hvdyBmdWxsIGJ1ZmZlciBmb3IgbGl2ZSBzdHJlYW1zXG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24oMTAwKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgcGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgPSAxMDAgLyBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAqIHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xuXG4gICAgICAgIGxldCB2aWRlb0J1ZmZlckxlbmd0aCA9IHBsYXllci5nZXRWaWRlb0J1ZmZlckxlbmd0aCgpO1xuICAgICAgICBsZXQgYXVkaW9CdWZmZXJMZW5ndGggPSBwbGF5ZXIuZ2V0QXVkaW9CdWZmZXJMZW5ndGgoKTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBidWZmZXIgbGVuZ3RoIHdoaWNoIGlzIHRoZSBzbWFsbGVyIGxlbmd0aCBvZiB0aGUgYXVkaW8gYW5kIHZpZGVvIGJ1ZmZlcnMuIElmIG9uZSBvZiB0aGVzZVxuICAgICAgICAvLyBidWZmZXJzIGlzIG5vdCBhdmFpbGFibGUsIHdlIHNldCBpdCdzIHZhbHVlIHRvIE1BWF9WQUxVRSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgb3RoZXIgcmVhbCB2YWx1ZSBpcyB0YWtlblxuICAgICAgICAvLyBhcyB0aGUgYnVmZmVyIGxlbmd0aC5cbiAgICAgICAgbGV0IGJ1ZmZlckxlbmd0aCA9IE1hdGgubWluKFxuICAgICAgICAgIHZpZGVvQnVmZmVyTGVuZ3RoICE9IG51bGwgPyB2aWRlb0J1ZmZlckxlbmd0aCA6IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgYXVkaW9CdWZmZXJMZW5ndGggIT0gbnVsbCA/IGF1ZGlvQnVmZmVyTGVuZ3RoIDogTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgIC8vIElmIGJvdGggYnVmZmVyIGxlbmd0aHMgYXJlIG1pc3NpbmcsIHdlIHNldCB0aGUgYnVmZmVyIGxlbmd0aCB0byB6ZXJvXG4gICAgICAgIGlmIChidWZmZXJMZW5ndGggPT09IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICAgICAgICBidWZmZXJMZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJ1ZmZlclBlcmNlbnRhZ2UgPSAxMDAgLyBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAqIGJ1ZmZlckxlbmd0aDtcblxuICAgICAgICAvLyBVcGRhdGUgcGxheWJhY2sgcG9zaXRpb24gb25seSBpbiBwYXVzZWQgc3RhdGUgb3IgaW4gdGhlIGluaXRpYWwgc3RhcnR1cCBzdGF0ZSB3aGVyZSBwbGF5ZXIgaXMgbmVpdGhlclxuICAgICAgICAvLyBwYXVzZWQgbm9yIHBsYXlpbmcuIFBsYXliYWNrIHVwZGF0ZXMgYXJlIGhhbmRsZWQgaW4gdGhlIFRpbWVvdXQgYmVsb3cuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNcyA9PT0gU2Vla0Jhci5TTU9PVEhfUExBWUJBQ0tfUE9TSVRJT05fVVBEQVRFX0RJU0FCTEVEXG4gICAgICAgICAgfHwgZm9yY2VVcGRhdGUgfHwgcGxheWVyLmlzUGF1c2VkKCkgfHwgKHBsYXllci5pc1BhdXNlZCgpID09PSBwbGF5ZXIuaXNQbGF5aW5nKCkpKSB7XG4gICAgICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24ocGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgKyBidWZmZXJQZXJjZW50YWdlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVXBkYXRlIHNlZWtiYXIgdXBvbiB0aGVzZSBldmVudHNcbiAgICAvLyBpbml0IHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gaXQgY2hhbmdlc1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBidWZmZXJsZXZlbCB3aGVuIGJ1ZmZlcmluZyBpcyBjb21wbGV0ZVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX0VOREVELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gYSBzZWVrIGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBwbGF5YmFjayBwb3NpdGlvbiB3aGVuIGEgdGltZXNoaWZ0IGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfU0hJRlRFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBidWZmZXJsZXZlbCB3aGVuIGEgc2VnbWVudCBoYXMgYmVlbiBkb3dubG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VHTUVOVF9SRVFVRVNUX0ZJTklTSEVELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIG9mIENhc3QgcGxheWJhY2tcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuXG5cbiAgICAvLyBTZWVrIGhhbmRsaW5nXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFSywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTZWVraW5nKHRydWUpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTZWVraW5nKGZhbHNlKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZULCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFNlZWtpbmcodHJ1ZSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVEVELCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFNlZWtpbmcoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgbGV0IHNlZWsgPSAocGVyY2VudGFnZTogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTGl2ZSgpKSB7XG4gICAgICAgIHBsYXllci50aW1lU2hpZnQocGxheWVyLmdldE1heFRpbWVTaGlmdCgpIC0gKHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAqIChwZXJjZW50YWdlIC8gMTAwKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLnNlZWsocGxheWVyLmdldER1cmF0aW9uKCkgKiAocGVyY2VudGFnZSAvIDEwMCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5vblNlZWsuc3Vic2NyaWJlKChzZW5kZXIpID0+IHtcbiAgICAgIGlzU2Vla2luZyA9IHRydWU7IC8vIHRyYWNrIHNlZWtpbmcgc3RhdHVzIHNvIHdlIGNhbiBjYXRjaCBldmVudHMgZnJvbSBzZWVrIHByZXZpZXcgc2Vla3NcblxuICAgICAgLy8gTm90aWZ5IFVJIG1hbmFnZXIgb2Ygc3RhcnRlZCBzZWVrXG4gICAgICB1aW1hbmFnZXIub25TZWVrLmRpc3BhdGNoKHNlbmRlcik7XG5cbiAgICAgIC8vIFNhdmUgY3VycmVudCBwbGF5YmFjayBzdGF0ZVxuICAgICAgaXNQbGF5aW5nID0gcGxheWVyLmlzUGxheWluZygpO1xuXG4gICAgICAvLyBQYXVzZSBwbGF5YmFjayB3aGlsZSBzZWVraW5nXG4gICAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXllci5wYXVzZSgndWktc2VlaycpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMub25TZWVrUHJldmlldy5zdWJzY3JpYmUoKHNlbmRlcjogU2Vla0JhciwgYXJnczogU2Vla1ByZXZpZXdFdmVudEFyZ3MpID0+IHtcbiAgICAgIC8vIE5vdGlmeSBVSSBtYW5hZ2VyIG9mIHNlZWsgcHJldmlld1xuICAgICAgdWltYW5hZ2VyLm9uU2Vla1ByZXZpZXcuZGlzcGF0Y2goc2VuZGVyLCBhcmdzKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uU2Vla1ByZXZpZXcuc3Vic2NyaWJlUmF0ZUxpbWl0ZWQoKHNlbmRlcjogU2Vla0JhciwgYXJnczogU2Vla1ByZXZpZXdFdmVudEFyZ3MpID0+IHtcbiAgICAgIC8vIFJhdGUtbGltaXRlZCBzY3J1YmJpbmcgc2Vla1xuICAgICAgaWYgKGFyZ3Muc2NydWJiaW5nKSB7XG4gICAgICAgIHNlZWsoYXJncy5wb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSwgMjAwKTtcbiAgICB0aGlzLm9uU2Vla2VkLnN1YnNjcmliZSgoc2VuZGVyLCBwZXJjZW50YWdlKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gRG8gdGhlIHNlZWtcbiAgICAgIHNlZWsocGVyY2VudGFnZSk7XG5cbiAgICAgIC8vIENvbnRpbnVlIHBsYXliYWNrIGFmdGVyIHNlZWsgaWYgcGxheWVyIHdhcyBwbGF5aW5nIHdoZW4gc2VlayBzdGFydGVkXG4gICAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXllci5wbGF5KCd1aS1zZWVrJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdGlmeSBVSSBtYW5hZ2VyIG9mIGZpbmlzaGVkIHNlZWtcbiAgICAgIHVpbWFuYWdlci5vblNlZWtlZC5kaXNwYXRjaChzZW5kZXIpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuaGFzTGFiZWwoKSkge1xuICAgICAgLy8gQ29uZmlndXJlIGEgc2Vla2JhciBsYWJlbCB0aGF0IGlzIGludGVybmFsIHRvIHRoZSBzZWVrYmFyKVxuICAgICAgdGhpcy5nZXRMYWJlbCgpLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBzZWVrYmFyIGZvciBsaXZlIHNvdXJjZXMgd2l0aG91dCB0aW1lc2hpZnRcbiAgICBsZXQgaXNMaXZlID0gZmFsc2U7XG4gICAgbGV0IGhhc1RpbWVTaGlmdCA9IGZhbHNlO1xuICAgIGxldCBzd2l0Y2hWaXNpYmlsaXR5ID0gKGlzTGl2ZTogYm9vbGVhbiwgaGFzVGltZVNoaWZ0OiBib29sZWFuKSA9PiB7XG4gICAgICBpZiAoaXNMaXZlICYmICFoYXNUaW1lU2hpZnQpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH1cbiAgICAgIHBsYXliYWNrUG9zaXRpb25IYW5kbGVyKG51bGwsIHRydWUpO1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH07XG4gICAgbGV0IGxpdmVTdHJlYW1EZXRlY3RvciA9IG5ldyBQbGF5ZXJVdGlscy5MaXZlU3RyZWFtRGV0ZWN0b3IocGxheWVyKTtcbiAgICBsaXZlU3RyZWFtRGV0ZWN0b3Iub25MaXZlQ2hhbmdlZC5zdWJzY3JpYmUoKHNlbmRlciwgYXJnczogTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzKSA9PiB7XG4gICAgICBpc0xpdmUgPSBhcmdzLmxpdmU7XG4gICAgICBzd2l0Y2hWaXNpYmlsaXR5KGlzTGl2ZSwgaGFzVGltZVNoaWZ0KTtcbiAgICB9KTtcbiAgICBsZXQgdGltZVNoaWZ0RGV0ZWN0b3IgPSBuZXcgUGxheWVyVXRpbHMuVGltZVNoaWZ0QXZhaWxhYmlsaXR5RGV0ZWN0b3IocGxheWVyKTtcbiAgICB0aW1lU2hpZnREZXRlY3Rvci5vblRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWQuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3M6IFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzKSA9PiB7XG4gICAgICAgIGhhc1RpbWVTaGlmdCA9IGFyZ3MudGltZVNoaWZ0QXZhaWxhYmxlO1xuICAgICAgICBzd2l0Y2hWaXNpYmlsaXR5KGlzTGl2ZSwgaGFzVGltZVNoaWZ0KTtcbiAgICAgIH1cbiAgICApO1xuICAgIC8vIEluaXRpYWwgZGV0ZWN0aW9uXG4gICAgbGl2ZVN0cmVhbURldGVjdG9yLmRldGVjdCgpO1xuICAgIHRpbWVTaGlmdERldGVjdG9yLmRldGVjdCgpO1xuXG4gICAgLy8gUmVmcmVzaCB0aGUgcGxheWJhY2sgcG9zaXRpb24gd2hlbiB0aGUgcGxheWVyIHJlc2l6ZWQgb3IgdGhlIFVJIGlzIGNvbmZpZ3VyZWQuIFRoZSBwbGF5YmFjayBwb3NpdGlvbiBtYXJrZXJcbiAgICAvLyBpcyBwb3NpdGlvbmVkIGFic29sdXRlbHkgYW5kIG11c3QgdGhlcmVmb3JlIGJlIHVwZGF0ZWQgd2hlbiB0aGUgc2l6ZSBvZiB0aGUgc2Vla2JhciBjaGFuZ2VzLlxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsICgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICAvLyBBZGRpdGlvbmFsbHksIHdoZW4gdGhpcyBjb2RlIGlzIGNhbGxlZCwgdGhlIHNlZWtiYXIgaXMgbm90IHBhcnQgb2YgdGhlIFVJIHlldCBhbmQgdGhlcmVmb3JlIGRvZXMgbm90IGhhdmUgYSBzaXplLFxuICAgIC8vIHJlc3VsdGluZyBpbiBhIHdyb25nIGluaXRpYWwgcG9zaXRpb24gb2YgdGhlIG1hcmtlci4gUmVmcmVzaGluZyBpdCBvbmNlIHRoZSBVSSBpcyBjb25maWd1cmVkIHNvbHZlZCB0aGlzIGlzc3VlLlxuICAgIHVpbWFuYWdlci5vbkNvbmZpZ3VyZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICAvLyBJdCBjYW4gYWxzbyBoYXBwZW4gdGhhdCB0aGUgdmFsdWUgY2hhbmdlcyBvbmNlIHRoZSBwbGF5ZXIgaXMgcmVhZHksIG9yIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZCwgc28gd2UgbmVlZFxuICAgIC8vIHRvIHVwZGF0ZSBvbiBPTl9SRUFEWSB0b29cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzZWVrYmFyXG4gICAgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIoKTsgLy8gU2V0IHRoZSBwbGF5YmFjayBwb3NpdGlvblxuICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24oMCk7XG4gICAgdGhpcy5zZXRTZWVrUG9zaXRpb24oMCk7XG4gICAgaWYgKHRoaXMuY29uZmlnLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zICE9PSBTZWVrQmFyLlNNT09USF9QTEFZQkFDS19QT1NJVElPTl9VUERBVEVfRElTQUJMRUQpIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIocGxheWVyLCB1aW1hbmFnZXIpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ3VyZU1hcmtlcnMocGxheWVyLCB1aW1hbmFnZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcihwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIC8qXG4gICAgICogUGxheWJhY2sgcG9zaXRpb24gdXBkYXRlXG4gICAgICpcbiAgICAgKiBXZSBkbyBub3QgdXBkYXRlIHRoZSBwb3NpdGlvbiBkaXJlY3RseSBmcm9tIHRoZSBPTl9USU1FX0NIQU5HRUQgZXZlbnQsIGJlY2F1c2UgaXQgYXJyaXZlcyB2ZXJ5IGppdHRlcnkgYW5kXG4gICAgICogcmVzdWx0cyBpbiBhIGppdHRlcnkgcG9zaXRpb24gaW5kaWNhdG9yIHNpbmNlIHRoZSBDU1MgdHJhbnNpdGlvbiB0aW1lIGlzIHN0YXRpY2FsbHkgc2V0LlxuICAgICAqIFRvIHdvcmsgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIG1haW50YWluIGEgbG9jYWwgcGxheWJhY2sgcG9zaXRpb24gdGhhdCBpcyB1cGRhdGVkIGluIGEgc3RhYmxlIHJlZ3VsYXIgaW50ZXJ2YWxcbiAgICAgKiBhbmQga2VwdCBpbiBzeW5jIHdpdGggdGhlIHBsYXllci5cbiAgICAgKi9cbiAgICBsZXQgY3VycmVudFRpbWVTZWVrQmFyID0gMDtcbiAgICBsZXQgY3VycmVudFRpbWVQbGF5ZXIgPSAwO1xuICAgIGxldCB1cGRhdGVJbnRlcnZhbE1zID0gNTA7XG4gICAgbGV0IGN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzID0gdXBkYXRlSW50ZXJ2YWxNcyAvIDEwMDA7XG5cbiAgICB0aGlzLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyID0gbmV3IFRpbWVvdXQodXBkYXRlSW50ZXJ2YWxNcywgKCkgPT4ge1xuICAgICAgY3VycmVudFRpbWVTZWVrQmFyICs9IGN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzO1xuICAgICAgY3VycmVudFRpbWVQbGF5ZXIgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcblxuICAgICAgLy8gU3luYyBjdXJyZW50VGltZSBvZiBzZWVrYmFyIHRvIHBsYXllclxuICAgICAgbGV0IGN1cnJlbnRUaW1lRGVsdGEgPSBjdXJyZW50VGltZVNlZWtCYXIgLSBjdXJyZW50VGltZVBsYXllcjtcbiAgICAgIC8vIElmIHRoZSBkZWx0YSBpcyBsYXJnZXIgdGhhdCAyIHNlY3MsIGRpcmVjdGx5IGp1bXAgdGhlIHNlZWtiYXIgdG8gdGhlXG4gICAgICAvLyBwbGF5ZXIgdGltZSBpbnN0ZWFkIG9mIHNtb290aGx5IGZhc3QgZm9yd2FyZGluZy9yZXdpbmRpbmcuXG4gICAgICBpZiAoTWF0aC5hYnMoY3VycmVudFRpbWVEZWx0YSkgPiAyKSB7XG4gICAgICAgIGN1cnJlbnRUaW1lU2Vla0JhciA9IGN1cnJlbnRUaW1lUGxheWVyO1xuICAgICAgfVxuICAgICAgLy8gSWYgY3VycmVudFRpbWVEZWx0YSBpcyBuZWdhdGl2ZSBhbmQgYmVsb3cgdGhlIGFkanVzdG1lbnQgdGhyZXNob2xkLFxuICAgICAgLy8gdGhlIHBsYXllciBpcyBhaGVhZCBvZiB0aGUgc2Vla2JhciBhbmQgd2UgJ2Zhc3QgZm9yd2FyZCcgdGhlIHNlZWtiYXJcbiAgICAgIGVsc2UgaWYgKGN1cnJlbnRUaW1lRGVsdGEgPD0gLWN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzKSB7XG4gICAgICAgIGN1cnJlbnRUaW1lU2Vla0JhciArPSBjdXJyZW50VGltZVVwZGF0ZURlbHRhU2VjcztcbiAgICAgIH1cbiAgICAgIC8vIElmIGN1cnJlbnRUaW1lRGVsdGEgaXMgcG9zaXRpdmUgYW5kIGFib3ZlIHRoZSBhZGp1c3RtZW50IHRocmVzaG9sZCxcbiAgICAgIC8vIHRoZSBwbGF5ZXIgaXMgYmVoaW5kIHRoZSBzZWVrYmFyIGFuZCB3ZSAncmV3aW5kJyB0aGUgc2Vla2JhclxuICAgICAgZWxzZSBpZiAoY3VycmVudFRpbWVEZWx0YSA+PSBjdXJyZW50VGltZVVwZGF0ZURlbHRhU2Vjcykge1xuICAgICAgICBjdXJyZW50VGltZVNlZWtCYXIgLT0gY3VycmVudFRpbWVVcGRhdGVEZWx0YVNlY3M7XG4gICAgICB9XG5cbiAgICAgIGxldCBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDEwMCAvIHBsYXllci5nZXREdXJhdGlvbigpICogY3VycmVudFRpbWVTZWVrQmFyO1xuICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIGxldCBzdGFydFNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyID0gKCkgPT4ge1xuICAgICAgaWYgKCFwbGF5ZXIuaXNMaXZlKCkpIHtcbiAgICAgICAgY3VycmVudFRpbWVTZWVrQmFyID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuY2xlYXIoKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgc3RhcnRTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9QTEFZSU5HLCBzdGFydFNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QQVVTRUQsIHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9QQVVTRUQsIHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCAoKSA9PiB7XG4gICAgICBjdXJyZW50VGltZVNlZWtCYXIgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgIHN0YXJ0U21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZU1hcmtlcnMocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgY2xlYXJNYXJrZXJzID0gKCkgPT4ge1xuICAgICAgdGhpcy50aW1lbGluZU1hcmtlcnMgPSBbXTtcbiAgICAgIHRoaXMudXBkYXRlTWFya2VycygpO1xuICAgIH07XG5cbiAgICBsZXQgc2V0dXBNYXJrZXJzID0gKCkgPT4ge1xuICAgICAgY2xlYXJNYXJrZXJzKCk7XG5cbiAgICAgIGxldCBoYXNNYXJrZXJzSW5VaUNvbmZpZyA9IHVpbWFuYWdlci5nZXRDb25maWcoKS5tZXRhZGF0YSAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2Vyc1xuICAgICAgICAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2Vycy5sZW5ndGggPiAwO1xuICAgICAgbGV0IGhhc01hcmtlcnNJblBsYXllckNvbmZpZyA9IHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UgJiYgcGxheWVyLmdldENvbmZpZygpLnNvdXJjZS5tYXJrZXJzXG4gICAgICAgICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UubWFya2Vycy5sZW5ndGggPiAwO1xuXG4gICAgICAvLyBUYWtlIG1hcmtlcnMgZnJvbSB0aGUgVUkgY29uZmlnLiBJZiBubyBtYXJrZXJzIGRlZmluZWQsIHRyeSB0byB0YWtlIHRoZW0gZnJvbSB0aGUgcGxheWVyJ3Mgc291cmNlIGNvbmZpZy5cbiAgICAgIGxldCBtYXJrZXJzID0gaGFzTWFya2Vyc0luVWlDb25maWcgPyB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2VycyA6XG4gICAgICAgIGhhc01hcmtlcnNJblBsYXllckNvbmZpZyA/IHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UubWFya2VycyA6IG51bGw7XG5cbiAgICAgIC8vIEdlbmVyYXRlIHRpbWVsaW5lIG1hcmtlcnMgZnJvbSB0aGUgY29uZmlnIGlmIHdlIGhhdmUgbWFya2VycyBhbmQgaWYgd2UgaGF2ZSBhIGR1cmF0aW9uXG4gICAgICAvLyBUaGUgZHVyYXRpb24gY2hlY2sgaXMgZm9yIGJ1Z2d5IHBsYXRmb3JtcyB3aGVyZSB0aGUgZHVyYXRpb24gaXMgbm90IGF2YWlsYWJsZSBpbnN0YW50bHkgKENocm9tZSBvbiBBbmRyb2lkIDQuMylcbiAgICAgIGlmIChtYXJrZXJzICYmIHBsYXllci5nZXREdXJhdGlvbigpICE9PSBJbmZpbml0eSkge1xuICAgICAgICBmb3IgKGxldCBvIG9mIG1hcmtlcnMpIHtcbiAgICAgICAgICBsZXQgbWFya2VyID0ge1xuICAgICAgICAgICAgdGltZTogMTAwIC8gcGxheWVyLmdldER1cmF0aW9uKCkgKiBvLnRpbWUsIC8vIGNvbnZlcnQgdGltZSB0byBwZXJjZW50YWdlXG4gICAgICAgICAgICB0aXRsZTogby50aXRsZSxcbiAgICAgICAgICAgIG1hcmtlclR5cGU6ICcnICsgKG8ubWFya2VyVHlwZSB8fCAxKSxcbiAgICAgICAgICAgIGNvbW1lbnQ6IG8uY29tbWVudCB8fCAnJyxcbiAgICAgICAgICAgIGF2YXRhcjogby5hdmF0YXIsXG4gICAgICAgICAgICBudW1iZXI6IG8ubnVtYmVyIHx8ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudGltZWxpbmVNYXJrZXJzLnB1c2gobWFya2VyKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFBvcHVsYXRlIHRoZSB0aW1lbGluZSB3aXRoIHRoZSBtYXJrZXJzXG4gICAgICB0aGlzLnVwZGF0ZU1hcmtlcnMoKTtcbiAgICB9O1xuXG4gICAgLy8gQWRkIG1hcmtlcnMgd2hlbiBhIHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgc2V0dXBNYXJrZXJzKTtcbiAgICAvLyBSZW1vdmUgbWFya2VycyB3aGVuIHVubG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCBjbGVhck1hcmtlcnMpO1xuXG4gICAgLy8gSW5pdCBtYXJrZXJzIGF0IHN0YXJ0dXBcbiAgICBzZXR1cE1hcmtlcnMoKTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuXG4gICAgaWYgKHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIpIHsgLy8gb2JqZWN0IG11c3Qgbm90IG5lY2Vzc2FyaWx5IGV4aXN0LCBlLmcuIGluIHZvbHVtZSBzbGlkZXIgc3ViY2xhc3NcbiAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuY2xlYXIoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnZlcnRpY2FsKSB7XG4gICAgICB0aGlzLmNvbmZpZy5jc3NDbGFzc2VzLnB1c2goJ3ZlcnRpY2FsJyk7XG4gICAgfVxuXG4gICAgbGV0IHNlZWtCYXJDb250YWluZXIgPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSk7XG5cbiAgICBsZXQgc2Vla0JhciA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyJylcbiAgICB9KTtcbiAgICB0aGlzLnNlZWtCYXIgPSBzZWVrQmFyO1xuXG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgc2hvd3MgdGhlIGJ1ZmZlciBmaWxsIGxldmVsXG4gICAgbGV0IHNlZWtCYXJCdWZmZXJMZXZlbCA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLWJ1ZmZlcmxldmVsJylcbiAgICB9KTtcbiAgICB0aGlzLnNlZWtCYXJCdWZmZXJQb3NpdGlvbiA9IHNlZWtCYXJCdWZmZXJMZXZlbDtcblxuICAgIC8vIEluZGljYXRvciB0aGF0IHNob3dzIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uXG4gICAgbGV0IHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItcGxheWJhY2twb3NpdGlvbicpXG4gICAgfSk7XG4gICAgdGhpcy5zZWVrQmFyUGxheWJhY2tQb3NpdGlvbiA9IHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uO1xuXG4gICAgLy8gQSBtYXJrZXIgb2YgdGhlIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb24sIGUuZy4gYSBkb3Qgb3IgbGluZVxuICAgIGxldCBzZWVrQmFyUGxheWJhY2tQb3NpdGlvbk1hcmtlciA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLXBsYXliYWNrcG9zaXRpb24tbWFya2VyJylcbiAgICB9KTtcbiAgICB0aGlzLnNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyID0gc2Vla0JhclBsYXliYWNrUG9zaXRpb25NYXJrZXI7XG5cbiAgICAvLyBJbmRpY2F0b3IgdGhhdCBzaG93IHdoZXJlIGEgc2VlayB3aWxsIGdvIHRvXG4gICAgbGV0IHNlZWtCYXJTZWVrUG9zaXRpb24gPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1zZWVrcG9zaXRpb24nKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhclNlZWtQb3NpdGlvbiA9IHNlZWtCYXJTZWVrUG9zaXRpb247XG5cbiAgICAvLyBJbmRpY2F0b3IgdGhhdCBzaG93cyB0aGUgZnVsbCBzZWVrYmFyXG4gICAgbGV0IHNlZWtCYXJCYWNrZHJvcCA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLWJhY2tkcm9wJylcbiAgICB9KTtcbiAgICB0aGlzLnNlZWtCYXJCYWNrZHJvcCA9IHNlZWtCYXJCYWNrZHJvcDtcblxuICAgIGxldCBzZWVrQmFyQ2hhcHRlck1hcmtlcnNDb250YWluZXIgPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1tYXJrZXJzJylcbiAgICB9KTtcbiAgICB0aGlzLnNlZWtCYXJNYXJrZXJzQ29udGFpbmVyID0gc2Vla0JhckNoYXB0ZXJNYXJrZXJzQ29udGFpbmVyO1xuXG4gICAgc2Vla0Jhci5hcHBlbmQoc2Vla0JhckJhY2tkcm9wLCBzZWVrQmFyQnVmZmVyTGV2ZWwsIHNlZWtCYXJTZWVrUG9zaXRpb24sXG4gICAgICBzZWVrQmFyUGxheWJhY2tQb3NpdGlvbiwgc2Vla0JhckNoYXB0ZXJNYXJrZXJzQ29udGFpbmVyLCBzZWVrQmFyUGxheWJhY2tQb3NpdGlvbk1hcmtlcik7XG5cbiAgICBsZXQgc2Vla2luZyA9IGZhbHNlO1xuXG4gICAgLy8gRGVmaW5lIGhhbmRsZXIgZnVuY3Rpb25zIHNvIHdlIGNhbiBhdHRhY2gvcmVtb3ZlIHRoZW0gbGF0ZXJcbiAgICBsZXQgbW91c2VUb3VjaE1vdmVIYW5kbGVyID0gKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBBdm9pZCBwcm9wYWdhdGlvbiB0byBWUiBoYW5kbGVyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBsZXQgdGFyZ2V0UGVyY2VudGFnZSA9IDEwMCAqIHRoaXMuZ2V0T2Zmc2V0KGUpO1xuICAgICAgc2Vla0Jhci5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7XG4gICAgICAgIGFjdGlvbjogJ3NlZWtpbmctY2hhbmdlJyxcbiAgICAgICAgZSxcbiAgICAgICAgcG9zaXRpb246IHRhcmdldFBlcmNlbnRhZ2UsXG4gICAgICAgIG9yaWdpbmF0b3I6ICdTZWVrQmFyJ1xuICAgICAgfSlcbiAgICAgIHRoaXMuc2V0U2Vla1Bvc2l0aW9uKHRhcmdldFBlcmNlbnRhZ2UpO1xuICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHRhcmdldFBlcmNlbnRhZ2UpO1xuICAgICAgdGhpcy5vblNlZWtQcmV2aWV3RXZlbnQodGFyZ2V0UGVyY2VudGFnZSwgdHJ1ZSk7XG4gICAgfTtcbiAgICBsZXQgbW91c2VUb3VjaFVwSGFuZGxlciA9IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAvLyBSZW1vdmUgaGFuZGxlcnMsIHNlZWsgb3BlcmF0aW9uIGlzIGZpbmlzaGVkXG4gICAgICBuZXcgRE9NKGRvY3VtZW50KS5vZmYoJ3RvdWNobW92ZSBtb3VzZW1vdmUnLCBtb3VzZVRvdWNoTW92ZUhhbmRsZXIpO1xuICAgICAgbmV3IERPTShkb2N1bWVudCkub2ZmKCd0b3VjaGVuZCBtb3VzZXVwJywgbW91c2VUb3VjaFVwSGFuZGxlcik7XG5cbiAgICAgIGxldCB0YXJnZXRQZXJjZW50YWdlID0gMTAwICogdGhpcy5nZXRPZmZzZXQoZSk7XG4gICAgICBsZXQgc25hcHBlZENoYXB0ZXIgPSB0aGlzLmdldE1hcmtlckF0UG9zaXRpb24odGFyZ2V0UGVyY2VudGFnZSk7XG5cbiAgICAgIHNlZWtCYXIuZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoe1xuICAgICAgICBhY3Rpb246ICdzZWVraW5nLWVuZCcsXG4gICAgICAgIGUsXG4gICAgICAgIHBvc2l0aW9uOiB0YXJnZXRQZXJjZW50YWdlLFxuICAgICAgICBvcmlnaW5hdG9yOiAnU2Vla0JhcidcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0U2Vla2luZyhmYWxzZSk7XG4gICAgICBzZWVraW5nID0gZmFsc2U7XG5cbiAgICAgIC8vIEZpcmUgc2Vla2VkIGV2ZW50XG4gICAgICB0aGlzLm9uU2Vla2VkRXZlbnQoc25hcHBlZENoYXB0ZXIgPyBzbmFwcGVkQ2hhcHRlci50aW1lIDogdGFyZ2V0UGVyY2VudGFnZSk7XG4gICAgfTtcblxuICAgIC8vIEEgc2VlayBhbHdheXMgc3RhcnQgd2l0aCBhIHRvdWNoc3RhcnQgb3IgbW91c2Vkb3duIGRpcmVjdGx5IG9uIHRoZSBzZWVrYmFyLlxuICAgIC8vIFRvIHRyYWNrIGEgbW91c2Ugc2VlayBhbHNvIG91dHNpZGUgdGhlIHNlZWtiYXIgKGZvciB0b3VjaCBldmVudHMgdGhpcyB3b3JrcyBhdXRvbWF0aWNhbGx5KSxcbiAgICAvLyBzbyB0aGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIHRha2UgY2FyZSB0aGF0IHRoZSBtb3VzZSBhbHdheXMgc3RheXMgb24gdGhlIHNlZWtiYXIsIHdlIGF0dGFjaCB0aGUgbW91c2Vtb3ZlXG4gICAgLy8gYW5kIG1vdXNldXAgaGFuZGxlcnMgdG8gdGhlIHdob2xlIGRvY3VtZW50LiBBIHNlZWsgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgbGlmdHMgdGhlIG1vdXNlIGtleS5cbiAgICAvLyBBIHNlZWsgbW91c2UgZ2VzdHVyZSBpcyB0aHVzIGJhc2ljYWxseSBhIGNsaWNrIHdpdGggYSBsb25nIHRpbWUgZnJhbWUgYmV0d2VlbiBkb3duIGFuZCB1cCBldmVudHMuXG4gICAgc2Vla0Jhci5vbigndG91Y2hzdGFydCBtb3VzZWRvd24nLCAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCBpc1RvdWNoRXZlbnQgPSB0aGlzLnRvdWNoU3VwcG9ydGVkICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50O1xuXG4gICAgICAvLyBQcmV2ZW50IHNlbGVjdGlvbiBvZiBET00gZWxlbWVudHMgKGFsc28gcHJldmVudHMgbW91c2Vkb3duIGlmIGN1cnJlbnQgZXZlbnQgaXMgdG91Y2hzdGFydClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW9uIHRvIFZSIGhhbmRsZXJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHNlZWtCYXIuZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoe2FjdGlvbjogJ3NlZWtpbmctc3RhcnQnLCBlLCBvcmlnaW5hdG9yOiAnU2Vla0Jhcid9KVxuXG4gICAgICB0aGlzLnNldFNlZWtpbmcodHJ1ZSk7IC8vIFNldCBzZWVraW5nIGNsYXNzIG9uIERPTSBlbGVtZW50XG4gICAgICBzZWVraW5nID0gdHJ1ZTsgLy8gU2V0IHNlZWsgdHJhY2tpbmcgZmxhZ1xuXG4gICAgICAvLyBGaXJlIHNlZWtlZCBldmVudFxuICAgICAgdGhpcy5vblNlZWtFdmVudCgpO1xuXG4gICAgICAvLyBBZGQgaGFuZGxlciB0byB0cmFjayB0aGUgc2VlayBvcGVyYXRpb24gb3ZlciB0aGUgd2hvbGUgZG9jdW1lbnRcbiAgICAgIG5ldyBET00oZG9jdW1lbnQpLm9uKGlzVG91Y2hFdmVudCA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZScsIG1vdXNlVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICBuZXcgRE9NKGRvY3VtZW50KS5vbihpc1RvdWNoRXZlbnQgPyAndG91Y2hlbmQnIDogJ21vdXNldXAnLCBtb3VzZVRvdWNoVXBIYW5kbGVyKTtcbiAgICB9KTtcblxuICAgIC8vIERpc3BsYXkgc2VlayB0YXJnZXQgaW5kaWNhdG9yIHdoZW4gbW91c2UgaG92ZXJzIG9yIGZpbmdlciBzbGlkZXMgb3ZlciBzZWVrYmFyXG4gICAgc2Vla0Jhci5vbigndG91Y2htb3ZlIG1vdXNlbW92ZScsIChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoc2Vla2luZykge1xuICAgICAgICAvLyBEdXJpbmcgYSBzZWVrICh3aGVuIG1vdXNlIGlzIGRvd24gb3IgdG91Y2ggbW92ZSBhY3RpdmUpLCB3ZSBuZWVkIHRvIHN0b3AgcHJvcGFnYXRpb24gdG8gYXZvaWRcbiAgICAgICAgLy8gdGhlIFZSIHZpZXdwb3J0IHJlYWN0aW5nIHRvIHRoZSBtb3Zlcy5cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQmVjYXVzZSB0aGUgc3RvcHBlZCBwcm9wYWdhdGlvbiBpbmhpYml0cyB0aGUgZXZlbnQgb24gdGhlIGRvY3VtZW50LCB3ZSBuZWVkIHRvIGNhbGwgaXQgZnJvbSBoZXJlXG4gICAgICAgIG1vdXNlVG91Y2hNb3ZlSGFuZGxlcihlKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHBvc2l0aW9uID0gMTAwICogdGhpcy5nZXRPZmZzZXQoZSk7XG4gICAgICB0aGlzLnNldFNlZWtQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICB0aGlzLm9uU2Vla1ByZXZpZXdFdmVudChwb3NpdGlvbiwgZmFsc2UpO1xuXG4gICAgICBpZiAodGhpcy5oYXNMYWJlbCgpICYmIHRoaXMuZ2V0TGFiZWwoKS5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMuZ2V0TGFiZWwoKS5zaG93KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBIaWRlIHNlZWsgdGFyZ2V0IGluZGljYXRvciB3aGVuIG1vdXNlIG9yIGZpbmdlciBsZWF2ZXMgc2Vla2JhclxuICAgIHNlZWtCYXIub24oJ3RvdWNoZW5kIG1vdXNlbGVhdmUnLCAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5zZXRTZWVrUG9zaXRpb24oMCk7XG5cbiAgICAgIGlmICh0aGlzLmhhc0xhYmVsKCkpIHtcbiAgICAgICAgdGhpcy5nZXRMYWJlbCgpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlZWtCYXJDb250YWluZXIuYXBwZW5kKHNlZWtCYXIpO1xuXG4gICAgaWYgKHRoaXMubGFiZWwpIHtcbiAgICAgIHNlZWtCYXJDb250YWluZXIuYXBwZW5kKHRoaXMubGFiZWwuZ2V0RG9tRWxlbWVudCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2Vla0JhckNvbnRhaW5lcjtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVNYXJrZXJzKCk6IHZvaWQge1xuICAgIHRoaXMuc2Vla0Jhck1hcmtlcnNDb250YWluZXIuZW1wdHkoKTtcblxuICAgIGlmICghdGhpcy5fY29tbWVudHNPbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IG1hcmtlciBvZiB0aGlzLnRpbWVsaW5lTWFya2Vycykge1xuICAgICAgbGV0IGNsYXNzTmFtZSA9IG1hcmtlci5tYXJrZXJUeXBlID09PSAnMicgPyB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1tYXJrZXItdHlwZXR3bycpIDogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItbWFya2VyJylcblxuICAgICAgbGV0IG1hcmtlckRvbSA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICAgJ2NsYXNzJzogY2xhc3NOYW1lLFxuICAgICAgICAnZGF0YS1tYXJrZXItdGltZSc6IFN0cmluZyhtYXJrZXIudGltZSksXG4gICAgICAgICdkYXRhLW1hcmtlci10aXRsZSc6IFN0cmluZyhtYXJrZXIudGl0bGUpLFxuICAgICAgfSkuY3NzKHtcbiAgICAgICAgJ3dpZHRoJzogbWFya2VyLnRpbWUgKyAnJScsXG4gICAgICB9KVxuICAgICAgdGhpcy5zZWVrQmFyTWFya2Vyc0NvbnRhaW5lci5hcHBlbmQobWFya2VyRG9tKVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRNYXJrZXJBdFBvc2l0aW9uKHBlcmNlbnRhZ2U6IG51bWJlcik6IFRpbWVsaW5lTWFya2VyIHwgbnVsbCB7XG4gICAgbGV0IHNuYXBwZWRNYXJrZXI6IFRpbWVsaW5lTWFya2VyID0gbnVsbDtcbiAgICBsZXQgc25hcHBpbmdSYW5nZSA9IDE7XG4gICAgaWYgKHRoaXMudGltZWxpbmVNYXJrZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IG1hcmtlciBvZiB0aGlzLnRpbWVsaW5lTWFya2Vycykge1xuICAgICAgICBpZiAocGVyY2VudGFnZSA+PSBtYXJrZXIudGltZSAtIHNuYXBwaW5nUmFuZ2UgJiYgcGVyY2VudGFnZSA8PSBtYXJrZXIudGltZSArIHNuYXBwaW5nUmFuZ2UpIHtcbiAgICAgICAgICBzbmFwcGVkTWFya2VyID0gbWFya2VyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNuYXBwZWRNYXJrZXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaG9yaXpvbnRhbCBvZmZzZXQgb2YgYSBtb3VzZS90b3VjaCBldmVudCBwb2ludCBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIHNlZWsgYmFyLlxuICAgKiBAcGFyYW0gZXZlbnRQYWdlWCB0aGUgcGFnZVggY29vcmRpbmF0ZSBvZiBhbiBldmVudCB0byBjYWxjdWxhdGUgdGhlIG9mZnNldCBmcm9tXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGEgbnVtYmVyIGluIHRoZSByYW5nZSBvZiBbMCwgMV0sIHdoZXJlIDAgaXMgdGhlIGxlZnQgZWRnZSBhbmQgMSBpcyB0aGUgcmlnaHQgZWRnZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRIb3Jpem9udGFsT2Zmc2V0KGV2ZW50UGFnZVg6IG51bWJlcik6IG51bWJlciB7XG4gICAgbGV0IGVsZW1lbnRPZmZzZXRQeCA9IHRoaXMuc2Vla0Jhci5vZmZzZXQoKS5sZWZ0O1xuICAgIGxldCB3aWR0aFB4ID0gdGhpcy5zZWVrQmFyLndpZHRoKCk7XG4gICAgbGV0IG9mZnNldFB4ID0gZXZlbnRQYWdlWCAtIGVsZW1lbnRPZmZzZXRQeDtcbiAgICBsZXQgb2Zmc2V0ID0gMSAvIHdpZHRoUHggKiBvZmZzZXRQeDtcblxuICAgIHJldHVybiB0aGlzLnNhbml0aXplT2Zmc2V0KG9mZnNldCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmVydGljYWwgb2Zmc2V0IG9mIGEgbW91c2UvdG91Y2ggZXZlbnQgcG9pbnQgZnJvbSB0aGUgYm90dG9tIGVkZ2Ugb2YgdGhlIHNlZWsgYmFyLlxuICAgKiBAcGFyYW0gZXZlbnRQYWdlWSB0aGUgcGFnZVggY29vcmRpbmF0ZSBvZiBhbiBldmVudCB0byBjYWxjdWxhdGUgdGhlIG9mZnNldCBmcm9tXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGEgbnVtYmVyIGluIHRoZSByYW5nZSBvZiBbMCwgMV0sIHdoZXJlIDAgaXMgdGhlIGJvdHRvbSBlZGdlIGFuZCAxIGlzIHRoZSB0b3AgZWRnZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRWZXJ0aWNhbE9mZnNldChldmVudFBhZ2VZOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGxldCBlbGVtZW50T2Zmc2V0UHggPSB0aGlzLnNlZWtCYXIub2Zmc2V0KCkudG9wO1xuICAgIGxldCB3aWR0aFB4ID0gdGhpcy5zZWVrQmFyLmhlaWdodCgpO1xuICAgIGxldCBvZmZzZXRQeCA9IGV2ZW50UGFnZVkgLSBlbGVtZW50T2Zmc2V0UHg7XG4gICAgbGV0IG9mZnNldCA9IDEgLyB3aWR0aFB4ICogb2Zmc2V0UHg7XG5cbiAgICByZXR1cm4gMSAtIHRoaXMuc2FuaXRpemVPZmZzZXQob2Zmc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtb3VzZSBvciB0b3VjaCBldmVudCBvZmZzZXQgZm9yIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gKGhvcml6b250YWwgb3IgdmVydGljYWwpLlxuICAgKiBAcGFyYW0gZSB0aGUgZXZlbnQgdG8gY2FsY3VsYXRlIHRoZSBvZmZzZXQgZnJvbVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBhIG51bWJlciBpbiB0aGUgcmFuZ2Ugb2YgWzAsIDFdXG4gICAqIEBzZWUgI2dldEhvcml6b250YWxPZmZzZXRcbiAgICogQHNlZSAjZ2V0VmVydGljYWxPZmZzZXRcbiAgICovXG4gIHByaXZhdGUgZ2V0T2Zmc2V0KGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy50b3VjaFN1cHBvcnRlZCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnZlcnRpY2FsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZlcnRpY2FsT2Zmc2V0KGUudHlwZSA9PT0gJ3RvdWNoZW5kJyA/IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVkgOiBlLnRvdWNoZXNbMF0ucGFnZVkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SG9yaXpvbnRhbE9mZnNldChlLnR5cGUgPT09ICd0b3VjaGVuZCcgPyBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIDogZS50b3VjaGVzWzBdLnBhZ2VYKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLmNvbmZpZy52ZXJ0aWNhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWZXJ0aWNhbE9mZnNldChlLnBhZ2VZKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhvcml6b250YWxPZmZzZXQoZS5wYWdlWCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdpbnZhbGlkIGV2ZW50Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemVzIHRoZSBtb3VzZSBvZmZzZXQgdG8gdGhlIHJhbmdlIG9mIFswLCAxXS5cbiAgICpcbiAgICogV2hlbiB0cmFja2luZyB0aGUgbW91c2Ugb3V0c2lkZSB0aGUgc2VlayBiYXIsIHRoZSBvZmZzZXQgY2FuIGJlIG91dHNpZGUgdGhlIGRlc2lyZWQgcmFuZ2UgYW5kIHRoaXMgbWV0aG9kXG4gICAqIGxpbWl0cyBpdCB0byB0aGUgZGVzaXJlZCByYW5nZS4gRS5nLiBhIG1vdXNlIGV2ZW50IGxlZnQgb2YgdGhlIGxlZnQgZWRnZSBvZiBhIHNlZWsgYmFyIHlpZWxkcyBhbiBvZmZzZXQgYmVsb3dcbiAgICogemVybywgYnV0IHRvIGRpc3BsYXkgdGhlIHNlZWsgdGFyZ2V0IG9uIHRoZSBzZWVrIGJhciwgd2UgbmVlZCB0byBsaW1pdCBpdCB0byB6ZXJvLlxuICAgKlxuICAgKiBAcGFyYW0gb2Zmc2V0IHRoZSBvZmZzZXQgdG8gc2FuaXRpemVcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIHNhbml0aXplZCBvZmZzZXQuXG4gICAqL1xuICBwcml2YXRlIHNhbml0aXplT2Zmc2V0KG9mZnNldDogbnVtYmVyKSB7XG4gICAgLy8gU2luY2Ugd2UgdHJhY2sgbW91c2UgbW92ZXMgb3ZlciB0aGUgd2hvbGUgZG9jdW1lbnQsIHRoZSB0YXJnZXQgY2FuIGJlIG91dHNpZGUgdGhlIHNlZWsgcmFuZ2UsXG4gICAgLy8gYW5kIHdlIG5lZWQgdG8gbGltaXQgaXQgdG8gdGhlIFswLCAxXSByYW5nZS5cbiAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgb2Zmc2V0ID0gMDtcbiAgICB9IGVsc2UgaWYgKG9mZnNldCA+IDEpIHtcbiAgICAgIG9mZnNldCA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcGxheWJhY2sgcG9zaXRpb24gaW5kaWNhdG9yLlxuICAgKiBAcGFyYW0gcGVyY2VudCBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEwMCBhcyByZXR1cm5lZCBieSB0aGUgcGxheWVyXG4gICAqL1xuICBzZXRQbGF5YmFja1Bvc2l0aW9uKHBlcmNlbnQ6IG51bWJlcikge1xuICAgIHRoaXMucGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgPSBwZXJjZW50O1xuXG4gICAgLy8gU2V0IHBvc2l0aW9uIG9mIHRoZSBiYXJcbiAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc2Vla0JhclBsYXliYWNrUG9zaXRpb24sIHBlcmNlbnQpO1xuXG4gICAgLy8gU2V0IHBvc2l0aW9uIG9mIHRoZSBtYXJrZXJcbiAgICBsZXQgcHggPSAodGhpcy5jb25maWcudmVydGljYWwgPyB0aGlzLnNlZWtCYXIuaGVpZ2h0KCkgOiB0aGlzLnNlZWtCYXIud2lkdGgoKSkgLyAxMDAgKiBwZXJjZW50O1xuICAgIGlmICh0aGlzLmNvbmZpZy52ZXJ0aWNhbCkge1xuICAgICAgcHggPSB0aGlzLnNlZWtCYXIuaGVpZ2h0KCkgLSBweDtcbiAgICB9XG4gICAgbGV0IHN0eWxlID0gdGhpcy5jb25maWcudmVydGljYWwgP1xuICAgICAgLy8gLW1zLXRyYW5zZm9ybSByZXF1aXJlZCBmb3IgSUU5XG4gICAgICB7J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKCcgKyBweCArICdweCknLCAnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKCcgKyBweCArICdweCknfSA6XG4gICAgICB7J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcgKyBweCArICdweCknLCAnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcgKyBweCArICdweCknfTtcbiAgICB0aGlzLnNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyLmNzcyhzdHlsZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVmcmVzaGVzIHRoZSBwbGF5YmFjayBwb3NpdGlvbi4gQ2FuIGJlIHVzZWQgYnkgc3ViY2xhc3NlcyB0byByZWZyZXNoIHRoZSBwb3NpdGlvbiB3aGVuXG4gICAqIHRoZSBzaXplIG9mIHRoZSBjb21wb25lbnQgY2hhbmdlcy5cbiAgICovXG4gIHByb3RlY3RlZCByZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpIHtcbiAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24odGhpcy5wbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcG9zaXRpb24gdW50aWwgd2hpY2ggbWVkaWEgaXMgYnVmZmVyZWQuXG4gICAqIEBwYXJhbSBwZXJjZW50IGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMTAwXG4gICAqL1xuICBzZXRCdWZmZXJQb3NpdGlvbihwZXJjZW50OiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc2Vla0JhckJ1ZmZlclBvc2l0aW9uLCBwZXJjZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwb3NpdGlvbiB3aGVyZSBhIHNlZWssIGlmIGV4ZWN1dGVkLCB3b3VsZCBqdW1wIHRvLlxuICAgKiBAcGFyYW0gcGVyY2VudCBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEwMFxuICAgKi9cbiAgc2V0U2Vla1Bvc2l0aW9uKHBlcmNlbnQ6IG51bWJlcikge1xuICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5zZWVrQmFyU2Vla1Bvc2l0aW9uLCBwZXJjZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGFjdHVhbCBwb3NpdGlvbiAod2lkdGggb3IgaGVpZ2h0KSBvZiBhIERPTSBlbGVtZW50IHRoYXQgcmVwcmVzZW50IGEgYmFyIGluIHRoZSBzZWVrIGJhci5cbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gc2V0IHRoZSBwb3NpdGlvbiBmb3JcbiAgICogQHBhcmFtIHBlcmNlbnQgYSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxMDBcbiAgICovXG4gIHByaXZhdGUgc2V0UG9zaXRpb24oZWxlbWVudDogRE9NLCBwZXJjZW50OiBudW1iZXIpIHtcbiAgICBsZXQgc2NhbGUgPSBwZXJjZW50IC8gMTAwO1xuICAgIGxldCBzdHlsZSA9IHRoaXMuY29uZmlnLnZlcnRpY2FsID9cbiAgICAgIC8vIC1tcy10cmFuc2Zvcm0gcmVxdWlyZWQgZm9yIElFOVxuICAgICAgeyd0cmFuc2Zvcm0nOiAnc2NhbGVZKCcgKyBzY2FsZSArICcpJywgJy1tcy10cmFuc2Zvcm0nOiAnc2NhbGVZKCcgKyBzY2FsZSArICcpJ30gOlxuICAgICAgeyd0cmFuc2Zvcm0nOiAnc2NhbGVYKCcgKyBzY2FsZSArICcpJywgJy1tcy10cmFuc2Zvcm0nOiAnc2NhbGVYKCcgKyBzY2FsZSArICcpJ307XG4gICAgZWxlbWVudC5jc3Moc3R5bGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIHNlZWsgYmFyIGludG8gb3Igb3V0IG9mIHNlZWtpbmcgc3RhdGUgYnkgYWRkaW5nL3JlbW92aW5nIGEgY2xhc3MgdG8gdGhlIERPTSBlbGVtZW50LiBUaGlzIGNhbiBiZSB1c2VkXG4gICAqIHRvIGFkanVzdCB0aGUgc3R5bGluZyB3aGlsZSBzZWVraW5nLlxuICAgKlxuICAgKiBAcGFyYW0gc2Vla2luZyBzaG91bGQgYmUgdHJ1ZSB3aGVuIGVudGVyaW5nIHNlZWsgc3RhdGUsIGZhbHNlIHdoZW4gZXhpdGluZyB0aGUgc2VlayBzdGF0ZVxuICAgKi9cbiAgc2V0U2Vla2luZyhzZWVraW5nOiBib29sZWFuKSB7XG4gICAgaWYgKHNlZWtpbmcpIHtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFNlZWtCYXIuQ0xBU1NfU0VFS0lORykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhTZWVrQmFyLkNMQVNTX1NFRUtJTkcpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzZWVrIGJhciBpcyBjdXJyZW50bHkgaW4gdGhlIHNlZWsgc3RhdGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluIHNlZWsgc3RhdGUsIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzU2Vla2luZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXREb21FbGVtZW50KCkuaGFzQ2xhc3ModGhpcy5wcmVmaXhDc3MoU2Vla0Jhci5DTEFTU19TRUVLSU5HKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzZWVrIGJhciBoYXMgYSB7QGxpbmsgU2Vla0JhckxhYmVsfS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHNlZWsgYmFyIGhhcyBhIGxhYmVsLCBlbHNlIGZhbHNlXG4gICAqL1xuICBoYXNMYWJlbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbCAhPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxhYmVsIG9mIHRoaXMgc2VlayBiYXIuXG4gICAqIEByZXR1cm5zIHtTZWVrQmFyTGFiZWx9IHRoZSBsYWJlbCBpZiB0aGlzIHNlZWsgYmFyIGhhcyBhIGxhYmVsLCBlbHNlIG51bGxcbiAgICovXG4gIGdldExhYmVsKCk6IFNlZWtCYXJMYWJlbCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmxhYmVsO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uU2Vla0V2ZW50KCkge1xuICAgIHRoaXMuc2Vla0JhckV2ZW50cy5vblNlZWsuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25TZWVrUHJldmlld0V2ZW50KHBlcmNlbnRhZ2U6IG51bWJlciwgc2NydWJiaW5nOiBib29sZWFuKSB7XG4gICAgbGV0IHNuYXBwZWRNYXJrZXIgPSB0aGlzLmdldE1hcmtlckF0UG9zaXRpb24ocGVyY2VudGFnZSk7XG5cbiAgICBpZiAodGhpcy5sYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbC5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgJ2xlZnQnOiAoc25hcHBlZE1hcmtlciA/IHNuYXBwZWRNYXJrZXIudGltZSA6IHBlcmNlbnRhZ2UpICsgJyUnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrUHJldmlldy5kaXNwYXRjaCh0aGlzLCB7XG4gICAgICBzY3J1YmJpbmc6IHNjcnViYmluZyxcbiAgICAgIHBvc2l0aW9uOiBwZXJjZW50YWdlLFxuICAgICAgbWFya2VyOiBzbmFwcGVkTWFya2VyLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uU2Vla2VkRXZlbnQocGVyY2VudGFnZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zZWVrQmFyRXZlbnRzLm9uU2Vla2VkLmRpc3BhdGNoKHRoaXMsIHBlcmNlbnRhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiBhIHNjcnViYmluZyBzZWVrIG9wZXJhdGlvbiBpcyBzdGFydGVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8U2Vla0JhciwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvblNlZWsoKTogRXZlbnQ8U2Vla0JhciwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2Vla0JhckV2ZW50cy5vblNlZWsuZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIGR1cmluZyBhIHNjcnViYmluZyBzZWVrICh0byBpbmRpY2F0ZSB0aGF0IHRoZSBzZWVrIHByZXZpZXcsIGkuZS4gdGhlIHZpZGVvIGZyYW1lLFxuICAgKiBzaG91bGQgYmUgdXBkYXRlZCksIG9yIGR1cmluZyBhIG5vcm1hbCBzZWVrIHByZXZpZXcgd2hlbiB0aGUgc2VlayBiYXIgaXMgaG92ZXJlZCAoYW5kIHRoZSBzZWVrIHRhcmdldCxcbiAgICogaS5lLiB0aGUgc2VlayBiYXIgbGFiZWwsIHNob3VsZCBiZSB1cGRhdGVkKS5cbiAgICogQHJldHVybnMge0V2ZW50PFNlZWtCYXIsIFNlZWtQcmV2aWV3RXZlbnRBcmdzPn1cbiAgICovXG4gIGdldCBvblNlZWtQcmV2aWV3KCk6IEV2ZW50PFNlZWtCYXIsIFNlZWtQcmV2aWV3RXZlbnRBcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2Vla0JhckV2ZW50cy5vblNlZWtQcmV2aWV3LmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGEgc2NydWJiaW5nIHNlZWsgaGFzIGZpbmlzaGVkIG9yIHdoZW4gYSBkaXJlY3Qgc2VlayBpcyBpc3N1ZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxTZWVrQmFyLCBudW1iZXI+fVxuICAgKi9cbiAgZ2V0IG9uU2Vla2VkKCk6IEV2ZW50PFNlZWtCYXIsIG51bWJlcj4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrZWQuZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNoYW5nZUNvbW1lbnRzT25FdmVudChvbjogYm9vbGVhbikge1xuICAgIHRoaXMuc2Vla0JhckV2ZW50cy5vbkNoYW5nZUNvbW1lbnRzT24uZGlzcGF0Y2godGhpcywgb24pO1xuICB9XG5cbiAgZ2V0IG9uQ2hhbmdlQ29tbWVudHNPbigpOiBFdmVudDxTZWVrQmFyLCBib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuc2Vla0JhckV2ZW50cy5vbkNoYW5nZUNvbW1lbnRzT24uZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIHRvZ2dsZUNvbW1lbnRzT24oKTogdm9pZCB7XG4gICAgdGhpcy5fY29tbWVudHNPbiA9ICF0aGlzLl9jb21tZW50c09uO1xuICAgIHRoaXMub25DaGFuZ2VDb21tZW50c09uRXZlbnQodGhpcy5fY29tbWVudHNPbik7XG4gICAgdGhpcy51cGRhdGVNYXJrZXJzKCk7XG4gIH1cblxuICBnZXQgY29tbWVudHNPbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbWVudHNPblxuICB9XG5cbiAgcHJvdGVjdGVkIG9uU2hvd0V2ZW50KCk6IHZvaWQge1xuICAgIHN1cGVyLm9uU2hvd0V2ZW50KCk7XG5cbiAgICAvLyBSZWZyZXNoIHRoZSBwb3NpdGlvbiBvZiB0aGUgcGxheWJhY2sgcG9zaXRpb24gd2hlbiB0aGUgc2VlayBiYXIgYmVjb21lcyB2aXNpYmxlLiBUbyBjb3JyZWN0bHkgc2V0IHRoZSBwb3NpdGlvbixcbiAgICAvLyB0aGUgRE9NIGVsZW1lbnQgbXVzdCBiZSBmdWxseSBpbml0aWFsaXplZCBhbiBoYXZlIGl0cyBzaXplIGNhbGN1bGF0ZWQsIGJlY2F1c2UgdGhlIHBvc2l0aW9uIGlzIHNldCBhcyBhbiBhYnNvbHV0ZVxuICAgIC8vIHZhbHVlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgc2l6ZS4gVGhpcyByZXF1aXJlZCBzaXplIGlzIG5vdCBrbm93biB3aGVuIGl0IGlzIGhpZGRlbi5cbiAgICAvLyBGb3Igc3VjaCBjYXNlcywgd2UgcmVmcmVzaCB0aGUgcG9zaXRpb24gaGVyZSBpbiBvblNob3cgYmVjYXVzZSBoZXJlIGl0IGlzIGd1YXJhbnRlZWQgdGhhdCB0aGUgY29tcG9uZW50IGtub3dzXG4gICAgLy8gaXRzIHNpemUgYW5kIGNhbiBzZXQgdGhlIHBvc2l0aW9uIGNvcnJlY3RseS5cbiAgICB0aGlzLnJlZnJlc2hQbGF5YmFja1Bvc2l0aW9uKCk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lciwgQ29udGFpbmVyQ29uZmlnfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyLCBTZWVrUHJldmlld0FyZ3N9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIFNlZWtCYXJMYWJlbH0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2Vla0JhckxhYmVsQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLy8gbm90aGluZyB5ZXRcbn1cblxuLyoqXG4gKiBBIGxhYmVsIGZvciBhIHtAbGluayBTZWVrQmFyfSB0aGF0IGNhbiBkaXNwbGF5IHRoZSBzZWVrIHRhcmdldCB0aW1lLCBhIHRodW1ibmFpbCwgYW5kIHRpdGxlIChlLmcuIGNoYXB0ZXIgdGl0bGUpLlxuICovXG5leHBvcnQgY2xhc3MgU2Vla0JhckxhYmVsIGV4dGVuZHMgQ29udGFpbmVyPFNlZWtCYXJMYWJlbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgdGltZUxhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgdGl0bGVMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIG51bWJlckxhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgY29tbWVudExhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgYXZhdGFyTGFiZWw6IExhYmVsPExhYmVsQ29uZmlnPjtcbiAgcHJpdmF0ZSB0aHVtYm5haWw6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+O1xuICBwcml2YXRlIG1ldGFkYXRhOiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPjtcblxuICBwcml2YXRlIHRpbWVGb3JtYXQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFNlZWtCYXJMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMudGltZUxhYmVsID0gbmV3IExhYmVsKHtjc3NDbGFzc2VzOiBbJ3NlZWtiYXItbGFiZWwtdGltZSddfSk7XG4gICAgdGhpcy50aXRsZUxhYmVsID0gbmV3IExhYmVsKHtjc3NDbGFzc2VzOiBbJ3NlZWtiYXItbGFiZWwtdGl0bGUnXX0pO1xuICAgIHRoaXMuY29tbWVudExhYmVsID0gbmV3IExhYmVsKHtjc3NDbGFzc2VzOiBbJ3NlZWtiYXItbGFiZWwtY29tbWVudCddfSk7XG4gICAgdGhpcy5udW1iZXJMYWJlbCA9IG5ldyBMYWJlbCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLWxhYmVsLW51bWJlciddfSk7XG4gICAgdGhpcy5hdmF0YXJMYWJlbCA9IG5ldyBMYWJlbCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLWxhYmVsLWF2YXRhciddfSk7XG4gICAgdGhpcy50aHVtYm5haWwgPSBuZXcgQ29tcG9uZW50KHtjc3NDbGFzc2VzOiBbJ3NlZWtiYXItdGh1bWJuYWlsJ119KTtcbiAgICB0aGlzLm1ldGFkYXRhID0gbmV3IENvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIHRoaXMuYXZhdGFyTGFiZWwsXG4gICAgICAgICAgICB0aGlzLnRpdGxlTGFiZWwsXG4gICAgICAgICAgICB0aGlzLm51bWJlckxhYmVsXSxcbiAgICAgICAgICBjc3NDbGFzczogJ3NlZWtiYXItbGFiZWwtbWV0YWRhdGEtdGl0bGUnLFxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgdGhpcy5jb21tZW50TGFiZWwsXG4gICAgICAgICAgICB0aGlzLnRpbWVMYWJlbF0sXG4gICAgICAgICAgY3NzQ2xhc3M6ICdzZWVrYmFyLWxhYmVsLW1ldGFkYXRhLWNvbnRlbnQnLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICBjc3NDbGFzczogJ3NlZWtiYXItbGFiZWwtbWV0YWRhdGEnXG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNlZWtiYXItbGFiZWwnLFxuICAgICAgY29tcG9uZW50czogW25ldyBDb250YWluZXIoe1xuICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgdGhpcy50aHVtYm5haWwsXG4gICAgICAgICAgdGhpcy5tZXRhZGF0YVxuICAgICAgICBdLFxuICAgICAgICBjc3NDbGFzczogJ3NlZWtiYXItbGFiZWwtaW5uZXInLFxuICAgICAgfSldLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIHVpbWFuYWdlci5vblNlZWtQcmV2aWV3LnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzOiBTZWVrUHJldmlld0FyZ3MpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNMaXZlKCkpIHtcbiAgICAgICAgbGV0IHRpbWUgPSBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgLSBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgKiAoYXJncy5wb3NpdGlvbiAvIDEwMCk7XG4gICAgICAgIHRoaXMuc2V0VGltZSh0aW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwZXJjZW50YWdlID0gMDtcbiAgICAgICAgaWYgKGFyZ3MubWFya2VyKSB7XG4gICAgICAgICAgdGhpcy5zZXRUaXRsZVRleHQoYXJncy5tYXJrZXIudGl0bGUpO1xuICAgICAgICAgIHRoaXMuc2V0U21hc2hjdXREYXRhKGFyZ3MubWFya2VyKTtcbiAgICAgICAgICB0aGlzLnNldFRpbWUoYXJncy5tYXJrZXIudGltZSk7XG4gICAgICAgICAgdGhpcy5zZXRUaHVtYm5haWwobnVsbCk7XG4gICAgICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcmNlbnRhZ2UgPSBhcmdzLnBvc2l0aW9uO1xuICAgICAgICAgIHRoaXMuc2V0VGl0bGVUZXh0KG51bGwpO1xuICAgICAgICAgIHRoaXMuc2V0U21hc2hjdXREYXRhKG51bGwpO1xuICAgICAgICAgIGxldCB0aW1lID0gcGxheWVyLmdldER1cmF0aW9uKCkgKiAocGVyY2VudGFnZSAvIDEwMCk7XG4gICAgICAgICAgdGhpcy5zZXRUaW1lKHRpbWUpO1xuICAgICAgICAgIHRoaXMuc2V0VGh1bWJuYWlsKHBsYXllci5nZXRUaHVtYih0aW1lKSk7XG4gICAgICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGluaXQgPSAoKSA9PiB7XG4gICAgICAvLyBTZXQgdGltZSBmb3JtYXQgZGVwZW5kaW5nIG9uIHNvdXJjZSBkdXJhdGlvblxuICAgICAgdGhpcy50aW1lRm9ybWF0ID0gTWF0aC5hYnMocGxheWVyLmlzTGl2ZSgpID8gcGxheWVyLmdldE1heFRpbWVTaGlmdCgpIDogcGxheWVyLmdldER1cmF0aW9uKCkpID49IDM2MDAgP1xuICAgICAgICBTdHJpbmdVdGlscy5GT1JNQVRfSEhNTVNTIDogU3RyaW5nVXRpbHMuRk9STUFUX01NU1M7XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBpbml0KTtcbiAgICBpbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhcmJpdHJhcnkgdGV4dCBvbiB0aGUgbGFiZWwuXG4gICAqIEBwYXJhbSB0ZXh0IHRoZSB0ZXh0IHRvIHNob3cgb24gdGhlIGxhYmVsXG4gICAqL1xuICBzZXRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMudGltZUxhYmVsLnNldFRleHQodGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHRpbWUgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBsYWJlbC5cbiAgICogQHBhcmFtIHNlY29uZHMgdGhlIHRpbWUgaW4gc2Vjb25kcyB0byBkaXNwbGF5IG9uIHRoZSBsYWJlbFxuICAgKi9cbiAgc2V0VGltZShzZWNvbmRzOiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFRleHQoU3RyaW5nVXRpbHMuc2Vjb25kc1RvVGltZShzZWNvbmRzLCB0aGlzLnRpbWVGb3JtYXQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB0ZXh0IG9uIHRoZSB0aXRsZSBsYWJlbC5cbiAgICogQHBhcmFtIHRleHQgdGhlIHRleHQgdG8gc2hvdyBvbiB0aGUgbGFiZWxcbiAgICovXG4gIHNldFRpdGxlVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLnRpdGxlTGFiZWwuc2V0VGV4dCh0ZXh0KTtcbiAgfVxuXG4gIHNldFNtYXNoY3V0RGF0YShtYXJrZXI6IGFueSkge1xuICAgIGlmIChtYXJrZXIpIHtcbiAgICAgIHRoaXMuY29tbWVudExhYmVsLnNldFRleHQobWFya2VyLmNvbW1lbnQpO1xuICAgICAgdGhpcy5udW1iZXJMYWJlbC5zZXRUZXh0KG1hcmtlci5udW1iZXIpO1xuICAgICAgdGhpcy5hdmF0YXJMYWJlbC5zZXRUZXh0KG1hcmtlci5hdmF0YXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbW1lbnRMYWJlbC5zZXRUZXh0KG51bGwpO1xuICAgICAgdGhpcy5udW1iZXJMYWJlbC5zZXRUZXh0KG51bGwpO1xuICAgICAgdGhpcy5hdmF0YXJMYWJlbC5zZXRUZXh0KG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIG9yIHJlbW92ZXMgYSB0aHVtYm5haWwgb24gdGhlIGxhYmVsLlxuICAgKiBAcGFyYW0gdGh1bWJuYWlsIHRoZSB0aHVtYm5haWwgdG8gZGlzcGxheSBvbiB0aGUgbGFiZWwgb3IgbnVsbCB0byByZW1vdmUgYSBkaXNwbGF5ZWQgdGh1bWJuYWlsXG4gICAqL1xuICBzZXRUaHVtYm5haWwodGh1bWJuYWlsOiBiaXRtb3Zpbi5QbGF5ZXJBUEkuVGh1bWJuYWlsID0gbnVsbCkge1xuICAgIGxldCB0aHVtYm5haWxFbGVtZW50ID0gdGhpcy50aHVtYm5haWwuZ2V0RG9tRWxlbWVudCgpO1xuXG4gICAgaWYgKHRodW1ibmFpbCA9PSBudWxsKSB7XG4gICAgICB0aHVtYm5haWxFbGVtZW50LmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogbnVsbCxcbiAgICAgICAgJ2Rpc3BsYXknOiAnbnVsbCcsXG4gICAgICAgICd3aWR0aCc6ICdudWxsJyxcbiAgICAgICAgJ2hlaWdodCc6ICdudWxsJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGh1bWJuYWlsRWxlbWVudC5jc3Moe1xuICAgICAgICAnZGlzcGxheSc6ICdpbmhlcml0JyxcbiAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiBgdXJsKCR7dGh1bWJuYWlsLnVybH0pYCxcbiAgICAgICAgJ3dpZHRoJzogdGh1bWJuYWlsLncgKyAncHgnLFxuICAgICAgICAnaGVpZ2h0JzogdGh1bWJuYWlsLmggKyAncHgnLFxuICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbic6IGAtJHt0aHVtYm5haWwueH1weCAtJHt0aHVtYm5haWwueX1weGBcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldEJhY2tncm91bmQob25PZmY6IGJvb2xlYW4pIHtcbiAgICBsZXQgbWV0YWRhdGFFbGVtZW50ID0gdGhpcy5tZXRhZGF0YS5nZXREb21FbGVtZW50KCk7XG5cbiAgICBpZiAob25PZmYpIHtcbiAgICAgIG1ldGFkYXRhRWxlbWVudC5jc3Moe1xuICAgICAgICAnYmFja2dyb3VuZCc6ICcjMDAwJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbWV0YWRhdGFFbGVtZW50LmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kJzogJ2luaXRpYWwnXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge0xpc3RTZWxlY3RvciwgTGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcblxuLyoqXG4gKiBBIHNpbXBsZSBzZWxlY3QgYm94IHByb3ZpZGluZyB0aGUgcG9zc2liaWxpdHkgdG8gc2VsZWN0IGEgc2luZ2xlIGl0ZW0gb3V0IG9mIGEgbGlzdCBvZiBhdmFpbGFibGUgaXRlbXMuXG4gKlxuICogRE9NIGV4YW1wbGU6XG4gKiA8Y29kZT5cbiAqICAgICA8c2VsZWN0IGNsYXNzPSd1aS1zZWxlY3Rib3gnPlxuICogICAgICAgICA8b3B0aW9uIHZhbHVlPSdrZXknPmxhYmVsPC9vcHRpb24+XG4gKiAgICAgICAgIC4uLlxuICogICAgIDwvc2VsZWN0PlxuICogPC9jb2RlPlxuICovXG5leHBvcnQgY2xhc3MgU2VsZWN0Qm94IGV4dGVuZHMgTGlzdFNlbGVjdG9yPExpc3RTZWxlY3RvckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc2VsZWN0RWxlbWVudDogRE9NO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZWxlY3Rib3gnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGxldCBzZWxlY3RFbGVtZW50ID0gbmV3IERPTSgnc2VsZWN0Jywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZWxlY3RFbGVtZW50ID0gc2VsZWN0RWxlbWVudDtcbiAgICB0aGlzLnVwZGF0ZURvbUl0ZW1zKCk7XG5cbiAgICBzZWxlY3RFbGVtZW50Lm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSBzZWxlY3RFbGVtZW50LnZhbCgpO1xuICAgICAgdGhpcy5vbkl0ZW1TZWxlY3RlZEV2ZW50KHZhbHVlLCBmYWxzZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2VsZWN0RWxlbWVudDtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVEb21JdGVtcyhzZWxlY3RlZFZhbHVlOiBzdHJpbmcgPSBudWxsKSB7XG4gICAgLy8gRGVsZXRlIGFsbCBjaGlsZHJlblxuICAgIHRoaXMuc2VsZWN0RWxlbWVudC5lbXB0eSgpO1xuXG4gICAgLy8gQWRkIHVwZGF0ZWQgY2hpbGRyZW5cbiAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuaXRlbXMpIHtcbiAgICAgIGxldCBvcHRpb25FbGVtZW50ID0gbmV3IERPTSgnb3B0aW9uJywge1xuICAgICAgICAndmFsdWUnOiBpdGVtLmtleVxuICAgICAgfSkuaHRtbChpdGVtLmxhYmVsKTtcblxuICAgICAgaWYgKGl0ZW0ua2V5ID09PSBzZWxlY3RlZFZhbHVlICsgJycpIHsgLy8gY29udmVydCBzZWxlY3RlZFZhbHVlIHRvIHN0cmluZyB0byBjYXRjaCAnbnVsbCcvbnVsbCBjYXNlXG4gICAgICAgIG9wdGlvbkVsZW1lbnQuYXR0cignc2VsZWN0ZWQnLCAnc2VsZWN0ZWQnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWxlY3RFbGVtZW50LmFwcGVuZChvcHRpb25FbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtQWRkZWRFdmVudCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3VwZXIub25JdGVtQWRkZWRFdmVudCh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVEb21JdGVtcyh0aGlzLnNlbGVjdGVkSXRlbSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtUmVtb3ZlZEV2ZW50KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5vbkl0ZW1SZW1vdmVkRXZlbnQodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRG9tSXRlbXModGhpcy5zZWxlY3RlZEl0ZW0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uSXRlbVNlbGVjdGVkRXZlbnQodmFsdWU6IHN0cmluZywgdXBkYXRlRG9tSXRlbXM6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgc3VwZXIub25JdGVtU2VsZWN0ZWRFdmVudCh2YWx1ZSk7XG4gICAgaWYgKHVwZGF0ZURvbUl0ZW1zKSB7XG4gICAgICB0aGlzLnVwZGF0ZURvbUl0ZW1zKHZhbHVlKTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lckNvbmZpZywgQ29udGFpbmVyfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VmlkZW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL3ZpZGVvcXVhbGl0eXNlbGVjdGJveCc7XG5pbXBvcnQge0F1ZGlvUXVhbGl0eVNlbGVjdEJveH0gZnJvbSAnLi9hdWRpb3F1YWxpdHlzZWxlY3Rib3gnO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcbmltcG9ydCB7RXZlbnQsIEV2ZW50RGlzcGF0Y2hlciwgTm9BcmdzfSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBTZXR0aW5nc1BhbmVsfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5nc1BhbmVsQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIHNldHRpbmdzIHBhbmVsIHdpbGwgYmUgaGlkZGVuIHdoZW4gdGhlcmUgaXMgbm8gdXNlciBpbnRlcmFjdGlvbi5cbiAgICogU2V0IHRvIC0xIHRvIGRpc2FibGUgYXV0b21hdGljIGhpZGluZy5cbiAgICogRGVmYXVsdDogMyBzZWNvbmRzICgzMDAwKVxuICAgKi9cbiAgaGlkZURlbGF5PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEEgcGFuZWwgY29udGFpbmluZyBhIGxpc3Qgb2Yge0BsaW5rIFNldHRpbmdzUGFuZWxJdGVtIGl0ZW1zfSB0aGF0IHJlcHJlc2VudCBsYWJlbGxlZCBzZXR0aW5ncy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNldHRpbmdzUGFuZWwgZXh0ZW5kcyBDb250YWluZXI8U2V0dGluZ3NQYW5lbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENMQVNTX0xBU1QgPSAnbGFzdCc7XG5cbiAgcHJpdmF0ZSBzZXR0aW5nc1BhbmVsRXZlbnRzID0ge1xuICAgIG9uU2V0dGluZ3NTdGF0ZUNoYW5nZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8U2V0dGluZ3NQYW5lbCwgTm9BcmdzPigpXG4gIH07XG5cbiAgcHJpdmF0ZSBoaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFNldHRpbmdzUGFuZWxDb25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnPFNldHRpbmdzUGFuZWxDb25maWc+KGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZXR0aW5ncy1wYW5lbCcsXG4gICAgICBoaWRlRGVsYXk6IDMwMDBcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxTZXR0aW5nc1BhbmVsQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7IC8vIFRPRE8gZml4IGdlbmVyaWNzIHR5cGUgaW5mZXJlbmNlXG5cbiAgICBpZiAoY29uZmlnLmhpZGVEZWxheSA+IC0xKSB7XG4gICAgICB0aGlzLmhpZGVUaW1lb3V0ID0gbmV3IFRpbWVvdXQoY29uZmlnLmhpZGVEZWxheSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm9uU2hvdy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBBY3RpdmF0ZSB0aW1lb3V0IHdoZW4gc2hvd25cbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5zdGFydCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgLy8gT24gbW91c2UgZW50ZXIgY2xlYXIgdGhlIHRpbWVvdXRcbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5jbGVhcigpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgLy8gT24gbW91c2UgbGVhdmUgYWN0aXZhdGUgdGhlIHRpbWVvdXRcbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm9uSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBDbGVhciB0aW1lb3V0IHdoZW4gaGlkZGVuIGZyb20gb3V0c2lkZVxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBGaXJlIGV2ZW50IHdoZW4gdGhlIHN0YXRlIG9mIGEgc2V0dGluZ3MtaXRlbSBoYXMgY2hhbmdlZFxuICAgIGxldCBzZXR0aW5nc1N0YXRlQ2hhbmdlZEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLm9uU2V0dGluZ3NTdGF0ZUNoYW5nZWRFdmVudCgpO1xuXG4gICAgICAvLyBBdHRhY2ggbWFya2VyIGNsYXNzIHRvIGxhc3QgdmlzaWJsZSBpdGVtXG4gICAgICBsZXQgbGFzdFNob3duSXRlbSA9IG51bGw7XG4gICAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5nZXRJdGVtcygpKSB7XG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBTZXR0aW5nc1BhbmVsSXRlbSkge1xuICAgICAgICAgIGNvbXBvbmVudC5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoU2V0dGluZ3NQYW5lbC5DTEFTU19MQVNUKSk7XG4gICAgICAgICAgaWYgKGNvbXBvbmVudC5pc1Nob3duKCkpIHtcbiAgICAgICAgICAgIGxhc3RTaG93bkl0ZW0gPSBjb21wb25lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobGFzdFNob3duSXRlbSkge1xuICAgICAgICBsYXN0U2hvd25JdGVtLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhTZXR0aW5nc1BhbmVsLkNMQVNTX0xBU1QpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldEl0ZW1zKCkpIHtcbiAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBTZXR0aW5nc1BhbmVsSXRlbSkge1xuICAgICAgICBjb21wb25lbnQub25BY3RpdmVDaGFuZ2VkLnN1YnNjcmliZShzZXR0aW5nc1N0YXRlQ2hhbmdlZEhhbmRsZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIGlmICh0aGlzLmhpZGVUaW1lb3V0KSB7XG4gICAgICB0aGlzLmhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGVyZSBhcmUgYWN0aXZlIHNldHRpbmdzIHdpdGhpbiB0aGlzIHNldHRpbmdzIHBhbmVsLiBBbiBhY3RpdmUgc2V0dGluZyBpcyBhIHNldHRpbmcgdGhhdCBpcyB2aXNpYmxlXG4gICAqIGFuZCBlbmFibGVkLCB3aGljaCB0aGUgdXNlciBjYW4gaW50ZXJhY3Qgd2l0aC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgYXJlIGFjdGl2ZSBzZXR0aW5ncywgZmFsc2UgaWYgdGhlIHBhbmVsIGlzIGZ1bmN0aW9uYWxseSBlbXB0eSB0byBhIHVzZXJcbiAgICovXG4gIGhhc0FjdGl2ZVNldHRpbmdzKCk6IGJvb2xlYW4ge1xuICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldEl0ZW1zKCkpIHtcbiAgICAgIGlmIChjb21wb25lbnQuaXNBY3RpdmUoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGdldEl0ZW1zKCk6IFNldHRpbmdzUGFuZWxJdGVtW10ge1xuICAgIHJldHVybiA8U2V0dGluZ3NQYW5lbEl0ZW1bXT50aGlzLmNvbmZpZy5jb21wb25lbnRzO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uU2V0dGluZ3NTdGF0ZUNoYW5nZWRFdmVudCgpIHtcbiAgICB0aGlzLnNldHRpbmdzUGFuZWxFdmVudHMub25TZXR0aW5nc1N0YXRlQ2hhbmdlZC5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gb25lIG9yIG1vcmUge0BsaW5rIFNldHRpbmdzUGFuZWxJdGVtIGl0ZW1zfSBoYXZlIGNoYW5nZWQgc3RhdGUuXG4gICAqIEByZXR1cm5zIHtFdmVudDxTZXR0aW5nc1BhbmVsLCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uU2V0dGluZ3NTdGF0ZUNoYW5nZWQoKTogRXZlbnQ8U2V0dGluZ3NQYW5lbCwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NQYW5lbEV2ZW50cy5vblNldHRpbmdzU3RhdGVDaGFuZ2VkLmdldEV2ZW50KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBpdGVtIGZvciBhIHtAbGluayBTZXR0aW5nc1BhbmVsfSwgY29udGFpbmluZyBhIHtAbGluayBMYWJlbH0gYW5kIGEgY29tcG9uZW50IHRoYXQgY29uZmlndXJlcyBhIHNldHRpbmcuXG4gKiBTdXBwb3J0ZWQgc2V0dGluZyBjb21wb25lbnRzOiB7QGxpbmsgU2VsZWN0Qm94fVxuICovXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NQYW5lbEl0ZW0gZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBsYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIHNldHRpbmc6IFNlbGVjdEJveDtcblxuICBwcml2YXRlIHNldHRpbmdzUGFuZWxJdGVtRXZlbnRzID0ge1xuICAgIG9uQWN0aXZlQ2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZXR0aW5nc1BhbmVsSXRlbSwgTm9BcmdzPigpXG4gIH07XG5cbiAgY29uc3RydWN0b3IobGFiZWw6IHN0cmluZywgc2VsZWN0Qm94OiBTZWxlY3RCb3gsIGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5sYWJlbCA9IG5ldyBMYWJlbCh7IHRleHQ6IGxhYmVsIH0pO1xuICAgIHRoaXMuc2V0dGluZyA9IHNlbGVjdEJveDtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc2V0dGluZ3MtcGFuZWwtaXRlbScsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy5sYWJlbCwgdGhpcy5zZXR0aW5nXVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIGxldCBoYW5kbGVDb25maWdJdGVtQ2hhbmdlZCA9ICgpID0+IHtcbiAgICAgIC8vIFRoZSBtaW5pbXVtIG51bWJlciBvZiBpdGVtcyB0aGF0IG11c3QgYmUgYXZhaWxhYmxlIGZvciB0aGUgc2V0dGluZyB0byBiZSBkaXNwbGF5ZWRcbiAgICAgIC8vIEJ5IGRlZmF1bHQsIGF0IGxlYXN0IHR3byBpdGVtcyBtdXN0IGJlIGF2YWlsYWJsZSwgZWxzZSBhIHNlbGVjdGlvbiBpcyBub3QgcG9zc2libGVcbiAgICAgIGxldCBtaW5JdGVtc1RvRGlzcGxheSA9IDI7XG4gICAgICAvLyBBdWRpby92aWRlbyBxdWFsaXR5IHNlbGVjdCBib3hlcyBjb250YWluIGFuIGFkZGl0aW9uYWwgJ2F1dG8nIG1vZGUsIHdoaWNoIGluIGNvbWJpbmF0aW9uIHdpdGggYSBzaW5nbGVcbiAgICAgIC8vIGF2YWlsYWJsZSBxdWFsaXR5IGFsc28gZG9lcyBub3QgbWFrZSBzZW5zZVxuICAgICAgaWYgKHRoaXMuc2V0dGluZyBpbnN0YW5jZW9mIFZpZGVvUXVhbGl0eVNlbGVjdEJveCB8fCB0aGlzLnNldHRpbmcgaW5zdGFuY2VvZiBBdWRpb1F1YWxpdHlTZWxlY3RCb3gpIHtcbiAgICAgICAgbWluSXRlbXNUb0Rpc3BsYXkgPSAzO1xuICAgICAgfVxuXG4gICAgICAvLyBIaWRlIHRoZSBzZXR0aW5nIGlmIG5vIG1lYW5pbmdmdWwgY2hvaWNlIGlzIGF2YWlsYWJsZVxuICAgICAgaWYgKHRoaXMuc2V0dGluZy5pdGVtQ291bnQoKSA8IG1pbkl0ZW1zVG9EaXNwbGF5KSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFZpc2liaWxpdHkgbWlnaHQgaGF2ZSBjaGFuZ2VkIGFuZCB0aGVyZWZvcmUgdGhlIGFjdGl2ZSBzdGF0ZSBtaWdodCBoYXZlIGNoYW5nZWQgc28gd2UgZmlyZSB0aGUgZXZlbnRcbiAgICAgIC8vIFRPRE8gZmlyZSBvbmx5IHdoZW4gc3RhdGUgaGFzIHJlYWxseSBjaGFuZ2VkIChlLmcuIGNoZWNrIGlmIHZpc2liaWxpdHkgaGFzIHJlYWxseSBjaGFuZ2VkKVxuICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZWRFdmVudCgpO1xuICAgIH07XG5cbiAgICB0aGlzLnNldHRpbmcub25JdGVtQWRkZWQuc3Vic2NyaWJlKGhhbmRsZUNvbmZpZ0l0ZW1DaGFuZ2VkKTtcbiAgICB0aGlzLnNldHRpbmcub25JdGVtUmVtb3ZlZC5zdWJzY3JpYmUoaGFuZGxlQ29uZmlnSXRlbUNoYW5nZWQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBoaWRkZW4gc3RhdGVcbiAgICBoYW5kbGVDb25maWdJdGVtQ2hhbmdlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGlzIHNldHRpbmdzIHBhbmVsIGl0ZW0gaXMgYWN0aXZlLCBpLmUuIHZpc2libGUgYW5kIGVuYWJsZWQgYW5kIGEgdXNlciBjYW4gaW50ZXJhY3Qgd2l0aCBpdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHBhbmVsIGlzIGFjdGl2ZSwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaXNBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNTaG93bigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uQWN0aXZlQ2hhbmdlZEV2ZW50KCkge1xuICAgIHRoaXMuc2V0dGluZ3NQYW5lbEl0ZW1FdmVudHMub25BY3RpdmVDaGFuZ2VkLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgJ2FjdGl2ZScgc3RhdGUgb2YgdGhpcyBpdGVtIGNoYW5nZXMuXG4gICAqIEBzZWUgI2lzQWN0aXZlXG4gICAqIEByZXR1cm5zIHtFdmVudDxTZXR0aW5nc1BhbmVsSXRlbSwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvbkFjdGl2ZUNoYW5nZWQoKTogRXZlbnQ8U2V0dGluZ3NQYW5lbEl0ZW0sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzUGFuZWxJdGVtRXZlbnRzLm9uQWN0aXZlQ2hhbmdlZC5nZXRFdmVudCgpO1xuICB9XG59XG4iLCJpbXBvcnQge1RvZ2dsZUJ1dHRvbiwgVG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1NldHRpbmdzUGFuZWx9IGZyb20gJy4vc2V0dGluZ3NwYW5lbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIFNldHRpbmdzVG9nZ2xlQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5nc1RvZ2dsZUJ1dHRvbkNvbmZpZyBleHRlbmRzIFRvZ2dsZUJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgc2V0dGluZ3MgcGFuZWwgd2hvc2UgdmlzaWJpbGl0eSB0aGUgYnV0dG9uIHNob3VsZCB0b2dnbGUuXG4gICAqL1xuICBzZXR0aW5nc1BhbmVsOiBTZXR0aW5nc1BhbmVsO1xuXG4gIC8qKlxuICAgKiBEZWNpZGVzIGlmIHRoZSBidXR0b24gc2hvdWxkIGJlIGF1dG9tYXRpY2FsbHkgaGlkZGVuIHdoZW4gdGhlIHNldHRpbmdzIHBhbmVsIGRvZXMgbm90IGNvbnRhaW4gYW55IGFjdGl2ZSBzZXR0aW5ncy5cbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgYXV0b0hpZGVXaGVuTm9BY3RpdmVTZXR0aW5ncz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIHZpc2liaWxpdHkgb2YgYSBzZXR0aW5ncyBwYW5lbC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNldHRpbmdzVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZXR0aW5nc1RvZ2dsZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICBpZiAoIWNvbmZpZy5zZXR0aW5nc1BhbmVsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIFNldHRpbmdzUGFuZWwgaXMgbWlzc2luZycpO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc2V0dGluZ3N0b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ1NldHRpbmdzJyxcbiAgICAgIHNldHRpbmdzUGFuZWw6IG51bGwsXG4gICAgICBhdXRvSGlkZVdoZW5Ob0FjdGl2ZVNldHRpbmdzOiB0cnVlXG4gICAgfSwgPFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7IC8vIFRPRE8gZml4IGdlbmVyaWNzIHR5cGUgaW5mZXJlbmNlXG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBjb25maWcuc2V0dGluZ3NQYW5lbDtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgc2V0dGluZ3NQYW5lbC50b2dnbGVIaWRkZW4oKTtcbiAgICB9KTtcbiAgICBzZXR0aW5nc1BhbmVsLm9uU2hvdy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gU2V0IHRvZ2dsZSBzdGF0dXMgdG8gb24gd2hlbiB0aGUgc2V0dGluZ3MgcGFuZWwgc2hvd3NcbiAgICAgIHRoaXMub24oKTtcbiAgICB9KTtcbiAgICBzZXR0aW5nc1BhbmVsLm9uSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gU2V0IHRvZ2dsZSBzdGF0dXMgdG8gb2ZmIHdoZW4gdGhlIHNldHRpbmdzIHBhbmVsIGhpZGVzXG4gICAgICB0aGlzLm9mZigpO1xuICAgIH0pO1xuXG4gICAgLy8gSGFuZGxlIGF1dG9tYXRpYyBoaWRpbmcgb2YgdGhlIGJ1dHRvbiBpZiB0aGVyZSBhcmUgbm8gc2V0dGluZ3MgZm9yIHRoZSB1c2VyIHRvIGludGVyYWN0IHdpdGhcbiAgICBpZiAoY29uZmlnLmF1dG9IaWRlV2hlbk5vQWN0aXZlU2V0dGluZ3MpIHtcbiAgICAgIC8vIFNldHVwIGhhbmRsZXIgdG8gc2hvdy9oaWRlIGJ1dHRvbiB3aGVuIHRoZSBzZXR0aW5ncyBjaGFuZ2VcbiAgICAgIGxldCBzZXR0aW5nc1BhbmVsSXRlbXNDaGFuZ2VkSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgaWYgKHNldHRpbmdzUGFuZWwuaGFzQWN0aXZlU2V0dGluZ3MoKSkge1xuICAgICAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIC8vIFdpcmUgdGhlIGhhbmRsZXIgdG8gdGhlIGV2ZW50XG4gICAgICBzZXR0aW5nc1BhbmVsLm9uU2V0dGluZ3NTdGF0ZUNoYW5nZWQuc3Vic2NyaWJlKHNldHRpbmdzUGFuZWxJdGVtc0NoYW5nZWRIYW5kbGVyKTtcbiAgICAgIC8vIENhbGwgaGFuZGxlciBmb3IgZmlyc3QgaW5pdCBhdCBzdGFydHVwXG4gICAgICBzZXR0aW5nc1BhbmVsSXRlbXNDaGFuZ2VkSGFuZGxlcigpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcblxuLyoqXG4gKiBBIGR1bW15IGNvbXBvbmVudCB0aGF0IGp1c3QgcmVzZXJ2ZXMgc29tZSBzcGFjZSBhbmQgZG9lcyBub3RoaW5nIGVsc2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGFjZXIgZXh0ZW5kcyBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb21wb25lbnRDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNwYWNlcicsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cblxuICBwcm90ZWN0ZWQgb25TaG93RXZlbnQoKTogdm9pZCB7XG4gICAgLy8gZGlzYWJsZSBldmVudCBmaXJpbmcgYnkgb3ZlcndyaXRpbmcgYW5kIG5vdCBjYWxsaW5nIHN1cGVyXG4gIH1cblxuICBwcm90ZWN0ZWQgb25IaWRlRXZlbnQoKTogdm9pZCB7XG4gICAgLy8gZGlzYWJsZSBldmVudCBmaXJpbmcgYnkgb3ZlcndyaXRpbmcgYW5kIG5vdCBjYWxsaW5nIHN1cGVyXG4gIH1cblxuICBwcm90ZWN0ZWQgb25Ib3ZlckNoYW5nZWRFdmVudChob3ZlcmVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgLy8gZGlzYWJsZSBldmVudCBmaXJpbmcgYnkgb3ZlcndyaXRpbmcgYW5kIG5vdCBjYWxsaW5nIHN1cGVyXG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lciwgQ29udGFpbmVyQ29uZmlnfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IFN1YnRpdGxlQ3VlRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuU3VidGl0bGVDdWVFdmVudDtcbmltcG9ydCB7TGFiZWwsIExhYmVsQ29uZmlnfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7Q29tcG9uZW50Q29uZmlnLCBDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7Q29udHJvbEJhcn0gZnJvbSAnLi9jb250cm9sYmFyJztcblxuLyoqXG4gKiBPdmVybGF5cyB0aGUgcGxheWVyIHRvIGRpc3BsYXkgc3VidGl0bGVzLlxuICovXG5leHBvcnQgY2xhc3MgU3VidGl0bGVPdmVybGF5IGV4dGVuZHMgQ29udGFpbmVyPENvbnRhaW5lckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENMQVNTX0NPTlRST0xCQVJfVklTSUJMRSA9ICdjb250cm9sYmFyLXZpc2libGUnO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zdWJ0aXRsZS1vdmVybGF5JyxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IHN1YnRpdGxlTWFuYWdlciA9IG5ldyBBY3RpdmVTdWJ0aXRsZU1hbmFnZXIoKTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NVRV9FTlRFUiwgKGV2ZW50OiBTdWJ0aXRsZUN1ZUV2ZW50KSA9PiB7XG4gICAgICBsZXQgbGFiZWxUb0FkZCA9IHN1YnRpdGxlTWFuYWdlci5jdWVFbnRlcihldmVudCk7XG5cbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KGxhYmVsVG9BZGQpO1xuICAgICAgdGhpcy51cGRhdGVDb21wb25lbnRzKCk7XG5cbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NVRV9FWElULCAoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpID0+IHtcbiAgICAgIGxldCBsYWJlbFRvUmVtb3ZlID0gc3VidGl0bGVNYW5hZ2VyLmN1ZUV4aXQoZXZlbnQpO1xuXG4gICAgICBpZiAobGFiZWxUb1JlbW92ZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudChsYWJlbFRvUmVtb3ZlKTtcbiAgICAgICAgdGhpcy51cGRhdGVDb21wb25lbnRzKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghc3VidGl0bGVNYW5hZ2VyLmhhc0N1ZXMpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgc3VidGl0bGVDbGVhckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIHN1YnRpdGxlTWFuYWdlci5jbGVhcigpO1xuICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnRzKCk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fQ0hBTkdFRCwgc3VidGl0bGVDbGVhckhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NVQlRJVExFX0NIQU5HRUQsIHN1YnRpdGxlQ2xlYXJIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TRUVLLCBzdWJ0aXRsZUNsZWFySGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVCwgc3VidGl0bGVDbGVhckhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlCQUNLX0ZJTklTSEVELCBzdWJ0aXRsZUNsZWFySGFuZGxlcik7XG5cbiAgICB1aW1hbmFnZXIub25Db21wb25lbnRTaG93LnN1YnNjcmliZSgoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPikgPT4ge1xuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbnRyb2xCYXIpIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoU3VidGl0bGVPdmVybGF5LkNMQVNTX0NPTlRST0xCQVJfVklTSUJMRSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudEhpZGUuc3Vic2NyaWJlKChjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSA9PiB7XG4gICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29udHJvbEJhcikge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhTdWJ0aXRsZU92ZXJsYXkuQ0xBU1NfQ09OVFJPTEJBUl9WSVNJQkxFKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBJbml0XG4gICAgc3VidGl0bGVDbGVhckhhbmRsZXIoKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgQWN0aXZlU3VidGl0bGVDdWUge1xuICBldmVudDogU3VidGl0bGVDdWVFdmVudDtcbiAgbGFiZWw6IFN1YnRpdGxlTGFiZWw7XG59XG5cbmludGVyZmFjZSBBY3RpdmVTdWJ0aXRsZUN1ZU1hcCB7XG4gIFtpZDogc3RyaW5nXTogQWN0aXZlU3VidGl0bGVDdWU7XG59XG5cbmNsYXNzIFN1YnRpdGxlTGFiZWwgZXh0ZW5kcyBMYWJlbDxMYWJlbENvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXN1YnRpdGxlLWxhYmVsJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxufVxuXG5jbGFzcyBBY3RpdmVTdWJ0aXRsZU1hbmFnZXIge1xuXG4gIHByaXZhdGUgYWN0aXZlU3VidGl0bGVDdWVNYXA6IEFjdGl2ZVN1YnRpdGxlQ3VlTWFwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlU3VidGl0bGVDdWVNYXAgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGEgdW5pcXVlIElEIGZvciBhIHN1YnRpdGxlIGN1ZSwgd2hpY2ggaXMgbmVlZGVkIHRvIGFzc29jaWF0ZSBhbiBPTl9DVUVfRU5URVIgd2l0aCBpdHMgT05fQ1VFX0VYSVRcbiAgICogZXZlbnQgc28gd2UgY2FuIHJlbW92ZSB0aGUgY29ycmVjdCBzdWJ0aXRsZSBpbiBPTl9DVUVfRVhJVCB3aGVuIG11bHRpcGxlIHN1YnRpdGxlcyBhcmUgYWN0aXZlIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqIFRoZSBzdGFydCB0aW1lIHBsdXMgdGhlIHRleHQgc2hvdWxkIG1ha2UgYSB1bmlxdWUgaWRlbnRpZmllciwgYW5kIGluIHRoZSBvbmx5IGNhc2Ugd2hlcmUgYSBjb2xsaXNpb25cbiAgICogY2FuIGhhcHBlbiwgdHdvIHNpbWlsYXIgdGV4dHMgd2lsbCBkaXNwbGF5ZWQgYXQgYSBzaW1pbGFyIHRpbWUgc28gaXQgZG9lcyBub3QgbWF0dGVyIHdoaWNoIG9uZSB3ZSBkZWxldGUuXG4gICAqIFRoZSBzdGFydCB0aW1lIHNob3VsZCBhbHdheXMgYmUga25vd24sIGJlY2F1c2UgaXQgaXMgcmVxdWlyZWQgdG8gc2NoZWR1bGUgdGhlIE9OX0NVRV9FTlRFUiBldmVudC4gVGhlIGVuZCB0aW1lXG4gICAqIG11c3Qgbm90IG5lY2Vzc2FyaWx5IGJlIGtub3duIGFuZCB0aGVyZWZvcmUgY2Fubm90IGJlIHVzZWQgZm9yIHRoZSBJRC5cbiAgICogQHBhcmFtIGV2ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZUlkKGV2ZW50OiBTdWJ0aXRsZUN1ZUV2ZW50KTogc3RyaW5nIHtcbiAgICByZXR1cm4gZXZlbnQuc3RhcnQgKyBldmVudC50ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdWJ0aXRsZSBjdWUgdG8gdGhlIG1hbmFnZXIgYW5kIHJldHVybnMgdGhlIGxhYmVsIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBzdWJ0aXRsZSBvdmVybGF5LlxuICAgKiBAcGFyYW0gZXZlbnRcbiAgICogQHJldHVybiB7U3VidGl0bGVMYWJlbH1cbiAgICovXG4gIGN1ZUVudGVyKGV2ZW50OiBTdWJ0aXRsZUN1ZUV2ZW50KTogU3VidGl0bGVMYWJlbCB7XG4gICAgbGV0IGlkID0gQWN0aXZlU3VidGl0bGVNYW5hZ2VyLmNhbGN1bGF0ZUlkKGV2ZW50KTtcblxuICAgIGxldCBsYWJlbCA9IG5ldyBTdWJ0aXRsZUxhYmVsKHtcbiAgICAgIC8vIFByZWZlciB0aGUgSFRNTCBzdWJ0aXRsZSB0ZXh0IGlmIHNldCwgZWxzZSB1c2UgdGhlIHBsYWluIHRleHRcbiAgICAgIHRleHQ6IGV2ZW50Lmh0bWwgfHwgZXZlbnQudGV4dFxuICAgIH0pO1xuXG4gICAgdGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcFtpZF0gPSB7IGV2ZW50LCBsYWJlbCB9O1xuXG4gICAgcmV0dXJuIGxhYmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHN1YnRpdGxlIGN1ZSBmcm9tIHRoZSBtYW5hZ2VyIGFuZCByZXR1cm5zIHRoZSBsYWJlbCB0aGF0IHNob3VsZCBiZSByZW1vdmVkIGZyb20gdGhlIHN1YnRpdGxlIG92ZXJsYXksXG4gICAqIG9yIG51bGwgaWYgdGhlcmUgaXMgbm8gYXNzb2NpYXRlZCBsYWJlbCBleGlzdGluZyAoZS5nLiBiZWNhdXNlIGFsbCBsYWJlbHMgaGF2ZSBiZWVuIHtAbGluayAjY2xlYXIgY2xlYXJlZH0uXG4gICAqIEBwYXJhbSBldmVudFxuICAgKiBAcmV0dXJuIHtTdWJ0aXRsZUxhYmVsfG51bGx9XG4gICAqL1xuICBjdWVFeGl0KGV2ZW50OiBTdWJ0aXRsZUN1ZUV2ZW50KTogU3VidGl0bGVMYWJlbCB7XG4gICAgbGV0IGlkID0gQWN0aXZlU3VidGl0bGVNYW5hZ2VyLmNhbGN1bGF0ZUlkKGV2ZW50KTtcbiAgICBsZXQgYWN0aXZlU3VidGl0bGVDdWUgPSB0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwW2lkXTtcblxuICAgIGlmIChhY3RpdmVTdWJ0aXRsZUN1ZSkge1xuICAgICAgZGVsZXRlIHRoaXMuYWN0aXZlU3VidGl0bGVDdWVNYXBbaWRdO1xuICAgICAgcmV0dXJuIGFjdGl2ZVN1YnRpdGxlQ3VlLmxhYmVsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGFjdGl2ZSBzdWJ0aXRsZSBjdWVzLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBnZXQgY3VlQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcCkubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGVyZSBhcmUgYWN0aXZlIHN1YnRpdGxlIGN1ZXMsIGVsc2UgZmFsc2UuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgaGFzQ3VlcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdWVDb3VudCA+IDA7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgc3VidGl0bGUgY3VlcyBmcm9tIHRoZSBtYW5hZ2VyLlxuICAgKi9cbiAgY2xlYXIoKTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcCA9IHt9O1xuICB9XG59IiwiaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vc2VsZWN0Ym94JztcbmltcG9ydCB7TGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IFN1YnRpdGxlQWRkZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5TdWJ0aXRsZUFkZGVkRXZlbnQ7XG5pbXBvcnQgU3VidGl0bGVDaGFuZ2VkRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuU3VidGl0bGVDaGFuZ2VkRXZlbnQ7XG5pbXBvcnQgU3VidGl0bGVSZW1vdmVkRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuU3VidGl0bGVSZW1vdmVkRXZlbnQ7XG5cbi8qKlxuICogQSBzZWxlY3QgYm94IHByb3ZpZGluZyBhIHNlbGVjdGlvbiBiZXR3ZWVuIGF2YWlsYWJsZSBzdWJ0aXRsZSBhbmQgY2FwdGlvbiB0cmFja3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJ0aXRsZVNlbGVjdEJveCBleHRlbmRzIFNlbGVjdEJveCB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMaXN0U2VsZWN0b3JDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGdldExhYmVsID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICAgIHN3aXRjaCAoaWQpIHtcbiAgICAgICAgY2FzZSAnb2ZmJyA6XG4gICAgICAgICAgcmV0dXJuICdPZmYnXG4gICAgICAgIGNhc2UgJ2VuJyA6XG4gICAgICAgICAgcmV0dXJuICdFbmdsaXNoJ1xuICAgICAgICBjYXNlICdmcicgOlxuICAgICAgICAgIHJldHVybiAnRnJhbmNhaXMnXG4gICAgICAgIGNhc2UgJ2RlJyA6XG4gICAgICAgICAgcmV0dXJuICdEZXV0c2NoJ1xuICAgICAgICBjYXNlICdlcycgOlxuICAgICAgICAgIHJldHVybiAnRXNwYW5pb2wnXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIGlkXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHVwZGF0ZVN1YnRpdGxlcyA9ICgpID0+IHtcbiAgICAgIHRoaXMuY2xlYXJJdGVtcygpO1xuXG4gICAgICBmb3IgKGxldCBzdWJ0aXRsZSBvZiBwbGF5ZXIuZ2V0QXZhaWxhYmxlU3VidGl0bGVzKCkpIHtcbiAgICAgICAgdGhpcy5hZGRJdGVtKHN1YnRpdGxlLmlkLCBnZXRMYWJlbChzdWJ0aXRsZS5sYWJlbCkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uSXRlbVNlbGVjdGVkLnN1YnNjcmliZSgoc2VuZGVyOiBTdWJ0aXRsZVNlbGVjdEJveCwgdmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgcGxheWVyLnNldFN1YnRpdGxlKHZhbHVlID09PSAnbnVsbCcgPyBudWxsIDogdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVhY3QgdG8gQVBJIGV2ZW50c1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NVQlRJVExFX0FEREVELCAoZXZlbnQ6IFN1YnRpdGxlQWRkZWRFdmVudCkgPT4ge1xuICAgICAgdGhpcy5hZGRJdGVtKGV2ZW50LnN1YnRpdGxlLmlkLCBldmVudC5zdWJ0aXRsZS5sYWJlbCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1VCVElUTEVfQ0hBTkdFRCwgKGV2ZW50OiBTdWJ0aXRsZUNoYW5nZWRFdmVudCkgPT4ge1xuICAgICAgdGhpcy5zZWxlY3RJdGVtKGV2ZW50LnRhcmdldFN1YnRpdGxlLmlkKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TVUJUSVRMRV9SRU1PVkVELCAoZXZlbnQ6IFN1YnRpdGxlUmVtb3ZlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZUl0ZW0oZXZlbnQuc3VidGl0bGVJZCk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgc3VidGl0bGVzIHdoZW4gc291cmNlIGdvZXMgYXdheVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgdXBkYXRlU3VidGl0bGVzKTtcbiAgICAvLyBVcGRhdGUgc3VidGl0bGVzIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB1cGRhdGVTdWJ0aXRsZXMpO1xuXG4gICAgLy8gUG9wdWxhdGUgc3VidGl0bGVzIGF0IHN0YXJ0dXBcbiAgICB1cGRhdGVTdWJ0aXRsZXMoKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge01ldGFkYXRhTGFiZWwsIE1ldGFkYXRhTGFiZWxDb250ZW50fSBmcm9tICcuL21ldGFkYXRhbGFiZWwnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBUaXRsZUJhcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGl0bGVCYXJDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogU3BlY2lmaWVzIGlmIHRoZSB0aXRsZSBiYXIgc2hvdWxkIHN0YXkgaGlkZGVuIHdoZW4gbm8gbWV0YWRhdGEgbGFiZWwgY29udGFpbnMgYW55IHRleHQuIERvZXMgbm90IG1ha2UgYSBsb3RcbiAgICogb2Ygc2Vuc2UgaWYgdGhlIHRpdGxlIGJhciBjb250YWlucyBvdGhlciBjb21wb25lbnRzIHRoYW4ganVzdCBNZXRhZGF0YUxhYmVscyAobGlrZSBpbiB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uKS5cbiAgICogRGVmYXVsdDogZmFsc2VcbiAgICovXG4gIGtlZXBIaWRkZW5XaXRob3V0TWV0YWRhdGE/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIERpc3BsYXlzIGEgdGl0bGUgYmFyIGNvbnRhaW5pbmcgYSBsYWJlbCB3aXRoIHRoZSB0aXRsZSBvZiB0aGUgdmlkZW8uXG4gKi9cbmV4cG9ydCBjbGFzcyBUaXRsZUJhciBleHRlbmRzIENvbnRhaW5lcjxUaXRsZUJhckNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVGl0bGVCYXJDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXRpdGxlYmFyJyxcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IE1ldGFkYXRhTGFiZWwoeyBjb250ZW50OiBNZXRhZGF0YUxhYmVsQ29udGVudC5UaXRsZSB9KSxcbiAgICAgICAgbmV3IE1ldGFkYXRhTGFiZWwoeyBjb250ZW50OiBNZXRhZGF0YUxhYmVsQ29udGVudC5EZXNjcmlwdGlvbiB9KVxuICAgICAgXSxcbiAgICAgIGtlZXBIaWRkZW5XaXRob3V0TWV0YWRhdGE6IGZhbHNlLFxuICAgIH0sIDxUaXRsZUJhckNvbmZpZz50aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxUaXRsZUJhckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuICAgIGxldCBzaG91bGRCZVNob3duID0gIXRoaXMuaXNIaWRkZW4oKTtcbiAgICBsZXQgaGFzTWV0YWRhdGFUZXh0ID0gdHJ1ZTsgLy8gRmxhZyB0byB0cmFjayBpZiBhbnkgbWV0YWRhdGEgbGFiZWwgY29udGFpbnMgdGV4dFxuXG4gICAgbGV0IGNoZWNrTWV0YWRhdGFUZXh0QW5kVXBkYXRlVmlzaWJpbGl0eSA9ICgpID0+IHtcbiAgICAgIGhhc01ldGFkYXRhVGV4dCA9IGZhbHNlO1xuXG4gICAgICAvLyBJdGVyYXRlIHRocm91Z2ggbWV0YWRhdGEgbGFiZWxzIGFuZCBjaGVjayBpZiBhdCBsZWFzdCBvbmUgb2YgdGhlbSBjb250YWlucyB0ZXh0XG4gICAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5nZXRDb21wb25lbnRzKCkpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE1ldGFkYXRhTGFiZWwpIHtcbiAgICAgICAgICBpZiAoIWNvbXBvbmVudC5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgIGhhc01ldGFkYXRhVGV4dCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaXNTaG93bigpKSB7XG4gICAgICAgIC8vIEhpZGUgYSB2aXNpYmxlIHRpdGxlYmFyIGlmIGl0IGRvZXMgbm90IGNvbnRhaW4gYW55IHRleHQgYW5kIHRoZSBoaWRkZW4gZmxhZyBpcyBzZXRcbiAgICAgICAgaWYgKGNvbmZpZy5rZWVwSGlkZGVuV2l0aG91dE1ldGFkYXRhICYmICFoYXNNZXRhZGF0YVRleHQpIHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzaG91bGRCZVNob3duKSB7XG4gICAgICAgIC8vIFNob3cgYSBoaWRkZW4gdGl0bGViYXIgaWYgaXQgc2hvdWxkIGFjdHVhbGx5IGJlIHNob3duXG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBMaXN0ZW4gdG8gdGV4dCBjaGFuZ2UgZXZlbnRzIHRvIHVwZGF0ZSB0aGUgaGFzTWV0YWRhdGFUZXh0IGZsYWcgd2hlbiB0aGUgbWV0YWRhdGEgZHluYW1pY2FsbHkgY2hhbmdlc1xuICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldENvbXBvbmVudHMoKSkge1xuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIE1ldGFkYXRhTGFiZWwpIHtcbiAgICAgICAgY29tcG9uZW50Lm9uVGV4dENoYW5nZWQuc3Vic2NyaWJlKGNoZWNrTWV0YWRhdGFUZXh0QW5kVXBkYXRlVmlzaWJpbGl0eSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNTaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzaG91bGRCZVNob3duID0gdHJ1ZTtcbiAgICAgIGlmICghKGNvbmZpZy5rZWVwSGlkZGVuV2l0aG91dE1ldGFkYXRhICYmICFoYXNNZXRhZGF0YVRleHQpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgc2hvdWxkQmVTaG93biA9IGZhbHNlO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBpbml0XG4gICAgY2hlY2tNZXRhZGF0YVRleHRBbmRVcGRhdGVWaXNpYmlsaXR5KCk7XG4gIH1cbn0iLCJpbXBvcnQge0J1dHRvbiwgQnV0dG9uQ29uZmlnfSBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQge05vQXJncywgRXZlbnREaXNwYXRjaGVyLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB0b2dnbGUgYnV0dG9uIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUb2dnbGVCdXR0b25Db25maWcgZXh0ZW5kcyBCdXR0b25Db25maWcge1xuICAvKipcbiAgICogVGhlIHRleHQgb24gdGhlIGJ1dHRvbi5cbiAgICovXG4gIHRleHQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCBjYW4gYmUgdG9nZ2xlZCBiZXR3ZWVuICdvbicgYW5kICdvZmYnIHN0YXRlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRvZ2dsZUJ1dHRvbjxDb25maWcgZXh0ZW5kcyBUb2dnbGVCdXR0b25Db25maWc+IGV4dGVuZHMgQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENMQVNTX09OID0gJ29uJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfT0ZGID0gJ29mZic7XG5cbiAgcHJpdmF0ZSBvblN0YXRlOiBib29sZWFuO1xuXG4gIHByaXZhdGUgdG9nZ2xlQnV0dG9uRXZlbnRzID0ge1xuICAgIG9uVG9nZ2xlOiBuZXcgRXZlbnREaXNwYXRjaGVyPFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25Ub2dnbGVPbjogbmV3IEV2ZW50RGlzcGF0Y2hlcjxUb2dnbGVCdXR0b248Q29uZmlnPiwgTm9BcmdzPigpLFxuICAgIG9uVG9nZ2xlT2ZmOiBuZXcgRXZlbnREaXNwYXRjaGVyPFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+KClcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXRvZ2dsZWJ1dHRvbidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgYnV0dG9uIHRvIHRoZSAnb24nIHN0YXRlLlxuICAgKi9cbiAgb24oKSB7XG4gICAgaWYgKHRoaXMuaXNPZmYoKSkge1xuICAgICAgdGhpcy5vblN0YXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFRvZ2dsZUJ1dHRvbi5DTEFTU19PRkYpKTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFRvZ2dsZUJ1dHRvbi5DTEFTU19PTikpO1xuXG4gICAgICB0aGlzLm9uVG9nZ2xlRXZlbnQoKTtcbiAgICAgIHRoaXMub25Ub2dnbGVPbkV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGJ1dHRvbiB0byB0aGUgJ29mZicgc3RhdGUuXG4gICAqL1xuICBvZmYoKSB7XG4gICAgaWYgKHRoaXMuaXNPbigpKSB7XG4gICAgICB0aGlzLm9uU3RhdGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFRvZ2dsZUJ1dHRvbi5DTEFTU19PTikpO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVG9nZ2xlQnV0dG9uLkNMQVNTX09GRikpO1xuXG4gICAgICB0aGlzLm9uVG9nZ2xlRXZlbnQoKTtcbiAgICAgIHRoaXMub25Ub2dnbGVPZmZFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIGJ1dHRvbiAnb24nIGlmIGl0IGlzICdvZmYnLCBvciAnb2ZmJyBpZiBpdCBpcyAnb24nLlxuICAgKi9cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLmlzT24oKSkge1xuICAgICAgdGhpcy5vZmYoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHRvZ2dsZSBidXR0b24gaXMgaW4gdGhlICdvbicgc3RhdGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGJ1dHRvbiBpcyAnb24nLCBmYWxzZSBpZiAnb2ZmJ1xuICAgKi9cbiAgaXNPbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vblN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgdG9nZ2xlIGJ1dHRvbiBpcyBpbiB0aGUgJ29mZicgc3RhdGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGJ1dHRvbiBpcyAnb2ZmJywgZmFsc2UgaWYgJ29uJ1xuICAgKi9cbiAgaXNPZmYoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzT24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNsaWNrRXZlbnQoKSB7XG4gICAgc3VwZXIub25DbGlja0V2ZW50KCk7XG5cbiAgICAvLyBGaXJlIHRoZSB0b2dnbGUgZXZlbnQgdG9nZXRoZXIgd2l0aCB0aGUgY2xpY2sgZXZlbnRcbiAgICAvLyAodGhleSBhcmUgdGVjaG5pY2FsbHkgdGhlIHNhbWUsIG9ubHkgdGhlIHNlbWFudGljcyBhcmUgZGlmZmVyZW50KVxuICAgIHRoaXMub25Ub2dnbGVFdmVudCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uVG9nZ2xlRXZlbnQoKSB7XG4gICAgdGhpcy50b2dnbGVCdXR0b25FdmVudHMub25Ub2dnbGUuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Ub2dnbGVPbkV2ZW50KCkge1xuICAgIHRoaXMudG9nZ2xlQnV0dG9uRXZlbnRzLm9uVG9nZ2xlT24uZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Ub2dnbGVPZmZFdmVudCgpIHtcbiAgICB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZU9mZi5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGJ1dHRvbiBpcyB0b2dnbGVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25Ub2dnbGUoKTogRXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZS5nZXRFdmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgYnV0dG9uIGlzIHRvZ2dsZWQgJ29uJy5cbiAgICogQHJldHVybnMge0V2ZW50PFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uVG9nZ2xlT24oKTogRXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZU9uLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBidXR0b24gaXMgdG9nZ2xlZCAnb2ZmJy5cbiAgICogQHJldHVybnMge0V2ZW50PFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uVG9nZ2xlT2ZmKCk6IEV2ZW50PFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGVCdXR0b25FdmVudHMub25Ub2dnbGVPZmYuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuXG4vKipcbiAqIEFuaW1hdGVkIGFuYWxvZyBUViBzdGF0aWMgbm9pc2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBUdk5vaXNlQ2FudmFzIGV4dGVuZHMgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4ge1xuXG4gIHByaXZhdGUgY2FudmFzOiBET007XG5cbiAgcHJpdmF0ZSBjYW52YXNFbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgcHJpdmF0ZSBjYW52YXNDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHByaXZhdGUgY2FudmFzV2lkdGggPSAxNjA7XG4gIHByaXZhdGUgY2FudmFzSGVpZ2h0ID0gOTA7XG4gIHByaXZhdGUgaW50ZXJmZXJlbmNlSGVpZ2h0ID0gNTA7XG4gIHByaXZhdGUgbGFzdEZyYW1lVXBkYXRlOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGZyYW1lSW50ZXJ2YWw6IG51bWJlciA9IDYwO1xuICBwcml2YXRlIHVzZUFuaW1hdGlvbkZyYW1lOiBib29sZWFuID0gISF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICBwcml2YXRlIG5vaXNlQW5pbWF0aW9uV2luZG93UG9zOiBudW1iZXI7XG4gIHByaXZhdGUgZnJhbWVVcGRhdGVIYW5kbGVySWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbXBvbmVudENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdHZub2lzZWNhbnZhcydcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgcmV0dXJuIHRoaXMuY2FudmFzID0gbmV3IERPTSgnY2FudmFzJywgeyAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKSB9KTtcbiAgfVxuXG4gIHN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD50aGlzLmNhbnZhcy5nZXRFbGVtZW50cygpWzBdO1xuICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IHRoaXMuY2FudmFzRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgPSAtdGhpcy5jYW52YXNIZWlnaHQ7XG4gICAgdGhpcy5sYXN0RnJhbWVVcGRhdGUgPSAwO1xuXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICB0aGlzLnJlbmRlckZyYW1lKCk7XG4gIH1cblxuICBzdG9wKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnVzZUFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmZyYW1lVXBkYXRlSGFuZGxlcklkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZnJhbWVVcGRhdGVIYW5kbGVySWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRnJhbWUoKTogdm9pZCB7XG4gICAgLy8gVGhpcyBjb2RlIGhhcyBiZWVuIGNvcGllZCBmcm9tIHRoZSBwbGF5ZXIgY29udHJvbHMuanMgYW5kIHNpbXBsaWZpZWRcblxuICAgIGlmICh0aGlzLmxhc3RGcmFtZVVwZGF0ZSArIHRoaXMuZnJhbWVJbnRlcnZhbCA+IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAvLyBJdCdzIHRvbyBlYXJseSB0byByZW5kZXIgdGhlIG5leHQgZnJhbWVcbiAgICAgIHRoaXMuc2NoZWR1bGVOZXh0UmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGN1cnJlbnRQaXhlbE9mZnNldDtcbiAgICBsZXQgY2FudmFzV2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGxldCBjYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIC8vIENyZWF0ZSB0ZXh0dXJlXG4gICAgbGV0IG5vaXNlSW1hZ2UgPSB0aGlzLmNhbnZhc0NvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuXG4gICAgLy8gRmlsbCB0ZXh0dXJlIHdpdGggbm9pc2VcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGNhbnZhc0hlaWdodDsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNhbnZhc1dpZHRoOyB4KyspIHtcbiAgICAgICAgY3VycmVudFBpeGVsT2Zmc2V0ID0gKGNhbnZhc1dpZHRoICogeSAqIDQpICsgeCAqIDQ7XG4gICAgICAgIG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXRdID0gTWF0aC5yYW5kb20oKSAqIDI1NTtcbiAgICAgICAgaWYgKHkgPCB0aGlzLm5vaXNlQW5pbWF0aW9uV2luZG93UG9zIHx8IHkgPiB0aGlzLm5vaXNlQW5pbWF0aW9uV2luZG93UG9zICsgdGhpcy5pbnRlcmZlcmVuY2VIZWlnaHQpIHtcbiAgICAgICAgICBub2lzZUltYWdlLmRhdGFbY3VycmVudFBpeGVsT2Zmc2V0XSAqPSAwLjg1O1xuICAgICAgICB9XG4gICAgICAgIG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXQgKyAxXSA9IG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXRdO1xuICAgICAgICBub2lzZUltYWdlLmRhdGFbY3VycmVudFBpeGVsT2Zmc2V0ICsgMl0gPSBub2lzZUltYWdlLmRhdGFbY3VycmVudFBpeGVsT2Zmc2V0XTtcbiAgICAgICAgbm9pc2VJbWFnZS5kYXRhW2N1cnJlbnRQaXhlbE9mZnNldCArIDNdID0gNTA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUHV0IHRleHR1cmUgb250byBjYW52YXNcbiAgICB0aGlzLmNhbnZhc0NvbnRleHQucHV0SW1hZ2VEYXRhKG5vaXNlSW1hZ2UsIDAsIDApO1xuXG4gICAgdGhpcy5sYXN0RnJhbWVVcGRhdGUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLm5vaXNlQW5pbWF0aW9uV2luZG93UG9zICs9IDc7XG4gICAgaWYgKHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgPiBjYW52YXNIZWlnaHQpIHtcbiAgICAgIHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgPSAtY2FudmFzSGVpZ2h0O1xuICAgIH1cblxuICAgIHRoaXMuc2NoZWR1bGVOZXh0UmVuZGVyKCk7XG4gIH1cblxuICBwcml2YXRlIHNjaGVkdWxlTmV4dFJlbmRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy51c2VBbmltYXRpb25GcmFtZSkge1xuICAgICAgdGhpcy5mcmFtZVVwZGF0ZUhhbmRsZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXJGcmFtZS5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mcmFtZVVwZGF0ZUhhbmRsZXJJZCA9IHNldFRpbWVvdXQodGhpcy5yZW5kZXJGcmFtZS5iaW5kKHRoaXMpLCB0aGlzLmZyYW1lSW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5pbXBvcnQge1BsYXllclV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgUGxheWVyUmVzaXplRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyUmVzaXplRXZlbnQ7XG5pbXBvcnQge0NhbmNlbEV2ZW50QXJnc30gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgVUlDb250YWluZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVJQ29udGFpbmVyQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIGNvbnRyb2wgYmFyIHdpbGwgYmUgaGlkZGVuIHdoZW4gdGhlcmUgaXMgbm8gdXNlciBpbnRlcmFjdGlvbi5cbiAgICogRGVmYXVsdDogNSBzZWNvbmRzICg1MDAwKVxuICAgKi9cbiAgaGlkZURlbGF5PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIGFsbCBvZiB0aGUgVUkuIFRoZSBVSUNvbnRhaW5lciBpcyBwYXNzZWQgdG8gdGhlIHtAbGluayBVSU1hbmFnZXJ9IHRvIGJ1aWxkIGFuZFxuICogc2V0dXAgdGhlIFVJLlxuICovXG5leHBvcnQgY2xhc3MgVUlDb250YWluZXIgZXh0ZW5kcyBDb250YWluZXI8VUlDb250YWluZXJDb25maWc+IHtcblxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTVEFURV9QUkVGSVggPSAncGxheWVyLXN0YXRlLSc7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRlVMTFNDUkVFTiA9ICdmdWxsc2NyZWVuJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQlVGRkVSSU5HID0gJ2J1ZmZlcmluZyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFJFTU9URV9DT05UUk9MID0gJ3JlbW90ZS1jb250cm9sJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ09OVFJPTFNfU0hPV04gPSAnY29udHJvbHMtc2hvd24nO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT05UUk9MU19ISURERU4gPSAnY29udHJvbHMtaGlkZGVuJztcblxuICBwcml2YXRlIHVpSGlkZVRpbWVvdXQ6IFRpbWVvdXQ7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBVSUNvbnRhaW5lckNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCA8VUlDb250YWluZXJDb25maWc+e1xuICAgICAgY3NzQ2xhc3M6ICd1aS11aWNvbnRhaW5lcicsXG4gICAgICBoaWRlRGVsYXk6IDUwMDAsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIHRoaXMuY29uZmlndXJlVUlTaG93SGlkZShwbGF5ZXIsIHVpbWFuYWdlcik7XG4gICAgdGhpcy5jb25maWd1cmVQbGF5ZXJTdGF0ZXMocGxheWVyLCB1aW1hbmFnZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVVSVNob3dIaWRlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgbGV0IGNvbnRhaW5lciA9IHRoaXMuZ2V0RG9tRWxlbWVudCgpO1xuICAgIGxldCBjb25maWcgPSA8VUlDb250YWluZXJDb25maWc+dGhpcy5nZXRDb25maWcoKTtcblxuICAgIGxldCBpc1VpU2hvd24gPSBmYWxzZTtcbiAgICBsZXQgaXNTZWVraW5nID0gZmFsc2U7XG4gICAgbGV0IGlzRmlyc3RUb3VjaCA9IHRydWU7XG5cbiAgICBsZXQgc2hvd1VpID0gKCkgPT4ge1xuICAgICAgaWYgKCFpc1VpU2hvd24pIHtcbiAgICAgICAgLy8gTGV0IHN1YnNjcmliZXJzIGtub3cgdGhhdCB0aGV5IHNob3VsZCByZXZlYWwgdGhlbXNlbHZlc1xuICAgICAgICB1aW1hbmFnZXIub25Db250cm9sc1Nob3cuZGlzcGF0Y2godGhpcyk7XG4gICAgICAgIGlzVWlTaG93biA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBEb24ndCB0cmlnZ2VyIHRpbWVvdXQgd2hpbGUgc2Vla2luZyAoaXQgd2lsbCBiZSB0cmlnZ2VyZWQgb25jZSB0aGUgc2VlayBpcyBmaW5pc2hlZCkgb3IgY2FzdGluZ1xuICAgICAgaWYgKCFpc1NlZWtpbmcgJiYgIXBsYXllci5pc0Nhc3RpbmcoKSkge1xuICAgICAgICB0aGlzLnVpSGlkZVRpbWVvdXQuc3RhcnQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGhpZGVVaSA9ICgpID0+IHtcbiAgICAgIC8vIEhpZGUgdGhlIFVJIG9ubHkgaWYgaXQgaXMgc2hvd24sIGFuZCBpZiBub3QgY2FzdGluZ1xuICAgICAgaWYgKGlzVWlTaG93biAmJiAhcGxheWVyLmlzQ2FzdGluZygpKSB7XG4gICAgICAgIC8vIElzc3VlIGEgcHJldmlldyBldmVudCB0byBjaGVjayBpZiB3ZSBhcmUgZ29vZCB0byBoaWRlIHRoZSBjb250cm9sc1xuICAgICAgICBsZXQgcHJldmlld0hpZGVFdmVudEFyZ3MgPSA8Q2FuY2VsRXZlbnRBcmdzPnt9O1xuICAgICAgICB1aW1hbmFnZXIub25QcmV2aWV3Q29udHJvbHNIaWRlLmRpc3BhdGNoKHRoaXMsIHByZXZpZXdIaWRlRXZlbnRBcmdzKTtcblxuICAgICAgICBpZiAoIXByZXZpZXdIaWRlRXZlbnRBcmdzLmNhbmNlbCkge1xuICAgICAgICAgIC8vIElmIHRoZSBwcmV2aWV3IHdhc24ndCBjYW5jZWxlZCwgbGV0IHN1YnNjcmliZXJzIGtub3cgdGhhdCB0aGV5IHNob3VsZCBub3cgaGlkZSB0aGVtc2VsdmVzXG4gICAgICAgICAgdWltYW5hZ2VyLm9uQ29udHJvbHNIaWRlLmRpc3BhdGNoKHRoaXMpO1xuICAgICAgICAgIGlzVWlTaG93biA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHRoZSBoaWRlIHByZXZpZXcgd2FzIGNhbmNlbGVkLCBjb250aW51ZSB0byBzaG93IFVJXG4gICAgICAgICAgc2hvd1VpKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVGltZW91dCB0byBkZWZlciBVSSBoaWRpbmcgYnkgdGhlIGNvbmZpZ3VyZWQgZGVsYXkgdGltZVxuICAgIHRoaXMudWlIaWRlVGltZW91dCA9IG5ldyBUaW1lb3V0KGNvbmZpZy5oaWRlRGVsYXksIGhpZGVVaSk7XG5cbiAgICAvLyBPbiB0b3VjaCBkaXNwbGF5cywgdGhlIGZpcnN0IHRvdWNoIHJldmVhbHMgdGhlIFVJXG4gICAgY29udGFpbmVyLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG4gICAgICBpZiAoIWlzVWlTaG93bikge1xuICAgICAgICAvLyBPbmx5IGlmIHRoZSBVSSBpcyBoaWRkZW4sIHdlIHByZXZlbnQgb3RoZXIgYWN0aW9ucyAoZXhjZXB0IGZvciB0aGUgZmlyc3QgdG91Y2gpIGFuZCByZXZlYWwgdGhlIFVJIGluc3RlYWQuXG4gICAgICAgIC8vIFRoZSBmaXJzdCB0b3VjaCBpcyBub3QgcHJldmVudGVkIHRvIGxldCBvdGhlciBsaXN0ZW5lcnMgcmVjZWl2ZSB0aGUgZXZlbnQgYW5kIHRyaWdnZXIgYW4gaW5pdGlhbCBhY3Rpb24sIGUuZy5cbiAgICAgICAgLy8gdGhlIGh1Z2UgcGxheWJhY2sgYnV0dG9uIGNhbiBkaXJlY3RseSBzdGFydCBwbGF5YmFjayBpbnN0ZWFkIG9mIHJlcXVpcmluZyBhIGRvdWJsZSB0YXAgd2hpY2ggMS4gcmV2ZWFsc1xuICAgICAgICAvLyB0aGUgVUkgYW5kIDIuIHN0YXJ0cyBwbGF5YmFjay5cbiAgICAgICAgaWYgKGlzRmlyc3RUb3VjaCkge1xuICAgICAgICAgIGlzRmlyc3RUb3VjaCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBzaG93VWkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBXaGVuIHRoZSBtb3VzZSBlbnRlcnMsIHdlIHNob3cgdGhlIFVJXG4gICAgY29udGFpbmVyLm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgc2hvd1VpKCk7XG4gICAgfSk7XG4gICAgLy8gV2hlbiB0aGUgbW91c2UgbW92ZXMgd2l0aGluLCB3ZSBzaG93IHRoZSBVSVxuICAgIGNvbnRhaW5lci5vbignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgICAgc2hvd1VpKCk7XG4gICAgfSk7XG4gICAgLy8gV2hlbiB0aGUgbW91c2UgbGVhdmVzLCB3ZSBjYW4gcHJlcGFyZSB0byBoaWRlIHRoZSBVSSwgZXhjZXB0IGEgc2VlayBpcyBnb2luZyBvblxuICAgIGNvbnRhaW5lci5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIC8vIFdoZW4gYSBzZWVrIGlzIGdvaW5nIG9uLCB0aGUgc2VlayBzY3J1YiBwb2ludGVyIG1heSBleGl0IHRoZSBVSSBhcmVhIHdoaWxlIHN0aWxsIHNlZWtpbmcsIGFuZCB3ZSBkbyBub3QgaGlkZVxuICAgICAgLy8gdGhlIFVJIGluIHN1Y2ggY2FzZXNcbiAgICAgIGlmICghaXNTZWVraW5nKSB7XG4gICAgICAgIHRoaXMudWlIaWRlVGltZW91dC5zdGFydCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdWltYW5hZ2VyLm9uU2Vlay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy51aUhpZGVUaW1lb3V0LmNsZWFyKCk7IC8vIERvbid0IGhpZGUgVUkgd2hpbGUgYSBzZWVrIGlzIGluIHByb2dyZXNzXG4gICAgICBpc1NlZWtpbmcgPSB0cnVlO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vblNlZWtlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaXNTZWVraW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnVpSGlkZVRpbWVvdXQuc3RhcnQoKTsgLy8gUmUtZW5hYmxlIFVJIGhpZGUgdGltZW91dCBhZnRlciBhIHNlZWtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsICgpID0+IHtcbiAgICAgIHNob3dVaSgpOyAvLyBTaG93IFVJIHdoZW4gYSBDYXN0IHNlc3Npb24gaGFzIHN0YXJ0ZWQgKFVJIHdpbGwgdGhlbiBzdGF5IHBlcm1hbmVudGx5IG9uIGR1cmluZyB0aGUgc2Vzc2lvbilcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlUGxheWVyU3RhdGVzKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgbGV0IGNvbnRhaW5lciA9IHRoaXMuZ2V0RG9tRWxlbWVudCgpO1xuXG4gICAgLy8gQ29udmVydCBwbGF5ZXIgc3RhdGVzIGludG8gQ1NTIGNsYXNzIG5hbWVzXG4gICAgbGV0IHN0YXRlQ2xhc3NOYW1lcyA9IDxhbnk+W107XG4gICAgZm9yIChsZXQgc3RhdGUgaW4gUGxheWVyVXRpbHMuUGxheWVyU3RhdGUpIHtcbiAgICAgIGlmIChpc05hTihOdW1iZXIoc3RhdGUpKSkge1xuICAgICAgICBsZXQgZW51bU5hbWUgPSBQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZVs8YW55PlBsYXllclV0aWxzLlBsYXllclN0YXRlW3N0YXRlXV07XG4gICAgICAgIHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZVtzdGF0ZV1dID1cbiAgICAgICAgICB0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5TVEFURV9QUkVGSVggKyBlbnVtTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVtb3ZlU3RhdGVzID0gKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZS5JRExFXSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBSRVBBUkVEXSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBMQVlJTkddKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUEFVU0VEXSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLkZJTklTSEVEXSk7XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgKCkgPT4ge1xuICAgICAgcmVtb3ZlU3RhdGVzKCk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBSRVBBUkVEXSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgKCkgPT4ge1xuICAgICAgcmVtb3ZlU3RhdGVzKCk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBMQVlJTkddKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QQVVTRUQsICgpID0+IHtcbiAgICAgIHJlbW92ZVN0YXRlcygpO1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZS5QQVVTRURdKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZQkFDS19GSU5JU0hFRCwgKCkgPT4ge1xuICAgICAgcmVtb3ZlU3RhdGVzKCk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLkZJTklTSEVEXSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCAoKSA9PiB7XG4gICAgICByZW1vdmVTdGF0ZXMoKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuSURMRV0pO1xuICAgIH0pO1xuICAgIC8vIEluaXQgaW4gY3VycmVudCBwbGF5ZXIgc3RhdGVcbiAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLmdldFN0YXRlKHBsYXllcildKTtcblxuICAgIC8vIEZ1bGxzY3JlZW4gbWFya2VyIGNsYXNzXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fRlVMTFNDUkVFTl9FTlRFUiwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkZVTExTQ1JFRU4pKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9GVUxMU0NSRUVOX0VYSVQsICgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5GVUxMU0NSRUVOKSk7XG4gICAgfSk7XG4gICAgLy8gSW5pdCBmdWxsc2NyZWVuIHN0YXRlXG4gICAgaWYgKHBsYXllci5pc0Z1bGxzY3JlZW4oKSkge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkZVTExTQ1JFRU4pKTtcbiAgICB9XG5cbiAgICAvLyBCdWZmZXJpbmcgbWFya2VyIGNsYXNzXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1RBTExfU1RBUlRFRCwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkJVRkZFUklORykpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX0VOREVELCAoKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQlVGRkVSSU5HKSk7XG4gICAgfSk7XG4gICAgLy8gSW5pdCBidWZmZXJpbmcgc3RhdGVcbiAgICBpZiAocGxheWVyLmlzU3RhbGxlZCgpKSB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQlVGRkVSSU5HKSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3RlQ29udHJvbCBtYXJrZXIgY2xhc3NcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsICgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5SRU1PVEVfQ09OVFJPTCkpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RPUFBFRCwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLlJFTU9URV9DT05UUk9MKSk7XG4gICAgfSk7XG4gICAgLy8gSW5pdCBSZW1vdGVDb250cm9sIHN0YXRlXG4gICAgaWYgKHBsYXllci5pc0Nhc3RpbmcoKSkge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLlJFTU9URV9DT05UUk9MKSk7XG4gICAgfVxuXG4gICAgLy8gQ29udHJvbHMgdmlzaWJpbGl0eSBtYXJrZXIgY2xhc3NcbiAgICB1aW1hbmFnZXIub25Db250cm9sc1Nob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5DT05UUk9MU19ISURERU4pKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5DT05UUk9MU19TSE9XTikpO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkNPTlRST0xTX1NIT1dOKSk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQ09OVFJPTFNfSElEREVOKSk7XG4gICAgfSk7XG5cbiAgICAvLyBMYXlvdXQgc2l6ZSBjbGFzc2VzXG4gICAgbGV0IHVwZGF0ZUxheW91dFNpemVDbGFzc2VzID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtNDAwJykpO1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTYwMCcpKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC04MDAnKSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtMTIwMCcpKTtcblxuICAgICAgaWYgKHdpZHRoIDw9IDQwMCkge1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtNDAwJykpO1xuICAgICAgfSBlbHNlIGlmICh3aWR0aCA8PSA2MDApIHtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTYwMCcpKTtcbiAgICAgIH0gZWxzZSBpZiAod2lkdGggPD0gODAwKSB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC04MDAnKSk7XG4gICAgICB9IGVsc2UgaWYgKHdpZHRoIDw9IDEyMDApIHtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTEyMDAnKSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZRVJfUkVTSVpFLCAoZTogUGxheWVyUmVzaXplRXZlbnQpID0+IHtcbiAgICAgIC8vIENvbnZlcnQgc3RyaW5ncyAod2l0aCBcInB4XCIgc3VmZml4KSB0byBpbnRzXG4gICAgICBsZXQgd2lkdGggPSBNYXRoLnJvdW5kKE51bWJlcihlLndpZHRoLnN1YnN0cmluZygwLCBlLndpZHRoLmxlbmd0aCAtIDIpKSk7XG4gICAgICBsZXQgaGVpZ2h0ID0gTWF0aC5yb3VuZChOdW1iZXIoZS5oZWlnaHQuc3Vic3RyaW5nKDAsIGUuaGVpZ2h0Lmxlbmd0aCAtIDIpKSk7XG5cbiAgICAgIHVwZGF0ZUxheW91dFNpemVDbGFzc2VzKHdpZHRoLCBoZWlnaHQpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdCBsYXlvdXQgc3RhdGVcbiAgICB1cGRhdGVMYXlvdXRTaXplQ2xhc3NlcyhuZXcgRE9NKHBsYXllci5nZXRGaWd1cmUoKSkud2lkdGgoKSwgbmV3IERPTShwbGF5ZXIuZ2V0RmlndXJlKCkpLmhlaWdodCgpKTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIHRoaXMudWlIaWRlVGltZW91dC5jbGVhcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGxldCBjb250YWluZXIgPSBzdXBlci50b0RvbUVsZW1lbnQoKTtcblxuICAgIC8vIERldGVjdCBmbGV4Ym94IHN1cHBvcnQgKG5vdCBzdXBwb3J0ZWQgaW4gSUU5KVxuICAgIGlmIChkb2N1bWVudCAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnN0eWxlLmZsZXggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2ZsZXhib3gnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbm8tZmxleGJveCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG59IiwiaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vc2VsZWN0Ym94JztcbmltcG9ydCB7TGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2VsZWN0IGJveCBwcm92aWRpbmcgYSBzZWxlY3Rpb24gYmV0d2VlbiAnYXV0bycgYW5kIHRoZSBhdmFpbGFibGUgdmlkZW8gcXVhbGl0aWVzLlxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9RdWFsaXR5U2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgdXBkYXRlVmlkZW9RdWFsaXRpZXMgPSAoKSA9PiB7XG4gICAgICBsZXQgdmlkZW9RdWFsaXRpZXMgPSBwbGF5ZXIuZ2V0QXZhaWxhYmxlVmlkZW9RdWFsaXRpZXMoKTtcblxuICAgICAgdGhpcy5jbGVhckl0ZW1zKCk7XG5cbiAgICAgIC8vIEFkZCBlbnRyeSBmb3IgYXV0b21hdGljIHF1YWxpdHkgc3dpdGNoaW5nIChkZWZhdWx0IHNldHRpbmcpXG4gICAgICB0aGlzLmFkZEl0ZW0oJ0F1dG8nLCAnQXV0bycpO1xuXG4gICAgICAvLyBBZGQgdmlkZW8gcXVhbGl0aWVzXG4gICAgICBmb3IgKGxldCB2aWRlb1F1YWxpdHkgb2YgdmlkZW9RdWFsaXRpZXMpIHtcbiAgICAgICAgdGhpcy5hZGRJdGVtKHZpZGVvUXVhbGl0eS5pZCwgdmlkZW9RdWFsaXR5LmxhYmVsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5vbkl0ZW1TZWxlY3RlZC5zdWJzY3JpYmUoKHNlbmRlcjogVmlkZW9RdWFsaXR5U2VsZWN0Qm94LCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0VmlkZW9RdWFsaXR5KHZhbHVlKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBxdWFsaXRpZXMgd2hlbiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1cGRhdGVWaWRlb1F1YWxpdGllcyk7XG4gICAgLy8gVXBkYXRlIHF1YWxpdGllcyB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgdXBkYXRlVmlkZW9RdWFsaXRpZXMpO1xuICAgIC8vIFVwZGF0ZSBxdWFsaXR5IHNlbGVjdGlvbiB3aGVuIHF1YWxpdHkgaXMgY2hhbmdlZCAoZnJvbSBvdXRzaWRlKVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZJREVPX0RPV05MT0FEX1FVQUxJVFlfQ0hBTkdFLCAoKSA9PiB7XG4gICAgICBsZXQgZGF0YSA9IHBsYXllci5nZXREb3dubG9hZGVkVmlkZW9EYXRhKCk7XG4gICAgICB0aGlzLnNlbGVjdEl0ZW0oZGF0YS5pc0F1dG8gPyAnQXV0bycgOiBkYXRhLmlkKTtcbiAgICB9KTtcblxuICAgIC8vIFBvcHVsYXRlIHF1YWxpdGllcyBhdCBzdGFydHVwXG4gICAgdXBkYXRlVmlkZW9RdWFsaXRpZXMoKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7Vm9sdW1lU2xpZGVyfSBmcm9tICcuL3ZvbHVtZXNsaWRlcic7XG5pbXBvcnQge1ZvbHVtZVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi92b2x1bWV0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIFZvbHVtZUNvbnRyb2xCdXR0b259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZvbHVtZUNvbnRyb2xCdXR0b25Db25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGRlbGF5IGFmdGVyIHdoaWNoIHRoZSB2b2x1bWUgc2xpZGVyIHdpbGwgYmUgaGlkZGVuIHdoZW4gdGhlcmUgaXMgbm8gdXNlciBpbnRlcmFjdGlvbi5cbiAgICogQ2FyZSBtdXN0IGJlIHRha2VuIHRoYXQgdGhlIGRlbGF5IGlzIGxvbmcgZW5vdWdoIHNvIHVzZXJzIGNhbiByZWFjaCB0aGUgc2xpZGVyIGZyb20gdGhlIHRvZ2dsZSBidXR0b24sIGUuZy4gYnlcbiAgICogbW91c2UgbW92ZW1lbnQuIElmIHRoZSBkZWxheSBpcyB0b28gc2hvcnQsIHRoZSBzbGlkZXJzIGRpc2FwcGVhcnMgYmVmb3JlIHRoZSBtb3VzZSBwb2ludGVyIGhhcyByZWFjaGVkIGl0IGFuZFxuICAgKiB0aGUgdXNlciBpcyBub3QgYWJsZSB0byB1c2UgaXQuXG4gICAqIERlZmF1bHQ6IDUwMG1zXG4gICAqL1xuICBoaWRlRGVsYXk/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaWYgdGhlIHZvbHVtZSBzbGlkZXIgc2hvdWxkIGJlIHZlcnRpY2FsbHkgb3IgaG9yaXpvbnRhbGx5IGFsaWduZWQuXG4gICAqIERlZmF1bHQ6IHRydWVcbiAgICovXG4gIHZlcnRpY2FsPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGNvbXBvc2l0ZSB2b2x1bWUgY29udHJvbCB0aGF0IGNvbnNpc3RzIG9mIGFuZCBpbnRlcm5hbGx5IG1hbmFnZXMgYSB2b2x1bWUgY29udHJvbCBidXR0b24gdGhhdCBjYW4gYmUgdXNlZFxuICogZm9yIG11dGluZywgYW5kIGEgKGRlcGVuZGluZyBvbiB0aGUgQ1NTIHN0eWxlLCBlLmcuIHNsaWRlLW91dCkgdm9sdW1lIGNvbnRyb2wgYmFyLlxuICovXG5leHBvcnQgY2xhc3MgVm9sdW1lQ29udHJvbEJ1dHRvbiBleHRlbmRzIENvbnRhaW5lcjxWb2x1bWVDb250cm9sQnV0dG9uQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSB2b2x1bWVUb2dnbGVCdXR0b246IFZvbHVtZVRvZ2dsZUJ1dHRvbjtcbiAgcHJpdmF0ZSB2b2x1bWVTbGlkZXI6IFZvbHVtZVNsaWRlcjtcblxuICBwcml2YXRlIHZvbHVtZVNsaWRlckhpZGVUaW1lb3V0OiBUaW1lb3V0O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVm9sdW1lQ29udHJvbEJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMudm9sdW1lVG9nZ2xlQnV0dG9uID0gbmV3IFZvbHVtZVRvZ2dsZUJ1dHRvbigpO1xuICAgIHRoaXMudm9sdW1lU2xpZGVyID0gbmV3IFZvbHVtZVNsaWRlcih7XG4gICAgICB2ZXJ0aWNhbDogY29uZmlnLnZlcnRpY2FsICE9IG51bGwgPyBjb25maWcudmVydGljYWwgOiB0cnVlLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXZvbHVtZWNvbnRyb2xidXR0b24nLFxuICAgICAgY29tcG9uZW50czogW3RoaXMudm9sdW1lVG9nZ2xlQnV0dG9uLCB0aGlzLnZvbHVtZVNsaWRlcl0sXG4gICAgICBoaWRlRGVsYXk6IDUwMFxuICAgIH0sIDxWb2x1bWVDb250cm9sQnV0dG9uQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgdm9sdW1lVG9nZ2xlQnV0dG9uID0gdGhpcy5nZXRWb2x1bWVUb2dnbGVCdXR0b24oKTtcbiAgICBsZXQgdm9sdW1lU2xpZGVyID0gdGhpcy5nZXRWb2x1bWVTbGlkZXIoKTtcblxuICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQgPSBuZXcgVGltZW91dCgoPFZvbHVtZUNvbnRyb2xCdXR0b25Db25maWc+dGhpcy5nZXRDb25maWcoKSkuaGlkZURlbGF5LCAoKSA9PiB7XG4gICAgICB2b2x1bWVTbGlkZXIuaGlkZSgpO1xuICAgIH0pO1xuXG4gICAgLypcbiAgICAgKiBWb2x1bWUgU2xpZGVyIHZpc2liaWxpdHkgaGFuZGxpbmdcbiAgICAgKlxuICAgICAqIFRoZSB2b2x1bWUgc2xpZGVyIHNoYWxsIGJlIHZpc2libGUgd2hpbGUgdGhlIHVzZXIgaG92ZXJzIHRoZSBtdXRlIHRvZ2dsZSBidXR0b24sIHdoaWxlIHRoZSB1c2VyIGhvdmVycyB0aGVcbiAgICAgKiB2b2x1bWUgc2xpZGVyLCBhbmQgd2hpbGUgdGhlIHVzZXIgc2xpZGVzIHRoZSB2b2x1bWUgc2xpZGVyLiBJZiBub25lIG9mIHRoZXNlIHNpdHVhdGlvbnMgYXJlIHRydWUsIHRoZSBzbGlkZXJcbiAgICAgKiBzaGFsbCBkaXNhcHBlYXIuXG4gICAgICovXG4gICAgbGV0IHZvbHVtZVNsaWRlckhvdmVyZWQgPSBmYWxzZTtcbiAgICB2b2x1bWVUb2dnbGVCdXR0b24uZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgLy8gU2hvdyB2b2x1bWUgc2xpZGVyIHdoZW4gbW91c2UgZW50ZXJzIHRoZSBidXR0b24gYXJlYVxuICAgICAgaWYgKHZvbHVtZVNsaWRlci5pc0hpZGRlbigpKSB7XG4gICAgICAgIHZvbHVtZVNsaWRlci5zaG93KCk7XG4gICAgICB9XG4gICAgICAvLyBBdm9pZCBoaWRpbmcgb2YgdGhlIHNsaWRlciB3aGVuIGJ1dHRvbiBpcyBob3ZlcmVkXG4gICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgfSk7XG4gICAgdm9sdW1lVG9nZ2xlQnV0dG9uLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIC8vIEhpZGUgc2xpZGVyIGRlbGF5ZWQgd2hlbiBidXR0b24gaXMgbGVmdFxuICAgICAgdGhpcy52b2x1bWVTbGlkZXJIaWRlVGltZW91dC5yZXNldCgpO1xuICAgIH0pO1xuICAgIHZvbHVtZVNsaWRlci5nZXREb21FbGVtZW50KCkub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAvLyBXaGVuIHRoZSBzbGlkZXIgaXMgZW50ZXJlZCwgY2FuY2VsIHRoZSBoaWRlIHRpbWVvdXQgYWN0aXZhdGVkIGJ5IGxlYXZpbmcgdGhlIGJ1dHRvblxuICAgICAgdGhpcy52b2x1bWVTbGlkZXJIaWRlVGltZW91dC5jbGVhcigpO1xuICAgICAgdm9sdW1lU2xpZGVySG92ZXJlZCA9IHRydWU7XG4gICAgfSk7XG4gICAgdm9sdW1lU2xpZGVyLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIC8vIFdoZW4gbW91c2UgbGVhdmVzIHRoZSBzbGlkZXIsIG9ubHkgaGlkZSBpdCBpZiB0aGVyZSBpcyBubyBzbGlkZSBvcGVyYXRpb24gaW4gcHJvZ3Jlc3NcbiAgICAgIGlmICh2b2x1bWVTbGlkZXIuaXNTZWVraW5nKCkpIHtcbiAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJIaWRlVGltZW91dC5jbGVhcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52b2x1bWVTbGlkZXJIaWRlVGltZW91dC5yZXNldCgpO1xuICAgICAgfVxuICAgICAgdm9sdW1lU2xpZGVySG92ZXJlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgIHZvbHVtZVNsaWRlci5vblNlZWtlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gV2hlbiBhIHNsaWRlIG9wZXJhdGlvbiBpcyBkb25lIGFuZCB0aGUgc2xpZGVyIG5vdCBob3ZlcmVkIChtb3VzZSBvdXRzaWRlIHNsaWRlciksIGhpZGUgc2xpZGVyIGRlbGF5ZWRcbiAgICAgIGlmICghdm9sdW1lU2xpZGVySG92ZXJlZCkge1xuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZWxlYXNlKCk6IHZvaWQge1xuICAgIHN1cGVyLnJlbGVhc2UoKTtcbiAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBpbnRlcm5hbGx5IG1hbmFnZWQgdm9sdW1lIHRvZ2dsZSBidXR0b24uXG4gICAqIEByZXR1cm5zIHtWb2x1bWVUb2dnbGVCdXR0b259XG4gICAqL1xuICBnZXRWb2x1bWVUb2dnbGVCdXR0b24oKTogVm9sdW1lVG9nZ2xlQnV0dG9uIHtcbiAgICByZXR1cm4gdGhpcy52b2x1bWVUb2dnbGVCdXR0b247XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBpbnRlcm5hbGx5IG1hbmFnZWQgdm9sdW1lIHNpbGRlci5cbiAgICogQHJldHVybnMge1ZvbHVtZVNsaWRlcn1cbiAgICovXG4gIGdldFZvbHVtZVNsaWRlcigpOiBWb2x1bWVTbGlkZXIge1xuICAgIHJldHVybiB0aGlzLnZvbHVtZVNsaWRlcjtcbiAgfVxufSIsImltcG9ydCB7U2Vla0JhciwgU2Vla0JhckNvbmZpZ30gZnJvbSAnLi9zZWVrYmFyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgVm9sdW1lU2xpZGVyfSBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVm9sdW1lU2xpZGVyQ29uZmlnIGV4dGVuZHMgU2Vla0JhckNvbmZpZyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaWYgdGhlIHZvbHVtZSBzbGlkZXIgc2hvdWxkIGJlIGF1dG9tYXRpY2FsbHkgaGlkZGVuIHdoZW4gdm9sdW1lIGNvbnRyb2wgaXMgcHJvaGliaXRlZCBieSB0aGVcbiAgICogYnJvd3NlciBvciBwbGF0Zm9ybS4gVGhpcyBjdXJyZW50bHkgb25seSBhcHBsaWVzIHRvIGlPUy5cbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgaGlkZUlmVm9sdW1lQ29udHJvbFByb2hpYml0ZWQ6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBzaW1wbGUgdm9sdW1lIHNsaWRlciBjb21wb25lbnQgdG8gYWRqdXN0IHRoZSBwbGF5ZXIncyB2b2x1bWUgc2V0dGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIFZvbHVtZVNsaWRlciBleHRlbmRzIFNlZWtCYXIge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogU2Vla0JhckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIDxWb2x1bWVTbGlkZXJDb25maWc+e1xuICAgICAgY3NzQ2xhc3M6ICd1aS12b2x1bWVzbGlkZXInLFxuICAgICAgaGlkZUlmVm9sdW1lQ29udHJvbFByb2hpYml0ZWQ6IHRydWUsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyLCBmYWxzZSk7XG5cbiAgICBsZXQgY29uZmlnID0gPFZvbHVtZVNsaWRlckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgaWYgKGNvbmZpZy5oaWRlSWZWb2x1bWVDb250cm9sUHJvaGliaXRlZCAmJiAhdGhpcy5kZXRlY3RWb2x1bWVDb250cm9sQXZhaWxhYmlsaXR5KHBsYXllcikpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuXG4gICAgICAvLyBXZSBjYW4ganVzdCByZXR1cm4gZnJvbSBoZXJlLCBiZWNhdXNlIHRoZSB1c2VyIHdpbGwgbmV2ZXIgaW50ZXJhY3Qgd2l0aCB0aGUgY29udHJvbCBhbmQgYW55IGNvbmZpZ3VyZWRcbiAgICAgIC8vIGZ1bmN0aW9uYWxpdHkgd291bGQgb25seSBlYXQgcmVzb3VyY2VzIGZvciBubyByZWFzb24uXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHZvbHVtZUNoYW5nZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTXV0ZWQoKSkge1xuICAgICAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24oMCk7XG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24oMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24ocGxheWVyLmdldFZvbHVtZSgpKTtcblxuICAgICAgICB0aGlzLnNldEJ1ZmZlclBvc2l0aW9uKHBsYXllci5nZXRWb2x1bWUoKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB2b2x1bWVDaGFuZ2VIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9WT0xVTUVfQ0hBTkdFRCwgdm9sdW1lQ2hhbmdlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fTVVURUQsIHZvbHVtZUNoYW5nZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1VOTVVURUQsIHZvbHVtZUNoYW5nZUhhbmRsZXIpO1xuXG4gICAgdGhpcy5vblNlZWtQcmV2aWV3LnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XG4gICAgICBpZiAoYXJncy5zY3J1YmJpbmcpIHtcbiAgICAgICAgcGxheWVyLnNldFZvbHVtZShhcmdzLnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uU2Vla2VkLnN1YnNjcmliZSgoc2VuZGVyLCBwZXJjZW50YWdlKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0Vm9sdW1lKHBlcmNlbnRhZ2UpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSB2b2x1bWUgc2xpZGVyIG1hcmtlciB3aGVuIHRoZSBwbGF5ZXIgcmVzaXplZCwgYSBzb3VyY2UgaXMgbG9hZGVkIGFuZCBwbGF5ZXIgaXMgcmVhZHksXG4gICAgLy8gb3IgdGhlIFVJIGlzIGNvbmZpZ3VyZWQuIENoZWNrIHRoZSBzZWVrYmFyIGZvciBhIGRldGFpbGVkIGRlc2NyaXB0aW9uLlxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsICgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vbkNvbmZpZ3VyZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcblxuICAgIC8vIEluaXQgdm9sdW1lIGJhclxuICAgIHZvbHVtZUNoYW5nZUhhbmRsZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZGV0ZWN0Vm9sdW1lQ29udHJvbEF2YWlsYWJpbGl0eShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSk6IGJvb2xlYW4ge1xuICAgIC8vIFN0b3JlIGN1cnJlbnQgcGxheWVyIHN0YXRlIHNvIHdlIGNhbiByZXN0b3JlIGl0IGxhdGVyXG4gICAgbGV0IHZvbHVtZSA9IHBsYXllci5nZXRWb2x1bWUoKTtcbiAgICBsZXQgbXV0ZWQgPSBwbGF5ZXIuaXNNdXRlZCgpO1xuICAgIGxldCBwbGF5aW5nID0gcGxheWVyLmlzUGxheWluZygpO1xuXG4gICAgLypcbiAgICAgKiBcIk9uIGlPUyBkZXZpY2VzLCB0aGUgYXVkaW8gbGV2ZWwgaXMgYWx3YXlzIHVuZGVyIHRoZSB1c2Vy4oCZcyBwaHlzaWNhbCBjb250cm9sLiBUaGUgdm9sdW1lIHByb3BlcnR5IGlzIG5vdFxuICAgICAqIHNldHRhYmxlIGluIEphdmFTY3JpcHQuIFJlYWRpbmcgdGhlIHZvbHVtZSBwcm9wZXJ0eSBhbHdheXMgcmV0dXJucyAxLlwiXG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL2xpYnJhcnkvY29udGVudC9kb2N1bWVudGF0aW9uL0F1ZGlvVmlkZW8vQ29uY2VwdHVhbC9Vc2luZ19IVE1MNV9BdWRpb19WaWRlby9EZXZpY2UtU3BlY2lmaWNDb25zaWRlcmF0aW9ucy9EZXZpY2UtU3BlY2lmaWNDb25zaWRlcmF0aW9ucy5odG1sXG4gICAgICpcbiAgICAgKiBPdXIgcGxheWVyIEFQSSByZXR1cm5zIGEgdm9sdW1lIHJhbmdlIG9mIFswLCAxMDBdIHNvIHdlIG5lZWQgdG8gY2hlY2sgZm9yIDEwMCBpbnN0ZWFkIG9mIDEuXG4gICAgICovXG5cbiAgICAvLyBPbmx5IGlmIHRoZSB2b2x1bWUgaXMgMTAwLCB0aGVyZSdzIHRoZSBwb3NzaWJpbGl0eSB3ZSBhcmUgb24gYSB2b2x1bWUtY29udHJvbC1yZXN0cmljdGVkIGlPUyBkZXZpY2VcbiAgICBpZiAodm9sdW1lID09PSAxMDApIHtcbiAgICAgIC8vIFdlIHNldCB0aGUgdm9sdW1lIHRvIHplcm8gKHRoYXQncyB0aGUgb25seSB2YWx1ZSB0aGF0IGRvZXMgbm90IHVubXV0ZSBhIG11dGVkIHBsYXllciEpXG4gICAgICBwbGF5ZXIuc2V0Vm9sdW1lKDApO1xuICAgICAgLy8gVGhlbiB3ZSBjaGVjayBpZiB0aGUgdmFsdWUgaXMgc3RpbGwgMTAwXG4gICAgICBpZiAocGxheWVyLmdldFZvbHVtZSgpID09PSAxMDApIHtcbiAgICAgICAgLy8gSWYgdGhlIHZvbHVtZSBzdGF5ZWQgYXQgMTAwLCB3ZSdyZSBvbiBhIHZvbHVtZS1jb250cm9sLXJlc3RyaWN0ZWQgZGV2aWNlXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGNhbiBjb250cm9sIHZvbHVtZSwgc28gd2UgbXVzdCByZXN0b3JlIHRoZSBwcmV2aW91cyBwbGF5ZXIgc3RhdGVcbiAgICAgICAgcGxheWVyLnNldFZvbHVtZSh2b2x1bWUpO1xuICAgICAgICBpZiAobXV0ZWQpIHtcbiAgICAgICAgICBwbGF5ZXIubXV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwbGF5aW5nKSB7XG4gICAgICAgICAgLy8gVGhlIHZvbHVtZSByZXN0b3JlIGFib3ZlIHBhdXNlcyBhdXRvcGxheSBvbiBtb2JpbGUgZGV2aWNlcyAoZS5nLiBBbmRyb2lkKSBzbyB3ZSBuZWVkIHRvIHJlc3VtZSBwbGF5YmFja1xuICAgICAgICAgIC8vIChXZSBjYW5ub3QgY2hlY2sgaXNQYXVzZWQoKSBoZXJlIGJlY2F1c2UgaXQgaXMgbm90IHNldCB3aGVuIHBsYXliYWNrIGlzIHByb2hpYml0ZWQgYnkgdGhlIG1vYmlsZSBwbGF0Zm9ybSlcbiAgICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBWb2x1bWUgaXMgbm90IDEwMCwgc28gd2UncmUgZGVmaW5pdGVseSBub3Qgb24gYSB2b2x1bWUtY29udHJvbC1yZXN0cmljdGVkIGlPUyBkZXZpY2VcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIGF1ZGlvIG11dGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIFZvbHVtZVRvZ2dsZUJ1dHRvbiBleHRlbmRzIFRvZ2dsZUJ1dHRvbjxUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdm9sdW1ldG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdWb2x1bWUvTXV0ZSdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IG11dGVTdGF0ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTXV0ZWQoKSkge1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9mZigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdm9sdW1lTGV2ZWxIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgLy8gVG9nZ2xlIGxvdyBjbGFzcyB0byBkaXNwbGF5IGxvdyB2b2x1bWUgaWNvbiBiZWxvdyA1MCUgdm9sdW1lXG4gICAgICBpZiAocGxheWVyLmdldFZvbHVtZSgpIDwgNTApIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xvdycpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKCdsb3cnKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX01VVEVELCBtdXRlU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9VTk1VVEVELCBtdXRlU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9WT0xVTUVfQ0hBTkdFRCwgdm9sdW1lTGV2ZWxIYW5kbGVyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc011dGVkKCkpIHtcbiAgICAgICAgcGxheWVyLnVubXV0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLm11dGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFN0YXJ0dXAgaW5pdFxuICAgIG11dGVTdGF0ZUhhbmRsZXIoKTtcbiAgICB2b2x1bWVMZXZlbEhhbmRsZXIoKTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIHRoZSB2aWRlbyB2aWV3IGJldHdlZW4gbm9ybWFsL21vbm8gYW5kIFZSL3N0ZXJlby5cbiAqL1xuZXhwb3J0IGNsYXNzIFZSVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS12cnRvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnVlInXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBpc1ZSQ29uZmlndXJlZCA9ICgpID0+IHtcbiAgICAgIC8vIFZSIGF2YWlsYWJpbGl0eSBjYW5ub3QgYmUgY2hlY2tlZCB0aHJvdWdoIGdldFZSU3RhdHVzKCkgYmVjYXVzZSBpdCBpcyBhc3luY2hyb25vdXNseSBwb3B1bGF0ZWQgYW5kIG5vdFxuICAgICAgLy8gYXZhaWxhYmxlIGF0IFVJIGluaXRpYWxpemF0aW9uLiBBcyBhbiBhbHRlcm5hdGl2ZSwgd2UgY2hlY2sgdGhlIFZSIHNldHRpbmdzIGluIHRoZSBjb25maWcuXG4gICAgICAvLyBUT0RPIHVzZSBnZXRWUlN0YXR1cygpIHRocm91Z2ggaXNWUlN0ZXJlb0F2YWlsYWJsZSgpIG9uY2UgdGhlIHBsYXllciBoYXMgYmVlbiByZXdyaXR0ZW4gYW5kIHRoZSBzdGF0dXMgaXNcbiAgICAgIC8vIGF2YWlsYWJsZSBpbiBPTl9SRUFEWVxuICAgICAgbGV0IGNvbmZpZyA9IHBsYXllci5nZXRDb25maWcoKTtcbiAgICAgIHJldHVybiBjb25maWcuc291cmNlICYmIGNvbmZpZy5zb3VyY2UudnIgJiYgY29uZmlnLnNvdXJjZS52ci5jb250ZW50VHlwZSAhPT0gJ25vbmUnO1xuICAgIH07XG5cbiAgICBsZXQgaXNWUlN0ZXJlb0F2YWlsYWJsZSA9ICgpID0+IHtcbiAgICAgIHJldHVybiBwbGF5ZXIuZ2V0VlJTdGF0dXMoKS5jb250ZW50VHlwZSAhPT0gJ25vbmUnO1xuICAgIH07XG5cbiAgICBsZXQgdnJTdGF0ZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoaXNWUkNvbmZpZ3VyZWQoKSAmJiBpc1ZSU3RlcmVvQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgdGhpcy5zaG93KCk7IC8vIHNob3cgYnV0dG9uIGluIGNhc2UgaXQgaXMgaGlkZGVuXG5cbiAgICAgICAgaWYgKHBsYXllci5nZXRWUlN0YXR1cygpLmlzU3RlcmVvKSB7XG4gICAgICAgICAgdGhpcy5vbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2ZmKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpOyAvLyBoaWRlIGJ1dHRvbiBpZiBubyBzdGVyZW8gbW9kZSBhdmFpbGFibGVcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHZyQnV0dG9uVmlzaWJpbGl0eUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBpZiAoaXNWUkNvbmZpZ3VyZWQoKSkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9WUl9NT0RFX0NIQU5HRUQsIHZyU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9WUl9TVEVSRU9fQ0hBTkdFRCwgdnJTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZSX0VSUk9SLCB2clN0YXRlSGFuZGxlcik7XG4gICAgLy8gSGlkZSBidXR0b24gd2hlbiBWUiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB2ckJ1dHRvblZpc2liaWxpdHlIYW5kbGVyKTtcbiAgICAvLyBTaG93IGJ1dHRvbiB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWQgYW5kIGl0J3MgVlJcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgdnJCdXR0b25WaXNpYmlsaXR5SGFuZGxlcik7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICghaXNWUlN0ZXJlb0F2YWlsYWJsZSgpKSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vIFZSIGNvbnRlbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHBsYXllci5nZXRWUlN0YXR1cygpLmlzU3RlcmVvKSB7XG4gICAgICAgICAgcGxheWVyLnNldFZSU3RlcmVvKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5ZXIuc2V0VlJTdGVyZW8odHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNldCBzdGFydHVwIHZpc2liaWxpdHlcbiAgICB2ckJ1dHRvblZpc2liaWxpdHlIYW5kbGVyKCk7XG4gIH1cbn0iLCJpbXBvcnQge0NsaWNrT3ZlcmxheSwgQ2xpY2tPdmVybGF5Q29uZmlnfSBmcm9tICcuL2NsaWNrb3ZlcmxheSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIENsaWNrT3ZlcmxheX0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2F0ZXJtYXJrQ29uZmlnIGV4dGVuZHMgQ2xpY2tPdmVybGF5Q29uZmlnIHtcbiAgLy8gbm90aGluZyB5ZXRcbn1cblxuLyoqXG4gKiBBIHdhdGVybWFyayBvdmVybGF5IHdpdGggYSBjbGlja2FibGUgbG9nby5cbiAqL1xuZXhwb3J0IGNsYXNzIFdhdGVybWFyayBleHRlbmRzIENsaWNrT3ZlcmxheSB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBXYXRlcm1hcmtDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXdhdGVybWFyaycsXG4gICAgICB1cmw6ICdodHRwOi8vYml0bW92aW4uY29tJ1xuICAgIH0sIDxXYXRlcm1hcmtDb25maWc+dGhpcy5jb25maWcpO1xuICB9XG59IiwiZXhwb3J0IGludGVyZmFjZSBPZmZzZXQge1xuICBsZWZ0OiBudW1iZXI7XG4gIHRvcDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFNpbXBsZSBET00gbWFuaXB1bGF0aW9uIGFuZCBET00gZWxlbWVudCBldmVudCBoYW5kbGluZyBtb2RlbGVkIGFmdGVyIGpRdWVyeSAoYXMgcmVwbGFjZW1lbnQgZm9yIGpRdWVyeSkuXG4gKlxuICogTGlrZSBqUXVlcnksIERPTSBvcGVyYXRlcyBvbiBzaW5nbGUgZWxlbWVudHMgYW5kIGxpc3RzIG9mIGVsZW1lbnRzLiBGb3IgZXhhbXBsZTogY3JlYXRpbmcgYW4gZWxlbWVudCByZXR1cm5zIGEgRE9NXG4gKiBpbnN0YW5jZSB3aXRoIGEgc2luZ2xlIGVsZW1lbnQsIHNlbGVjdGluZyBlbGVtZW50cyByZXR1cm5zIGEgRE9NIGluc3RhbmNlIHdpdGggemVybywgb25lLCBvciBtYW55IGVsZW1lbnRzLiBTaW1pbGFyXG4gKiB0byBqUXVlcnksIHNldHRlcnMgdXN1YWxseSBhZmZlY3QgYWxsIGVsZW1lbnRzLCB3aGlsZSBnZXR0ZXJzIG9wZXJhdGUgb24gb25seSB0aGUgZmlyc3QgZWxlbWVudC5cbiAqIEFsc28gc2ltaWxhciB0byBqUXVlcnksIG1vc3QgbWV0aG9kcyAoZXhjZXB0IGdldHRlcnMpIHJldHVybiB0aGUgRE9NIGluc3RhbmNlIGZhY2lsaXRhdGluZyBlYXN5IGNoYWluaW5nIG9mIG1ldGhvZFxuICogY2FsbHMuXG4gKlxuICogQnVpbHQgd2l0aCB0aGUgaGVscCBvZjogaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vXG4gKi9cbmV4cG9ydCBjbGFzcyBET00ge1xuXG4gIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBlbGVtZW50cyB0aGF0IHRoZSBpbnN0YW5jZSB3cmFwcy4gVGFrZSBjYXJlIHRoYXQgbm90IGFsbCBtZXRob2RzIGNhbiBvcGVyYXRlIG9uIHRoZSB3aG9sZSBsaXN0LFxuICAgKiBnZXR0ZXJzIHVzdWFsbHkganVzdCB3b3JrIG9uIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBlbGVtZW50czogSFRNTEVsZW1lbnRbXTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50LlxuICAgKiBAcGFyYW0gdGFnTmFtZSB0aGUgdGFnIG5hbWUgb2YgdGhlIERPTSBlbGVtZW50XG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVzIGEgbGlzdCBvZiBhdHRyaWJ1dGVzIG9mIHRoZSBlbGVtZW50XG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0YWdOYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9KTtcbiAgLyoqXG4gICAqIFNlbGVjdHMgYWxsIGVsZW1lbnRzIGZyb20gdGhlIERPTSB0aGF0IG1hdGNoIHRoZSBzcGVjaWZpZWQgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSBzZWxlY3RvciB0aGUgc2VsZWN0b3IgdG8gbWF0Y2ggRE9NIGVsZW1lbnRzIHdpdGhcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yOiBzdHJpbmcpO1xuICAvKipcbiAgICogV3JhcHMgYSBwbGFpbiBIVE1MRWxlbWVudCB3aXRoIGEgRE9NIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gZWxlbWVudCB0aGUgSFRNTEVsZW1lbnQgdG8gd3JhcCB3aXRoIERPTVxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpO1xuICAvKipcbiAgICogV3JhcHMgYSBsaXN0IG9mIHBsYWluIEhUTUxFbGVtZW50cyB3aXRoIGEgRE9NIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gZWxlbWVudCB0aGUgSFRNTEVsZW1lbnRzIHRvIHdyYXAgd2l0aCBET01cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzOiBIVE1MRWxlbWVudFtdKTtcbiAgLyoqXG4gICAqIFdyYXBzIHRoZSBkb2N1bWVudCB3aXRoIGEgRE9NIGluc3RhbmNlLiBVc2VmdWwgdG8gYXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgZG9jdW1lbnQuXG4gICAqIEBwYXJhbSBkb2N1bWVudCB0aGUgZG9jdW1lbnQgdG8gd3JhcFxuICAgKi9cbiAgY29uc3RydWN0b3IoZG9jdW1lbnQ6IERvY3VtZW50KTtcbiAgY29uc3RydWN0b3Ioc29tZXRoaW5nOiBzdHJpbmcgfCBIVE1MRWxlbWVudCB8IEhUTUxFbGVtZW50W10gfCBEb2N1bWVudCwgYXR0cmlidXRlcz86IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50OyAvLyBTZXQgdGhlIGdsb2JhbCBkb2N1bWVudCB0byB0aGUgbG9jYWwgZG9jdW1lbnQgZmllbGRcblxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgaWYgKHNvbWV0aGluZy5sZW5ndGggPiAwICYmIHNvbWV0aGluZ1swXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGxldCBlbGVtZW50cyA9IHNvbWV0aGluZztcbiAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgbGV0IGVsZW1lbnQgPSBzb21ldGhpbmc7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW2VsZW1lbnRdO1xuICAgIH1cbiAgICBlbHNlIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBEb2N1bWVudCkge1xuICAgICAgLy8gV2hlbiBhIGRvY3VtZW50IGlzIHBhc3NlZCBpbiwgd2UgZG8gbm90IGRvIGFueXRoaW5nIHdpdGggaXQsIGJ1dCBieSBzZXR0aW5nIHRoaXMuZWxlbWVudHMgdG8gbnVsbFxuICAgICAgLy8gd2UgZ2l2ZSB0aGUgZXZlbnQgaGFuZGxpbmcgbWV0aG9kIGEgbWVhbnMgdG8gZGV0ZWN0IGlmIHRoZSBldmVudHMgc2hvdWxkIGJlIHJlZ2lzdGVyZWQgb24gdGhlIGRvY3VtZW50XG4gICAgICAvLyBpbnN0ZWFkIG9mIGVsZW1lbnRzLlxuICAgICAgdGhpcy5lbGVtZW50cyA9IG51bGw7XG4gICAgfVxuICAgIGVsc2UgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgIGxldCB0YWdOYW1lID0gc29tZXRoaW5nO1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuXG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVsZW1lbnRzID0gW2VsZW1lbnRdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBzZWxlY3RvciA9IHNvbWV0aGluZztcbiAgICAgIHRoaXMuZWxlbWVudHMgPSB0aGlzLmZpbmRDaGlsZEVsZW1lbnRzKHNlbGVjdG9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoYXQgdGhpcyBET00gaW5zdGFuY2UgY3VycmVudGx5IGhvbGRzLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzXG4gICAqL1xuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHMgPyB0aGlzLmVsZW1lbnRzLmxlbmd0aCA6IDA7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgSFRNTCBlbGVtZW50cyB0aGF0IHRoaXMgRE9NIGluc3RhbmNlIGN1cnJlbnRseSBob2xkcy5cbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50W119IHRoZSByYXcgSFRNTCBlbGVtZW50c1xuICAgKi9cbiAgZ2V0RWxlbWVudHMoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHM7XG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGN1dCBtZXRob2QgZm9yIGl0ZXJhdGluZyBhbGwgZWxlbWVudHMuIFNob3J0cyB0aGlzLmVsZW1lbnRzLmZvckVhY2goLi4uKSB0byB0aGlzLmZvckVhY2goLi4uKS5cbiAgICogQHBhcmFtIGhhbmRsZXIgdGhlIGhhbmRsZXIgdG8gZXhlY3V0ZSBhbiBvcGVyYXRpb24gb24gYW4gZWxlbWVudFxuICAgKi9cbiAgcHJpdmF0ZSBmb3JFYWNoKGhhbmRsZXI6IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgaGFuZGxlcihlbGVtZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZENoaWxkRWxlbWVudHNPZkVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBEb2N1bWVudCwgc2VsZWN0b3I6IHN0cmluZyk6IEhUTUxFbGVtZW50W10ge1xuICAgIGxldCBjaGlsZEVsZW1lbnRzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgIC8vIENvbnZlcnQgTm9kZUxpc3QgdG8gQXJyYXlcbiAgICAvLyBodHRwczovL3RvZGRtb3R0by5jb20vYS1jb21wcmVoZW5zaXZlLWRpdmUtaW50by1ub2RlbGlzdHMtYXJyYXlzLWNvbnZlcnRpbmctbm9kZWxpc3RzLWFuZC11bmRlcnN0YW5kaW5nLXRoZS1kb20vXG4gICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoY2hpbGRFbGVtZW50cyk7XG4gIH1cblxuICBwcml2YXRlIGZpbmRDaGlsZEVsZW1lbnRzKHNlbGVjdG9yOiBzdHJpbmcpOiBIVE1MRWxlbWVudFtdIHtcbiAgICBsZXQgYWxsQ2hpbGRFbGVtZW50cyA9IDxIVE1MRWxlbWVudFtdPltdO1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudHMpIHtcbiAgICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBhbGxDaGlsZEVsZW1lbnRzID0gYWxsQ2hpbGRFbGVtZW50cy5jb25jYXQodGhpcy5maW5kQ2hpbGRFbGVtZW50c09mRWxlbWVudChlbGVtZW50LCBzZWxlY3RvcikpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZENoaWxkRWxlbWVudHNPZkVsZW1lbnQoZG9jdW1lbnQsIHNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWxsQ2hpbGRFbGVtZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbGwgY2hpbGQgZWxlbWVudHMgb2YgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBzdXBwbGllZCBzZWxlY3Rvci5cbiAgICogQHBhcmFtIHNlbGVjdG9yIHRoZSBzZWxlY3RvciB0byBtYXRjaCB3aXRoIGNoaWxkIGVsZW1lbnRzXG4gICAqIEByZXR1cm5zIHtET019IGEgbmV3IERPTSBpbnN0YW5jZSByZXByZXNlbnRpbmcgYWxsIG1hdGNoZWQgY2hpbGRyZW5cbiAgICovXG4gIGZpbmQoc2VsZWN0b3I6IHN0cmluZyk6IERPTSB7XG4gICAgbGV0IGFsbENoaWxkRWxlbWVudHMgPSB0aGlzLmZpbmRDaGlsZEVsZW1lbnRzKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gbmV3IERPTShhbGxDaGlsZEVsZW1lbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIG9mIHRoZSBpbm5lciBIVE1MIGNvbnRlbnQgb2YgdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqL1xuICBodG1sKCk6IHN0cmluZztcbiAgLyoqXG4gICAqIFNldHMgdGhlIGlubmVyIEhUTUwgY29udGVudCBvZiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBjb250ZW50IGEgc3RyaW5nIG9mIHBsYWluIHRleHQgb3IgSFRNTCBtYXJrdXBcbiAgICovXG4gIGh0bWwoY29udGVudDogc3RyaW5nKTogRE9NO1xuICBodG1sKGNvbnRlbnQ/OiBzdHJpbmcpOiBzdHJpbmcgfCBET00ge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0SHRtbChjb250ZW50KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIdG1sKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRIdG1sKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzWzBdLmlubmVySFRNTDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0SHRtbChjb250ZW50OiBzdHJpbmcpOiBET00ge1xuICAgIGlmIChjb250ZW50ID09PSB1bmRlZmluZWQgfHwgY29udGVudCA9PSBudWxsKSB7XG4gICAgICAvLyBTZXQgdG8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIGlubmVySFRNTCBnZXR0aW5nIHNldCB0byAndW5kZWZpbmVkJyAoYWxsIGJyb3dzZXJzKSBvciAnbnVsbCcgKElFOSlcbiAgICAgIGNvbnRlbnQgPSAnJztcbiAgICB9XG5cbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgaW5uZXIgSFRNTCBvZiBhbGwgZWxlbWVudHMgKGRlbGV0ZXMgYWxsIGNoaWxkcmVuKS5cbiAgICogQHJldHVybnMge0RPTX1cbiAgICovXG4gIGVtcHR5KCk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGZpcnN0IGZvcm0gZWxlbWVudCwgZS5nLiB0aGUgc2VsZWN0ZWQgdmFsdWUgb2YgYSBzZWxlY3QgYm94IG9yIHRoZSB0ZXh0IGlmIGFuXG4gICAqIGlucHV0IGZpZWxkLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgdmFsdWUgb2YgYSBmb3JtIGVsZW1lbnRcbiAgICovXG4gIHZhbCgpOiBzdHJpbmcge1xuICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1swXTtcblxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQgfHwgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFRPRE8gYWRkIHN1cHBvcnQgZm9yIG1pc3NpbmcgZm9ybSBlbGVtZW50c1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2YWwoKSBub3Qgc3VwcG9ydGVkIGZvciAke3R5cGVvZiBlbGVtZW50fWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUgb24gdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVcbiAgICovXG4gIGF0dHIoYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsO1xuICAvKipcbiAgICogU2V0cyBhbiBhdHRyaWJ1dGUgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gYXR0cmlidXRlIHRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGVcbiAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlXG4gICAqL1xuICBhdHRyKGF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NO1xuICBhdHRyKGF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGwgfCBET00ge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0QXR0cihhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRBdHRyKGF0dHJpYnV0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRBdHRyKGF0dHJpYnV0ZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHNbMF0uZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gIH1cblxuICBwcml2YXRlIHNldEF0dHIoYXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBET00ge1xuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBkYXRhIGVsZW1lbnQgb24gdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqIEBwYXJhbSBkYXRhQXR0cmlidXRlIHRoZSBuYW1lIG9mIHRoZSBkYXRhIGF0dHJpYnV0ZSB3aXRob3V0IHRoZSAnZGF0YS0nIHByZWZpeFxuICAgKi9cbiAgZGF0YShkYXRhQXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsO1xuICAvKipcbiAgICogU2V0cyBhIGRhdGEgYXR0cmlidXRlIG9uIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGRhdGFBdHRyaWJ1dGUgdGhlIG5hbWUgb2YgdGhlIGRhdGEgYXR0cmlidXRlIHdpdGhvdXQgdGhlICdkYXRhLScgcHJlZml4XG4gICAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgb2YgdGhlIGRhdGEgYXR0cmlidXRlXG4gICAqL1xuICBkYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTTtcbiAgZGF0YShkYXRhQXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IERPTSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXREYXRhKGRhdGFBdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREYXRhKGRhdGFBdHRyaWJ1dGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGF0YShkYXRhQXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGRhdGFBdHRyaWJ1dGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXREYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS0nICsgZGF0YUF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgb25lIG9yIG1vcmUgRE9NIGVsZW1lbnRzIGFzIGNoaWxkcmVuIHRvIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGNoaWxkRWxlbWVudHMgdGhlIGNocmlsZCBlbGVtZW50cyB0byBhcHBlbmRcbiAgICogQHJldHVybnMge0RPTX1cbiAgICovXG4gIGFwcGVuZCguLi5jaGlsZEVsZW1lbnRzOiBET01bXSk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjaGlsZEVsZW1lbnRzLmZvckVhY2goKGNoaWxkRWxlbWVudCkgPT4ge1xuICAgICAgICBjaGlsZEVsZW1lbnQuZWxlbWVudHMuZm9yRWFjaCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkRWxlbWVudC5lbGVtZW50c1tpbmRleF0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGVsZW1lbnRzIGZyb20gdGhlIERPTS5cbiAgICovXG4gIHJlbW92ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvZmZzZXQgb2YgdGhlIGZpcnN0IGVsZW1lbnQgZnJvbSB0aGUgZG9jdW1lbnQncyB0b3AgbGVmdCBjb3JuZXIuXG4gICAqIEByZXR1cm5zIHtPZmZzZXR9XG4gICAqL1xuICBvZmZzZXQoKTogT2Zmc2V0IHtcbiAgICBsZXQgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbMF07XG4gICAgbGV0IGVsZW1lbnRSZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgaHRtbFJlY3QgPSBkb2N1bWVudC5ib2R5LnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAvLyBWaXJ0dWFsIHZpZXdwb3J0IHNjcm9sbCBoYW5kbGluZyAoZS5nLiBwaW5jaCB6b29tZWQgdmlld3BvcnRzIGluIG1vYmlsZSBicm93c2VycyBvciBkZXNrdG9wIENocm9tZS9FZGdlKVxuICAgIC8vICdub3JtYWwnIHpvb21zIGFuZCB2aXJ0dWFsIHZpZXdwb3J0IHpvb21zIChha2EgbGF5b3V0IHZpZXdwb3J0KSByZXN1bHQgaW4gZGlmZmVyZW50XG4gICAgLy8gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSByZXN1bHRzOlxuICAgIC8vICAtIHdpdGggbm9ybWFsIHNjcm9sbHMsIHRoZSBjbGllbnRSZWN0IGRlY3JlYXNlcyB3aXRoIGFuIGluY3JlYXNlIGluIHNjcm9sbChUb3B8TGVmdCkvcGFnZShYfFkpT2Zmc2V0XG4gICAgLy8gIC0gd2l0aCBwaW5jaCB6b29tIHNjcm9sbHMsIHRoZSBjbGllbnRSZWN0IHN0YXlzIHRoZSBzYW1lIHdoaWxlIHNjcm9sbC9wYWdlT2Zmc2V0IGNoYW5nZXNcbiAgICAvLyBUaGlzIG1lYW5zLCB0aGF0IHRoZSBjb21iaW5hdGlvbiBvZiBjbGllbnRSZWN0ICsgc2Nyb2xsL3BhZ2VPZmZzZXQgZG9lcyBub3Qgd29yayB0byBjYWxjdWxhdGUgdGhlIG9mZnNldFxuICAgIC8vIGZyb20gdGhlIGRvY3VtZW50J3MgdXBwZXIgbGVmdCBvcmlnaW4gd2hlbiBwaW5jaCB6b29tIGlzIHVzZWQuXG4gICAgLy8gVG8gd29yayBhcm91bmQgdGhpcyBpc3N1ZSwgd2UgZG8gbm90IHVzZSBzY3JvbGwvcGFnZU9mZnNldCBidXQgZ2V0IHRoZSBjbGllbnRSZWN0IG9mIHRoZSBodG1sIGVsZW1lbnQgYW5kXG4gICAgLy8gc3VidHJhY3QgaXQgZnJvbSB0aGUgZWxlbWVudCdzIHJlY3QsIHdoaWNoIGFsd2F5cyByZXN1bHRzIGluIHRoZSBvZmZzZXQgZnJvbSB0aGUgZG9jdW1lbnQgb3JpZ2luLlxuICAgIC8vIE5PVEU6IHRoZSBjdXJyZW50IHdheSBvZiBvZmZzZXQgY2FsY3VsYXRpb24gd2FzIGltcGxlbWVudGVkIHNwZWNpZmljYWxseSB0byB0cmFjayBldmVudCBwb3NpdGlvbnMgb24gdGhlXG4gICAgLy8gc2VlayBiYXIsIGFuZCBpdCBtaWdodCBicmVhayBjb21wYXRpYmlsaXR5IHdpdGggalF1ZXJ5J3Mgb2Zmc2V0KCkgbWV0aG9kLiBJZiB0aGlzIGV2ZXIgdHVybnMgb3V0IHRvIGJlIGFcbiAgICAvLyBwcm9ibGVtLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgcmV2ZXJ0ZWQgdG8gdGhlIG9sZCB2ZXJzaW9uIGFuZCB0aGUgb2Zmc2V0IGNhbGN1bGF0aW9uIG1vdmVkIHRvIHRoZSBzZWVrIGJhci5cblxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IGVsZW1lbnRSZWN0LnRvcCAtIGh0bWxSZWN0LnRvcCxcbiAgICAgIGxlZnQ6IGVsZW1lbnRSZWN0LmxlZnQgLSBodG1sUmVjdC5sZWZ0XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIHdpZHRoIG9mIHRoZSBmaXJzdCBlbGVtZW50XG4gICAqL1xuICB3aWR0aCgpOiBudW1iZXIge1xuICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhpcyBpcyB0aGUgc2FtZSBhcyBqUXVlcnkncyB3aWR0aCgpIChwcm9iYWJseSBub3QpXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHNbMF0ub2Zmc2V0V2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgaGVpZ2h0IG9mIHRoZSBmaXJzdCBlbGVtZW50XG4gICAqL1xuICBoZWlnaHQoKTogbnVtYmVyIHtcbiAgICAvLyBUT0RPIGNoZWNrIGlmIHRoaXMgaXMgdGhlIHNhbWUgYXMgalF1ZXJ5J3MgaGVpZ2h0KCkgKHByb2JhYmx5IG5vdClcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5vZmZzZXRIZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYW4gZXZlbnQgaGFuZGxlciB0byBvbmUgb3IgbW9yZSBldmVudHMgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gZXZlbnROYW1lIHRoZSBldmVudCBuYW1lIChvciBtdWx0aXBsZSBuYW1lcyBzZXBhcmF0ZWQgYnkgc3BhY2UpIHRvIGxpc3RlbiB0b1xuICAgKiBAcGFyYW0gZXZlbnRIYW5kbGVyIHRoZSBldmVudCBoYW5kbGVyIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnQgZmlyZXNcbiAgICogQHJldHVybnMge0RPTX1cbiAgICovXG4gIG9uKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3QpOiBET00ge1xuICAgIGxldCBldmVudHMgPSBldmVudE5hbWUuc3BsaXQoJyAnKTtcblxuICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudEhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW4gZXZlbnQgaGFuZGxlciBmcm9tIG9uZSBvciBtb3JlIGV2ZW50cyBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBldmVudE5hbWUgdGhlIGV2ZW50IG5hbWUgKG9yIG11bHRpcGxlIG5hbWVzIHNlcGFyYXRlZCBieSBzcGFjZSkgdG8gcmVtb3ZlIHRoZSBoYW5kbGVyIGZyb21cbiAgICogQHBhcmFtIGV2ZW50SGFuZGxlciB0aGUgZXZlbnQgaGFuZGxlciB0byByZW1vdmVcbiAgICogQHJldHVybnMge0RPTX1cbiAgICovXG4gIG9mZihldmVudE5hbWU6IHN0cmluZywgZXZlbnRIYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0KTogRE9NIHtcbiAgICBsZXQgZXZlbnRzID0gZXZlbnROYW1lLnNwbGl0KCcgJyk7XG5cbiAgICBldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgIGlmICh0aGlzLmVsZW1lbnRzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudEhhbmRsZXIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyB0byBkaXNwYXRjaCBicm93c2VyIGV2ZW50c1xuICAgKiBAcGFyYW0gZXZlbnRcbiAgICovXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnQ6IEV2ZW50KTogYW55IHtcbiAgICBpZiAodGhpcy5lbGVtZW50cyA9PSBudWxsKSB7XG4gICAgICB0aGlzLmRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoZGF0YTogYW55KTogYW55IHtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzbWFzaGN1dHBsYXllcnVpJywge2RldGFpbDogZGF0YSwgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZX0pKVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIHNwZWNpZmllZCBjbGFzcyhlcykgdG8gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lIHRoZSBjbGFzcyhlcykgdG8gYWRkLCBtdWx0aXBsZSBjbGFzc2VzIHNlcGFyYXRlZCBieSBzcGFjZVxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgYWRkQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpOiBET00ge1xuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZWQgdGhlIHNwZWNpZmllZCBjbGFzcyhlcykgZnJvbSBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgdGhlIGNsYXNzKGVzKSB0byByZW1vdmUsIG11bHRpcGxlIGNsYXNzZXMgc2VwYXJhdGVkIGJ5IHNwYWNlXG4gICAqIEByZXR1cm5zIHtET019XG4gICAqL1xuICByZW1vdmVDbGFzcyhjbGFzc05hbWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKFxuICAgICAgICAgIG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjbGFzc05hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYW55IG9mIHRoZSBlbGVtZW50cyBoYXMgdGhlIHNwZWNpZmllZCBjbGFzcy5cbiAgICogQHBhcmFtIGNsYXNzTmFtZSB0aGUgY2xhc3MgbmFtZSB0byBjaGVja1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBvbmUgb2YgdGhlIGVsZW1lbnRzIGhhcyB0aGUgY2xhc3MgYXR0YWNoZWQsIGVsc2UgaWYgbm8gZWxlbWVudCBoYXMgaXQgYXR0YWNoZWRcbiAgICovXG4gIGhhc0NsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgbGV0IGhhc0NsYXNzID0gZmFsc2U7XG5cbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgICAgICAgIC8vIFNpbmNlIHdlIGFyZSBpbnNpZGUgYSBoYW5kbGVyLCB3ZSBjYW4ndCBqdXN0ICdyZXR1cm4gdHJ1ZScuIEluc3RlYWQsIHdlIHNhdmUgaXQgdG8gYSB2YXJpYWJsZVxuICAgICAgICAgIC8vIGFuZCByZXR1cm4gaXQgYXQgdGhlIGVuZCBvZiB0aGUgZnVuY3Rpb24gYm9keS5cbiAgICAgICAgICBoYXNDbGFzcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAobmV3IFJlZ0V4cCgnKF58ICknICsgY2xhc3NOYW1lICsgJyggfCQpJywgJ2dpJykudGVzdChlbGVtZW50LmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAvLyBTZWUgY29tbWVudCBhYm92ZVxuICAgICAgICAgIGhhc0NsYXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhhc0NsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGEgQ1NTIHByb3BlcnR5IG9mIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIHRoZSBuYW1lIG9mIHRoZSBDU1MgcHJvcGVydHkgdG8gcmV0cmlldmUgdGhlIHZhbHVlIG9mXG4gICAqL1xuICBjc3MocHJvcGVydHlOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsO1xuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBDU1MgcHJvcGVydHkgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIHRoZSBuYW1lIG9mIHRoZSBDU1MgcHJvcGVydHkgdG8gc2V0IHRoZSB2YWx1ZSBmb3JcbiAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byBzZXQgZm9yIHRoZSBnaXZlbiBDU1MgcHJvcGVydHlcbiAgICovXG4gIGNzcyhwcm9wZXJ0eU5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTTtcbiAgLyoqXG4gICAqIFNldHMgYSBjb2xsZWN0aW9uIG9mIENTUyBwcm9wZXJ0aWVzIGFuZCB0aGVpciB2YWx1ZXMgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gcHJvcGVydHlWYWx1ZUNvbGxlY3Rpb24gYW4gb2JqZWN0IGNvbnRhaW5pbmcgcGFpcnMgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHRoZWlyIHZhbHVlc1xuICAgKi9cbiAgY3NzKHByb3BlcnR5VmFsdWVDb2xsZWN0aW9uOiB7IFtwcm9wZXJ0eU5hbWU6IHN0cmluZ106IHN0cmluZyB9KTogRE9NO1xuICBjc3MocHJvcGVydHlOYW1lT3JDb2xsZWN0aW9uOiBzdHJpbmcgfCB7IFtwcm9wZXJ0eU5hbWU6IHN0cmluZ106IHN0cmluZyB9LCB2YWx1ZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGwgfCBET00ge1xuICAgIGlmICh0eXBlb2YgcHJvcGVydHlOYW1lT3JDb2xsZWN0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZU9yQ29sbGVjdGlvbjtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q3NzKHByb3BlcnR5TmFtZSwgdmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENzcyhwcm9wZXJ0eU5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBwcm9wZXJ0eVZhbHVlQ29sbGVjdGlvbiA9IHByb3BlcnR5TmFtZU9yQ29sbGVjdGlvbjtcbiAgICAgIHJldHVybiB0aGlzLnNldENzc0NvbGxlY3Rpb24ocHJvcGVydHlWYWx1ZUNvbGxlY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q3NzKHByb3BlcnR5TmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50c1swXSlbPGFueT5wcm9wZXJ0eU5hbWVdO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRDc3MocHJvcGVydHlOYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBET00ge1xuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgLy8gPGFueT4gY2FzdCB0byByZXNvbHZlIFRTNzAxNTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzY2MjcxMTQvMzcwMjUyXG4gICAgICBlbGVtZW50LnN0eWxlWzxhbnk+cHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRDc3NDb2xsZWN0aW9uKHJ1bGVWYWx1ZUNvbGxlY3Rpb246IHsgW3J1bGVOYW1lOiBzdHJpbmddOiBzdHJpbmcgfSk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDQ5MDU3My8zNzAyNTJcbiAgICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwgcnVsZVZhbHVlQ29sbGVjdGlvbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiaW1wb3J0IHtBcnJheVV0aWxzfSBmcm9tICcuL3V0aWxzJztcbi8qKlxuICogRnVuY3Rpb24gaW50ZXJmYWNlIGZvciBldmVudCBsaXN0ZW5lcnMgb24gdGhlIHtAbGluayBFdmVudERpc3BhdGNoZXJ9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiB7XG4gIChzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncyk6IHZvaWQ7XG59XG5cbi8qKlxuICogRW1wdHkgdHlwZSBmb3IgY3JlYXRpbmcge0BsaW5rIEV2ZW50RGlzcGF0Y2hlciBldmVudCBkaXNwYXRjaGVyc30gdGhhdCBkbyBub3QgY2FycnkgYW55IGFyZ3VtZW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb0FyZ3Mge1xufVxuXG4vKipcbiAqIEV2ZW50IGFyZ3MgZm9yIGFuIGV2ZW50IHRoYXQgY2FuIGJlIGNhbmNlbGVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhbmNlbEV2ZW50QXJncyBleHRlbmRzIE5vQXJncyB7XG4gIC8qKlxuICAgKiBHZXRzIG9yIHNldHMgYSBmbGFnIHdoZXRoZXIgdGhlIGV2ZW50IHNob3VsZCBiZSBjYW5jZWxlZC5cbiAgICovXG4gIGNhbmNlbD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUHVibGljIGludGVyZmFjZSB0aGF0IHJlcHJlc2VudHMgYW4gZXZlbnQuIENhbiBiZSB1c2VkIHRvIHN1YnNjcmliZSB0byBhbmQgdW5zdWJzY3JpYmUgZnJvbSBldmVudHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnQ8U2VuZGVyLCBBcmdzPiB7XG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoaXMgZXZlbnQgZGlzcGF0Y2hlci5cbiAgICogQHBhcmFtIGxpc3RlbmVyIHRoZSBsaXN0ZW5lciB0byBhZGRcbiAgICovXG4gIHN1YnNjcmliZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KTogdm9pZDtcblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGlzIGV2ZW50IGRpc3BhdGNoZXIgdGhhdCBpcyBvbmx5IGNhbGxlZCBvbmNlLlxuICAgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGFkZFxuICAgKi9cbiAgc3Vic2NyaWJlT25jZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KTogdm9pZDtcblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGlzIGV2ZW50IGRpc3BhdGNoZXIgdGhhdCB3aWxsIGJlIGNhbGxlZCBhdCBhIGxpbWl0ZWQgcmF0ZSB3aXRoIGEgbWluaW11bVxuICAgKiBpbnRlcnZhbCBvZiB0aGUgc3BlY2lmaWVkIG1pbGxpc2Vjb25kcy5cbiAgICogQHBhcmFtIGxpc3RlbmVyIHRoZSBsaXN0ZW5lciB0byBhZGRcbiAgICogQHBhcmFtIHJhdGVNcyB0aGUgcmF0ZSBpbiBtaWxsaXNlY29uZHMgdG8gd2hpY2ggY2FsbGluZyBvZiB0aGUgbGlzdGVuZXJzIHNob3VsZCBiZSBsaW1pdGVkXG4gICAqL1xuICBzdWJzY3JpYmVSYXRlTGltaXRlZChsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+LCByYXRlTXM6IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlcyBhIHN1YnNjcmliZWQgZXZlbnQgbGlzdGVuZXIgZnJvbSB0aGlzIGRpc3BhdGNoZXIuXG4gICAqIEBwYXJhbSBsaXN0ZW5lciB0aGUgbGlzdGVuZXIgdG8gcmVtb3ZlXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBsaXN0ZW5lciB3YXMgc3VjY2Vzc2Z1bGx5IHVuc3Vic2NyaWJlZCwgZmFsc2UgaWYgaXQgaXNuJ3Qgc3Vic2NyaWJlZCBvbiB0aGlzXG4gICAqICAgZGlzcGF0Y2hlclxuICAgKi9cbiAgdW5zdWJzY3JpYmUobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPik6IGJvb2xlYW47XG59XG5cbi8qKlxuICogRXZlbnQgZGlzcGF0Y2hlciB0byBzdWJzY3JpYmUgYW5kIHRyaWdnZXIgZXZlbnRzLiBFYWNoIGV2ZW50IHNob3VsZCBoYXZlIGl0cyBvd24gZGlzcGF0Y2hlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50RGlzcGF0Y2hlcjxTZW5kZXIsIEFyZ3M+IGltcGxlbWVudHMgRXZlbnQ8U2VuZGVyLCBBcmdzPiB7XG5cbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IEV2ZW50TGlzdGVuZXJXcmFwcGVyPFNlbmRlciwgQXJncz5bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvY31cbiAgICovXG4gIHN1YnNjcmliZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KSB7XG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChuZXcgRXZlbnRMaXN0ZW5lcldyYXBwZXIobGlzdGVuZXIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2N9XG4gICAqL1xuICBzdWJzY3JpYmVPbmNlKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4pIHtcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKG5ldyBFdmVudExpc3RlbmVyV3JhcHBlcihsaXN0ZW5lciwgdHJ1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvY31cbiAgICovXG4gIHN1YnNjcmliZVJhdGVMaW1pdGVkKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4sIHJhdGVNczogbnVtYmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChuZXcgUmF0ZUxpbWl0ZWRFdmVudExpc3RlbmVyV3JhcHBlcihsaXN0ZW5lciwgcmF0ZU1zKSk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jfVxuICAgKi9cbiAgdW5zdWJzY3JpYmUobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPik6IGJvb2xlYW4ge1xuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBsaXN0ZW5lcnMsIGNvbXBhcmUgd2l0aCBwYXJhbWV0ZXIsIGFuZCByZW1vdmUgaWYgZm91bmRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgc3Vic2NyaWJlZExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcnNbaV07XG4gICAgICBpZiAoc3Vic2NyaWJlZExpc3RlbmVyLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmxpc3RlbmVycywgc3Vic2NyaWJlZExpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIHRoaXMgZGlzcGF0Y2hlci5cbiAgICovXG4gIHVuc3Vic2NyaWJlQWxsKCk6IHZvaWQge1xuICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhbiBldmVudCB0byBhbGwgc3Vic2NyaWJlZCBsaXN0ZW5lcnMuXG4gICAqIEBwYXJhbSBzZW5kZXIgdGhlIHNvdXJjZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIGFyZ3MgdGhlIGFyZ3VtZW50cyBmb3IgdGhlIGV2ZW50XG4gICAqL1xuICBkaXNwYXRjaChzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncyA9IG51bGwpIHtcbiAgICBsZXQgbGlzdGVuZXJzVG9SZW1vdmUgPSBbXTtcblxuICAgIC8vIENhbGwgZXZlcnkgbGlzdGVuZXJcbiAgICBmb3IgKGxldCBsaXN0ZW5lciBvZiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIuZmlyZShzZW5kZXIsIGFyZ3MpO1xuXG4gICAgICBpZiAobGlzdGVuZXIuaXNPbmNlKCkpIHtcbiAgICAgICAgbGlzdGVuZXJzVG9SZW1vdmUucHVzaChsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVyXG4gICAgZm9yIChsZXQgbGlzdGVuZXJUb1JlbW92ZSBvZiBsaXN0ZW5lcnNUb1JlbW92ZSkge1xuICAgICAgQXJyYXlVdGlscy5yZW1vdmUodGhpcy5saXN0ZW5lcnMsIGxpc3RlbmVyVG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBldmVudCB0aGF0IHRoaXMgZGlzcGF0Y2hlciBtYW5hZ2VzIGFuZCBvbiB3aGljaCBsaXN0ZW5lcnMgY2FuIHN1YnNjcmliZSBhbmQgdW5zdWJzY3JpYmUgZXZlbnQgaGFuZGxlcnMuXG4gICAqIEByZXR1cm5zIHtFdmVudH1cbiAgICovXG4gIGdldEV2ZW50KCk6IEV2ZW50PFNlbmRlciwgQXJncz4ge1xuICAgIC8vIEZvciBub3csIGp1c3QgY2FzdCB0aGUgZXZlbnQgZGlzcGF0Y2hlciB0byB0aGUgZXZlbnQgaW50ZXJmYWNlLiBBdCBzb21lIHBvaW50IGluIHRoZSBmdXR1cmUgd2hlbiB0aGVcbiAgICAvLyBjb2RlYmFzZSBncm93cywgaXQgbWlnaHQgbWFrZSBzZW5zZSB0byBzcGxpdCB0aGUgZGlzcGF0Y2hlciBpbnRvIHNlcGFyYXRlIGRpc3BhdGNoZXIgYW5kIGV2ZW50IGNsYXNzZXMuXG4gICAgcmV0dXJuIDxFdmVudDxTZW5kZXIsIEFyZ3M+PnRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGJhc2ljIGV2ZW50IGxpc3RlbmVyIHdyYXBwZXIgdG8gbWFuYWdlIGxpc3RlbmVycyB3aXRoaW4gdGhlIHtAbGluayBFdmVudERpc3BhdGNoZXJ9LiBUaGlzIGlzIGEgJ3ByaXZhdGUnIGNsYXNzXG4gKiBmb3IgaW50ZXJuYWwgZGlzcGF0Y2hlciB1c2UgYW5kIGl0IGlzIHRoZXJlZm9yZSBub3QgZXhwb3J0ZWQuXG4gKi9cbmNsYXNzIEV2ZW50TGlzdGVuZXJXcmFwcGVyPFNlbmRlciwgQXJncz4ge1xuXG4gIHByaXZhdGUgZXZlbnRMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+O1xuICBwcml2YXRlIG9uY2U6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiwgb25jZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5ldmVudExpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgdGhpcy5vbmNlID0gb25jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3cmFwcGVkIGV2ZW50IGxpc3RlbmVyLlxuICAgKiBAcmV0dXJucyB7RXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+fVxuICAgKi9cbiAgZ2V0IGxpc3RlbmVyKCk6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRMaXN0ZW5lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB0aGUgd3JhcHBlZCBldmVudCBsaXN0ZW5lciB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMuXG4gICAqIEBwYXJhbSBzZW5kZXJcbiAgICogQHBhcmFtIGFyZ3NcbiAgICovXG4gIGZpcmUoc2VuZGVyOiBTZW5kZXIsIGFyZ3M6IEFyZ3MpIHtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXIoc2VuZGVyLCBhcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhpcyBsaXN0ZW5lciBpcyBzY2hlZHVsZWQgdG8gYmUgY2FsbGVkIG9ubHkgb25jZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IG9uY2UgaWYgdHJ1ZVxuICAgKi9cbiAgaXNPbmNlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9uY2U7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRlbmRzIHRoZSBiYXNpYyB7QGxpbmsgRXZlbnRMaXN0ZW5lcldyYXBwZXJ9IHdpdGggcmF0ZS1saW1pdGluZyBmdW5jdGlvbmFsaXR5LlxuICovXG5jbGFzcyBSYXRlTGltaXRlZEV2ZW50TGlzdGVuZXJXcmFwcGVyPFNlbmRlciwgQXJncz4gZXh0ZW5kcyBFdmVudExpc3RlbmVyV3JhcHBlcjxTZW5kZXIsIEFyZ3M+IHtcblxuICBwcml2YXRlIHJhdGVNczogbnVtYmVyO1xuICBwcml2YXRlIHJhdGVMaW1pdGluZ0V2ZW50TGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPjtcblxuICBwcml2YXRlIGxhc3RGaXJlVGltZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4sIHJhdGVNczogbnVtYmVyKSB7XG4gICAgc3VwZXIobGlzdGVuZXIpOyAvLyBzZXRzIHRoZSBldmVudCBsaXN0ZW5lciBzaW5rXG5cbiAgICB0aGlzLnJhdGVNcyA9IHJhdGVNcztcbiAgICB0aGlzLmxhc3RGaXJlVGltZSA9IDA7XG5cbiAgICAvLyBXcmFwIHRoZSBldmVudCBsaXN0ZW5lciB3aXRoIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgZG9lcyB0aGUgcmF0ZS1saW1pdGluZ1xuICAgIHRoaXMucmF0ZUxpbWl0aW5nRXZlbnRMaXN0ZW5lciA9IChzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncykgPT4ge1xuICAgICAgaWYgKERhdGUubm93KCkgLSB0aGlzLmxhc3RGaXJlVGltZSA+IHRoaXMucmF0ZU1zKSB7XG4gICAgICAgIC8vIE9ubHkgaWYgZW5vdWdoIHRpbWUgc2luY2UgdGhlIHByZXZpb3VzIGNhbGwgaGFzIHBhc3NlZCwgY2FsbCB0aGVcbiAgICAgICAgLy8gYWN0dWFsIGV2ZW50IGxpc3RlbmVyIGFuZCByZWNvcmQgdGhlIGN1cnJlbnQgdGltZVxuICAgICAgICB0aGlzLmZpcmVTdXBlcihzZW5kZXIsIGFyZ3MpO1xuICAgICAgICB0aGlzLmxhc3RGaXJlVGltZSA9IERhdGUubm93KCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZmlyZVN1cGVyKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzKSB7XG4gICAgLy8gRmlyZSB0aGUgYWN0dWFsIGV4dGVybmFsIGV2ZW50IGxpc3RlbmVyXG4gICAgc3VwZXIuZmlyZShzZW5kZXIsIGFyZ3MpO1xuICB9XG5cbiAgZmlyZShzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncykge1xuICAgIC8vIEZpcmUgdGhlIGludGVybmFsIHJhdGUtbGltaXRpbmcgbGlzdGVuZXIgaW5zdGVhZCBvZiB0aGUgZXh0ZXJuYWwgZXZlbnQgbGlzdGVuZXJcbiAgICB0aGlzLnJhdGVMaW1pdGluZ0V2ZW50TGlzdGVuZXIoc2VuZGVyLCBhcmdzKTtcbiAgfVxufSIsImV4cG9ydCBuYW1lc3BhY2UgR3VpZCB7XG5cbiAgbGV0IGd1aWQgPSAxO1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBuZXh0KCkge1xuICAgIHJldHVybiBndWlkKys7XG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9J3BsYXllci5kLnRzJyAvPlxuaW1wb3J0IHtVSU1hbmFnZXIsIFVJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuL3VpbWFuYWdlcic7XG5pbXBvcnQge0J1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2J1dHRvbic7XG5pbXBvcnQge0NvbnRyb2xCYXJ9IGZyb20gJy4vY29tcG9uZW50cy9jb250cm9sYmFyJztcbmltcG9ydCB7RnVsbHNjcmVlblRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bGxzY3JlZW50b2dnbGVidXR0b24nO1xuaW1wb3J0IHtIdWdlUGxheWJhY2tUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9odWdlcGxheWJhY2t0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtQbGF5YmFja1RpbWVMYWJlbCwgUGxheWJhY2tUaW1lTGFiZWxNb2RlfSBmcm9tICcuL2NvbXBvbmVudHMvcGxheWJhY2t0aW1lbGFiZWwnO1xuaW1wb3J0IHtQbGF5YmFja1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U2Vla0Jhcn0gZnJvbSAnLi9jb21wb25lbnRzL3NlZWtiYXInO1xuaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3Rib3gnO1xuaW1wb3J0IHtTZXR0aW5nc1BhbmVsLCBTZXR0aW5nc1BhbmVsSXRlbX0gZnJvbSAnLi9jb21wb25lbnRzL3NldHRpbmdzcGFuZWwnO1xuaW1wb3J0IHtTZXR0aW5nc1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3NldHRpbmdzdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VmlkZW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvdmlkZW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7Vm9sdW1lVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1ldG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VlJUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy92cnRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1dhdGVybWFya30gZnJvbSAnLi9jb21wb25lbnRzL3dhdGVybWFyayc7XG5pbXBvcnQge1VJQ29udGFpbmVyfSBmcm9tICcuL2NvbXBvbmVudHMvdWljb250YWluZXInO1xuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL2xhYmVsJztcbmltcG9ydCB7QXVkaW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvYXVkaW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7QXVkaW9UcmFja1NlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL2F1ZGlvdHJhY2tzZWxlY3Rib3gnO1xuaW1wb3J0IHtDYXN0U3RhdHVzT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3RzdGF0dXNvdmVybGF5JztcbmltcG9ydCB7Q2FzdFRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3R0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9jb21wb25lbnQnO1xuaW1wb3J0IHtFcnJvck1lc3NhZ2VPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JtZXNzYWdlb3ZlcmxheSc7XG5pbXBvcnQge1JlY29tbWVuZGF0aW9uT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3JlY29tbWVuZGF0aW9ub3ZlcmxheSc7XG5pbXBvcnQge1NlZWtCYXJMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL3NlZWtiYXJsYWJlbCc7XG5pbXBvcnQge1N1YnRpdGxlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3N1YnRpdGxlb3ZlcmxheSc7XG5pbXBvcnQge1N1YnRpdGxlU2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvc3VidGl0bGVzZWxlY3Rib3gnO1xuaW1wb3J0IHtUaXRsZUJhcn0gZnJvbSAnLi9jb21wb25lbnRzL3RpdGxlYmFyJztcbmltcG9ydCB7Vm9sdW1lQ29udHJvbEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZWNvbnRyb2xidXR0b24nO1xuaW1wb3J0IHtDbGlja092ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9jbGlja292ZXJsYXknO1xuaW1wb3J0IHtBZFNraXBCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9hZHNraXBidXR0b24nO1xuaW1wb3J0IHtBZE1lc3NhZ2VMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL2FkbWVzc2FnZWxhYmVsJztcbmltcG9ydCB7QWRDbGlja092ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9hZGNsaWNrb3ZlcmxheSc7XG5pbXBvcnQge1BsYXliYWNrU3BlZWRTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9wbGF5YmFja3NwZWVkc2VsZWN0Ym94JztcbmltcG9ydCB7SHVnZVJlcGxheUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2h1Z2VyZXBsYXlidXR0b24nO1xuaW1wb3J0IHtCdWZmZXJpbmdPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvYnVmZmVyaW5nb3ZlcmxheSc7XG5pbXBvcnQge0Nhc3RVSUNvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3R1aWNvbnRhaW5lcic7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlb3ZlcmxheSc7XG5pbXBvcnQge0Nsb3NlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2xvc2VidXR0b24nO1xuaW1wb3J0IHtNZXRhZGF0YUxhYmVsLCBNZXRhZGF0YUxhYmVsQ29udGVudH0gZnJvbSAnLi9jb21wb25lbnRzL21ldGFkYXRhbGFiZWwnO1xuaW1wb3J0IHtBaXJQbGF5VG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvYWlycGxheXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1ZvbHVtZVNsaWRlcn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZXNsaWRlcic7XG5pbXBvcnQge1BpY3R1cmVJblBpY3R1cmVUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9waWN0dXJlaW5waWN0dXJldG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U3BhY2VyfSBmcm9tICcuL2NvbXBvbmVudHMvc3BhY2VyJztcbmltcG9ydCB7QXJyYXlVdGlscywgU3RyaW5nVXRpbHMsIFBsYXllclV0aWxzLCBVSVV0aWxzLCBCcm93c2VyVXRpbHN9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyBPYmplY3QuYXNzaWduIHBvbHlmaWxsIGZvciBFUzUvSUU5XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kZS9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG5pZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gIT09ICdmdW5jdGlvbicpIHtcbiAgT2JqZWN0LmFzc2lnbiA9IGZ1bmN0aW9uKHRhcmdldDogYW55KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGlmICh0YXJnZXQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgfVxuXG4gICAgdGFyZ2V0ID0gT2JqZWN0KHRhcmdldCk7XG4gICAgZm9yIChsZXQgaW5kZXggPSAxOyBpbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGxldCBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcbn1cblxuLy8gRXhwb3NlIGNsYXNzZXMgdG8gd2luZG93XG4od2luZG93IGFzIGFueSkuYml0bW92aW4ucGxheWVydWkgPSB7XG4gIC8vIE1hbmFnZW1lbnRcbiAgVUlNYW5hZ2VyLFxuICBVSUluc3RhbmNlTWFuYWdlcixcbiAgLy8gVXRpbHNcbiAgQXJyYXlVdGlscyxcbiAgU3RyaW5nVXRpbHMsXG4gIFBsYXllclV0aWxzLFxuICBVSVV0aWxzLFxuICBCcm93c2VyVXRpbHMsXG4gIC8vIENvbXBvbmVudHNcbiAgQWRDbGlja092ZXJsYXksXG4gIEFkTWVzc2FnZUxhYmVsLFxuICBBZFNraXBCdXR0b24sXG4gIEFpclBsYXlUb2dnbGVCdXR0b24sXG4gIEF1ZGlvUXVhbGl0eVNlbGVjdEJveCxcbiAgQXVkaW9UcmFja1NlbGVjdEJveCxcbiAgQnVmZmVyaW5nT3ZlcmxheSxcbiAgQnV0dG9uLFxuICBDYXN0U3RhdHVzT3ZlcmxheSxcbiAgQ2FzdFRvZ2dsZUJ1dHRvbixcbiAgQ2FzdFVJQ29udGFpbmVyLFxuICBDbGlja092ZXJsYXksXG4gIENsb3NlQnV0dG9uLFxuICBDb21wb25lbnQsXG4gIENvbnRhaW5lcixcbiAgQ29udHJvbEJhcixcbiAgRXJyb3JNZXNzYWdlT3ZlcmxheSxcbiAgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbixcbiAgSHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9uLFxuICBIdWdlUmVwbGF5QnV0dG9uLFxuICBMYWJlbCxcbiAgTWV0YWRhdGFMYWJlbCxcbiAgTWV0YWRhdGFMYWJlbENvbnRlbnQsXG4gIFBpY3R1cmVJblBpY3R1cmVUb2dnbGVCdXR0b24sXG4gIFBsYXliYWNrU3BlZWRTZWxlY3RCb3gsXG4gIFBsYXliYWNrVGltZUxhYmVsLFxuICBQbGF5YmFja1RpbWVMYWJlbE1vZGUsXG4gIFBsYXliYWNrVG9nZ2xlQnV0dG9uLFxuICBQbGF5YmFja1RvZ2dsZU92ZXJsYXksXG4gIFJlY29tbWVuZGF0aW9uT3ZlcmxheSxcbiAgU2Vla0JhcixcbiAgU2Vla0JhckxhYmVsLFxuICBTZWxlY3RCb3gsXG4gIFNldHRpbmdzUGFuZWwsXG4gIFNldHRpbmdzUGFuZWxJdGVtLFxuICBTZXR0aW5nc1RvZ2dsZUJ1dHRvbixcbiAgU3BhY2VyLFxuICBTdWJ0aXRsZU92ZXJsYXksXG4gIFN1YnRpdGxlU2VsZWN0Qm94LFxuICBUaXRsZUJhcixcbiAgVG9nZ2xlQnV0dG9uLFxuICBVSUNvbnRhaW5lcixcbiAgVmlkZW9RdWFsaXR5U2VsZWN0Qm94LFxuICBWb2x1bWVDb250cm9sQnV0dG9uLFxuICBWb2x1bWVTbGlkZXIsXG4gIFZvbHVtZVRvZ2dsZUJ1dHRvbixcbiAgVlJUb2dnbGVCdXR0b24sXG4gIFdhdGVybWFyayxcbn07IiwiLy8gVE9ETyBjaGFuZ2UgdG8gaW50ZXJuYWwgKG5vdCBleHBvcnRlZCkgY2xhc3MsIGhvdyB0byB1c2UgaW4gb3RoZXIgZmlsZXM/XG4vKipcbiAqIEV4ZWN1dGVzIGEgY2FsbGJhY2sgYWZ0ZXIgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUsXG4gKiBvcHRpb25hbGx5IHJlcGVhdGVkbHkgdW50aWwgc3RvcHBlZC4gV2hlbiBkZWxheSBpcyA8PSAwXG4gKiB0aGUgdGltZW91dCBpcyBkaXNhYmxlZFxuICovXG5leHBvcnQgY2xhc3MgVGltZW91dCB7XG5cbiAgcHJpdmF0ZSBkZWxheTogbnVtYmVyO1xuICBwcml2YXRlIGNhbGxiYWNrOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIHJlcGVhdDogYm9vbGVhbjtcbiAgcHJpdmF0ZSB0aW1lb3V0SGFuZGxlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgdGltZW91dCBjYWxsYmFjayBoYW5kbGVyLlxuICAgKiBAcGFyYW0gZGVsYXkgdGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgY2FsbGJhY2sgc2hvdWxkIGJlIGV4ZWN1dGVkXG4gICAqIEBwYXJhbSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBhZnRlciB0aGUgZGVsYXkgdGltZVxuICAgKiBAcGFyYW0gcmVwZWF0IGlmIHRydWUsIGNhbGwgdGhlIGNhbGxiYWNrIHJlcGVhdGVkbHkgaW4gZGVsYXkgaW50ZXJ2YWxzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZWxheTogbnVtYmVyLCBjYWxsYmFjazogKCkgPT4gdm9pZCwgcmVwZWF0OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMucmVwZWF0ID0gcmVwZWF0O1xuICAgIHRoaXMudGltZW91dEhhbmRsZSA9IDA7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSB0aW1lb3V0IGFuZCBjYWxscyB0aGUgY2FsbGJhY2sgd2hlbiB0aGUgdGltZW91dCBkZWxheSBoYXMgcGFzc2VkLlxuICAgKiBAcmV0dXJucyB7VGltZW91dH0gdGhlIGN1cnJlbnQgdGltZW91dCAoc28gdGhlIHN0YXJ0IGNhbGwgY2FuIGJlIGNoYWluZWQgdG8gdGhlIGNvbnN0cnVjdG9yKVxuICAgKi9cbiAgc3RhcnQoKTogdGhpcyB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgdGltZW91dC4gVGhlIGNhbGxiYWNrIHdpbGwgbm90IGJlIGNhbGxlZCBpZiBjbGVhciBpcyBjYWxsZWQgZHVyaW5nIHRoZSB0aW1lb3V0LlxuICAgKi9cbiAgY2xlYXIoKTogdm9pZCB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dEhhbmRsZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBwYXNzZWQgdGltZW91dCBkZWxheSB0byB6ZXJvLiBDYW4gYmUgdXNlZCB0byBkZWZlciB0aGUgY2FsbGluZyBvZiB0aGUgY2FsbGJhY2suXG4gICAqL1xuICByZXNldCgpOiB2b2lkIHtcbiAgICBsZXQgbGFzdFNjaGVkdWxlVGltZSA9IDA7XG4gICAgbGV0IGRlbGF5QWRqdXN0ID0gMDtcblxuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIGxldCBpbnRlcm5hbENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpcy5jYWxsYmFjaygpO1xuXG4gICAgICBpZiAodGhpcy5yZXBlYXQpIHtcbiAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICAgICAgLy8gVGhlIHRpbWUgb2Ygb25lIGl0ZXJhdGlvbiBmcm9tIHNjaGVkdWxpbmcgdG8gZXhlY3V0aW5nIHRoZSBjYWxsYmFjayAodXN1YWxseSBhIGJpdCBsb25nZXIgdGhhbiB0aGUgZGVsYXlcbiAgICAgICAgLy8gdGltZSlcbiAgICAgICAgbGV0IGRlbHRhID0gbm93IC0gbGFzdFNjaGVkdWxlVGltZTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRlbGF5IGFkanVzdG1lbnQgZm9yIHRoZSBuZXh0IHNjaGVkdWxlIHRvIGtlZXAgYSBzdGVhZHkgZGVsYXkgaW50ZXJ2YWwgb3ZlciB0aW1lXG4gICAgICAgIGRlbGF5QWRqdXN0ID0gdGhpcy5kZWxheSAtIGRlbHRhICsgZGVsYXlBZGp1c3Q7XG5cbiAgICAgICAgbGFzdFNjaGVkdWxlVGltZSA9IG5vdztcblxuICAgICAgICAvLyBTY2hlZHVsZSBuZXh0IGV4ZWN1dGlvbiBieSB0aGUgYWRqdXN0ZWQgZGVsYXlcbiAgICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChpbnRlcm5hbENhbGxiYWNrLCB0aGlzLmRlbGF5ICsgZGVsYXlBZGp1c3QpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsYXN0U2NoZWR1bGVUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBpZiAodGhpcy5kZWxheSA+IDApIHtcbiAgICAgIHRoaXMudGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaW50ZXJuYWxDYWxsYmFjaywgdGhpcy5kZWxheSk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtVSUNvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL3VpY29udGFpbmVyJztcbmltcG9ydCB7RE9NfSBmcm9tICcuL2RvbSc7XG5pbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudHMvY29tcG9uZW50JztcbmltcG9ydCB7Q29udGFpbmVyfSBmcm9tICcuL2NvbXBvbmVudHMvY29udGFpbmVyJztcbmltcG9ydCB7UGxheWJhY2tUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9wbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0Z1bGxzY3JlZW5Ub2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9mdWxsc2NyZWVudG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VlJUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy92cnRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1ZvbHVtZVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1NlZWtCYXJ9IGZyb20gJy4vY29tcG9uZW50cy9zZWVrYmFyJztcbmltcG9ydCB7UGxheWJhY2tUaW1lTGFiZWwsIFBsYXliYWNrVGltZUxhYmVsTW9kZX0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdGltZWxhYmVsJztcbmltcG9ydCB7Q29udHJvbEJhcn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRyb2xiYXInO1xuaW1wb3J0IHtOb0FyZ3MsIEV2ZW50RGlzcGF0Y2hlciwgQ2FuY2VsRXZlbnRBcmdzfSBmcm9tICcuL2V2ZW50ZGlzcGF0Y2hlcic7XG5pbXBvcnQge0VtYmVkVmlkZW9Ub2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9lbWJlZHZpZGVvdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7RW1iZWRWaWRlb1BhbmVsfSBmcm9tICcuL2NvbXBvbmVudHMvZW1iZWR2aWRlb3BhbmVsJztcbmltcG9ydCB7U2V0dGluZ3NUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9zZXR0aW5nc3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1NldHRpbmdzUGFuZWwsIFNldHRpbmdzUGFuZWxJdGVtfSBmcm9tICcuL2NvbXBvbmVudHMvc2V0dGluZ3NwYW5lbCc7XG5pbXBvcnQge1ZpZGVvUXVhbGl0eVNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3ZpZGVvcXVhbGl0eXNlbGVjdGJveCc7XG5pbXBvcnQge1dhdGVybWFya30gZnJvbSAnLi9jb21wb25lbnRzL3dhdGVybWFyayc7XG5pbXBvcnQge0F1ZGlvUXVhbGl0eVNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL2F1ZGlvcXVhbGl0eXNlbGVjdGJveCc7XG5pbXBvcnQge0F1ZGlvVHJhY2tTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9hdWRpb3RyYWNrc2VsZWN0Ym94JztcbmltcG9ydCB7U2Vla0JhckxhYmVsfSBmcm9tICcuL2NvbXBvbmVudHMvc2Vla2JhcmxhYmVsJztcbmltcG9ydCB7Vm9sdW1lU2xpZGVyfSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1lc2xpZGVyJztcbmltcG9ydCB7U3VidGl0bGVTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9zdWJ0aXRsZXNlbGVjdGJveCc7XG5pbXBvcnQge1N1YnRpdGxlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3N1YnRpdGxlb3ZlcmxheSc7XG5pbXBvcnQge1ZvbHVtZUNvbnRyb2xCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy92b2x1bWVjb250cm9sYnV0dG9uJztcbmltcG9ydCB7Q2FzdFRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3R0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtDYXN0U3RhdHVzT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3RzdGF0dXNvdmVybGF5JztcbmltcG9ydCB7RXJyb3JNZXNzYWdlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9ybWVzc2FnZW92ZXJsYXknO1xuaW1wb3J0IHtUaXRsZUJhcn0gZnJvbSAnLi9jb21wb25lbnRzL3RpdGxlYmFyJztcbmltcG9ydCBQbGF5ZXJBUEkgPSBiaXRtb3Zpbi5QbGF5ZXJBUEk7XG5pbXBvcnQge1JlY29tbWVuZGF0aW9uT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3JlY29tbWVuZGF0aW9ub3ZlcmxheSc7XG5pbXBvcnQge0FkTWVzc2FnZUxhYmVsfSBmcm9tICcuL2NvbXBvbmVudHMvYWRtZXNzYWdlbGFiZWwnO1xuaW1wb3J0IHtBZFNraXBCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9hZHNraXBidXR0b24nO1xuaW1wb3J0IHtBZENsaWNrT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2FkY2xpY2tvdmVybGF5JztcbmltcG9ydCBFVkVOVCA9IGJpdG1vdmluLlBsYXllckFQSS5FVkVOVDtcbmltcG9ydCBQbGF5ZXJFdmVudENhbGxiYWNrID0gYml0bW92aW4uUGxheWVyQVBJLlBsYXllckV2ZW50Q2FsbGJhY2s7XG5pbXBvcnQgQWRTdGFydGVkRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuQWRTdGFydGVkRXZlbnQ7XG5pbXBvcnQge0FycmF5VXRpbHMsIFVJVXRpbHMsIEJyb3dzZXJVdGlsc30gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1BsYXliYWNrU3BlZWRTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9wbGF5YmFja3NwZWVkc2VsZWN0Ym94JztcbmltcG9ydCB7QnVmZmVyaW5nT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2J1ZmZlcmluZ292ZXJsYXknO1xuaW1wb3J0IHtDYXN0VUlDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy9jYXN0dWljb250YWluZXInO1xuaW1wb3J0IHtQbGF5YmFja1RvZ2dsZU92ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9wbGF5YmFja3RvZ2dsZW92ZXJsYXknO1xuaW1wb3J0IHtDbG9zZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Nsb3NlYnV0dG9uJztcbmltcG9ydCB7TWV0YWRhdGFMYWJlbCwgTWV0YWRhdGFMYWJlbENvbnRlbnR9IGZyb20gJy4vY29tcG9uZW50cy9tZXRhZGF0YWxhYmVsJztcbmltcG9ydCB7TGFiZWx9IGZyb20gJy4vY29tcG9uZW50cy9sYWJlbCc7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5pbXBvcnQge0FpclBsYXlUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9haXJwbGF5dG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7UGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3BpY3R1cmVpbnBpY3R1cmV0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtTcGFjZXJ9IGZyb20gJy4vY29tcG9uZW50cy9zcGFjZXInO1xuaW1wb3J0IHtDb21tZW50c1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbW1lbnRzdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7Q2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Nsb3NlZGNhcHRpb25pbmd0b2dnbGVidXR0b24nO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgVUlSZWNvbW1lbmRhdGlvbkNvbmZpZyB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aHVtYm5haWw/OiBzdHJpbmc7XG4gIGR1cmF0aW9uPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVJRW1iZWRWaWRlb0NvbmZpZyB7XG4gIGRlZmF1bHQ6IHN0cmluZztcbiAgd2l0aENvbW1lbnRzPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVsaW5lTWFya2VyIHtcbiAgdGltZTogbnVtYmVyO1xuICB0aXRsZT86IHN0cmluZztcbiAgbWFya2VyVHlwZT86IHN0cmluZztcbiAgY29tbWVudD86IHN0cmluZztcbiAgYXZhdGFyPzogc3RyaW5nO1xuICBudW1iZXI/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVUlDb25maWcge1xuICBtZXRhZGF0YT86IHtcbiAgICB0aXRsZT86IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgICBtYXJrZXJzPzogVGltZWxpbmVNYXJrZXJbXTtcbiAgICBlbWJlZFZpZGVvPzogVUlFbWJlZFZpZGVvQ29uZmlnO1xuICB9O1xuICByZWNvbW1lbmRhdGlvbnM/OiBVSVJlY29tbWVuZGF0aW9uQ29uZmlnW107XG59XG5cbi8qKlxuICogVGhlIGNvbnRleHQgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byBhIHtAbGluayBVSUNvbmRpdGlvblJlc29sdmVyfSB0byBkZXRlcm1pbmUgaWYgaXQncyBjb25kaXRpb25zIGZ1bGZpbCB0aGUgY29udGV4dC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVSUNvbmRpdGlvbkNvbnRleHQge1xuICBpc0FkOiBib29sZWFuO1xuICBpc0FkV2l0aFVJOiBib29sZWFuO1xuICBpc0Z1bGxzY3JlZW46IGJvb2xlYW47XG4gIGlzTW9iaWxlOiBib29sZWFuO1xuICBkb2N1bWVudFdpZHRoOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGNvbmRpdGlvbnMgb2YgaXRzIGFzc29jaWF0ZWQgVUkgaW4gYSB7QGxpbmsgVUlWYXJpYW50fSB1cG9uIGEge0BsaW5rIFVJQ29uZGl0aW9uQ29udGV4dH0gYW5kIGRlY2lkZXNcbiAqIGlmIHRoZSBVSSBzaG91bGQgYmUgZGlzcGxheWVkLiBJZiBpdCByZXR1cm5zIHRydWUsIHRoZSBVSSBpcyBhIGNhbmRpZGF0ZSBmb3IgZGlzcGxheTsgaWYgaXQgcmV0dXJucyBmYWxzZSwgaXQgd2lsbFxuICogbm90IGJlIGRpc3BsYXllZCBpbiB0aGUgZ2l2ZW4gY29udGV4dC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVSUNvbmRpdGlvblJlc29sdmVyIHtcbiAgKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCk6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQXNzb2NpYXRlcyBhIFVJIGluc3RhbmNlIHdpdGggYW4gb3B0aW9uYWwge0BsaW5rIFVJQ29uZGl0aW9uUmVzb2x2ZXJ9IHRoYXQgZGV0ZXJtaW5lcyBpZiB0aGUgVUkgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVSVZhcmlhbnQge1xuICB1aTogVUlDb250YWluZXI7XG4gIGNvbmRpdGlvbj86IFVJQ29uZGl0aW9uUmVzb2x2ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBVSU1hbmFnZXIge1xuXG4gIHByaXZhdGUgcGxheWVyOiBQbGF5ZXJBUEk7XG4gIHByaXZhdGUgcGxheWVyRWxlbWVudDogRE9NO1xuICBwcml2YXRlIHVpVmFyaWFudHM6IFVJVmFyaWFudFtdO1xuICBwcml2YXRlIHVpSW5zdGFuY2VNYW5hZ2VyczogSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlcltdO1xuICBwcml2YXRlIGN1cnJlbnRVaTogSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlcjtcbiAgcHJpdmF0ZSBjb25maWc6IFVJQ29uZmlnO1xuICBwcml2YXRlIG1hbmFnZXJQbGF5ZXJXcmFwcGVyOiBQbGF5ZXJXcmFwcGVyO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgVUkgbWFuYWdlciB3aXRoIGEgc2luZ2xlIFVJIHZhcmlhbnQgdGhhdCB3aWxsIGJlIHBlcm1hbmVudGx5IHNob3duLlxuICAgKiBAcGFyYW0gcGxheWVyIHRoZSBhc3NvY2lhdGVkIHBsYXllciBvZiB0aGlzIFVJXG4gICAqIEBwYXJhbSB1aSB0aGUgVUkgdG8gYWRkIHRvIHRoZSBwbGF5ZXJcbiAgICogQHBhcmFtIGNvbmZpZyBvcHRpb25hbCBVSSBjb25maWd1cmF0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSwgdWk6IFVJQ29udGFpbmVyLCBjb25maWc/OiBVSUNvbmZpZyk7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgVUkgbWFuYWdlciB3aXRoIGEgbGlzdCBvZiBVSSB2YXJpYW50cyB0aGF0IHdpbGwgYmUgZHluYW1pY2FsbHkgc2VsZWN0ZWQgYW5kIHN3aXRjaGVkIGFjY29yZGluZyB0b1xuICAgKiB0aGUgY29udGV4dCBvZiB0aGUgVUkuXG4gICAqXG4gICAqIEV2ZXJ5IHRpbWUgdGhlIFVJIGNvbnRleHQgY2hhbmdlcywgdGhlIGNvbmRpdGlvbnMgb2YgdGhlIFVJIHZhcmlhbnRzIHdpbGwgYmUgc2VxdWVudGlhbGx5IHJlc29sdmVkIGFuZCB0aGUgZmlyc3RcbiAgICogVUksIHdob3NlIGNvbmRpdGlvbiBldmFsdWF0ZXMgdG8gdHJ1ZSwgd2lsbCBiZSBzZWxlY3RlZCBhbmQgZGlzcGxheWVkLiBUaGUgbGFzdCB2YXJpYW50IGluIHRoZSBsaXN0IG1pZ2h0IG9taXQgdGhlXG4gICAqIGNvbmRpdGlvbiByZXNvbHZlciBhbmQgd2lsbCBiZSBzZWxlY3RlZCBhcyBkZWZhdWx0L2ZhbGxiYWNrIFVJIHdoZW4gYWxsIG90aGVyIGNvbmRpdGlvbnMgZmFpbC4gSWYgdGhlcmUgaXMgbm9cbiAgICogZmFsbGJhY2sgVUkgYW5kIGFsbCBjb25kaXRpb25zIGZhaWwsIG5vIFVJIHdpbGwgYmUgZGlzcGxheWVkLlxuICAgKlxuICAgKiBAcGFyYW0gcGxheWVyIHRoZSBhc3NvY2lhdGVkIHBsYXllciBvZiB0aGlzIFVJXG4gICAqIEBwYXJhbSB1aVZhcmlhbnRzIGEgbGlzdCBvZiBVSSB2YXJpYW50cyB0aGF0IHdpbGwgYmUgZHluYW1pY2FsbHkgc3dpdGNoZWRcbiAgICogQHBhcmFtIGNvbmZpZyBvcHRpb25hbCBVSSBjb25maWd1cmF0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSwgdWlWYXJpYW50czogVUlWYXJpYW50W10sIGNvbmZpZz86IFVJQ29uZmlnKTtcbiAgY29uc3RydWN0b3IocGxheWVyOiBQbGF5ZXJBUEksIHBsYXllclVpT3JVaVZhcmlhbnRzOiBVSUNvbnRhaW5lciB8IFVJVmFyaWFudFtdLCBjb25maWc6IFVJQ29uZmlnID0ge30pIHtcbiAgICBpZiAocGxheWVyVWlPclVpVmFyaWFudHMgaW5zdGFuY2VvZiBVSUNvbnRhaW5lcikge1xuICAgICAgLy8gU2luZ2xlLVVJIGNvbnN0cnVjdG9yIGhhcyBiZWVuIGNhbGxlZCwgdHJhbnNmb3JtIGFyZ3VtZW50cyB0byBVSVZhcmlhbnRbXSBzaWduYXR1cmVcbiAgICAgIGxldCBwbGF5ZXJVaSA9IDxVSUNvbnRhaW5lcj5wbGF5ZXJVaU9yVWlWYXJpYW50cztcbiAgICAgIGxldCBhZHNVaSA9IG51bGw7XG5cbiAgICAgIGxldCB1aVZhcmlhbnRzID0gW107XG5cbiAgICAgIC8vIEFkZCB0aGUgYWRzIFVJIGlmIGRlZmluZWRcbiAgICAgIGlmIChhZHNVaSkge1xuICAgICAgICB1aVZhcmlhbnRzLnB1c2goe1xuICAgICAgICAgIHVpOiBhZHNVaSxcbiAgICAgICAgICBjb25kaXRpb246IChjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmlzQWRXaXRoVUk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGUgZGVmYXVsdCBwbGF5ZXIgVUlcbiAgICAgIHVpVmFyaWFudHMucHVzaCh7dWk6IHBsYXllclVpfSk7XG5cbiAgICAgIHRoaXMudWlWYXJpYW50cyA9IHVpVmFyaWFudHM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gRGVmYXVsdCBjb25zdHJ1Y3RvciAoVUlWYXJpYW50W10pIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgdGhpcy51aVZhcmlhbnRzID0gPFVJVmFyaWFudFtdPnBsYXllclVpT3JVaVZhcmlhbnRzO1xuICAgIH1cblxuICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIgPSBuZXcgUGxheWVyV3JhcHBlcihwbGF5ZXIpO1xuICAgIHRoaXMucGxheWVyRWxlbWVudCA9IG5ldyBET00ocGxheWVyLmdldEZpZ3VyZSgpKTtcblxuICAgIC8vIENyZWF0ZSBVSSBpbnN0YW5jZSBtYW5hZ2VycyBmb3IgdGhlIFVJIHZhcmlhbnRzXG4gICAgLy8gVGhlIGluc3RhbmNlIG1hbmFnZXJzIG1hcCB0byB0aGUgY29ycmVzcG9uZGluZyBVSSB2YXJpYW50cyBieSB0aGVpciBhcnJheSBpbmRleFxuICAgIHRoaXMudWlJbnN0YW5jZU1hbmFnZXJzID0gW107XG4gICAgbGV0IHVpVmFyaWFudHNXaXRob3V0Q29uZGl0aW9uID0gW107XG4gICAgZm9yIChsZXQgdWlWYXJpYW50IG9mIHRoaXMudWlWYXJpYW50cykge1xuICAgICAgaWYgKHVpVmFyaWFudC5jb25kaXRpb24gPT0gbnVsbCkge1xuICAgICAgICAvLyBDb2xsZWN0IHZhcmlhbnRzIHdpdGhvdXQgY29uZGl0aW9ucyBmb3IgZXJyb3IgY2hlY2tpbmdcbiAgICAgICAgdWlWYXJpYW50c1dpdGhvdXRDb25kaXRpb24ucHVzaCh1aVZhcmlhbnQpO1xuICAgICAgfVxuICAgICAgLy8gQ3JlYXRlIHRoZSBpbnN0YW5jZSBtYW5hZ2VyIGZvciBhIFVJIHZhcmlhbnRcbiAgICAgIHRoaXMudWlJbnN0YW5jZU1hbmFnZXJzLnB1c2gobmV3IEludGVybmFsVUlJbnN0YW5jZU1hbmFnZXIocGxheWVyLCB1aVZhcmlhbnQudWksIHRoaXMuY29uZmlnKSk7XG4gICAgfVxuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIFVJIHZhcmlhbnQgd2l0aG91dCBhIGNvbmRpdGlvblxuICAgIC8vIEl0IGRvZXMgbm90IG1ha2Ugc2Vuc2UgdG8gaGF2ZSBtdWx0aXBsZSB2YXJpYW50cyB3aXRob3V0IGNvbmRpdGlvbiwgYmVjYXVzZSBvbmx5IHRoZSBmaXJzdCBvbmUgaW4gdGhlIGxpc3RcbiAgICAvLyAodGhlIG9uZSB3aXRoIHRoZSBsb3dlc3QgaW5kZXgpIHdpbGwgZXZlciBiZSBzZWxlY3RlZC5cbiAgICBpZiAodWlWYXJpYW50c1dpdGhvdXRDb25kaXRpb24ubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RvbyBtYW55IFVJcyB3aXRob3V0IGEgY29uZGl0aW9uOiBZb3UgY2Fubm90IGhhdmUgbW9yZSB0aGFuIG9uZSBkZWZhdWx0IFVJJyk7XG4gICAgfVxuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBkZWZhdWx0IFVJIHZhcmlhbnQsIGlmIGRlZmluZWQsIGlzIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QgKGxhc3QgaW5kZXgpXG4gICAgLy8gSWYgaXQgY29tZXMgZWFybGllciwgdGhlIHZhcmlhbnRzIHdpdGggY29uZGl0aW9ucyB0aGF0IGNvbWUgYWZ0ZXJ3YXJkcyB3aWxsIG5ldmVyIGJlIHNlbGVjdGVkIGJlY2F1c2UgdGhlXG4gICAgLy8gZGVmYXVsdCB2YXJpYW50IHdpdGhvdXQgYSBjb25kaXRpb24gYWx3YXlzIGV2YWx1YXRlcyB0byAndHJ1ZSdcbiAgICBpZiAodWlWYXJpYW50c1dpdGhvdXRDb25kaXRpb24ubGVuZ3RoID4gMFxuICAgICAgJiYgdWlWYXJpYW50c1dpdGhvdXRDb25kaXRpb25bMF0gIT09IHRoaXMudWlWYXJpYW50c1t0aGlzLnVpVmFyaWFudHMubGVuZ3RoIC0gMV0pIHtcbiAgICAgIHRocm93IEVycm9yKCdJbnZhbGlkIFVJIHZhcmlhbnQgb3JkZXI6IHRoZSBkZWZhdWx0IFVJICh3aXRob3V0IGNvbmRpdGlvbikgbXVzdCBiZSBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0Jyk7XG4gICAgfVxuXG4gICAgbGV0IGFkU3RhcnRlZEV2ZW50OiBBZFN0YXJ0ZWRFdmVudCA9IG51bGw7IC8vIGtlZXAgdGhlIGV2ZW50IHN0b3JlZCBoZXJlIGR1cmluZyBhZCBwbGF5YmFja1xuICAgIGxldCBpc01vYmlsZSA9IEJyb3dzZXJVdGlscy5pc01vYmlsZTtcblxuICAgIC8vIER5bmFtaWNhbGx5IHNlbGVjdCBhIFVJIHZhcmlhbnQgdGhhdCBtYXRjaGVzIHRoZSBjdXJyZW50IFVJIGNvbmRpdGlvbi5cbiAgICBsZXQgcmVzb2x2ZVVpVmFyaWFudCA9IChldmVudDogUGxheWVyRXZlbnQpID0+IHtcbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBPTl9BRF9TVEFSVEVEIGV2ZW50IGRhdGEgaXMgcGVyc2lzdGVkIHRocm91Z2ggYWQgcGxheWJhY2sgaW4gY2FzZSBvdGhlciBldmVudHMgaGFwcGVuXG4gICAgICAvLyBpbiB0aGUgbWVhbnRpbWUsIGUuZy4gcGxheWVyIHJlc2l6ZS4gV2UgbmVlZCB0byBzdG9yZSB0aGlzIGRhdGEgYmVjYXVzZSB0aGVyZSBpcyBubyBvdGhlciB3YXkgdG8gZmluZCBvdXRcbiAgICAgIC8vIGFkIGRldGFpbHMgKGUuZy4gdGhlIGFkIGNsaWVudCkgd2hpbGUgYW4gYWQgaXMgcGxheWluZy5cbiAgICAgIC8vIEV4aXN0aW5nIGV2ZW50IGRhdGEgc2lnbmFscyB0aGF0IGFuIGFkIGlzIGN1cnJlbnRseSBhY3RpdmUuIFdlIGNhbm5vdCB1c2UgcGxheWVyLmlzQWQoKSBiZWNhdXNlIGl0IHJldHVybnNcbiAgICAgIC8vIHRydWUgb24gYWQgc3RhcnQgYW5kIGFsc28gb24gYWQgZW5kIGV2ZW50cywgd2hpY2ggaXMgcHJvYmxlbWF0aWMuXG4gICAgICBpZiAoZXZlbnQgIT0gbnVsbCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAvLyBXaGVuIHRoZSBhZCBzdGFydHMsIHdlIHN0b3JlIHRoZSBldmVudCBkYXRhXG4gICAgICAgICAgY2FzZSBwbGF5ZXIuRVZFTlQuT05fQURfU1RBUlRFRDpcbiAgICAgICAgICAgIGFkU3RhcnRlZEV2ZW50ID0gPEFkU3RhcnRlZEV2ZW50PmV2ZW50O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gV2hlbiB0aGUgYWQgZW5kcywgd2UgZGVsZXRlIHRoZSBldmVudCBkYXRhXG4gICAgICAgICAgY2FzZSBwbGF5ZXIuRVZFTlQuT05fQURfRklOSVNIRUQ6XG4gICAgICAgICAgY2FzZSBwbGF5ZXIuRVZFTlQuT05fQURfU0tJUFBFRDpcbiAgICAgICAgICBjYXNlIHBsYXllci5FVkVOVC5PTl9BRF9FUlJPUjpcbiAgICAgICAgICAgIGFkU3RhcnRlZEV2ZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBEZXRlY3QgaWYgYW4gYWQgaGFzIHN0YXJ0ZWRcbiAgICAgIGxldCBhZCA9IGFkU3RhcnRlZEV2ZW50ICE9IG51bGw7XG4gICAgICBsZXQgYWRXaXRoVUkgPSBhZCAmJiBhZFN0YXJ0ZWRFdmVudC5jbGllbnRUeXBlID09PSAndmFzdCc7XG5cbiAgICAgIC8vIERldGVybWluZSB0aGUgY3VycmVudCBjb250ZXh0IGZvciB3aGljaCB0aGUgVUkgdmFyaWFudCB3aWxsIGJlIHJlc29sdmVkXG4gICAgICBsZXQgY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0ID0ge1xuICAgICAgICBpc0FkOiBhZCxcbiAgICAgICAgaXNBZFdpdGhVSTogYWRXaXRoVUksXG4gICAgICAgIGlzRnVsbHNjcmVlbjogdGhpcy5wbGF5ZXIuaXNGdWxsc2NyZWVuKCksXG4gICAgICAgIGlzTW9iaWxlOiBpc01vYmlsZSxcbiAgICAgICAgd2lkdGg6IHRoaXMucGxheWVyRWxlbWVudC53aWR0aCgpLFxuICAgICAgICBkb2N1bWVudFdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxuICAgICAgfTtcblxuICAgICAgbGV0IG5leHRVaTogSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlciA9IG51bGw7XG4gICAgICBsZXQgdWlWYXJpYW50Q2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBTZWxlY3QgbmV3IFVJIHZhcmlhbnRcbiAgICAgIC8vIElmIG5vIHZhcmlhbnQgY29uZGl0aW9uIGlzIGZ1bGZpbGxlZCwgd2Ugc3dpdGNoIHRvICpubyogVUlcbiAgICAgIGZvciAobGV0IHVpVmFyaWFudCBvZiB0aGlzLnVpVmFyaWFudHMpIHtcbiAgICAgICAgaWYgKHVpVmFyaWFudC5jb25kaXRpb24gPT0gbnVsbCB8fCB1aVZhcmlhbnQuY29uZGl0aW9uKGNvbnRleHQpID09PSB0cnVlKSB7XG4gICAgICAgICAgbmV4dFVpID0gdGhpcy51aUluc3RhbmNlTWFuYWdlcnNbdGhpcy51aVZhcmlhbnRzLmluZGV4T2YodWlWYXJpYW50KV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBVSSB2YXJpYW50IGlzIGNoYW5naW5nXG4gICAgICBpZiAobmV4dFVpICE9PSB0aGlzLmN1cnJlbnRVaSkge1xuICAgICAgICB1aVZhcmlhbnRDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N3aXRjaGVkIGZyb20gJywgdGhpcy5jdXJyZW50VWkgPyB0aGlzLmN1cnJlbnRVaS5nZXRVSSgpIDogJ25vbmUnLFxuICAgICAgICAvLyAgICcgdG8gJywgbmV4dFVpID8gbmV4dFVpLmdldFVJKCkgOiAnbm9uZScpO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmx5IGlmIHRoZSBVSSB2YXJpYW50IGlzIGNoYW5naW5nLCB3ZSBuZWVkIHRvIGRvIHNvbWUgc3R1ZmYuIEVsc2Ugd2UganVzdCBsZWF2ZSBldmVyeXRoaW5nIGFzLWlzLlxuICAgICAgaWYgKHVpVmFyaWFudENoYW5nZWQpIHtcbiAgICAgICAgLy8gSGlkZSB0aGUgY3VycmVudGx5IGFjdGl2ZSBVSSB2YXJpYW50XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRVaSkge1xuICAgICAgICAgIHRoaXMuY3VycmVudFVpLmdldFVJKCkuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXNzaWduIHRoZSBuZXcgVUkgdmFyaWFudCBhcyBjdXJyZW50IFVJXG4gICAgICAgIHRoaXMuY3VycmVudFVpID0gbmV4dFVpO1xuXG4gICAgICAgIC8vIFdoZW4gd2Ugc3dpdGNoIHRvIGEgZGlmZmVyZW50IFVJIGluc3RhbmNlLCB0aGVyZSdzIHNvbWUgYWRkaXRpb25hbCBzdHVmZiB0byBtYW5hZ2UuIElmIHdlIGRvIG5vdCBzd2l0Y2hcbiAgICAgICAgLy8gdG8gYW4gaW5zdGFuY2UsIHdlJ3JlIGRvbmUgaGVyZS5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFVpICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBBZGQgdGhlIFVJIHRvIHRoZSBET00gKGFuZCBjb25maWd1cmUgaXQpIHRoZSBmaXJzdCB0aW1lIGl0IGlzIHNlbGVjdGVkXG4gICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRVaS5pc0NvbmZpZ3VyZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRVaSh0aGlzLmN1cnJlbnRVaSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBhbiBhZCBVSSwgd2UgbmVlZCB0byByZWxheSB0aGUgc2F2ZWQgT05fQURfU1RBUlRFRCBldmVudCBkYXRhIHNvIGFkIGNvbXBvbmVudHMgY2FuIGNvbmZpZ3VyZVxuICAgICAgICAgIC8vIHRoZW1zZWx2ZXMgZm9yIHRoZSBjdXJyZW50IGFkLlxuICAgICAgICAgIGlmIChjb250ZXh0LmlzQWQpIHtcbiAgICAgICAgICAgIC8qIFJlbGF5IHRoZSBPTl9BRF9TVEFSVEVEIGV2ZW50IHRvIHRoZSBhZHMgVUlcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBCZWNhdXNlIHRoZSBhZHMgVUkgaXMgaW5pdGlhbGl6ZWQgaW4gdGhlIE9OX0FEX1NUQVJURUQgaGFuZGxlciwgaS5lLiB3aGVuIHRoZSBPTl9BRF9TVEFSVEVEIGV2ZW50IGhhc1xuICAgICAgICAgICAgICogYWxyZWFkeSBiZWVuIGZpcmVkLCBjb21wb25lbnRzIGluIHRoZSBhZHMgVUkgdGhhdCBsaXN0ZW4gZm9yIHRoZSBPTl9BRF9TVEFSVEVEIGV2ZW50IG5ldmVyIHJlY2VpdmUgaXQuXG4gICAgICAgICAgICAgKiBTaW5jZSB0aGlzIGNhbiBicmVhayBmdW5jdGlvbmFsaXR5IG9mIGNvbXBvbmVudHMgdGhhdCByZWx5IG9uIHRoaXMgZXZlbnQsIHdlIHJlbGF5IHRoZSBldmVudCB0byB0aGVcbiAgICAgICAgICAgICAqIGFkcyBVSSBjb21wb25lbnRzIHdpdGggdGhlIGZvbGxvd2luZyBjYWxsLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5nZXRXcmFwcGVkUGxheWVyKCkuZmlyZUV2ZW50SW5VSSh0aGlzLnBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVELCBhZFN0YXJ0ZWRFdmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5jdXJyZW50VWkuZ2V0VUkoKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gTGlzdGVuIHRvIHRoZSBmb2xsb3dpbmcgZXZlbnRzIHRvIHRyaWdnZXIgVUkgdmFyaWFudCByZXNvbHV0aW9uXG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fQURfU1RBUlRFRCwgcmVzb2x2ZVVpVmFyaWFudCk7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fQURfRklOSVNIRUQsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX0FEX1NLSVBQRUQsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX0FEX0VSUk9SLCByZXNvbHZlVWlWYXJpYW50KTtcbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9QTEFZRVJfUkVTSVpFLCByZXNvbHZlVWlWYXJpYW50KTtcbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9GVUxMU0NSRUVOX0VOVEVSLCByZXNvbHZlVWlWYXJpYW50KTtcbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9GVUxMU0NSRUVOX0VYSVQsIHJlc29sdmVVaVZhcmlhbnQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgVUlcbiAgICByZXNvbHZlVWlWYXJpYW50KG51bGwpO1xuICB9XG5cbiAgZ2V0Q29uZmlnKCk6IFVJQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cblxuICBwcml2YXRlIGFkZFVpKHVpOiBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgbGV0IHVpRG9tID0gdWkuZ2V0VUkoKS5nZXREb21FbGVtZW50KCk7XG4gICAgdWkuY29uZmlndXJlQ29udHJvbHMoKTtcblxuICAgIC8qIEFwcGVuZCB0aGUgVUkgRE9NIGFmdGVyIGNvbmZpZ3VyYXRpb24gdG8gYXZvaWQgQ1NTIHRyYW5zaXRpb25zIGF0IGluaXRpYWxpemF0aW9uXG4gICAgICogRXhhbXBsZTogQ29tcG9uZW50cyBhcmUgaGlkZGVuIGR1cmluZyBjb25maWd1cmF0aW9uIGFuZCB0aGVzZSBoaWRlcyBtYXkgdHJpZ2dlciBDU1MgdHJhbnNpdGlvbnMgdGhhdCBhcmVcbiAgICAgKiB1bmRlc2lyYWJsZSBhdCB0aGlzIHRpbWUuICovXG5cbiAgICAvKiBBcHBlbmQgdWkgdG8gcGFyZW50IGluc3RlYWQgb2YgcGxheWVyICovXG4gICAgbGV0IHBhcmVudEVsZW1lbnQgPSBuZXcgRE9NKHRoaXMucGxheWVyRWxlbWVudC5nZXRFbGVtZW50cygpWzBdLnBhcmVudEVsZW1lbnQpO1xuICAgIGlmICghcGFyZW50RWxlbWVudC5oYXNDbGFzcygnc21hc2hjdXQtY3VzdG9tLXVpLWJpdG1vdmluLXBsYXllci1ob2xkZXInKSkge1xuICAgICAgcGFyZW50RWxlbWVudC5hZGRDbGFzcygnc21hc2hjdXQtY3VzdG9tLXVpLWJpdG1vdmluLXBsYXllci1ob2xkZXInKTtcbiAgICAgIHBhcmVudEVsZW1lbnQuYXBwZW5kKHVpRG9tKTtcbiAgICB9XG5cbiAgICAvLyBGaXJlIG9uQ29uZmlndXJlZCBhZnRlciBVSSBET00gZWxlbWVudHMgYXJlIHN1Y2Nlc3NmdWxseSBhZGRlZC4gV2hlbiBmaXJlZCBpbW1lZGlhdGVseSwgdGhlIERPTSBlbGVtZW50c1xuICAgIC8vIG1pZ2h0IG5vdCBiZSBmdWxseSBjb25maWd1cmVkIGFuZCBlLmcuIGRvIG5vdCBoYXZlIGEgc2l6ZS5cbiAgICAvLyBodHRwczovL3N3aXplYy5jb20vYmxvZy9ob3ctdG8tcHJvcGVybHktd2FpdC1mb3ItZG9tLWVsZW1lbnRzLXRvLXNob3ctdXAtaW4tbW9kZXJuLWJyb3dzZXJzL3N3aXplYy82NjYzXG4gICAgaWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHVpLm9uQ29uZmlndXJlZC5kaXNwYXRjaCh1aS5nZXRVSSgpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJRTkgZmFsbGJhY2tcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB1aS5vbkNvbmZpZ3VyZWQuZGlzcGF0Y2godWkuZ2V0VUkoKSk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbGVhc2VVaSh1aTogSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHVpLnJlbGVhc2VDb250cm9scygpO1xuICAgIHVpLmdldFVJKCkuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZSgpO1xuICAgIHVpLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBmb3IgKGxldCB1aUluc3RhbmNlTWFuYWdlciBvZiB0aGlzLnVpSW5zdGFuY2VNYW5hZ2Vycykge1xuICAgICAgdGhpcy5yZWxlYXNlVWkodWlJbnN0YW5jZU1hbmFnZXIpO1xuICAgIH1cbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgVUlNYW5hZ2VyLkZhY3Rvcnkge1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZERlZmF1bHRVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5VSShwbGF5ZXIsIGNvbmZpZyk7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gYnVpbGREZWZhdWx0U21hbGxTY3JlZW5VSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5TbWFsbFNjcmVlblVJKHBsYXllciwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZERlZmF1bHRDYXN0UmVjZWl2ZXJVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5DYXN0UmVjZWl2ZXJVSShwbGF5ZXIsIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBzbWFzaGN1dFVpKCkge1xuXG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3BlZWQnLCBuZXcgUGxheWJhY2tTcGVlZFNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IGVtYmVkVmlkZW9QYW5lbCA9IG5ldyBFbWJlZFZpZGVvUGFuZWwoe1xuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhclRvcCA9IG5ldyBDb250YWluZXIoe1xuICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLXRvcCddLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoe3RpbWVMYWJlbE1vZGU6IFBsYXliYWNrVGltZUxhYmVsTW9kZS5DdXJyZW50VGltZSwgaGlkZUluTGl2ZVBsYXliYWNrOiB0cnVlfSksXG4gICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIGxldCBzZWVrQmFyID0gbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KTtcblxuICAgIGxldCBjb250cm9sQmFyTWlkZGxlID0gbmV3IENvbnRhaW5lcih7XG4gICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItbWlkZGxlJ10sXG4gICAgICBjb21wb25lbnRzOiBbc2Vla0Jhcl1cbiAgICB9KTtcblxuICAgIGxldCBjb250cm9sQmFyQm90dG9tID0gbmV3IENvbnRhaW5lcih7XG4gICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItYm90dG9tJ10sXG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTcGFjZXIoKSxcbiAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBDb21tZW50c1RvZ2dsZUJ1dHRvbih7c2Vla0Jhcjogc2Vla0Jhcn0pLFxuICAgICAgICBuZXcgQ2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgbmV3IEVtYmVkVmlkZW9Ub2dnbGVCdXR0b24oe2VtYmVkVmlkZW9QYW5lbDogZW1iZWRWaWRlb1BhbmVsfSksXG4gICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKCksXG4gICAgICBdXG4gICAgfSk7XG5cblxuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLWlubmVyJ10sXG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgICAgIGVtYmVkVmlkZW9QYW5lbCxcbiAgICAgICAgICAgIGNvbnRyb2xCYXJUb3AsXG4gICAgICAgICAgICBjb250cm9sQmFyTWlkZGxlLFxuICAgICAgICAgICAgY29udHJvbEJhckJvdHRvbSxcbiAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGhpZGVEZWxheTogNTAwMCxcbiAgICAgIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4gdWktc2tpbi1zbWFzaGN1dCddLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKCksXG4gICAgICAgIG5ldyBSZWNvbW1lbmRhdGlvbk92ZXJsYXkoKSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuVUkoKSB7XG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3BlZWQnLCBuZXcgUGxheWJhY2tTcGVlZFNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIHNldHRpbmdzUGFuZWwsXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRUaW1lLCBoaWRlSW5MaXZlUGxheWJhY2s6IHRydWV9KSxcbiAgICAgICAgICAgIG5ldyBTZWVrQmFyKHtsYWJlbDogbmV3IFNlZWtCYXJMYWJlbCgpfSksXG4gICAgICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoe3RpbWVMYWJlbE1vZGU6IFBsYXliYWNrVGltZUxhYmVsTW9kZS5Ub3RhbFRpbWUsIGNzc0NsYXNzZXM6IFsndGV4dC1yaWdodCddfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItdG9wJ11cbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgbmV3IFZvbHVtZVRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICAgICAgbmV3IFNwYWNlcigpLFxuICAgICAgICAgICAgbmV3IFBpY3R1cmVJblBpY3R1cmVUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBBaXJQbGF5VG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgQ2FzdFRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgbmV3IFZSVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItYm90dG9tJ11cbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFN1YnRpdGxlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQnVmZmVyaW5nT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBDYXN0U3RhdHVzT3ZlcmxheSgpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoKSxcbiAgICAgICAgbmV3IFJlY29tbWVuZGF0aW9uT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuQWRzVUkoKSB7XG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBBZENsaWNrT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBBZE1lc3NhZ2VMYWJlbCh7dGV4dDogJ0FkOiB7cmVtYWluaW5nVGltZX0gc2Vjcyd9KSxcbiAgICAgICAgICAgIG5ldyBBZFNraXBCdXR0b24oKVxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3NzQ2xhc3M6ICd1aS1hZHMtc3RhdHVzJ1xuICAgICAgICB9KSxcbiAgICAgICAgbmV3IENvbnRyb2xCYXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICAgICAgbmV3IFZvbHVtZVRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgICAgIG5ldyBWb2x1bWVTbGlkZXIoKSxcbiAgICAgICAgICAgICAgICBuZXcgU3BhY2VyKCksXG4gICAgICAgICAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLWJvdHRvbSddXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbW9kZXJuJywgJ3VpLXNraW4tYWRzJ11cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vZGVyblNtYWxsU2NyZWVuVUkoKSB7XG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3BlZWQnLCBuZXcgUGxheWJhY2tTcGVlZFNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGhpZGVEZWxheTogLTEsXG4gICAgfSk7XG4gICAgc2V0dGluZ3NQYW5lbC5hZGRDb21wb25lbnQobmV3IENsb3NlQnV0dG9uKHt0YXJnZXQ6IHNldHRpbmdzUGFuZWx9KSk7XG5cbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudFRpbWUsIGhpZGVJbkxpdmVQbGF5YmFjazogdHJ1ZX0pLFxuICAgICAgICAgICAgbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KSxcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci10b3AnXVxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBDYXN0U3RhdHVzT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIGNvbnRyb2xCYXIsXG4gICAgICAgIG5ldyBUaXRsZUJhcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IE1ldGFkYXRhTGFiZWwoe2NvbnRlbnQ6IE1ldGFkYXRhTGFiZWxDb250ZW50LlRpdGxlfSksXG4gICAgICAgICAgICBuZXcgQ2FzdFRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgLypuZXcgVlJUb2dnbGVCdXR0b24oKSwqL1xuICAgICAgICAgICAgbmV3IFNldHRpbmdzVG9nZ2xlQnV0dG9uKHtzZXR0aW5nc1BhbmVsOiBzZXR0aW5nc1BhbmVsfSksXG4gICAgICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgIF1cbiAgICAgICAgfSksXG4gICAgICAgIHNldHRpbmdzUGFuZWwsXG4gICAgICAgIG5ldyBSZWNvbW1lbmRhdGlvbk92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFdhdGVybWFyaygpLFxuICAgICAgICBuZXcgRXJyb3JNZXNzYWdlT3ZlcmxheSgpXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbW9kZXJuJywgJ3VpLXNraW4tc21hbGxzY3JlZW4nXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuU21hbGxTY3JlZW5BZHNVSSgpIHtcbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IEJ1ZmZlcmluZ092ZXJsYXkoKSxcbiAgICAgICAgbmV3IEFkQ2xpY2tPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFRpdGxlQmFyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICAvLyBkdW1teSBsYWJlbCB3aXRoIG5vIGNvbnRlbnQgdG8gbW92ZSBidXR0b25zIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgbmV3IExhYmVsKHtjc3NDbGFzczogJ2xhYmVsLW1ldGFkYXRhLXRpdGxlJ30pLFxuICAgICAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKSxcbiAgICAgICAgICBdXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBuZXcgQWRNZXNzYWdlTGFiZWwoe3RleHQ6ICdBZDoge3JlbWFpbmluZ1RpbWV9IHNlY3MnfSksXG4gICAgICAgICAgICBuZXcgQWRTa2lwQnV0dG9uKClcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzOiAndWktYWRzLXN0YXR1cydcbiAgICAgICAgfSksXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbW9kZXJuJywgJ3VpLXNraW4tYWRzJywgJ3VpLXNraW4tc21hbGxzY3JlZW4nXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuQ2FzdFJlY2VpdmVyVUkoKSB7XG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRUaW1lLCBoaWRlSW5MaXZlUGxheWJhY2s6IHRydWV9KSxcbiAgICAgICAgICAgIG5ldyBTZWVrQmFyKHtzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNczogLTF9KSxcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci10b3AnXVxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgQ2FzdFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFN1YnRpdGxlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQnVmZmVyaW5nT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBXYXRlcm1hcmsoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKHtrZWVwSGlkZGVuV2l0aG91dE1ldGFkYXRhOiB0cnVlfSksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nLCAndWktc2tpbi1jYXN0LXJlY2VpdmVyJ11cbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZE1vZGVyblVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIC8vIHNob3cgc21hbGxTY3JlZW4gVUkgb25seSBvbiBtb2JpbGUvaGFuZGhlbGQgZGV2aWNlc1xuICAgIGxldCBzbWFsbFNjcmVlblN3aXRjaFdpZHRoID0gNjAwO1xuXG4gICAgcmV0dXJuIG5ldyBVSU1hbmFnZXIocGxheWVyLCBbe1xuICAgICAgdWk6IG1vZGVyblNtYWxsU2NyZWVuQWRzVUkoKSxcbiAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5pc01vYmlsZSAmJiBjb250ZXh0LmRvY3VtZW50V2lkdGggPCBzbWFsbFNjcmVlblN3aXRjaFdpZHRoICYmIGNvbnRleHQuaXNBZFdpdGhVSTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB1aTogbW9kZXJuQWRzVUkoKSxcbiAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5pc0FkV2l0aFVJO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHVpOiBtb2Rlcm5TbWFsbFNjcmVlblVJKCksXG4gICAgICBjb25kaXRpb246IChjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQuaXNNb2JpbGUgJiYgY29udGV4dC5kb2N1bWVudFdpZHRoIDwgc21hbGxTY3JlZW5Td2l0Y2hXaWR0aDtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB1aTogc21hc2hjdXRVaSgpXG4gICAgfV0sIGNvbmZpZyk7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gYnVpbGRNb2Rlcm5TbWFsbFNjcmVlblVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgW3tcbiAgICAgIHVpOiBtb2Rlcm5TbWFsbFNjcmVlbkFkc1VJKCksXG4gICAgICBjb25kaXRpb246IChjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQuaXNBZFdpdGhVSTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB1aTogbW9kZXJuU21hbGxTY3JlZW5VSSgpXG4gICAgfV0sIGNvbmZpZyk7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gYnVpbGRNb2Rlcm5DYXN0UmVjZWl2ZXJVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gbmV3IFVJTWFuYWdlcihwbGF5ZXIsIG1vZGVybkNhc3RSZWNlaXZlclVJKCksIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBsZWdhY3lVSSgpIHtcbiAgICBsZXQgc2V0dGluZ3NQYW5lbCA9IG5ldyBTZXR0aW5nc1BhbmVsKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdWaWRlbyBRdWFsaXR5JywgbmV3IFZpZGVvUXVhbGl0eVNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIHNldHRpbmdzUGFuZWwsXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgU2Vla0Jhcih7bGFiZWw6IG5ldyBTZWVrQmFyTGFiZWwoKX0pLFxuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoKSxcbiAgICAgICAgbmV3IFZSVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBWb2x1bWVDb250cm9sQnV0dG9uKCksXG4gICAgICAgIG5ldyBTZXR0aW5nc1RvZ2dsZUJ1dHRvbih7c2V0dGluZ3NQYW5lbDogc2V0dGluZ3NQYW5lbH0pLFxuICAgICAgICBuZXcgQ2FzdFRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFN1YnRpdGxlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQ2FzdFN0YXR1c092ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIG5ldyBSZWNvbW1lbmRhdGlvbk92ZXJsYXkoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKCksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1sZWdhY3knXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVnYWN5QWRzVUkoKSB7XG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBBZENsaWNrT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQ29udHJvbEJhcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgQWRNZXNzYWdlTGFiZWwoKSxcbiAgICAgICAgICAgIG5ldyBWb2x1bWVDb250cm9sQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpXG4gICAgICAgICAgXVxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IEFkU2tpcEJ1dHRvbigpXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbGVnYWN5JywgJ3VpLXNraW4tYWRzJ11cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlZ2FjeUNhc3RSZWNlaXZlclVJKCkge1xuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU2Vla0JhcigpLFxuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoKSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFdhdGVybWFyaygpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoKSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXSwgY3NzQ2xhc3NlczogWyd1aS1za2luLWxlZ2FjeScsICd1aS1za2luLWNhc3QtcmVjZWl2ZXInXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVnYWN5VGVzdFVJKCkge1xuICAgIGxldCBzZXR0aW5nc1BhbmVsID0gbmV3IFNldHRpbmdzUGFuZWwoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1ZpZGVvIFF1YWxpdHknLCBuZXcgVmlkZW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFRyYWNrJywgbmV3IEF1ZGlvVHJhY2tTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gUXVhbGl0eScsIG5ldyBBdWRpb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3VidGl0bGVzJywgbmV3IFN1YnRpdGxlU2VsZWN0Qm94KCkpXG4gICAgICBdLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtzZXR0aW5nc1BhbmVsLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KSxcbiAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKCksXG4gICAgICAgIG5ldyBWUlRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBWb2x1bWVTbGlkZXIoKSxcbiAgICAgICAgbmV3IFZvbHVtZUNvbnRyb2xCdXR0b24oKSxcbiAgICAgICAgbmV3IFZvbHVtZUNvbnRyb2xCdXR0b24oe3ZlcnRpY2FsOiBmYWxzZX0pLFxuICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgbmV3IENhc3RUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTdWJ0aXRsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IENhc3RTdGF0dXNPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFdhdGVybWFyaygpLFxuICAgICAgICBuZXcgUmVjb21tZW5kYXRpb25PdmVybGF5KCksXG4gICAgICAgIGNvbnRyb2xCYXIsXG4gICAgICAgIG5ldyBUaXRsZUJhcigpLFxuICAgICAgICBuZXcgRXJyb3JNZXNzYWdlT3ZlcmxheSgpXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbGVnYWN5J11cbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZExlZ2FjeVVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgW3tcbiAgICAgIHVpOiBsZWdhY3lBZHNVSSgpLFxuICAgICAgY29uZGl0aW9uOiAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmlzQWRXaXRoVUk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgdWk6IGxlZ2FjeVVJKClcbiAgICB9XSwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZExlZ2FjeUNhc3RSZWNlaXZlclVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgbGVnYWN5Q2FzdFJlY2VpdmVyVUkoKSwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZExlZ2FjeVRlc3RVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gbmV3IFVJTWFuYWdlcihwbGF5ZXIsIGxlZ2FjeVRlc3RVSSgpLCBjb25maWcpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Vla1ByZXZpZXdBcmdzIGV4dGVuZHMgTm9BcmdzIHtcbiAgLyoqXG4gICAqIFRoZSB0aW1lbGluZSBwb3NpdGlvbiBpbiBwZXJjZW50IHdoZXJlIHRoZSBldmVudCBvcmlnaW5hdGVzIGZyb20uXG4gICAqL1xuICBwb3NpdGlvbjogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIHRpbWVsaW5lIG1hcmtlciBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgcG9zaXRpb24sIGlmIGV4aXN0aW5nLlxuICAgKi9cbiAgbWFya2VyPzogVGltZWxpbmVNYXJrZXI7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGZ1bmN0aW9uYWxpdHkgdG8gbWFuYWdlIGEgVUkgaW5zdGFuY2UuIFVzZWQgYnkgdGhlIHtAbGluayBVSU1hbmFnZXJ9IHRvIG1hbmFnZSBtdWx0aXBsZSBVSSBpbnN0YW5jZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBVSUluc3RhbmNlTWFuYWdlciB7XG4gIHByaXZhdGUgcGxheWVyV3JhcHBlcjogUGxheWVyV3JhcHBlcjtcbiAgcHJpdmF0ZSB1aTogVUlDb250YWluZXI7XG4gIHByaXZhdGUgY29uZmlnOiBVSUNvbmZpZztcblxuICBwcml2YXRlIGV2ZW50cyA9IHtcbiAgICBvbkNvbmZpZ3VyZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4oKSxcbiAgICBvblNlZWs6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPigpLFxuICAgIG9uU2Vla1ByZXZpZXc6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgU2Vla1ByZXZpZXdBcmdzPigpLFxuICAgIG9uU2Vla2VkOiBuZXcgRXZlbnREaXNwYXRjaGVyPFNlZWtCYXIsIE5vQXJncz4oKSxcbiAgICBvbkNvbXBvbmVudFNob3c6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvbkNvbXBvbmVudEhpZGU6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvbkNvbnRyb2xzU2hvdzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxVSUNvbnRhaW5lciwgTm9BcmdzPigpLFxuICAgIG9uUHJldmlld0NvbnRyb2xzSGlkZTogbmV3IEV2ZW50RGlzcGF0Y2hlcjxVSUNvbnRhaW5lciwgQ2FuY2VsRXZlbnRBcmdzPigpLFxuICAgIG9uQ29udHJvbHNIaWRlOiBuZXcgRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+KCksXG4gIH07XG5cbiAgY29uc3RydWN0b3IocGxheWVyOiBQbGF5ZXJBUEksIHVpOiBVSUNvbnRhaW5lciwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy5wbGF5ZXJXcmFwcGVyID0gbmV3IFBsYXllcldyYXBwZXIocGxheWVyKTtcbiAgICB0aGlzLnVpID0gdWk7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gIH1cblxuICBnZXRDb25maWcoKTogVUlDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxuXG4gIGdldFVJKCk6IFVJQ29udGFpbmVyIHtcbiAgICByZXR1cm4gdGhpcy51aTtcbiAgfVxuXG4gIGdldFBsYXllcigpOiBQbGF5ZXJBUEkge1xuICAgIHJldHVybiB0aGlzLnBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCk7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiB0aGUgVUkgaXMgZnVsbHkgY29uZmlndXJlZCBhbmQgYWRkZWQgdG8gdGhlIERPTS5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvbkNvbmZpZ3VyZWQoKTogRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25Db25maWd1cmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gYSBzZWVrIHN0YXJ0cy5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvblNlZWsoKTogRXZlbnREaXNwYXRjaGVyPFNlZWtCYXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vblNlZWs7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiB0aGUgc2VlayB0aW1lbGluZSBpcyBzY3J1YmJlZC5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvblNlZWtQcmV2aWV3KCk6IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBTZWVrUHJldmlld0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25TZWVrUHJldmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB3aGVuIGEgc2VlayBpcyBmaW5pc2hlZC5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvblNlZWtlZCgpOiBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9uU2Vla2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gYSBjb21wb25lbnQgaXMgc2hvd2luZy5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvbkNvbXBvbmVudFNob3coKTogRXZlbnREaXNwYXRjaGVyPENvbXBvbmVudDxDb21wb25lbnRDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25Db21wb25lbnRTaG93O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gYSBjb21wb25lbnQgaXMgaGlkaW5nLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uQ29tcG9uZW50SGlkZSgpOiBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbXBvbmVudEhpZGU7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiB0aGUgVUkgY29udHJvbHMgYXJlIHNob3dpbmcuXG4gICAqIEByZXR1cm5zIHtFdmVudERpc3BhdGNoZXJ9XG4gICAqL1xuICBnZXQgb25Db250cm9sc1Nob3coKTogRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25Db250cm9sc1Nob3c7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgYmVmb3JlIHRoZSBVSSBjb250cm9scyBhcmUgaGlkaW5nIHRvIGNoZWNrIGlmIHRoZXkgYXJlIGFsbG93ZWQgdG8gaGlkZS5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvblByZXZpZXdDb250cm9sc0hpZGUoKTogRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBDYW5jZWxFdmVudEFyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25QcmV2aWV3Q29udHJvbHNIaWRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gdGhlIFVJIGNvbnRyb2xzIGFyZSBoaWRpbmcuXG4gICAqIEByZXR1cm5zIHtFdmVudERpc3BhdGNoZXJ9XG4gICAqL1xuICBnZXQgb25Db250cm9sc0hpZGUoKTogRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25Db250cm9sc0hpZGU7XG4gIH1cblxuICBwcm90ZWN0ZWQgY2xlYXJFdmVudEhhbmRsZXJzKCk6IHZvaWQge1xuICAgIHRoaXMucGxheWVyV3JhcHBlci5jbGVhckV2ZW50SGFuZGxlcnMoKTtcblxuICAgIGxldCBldmVudHMgPSA8YW55PnRoaXMuZXZlbnRzOyAvLyBhdm9pZCBUUzcwMTdcbiAgICBmb3IgKGxldCBldmVudCBpbiBldmVudHMpIHtcbiAgICAgIGxldCBkaXNwYXRjaGVyID0gPEV2ZW50RGlzcGF0Y2hlcjxPYmplY3QsIE9iamVjdD4+ZXZlbnRzW2V2ZW50XTtcbiAgICAgIGRpc3BhdGNoZXIudW5zdWJzY3JpYmVBbGwoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRlbmRzIHRoZSB7QGxpbmsgVUlJbnN0YW5jZU1hbmFnZXJ9IGZvciBpbnRlcm5hbCB1c2UgaW4gdGhlIHtAbGluayBVSU1hbmFnZXJ9IGFuZCBwcm92aWRlcyBhY2Nlc3MgdG8gZnVuY3Rpb25hbGl0eVxuICogdGhhdCBjb21wb25lbnRzIHJlY2VpdmluZyBhIHJlZmVyZW5jZSB0byB0aGUge0BsaW5rIFVJSW5zdGFuY2VNYW5hZ2VyfSBzaG91bGQgbm90IGhhdmUgYWNjZXNzIHRvLlxuICovXG5jbGFzcyBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyIGV4dGVuZHMgVUlJbnN0YW5jZU1hbmFnZXIge1xuXG4gIHByaXZhdGUgY29uZmlndXJlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWxlYXNlZDogYm9vbGVhbjtcblxuICBnZXRXcmFwcGVkUGxheWVyKCk6IFdyYXBwZWRQbGF5ZXIge1xuICAgIC8vIFRPRE8gZmluZCBhIG5vbi1oYWNreSB3YXkgdG8gcHJvdmlkZSB0aGUgV3JhcHBlZFBsYXllciB0byB0aGUgVUlNYW5hZ2VyIHdpdGhvdXQgZXhwb3J0aW5nIGl0XG4gICAgLy8gZ2V0UGxheWVyKCkgYWN0dWFsbHkgcmV0dXJucyB0aGUgV3JhcHBlZFBsYXllciBidXQgaXRzIHJldHVybiB0eXBlIGlzIHNldCB0byBQbGF5ZXIgc28gdGhlIFdyYXBwZWRQbGF5ZXIgZG9lc1xuICAgIC8vIG5vdCBuZWVkIHRvIGJlIGV4cG9ydGVkXG4gICAgcmV0dXJuIDxXcmFwcGVkUGxheWVyPnRoaXMuZ2V0UGxheWVyKCk7XG4gIH1cblxuICBjb25maWd1cmVDb250cm9scygpOiB2b2lkIHtcbiAgICB0aGlzLmNvbmZpZ3VyZUNvbnRyb2xzVHJlZSh0aGlzLmdldFVJKCkpO1xuICAgIHRoaXMuY29uZmlndXJlZCA9IHRydWU7XG4gIH1cblxuICBpc0NvbmZpZ3VyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJlZDtcbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlQ29udHJvbHNUcmVlKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4pIHtcbiAgICBsZXQgY29uZmlndXJlZENvbXBvbmVudHM6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+W10gPSBbXTtcblxuICAgIFVJVXRpbHMudHJhdmVyc2VUcmVlKGNvbXBvbmVudCwgKGNvbXBvbmVudCkgPT4ge1xuICAgICAgLy8gRmlyc3QsIGNoZWNrIGlmIHdlIGhhdmUgYWxyZWFkeSBjb25maWd1cmVkIGEgY29tcG9uZW50LCBhbmQgdGhyb3cgYW4gZXJyb3IgaWYgd2UgZGlkLiBNdWx0aXBsZSBjb25maWd1cmF0aW9uXG4gICAgICAvLyBvZiB0aGUgc2FtZSBjb21wb25lbnQgbGVhZHMgdG8gdW5leHBlY3RlZCBVSSBiZWhhdmlvci4gQWxzbywgYSBjb21wb25lbnQgdGhhdCBpcyBpbiB0aGUgVUkgdHJlZSBtdWx0aXBsZVxuICAgICAgLy8gdGltZXMgaGludHMgYXQgYSB3cm9uZyBVSSBzdHJ1Y3R1cmUuXG4gICAgICAvLyBXZSBjb3VsZCBqdXN0IHNraXAgY29uZmlndXJhdGlvbiBpbiBzdWNoIGEgY2FzZSBhbmQgbm90IHRocm93IGFuIGV4Y2VwdGlvbiwgYnV0IGVuZm9yY2luZyBhIGNsZWFuIFVJIHRyZWVcbiAgICAgIC8vIHNlZW1zIGxpa2UgdGhlIGJldHRlciBjaG9pY2UuXG4gICAgICBmb3IgKGxldCBjb25maWd1cmVkQ29tcG9uZW50IG9mIGNvbmZpZ3VyZWRDb21wb25lbnRzKSB7XG4gICAgICAgIGlmIChjb25maWd1cmVkQ29tcG9uZW50ID09PSBjb21wb25lbnQpIHtcbiAgICAgICAgICAvLyBXcml0ZSB0aGUgY29tcG9uZW50IHRvIHRoZSBjb25zb2xlIHRvIHNpbXBsaWZ5IGlkZW50aWZpY2F0aW9uIG9mIHRoZSBjdWxwcml0XG4gICAgICAgICAgLy8gKGUuZy4gYnkgaW5zcGVjdGluZyB0aGUgY29uZmlnKVxuICAgICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDaXJjdWxhciByZWZlcmVuY2UgaW4gVUkgdHJlZScsIGNvbXBvbmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQWRkaXRpb25hbGx5IHRocm93IGFuIGVycm9yLCBiZWNhdXNlIHRoaXMgY2FzZSBtdXN0IG5vdCBoYXBwZW4gYW5kIGxlYWRzIHRvIHVuZXhwZWN0ZWQgVUkgYmVoYXZpb3IuXG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBpbiBVSSB0cmVlOiAnICsgY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbXBvbmVudC5pbml0aWFsaXplKCk7XG4gICAgICBjb21wb25lbnQuY29uZmlndXJlKHRoaXMuZ2V0UGxheWVyKCksIHRoaXMpO1xuICAgICAgY29uZmlndXJlZENvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVsZWFzZUNvbnRyb2xzKCk6IHZvaWQge1xuICAgIC8vIERvIG5vdCBjYWxsIHJlbGVhc2UgbWV0aG9kcyBpZiB0aGUgY29tcG9uZW50cyBoYXZlIG5ldmVyIGJlZW4gY29uZmlndXJlZDsgdGhpcyBjYW4gcmVzdWx0IGluIGV4Y2VwdGlvbnNcbiAgICBpZiAodGhpcy5jb25maWd1cmVkKSB7XG4gICAgICB0aGlzLnJlbGVhc2VDb250cm9sc1RyZWUodGhpcy5nZXRVSSgpKTtcbiAgICAgIHRoaXMuY29uZmlndXJlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnJlbGVhc2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGlzUmVsZWFzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucmVsZWFzZWQ7XG4gIH1cblxuICBwcml2YXRlIHJlbGVhc2VDb250cm9sc1RyZWUoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPikge1xuICAgIGNvbXBvbmVudC5yZWxlYXNlKCk7XG5cbiAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29udGFpbmVyKSB7XG4gICAgICBmb3IgKGxldCBjaGlsZENvbXBvbmVudCBvZiBjb21wb25lbnQuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZUNvbnRyb2xzVHJlZShjaGlsZENvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xlYXJFdmVudEhhbmRsZXJzKCk6IHZvaWQge1xuICAgIHN1cGVyLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuICB9XG59XG5cbi8qKlxuICogRXh0ZW5kZWQgaW50ZXJmYWNlIG9mIHRoZSB7QGxpbmsgUGxheWVyfSBmb3IgdXNlIGluIHRoZSBVSS5cbiAqL1xuaW50ZXJmYWNlIFdyYXBwZWRQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXJBUEkge1xuICAvKipcbiAgICogRmlyZXMgYW4gZXZlbnQgb24gdGhlIHBsYXllciB0aGF0IHRhcmdldHMgYWxsIGhhbmRsZXJzIGluIHRoZSBVSSBidXQgbmV2ZXIgZW50ZXJzIHRoZSByZWFsIHBsYXllci5cbiAgICogQHBhcmFtIGV2ZW50IHRoZSBldmVudCB0byBmaXJlXG4gICAqIEBwYXJhbSBkYXRhIGRhdGEgdG8gc2VuZCB3aXRoIHRoZSBldmVudFxuICAgKi9cbiAgZmlyZUV2ZW50SW5VSShldmVudDogRVZFTlQsIGRhdGE6IHt9KTogdm9pZDtcbn1cblxuLyoqXG4gKiBXcmFwcyB0aGUgcGxheWVyIHRvIHRyYWNrIGV2ZW50IGhhbmRsZXJzIGFuZCBwcm92aWRlIGEgc2ltcGxlIG1ldGhvZCB0byByZW1vdmUgYWxsIHJlZ2lzdGVyZWQgZXZlbnRcbiAqIGhhbmRsZXJzIGZyb20gdGhlIHBsYXllci5cbiAqL1xuY2xhc3MgUGxheWVyV3JhcHBlciB7XG5cbiAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllckFQSTtcbiAgcHJpdmF0ZSB3cmFwcGVyOiBXcmFwcGVkUGxheWVyO1xuXG4gIHByaXZhdGUgZXZlbnRIYW5kbGVyczogeyBbZXZlbnRUeXBlOiBzdHJpbmddOiBQbGF5ZXJFdmVudENhbGxiYWNrW107IH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSkge1xuICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuXG4gICAgLy8gQ29sbGVjdCBhbGwgcHVibGljIEFQSSBtZXRob2RzIG9mIHRoZSBwbGF5ZXJcbiAgICBsZXQgbWV0aG9kcyA9IDxhbnlbXT5bXTtcbiAgICBmb3IgKGxldCBtZW1iZXIgaW4gcGxheWVyKSB7XG4gICAgICBpZiAodHlwZW9mICg8YW55PnBsYXllcilbbWVtYmVyXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtZXRob2RzLnB1c2gobWVtYmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgd3JhcHBlciBvYmplY3QgYW5kIGFkZCBmdW5jdGlvbiB3cmFwcGVycyBmb3IgYWxsIEFQSSBtZXRob2RzIHRoYXQgZG8gbm90aGluZyBidXQgY2FsbGluZyB0aGUgYmFzZSBtZXRob2RcbiAgICAvLyBvbiB0aGUgcGxheWVyXG4gICAgbGV0IHdyYXBwZXIgPSA8YW55Pnt9O1xuICAgIGZvciAobGV0IG1lbWJlciBvZiBtZXRob2RzKSB7XG4gICAgICB3cmFwcGVyW21lbWJlcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsZWQgJyArIG1lbWJlcik7IC8vIHRyYWNrIG1ldGhvZCBjYWxscyBvbiB0aGUgcGxheWVyXG4gICAgICAgIHJldHVybiAoPGFueT5wbGF5ZXIpW21lbWJlcl0uYXBwbHkocGxheWVyLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBwdWJsaWMgcHJvcGVydGllcyBvZiB0aGUgcGxheWVyIGFuZCBhZGQgaXQgdG8gdGhlIHdyYXBwZXJcbiAgICBmb3IgKGxldCBtZW1iZXIgaW4gcGxheWVyKSB7XG4gICAgICBpZiAodHlwZW9mICg8YW55PnBsYXllcilbbWVtYmVyXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3cmFwcGVyW21lbWJlcl0gPSAoPGFueT5wbGF5ZXIpW21lbWJlcl07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhwbGljaXRseSBhZGQgYSB3cmFwcGVyIG1ldGhvZCBmb3IgJ2FkZEV2ZW50SGFuZGxlcicgdGhhdCBhZGRzIGFkZGVkIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBldmVudCBsaXN0XG4gICAgd3JhcHBlci5hZGRFdmVudEhhbmRsZXIgPSAoZXZlbnRUeXBlOiBFVkVOVCwgY2FsbGJhY2s6IFBsYXllckV2ZW50Q2FsbGJhY2spID0+IHtcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG5cbiAgICAgIGlmICghdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50VHlwZV0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50VHlwZV0ucHVzaChjYWxsYmFjayk7XG5cbiAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH07XG5cbiAgICAvLyBFeHBsaWNpdGx5IGFkZCBhIHdyYXBwZXIgbWV0aG9kIGZvciAncmVtb3ZlRXZlbnRIYW5kbGVyJyB0aGF0IHJlbW92ZXMgcmVtb3ZlZCBldmVudCBoYW5kbGVycyBmcm9tIHRoZSBldmVudCBsaXN0XG4gICAgd3JhcHBlci5yZW1vdmVFdmVudEhhbmRsZXIgPSAoZXZlbnRUeXBlOiBFVkVOVCwgY2FsbGJhY2s6IFBsYXllckV2ZW50Q2FsbGJhY2spID0+IHtcbiAgICAgIHBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG5cbiAgICAgIGlmICh0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSkge1xuICAgICAgICBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSwgY2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9O1xuXG4gICAgd3JhcHBlci5maXJlRXZlbnRJblVJID0gKGV2ZW50OiBFVkVOVCwgZGF0YToge30pID0+IHtcbiAgICAgIGlmICh0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRdKSB7IC8vIGNoZWNrIGlmIHRoZXJlIGFyZSBoYW5kbGVycyBmb3IgdGhpcyBldmVudCByZWdpc3RlcmVkXG4gICAgICAgIC8vIEV4dGVuZCB0aGUgZGF0YSBvYmplY3Qgd2l0aCBkZWZhdWx0IHZhbHVlcyB0byBjb252ZXJ0IGl0IHRvIGEge0BsaW5rIFBsYXllckV2ZW50fSBvYmplY3QuXG4gICAgICAgIGxldCBwbGF5ZXJFdmVudERhdGEgPSA8UGxheWVyRXZlbnQ+T2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB0eXBlOiBldmVudCxcbiAgICAgICAgICAvLyBBZGQgYSBtYXJrZXIgcHJvcGVydHkgc28gdGhlIFVJIGNhbiBkZXRlY3QgVUktaW50ZXJuYWwgcGxheWVyIGV2ZW50c1xuICAgICAgICAgIHVpU291cmNlZDogdHJ1ZSxcbiAgICAgICAgfSwgZGF0YSk7XG5cbiAgICAgICAgLy8gRXhlY3V0ZSB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFja3NcbiAgICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50XSkge1xuICAgICAgICAgIGNhbGxiYWNrKHBsYXllckV2ZW50RGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy53cmFwcGVyID0gPFdyYXBwZWRQbGF5ZXI+d3JhcHBlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgd3JhcHBlZCBwbGF5ZXIgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgb24gcGxhY2Ugb2YgdGhlIG5vcm1hbCBwbGF5ZXIgb2JqZWN0LlxuICAgKiBAcmV0dXJucyB7V3JhcHBlZFBsYXllcn0gYSB3cmFwcGVkIHBsYXllclxuICAgKi9cbiAgZ2V0UGxheWVyKCk6IFdyYXBwZWRQbGF5ZXIge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXI7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCByZWdpc3RlcmVkIGV2ZW50IGhhbmRsZXJzIGZyb20gdGhlIHBsYXllciB0aGF0IHdlcmUgYWRkZWQgdGhyb3VnaCB0aGUgd3JhcHBlZCBwbGF5ZXIuXG4gICAqL1xuICBjbGVhckV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgZXZlbnRUeXBlIGluIHRoaXMuZXZlbnRIYW5kbGVycykge1xuICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIucmVtb3ZlRXZlbnRIYW5kbGVyKGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtFdmVudERpc3BhdGNoZXIsIEV2ZW50LCBOb0FyZ3N9IGZyb20gJy4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50cy9jb21wb25lbnQnO1xuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXInO1xuXG5leHBvcnQgbmFtZXNwYWNlIEFycmF5VXRpbHMge1xuICAvKipcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gYW4gYXJyYXkuXG4gICAqIEBwYXJhbSBhcnJheSB0aGUgYXJyYXkgdGhhdCBtYXkgY29udGFpbiB0aGUgaXRlbSB0byByZW1vdmVcbiAgICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gcmVtb3ZlIGZyb20gdGhlIGFycmF5XG4gICAqIEByZXR1cm5zIHthbnl9IHRoZSByZW1vdmVkIGl0ZW0gb3IgbnVsbCBpZiBpdCB3YXNuJ3QgcGFydCBvZiB0aGUgYXJyYXlcbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiByZW1vdmU8VD4oYXJyYXk6IFRbXSwgaXRlbTogVCk6IFQgfCBudWxsIHtcbiAgICBsZXQgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiBhcnJheS5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBTdHJpbmdVdGlscyB7XG5cbiAgZXhwb3J0IGxldCBGT1JNQVRfSEhNTVNTOiBzdHJpbmcgPSAnaGg6bW06c3MnO1xuICBleHBvcnQgbGV0IEZPUk1BVF9NTVNTOiBzdHJpbmcgPSAnbW06c3MnO1xuXG4gIC8qKlxuICAgKiBGb3JtYXRzIGEgbnVtYmVyIG9mIHNlY29uZHMgaW50byBhIHRpbWUgc3RyaW5nIHdpdGggdGhlIHBhdHRlcm4gaGg6bW06c3MuXG4gICAqXG4gICAqIEBwYXJhbSB0b3RhbFNlY29uZHMgdGhlIHRvdGFsIG51bWJlciBvZiBzZWNvbmRzIHRvIGZvcm1hdCB0byBzdHJpbmdcbiAgICogQHBhcmFtIGZvcm1hdCB0aGUgdGltZSBmb3JtYXQgdG8gb3V0cHV0IChkZWZhdWx0OiBoaDptbTpzcylcbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIGZvcm1hdHRlZCB0aW1lIHN0cmluZ1xuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHNlY29uZHNUb1RpbWUodG90YWxTZWNvbmRzOiBudW1iZXIsIGZvcm1hdDogc3RyaW5nID0gRk9STUFUX0hITU1TUyk6IHN0cmluZyB7XG4gICAgbGV0IGlzTmVnYXRpdmUgPSB0b3RhbFNlY29uZHMgPCAwO1xuXG4gICAgaWYgKGlzTmVnYXRpdmUpIHtcbiAgICAgIC8vIElmIHRoZSB0aW1lIGlzIG5lZ2F0aXZlLCB3ZSBtYWtlIGl0IHBvc2l0aXZlIGZvciB0aGUgY2FsY3VsYXRpb24gYmVsb3dcbiAgICAgIC8vIChlbHNlIHdlJ2QgZ2V0IGFsbCBuZWdhdGl2ZSBudW1iZXJzKSBhbmQgcmVhdHRhY2ggdGhlIG5lZ2F0aXZlIHNpZ24gbGF0ZXIuXG4gICAgICB0b3RhbFNlY29uZHMgPSAtdG90YWxTZWNvbmRzO1xuICAgIH1cblxuICAgIC8vIFNwbGl0IGludG8gc2VwYXJhdGUgdGltZSBwYXJ0c1xuICAgIGxldCBob3VycyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gMzYwMCk7XG4gICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcyAvIDYwKSAtIGhvdXJzICogNjA7XG4gICAgbGV0IHNlY29uZHMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcykgJSA2MDtcblxuICAgIHJldHVybiAoaXNOZWdhdGl2ZSA/ICctJyA6ICcnKSArIGZvcm1hdFxuICAgICAgICAucmVwbGFjZSgnaGgnLCBsZWZ0UGFkV2l0aFplcm9zKGhvdXJzLCAyKSlcbiAgICAgICAgLnJlcGxhY2UoJ21tJywgbGVmdFBhZFdpdGhaZXJvcyhtaW51dGVzLCAyKSlcbiAgICAgICAgLnJlcGxhY2UoJ3NzJywgbGVmdFBhZFdpdGhaZXJvcyhzZWNvbmRzLCAyKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBudW1iZXIgdG8gYSBzdHJpbmcgYW5kIGxlZnQtcGFkcyBpdCB3aXRoIHplcm9zIHRvIHRoZSBzcGVjaWZpZWQgbGVuZ3RoLlxuICAgKiBFeGFtcGxlOiBsZWZ0UGFkV2l0aFplcm9zKDEyMywgNSkgPT4gJzAwMTIzJ1xuICAgKlxuICAgKiBAcGFyYW0gbnVtIHRoZSBudW1iZXIgdG8gY29udmVydCB0byBzdHJpbmcgYW5kIHBhZCB3aXRoIHplcm9zXG4gICAqIEBwYXJhbSBsZW5ndGggdGhlIGRlc2lyZWQgbGVuZ3RoIG9mIHRoZSBwYWRkZWQgc3RyaW5nXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBwYWRkZWQgbnVtYmVyIGFzIHN0cmluZ1xuICAgKi9cbiAgZnVuY3Rpb24gbGVmdFBhZFdpdGhaZXJvcyhudW06IG51bWJlciB8IHN0cmluZywgbGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGxldCB0ZXh0ID0gbnVtICsgJyc7XG4gICAgbGV0IHBhZGRpbmcgPSAnMDAwMDAwMDAwMCcuc3Vic3RyKDAsIGxlbmd0aCAtIHRleHQubGVuZ3RoKTtcbiAgICByZXR1cm4gcGFkZGluZyArIHRleHQ7XG4gIH1cblxuICAvKipcbiAgICogRmlsbHMgb3V0IHBsYWNlaG9sZGVycyBpbiBhbiBhZCBtZXNzYWdlLlxuICAgKlxuICAgKiBIYXMgdGhlIHBsYWNlaG9sZGVycyAne3JlbWFpbmluZ1RpbWVbZm9ybWF0U3RyaW5nXX0nLCAne3BsYXllZFRpbWVbZm9ybWF0U3RyaW5nXX0nIGFuZFxuICAgKiAne2FkRHVyYXRpb25bZm9ybWF0U3RyaW5nXX0nLCB3aGljaCBhcmUgcmVwbGFjZWQgYnkgdGhlIHJlbWFpbmluZyB0aW1lIHVudGlsIHRoZSBhZCBjYW4gYmUgc2tpcHBlZCwgdGhlIGN1cnJlbnRcbiAgICogdGltZSBvciB0aGUgYWQgZHVyYXRpb24uIFRoZSBmb3JtYXQgc3RyaW5nIGlzIG9wdGlvbmFsLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgcGxhY2Vob2xkZXIgaXMgcmVwbGFjZWQgYnkgdGhlIHRpbWVcbiAgICogaW4gc2Vjb25kcy4gSWYgc3BlY2lmaWVkLCBpdCBtdXN0IGJlIG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICAgKiAtICVkIC0gSW5zZXJ0cyB0aGUgdGltZSBhcyBhbiBpbnRlZ2VyLlxuICAgKiAtICUwTmQgLSBJbnNlcnRzIHRoZSB0aW1lIGFzIGFuIGludGVnZXIgd2l0aCBsZWFkaW5nIHplcm9lcywgaWYgdGhlIGxlbmd0aCBvZiB0aGUgdGltZSBzdHJpbmcgaXMgc21hbGxlciB0aGFuIE4uXG4gICAqIC0gJWYgLSBJbnNlcnRzIHRoZSB0aW1lIGFzIGEgZmxvYXQuXG4gICAqIC0gJTBOZiAtIEluc2VydHMgdGhlIHRpbWUgYXMgYSBmbG9hdCB3aXRoIGxlYWRpbmcgemVyb2VzLlxuICAgKiAtICUuTWYgLSBJbnNlcnRzIHRoZSB0aW1lIGFzIGEgZmxvYXQgd2l0aCBNIGRlY2ltYWwgcGxhY2VzLiBDYW4gYmUgY29tYmluZWQgd2l0aCAlME5mLCBlLmcuICUwNC4yZiAodGhlIHRpbWVcbiAgICogMTAuMTIzXG4gICAqIHdvdWxkIGJlIHByaW50ZWQgYXMgMDAxMC4xMikuXG4gICAqIC0gJWhoOm1tOnNzXG4gICAqIC0gJW1tOnNzXG4gICAqXG4gICAqIEBwYXJhbSBhZE1lc3NhZ2UgYW4gYWQgbWVzc2FnZSB3aXRoIG9wdGlvbmFsIHBsYWNlaG9sZGVycyB0byBmaWxsXG4gICAqIEBwYXJhbSBza2lwT2Zmc2V0IGlmIHNwZWNpZmllZCwge3JlbWFpbmluZ1RpbWV9IHdpbGwgYmUgZmlsbGVkIHdpdGggdGhlIHJlbWFpbmluZyB0aW1lIHVudGlsIHRoZSBhZCBjYW4gYmUgc2tpcHBlZFxuICAgKiBAcGFyYW0gcGxheWVyIHRoZSBwbGF5ZXIgdG8gZ2V0IHRoZSB0aW1lIGRhdGEgZnJvbVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgYWQgbWVzc2FnZSB3aXRoIGZpbGxlZCBwbGFjZWhvbGRlcnNcbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiByZXBsYWNlQWRNZXNzYWdlUGxhY2Vob2xkZXJzKGFkTWVzc2FnZTogc3RyaW5nLCBza2lwT2Zmc2V0OiBudW1iZXIsIHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJKSB7XG4gICAgbGV0IGFkTWVzc2FnZVBsYWNlaG9sZGVyUmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgJ1xcXFx7KHJlbWFpbmluZ1RpbWV8cGxheWVkVGltZXxhZER1cmF0aW9uKSh9fCUoKDBbMS05XVxcXFxkKihcXFxcLlxcXFxkKyhkfGYpfGR8Zil8XFxcXC5cXFxcZCtmfGR8Zil8aGg6bW06c3N8bW06c3MpfSknLFxuICAgICAgJ2cnXG4gICAgKTtcblxuICAgIHJldHVybiBhZE1lc3NhZ2UucmVwbGFjZShhZE1lc3NhZ2VQbGFjZWhvbGRlclJlZ2V4LCAoZm9ybWF0U3RyaW5nKSA9PiB7XG4gICAgICBsZXQgdGltZSA9IDA7XG4gICAgICBpZiAoZm9ybWF0U3RyaW5nLmluZGV4T2YoJ3JlbWFpbmluZ1RpbWUnKSA+IC0xKSB7XG4gICAgICAgIGlmIChza2lwT2Zmc2V0KSB7XG4gICAgICAgICAgdGltZSA9IE1hdGguY2VpbChza2lwT2Zmc2V0IC0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpbWUgPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAtIHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGZvcm1hdFN0cmluZy5pbmRleE9mKCdwbGF5ZWRUaW1lJykgPiAtMSkge1xuICAgICAgICB0aW1lID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICB9IGVsc2UgaWYgKGZvcm1hdFN0cmluZy5pbmRleE9mKCdhZER1cmF0aW9uJykgPiAtMSkge1xuICAgICAgICB0aW1lID0gcGxheWVyLmdldER1cmF0aW9uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZm9ybWF0TnVtYmVyKHRpbWUsIGZvcm1hdFN0cmluZyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXROdW1iZXIodGltZTogbnVtYmVyLCBmb3JtYXQ6IHN0cmluZykge1xuICAgIGxldCBmb3JtYXRTdHJpbmdWYWxpZGF0aW9uUmVnZXggPSAvJSgoMFsxLTldXFxkKihcXC5cXGQrKGR8Zil8ZHxmKXxcXC5cXGQrZnxkfGYpfGhoOm1tOnNzfG1tOnNzKS87XG4gICAgbGV0IGxlYWRpbmdaZXJvZXNSZWdleCA9IC8oJTBbMS05XVxcZCopKD89KFxcLlxcZCtmfGZ8ZCkpLztcbiAgICBsZXQgZGVjaW1hbFBsYWNlc1JlZ2V4ID0gL1xcLlxcZCooPz1mKS87XG5cbiAgICBpZiAoIWZvcm1hdFN0cmluZ1ZhbGlkYXRpb25SZWdleC50ZXN0KGZvcm1hdCkpIHtcbiAgICAgIC8vIElmIHRoZSBmb3JtYXQgaXMgaW52YWxpZCwgd2Ugc2V0IGEgZGVmYXVsdCBmYWxsYmFjayBmb3JtYXRcbiAgICAgIGZvcm1hdCA9ICclZCc7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgbGVhZGluZyB6ZXJvc1xuICAgIGxldCBsZWFkaW5nWmVyb2VzID0gMDtcbiAgICBsZXQgbGVhZGluZ1plcm9lc01hdGNoZXMgPSBmb3JtYXQubWF0Y2gobGVhZGluZ1plcm9lc1JlZ2V4KTtcbiAgICBpZiAobGVhZGluZ1plcm9lc01hdGNoZXMpIHtcbiAgICAgIGxlYWRpbmdaZXJvZXMgPSBwYXJzZUludChsZWFkaW5nWmVyb2VzTWF0Y2hlc1swXS5zdWJzdHJpbmcoMikpO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gICAgbGV0IG51bURlY2ltYWxQbGFjZXMgPSBudWxsO1xuICAgIGxldCBkZWNpbWFsUGxhY2VzTWF0Y2hlcyA9IGZvcm1hdC5tYXRjaChkZWNpbWFsUGxhY2VzUmVnZXgpO1xuICAgIGlmIChkZWNpbWFsUGxhY2VzTWF0Y2hlcyAmJiAhaXNOYU4ocGFyc2VJbnQoZGVjaW1hbFBsYWNlc01hdGNoZXNbMF0uc3Vic3RyaW5nKDEpKSkpIHtcbiAgICAgIG51bURlY2ltYWxQbGFjZXMgPSBwYXJzZUludChkZWNpbWFsUGxhY2VzTWF0Y2hlc1swXS5zdWJzdHJpbmcoMSkpO1xuICAgICAgaWYgKG51bURlY2ltYWxQbGFjZXMgPiAyMCkge1xuICAgICAgICBudW1EZWNpbWFsUGxhY2VzID0gMjA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRmxvYXQgZm9ybWF0XG4gICAgaWYgKGZvcm1hdC5pbmRleE9mKCdmJykgPiAtMSkge1xuICAgICAgbGV0IHRpbWVTdHJpbmcgPSAnJztcblxuICAgICAgaWYgKG51bURlY2ltYWxQbGFjZXMgIT09IG51bGwpIHtcbiAgICAgICAgLy8gQXBwbHkgZml4ZWQgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gICAgICAgIHRpbWVTdHJpbmcgPSB0aW1lLnRvRml4ZWQobnVtRGVjaW1hbFBsYWNlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lU3RyaW5nID0gJycgKyB0aW1lO1xuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBsZWFkaW5nIHplcm9zXG4gICAgICBpZiAodGltZVN0cmluZy5pbmRleE9mKCcuJykgPiAtMSkge1xuICAgICAgICByZXR1cm4gbGVmdFBhZFdpdGhaZXJvcyh0aW1lU3RyaW5nLCB0aW1lU3RyaW5nLmxlbmd0aCArIChsZWFkaW5nWmVyb2VzIC0gdGltZVN0cmluZy5pbmRleE9mKCcuJykpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKHRpbWVTdHJpbmcsIGxlYWRpbmdaZXJvZXMpO1xuICAgICAgfVxuXG4gICAgfVxuICAgIC8vIFRpbWUgZm9ybWF0XG4gICAgZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICBsZXQgdG90YWxTZWNvbmRzID0gTWF0aC5jZWlsKHRpbWUpO1xuXG4gICAgICAvLyBoaDptbTpzcyBmb3JtYXRcbiAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignaGgnKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBzZWNvbmRzVG9UaW1lKHRvdGFsU2Vjb25kcyk7XG4gICAgICB9XG4gICAgICAvLyBtbTpzcyBmb3JtYXRcbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApO1xuICAgICAgICBsZXQgc2Vjb25kcyA9IHRvdGFsU2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKG1pbnV0ZXMsIDIpICsgJzonICsgbGVmdFBhZFdpdGhaZXJvcyhzZWNvbmRzLCAyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSW50ZWdlciBmb3JtYXRcbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKE1hdGguY2VpbCh0aW1lKSwgbGVhZGluZ1plcm9lcyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgUGxheWVyVXRpbHMge1xuXG4gIGltcG9ydCBQbGF5ZXJBUEkgPSBiaXRtb3Zpbi5QbGF5ZXJBUEk7XG5cbiAgZXhwb3J0IGVudW0gUGxheWVyU3RhdGUge1xuICAgIElETEUsXG4gICAgUFJFUEFSRUQsXG4gICAgUExBWUlORyxcbiAgICBQQVVTRUQsXG4gICAgRklOSVNIRUQsXG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaXNTb3VyY2VMb2FkZWQocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcGxheWVyLmdldENvbmZpZygpLnNvdXJjZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGlzVGltZVNoaWZ0QXZhaWxhYmxlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHBsYXllci5pc0xpdmUoKSAmJiBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgIT09IDA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUocGxheWVyOiBQbGF5ZXJBUEkpOiBQbGF5ZXJTdGF0ZSB7XG4gICAgaWYgKHBsYXllci5oYXNFbmRlZCgpKSB7XG4gICAgICByZXR1cm4gUGxheWVyU3RhdGUuRklOSVNIRUQ7XG4gICAgfSBlbHNlIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgIHJldHVybiBQbGF5ZXJTdGF0ZS5QTEFZSU5HO1xuICAgIH0gZWxzZSBpZiAocGxheWVyLmlzUGF1c2VkKCkpIHtcbiAgICAgIHJldHVybiBQbGF5ZXJTdGF0ZS5QQVVTRUQ7XG4gICAgfSBlbHNlIGlmIChpc1NvdXJjZUxvYWRlZChwbGF5ZXIpKSB7XG4gICAgICByZXR1cm4gUGxheWVyU3RhdGUuUFJFUEFSRUQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQbGF5ZXJTdGF0ZS5JRExFO1xuICAgIH1cbiAgfVxuXG4gIGV4cG9ydCBpbnRlcmZhY2UgVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3MgZXh0ZW5kcyBOb0FyZ3Mge1xuICAgIHRpbWVTaGlmdEF2YWlsYWJsZTogYm9vbGVhbjtcbiAgfVxuXG4gIGV4cG9ydCBjbGFzcyBUaW1lU2hpZnRBdmFpbGFiaWxpdHlEZXRlY3RvciB7XG5cbiAgICBwcml2YXRlIHBsYXllcjogUGxheWVyQVBJO1xuICAgIHByaXZhdGUgdGltZVNoaWZ0QXZhaWxhYmxlOiBib29sZWFuO1xuICAgIHByaXZhdGUgdGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEV2ZW50ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxQbGF5ZXJBUEksIFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzPigpO1xuXG4gICAgY29uc3RydWN0b3IocGxheWVyOiBQbGF5ZXJBUEkpIHtcbiAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgICAgdGhpcy50aW1lU2hpZnRBdmFpbGFibGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGxldCB0aW1lU2hpZnREZXRlY3RvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5kZXRlY3QoKTtcbiAgICAgIH07XG4gICAgICAvLyBUcnkgdG8gZGV0ZWN0IHRpbWVzaGlmdCBhdmFpbGFiaWxpdHkgaW4gT05fUkVBRFksIHdoaWNoIHdvcmtzIGZvciBEQVNIIHN0cmVhbXNcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB0aW1lU2hpZnREZXRlY3Rvcik7XG4gICAgICAvLyBXaXRoIEhMUy9OYXRpdmVQbGF5ZXIgc3RyZWFtcywgZ2V0TWF4VGltZVNoaWZ0IGNhbiBiZSAwIGJlZm9yZSB0aGUgYnVmZmVyIGZpbGxzLCBzbyB3ZSBuZWVkIHRvIGFkZGl0aW9uYWxseVxuICAgICAgLy8gY2hlY2sgdGltZXNoaWZ0IGF2YWlsYWJpbGl0eSBpbiBPTl9USU1FX0NIQU5HRURcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgdGltZVNoaWZ0RGV0ZWN0b3IpO1xuICAgIH1cblxuICAgIGRldGVjdCgpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLnBsYXllci5pc0xpdmUoKSkge1xuICAgICAgICBsZXQgdGltZVNoaWZ0QXZhaWxhYmxlTm93ID0gUGxheWVyVXRpbHMuaXNUaW1lU2hpZnRBdmFpbGFibGUodGhpcy5wbGF5ZXIpO1xuXG4gICAgICAgIC8vIFdoZW4gdGhlIGF2YWlsYWJpbGl0eSBjaGFuZ2VzLCB3ZSBmaXJlIHRoZSBldmVudFxuICAgICAgICBpZiAodGltZVNoaWZ0QXZhaWxhYmxlTm93ICE9PSB0aGlzLnRpbWVTaGlmdEF2YWlsYWJsZSkge1xuICAgICAgICAgIHRoaXMudGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEV2ZW50LmRpc3BhdGNoKHRoaXMucGxheWVyLCB7IHRpbWVTaGlmdEF2YWlsYWJsZTogdGltZVNoaWZ0QXZhaWxhYmxlTm93IH0pO1xuICAgICAgICAgIHRoaXMudGltZVNoaWZ0QXZhaWxhYmxlID0gdGltZVNoaWZ0QXZhaWxhYmxlTm93O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IG9uVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZCgpOiBFdmVudDxQbGF5ZXJBUEksIFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzPiB7XG4gICAgICByZXR1cm4gdGhpcy50aW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkRXZlbnQuZ2V0RXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICBleHBvcnQgaW50ZXJmYWNlIExpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncyBleHRlbmRzIE5vQXJncyB7XG4gICAgbGl2ZTogYm9vbGVhbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlY3RzIGNoYW5nZXMgb2YgdGhlIHN0cmVhbSB0eXBlLCBpLmUuIGNoYW5nZXMgb2YgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgcGxheWVyI2lzTGl2ZSBtZXRob2QuXG4gICAqIE5vcm1hbGx5LCBhIHN0cmVhbSBjYW5ub3QgY2hhbmdlIGl0cyB0eXBlIGR1cmluZyBwbGF5YmFjaywgaXQncyBlaXRoZXIgVk9EIG9yIGxpdmUuIER1ZSB0byBidWdzIG9uIHNvbWVcbiAgICogcGxhdGZvcm1zIG9yIGJyb3dzZXJzLCBpdCBjYW4gc3RpbGwgY2hhbmdlLiBJdCBpcyB0aGVyZWZvcmUgdW5yZWxpYWJsZSB0byBqdXN0IGNoZWNrICNpc0xpdmUgYW5kIHRoaXMgZGV0ZWN0b3JcbiAgICogc2hvdWxkIGJlIHVzZWQgYXMgYSB3b3JrYXJvdW5kIGluc3RlYWQuXG4gICAqXG4gICAqIEtub3duIGNhc2VzOlxuICAgKlxuICAgKiAtIEhMUyBWT0Qgb24gQW5kcm9pZCA0LjNcbiAgICogVmlkZW8gZHVyYXRpb24gaXMgaW5pdGlhbGx5ICdJbmZpbml0eScgYW5kIG9ubHkgZ2V0cyBhdmFpbGFibGUgYWZ0ZXIgcGxheWJhY2sgc3RhcnRzLCBzbyBzdHJlYW1zIGFyZSB3cm9uZ2x5XG4gICAqIHJlcG9ydGVkIGFzICdsaXZlJyBiZWZvcmUgcGxheWJhY2sgKHRoZSBsaXZlLWNoZWNrIGluIHRoZSBwbGF5ZXIgY2hlY2tzIGZvciBpbmZpbml0ZSBkdXJhdGlvbikuXG4gICAqL1xuICBleHBvcnQgY2xhc3MgTGl2ZVN0cmVhbURldGVjdG9yIHtcblxuICAgIHByaXZhdGUgcGxheWVyOiBQbGF5ZXJBUEk7XG4gICAgcHJpdmF0ZSBsaXZlOiBib29sZWFuO1xuICAgIHByaXZhdGUgbGl2ZUNoYW5nZWRFdmVudCA9IG5ldyBFdmVudERpc3BhdGNoZXI8UGxheWVyQVBJLCBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3M+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSkge1xuICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICB0aGlzLmxpdmUgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGxldCBsaXZlRGV0ZWN0b3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGV0ZWN0KCk7XG4gICAgICB9O1xuICAgICAgLy8gSW5pdGlhbGl6ZSB3aGVuIHBsYXllciBpcyByZWFkeVxuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIGxpdmVEZXRlY3Rvcik7XG4gICAgICAvLyBSZS1ldmFsdWF0ZSB3aGVuIHBsYXliYWNrIHN0YXJ0c1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgbGl2ZURldGVjdG9yKTtcblxuICAgICAgLy8gSExTIGxpdmUgZGV0ZWN0aW9uIHdvcmthcm91bmQgZm9yIEFuZHJvaWQ6XG4gICAgICAvLyBBbHNvIHJlLWV2YWx1YXRlIGR1cmluZyBwbGF5YmFjaywgYmVjYXVzZSB0aGF0IGlzIHdoZW4gdGhlIGxpdmUgZmxhZyBtaWdodCBjaGFuZ2UuXG4gICAgICAvLyAoRG9pbmcgaXQgb25seSBpbiBBbmRyb2lkIENocm9tZSBzYXZlcyB1bm5lY2Vzc2FyeSBvdmVyaGVhZCBvbiBvdGhlciBwbGF0dGZvcm1zKVxuICAgICAgaWYgKEJyb3dzZXJVdGlscy5pc0FuZHJvaWQgJiYgQnJvd3NlclV0aWxzLmlzQ2hyb21lKSB7XG4gICAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgbGl2ZURldGVjdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZXRlY3QoKTogdm9pZCB7XG4gICAgICBsZXQgbGl2ZU5vdyA9IHRoaXMucGxheWVyLmlzTGl2ZSgpO1xuXG4gICAgICAvLyBDb21wYXJlIGN1cnJlbnQgdG8gcHJldmlvdXMgbGl2ZSBzdGF0ZSBmbGFnIGFuZCBmaXJlIGV2ZW50IHdoZW4gaXQgY2hhbmdlcy4gU2luY2Ugd2UgaW5pdGlhbGl6ZSB0aGUgZmxhZ1xuICAgICAgLy8gd2l0aCB1bmRlZmluZWQsIHRoZXJlIGlzIGFsd2F5cyBhdCBsZWFzdCBhbiBpbml0aWFsIGV2ZW50IGZpcmVkIHRoYXQgdGVsbHMgbGlzdGVuZXJzIHRoZSBsaXZlIHN0YXRlLlxuICAgICAgaWYgKGxpdmVOb3cgIT09IHRoaXMubGl2ZSkge1xuICAgICAgICB0aGlzLmxpdmVDaGFuZ2VkRXZlbnQuZGlzcGF0Y2godGhpcy5wbGF5ZXIsIHsgbGl2ZTogbGl2ZU5vdyB9KTtcbiAgICAgICAgdGhpcy5saXZlID0gbGl2ZU5vdztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgb25MaXZlQ2hhbmdlZCgpOiBFdmVudDxQbGF5ZXJBUEksIExpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncz4ge1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZUNoYW5nZWRFdmVudC5nZXRFdmVudCgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIFVJVXRpbHMge1xuICBleHBvcnQgaW50ZXJmYWNlIFRyZWVUcmF2ZXJzYWxDYWxsYmFjayB7XG4gICAgKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIHBhcmVudD86IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KTogdm9pZDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB0cmF2ZXJzZVRyZWUoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgdmlzaXQ6IFRyZWVUcmF2ZXJzYWxDYWxsYmFjayk6IHZvaWQge1xuICAgIGxldCByZWN1cnNpdmVUcmVlV2Fsa2VyID0gKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIHBhcmVudD86IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSA9PiB7XG4gICAgICB2aXNpdChjb21wb25lbnQsIHBhcmVudCk7XG5cbiAgICAgIC8vIElmIHRoZSBjdXJyZW50IGNvbXBvbmVudCBpcyBhIGNvbnRhaW5lciwgdmlzaXQgaXQncyBjaGlsZHJlblxuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbnRhaW5lcikge1xuICAgICAgICBmb3IgKGxldCBjaGlsZENvbXBvbmVudCBvZiBjb21wb25lbnQuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICAgICAgcmVjdXJzaXZlVHJlZVdhbGtlcihjaGlsZENvbXBvbmVudCwgY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBXYWxrIGFuZCBjb25maWd1cmUgdGhlIGNvbXBvbmVudCB0cmVlXG4gICAgcmVjdXJzaXZlVHJlZVdhbGtlcihjb21wb25lbnQpO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQnJvd3NlclV0aWxzIHtcblxuICAvLyBpc01vYmlsZSBvbmx5IG5lZWRzIHRvIGJlIGV2YWx1YXRlZCBvbmNlIChpdCBjYW5ub3QgY2hhbmdlIGR1cmluZyBhIGJyb3dzZXIgc2Vzc2lvbilcbiAgLy8gTW9iaWxlIGRldGVjdGlvbiBhY2NvcmRpbmcgdG8gTW96aWxsYSByZWNvbW1lbmRhdGlvbjogXCJJbiBzdW1tYXJ5LCB3ZSByZWNvbW1lbmQgbG9va2luZyBmb3IgdGhlIHN0cmluZyDigJxNb2Jp4oCdXG4gIC8vIGFueXdoZXJlIGluIHRoZSBVc2VyIEFnZW50IHRvIGRldGVjdCBhIG1vYmlsZSBkZXZpY2UuXCJcbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9Ccm93c2VyX2RldGVjdGlvbl91c2luZ190aGVfdXNlcl9hZ2VudFxuICBleHBvcnQgY29uc3QgaXNNb2JpbGUgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvTW9iaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuICBleHBvcnQgY29uc3QgaXNDaHJvbWUgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvQ2hyb21lLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG4gIGV4cG9ydCBjb25zdCBpc0FuZHJvaWQgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbn0iXX0=
