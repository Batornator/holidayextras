"use strict";

const expressWinston = require( "express-winston" );
const winston = require( "winston" );

module.exports = expressWinston.logger( {
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  logLevel: process.env.LOG_LEVEL || "error"
} );