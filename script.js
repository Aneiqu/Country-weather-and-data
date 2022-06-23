"use strict";

// Selectors
const searchBtn = document.querySelector(".search--btn");
const countryName = document.querySelector(".country--input");
const flag = document.querySelector(".flag");
const borders = document.querySelector(".borders");
const dataContainer = document.querySelector(".data--output");
const countryLabel = document.querySelector(".country");
const capitalLabel = document.querySelector(".capital");
const regionLabel = document.querySelector(".region");
const populationLabel = document.querySelector(".population");
const languageLabel = document.querySelector(".language");
const currencyLabel = document.querySelector(".currency");
const countryError = document.querySelector(".error--popup");
const temperature = document.querySelector(".temperature");
// Getting json format from fetch
const getJSON = async function (url) {
  try {
    const response = await fetch(url);
    // Creating error
    if (!response.ok) throw new Error();

    const [data] = await response.json();
    return data;

    // Handling error
  } catch (err) {
    countryError.classList.remove("hide");
    countryError.style.left = `70%`;
    setTimeout(() => {
      countryError.style.left = `62%`;
      countryError.classList.add("hide");
    }, 2000);
  }
};

const getNeighbour = async function (arr) {
  if (arr == undefined) {
    if (dataContainer.classList.contains("hide")) dataContainer.classList.remove("hide");
    borders.textContent = `Bordered by: does not border`;
    return;
  }
  let neighbourCountries = "";
  await arr.forEach((el, i, a) => {
    getJSON(`https://restcountries.com/v3.1/alpha?codes=${el}`).then((res) => {
      neighbourCountries += `${res.name.common} `;
      if (i + 1 === a.length) {
        borders.textContent = `Bordered by: ${neighbourCountries}`;
        if (dataContainer.classList.contains("hide")) dataContainer.classList.remove("hide");
      }
    });
  });
};

// Getting country informations
const getCountryData = async function (country) {
  try {
    if (!dataContainer.classList.contains("hide")) dataContainer.classList.add("hide");
    const data = await getJSON(`https://restcountries.com/v3.1/name/${country}?fullText=true`);
    console.log(data);
    // Creating error
    if (data == undefined) throw new Error();

    // Calling weather
    getWeather(data.latlng[0], data.latlng[0]);

    // Creating displayed element

    // Setting country name
    countryLabel.textContent = `Country: ${data.name.common}`;

    // Setting country capital
    capitalLabel.textContent = `Capital: ${data.capital}`;

    // Setting country region
    regionLabel.textContent = `Region: ${data.region}`;

    // Setting country population
    populationLabel.textContent = `Population: ${Math.floor(data.population / 1000000)}m`;

    // Setting country language
    languageLabel.textContent = `Language: ${data.languages[Object.keys(data.languages)[0]]}`;

    // Setting country currency
    currencyLabel.textContent = `Currency: ${data.currencies[Object.keys(data.currencies)[0]].name}`;

    // Listing neighbours
    getNeighbour(data.borders);

    // Changing flag src
    flag.src = data.flags?.png;
  } catch (err) {}
};

// Getting weather informations
const getWeather = async function (lat, lng) {
  const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m`);
  const data = await weather.json();
  console.log(data);

  // Creating date to later find correct temperature
  const date = new Date().toISOString();
  const fixedDate = date.slice(0, 13) + `:00`;
  temperature.textContent = `Temperature: ${data.hourly.temperature_2m[data.hourly.time.indexOf(fixedDate)]}°C`;
};

// Event listeners
searchBtn.addEventListener("click", () => {
  getCountryData(countryName.value);
});
