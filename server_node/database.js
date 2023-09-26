const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
  host: 'mysqldb',
  port: 3306,
  user: 'root',
  password: 'secret',
  database: 'SOPES_P1',
});

mysqlConnection.connect(function (err) {
  if (err) {
    console.log("ERROR cuchau: ", err.message);
    return;
  } else {
    console.log('Db is connected');
  }
});

module.exports = mysqlConnection;
