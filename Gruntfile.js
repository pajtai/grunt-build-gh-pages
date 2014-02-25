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
        warning : { reamde : 'Compiled file. Do not modify directly.' },
        clean: {
            short : ['dist']
        },
        buildGhPages: {
            example: {
                options: {
                    build_branch: "<%= config.build_branch %>",
                    dist: "<%= config.dist %>",
                    exclude: "<%= config.exclude %>"
                }
            }
        },
        releaseNotes : {
            main : {
                src : 'templates/README.template.md',
                dest : 'README.md',
                baseLinkPath : 'https://github.com/pajtai/grunt-build-gh-pages/tree/master/'
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
        'buildGhPages:example'
    ]);
};
