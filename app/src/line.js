(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    error.filename = 'line';

    if (!Bread.Body) {
        console.error(error.include('You must include body module'));
        return false;
    }
    if (!Bread.Point) {
        console.error(error.include('You must include point module'));
        return false;
    }

    var Pi = Math.PI;

    function Line() {
        /*Line base mixin*/
    }

    function line(attrs) {
        try {
            var extended = primitive();
            var instance = new extended({
                x: attrs.x,
                y: attrs.y
            });
            if (!instance.x || !instance.y) throw error.include('error in position')
            instance.points = attrs.points;
            instance.fill = attrs.fill;
            instance.close = attrs.close;
            return instance;

        } catch (e) {
            console.error(e.message);
        }
    }


    function primitive() {
        var Body = Bread.Body;
        var Point = Bread.Point;
        return Bread.augment(Body, [Line, Point]);
    }

    Line.prototype = {

        render: function() {

            if (!this.context) {
                console.error(error.declare('Context is not set, render failed!.'));
                return false;
            }
            this.context.beginPath();
            this.context.moveTo(this.x, this.y);
            drawPoints.call(this, this.points);
            if (this.fill) this.context.fill();
            if (this.close) this.context.closePath();
            this.context.stroke();
        }
    };

    Object.defineProperty(Line.prototype, 'perimeter', {

        get: function() {
            var p = this.points.length - 1;
            var perimeter = 0;

            function calculate(points) {

                if (p > 0) {
                    perimeter += points[p].distance(points[p - 1]);
                    p--;
                    return calculate(points);
                } else {
                    return perimeter;
                }
            }
            return calculate(this.points)
        }
    });

    Object.defineProperty(Line.prototype, 'slopes', {

        get: function() {
            var p = this.points.length - 1;
            var slopes = []

            function calculate(points) {

                if (p > 0) {
                    slopes.push(Math.atan((points[p].y - points[p - 1].y) / (points[p].x - points[p - 1].x)));
                    p--;
                    return calculate(points);
                } else {
                    return slopes;
                }
            }
            return calculate(this.points)
        }
    });

    function drawPoints(points) {
        var p = points.length;
        var line = this;

        function draw(points) {
            if (p >= 0) {
                line.context(lineTo(points[p].x, points[p].y));
                p--;
                return draw(points);
            } else {
                return true;
            }
        }
        return draw(points);
    }

    Bread.line = line;
    Bread.Line = primitive();

})(window, Bread);
