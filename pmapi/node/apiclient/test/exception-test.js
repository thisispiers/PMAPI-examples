/*
	Unit test for all exception classes

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

var config			= require('./config-test.json'),
	exception		= require(config.lib_root + 'exception.js'),
	should 			= require('should');

describe('[Exception]', function(){
	"use strict";

	it('must be an object with valid keys', function(){
		exception
			.should.be.a('object')
			.and.have.keys([
				'PMAPIRuntimeEnvironmentException',
				'PMAPICURLException',
				'PMAPIInvalidResponseException',
				'PMAPIUnsupportedMethodException',
				'PMAPIInvalidValueException',
				'PMAPIRuntimeEnvironmentException',
				'PMAPIInvalidCallbackException',
				'PMAPINoSuchFieldException'
			]);
	});

	describe('[.*]', function(){
		it('must throw with a valid type and members', function(){
			var i;
			for(i in exception){
				if(exception.hasOwnProperty(i)){
					try {
						throw new exception[i]('PMAPI error');
					} catch(e){
						e.name
							.should.equal(i);

						e.message
							.should.match(/PMAPI error/i);

						e.stack
							.should.be.a('string')
							.and.not.equal('');
					}
				}
			}
		});
	});
});
