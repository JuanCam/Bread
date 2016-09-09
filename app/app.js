(function() {
    var canvas = document.getElementById('canvas_universe');
    canvas.width = 450;
    canvas.height = 300;
    var firstReality = Bread.universe({
        el: canvas,
        frate: 1000 / 24
    });
    var circ = Bread.circle({
        x: 60,
        y: 45,
        radius: 20
    });
    firstReality.addIt(circ);
    circ.render();

    circ.locate(100, 70)
    circ.speed = 2;

    firstReality.animation(function() {
        circ.accelerate(0.01, 0.02);
        circ.render();
        if (circ.y > canvas.height) {
            circ.bounce(0.01, -0.9)
        }
    });
})(window)