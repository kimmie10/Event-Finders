
var longitude = 0;
var latitude = 0;
var globalMapLayer = MQ.mapLayer(), geolocationMap;


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
        longitude = response.coord.lon;
        console.log("longitude: " + longitude);
        latitude = response.coord.lat;
        console.log("latitude: " + latitude);
        geolocationMap.panTo(new L.LatLng(latitude, longitude));
        var marker = L.marker([latitude, longitude]).addTo(geolocationMap);
    })
}
// EventBrite API
function eventBriteInfo() {

    // Use location var with $("#city-input") submission
    var location = $("#city-input").val().trim();
    var queryURL = "https://www.eventbriteapi.com/v3/events/search/?token=SZDJEP44NSPTC2RGIFBQ&location.address=" + location;

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
    
    geolocationMap = L.map('map-view', {
        layers: globalMapLayer,
        center: [longitude, latitude],
        zoom: 12
    });
    L.control.layers({
        'Map': globalMapLayer,
        'Hybrid': MQ.hybridLayer(),
        'Satellite': MQ.satelliteLayer(),
    }).addTo(geolocationMap);

    //centers map to user position and pop's up there
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
            geolocationErrorOccurred(true, popup, (geolocationMap.getCenter()));
        });
    } else {
        //No browser support geolocation service
        geolocationErrorOccurred(false, popup, (geolocationMap.getCenter()));
    }

    function geolocationErrorOccurred(geolocationSupported, popup, latLng) {
        popup.setLatLng(latLng);
        popup.setContent(geolocationSupported ?
            '<b>Error:</b> The Geolocation service failed.' :
            '<b>Error:</b> This browser doesn\'t support geolocation.');
        popup.openOn(geolocationMap);
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
            console.log("latitude " + latitude + " longitude " + longitude);
            
            $("#forgot-city").hide();
        } else {
            $("#forgot-city").show();
        }
    })

})


