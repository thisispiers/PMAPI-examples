/*
	example-auth-hash.php

	Demonstrates the process of setting up a Permission Marketing API
	request using the Hash authentication method.


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


// Require the library
//
var pmapi 	= require('pmapi-client');


// Authentication credentials
//
// Insert the username and password of the authenticating user
//
var	username	= "abcdef",
	password	= "zyx123";


// Initiating a Request
//
// Create a request object based on the None authentication system.
//
var Request = new pmapi.Request(new pmapi.auth.None(), {
		debugMode		: true
	});


// Specifying an endpoint
//
// Specify the endpoint we are requesting against
// Note: The request won't be issued until later
//
var Endpoint	= Request.endpoint('token');


// Callbacks
//
// The endpoint needs to know what to do when certain events occur.
// Callbacks are triggered on "beforeSend", "success", "error" and "complete".
// A "success" or "complete" callback must be present.
//
Endpoint
	.beforeSend(function(Response){
		console.log('Callback "beforeSend" called, status: "' + Response.get('status') + '"');
	})
	.success(function(Response){
		console.log('Callback "success" called, status: " ' + Response.get('status') + '"');

		// Response
		//
		// Store the attributes returned by the response
		//
		var data = Response.get('data');


		// Initiating an authenticated request
		//
		// Use this token to create a new request using the Token authentication system
		// Note: authentication will not occur until an API call is made using the
		// request object.
		//
		var AuthenticatedRequest = new pmapi.Request(new pmapi.auth.Token(data.token), {
				debugMode : true
			});


		// Making a request
		//
		// Read the collection of lists in your SuT account, sorted by creation date.
		//
		AuthenticatedRequest
			.endpoint('list')
			.success(function(Response){


				// Reading the returned data
				//
				// The Response object will return the response's status, headers and payload and more
				//
				// Response.isError();
				// Response.get('next');
				// Response.get('data');
			})
			.GET({
				sort		: 'cdate'
			});

	})
	.error(function(Response){
		console.log('Callback "error" called, status: "' + Response.get('status') + '"');
	})
	.complete(function(Response){
		console.log('Callback "complete" called, status: "' + Response.get('status') + '"');
	});


// Arguments
//
// You can specify arguments for sorting, pagination, filters and resource attributes
//
var arguments 	= {
		username		: username,
		password		: password
	};


// Making a request
//
// Create a new token using the credential arguments
//
Endpoint.POST(arguments);