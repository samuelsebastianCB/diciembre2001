import { Component, ElementRef, afterNextRender, signal, viewChildren } from '@angular/core';
import { DIAGRAMAS } from '../../data/diagramas';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.html',
  styleUrl: './documentacion.css',
})
export class Documentacion {
  protected readonly diagramas = DIAGRAMAS;
  protected readonly cargando = signal(true);
  protected readonly error = signal(false);

  /** Contenedores donde se insertará el SVG de cada diagrama */
  private readonly lienzos = viewChildren<ElementRef<HTMLDivElement>>('lienzo');

  /** Estructura de carpetas del proyecto */
  protected readonly arbol = `diciembre2001/
├── angular.json            ← Configuración de compilación (ng build)
├── firebase.json           ← Hosting: carpeta pública, rewrites y cabeceras de seguridad
├── .firebaserc             ← Proyecto de Firebase vinculado
├── package.json            ← Dependencias (Angular, Mermaid)
├── public/
│   ├── favicon.ico
│   └── video/
│       └── diciembre2001.mp4   ← Video alojado en Firebase Hosting
└── src/
    ├── index.html          ← HTML base: contiene <app-root>
    ├── main.ts             ← Punto de entrada: bootstrapApplication()
    ├── styles.css          ← Estilos globales (tema espacial)
    └── app/
        ├── app.ts / .html / .css   ← Componente raíz: barra de navegación + <router-outlet>
        ├── app.config.ts           ← Proveedores (Router)
        ├── app.routes.ts           ← Rutas con carga diferida (lazy loading)
        ├── data/
        │   ├── eventos.ts          ← Datos históricos (sustituye a una base de datos)
        │   └── diagramas.ts        ← Diagramas de secuencia de esta página
        └── pages/
            ├── inicio/          ← Página 1: bienvenida animada
            ├── datos/           ← Página 2: eventos + video
            ├── documentacion/   ← Página 3: esta documentación
            └── seguridad/       ← Página 4: seguridad del sistema`;

  protected readonly pasos = [
    { cmd: 'npm install -g @angular/cli', desc: 'Instalar Angular CLI.' },
    { cmd: 'ng new diciembre2001 --routing --style=css --ssr=false', desc: 'Crear el proyecto con enrutamiento y sin SSR.' },
    { cmd: 'ng serve', desc: 'Servidor de desarrollo en http://localhost:4200.' },
    { cmd: 'ng build', desc: 'Compilación de producción (AOT, minificación, tree shaking) en dist/diciembre2001/browser.' },
    { cmd: 'firebase login', desc: 'Iniciar sesión con la cuenta de Google.' },
    { cmd: 'firebase init hosting', desc: 'Vincular el proyecto y generar firebase.json.' },
    { cmd: 'firebase deploy --only hosting', desc: 'Publicar el sitio en la URL pública *.web.app.' },
  ];

  constructor() {
    // Se ejecuta solo en el navegador, después del primer renderizado.
    afterNextRender(() => this.renderizarDiagramas());
  }

  private async renderizarDiagramas(): Promise<void> {
    try {
      // Importación diferida: Mermaid solo se descarga al visitar esta página.
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        sequence: { mirrorActors: false },
      });

      const lienzos = this.lienzos();
      for (let i = 0; i < this.diagramas.length; i++) {
        const d = this.diagramas[i];
        const { svg } = await mermaid.render(`diagrama-${d.id}`, d.codigo);
        lienzos[i].nativeElement.innerHTML = svg;
      }
    } catch (e) {
      console.error(e);
      this.error.set(true);
    } finally {
      this.cargando.set(false);
    }
  }
}
