(function(w, Bread) {

    'use strict';

    var error, Body, Point, ArcMix;
    error = Bread.error();
    Body = Bread.Body;
    Point = Bread.Point;
    error.filename = 'arc.js';

    if (!Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Point) {
        error.show(error.include('You must include point module'));
        return false;
    }

    function Arc() {
        /*Arc base mixin*/
    }

    function arc(attrs) {

        try {
            if (!Bread.isNumber(attrs.radius)) throw error.type('radius must be a number');
            if (!Bread.isNumber(attrs.startAngle)) throw error.type('startAngle must be a number');
            if (!Bread.isNumber(attrs.endAngle)) throw error.type('endAngle must be a number');
            var instance = new ArcMix({
                x: attrs.x,
                y: attrs.y
            });
            return init.call(instance, attrs);
        } catch (e) {
            error.show(e);
        }
    }

    function init(attrs) {
        if (!this.x || !this.y) return;
        this.defRaduis = attrs.radius;
        this.fill = attrs.fill;
        this.startAngle = attrs.startAngle;
        this.endAngle = attrs.endAngle;
        this.anticlock = this.anticlock || false;
        return this;
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
                if (!Bread.isNumber(radius)) throw error.type('radius must be a number');
                this.radius = radius;
            } catch (e) {
                error.show(e);
            }
        }
    });


    Object.defineProperty(Arc.prototype, 'arc', {
        'enumerable': true,
        'value': true
    });

    function fillArc() {

        if (this.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    ArcMix = Bread.augment(Body, [Arc, Point]);
    Bread.arc = arc;
    Bread.Arc = ArcMix;

})(window, window.Bread)
