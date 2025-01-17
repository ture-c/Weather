const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "470a0a56f919b94cb219c27e0cbf8140";

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message || "An unexpected error occurred.");
        }
    } else {
        displayError("Please enter a city.");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    const data = await response.json();
    adjustBackgroundBasedOnTime(data); // Adjust background after fetching weather data
    return data;
}

function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;

    card.textContent = "";
    card.style.display = "flex";
    card.classList.remove("show");

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp.toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    setTimeout(() => {
        card.classList.add("show");
    }, 100);
}

function displayError(message) {
    card.textContent = "";
    card.style.display = "flex";
    card.classList.remove("show");

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);

    setTimeout(() => {
        card.classList.add("show");
    }, 100);
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case weatherId >= 200 && weatherId < 300:
            return "⛈️"; // Thunderstorms
        case weatherId >= 300 && weatherId < 500:
            return "🌧️"; // Drizzle
        case weatherId >= 500 && weatherId < 600:
            return "🌦️"; // Rain
        case weatherId >= 600 && weatherId < 700:
            return "❄️"; // Snow
        case weatherId >= 700 && weatherId < 800:
            return "🌫️"; // Atmosphere (fog, mist)
        case weatherId === 800:
            return "☀️"; // Clear
        case weatherId > 800 && weatherId < 900:
            return "☁️"; // Clouds
        default:
            return "❓"; // Unknown
    }
}

function adjustBackgroundBasedOnTime(data) {
    const { sys: { sunrise, sunset }, timezone } = data;

    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

    const localTime = utcTime + timezone * 1000; // Adjust UTC to local time
    const sunriseTime = new Date((sunrise + timezone) * 1000);
    const sunsetTime = new Date((sunset + timezone) * 1000);

    let timeOfDay;
    if (localTime < sunriseTime.getTime()) {
        timeOfDay = "night";
    } else if (localTime >= sunriseTime.getTime() && localTime < sunriseTime.getTime() + 3 * 60 * 60 * 1000) {
        timeOfDay = "morning";
    } else if (localTime >= sunriseTime.getTime() + 3 * 60 * 60 * 1000 && localTime < sunsetTime.getTime()) {
        timeOfDay = "noon";
    } else if (localTime >= sunsetTime.getTime() && localTime < sunsetTime.getTime() + 3 * 60 * 60 * 1000) {
        timeOfDay = "evening";
    } else {
        timeOfDay = "night";
    }

    document.body.className = timeOfDay; // Apply the appropriate class
}
