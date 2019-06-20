/*
    Plugin Name: Name of the plugin.
    Description:
    Brief description about plugin.
*/
; (function ($, window, document, undefined) {

	var pluginName = 'PluginName';

	function Plugin(element, options) {

		this._element    = element;
		this._pluginName = pluginName;
		this._defaults   = $.fn.myPluginName.defaults;
		this._settings   = $.extend({}, this._defaults, options);
		this._initialize();
	}

	$.extend(Plugin.prototype, {

		_initialize: function () {
			this._buildCache();
			this._bindEvents();
		},
		_destroy: function () {
			this._unbindEvents();
			this.$_element.removeData();
		},
		_buildCache: function () {
			this.$_element = $(this._element);
		},
		_bindEvents: function () {
			var plugin = this;
			plugin.$_element.on('click' + '.' + plugin._pluginName, function () {
				plugin._someOtherFunction.call(plugin);
			});
		},
		_unbindEvents: function () {
			this.$_element.off('.' + this._pluginName);
		},
		_someOtherFunction: function () {
			console.log('Function is called.');
			this._callback();
		},
		_callback: function () {
			var onComplete = this._settings.onComplete;
			if ($.isFunction(onComplete)) {
				onComplete.call(this._element);
			}
		}

	});

	$.fn.myPluginName = function (options) {
		this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
		return this;
	};

	$.fn.myPluginName.defaults = {
		property  : 'value',
		onComplete: null
	};

})(jQuery, window, document);
