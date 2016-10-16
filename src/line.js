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
        this.points = attrs.points;
        this.fill = attrs.fill;
        this.close = attrs.close;
        return this;
    }

    Line.prototype = {
        collision: function(line) {
            try {
                if (!Bread.isBody(line)) throw error.type('line must be a body');
                return _collision.call(this, line) || _collision.call(line, this);

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
            var x, y, points, vPoints, s1, s2, b1, b2;
            points = this.allPoints;
            vPoints = line.allPoints;
            s1 = (n1 >= points.length - 1) ? n1 - 1 : n1;
            s2 = (n2 >= points.length - 1) ? n2 - 1 : n2;
            b1 = getYIntersec.call(line, n1, s1);
            b2 = getYIntersec.call(this, n2, s2);

            if (Math.abs(b2) === Infinity) {
                x = points[n2].x;
                y = vPoints[n1].y + (Math.abs(points[n1].x - vPoints[n2].x) * line.slopes[s1]);
            } else if (Math.abs(b1) === Infinity) {
                x = vPoints[n2].x;
                y = points[n1].y + (Math.abs(points[n1].x - vPoints[n2].x) * this.slopes[s2]);
            } else {
                x = (b1 - b2) / (this.slopes[s2] - line.slopes[s1]);
                y = x * line.slopes[s1] + b1;
            }
            return (x && y) ? Bread.point({ x: x, y: y }) : null;
        }
    };

    Object.defineProperty(Line.prototype, 'allPoints', {
        get: function() {
            var first = Bread.point({ x: this.x, y: this.y })
            return [first].concat(this.points);
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
    
    function _collision(line) {
        var p, sortX, sortY, d, a, dirLine, mLine, cutPnt, flag;
        p = 0;
        sortX = [];
        sortY = [];
        d = 0;
        a = line.allPoints.length - 1;
        
        while (p < this.allPoints.length) {
            dirLine = guidePoint.call(this, line, p);
            cutPnt = line.cutPoints(dirLine, p, p);
            if (!cutPnt) return false ;
            d = this.allPoints[p].distance(cutPnt);
            sortX = Bread.pluck(line.allPoints, 'x').sort(_compare);
            sortY = Bread.pluck(line.allPoints, 'y').sort(_compare);
            flag = d <= Math.abs(this.speed);
            flag = flag && Bread.inRange(cutPnt.x, sortX[0], sortX[a]) && Bread.inRange(cutPnt.y, sortY[0], sortY[a]);
            if (flag) break;
            p++;
        }
        return flag;
    }

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

    function drawPoints(points) {
        return _draw.call(this, points);
    }

    function detectMovingLine(line1, line2) {
        var line;
        if (Math.abs(line1.speed) > 1e-7) {
            line = line1;
        } else if (Math.abs(line2.speed) > 1e-7) {
            line = line2;
        }
        return line;
    }

    function guidePoint(line, p) {
        var point = this.allPoints[p].clone();
        if (Math.abs(this.speed) <= 0) {
            point.angle = line.angle - Math.PI;
            point.xgoes = -line.xgoes;
            point.ygoes = -line.ygoes;
            point.speed = line.speed;
        } else {
            point.angle = this.angle;
            point.speed = this.speed;
        }
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
