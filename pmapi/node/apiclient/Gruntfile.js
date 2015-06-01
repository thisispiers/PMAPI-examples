/*
	Part of the Sign-Up.to Permission Marketing API v0.1 Redistributable


	Copyright (c) 2013 Sign-Up Technologies Ltd.
	All rights reserved.

	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are met:

	1. Redistributions of source code must retain the above copyright notice, this
	   list of conditions and the following disclaimer.
	2. Redistributions in binary form must reproduce the above copyright notice,
	   this list of conditions and the following disclaimer in the documentation
	   and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
	ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

module.exports = function(grunt){
	grunt.initConfig({
		pkg		: grunt.file.readJSON("package.json"),
		simplemocha: {
			options: {
				globals: ['should'],
				timeout: 10000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'tap'
			},
			all: {
				src: [
					'./test/api-test.js',
					'./test/exception-test.js',
					'./test/auth-test.js',
					'./test/request-test.js',
					'./test/endpoint-test.js',
					'./test/response-test.js'
				]
			}
		},
		watch: {
			files: '<config:jslint.files>',
			tasks: 'jslint'
		},

		jslint: { // configure the task
			files: [ // some example files
				'lib/**/*.js',
				'test/**/*.js'
			],
			exclude: [],
			directives: { // example directives
				browser: true,
				unparam: true,
				todo: true,
				white: true,
				nomen: true,
				predef: [ // array of pre-defined globals
				'jQuery', 'module', 'require', 'describe', 'it', 'console', 'before'
				]
			},
			options: {
				junit: 'out/junit.xml', // write the output to a JUnit XML
				log: 'out/lint.log',
				jslintXml: 'out/jslint_xml.xml',
				errorsOnly: true, // only display errors
				failOnError: false, // defaults to true
				shebang: true, // ignore shebang lines
				checkstyle: 'out/checkstyle.xml' // write a checkstyle-XML
			}
		}
	});

	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-jslint');

	grunt.registerTask('test', ['jslint', 'simplemocha:all']);
}