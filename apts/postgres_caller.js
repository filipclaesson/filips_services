var pg = require('pg');

function runQuery(query_in, callback) {
	const conString = 'postgres://postgres:lagge@localhost/booliData'
	pg.connect(conString, function (err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err)
		}
		client.query(query_in, function (err, result) {
			done()
			if (err) {
				return console.error('error happened during query', err)
			}
			//console.log(result.rows)
			callback(result.rows)
		})
	})
}
//runQuery("Select 1 as result", function(){console.log("callback")})



module.exports = {
  runQuery: runQuery
};
