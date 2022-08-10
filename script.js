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

console.log("exsitingHistory: ", existingHistory);

// Show recent searches in search history
if (localStorage.getItem("searchHistory") != null) {
    var existingHistory = JSON.parse(localStorage.getItem("searchHistory"));
    // console.log("SearchHistory:", searchHistory);
    searchHistory = [...existingHistory];
    searchHistory.forEach(city => {
        // console.log(city);
        $(".searcHistoryList").append(`
        <li>${city}</li>
        `);
    });
};

// Handle search button
$(".searchButton").click(function () {
    city = $(".input").val();
    if (city) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Replace city name
        $(".cityHeading").text(city);

        // Load weather from API
        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=6798ccba44792929ff2f3dacdfb753cd";
        fetch(url)
        .then((response) => {
            return response.json();
       })
        .then((data) => {
            console.log(data);
            // Show current weather for city
            $(".cityHeading").after(`
            <p>Temp: ${data.main.temp}</p>
            <p>Wind: ${JSON.stringify(data.wind)}</p>
            <p>Humidity: ${data.main.humidity}</p>
            <p>UV Index: ${uvIndex}</p>
            `);

            // Add city to search area
            $(".searcHistoryList").append(`
            <li>${city}</li>
            `);
        });



        console.log("url", url);

        var temp = "";
        var wind = "";
        var humidity = "";
        var uvIndex = "";

        

        // Show future weather for city
        $(".forecast").after(`
        <section class="forecastItem">${day1}</section>
        <section class="forecastItem">${day2}</section>
        <section class="forecastItem">${day3}</section>
        <section class="forecastItem">${day4}</section>
        <section class="forecastItem">${day5}</section>
        `);

        
    }; // add else here to show error
});