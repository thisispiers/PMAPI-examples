## About the Node.js PMAPI client library

Integrate with the Sign-Up.to Permission Marketing API quickly and efficiently.  More info at https://dev.sign-up.to/documentation/reference/latest/examples/client-libraries/.


## Installation

    $ npm install pmapi-client


## Example
```javascript
var pmapi				= require('pmapi-client'),
	pmapiOptions		= {
		server				: 'xxx.xxx.xx',		// Optional - the domain for PMAPI requests
		version				: 1,				// Optional - the major version of PMAPI
		debugMode			: true				// Optional - log requests for debugging
	},
	requestArguments	= {
		id					: 123,				// Optional - a resource attribute to filter by (GET)
		sort				: 'cdate'			// Optional - sort results by the 'cdate' attribute (GET)
	},
	requestOptions		= {
		// Any valid options for the 'request' npm module (https://github.com/mikeal/request)
		// Please note: some required options may be over-witten by the PMAPI client library
	},
	Auth				= new pampi.auth.Hash(123, 456, "2b2d77e014a30792d5048e262e306783"),
	Request				= new pmapi.Request(Auth, pmapiOptions);
	
 Request
 	.endpoint('list')
	.beforeSend(function(Response){
		// Do something
	})
	.success(function(Response){
		// Do something
	})
	.error(function(Response){
		// Do something
	})
	.complete(function(Response){
		// Response.get('status');
		// Response.get('headers');
		// Response.get('verb');

		if(Response.isError()){
			// Response.get('code');
			// Response.get('subcode');
			// Response.get('message');
		} else {
			// Response.get('data');
			// Response.get('count');
			// Response.get('next');
		}
	})
	.GET(requestArguments, requestOptions);
```

## Changelog

#### v0.1.2
Added support for PMPAPI with new authentication class *auth.Partner*.  This function takes arguments 'partner\_id' (required), 'user\_id' (optional), 'comapny\_id' (optional) and 'hash' (required).  It returns an Auth oject suitable for use with partner-auth and company-auth endpoints alike.

>* Added new auth type 'Partner Hash'.
>* Updated unit tests.

#### v0.1.1
Fixed minor issue where the key of an argument passed through to a request could be empty, for example: .GET({ '' : 123 }).

>* Added new "PMAPIInvalidArgumentException".
>* Updated unit tests.