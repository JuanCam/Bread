(function(w, Bread) {

    'use strict';

    var error, Body, Arc, CircleMix, Pi;
    error = Bread.error();
    Body = Bread.Body;
    Arc = Bread.Arc;
    Pi = Math.PI;

    error.filename = 'circle.js';

    if (!Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Arc) {
        error.show(error.include('You must include arc module'));
        return false;
    }

    function Circle(attrs) {
        /*Circle base mixin*/
        try {
            if (!Bread.isNumber(attrs.radius)) throw error.type('radius must be a number');
            if (!init.call(this, attrs)) throw error.type('error in position');
        } catch (e) {
            error.show(e);
        }
    }

    function circle(attrs) {
        return new CircleMix({
            x: attrs.x,
            y: attrs.y,
            radius: attrs.radius
        });

    }

    function init(attrs) {
        if (!this.x || !this.y) return;
        this.defRaduis = attrs.radius;
        this.fill = attrs.fill;
        this.anticlock = true;
        return this;
    }

    Circle.prototype = {

        collision: function(circle) {
            try {
                var radius, radiusV, hypotenuse;
                if (!Bread.isBody(circle)) throw error.type('circle must be a body');
                if (!circle.radius) throw error.type('radius must be a number');
                radius = this.radius;
                radiusV = circle.radius; //Visitor's radius
                hypotenuse = this.distance(circle);

                return (hypotenuse <= (radius + radiusV));

            } catch (e) {
                error.show(e);
            }
        }
    }

    Object.defineProperty(Circle.prototype, 'startAngle', {
        'enumerable': true,
        'value': 0
    });
    Object.defineProperty(Circle.prototype, 'endAngle', {
        'enumerable': true,
        'value': 2 * Pi
    });

    CircleMix = Bread.augment(Body, [Arc, Circle]);
    Bread.circle = circle;
    Bread.Circle = CircleMix;

})(window, window.Bread)
