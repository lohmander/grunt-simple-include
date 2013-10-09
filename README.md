# grunt-simple-include

> Super easy way to include files with a familiar syntax.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-simple-include --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-simple-include');
```

## The "simple_include" task

### Overview
In your project's Gruntfile, add a section named `simple_include` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  simple_include: {
    your_target: {
      src: ['path/to/files/*.html'],
      dest: 'dist/'
    },
  },
})
```

## Options

### stripPrefix

Option to strip any prefix if you'd like to.

```js
grunt.initConfig({
  simple_include: {
    options: {
      stripPrefix: '_'
    },
    your_target: {
      src: ['path/to/files/_*.html'],
      dest: 'dist/'
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
**2013-10-09** 0.1.2 Bugfix

**2013-10-09** 0.1.1 Added strip prefix option

**2013-10-09** 0.1.0 First release
