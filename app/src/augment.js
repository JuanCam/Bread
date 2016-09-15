(function(w, Bread) {

    'use strict';

    if (!w.Bread) {
        console.error('Fatal!. You must include bread');
        return false;
    }

    Bread.augment = augment;

    function augment(Base, mixins) {
        if (!(mixins instanceof Array)) {
            console.warn('mixins must be an array of classes');
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