;
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