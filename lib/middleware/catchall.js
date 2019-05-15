"use strcit";

const errorUtils = require( "../utilities/error/error" );

module.exports = ( req, res, next ) => {
  next( errorUtils.notFound() );
};