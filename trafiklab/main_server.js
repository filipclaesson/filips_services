var express = require("express")
var trafiklab_caller = require("./trafiklab_caller");
var app = express();
app.use(express.static(__dirname + "/public"))

// url for getting "sweden.zip" 50 MB 
// https://api.resrobot.se/gtfs/sweden.zip?key=a270b10e-17f4-4f55-b71c-756140a5f0de

// -- replace commas in trips.txt --
// find: ("[^",]+),([^"]*")
// replace: $1$2

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

console.log("Running as port 3000")
