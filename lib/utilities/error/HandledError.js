"use strict";

class HandledError extends Error {
	constructor( message, errorCode, httpStatusCode, originalError ) {
		super( message );

		this.httpStatusCode = httpStatusCode;
		this.message = message;
		this.code = errorCode;

		if ( originalError ) {
			this.originalError = originalError;
		}
	}
}

module.exports = HandledError;