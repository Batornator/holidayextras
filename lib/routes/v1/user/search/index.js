"use strict";

const getByEmail = require( "./getByEmail" );

const errorUtils = require( "../../../../utilities/error/error" );

module.exports = ( req, res, next ) => {
  if ( req.query.email ) {
    return getByEmail( req, res, next );
  }

  return next( errorUtils.notFound() );
};