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

//Lista de otras ciudades (Se cargara desde localStorage)
let otherCities = [];
const MAX_OTHER_CITIES = 5; //lIMITE DE CIUDAdes a guardar

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

// --- Funciones para generar iconos SVG (Estilo Ilustrativo/Apple-like) ---
function getSunIcon() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" class="w-3 h-3 md:w-6 md:h-6">
            <circle cx="24" cy="24" r="10" fill="#FFD700"/>
            <path d="M24 6V10M24 38V42M42 24H38M6 24H10M36.36 11.64L33.53 14.47M14.47 33.53L11.64 36.36M36.36 36.36L33.53 33.53M14.47 14.47L11.64 11.64" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="24" cy="24" r="10" stroke="#FFA500" stroke-width="1.5"/>
        </svg>
    `;
}

function getCloudIcon() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" class="w-3 h-3 md:w-6 md:h-6">
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" fill="#B0C4DE"/>
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" stroke="#778899" stroke-width="1.5"/>
        </svg>
    `;
}

function getCloudSunIcon() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" class="w-3 h-3 md:w-6 md:h-6">
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" fill="#B0C4DE"/>
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" stroke="#778899" stroke-width="1.5"/>
            <circle cx="34" cy="14" r="6" fill="#FFD700"/>
            <path d="M34 8V10M34 18V20M40 14H38M30 14H28M38.24 10.24L36.82 11.66M31.18 16.82L29.76 18.24" stroke="#FFA500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
}

function getRainIcon() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" class="w-3 h-3 md:w-6 md:h-6">
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" fill="#B0C4DE"/>
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" stroke="#778899" stroke-width="1.5"/>
            <path d="M18 34L16 40M24 34L22 40M30 34L28 40" stroke="#4169E1" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
}

function getThunderstormIcon() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" class="w-3 h-3 md:w-6 md:h-6">
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" fill="#B0C4DE"/>
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" stroke="#778899" stroke-width="1.5"/>
            <path d="M24 20L18 32H28L22 44" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
}

function getSnowIcon() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" class="w-3 h-3 md:w-6 md:h-6">
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" fill="#B0C4DE"/>
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" stroke="#778899" stroke-width="1.5"/>
            <path d="M24 34V40M21 37H27M18 34L16 38M30 34L32 38M16 30L14 34M32 30L34 34" stroke="#ADD8E6" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
}

function getMistIcon() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" class="w-3 h-3 md:w-6 md:h-6">
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" fill="#B0C4DE"/>
            <path d="M38.5 20C38.5 14.4772 34.0228 10 28.5 10C24.4646 10 20.9126 12.3857 19.0069 15.727C17.0911 15.008 14.654 14.5 12 14.5C7.02944 14.5 3 18.5294 3 23.5C3 28.4706 7.02944 32.5 12 32.5H38.5C42.6421 32.5 46 29.1421 46 25C46 21.0294 42.9706 17.5 38.5 17.5" stroke="#778899" stroke-width="1.5"/>
            <line x1="10" y1="36" x2="38" y2="36" stroke="#A9A9A9" stroke-width="2" stroke-linecap="round"/>
            <line x1="8" y1="40" x2="36" y2="40" stroke="#A9A9A9" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
}

// Icono de fallback para casos no mapeados o desconocidos
function getDefaultIcon() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 md:w-6 md:h-6 text-gray-500">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.53-2.28a.75.75 0 0 0-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l3.75-3.75Z" clip-rule="evenodd" />
        </svg>
    `;
}

//Funcion para mapear codigos de clima a iconos

function getWeatherIcon(iconCode) {
  switch (iconCode) {
    case "01d":
    case "01n":
      return getSunIcon();
    case "02d":
    case "02n":
      return getCloudSunIcon();
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      return getCloudIcon();
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      return getRainIcon(); // Rain
    case "11d":
    case "11n":
      return getThunderstormIcon(); // Thunderstorm
    case "13d":
    case "13n":
      return getSnowIcon(); // Snow
    case "50d":
    case "50n":
      return getMistIcon(); // Mist
    default:
      return getDefaultIcon(); // Unknown weather condition
  }
}


// --- Funciones para manejar LocalStorage de ciudades ---
function loadOtherCities() {
    const storedCities = localStorage.getItem('otherCities');
    if (storedCities) {
        // Asegurarse de que solo se carguen las ciudades de la lista permitida
        // Esto es útil si el formato de almacenamiento cambia o si hay datos corruptos
        try {
            const parsedCities = JSON.parse(storedCities);
            if (Array.isArray(parsedCities)) {
                otherCities = parsedCities.filter(city => typeof city === 'string').slice(0, MAX_OTHER_CITIES);
            }
        } catch (e) {
            console.error("Error parsing otherCities from localStorage:", e);
            otherCities = []; // Reset if parsing fails
        }
    }
}

function saveOtherCities() {
    localStorage.setItem('otherCities', JSON.stringify(otherCities));
}

function addCityToOtherCities(cityName) {
    // Normaliza el nombre de la ciudad para evitar duplicados, pero guarda el original
    const normalizedCityName = cityName.toLowerCase().trim();
    if (!otherCities.some(city => city.toLowerCase().trim() === normalizedCityName)) {
        // Añade la ciudad al principio de la lista
        otherCities.unshift(cityName);
        // Limita el número de ciudades
        if (otherCities.length > MAX_OTHER_CITIES) {
            otherCities = otherCities.slice(0, MAX_OTHER_CITIES);
        }
        saveOtherCities(); // Guarda en localStorage
        renderOtherCities(); // Vuelve a renderizar la lista
    }
}

// Nueva función para obtener detalles del clima de una ciudad específica
async function fetchCityWeatherDetails(cityName) {
    const url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.message || 'Error al obtener detalles de la ciudad'}`);
        }
        const data = await response.json();
        return {
            name: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: getWeatherIcon(data.weather[0].icon)
        };
    } catch (error) {
        console.error(`Error al obtener detalles para ${cityName}:`, error);
        return null; // Retorna null si hay un error
    }
}

// Función para renderizar las otras ciudades como tarjetas
async function renderOtherCities() {
    otherCitiesDisplay.innerHTML = ''; // Limpia el contenedor

    if (otherCities.length === 0) {
        otherCitiesDisplay.innerHTML = '<p class="text-center text-gray-400 text-sm">No hay ciudades guardadas.</p>';
        return;
    }

    // Usar Promise.all para cargar los detalles de todas las ciudades en paralelo
    const cityDetailsPromises = otherCities.map(city => fetchCityWeatherDetails(city));
    const allCityDetails = await Promise.all(cityDetailsPromises);

    allCityDetails.forEach((details, index) => {
        if (details) {
            const cityCard = document.createElement('div');
            cityCard.className = `
                bg-gray-800 rounded-xl p-4 shadow-lg flex items-center justify-between
                cursor-pointer hover:bg-gray-700 transition-colors duration-200
            `;
            cityCard.innerHTML = `
                <div class="flex flex-col hover:bg-blue-800">
                    <span class="text-xs text-gray-400">${details.country}</span>
                    <span class="text-lg font-semibold text-gray-100">${details.name}</span>
                    <span class="text-sm text-gray-300 capitalize">${details.description}</span>
                </div>
                <div class="flex items-center gap-2">
                    ${details.icon}
                    <span class="text-3xl font-bold text-blue-300">${details.temp}°</span>
                </div>
            `;
            // Añadir evento de clic para cargar el clima de la ciudad al hacer clic en la tarjeta
            cityCard.addEventListener('click', () => {
                searchInput.value = details.name; // Pone la ciudad en el input de búsqueda
                fetchAndRenderWeather(details.name);
                fetchAndRenderFiveDayForecast(details.name);
            });
            otherCitiesDisplay.appendChild(cityCard);
        } else {
            // Si una ciudad no pudo cargar sus detalles, podríamos mostrar un mensaje o simplemente omitirla
            console.warn(`No se pudieron cargar los detalles para la ciudad: ${otherCities[index]}`);
        }
    });
}



//Funcion principal para obtener y renderizar datos del clima
//Ahora acepta una ciudad (string) o latitud/longitud (objeto)

async function fetchAndRenderWeather(param) {
  currentDisplay.innerHTML = `<p class="text-center text-gray-400">Cargando datos del clima...</p>`;
  hideMessage();

  let currentWeatherUrl = "";
  if (typeof param === "string") {
    //Si el parametro es una ciudad (string)
    currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(
      param
    )}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
  } else if (typeof param === "object" && param.lat && param.lon) {
    //Si el parametro es un objeto con lat/lon
    currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?lat=${param.lat}&lon=${param.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
  } else {
    showMessage("Parámetro de búsqueda de clima inválido.", "error");
    currentDisplay.innerHTML =
      '<p class="text-center text-red-400">Error: Parámetro de búsqueda inválido.</p>';
    return;
  }

  console.log(`Fetching current weather from:  ${currentWeatherUrl}`);

  try {
    const response = await fetch(currentWeatherUrl);
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        throw new Error(
          `Ciudad no encontrada: ${
            typeof param === "string" ? param : "ubicacion actual"
          }. Por favor verifica el nombre`
        );
      }
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Error desconocido"}`
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
    // Añadir la ciudad a la lista de otras ciudades si es una busqueda por nombre
    if (typeof param === "string") {
      addCityToOtherCities(data.name);
    }
  } catch (error) {
    console.error("Error fetching current weather:", error);
    currentDisplay.innerHTML = `<p class="text-center text-red-400">Error al cargar el clima actual: ${error.message}</p>`;
    showMessage(error.message, "error");
  }
}

//Nueva funcion para renderizar una tarjeta de pronostico de un dia
function renderForecastDayCard(dayForecast) {
  const card = document.createElement("div");
  card.className = `flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-md md:w-50`;

  // Crear un elemento div temporal para parsear el SVG
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = dayForecast.icon;
  const svgElement = tempDiv.firstElementChild; // Obtener el elemento SVG real

  // Construir el resto del HTML de la tarjeta
  const cardContent = `
        <p class="text-sm text-gray-300">${dayForecast.day}</p>
        <p class="text-sm text-gray-400 capitalize">${dayForecast.description}</p>
        <p class="text-xl font-bold text-blue-300">${dayForecast.temp}°</p>
    `;

  // Asignar el contenido HTML a la tarjeta
  card.innerHTML = cardContent;

  // Insertar el elemento SVG parseado en la posición correcta
  // Lo insertamos después del párrafo del día y antes de la descripción
  const dayParagraph = card.querySelector("p:first-child");
  if (dayParagraph) {
    card.insertBefore(svgElement, dayParagraph.nextSibling);
  } else {
    // Fallback si por alguna razón no se encuentra el párrafo del día
    card.prepend(svgElement); // Lo añade al principio de la tarjeta
  }

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
        const iconCode = item.weather[0].icon;
        const svgIcon = getWeatherIcon(iconCode); //Obtener el SVG
        console.log(
          `procesando dia ${day}: iconCode=${iconCode}, SVG length=${
            svgIcon.length > 0 ? "ok" : "empty"
          }`
        );

        dailyForecast[day] = {
          day: day,
          icon: svgIcon,
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

//Nueva funcion : Obtener clima por geolocalizacion
function getWeatherByGeolocation() {
  showMessage("Detectando tu ubicacion...", "info");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`Ubicacion detectada: Lat ${lat}, Lon ${lon}`);

        //Llamar ambas funciones con las coordenadas
        await fetchAndRenderWeather({ lat, lon });
        await fetchAndRenderFiveDayForecast({ lat, lon });
      },
      (error) => {
        console.error("Error al obtener la ubicacion:", error);
        let errorMessage = "No se pudo detectar tu ubicacion";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            "Permiso de ubicacion denegado. Cargando clima por defecto";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage =
            "Informacion de ubicacion no disponible. Cargando clima por defecto (Caracas)";
        } else if (error.code === error.TIMEOUT) {
          errorMessage =
            "Tiempo de espera agotado para obtener la ubicacion. Cargando la ciudad por defecto (Caracas)";
        }
        showMessage(errorMessage, "error");
        //Cargar caracas como Fallback si falla la geolocalizacion
        fetchAndRenderWeather("Caracas");
        fetchAndRenderFiveDayForecast("Caracas");
      },
      {
        enableHighAccuracy: true, //Intenta obtener la mejor precision posible
        timeout: 10000, //10 segundos de tiempo de espera
        maximumAge: 0, //No usar la posicion en cache, obtener una nueva
      }
    );
  } else {
    showMessage(
      "Tu navegador no soporta la geolocalizacion. Cargando clima por defecto (Caracas)"
    );
    //Cargar Caracas como fallback si el navegador no soporta geolocalizacion
    fetchAndRenderWeather("Caracas");
    fetchAndRenderFiveDayForecast("Caracas");
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
      //Si el input esta vacion intenta geolocalizacion o volver a Caracas por defecto
      getWeatherByGeolocation();
    }
  }, 800)
);

// --Inicializar la aplicacion--
document.addEventListener("DOMContentLoaded", () => {
  loadOtherCities(); // Carga las ciudades guardadas al iniciar
  renderOtherCities(); // Renderiza las ciudades cargadas
  // fetchAndRenderWeather("Caracas"); // Cargar clima por defecto al iniciar
  // fetchAndRenderFiveDayForecast("caracas"); // Cargar pronostico de 5 dias por defecto al iniciar

  //*** ->Ahora se inicia con la geolocalizacion<- ***
  getWeatherByGeolocation();
});
