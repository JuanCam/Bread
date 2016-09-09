# Bread.js

Bread is a JS library to help Developers who wants to include animations or some interaction using HTML5 Canvas.
Acoording to its philosophy, Bread allows you to create a 'world' or 'universe', then you can create bodies, give them
a shape and add them to the 'universe'.
The main module is with this module you can create 'universe' objects and 'body' objects, these are parent modules
Rectangles, Circles, Sprites, etc, are descendents of 'body' and they are attached to the behaviour of 'body'.

## Dependencies:
- bread.js

  - universe.js

  - body.js

    - rectangle.js

    - circle.js


**Note: Remember that rectangle and circle depends on Body so they must be included after body.js**

## Getting started
First of all fork or clone this repo, you will find the source code in the app/src folder, **Please include all files
since in this moment the project is in development stage**.
Once you have the source code, copy the src folder and place it inside a js/bread folder in your project files 
(this is according to your folder structure), then include all src files (Remember dependencies) and inside 
any html file create a canvas element.
```
<canvas id="canvas_el"></canvas>
```
Create a universe by calling the 'universe' method from the Bread object, you must pass as an argument to this method an 
object that contains 2 properties: the **el** property and the frame rate (in case you want to make an animation).
```javascript
var canvas = document.getElementById('canvas_el');
var firstUniverse = Bread.universe({
    el: canvas,
    frate: 1000 / 24
});
```
