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

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('build_gh_pages', 'Take a build from this branch to another branch.', function() {

        // this.name
        // this.target
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            dist: "dist",
            branch: "gh-pages",
            branchFrom: "dynamically set",
            shaRef: "dynamically set",
            version: "dynamically set"
        }),
            shell = "shell",
            prefix = "build_gh_pages_,",
            target = prefix + this.target,

            // Shell tasks
            getRef = {
                options: {
                    callback: function(err, out, stderr, cb) {
                        var version = grunt.file.readJSON("package.json").version,
                            shaRef =  out.substring(0, 7);

                        grunt.log.writeln("sha ref is: " + shaRef)
                            .writeln("version is: " + version);

                        grunt.config.set(target + ".shaRef", shaRef);
                        grunt.config.set(target + ".version", version);

                        cb();
                    }
                },

                command: "git rev-parse HEAD"
            },
            getBranch = {
                options: {
                    callback: function(err, out, stderr, cb) {
                        grunt.log.writeln("branch is: " + out);
                        grunt.config.set(target + ".branch", out);
                        cb();
                    }
                },

                command: "git rev-parse --abbrev-ref HEAD"
            };

        grunt.config.set("shell." + prefix + "getRef", getRef);
        grunt.config.set("shell." + prefix + "getBranch", getBranch);

        grunt.task.run([
            "shell:" + prefix + "getRef",
            "shell:" + prefix + "getBranch"
        ]);
    });

};
