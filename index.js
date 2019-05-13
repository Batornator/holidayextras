"use strict";

const express = require( "express" );

const { cors, logger, catchall, errorLogger, errorHandler } = require( "./lib/middleware" );

require( "dotenv" ).config();

const port = process.env.PORT || 1337;

const app = express();
app.use( express.json() );

// Middleware
app.use( cors );
app.use( logger );

//routing
app.use( require( "./lib/routes" ) );

// catch all unmatched routes and 404
app.use( catchall );

// Error middleware
app.use( errorLogger );
app.use( errorHandler );


app.listen( port, () => {
	// eslint-disable-next-line no-console
	console.log( `app listening on port ${port}` );
} );
