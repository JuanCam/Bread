(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isBody = Bread.isBody;
    var isNumber = Bread.isNumber;
    var inRange = Bread.inRange;
    var pluck = Bread.pluck;

    error.filename = 'line';

    if (!Bread.Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Bread.Point) {
        error.show(error.include('You must include point module'));
        return false;
    }

    var Pi = Math.PI;

    function Line() {
        /*Line base mixin*/
    }

    function line(attrs) {
        try {
            if (!attrs.points) throw error.type('points must be defined');
            if (attrs.points.length <= 0) throw error.type('points list must have at least one element');
            var extended = primitive();
            var fPoint = Bread.point({ x: attrs.x, y: attrs.y });
            var instance = new extended({
                x: attrs.x,
                y: attrs.y
            });
            if (!instance.x || !instance.y) throw error.type('error in position');
            instance.firstPoint = fPoint;
            instance.points = attrs.points;
            instance.fill = attrs.fill;
            instance.close = attrs.close;
            return instance;

        } catch (e) {
            error.show(e);
        }
    }

    function primitive() {
        var Body = Bread.Body;
        var Point = Bread.Point;
        return Bread.augment(Body, [Line, Point]);
    }

    Line.prototype = {

        collision: function(line) {
            try {
                if (!isBody(line)) throw error.type('line must be a body');
                var p = 0;
                var sortX = [];
                var sortY = [];
                var d = 0;
                var flag = false;
                for (; p < this.allPoints.length; p++) {
                    var dirLine = directionLine.call(this, p);
                    var cutPnt = getCutPoints.call(line, dirLine, p, p);
                    sortX = pluck(line.allPoints, 'x').sort(compare);
                    sortY = pluck(line.allPoints, 'y').sort(compare);
                    d = this.allPoints[p].distance(cutPnt);
                    flag = d <= Math.abs(this.speed);
                    flag = flag && inRange(cutPnt.x, sortX[0], sortX[1]) && inRange(cutPnt.y, sortY[0], sortY[1]);
                    if (flag) break;
                }
                return flag;

            } catch (e) {
                error.show(e);
            }
        },
        render: function() {

            this.validateContext();

            this.context.beginPath();
            this.context.moveTo(this.x, this.y);
            drawPoints.call(this, this.points);
            if (this.fill) this.context.fill();
            if (this.close) this.context.closePath();
            this.context.stroke();
        },
        move: function() {
            var p = this.points.length - 1;
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
            this.speed -= this.friction;
            this.firstPoint.update(this.x, this.y);

            for (; p >= 0; p--) {
                this.points[p].speed = this.speed;
                this.points[p].angle = this.angle;
                this.points[p].move();
            }
        }
    };

    Object.defineProperty(Line.prototype, 'allPoints', {
        get: function() {
            return [this.firstPoint].concat(this.points);
        }
    });

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
            var points = this.allPoints;
            var p = points.length - 1;
            var slopes = []
            var line = this;

            function calculate(points) {
                if (p > 0) {
                    var slope = (points[p].y - points[p - 1].y) / (points[p].x - points[p - 1].x)
                    slopes.push(slope);
                    p--;
                    return calculate(points);
                } else {
                    return slopes;
                }
            }
            return calculate(points)
        }
    });

    function drawPoints(points) {
        var p = points.length - 1;
        var line = this;

        function draw(points) {
            if (p >= 0) {
                line.context.lineTo(points[p].x, points[p].y);
                p--;
                return draw(points);
            } else {
                return true;
            }
        }
        return draw(points);
    }

    function compare(a, b) {
        return a - b;
    }

    function directionLine(n) {
        var slope = Math.tan(this.angle);
        var points = this.allPoints;
        var b = points[n].y - points[n].x * slope;
        var xp = points[n].x + 10;
        var point = Bread.point({
            x: xp,
            y: xp * slope + b
        });

        return Bread.line({
            x: points[n].x,
            y: points[n].y,
            points: [point]
        })
    }

    function perpendicularSlopes(slopes) {
        var s = slopes.length - 1;
        var perpnSlopes = [];

        function perpendicular(slopes) {
            if (s >= 0) {
                try {
                    if (!isNumber(slopes[s])) throw error.type('slope must be a number');
                    var angle = Math.atan(slopes[s]);
                    perpnSlopes.push(angle + (Pi / 2));
                    return perpendicular(slopes);
                } catch (e) {
                    error.show(e);
                }
            } else {
                return perpnSlopes;
            }
        }
        return perpendicular(slopes);
    }

    function getYIntersec(n, s) {

        var slopes = this.slopes;
        var points = this.allPoints;

        return points[n].y - points[n].x * slopes[s];
    }

    function getCutPoints(line, n1, n2) {

        var points = this.allPoints;
        var s1 = (n1 >= points.length - 1) ? n1 - 1 : n1;
        var s2 = (n2 >= points.length - 1) ? n2 - 1 : n2;
        var b1 = getYIntersec.call(line, n1, s1);
        var b2 = getYIntersec.call(this, n2, s2);
        var x;
        var y;

        if (b1 === Infinity || b2 === Infinity) {
            x = points[n2].x;
            y = points[n1].y + (Math.abs(points[n1].x - points[n2].x) * line.slopes[s1]);
        } else {
            x = (b1 - b2) / (this.slopes[s2] - line.slopes[s1]);
            y = x * line.slopes[s1] + b1;
        }

        return Bread.point({
            x: x,
            y: y
        });

    }
    Bread.line = line;
    Bread.Line = primitive();

})(window, Bread);