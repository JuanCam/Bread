(function(w, Bread) {

    'use strict';

    if (!Bread.Body) {
        console.error('Fatal!. You must include body module');
        return false;
    }

    var Pi = Math.PI;
    Bread.circle = circle;

    function circle(attrs) {
        var Body = Bread.Body;
        var extended = Bread.augment(Body, [Circle]);
        var instance = new extended({
            x: attrs.x,
            y: attrs.y
        });
        instance.setRadius(attrs.radius);

        return instance;
    }

    Circle.prototype = {

        setRadius: function(radius) {
            try {
                if (isNaN(radius)) throw "Incorrect assignment in body ";
                this.radius = radius;
            } catch (error) {
                console.warn(error + '(set-radius)');
            }
        },
        collision: function(circle) {
            try {
                
                if (!circle.radius) throw "Object must be a body ";
                var x1 = this.x;
                var y1 = this.y;
                var radius1 = this.radius;
                var x2 = circle.x;
                var y2 = circle.y;
                var radius2 = circle.radius;
                var hypotenuse = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                return (hypotenuse <= (radius1 + radius2));

            } catch (error) {
                console.warn(error + '(collision)')
            }
        },
        render: function() {

            if (!this.context) {
                console.error('Context is not set, render failed!.');
                return false;
            }
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, 2 * Pi);
            this.context.stroke();
        }
    }

    function Circle() {
        /*Circle Mixin*/
    }
})(window, window.Bread)