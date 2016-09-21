(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    var isBody = Bread.methods.isBody;
    error.filename = 'circle';

    if (!Bread.Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Bread.Arc) {
        error.show(error.include('You must include arc module'));
        return false;
    }

    var Pi = Math.PI;

    function Circle() {
        /*Circle base mixin*/
    }

    function circle(attrs) {
        try {
            if (!isNumb(attrs.radius)) throw error.type('radius must be a number');
            var Body = Bread.Body;
            var Arc = Bread.Arc;
            var extended = primitive();
            var instance = new extended({
                x: attrs.x,
                y: attrs.y
            });
            if (!instance.x || !instance.y) throw error.declare('error in position');
            instance.defRaduis = attrs.radius;
            instance.fill = attrs.fill;
            instance.startAngle = 0;
            instance.endAngle = 2 * Pi;
            instance.anticlock = true;
            return instance;

        } catch (e) {
            error.show(e);
        }
    }

    function primitive() {

        var Body = Bread.Body;
        var Arc = Bread.Arc;
        return Bread.augment(Body, [Circle, Arc]);
    }

    Circle.prototype = {

        collision: function(circle) {
            try {

                if (!isBody(circle)) throw error.type('circle must be a body');
                if (!circle.radius) throw error.type('radius must be a number');
                var radius = this.radius;
                var radiusV = circle.radius; //Visitor's radius
                var hypotenuse = this.distance(circle);

                return (hypotenuse <= (radius + radiusV));

            } catch (e) {
                error.show(e);
            }
        }
    }

    Bread.Circle = primitive();
    Bread.circle = circle;

})(window, window.Bread)