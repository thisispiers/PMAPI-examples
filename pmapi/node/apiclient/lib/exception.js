/*
	classes derived from PMAPIException: all exception classes fron the PMAPI.

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

var PMAPIException									= function(){
		"use strict";

		this.stack = (new Error()).stack;
	};

module.exports.PMAPIRuntimeEnvironmentException		= function(message){
	"use strict";

	function Exception(message){
		this.name = "PMAPIRuntimeEnvironmentException";
		this.message = message;
	}

	Exception.prototype = new PMAPIException();
	return new Exception(message);
};
module.exports.PMAPICURLException						= function(message){
	"use strict";

	function Exception(message){
		this.name = "PMAPICURLException";
		this.message = message;
	}

	Exception.prototype = new PMAPIException();
	return new Exception(message);
};
module.exports.PMAPIInvalidResponseException			= function(message){
	"use strict";

	function Exception(message){
		this.name = "PMAPIInvalidResponseException";
		this.message = 'Invalid server response: "' + message + '"';
	}

	Exception.prototype = new PMAPIException();
	return new Exception(message);
};
module.exports.PMAPIUnsupportedMethodException 		= function(message){
	"use strict";

	function Exception(message){
		this.name = "PMAPIUnsupportedMethodException";
		this.message = 'Unsupported method: "' + message + '"';
	}

	Exception.prototype = new PMAPIException();
	return new Exception(message);
};
module.exports.PMAPIInvalidValueException				= function(field, value){
	"use strict";

	function Exception(field, value){
		this.name = "PMAPIInvalidValueException";
		this.message = 'Invalid field "' + field + '" and value "' + value + '"';
	}

	Exception.prototype = new PMAPIException();
	return new Exception(field, value);
};
module.exports.PMAPIInvalidArgumentException			= function(field, value){
	"use strict";

	function Exception(field, value){
		this.name = "PMAPIInvalidArgumentException";
		this.message = 'Invalid argument "' + field + '" and value "' + value + '"';
	}

	Exception.prototype = new PMAPIException();
	return new Exception(field, value);
};
module.exports.PMAPIInvalidCallbackException			= function(callback){
	"use strict";

	function Exception(callback){
		this.name = "PMAPIInvalidCallbackException";
		this.message = 'No such callback "' + callback + '"';
	}

	Exception.prototype = new PMAPIException();
	return new Exception(callback);
};
module.exports.PMAPINoSuchFieldException				= function(message){
	"use strict";

	function Exception(message){
		this.name = "PMAPINoSuchFieldException";
		this.message = 'No such field "' + message + '"';
	}

	Exception.prototype = new PMAPIException();
	return new Exception(message);
};