const mapContainer = $("#map-container");
let countryP = $(".country");
let idP = $(".temp_c");
let latP = $("#lat");
let lonP = $("#lon");
let nameP = $(".name");
let regionP = $(".region");
let urlP = $(".url");
let humidity = $(".humidity");
let tz_id = $(".tz_id");
let wind_kph = $(".wind_kph");
let img = document.getElementById("weatherIcon");
const apiKey = "4a758dd1aed04dc3950175920231609";

var map = L.map('map').setView([0, 0], 13);

var marker;

getLocation();


function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
//--------------------------------------getCurrentPosition-----------------------------------
let latitude;
let longitude;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  fetchWeatherData(latitude + "," + longitude);


  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  marker = L.marker([latitude, longitude]).addTo(map);
  marker.setLatLng([latitude, longitude]).update();
  map.setView([latitude, longitude]);

  const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;


    
  $.ajax({
    method: "GET",
    url: geoApiUrl,
    success: (resp) => {
      console.log('====================================');
      console.log(resp);
      console.log('====================================');
    }
  })
  
}





//-------------------------------------------handleSearch----------------------------------------

function handleSearch() {
  const location = document.getElementById("location-input").value;
  fetchWeatherData(location);
}
document.getElementById("search-button").addEventListener("click", handleSearch);

function fetchWeatherData(location) {
  $.ajax({
    method: "GET",
    url: `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`,
    success: ({ location, current }) => {
      countryP.text(location.country);
      idP.text(current.temp_c.toLocaleString(undefined,{style:"unit",unit:"celsius"}));
      latP.text(location.lat);
      lonP.text(location.lon);
      nameP.text(location.name);
     let locationName = location.name;
      
      regionP.text(location.region);
      urlP.text(current.condition.text);
      humidity.text(current.humidity);
      tz_id.text(location.tz_id);
      wind_kph.text(current.wind_kph + "kph");
      img.src = current.condition.icon;

      marker.setLatLng([location.lat, location.lon]).update();
      map.setView([location.lat, location.lon]);
    }
  });
}


// -------------------------------------------------updateLocalTime-----------------------------

function updateLocalTime() {
  const localTimeElement = document.getElementById("local-time");
  const now = new Date();
  const localTimeString = now.toLocaleTimeString();

  localTimeElement.textContent = `${localTimeString}`;
}

updateLocalTime();

setInterval(updateLocalTime, 1000);

//---------------------------------------------------searchForecast-------------------------------------

searchForecast();

function searchForecast() {

  const startDate = new Date(document.getElementById('startDate').value);
  const endDate = new Date(document.getElementById('endDate').value);
  const timeDiff = endDate - startDate;

  const daysDiff = timeDiff / (1000 * 3600 * 24);

 // getWeatherTimeLine(document.getElementById('startDate').value, document.getElementById('endDate').value)

}
getWeatherTimeLine("2023-10-01","2023-09-25")
// ------------------------------------getWeatherTimeLine---------------------------------

function getWeatherTimeLine(startDate, endDate) {

  console.log(startDate,endDate);

  const imgIds = ["img1", "img2", "img3", "img4", "img5", "img6", "img7"];
  const titleClasses = [".title1", ".title2", ".title3", ".title4", ".title5", ".title6", ".title7"];
  const dateIds = ["date1", "date2", "date3", "date4", "date5", "date6", "date7"];
  $.ajax({
    method: "GET",
    url: `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${"Panadura"}&dt=${startDate}&end_dt=${endDate}`,
    success: (resp) => {
      for (let i = 0; i < 7; i++) {
        const forecastDay = resp['forecast']['forecastday'][i]['day'];

        const img = document.getElementById(imgIds[i]);
        const title = document.querySelector(titleClasses[i]);
        const date = document.getElementById(dateIds[i]);

        img.src = forecastDay['condition']['icon'];
        title.innerHTML = forecastDay['condition']['text'];
        date.innerHTML = resp['forecast']['forecastday'][i]['date'];
      }
    }
  });
}



