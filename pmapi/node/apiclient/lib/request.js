/*
	class Request: represents a request (an RPC) to the PM PMAPI.

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

var _ 				= require('underscore'),
	AuthBase		= require('./auth/base.js'),
	Endpoint		= require('./endpoint.js'),
	exception		= require('./exception.js'),
	Proto			= function(){
		"use strict";

		this.name = 'Request';
		this.endpoint = function(sEndpoint){
			return new Endpoint(this.Auth, {
				server		: this.server,
				version		: this.version,
				debugMode	: this.debugMode,
				endpoint	: sEndpoint
			});
		};
	},
	Request			= function(Auth, oOptions){
		"use strict";

		var i;

		this.Auth = Auth;
		if(!(_.isObject(this.Auth) && this.Auth instanceof AuthBase)){
			throw new exception.PMAPIInvalidValueException('Auth', this.Auth);
		}

		this.version	= 1;
		this.server		= 'api.sign-up.to';
		this.debugMode	= false;

		// Overwrite any defaults
		if(_.isObject(oOptions)){
			for(i in oOptions){
				if(oOptions.hasOwnProperty(i) && this.hasOwnProperty(i)){
					this[i] = oOptions[i];
				}
			}
		}
	};

Request.prototype 	= new Proto();
module.exports 		= Request;