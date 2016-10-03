(function(w, Bread) {

    'use strict';

    var error, Body, PointMix, xgoes, ygoes, reachPnt, shifted, queuedir;
    error = Bread.error();
    Body = Bread.Body;

    error.filename = 'point.js';

    if (!Body) {
        error.show(error.include('You must include body module'));
        return false;
    }

    /*Private properties*/
    xgoes = 1;
    ygoes = 1;
    queuedir = [];

    function Point(attrs) {
        /*Point base mixin*/
        try {

            if (!Bread.isNumber(attrs.x)) throw error.type('x must be a number');
            if (!Bread.isNumber(attrs.y)) throw error.type('y must be a number');
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
                xgoes = dx / Math.abs(dx);
                ygoes = dy / Math.abs(dy);
                this.angle = Math.atan(Math.abs(dy) / Math.abs(dx));

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
            var dirx, diry;
            dirx = 0;
            diry = 0;
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
            var slope, b, xp, point;
            slope = Math.tan(this.angle);
            b = this.y - this.x * slope;
            xp = this.x + 10;
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
        reach: function(point, lines) {

            try {
                var linesPth, closeLine, stop, points;
                if (!Bread.isNumber(point.x)) throw error.type('x must be a number');
                if (!Bread.isNumber(point.y)) throw error.type('y must be a number');
                this.pointTo((reachPnt) ? reachPnt : point);
                linesPth = linesInPath.call(this, lines);
                if (linesPth.length) {
                    closeLine = getCloseLine.call(this, linesPth);
                    points = closeLine.allPoints;
                    reachPnt = getClosePoint.call(this, points);
                } else {
                    if (this.distance(point) > 0) {
                        reachPnt = undefined;
                    } else {
                        stop = true;
                    }
                }
                if (!stop) this.move();
                return reachPnt || point;
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
                angle = (Math.PI / 2) + (ygoes * this.angle);
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
        var l = lines.length - 1;
        var linesPth = [];

        Bread.forEach(lines, function(line, ind) {
            cutPnt = line.cutPoints(dirLine, ind, ind);
            if (cutPnt) {
                linesPth.push({
                    line: line,
                    cutPnt: cutPnt
                });
            }
        });
        return linesPth;
    }

    function getCloseLine(lines) {
        var localPnt, minD, distances,lineCl;
        localPnt = this;
        distances = Bread.map(lines, function(line) {
            return localPnt.distance(line.cutPnt);
        });
        minD = Math.min.apply(null, distances);
        lineCl = lines[distances.indexOf(minD)].line.clone();
        if (lineCl.allPoints[0].x > lineCl.allPoints[1].x) {
            lineCl.x = lineCl.x + 4;
            lineCl.y = lineCl.x + 4 * lineCl.slopes[0];
            lineCl.allPoints[1].x = lineCl.allPoints[1].x - 4;
            lineCl.allPoints[1].y = lineCl.allPoints[1].x - 4 * lineCl.slopes[0];
        } else {
            lineCl.x = lineCl.x - 4;
            lineCl.y = lineCl.x - 4 * lineCl.slopes[0];
            lineCl.allPoints[1].x = lineCl.allPoints[1].x + 4;
            lineCl.allPoints[1].y = lineCl.allPoints[1].x + 4 * lineCl.slopes[0];
        }
        return lineCl;
    }

    function getClosePoint(points) {
        return (points[0].distance(this) > points[1].distance(this)) ? points[1] : points[0];
    }

    PointMix = Bread.augment(Body, [Point]);
    Bread.point = point;
    Bread.Point = PointMix;

})(window, window.Bread)