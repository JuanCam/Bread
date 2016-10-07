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

    function Circle() {
        /*Circle base mixin*/
    }

    function circle(attrs) {
        try {
            if (!Bread.isNumber(attrs.radius)) throw error.type('radius must be a number');

            var instance = new CircleMix({
                x: attrs.x,
                y: attrs.y
            });
            return init.call(instance, attrs);

        } catch (e) {
            error.show(e);
        }
    }

    function init(attrs) {
        if (!this.x || !this.y) return;
        this.defRaduis = attrs.radius;
        this.fill = attrs.fill;
        this.anticlock = true;
        return this;
    }

    Circle.prototype = {

        startAngle: 0,
        endAngle: 2 * Pi,
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

    Object.defineProperty(Circle.prototype, 'circle', {
        'enumerable': true,
        'value': true
    });

    CircleMix = Bread.augment(Body, [Circle, Arc]);;
    Bread.circle = circle;
    Bread.Circle = CircleMix;

})(window, window.Bread)
