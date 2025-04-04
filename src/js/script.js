'use strict';

import {content, controlDomElements, todayWeatherDomElements, weatherThreeDaysDomElements, mapDomElements} from "./dom.js"

const API_KEY = import.meta.env.VITE_API_KEY;
let city = "Minsk";
if (!window.localStorage.getItem("city")) {
    city = "Minsk";
window.localStorage.setItem("city", "Minsk")
} else {
    city = window.localStorage.getItem("city");
}






function getTodayWeather(curLangue, typeTemp = "metric", newCity = city) {
    city = newCity
    window.localStorage.setItem("city", newCity)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`;



    fetch(url)
    .then(response => {
        if (!response.ok) {
            // Если статус ответа не OK, выбрасываем ошибку
            alert("Город не найден или ошибка в запросе.")
            throw new Error("Город не найден или ошибка в запросе.");
            
        }
        return response.json();
    })
    .then(data => {
        const countryCode = data.sys.country;
        const countryName = new Intl.DisplayNames([curLangue], { type: "region" }).of(countryCode);

        // Получаем смещение часового пояса
        const timezoneOffset = data.timezone; // В секундах
        const localTime = new Date(Date.now() + timezoneOffset * 1000);

        // Форматируем дату и время
        const options = { 
            weekday: "short", // "Thu" → "Чт" (если ru)
            day: "numeric", 
            month: "long", // "March" → "Март"
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: false, // Для 24-часового формата
            timeZone: "UTC"
        };
        const formattedDate = localTime.toLocaleDateString(curLangue, options).split(" ");
        formattedDate.splice(3, 1)  // удаляем из массива "at"
        formattedDate[0] = formattedDate[0].replace(",", "")  // Удаляем запятую после названия недели


        const date = new Date().toLocaleDateString("en-US", options);
        date.replace(" ", ", ")

        // Получаем код иконки
        const iconCode = data.weather[0].icon; 
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Ссылка на иконку


        todayWeatherDomElements.city.innerText = data.name
        todayWeatherDomElements.country.innerText = countryName

        // Меняю язык у названия города
        console.log(todayWeatherDomElements.city.innerText);
        fetch(`http://localhost:3000/geonames?city=${todayWeatherDomElements.city.innerText}&lang=${window.localStorage.getItem("language").toLowerCase()}`)
        .then(response => response.json())
        .then(dataCity => {
            todayWeatherDomElements.city.innerText = dataCity.geonames[0].name
        }) 
        .catch(error => console.error("Ошибка:", error));


    

        todayWeatherDomElements.todayDate.innerText = `${formattedDate[0]} ${formattedDate[2]} ${formattedDate[1]}`
        todayWeatherDomElements.todayTime.innerText = formattedDate[3] 

        todayWeatherDomElements.numTemperatureToday.innerText = Math.floor(data.main.temp)

        todayWeatherDomElements.weatherCondition.innerText = data.weather[0].description

        todayWeatherDomElements.perceivedTemperatureNum.innerText = Math.floor(data.main.feels_like)

        todayWeatherDomElements.windSpeedNum.innerText = data.wind.speed

        todayWeatherDomElements.humidityNum.innerText = data.main.humidity


        todayWeatherDomElements.weatherIcon.src = iconUrl;
        todayWeatherDomElements.weatherIcon.alt = data.weather[0].description;


        window.localStorage.setItem("latitude", data.coord.lat)
        window.localStorage.setItem("longitude", data.coord.lon)

        initMap(window.localStorage.getItem("latitude"), window.localStorage.getItem("longitude"));



        // console.log(data);
        // console.log(`Температура в ${data.sys.country} ${data.name}: ${data.main.temp}°C`);

    })
    .catch(error => console.error("Ошибка:", error));
}

// getTodayWeather("en")


// getTodayWeather("en", "metric", "minsk")
// getTodayWeather("ru", "metric", "moscow")
// getTodayWeather("ru", "metric", "mekka")
getTodayWeather(window.localStorage.getItem("language"), window.localStorage.getItem("curTypeTemp"), window.localStorage.getItem("city"))

function getThreeDaysWeather(curLangue, typeTemp = "metric", newCity = city) {
city = newCity
window.localStorage.setItem("city", newCity)

const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            // Если статус ответа не OK, выбрасываем ошибку
            throw new Error("Город не найден или ошибка в запросе.");
        }
        return response.json();
    })
    .then(data => {
        // Текущая дата
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Фильтруем прогноз на 12:00 по местному времени
        const dailyForecasts = data.list.filter(entry => entry.dt_txt.includes("12:00:00"));

        // Функция для форматирования даты
        function formatDay(dt_txt, lang) {
            const date = new Date(dt_txt);
            return date.toLocaleDateString(lang, { weekday: "short" }); // Выводит "Tue", "Wed" и т. д.
        }


        // Извлекаем прогноз на 3 дня вперёд
        const tomorrowData = dailyForecasts[1];     // Завтра (первый после сегодняшнего)
        const afterTomorrowData = dailyForecasts[2];    // Послезавтра
        const thirdDayData = dailyForecasts[3];

        // Данные на завтра
        const tomorrowDay = formatDay(tomorrowData.dt_txt, curLangue);
        const tomorrowTemp = Math.round(tomorrowData.main.temp);
        const tomorrowIcon = `https://openweathermap.org/img/wn/${tomorrowData.weather[0].icon}@2x.png`;

        // Данные на послезавтра
        const afterTomorrowDay = formatDay(afterTomorrowData.dt_txt, curLangue);
        const afterTomorrowTemp = Math.round(afterTomorrowData.main.temp);
        const afterTomorrowIcon = `https://openweathermap.org/img/wn/${afterTomorrowData.weather[0].icon}@2x.png`;

        // Данные на после-послезавтра
        const thirdDay = formatDay(thirdDayData.dt_txt, curLangue);
        const thirdDayTemp = Math.round(thirdDayData.main.temp);
        const thirdDayIcon = `https://openweathermap.org/img/wn/${thirdDayData.weather[0].icon}@2x.png`;


        // Выводим данные в HTML

        // На завтра
        weatherThreeDaysDomElements.tomorrowDayEl.querySelector(".day__day-week").innerText = tomorrowDay
        weatherThreeDaysDomElements.tomorrowDayEl.querySelector(".day__num-temperature").innerText = tomorrowTemp
        weatherThreeDaysDomElements.tomorrowDayEl.querySelector(".day__weather-icon").src = tomorrowIcon

        // На послезавтра
        weatherThreeDaysDomElements.afterTomorrowDayEl.querySelector(".day__day-week").innerText = afterTomorrowDay
        weatherThreeDaysDomElements.afterTomorrowDayEl.querySelector(".day__num-temperature").innerText = afterTomorrowTemp
        weatherThreeDaysDomElements.afterTomorrowDayEl.querySelector(".day__weather-icon").src = afterTomorrowIcon

        // На после-послезавтра
        weatherThreeDaysDomElements.thirdDayEl.querySelector(".day__day-week").innerText = thirdDay
        weatherThreeDaysDomElements.thirdDayEl.querySelector(".day__num-temperature").innerText = thirdDayTemp
        weatherThreeDaysDomElements.thirdDayEl.querySelector(".day__weather-icon").src = thirdDayIcon


    })

    .catch(error => console.error("Ошибка:", error));
}   



getThreeDaysWeather("en")





let map
function initMap(lat, lon) {
    // Удаляем старую карту, если она уже существует
    if (map) {
        map.remove(); // Удаляем старую карту, чтобы избежать наложений
    }

    // Создаём карту и устанавливаем координаты
    map = L.map("map").setView([lat, lon], 10);


    // Добавляем слой карты CartoDB с локализацией
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>',
    }).addTo(map);

    // Добавляем метку города
    L.marker([lat, lon]).addTo(map)
        .bindPopup("Выбранный город")
        .openPopup();



    // Преобразуем координаты в формат градусов, минут, секунд. Затем вписываем их в HTML
    mapDomElements.latitude.innerText = convertToDMS(lat)
    mapDomElements.longitude.innerText = convertToDMS(lon)
}


// Функция для преобразования координат в формат градусов, минут, секунд
function convertToDMS(coord) {
    const degrees = Math.floor(coord);  // Целые градусы
    const minutesFloat = (coord - degrees) * 60;  // Остаток, умноженный на 60
    const minutes = Math.floor(minutesFloat);  // Целые минуты
    const seconds = Math.round((minutesFloat - minutes) * 60);  // Оставшиеся секунды
  
    return `${degrees}°${minutes}'${seconds}"`;  // Форматируем строку
}





export {getTodayWeather, getThreeDaysWeather, initMap}