<?php
/*
	example-auth-token.php

	Demonstrates the process of setting up a Permission Marketing API
	request using the Token authentication method.


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

require_once('apiclient/pmapirequest.class.inc');
require_once('apiclient/pmapiauthnone.class.inc');
require_once('apiclient/pmapiauthtoken.class.inc');


// Authentication credentials
//
// Insert the username and password of a SuT user below.  API calls will be
// made using that user's privileges.
//
define('USERNAME', 'my_api_user@example.com');
define('PASSWORD', 'my_strong_password');


// Perform an unauthenticated POST request on the /token endpoint, supplying
// the username and password (defined above) as credentials.  If the
// credentials are recognised, this endpoint will return a new token.  This
// can then be used to authenticate subsequent API calls.
//
$request = new PMAPIRequest(new PMAPIAuthNone());
$response = $request->token->post(array('username' => USERNAME,
                                        'password' => PASSWORD));

// If the token request failed, stop here.
if($response->isError)
{
	die("Failed to obtain token: {$response->error}\n");
}


// Retrieve the token string and expiry timestamp from the response.
// The token can be used to authenticate calls until it expires.
$token = $response->data['token'];
$expiry = $response->data['expiry'];


// Create a request object based on the Token authentication system.
$request = new PMAPIRequest(new PMAPIAuthToken($token));


// Example request: retrieve details of lists in your SuT account, sorted by
// creation date.
//
// $response = $request->list->get(array('sort' => 'cdate'));

