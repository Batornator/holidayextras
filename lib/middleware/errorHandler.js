"use strict";

// eslint-disable-next-line no-unused-vars
module.exports = ( err, req, res, next ) => {
	if ( err.httpStatusCode ) {
		return res.status( err.httpStatusCode ).json( { success: false, error: err.message } );
	}

	return res.status( 500 ).json( { success: false, error: "An unexpected error occured" } );
};