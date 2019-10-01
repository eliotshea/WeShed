const mysql = require('mysql');
const dbi = require('../config/db_info');

const connection = mysql.createConnection({
	host: dbi.host,
	user: dbi.user,
	password: dbi.password,
	port: dbi.port,
	database: dbi.database
});

connection.connect(function(err) {
  if (err)
    return console.error('error: ' + err.message);
  console.log('Connected to the MySQL server.');
});

//Export the handle
module.exports = connection;