"use strict";

const mysql = require( "mysql" );

const mysqlPool = mysql.createPool( {
  connectionLimit: 5,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_SCHEMA_NAME
} );

const _beginTransaction = () => {
  return new Promise( ( resolve, reject ) => {
    mysqlPool.getConnection( ( err, connection ) => {
      if ( err ) {
        return reject( err );
      }

      connection.beginTransaction( ( err ) => {
        if ( err ) {
          return reject( err );
        }

        return resolve( connection );
      } );
    } );
  } );
};

const _commitTransaction = ( transactionConnection ) => {
  return new Promise( ( resolve, reject ) => {
    transactionConnection.commit( ( err ) => {
      if ( err ) {
        return reject( err );
      }

      return resolve();
    } );
  } );
};

const _rollbackTransaction = ( transactionConnection ) => {
  return new Promise( ( resolve, reject ) => {
    transactionConnection.rollback( ( err ) => {
      if ( err ) {
        return reject( err );
      }

      return resolve();
    } );
  } );
};

/**
 * functionToExecuteWithintransaction should be a function that takes a mysql connection
 * and performs a number of sql operations. It should return a promise so that
 * we can auto commit / rollback the transaction on resolve / reject respectively
 */
const withinTransaction = ( functionToExecuteWithintransaction ) => {
  return new Promise( ( resolve, reject ) => {
    let transactionConnection;
    _beginTransaction()
      .then( ( transaction ) => {
        transactionConnection = transaction;
        return functionToExecuteWithintransaction( transactionConnection );
      } )
      .then( ( data ) => {
        return _commitTransaction( transactionConnection )
          .then( () => {
            resolve( data );
          } )
          .finally( () => {
            transactionConnection.release();
          } );
      } )
      .catch( ( err ) => {
        return _rollbackTransaction( transactionConnection )
          .then( () => {
            return reject( err );
          } )
          .catch( ( rollbackErr ) => {
            return reject( rollbackErr );
          } )
          .finally( () => {
            transactionConnection.release();
          } );
      } );
  } );
};

module.exports = mysqlPool;
module.exports.withinTransaction = withinTransaction;

module.exports._beginTransaction = _beginTransaction;
module.exports._commitTransaction = _commitTransaction;
module.exports._rollbackTransaction = _rollbackTransaction;