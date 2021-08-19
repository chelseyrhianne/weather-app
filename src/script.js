function formatDay(now) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[now.getDay()];
  let newDay = `${day}`;
  return newDay;
}

function formatTime(now) {
  let hour = ("0" + now.getHours()).slice(-2);
  let minutes = ("0" + now.getMinutes()).slice(-2);
  let newTime = `${hour}:${minutes}`;
  return newTime;
}

function search(city) {
  let units = "metric";
  let apiKey = "79c697bee7cb8b155a2b7ddf63fb1c8a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showLocation);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-name").value;
  if (city) {
    search(city);
  } else {
    alert("Please enter a city");
  }
}

function useLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  let units = "metric";
  let apiKey = "79c697bee7cb8b155a2b7ddf63fb1c8a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showLocation);
}

function showLocation(response) {
  document.querySelector("#current-city").innerHTML = response.data.name;
  showWeather(response);
}

function showWeather(response) {
  celsiusMinTemperature = Math.round(response.data.main.temp_min);
  celsiusMaxTemperature = Math.round(response.data.main.temp_max);
  celsiusTemperature = Math.round(response.data.main.temp);
  let minMaxTempDisplay = document.querySelector("#current-min-max");
  let tempDisplay = document.querySelector("#current-temp");
  minMaxTempDisplay.innerHTML = `${celsiusMinTemperature}° / ${celsiusMaxTemperature}°`;
  tempDisplay.innerHTML = `${celsiusTemperature}°`;
  showDescription(response);
  showWindSpeed(response);
  showHumidity(response);
  showIcon(response);
  getForecast(response.data.coord);
}

function showDescription(response) {
  document.querySelector("#current-desc").innerHTML =
    response.data.weather[0].description;
}

function showWindSpeed(response) {
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
}

function showHumidity(response) {
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
}

function showIcon(response) {
  let iconElement = document.querySelector("#current-icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function getForecast(coordinates) {
  let units = "metric";
  let apiKey = "79c697bee7cb8b155a2b7ddf63fb1c8a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2"> 
    <div class = "forecast-day">${formatForecastDay(forecastDay.dt)}</div>
    <img src="http://openweathermap.org/img/wn/${
      forecastDay.weather[0].icon
    }@2x.png" alt="" width="72"/>
    <div class="forecast-temp"><strong>${Math.round(
      forecastDay.temp.day
    )}°</strong></div>
    <div class="forecast-min-max">${Math.round(
      forecastDay.temp.min
    )}° / ${Math.round(forecastDay.temp.max)}°</div>
    </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function convertCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#current-temp").innerHTML = `${celsiusTemperature}°`;
  document.querySelector(
    "#current-min-max"
  ).innerHTML = `${celsiusMinTemperature}° / ${celsiusMaxTemperature}°`;
}
function convertFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  let fahrenheitMinTemperature = Math.round(
    (celsiusMinTemperature * 9) / 5 + 32
  );
  let fahrenheitMaxTemperature = Math.round(
    (celsiusMaxTemperature * 9) / 5 + 32
  );
  document.querySelector(
    "#current-temp"
  ).innerHTML = `${fahrenheitTemperature}°`;
  document.querySelector(
    "#current-min-max"
  ).innerHTML = `${fahrenheitMinTemperature}° / ${fahrenheitMaxTemperature}°`;
}

let day = document.querySelector("#current-day");
day.innerHTML = formatDay(new Date());

let time = document.querySelector("#current-time");
time.innerHTML = formatTime(new Date());

let city = document.querySelector("#city-search");
city.addEventListener("submit", handleSubmit);

let currentLoc = document.querySelector("#current-loc");
currentLoc.addEventListener("submit", useLocation);

let celsiusLink = document.querySelector("#convert-celsius");
celsiusLink.addEventListener("click", convertCelsius);

let celsiusTemperature = null;
let celsiusMinTemperature = null;
let celsiusMaxTemperature = null;

let fahrenheitLink = document.querySelector("#convert-fahrenheit");
fahrenheitLink.addEventListener("click", convertFahrenheit);

search("London");
