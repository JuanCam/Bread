'use strict';
/*
Name: breadjs@0.0.32
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

            if (!(body instanceof Bread.Body)) {
                console.error('Incorrect input argument in add-it!');
                return false;
            }

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

            if (!(body instanceof Bread.Body)) {
                console.error('Incorrect input argument in remove-it!');
                return false;
            }
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

        if (!Bread.isArray(mixins)) {
            error.show(error.type('mixins must be an Array'));
            return false;
        }

        function CoreBase() {
            Base.apply(this, arguments);
        }

        CoreBase.prototype = Object.create(Base.prototype);//Chain
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
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
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

var error, Body, PointMix, queuedir;
    error = Bread.error();
    Body = Bread.Body;

    error.filename = 'point.js';

    if (!Body) {
        error.show(error.include('You must include body module'));
        return false;
    }

    /*Private properties*/
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
        xgoes: 1,
        ygoes: 1,
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

    Object.defineProperty(Point.prototype, 'point', {
        'enumerable': true,
        'value': true
    });
    Object.defineProperty(Point.prototype, 'reachPnt', {
        'enumerable': false,
        'value': undefined
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


    function Line() {
        /*Line base mixin*/
    }

    function line(attrs) {
        try {
            if (!attrs.points) throw error.type('points must be defined');
            if (attrs.points.length <= 0) throw error.type('points list must have at least one element');
            /*Create an object for the first point*/
            var instance = new LineMix({
                x: attrs.x,
                y: attrs.y
            });
            return init.call(instance, attrs);

        } catch (e) {
            error.show(e);
        }
    }

    function init(attrs) {
        if (!this.x || !this.y) return;
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

    Object.defineProperty(Line.prototype, 'line', {
        'enumerable': true,
        'value': true
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

    LineMix = Bread.augment(Body, [Line, Point]);
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

    function Arc() {
        /*Arc base mixin*/
    }

    function arc(attrs) {

        try {
            if (!Bread.isNumber(attrs.radius)) throw error.type('radius must be a number');
            if (!Bread.isNumber(attrs.startAngle)) throw error.type('startAngle must be a number');
            if (!Bread.isNumber(attrs.endAngle)) throw error.type('endAngle must be a number');
            var instance = new ArcMix({
                x: attrs.x,
                y: attrs.y
            });
            return init.call(instance, attrs);
        } catch (e) {
            error.show(e);
        }
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


    Object.defineProperty(Arc.prototype, 'arc', {
        'enumerable': true,
        'value': true
    });

    function fillArc() {

        if (this.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    ArcMix = Bread.augment(Body, [Arc, Point]);
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

    function Circle() {
        /*Circle base mixin*/
    }

    function circle(attrs) {
        try {
            if (!Bread.isNumber(attrs.radius)) throw error.type('radius must be a number');

            var instance = new CircleMix({
                x: attrs.x,
                y: attrs.y
            });
            return init.call(instance, attrs);

        } catch (e) {
            error.show(e);
        }
    }

    function init(attrs) {
        if (!this.x || !this.y) return;
        this.defRaduis = attrs.radius;
        this.fill = attrs.fill;
        this.anticlock = true;
        return this;
    }

    Circle.prototype = {

        startAngle: 0,
        endAngle: 2 * Pi,
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

    Object.defineProperty(Circle.prototype, 'circle', {
        'enumerable': true,
        'value': true
    });

    CircleMix = Bread.augment(Body, [Circle, Arc]);;
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

    function Rectangle() {
        /*Rectangle base mixin*/
    }

    function rectangle(attrs) {
        try {
            if (!Bread.isNumber(attrs.width)) throw error.type('width must be a number');
            if (!Bread.isNumber(attrs.height)) throw error.type('height must be a number');
            var instance = new RectangleMix({
                x: attrs.x,
                y: attrs.y,
                angle: attrs.angle || 0
            });
            return init.call(instance, attrs);

        } catch (e) {
            error.show(e);
        }
    }

    function init(attrs) {
        if (!this.x || !this.y) return false;
        this.defWidth = attrs.width;
        this.defHeight = attrs.height;
        return true;
    }

    Rectangle.prototype = {
        render: function() {

            this.validateContext();
            this.context.save();
            this.context.beginPath();
            this.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
            this.context.rotate(this.angle);
            this.context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.context.restore();
            fillRect.call(this);
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

    Object.defineProperty(Rectangle.prototype, 'rectangle', {
        'enumerable': true,
        'value': true
    });

    function fillRect() {

        if (this.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    RectangleMix = Bread.augment(Body, [Rectangle, Line]);
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

    function _createGroup(body, attrs, len) {
        var b = 0;
        while (b < len) {
            if (Bread.isObject(attrs)) {
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
                body = Bread.line();
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
        }
    }

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
            this.fill = this.fill || false;
            this.textBaseline = this.textBaseline || '';
            this.font = attrs.font || "3px serif";
            this.maxWidth = attrs.maxWidth || 0;
        } catch (e) {
            error.show(e);
        }
    }

    Text.prototype = {
        render: function() {
            Bread.Body.validateContext.call(this);
            this.context.font = this.font;
            if (this.textBaseline) this.context.textBaseline = this.textBaseline;
            if (this.fill) {
                this.context.fillText(this.text, this.x, this.y);
            } else {
                this.context.strokeText(this.text, this.x, this.y);
            }
        }
    }

    Bread.Text = Text;
    Bread.text = text;

})(window, window.Bread)
