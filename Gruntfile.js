module.exports = function(grunt) {
    'use strict';
    var config = {
        sources: [
            'src/bread.js',
            'src/errors.js',
            'src/methods.js',
            'src/augment.js',
            'src/extend.js',
            'src/body.js',
            'src/point.js',
            'src/line.js',
            'src/arc.js',
            'src/circle.js',
            'src/rectanlge.js',
            'src/groups.js',
            'src/random.js'
        ]
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8001,
                    base: {
                        path: 'app',
                        options: {
                            index: 'index.html'
                        }
                    },
                    keepalive: true
                }
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: config.sources,
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
            },
            app: {
                src: config.sources,
                dest: 'app/js/<%= pkg.name %>-<%= pkg.version %>.js',
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', ['concat:dist']);
    grunt.registerTask('lift',['concat:app','connect'])
}
