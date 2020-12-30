$(document).ready(function () {

    // INSERT YOUR API KEY HERE
    // ==================================================
    var API_KEY = "";
    // ==================================================

    $('#CurrentCondition').hide();
    $('#FiveDayForecast').hide();
    $('#dropdownMenuButton').text("imperial");

    $('#GetWeatherButton').on('click', function() {
        var zipcode = $('#Zipcode').val();
        var units= $('#dropdownMenuButton').text();

        showCurrentWeather(zipcode,API_KEY,units);
        showForecast(zipcode,API_KEY,units);
        $('#CurrentCondition').show();
        $('#FiveDayForecast').show();
    });

    $('.dropdown-menu a').click(function(){
        $('#dropdownMenuButton').text($(this).text());
    });




});



function showForecast(zipcode, key, units="imperial", courtryCode="us"){
    var FORECAST_URL = 'http://api.openweathermap.org/data/2.5/forecast?zip='+zipcode+','+courtryCode+'&appid='+key+ '&units=' + units;
    $.ajax({
        type: 'GET',
        url: FORECAST_URL,
        success: function(forecastArray) {
            var forecastDiv = $('#forecastDiv');
            var nb_days = 0;
            var forecast_time;
            var reference_time;

            var forecastInfo = "<table class='table' width='100%'>";
            forecastInfo += "<tr>";

            var temperature_unit;
            if(units === "imperial"){
                temperature_unit = "°F";
            }
            if(units === "metric"){
                temperature_unit = "°C";
            }

            //Beneath the content block header should be 5 columns of data with a similar format.
            $.each(forecastArray.list, function(index,forecast){

                forecast_time = forecast.dt_txt.split(" ")[1];

                if(index==0){
                    reference_time = forecast_time;
                }

                if(forecast_time===reference_time && nb_days<5){
                    nb_days = nb_days+1;
                    var forecast_date = forecast.dt_txt.split(" ")[0].split("-");
                    var day = forecast_date[2];
                    var month = monthConvert(parseInt(forecast_date[1]));

                    forecastInfo += '<td width="20%">';
                    //Each column should have a top line consisting of a date formatted like "3 August".
                    forecastInfo += "<div class='text-center'>";
                    forecastInfo += day + " " + month;
                    forecastInfo += "</div>";
                    //Beneath the date, an icon for the weather type and description should appear.
                    var icon_url = "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png";

                    forecastInfo += "<div>";
                    forecastInfo += "<img src='" + icon_url + "' + class='rounded float-left py-1'>";
                    forecastInfo += "<p class='align-middle py-3'>";
                    forecastInfo +=  forecast.weather[0].description;
                    forecastInfo += "</p>";
                    forecastInfo += "</div>";

                    //Beneath the icon, the high and low temperatures should be listed with the proper units (C or F).
                    forecastInfo += "<div width='100%' class='text-center'>";

                    forecastInfo += "<span>";
                    forecastInfo += "H:";
                    forecastInfo += forecast.main.temp_max;
                    forecastInfo += temperature_unit;
                    forecastInfo += "</span>";


                    forecastInfo += "<span>";
                    forecastInfo += " L:";
                    forecastInfo += forecast.main.temp_min;
                    forecastInfo += temperature_unit;
                    forecastInfo += "</span>";

                    forecastInfo += "</div>";

                    forecastInfo += '</td>';

                }
            })
            forecastInfo += "</tr></table>";
            forecastDiv.html(forecastInfo);
        },
        error: function() {
            $('#forecastDiv').html("");
            alert('FAILURE!');
        }
    })

}

function monthConvert(m){
    var month;
    switch (m) {
        case 1:
            month = "January";
            break;

        case 2:
            month = "February";
            break;

        case 3:
            month = "March";
            break;

        case 4:
            month = "April";
            break;

        case 5:
            month = "May";
            break;

        case 6:
            month = "June";
            break;

        case 7:
            month = "July";
            break;

        case 8:
            month = "August";
            break;

        case 9:
            month = "September";
            break;

        case 10:
            month = "October";
            break;

        case 11:
            month = "November";
            break;

        case 12:
            month = "December";
            break;


        default:
            month = "Unknown";
    }

    return month;
}


function showCurrentWeather(zipcode, apikey, units="imperial", courtryCode="us") {

    $('#errorMessages').empty();
    var TempUnit, HumidUnit, WindUnit;
    if(units === "imperial"){
        TempUnit = " F";
        HumidUnit = " %";
        WindUnit = " miles/hour";
    }
    else{
        TempUnit = " °C";
        HumidUnit = " %";
        WindUnit = " kilometers/hour";
    }


    $.ajax({
        type: 'GET',

        url: 'https://api.openweathermap.org/data/2.5/weather?' + 'zip=' + zipcode + ',' + courtryCode + '&appid=' + apikey + '&units=' + units,

        success: function(data, status) {
            $('#cityName').html("Current Conditions in " + data.name);
            $('#currentWeatherDiscription').html(data.weather[0].description);
            $('#currentTemperature').html("Temperature: " + data.main.temp + TempUnit);
            $('#currentHumidity').html("Humidity: " + data.main.humidity + HumidUnit);
            $('#currentWind').html("Wind: " + data.wind.speed + WindUnit);
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
