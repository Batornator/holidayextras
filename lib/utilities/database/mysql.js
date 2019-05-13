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

module.exports = mysqlPool;