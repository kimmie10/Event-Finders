// Global Variables
var numEvents = 20;
var cityLongitude = 0;
var cityLatitude = 0;
var event_Longitude = 0;
var event_Latitude = 0;
var globalMapLayer = MQ.mapLayer();
var map = L.map('map-view', {
    layers: globalMapLayer,
    center: [cityLongitude, cityLatitude],
    zoom: 12
});

// pinning events to map
function pinEvents(results) {
    var longToCompare = [];
    var venue_Name = "";
    for (var i = 0; i < numEvents; i++) {
        if (results.events[i].venue.name) {
            venue_Name = results.events[i].venue.name;
        } else {
            venue_Name = results.events[i].name.text;
        }
        var venue_name_short = venue_Name.split(" ").join("");
        event_Longitude = parseFloat(results.events[i].venue.longitude);
        event_Longitude = event_Longitude.toFixed(4);
        if (longToCompare.includes(event_Longitude)) {
            continue;
        } else {
            event_Latitude = parseFloat(results.events[i].venue.latitude);
            event_Latitude = event_Latitude.toFixed(4);
            L.marker([event_Latitude, event_Longitude]).addTo(map).bindPopup(venue_Name + '<br/><br/><button type="button" class="btn btn-outline-success btn-sm btn-block" id="pin_button" data="' + venue_name_short + '">Go to Event</button>');
            longToCompare.push(event_Longitude);
        }
    }
}

// Weather API function
function weather() {
    let APIKey = "6bf5141aa280ab7faa386b3fe5d1454f";
    let cityWeather = $("#city-input").val().trim();

    cityWeather += ", US";
    //console.log(cityWeather);

    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityWeather + "&type=accurate&units=imperial&APPID=" + APIKey;

    // Ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //console.log(response);

        const listArray = response.list;
        $("#city").html("<h3>" + response.city.name + "</h3>");

        $.each(listArray, function (i, value) {

            //if (day === )

            let time = listArray[i].dt_txt.slice(11)
            //console.log(time);
            if (time === "00:00:00") {
                let weatherDiv = $("<div class='weatherOnly'>");
                let day = $("<div class='d'>").text(response.list[i].dt_txt.slice(0, 10));
                //let date = new Date(day + "UTC");
                //date.toString();
                //console.log(date);
                let temp = $("<div class='t'>").text("Temp (F): " + response.list[i].main.temp);
                let wind = $("<div class='w'>").text("Wind Speed: " + response.list[i].wind.speed);
                let humidity = $("<div class='h'>").text("Humidity: " + response.list[i].main.humidity);

                weatherDiv.append(day);
                weatherDiv.append(temp);
                weatherDiv.append(wind);
                weatherDiv.append(humidity);

                const weatherArray = response.list[i].weather;

                $.each(weatherArray, function (k, value) {
                    let weatherDes = $("<div class='description'>").text(response.list[i].weather[k].description.toUpperCase());
                    let image = $("<img>").attr("src", "http://openweathermap.org/img/w/" + weatherArray[k].icon + ".png")
                    weatherDiv.append(weatherDes);
                    weatherDes.append(image);
                    //console.log(weatherDes);
                    //console.log(weatherArray[k]);
                });
                $("#city").append(weatherDiv);
                //console.log(day);
                //console.log(temp);
                //console.log(wind);
                //console.log(humidity);
            }
        });
        $(".daysWeather").show();

        cityLongitude = response.city.coord.lon;
        cityLatitude = response.city.coord.lat;
        map.panTo(new L.LatLng(cityLatitude, cityLongitude));

    });
}

// EventBrite API
function eventBriteInfo() {

    // Use location var with $("#city-input") submission
    var location = $("#city-input").val().trim();
    var queryURL = "https://www.eventbriteapi.com/v3/events/search/?expand=venue,category,subcategory,ticket,format,image&token=SZDJEP44NSPTC2RGIFBQ&location.address=" + location;

    // AJAX Call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var results = response;
        pinEvents(results);

        for (var j = 0; j < 20; j++) {
            var venueName;
            var venueID;
            if (results.events[j].venue.name) {
                venueName = results.events[j].venue.name;
                venueID = venueName.split(" ").join("");
            } else {
                venueName = results.events[j].name.text;
                venueID = venueName.split(" ").join("");
            }
            var eventFig = $('<fig class="event-box" id="' + venueID + '">');
            
            // if statements ensure that previous elements are defined before appending
            var imgURL;
            if(results.events[j].logo) {
                imgURL = results.events[j].logo.url;
            }

            var name;
            if(results.events[j].name) {
              name  = results.events[j].name.text;
            }

            var category;
            if (results.events[j].category) {
                category = results.events[j].category.name;
            }
            
            var time;
            if (results.events[j].start) {
                time = results.events[j].start.local;
            }
            
            var localAddress;
            if (results.events[j].venue.address) {
                localAddress = results.events[j].venue.address.localized_address_display;
            }

            var link = results.events[j].url;

            var image = $('<img class="event-img">');
            image.attr("src", imgURL);

            var title = $("<div>");
            title.append(name);

            var genre = $("<div>");
            genre.append(category);

            var timeMoment = moment(time).format("dddd, MMMM Do YYYY, h:mm a");

            var start = $("<div>");
            start.append(time);

            var venue = $("<div>");
            if (results.events[j].venue.name) {
                venue.append(venueName);
            };

            var address = $("<div>");
            address.append(localAddress);

            var clickMore = $("<a href>")
            clickMore.text("See full event details...");
            clickMore.attr("id", "clickDetails");
            clickMore.attr("data-link", link);

            eventFig.append(image);
            eventFig.append(title);
            eventFig.append(genre);
            eventFig.append(timeMoment);
            eventFig.append(venue);
            eventFig.append(address);
            eventFig.append(clickMore);

            $("#events-view").prepend(eventFig);

            $("#clickDetails").on("click", function (event) {
                event.preventDefault();
                window.open($(this).attr("data-link"), '_blank');
            })
        }
    });
}

//Adds different view options, such as street map, satellite image or hybrid of both
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

// Initializers on Page Load Up
$(document).ready(function () {
    //hides our html for when user just clicks without input
    loadMap();
    $("#forgot-city").hide();
    $(".daysWeather").hide();
    //$(document).on("click keypress", "#add-city", function (event) {
    var input = document.getElementById('city-input');
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("add-city").click();
        }
    })
    
    $(document).on("click keyup", "#add-city", function(event) {
        event.preventDefault();
        //keeps user from clicking button with no input
        let userInput = $("#city-input").val().trim();

        if (userInput.length > 0) {
            //API Initializers (Call API functions below so that they will run on submit)
            //cityInfo();

            $("#events-view").empty();
            eventBriteInfo();
            weather();

            $("#forgot-city").hide();
        } else {
            $("#forgot-city").show();
        }

        //Clears input field after button click
        $("#city-input").val(" ");
        var view = document.getElementById('map-view');
        view.scrollIntoView();
    })

    $(document).on("click", "#pin_button", function (event) {
        event.preventDefault();
        var venueID = $(this).attr('data');
        if (document.getElementById(venueID)) {
            var eventHTML = document.getElementById(venueID);
            eventHTML.scrollIntoView();
        }
    });
});