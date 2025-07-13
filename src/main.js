import '../src/style.css';

//Referencias a los elementos del DOM
const searchInput = document.getElementById('search-input');
const currentDisplay = document.getElementById('current-weather-display');
const otherCitiesDisplay = document.getElementById('other-cities-display');
const fiveDayForecastDisplay = document.getElementById('five-day-forecast-display');
const messageArea = document.getElementById('message-area');

//Api key y base URL
const OPENWEATHER_API_KEY = '641b3e58fcf3c44de818a76e7b7d2a5a';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

//Funcion para mostrar mensajes en el area de mensajes (carga, error)
function showMessage(message,type = 'info') {
  messageArea.textContent = message;
  messageArea.classList.remove('hidden', 'text-red-400', 'text-blue-400');
  if (type === 'error') {
    messageArea.classList.add('text-red-400');
  } else if (type === 'info') {
    messageArea.classList.add('text-blue-400');
  }
  messagArea.classList.remove('hidden');
}

//Funcion para ocultar los mensajes 
function hideMessage() {
  messageArea.classList.add('hidden');
  messageArea.textContent = '';
}

//Funcion para mapear codigos de clima a iconos

function getWeatherIcon(iconCode) {
  switch (iconCode) {
    case '01d':
      return '☀️'; // Clear sky
    case '02d':
      return '🌤️'; // Few clouds
    case '03d':
      return '☁️'; // Scattered clouds
    case '04d':
      return '☁️'; // Broken clouds
    case '09d':
      return '🌧️'; // Shower rain
    case '10d':
      return '🌦️'; // Rain
    case '11d':
      return '⛈️'; // Thunderstorm
    case '13d':
      return '❄️'; // Snow
    case '50d':
      return '🌫️'; // Mist
    default:
      return ''; // Unknown weather condition
  }  
}

//Funcion principal para obtener y renderizar datos del clima
async function fetchAndRenderWeather(city) {
  currentDisplay.innerHTML = `<p class="text-center text-gray-400">Cargando datos del clima...</p>`
  hideMessage();
  try {
    //Peticion para el clima actual
    const currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
    console.log(`Fetching current weather from: ${currentWeatherUrl}`);
    
    const response = await fetch(currentWeatherUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message || 'Ciudad no encontrada'}`);
    }
    const data = await response.json();
    console.log('Current weather data:', data);

    //Renderizar clima actual
    currentDisplay.innerHTML = `
    <div class="flex flex-col items-center md:items-start text-center md:text-left">
    <p class="text-6xl font-bold text-blue-300">${Math.round(data.main.temp)}°</p>
    <p class="text-lg text-gray-300">Sensacion Termica: ${Math.round(data.main.feels_like)}°</p>
    </div>
    <div class="flex flex-col items-center md:items-end text-center md:text-right">
    <h2 class="text-4xl font-semibold text-gray-100">${data.name}</h2>      
    <h3 class="capitalize text-lg text-gray-300">${data.weather[0].description} ${getWeatherIcon(data.weather[0].icon)}</h3>
    <p class="text-md text-gray-400">Viento: ${data.wind.speed} m/s</p>
    </div>
    `;
    hideMessage(); // Ocultar mensajes de carga si todo sale bien

  } catch (error) {
    console.error('Error fetching current weather:', error);
    currentDisplay.innerHTML = `<p class="text-center text-red-400">Error al cargar el clima actual: ${error.message}</p>`;
    showMessage(error.message, 'error');
  }
}



// --Inicializar la aplicacion--
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderWeather('Caracas'); // Cargar clima por defecto al iniciar
});

