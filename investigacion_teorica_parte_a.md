# Parte A: Investigación Teórica (Guía para transcribir a mano — 2 Cuartillas)

> [!TIP]
> Este texto está redactado con la extensión y estructura exactas (aproximadamente 2 cuartillas escritas a mano) cubriendo los **3 puntos obligatorios de la rúbrica** (2.0 puntos del parcial).

---

## 1. Fundamentos de Seguridad en la Compilación (`ng build`)

Cuando se ejecuta el comando `ng build` en Angular para generar los paquetes (*bundles*) de producción dentro del directorio `dist/`, el compilador de Angular ejecuta una serie de transformaciones arquitectónicas que no solo optimizan el rendimiento, sino que blindan la seguridad e integridad de la aplicación antes de ser enviada al navegador:

1. **Compilación Ahead-of-Time (AOT):**
   A diferencia de la compilación *Just-in-Time* (JIT), donde las plantillas HTML se compilan en el navegador del usuario en tiempo de ejecución, el compilador **AOT** traduce todas las plantillas HTML y expresiones de enlace de datos (*data bindings*) a instrucciones nativas de JavaScript durante la fase de construcción. Esto aporta dos ventajas críticas de seguridad:
   - **Eliminación de inyección de plantillas (*Template Injection*):** El compilador no se envía al navegador, por lo que un atacante no puede inyectar ni compilar plantillas maliciosas en tiempo de ejecución.
   - **Verificación estática de tipos y enlaces:** Cualquier error de sintaxis o acceso indebido a propiedades privadas es detectado antes del despliegue.

2. **Tree Shaking y Minificación:**
   Durante el empaquetado de producción, herramientas como Rollup/esbuild analizan el grafo estático de importaciones (*ES Modules*) y eliminan todo el código muerto, librerías no referenciadas y utilidades de depuración (*Tree Shaking*). Esto reduce la **superficie de ataque** de la aplicación, garantizando que ningún método o módulo sin usar quede expuesto en el cliente. Adicionalmente, la minificación elimina comentarios y renombra identificadores internos.

3. **Aislamiento de Código y *Output Hashing*:**
   Angular encapsula cada componente con sus propios estilos y alcance léxico, y mediante la carga diferida (*Lazy Loading* con `loadComponent`) divide la aplicación en fragmentos aislados (*chunks*). Además, la opción `"outputHashing": "all"` agrega un hash criptográfico al nombre de cada archivo generado (por ejemplo, `main-7F3A9C1B.js`). Si el contenido de un archivo cambiara un solo byte, su hash cambiaría, garantizando la integridad frente a cachés intermedias alteradas.

---

## 2. Componentes de Protección e Integridad en Angular

Angular implementa un modelo de seguridad por defecto para proteger el DOM y las comunicaciones HTTP frente a las vulnerabilidades web más comunes:

1. **Prevención de *Cross-Site Scripting* (XSS) y Sanitización Automática:**
   Angular trata **todos los valores dinámicos como no confiables por defecto**.
   - Cuando se utiliza **interpolación** (`{{ valor }}`), Angular escapa automáticamente caracteres especiales como `<`, `>`, `&` y `"`, convirtiéndolos en texto plano para que el navegador jamás los interprete como etiquetas `<script>` ejecutables.
   - Cuando se enlaza una propiedad como `[innerHTML]`, `[href]`, `[src]` o `[style]`, el motor interno de sanitización de Angular inspecciona el valor según su contexto de seguridad (*HTML*, *Style*, *URL* o *ResourceURL*), eliminando etiquetas peligrosas (`<script>`, `<object>`) y atributos de eventos como `onerror`, `onload` o esquemas `javascript:`.

2. **Protección mediante `DomSanitizer`:**
   El servicio `DomSanitizer` de `@angular/platform-browser` permite sanitizar valores manualmente (`sanitize()`) o, en casos estrictamente controlados donde el desarrollador confía plenamente en el origen del recurso (por ejemplo, la URL fija de un `<iframe>` de YouTube definida en el código fuente), marcar un valor como seguro mediante métodos explícitos como `bypassSecurityTrustResourceUrl()`. Su nombre advierte explícitamente del riesgo para evitar que se aplique sobre entradas proporcionadas por el usuario.

3. **Mitigación de *Cross-Site Request Forgery* (XSRF / CSRF):**
   El módulo `HttpClient` de Angular incorpora protección automática contra falsificación de peticiones en sitios cruzados mediante el patrón *Double Submit Cookie*. Cuando el servidor establece una cookie legible llamada por defecto `XSRF-TOKEN`, el interceptor de Angular la lee y adjunta su valor en la cabecera HTTP `X-XSRF-TOKEN` en cada petición mutadora (`POST`, `PUT`, `DELETE`). Como un sitio atacante externo no puede leer cookies de otro dominio por la política del mismo origen (*Same-Origin Policy*), no puede falsificar la cabecera.

---

## 3. Preservación de Seguridad en Firebase Hosting

Al desplegar los artefactos compilados mediante `firebase deploy --only hosting`, Firebase Hosting preserva la integridad y confidencialidad del sistema a nivel de infraestructura:

1. **Certificados SSL/TLS Automáticos (HTTPS Obligatorio):**
   Firebase aprovisiona y renueva automáticamente certificados TLS gratuitos para los dominios `.web.app` y `.firebaseapp.com`. Cualquier petición realizada por `http://` es redirigida automáticamente a `https://`, cifrando el tráfico extremo a extremo e impidiendo ataques *Man-in-the-Middle* (MitM) que intenten modificar los bundles de JavaScript en tránsito.

2. **Configuración de Cabeceras HTTP de Seguridad (`firebase.json`):**
   Dentro de `firebase.json` se definen cabeceras de respuesta en el borde de la CDN que refuerzan la seguridad del navegador:
   - **`Content-Security-Policy` (CSP):** Restringe los orígenes desde los cuales se pueden cargar scripts (`script-src 'self'`), videos (`media-src 'self'`) e iframes autorizados.
   - **`Strict-Transport-Security` (HSTS):** Obliga al navegador a conectarse únicamente mediante HTTPS.
   - **`X-Frame-Options: DENY` y `frame-ancestors 'none'`:** Impiden que la página sea incrustada en un `<iframe>` externo, bloqueando ataques de *Clickjacking*.
   - **`X-Content-Type-Options: nosniff`:** Impide que el navegador adivine el tipo MIME de un archivo y ejecute archivos estáticos como scripts.

3. **Rutas Estáticas, Inmutabilidad y Aislamiento de Recursos:**
   Firebase Hosting sirve únicamente archivos estáticos precompilados desde una red global de distribución de contenidos (CDN) respaldada por Google, sin exponer un intérprete de servidor ni bases de datos directas. Cada despliegue genera una versión inmutable y atómica (con posibilidad de *rollback* inmediato), mientras que la regla `rewrites` redirige de forma segura las rutas virtuales de la SPA hacia `/index.html` sin exponer la estructura interna del servidor.
