# Bread.js

Bread is a JS library to help Developers who wants to include animations or some interaction using HTML5 Canvas.
Acoording to its philosophy, Bread allows you to create a 'world' or 'universe', then you can create bodies, give them
a shape and add them to the 'universe'.
With the main module you can create 'universe' objects and 'body' objects, these are parent modules.
Rectangles, Circles, Sprites, etc, are descendents of Body and they are attached to the behaviour of Body.

## Dependencies:
- bread.js

  - universe.js

  - body.js

  	- point.js

  		- line.js

    		- rectangle.js

    	- arc.js

    		- circle.js


**Note: Take into account dependencies.**

### Examples

If you want to view my examples follow these steps:

* You must have installed Node.js (https://nodejs.org/en/) and Node Package Manager
* Run: ```npm install```
* Then execute ```grunt```
* Visit http://localhost:8001/


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
