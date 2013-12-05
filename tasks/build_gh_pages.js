/*
 * grunt-build-gh-pages
 * https://github.com/pajtai/grunt-build-gh-pages
 *
 * Copyright (c) 2013 Peter Ajtai
 * Licensed under the MIT license.
 */

'use strict';

// TODO: use something Thor like to manage all these shell tasks
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
                exclude: [],
                copy_hidden: true
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

        // Get the name of the current branch
            verifyBranch = {
                options: {
                    callback: function(err, out, stderr, cb) {
                        grunt.log.writeln("switched to branch " + out);
                        if (out.replace(/^\s+|\s+$/g, '') !== options.build_branch.replace(/^\s+|\s+$/g, '')) {
                            grunt.fatal("Stop. Branch, " + options.build_branch + " does not exist. Please create an --orphan branch of that name, and try again.", grunt.fail.code.TASK_FAILURE);
                        }
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
                    var command = ["git checkout " + options.build_branch];

                    if (options.pull) {
                        command.push("git pull --rebase origin " + options.build_branch);
                    }
                    return command.join('&&');
                }())
            },

            excludedDirs = _.map(options.exclude, function(item) {
                return "grep -v ^" + item;
            }),

            finish = {
                options : {
                    stderr : true,
                    stdout : true
                },
                //  + options.exclude.join("|") +
                command :
                    [
                        // get a list of all files in stage and delete everything except for targets, node_modules, cache, temp, and logs
                        // rm does not delete root level hidden files
                        generateDeleteFilesCommand(options, excludedDirs),
                        generateCopyCommand(options),
                        'rm -r ' + options.dist,
                        // add any files that may have been created
                        'git add -A ',
                        generateGitCommitCommand(),
                        // push changes to gitlab
                        'git push origin ' + options.build_branch,
                        // now that everything is done, we have to switch back to the branch we started from
                        'git checkout <%= grunt.config.get("build_gh_pages_.branch") %>'
                    ].join('&&')
            };

        grunt.log
            .subhead("build gh pages options:")
            .writeln(JSON.stringify(options));

        // dynamically create desired shell tasks
        grunt.config.set("shell." + prefix + "getRef", getRef);
        grunt.config.set("shell." + prefix + "getBranch", getBranch);
        grunt.config.set("shell." + prefix + "switchBranch", switchBranch);
        grunt.config.set("shell." + prefix + "verifyBranch", verifyBranch);
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
            "shell:" + prefix + "verifyBranch",
            prefix + "bumpBuild",
            "shell:" + prefix + "finish"
        ]);
    });

    // TODO: use grunt-clean instead
    function generateDeleteFilesCommand(options, excludedDirs) {
        return 'ls | ' +
            'grep -v ^' + options.dist + '$ | ' +
            'grep -v ^node_modules$ ' +
            (excludedDirs.length ?
                " | " + excludedDirs.join(" | ") :
                "") +
            ' | ' +
            'xargs rm -r '
    }

    // copy from the stage folder to the current (root) folder
    // TODO: use grunt copy instead
    function generateCopyCommand(options) {
        var cp = 'cp -r ',
            from = path.normalize(options.dist + '/*'),
            to = ' .';

        if (grunt.config.get('build_gh_pages.copy_hidden')) {
            from += ' ' + path.normalize(options.dist + '/.??*');
        }
        return cp + from + to;
    }

    // commit all files using the version number as the commit message
    // <%= %> is grunt templating
    function generateGitCommitCommand() {
        return 'git commit -am "' +
            'Build: <%= grunt.file.read(".build") %> ' +
            'Branch: <%= grunt.config.get("build_gh_pages_.branch") %> <%= grunt.config.get("build_gh_pages_.version") %> ' +
            'SHA: <%= grunt.config.get("build_gh_pages_.shaRef") %>"';
    }

};
