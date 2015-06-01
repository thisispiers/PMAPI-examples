/*
	class Auth: the class class from which auth classes are extended

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

var DATE_RFC1123 	= '%a, %d %h %Y %H:%M:%S';

module.exports = function(){
	"use strict";

	var iNonceSeed 		= null;

	this.getDate = function(){
		// MSMITH 24/06/13 - Date header needs to be in a particular locale and format!
		// The theory is that rhino v8 hard codes this stuff - so it shouldn't be a concern!

		return new Date().toUTCString();
	};

	this.getNonce 		= function(prefix){
		var crypto 			= require('crypto'),
			sha1			= crypto.createHash('sha1'),
			fnFormatSeed 	= function(seed, iWidth){
				seed = parseInt(seed, 10).toString(16);
				// Reduce length
				if(iWidth < seed.length){
					return seed.slice(seed.length - iWidth);
				}

				// Increase length
				if(iWidth > seed.length){
					while(iWidth - seed.length >0){
						seed = '0' + seed;
					}
				}

				// Just right
				return seed;
			},
			nonce;

		// Create a stored seed
		if(!iNonceSeed){
			iNonceSeed = Math.floor(Math.random() * 0x75bcd15);
		}
		iNonceSeed += 1;

		// Start with the prefix
		nonce = prefix || "";

		// Add the timestamp
		nonce += fnFormatSeed(parseInt(new Date().getTime()/1000, 10), 8);

		// Add the stored unique seed
		nonce += fnFormatSeed(iNonceSeed, 5);

		// Equivalent of "more_entropy"
		nonce += (Math.random() * 10).toFixed(8).toString();

		sha1.update(nonce);
		return sha1.digest('hex');
	};
};