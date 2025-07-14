☀️ WeatherSphere: Tu Clima
🚀 Descripción del Proyecto
WeatherSphere es una aplicación web interactiva diseñada para proporcionarte información meteorológica precisa y actualizada. Te permite ver el clima actual de cualquier ciudad, obtener un pronóstico detallado para los próximos 5 días y guardar tus ciudades favoritas para un acceso rápido. La aplicación utiliza la geolocalización para mostrar el clima de tu ubicación actual al iniciar, ofreciendo una experiencia de usuario fluida y visualmente atractiva.

Este proyecto ha sido desarrollado con un enfoque en la simplicidad, la eficiencia y una experiencia de usuario fluida, utilizando tecnologías modernas de frontend para un diseño responsivo y atractivo.

✨ Características Principales
Clima Actual: Obtén la temperatura, sensación térmica, descripción y velocidad del viento de cualquier ciudad.

Geolocalización: Muestra automáticamente el clima de tu ubicación actual al iniciar la aplicación (con tu permiso).

Búsqueda de Ciudades: Busca el clima de cualquier ciudad específica por su nombre.

Pronóstico de 5 Días: Visualiza el pronóstico detallado para los próximos días.

Ciudades Favoritas: Guarda tus ciudades preferidas para un acceso rápido (funcionalidad futura).

Interfaz Intuitiva: Diseño limpio, moderno y responsivo, adaptado para móviles y escritorios.

Iconos de Clima: Representación visual de las condiciones meteorológicas mediante emojis o iconos.

🛠️ Tecnologías Utilizadas
Este proyecto está construido exclusivamente con tecnologías de frontend, comunicándose con la API de OpenWeatherMap.


Frontend

HTML5

Estructura el contenido de la aplicación.


JavaScript (Vanilla)

Proporciona la interactividad y la lógica del cliente.



Tailwind CSS

Framework CSS de utilidad para un diseño rápido y responsivo.



Fetch API

Para realizar peticiones HTTP a la API de OpenWeatherMap.


API Externa

OpenWeatherMap API



Fuente de datos para el clima actual y pronósticos.

⚙️ Requisitos
Para ejecutar este proyecto localmente, solo necesitas un navegador web moderno. Para el desarrollo y la gestión de dependencias, se recomienda tener:

Node.js (versión 14.x o superior recomendada)

npm (viene con Node.js) o Yarn

🚀 Instalación y Uso
Sigue estos pasos para configurar y ejecutar WeatherSphere en tu máquina local:

Clona el repositorio:

git clone https://github.com/felixbonillo/weather-app-js.git
cd weather-app-js

Instala las dependencias:

npm install
# o si usas yarn
# yarn install

Configura tu API Key de OpenWeatherMap:

Obtén una API Key gratuita de OpenWeatherMap.

Abre el archivo main.js (ubicado en la raíz de tu proyecto).

Busca la línea const OPENWEATHER_API_KEY = 'TU_API_KEY_OPENWEATHERMAP'; y reemplaza 'TU_API_KEY_OPENWEATHERMAP' con tu clave real.

Ejecuta la aplicación:

npm run dev
# o si usas yarn
# yarn dev

Esto iniciará un servidor de desarrollo local (normalmente en http://localhost:5173/). Abre esta URL en tu navegador.

📁 Estructura del Proyecto
weather-app-js/
├── public/                 # Archivos estáticos (HTML)
│   ├── index.html          # La interfaz de usuario principal
│   └── vite.svg            # Icono por defecto de Vite
├── src/                    # Contiene el CSS principal
│   └── style.css           # Estilos CSS (importa Tailwind)
├── main.js                 # Lógica JavaScript principal de la aplicación
├── postcss.config.js       # Configuración de PostCSS para Tailwind
├── package.json            # Metadatos del proyecto y dependencias
├── vite.config.js          # Configuración de Vite
└── README.md               # Este archivo

🤝 Contribuciones
¡Las contribuciones son bienvenidas! Si deseas contribuir a este proyecto, por favor sigue estos pasos:

Haz un "fork" de este repositorio.

Crea una nueva rama para tu característica (git checkout -b feature/AmazingFeature).

Realiza tus cambios y haz "commit" (git commit -m 'Add some AmazingFeature').

Haz "push" a la rama (git push origin feature/AmazingFeature).

Abre un "Pull Request".

Por favor, asegúrate de que tu código siga las convenciones de estilo del proyecto y que todas las pruebas pasen.

📞 Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactarme:

Nombre: Félix Bonillo

Email: felix.bonillo3@gmail.com

LinkedIn: https://www.linkedin.com/in/felix-bonillo-b9368936b/

GitHub: https://github.com/felixbonillo

¡Gracias por revisar mi proyecto!