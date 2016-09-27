(function(w, Bread) {

    var error = Bread.error;
    var isNumb = Bread.methods.isNumber;
    error.filename = 'groups.js';

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

        function _createGroup(body, attrs, len) {

            if (b < len) {

                this.push(body(attrs));
                b++;
                return _createGroup.call(this, body, len);
            } else {
                b = 0;
                return this;
            }
        }

        function group(body, attrs, len) {

            var extended = primitive();
            var instance = new extended();
            if (body) {
                return _createGroup.call(instance, body, attrs, len);
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

})(window, window.Bread)
