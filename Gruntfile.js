module.exports = function(grunt) {
    'use strict';
    var config = {
        name: 'Name: <%= pkg.name %>@<%= pkg.version %>\n',
        author: 'Author: <%= pkg.author %>. Email: <%= pkg.email %>\n',
        description: '<%= pkg.description %>.\n',
        repo: 'Repo: <%= pkg.url %>.',
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
            'src/random.js',
            'src/text.js'
        ],

    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                banner: "'use strict';" + '\n/*\n' + config.name + config.author + config.description + config.repo + '\n*/\n',
                process: function(src, filepath) {
                    return '/* Module file: ' + filepath + ' */\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                },
            },
            dist: {
                src: config.sources,
                dest: 'dist/bread.js',
            }
        },
        watch: {
            concatSrc: {
                files: 'src/**.js',
                tasks: ['concat:dist']
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
    grunt.registerTask('build', ['watch']);
    grunt.registerTask('concatSrc', ['watch:concatSrc']);
}