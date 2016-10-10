(function(w, Bread) {

    'use strict';

    var error = Bread.error();
    error.filename = 'text.js';

    if (!w.Bread) {
        error.include('You must include Bread');
        error.show();
        return false;
    }

    function text(attrs) {
        return new Text(attrs);
    }

    function Text(attrs) {
        try {
            if (!attrs.text) throw error.declare('string text is not defined');
            this.text = attrs.text;
            this.x = attrs.x || 0;
            this.y = attrs.y || 0;
            this.fill = attrs.fill || false;
            this.textBaseline = attrs.textBaseline || '';
            this.font = attrs.font || "3px serif";
            this.maxWidth = attrs.maxWidth || 0;
        } catch (e) {
            error.show(e);
        }
    }

    Text.prototype = {
        render: function() {
            Bread.Body.prototype.validateContext.call(this);
            this.context.font = this.font;
            this.context.beginPath();
            if (this.textBaseline) this.context.textBaseline = this.textBaseline;
            if (this.fill) {
                this.context.fillStyle = this.fill;
                this.context.fillText(this.text, this.x, this.y);
            } else {
                this.context.strokeText(this.text, this.x, this.y);
            }
            this.context.closePath();
        }
    }

    Bread.Text = Text;
    Bread.text = text;

})(window, window.Bread)
