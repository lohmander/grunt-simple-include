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
                variableRegex: '@([^@]+)'
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

            function doInclude(incFp, variables, level) {
                if (!grunt.file.exists(incFp)) {
                    grunt.log.warn('Source file "' + incFp + '" not found.');
                    return false;
                } else {

                    var filecontent = grunt.file.read(incFp),
                        regex = new RegExp(options.includeRegex, 'g'),
                        extraRegex = new RegExp(options.variableRegex, 'g'),
                        match, extraMatch;

                    filecontent = includeVariables(filecontent, variables);

                    while (match = regex.exec(filecontent)) {
                        var includeFilepath = path.dirname(incFp) + '/' + match[1],
                            extra = match[2],
                            times = 1,
                            content = '',
                            newVariables = {};

                        while (extraMatch = extraRegex.exec(extra)) {
                            var param = extraMatch[1].replace(/^\s+|\s+$/, ''),
                                paramMatch;

                            if (param.match('^\\d+')) {
                                times = parseInt(param, 10);
                            }

                            if (paramMatch = param.match('([^:]+):(.+)')) {
                                var property = paramMatch[1],
                                    value = paramMatch[2].replace(/^\s*'|'\s*$/g, '');
                                newVariables[property] = value;
                            }
                        }

                        if (grunt.file.exists(includeFilepath)) {
                            if (grunt.file.isDir(includeFilepath) &&
                                grunt.file.exists(path.join(includeFilepath, 'index.html'))) {
                                includeFilepath = path.join(includeFilepath, 'index.html');
                            }

                            grunt.log.writeln(level + '> Including ' + includeFilepath);

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

            grunt.file.write(dest + '/' + filename, doInclude(filepath, {}, '-'));
        });
    });
};
