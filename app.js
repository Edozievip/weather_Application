document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("weatherForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("nameInput").value;
      const location = document.getElementById("locationInput").value;

      if (name && location) {
          getWeather(name, location);
      } else {
          alert("Please enter your name and location.");
      }
  });
});

function getWeather(name, location) {
  const geoNamesApiKey = 'edozievip';
  const geoNamesApiUrl = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${geoNamesApiKey}`;

  fetch(geoNamesApiUrl)
      .then((response) => response.json())
      .then((geoNamesData) => {
          if (geoNamesData.totalResultsCount > 0) {
              const country = geoNamesData.geonames[0].countryName;
              getWeatherByCountry(name, location, country);
          } else {
              getWeatherByLocation(name, location);
          }
      })
      .catch((error) => {
          console.error("Error fetching country data:", error);
      });
}

function getWeatherByCountry(name, location, country) {
  const apiKey = 'b65386b2d5cbb98e5e15a7c71b8979e8';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            getCountryDetails(data.sys.country)
                .then((countryDetails) => {
                    displayWeather(name, location, country, data, countryDetails);
                })
                .catch((error) => {
                    console.error("Error fetching country details:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
        });
}

function getWeatherByLocation(name, location) {
  const apiKey = 'b65386b2d5cbb98e5e15a7c71b8979e8';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
          displayWeather(name, location, data);
      })
      .catch((error) => {
          console.error("Error fetching weather data:", error);
      });
}

function  getCountryDetails(countryCode) {
  const restcountriesApiUrl = `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,currencies,population,region`;

  return fetch(restcountriesApiUrl)
      .then((response) => response.json())
      .catch((error) => {
          console.error("Error fetching country details:", error);
          throw error;
      });
}

function displayWeather(name, location, country, weatherData, countryDetails) {
  const weatherResultContainer = document.getElementById("weatherResult");

  const message = `
      <h3>Hello, ${name}!</h3>
      <p>Current weather in ${location}${country ? `, ${country}` : ''}:</p>
      <p>Temperature: ${weatherData.main.temp} °C</p>
      <p>Weather: ${weatherData.weather[0].description}</p>
      <p>Time: ${new Date().toLocaleTimeString()}</p>
      ${countryDetails ? `<p>Country Facts:</p>
      <ul>
          ${countryDetails.population ? `<li>Population: ${countryDetails.population}</li>` : ''}
          ${countryDetails.region ? `<li>Region: ${countryDetails.region}</li>` : ''}
          ${countryDetails.currencies && countryDetails.currencies[0] ? `<li>Currency: ${countryDetails.currencies[0].name} (${countryDetails.currencies[0].code})</li>` : ''}
      </ul>` : ''}
  `;

  weatherResultContainer.innerHTML = message;
}
