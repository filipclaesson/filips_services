// var pg = require('pg');

// function runQuery(query_in, callback) {
// 	const conString = 'postgres://postgres:lagge@localhost/booliData'
// 	pg.connect(conString, function (err, client, done) {
// 		if (err) {
// 			return console.error('error fetching client from pool', err)
// 		}
// 		client.query(query_in, function (err, result) {
// 			done()
// 			if (err) {
// 				return console.error('error happened during query', err)
// 			}
// 			//console.log(result.rows)
// 			callback(result.rows)
// 		})
// 	})
// }
// //runQuery("Select 1 as result", function(){console.log("callback")})

var pgp = require('pg-promise')();
var cn = {
    host: 'localhost',
    port: 5432,
    database: 'booliData',
    user: 'postgres',
    password: 'lagge'
};

function runQuery(query, callback) {
	var db = pgp(cn);
	db.any(query, [true])
    .then(function (data) {
        callback(data)
    })
    .catch(function (error) {
        // error;
    });
}
console.log(runQuery());



module.exports = {
  runQuery: runQuery
};
