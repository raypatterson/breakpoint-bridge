#[Breakpoint Bridge](http://raypatterson.github.io/breakpoint-bridge/)

##What does it do?

Breakpoint Bridge allows breakpoints to be defined within SASS and trigger _match_ and _exit_ events in JavaScript.

<iframe width="560" height="315" src="//www.youtube.com/embed/YX3QUPNBeTE?rel=0" frameborder="0" allowfullscreen></iframe>

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
    <!-- This example uses jQuery -->
    <script src="//code.jquery.com/jquery-2.1.0.min.js"></script>
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
    "small"     800px,    //      0px    <-->    800px
    "medium"    1100px,   //    801px    <-->    1100px
    "large"     1800px    //   1101px    <-->    1800px
   ;
  
  // Add breakpoints and associate them with a unique ID for this element.
  @include breakpoint-bridge( $breakpoint-list, 'some-element' ); 
}
```

> You may be asking, "What comes after the 'large' breakpoint from '1801px' to … Infinity?" 
> 
> Well that's a good question! 
>
> The answer is the ["Infinity"](#infinity) breakpoint.

####JavaScript
```javascript
window.BreakpointBridge.activate(

  'some-element', // The unique ID

  $('.some.element'), // The element (name is arbitrary)

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

#####A few possible use cases have been demonstrated. Each case attempts to demonstate a practical use, however it should be understood that the intention is to prove a concept and not to offer production ready solutions to problems of responsive web design.

### Responsive Image Loading by Adding and Removing CSS Classes

[SASS](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/sass/_demo-background-image.scss) | [JavaScript](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/js/demo-background-image.js)

Being able to control the view state based on the active breakpoint can be quite useful. In order to demonstrate this ability, an element background image is updated for each breakpoint. 

This works by passing each element breakpoint list to a SASS mixin which iterates though the list, creates a class name from the breakpoint name and then defines a unique background image for the class.

With the CSS rules defined for the element, it is now only a matter of creating a JavaScript event handler for when a breakpoint is matched. Within the scope of this handler, the name of the matched breakpoint is available, and so by adding the name as class attribute, the background image may be updated.

It is worth noting that naming conventions in which the image names match the breakpoint names and the image folder name matched the breakpoint ID come into play to make the code more streamlined.

The class may be removed in the same way in an event handler for when a breakpoint is exited.

### Responsive Image Loading by Updating the IMG Tag SRC Attribute

[SASS](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/sass/_demo-inline-image.scss) | [JavaScript](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/js/demo-inline-image.js)

This demo is very similar to the last in behaviour, however the underling code is slightly different.

With this technique we are not creating CSS classes with background image rules but rather updating the image tag source within a similar Javacript event handler.

Again, it is worth menioning how the naming conventions are being used to keep the code at a minimum.

### Controlling JavaScript Process State

[SASS](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/sass/_demo-process-state.scss) | [JavaScript](https://github.com/RayPatterson/breakpoint-bridge/blob/master/demo/source/js/demo-process-state.js)

There are some cases in which you may wish to update the state of a process based on the active breakpoint. Using a timeout, a repeating, animation event is simulated. This represents an event that consumes resources and is related to content within a module which may not be visible on smaller screens. 

By inspecting the name of the breakpoint in an event handler when it is matched, the process can be enabled or disabled.

View layout, animation or asset loading states which may only be achieved with JavaScript can be updated based on the active breakpoint using this technique.

##Is there something you're not telling us?

**The [limitations](https://github.com/14islands/js-breakpoints#limitations) of JavaScript Breakpoints are also limitations of Breakpoint Bridge.**

Breakpoints are matched _from_ the value of the previous breakpoint + 1px _to_ their value. When their value is exceeded by 1px _or_ when the value of the next smallest is entered, they are exited. This exposes two issues, one of which may not be obvious.

###Dealing with Zero

The first breakpoint does not have a smaller value. To compensate for this, it is matched between 0px and its value.

<a name="infinity"></a>
###Dealing with Infinity

The last breakpoint does not have a larger value. To compensate for this, a breakpoint is automatically added after the last, largest breakpoint and is called *"infinite"*. This value is represented as 99999px.

In the following example, if not for the "infinite" breakpoint, the "large" breakpoint will exit at 1401px and no breakpoint would be matched:

```scss
$breakpoint-list:
   "small"    800px,    //    0px    <-->    800px
   "medium"   1100px,   //  801px    <-->    1100px
   "large"    1400px    // 1101px    <-->    1400px
;
```

Behind the scenes, by adding an additional *"infinite"* upper limit yeilds the following:

```scss
$breakpoint-list:
   "small"       800px,     //    0px    <-->    800px
   "medium"      1100px,    //  801px    <-->    1100px
   "large"       1400px,    // 1101px    <-->    1400px
   "infinite"    99999px    // 1401px     -->    basically infinity :)
;
```


##Why does it exist?

#####This system is in response to three different projects to which it owes thanks and inspiration.

###[Simple State Manager](http://www.simplestatemanager.com/)

Simple State Manager allows media queries within JavaScript. It's not associated with CSS in any way, however the API, event and plugin systems are influential.

###[Unison](http://bjork24.github.io/Unison/)

Unison allows breakpoints defined in SASS (as well as LESS and Stylus) to be accessed from JavaScript, however it does not provide events. It is also limited to a single set of global breakpoints. It is worth mentioning that the means by which Breakpoint Bridge accesses the breakpoint data object from the value of the `<head>` element `font-face` is [borrowed directly from Unison](https://github.com/bjork24/Unison/blob/master/css/_breakpoints.scss#L34-L39).

###[JavaScript Breakpoints](https://github.com/14islands/js-breakpoints)

Breakpoint Bridge is essentially a wrapper for JavaScript Breakpoints. What Breakpoint Bridge provides is a means by which breakpoints can be more easily defined in SASS and accessed in JavaScript, but without JavaScript Breakpoints as a dependency, Breakpoint Bridge would not be possible. 

---

License [MIT](https://raw.github.com/RayPatterson/breakpoint-bridge/master/LICENSE)
