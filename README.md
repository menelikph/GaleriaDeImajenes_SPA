# 📸 Galería Dinámica de Imágenes

Este proyecto es una **Single Page Application (SPA)** de galería de imágenes construida completamente con **JavaScript, HTML y CSS puro**. Su objetivo principal es demostrar conceptos fundamentales y avanzados de desarrollo web frontend, incluyendo la manipulación dinámica del DOM, el consumo de APIs asíncronas, y patrones de programación modernos.

## 🚀 Características Principales

* **SPA Pura:** Navegación fluida sin recargas de página completas, utilizando la History API de JavaScript.
* **Galería de Imágenes Dinámica:** Carga y muestra imágenes de forma asíncrona desde la API de [Picsum Photos](https://picsum.photos/).
* **Control de Cantidad:** Permite al usuario especificar cuántas imágenes desea cargar (entre 1 y 100).
* **Vista de Detalle:** Al hacer clic en una imagen de la galería, se navega a una vista de detalle para esa imagen específica.
* **Diseño Responsivo:** Adaptable a diferentes tamaños de pantalla (aunque es una base, no está optimizado al máximo para todos los dispositivos).
* **Demostración de Conceptos Avanzados de JS:** Implementa y explica `async/await`, Promesas, Closures y Hoisting.

## 🌟 Conceptos Demostrados

Este proyecto fue diseñado como una base para discutir los siguientes temas durante una evaluación técnica:

### 1. **Estructura de la Aplicación (Resolución de Problemas)**
    * Organización modular del código en funciones específicas (`renderHomePage`, `renderGalleryPage`, `loadImages`, etc.).
    * Gestión del estado de la aplicación (ej. `currentImageCount`).
    * Manejo de rutas en una SPA sin frameworks (utilizando `window.history` y eventos `popstate`).
    * Limpieza y actualización eficiente del DOM (`innerHTML = ''`).

### 2. **Conceptos Avanzados de JavaScript**

    * **`async`/`await` y Promesas:**
        * La función `loadImages` utiliza `async`/`await` para manejar las operaciones asíncronas de `fetch` de una manera legible y síncrona.
        * Se demuestra el manejo de errores con bloques `try...catch` en operaciones asíncronas.
        * Se entiende que `fetch` devuelve una `Promise`, y `await` espera que esa promesa se resuelva (o se rechace).
    * **Closures:**
        * Los `eventListeners` (como el del botón "Cargar" o los clics en los ítems de la galería) crean `closures`. Esto significa que las funciones pasadas a `addEventListener` "recuerdan" y pueden acceder a las variables de su entorno léxico (ej. `currentImageCount`, `image.id`) incluso después de que la función externa (`renderGalleryPage`, `loadImages`) haya terminado de ejecutarse.
    * **Hoisting:**
        * Se explica cómo las declaraciones de funciones (`function funcName() {}`) y variables `var` son elevadas al inicio de su ámbito.
        * Se contrasta con `let` y `const`, que también son "hoisted" pero entran en una "Temporal Dead Zone" (TDZ) hasta su declaración, lo que promueve prácticas de codificación más seguras.

### 3. **Manipulación del DOM (`Document Object Model`)**

    * Uso de `document.getElementById()` y `document.querySelectorAll()` para seleccionar elementos.
    * Actualización del contenido de elementos con `element.innerHTML`.
    * Creación de nuevos elementos dinámicamente con `document.createElement()`.
    * Adición de elementos al DOM con `element.appendChild()`.
    * Modificación de atributos y clases (`element.classList.add()`, `element.dataset`).
    * Eliminación de elementos (`element.remove()`).

### 4. **Consumo de API (`Fetch API`)**

    * Realización de solicitudes HTTP GET a un recurso externo (Picsum Photos) utilizando la `Fetch API`.
    * Manejo de la respuesta de la API (`response.json()`).
    * Verificación del estado de la respuesta (`response.ok`) para manejar errores HTTP.
    * Construcción dinámica de URLs para la API.

## 📂 Estructura del Proyecto

MANEJO_SPA/
├── index.html
├── style.css
└── main.js
