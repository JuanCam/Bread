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

    firstReality.addIt(circ1);
    firstReality.addIt(circ2);

    circ1.speed = 2;
    var accx2 = -0.01;
    
    firstReality.animation(function() {

        circ2.accelerate(accx2, 0.02);
        circ1.accelerate(0.01, 0.02);

        circ1.render();
        circ2.render();

        if (circ1.y > canvas.height) {
            circ1.bounce(0.01, -0.9);
        }
        if (circ1.collision(circ2)) {
            circ2.bounce(0.9, -0.03);
            accx2 = 0.01;
        }
    });
})(window)