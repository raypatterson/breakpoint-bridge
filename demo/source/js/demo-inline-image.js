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

    $img.attr('src', '../img/' + this.name + '.jpg');

  }, function() {

    console.log("Breakpoint : exit", this);

  });

}(this.jQuery, this, this.document));