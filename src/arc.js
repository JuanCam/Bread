(function(w, Bread) {

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
