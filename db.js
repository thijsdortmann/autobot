// MySQL connection.
// For documentation, see https://github.com/felixge/node-mysql

var mysql = require('mysql');
var config = require('./config.js');
var db = null;
module.exports = function () {
    if(!db) {
            db = mysql.createConnection({
  				host     : config.mysql.host,
          port     : config.mysql.port,
  				database : config.mysql.database,
  				user     : config.mysql.user,
  				password : config.mysql.password
        });
            db.connect(function(err) {
  				if (err) {
    				console.error('error connecting: ' + err.stack);
    				return;
  				}
  					console.log('connected as id ' + db.threadId);
				});
    }
    return db;
};
