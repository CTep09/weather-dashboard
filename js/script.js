// Variables to reference DOM Elements
var searchBtn = document.getElementById('searchBtn');
var clearHistoryBtn = document.getElementById('clearHistoryBtn')
var weatherInfoEl = document.getElementById('weatherInfo');
var forecastInfoEl = document.getElementById('forecast');

// For search history
var searchHistory = localStorage.getItem('searchHistory');

// Check if history exists in local storage
if (searchHistory) {
    var searchInputs = searchHistory.split(',');

    for (var i = 0; i < searchInputs.length; i++) {
        var searchInput = searchInputs[i];

        var searchHistoryEl = document.createElement('p');
        searchHistoryEl.textContent = "Search history: " + searchInput;

        document.body.appendChild(searchHistoryEl);
    }
}


// Add an event listener to the search button
searchBtn.addEventListener('click', function () {
    // Get the input value for city and state
    var cityStateInput = document.getElementById('citySearch').value;

    // Split the city and state input by comma
    var [city, state] = cityStateInput.split(',');

    // Save API key
    var apiKey = '199047995043e19035d5efb228e9e75d';

    // Using Direct geocoding API so user can input city and state instead of longitude and latitude
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${apiKey}`;

    // Save the input value to local storage
    localStorage.setItem('searchInput', cityStateInput);

    // Call the API with the URL
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Check if the API returned any data
            if (data.length > 0) {
                // Get the weather info from the API 
                var { lat, lon } = data[0];

                // Use the retrieved latitude and longitude to call the weather API
                var weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

                // Call the weather API to get the weather information
                fetch(weatherApiUrl)
                    .then(response => response.json())
                    .then(weatherData => {
                        console.log(weatherData);

                        // Convert temp to Fahrenheit
                        var tempFahrenheit = ((weatherData.main.temp - 273.15) * 9 / 5 + 32).toFixed(2);

                        // Update the weather info on the page
                        weatherInfoEl.innerHTML = `City: ${city}<br>State: ${state}<br>Temperature: ${tempFahrenheit}&deg;F<br>Weather: ${weatherData.weather[0].description}`;
                    })
                    .catch(error => {
                        console.error(error);
                    });

                // 5 day forecast 
                var forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

                fetch(forecastApiUrl)
                    .then(response => response.json())
                    .then(forecastData => {

                        // Creating array for forecast data to pull for each day 
                        var fiveDaysForecastData = [
                            forecastData.list[3],
                            forecastData.list[11],
                            forecastData.list[19],
                            forecastData.list[27],
                            forecastData.list[35]
                        ]

                        // Created for loop to iterate over 5 day forecast and dynamically generate cards 
                        for (var i = 0; i < fiveDaysForecastData.length; i++) {
                            var forecastCard = `
                            <h1>Day ${i + 1}: ${fiveDaysForecastData[i].dt_txt.split(" ")[0]}</h1>
                            <h2>Weather: ${fiveDaysForecastData[i].weather[0].main}
                            </h2>
                            <p>
                            Temperature: ${((fiveDaysForecastData[i].main.temp - 273.15) * 9 / 5 + 32).toFixed(2)}
                            Humidity: ${fiveDaysForecastData[i].main.humidity}
                            Wind Speed: ${fiveDaysForecastData[i].wind.speed}
                            </p>
                            <img src='https://openweathermap.org/img/w/${fiveDaysForecastData[i].weather[0].icon}.png'></img>
                        `
                            // Appending cards to html page
                            forecastInfoEl.innerHTML += forecastCard;

                        }
                    })
            } else {
                // Update the weather info on the page with an error message if necessary
                weatherInfoEl.innerHTML = 'Weather information not found';
            }
        })
        .catch(error => {
            console.error(error);
        });

    // Setting up local storage
    localStorage.setItem('searchInput', cityStateInput);

    var currentSearchHistory = localStorage.getItem('searchHistory');
    if (currentSearchHistory) {
        currentSearchHistory += ',' + cityStateInput;
        localStorage.setItem('searchHistory', currentSearchHistory);
    } else {
        localStorage.setItem('searchHistory', cityStateInput);
    }

})
// Clearing history when user clicks the clear history button
clearHistoryBtn.addEventListener('click', function () {
    localStorage.removeItem('searchHistory');

    var searchHistoryEls = document.querySelectorAll('p');
    searchHistoryEls.forEach(function (searchHistoryEl) {
        searchHistoryEl.remove();
})
    
});