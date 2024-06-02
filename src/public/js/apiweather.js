const
    temp = document.getElementById("temp"),
    currentTime = document.getElementById("currentTime"),
    currentDates = document.querySelectorAll(".getDate"),
    tomorrowDate = document.getElementById("tomorrow"),
    currentLocations = document.querySelectorAll(".currentLocation"),
    condition = document.getElementById("condition"),
    condition_tomorrow = document.getElementById("condition_tomorrow"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("mainIcon"),
    tempMin = document.getElementById("tempMin"),
    tempMax = document.getElementById("tempMax"),
    tempMin_tomorrow = document.getElementById("tempMin_tomorrow"),
    tempMax_tomorrow = document.getElementById("tempMax_tomorrow"),
    wind = document.getElementById("wind"),
    wind_tomorrow = document.getElementById("wind_tomorrow"),
    humidity = document.getElementById("humidity"),
    humidity_tomorrow = document.getElementById("humidity_tomorrow"),
    visibility = document.getElementById("visibility"),
    visibility_tomorrow = document.getElementById("visibility_tomorrow"),
    uvIndex = document.getElementById("uvIndex"),
    uvIndex_tomorrow = document.getElementById("uvIndex_tomorrow"),
    weatherCards = document.getElementById("weatherCards"),
    todayIcon = document.getElementById("todayIcon"),
    tomorrowIcon = document.getElementById("tomorrowIcon")
    
// get day name
function getDayName(date) {
    let day = new Date(date);
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day.getDay()];
}

// function convert 24h format to 12h format
function hourFormat(time) {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    let period = (hours >= 12) ? 'PM' : 'AM';

    if (hours == 0) {
        hours = 12; 
    } else if (hours > 12) {
        hours -= 12;
    }
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    return `${hours}:${minutes} ${period}`;
}

//function format api data date
function formatDate(dateStr) {
    let date = new Date(dateStr);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        ];
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
    let dayName = days[date.getDay()];
    let monthName = months[date.getMonth()];
    let day = date.getDate();

    let formattedDate = `${dayName}, ${monthName} ${day}`
    return formattedDate;
}

// fetch api to get data
function getWeatherData(location, type) {
    let apiUrl;
    const apiKey = "ddfa21fa3e2c4ef598d112816240805";
    if (type === "city") {
        const city = location;
        apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`
    } else if (type === "coords") {
        const [lat, lon] = location;
        apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`
    } else {
        console.error("Invalid type provided. Please use 'city' or 'coords'.");
        return;
    }

    fetch(apiUrl,
    {
        method: "GET",
    }
    )
    .then((response) => response.json())
    .then((data) => {
        displayCurrentWeather(data);
        displayHourly(data.forecast.forecastday[0].hour)
        displayWeekly(data.forecast.forecastday, data.forecast.forecastday)
        changeBackground(data.current.condition.text)
        changeWeekBackground(data.forecast.forecastday[1].day.condition.text)
    console.log(data);
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    })
}

// get current location by coords 
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherData([latitude, longitude], "coords");
            console.log(latitude, longitude)
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}
getLocation();

// display current, today and tomorrow weather forecast
function displayCurrentWeather(data) {
    //clear previous content 
    let current = data.current;
    let forecast = data.forecast;
    let today = forecast.forecastday[0];
    let tomorrow = forecast.forecastday[1];
    if (data.cod === '404') {
        console.log(data.message);
    } else {
    currentLocations.forEach(function(currentLocation) {
        currentLocation.innerText = data.location.name;
    })

    let datetime = data.location.localtime;
    console.log(datetime);
    let [date, time] = datetime.split(' ');
    currentTime.innerText = hourFormat(time);
    currentDates.forEach(function(currentDate) {
        currentDate.innerText = formatDate(date);
    })
    tomorrowDate.innerText = formatDate(tomorrow.date);
    temp.innerHTML = current.temp_c.toFixed(0) + "<span>&#176;</span>";
    condition.innerText = getCondition(today.day.condition.text, today.day.is_day);
    condition_tomorrow.innerText = getCondition(tomorrow.day.condition.text, tomorrow.day.is_day)
    tempMin.innerHTML = today.day.mintemp_c.toFixed(0) + "<span>&#176;</span>/&nbsp;";
    tempMax.innerHTML = today.day.maxtemp_c.toFixed(0) + "<span>&#176;</span>";
    tempMin_tomorrow.innerHTML = tomorrow.day.mintemp_c.toFixed(0) + "<span>&#176;</span>/&nbsp;";
    tempMax_tomorrow.innerHTML = tomorrow.day.maxtemp_c.toFixed(0) + "<span>&#176;</span>";
    rain.innerText = current.precip_mm + " mm";
    wind.innerText = today.day.maxwind_kph;
    wind_tomorrow.innerText = tomorrow.day.maxwind_kph;
    humidity.innerText = today.day.avghumidity;
    humidity_tomorrow.innerText = tomorrow.day.avghumidity;
    uvIndex.innerText = today.day.uv;
    uvIndex_tomorrow.innerText = tomorrow.day.uv;
    visibility.innerText = today.day.avgvis_km;
    visibility_tomorrow.innerText = tomorrow.day.avgvis_km;
    mainIcon.src = getIcon(current.condition.text, current.is_day);
    todayIcon.src = getIcon(today.day.condition.text, today.day.is_day);
    tomorrowIcon.src = getIcon(tomorrow.day.condition.text, tomorrow.day.is_day);

    }

}
// new conditions: Sunny, Clear, Partly Cloudy Night-Day, Cloudy Night-Day, 
// Overcast, Foggy, Rain Night-Day, Snow Night-Day, Rain & Thunder, Snow & Thunder
function getCondition(conditionText, isDaytime) {   
    let condition = conditionText.trim().toLowerCase();

    if (condition === "sunny" ) {
        return "Sunny";
    } else if(condition === "clear") {
        return "Clear";
    }
    else if(condition === "partly cloudy") {
        if (typeof isDaytime === 'undefined') {
            return "Partly Cloudy";
        } else {
            return isDaytime ? "Partly Cloudy Day": "Partly Cloudy Night" ;
        }
    }
    else if(condition === "cloudy") {
        if (typeof isDaytime === 'undefined') {
            return "Cloudy";
        } else {
            return isDaytime ? "Cloudy Day": "Cloudy Night";
        }
    }
    else if(condition === "overcast") {
        return "Overcast";
    }
    else if(condition === "mist" || condition === "fog" || condition === "freezing fog") {
        return "Foggy";
    }
    else if(condition === "patchy rain possible" || 
            condition === "patchy sleet possible" ||
            condition === "patchy freezing drizzle possible" ||
            condition === "patchy light drizzle" ||
            condition === "light drizzle" ||
            condition === "freezing drizzle" ||
            condition === "heavy freezing drizzle" ||
            condition === "patchy light rain" ||
            condition === "light rain" ||
            condition === "moderate rain at times" ||
            condition === "moderate rain" ||
            condition === "heavy rain at times" ||
            condition === "heavy rain" ||
            condition === "light freezing rain" ||
            condition === "light sleet" ||
            condition === "moderate or heavy sleet" ||
            condition === "light rain shower" ||
            condition === "moderate or heavy rain shower" ||
            condition === "torrential rain shower" ||
            condition === "light sleet showers" ||
            condition === "moderate or heavy sleet showers" ||
            condition === "moderate or heavy freezing rain" ||
            condition === "patchy rain nearby"
            )  {
        if (typeof isDaytime === 'undefined') {
            return "Rainy";
        } else {
            return isDaytime ? "Rainy Day": "Rainy Night";
            }
    }
    else if(condition === "moderate or heavy freezing" ||
            condition === "patchy light snow" ||
            condition === "patchy snow possible" ||
            condition === "light snow" ||
            condition === "patchy moderate snow" ||
            condition === "moderate snow" ||
            condition === "patchy heavy snow" ||
            condition === "heavy snow" ||
            condition === "ice pellets" ||
            condition === "light snow showers" ||
            condition === "moderate or heavy snow showers" ||
            condition === "light showers of ice pellets" ||
            condition === "moderate or heavy showers of ice pellets" ||
            condition === "blowing snow"||
            condition === "blizzard" 
    ) {
        if (typeof isDaytime === 'undefined') {
            return "Snow";
        } else {
            return isDaytime ? "Snow Day": "Snow Night";
            }
    }
    else if(condition === "patchy light rain with thunder" || 
    condition === "moderate or heavy rain with thunder" ||
    condition === "patchy light rain in area with thunder" ||
    condition === "thundery outbreaks possible" ||
    condition === "thundery outbreaks in nearby" ||
    condition === "moderate or heavy rain in area with thunder"
    ) {
        return "Rain & Thunder"
    }
    else if(condition === "patchy light snow with thunder" ||
            condition === "moderate or heavy snow with thunder" ||
            condition === "patchy light snow in area with thunder" ||
            condition === "moderate or heavy snow in area with thunder"
    ) {
        return "Snow & Thunder"
    }  
}

//custom icon day-night
function getIcon(condition, isDaytime) {

    let conditionNew = getCondition(condition,isDaytime);

    if (conditionNew === "Sunny") {
        return  "./img/7.png";
    } else if (conditionNew === "Clear") {
        return "./img/9.png";
    } else if (conditionNew === "Partly Cloudy") {
        return "./img/1.png";
    } else if (conditionNew === "Partly Cloudy Day" & isDaytime === 1) {
        return "./img/6.png";
    } else if (conditionNew === "Partly Cloudy Night" & isDaytime === 0) {
        return "./img/2.1.png";
    } else if (conditionNew === "Cloudy") {
        return "./img/8.png";
    } else if (conditionNew === "Cloudy Day" & isDaytime === 1) {
        return "img/8.png";
    } else if (conditionNew === "Cloudy Night" & isDaytime === 0) {
        return "./img/2.1.png";
    } else if (conditionNew === "Overcast") {
        return "./img/18.png";
    } else if (conditionNew === "Foggy") {
        return "./img/19.png";
    } else if (conditionNew === "Rainy") {
        return "./img/3.1.png";
    } else if (conditionNew === "Rainy Day" & isDaytime === 1) {
        return "./img/5.png";
    } else if (conditionNew === "Rainy Night" & isDaytime === 0) {
        return "./img/12.png";
    } else if (conditionNew === "Snow") {
        return "./img/10.png";
    } else if (conditionNew === "Snow Day" & isDaytime === 1) {
        return "./img/14.png";
    } else if (conditionNew === "Snow Night" & isDaytime === 0) {
        return "./img/11.png";
    } else if (conditionNew === "Rain & Thunder") {
        return "./img/17.png";
    } else if (conditionNew === "Snow & Thunder") {
        return "./img/16.png";
    } 

}

// display forecast hourly for today 
function displayHourly(hourlyData) {
    const hourlyCards = document.getElementById("hourlyCards");
    hourlyCards.innerHTML = " ";
    for (let i = 0; i < 24; i++) {
        const card = document.createElement("article");
        card.classList.add("card__article", "swiper-slide");
        const timeHour = hourlyData[i].time;
        let [date, time] = timeHour.split(' ');
        const temp = hourlyData[i].temp_c.toFixed(0) + "<span>&#176;</span>";
        const feelLike = hourlyData[i].feelslike_c.toFixed(0);
        const conditions = getCondition(hourlyData[i].condition.text, hourlyData[i].is_day);
        const hourIcon = getIcon(hourlyData[i].condition.text, hourlyData[i].is_day);

        card.innerHTML = `
        <div class="card card__text_color">
            <div class="card__time"><h1 style="">${time}</h1></div>
            <div class="card__data ">
                <div class="card__image">
                    <img src="${hourIcon}" alt="image" class="card__img" id="hourIcon">
                </div>
                <div class="card__degree">
                    <h1 style="font-size: 50px;">${temp}</h1>
                </div>
                <div class="card__text hideOnTablet"><p >Feels like ${feelLike} <sup style="vertical-align: super;font-size:6px; ">0</sup></p></div>
                <div class="card__desc">
                    <p id="hour" style="margin-bottom:3px;">${conditions}</p>  
                </div>
            </div>
        </div>`;

    hourlyCards.appendChild(card);
    }
    let home_card = new Swiper(".card__content", {
        loop: true,
        spaceBetween: 28,
        grabCursor: true,

        breakpoints:{
          600: {
            slidesPerView: 2,
          },
          1239: {
            slidesPerView: 3,
          },
        },
    });   
}

// display forecast weekly 
function displayWeekly(weeklydata, hourlyData) {
    weatherCards.innerHTML = " ";
    let numCards = 7;
    let middleContent = document.createElement("div");
    middleContent.classList.add("layout");
    middleContent.id = "middleContent";
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("article");
        card.classList.add("weekly__card__article", "swiper-slide");
        let dayName = getDayName(weeklydata[i].date).toUpperCase();
        let dayTemp = weeklydata[i].day.avgtemp_c.toFixed(0) + "<span>&#176;</span>";
        let weeklyIcon = getIcon(weeklydata[i].day.condition.text, weeklydata[i].day.is_time)
        let wind = weeklydata[i].day.maxwind_kph.toFixed(0);
        let humidity = weeklydata[i].day.avghumidity;
        let visibility = weeklydata[i].day.avgvis_km;
        let uvIndex = weeklydata[i].day.uv;
        let middleContentHTML = `<div class="grid wide">
        <div class="row">`;
            // find temperature and icon for each time
            for(let k = 0; k < hourlyData[i].hour.length; k+=4) {
                let hour = new Date(hourlyData[i].hour[k].time_epoch * 1000).getHours();
                let tempHour = hourlyData[i].hour[k].temp_c.toFixed(0) + "<span>&#176;</span>";
                let iconHour = getIcon(hourlyData[i].hour[k].condition.text, hourlyData[i].hour[k].is_day);
                formattedHour = hour.toString().padStart(2, '0');
                middleContentHTML += `
                <div class="col l-2 m-4 c-2" style="padding:6px;">
                    <div class="card__middle__content">
                        <div class="card__middle__desc">
                            <h4>${formattedHour}:00</h4>
                        </div>
                        <div class="card__middle__logo">
                            <img src="${iconHour}">
                        </div>
                        <div class="card__middle__desc">
                            <h4 style="font-size: 16px;">${tempHour}</h4>
                        </div>
                    </div>
                </div>`;
            }
        middleContentHTML += `</div>
        </div>`;

         middleContent.innerHTML = middleContentHTML;

        card.innerHTML = `
        <div class="card__top">
                                        <div class="article__header">
                                            <div class="article__header__item"><img src="img/menu.png"></div>
                                            <div class="article__header__item" ><h1 style="font-size:22px; color:#fff;">${dayName}</h1></div>
                                            <div class="article__header__item"></div>
                                        </div>
                                        <div class="article__icon">
                                            <div class="article__icon__img">
                                                <img src="${weeklyIcon}" alt="icon">
                                            </div>
                                        </div>
                                        <div class="article__icon__desc">
                                            <h3 style="font-size: 55px;">${dayTemp}</h3>
                                        </div>
                                        
                                    </div>

                                    <div class="card__middle" onmouseover="showOverlay(this)" onmouseout="hideOverlay(this)">
                                        ${middleContent.outerHTML}
                                        <div class="overlay_details" id="overlay_details">
                                           <div class="card__middle-2">
                                                <div class="layout-2">
                                                    <div class="layout__item-1">
                                                <div class="layout-2__icon"> <img src="/img/wind.png"></div>
                                                <div class="layout-2__desc"><h1>Wind</h1></div>
                                                <div class="layout-2__index"><h1>${wind} kph</h1></div>
                                                    </div>
                                                    <div class="layout__item-2">
                                                <div class="layout-2__icon">
                                                    <img src="/img/humidity.png">
                                                </div>
                                                <div class="layout-2__desc">
                                                    <h1>Humidity</h1>
                                                </div>
                                                <div class="layout-2__index">
                                                    <h1>${humidity} %</h1>
                                                </div>     
                                                    </div>
                                                    <div class="layout__item-3">
                                                <div class="layout-2__icon"><img src="/img/visibility.png"></div>
                                                <div class="layout-2__desc"><h1>Visibility</h1></div>
                                                <div class="layout-2__index"><h1>${visibility} km</h1></div>   
                                                    </div>
                                                    <div class="layout__item-4">
                                                <div class="layout-2__icon"><img src="/img/air.png"></div>
                                                <div class="layout-2__desc"><h1>Air Qualiity</h1></div>
                                                <div class="layout-2__index"><h1>${uvIndex}</h1></div>      
                                                    </div> 
                                                 </div> 

                                            </div>
                                        </div>
                                    </div>
        `;
        weatherCards.appendChild(card);
    }

let weekly_card = new Swiper(".weekly__card__content", {
        loop: true,
        spaceBetween: 50,
        grabCursor: true,
      
        breakpoints:{
          575: {
            slidesPerView: 2,
          },
          1239: {
            slidesPerView: 3,
          },
        },
});

}

// function to handle search location
function searchCityName() {
    const searchInput = document.querySelector(".search_input").value;
    if (searchInput) {
        getWeatherData(searchInput.trim(), "city");
    } else {
        console.error("Please enter a valid city name.");
    }
}

document.querySelector(".search_icon").addEventListener("click", searchCityName);

document.querySelector(".search_input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchCityName();
    }
})

// change background for different conditions
function changeBackground(condition) {
    const mainBg = document.querySelector(".main_content");
    const weekBg = document.querySelector(".weekly");
    let conditionNew = getCondition(condition);
    let bg = "";
    let bgweek = "";

    switch (conditionNew) {
        case "Sunny":
            bg = "/img/sunset-bg10.jpg";
            bgweek = "/img/sunset-bg10.jpg";
        break;
        case "Clear":
            bg = "/img/bg-contact1.jpg";
            bgweek = "/img/bg-contact1.jpg";
        break;
        case "Partly Cloudy":
            bg = "/img/partly-cloudy.jpg";
            bgweek = "/img/partly-cloudy.jpg";
        break;
        case "Cloudy":
            bg = "/img/cloudy-bg.jpg";
            bgweek = "/img/cloudy-bg.jpg";
        break;
        case "Overcast":
            bg = "/img/overcast.jpg";
            bgweek = "/img/overcast.jpg";
        break;
        case "Foggy":
            bg = "/img/foggy.jpg";
            bgweek = "/img/foggy.jpg";
        break;
        case "Rainy":
            bg = "/img/rain.jpg";
            bgweek = "/img/rain.jpg";
        break;
        case "Snow":
            bg = "/img/mainbackground.png";
        break;

        case "Rain & Thunder":
            bg = "/img/rain-thunder.jpg";
        break;

        case "Snow & Thunder":
            bg = "/img/snow-thunder.jpg";
        break;
    }
    weekBg.style.backgroundImage = `url(${bgweek})`;
    mainBg.style.backgroundImage = `url(${bg})`;
}

function changeWeekBackground(condition) {
    const mainBg = document.querySelector(".main_content");
    const weekBg = document.querySelector(".weekly");
    let conditionNew = getCondition(condition);
    let bgweek = "";
    switch (conditionNew) {
        case "Sunny":
            bgweek = "/img/weeklybg.avif";
        break;
        case "Clear":
            bgweek = "/img/bg-contact1.jpg";
        break;
        case "Partly Cloudy":
            bgweek = "/img/sunset-bg4.jpg";
        break;
        case "Cloudy":
            bgweek = "/img/cloudyweek.jpg";
        break;
        case "Overcast":
            bgweek = "/img/overcast.jpg";
        break;
        case "Foggy":
            bgweek = "/img/foggy.jpg";
        break;
        case "Rainy":
            bgweek = "/img/rainweek.jpg";
        break;
        case "Snow":
            bgweek = "/img/bgweek2.jpg";
        break;

        case "Rain & Thunder":
            bgweek = "/img/rain-thunder.jpg";
        break;

        case "Snow & Thunder":
            bgweek = "/img/snow-thunder.jpg";
        break;
    }
    weekBg.style.backgroundImage = `url(${bgweek})`;
}

// function getCityImage(cityName) {
//     const apiKey = '7r5sAIz41f7zhlWfldnnNKJaOhkePL-7B_gCuQ_OKxc';
//     fetch( `https://api.unsplash.com/search/photos?page=1&query=${cityName}&client_id=${apiKey}`,
//     {
//         method: "GET",
//     }
//     )
//     .then (response => response.json())
//     .then (data => {
//         console.log(data)
//         updateCityData(cityName, data.results);
//         renderCityImages();
//     })
//     .catch(error => {
//         console.error('Error fetching image data:', error);
//     })
// }


