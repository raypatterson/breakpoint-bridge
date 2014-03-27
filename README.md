#[Breakpoint Bridge](http://raypatterson.github.io/breakpoint-bridge/)

##What does it do?

Breakpoint Bridge allows breakpoints to be defined within SASS and trigger _match_ and _exit_ events in JavaScript.

###Get Started

From the command line: `$ ./setup`

This will install all the necessary [Gulp](http://gulpjs.com/) plugins in order to run the demo at [http://localhost:8888](http://localhost:8888).

After running the setup once you can run the demo any time with: `$ gulp`

##How does it work?

Breakpoints are defined in SASS. They are listed in ascending order and passed into a mixin along with a unique string identifier. The string identifier is necessary to associate the breakpoints with an HTML element in the JavaScript. 

###Example

####HTML
```html
<html>
  <head>
      <!-- Represents the compiled SASS below -->
      <link rel="stylesheet" href="css/demo.css">
  </head>
  <body>
  	<!-- This is the element to assign breakpoints -->
    <div class="some element">
    	...
    </div>
  	<!-- Add JavaScript Breakpoints library as a dependency -->
    <script src="../../vendor/js-breakpoints/breakpoints.js"></script>
  	<!-- Add Breakpoint Bridge -->
    <script src="../../library/breakpoint-bridge.js"></script>
  </body>
</html>

```

####SCSS
```scss
.some.element {

  $breakpoint-list:
         "small-element"    800px   //      0px    <--     800px
        "medium-element"   1100px   //    801px    <-->    1100px
         "large-element"  99999px   //   1101px     -->    To infinity…
  ;
  
  // Add breakpoints and associate them with a unique ID for this element.
  @include breakpoint-bridge( $breakpoint-list, 'some-element' ); 
}
```

####JavaScript
```javascript
window.BreakpointBridge.activate(

  'some-element', // The unique ID

  $('.some.element'), // The element

  function() {
    // Handle breakpoint match event
    this.name; // The name of the matched breakpoint
  }, 

  function() {
    // Handle breakpoint exit event
    this.name; // The name of the exited breakpoint
  }
);

```


##What can I use it for?

#####A few possible use cases have been demonstrated.

### Adding and Removing CSS Classes

Being able to control the view state based on the active breakpoint can be quite useful. In order to demonstrate this ability, elements are assigned a unique background color for each breakpoint. 

This works by passing each element breakpoint list to a SASS [mixin](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/sass/_demo-styles.scss#L1-L12) which iterates though the list, creates a class name from the breakpoint name and then defines a unique background color for the class.

With the CSS rules defined for the element, it is now only a matter of creating a JavaScript [event handler for when a breakpoint is matched.](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/js/demo.js#L14-L21) Within the scope of this handler, the name of the matched breakpoint is available, and so by [adding the name as class attribute,](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/js/demo.js#L19) the background color may be updated.

The class may be removed in the same way in an [event handler for when a breakpoint is exited.](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/js/demo.js#L23-L29)

### Responsive Image Loading

With so many solutions for handling the loading of images based on screen this may seem like a redundant feature, however it is very simple to set up and does keep everything defined in CSS, which is the primary goal.

With some additional JavaScript, This same technique could be extended to update an image tag source, but for the purposes of this demo we are only dealing with updating the CSS background image of an element.

This works technique works _exactly_ the same way as the previous demo in which we are changing the background color values based on the active breakpoint. The only subtle difference is that the values are not randomly generated, but [defined explicitly.](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/sass/_demo-styles.scss#L90-L104) With an image naming convention that corresponds to the breakpoint names it is possible to abstract this further into a SASS mixin.

### Controlling Process State

There are some cases in which you may wish to update the state of a process based on the active breakpoint. Using [a timeout](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/js/demo.js#L55-L58), a repeating, asynchronous event is simulated. This may represent an event that consumes resources, incurs bandwidth costs or is related to content within a module which is not accessible on devices with smaller screens. 

By inspecting the name of the breakpoint in an event handler when it is matched, the process state can be, in this case, [enabled or disabled](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/js/demo.js#L72-L80).

In addition, view states which may require JavaScript to achieve can be updated based on the active breakpoint using this technique.

##Is there something you're not telling us?

#####The [limitations](https://github.com/14islands/js-breakpoints#limitations) of JavaScript Breakpoints are also limitations of Breakpoint Bridge.

Breakpoints are matched _from_ the value of the previous breakpoint + 1px _to_ their value. When their value is exceeded by 1px _or_ when the value of the next smallest is entered, they are exited. This exposes two issues, one of which may not be obvious.

The first breakpoint does not have a smaller value. To compensate for this, it is matched between 0px and its value.

The last breakpoint does not have a larger value. No breakpoint is matched when its value is exceeded and it is exited. To compensate for this, the largest breakpoint can be *"infinite"*. This value is represented in the demo code base as 99999px.

In the following example the "large" breakpoint will exit at 1401px:

```scss
$breakpoint-list:
   "small"    800px,   //    0px    <--     800px
  "medium"   1100px,   //  801px    <-->    1100px
   "large"   1400px,   // 1101px    <-->    1400px
;
```

Adding an additional *"infinite"* upper limit yeilds the following:

```scss
$breakpoint-list:
   "small"    800px,   //    0px    <--     800px
  "medium"   1100px,   //  801px    <-->    1100px
   "large"   1400px,   // 1101px    <-->    1400px
"infinite"  99999px,   // 1401px     -->    basically infinity :)
;
```


##Why does it exist?

#####This system is in response to three different projects to which it owes thanks and inspiration.

###[Simple State Manager](http://www.simplestatemanager.com/)

Simple State Manager allows media queries within JavaScript. It's not associated with CSS in any way, however the API, event and plugin systems are influential.

###[Unison](http://bjork24.github.io/Unison/)

Unison allows breakpoints defined in SASS (as well as LESS and Stylus) to be accessed from JavaScript, however it does not provide events. It is also limited to a single set of global breakpoints. It is worth mentioning that the means by which Breakpoint Bridge accesses the breakpoint data object from the value of the `<head>` element `font-face` is [borrowed directly from Unison](https://github.com/bjork24/Unison/blob/master/css/_breakpoints.scss#L34-L39).

###[JavaScript Breakpoints](https://github.com/14islands/js-breakpoints)

Breakpoint Bridge is essentially an elaboration on JavaScript Breakpoints. What Breakpoint Bridge provides is a means by which breakpoints can be more easily defined in SASS and accessed in JavaScript, but without JavaScript Breakpoints as a dependency, Breakpoint Bridge would not be possible. 

---

License [MIT](https://raw.github.com/RayPatterson/breakpoint-bridge/master/LICENSE)
