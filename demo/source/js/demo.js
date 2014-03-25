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
  window.BreakpointBridge.activate('aside', $('.aside'), matched, exit);
  window.BreakpointBridge.activate('article', $('.article'), matched, exit);

}(this.jQuery, this, this.document));

/**
 * Updating an inline image
 */

(function($, window, document, undefined) {

  'use strict';

  var $el = $('.article');
  var $img = $el.children('img');

  window.BreakpointBridge.activate('article', $el, function() {

    console.log("Breakpoint : matched", this);

    $img.attr('src', '/img/' + this.name + '.jpg');

  }, function() {

    console.log("Breakpoint : exit", this);

  });

}(this.jQuery, this, this.document));

/**
 * Enabling and disabling a process.
 */

(function($, window, document, undefined) {

  'use strict';

  var $el = $('.header');
  var $debug = $el.children('.debug');
  var count = 0;
  var process;

  var enableProcess = function() {

    $debug.html('process ' + count + ' enabled');

    process = setTimeout(function() {
      count++;
      enableProcess();
    }, 2000);
  };

  var disableProcess = function() {

    $debug.html('process ' + count + ' disabled');

    clearTimeout(process);
  };

  window.BreakpointBridge.activate('process', $el, function() {

    console.log("Breakpoint : matched", this);

    if (this.name.match(/disable/gi)) {

      disableProcess();

    } else if (this.name.match(/enable/gi)) {

      enableProcess();

    }

  }, function() {

    console.log("Breakpoint : exit", this);

  });

}(this.jQuery, this, this.document));