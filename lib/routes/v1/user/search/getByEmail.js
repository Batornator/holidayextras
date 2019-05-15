"use strict";

const Users = require( "../../../../store/Users" );

const errorUtils = require( "../../../../utilities/error/error" );

module.exports = async ( req, res, next ) => {
  let { email, page, resultsPerPage } = req.query;

  if ( !email ) {
    return next( errorUtils.genericError( "Email is a required parameter" ) );
  }

  page = page ? parseInt( page, 10 ) : null;
  resultsPerPage = resultsPerPage ? parseInt( resultsPerPage, 10 ) : null;

  if ( isNaN( page ) ) {
    page = null;
  }

  if ( isNaN( resultsPerPage ) ) {
    resultsPerPage = null;
  }

  try {
    const users = await Users.findByEmail( email, page, resultsPerPage );

    return res.status( 200 ).json( { success: true, users: users } );
  } catch ( err ) {
    return next( errorUtils.genericError( "Error retrieving users", err ) );
  }
};