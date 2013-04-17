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
    var yeomanConfig = {
        app: 'app'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        clean: ['dist'],
        build_gh_pages: {
            example: {

            }
        },
        copy: {
            build: {
                files: [
                    {expand: true, cwd: 'app/', src: ['**'], dest: 'dist/'}
                ]
            }
        },
        shell: {


//            switch: {
//                options: {
//                    stderr: true,
//                    stdout: true
//                },
//
//                command: 'git checkout gh-pages ' +
//                    // make sure you pull the latest from the repo before trying to commit new files.
//                    '&& git pull --rebase '
//            },
//            finish: {
//                options: {
//                    stderr: true,
//                    stdout: true
//                },
//
//                command:
//
//// get a list of all files in stage and delete everything except for targets, node_modules, cache, temp, and logs
//// rm does not delete root level hidden files
//                    'ls | grep -v ^dist$ | grep -v ^node_modules$ | xargs rm -r ' +
//
//// copy from the stage folder to the current (root) folder
//                    '&& cp -r dist/* . ' +
//                    '&& rm -r dist ' +
//
//// add any files that may have been created
//                    '&& git add -A ' +
//
//// commit all files using the version number as the commit message
//// <%= %> is grunt templating
//                    '&& git commit -am "Build: <%= grunt.file.read(".build") %> Branch: <%= grunt.config.get("buildGhPages.branch") %> Version: <%= grunt.config.get("buildGhPages.version") %> SHA: <%= grunt.config.get("buildGhPages.shaRef") %>"' +
//
//// push changes to gitlab
//                    '&& git push origin gh-pages ' +
//
//// now that everything is done, we have to switch back to the branch we started from
//// the - is a shortcutl for @{-1} which means we go back to the previous branch
//                    '&& git checkout - '
//            }
        }
    });

    grunt.registerTask("bumpBuild", function () {
        var build = ".build";
        grunt.file.write(build, parseInt(grunt.file.read(build), 10) + 1);
    });

    grunt.registerTask("build", [
        'clean',
        'copy',
        'grunt_build_gh_pages'
//        'shell:getRef',
//        'shell:getBranch',
//        'shell:switch',
//        'bumpBuild',
//        'shell:finish'
    ]);
};
