"use strict";

const catchall = require( "./catchall" );
const cors = require( "./cors" );
const errorHandler = require( "./errorHandler" );
const errorLogger = require( "./errorLogger" );
const logger = require( "./logger" );

module.exports = {
  catchall,
  cors,
  errorHandler,
  errorLogger,
  logger,
};