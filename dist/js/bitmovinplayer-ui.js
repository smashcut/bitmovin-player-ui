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
        _this.avatarLabel = new label_1.Label({ cssClasses: ['seekbar-label-avatar'] });
        _this.commentLabel = new label_1.Label({ cssClasses: ['seekbar-label-comment'] });
        _this.mentorDot = new component_1.Component({ cssClasses: ['seekbar-label-mentor-dot'] });
        _this.numberLabel = new label_1.Label({ cssClasses: ['seekbar-label-number'] });
        _this.thumbnail = new component_1.Component({ cssClasses: ['seekbar-thumbnail'] });
        _this.timeLabel = new label_1.Label({ cssClasses: ['seekbar-label-time'] });
        _this.titleLabel = new label_1.Label({ cssClasses: ['seekbar-label-title'] });
        _this.metadata = new container_1.Container({
            components: [
                new container_1.Container({
                    components: [
                        _this.avatarLabel,
                        _this.titleLabel,
                        new container_1.Container({
                            components: [
                                _this.mentorDot,
                                _this.numberLabel
                            ],
                            cssClass: 'seekbar-label-number-container',
                        })
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
                    _this.setLabelClass(args.marker.markerType);
                    _this.setTitleText(args.marker.title);
                    _this.setSmashcutData(args.marker);
                    _this.setTimeText(null);
                    _this.setThumbnail(null);
                    _this.setBackground(true);
                }
                else {
                    _this.setLabelClass('thumbnail');
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
    SeekBarLabel.prototype.setLabelClass = function (newLabelClass) {
        if (this.labelClass) {
            this.getDomElement().removeClass(this.prefixCss(this.labelClass));
        }
        this.labelClass = newLabelClass;
        if (this.labelClass) {
            this.getDomElement().addClass(this.prefixCss(this.labelClass));
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvY29tcG9uZW50cy9hZGNsaWNrb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL2FkbWVzc2FnZWxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYWRza2lwYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYWlycGxheXRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2F1ZGlvcXVhbGl0eXNlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL2F1ZGlvdHJhY2tzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9idWZmZXJpbmdvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2FzdHN0YXR1c292ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jYXN0dG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2FzdHVpY29udGFpbmVyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvY2hlY2tib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jbGlja292ZXJsYXkudHMiLCJzcmMvdHMvY29tcG9uZW50cy9jbG9zZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2Nsb3NlZGNhcHRpb25pbmd0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9jb21tZW50c3RvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbXBvbmVudC50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbnRhaW5lci50cyIsInNyYy90cy9jb21wb25lbnRzL2NvbnRyb2xiYXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy9lbWJlZHZpZGVvcGFuZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9lbWJlZHZpZGVvdG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvZXJyb3JtZXNzYWdlb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL2Z1bGxzY3JlZW50b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9odWdlcGxheWJhY2t0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy9odWdlcmVwbGF5YnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvbGFiZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9saXN0c2VsZWN0b3IudHMiLCJzcmMvdHMvY29tcG9uZW50cy9tZXRhZGF0YWxhYmVsLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcGljdHVyZWlucGljdHVyZXRvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL3BsYXliYWNrc3BlZWRzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy9wbGF5YmFja3RpbWVsYWJlbC50cyIsInNyYy90cy9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcGxheWJhY2t0b2dnbGVvdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvcmVjb21tZW5kYXRpb25vdmVybGF5LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvc2Vla2Jhci50cyIsInNyYy90cy9jb21wb25lbnRzL3NlZWtiYXJsYWJlbC50cyIsInNyYy90cy9jb21wb25lbnRzL3NlbGVjdGJveC50cyIsInNyYy90cy9jb21wb25lbnRzL3NldHRpbmdzcGFuZWwudHMiLCJzcmMvdHMvY29tcG9uZW50cy9zZXR0aW5nc3RvZ2dsZWJ1dHRvbi50cyIsInNyYy90cy9jb21wb25lbnRzL3NwYWNlci50cyIsInNyYy90cy9jb21wb25lbnRzL3N1YnRpdGxlb3ZlcmxheS50cyIsInNyYy90cy9jb21wb25lbnRzL3N1YnRpdGxlc2VsZWN0Ym94LnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdGl0bGViYXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy90b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy90dm5vaXNlY2FudmFzLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdWljb250YWluZXIudHMiLCJzcmMvdHMvY29tcG9uZW50cy92aWRlb3F1YWxpdHlzZWxlY3Rib3gudHMiLCJzcmMvdHMvY29tcG9uZW50cy92b2x1bWVjb250cm9sYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdm9sdW1lc2xpZGVyLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdm9sdW1ldG9nZ2xlYnV0dG9uLnRzIiwic3JjL3RzL2NvbXBvbmVudHMvdnJ0b2dnbGVidXR0b24udHMiLCJzcmMvdHMvY29tcG9uZW50cy93YXRlcm1hcmsudHMiLCJzcmMvdHMvZG9tLnRzIiwic3JjL3RzL2V2ZW50ZGlzcGF0Y2hlci50cyIsInNyYy90cy9ndWlkLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvdGltZW91dC50cyIsInNyYy90cy91aW1hbmFnZXIudHMiLCJzcmMvdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7QUNBQSwrQ0FBNEM7QUFHNUM7O0dBRUc7QUFDSDtJQUFvQyxrQ0FBWTtJQUFoRDs7SUF1Q0EsQ0FBQztJQXJDQyxrQ0FBUyxHQUFULFVBQVUsTUFBMEIsRUFBRSxTQUE0QjtRQUFsRSxpQkFvQ0M7UUFuQ0MsaUJBQU0sU0FBUyxZQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVuQyxJQUFJLGVBQWUsR0FBVyxJQUFJLENBQUM7UUFDbkMsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXO2VBQ3BELENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUM7ZUFDckUsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQztRQUV4RCxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxF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SSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuRyxDQUFDLEVBWGdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBVzVCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7Q2xpY2tPdmVybGF5fSBmcm9tICcuL2NsaWNrb3ZlcmxheSc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2ltcGxlIGNsaWNrIGNhcHR1cmUgb3ZlcmxheSBmb3IgY2xpY2tUaHJvdWdoVXJscyBvZiBhZHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBZENsaWNrT3ZlcmxheSBleHRlbmRzIENsaWNrT3ZlcmxheSB7XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjbGlja1Rocm91Z2hVcmwgPSA8c3RyaW5nPm51bGw7XG4gICAgbGV0IGNsaWNrVGhyb3VnaEVuYWJsZWQgPSAhcGxheWVyLmdldENvbmZpZygpLmFkdmVydGlzaW5nXG4gICAgICB8fCAhcGxheWVyLmdldENvbmZpZygpLmFkdmVydGlzaW5nLmhhc093blByb3BlcnR5KCdjbGlja1Rocm91Z2hFbmFibGVkJylcbiAgICAgIHx8IHBsYXllci5nZXRDb25maWcoKS5hZHZlcnRpc2luZy5jbGlja1Rocm91Z2hFbmFibGVkO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfU1RBUlRFRCwgKGV2ZW50OiBiaXRtb3Zpbi5QbGF5ZXJBUEkuQWRTdGFydGVkRXZlbnQpID0+IHtcbiAgICAgIGNsaWNrVGhyb3VnaFVybCA9IGV2ZW50LmNsaWNrVGhyb3VnaFVybDtcblxuICAgICAgaWYgKGNsaWNrVGhyb3VnaEVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5zZXRVcmwoY2xpY2tUaHJvdWdoVXJsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIGNsaWNrLXRocm91Z2ggaXMgZGlzYWJsZWQsIHdlIHNldCB0aGUgdXJsIHRvIG51bGwgdG8gYXZvaWQgaXQgb3BlblxuICAgICAgICB0aGlzLnNldFVybChudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENsZWFyIGNsaWNrLXRocm91Z2ggVVJMIHdoZW4gYWQgaGFzIGZpbmlzaGVkXG4gICAgbGV0IGFkRmluaXNoZWRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRVcmwobnVsbCk7XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgYWRGaW5pc2hlZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX1NLSVBQRUQsIGFkRmluaXNoZWRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9FUlJPUiwgYWRGaW5pc2hlZEhhbmRsZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBQYXVzZSB0aGUgYWQgd2hlbiBvdmVybGF5IGlzIGNsaWNrZWRcbiAgICAgIHBsYXllci5wYXVzZSgndWktY29udGVudC1jbGljaycpO1xuXG4gICAgICAvLyBOb3RpZnkgdGhlIHBsYXllciBvZiB0aGUgY2xpY2tlZCBhZFxuICAgICAgcGxheWVyLmZpcmVFdmVudChwbGF5ZXIuRVZFTlQuT05fQURfQ0xJQ0tFRCwge1xuICAgICAgICBjbGlja1Rocm91Z2hVcmw6IGNsaWNrVGhyb3VnaFVybFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtTdHJpbmdVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIEEgbGFiZWwgdGhhdCBkaXNwbGF5cyBhIG1lc3NhZ2UgYWJvdXQgYSBydW5uaW5nIGFkLCBvcHRpb25hbGx5IHdpdGggYSBjb3VudGRvd24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBZE1lc3NhZ2VMYWJlbCBleHRlbmRzIExhYmVsPExhYmVsQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktbGFiZWwtYWQtbWVzc2FnZScsXG4gICAgICB0ZXh0OiAnVGhpcyBhZCB3aWxsIGVuZCBpbiB7cmVtYWluaW5nVGltZX0gc2Vjb25kcy4nXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB0ZXh0ID0gdGhpcy5nZXRDb25maWcoKS50ZXh0O1xuXG4gICAgbGV0IHVwZGF0ZU1lc3NhZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRUZXh0KFN0cmluZ1V0aWxzLnJlcGxhY2VBZE1lc3NhZ2VQbGFjZWhvbGRlcnModGV4dCwgbnVsbCwgcGxheWVyKSk7XG4gICAgfTtcblxuICAgIGxldCBhZFN0YXJ0SGFuZGxlciA9IChldmVudDogYml0bW92aW4uUGxheWVyQVBJLkFkU3RhcnRlZEV2ZW50KSA9PiB7XG4gICAgICB0ZXh0ID0gZXZlbnQuYWRNZXNzYWdlIHx8IHRleHQ7XG4gICAgICB1cGRhdGVNZXNzYWdlSGFuZGxlcigpO1xuXG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHVwZGF0ZU1lc3NhZ2VIYW5kbGVyKTtcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfVElNRV9VUERBVEVELCB1cGRhdGVNZXNzYWdlSGFuZGxlcik7XG4gICAgfTtcblxuICAgIGxldCBhZEVuZEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBwbGF5ZXIucmVtb3ZlRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHVwZGF0ZU1lc3NhZ2VIYW5kbGVyKTtcbiAgICAgIHBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfVElNRV9VUERBVEVELCB1cGRhdGVNZXNzYWdlSGFuZGxlcik7XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX1NUQVJURUQsIGFkU3RhcnRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9TS0lQUEVELCBhZEVuZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX0VSUk9SLCBhZEVuZEhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FEX0ZJTklTSEVELCBhZEVuZEhhbmRsZXIpO1xuICB9XG59IiwiaW1wb3J0IHtCdXR0b25Db25maWcsIEJ1dHRvbn0gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBTa2lwTWVzc2FnZSA9IGJpdG1vdmluLlBsYXllckFQSS5Ta2lwTWVzc2FnZTtcbmltcG9ydCB7U3RyaW5nVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBBZFNraXBCdXR0b259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkU2tpcEJ1dHRvbkNvbmZpZyBleHRlbmRzIEJ1dHRvbkNvbmZpZyB7XG4gIHNraXBNZXNzYWdlPzogU2tpcE1lc3NhZ2U7XG59XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCBpcyBkaXNwbGF5ZWQgZHVyaW5nIGFkcyBhbmQgY2FuIGJlIHVzZWQgdG8gc2tpcCB0aGUgYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBBZFNraXBCdXR0b24gZXh0ZW5kcyBCdXR0b248QWRTa2lwQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBBZFNraXBCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCA8QWRTa2lwQnV0dG9uQ29uZmlnPntcbiAgICAgIGNzc0NsYXNzOiAndWktYnV0dG9uLWFkLXNraXAnLFxuICAgICAgc2tpcE1lc3NhZ2U6IHtcbiAgICAgICAgY291bnRkb3duOiAnU2tpcCBhZCBpbiB7cmVtYWluaW5nVGltZX0nLFxuICAgICAgICBza2lwOiAnU2tpcCBhZCdcbiAgICAgIH1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxBZFNraXBCdXR0b25Db25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBnZXQgcmlkIG9mIGdlbmVyaWMgY2FzdFxuICAgIGxldCBza2lwTWVzc2FnZSA9IGNvbmZpZy5za2lwTWVzc2FnZTtcbiAgICBsZXQgYWRFdmVudCA9IDxiaXRtb3Zpbi5QbGF5ZXJBUEkuQWRTdGFydGVkRXZlbnQ+bnVsbDtcblxuICAgIGxldCB1cGRhdGVTa2lwTWVzc2FnZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAvLyBEaXNwbGF5IHRoaXMgYnV0dG9uIG9ubHkgaWYgYWQgaXMgc2tpcHBhYmxlXG4gICAgICBpZiAoYWRFdmVudC5za2lwT2Zmc2V0KSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgc2tpcCBtZXNzYWdlIG9uIHRoZSBidXR0b25cbiAgICAgIGlmIChwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKSA8IGFkRXZlbnQuc2tpcE9mZnNldCkge1xuICAgICAgICB0aGlzLnNldFRleHQoXG4gICAgICAgICAgU3RyaW5nVXRpbHMucmVwbGFjZUFkTWVzc2FnZVBsYWNlaG9sZGVycyhjb25maWcuc2tpcE1lc3NhZ2UuY291bnRkb3duLCBhZEV2ZW50LnNraXBPZmZzZXQsIHBsYXllcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRUZXh0KGNvbmZpZy5za2lwTWVzc2FnZS5za2lwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IGFkU3RhcnRIYW5kbGVyID0gKGV2ZW50OiBiaXRtb3Zpbi5QbGF5ZXJBUEkuQWRTdGFydGVkRXZlbnQpID0+IHtcbiAgICAgIGFkRXZlbnQgPSBldmVudDtcbiAgICAgIHNraXBNZXNzYWdlID0gYWRFdmVudC5za2lwTWVzc2FnZSB8fCBza2lwTWVzc2FnZTtcbiAgICAgIHVwZGF0ZVNraXBNZXNzYWdlSGFuZGxlcigpO1xuXG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHVwZGF0ZVNraXBNZXNzYWdlSGFuZGxlcik7XG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgdXBkYXRlU2tpcE1lc3NhZ2VIYW5kbGVyKTtcbiAgICB9O1xuXG4gICAgbGV0IGFkRW5kSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgdXBkYXRlU2tpcE1lc3NhZ2VIYW5kbGVyKTtcbiAgICAgIHBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfVElNRV9VUERBVEVELCB1cGRhdGVTa2lwTWVzc2FnZUhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVELCBhZFN0YXJ0SGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQURfU0tJUFBFRCwgYWRFbmRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9FUlJPUiwgYWRFbmRIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgYWRFbmRIYW5kbGVyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gVHJ5IHRvIHNraXAgdGhlIGFkICh0aGlzIG9ubHkgd29ya3MgaWYgaXQgaXMgc2tpcHBhYmxlIHNvIHdlIGRvbid0IG5lZWQgdG8gdGFrZSBleHRyYSBjYXJlIG9mIHRoYXQgaGVyZSlcbiAgICAgIHBsYXllci5za2lwQWQoKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIEFwcGxlIEFpclBsYXkuXG4gKi9cbmV4cG9ydCBjbGFzcyBBaXJQbGF5VG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1haXJwbGF5dG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdBcHBsZSBBaXJQbGF5J1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBpZiAoIXBsYXllci5pc0FpcnBsYXlBdmFpbGFibGUpIHtcbiAgICAgIC8vIElmIHRoZSBwbGF5ZXIgZG9lcyBub3Qgc3VwcG9ydCBBaXJwbGF5IChwbGF5ZXIgNy4wKSwgd2UganVzdCBoaWRlIHRoaXMgY29tcG9uZW50IGFuZCBza2lwIGNvbmZpZ3VyYXRpb25cbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0FpcnBsYXlBdmFpbGFibGUoKSkge1xuICAgICAgICBwbGF5ZXIuc2hvd0FpcnBsYXlUYXJnZXRQaWNrZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0FpclBsYXkgdW5hdmFpbGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGFpclBsYXlBdmFpbGFibGVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0FpcnBsYXlBdmFpbGFibGUoKSkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BSVJQTEFZX0FWQUlMQUJMRSwgYWlyUGxheUF2YWlsYWJsZUhhbmRsZXIpO1xuXG4gICAgLy8gU3RhcnR1cCBpbml0XG4gICAgYWlyUGxheUF2YWlsYWJsZUhhbmRsZXIoKTsgLy8gSGlkZSBidXR0b24gaWYgQWlyUGxheSBpcyBub3QgYXZhaWxhYmxlXG4gIH1cbn0iLCJpbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBzZWxlY3QgYm94IHByb3ZpZGluZyBhIHNlbGVjdGlvbiBiZXR3ZWVuICdhdXRvJyBhbmQgdGhlIGF2YWlsYWJsZSBhdWRpbyBxdWFsaXRpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBdWRpb1F1YWxpdHlTZWxlY3RCb3ggZXh0ZW5kcyBTZWxlY3RCb3gge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB1cGRhdGVBdWRpb1F1YWxpdGllcyA9ICgpID0+IHtcbiAgICAgIGxldCBhdWRpb1F1YWxpdGllcyA9IHBsYXllci5nZXRBdmFpbGFibGVBdWRpb1F1YWxpdGllcygpO1xuXG4gICAgICB0aGlzLmNsZWFySXRlbXMoKTtcblxuICAgICAgLy8gQWRkIGVudHJ5IGZvciBhdXRvbWF0aWMgcXVhbGl0eSBzd2l0Y2hpbmcgKGRlZmF1bHQgc2V0dGluZylcbiAgICAgIHRoaXMuYWRkSXRlbSgnQXV0bycsICdBdXRvJyk7XG5cbiAgICAgIC8vIEFkZCBhdWRpbyBxdWFsaXRpZXNcbiAgICAgIGZvciAobGV0IGF1ZGlvUXVhbGl0eSBvZiBhdWRpb1F1YWxpdGllcykge1xuICAgICAgICB0aGlzLmFkZEl0ZW0oYXVkaW9RdWFsaXR5LmlkLCBhdWRpb1F1YWxpdHkubGFiZWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uSXRlbVNlbGVjdGVkLnN1YnNjcmliZSgoc2VuZGVyOiBBdWRpb1F1YWxpdHlTZWxlY3RCb3gsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHBsYXllci5zZXRBdWRpb1F1YWxpdHkodmFsdWUpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHF1YWxpdGllcyB3aGVuIGF1ZGlvIHRyYWNrIGhhcyBjaGFuZ2VkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fQ0hBTkdFRCwgdXBkYXRlQXVkaW9RdWFsaXRpZXMpO1xuICAgIC8vIFVwZGF0ZSBxdWFsaXRpZXMgd2hlbiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1cGRhdGVBdWRpb1F1YWxpdGllcyk7XG4gICAgLy8gVXBkYXRlIHF1YWxpdGllcyB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgdXBkYXRlQXVkaW9RdWFsaXRpZXMpO1xuICAgIC8vIFVwZGF0ZSBxdWFsaXR5IHNlbGVjdGlvbiB3aGVuIHF1YWxpdHkgaXMgY2hhbmdlZCAoZnJvbSBvdXRzaWRlKVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0FVRElPX0RPV05MT0FEX1FVQUxJVFlfQ0hBTkdFLCAoKSA9PiB7XG4gICAgICBsZXQgZGF0YSA9IHBsYXllci5nZXREb3dubG9hZGVkQXVkaW9EYXRhKCk7XG4gICAgICB0aGlzLnNlbGVjdEl0ZW0oZGF0YS5pc0F1dG8gPyAnQXV0bycgOiBkYXRhLmlkKTtcbiAgICB9KTtcblxuICAgIC8vIFBvcHVsYXRlIHF1YWxpdGllcyBhdCBzdGFydHVwXG4gICAgdXBkYXRlQXVkaW9RdWFsaXRpZXMoKTtcbiAgfVxufSIsImltcG9ydCB7U2VsZWN0Qm94fSBmcm9tICcuL3NlbGVjdGJveCc7XG5pbXBvcnQge0xpc3RTZWxlY3RvckNvbmZpZ30gZnJvbSAnLi9saXN0c2VsZWN0b3InO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIHNlbGVjdCBib3ggcHJvdmlkaW5nIGEgc2VsZWN0aW9uIGJldHdlZW4gYXZhaWxhYmxlIGF1ZGlvIHRyYWNrcyAoZS5nLiBkaWZmZXJlbnQgbGFuZ3VhZ2VzKS5cbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvVHJhY2tTZWxlY3RCb3ggZXh0ZW5kcyBTZWxlY3RCb3gge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIC8vIFRPRE8gTW92ZSB0byBjb25maWc/XG4gICAgbGV0IGdldEF1ZGlvVHJhY2tMYWJlbCA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgICBzd2l0Y2ggKGlkKSB7XG4gICAgICAgIGNhc2UgJ2VuX3N0ZXJlbyc6XG4gICAgICAgICAgcmV0dXJuICdFbmdsaXNoIC0gU3RlcmVvJztcbiAgICAgICAgY2FzZSAnbm8tdm9pY2VzX3N0ZXJlbyc6XG4gICAgICAgICAgcmV0dXJuICdObyBWb2ljZXMgLSBTdGVyZW8nO1xuICAgICAgICBjYXNlICdlbl9zdXJyb3VuZCc6XG4gICAgICAgICAgcmV0dXJuICdFbmdsaXNoIC0gU3Vycm91bmQnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB1cGRhdGVBdWRpb1RyYWNrcyA9ICgpID0+IHtcbiAgICAgIGxldCBhdWRpb1RyYWNrcyA9IHBsYXllci5nZXRBdmFpbGFibGVBdWRpbygpO1xuXG4gICAgICB0aGlzLmNsZWFySXRlbXMoKTtcblxuICAgICAgLy8gQWRkIGF1ZGlvIHRyYWNrc1xuICAgICAgZm9yIChsZXQgYXVkaW9UcmFjayBvZiBhdWRpb1RyYWNrcykge1xuICAgICAgICB0aGlzLmFkZEl0ZW0oYXVkaW9UcmFjay5pZCwgZ2V0QXVkaW9UcmFja0xhYmVsKGF1ZGlvVHJhY2subGFiZWwpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5vbkl0ZW1TZWxlY3RlZC5zdWJzY3JpYmUoKHNlbmRlcjogQXVkaW9UcmFja1NlbGVjdEJveCwgdmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgcGxheWVyLnNldEF1ZGlvKHZhbHVlKTtcbiAgICB9KTtcblxuICAgIGxldCBhdWRpb1RyYWNrSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGxldCBjdXJyZW50QXVkaW9UcmFjayA9IHBsYXllci5nZXRBdWRpbygpO1xuXG4gICAgICAvLyBITFMgc3RyZWFtcyBkb24ndCBhbHdheXMgcHJvdmlkZSB0aGlzLCBzbyB3ZSBoYXZlIHRvIGNoZWNrXG4gICAgICBpZiAoY3VycmVudEF1ZGlvVHJhY2spIHtcbiAgICAgICAgdGhpcy5zZWxlY3RJdGVtKGN1cnJlbnRBdWRpb1RyYWNrLmlkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVXBkYXRlIHNlbGVjdGlvbiB3aGVuIHNlbGVjdGVkIHRyYWNrIGhhcyBjaGFuZ2VkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fQ0hBTkdFRCwgYXVkaW9UcmFja0hhbmRsZXIpO1xuICAgIC8vIFVwZGF0ZSB0cmFja3Mgd2hlbiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1cGRhdGVBdWRpb1RyYWNrcyk7XG4gICAgLy8gVXBkYXRlIHRyYWNrcyB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgdXBkYXRlQXVkaW9UcmFja3MpO1xuICAgIC8vIFVwZGF0ZSB0cmFja3Mgd2hlbiBhIHRyYWNrIGlzIGFkZGVkIG9yIHJlbW92ZWQgKHNpbmNlIHBsYXllciA3LjEuNClcbiAgICBpZiAocGxheWVyLkVWRU5ULk9OX0FVRElPX0FEREVEICYmIHBsYXllci5FVkVOVC5PTl9BVURJT19SRU1PVkVEKSB7XG4gICAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BVURJT19BRERFRCwgdXBkYXRlQXVkaW9UcmFja3MpO1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQVVESU9fUkVNT1ZFRCwgdXBkYXRlQXVkaW9UcmFja3MpO1xuICAgIH1cblxuICAgIC8vIFBvcHVsYXRlIHRyYWNrcyBhdCBzdGFydHVwXG4gICAgdXBkYXRlQXVkaW9UcmFja3MoKTtcblxuICAgIC8vIFdoZW4gYHBsYXliYWNrLmF1ZGlvTGFuZ3VhZ2VgIGlzIHNldCwgdGhlIGBPTl9BVURJT19DSEFOR0VEYCBldmVudCBmb3IgdGhhdCBjaGFuZ2UgaXMgdHJpZ2dlcmVkIGJlZm9yZSB0aGVcbiAgICAvLyBVSSBpcyBjcmVhdGVkLiBUaGVyZWZvcmUgd2UgbmVlZCB0byBzZXQgdGhlIGF1ZGlvIHRyYWNrIG9uIGNvbmZpZ3VyZS5cbiAgICBhdWRpb1RyYWNrSGFuZGxlcigpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQnVmZmVyaW5nT3ZlcmxheX0gY29tcG9uZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1ZmZlcmluZ092ZXJsYXlDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogRGVsYXkgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSBidWZmZXJpbmcgb3ZlcmxheSB3aWxsIGJlIGRpc3BsYXllZC4gVXNlZnVsIHRvIGJ5cGFzcyBzaG9ydCBzdGFsbHMgd2l0aG91dFxuICAgKiBkaXNwbGF5aW5nIHRoZSBvdmVybGF5LiBTZXQgdG8gMCB0byBkaXNwbGF5IHRoZSBvdmVybGF5IGluc3RhbnRseS5cbiAgICogRGVmYXVsdDogMTAwMG1zICgxIHNlY29uZClcbiAgICovXG4gIHNob3dEZWxheU1zPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgYW5kIGRpc3BsYXlzIGEgYnVmZmVyaW5nIGluZGljYXRvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1ZmZlcmluZ092ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8QnVmZmVyaW5nT3ZlcmxheUNvbmZpZz4ge1xuXG4gIHByaXZhdGUgaW5kaWNhdG9yczogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz5bXTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEJ1ZmZlcmluZ092ZXJsYXlDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmluZGljYXRvcnMgPSBbXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgICBuZXcgQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4oeyB0YWc6ICdkaXYnLCBjc3NDbGFzczogJ3VpLWJ1ZmZlcmluZy1vdmVybGF5LWluZGljYXRvcicgfSksXG4gICAgXTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIDxCdWZmZXJpbmdPdmVybGF5Q29uZmlnPntcbiAgICAgIGNzc0NsYXNzOiAndWktYnVmZmVyaW5nLW92ZXJsYXknLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgY29tcG9uZW50czogdGhpcy5pbmRpY2F0b3JzLFxuICAgICAgc2hvd0RlbGF5TXM6IDEwMDAsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8QnVmZmVyaW5nT3ZlcmxheUNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgbGV0IG92ZXJsYXlTaG93VGltZW91dCA9IG5ldyBUaW1lb3V0KGNvbmZpZy5zaG93RGVsYXlNcywgKCkgPT4ge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG5cbiAgICBsZXQgc2hvd092ZXJsYXkgPSAoKSA9PiB7XG4gICAgICBvdmVybGF5U2hvd1RpbWVvdXQuc3RhcnQoKTtcbiAgICB9O1xuXG4gICAgbGV0IGhpZGVPdmVybGF5ID0gKCkgPT4ge1xuICAgICAgb3ZlcmxheVNob3dUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1RBTExfU1RBUlRFRCwgc2hvd092ZXJsYXkpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX0VOREVELCBoaWRlT3ZlcmxheSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCBoaWRlT3ZlcmxheSk7XG5cbiAgICAvLyBTaG93IG92ZXJsYXkgaWYgcGxheWVyIGlzIGFscmVhZHkgc3RhbGxlZCBhdCBpbml0XG4gICAgaWYgKHBsYXllci5pc1N0YWxsZWQoKSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudENvbmZpZywgQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyLCBOb0FyZ3MsIEV2ZW50fSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBCdXR0b259IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdXR0b25Db25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICAvKipcbiAgICogVGhlIHRleHQgb24gdGhlIGJ1dHRvbi5cbiAgICovXG4gIHRleHQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBzaW1wbGUgY2xpY2thYmxlIGJ1dHRvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1dHRvbjxDb25maWcgZXh0ZW5kcyBCdXR0b25Db25maWc+IGV4dGVuZHMgQ29tcG9uZW50PEJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgYnV0dG9uRXZlbnRzID0ge1xuICAgIG9uQ2xpY2s6IG5ldyBFdmVudERpc3BhdGNoZXI8QnV0dG9uPENvbmZpZz4sIE5vQXJncz4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQnV0dG9uQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktYnV0dG9uJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICAvLyBDcmVhdGUgdGhlIGJ1dHRvbiBlbGVtZW50IHdpdGggdGhlIHRleHQgbGFiZWxcbiAgICBsZXQgYnV0dG9uRWxlbWVudCA9IG5ldyBET00oJ2J1dHRvbicsIHtcbiAgICAgICd0eXBlJzogJ2J1dHRvbicsXG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSkuYXBwZW5kKG5ldyBET00oJ3NwYW4nLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnbGFiZWwnKVxuICAgIH0pLmh0bWwodGhpcy5jb25maWcudGV4dCkpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGJ1dHRvbiBlbGVtZW50IGFuZCB0cmlnZ2VyIHRoZSBjb3JyZXNwb25kaW5nIGV2ZW50IG9uIHRoZSBidXR0b24gY29tcG9uZW50XG4gICAgYnV0dG9uRWxlbWVudC5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLm9uQ2xpY2tFdmVudCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGJ1dHRvbkVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0ZXh0IG9uIHRoZSBsYWJlbCBvZiB0aGUgYnV0dG9uLlxuICAgKiBAcGFyYW0gdGV4dCB0aGUgdGV4dCB0byBwdXQgaW50byB0aGUgbGFiZWwgb2YgdGhlIGJ1dHRvblxuICAgKi9cbiAgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5maW5kKCcuJyArIHRoaXMucHJlZml4Q3NzKCdsYWJlbCcpKS5odG1sKHRleHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uQ2xpY2tFdmVudCgpIHtcbiAgICB0aGlzLmJ1dHRvbkV2ZW50cy5vbkNsaWNrLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxCdXR0b248Q29uZmlnPiwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvbkNsaWNrKCk6IEV2ZW50PEJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5idXR0b25FdmVudHMub25DbGljay5nZXRFdmVudCgpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBDYXN0V2FpdGluZ0ZvckRldmljZUV2ZW50ID0gYml0bW92aW4uUGxheWVyQVBJLkNhc3RXYWl0aW5nRm9yRGV2aWNlRXZlbnQ7XG5pbXBvcnQgQ2FzdFN0YXJ0ZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5DYXN0U3RhcnRlZEV2ZW50O1xuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgYW5kIGRpc3BsYXlzIHRoZSBzdGF0dXMgb2YgYSBDYXN0IHNlc3Npb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXN0U3RhdHVzT3ZlcmxheSBleHRlbmRzIENvbnRhaW5lcjxDb250YWluZXJDb25maWc+IHtcblxuICBwcml2YXRlIHN0YXR1c0xhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb250YWluZXJDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLnN0YXR1c0xhYmVsID0gbmV3IExhYmVsPExhYmVsQ29uZmlnPih7IGNzc0NsYXNzOiAndWktY2FzdC1zdGF0dXMtbGFiZWwnIH0pO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1jYXN0LXN0YXR1cy1vdmVybGF5JyxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLnN0YXR1c0xhYmVsXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1dBSVRJTkdfRk9SX0RFVklDRSxcbiAgICAgIChldmVudDogQ2FzdFdhaXRpbmdGb3JEZXZpY2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgLy8gR2V0IGRldmljZSBuYW1lIGFuZCB1cGRhdGUgc3RhdHVzIHRleHQgd2hpbGUgY29ubmVjdGluZ1xuICAgICAgICBsZXQgY2FzdERldmljZU5hbWUgPSBldmVudC5jYXN0UGF5bG9hZC5kZXZpY2VOYW1lO1xuICAgICAgICB0aGlzLnN0YXR1c0xhYmVsLnNldFRleHQoYENvbm5lY3RpbmcgdG8gPHN0cm9uZz4ke2Nhc3REZXZpY2VOYW1lfTwvc3Ryb25nPi4uLmApO1xuICAgICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVEVELCAoZXZlbnQ6IENhc3RTdGFydGVkRXZlbnQpID0+IHtcbiAgICAgIC8vIFNlc3Npb24gaXMgc3RhcnRlZCBvciByZXN1bWVkXG4gICAgICAvLyBGb3IgY2FzZXMgd2hlbiBhIHNlc3Npb24gaXMgcmVzdW1lZCwgd2UgZG8gbm90IHJlY2VpdmUgdGhlIHByZXZpb3VzIGV2ZW50cyBhbmQgdGhlcmVmb3JlIHNob3cgdGhlIHN0YXR1cyBwYW5lbFxuICAgICAgLy8gaGVyZSB0b29cbiAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgbGV0IGNhc3REZXZpY2VOYW1lID0gZXZlbnQuZGV2aWNlTmFtZTtcbiAgICAgIHRoaXMuc3RhdHVzTGFiZWwuc2V0VGV4dChgUGxheWluZyBvbiA8c3Ryb25nPiR7Y2FzdERldmljZU5hbWV9PC9zdHJvbmc+YCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVE9QUEVELCAoZXZlbnQpID0+IHtcbiAgICAgIC8vIENhc3Qgc2Vzc2lvbiBnb25lLCBoaWRlIHRoZSBzdGF0dXMgcGFuZWxcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgY2FzdGluZyB0byBhIENhc3QgcmVjZWl2ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXN0VG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1jYXN0dG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdHb29nbGUgQ2FzdCdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzQ2FzdEF2YWlsYWJsZSgpKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgICAgICBwbGF5ZXIuY2FzdFN0b3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwbGF5ZXIuY2FzdFZpZGVvKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Nhc3QgdW5hdmFpbGFibGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGNhc3RBdmFpbGFibGVIYW5kZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzQ2FzdEF2YWlsYWJsZSgpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfQVZBSUxBQkxFLCBjYXN0QXZhaWxhYmxlSGFuZGVyKTtcblxuICAgIC8vIFRvZ2dsZSBidXR0b24gJ29uJyBzdGF0ZVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfV0FJVElOR19GT1JfREVWSUNFLCAoKSA9PiB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVEVELCAoKSA9PiB7XG4gICAgICAvLyBXaGVuIGEgc2Vzc2lvbiBpcyByZXN1bWVkLCB0aGVyZSBpcyBubyBPTl9DQVNUX1NUQVJUIGV2ZW50LCBzbyB3ZSBhbHNvIG5lZWQgdG8gdG9nZ2xlIGhlcmUgZm9yIHN1Y2ggY2FzZXNcbiAgICAgIHRoaXMub24oKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUT1BQRUQsICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBjYXN0QXZhaWxhYmxlSGFuZGVyKCk7IC8vIEhpZGUgYnV0dG9uIGlmIENhc3Qgbm90IGF2YWlsYWJsZVxuICAgIGlmIChwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgIHRoaXMub24oKTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge1VJQ29udGFpbmVyLCBVSUNvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi91aWNvbnRhaW5lcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcblxuLyoqXG4gKiBUaGUgYmFzZSBjb250YWluZXIgZm9yIENhc3QgcmVjZWl2ZXJzIHRoYXQgY29udGFpbnMgYWxsIG9mIHRoZSBVSSBhbmQgdGFrZXMgY2FyZSB0aGF0IHRoZSBVSSBpcyBzaG93biBvblxuICogY2VydGFpbiBwbGF5YmFjayBldmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXN0VUlDb250YWluZXIgZXh0ZW5kcyBVSUNvbnRhaW5lciB7XG5cbiAgcHJpdmF0ZSBjYXN0VWlIaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFVJQ29udGFpbmVyQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPFVJQ29udGFpbmVyQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICAvKlxuICAgICAqIFNob3cgVUkgb24gQ2FzdCBkZXZpY2VzIGF0IGNlcnRhaW4gcGxheWJhY2sgZXZlbnRzXG4gICAgICpcbiAgICAgKiBTaW5jZSBhIENhc3QgcmVjZWl2ZXIgZG9lcyBub3QgaGF2ZSBhIGRpcmVjdCBIQ0ksIHdlIHNob3cgdGhlIFVJIG9uIGNlcnRhaW4gcGxheWJhY2sgZXZlbnRzIHRvIGdpdmUgdGhlIHVzZXJcbiAgICAgKiBhIGNoYW5jZSB0byBzZWUgb24gdGhlIHNjcmVlbiB3aGF0J3MgZ29pbmcgb24sIGUuZy4gb24gcGxheS9wYXVzZSBvciBhIHNlZWsgdGhlIFVJIGlzIHNob3duIGFuZCB0aGUgdXNlciBjYW5cbiAgICAgKiBzZWUgdGhlIGN1cnJlbnQgdGltZSBhbmQgcG9zaXRpb24gb24gdGhlIHNlZWsgYmFyLlxuICAgICAqIFRoZSBVSSBpcyBzaG93biBwZXJtYW5lbnRseSB3aGlsZSBwbGF5YmFjayBpcyBwYXVzZWQsIG90aGVyd2lzZSBoaWRlcyBhdXRvbWF0aWNhbGx5IGFmdGVyIHRoZSBjb25maWd1cmVkXG4gICAgICogaGlkZSBkZWxheSB0aW1lLlxuICAgICAqL1xuXG4gICAgbGV0IGlzVWlTaG93biA9IGZhbHNlO1xuXG4gICAgbGV0IGhpZGVVaSA9ICgpID0+IHtcbiAgICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzSGlkZS5kaXNwYXRjaCh0aGlzKTtcbiAgICAgIGlzVWlTaG93biA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB0aGlzLmNhc3RVaUhpZGVUaW1lb3V0ID0gbmV3IFRpbWVvdXQoY29uZmlnLmhpZGVEZWxheSwgaGlkZVVpKTtcblxuICAgIGxldCBzaG93VWkgPSAoKSA9PiB7XG4gICAgICBpZiAoIWlzVWlTaG93bikge1xuICAgICAgICB1aW1hbmFnZXIub25Db250cm9sc1Nob3cuZGlzcGF0Y2godGhpcyk7XG4gICAgICAgIGlzVWlTaG93biA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCBzaG93VWlQZXJtYW5lbnRseSA9ICgpID0+IHtcbiAgICAgIHNob3dVaSgpO1xuICAgICAgdGhpcy5jYXN0VWlIaWRlVGltZW91dC5jbGVhcigpO1xuICAgIH07XG5cbiAgICBsZXQgc2hvd1VpV2l0aFRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICAgIHRoaXMuY2FzdFVpSGlkZVRpbWVvdXQuc3RhcnQoKTtcbiAgICB9O1xuXG4gICAgbGV0IHNob3dVaUFmdGVyU2VlayA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgICAgc2hvd1VpV2l0aFRpbWVvdXQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dVaVBlcm1hbmVudGx5KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBzaG93VWlXaXRoVGltZW91dCk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX0xPQURFRCwgc2hvd1VpV2l0aFRpbWVvdXQpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVksIHNob3dVaVdpdGhUaW1lb3V0KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QQVVTRUQsIHNob3dVaVBlcm1hbmVudGx5KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TRUVLLCBzaG93VWlQZXJtYW5lbnRseSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCBzaG93VWlBZnRlclNlZWspO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBzdXBlci5yZWxlYXNlKCk7XG4gICAgdGhpcy5jYXN0VWlIaWRlVGltZW91dC5jbGVhcigpO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7TGFiZWwsIExhYmVsQ29uZmlnfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7RXZlbnQsIEV2ZW50RGlzcGF0Y2hlciwgTm9BcmdzfSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuaW1wb3J0IENvbmZpZyA9IGJpdG1vdmluLlBsYXllckFQSS5Db25maWc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIENoZWNrYm94fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDaGVja2JveENvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgbGFiZWwgZm9yIHRoZSBjaGVja2JveC5cbiAgICovXG4gIHRleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENoZWNrYm94IGV4dGVuZHMgQ29udGFpbmVyPENoZWNrYm94Q29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBsYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIGJ1dHRvbjogVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz47XG5cbiAgcHJpdmF0ZSBjaGVja2JveEV2ZW50cyA9IHtcbiAgICBvbkNsaWNrOiBuZXcgRXZlbnREaXNwYXRjaGVyPENoZWNrYm94LCBOb0FyZ3M+KCksXG4gICAgb25DaGFuZ2U6IG5ldyBFdmVudERpc3BhdGNoZXI8Q2hlY2tib3gsIE5vQXJncz4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ2hlY2tib3hDb25maWcgPSB7dGV4dDogJyd9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMubGFiZWwgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzZXM6IFsnY2hlY2tib3gtbGFiZWwnXSwgdGV4dDogY29uZmlnLnRleHR9KTtcbiAgICB0aGlzLmJ1dHRvbiA9IG5ldyBUb2dnbGVCdXR0b24oe2Nzc0NsYXNzZXM6IFsnY2hlY2tib3gtYnV0dG9uJ119KTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2hlY2tib3gnLFxuICAgICAgY29tcG9uZW50czogW3RoaXMuYnV0dG9uLCB0aGlzLmxhYmVsXVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBjbGljayBldmVudCBvbiB0aGUgZWxlbWVudCBhbmRcbiAgICAvLyB0cmlnZ2VyIHRoZSBjb3JyZXNwb25kaW5nIGV2ZW50cyBvbiB0aGUgYnV0dG9uIGNvbXBvbmVudFxuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuYnV0dG9uLnRvZ2dsZSgpXG4gICAgICB0aGlzLm9uQ2xpY2tFdmVudCgpXG4gICAgICB0aGlzLm9uQ2hhbmdlRXZlbnQoKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYXJiaXRyYXJ5IHRleHQgb24gdGhlIGxhYmVsLlxuICAgKiBAcGFyYW0gdGV4dCB0aGUgdGV4dCB0byBzaG93IG9uIHRoZSBsYWJlbFxuICAgKi9cbiAgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxhYmVsLnNldFRleHQodGV4dCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25DbGlja0V2ZW50KCkge1xuICAgIHRoaXMuY2hlY2tib3hFdmVudHMub25DbGljay5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNoYW5nZUV2ZW50KCkge1xuICAgIHRoaXMuY2hlY2tib3hFdmVudHMub25DaGFuZ2UuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAgICogQHJldHVybnMge0V2ZW50PENoZWNrYm94LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uQ2xpY2soKTogRXZlbnQ8Q2hlY2tib3gsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrYm94RXZlbnRzLm9uQ2xpY2suZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICogQHJldHVybnMge0V2ZW50PENoZWNrYm94LCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uQ2hhbmdlKCk6IEV2ZW50PENoZWNrYm94LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jaGVja2JveEV2ZW50cy5vbkNoYW5nZS5nZXRFdmVudCgpO1xuICB9XG5cbiAgZ2V0IGlzT24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uLmlzT24oKVxuICB9XG59IiwiaW1wb3J0IHtCdXR0b24sIEJ1dHRvbkNvbmZpZ30gZnJvbSAnLi9idXR0b24nO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBDbGlja092ZXJsYXl9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsaWNrT3ZlcmxheUNvbmZpZyBleHRlbmRzIEJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdXJsIHRvIG9wZW4gd2hlbiB0aGUgb3ZlcmxheSBpcyBjbGlja2VkLiBTZXQgdG8gbnVsbCB0byBkaXNhYmxlIHRoZSBjbGljayBoYW5kbGVyLlxuICAgKi9cbiAgdXJsPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgY2xpY2sgb3ZlcmxheSB0aGF0IG9wZW5zIGFuIHVybCBpbiBhIG5ldyB0YWIgaWYgY2xpY2tlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIENsaWNrT3ZlcmxheSBleHRlbmRzIEJ1dHRvbjxDbGlja092ZXJsYXlDb25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENsaWNrT3ZlcmxheUNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2xpY2tvdmVybGF5J1xuICAgIH0sIDxDbGlja092ZXJsYXlDb25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLnNldFVybCgoPENsaWNrT3ZlcmxheUNvbmZpZz50aGlzLmNvbmZpZykudXJsKTtcbiAgICBsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RG9tRWxlbWVudCgpO1xuICAgIGVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQuZGF0YSgndXJsJykpIHtcbiAgICAgICAgd2luZG93Lm9wZW4oZWxlbWVudC5kYXRhKCd1cmwnKSwgJ19ibGFuaycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIFVSTCB0aGF0IHNob3VsZCBiZSBmb2xsb3dlZCB3aGVuIHRoZSB3YXRlcm1hcmsgaXMgY2xpY2tlZC5cbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHdhdGVybWFyayBVUkxcbiAgICovXG4gIGdldFVybCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldERvbUVsZW1lbnQoKS5kYXRhKCd1cmwnKTtcbiAgfVxuXG4gIHNldFVybCh1cmw6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT0gbnVsbCkge1xuICAgICAgdXJsID0gJyc7XG4gICAgfVxuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmRhdGEoJ3VybCcsIHVybCk7XG4gIH1cbn0iLCJpbXBvcnQge0J1dHRvbkNvbmZpZywgQnV0dG9ufSBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIENsb3NlQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbG9zZUJ1dHRvbkNvbmZpZyBleHRlbmRzIEJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgY29tcG9uZW50IHRoYXQgc2hvdWxkIGJlIGNsb3NlZCB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAgICovXG4gIHRhcmdldDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz47XG59XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCBjbG9zZXMgKGhpZGVzKSBhIGNvbmZpZ3VyZWQgY29tcG9uZW50LlxuICovXG5leHBvcnQgY2xhc3MgQ2xvc2VCdXR0b24gZXh0ZW5kcyBCdXR0b248Q2xvc2VCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENsb3NlQnV0dG9uQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2xvc2VidXR0b24nLFxuICAgICAgdGV4dDogJ0Nsb3NlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPENsb3NlQnV0dG9uQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbmZpZy50YXJnZXQuaGlkZSgpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9ufS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9uQ29uZmlnIGV4dGVuZHMgVG9nZ2xlQnV0dG9uQ29uZmlnIHtcblxufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyB2aXNpYmlsaXR5IG9mIGEgZW1iZWRWaWRlbyBwYW5lbC5cbiAqL1xuZXhwb3J0IGNsYXNzIENsb3NlZENhcHRpb25pbmdUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248Q2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY2xvc2VkY2FwdGlvbmluZy10b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ0Nsb3NlZCBDYXB0aW9uaW5nJ1xuICAgIH0sIDxDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPENsb3NlZENhcHRpb25pbmdUb2dnbGVCdXR0b25Db25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBmaXggZ2VuZXJpY3MgdHlwZSBpbmZlcmVuY2VcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2Nsb3NlZCBjYXB0aW9uaW5nIGJ1dHRvbiBjbGlja2VkJylcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1NlZWtCYXJ9IGZyb20gJy4vc2Vla2Jhcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgQ29tbWVudHNUb2dnbGVCdXR0b259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbW1lbnRzVG9nZ2xlQnV0dG9uQ29uZmlnIGV4dGVuZHMgVG9nZ2xlQnV0dG9uQ29uZmlnIHtcbiAgc2Vla0JhcjogU2Vla0JhclxufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyB2aXNpYmlsaXR5IG9mIGEgZW1iZWRWaWRlbyBwYW5lbC5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbW1lbnRzVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPENvbW1lbnRzVG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzZWVrQmFyOiBTZWVrQmFyXG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb21tZW50c1RvZ2dsZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICBpZiAoIWNvbmZpZy5zZWVrQmFyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIFNlZWtCYXIgaXMgbWlzc2luZycpO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY29tbWVudHMtdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdDb21tZW50cycsXG4gICAgICBzZWVrQmFyOiBudWxsXG4gICAgfSwgPENvbW1lbnRzVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPENvbW1lbnRzVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7IC8vIFRPRE8gZml4IGdlbmVyaWNzIHR5cGUgaW5mZXJlbmNlXG4gICAgbGV0IHNlZWtCYXIgPSBjb25maWcuc2Vla0JhclxuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzZWVrQmFyLnRvZ2dsZUNvbW1lbnRzT24oKVxuICAgIH0pO1xuXG4gICAgbGV0IHVwZGF0ZU9uT2ZmID0gKCkgPT4ge1xuICAgICAgaWYgKHNlZWtCYXIuY29tbWVudHNPbikge1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9mZigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNlZWtCYXIub25DaGFuZ2VDb21tZW50c09uLnN1YnNjcmliZSgoZSwgb24pID0+IHtcbiAgICAgIHVwZGF0ZU9uT2ZmKCk7XG4gICAgfSk7XG5cbiAgICB1cGRhdGVPbk9mZigpO1xuICB9XG59IiwiaW1wb3J0IHtHdWlkfSBmcm9tICcuLi9ndWlkJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtFdmVudERpc3BhdGNoZXIsIE5vQXJncywgRXZlbnR9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEJhc2UgY29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEgY29tcG9uZW50LlxuICogU2hvdWxkIGJlIGV4dGVuZGVkIGJ5IGNvbXBvbmVudHMgdGhhdCB3YW50IHRvIGFkZCBhZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRDb25maWcge1xuICAvKipcbiAgICogVGhlIEhUTUwgdGFnIG5hbWUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICogRGVmYXVsdDogJ2RpdidcbiAgICovXG4gIHRhZz86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBIVE1MIElEIG9mIHRoZSBjb21wb25lbnQuXG4gICAqIERlZmF1bHQ6IGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIHdpdGggcGF0dGVybiAndWktaWQte2d1aWR9Jy5cbiAgICovXG4gIGlkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHByZWZpeCB0byBwcmVwZW5kIGFsbCBDU1MgY2xhc3NlcyB3aXRoLlxuICAgKi9cbiAgY3NzUHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzZXMgb2YgdGhlIGNvbXBvbmVudC4gVGhpcyBpcyB1c3VhbGx5IHRoZSBjbGFzcyBmcm9tIHdoZXJlIHRoZSBjb21wb25lbnQgdGFrZXMgaXRzIHN0eWxpbmcuXG4gICAqL1xuICBjc3NDbGFzcz86IHN0cmluZzsgLy8gJ2NsYXNzJyBpcyBhIHJlc2VydmVkIGtleXdvcmQsIHNvIHdlIG5lZWQgdG8gbWFrZSB0aGUgbmFtZSBtb3JlIGNvbXBsaWNhdGVkXG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgQ1NTIGNsYXNzZXMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIGNzc0NsYXNzZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIGlmIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGhpZGRlbiBhdCBzdGFydHVwLlxuICAgKiBEZWZhdWx0OiBmYWxzZVxuICAgKi9cbiAgaGlkZGVuPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3MgZXh0ZW5kcyBOb0FyZ3Mge1xuICAvKipcbiAgICogVHJ1ZSBpcyB0aGUgY29tcG9uZW50IGlzIGhvdmVyZWQsIGVsc2UgZmFsc2UuXG4gICAqL1xuICBob3ZlcmVkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIG9mIHRoZSBVSSBmcmFtZXdvcmsuXG4gKiBFYWNoIGNvbXBvbmVudCBtdXN0IGV4dGVuZCB0aGlzIGNsYXNzIGFuZCBvcHRpb25hbGx5IHRoZSBjb25maWcgaW50ZXJmYWNlLlxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50PENvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZz4ge1xuXG4gIC8qKlxuICAgKiBUaGUgY2xhc3NuYW1lIHRoYXQgaXMgYXR0YWNoZWQgdG8gdGhlIGVsZW1lbnQgd2hlbiBpdCBpcyBpbiB0aGUgaGlkZGVuIHN0YXRlLlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfSElEREVOID0gJ2hpZGRlbic7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gb2JqZWN0IG9mIHRoaXMgY29tcG9uZW50LlxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbmZpZzogQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBUaGUgY29tcG9uZW50J3MgRE9NIGVsZW1lbnQuXG4gICAqL1xuICBwcml2YXRlIGVsZW1lbnQ6IERPTTtcblxuICAvKipcbiAgICogRmxhZyB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBoaWRkZW4gc3RhdGUuXG4gICAqL1xuICBwcml2YXRlIGhpZGRlbjogYm9vbGVhbjtcblxuICAvKipcbiAgICogRmxhZyB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBob3ZlciBzdGF0ZS5cbiAgICovXG4gIHByaXZhdGUgaG92ZXJlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgZXZlbnRzIHRoYXQgdGhpcyBjb21wb25lbnQgb2ZmZXJzLiBUaGVzZSBldmVudHMgc2hvdWxkIGFsd2F5cyBiZSBwcml2YXRlIGFuZCBvbmx5IGRpcmVjdGx5XG4gICAqIGFjY2Vzc2VkIGZyb20gd2l0aGluIHRoZSBpbXBsZW1lbnRpbmcgY29tcG9uZW50LlxuICAgKlxuICAgKiBCZWNhdXNlIFR5cGVTY3JpcHQgZG9lcyBub3Qgc3VwcG9ydCBwcml2YXRlIHByb3BlcnRpZXMgd2l0aCB0aGUgc2FtZSBuYW1lIG9uIGRpZmZlcmVudCBjbGFzcyBoaWVyYXJjaHkgbGV2ZWxzXG4gICAqIChpLmUuIHN1cGVyY2xhc3MgYW5kIHN1YmNsYXNzIGNhbm5vdCBjb250YWluIGEgcHJpdmF0ZSBwcm9wZXJ0eSB3aXRoIHRoZSBzYW1lIG5hbWUpLCB0aGUgZGVmYXVsdCBuYW1pbmdcbiAgICogY29udmVudGlvbiBmb3IgdGhlIGV2ZW50IGxpc3Qgb2YgYSBjb21wb25lbnQgdGhhdCBzaG91bGQgYmUgZm9sbG93ZWQgYnkgc3ViY2xhc3NlcyBpcyB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGVcbiAgICogY2FtZWwtY2FzZWQgY2xhc3MgbmFtZSArICdFdmVudHMnIChlLmcuIFN1YkNsYXNzIGV4dGVuZHMgQ29tcG9uZW50ID0+IHN1YkNsYXNzRXZlbnRzKS5cbiAgICogU2VlIHtAbGluayAjY29tcG9uZW50RXZlbnRzfSBmb3IgYW4gZXhhbXBsZS5cbiAgICpcbiAgICogRXZlbnQgcHJvcGVydGllcyBzaG91bGQgYmUgbmFtZWQgaW4gY2FtZWwgY2FzZSB3aXRoIGFuICdvbicgcHJlZml4IGFuZCBpbiB0aGUgcHJlc2VudCB0ZW5zZS4gQXN5bmMgZXZlbnRzIG1heVxuICAgKiBoYXZlIGEgc3RhcnQgZXZlbnQgKHdoZW4gdGhlIG9wZXJhdGlvbiBzdGFydHMpIGluIHRoZSBwcmVzZW50IHRlbnNlLCBhbmQgbXVzdCBoYXZlIGFuIGVuZCBldmVudCAod2hlbiB0aGVcbiAgICogb3BlcmF0aW9uIGVuZHMpIGluIHRoZSBwYXN0IHRlbnNlIChvciBwcmVzZW50IHRlbnNlIGluIHNwZWNpYWwgY2FzZXMgKGUuZy4gb25TdGFydC9vblN0YXJ0ZWQgb3Igb25QbGF5L29uUGxheWluZykuXG4gICAqIFNlZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyNvblNob3d9IGZvciBhbiBleGFtcGxlLlxuICAgKlxuICAgKiBFYWNoIGV2ZW50IHNob3VsZCBiZSBhY2NvbXBhbmllZCB3aXRoIGEgcHJvdGVjdGVkIG1ldGhvZCBuYW1lZCBieSB0aGUgY29udmVudGlvbiBldmVudE5hbWUgKyAnRXZlbnQnXG4gICAqIChlLmcuIG9uU3RhcnRFdmVudCksIHRoYXQgYWN0dWFsbHkgdHJpZ2dlcnMgdGhlIGV2ZW50IGJ5IGNhbGxpbmcge0BsaW5rIEV2ZW50RGlzcGF0Y2hlciNkaXNwYXRjaCBkaXNwYXRjaH0gYW5kXG4gICAqIHBhc3NpbmcgYSByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBhcyBmaXJzdCBwYXJhbWV0ZXIuIENvbXBvbmVudHMgc2hvdWxkIGFsd2F5cyB0cmlnZ2VyIHRoZWlyIGV2ZW50cyB3aXRoIHRoZXNlXG4gICAqIG1ldGhvZHMuIEltcGxlbWVudGluZyB0aGlzIHBhdHRlcm4gZ2l2ZXMgc3ViY2xhc3NlcyBtZWFucyB0byBkaXJlY3RseSBsaXN0ZW4gdG8gdGhlIGV2ZW50cyBieSBvdmVycmlkaW5nIHRoZVxuICAgKiBtZXRob2QgKGFuZCBzYXZpbmcgdGhlIG92ZXJoZWFkIG9mIHBhc3NpbmcgYSBoYW5kbGVyIHRvIHRoZSBldmVudCBkaXNwYXRjaGVyKSBhbmQgbW9yZSBpbXBvcnRhbnRseSB0byB0cmlnZ2VyXG4gICAqIHRoZXNlIGV2ZW50cyB3aXRob3V0IGhhdmluZyBhY2Nlc3MgdG8gdGhlIHByaXZhdGUgZXZlbnQgbGlzdC5cbiAgICogU2VlIHtAbGluayAjb25TaG93fSBmb3IgYW4gZXhhbXBsZS5cbiAgICpcbiAgICogVG8gcHJvdmlkZSBleHRlcm5hbCBjb2RlIHRoZSBwb3NzaWJpbGl0eSB0byBsaXN0ZW4gdG8gdGhpcyBjb21wb25lbnQncyBldmVudHMgKHN1YnNjcmliZSwgdW5zdWJzY3JpYmUsIGV0Yy4pLFxuICAgKiBlYWNoIGV2ZW50IHNob3VsZCBhbHNvIGJlIGFjY29tcGFuaWVkIGJ5IGEgcHVibGljIGdldHRlciBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgdGhlIGV2ZW50J3MgcHJvcGVydHksXG4gICAqIHRoYXQgcmV0dXJucyB0aGUge0BsaW5rIEV2ZW50fSBvYnRhaW5lZCBmcm9tIHRoZSBldmVudCBkaXNwYXRjaGVyIGJ5IGNhbGxpbmcge0BsaW5rIEV2ZW50RGlzcGF0Y2hlciNnZXRFdmVudH0uXG4gICAqIFNlZSB7QGxpbmsgI29uU2hvd30gZm9yIGFuIGV4YW1wbGUuXG4gICAqXG4gICAqIEZ1bGwgZXhhbXBsZSBmb3IgYW4gZXZlbnQgcmVwcmVzZW50aW5nIGFuIGV4YW1wbGUgYWN0aW9uIGluIGEgZXhhbXBsZSBjb21wb25lbnQ6XG4gICAqXG4gICAqIDxjb2RlPlxuICAgKiAvLyBEZWZpbmUgYW4gZXhhbXBsZSBjb21wb25lbnQgY2xhc3Mgd2l0aCBhbiBleGFtcGxlIGV2ZW50XG4gICAqIGNsYXNzIEV4YW1wbGVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiB7XG4gICAgICpcbiAgICAgKiAgICAgcHJpdmF0ZSBleGFtcGxlQ29tcG9uZW50RXZlbnRzID0ge1xuICAgICAqICAgICAgICAgb25FeGFtcGxlQWN0aW9uOiBuZXcgRXZlbnREaXNwYXRjaGVyPEV4YW1wbGVDb21wb25lbnQsIE5vQXJncz4oKVxuICAgICAqICAgICB9XG4gICAgICpcbiAgICAgKiAgICAgLy8gY29uc3RydWN0b3IgYW5kIG90aGVyIHN0dWZmLi4uXG4gICAgICpcbiAgICAgKiAgICAgcHJvdGVjdGVkIG9uRXhhbXBsZUFjdGlvbkV2ZW50KCkge1xuICAgICAqICAgICAgICB0aGlzLmV4YW1wbGVDb21wb25lbnRFdmVudHMub25FeGFtcGxlQWN0aW9uLmRpc3BhdGNoKHRoaXMpO1xuICAgICAqICAgIH1cbiAgICAgKlxuICAgICAqICAgIGdldCBvbkV4YW1wbGVBY3Rpb24oKTogRXZlbnQ8RXhhbXBsZUNvbXBvbmVudCwgTm9BcmdzPiB7XG4gICAgICogICAgICAgIHJldHVybiB0aGlzLmV4YW1wbGVDb21wb25lbnRFdmVudHMub25FeGFtcGxlQWN0aW9uLmdldEV2ZW50KCk7XG4gICAgICogICAgfVxuICAgICAqIH1cbiAgICpcbiAgICogLy8gQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgc29tZXdoZXJlXG4gICAqIHZhciBleGFtcGxlQ29tcG9uZW50SW5zdGFuY2UgPSBuZXcgRXhhbXBsZUNvbXBvbmVudCgpO1xuICAgKlxuICAgKiAvLyBTdWJzY3JpYmUgdG8gdGhlIGV4YW1wbGUgZXZlbnQgb24gdGhlIGNvbXBvbmVudFxuICAgKiBleGFtcGxlQ29tcG9uZW50SW5zdGFuY2Uub25FeGFtcGxlQWN0aW9uLnN1YnNjcmliZShmdW5jdGlvbiAoc2VuZGVyOiBFeGFtcGxlQ29tcG9uZW50KSB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKCdvbkV4YW1wbGVBY3Rpb24gb2YgJyArIHNlbmRlciArICcgaGFzIGZpcmVkIScpO1xuICAgICAqIH0pO1xuICAgKiA8L2NvZGU+XG4gICAqL1xuICBwcml2YXRlIGNvbXBvbmVudEV2ZW50cyA9IHtcbiAgICBvblNob3c6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvbkhpZGU6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvbkhvdmVyQ2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxDb21wb25lbnQ8Q29uZmlnPiwgQ29tcG9uZW50SG92ZXJDaGFuZ2VkRXZlbnRBcmdzPigpLFxuICB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgY29tcG9uZW50IHdpdGggYW4gb3B0aW9uYWxseSBzdXBwbGllZCBjb25maWcuIEFsbCBzdWJjbGFzc2VzIG11c3QgY2FsbCB0aGUgY29uc3RydWN0b3Igb2YgdGhlaXJcbiAgICogc3VwZXJjbGFzcyBhbmQgdGhlbiBtZXJnZSB0aGVpciBjb25maWd1cmF0aW9uIGludG8gdGhlIGNvbXBvbmVudCdzIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBjb21wb25lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29tcG9uZW50Q29uZmlnID0ge30pIHtcbiAgICAvLyBDcmVhdGUgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoaXMgY29tcG9uZW50XG4gICAgdGhpcy5jb25maWcgPSA8Q29uZmlnPnRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICB0YWc6ICdkaXYnLFxuICAgICAgaWQ6ICdibXB1aS1pZC0nICsgR3VpZC5uZXh0KCksXG4gICAgICBjc3NQcmVmaXg6ICdibXB1aScsXG4gICAgICBjc3NDbGFzczogJ3VpLWNvbXBvbmVudCcsXG4gICAgICBjc3NDbGFzc2VzOiBbXSxcbiAgICAgIGhpZGRlbjogZmFsc2VcbiAgICB9LCB7fSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGNvbXBvbmVudCwgZS5nLiBieSBhcHBseWluZyBjb25maWcgc2V0dGluZ3MuXG4gICAqIFRoaXMgbWV0aG9kIG11c3Qgbm90IGJlIGNhbGxlZCBmcm9tIG91dHNpZGUgdGhlIFVJIGZyYW1ld29yay5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgYnkgdGhlIHtAbGluayBVSUluc3RhbmNlTWFuYWdlcn0uIElmIHRoZSBjb21wb25lbnQgaXMgYW4gaW5uZXIgY29tcG9uZW50IG9mXG4gICAqIHNvbWUgY29tcG9uZW50LCBhbmQgdGh1cyBlbmNhcHN1bGF0ZWQgYWJkIG1hbmFnZWQgaW50ZXJuYWxseSBhbmQgbmV2ZXIgZGlyZWN0bHkgZXhwb3NlZCB0byB0aGUgVUlNYW5hZ2VyLFxuICAgKiB0aGlzIG1ldGhvZCBtdXN0IGJlIGNhbGxlZCBmcm9tIHRoZSBtYW5hZ2luZyBjb21wb25lbnQncyB7QGxpbmsgI2luaXRpYWxpemV9IG1ldGhvZC5cbiAgICovXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgdGhpcy5oaWRkZW4gPSB0aGlzLmNvbmZpZy5oaWRkZW47XG5cbiAgICAvLyBIaWRlIHRoZSBjb21wb25lbnQgYXQgaW5pdGlhbGl6YXRpb24gaWYgaXQgaXMgY29uZmlndXJlZCB0byBiZSBoaWRkZW5cbiAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICB0aGlzLmhpZGRlbiA9IGZhbHNlOyAvLyBTZXQgZmxhZyB0byBmYWxzZSBmb3IgdGhlIGZvbGxvd2luZyBoaWRlKCkgY2FsbCB0byB3b3JrIChoaWRlKCkgY2hlY2tzIHRoZSBmbGFnKVxuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIGNvbXBvbmVudCBmb3IgdGhlIHN1cHBsaWVkIFBsYXllciBhbmQgVUlJbnN0YW5jZU1hbmFnZXIuIFRoaXMgaXMgdGhlIHBsYWNlIHdoZXJlIGFsbCB0aGUgbWFnaWNcbiAgICogaGFwcGVucywgd2hlcmUgY29tcG9uZW50cyB0eXBpY2FsbHkgc3Vic2NyaWJlIGFuZCByZWFjdCB0byBldmVudHMgKG9uIHRoZWlyIERPTSBlbGVtZW50LCB0aGUgUGxheWVyLCBvciB0aGVcbiAgICogVUlJbnN0YW5jZU1hbmFnZXIpLCBhbmQgYmFzaWNhbGx5IGV2ZXJ5dGhpbmcgdGhhdCBtYWtlcyB0aGVtIGludGVyYWN0aXZlLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgb25seSBvbmNlLCB3aGVuIHRoZSBVSU1hbmFnZXIgaW5pdGlhbGl6ZXMgdGhlIFVJLlxuICAgKlxuICAgKiBTdWJjbGFzc2VzIHVzdWFsbHkgb3ZlcndyaXRlIHRoaXMgbWV0aG9kIHRvIGFkZCB0aGVpciBvd24gZnVuY3Rpb25hbGl0eS5cbiAgICpcbiAgICogQHBhcmFtIHBsYXllciB0aGUgcGxheWVyIHdoaWNoIHRoaXMgY29tcG9uZW50IGNvbnRyb2xzXG4gICAqIEBwYXJhbSB1aW1hbmFnZXIgdGhlIFVJSW5zdGFuY2VNYW5hZ2VyIHRoYXQgbWFuYWdlcyB0aGlzIGNvbXBvbmVudFxuICAgKi9cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgdGhpcy5vblNob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudFNob3cuZGlzcGF0Y2godGhpcyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkhpZGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudEhpZGUuZGlzcGF0Y2godGhpcyk7XG4gICAgfSk7XG5cbiAgICAvLyBUcmFjayB0aGUgaG92ZXJlZCBzdGF0ZSBvZiB0aGUgZWxlbWVudFxuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkhvdmVyQ2hhbmdlZEV2ZW50KHRydWUpO1xuICAgIH0pO1xuICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkhvdmVyQ2hhbmdlZEV2ZW50KGZhbHNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlcyBhbGwgcmVzb3VyY2VzIGFuZCBkZXBlbmRlbmNpZXMgdGhhdCB0aGUgY29tcG9uZW50IGhvbGRzLiBQbGF5ZXIsIERPTSwgYW5kIFVJTWFuYWdlciBldmVudHMgYXJlXG4gICAqIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBkdXJpbmcgcmVsZWFzZSBhbmQgZG8gbm90IGV4cGxpY2l0bHkgbmVlZCB0byBiZSByZW1vdmVkIGhlcmUuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgVUlNYW5hZ2VyIHdoZW4gaXQgcmVsZWFzZXMgdGhlIFVJLlxuICAgKlxuICAgKiBTdWJjbGFzc2VzIHRoYXQgbmVlZCB0byByZWxlYXNlIHJlc291cmNlcyBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QgYW5kIGNhbGwgc3VwZXIucmVsZWFzZSgpLlxuICAgKi9cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICAvLyBOb3RoaW5nIHRvIGRvIGhlcmUsIG92ZXJyaWRlIHdoZXJlIG5lY2Vzc2FyeVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBET00gZWxlbWVudCBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAqXG4gICAqIFN1YmNsYXNzZXMgdXN1YWxseSBvdmVyd3JpdGUgdGhpcyBtZXRob2QgdG8gZXh0ZW5kIG9yIHJlcGxhY2UgdGhlIERPTSBlbGVtZW50IHdpdGggdGhlaXIgb3duIGRlc2lnbi5cbiAgICovXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBsZXQgZWxlbWVudCA9IG5ldyBET00odGhpcy5jb25maWcudGFnLCB7XG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBET00gZWxlbWVudCBvZiB0aGlzIGNvbXBvbmVudC4gQ3JlYXRlcyB0aGUgRE9NIGVsZW1lbnQgaWYgaXQgZG9lcyBub3QgeWV0IGV4aXN0LlxuICAgKlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIGJ5IHN1YmNsYXNzZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtET019XG4gICAqL1xuICBnZXREb21FbGVtZW50KCk6IERPTSB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMudG9Eb21FbGVtZW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZXMgYSBjb25maWd1cmF0aW9uIHdpdGggYSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gYW5kIGEgYmFzZSBjb25maWd1cmF0aW9uIGZyb20gdGhlIHN1cGVyY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWcgdGhlIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MgZm9yIHRoZSBjb21wb25lbnRzLCBhcyB1c3VhbGx5IHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIGRlZmF1bHRzIGEgZGVmYXVsdCBjb25maWd1cmF0aW9uIGZvciBzZXR0aW5ncyB0aGF0IGFyZSBub3QgcGFzc2VkIHdpdGggdGhlIGNvbmZpZ3VyYXRpb25cbiAgICogQHBhcmFtIGJhc2UgY29uZmlndXJhdGlvbiBpbmhlcml0ZWQgZnJvbSBhIHN1cGVyY2xhc3NcbiAgICogQHJldHVybnMge0NvbmZpZ31cbiAgICovXG4gIHByb3RlY3RlZCBtZXJnZUNvbmZpZzxDb25maWc+KGNvbmZpZzogQ29uZmlnLCBkZWZhdWx0czogQ29uZmlnLCBiYXNlOiBDb25maWcpOiBDb25maWcge1xuICAgIC8vIEV4dGVuZCBkZWZhdWx0IGNvbmZpZyB3aXRoIHN1cHBsaWVkIGNvbmZpZ1xuICAgIGxldCBtZXJnZWQgPSBPYmplY3QuYXNzaWduKHt9LCBiYXNlLCBkZWZhdWx0cywgY29uZmlnKTtcblxuICAgIC8vIFJldHVybiB0aGUgZXh0ZW5kZWQgY29uZmlnXG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRoYXQgcmV0dXJucyBhIHN0cmluZyBvZiBhbGwgQ1NTIGNsYXNzZXMgb2YgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHByb3RlY3RlZCBnZXRDc3NDbGFzc2VzKCk6IHN0cmluZyB7XG4gICAgLy8gTWVyZ2UgYWxsIENTUyBjbGFzc2VzIGludG8gc2luZ2xlIGFycmF5XG4gICAgbGV0IGZsYXR0ZW5lZEFycmF5ID0gW3RoaXMuY29uZmlnLmNzc0NsYXNzXS5jb25jYXQodGhpcy5jb25maWcuY3NzQ2xhc3Nlcyk7XG4gICAgLy8gUHJlZml4IGNsYXNzZXNcbiAgICBmbGF0dGVuZWRBcnJheSA9IGZsYXR0ZW5lZEFycmF5Lm1hcCgoY3NzKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXhDc3MoY3NzKTtcbiAgICB9KTtcbiAgICAvLyBKb2luIGFycmF5IHZhbHVlcyBpbnRvIGEgc3RyaW5nXG4gICAgbGV0IGZsYXR0ZW5lZFN0cmluZyA9IGZsYXR0ZW5lZEFycmF5LmpvaW4oJyAnKTtcbiAgICAvLyBSZXR1cm4gdHJpbW1lZCBzdHJpbmcgdG8gcHJldmVudCB3aGl0ZXNwYWNlIGF0IHRoZSBlbmQgZnJvbSB0aGUgam9pbiBvcGVyYXRpb25cbiAgICByZXR1cm4gZmxhdHRlbmVkU3RyaW5nLnRyaW0oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwcmVmaXhDc3MoY3NzQ2xhc3NPcklkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5jc3NQcmVmaXggKyAnLScgKyBjc3NDbGFzc09ySWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY29uZmlndXJhdGlvbiBvYmplY3Qgb2YgdGhlIGNvbXBvbmVudC5cbiAgICogQHJldHVybnMge0NvbmZpZ31cbiAgICovXG4gIHB1YmxpYyBnZXRDb25maWcoKTogQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cblxuICAvKipcbiAgICogSGlkZXMgdGhlIGNvbXBvbmVudCBpZiBzaG93bi5cbiAgICogVGhpcyBtZXRob2QgYmFzaWNhbGx5IHRyYW5zZmVycyB0aGUgY29tcG9uZW50IGludG8gdGhlIGhpZGRlbiBzdGF0ZS4gQWN0dWFsIGhpZGluZyBpcyBkb25lIHZpYSBDU1MuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIGlmICghdGhpcy5oaWRkZW4pIHtcbiAgICAgIHRoaXMuaGlkZGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKENvbXBvbmVudC5DTEFTU19ISURERU4pKTtcbiAgICAgIHRoaXMub25IaWRlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvd3MgdGhlIGNvbXBvbmVudCBpZiBoaWRkZW4uXG4gICAqL1xuICBzaG93KCkge1xuICAgIGlmICh0aGlzLmhpZGRlbikge1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoQ29tcG9uZW50LkNMQVNTX0hJRERFTikpO1xuICAgICAgdGhpcy5oaWRkZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMub25TaG93RXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY29tcG9uZW50IGlzIGhpZGRlbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBpcyBoaWRkZW4sIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzSGlkZGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhpZGRlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBjb21wb25lbnQgaXMgc2hvd24uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBjb21wb25lbnQgaXMgdmlzaWJsZSwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaXNTaG93bigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNIaWRkZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBoaWRkZW4gc3RhdGUgYnkgaGlkaW5nIHRoZSBjb21wb25lbnQgaWYgaXQgaXMgc2hvd24sIG9yIHNob3dpbmcgaXQgaWYgaGlkZGVuLlxuICAgKi9cbiAgdG9nZ2xlSGlkZGVuKCkge1xuICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY29tcG9uZW50IGlzIGN1cnJlbnRseSBob3ZlcmVkLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgY29tcG9uZW50IGlzIGhvdmVyZWQsIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5ob3ZlcmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvblNob3cgZXZlbnQuXG4gICAqIFNlZSB0aGUgZGV0YWlsZWQgZXhwbGFuYXRpb24gb24gZXZlbnQgYXJjaGl0ZWN0dXJlIG9uIHRoZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyBldmVudHMgbGlzdH0uXG4gICAqL1xuICBwcm90ZWN0ZWQgb25TaG93RXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRFdmVudHMub25TaG93LmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvbkhpZGUgZXZlbnQuXG4gICAqIFNlZSB0aGUgZGV0YWlsZWQgZXhwbGFuYXRpb24gb24gZXZlbnQgYXJjaGl0ZWN0dXJlIG9uIHRoZSB7QGxpbmsgI2NvbXBvbmVudEV2ZW50cyBldmVudHMgbGlzdH0uXG4gICAqL1xuICBwcm90ZWN0ZWQgb25IaWRlRXZlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRFdmVudHMub25IaWRlLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBvbkhvdmVyQ2hhbmdlZCBldmVudC5cbiAgICogU2VlIHRoZSBkZXRhaWxlZCBleHBsYW5hdGlvbiBvbiBldmVudCBhcmNoaXRlY3R1cmUgb24gdGhlIHtAbGluayAjY29tcG9uZW50RXZlbnRzIGV2ZW50cyBsaXN0fS5cbiAgICovXG4gIHByb3RlY3RlZCBvbkhvdmVyQ2hhbmdlZEV2ZW50KGhvdmVyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmhvdmVyZWQgPSBob3ZlcmVkO1xuICAgIHRoaXMuY29tcG9uZW50RXZlbnRzLm9uSG92ZXJDaGFuZ2VkLmRpc3BhdGNoKHRoaXMsIHsgaG92ZXJlZDogaG92ZXJlZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBzaG93aW5nLlxuICAgKiBTZWUgdGhlIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9uIGV2ZW50IGFyY2hpdGVjdHVyZSBvbiB0aGUge0BsaW5rICNjb21wb25lbnRFdmVudHMgZXZlbnRzIGxpc3R9LlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25TaG93KCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25TaG93LmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgaGlkaW5nLlxuICAgKiBTZWUgdGhlIGRldGFpbGVkIGV4cGxhbmF0aW9uIG9uIGV2ZW50IGFyY2hpdGVjdHVyZSBvbiB0aGUge0BsaW5rICNjb21wb25lbnRFdmVudHMgZXZlbnRzIGxpc3R9LlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8Q29tcG9uZW50PENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25IaWRlKCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25IaWRlLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb21wb25lbnQncyBob3Zlci1zdGF0ZSBpcyBjaGFuZ2luZy5cbiAgICogQHJldHVybnMge0V2ZW50PENvbXBvbmVudDxDb25maWc+LCBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uSG92ZXJDaGFuZ2VkKCk6IEV2ZW50PENvbXBvbmVudDxDb25maWc+LCBDb21wb25lbnRIb3ZlckNoYW5nZWRFdmVudEFyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRFdmVudHMub25Ib3ZlckNoYW5nZWQuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50Q29uZmlnLCBDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtBcnJheVV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIENvbnRhaW5lcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGFpbmVyQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgLyoqXG4gICAqIENoaWxkIGNvbXBvbmVudHMgb2YgdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIGNvbXBvbmVudHM/OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPltdO1xufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGNhbiBjb250YWluIGEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb21wb25lbnRzLlxuICogQ29tcG9uZW50cyBjYW4gYmUgYWRkZWQgYXQgY29uc3RydWN0aW9uIHRpbWUgdGhyb3VnaCB0aGUge0BsaW5rIENvbnRhaW5lckNvbmZpZyNjb21wb25lbnRzfSBzZXR0aW5nLCBvciBsYXRlclxuICogdGhyb3VnaCB0aGUge0BsaW5rIENvbnRhaW5lciNhZGRDb21wb25lbnR9IG1ldGhvZC4gVGhlIFVJTWFuYWdlciBhdXRvbWF0aWNhbGx5IHRha2VzIGNhcmUgb2YgYWxsIGNvbXBvbmVudHMsIGkuZS4gaXRcbiAqIGluaXRpYWxpemVzIGFuZCBjb25maWd1cmVzIHRoZW0gYXV0b21hdGljYWxseS5cbiAqXG4gKiBJbiB0aGUgRE9NLCB0aGUgY29udGFpbmVyIGNvbnNpc3RzIG9mIGFuIG91dGVyIDxkaXY+ICh0aGF0IGNhbiBiZSBjb25maWd1cmVkIGJ5IHRoZSBjb25maWcpIGFuZCBhbiBpbm5lciB3cmFwcGVyXG4gKiA8ZGl2PiB0aGF0IGNvbnRhaW5zIHRoZSBjb21wb25lbnRzLiBUaGlzIGRvdWJsZS08ZGl2Pi1zdHJ1Y3R1cmUgaXMgb2Z0ZW4gcmVxdWlyZWQgdG8gYWNoaWV2ZSBtYW55IGFkdmFuY2VkIGVmZmVjdHNcbiAqIGluIENTUyBhbmQvb3IgSlMsIGUuZy4gYW5pbWF0aW9ucyBhbmQgY2VydGFpbiBmb3JtYXR0aW5nIHdpdGggYWJzb2x1dGUgcG9zaXRpb25pbmcuXG4gKlxuICogRE9NIGV4YW1wbGU6XG4gKiA8Y29kZT5cbiAqICAgICA8ZGl2IGNsYXNzPSd1aS1jb250YWluZXInPlxuICogICAgICAgICA8ZGl2IGNsYXNzPSdjb250YWluZXItd3JhcHBlcic+XG4gKiAgICAgICAgICAgICAuLi4gY2hpbGQgY29tcG9uZW50cyAuLi5cbiAqICAgICAgICAgPC9kaXY+XG4gKiAgICAgPC9kaXY+XG4gKiA8L2NvZGU+XG4gKi9cbmV4cG9ydCBjbGFzcyBDb250YWluZXI8Q29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxDb250YWluZXJDb25maWc+IHtcblxuICAvKipcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIGlubmVyIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgY29tcG9uZW50cyBvZiB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBpbm5lckNvbnRhaW5lckVsZW1lbnQ6IERPTTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbnRhaW5lckNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWNvbnRhaW5lcicsXG4gICAgICBjb21wb25lbnRzOiBbXVxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY2hpbGQgY29tcG9uZW50IHRvIHRoZSBjb250YWluZXIuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCB0byBhZGRcbiAgICovXG4gIGFkZENvbXBvbmVudChjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSB7XG4gICAgdGhpcy5jb25maWcuY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNoaWxkIGNvbXBvbmVudCBmcm9tIHRoZSBjb250YWluZXIuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgdGhlIGNvbXBvbmVudCB0byByZW1vdmVcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiByZW1vdmVkLCBmYWxzZSBpZiBpdCBpcyBub3QgY29udGFpbmVkIGluIHRoaXMgY29udGFpbmVyXG4gICAqL1xuICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmNvbmZpZy5jb21wb25lbnRzLCBjb21wb25lbnQpICE9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBhcnJheSBvZiBhbGwgY2hpbGQgY29tcG9uZW50cyBpbiB0aGlzIGNvbnRhaW5lci5cbiAgICogQHJldHVybnMge0NvbXBvbmVudDxDb21wb25lbnRDb25maWc+W119XG4gICAqL1xuICBnZXRDb21wb25lbnRzKCk6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+W10ge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5jb21wb25lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGNoaWxkIGNvbXBvbmVudHMgZnJvbSB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcmVtb3ZlQ29tcG9uZW50cygpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5nZXRDb21wb25lbnRzKCkpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIERPTSBvZiB0aGUgY29udGFpbmVyIHdpdGggdGhlIGN1cnJlbnQgY29tcG9uZW50cy5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVDb21wb25lbnRzKCk6IHZvaWQge1xuICAgIHRoaXMuaW5uZXJDb250YWluZXJFbGVtZW50LmVtcHR5KCk7XG5cbiAgICBmb3IgKGxldCBjb21wb25lbnQgb2YgdGhpcy5jb25maWcuY29tcG9uZW50cykge1xuICAgICAgdGhpcy5pbm5lckNvbnRhaW5lckVsZW1lbnQuYXBwZW5kKGNvbXBvbmVudC5nZXREb21FbGVtZW50KCkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICAvLyBDcmVhdGUgdGhlIGNvbnRhaW5lciBlbGVtZW50ICh0aGUgb3V0ZXIgPGRpdj4pXG4gICAgbGV0IGNvbnRhaW5lckVsZW1lbnQgPSBuZXcgRE9NKHRoaXMuY29uZmlnLnRhZywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKVxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBpbm5lciBjb250YWluZXIgZWxlbWVudCAodGhlIGlubmVyIDxkaXY+KSB0aGF0IHdpbGwgY29udGFpbiB0aGUgY29tcG9uZW50c1xuICAgIGxldCBpbm5lckNvbnRhaW5lciA9IG5ldyBET00odGhpcy5jb25maWcudGFnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnY29udGFpbmVyLXdyYXBwZXInKVxuICAgIH0pO1xuICAgIHRoaXMuaW5uZXJDb250YWluZXJFbGVtZW50ID0gaW5uZXJDb250YWluZXI7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcblxuICAgIGNvbnRhaW5lckVsZW1lbnQuYXBwZW5kKGlubmVyQ29udGFpbmVyKTtcblxuICAgIHJldHVybiBjb250YWluZXJFbGVtZW50O1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VUlVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtTcGFjZXJ9IGZyb20gJy4vc3BhY2VyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBDb250cm9sQmFyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250cm9sQmFyQ29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLy8gbm90aGluZyB5ZXRcbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBmb3IgbWFpbiBwbGF5ZXIgY29udHJvbCBjb21wb25lbnRzLCBlLmcuIHBsYXkgdG9nZ2xlIGJ1dHRvbiwgc2VlayBiYXIsIHZvbHVtZSBjb250cm9sLCBmdWxsc2NyZWVuIHRvZ2dsZVxuICogYnV0dG9uLlxuICovXG5leHBvcnQgY2xhc3MgQ29udHJvbEJhciBleHRlbmRzIENvbnRhaW5lcjxDb250cm9sQmFyQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb250cm9sQmFyQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktY29udHJvbGJhcicsXG4gICAgICBoaWRkZW46IHRydWUsXG4gICAgfSwgPENvbnRyb2xCYXJDb25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIC8vIENvdW50cyBob3cgbWFueSBjb21wb25lbnRzIGFyZSBob3ZlcmVkIGFuZCBibG9jayBoaWRpbmcgb2YgdGhlIGNvbnRyb2wgYmFyXG4gICAgbGV0IGhvdmVyU3RhY2tDb3VudCA9IDA7XG5cbiAgICAvLyBUcmFjayBob3ZlciBzdGF0dXMgb2YgY2hpbGQgY29tcG9uZW50c1xuICAgIFVJVXRpbHMudHJhdmVyc2VUcmVlKHRoaXMsIChjb21wb25lbnQpID0+IHtcbiAgICAgIC8vIERvIG5vdCB0cmFjayBob3ZlciBzdGF0dXMgb2YgY2hpbGQgY29udGFpbmVycyBvciBzcGFjZXJzLCBvbmx5IG9mICdyZWFsJyBjb250cm9sc1xuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbnRhaW5lciB8fCBjb21wb25lbnQgaW5zdGFuY2VvZiBTcGFjZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBTdWJzY3JpYmUgaG92ZXIgZXZlbnQgYW5kIGtlZXAgYSBjb3VudCBvZiB0aGUgbnVtYmVyIG9mIGhvdmVyZWQgY2hpbGRyZW5cbiAgICAgIGNvbXBvbmVudC5vbkhvdmVyQ2hhbmdlZC5zdWJzY3JpYmUoKHNlbmRlciwgYXJncykgPT4ge1xuICAgICAgICBpZiAoYXJncy5ob3ZlcmVkKSB7XG4gICAgICAgICAgaG92ZXJTdGFja0NvdW50Kys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaG92ZXJTdGFja0NvdW50LS07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNTaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9KTtcbiAgICB1aW1hbmFnZXIub25QcmV2aWV3Q29udHJvbHNIaWRlLnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzKSA9PiB7XG4gICAgICAvLyBDYW5jZWwgdGhlIGhpZGUgZXZlbnQgaWYgaG92ZXJlZCBjaGlsZCBjb21wb25lbnRzIGJsb2NrIGhpZGluZ1xuICAgICAgYXJncy5jYW5jZWwgPSAoaG92ZXJTdGFja0NvdW50ID4gMCk7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNIaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1RpbWVvdXR9IGZyb20gJy4uL3RpbWVvdXQnO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtDbG9zZUJ1dHRvbn0gZnJvbSAnLi9jbG9zZWJ1dHRvbic7XG5pbXBvcnQge0NoZWNrYm94fSBmcm9tICcuL2NoZWNrYm94JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgRW1iZWRWaWRlb1BhbmVsfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbWJlZFZpZGVvUGFuZWxDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgZW1iZWRWaWRlbyBwYW5lbCB3aWxsIGJlIGhpZGRlbiB3aGVuIHRoZXJlIGlzIG5vIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAqIFNldCB0byAtMSB0byBkaXNhYmxlIGF1dG9tYXRpYyBoaWRpbmcuXG4gICAqIERlZmF1bHQ6IDMgc2Vjb25kcyAoMzAwMClcbiAgICovXG4gIGhpZGVEZWxheT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBIHBhbmVsIGNvbnRhaW5pbmcgYSBsaXN0IG9mIHtAbGluayBFbWJlZFZpZGVvUGFuZWxJdGVtIGl0ZW1zfSB0aGF0IHJlcHJlc2VudCBsYWJlbGxlZCBlbWJlZFZpZGVvLlxuICovXG5leHBvcnQgY2xhc3MgRW1iZWRWaWRlb1BhbmVsIGV4dGVuZHMgQ29udGFpbmVyPEVtYmVkVmlkZW9QYW5lbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgY2xvc2VCdXR0b246IENsb3NlQnV0dG9uO1xuICBwcml2YXRlIHRpdGxlOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgc2hvd0NvbW1lbnRzQ2hlY2tib3g6IENoZWNrYm94O1xuICBwcml2YXRlIGNvZGVGaWVsZDogTGFiZWw8TGFiZWxDb25maWc+O1xuXG5cbiAgcHJpdmF0ZSBoaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IEVtYmVkVmlkZW9QYW5lbENvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLnRpdGxlID0gbmV3IExhYmVsKHt0ZXh0OiAnRW1iZWQgVmlkZW8nLCBjc3NDbGFzczogJ3VpLWVtYmVkdmlkZW8tcGFuZWwtdGl0bGUnfSk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG5ldyBDbG9zZUJ1dHRvbih7dGFyZ2V0OiB0aGlzfSk7XG4gICAgdGhpcy5zaG93Q29tbWVudHNDaGVja2JveCA9IG5ldyBDaGVja2JveCh7dGV4dDogJ1Nob3cgY29tbWVudHMnfSk7XG4gICAgdGhpcy5jb2RlRmllbGQgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzOiAndWktZW1iZWR2aWRlby1wYW5lbC1jb2RlZmllbGQnfSk7XG5cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZzxFbWJlZFZpZGVvUGFuZWxDb25maWc+KGNvbmZpZywge1xuICAgICAgICBjc3NDbGFzczogJ3VpLWVtYmVkdmlkZW8tcGFuZWwnLFxuICAgICAgICBoaWRlRGVsYXk6IDMwMDAsXG4gICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICAgIGNzc0NsYXNzOiAndWktZW1iZWR2aWRlby1wYW5lbC1oZWFkZXInLFxuICAgICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgICB0aGlzLnRpdGxlLFxuICAgICAgICAgICAgICB0aGlzLmNsb3NlQnV0dG9uLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRoaXMuc2hvd0NvbW1lbnRzQ2hlY2tib3gsXG4gICAgICAgICAgdGhpcy5jb2RlRmllbGRcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHRoaXMuY29uZmlnXG4gICAgKVxuICAgIDtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPEVtYmVkVmlkZW9QYW5lbENvbmZpZz50aGlzLmdldENvbmZpZygpOyAvLyBUT0RPIGZpeCBnZW5lcmljcyB0eXBlIGluZmVyZW5jZVxuICAgIGxldCB1aWNvbmZpZyA9IHVpbWFuYWdlci5nZXRDb25maWcoKTtcblxuICAgIGlmIChjb25maWcuaGlkZURlbGF5ID4gLTEpIHtcbiAgICAgIHRoaXMuaGlkZVRpbWVvdXQgPSBuZXcgVGltZW91dChjb25maWcuaGlkZURlbGF5LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub25TaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIEFjdGl2YXRlIHRpbWVvdXQgd2hlbiBzaG93blxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgICAgIC8vIFJlc2V0IHRpbWVvdXQgb24gaW50ZXJhY3Rpb25cbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIC8vIFJlc2V0IHRpbWVvdXQgb24gaW50ZXJhY3Rpb25cbiAgICAgICAgdGhpcy5oaWRlVGltZW91dC5yZXNldCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm9uSGlkZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBDbGVhciB0aW1lb3V0IHdoZW4gaGlkZGVuIGZyb20gb3V0c2lkZVxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IGluaXQgPSAoKSA9PiB7XG4gICAgICBpZiAodWljb25maWcgJiYgdWljb25maWcubWV0YWRhdGEgJiYgdWljb25maWcubWV0YWRhdGEuZW1iZWRWaWRlbykge1xuICAgICAgICBsZXQgZXYgPSB1aWNvbmZpZy5tZXRhZGF0YS5lbWJlZFZpZGVvXG4gICAgICAgIGlmICh0aGlzLnNob3dDb21tZW50c0NoZWNrYm94LmlzT24gJiYgZXYud2l0aENvbW1lbnRzKSB7XG4gICAgICAgICAgdGhpcy5zZXRFbWJlZFZpZGVvKGV2LndpdGhDb21tZW50cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRFbWJlZFZpZGVvKGV2LmRlZmF1bHQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UgJiYgcGxheWVyLmdldENvbmZpZygpLnNvdXJjZS5lbWJlZFZpZGVvKSB7XG4gICAgICAgIGxldCBldiA9IHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UuZW1iZWRWaWRlb1xuICAgICAgICBpZiAodGhpcy5zaG93Q29tbWVudHNDaGVja2JveC5pc09uICYmIGV2LndpdGhDb21tZW50cykge1xuICAgICAgICAgIHRoaXMuc2V0RW1iZWRWaWRlbyhldi53aXRoQ29tbWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0RW1iZWRWaWRlbyhldi5kZWZhdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdW5sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5zZXRIdG1sQ29kZShudWxsKTtcbiAgICB9O1xuXG4gICAgLy8gSW5pdCBsYWJlbFxuICAgIGluaXQoKTtcblxuICAgIC8vIFJlaW5pdCBsYWJlbCB3aGVuIGEgbmV3IHNvdXJjZSBpcyBsb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfTE9BREVELCBpbml0KTtcbiAgICAvLyBDbGVhciBsYWJlbHMgd2hlbiBzb3VyY2UgaXMgdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHVubG9hZCk7XG5cbiAgICAvLyB1cGRhdGUgd2hlbiBjaGVja2JveCBpcyBjaGFuZ2VkXG4gICAgdGhpcy5zaG93Q29tbWVudHNDaGVja2JveC5vbkNoYW5nZS5zdWJzY3JpYmUoaW5pdCk7XG5cbiAgICAvLyB1cGRhdGUgd2hlbiBzaG93blxuICAgIHRoaXMub25TaG93LnN1YnNjcmliZShpbml0KTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIGlmICh0aGlzLmhpZGVUaW1lb3V0KSB7XG4gICAgICB0aGlzLmhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0RW1iZWRWaWRlbyhodG1sQ29kZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGh0bWxDb2RlKSB7XG4gICAgICBsZXQgY29kZSA9IHRoaXMudG9IdG1sRW50aXRpZXMoaHRtbENvZGUpXG4gICAgICB0aGlzLnNldEh0bWxDb2RlKGNvZGUpXG4gICAgICB0aGlzLmNvcHlUZXh0VG9DbGlwYm9hcmQoaHRtbENvZGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0SHRtbENvZGUobnVsbClcbiAgICB9XG4gIH1cblxuICBzZXRIdG1sQ29kZShjb2RlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGVGaWVsZC5zZXRUZXh0KGNvZGUpXG4gIH1cblxuICB0b0h0bWxFbnRpdGllcyhzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzLnJlcGxhY2UoLy4vZ20sIGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gJyYjJyArIHMuY2hhckNvZGVBdCgwKSArICc7JztcbiAgICB9KTtcbiAgfVxuXG4gIGNvcHlUZXh0VG9DbGlwYm9hcmQodGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dEFyZWEudmFsdWUgPSB0ZXh0XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0QXJlYSlcbiAgICB0ZXh0QXJlYS5zZWxlY3QoKVxuICAgIHRyeSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGV4dEFyZWEpXG4gIH1cbn1cblxuIiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtFbWJlZFZpZGVvUGFuZWx9IGZyb20gJy4vZW1iZWR2aWRlb3BhbmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgRW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbkNvbmZpZyBleHRlbmRzIFRvZ2dsZUJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgZW1iZWRWaWRlbyBwYW5lbCB3aG9zZSB2aXNpYmlsaXR5IHRoZSBidXR0b24gc2hvdWxkIHRvZ2dsZS5cbiAgICovXG4gIGVtYmVkVmlkZW9QYW5lbDogRW1iZWRWaWRlb1BhbmVsO1xufVxuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyB2aXNpYmlsaXR5IG9mIGEgZW1iZWRWaWRlbyBwYW5lbC5cbiAqL1xuZXhwb3J0IGNsYXNzIEVtYmVkVmlkZW9Ub2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248RW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogRW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbkNvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICBpZiAoIWNvbmZpZy5lbWJlZFZpZGVvUGFuZWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWlyZWQgRW1iZWRWaWRlb1BhbmVsIGlzIG1pc3NpbmcnKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWVtYmVkdmlkZW8tdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdFbWJlZCBWaWRlbycsXG4gICAgICBlbWJlZFZpZGVvUGFuZWw6IG51bGxcbiAgICB9LCA8RW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbkNvbmZpZz50aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxFbWJlZFZpZGVvVG9nZ2xlQnV0dG9uQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7IC8vIFRPRE8gZml4IGdlbmVyaWNzIHR5cGUgaW5mZXJlbmNlXG4gICAgbGV0IGVtYmVkVmlkZW9QYW5lbCA9IGNvbmZpZy5lbWJlZFZpZGVvUGFuZWw7XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdvbkNsaWNrIGhpZGRlbjonLCBlbWJlZFZpZGVvUGFuZWwuaXNIaWRkZW4oKSlcbiAgICAgIGVtYmVkVmlkZW9QYW5lbC50b2dnbGVIaWRkZW4oKTtcbiAgICB9KTtcblxuICAgIGVtYmVkVmlkZW9QYW5lbC5vblNob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIFNldCB0b2dnbGUgc3RhdHVzIHRvIG9uIHdoZW4gdGhlIGVtYmVkVmlkZW8gcGFuZWwgc2hvd3NcbiAgICAgIHRoaXMub24oKTtcbiAgICB9KTtcblxuICAgIGVtYmVkVmlkZW9QYW5lbC5vbkhpZGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIFNldCB0b2dnbGUgc3RhdHVzIHRvIG9mZiB3aGVuIHRoZSBlbWJlZFZpZGVvIHBhbmVsIGhpZGVzXG4gICAgICB0aGlzLm9mZigpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBFcnJvckV2ZW50ID0gYml0bW92aW4uUGxheWVyQVBJLkVycm9yRXZlbnQ7XG5pbXBvcnQge1R2Tm9pc2VDYW52YXN9IGZyb20gJy4vdHZub2lzZWNhbnZhcyc7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JNZXNzYWdlVHJhbnNsYXRvciB7XG4gIChlcnJvcjogRXJyb3JFdmVudCk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFcnJvck1lc3NhZ2VNYXAge1xuICBbY29kZTogbnVtYmVyXTogc3RyaW5nIHwgRXJyb3JNZXNzYWdlVHJhbnNsYXRvcjtcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBFcnJvck1lc3NhZ2VPdmVybGF5fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnIGV4dGVuZHMgQ29udGFpbmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIEFsbG93cyBvdmVyd3JpdGluZyBvZiB0aGUgZXJyb3IgbWVzc2FnZXMgZGlzcGxheWVkIGluIHRoZSBvdmVybGF5IGZvciBjdXN0b21pemF0aW9uIGFuZCBsb2NhbGl6YXRpb24uXG4gICAqIFRoaXMgaXMgZWl0aGVyIGEgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhbnkge0BsaW5rIEVycm9yRXZlbnR9IGFzIHBhcmFtZXRlciBhbmQgdHJhbnNsYXRlcyBlcnJvciBtZXNzYWdlcyxcbiAgICogb3IgYSBtYXAgb2YgZXJyb3IgY29kZXMgdGhhdCBvdmVyd3JpdGVzIHNwZWNpZmljIGVycm9yIG1lc3NhZ2VzIHdpdGggYSBwbGFpbiBzdHJpbmcgb3IgYSBmdW5jdGlvbiB0aGF0XG4gICAqIHJlY2VpdmVzIHRoZSB7QGxpbmsgRXJyb3JFdmVudH0gYXMgcGFyYW1ldGVyIGFuZCByZXR1cm5zIGEgY3VzdG9taXplZCBzdHJpbmcuXG4gICAqIFRoZSB0cmFuc2xhdGlvbiBmdW5jdGlvbnMgY2FuIGJlIHVzZWQgdG8gZXh0cmFjdCBkYXRhIChlLmcuIHBhcmFtZXRlcnMpIGZyb20gdGhlIG9yaWdpbmFsIGVycm9yIG1lc3NhZ2UuXG4gICAqXG4gICAqIEV4YW1wbGUgMSAoY2F0Y2gtYWxsIHRyYW5zbGF0aW9uIGZ1bmN0aW9uKTpcbiAgICogPGNvZGU+XG4gICAqIGVycm9yTWVzc2FnZU92ZXJsYXlDb25maWcgPSB7XG4gICAqICAgbWVzc2FnZXM6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAqICAgICBzd2l0Y2ggKGVycm9yLmNvZGUpIHtcbiAgICogICAgICAgLy8gT3ZlcndyaXRlIGVycm9yIDMwMDAgJ1Vua25vd24gZXJyb3InXG4gICAqICAgICAgIGNhc2UgMzAwMDpcbiAgICogICAgICAgICByZXR1cm4gJ0hvdXN0b24sIHdlIGhhdmUgYSBwcm9ibGVtJ1xuICAgKlxuICAgKiAgICAgICAvLyBUcmFuc2Zvcm0gZXJyb3IgMzAwMSAnVW5zdXBwb3J0ZWQgbWFuaWZlc3QgZm9ybWF0JyB0byB1cHBlcmNhc2VcbiAgICogICAgICAgY2FzZSAzMDAxOlxuICAgKiAgICAgICAgIHJldHVybiBlcnJvci5tZXNzYWdlLnRvVXBwZXJDYXNlKCk7XG4gICAqXG4gICAqICAgICAgIC8vIEN1c3RvbWl6ZSBlcnJvciAzMDA2ICdDb3VsZCBub3QgbG9hZCBtYW5pZmVzdCwgZ290IEhUVFAgc3RhdHVzIGNvZGUgWFhYJ1xuICAgKiAgICAgICBjYXNlIDMwMDY6XG4gICAqICAgICAgICAgdmFyIHN0YXR1c0NvZGUgPSBlcnJvci5tZXNzYWdlLnN1YnN0cmluZyg0Nik7XG4gICAqICAgICAgICAgcmV0dXJuICdNYW5pZmVzdCBsb2FkaW5nIGZhaWxlZCB3aXRoIEhUVFAgZXJyb3IgJyArIHN0YXR1c0NvZGU7XG4gICAqICAgICB9XG4gICAqICAgICAvLyBSZXR1cm4gdW5tb2RpZmllZCBlcnJvciBtZXNzYWdlIGZvciBhbGwgb3RoZXIgZXJyb3JzXG4gICAqICAgICByZXR1cm4gZXJyb3IubWVzc2FnZTtcbiAgICogICB9XG4gICAqIH07XG4gICAqIDwvY29kZT5cbiAgICpcbiAgICogRXhhbXBsZSAyICh0cmFuc2xhdGluZyBzcGVjaWZpYyBlcnJvcnMpOlxuICAgKiA8Y29kZT5cbiAgICogZXJyb3JNZXNzYWdlT3ZlcmxheUNvbmZpZyA9IHtcbiAgICogICBtZXNzYWdlczoge1xuICAgKiAgICAgLy8gT3ZlcndyaXRlIGVycm9yIDMwMDAgJ1Vua25vd24gZXJyb3InXG4gICAqICAgICAzMDAwOiAnSG91c3Rvbiwgd2UgaGF2ZSBhIHByb2JsZW0nLFxuICAgKlxuICAgKiAgICAgLy8gVHJhbnNmb3JtIGVycm9yIDMwMDEgJ1Vuc3VwcG9ydGVkIG1hbmlmZXN0IGZvcm1hdCcgdG8gdXBwZXJjYXNlXG4gICAqICAgICAzMDAxOiBmdW5jdGlvbihlcnJvcikge1xuICAgKiAgICAgICByZXR1cm4gZXJyb3IubWVzc2FnZS50b1VwcGVyQ2FzZSgpO1xuICAgKiAgICAgfSxcbiAgICpcbiAgICogICAgIC8vIEN1c3RvbWl6ZSBlcnJvciAzMDA2ICdDb3VsZCBub3QgbG9hZCBtYW5pZmVzdCwgZ290IEhUVFAgc3RhdHVzIGNvZGUgWFhYJ1xuICAgKiAgICAgMzAwNjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICogICAgICAgdmFyIHN0YXR1c0NvZGUgPSBlcnJvci5tZXNzYWdlLnN1YnN0cmluZyg0Nik7XG4gICAqICAgICAgIHJldHVybiAnTWFuaWZlc3QgbG9hZGluZyBmYWlsZWQgd2l0aCBIVFRQIGVycm9yICcgKyBzdGF0dXNDb2RlO1xuICAgKiAgICAgfVxuICAgKiAgIH1cbiAgICogfTtcbiAgICogPC9jb2RlPlxuICAgKi9cbiAgbWVzc2FnZXM/OiBFcnJvck1lc3NhZ2VNYXAgfCBFcnJvck1lc3NhZ2VUcmFuc2xhdG9yO1xufVxuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgYW5kIGRpc3BsYXlzIGVycm9yIG1lc3NhZ2VzLlxuICovXG5leHBvcnQgY2xhc3MgRXJyb3JNZXNzYWdlT3ZlcmxheSBleHRlbmRzIENvbnRhaW5lcjxFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBlcnJvckxhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgdHZOb2lzZUJhY2tncm91bmQ6IFR2Tm9pc2VDYW52YXM7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5lcnJvckxhYmVsID0gbmV3IExhYmVsPExhYmVsQ29uZmlnPih7IGNzc0NsYXNzOiAndWktZXJyb3JtZXNzYWdlLWxhYmVsJyB9KTtcbiAgICB0aGlzLnR2Tm9pc2VCYWNrZ3JvdW5kID0gbmV3IFR2Tm9pc2VDYW52YXMoKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktZXJyb3JtZXNzYWdlLW92ZXJsYXknLFxuICAgICAgY29tcG9uZW50czogW3RoaXMudHZOb2lzZUJhY2tncm91bmQsIHRoaXMuZXJyb3JMYWJlbF0sXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNvbmZpZyA9IDxFcnJvck1lc3NhZ2VPdmVybGF5Q29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9FUlJPUiwgKGV2ZW50OiBFcnJvckV2ZW50KSA9PiB7XG4gICAgICBsZXQgbWVzc2FnZSA9IGV2ZW50Lm1lc3NhZ2U7XG5cbiAgICAgIC8vIFByb2Nlc3MgbWVzc2FnZSB0cmFuc2xhdGlvbnNcbiAgICAgIGlmIChjb25maWcubWVzc2FnZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcubWVzc2FnZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAvLyBUcmFuc2xhdGlvbiBmdW5jdGlvbiBmb3IgYWxsIGVycm9yc1xuICAgICAgICAgIG1lc3NhZ2UgPSBjb25maWcubWVzc2FnZXMoZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5tZXNzYWdlc1tldmVudC5jb2RlXSkge1xuICAgICAgICAgIC8vIEl0J3Mgbm90IGEgdHJhbnNsYXRpb24gZnVuY3Rpb24sIHNvIGl0IG11c3QgYmUgYSBtYXAgb2Ygc3RyaW5ncyBvciB0cmFuc2xhdGlvbiBmdW5jdGlvbnNcbiAgICAgICAgICBsZXQgY3VzdG9tTWVzc2FnZSA9IGNvbmZpZy5tZXNzYWdlc1tldmVudC5jb2RlXTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgY3VzdG9tTWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBjdXN0b21NZXNzYWdlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUaGUgbWVzc2FnZSBpcyBhIHRyYW5zbGF0aW9uIGZ1bmN0aW9uLCBzbyB3ZSBjYWxsIGl0XG4gICAgICAgICAgICBtZXNzYWdlID0gY3VzdG9tTWVzc2FnZShldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZXJyb3JMYWJlbC5zZXRUZXh0KG1lc3NhZ2UpO1xuICAgICAgdGhpcy50dk5vaXNlQmFja2dyb3VuZC5zdGFydCgpO1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfTE9BREVELCAoZXZlbnQ6IFBsYXllckV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgdGhpcy50dk5vaXNlQmFja2dyb3VuZC5zdG9wKCk7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIHBsYXllciBiZXR3ZWVuIHdpbmRvd2VkIGFuZCBmdWxsc2NyZWVuIHZpZXcuXG4gKi9cbmV4cG9ydCBjbGFzcyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1mdWxsc2NyZWVudG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdGdWxsc2NyZWVuJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgZnVsbHNjcmVlblN0YXRlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNGdWxsc2NyZWVuKCkpIHtcbiAgICAgICAgdGhpcy5vbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vZmYoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fRlVMTFNDUkVFTl9FTlRFUiwgZnVsbHNjcmVlblN0YXRlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fRlVMTFNDUkVFTl9FWElULCBmdWxsc2NyZWVuU3RhdGVIYW5kbGVyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0Z1bGxzY3JlZW4oKSkge1xuICAgICAgICBwbGF5ZXIuZXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5lbnRlckZ1bGxzY3JlZW4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFN0YXJ0dXAgaW5pdFxuICAgIGZ1bGxzY3JlZW5TdGF0ZUhhbmRsZXIoKTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uQ29uZmlnfSBmcm9tICcuL3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlQnV0dG9ufSBmcm9tICcuL3BsYXliYWNrdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJFdmVudDtcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IG92ZXJsYXlzIHRoZSB2aWRlbyBhbmQgdG9nZ2xlcyBiZXR3ZWVuIHBsYXliYWNrIGFuZCBwYXVzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEh1Z2VQbGF5YmFja1RvZ2dsZUJ1dHRvbiBleHRlbmRzIFBsYXliYWNrVG9nZ2xlQnV0dG9uIHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktaHVnZXBsYXliYWNrdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdQbGF5L1BhdXNlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIC8vIFVwZGF0ZSBidXR0b24gc3RhdGUgdGhyb3VnaCBBUEkgZXZlbnRzXG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyLCBmYWxzZSk7XG5cbiAgICBsZXQgdG9nZ2xlUGxheWJhY2sgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzUGxheWluZygpKSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmRpc3BhdGNoU21hc2hjdXRQbGF5ZXJVaUV2ZW50KHthY3Rpb246ICdwYXVzZScsIG9yaWdpbmF0b3I6ICdIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24nfSlcbiAgICAgICAgcGxheWVyLnBhdXNlKCd1aS1vdmVybGF5Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7YWN0aW9uOiAncGxheScsIG9yaWdpbmF0b3I6ICdIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24nfSlcbiAgICAgICAgcGxheWVyLnBsYXkoJ3VpLW92ZXJsYXknKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHRvZ2dsZUZ1bGxzY3JlZW4gPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICAgIHBsYXllci5leGl0RnVsbHNjcmVlbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLmVudGVyRnVsbHNjcmVlbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgZmlyc3RQbGF5ID0gdHJ1ZTtcbiAgICBsZXQgY2xpY2tUaW1lID0gMDtcbiAgICBsZXQgZG91YmxlQ2xpY2tUaW1lID0gMDtcblxuICAgIC8qXG4gICAgICogWW91VHViZS1zdHlsZSB0b2dnbGUgYnV0dG9uIGhhbmRsaW5nXG4gICAgICpcbiAgICAgKiBUaGUgZ29hbCBpcyB0byBwcmV2ZW50IGEgc2hvcnQgcGF1c2Ugb3IgcGxheWJhY2sgaW50ZXJ2YWwgYmV0d2VlbiBhIGNsaWNrLCB0aGF0IHRvZ2dsZXMgcGxheWJhY2ssIGFuZCBhXG4gICAgICogZG91YmxlIGNsaWNrLCB0aGF0IHRvZ2dsZXMgZnVsbHNjcmVlbi4gSW4gdGhpcyBuYWl2ZSBhcHByb2FjaCwgdGhlIGZpcnN0IGNsaWNrIHdvdWxkIGUuZy4gc3RhcnQgcGxheWJhY2ssXG4gICAgICogdGhlIHNlY29uZCBjbGljayB3b3VsZCBiZSBkZXRlY3RlZCBhcyBkb3VibGUgY2xpY2sgYW5kIHRvZ2dsZSB0byBmdWxsc2NyZWVuLCBhbmQgYXMgc2Vjb25kIG5vcm1hbCBjbGljayBzdG9wXG4gICAgICogcGxheWJhY2ssIHdoaWNoIHJlc3VsdHMgaXMgYSBzaG9ydCBwbGF5YmFjayBpbnRlcnZhbCB3aXRoIG1heCBsZW5ndGggb2YgdGhlIGRvdWJsZSBjbGljayBkZXRlY3Rpb25cbiAgICAgKiBwZXJpb2QgKHVzdWFsbHkgNTAwbXMpLlxuICAgICAqXG4gICAgICogVG8gc29sdmUgdGhpcyBpc3N1ZSwgd2UgZGVmZXIgaGFuZGxpbmcgb2YgdGhlIGZpcnN0IGNsaWNrIGZvciAyMDBtcywgd2hpY2ggaXMgYWxtb3N0IHVubm90aWNlYWJsZSB0byB0aGUgdXNlcixcbiAgICAgKiBhbmQganVzdCB0b2dnbGUgcGxheWJhY2sgaWYgbm8gc2Vjb25kIGNsaWNrIChkb3VibGUgY2xpY2spIGhhcyBiZWVuIHJlZ2lzdGVyZWQgZHVyaW5nIHRoaXMgcGVyaW9kLiBJZiBhIGRvdWJsZVxuICAgICAqIGNsaWNrIGlzIHJlZ2lzdGVyZWQsIHdlIGp1c3QgdG9nZ2xlIHRoZSBmdWxsc2NyZWVuLiBJbiB0aGUgZmlyc3QgMjAwbXMsIHVuZGVzaXJlZCBwbGF5YmFjayBjaGFuZ2VzIHRodXMgY2Fubm90XG4gICAgICogaGFwcGVuLiBJZiBhIGRvdWJsZSBjbGljayBpcyByZWdpc3RlcmVkIHdpdGhpbiA1MDBtcywgd2UgdW5kbyB0aGUgcGxheWJhY2sgY2hhbmdlIGFuZCBzd2l0Y2ggZnVsbHNjcmVlbiBtb2RlLlxuICAgICAqIEluIHRoZSBlbmQsIHRoaXMgbWV0aG9kIGJhc2ljYWxseSBpbnRyb2R1Y2VzIGEgMjAwbXMgb2JzZXJ2aW5nIGludGVydmFsIGluIHdoaWNoIHBsYXliYWNrIGNoYW5nZXMgYXJlIHByZXZlbnRlZFxuICAgICAqIGlmIGEgZG91YmxlIGNsaWNrIGhhcHBlbnMuXG4gICAgICovXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBEaXJlY3RseSBzdGFydCBwbGF5YmFjayBvbiBmaXJzdCBjbGljayBvZiB0aGUgYnV0dG9uLlxuICAgICAgLy8gVGhpcyBpcyBhIHJlcXVpcmVkIHdvcmthcm91bmQgZm9yIG1vYmlsZSBicm93c2VycyB3aGVyZSB2aWRlbyBwbGF5YmFjayBuZWVkcyB0byBiZSB0cmlnZ2VyZWQgZGlyZWN0bHlcbiAgICAgIC8vIGJ5IHRoZSB1c2VyLiBBIGRlZmVycmVkIHBsYXliYWNrIHN0YXJ0IHRocm91Z2ggdGhlIHRpbWVvdXQgYmVsb3cgaXMgbm90IGNvbnNpZGVyZWQgYXMgdXNlciBhY3Rpb24gYW5kXG4gICAgICAvLyB0aGVyZWZvcmUgaWdub3JlZCBieSBtb2JpbGUgYnJvd3NlcnMuXG4gICAgICBpZiAoZmlyc3RQbGF5KSB7XG4gICAgICAgIC8vIFRyeSB0byBzdGFydCBwbGF5YmFjay4gVGhlbiB3ZSB3YWl0IGZvciBPTl9QTEFZIGFuZCBvbmx5IHdoZW4gaXQgYXJyaXZlcywgd2UgZGlzYWJsZSB0aGUgZmlyc3RQbGF5IGZsYWcuXG4gICAgICAgIC8vIElmIHdlIGRpc2FibGUgdGhlIGZsYWcgaGVyZSwgb25DbGljayB3YXMgdHJpZ2dlcmVkIHByb2dyYW1tYXRpY2FsbHkgaW5zdGVhZCBvZiBieSBhIHVzZXIgaW50ZXJhY3Rpb24sIGFuZFxuICAgICAgICAvLyBwbGF5YmFjayBpcyBibG9ja2VkIChlLmcuIG9uIG1vYmlsZSBkZXZpY2VzIGR1ZSB0byB0aGUgcHJvZ3JhbW1hdGljIHBsYXkoKSBjYWxsKSwgd2UgbG9vc2UgdGhlIGNoYW5jZSB0b1xuICAgICAgICAvLyBldmVyIHN0YXJ0IHBsYXliYWNrIHRocm91Z2ggYSB1c2VyIGludGVyYWN0aW9uIGFnYWluIHdpdGggdGhpcyBidXR0b24uXG4gICAgICAgIHRvZ2dsZVBsYXliYWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICAgIGlmIChub3cgLSBjbGlja1RpbWUgPCAyMDApIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBhIGRvdWJsZSBjbGljayBpbnNpZGUgdGhlIDIwMG1zIGludGVydmFsLCBqdXN0IHRvZ2dsZSBmdWxsc2NyZWVuIG1vZGVcbiAgICAgICAgdG9nZ2xlRnVsbHNjcmVlbigpO1xuICAgICAgICBkb3VibGVDbGlja1RpbWUgPSBub3c7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAobm93IC0gY2xpY2tUaW1lIDwgNTAwKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgYSBkb3VibGUgY2xpY2sgaW5zaWRlIHRoZSA1MDBtcyBpbnRlcnZhbCwgdW5kbyBwbGF5YmFjayB0b2dnbGUgYW5kIHRvZ2dsZSBmdWxsc2NyZWVuIG1vZGVcbiAgICAgICAgdG9nZ2xlRnVsbHNjcmVlbigpO1xuICAgICAgICB0b2dnbGVQbGF5YmFjaygpO1xuICAgICAgICBkb3VibGVDbGlja1RpbWUgPSBub3c7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY2xpY2tUaW1lID0gbm93O1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSBkb3VibGVDbGlja1RpbWUgPiAyMDApIHtcbiAgICAgICAgICAvLyBObyBkb3VibGUgY2xpY2sgZGV0ZWN0ZWQsIHNvIHdlIHRvZ2dsZSBwbGF5YmFjayBhbmQgd2FpdCB3aGF0IGhhcHBlbnMgbmV4dFxuICAgICAgICAgIHRvZ2dsZVBsYXliYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDIwMCk7XG4gICAgfSk7XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCAoKSA9PiB7XG4gICAgICAvLyBQbGF5YmFjayBoYXMgcmVhbGx5IHN0YXJ0ZWQsIHdlIGNhbiBkaXNhYmxlIHRoZSBmbGFnIHRvIHN3aXRjaCB0byBub3JtYWwgdG9nZ2xlIGJ1dHRvbiBoYW5kbGluZ1xuICAgICAgZmlyc3RQbGF5ID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBIaWRlIGJ1dHRvbiB3aGlsZSBpbml0aWFsaXppbmcgYSBDYXN0IHNlc3Npb25cbiAgICBsZXQgY2FzdEluaXRpYWxpemF0aW9uSGFuZGxlciA9IChldmVudDogUGxheWVyRXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSBwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVEFSVCkge1xuICAgICAgICAvLyBIaWRlIGJ1dHRvbiB3aGVuIHNlc3Npb24gaXMgYmVpbmcgaW5pdGlhbGl6ZWRcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTaG93IGJ1dHRvbiB3aGVuIHNlc3Npb24gaXMgZXN0YWJsaXNoZWQgb3IgaW5pdGlhbGl6YXRpb24gd2FzIGFib3J0ZWRcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJULCBjYXN0SW5pdGlhbGl6YXRpb25IYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsIGNhc3RJbml0aWFsaXphdGlvbkhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RPUFBFRCwgY2FzdEluaXRpYWxpemF0aW9uSGFuZGxlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGJ1dHRvbkVsZW1lbnQgPSBzdXBlci50b0RvbUVsZW1lbnQoKTtcblxuICAgIC8vIEFkZCBjaGlsZCB0aGF0IGNvbnRhaW5zIHRoZSBwbGF5IGJ1dHRvbiBpbWFnZVxuICAgIC8vIFNldHRpbmcgdGhlIGltYWdlIGRpcmVjdGx5IG9uIHRoZSBidXR0b24gZG9lcyBub3Qgd29yayB0b2dldGhlciB3aXRoIHNjYWxpbmcgYW5pbWF0aW9ucywgYmVjYXVzZSB0aGUgYnV0dG9uXG4gICAgLy8gY2FuIGNvdmVyIHRoZSB3aG9sZSB2aWRlbyBwbGF5ZXIgYXJlIGFuZCBzY2FsaW5nIHdvdWxkIGV4dGVuZCBpdCBiZXlvbmQuIEJ5IGFkZGluZyBhbiBpbm5lciBlbGVtZW50LCBjb25maW5lZFxuICAgIC8vIHRvIHRoZSBzaXplIGlmIHRoZSBpbWFnZSwgaXQgY2FuIHNjYWxlIGluc2lkZSB0aGUgcGxheWVyIHdpdGhvdXQgb3ZlcnNob290aW5nLlxuICAgIGJ1dHRvbkVsZW1lbnQuYXBwZW5kKG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdpbWFnZScpXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIGJ1dHRvbkVsZW1lbnQ7XG4gIH1cbn0iLCJpbXBvcnQge0J1dHRvbkNvbmZpZywgQnV0dG9ufSBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5cbi8qKlxuICogQSBidXR0b24gdG8gcGxheS9yZXBsYXkgYSB2aWRlby5cbiAqL1xuZXhwb3J0IGNsYXNzIEh1Z2VSZXBsYXlCdXR0b24gZXh0ZW5kcyBCdXR0b248QnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLWh1Z2VyZXBsYXlidXR0b24nLFxuICAgICAgdGV4dDogJ1JlcGxheSdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBwbGF5ZXIucGxheSgndWktb3ZlcmxheScpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRvRG9tRWxlbWVudCgpOiBET00ge1xuICAgIGxldCBidXR0b25FbGVtZW50ID0gc3VwZXIudG9Eb21FbGVtZW50KCk7XG5cbiAgICAvLyBBZGQgY2hpbGQgdGhhdCBjb250YWlucyB0aGUgcGxheSBidXR0b24gaW1hZ2VcbiAgICAvLyBTZXR0aW5nIHRoZSBpbWFnZSBkaXJlY3RseSBvbiB0aGUgYnV0dG9uIGRvZXMgbm90IHdvcmsgdG9nZXRoZXIgd2l0aCBzY2FsaW5nIGFuaW1hdGlvbnMsIGJlY2F1c2UgdGhlIGJ1dHRvblxuICAgIC8vIGNhbiBjb3ZlciB0aGUgd2hvbGUgdmlkZW8gcGxheWVyIGFyZSBhbmQgc2NhbGluZyB3b3VsZCBleHRlbmQgaXQgYmV5b25kLiBCeSBhZGRpbmcgYW4gaW5uZXIgZWxlbWVudCwgY29uZmluZWRcbiAgICAvLyB0byB0aGUgc2l6ZSBpZiB0aGUgaW1hZ2UsIGl0IGNhbiBzY2FsZSBpbnNpZGUgdGhlIHBsYXllciB3aXRob3V0IG92ZXJzaG9vdGluZy5cbiAgICBidXR0b25FbGVtZW50LmFwcGVuZChuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnaW1hZ2UnKVxuICAgIH0pKTtcblxuICAgIHJldHVybiBidXR0b25FbGVtZW50O1xuICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnRDb25maWcsIENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgRXZlbnQsIE5vQXJnc30gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgTGFiZWx9IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYWJlbENvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdGV4dCBvbiB0aGUgbGFiZWwuXG4gICAqL1xuICB0ZXh0Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgc2ltcGxlIHRleHQgbGFiZWwuXG4gKlxuICogRE9NIGV4YW1wbGU6XG4gKiA8Y29kZT5cbiAqICAgICA8c3BhbiBjbGFzcz0ndWktbGFiZWwnPi4uLnNvbWUgdGV4dC4uLjwvc3Bhbj5cbiAqIDwvY29kZT5cbiAqL1xuZXhwb3J0IGNsYXNzIExhYmVsPENvbmZpZyBleHRlbmRzIExhYmVsQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxMYWJlbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgdGV4dDogc3RyaW5nO1xuXG4gIHByaXZhdGUgbGFiZWxFdmVudHMgPSB7XG4gICAgb25DbGljazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMYWJlbDxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25UZXh0Q2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMYWJlbDxDb25maWc+LCBzdHJpbmc+KCksXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktbGFiZWwnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuXG4gICAgdGhpcy50ZXh0ID0gdGhpcy5jb25maWcudGV4dDtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBsZXQgbGFiZWxFbGVtZW50ID0gbmV3IERPTSgnc3BhbicsIHtcbiAgICAgICdpZCc6IHRoaXMuY29uZmlnLmlkLFxuICAgICAgJ2NsYXNzJzogdGhpcy5nZXRDc3NDbGFzc2VzKClcbiAgICB9KS5odG1sKHRoaXMudGV4dCk7XG5cbiAgICBsYWJlbEVsZW1lbnQub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5vbkNsaWNrRXZlbnQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsYWJlbEVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSB0ZXh0IG9uIHRoaXMgbGFiZWwuXG4gICAqIEBwYXJhbSB0ZXh0XG4gICAqL1xuICBzZXRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy5nZXREb21FbGVtZW50KCkuaHRtbCh0ZXh0KTtcbiAgICB0aGlzLm9uVGV4dENoYW5nZWRFdmVudCh0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB0ZXh0IG9uIHRoaXMgbGFiZWwuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRleHQgb24gdGhlIGxhYmVsXG4gICAqL1xuICBnZXRUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIHRleHQgb24gdGhpcyBsYWJlbC5cbiAgICovXG4gIGNsZWFyVGV4dCgpIHtcbiAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5odG1sKCcnKTtcbiAgICB0aGlzLm9uVGV4dENoYW5nZWRFdmVudChudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiB0aGUgbGFiZWwgaXMgZW1wdHkgYW5kIGRvZXMgbm90IGNvbnRhaW4gYW55IHRleHQuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIGxhYmVsIGlzIGVtcHR5LCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy50ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSB7QGxpbmsgI29uQ2xpY2t9IGV2ZW50LlxuICAgKiBDYW4gYmUgdXNlZCBieSBzdWJjbGFzc2VzIHRvIGxpc3RlbiB0byB0aGlzIGV2ZW50IHdpdGhvdXQgc3Vic2NyaWJpbmcgYW4gZXZlbnQgbGlzdGVuZXIgYnkgb3ZlcndyaXRpbmcgdGhlIG1ldGhvZFxuICAgKiBhbmQgY2FsbGluZyB0aGUgc3VwZXIgbWV0aG9kLlxuICAgKi9cbiAgcHJvdGVjdGVkIG9uQ2xpY2tFdmVudCgpIHtcbiAgICB0aGlzLmxhYmVsRXZlbnRzLm9uQ2xpY2suZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgdGhlIHtAbGluayAjb25DbGlja30gZXZlbnQuXG4gICAqIENhbiBiZSB1c2VkIGJ5IHN1YmNsYXNzZXMgdG8gbGlzdGVuIHRvIHRoaXMgZXZlbnQgd2l0aG91dCBzdWJzY3JpYmluZyBhbiBldmVudCBsaXN0ZW5lciBieSBvdmVyd3JpdGluZyB0aGUgbWV0aG9kXG4gICAqIGFuZCBjYWxsaW5nIHRoZSBzdXBlciBtZXRob2QuXG4gICAqL1xuICBwcm90ZWN0ZWQgb25UZXh0Q2hhbmdlZEV2ZW50KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMubGFiZWxFdmVudHMub25UZXh0Q2hhbmdlZC5kaXNwYXRjaCh0aGlzLCB0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGxhYmVsIGlzIGNsaWNrZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25DbGljaygpOiBFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmxhYmVsRXZlbnRzLm9uQ2xpY2suZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIHRleHQgb24gdGhlIGxhYmVsIGlzIGNoYW5nZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25UZXh0Q2hhbmdlZCgpOiBFdmVudDxMYWJlbDxMYWJlbENvbmZpZz4sIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmxhYmVsRXZlbnRzLm9uVGV4dENoYW5nZWQuZ2V0RXZlbnQoKTtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCB7QXJyYXlVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIEEgbWFwIG9mIGl0ZW1zIChrZXkvdmFsdWUgLT4gbGFiZWx9IGZvciBhIHtAbGluayBMaXN0U2VsZWN0b3J9IGluIGEge0BsaW5rIExpc3RTZWxlY3RvckNvbmZpZ30uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdEl0ZW0ge1xuICBrZXk6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgTGlzdFNlbGVjdG9yfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaXN0U2VsZWN0b3JDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICBpdGVtcz86IExpc3RJdGVtW107XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMaXN0U2VsZWN0b3I8Q29uZmlnIGV4dGVuZHMgTGlzdFNlbGVjdG9yQ29uZmlnPiBleHRlbmRzIENvbXBvbmVudDxMaXN0U2VsZWN0b3JDb25maWc+IHtcblxuICBwcm90ZWN0ZWQgaXRlbXM6IExpc3RJdGVtW107XG4gIHByb3RlY3RlZCBzZWxlY3RlZEl0ZW06IHN0cmluZztcblxuICBwcml2YXRlIGxpc3RTZWxlY3RvckV2ZW50cyA9IHtcbiAgICBvbkl0ZW1BZGRlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPigpLFxuICAgIG9uSXRlbVJlbW92ZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4oKSxcbiAgICBvbkl0ZW1TZWxlY3RlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPigpXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMaXN0U2VsZWN0b3JDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBpdGVtczogW10sXG4gICAgICBjc3NDbGFzczogJ3VpLWxpc3RzZWxlY3RvcidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG5cbiAgICB0aGlzLml0ZW1zID0gdGhpcy5jb25maWcuaXRlbXM7XG4gIH1cblxuICBwcml2YXRlIGdldEl0ZW1JbmRleChrZXk6IHN0cmluZyk6IG51bWJlciB7XG4gICAgZm9yIChsZXQgaW5kZXggaW4gdGhpcy5pdGVtcykge1xuICAgICAgaWYgKGtleSA9PT0gdGhpcy5pdGVtc1tpbmRleF0ua2V5KSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChpbmRleCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCBpdGVtIGlzIHBhcnQgb2YgdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIGNoZWNrXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBpdGVtIGlzIHBhcnQgb2YgdGhpcyBzZWxlY3RvciwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaGFzSXRlbShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW1JbmRleChrZXkpID4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpdGVtIHRvIHRoaXMgc2VsZWN0b3IgYnkgYXBwZW5kaW5nIGl0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgaXRlbXMuIElmIGFuIGl0ZW0gd2l0aCB0aGUgc3BlY2lmaWVkXG4gICAqIGtleSBhbHJlYWR5IGV4aXN0cywgaXQgaXMgcmVwbGFjZWQuXG4gICAqIEBwYXJhbSBrZXkgdGhlIGtleSBvZiB0aGUgaXRlbSB0byBhZGRcbiAgICogQHBhcmFtIGxhYmVsIHRoZSAoaHVtYW4tcmVhZGFibGUpIGxhYmVsIG9mIHRoZSBpdGVtIHRvIGFkZFxuICAgKi9cbiAgYWRkSXRlbShrZXk6IHN0cmluZywgbGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMucmVtb3ZlSXRlbShrZXkpOyAvLyBUcnkgdG8gcmVtb3ZlIGtleSBmaXJzdCB0byBnZXQgb3ZlcndyaXRlIGJlaGF2aW9yIGFuZCBhdm9pZCBkdXBsaWNhdGUga2V5c1xuICAgIHRoaXMuaXRlbXMucHVzaCh7IGtleToga2V5LCBsYWJlbDogbGFiZWwgfSk7XG4gICAgdGhpcy5vbkl0ZW1BZGRlZEV2ZW50KGtleSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiByZW1vdmFsIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBpZiB0aGUgaXRlbSBpcyBub3QgcGFydCBvZiB0aGlzIHNlbGVjdG9yXG4gICAqL1xuICByZW1vdmVJdGVtKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoa2V5KTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgQXJyYXlVdGlscy5yZW1vdmUodGhpcy5pdGVtcywgdGhpcy5pdGVtc1tpbmRleF0pO1xuICAgICAgdGhpcy5vbkl0ZW1SZW1vdmVkRXZlbnQoa2V5KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGFuIGl0ZW0gZnJvbSB0aGUgaXRlbXMgaW4gdGhpcyBzZWxlY3Rvci5cbiAgICogQHBhcmFtIGtleSB0aGUga2V5IG9mIHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpcyB0aGUgc2VsZWN0aW9uIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBpZiB0aGUgc2VsZWN0ZWQgaXRlbSBpcyBub3QgcGFydCBvZiB0aGUgc2VsZWN0b3JcbiAgICovXG4gIHNlbGVjdEl0ZW0oa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoa2V5ID09PSB0aGlzLnNlbGVjdGVkSXRlbSkge1xuICAgICAgLy8gaXRlbUNvbmZpZyBpcyBhbHJlYWR5IHNlbGVjdGVkLCBzdXBwcmVzcyBhbnkgZnVydGhlciBhY3Rpb25cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGtleSk7XG5cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSBrZXk7XG4gICAgICB0aGlzLm9uSXRlbVNlbGVjdGVkRXZlbnQoa2V5KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBrZXkgb2YgdGhlIHNlbGVjdGVkIGl0ZW0uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBrZXkgb2YgdGhlIHNlbGVjdGVkIGl0ZW0gb3IgbnVsbCBpZiBubyBpdGVtIGlzIHNlbGVjdGVkXG4gICAqL1xuICBnZXRTZWxlY3RlZEl0ZW0oKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGl0ZW1zIGZyb20gdGhpcyBzZWxlY3Rvci5cbiAgICovXG4gIGNsZWFySXRlbXMoKSB7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtczsgLy8gbG9jYWwgY29weSBmb3IgaXRlcmF0aW9uIGFmdGVyIGNsZWFyXG4gICAgdGhpcy5pdGVtcyA9IFtdOyAvLyBjbGVhciBpdGVtc1xuXG4gICAgLy8gZmlyZSBldmVudHNcbiAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICB0aGlzLm9uSXRlbVJlbW92ZWRFdmVudChpdGVtLmtleSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGlzIHNlbGVjdG9yLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgaXRlbUNvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpLmxlbmd0aDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1BZGRlZEV2ZW50KGtleTogc3RyaW5nKSB7XG4gICAgdGhpcy5saXN0U2VsZWN0b3JFdmVudHMub25JdGVtQWRkZWQuZGlzcGF0Y2godGhpcywga2V5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1SZW1vdmVkRXZlbnQoa2V5OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1SZW1vdmVkLmRpc3BhdGNoKHRoaXMsIGtleSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtU2VsZWN0ZWRFdmVudChrZXk6IHN0cmluZykge1xuICAgIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbVNlbGVjdGVkLmRpc3BhdGNoKHRoaXMsIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGFuIGl0ZW0gaXMgYWRkZWQgdG8gdGhlIGxpc3Qgb2YgaXRlbXMuXG4gICAqIEByZXR1cm5zIHtFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPn1cbiAgICovXG4gIGdldCBvbkl0ZW1BZGRlZCgpOiBFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbUFkZGVkLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIGFuIGl0ZW0gaXMgcmVtb3ZlZCBmcm9tIHRoZSBsaXN0IG9mIGl0ZW1zLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25JdGVtUmVtb3ZlZCgpOiBFdmVudDxMaXN0U2VsZWN0b3I8Q29uZmlnPiwgc3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFNlbGVjdG9yRXZlbnRzLm9uSXRlbVJlbW92ZWQuZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gYW4gaXRlbSBpcyBzZWxlY3RlZCBmcm9tIHRoZSBsaXN0IG9mIGl0ZW1zLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz59XG4gICAqL1xuICBnZXQgb25JdGVtU2VsZWN0ZWQoKTogRXZlbnQ8TGlzdFNlbGVjdG9yPENvbmZpZz4sIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmxpc3RTZWxlY3RvckV2ZW50cy5vbkl0ZW1TZWxlY3RlZC5nZXRFdmVudCgpO1xuICB9XG59IiwiaW1wb3J0IHtMYWJlbENvbmZpZywgTGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBFbnVtZXJhdGVzIHRoZSB0eXBlcyBvZiBjb250ZW50IHRoYXQgdGhlIHtAbGluayBNZXRhZGF0YUxhYmVsfSBjYW4gZGlzcGxheS5cbiAqL1xuZXhwb3J0IGVudW0gTWV0YWRhdGFMYWJlbENvbnRlbnQge1xuICAvKipcbiAgICogVGl0bGUgb2YgdGhlIGRhdGEgc291cmNlLlxuICAgKi9cbiAgVGl0bGUsXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBmbyB0aGUgZGF0YSBzb3VyY2UuXG4gICAqL1xuICBEZXNjcmlwdGlvbixcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3Ige0BsaW5rIE1ldGFkYXRhTGFiZWx9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldGFkYXRhTGFiZWxDb25maWcgZXh0ZW5kcyBMYWJlbENvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBjb250ZW50IHRoYXQgc2hvdWxkIGJlIGRpc3BsYXllZCBpbiB0aGUgbGFiZWwuXG4gICAqL1xuICBjb250ZW50OiBNZXRhZGF0YUxhYmVsQ29udGVudDtcbn1cblxuLyoqXG4gKiBBIGxhYmVsIHRoYXQgY2FuIGJlIGNvbmZpZ3VyZWQgdG8gZGlzcGxheSBjZXJ0YWluIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY2xhc3MgTWV0YWRhdGFMYWJlbCBleHRlbmRzIExhYmVsPE1ldGFkYXRhTGFiZWxDb25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE1ldGFkYXRhTGFiZWxDb25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3NlczogWydsYWJlbC1tZXRhZGF0YScsICdsYWJlbC1tZXRhZGF0YS0nICsgTWV0YWRhdGFMYWJlbENvbnRlbnRbY29uZmlnLmNvbnRlbnRdLnRvTG93ZXJDYXNlKCldXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8TWV0YWRhdGFMYWJlbENvbmZpZz50aGlzLmdldENvbmZpZygpO1xuICAgIGxldCB1aWNvbmZpZyA9IHVpbWFuYWdlci5nZXRDb25maWcoKTtcblxuICAgIGxldCBpbml0ID0gKCkgPT4ge1xuICAgICAgc3dpdGNoIChjb25maWcuY29udGVudCkge1xuICAgICAgICBjYXNlIE1ldGFkYXRhTGFiZWxDb250ZW50LlRpdGxlOlxuICAgICAgICAgIGlmICh1aWNvbmZpZyAmJiB1aWNvbmZpZy5tZXRhZGF0YSAmJiB1aWNvbmZpZy5tZXRhZGF0YS50aXRsZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0KHVpY29uZmlnLm1ldGFkYXRhLnRpdGxlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UgJiYgcGxheWVyLmdldENvbmZpZygpLnNvdXJjZS50aXRsZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0KHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UudGl0bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBNZXRhZGF0YUxhYmVsQ29udGVudC5EZXNjcmlwdGlvbjpcbiAgICAgICAgICBpZiAodWljb25maWcgJiYgdWljb25maWcubWV0YWRhdGEgJiYgdWljb25maWcubWV0YWRhdGEuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dCh1aWNvbmZpZy5tZXRhZGF0YS5kZXNjcmlwdGlvbik7XG4gICAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dChwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCB1bmxvYWQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnNldFRleHQobnVsbCk7XG4gICAgfTtcblxuICAgIC8vIEluaXQgbGFiZWxcbiAgICBpbml0KCk7XG4gICAgLy8gUmVpbml0IGxhYmVsIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9MT0FERUQsIGluaXQpO1xuICAgIC8vIENsZWFyIGxhYmVscyB3aGVuIHNvdXJjZSBpcyB1bmxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NPVVJDRV9VTkxPQURFRCwgdW5sb2FkKTtcbiAgfVxufSIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBidXR0b24gdGhhdCB0b2dnbGVzIEFwcGxlIG1hY09TIHBpY3R1cmUtaW4tcGljdHVyZSBtb2RlLlxuICovXG5leHBvcnQgY2xhc3MgUGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbiBleHRlbmRzIFRvZ2dsZUJ1dHRvbjxUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvZ2dsZUJ1dHRvbkNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktcGlwdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdQaWN0dXJlLWluLVBpY3R1cmUnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGlmICghcGxheWVyLmlzUGljdHVyZUluUGljdHVyZUF2YWlsYWJsZSkge1xuICAgICAgLy8gSWYgdGhlIHBsYXllciBkb2VzIG5vdCBzdXBwb3J0IFBJUCAocGxheWVyIDcuMCksIHdlIGp1c3QgaGlkZSB0aGlzIGNvbXBvbmVudCBhbmQgc2tpcCBjb25maWd1cmF0aW9uXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNQaWN0dXJlSW5QaWN0dXJlQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgaWYgKHBsYXllci5pc1BpY3R1cmVJblBpY3R1cmUoKSkge1xuICAgICAgICAgIHBsYXllci5leGl0UGljdHVyZUluUGljdHVyZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYXllci5lbnRlclBpY3R1cmVJblBpY3R1cmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUElQIHVuYXZhaWxhYmxlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBwaXBBdmFpbGFibGVIYW5kZXIgPSAoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzUGljdHVyZUluUGljdHVyZUF2YWlsYWJsZSgpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBwaXBBdmFpbGFibGVIYW5kZXIpO1xuXG4gICAgLy8gVG9nZ2xlIGJ1dHRvbiAnb24nIHN0YXRlXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUElDVFVSRV9JTl9QSUNUVVJFX0VOVEVSLCAoKSA9PiB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUElDVFVSRV9JTl9QSUNUVVJFX0VYSVQsICgpID0+IHtcbiAgICAgIHRoaXMub2ZmKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBwaXBBdmFpbGFibGVIYW5kZXIoKTsgLy8gSGlkZSBidXR0b24gaWYgUElQIG5vdCBhdmFpbGFibGVcbiAgICBpZiAocGxheWVyLmlzUGljdHVyZUluUGljdHVyZSgpKSB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtTZWxlY3RCb3h9IGZyb20gJy4vc2VsZWN0Ym94JztcbmltcG9ydCB7TGlzdFNlbGVjdG9yQ29uZmlnfSBmcm9tICcuL2xpc3RzZWxlY3Rvcic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuXG4vKipcbiAqIEEgc2VsZWN0IGJveCBwcm92aWRpbmcgYSBzZWxlY3Rpb24gb2YgZGlmZmVyZW50IHBsYXliYWNrIHNwZWVkcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXliYWNrU3BlZWRTZWxlY3RCb3ggZXh0ZW5kcyBTZWxlY3RCb3gge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIHRoaXMuYWRkSXRlbSgnMC4yNScsICcwLjI1eCcpO1xuICAgIHRoaXMuYWRkSXRlbSgnMC41JywgJzAuNXgnKTtcbiAgICB0aGlzLmFkZEl0ZW0oJzEnLCAnTm9ybWFsJyk7XG4gICAgdGhpcy5hZGRJdGVtKCcxLjUnLCAnMS41eCcpO1xuICAgIHRoaXMuYWRkSXRlbSgnMicsICcyeCcpO1xuXG4gICAgdGhpcy5zZWxlY3RJdGVtKCcxJyk7XG5cblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IFBsYXliYWNrU3BlZWRTZWxlY3RCb3gsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHBsYXllci5zZXRQbGF5YmFja1NwZWVkKHBhcnNlRmxvYXQodmFsdWUpKTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7TGFiZWxDb25maWcsIExhYmVsfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1N0cmluZ1V0aWxzLCBQbGF5ZXJVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IExpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncyA9IFBsYXllclV0aWxzLkxpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncztcblxuZXhwb3J0IGVudW0gUGxheWJhY2tUaW1lTGFiZWxNb2RlIHtcbiAgQ3VycmVudFRpbWUsXG4gIFRvdGFsVGltZSxcbiAgQ3VycmVudEFuZFRvdGFsVGltZSxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbGF5YmFja1RpbWVMYWJlbENvbmZpZyBleHRlbmRzIExhYmVsQ29uZmlnIHtcbiAgdGltZUxhYmVsTW9kZT86IFBsYXliYWNrVGltZUxhYmVsTW9kZTtcbiAgaGlkZUluTGl2ZVBsYXliYWNrPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGxhYmVsIHRoYXQgZGlzcGxheSB0aGUgY3VycmVudCBwbGF5YmFjayB0aW1lIGFuZCB0aGUgdG90YWwgdGltZSB0aHJvdWdoIHtAbGluayBQbGF5YmFja1RpbWVMYWJlbCNzZXRUaW1lIHNldFRpbWV9XG4gKiBvciBhbnkgc3RyaW5nIHRocm91Z2gge0BsaW5rIFBsYXliYWNrVGltZUxhYmVsI3NldFRleHQgc2V0VGltZVRleHR9LlxuICovXG5leHBvcnQgY2xhc3MgUGxheWJhY2tUaW1lTGFiZWwgZXh0ZW5kcyBMYWJlbDxQbGF5YmFja1RpbWVMYWJlbENvbmZpZz4ge1xuXG4gIHByaXZhdGUgdGltZUZvcm1hdDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogUGxheWJhY2tUaW1lTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCA8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+e1xuICAgICAgY3NzQ2xhc3M6ICd1aS1wbGF5YmFja3RpbWVsYWJlbCcsXG4gICAgICB0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudEFuZFRvdGFsVGltZSxcbiAgICAgIGhpZGVJbkxpdmVQbGF5YmFjazogZmFsc2UsXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+dGhpcy5nZXRDb25maWcoKTtcbiAgICBsZXQgbGl2ZSA9IGZhbHNlO1xuICAgIGxldCBsaXZlQ3NzQ2xhc3MgPSB0aGlzLnByZWZpeENzcygndWktcGxheWJhY2t0aW1lbGFiZWwtbGl2ZScpO1xuICAgIGxldCBsaXZlRWRnZUNzc0NsYXNzID0gdGhpcy5wcmVmaXhDc3MoJ3VpLXBsYXliYWNrdGltZWxhYmVsLWxpdmUtZWRnZScpO1xuICAgIGxldCBtaW5XaWR0aCA9IDA7XG5cbiAgICBsZXQgbGl2ZUNsaWNrSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHBsYXllci50aW1lU2hpZnQoMCk7XG4gICAgfTtcblxuICAgIGxldCB1cGRhdGVMaXZlU3RhdGUgPSAoKSA9PiB7XG4gICAgICAvLyBQbGF5ZXIgaXMgcGxheWluZyBhIGxpdmUgc3RyZWFtIHdoZW4gdGhlIGR1cmF0aW9uIGlzIGluZmluaXRlXG4gICAgICBsaXZlID0gcGxheWVyLmlzTGl2ZSgpO1xuXG4gICAgICAvLyBBdHRhY2gvZGV0YWNoIGxpdmUgbWFya2VyIGNsYXNzXG4gICAgICBpZiAobGl2ZSkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyhsaXZlQ3NzQ2xhc3MpO1xuICAgICAgICB0aGlzLnNldFRleHQoJ0xpdmUnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5oaWRlSW5MaXZlUGxheWJhY2spIHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uQ2xpY2suc3Vic2NyaWJlKGxpdmVDbGlja0hhbmRsZXIpO1xuICAgICAgICB1cGRhdGVMaXZlVGltZXNoaWZ0U3RhdGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVDc3NDbGFzcyk7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVFZGdlQ3NzQ2xhc3MpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgdGhpcy5vbkNsaWNrLnVuc3Vic2NyaWJlKGxpdmVDbGlja0hhbmRsZXIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdXBkYXRlTGl2ZVRpbWVzaGlmdFN0YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKHBsYXllci5nZXRUaW1lU2hpZnQoKSA9PT0gMCkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyhsaXZlRWRnZUNzc0NsYXNzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKGxpdmVFZGdlQ3NzQ2xhc3MpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgbGl2ZVN0cmVhbURldGVjdG9yID0gbmV3IFBsYXllclV0aWxzLkxpdmVTdHJlYW1EZXRlY3RvcihwbGF5ZXIpO1xuICAgIGxpdmVTdHJlYW1EZXRlY3Rvci5vbkxpdmVDaGFuZ2VkLnN1YnNjcmliZSgoc2VuZGVyLCBhcmdzOiBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MpID0+IHtcbiAgICAgIGxpdmUgPSBhcmdzLmxpdmU7XG4gICAgICB1cGRhdGVMaXZlU3RhdGUoKTtcbiAgICB9KTtcbiAgICBsaXZlU3RyZWFtRGV0ZWN0b3IuZGV0ZWN0KCk7IC8vIEluaXRpYWwgZGV0ZWN0aW9uXG5cbiAgICBsZXQgcGxheWJhY2tUaW1lSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmICghbGl2ZSAmJiBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgdGhpcy5zZXRUaW1lKHBsYXllci5nZXRDdXJyZW50VGltZSgpLCBwbGF5ZXIuZ2V0RHVyYXRpb24oKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkICdqdW1waW5nJyBpbiB0aGUgVUkgYnkgdmFyeWluZyBsYWJlbCBzaXplcyBkdWUgdG8gbm9uLW1vbm9zcGFjZWQgZm9udHMsXG4gICAgICAvLyB3ZSBncmFkdWFsbHkgaW5jcmVhc2UgdGhlIG1pbi13aWR0aCB3aXRoIHRoZSBjb250ZW50IHRvIHJlYWNoIGEgc3RhYmxlIHNpemUuXG4gICAgICBsZXQgd2lkdGggPSB0aGlzLmdldERvbUVsZW1lbnQoKS53aWR0aCgpO1xuICAgICAgaWYgKHdpZHRoID4gbWluV2lkdGgpIHtcbiAgICAgICAgbWluV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgICAnbWluLXdpZHRoJzogbWluV2lkdGggKyAncHgnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX0NIQU5HRUQsIHBsYXliYWNrVGltZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgcGxheWJhY2tUaW1lSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9USU1FX1VQREFURUQsIHBsYXliYWNrVGltZUhhbmRsZXIpO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVCwgdXBkYXRlTGl2ZVRpbWVzaGlmdFN0YXRlKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZURUQsIHVwZGF0ZUxpdmVUaW1lc2hpZnRTdGF0ZSk7XG5cbiAgICBsZXQgaW5pdCA9ICgpID0+IHtcbiAgICAgIC8vIFJlc2V0IG1pbi13aWR0aCB3aGVuIGEgbmV3IHNvdXJjZSBpcyByZWFkeSAoZXNwZWNpYWxseSBmb3Igc3dpdGNoaW5nIFZPRC9MaXZlIG1vZGVzIHdoZXJlIHRoZSBsYWJlbCBjb250ZW50XG4gICAgICAvLyBjaGFuZ2VzKVxuICAgICAgbWluV2lkdGggPSAwO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgJ21pbi13aWR0aCc6IG51bGxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTZXQgdGltZSBmb3JtYXQgZGVwZW5kaW5nIG9uIHNvdXJjZSBkdXJhdGlvblxuICAgICAgdGhpcy50aW1lRm9ybWF0ID0gTWF0aC5hYnMocGxheWVyLmlzTGl2ZSgpID8gcGxheWVyLmdldE1heFRpbWVTaGlmdCgpIDogcGxheWVyLmdldER1cmF0aW9uKCkpID49IDM2MDAgP1xuICAgICAgICBTdHJpbmdVdGlscy5GT1JNQVRfSEhNTVNTIDogU3RyaW5nVXRpbHMuRk9STUFUX01NU1M7XG5cbiAgICAgIC8vIFVwZGF0ZSB0aW1lIGFmdGVyIHRoZSBmb3JtYXQgaGFzIGJlZW4gc2V0XG4gICAgICBwbGF5YmFja1RpbWVIYW5kbGVyKCk7XG4gICAgfTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgaW5pdCk7XG5cbiAgICBpbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY3VycmVudCBwbGF5YmFjayB0aW1lIGFuZCB0b3RhbCBkdXJhdGlvbi5cbiAgICogQHBhcmFtIHBsYXliYWNrU2Vjb25kcyB0aGUgY3VycmVudCBwbGF5YmFjayB0aW1lIGluIHNlY29uZHNcbiAgICogQHBhcmFtIGR1cmF0aW9uU2Vjb25kcyB0aGUgdG90YWwgZHVyYXRpb24gaW4gc2Vjb25kc1xuICAgKi9cbiAgc2V0VGltZShwbGF5YmFja1NlY29uZHM6IG51bWJlciwgZHVyYXRpb25TZWNvbmRzOiBudW1iZXIpIHtcbiAgICBsZXQgY3VycmVudFRpbWUgPSBTdHJpbmdVdGlscy5zZWNvbmRzVG9UaW1lKHBsYXliYWNrU2Vjb25kcywgdGhpcy50aW1lRm9ybWF0KTtcbiAgICBsZXQgdG90YWxUaW1lID0gU3RyaW5nVXRpbHMuc2Vjb25kc1RvVGltZShkdXJhdGlvblNlY29uZHMsIHRoaXMudGltZUZvcm1hdCk7XG5cbiAgICBzd2l0Y2ggKCg8UGxheWJhY2tUaW1lTGFiZWxDb25maWc+dGhpcy5jb25maWcpLnRpbWVMYWJlbE1vZGUpIHtcbiAgICAgIGNhc2UgUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRUaW1lOlxuICAgICAgICB0aGlzLnNldFRleHQoYCR7Y3VycmVudFRpbWV9YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQbGF5YmFja1RpbWVMYWJlbE1vZGUuVG90YWxUaW1lOlxuICAgICAgICB0aGlzLnNldFRleHQoYCR7dG90YWxUaW1lfWApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRBbmRUb3RhbFRpbWU6XG4gICAgICAgIHRoaXMuc2V0VGV4dChgJHtjdXJyZW50VGltZX0gLyAke3RvdGFsVGltZX1gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJFdmVudDtcbmltcG9ydCB7UGxheWVyVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncyA9IFBsYXllclV0aWxzLlRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzO1xuXG4vKipcbiAqIEEgYnV0dG9uIHRoYXQgdG9nZ2xlcyBiZXR3ZWVuIHBsYXliYWNrIGFuZCBwYXVzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXliYWNrVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENMQVNTX1NUT1BUT0dHTEUgPSAnc3RvcHRvZ2dsZSc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXBsYXliYWNrdG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdQbGF5L1BhdXNlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlciwgaGFuZGxlQ2xpY2tFdmVudDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGlzU2Vla2luZyA9IGZhbHNlO1xuXG4gICAgLy8gSGFuZGxlciB0byB1cGRhdGUgYnV0dG9uIHN0YXRlIGJhc2VkIG9uIHBsYXllciBzdGF0ZVxuICAgIGxldCBwbGF5YmFja1N0YXRlSGFuZGxlciA9IChldmVudDogUGxheWVyRXZlbnQpID0+IHtcbiAgICAgIC8vIElmIHRoZSBVSSBpcyBjdXJyZW50bHkgc2Vla2luZywgcGxheWJhY2sgaXMgdGVtcG9yYXJpbHkgc3RvcHBlZCBidXQgdGhlIGJ1dHRvbnMgc2hvdWxkXG4gICAgICAvLyBub3QgcmVmbGVjdCB0aGF0IGFuZCBzdGF5IGFzLWlzIChlLmcgaW5kaWNhdGUgcGxheWJhY2sgd2hpbGUgc2Vla2luZykuXG4gICAgICBpZiAoaXNTZWVraW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHBsYXllci5pc1BsYXlpbmcoKSkge1xuICAgICAgICB0aGlzLm9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9mZigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDYWxsIGhhbmRsZXIgdXBvbiB0aGVzZSBldmVudHNcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCBwbGF5YmFja1N0YXRlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUEFVU0VELCBwbGF5YmFja1N0YXRlSGFuZGxlcik7XG4gICAgLy8gd2hlbiBwbGF5YmFjayBmaW5pc2hlcywgcGxheWVyIHR1cm5zIHRvIHBhdXNlZCBtb2RlXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUJBQ0tfRklOSVNIRUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1NUQVJURUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1BMQVlJTkcsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1BBVVNFRCwgcGxheWJhY2tTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfUExBWUJBQ0tfRklOSVNIRUQsIHBsYXliYWNrU3RhdGVIYW5kbGVyKTtcblxuICAgIC8vIERldGVjdCBhYnNlbmNlIG9mIHRpbWVzaGlmdGluZyBvbiBsaXZlIHN0cmVhbXMgYW5kIGFkZCB0YWdnaW5nIGNsYXNzIHRvIGNvbnZlcnQgYnV0dG9uIGljb25zIHRvIHBsYXkvc3RvcFxuICAgIGxldCB0aW1lU2hpZnREZXRlY3RvciA9IG5ldyBQbGF5ZXJVdGlscy5UaW1lU2hpZnRBdmFpbGFiaWxpdHlEZXRlY3RvcihwbGF5ZXIpO1xuICAgIHRpbWVTaGlmdERldGVjdG9yLm9uVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZC5zdWJzY3JpYmUoXG4gICAgICAoc2VuZGVyLCBhcmdzOiBUaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncykgPT4ge1xuICAgICAgICBpZiAoIWFyZ3MudGltZVNoaWZ0QXZhaWxhYmxlKSB7XG4gICAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoUGxheWJhY2tUb2dnbGVCdXR0b24uQ0xBU1NfU1RPUFRPR0dMRSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFBsYXliYWNrVG9nZ2xlQnV0dG9uLkNMQVNTX1NUT1BUT0dHTEUpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gICAgdGltZVNoaWZ0RGV0ZWN0b3IuZGV0ZWN0KCk7IC8vIEluaXRpYWwgZGV0ZWN0aW9uXG5cbiAgICBpZiAoaGFuZGxlQ2xpY2tFdmVudCkge1xuICAgICAgLy8gQ29udHJvbCBwbGF5ZXIgYnkgYnV0dG9uIGV2ZW50c1xuICAgICAgLy8gV2hlbiBhIGJ1dHRvbiBldmVudCB0cmlnZ2VycyBhIHBsYXllciBBUEkgY2FsbCwgZXZlbnRzIGFyZSBmaXJlZCB3aGljaCBpbiB0dXJuIGNhbGwgdGhlIGV2ZW50IGhhbmRsZXJcbiAgICAgIC8vIGFib3ZlIHRoYXQgdXBkYXRlZCB0aGUgYnV0dG9uIHN0YXRlLlxuICAgICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoZSkgPT4ge1xuICAgICAgICBpZiAocGxheWVyLmlzUGxheWluZygpKSB7XG4gICAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoe2FjdGlvbjogJ3BhdXNlJywgZSwgb3JpZ2luYXRvcjogJ1BsYXliYWNrVG9nZ2xlQnV0dG9uJ30pXG4gICAgICAgICAgcGxheWVyLnBhdXNlKCd1aS1idXR0b24nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7YWN0aW9uOiAncGxheScsIGUsIG9yaWdpbmF0b3I6ICdQbGF5YmFja1RvZ2dsZUJ1dHRvbid9KVxuICAgICAgICAgIHBsYXllci5wbGF5KCd1aS1idXR0b24nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVHJhY2sgVUkgc2Vla2luZyBzdGF0dXNcbiAgICB1aW1hbmFnZXIub25TZWVrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSB0cnVlO1xuICAgIH0pO1xuICAgIHVpbWFuYWdlci5vblNlZWtlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaXNTZWVraW5nID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydHVwIGluaXRcbiAgICBwbGF5YmFja1N0YXRlSGFuZGxlcihudWxsKTtcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7SHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2h1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgZXJyb3IgbWVzc2FnZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBwbGF5YmFja1RvZ2dsZUJ1dHRvbjogSHVnZVBsYXliYWNrVG9nZ2xlQnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5wbGF5YmFja1RvZ2dsZUJ1dHRvbiA9IG5ldyBIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24oKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktcGxheWJhY2t0b2dnbGUtb3ZlcmxheScsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy5wbGF5YmFja1RvZ2dsZUJ1dHRvbl1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cbn0iLCJpbXBvcnQge0NvbnRhaW5lckNvbmZpZywgQ29udGFpbmVyfSBmcm9tICcuL2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge0RPTX0gZnJvbSAnLi4vZG9tJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXIsIFVJUmVjb21tZW5kYXRpb25Db25maWd9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQge1N0cmluZ1V0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0h1Z2VSZXBsYXlCdXR0b259IGZyb20gJy4vaHVnZXJlcGxheWJ1dHRvbic7XG5cbi8qKlxuICogT3ZlcmxheXMgdGhlIHBsYXllciBhbmQgZGlzcGxheXMgcmVjb21tZW5kZWQgdmlkZW9zLlxuICovXG5leHBvcnQgY2xhc3MgUmVjb21tZW5kYXRpb25PdmVybGF5IGV4dGVuZHMgQ29udGFpbmVyPENvbnRhaW5lckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgcmVwbGF5QnV0dG9uOiBIdWdlUmVwbGF5QnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29udGFpbmVyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5yZXBsYXlCdXR0b24gPSBuZXcgSHVnZVJlcGxheUJ1dHRvbigpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1yZWNvbW1lbmRhdGlvbi1vdmVybGF5JyxcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLnJlcGxheUJ1dHRvbl1cbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGNsZWFyUmVjb21tZW5kYXRpb25zID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBSZWNvbW1lbmRhdGlvbkl0ZW0pIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKCdyZWNvbW1lbmRhdGlvbnMnKSk7XG4gICAgfTtcblxuICAgIGxldCBzZXR1cFJlY29tbWVuZGF0aW9ucyA9ICgpID0+IHtcbiAgICAgIGNsZWFyUmVjb21tZW5kYXRpb25zKCk7XG5cbiAgICAgIGxldCBoYXNSZWNvbW1lbmRhdGlvbnNJblVpQ29uZmlnID0gdWltYW5hZ2VyLmdldENvbmZpZygpLnJlY29tbWVuZGF0aW9uc1xuICAgICAgICAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkucmVjb21tZW5kYXRpb25zLmxlbmd0aCA+IDA7XG4gICAgICBsZXQgaGFzUmVjb21tZW5kYXRpb25zSW5QbGF5ZXJDb25maWcgPSBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UucmVjb21tZW5kYXRpb25zXG4gICAgICAgICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UucmVjb21tZW5kYXRpb25zLmxlbmd0aCA+IDA7XG5cbiAgICAgIC8vIFRha2UgbWFya2VycyBmcm9tIHRoZSBVSSBjb25maWcuIElmIG5vIG1hcmtlcnMgZGVmaW5lZCwgdHJ5IHRvIHRha2UgdGhlbSBmcm9tIHRoZSBwbGF5ZXIncyBzb3VyY2UgY29uZmlnLlxuICAgICAgbGV0IHJlY29tbWVuZGF0aW9ucyA9IGhhc1JlY29tbWVuZGF0aW9uc0luVWlDb25maWcgPyB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkucmVjb21tZW5kYXRpb25zIDpcbiAgICAgICAgaGFzUmVjb21tZW5kYXRpb25zSW5QbGF5ZXJDb25maWcgPyBwbGF5ZXIuZ2V0Q29uZmlnKCkuc291cmNlLnJlY29tbWVuZGF0aW9ucyA6IG51bGw7XG5cbiAgICAgIC8vIEdlbmVyYXRlIHRpbWVsaW5lIG1hcmtlcnMgZnJvbSB0aGUgY29uZmlnIGlmIHdlIGhhdmUgbWFya2VycyBhbmQgaWYgd2UgaGF2ZSBhIGR1cmF0aW9uXG4gICAgICAvLyBUaGUgZHVyYXRpb24gY2hlY2sgaXMgZm9yIGJ1Z2d5IHBsYXRmb3JtcyB3aGVyZSB0aGUgZHVyYXRpb24gaXMgbm90IGF2YWlsYWJsZSBpbnN0YW50bHkgKENocm9tZSBvbiBBbmRyb2lkIDQuMylcbiAgICAgIGlmIChyZWNvbW1lbmRhdGlvbnMpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gMTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZWNvbW1lbmRhdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgUmVjb21tZW5kYXRpb25JdGVtKHtcbiAgICAgICAgICAgIGl0ZW1Db25maWc6IGl0ZW0sXG4gICAgICAgICAgICBjc3NDbGFzc2VzOiBbJ3JlY29tbWVuZGF0aW9uLWl0ZW0tJyArIChpbmRleCsrKV1cbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVDb21wb25lbnRzKCk7IC8vIGNyZWF0ZSBjb250YWluZXIgRE9NIGVsZW1lbnRzXG5cbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ3JlY29tbWVuZGF0aW9ucycpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQWRkIHJlY29tbWVuZGF0aW9uIHdoZW4gYSBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHNldHVwUmVjb21tZW5kYXRpb25zKTtcbiAgICAvLyBSZW1vdmUgcmVjb21tZW5kYXRpb25zIGFuZCBoaWRlIG92ZXJsYXkgd2hlbiBzb3VyY2UgaXMgdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsICgpID0+IHtcbiAgICAgIGNsZWFyUmVjb21tZW5kYXRpb25zKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcbiAgICAvLyBEaXNwbGF5IHJlY29tbWVuZGF0aW9ucyB3aGVuIHBsYXliYWNrIGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlCQUNLX0ZJTklTSEVELCAoKSA9PiB7XG4gICAgICAvLyBEaXNtaXNzIE9OX1BMQVlCQUNLX0ZJTklTSEVEIGV2ZW50cyBhdCB0aGUgZW5kIG9mIGFkc1xuICAgICAgLy8gVE9ETyByZW1vdmUgdGhpcyB3b3JrYXJvdW5kIG9uY2UgaXNzdWUgIzEyNzggaXMgc29sdmVkXG4gICAgICBpZiAocGxheWVyLmlzQWQoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0pO1xuICAgIC8vIEhpZGUgcmVjb21tZW5kYXRpb25zIHdoZW4gcGxheWJhY2sgc3RhcnRzLCBlLmcuIGEgcmVzdGFydFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVksICgpID0+IHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdCBvbiBzdGFydHVwXG4gICAgc2V0dXBSZWNvbW1lbmRhdGlvbnMoKTtcbiAgfVxufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciB0aGUge0BsaW5rIFJlY29tbWVuZGF0aW9uSXRlbX1cbiAqL1xuaW50ZXJmYWNlIFJlY29tbWVuZGF0aW9uSXRlbUNvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gIGl0ZW1Db25maWc6IFVJUmVjb21tZW5kYXRpb25Db25maWc7XG59XG5cbi8qKlxuICogQW4gaXRlbSBvZiB0aGUge0BsaW5rIFJlY29tbWVuZGF0aW9uT3ZlcmxheX0uIFVzZWQgb25seSBpbnRlcm5hbGx5IGluIHtAbGluayBSZWNvbW1lbmRhdGlvbk92ZXJsYXl9LlxuICovXG5jbGFzcyBSZWNvbW1lbmRhdGlvbkl0ZW0gZXh0ZW5kcyBDb21wb25lbnQ8UmVjb21tZW5kYXRpb25JdGVtQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBSZWNvbW1lbmRhdGlvbkl0ZW1Db25maWcpIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1yZWNvbW1lbmRhdGlvbi1pdGVtJyxcbiAgICAgIGl0ZW1Db25maWc6IG51bGwgLy8gdGhpcyBtdXN0IGJlIHBhc3NlZCBpbiBmcm9tIG91dHNpZGVcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGNvbmZpZyA9ICg8UmVjb21tZW5kYXRpb25JdGVtQ29uZmlnPnRoaXMuY29uZmlnKS5pdGVtQ29uZmlnOyAvLyBUT0RPIGZpeCBnZW5lcmljcyBhbmQgZ2V0IHJpZCBvZiBjYXN0XG5cbiAgICBsZXQgaXRlbUVsZW1lbnQgPSBuZXcgRE9NKCdhJywge1xuICAgICAgJ2lkJzogdGhpcy5jb25maWcuaWQsXG4gICAgICAnY2xhc3MnOiB0aGlzLmdldENzc0NsYXNzZXMoKSxcbiAgICAgICdocmVmJzogY29uZmlnLnVybFxuICAgIH0pLmNzcyh7ICdiYWNrZ3JvdW5kLWltYWdlJzogYHVybCgke2NvbmZpZy50aHVtYm5haWx9KWAgfSk7XG5cbiAgICBsZXQgYmdFbGVtZW50ID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2JhY2tncm91bmQnKVxuICAgIH0pO1xuICAgIGl0ZW1FbGVtZW50LmFwcGVuZChiZ0VsZW1lbnQpO1xuXG4gICAgbGV0IHRpdGxlRWxlbWVudCA9IG5ldyBET00oJ3NwYW4nLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygndGl0bGUnKVxuICAgIH0pLmFwcGVuZChuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2lubmVydGl0bGUnKVxuICAgIH0pLmh0bWwoY29uZmlnLnRpdGxlKSk7XG4gICAgaXRlbUVsZW1lbnQuYXBwZW5kKHRpdGxlRWxlbWVudCk7XG5cbiAgICBsZXQgdGltZUVsZW1lbnQgPSBuZXcgRE9NKCdzcGFuJywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ2R1cmF0aW9uJylcbiAgICB9KS5hcHBlbmQobmV3IERPTSgnc3BhbicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdpbm5lcmR1cmF0aW9uJylcbiAgICB9KS5odG1sKGNvbmZpZy5kdXJhdGlvbiA/IFN0cmluZ1V0aWxzLnNlY29uZHNUb1RpbWUoY29uZmlnLmR1cmF0aW9uKSA6ICcnKSk7XG4gICAgaXRlbUVsZW1lbnQuYXBwZW5kKHRpbWVFbGVtZW50KTtcblxuICAgIHJldHVybiBpdGVtRWxlbWVudDtcbiAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtFdmVudCwgRXZlbnREaXNwYXRjaGVyLCBOb0FyZ3N9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5pbXBvcnQge1NlZWtCYXJMYWJlbH0gZnJvbSAnLi9zZWVrYmFybGFiZWwnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlciwgVGltZWxpbmVNYXJrZXIsIFNlZWtQcmV2aWV3QXJnc30gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7VGltZW91dH0gZnJvbSAnLi4vdGltZW91dCc7XG5pbXBvcnQge1BsYXllclV0aWxzfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3MgPSBQbGF5ZXJVdGlscy5UaW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkQXJncztcbmltcG9ydCBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3MgPSBQbGF5ZXJVdGlscy5MaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3M7XG5pbXBvcnQgUGxheWVyRXZlbnQgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnQ7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgU2Vla0Jhcn0gY29tcG9uZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlZWtCYXJDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICAvKipcbiAgICogVGhlIGxhYmVsIGFib3ZlIHRoZSBzZWVrIHBvc2l0aW9uLlxuICAgKi9cbiAgbGFiZWw/OiBTZWVrQmFyTGFiZWw7XG4gIC8qKlxuICAgKiBCYXIgd2lsbCBiZSB2ZXJ0aWNhbCBpbnN0ZWFkIG9mIGhvcml6b250YWwgaWYgc2V0IHRvIHRydWUuXG4gICAqL1xuICB2ZXJ0aWNhbD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGUgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGluIHdoaWNoIHRoZSBwbGF5YmFjayBwb3NpdGlvbiBvbiB0aGUgc2VlayBiYXIgd2lsbCBiZSB1cGRhdGVkLiBUaGUgc2hvcnRlciB0aGVcbiAgICogaW50ZXJ2YWwsIHRoZSBzbW9vdGhlciBpdCBsb29rcyBhbmQgdGhlIG1vcmUgcmVzb3VyY2UgaW50ZW5zZSBpdCBpcy4gVGhlIHVwZGF0ZSBpbnRlcnZhbCB3aWxsIGJlIGtlcHQgYXMgc3RlYWR5XG4gICAqIGFzIHBvc3NpYmxlIHRvIGF2b2lkIGppdHRlci5cbiAgICogU2V0IHRvIC0xIHRvIGRpc2FibGUgc21vb3RoIHVwZGF0aW5nIGFuZCB1cGRhdGUgaXQgb24gcGxheWVyIE9OX1RJTUVfQ0hBTkdFRCBldmVudHMgaW5zdGVhZC5cbiAgICogRGVmYXVsdDogNTAgKDUwbXMgPSAyMGZwcykuXG4gICAqL1xuICBzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNcz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBFdmVudCBhcmd1bWVudCBpbnRlcmZhY2UgZm9yIGEgc2VlayBwcmV2aWV3IGV2ZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlZWtQcmV2aWV3RXZlbnRBcmdzIGV4dGVuZHMgU2Vla1ByZXZpZXdBcmdzIHtcbiAgLyoqXG4gICAqIFRlbGxzIGlmIHRoZSBzZWVrIHByZXZpZXcgZXZlbnQgY29tZXMgZnJvbSBhIHNjcnViYmluZy5cbiAgICovXG4gIHNjcnViYmluZzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIHNlZWsgYmFyIHRvIHNlZWsgd2l0aGluIHRoZSBwbGF5ZXIncyBtZWRpYS4gSXQgZGlzcGxheXMgdGhlIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb24sIGFtb3VudCBvZiBidWZmZWQgZGF0YSwgc2Vla1xuICogdGFyZ2V0LCBhbmQga2VlcHMgc3RhdHVzIGFib3V0IGFuIG9uZ29pbmcgc2Vlay5cbiAqXG4gKiBUaGUgc2VlayBiYXIgZGlzcGxheXMgZGlmZmVyZW50ICdiYXJzJzpcbiAqICAtIHRoZSBwbGF5YmFjayBwb3NpdGlvbiwgaS5lLiB0aGUgcG9zaXRpb24gaW4gdGhlIG1lZGlhIGF0IHdoaWNoIHRoZSBwbGF5ZXIgY3VycmVudCBwbGF5YmFjayBwb2ludGVyIGlzIHBvc2l0aW9uZWRcbiAqICAtIHRoZSBidWZmZXIgcG9zaXRpb24sIHdoaWNoIHVzdWFsbHkgaXMgdGhlIHBsYXliYWNrIHBvc2l0aW9uIHBsdXMgdGhlIHRpbWUgc3BhbiB0aGF0IGlzIGFscmVhZHkgYnVmZmVyZWQgYWhlYWRcbiAqICAtIHRoZSBzZWVrIHBvc2l0aW9uLCB1c2VkIHRvIHByZXZpZXcgdG8gd2hlcmUgaW4gdGhlIHRpbWVsaW5lIGEgc2VlayB3aWxsIGp1bXAgdG9cbiAqL1xuZXhwb3J0IGNsYXNzIFNlZWtCYXIgZXh0ZW5kcyBDb21wb25lbnQ8U2Vla0JhckNvbmZpZz4ge1xuXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU01PT1RIX1BMQVlCQUNLX1BPU0lUSU9OX1VQREFURV9ESVNBQkxFRCA9IC0xO1xuXG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzIHRoYXQgaXMgYWRkZWQgdG8gdGhlIERPTSBlbGVtZW50IHdoaWxlIHRoZSBzZWVrIGJhciBpcyBpbiAnc2Vla2luZycgc3RhdGUuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDTEFTU19TRUVLSU5HID0gJ3NlZWtpbmcnO1xuXG4gIHByaXZhdGUgc2Vla0JhcjogRE9NO1xuICBwcml2YXRlIHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uOiBET007XG4gIHByaXZhdGUgc2Vla0JhclBsYXliYWNrUG9zaXRpb25NYXJrZXI6IERPTTtcbiAgcHJpdmF0ZSBzZWVrQmFyQnVmZmVyUG9zaXRpb246IERPTTtcbiAgcHJpdmF0ZSBzZWVrQmFyU2Vla1Bvc2l0aW9uOiBET007XG4gIHByaXZhdGUgc2Vla0JhckJhY2tkcm9wOiBET007XG4gIHByaXZhdGUgc2Vla0Jhck1hcmtlcnNDb250YWluZXI6IERPTTtcblxuICBwcml2YXRlIGxhYmVsOiBTZWVrQmFyTGFiZWw7XG5cbiAgcHJpdmF0ZSBfY29tbWVudHNPbjogYm9vbGVhbiA9IHRydWU7XG4gIHByaXZhdGUgdGltZWxpbmVNYXJrZXJzOiBUaW1lbGluZU1hcmtlcltdO1xuXG4gIC8qKlxuICAgKiBCdWZmZXIgb2YgdGhlIHRoZSBjdXJyZW50IHBsYXliYWNrIHBvc2l0aW9uLiBUaGUgcG9zaXRpb24gbXVzdCBiZSBidWZmZXJlZCBpbiBjYXNlIHRoZSBlbGVtZW50XG4gICAqIG5lZWRzIHRvIGJlIHJlZnJlc2hlZCB3aXRoIHtAbGluayAjcmVmcmVzaFBsYXliYWNrUG9zaXRpb259LlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgcHJpdmF0ZSBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDA7XG5cbiAgcHJpdmF0ZSBzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcjogVGltZW91dDtcblxuXG4gIC8vIGh0dHBzOi8vaGFja3MubW96aWxsYS5vcmcvMjAxMy8wNC9kZXRlY3RpbmctdG91Y2gtaXRzLXRoZS13aHktbm90LXRoZS1ob3cvXG4gIHByaXZhdGUgdG91Y2hTdXBwb3J0ZWQgPSAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KTtcblxuICBwcml2YXRlIHNlZWtCYXJFdmVudHMgPSB7XG4gICAgLyoqXG4gICAgICogRmlyZWQgd2hlbiBhIHNjcnViYmluZyBzZWVrIG9wZXJhdGlvbiBpcyBzdGFydGVkLlxuICAgICAqL1xuICAgIG9uU2VlazogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBOb0FyZ3M+KCksXG4gICAgLyoqXG4gICAgICogRmlyZWQgZHVyaW5nIGEgc2NydWJiaW5nIHNlZWsgdG8gaW5kaWNhdGUgdGhhdCB0aGUgc2VlayBwcmV2aWV3IChpLmUuIHRoZSB2aWRlbyBmcmFtZSkgc2hvdWxkIGJlIHVwZGF0ZWQuXG4gICAgICovXG4gICAgb25TZWVrUHJldmlldzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz4oKSxcbiAgICAvKipcbiAgICAgKiBGaXJlZCB3aGVuIGEgc2NydWJiaW5nIHNlZWsgaGFzIGZpbmlzaGVkIG9yIHdoZW4gYSBkaXJlY3Qgc2VlayBpcyBpc3N1ZWQuXG4gICAgICovXG4gICAgb25TZWVrZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgbnVtYmVyPigpLFxuXG4gICAgLyoqXG4gICAgICogRmlyZSB3aGVuIGNvbW1lbnRzT24gaXMgdG9nZ2xlZFxuICAgICAqL1xuICAgIG9uQ2hhbmdlQ29tbWVudHNPbjogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBib29sZWFuPigpXG4gIH07XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZWVrQmFyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZWVrYmFyJyxcbiAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgIHNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zOiA1MCxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG5cbiAgICB0aGlzLmxhYmVsID0gdGhpcy5jb25maWcubGFiZWw7XG4gICAgdGhpcy50aW1lbGluZU1hcmtlcnMgPSBbXTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKHRoaXMuaGFzTGFiZWwoKSkge1xuICAgICAgdGhpcy5nZXRMYWJlbCgpLmluaXRpYWxpemUoKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIsIGNvbmZpZ3VyZVNlZWs6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGlmICghY29uZmlndXJlU2Vlaykge1xuICAgICAgLy8gVGhlIGNvbmZpZ3VyZVNlZWsgZmxhZyBjYW4gYmUgdXNlZCBieSBzdWJjbGFzc2VzIHRvIGRpc2FibGUgY29uZmlndXJhdGlvbiBhcyBzZWVrIGJhci4gRS5nLiB0aGUgdm9sdW1lXG4gICAgICAvLyBzbGlkZXIgaXMgcmV1c2luZyB0aGlzIGNvbXBvbmVudCBidXQgYWRkcyBpdHMgb3duIGZ1bmN0aW9uYWxpdHksIGFuZCBkb2VzIG5vdCBuZWVkIHRoZSBzZWVrIGZ1bmN0aW9uYWxpdHkuXG4gICAgICAvLyBUaGlzIGlzIGFjdHVhbGx5IGEgaGFjaywgdGhlIHByb3BlciBzb2x1dGlvbiB3b3VsZCBiZSBmb3IgYm90aCBzZWVrIGJhciBhbmQgdm9sdW1lIHNsaWRlcnMgdG8gZXh0ZW5kXG4gICAgICAvLyBhIGNvbW1vbiBiYXNlIHNsaWRlciBjb21wb25lbnQgYW5kIGltcGxlbWVudCB0aGVpciBmdW5jdGlvbmFsaXR5IHRoZXJlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwbGF5YmFja05vdEluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBsZXQgaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgbGV0IGlzU2Vla2luZyA9IGZhbHNlO1xuXG4gICAgLy8gVXBkYXRlIHBsYXliYWNrIGFuZCBidWZmZXIgcG9zaXRpb25zXG4gICAgbGV0IHBsYXliYWNrUG9zaXRpb25IYW5kbGVyID0gKGV2ZW50OiBQbGF5ZXJFdmVudCA9IG51bGwsIGZvcmNlVXBkYXRlOiBib29sZWFuID0gZmFsc2UpID0+IHtcbiAgICAgIC8vIE9uY2UgdGhpcyBoYW5kbGVyIG9zIGNhbGxlZCwgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBhbmQgd2Ugc2V0IHRoZSBmbGFnIHRvIGZhbHNlXG4gICAgICBwbGF5YmFja05vdEluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChpc1NlZWtpbmcpIHtcbiAgICAgICAgLy8gV2UgY2F1Z2h0IGEgc2VlayBwcmV2aWV3IHNlZWssIGRvIG5vdCB1cGRhdGUgdGhlIHNlZWtiYXJcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGxheWVyLmlzTGl2ZSgpKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgPT09IDApIHtcbiAgICAgICAgICAvLyBUaGlzIGNhc2UgbXVzdCBiZSBleHBsaWNpdGx5IGhhbmRsZWQgdG8gYXZvaWQgZGl2aXNpb24gYnkgemVyb1xuICAgICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbigxMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGxldCBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDEwMCAtICgxMDAgLyBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgKiBwbGF5ZXIuZ2V0VGltZVNoaWZ0KCkpO1xuICAgICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbihwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHdheXMgc2hvdyBmdWxsIGJ1ZmZlciBmb3IgbGl2ZSBzdHJlYW1zXG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24oMTAwKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgcGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgPSAxMDAgLyBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAqIHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xuXG4gICAgICAgIGxldCB2aWRlb0J1ZmZlckxlbmd0aCA9IHBsYXllci5nZXRWaWRlb0J1ZmZlckxlbmd0aCgpO1xuICAgICAgICBsZXQgYXVkaW9CdWZmZXJMZW5ndGggPSBwbGF5ZXIuZ2V0QXVkaW9CdWZmZXJMZW5ndGgoKTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBidWZmZXIgbGVuZ3RoIHdoaWNoIGlzIHRoZSBzbWFsbGVyIGxlbmd0aCBvZiB0aGUgYXVkaW8gYW5kIHZpZGVvIGJ1ZmZlcnMuIElmIG9uZSBvZiB0aGVzZVxuICAgICAgICAvLyBidWZmZXJzIGlzIG5vdCBhdmFpbGFibGUsIHdlIHNldCBpdCdzIHZhbHVlIHRvIE1BWF9WQUxVRSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgb3RoZXIgcmVhbCB2YWx1ZSBpcyB0YWtlblxuICAgICAgICAvLyBhcyB0aGUgYnVmZmVyIGxlbmd0aC5cbiAgICAgICAgbGV0IGJ1ZmZlckxlbmd0aCA9IE1hdGgubWluKFxuICAgICAgICAgIHZpZGVvQnVmZmVyTGVuZ3RoICE9IG51bGwgPyB2aWRlb0J1ZmZlckxlbmd0aCA6IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgYXVkaW9CdWZmZXJMZW5ndGggIT0gbnVsbCA/IGF1ZGlvQnVmZmVyTGVuZ3RoIDogTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgIC8vIElmIGJvdGggYnVmZmVyIGxlbmd0aHMgYXJlIG1pc3NpbmcsIHdlIHNldCB0aGUgYnVmZmVyIGxlbmd0aCB0byB6ZXJvXG4gICAgICAgIGlmIChidWZmZXJMZW5ndGggPT09IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICAgICAgICBidWZmZXJMZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJ1ZmZlclBlcmNlbnRhZ2UgPSAxMDAgLyBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAqIGJ1ZmZlckxlbmd0aDtcblxuICAgICAgICAvLyBVcGRhdGUgcGxheWJhY2sgcG9zaXRpb24gb25seSBpbiBwYXVzZWQgc3RhdGUgb3IgaW4gdGhlIGluaXRpYWwgc3RhcnR1cCBzdGF0ZSB3aGVyZSBwbGF5ZXIgaXMgbmVpdGhlclxuICAgICAgICAvLyBwYXVzZWQgbm9yIHBsYXlpbmcuIFBsYXliYWNrIHVwZGF0ZXMgYXJlIGhhbmRsZWQgaW4gdGhlIFRpbWVvdXQgYmVsb3cuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5zbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNcyA9PT0gU2Vla0Jhci5TTU9PVEhfUExBWUJBQ0tfUE9TSVRJT05fVVBEQVRFX0RJU0FCTEVEXG4gICAgICAgICAgfHwgZm9yY2VVcGRhdGUgfHwgcGxheWVyLmlzUGF1c2VkKCkgfHwgKHBsYXllci5pc1BhdXNlZCgpID09PSBwbGF5ZXIuaXNQbGF5aW5nKCkpKSB7XG4gICAgICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24ocGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgKyBidWZmZXJQZXJjZW50YWdlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVXBkYXRlIHNlZWtiYXIgdXBvbiB0aGVzZSBldmVudHNcbiAgICAvLyBpbml0IHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gaXQgY2hhbmdlc1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBidWZmZXJsZXZlbCB3aGVuIGJ1ZmZlcmluZyBpcyBjb21wbGV0ZVxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NUQUxMX0VOREVELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gYSBzZWVrIGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBwbGF5YmFjayBwb3NpdGlvbiB3aGVuIGEgdGltZXNoaWZ0IGhhcyBmaW5pc2hlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfU0hJRlRFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuICAgIC8vIHVwZGF0ZSBidWZmZXJsZXZlbCB3aGVuIGEgc2VnbWVudCBoYXMgYmVlbiBkb3dubG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VHTUVOVF9SRVFVRVNUX0ZJTklTSEVELCBwbGF5YmFja1Bvc2l0aW9uSGFuZGxlcik7XG4gICAgLy8gdXBkYXRlIHBsYXliYWNrIHBvc2l0aW9uIG9mIENhc3QgcGxheWJhY2tcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9DQVNUX1RJTUVfVVBEQVRFRCwgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIpO1xuXG5cbiAgICAvLyBTZWVrIGhhbmRsaW5nXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFSywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTZWVraW5nKHRydWUpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUtFRCwgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTZWVraW5nKGZhbHNlKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZULCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFNlZWtpbmcodHJ1ZSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVElNRV9TSElGVEVELCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFNlZWtpbmcoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgbGV0IHNlZWsgPSAocGVyY2VudGFnZTogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTGl2ZSgpKSB7XG4gICAgICAgIHBsYXllci50aW1lU2hpZnQocGxheWVyLmdldE1heFRpbWVTaGlmdCgpIC0gKHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAqIChwZXJjZW50YWdlIC8gMTAwKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLnNlZWsocGxheWVyLmdldER1cmF0aW9uKCkgKiAocGVyY2VudGFnZSAvIDEwMCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5vblNlZWsuc3Vic2NyaWJlKChzZW5kZXIpID0+IHtcbiAgICAgIGlzU2Vla2luZyA9IHRydWU7IC8vIHRyYWNrIHNlZWtpbmcgc3RhdHVzIHNvIHdlIGNhbiBjYXRjaCBldmVudHMgZnJvbSBzZWVrIHByZXZpZXcgc2Vla3NcblxuICAgICAgLy8gTm90aWZ5IFVJIG1hbmFnZXIgb2Ygc3RhcnRlZCBzZWVrXG4gICAgICB1aW1hbmFnZXIub25TZWVrLmRpc3BhdGNoKHNlbmRlcik7XG5cbiAgICAgIC8vIFNhdmUgY3VycmVudCBwbGF5YmFjayBzdGF0ZVxuICAgICAgaXNQbGF5aW5nID0gcGxheWVyLmlzUGxheWluZygpO1xuXG4gICAgICAvLyBQYXVzZSBwbGF5YmFjayB3aGlsZSBzZWVraW5nXG4gICAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXllci5wYXVzZSgndWktc2VlaycpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMub25TZWVrUHJldmlldy5zdWJzY3JpYmUoKHNlbmRlcjogU2Vla0JhciwgYXJnczogU2Vla1ByZXZpZXdFdmVudEFyZ3MpID0+IHtcbiAgICAgIC8vIE5vdGlmeSBVSSBtYW5hZ2VyIG9mIHNlZWsgcHJldmlld1xuICAgICAgdWltYW5hZ2VyLm9uU2Vla1ByZXZpZXcuZGlzcGF0Y2goc2VuZGVyLCBhcmdzKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uU2Vla1ByZXZpZXcuc3Vic2NyaWJlUmF0ZUxpbWl0ZWQoKHNlbmRlcjogU2Vla0JhciwgYXJnczogU2Vla1ByZXZpZXdFdmVudEFyZ3MpID0+IHtcbiAgICAgIC8vIFJhdGUtbGltaXRlZCBzY3J1YmJpbmcgc2Vla1xuICAgICAgaWYgKGFyZ3Muc2NydWJiaW5nKSB7XG4gICAgICAgIHNlZWsoYXJncy5wb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSwgMjAwKTtcbiAgICB0aGlzLm9uU2Vla2VkLnN1YnNjcmliZSgoc2VuZGVyLCBwZXJjZW50YWdlKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gRG8gdGhlIHNlZWtcbiAgICAgIHNlZWsocGVyY2VudGFnZSk7XG5cbiAgICAgIC8vIENvbnRpbnVlIHBsYXliYWNrIGFmdGVyIHNlZWsgaWYgcGxheWVyIHdhcyBwbGF5aW5nIHdoZW4gc2VlayBzdGFydGVkXG4gICAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXllci5wbGF5KCd1aS1zZWVrJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdGlmeSBVSSBtYW5hZ2VyIG9mIGZpbmlzaGVkIHNlZWtcbiAgICAgIHVpbWFuYWdlci5vblNlZWtlZC5kaXNwYXRjaChzZW5kZXIpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuaGFzTGFiZWwoKSkge1xuICAgICAgLy8gQ29uZmlndXJlIGEgc2Vla2JhciBsYWJlbCB0aGF0IGlzIGludGVybmFsIHRvIHRoZSBzZWVrYmFyKVxuICAgICAgdGhpcy5nZXRMYWJlbCgpLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBzZWVrYmFyIGZvciBsaXZlIHNvdXJjZXMgd2l0aG91dCB0aW1lc2hpZnRcbiAgICBsZXQgaXNMaXZlID0gZmFsc2U7XG4gICAgbGV0IGhhc1RpbWVTaGlmdCA9IGZhbHNlO1xuICAgIGxldCBzd2l0Y2hWaXNpYmlsaXR5ID0gKGlzTGl2ZTogYm9vbGVhbiwgaGFzVGltZVNoaWZ0OiBib29sZWFuKSA9PiB7XG4gICAgICBpZiAoaXNMaXZlICYmICFoYXNUaW1lU2hpZnQpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH1cbiAgICAgIHBsYXliYWNrUG9zaXRpb25IYW5kbGVyKG51bGwsIHRydWUpO1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH07XG4gICAgbGV0IGxpdmVTdHJlYW1EZXRlY3RvciA9IG5ldyBQbGF5ZXJVdGlscy5MaXZlU3RyZWFtRGV0ZWN0b3IocGxheWVyKTtcbiAgICBsaXZlU3RyZWFtRGV0ZWN0b3Iub25MaXZlQ2hhbmdlZC5zdWJzY3JpYmUoKHNlbmRlciwgYXJnczogTGl2ZVN0cmVhbURldGVjdG9yRXZlbnRBcmdzKSA9PiB7XG4gICAgICBpc0xpdmUgPSBhcmdzLmxpdmU7XG4gICAgICBzd2l0Y2hWaXNpYmlsaXR5KGlzTGl2ZSwgaGFzVGltZVNoaWZ0KTtcbiAgICB9KTtcbiAgICBsZXQgdGltZVNoaWZ0RGV0ZWN0b3IgPSBuZXcgUGxheWVyVXRpbHMuVGltZVNoaWZ0QXZhaWxhYmlsaXR5RGV0ZWN0b3IocGxheWVyKTtcbiAgICB0aW1lU2hpZnREZXRlY3Rvci5vblRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWQuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3M6IFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzKSA9PiB7XG4gICAgICAgIGhhc1RpbWVTaGlmdCA9IGFyZ3MudGltZVNoaWZ0QXZhaWxhYmxlO1xuICAgICAgICBzd2l0Y2hWaXNpYmlsaXR5KGlzTGl2ZSwgaGFzVGltZVNoaWZ0KTtcbiAgICAgIH1cbiAgICApO1xuICAgIC8vIEluaXRpYWwgZGV0ZWN0aW9uXG4gICAgbGl2ZVN0cmVhbURldGVjdG9yLmRldGVjdCgpO1xuICAgIHRpbWVTaGlmdERldGVjdG9yLmRldGVjdCgpO1xuXG4gICAgLy8gUmVmcmVzaCB0aGUgcGxheWJhY2sgcG9zaXRpb24gd2hlbiB0aGUgcGxheWVyIHJlc2l6ZWQgb3IgdGhlIFVJIGlzIGNvbmZpZ3VyZWQuIFRoZSBwbGF5YmFjayBwb3NpdGlvbiBtYXJrZXJcbiAgICAvLyBpcyBwb3NpdGlvbmVkIGFic29sdXRlbHkgYW5kIG11c3QgdGhlcmVmb3JlIGJlIHVwZGF0ZWQgd2hlbiB0aGUgc2l6ZSBvZiB0aGUgc2Vla2JhciBjaGFuZ2VzLlxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsICgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICAvLyBBZGRpdGlvbmFsbHksIHdoZW4gdGhpcyBjb2RlIGlzIGNhbGxlZCwgdGhlIHNlZWtiYXIgaXMgbm90IHBhcnQgb2YgdGhlIFVJIHlldCBhbmQgdGhlcmVmb3JlIGRvZXMgbm90IGhhdmUgYSBzaXplLFxuICAgIC8vIHJlc3VsdGluZyBpbiBhIHdyb25nIGluaXRpYWwgcG9zaXRpb24gb2YgdGhlIG1hcmtlci4gUmVmcmVzaGluZyBpdCBvbmNlIHRoZSBVSSBpcyBjb25maWd1cmVkIHNvbHZlZCB0aGlzIGlzc3VlLlxuICAgIHVpbWFuYWdlci5vbkNvbmZpZ3VyZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFBsYXliYWNrUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICAvLyBJdCBjYW4gYWxzbyBoYXBwZW4gdGhhdCB0aGUgdmFsdWUgY2hhbmdlcyBvbmNlIHRoZSBwbGF5ZXIgaXMgcmVhZHksIG9yIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZCwgc28gd2UgbmVlZFxuICAgIC8vIHRvIHVwZGF0ZSBvbiBPTl9SRUFEWSB0b29cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9SRUFEWSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzZWVrYmFyXG4gICAgcGxheWJhY2tQb3NpdGlvbkhhbmRsZXIoKTsgLy8gU2V0IHRoZSBwbGF5YmFjayBwb3NpdGlvblxuICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24oMCk7XG4gICAgdGhpcy5zZXRTZWVrUG9zaXRpb24oMCk7XG4gICAgaWYgKHRoaXMuY29uZmlnLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVJbnRlcnZhbE1zICE9PSBTZWVrQmFyLlNNT09USF9QTEFZQkFDS19QT1NJVElPTl9VUERBVEVfRElTQUJMRUQpIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIocGxheWVyLCB1aW1hbmFnZXIpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ3VyZU1hcmtlcnMocGxheWVyLCB1aW1hbmFnZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcihwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIC8qXG4gICAgICogUGxheWJhY2sgcG9zaXRpb24gdXBkYXRlXG4gICAgICpcbiAgICAgKiBXZSBkbyBub3QgdXBkYXRlIHRoZSBwb3NpdGlvbiBkaXJlY3RseSBmcm9tIHRoZSBPTl9USU1FX0NIQU5HRUQgZXZlbnQsIGJlY2F1c2UgaXQgYXJyaXZlcyB2ZXJ5IGppdHRlcnkgYW5kXG4gICAgICogcmVzdWx0cyBpbiBhIGppdHRlcnkgcG9zaXRpb24gaW5kaWNhdG9yIHNpbmNlIHRoZSBDU1MgdHJhbnNpdGlvbiB0aW1lIGlzIHN0YXRpY2FsbHkgc2V0LlxuICAgICAqIFRvIHdvcmsgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIG1haW50YWluIGEgbG9jYWwgcGxheWJhY2sgcG9zaXRpb24gdGhhdCBpcyB1cGRhdGVkIGluIGEgc3RhYmxlIHJlZ3VsYXIgaW50ZXJ2YWxcbiAgICAgKiBhbmQga2VwdCBpbiBzeW5jIHdpdGggdGhlIHBsYXllci5cbiAgICAgKi9cbiAgICBsZXQgY3VycmVudFRpbWVTZWVrQmFyID0gMDtcbiAgICBsZXQgY3VycmVudFRpbWVQbGF5ZXIgPSAwO1xuICAgIGxldCB1cGRhdGVJbnRlcnZhbE1zID0gNTA7XG4gICAgbGV0IGN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzID0gdXBkYXRlSW50ZXJ2YWxNcyAvIDEwMDA7XG5cbiAgICB0aGlzLnNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyID0gbmV3IFRpbWVvdXQodXBkYXRlSW50ZXJ2YWxNcywgKCkgPT4ge1xuICAgICAgY3VycmVudFRpbWVTZWVrQmFyICs9IGN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzO1xuICAgICAgY3VycmVudFRpbWVQbGF5ZXIgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcblxuICAgICAgLy8gU3luYyBjdXJyZW50VGltZSBvZiBzZWVrYmFyIHRvIHBsYXllclxuICAgICAgbGV0IGN1cnJlbnRUaW1lRGVsdGEgPSBjdXJyZW50VGltZVNlZWtCYXIgLSBjdXJyZW50VGltZVBsYXllcjtcbiAgICAgIC8vIElmIHRoZSBkZWx0YSBpcyBsYXJnZXIgdGhhdCAyIHNlY3MsIGRpcmVjdGx5IGp1bXAgdGhlIHNlZWtiYXIgdG8gdGhlXG4gICAgICAvLyBwbGF5ZXIgdGltZSBpbnN0ZWFkIG9mIHNtb290aGx5IGZhc3QgZm9yd2FyZGluZy9yZXdpbmRpbmcuXG4gICAgICBpZiAoTWF0aC5hYnMoY3VycmVudFRpbWVEZWx0YSkgPiAyKSB7XG4gICAgICAgIGN1cnJlbnRUaW1lU2Vla0JhciA9IGN1cnJlbnRUaW1lUGxheWVyO1xuICAgICAgfVxuICAgICAgLy8gSWYgY3VycmVudFRpbWVEZWx0YSBpcyBuZWdhdGl2ZSBhbmQgYmVsb3cgdGhlIGFkanVzdG1lbnQgdGhyZXNob2xkLFxuICAgICAgLy8gdGhlIHBsYXllciBpcyBhaGVhZCBvZiB0aGUgc2Vla2JhciBhbmQgd2UgJ2Zhc3QgZm9yd2FyZCcgdGhlIHNlZWtiYXJcbiAgICAgIGVsc2UgaWYgKGN1cnJlbnRUaW1lRGVsdGEgPD0gLWN1cnJlbnRUaW1lVXBkYXRlRGVsdGFTZWNzKSB7XG4gICAgICAgIGN1cnJlbnRUaW1lU2Vla0JhciArPSBjdXJyZW50VGltZVVwZGF0ZURlbHRhU2VjcztcbiAgICAgIH1cbiAgICAgIC8vIElmIGN1cnJlbnRUaW1lRGVsdGEgaXMgcG9zaXRpdmUgYW5kIGFib3ZlIHRoZSBhZGp1c3RtZW50IHRocmVzaG9sZCxcbiAgICAgIC8vIHRoZSBwbGF5ZXIgaXMgYmVoaW5kIHRoZSBzZWVrYmFyIGFuZCB3ZSAncmV3aW5kJyB0aGUgc2Vla2JhclxuICAgICAgZWxzZSBpZiAoY3VycmVudFRpbWVEZWx0YSA+PSBjdXJyZW50VGltZVVwZGF0ZURlbHRhU2Vjcykge1xuICAgICAgICBjdXJyZW50VGltZVNlZWtCYXIgLT0gY3VycmVudFRpbWVVcGRhdGVEZWx0YVNlY3M7XG4gICAgICB9XG5cbiAgICAgIGxldCBwbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSA9IDEwMCAvIHBsYXllci5nZXREdXJhdGlvbigpICogY3VycmVudFRpbWVTZWVrQmFyO1xuICAgICAgdGhpcy5zZXRQbGF5YmFja1Bvc2l0aW9uKHBsYXliYWNrUG9zaXRpb25QZXJjZW50YWdlKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIGxldCBzdGFydFNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyID0gKCkgPT4ge1xuICAgICAgaWYgKCFwbGF5ZXIuaXNMaXZlKCkpIHtcbiAgICAgICAgY3VycmVudFRpbWVTZWVrQmFyID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuc21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIuY2xlYXIoKTtcbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgc3RhcnRTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9QTEFZSU5HLCBzdGFydFNtb290aFBsYXliYWNrUG9zaXRpb25VcGRhdGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QQVVTRUQsIHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9QQVVTRUQsIHN0b3BTbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU0VFS0VELCAoKSA9PiB7XG4gICAgICBjdXJyZW50VGltZVNlZWtCYXIgPSBwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICB9KTtcblxuICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgIHN0YXJ0U21vb3RoUGxheWJhY2tQb3NpdGlvblVwZGF0ZXIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZU1hcmtlcnMocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgY2xlYXJNYXJrZXJzID0gKCkgPT4ge1xuICAgICAgdGhpcy50aW1lbGluZU1hcmtlcnMgPSBbXTtcbiAgICAgIHRoaXMudXBkYXRlTWFya2VycygpO1xuICAgIH07XG5cbiAgICBsZXQgc2V0dXBNYXJrZXJzID0gKCkgPT4ge1xuICAgICAgY2xlYXJNYXJrZXJzKCk7XG5cbiAgICAgIGxldCBoYXNNYXJrZXJzSW5VaUNvbmZpZyA9IHVpbWFuYWdlci5nZXRDb25maWcoKS5tZXRhZGF0YSAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2Vyc1xuICAgICAgICAmJiB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2Vycy5sZW5ndGggPiAwO1xuICAgICAgbGV0IGhhc01hcmtlcnNJblBsYXllckNvbmZpZyA9IHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UgJiYgcGxheWVyLmdldENvbmZpZygpLnNvdXJjZS5tYXJrZXJzXG4gICAgICAgICYmIHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UubWFya2Vycy5sZW5ndGggPiAwO1xuXG4gICAgICAvLyBUYWtlIG1hcmtlcnMgZnJvbSB0aGUgVUkgY29uZmlnLiBJZiBubyBtYXJrZXJzIGRlZmluZWQsIHRyeSB0byB0YWtlIHRoZW0gZnJvbSB0aGUgcGxheWVyJ3Mgc291cmNlIGNvbmZpZy5cbiAgICAgIGxldCBtYXJrZXJzID0gaGFzTWFya2Vyc0luVWlDb25maWcgPyB1aW1hbmFnZXIuZ2V0Q29uZmlnKCkubWV0YWRhdGEubWFya2VycyA6XG4gICAgICAgIGhhc01hcmtlcnNJblBsYXllckNvbmZpZyA/IHBsYXllci5nZXRDb25maWcoKS5zb3VyY2UubWFya2VycyA6IG51bGw7XG5cbiAgICAgIC8vIEdlbmVyYXRlIHRpbWVsaW5lIG1hcmtlcnMgZnJvbSB0aGUgY29uZmlnIGlmIHdlIGhhdmUgbWFya2VycyBhbmQgaWYgd2UgaGF2ZSBhIGR1cmF0aW9uXG4gICAgICAvLyBUaGUgZHVyYXRpb24gY2hlY2sgaXMgZm9yIGJ1Z2d5IHBsYXRmb3JtcyB3aGVyZSB0aGUgZHVyYXRpb24gaXMgbm90IGF2YWlsYWJsZSBpbnN0YW50bHkgKENocm9tZSBvbiBBbmRyb2lkIDQuMylcbiAgICAgIGlmIChtYXJrZXJzICYmIHBsYXllci5nZXREdXJhdGlvbigpICE9PSBJbmZpbml0eSkge1xuICAgICAgICBsZXQgZHVyYXRpb24gPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKVxuICAgICAgICBmb3IgKGxldCBvIG9mIG1hcmtlcnMpIHtcbiAgICAgICAgICBsZXQgbWFya2VyID0ge1xuICAgICAgICAgICAgdGltZTogby50aW1lLFxuICAgICAgICAgICAgdGltZVBlcmNlbnRhZ2U6IDEwMCAvIGR1cmF0aW9uICogby50aW1lLCAvLyBjb252ZXJ0IHRpbWUgdG8gcGVyY2VudGFnZVxuICAgICAgICAgICAgdGl0bGU6IG8udGl0bGUsXG4gICAgICAgICAgICBtYXJrZXJUeXBlOiBvLm1hcmtlclR5cGUgfHwgJ2RlZmF1bHQnLFxuICAgICAgICAgICAgY29tbWVudDogby5jb21tZW50IHx8ICcnLFxuICAgICAgICAgICAgYXZhdGFyOiBvLmF2YXRhcixcbiAgICAgICAgICAgIG51bWJlcjogby5udW1iZXIgfHwgJydcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50aW1lbGluZU1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHRpbWVsaW5lIHdpdGggdGhlIG1hcmtlcnNcbiAgICAgIHRoaXMudXBkYXRlTWFya2VycygpO1xuICAgIH07XG5cbiAgICAvLyBBZGQgbWFya2VycyB3aGVuIGEgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBzZXR1cE1hcmtlcnMpO1xuICAgIC8vIFJlbW92ZSBtYXJrZXJzIHdoZW4gdW5sb2FkZWRcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIGNsZWFyTWFya2Vycyk7XG5cbiAgICAvLyBJbml0IG1hcmtlcnMgYXQgc3RhcnR1cFxuICAgIHNldHVwTWFya2VycygpO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBzdXBlci5yZWxlYXNlKCk7XG5cbiAgICBpZiAodGhpcy5zbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlcikgeyAvLyBvYmplY3QgbXVzdCBub3QgbmVjZXNzYXJpbHkgZXhpc3QsIGUuZy4gaW4gdm9sdW1lIHNsaWRlciBzdWJjbGFzc1xuICAgICAgdGhpcy5zbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlci5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICBpZiAodGhpcy5jb25maWcudmVydGljYWwpIHtcbiAgICAgIHRoaXMuY29uZmlnLmNzc0NsYXNzZXMucHVzaCgndmVydGljYWwnKTtcbiAgICB9XG5cbiAgICBsZXQgc2Vla0JhckNvbnRhaW5lciA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdpZCc6IHRoaXMuY29uZmlnLmlkLFxuICAgICAgJ2NsYXNzJzogdGhpcy5nZXRDc3NDbGFzc2VzKClcbiAgICB9KTtcblxuICAgIGxldCBzZWVrQmFyID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXInKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhciA9IHNlZWtCYXI7XG5cbiAgICAvLyBJbmRpY2F0b3IgdGhhdCBzaG93cyB0aGUgYnVmZmVyIGZpbGwgbGV2ZWxcbiAgICBsZXQgc2Vla0JhckJ1ZmZlckxldmVsID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItYnVmZmVybGV2ZWwnKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhckJ1ZmZlclBvc2l0aW9uID0gc2Vla0JhckJ1ZmZlckxldmVsO1xuXG4gICAgLy8gSW5kaWNhdG9yIHRoYXQgc2hvd3MgdGhlIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb25cbiAgICBsZXQgc2Vla0JhclBsYXliYWNrUG9zaXRpb24gPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAnY2xhc3MnOiB0aGlzLnByZWZpeENzcygnc2Vla2Jhci1wbGF5YmFja3Bvc2l0aW9uJylcbiAgICB9KTtcbiAgICB0aGlzLnNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uID0gc2Vla0JhclBsYXliYWNrUG9zaXRpb247XG5cbiAgICAvLyBBIG1hcmtlciBvZiB0aGUgY3VycmVudCBwbGF5YmFjayBwb3NpdGlvbiwgZS5nLiBhIGRvdCBvciBsaW5lXG4gICAgbGV0IHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItcGxheWJhY2twb3NpdGlvbi1tYXJrZXInKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhclBsYXliYWNrUG9zaXRpb25NYXJrZXIgPSBzZWVrQmFyUGxheWJhY2tQb3NpdGlvbk1hcmtlcjtcblxuICAgIC8vIEluZGljYXRvciB0aGF0IHNob3cgd2hlcmUgYSBzZWVrIHdpbGwgZ28gdG9cbiAgICBsZXQgc2Vla0JhclNlZWtQb3NpdGlvbiA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLXNlZWtwb3NpdGlvbicpXG4gICAgfSk7XG4gICAgdGhpcy5zZWVrQmFyU2Vla1Bvc2l0aW9uID0gc2Vla0JhclNlZWtQb3NpdGlvbjtcblxuICAgIC8vIEluZGljYXRvciB0aGF0IHNob3dzIHRoZSBmdWxsIHNlZWtiYXJcbiAgICBsZXQgc2Vla0JhckJhY2tkcm9wID0gbmV3IERPTSgnZGl2Jywge1xuICAgICAgJ2NsYXNzJzogdGhpcy5wcmVmaXhDc3MoJ3NlZWtiYXItYmFja2Ryb3AnKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0JhckJhY2tkcm9wID0gc2Vla0JhckJhY2tkcm9wO1xuXG4gICAgbGV0IHNlZWtCYXJDaGFwdGVyTWFya2Vyc0NvbnRhaW5lciA9IG5ldyBET00oJ2RpdicsIHtcbiAgICAgICdjbGFzcyc6IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLW1hcmtlcnMnKVxuICAgIH0pO1xuICAgIHRoaXMuc2Vla0Jhck1hcmtlcnNDb250YWluZXIgPSBzZWVrQmFyQ2hhcHRlck1hcmtlcnNDb250YWluZXI7XG5cbiAgICBzZWVrQmFyLmFwcGVuZChzZWVrQmFyQmFja2Ryb3AsIHNlZWtCYXJCdWZmZXJMZXZlbCwgc2Vla0JhclNlZWtQb3NpdGlvbixcbiAgICAgIHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uLCBzZWVrQmFyQ2hhcHRlck1hcmtlcnNDb250YWluZXIsIHNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyKTtcblxuICAgIGxldCBzZWVraW5nID0gZmFsc2U7XG5cbiAgICAvLyBEZWZpbmUgaGFuZGxlciBmdW5jdGlvbnMgc28gd2UgY2FuIGF0dGFjaC9yZW1vdmUgdGhlbSBsYXRlclxuICAgIGxldCBtb3VzZVRvdWNoTW92ZUhhbmRsZXIgPSAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW9uIHRvIFZSIGhhbmRsZXJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGxldCB0YXJnZXRQZXJjZW50YWdlID0gMTAwICogdGhpcy5nZXRPZmZzZXQoZSk7XG4gICAgICBzZWVrQmFyLmRpc3BhdGNoU21hc2hjdXRQbGF5ZXJVaUV2ZW50KHtcbiAgICAgICAgYWN0aW9uOiAnc2Vla2luZy1jaGFuZ2UnLFxuICAgICAgICBlLFxuICAgICAgICBwb3NpdGlvbjogdGFyZ2V0UGVyY2VudGFnZSxcbiAgICAgICAgb3JpZ2luYXRvcjogJ1NlZWtCYXInXG4gICAgICB9KVxuICAgICAgdGhpcy5zZXRTZWVrUG9zaXRpb24odGFyZ2V0UGVyY2VudGFnZSk7XG4gICAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24odGFyZ2V0UGVyY2VudGFnZSk7XG4gICAgICB0aGlzLm9uU2Vla1ByZXZpZXdFdmVudCh0YXJnZXRQZXJjZW50YWdlLCB0cnVlKTtcbiAgICB9O1xuICAgIGxldCBtb3VzZVRvdWNoVXBIYW5kbGVyID0gKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIC8vIFJlbW92ZSBoYW5kbGVycywgc2VlayBvcGVyYXRpb24gaXMgZmluaXNoZWRcbiAgICAgIG5ldyBET00oZG9jdW1lbnQpLm9mZigndG91Y2htb3ZlIG1vdXNlbW92ZScsIG1vdXNlVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICBuZXcgRE9NKGRvY3VtZW50KS5vZmYoJ3RvdWNoZW5kIG1vdXNldXAnLCBtb3VzZVRvdWNoVXBIYW5kbGVyKTtcblxuICAgICAgbGV0IHRhcmdldFBlcmNlbnRhZ2UgPSAxMDAgKiB0aGlzLmdldE9mZnNldChlKTtcbiAgICAgIGxldCBzbmFwcGVkQ2hhcHRlciA9IHRoaXMuZ2V0TWFya2VyQXRQb3NpdGlvbih0YXJnZXRQZXJjZW50YWdlKTtcblxuICAgICAgc2Vla0Jhci5kaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudCh7XG4gICAgICAgIGFjdGlvbjogJ3NlZWtpbmctZW5kJyxcbiAgICAgICAgZSxcbiAgICAgICAgcG9zaXRpb246IHRhcmdldFBlcmNlbnRhZ2UsXG4gICAgICAgIG9yaWdpbmF0b3I6ICdTZWVrQmFyJ1xuICAgICAgfSlcblxuICAgICAgdGhpcy5zZXRTZWVraW5nKGZhbHNlKTtcbiAgICAgIHNlZWtpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gRmlyZSBzZWVrZWQgZXZlbnRcbiAgICAgIHRoaXMub25TZWVrZWRFdmVudChzbmFwcGVkQ2hhcHRlciA/IHNuYXBwZWRDaGFwdGVyLnRpbWVQZXJjZW50YWdlIDogdGFyZ2V0UGVyY2VudGFnZSk7XG4gICAgfTtcblxuICAgIC8vIEEgc2VlayBhbHdheXMgc3RhcnQgd2l0aCBhIHRvdWNoc3RhcnQgb3IgbW91c2Vkb3duIGRpcmVjdGx5IG9uIHRoZSBzZWVrYmFyLlxuICAgIC8vIFRvIHRyYWNrIGEgbW91c2Ugc2VlayBhbHNvIG91dHNpZGUgdGhlIHNlZWtiYXIgKGZvciB0b3VjaCBldmVudHMgdGhpcyB3b3JrcyBhdXRvbWF0aWNhbGx5KSxcbiAgICAvLyBzbyB0aGUgdXNlciBkb2VzIG5vdCBuZWVkIHRvIHRha2UgY2FyZSB0aGF0IHRoZSBtb3VzZSBhbHdheXMgc3RheXMgb24gdGhlIHNlZWtiYXIsIHdlIGF0dGFjaCB0aGUgbW91c2Vtb3ZlXG4gICAgLy8gYW5kIG1vdXNldXAgaGFuZGxlcnMgdG8gdGhlIHdob2xlIGRvY3VtZW50LiBBIHNlZWsgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgbGlmdHMgdGhlIG1vdXNlIGtleS5cbiAgICAvLyBBIHNlZWsgbW91c2UgZ2VzdHVyZSBpcyB0aHVzIGJhc2ljYWxseSBhIGNsaWNrIHdpdGggYSBsb25nIHRpbWUgZnJhbWUgYmV0d2VlbiBkb3duIGFuZCB1cCBldmVudHMuXG4gICAgc2Vla0Jhci5vbigndG91Y2hzdGFydCBtb3VzZWRvd24nLCAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCBpc1RvdWNoRXZlbnQgPSB0aGlzLnRvdWNoU3VwcG9ydGVkICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50O1xuXG4gICAgICAvLyBQcmV2ZW50IHNlbGVjdGlvbiBvZiBET00gZWxlbWVudHMgKGFsc28gcHJldmVudHMgbW91c2Vkb3duIGlmIGN1cnJlbnQgZXZlbnQgaXMgdG91Y2hzdGFydClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW9uIHRvIFZSIGhhbmRsZXJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHNlZWtCYXIuZGlzcGF0Y2hTbWFzaGN1dFBsYXllclVpRXZlbnQoe2FjdGlvbjogJ3NlZWtpbmctc3RhcnQnLCBlLCBvcmlnaW5hdG9yOiAnU2Vla0Jhcid9KVxuXG4gICAgICB0aGlzLnNldFNlZWtpbmcodHJ1ZSk7IC8vIFNldCBzZWVraW5nIGNsYXNzIG9uIERPTSBlbGVtZW50XG4gICAgICBzZWVraW5nID0gdHJ1ZTsgLy8gU2V0IHNlZWsgdHJhY2tpbmcgZmxhZ1xuXG4gICAgICAvLyBGaXJlIHNlZWtlZCBldmVudFxuICAgICAgdGhpcy5vblNlZWtFdmVudCgpO1xuXG4gICAgICAvLyBBZGQgaGFuZGxlciB0byB0cmFjayB0aGUgc2VlayBvcGVyYXRpb24gb3ZlciB0aGUgd2hvbGUgZG9jdW1lbnRcbiAgICAgIG5ldyBET00oZG9jdW1lbnQpLm9uKGlzVG91Y2hFdmVudCA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZScsIG1vdXNlVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICBuZXcgRE9NKGRvY3VtZW50KS5vbihpc1RvdWNoRXZlbnQgPyAndG91Y2hlbmQnIDogJ21vdXNldXAnLCBtb3VzZVRvdWNoVXBIYW5kbGVyKTtcbiAgICB9KTtcblxuICAgIC8vIERpc3BsYXkgc2VlayB0YXJnZXQgaW5kaWNhdG9yIHdoZW4gbW91c2UgaG92ZXJzIG9yIGZpbmdlciBzbGlkZXMgb3ZlciBzZWVrYmFyXG4gICAgc2Vla0Jhci5vbigndG91Y2htb3ZlIG1vdXNlbW92ZScsIChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZiAoc2Vla2luZykge1xuICAgICAgICAvLyBEdXJpbmcgYSBzZWVrICh3aGVuIG1vdXNlIGlzIGRvd24gb3IgdG91Y2ggbW92ZSBhY3RpdmUpLCB3ZSBuZWVkIHRvIHN0b3AgcHJvcGFnYXRpb24gdG8gYXZvaWRcbiAgICAgICAgLy8gdGhlIFZSIHZpZXdwb3J0IHJlYWN0aW5nIHRvIHRoZSBtb3Zlcy5cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQmVjYXVzZSB0aGUgc3RvcHBlZCBwcm9wYWdhdGlvbiBpbmhpYml0cyB0aGUgZXZlbnQgb24gdGhlIGRvY3VtZW50LCB3ZSBuZWVkIHRvIGNhbGwgaXQgZnJvbSBoZXJlXG4gICAgICAgIG1vdXNlVG91Y2hNb3ZlSGFuZGxlcihlKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHBvc2l0aW9uID0gMTAwICogdGhpcy5nZXRPZmZzZXQoZSk7XG4gICAgICB0aGlzLnNldFNlZWtQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICB0aGlzLm9uU2Vla1ByZXZpZXdFdmVudChwb3NpdGlvbiwgZmFsc2UpO1xuXG4gICAgICBpZiAodGhpcy5oYXNMYWJlbCgpICYmIHRoaXMuZ2V0TGFiZWwoKS5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMuZ2V0TGFiZWwoKS5zaG93KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBIaWRlIHNlZWsgdGFyZ2V0IGluZGljYXRvciB3aGVuIG1vdXNlIG9yIGZpbmdlciBsZWF2ZXMgc2Vla2JhclxuICAgIHNlZWtCYXIub24oJ3RvdWNoZW5kIG1vdXNlbGVhdmUnLCAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5zZXRTZWVrUG9zaXRpb24oMCk7XG5cbiAgICAgIGlmICh0aGlzLmhhc0xhYmVsKCkpIHtcbiAgICAgICAgdGhpcy5nZXRMYWJlbCgpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlZWtCYXJDb250YWluZXIuYXBwZW5kKHNlZWtCYXIpO1xuXG4gICAgaWYgKHRoaXMubGFiZWwpIHtcbiAgICAgIHNlZWtCYXJDb250YWluZXIuYXBwZW5kKHRoaXMubGFiZWwuZ2V0RG9tRWxlbWVudCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2Vla0JhckNvbnRhaW5lcjtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVNYXJrZXJzKCk6IHZvaWQge1xuICAgIHRoaXMuc2Vla0Jhck1hcmtlcnNDb250YWluZXIuZW1wdHkoKTtcblxuICAgIGlmICghdGhpcy5fY29tbWVudHNPbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IG1hcmtlciBvZiB0aGlzLnRpbWVsaW5lTWFya2Vycykge1xuICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMucHJlZml4Q3NzKCdzZWVrYmFyLW1hcmtlci10eXBlLScgKyBtYXJrZXIubWFya2VyVHlwZSk7XG5cbiAgICAgIGxldCBtYXJrZXJEb20gPSBuZXcgRE9NKCdkaXYnLCB7XG4gICAgICAgICdjbGFzcyc6IGNsYXNzTmFtZSxcbiAgICAgICAgJ2RhdGEtbWFya2VyLXRpbWUnOiBTdHJpbmcobWFya2VyLnRpbWUpLFxuICAgICAgICAnZGF0YS1tYXJrZXItdGl0bGUnOiBTdHJpbmcobWFya2VyLnRpdGxlKSxcbiAgICAgIH0pLmNzcyh7XG4gICAgICAgICdsZWZ0JzogbWFya2VyLnRpbWVQZXJjZW50YWdlICsgJyUnLFxuICAgICAgfSlcbiAgICAgIHRoaXMuc2Vla0Jhck1hcmtlcnNDb250YWluZXIuYXBwZW5kKG1hcmtlckRvbSlcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TWFya2VyQXRQb3NpdGlvbihwZXJjZW50YWdlOiBudW1iZXIpOiBUaW1lbGluZU1hcmtlciB8IG51bGwge1xuICAgIGxldCBzbmFwcGVkTWFya2VyOiBUaW1lbGluZU1hcmtlciA9IG51bGw7XG4gICAgbGV0IHNuYXBwaW5nUmFuZ2UgPSAxO1xuICAgIGlmICh0aGlzLnRpbWVsaW5lTWFya2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCBtYXJrZXIgb2YgdGhpcy50aW1lbGluZU1hcmtlcnMpIHtcbiAgICAgICAgaWYgKHBlcmNlbnRhZ2UgPj0gbWFya2VyLnRpbWVQZXJjZW50YWdlIC0gc25hcHBpbmdSYW5nZSAmJiBwZXJjZW50YWdlIDw9IG1hcmtlci50aW1lUGVyY2VudGFnZSArIHNuYXBwaW5nUmFuZ2UpIHtcbiAgICAgICAgICBzbmFwcGVkTWFya2VyID0gbWFya2VyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNuYXBwZWRNYXJrZXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaG9yaXpvbnRhbCBvZmZzZXQgb2YgYSBtb3VzZS90b3VjaCBldmVudCBwb2ludCBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIHNlZWsgYmFyLlxuICAgKiBAcGFyYW0gZXZlbnRQYWdlWCB0aGUgcGFnZVggY29vcmRpbmF0ZSBvZiBhbiBldmVudCB0byBjYWxjdWxhdGUgdGhlIG9mZnNldCBmcm9tXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGEgbnVtYmVyIGluIHRoZSByYW5nZSBvZiBbMCwgMV0sIHdoZXJlIDAgaXMgdGhlIGxlZnQgZWRnZSBhbmQgMSBpcyB0aGUgcmlnaHQgZWRnZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRIb3Jpem9udGFsT2Zmc2V0KGV2ZW50UGFnZVg6IG51bWJlcik6IG51bWJlciB7XG4gICAgbGV0IGVsZW1lbnRPZmZzZXRQeCA9IHRoaXMuc2Vla0Jhci5vZmZzZXQoKS5sZWZ0O1xuICAgIGxldCB3aWR0aFB4ID0gdGhpcy5zZWVrQmFyLndpZHRoKCk7XG4gICAgbGV0IG9mZnNldFB4ID0gZXZlbnRQYWdlWCAtIGVsZW1lbnRPZmZzZXRQeDtcbiAgICBsZXQgb2Zmc2V0ID0gMSAvIHdpZHRoUHggKiBvZmZzZXRQeDtcblxuICAgIHJldHVybiB0aGlzLnNhbml0aXplT2Zmc2V0KG9mZnNldCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmVydGljYWwgb2Zmc2V0IG9mIGEgbW91c2UvdG91Y2ggZXZlbnQgcG9pbnQgZnJvbSB0aGUgYm90dG9tIGVkZ2Ugb2YgdGhlIHNlZWsgYmFyLlxuICAgKiBAcGFyYW0gZXZlbnRQYWdlWSB0aGUgcGFnZVggY29vcmRpbmF0ZSBvZiBhbiBldmVudCB0byBjYWxjdWxhdGUgdGhlIG9mZnNldCBmcm9tXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGEgbnVtYmVyIGluIHRoZSByYW5nZSBvZiBbMCwgMV0sIHdoZXJlIDAgaXMgdGhlIGJvdHRvbSBlZGdlIGFuZCAxIGlzIHRoZSB0b3AgZWRnZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRWZXJ0aWNhbE9mZnNldChldmVudFBhZ2VZOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGxldCBlbGVtZW50T2Zmc2V0UHggPSB0aGlzLnNlZWtCYXIub2Zmc2V0KCkudG9wO1xuICAgIGxldCB3aWR0aFB4ID0gdGhpcy5zZWVrQmFyLmhlaWdodCgpO1xuICAgIGxldCBvZmZzZXRQeCA9IGV2ZW50UGFnZVkgLSBlbGVtZW50T2Zmc2V0UHg7XG4gICAgbGV0IG9mZnNldCA9IDEgLyB3aWR0aFB4ICogb2Zmc2V0UHg7XG5cbiAgICByZXR1cm4gMSAtIHRoaXMuc2FuaXRpemVPZmZzZXQob2Zmc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtb3VzZSBvciB0b3VjaCBldmVudCBvZmZzZXQgZm9yIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gKGhvcml6b250YWwgb3IgdmVydGljYWwpLlxuICAgKiBAcGFyYW0gZSB0aGUgZXZlbnQgdG8gY2FsY3VsYXRlIHRoZSBvZmZzZXQgZnJvbVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBhIG51bWJlciBpbiB0aGUgcmFuZ2Ugb2YgWzAsIDFdXG4gICAqIEBzZWUgI2dldEhvcml6b250YWxPZmZzZXRcbiAgICogQHNlZSAjZ2V0VmVydGljYWxPZmZzZXRcbiAgICovXG4gIHByaXZhdGUgZ2V0T2Zmc2V0KGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy50b3VjaFN1cHBvcnRlZCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnZlcnRpY2FsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZlcnRpY2FsT2Zmc2V0KGUudHlwZSA9PT0gJ3RvdWNoZW5kJyA/IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVkgOiBlLnRvdWNoZXNbMF0ucGFnZVkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SG9yaXpvbnRhbE9mZnNldChlLnR5cGUgPT09ICd0b3VjaGVuZCcgPyBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYIDogZS50b3VjaGVzWzBdLnBhZ2VYKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLmNvbmZpZy52ZXJ0aWNhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWZXJ0aWNhbE9mZnNldChlLnBhZ2VZKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhvcml6b250YWxPZmZzZXQoZS5wYWdlWCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdpbnZhbGlkIGV2ZW50Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemVzIHRoZSBtb3VzZSBvZmZzZXQgdG8gdGhlIHJhbmdlIG9mIFswLCAxXS5cbiAgICpcbiAgICogV2hlbiB0cmFja2luZyB0aGUgbW91c2Ugb3V0c2lkZSB0aGUgc2VlayBiYXIsIHRoZSBvZmZzZXQgY2FuIGJlIG91dHNpZGUgdGhlIGRlc2lyZWQgcmFuZ2UgYW5kIHRoaXMgbWV0aG9kXG4gICAqIGxpbWl0cyBpdCB0byB0aGUgZGVzaXJlZCByYW5nZS4gRS5nLiBhIG1vdXNlIGV2ZW50IGxlZnQgb2YgdGhlIGxlZnQgZWRnZSBvZiBhIHNlZWsgYmFyIHlpZWxkcyBhbiBvZmZzZXQgYmVsb3dcbiAgICogemVybywgYnV0IHRvIGRpc3BsYXkgdGhlIHNlZWsgdGFyZ2V0IG9uIHRoZSBzZWVrIGJhciwgd2UgbmVlZCB0byBsaW1pdCBpdCB0byB6ZXJvLlxuICAgKlxuICAgKiBAcGFyYW0gb2Zmc2V0IHRoZSBvZmZzZXQgdG8gc2FuaXRpemVcbiAgICogQHJldHVybnMge251bWJlcn0gdGhlIHNhbml0aXplZCBvZmZzZXQuXG4gICAqL1xuICBwcml2YXRlIHNhbml0aXplT2Zmc2V0KG9mZnNldDogbnVtYmVyKSB7XG4gICAgLy8gU2luY2Ugd2UgdHJhY2sgbW91c2UgbW92ZXMgb3ZlciB0aGUgd2hvbGUgZG9jdW1lbnQsIHRoZSB0YXJnZXQgY2FuIGJlIG91dHNpZGUgdGhlIHNlZWsgcmFuZ2UsXG4gICAgLy8gYW5kIHdlIG5lZWQgdG8gbGltaXQgaXQgdG8gdGhlIFswLCAxXSByYW5nZS5cbiAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgb2Zmc2V0ID0gMDtcbiAgICB9IGVsc2UgaWYgKG9mZnNldCA+IDEpIHtcbiAgICAgIG9mZnNldCA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcGxheWJhY2sgcG9zaXRpb24gaW5kaWNhdG9yLlxuICAgKiBAcGFyYW0gcGVyY2VudCBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEwMCBhcyByZXR1cm5lZCBieSB0aGUgcGxheWVyXG4gICAqL1xuICBzZXRQbGF5YmFja1Bvc2l0aW9uKHBlcmNlbnQ6IG51bWJlcikge1xuICAgIHRoaXMucGxheWJhY2tQb3NpdGlvblBlcmNlbnRhZ2UgPSBwZXJjZW50O1xuXG4gICAgLy8gU2V0IHBvc2l0aW9uIG9mIHRoZSBiYXJcbiAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc2Vla0JhclBsYXliYWNrUG9zaXRpb24sIHBlcmNlbnQpO1xuXG4gICAgLy8gU2V0IHBvc2l0aW9uIG9mIHRoZSBtYXJrZXJcbiAgICBsZXQgcHggPSAodGhpcy5jb25maWcudmVydGljYWwgPyB0aGlzLnNlZWtCYXIuaGVpZ2h0KCkgOiB0aGlzLnNlZWtCYXIud2lkdGgoKSkgLyAxMDAgKiBwZXJjZW50O1xuICAgIGlmICh0aGlzLmNvbmZpZy52ZXJ0aWNhbCkge1xuICAgICAgcHggPSB0aGlzLnNlZWtCYXIuaGVpZ2h0KCkgLSBweDtcbiAgICB9XG4gICAgbGV0IHN0eWxlID0gdGhpcy5jb25maWcudmVydGljYWwgP1xuICAgICAgLy8gLW1zLXRyYW5zZm9ybSByZXF1aXJlZCBmb3IgSUU5XG4gICAgICB7J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKCcgKyBweCArICdweCknLCAnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVZKCcgKyBweCArICdweCknfSA6XG4gICAgICB7J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcgKyBweCArICdweCknLCAnLW1zLXRyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKCcgKyBweCArICdweCknfTtcbiAgICB0aGlzLnNlZWtCYXJQbGF5YmFja1Bvc2l0aW9uTWFya2VyLmNzcyhzdHlsZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVmcmVzaGVzIHRoZSBwbGF5YmFjayBwb3NpdGlvbi4gQ2FuIGJlIHVzZWQgYnkgc3ViY2xhc3NlcyB0byByZWZyZXNoIHRoZSBwb3NpdGlvbiB3aGVuXG4gICAqIHRoZSBzaXplIG9mIHRoZSBjb21wb25lbnQgY2hhbmdlcy5cbiAgICovXG4gIHByb3RlY3RlZCByZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpIHtcbiAgICB0aGlzLnNldFBsYXliYWNrUG9zaXRpb24odGhpcy5wbGF5YmFja1Bvc2l0aW9uUGVyY2VudGFnZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcG9zaXRpb24gdW50aWwgd2hpY2ggbWVkaWEgaXMgYnVmZmVyZWQuXG4gICAqIEBwYXJhbSBwZXJjZW50IGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMTAwXG4gICAqL1xuICBzZXRCdWZmZXJQb3NpdGlvbihwZXJjZW50OiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMuc2Vla0JhckJ1ZmZlclBvc2l0aW9uLCBwZXJjZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwb3NpdGlvbiB3aGVyZSBhIHNlZWssIGlmIGV4ZWN1dGVkLCB3b3VsZCBqdW1wIHRvLlxuICAgKiBAcGFyYW0gcGVyY2VudCBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEwMFxuICAgKi9cbiAgc2V0U2Vla1Bvc2l0aW9uKHBlcmNlbnQ6IG51bWJlcikge1xuICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5zZWVrQmFyU2Vla1Bvc2l0aW9uLCBwZXJjZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGFjdHVhbCBwb3NpdGlvbiAod2lkdGggb3IgaGVpZ2h0KSBvZiBhIERPTSBlbGVtZW50IHRoYXQgcmVwcmVzZW50IGEgYmFyIGluIHRoZSBzZWVrIGJhci5cbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gc2V0IHRoZSBwb3NpdGlvbiBmb3JcbiAgICogQHBhcmFtIHBlcmNlbnQgYSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxMDBcbiAgICovXG4gIHByaXZhdGUgc2V0UG9zaXRpb24oZWxlbWVudDogRE9NLCBwZXJjZW50OiBudW1iZXIpIHtcbiAgICBsZXQgc2NhbGUgPSBwZXJjZW50IC8gMTAwO1xuICAgIGxldCBzdHlsZSA9IHRoaXMuY29uZmlnLnZlcnRpY2FsID9cbiAgICAgIC8vIC1tcy10cmFuc2Zvcm0gcmVxdWlyZWQgZm9yIElFOVxuICAgICAgeyd0cmFuc2Zvcm0nOiAnc2NhbGVZKCcgKyBzY2FsZSArICcpJywgJy1tcy10cmFuc2Zvcm0nOiAnc2NhbGVZKCcgKyBzY2FsZSArICcpJ30gOlxuICAgICAgeyd0cmFuc2Zvcm0nOiAnc2NhbGVYKCcgKyBzY2FsZSArICcpJywgJy1tcy10cmFuc2Zvcm0nOiAnc2NhbGVYKCcgKyBzY2FsZSArICcpJ307XG4gICAgZWxlbWVudC5jc3Moc3R5bGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1dHMgdGhlIHNlZWsgYmFyIGludG8gb3Igb3V0IG9mIHNlZWtpbmcgc3RhdGUgYnkgYWRkaW5nL3JlbW92aW5nIGEgY2xhc3MgdG8gdGhlIERPTSBlbGVtZW50LiBUaGlzIGNhbiBiZSB1c2VkXG4gICAqIHRvIGFkanVzdCB0aGUgc3R5bGluZyB3aGlsZSBzZWVraW5nLlxuICAgKlxuICAgKiBAcGFyYW0gc2Vla2luZyBzaG91bGQgYmUgdHJ1ZSB3aGVuIGVudGVyaW5nIHNlZWsgc3RhdGUsIGZhbHNlIHdoZW4gZXhpdGluZyB0aGUgc2VlayBzdGF0ZVxuICAgKi9cbiAgc2V0U2Vla2luZyhzZWVraW5nOiBib29sZWFuKSB7XG4gICAgaWYgKHNlZWtpbmcpIHtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFNlZWtCYXIuQ0xBU1NfU0VFS0lORykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhTZWVrQmFyLkNMQVNTX1NFRUtJTkcpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzZWVrIGJhciBpcyBjdXJyZW50bHkgaW4gdGhlIHNlZWsgc3RhdGUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluIHNlZWsgc3RhdGUsIGVsc2UgZmFsc2VcbiAgICovXG4gIGlzU2Vla2luZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXREb21FbGVtZW50KCkuaGFzQ2xhc3ModGhpcy5wcmVmaXhDc3MoU2Vla0Jhci5DTEFTU19TRUVLSU5HKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzZWVrIGJhciBoYXMgYSB7QGxpbmsgU2Vla0JhckxhYmVsfS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHNlZWsgYmFyIGhhcyBhIGxhYmVsLCBlbHNlIGZhbHNlXG4gICAqL1xuICBoYXNMYWJlbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbCAhPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxhYmVsIG9mIHRoaXMgc2VlayBiYXIuXG4gICAqIEByZXR1cm5zIHtTZWVrQmFyTGFiZWx9IHRoZSBsYWJlbCBpZiB0aGlzIHNlZWsgYmFyIGhhcyBhIGxhYmVsLCBlbHNlIG51bGxcbiAgICovXG4gIGdldExhYmVsKCk6IFNlZWtCYXJMYWJlbCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmxhYmVsO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uU2Vla0V2ZW50KCkge1xuICAgIHRoaXMuc2Vla0JhckV2ZW50cy5vblNlZWsuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25TZWVrUHJldmlld0V2ZW50KHBlcmNlbnRhZ2U6IG51bWJlciwgc2NydWJiaW5nOiBib29sZWFuKSB7XG4gICAgbGV0IHNuYXBwZWRNYXJrZXIgPSB0aGlzLmdldE1hcmtlckF0UG9zaXRpb24ocGVyY2VudGFnZSk7XG5cbiAgICBpZiAodGhpcy5sYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbC5nZXREb21FbGVtZW50KCkuY3NzKHtcbiAgICAgICAgJ2xlZnQnOiAoc25hcHBlZE1hcmtlciA/IHNuYXBwZWRNYXJrZXIudGltZVBlcmNlbnRhZ2UgOiBwZXJjZW50YWdlKSArICclJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWVrQmFyRXZlbnRzLm9uU2Vla1ByZXZpZXcuZGlzcGF0Y2godGhpcywge1xuICAgICAgc2NydWJiaW5nOiBzY3J1YmJpbmcsXG4gICAgICBwb3NpdGlvbjogcGVyY2VudGFnZSxcbiAgICAgIG1hcmtlcjogc25hcHBlZE1hcmtlcixcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblNlZWtlZEV2ZW50KHBlcmNlbnRhZ2U6IG51bWJlcikge1xuICAgIHRoaXMuc2Vla0JhckV2ZW50cy5vblNlZWtlZC5kaXNwYXRjaCh0aGlzLCBwZXJjZW50YWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gYSBzY3J1YmJpbmcgc2VlayBvcGVyYXRpb24gaXMgc3RhcnRlZC5cbiAgICogQHJldHVybnMge0V2ZW50PFNlZWtCYXIsIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25TZWVrKCk6IEV2ZW50PFNlZWtCYXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCBkdXJpbmcgYSBzY3J1YmJpbmcgc2VlayAodG8gaW5kaWNhdGUgdGhhdCB0aGUgc2VlayBwcmV2aWV3LCBpLmUuIHRoZSB2aWRlbyBmcmFtZSxcbiAgICogc2hvdWxkIGJlIHVwZGF0ZWQpLCBvciBkdXJpbmcgYSBub3JtYWwgc2VlayBwcmV2aWV3IHdoZW4gdGhlIHNlZWsgYmFyIGlzIGhvdmVyZWQgKGFuZCB0aGUgc2VlayB0YXJnZXQsXG4gICAqIGkuZS4gdGhlIHNlZWsgYmFyIGxhYmVsLCBzaG91bGQgYmUgdXBkYXRlZCkuXG4gICAqIEByZXR1cm5zIHtFdmVudDxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz59XG4gICAqL1xuICBnZXQgb25TZWVrUHJldmlldygpOiBFdmVudDxTZWVrQmFyLCBTZWVrUHJldmlld0V2ZW50QXJncz4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25TZWVrUHJldmlldy5nZXRFdmVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiBhIHNjcnViYmluZyBzZWVrIGhhcyBmaW5pc2hlZCBvciB3aGVuIGEgZGlyZWN0IHNlZWsgaXMgaXNzdWVkLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8U2Vla0JhciwgbnVtYmVyPn1cbiAgICovXG4gIGdldCBvblNlZWtlZCgpOiBFdmVudDxTZWVrQmFyLCBudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5zZWVrQmFyRXZlbnRzLm9uU2Vla2VkLmdldEV2ZW50KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25DaGFuZ2VDb21tZW50c09uRXZlbnQob246IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNlZWtCYXJFdmVudHMub25DaGFuZ2VDb21tZW50c09uLmRpc3BhdGNoKHRoaXMsIG9uKTtcbiAgfVxuXG4gIGdldCBvbkNoYW5nZUNvbW1lbnRzT24oKTogRXZlbnQ8U2Vla0JhciwgYm9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLnNlZWtCYXJFdmVudHMub25DaGFuZ2VDb21tZW50c09uLmdldEV2ZW50KCk7XG4gIH1cblxuICB0b2dnbGVDb21tZW50c09uKCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbW1lbnRzT24gPSAhdGhpcy5fY29tbWVudHNPbjtcbiAgICB0aGlzLm9uQ2hhbmdlQ29tbWVudHNPbkV2ZW50KHRoaXMuX2NvbW1lbnRzT24pO1xuICAgIHRoaXMudXBkYXRlTWFya2VycygpO1xuICB9XG5cbiAgZ2V0IGNvbW1lbnRzT24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1lbnRzT25cbiAgfVxuXG4gIHByb3RlY3RlZCBvblNob3dFdmVudCgpOiB2b2lkIHtcbiAgICBzdXBlci5vblNob3dFdmVudCgpO1xuXG4gICAgLy8gUmVmcmVzaCB0aGUgcG9zaXRpb24gb2YgdGhlIHBsYXliYWNrIHBvc2l0aW9uIHdoZW4gdGhlIHNlZWsgYmFyIGJlY29tZXMgdmlzaWJsZS4gVG8gY29ycmVjdGx5IHNldCB0aGUgcG9zaXRpb24sXG4gICAgLy8gdGhlIERPTSBlbGVtZW50IG11c3QgYmUgZnVsbHkgaW5pdGlhbGl6ZWQgYW4gaGF2ZSBpdHMgc2l6ZSBjYWxjdWxhdGVkLCBiZWNhdXNlIHRoZSBwb3NpdGlvbiBpcyBzZXQgYXMgYW4gYWJzb2x1dGVcbiAgICAvLyB2YWx1ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHNpemUuIFRoaXMgcmVxdWlyZWQgc2l6ZSBpcyBub3Qga25vd24gd2hlbiBpdCBpcyBoaWRkZW4uXG4gICAgLy8gRm9yIHN1Y2ggY2FzZXMsIHdlIHJlZnJlc2ggdGhlIHBvc2l0aW9uIGhlcmUgaW4gb25TaG93IGJlY2F1c2UgaGVyZSBpdCBpcyBndWFyYW50ZWVkIHRoYXQgdGhlIGNvbXBvbmVudCBrbm93c1xuICAgIC8vIGl0cyBzaXplIGFuZCBjYW4gc2V0IHRoZSBwb3NpdGlvbiBjb3JyZWN0bHkuXG4gICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlciwgU2Vla1ByZXZpZXdBcmdzfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtTdHJpbmdVdGlsc30gZnJvbSAnLi4vdXRpbHMnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBTZWVrQmFyTGFiZWx9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlZWtCYXJMYWJlbENvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8vIG5vdGhpbmcgeWV0XG59XG5cbi8qKlxuICogQSBsYWJlbCBmb3IgYSB7QGxpbmsgU2Vla0Jhcn0gdGhhdCBjYW4gZGlzcGxheSB0aGUgc2VlayB0YXJnZXQgdGltZSwgYSB0aHVtYm5haWwsIGFuZCB0aXRsZSAoZS5nLiBjaGFwdGVyIHRpdGxlKS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlZWtCYXJMYWJlbCBleHRlbmRzIENvbnRhaW5lcjxTZWVrQmFyTGFiZWxDb25maWc+IHtcblxuICBwcml2YXRlIGF2YXRhckxhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgY29tbWVudExhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgbWV0YWRhdGE6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+O1xuICBwcml2YXRlIG1lbnRvckRvdDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz47XG4gIHByaXZhdGUgbnVtYmVyTGFiZWw6IExhYmVsPExhYmVsQ29uZmlnPjtcbiAgcHJpdmF0ZSB0aHVtYm5haWw6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+O1xuICBwcml2YXRlIHRpbWVMYWJlbDogTGFiZWw8TGFiZWxDb25maWc+O1xuICBwcml2YXRlIHRpdGxlTGFiZWw6IExhYmVsPExhYmVsQ29uZmlnPjtcblxuICBwcml2YXRlIGxhYmVsQ2xhc3M6IHN0cmluZztcbiAgcHJpdmF0ZSB0aW1lRm9ybWF0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZWVrQmFyTGFiZWxDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmF2YXRhckxhYmVsID0gbmV3IExhYmVsKHtjc3NDbGFzc2VzOiBbJ3NlZWtiYXItbGFiZWwtYXZhdGFyJ119KTtcbiAgICB0aGlzLmNvbW1lbnRMYWJlbCA9IG5ldyBMYWJlbCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLWxhYmVsLWNvbW1lbnQnXX0pO1xuICAgIHRoaXMubWVudG9yRG90ID0gbmV3IENvbXBvbmVudCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLWxhYmVsLW1lbnRvci1kb3QnXX0pO1xuICAgIHRoaXMubnVtYmVyTGFiZWwgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzZXM6IFsnc2Vla2Jhci1sYWJlbC1udW1iZXInXX0pO1xuICAgIHRoaXMudGh1bWJuYWlsID0gbmV3IENvbXBvbmVudCh7Y3NzQ2xhc3NlczogWydzZWVrYmFyLXRodW1ibmFpbCddfSk7XG4gICAgdGhpcy50aW1lTGFiZWwgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzZXM6IFsnc2Vla2Jhci1sYWJlbC10aW1lJ119KTtcbiAgICB0aGlzLnRpdGxlTGFiZWwgPSBuZXcgTGFiZWwoe2Nzc0NsYXNzZXM6IFsnc2Vla2Jhci1sYWJlbC10aXRsZSddfSk7XG5cbiAgICB0aGlzLm1ldGFkYXRhID0gbmV3IENvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIHRoaXMuYXZhdGFyTGFiZWwsXG4gICAgICAgICAgICB0aGlzLnRpdGxlTGFiZWwsXG4gICAgICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgICAgIHRoaXMubWVudG9yRG90LFxuICAgICAgICAgICAgICAgIHRoaXMubnVtYmVyTGFiZWxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgY3NzQ2xhc3M6ICdzZWVrYmFyLWxhYmVsLW51bWJlci1jb250YWluZXInLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzOiAnc2Vla2Jhci1sYWJlbC1tZXRhZGF0YS10aXRsZScsXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRMYWJlbCxcbiAgICAgICAgICAgIHRoaXMudGltZUxhYmVsXSxcbiAgICAgICAgICBjc3NDbGFzczogJ3NlZWtiYXItbGFiZWwtbWV0YWRhdGEtY29udGVudCcsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICAgIGNzc0NsYXNzOiAnc2Vla2Jhci1sYWJlbC1tZXRhZGF0YSdcbiAgICB9KTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc2Vla2Jhci1sYWJlbCcsXG4gICAgICBjb21wb25lbnRzOiBbbmV3IENvbnRhaW5lcih7XG4gICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICB0aGlzLnRodW1ibmFpbCxcbiAgICAgICAgICB0aGlzLm1ldGFkYXRhXG4gICAgICAgIF0sXG4gICAgICAgIGNzc0NsYXNzOiAnc2Vla2Jhci1sYWJlbC1pbm5lcicsXG4gICAgICB9KV0sXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdWltYW5hZ2VyLm9uU2Vla1ByZXZpZXcuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3M6IFNlZWtQcmV2aWV3QXJncykgPT4ge1xuICAgICAgaWYgKHBsYXllci5pc0xpdmUoKSkge1xuICAgICAgICBsZXQgdGltZSA9IHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAtIHBsYXllci5nZXRNYXhUaW1lU2hpZnQoKSAqIChhcmdzLnBvc2l0aW9uIC8gMTAwKTtcbiAgICAgICAgdGhpcy5zZXRUaW1lKHRpbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGFyZ3MubWFya2VyKSB7XG4gICAgICAgICAgdGhpcy5zZXRMYWJlbENsYXNzKGFyZ3MubWFya2VyLm1hcmtlclR5cGUpXG4gICAgICAgICAgdGhpcy5zZXRUaXRsZVRleHQoYXJncy5tYXJrZXIudGl0bGUpO1xuICAgICAgICAgIHRoaXMuc2V0U21hc2hjdXREYXRhKGFyZ3MubWFya2VyKTtcbiAgICAgICAgICB0aGlzLnNldFRpbWVUZXh0KG51bGwpO1xuICAgICAgICAgIHRoaXMuc2V0VGh1bWJuYWlsKG51bGwpO1xuICAgICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZCh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldExhYmVsQ2xhc3MoJ3RodW1ibmFpbCcpXG4gICAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBhcmdzLnBvc2l0aW9uO1xuICAgICAgICAgIHRoaXMuc2V0VGl0bGVUZXh0KG51bGwpO1xuICAgICAgICAgIHRoaXMuc2V0U21hc2hjdXREYXRhKG51bGwpO1xuICAgICAgICAgIGxldCB0aW1lID0gcGxheWVyLmdldER1cmF0aW9uKCkgKiAocGVyY2VudGFnZSAvIDEwMCk7XG4gICAgICAgICAgdGhpcy5zZXRUaW1lKHRpbWUpO1xuICAgICAgICAgIHRoaXMuc2V0VGh1bWJuYWlsKHBsYXllci5nZXRUaHVtYih0aW1lKSk7XG4gICAgICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGluaXQgPSAoKSA9PiB7XG4gICAgICAvLyBTZXQgdGltZSBmb3JtYXQgZGVwZW5kaW5nIG9uIHNvdXJjZSBkdXJhdGlvblxuICAgICAgdGhpcy50aW1lRm9ybWF0ID0gTWF0aC5hYnMocGxheWVyLmlzTGl2ZSgpID8gcGxheWVyLmdldE1heFRpbWVTaGlmdCgpIDogcGxheWVyLmdldER1cmF0aW9uKCkpID49IDM2MDAgP1xuICAgICAgICBTdHJpbmdVdGlscy5GT1JNQVRfSEhNTVNTIDogU3RyaW5nVXRpbHMuRk9STUFUX01NU1M7XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCBpbml0KTtcbiAgICBpbml0KCk7XG4gIH1cblxuICBzZXRMYWJlbENsYXNzKG5ld0xhYmVsQ2xhc3M6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmxhYmVsQ2xhc3MpIHtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKHRoaXMubGFiZWxDbGFzcykpXG4gICAgfVxuICAgIHRoaXMubGFiZWxDbGFzcyA9IG5ld0xhYmVsQ2xhc3NcbiAgICBpZiAodGhpcy5sYWJlbENsYXNzKSB7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyh0aGlzLmxhYmVsQ2xhc3MpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFyYml0cmFyeSB0ZXh0IG9uIHRoZSBsYWJlbC5cbiAgICogQHBhcmFtIHRleHQgdGhlIHRleHQgdG8gc2hvdyBvbiB0aGUgbGFiZWxcbiAgICovXG4gIHNldFRpbWVUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMudGltZUxhYmVsLnNldFRleHQodGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHRpbWUgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBsYWJlbC5cbiAgICogQHBhcmFtIHNlY29uZHMgdGhlIHRpbWUgaW4gc2Vjb25kcyB0byBkaXNwbGF5IG9uIHRoZSBsYWJlbFxuICAgKi9cbiAgc2V0VGltZShzZWNvbmRzOiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFRpbWVUZXh0KFN0cmluZ1V0aWxzLnNlY29uZHNUb1RpbWUoc2Vjb25kcywgdGhpcy50aW1lRm9ybWF0KSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdGV4dCBvbiB0aGUgdGl0bGUgbGFiZWwuXG4gICAqIEBwYXJhbSB0ZXh0IHRoZSB0ZXh0IHRvIHNob3cgb24gdGhlIGxhYmVsXG4gICAqL1xuICBzZXRUaXRsZVRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy50aXRsZUxhYmVsLnNldFRleHQodGV4dCk7XG4gIH1cblxuICBzZXRTbWFzaGN1dERhdGEobWFya2VyOiBhbnkpIHtcbiAgICBpZiAobWFya2VyKSB7XG4gICAgICB0aGlzLmNvbW1lbnRMYWJlbC5zZXRUZXh0KCdcIicgKyBtYXJrZXIuY29tbWVudCArICdcIicpO1xuICAgICAgdGhpcy5udW1iZXJMYWJlbC5zZXRUZXh0KG1hcmtlci5udW1iZXIpO1xuICAgICAgdGhpcy5hdmF0YXJMYWJlbC5zZXRUZXh0KG1hcmtlci5hdmF0YXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbW1lbnRMYWJlbC5zZXRUZXh0KG51bGwpO1xuICAgICAgdGhpcy5udW1iZXJMYWJlbC5zZXRUZXh0KG51bGwpO1xuICAgICAgdGhpcy5hdmF0YXJMYWJlbC5zZXRUZXh0KG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIG9yIHJlbW92ZXMgYSB0aHVtYm5haWwgb24gdGhlIGxhYmVsLlxuICAgKiBAcGFyYW0gdGh1bWJuYWlsIHRoZSB0aHVtYm5haWwgdG8gZGlzcGxheSBvbiB0aGUgbGFiZWwgb3IgbnVsbCB0byByZW1vdmUgYSBkaXNwbGF5ZWQgdGh1bWJuYWlsXG4gICAqL1xuICBzZXRUaHVtYm5haWwodGh1bWJuYWlsOiBiaXRtb3Zpbi5QbGF5ZXJBUEkuVGh1bWJuYWlsID0gbnVsbCkge1xuICAgIGxldCB0aHVtYm5haWxFbGVtZW50ID0gdGhpcy50aHVtYm5haWwuZ2V0RG9tRWxlbWVudCgpO1xuXG4gICAgaWYgKHRodW1ibmFpbCA9PSBudWxsKSB7XG4gICAgICB0aHVtYm5haWxFbGVtZW50LmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogbnVsbCxcbiAgICAgICAgJ2Rpc3BsYXknOiAnbnVsbCcsXG4gICAgICAgICd3aWR0aCc6ICcxODBweCcsXG4gICAgICAgICdoZWlnaHQnOiAnbnVsbCdcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRodW1ibmFpbEVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ2Rpc3BsYXknOiAnaW5oZXJpdCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogYHVybCgke3RodW1ibmFpbC51cmx9KWAsXG4gICAgICAgICd3aWR0aCc6IHRodW1ibmFpbC53ICsgJ3B4JyxcbiAgICAgICAgJ2hlaWdodCc6IHRodW1ibmFpbC5oICsgJ3B4JyxcbiAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24nOiBgLSR7dGh1bWJuYWlsLnh9cHggLSR7dGh1bWJuYWlsLnl9cHhgXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXRCYWNrZ3JvdW5kKG9uT2ZmOiBib29sZWFuKSB7XG4gICAgbGV0IG1ldGFkYXRhRWxlbWVudCA9IHRoaXMubWV0YWRhdGEuZ2V0RG9tRWxlbWVudCgpO1xuXG4gICAgaWYgKG9uT2ZmKSB7XG4gICAgICBtZXRhZGF0YUVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ2JhY2tncm91bmQnOiAnI2ZmZicsXG4gICAgICAgICdjb2xvcic6ICcjMDAwJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbWV0YWRhdGFFbGVtZW50LmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kJzogJ2luaXRpYWwnLFxuICAgICAgICAnY29sb3InOiAnI2ZmZidcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7TGlzdFNlbGVjdG9yLCBMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuXG4vKipcbiAqIEEgc2ltcGxlIHNlbGVjdCBib3ggcHJvdmlkaW5nIHRoZSBwb3NzaWJpbGl0eSB0byBzZWxlY3QgYSBzaW5nbGUgaXRlbSBvdXQgb2YgYSBsaXN0IG9mIGF2YWlsYWJsZSBpdGVtcy5cbiAqXG4gKiBET00gZXhhbXBsZTpcbiAqIDxjb2RlPlxuICogICAgIDxzZWxlY3QgY2xhc3M9J3VpLXNlbGVjdGJveCc+XG4gKiAgICAgICAgIDxvcHRpb24gdmFsdWU9J2tleSc+bGFiZWw8L29wdGlvbj5cbiAqICAgICAgICAgLi4uXG4gKiAgICAgPC9zZWxlY3Q+XG4gKiA8L2NvZGU+XG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3RCb3ggZXh0ZW5kcyBMaXN0U2VsZWN0b3I8TGlzdFNlbGVjdG9yQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzZWxlY3RFbGVtZW50OiBET007XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMaXN0U2VsZWN0b3JDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNlbGVjdGJveCdcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IHNlbGVjdEVsZW1lbnQgPSBuZXcgRE9NKCdzZWxlY3QnLCB7XG4gICAgICAnaWQnOiB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpXG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdEVsZW1lbnQgPSBzZWxlY3RFbGVtZW50O1xuICAgIHRoaXMudXBkYXRlRG9tSXRlbXMoKTtcblxuICAgIHNlbGVjdEVsZW1lbnQub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IHNlbGVjdEVsZW1lbnQudmFsKCk7XG4gICAgICB0aGlzLm9uSXRlbVNlbGVjdGVkRXZlbnQodmFsdWUsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzZWxlY3RFbGVtZW50O1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZURvbUl0ZW1zKHNlbGVjdGVkVmFsdWU6IHN0cmluZyA9IG51bGwpIHtcbiAgICAvLyBEZWxldGUgYWxsIGNoaWxkcmVuXG4gICAgdGhpcy5zZWxlY3RFbGVtZW50LmVtcHR5KCk7XG5cbiAgICAvLyBBZGQgdXBkYXRlZCBjaGlsZHJlblxuICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xuICAgICAgbGV0IG9wdGlvbkVsZW1lbnQgPSBuZXcgRE9NKCdvcHRpb24nLCB7XG4gICAgICAgICd2YWx1ZSc6IGl0ZW0ua2V5XG4gICAgICB9KS5odG1sKGl0ZW0ubGFiZWwpO1xuXG4gICAgICBpZiAoaXRlbS5rZXkgPT09IHNlbGVjdGVkVmFsdWUgKyAnJykgeyAvLyBjb252ZXJ0IHNlbGVjdGVkVmFsdWUgdG8gc3RyaW5nIHRvIGNhdGNoICdudWxsJy9udWxsIGNhc2VcbiAgICAgICAgb3B0aW9uRWxlbWVudC5hdHRyKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlbGVjdEVsZW1lbnQuYXBwZW5kKG9wdGlvbkVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1BZGRlZEV2ZW50KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5vbkl0ZW1BZGRlZEV2ZW50KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZURvbUl0ZW1zKHRoaXMuc2VsZWN0ZWRJdGVtKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkl0ZW1SZW1vdmVkRXZlbnQodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyLm9uSXRlbVJlbW92ZWRFdmVudCh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVEb21JdGVtcyh0aGlzLnNlbGVjdGVkSXRlbSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25JdGVtU2VsZWN0ZWRFdmVudCh2YWx1ZTogc3RyaW5nLCB1cGRhdGVEb21JdGVtczogYm9vbGVhbiA9IHRydWUpIHtcbiAgICBzdXBlci5vbkl0ZW1TZWxlY3RlZEV2ZW50KHZhbHVlKTtcbiAgICBpZiAodXBkYXRlRG9tSXRlbXMpIHtcbiAgICAgIHRoaXMudXBkYXRlRG9tSXRlbXModmFsdWUpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyQ29uZmlnLCBDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7U2VsZWN0Qm94fSBmcm9tICcuL3NlbGVjdGJveCc7XG5pbXBvcnQge0xhYmVsLCBMYWJlbENvbmZpZ30gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtWaWRlb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vdmlkZW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7QXVkaW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2F1ZGlvcXVhbGl0eXNlbGVjdGJveCc7XG5pbXBvcnQge1RpbWVvdXR9IGZyb20gJy4uL3RpbWVvdXQnO1xuaW1wb3J0IHtFdmVudCwgRXZlbnREaXNwYXRjaGVyLCBOb0FyZ3N9IGZyb20gJy4uL2V2ZW50ZGlzcGF0Y2hlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIFNldHRpbmdzUGFuZWx9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzUGFuZWxDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgc2V0dGluZ3MgcGFuZWwgd2lsbCBiZSBoaWRkZW4gd2hlbiB0aGVyZSBpcyBubyB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBTZXQgdG8gLTEgdG8gZGlzYWJsZSBhdXRvbWF0aWMgaGlkaW5nLlxuICAgKiBEZWZhdWx0OiAzIHNlY29uZHMgKDMwMDApXG4gICAqL1xuICBoaWRlRGVsYXk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQSBwYW5lbCBjb250YWluaW5nIGEgbGlzdCBvZiB7QGxpbmsgU2V0dGluZ3NQYW5lbEl0ZW0gaXRlbXN9IHRoYXQgcmVwcmVzZW50IGxhYmVsbGVkIHNldHRpbmdzLlxuICovXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NQYW5lbCBleHRlbmRzIENvbnRhaW5lcjxTZXR0aW5nc1BhbmVsQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfTEFTVCA9ICdsYXN0JztcblxuICBwcml2YXRlIHNldHRpbmdzUGFuZWxFdmVudHMgPSB7XG4gICAgb25TZXR0aW5nc1N0YXRlQ2hhbmdlZDogbmV3IEV2ZW50RGlzcGF0Y2hlcjxTZXR0aW5nc1BhbmVsLCBOb0FyZ3M+KClcbiAgfTtcblxuICBwcml2YXRlIGhpZGVUaW1lb3V0OiBUaW1lb3V0O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogU2V0dGluZ3NQYW5lbENvbmZpZykge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWc8U2V0dGluZ3NQYW5lbENvbmZpZz4oY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXNldHRpbmdzLXBhbmVsJyxcbiAgICAgIGhpZGVEZWxheTogMzAwMFxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPFNldHRpbmdzUGFuZWxDb25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBmaXggZ2VuZXJpY3MgdHlwZSBpbmZlcmVuY2VcblxuICAgIGlmIChjb25maWcuaGlkZURlbGF5ID4gLTEpIHtcbiAgICAgIHRoaXMuaGlkZVRpbWVvdXQgPSBuZXcgVGltZW91dChjb25maWcuaGlkZURlbGF5LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub25TaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIEFjdGl2YXRlIHRpbWVvdXQgd2hlbiBzaG93blxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICAvLyBPbiBtb3VzZSBlbnRlciBjbGVhciB0aGUgdGltZW91dFxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICAvLyBPbiBtb3VzZSBsZWF2ZSBhY3RpdmF0ZSB0aGUgdGltZW91dFxuICAgICAgICB0aGlzLmhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMub25IaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIENsZWFyIHRpbWVvdXQgd2hlbiBoaWRkZW4gZnJvbSBvdXRzaWRlXG4gICAgICAgIHRoaXMuaGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEZpcmUgZXZlbnQgd2hlbiB0aGUgc3RhdGUgb2YgYSBzZXR0aW5ncy1pdGVtIGhhcyBjaGFuZ2VkXG4gICAgbGV0IHNldHRpbmdzU3RhdGVDaGFuZ2VkSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMub25TZXR0aW5nc1N0YXRlQ2hhbmdlZEV2ZW50KCk7XG5cbiAgICAgIC8vIEF0dGFjaCBtYXJrZXIgY2xhc3MgdG8gbGFzdCB2aXNpYmxlIGl0ZW1cbiAgICAgIGxldCBsYXN0U2hvd25JdGVtID0gbnVsbDtcbiAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldEl0ZW1zKCkpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIFNldHRpbmdzUGFuZWxJdGVtKSB7XG4gICAgICAgICAgY29tcG9uZW50LmdldERvbUVsZW1lbnQoKS5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhTZXR0aW5nc1BhbmVsLkNMQVNTX0xBU1QpKTtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmlzU2hvd24oKSkge1xuICAgICAgICAgICAgbGFzdFNob3duSXRlbSA9IGNvbXBvbmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChsYXN0U2hvd25JdGVtKSB7XG4gICAgICAgIGxhc3RTaG93bkl0ZW0uZ2V0RG9tRWxlbWVudCgpLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFNldHRpbmdzUGFuZWwuQ0xBU1NfTEFTVCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0SXRlbXMoKSkge1xuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIFNldHRpbmdzUGFuZWxJdGVtKSB7XG4gICAgICAgIGNvbXBvbmVudC5vbkFjdGl2ZUNoYW5nZWQuc3Vic2NyaWJlKHNldHRpbmdzU3RhdGVDaGFuZ2VkSGFuZGxlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBzdXBlci5yZWxlYXNlKCk7XG4gICAgaWYgKHRoaXMuaGlkZVRpbWVvdXQpIHtcbiAgICAgIHRoaXMuaGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZXJlIGFyZSBhY3RpdmUgc2V0dGluZ3Mgd2l0aGluIHRoaXMgc2V0dGluZ3MgcGFuZWwuIEFuIGFjdGl2ZSBzZXR0aW5nIGlzIGEgc2V0dGluZyB0aGF0IGlzIHZpc2libGVcbiAgICogYW5kIGVuYWJsZWQsIHdoaWNoIHRoZSB1c2VyIGNhbiBpbnRlcmFjdCB3aXRoLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBhcmUgYWN0aXZlIHNldHRpbmdzLCBmYWxzZSBpZiB0aGUgcGFuZWwgaXMgZnVuY3Rpb25hbGx5IGVtcHR5IHRvIGEgdXNlclxuICAgKi9cbiAgaGFzQWN0aXZlU2V0dGluZ3MoKTogYm9vbGVhbiB7XG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0SXRlbXMoKSkge1xuICAgICAgaWYgKGNvbXBvbmVudC5pc0FjdGl2ZSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SXRlbXMoKTogU2V0dGluZ3NQYW5lbEl0ZW1bXSB7XG4gICAgcmV0dXJuIDxTZXR0aW5nc1BhbmVsSXRlbVtdPnRoaXMuY29uZmlnLmNvbXBvbmVudHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25TZXR0aW5nc1N0YXRlQ2hhbmdlZEV2ZW50KCkge1xuICAgIHRoaXMuc2V0dGluZ3NQYW5lbEV2ZW50cy5vblNldHRpbmdzU3RhdGVDaGFuZ2VkLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiBvbmUgb3IgbW9yZSB7QGxpbmsgU2V0dGluZ3NQYW5lbEl0ZW0gaXRlbXN9IGhhdmUgY2hhbmdlZCBzdGF0ZS5cbiAgICogQHJldHVybnMge0V2ZW50PFNldHRpbmdzUGFuZWwsIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25TZXR0aW5nc1N0YXRlQ2hhbmdlZCgpOiBFdmVudDxTZXR0aW5nc1BhbmVsLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1BhbmVsRXZlbnRzLm9uU2V0dGluZ3NTdGF0ZUNoYW5nZWQuZ2V0RXZlbnQoKTtcbiAgfVxufVxuXG4vKipcbiAqIEFuIGl0ZW0gZm9yIGEge0BsaW5rIFNldHRpbmdzUGFuZWx9LCBjb250YWluaW5nIGEge0BsaW5rIExhYmVsfSBhbmQgYSBjb21wb25lbnQgdGhhdCBjb25maWd1cmVzIGEgc2V0dGluZy5cbiAqIFN1cHBvcnRlZCBzZXR0aW5nIGNvbXBvbmVudHM6IHtAbGluayBTZWxlY3RCb3h9XG4gKi9cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1BhbmVsSXRlbSBleHRlbmRzIENvbnRhaW5lcjxDb250YWluZXJDb25maWc+IHtcblxuICBwcml2YXRlIGxhYmVsOiBMYWJlbDxMYWJlbENvbmZpZz47XG4gIHByaXZhdGUgc2V0dGluZzogU2VsZWN0Qm94O1xuXG4gIHByaXZhdGUgc2V0dGluZ3NQYW5lbEl0ZW1FdmVudHMgPSB7XG4gICAgb25BY3RpdmVDaGFuZ2VkOiBuZXcgRXZlbnREaXNwYXRjaGVyPFNldHRpbmdzUGFuZWxJdGVtLCBOb0FyZ3M+KClcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihsYWJlbDogc3RyaW5nLCBzZWxlY3RCb3g6IFNlbGVjdEJveCwgY29uZmlnOiBDb250YWluZXJDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmxhYmVsID0gbmV3IExhYmVsKHsgdGV4dDogbGFiZWwgfSk7XG4gICAgdGhpcy5zZXR0aW5nID0gc2VsZWN0Qm94O1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZXR0aW5ncy1wYW5lbC1pdGVtJyxcbiAgICAgIGNvbXBvbmVudHM6IFt0aGlzLmxhYmVsLCB0aGlzLnNldHRpbmddXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgbGV0IGhhbmRsZUNvbmZpZ0l0ZW1DaGFuZ2VkID0gKCkgPT4ge1xuICAgICAgLy8gVGhlIG1pbmltdW0gbnVtYmVyIG9mIGl0ZW1zIHRoYXQgbXVzdCBiZSBhdmFpbGFibGUgZm9yIHRoZSBzZXR0aW5nIHRvIGJlIGRpc3BsYXllZFxuICAgICAgLy8gQnkgZGVmYXVsdCwgYXQgbGVhc3QgdHdvIGl0ZW1zIG11c3QgYmUgYXZhaWxhYmxlLCBlbHNlIGEgc2VsZWN0aW9uIGlzIG5vdCBwb3NzaWJsZVxuICAgICAgbGV0IG1pbkl0ZW1zVG9EaXNwbGF5ID0gMjtcbiAgICAgIC8vIEF1ZGlvL3ZpZGVvIHF1YWxpdHkgc2VsZWN0IGJveGVzIGNvbnRhaW4gYW4gYWRkaXRpb25hbCAnYXV0bycgbW9kZSwgd2hpY2ggaW4gY29tYmluYXRpb24gd2l0aCBhIHNpbmdsZVxuICAgICAgLy8gYXZhaWxhYmxlIHF1YWxpdHkgYWxzbyBkb2VzIG5vdCBtYWtlIHNlbnNlXG4gICAgICBpZiAodGhpcy5zZXR0aW5nIGluc3RhbmNlb2YgVmlkZW9RdWFsaXR5U2VsZWN0Qm94IHx8IHRoaXMuc2V0dGluZyBpbnN0YW5jZW9mIEF1ZGlvUXVhbGl0eVNlbGVjdEJveCkge1xuICAgICAgICBtaW5JdGVtc1RvRGlzcGxheSA9IDM7XG4gICAgICB9XG5cbiAgICAgIC8vIEhpZGUgdGhlIHNldHRpbmcgaWYgbm8gbWVhbmluZ2Z1bCBjaG9pY2UgaXMgYXZhaWxhYmxlXG4gICAgICBpZiAodGhpcy5zZXR0aW5nLml0ZW1Db3VudCgpIDwgbWluSXRlbXNUb0Rpc3BsYXkpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgIH1cblxuICAgICAgLy8gVmlzaWJpbGl0eSBtaWdodCBoYXZlIGNoYW5nZWQgYW5kIHRoZXJlZm9yZSB0aGUgYWN0aXZlIHN0YXRlIG1pZ2h0IGhhdmUgY2hhbmdlZCBzbyB3ZSBmaXJlIHRoZSBldmVudFxuICAgICAgLy8gVE9ETyBmaXJlIG9ubHkgd2hlbiBzdGF0ZSBoYXMgcmVhbGx5IGNoYW5nZWQgKGUuZy4gY2hlY2sgaWYgdmlzaWJpbGl0eSBoYXMgcmVhbGx5IGNoYW5nZWQpXG4gICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlZEV2ZW50KCk7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0dGluZy5vbkl0ZW1BZGRlZC5zdWJzY3JpYmUoaGFuZGxlQ29uZmlnSXRlbUNoYW5nZWQpO1xuICAgIHRoaXMuc2V0dGluZy5vbkl0ZW1SZW1vdmVkLnN1YnNjcmliZShoYW5kbGVDb25maWdJdGVtQ2hhbmdlZCk7XG5cbiAgICAvLyBJbml0aWFsaXplIGhpZGRlbiBzdGF0ZVxuICAgIGhhbmRsZUNvbmZpZ0l0ZW1DaGFuZ2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoaXMgc2V0dGluZ3MgcGFuZWwgaXRlbSBpcyBhY3RpdmUsIGkuZS4gdmlzaWJsZSBhbmQgZW5hYmxlZCBhbmQgYSB1c2VyIGNhbiBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgcGFuZWwgaXMgYWN0aXZlLCBlbHNlIGZhbHNlXG4gICAqL1xuICBpc0FjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1Nob3duKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25BY3RpdmVDaGFuZ2VkRXZlbnQoKSB7XG4gICAgdGhpcy5zZXR0aW5nc1BhbmVsSXRlbUV2ZW50cy5vbkFjdGl2ZUNoYW5nZWQuZGlzcGF0Y2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSAnYWN0aXZlJyBzdGF0ZSBvZiB0aGlzIGl0ZW0gY2hhbmdlcy5cbiAgICogQHNlZSAjaXNBY3RpdmVcbiAgICogQHJldHVybnMge0V2ZW50PFNldHRpbmdzUGFuZWxJdGVtLCBOb0FyZ3M+fVxuICAgKi9cbiAgZ2V0IG9uQWN0aXZlQ2hhbmdlZCgpOiBFdmVudDxTZXR0aW5nc1BhbmVsSXRlbSwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NQYW5lbEl0ZW1FdmVudHMub25BY3RpdmVDaGFuZ2VkLmdldEV2ZW50KCk7XG4gIH1cbn1cbiIsImltcG9ydCB7VG9nZ2xlQnV0dG9uLCBUb2dnbGVCdXR0b25Db25maWd9IGZyb20gJy4vdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U2V0dGluZ3NQYW5lbH0gZnJvbSAnLi9zZXR0aW5nc3BhbmVsJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIHRoZSB7QGxpbmsgU2V0dGluZ3NUb2dnbGVCdXR0b259LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnIGV4dGVuZHMgVG9nZ2xlQnV0dG9uQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBzZXR0aW5ncyBwYW5lbCB3aG9zZSB2aXNpYmlsaXR5IHRoZSBidXR0b24gc2hvdWxkIHRvZ2dsZS5cbiAgICovXG4gIHNldHRpbmdzUGFuZWw6IFNldHRpbmdzUGFuZWw7XG5cbiAgLyoqXG4gICAqIERlY2lkZXMgaWYgdGhlIGJ1dHRvbiBzaG91bGQgYmUgYXV0b21hdGljYWxseSBoaWRkZW4gd2hlbiB0aGUgc2V0dGluZ3MgcGFuZWwgZG9lcyBub3QgY29udGFpbiBhbnkgYWN0aXZlIHNldHRpbmdzLlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBhdXRvSGlkZVdoZW5Ob0FjdGl2ZVNldHRpbmdzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdmlzaWJpbGl0eSBvZiBhIHNldHRpbmdzIHBhbmVsLlxuICovXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248U2V0dGluZ3NUb2dnbGVCdXR0b25Db25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFNldHRpbmdzVG9nZ2xlQnV0dG9uQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIGlmICghY29uZmlnLnNldHRpbmdzUGFuZWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWlyZWQgU2V0dGluZ3NQYW5lbCBpcyBtaXNzaW5nJyk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS1zZXR0aW5nc3RvZ2dsZWJ1dHRvbicsXG4gICAgICB0ZXh0OiAnU2V0dGluZ3MnLFxuICAgICAgc2V0dGluZ3NQYW5lbDogbnVsbCxcbiAgICAgIGF1dG9IaWRlV2hlbk5vQWN0aXZlU2V0dGluZ3M6IHRydWVcbiAgICB9LCA8U2V0dGluZ3NUb2dnbGVCdXR0b25Db25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCBjb25maWcgPSA8U2V0dGluZ3NUb2dnbGVCdXR0b25Db25maWc+dGhpcy5nZXRDb25maWcoKTsgLy8gVE9ETyBmaXggZ2VuZXJpY3MgdHlwZSBpbmZlcmVuY2VcbiAgICBsZXQgc2V0dGluZ3NQYW5lbCA9IGNvbmZpZy5zZXR0aW5nc1BhbmVsO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzZXR0aW5nc1BhbmVsLnRvZ2dsZUhpZGRlbigpO1xuICAgIH0pO1xuICAgIHNldHRpbmdzUGFuZWwub25TaG93LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBTZXQgdG9nZ2xlIHN0YXR1cyB0byBvbiB3aGVuIHRoZSBzZXR0aW5ncyBwYW5lbCBzaG93c1xuICAgICAgdGhpcy5vbigpO1xuICAgIH0pO1xuICAgIHNldHRpbmdzUGFuZWwub25IaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBTZXQgdG9nZ2xlIHN0YXR1cyB0byBvZmYgd2hlbiB0aGUgc2V0dGluZ3MgcGFuZWwgaGlkZXNcbiAgICAgIHRoaXMub2ZmKCk7XG4gICAgfSk7XG5cbiAgICAvLyBIYW5kbGUgYXV0b21hdGljIGhpZGluZyBvZiB0aGUgYnV0dG9uIGlmIHRoZXJlIGFyZSBubyBzZXR0aW5ncyBmb3IgdGhlIHVzZXIgdG8gaW50ZXJhY3Qgd2l0aFxuICAgIGlmIChjb25maWcuYXV0b0hpZGVXaGVuTm9BY3RpdmVTZXR0aW5ncykge1xuICAgICAgLy8gU2V0dXAgaGFuZGxlciB0byBzaG93L2hpZGUgYnV0dG9uIHdoZW4gdGhlIHNldHRpbmdzIGNoYW5nZVxuICAgICAgbGV0IHNldHRpbmdzUGFuZWxJdGVtc0NoYW5nZWRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICBpZiAoc2V0dGluZ3NQYW5lbC5oYXNBY3RpdmVTZXR0aW5ncygpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLmlzU2hvd24oKSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gV2lyZSB0aGUgaGFuZGxlciB0byB0aGUgZXZlbnRcbiAgICAgIHNldHRpbmdzUGFuZWwub25TZXR0aW5nc1N0YXRlQ2hhbmdlZC5zdWJzY3JpYmUoc2V0dGluZ3NQYW5lbEl0ZW1zQ2hhbmdlZEhhbmRsZXIpO1xuICAgICAgLy8gQ2FsbCBoYW5kbGVyIGZvciBmaXJzdCBpbml0IGF0IHN0YXJ0dXBcbiAgICAgIHNldHRpbmdzUGFuZWxJdGVtc0NoYW5nZWRIYW5kbGVyKCk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuXG4vKipcbiAqIEEgZHVtbXkgY29tcG9uZW50IHRoYXQganVzdCByZXNlcnZlcyBzb21lIHNwYWNlIGFuZCBkb2VzIG5vdGhpbmcgZWxzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwYWNlciBleHRlbmRzIENvbXBvbmVudDxDb21wb25lbnRDb25maWc+IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbXBvbmVudENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc3BhY2VyJyxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuXG4gIHByb3RlY3RlZCBvblNob3dFdmVudCgpOiB2b2lkIHtcbiAgICAvLyBkaXNhYmxlIGV2ZW50IGZpcmluZyBieSBvdmVyd3JpdGluZyBhbmQgbm90IGNhbGxpbmcgc3VwZXJcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkhpZGVFdmVudCgpOiB2b2lkIHtcbiAgICAvLyBkaXNhYmxlIGV2ZW50IGZpcmluZyBieSBvdmVyd3JpdGluZyBhbmQgbm90IGNhbGxpbmcgc3VwZXJcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkhvdmVyQ2hhbmdlZEV2ZW50KGhvdmVyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAvLyBkaXNhYmxlIGV2ZW50IGZpcmluZyBieSBvdmVyd3JpdGluZyBhbmQgbm90IGNhbGxpbmcgc3VwZXJcbiAgfVxufSIsImltcG9ydCB7Q29udGFpbmVyLCBDb250YWluZXJDb25maWd9IGZyb20gJy4vY29udGFpbmVyJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgU3VidGl0bGVDdWVFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5TdWJ0aXRsZUN1ZUV2ZW50O1xuaW1wb3J0IHtMYWJlbCwgTGFiZWxDb25maWd9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtDb21wb25lbnRDb25maWcsIENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtDb250cm9sQmFyfSBmcm9tICcuL2NvbnRyb2xiYXInO1xuXG4vKipcbiAqIE92ZXJsYXlzIHRoZSBwbGF5ZXIgdG8gZGlzcGxheSBzdWJ0aXRsZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJ0aXRsZU92ZXJsYXkgZXh0ZW5kcyBDb250YWluZXI8Q29udGFpbmVyQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfQ09OVFJPTEJBUl9WSVNJQkxFID0gJ2NvbnRyb2xiYXItdmlzaWJsZSc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb250YWluZXJDb25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXN1YnRpdGxlLW92ZXJsYXknLFxuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgc3VidGl0bGVNYW5hZ2VyID0gbmV3IEFjdGl2ZVN1YnRpdGxlTWFuYWdlcigpO1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ1VFX0VOVEVSLCAoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpID0+IHtcbiAgICAgIGxldCBsYWJlbFRvQWRkID0gc3VidGl0bGVNYW5hZ2VyLmN1ZUVudGVyKGV2ZW50KTtcblxuICAgICAgdGhpcy5hZGRDb21wb25lbnQobGFiZWxUb0FkZCk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcblxuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ1VFX0VYSVQsIChldmVudDogU3VidGl0bGVDdWVFdmVudCkgPT4ge1xuICAgICAgbGV0IGxhYmVsVG9SZW1vdmUgPSBzdWJ0aXRsZU1hbmFnZXIuY3VlRXhpdChldmVudCk7XG5cbiAgICAgIGlmIChsYWJlbFRvUmVtb3ZlKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KGxhYmVsVG9SZW1vdmUpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbXBvbmVudHMoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzdWJ0aXRsZU1hbmFnZXIuaGFzQ3Vlcykge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBzdWJ0aXRsZUNsZWFySGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgc3VidGl0bGVNYW5hZ2VyLmNsZWFyKCk7XG4gICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudHMoKTtcbiAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50cygpO1xuICAgIH07XG5cbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9BVURJT19DSEFOR0VELCBzdWJ0aXRsZUNsZWFySGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1VCVElUTEVfQ0hBTkdFRCwgc3VidGl0bGVDbGVhckhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NFRUssIHN1YnRpdGxlQ2xlYXJIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9USU1FX1NISUZULCBzdWJ0aXRsZUNsZWFySGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUJBQ0tfRklOSVNIRUQsIHN1YnRpdGxlQ2xlYXJIYW5kbGVyKTtcblxuICAgIHVpbWFuYWdlci5vbkNvbXBvbmVudFNob3cuc3Vic2NyaWJlKChjb21wb25lbnQ6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSA9PiB7XG4gICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29udHJvbEJhcikge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhTdWJ0aXRsZU92ZXJsYXkuQ0xBU1NfQ09OVFJPTEJBUl9WSVNJQkxFKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29tcG9uZW50SGlkZS5zdWJzY3JpYmUoKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4pID0+IHtcbiAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBDb250cm9sQmFyKSB7XG4gICAgICAgIHRoaXMuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFN1YnRpdGxlT3ZlcmxheS5DTEFTU19DT05UUk9MQkFSX1ZJU0lCTEUpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEluaXRcbiAgICBzdWJ0aXRsZUNsZWFySGFuZGxlcigpO1xuICB9XG59XG5cbmludGVyZmFjZSBBY3RpdmVTdWJ0aXRsZUN1ZSB7XG4gIGV2ZW50OiBTdWJ0aXRsZUN1ZUV2ZW50O1xuICBsYWJlbDogU3VidGl0bGVMYWJlbDtcbn1cblxuaW50ZXJmYWNlIEFjdGl2ZVN1YnRpdGxlQ3VlTWFwIHtcbiAgW2lkOiBzdHJpbmddOiBBY3RpdmVTdWJ0aXRsZUN1ZTtcbn1cblxuY2xhc3MgU3VidGl0bGVMYWJlbCBleHRlbmRzIExhYmVsPExhYmVsQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBMYWJlbENvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktc3VidGl0bGUtbGFiZWwnXG4gICAgfSwgdGhpcy5jb25maWcpO1xuICB9XG59XG5cbmNsYXNzIEFjdGl2ZVN1YnRpdGxlTWFuYWdlciB7XG5cbiAgcHJpdmF0ZSBhY3RpdmVTdWJ0aXRsZUN1ZU1hcDogQWN0aXZlU3VidGl0bGVDdWVNYXA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcCA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYSB1bmlxdWUgSUQgZm9yIGEgc3VidGl0bGUgY3VlLCB3aGljaCBpcyBuZWVkZWQgdG8gYXNzb2NpYXRlIGFuIE9OX0NVRV9FTlRFUiB3aXRoIGl0cyBPTl9DVUVfRVhJVFxuICAgKiBldmVudCBzbyB3ZSBjYW4gcmVtb3ZlIHRoZSBjb3JyZWN0IHN1YnRpdGxlIGluIE9OX0NVRV9FWElUIHdoZW4gbXVsdGlwbGUgc3VidGl0bGVzIGFyZSBhY3RpdmUgYXQgdGhlIHNhbWUgdGltZS5cbiAgICogVGhlIHN0YXJ0IHRpbWUgcGx1cyB0aGUgdGV4dCBzaG91bGQgbWFrZSBhIHVuaXF1ZSBpZGVudGlmaWVyLCBhbmQgaW4gdGhlIG9ubHkgY2FzZSB3aGVyZSBhIGNvbGxpc2lvblxuICAgKiBjYW4gaGFwcGVuLCB0d28gc2ltaWxhciB0ZXh0cyB3aWxsIGRpc3BsYXllZCBhdCBhIHNpbWlsYXIgdGltZSBzbyBpdCBkb2VzIG5vdCBtYXR0ZXIgd2hpY2ggb25lIHdlIGRlbGV0ZS5cbiAgICogVGhlIHN0YXJ0IHRpbWUgc2hvdWxkIGFsd2F5cyBiZSBrbm93biwgYmVjYXVzZSBpdCBpcyByZXF1aXJlZCB0byBzY2hlZHVsZSB0aGUgT05fQ1VFX0VOVEVSIGV2ZW50LiBUaGUgZW5kIHRpbWVcbiAgICogbXVzdCBub3QgbmVjZXNzYXJpbHkgYmUga25vd24gYW5kIHRoZXJlZm9yZSBjYW5ub3QgYmUgdXNlZCBmb3IgdGhlIElELlxuICAgKiBAcGFyYW0gZXZlbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlSWQoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpOiBzdHJpbmcge1xuICAgIHJldHVybiBldmVudC5zdGFydCArIGV2ZW50LnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN1YnRpdGxlIGN1ZSB0byB0aGUgbWFuYWdlciBhbmQgcmV0dXJucyB0aGUgbGFiZWwgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHN1YnRpdGxlIG92ZXJsYXkuXG4gICAqIEBwYXJhbSBldmVudFxuICAgKiBAcmV0dXJuIHtTdWJ0aXRsZUxhYmVsfVxuICAgKi9cbiAgY3VlRW50ZXIoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpOiBTdWJ0aXRsZUxhYmVsIHtcbiAgICBsZXQgaWQgPSBBY3RpdmVTdWJ0aXRsZU1hbmFnZXIuY2FsY3VsYXRlSWQoZXZlbnQpO1xuXG4gICAgbGV0IGxhYmVsID0gbmV3IFN1YnRpdGxlTGFiZWwoe1xuICAgICAgLy8gUHJlZmVyIHRoZSBIVE1MIHN1YnRpdGxlIHRleHQgaWYgc2V0LCBlbHNlIHVzZSB0aGUgcGxhaW4gdGV4dFxuICAgICAgdGV4dDogZXZlbnQuaHRtbCB8fCBldmVudC50ZXh0XG4gICAgfSk7XG5cbiAgICB0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwW2lkXSA9IHsgZXZlbnQsIGxhYmVsIH07XG5cbiAgICByZXR1cm4gbGFiZWw7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgc3VidGl0bGUgY3VlIGZyb20gdGhlIG1hbmFnZXIgYW5kIHJldHVybnMgdGhlIGxhYmVsIHRoYXQgc2hvdWxkIGJlIHJlbW92ZWQgZnJvbSB0aGUgc3VidGl0bGUgb3ZlcmxheSxcbiAgICogb3IgbnVsbCBpZiB0aGVyZSBpcyBubyBhc3NvY2lhdGVkIGxhYmVsIGV4aXN0aW5nIChlLmcuIGJlY2F1c2UgYWxsIGxhYmVscyBoYXZlIGJlZW4ge0BsaW5rICNjbGVhciBjbGVhcmVkfS5cbiAgICogQHBhcmFtIGV2ZW50XG4gICAqIEByZXR1cm4ge1N1YnRpdGxlTGFiZWx8bnVsbH1cbiAgICovXG4gIGN1ZUV4aXQoZXZlbnQ6IFN1YnRpdGxlQ3VlRXZlbnQpOiBTdWJ0aXRsZUxhYmVsIHtcbiAgICBsZXQgaWQgPSBBY3RpdmVTdWJ0aXRsZU1hbmFnZXIuY2FsY3VsYXRlSWQoZXZlbnQpO1xuICAgIGxldCBhY3RpdmVTdWJ0aXRsZUN1ZSA9IHRoaXMuYWN0aXZlU3VidGl0bGVDdWVNYXBbaWRdO1xuXG4gICAgaWYgKGFjdGl2ZVN1YnRpdGxlQ3VlKSB7XG4gICAgICBkZWxldGUgdGhpcy5hY3RpdmVTdWJ0aXRsZUN1ZU1hcFtpZF07XG4gICAgICByZXR1cm4gYWN0aXZlU3VidGl0bGVDdWUubGFiZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgYWN0aXZlIHN1YnRpdGxlIGN1ZXMuXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBjdWVDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwKS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZXJlIGFyZSBhY3RpdmUgc3VidGl0bGUgY3VlcywgZWxzZSBmYWxzZS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBoYXNDdWVzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1ZUNvdW50ID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCBzdWJ0aXRsZSBjdWVzIGZyb20gdGhlIG1hbmFnZXIuXG4gICAqL1xuICBjbGVhcigpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZVN1YnRpdGxlQ3VlTWFwID0ge307XG4gIH1cbn0iLCJpbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5pbXBvcnQgU3VidGl0bGVBZGRlZEV2ZW50ID0gYml0bW92aW4uUGxheWVyQVBJLlN1YnRpdGxlQWRkZWRFdmVudDtcbmltcG9ydCBTdWJ0aXRsZUNoYW5nZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5TdWJ0aXRsZUNoYW5nZWRFdmVudDtcbmltcG9ydCBTdWJ0aXRsZVJlbW92ZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5TdWJ0aXRsZVJlbW92ZWRFdmVudDtcblxuLyoqXG4gKiBBIHNlbGVjdCBib3ggcHJvdmlkaW5nIGEgc2VsZWN0aW9uIGJldHdlZW4gYXZhaWxhYmxlIHN1YnRpdGxlIGFuZCBjYXB0aW9uIHRyYWNrcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnRpdGxlU2VsZWN0Qm94IGV4dGVuZHMgU2VsZWN0Qm94IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IExpc3RTZWxlY3RvckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgZ2V0TGFiZWwgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgc3dpdGNoIChpZCkge1xuICAgICAgICBjYXNlICdvZmYnIDpcbiAgICAgICAgICByZXR1cm4gJ09mZidcbiAgICAgICAgY2FzZSAnZW4nIDpcbiAgICAgICAgICByZXR1cm4gJ0VuZ2xpc2gnXG4gICAgICAgIGNhc2UgJ2ZyJyA6XG4gICAgICAgICAgcmV0dXJuICdGcmFuY2FpcydcbiAgICAgICAgY2FzZSAnZGUnIDpcbiAgICAgICAgICByZXR1cm4gJ0RldXRzY2gnXG4gICAgICAgIGNhc2UgJ2VzJyA6XG4gICAgICAgICAgcmV0dXJuICdFc3BhbmlvbCdcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gaWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdXBkYXRlU3VidGl0bGVzID0gKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckl0ZW1zKCk7XG5cbiAgICAgIGZvciAobGV0IHN1YnRpdGxlIG9mIHBsYXllci5nZXRBdmFpbGFibGVTdWJ0aXRsZXMoKSkge1xuICAgICAgICB0aGlzLmFkZEl0ZW0oc3VidGl0bGUuaWQsIGdldExhYmVsKHN1YnRpdGxlLmxhYmVsKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub25JdGVtU2VsZWN0ZWQuc3Vic2NyaWJlKChzZW5kZXI6IFN1YnRpdGxlU2VsZWN0Qm94LCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0U3VidGl0bGUodmFsdWUgPT09ICdudWxsJyA/IG51bGwgOiB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBSZWFjdCB0byBBUEkgZXZlbnRzXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1VCVElUTEVfQURERUQsIChldmVudDogU3VidGl0bGVBZGRlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmFkZEl0ZW0oZXZlbnQuc3VidGl0bGUuaWQsIGV2ZW50LnN1YnRpdGxlLmxhYmVsKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TVUJUSVRMRV9DSEFOR0VELCAoZXZlbnQ6IFN1YnRpdGxlQ2hhbmdlZEV2ZW50KSA9PiB7XG4gICAgICB0aGlzLnNlbGVjdEl0ZW0oZXZlbnQudGFyZ2V0U3VidGl0bGUuaWQpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1NVQlRJVExFX1JFTU9WRUQsIChldmVudDogU3VidGl0bGVSZW1vdmVkRXZlbnQpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlSXRlbShldmVudC5zdWJ0aXRsZUlkKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzdWJ0aXRsZXMgd2hlbiBzb3VyY2UgZ29lcyBhd2F5XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU09VUkNFX1VOTE9BREVELCB1cGRhdGVTdWJ0aXRsZXMpO1xuICAgIC8vIFVwZGF0ZSBzdWJ0aXRsZXMgd2hlbiBhIG5ldyBzb3VyY2UgaXMgbG9hZGVkXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHVwZGF0ZVN1YnRpdGxlcyk7XG5cbiAgICAvLyBQb3B1bGF0ZSBzdWJ0aXRsZXMgYXQgc3RhcnR1cFxuICAgIHVwZGF0ZVN1YnRpdGxlcygpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7TWV0YWRhdGFMYWJlbCwgTWV0YWRhdGFMYWJlbENvbnRlbnR9IGZyb20gJy4vbWV0YWRhdGFsYWJlbCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBpbnRlcmZhY2UgZm9yIGEge0BsaW5rIFRpdGxlQmFyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUaXRsZUJhckNvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaWYgdGhlIHRpdGxlIGJhciBzaG91bGQgc3RheSBoaWRkZW4gd2hlbiBubyBtZXRhZGF0YSBsYWJlbCBjb250YWlucyBhbnkgdGV4dC4gRG9lcyBub3QgbWFrZSBhIGxvdFxuICAgKiBvZiBzZW5zZSBpZiB0aGUgdGl0bGUgYmFyIGNvbnRhaW5zIG90aGVyIGNvbXBvbmVudHMgdGhhbiBqdXN0IE1ldGFkYXRhTGFiZWxzIChsaWtlIGluIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24pLlxuICAgKiBEZWZhdWx0OiBmYWxzZVxuICAgKi9cbiAga2VlcEhpZGRlbldpdGhvdXRNZXRhZGF0YT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogRGlzcGxheXMgYSB0aXRsZSBiYXIgY29udGFpbmluZyBhIGxhYmVsIHdpdGggdGhlIHRpdGxlIG9mIHRoZSB2aWRlby5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpdGxlQmFyIGV4dGVuZHMgQ29udGFpbmVyPFRpdGxlQmFyQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUaXRsZUJhckNvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdGl0bGViYXInLFxuICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgTWV0YWRhdGFMYWJlbCh7IGNvbnRlbnQ6IE1ldGFkYXRhTGFiZWxDb250ZW50LlRpdGxlIH0pLFxuICAgICAgICBuZXcgTWV0YWRhdGFMYWJlbCh7IGNvbnRlbnQ6IE1ldGFkYXRhTGFiZWxDb250ZW50LkRlc2NyaXB0aW9uIH0pXG4gICAgICBdLFxuICAgICAga2VlcEhpZGRlbldpdGhvdXRNZXRhZGF0YTogZmFsc2UsXG4gICAgfSwgPFRpdGxlQmFyQ29uZmlnPnRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgY29uZmlnID0gPFRpdGxlQmFyQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG4gICAgbGV0IHNob3VsZEJlU2hvd24gPSAhdGhpcy5pc0hpZGRlbigpO1xuICAgIGxldCBoYXNNZXRhZGF0YVRleHQgPSB0cnVlOyAvLyBGbGFnIHRvIHRyYWNrIGlmIGFueSBtZXRhZGF0YSBsYWJlbCBjb250YWlucyB0ZXh0XG5cbiAgICBsZXQgY2hlY2tNZXRhZGF0YVRleHRBbmRVcGRhdGVWaXNpYmlsaXR5ID0gKCkgPT4ge1xuICAgICAgaGFzTWV0YWRhdGFUZXh0ID0gZmFsc2U7XG5cbiAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBtZXRhZGF0YSBsYWJlbHMgYW5kIGNoZWNrIGlmIGF0IGxlYXN0IG9uZSBvZiB0aGVtIGNvbnRhaW5zIHRleHRcbiAgICAgIGZvciAobGV0IGNvbXBvbmVudCBvZiB0aGlzLmdldENvbXBvbmVudHMoKSkge1xuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgTWV0YWRhdGFMYWJlbCkge1xuICAgICAgICAgIGlmICghY29tcG9uZW50LmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgaGFzTWV0YWRhdGFUZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgLy8gSGlkZSBhIHZpc2libGUgdGl0bGViYXIgaWYgaXQgZG9lcyBub3QgY29udGFpbiBhbnkgdGV4dCBhbmQgdGhlIGhpZGRlbiBmbGFnIGlzIHNldFxuICAgICAgICBpZiAoY29uZmlnLmtlZXBIaWRkZW5XaXRob3V0TWV0YWRhdGEgJiYgIWhhc01ldGFkYXRhVGV4dCkge1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHNob3VsZEJlU2hvd24pIHtcbiAgICAgICAgLy8gU2hvdyBhIGhpZGRlbiB0aXRsZWJhciBpZiBpdCBzaG91bGQgYWN0dWFsbHkgYmUgc2hvd25cbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIExpc3RlbiB0byB0ZXh0IGNoYW5nZSBldmVudHMgdG8gdXBkYXRlIHRoZSBoYXNNZXRhZGF0YVRleHQgZmxhZyB3aGVuIHRoZSBtZXRhZGF0YSBkeW5hbWljYWxseSBjaGFuZ2VzXG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgTWV0YWRhdGFMYWJlbCkge1xuICAgICAgICBjb21wb25lbnQub25UZXh0Q2hhbmdlZC5zdWJzY3JpYmUoY2hlY2tNZXRhZGF0YVRleHRBbmRVcGRhdGVWaXNpYmlsaXR5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1aW1hbmFnZXIub25Db250cm9sc1Nob3cuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHNob3VsZEJlU2hvd24gPSB0cnVlO1xuICAgICAgaWYgKCEoY29uZmlnLmtlZXBIaWRkZW5XaXRob3V0TWV0YWRhdGEgJiYgIWhhc01ldGFkYXRhVGV4dCkpIHtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNIaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzaG91bGRCZVNob3duID0gZmFsc2U7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcblxuICAgIC8vIGluaXRcbiAgICBjaGVja01ldGFkYXRhVGV4dEFuZFVwZGF0ZVZpc2liaWxpdHkoKTtcbiAgfVxufSIsImltcG9ydCB7QnV0dG9uLCBCdXR0b25Db25maWd9IGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCB7Tm9BcmdzLCBFdmVudERpc3BhdGNoZXIsIEV2ZW50fSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHRvZ2dsZSBidXR0b24gY29tcG9uZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRvZ2dsZUJ1dHRvbkNvbmZpZyBleHRlbmRzIEJ1dHRvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdGV4dCBvbiB0aGUgYnV0dG9uLlxuICAgKi9cbiAgdGV4dD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IGNhbiBiZSB0b2dnbGVkIGJldHdlZW4gJ29uJyBhbmQgJ29mZicgc3RhdGVzLlxuICovXG5leHBvcnQgY2xhc3MgVG9nZ2xlQnV0dG9uPENvbmZpZyBleHRlbmRzIFRvZ2dsZUJ1dHRvbkNvbmZpZz4gZXh0ZW5kcyBCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ0xBU1NfT04gPSAnb24nO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDTEFTU19PRkYgPSAnb2ZmJztcblxuICBwcml2YXRlIG9uU3RhdGU6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSB0b2dnbGVCdXR0b25FdmVudHMgPSB7XG4gICAgb25Ub2dnbGU6IG5ldyBFdmVudERpc3BhdGNoZXI8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvblRvZ2dsZU9uOiBuZXcgRXZlbnREaXNwYXRjaGVyPFRvZ2dsZUJ1dHRvbjxDb25maWc+LCBOb0FyZ3M+KCksXG4gICAgb25Ub2dnbGVPZmY6IG5ldyBFdmVudERpc3BhdGNoZXI8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4oKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdG9nZ2xlYnV0dG9uJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBidXR0b24gdG8gdGhlICdvbicgc3RhdGUuXG4gICAqL1xuICBvbigpIHtcbiAgICBpZiAodGhpcy5pc09mZigpKSB7XG4gICAgICB0aGlzLm9uU3RhdGUgPSB0cnVlO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVG9nZ2xlQnV0dG9uLkNMQVNTX09GRikpO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVG9nZ2xlQnV0dG9uLkNMQVNTX09OKSk7XG5cbiAgICAgIHRoaXMub25Ub2dnbGVFdmVudCgpO1xuICAgICAgdGhpcy5vblRvZ2dsZU9uRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgYnV0dG9uIHRvIHRoZSAnb2ZmJyBzdGF0ZS5cbiAgICovXG4gIG9mZigpIHtcbiAgICBpZiAodGhpcy5pc09uKCkpIHtcbiAgICAgIHRoaXMub25TdGF0ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVG9nZ2xlQnV0dG9uLkNMQVNTX09OKSk7XG4gICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhUb2dnbGVCdXR0b24uQ0xBU1NfT0ZGKSk7XG5cbiAgICAgIHRoaXMub25Ub2dnbGVFdmVudCgpO1xuICAgICAgdGhpcy5vblRvZ2dsZU9mZkV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgYnV0dG9uICdvbicgaWYgaXQgaXMgJ29mZicsIG9yICdvZmYnIGlmIGl0IGlzICdvbicuXG4gICAqL1xuICB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMuaXNPbigpKSB7XG4gICAgICB0aGlzLm9mZigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgdG9nZ2xlIGJ1dHRvbiBpcyBpbiB0aGUgJ29uJyBzdGF0ZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgYnV0dG9uIGlzICdvbicsIGZhbHNlIGlmICdvZmYnXG4gICAqL1xuICBpc09uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9uU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSB0b2dnbGUgYnV0dG9uIGlzIGluIHRoZSAnb2ZmJyBzdGF0ZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgYnV0dG9uIGlzICdvZmYnLCBmYWxzZSBpZiAnb24nXG4gICAqL1xuICBpc09mZigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNPbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uQ2xpY2tFdmVudCgpIHtcbiAgICBzdXBlci5vbkNsaWNrRXZlbnQoKTtcblxuICAgIC8vIEZpcmUgdGhlIHRvZ2dsZSBldmVudCB0b2dldGhlciB3aXRoIHRoZSBjbGljayBldmVudFxuICAgIC8vICh0aGV5IGFyZSB0ZWNobmljYWxseSB0aGUgc2FtZSwgb25seSB0aGUgc2VtYW50aWNzIGFyZSBkaWZmZXJlbnQpXG4gICAgdGhpcy5vblRvZ2dsZUV2ZW50KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Ub2dnbGVFdmVudCgpIHtcbiAgICB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZS5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblRvZ2dsZU9uRXZlbnQoKSB7XG4gICAgdGhpcy50b2dnbGVCdXR0b25FdmVudHMub25Ub2dnbGVPbi5kaXNwYXRjaCh0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblRvZ2dsZU9mZkV2ZW50KCkge1xuICAgIHRoaXMudG9nZ2xlQnV0dG9uRXZlbnRzLm9uVG9nZ2xlT2ZmLmRpc3BhdGNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgYnV0dG9uIGlzIHRvZ2dsZWQuXG4gICAqIEByZXR1cm5zIHtFdmVudDxUb2dnbGVCdXR0b248Q29uZmlnPiwgTm9BcmdzPn1cbiAgICovXG4gIGdldCBvblRvZ2dsZSgpOiBFdmVudDxUb2dnbGVCdXR0b248Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlQnV0dG9uRXZlbnRzLm9uVG9nZ2xlLmdldEV2ZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZXZlbnQgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBidXR0b24gaXMgdG9nZ2xlZCAnb24nLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25Ub2dnbGVPbigpOiBFdmVudDxUb2dnbGVCdXR0b248Q29uZmlnPiwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlQnV0dG9uRXZlbnRzLm9uVG9nZ2xlT24uZ2V0RXZlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBldmVudCB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGJ1dHRvbiBpcyB0b2dnbGVkICdvZmYnLlxuICAgKiBAcmV0dXJucyB7RXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz59XG4gICAqL1xuICBnZXQgb25Ub2dnbGVPZmYoKTogRXZlbnQ8VG9nZ2xlQnV0dG9uPENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZUJ1dHRvbkV2ZW50cy5vblRvZ2dsZU9mZi5nZXRFdmVudCgpO1xuICB9XG59IiwiaW1wb3J0IHtDb21wb25lbnQsIENvbXBvbmVudENvbmZpZ30gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHtET019IGZyb20gJy4uL2RvbSc7XG5cbi8qKlxuICogQW5pbWF0ZWQgYW5hbG9nIFRWIHN0YXRpYyBub2lzZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFR2Tm9pc2VDYW52YXMgZXh0ZW5kcyBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiB7XG5cbiAgcHJpdmF0ZSBjYW52YXM6IERPTTtcblxuICBwcml2YXRlIGNhbnZhc0VsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50O1xuICBwcml2YXRlIGNhbnZhc0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJpdmF0ZSBjYW52YXNXaWR0aCA9IDE2MDtcbiAgcHJpdmF0ZSBjYW52YXNIZWlnaHQgPSA5MDtcbiAgcHJpdmF0ZSBpbnRlcmZlcmVuY2VIZWlnaHQgPSA1MDtcbiAgcHJpdmF0ZSBsYXN0RnJhbWVVcGRhdGU6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgZnJhbWVJbnRlcnZhbDogbnVtYmVyID0gNjA7XG4gIHByaXZhdGUgdXNlQW5pbWF0aW9uRnJhbWU6IGJvb2xlYW4gPSAhIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIHByaXZhdGUgbm9pc2VBbmltYXRpb25XaW5kb3dQb3M6IG51bWJlcjtcbiAgcHJpdmF0ZSBmcmFtZVVwZGF0ZUhhbmRsZXJJZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29tcG9uZW50Q29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS10dm5vaXNlY2FudmFzJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0b0RvbUVsZW1lbnQoKTogRE9NIHtcbiAgICByZXR1cm4gdGhpcy5jYW52YXMgPSBuZXcgRE9NKCdjYW52YXMnLCB7ICdjbGFzcyc6IHRoaXMuZ2V0Q3NzQ2xhc3NlcygpIH0pO1xuICB9XG5cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5jYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PnRoaXMuY2FudmFzLmdldEVsZW1lbnRzKClbMF07XG4gICAgdGhpcy5jYW52YXNDb250ZXh0ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5ub2lzZUFuaW1hdGlvbldpbmRvd1BvcyA9IC10aGlzLmNhbnZhc0hlaWdodDtcbiAgICB0aGlzLmxhc3RGcmFtZVVwZGF0ZSA9IDA7XG5cbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIHRoaXMucmVuZGVyRnJhbWUoKTtcbiAgfVxuXG4gIHN0b3AoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudXNlQW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuZnJhbWVVcGRhdGVIYW5kbGVySWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mcmFtZVVwZGF0ZUhhbmRsZXJJZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJGcmFtZSgpOiB2b2lkIHtcbiAgICAvLyBUaGlzIGNvZGUgaGFzIGJlZW4gY29waWVkIGZyb20gdGhlIHBsYXllciBjb250cm9scy5qcyBhbmQgc2ltcGxpZmllZFxuXG4gICAgaWYgKHRoaXMubGFzdEZyYW1lVXBkYXRlICsgdGhpcy5mcmFtZUludGVydmFsID4gbmV3IERhdGUoKS5nZXRUaW1lKCkpIHtcbiAgICAgIC8vIEl0J3MgdG9vIGVhcmx5IHRvIHJlbmRlciB0aGUgbmV4dCBmcmFtZVxuICAgICAgdGhpcy5zY2hlZHVsZU5leHRSZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY3VycmVudFBpeGVsT2Zmc2V0O1xuICAgIGxldCBjYW52YXNXaWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgbGV0IGNhbnZhc0hlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgLy8gQ3JlYXRlIHRleHR1cmVcbiAgICBsZXQgbm9pc2VJbWFnZSA9IHRoaXMuY2FudmFzQ29udGV4dC5jcmVhdGVJbWFnZURhdGEoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5cbiAgICAvLyBGaWxsIHRleHR1cmUgd2l0aCBub2lzZVxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgY2FudmFzSGVpZ2h0OyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY2FudmFzV2lkdGg7IHgrKykge1xuICAgICAgICBjdXJyZW50UGl4ZWxPZmZzZXQgPSAoY2FudmFzV2lkdGggKiB5ICogNCkgKyB4ICogNDtcbiAgICAgICAgbm9pc2VJbWFnZS5kYXRhW2N1cnJlbnRQaXhlbE9mZnNldF0gPSBNYXRoLnJhbmRvbSgpICogMjU1O1xuICAgICAgICBpZiAoeSA8IHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgfHwgeSA+IHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgKyB0aGlzLmludGVyZmVyZW5jZUhlaWdodCkge1xuICAgICAgICAgIG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXRdICo9IDAuODU7XG4gICAgICAgIH1cbiAgICAgICAgbm9pc2VJbWFnZS5kYXRhW2N1cnJlbnRQaXhlbE9mZnNldCArIDFdID0gbm9pc2VJbWFnZS5kYXRhW2N1cnJlbnRQaXhlbE9mZnNldF07XG4gICAgICAgIG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXQgKyAyXSA9IG5vaXNlSW1hZ2UuZGF0YVtjdXJyZW50UGl4ZWxPZmZzZXRdO1xuICAgICAgICBub2lzZUltYWdlLmRhdGFbY3VycmVudFBpeGVsT2Zmc2V0ICsgM10gPSA1MDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQdXQgdGV4dHVyZSBvbnRvIGNhbnZhc1xuICAgIHRoaXMuY2FudmFzQ29udGV4dC5wdXRJbWFnZURhdGEobm9pc2VJbWFnZSwgMCwgMCk7XG5cbiAgICB0aGlzLmxhc3RGcmFtZVVwZGF0ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMubm9pc2VBbmltYXRpb25XaW5kb3dQb3MgKz0gNztcbiAgICBpZiAodGhpcy5ub2lzZUFuaW1hdGlvbldpbmRvd1BvcyA+IGNhbnZhc0hlaWdodCkge1xuICAgICAgdGhpcy5ub2lzZUFuaW1hdGlvbldpbmRvd1BvcyA9IC1jYW52YXNIZWlnaHQ7XG4gICAgfVxuXG4gICAgdGhpcy5zY2hlZHVsZU5leHRSZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGVOZXh0UmVuZGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnVzZUFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICB0aGlzLmZyYW1lVXBkYXRlSGFuZGxlcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlckZyYW1lLmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZyYW1lVXBkYXRlSGFuZGxlcklkID0gc2V0VGltZW91dCh0aGlzLnJlbmRlckZyYW1lLmJpbmQodGhpcyksIHRoaXMuZnJhbWVJbnRlcnZhbCk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXJDb25maWcsIENvbnRhaW5lcn0gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcbmltcG9ydCB7RE9NfSBmcm9tICcuLi9kb20nO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcbmltcG9ydCB7UGxheWVyVXRpbHN9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBQbGF5ZXJSZXNpemVFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJSZXNpemVFdmVudDtcbmltcG9ydCB7Q2FuY2VsRXZlbnRBcmdzfSBmcm9tICcuLi9ldmVudGRpc3BhdGNoZXInO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIGZvciBhIHtAbGluayBVSUNvbnRhaW5lcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVUlDb250YWluZXJDb25maWcgZXh0ZW5kcyBDb250YWluZXJDb25maWcge1xuICAvKipcbiAgICogVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgY29udHJvbCBiYXIgd2lsbCBiZSBoaWRkZW4gd2hlbiB0aGVyZSBpcyBubyB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBEZWZhdWx0OiA1IHNlY29uZHMgKDUwMDApXG4gICAqL1xuICBoaWRlRGVsYXk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgY29udGFpbmVyIHRoYXQgY29udGFpbnMgYWxsIG9mIHRoZSBVSS4gVGhlIFVJQ29udGFpbmVyIGlzIHBhc3NlZCB0byB0aGUge0BsaW5rIFVJTWFuYWdlcn0gdG8gYnVpbGQgYW5kXG4gKiBzZXR1cCB0aGUgVUkuXG4gKi9cbmV4cG9ydCBjbGFzcyBVSUNvbnRhaW5lciBleHRlbmRzIENvbnRhaW5lcjxVSUNvbnRhaW5lckNvbmZpZz4ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFNUQVRFX1BSRUZJWCA9ICdwbGF5ZXItc3RhdGUtJztcblxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGVUxMU0NSRUVOID0gJ2Z1bGxzY3JlZW4nO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBCVUZGRVJJTkcgPSAnYnVmZmVyaW5nJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUkVNT1RFX0NPTlRST0wgPSAncmVtb3RlLWNvbnRyb2wnO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBDT05UUk9MU19TSE9XTiA9ICdjb250cm9scy1zaG93bic7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENPTlRST0xTX0hJRERFTiA9ICdjb250cm9scy1oaWRkZW4nO1xuXG4gIHByaXZhdGUgdWlIaWRlVGltZW91dDogVGltZW91dDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFVJQ29udGFpbmVyQ29uZmlnKSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIDxVSUNvbnRhaW5lckNvbmZpZz57XG4gICAgICBjc3NDbGFzczogJ3VpLXVpY29udGFpbmVyJyxcbiAgICAgIGhpZGVEZWxheTogNTAwMCxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgdGhpcy5jb25maWd1cmVVSVNob3dIaWRlKHBsYXllciwgdWltYW5hZ2VyKTtcbiAgICB0aGlzLmNvbmZpZ3VyZVBsYXllclN0YXRlcyhwbGF5ZXIsIHVpbWFuYWdlcik7XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZVVJU2hvd0hpZGUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgY29udGFpbmVyID0gdGhpcy5nZXREb21FbGVtZW50KCk7XG4gICAgbGV0IGNvbmZpZyA9IDxVSUNvbnRhaW5lckNvbmZpZz50aGlzLmdldENvbmZpZygpO1xuXG4gICAgbGV0IGlzVWlTaG93biA9IGZhbHNlO1xuICAgIGxldCBpc1NlZWtpbmcgPSBmYWxzZTtcbiAgICBsZXQgaXNGaXJzdFRvdWNoID0gdHJ1ZTtcblxuICAgIGxldCBzaG93VWkgPSAoKSA9PiB7XG4gICAgICBpZiAoIWlzVWlTaG93bikge1xuICAgICAgICAvLyBMZXQgc3Vic2NyaWJlcnMga25vdyB0aGF0IHRoZXkgc2hvdWxkIHJldmVhbCB0aGVtc2VsdmVzXG4gICAgICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzU2hvdy5kaXNwYXRjaCh0aGlzKTtcbiAgICAgICAgaXNVaVNob3duID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIERvbid0IHRyaWdnZXIgdGltZW91dCB3aGlsZSBzZWVraW5nIChpdCB3aWxsIGJlIHRyaWdnZXJlZCBvbmNlIHRoZSBzZWVrIGlzIGZpbmlzaGVkKSBvciBjYXN0aW5nXG4gICAgICBpZiAoIWlzU2Vla2luZyAmJiAhcGxheWVyLmlzQ2FzdGluZygpKSB7XG4gICAgICAgIHRoaXMudWlIaWRlVGltZW91dC5zdGFydCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgaGlkZVVpID0gKCkgPT4ge1xuICAgICAgLy8gSGlkZSB0aGUgVUkgb25seSBpZiBpdCBpcyBzaG93biwgYW5kIGlmIG5vdCBjYXN0aW5nXG4gICAgICBpZiAoaXNVaVNob3duICYmICFwbGF5ZXIuaXNDYXN0aW5nKCkpIHtcbiAgICAgICAgLy8gSXNzdWUgYSBwcmV2aWV3IGV2ZW50IHRvIGNoZWNrIGlmIHdlIGFyZSBnb29kIHRvIGhpZGUgdGhlIGNvbnRyb2xzXG4gICAgICAgIGxldCBwcmV2aWV3SGlkZUV2ZW50QXJncyA9IDxDYW5jZWxFdmVudEFyZ3M+e307XG4gICAgICAgIHVpbWFuYWdlci5vblByZXZpZXdDb250cm9sc0hpZGUuZGlzcGF0Y2godGhpcywgcHJldmlld0hpZGVFdmVudEFyZ3MpO1xuXG4gICAgICAgIGlmICghcHJldmlld0hpZGVFdmVudEFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIHByZXZpZXcgd2Fzbid0IGNhbmNlbGVkLCBsZXQgc3Vic2NyaWJlcnMga25vdyB0aGF0IHRoZXkgc2hvdWxkIG5vdyBoaWRlIHRoZW1zZWx2ZXNcbiAgICAgICAgICB1aW1hbmFnZXIub25Db250cm9sc0hpZGUuZGlzcGF0Y2godGhpcyk7XG4gICAgICAgICAgaXNVaVNob3duID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGhpZGUgcHJldmlldyB3YXMgY2FuY2VsZWQsIGNvbnRpbnVlIHRvIHNob3cgVUlcbiAgICAgICAgICBzaG93VWkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUaW1lb3V0IHRvIGRlZmVyIFVJIGhpZGluZyBieSB0aGUgY29uZmlndXJlZCBkZWxheSB0aW1lXG4gICAgdGhpcy51aUhpZGVUaW1lb3V0ID0gbmV3IFRpbWVvdXQoY29uZmlnLmhpZGVEZWxheSwgaGlkZVVpKTtcblxuICAgIC8vIE9uIHRvdWNoIGRpc3BsYXlzLCB0aGUgZmlyc3QgdG91Y2ggcmV2ZWFscyB0aGUgVUlcbiAgICBjb250YWluZXIub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcbiAgICAgIGlmICghaXNVaVNob3duKSB7XG4gICAgICAgIC8vIE9ubHkgaWYgdGhlIFVJIGlzIGhpZGRlbiwgd2UgcHJldmVudCBvdGhlciBhY3Rpb25zIChleGNlcHQgZm9yIHRoZSBmaXJzdCB0b3VjaCkgYW5kIHJldmVhbCB0aGUgVUkgaW5zdGVhZC5cbiAgICAgICAgLy8gVGhlIGZpcnN0IHRvdWNoIGlzIG5vdCBwcmV2ZW50ZWQgdG8gbGV0IG90aGVyIGxpc3RlbmVycyByZWNlaXZlIHRoZSBldmVudCBhbmQgdHJpZ2dlciBhbiBpbml0aWFsIGFjdGlvbiwgZS5nLlxuICAgICAgICAvLyB0aGUgaHVnZSBwbGF5YmFjayBidXR0b24gY2FuIGRpcmVjdGx5IHN0YXJ0IHBsYXliYWNrIGluc3RlYWQgb2YgcmVxdWlyaW5nIGEgZG91YmxlIHRhcCB3aGljaCAxLiByZXZlYWxzXG4gICAgICAgIC8vIHRoZSBVSSBhbmQgMi4gc3RhcnRzIHBsYXliYWNrLlxuICAgICAgICBpZiAoaXNGaXJzdFRvdWNoKSB7XG4gICAgICAgICAgaXNGaXJzdFRvdWNoID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIHNob3dVaSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIFdoZW4gdGhlIG1vdXNlIGVudGVycywgd2Ugc2hvdyB0aGUgVUlcbiAgICBjb250YWluZXIub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICB9KTtcbiAgICAvLyBXaGVuIHRoZSBtb3VzZSBtb3ZlcyB3aXRoaW4sIHdlIHNob3cgdGhlIFVJXG4gICAgY29udGFpbmVyLm9uKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgICBzaG93VWkoKTtcbiAgICB9KTtcbiAgICAvLyBXaGVuIHRoZSBtb3VzZSBsZWF2ZXMsIHdlIGNhbiBwcmVwYXJlIHRvIGhpZGUgdGhlIFVJLCBleGNlcHQgYSBzZWVrIGlzIGdvaW5nIG9uXG4gICAgY29udGFpbmVyLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gV2hlbiBhIHNlZWsgaXMgZ29pbmcgb24sIHRoZSBzZWVrIHNjcnViIHBvaW50ZXIgbWF5IGV4aXQgdGhlIFVJIGFyZWEgd2hpbGUgc3RpbGwgc2Vla2luZywgYW5kIHdlIGRvIG5vdCBoaWRlXG4gICAgICAvLyB0aGUgVUkgaW4gc3VjaCBjYXNlc1xuICAgICAgaWYgKCFpc1NlZWtpbmcpIHtcbiAgICAgICAgdGhpcy51aUhpZGVUaW1lb3V0LnN0YXJ0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB1aW1hbmFnZXIub25TZWVrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnVpSGlkZVRpbWVvdXQuY2xlYXIoKTsgLy8gRG9uJ3QgaGlkZSBVSSB3aGlsZSBhIHNlZWsgaXMgaW4gcHJvZ3Jlc3NcbiAgICAgIGlzU2Vla2luZyA9IHRydWU7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uU2Vla2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpc1NlZWtpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMudWlIaWRlVGltZW91dC5zdGFydCgpOyAvLyBSZS1lbmFibGUgVUkgaGlkZSB0aW1lb3V0IGFmdGVyIGEgc2Vla1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlRFRCwgKCkgPT4ge1xuICAgICAgc2hvd1VpKCk7IC8vIFNob3cgVUkgd2hlbiBhIENhc3Qgc2Vzc2lvbiBoYXMgc3RhcnRlZCAoVUkgd2lsbCB0aGVuIHN0YXkgcGVybWFuZW50bHkgb24gZHVyaW5nIHRoZSBzZXNzaW9uKVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVQbGF5ZXJTdGF0ZXMocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgY29udGFpbmVyID0gdGhpcy5nZXREb21FbGVtZW50KCk7XG5cbiAgICAvLyBDb252ZXJ0IHBsYXllciBzdGF0ZXMgaW50byBDU1MgY2xhc3MgbmFtZXNcbiAgICBsZXQgc3RhdGVDbGFzc05hbWVzID0gPGFueT5bXTtcbiAgICBmb3IgKGxldCBzdGF0ZSBpbiBQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZSkge1xuICAgICAgaWYgKGlzTmFOKE51bWJlcihzdGF0ZSkpKSB7XG4gICAgICAgIGxldCBlbnVtTmFtZSA9IFBsYXllclV0aWxzLlBsYXllclN0YXRlWzxhbnk+UGxheWVyVXRpbHMuUGxheWVyU3RhdGVbc3RhdGVdXTtcbiAgICAgICAgc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlW3N0YXRlXV0gPVxuICAgICAgICAgIHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLlNUQVRFX1BSRUZJWCArIGVudW1OYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZW1vdmVTdGF0ZXMgPSAoKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLklETEVdKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUFJFUEFSRURdKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUExBWUlOR10pO1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZS5QQVVTRURdKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuRklOSVNIRURdKTtcbiAgICB9O1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCAoKSA9PiB7XG4gICAgICByZW1vdmVTdGF0ZXMoKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUFJFUEFSRURdKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9QTEFZLCAoKSA9PiB7XG4gICAgICByZW1vdmVTdGF0ZXMoKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuUExBWUlOR10pO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BBVVNFRCwgKCkgPT4ge1xuICAgICAgcmVtb3ZlU3RhdGVzKCk7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3Moc3RhdGVDbGFzc05hbWVzW1BsYXllclV0aWxzLlBsYXllclN0YXRlLlBBVVNFRF0pO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlCQUNLX0ZJTklTSEVELCAoKSA9PiB7XG4gICAgICByZW1vdmVTdGF0ZXMoKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuUGxheWVyU3RhdGUuRklOSVNIRURdKTtcbiAgICB9KTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsICgpID0+IHtcbiAgICAgIHJlbW92ZVN0YXRlcygpO1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHN0YXRlQ2xhc3NOYW1lc1tQbGF5ZXJVdGlscy5QbGF5ZXJTdGF0ZS5JRExFXSk7XG4gICAgfSk7XG4gICAgLy8gSW5pdCBpbiBjdXJyZW50IHBsYXllciBzdGF0ZVxuICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzdGF0ZUNsYXNzTmFtZXNbUGxheWVyVXRpbHMuZ2V0U3RhdGUocGxheWVyKV0pO1xuXG4gICAgLy8gRnVsbHNjcmVlbiBtYXJrZXIgY2xhc3NcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9GVUxMU0NSRUVOX0VOVEVSLCAoKSA9PiB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuRlVMTFNDUkVFTikpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRVhJVCwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkZVTExTQ1JFRU4pKTtcbiAgICB9KTtcbiAgICAvLyBJbml0IGZ1bGxzY3JlZW4gc3RhdGVcbiAgICBpZiAocGxheWVyLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuRlVMTFNDUkVFTikpO1xuICAgIH1cblxuICAgIC8vIEJ1ZmZlcmluZyBtYXJrZXIgY2xhc3NcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TVEFMTF9TVEFSVEVELCAoKSA9PiB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQlVGRkVSSU5HKSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fU1RBTExfRU5ERUQsICgpID0+IHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5CVUZGRVJJTkcpKTtcbiAgICB9KTtcbiAgICAvLyBJbml0IGJ1ZmZlcmluZyBzdGF0ZVxuICAgIGlmIChwbGF5ZXIuaXNTdGFsbGVkKCkpIHtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5CVUZGRVJJTkcpKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdGVDb250cm9sIG1hcmtlciBjbGFzc1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX0NBU1RfU1RBUlRFRCwgKCkgPT4ge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLlJFTU9URV9DT05UUk9MKSk7XG4gICAgfSk7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fQ0FTVF9TVE9QUEVELCAoKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuUkVNT1RFX0NPTlRST0wpKTtcbiAgICB9KTtcbiAgICAvLyBJbml0IFJlbW90ZUNvbnRyb2wgc3RhdGVcbiAgICBpZiAocGxheWVyLmlzQ2FzdGluZygpKSB7XG4gICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuUkVNT1RFX0NPTlRST0wpKTtcbiAgICB9XG5cbiAgICAvLyBDb250cm9scyB2aXNpYmlsaXR5IG1hcmtlciBjbGFzc1xuICAgIHVpbWFuYWdlci5vbkNvbnRyb2xzU2hvdy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkNPTlRST0xTX0hJRERFTikpO1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKFVJQ29udGFpbmVyLkNPTlRST0xTX1NIT1dOKSk7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29udHJvbHNIaWRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoVUlDb250YWluZXIuQ09OVFJPTFNfU0hPV04pKTtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcyhVSUNvbnRhaW5lci5DT05UUk9MU19ISURERU4pKTtcbiAgICB9KTtcblxuICAgIC8vIExheW91dCBzaXplIGNsYXNzZXNcbiAgICBsZXQgdXBkYXRlTGF5b3V0U2l6ZUNsYXNzZXMgPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC00MDAnKSk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtNjAwJykpO1xuICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTgwMCcpKTtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC0xMjAwJykpO1xuXG4gICAgICBpZiAod2lkdGggPD0gNDAwKSB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbGF5b3V0LW1heC13aWR0aC00MDAnKSk7XG4gICAgICB9IGVsc2UgaWYgKHdpZHRoIDw9IDYwMCkge1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtNjAwJykpO1xuICAgICAgfSBlbHNlIGlmICh3aWR0aCA8PSA4MDApIHtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCdsYXlvdXQtbWF4LXdpZHRoLTgwMCcpKTtcbiAgICAgIH0gZWxzZSBpZiAod2lkdGggPD0gMTIwMCkge1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xheW91dC1tYXgtd2lkdGgtMTIwMCcpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsIChlOiBQbGF5ZXJSZXNpemVFdmVudCkgPT4ge1xuICAgICAgLy8gQ29udmVydCBzdHJpbmdzICh3aXRoIFwicHhcIiBzdWZmaXgpIHRvIGludHNcbiAgICAgIGxldCB3aWR0aCA9IE1hdGgucm91bmQoTnVtYmVyKGUud2lkdGguc3Vic3RyaW5nKDAsIGUud2lkdGgubGVuZ3RoIC0gMikpKTtcbiAgICAgIGxldCBoZWlnaHQgPSBNYXRoLnJvdW5kKE51bWJlcihlLmhlaWdodC5zdWJzdHJpbmcoMCwgZS5oZWlnaHQubGVuZ3RoIC0gMikpKTtcblxuICAgICAgdXBkYXRlTGF5b3V0U2l6ZUNsYXNzZXMod2lkdGgsIGhlaWdodCk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0IGxheW91dCBzdGF0ZVxuICAgIHVwZGF0ZUxheW91dFNpemVDbGFzc2VzKG5ldyBET00ocGxheWVyLmdldEZpZ3VyZSgpKS53aWR0aCgpLCBuZXcgRE9NKHBsYXllci5nZXRGaWd1cmUoKSkuaGVpZ2h0KCkpO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBzdXBlci5yZWxlYXNlKCk7XG4gICAgdGhpcy51aUhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdG9Eb21FbGVtZW50KCk6IERPTSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IHN1cGVyLnRvRG9tRWxlbWVudCgpO1xuXG4gICAgLy8gRGV0ZWN0IGZsZXhib3ggc3VwcG9ydCAobm90IHN1cHBvcnRlZCBpbiBJRTkpXG4gICAgaWYgKGRvY3VtZW50ICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJykuc3R5bGUuZmxleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnZmxleGJveCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLmFkZENsYXNzKHRoaXMucHJlZml4Q3NzKCduby1mbGV4Ym94JykpO1xuICAgIH1cblxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cbn0iLCJpbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9zZWxlY3Rib3gnO1xuaW1wb3J0IHtMaXN0U2VsZWN0b3JDb25maWd9IGZyb20gJy4vbGlzdHNlbGVjdG9yJztcbmltcG9ydCB7VUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4uL3VpbWFuYWdlcic7XG5cbi8qKlxuICogQSBzZWxlY3QgYm94IHByb3ZpZGluZyBhIHNlbGVjdGlvbiBiZXR3ZWVuICdhdXRvJyBhbmQgdGhlIGF2YWlsYWJsZSB2aWRlbyBxdWFsaXRpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1F1YWxpdHlTZWxlY3RCb3ggZXh0ZW5kcyBTZWxlY3RCb3gge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTGlzdFNlbGVjdG9yQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB1cGRhdGVWaWRlb1F1YWxpdGllcyA9ICgpID0+IHtcbiAgICAgIGxldCB2aWRlb1F1YWxpdGllcyA9IHBsYXllci5nZXRBdmFpbGFibGVWaWRlb1F1YWxpdGllcygpO1xuXG4gICAgICB0aGlzLmNsZWFySXRlbXMoKTtcblxuICAgICAgLy8gQWRkIGVudHJ5IGZvciBhdXRvbWF0aWMgcXVhbGl0eSBzd2l0Y2hpbmcgKGRlZmF1bHQgc2V0dGluZylcbiAgICAgIHRoaXMuYWRkSXRlbSgnQXV0bycsICdBdXRvJyk7XG5cbiAgICAgIC8vIEFkZCB2aWRlbyBxdWFsaXRpZXNcbiAgICAgIGZvciAobGV0IHZpZGVvUXVhbGl0eSBvZiB2aWRlb1F1YWxpdGllcykge1xuICAgICAgICB0aGlzLmFkZEl0ZW0odmlkZW9RdWFsaXR5LmlkLCB2aWRlb1F1YWxpdHkubGFiZWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uSXRlbVNlbGVjdGVkLnN1YnNjcmliZSgoc2VuZGVyOiBWaWRlb1F1YWxpdHlTZWxlY3RCb3gsIHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgIHBsYXllci5zZXRWaWRlb1F1YWxpdHkodmFsdWUpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHF1YWxpdGllcyB3aGVuIHNvdXJjZSBnb2VzIGF3YXlcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHVwZGF0ZVZpZGVvUXVhbGl0aWVzKTtcbiAgICAvLyBVcGRhdGUgcXVhbGl0aWVzIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZFxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB1cGRhdGVWaWRlb1F1YWxpdGllcyk7XG4gICAgLy8gVXBkYXRlIHF1YWxpdHkgc2VsZWN0aW9uIHdoZW4gcXVhbGl0eSBpcyBjaGFuZ2VkIChmcm9tIG91dHNpZGUpXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVklERU9fRE9XTkxPQURfUVVBTElUWV9DSEFOR0UsICgpID0+IHtcbiAgICAgIGxldCBkYXRhID0gcGxheWVyLmdldERvd25sb2FkZWRWaWRlb0RhdGEoKTtcbiAgICAgIHRoaXMuc2VsZWN0SXRlbShkYXRhLmlzQXV0byA/ICdBdXRvJyA6IGRhdGEuaWQpO1xuICAgIH0pO1xuXG4gICAgLy8gUG9wdWxhdGUgcXVhbGl0aWVzIGF0IHN0YXJ0dXBcbiAgICB1cGRhdGVWaWRlb1F1YWxpdGllcygpO1xuICB9XG59IiwiaW1wb3J0IHtDb250YWluZXIsIENvbnRhaW5lckNvbmZpZ30gZnJvbSAnLi9jb250YWluZXInO1xuaW1wb3J0IHtWb2x1bWVTbGlkZXJ9IGZyb20gJy4vdm9sdW1lc2xpZGVyJztcbmltcG9ydCB7Vm9sdW1lVG9nZ2xlQnV0dG9ufSBmcm9tICcuL3ZvbHVtZXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1VJSW5zdGFuY2VNYW5hZ2VyfSBmcm9tICcuLi91aW1hbmFnZXInO1xuaW1wb3J0IHtUaW1lb3V0fSBmcm9tICcuLi90aW1lb3V0JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgVm9sdW1lQ29udHJvbEJ1dHRvbn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVm9sdW1lQ29udHJvbEJ1dHRvbkNvbmZpZyBleHRlbmRzIENvbnRhaW5lckNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgZGVsYXkgYWZ0ZXIgd2hpY2ggdGhlIHZvbHVtZSBzbGlkZXIgd2lsbCBiZSBoaWRkZW4gd2hlbiB0aGVyZSBpcyBubyB1c2VyIGludGVyYWN0aW9uLlxuICAgKiBDYXJlIG11c3QgYmUgdGFrZW4gdGhhdCB0aGUgZGVsYXkgaXMgbG9uZyBlbm91Z2ggc28gdXNlcnMgY2FuIHJlYWNoIHRoZSBzbGlkZXIgZnJvbSB0aGUgdG9nZ2xlIGJ1dHRvbiwgZS5nLiBieVxuICAgKiBtb3VzZSBtb3ZlbWVudC4gSWYgdGhlIGRlbGF5IGlzIHRvbyBzaG9ydCwgdGhlIHNsaWRlcnMgZGlzYXBwZWFycyBiZWZvcmUgdGhlIG1vdXNlIHBvaW50ZXIgaGFzIHJlYWNoZWQgaXQgYW5kXG4gICAqIHRoZSB1c2VyIGlzIG5vdCBhYmxlIHRvIHVzZSBpdC5cbiAgICogRGVmYXVsdDogNTAwbXNcbiAgICovXG4gIGhpZGVEZWxheT86IG51bWJlcjtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiB0aGUgdm9sdW1lIHNsaWRlciBzaG91bGQgYmUgdmVydGljYWxseSBvciBob3Jpem9udGFsbHkgYWxpZ25lZC5cbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgdmVydGljYWw/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgY29tcG9zaXRlIHZvbHVtZSBjb250cm9sIHRoYXQgY29uc2lzdHMgb2YgYW5kIGludGVybmFsbHkgbWFuYWdlcyBhIHZvbHVtZSBjb250cm9sIGJ1dHRvbiB0aGF0IGNhbiBiZSB1c2VkXG4gKiBmb3IgbXV0aW5nLCBhbmQgYSAoZGVwZW5kaW5nIG9uIHRoZSBDU1Mgc3R5bGUsIGUuZy4gc2xpZGUtb3V0KSB2b2x1bWUgY29udHJvbCBiYXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBWb2x1bWVDb250cm9sQnV0dG9uIGV4dGVuZHMgQ29udGFpbmVyPFZvbHVtZUNvbnRyb2xCdXR0b25Db25maWc+IHtcblxuICBwcml2YXRlIHZvbHVtZVRvZ2dsZUJ1dHRvbjogVm9sdW1lVG9nZ2xlQnV0dG9uO1xuICBwcml2YXRlIHZvbHVtZVNsaWRlcjogVm9sdW1lU2xpZGVyO1xuXG4gIHByaXZhdGUgdm9sdW1lU2xpZGVySGlkZVRpbWVvdXQ6IFRpbWVvdXQ7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBWb2x1bWVDb250cm9sQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy52b2x1bWVUb2dnbGVCdXR0b24gPSBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCk7XG4gICAgdGhpcy52b2x1bWVTbGlkZXIgPSBuZXcgVm9sdW1lU2xpZGVyKHtcbiAgICAgIHZlcnRpY2FsOiBjb25maWcudmVydGljYWwgIT0gbnVsbCA/IGNvbmZpZy52ZXJ0aWNhbCA6IHRydWUsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9KTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktdm9sdW1lY29udHJvbGJ1dHRvbicsXG4gICAgICBjb21wb25lbnRzOiBbdGhpcy52b2x1bWVUb2dnbGVCdXR0b24sIHRoaXMudm9sdW1lU2xpZGVyXSxcbiAgICAgIGhpZGVEZWxheTogNTAwXG4gICAgfSwgPFZvbHVtZUNvbnRyb2xCdXR0b25Db25maWc+dGhpcy5jb25maWcpO1xuICB9XG5cbiAgY29uZmlndXJlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJLCB1aW1hbmFnZXI6IFVJSW5zdGFuY2VNYW5hZ2VyKTogdm9pZCB7XG4gICAgc3VwZXIuY29uZmlndXJlKHBsYXllciwgdWltYW5hZ2VyKTtcblxuICAgIGxldCB2b2x1bWVUb2dnbGVCdXR0b24gPSB0aGlzLmdldFZvbHVtZVRvZ2dsZUJ1dHRvbigpO1xuICAgIGxldCB2b2x1bWVTbGlkZXIgPSB0aGlzLmdldFZvbHVtZVNsaWRlcigpO1xuXG4gICAgdGhpcy52b2x1bWVTbGlkZXJIaWRlVGltZW91dCA9IG5ldyBUaW1lb3V0KCg8Vm9sdW1lQ29udHJvbEJ1dHRvbkNvbmZpZz50aGlzLmdldENvbmZpZygpKS5oaWRlRGVsYXksICgpID0+IHtcbiAgICAgIHZvbHVtZVNsaWRlci5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICAvKlxuICAgICAqIFZvbHVtZSBTbGlkZXIgdmlzaWJpbGl0eSBoYW5kbGluZ1xuICAgICAqXG4gICAgICogVGhlIHZvbHVtZSBzbGlkZXIgc2hhbGwgYmUgdmlzaWJsZSB3aGlsZSB0aGUgdXNlciBob3ZlcnMgdGhlIG11dGUgdG9nZ2xlIGJ1dHRvbiwgd2hpbGUgdGhlIHVzZXIgaG92ZXJzIHRoZVxuICAgICAqIHZvbHVtZSBzbGlkZXIsIGFuZCB3aGlsZSB0aGUgdXNlciBzbGlkZXMgdGhlIHZvbHVtZSBzbGlkZXIuIElmIG5vbmUgb2YgdGhlc2Ugc2l0dWF0aW9ucyBhcmUgdHJ1ZSwgdGhlIHNsaWRlclxuICAgICAqIHNoYWxsIGRpc2FwcGVhci5cbiAgICAgKi9cbiAgICBsZXQgdm9sdW1lU2xpZGVySG92ZXJlZCA9IGZhbHNlO1xuICAgIHZvbHVtZVRvZ2dsZUJ1dHRvbi5nZXREb21FbGVtZW50KCkub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAvLyBTaG93IHZvbHVtZSBzbGlkZXIgd2hlbiBtb3VzZSBlbnRlcnMgdGhlIGJ1dHRvbiBhcmVhXG4gICAgICBpZiAodm9sdW1lU2xpZGVyLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdm9sdW1lU2xpZGVyLnNob3coKTtcbiAgICAgIH1cbiAgICAgIC8vIEF2b2lkIGhpZGluZyBvZiB0aGUgc2xpZGVyIHdoZW4gYnV0dG9uIGlzIGhvdmVyZWRcbiAgICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgICB9KTtcbiAgICB2b2x1bWVUb2dnbGVCdXR0b24uZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gSGlkZSBzbGlkZXIgZGVsYXllZCB3aGVuIGJ1dHRvbiBpcyBsZWZ0XG4gICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgfSk7XG4gICAgdm9sdW1lU2xpZGVyLmdldERvbUVsZW1lbnQoKS5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgIC8vIFdoZW4gdGhlIHNsaWRlciBpcyBlbnRlcmVkLCBjYW5jZWwgdGhlIGhpZGUgdGltZW91dCBhY3RpdmF0ZWQgYnkgbGVhdmluZyB0aGUgYnV0dG9uXG4gICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB2b2x1bWVTbGlkZXJIb3ZlcmVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICB2b2x1bWVTbGlkZXIuZ2V0RG9tRWxlbWVudCgpLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gV2hlbiBtb3VzZSBsZWF2ZXMgdGhlIHNsaWRlciwgb25seSBoaWRlIGl0IGlmIHRoZXJlIGlzIG5vIHNsaWRlIG9wZXJhdGlvbiBpbiBwcm9ncmVzc1xuICAgICAgaWYgKHZvbHVtZVNsaWRlci5pc1NlZWtpbmcoKSkge1xuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LmNsZWFyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZvbHVtZVNsaWRlckhpZGVUaW1lb3V0LnJlc2V0KCk7XG4gICAgICB9XG4gICAgICB2b2x1bWVTbGlkZXJIb3ZlcmVkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdm9sdW1lU2xpZGVyLm9uU2Vla2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBXaGVuIGEgc2xpZGUgb3BlcmF0aW9uIGlzIGRvbmUgYW5kIHRoZSBzbGlkZXIgbm90IGhvdmVyZWQgKG1vdXNlIG91dHNpZGUgc2xpZGVyKSwgaGlkZSBzbGlkZXIgZGVsYXllZFxuICAgICAgaWYgKCF2b2x1bWVTbGlkZXJIb3ZlcmVkKSB7XG4gICAgICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQucmVzZXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgc3VwZXIucmVsZWFzZSgpO1xuICAgIHRoaXMudm9sdW1lU2xpZGVySGlkZVRpbWVvdXQuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGludGVybmFsbHkgbWFuYWdlZCB2b2x1bWUgdG9nZ2xlIGJ1dHRvbi5cbiAgICogQHJldHVybnMge1ZvbHVtZVRvZ2dsZUJ1dHRvbn1cbiAgICovXG4gIGdldFZvbHVtZVRvZ2dsZUJ1dHRvbigpOiBWb2x1bWVUb2dnbGVCdXR0b24ge1xuICAgIHJldHVybiB0aGlzLnZvbHVtZVRvZ2dsZUJ1dHRvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGludGVybmFsbHkgbWFuYWdlZCB2b2x1bWUgc2lsZGVyLlxuICAgKiBAcmV0dXJucyB7Vm9sdW1lU2xpZGVyfVxuICAgKi9cbiAgZ2V0Vm9sdW1lU2xpZGVyKCk6IFZvbHVtZVNsaWRlciB7XG4gICAgcmV0dXJuIHRoaXMudm9sdW1lU2xpZGVyO1xuICB9XG59IiwiaW1wb3J0IHtTZWVrQmFyLCBTZWVrQmFyQ29uZmlnfSBmcm9tICcuL3NlZWtiYXInO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgdGhlIHtAbGluayBWb2x1bWVTbGlkZXJ9IGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWb2x1bWVTbGlkZXJDb25maWcgZXh0ZW5kcyBTZWVrQmFyQ29uZmlnIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyBpZiB0aGUgdm9sdW1lIHNsaWRlciBzaG91bGQgYmUgYXV0b21hdGljYWxseSBoaWRkZW4gd2hlbiB2b2x1bWUgY29udHJvbCBpcyBwcm9oaWJpdGVkIGJ5IHRoZVxuICAgKiBicm93c2VyIG9yIHBsYXRmb3JtLiBUaGlzIGN1cnJlbnRseSBvbmx5IGFwcGxpZXMgdG8gaU9TLlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBoaWRlSWZWb2x1bWVDb250cm9sUHJvaGliaXRlZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSB2b2x1bWUgc2xpZGVyIGNvbXBvbmVudCB0byBhZGp1c3QgdGhlIHBsYXllcidzIHZvbHVtZSBzZXR0aW5nLlxuICovXG5leHBvcnQgY2xhc3MgVm9sdW1lU2xpZGVyIGV4dGVuZHMgU2Vla0JhciB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBTZWVrQmFyQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywgPFZvbHVtZVNsaWRlckNvbmZpZz57XG4gICAgICBjc3NDbGFzczogJ3VpLXZvbHVtZXNsaWRlcicsXG4gICAgICBoaWRlSWZWb2x1bWVDb250cm9sUHJvaGliaXRlZDogdHJ1ZSxcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIsIGZhbHNlKTtcblxuICAgIGxldCBjb25maWcgPSA8Vm9sdW1lU2xpZGVyQ29uZmlnPnRoaXMuZ2V0Q29uZmlnKCk7XG5cbiAgICBpZiAoY29uZmlnLmhpZGVJZlZvbHVtZUNvbnRyb2xQcm9oaWJpdGVkICYmICF0aGlzLmRldGVjdFZvbHVtZUNvbnRyb2xBdmFpbGFiaWxpdHkocGxheWVyKSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG5cbiAgICAgIC8vIFdlIGNhbiBqdXN0IHJldHVybiBmcm9tIGhlcmUsIGJlY2F1c2UgdGhlIHVzZXIgd2lsbCBuZXZlciBpbnRlcmFjdCB3aXRoIHRoZSBjb250cm9sIGFuZCBhbnkgY29uZmlndXJlZFxuICAgICAgLy8gZnVuY3Rpb25hbGl0eSB3b3VsZCBvbmx5IGVhdCByZXNvdXJjZXMgZm9yIG5vIHJlYXNvbi5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdm9sdW1lQ2hhbmdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNNdXRlZCgpKSB7XG4gICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbigwKTtcbiAgICAgICAgdGhpcy5zZXRCdWZmZXJQb3NpdGlvbigwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0UGxheWJhY2tQb3NpdGlvbihwbGF5ZXIuZ2V0Vm9sdW1lKCkpO1xuXG4gICAgICAgIHRoaXMuc2V0QnVmZmVyUG9zaXRpb24ocGxheWVyLmdldFZvbHVtZSgpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIHZvbHVtZUNoYW5nZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZPTFVNRV9DSEFOR0VELCB2b2x1bWVDaGFuZ2VIYW5kbGVyKTtcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9NVVRFRCwgdm9sdW1lQ2hhbmdlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVU5NVVRFRCwgdm9sdW1lQ2hhbmdlSGFuZGxlcik7XG5cbiAgICB0aGlzLm9uU2Vla1ByZXZpZXcuc3Vic2NyaWJlKChzZW5kZXIsIGFyZ3MpID0+IHtcbiAgICAgIGlmIChhcmdzLnNjcnViYmluZykge1xuICAgICAgICBwbGF5ZXIuc2V0Vm9sdW1lKGFyZ3MucG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMub25TZWVrZWQuc3Vic2NyaWJlKChzZW5kZXIsIHBlcmNlbnRhZ2UpID0+IHtcbiAgICAgIHBsYXllci5zZXRWb2x1bWUocGVyY2VudGFnZSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIHZvbHVtZSBzbGlkZXIgbWFya2VyIHdoZW4gdGhlIHBsYXllciByZXNpemVkLCBhIHNvdXJjZSBpcyBsb2FkZWQgYW5kIHBsYXllciBpcyByZWFkeSxcbiAgICAvLyBvciB0aGUgVUkgaXMgY29uZmlndXJlZC4gQ2hlY2sgdGhlIHNlZWtiYXIgZm9yIGEgZGV0YWlsZWQgZGVzY3JpcHRpb24uXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWUVSX1JFU0laRSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hQbGF5YmFja1Bvc2l0aW9uKCk7XG4gICAgfSk7XG4gICAgdWltYW5hZ2VyLm9uQ29uZmlndXJlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoUGxheWJhY2tQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdCB2b2x1bWUgYmFyXG4gICAgdm9sdW1lQ2hhbmdlSGFuZGxlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXRlY3RWb2x1bWVDb250cm9sQXZhaWxhYmlsaXR5KHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJKTogYm9vbGVhbiB7XG4gICAgLy8gU3RvcmUgY3VycmVudCBwbGF5ZXIgc3RhdGUgc28gd2UgY2FuIHJlc3RvcmUgaXQgbGF0ZXJcbiAgICBsZXQgdm9sdW1lID0gcGxheWVyLmdldFZvbHVtZSgpO1xuICAgIGxldCBtdXRlZCA9IHBsYXllci5pc011dGVkKCk7XG4gICAgbGV0IHBsYXlpbmcgPSBwbGF5ZXIuaXNQbGF5aW5nKCk7XG5cbiAgICAvKlxuICAgICAqIFwiT24gaU9TIGRldmljZXMsIHRoZSBhdWRpbyBsZXZlbCBpcyBhbHdheXMgdW5kZXIgdGhlIHVzZXLigJlzIHBoeXNpY2FsIGNvbnRyb2wuIFRoZSB2b2x1bWUgcHJvcGVydHkgaXMgbm90XG4gICAgICogc2V0dGFibGUgaW4gSmF2YVNjcmlwdC4gUmVhZGluZyB0aGUgdm9sdW1lIHByb3BlcnR5IGFsd2F5cyByZXR1cm5zIDEuXCJcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5hcHBsZS5jb20vbGlicmFyeS9jb250ZW50L2RvY3VtZW50YXRpb24vQXVkaW9WaWRlby9Db25jZXB0dWFsL1VzaW5nX0hUTUw1X0F1ZGlvX1ZpZGVvL0RldmljZS1TcGVjaWZpY0NvbnNpZGVyYXRpb25zL0RldmljZS1TcGVjaWZpY0NvbnNpZGVyYXRpb25zLmh0bWxcbiAgICAgKlxuICAgICAqIE91ciBwbGF5ZXIgQVBJIHJldHVybnMgYSB2b2x1bWUgcmFuZ2Ugb2YgWzAsIDEwMF0gc28gd2UgbmVlZCB0byBjaGVjayBmb3IgMTAwIGluc3RlYWQgb2YgMS5cbiAgICAgKi9cblxuICAgIC8vIE9ubHkgaWYgdGhlIHZvbHVtZSBpcyAxMDAsIHRoZXJlJ3MgdGhlIHBvc3NpYmlsaXR5IHdlIGFyZSBvbiBhIHZvbHVtZS1jb250cm9sLXJlc3RyaWN0ZWQgaU9TIGRldmljZVxuICAgIGlmICh2b2x1bWUgPT09IDEwMCkge1xuICAgICAgLy8gV2Ugc2V0IHRoZSB2b2x1bWUgdG8gemVybyAodGhhdCdzIHRoZSBvbmx5IHZhbHVlIHRoYXQgZG9lcyBub3QgdW5tdXRlIGEgbXV0ZWQgcGxheWVyISlcbiAgICAgIHBsYXllci5zZXRWb2x1bWUoMCk7XG4gICAgICAvLyBUaGVuIHdlIGNoZWNrIGlmIHRoZSB2YWx1ZSBpcyBzdGlsbCAxMDBcbiAgICAgIGlmIChwbGF5ZXIuZ2V0Vm9sdW1lKCkgPT09IDEwMCkge1xuICAgICAgICAvLyBJZiB0aGUgdm9sdW1lIHN0YXllZCBhdCAxMDAsIHdlJ3JlIG9uIGEgdm9sdW1lLWNvbnRyb2wtcmVzdHJpY3RlZCBkZXZpY2VcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2UgY2FuIGNvbnRyb2wgdm9sdW1lLCBzbyB3ZSBtdXN0IHJlc3RvcmUgdGhlIHByZXZpb3VzIHBsYXllciBzdGF0ZVxuICAgICAgICBwbGF5ZXIuc2V0Vm9sdW1lKHZvbHVtZSk7XG4gICAgICAgIGlmIChtdXRlZCkge1xuICAgICAgICAgIHBsYXllci5tdXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYXlpbmcpIHtcbiAgICAgICAgICAvLyBUaGUgdm9sdW1lIHJlc3RvcmUgYWJvdmUgcGF1c2VzIGF1dG9wbGF5IG9uIG1vYmlsZSBkZXZpY2VzIChlLmcuIEFuZHJvaWQpIHNvIHdlIG5lZWQgdG8gcmVzdW1lIHBsYXliYWNrXG4gICAgICAgICAgLy8gKFdlIGNhbm5vdCBjaGVjayBpc1BhdXNlZCgpIGhlcmUgYmVjYXVzZSBpdCBpcyBub3Qgc2V0IHdoZW4gcGxheWJhY2sgaXMgcHJvaGliaXRlZCBieSB0aGUgbW9iaWxlIHBsYXRmb3JtKVxuICAgICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFZvbHVtZSBpcyBub3QgMTAwLCBzbyB3ZSdyZSBkZWZpbml0ZWx5IG5vdCBvbiBhIHZvbHVtZS1jb250cm9sLXJlc3RyaWN0ZWQgaU9TIGRldmljZVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgYXVkaW8gbXV0aW5nLlxuICovXG5leHBvcnQgY2xhc3MgVm9sdW1lVG9nZ2xlQnV0dG9uIGV4dGVuZHMgVG9nZ2xlQnV0dG9uPFRvZ2dsZUJ1dHRvbkNvbmZpZz4ge1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogVG9nZ2xlQnV0dG9uQ29uZmlnID0ge30pIHtcbiAgICBzdXBlcihjb25maWcpO1xuXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKGNvbmZpZywge1xuICAgICAgY3NzQ2xhc3M6ICd1aS12b2x1bWV0b2dnbGVidXR0b24nLFxuICAgICAgdGV4dDogJ1ZvbHVtZS9NdXRlJ1xuICAgIH0sIHRoaXMuY29uZmlnKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShwbGF5ZXI6IGJpdG1vdmluLlBsYXllckFQSSwgdWltYW5hZ2VyOiBVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShwbGF5ZXIsIHVpbWFuYWdlcik7XG5cbiAgICBsZXQgbXV0ZVN0YXRlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuaXNNdXRlZCgpKSB7XG4gICAgICAgIHRoaXMub24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub2ZmKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxldCB2b2x1bWVMZXZlbEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAvLyBUb2dnbGUgbG93IGNsYXNzIHRvIGRpc3BsYXkgbG93IHZvbHVtZSBpY29uIGJlbG93IDUwJSB2b2x1bWVcbiAgICAgIGlmIChwbGF5ZXIuZ2V0Vm9sdW1lKCkgPCA1MCkge1xuICAgICAgICB0aGlzLmdldERvbUVsZW1lbnQoKS5hZGRDbGFzcyh0aGlzLnByZWZpeENzcygnbG93JykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXREb21FbGVtZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5wcmVmaXhDc3MoJ2xvdycpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fTVVURUQsIG11dGVTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1VOTVVURUQsIG11dGVTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZPTFVNRV9DSEFOR0VELCB2b2x1bWVMZXZlbEhhbmRsZXIpO1xuXG4gICAgdGhpcy5vbkNsaWNrLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmlzTXV0ZWQoKSkge1xuICAgICAgICBwbGF5ZXIudW5tdXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIubXV0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU3RhcnR1cCBpbml0XG4gICAgbXV0ZVN0YXRlSGFuZGxlcigpO1xuICAgIHZvbHVtZUxldmVsSGFuZGxlcigpO1xuICB9XG59IiwiaW1wb3J0IHtUb2dnbGVCdXR0b24sIFRvZ2dsZUJ1dHRvbkNvbmZpZ30gZnJvbSAnLi90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtVSUluc3RhbmNlTWFuYWdlcn0gZnJvbSAnLi4vdWltYW5hZ2VyJztcblxuLyoqXG4gKiBBIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIHZpZGVvIHZpZXcgYmV0d2VlbiBub3JtYWwvbW9ubyBhbmQgVlIvc3RlcmVvLlxuICovXG5leHBvcnQgY2xhc3MgVlJUb2dnbGVCdXR0b24gZXh0ZW5kcyBUb2dnbGVCdXR0b248VG9nZ2xlQnV0dG9uQ29uZmlnPiB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBUb2dnbGVCdXR0b25Db25maWcgPSB7fSkge1xuICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWcoY29uZmlnLCB7XG4gICAgICBjc3NDbGFzczogJ3VpLXZydG9nZ2xlYnV0dG9uJyxcbiAgICAgIHRleHQ6ICdWUidcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH1cblxuICBjb25maWd1cmUocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEksIHVpbWFuYWdlcjogVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmUocGxheWVyLCB1aW1hbmFnZXIpO1xuXG4gICAgbGV0IGlzVlJDb25maWd1cmVkID0gKCkgPT4ge1xuICAgICAgLy8gVlIgYXZhaWxhYmlsaXR5IGNhbm5vdCBiZSBjaGVja2VkIHRocm91Z2ggZ2V0VlJTdGF0dXMoKSBiZWNhdXNlIGl0IGlzIGFzeW5jaHJvbm91c2x5IHBvcHVsYXRlZCBhbmQgbm90XG4gICAgICAvLyBhdmFpbGFibGUgYXQgVUkgaW5pdGlhbGl6YXRpb24uIEFzIGFuIGFsdGVybmF0aXZlLCB3ZSBjaGVjayB0aGUgVlIgc2V0dGluZ3MgaW4gdGhlIGNvbmZpZy5cbiAgICAgIC8vIFRPRE8gdXNlIGdldFZSU3RhdHVzKCkgdGhyb3VnaCBpc1ZSU3RlcmVvQXZhaWxhYmxlKCkgb25jZSB0aGUgcGxheWVyIGhhcyBiZWVuIHJld3JpdHRlbiBhbmQgdGhlIHN0YXR1cyBpc1xuICAgICAgLy8gYXZhaWxhYmxlIGluIE9OX1JFQURZXG4gICAgICBsZXQgY29uZmlnID0gcGxheWVyLmdldENvbmZpZygpO1xuICAgICAgcmV0dXJuIGNvbmZpZy5zb3VyY2UgJiYgY29uZmlnLnNvdXJjZS52ciAmJiBjb25maWcuc291cmNlLnZyLmNvbnRlbnRUeXBlICE9PSAnbm9uZSc7XG4gICAgfTtcblxuICAgIGxldCBpc1ZSU3RlcmVvQXZhaWxhYmxlID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIHBsYXllci5nZXRWUlN0YXR1cygpLmNvbnRlbnRUeXBlICE9PSAnbm9uZSc7XG4gICAgfTtcblxuICAgIGxldCB2clN0YXRlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChpc1ZSQ29uZmlndXJlZCgpICYmIGlzVlJTdGVyZW9BdmFpbGFibGUoKSkge1xuICAgICAgICB0aGlzLnNob3coKTsgLy8gc2hvdyBidXR0b24gaW4gY2FzZSBpdCBpcyBoaWRkZW5cblxuICAgICAgICBpZiAocGxheWVyLmdldFZSU3RhdHVzKCkuaXNTdGVyZW8pIHtcbiAgICAgICAgICB0aGlzLm9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vZmYoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7IC8vIGhpZGUgYnV0dG9uIGlmIG5vIHN0ZXJlbyBtb2RlIGF2YWlsYWJsZVxuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdnJCdXR0b25WaXNpYmlsaXR5SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGlmIChpc1ZSQ29uZmlndXJlZCgpKSB7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZSX01PREVfQ0hBTkdFRCwgdnJTdGF0ZUhhbmRsZXIpO1xuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1ZSX1NURVJFT19DSEFOR0VELCB2clN0YXRlSGFuZGxlcik7XG4gICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fVlJfRVJST1IsIHZyU3RhdGVIYW5kbGVyKTtcbiAgICAvLyBIaWRlIGJ1dHRvbiB3aGVuIFZSIHNvdXJjZSBnb2VzIGF3YXlcbiAgICBwbGF5ZXIuYWRkRXZlbnRIYW5kbGVyKHBsYXllci5FVkVOVC5PTl9TT1VSQ0VfVU5MT0FERUQsIHZyQnV0dG9uVmlzaWJpbGl0eUhhbmRsZXIpO1xuICAgIC8vIFNob3cgYnV0dG9uIHdoZW4gYSBuZXcgc291cmNlIGlzIGxvYWRlZCBhbmQgaXQncyBWUlxuICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB2ckJ1dHRvblZpc2liaWxpdHlIYW5kbGVyKTtcblxuICAgIHRoaXMub25DbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKCFpc1ZSU3RlcmVvQXZhaWxhYmxlKCkpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gVlIgY29udGVudCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGxheWVyLmdldFZSU3RhdHVzKCkuaXNTdGVyZW8pIHtcbiAgICAgICAgICBwbGF5ZXIuc2V0VlJTdGVyZW8oZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYXllci5zZXRWUlN0ZXJlbyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0IHN0YXJ0dXAgdmlzaWJpbGl0eVxuICAgIHZyQnV0dG9uVmlzaWJpbGl0eUhhbmRsZXIoKTtcbiAgfVxufSIsImltcG9ydCB7Q2xpY2tPdmVybGF5LCBDbGlja092ZXJsYXlDb25maWd9IGZyb20gJy4vY2xpY2tvdmVybGF5JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGludGVyZmFjZSBmb3IgYSB7QGxpbmsgQ2xpY2tPdmVybGF5fS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBXYXRlcm1hcmtDb25maWcgZXh0ZW5kcyBDbGlja092ZXJsYXlDb25maWcge1xuICAvLyBub3RoaW5nIHlldFxufVxuXG4vKipcbiAqIEEgd2F0ZXJtYXJrIG92ZXJsYXkgd2l0aCBhIGNsaWNrYWJsZSBsb2dvLlxuICovXG5leHBvcnQgY2xhc3MgV2F0ZXJtYXJrIGV4dGVuZHMgQ2xpY2tPdmVybGF5IHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFdhdGVybWFya0NvbmZpZyA9IHt9KSB7XG4gICAgc3VwZXIoY29uZmlnKTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5tZXJnZUNvbmZpZyhjb25maWcsIHtcbiAgICAgIGNzc0NsYXNzOiAndWktd2F0ZXJtYXJrJyxcbiAgICAgIHVybDogJ2h0dHA6Ly9iaXRtb3Zpbi5jb20nXG4gICAgfSwgPFdhdGVybWFya0NvbmZpZz50aGlzLmNvbmZpZyk7XG4gIH1cbn0iLCJleHBvcnQgaW50ZXJmYWNlIE9mZnNldCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG59XG5cbi8qKlxuICogU2ltcGxlIERPTSBtYW5pcHVsYXRpb24gYW5kIERPTSBlbGVtZW50IGV2ZW50IGhhbmRsaW5nIG1vZGVsZWQgYWZ0ZXIgalF1ZXJ5IChhcyByZXBsYWNlbWVudCBmb3IgalF1ZXJ5KS5cbiAqXG4gKiBMaWtlIGpRdWVyeSwgRE9NIG9wZXJhdGVzIG9uIHNpbmdsZSBlbGVtZW50cyBhbmQgbGlzdHMgb2YgZWxlbWVudHMuIEZvciBleGFtcGxlOiBjcmVhdGluZyBhbiBlbGVtZW50IHJldHVybnMgYSBET01cbiAqIGluc3RhbmNlIHdpdGggYSBzaW5nbGUgZWxlbWVudCwgc2VsZWN0aW5nIGVsZW1lbnRzIHJldHVybnMgYSBET00gaW5zdGFuY2Ugd2l0aCB6ZXJvLCBvbmUsIG9yIG1hbnkgZWxlbWVudHMuIFNpbWlsYXJcbiAqIHRvIGpRdWVyeSwgc2V0dGVycyB1c3VhbGx5IGFmZmVjdCBhbGwgZWxlbWVudHMsIHdoaWxlIGdldHRlcnMgb3BlcmF0ZSBvbiBvbmx5IHRoZSBmaXJzdCBlbGVtZW50LlxuICogQWxzbyBzaW1pbGFyIHRvIGpRdWVyeSwgbW9zdCBtZXRob2RzIChleGNlcHQgZ2V0dGVycykgcmV0dXJuIHRoZSBET00gaW5zdGFuY2UgZmFjaWxpdGF0aW5nIGVhc3kgY2hhaW5pbmcgb2YgbWV0aG9kXG4gKiBjYWxscy5cbiAqXG4gKiBCdWlsdCB3aXRoIHRoZSBoZWxwIG9mOiBodHRwOi8veW91bWlnaHRub3RuZWVkanF1ZXJ5LmNvbS9cbiAqL1xuZXhwb3J0IGNsYXNzIERPTSB7XG5cbiAgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGVsZW1lbnRzIHRoYXQgdGhlIGluc3RhbmNlIHdyYXBzLiBUYWtlIGNhcmUgdGhhdCBub3QgYWxsIG1ldGhvZHMgY2FuIG9wZXJhdGUgb24gdGhlIHdob2xlIGxpc3QsXG4gICAqIGdldHRlcnMgdXN1YWxseSBqdXN0IHdvcmsgb24gdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqL1xuICBwcml2YXRlIGVsZW1lbnRzOiBIVE1MRWxlbWVudFtdO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgRE9NIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB0YWdOYW1lIHRoZSB0YWcgbmFtZSBvZiB0aGUgRE9NIGVsZW1lbnRcbiAgICogQHBhcmFtIGF0dHJpYnV0ZXMgYSBsaXN0IG9mIGF0dHJpYnV0ZXMgb2YgdGhlIGVsZW1lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHRhZ05hbWU6IHN0cmluZywgYXR0cmlidXRlczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0pO1xuICAvKipcbiAgICogU2VsZWN0cyBhbGwgZWxlbWVudHMgZnJvbSB0aGUgRE9NIHRoYXQgbWF0Y2ggdGhlIHNwZWNpZmllZCBzZWxlY3Rvci5cbiAgICogQHBhcmFtIHNlbGVjdG9yIHRoZSBzZWxlY3RvciB0byBtYXRjaCBET00gZWxlbWVudHMgd2l0aFxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3I6IHN0cmluZyk7XG4gIC8qKlxuICAgKiBXcmFwcyBhIHBsYWluIEhUTUxFbGVtZW50IHdpdGggYSBET00gaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBlbGVtZW50IHRoZSBIVE1MRWxlbWVudCB0byB3cmFwIHdpdGggRE9NXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCk7XG4gIC8qKlxuICAgKiBXcmFwcyBhIGxpc3Qgb2YgcGxhaW4gSFRNTEVsZW1lbnRzIHdpdGggYSBET00gaW5zdGFuY2UuXG4gICAqIEBwYXJhbSBlbGVtZW50IHRoZSBIVE1MRWxlbWVudHMgdG8gd3JhcCB3aXRoIERPTVxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudHM6IEhUTUxFbGVtZW50W10pO1xuICAvKipcbiAgICogV3JhcHMgdGhlIGRvY3VtZW50IHdpdGggYSBET00gaW5zdGFuY2UuIFVzZWZ1bCB0byBhdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBkb2N1bWVudC5cbiAgICogQHBhcmFtIGRvY3VtZW50IHRoZSBkb2N1bWVudCB0byB3cmFwXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihkb2N1bWVudDogRG9jdW1lbnQpO1xuICBjb25zdHJ1Y3Rvcihzb21ldGhpbmc6IHN0cmluZyB8IEhUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSB8IERvY3VtZW50LCBhdHRyaWJ1dGVzPzogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7IC8vIFNldCB0aGUgZ2xvYmFsIGRvY3VtZW50IHRvIHRoZSBsb2NhbCBkb2N1bWVudCBmaWVsZFxuXG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBpZiAoc29tZXRoaW5nLmxlbmd0aCA+IDAgJiYgc29tZXRoaW5nWzBdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGVsZW1lbnRzID0gc29tZXRoaW5nO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHM7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBsZXQgZWxlbWVudCA9IHNvbWV0aGluZztcbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbZWxlbWVudF07XG4gICAgfVxuICAgIGVsc2UgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIERvY3VtZW50KSB7XG4gICAgICAvLyBXaGVuIGEgZG9jdW1lbnQgaXMgcGFzc2VkIGluLCB3ZSBkbyBub3QgZG8gYW55dGhpbmcgd2l0aCBpdCwgYnV0IGJ5IHNldHRpbmcgdGhpcy5lbGVtZW50cyB0byBudWxsXG4gICAgICAvLyB3ZSBnaXZlIHRoZSBldmVudCBoYW5kbGluZyBtZXRob2QgYSBtZWFucyB0byBkZXRlY3QgaWYgdGhlIGV2ZW50cyBzaG91bGQgYmUgcmVnaXN0ZXJlZCBvbiB0aGUgZG9jdW1lbnRcbiAgICAgIC8vIGluc3RlYWQgb2YgZWxlbWVudHMuXG4gICAgICB0aGlzLmVsZW1lbnRzID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSBpZiAoYXR0cmlidXRlcykge1xuICAgICAgbGV0IHRhZ05hbWUgPSBzb21ldGhpbmc7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZU5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBsZXQgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbZWxlbWVudF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHNlbGVjdG9yID0gc29tZXRoaW5nO1xuICAgICAgdGhpcy5lbGVtZW50cyA9IHRoaXMuZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdGhhdCB0aGlzIERPTSBpbnN0YW5jZSBjdXJyZW50bHkgaG9sZHMuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHNcbiAgICovXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50cyA/IHRoaXMuZWxlbWVudHMubGVuZ3RoIDogMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBIVE1MIGVsZW1lbnRzIHRoYXQgdGhpcyBET00gaW5zdGFuY2UgY3VycmVudGx5IGhvbGRzLlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX0gdGhlIHJhdyBIVE1MIGVsZW1lbnRzXG4gICAqL1xuICBnZXRFbGVtZW50cygpOiBIVE1MRWxlbWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IG1ldGhvZCBmb3IgaXRlcmF0aW5nIGFsbCBlbGVtZW50cy4gU2hvcnRzIHRoaXMuZWxlbWVudHMuZm9yRWFjaCguLi4pIHRvIHRoaXMuZm9yRWFjaCguLi4pLlxuICAgKiBAcGFyYW0gaGFuZGxlciB0aGUgaGFuZGxlciB0byBleGVjdXRlIGFuIG9wZXJhdGlvbiBvbiBhbiBlbGVtZW50XG4gICAqL1xuICBwcml2YXRlIGZvckVhY2goaGFuZGxlcjogKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBoYW5kbGVyKGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQ2hpbGRFbGVtZW50c09mRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IERvY3VtZW50LCBzZWxlY3Rvcjogc3RyaW5nKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgbGV0IGNoaWxkRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgLy8gQ29udmVydCBOb2RlTGlzdCB0byBBcnJheVxuICAgIC8vIGh0dHBzOi8vdG9kZG1vdHRvLmNvbS9hLWNvbXByZWhlbnNpdmUtZGl2ZS1pbnRvLW5vZGVsaXN0cy1hcnJheXMtY29udmVydGluZy1ub2RlbGlzdHMtYW5kLXVuZGVyc3RhbmRpbmctdGhlLWRvbS9cbiAgICByZXR1cm4gW10uc2xpY2UuY2FsbChjaGlsZEVsZW1lbnRzKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3I6IHN0cmluZyk6IEhUTUxFbGVtZW50W10ge1xuICAgIGxldCBhbGxDaGlsZEVsZW1lbnRzID0gPEhUTUxFbGVtZW50W10+W107XG5cbiAgICBpZiAodGhpcy5lbGVtZW50cykge1xuICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGFsbENoaWxkRWxlbWVudHMgPSBhbGxDaGlsZEVsZW1lbnRzLmNvbmNhdCh0aGlzLmZpbmRDaGlsZEVsZW1lbnRzT2ZFbGVtZW50KGVsZW1lbnQsIHNlbGVjdG9yKSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kQ2hpbGRFbGVtZW50c09mRWxlbWVudChkb2N1bWVudCwgc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiBhbGxDaGlsZEVsZW1lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFsbCBjaGlsZCBlbGVtZW50cyBvZiBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIHN1cHBsaWVkIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgdGhlIHNlbGVjdG9yIHRvIG1hdGNoIHdpdGggY2hpbGQgZWxlbWVudHNcbiAgICogQHJldHVybnMge0RPTX0gYSBuZXcgRE9NIGluc3RhbmNlIHJlcHJlc2VudGluZyBhbGwgbWF0Y2hlZCBjaGlsZHJlblxuICAgKi9cbiAgZmluZChzZWxlY3Rvcjogc3RyaW5nKTogRE9NIHtcbiAgICBsZXQgYWxsQ2hpbGRFbGVtZW50cyA9IHRoaXMuZmluZENoaWxkRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIHJldHVybiBuZXcgRE9NKGFsbENoaWxkRWxlbWVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgb2YgdGhlIGlubmVyIEhUTUwgY29udGVudCBvZiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICovXG4gIGh0bWwoKTogc3RyaW5nO1xuICAvKipcbiAgICogU2V0cyB0aGUgaW5uZXIgSFRNTCBjb250ZW50IG9mIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGNvbnRlbnQgYSBzdHJpbmcgb2YgcGxhaW4gdGV4dCBvciBIVE1MIG1hcmt1cFxuICAgKi9cbiAgaHRtbChjb250ZW50OiBzdHJpbmcpOiBET007XG4gIGh0bWwoY29udGVudD86IHN0cmluZyk6IHN0cmluZyB8IERPTSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRIdG1sKGNvbnRlbnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEh0bWwoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEh0bWwoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHNbMF0uaW5uZXJIVE1MO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRIdG1sKGNvbnRlbnQ6IHN0cmluZyk6IERPTSB7XG4gICAgaWYgKGNvbnRlbnQgPT09IHVuZGVmaW5lZCB8fCBjb250ZW50ID09IG51bGwpIHtcbiAgICAgIC8vIFNldCB0byBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgaW5uZXJIVE1MIGdldHRpbmcgc2V0IHRvICd1bmRlZmluZWQnIChhbGwgYnJvd3NlcnMpIG9yICdudWxsJyAoSUU5KVxuICAgICAgY29udGVudCA9ICcnO1xuICAgIH1cblxuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBpbm5lciBIVE1MIG9mIGFsbCBlbGVtZW50cyAoZGVsZXRlcyBhbGwgY2hpbGRyZW4pLlxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgZW1wdHkoKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZmlyc3QgZm9ybSBlbGVtZW50LCBlLmcuIHRoZSBzZWxlY3RlZCB2YWx1ZSBvZiBhIHNlbGVjdCBib3ggb3IgdGhlIHRleHQgaWYgYW5cbiAgICogaW5wdXQgZmllbGQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSB2YWx1ZSBvZiBhIGZvcm0gZWxlbWVudFxuICAgKi9cbiAgdmFsKCk6IHN0cmluZyB7XG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRzWzBdO1xuXG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCB8fCBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gVE9ETyBhZGQgc3VwcG9ydCBmb3IgbWlzc2luZyBmb3JtIGVsZW1lbnRzXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHZhbCgpIG5vdCBzdXBwb3J0ZWQgZm9yICR7dHlwZW9mIGVsZW1lbnR9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZSBvbiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICogQHBhcmFtIGF0dHJpYnV0ZVxuICAgKi9cbiAgYXR0cihhdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG4gIC8qKlxuICAgKiBTZXRzIGFuIGF0dHJpYnV0ZSBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGUgdGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGVcbiAgICovXG4gIGF0dHIoYXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBET007XG4gIGF0dHIoYXR0cmlidXRlOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IERPTSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRBdHRyKGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEF0dHIoYXR0cmlidXRlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEF0dHIoYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0QXR0cihhdHRyaWJ1dGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIGRhdGEgZWxlbWVudCBvbiB0aGUgZmlyc3QgZWxlbWVudC5cbiAgICogQHBhcmFtIGRhdGFBdHRyaWJ1dGUgdGhlIG5hbWUgb2YgdGhlIGRhdGEgYXR0cmlidXRlIHdpdGhvdXQgdGhlICdkYXRhLScgcHJlZml4XG4gICAqL1xuICBkYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG4gIC8qKlxuICAgKiBTZXRzIGEgZGF0YSBhdHRyaWJ1dGUgb24gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gZGF0YUF0dHJpYnV0ZSB0aGUgbmFtZSBvZiB0aGUgZGF0YSBhdHRyaWJ1dGUgd2l0aG91dCB0aGUgJ2RhdGEtJyBwcmVmaXhcbiAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSBvZiB0aGUgZGF0YSBhdHRyaWJ1dGVcbiAgICovXG4gIGRhdGEoZGF0YUF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NO1xuICBkYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZywgdmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHwgRE9NIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldERhdGEoZGF0YUF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERhdGEoZGF0YUF0dHJpYnV0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXRhKGRhdGFBdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgZGF0YUF0dHJpYnV0ZSk7XG4gIH1cblxuICBwcml2YXRlIHNldERhdGEoZGF0YUF0dHJpYnV0ZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBkYXRhQXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBvbmUgb3IgbW9yZSBET00gZWxlbWVudHMgYXMgY2hpbGRyZW4gdG8gYWxsIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gY2hpbGRFbGVtZW50cyB0aGUgY2hyaWxkIGVsZW1lbnRzIHRvIGFwcGVuZFxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgYXBwZW5kKC4uLmNoaWxkRWxlbWVudHM6IERPTVtdKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNoaWxkRWxlbWVudHMuZm9yRWFjaCgoY2hpbGRFbGVtZW50KSA9PiB7XG4gICAgICAgIGNoaWxkRWxlbWVudC5lbGVtZW50cy5mb3JFYWNoKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtZW50LmVsZW1lbnRzW2luZGV4XSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgZWxlbWVudHMgZnJvbSB0aGUgRE9NLlxuICAgKi9cbiAgcmVtb3ZlKCk6IHZvaWQge1xuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgbGV0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgZmlyc3QgZWxlbWVudCBmcm9tIHRoZSBkb2N1bWVudCdzIHRvcCBsZWZ0IGNvcm5lci5cbiAgICogQHJldHVybnMge09mZnNldH1cbiAgICovXG4gIG9mZnNldCgpOiBPZmZzZXQge1xuICAgIGxldCBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1swXTtcbiAgICBsZXQgZWxlbWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCBodG1sUmVjdCA9IGRvY3VtZW50LmJvZHkucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIC8vIFZpcnR1YWwgdmlld3BvcnQgc2Nyb2xsIGhhbmRsaW5nIChlLmcuIHBpbmNoIHpvb21lZCB2aWV3cG9ydHMgaW4gbW9iaWxlIGJyb3dzZXJzIG9yIGRlc2t0b3AgQ2hyb21lL0VkZ2UpXG4gICAgLy8gJ25vcm1hbCcgem9vbXMgYW5kIHZpcnR1YWwgdmlld3BvcnQgem9vbXMgKGFrYSBsYXlvdXQgdmlld3BvcnQpIHJlc3VsdCBpbiBkaWZmZXJlbnRcbiAgICAvLyBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHJlc3VsdHM6XG4gICAgLy8gIC0gd2l0aCBub3JtYWwgc2Nyb2xscywgdGhlIGNsaWVudFJlY3QgZGVjcmVhc2VzIHdpdGggYW4gaW5jcmVhc2UgaW4gc2Nyb2xsKFRvcHxMZWZ0KS9wYWdlKFh8WSlPZmZzZXRcbiAgICAvLyAgLSB3aXRoIHBpbmNoIHpvb20gc2Nyb2xscywgdGhlIGNsaWVudFJlY3Qgc3RheXMgdGhlIHNhbWUgd2hpbGUgc2Nyb2xsL3BhZ2VPZmZzZXQgY2hhbmdlc1xuICAgIC8vIFRoaXMgbWVhbnMsIHRoYXQgdGhlIGNvbWJpbmF0aW9uIG9mIGNsaWVudFJlY3QgKyBzY3JvbGwvcGFnZU9mZnNldCBkb2VzIG5vdCB3b3JrIHRvIGNhbGN1bGF0ZSB0aGUgb2Zmc2V0XG4gICAgLy8gZnJvbSB0aGUgZG9jdW1lbnQncyB1cHBlciBsZWZ0IG9yaWdpbiB3aGVuIHBpbmNoIHpvb20gaXMgdXNlZC5cbiAgICAvLyBUbyB3b3JrIGFyb3VuZCB0aGlzIGlzc3VlLCB3ZSBkbyBub3QgdXNlIHNjcm9sbC9wYWdlT2Zmc2V0IGJ1dCBnZXQgdGhlIGNsaWVudFJlY3Qgb2YgdGhlIGh0bWwgZWxlbWVudCBhbmRcbiAgICAvLyBzdWJ0cmFjdCBpdCBmcm9tIHRoZSBlbGVtZW50J3MgcmVjdCwgd2hpY2ggYWx3YXlzIHJlc3VsdHMgaW4gdGhlIG9mZnNldCBmcm9tIHRoZSBkb2N1bWVudCBvcmlnaW4uXG4gICAgLy8gTk9URTogdGhlIGN1cnJlbnQgd2F5IG9mIG9mZnNldCBjYWxjdWxhdGlvbiB3YXMgaW1wbGVtZW50ZWQgc3BlY2lmaWNhbGx5IHRvIHRyYWNrIGV2ZW50IHBvc2l0aW9ucyBvbiB0aGVcbiAgICAvLyBzZWVrIGJhciwgYW5kIGl0IG1pZ2h0IGJyZWFrIGNvbXBhdGliaWxpdHkgd2l0aCBqUXVlcnkncyBvZmZzZXQoKSBtZXRob2QuIElmIHRoaXMgZXZlciB0dXJucyBvdXQgdG8gYmUgYVxuICAgIC8vIHByb2JsZW0sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSByZXZlcnRlZCB0byB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBvZmZzZXQgY2FsY3VsYXRpb24gbW92ZWQgdG8gdGhlIHNlZWsgYmFyLlxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogZWxlbWVudFJlY3QudG9wIC0gaHRtbFJlY3QudG9wLFxuICAgICAgbGVmdDogZWxlbWVudFJlY3QubGVmdCAtIGh0bWxSZWN0LmxlZnRcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBmaXJzdCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgd2lkdGggb2YgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICovXG4gIHdpZHRoKCk6IG51bWJlciB7XG4gICAgLy8gVE9ETyBjaGVjayBpZiB0aGlzIGlzIHRoZSBzYW1lIGFzIGpRdWVyeSdzIHdpZHRoKCkgKHByb2JhYmx5IG5vdClcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1swXS5vZmZzZXRXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBoZWlnaHQgb2YgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICovXG4gIGhlaWdodCgpOiBudW1iZXIge1xuICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhpcyBpcyB0aGUgc2FtZSBhcyBqUXVlcnkncyBoZWlnaHQoKSAocHJvYmFibHkgbm90KVxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzWzBdLm9mZnNldEhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhbiBldmVudCBoYW5kbGVyIHRvIG9uZSBvciBtb3JlIGV2ZW50cyBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBldmVudE5hbWUgdGhlIGV2ZW50IG5hbWUgKG9yIG11bHRpcGxlIG5hbWVzIHNlcGFyYXRlZCBieSBzcGFjZSkgdG8gbGlzdGVuIHRvXG4gICAqIEBwYXJhbSBldmVudEhhbmRsZXIgdGhlIGV2ZW50IGhhbmRsZXIgdG8gY2FsbCB3aGVuIHRoZSBldmVudCBmaXJlc1xuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgb24oZXZlbnROYW1lOiBzdHJpbmcsIGV2ZW50SGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCk6IERPTSB7XG4gICAgbGV0IGV2ZW50cyA9IGV2ZW50TmFtZS5zcGxpdCgnICcpO1xuXG4gICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5lbGVtZW50cyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZXZlbnRIYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBldmVudCBoYW5kbGVyIGZyb20gb25lIG9yIG1vcmUgZXZlbnRzIG9uIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGV2ZW50TmFtZSB0aGUgZXZlbnQgbmFtZSAob3IgbXVsdGlwbGUgbmFtZXMgc2VwYXJhdGVkIGJ5IHNwYWNlKSB0byByZW1vdmUgdGhlIGhhbmRsZXIgZnJvbVxuICAgKiBAcGFyYW0gZXZlbnRIYW5kbGVyIHRoZSBldmVudCBoYW5kbGVyIHRvIHJlbW92ZVxuICAgKiBAcmV0dXJucyB7RE9NfVxuICAgKi9cbiAgb2ZmKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3QpOiBET00ge1xuICAgIGxldCBldmVudHMgPSBldmVudE5hbWUuc3BsaXQoJyAnKTtcblxuICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudHMgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBldmVudEhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIGRpc3BhdGNoIGJyb3dzZXIgZXZlbnRzXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgZGlzcGF0Y2hFdmVudChldmVudDogRXZlbnQpOiBhbnkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRzID09IG51bGwpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBkaXNwYXRjaFNtYXNoY3V0UGxheWVyVWlFdmVudChkYXRhOiBhbnkpOiBhbnkge1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3NtYXNoY3V0cGxheWVydWknLCB7ZGV0YWlsOiBkYXRhLCBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiB0cnVlfSkpXG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgc3BlY2lmaWVkIGNsYXNzKGVzKSB0byBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBjbGFzc05hbWUgdGhlIGNsYXNzKGVzKSB0byBhZGQsIG11bHRpcGxlIGNsYXNzZXMgc2VwYXJhdGVkIGJ5IHNwYWNlXG4gICAqIEByZXR1cm5zIHtET019XG4gICAqL1xuICBhZGRDbGFzcyhjbGFzc05hbWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlZCB0aGUgc3BlY2lmaWVkIGNsYXNzKGVzKSBmcm9tIGFsbCBlbGVtZW50cy5cbiAgICogQHBhcmFtIGNsYXNzTmFtZSB0aGUgY2xhc3MoZXMpIHRvIHJlbW92ZSwgbXVsdGlwbGUgY2xhc3NlcyBzZXBhcmF0ZWQgYnkgc3BhY2VcbiAgICogQHJldHVybnMge0RPTX1cbiAgICovXG4gIHJlbW92ZUNsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIGNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbnkgb2YgdGhlIGVsZW1lbnRzIGhhcyB0aGUgc3BlY2lmaWVkIGNsYXNzLlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lIHRoZSBjbGFzcyBuYW1lIHRvIGNoZWNrXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIG9uZSBvZiB0aGUgZWxlbWVudHMgaGFzIHRoZSBjbGFzcyBhdHRhY2hlZCwgZWxzZSBpZiBubyBlbGVtZW50IGhhcyBpdCBhdHRhY2hlZFxuICAgKi9cbiAgaGFzQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBsZXQgaGFzQ2xhc3MgPSBmYWxzZTtcblxuICAgIHRoaXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICAgICAgLy8gU2luY2Ugd2UgYXJlIGluc2lkZSBhIGhhbmRsZXIsIHdlIGNhbid0IGp1c3QgJ3JldHVybiB0cnVlJy4gSW5zdGVhZCwgd2Ugc2F2ZSBpdCB0byBhIHZhcmlhYmxlXG4gICAgICAgICAgLy8gYW5kIHJldHVybiBpdCBhdCB0aGUgZW5kIG9mIHRoZSBmdW5jdGlvbiBib2R5LlxuICAgICAgICAgIGhhc0NsYXNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChuZXcgUmVnRXhwKCcoXnwgKScgKyBjbGFzc05hbWUgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGVsZW1lbnQuY2xhc3NOYW1lKSkge1xuICAgICAgICAgIC8vIFNlZSBjb21tZW50IGFib3ZlXG4gICAgICAgICAgaGFzQ2xhc3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaGFzQ2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBDU1MgcHJvcGVydHkgb2YgdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgdGhlIG5hbWUgb2YgdGhlIENTUyBwcm9wZXJ0eSB0byByZXRyaWV2ZSB0aGUgdmFsdWUgb2ZcbiAgICovXG4gIGNzcyhwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIENTUyBwcm9wZXJ0eSBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgdGhlIG5hbWUgb2YgdGhlIENTUyBwcm9wZXJ0eSB0byBzZXQgdGhlIHZhbHVlIGZvclxuICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIHNldCBmb3IgdGhlIGdpdmVuIENTUyBwcm9wZXJ0eVxuICAgKi9cbiAgY3NzKHByb3BlcnR5TmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRE9NO1xuICAvKipcbiAgICogU2V0cyBhIGNvbGxlY3Rpb24gb2YgQ1NTIHByb3BlcnRpZXMgYW5kIHRoZWlyIHZhbHVlcyBvbiBhbGwgZWxlbWVudHMuXG4gICAqIEBwYXJhbSBwcm9wZXJ0eVZhbHVlQ29sbGVjdGlvbiBhbiBvYmplY3QgY29udGFpbmluZyBwYWlycyBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgdGhlaXIgdmFsdWVzXG4gICAqL1xuICBjc3MocHJvcGVydHlWYWx1ZUNvbGxlY3Rpb246IHsgW3Byb3BlcnR5TmFtZTogc3RyaW5nXTogc3RyaW5nIH0pOiBET007XG4gIGNzcyhwcm9wZXJ0eU5hbWVPckNvbGxlY3Rpb246IHN0cmluZyB8IHsgW3Byb3BlcnR5TmFtZTogc3RyaW5nXTogc3RyaW5nIH0sIHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IERPTSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0eU5hbWVPckNvbGxlY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lT3JDb2xsZWN0aW9uO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRDc3MocHJvcGVydHlOYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3NzKHByb3BlcnR5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHByb3BlcnR5VmFsdWVDb2xsZWN0aW9uID0gcHJvcGVydHlOYW1lT3JDb2xsZWN0aW9uO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0Q3NzQ29sbGVjdGlvbihwcm9wZXJ0eVZhbHVlQ29sbGVjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRDc3MocHJvcGVydHlOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnRzWzBdKVs8YW55PnByb3BlcnR5TmFtZV07XG4gIH1cblxuICBwcml2YXRlIHNldENzcyhwcm9wZXJ0eU5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IERPTSB7XG4gICAgdGhpcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyA8YW55PiBjYXN0IHRvIHJlc29sdmUgVFM3MDE1OiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNjYyNzExNC8zNzAyNTJcbiAgICAgIGVsZW1lbnQuc3R5bGVbPGFueT5wcm9wZXJ0eU5hbWVdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIHNldENzc0NvbGxlY3Rpb24ocnVsZVZhbHVlQ29sbGVjdGlvbjogeyBbcnVsZU5hbWU6IHN0cmluZ106IHN0cmluZyB9KTogRE9NIHtcbiAgICB0aGlzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0NDkwNTczLzM3MDI1MlxuICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBydWxlVmFsdWVDb2xsZWN0aW9uKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQge0FycmF5VXRpbHN9IGZyb20gJy4vdXRpbHMnO1xuLyoqXG4gKiBGdW5jdGlvbiBpbnRlcmZhY2UgZm9yIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUge0BsaW5rIEV2ZW50RGlzcGF0Y2hlcn0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+IHtcbiAgKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzKTogdm9pZDtcbn1cblxuLyoqXG4gKiBFbXB0eSB0eXBlIGZvciBjcmVhdGluZyB7QGxpbmsgRXZlbnREaXNwYXRjaGVyIGV2ZW50IGRpc3BhdGNoZXJzfSB0aGF0IGRvIG5vdCBjYXJyeSBhbnkgYXJndW1lbnRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5vQXJncyB7XG59XG5cbi8qKlxuICogRXZlbnQgYXJncyBmb3IgYW4gZXZlbnQgdGhhdCBjYW4gYmUgY2FuY2VsZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FuY2VsRXZlbnRBcmdzIGV4dGVuZHMgTm9BcmdzIHtcbiAgLyoqXG4gICAqIEdldHMgb3Igc2V0cyBhIGZsYWcgd2hldGhlciB0aGUgZXZlbnQgc2hvdWxkIGJlIGNhbmNlbGVkLlxuICAgKi9cbiAgY2FuY2VsPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBQdWJsaWMgaW50ZXJmYWNlIHRoYXQgcmVwcmVzZW50cyBhbiBldmVudC4gQ2FuIGJlIHVzZWQgdG8gc3Vic2NyaWJlIHRvIGFuZCB1bnN1YnNjcmliZSBmcm9tIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudDxTZW5kZXIsIEFyZ3M+IHtcbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhpcyBldmVudCBkaXNwYXRjaGVyLlxuICAgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGFkZFxuICAgKi9cbiAgc3Vic2NyaWJlKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoaXMgZXZlbnQgZGlzcGF0Y2hlciB0aGF0IGlzIG9ubHkgY2FsbGVkIG9uY2UuXG4gICAqIEBwYXJhbSBsaXN0ZW5lciB0aGUgbGlzdGVuZXIgdG8gYWRkXG4gICAqL1xuICBzdWJzY3JpYmVPbmNlKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoaXMgZXZlbnQgZGlzcGF0Y2hlciB0aGF0IHdpbGwgYmUgY2FsbGVkIGF0IGEgbGltaXRlZCByYXRlIHdpdGggYSBtaW5pbXVtXG4gICAqIGludGVydmFsIG9mIHRoZSBzcGVjaWZpZWQgbWlsbGlzZWNvbmRzLlxuICAgKiBAcGFyYW0gbGlzdGVuZXIgdGhlIGxpc3RlbmVyIHRvIGFkZFxuICAgKiBAcGFyYW0gcmF0ZU1zIHRoZSByYXRlIGluIG1pbGxpc2Vjb25kcyB0byB3aGljaCBjYWxsaW5nIG9mIHRoZSBsaXN0ZW5lcnMgc2hvdWxkIGJlIGxpbWl0ZWRcbiAgICovXG4gIHN1YnNjcmliZVJhdGVMaW1pdGVkKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4sIHJhdGVNczogbnVtYmVyKTogdm9pZDtcblxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIGEgc3Vic2NyaWJlZCBldmVudCBsaXN0ZW5lciBmcm9tIHRoaXMgZGlzcGF0Y2hlci5cbiAgICogQHBhcmFtIGxpc3RlbmVyIHRoZSBsaXN0ZW5lciB0byByZW1vdmVcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGxpc3RlbmVyIHdhcyBzdWNjZXNzZnVsbHkgdW5zdWJzY3JpYmVkLCBmYWxzZSBpZiBpdCBpc24ndCBzdWJzY3JpYmVkIG9uIHRoaXNcbiAgICogICBkaXNwYXRjaGVyXG4gICAqL1xuICB1bnN1YnNjcmliZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBFdmVudCBkaXNwYXRjaGVyIHRvIHN1YnNjcmliZSBhbmQgdHJpZ2dlciBldmVudHMuIEVhY2ggZXZlbnQgc2hvdWxkIGhhdmUgaXRzIG93biBkaXNwYXRjaGVyLlxuICovXG5leHBvcnQgY2xhc3MgRXZlbnREaXNwYXRjaGVyPFNlbmRlciwgQXJncz4gaW1wbGVtZW50cyBFdmVudDxTZW5kZXIsIEFyZ3M+IHtcblxuICBwcml2YXRlIGxpc3RlbmVyczogRXZlbnRMaXN0ZW5lcldyYXBwZXI8U2VuZGVyLCBBcmdzPltdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jfVxuICAgKi9cbiAgc3Vic2NyaWJlKGxpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz4pIHtcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKG5ldyBFdmVudExpc3RlbmVyV3JhcHBlcihsaXN0ZW5lcikpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvY31cbiAgICovXG4gIHN1YnNjcmliZU9uY2UobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPikge1xuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobmV3IEV2ZW50TGlzdGVuZXJXcmFwcGVyKGxpc3RlbmVyLCB0cnVlKSk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jfVxuICAgKi9cbiAgc3Vic2NyaWJlUmF0ZUxpbWl0ZWQobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiwgcmF0ZU1zOiBudW1iZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKG5ldyBSYXRlTGltaXRlZEV2ZW50TGlzdGVuZXJXcmFwcGVyKGxpc3RlbmVyLCByYXRlTXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2N9XG4gICAqL1xuICB1bnN1YnNjcmliZShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+KTogYm9vbGVhbiB7XG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGxpc3RlbmVycywgY29tcGFyZSB3aXRoIHBhcmFtZXRlciwgYW5kIHJlbW92ZSBpZiBmb3VuZFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzdWJzY3JpYmVkTGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyc1tpXTtcbiAgICAgIGlmIChzdWJzY3JpYmVkTGlzdGVuZXIubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIEFycmF5VXRpbHMucmVtb3ZlKHRoaXMubGlzdGVuZXJzLCBzdWJzY3JpYmVkTGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIGZyb20gdGhpcyBkaXNwYXRjaGVyLlxuICAgKi9cbiAgdW5zdWJzY3JpYmVBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGFuIGV2ZW50IHRvIGFsbCBzdWJzY3JpYmVkIGxpc3RlbmVycy5cbiAgICogQHBhcmFtIHNlbmRlciB0aGUgc291cmNlIG9mIHRoZSBldmVudFxuICAgKiBAcGFyYW0gYXJncyB0aGUgYXJndW1lbnRzIGZvciB0aGUgZXZlbnRcbiAgICovXG4gIGRpc3BhdGNoKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzID0gbnVsbCkge1xuICAgIGxldCBsaXN0ZW5lcnNUb1JlbW92ZSA9IFtdO1xuXG4gICAgLy8gQ2FsbCBldmVyeSBsaXN0ZW5lclxuICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICBsaXN0ZW5lci5maXJlKHNlbmRlciwgYXJncyk7XG5cbiAgICAgIGlmIChsaXN0ZW5lci5pc09uY2UoKSkge1xuICAgICAgICBsaXN0ZW5lcnNUb1JlbW92ZS5wdXNoKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgb25lLXRpbWUgbGlzdGVuZXJcbiAgICBmb3IgKGxldCBsaXN0ZW5lclRvUmVtb3ZlIG9mIGxpc3RlbmVyc1RvUmVtb3ZlKSB7XG4gICAgICBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmxpc3RlbmVycywgbGlzdGVuZXJUb1JlbW92ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGV2ZW50IHRoYXQgdGhpcyBkaXNwYXRjaGVyIG1hbmFnZXMgYW5kIG9uIHdoaWNoIGxpc3RlbmVycyBjYW4gc3Vic2NyaWJlIGFuZCB1bnN1YnNjcmliZSBldmVudCBoYW5kbGVycy5cbiAgICogQHJldHVybnMge0V2ZW50fVxuICAgKi9cbiAgZ2V0RXZlbnQoKTogRXZlbnQ8U2VuZGVyLCBBcmdzPiB7XG4gICAgLy8gRm9yIG5vdywganVzdCBjYXN0IHRoZSBldmVudCBkaXNwYXRjaGVyIHRvIHRoZSBldmVudCBpbnRlcmZhY2UuIEF0IHNvbWUgcG9pbnQgaW4gdGhlIGZ1dHVyZSB3aGVuIHRoZVxuICAgIC8vIGNvZGViYXNlIGdyb3dzLCBpdCBtaWdodCBtYWtlIHNlbnNlIHRvIHNwbGl0IHRoZSBkaXNwYXRjaGVyIGludG8gc2VwYXJhdGUgZGlzcGF0Y2hlciBhbmQgZXZlbnQgY2xhc3Nlcy5cbiAgICByZXR1cm4gPEV2ZW50PFNlbmRlciwgQXJncz4+dGhpcztcbiAgfVxufVxuXG4vKipcbiAqIEEgYmFzaWMgZXZlbnQgbGlzdGVuZXIgd3JhcHBlciB0byBtYW5hZ2UgbGlzdGVuZXJzIHdpdGhpbiB0aGUge0BsaW5rIEV2ZW50RGlzcGF0Y2hlcn0uIFRoaXMgaXMgYSAncHJpdmF0ZScgY2xhc3NcbiAqIGZvciBpbnRlcm5hbCBkaXNwYXRjaGVyIHVzZSBhbmQgaXQgaXMgdGhlcmVmb3JlIG5vdCBleHBvcnRlZC5cbiAqL1xuY2xhc3MgRXZlbnRMaXN0ZW5lcldyYXBwZXI8U2VuZGVyLCBBcmdzPiB7XG5cbiAgcHJpdmF0ZSBldmVudExpc3RlbmVyOiBFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz47XG4gIHByaXZhdGUgb25jZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+LCBvbmNlOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICB0aGlzLm9uY2UgPSBvbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdyYXBwZWQgZXZlbnQgbGlzdGVuZXIuXG4gICAqIEByZXR1cm5zIHtFdmVudExpc3RlbmVyPFNlbmRlciwgQXJncz59XG4gICAqL1xuICBnZXQgbGlzdGVuZXIoKTogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudExpc3RlbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSB3cmFwcGVkIGV2ZW50IGxpc3RlbmVyIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cy5cbiAgICogQHBhcmFtIHNlbmRlclxuICAgKiBAcGFyYW0gYXJnc1xuICAgKi9cbiAgZmlyZShzZW5kZXI6IFNlbmRlciwgYXJnczogQXJncykge1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcihzZW5kZXIsIGFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGlzIGxpc3RlbmVyIGlzIHNjaGVkdWxlZCB0byBiZSBjYWxsZWQgb25seSBvbmNlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gb25jZSBpZiB0cnVlXG4gICAqL1xuICBpc09uY2UoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub25jZTtcbiAgfVxufVxuXG4vKipcbiAqIEV4dGVuZHMgdGhlIGJhc2ljIHtAbGluayBFdmVudExpc3RlbmVyV3JhcHBlcn0gd2l0aCByYXRlLWxpbWl0aW5nIGZ1bmN0aW9uYWxpdHkuXG4gKi9cbmNsYXNzIFJhdGVMaW1pdGVkRXZlbnRMaXN0ZW5lcldyYXBwZXI8U2VuZGVyLCBBcmdzPiBleHRlbmRzIEV2ZW50TGlzdGVuZXJXcmFwcGVyPFNlbmRlciwgQXJncz4ge1xuXG4gIHByaXZhdGUgcmF0ZU1zOiBudW1iZXI7XG4gIHByaXZhdGUgcmF0ZUxpbWl0aW5nRXZlbnRMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjxTZW5kZXIsIEFyZ3M+O1xuXG4gIHByaXZhdGUgbGFzdEZpcmVUaW1lOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXI8U2VuZGVyLCBBcmdzPiwgcmF0ZU1zOiBudW1iZXIpIHtcbiAgICBzdXBlcihsaXN0ZW5lcik7IC8vIHNldHMgdGhlIGV2ZW50IGxpc3RlbmVyIHNpbmtcblxuICAgIHRoaXMucmF0ZU1zID0gcmF0ZU1zO1xuICAgIHRoaXMubGFzdEZpcmVUaW1lID0gMDtcblxuICAgIC8vIFdyYXAgdGhlIGV2ZW50IGxpc3RlbmVyIHdpdGggYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCBkb2VzIHRoZSByYXRlLWxpbWl0aW5nXG4gICAgdGhpcy5yYXRlTGltaXRpbmdFdmVudExpc3RlbmVyID0gKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzKSA9PiB7XG4gICAgICBpZiAoRGF0ZS5ub3coKSAtIHRoaXMubGFzdEZpcmVUaW1lID4gdGhpcy5yYXRlTXMpIHtcbiAgICAgICAgLy8gT25seSBpZiBlbm91Z2ggdGltZSBzaW5jZSB0aGUgcHJldmlvdXMgY2FsbCBoYXMgcGFzc2VkLCBjYWxsIHRoZVxuICAgICAgICAvLyBhY3R1YWwgZXZlbnQgbGlzdGVuZXIgYW5kIHJlY29yZCB0aGUgY3VycmVudCB0aW1lXG4gICAgICAgIHRoaXMuZmlyZVN1cGVyKHNlbmRlciwgYXJncyk7XG4gICAgICAgIHRoaXMubGFzdEZpcmVUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBmaXJlU3VwZXIoc2VuZGVyOiBTZW5kZXIsIGFyZ3M6IEFyZ3MpIHtcbiAgICAvLyBGaXJlIHRoZSBhY3R1YWwgZXh0ZXJuYWwgZXZlbnQgbGlzdGVuZXJcbiAgICBzdXBlci5maXJlKHNlbmRlciwgYXJncyk7XG4gIH1cblxuICBmaXJlKHNlbmRlcjogU2VuZGVyLCBhcmdzOiBBcmdzKSB7XG4gICAgLy8gRmlyZSB0aGUgaW50ZXJuYWwgcmF0ZS1saW1pdGluZyBsaXN0ZW5lciBpbnN0ZWFkIG9mIHRoZSBleHRlcm5hbCBldmVudCBsaXN0ZW5lclxuICAgIHRoaXMucmF0ZUxpbWl0aW5nRXZlbnRMaXN0ZW5lcihzZW5kZXIsIGFyZ3MpO1xuICB9XG59IiwiZXhwb3J0IG5hbWVzcGFjZSBHdWlkIHtcblxuICBsZXQgZ3VpZCA9IDE7XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgcmV0dXJuIGd1aWQrKztcbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD0ncGxheWVyLmQudHMnIC8+XG5pbXBvcnQge1VJTWFuYWdlciwgVUlJbnN0YW5jZU1hbmFnZXJ9IGZyb20gJy4vdWltYW5hZ2VyJztcbmltcG9ydCB7QnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvYnV0dG9uJztcbmltcG9ydCB7Q29udHJvbEJhcn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRyb2xiYXInO1xuaW1wb3J0IHtGdWxsc2NyZWVuVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvZnVsbHNjcmVlbnRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0h1Z2VQbGF5YmFja1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2h1Z2VwbGF5YmFja3RvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1BsYXliYWNrVGltZUxhYmVsLCBQbGF5YmFja1RpbWVMYWJlbE1vZGV9IGZyb20gJy4vY29tcG9uZW50cy9wbGF5YmFja3RpbWVsYWJlbCc7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvcGxheWJhY2t0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtTZWVrQmFyfSBmcm9tICcuL2NvbXBvbmVudHMvc2Vla2Jhcic7XG5pbXBvcnQge1NlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3NlbGVjdGJveCc7XG5pbXBvcnQge1NldHRpbmdzUGFuZWwsIFNldHRpbmdzUGFuZWxJdGVtfSBmcm9tICcuL2NvbXBvbmVudHMvc2V0dGluZ3NwYW5lbCc7XG5pbXBvcnQge1NldHRpbmdzVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvc2V0dGluZ3N0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtWaWRlb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy92aWRlb3F1YWxpdHlzZWxlY3Rib3gnO1xuaW1wb3J0IHtWb2x1bWVUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy92b2x1bWV0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtWUlRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZydG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7V2F0ZXJtYXJrfSBmcm9tICcuL2NvbXBvbmVudHMvd2F0ZXJtYXJrJztcbmltcG9ydCB7VUlDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy91aWNvbnRhaW5lcic7XG5pbXBvcnQge0NvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2NvbnRhaW5lcic7XG5pbXBvcnQge0xhYmVsfSBmcm9tICcuL2NvbXBvbmVudHMvbGFiZWwnO1xuaW1wb3J0IHtBdWRpb1F1YWxpdHlTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9hdWRpb3F1YWxpdHlzZWxlY3Rib3gnO1xuaW1wb3J0IHtBdWRpb1RyYWNrU2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvYXVkaW90cmFja3NlbGVjdGJveCc7XG5pbXBvcnQge0Nhc3RTdGF0dXNPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHN0YXR1c292ZXJsYXknO1xuaW1wb3J0IHtDYXN0VG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbXBvbmVudCc7XG5pbXBvcnQge0Vycm9yTWVzc2FnZU92ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvcm1lc3NhZ2VvdmVybGF5JztcbmltcG9ydCB7UmVjb21tZW5kYXRpb25PdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvcmVjb21tZW5kYXRpb25vdmVybGF5JztcbmltcG9ydCB7U2Vla0JhckxhYmVsfSBmcm9tICcuL2NvbXBvbmVudHMvc2Vla2JhcmxhYmVsJztcbmltcG9ydCB7U3VidGl0bGVPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvc3VidGl0bGVvdmVybGF5JztcbmltcG9ydCB7U3VidGl0bGVTZWxlY3RCb3h9IGZyb20gJy4vY29tcG9uZW50cy9zdWJ0aXRsZXNlbGVjdGJveCc7XG5pbXBvcnQge1RpdGxlQmFyfSBmcm9tICcuL2NvbXBvbmVudHMvdGl0bGViYXInO1xuaW1wb3J0IHtWb2x1bWVDb250cm9sQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1lY29udHJvbGJ1dHRvbic7XG5pbXBvcnQge0NsaWNrT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2NsaWNrb3ZlcmxheSc7XG5pbXBvcnQge0FkU2tpcEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Fkc2tpcGJ1dHRvbic7XG5pbXBvcnQge0FkTWVzc2FnZUxhYmVsfSBmcm9tICcuL2NvbXBvbmVudHMvYWRtZXNzYWdlbGFiZWwnO1xuaW1wb3J0IHtBZENsaWNrT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL2FkY2xpY2tvdmVybGF5JztcbmltcG9ydCB7UGxheWJhY2tTcGVlZFNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrc3BlZWRzZWxlY3Rib3gnO1xuaW1wb3J0IHtIdWdlUmVwbGF5QnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvaHVnZXJlcGxheWJ1dHRvbic7XG5pbXBvcnQge0J1ZmZlcmluZ092ZXJsYXl9IGZyb20gJy4vY29tcG9uZW50cy9idWZmZXJpbmdvdmVybGF5JztcbmltcG9ydCB7Q2FzdFVJQ29udGFpbmVyfSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHVpY29udGFpbmVyJztcbmltcG9ydCB7UGxheWJhY2tUb2dnbGVPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvcGxheWJhY2t0b2dnbGVvdmVybGF5JztcbmltcG9ydCB7Q2xvc2VCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9jbG9zZWJ1dHRvbic7XG5pbXBvcnQge01ldGFkYXRhTGFiZWwsIE1ldGFkYXRhTGFiZWxDb250ZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbWV0YWRhdGFsYWJlbCc7XG5pbXBvcnQge0FpclBsYXlUb2dnbGVCdXR0b259IGZyb20gJy4vY29tcG9uZW50cy9haXJwbGF5dG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7Vm9sdW1lU2xpZGVyfSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1lc2xpZGVyJztcbmltcG9ydCB7UGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3BpY3R1cmVpbnBpY3R1cmV0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtTcGFjZXJ9IGZyb20gJy4vY29tcG9uZW50cy9zcGFjZXInO1xuaW1wb3J0IHtBcnJheVV0aWxzLCBTdHJpbmdVdGlscywgUGxheWVyVXRpbHMsIFVJVXRpbHMsIEJyb3dzZXJVdGlsc30gZnJvbSAnLi91dGlscyc7XG5cbi8vIE9iamVjdC5hc3NpZ24gcG9seWZpbGwgZm9yIEVTNS9JRTlcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RlL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykge1xuICBPYmplY3QuYXNzaWduID0gZnVuY3Rpb24odGFyZ2V0OiBhbnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcbiAgICB9XG5cbiAgICB0YXJnZXQgPSBPYmplY3QodGFyZ2V0KTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgbGV0IHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICBpZiAoc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xufVxuXG4vLyBFeHBvc2UgY2xhc3NlcyB0byB3aW5kb3dcbih3aW5kb3cgYXMgYW55KS5iaXRtb3Zpbi5wbGF5ZXJ1aSA9IHtcbiAgLy8gTWFuYWdlbWVudFxuICBVSU1hbmFnZXIsXG4gIFVJSW5zdGFuY2VNYW5hZ2VyLFxuICAvLyBVdGlsc1xuICBBcnJheVV0aWxzLFxuICBTdHJpbmdVdGlscyxcbiAgUGxheWVyVXRpbHMsXG4gIFVJVXRpbHMsXG4gIEJyb3dzZXJVdGlscyxcbiAgLy8gQ29tcG9uZW50c1xuICBBZENsaWNrT3ZlcmxheSxcbiAgQWRNZXNzYWdlTGFiZWwsXG4gIEFkU2tpcEJ1dHRvbixcbiAgQWlyUGxheVRvZ2dsZUJ1dHRvbixcbiAgQXVkaW9RdWFsaXR5U2VsZWN0Qm94LFxuICBBdWRpb1RyYWNrU2VsZWN0Qm94LFxuICBCdWZmZXJpbmdPdmVybGF5LFxuICBCdXR0b24sXG4gIENhc3RTdGF0dXNPdmVybGF5LFxuICBDYXN0VG9nZ2xlQnV0dG9uLFxuICBDYXN0VUlDb250YWluZXIsXG4gIENsaWNrT3ZlcmxheSxcbiAgQ2xvc2VCdXR0b24sXG4gIENvbXBvbmVudCxcbiAgQ29udGFpbmVyLFxuICBDb250cm9sQmFyLFxuICBFcnJvck1lc3NhZ2VPdmVybGF5LFxuICBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uLFxuICBIdWdlUGxheWJhY2tUb2dnbGVCdXR0b24sXG4gIEh1Z2VSZXBsYXlCdXR0b24sXG4gIExhYmVsLFxuICBNZXRhZGF0YUxhYmVsLFxuICBNZXRhZGF0YUxhYmVsQ29udGVudCxcbiAgUGljdHVyZUluUGljdHVyZVRvZ2dsZUJ1dHRvbixcbiAgUGxheWJhY2tTcGVlZFNlbGVjdEJveCxcbiAgUGxheWJhY2tUaW1lTGFiZWwsXG4gIFBsYXliYWNrVGltZUxhYmVsTW9kZSxcbiAgUGxheWJhY2tUb2dnbGVCdXR0b24sXG4gIFBsYXliYWNrVG9nZ2xlT3ZlcmxheSxcbiAgUmVjb21tZW5kYXRpb25PdmVybGF5LFxuICBTZWVrQmFyLFxuICBTZWVrQmFyTGFiZWwsXG4gIFNlbGVjdEJveCxcbiAgU2V0dGluZ3NQYW5lbCxcbiAgU2V0dGluZ3NQYW5lbEl0ZW0sXG4gIFNldHRpbmdzVG9nZ2xlQnV0dG9uLFxuICBTcGFjZXIsXG4gIFN1YnRpdGxlT3ZlcmxheSxcbiAgU3VidGl0bGVTZWxlY3RCb3gsXG4gIFRpdGxlQmFyLFxuICBUb2dnbGVCdXR0b24sXG4gIFVJQ29udGFpbmVyLFxuICBWaWRlb1F1YWxpdHlTZWxlY3RCb3gsXG4gIFZvbHVtZUNvbnRyb2xCdXR0b24sXG4gIFZvbHVtZVNsaWRlcixcbiAgVm9sdW1lVG9nZ2xlQnV0dG9uLFxuICBWUlRvZ2dsZUJ1dHRvbixcbiAgV2F0ZXJtYXJrLFxufTsiLCIvLyBUT0RPIGNoYW5nZSB0byBpbnRlcm5hbCAobm90IGV4cG9ydGVkKSBjbGFzcywgaG93IHRvIHVzZSBpbiBvdGhlciBmaWxlcz9cbi8qKlxuICogRXhlY3V0ZXMgYSBjYWxsYmFjayBhZnRlciBhIHNwZWNpZmllZCBhbW91bnQgb2YgdGltZSxcbiAqIG9wdGlvbmFsbHkgcmVwZWF0ZWRseSB1bnRpbCBzdG9wcGVkLiBXaGVuIGRlbGF5IGlzIDw9IDBcbiAqIHRoZSB0aW1lb3V0IGlzIGRpc2FibGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW1lb3V0IHtcblxuICBwcml2YXRlIGRlbGF5OiBudW1iZXI7XG4gIHByaXZhdGUgY2FsbGJhY2s6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgcmVwZWF0OiBib29sZWFuO1xuICBwcml2YXRlIHRpbWVvdXRIYW5kbGU6IG51bWJlcjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyB0aW1lb3V0IGNhbGxiYWNrIGhhbmRsZXIuXG4gICAqIEBwYXJhbSBkZWxheSB0aGUgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSBjYWxsYmFjayBzaG91bGQgYmUgZXhlY3V0ZWRcbiAgICogQHBhcmFtIGNhbGxiYWNrIHRoZSBjYWxsYmFjayB0byBleGVjdXRlIGFmdGVyIHRoZSBkZWxheSB0aW1lXG4gICAqIEBwYXJhbSByZXBlYXQgaWYgdHJ1ZSwgY2FsbCB0aGUgY2FsbGJhY2sgcmVwZWF0ZWRseSBpbiBkZWxheSBpbnRlcnZhbHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlbGF5OiBudW1iZXIsIGNhbGxiYWNrOiAoKSA9PiB2b2lkLCByZXBlYXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG4gICAgdGhpcy50aW1lb3V0SGFuZGxlID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIHRpbWVvdXQgYW5kIGNhbGxzIHRoZSBjYWxsYmFjayB3aGVuIHRoZSB0aW1lb3V0IGRlbGF5IGhhcyBwYXNzZWQuXG4gICAqIEByZXR1cm5zIHtUaW1lb3V0fSB0aGUgY3VycmVudCB0aW1lb3V0IChzbyB0aGUgc3RhcnQgY2FsbCBjYW4gYmUgY2hhaW5lZCB0byB0aGUgY29uc3RydWN0b3IpXG4gICAqL1xuICBzdGFydCgpOiB0aGlzIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSB0aW1lb3V0LiBUaGUgY2FsbGJhY2sgd2lsbCBub3QgYmUgY2FsbGVkIGlmIGNsZWFyIGlzIGNhbGxlZCBkdXJpbmcgdGhlIHRpbWVvdXQuXG4gICAqL1xuICBjbGVhcigpOiB2b2lkIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SGFuZGxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIHBhc3NlZCB0aW1lb3V0IGRlbGF5IHRvIHplcm8uIENhbiBiZSB1c2VkIHRvIGRlZmVyIHRoZSBjYWxsaW5nIG9mIHRoZSBjYWxsYmFjay5cbiAgICovXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIGxldCBsYXN0U2NoZWR1bGVUaW1lID0gMDtcbiAgICBsZXQgZGVsYXlBZGp1c3QgPSAwO1xuXG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgbGV0IGludGVybmFsQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzLmNhbGxiYWNrKCk7XG5cbiAgICAgIGlmICh0aGlzLnJlcGVhdCkge1xuICAgICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAvLyBUaGUgdGltZSBvZiBvbmUgaXRlcmF0aW9uIGZyb20gc2NoZWR1bGluZyB0byBleGVjdXRpbmcgdGhlIGNhbGxiYWNrICh1c3VhbGx5IGEgYml0IGxvbmdlciB0aGFuIHRoZSBkZWxheVxuICAgICAgICAvLyB0aW1lKVxuICAgICAgICBsZXQgZGVsdGEgPSBub3cgLSBsYXN0U2NoZWR1bGVUaW1lO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGVsYXkgYWRqdXN0bWVudCBmb3IgdGhlIG5leHQgc2NoZWR1bGUgdG8ga2VlcCBhIHN0ZWFkeSBkZWxheSBpbnRlcnZhbCBvdmVyIHRpbWVcbiAgICAgICAgZGVsYXlBZGp1c3QgPSB0aGlzLmRlbGF5IC0gZGVsdGEgKyBkZWxheUFkanVzdDtcblxuICAgICAgICBsYXN0U2NoZWR1bGVUaW1lID0gbm93O1xuXG4gICAgICAgIC8vIFNjaGVkdWxlIG5leHQgZXhlY3V0aW9uIGJ5IHRoZSBhZGp1c3RlZCBkZWxheVxuICAgICAgICB0aGlzLnRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGludGVybmFsQ2FsbGJhY2ssIHRoaXMuZGVsYXkgKyBkZWxheUFkanVzdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxhc3RTY2hlZHVsZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGlmICh0aGlzLmRlbGF5ID4gMCkge1xuICAgICAgdGhpcy50aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChpbnRlcm5hbENhbGxiYWNrLCB0aGlzLmRlbGF5KTtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQge1VJQ29udGFpbmVyfSBmcm9tICcuL2NvbXBvbmVudHMvdWljb250YWluZXInO1xuaW1wb3J0IHtET019IGZyb20gJy4vZG9tJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50cy9jb21wb25lbnQnO1xuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXInO1xuaW1wb3J0IHtQbGF5YmFja1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7RnVsbHNjcmVlblRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bGxzY3JlZW50b2dnbGVidXR0b24nO1xuaW1wb3J0IHtWUlRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZydG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7Vm9sdW1lVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvdm9sdW1ldG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U2Vla0Jhcn0gZnJvbSAnLi9jb21wb25lbnRzL3NlZWtiYXInO1xuaW1wb3J0IHtQbGF5YmFja1RpbWVMYWJlbCwgUGxheWJhY2tUaW1lTGFiZWxNb2RlfSBmcm9tICcuL2NvbXBvbmVudHMvcGxheWJhY2t0aW1lbGFiZWwnO1xuaW1wb3J0IHtDb250cm9sQmFyfSBmcm9tICcuL2NvbXBvbmVudHMvY29udHJvbGJhcic7XG5pbXBvcnQge05vQXJncywgRXZlbnREaXNwYXRjaGVyLCBDYW5jZWxFdmVudEFyZ3N9IGZyb20gJy4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCB7RW1iZWRWaWRlb1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2VtYmVkdmlkZW90b2dnbGVidXR0b24nO1xuaW1wb3J0IHtFbWJlZFZpZGVvUGFuZWx9IGZyb20gJy4vY29tcG9uZW50cy9lbWJlZHZpZGVvcGFuZWwnO1xuaW1wb3J0IHtTZXR0aW5nc1RvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3NldHRpbmdzdG9nZ2xlYnV0dG9uJztcbmltcG9ydCB7U2V0dGluZ3NQYW5lbCwgU2V0dGluZ3NQYW5lbEl0ZW19IGZyb20gJy4vY29tcG9uZW50cy9zZXR0aW5nc3BhbmVsJztcbmltcG9ydCB7VmlkZW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvdmlkZW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7V2F0ZXJtYXJrfSBmcm9tICcuL2NvbXBvbmVudHMvd2F0ZXJtYXJrJztcbmltcG9ydCB7QXVkaW9RdWFsaXR5U2VsZWN0Qm94fSBmcm9tICcuL2NvbXBvbmVudHMvYXVkaW9xdWFsaXR5c2VsZWN0Ym94JztcbmltcG9ydCB7QXVkaW9UcmFja1NlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL2F1ZGlvdHJhY2tzZWxlY3Rib3gnO1xuaW1wb3J0IHtTZWVrQmFyTGFiZWx9IGZyb20gJy4vY29tcG9uZW50cy9zZWVrYmFybGFiZWwnO1xuaW1wb3J0IHtWb2x1bWVTbGlkZXJ9IGZyb20gJy4vY29tcG9uZW50cy92b2x1bWVzbGlkZXInO1xuaW1wb3J0IHtTdWJ0aXRsZVNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3N1YnRpdGxlc2VsZWN0Ym94JztcbmltcG9ydCB7U3VidGl0bGVPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvc3VidGl0bGVvdmVybGF5JztcbmltcG9ydCB7Vm9sdW1lQ29udHJvbEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL3ZvbHVtZWNvbnRyb2xidXR0b24nO1xuaW1wb3J0IHtDYXN0VG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge0Nhc3RTdGF0dXNPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvY2FzdHN0YXR1c292ZXJsYXknO1xuaW1wb3J0IHtFcnJvck1lc3NhZ2VPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JtZXNzYWdlb3ZlcmxheSc7XG5pbXBvcnQge1RpdGxlQmFyfSBmcm9tICcuL2NvbXBvbmVudHMvdGl0bGViYXInO1xuaW1wb3J0IFBsYXllckFQSSA9IGJpdG1vdmluLlBsYXllckFQSTtcbmltcG9ydCB7UmVjb21tZW5kYXRpb25PdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvcmVjb21tZW5kYXRpb25vdmVybGF5JztcbmltcG9ydCB7QWRNZXNzYWdlTGFiZWx9IGZyb20gJy4vY29tcG9uZW50cy9hZG1lc3NhZ2VsYWJlbCc7XG5pbXBvcnQge0FkU2tpcEJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2Fkc2tpcGJ1dHRvbic7XG5pbXBvcnQge0FkQ2xpY2tPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvYWRjbGlja292ZXJsYXknO1xuaW1wb3J0IEVWRU5UID0gYml0bW92aW4uUGxheWVyQVBJLkVWRU5UO1xuaW1wb3J0IFBsYXllckV2ZW50Q2FsbGJhY2sgPSBiaXRtb3Zpbi5QbGF5ZXJBUEkuUGxheWVyRXZlbnRDYWxsYmFjaztcbmltcG9ydCBBZFN0YXJ0ZWRFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5BZFN0YXJ0ZWRFdmVudDtcbmltcG9ydCB7QXJyYXlVdGlscywgVUlVdGlscywgQnJvd3NlclV0aWxzfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7UGxheWJhY2tTcGVlZFNlbGVjdEJveH0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrc3BlZWRzZWxlY3Rib3gnO1xuaW1wb3J0IHtCdWZmZXJpbmdPdmVybGF5fSBmcm9tICcuL2NvbXBvbmVudHMvYnVmZmVyaW5nb3ZlcmxheSc7XG5pbXBvcnQge0Nhc3RVSUNvbnRhaW5lcn0gZnJvbSAnLi9jb21wb25lbnRzL2Nhc3R1aWNvbnRhaW5lcic7XG5pbXBvcnQge1BsYXliYWNrVG9nZ2xlT3ZlcmxheX0gZnJvbSAnLi9jb21wb25lbnRzL3BsYXliYWNrdG9nZ2xlb3ZlcmxheSc7XG5pbXBvcnQge0Nsb3NlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2xvc2VidXR0b24nO1xuaW1wb3J0IHtNZXRhZGF0YUxhYmVsLCBNZXRhZGF0YUxhYmVsQ29udGVudH0gZnJvbSAnLi9jb21wb25lbnRzL21ldGFkYXRhbGFiZWwnO1xuaW1wb3J0IHtMYWJlbH0gZnJvbSAnLi9jb21wb25lbnRzL2xhYmVsJztcbmltcG9ydCBQbGF5ZXJFdmVudCA9IGJpdG1vdmluLlBsYXllckFQSS5QbGF5ZXJFdmVudDtcbmltcG9ydCB7QWlyUGxheVRvZ2dsZUJ1dHRvbn0gZnJvbSAnLi9jb21wb25lbnRzL2FpcnBsYXl0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtQaWN0dXJlSW5QaWN0dXJlVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvcGljdHVyZWlucGljdHVyZXRvZ2dsZWJ1dHRvbic7XG5pbXBvcnQge1NwYWNlcn0gZnJvbSAnLi9jb21wb25lbnRzL3NwYWNlcic7XG5pbXBvcnQge0NvbW1lbnRzVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY29tbWVudHN0b2dnbGVidXR0b24nO1xuaW1wb3J0IHtDbG9zZWRDYXB0aW9uaW5nVG9nZ2xlQnV0dG9ufSBmcm9tICcuL2NvbXBvbmVudHMvY2xvc2VkY2FwdGlvbmluZ3RvZ2dsZWJ1dHRvbic7XG5cblxuZXhwb3J0IGludGVyZmFjZSBVSVJlY29tbWVuZGF0aW9uQ29uZmlnIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgdXJsOiBzdHJpbmc7XG4gIHRodW1ibmFpbD86IHN0cmluZztcbiAgZHVyYXRpb24/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVUlFbWJlZFZpZGVvQ29uZmlnIHtcbiAgZGVmYXVsdDogc3RyaW5nO1xuICB3aXRoQ29tbWVudHM/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZWxpbmVNYXJrZXIge1xuICB0aW1lOiBudW1iZXI7XG4gIHRpbWVQZXJjZW50YWdlPzogbnVtYmVyXG4gIHRpdGxlPzogc3RyaW5nO1xuICBtYXJrZXJUeXBlPzogc3RyaW5nO1xuICBjb21tZW50Pzogc3RyaW5nO1xuICBhdmF0YXI/OiBzdHJpbmc7XG4gIG51bWJlcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVSUNvbmZpZyB7XG4gIG1ldGFkYXRhPzoge1xuICAgIHRpdGxlPzogc3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICAgIG1hcmtlcnM/OiBUaW1lbGluZU1hcmtlcltdO1xuICAgIGVtYmVkVmlkZW8/OiBVSUVtYmVkVmlkZW9Db25maWc7XG4gIH07XG4gIHJlY29tbWVuZGF0aW9ucz86IFVJUmVjb21tZW5kYXRpb25Db25maWdbXTtcbn1cblxuLyoqXG4gKiBUaGUgY29udGV4dCB0aGF0IHdpbGwgYmUgcGFzc2VkIHRvIGEge0BsaW5rIFVJQ29uZGl0aW9uUmVzb2x2ZXJ9IHRvIGRldGVybWluZSBpZiBpdCdzIGNvbmRpdGlvbnMgZnVsZmlsIHRoZSBjb250ZXh0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVJQ29uZGl0aW9uQ29udGV4dCB7XG4gIGlzQWQ6IGJvb2xlYW47XG4gIGlzQWRXaXRoVUk6IGJvb2xlYW47XG4gIGlzRnVsbHNjcmVlbjogYm9vbGVhbjtcbiAgaXNNb2JpbGU6IGJvb2xlYW47XG4gIGRvY3VtZW50V2lkdGg6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyB0aGUgY29uZGl0aW9ucyBvZiBpdHMgYXNzb2NpYXRlZCBVSSBpbiBhIHtAbGluayBVSVZhcmlhbnR9IHVwb24gYSB7QGxpbmsgVUlDb25kaXRpb25Db250ZXh0fSBhbmQgZGVjaWRlc1xuICogaWYgdGhlIFVJIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIGl0IHJldHVybnMgdHJ1ZSwgdGhlIFVJIGlzIGEgY2FuZGlkYXRlIGZvciBkaXNwbGF5OyBpZiBpdCByZXR1cm5zIGZhbHNlLCBpdCB3aWxsXG4gKiBub3QgYmUgZGlzcGxheWVkIGluIHRoZSBnaXZlbiBjb250ZXh0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVJQ29uZGl0aW9uUmVzb2x2ZXIge1xuICAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBc3NvY2lhdGVzIGEgVUkgaW5zdGFuY2Ugd2l0aCBhbiBvcHRpb25hbCB7QGxpbmsgVUlDb25kaXRpb25SZXNvbHZlcn0gdGhhdCBkZXRlcm1pbmVzIGlmIHRoZSBVSSBzaG91bGQgYmUgZGlzcGxheWVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVJVmFyaWFudCB7XG4gIHVpOiBVSUNvbnRhaW5lcjtcbiAgY29uZGl0aW9uPzogVUlDb25kaXRpb25SZXNvbHZlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFVJTWFuYWdlciB7XG5cbiAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllckFQSTtcbiAgcHJpdmF0ZSBwbGF5ZXJFbGVtZW50OiBET007XG4gIHByaXZhdGUgdWlWYXJpYW50czogVUlWYXJpYW50W107XG4gIHByaXZhdGUgdWlJbnN0YW5jZU1hbmFnZXJzOiBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyW107XG4gIHByaXZhdGUgY3VycmVudFVpOiBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyO1xuICBwcml2YXRlIGNvbmZpZzogVUlDb25maWc7XG4gIHByaXZhdGUgbWFuYWdlclBsYXllcldyYXBwZXI6IFBsYXllcldyYXBwZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBVSSBtYW5hZ2VyIHdpdGggYSBzaW5nbGUgVUkgdmFyaWFudCB0aGF0IHdpbGwgYmUgcGVybWFuZW50bHkgc2hvd24uXG4gICAqIEBwYXJhbSBwbGF5ZXIgdGhlIGFzc29jaWF0ZWQgcGxheWVyIG9mIHRoaXMgVUlcbiAgICogQHBhcmFtIHVpIHRoZSBVSSB0byBhZGQgdG8gdGhlIHBsYXllclxuICAgKiBAcGFyYW0gY29uZmlnIG9wdGlvbmFsIFVJIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBsYXllcjogUGxheWVyQVBJLCB1aTogVUlDb250YWluZXIsIGNvbmZpZz86IFVJQ29uZmlnKTtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBVSSBtYW5hZ2VyIHdpdGggYSBsaXN0IG9mIFVJIHZhcmlhbnRzIHRoYXQgd2lsbCBiZSBkeW5hbWljYWxseSBzZWxlY3RlZCBhbmQgc3dpdGNoZWQgYWNjb3JkaW5nIHRvXG4gICAqIHRoZSBjb250ZXh0IG9mIHRoZSBVSS5cbiAgICpcbiAgICogRXZlcnkgdGltZSB0aGUgVUkgY29udGV4dCBjaGFuZ2VzLCB0aGUgY29uZGl0aW9ucyBvZiB0aGUgVUkgdmFyaWFudHMgd2lsbCBiZSBzZXF1ZW50aWFsbHkgcmVzb2x2ZWQgYW5kIHRoZSBmaXJzdFxuICAgKiBVSSwgd2hvc2UgY29uZGl0aW9uIGV2YWx1YXRlcyB0byB0cnVlLCB3aWxsIGJlIHNlbGVjdGVkIGFuZCBkaXNwbGF5ZWQuIFRoZSBsYXN0IHZhcmlhbnQgaW4gdGhlIGxpc3QgbWlnaHQgb21pdCB0aGVcbiAgICogY29uZGl0aW9uIHJlc29sdmVyIGFuZCB3aWxsIGJlIHNlbGVjdGVkIGFzIGRlZmF1bHQvZmFsbGJhY2sgVUkgd2hlbiBhbGwgb3RoZXIgY29uZGl0aW9ucyBmYWlsLiBJZiB0aGVyZSBpcyBub1xuICAgKiBmYWxsYmFjayBVSSBhbmQgYWxsIGNvbmRpdGlvbnMgZmFpbCwgbm8gVUkgd2lsbCBiZSBkaXNwbGF5ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBwbGF5ZXIgdGhlIGFzc29jaWF0ZWQgcGxheWVyIG9mIHRoaXMgVUlcbiAgICogQHBhcmFtIHVpVmFyaWFudHMgYSBsaXN0IG9mIFVJIHZhcmlhbnRzIHRoYXQgd2lsbCBiZSBkeW5hbWljYWxseSBzd2l0Y2hlZFxuICAgKiBAcGFyYW0gY29uZmlnIG9wdGlvbmFsIFVJIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBsYXllcjogUGxheWVyQVBJLCB1aVZhcmlhbnRzOiBVSVZhcmlhbnRbXSwgY29uZmlnPzogVUlDb25maWcpO1xuICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSwgcGxheWVyVWlPclVpVmFyaWFudHM6IFVJQ29udGFpbmVyIHwgVUlWYXJpYW50W10sIGNvbmZpZzogVUlDb25maWcgPSB7fSkge1xuICAgIGlmIChwbGF5ZXJVaU9yVWlWYXJpYW50cyBpbnN0YW5jZW9mIFVJQ29udGFpbmVyKSB7XG4gICAgICAvLyBTaW5nbGUtVUkgY29uc3RydWN0b3IgaGFzIGJlZW4gY2FsbGVkLCB0cmFuc2Zvcm0gYXJndW1lbnRzIHRvIFVJVmFyaWFudFtdIHNpZ25hdHVyZVxuICAgICAgbGV0IHBsYXllclVpID0gPFVJQ29udGFpbmVyPnBsYXllclVpT3JVaVZhcmlhbnRzO1xuICAgICAgbGV0IGFkc1VpID0gbnVsbDtcblxuICAgICAgbGV0IHVpVmFyaWFudHMgPSBbXTtcblxuICAgICAgLy8gQWRkIHRoZSBhZHMgVUkgaWYgZGVmaW5lZFxuICAgICAgaWYgKGFkc1VpKSB7XG4gICAgICAgIHVpVmFyaWFudHMucHVzaCh7XG4gICAgICAgICAgdWk6IGFkc1VpLFxuICAgICAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuaXNBZFdpdGhVSTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoZSBkZWZhdWx0IHBsYXllciBVSVxuICAgICAgdWlWYXJpYW50cy5wdXNoKHt1aTogcGxheWVyVWl9KTtcblxuICAgICAgdGhpcy51aVZhcmlhbnRzID0gdWlWYXJpYW50cztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBEZWZhdWx0IGNvbnN0cnVjdG9yIChVSVZhcmlhbnRbXSkgaGFzIGJlZW4gY2FsbGVkXG4gICAgICB0aGlzLnVpVmFyaWFudHMgPSA8VUlWYXJpYW50W10+cGxheWVyVWlPclVpVmFyaWFudHM7XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlciA9IG5ldyBQbGF5ZXJXcmFwcGVyKHBsYXllcik7XG4gICAgdGhpcy5wbGF5ZXJFbGVtZW50ID0gbmV3IERPTShwbGF5ZXIuZ2V0RmlndXJlKCkpO1xuXG4gICAgLy8gQ3JlYXRlIFVJIGluc3RhbmNlIG1hbmFnZXJzIGZvciB0aGUgVUkgdmFyaWFudHNcbiAgICAvLyBUaGUgaW5zdGFuY2UgbWFuYWdlcnMgbWFwIHRvIHRoZSBjb3JyZXNwb25kaW5nIFVJIHZhcmlhbnRzIGJ5IHRoZWlyIGFycmF5IGluZGV4XG4gICAgdGhpcy51aUluc3RhbmNlTWFuYWdlcnMgPSBbXTtcbiAgICBsZXQgdWlWYXJpYW50c1dpdGhvdXRDb25kaXRpb24gPSBbXTtcbiAgICBmb3IgKGxldCB1aVZhcmlhbnQgb2YgdGhpcy51aVZhcmlhbnRzKSB7XG4gICAgICBpZiAodWlWYXJpYW50LmNvbmRpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgIC8vIENvbGxlY3QgdmFyaWFudHMgd2l0aG91dCBjb25kaXRpb25zIGZvciBlcnJvciBjaGVja2luZ1xuICAgICAgICB1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvbi5wdXNoKHVpVmFyaWFudCk7XG4gICAgICB9XG4gICAgICAvLyBDcmVhdGUgdGhlIGluc3RhbmNlIG1hbmFnZXIgZm9yIGEgVUkgdmFyaWFudFxuICAgICAgdGhpcy51aUluc3RhbmNlTWFuYWdlcnMucHVzaChuZXcgSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlcihwbGF5ZXIsIHVpVmFyaWFudC51aSwgdGhpcy5jb25maWcpKTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlcmUgaXMgb25seSBvbmUgVUkgdmFyaWFudCB3aXRob3V0IGEgY29uZGl0aW9uXG4gICAgLy8gSXQgZG9lcyBub3QgbWFrZSBzZW5zZSB0byBoYXZlIG11bHRpcGxlIHZhcmlhbnRzIHdpdGhvdXQgY29uZGl0aW9uLCBiZWNhdXNlIG9ubHkgdGhlIGZpcnN0IG9uZSBpbiB0aGUgbGlzdFxuICAgIC8vICh0aGUgb25lIHdpdGggdGhlIGxvd2VzdCBpbmRleCkgd2lsbCBldmVyIGJlIHNlbGVjdGVkLlxuICAgIGlmICh1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBFcnJvcignVG9vIG1hbnkgVUlzIHdpdGhvdXQgYSBjb25kaXRpb246IFlvdSBjYW5ub3QgaGF2ZSBtb3JlIHRoYW4gb25lIGRlZmF1bHQgVUknKTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIGRlZmF1bHQgVUkgdmFyaWFudCwgaWYgZGVmaW5lZCwgaXMgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdCAobGFzdCBpbmRleClcbiAgICAvLyBJZiBpdCBjb21lcyBlYXJsaWVyLCB0aGUgdmFyaWFudHMgd2l0aCBjb25kaXRpb25zIHRoYXQgY29tZSBhZnRlcndhcmRzIHdpbGwgbmV2ZXIgYmUgc2VsZWN0ZWQgYmVjYXVzZSB0aGVcbiAgICAvLyBkZWZhdWx0IHZhcmlhbnQgd2l0aG91dCBhIGNvbmRpdGlvbiBhbHdheXMgZXZhbHVhdGVzIHRvICd0cnVlJ1xuICAgIGlmICh1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvbi5sZW5ndGggPiAwXG4gICAgICAmJiB1aVZhcmlhbnRzV2l0aG91dENvbmRpdGlvblswXSAhPT0gdGhpcy51aVZhcmlhbnRzW3RoaXMudWlWYXJpYW50cy5sZW5ndGggLSAxXSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgVUkgdmFyaWFudCBvcmRlcjogdGhlIGRlZmF1bHQgVUkgKHdpdGhvdXQgY29uZGl0aW9uKSBtdXN0IGJlIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QnKTtcbiAgICB9XG5cbiAgICBsZXQgYWRTdGFydGVkRXZlbnQ6IEFkU3RhcnRlZEV2ZW50ID0gbnVsbDsgLy8ga2VlcCB0aGUgZXZlbnQgc3RvcmVkIGhlcmUgZHVyaW5nIGFkIHBsYXliYWNrXG4gICAgbGV0IGlzTW9iaWxlID0gQnJvd3NlclV0aWxzLmlzTW9iaWxlO1xuXG4gICAgLy8gRHluYW1pY2FsbHkgc2VsZWN0IGEgVUkgdmFyaWFudCB0aGF0IG1hdGNoZXMgdGhlIGN1cnJlbnQgVUkgY29uZGl0aW9uLlxuICAgIGxldCByZXNvbHZlVWlWYXJpYW50ID0gKGV2ZW50OiBQbGF5ZXJFdmVudCkgPT4ge1xuICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIE9OX0FEX1NUQVJURUQgZXZlbnQgZGF0YSBpcyBwZXJzaXN0ZWQgdGhyb3VnaCBhZCBwbGF5YmFjayBpbiBjYXNlIG90aGVyIGV2ZW50cyBoYXBwZW5cbiAgICAgIC8vIGluIHRoZSBtZWFudGltZSwgZS5nLiBwbGF5ZXIgcmVzaXplLiBXZSBuZWVkIHRvIHN0b3JlIHRoaXMgZGF0YSBiZWNhdXNlIHRoZXJlIGlzIG5vIG90aGVyIHdheSB0byBmaW5kIG91dFxuICAgICAgLy8gYWQgZGV0YWlscyAoZS5nLiB0aGUgYWQgY2xpZW50KSB3aGlsZSBhbiBhZCBpcyBwbGF5aW5nLlxuICAgICAgLy8gRXhpc3RpbmcgZXZlbnQgZGF0YSBzaWduYWxzIHRoYXQgYW4gYWQgaXMgY3VycmVudGx5IGFjdGl2ZS4gV2UgY2Fubm90IHVzZSBwbGF5ZXIuaXNBZCgpIGJlY2F1c2UgaXQgcmV0dXJuc1xuICAgICAgLy8gdHJ1ZSBvbiBhZCBzdGFydCBhbmQgYWxzbyBvbiBhZCBlbmQgZXZlbnRzLCB3aGljaCBpcyBwcm9ibGVtYXRpYy5cbiAgICAgIGlmIChldmVudCAhPSBudWxsKSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgIC8vIFdoZW4gdGhlIGFkIHN0YXJ0cywgd2Ugc3RvcmUgdGhlIGV2ZW50IGRhdGFcbiAgICAgICAgICBjYXNlIHBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVEOlxuICAgICAgICAgICAgYWRTdGFydGVkRXZlbnQgPSA8QWRTdGFydGVkRXZlbnQ+ZXZlbnQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAvLyBXaGVuIHRoZSBhZCBlbmRzLCB3ZSBkZWxldGUgdGhlIGV2ZW50IGRhdGFcbiAgICAgICAgICBjYXNlIHBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRDpcbiAgICAgICAgICBjYXNlIHBsYXllci5FVkVOVC5PTl9BRF9TS0lQUEVEOlxuICAgICAgICAgIGNhc2UgcGxheWVyLkVWRU5ULk9OX0FEX0VSUk9SOlxuICAgICAgICAgICAgYWRTdGFydGVkRXZlbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERldGVjdCBpZiBhbiBhZCBoYXMgc3RhcnRlZFxuICAgICAgbGV0IGFkID0gYWRTdGFydGVkRXZlbnQgIT0gbnVsbDtcbiAgICAgIGxldCBhZFdpdGhVSSA9IGFkICYmIGFkU3RhcnRlZEV2ZW50LmNsaWVudFR5cGUgPT09ICd2YXN0JztcblxuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBjdXJyZW50IGNvbnRleHQgZm9yIHdoaWNoIHRoZSBVSSB2YXJpYW50IHdpbGwgYmUgcmVzb2x2ZWRcbiAgICAgIGxldCBjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQgPSB7XG4gICAgICAgIGlzQWQ6IGFkLFxuICAgICAgICBpc0FkV2l0aFVJOiBhZFdpdGhVSSxcbiAgICAgICAgaXNGdWxsc2NyZWVuOiB0aGlzLnBsYXllci5pc0Z1bGxzY3JlZW4oKSxcbiAgICAgICAgaXNNb2JpbGU6IGlzTW9iaWxlLFxuICAgICAgICB3aWR0aDogdGhpcy5wbGF5ZXJFbGVtZW50LndpZHRoKCksXG4gICAgICAgIGRvY3VtZW50V2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsXG4gICAgICB9O1xuXG4gICAgICBsZXQgbmV4dFVpOiBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyID0gbnVsbDtcbiAgICAgIGxldCB1aVZhcmlhbnRDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgIC8vIFNlbGVjdCBuZXcgVUkgdmFyaWFudFxuICAgICAgLy8gSWYgbm8gdmFyaWFudCBjb25kaXRpb24gaXMgZnVsZmlsbGVkLCB3ZSBzd2l0Y2ggdG8gKm5vKiBVSVxuICAgICAgZm9yIChsZXQgdWlWYXJpYW50IG9mIHRoaXMudWlWYXJpYW50cykge1xuICAgICAgICBpZiAodWlWYXJpYW50LmNvbmRpdGlvbiA9PSBudWxsIHx8IHVpVmFyaWFudC5jb25kaXRpb24oY29udGV4dCkgPT09IHRydWUpIHtcbiAgICAgICAgICBuZXh0VWkgPSB0aGlzLnVpSW5zdGFuY2VNYW5hZ2Vyc1t0aGlzLnVpVmFyaWFudHMuaW5kZXhPZih1aVZhcmlhbnQpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIFVJIHZhcmlhbnQgaXMgY2hhbmdpbmdcbiAgICAgIGlmIChuZXh0VWkgIT09IHRoaXMuY3VycmVudFVpKSB7XG4gICAgICAgIHVpVmFyaWFudENoYW5nZWQgPSB0cnVlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3dpdGNoZWQgZnJvbSAnLCB0aGlzLmN1cnJlbnRVaSA/IHRoaXMuY3VycmVudFVpLmdldFVJKCkgOiAnbm9uZScsXG4gICAgICAgIC8vICAgJyB0byAnLCBuZXh0VWkgPyBuZXh0VWkuZ2V0VUkoKSA6ICdub25lJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE9ubHkgaWYgdGhlIFVJIHZhcmlhbnQgaXMgY2hhbmdpbmcsIHdlIG5lZWQgdG8gZG8gc29tZSBzdHVmZi4gRWxzZSB3ZSBqdXN0IGxlYXZlIGV2ZXJ5dGhpbmcgYXMtaXMuXG4gICAgICBpZiAodWlWYXJpYW50Q2hhbmdlZCkge1xuICAgICAgICAvLyBIaWRlIHRoZSBjdXJyZW50bHkgYWN0aXZlIFVJIHZhcmlhbnRcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFVpKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50VWkuZ2V0VUkoKS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBc3NpZ24gdGhlIG5ldyBVSSB2YXJpYW50IGFzIGN1cnJlbnQgVUlcbiAgICAgICAgdGhpcy5jdXJyZW50VWkgPSBuZXh0VWk7XG5cbiAgICAgICAgLy8gV2hlbiB3ZSBzd2l0Y2ggdG8gYSBkaWZmZXJlbnQgVUkgaW5zdGFuY2UsIHRoZXJlJ3Mgc29tZSBhZGRpdGlvbmFsIHN0dWZmIHRvIG1hbmFnZS4gSWYgd2UgZG8gbm90IHN3aXRjaFxuICAgICAgICAvLyB0byBhbiBpbnN0YW5jZSwgd2UncmUgZG9uZSBoZXJlLlxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VWkgIT0gbnVsbCkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgVUkgdG8gdGhlIERPTSAoYW5kIGNvbmZpZ3VyZSBpdCkgdGhlIGZpcnN0IHRpbWUgaXQgaXMgc2VsZWN0ZWRcbiAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudFVpLmlzQ29uZmlndXJlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFVpKHRoaXMuY3VycmVudFVpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIGFkIFVJLCB3ZSBuZWVkIHRvIHJlbGF5IHRoZSBzYXZlZCBPTl9BRF9TVEFSVEVEIGV2ZW50IGRhdGEgc28gYWQgY29tcG9uZW50cyBjYW4gY29uZmlndXJlXG4gICAgICAgICAgLy8gdGhlbXNlbHZlcyBmb3IgdGhlIGN1cnJlbnQgYWQuXG4gICAgICAgICAgaWYgKGNvbnRleHQuaXNBZCkge1xuICAgICAgICAgICAgLyogUmVsYXkgdGhlIE9OX0FEX1NUQVJURUQgZXZlbnQgdG8gdGhlIGFkcyBVSVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEJlY2F1c2UgdGhlIGFkcyBVSSBpcyBpbml0aWFsaXplZCBpbiB0aGUgT05fQURfU1RBUlRFRCBoYW5kbGVyLCBpLmUuIHdoZW4gdGhlIE9OX0FEX1NUQVJURUQgZXZlbnQgaGFzXG4gICAgICAgICAgICAgKiBhbHJlYWR5IGJlZW4gZmlyZWQsIGNvbXBvbmVudHMgaW4gdGhlIGFkcyBVSSB0aGF0IGxpc3RlbiBmb3IgdGhlIE9OX0FEX1NUQVJURUQgZXZlbnQgbmV2ZXIgcmVjZWl2ZSBpdC5cbiAgICAgICAgICAgICAqIFNpbmNlIHRoaXMgY2FuIGJyZWFrIGZ1bmN0aW9uYWxpdHkgb2YgY29tcG9uZW50cyB0aGF0IHJlbHkgb24gdGhpcyBldmVudCwgd2UgcmVsYXkgdGhlIGV2ZW50IHRvIHRoZVxuICAgICAgICAgICAgICogYWRzIFVJIGNvbXBvbmVudHMgd2l0aCB0aGUgZm9sbG93aW5nIGNhbGwuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFVpLmdldFdyYXBwZWRQbGF5ZXIoKS5maXJlRXZlbnRJblVJKHRoaXMucGxheWVyLkVWRU5ULk9OX0FEX1NUQVJURUQsIGFkU3RhcnRlZEV2ZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmN1cnJlbnRVaS5nZXRVSSgpLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBMaXN0ZW4gdG8gdGhlIGZvbGxvd2luZyBldmVudHMgdG8gdHJpZ2dlciBVSSB2YXJpYW50IHJlc29sdXRpb25cbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9BRF9TVEFSVEVELCByZXNvbHZlVWlWYXJpYW50KTtcbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmdldFBsYXllcigpLmFkZEV2ZW50SGFuZGxlcih0aGlzLnBsYXllci5FVkVOVC5PTl9BRF9GSU5JU0hFRCwgcmVzb2x2ZVVpVmFyaWFudCk7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fQURfU0tJUFBFRCwgcmVzb2x2ZVVpVmFyaWFudCk7XG4gICAgdGhpcy5tYW5hZ2VyUGxheWVyV3JhcHBlci5nZXRQbGF5ZXIoKS5hZGRFdmVudEhhbmRsZXIodGhpcy5wbGF5ZXIuRVZFTlQuT05fQURfRVJST1IsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX1BMQVlFUl9SRVNJWkUsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRU5URVIsIHJlc29sdmVVaVZhcmlhbnQpO1xuICAgIHRoaXMubWFuYWdlclBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCkuYWRkRXZlbnRIYW5kbGVyKHRoaXMucGxheWVyLkVWRU5ULk9OX0ZVTExTQ1JFRU5fRVhJVCwgcmVzb2x2ZVVpVmFyaWFudCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBVSVxuICAgIHJlc29sdmVVaVZhcmlhbnQobnVsbCk7XG4gIH1cblxuICBnZXRDb25maWcoKTogVUlDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxuXG4gIHByaXZhdGUgYWRkVWkodWk6IEludGVybmFsVUlJbnN0YW5jZU1hbmFnZXIpOiB2b2lkIHtcbiAgICBsZXQgdWlEb20gPSB1aS5nZXRVSSgpLmdldERvbUVsZW1lbnQoKTtcbiAgICB1aS5jb25maWd1cmVDb250cm9scygpO1xuXG4gICAgLyogQXBwZW5kIHRoZSBVSSBET00gYWZ0ZXIgY29uZmlndXJhdGlvbiB0byBhdm9pZCBDU1MgdHJhbnNpdGlvbnMgYXQgaW5pdGlhbGl6YXRpb25cbiAgICAgKiBFeGFtcGxlOiBDb21wb25lbnRzIGFyZSBoaWRkZW4gZHVyaW5nIGNvbmZpZ3VyYXRpb24gYW5kIHRoZXNlIGhpZGVzIG1heSB0cmlnZ2VyIENTUyB0cmFuc2l0aW9ucyB0aGF0IGFyZVxuICAgICAqIHVuZGVzaXJhYmxlIGF0IHRoaXMgdGltZS4gKi9cblxuICAgIC8qIEFwcGVuZCB1aSB0byBwYXJlbnQgaW5zdGVhZCBvZiBwbGF5ZXIgKi9cbiAgICBsZXQgcGFyZW50RWxlbWVudCA9IG5ldyBET00odGhpcy5wbGF5ZXJFbGVtZW50LmdldEVsZW1lbnRzKClbMF0ucGFyZW50RWxlbWVudCk7XG4gICAgcGFyZW50RWxlbWVudC5hZGRDbGFzcygnc21hc2hjdXQtY3VzdG9tLXVpLWJpdG1vdmluLXBsYXllci1ob2xkZXInKTtcbiAgICBwYXJlbnRFbGVtZW50LmFwcGVuZCh1aURvbSk7XG5cbiAgICAvLyBGaXJlIG9uQ29uZmlndXJlZCBhZnRlciBVSSBET00gZWxlbWVudHMgYXJlIHN1Y2Nlc3NmdWxseSBhZGRlZC4gV2hlbiBmaXJlZCBpbW1lZGlhdGVseSwgdGhlIERPTSBlbGVtZW50c1xuICAgIC8vIG1pZ2h0IG5vdCBiZSBmdWxseSBjb25maWd1cmVkIGFuZCBlLmcuIGRvIG5vdCBoYXZlIGEgc2l6ZS5cbiAgICAvLyBodHRwczovL3N3aXplYy5jb20vYmxvZy9ob3ctdG8tcHJvcGVybHktd2FpdC1mb3ItZG9tLWVsZW1lbnRzLXRvLXNob3ctdXAtaW4tbW9kZXJuLWJyb3dzZXJzL3N3aXplYy82NjYzXG4gICAgaWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHVpLm9uQ29uZmlndXJlZC5kaXNwYXRjaCh1aS5nZXRVSSgpKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJRTkgZmFsbGJhY2tcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB1aS5vbkNvbmZpZ3VyZWQuZGlzcGF0Y2godWkuZ2V0VUkoKSk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbGVhc2VVaSh1aTogSW50ZXJuYWxVSUluc3RhbmNlTWFuYWdlcik6IHZvaWQge1xuICAgIHVpLnJlbGVhc2VDb250cm9scygpO1xuICAgIHVpLmdldFVJKCkuZ2V0RG9tRWxlbWVudCgpLnJlbW92ZSgpO1xuICAgIHVpLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuICB9XG5cbiAgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBmb3IgKGxldCB1aUluc3RhbmNlTWFuYWdlciBvZiB0aGlzLnVpSW5zdGFuY2VNYW5hZ2Vycykge1xuICAgICAgdGhpcy5yZWxlYXNlVWkodWlJbnN0YW5jZU1hbmFnZXIpO1xuICAgIH1cbiAgICB0aGlzLm1hbmFnZXJQbGF5ZXJXcmFwcGVyLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgVUlNYW5hZ2VyLkZhY3Rvcnkge1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZERlZmF1bHRVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5VSShwbGF5ZXIsIGNvbmZpZyk7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gYnVpbGREZWZhdWx0U21hbGxTY3JlZW5VSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5TbWFsbFNjcmVlblVJKHBsYXllciwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZERlZmF1bHRDYXN0UmVjZWl2ZXJVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gVUlNYW5hZ2VyLkZhY3RvcnkuYnVpbGRNb2Rlcm5DYXN0UmVjZWl2ZXJVSShwbGF5ZXIsIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBzbWFzaGN1dFVpKCkge1xuXG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3BlZWQnLCBuZXcgUGxheWJhY2tTcGVlZFNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IGVtYmVkVmlkZW9QYW5lbCA9IG5ldyBFbWJlZFZpZGVvUGFuZWwoe1xuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhclRvcCA9IG5ldyBDb250YWluZXIoe1xuICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLXRvcCddLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoe3RpbWVMYWJlbE1vZGU6IFBsYXliYWNrVGltZUxhYmVsTW9kZS5DdXJyZW50VGltZSwgaGlkZUluTGl2ZVBsYXliYWNrOiB0cnVlfSksXG4gICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIGxldCBzZWVrQmFyID0gbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KTtcblxuICAgIGxldCBjb250cm9sQmFyTWlkZGxlID0gbmV3IENvbnRhaW5lcih7XG4gICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItbWlkZGxlJ10sXG4gICAgICBjb21wb25lbnRzOiBbc2Vla0Jhcl1cbiAgICB9KTtcblxuICAgIGxldCBjb250cm9sQmFyQm90dG9tID0gbmV3IENvbnRhaW5lcih7XG4gICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItYm90dG9tJ10sXG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTcGFjZXIoKSxcbiAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBDb21tZW50c1RvZ2dsZUJ1dHRvbih7c2Vla0Jhcjogc2Vla0Jhcn0pLFxuICAgICAgICBuZXcgQ2xvc2VkQ2FwdGlvbmluZ1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgbmV3IEVtYmVkVmlkZW9Ub2dnbGVCdXR0b24oe2VtYmVkVmlkZW9QYW5lbDogZW1iZWRWaWRlb1BhbmVsfSksXG4gICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKCksXG4gICAgICBdXG4gICAgfSk7XG5cblxuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLWlubmVyJ10sXG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgc2V0dGluZ3NQYW5lbCxcbiAgICAgICAgICAgIGVtYmVkVmlkZW9QYW5lbCxcbiAgICAgICAgICAgIGNvbnRyb2xCYXJUb3AsXG4gICAgICAgICAgICBjb250cm9sQmFyTWlkZGxlLFxuICAgICAgICAgICAgY29udHJvbEJhckJvdHRvbSxcbiAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGhpZGVEZWxheTogNTAwMCxcbiAgICAgIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4gdWktc2tpbi1zbWFzaGN1dCddLFxuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKCksXG4gICAgICAgIG5ldyBSZWNvbW1lbmRhdGlvbk92ZXJsYXkoKSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuVUkoKSB7XG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3BlZWQnLCBuZXcgUGxheWJhY2tTcGVlZFNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIHNldHRpbmdzUGFuZWwsXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRUaW1lLCBoaWRlSW5MaXZlUGxheWJhY2s6IHRydWV9KSxcbiAgICAgICAgICAgIG5ldyBTZWVrQmFyKHtsYWJlbDogbmV3IFNlZWtCYXJMYWJlbCgpfSksXG4gICAgICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoe3RpbWVMYWJlbE1vZGU6IFBsYXliYWNrVGltZUxhYmVsTW9kZS5Ub3RhbFRpbWUsIGNzc0NsYXNzZXM6IFsndGV4dC1yaWdodCddfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItdG9wJ11cbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgbmV3IFZvbHVtZVRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgbmV3IFZvbHVtZVNsaWRlcigpLFxuICAgICAgICAgICAgbmV3IFNwYWNlcigpLFxuICAgICAgICAgICAgbmV3IFBpY3R1cmVJblBpY3R1cmVUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgIG5ldyBBaXJQbGF5VG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgQ2FzdFRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgbmV3IFZSVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgICAgIG5ldyBGdWxsc2NyZWVuVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgXSxcbiAgICAgICAgICBjc3NDbGFzc2VzOiBbJ2NvbnRyb2xiYXItYm90dG9tJ11cbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFN1YnRpdGxlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQnVmZmVyaW5nT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBDYXN0U3RhdHVzT3ZlcmxheSgpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoKSxcbiAgICAgICAgbmV3IFJlY29tbWVuZGF0aW9uT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuQWRzVUkoKSB7XG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBBZENsaWNrT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBBZE1lc3NhZ2VMYWJlbCh7dGV4dDogJ0FkOiB7cmVtYWluaW5nVGltZX0gc2Vjcyd9KSxcbiAgICAgICAgICAgIG5ldyBBZFNraXBCdXR0b24oKVxuICAgICAgICAgIF0sXG4gICAgICAgICAgY3NzQ2xhc3M6ICd1aS1hZHMtc3RhdHVzJ1xuICAgICAgICB9KSxcbiAgICAgICAgbmV3IENvbnRyb2xCYXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICAgICAgbmV3IFZvbHVtZVRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgICAgIG5ldyBWb2x1bWVTbGlkZXIoKSxcbiAgICAgICAgICAgICAgICBuZXcgU3BhY2VyKCksXG4gICAgICAgICAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgY3NzQ2xhc3NlczogWydjb250cm9sYmFyLWJvdHRvbSddXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbW9kZXJuJywgJ3VpLXNraW4tYWRzJ11cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vZGVyblNtYWxsU2NyZWVuVUkoKSB7XG4gICAgbGV0IHNldHRpbmdzUGFuZWwgPSBuZXcgU2V0dGluZ3NQYW5lbCh7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnVmlkZW8gUXVhbGl0eScsIG5ldyBWaWRlb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3BlZWQnLCBuZXcgUGxheWJhY2tTcGVlZFNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGhpZGVEZWxheTogLTEsXG4gICAgfSk7XG4gICAgc2V0dGluZ3NQYW5lbC5hZGRDb21wb25lbnQobmV3IENsb3NlQnV0dG9uKHt0YXJnZXQ6IHNldHRpbmdzUGFuZWx9KSk7XG5cbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IENvbnRhaW5lcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKHt0aW1lTGFiZWxNb2RlOiBQbGF5YmFja1RpbWVMYWJlbE1vZGUuQ3VycmVudFRpbWUsIGhpZGVJbkxpdmVQbGF5YmFjazogdHJ1ZX0pLFxuICAgICAgICAgICAgbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KSxcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci10b3AnXVxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBCdWZmZXJpbmdPdmVybGF5KCksXG4gICAgICAgIG5ldyBDYXN0U3RhdHVzT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIGNvbnRyb2xCYXIsXG4gICAgICAgIG5ldyBUaXRsZUJhcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IE1ldGFkYXRhTGFiZWwoe2NvbnRlbnQ6IE1ldGFkYXRhTGFiZWxDb250ZW50LlRpdGxlfSksXG4gICAgICAgICAgICBuZXcgQ2FzdFRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgICAgLypuZXcgVlJUb2dnbGVCdXR0b24oKSwqL1xuICAgICAgICAgICAgbmV3IFNldHRpbmdzVG9nZ2xlQnV0dG9uKHtzZXR0aW5nc1BhbmVsOiBzZXR0aW5nc1BhbmVsfSksXG4gICAgICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICAgIF1cbiAgICAgICAgfSksXG4gICAgICAgIHNldHRpbmdzUGFuZWwsXG4gICAgICAgIG5ldyBSZWNvbW1lbmRhdGlvbk92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFdhdGVybWFyaygpLFxuICAgICAgICBuZXcgRXJyb3JNZXNzYWdlT3ZlcmxheSgpXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbW9kZXJuJywgJ3VpLXNraW4tc21hbGxzY3JlZW4nXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuU21hbGxTY3JlZW5BZHNVSSgpIHtcbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IEJ1ZmZlcmluZ092ZXJsYXkoKSxcbiAgICAgICAgbmV3IEFkQ2xpY2tPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFRpdGxlQmFyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICAvLyBkdW1teSBsYWJlbCB3aXRoIG5vIGNvbnRlbnQgdG8gbW92ZSBidXR0b25zIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgbmV3IExhYmVsKHtjc3NDbGFzczogJ2xhYmVsLW1ldGFkYXRhLXRpdGxlJ30pLFxuICAgICAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKSxcbiAgICAgICAgICBdXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgQ29udGFpbmVyKHtcbiAgICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgICBuZXcgQWRNZXNzYWdlTGFiZWwoe3RleHQ6ICdBZDoge3JlbWFpbmluZ1RpbWV9IHNlY3MnfSksXG4gICAgICAgICAgICBuZXcgQWRTa2lwQnV0dG9uKClcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzOiAndWktYWRzLXN0YXR1cydcbiAgICAgICAgfSksXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbW9kZXJuJywgJ3VpLXNraW4tYWRzJywgJ3VpLXNraW4tc21hbGxzY3JlZW4nXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kZXJuQ2FzdFJlY2VpdmVyVUkoKSB7XG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBDb250YWluZXIoe1xuICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLkN1cnJlbnRUaW1lLCBoaWRlSW5MaXZlUGxheWJhY2s6IHRydWV9KSxcbiAgICAgICAgICAgIG5ldyBTZWVrQmFyKHtzbW9vdGhQbGF5YmFja1Bvc2l0aW9uVXBkYXRlSW50ZXJ2YWxNczogLTF9KSxcbiAgICAgICAgICAgIG5ldyBQbGF5YmFja1RpbWVMYWJlbCh7dGltZUxhYmVsTW9kZTogUGxheWJhY2tUaW1lTGFiZWxNb2RlLlRvdGFsVGltZSwgY3NzQ2xhc3NlczogWyd0ZXh0LXJpZ2h0J119KSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGNzc0NsYXNzZXM6IFsnY29udHJvbGJhci10b3AnXVxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgQ2FzdFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFN1YnRpdGxlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQnVmZmVyaW5nT3ZlcmxheSgpLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBXYXRlcm1hcmsoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKHtrZWVwSGlkZGVuV2l0aG91dE1ldGFkYXRhOiB0cnVlfSksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1tb2Rlcm4nLCAndWktc2tpbi1jYXN0LXJlY2VpdmVyJ11cbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZE1vZGVyblVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIC8vIHNob3cgc21hbGxTY3JlZW4gVUkgb25seSBvbiBtb2JpbGUvaGFuZGhlbGQgZGV2aWNlc1xuICAgIGxldCBzbWFsbFNjcmVlblN3aXRjaFdpZHRoID0gNjAwO1xuXG4gICAgcmV0dXJuIG5ldyBVSU1hbmFnZXIocGxheWVyLCBbe1xuICAgICAgdWk6IG1vZGVyblNtYWxsU2NyZWVuQWRzVUkoKSxcbiAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5pc01vYmlsZSAmJiBjb250ZXh0LmRvY3VtZW50V2lkdGggPCBzbWFsbFNjcmVlblN3aXRjaFdpZHRoICYmIGNvbnRleHQuaXNBZFdpdGhVSTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB1aTogbW9kZXJuQWRzVUkoKSxcbiAgICAgIGNvbmRpdGlvbjogKGNvbnRleHQ6IFVJQ29uZGl0aW9uQ29udGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5pc0FkV2l0aFVJO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHVpOiBtb2Rlcm5TbWFsbFNjcmVlblVJKCksXG4gICAgICBjb25kaXRpb246IChjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQuaXNNb2JpbGUgJiYgY29udGV4dC5kb2N1bWVudFdpZHRoIDwgc21hbGxTY3JlZW5Td2l0Y2hXaWR0aDtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB1aTogc21hc2hjdXRVaSgpXG4gICAgfV0sIGNvbmZpZyk7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gYnVpbGRNb2Rlcm5TbWFsbFNjcmVlblVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgW3tcbiAgICAgIHVpOiBtb2Rlcm5TbWFsbFNjcmVlbkFkc1VJKCksXG4gICAgICBjb25kaXRpb246IChjb250ZXh0OiBVSUNvbmRpdGlvbkNvbnRleHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQuaXNBZFdpdGhVSTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICB1aTogbW9kZXJuU21hbGxTY3JlZW5VSSgpXG4gICAgfV0sIGNvbmZpZyk7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gYnVpbGRNb2Rlcm5DYXN0UmVjZWl2ZXJVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gbmV3IFVJTWFuYWdlcihwbGF5ZXIsIG1vZGVybkNhc3RSZWNlaXZlclVJKCksIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBsZWdhY3lVSSgpIHtcbiAgICBsZXQgc2V0dGluZ3NQYW5lbCA9IG5ldyBTZXR0aW5nc1BhbmVsKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdWaWRlbyBRdWFsaXR5JywgbmV3IFZpZGVvUXVhbGl0eVNlbGVjdEJveCgpKSxcbiAgICAgICAgbmV3IFNldHRpbmdzUGFuZWxJdGVtKCdBdWRpbyBUcmFjaycsIG5ldyBBdWRpb1RyYWNrU2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFF1YWxpdHknLCBuZXcgQXVkaW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1N1YnRpdGxlcycsIG5ldyBTdWJ0aXRsZVNlbGVjdEJveCgpKVxuICAgICAgXSxcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgbGV0IGNvbnRyb2xCYXIgPSBuZXcgQ29udHJvbEJhcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIHNldHRpbmdzUGFuZWwsXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgU2Vla0Jhcih7bGFiZWw6IG5ldyBTZWVrQmFyTGFiZWwoKX0pLFxuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoKSxcbiAgICAgICAgbmV3IFZSVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBWb2x1bWVDb250cm9sQnV0dG9uKCksXG4gICAgICAgIG5ldyBTZXR0aW5nc1RvZ2dsZUJ1dHRvbih7c2V0dGluZ3NQYW5lbDogc2V0dGluZ3NQYW5lbH0pLFxuICAgICAgICBuZXcgQ2FzdFRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpXG4gICAgICBdXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFVJQ29udGFpbmVyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgbmV3IFN1YnRpdGxlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQ2FzdFN0YXR1c092ZXJsYXkoKSxcbiAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlT3ZlcmxheSgpLFxuICAgICAgICBuZXcgV2F0ZXJtYXJrKCksXG4gICAgICAgIG5ldyBSZWNvbW1lbmRhdGlvbk92ZXJsYXkoKSxcbiAgICAgICAgY29udHJvbEJhcixcbiAgICAgICAgbmV3IFRpdGxlQmFyKCksXG4gICAgICAgIG5ldyBFcnJvck1lc3NhZ2VPdmVybGF5KClcbiAgICAgIF0sIGNzc0NsYXNzZXM6IFsndWktc2tpbi1sZWdhY3knXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVnYWN5QWRzVUkoKSB7XG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBBZENsaWNrT3ZlcmxheSgpLFxuICAgICAgICBuZXcgQ29udHJvbEJhcih7XG4gICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgbmV3IFBsYXliYWNrVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgQWRNZXNzYWdlTGFiZWwoKSxcbiAgICAgICAgICAgIG5ldyBWb2x1bWVDb250cm9sQnV0dG9uKCksXG4gICAgICAgICAgICBuZXcgRnVsbHNjcmVlblRvZ2dsZUJ1dHRvbigpXG4gICAgICAgICAgXVxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IEFkU2tpcEJ1dHRvbigpXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbGVnYWN5JywgJ3VpLXNraW4tYWRzJ11cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlZ2FjeUNhc3RSZWNlaXZlclVJKCkge1xuICAgIGxldCBjb250cm9sQmFyID0gbmV3IENvbnRyb2xCYXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU2Vla0JhcigpLFxuICAgICAgICBuZXcgUGxheWJhY2tUaW1lTGFiZWwoKSxcbiAgICAgIF1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgVUlDb250YWluZXIoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU3VidGl0bGVPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFdhdGVybWFyaygpLFxuICAgICAgICBjb250cm9sQmFyLFxuICAgICAgICBuZXcgVGl0bGVCYXIoKSxcbiAgICAgICAgbmV3IEVycm9yTWVzc2FnZU92ZXJsYXkoKVxuICAgICAgXSwgY3NzQ2xhc3NlczogWyd1aS1za2luLWxlZ2FjeScsICd1aS1za2luLWNhc3QtcmVjZWl2ZXInXVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVnYWN5VGVzdFVJKCkge1xuICAgIGxldCBzZXR0aW5nc1BhbmVsID0gbmV3IFNldHRpbmdzUGFuZWwoe1xuICAgICAgY29tcG9uZW50czogW1xuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ1ZpZGVvIFF1YWxpdHknLCBuZXcgVmlkZW9RdWFsaXR5U2VsZWN0Qm94KCkpLFxuICAgICAgICBuZXcgU2V0dGluZ3NQYW5lbEl0ZW0oJ0F1ZGlvIFRyYWNrJywgbmV3IEF1ZGlvVHJhY2tTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnQXVkaW8gUXVhbGl0eScsIG5ldyBBdWRpb1F1YWxpdHlTZWxlY3RCb3goKSksXG4gICAgICAgIG5ldyBTZXR0aW5nc1BhbmVsSXRlbSgnU3VidGl0bGVzJywgbmV3IFN1YnRpdGxlU2VsZWN0Qm94KCkpXG4gICAgICBdLFxuICAgICAgaGlkZGVuOiB0cnVlXG4gICAgfSk7XG5cbiAgICBsZXQgY29udHJvbEJhciA9IG5ldyBDb250cm9sQmFyKHtcbiAgICAgIGNvbXBvbmVudHM6IFtzZXR0aW5nc1BhbmVsLFxuICAgICAgICBuZXcgUGxheWJhY2tUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IFNlZWtCYXIoe2xhYmVsOiBuZXcgU2Vla0JhckxhYmVsKCl9KSxcbiAgICAgICAgbmV3IFBsYXliYWNrVGltZUxhYmVsKCksXG4gICAgICAgIG5ldyBWUlRvZ2dsZUJ1dHRvbigpLFxuICAgICAgICBuZXcgVm9sdW1lVG9nZ2xlQnV0dG9uKCksXG4gICAgICAgIG5ldyBWb2x1bWVTbGlkZXIoKSxcbiAgICAgICAgbmV3IFZvbHVtZUNvbnRyb2xCdXR0b24oKSxcbiAgICAgICAgbmV3IFZvbHVtZUNvbnRyb2xCdXR0b24oe3ZlcnRpY2FsOiBmYWxzZX0pLFxuICAgICAgICBuZXcgU2V0dGluZ3NUb2dnbGVCdXR0b24oe3NldHRpbmdzUGFuZWw6IHNldHRpbmdzUGFuZWx9KSxcbiAgICAgICAgbmV3IENhc3RUb2dnbGVCdXR0b24oKSxcbiAgICAgICAgbmV3IEZ1bGxzY3JlZW5Ub2dnbGVCdXR0b24oKVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBVSUNvbnRhaW5lcih7XG4gICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgIG5ldyBTdWJ0aXRsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IENhc3RTdGF0dXNPdmVybGF5KCksXG4gICAgICAgIG5ldyBQbGF5YmFja1RvZ2dsZU92ZXJsYXkoKSxcbiAgICAgICAgbmV3IFdhdGVybWFyaygpLFxuICAgICAgICBuZXcgUmVjb21tZW5kYXRpb25PdmVybGF5KCksXG4gICAgICAgIGNvbnRyb2xCYXIsXG4gICAgICAgIG5ldyBUaXRsZUJhcigpLFxuICAgICAgICBuZXcgRXJyb3JNZXNzYWdlT3ZlcmxheSgpXG4gICAgICBdLCBjc3NDbGFzc2VzOiBbJ3VpLXNraW4tbGVnYWN5J11cbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZExlZ2FjeVVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgW3tcbiAgICAgIHVpOiBsZWdhY3lBZHNVSSgpLFxuICAgICAgY29uZGl0aW9uOiAoY29udGV4dDogVUlDb25kaXRpb25Db250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmlzQWRXaXRoVUk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgdWk6IGxlZ2FjeVVJKClcbiAgICB9XSwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZExlZ2FjeUNhc3RSZWNlaXZlclVJKHBsYXllcjogUGxheWVyQVBJLCBjb25maWc6IFVJQ29uZmlnID0ge30pOiBVSU1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgVUlNYW5hZ2VyKHBsYXllciwgbGVnYWN5Q2FzdFJlY2VpdmVyVUkoKSwgY29uZmlnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBidWlsZExlZ2FjeVRlc3RVSShwbGF5ZXI6IFBsYXllckFQSSwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KTogVUlNYW5hZ2VyIHtcbiAgICByZXR1cm4gbmV3IFVJTWFuYWdlcihwbGF5ZXIsIGxlZ2FjeVRlc3RVSSgpLCBjb25maWcpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Vla1ByZXZpZXdBcmdzIGV4dGVuZHMgTm9BcmdzIHtcbiAgLyoqXG4gICAqIFRoZSB0aW1lbGluZSBwb3NpdGlvbiBpbiBwZXJjZW50IHdoZXJlIHRoZSBldmVudCBvcmlnaW5hdGVzIGZyb20uXG4gICAqL1xuICBwb3NpdGlvbjogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIHRpbWVsaW5lIG1hcmtlciBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgcG9zaXRpb24sIGlmIGV4aXN0aW5nLlxuICAgKi9cbiAgbWFya2VyPzogVGltZWxpbmVNYXJrZXI7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGZ1bmN0aW9uYWxpdHkgdG8gbWFuYWdlIGEgVUkgaW5zdGFuY2UuIFVzZWQgYnkgdGhlIHtAbGluayBVSU1hbmFnZXJ9IHRvIG1hbmFnZSBtdWx0aXBsZSBVSSBpbnN0YW5jZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBVSUluc3RhbmNlTWFuYWdlciB7XG4gIHByaXZhdGUgcGxheWVyV3JhcHBlcjogUGxheWVyV3JhcHBlcjtcbiAgcHJpdmF0ZSB1aTogVUlDb250YWluZXI7XG4gIHByaXZhdGUgY29uZmlnOiBVSUNvbmZpZztcblxuICBwcml2YXRlIGV2ZW50cyA9IHtcbiAgICBvbkNvbmZpZ3VyZWQ6IG5ldyBFdmVudERpc3BhdGNoZXI8VUlDb250YWluZXIsIE5vQXJncz4oKSxcbiAgICBvblNlZWs6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPigpLFxuICAgIG9uU2Vla1ByZXZpZXc6IG5ldyBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgU2Vla1ByZXZpZXdBcmdzPigpLFxuICAgIG9uU2Vla2VkOiBuZXcgRXZlbnREaXNwYXRjaGVyPFNlZWtCYXIsIE5vQXJncz4oKSxcbiAgICBvbkNvbXBvbmVudFNob3c6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvbkNvbXBvbmVudEhpZGU6IG5ldyBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIE5vQXJncz4oKSxcbiAgICBvbkNvbnRyb2xzU2hvdzogbmV3IEV2ZW50RGlzcGF0Y2hlcjxVSUNvbnRhaW5lciwgTm9BcmdzPigpLFxuICAgIG9uUHJldmlld0NvbnRyb2xzSGlkZTogbmV3IEV2ZW50RGlzcGF0Y2hlcjxVSUNvbnRhaW5lciwgQ2FuY2VsRXZlbnRBcmdzPigpLFxuICAgIG9uQ29udHJvbHNIaWRlOiBuZXcgRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+KCksXG4gIH07XG5cbiAgY29uc3RydWN0b3IocGxheWVyOiBQbGF5ZXJBUEksIHVpOiBVSUNvbnRhaW5lciwgY29uZmlnOiBVSUNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy5wbGF5ZXJXcmFwcGVyID0gbmV3IFBsYXllcldyYXBwZXIocGxheWVyKTtcbiAgICB0aGlzLnVpID0gdWk7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gIH1cblxuICBnZXRDb25maWcoKTogVUlDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxuXG4gIGdldFVJKCk6IFVJQ29udGFpbmVyIHtcbiAgICByZXR1cm4gdGhpcy51aTtcbiAgfVxuXG4gIGdldFBsYXllcigpOiBQbGF5ZXJBUEkge1xuICAgIHJldHVybiB0aGlzLnBsYXllcldyYXBwZXIuZ2V0UGxheWVyKCk7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiB0aGUgVUkgaXMgZnVsbHkgY29uZmlndXJlZCBhbmQgYWRkZWQgdG8gdGhlIERPTS5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvbkNvbmZpZ3VyZWQoKTogRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25Db25maWd1cmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gYSBzZWVrIHN0YXJ0cy5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvblNlZWsoKTogRXZlbnREaXNwYXRjaGVyPFNlZWtCYXIsIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vblNlZWs7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiB0aGUgc2VlayB0aW1lbGluZSBpcyBzY3J1YmJlZC5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvblNlZWtQcmV2aWV3KCk6IEV2ZW50RGlzcGF0Y2hlcjxTZWVrQmFyLCBTZWVrUHJldmlld0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25TZWVrUHJldmlldztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyB3aGVuIGEgc2VlayBpcyBmaW5pc2hlZC5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvblNlZWtlZCgpOiBFdmVudERpc3BhdGNoZXI8U2Vla0JhciwgTm9BcmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9uU2Vla2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gYSBjb21wb25lbnQgaXMgc2hvd2luZy5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvbkNvbXBvbmVudFNob3coKTogRXZlbnREaXNwYXRjaGVyPENvbXBvbmVudDxDb21wb25lbnRDb25maWc+LCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25Db21wb25lbnRTaG93O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gYSBjb21wb25lbnQgaXMgaGlkaW5nLlxuICAgKiBAcmV0dXJucyB7RXZlbnREaXNwYXRjaGVyfVxuICAgKi9cbiAgZ2V0IG9uQ29tcG9uZW50SGlkZSgpOiBFdmVudERpc3BhdGNoZXI8Q29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIE5vQXJncz4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5vbkNvbXBvbmVudEhpZGU7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgd2hlbiB0aGUgVUkgY29udHJvbHMgYXJlIHNob3dpbmcuXG4gICAqIEByZXR1cm5zIHtFdmVudERpc3BhdGNoZXJ9XG4gICAqL1xuICBnZXQgb25Db250cm9sc1Nob3coKTogRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25Db250cm9sc1Nob3c7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgYmVmb3JlIHRoZSBVSSBjb250cm9scyBhcmUgaGlkaW5nIHRvIGNoZWNrIGlmIHRoZXkgYXJlIGFsbG93ZWQgdG8gaGlkZS5cbiAgICogQHJldHVybnMge0V2ZW50RGlzcGF0Y2hlcn1cbiAgICovXG4gIGdldCBvblByZXZpZXdDb250cm9sc0hpZGUoKTogRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBDYW5jZWxFdmVudEFyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25QcmV2aWV3Q29udHJvbHNIaWRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHdoZW4gdGhlIFVJIGNvbnRyb2xzIGFyZSBoaWRpbmcuXG4gICAqIEByZXR1cm5zIHtFdmVudERpc3BhdGNoZXJ9XG4gICAqL1xuICBnZXQgb25Db250cm9sc0hpZGUoKTogRXZlbnREaXNwYXRjaGVyPFVJQ29udGFpbmVyLCBOb0FyZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMub25Db250cm9sc0hpZGU7XG4gIH1cblxuICBwcm90ZWN0ZWQgY2xlYXJFdmVudEhhbmRsZXJzKCk6IHZvaWQge1xuICAgIHRoaXMucGxheWVyV3JhcHBlci5jbGVhckV2ZW50SGFuZGxlcnMoKTtcblxuICAgIGxldCBldmVudHMgPSA8YW55PnRoaXMuZXZlbnRzOyAvLyBhdm9pZCBUUzcwMTdcbiAgICBmb3IgKGxldCBldmVudCBpbiBldmVudHMpIHtcbiAgICAgIGxldCBkaXNwYXRjaGVyID0gPEV2ZW50RGlzcGF0Y2hlcjxPYmplY3QsIE9iamVjdD4+ZXZlbnRzW2V2ZW50XTtcbiAgICAgIGRpc3BhdGNoZXIudW5zdWJzY3JpYmVBbGwoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRlbmRzIHRoZSB7QGxpbmsgVUlJbnN0YW5jZU1hbmFnZXJ9IGZvciBpbnRlcm5hbCB1c2UgaW4gdGhlIHtAbGluayBVSU1hbmFnZXJ9IGFuZCBwcm92aWRlcyBhY2Nlc3MgdG8gZnVuY3Rpb25hbGl0eVxuICogdGhhdCBjb21wb25lbnRzIHJlY2VpdmluZyBhIHJlZmVyZW5jZSB0byB0aGUge0BsaW5rIFVJSW5zdGFuY2VNYW5hZ2VyfSBzaG91bGQgbm90IGhhdmUgYWNjZXNzIHRvLlxuICovXG5jbGFzcyBJbnRlcm5hbFVJSW5zdGFuY2VNYW5hZ2VyIGV4dGVuZHMgVUlJbnN0YW5jZU1hbmFnZXIge1xuXG4gIHByaXZhdGUgY29uZmlndXJlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWxlYXNlZDogYm9vbGVhbjtcblxuICBnZXRXcmFwcGVkUGxheWVyKCk6IFdyYXBwZWRQbGF5ZXIge1xuICAgIC8vIFRPRE8gZmluZCBhIG5vbi1oYWNreSB3YXkgdG8gcHJvdmlkZSB0aGUgV3JhcHBlZFBsYXllciB0byB0aGUgVUlNYW5hZ2VyIHdpdGhvdXQgZXhwb3J0aW5nIGl0XG4gICAgLy8gZ2V0UGxheWVyKCkgYWN0dWFsbHkgcmV0dXJucyB0aGUgV3JhcHBlZFBsYXllciBidXQgaXRzIHJldHVybiB0eXBlIGlzIHNldCB0byBQbGF5ZXIgc28gdGhlIFdyYXBwZWRQbGF5ZXIgZG9lc1xuICAgIC8vIG5vdCBuZWVkIHRvIGJlIGV4cG9ydGVkXG4gICAgcmV0dXJuIDxXcmFwcGVkUGxheWVyPnRoaXMuZ2V0UGxheWVyKCk7XG4gIH1cblxuICBjb25maWd1cmVDb250cm9scygpOiB2b2lkIHtcbiAgICB0aGlzLmNvbmZpZ3VyZUNvbnRyb2xzVHJlZSh0aGlzLmdldFVJKCkpO1xuICAgIHRoaXMuY29uZmlndXJlZCA9IHRydWU7XG4gIH1cblxuICBpc0NvbmZpZ3VyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJlZDtcbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlQ29udHJvbHNUcmVlKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4pIHtcbiAgICBsZXQgY29uZmlndXJlZENvbXBvbmVudHM6IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+W10gPSBbXTtcblxuICAgIFVJVXRpbHMudHJhdmVyc2VUcmVlKGNvbXBvbmVudCwgKGNvbXBvbmVudCkgPT4ge1xuICAgICAgLy8gRmlyc3QsIGNoZWNrIGlmIHdlIGhhdmUgYWxyZWFkeSBjb25maWd1cmVkIGEgY29tcG9uZW50LCBhbmQgdGhyb3cgYW4gZXJyb3IgaWYgd2UgZGlkLiBNdWx0aXBsZSBjb25maWd1cmF0aW9uXG4gICAgICAvLyBvZiB0aGUgc2FtZSBjb21wb25lbnQgbGVhZHMgdG8gdW5leHBlY3RlZCBVSSBiZWhhdmlvci4gQWxzbywgYSBjb21wb25lbnQgdGhhdCBpcyBpbiB0aGUgVUkgdHJlZSBtdWx0aXBsZVxuICAgICAgLy8gdGltZXMgaGludHMgYXQgYSB3cm9uZyBVSSBzdHJ1Y3R1cmUuXG4gICAgICAvLyBXZSBjb3VsZCBqdXN0IHNraXAgY29uZmlndXJhdGlvbiBpbiBzdWNoIGEgY2FzZSBhbmQgbm90IHRocm93IGFuIGV4Y2VwdGlvbiwgYnV0IGVuZm9yY2luZyBhIGNsZWFuIFVJIHRyZWVcbiAgICAgIC8vIHNlZW1zIGxpa2UgdGhlIGJldHRlciBjaG9pY2UuXG4gICAgICBmb3IgKGxldCBjb25maWd1cmVkQ29tcG9uZW50IG9mIGNvbmZpZ3VyZWRDb21wb25lbnRzKSB7XG4gICAgICAgIGlmIChjb25maWd1cmVkQ29tcG9uZW50ID09PSBjb21wb25lbnQpIHtcbiAgICAgICAgICAvLyBXcml0ZSB0aGUgY29tcG9uZW50IHRvIHRoZSBjb25zb2xlIHRvIHNpbXBsaWZ5IGlkZW50aWZpY2F0aW9uIG9mIHRoZSBjdWxwcml0XG4gICAgICAgICAgLy8gKGUuZy4gYnkgaW5zcGVjdGluZyB0aGUgY29uZmlnKVxuICAgICAgICAgIGlmIChjb25zb2xlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDaXJjdWxhciByZWZlcmVuY2UgaW4gVUkgdHJlZScsIGNvbXBvbmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQWRkaXRpb25hbGx5IHRocm93IGFuIGVycm9yLCBiZWNhdXNlIHRoaXMgY2FzZSBtdXN0IG5vdCBoYXBwZW4gYW5kIGxlYWRzIHRvIHVuZXhwZWN0ZWQgVUkgYmVoYXZpb3IuXG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBpbiBVSSB0cmVlOiAnICsgY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbXBvbmVudC5pbml0aWFsaXplKCk7XG4gICAgICBjb21wb25lbnQuY29uZmlndXJlKHRoaXMuZ2V0UGxheWVyKCksIHRoaXMpO1xuICAgICAgY29uZmlndXJlZENvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVsZWFzZUNvbnRyb2xzKCk6IHZvaWQge1xuICAgIC8vIERvIG5vdCBjYWxsIHJlbGVhc2UgbWV0aG9kcyBpZiB0aGUgY29tcG9uZW50cyBoYXZlIG5ldmVyIGJlZW4gY29uZmlndXJlZDsgdGhpcyBjYW4gcmVzdWx0IGluIGV4Y2VwdGlvbnNcbiAgICBpZiAodGhpcy5jb25maWd1cmVkKSB7XG4gICAgICB0aGlzLnJlbGVhc2VDb250cm9sc1RyZWUodGhpcy5nZXRVSSgpKTtcbiAgICAgIHRoaXMuY29uZmlndXJlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnJlbGVhc2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGlzUmVsZWFzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucmVsZWFzZWQ7XG4gIH1cblxuICBwcml2YXRlIHJlbGVhc2VDb250cm9sc1RyZWUoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPikge1xuICAgIGNvbXBvbmVudC5yZWxlYXNlKCk7XG5cbiAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgQ29udGFpbmVyKSB7XG4gICAgICBmb3IgKGxldCBjaGlsZENvbXBvbmVudCBvZiBjb21wb25lbnQuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZUNvbnRyb2xzVHJlZShjaGlsZENvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xlYXJFdmVudEhhbmRsZXJzKCk6IHZvaWQge1xuICAgIHN1cGVyLmNsZWFyRXZlbnRIYW5kbGVycygpO1xuICB9XG59XG5cbi8qKlxuICogRXh0ZW5kZWQgaW50ZXJmYWNlIG9mIHRoZSB7QGxpbmsgUGxheWVyfSBmb3IgdXNlIGluIHRoZSBVSS5cbiAqL1xuaW50ZXJmYWNlIFdyYXBwZWRQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXJBUEkge1xuICAvKipcbiAgICogRmlyZXMgYW4gZXZlbnQgb24gdGhlIHBsYXllciB0aGF0IHRhcmdldHMgYWxsIGhhbmRsZXJzIGluIHRoZSBVSSBidXQgbmV2ZXIgZW50ZXJzIHRoZSByZWFsIHBsYXllci5cbiAgICogQHBhcmFtIGV2ZW50IHRoZSBldmVudCB0byBmaXJlXG4gICAqIEBwYXJhbSBkYXRhIGRhdGEgdG8gc2VuZCB3aXRoIHRoZSBldmVudFxuICAgKi9cbiAgZmlyZUV2ZW50SW5VSShldmVudDogRVZFTlQsIGRhdGE6IHt9KTogdm9pZDtcbn1cblxuLyoqXG4gKiBXcmFwcyB0aGUgcGxheWVyIHRvIHRyYWNrIGV2ZW50IGhhbmRsZXJzIGFuZCBwcm92aWRlIGEgc2ltcGxlIG1ldGhvZCB0byByZW1vdmUgYWxsIHJlZ2lzdGVyZWQgZXZlbnRcbiAqIGhhbmRsZXJzIGZyb20gdGhlIHBsYXllci5cbiAqL1xuY2xhc3MgUGxheWVyV3JhcHBlciB7XG5cbiAgcHJpdmF0ZSBwbGF5ZXI6IFBsYXllckFQSTtcbiAgcHJpdmF0ZSB3cmFwcGVyOiBXcmFwcGVkUGxheWVyO1xuXG4gIHByaXZhdGUgZXZlbnRIYW5kbGVyczogeyBbZXZlbnRUeXBlOiBzdHJpbmddOiBQbGF5ZXJFdmVudENhbGxiYWNrW107IH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSkge1xuICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuXG4gICAgLy8gQ29sbGVjdCBhbGwgcHVibGljIEFQSSBtZXRob2RzIG9mIHRoZSBwbGF5ZXJcbiAgICBsZXQgbWV0aG9kcyA9IDxhbnlbXT5bXTtcbiAgICBmb3IgKGxldCBtZW1iZXIgaW4gcGxheWVyKSB7XG4gICAgICBpZiAodHlwZW9mICg8YW55PnBsYXllcilbbWVtYmVyXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtZXRob2RzLnB1c2gobWVtYmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgd3JhcHBlciBvYmplY3QgYW5kIGFkZCBmdW5jdGlvbiB3cmFwcGVycyBmb3IgYWxsIEFQSSBtZXRob2RzIHRoYXQgZG8gbm90aGluZyBidXQgY2FsbGluZyB0aGUgYmFzZSBtZXRob2RcbiAgICAvLyBvbiB0aGUgcGxheWVyXG4gICAgbGV0IHdyYXBwZXIgPSA8YW55Pnt9O1xuICAgIGZvciAobGV0IG1lbWJlciBvZiBtZXRob2RzKSB7XG4gICAgICB3cmFwcGVyW21lbWJlcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsZWQgJyArIG1lbWJlcik7IC8vIHRyYWNrIG1ldGhvZCBjYWxscyBvbiB0aGUgcGxheWVyXG4gICAgICAgIHJldHVybiAoPGFueT5wbGF5ZXIpW21lbWJlcl0uYXBwbHkocGxheWVyLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGFsbCBwdWJsaWMgcHJvcGVydGllcyBvZiB0aGUgcGxheWVyIGFuZCBhZGQgaXQgdG8gdGhlIHdyYXBwZXJcbiAgICBmb3IgKGxldCBtZW1iZXIgaW4gcGxheWVyKSB7XG4gICAgICBpZiAodHlwZW9mICg8YW55PnBsYXllcilbbWVtYmVyXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3cmFwcGVyW21lbWJlcl0gPSAoPGFueT5wbGF5ZXIpW21lbWJlcl07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhwbGljaXRseSBhZGQgYSB3cmFwcGVyIG1ldGhvZCBmb3IgJ2FkZEV2ZW50SGFuZGxlcicgdGhhdCBhZGRzIGFkZGVkIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBldmVudCBsaXN0XG4gICAgd3JhcHBlci5hZGRFdmVudEhhbmRsZXIgPSAoZXZlbnRUeXBlOiBFVkVOVCwgY2FsbGJhY2s6IFBsYXllckV2ZW50Q2FsbGJhY2spID0+IHtcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG5cbiAgICAgIGlmICghdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50VHlwZV0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50VHlwZV0ucHVzaChjYWxsYmFjayk7XG5cbiAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH07XG5cbiAgICAvLyBFeHBsaWNpdGx5IGFkZCBhIHdyYXBwZXIgbWV0aG9kIGZvciAncmVtb3ZlRXZlbnRIYW5kbGVyJyB0aGF0IHJlbW92ZXMgcmVtb3ZlZCBldmVudCBoYW5kbGVycyBmcm9tIHRoZSBldmVudCBsaXN0XG4gICAgd3JhcHBlci5yZW1vdmVFdmVudEhhbmRsZXIgPSAoZXZlbnRUeXBlOiBFVkVOVCwgY2FsbGJhY2s6IFBsYXllckV2ZW50Q2FsbGJhY2spID0+IHtcbiAgICAgIHBsYXllci5yZW1vdmVFdmVudEhhbmRsZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG5cbiAgICAgIGlmICh0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSkge1xuICAgICAgICBBcnJheVV0aWxzLnJlbW92ZSh0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRUeXBlXSwgY2FsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9O1xuXG4gICAgd3JhcHBlci5maXJlRXZlbnRJblVJID0gKGV2ZW50OiBFVkVOVCwgZGF0YToge30pID0+IHtcbiAgICAgIGlmICh0aGlzLmV2ZW50SGFuZGxlcnNbZXZlbnRdKSB7IC8vIGNoZWNrIGlmIHRoZXJlIGFyZSBoYW5kbGVycyBmb3IgdGhpcyBldmVudCByZWdpc3RlcmVkXG4gICAgICAgIC8vIEV4dGVuZCB0aGUgZGF0YSBvYmplY3Qgd2l0aCBkZWZhdWx0IHZhbHVlcyB0byBjb252ZXJ0IGl0IHRvIGEge0BsaW5rIFBsYXllckV2ZW50fSBvYmplY3QuXG4gICAgICAgIGxldCBwbGF5ZXJFdmVudERhdGEgPSA8UGxheWVyRXZlbnQ+T2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICB0eXBlOiBldmVudCxcbiAgICAgICAgICAvLyBBZGQgYSBtYXJrZXIgcHJvcGVydHkgc28gdGhlIFVJIGNhbiBkZXRlY3QgVUktaW50ZXJuYWwgcGxheWVyIGV2ZW50c1xuICAgICAgICAgIHVpU291cmNlZDogdHJ1ZSxcbiAgICAgICAgfSwgZGF0YSk7XG5cbiAgICAgICAgLy8gRXhlY3V0ZSB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFja3NcbiAgICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50XSkge1xuICAgICAgICAgIGNhbGxiYWNrKHBsYXllckV2ZW50RGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy53cmFwcGVyID0gPFdyYXBwZWRQbGF5ZXI+d3JhcHBlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgd3JhcHBlZCBwbGF5ZXIgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgb24gcGxhY2Ugb2YgdGhlIG5vcm1hbCBwbGF5ZXIgb2JqZWN0LlxuICAgKiBAcmV0dXJucyB7V3JhcHBlZFBsYXllcn0gYSB3cmFwcGVkIHBsYXllclxuICAgKi9cbiAgZ2V0UGxheWVyKCk6IFdyYXBwZWRQbGF5ZXIge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXI7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCByZWdpc3RlcmVkIGV2ZW50IGhhbmRsZXJzIGZyb20gdGhlIHBsYXllciB0aGF0IHdlcmUgYWRkZWQgdGhyb3VnaCB0aGUgd3JhcHBlZCBwbGF5ZXIuXG4gICAqL1xuICBjbGVhckV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgZXZlbnRUeXBlIGluIHRoaXMuZXZlbnRIYW5kbGVycykge1xuICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5ldmVudEhhbmRsZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIucmVtb3ZlRXZlbnRIYW5kbGVyKGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtFdmVudERpc3BhdGNoZXIsIEV2ZW50LCBOb0FyZ3N9IGZyb20gJy4vZXZlbnRkaXNwYXRjaGVyJztcbmltcG9ydCB7Q29tcG9uZW50LCBDb21wb25lbnRDb25maWd9IGZyb20gJy4vY29tcG9uZW50cy9jb21wb25lbnQnO1xuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4vY29tcG9uZW50cy9jb250YWluZXInO1xuXG5leHBvcnQgbmFtZXNwYWNlIEFycmF5VXRpbHMge1xuICAvKipcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gYW4gYXJyYXkuXG4gICAqIEBwYXJhbSBhcnJheSB0aGUgYXJyYXkgdGhhdCBtYXkgY29udGFpbiB0aGUgaXRlbSB0byByZW1vdmVcbiAgICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gcmVtb3ZlIGZyb20gdGhlIGFycmF5XG4gICAqIEByZXR1cm5zIHthbnl9IHRoZSByZW1vdmVkIGl0ZW0gb3IgbnVsbCBpZiBpdCB3YXNuJ3QgcGFydCBvZiB0aGUgYXJyYXlcbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiByZW1vdmU8VD4oYXJyYXk6IFRbXSwgaXRlbTogVCk6IFQgfCBudWxsIHtcbiAgICBsZXQgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiBhcnJheS5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBTdHJpbmdVdGlscyB7XG5cbiAgZXhwb3J0IGxldCBGT1JNQVRfSEhNTVNTOiBzdHJpbmcgPSAnaGg6bW06c3MnO1xuICBleHBvcnQgbGV0IEZPUk1BVF9NTVNTOiBzdHJpbmcgPSAnbW06c3MnO1xuXG4gIC8qKlxuICAgKiBGb3JtYXRzIGEgbnVtYmVyIG9mIHNlY29uZHMgaW50byBhIHRpbWUgc3RyaW5nIHdpdGggdGhlIHBhdHRlcm4gaGg6bW06c3MuXG4gICAqXG4gICAqIEBwYXJhbSB0b3RhbFNlY29uZHMgdGhlIHRvdGFsIG51bWJlciBvZiBzZWNvbmRzIHRvIGZvcm1hdCB0byBzdHJpbmdcbiAgICogQHBhcmFtIGZvcm1hdCB0aGUgdGltZSBmb3JtYXQgdG8gb3V0cHV0IChkZWZhdWx0OiBoaDptbTpzcylcbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIGZvcm1hdHRlZCB0aW1lIHN0cmluZ1xuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHNlY29uZHNUb1RpbWUodG90YWxTZWNvbmRzOiBudW1iZXIsIGZvcm1hdDogc3RyaW5nID0gRk9STUFUX0hITU1TUyk6IHN0cmluZyB7XG4gICAgbGV0IGlzTmVnYXRpdmUgPSB0b3RhbFNlY29uZHMgPCAwO1xuXG4gICAgaWYgKGlzTmVnYXRpdmUpIHtcbiAgICAgIC8vIElmIHRoZSB0aW1lIGlzIG5lZ2F0aXZlLCB3ZSBtYWtlIGl0IHBvc2l0aXZlIGZvciB0aGUgY2FsY3VsYXRpb24gYmVsb3dcbiAgICAgIC8vIChlbHNlIHdlJ2QgZ2V0IGFsbCBuZWdhdGl2ZSBudW1iZXJzKSBhbmQgcmVhdHRhY2ggdGhlIG5lZ2F0aXZlIHNpZ24gbGF0ZXIuXG4gICAgICB0b3RhbFNlY29uZHMgPSAtdG90YWxTZWNvbmRzO1xuICAgIH1cblxuICAgIC8vIFNwbGl0IGludG8gc2VwYXJhdGUgdGltZSBwYXJ0c1xuICAgIGxldCBob3VycyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gMzYwMCk7XG4gICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcyAvIDYwKSAtIGhvdXJzICogNjA7XG4gICAgbGV0IHNlY29uZHMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcykgJSA2MDtcblxuICAgIHJldHVybiAoaXNOZWdhdGl2ZSA/ICctJyA6ICcnKSArIGZvcm1hdFxuICAgICAgICAucmVwbGFjZSgnaGgnLCBsZWZ0UGFkV2l0aFplcm9zKGhvdXJzLCAyKSlcbiAgICAgICAgLnJlcGxhY2UoJ21tJywgbGVmdFBhZFdpdGhaZXJvcyhtaW51dGVzLCAyKSlcbiAgICAgICAgLnJlcGxhY2UoJ3NzJywgbGVmdFBhZFdpdGhaZXJvcyhzZWNvbmRzLCAyKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBudW1iZXIgdG8gYSBzdHJpbmcgYW5kIGxlZnQtcGFkcyBpdCB3aXRoIHplcm9zIHRvIHRoZSBzcGVjaWZpZWQgbGVuZ3RoLlxuICAgKiBFeGFtcGxlOiBsZWZ0UGFkV2l0aFplcm9zKDEyMywgNSkgPT4gJzAwMTIzJ1xuICAgKlxuICAgKiBAcGFyYW0gbnVtIHRoZSBudW1iZXIgdG8gY29udmVydCB0byBzdHJpbmcgYW5kIHBhZCB3aXRoIHplcm9zXG4gICAqIEBwYXJhbSBsZW5ndGggdGhlIGRlc2lyZWQgbGVuZ3RoIG9mIHRoZSBwYWRkZWQgc3RyaW5nXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBwYWRkZWQgbnVtYmVyIGFzIHN0cmluZ1xuICAgKi9cbiAgZnVuY3Rpb24gbGVmdFBhZFdpdGhaZXJvcyhudW06IG51bWJlciB8IHN0cmluZywgbGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGxldCB0ZXh0ID0gbnVtICsgJyc7XG4gICAgbGV0IHBhZGRpbmcgPSAnMDAwMDAwMDAwMCcuc3Vic3RyKDAsIGxlbmd0aCAtIHRleHQubGVuZ3RoKTtcbiAgICByZXR1cm4gcGFkZGluZyArIHRleHQ7XG4gIH1cblxuICAvKipcbiAgICogRmlsbHMgb3V0IHBsYWNlaG9sZGVycyBpbiBhbiBhZCBtZXNzYWdlLlxuICAgKlxuICAgKiBIYXMgdGhlIHBsYWNlaG9sZGVycyAne3JlbWFpbmluZ1RpbWVbZm9ybWF0U3RyaW5nXX0nLCAne3BsYXllZFRpbWVbZm9ybWF0U3RyaW5nXX0nIGFuZFxuICAgKiAne2FkRHVyYXRpb25bZm9ybWF0U3RyaW5nXX0nLCB3aGljaCBhcmUgcmVwbGFjZWQgYnkgdGhlIHJlbWFpbmluZyB0aW1lIHVudGlsIHRoZSBhZCBjYW4gYmUgc2tpcHBlZCwgdGhlIGN1cnJlbnRcbiAgICogdGltZSBvciB0aGUgYWQgZHVyYXRpb24uIFRoZSBmb3JtYXQgc3RyaW5nIGlzIG9wdGlvbmFsLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgcGxhY2Vob2xkZXIgaXMgcmVwbGFjZWQgYnkgdGhlIHRpbWVcbiAgICogaW4gc2Vjb25kcy4gSWYgc3BlY2lmaWVkLCBpdCBtdXN0IGJlIG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICAgKiAtICVkIC0gSW5zZXJ0cyB0aGUgdGltZSBhcyBhbiBpbnRlZ2VyLlxuICAgKiAtICUwTmQgLSBJbnNlcnRzIHRoZSB0aW1lIGFzIGFuIGludGVnZXIgd2l0aCBsZWFkaW5nIHplcm9lcywgaWYgdGhlIGxlbmd0aCBvZiB0aGUgdGltZSBzdHJpbmcgaXMgc21hbGxlciB0aGFuIE4uXG4gICAqIC0gJWYgLSBJbnNlcnRzIHRoZSB0aW1lIGFzIGEgZmxvYXQuXG4gICAqIC0gJTBOZiAtIEluc2VydHMgdGhlIHRpbWUgYXMgYSBmbG9hdCB3aXRoIGxlYWRpbmcgemVyb2VzLlxuICAgKiAtICUuTWYgLSBJbnNlcnRzIHRoZSB0aW1lIGFzIGEgZmxvYXQgd2l0aCBNIGRlY2ltYWwgcGxhY2VzLiBDYW4gYmUgY29tYmluZWQgd2l0aCAlME5mLCBlLmcuICUwNC4yZiAodGhlIHRpbWVcbiAgICogMTAuMTIzXG4gICAqIHdvdWxkIGJlIHByaW50ZWQgYXMgMDAxMC4xMikuXG4gICAqIC0gJWhoOm1tOnNzXG4gICAqIC0gJW1tOnNzXG4gICAqXG4gICAqIEBwYXJhbSBhZE1lc3NhZ2UgYW4gYWQgbWVzc2FnZSB3aXRoIG9wdGlvbmFsIHBsYWNlaG9sZGVycyB0byBmaWxsXG4gICAqIEBwYXJhbSBza2lwT2Zmc2V0IGlmIHNwZWNpZmllZCwge3JlbWFpbmluZ1RpbWV9IHdpbGwgYmUgZmlsbGVkIHdpdGggdGhlIHJlbWFpbmluZyB0aW1lIHVudGlsIHRoZSBhZCBjYW4gYmUgc2tpcHBlZFxuICAgKiBAcGFyYW0gcGxheWVyIHRoZSBwbGF5ZXIgdG8gZ2V0IHRoZSB0aW1lIGRhdGEgZnJvbVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgYWQgbWVzc2FnZSB3aXRoIGZpbGxlZCBwbGFjZWhvbGRlcnNcbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiByZXBsYWNlQWRNZXNzYWdlUGxhY2Vob2xkZXJzKGFkTWVzc2FnZTogc3RyaW5nLCBza2lwT2Zmc2V0OiBudW1iZXIsIHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJKSB7XG4gICAgbGV0IGFkTWVzc2FnZVBsYWNlaG9sZGVyUmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgJ1xcXFx7KHJlbWFpbmluZ1RpbWV8cGxheWVkVGltZXxhZER1cmF0aW9uKSh9fCUoKDBbMS05XVxcXFxkKihcXFxcLlxcXFxkKyhkfGYpfGR8Zil8XFxcXC5cXFxcZCtmfGR8Zil8aGg6bW06c3N8bW06c3MpfSknLFxuICAgICAgJ2cnXG4gICAgKTtcblxuICAgIHJldHVybiBhZE1lc3NhZ2UucmVwbGFjZShhZE1lc3NhZ2VQbGFjZWhvbGRlclJlZ2V4LCAoZm9ybWF0U3RyaW5nKSA9PiB7XG4gICAgICBsZXQgdGltZSA9IDA7XG4gICAgICBpZiAoZm9ybWF0U3RyaW5nLmluZGV4T2YoJ3JlbWFpbmluZ1RpbWUnKSA+IC0xKSB7XG4gICAgICAgIGlmIChza2lwT2Zmc2V0KSB7XG4gICAgICAgICAgdGltZSA9IE1hdGguY2VpbChza2lwT2Zmc2V0IC0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpbWUgPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKSAtIHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGZvcm1hdFN0cmluZy5pbmRleE9mKCdwbGF5ZWRUaW1lJykgPiAtMSkge1xuICAgICAgICB0aW1lID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICB9IGVsc2UgaWYgKGZvcm1hdFN0cmluZy5pbmRleE9mKCdhZER1cmF0aW9uJykgPiAtMSkge1xuICAgICAgICB0aW1lID0gcGxheWVyLmdldER1cmF0aW9uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZm9ybWF0TnVtYmVyKHRpbWUsIGZvcm1hdFN0cmluZyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXROdW1iZXIodGltZTogbnVtYmVyLCBmb3JtYXQ6IHN0cmluZykge1xuICAgIGxldCBmb3JtYXRTdHJpbmdWYWxpZGF0aW9uUmVnZXggPSAvJSgoMFsxLTldXFxkKihcXC5cXGQrKGR8Zil8ZHxmKXxcXC5cXGQrZnxkfGYpfGhoOm1tOnNzfG1tOnNzKS87XG4gICAgbGV0IGxlYWRpbmdaZXJvZXNSZWdleCA9IC8oJTBbMS05XVxcZCopKD89KFxcLlxcZCtmfGZ8ZCkpLztcbiAgICBsZXQgZGVjaW1hbFBsYWNlc1JlZ2V4ID0gL1xcLlxcZCooPz1mKS87XG5cbiAgICBpZiAoIWZvcm1hdFN0cmluZ1ZhbGlkYXRpb25SZWdleC50ZXN0KGZvcm1hdCkpIHtcbiAgICAgIC8vIElmIHRoZSBmb3JtYXQgaXMgaW52YWxpZCwgd2Ugc2V0IGEgZGVmYXVsdCBmYWxsYmFjayBmb3JtYXRcbiAgICAgIGZvcm1hdCA9ICclZCc7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBudW1iZXIgb2YgbGVhZGluZyB6ZXJvc1xuICAgIGxldCBsZWFkaW5nWmVyb2VzID0gMDtcbiAgICBsZXQgbGVhZGluZ1plcm9lc01hdGNoZXMgPSBmb3JtYXQubWF0Y2gobGVhZGluZ1plcm9lc1JlZ2V4KTtcbiAgICBpZiAobGVhZGluZ1plcm9lc01hdGNoZXMpIHtcbiAgICAgIGxlYWRpbmdaZXJvZXMgPSBwYXJzZUludChsZWFkaW5nWmVyb2VzTWF0Y2hlc1swXS5zdWJzdHJpbmcoMikpO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gICAgbGV0IG51bURlY2ltYWxQbGFjZXMgPSBudWxsO1xuICAgIGxldCBkZWNpbWFsUGxhY2VzTWF0Y2hlcyA9IGZvcm1hdC5tYXRjaChkZWNpbWFsUGxhY2VzUmVnZXgpO1xuICAgIGlmIChkZWNpbWFsUGxhY2VzTWF0Y2hlcyAmJiAhaXNOYU4ocGFyc2VJbnQoZGVjaW1hbFBsYWNlc01hdGNoZXNbMF0uc3Vic3RyaW5nKDEpKSkpIHtcbiAgICAgIG51bURlY2ltYWxQbGFjZXMgPSBwYXJzZUludChkZWNpbWFsUGxhY2VzTWF0Y2hlc1swXS5zdWJzdHJpbmcoMSkpO1xuICAgICAgaWYgKG51bURlY2ltYWxQbGFjZXMgPiAyMCkge1xuICAgICAgICBudW1EZWNpbWFsUGxhY2VzID0gMjA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRmxvYXQgZm9ybWF0XG4gICAgaWYgKGZvcm1hdC5pbmRleE9mKCdmJykgPiAtMSkge1xuICAgICAgbGV0IHRpbWVTdHJpbmcgPSAnJztcblxuICAgICAgaWYgKG51bURlY2ltYWxQbGFjZXMgIT09IG51bGwpIHtcbiAgICAgICAgLy8gQXBwbHkgZml4ZWQgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gICAgICAgIHRpbWVTdHJpbmcgPSB0aW1lLnRvRml4ZWQobnVtRGVjaW1hbFBsYWNlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lU3RyaW5nID0gJycgKyB0aW1lO1xuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSBsZWFkaW5nIHplcm9zXG4gICAgICBpZiAodGltZVN0cmluZy5pbmRleE9mKCcuJykgPiAtMSkge1xuICAgICAgICByZXR1cm4gbGVmdFBhZFdpdGhaZXJvcyh0aW1lU3RyaW5nLCB0aW1lU3RyaW5nLmxlbmd0aCArIChsZWFkaW5nWmVyb2VzIC0gdGltZVN0cmluZy5pbmRleE9mKCcuJykpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKHRpbWVTdHJpbmcsIGxlYWRpbmdaZXJvZXMpO1xuICAgICAgfVxuXG4gICAgfVxuICAgIC8vIFRpbWUgZm9ybWF0XG4gICAgZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICBsZXQgdG90YWxTZWNvbmRzID0gTWF0aC5jZWlsKHRpbWUpO1xuXG4gICAgICAvLyBoaDptbTpzcyBmb3JtYXRcbiAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignaGgnKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBzZWNvbmRzVG9UaW1lKHRvdGFsU2Vjb25kcyk7XG4gICAgICB9XG4gICAgICAvLyBtbTpzcyBmb3JtYXRcbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgbWludXRlcyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gNjApO1xuICAgICAgICBsZXQgc2Vjb25kcyA9IHRvdGFsU2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKG1pbnV0ZXMsIDIpICsgJzonICsgbGVmdFBhZFdpdGhaZXJvcyhzZWNvbmRzLCAyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSW50ZWdlciBmb3JtYXRcbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBsZWZ0UGFkV2l0aFplcm9zKE1hdGguY2VpbCh0aW1lKSwgbGVhZGluZ1plcm9lcyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgUGxheWVyVXRpbHMge1xuXG4gIGltcG9ydCBQbGF5ZXJBUEkgPSBiaXRtb3Zpbi5QbGF5ZXJBUEk7XG5cbiAgZXhwb3J0IGVudW0gUGxheWVyU3RhdGUge1xuICAgIElETEUsXG4gICAgUFJFUEFSRUQsXG4gICAgUExBWUlORyxcbiAgICBQQVVTRUQsXG4gICAgRklOSVNIRUQsXG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gaXNTb3VyY2VMb2FkZWQocGxheWVyOiBiaXRtb3Zpbi5QbGF5ZXJBUEkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcGxheWVyLmdldENvbmZpZygpLnNvdXJjZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGlzVGltZVNoaWZ0QXZhaWxhYmxlKHBsYXllcjogYml0bW92aW4uUGxheWVyQVBJKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHBsYXllci5pc0xpdmUoKSAmJiBwbGF5ZXIuZ2V0TWF4VGltZVNoaWZ0KCkgIT09IDA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZ2V0U3RhdGUocGxheWVyOiBQbGF5ZXJBUEkpOiBQbGF5ZXJTdGF0ZSB7XG4gICAgaWYgKHBsYXllci5oYXNFbmRlZCgpKSB7XG4gICAgICByZXR1cm4gUGxheWVyU3RhdGUuRklOSVNIRUQ7XG4gICAgfSBlbHNlIGlmIChwbGF5ZXIuaXNQbGF5aW5nKCkpIHtcbiAgICAgIHJldHVybiBQbGF5ZXJTdGF0ZS5QTEFZSU5HO1xuICAgIH0gZWxzZSBpZiAocGxheWVyLmlzUGF1c2VkKCkpIHtcbiAgICAgIHJldHVybiBQbGF5ZXJTdGF0ZS5QQVVTRUQ7XG4gICAgfSBlbHNlIGlmIChpc1NvdXJjZUxvYWRlZChwbGF5ZXIpKSB7XG4gICAgICByZXR1cm4gUGxheWVyU3RhdGUuUFJFUEFSRUQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQbGF5ZXJTdGF0ZS5JRExFO1xuICAgIH1cbiAgfVxuXG4gIGV4cG9ydCBpbnRlcmZhY2UgVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEFyZ3MgZXh0ZW5kcyBOb0FyZ3Mge1xuICAgIHRpbWVTaGlmdEF2YWlsYWJsZTogYm9vbGVhbjtcbiAgfVxuXG4gIGV4cG9ydCBjbGFzcyBUaW1lU2hpZnRBdmFpbGFiaWxpdHlEZXRlY3RvciB7XG5cbiAgICBwcml2YXRlIHBsYXllcjogUGxheWVyQVBJO1xuICAgIHByaXZhdGUgdGltZVNoaWZ0QXZhaWxhYmxlOiBib29sZWFuO1xuICAgIHByaXZhdGUgdGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEV2ZW50ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcjxQbGF5ZXJBUEksIFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzPigpO1xuXG4gICAgY29uc3RydWN0b3IocGxheWVyOiBQbGF5ZXJBUEkpIHtcbiAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgICAgdGhpcy50aW1lU2hpZnRBdmFpbGFibGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGxldCB0aW1lU2hpZnREZXRlY3RvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5kZXRlY3QoKTtcbiAgICAgIH07XG4gICAgICAvLyBUcnkgdG8gZGV0ZWN0IHRpbWVzaGlmdCBhdmFpbGFiaWxpdHkgaW4gT05fUkVBRFksIHdoaWNoIHdvcmtzIGZvciBEQVNIIHN0cmVhbXNcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1JFQURZLCB0aW1lU2hpZnREZXRlY3Rvcik7XG4gICAgICAvLyBXaXRoIEhMUy9OYXRpdmVQbGF5ZXIgc3RyZWFtcywgZ2V0TWF4VGltZVNoaWZ0IGNhbiBiZSAwIGJlZm9yZSB0aGUgYnVmZmVyIGZpbGxzLCBzbyB3ZSBuZWVkIHRvIGFkZGl0aW9uYWxseVxuICAgICAgLy8gY2hlY2sgdGltZXNoaWZ0IGF2YWlsYWJpbGl0eSBpbiBPTl9USU1FX0NIQU5HRURcbiAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgdGltZVNoaWZ0RGV0ZWN0b3IpO1xuICAgIH1cblxuICAgIGRldGVjdCgpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLnBsYXllci5pc0xpdmUoKSkge1xuICAgICAgICBsZXQgdGltZVNoaWZ0QXZhaWxhYmxlTm93ID0gUGxheWVyVXRpbHMuaXNUaW1lU2hpZnRBdmFpbGFibGUodGhpcy5wbGF5ZXIpO1xuXG4gICAgICAgIC8vIFdoZW4gdGhlIGF2YWlsYWJpbGl0eSBjaGFuZ2VzLCB3ZSBmaXJlIHRoZSBldmVudFxuICAgICAgICBpZiAodGltZVNoaWZ0QXZhaWxhYmxlTm93ICE9PSB0aGlzLnRpbWVTaGlmdEF2YWlsYWJsZSkge1xuICAgICAgICAgIHRoaXMudGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZEV2ZW50LmRpc3BhdGNoKHRoaXMucGxheWVyLCB7IHRpbWVTaGlmdEF2YWlsYWJsZTogdGltZVNoaWZ0QXZhaWxhYmxlTm93IH0pO1xuICAgICAgICAgIHRoaXMudGltZVNoaWZ0QXZhaWxhYmxlID0gdGltZVNoaWZ0QXZhaWxhYmxlTm93O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IG9uVGltZVNoaWZ0QXZhaWxhYmlsaXR5Q2hhbmdlZCgpOiBFdmVudDxQbGF5ZXJBUEksIFRpbWVTaGlmdEF2YWlsYWJpbGl0eUNoYW5nZWRBcmdzPiB7XG4gICAgICByZXR1cm4gdGhpcy50aW1lU2hpZnRBdmFpbGFiaWxpdHlDaGFuZ2VkRXZlbnQuZ2V0RXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICBleHBvcnQgaW50ZXJmYWNlIExpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncyBleHRlbmRzIE5vQXJncyB7XG4gICAgbGl2ZTogYm9vbGVhbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlY3RzIGNoYW5nZXMgb2YgdGhlIHN0cmVhbSB0eXBlLCBpLmUuIGNoYW5nZXMgb2YgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgcGxheWVyI2lzTGl2ZSBtZXRob2QuXG4gICAqIE5vcm1hbGx5LCBhIHN0cmVhbSBjYW5ub3QgY2hhbmdlIGl0cyB0eXBlIGR1cmluZyBwbGF5YmFjaywgaXQncyBlaXRoZXIgVk9EIG9yIGxpdmUuIER1ZSB0byBidWdzIG9uIHNvbWVcbiAgICogcGxhdGZvcm1zIG9yIGJyb3dzZXJzLCBpdCBjYW4gc3RpbGwgY2hhbmdlLiBJdCBpcyB0aGVyZWZvcmUgdW5yZWxpYWJsZSB0byBqdXN0IGNoZWNrICNpc0xpdmUgYW5kIHRoaXMgZGV0ZWN0b3JcbiAgICogc2hvdWxkIGJlIHVzZWQgYXMgYSB3b3JrYXJvdW5kIGluc3RlYWQuXG4gICAqXG4gICAqIEtub3duIGNhc2VzOlxuICAgKlxuICAgKiAtIEhMUyBWT0Qgb24gQW5kcm9pZCA0LjNcbiAgICogVmlkZW8gZHVyYXRpb24gaXMgaW5pdGlhbGx5ICdJbmZpbml0eScgYW5kIG9ubHkgZ2V0cyBhdmFpbGFibGUgYWZ0ZXIgcGxheWJhY2sgc3RhcnRzLCBzbyBzdHJlYW1zIGFyZSB3cm9uZ2x5XG4gICAqIHJlcG9ydGVkIGFzICdsaXZlJyBiZWZvcmUgcGxheWJhY2sgKHRoZSBsaXZlLWNoZWNrIGluIHRoZSBwbGF5ZXIgY2hlY2tzIGZvciBpbmZpbml0ZSBkdXJhdGlvbikuXG4gICAqL1xuICBleHBvcnQgY2xhc3MgTGl2ZVN0cmVhbURldGVjdG9yIHtcblxuICAgIHByaXZhdGUgcGxheWVyOiBQbGF5ZXJBUEk7XG4gICAgcHJpdmF0ZSBsaXZlOiBib29sZWFuO1xuICAgIHByaXZhdGUgbGl2ZUNoYW5nZWRFdmVudCA9IG5ldyBFdmVudERpc3BhdGNoZXI8UGxheWVyQVBJLCBMaXZlU3RyZWFtRGV0ZWN0b3JFdmVudEFyZ3M+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXI6IFBsYXllckFQSSkge1xuICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICB0aGlzLmxpdmUgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGxldCBsaXZlRGV0ZWN0b3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGV0ZWN0KCk7XG4gICAgICB9O1xuICAgICAgLy8gSW5pdGlhbGl6ZSB3aGVuIHBsYXllciBpcyByZWFkeVxuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUkVBRFksIGxpdmVEZXRlY3Rvcik7XG4gICAgICAvLyBSZS1ldmFsdWF0ZSB3aGVuIHBsYXliYWNrIHN0YXJ0c1xuICAgICAgcGxheWVyLmFkZEV2ZW50SGFuZGxlcihwbGF5ZXIuRVZFTlQuT05fUExBWSwgbGl2ZURldGVjdG9yKTtcblxuICAgICAgLy8gSExTIGxpdmUgZGV0ZWN0aW9uIHdvcmthcm91bmQgZm9yIEFuZHJvaWQ6XG4gICAgICAvLyBBbHNvIHJlLWV2YWx1YXRlIGR1cmluZyBwbGF5YmFjaywgYmVjYXVzZSB0aGF0IGlzIHdoZW4gdGhlIGxpdmUgZmxhZyBtaWdodCBjaGFuZ2UuXG4gICAgICAvLyAoRG9pbmcgaXQgb25seSBpbiBBbmRyb2lkIENocm9tZSBzYXZlcyB1bm5lY2Vzc2FyeSBvdmVyaGVhZCBvbiBvdGhlciBwbGF0dGZvcm1zKVxuICAgICAgaWYgKEJyb3dzZXJVdGlscy5pc0FuZHJvaWQgJiYgQnJvd3NlclV0aWxzLmlzQ2hyb21lKSB7XG4gICAgICAgIHBsYXllci5hZGRFdmVudEhhbmRsZXIocGxheWVyLkVWRU5ULk9OX1RJTUVfQ0hBTkdFRCwgbGl2ZURldGVjdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZXRlY3QoKTogdm9pZCB7XG4gICAgICBsZXQgbGl2ZU5vdyA9IHRoaXMucGxheWVyLmlzTGl2ZSgpO1xuXG4gICAgICAvLyBDb21wYXJlIGN1cnJlbnQgdG8gcHJldmlvdXMgbGl2ZSBzdGF0ZSBmbGFnIGFuZCBmaXJlIGV2ZW50IHdoZW4gaXQgY2hhbmdlcy4gU2luY2Ugd2UgaW5pdGlhbGl6ZSB0aGUgZmxhZ1xuICAgICAgLy8gd2l0aCB1bmRlZmluZWQsIHRoZXJlIGlzIGFsd2F5cyBhdCBsZWFzdCBhbiBpbml0aWFsIGV2ZW50IGZpcmVkIHRoYXQgdGVsbHMgbGlzdGVuZXJzIHRoZSBsaXZlIHN0YXRlLlxuICAgICAgaWYgKGxpdmVOb3cgIT09IHRoaXMubGl2ZSkge1xuICAgICAgICB0aGlzLmxpdmVDaGFuZ2VkRXZlbnQuZGlzcGF0Y2godGhpcy5wbGF5ZXIsIHsgbGl2ZTogbGl2ZU5vdyB9KTtcbiAgICAgICAgdGhpcy5saXZlID0gbGl2ZU5vdztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgb25MaXZlQ2hhbmdlZCgpOiBFdmVudDxQbGF5ZXJBUEksIExpdmVTdHJlYW1EZXRlY3RvckV2ZW50QXJncz4ge1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZUNoYW5nZWRFdmVudC5nZXRFdmVudCgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIFVJVXRpbHMge1xuICBleHBvcnQgaW50ZXJmYWNlIFRyZWVUcmF2ZXJzYWxDYWxsYmFjayB7XG4gICAgKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIHBhcmVudD86IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KTogdm9pZDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB0cmF2ZXJzZVRyZWUoY29tcG9uZW50OiBDb21wb25lbnQ8Q29tcG9uZW50Q29uZmlnPiwgdmlzaXQ6IFRyZWVUcmF2ZXJzYWxDYWxsYmFjayk6IHZvaWQge1xuICAgIGxldCByZWN1cnNpdmVUcmVlV2Fsa2VyID0gKGNvbXBvbmVudDogQ29tcG9uZW50PENvbXBvbmVudENvbmZpZz4sIHBhcmVudD86IENvbXBvbmVudDxDb21wb25lbnRDb25maWc+KSA9PiB7XG4gICAgICB2aXNpdChjb21wb25lbnQsIHBhcmVudCk7XG5cbiAgICAgIC8vIElmIHRoZSBjdXJyZW50IGNvbXBvbmVudCBpcyBhIGNvbnRhaW5lciwgdmlzaXQgaXQncyBjaGlsZHJlblxuICAgICAgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIENvbnRhaW5lcikge1xuICAgICAgICBmb3IgKGxldCBjaGlsZENvbXBvbmVudCBvZiBjb21wb25lbnQuZ2V0Q29tcG9uZW50cygpKSB7XG4gICAgICAgICAgcmVjdXJzaXZlVHJlZVdhbGtlcihjaGlsZENvbXBvbmVudCwgY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBXYWxrIGFuZCBjb25maWd1cmUgdGhlIGNvbXBvbmVudCB0cmVlXG4gICAgcmVjdXJzaXZlVHJlZVdhbGtlcihjb21wb25lbnQpO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQnJvd3NlclV0aWxzIHtcblxuICAvLyBpc01vYmlsZSBvbmx5IG5lZWRzIHRvIGJlIGV2YWx1YXRlZCBvbmNlIChpdCBjYW5ub3QgY2hhbmdlIGR1cmluZyBhIGJyb3dzZXIgc2Vzc2lvbilcbiAgLy8gTW9iaWxlIGRldGVjdGlvbiBhY2NvcmRpbmcgdG8gTW96aWxsYSByZWNvbW1lbmRhdGlvbjogXCJJbiBzdW1tYXJ5LCB3ZSByZWNvbW1lbmQgbG9va2luZyBmb3IgdGhlIHN0cmluZyDigJxNb2Jp4oCdXG4gIC8vIGFueXdoZXJlIGluIHRoZSBVc2VyIEFnZW50IHRvIGRldGVjdCBhIG1vYmlsZSBkZXZpY2UuXCJcbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9Ccm93c2VyX2RldGVjdGlvbl91c2luZ190aGVfdXNlcl9hZ2VudFxuICBleHBvcnQgY29uc3QgaXNNb2JpbGUgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvTW9iaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuICBleHBvcnQgY29uc3QgaXNDaHJvbWUgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvQ2hyb21lLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG4gIGV4cG9ydCBjb25zdCBpc0FuZHJvaWQgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbn0iXX0=
