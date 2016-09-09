(function(w, Bread) {

    'use strict';

    if (!Bread.Body) {
        console.error('Fatal!. You must include body module');
        return false;
    }

    Bread.rectangle = rectangle;

    function rectangle(attrs) {
        var Body = Bread.Body;
        var extended = Bread.augment(Body, [Rectangle]);
        var instance = new extended({
            x: attrs.x,
            y: attrs.y
        });
        instance.setWidth(attrs.width);
        instance.setHeight(attrs.height);

        return instance;
    }

    Rectangle.prototype = {

        setWidth: function(width) {
            try {
                if (isNaN(width)) throw "Incorrect assignment in body ";
                this.x -= width + (((1 - Math.ceil(Math.abs(width) / width)) / 2) * width);
                this.width = width;
            } catch (error) {
                console.warn(error + '(set-width)');
            }
        },
        setHeight: function(height) {
            try {
                if (isNaN(height)) throw "Incorrect assignment in body ";
                this.y -= height + (((1 - Math.ceil(Math.abs(height) / height)) / 2) * height);
                this.height = height;
            } catch (error) {
                console.warn(error + '(set-height)');
            }
        },
        render: function() {

            if (!this.context) {
                console.error('Context is not set, render failed!.')
                return false;
            }

            this.context.save();
            this.context.beginPath();
            this.context.translate(this.x + (this.width / 2), this.y + (this.height / 2));
            this.context.rotate(this.angle);
            this.context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            this.context.restore();
            this.context.stroke();
        }
    }

    function Rectangle() {
        /*Rectangle Mixin*/
    }
})(window, window.Bread)