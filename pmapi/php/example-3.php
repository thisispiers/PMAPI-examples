<?php
/**
 * example-3.php: create an example email and schedule an email task to a list.
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
 * This example illustrates how to create an example email message in an account and how to
 * schedule a task to send the message to a list of subscribers.
 *
 * For the purpose of this illustration, we will retrieve all list metadata in order to find
 * a list containing at least one subscriber in order to schedule the task.
 *
 * This example uses the following endpoints:
 * v1/emailMessage
 * v1/list
 * v1/task
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

// Prepare a new message to be created in the account.
// Note: 'fromemail' must match a pre-configured email address in your account on the Sign-Up.to platform
$args = array(
    'text' => 'Hello, this is an example plain text email. Goodbye.',
    'subject' => 'Example Subject',
    'fromemail' => 'johnsmith@example.com',
    'fromname' => 'Mr John Smith',
    'name' => 'Example Campaign Name',
    'replyemail' => 'noreply@example.com',
);

$args['html'] = <<<HTML
<html>
<head>
<title>Lorem Ipsum</title>
</head>
<body>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas enim erat, tempor sed consequat id, adipiscing sed augue. Maecenas in ante nec arcu elementum ultrices. Morbi ultricies consectetur risus ac aliquam. In gravida, turpis nec tristique varius, elit justo cursus enim, vitae sodales dui tortor sed purus. Praesent luctus rutrum ipsum sed porta. Sed sit amet luctus dolor, vitae pharetra tellus. Pellentesque nec dui ultrices, venenatis quam a, tristique ipsum. Vivamus cursus nec magna volutpat tempor. Sed commodo tempor ornare. Nullam metus libero, consequat ac lacus non, pellentesque blandit purus. Aliquam lacinia nibh a libero vulputate sagittis. Fusce sem nulla, gravida luctus eros eget, fringilla venenatis magna.</p>
<br />
<a href="http://www.example.com">Example</a>
</body>
</html>
HTML;

$response = $request->emailmessage->post($args);

if ($response->isError)
{
    die("error: {$response->error}");
}

// Use the data method to read the new id attribute.
// Please note: POST requests will return a single resource.
$message_id = $response->data['id'];

// Retrieve all lists in order to find a test list that contains
// at least one subscription.
$response = $request->list->get();

if ($response->isError)
{
    die("error: {$response->error}");
}

// Please note: GET requests without an id filter will return a collection
if (!count($response->data))
{
    die("error: no lists");
}

$list_id = 0;

// The task endpoint requires a non-empty list.
// Iterate over the returned lists to display them in tabular form, at the
// same time, locate the id of the first non-empty list.
foreach ($response->data as $list)
{
    if ($list['subscription_count'] && !$list_id)
    {
        $list_id = $list['id'];
    }

    printf("%s %9d   %19s   %6d   %s %s\n",
        ($list_id == $list['id'] ? ">" : " "),
        $list['id'],
        strftime('%Y-%m-%d %H:%M:%S', $list['cdate']),
        $list['subscription_count'],
        $list['name'],
        ($list_id == $list['id'] ? "<" : " "));
}

if (!$list_id)
{
    die("error: unable to find a list with subscribers");
}

// Using the created message and the list schedule a task
$args = array(
    'channel' => 'email',
    'name' => 'example task',
    'message_id' => $message_id,
    'list_id' => $list_id,
    'scheduledtime' => time() + (7 * 24 * 60 * 60), // in 7 days.
);

$response = $request->task->post($args);

if ($response->isError)
{
    die("task error: {$response->error}");
}

printf("scheduled '%s' (id: %d) @ %s to list_id %d targeting %d recipient(s)\n",
    $response->data['name'],
    $response->data['id'],
    strftime('%Y-%m-%d %H:%M:%S', $response->data['scheduledtime']),
    $response->data['list_id'],
    $response->data['size']
);

