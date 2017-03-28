
myApp.controller('PlotDistanceController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from  apts controller");



// L title kommer från mapbox i styles
var mymap = L.map('mapid').setView([59.29057783, 18.1094317], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/mrliffa/ciwh1527n00c22ps5vuljnkhl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ', {
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
maxZoom: 18,
id: 'mrliffa/citses8bt00062ipelfijao0j/tiles/256',
accessToken: 'pk.eyJ1IjoibXJsaWZmYSIsImEiOiJjaXRzZWk2NDYwMDFoMm5tcmdobXVwMmgzIn0.I-e4EO_ZN-gC27258NMZNQ'
}).addTo(mymap);

getApartmentsToPlotRectangle();


var plotObjects = [];


$scope.getApartmentsToPlot = function(){
    getApartmentsToPlotCircles()
};

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [4,8,12,18, 22,28, 32, 36, 40],
        // grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' &ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(mymap);


function getApartmentsToPlotCircles(){
    query_in = "with base as ( select substring(lon::text from 1 for 6) as lon, substring(lat::text from 1 for 6) as lat, avg_time_to_central::numeric as avg_time_to_central, address, sold_price, sqm from apartments ) select lon,lat, round(avg(avg_time_to_central),1) as avg_time, min(address) as address, round(avg(sold_price::numeric/sqm::numeric)/1000)*1000 as price from base group by 1,2"
    // query_in = "select lon,lat, avg_time from distance_to_central"
    //query_in = "select lon,lat,substr(date::text,0,11) as date, soldprice, sqm from apartments where date > '2016-01-01' and soldprice/nullif(sqm,0) > 100000 and sqm between 30 and 60 and area in ('Sodermalm','City', 'Kungsholmen')"
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
                var popupLabel = String(data[i]["avg_time"]) + " min, address: " + data[i].address + ", " + data[i].price + "/kvm";
                var color = getColor(data[i]["avg_time"])
                var circle = createCircle(L.latLng(data[i]["lat"],data[i]["lon"]), color, color, 0.5, 20);
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



function getApartmentsToPlotRectangle(){
    query_in = "with base as ( select substring(a.lon::text from 1 for 6) as lon, substring(a.lat::text from 1 for 6) as lat, g.avg_time_to_central::numeric as avg_time_to_central, address, sold_price, sqm from apartments a left join geo_data_sl g on (g.lon = round(a.lon::numeric,3)::text and g.lat = round(a.lat::numeric,3)::text) ) select lon,lat, round(avg(avg_time_to_central),1) as avg_time, min(address) as address, round(avg(sold_price::numeric/sqm::numeric)/1000)*1000 as price from base group by 1,2"
    // query_in = "select lon,lat, avg_time from distance_to_central"
    //query_in = "select lon,lat,substr(date::text,0,11) as date, soldprice, sqm from apartments where date > '2016-01-01' and soldprice/nullif(sqm,0) > 100000 and sqm between 30 and 60 and area in ('Sodermalm','City', 'Kungsholmen')"
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
                var popupLabel = String(data[i]["avg_time"]) + " min, address: " + data[i].address + ", " + data[i].price + "/kvm";
                var color = getColor(data[i]["avg_time"])
                var square = createSquare(data[i]["lat"],data[i]["lon"], color, color, 0.5, 20);
                square.bindPopup(popupLabel);
                plotObjects.push(
                    {                       
                        cricle: square,
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
		plotObjects[i]["cricle"].addTo(mymap);	
	}

}

function createCircle(latlng, color, fillColor, fillOpacity, radius, popupText){
	var circle =  L.Rectangle(latlng, {
	    color: color,
	    fillColor: fillColor,
	    fillOpacity: fillOpacity,
	    radius: radius
		})
	circle.bindPopup(popupText);
	return circle;
}

function createSquare(lat,lng, color, fillColor, fillOpacity, radius, popupText){
  bounds = [[lat,lng], [parseFloat(lat)+0.001, parseFloat(lng)+ 0.001]]
  var rectangle =  L.rectangle(bounds, {
      color: color,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      radius: radius,
      weight: 1
    })
  rectangle.bindPopup(popupText);
  return rectangle;
}

function getColor(minutes){
    //http://www.perbang.dk/rgbgradient/
    var cases = [
       [40, '#E50005'],
       [36, '#E02900'],
       [32, '#DC5600'],
       [28, '#D88200'],
       [24, '#D4AC00'],
       [20, '#CACF00'],
       [16, '#9CCB00'],
       [12, '#6EC700'],
       [8, '#43C300'],
       [4, '#19BF00']
    ]
    var color = '#19BF00';
    for (i in cases){
        //console.log(cases[i][0] + ' ' +minutes )
        if (parseInt(minutes) > cases[i][0]){
             //console.log("inside")
             color = cases[i][1]
             break;
        }
    }
    //console.log(color)
return color
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