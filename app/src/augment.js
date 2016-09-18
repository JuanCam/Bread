(function(w, Bread) {

    'use strict';
    var error = Bread.error;
    error.filename = 'body';

    if (!w.Bread) {
        error.show(error.include('You must include Bread module'));
        return false;
    }

    Bread.augment = augment;

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

        mixins.forEach(function(mixin) {
            mix(Extended.prototype, mixin.prototype);
        });

        return Extended;
    }

    function mix(base, child) {
        var props = Object.getOwnPropertyNames(child);
        var p = props.length - 1;

        function merge() {
            if (p >= 0) {
                var propName = props[p];
                var propDesc = Object.getOwnPropertyDescriptor(child, propName);
                Object.defineProperty(base, propName, propDesc);
                p--;
                return merge();
            } else {
                return true;
            }
        }
        return merge();
    }

})(window, window.Bread)