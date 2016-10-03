(function(w) {

    'use strict';

    var Bread = {
        v: '0.0.25',
        universe: CreateUniverse
    };

    var context;

    function CreateUniverse(attrs) {

        return new Universe(attrs);
    }

    /*Universe Public methods and attributes*/
    Universe.prototype = {
        bodies:[],
        addIt: function(body) {

            if (!(body instanceof Bread.Body)) {
                console.error('Incorrect input argument in add-it!');
                return false;
            }

            for (var bd in this.bodies) {
                if (this.bodies[bd] == body) {
                    console.error('Duplicate objects in enviromet!');
                    return false;
                }
            }

            this.bodies.push(body);
            body.context = context;
        },
        addGroup: function(group) {

            if (typeof group != 'object' && !(group instanceof Array)) {
                console.error('Incorrect input argument in add-group!');
                return false;
            }
            var bd = group.length - 1;
            for (; bd >= 0; bd--) {
                this.addIt(group[bd]);
            }

        },
        removeIt: function(body) {

            if (!(body instanceof Bread.Body)) {
                console.error('Incorrect input argument in remove-it!');
                return false;
            }
            for (var bdy in this.bodies) {
                if (this.bodies[bdy] == body)
                    this.bodies.splice(1, bdy);
            };
            body.context = undefined;
        },
        animation: function(fn) {

            var local = this;
            var canvas = local.el;

            function animate() {
                setTimeout(Animation, local.frate);
            }

            function Animation() {
                requestAnimationFrame(animate);
                context.clearRect(0, 0, canvas.width, canvas.height);
                fn.call(local);
            }
            animate();
        },
        getBodies: function(type) {
            var where = Bread.methods.where;
            var filter = {};
            filter[type] = true;
            return (type) ? where(this.bodies, filter) : this.bodies;
        }

    };

    function Universe(attrs) {

        /*Universe core object*/
        this.frate = attrs.frate;
        this.el = attrs.el;
        var tagname = this.el.tagName;

        if (tagname == 'CANVAS') {
            context = this.el.getContext("2d");
        } else {
            console.error('HTML Element must be canvas tag');
            return false;
        }
    }

    w.Bread = Bread;

})(window)
