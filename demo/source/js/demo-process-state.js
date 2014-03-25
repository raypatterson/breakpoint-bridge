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

    process = setTimeout(function() {
      count++;
      enableProcess();
    }, 2000);
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