
myApp.controller('TrafiklabDistanceController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from trafiklab controller");




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