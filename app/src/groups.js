(function(w, Bread) {

    var error = Bread.error;
    var isNumb = Bread.isNumber;
    error.filename = 'groups';

    if (!w.Bread) {
        error.include('You must include Bread');
        error.show();
        return false;
    }

    function Group() {

    }

    function primitive() {
        return Bread.augment(Array, [Group]);
    }

    function groups() {
        var b = 0;

        function createGroup(body, attrs, len) {

            if (b < len) {

                this.push(body(attrs));
                b++;
                return createGroup.call(this, body, len);
            } else {
                b = 0;
                return this;
            }
        }

        function group(body, attrs, len) {

            var extended = primitive();
            var instance = new extended();
            if (body) {
                return createGroup.call(instance, body, attrs, len);
            }
        }

        return {
            points: function(attrs, len) {
                var body = Bread.point;
                var att = {
                    x: attrs.x,
                    y: attrs.y
                };
                return group(body, att, len);
            },
            circles: function(attrs, len) {
                var body = Bread.circle;
                var att = {
                    x: attrs.x,
                    y: attrs.y,
                    radius: attrs.radius,
                    fill: attrs.fill || false
                };
                return group(body, att, len);
            },
            arcs: function(attrs, len) {
                var body = Bread.arc;
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
                var body = Bread.rectangle;
                var att = {
                    x: attrs.x,
                    y: attrs.y,
                    width: attrs.width,
                    height: attrs.height
                };
                return group(body, att, len);
            },
            lines: function(attrs, len) {
                var body = Bread.line();
                var att = {
                    x: attrs.x,
                    y: attrs.y,
                    points: attrs.points
                };
                return group(body, att, len);
            }
        }
    }
    Group.prototype = {

        findWhere: function(obj) {
            try {
                if (!obj || !(obj instanceof Object)) throw error.type('The parameter must be an object');
                if (!(this instanceof Array)) throw error.type('List must be an Array.');
                var property = Object.getOwnPropertyNames(obj)[0];
                var i = this.length - 1;
                var group = this;
                var filtered = [];

                function find(obj) {
                    if (i >= 0) {
                        if (group[i][property] === obj[property]) {
                            filtered.push(group[i]);
                        }
                        i--;
                        return find(obj);
                    } else {
                        return (filtered.length > 0) ? filtered : undefined;
                    }
                }
            } catch (e) {
                e.show();
            }
        },
        setAt: function() {

        },
        render: function() {
            this.forEach(function(body) {
                body.render();
            })
        }
    }

    Bread.Group = primitive();
    Bread.groups = groups();

})(window, Bread)