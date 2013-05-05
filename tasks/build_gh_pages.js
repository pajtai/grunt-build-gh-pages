/*
 * grunt-build-gh-pages
 * https://github.com/pajtai/grunt-build-gh-pages
 *
 * Copyright (c) 2013 Peter Ajtai
 * Licensed under the MIT license.
 */

'use strict';

/*
 Make sure you have built the project to the "dist" directory
 'shell:getRef',
 'shell:getBranch',
 'shell:switch',
 'bumpBuild',
 */
module.exports = function(grunt) {

    var path = require('path'),
        _ = require('underscore');

    // Make sure grunt-shell is loaded
    // It is listed as a peer dependency
    grunt.loadNpmTasks('grunt-shell');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('build_gh_pages', 'Take a build from this branch to another branch.', function() {

        // this.name
        // this.target
        // Merge task-specific and/or target-specific options with these defaults.
        // things coming through options are automatically run through the grunt templater
        var options = this.options({
            dist: "dist",
            build_branch: "gh-pages",
            pull: true,
            exclude: []
        }),
            shell = "shell",
            prefix = "build_gh_pages_",

            // Get the SHA reference of the current commit
            getRef = {
                options: {
                    callback: function(err, out, stderr, cb) {
                        var version = grunt.file.readJSON("package.json").version,
                            shaRef =  out.substring(0, 7);

                        grunt.log.writeln("sha ref is: " + shaRef)
                            .writeln("version is: " + version);

                        grunt.config.set(prefix + ".shaRef", shaRef);
                        grunt.config.set(prefix + ".version", version);

                        cb();
                    }
                },

                command: "git rev-parse HEAD"
            },

            // Get the name of the current branch
            getBranch = {
                options: {
                    callback: function(err, out, stderr, cb) {
                        grunt.log.writeln("branch is: " + out);
                        grunt.config.set(prefix + ".branch", out);
                        cb();
                    }
                },

                command: "git rev-parse --abbrev-ref HEAD"
            },

            // Switch to the build branch and make sure it is up to date if desired
            switchBranch = {
                options: {
                    stderr: true,
                        stdout: true
                },

                command: (function() {
                    var command = "git checkout " + options.build_branch;

                    if (options.pull) {
                        command += " && git pull --rebase origin " + options.build_branch;
                    }
                    return command;
                }())
            },

            excludedDirs = _.map(options.exclude, function(item) {
                return "grep -v ^" + item;
            }),

            finish =  {
                options: {
                    stderr: true,
                    stdout: true
                },
//  + options.exclude.join("|") +
                command:

// get a list of all files in stage and delete everything except for targets, node_modules, cache, temp, and logs
// rm does not delete root level hidden files
                    'ls | grep -v ^' + options.dist + '$ | grep -v ^node_modules$ ' + (excludedDirs.length ? " | " +
                        excludedDirs.join(" | ") : "") + ' | xargs rm -r ' +

// copy from the stage folder to the current (root) folder
                    '&& cp -r ' + options.dist + '/* . ' +
                    '&& rm -r ' + options.dist + ' ' +

// add any files that may have been created
                    '&& git add -A ' +

// commit all files using the version number as the commit message
// <%= %> is grunt templating
                    '&& git commit -am "Build: <%= grunt.file.read(".build") %> Branch: <%= grunt.config.get("build_gh_pages_.branch") %> <%= grunt.config.get("build_gh_pages_.version") %> SHA: <%= grunt.config.get("build_gh_pages_.shaRef") %>"' +

// push changes to gitlab
                    '&& git push origin ' + options.build_branch +

// now that everything is done, we have to switch back to the branch we started from
// the - is a shortcutl for @{-1} which means we go back to the previous branch
                    '&& git checkout -'
            };

        grunt.log.writeln(JSON.stringify(options));

        // dynamically create desired shell tasks
        grunt.config.set("shell." + prefix + "getRef", getRef);
        grunt.config.set("shell." + prefix + "getBranch", getBranch);
        grunt.config.set("shell." + prefix + "switchBranch", switchBranch);
        grunt.config.set("shell." + prefix + "finish", finish);

        grunt.registerTask(prefix + "bumpBuild", function () {
            var build = ".build";

            grunt.file.write(build, path.existsSync(build) ? parseInt(grunt.file.read(build), 10) + 1 : 1);
        });

        // run created shell tasks
        grunt.task.run([
            "shell:" + prefix + "getRef",
            "shell:" + prefix + "getBranch",
            "shell:" + prefix + "switchBranch",
            prefix + "bumpBuild",
            "shell:" + prefix + "finish"
        ]);
    });

};
