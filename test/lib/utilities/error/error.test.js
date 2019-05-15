const { expect } = require("chai");

const HandledError = require("../../../../lib/utilities/error/HandledError");
const {
  notFound,
  modelFindError,
  modelSaveError,
  modelValidationError,
  genericSqlError,
  genericError
} = require("../../../../lib/utilities/error/error");

const ERROR_CODES = require("../../../../lib/constants/errorCodes");

describe("error utility", function () {
  describe("notFound", function () {
    const message = "Test not found message";
    const anonymousError = notFound();
    const messageError = notFound(message);

    it("should return an instance of HandledError", () => {
      expect(anonymousError instanceof HandledError).to.be.true;
    });

    it("should always populdate the httpStatusCode code with 404", () => {
      expect(anonymousError.httpStatusCode).to.equal(404);
    });

    it("should use the default message when no message is provided", () => {
      expect(anonymousError.message).to.equal("Requested resource not found");
    });

    it("should use the passed message when it is provided", () => {
      expect(messageError.message).to.equal(message);
    });

    it("should use the correct error code", () => {
      expect(messageError.code).to.equal(ERROR_CODES.REQUESTED_RESOURCE_NOT_FOUND);
    });
  });

  describe("modelFindError", function () {
    const message = "Test not found message";
    const error = modelFindError(message);

    it("should return an instance of HandledError", () => {
      expect(error instanceof HandledError).to.be.true;
    });

    it("should always populdate the httpStatusCode code with 404", () => {
      expect(error.httpStatusCode).to.equal(404);
    });

    it("should use the passed message", () => {
      expect(error.message).to.equal(message);
    });


    it("should use the correct error code", () => {
      expect(error.code).to.equal(ERROR_CODES.MODEL_FIND_ERROR);
    });
  });

  describe("modelSaveError", function () {
    const message = "Test not found message";
    const error = modelSaveError(message);

    it("should return an instance of HandledError", () => {
      expect(error instanceof HandledError).to.be.true;
    });

    it("should always populdate the httpStatusCode code with 500", () => {
      expect(error.httpStatusCode).to.equal(500);
    });

    it("should use the passed message", () => {
      expect(error.message).to.equal(message);
    });


    it("should use the correct error code", () => {
      expect(error.code).to.equal(ERROR_CODES.MODEL_SAVE_ERROR);
    });
  });

  describe("modelValidationError", function () {
    const message = "Test not found message";
    const field = "test"
    const expectedMessage = `Validation Failed on ${field}. Cause: ${message}`
    const error = modelValidationError(field, message);

    it("should return an instance of HandledError", () => {
      expect(error instanceof HandledError).to.be.true;
    });

    it("should always populdate the httpStatusCode code with 400", () => {
      expect(error.httpStatusCode).to.equal(400);
    });

    it("should construct a nice message from the passed field and message", () => {
      expect(error.message).to.equal(expectedMessage);
    });


    it("should use the correct error code", () => {
      expect(error.code).to.equal(ERROR_CODES.MODEL_VALIDATION_ERROR);
    });
  });

  describe("genericSqlError", function () {
    const message = "Test not found message";
    const error = genericSqlError(message);

    it("should return an instance of HandledError", () => {
      expect(error instanceof HandledError).to.be.true;
    });

    it("should always populdate the httpStatusCode code with 500", () => {
      expect(error.httpStatusCode).to.equal(500);
    });

    it("should use the passed message", () => {
      expect(error.message).to.equal(message);
    });


    it("should use the correct error code", () => {
      expect(error.code).to.equal(ERROR_CODES.GENERIC_SQL_ERROR);
    });
  });

  describe("genericError", function () {
    const message = "Test not found message";
    const error = genericError(message);

    it("should return an instance of HandledError", () => {
      expect(error instanceof HandledError).to.be.true;
    });

    it("should always populdate the httpStatusCode code with 500", () => {
      expect(error.httpStatusCode).to.equal(500);
    });

    it("should use the passed message", () => {
      expect(error.message).to.equal(message);
    });


    it("should use the correct error code", () => {
      expect(error.code).to.equal(ERROR_CODES.GENERIC_ERROR);
    });
  });
});