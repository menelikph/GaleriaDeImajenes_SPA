// main.js

// =========================================================
// Variables Globales y Selectores del DOM
// =========================================================
const appContainer = document.getElementById('app-container');
const navButtons = document.querySelectorAll('nav button');
const PICSUM_BASE_URL = 'https://picsum.photos';
let currentImageCount = 10; // Estado inicial para la cantidad de imágenes

// =========================================================
// Funciones de Manipulación del DOM y Lógica de Vistas
// =========================================================

/**
 * Función auxiliar para resetear los estilos flex de appContainer.
 * Esto es necesario cuando se carga contenido que no debe estar centrado por flexbox.
 */
function resetAppContainerStyles() {
    appContainer.style.display = '';
    appContainer.style.flexDirection = '';
    appContainer.style.justifyContent = '';
    appContainer.style.alignItems = '';
}

/**
 * Muestra mensajes de estado (cargando, error, información) en el contenedor principal.
 * Se asegura de que el appContainer tenga estilos flex para centrar el mensaje.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - Tipo de mensaje ('loading', 'error', 'info').
 */
function displayMessage(message, type = 'info') {
    appContainer.innerHTML = `<p class="${type}-message">${message}</p>`;
    // Asegura que el appContainer use flexbox para centrar los mensajes
    appContainer.style.display = 'flex';
    appContainer.style.flexDirection = 'column';
    appContainer.style.justifyContent = 'center';
    appContainer.style.alignItems = 'center';
}

/**
 * Navega a una ruta específica de la SPA usando la History API.
 * @param {string} path - La ruta a la que navegar (ej. '/', '/gallery', '/detail/123').
 */
function navigateTo(path) {
    window.history.pushState({}, '', path);
    handleLocation(); // Renderiza el contenido para la nueva ruta
}

/**
 * Renderiza la página de inicio.
 */
function renderHomePage() {
    resetAppContainerStyles(); // Resetear estilos al cargar la página de inicio

    appContainer.innerHTML = `
        <section class="home-section">
            <h2>¡Bienvenido a la Galería Dinámica!</h2>
            <p>Explora cómo JavaScript puede crear experiencias interactivas y fluidas.</p>
            <p>Esta demostración cubre:</p>
            <ul>
                <li><strong>Resolución de Problemas:</strong> Estructura de la aplicación.</li>
                <li><strong>Conceptos Avanzados de JS:</strong> Closures, Hoisting, Async/Await y Promesas.</li>
                <li><strong>Manipulación del DOM:</strong> Actualizaciones dinámicas de contenido.</li>
                <li><strong>Consumo de API (Fetch):</strong> Obtención de datos de imágenes.</li>
                <li><strong>Defensa Técnica:</strong> Prepárate para explicar cada sección.</li>
            </ul>
            <button onclick="navigateTo('/gallery')">Ir a la Galería</button>
        </section>
    `;
}

/**
 * Renderiza la página "Acerca de".
 */
function renderAboutPage() {
    resetAppContainerStyles(); // Resetear estilos al cargar la página "Acerca de"

    appContainer.innerHTML = `
        <section class="about-section">
            <h2>Acerca de esta Demostración</h2>
            <p>Este proyecto fue creado para ilustrar diversas capacidades de JavaScript puro.</p>
            <p>Se enfoca en mostrar:</p>
            <ul>
                <li>La interacción con APIs externas para obtener datos.</li>
                <li>La manipulación eficiente del DOM para renderizar contenido.</li>
                <li>La implementación de patrones asíncronos con \`async/await\`.</li>
                <li>Conceptos de programación como closures y el ciclo de vida de las Promesas.</li>
            </ul>
            <button onclick="navigateTo('/')">Volver al Inicio</button>
        </section>
    `;
}

/**
 * Renderiza la galería de imágenes, incluyendo los controles de cantidad.
 */
async function renderGalleryPage() {
    resetAppContainerStyles(); // Resetear estilos para la galería

    appContainer.innerHTML = `
        <div class="gallery-wrapper">
            <div class="gallery-controls">
                <label for="imageCount">Cantidad de imágenes:</label>
                <input type="number" id="imageCount" min="1" max="100" value="${currentImageCount}">
                <button id="loadMoreBtn">Cargar</button>
            </div>
            <div id="galleryGrid" class="gallery-grid"></div>
            <button onclick="navigateTo('/')" style="margin-top: 20px;">Volver al Inicio</button>
        </div>
    `;

    // Obtener los elementos después de que el HTML de la galería esté en el DOM
    const imageCountInput = document.getElementById('imageCount');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const galleryGrid = document.getElementById('galleryGrid'); // Importante obtenerlo aquí

    // Listener para cambiar la cantidad de imágenes y recargar
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const newCount = parseInt(imageCountInput.value);
            if (!isNaN(newCount) && newCount > 0 && newCount <= 100) {
                currentImageCount = newCount;
                loadImages(currentImageCount, galleryGrid); // Pasa galleryGrid
            } else {
                alert('Por favor, ingresa un número válido entre 1 y 100.');
            }
        });
    } else {
        console.error("loadMoreBtn no encontrado. Hay un problema en la estructura de renderGalleryPage.");
    }

    // Carga inicial de imágenes cuando se visita la galería
    await loadImages(currentImageCount, galleryGrid); // Pasa galleryGrid
}

/**
 * Carga las imágenes de la API y las muestra en la cuadrícula de la galería.
 * @param {number} count - El número de imágenes a cargar.
 * @param {HTMLElement} gridElement - La referencia al elemento galleryGrid ya existente.
 */
async function loadImages(count, gridElement) { // Recibe gridElement
    const galleryGrid = gridElement; // Usa la referencia pasada

    if (!galleryGrid) {
        console.error("Error FATAL: Elemento 'galleryGrid' no encontrado. La galería no puede renderizarse.");
        displayMessage('Error interno: No se pudo encontrar el contenedor de la galería.', 'error');
        return;
    }

    galleryGrid.innerHTML = ''; // Limpia la cuadrícula para nuevas imágenes
    
    // Añade un mensaje de carga temporal DENTRO de galleryGrid
    const loadingMessageInGrid = document.createElement('p');
    loadingMessageInGrid.classList.add('loading-message');
    loadingMessageInGrid.textContent = 'Cargando imágenes...';
    galleryGrid.appendChild(loadingMessageInGrid);

    try {
        console.log('1. Realizando fetch a la API...');
        const response = await fetch(`${PICSUM_BASE_URL}/v2/list?limit=${count}`);
        console.log('2. Respuesta de la API recibida. Status:', response.status);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const imagesData = await response.json();
        console.log('3. Datos JSON parseados. Cantidad de imágenes:', imagesData.length);

        // Eliminar el mensaje de carga que se puso *dentro* de galleryGrid
        if (loadingMessageInGrid && loadingMessageInGrid.parentNode === galleryGrid) {
             loadingMessageInGrid.remove();
             console.log('4. Mensaje de carga dentro de galleryGrid eliminado.');
        } else {
            console.log('4. No se encontró el mensaje de carga dentro de galleryGrid para eliminar.');
        }
        
        if (imagesData.length === 0) {
            const noImagesMessage = document.createElement('p');
            noImagesMessage.classList.add('info-message');
            noImagesMessage.textContent = 'No se encontraron imágenes.';
            galleryGrid.appendChild(noImagesMessage);
            return;
        }

        console.log('6. Iniciando bucle para crear elementos de galería...');
        imagesData.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.dataset.id = image.id;

            galleryItem.innerHTML = `
                <img src="${image.download_url}" alt="Foto por ${image.author}">
                <div class="gallery-item-info">
                    <h3>Autor: ${image.author}</h3>
                    <p>ID: ${image.id}</p>
                </div>
            `;
            galleryGrid.appendChild(galleryItem); // ¡Aquí se añaden los ítems!

            // Añadir evento para ver detalles al hacer clic en el ítem
            galleryItem.addEventListener('click', () => {
                navigateTo(`/detail/${image.id}`);
            });
        });
        console.log('7. Bucle de creación de elementos finalizado.');

    } catch (error) {
        console.error('Error CATCH al cargar imágenes:', error);
        // Asegurarse de que el mensaje de carga/error se limpia y se pone uno nuevo
        galleryGrid.innerHTML = ''; // Limpiar cualquier cosa existente, incluido el spinner
        const errorMessageInGrid = document.createElement('p');
        errorMessageInGrid.classList.add('error-message');
        errorMessageInGrid.textContent = `Error al cargar imágenes: ${error.message}. Por favor, inténtalo de nuevo.`;
        galleryGrid.appendChild(errorMessageInGrid);
    }
}

/**
 * Renderiza la página de detalles de una imagen específica.
 * @param {string} imageId - El ID de la imagen a mostrar.
 */
async function renderImageDetailPage(imageId) {
    resetAppContainerStyles(); // Resetear estilos al cargar la página de detalle

    // Aquí mostramos el mensaje de carga específico para la página de detalle
    appContainer.innerHTML = `<p class="loading-message">Cargando detalles de la imagen ${imageId}...</p>`;
    // Ajustar appContainer para centrar el mensaje de carga
    appContainer.style.display = 'flex';
    appContainer.style.flexDirection = 'column';
    appContainer.style.justifyContent = 'center';
    appContainer.style.alignItems = 'center';

    try {
        const imageUrl = `${PICSUM_BASE_URL}/id/${imageId}/800/600`;

        appContainer.innerHTML = `
            <div class="image-detail">
                <h2>Detalles de la Imagen #${imageId}</h2>
                <img src="${imageUrl}" alt="Imagen detallada ${imageId}">
                <p>Esta es una vista detallada de la imagen ${imageId}.</p>
                <p>En una aplicación real, aquí se mostrarían más datos (fecha, cámara, etc.) obtenidos de la API.</p>
                <button onclick="navigateTo('/gallery')">Volver a la Galería</button>
            </div>
        `;
        resetAppContainerStyles(); // Resetear después de cargar el contenido final
    } catch (error) {
        console.error('Error al cargar detalles de la imagen:', error);
        appContainer.innerHTML = ''; // Limpiar el contenido anterior
        displayMessage(`Error al cargar detalles de la imagen: ${error.message}.`, 'error');
    }
}


// =========================================================
// Lógica Principal del Router (HandleLocation)
// =========================================================

/**
 * Analiza la URL actual y renderiza el contenido correspondiente de la SPA.
 */
async function handleLocation() {
    const path = window.location.pathname;
    console.log('Ruta actual:', path);

    // Siempre limpiamos el contenedor antes de renderizar la nueva página
    appContainer.innerHTML = '';

    // Lógica de ruteo condicional
    if (path === '/' || path === '/home' || path === '/index.html') {
        renderHomePage();
    } else if (path === '/gallery') {
        await renderGalleryPage();
    } else if (path.startsWith('/detail/')) {
        const imageId = path.split('/detail/')[1];
        if (imageId) {
            await renderImageDetailPage(imageId);
        } else {
            displayMessage('ID de imagen no especificado.', 'error');
        }
    } else if (path === '/about') {
        renderAboutPage();
    } else {
        displayMessage(`404: Ruta no encontrada - ${path}`, 'error');
    }
}

// =========================================================
// Manejo de Eventos del DOM
// =========================================================

// Configura los event listeners para los botones de navegación.
navButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const path = event.target.dataset.path;
        navigateTo(path);
    });
});

// Escucha el evento 'popstate' para manejar los botones de atrás/adelante del navegador.
window.addEventListener('popstate', handleLocation);

// Carga la página inicial cuando el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    handleLocation();
});


// =========================================================
// Explicación de Conceptos Avanzados de JavaScript (Para la sustentación)
// =========================================================

/*
 * Hoisting:
 * En JavaScript, las declaraciones de variables con `var` y las declaraciones de funciones
 * son "elevadas" (hoisted) al inicio de su ámbito. Esto significa que puedes usar una función
 * antes de que sea declarada físicamente en el código.
 *
 * Ejemplo de Hoisting de función:
 * saludar(); // Esto funciona, aunque la función se declare después.
 * function saludar() { console.log("¡Hola desde Hoisting!"); }
 *
 * Ejemplo de Hoisting de var:
 * console.log(miVariableVar); // undefined (la declaración es elevada, pero la asignación no)
 * var miVariableVar = "Soy una variable hoisted";
 *
 * Las variables `let` y `const` también son "hoisted", pero entran en una
 * "Zona Muerta Temporal" (Temporal Dead Zone - TDZ) desde el inicio del ámbito hasta su declaración.
 * Esto significa que no puedes acceder a ellas antes de que sean declaradas, lo que previene errores comunes.
 * En este proyecto, hemos definido las funciones antes de su primera llamada para mayor claridad y robustez,
 * aunque el hoisting de funciones permitiría lo contrario.
 */

/*
 * Closures:
 * Un Closure es una función que "recuerda" el entorno (o scope léxico) en el que fue creada,
 * incluso si esa función es ejecutada fuera de ese entorno. Esto le permite acceder
 * a variables de su ámbito exterior.
 *
 * Ejemplo de Closure:
 * function crearContador() {
 * let count = 0; // Esta variable está en el ámbito léxico de crearContador
 * // La función interna `incrementar` forma un closure
 * // porque "recuerda" y puede acceder a `count`
 * function incrementar() {
 * count++;
 * console.log(`Contador: ${count}`);
 * }
 * return incrementar; // Devolvemos la función interna
 * }
 * const contador1 = crearContador(); // contador1 es una instancia del closure
 * contador1(); // Output: Contador: 1
 * contador1(); // Output: Contador: 2
 * const contador2 = crearContador(); // contador2 es OTRA instancia independiente del closure
 * contador2(); // Output: Contador: 1 (comienza su propio conteo)
 * contador1(); // Output: Contador: 3 (sigue el conteo de contador1)
 *
 * En este proyecto, los event listeners (por ejemplo, el que maneja el botón 'Cargar' en la galería,
 * o los clics en los ítems de la galería) forman closures. Cuando añades un `addEventListener`,
 * la función que le pasas como segundo argumento "cierra" sobre las variables del ámbito donde fue definida
 * (como `currentImageCount` o `image.id`), permitiendo que acceda a ellas correctamente
 * cuando el evento se dispara.
 */