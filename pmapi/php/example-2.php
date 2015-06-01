<?php
/**
 *  example-2.php: update subscriber profile field data 
 * 
 *	Part of the Sign-Up.to Permission Marketing API v0.1 Redistributable
 *
 *
 *  Copyright (c) 2013 Sign-Up Technologies Ltd.
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *  2. Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 *  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/**
 * This example illustrates how to update a subscriber profile field for a specific subscriber. 
 *
 * A subscriber profile field can be used to hold custom data for each subscriber record.
 * 
 * For the purpose of this illustration we've used a subscriber profile field to record 
 * the time and date when a subscriber last visited a website. The name of the field is
 * defined in the constant COLUMN_HEADER. 
 * 
 * In order to provide a working example, this script will create this subscriber
 * profile field if it does not exists. This is for illustration only, an integrator would
 * not normally carry out this check before every request, as it introduces some additional
 * overhead.
 *
 * This example uses the following endpoints:
 * v1/subscriber
 * v1/subscriberProfileField
 * v1/subscriberProfileData
 */

require_once('apiclient/pmapirequest.class.inc');
require_once('apiclient/pmapiauthhash.class.inc');

// Insert your own company ID, user ID and API hash below 
//	access credentials are available in your Sign-Up.to account,
//	under the Account section ('cog'), in the 'API access' page.

define('CID', 1); // Company ID
define('UID', 1); // User ID
define('HASH', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'); // API access hash

// Create a request object based on the hash authentication method.
// Note: authentication will not occur until an API call is made using the
// PMAPIRequest object.
$request = new PMAPIRequest(new PMAPIAuthHash(UID, CID, HASH));

// Find the most recently created subscriber record.
$args = array(
    'sort' => 'cdate',
    'reverse' => true,
    'count' => 1,
);
$response = $request->subscriber->get($args);

if($response->isError)
{
	die("Unable to retrieve subscriber: {$response->error}\n");
}

// Use the data method to read attributes from a resource or collection
// Please note: GET requests without an id filter will return a collection
$subscriber_id    = $response->data[0]['id'];
$subscriber_email = $response->data[0]['email'];

printf("subscriber found: %s (id:%u)\n", $subscriber_email, $subscriber_id);

define('COLUMN_HEADER', 'last_visit');

// Look up the subscriberProfileField ID for the 'last_visit' columnheader.
$args = array(
    'columnheader' => COLUMN_HEADER,
);
$response = $request->subscriberProfileField->get($args);

if($response->isError)
{
	// We're either here because the "last_visit" subscriber profile field 
	// doesn't exist or we encountered another error.
	// The API returns a 404 "Not Found" status if a resource doesn't exist.
	// In this case we'll attempt to create the field, in all other cases
	// we're unable to deal with this error, so die.
	if($response->status != 404)
	{
		die("unable to find profile field: {$response->error}\n");
	}

	// The subscriber profile field doesn't exist, so attempt to create it.
    $args = array(
        'columnheader' => COLUMN_HEADER,
        'name' => 'Last visited',
    );
    $response = $request->subscriberProfileField->post($args);

	if($response->isError)
	{
		die("unable to POST subscriber profile field: {$response->error}\n");
	}

	$profilefield_id = $response->data['id'];
} else {
	$profilefield_id = $response->data[0]['id'];
}

printf("profile field: %s (id:%u)\n", $response->data[0]['columnheader'], $response->data[0]['id']);

// Store some data in the profile field against our subscriber.
$args = array(
    'subscriber_id' => $subscriber_id,
    'subscriberprofilefield_id' => $profilefield_id,
    'value' => date('Y-m-d H:i:s'),
);
$response = $request->subscriberProfileData->put($args);

if($response->isError)
{
	die("unable to PUT subscriber profile field: {$response->error}\n");
}

printf("set profile '%s' (id:%u); value: '%s'\n", COLUMN_HEADER, $response->data[0]['id'], $args['value']);

$args = array(
    'subscriber_id' => $subscriber_id,
);
// Retrieve all profile data for this subscriber.
$response = $request->subscriberProfileData->get($args);

if($response->isError)
{
	die("unable to GET profile data: {$response->error}\n");
}

printf("subscriber profile fields for '%s' (id:%u)\n", $subscriber_email, $subscriber_id);

foreach($response->data as $profile)
{
	printf("id:%u; value: '%s'\n", $profile['subscriberprofilefield_id'], $profile['value']);
}

