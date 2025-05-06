let apiKey = "453500f3c12aeb1d3a409a33395bf97f";

function setWeatherBackground(condition) {
    let bg = "";

    switch (condition) {
        case 'Clear': bg = "url('images/clear.jpg')"; break;
        case 'Clouds': bg = "url('images/cloudy.jpg')"; break;
        case 'Rain':
        case 'Drizzle': bg = "url('images/rainy.jpeg')"; break;
        case 'Thunderstorm': bg = "url('images/stormy.jpg')"; break;
        case 'Snow': bg = "url('images/snowy.jpg')"; break;
        case 'Mist':
        case 'Fog':
        case 'Haze':
        case 'Smoke': bg = "url('images/foggy.jpg')"; break;
        case 'Dust':
        case 'Sand':
        case 'Ash': bg = "url('images/dusty.jpg')"; break;
        default: bg = "url('images/default.jpg')";
    }

    document.body.style.backgroundImage = bg;
}

function displayWeather(data, cityName) {
    const temperature = Math.round(data.main.temp);
    const condition = data.weather[0].main;
    const timezoneOffset = data.timezone; // in seconds
    const localTime = new Date((Date.now() + timezoneOffset * 1000));
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const localDateStr = localTime.toLocaleDateString('en-US', options);
    const windSpeed = Math.floor(data.wind.speed);
    const humidity = Math.floor(data.main.humidity);
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    

    document.querySelector(".city-name").innerText = cityName;
    document.querySelector(".temperature").innerText = `${temperature}°C`;
    document.querySelector(".weather-condition").innerText = condition;
    document.querySelector(".date-day-month").innerText = localDateStr
    document.querySelector(".wind").innerText = ` ${windSpeed} km/h`;
    document.querySelector(".humidity").innerText = ` ${humidity}%`;
    document.querySelector(".sunrise").innerText = ` ${sunriseTime}`;
    document.querySelector(".sunset").innerText = ` ${sunsetTime}`;

    setWeatherBackground(condition);
}

async function getWeatherByLocation() {
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            let geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
            let geoData = await geoRes.json();

            if (!geoData.length || !geoData[0].name) throw new Error("Location not found");

            let city = geoData[0].name;

            let weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
            let weatherData = await weatherRes.json();

            if (!weatherRes.ok) throw new Error(weatherData.message);

            displayWeather(weatherData, city);
        } catch (error) {
            alert("Location-based weather error: " + error.message);
        }
    }, () => {
        alert("Please allow location access and refresh.");
    });
}

async function getWeatherByCity() {
    const city = document.getElementById("searchInput").value.trim();
    if (!city) return alert("Please enter a city");

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
        if (!res.ok) {
            if (res.status === 404) {
                throw new Error("City not found. Please check the city name and try again.");
            } else {
                throw new Error("An error occurred while fetching the weather data.");
            }
        }
        const data = await res.json();
        displayWeather(data, city);
    } catch (error) {
        alert(error.message);
    }
}


window.onload = getWeatherByLocation;
