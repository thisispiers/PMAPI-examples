/*
	class Response: represents a PMAPI call response

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


var _ 					= require('underscore'),
	exception			= require('./exception.js'),
	UNKNOWN_ERROR_MSG	= '(unknown error)',
	MISSING_MSG			= '(empty)';

module.exports		= function(sVerb){
	"use strict";

	var oResponseData		= {
			count 				: null,
			code				: null,
			headers 			: '',
			isError				: null,
			message				: null,
			info				: null,
			rawResponse 		: '',
			response 			: null,
			status 				: null,
			next				: null,
			verb				: null
		};

	function Proto(){
		this.get 	= function(sWhat){
			if(!(_.isString(sWhat) && sWhat.length)){
				throw new exception.PMAPINoSuchFieldException(sWhat);
			}

			switch(sWhat){
				case 'count':
				case 'code':
				case 'subcode':
				case 'message':
				case 'headers':
				case 'status':
				case 'next':
				case 'info':
				case 'verb':
					return oResponseData[sWhat];

				case 'response':
					return (oResponseData.verb !== 'HEAD') ? oResponseData.response : null;

				case 'data':
					return (oResponseData.isError === false && oResponseData.verb !== 'HEAD') ? oResponseData.response.response.data : null;

				default:
					throw new exception.PMAPINoSuchFieldException(sWhat);
			}
		};

		this.isError = function(){
			return oResponseData.isError === true ? true : false;
		};
		this.error	= function(error){
			oResponseData.isError		= true;
			oResponseData.status		= 0;
			oResponseData.headers		= null;
			oResponseData.message		= 'errno: ' + error.errno + ', syscall: ' + error.syscall;
			oResponseData.code			= error.code || MISSING_MSG;

			return this;
		}

		this.finalise = function(Response, sBody){
			var aRequired,
				oResponse;

			if(!(typeof Response === "object" && Response))
				throw new exception.PMAPIInvalidResponseException("Bad response");

			oResponseData.status		= Response.statusCode;

			if(this.get('verb') !== 'HEAD'){
				if(!(_.isString(sBody) && sBody.length)){
					throw new exception.PMAPIInvalidResponseException("Empty response");
				}

				oResponseData.rawResponse 	= sBody;

				// Parse the response
				try {
					oResponseData.response 		= JSON.parse(sBody);
					if(_.isEmpty(oResponseData.response)){
						throw new Error('Parsed JSON should have data.');
					}
				} catch(e){
					throw new exception.PMAPIInvalidResponseException("Error parsing JSON from response");
				}

				// Is there data to handle?
				oResponse = oResponseData.response.response;
				switch(oResponseData.response.status){
					case 'ok':
						oResponseData.isError	= false;

						// Do we have a valid data key?
						if(!(_.isObject(oResponse) && (_.isObject(oResponse.data) || _.isArray(oResponse.data)))){
							throw new exception.PMAPIInvalidResponseException("response.data is not assoc. or list");
						}

						// Raise up the response envelope
						aRequired = ['next', 'count'];
						_.each(aRequired, function(key){
							if(!oResponseData.hasOwnProperty(key) || _.isUndefined(oResponse[key])){
								throw new exception.PMAPIInvalidResponseException('Missing field "' + key + '"');
							}

							oResponseData[key] = parseInt(oResponse[key], 10);
						});

						break;
					case 'error':
						oResponseData.isError	= true;
						oResponseData.code		= (oResponse.code || null);
						oResponseData.subcode	= (oResponse.subcode || null);
						oResponseData.message	= (oResponse.message || UNKNOWN_ERROR_MSG);
						oResponseData.info		= (oResponse.additional_information || MISSING_MSG);

						break;
					default:
						throw new exception.PMAPIInvalidResponseException('Unknown status "' + oResponse.status + '" returned');
				}
			} else {
				oResponseData.isError = oResponseData.status >= 400 ? true : false;
				if(oResponseData.isError){
					// TODO - backfill custom headers from HEAD?
					oResponseData.code		= oResponseData.status;
					oResponseData.subcode	= null;
					oResponseData.message	= UNKNOWN_ERROR_MSG;
					oResponseData.info		= MISSING_MSG;
				}
			}

			// Check the headers
			oResponseData.headers = Response.headers;
			if(_.isEmpty(oResponseData.headers)){
				throw new exception.PMAPIInvalidResponseException("Headers missing from response.");
			}

			return this;
		};

		this.getResponseFormat = function(){
			return 'application/json';
		};
	}

	function Response(sVerb){
		oResponseData.verb = sVerb;
		if(!(_.isString(oResponseData.verb) && oResponseData.verb.length)){
			throw new exception.PMAPIInvalidValueException('verb', oResponseData.verb);
		}
	}

	Response.prototype = new Proto();
	return new Response(sVerb);
};