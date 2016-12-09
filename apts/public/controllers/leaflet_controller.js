
myApp.controller('LeafletController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from  apts controller");

// Detta är ett get request till urlen /contacts och serverns kommer 
// skicka tillbaka ett response
/*$http.get('/contacts').success(function(response){
	console.log("i got the data");
	$scope.contacts = response;
});*/

// L title kommer från mapbox i styles



$scope.janne = 'janne i leaflet'
console.log($scope.janne)
var mymap = L.map('mapid').setView([59.32166538, 18.06916639], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/mrliffa/ciwh1527n00c22ps5vuljnkhl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ', {
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
maxZoom: 18,
id: 'mrliffa/citses8bt00062ipelfijao0j/tiles/256',
accessToken: 'pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ'
}).addTo(mymap);




var globalData = [];
$scope.getApartmentsToPlot = function(query){
    
    query_in = "select lon,lat from apartments where date > '2016-07-01' and date < '2016-08-01'"
    reqData = {
        query: query_in//'Select date, address, sqm, floor, listprice, soldprice from apartments limit 100',
    }
    $http.get('/get_apartments', {params: reqData}).success(function(response){
        if (response.success){
            console.log(response)
            data = response.data
            // console.log(data);
            $scope.query_data = data;
            $scope.query_keys = Object.keys(data[0]);
            
            for (var i in data){
            	var circle = L.circle(L.latLng(data[i]["lat"],data[i]["lon"]), {
			    color: 'red',
			    fillColor: '#f03',
			    fillOpacity: 0.5,
			    radius: 20
				}).addTo(mymap);
            }
            globalData = data
        }
    }); 
};


$scope.myFunc = function(query){
	console.log(($scope.slider.value).getDate())

	for (var i = 0; i < parseInt(globalData[0].length*($scope.slider.value).getDate()/30); i++){
    	var circle = L.circle(L.latLng(globalData[i]["lat"],globalData[i]["lon"]), {
	    color: 'red',
	    fillColor: '#f03',
	    fillOpacity: 0.5,
	    radius: 20
		}).addTo(mymap);
    }
}





// dates for slider
var dates = [];
for (var day = 1; day <= 30; day++) {
    dates.push(new Date(2016, 7, day));
}
$scope.slider = {
  value: dates[0], // or new Date(2016, 7, 10) is you want to use different instances
  options: {
    stepsArray: dates,
    translate: function(date) {
      if (date != null)
        return date.toDateString();
      return '';
    },
    onChange: $scope.myFunc
  }
};


	// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	// 	    //working key but not for L.map:   https://api.mapbox.com/styles/v1/mrliffa/citses8bt00062ipelfijao0j/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ
	// 	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	// 	    maxZoom: 18,
	// 	    id: 'mrliffa/citses8bt00062ipelfijao0j/tiles/256',
	// 	    accessToken: 'pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ'
	// 	}).addTo(mymap);	

	// 		L.marker([51.5, -0.09]).addTo(mymap)
	// 		    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
	// 		    .openPopup();







}])