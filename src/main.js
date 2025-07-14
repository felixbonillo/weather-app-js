import "../src/style.css";

//Referencias a los elementos del DOM
const searchInput = document.getElementById("search-input");
const currentDisplay = document.getElementById("current-weather-display");
const otherCitiesDisplay = document.getElementById("other-cities-display");
const fiveDayForecastDisplay = document.getElementById(
  "five-day-forecast-display"
);
const messageArea = document.getElementById("message-area");

//Api key y base URL
const OPENWEATHER_API_KEY = "641b3e58fcf3c44de818a76e7b7d2a5a";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

//Funcion para el buscador (Debounce)

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

//Funcion para mostrar mensajes en el area de mensajes (carga, error)
function showMessage(message, type = "info") {
  messageArea.textContent = message;
  messageArea.classList.remove("hidden", "text-red-400", "text-blue-400");
  if (type === "error") {
    messageArea.classList.add("text-red-400");
  } else if (type === "info") {
    messageArea.classList.add("text-blue-400");
  }
  messageArea.classList.remove("hidden");
}

//Funcion para ocultar los mensajes
function hideMessage() {
  messageArea.classList.add("hidden");
  messageArea.textContent = "";
}

//Funcion para mapear codigos de clima a iconos

function getWeatherIcon(iconCode) {
  switch (iconCode) {
    case "01d":
      return "☀️"; // Clear sky
    case "02d":
      return "🌤️"; // Few clouds
    case "03d":
      return "☁️"; // Scattered clouds
    case "04d":
      return "☁️"; // Broken clouds
    case "09d":
      return "🌧️"; // Shower rain
    case "10d":
      return "🌦️"; // Rain
    case "11d":
      return "⛈️"; // Thunderstorm
    case "13d":
      return "❄️"; // Snow
    case "50d":
      return "🌫️"; // Mist
    default:
      return ""; // Unknown weather condition
  }
}

//Funcion principal para obtener y renderizar datos del clima
async function fetchAndRenderWeather(city) {
  currentDisplay.innerHTML = `<p class="text-center text-gray-400">Cargando datos del clima...</p>`;
  hideMessage();
  try {
    //Peticion para el clima actual
    const currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
    console.log(`Fetching current weather from: ${currentWeatherUrl}`);

    const response = await fetch(currentWeatherUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${
          errorData.message || "Ciudad no encontrada"
        }`
      );
    }
    const data = await response.json();
    console.log("Current weather data:", data);

    //Renderizar clima actual
    currentDisplay.innerHTML = `
    <div class="flex flex-col items-center md:items-start text-center md:text-left">
    <p class="text-6xl font-bold text-blue-300">${Math.round(
      data.main.temp
    )}°</p>
    <p class="text-lg text-gray-300">Sensacion Termica: ${Math.round(
      data.main.feels_like
    )}°</p>
    </div>
    <div class="flex flex-col items-center md:items-end text-center md:text-right">
      <h2 class="text-4xl font-semibold text-gray-100">${data.name}</h2>      
      <h3 class="capitalize text-lg text-gray-300">${
        data.weather[0].description
      } ${getWeatherIcon(data.weather[0].icon)}</h3>
      <p class="text-md text-gray-400">Viento: ${data.wind.speed} m/s</p>
    </div>
    `;
    hideMessage(); // Ocultar mensajes de carga si todo sale bien
  } catch (error) {
    console.error("Error fetching current weather:", error);
    currentDisplay.innerHTML = `<p class="text-center text-red-400">Error al cargar el clima actual: ${error.message}</p>`;
    showMessage(error.message, "error");
  }
}

//Nueva funcion para renderizar una tarjeta de pronostico de un dia
function renderForecastDayCard(dayForecast) {
  const card = document.createElement("div");
  card.className = `flex flex-col items-center p-3 bg-gray-800 rounded-lg shadow-md`;
  card.innerHTML = `
    <p class="text-sm text-gray-300">${dayForecast.day}</p>
    <p class="text-3xl my-1">${dayForecast.icon}</p>
    <p class="text-sm text-gray-400">${dayForecast.description}</p>
    <p class="text-xl font-bold text-blue-300">${dayForecast.temp}°</p>
  `;
  return card;
}

//Nueva funcion para generar y renderizar el pronostico de 5 dias con datos reales
async function fetchAndRenderFiveDayForecast(city = "Caracas") {
  console.log("--- fetchAndRenderFiveDayForecast INICIADO ---"); // Log de inicio
  console.log("Ciudad recibida para pronóstico:", city); // Log de la ciudad
  fiveDayForecastDisplay.innerHTML = `<p class="text-center text-gray-400 col-span-full">Cargando pronostico...</p>`;

  try {
    const cityToUse = city ? city : "Caracas";
    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(
      cityToUse
    )}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
    console.log(`Fetching 5-day forecast from: ${forecastUrl}`);

    const response = await fetch(forecastUrl);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Error Desconocido"}`
      );
    }

    const data = await response.json();
    console.log("5-day forecast data:", data);

    //Limpiar el contenedor del pronostico
    fiveDayForecastDisplay.innerHTML = "";

    //Procesar los datos para obtener un pronostico por dia (mediodia)
    const dailyForecast = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000); // Convertir a milisegundos para que se pueda usar Date
      const day = date.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
      }); //Da formato de dia corto y dia numerico ejemplo  "lun. 23"
      const hour = date.getHours();

      //Elegir una entrada representativa por dia //Ejemplo la mas cercana al mediodia
      //Si ya tenemos un pronostico para ese dia, solo lo actualizamos si es mas relevante
      //Aqui simplemente tomamos la primera entrada del dia o la mas cercana a una hora especifica

      if (!dailyForecast[day] || (hour >= 12 && hour <= 15)) {
        dailyForecast[day] = {
          day: day,
          icon: getWeatherIcon(item.weather[0].icon),
          description: item.weather[0].description,
          temp: Math.round(item.main.temp),
        };
      }
    });
    const sortedDays = Object.keys(dailyForecast).sort((a, b) => {
      //Ordenacion por dia del mes
      const dayA = parseInt(a.split(" ")[1]);
      const dayB = parseInt(b.split(" ")[1]);
      return dayA - dayB;
    });
    console.log("Dias ordenados para renderizar:", sortedDays);

    //Renderizar las tarjetas del pronostico
    if (sortedDays.length > 0) {
      sortedDays.forEach((dayKey) => {
        const card = renderForecastDayCard(dailyForecast[dayKey]);
        fiveDayForecastDisplay.appendChild(card);
      });
    } else {
      fiveDayForecastDisplay.innerHTML =
        '<p class="text-center text-gray-400 col-span-full">No se pudo generar el pronóstico diario.</p>';
    }
  } catch (error) {
    console.error("Error fetching 5-day forecast:", error);
    fiveDayForecastDisplay.innerHTML =
      '<p class= "text-center text-red-400 col-span-full"> No se pudo cargar el pronostico de 5 dias. </p>';
    showMessage("Error al cargar el pronostico de 5 dias", "error");
  }
}

// ---->Event listeners<-----
//Evento para el buscador con debounce
searchInput.addEventListener(
  "input",
  debounce(() => {
    const city = searchInput.value.trim();
    if (city) {
      //Solo buscar si hay una ciudad
      fetchAndRenderWeather(city);
      //Modificacion clave aqui
      fetchAndRenderFiveDayForecast(city);
    } else {
      // Manejar el caso en que no hay ciudad volvera a la ciudad por defecto
      fetchAndRenderWeather("Caracas");
      fetchAndRenderFiveDayForecast("caracas");
      showMessage(
        "Por favor, ingresa una ciudad para buscar el clima.",
        "info"
      );
    }
  }, 800)
);

// --Inicializar la aplicacion--
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderWeather("Caracas"); // Cargar clima por defecto al iniciar
  fetchAndRenderFiveDayForecast("caracas"); // Cargar pronostico de 5 dias por defecto al iniciar
});
