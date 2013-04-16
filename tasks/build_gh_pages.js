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

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            dist: "dist"
        });

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                    // Read file source.
                    return grunt.file.read(filepath);
                }).join(grunt.util.normalizelf(options.separator));

            // Handle options.
            src += options.punctuation;

            // Write the destination file.
            grunt.file.write(f.dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
