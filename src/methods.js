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
