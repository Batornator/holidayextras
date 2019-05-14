"use strict";

const db = require( "../utilities/database/mysql" );
const errorUtils = require( "../utilities/error/error" );

const User = require( "../model/User" );

class Users {

	static mapToModels( databaseResults ) {
		return databaseResults.map( User.fromDatabase );
	}

	static async findAll( page = 1, numberOfResults = 20 ) {
		return new Promise( ( resolve, reject ) => {
			const offset = ( page - 1 ) * numberOfResults;
			const findSql = "SELECT * FROM user LIMIT ? OFFSET ?";
			
			db.query( findSql, [ numberOfResults, offset ], ( err, results ) => {
				if ( err ) {
					return reject( errorUtils.genericSqlError( "Failed to retrieve Users", err ) );
				}

				return resolve( Users.mapToModels( results ) );
			} );
		} );
	}

}

module.exports = Users;