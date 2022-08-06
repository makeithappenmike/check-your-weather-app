// Define things
var url = "http://api.openweathermap.org/geo/1.0/direct?q=" + "atlanta" + "&appid=6798ccba44792929ff2f3dacdfb753cd";
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

// Load weather from API
fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data));
  console.log(url);

// Show recent searches in search history
if (localStorage.getItem("searchHistory") != null) {
    var existingHistory = JSON.parse(localStorage.getItem("searchHistory"));
    console.log("SearchHistory:", searchHistory);
    searchHistory = [...existingHistory];
    searchHistory.forEach(city => {
        console.log(city);
        $(".searcHistoryList").append(`
        <li>${city}</li>
        `);
    });
};

// Handle search button
$(".searchButton").click(function () {
    city = $(".input").val();
    searchHistory.push(city);
    console.log(city);
    console.log("click");
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Replace city name
    $(".cityHeading").text(city);

    // Show current weather for city
    $(".cityHeading").after(`
    <p>Temp:</p>
    <p>Wind:</p>
    <p>Humidity</p>
    <p>UV Index:</p>
    `);

    // Show future weather for city
    $(".forecast").after(`
    <section>${day1}</section>
    <section>${day2}</section>
    <section>${day3}</section>
    <section>${day4}</section>
    <section>${day5}</section>
    `);

    // Add city to search area
    $(".searcHistoryList").append(`
        <li>${city}</li>
        `)
});