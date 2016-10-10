(function(w, Bread) {

    'use strict';

    var error, Body, PointMix;
    error = Bread.error();
    Body = Bread.Body;

    error.filename = 'point.js';

    if (!Body) {
        error.show(error.include('You must include body module'));
        return false;
    }

    function Point(attrs) {
        /*Point base mixin*/
        try {

            if (!Bread.isNumber(attrs.x)) throw error.type('x must be a number');
            if (!Bread.isNumber(attrs.y)) throw error.type('y must be a number');
            this.angle = attrs.angle || 0;
        } catch (e) {
            error.show(e);
        }
    }

    function point(attrs) {

        return new PointMix({
            x: attrs.x,
            y: attrs.y,
            angle: attrs.angle
        });
    }


    Point.prototype = {
        distance: function(point) {
            var d;
            try {
                if (!Bread.isBody(point)) throw error.type('point must be a body');
                if (!Bread.isNumber(point.x)) throw error.type('x must be a number');
                if (!Bread.isNumber(point.y)) throw error.type('y must be a number');
                d = Math.sqrt(Math.pow((this.x - point.x), 2) + Math.pow((this.y - point.y), 2));

            } catch (e) {
                error.show(e);
            }
            return d;
        },
        pointTo: function(point) {
            var dx, dy;
            dx = 0;
            dy = 0;
            try {

                if (!Bread.isBody(point)) throw error.type('point must be a body');
                if (!Bread.isNumber(point.x)) throw error.type('x must be a number');
                if (!Bread.isNumber(point.y)) throw error.type('y must be a number');

                dx = ((point.x - this.x) != 0) ? point.x - this.x : 1;
                dy = ((point.y - this.y) != 0) ? point.y - this.y : 1;
                toward.call(this, dx, dy);
                this.angle = Math.atan(dy / dx);

            } catch (e) {
                error.show(e);
            }
        },
        update: function(x, y, angle) {
            try {
                if (!Bread.isNumber(x)) throw error.type('x must be a number');
                if (!Bread.isNumber(y)) throw error.type('y must be a number');
                this.x = x;
                this.y = y;
                this.angle = angle || 0;
            } catch (e) {
                error.show(e);
            }
        },
        direction: function() {
            var dx, dy;
            dx = 0;
            dy = 0;
            if (this.queuedir.length <= 0) {
                this.queuedir.push(this.x)
                this.queuedir.push(this.y)
            } else {
                dx = (this.x - this.queuedir[0] != 0) ? this.x - this.queuedir[0] : 1;
                dy = (this.y - this.queuedir[1] != 0) ? this.y - this.queuedir[1] : 1;
                toward.call(this, dx, dy);
                this.queuedir.pop(), this.queuedir.pop();
                this.queuedir.push(this.x), this.queuedir.push(this.y);
            }
            return [this.xgoes, this.ygoes];
        },
        directionLine: function() {
            var slope, b, xp, point;
            slope = Math.tan(this.angle);
            b = this.y - this.x * slope;
            xp = this.x + this.xgoes * 10;
            point = Bread.point({
                x: xp,
                y: xp * slope + b
            });
            return Bread.line({
                x: this.x,
                y: this.y,
                points: [point]
            })
        },
        reach: function(point, lines, space) {
            try {
                var linesPth, closeLine, stop, points, target;
                if (!Bread.isNumber(point.x)) throw error.type('x must be a number');
                if (!Bread.isNumber(point.y)) throw error.type('y must be a number');
                target = (this.reachPnt) ? this.reachPnt : point
                this.pointTo(target);
                linesPth = linesInPath.call(this, lines, target);
                if (linesPth.length) {
                    closeLine = getCloseLine.call(this, linesPth, space);
                    points = closeLine.allPoints;
                    this.reachPnt = getClosePoint.call(this, points);
                } else {
                    if (this.distance(this.reachPnt) <= this.speed) {
                        this.reachPnt = point;
                        stop = true;
                    }
                }
                if (!stop) this.move();
            } catch (e) {
                error.show(e);
            }
        }
    };

    Object.defineProperty(Point.prototype, 'reflexAngle', {

        get: function() {
            try {
                var angle;
                if (!Bread.isNumber(this.angle)) throw error.type('angle must be a number');
                angle = (Math.PI / 2) + (this.ygoes * this.angle);
                return this.xgoes * angle;
            } catch (e) {
                error.show(e);
            }
        }
    });

    function _compare(a, b) {
        return a - b;
    }

    function linesInPath(lines, target) {
        var dirLine, cutPnt, linesPth, point;
        dirLine = this.directionLine();
        linesPth = [];
        point = this;
        Bread.forEach(lines, function(line, ind) {
            var isInX, isInY, x, y, isClose;
            cutPnt = line.cutPoints(dirLine, 0, 0);
            x = [line.x, line.points[0].x].sort(_compare);
            y = [line.y, line.points[0].y].sort(_compare);
            isInX = Bread.inRange(cutPnt.x, x[0], x[1]);
            isInY = Bread.inRange(cutPnt.y, y[0], y[1]);
            isClose = cutPnt.distance(point) < target.distance(point);
            if (cutPnt && isInX && isInY && isClose) {
                linesPth.push({
                    line: line,
                    cutPnt: cutPnt
                });
            }
        });
        return linesPth;
    }

    function getCloseLine(lines, space) {
        var localPnt, minD, distances, lineCl;
        localPnt = this;
        distances = Bread.map(lines, function(line) {
            return localPnt.distance(line.cutPnt);
        });
        minD = Math.min.apply(null, distances);
        lineCl = lines[distances.indexOf(minD)].line.clone();
        return extrapolateLine(lineCl, space);
    }

    function extrapolateLine(line, space) {
        var extrapolated, x, y;
        extrapolated = extrapolateAxis.call(line, 'x', space);
        x = extrapolated.axis;
        extrapolated = extrapolateAxis.call(line, 'y', space);
        y = extrapolated.axis;
        line.xdef = x;
        line.ydef = y;
        line.points = extrapolated.points;
        return line;
    }

    function extrapolateAxis(axis, space) {
        var points, slopes, a;
        points = this.allPoints;
        slopes = this.slopes;
        if (points[0][axis] > points[1][axis]) {
            a = this[axis] + space;
            points[0][axis] = points[0][axis] - space;
        } else {
            a = this[axis] - space;
            points[0][axis] = points[0][axis] + space;
        }
        return {
            axis: a,
            points: points
        };
    }

    function getClosePoint(points) {
        return (points[0].distance(this) > points[1].distance(this)) ? points[1] : points[0];
    }

    function toward(dx, dy) {

        this.xgoes = dx / Math.abs(dx);
        this.ygoes = dy / Math.abs(dy);
    }

    PointMix = Bread.augment(Body, [Point]);
    Bread.point = point;
    Bread.Point = PointMix;

})(window, window.Bread)
