// Define things
var url = "http://api.openweathermap.org/geo/1.0/direct?q=" + "atlanta" + "&appid=6798ccba44792929ff2f3dacdfb753cd";
var city;
var searchHistory = [];
var searchHistoryList = $(".search").append(`
<ul class="searcHistoryList"></ul>
`);
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

$(".searchButton").click(function () {
    city = $(".input").val();
    searchHistory.push(city);
    console.log(city);
    console.log("click");
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Replace city name
    $(".cityHeading").text(city);

    // Add city to search area
    $(".searcHistoryList").append(`
        <li>${city}</li>
        `)
});