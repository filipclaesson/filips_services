
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

getApartmentsToPlot();


var plotObjects = [];


$scope.getApartmentsToPlot = function(){
    getApartmentsToPlot()
};


function getApartmentsToPlot(){
    query_in = "select lon,lat,substr(sold_date::text,0,11) as date, sold_price, sqm from apartments where sold_date > '2010-01-01' and (sold_price/nullif(sqm,0)) > 90000 and sqm between 30 and 60 and areas ilike any(array['%södermalm%','%city%','%kungsholmen%'])"
    //query_in = "select lon,lat,substr(date::text,0,11) as date, soldprice, sqm from apartments where date > '2016-01-01' and (soldprice/nullif(sqm,0)) > 100000"
    // query_in = "select lon,lat,substr(date::text,0,11) as date, soldprice, sqm from apartments where area in ('City') "
    reqData = {
        query: query_in
    }
    $http.get('/get_apartments', {params: reqData}).success(function(response){
        if (response.success){
            console.log(response)
            data = response.data

            //  Create Frontend Objects
            for (var i in data){
                var popupLabel = String(data[i]["soldprice"]/1000000) + " Mkr, " + String(data[i]["sqm"]) + " kvm";
                var circle = createCircle(L.latLng(data[i]["lat"],data[i]["lon"]), 'red', '#f03', 0.5, 20);
                circle.bindPopup(popupLabel);
                plotObjects.push(
                    {                       
                        cricle: circle,
                        date: data[i]["date"],
                        price: data[i]["soldprice"],
                        sqm: data[i]["sqm"]
                    }
                );
            }
            plot(plotObjects)
        }
    });
}
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
for (var month = 1; month <= 10; month++) {
    dates.push(new Date(2016, month, 1));
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