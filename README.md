# Holiday Extras Coding Test - API

## Running the API

------

To run the API you first need a `.env` file, a `.env.sample` is provided for convenience. You then have 2 options:

### Docker

* The `.env.sample` file provided will work with docker if it simply renamed to `.env`

* Docker is the simplest way to run this API. simply `docker-compose build` then `docker-compose up` and the docker container should spin up a MariaDB instance and populate it with the initial schema, followed by the node instance. All installation of dependencies etc. is handled by the building of the images.

* It's worth noting that the first time you start the docker container it will take a while to populate the database and restart. The container will log out`app listening on port 1337` when it is ready.;

### Manual installation

To run manually you will need a number of things.

* First you will need to make sure you have node.js v10.15.3 installed and then run `npm install`.

* You will also need a local or hosted MySql/MariaDB server. Once you have this configured you can run the schema file located in `db_schema/holidayextras/schema.sql` to setup the inital database.

* You will then need to populate you `.env` file with the appropriate connection values for your database connection.

* Finally you can run `npm start` to spin up the API.

## Testing

------

To test the API a convenience postman collection is provided containing a number of successul and failing requests.

There are also a number of unit tests that can be ran using `npm test`. There is no need to have a database running for this.