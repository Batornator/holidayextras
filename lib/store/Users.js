"use strict";

const db = require( "../utilities/database/mysql" );
const errorUtils = require( "../utilities/error/error" );

const User = require( "../model/User" );

class Users {

  static getPagingParams( page, numberOfResults ) {
    page = page || 1;
    numberOfResults = numberOfResults || 20;
    const offset = ( page - 1 ) * numberOfResults;

    return { numberOfResults, offset };
  }

  static mapToModels( databaseResults ) {
    return databaseResults.map( User.fromDatabase );
  }

  static async findAll( page = 1, numberOfResults = 20 ) {
    return new Promise( ( resolve, reject ) => {
      const paging = Users.getPagingParams( page, numberOfResults );
      const findSql = "SELECT * FROM user LIMIT ? OFFSET ?";

      db.query( findSql, [ paging.numberOfResults, paging.offset ], ( err, results ) => {
        if ( err ) {
          return reject( errorUtils.genericSqlError( "Failed to retrieve Users", err ) );
        }

        return resolve( Users.mapToModels( results ) );
      } );
    } );
  }

  static async findByEmail( emailAddress, page = 1, numberOfResults = 20 ) {
    return new Promise( ( resolve, reject ) => {
      const paging = Users.getPagingParams( page, numberOfResults );
      const findSql = "SELECT * FROM user WHERE email = ? LIMIT ? OFFSET ?";

      db.query( findSql, [ emailAddress, paging.numberOfResults, paging.offset ], ( err, results ) => {
        if ( err ) {
          return reject( errorUtils.genericSqlError( "Failed to retrieve Users", err ) );
        }

        return resolve( Users.mapToModels( results ) );
      } );
    } );
  }

  static async count() {
    return new Promise( ( resolve, reject ) => {
      const findSql = "SELECT COUNT(*) AS totalResults FROM user";

      db.query( findSql, ( err, results ) => {
        if ( err ) {
          return reject( errorUtils.genericSqlError( "Failed to count Users", err ) );
        }

        if ( !results || !results.length ) {
          return reject( errorUtils.genericSqlError( "Failed to count Users" ) );
        }

        return resolve( results[0].totalResults );
      } );
    } );
  }

  static async countByEmail( emailAddress ) {
    return new Promise( ( resolve, reject ) => {
      const findSql = "SELECT COUNT(*) AS totalResults FROM user WHERE email = ?";

      db.query( findSql, [ emailAddress ], ( err, results ) => {
        if ( err ) {
          return reject( errorUtils.genericSqlError( "Failed to count Users", err ) );
        }

        if ( !results || !results.length ) {
          return reject( errorUtils.genericSqlError( "Failed to count Users" ) );
        }

        return resolve( results[0].totalResults );
      } );
    } );
  }

}

module.exports = Users;