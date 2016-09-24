(function(w, Bread) {

    var error = Bread.error;
    error.filename = 'groups';

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
        }
    };

    Bread.methods = methods;

})(window, Bread)