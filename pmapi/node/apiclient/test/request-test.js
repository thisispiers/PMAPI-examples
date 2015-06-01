/*
	Unit test for the request class

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

describe('[Request]', function(){
	"use strict";

	it('must have it\'s members on construct', function(){
		var Request = new pmapi.Request(new pmapi.auth.None());

		should.exist(Request.Auth, '.Auth missing');
		Request.Auth
			.should.be.an.instanceOf(pmapi.auth.None);

		should.exist(Request.endpoint, '.endpoint missing');
		Request.endpoint
			.should.be.a('function');

		should.exist(Request.endpoint, '.endpoint missing');
		Request.endpoint
			.should.be.a('function');

		should.exist(Request.version, '.version missing');
		Request.version
			.should.equal(config.api.version);

		should.exist(Request.server, '.server missing');
		Request.server
			.should.equal(config.api.server);

		should.exist(Request.debugMode, '.debugMode missing');
		Request.debugMode
			.should.equal(false);
	});

	it('must be constructed with valid "Auth"', function(){
		var aParam	= [undefined, null, '', 'abc', [], {},  function(){return this;}, -1, NaN, 0, 1],
			aAuth	= [],
			i;

		for(i in aParam){
			if(aParam.hasOwnProperty(i)){
				try {
					aAuth.push(new pmapi.Request(aParam[i], config.request));
					throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
				} catch(e){
					e.name
						.should.equal('PMAPIInvalidValueException', e.message);
				}
			}
		}
	});

	it('must construct with all valid auth types', function(){
		var Request = new pmapi.Request(new pmapi.auth.None(), config.request);

		should.exist(Request.Auth, '.Auth missing');
		Request.Auth
			.should.be.an.instanceOf(pmapi.auth.None);

		Request = new pmapi.Request(new pmapi.auth.Hash(config.auth.uid, config.auth.cid, config.auth.hash), config.request);

		should.exist(Request.Auth, '.Auth missing');
		Request.Auth
			.should.be.an.instanceOf(pmapi.auth.Hash);

		Request = new pmapi.Request(new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, config.auth.p_cid, config.auth.p_hash), config.request);

		should.exist(Request.Auth, '.Auth missing');
		Request.Auth
			.should.be.an.instanceOf(pmapi.auth.PartnerHash);

		Request = new pmapi.Request(new pmapi.auth.Token(config.auth.token), config.request);

		should.exist(Request.Auth, '.Auth missing');
		Request.Auth
			.should.be.an.instanceOf(pmapi.auth.Token);
	});

	it('must store it\'s construct variables correctly', function(){
		var Request = new pmapi.Request(new pmapi.auth.None(), {
			version		: 999,
			server		: 'xxx.xxxx-xxxx.xx',
			debugMode	: true
		});

		should.exist(Request.version, '.version missing');
		Request.version
			.should.equal(999);

		should.exist(Request.server, '.server missing');
		Request.server
			.should.equal('xxx.xxxx-xxxx.xx');

		should.exist(Request.debugMode, '.debugMode missing');
		Request.debugMode
			.should.equal(true);
	});
});