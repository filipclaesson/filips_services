
myApp.controller('HeatmapController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from heatmap controller");

var testData = {
  max: 8,
  data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1}]
};


var baseLayer = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mrliffa/ciwh1527n00c22ps5vuljnkhl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ'
    ,{
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mrliffa/citses8bt00062ipelfijao0j/tiles/256',
        accessToken: 'pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ'
    }
);

var cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 0.01,
  "maxOpacity": .8, 
  // scales the radius based on map zoom
  "scaleRadius": true, 
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries 
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": false,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
};

var heatmapLayer = new HeatmapOverlay(cfg);


var mymap = new L.Map('mapid', {
  center: new L.LatLng(59.32166538, 18.06916639),
  zoom: 10,
  layers: [baseLayer, heatmapLayer]
});



var plotObjects = [];


$scope.getApartmentsToPlot = function(query){
    query_in = "select lon,lat,substr(date::text,0,11) as date, soldprice, sqm from apartments where date > '2016-01-01' and (soldprice/nullif(sqm,0)) > 100000"
    // query_in = "select lon,lat,substr(date::text,0,11) as date, soldprice, sqm from apartments where area in ('City') "
    reqData = {
        query: query_in
    }
    $http.get('/get_apartments', {params: reqData}).success(function(response){
        if (response.success){
            console.log(response)
            data = response.data

            // 	Create Frontend Objects
            for (var i in data){
            	//var popupLabel = String(data[i]["soldprice"]/1000000) + " Mkr, " + String(data[i]["sqm"]) + " kvm";
            	//var circle = createCircle(,), 'red', '#f03', 0.5, 20);
            	//circle.bindPopup(popupLabel);
            	plotObjects.push(
            		{           			
            			lat: data[i]["lat"],
	            		lng: data[i]["lon"],
	            		count: 1
            		}
            	);
            }
            console.log(plotObjects)
            var testData = {
                max: 8,
                data: plotObjects
            };
            
            heatmapLayer.setData(testData);
        }
    });
};

function plot(circles){
	for (var i in circles){
		circles[i]["cricle"].addTo(mymap);
	}
}

$scope.updatePlot = function(){
	sliderDate = ($scope.slider.date);
	for (var i in plotObjects){
		var aptDate = new Date(plotObjects[i]["date"]);
		if (sliderDate.getTime() > aptDate.getTime()){
			mymap.removeLayer(plotObjects[i]["cricle"]);
		}else{
			plotObjects[i]["cricle"].addTo(mymap);
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