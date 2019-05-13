"use strict";

const User = require( "../../../model/User" );

const errorUtils = require( "../../../utilities/error/error" );
const ERROR_CODES = require( "../../../constants/errorCodes" );

module.exports = async ( req, res, next ) => {
	const { email, givenName, familyName } = req.body;

	try {
		const updatedUser = await User.updateById( req.params.userId, { email, givenName, familyName } );

		return res.status( 200 ).json( { success: true, user: updatedUser.userDetails } );
	} catch ( err ) {
		if ( err.code === ERROR_CODES.MODEL_VALIDATION_ERROR ) {
			return next( err );
		}

		return next( errorUtils.modelSaveError( "Error updating user", err ) );
	}
};