/*
	Unit test for the endpoint class

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

describe('[Endpoint]', function(){
	"use strict";

	var _				= require('underscore'),
		BaseAuth		= require(config.lib_root + '/auth/base.js'),
		validateBase 	= function(Endpoint){
			should.exist(Endpoint, 'no Endpoint returned');

			should.exist(Endpoint.Auth, '.Auth missing');
			Endpoint.Auth
				.should.be.an.instanceOf(BaseAuth);

			should.exist(Endpoint.version, '.version missing');
			Endpoint.version
				.should.be.a('number')
				.and.be.above(-1);

			should.exist(Endpoint.endpoint, '.endpoint missing');
			Endpoint.endpoint
				.should.be.a('string')
				.and.not.equal('');

			should.exist(Endpoint.server, '.server missing');
			Endpoint.server
				.should.be.a('string')
				.and.not.equal('');

			should.exist(Endpoint.debugMode, '.debugMode missing');
			Endpoint.debugMode
				.should.be.a('boolean');

			should.exist(Endpoint.GET, '.GET missing');
			Endpoint.GET
				.should.be.a('function');

			should.exist(Endpoint.HEAD, '.HEAD missing');
			Endpoint.HEAD
				.should.be.a('function');

			should.exist(Endpoint.POST, '.POST missing');
			Endpoint.POST
				.should.be.a('function');

			should.exist(Endpoint.PUT, '.PUT missing');
			Endpoint.PUT
				.should.be.a('function');

			should.exist(Endpoint.DELETE, '.DELETE missing');
			Endpoint.DELETE
				.should.be.a('function');

			should.exist(Endpoint.doRequest, '.doRequest missing');
			Endpoint.doRequest
				.should.be.a('function');

			should.exist(Endpoint.beforeSend, '.beforeSend missing');
			Endpoint.beforeSend
				.should.be.a('function');

			should.exist(Endpoint.success, '.success missing');
			Endpoint.success
				.should.be.a('function');

			should.exist(Endpoint.error, '.error missing');
			Endpoint.error
				.should.be.a('function');

			should.exist(Endpoint.complete, '.complete missing');
			Endpoint.complete
				.should.be.a('function');
		},
		validateRequest	= function(Endpoint){
			var aVerb = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'];

			_.each(aVerb, function(verb){
				try{
					Endpoint[verb]();
					throw new Error('Invalid .fnSuccess callback must error on verb call (' + verb + ')');
				} catch(e){
					e.name
						.should.equal('PMAPIInvalidCallbackException', e.message);
				}
				try{
					Endpoint.doRequest(verb);
					throw new Error('Invalid .fnSuccess callback must error on doRequest call (' + verb + ')');
				} catch(e){
					e.name
						.should.equal('PMAPIInvalidCallbackException', e.message);
				}
			});
		};

	describe('[None]', function(){
		var Request 	= new pmapi.Request(new pmapi.auth.None(), config.request),
			Endpoint 	= Request.endpoint('test');

		it('must return a valid instance of Endpoint', function(){
			validateBase(Endpoint);
		});
		it('must only make requests if suitable to do so', function(){
			validateRequest(Endpoint);
		});
	});
	describe('[Hash]', function(){
		var Request 	= new pmapi.Request(new pmapi.auth.Hash(config.auth.uid, config.auth.cid, config.auth.hash), config.request),
			Endpoint 	= Request.endpoint('test');

		it('must return a valid instance of Endpoint', function(){
			validateBase(Endpoint);
		});
		it('must only make requests if suitable to do so', function(){
			validateRequest(Endpoint);
		});
	});
	describe('[Token]', function(){
		var Request 	= new pmapi.Request(new pmapi.auth.Token(config.auth.token), config.request),
			Endpoint 	= Request.endpoint('test');

		it('must return a valid instance of Endpoint', function(){
			validateBase(Endpoint);
		});
		it('must only make requests if suitable to do so', function(){
			validateRequest(Endpoint);
		});
	});
});