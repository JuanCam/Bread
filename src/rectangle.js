(function(w, Bread) {

    'use strict';
    
    var error, Body, Line, RectangleMix;
    error = Bread.error();
    Body = Bread.Body;
    Line = Bread.Line;
    RectangleMix;
    error.filename = 'rectangle.js';

    if (!Bread.Body) {
        error.show(error.include('You must include body module'));
        return false;
    }
    if (!Bread.Line) {
        error.show(error.include('You must include line module'));
        return false;
    }

    function Rectangle() {
        /*Rectangle base mixin*/
    }

    function rectangle(attrs) {
        try {
            if (!Bread.isNumber(attrs.width)) throw error.type('width must be a number');
            if (!Bread.isNumber(attrs.height)) throw error.type('height must be a number');
            var instance = new RectangleMix({
                x: attrs.x,
                y: attrs.y,
                angle: attrs.angle || 0
            });
            if (!instance.x || !instance.y) throw error.type('error in position');
            instance.defWidth = attrs.width;
            instance.defHeight = attrs.height;
            return instance;

        } catch (e) {
            error.show(e);
        }
    }

    Rectangle.prototype = {

        render: function() {

            this.validateContext();
            this.context.save();
            this.context.beginPath();
            this.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
            this.context.rotate(this.angle);
            this.context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.context.restore();
            fillRect.call(this);
        }
    }

    Object.defineProperty(Rectangle.prototype, 'defWidth', {
        set: function(width) {
            try {
                if (!Bread.isNumber(width)) throw error.type('width must be a number');
                this.x -= width + (((1 - Math.ceil(Math.abs(width) / width)) / 2) * width);
                this.width = width;
            } catch (e) {
                error.show(e);
            }
        }
    });
    Object.defineProperty(Rectangle.prototype, 'defHeight', {
        set: function(height) {
            try {
                if (!Bread.isNumber(height)) throw error.type('height must be a number');
                this.y -= height + (((1 - Math.ceil(Math.abs(height) / height)) / 2) * height);
                this.height = height;
            } catch (e) {
                error.show(e);
            }
        }
    });

    Object.defineProperty(Rectangle.prototype, 'rectangle', {
        'enumerable': true,
        'value': true
    });

    function fillRect() {

        if (this.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    RectangleMix = Bread.augment(Body, [Rectangle, Line]);
    Bread.rectangle = rectangle;
    Bread.Rectangle = RectangleMix;

})(window, window.Bread)
