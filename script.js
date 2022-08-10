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

        // Replace city name
        $(".cityHeading").text(city);

        // Get the latitude and longitude of the City
        function getLatLong() {
            var locationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=6798ccba44792929ff2f3dacdfb753cd";

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
                        <p>Temp: ${weatherData.main.temp}</p>
                        <p>Wind: ${weatherData.wind.deg}</p>
                        <p>Humidity: ${weatherData.main.humidity}</p>
                        <p>UV Index: ${uvi}</p>
                        </section>
                        `);
                    });

                    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=6798ccba44792929ff2f3dacdfb753cd";

                    // Get forecast weather
                    fetch(forecastUrl)
                    .then((forecastResponse) => {
                        return forecastResponse.json();
                })
                    .then((forecastData) => {
                        console.log("forecast", forecastData.list.length);
                        for (let i = 0; i < 4; i++) {
                            console.log(forecastData.list[i]);
                        };
                        
                        // Show future weather for city
                        $(".forecast").after(`
                        <section class="forecastItem">
                            DATE: ${day1} <br>
                            ${forecastData.list[1].weather[0].icon} <br>
                            Temp: ${forecastData.list[1].main.temp} <br>
                            Wind: ${forecastData.list[1].wind.speed} <br>
                            Humidity: ${forecastData.list[1].main.humidity} <p>
                        </section>

                        <section class="forecastItem">
                        DATE: ${day2} <br>
                        ${forecastData.list[2].weather[0].icon} <br>
                        Temp: ${forecastData.list[2].main.temp} <br>
                        Wind: ${forecastData.list[2].wind.speed} <br>
                        Humidity: ${forecastData.list[2].main.humidity} <p>
                        </section>

                        <section class="forecastItem">
                        DATE: ${day3} <br>
                        ${forecastData.list[3].weather[0].icon} <br>
                        Temp: ${forecastData.list[3].main.temp} <br>
                        Wind: ${forecastData.list[3].wind.speed} <br>
                        Humidity: ${forecastData.list[3].main.humidity} <p>
                        </section>

                        <section class="forecastItem">
                        DATE: ${day4} <br>
                        ${forecastData.list[4].weather[0].icon} <br>
                        Temp: ${forecastData.list[4].main.temp} <br>
                        Wind: ${forecastData.list[4].wind.speed} <br>
                        Humidity: ${forecastData.list[4].main.humidity} <p>
                        </section>

                        <section class="forecastItem">
                        DATE: ${day5} <br>
                        ${forecastData.list[5].weather[0].icon} <br>
                        Temp: ${forecastData.list[5].main.temp} <br>
                        Wind: ${forecastData.list[6].wind.speed} <br>
                        Humidity: ${forecastData.list[5].main.humidity} <p>
                        </section>
                    `);
                    });

                });
            });
            } getLatLong();

        

    //     // Load weather from API
    //     var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6798ccba44792929ff2f3dacdfb753cd";
    //     // var url = "https://api.openweathermap.org/data/3.0/onecall?q=" + city  + "&appid=6798ccba44792929ff2f3dacdfb753cd";
    //     // var url2 = "https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=6798ccba44792929ff2f3dacdfb753cd";

    //     // Get current weather
    //     fetch(url)
    //     .then((response) => {
    //         return response.json();
    //    })
    //     .then((data) => {
    //         console.log(data);
    //         // Show current weather for city
    //         $(".cityHeading").after(`
    //         <p>Temp: ${data.main.temp}</p>
    //         <p>Wind: ${data.wind.deg}</p>
    //         <p>Humidity: ${data.main.humidity}</p>
    //         <p>UV Index: ${uvi}</p>
    //         `);

    //                     // // Show future weather for city
    //         // $(".forecast").after(`
    //         // <section class="forecastItem">${day1}</section>
    //         // <section class="forecastItem">${day2}</section>
    //         // <section class="forecastItem">${day3}</section>
    //         // <section class="forecastItem">${day4}</section>
    //         // <section class="forecastItem">${day5}</section>
    //         // `);

    //         // Add city to search area
    //         $(".searcHistoryList").append(`
    //         <li>${city}</li>
    //         `);
    //     });

        // console.log("url", url);

        // var temp = "";
        // var wind = "";
        // var humidity = "";
        // var uvIndex = "";

        

        
    }; // add else here to show error
});