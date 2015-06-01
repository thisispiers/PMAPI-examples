/*
	Unit test for the exposed API.

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

describe('[API]', function(){
	"use strict";

	it('must be an object with valid keys', function(){
		pmapi
			.should.be.a('object')
			.and.have.keys(['Request', 'auth']);
	});

	describe('[auth]', function(){
		it('must be an object with valid keys', function(){
			should.exist(pmapi.auth, '.auth missing');
			pmapi.auth
				.should.be.a('object')
				.and.have.keys(['None', 'Hash', 'PartnerHash', 'Token']);
		});
	});
	describe('[auth.*]', function(){
		it('must return instances for each of the auth types', function(){
			new pmapi.auth.None()
				.should.be.an.instanceOf(require(config.lib_root + 'auth/none.js'));

			new pmapi.auth.Hash(config.auth.uid, config.auth.cid, config.auth.hash)
				.should.be.an.instanceOf(require(config.lib_root + 'auth/hash.js'));

			new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, config.auth.p_cid, config.auth.p_hash)
				.should.be.an.instanceOf(require(config.lib_root + 'auth/partnerHash.js'));

			new pmapi.auth.Token(config.auth.token)
				.should.be.an.instanceOf(require(config.lib_root + 'auth/token.js'));
		});
	});
	describe('[Request]', function(){
		it('must return an instance of Request', function(){
			new pmapi.Request(new pmapi.auth.None(), config.request)
				.should.be.an.instanceOf(require(config.lib_root + 'request.js'));
		});
	});
});
