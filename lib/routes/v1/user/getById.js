"use strict";

const User = require( "../../../model/User" );

const errorUtils = require( "../../../utilities/error/error" );
const ERROR_CODES = require( "../../../constants/errorCodes" );

module.exports = async ( req, res, next ) => {
	const userId = req.params.userId;

	try {
		const user = await User.findById( userId );

		return res.status( 200 ).json( { success: true, user: user } );
	} catch ( err ) {
		if ( err.code === ERROR_CODES.REQUESTED_RESOURCE_NOT_FOUND ) {
			return next( err );
		}

		return next( errorUtils.genericError( "Error retrieving user", err ) );
	}
};