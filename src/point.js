(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    var isBody = Bread.methods.isBody;
    var forEach = Bread.methods.forEach;
    var Body = Bread.Body;
    var PointMix;
    error.filename = 'point.js';

    if (!Body) {
        error.show(error.include('You must include body module'));
        return false;
    }

    /*Private properties*/

    var xgoes = 1;
    var ygoes = 1;
    var queuedir = [];
    var shifted;

    function Point(attrs) {
        /*Point base mixin*/
        try {

            if (!isNumb(attrs.x)) throw error.type('x must be a number');
            if (!isNumb(attrs.y)) throw error.type('y must be a number');
            this.x = attrs.x;
            this.y = attrs.y;

        } catch (e) {
            error.show(e);
        }
    }

    function point(attrs) {
        try {

            var instance = new PointMix({
                x: attrs.x,
                y: attrs.y,
                angle: attrs.angle || 0
            });
            if (!instance.x || !instance.y) throw error.declare('error in position');
            return instance;

        } catch (e) {
            error.show(e);
        }
    }

    Point.prototype = {
        distance: function(point) {
            var d;
            try {
                if (!isBody(point)) throw error.type('point must be a body');
                if (!isNumb(point.x)) throw error.type('x must be a number');
                if (!isNumb(point.y)) throw error.type('y must be a number');
                var d = Math.sqrt(Math.pow((this.x - point.x), 2) + Math.pow((this.y - point.y), 2));

            } catch (e) {
                error.show(e);
            }
            return d;
        },
        pointTo: function(point) {
            /*Locate method*/
            var dx = 0;
            var dy = 0;
            try {

                if (!isBody(point)) throw error.type('point must be a body');
                if (!isNumb(point.x)) throw error.type('x must be a number');
                if (!isNumb(point.y)) throw error.type('y must be a number');

                dx = ((point.x - this.x) != 0) ? point.x - this.x : 1;
                dy = ((point.y - this.y) != 0) ? point.y - this.y : 1;
                xgoes = dx / Math.abs(dx);
                ygoes = dy / Math.abs(dy);
                this.angle = Math.atan(Math.abs(dy) / Math.abs(dx));

            } catch (e) {
                error.show(e);
            }
        },
        update: function(x, y, angle) {
            try {
                if (!isNumb(x)) throw error.type('x must be a number');
                if (!isNumb(y)) throw error.type('y must be a number');
                this.x = x;
                this.y = y;
                this.angle = angle || 0;
            } catch (e) {
                error.show(e);
            }
        },
        direction: function() {
            var dirx = 0;
            var diry = 0;

            if (queuedir.length <= 0) {
                queuedir.push(this.x)
                queuedir.push(this.y)
            } else {
                dirx = ((this.x - queuedir[0]) / Math.abs(this.x - queuedir[0])) || 0;
                diry = ((this.y - queuedir[1]) / Math.abs(this.y - queuedir[1])) || 0;
                queuedir.pop(), queuedir.pop();
                queuedir.push(this.x), queuedir.push(this.y);
            }
            return [dirx, diry];
        },
        directionLine: function() {
            var slope = Math.tan(this.angle);
            var b = this.y - this.x * slope;
            var xp = this.x + 10;
            var point = Bread.point({
                x: xp,
                y: xp * slope + b
            });

            return Bread.line({
                x: this.x,
                y: this.y,
                points: [point]
            })
        },
        reach: function(point, lines) {
            try {
                if (!isNumb(point.x)) throw error.type('x must be a number');
                if (!isNumb(point.y)) throw error.type('y must be a number');
                linesInPath.call(this, lines);
            } catch (e) {
                error.show(e);
            }
        }

    };

    Object.defineProperty(Point.prototype, 'reflexAngle', {

        get: function() {
            try {
                if (!isNumb(this.angle)) throw error.type('angle must be a number');
                var angle = (Math.PI / 2) + (ygoes * this.angle);
                angle = xgoes * angle;
                return angle;
            } catch (e) {
                error.show(e);
            }

        }
    });

    Object.defineProperty(Point.prototype, 'point', {
        'enumerable': true,
        'value': true
    });

    function linesInPath(lines) {
        var dirLine = this.directionLine();
        var cutPnt;
        forEach(lines, function(line) {
            cutPnt = line.cutPoints(dirLine);
        });
        return cutPnt;
    }

    PointMix = Bread.augment(Body, [Point]);
    Bread.point = point;
    Bread.Point = PointMix;

})(window, window.Bread)