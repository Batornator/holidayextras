const { expect } = require( "chai" );

const HandledError = require( "../../../../lib/utilities/error/HandledError" );

describe( "HandledError Class", function () {
	it( "should extend Error", () => {
		expect( new HandledError() instanceof Error ).to.be.true;
	} );

	it( "should set the appropriate message", () => {
		expect( new HandledError( "test message" ).message ).to.equal( "test message" );
	} );

	it( "should set the appropriate error code", () => {
		expect( new HandledError( "test message", "TEST_ERROR_CODE" ).code ).to.equal( "TEST_ERROR_CODE" );
	} );

	it( "should set the appropriate httpStatusCode", () => {
		expect( new HandledError( "test message", "TEST_ERROR_CODE", 404 ).httpStatusCode ).to.equal( 404 );
	} );

	it( "should set the original error if provided", () => {
		const origErr = new Error( "originalError" );
		expect( new HandledError( "test message", "TEST_ERROR_CODE", 404, origErr ).originalError ).to.equal( origErr );
	} );
} );
