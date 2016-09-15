(function(w, Bread) {

    function errors() {
        return {
            filename: '',
            type: function(msg) {
                var error = new TypeError(msg, this.filename);
                return error;
            },
            declare: function(msg) {

                var Declaration = Bread.augment(Error, [DeclarationError]);
                var error = new Declaration(msg, this.filename);
                return error;
            },
            include: function(msg) {

                var Include = Bread.augment(Error, [IncludeError]);
                var error = new Include(msg, this.filename);
                return error;
            }
        }
    }

    function DeclarationError() {}

    DeclarationError.prototype = {
        name: 'DeclareError',
        message: ''
    }

    function IncludeError() {}

    IncludeError.prototype = {
        name: 'IncludeError',
        message: 'Fatal Error!'
    }
    Bread.error = errors();

})(window, Bread)
