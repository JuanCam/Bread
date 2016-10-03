(function(w, Bread) {

    'use strict';

    var error = Bread.error();

    if (!w.Bread) {
        error.show(error.include('You must include Bread'));
        return false;
    }

    var Random = (function() {

        function _biase(distribution, step, lowerBound) {
            var sum, index, seed, closeness, sel;
            index = 0;
            sum = 0;
            seed = Math.random(); //seed declaration for 'picking up' a band.
            while (index < distribution.length) {
                sum += distribution[index];
                closeness = sum - (seed * 100);
                if (closeness > 0) {
                    sel = parseInt(index) * step;
                    break;
                }
                index++;
            }
            return lowerBound + sel;
        }

        return {
            rand: function(ini, fin) {
                try {
                    if (!Bread.isNumber(ini)) throw error.type('Incorrect data type sent in random');
                    if (!Bread.isNumber(fin)) throw error.type('Incorrect data type sent in random');

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

                    if (!Bread.isNumber(range[0])) throw error.type('Incorrect data type sent in random-in-portions');
                    if (!Bread.isNumber(range[1])) throw error.type('Incorrect data type sent in random-in-portions');
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
                    var stepSelected, diference, closeness, band;
                    if (band / step > distribution.length || band / step < distribution.length) {
                        throw error.type('Missmatch between the distribution length and band-width, no operation performed');
                    }
                    stepSelected = 0;
                    diference = 0;
                    closeness = 0;
                    band = (upperBound - lowerBound);

                    return _biase(distribution, step, lowerBound);
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
    })();

    Bread.random = Random;

})(window, window.Bread)