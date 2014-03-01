;
(function($, window, document, undefined) {

  'use strict';

  /**
   * Extract map of all breakpoints and
   * selectors from the <head> 'font-family'.
   */
  var map = $('head')
    .css('font-family')
    .replace(/'/g, '')
    .split(' "||" ');

  var breakpoints;
  var selector;
  var $el;
  var el;
  var arr;
  var bp = {};

  $.each(map, function(key, val) {

    /**
     * Parse breakpoints from map.
     */
    arr = val.split(' "|" ');
    breakpoints = arr.pop().replace(/"/g, '').split(' ');

    /**
     * Parse selector from map.
     */
    selector = arr.pop().replace(/"/g, '');
    $el = $(selector);
    el = $el[0];

    /**
     * Use element as key to access breakpoints.
     */
    bp[el] = breakpoints;

    /**
     * Create interface.
     */
    var BreakpointBridge = window.BreakpointBridge || {};

    BreakpointBridge.activate = function(el, matched, exit) {

      /**
       * Un-jQuery-ify.
       */
      if (el instanceof $) {
        el = el[0];
      }

      var breakpoints = bp[el];

      if (breakpoints !== undefined) {
        /**
         * Iterate though breakpoints and apply event handlers.
         */
        $.each(breakpoints, function(key, val) {
          Breakpoints.on({
            name: val,
            el: el,
            matched: matched,
            exit: exit
          });
        });
      } else {
        /**
         * Breakpoints are undefined for this element.
         */
      }
    };

    /**
     * Expose interface.
     */
    window.BreakpointBridge = BreakpointBridge;
  });

}(this.jQuery, this, this.document));