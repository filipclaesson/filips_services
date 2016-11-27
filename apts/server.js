var express = require("express")
var trafiklab_caller = require("../trafiklab/trafiklab_caller");
var app = express();
app.use(express.static(__dirname + "/public"))
var pg_caller = require("./postgres_caller");




app.get("/get_apartments", function (req,res) {
    var reqData = req.query;
    var query = reqData.query;

	console.log("inne i get_apartments")
	var handleResponse = function(rows){
        console.log("inside apartments handle response");
        //console.log(rows)
        //console.log(JSON.stringify(rows))
        statusCode = '0'

        
        if(statusCode != '0'){ //check if an ERRROR was returned by trafiklab
            res.json({
                success: false,
                message: "somthing went wrong :/",
                data: rows
            });
        }else{ 

            res.json({
                success: true,
                message: "Got data =)",
                data: rows
            });
        }
    } 
    pg_caller.runQuery(query, handleResponse)

	
});
	






app.get("/get_realtime_traffic", function (req, res) {
    var query = query = {
        "siteId":1595,
        "timeWindow":60
    }
    var handleResponse = function(responseData){
        console.log("inside trafiklab handle response");
        console.log(JSON.stringify(responseData))
        var statusCode = responseData.StatusCode;
        
        if(statusCode != '0'){ //check if an ERRROR was returned by trafiklab
            res.json({
                success: false,
                message: "somthing went wrong :/",
                data: responseData
            });
        }else{ 

            res.json({
                success: true,
                message: "Got data =)",
                data: responseData
            });
        }
    }   
    trafiklab_caller.getTraficlab(query,handleResponse)
});

app.listen(3000);

console.log("Apartments is running as port 3000")
