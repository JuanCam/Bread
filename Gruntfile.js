module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
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
        }
    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', ['connect']);
}