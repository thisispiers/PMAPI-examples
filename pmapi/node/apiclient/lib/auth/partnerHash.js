/*
	class Hash: represents hash authentication with the PMAPI

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

var _					= require('underscore'),
	exception			= require('../exception.js'),
	Proto				= require('./base.js'),
	SUT_API_HASH_LEN 	= 40,
	Abstraction			= function(){
		"use strict";

		this.getHeaders = function(sVerb, iVersion, sEndpoint){
			var crypto 			= require('crypto'),
				sha1			= crypto.createHash('sha1'),
				aHeaders 		= {
					"Date"			: this.getDate(),
					"X-SuT-PID"		: this.pid,
					"X-SuT-CID" 	: this.cid,
					"X-SuT-UID" 	: this.uid,
					"X-SuT-Nonce"	: this.getNonce(new Date().getTime() / 1000)
				},
				aHeaders_ 		= [sVerb.toUpperCase() + ' /v' + iVersion + '/' + sEndpoint],
				i;



			// Optional, remove due to signature string
			if(!this.cid)
				delete(aHeaders["X-SuT-CID"]);

			// Optional, remove due to signature string
			if(!this.uid)
				delete(aHeaders["X-SuT-UID"]);

			// Add headers ready for the signature string
			for(i in aHeaders){
				if(aHeaders.hasOwnProperty(i)){
					aHeaders_.push(i + ': ' + aHeaders[i]);
				}
			}
			aHeaders_.push(this.hash);
			sha1.update(aHeaders_.join("\r\n"));

			aHeaders.Authorization = 'SuTPartner signature="' + sha1.digest('hex') + '"';

			return aHeaders;
		};
	},
	AuthHash	= function(pid, uid, cid, hash){
		"use strict";

		this.pid = parseInt(pid, 10);
		if(isNaN(this.pid) || this.pid <= 0){
			throw new exception.PMAPIInvalidValueException('User ID (pid)', this.pid);
		}

		// Optional
		if(typeof uid === "number" && uid >= 0)
			this.uid = parseInt(uid, 10);
		else
			this.uid = null;

		// Optional
		if(typeof cid === "number" && cid >= 0)
			this.cid = parseInt(cid, 10);
		else
			this.cid = null;

		this.hash = hash;
		if(!(_.isString(this.hash) && this.hash.length === SUT_API_HASH_LEN)){
			throw new exception.PMAPIInvalidValueException('API key (hash)', this.hash);
		}
	};

Abstraction.prototype	= new Proto();
AuthHash.prototype 		= new Abstraction();
module.exports 			= AuthHash;