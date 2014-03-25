/*global window:true */

window.Breakpoints = (function (window, document) {
	'use strict';

	var B = {},
	resizingTimeout = 200,
	breakpoints = [],
	hasFullComputedStyleSupport = false,

	TEST_FULL_GETCOMPUTEDSTYLE_SUPPORT = 'js-breakpoints-getComputedStyleTest',
	TEST_FALLBACK_PROPERTY = 'position',
	TEST_FALLBACK_VALUE = 'absolute',

	// thanks John Resig
	addEvent = function (obj, type, fn) {
	  if (obj.attachEvent) {
	    obj['e'+type+fn] = fn;
	    obj[type+fn] = function () {obj['e'+type+fn]( window.event );};
	    obj.attachEvent('on'+type, obj[type+fn]);
	  } else {
	    obj.addEventListener(type, fn, false);
	  }
	},

	debounce = function (func, wait, immediate) {
		var timeout, result;
		return function() {

			var context = this, args = arguments;
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

	injectElementWithClassName = function (parent, className, callback) {
		var div = document.createElement('div');
		div.className = 'js-breakpoints-' + className;
		parent.appendChild(div);
		callback(div);
		div.parentNode.removeChild(div);
	},

	check = function (breakpoint) {
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

	onWindowResize = function () {
		for( var i = 0; i < breakpoints.length; i++ ) {
			check(breakpoints[i]);
		}
	},

	getStyle = function (el, pseudo, property) {
		if (window.getComputedStyle) {
			return window.getComputedStyle(el, pseudo).getPropertyValue(property);
		}
		else if (el.currentStyle && pseudo.length === 0) {
			return el.currentStyle[property];
		}
		return '';
	},

	checkComputedStyleSupport = function () {
		if (window.getComputedStyle) {
			var content = window.getComputedStyle(document.documentElement, ':after').getPropertyValue('content');
			hasFullComputedStyleSupport = content.replace(/\"/g, "") === TEST_FULL_GETCOMPUTEDSTYLE_SUPPORT;
		}
	},

	init = function () {
		checkComputedStyleSupport();
		var debounceResize = debounce( onWindowResize, resizingTimeout);
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
		}
		else {
			injectElementWithClassName(el, breakpoint.name, function (el) {
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

	B.off = function (breakpoint) {
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
/**
 * Updating an element background image by adding and removing CSS classes.
 */

;
(function($, window, document, undefined) {

  'use strict';

  window.BreakpointBridge.activate('background-image', $('.background-image'), function() {

    console.log("Breakpoint : matched", this);

    $(this.el).addClass(this.name);

  }, function() {

    console.log("Breakpoint : exit", this);

    $(this.el).removeClass(this.name);

  });

}(this.jQuery, this, this.document));
/**
 * Updating an inline image element by assiging the image tag 'src' attribute.
 */

;
(function($, window, document, undefined) {

  'use strict';

  var $el = $('.inline-image');
  var $img = $el.children('img');

  window.BreakpointBridge.activate('inline-image', $el, function() {

    console.log("Breakpoint : matched", this);

    $img.attr('src', 'img/' + this.name + '.jpg');

  }, function() {

    console.log("Breakpoint : exit", this);

  });

}(this.jQuery, this, this.document));
/**
 * Enabling and disabling a JavaScript process.
 */

;
(function($, window, document, undefined) {

  'use strict';

  var $el = $('.process-state');
  var $debug = $el.children('.debug');
  var count = 0;
  var process;

  var enableProcess = function() {

    $debug.html('process ' + count + ' enabled');

    $('<div class="process process-' + count + '" style="left:' + Math.floor(Math.random() * 100) + '%;"></div>')
      .appendTo($el)
      .animate({
        'opacity': '0',
        'top': '0%'
      }, {
        duration: Math.floor(Math.random() * 250) + 250,
        complete: function() {
          $(this).remove();
        }
      });

    process = setTimeout(function() {
      count++;
      enableProcess();
    }, Math.floor(Math.random() * 50) + 50);
  };

  var disableProcess = function() {

    $debug.html('process ' + count + ' disabled');

    clearTimeout(process);
  };

  window.BreakpointBridge.activate('process-state', $el, function() {

    console.log("Breakpoint : matched", this);

    if (this.name.match(/enable/gi)) {

      enableProcess();

    } else {

      disableProcess();

    }

  }, function() {

    console.log("Breakpoint : exit", this);

  });

}(this.jQuery, this, this.document));