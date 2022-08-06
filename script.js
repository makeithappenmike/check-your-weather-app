var url = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=33.44&exclude=hourly,daily&appid=6798ccba44792929ff2f3dacdfb753cd"
fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data));
  console.log(url);