(function(w, Bread) {

    'use strict';

    var error = Bread.error;
    var isNumber = Bread.methods.isNumber;

    if (!w.Bread) {
        error.show(error.include('You must include Bread'));
        return false;
    }

    var Random = {
        rand: function(ini, fin) {
            try {
                if (!isNumber(ini)) throw error.type('Incorrect data type sent in random');
                if (!isNumber(fin)) throw error.type('Incorrect data type sent in random');

                var number = Math.random();
                fin -= ini;
                fin *= number;
                return ini + fin;
            } catch (e) {
                error.show(e);
            }
        },
        randomInPortions: function() {
            /*Returns a random number between a specific range selected from the function arguments*/
            try {
                var pos = Math.round(Math.random() * (arguments.length - 1)),
                    number = Math.random(),
                    range = arguments[pos];

                if (!isNumber(range[0])) throw error.type('Incorrect data type sent in random-in-portions');
                if (!isNumber(range[1])) throw error.type('Incorrect data type sent in random-in-portions');
                /*It uses the random formula*/
                range[1] -= range[0];
                range[1] *= number;
                return range[1] + range[0];
            } catch (e) {
                error.show(e);
            }
        },
        randomBiased: function(step, lowerBound, upperBound, distribution) {
            /*Returns a random number between the lower bound and the upper bound by setting a 
            'weight' of probability in the distribution list for each band*/
            try {
                var sum = 0;
                var stepSelected = 0;
                var seed = 0;
                var diference = 0;
                var closeness = 0;
                var index = 0;
                var band = (upperBound - lowerBound);

                if (band / step > distribution.length - 1 || band / step < distribution.length - 1) {
                    throw error.type('Missmatch between the distribution length and band-width, no operation performed');
                }

                seed = Math.random(); //seed declaration for 'picking up' a band.
                function _biase(distribution) {
                    if (index < distribution.length) {
                        sum += distribution[index];
                        closeness = sum - (seed * 100);
                        if (closeness > 0) {
                            stepSelected = parseInt(index) * step;
                            return lowerBound + stepSelected;
                        }
                        index++;
                    } else {
                        return lowerBound + stepSelected;
                    }
                }

                return _biase(distribution);
            } catch (e) {
                error.show(e);
            }
        },
        shuffle: function(arr) {

            try {
                var elm = 0,
                    stack = [];
                while (arr.length > 0) {

                    elm = Math.round(Math.random() * (arr.length - 1));
                    stack.push(arr[elm]);
                    arr.splice(elm, 1);
                }
                return stack;
            } catch (e) {
                error.show(e);
            }
        }
    };

    Bread.random = Random;

})(window, window.Bread)
