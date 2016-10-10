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

    function Rectangle(attrs) {
        /*Rectangle base mixin*/
        try {
            if (!Bread.isNumber(attrs.width)) throw error.type('width must be a number');
            if (!Bread.isNumber(attrs.height)) throw error.type('height must be a number');
            if (!init.call(this, attrs)) throw error.type('error in position');

        } catch (e) {
            error.show(e);
        }
    }

    function rectangle(attrs) {
        return new RectangleMix({
            x: attrs.x,
            y: attrs.y,
            angle: attrs.angle || 0
        });
    }

    function init(attrs) {
        if (!this.x || !this.y) return ;
        this.defWidth = attrs.width;
        this.defHeight = attrs.height;
        return this;
    }

    Rectangle.prototype = {
        render: function() {
            this.validateContext();
            this.context.beginPath();
            this.context.lineWidth = this.lineWidth || 1;
            rectRotation.call(this);
            drawRect.call(this);
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

    function drawRect() {
        if (this.stroke) {
            this.context.strokeStyle = this.stroke || '#000';
            this.context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.context.stroke();
        } else if (this.fill) {
            this.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        this.context.restore();
    }

    function rectRotation() {
        this.context.save();
        this.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
        this.context.rotate(this.angle);
    }

    RectangleMix = Bread.augment(Body, [Line, Rectangle]);
    Bread.rectangle = rectangle;
    Bread.Rectangle = RectangleMix;

})(window, window.Bread)
