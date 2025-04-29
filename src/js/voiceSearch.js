'use strict';

import {
    controlDomElements,
} from './dom.js';



// Проверяем поддержку браузером Web Speech API
const speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (speechRecognition) {
    const recognition = new speechRecognition();

    recognition.interimResults = false; // Не показывать промежуточные результаты
    recognition.maxAlternatives = 1; // Одна лучшая альтернатива результата

    // При нажатии на кнопку микрофона запускаем распознавание речи
    controlDomElements.searchCityIcon.addEventListener('click', () => {
        // Устанавливаем язык для распознавания речи
        recognition.lang = `${window.localStorage.getItem('language').toLowerCase()}-${window.localStorage.getItem('language')}`;
        console.log(
            `${window.localStorage.getItem('language').toLowerCase()}-${window.localStorage.getItem('language')}`
        );
        recognition.start();
        controlDomElements.searchCityInput.value = '🎙️ Говорите...';
    });

    // Обработчик события успешного распознавания
    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript.trim(); // Распознанный текст
        controlDomElements.searchCityInput.value = transcript; // Вставляем текст в инпут
        console.log('Распознанный текст:', transcript);
        recognition.stop(); // Останавливаем распознавание

        // Автоматически запускаем поиск после распознавания
        controlDomElements.searchCityButton.click();
    });

    // Обработчик ошибки
    recognition.addEventListener('error', (event) => {
        console.error('Ошибка распознавания:', event.error);
        alert('Ошибка распознавания речи. Попробуйте снова.');
        controlDomElements.searchCityInput.value = '🎤';
    });
} else {
    console.warn('Web Speech API не поддерживается в этом браузере');
    alert('Ваш браузер не поддерживает голосовой ввод 😢');
}
