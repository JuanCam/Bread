module.exports = function(grunt) {
    'use strict';
    var config = {
        sources: [
            'src/core.js',
            'src/errors.js',
            'src/extend.js',
            'src/methods.js',
            'src/augment.js',
            'src/body.js',
            'src/point.js',
            'src/line.js',
            'src/arc.js',
            'src/circle.js',
            'src/rectangle.js',
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
                    livereload: true
                }
            }
        },
        concat: {
            options: {
                separator: ';',
                banner: "'use strict';\n",
                process: function(src, filepath) {
                    return '/* Module file: ' + filepath + ' */\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                },
            },
            dist: {
                src: config.sources,
                dest: 'dist/<%= pkg.name %>.js',
            },
            app: {
                src: config.sources,
                dest: 'app/js/<%= pkg.name %>.js',
            }
        },
        watch: {
            concatSrc: {
                files: 'src/**.js',
                tasks: ['concat:dist', 'concat:app']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.event.on('watch:concatSrc', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    // Default task(s).
    grunt.registerTask('default', ['concat:dist']);
    grunt.registerTask('lift', ['concat:app', 'connect:server', 'watch']);
    grunt.registerTask('concatSrc', ['watch:concatSrc']);
}
