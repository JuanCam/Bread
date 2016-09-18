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
        //x: 390,
        x: 290,
        y: 20,
        angle: 0
    });
    var line1 = Bread.line({
        x: 270,
        y: 160,
        points: [pnt1]
    });
    var line2 = Bread.line({
        x: 390,
        y: 110,
        points: [pnt2]
    });
    firstReality.addGroup([circ1, circ2]);
    firstReality.addGroup(circlesGrp);
    firstReality.addGroup([line1, line2]);

    line1.speed = 3;
    line1.angle = -0.5;
    circ1.speed = 2;
    var accx2 = -0.01;
    line1.collision(line2);
    
    firstReality.animation(function() {

        circ2.accelerate(accx2, 0.02);
        circ1.accelerate(0.01, 0.02);
        if (line1.speed > 0)
            line1.move();
        else {
            line1.speed = 3;
            line1.angle = -0.5;
        }
        circ1.render();
        circ2.render();
        line1.render();
        line2.render();
        circlesGrp.render();

        var dir = line1.direction()
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