(function(w) {

    'use strict';

    var Bread = {
        v: '0.0.0',
        universe: CreateUniverse
    }

    var context;

    function CreateUniverse(attrs) {

        return new Universe(attrs);
    }

    /*Private attributes*/
    var bodies = [];
    /*Universe Public methods and attributes*/
    Universe.prototype = {
        addIt: function(body) {

            if (!(body instanceof Bread.Body)) {
                console.error('Incorrect input argument in add-it!');
                return false;
            }
            for (var bd in bodies) {
                if (bodies[bd] == body) {
                    console.error('Duplicate objects in enviromet!');
                    return false;
                }
            }
            bodies.push(body);
            body.context = context;
        },
        addGroup: function(group) {

            if (typeof group != 'object' && !(group instanceof Array)) {
                console.error('Incorrect input argument in add-it!');
                return false;
            }

            group.forEach(function(body, index) {
                for (var bdy in bodies) {
                    if (bodies[bdy] == body) {
                        console.error('Duplicate objects in enviromet!');
                        return false;
                    }
                }
                bodies.push(body);
                body.context = context;

            });

        },
        removeIt: function(body) {

            if (!(body instanceof Bread.Body)) {
                console.error('Incorrect input argument in remove-it!');
                return false;
            }
            for (var bdy in bodies) {
                if (bodies[bdy] == body)
                    bodies.splice(1, bdy);
            };
            body.context = undefined;
        },
        animation: function(cfn) {

            var local = this;
            var canvas = local.el;

            function animate() {
                setTimeout(Animation, local.frate);
            }

            function Animation() {
                requestAnimationFrame(animate);
                context.clearRect(0, 0, canvas.width, canvas.height);
                cfn.call(local);
            }
            animate();
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
;(function(w, Bread) {

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
    Bread.error = errors();

})(window, window.Bread);(function(w, Bread) {

    var error = Bread.error;
    error.filename = 'methods.js';

    if (!w.Bread) {
        error.include('You must include Bread');
        error.show();
        return false;
    }

    var methods = {

        isNumber: function(variable) {
            return typeof variable === 'number';
        },
        isBody: function(variable) {
            return variable instanceof Bread.Body;
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
        pluck: function(collection, field) {

            try {
                if (!Bread.methods.isArray(collection)) throw error.type('List must be an Array.');
                var c = collection.length - 1;
                var plucked = [];

                function _pick(collection, field) {
                    if (c >= 0) {
                        plucked.push(collection[c][field]);
                        c--;
                        return _pick(collection, field);
                    } else {
                        return plucked;
                    }
                }
                return _pick(collection, field);
            } catch (e) {
                error.show(e);
            }
        },
        where: function(collection, prop) {

            try {
                if (!prop || !(prop instanceof Object)) throw error.type('The second parameter must be an object');
                if (!Bread.methods.isArray(collection)) throw error.type('List must be an Array.');
                var properties = Object.getOwnPropertyNames(prop);
                var c = collection.length - 1;
                var filtered = [];

                function _find(collection, prop) {
                    var property;
                    var p = properties.length - 1;
                    if (c >= 0) {
                        for (; p >= 0; p--) {
                            property = properties[p];
                            if (collection[c][property] !== prop[property]) break;
                        }
                        if (p < 0) filtered.push(collection[c]);
                        c--;
                        return _find(collection, prop);
                    } else {
                        return (filtered.length > 0) ? filtered : undefined;
                    }
                }
                return _find(collection, prop);
            } catch (e) {
                error.show(e);
            }
        },
        isObject: function(variable) {
            return variable.toString() == '[object Object]';
        },
        groupBy: function(collection, iterate) {

            try {
                var isStr = Bread.methods.isString(iterate);
                var isFn = Bread.methods.isFunction(iterate);
                if (!iterate && !isFn && !isStr) throw error.type('Iterate must be a string or function');
                if (!Bread.methods.isArray(collection)) throw error.type('List must be an Array.');
                var c = collection.length - 1;
                var grouped = {};
                var iter;
                var value;

                function _group(collection, iterate) {

                    if (c >= 0) {
                        value = collection[c];
                        iter = (isFn) ? iterate(value) : value[iterate];
                        if (iter in grouped) {
                            grouped[iter].push(value);
                        } else {
                            grouped[iter] = [value];
                        }
                        c--;
                        return _group(collection, iterate);
                    } else {
                        return grouped;
                    }
                }

                return _group(collection, iterate);

            } catch (e) {
                error.show(e);
            }
        },
        forEach: function(collection, fn) {
            try {

                if (!Bread.methods.isArray(collection)) throw error.type('List must be an Array.');
                if (!Bread.methods.isFunction(fn)) throw error.type('Iterate must be a function');
                var c = 0;

                function _each(collection) {
                    if (c < collection.length) {
                        fn(collection[c], c);
                        c++;
                        return _each(collection);
                    } else {
                        return undefined;
                    }
                }

                _each(collection);

            } catch (e) {
                error.show(e);
            }
        },
        map: function(collection, iterate) {
            try {

                if (!Bread.methods.isArray(collection)) throw error.type('List must be an Array.');
                if (!Bread.methods.isFunction(iterate)) throw error.type('Iterate must be a function');
                var c = 0;
                var mapped = [];

                function _map(collection) {
                    if (c < collection.length) {
                        mapped.push(iterate(collection[c], c));
                        c++;
                        return _map(collection);
                    } else {
                        return mapped;
                    }
                }

                return _map(collection);

            } catch (e) {
                error.show(e);
            }
        }
    };

    Bread.methods = methods;

})(window, window.Bread)
;(function(w, Bread) {

    'use strict';
    var error = Bread.error;
    var forEach = Bread.methods.forEach;
    var isArray = Bread.methods.isArray;
    
    error.filename = 'augment.js';

    if (!w.Bread) {
        error.show(error.include('You must include Bread module'));
        return false;
    }

    function augment(Base, mixins) {

        if (!isArray(mixins)) {
            error.show(error.type('mixins must be an Array'));
            return false;
        }

        function Extended() {
            Base.apply(this, arguments);
        }

        Extended.prototype = Object.create(Base.prototype);
        Extended.constructor = Base;

        forEach(mixins, function(mixin, index) {
            mix(Extended.prototype, mixin.prototype);
        });

        return Extended;
    }

    function mix(base, child) {
        var props = Object.getOwnPropertyNames(child);
        var p = props.length - 1;

        function _merge() {
            if (p >= 0) {
                var propName = props[p];
                var propDesc = Object.getOwnPropertyDescriptor(child, propName);
                Object.defineProperty(base, propName, propDesc);
                p--;
                return _merge();
            } else {
                return true;
            }
        }
        return _merge();
    }

    Bread.augment = augment;

})(window, window.Bread)
;(function(w, Bread) {

    'use strict';
    var error = Bread.error;
    var forEach = Bread.methods.forEach;
    var isArray = Bread.methods.isArray;

    error.filename = 'extend.js';


    function extend(Base, objects) {
        var Base = Base;
        var i;

        if (!isArray(objects)) {
            error.show(error.type('objects must be an Array'));
            return false;
        }

        forEach(objects, function(object) {

            var properties = Object.getOwnPropertyNames(object);
            i = properties.length - 1;
            _merge(object, properties);
        });

        function _merge(object, properties) {
            if (i >= 0) {
                var propName = properties[i]
                var propDesc = Object.getOwnPropertyDescriptor(object, propName);
                Object.defineProperty(Base, propName, propDesc);
                i--;
                return _merge(object, properties);
            } else {
                return Base;
            }
        }
    }

    Bread.extend = extend;

})(window, window.Bread)
;(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    var isBody = Bread.methods.isBody;
    error.filename = 'body.js';

    if (!w.Bread) {
        error.show(error.include('You must include Bread'));
        return false;
    }

    function Body(attrs) {
        /*Body base class*/
        try {
            if (!isNumb(attrs.x)) throw error.type('x must be a number');
            if (!isNumb(attrs.y)) throw error.type('y must be a number');
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
    Body.prototype = {
        accelerate: function(accx, accy) {

            try {

                if (!isNumb(accx)) throw error.type('x acceleration must be a number');
                if (!isNumb(accy)) throw error.type('y acceleration must be a number');
                this.x += this.xspeed, this.xspeed += accx;
                this.y += this.yspeed, this.yspeed += accy;

            } catch (e) {
                error.show(e);
            }
        },
        bounce: function(bnx, bny) {

            try {

                if (!isNumb(bnx)) throw error.type('x bounce must be a number');
                if (!isNumb(bny)) throw error.type('y bounce must be a number');
                this.xspeed = bnx;
                this.yspeed = bny;
                this.speed = Math.sqrt(Math.pow(bnx, 2) + Math.pow(bny, 2));

            } catch (e) {
                error.show(e);
            }
        },
        impulse: function(speed, friction, angle) {

            try {

                if (!isNumb(speed)) throw error.type('speed impulse must be a number');
                if (!isNumb(friction)) throw error.type('friction impulse must be a number');
                if (!isNumb(angle)) throw error.type('angle impulse must be a number');

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
        }
    }

    Bread.Body = Body;
})(window, window.Bread);(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    var isBody = Bread.methods.isBody;
    error.filename = 'point.js';

    if (!Bread.Body) {
        error.show(error.include('You must include body module'));
        return false;
    }

    /*Private properties*/

    var xgoes = 1;
    var ygoes = 1;
    var queuedir = [];

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

            var extended = primitive();
            var instance = new extended({
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

    function primitive() {
        var Body = Bread.Body;
        return Bread.augment(Body, [Point]);
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

    Bread.point = point;
    Bread.Point = primitive();

})(window, window.Bread)
;(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isBody = Bread.methods.isBody;
    var isNumber = Bread.methods.isNumber;
    var inRange = Bread.methods.inRange;
    var pluck = Bread.methods.pluck;
    var Pi = Math.PI;

    error.filename = 'line.js';

    if (!Bread.Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Bread.Point) {
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
                var dirLine, cutPnt, flag;
                for (; p < this.allPoints.length; p++) {
                    dirLine = guidePoint.call(this, p);
                    cutPnt = line.cutPoints(dirLine, p, p);
                    d = this.allPoints[p].distance(cutPnt);
                    sortX = pluck(line.allPoints, 'x').sort(compare);
                    sortY = pluck(line.allPoints, 'y').sort(compare);
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
            Bread.Body.prototype.move.call(this);
            this.firstPoint.update(this.x, this.y);

            for (; p >= 0; p--) {
                this.points[p].speed = this.speed;
                this.points[p].angle = this.angle;
                this.points[p].move();
            }
        },
        cutPoints: function(line, n1, n2) {
            /*Get cut points of interpolated lines*/
            var points = this.allPoints;
            var s1 = (n1 >= points.length - 1) ? n1 - 1 : n1;
            var s2 = (n2 >= points.length - 1) ? n2 - 1 : n2;
            var b1 = getYIntersec.call(line, n1, s1);
            var b2 = getYIntersec.call(this, n2, s2);
            var x, y;

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

            function _calculate(points) {

                if (p > 0) {
                    perimeter += points[p].distance(points[p - 1]);
                    p--;
                    return _calculate(points);
                } else {
                    return perimeter;
                }
            }
            return _calculate(this.points)
        }
    });

    Object.defineProperty(Line.prototype, 'slopes', {

        get: function() {
            var points = this.allPoints;
            var p = points.length - 1;
            var slopes = []
            var line = this;

            function _calculate(points) {
                if (p > 0) {
                    var slope = (points[p].y - points[p - 1].y) / (points[p].x - points[p - 1].x)
                    slopes.push(slope);
                    p--;
                    return _calculate(points);
                } else {
                    return slopes;
                }
            }
            return _calculate(points)
        }
    });

    function drawPoints(points) {
        var p = points.length - 1;
        var line = this;

        function _draw(points) {
            if (p >= 0) {
                line.context.lineTo(points[p].x, points[p].y);
                p--;
                return _draw(points);
            } else {
                return true;
            }
        }
        return _draw(points);
    }

    function compare(a, b) {
        return a - b;
    }

    function guidePoint(p) {
        var point = this.allPoints[p];
        point.angle = this.angle;
        return point.directionLine();
    }

    function perpendicularSlopes(slopes) {
        var s = slopes.length - 1;
        var perpnSlopes = [];

        function _perpendicular(slopes) {
            if (s >= 0) {
                try {
                    if (!isNumber(slopes[s])) throw error.type('slope must be a number');
                    var angle = Math.atan(slopes[s]);
                    perpnSlopes.push(angle + (Pi / 2));
                    return _perpendicular(slopes);
                } catch (e) {
                    error.show(e);
                }
            } else {
                return perpnSlopes;
            }
        }
        return _perpendicular(slopes);
    }

    function getYIntersec(n, s) {

        var slopes = this.slopes;
        var points = this.allPoints;

        return points[n].y - points[n].x * slopes[s];
    }

    Bread.line = line;
    Bread.Line = primitive();

})(window, window.Bread)
;(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    var isBody = Bread.methods.isBody;

    error.filename = 'arc.js';

    if (!Bread.Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Bread.Point) {
        error.show(error.include('You must include point module'));
        return false;
    }

    function Arc() {
        /*Arc base mixin*/
    }

    function arc(attrs) {

        try {
            if (!isNumb(attrs.radius)) throw error.type('radius must be a number');
            if (!isNumb(attrs.startAngle)) throw error.type('startAngle must be a number');
            if (!isNumb(attrs.endAngle)) throw error.type('endAngle must be a number');

            var extended = primitive();
            var instance = new extended({
                x: attrs.x,
                y: attrs.y
            });
            if (!instance.x || !instance.y) throw error.declare('error in position');
            instance.defRaduis = attrs.radius;
            instance.fill = attrs.fill;
            instance.startAngle = attrs.startAngle;
            instance.endAngle = attrs.endAngle;
            instance.anticlock = instance.anticlock || false;

            return instance;
        } catch (e) {
            error.show(e);
        }
    }

    function primitive() {
        var Body = Bread.Body;
        var Point = Bread.Point;
        return Bread.augment(Body, [Arc, Point]);
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
                if (!isNumb(radius)) throw error.type('radius must be a number');
                this.radius = radius;
            } catch (e) {
                error.show(e);
            }
        }
    });

    function fillArc() {

        if (this.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    Bread.arc = arc;
    Bread.Arc = primitive();

})(window, window.Bread)
;(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    var isBody = Bread.methods.isBody;
    var Pi = Math.PI;

    error.filename = 'circle.js';

    if (!Bread.Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Bread.Arc) {
        error.show(error.include('You must include arc module'));
        return false;
    }

    function Circle() {
        /*Circle base mixin*/
    }

    function circle(attrs) {
        try {
            if (!isNumb(attrs.radius)) throw error.type('radius must be a number');
            var Body = Bread.Body;
            var Arc = Bread.Arc;
            var extended = primitive();
            var instance = new extended({
                x: attrs.x,
                y: attrs.y
            });
            if (!instance.x || !instance.y) throw error.declare('error in position');
            instance.defRaduis = attrs.radius;
            instance.fill = attrs.fill;
            instance.startAngle = 0;
            instance.endAngle = 2 * Pi;
            instance.anticlock = true;
            return instance;

        } catch (e) {
            error.show(e);
        }
    }

    function primitive() {

        var Body = Bread.Body;
        var Arc = Bread.Arc;
        return Bread.augment(Body, [Circle, Arc]);
    }

    Circle.prototype = {

        collision: function(circle) {
            try {

                if (!isBody(circle)) throw error.type('circle must be a body');
                if (!circle.radius) throw error.type('radius must be a number');
                var radius = this.radius;
                var radiusV = circle.radius; //Visitor's radius
                var hypotenuse = this.distance(circle);

                return (hypotenuse <= (radius + radiusV));

            } catch (e) {
                error.show(e);
            }
        }
    }

    Bread.Circle = primitive();
    Bread.circle = circle;

})(window, window.Bread)
;(function(w, Bread) {

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    error.filename = 'groups.js';

    if (!w.Bread) {
        error.include('You must include Bread');
        error.show();
        return false;
    }

    function Group() {

    }

    function primitive() {
        return Bread.augment(Array, [Group]);
    }

    function groups() {
        var b = 0;

        function _createGroup(body, attrs, len) {

            if (b < len) {

                this.push(body(attrs));
                b++;
                return _createGroup.call(this, body, len);
            } else {
                b = 0;
                return this;
            }
        }

        function group(body, attrs, len) {

            var extended = primitive();
            var instance = new extended();
            if (body) {
                return _createGroup.call(instance, body, attrs, len);
            }
        }

        return {
            points: function(attrs, len) {
                var body = Bread.point;
                var att = {
                    x: attrs.x,
                    y: attrs.y
                };
                return group(body, att, len);
            },
            circles: function(attrs, len) {
                var body = Bread.circle;
                var att = {
                    x: attrs.x,
                    y: attrs.y,
                    radius: attrs.radius,
                    fill: attrs.fill || false
                };
                return group(body, att, len);
            },
            arcs: function(attrs, len) {
                var body = Bread.arc;
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
                var body = Bread.rectangle;
                var att = {
                    x: attrs.x,
                    y: attrs.y,
                    width: attrs.width,
                    height: attrs.height
                };
                return group(body, att, len);
            },
            lines: function(attrs, len) {
                var body = Bread.line();
                var att = {
                    x: attrs.x,
                    y: attrs.y,
                    points: attrs.points
                };
                return group(body, att, len);
            }
        }
    }
    Group.prototype = {

        setAt: function() {

        },
        render: function() {
            this.forEach(function(body) {
                body.render();
            })
        }
    }

    Bread.Group = primitive();
    Bread.groups = groups();

})(window, window.Bread)
;(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumber = Bread.methods.isNumber;

    if (!w.Bread) {
        error.show(error.include('You must include Bread'));
        return false;
    }

    var Random = {
        rand: function(ini, fin) {
            try {
                if (!isNumber(ini)) throw error.type('Incorrect data type sent in random');
                if (!isNumber(fin)) throw error.type('Incorrect data type sent in random');

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

                if (!isNumber(range[0])) throw error.type('Incorrect data type sent in random-in-portions');
                if (!isNumber(range[1])) throw error.type('Incorrect data type sent in random-in-portions');
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
                var sum = 0;
                var stepSelected = 0;
                var seed = 0;
                var diference = 0;
                var closeness = 0;
                var index = 0;
                var band = (upperBound - lowerBound);

                if (band / step > distribution.length - 1 || band / step < distribution.length - 1) {
                    throw error.type('Missmatch between the distribution length and band-width, no operation performed');
                }

                seed = Math.random(); //seed declaration for 'picking up' a band.
                function _biase(distribution) {
                    if (index < distribution.length) {
                        sum += distribution[index];
                        closeness = sum - (seed * 100);
                        if (closeness > 0) {
                            stepSelected = parseInt(index) * step;
                            return lowerBound + stepSelected;
                        }
                        index++;
                    } else {
                        return lowerBound + stepSelected;
                    }
                }

                return _biase(distribution);
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

    Bread.random = Random;

})(window, window.Bread)
