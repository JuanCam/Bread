(function(w, Bread) {

    function errors() {
        return {
            filename: '',
            type: function(msg) {

                var Type = Bread.augment(Error, [TypeErr]);
                var error = new Type(msg, this.filename);
                error.message = msg;
                return error;
            },
            declare: function(msg) {

                var Declaration = Bread.augment(Error, [DeclarationError]);
                var error = new Declaration(msg, this.filename);
                error.message = msg;
                return error;
            },
            include: function(msg) {

                var Include = Bread.augment(Error, [IncludeError]);
                var error = new Include(msg, this.filename);
                error.message = error.important + error.message;
                return error;
            },
            show: function(err) {
                console.error('In ' + this.filename + ' ' + err.name + ': ' + err.message);
            }
        }
    }

    function TypeErr() {}

    TypeErr.prototype = {
        name: 'TypeErr',
        important: 'this is custom type'
    }

    function DeclarationError() {}

    DeclarationError.prototype = {
        name: 'DeclareError',
        important: ''
    }

    function IncludeError() {}

    IncludeError.prototype = {
        name: 'IncludeError',
        important: 'Fatal Error!'
    }
    Bread.error = errors;

})(window, window.Bread)
