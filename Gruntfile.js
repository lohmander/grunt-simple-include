/*
 * grunt-simple-include
 * https://github.com/lohmander/grunt-simple-include
 *
 * Copyright (c) 2013 Hannes Lohmander
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    simple_include: {
      options: {
        stripPrefix: '_'
      },
      default_options: {
        src: ['test/fixtures/_*.html', 'test/fixtures/header.html'],
        dest: 'tmp/'
      },
      custom_options: {
        src: ['tmp/*.html'],
        dest: 'tmp/',
        options: {
          includeRegex: '<widget.([a-zA-Z0-9_@/.-]+).*?(.*?")>',
          variableRegex: '(\\w+)=["|\'](\\w+)["|\']',
          baseDir: 'test/fixtures',
          pathResolver: function (filepath) {
            return path.join(path.dirname(filepath).replace(/\./g, '/'), path.basename(filepath));
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'simple_include', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
