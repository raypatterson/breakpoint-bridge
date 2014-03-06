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

  var process;

  var startProcess = function() {

    console.log('process begin');

    process = setInterval(function() {

      console.log('process complete');

    }, 2000);
  };

  var stopProcess = function() {

    console.log('process stop');

    clearInterval(process);
  };

  window.BreakpointBridge.activate('process', $('.article .process'), function() {

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