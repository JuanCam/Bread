(function(w, Bread) {

    'use strict';
    
    if (!w.Bread) {
        console.error('Fatal!. You must include bread');
        return false;
    }

    Bread.Body = Body;

    function Body(attrs) {
        this.y = attrs.y;
        this.x = attrs.x;
        this.xspeed = 0;
        this.yspeed = 0;
        this.speed = 0;
        this.angle = 0;
        this.friction = 0;
    }
    /*Body public methods*/
    Body.prototype = {
        accelerate: function(accx, accy) {
            /*Acceleration method for bodies*/
            try {

                if (typeof accx != 'number') throw 'Incorrect assignment in body ';
                if (typeof accy != 'number') throw 'Incorrect assignment in body ';
                this.x += this.xspeed, this.xspeed += accx;
                this.y += this.yspeed, this.yspeed += accy;
            } catch (error) {
                console.warn(error + '(accelerate)');
            }
        },
        bounce: function(bnx, bny) {
            /*Bounce method*/
            try {

                if (typeof bnx != 'number') throw 'Incorrect assignment in body ';
                if (typeof bny != 'number') throw 'Incorrect assignment in body ';
                this.xspeed = bnx;
                this.yspeed = bny;

            } catch (error) {
                console.warn(error + '(bounce)');
            }
        },
        impulse: function(speed, friction, angle) {

            try {

                if (typeof speed != 'number') throw 'Incorrect assignment in body ';
                if (typeof friction != 'number') throw 'Incorrect assignment in body ';
                if (typeof angle != 'number') throw 'Incorrect assignment in body ';

                this.speed += speed;
                this.angle = angle;
                this.friction = friction;
                this.x += this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);
            } catch (error) {
                console.error(error + '(impulse)');
            }
        },
        locate: function(xtarg, ytarg) {
            /*Locate method*/
            var dx = 0;
            var dy = 0;
            var xgoes = 0;
            var ygoes = 0;
            var dist = 0;
            var alfa = 0;
            try {

                if (typeof xtarg != 'number') throw 'Incorrect assignment in body ';
                if (typeof ytarg != 'number') throw 'Incorrect assignment in body ';

                dx = ((xtarg - this.x) != 0) ? xtarg - this.x : 1;
                dy = ((ytarg - this.y) != 0) ? ytarg - this.y : 1;
                xgoes = dx / Math.abs(dx);
                ygoes = dy / Math.abs(dy);
                this.angle = Math.atan(Math.abs(dy) / Math.abs(dx));
                dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                alfa = (Math.PI / 2) + (ygoes * this.angle);
                alfa = xgoes * alfa;
            } catch (error) {
                console.warn(error + '(locate)');
            }
        },
        move: function() {
            /*Move method*/
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
            this.speed -= this.friction;
        }
    }

})(window, window.Bread);