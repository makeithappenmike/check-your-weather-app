// Define things
var city;
var searchHistory = [];
var searchHistoryList = $(".search").append(`
<ul class="searcHistoryList"></ul>
`);
var today = moment().format("MM/DD/YY");
var uvi;
var forecastDay1 = moment(today, "MM/DD/YY").add(1, 'days').format("MM/DD/YY");
var forecastDay1 = moment(today, "MM/DD/YY").add(1, 'days').format("MM/DD/YY");
var forecastDay1 = moment(today, "MM/DD/YY").add(1, 'days').format("MM/DD/YY");
var forecastDay1 = moment(today, "MM/DD/YY").add(1, 'days').format("MM/DD/YY");
var forecastDay1 = moment(today, "MM/DD/YY").add(1, 'days').format("MM/DD/YY");


// Convert city to Title Case
function toTitleCase(city) {
    return city.toLowerCase().split(' ').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

// Show recent searches in search history
if (localStorage.getItem("searchHistory") != null) {
    var existingHistory = JSON.parse(localStorage.getItem("searchHistory"));
    console.log("exsitingHistory: ", existingHistory);
    if (!existingHistory.includes(searchHistory)) {
        searchHistory = [...existingHistory];
        searchHistory.forEach(city => {
            // console.log(toTitleCase(city));
            $(".searcHistoryList").append(`
            <li class="searchedCity">${toTitleCase(city)}</li>
            `);
        });
    };
};

// Load searchedCity to screen
$(".searchedCity").click(function (event) {
    console.log("click");
});


// Handle search button
$(".searchButton").click(function (event) {

    // Reset current weather for city
    city = $(".input").val();

    // If City is not null, display information
    if (city) {

        $(".input").val("");

        // Add city to search area
        if (!searchHistory.includes(city)) {
            // toTitleCase(city);
            $(".searcHistoryList").append(`
            <li class="searchedCity">${toTitleCase(city)}</li>
            `);
        };

        // Add the recent search to the searchHistory
        if (!searchHistory.includes(city)) {
            searchHistory.push(city.toLowerCase());
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        };

        // Get the latitude and longitude of the City
        function getLatLong() {
            var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&units=imperial&limit=1&appid=6798ccba44792929ff2f3dacdfb753cd";

            // Call Geo API to get the lat and lon
            fetch(locationUrl)
            .then((locationReponse) => {
                return locationReponse.json();
             })
            .then((locationData) => {
                console.log(locationData[0]);
                if (locationData.length !== 0) {
                // Replace city name (and convert to Title Case)
                city = toTitleCase(city);
                $(".cityHeading").text(city + "(" + moment(today, "MM/DD/YY").format("MM/DD/YY") + ")");
                $(".forecast").empty();
                $(".forecast").append(`
                <h5>5-Day Forecast:</h>
                `);
                var lat = locationData[0].lat;
                var lon = locationData[0].lon;

                // With lat and lon, get the uvIndex
                var uviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,daily&appid=6798ccba44792929ff2f3dacdfb753cd";

                return fetch(uviUrl)
                .then((uviResponse) => {
                    return uviResponse.json();
                })
                .then((uviResponse) => {
                    uvi = uviResponse.current.uvi;
                })
                .then(() => {

                    // Get Temp, Wind and Humidity from Weather API
                    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=6798ccba44792929ff2f3dacdfb753cd";
                    
                    // Get current weather
                    fetch(weatherUrl)
                    .then((weatherResponse) => {
                        return weatherResponse.json();
                })
                    .then((weatherData) => {
                        // Show current weather for city
                        $(".forecastSection").remove();
                        $("#currentWeather").empty();
                        $(".cityHeading").after(`
                        <section id="currentWeather">
                        <p>Temp: ${weatherData.main.temp}°F</p>
                        <p>Wind: ${weatherData.wind.speed} MPH</p>
                        <p>Humidity: ${weatherData.main.humidity} %</p>
                        <p>UV Index: <span class="uvIndexColor">${uvi}</span></p>
                        </section>
                        `);

                        // Handle UVIndex color
                        if (uvi < 3) {
                            $(".uvIndexColor").css("background-color", "green");
                            console.log("green");
                        } else if (uvi < 6) {
                            $(".uvIndexColor").css("background-color", "yellow");
                            console.log("yellow");
                        } else if (uvi < 8) {
                            $(".uvIndexColor").css("background-color", "orange");
                            console.log("orange");
                        } else if (uvi < 11) {
                            $(".uvIndexColor").css("background-color", "red");
                            console.log("red");
                        } else if (uvi > 10) {
                            $(".uvIndexColor").css("background-color", "pink");
                            console.log("pink");
                        };
                    });

                    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=6798ccba44792929ff2f3dacdfb753cd";

                    // Get forecast weather
                    fetch(forecastUrl)
                    .then((forecastResponse) => {
                        return forecastResponse.json();
                    })
                    .then((forecastData) => {  
                        var currentIcon;                      
                        for (let i = 0; i < 5; i++) {
                            let forecastIcon = "https://openweathermap.org/img/w/" + forecastData.list[i].weather[0].icon + ".png";
                            currentIcon = "https://openweathermap.org/img/w/" + forecastData.list[i].weather[0].icon + ".png";
                            console.log(forecastData.list[i].wind);
                            // Show future weather for city
                            $(".forecastDisplay").append(`
                            <section class="forecastSection">
                                <ul class="forecastList">
                                    <li class="forecastItem date">DATE: ${moment(today, "MM/DD/YY").add(i + 1, 'days').format("MM/DD/YY")}</li>
                                    <li class="forecastItem text"><img src="${forecastIcon}" /></li>
                                    <li class="forecastItem text">Temp: ${forecastData.list[i].main.temp}°F</li>
                                    <li class="forecastItem text">Wind: ${forecastData.list[i].wind.speed} MPH</li>
                                    <li class="forecastItem text">Humidity: ${forecastData.list[i].main.humidity} %</li>
                                </ul>
                            </section>
                            `);
                        };
                        $(".cityHeading").append(`
                            <img src="${currentIcon}" />
                            `);
                    });
                });
                } else {
                    $("#display").empty();
                    alert("Something went wrong :(");
                };
            });
            } getLatLong();

    }; // add else here to show error
});