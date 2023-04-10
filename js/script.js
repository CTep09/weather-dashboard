var searchBtn = document.getElementById('searchBtn');
var weatherInfoEl = document.getElementById('weatherInfo');

// Add an event listener to the search button
searchBtn.addEventListener('click', function() {
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

    // Call the API with the constructed URL
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
                    var tempFahrenheit = ((weatherData.main.temp - 273.15) * 9/5 + 32).toFixed(2);

                    // Update the weather info on the page
                    weatherInfoEl.innerHTML = `City: ${city}<br>State: ${state}<br>Temperature: ${tempFahrenheit}&deg;F<br>Weather: ${weatherData.weather[0].description}`;
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            // Update the weather info on the page with an error message if necessary
            weatherInfoEl.innerHTML = 'Weather information not found';
        }
    })
    .catch(error => {
        console.error(error);
    });
});