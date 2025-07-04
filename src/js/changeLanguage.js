'use strict';

import { controlDomElements, todayWeatherDomElements, mapDomElements } from './dom.js';


import { loadCityWeather } from './weatherController.js';
import { setToLocalStorage, getFromLocalStorage } from './localStorage.js';

// Сразу при запуске страницы обновляю стиль выбранного элемента на языке
controlDomElements.hiddenElementsLanguage.forEach(function (el) {
    const elNameLanguage = el.querySelector(
        '.control__hidden-element-language-name'
    );
    console.log('elNameLanguage.innerText: ', elNameLanguage.innerText);
    console.log(getFromLocalStorage('language'));
    if (elNameLanguage.innerText === getFromLocalStorage('language')) {
        el.classList.add('control__hidden-element-language_selected');
        controlDomElements.nameLanguage.innerText =
            getFromLocalStorage('language');
    } else {
        el.classList.remove('control__hidden-element-language_selected');
    }
});

const translations = {
    en: { Latitude: 'Latitude', Longitude: 'Longituded' },
    es: { Latitude: 'Latitud', Longitude: 'Longitud' },
    ru: { Latitude: 'Широта', Longitude: 'Долгота' },
};

function translate(text, lang) {
    return translations[lang][text];
}

// При изменении языка
controlDomElements.changeLanguage.addEventListener('click', (e) =>
    changeLang(e)
);
async function changeLang(e) {
    controlDomElements.hiddenListLanguages.classList.toggle(
        'hidden-by-display'
    );

    // Если клик вне скрытого меню с языками, то игнор
    if (!e.target.closest('.control__hidden-element-language')) return;

    const elementLanguage = e.target.closest(
        '.control__hidden-element-language'
    );

    // Если нажатый элемент уже был выбран, то игнор
    if (
        elementLanguage.querySelector('.control__hidden-element-language-name')
            .innerText === controlDomElements.nameLanguage.innerText
    )
        return;

    // Убираю стиль выбранного элемента и добавляю на новый выбранный
    controlDomElements.hiddenElementsLanguage.forEach(function (el) {
        el.classList.remove('control__hidden-element-language_selected');
    });
    elementLanguage.classList.add('control__hidden-element-language_selected');

    // Заменяю название языка в окне с текущим языком (тем, на который нажали)
    controlDomElements.nameLanguage.innerText = elementLanguage.querySelector(
        '.control__hidden-element-language-name'
    ).innerText;

    setToLocalStorage('language', controlDomElements.nameLanguage.innerText);

    console.log("controlDomElements.nameLanguage.innerText: ", controlDomElements.nameLanguage.innerText);
    console.log(getFromLocalStorage('language'));

    await loadCityWeather({city: getFromLocalStorage('city'), isInitialLoad: false, isCityChanged: true, currentLanguage: getFromLocalStorage('language')});
    // Меняю язык у "ширина" и "долгота"
    mapDomElements.latitudeLabel.innerText = translate(
        'Latitude',
        controlDomElements.nameLanguage.innerText.toLowerCase()
    );
    mapDomElements.longitudeLabel.innerText = translate(
        'Longitude',
        controlDomElements.nameLanguage.innerText.toLowerCase()
    );
}


function changeLanguageCityName() {
    // Меняю язык у названия города
    console.log(todayWeatherDomElements.city.innerText);

    fetch(
        `https://cors-proxy-server-0jmy.onrender.com/geonames?city=${todayWeatherDomElements.city.innerText}&lang=${getFromLocalStorage('language').toLowerCase()}`
    )
        .then((response) => response.json())
        .then((dataCity) => {
            // Проверка на наличие данных в geonames
            if (
                dataCity &&
                dataCity.geonames &&
                Array.isArray(dataCity.geonames) &&
                dataCity.geonames.length > 0
            ) {
                todayWeatherDomElements.city.innerText =
                    dataCity.geonames[0].name;
            } else {
                console.error('Ошибка: geonames не содержит данных', dataCity);
                showErrorOverlay();
            }
        })
        .catch((error) => console.error('Ошибка:', error));
}

export { changeLanguageCityName }