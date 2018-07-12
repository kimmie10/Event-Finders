
var cityLongitude = 0;
var cityLatitude = 0;
var event1_Longitude = 0;
var event1_Latitude = 0;
var event2_Longitude = 0;
var event2_Latitude = 0;
var event3_Longitude = 0;
var event3_Latitude = 0;
var venue1_Name = "";
var venue2_Name = "";
var venue3_Name = "";

var globalMapLayer = MQ.mapLayer();
    var map = L.map('map-view', {
        layers: globalMapLayer,
        center: [cityLongitude, cityLatitude],
        zoom: 12
    });

function pinEvents(results) {
       // pinning events to map
        venue1_Name = results.events[0].venue.name;
        venue2_Name = results.events[1].venue.name;
        venue3_Name = results.events[2].venue.name;
        console.log("venue3_Name: " +venue3_Name);
        event1_Longitude = results.events[0].venue.longitude;
        event1_Latitude = results.events[0].venue.latitude;
        console.log("event1_Longitude: " +event1_Longitude);
        console.log("event1_Latitude: " + event1_Latitude);
        event2_Longitude = results.events[1].venue.longitude;
        event2_Latitude = results.events[1].venue.latitude;
        console.log("event2_Longitude: " +event2_Longitude);
        console.log("event2_Latitude: " + event2_Latitude);
        event3_Longitude = results.events[2].venue.longitude;
        event3_Latitude = results.events[2].venue.latitude;
        console.log("event3_Longitude: " +event3_Longitude);
        console.log("event3_Latitude: " + event3_Latitude);
        L.marker([event1_Latitude, event1_Longitude]).addTo(map).bindPopup(venue1_Name);
        L.marker([event2_Latitude, event2_Longitude]).addTo(map).bindPopup(venue2_Name);
        L.marker([event3_Latitude, event3_Longitude]).addTo(map).bindPopup(venue3_Name);
}

// Weather API function
function weather() {
    let APIKey = "6bf5141aa280ab7faa386b3fe5d1454f";
    let cityWeather = $("#city-input").val().trim();
    //console.log(cityWeather);

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityWeather + "&type=accurate&units=imperial&APPID=" + APIKey;

    // Ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        $("#city").html("<h3>" + response.name + "</h3>");
        $("#lowTemp").text("Low (F) " + response.main.temp_min);
        $("#highTemp").text("High (F)" + response.main.temp_max);
        $("#wind").text("Wind Speed: " + response.wind.speed);
        $("#humidity").text("Humidity: " + response.main.humidity);
        $("#weather").text(response.weather[0].description.toUpperCase());
        cityLongitude = response.coord.lon;
        console.log("longitude: " + cityLongitude);
        cityLatitude = response.coord.lat;
        console.log("latitude: " + cityLatitude);
        map.panTo(new L.LatLng(cityLatitude, cityLongitude));
        //var cityMarker = L.marker([cityLatitude, cityLongitude]).addTo(map);
        
    })
}
// EventBrite API
function eventBriteInfo() {

    // Use location var with $("#city-input") submission
    var location = $("#city-input").val().trim();
    var queryURL = "https://www.eventbriteapi.com/v3/events/search/?expand=venue&token=SZDJEP44NSPTC2RGIFBQ&location.address=" + location;

    // AJAX Call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var results = response;
        console.log(results);
        console.log(results.events);
        console.log(results.events[0]);
        console.log(results.events[0].logo.url);
        pinEvents(results);

        
        var header = $("<h1>")
        header.text("Local Events");

        for (var j = 0; j < 3; j++) {
            var eventDiv = $("<div>");

            var imgURL = results.events[j].logo.url;
            var description = results.events[j].description.text

            var image = $("<img>");
            image.attr("src", imgURL);

            var details = $("<p>");
            details.text(description)

            eventDiv.append(header);
            eventDiv.append(image);
            eventDiv.append(details);
            $("#events-view").prepend(eventDiv);
        }
    });
}


//adds different view options, such as street map, satellite image or hybrid of both
function loadMap() {
    //centers map to user position and pop's up there
    var baseMaps = {
        'Map': globalMapLayer,
        'Hybrid': MQ.hybridLayer(),
        'Satellite': MQ.satelliteLayer()
    };
    L.control.layers(baseMaps).addTo(map);
    var popup = L.popup();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            popup.setLatLng(latLng);
            popup.setContent('This is your current location');
            popup.openOn(map);

            map.setView(latLng);
        }, function () {
            geolocationErrorOccurred(true, popup, (map.getCenter()));
        });
    } else {
        //No browser support geolocation service
        geolocationErrorOccurred(false, popup, (map.getCenter()));
    }

    function geolocationErrorOccurred(geolocationSupported, popup, latLng) {
        popup.setLatLng(latLng);
        popup.setContent(geolocationSupported ?
            '<b>Error:</b> The Geolocation service failed.' :
            '<b>Error:</b> This browser doesn\'t support geolocation.');
        popup.openOn(map);
    }
}

$(document).ready(function () {
    //hides our html for when user just clicks without input
    loadMap();
    $("#forgot-city").hide();
    $("#add-city").on("click", function (event) {
        event.preventDefault();

        //keeps user from clicking button with no input
        let userInput = $("#city-input").val().trim();

        if (userInput.length > 0) {
            //API Initializers (Call API functions below so that they will run on submit)
            eventBriteInfo();
            weather();
            console.log("latitude " + cityLatitude + " longitude " + cityLongitude);
            
            $("#forgot-city").hide();
        } else {
            $("#forgot-city").show();
        }
    })

})


