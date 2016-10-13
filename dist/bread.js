'use strict';
/*
Name: breadjs@0.0.35
Author: Juan Gutierrez. Email: juanc1gutierrez@gmail.com
Bread is a JS library to help Developers who wants to include animations or some interaction using HTML5 Canvas.
Repo: https://github.com/JuanCam/Bread.
*/
/* Module file: src/core.js */
(function(w) {

var Bread = {
        v: '0.0.3',
        universe: CreateUniverse
    };

    var context;

    function CreateUniverse(attrs) {
        return new Universe(attrs);
    }

    /*Universe Public methods and attributes*/
    Universe.prototype = {
        bodies:[],
        addIt: function(body) {

            for (var bd in this.bodies) {
                if (this.bodies[bd] == body) {
                    console.error('Duplicate objects in enviromet!');
                    return false;
                }
            }

            this.bodies.push(body);
            body.context = context;
        },
        addGroup: function(group) {

            if (typeof group != 'object' && !(group instanceof Array)) {
                console.error('Incorrect input argument in add-group!');
                return false;
            }
            var bd = group.length - 1;
            
            for (; bd >= 0; bd--) {
                this.addIt(group[bd]);
            }

        },
        removeIt: function(body) {

            for (var bdy in this.bodies) {
                if (this.bodies[bdy] == body)
                    this.bodies.splice(1, bdy);
            };
            body.context = undefined;
        },
        animation: function(fn) {

            var local = this;
            var canvas = local.el;

            function animate() {
                setTimeout(Animation, local.frate);
            }

            function Animation() {
                requestAnimationFrame(animate);
                context.clearRect(0, 0, canvas.width, canvas.height);
                fn.call(local);
            }
            animate();
        },
        getBodies: function(type) {
            var where = Bread.methods.where;
            var filter = {};
            filter[type] = true;
            return (type) ? where(this.bodies, filter) : this.bodies;
        }

    };

    function Universe(attrs) {

        /*Universe core object*/
        this.frate = attrs.frate;
        this.el = attrs.el;
        var tagname = this.el.tagName;

        if (tagname == 'CANVAS') {
            context = this.el.getContext("2d");
        } else {
            console.error('HTML Element must be canvas tag');
            return false;
        }
    }

    w.Bread = Bread;

})(window)
;/* Module file: src/errors.js */
(function(w, Bread) {

    function errors() {
        return {
            filename: '',
            type: function(msg) {

                var Type = Bread.augment(Error, [TypeErr]);
                var error = new Type(msg, this.filename);
                error.message = msg;
                return error;
            },
            declare: function(msg) {

                var Declaration = Bread.augment(Error, [DeclarationError]);
                var error = new Declaration(msg, this.filename);
                error.message = msg;
                return error;
            },
            include: function(msg) {

                var Include = Bread.augment(Error, [IncludeError]);
                var error = new Include(msg, this.filename);
                error.message = error.important + error.message;
                return error;
            },
            show: function(err) {
                console.error('In ' + this.filename + ' ' + err.name + ': ' + err.message);
            }
        }
    }

    function TypeErr() {}

    TypeErr.prototype = {
        name: 'TypeErr',
        important: 'this is custom type'
    }

    function DeclarationError() {}

    DeclarationError.prototype = {
        name: 'DeclareError',
        important: ''
    }

    function IncludeError() {}

    IncludeError.prototype = {
        name: 'IncludeError',
        important: 'Fatal Error!'
    }
    Bread.error = errors;

})(window, window.Bread)
;/* Module file: src/extend.js */
(function(w, Bread) {

var error = Bread.error();
    error.filename = 'extend.js';

    function extend(Base, object) {
        var i, len, object, properties;
        properties = Object.getOwnPropertyNames(object);
        _merge.call(Base, object, properties);

        function _merge(object, properties) {
            var i = 0,
                propName, propDesc;
            for (; i < properties.length; i++) {
                propName = properties[i]
                propDesc = Object.getOwnPropertyDescriptor(object, propName);
                Object.defineProperty(this, propName, propDesc);
            }
        }
    }

    Bread.extend = extend;

})(window, window.Bread)
;/* Module file: src/methods.js */
(function(w, Bread) {

    var error, natIsArray, natForEach, natmMap;
    error = Bread.error();
    natIsArray = Array.isArray;
    natForEach = Array.prototype.forEach;
    natmMap = Array.prototype.map;
    error.filename = 'methods.js';

    if (!w.Bread) {
        error.show(error.include('You must include Bread'));
        return false;
    }

    var methods = (function() {

        var coreObj;

        function _forEach(collection, fn, cont) {
            var e, len, i, contxt;
            if (!Bread.isArray(collection)) {
                e = error.type('collection must be an array');
                error.show(e);
                return;
            }
            if (!Bread.isFunction(fn)) {
                e = error.type('second argument must be a function');
                error.show(e);
                return;
            }
            len = collection.length;
            i = 0;
            contxt = (cont) ? cont : null
            while (i < len) {
                fn.call(contxt, collection[i], i);
                i++;
            }
        }

        function _map(collection, iterate) {
            var i, e, len, mapped;
            if (!Bread.isArray(collection)) {
                e = error.type('List must be an Array.');
                error.show(e);
                return;
            }
            if (!Bread.isFunction(iterate)) {
                e = error.type('Iterate must be a function');
                error.show(e);
                return;
            }
            i = 0;
            mapped = [];
            len = collection.length;
            while (i < len) {
                mapped.push(iterate(collection[i], i));
                i++;
            }
            return mapped;
        }

        function _pluck(collection, field) {
            var e, len, i, plucked;
            if (!Bread.isArray(collection)) {
                e = error.type('collection must be an array');
                error.show(e);
                return;
            }
            if (!Bread.isString(field)) {
                e = error.type('second argument must be a string');
                error.show(e);
                return;
            }
            plucked = [];
            len = collection.length;
            i = 0;
            while (i < len) {
                plucked.push(collection[i][field]);
                i++;
            }
            return plucked;
        }

        function hasProps(properties, obj) {
            var p = properties.length - 1,
                property;
            for (; p >= 0; p--) {
                property = properties[p];
                if (this[property] !== obj[property]) break;
            }
            return p < 0;
        }

        function _where(collection, objProp) {
            var e, len, i, p, filtered, properties;
            if (!Bread.isArray(collection)) {
                e = error.type('collection must be an array');
                error.show(e);
                return;
            }
            if (!Bread.isObject(objProp)) {
                e = error.type('second argument must be an object');
                error.show(e);
                return;
            }
            properties = Object.getOwnPropertyNames(objProp);
            filtered = [];
            len = collection.length;
            i = 0;
            while (i < len) {
                if (hasProps.call(collection[i], properties, objProp)) {
                    filtered.push(collection[i]);
                }
                i++;
            }
            return filtered;
        }

        function _iterate(iterate, value) {
            var isFn = Bread.isFunction(iterate);
            return (isFn) ? iterate(value) : value[iterate];
        }

        function _groupBy(collection, iterate) {
            var v, i, iter, len, grouped;
            if (!Bread.isArray(collection)) {
                e = error.type('collection must be an array');
                error.show(e);
                return;
            }
            i = 0;
            len = collection.length;
            grouped = {};
            while (i < len) {
                value = collection[i];
                iter = _iterate(iterate, value);
                if (iter in grouped) {
                    grouped[iter].push(value);
                } else {
                    grouped[iter] = [value];
                }
                i++;
            }
            return grouped;
        }

        coreObj = {
            isNumber: function(variable) {
                return typeof variable === 'number';
            },
            isBody: function(variable) {
                return variable instanceof Bread.Body;
            },
            isCircle: function(variable) {
                return Bread.Circle.prototype.isPrototypeOf(variable);
            },
            isRectangle: function(variable) {
                return Bread.Rectangle.prototype.isPrototypeOf(variable);
            },
            isLine: function(variable) {
                return Bread.Line.prototype.isPrototypeOf(variable);
            },
            isPoint: function(variable) {
                return Bread.Point.prototype.isPrototypeOf(variable);
            },
            isArc: function(variable) {
                return Bread.Arc.prototype.isPrototypeOf(variable);
            },
            inRange: function(variable, lower, upper, open) {
                return (open) ? (variable >= lower) && (variable <= upper) : (variable > lower) && (variable < upper);
            },
            isArray: function(variable) {
                return variable instanceof Array;
            },
            isString: function(variable) {
                return variable instanceof String || typeof variable === 'string';
            },
            isFunction: function(variable) {
                return typeof variable === 'function';
            },
            isObject: function(variable) {
                if (variable) return variable.toString() == '[object Object]';
                return false;
            }
        };

        function nativeInvoke(collection, fn) {
            return this.call(collection, fn);
        }
        coreObj.forEach = (natForEach) ? nativeInvoke.bind(natForEach) : _forEach;
        coreObj.map = (natmMap) ? nativeInvoke.bind(natmMap) : _map;
        coreObj.where = _where;
        coreObj.pluck = _pluck;
        coreObj.groupBy = _groupBy;
        return coreObj;
    })();

    Bread.extend(Bread, methods);

})(window, window.Bread)
;/* Module file: src/augment.js */
(function(w, Bread) {

var error = Bread.error();
    error.filename = 'augment.js';

    if (!w.Bread) {
        error.show(error.include('You must include Bread module'));
        return false;
    }

    function augment(Base, mixins) {
        var lastInd;
        if (!Bread.isArray(mixins)) {
            error.show(error.type('mixins must be an Array'));
            return false;
        }
        lastInd = mixins.length - 1;

        function CoreBase() {
            Base.apply(this, arguments);
            if (lastInd >= 0) mixins[lastInd].apply(this, arguments);
        }

        CoreBase.prototype = Object.create(Base.prototype); //Chain
        CoreBase.constructor = Base;

        Bread.forEach(mixins, function(mixin, index) {
            Bread.extend(CoreBase.prototype, mixin.prototype);
        });

        return CoreBase;
    }

    Bread.augment = augment;

})(window, window.Bread)
;/* Module file: src/body.js */
(function(w, Bread) {

var error, bodyProto;
    error = Bread.error();
    error.filename = 'body.js';

    if (!w.Bread) {
        error.show(error.include('You must include Bread'));
        return false;
    }

    function Body(attrs) {
        /*Body base class*/
        try {
            if (!Bread.isNumber(attrs.x)) throw error.type('x must be a number');
            if (!Bread.isNumber(attrs.y)) throw error.type('y must be a number');
            this.y = attrs.y;
            this.x = attrs.x;
            this.xspeed = 0;
            this.yspeed = 0;
            this.speed = 0;
            this.angle = 0;
            this.friction = 0;
            this.xgoes = 1;
            this.ygoes = 1;
            this.reachPnt = undefined;
            this.queuedir = [];

        } catch (e) {
            error.show(e);
        }
    }
    /*Body public methods*/
    bodyProto = {
        accelerate: function(accx, accy) {
            try {
                if (!Bread.isNumber(accx)) throw error.type('x acceleration must be a number');
                if (!Bread.isNumber(accy)) throw error.type('y acceleration must be a number');
                this.x += this.xspeed, this.xspeed += accx;
                this.y += this.yspeed, this.yspeed += accy;
                this.angle = Math.atan(this.xspeed / this.yspeed);
            } catch (e) {
                error.show(e);
            }
        },
        bounce: function(bnx, bny) {
            try {
                if (!Bread.isNumber(bnx)) throw error.type('x bounce must be a number');
                if (!Bread.isNumber(bny)) throw error.type('y bounce must be a number');
                this.xspeed = bnx;
                this.yspeed = bny;
                this.speed = Math.sqrt(Math.pow(bnx, 2) + Math.pow(bny, 2));
            } catch (e) {
                error.show(e);
            }
        },
        impulse: function(speed, friction, angle) {
            try {
                if (!Bread.isNumber(speed)) throw error.type('speed impulse must be a number');
                if (!Bread.isNumber(friction)) throw error.type('friction impulse must be a number');
                if (!Bread.isNumber(angle)) throw error.type('angle impulse must be a number');
                this.speed = speed;
                this.angle = angle;
                this.friction = friction;
                this.x += this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);

            } catch (e) {
                error.show(e);
            }
        },
        move: function() {
            this.xspeed = this.speed * Math.cos(this.angle);
            this.yspeed = this.speed * Math.sin(this.angle);
            this.x += this.xspeed;
            this.y += this.yspeed;
            this.speed -= this.friction;
        },
        validateContext: function() {
            if (!this.context) {
                error.show(error.declare('Context is not set, render failed!.'));
                return false;
            }
        },
        clone: function() {
            var copy, core;
            core = Bread.augment(Bread.Body, []);
            core.prototype = Object.getPrototypeOf(this);
            copy = new core({ x: 0, y: 0 });
            Bread.extend(copy, this);
            return copy;
        }
    }

    Body.prototype = Object.preventExtensions(bodyProto);
    Bread.Body = Body;

})(window, window.Bread)
;/* Module file: src/point.js */
(function(w, Bread) {

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
            var slope, b, xp, point, isRightAng, absAng;
            absAng = Math.abs(this.angle) / (Math.PI / 2);
            slope = Math.tan(this.angle);
            isRightAng = (absAng == 5 || absAng == 1);
            b = this.y - this.x * slope;
            xp = (isRightAng) ? this.x : this.x + this.xgoes * this.speed;
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
;/* Module file: src/line.js */
(function(w, Bread) {

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
            var x, y, points, vPoints, s1, s2, b1, b2;
            points = this.allPoints;
            vPoints = line.allPoints;
            s1 = (n1 >= points.length - 1) ? n1 - 1 : n1;
            s2 = (n2 >= points.length - 1) ? n2 - 1 : n2;
            b1 = getYIntersec.call(line, n1, s1);
            b2 = getYIntersec.call(this, n2, s2);

            if (Math.abs(b2) === Infinity) {
                x = points[n2].x;
                y = points[n1].y + (Math.abs(points[n1].x - vPoints[n2].x) * line.slopes[s1]);
            } else if (Math.abs(b1) === Infinity) {
                x = vPoints[n2].x;
                y = vPoints[n1].y + (Math.abs(points[n1].x - vPoints[n2].x) * this.slopes[s2]);
            } else {
                x = (b1 - b2) / (this.slopes[s2] - line.slopes[s1]);
                y = x * line.slopes[s1] + b1;
            }
            return (x && y) ? Bread.point({ x: x, y: y }) : null;
        }
    };

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
;/* Module file: src/arc.js */
(function(w, Bread) {

var error, Body, Point, ArcMix;
    error = Bread.error();
    Body = Bread.Body;
    Point = Bread.Point;
    error.filename = 'arc.js';

    if (!Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Point) {
        error.show(error.include('You must include point module'));
        return false;
    }

    function Arc(attrs) {
        /*Arc base mixin*/
        try {
            if (!Bread.isNumber(attrs.radius)) throw error.type('radius must be a number');
            if (!Bread.isNumber(attrs.startAngle)) throw error.type('startAngle must be a number');
            if (!Bread.isNumber(attrs.endAngle)) throw error.type('endAngle must be a number');
            if (!init.call(this, attrs)) throw error.type('error in position');
        } catch (e) {
            error.show(e);
        }
    }

    function arc(attrs) {

        return new ArcMix({
            x: attrs.x,
            y: attrs.y,
            radius: attrs.radius,
            startAngle: attrs.startAngle,
            endAngle: attrs.endAngle
        });
    }

    function init(attrs) {
        if (!this.x || !this.y) return;
        this.defRaduis = attrs.radius;
        this.fill = attrs.fill;
        this.startAngle = attrs.startAngle;
        this.endAngle = attrs.endAngle;
        this.anticlock = this.anticlock || false;
        return this;
    }
    Arc.prototype = {
        render: function() {
            this.validateContext();
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlock);
            this.context.closePath();
            fillArc.call(this);
        }
    }

    Object.defineProperty(Arc.prototype, 'defRaduis', {
        set: function(radius) {
            try {
                if (!Bread.isNumber(radius)) throw error.type('radius must be a number');
                this.radius = radius;
            } catch (e) {
                error.show(e);
            }
        }
    });

    function fillArc() {

        if (this.fill) {
            this.context.fillStyle = this.fill;
            this.context.fill();
        }
        this.context.strokeStyle = this.stroke || '#000';
        this.context.stroke();

    }

    ArcMix = Bread.augment(Body, [Point, Arc]);
    Bread.arc = arc;
    Bread.Arc = ArcMix;

})(window, window.Bread)
;/* Module file: src/circle.js */
(function(w, Bread) {

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

    function Circle(attrs) {
        /*Circle base mixin*/
        try {
            if (!Bread.isNumber(attrs.radius)) throw error.type('radius must be a number');
            if (!init.call(this, attrs)) throw error.type('error in position');
        } catch (e) {
            error.show(e);
        }
    }

    function circle(attrs) {
        return new CircleMix({
            x: attrs.x,
            y: attrs.y,
            radius: attrs.radius
        });

    }

    function init(attrs) {
        if (!this.x || !this.y) return;
        this.defRaduis = attrs.radius;
        this.fill = attrs.fill;
        this.anticlock = true;
        return this;
    }

    Circle.prototype = {

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

    Object.defineProperty(Circle.prototype, 'startAngle', {
        'enumerable': true,
        'value': 0
    });
    Object.defineProperty(Circle.prototype, 'endAngle', {
        'enumerable': true,
        'value': 2 * Pi
    });

    CircleMix = Bread.augment(Body, [Arc, Circle]);
    Bread.circle = circle;
    Bread.Circle = CircleMix;

})(window, window.Bread)
;/* Module file: src/rectangle.js */
(function(w, Bread) {

var error, Body, Line, RectangleMix;
    error = Bread.error();
    Body = Bread.Body;
    Line = Bread.Line;
    RectangleMix;
    error.filename = 'rectangle.js';

    if (!Bread.Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Bread.Line) {
        error.show(error.include('You must include line module'));
        return false;
    }

    function Rectangle(attrs) {
        /*Rectangle base mixin*/
        try {
            if (!Bread.isNumber(attrs.width)) throw error.type('width must be a number');
            if (!Bread.isNumber(attrs.height)) throw error.type('height must be a number');
            if (!init.call(this, attrs)) throw error.type('error in position');

        } catch (e) {
            error.show(e);
        }
    }

    function rectangle(attrs) {
        return new RectangleMix({
            x: attrs.x,
            y: attrs.y,
            angle: attrs.angle || 0
        });
    }

    function init(attrs) {
        if (!this.x || !this.y) return ;
        this.defWidth = attrs.width;
        this.defHeight = attrs.height;
        return this;
    }

    Rectangle.prototype = {
        render: function() {
            this.validateContext();
            this.context.beginPath();
            this.context.lineWidth = this.lineWidth || 1;
            rectRotation.call(this);
            drawRect.call(this);
        }
    }

    Object.defineProperty(Rectangle.prototype, 'defWidth', {
        set: function(width) {
            try {
                if (!Bread.isNumber(width)) throw error.type('width must be a number');
                this.x -= width + (((1 - Math.ceil(Math.abs(width) / width)) / 2) * width);
                this.width = width;
            } catch (e) {
                error.show(e);
            }
        }
    });
    Object.defineProperty(Rectangle.prototype, 'defHeight', {
        set: function(height) {
            try {
                if (!Bread.isNumber(height)) throw error.type('height must be a number');
                this.y -= height + (((1 - Math.ceil(Math.abs(height) / height)) / 2) * height);
                this.height = height;
            } catch (e) {
                error.show(e);
            }
        }
    });

    function drawRect() {
        if (this.stroke) {
            this.context.strokeStyle = this.stroke || '#000';
            this.context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.context.stroke();
        } else if (this.fill) {
            this.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        this.context.restore();
    }

    function rectRotation() {
        this.context.save();
        this.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
        this.context.rotate(this.angle);
    }

    RectangleMix = Bread.augment(Body, [Line, Rectangle]);
    Bread.rectangle = rectangle;
    Bread.Rectangle = RectangleMix;

})(window, window.Bread)
;/* Module file: src/groups.js */
(function(w, Bread) {

var error = Bread.error();
    error.filename = 'groups.js';

    if (!w.Bread) {
        error.include('You must include Bread');
        error.show();
        return false;
    }

    function Group() {
        /*Group Class*/
    }

    function groupFact() {
        return Bread.augment(Array, [Group]);
    }

    function cloneProperty() {
        var i;
        for (i in this) {
            if (Bread.isBody(this[i])) this[i] = this[i].clone();
            if (Bread.isArray(this[i])) this[i] = Group.prototype.clone.call(this[i]);
        }
        return this;
    }

    function _createGroup(body, attrs, len) {
        var b = 0;
        while (b < len) {
            if (Bread.isObject(attrs)) {
                attrs = cloneProperty.call(attrs);
                this.push(body(attrs));
            } else {
                this.push(body[b]);
            }
            b++;
        }
        return this;
    }

    function group(body, attrs, len) {
        var extended, instance;
        extended = groupFact();
        instance = new extended();
        if (body) {
            return _createGroup.call(instance, body, attrs, len);
        }
    }

    function groups() {

        return {
            points: function(attrs, len) {
                var body, att;
                body = Bread.point;
                att = {
                    x: attrs.x,
                    y: attrs.y
                };
                return group(body, att, len);
            },
            circles: function(attrs, len) {
                var body, att;
                body = Bread.circle;
                att = {
                    x: attrs.x,
                    y: attrs.y,
                    radius: attrs.radius,
                    fill: attrs.fill || false
                };
                return group(body, att, len);
            },
            arcs: function(attrs, len) {
                var body, att;
                body = Bread.arc;
                att = {
                    x: attrs.x,
                    y: attrs.y,
                    radius: attrs.radius,
                    startAngle: attrs.startAngle,
                    endAngle: attrs.endAngle,
                    fill: attrs.fill || false,
                }
                return group(body, att, len);
            },
            rectangles: function(attrs, len) {
                var body, att;
                body = Bread.rectangle;
                att = {
                    x: attrs.x,
                    y: attrs.y,
                    width: attrs.width,
                    height: attrs.height
                };
                return group(body, att, len);
            },
            lines: function(attrs, len) {
                var body, att;
                body = Bread.line;
                att = {
                    x: attrs.x,
                    y: attrs.y,
                    points: attrs.points
                };
                return group(body, att, len);
            }
        }
    }
    Group.prototype = {

        render: function() {
            Bread.forEach(this, function(body) {
                body.render();
            })
        },
        add: function(objects) {
            var grp = this;
            if (Bread.isObject(objects)) {
                this.push(objects)
            }
            if (Bread.isArray(objects)) {
                Bread.forEach(objects, function(obj) {
                    grp.push(obj);
                });
            }
        },
        accelerate: function(acc) {
            var b, bodies;
            bodies = this;
            b = 0;
            Bread.forEach(acc, function(a) {
                bodies[b].accelerate(a.x, a.y);
                b++;
            });
        },
        bounce: function(bn) {
            var b, bodies;
            bodies = this;
            b = 0;
            Bread.forEach(bn, function(a) {
                bodies[b].bounce(a.x, a.y);
                b++;
            });
        },
        impulse: function(speed, friction, angle) {
            var b, bodies;
            bodies = this;
            b = 0;
            Bread.forEach(bn, function(a) {
                bodies[b].impulse(a.speed, a.friction, a.angle);
                b++;
            });
        },
        move: function() {
            Bread.forEach(this, function(b) {
                b.move();
            });
        },
        clone: function() {
            var cloned = this.slice();
            cloned = Bread.map(cloned, function(b) {
                return b.clone();
            });
            return cloned;
        }
    }

    Bread.Group = Bread.augment(Array, [Group]);
    Bread.group = function(attrs) {
        return group(attrs, undefined, attrs.length);
    };
    Bread.groups = groups();

})(window, window.Bread)
;/* Module file: src/random.js */
(function(w, Bread) {

var error = Bread.error();

    if (!w.Bread) {
        error.show(error.include('You must include Bread'));
        return false;
    }

    var Random = (function() {

        function _biase(distribution, step, lowerBound) {
            var sum, index, seed, closeness, sel;
            index = 0;
            sum = 0;
            seed = Math.random(); //seed declaration for 'picking up' a band.
            while (index < distribution.length) {
                sum += distribution[index];
                closeness = sum - (seed * 100);
                if (closeness > 0) {
                    sel = parseInt(index) * step;
                    break;
                }
                index++;
            }
            return lowerBound + sel;
        }

        return {
            rand: function(ini, fin) {
                try {
                    if (!Bread.isNumber(ini)) throw error.type('Incorrect data type sent in random');
                    if (!Bread.isNumber(fin)) throw error.type('Incorrect data type sent in random');

                    var number = Math.random();
                    fin -= ini;
                    fin *= number;
                    return ini + fin;
                } catch (e) {
                    error.show(e);
                }
            },
            randomInPortions: function() {
                /*Returns a random number between a specific range selected from the function arguments*/
                try {
                    var pos = Math.round(Math.random() * (arguments.length - 1)),
                        number = Math.random(),
                        range = arguments[pos];

                    if (!Bread.isNumber(range[0])) throw error.type('Incorrect data type sent in random-in-portions');
                    if (!Bread.isNumber(range[1])) throw error.type('Incorrect data type sent in random-in-portions');
                    /*It uses the random formula*/
                    range[1] -= range[0];
                    range[1] *= number;
                    return range[1] + range[0];
                } catch (e) {
                    error.show(e);
                }
            },
            randomBiased: function(step, lowerBound, upperBound, distribution) {
                /*Returns a random number between the lower bound and the upper bound by setting a 
                'weight' of probability in the distribution list for each band*/
                try {
                    var stepSelected, diference, closeness, band;
                    if (band / step > distribution.length || band / step < distribution.length) {
                        throw error.type('Missmatch between the distribution length and band-width, no operation performed');
                    }
                    stepSelected = 0;
                    diference = 0;
                    closeness = 0;
                    band = (upperBound - lowerBound);

                    return _biase(distribution, step, lowerBound);
                } catch (e) {
                    error.show(e);
                }
            },
            shuffle: function(arr) {

                try {
                    var elm = 0,
                        stack = [];
                    while (arr.length > 0) {

                        elm = Math.round(Math.random() * (arr.length - 1));
                        stack.push(arr[elm]);
                        arr.splice(elm, 1);
                    }
                    return stack;
                } catch (e) {
                    error.show(e);
                }
            }
        };
    })();

    Bread.random = Random;

})(window, window.Bread)
;/* Module file: src/text.js */
(function(w, Bread) {

var error = Bread.error();
    error.filename = 'text.js';

    if (!w.Bread) {
        error.include('You must include Bread');
        error.show();
        return false;
    }

    function text(attrs) {
        return new Text(attrs);
    }

    function Text(attrs) {
        try {
            if (!attrs.text) throw error.declare('string text is not defined');
            this.text = attrs.text;
            this.x = attrs.x || 0;
            this.y = attrs.y || 0;
            this.fill = attrs.fill || false;
            this.textBaseline = attrs.textBaseline || '';
            this.font = attrs.font || "3px serif";
            this.maxWidth = attrs.maxWidth || 0;
        } catch (e) {
            error.show(e);
        }
    }

    Text.prototype = {
        render: function() {
            Bread.Body.prototype.validateContext.call(this);
            this.context.font = this.font;
            this.context.beginPath();
            if (this.textBaseline) this.context.textBaseline = this.textBaseline;
            if (this.fill) {
                this.context.fillStyle = this.fill;
                this.context.fillText(this.text, this.x, this.y);
            } else {
                this.context.strokeText(this.text, this.x, this.y);
            }
            this.context.closePath();
        }
    }

    Bread.Text = Text;
    Bread.text = text;

})(window, window.Bread)
