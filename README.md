# jquery.plugin-boilerplate [![CodeFactor](https://www.codefactor.io/repository/github/sid04naik/jquery.plugin-boilerplate/badge)](https://www.codefactor.io/repository/github/sid04naik/jquery.plugin-boilerplate) [![Build Status](https://travis-ci.com/sid04naik/jquery.plugin-boilerplate.svg?branch=master)](https://travis-ci.com/sid04naik/jquery.plugin-boilerplate)

Simple and opinionated jquery plugin boilerplate.

Below is the complete guide on this boilerplate.

---
## Prerequisites
* JQuery.

```js
// required plugins.
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
```
## [Documentation](https://sid04naik.github.io/jquery.plugin-boilerplate/)
Download jquery.plugin-boilerplate by clicking on [Download Plugin](https://github.com/sid04naik/jquery.plugin-boilerplate/releases/tag/v1.0.0).

The semi-colon before the function invocation is a safety net against concatenated scripts and/or other plugins which may not be closed properly.
`undefined` is used because the undefined global variable in ECMAScript 3 is mutable. (ie. it can be changed by someone else). Because we don't pass a value to undefined when the anonymous function is invoked, we ensure that undefined is truly undefined.
Note: In ECMAScript 5 undefined can no longer be modified.
`window` and `document` are passed as local variables rather than global. This (slightly) quickens the resolution process.

```js
; (function ($, window, document, undefined) {
```

The purpose of `use strict` is to indicate that the code should be executed in "strict mode". With strict mode, you can not, for example, use undeclared variables.

```js
"use strict";
```

Store the name of the plugin in the `pluginName` variable. This variable is used in the `Plugin` constructor below, as well as in the plugin wrapper to construct the key for the `$.data` method.
More: http://api.jquery.com/jquery.data/

```js
let plugin,pluginName = 'pluginName';
```

The `Plugin` constructor, builds a new instance of the plugin for the DOM node(s) that the plugin is called on. For example, `$('selector').pluginName();` creates a new instance of pluginName for the given selector.

```js
function Plugin(element, options) {
```

Provide local access to the DOM node(s) that are called the plugin, as well local access to the pluginName and default options.

```js
this._element    = element;
this._pluginName = pluginName;
this._defaults   = $.fn[myPluginName].defaults;
/*
The "$.extend" method merges the contents of two or more objects, and stores the result in the first object. The first object is empty so that we don't alter the default options for future instances of the plugin.
More: http://api.jquery.com/jquery.extend/
*/
this._settings = $.extend({}, this._defaults, options);
```

The `_init` method is the starting point for the plugin logic.
Calling the `_init` method here in the "Plugin" constructor function allows us to store all methods (including the `_init` method) in the plugin's prototype.

```js
this._init();
} //closing the Plugin constructor
```

Avoid Plugin.prototype conflicts

```js
$.extend(Plugin.prototype, {
```

All the custom functions will come here. Below are some of the default functions.

```js
_init: function () {
/*
Create additional methods below and call them via "this.myFunction(arg1, arg2)", ie: "this._build();".
Note: You can access the DOM node(s), pluginName, default plugin options and custom plugin options for a each instance of the plugin by using the variables "this._element", "this._pluginName", "this._defaults" and "this._settings" created in the "Plugin" constructor function (as shown in the _build method below).
*/
    plugin = this;
    this._build();
    this._bindEvents();
},
```

Cache DOM nodes for performing some tasks.

```js
_build: function () {
/*
Create variable(s) that can be accessed by other plugin functions. For example, "this.$_element = $(this._element);" will cache a jQuery reference to the element that initialized the plugin.
Cached variables can then be used in other methods.
*/
    this.$_element = $(this._element);
},
```

Bind events that trigger methods

```js
_bindEvents: function () {
/*
Bind event(s) handlers that trigger other functions, ie: "plugin.$_element.on('click', function() {});".
Note the use of the cached variable we created in the _build method.
All events are namespaced, ie: ".on('click'+'.'+this._pluginName', function() {});".
This allows us to unbind plugin-specific events using the _unbindEvents method below.
*/
    plugin.$_element.on('click' + '.' + plugin._pluginName, function () {
/*
Use the "call" method to call the function. ie: "_someOtherFunction", the "this" keyword refers to the plugin instance, not the event handler.
More: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
*/
        plugin._someOtherFunction.call(plugin);
    });
},
```

Unbind events that trigger methods

```js
_unbindEvents: function () {
/*
Unbind all events in our plugin's namespace that are attached to "this.$_element".
*/
    this.$_element.off('.' + this._pluginName);
},
```

Remove plugin instance completely

```js
_destroy: function () {
/*
The _destroy method unbinds all events for the specific instance of the plugin, then removes all plugin data that was stored in the plugin instance using jQuery's .removeData method.
Since we store data for each instance of the plugin in its instantiating element using the $.data method (as explained in the plugin wrapper below), we can call methods directly on the instance outside of the plugin initialization, ie: $('selector').data('plugin_myPluginName')._someOtherFunction();
Consequently, the _destroy method can be called using: $('selector').data('plugin_myPluginName')._destroy();
*/
    this._unbindEvents();
    this.$_element.removeData();
},
```

`_someOtherFunction` is an example of a custom method in your plugin. Each method should perform a specific task. For example, the `_build` method exists only to create variables for other methods to access. The `_bindEvents` method exists only to bind events to event handlers that trigger other methods.
Creating custom plugin methods this way is less confusing (separation of concerns) and makes your code easier to test.

Create custom methods

```js
_someOtherFunction: function () {
    console.log('Function is called.');
    this._callback(); //callback function
},
```

Callback function

```js
_callback: function () {
    // Cache onComplete option
    let onComplete = this._settings.onComplete;
    if ($.isFunction(onComplete)) {
/*
Use the "call" method so that the onComplete callback function the "this" keyword refers to the
specific DOM node that called the plugin.
More: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
*/
        onComplete.call(this._element);
    }
}
}); //closing Prototype
```

Create a lightweight plugin wrapper around the `Plugin` constructor, preventing against multiple instantiations.
More: http://learn.jquery.com/plugins/basic-plugin-creation/

```js
$.fn[pluginName] = function (options) {
    this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
/*
Use "$.data" to save each instance of the plugin in case the user wants to modify it. Using "$.data" in this way ensures the data is removed when the DOM element(s) are
removed via jQuery methods, as well as when the user leaves the page. It's a smart way to prevent memory leaks.
More: http://api.jquery.com/jquery.data/
*/
            $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
    });
/*
"return this;" returns the original jQuery object. This allows additional jQuery methods to be chained.
*/
    return this;
};
```

Attach the default plugin options directly to the plugin object. This allows users to override default plugin options globally,instead of passing the same option(s) every time the plugin is initialized.
For example, the user could set the "property" value once for all instances of the plugin with
`$.fn.pluginName.defaults.property = 'myValue';`. Then, every time plugin is initialized, property" will be set to "myValue".
More: http://learn.jquery.com/plugins/advanced-plugin-concepts/

```js
$.fn[pluginName].defaults = {
    property: 'value',
    onComplete: null
};
})(jQuery, window, document); //closing the closure 
```

## LICENSE
[The Unlicense](https://github.com/sid04naik/jquery.plugin-boilerplate/blob/master/LICENSE)
