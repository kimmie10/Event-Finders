// Submit Click Function To Insert City into API search
$("#add-city").on("click", function(event) {
    event.preventDefault();

    // Clears Previous Search
    $("#events-view").empty();
    
    // Add API functions here

    // EventBrite API
    function eventBriteInfo() {

        // Use location var with $("#city-input") submission
        var location = $("#city-input").val().trim();
        var queryURL = "https://www.eventbriteapi.com/v3/events/search/?token=BFAWO7WOGSFYXUZUJBHL&location.address=" + location;
    
        // AJAX Call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
        
            var results = response;
            console.log(results);
            console.log(results.events);
            console.log(results.events[0]);
            console.log(results.events[0].logo.url);

            for (var j = 0; j < 3; j++) {
                var eventDiv = $("<div>");
        
                var imgURL = results.events[j].logo.url;
                var description = results.events[j].description.text
                var image = $("<img>");
                image.attr("src", imgURL);
                var details = $("<p>");
                details.text(description)
        
                eventDiv.append(image);
                eventDiv.append(details);
                $("#events-view").prepend(eventDiv);
            }
        });
    }

    //API Initializers (Call API functions below so that they will run on submit)
    eventBriteInfo();
});