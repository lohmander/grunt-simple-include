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
    grunt.registerMultiTask('simple_include', 'Super easy way to include files with a familiar syntax.', function() {
        var dest = this.data.dest,
            options = this.options();

        this.files[0].src.forEach(function(filepath) {
            function doInclude(incFp, level) {

                if (!grunt.file.exists(incFp)) {
                    grunt.log.warn('Source file "' + incFp + '" not found.');
                    return false;
                } else {

                    var filecontent = grunt.file.read(incFp),
                        regex = new RegExp('{{.*?include:.*?([a-zA-Z0-9_@/.-]+)(.*?|.*?\\@\\d+.*?)}}', 'g'),
                        match;

                    while (match = regex.exec(filecontent)) {
                        var includeFilepath = path.dirname(incFp) + '/' + match[1],
                            timesMatch = match[2].replace(' ', ''),
                            times = (timesMatch !== undefined)? timesMatch.substr(2, timesMatch.length) : 1;

                        if (grunt.file.exists(includeFilepath)) {
                            grunt.log.writeln(level + '> Including ' + includeFilepath);

                            var content = doInclude(includeFilepath, level + '-');

                            for (var i = 1; i < times; i++) {
                                content += doInclude(includeFilepath, level + '-');
                            }

                            filecontent = filecontent.replace(new RegExp(match[0], 'g'), content);
                        } else {
                            grunt.log.warn('Include path "' + includeFilepath + '" not found.');
                        }
                    }

                    return filecontent;
                }
            }

            grunt.log.writeln('\nParsing ' + filepath + '.');

            var filename = path.basename(filepath);

            if (options.stripPrefix) {
                if (path.basename(filepath).substr(0, options.stripPrefix.length) === options.stripPrefix) {
                    filename = filename.substr(options.stripPrefix.length);
                }
            }

            grunt.file.write(dest + '/' + filename, doInclude(filepath, '-'));
        });
    });
};