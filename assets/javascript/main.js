



// Weather API function
function weather() {


    let APIKey = "6bf5141aa280ab7faa386b3fe5d1454f";
    let cityWeather = $("#city-input").val().trim();
    cityWeather += ", US";
    console.log(cityWeather);

    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityWeather + "&type=accurate&units=imperial&APPID=" + APIKey;

    // Ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        const listArray = response.list;
        $("#city").html("<h3>" + response.city.name + "</h3>");

        for (let i = 0; i < listArray.length; i++) {
            let weatherDiv = $("<div>");
            let day = ("<h4> " + response.list[i].dt_txt + "</h4>");
            let lowTemp = ("Low (F) " + response.list[i].main.temp_min);
            let highTemp = ("High (F)" + response.list[i].main.temp_max);
            let wind = ("Wind Speed: " + response.list[i].wind.speed);
            let humidity = ("Humidity: " + response.list[i].main.humidity);
            //let weather = (response.list[i].weather[i].description.toUpperCase());

            


            /*$("#lowTemp").text("Low (F) " + response.list[i].main.temp_min);
            $("#highTemp").text("High (F)" + response.list[i].main.temp_max);
            $("#wind").text("Wind Speed: " + response.list[i].wind.speed);
            $("#humidity").text("Humidity: " + response.list[i].main.humidity);*/

            const weatherArray = response.list[i].weather;
            for (let k = 0; k < weatherArray.length; k++) {
                let weather = (response.list[i].weather[k].description.toUpperCase());

                weatherDiv.append(weather);

            }
            weatherDiv.append(day);
            weatherDiv.append(lowTemp);
            weatherDiv.append(highTemp);
            weatherDiv.append(wind);
            weatherDiv.append(humidity);
            

        }
        $(".daysWeather").show();
    });


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
            details.text(description);

            eventDiv.append(header);
            eventDiv.append(image);
            eventDiv.append(details);
            $("#events-view").prepend(eventDiv);
        }
    });
}

$(document).ready(function () {
    //hides our html for when user just clicks without input
    $("#forgot-city").hide();
    $(".daysWeather").hide();
    $("#add-city").on("click", function (event) {

        event.preventDefault();

        //keeps user from clicking button with no input
        let userInput = $("#city-input").val().trim();

        if (userInput.length > 0) {
            //API Initializers (Call API functions below so that they will run on submit)
            eventBriteInfo();
            weather();

            $("#forgot-city").hide();
        } else {
            $("#forgot-city").show();
        }

        $("#city-input").val(" ");
    })

})


