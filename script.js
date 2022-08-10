// Define things
var city;
var searchHistory = [];
var searchHistoryList = $(".search").append(`
<ul class="searcHistoryList"></ul>
`);
var today = moment().format("MM/DD/YY");
var day1 = moment(today, "MM/DD/YY").add(1, 'days').format("MM/DD/YY");
var day2 = moment(today, "MM/DD/YY").add(2, 'days').format("MM/DD/YY");
var day3 = moment(today, "MM/DD/YY").add(3, 'days').format("MM/DD/YY");
var day4 = moment(today, "MM/DD/YY").add(4, 'days').format("MM/DD/YY");
var day5 = moment(today, "MM/DD/YY").add(5, 'days').format("MM/DD/YY");
var uvi;


// Show recent searches in search history
// TO DO: Fix local storage double logging
if (localStorage.getItem("searchHistory") != null) {
    var existingHistory = JSON.parse(localStorage.getItem("searchHistory"));
    console.log("exsitingHistory: ", existingHistory);
    // console.log("SearchHistory:", searchHistory);
    if (!existingHistory.includes(searchHistory)) {
        searchHistory = [...existingHistory];
        searchHistory.forEach(city => {
            // console.log(city);
            $(".searcHistoryList").append(`
            <li>${city}</li>
            `);
        });
    };
};

// Handle search button
$(".searchButton").click(function (event) {

    // Reset current weather for city
    // TODO: Get this working
    event.preventDefault();
    // console.log($("#currentWeather")[0]);
    // $("#currentWeather")[0].text();
    city = $(".input").val();

    // If City is not null, display information
    if (city) {


        // Add city to search area
        if (!searchHistory.includes(city)) {
            $(".searcHistoryList").append(`
            <li>${city}</li>
            `);
        };

        // Add the recent search to the searchHistory
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Replace city name (and convert to Title Case)
        function toTitleCase(city) {
            return city.toLowerCase().split(' ').map(function (word) {
              return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
        }
        city = toTitleCase(city);
        $(".cityHeading").text(city);

        $(".forecast").append(`
        <h5>5-Day Forecast:</h>
        `);

        // Get the latitude and longitude of the City
        function getLatLong() {
            var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=6798ccba44792929ff2f3dacdfb753cd";

            // Call Geo API to get the lat and lon
            fetch(locationUrl)
            .then((locationReponse) => {
                return locationReponse.json();
             })
            .then((locationData) => {
                var lat = locationData[0].lat;
                var lon = locationData[0].lon;

                // With lat and lon, get the uvIndex
                var uviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=6798ccba44792929ff2f3dacdfb753cd";

                return fetch(uviUrl)
                .then((uviResponse) => {
                    return uviResponse.json();
                })
                .then((uviResponse) => {
                    uvi = uviResponse.current.uvi;
                })
                .then(() => {

                    // Get Temp, Wind and Humidity from Weather API
                    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6798ccba44792929ff2f3dacdfb753cd";
                    
                    // Get current weather
                    fetch(weatherUrl)
                    .then((weatherResponse) => {
                        return weatherResponse.json();
                })
                    .then((weatherData) => {
                        console.log(weatherData);
                        // Show current weather for city
                        $(".cityHeading").after(`
                        <section id="currentWeather">
                        <p>Temp: ${weatherData.main.temp}°F</p>
                        <p>Wind: ${weatherData.wind.deg} MPH</p>
                        <p>Humidity: ${weatherData.main.humidity} %</p>
                        <p>UV Index: ${uvi}</p>
                        </section>
                        `);
                    });

                    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&&appid=6798ccba44792929ff2f3dacdfb753cd";

                    // Get forecast weather
                    fetch(forecastUrl)
                    .then((forecastResponse) => {
                        return forecastResponse.json();
                })
                    .then((forecastData) => {
                        console.log("forecast", forecastData.list.length);
                        
                        for (let i = 0; i < 5; i++) {
                            let icon = "https://openweathermap.org/img/w/" + forecastData.list[i].weather[0].icon + ".png";
                            console.log("icon", icon);
                            console.log(forecastData.list[i]);
                            // Show future weather for city
                        $(".forecastDisplay").append(`
                        <section class="forecastSection">
                            <ul class="forecastList">
                                <li class="forecastItem date">DATE: ${day1}</li>
                                <li class="forecastItem text"><img src="${icon}" /></li>
                                <li class="forecastItem text">Temp: ${forecastData.list[i].main.temp}°F</li>
                                <li class="forecastItem text">Wind: ${forecastData.list[i].wind.speed} MPH</li>
                                <li class="forecastItem text">Humidity: ${forecastData.list[i].main.humidity} %</li>
                            </ul>
                        </section>
                    `);
                        };
                        
                    });

                });
            });
            } getLatLong();

    }; // add else here to show error
});