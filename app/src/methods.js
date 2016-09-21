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

                function pick(collection, field) {
                    if (c >= 0) {
                        plucked.push(collection[c][field]);
                        c--;
                        return pick(collection, field);
                    } else {
                        return plucked;
                    }
                }
                return pick(collection, field);
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

                function find(collection, prop) {
                    var property;
                    var p = properties.length - 1;
                    if (c >= 0) {
                        for (; p >= 0; p--) {
                            property = properties[p];
                            if (collection[c][property] !== prop[property]) break;
                        }
                        if (p < 0) filtered.push(collection[c]);
                        c--;
                        return find(collection, prop);
                    } else {
                        return (filtered.length > 0) ? filtered : undefined;
                    }
                }
                return find(collection, prop);
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

                function group(collection, iterate) {

                    if (c >= 0) {
                        value = collection[c];
                        iter = (isFn) ? iterate(value) : value[iterate];
                        if (iter in grouped) {
                            grouped[iter].push(value);
                        } else {
                            grouped[iter] = [value];
                        }
                        c--;
                        return group(collection, iterate);
                    } else {
                        return grouped;
                    }
                }

                return group(collection, iterate);

            } catch (e) {
                error.show(e);
            }
        }
    };

    Bread.methods = methods;

})(window, Bread)
