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

    function Arc(attrs) {
        /*Arc base mixin*/
        try {
            if (!Bread.isNumber(attrs.radius)) throw error.type('radius must be a number');
            if (!Bread.isNumber(attrs.startAngle)) throw error.type('startAngle must be a number');
            if (!Bread.isNumber(attrs.endAngle)) throw error.type('endAngle must be a number');
            if (!init.call(this, attrs)) throw error.type('error in position');
        } catch (e) {
            error.show(e);
        }
    }

    function arc(attrs) {

        return new ArcMix({
            x: attrs.x,
            y: attrs.y,
            radius: attrs.radius,
            startAngle: attrs.startAngle,
            endAngle: attrs.endAngle
        });
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
            this.context.closePath();
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

    function fillArc() {

        if (this.fill) {
            this.context.fillStyle = this.fill;
            this.context.fill();
        }
        this.context.strokeStyle = this.stroke || '#000';
        this.context.stroke();

    }

    ArcMix = Bread.augment(Body, [Point, Arc]);
    Bread.arc = arc;
    Bread.Arc = ArcMix;

})(window, window.Bread)
