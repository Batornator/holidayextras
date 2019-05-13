"use strict";

const express = require( "express" );
const router = express.Router();

router.post( "/", require( "./post" ) );

router.get( "/:userId", require( "./getById" ) );
router.get( "/", require( "./get" ) );

router.put( "/:userId", require( "./put" ) );

router.delete( "/:userId", require( "./delete" ) );

module.exports = router;