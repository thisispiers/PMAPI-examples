/*
	Unit test for the resonse class

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
	pmapi 			= require('../index.js'),
	should 			= require('should');

describe('[Response]', function(){
	"use strict";

	var _		 		= require('underscore'),
		aVerbs			= ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
		validateBase	= function(Response){
			var aValidKeys = ['count', 'code', 'subcode', 'headers', 'message', 'response', 'status', 'next', 'verb', 'data'];

			should.exist(Response);

			should.exist(Response.get, '.get() missing');
			Response.get
				.should.be.a('function');

			should.exist(Response.finalise, '.finalise() missing');
			Response.finalise
				.should.be.a('function');

			should.exist(Response.getResponseFormat, '.getResponseFormat() missing');
			Response.getResponseFormat
				.should.be.a('function');

			should.exist(Response.isError, '.isError() missing');
			Response.isError
				.should.be.a('function');

			_.each(aValidKeys, function(key){
				Response.get(key);
			});

			try{
				Response.get('abcdefg');
				throw new Error('Unknown field must error');
			} catch(e){
				e.name
					.should.equal('PMAPINoSuchFieldException', e.message);
			}

			should.exist(Response.get('verb'), 'var "verb" not available');
			Response.get('verb')
				.should.be.a('string')
				.and.not.equal('');

			if(Response.get('verb') !== 'HEAD'){
				should.exist(Response.get('response'), 'var "response" not available');	
				Response.get('response')
					.should.be.a('object')
					.and.have.keys([
						'status',
						'response'
					]);
			}
		},
		validateSuccess = function(Response){
			should.exist(Response);

			Response.isError()
				.should.equal(false);

			should.exist(Response.get('status'), 'var "status" not available');	
			Response.get('status')
				.should.be.a('number')
				.and.within(200, 399);

			switch(Response.get('verb')){
				case 'GET':
					should.exist(Response.get('next'), 'var "next" not available');	
					Response.get('next')
						.should.not.be.a('undefined');

					should.exist(Response.get('count'), 'var "count" not available');	
					Response.get('count')
						.should.be.a('number');

					should.exist(Response.get('response'), 'var "response" not available');	
					Response.get('response')
						.should.be.a('object');

					should.exist(Response.get('headers'), 'var "headers" not available');	
					Response.get('headers')
						.should.be.a('object');

					should.exist(Response.get('data'), 'var "data" not available');	
					Response.get('data')
						.should.be.a('object');

					break;
				case 'PUT':
				case 'POST':
				case 'DELETE':
					should.exist(Response.get('response'), 'var "response" not available');	
					Response.get('response')
						.should.be.a('object');

					should.exist(Response.get('headers'), 'var "headers" not available');	
					Response.get('headers')
						.should.be.a('object');

					should.exist(Response.get('data'), 'var "data" not available');	
					Response.get('data')
						.should.be.a('object');

					break;
				case 'HEAD':
					should.not.exist(Response.get('response'));
					should.not.exist(Response.get('data'));

					should.exist(Response.get('headers'), 'var "headers" not available');
					Response.get('headers')
						.should.be.a('object');

					break;
			}
		},
		validateError	= function(Response){
			should.exist(Response);

			Response.isError()
				.should.equal(true);

			should.exist(Response.get('status'), 'var "status" not available');
			Response.get('status')
				.should.be.a('number')
				.and.within(400, 999);

			if(Response.get('code') !== null){
				Response.get('code')
					.should.be.a('number')
					.and.above(0);
			}

			if(Response.get('subcode') !== null){
				Response.get('subcode')
					.should.be.a('number')
					.and.above(0);
			}

			if(Response.get('verb') !== 'HEAD'){
				Response.get('response').response
					.should.be.a('object');

				should.exist(Response.get('message'), 'var "message" not available');
				Response.get('message')
					.should.be.a('string')
					.and.not.equal('');
			}
		},
		runToken		= function(sToken){
			describe('[Response] [Token]', function(){
				var Request = new pmapi.Request(new pmapi.auth.Token(sToken), config.request);

				_.each(aVerbs, function(verb){
					describe('[' + verb + ']', function(){
						it('must fail with invalid arguments', function(done){
							try{
								Request
									.endpoint(config.endpoint.path)
									.complete(function(PMAPIResponse){
										return;
									})
									.doRequest(verb, config.endpoint.invalidArgs);

								throw new Error('Bad arguments must error');
							} catch(e){
								e.name
									.should.equal('PMAPIInvalidArgumentException', e.message);

								done();
							}
						});
						it('must issue and handle a request/response', function(done){
							Request
								.endpoint(config.endpoint.path)
								.complete(function(PMAPIResponse){
									validateBase(PMAPIResponse);

									if(PMAPIResponse.isError()){
										validateError(PMAPIResponse);
									} else {
										validateSuccess(PMAPIResponse);
									}

									done();
								})
								.doRequest(verb, config.endpoint.args);
						});
					});
				});
			});
		};

	describe('[Hash]', function(){
		var Request = new pmapi.Request(new pmapi.auth.Hash(config.auth.uid, config.auth.cid, config.auth.hash), config.request);

		_.each(aVerbs, function(verb){
			describe('[' + verb + ']', function(){
				it('must fail with invalid arguments', function(done){
					try{
						Request
							.endpoint(config.endpoint.path)
							.complete(function(PMAPIResponse){
								return;
							})
							.doRequest(verb, config.endpoint.invalidArgs);

						throw new Error('Bad arguments must error');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidArgumentException', e.message);

						done();
					}
				});
				it('must issue and handle a request/response', function(done){
					Request
						.endpoint(config.endpoint.path)
						.complete(function(PMAPIResponse){
							validateBase(PMAPIResponse);

							if(PMAPIResponse.isError()){
								validateError(PMAPIResponse);
							} else {
								validateSuccess(PMAPIResponse);
							}

							done();
						})
						.doRequest(verb, config.endpoint.args);
				});
			});
		});
	});

	describe('[PartnerHash]', function(){
		var Request = new pmapi.Request(new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, config.auth.p_cid, config.auth.p_hash), config.request);

		_.each(aVerbs, function(verb){
			describe('[' + verb + ']', function(){
				it('must fail with invalid arguments', function(done){
					try{
						Request
							.endpoint(config.endpoint.path)
							.complete(function(PMAPIResponse){
								return;
							})
							.doRequest(verb, config.endpoint.invalidArgs);

						throw new Error('Bad arguments must error');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidArgumentException', e.message);

						done();
					}
				});
				it('must issue and handle a request/response', function(done){
					Request
						.endpoint(config.endpoint.path)
						.complete(function(PMAPIResponse){
							validateBase(PMAPIResponse);

							if(PMAPIResponse.isError()){
								validateError(PMAPIResponse);
							} else {
								validateSuccess(PMAPIResponse);
							}

							done();
						})
						.doRequest(verb, config.endpoint.args);
				});
			});
		});
	});

	describe('[None]', function(){
		var Request = new pmapi.Request(new pmapi.auth.None(), config.request);

		it('must trigger beforeSend callback', function(done){
			Request
				.endpoint('token')
				.beforeSend(function(PMAPIResponse){
					should.not.exist(PMAPIResponse.get('status'));
					done();
				})
				.complete(function(){
					return this;
				})
				.POST({
					username		: config.auth.username,
					password		: config.auth.password
				});
		});

		it('must trigger complete callback', function(done){
			Request
				.endpoint('token')
				.complete(function(PMAPIResponse){
					validateBase(PMAPIResponse);
					done();
				})
				.success(function(){
					return this;
				})
				.POST({
					username		: config.auth.username,
					password		: config.auth.password
				});	
		});

		it('must trigger error callback', function(done){
			Request
				.endpoint('token')
				.success(function(){
					throw new Error('Success condition should not be met');
				})
				.error(function(PMAPIResponse){
					validateBase(PMAPIResponse);
					validateError(PMAPIResponse);
					done();
				})
				.PUT();	
		});

		it('must trigger success callback', function(done){
			Request
				.endpoint('token')
				.success(function(PMAPIResponse){
					validateBase(PMAPIResponse);
					validateSuccess(PMAPIResponse);

					var sToken = PMAPIResponse.get('data').token;
					sToken
						.should.be.a('string')
						.and.not.equal('');

					runToken(sToken);

					done();
				})
				.error(function(PMAPIResponse){
					return this;
				})
				.POST({
					username		: config.auth.username,
					password		: config.auth.password
				});		
		});
	});
});