window.onload = function () {   
var mapLayer = MQ.mapLayer(), geolocationMap;
console.log(mapLayer);

geolocationMap = L.map('map-view', {
  layers: mapLayer,
  center: [40.731701, -73.993411],
  zoom: 12
});

//adds different view options, such as street map, satellite image or hybrid of both
L.control.layers({
  'Map': mapLayer,
  'Hybrid': MQ.hybridLayer(),
  'Satellite': MQ.satelliteLayer(),
}).addTo(geolocationMap); 

// centers map on the users lat/lng location
/* var geolocationMap = L.map('map-view', {
  layers: MQ.mapLayer(),
  center: [40.731701, -73.993411],
  zoom: 12
}); */

var popup = L.popup();
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
      var latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      };

      popup.setLatLng(latLng);
      popup.setContent('This is your current location');
      popup.openOn(geolocationMap);

      geolocationMap.setView(latLng);
  }, function () {
      geolocationErrorOccurred(true, popup,(geolocationMap.getCenter()));
  });
} else {
  //No browser support geolocation service
  geolocationErrorOccurred(false, popup,(geolocationMap.getCenter()));
}

function geolocationErrorOccurred(geolocationSupported, popup, latLng) {
  popup.setLatLng(latLng);
  popup.setContent(geolocationSupported ?
          '<b>Error:</b> The Geolocation service failed.' :
          '<b>Error:</b> This browser doesn\'t support geolocation.');
  popup.openOn(geolocationMap);
}
};
/*     var geoCode = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.Control.geocoder().addTo(map); */

//var mapBoxKey = pk.eyJ1IjoiYmx1ZXNldHRlIiwiYSI6ImNqamJxM2d2bTN2YTgzdmxmc21pbXRicXkifQ.yP4IXq4wRDkPf32s15Ssiw;

