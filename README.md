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


```scss
.some.element {

  $breakpoint-list:
         "small-element"   800px    //      0px    <--     800px
        "medium-element"   1100px   //    801px    <-->    1100px
         "large-element"  99999px   //   1101px     -->    To infinity…
  ;
  
  // Add breakpoints and associate them with a unique ID for this element.
  @include breakpoint-bridge( $breakpoint-list, 'some-element' ); 
}
```


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

### Responsive Image Loading

_Coming soon..._

### Adding and Removing CSS Classes

_Coming soon..._

###Adding and Removing HTML Content

_Coming soon..._

##Is there something you're not telling us?

#####The [limitations](https://github.com/14islands/js-breakpoints#limitations) of JavaScript Breakpoints are also limitations of Breakpoint Bridge.

Breakpoint lists need to defined and serialized _before_ being stored in the `<head>` element `font-face`. To compansate for this, the assigment happens in a separate [breakpoint-bridge-init.scss](https://github.com/RayPatterson/breakpoint-bridge/blob/master/library/breakpoint-bridge-init.scss) file. It is recommended that this file be [the last import](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/sass/demo.scss#L4) to ensure that all breakpoint lists are added.

Breakpoints are matched _from_ the value of the previous breakpoint + 1px _to_ their value. When their value is exceeded by 1px _or_ when the value of the next smallest is entered, they are exited. This exposes two issues, one of which may not be obvious.

The first breakpoint does not have a smaller value. To compansate for this, it is matched between 0px and its value.

The last breakpoint does not have a larger value. No breakpoint is matched when its value is exceeded and it is exited. To compansate for this, the largest breakpoint can be *"infinite"*. This value is represented in the demo code base as 99999px.

In the following example the "large" breakpoint will exit at 1401px:

```scss
$breakpoint-list:
   "small"   800px,    //    0px    <--     800px
  "medium"   1100px,   //  801px    <-->    1100px
   "large"   1400px,   // 1101px    <-->    1400px
;
```

Adding an additional *"infinite"* upper limit yeilds the following:

```scss
$breakpoint-list:
   "small"   800px,    //    0px    <--     800px
  "medium"   1100px,   //  801px    <-->    1100px
   "large"   1400px,   // 1101px    <-->    1400px
"infinite"  99999px,   // 1401px     -->    basically infinity :)
;
```


##Why does it exist?

#####This system is in reponse to three different projects to which it owes thanks and inspriration.

###[Simple State Manager](http://www.simplestatemanager.com/)

Simple State Manager allows media queries within JavaScript. It's not associated with CSS in any way, however the API, event and plugin systems are influencial.

###[Unison](http://bjork24.github.io/Unison/)

Unison allows breakpoints defined in SASS (as well as LESS and Stylus) to be accessed from JavaScript, however it does not provide events. It is also limited to a single set of global breakpoints. It is worth mentioning that the means by which Breakpoint Bridge accesses the breakpoint data object from the value of the `<head>` element `font-face` is [borrowed directly from Unison](https://github.com/bjork24/Unison/blob/master/css/_breakpoints.scss#L34-L39).

###[JavaScript Breakpoints](https://github.com/14islands/js-breakpoints)

Breakpoint Bridge is essentially an elaboration on Javascript Breakpoints. What Breakpoint Bridge provides is a means by which breakpoints can be more easily defined in SASS and accessed in JavaScript, but without JavaScript Breakpoints as a dependency, Breakpoint Bridge would not be possible. 

---

License [MIT](https://raw.github.com/RayPatterson/breakpoint-bridge/master/LICENSE)
