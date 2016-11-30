
myApp.controller('TrafiklabController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from trafiklab controller");

// Detta är ett get request till urlen /contacts och serverns kommer 
// skicka tillbaka ett response
/*$http.get('/contacts').success(function(response){
	console.log("i got the data");
	$scope.contacts = response;
});*/


$scope.query_in = 'select * from apartments limit 10'



$scope.getRealtimeTraffic = function(){
	console.log('getTrafik is running');
	$http.get('/get_realtime_traffic').success(function(response){
		//error handling
		if (response.success){
			busses = response.data.ResponseData.Buses
			console.log(busses);
			$scope.trafiklab_data = busses;

			console.log(busses);
		}
	});	
};



}])