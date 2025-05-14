const apiKey = "f00c38e0279b7bc85480c3fe775d518c";

function weatherFn(city) {
    city = city.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    $.getJSON(url, function (data) {
        $('#weather-info').show();

        // Show current city and date
        $('#city-name').text(`${data.city.name}, ${data.city.country}`);
        $('#date').text(moment().format("dddd, MMMM Do YYYY"));

        // Get today's 12:00 PM data for icon and details
        const todayData = data.list.find(item => item.dt_txt.includes("12:00:00"));
        if (todayData) {
            $('#weather-icon').attr("src", `https://openweathermap.org/img/wn/${todayData.weather[0].icon}@2x.png`).show();
            $('#temperature').text(`Temperature: ${todayData.main.temp} °C`);
            $('#description').text(`Condition: ${todayData.weather[0].description}`);
            $('#wind-speed').text(`Wind Speed: ${todayData.wind.speed} m/s`);
        }

        // Remove previous forecast
        $('#forecast-container').remove();

        // Get next 5 days of 12:00 PM forecast
        const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

        let forecastHTML = '<div id="forecast-container">';
        dailyData.forEach(item => {
            forecastHTML += `
                <div class="forecast-card">
                    <p><strong>${moment(item.dt_txt).format("dddd")}</strong></p>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Icon">
                    <p>${item.main.temp} °C</p>
                    <p>${item.weather[0].description}</p>
                    <p>Wind: ${item.wind.speed} m/s</p>
                </div>
            `;
        });
        forecastHTML += '</div>';
        $('#weather-info').append(forecastHTML);

    }).fail(function () {
        alert("City not found! Please check the spelling.");
        $('#weather-info').hide();
    });
}

// 🔑 Add this block to handle keypress event
$(document).ready(function () {
    $('#city-input').keypress(function (e) {
        if (e.which === 13) { // 13 = Enter key
            const city = $(this).val();
            weatherFn(city);
        }
    });
});
