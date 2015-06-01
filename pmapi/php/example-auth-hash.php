<?php
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

require_once('apiclient/pmapirequest.class.inc');
require_once('apiclient/pmapiauthhash.class.inc');


// Authentication credentials
//
// Insert your own company ID, user ID and 32-character API hash below
//
define('CID', 7654321);
define('UID', 23456789);
define('HASH', '2b2d77e014a30792d5048e262e306783');


// Create a request object based on the Hash authentication system.
// Note: authentication will not occur until an API call is made using the
// request object.
//
$request = new PMAPIRequest(new PMAPIAuthHash(UID, CID, HASH));


// Example request: retrieve details of lists in your SuT account, sorted by
// creation date.
//
// $response = $request->list->get(array('sort' => 'cdate'));

