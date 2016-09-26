(function(w, Bread) {

    'use strict';
    var error = Bread.error;
    var forEach = Bread.methods.forEach;
    error.filename = 'body';

    if (!w.Bread) {
        error.show(error.include('You must include Bread module'));
        return false;
    }

    function augment(Base, mixins) {

        if (!(mixins instanceof Array)) {
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
