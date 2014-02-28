;
(function(window, $) {

  var $el = $('body');

  var el = $el[0];

  var breakpoints = $('head')
    .css('font-family')
    .replace(/"/g, '')
    .replace(/'/g, '')
    .split(' ');

  var getBreakpointClassName = function(val) {
    return 'breakpoint-' + val;
  };

  $.each(breakpoints, function(key, val) {

    Breakpoints.on({
      name: val,
      el: el,
      matched: function() {

        console.log("Breakpoint : matched :", val);

        $el.addClass(getBreakpointClassName(val));
      },
      exit: function() {

        console.log("Breakpoint : exit :", val);

        $el.removeClass(getBreakpointClassName(val));
      }
    });
  });

}(this, this.jQuery));