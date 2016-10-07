(function(w, Bread) {

    'use strict';
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
