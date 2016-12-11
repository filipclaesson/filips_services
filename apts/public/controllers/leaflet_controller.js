
myApp.controller('LeafletController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from  apts controller");



// L title kommer från mapbox i styles
var mymap = L.map('mapid').setView([59.32166538, 18.06916639], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/mrliffa/ciwh1527n00c22ps5vuljnkhl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ', {
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
maxZoom: 18,
id: 'mrliffa/citses8bt00062ipelfijao0j/tiles/256',
accessToken: 'pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ'
}).addTo(mymap);


var circleTest = createCircle(L.latLng([59.32166538, 18.06916639]), 'red', '#f03', 0.5, 2000);
var plotObjects = [];


$scope.getApartmentsToPlot = function(query){
    query_in = "select lon,lat,substr(date::text,0,11) as date, soldprice, sqm from apartments where date > '2016-07-01' and date < '2016-07-30' and area in ('City') "
    reqData = {
        query: query_in
    }
    $http.get('/get_apartments', {params: reqData}).success(function(response){
        if (response.success){
            console.log(response)
            data = response.data

            //create circles
            for (var i in data){
            	console.log(String(data[i]["soldprice"]))
            	plotObjects.push(
            		[
	            		createCircle(L.latLng(data[i]["lat"],data[i]["lon"]), 'red', '#f03', 0.5, 20, String(data[i]["soldprice"]/1000000) + " Mkr, " + String(data[i]["sqm"]) + " kvm" )
	            		, data[i]["date"]
	            		, data[i]["soldprice"]
	            		, data[i]["sqm"]
            		]
            	);
            }
            plot(plotObjects)
            globalData = data
        }
    });
};

function plot(circles){
	for (var i in circles){
		circles[i][0].addTo(mymap);
	}
}

$scope.remove = function(){
	for (var i in plotObjects){
		mymap.removeLayer(plotObjects[i][0]);
	}
}

$scope.updatePlot = function(){
	sliderDate = ($scope.slider.date);
	for (var i in plotObjects){
		var aptDate = new Date(plotObjects[i][1]);
		if (sliderDate.getTime() > aptDate.getTime()){
			mymap.removeLayer(plotObjects[i][0]);
		}else{
			plotObjects[i][0].addTo(mymap);
		}
		
	}
}

function createCircle(latlng, color, fillColor, fillOpacity, radius, popupText){
	var circle =  L.circle(latlng, {
	    color: color,
	    fillColor: fillColor,
	    fillOpacity: fillOpacity,
	    radius: radius
		})
	circle.bindPopup(popupText);
	return circle;
}

// dates for slider
var dates = [];
for (var day = 1; day <= 30; day++) {
    dates.push(new Date(2016, 6, day));
}
$scope.slider = {
  date: dates[0], // or new Date(2016, 7, 10) is you want to use different instances
  options: {
    stepsArray: dates,
    translate: function(date) {
      if (date != null)
        return date.toDateString();
      return '';
    },
    onChange: $scope.updatePlot
  }
};


}])