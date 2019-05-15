"use strict";

const expressWinston = require( "express-winston" );
const winston = require( "winston" );

module.exports = expressWinston.errorLogger( {
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
} );