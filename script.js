const form = document.getElementById('coordinatesForm');
const output = document.getElementById('output');
const background = document.getElementById('background');
const apiKey = '00f5da4657dcbde4af94af31421f375c'; // Replace with your OpenWeatherMap API key

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = document.getElementById('city').value;

    // Step 1: Fetch latitude and longitude
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    try {
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
            throw new Error(`Geolocation API error: ${geoResponse.status}`);
        }
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
            output.textContent = "City not found.";
            return;
        }
        const { lat, lon } = geoData[0];

        // Step 2: Fetch weather data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error(`Weather API error: ${weatherResponse.status}`);
        }
        const weatherData = await weatherResponse.json();
        const description = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;

        output.textContent = `Weather in ${city}: ${description}, ${temperature}°C`;

        // Step 3: Update background animation
        applyWeatherAnimation(description);
    } catch (error) {
        output.textContent = "An error occurred. Please try again.";
        console.error(error);
    }
});

function applyWeatherAnimation(description) {
    background.innerHTML = "";

    if (description.includes("clear")) {
        background.innerHTML = `<div class="sun"></div>`;
    } else if (description.includes("cloud")) {
        background.innerHTML = `
            <div class="clouds">
                <div class="cloud"></div>
                <div class="cloud"></div>
            </div>`;
    } else if (description.includes("rain")) {
        background.innerHTML = `
            <div class="rain">
                <div class="raindrop"></div>
                <div class="raindrop"></div>
                <div class="raindrop"></div>
            </div>`;
    } else if (description.includes("snow")) {
        background.innerHTML = `
            <div class="snow">
                <div class="snowflake"></div>
                <div class="snowflake"></div>
                <div class="snowflake"></div>
            </div>`;
    }
}
