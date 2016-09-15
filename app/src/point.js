(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumb = Bread.isNumber;
    error.filename = 'point';

    if (!Bread.Body) {
        console.error(error.include('You must include body module'));
        return false;
    }

    /*Private properties*/

    var xgoes = 1;
    var ygoes = 1;

    function Point(attrs) {
        /*Point base mixin*/
        try {
            if (!isNumb(attrs.x)) throw error.type('x must be a number');
            if (!isNumb(attrs.y)) throw error.type('y must be a number');
            this.x = attrs.x;
            this.y = attrs.y;

        } catch (e) {
            console.error(e.message)
        }
    }

    function point(attrs) {
        try {
            var extended = primitive();
            var instance = new extended({
                x: attrs.x,
                y: attrs.y,
                angle: angle
            });
            if (!instance.x || !instance.y) throw error.declare('error in position');
            return instance;

        } catch (e) {
            console.error(e.message)
        }
    }

    function primitive() {
        var Body = Bread.Body;
        return Bread.augment(Body, [Point]);
    }

    Point.prototype = {

        distance: function(point) {
            var d;
            try {
                if (!isNumb(point.x)) throw error.type('x must be a number');
                if (!isNumb(point.y)) throw error.type('y must be a number');
                if (!(point instanceof Bread.Body)) throw error.type('point must be a body');
                var d = Math.sqrt(Math.pow((this.x - point.x), 2) + Math.pow((this.y - point.y), 2));

            } catch (e) {
                console.error(e.message)
            }
            return d;
        },
        locate: function(point) {
            /*Locate method*/
            var dx = 0;
            var dy = 0;
            try {

                if (!isNumb(point.x)) throw error.type('x must be a number');
                if (!isNumb(point.y)) throw error.type('y must be a number');
                if (!(point instanceof Bread.Body)) throw error.type('point must be a body');

                dx = ((point.x - this.x) != 0) ? point.x - this.x : 1;
                dy = ((point.y - this.y) != 0) ? point.y - this.y : 1;
                xgoes = dx / Math.abs(dx);
                ygoes = dy / Math.abs(dy);
                this.angle = Math.atan(Math.abs(dy) / Math.abs(dx));

            } catch (e) {
                console.error(e.message);
            }
        }
    };


    Object.defineProperty(Point, 'reflexAngle', {

        get: function() {
            try {
                if (!isNumb(this.angle)) throw error.type('angle must be a number');
                var angle = (Math.PI / 2) + (ygoes * this.angle);
                angle = xgoes * angle;
                return angle;
            } catch (error) {
                console.error(error);
            }

        }
    });

    Bread.Point = primitive();

})(window, Bread);
