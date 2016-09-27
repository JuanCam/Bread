(function(w, Bread) {

    'use strict';
    var error = Bread.error;
    var forEach = Bread.methods.forEach;
    error.filename = 'extend.js';

    function extend(Base, objects) {
        var Base = Base;
        var i;

        if (!(objects instanceof Array)) {
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