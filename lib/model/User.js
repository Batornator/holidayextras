"use strict";

const errorUtils = require( "../utilities/error/error" );

const db = require( "../utilities/database/mysql" );

// Only use a simple check, assume for a real scenario a confirmation email could be sent.
const simpleEmailRegex = /^\S+@{1}\S+$/;

class User {

	constructor( user ) {
		if ( !user ) {
			return;
		}
		// Allow the database to populate the id and created
		this.id = user.id || null;
		this.email = user.email;
		this.givenName = user.givenName;
		this.familyName = user.familyName;
		if ( user.created ) {
			this.created = user.created instanceof Date ? user.created : new Date( user.created );
		} else {
			this.created = null;
		}
	}

	get userDetails() {
		const { id, email, givenName, familyName, created } = this;
		const details = {
			email,
			givenName,
			familyName
		};

		details.id = id || null;
		details.created = created || null;

		return details;
	}

	static fromDatabase( record ) {
		return new User( {
			id: record.id,
			email: record.email,
			givenName: record.given_name,
			familyName: record.family_name,
			created: record.created_at
		} );
	}

	static validateUpdate( updates ) {
		const isDefined = ( value ) => {
			return value !== undefined && value !== null;
		};

		if ( isDefined( updates.email ) && !simpleEmailRegex.test( updates.email ) ) {
			return errorUtils.modelValidationError( "email", "Email Address is not valid" );
		}

		if ( isDefined( updates.givenName ) && !updates.givenName.length ) {
			return errorUtils.modelValidationError( "givenName", "Given Name is a required field" );
		}

		if ( isDefined( updates.familyName ) && !updates.familyName.length ) {
			return errorUtils.modelValidationError( "familyName", "Family Name is a required field" );
		}

		return null;
	}

	validate() {

		if ( !simpleEmailRegex.test( this.email ) ) {
			return errorUtils.modelValidationError( "email", "Email Address is not valid" );
		}

		if ( !this.givenName || !this.givenName.length ) {
			return errorUtils.modelValidationError( "givenName", "Given Name is a required field" );
		}

		if ( !this.familyName || !this.familyName.length ) {
			return errorUtils.modelValidationError( "familyName", "Family Name is a required field" );
		}

		return null;
	}

	async save() {
		return new Promise( ( resolve, reject ) => {
			const error = this.validate();

			if ( error ) {
				return reject( error );
			}

			const createSql = "INSERT INTO user (email, given_name, family_name) VALUES (?, ?, ?)";
			const createValues = [ this.email, this.givenName, this.familyName ];

			db.query( createSql, createValues, ( err, result ) => {
				if ( err ) {
					return reject( errorUtils.modelSaveError( "Failed to save User", err ) );
				}

				User.findById( result.insertId ).then( resolve ).catch( reject );
			} );
		} );
	}

	static async findById( id ) {
		return new Promise( ( resolve, reject ) => {
			const findSql = "SELECT * FROM user WHERE id = ?";

			db.query( findSql, [ id ], ( err, result ) => {
				if ( err ) {
					return reject( errorUtils.genericSqlError( "Failed to retrieve User", err ) );
				}

				if ( !result || !result.length ) {
					return reject( errorUtils.notFound( "User not found" ) );
				}

				return resolve( User.fromDatabase( result[0] ) );
			} );
		} );
	}

	static async deleteById( id ) {
		return new Promise( ( resolve, reject ) => {
			const deleteSql = "DELETE FROM user WHERE id = ?";

			db.query( deleteSql, [ id ], ( err, result ) => {
				if ( err ) {
					return reject( errorUtils.genericSqlError( "Failed to delete User", err ) );
				}

				if ( !result || !result.affectedRows ) {
					return reject( errorUtils.notFound( "Unable to delete User. User id does not exist" ) );
				}

				return resolve( { id } );
			} );
		} );
	}

	static async updateById( id, updates ) {
		return new Promise( ( resolve, reject ) => {
			const validationError = User.validateUpdate( updates );

			if ( validationError ) {
				return reject( validationError );
			}

			const updateSql = "UPDATE user SET ? WHERE id = ?";
			let mappedUpdates = {};

			if ( updates.email ) {
				mappedUpdates.email = updates.email;
			}

			if ( updates.givenName ) {
				mappedUpdates.given_name = updates.givenName;
			}

			if ( updates.familyName ) {
				mappedUpdates.family_name = updates.familyName;
			}

			db.query( updateSql, [ mappedUpdates, id ], ( err, result ) => {
				if ( err ) {
					return reject( errorUtils.genericSqlError( "Failed to update User", err ) );
				}

				if ( !result || !result.affectedRows ) {
					return reject( errorUtils.notFound( "Unable to update User. User id does not exist" ) );
				}

				User.findById( id ).then( resolve ).catch( reject );
			} );
		} );
	}
}
module.exports = User;