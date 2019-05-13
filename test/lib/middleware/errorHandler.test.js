const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { mockRes } = require("sinon-express-mock");
const expect = chai.expect;
chai.use(sinonChai);

const HandledError = require("../../../lib/utilities/error/HandledError");
const errorHandler = require("../../../lib/middleware/errorHandler");

describe("errorHandler middleware", function () {

	const getFakeRes = () => {
		const res = {};
		const jsonFake = sinon.fake.returns(res);
		const statusFake = sinon.fake.returns(res);
		res.status = statusFake;
		res.json = jsonFake;

		return res;
	};

	it("should call res.status with 500 if a non HandledError is provided", () => {
		const res = getFakeRes();
		errorHandler(new Error(), null, res, null);

		expect(res.status).calledOnceWithExactly(500);
	});

	it("should call res.json with an unexpected error if a non HandledError is provided", () => {
		const res = getFakeRes();
		errorHandler(new Error(), null, res, null);

		expect(res.json).calledOnceWith({ success: false, error: "An unexpected error occured" });
	});

	it("should use the status code from the error if it has one", () => {
		const res = getFakeRes();
		const err = new HandledError("test error message", "TEST_CODE", 404);
		errorHandler(err, null, res, null);

		expect(res.status).calledOnceWithExactly(404);
	});


	it("should call res.json with the Errors message if a statusCode is present on the error", () => {
		const res = getFakeRes();
		const err = new HandledError("test error message", "TEST_CODE", 404);

		errorHandler(err, null, res, null);

		expect(res.json).calledOnceWith({ success: false, error: "test error message" });
	});

});