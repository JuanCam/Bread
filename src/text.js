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
            this.fill = this.fill || false;
            this.textBaseline = this.textBaseline || '';
            this.font = attrs.font || "3px serif";
            this.maxWidth = attrs.maxWidth || 0;
        } catch (e) {
            error.show(e);
        }
    }

    Text.prototype = {
        render: function() {
            Bread.Body.validateContext.call(this);
            this.context.font = this.font;
            if (this.textBaseline) this.context.textBaseline = this.textBaseline;
            if (this.fill) {
                this.context.fillText(this.text, this.x, this.y);
            } else {
                this.context.strokeText(this.text, this.x, this.y);
            }
        }
    }

    Bread.Text = Text;
    Bread.text = text;

})(window, window.Bread)
