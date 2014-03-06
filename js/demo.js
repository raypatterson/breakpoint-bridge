/*global window:true */

window.Breakpoints = (function(window, document) {
		'use strict';

		var B = {},
				resizingTimeout = 200,
				breakpoints = [],
				hasFullComputedStyleSupport = false,

				TEST_FULL_GETCOMPUTEDSTYLE_SUPPORT = 'js-breakpoints-getComputedStyleTest',
				TEST_FALLBACK_PROPERTY = 'position',
				TEST_FALLBACK_VALUE = 'absolute',

				// thanks John Resig
				addEvent = function(obj, type, fn) {
						if (obj.attachEvent) {
								obj['e' + type + fn] = fn;
								obj[type + fn] = function() {
										obj['e' + type + fn](window.event);
								};
								obj.attachEvent('on' + type, obj[type + fn]);
						} else {
								obj.addEventListener(type, fn, false);
						}
				},

				debounce = function(func, wait, immediate) {
						var timeout, result;
						return function() {

								var context = this,
										args = arguments;
								var later = function() {
										timeout = null;
										if (!immediate) result = func.apply(context, args);
								};

								var callNow = immediate && !timeout;
								clearTimeout(timeout);
								timeout = setTimeout(later, wait);
								if (callNow) result = func.apply(context, args);
								return result;
						};
				},

				injectElementWithClassName = function(parent, className, callback) {
						var div = document.createElement('div');
						div.className = 'js-breakpoints-' + className;
						parent.appendChild(div);
						callback(div);
						div.parentNode.removeChild(div);
				},

				check = function(breakpoint) {
						var match = B.isMatched(breakpoint);

						if (match && !breakpoint.isMatched) {
								breakpoint.matched.call(breakpoint.context);
								breakpoint.isMatched = true;
						} else if (!match && breakpoint.isMatched) {
								breakpoint.exit.call(breakpoint.context);
								breakpoint.isMatched = false;
						}
						return breakpoint;
				},

				onWindowResize = function() {
						for (var i = 0; i < breakpoints.length; i++) {
								check(breakpoints[i]);
						}
				},

				getStyle = function(el, pseudo, property) {
						if (window.getComputedStyle) {
								return window.getComputedStyle(el, pseudo)
										.getPropertyValue(property);
						} else if (el.currentStyle && pseudo.length === 0) {
								return el.currentStyle[property];
						}
						return '';
				},

				checkComputedStyleSupport = function() {
						if (window.getComputedStyle) {
								var content = window.getComputedStyle(document.documentElement, ':after')
										.getPropertyValue('content');
								hasFullComputedStyleSupport = content === TEST_FULL_GETCOMPUTEDSTYLE_SUPPORT;
						}
				},

				init = function() {
						checkComputedStyleSupport();
						var debounceResize = debounce(onWindowResize, resizingTimeout);
						addEvent(window, 'resize', debounceResize);
						addEvent(window, 'orientationchange', debounceResize);
						return B;
				};

		B.isMatched = function(breakpoint) {
				var el = breakpoint.el || document.body,
						matched = false,
						value;

				if (hasFullComputedStyleSupport) {
						value = getStyle(el, ':after', 'content');
						matched = value.replace(/\"/g, "") === breakpoint.name;
				} else {
						injectElementWithClassName(el, breakpoint.name, function(el) {
								value = getStyle(el, '', TEST_FALLBACK_PROPERTY);
								matched = value === TEST_FALLBACK_VALUE;
						});
				}

				return matched;
		};

		B.on = function(breakpoint) {
				breakpoints.push(breakpoint);
				breakpoint.isMatched = false;
				breakpoint.matched = breakpoint.matched || function() {};
				breakpoint.exit = breakpoint.exit || function() {};
				breakpoint.context = breakpoint.context || breakpoint;
				return check(breakpoint);
		};

		B.off = function(breakpoint) {
				var i = breakpoints.indexOf(breakpoint);
				if (i > -1) {
						breakpoints.splice(i, 1);
				}
		};

		return init();

})(window, document);
;
(function(window, document, undefined) {

  'use strict';

  // Extract map of all breakpoints and
  // selectors from the <head> 'font-family'.
  var getStyle = function(el, styleProp) {
    if (el.currentStyle) {
      return el.currentStyle[styleProp];
    } else if (window.getComputedStyle) {
      return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    }
  };

  var map = (getStyle(document.getElementsByTagName('head')[0], 'font-family'))
    .replace(/'/g, '')
    .split(' "||" ');

  var breakpoints;
  var val;
  var arr;
  var id;
  var bp = {};
  var i = 0;
  var I = map.length;

  for (i; i < I; i++) {

    val = map[i];

    // Parse breakpoints from map.
    arr = val.split(' "|" ');
    breakpoints = arr.pop().replace(/"/g, '').split(' ');

    // Parse selector from map.
    id = arr.pop().replace(/"/g, '');

    // Use element as key to access breakpoints.
    bp[id] = breakpoints;
  }

  // Create interface.
  var BreakpointBridge = window.BreakpointBridge || {};

  BreakpointBridge.activate = function(id, el, matched, exit) {

    // Un-$-ify.
    if (el instanceof $) {
      el = el[0];
    }

    breakpoints = bp[id];

    if (breakpoints !== undefined) {

      // Iterate though breakpoints and apply event handlers.
      $.each(breakpoints, function(key, val) {
        Breakpoints.on({
          name: val,
          el: el,
          matched: matched,
          exit: exit
        });
      });
    } else {

      // Breakpoints are undefined for this element.
    }
  };

  // Expose interface.
  window.BreakpointBridge = BreakpointBridge;

}(this, this.document));
;

/**
 * Updating content.
 * Adding and removing a CSS class.
 */

(function($, window, document, undefined) {

  'use strict';

  var $el;

  var matched = function() {

    console.log("Breakpoint : matched", this);

    $el = $(this.el);
    $el.addClass(this.name);
    $el.children('.debug').html(this.name);
  };

  var exit = function() {

    console.log("Breakpoint : exit", this);

    $el = $(this.el);
    $el.removeClass(this.name);
  };

  window.BreakpointBridge.activate('body', $('body')[0], matched, exit);
  window.BreakpointBridge.activate('header', $('.header'), matched, exit);
  window.BreakpointBridge.activate('aside', $('.aside'), matched, exit);
  window.BreakpointBridge.activate('article', $('.article'), matched, exit);

}(this.jQuery, this, this.document));

/**
 * Enabling and disabling a process.
 */

(function($, window, document, undefined) {

  'use strict';

  var $el = $('.article .process');
  var $debug = $el.children('.debug');
  var count = 0;

  var process;

  var startProcess = function() {

    $debug.html('process executing : ' + (count++));

    process = setTimeout(startProcess, 2000);
  };

  var stopProcess = function() {

    $debug.html('process stopped : ' + count);

    clearTimeout(process);
  };

  window.BreakpointBridge.activate('process', $el, function() {

    console.log("Breakpoint : matched", this);

    if (this.name.match(/disable/gi)) {

      stopProcess();

    } else if (this.name.match(/enable/gi)) {

      startProcess();
    }

  }, function() {

    console.log("Breakpoint : exit", this);

  });

}(this.jQuery, this, this.document));