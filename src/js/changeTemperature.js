'use strict';

import {
    controlDomElements,
    todayWeatherDomElements,
    upcomingForecastDays,
} from './dom.js';
import { convertUnitTemp } from './utils.js';
import { setToLocalStorage, getFromLocalStorage } from './localStorage.js';

// Проставляет активный класс выбранной шкале температуры
function setActiveTemperatureType(currentTypeTemperatureName) {
    controlDomElements.typesTemperature.forEach(function (el) {
        el.classList.remove('control__type-temperature_selected-type');
    });
    const selected = controlDomElements.changeTemperature.querySelector(
        `.control__${currentTypeTemperatureName}`
    );
    selected?.classList.add('control__type-temperature_selected-type');
}

// Сразу при запуске страницы обновляю стиль выбранного элемента на шкале температуры
setActiveTemperatureType(getFromLocalStorage('currentTypeTemperatureName'));

// При смене шкалы температуры
controlDomElements.changeTemperature.addEventListener('click', function (e) {
    const button = e.target.closest('.control__type-temperature');
    // Если клик вне элемента с типом температуры ИЛИ нажатый элемент уже был выбран, то игнор
    if (
        !button ||
        button.classList.contains('control__type-temperature_selected-type')
    )
        return;

    // Определения названия выбранной шкалы (которое нужно будет передать в функцию для api)
    const isFahrenheit = button.classList.contains('control__faringate');
    const currentTypeTemperature = isFahrenheit ? 'imperial' : 'metric';
    const currentTypeTemperatureName = isFahrenheit ? 'faringate' : 'celsius';

    // Обновляю html стиль выбранной температуры, данные в localstorage и саму вписанную температуру (перевожу в нужную шкалу)
    setActiveTemperatureType(currentTypeTemperatureName);

    setToLocalStorage('currentTypeTemperature', currentTypeTemperature);
    setToLocalStorage('currentTypeTemperatureName', currentTypeTemperatureName);

    console.log(currentTypeTemperature);
    console.log(currentTypeTemperatureName);

    convertDisplayTemp();
});

// Функция для смены показа температуры на странице
function convertDisplayTemp() {
    todayWeatherDomElements.numTemperatureToday.innerText = convertUnitTemp(
        getFromLocalStorage('tempTodayC')
    );
    todayWeatherDomElements.perceivedTemperatureNum.innerText = convertUnitTemp(
        getFromLocalStorage('tempfeelsLikeC')
    );

    console.log(getFromLocalStorage('tempTodayC'));
    console.log(getFromLocalStorage('tempfeelsLikeC'));

    const arrDays = getFromLocalStorage('tempOtherDays');
    console.log("arrDays: ", arrDays);
    upcomingForecastDays.forEach(function (day) {
        day.querySelector('.day__num-temperature').innerText = convertUnitTemp(
            arrDays.shift()
        );
        console.log("day: ", day);
    });
    console.log("arrDays: ", arrDays);
    console.log("upcomingForecastDays: ", upcomingForecastDays);
}
