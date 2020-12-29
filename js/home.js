$(document).ready(function () {
    showCurrentWeather(36513);
});

function showCurrentWeather(zipcode, units="imperial", courtryCode="us") {
    $('#errorMessages').empty();

    $.ajax({
        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?' + 'zip=' + zipcode + ',' + courtryCode + '&appid=' + '&units=' + units,
        success: function(data, status) {
            $('#cityName').html(data.name);
            $('#currentWeatherDiscription').html(data.weather[0].description);
            $('#currentTemperature').html(data.main.temp);
            $('#currentHumidity').html(data.main.humidity);
            $('#currentWind').html(data.wind.speed);
            $('#currentWeatherImage').attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                    .attr({class: 'list-group-item list-group-item-danger'})
                    .text('Error calling web service. Please try again later.'));
        }
    });
    $('#currentWeatherFormDiv').show();
}
