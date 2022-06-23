"use strict";

const getWeather = async function (city) {
  const weather = await fetch(`https://goweather.herokuapp.com/weather/${city}`);
  const data = await weather.json();
  console.log(data);
};

const getCountryData = async function (country) {
  const countryData = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);
  const data = await countryData.json();
  console.log(data);
};
