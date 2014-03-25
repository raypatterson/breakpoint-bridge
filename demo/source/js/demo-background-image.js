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