/*
    Plugin Name: Name of the plugin.
    Description:
    Brief description about plugin.
*/

/*
    The semi-colon before the function invocation is a safety net against
    concatenated scripts and/or other plugins which may not be closed properly.

    "undefined" is used because the undefined global variable in ECMAScript 3
    is mutable (ie. it can be changed by someone else). Because we don't pass a
    value to undefined when the anonymous function is invoked, we ensure that
    undefined is truly undefined. Note, in ECMAScript 5 undefined can no
    longer be modified.

    "window" and "document" are passed as local variables rather than global.
    This (slightly) quickens the resolution process.
*/
; (function ($, window, document, undefined) {

    /*
        Store the name of the plugin in the "pluginName" variable. This
        variable is used in the "Plugin" constructor below, as well as the
        plugin wrapper to construct the key for the "$.data" method.
        More: http://api.jquery.com/jquery.data/
    */
    var pluginName = 'PluginName';

    /*
        The "Plugin" constructor, builds a new instance of the plugin for the
        DOM node(s) that the plugin is called on. For example,
        "$('selector').pluginName();" creates a new instance of pluginName for the given selector.
    */

    // Create the plugin constructor
    function Plugin(element, options) {
        /*
            Provide local access to the DOM node(s) that called the plugin,
            as well local access to the pluginName and default options.
        */

        this._element    = element;
        this._pluginName = pluginName;
        this._defaults   = $.fn.myPluginName.defaults;
        /*
            The "$.extend" method merges the contents of two or more objects,
            and stores the result in the first object. The first object is
            empty so that we don't alter the default options for future
            instances of the plugin.
            More: http://api.jquery.com/jquery.extend/
        */
        this._settings = $.extend({}, this._defaults, options);

        /*
            The "_initialize" method is the starting point for the plugin logic.
            Calling the _initialize method here in the "Plugin" constructor function
            allows us to store all methods (including the _initialize method) in the
            plugin's prototype. Storing methods required by the plugin in its
            prototype lowers the memory footprint, as each instance of the
            plugin does not need to duplicate all of the same methods. Rather,
            each instance can inherit the methods from the constructor
            function's prototype.
        */
        this._initialize();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {

        // Initialization logic
        _initialize: function () {
            /*
                Create additional methods below and call them via
                "this.myFunction(arg1, arg2)", ie: "this._buildCache();".
                Note, you can access the DOM node(s), pluginName, default
                plugin options and custom plugin options for a each instance
                of the plugin by using the variables "this._element",
                "this._pluginName", "this._defaults" and "this._settings" created in
                the "Plugin" constructor function (as shown in the _buildCache
                method below).
            */
            this._buildCache();
            this._bindEvents();
        },

        // Remove plugin instance completely
        _destroy: function () {
            /*
                The _destroy method unbinds all events for the specific instance
                of the plugin, then removes all plugin data that was stored in
                the plugin instance using jQuery's .removeData method.
                Since we store data for each instance of the plugin in its
                instantiating element using the $.data method (as explained
                in the plugin wrapper below), we can call methods directly on
                the instance outside of the plugin initialization, ie:
                $('selector').data('plugin_myPluginName')._someOtherFunction();
                Consequently, the _destroy method can be called using:
                $('selector').data('plugin_myPluginName')._destroy();
            */
            this._unbindEvents();
            this.$_element.removeData();
        },

        // Cache DOM nodes for performance
        _buildCache: function () {
            /*
                Create variable(s) that can be accessed by other plugin
                functions. For example, "this.$_element = $(this._element);"
                will cache a jQuery reference to the element that initialized
                the plugin. Cached variables can then be used in other methods. 
            */
            this.$_element = $(this._element);
        },

        // Bind events that trigger methods
        _bindEvents: function () {
            var plugin = this;
            /*
                Bind event(s) handlers that trigger other functions, ie:
                "plugin.$_element.on('click', function() {});". Note the use of
                the cached variable we created in the _buildCache method.
                All events are namespaced, ie:
                ".on('click'+'.'+this._pluginName', function() {});".
                This allows us to unbind plugin-specific events using the
                _unbindEvents method below.
            */
            plugin.$_element.on('click' + '.' + plugin._pluginName, function () {
                /*
                    Use the "call" method so that inside of the method being
                    called, ie: "_someOtherFunction", the "this" keyword refers
                    to the plugin instance, not the event handler.
                    More: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
                */
                plugin._someOtherFunction.call(plugin);
            });
        },

        // Unbind events that trigger methods
        _unbindEvents: function () {
            /*
                Unbind all events in our plugin's namespace that are attached
                to "this.$_element".
            */
            this.$_element.off('.' + this._pluginName);
        },

        /*
            "_someOtherFunction" is an example of a custom method in your
            plugin. Each method should perform a specific task. For example,
            the _buildCache method exists only to create variables for other
            methods to access. The _bindEvents method exists only to bind events
            to event handlers that trigger other methods. Creating custom
            plugin methods this way is less confusing (separation of concerns)
            and makes your code easier to test.
        */
        // Create custom methods
        _someOtherFunction: function () {
            console.log('Function is called.');
            this._callback();
        },

        _callback: function () {
            // Cache onComplete option
            var onComplete = this._settings.onComplete;

            if ($.isFunction(onComplete)) {
                /*
                    Use the "call" method so that inside of the onComplete
                    callback function the "this" keyword refers to the
                    specific DOM node that called the plugin.
                    More: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
                */
                onComplete.call(this._element);
            }
        }

    });

    /*
        Create a lightweight plugin wrapper around the "Plugin" constructor,
        preventing against multiple instantiations.
        More: http://learn.jquery.com/plugins/basic-plugin-creation/
    */
    $.fn.myPluginName = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                /*
                    Use "$.data" to save each instance of the plugin in case
                    the user wants to modify it. Using "$.data" in this way
                    ensures the data is removed when the DOM element(s) are
                    removed via jQuery methods, as well as when the user leaves
                    the page. It's a smart way to prevent memory leaks.
                    More: http://api.jquery.com/jquery.data/
                */
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
        /*
            "return this;" returns the original jQuery object. This allows
            additional jQuery methods to be chained.
        */
        return this;
    };

    /*
        Attach the default plugin options directly to the plugin object. This
        allows users to override default plugin options globally, instead of
        passing the same option(s) every time the plugin is initialized.
        For example, the user could set the "property" value once for all
        instances of the plugin with
        "$.fn.pluginName.defaults.property = 'myValue';". Then, every time
        plugin is initialized, "property" will be set to "myValue".
        More: http://learn.jquery.com/plugins/advanced-plugin-concepts/
    */
    $.fn.myPluginName.defaults = {
        property: 'value',
        onComplete: null
    };

})(jQuery, window, document);