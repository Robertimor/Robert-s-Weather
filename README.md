# Robert's Weather

**Адаптивное приложение прогноза погоды**, разработанное на чистом JavaScript, Vite и Leaflet.

Особенности:
- **Текущая погода**: температура, описание, «ощущается как», скорость ветра, влажность (API OpenWeatherMap)
- **Прогноз на 3 дня** (с данными на 12:00)
- **Интерактивная карта** выбранного города (Leaflet + OpenStreetMap)
- **Динамический фон**: изображения Unsplash, кешируются для минимизации запросов
- **Переключение языка** названия городов (через GeoNames-прокси) и UI
- **Переключение шкалы температуры** (°C / °F)
- **Адаптивная верстка** для десктопов, планшетов и мобильных

---

## 📂 Структура проекта
```
src/
  css/
    base/                  # Сброс стилей и базовые настройки
    control.css            # Стили панели управления
    today_weather.css      # Стили секции текущей погоды
    weather_three_days.css # Стили секции прогноза на 3 дня
    map.css                # Стили карты
    main.css               # Импорт всех CSS-файлов и медиазапросы
  img/                     # Иконки и фоновые изображения
  js/
    dom.js                 # Селекторы DOM-элементов
    jobAPI.js              # Прокси-сервер для ключей (API и Unsplash)
    main.js                # Точка входа (импорт модулей)
    weatherApp.js          # Основная логика получения и отображения погоды
    changeTemp.js          # Переключение шкалы температуры
    changeBG.js            # Загрузка и смена фона
    leaflet.js             # Инициализация карты Leaflet
index.html
.vite.config.js
.env                      # VITE_API_KEY, VITE_UNSPLASH_KEY
.gitignore
package.json
README.md
```

---

## 🚀 Быстрый старт

### Необходимые условия
- Node.js v14+ (https://nodejs.org)
- Аккаунт на GitHub (для Pages) или другой статический хостинг

### Переменные окружения
Создайте файл `.env` в корне проекта:
```
VITE_API_KEY=ВАШ_КЛЮЧ_OPENWEATHERMAP
VITE_UNSPLASH_KEY=ВАШ_КЛЮЧ_UNSPLASH
```
Добавьте `.env` в `.gitignore`, чтобы не заливать ключи в репозиторий.

### Установка
```bash
# Клонировать репозиторий
git clone https://github.com/youruser/robert-s-weather.git
cd robert-s-weather

# Установить зависимости
npm install
```

### Разработка
```bash
npm run dev
# Открыть в браузере http://localhost:5173
```

### Сборка и превью
```bash
npm run build
npm run serve   # или любой статический сервер в папке dist/
```

### Деплой на GitHub Pages
1. В package.json установить:
   ```json
   "homepage": "https://<username>.github.io/<repo>"
   ```
2. Собрать проект:
   ```bash
   npm run build
   ```
3. Установить gh-pages и опубликовать:
   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```
4. В настройках репозитория GitHub → Pages → выбрать ветку `gh-pages` → Save

---

## 🛠 Описание модулей

### Weather App (weatherApp.js)
- Параллельные запросы к `/weather` и `/forecast`
- Обработка ошибок HTTP и JSON
- Функции `displayWeatherInfo()` и `displayThreeDaysWeather()` обновляют DOM и сохраняют исходные температуры в localStorage

### Переключение температуры (changeTemp.js)
- Кнопки °C / °F
- Хранение текущей шкалы в localStorage
- Функция `convertUnitTemp()` конвертирует температуру при необходимости

### Фоновые изображения (changeBG.js)
- Запрос к Unsplash по названию города
- Кеширование массива изображений
- Индекс изображения в localStorage, цикличное переключение

### Карта (leaflet.js)
- Leaflet + OpenStreetMap
- Функция `initMap()`: сброс старой карты + инициализация новой
- Отображение координат в градусах и минутах

### Прокси для ключей (jobAPI.js)
- Эндпойнты `/getApiKey` и `/getUnsplashApiKey` на собственном сервере (CORS)

---

## 🎨 Кастомизация
- Фон: заменить bg.jpg или градиент
- Ключи: можно добавить другие API (например, AQI)
- Карта: сменить тайлы на CartoDB, Mapbox, Google или Яндекс

---

## 🔗 Полезные ссылки
- OpenWeatherMap API: https://openweathermap.org/api
- Unsplash API: https://unsplash.com/developers
- GeoNames API: http://www.geonames.org/export/web-services.html
- Leaflet.js: https://leafletjs.com
- Vite: https://vitejs.dev

---

*Готово к использованию — + ясных неб!*