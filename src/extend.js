(function(w, Bread) {

    'use strict';
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
