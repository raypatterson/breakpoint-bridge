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

    if (this.name.match(/disable/gi)) {

      disableProcess();

    } else {

      enableProcess();

    }

  }, function() {

    console.log("Breakpoint : exit", this);

  });

}(this.jQuery, this, this.document));