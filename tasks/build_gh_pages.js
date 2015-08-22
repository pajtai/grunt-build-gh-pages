/*
 * grunt-build-gh-pages
 * https://github.com/pajtai/grunt-build-gh-pages
 *
 * Copyright (c) Peter Ajtai
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

module.exports = function(grunt) {

    // Make sure grunt-dependecies are loaded
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('buildGhPages', 'Take a build from this branch to another branch.', function() {

        // this.name
        // this.target
        // Merge task-specific and/or target-specific options with these defaults.
        // things coming through options are automatically run through the grunt templater
        var options = this.options({
                dist: "dist",
                build_branch: "gh-pages",
                pull: true,
                exclude: [],
                copy_hidden: false
            }),
            shell = "shell",
            prefix = "buildGhPages_",

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

            copy = {
                files: [
                    {
                        expand: true,
                        cwd: options.dist + "/",
                        src: ['**'],
                        dest: process.cwd(),
                        dot: options.copy_hidden
                    }
                ]
            },

            cleanDist = {
                files: [{src: [options.dist]}]
            },

            cleanProj = {
                options: {
                    force: true
                },
                files: [{
                    force: true,
                    src: buildCleanProjFileList(options.dist, options.exclude)
                }]
            },

            commit = {
                options : {
                    stderr : true,
                    stdout : true
                },
                command : [
                    'git add -A',
                    generateGitCommitCommand()
                ].join(' && ')
            },

            push = {
                options : {
                    stderr : true,
                    stdout : true
                },
                command : 'git push origin ' + options.build_branch
            },

            checkout = {
                options : {
                    stderr : true,
                    stdout : true
                },
                command :'git checkout <%= grunt.config.get("buildGhPages_.branch") %>'
            };


        grunt.log
            .subhead("build gh pages options:")
            .writeln(JSON.stringify(options));

        // dynamically create desired shell tasks
        grunt.config.set("shell." + prefix + "getRef", getRef);
        grunt.config.set("shell." + prefix + "getBranch", getBranch);
        grunt.config.set("shell." + prefix + "switchBranch", switchBranch);
        grunt.config.set("shell." + prefix + "verifyBranch", verifyBranch);
        grunt.config.set("clean." + prefix + "cleanProj", cleanProj);
        grunt.config.set("clean." + prefix + "cleanDist", cleanDist);
        grunt.config.set("copy." + prefix + "copy", copy);
        grunt.config.set("shell." + prefix + "commit", commit);
        grunt.config.set("shell." + prefix + "push", push);
        grunt.config.set("shell." + prefix + "checkout", checkout);

        grunt.registerTask(prefix + "bumpBuild", function () {
            var build = ".build",
                buildFileStats;

            buildFileStats = fs.lstatSync(build);

            grunt.file.write(build, buildFileStats.isFile() ? parseInt(grunt.file.read(build), 10) + 1 : 1);
        });

        grunt.registerTask(prefix + "addCname", function() {

            var cnameFile = "CNAME";
            grunt.log.writeln("CNAME: " + options.cname);
            if (options.cname) {
                grunt.file.write(path.normalize(options.dist + '/' + cnameFile), options.cname);
            }
        });

        // run created shell tasks
        grunt.task.run([
            "shell:" + prefix + "getRef",
            "shell:" + prefix + "getBranch",
            "shell:" + prefix + "switchBranch",
            "shell:" + prefix + "verifyBranch",
            prefix + "bumpBuild",
            prefix + "addCname",
            "clean:" + prefix + "cleanProj",
            "copy:" + prefix + "copy",
            "clean:" + prefix + "cleanDist",
            "shell:" + prefix + "commit",
            "shell:" + prefix + "push",
            "shell:" + prefix + "checkout"
        ]);
    });

    // commit all files using the version number as the commit message
    // <%= %> is grunt templating
    function generateGitCommitCommand() {
        return 'git commit -anm "' +
            'Build: <%= grunt.file.read(".build") %> ' +
            'Branch: <%= grunt.config.get("buildGhPages_.branch") %> <%= grunt.config.get("buildGhPages_.version") %> ' +
            'SHA: <%= grunt.config.get("buildGhPages_.shaRef") %>"';
    }

    function buildCleanProjFileList(target, exclusions) {
        var arr = ['./**', '!.', '!..', '!./.git/**', '!./node_modules/**', '!./' + target + "/**"];
        _.each(exclusions, function(item){
            arr.push('!' + item);
        });
        return arr;
    }
};
