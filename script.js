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
        // console.log(searchHistory.includes(city));
        if (!searchHistory.includes(city)) {
            // console.log("Nope");
            $(".searcHistoryList").append(`
            <li>${city}</li>
            `);
        };
        // Add the recent search to the searchHistory
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Replace city name
        $(".cityHeading").text(city);

        // Get lat and lon from City
        function getLatLong() {
            var locationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=6798ccba44792929ff2f3dacdfb753cd";

            // Call forecast API
            fetch(locationUrl)
            .then((locationReponse) => {
                return locationReponse.json();
        })
            .then((locationReponse) => {
                // console.log("data3", data3[0]);
                var lat = locationReponse[0].lat;
                var lon = locationReponse[0].lon;
                // console.log(lat);
                // console.log(lon);
                // Get UVIndex
                // function getUVIndex() {
                    var uviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=6798ccba44792929ff2f3dacdfb753cd";

                return fetch(uviUrl)
                .then((uviResponse) => {
                    return uviResponse.json();
                })
                .then((uviResponse) => {
                    // console.log("data4", data4.current.uvi);
                    uvi = uviResponse.current.uvi;
                })
                .then((data4) => {
                    // Load weather from API
                    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6798ccba44792929ff2f3dacdfb753cd";
                    // var url = "https://api.openweathermap.org/data/3.0/onecall?q=" + city  + "&appid=6798ccba44792929ff2f3dacdfb753cd";
                    // var url2 = "https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=6798ccba44792929ff2f3dacdfb753cd";

                    // Get current weather
                    fetch(url)
                    .then((response) => {
                        return response.json();
                })
                    .then((data) => {
                        console.log(data);
                        // Show current weather for city
                        $(".cityHeading").after(`
                        <section id="currentWeather">
                        <p>Temp: ${data.main.temp}</p>
                        <p>Wind: ${data.wind.deg}</p>
                        <p>Humidity: ${data.main.humidity}</p>
                        <p>UV Index: ${uvi}</p>
                        </section>
                        `);

                        // Show future weather for city
                        $(".forecast").after(`
                        <section class="forecastItem">${day1}</section>
                        <section class="forecastItem">${day2}</section>
                        <section class="forecastItem">${day3}</section>
                        <section class="forecastItem">${day4}</section>
                        <section class="forecastItem">${day5}</section>
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