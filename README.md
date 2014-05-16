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

## File inclusion
To include a file use the familiar mustach syntax.

```html
<html>
  <body>
    {% include: 'partials/content.html' %}
  </body>
</html>
```

### File inclusions multiple times

```html
<html>
  <body>
{% include: 'partials/article.html' @2 %}
  </body>
</html>
```

### Pass variables to included file

```html
<html>
  <body>
   {% include: 'partials/article.html' @key:value @key2:value %}
  </body>
</html>
```

#### Print variables (partials/article.html)
```html
   <p>{{ key }}</p>
   <p>{{ key2 }}</p>
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

### includeRegex

Type: String

Default: `{%.*?include:.*?([a-zA-Z0-9_@/.-]+).*?\'?(.*?)%}`

### variableRegex

Type: String

Default: `@(\\w+):[\'|]([^@]+)[\'|]`

### pathResolver

Type: Function

Default: (passes the path through unmodified)

### baseDir

Type: String

Default: null (will be relative to the file doing the inclusion)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
**2014-05-16** 0.4.0 Added option to set custom parsing regex, path resolver & added support for automatic index file detection

**2014-04-25** 0.3.1 Bugfix with numbers in variables

**2014-04-24** 0.3.0 Added option to pass variables and updated include syntax

**2014-03-06** 0.2.0 Added option to run each include multiple times with a single statement

**2013-10-09** 0.1.2 Bugfix

**2013-10-09** 0.1.1 Added strip prefix option

**2013-10-09** 0.1.0 First release
