"use strict";

const HandledError = require( "./HandledError" );
const ERROR_CODES = require( "../../constants/errorCodes" );

const notFound = ( message ) => {
  return new HandledError( message || "Requested resource not found", ERROR_CODES.REQUESTED_RESOURCE_NOT_FOUND, 404 );
};

const modelFindError = ( message, err ) => {
  return new HandledError( message, ERROR_CODES.MODEL_FIND_ERROR, 404, err );
};

const modelSaveError = ( message, err ) => {
  return new HandledError( message, ERROR_CODES.MODEL_SAVE_ERROR, 500, err );
};

const modelValidationError = ( field, message ) => {
  return new HandledError( `Validation Failed on ${field}. Cause: ${message}`, ERROR_CODES.MODEL_VALIDATION_ERROR, 400 );
};

const genericSqlError = ( message, err ) => {
  return new HandledError( message, ERROR_CODES.GENERIC_SQL_ERROR, 500, err );
};

const genericError = ( message, err ) => {
  return new HandledError( message, ERROR_CODES.GENERIC_ERROR, 500, err );
};

module.exports = {
  notFound,
  modelFindError,
  modelSaveError,
  modelValidationError,
  genericSqlError,
  genericError
};