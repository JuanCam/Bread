(function(w, Bread) {

    'use strict';

    var error = Bread.error();
    error.filename = 'groups.js';

    if (!w.Bread) {
        error.include('You must include Bread');
        error.show();
        return false;
    }

    function Group() {
        /*Group Class*/
    }

    function groupFact() {
        return Bread.augment(Array, [Group]);
    }

    function cloneProperty() {
        var i;
        for (i in this) {
            if (Bread.isBody(this[i])) this[i] = this[i].clone();
            if (Bread.isArray(this[i])) this[i] = Group.prototype.clone.call(this[i]);
        }
        return this;
    }

    function _createGroup(body, attrs, len) {
        var b = 0;
        while (b < len) {
            if (Bread.isObject(attrs)) {
                attrs = cloneProperty.call(attrs);
                this.push(body(attrs));
            } else {
                this.push(body[b]);
            }
            b++;
        }
        return this;
    }

    function group(body, attrs, len) {
        var extended, instance;
        extended = groupFact();
        instance = new extended();
        if (body) {
            return _createGroup.call(instance, body, attrs, len);
        }
    }

    function groups() {

        return {
            points: function(attrs, len) {
                var body, att;
                body = Bread.point;
                att = {
                    x: attrs.x,
                    y: attrs.y
                };
                return group(body, att, len);
            },
            circles: function(attrs, len) {
                var body, att;
                body = Bread.circle;
                att = {
                    x: attrs.x,
                    y: attrs.y,
                    radius: attrs.radius,
                    fill: attrs.fill || false
                };
                return group(body, att, len);
            },
            arcs: function(attrs, len) {
                var body, att;
                body = Bread.arc;
                att = {
                    x: attrs.x,
                    y: attrs.y,
                    radius: attrs.radius,
                    startAngle: attrs.startAngle,
                    endAngle: attrs.endAngle,
                    fill: attrs.fill || false,
                }
                return group(body, att, len);
            },
            rectangles: function(attrs, len) {
                var body, att;
                body = Bread.rectangle;
                att = {
                    x: attrs.x,
                    y: attrs.y,
                    width: attrs.width,
                    height: attrs.height
                };
                return group(body, att, len);
            },
            lines: function(attrs, len) {
                var body, att;
                body = Bread.line;
                att = {
                    x: attrs.x,
                    y: attrs.y,
                    points: attrs.points
                };
                return group(body, att, len);
            }
        }
    }
    Group.prototype = {

        render: function() {
            Bread.forEach(this, function(body) {
                body.render();
            })
        },
        add: function(objects) {
            var grp = this;
            if (Bread.isObject(objects)) {
                this.push(objects)
            }
            if (Bread.isArray(objects)) {
                Bread.forEach(objects, function(obj) {
                    grp.push(obj);
                });
            }
        },
        accelerate: function(acc) {
            var b, bodies;
            bodies = this;
            b = 0;
            Bread.forEach(acc, function(a) {
                bodies[b].accelerate(a.x, a.y);
                b++;
            });
        },
        bounce: function(bn) {
            var b, bodies;
            bodies = this;
            b = 0;
            Bread.forEach(bn, function(a) {
                bodies[b].bounce(a.x, a.y);
                b++;
            });
        },
        impulse: function(speed, friction, angle) {
            var b, bodies;
            bodies = this;
            b = 0;
            Bread.forEach(bn, function(a) {
                bodies[b].impulse(a.speed, a.friction, a.angle);
                b++;
            });
        },
        move: function() {
            Bread.forEach(this, function(b) {
                b.move();
            });
        },
        clone: function() {
            var cloned = this.slice();
            cloned = Bread.map(cloned, function(b) {
                return b.clone();
            });
            return cloned;
        }
    }

    Bread.Group = Bread.augment(Array, [Group]);
    Bread.group = function(attrs) {
        return group(attrs, undefined, attrs.length);
    };
    Bread.groups = groups();

})(window, window.Bread)
