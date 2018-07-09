


// Weather API function
function weather() {


    let APIKey = "6bf5141aa280ab7faa386b3fe5d1454f";
    let cityWeather = this.value;
    //console.log(cityWeather);

    let queryURL = "https:// api.openweathermap.org/data/2.5/find?q=" + cityWeather + "&units=imperial" + APIKey;

    // Ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let weatherResults = response;


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

$(document).ready(function () {
    //hides our html for when user just clicks without input
    $("#forgot-city").hide();
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
    })

})
