<?php
/**
 *  example-4.php: retrieve a tasks' statistics and any necessary bounce data.
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
 * This example illustrates how to retrieve task statistics for an email campaign.
 *
 * For the purpose of this illustration, we will retrieve the most recently created
 * email (as opposed to SMS) task and display its statistics. Any bounces associated
 * with the task will also be displayed.
 *
 * For this example to work there must be at least one completed task in the account.
 * See example-3.php.
 *
 * This example uses the following endpoints:
 * v1/task
 * v1/bounce
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

// Find the most recently created email (as opposed to SMS) task. 
$args = array(
    'channel' => 'email',
    'sort' => 'cdate',
    'reverse' => true,
    'count' => 1,
    'completed' => 1,
);

$response = $request->task->get($args);

if ($response->isError)
{
    die("Unable to retrieve task: {$response->error}\n");
}

// Use the data method to read attributes from a resource or collection
// Please note: GET requests without an id filter will return a collection
$task_id = $response->data[0]['id'];

echo "\nCampaign ($task_id) \n----------------------------------------------\n";
echo "Name:            {$response->data[0]['name']}\n";
echo "Size:            {$response->data[0]['size']}\n";
echo "Opens:           {$response->data[0]['emailuniqueopens']}\n";
echo "Clicks:          {$response->data[0]['emailuniqueclicks']}\n";
echo "Bounces:         {$response->data[0]['emailuniquebounces']}\n";
echo "Complaints:      {$response->data[0]['emailuniquecomplaints']}\n";
echo "Unsubscriptions: {$response->data[0]['emailuniqueunsubscriptions']}\n";

// If the task has bounces, get them and display them.
if ($response->data[0]['emailuniquebounces'])
{
    $response = null;
    echo "\nBounces\n----------------------------------------------\n";

    // Retrieve blocks of bounce data for this task, 100 records at a time.
    $args = array(
        'task_id' => $task_id,
        'channel' => 'email',
        'reverse' => true,
        'count' => 100,
    );

    do
    {
        $response = $request->bounce->get($args);

        if ($response->isError)
        {
            die("Unable to retrieve bounces: {$response->error}\n");
        }

        foreach ($response->data as $bounce)
        {
            printf("bounce date: %s\tsubscriber_id: %d\n", strftime('%Y-%m-%d %H:%M:%S', $bounce['cdate']), $bounce['subscriber_id']);
        }

        $args['start'] = $response->next;
    } while ($response->next);
}

