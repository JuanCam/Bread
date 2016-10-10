(function(w, Bread) {

    'use strict';

    var error, Body, Point, LineMix, Pi, fPoint;
    error = Bread.error();
    Body = Bread.Body;
    Point = Bread.Point;
    Pi = Math.PI;

    error.filename = 'line.js';

    if (!Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Point) {
        error.show(error.include('You must include point module'));
        return false;
    }


    function Line(attrs) {
        /*Line base mixin*/
        try {
            if (!attrs.points) throw error.type('points must be defined');
            if (attrs.points.length <= 0) throw error.type('points list must have at least one element');
            if (!init.call(this, attrs)) throw error.type('error in position');

        } catch (e) {
            error.show(e);
        }
    }

    function line(attrs) {
        
        return new LineMix({
            x: attrs.x,
            y: attrs.y,
            points: attrs.points,
            fill: attrs.fill,
            close: attrs.close
        });
    }

    function init(attrs) {
        if (!this.x || !this.y) return;
        /*Create an object for the first point*/
        var fPoint = Bread.point({ x: attrs.x, y: attrs.y });
        this.firstPoint = fPoint;
        this.points = attrs.points;
        this.fill = attrs.fill;
        this.close = attrs.close;
        return this;
    }

    Line.prototype = {
        collision: function(line) {
            try {
                var p, sortX, sortY, d, dirLine, cutPnt, flag;
                if (!Bread.isBody(line)) throw error.type('line must be a body');
                p = 0;
                sortX = [];
                sortY = [];
                d = 0;
                for (; p < this.allPoints.length; p++) {
                    dirLine = guidePoint.call(this, p);
                    cutPnt = line.cutPoints(dirLine, p, p);
                    d = this.allPoints[p].distance(cutPnt);
                    sortX = Bread.pluck(line.allPoints, 'x').sort(_compare);
                    sortY = Bread.pluck(line.allPoints, 'y').sort(_compare);
                    flag = d <= Math.abs(this.speed);
                    flag = flag && Bread.inRange(cutPnt.x, sortX[0], sortX[1]) && Bread.inRange(cutPnt.y, sortY[0], sortY[1]);
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
            Bread.Body.prototype.move.call(this);
            this.firstPoint.update(this.x, this.y);

            for (; p >= 0; p--) {
                this.points[p].speed = this.speed;
                this.points[p].angle = this.angle;
                this.points[p].move();
            }
        },
        clone: function() {
            var line = Bread.Body.prototype.clone.call(this);
            line.points = [];
            Bread.forEach(this.points, function(point) {
                line.points.push(Bread.Body.prototype.clone.call(point));
            });
            return line;
        },
        cutPoints: function(line, n1, n2) {
            /*Get cut points of interpolated lines*/
            var x, y, points, s1, s2, b1, b2;
            points = this.allPoints;
            s1 = (n1 >= points.length - 1) ? n1 - 1 : n1;
            s2 = (n2 >= points.length - 1) ? n2 - 1 : n2;
            b1 = getYIntersec.call(line, n1, s1);
            b2 = getYIntersec.call(this, n2, s2);

            if (b1 === Infinity || b2 === Infinity) {
                x = points[n2].x;
                y = points[n1].y + (Math.abs(points[n1].x - points[n2].x) * line.slopes[s1]);
            } else {
                x = (b1 - b2) / (this.slopes[s2] - line.slopes[s1]);
                y = x * line.slopes[s1] + b1;
            }
            return (x && y) ? Bread.point({ x: x, y: y }) : null;
        }
    };

    function _draw(points) {
        var p = points.length - 1;
        while (p >= 0) {
            this.context.lineTo(points[p].x, points[p].y);
            p--;
        }
    }

    function _slopes(points) {
        var p, slope, slopes;
        p = points.length - 1;
        slopes = [];
        while (p > 0) {
            slope = (points[p].y - points[p - 1].y) / (points[p].x - points[p - 1].x)
            slopes.push(slope);
            p--;
        }
        return slopes;
    }

    function _perimeter(points) {
        var p, perimeter;
        p = points.length - 1;
        while (p >= 0) {
            perimeter += points[p].distance(points[p - 1]);
            p--;
        }
        return perimeter;
    }

    function _compare(a, b) {
        return a - b;
    }

    Object.defineProperty(Line.prototype, 'allPoints', {
        get: function() {
            return [this.firstPoint].concat(this.points);
        }
    });

    Object.defineProperty(Line.prototype, 'perimeter', {

        get: function() {
            return _perimeter(this.points);
        }
    });

    Object.defineProperty(Line.prototype, 'slopes', {

        get: function() {
            var points = this.allPoints;
            return _slopes(points);
        }
    });

    Object.defineProperty(Line.prototype, 'xdef', {
        set: function(x) {
            this.x = x;
            if (this.firstPoint) this.firstPoint.update(this.x, this.y);
        }
    });

    Object.defineProperty(Line.prototype, 'ydef', {
        set: function(y) {
            this.y = y;
            if (this.firstPoint) this.firstPoint.update(this.x, this.y);
        }
    });

    function drawPoints(points) {
        return _draw.call(this, points);
    }

    function guidePoint(p) {
        var point = this.allPoints[p];
        point.angle = this.angle;
        return point.directionLine();
    }

    function getYIntersec(n, s) {
        var slopes = this.slopes;
        var points = this.allPoints;
        return points[n].y - points[n].x * slopes[s];
    }

    LineMix = Bread.augment(Body, [Point, Line]);
    Bread.line = line;
    Bread.Line = LineMix;

})(window, window.Bread)
