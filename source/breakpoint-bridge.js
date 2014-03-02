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