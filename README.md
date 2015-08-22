# grunt-build-gh-pages

> Grunt plugin to take a build from dist on your current branch and put it into another branch, e.g. gh-pages, without merging. Ideal for when builds should be stored in orphan branches.

## Working Example

If you'd like to play around with a working example, fork [exploratory-javascript-tests](https://github.com/pajtai/exploratory-javascript-tests), and run `npm install && grunt build`, then look at the `gh-pages` branch.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-build-gh-pages --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-build-gh-pages');
```

## Assumptions

* You are using version of Node (0.8.19+) and NPM (1.1.6+) that support peer dependencies.
* This task is run after you have run the build task (or as the end part of your build task)
  * The full build must be in the distribution directory at the beginning of this task.
* A separate `--orphan` branch that has just the builds exists
* You want to auto push to that separate branch when you run this task!

## The "buildGhPages" task

### Overview
In your project's Gruntfile, add a section named `buildGhPages` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  buildGhPages: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

* `dist`: The directory the build is placed in. This directory should be gitignored in your current branch and the build branch.
  * Default: "dist"
* `build_branch`: The name of the branch the build should be commited to. This branch should exist. Ideally it should be an orphan branch.
  * Default: "gh-pages"
* `pull`: Whether you want to the a `git pull --rebase` on the build branch before modifying it. Use this if mutliple people can build to the repo.
  * Default: true
* `exclude`: An array of other directories besides `node_modules` you wish to exclude. These directories should be in the `.gitignore` of both branches.
* `copy_hidden`: If this value is truthy. Hidden files will be copied from the root dist directory to the final build directory. Hidden files in subfolders of dist are automatically copied.
  * Default: false

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  buildGhPages: {
    ghPages: {
      // Leave empty if you just want to run the defaults
    },
    production: {
      options: {
        build_branch: "prod",
        dist: "prodOptimized",
        pull: false
      }
    }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 0.0.1 - 2013-04-17 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.0.1_2013-04-17.md)
* 0.0.2 - 2013-04-27 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.0.2_2013-04-27.md)
* 0.0.3 - 2013-05-04 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.0.3_2013-05-04.md)
* 0.1.0 - 2013_08_08 - [features](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.1.0_2013_08_08.md)
* 0.1.1 - 2013-10-09 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.1.1_2013-10-09.md)
* 0.1.2 - 2013-12-04 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.1.2_2013-12-04.md)
* 0.1.4 - 2014-01-16 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.1.4_2014-01-16.md)
* 0.1.5 - 2014-01-16 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.1.5_2014-01-16.md)
* 0.1.6 - 2014-01-16 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.1.6_2014-01-16.md)
* 0.1.7 - 2014-01-16 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/0.1.7_2014-01-16.md)
* 1.0.0 - 2014-02-24 - [backward incompatibilities](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/1.0.0_2014-02-24.md)
* 1.0.1 - 2014-02-25 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/1.0.1_2014-02-25.md)
* 1.0.2 - 2014-03-04 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/1.0.2_2014-03-04.md)
* 1.0.3 - 2014-03-04 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/1.0.3_2014-03-04.md)
* 1.0.4 - 2015-05-07 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/1.0.4_2015-05-07.md)
* 1.0.5 - 2015-08-22 - [patches](https://github.com/pajtai/grunt-build-gh-pages/tree/master/release_notes/1.0.5_2015-08-22.md)


undefined Created: 2015-08-22 07:52:41_