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

#### Examples

If you want to view or extend my examples go to the **app** folder and follow these steps:

* You must have installed Node.js (https://nodejs.org/en/) and Node Package Manager
* Run: ```npm install```
* Execute ```grunt lift```
* Visit http://localhost:8001/
* You can check the app/app.js file.

If you want to use the library externally, use the file in the dist folder.

## Factories

The library provides a set of factories which provides a handy way to create objects. You may also create objects if 
you invoke their class. I.E. if we want to create a body of type circle, we can do it like this:
```javascript
var firstPoint = Bread.circle({
	x: 4, 
	y: 5, 
	angle: 3.1416,
	radius: 10,
	fill:false
});
```
or 

```javascript
var firstPoint = new Bread.Circle({
    x: 4,
    y: 5,
    angle: 3.1416 
});
firstPoint.defRaduis = 10;
firstPoint.fill = false;
```
The factories available are the following ones:
- universe.
- point.
- circle.
- rectangle.
- line.
- arc.
- groups.

## Getting started

First of all fork or clone this repo, you will find the source code in the app/src folder, **Please include all files
since in this moment the project is in development stage**.
Once you have the source code, copy the src folder and place it inside a js/bread folder in your project files 
(this is according to your folder structure), then include all src files (Remember dependencies) and inside 
any html file create a canvas element.
```
<canvas id="canvas_el"></canvas>
```

### - Universe

Create a universe by calling the universe factory from the Bread object, you must pass as an argument to this method an 
object that contains 2 properties: the **el** property and the frame rate (in case you want to make an animation).
```javascript
var canvas = document.getElementById('canvas_el');
var firstUniverse = Bread.universe({
    el: canvas,
    frate: 1000 / 24
});
```

##### Attributes

 - **el:** Is the canvas HTML element.
 - **frate:** Frame rate for the animation.

##### Methods

 - **addIt:** Adds a body to the universe, this allows the vody to be rendered in the canvas element:

 	```javascript
 	firstUniverse.addIt(body);
 	```
 	
 	body: Is an object of body type. (view the Body documentation)
 - **addGroup:** Adds a group of bodies, it recieves an array of bodies or group (Groups will be covered latter)

 	```javascript
 	firstUniverse.addGroup([body1, body2, ...]);
 	```

 - **removeIt:** Adds a body from the universe:

 	```javascript
 	firstUniverse.removeIt(body);
 	```
 	
 	body: Is an object of body type. (view the Body documentation)
 - **animation:** Animates the universe using setTimeout. It takes a callback function were you put all the code you want to be animated

 	```javascript
 	firstUniverse.animation(function() {..})
 	```


### - Body

Body is the core or the base of all objects that are going to be used inside the universe, it provides some generic methods
that all bodies share (accelerate, move, etc).

You may extend this class to your own classes.

```javascript
var MyMixin = function () {...}
MyMixin.prototype = {...};
var Body = Bread.Body;
var MyCustomBody =  Bread.augment(Body, [MyMixin]);
```

##### Attributes

 This attributes are the same for all bodies.

 - **x:** position in x.
 - **y:** position in y.
 - **xspeed:** speed over the x axis.
 - **yspeed:** speed over the y axis.
 - **speed:** body speed.
 - **angle:** body angle.
 - **friction:** body friction.

##### Methods

This methods can be found on all bodies.

 - **accelerate:** sets an acceleration to the body, it receives 2 arguments:

 	```javascript
 	var accx = 0.1;
 	var accy = 0.2;
 	body.accelerate(accx, accy);
 	```
 	
 	accx: Is the increment of the speed over the x axis (type number)
 	
 	accy: Is the increment of the speed over the y axis (type number)
 - **bounce:** makes a body bounce by modifying its speed

 	```javascript
 	var bnx = 0.1;
 	var bny = 0.2;
 	body.bounce(bnx, bny);
 	```
 	
 	bnx: Is the speed over the x axis (type number)
 	
 	bny: Is the speed over the y axis (type number)
 - **impulse:** changes the body direction and speed, also specifies a friction

 	```javascript
 	var speed = 0.1;
 	var frict = 0.2;
 	var angle = PI/2;
 	body.impulse(speed, frict, angle);
 	```
 	
 	speed: Is the new body speed (type number)
 	
 	frict: It will reduce the speed when the move method is invoked (type number)
 	
 	angle: The new body angle in radians (type number)
 	
 - **move:** changes the position of the object according to its speed:

 	```javascript
 	body.move();
 	```


### - Point

Point is the smallest (atomic) body that exists in the library, everything has a point.

Class Name: Point;

Factory example:

```javascript
var pnt1 = Bread.point({
    x: 280,
    y: 120,
    angle: 0
})
```

##### Attributes

 - **reflexAngle:** Is the reflex angle.

##### Methods

This methods can be found on all bodies, except for Body.

 - **distance:** return the distance to other point:

 	```javascript
 	pnt2 //Must be a body type
 	var d = pnt1.distance(pnt2);
 	```
 	
 	pnt2: Is an object that represents a body (type Body or Point)
 - **pointTo:** this method will modify the angle of the object, and make it target another point:

 	```javascript
 	pnt2 //Must be a body type
 	pnt1.pointTo(pnt2);
 	```
 	
 	pnt2: Is an object that represents a body (type Body or Point)
 - **update:** updates the current coordinates and the angle:

 	```javascript
 	var x = 3;
 	var y = 7;
 	var angle = PI;
 	pnt1.update(x, y, angle);
 	```
 	
 	x: Is the new x position (type number)
 	
 	y: Is the new y position (type number)
 	
 	angle: The new point angle in radians (type number)
 	
 - **direction:** return an array [x,y] with the point direction according to its last position:

 	```javascript
 	var dir = pnt1.direction();
 	```
 	
 	dir: Is an array that contains the direction over the x axis in the first position and the y axis in the second one


### - Line

Line is formed by two or more points. So it shares all point methods and properties.

Class Name: Line;

Factory example:

```javascript
var line1 = Bread.line({
    x: 270,
    y: 160,
    points: [pnt1]
});
```

##### Attributes

 - **points:** Array of all points, every item should be an object of type Point.
 - **allPoints:** Is the same points array, including the initial point (x,y).
 - **perimeter:** The perimeter value.
 - **slopes:** Is an array that contains all slopes in the line.
 - **fill:** Boolean, this attribute allows to fill the line if true when rendered
 - **close:** Boolean, this attribute allows to close the line to its initial point if true.

##### Methods

 - **collision:** This method detects a collision between the line and other line. Returns a boolean

 ```javascript
  line2 //Must be a line type
  var hit = line1.collision(line2);
 ```
 
 line2: Is an object that represents a line (type Line)
 
 hit: Boolean variable. True if there is a collison otherwise: False
 - **render:** Render the line in the universe. Remember that you must add the line to the universe.

 ```javascript
  line1.render();
 ```

