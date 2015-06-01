<?php
/**
 *  example-1.php: create a subscriber and a subscription to a list.
 *
 *    Part of the Sign-Up.to Permission Marketing API v0.1 Redistributable
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
 *  This example illustrates how to create a subscriber record and add it to a list,
 * thereby creating a subscription.
 *
 * It makes use of the following endpoints:
 * v1/subscriber
 * v1/list
 * v1/subscription
 */

require_once('apiclient/pmapirequest.class.inc');
require_once('apiclient/pmapiauthhash.class.inc');

// Insert your own company ID, user ID and API hash below 
// access credentials are available in your Sign-Up.to account,
// under the Account section ('cog'), in the 'API access' page.

define('CID', 1); // Company ID
define('UID', 1); // User ID
define('HASH', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'); // API access hash

// Create a request object based on the hash authentication method.
// Note: authentication will not occur until an API call is made using the
// PMAPIRequest object.
$request = new PMAPIRequest(new PMAPIAuthHash(UID, CID, HASH));

// Get the ID of the most recently created list.
$args = array(
    'sort' => 'cdate',
    'reverse' => true,
    'count' => 1,
);
$response = $request->list->get($args);

if ($response->isError)
{
    die("Failed to obtain a collection of lists: {$response->error}\n");
}

// Use the data method to read attributes from a resource or collection
// Please note: GET requests without an id filter will return a collection
$list_id = $response->data[0]['id'];
$list_name = $response->data[0]['name'];
$folder_id = $response->data[0]['folder_id'];

// For the purposes of this example, we'll generate a random email address.
// This will maximise the chance that a matching subscriber doesn't already exist.
$subscriber_email = 'test_' . rand() . '@example.com';

// Create the subscriber record.
$args = array(
    'email' => $subscriber_email,
    'list_id' => $list_id,
    'confirmed' => true,
);
$response = $request->subscriber->post($args);

if ($response->isError)
{
    die("Failed to create subscriber '$subscriber_email': {$response->error}\n");
}

// Use the data method to read the new id attribute.
// Please note: POST requests will return a single resource.
$subscriber_id = $response->data['id'];

// For the purposes of this example, we'll generate a random list name.
$list_name = 'test_' . rand() . '_list';

// Create the list
$args = array(
    'folder_id' => $folder_id,
    'name' => $list_name,
);
$response = $request->list->post($args);

if ($response->isError)
{
    die("Failed to create list '$list_name': {$response->error}\n");
}

// Use the data method to read the new id attribute.
$list_id = $response->data['id'];

// Add the subscriber to the list.
$response = $request->subscription->post(array(
    'subscriber_id' => $subscriber_id,
    'list_id' => $list_id,
    'confirmed' => true,
));

if ($response->isError)
{
    die("Failed to subscribe subscriber ID $subscriber_id to list $list_id: {$response->error}\n");
}

printf("Subscribed '%s' to list '%s'\n", $subscriber_email, $list_name);

