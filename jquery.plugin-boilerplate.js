/*
	Plugin Name: Name of the plugin.
	Description: Brief description about plugin.
*/
; (function ($, window, document, undefined) {
	"use strict";
	let plugin;
	const PLUGIN_NAME = 'pluginName';
	function Plugin(element, options) {
		this._element    = element;
		this._pluginName = PLUGIN_NAME;
		this._defaults   = $.fn[PLUGIN_NAME].defaults;
		this._settings 	 = $.extend({}, this._defaults, options);
		this._init();
	}
	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		// Initialization logic
		_init: function () {
			plugin = this;
			this._build();
			this._bindEvents();
		},
		// Cache DOM nodes for performance
		_build: function () {
			this.$_element = $(this._element);
		},
		// Bind events that trigger methods
		_bindEvents: function () {
			plugin.$_element.on('click' + '.' + plugin._pluginName, function () {
				plugin._someOtherFunction.call(plugin);
			});
		},
		// Unbind events that trigger methods
		_unbindEvents: function () {
			this.$_element.off('.' + this._pluginName);
		},
		// Remove plugin instance completely
		_destroy: function () {
			this._unbindEvents();
			this.$_element.removeData();
		},
		// Create custom methods
		_someOtherFunction: function () {
			console.log('Function is called.');
			this._callback();
		},
		// Callback methods
		_callback: function () {
			// Cache onComplete option
			let onComplete = this._settings.onComplete;
			if (typeof onComplete === "function") {
				onComplete(this._element);
			}
		}
	});
	//Plugin wrapper
	$.fn[PLUGIN_NAME] = function (options) {
		this.each(function () {
			if (!$.data(this, "plugin_" + PLUGIN_NAME)) {
				$.data(this, "plugin_" + PLUGIN_NAME, new Plugin(this, options));
			}
		});
		return this;
	};
	$.fn[PLUGIN_NAME].defaults = {
		property  : 'value',
		onComplete: null
	};
})(jQuery, window, document);
