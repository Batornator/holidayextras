"use strict";

const Users = require( "../../../store/Users" );

const errorUtils = require( "../../../utilities/error/error" );

module.exports = async ( req, res, next ) => {
  let { page, resultsPerPage } = req.query;

  page = page ? parseInt( page, 10 ) : null;
  resultsPerPage = resultsPerPage ? parseInt( resultsPerPage, 10 ) : null;

  if ( isNaN( page ) ) {
    page = null;
  }

  if ( isNaN( resultsPerPage ) ) {
    resultsPerPage = null;
  }

  try {
    const users = await Users.findAll( page, resultsPerPage );
    const totalResults = await Users.count();

    return res.status( 200 ).json( { success: true, users: users, totalResults: totalResults } );
  } catch ( err ) {
    return next( errorUtils.genericError( "Error retrieving users", err ) );
  }
};