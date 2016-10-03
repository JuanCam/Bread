(function(w, Bread) {

    'use strict';

    var error, bodyProto;
    error = Bread.error();
    error.filename = 'body.js';

    if (!w.Bread) {
        error.show(error.include('You must include Bread'));
        return false;
    }

    function Body(attrs) {
        /*Body base class*/
        try {
            if (!Bread.isNumber(attrs.x)) throw error.type('x must be a number');
            if (!Bread.isNumber(attrs.y)) throw error.type('y must be a number');
            this.y = attrs.y;
            this.x = attrs.x;
            this.xspeed = 0;
            this.yspeed = 0;
            this.speed = 0;
            this.angle = 0;
            this.friction = 0;
        } catch (e) {
            error.show(e);
        }
    }
    /*Body public methods*/
    bodyProto = {
        accelerate: function(accx, accy) {
            try {
                if (!Bread.isNumber(accx)) throw error.type('x acceleration must be a number');
                if (!Bread.isNumber(accy)) throw error.type('y acceleration must be a number');
                this.x += this.xspeed, this.xspeed += accx;
                this.y += this.yspeed, this.yspeed += accy;
            } catch (e) {
                error.show(e);
            }
        },
        bounce: function(bnx, bny) {
            try {
                if (!Bread.isNumber(bnx)) throw error.type('x bounce must be a number');
                if (!Bread.isNumber(bny)) throw error.type('y bounce must be a number');
                this.xspeed = bnx;
                this.yspeed = bny;
                this.speed = Math.sqrt(Math.pow(bnx, 2) + Math.pow(bny, 2));
            } catch (e) {
                error.show(e);
            }
        },
        impulse: function(speed, friction, angle) {
            try {
                if (!Bread.isNumber(speed)) throw error.type('speed impulse must be a number');
                if (!Bread.isNumber(friction)) throw error.type('friction impulse must be a number');
                if (!Bread.isNumber(angle)) throw error.type('angle impulse must be a number');
                this.speed = speed;
                this.angle = angle;
                this.friction = friction;
                this.x += this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);

            } catch (e) {
                error.show(e);
            }
        },
        move: function() {
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
            this.speed -= this.friction;
        },
        validateContext: function() {
            if (!this.context) {
                error.show(error.declare('Context is not set, render failed!.'));
                return false;
            }
        },
        clone: function() {
            var copy, props;
            copy = {};
            copy = Object.create(this);
            Bread.extend(copy, this);
            return copy;
        }
    }

    Body.prototype = Object.preventExtensions(bodyProto);
    Bread.Body = Body;

})(window, window.Bread)