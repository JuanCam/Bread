(function(w) {

    'use strict';

    var Bread = {
        v: '0.0.0',
        universe: CreateUniverse,
        isNumber: function(variable) {
            return typeof variable === 'number';
        },
        isBody: function(variable) {
            return variable instanceof Bread.Body
        },
        inRange: function(variable, lower, upper, open) {
            return (open) ? (variable >= lower) && (variable <= upper) : (variable > lower) && (variable < upper)
        },
        pluck: function(collection, field) {

            try {
                if (!(collection instanceof Array)) throw 'collection must be an array in pluck';
                var c = collection.length - 1;
                var plucked = []
                if (!Array.prototype.map) {
                    function pluckLocally(collection) {
                        if (c >= 0) {
                            plucked.push(collection[c][field]);
                            c--;
                            return pluckLocally(collection);
                        } else {
                            return plucked;
                        }
                    }
                    return pluckLocally(collection);
                } else {
                    return collection.map(function(n) {
                        return n[field];
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
        isArray: function(variable) {
            return variable instanceof Array;
        }
    }

    var context;

    function CreateUniverse(attrs) {

        return new Universe(attrs);
    }

    /*Private attributes*/
    var bodies = [];
    /*Universe Public methods and attributes*/
    Universe.prototype = {
        addIt: function(body) {

            if (!(body instanceof Bread.Body)) {
                console.error('Incorrect input argument in add-it!');
                return false;
            }
            for (var bd in bodies) {
                if (bodies[bd] == body) {
                    console.error('Duplicate objects in enviromet!');
                    return false;
                }
            }
            bodies.push(body);
            body.context = context;
        },
        addGroup: function(group) {

            if (typeof group != 'object' && !(group instanceof Array)) {
                console.error('Incorrect input argument in add-it!');
                return false;
            }

            group.forEach(function(body, index) {
                for (var bdy in bodies) {
                    if (bodies[bdy] == body) {
                        console.error('Duplicate objects in enviromet!');
                        return false;
                    }
                }
                bodies.push(body);
                body.context = context;

            });

        },
        removeIt: function(body) {

            if (!(body instanceof Bread.Body)) {
                console.error('Incorrect input argument in remove-it!');
                return false;
            }
            for (var bdy in bodies) {
                if (bodies[bdy] == body)
                    bodies[bdy] = undefined;
            };
            body.context = undefined;
        },
        animation: function(cfn) {

            var local = this;
            var canvas = local.el;

            function animate() {
                setTimeout(Animation, local.frate);
            }

            function Animation() {
                requestAnimationFrame(animate);
                context.clearRect(0, 0, canvas.width, canvas.height);
                cfn.call(local);
            }
            animate();
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