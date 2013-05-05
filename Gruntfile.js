// Generated on 2013-04-13 using generator-webapp 0.1.7
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // configurable paths
    var config = {
        app: 'app',

        // These config values are the defaults for build_gh_pages,
        // so they could be skipped in this case,
        // but other values can be used
        build_branch: 'gh-pages',
        dist: 'dist',
        pull: true,
        exclude: "excluded"
    };

    grunt.initConfig({
        config: config,
        clean: ['dist'],
        build_gh_pages: {
            example: {
                options: {
                    build_branch: "<%= config.build_branch %>",
                    dist: "<%= config.dist %>",
                    exclude: "<%= config.exclude %>"
                }
            }
        },
        copy: {
            build: {
                files: [
                    {expand: true, cwd: './', src: ['README.md'], dest: 'dist/'}
                ]
            }
        }
    });

    grunt.registerTask("bumpBuild", function () {
        var build = ".build";
        grunt.file.write(build, parseInt(grunt.file.read(build), 10) + 1);
    });

    grunt.registerTask("build", [
        'clean',
        'copy',
        'build_gh_pages:example'
    ]);
};
