// Define things
var url = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=33.44&exclude=hourly,daily&appid=6798ccba44792929ff2f3dacdfb753cd"
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
    // $(".search").append(searchHistory);
    searchHistory.forEach(city => {
        console.log(city);
        $(".searcHistoryList").append(`
        <li>${city}</li>
        `);
    });
};

$(".searchButton").click(function () {
    var city = $(".input").val();
    searchHistory.push(city);
    console.log(city);
    console.log("click");
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Add city to search area
    $(".searcHistoryList").append(`
        <li>${city}</li>
        `)
});