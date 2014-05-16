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
            options = this.options({
                includeRegex: '{%.*?include:.*?([a-zA-Z0-9_@/.-]+).*?\'?(.*?)%}',
                variableRegex: '\\s@(\\w+):["|\'|\\S]([^@\']+)',
                baseDir: null,
                pathResolver: function(filepath) {
                    return filepath;
                }
            });

        this.files[0].src.forEach(function(filepath) {
            function includeVariables(content, variables) {
                for (var key in variables) {
                    if (variables.hasOwnProperty(key)) {
                        var regex = new RegExp('{{\\s*' + key + '\\s*}}', 'g');

                        content = content.replace(regex, variables[key]);
                    }
                }

                return content;
            }

            function cleanString(string) {
                if (string === undefined) {
                    return null;
                }

                return string.replace(/^\s+|\s+$/g, '');
            }

            // Perform inclusion
            function doInclude(incFp, variables, level) {
                // Check if the file exists at all, if not abort
                if (!grunt.file.exists(incFp)) {
                    grunt.log.warn('Source file "' + incFp + '" not found.');
                    return false;
                } else {
                    var filecontent = grunt.file.read(incFp),
                        regex = new RegExp(options.includeRegex, 'g'),
                        extraRegex = new RegExp(options.variableRegex, 'g'),
                        match, extraMatch;

                    // Insert variables if passed
                    filecontent = includeVariables(filecontent, variables);

                    // Look for inclusion statements in file
                    while (match = regex.exec(filecontent)) {
                        var baseDir = (options.baseDir !== null)? path.resolve(options.baseDir) : path.dirname(incFp),
                            includeFilepath = baseDir + '/' + match[1],
                            extra = match[2],
                            times = 1,
                            content = '',
                            newVariables = {},
                            multiplier;

                        // Look for variables to pass to the included file
                        while (extraMatch = extraRegex.exec(extra)) {
                            var property = cleanString(extraMatch[1]),
                                value = cleanString(extraMatch[2]);

                            newVariables[property] = value;
                        }

                        // If there's a multiply statement, parse it
                        if (multiplier = new RegExp('@(\\d+)[^:]').exec(extra)) {
                            times = multiplier[1];
                        }

                        // Check if the file (or directory) exists
                        if (grunt.file.exists(includeFilepath)) {
                            // Check if the path is a directory and if so, look for index.html in
                            // the given directory
                            if (grunt.file.isDir(includeFilepath) &&
                                grunt.file.exists(path.join(includeFilepath, 'index.html'))) {
                                includeFilepath = path.join(includeFilepath, 'index.html');
                            }

                            grunt.log.writeln(level + '> Including ' + includeFilepath);

                            // Do the inclusion the specified number of times (defaults to just once)
                            for (var i = 0; i < times; i++) {
                                content += doInclude(includeFilepath, newVariables, level + '-');
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

            grunt.file.write(dest + '/' + filename, doInclude(options.pathResolver(filepath), {}, '-'));
        });
    });
};
