/*
	class Endpoint: represents a PMAPI endpoint

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
	exception		= require('./exception.js'),
	Response		= require('./response.js'),
	oPackage		= require('../package.json'),
	API_SCHEME		= 'https',
	USER_AGENT 		= 'PMAPI node client v' + oPackage.version;

module.exports		= function(Auth, oOptions){
	"use strict";

	var fnBeforeSend	= null,
		fnSuccess 		= null,
		fnError			= null,
		fnComplete		= null;

	function Proto(){
		this.GET	= function(oArgs, oRequest){
			return this.doRequest('GET', oArgs, oRequest);
		};
		this.HEAD	= function(oArgs, oRequest){
			return this.doRequest('HEAD', oArgs, oRequest);
		};
		this.POST	= function(oArgs, oRequest){
			return this.doRequest('POST', oArgs, oRequest);
		};
		this.PUT	= function(oArgs, oRequest){
			return this.doRequest('PUT', oArgs, oRequest);
		};
		this.DELETE	= function(oArgs, oRequest){
			return this.doRequest('DELETE', oArgs, oRequest);
		};

		this.beforeSend	= function(fnCallback){
			if(!_.isFunction(fnCallback)){
				throw new exception.PMAPIInvalidValueException('callback', fnCallback);
			}

			fnBeforeSend = fnCallback;
			return this;
		};

		this.success	= function(fnCallback){
			if(!_.isFunction(fnCallback)){
				throw new exception.PMAPIInvalidValueException('callback', fnCallback);
			}

			fnSuccess = fnCallback;
			return this;
		};
		
		this.error		= function(fnCallback){
			if(!_.isFunction(fnCallback)){
				throw new exception.PMAPIInvalidValueException('callback', fnCallback);
			}

			fnError = fnCallback;
			return this;
		};

		this.complete	= function(fnCallback){
			if(!_.isFunction(fnCallback)){
				throw new exception.PMAPIInvalidValueException('callback', fnCallback);
			}

			fnComplete = fnCallback;
			return this;
		};

		this.doRequest = function(sVerb, oArgs, oRequest){
			if(!(_.isString(sVerb) && ['GET','HEAD','POST','PUT','DELETE'].indexOf(sVerb) >= 0)){
				throw new exception.PMAPIUnsupportedMethodException(sVerb);
			}

			if(!_.isFunction(fnSuccess) && !_.isFunction(fnComplete)){
				throw new exception.PMAPIInvalidCallbackException('success');
			}

			if(_.isObject(oArgs)){
				_.each(oArgs, function(val, key){
					if(_.isString(key) && key.length){
						return;
					}

					throw new exception.PMAPIInvalidArgumentException(key, val);
				});
			}

			var request			= require('request'),
				PMAPIResponse	= new Response(sVerb),
				Endpoint		= this,
				oRequestData	= _.extend({
					strictSSL		: true
				}, (oRequest || {})),
				PMAPIRequest;

			oRequestData.uri	= (this.server.indexOf("://") >= 0 ? '' : API_SCHEME + '://') + this.server + '/v' + this.version + '/' + this.endpoint;
			oRequestData.method	= sVerb;
			oRequestData.headers = _.extend(this.Auth.getHeaders(sVerb, this.version, this.endpoint), {
				"User-Agent"	: USER_AGENT,
				"Accept"		: PMAPIResponse.getResponseFormat()
			});

			if(_.isFunction(fnBeforeSend)){
				fnBeforeSend(PMAPIResponse);
			}

			switch(sVerb){
				case 'PUT':
				case 'POST':
					oRequestData.form 			= oArgs;
					break;
				case 'DELETE':
				case 'HEAD':
				case 'GET':
					oRequestData.qs				= oArgs;
					break;
			}

			// Do the request
			PMAPIRequest = request(oRequestData, function(error, Response, sBody){
				if(error)
					PMAPIResponse.error(error);
				else
					PMAPIResponse.finalise(Response, sBody);

				if(Endpoint.debugMode){
					console.log('/====');
					console.log('| ' + (PMAPIResponse.isError() ? '\u001b[31m' : '\u001b[34m') + 'PMAPI responded with HTTP status "' + PMAPIResponse.get('status') + '" \u001b[0m');
					console.log('|----');
					console.log('| Path: ' + sVerb + ' ' + (PMAPIRequest.req.path  || null) + ' (' + oRequestData.uri + ')');
					console.log('| Endpoint: ' + JSON.stringify(Endpoint));
					console.log('| Headers: ' + JSON.stringify(PMAPIRequest.req._headers || null));
					console.log('| Args: ' + JSON.stringify(oArgs || null));
					console.log('|----');
					console.log('| HTTP status: ' + PMAPIResponse.get('status'));
					console.log('| Headers: ' + JSON.stringify(PMAPIResponse.get('headers')));
					console.log('| Body: ' + JSON.stringify(PMAPIResponse.get('response')));
					if(PMAPIResponse.isError()){
						console.log('|----');
						console.log('| Error code: ' + JSON.stringify(PMAPIResponse.get('code')));
						console.log('| Subcode: ' + JSON.stringify(PMAPIResponse.get('subcode')));
						console.log('| Message: ' + JSON.stringify(PMAPIResponse.get('message')));
						console.log('| Additional Info: ' + JSON.stringify(PMAPIResponse.get('info')));
					}
					console.log('\\====');
				}
				if(PMAPIResponse.isError()){
					if(_.isFunction(fnError)){
						fnError(PMAPIResponse);
					}
				} else if(_.isFunction(fnSuccess)){
					fnSuccess(PMAPIResponse);
				}

				if(_.isFunction(fnComplete)){
					fnComplete(PMAPIResponse);
				}
			});

			return PMAPIResponse;
		};
	}

	function Endpoint(Auth, oOptions){
		this.Auth = Auth;
		if(!(_.isObject(this.Auth) && this.Auth instanceof AuthBase)){
			throw new exception.PMAPIInvalidValueException('Auth', this.Auth);
		}

		if(!(_.isObject(oOptions) && !_.isEmpty(oOptions))){
			throw new exception.PMAPIInvalidValueException('options', oOptions);
		}

		this.server = oOptions.server;
		if(!(_.isString(this.server) && this.server.length)){
			throw new exception.PMAPIInvalidValueException('options.server', this.server);
		}

		this.version = oOptions.version;
		if(!(_.isNumber(this.version) && !isNaN(this.version) && this.version >= 0)){
			throw new exception.PMAPIInvalidValueException('options.version', this.version);
		}

		this.endpoint = oOptions.endpoint;
		if(!(_.isString(this.endpoint) && /^[a-z_]+$/i.test(this.endpoint))){
			throw new exception.PMAPIInvalidValueException('options.endpoint', this.endpoint);
		}

		this.debugMode = oOptions.debugMode;
		if(!_.isBoolean(this.debugMode)){
			throw new exception.PMAPIInvalidValueException('options.debugMode', this.debugMode);
		}
	}

	Endpoint.prototype = new Proto();
	return new Endpoint(Auth, oOptions);
};