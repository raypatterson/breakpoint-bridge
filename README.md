Breakpoint Bridge
=================

This collection of CSS and JavaScript and [Compass](http://compass-style.org/) extensions allows global CSS breakpoints to be defined within CSS and trigger events with in application JavaScript when they are matched and exited from.

The breakpoints are defined using the [Breakpoint](http://breakpoint-sass.com/) and [Slicer](https://github.com/lolmaus/breakpoint-slicer) Compass extensions and events are handled by the [js-breakpoints](https://github.com/14islands/js-breakpoints) library JavaScript and SASS. There is also some JavaScript and SASS extracted from the [Unison.js](http://bjork24.github.io/Unison/) library at play.

The top of the view port is a debugging message to indicate which breakpoint is active. The color changes indicate that the breakpoint name has been added to the 'body' as a CSS class.

Within the console are logs which show the events within JavaScript correspond to the changes in the visual styling of the page.

---

To install dependencies and compile the SASS source files: `$ ./setup`

To run a local HTTP server: `$ ./run`

---

License MIT
