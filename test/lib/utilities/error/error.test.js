const { expect } = require( "chai" );

const HandledError = require( "../../../../lib/utilities/error/HandledError" );
const { notFound } = require( "../../../../lib/utilities/error/error" );

describe( "error utility", function () {
	describe( "notFound", function () {

		const message = "Test not found message";
		const anonymousError = notFound();
		const messageError = notFound( message );

		it( "should return an instance of HandledError", () => {
			expect( anonymousError instanceof HandledError ).to.be.true;
		} );

		it( "should always populdate the httpStatusCode code with 404", () => {
			expect( anonymousError.httpStatusCode ).to.equal( 404 );
		} );

		it( "should use the default message when no message is provided", () => {
			expect( anonymousError.message ).to.equal( "Requested resource not found" );
		} );

		it( "should use the passed message when it is provided", () => {
			expect( messageError.message ).to.equal( message );
		} );
	} );
} );