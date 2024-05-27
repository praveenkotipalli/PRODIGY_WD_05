// app.js

const apiKey = '3e46bbe30b2bc80a3f49d01ed3250525';

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeather(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        return data;
    } catch (error) {
        throw error;
    }
}

// Function to fetch weather forecast data from OpenWeatherMap API
async function fetchForecast(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (data.cod !== "200") throw new Error(data.message);
        return data;
    } catch (error) {
        throw error;
    }
}

// Function to update the UI with weather data
function updateWeather(data) {
    const date = new Date();
    document.getElementById('day').innerText = date.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('date').innerText = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById('location').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weather').innerText = data.weather[0].description;
    document.getElementById('precipitation').innerText = `${data.clouds.all}%`;
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('wind').innerText = `${data.wind.speed} km/h`;

    // Change background based on the weather
    changeBackground(data.weather[0].main);
}

// Function to update the UI with forecast data
function updateForecast(data) {
    const days = ['day1', 'day2', 'day3', 'day4'];
    days.forEach((day, index) => {
        const forecast = data.list[index * 8];
        document.getElementById(day).querySelector('p:nth-child(1)').innerText = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        document.getElementById(day).querySelector('p:nth-child(2)').innerText = `${Math.round(forecast.main.temp)}°C`;
    });
}

// Function to change the background based on the weather
function changeBackground(weather) {
    const weatherApp = document.querySelector('.weather-app');
    let backgroundUrl = '';

    switch (weather.toLowerCase()) {
        case 'clear':
            backgroundUrl = 'url(https://i.pinimg.com/564x/e7/24/a3/e724a379a3bca9db0665745b9b86cd38.jpg)';
            break;
        case 'rain':
            backgroundUrl = 'url(https://i.pinimg.com/736x/99/a8/e1/99a8e1381dc6129bac76f89ba6e85605.jpg)';
            break;
        case 'clouds':
            backgroundUrl = 'url(https://i.pinimg.com/564x/07/e5/13/07e513b422f75968e6049083b0865b6c.jpg)';
            break;
        // Add more cases for different weather conditions
        default:
            backgroundUrl = 'url(https://i.pinimg.com/564x/02/44/dc/0244dca4eeb1d3d70bae2114303bb63f.jpg)';
            break;
    }

    weatherApp.style.backgroundImage = backgroundUrl;

    weatherApp.style.backgroundSize = 'cover';
    weatherApp.style.backgroundPosition = 'center';
}

// Function to fetch weather data based on user input
async function searchWeather() {
    const searchBar = document.getElementById('search-bar');
    const location = searchBar.value;
    if (location) {
        try {
            const weatherData = await fetchWeather(location);
            updateWeather(weatherData);

            const forecastData = await fetchForecast(location);
            updateForecast(forecastData);

            document.querySelector('.error-message').innerText = '';
        } catch (error) {
            document.querySelector('.error-message').innerText = error.message;
        }
    }
}

// Function to detect user's location
function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                const data = await response.json();
                updateWeather(data);

                const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
                const forecastData = await forecastResponse.json();
                updateForecast(forecastData);

                document.querySelector('.error-message').innerText = '';
            } catch (error) {
                document.querySelector('.error-message').innerText = error.message;
            }
        });
    } else {
        document.querySelector('.error-message').innerText = 'Geolocation is not supported by this browser.';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Paris'; // Set a default location
    searchWeather(defaultLocation);

    document.getElementById('search-icon').addEventListener('click', searchWeather);
    document.getElementById('search-bar').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchWeather();
        }
    });

    detectLocation();
});
