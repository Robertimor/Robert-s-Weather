(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(e){if(e.ep)return;e.ep=!0;const o=n(e);fetch(e.href,o)}})();document.querySelector(".content");document.querySelector(".control__refresh-BG");document.querySelector(".control__change-language");document.querySelector(".control__name-language");document.querySelector(".control__hidden-list-languages");document.querySelectorAll(".control__hidden-element-language");document.querySelectorAll(".control__hidden-element-language-name");document.querySelector(".control__change-temperature");document.querySelectorAll(".control__type-temperature");document.querySelector(".control__faringate");document.querySelector(".control__celsius");const s=document.querySelector(".control__serch-bar"),m=document.querySelector(".control__search-city-input");document.querySelector(".control__search-city-icon");document.querySelector(".control__search-city-button");const y=document.querySelector(".today-weather__city"),h=document.querySelector(".today-weather__country"),p=document.querySelector(".today-weather__today-date"),w=document.querySelector(".today-weather__today-time"),f=document.querySelector(".today-weather__num-temperature-today"),l=document.querySelector(".today-weather__weather-icon"),g=document.querySelector(".today-weather__weather-condition"),S=document.querySelector(".today-weather__perceived-temperature-num"),q=document.querySelector(".today-weather__wind-speed-num"),T=document.querySelector(".today-weather__humidity-num");[...document.querySelectorAll(".day")];document.querySelector(".map__latitude-name");document.querySelector(".map__longitude-name");document.querySelector(".map__latitude-num");document.querySelector(".map__longitude-num");const b="4e88cbe360a5181d59fb73d2bee0c230";s.addEventListener("submit",async function(t){t.preventDefault();const r=m.value;if(r)try{const n=await x("en","metric",r);D(n,"en","metric",r)}catch(n){console.log(n)}});async function x(t,r="metric",n){const a=`https://api.openweathermap.org/data/2.5/weather?q=${n}&appid=${b}&units=${r}&lang=${t}`,e=await fetch(a);if(!e.ok)throw new Error("Could not fetch weather data");return await e.json()}function D(t,r,n="metric",a){console.log(t);const e=t.sys.country,o=new Intl.DisplayNames([r],{type:"region"}).of(e),i=t.timezone,d=new Date(Date.now()+i*1e3),u={weekday:"short",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit",hour12:!1,timeZone:"UTC"},c=d.toLocaleDateString(r,u).split(" ");c.splice(3,1),c[0]=c[0].replace(",",""),new Date().toLocaleDateString("en-US",u).replace(" ",", ");const _=`https://openweathermap.org/img/wn/${t.weather[0].icon}@2x.png`;y.innerText=t.name,h.innerText=o,p.innerText=`${c[0]} ${c[2]} ${c[1]}`,w.innerText=c[3],f.innerText=Math.floor(t.main.temp),g.innerText=t.weather[0].description,S.innerText=Math.floor(t.main.feels_like),q.innerText=t.wind.speed,T.innerText=t.main.humidity,l.src=_,l.alt=t.weather[0].description,window.localStorage.setItem("latitude",t.coord.lat),window.localStorage.setItem("longitude",t.coord.lon)}
