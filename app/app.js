(function() {
    var canvas = document.getElementById('canvas_universe');
    canvas.width = 450;
    canvas.height = 300;
    var firstReality = Bread.universe({
        el: canvas,
        frate: 1000 / 24
    });
    var circ1 = Bread.circle({
        x: 60,
        y: 45,
        radius: 20
    });
    var circ2 = Bread.circle({
        x: 120,
        y: 45,
        radius: 10
    });
    var circ3 = Bread.circle({
        x: 220,
        y: 145,
        radius: 10
    });
    var circlesGrp = Bread.groups.circles({
        x: 160,
        y: 145,
        radius: 2
    }, 4);
    /*Lines*/
    var pnt1 = Bread.point({
        x: 280,
        y: 120,
        angle: 0
    });
    var pnt2 = Bread.point({
        x: 290,
        y: 20,
        angle: 0
    });
    var pnt3 = Bread.point({
        x: 350,
        y: 190,
        angle: 0
    });
    var line1 = Bread.line({
        x: 270,
        y: 160,
        points: [pnt1]
    });
    var line2 = Bread.line({
        x: 390,
        y: 120,
        points: [pnt2]
    });
    var line3 = Bread.line({
        x: 300,
        y: 100,
        points: [pnt3]
    });

    /*Heterogeneous group*/
    var customGroup = Bread.group([circ1, circ2, circ3, line1, line2, line3]);

    firstReality.addGroup(circlesGrp);
    firstReality.addGroup(customGroup);
    line1.speed = 3;
    circ3.speed = 2;
    line1.angle = -0.5;
    circ1.speed = 2;
    var accx2 = -0.01;

    firstReality.animation(function() {

        circ2.accelerate(accx2, 0.02);
        circ1.accelerate(0.01, 0.02);

        if (line1.speed > 0)
            line1.move();
        else {
            line1.speed = 3;
            line1.angle = -0.5;
        }

        customGroup.render();
        circlesGrp.render();
        circ3.reach(Bread.point({ x: 400, y: 99 }), [line3, line2]);
        var dir = line1.direction();

        if (line1.collision(line2)) {
            line1.impulse(1.5, 0.02, line1.angle - Math.PI / 1.2);
        }
        if (circ1.y > canvas.height) {
            circ1.bounce(0.01, -0.9);
        }
        if (circ1.collision(circ2)) {
            circ2.bounce(0.9, -0.03);
            accx2 = 0.01;
        }
    });

})(window)
