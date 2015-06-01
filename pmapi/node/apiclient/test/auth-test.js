/*
	Unit test for the authentication classes

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

describe('[Auth]', function(){
	"use strict";

	var Base			= require(config.lib_root + 'auth/base.js'),
		validateBase 	= function(Class){
			should.exist(Class.getDate, '.getDate() missing');
			Class.getDate
				.should.be.a('function');

			should.exist(Class.getNonce, '.getNonce() missing');
			Class.getNonce
				.should.be.a('function');
		};

	describe('[Base]', function(){
		it('must have all members available', function(){
			validateBase(new Base());
		});
	});

	describe('[None]', function(){
		it('must be derived from base Auth', function(){
			var None = new pmapi.auth.None();

			None.should.be.an.instanceOf(Base);
			validateBase(None);
		});
		it('must have getHeaders()', function(){
			var None = new pmapi.auth.None();

			should.exist(None.getHeaders, '.getHeaders() missing');
			None.getHeaders
				.should.be.a('function');

			None.getHeaders()
				.should.be.a('object')
				.and.eql({});
		});
	});

	describe('[Hash]', function(){
		it('must be constructed with a valid "uid"', function(){
			var aParam	= [undefined, null, '', 'abc', [], {},  function(){return this;}, -1, NaN, 0],
				aHashes	= [],
				i;

			for(i in aParam){
				if(aParam.hasOwnProperty(i)){
					try {
						aHashes.push(new pmapi.auth.Hash(aParam[i]));
						throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidValueException', e.message);
					}
				}
			}
		});

		it('must be constructed with a valid "cid"', function(){
			var aParam 	= [undefined, null, '', 'abc', [], {}, function(){return this;}, -1, NaN, 0],
				aHashes	= [],
				i;

			for(i in aParam){
				if(aParam.hasOwnProperty(i)){
					try {
						aHashes.push(new pmapi.auth.Hash(config.auth.uid, aParam[i]));
						throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidValueException', e.message);
					}
				}
			}
		});

		it('must be constructed with a valid "hash"', function(){
			var aParam 	= [undefined, null, '', 'abc', [], {},  function(){return this;}, -1, NaN, 0, 1],
				aHashes	= [],
				i;

			for(i in aParam){
				if(aParam.hasOwnProperty(i)){
					try {
						aHashes.push(new pmapi.auth.Hash(config.auth.uid, config.auth.cid, aParam[i]));
						throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidValueException', e.message);
					}
				}
			}
		});

		it('must be derived from base Auth', function(){
			var Hash = new pmapi.auth.Hash(config.auth.uid, config.auth.cid, config.auth.hash);
		
			Hash.should.be.an.instanceOf(Base);
			validateBase(Hash);
		});

		it('must store construct variables correctly', function(){
			var Hash = new pmapi.auth.Hash(config.auth.uid, config.auth.cid, config.auth.hash);
		
			should.exist(Hash.uid, '.uid missing');
			Hash.uid
				.should.equal(config.auth.uid);

			should.exist(Hash.cid, '.cid missing');
			Hash.cid
				.should.equal(config.auth.cid);

			should.exist(Hash.hash, '.hash missing');
			Hash.hash
				.should.equal(config.auth.hash);
		});

		it('Must have getHeaders()', function(){
			var Hash 	 = new pmapi.auth.Hash(config.auth.uid, config.auth.cid, config.auth.hash),
				oHeaders;

			should.exist(Hash.getHeaders, '.getHeaders() missing');
			Hash.getHeaders
				.should.be.a('function');

			oHeaders = Hash.getHeaders('GET', config.version, 'test');

			oHeaders
				.should.be.a('object')
				.and.have.keys([
					'Date',
					'X-SuT-CID',
					'X-SuT-UID',
					'X-SuT-Nonce',
					'Authorization'
				]);

			oHeaders.Date
				.should.be.a('string')
				.and.match(/^[\w\d\s,:]+$/i);

			oHeaders["X-SuT-CID"]
				.should.be.a('number')
				.and.be.above(0);

			oHeaders["X-SuT-UID"]
				.should.be.a('number')
				.and.be.above(0);

			oHeaders["X-SuT-Nonce"]
				.should.be.a('string')
				.and.match(/^[a-f0-9]{1,40}$/i);

			oHeaders.Authorization
				.should.be.a('string')
				.and.match(/^SuTHash signature="[a-f0-9]{40}"$/i);
		});
	});

	describe('[PartnerHash]', function(){
		it('must be constructed with a valid "pid"', function(){
			var aParam	= [undefined, null, '', 'abc', [], {},  function(){return this;}, -1, NaN, 0],
				aHashes	= [],
				i;

			for(i in aParam){
				if(aParam.hasOwnProperty(i)){
					try {
						aHashes.push(new pmapi.auth.PartnerHash(aParam[i]));
						throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidValueException', e.message);
					}
				}
			}
		});

		it('must be constructed with a valid "uid"', function(){
			var aParam 	= [undefined, null, '', 'abc', [], {}, function(){return this;}, -1, NaN, 0],
				aHashes	= [],
				i;

			for(i in aParam){
				if(aParam.hasOwnProperty(i)){
					try {
						aHashes.push(new pmapi.auth.PartnerHash(config.auth.p_id, aParam[i]));
						throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidValueException', e.message);
					}
				}
			}
		});

		it('must be constructed with a valid "cid"', function(){
			var aParam 	= [undefined, null, '', 'abc', [], {}, function(){return this;}, -1, NaN, 0],
				aHashes	= [],
				i;

			for(i in aParam){
				if(aParam.hasOwnProperty(i)){
					try {
						aHashes.push(new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, aParam[i]));
						throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidValueException', e.message);
					}
				}
			}
		});

		it('must be constructed with a valid "hash"', function(){
			var aParam 	= [undefined, null, '', 'abc', [], {},  function(){return this;}, -1, NaN, 0, 1],
				aHashes	= [],
				i;

			for(i in aParam){
				if(aParam.hasOwnProperty(i)){
					try {
						aHashes.push(new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, config.auth.p_cid, aParam[i]));
						throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidValueException', e.message);
					}
				}
			}
		});

		it('must be derived from base Auth', function(){
			var Hash = new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, config.auth.p_cid, config.auth.p_hash);
		
			Hash.should.be.an.instanceOf(Base);
			validateBase(Hash);
		});

		it('must store construct variables correctly', function(){
			var Hash = new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, config.auth.p_cid, config.auth.p_hash);

			should.exist(Hash.pid, '.pid missing');
			Hash.pid
				.should.equal(config.auth.p_id);
		
			should.exist(Hash.uid, '.uid missing');
			Hash.uid
				.should.equal(config.auth.p_uid);

			should.exist(Hash.cid, '.cid missing');
			Hash.cid
				.should.equal(config.auth.p_cid);

			should.exist(Hash.hash, '.hash missing');
			Hash.hash
				.should.equal(config.auth.p_hash);
		});

		it('must store construct variables correctly (no uid)', function(){
			var Hash = new pmapi.auth.PartnerHash(config.auth.p_id, null, config.auth.p_cid, config.auth.p_hash);

			should.exist(Hash.pid, '.pid missing');
			Hash.pid
				.should.equal(config.auth.p_id);
		
			should.not.exist(Hash.uid, '.uid missing');

			should.exist(Hash.cid, '.cid missing');
			Hash.cid
				.should.equal(config.auth.p_cid);

			should.exist(Hash.hash, '.hash missing');
			Hash.hash
				.should.equal(config.auth.p_hash);
		});

		it('must store construct variables correctly (no cid)', function(){
			var Hash = new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, null, config.auth.p_hash);

			should.exist(Hash.pid, '.cid missing');
			Hash.pid
				.should.equal(config.auth.p_id);
		
			should.exist(Hash.uid, '.uid missing');
			Hash.uid
				.should.equal(config.auth.p_uid);

			should.not.exist(Hash.cid, '.cid missing');

			should.exist(Hash.hash, '.hash missing');
			Hash.hash
				.should.equal(config.auth.p_hash);
		});

		it('Must have getHeaders()', function(){
			var Hash 	 = new pmapi.auth.PartnerHash(config.auth.p_id, config.auth.p_uid, config.auth.p_cid, config.auth.p_hash),
				oHeaders;

			should.exist(Hash.getHeaders, '.getHeaders() missing');
			Hash.getHeaders
				.should.be.a('function');

			oHeaders = Hash.getHeaders('GET', config.version, 'test');

			oHeaders
				.should.be.a('object')
				.and.have.keys([
					'Date',
					'X-SuT-PID',
					'X-SuT-CID',
					'X-SuT-UID',
					'X-SuT-Nonce',
					'Authorization'
				]);

			oHeaders.Date
				.should.be.a('string')
				.and.match(/^[\w\d\s,:]+$/i);

			oHeaders["X-SuT-PID"]
				.should.be.a('number')
				.and.be.above(0);

			oHeaders["X-SuT-CID"]
				.should.be.a('number')
				.and.be.above(0);

			oHeaders["X-SuT-UID"]
				.should.be.a('number')
				.and.be.above(0);

			oHeaders["X-SuT-Nonce"]
				.should.be.a('string')
				.and.match(/^[a-f0-9]{1,40}$/i);

			oHeaders.Authorization
				.should.be.a('string')
				.and.match(/^SuTPartner signature="[a-f0-9]{40}"$/i);
		});

	it('Must omit cid and uid getHeaders()', function(){
			var Hash 	 = new pmapi.auth.PartnerHash(config.auth.p_id, null, null, config.auth.p_hash),
				oHeaders;

			should.exist(Hash.getHeaders, '.getHeaders() missing');
			Hash.getHeaders
				.should.be.a('function');

			oHeaders = Hash.getHeaders('GET', config.version, 'test');

			oHeaders
				.should.be.a('object')
				.and.have.keys([
					'Date',
					'X-SuT-PID',
					'X-SuT-Nonce',
					'Authorization'
				]);

			oHeaders.Date
				.should.be.a('string')
				.and.match(/^[\w\d\s,:]+$/i);

			oHeaders["X-SuT-PID"]
				.should.be.a('number')
				.and.be.above(0);

			should.not.exist(oHeaders["X-SuT-CID"]);
			should.not.exist(oHeaders["X-SuT-UID"]);

			oHeaders["X-SuT-Nonce"]
				.should.be.a('string')
				.and.match(/^[a-f0-9]{1,40}$/i);

			oHeaders.Authorization
				.should.be.a('string')
				.and.match(/^SuTPartner signature="[a-f0-9]{40}"$/i);
		});
	});

	describe('[Token]', function(){
		it('must be constructed with a valid "token"', function(){
			var aParam	= [undefined, null, '', 'abc', [], {},  function(){return this;}, -1, NaN, 0, 1],
				aTokens	= [],
				i;

			for(i in aParam){
				if(aParam.hasOwnProperty(i)){
					try {
						aTokens.push(new pmapi.auth.Token(aParam[i]));
						throw new Error('Construct failed to error on value "' + aParam[i] + '" (' + typeof aParam[i] + ')');
					} catch(e){
						e.name
							.should.equal('PMAPIInvalidValueException', e.message);
					}
				}
			}
		});

		it('must be derived from base Auth', function(){
			var Token = new pmapi.auth.Token(config.auth.token);
		
			Token.should.be.an.instanceOf(Base);
			validateBase(Token);
		});

		it('must store construct variables correctly', function(){
			var Token = new pmapi.auth.Token(config.auth.token);
		
			should.exist(Token.token, '.token missing');
			Token.token
				.should.equal(config.auth.token);
		});

		it('Must have getHeaders()', function(){
			var Token = new pmapi.auth.Token(config.auth.token),
				oHeaders;

			should.exist(Token.getHeaders, '.getHeaders() missing');
			Token.getHeaders
				.should.be.a('function');

			oHeaders = Token.getHeaders('GET', config.version, 'test');

			oHeaders
				.should.be.a('object')
				.and.have.keys([
					'Date',
					'X-SuT-Nonce',
					'Authorization'
				]);

			oHeaders.Date
				.should.be.a('string')
				.and.match(/^[\w\d\s,:]+$/i);

			oHeaders["X-SuT-Nonce"]
				.should.be.a('string')
				.and.match(/^[a-f0-9]{1,40}$/i);

			oHeaders.Authorization
				.should.be.a('string')
				.and.match(/^SuTToken [a-z0-9\/+]{96}$/i);
		});
	});
});
