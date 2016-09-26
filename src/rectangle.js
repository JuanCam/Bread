(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    var isBody = Bread.methods.isBody;
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
            if (!isNumb(attrs.width)) throw error.type('width must be a number');
            if (!isNumb(attrs.height)) throw error.type('height must be a number');
            var extended = primitive();
            var instance = new extended({
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

    function primitive() {

        var Body = Bread.Body;
        var Line = Bread.Line;
        return Bread.augment(Body, [Rectangle, Line]);
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
                if (!isNumb(width)) throw error.type('width must be a number');
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
                if (!isNumb(height)) throw error.type('height must be a number');
                this.y -= height + (((1 - Math.ceil(Math.abs(height) / height)) / 2) * height);
                this.height = height;
            } catch (e) {
                error.show(e);
            }
        }
    });

    function fillRect() {

        if (this.fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    Bread.Rectangle = primitive();
    Bread.rectangle = rectangle;

})(window, window.Bread)
