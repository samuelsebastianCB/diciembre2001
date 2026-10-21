/**
 * Diagramas de secuencia (sintaxis Mermaid) que documentan cada página.
 * Se renderizan como SVG en tiempo de ejecución en la página de Documentación.
 */
export interface Diagrama {
  id: string;
  titulo: string;
  archivos: string[];
  explicacion: string;
  codigo: string;
}

export const DIAGRAMAS: Diagrama[] = [
  {
    id: 'carga',
    titulo: 'Carga inicial y navegación (general)',
    archivos: ['src/index.html', 'src/main.ts', 'src/app/app.ts', 'src/app/app.routes.ts', 'firebase.json'],
    explicacion:
      'El navegador solicita el sitio a Firebase Hosting. Gracias a la regla "rewrites" de firebase.json, cualquier ruta devuelve index.html; ' +
      'después main.ts arranca el componente raíz App y el Router carga de forma diferida (lazy) el componente de la página solicitada.',
    codigo: `sequenceDiagram
  actor U as Usuario
  participant N as Navegador
  participant F as Firebase Hosting (CDN)
  participant M as main.ts
  participant A as App (app.ts)
  participant R as Router (app.routes.ts)
  U->>N: Abre la URL pública
  N->>F: GET / (HTTPS)
  F-->>N: index.html + cabeceras de seguridad
  N->>F: GET main-[hash].js, styles-[hash].css
  F-->>N: Bundles compilados (AOT)
  N->>M: Ejecuta bootstrapApplication()
  M->>A: Crea componente raíz
  A->>R: Evalúa la ruta actual
  R->>F: GET chunk-[hash].js (lazy)
  F-->>R: Código de la página
  R-->>A: Inserta página en <router-outlet>
  A-->>U: Página renderizada`,
  },
  {
    id: 'inicio',
    titulo: 'Página 1 · Inicio',
    archivos: ['src/app/pages/inicio/inicio.ts', 'src/app/pages/inicio/inicio.html', 'src/app/pages/inicio/inicio.css'],
    explicacion:
      'Al iniciarse, el componente genera las estrellas y arranca un intervalo que actualiza un signal cada segundo; ' +
      'el computed "transcurrido" recalcula el contador. Al hacer clic en una tarjeta se actualiza su estado y CSS ejecuta la animación de giro.',
    codigo: `sequenceDiagram
  actor U as Usuario
  participant V as inicio.html
  participant C as Inicio (inicio.ts)
  participant S as Signals
  C->>C: ngOnInit()
  C->>S: setInterval cada 1 s -> ahora.set(new Date())
  loop Cada segundo
    S->>S: computed transcurrido()
    S-->>V: Actualiza días / horas / minutos / segundos
  end
  U->>V: Clic en tarjeta
  V->>C: voltear(i)
  C->>S: tarjetas.update()
  S-->>V: [class.volteada] = true
  V-->>U: Animación CSS rotateY(180deg)
  C->>C: ngOnDestroy() -> clearInterval()`,
  },
  {
    id: 'datos',
    titulo: 'Página 2 · Datos importantes',
    archivos: [
      'src/app/pages/datos/datos.ts',
      'src/app/pages/datos/datos.html',
      'src/app/data/eventos.ts',
      'public/video/diciembre2001.mp4',
    ],
    explicacion:
      'Los eventos se importan desde un archivo TypeScript (no hay base de datos). El filtro por categoría usa un signal y un computed. ' +
      'El video local se sirve desde Firebase Hosting; el de YouTube se inserta en un iframe cuya URL se valida con DomSanitizer.',
    codigo: `sequenceDiagram
  actor U as Usuario
  participant V as datos.html
  participant C as Datos (datos.ts)
  participant D as eventos.ts
  participant F as Firebase Hosting
  participant Y as YouTube (nocookie)
  C->>D: import EVENTOS_DICIEMBRE_2001
  D-->>C: Arreglo de eventos
  C-->>V: @for evento de eventos()
  U->>V: Clic en filtro "Economía"
  V->>C: filtro.set('Economía')
  C-->>V: computed eventos() filtrados
  alt Pestaña YouTube
    V->>Y: iframe src (SafeResourceUrl)
    Y-->>V: Reproductor embebido
  else Pestaña Video del hosting
    V->>F: GET /video/diciembre2001.mp4
    F-->>V: Stream de video (tiempo real)
  end`,
  },
  {
    id: 'documentacion',
    titulo: 'Página 3 · Documentación técnica',
    archivos: [
      'src/app/pages/documentacion/documentacion.ts',
      'src/app/pages/documentacion/documentacion.html',
      'src/app/data/diagramas.ts',
    ],
    explicacion:
      'Esta misma página: tras el primer renderizado se importa la librería Mermaid de forma diferida y se convierte el texto de cada diagrama en un SVG.',
    codigo: `sequenceDiagram
  actor U as Usuario
  participant C as Documentacion (documentacion.ts)
  participant D as diagramas.ts
  participant M as Mermaid (lazy)
  participant V as documentacion.html
  U->>C: Navega a /documentacion
  C->>D: import DIAGRAMAS
  C-->>V: Pinta tarjetas y árbol de archivos
  C->>M: afterNextRender -> import('mermaid')
  loop Por cada diagrama
    C->>M: mermaid.render(id, codigo)
    M-->>C: SVG (sanitizado, securityLevel strict)
    C-->>V: Inserta SVG en su contenedor
  end`,
  },
  {
    id: 'seguridad',
    titulo: 'Página 4 · Seguridad',
    archivos: ['src/app/pages/seguridad/seguridad.ts', 'src/app/pages/seguridad/seguridad.html', 'firebase.json'],
    explicacion:
      'La demostración XSS envía el texto del usuario a [innerHTML]; Angular lo sanitiza antes de tocar el DOM. ' +
      'El botón de cabeceras hace una petición HEAD al propio sitio y muestra las cabeceras configuradas en firebase.json.',
    codigo: `sequenceDiagram
  actor U as Usuario
  participant V as seguridad.html
  participant C as Seguridad (seguridad.ts)
  participant S as Sanitizer de Angular
  participant F as Firebase Hosting
  U->>V: Escribe <img src=x onerror=alert(1)>
  V->>C: entrada.set(texto)
  C->>S: [innerHTML] = entrada()
  S-->>V: HTML limpio (sin onerror / script)
  V-->>U: Se muestra sin ejecutar código
  U->>V: Clic "Revisar cabeceras"
  V->>C: revisarCabeceras()
  C->>F: fetch(location.origin, HEAD)
  F-->>C: CSP, HSTS, X-Frame-Options...
  C-->>V: Tabla de cabeceras`,
  },
];
