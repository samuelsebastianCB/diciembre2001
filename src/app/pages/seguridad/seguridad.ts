import { Component, signal } from '@angular/core';

interface Capa {
  titulo: string;
  icono: string;
  puntos: { nombre: string; detalle: string }[];
}

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.html',
  styleUrl: './seguridad.css',
})
export class Seguridad {
  // ---------- Demostración XSS ----------
  protected readonly ataques = [
    '<img src="x" onerror="alert(\'Hackeado\')">',
    '<script>alert("XSS")</script><b>Hola</b>',
    '<a href="javascript:alert(1)">Haz clic</a>',
    '<h3 style="color:orange">Texto con formato</h3>',
  ];
  protected readonly entrada = signal(this.ataques[0]);

  protected actualizar(evento: Event): void {
    this.entrada.set((evento.target as HTMLTextAreaElement).value);
  }

  // ---------- Revisión de cabeceras ----------
  protected readonly cabecerasClave = [
    'content-security-policy',
    'strict-transport-security',
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy',
  ];
  protected readonly cabeceras = signal<{ nombre: string; valor: string | null }[]>([]);
  protected readonly revisando = signal(false);
  protected readonly protocolo = location.protocol;

  /** Hace una petición HEAD al propio sitio y lee las cabeceras de seguridad */
  protected async revisarCabeceras(): Promise<void> {
    this.revisando.set(true);
    try {
      const res = await fetch(location.origin + '/', { method: 'HEAD', cache: 'no-store' });
      this.cabeceras.set(this.cabecerasClave.map((nombre) => ({ nombre, valor: res.headers.get(nombre) })));
    } finally {
      this.revisando.set(false);
    }
  }

  // ---------- Capas de seguridad ----------
  protected readonly abierta = signal(0);

  protected readonly capas: Capa[] = [
    {
      titulo: 'Compilación (ng build)',
      icono: '🏗️',
      puntos: [
        { nombre: 'AOT (Ahead-of-Time)', detalle: 'Las plantillas se compilan a JavaScript antes del despliegue; el navegador no evalúa plantillas, por lo que no existe inyección de plantillas en tiempo de ejecución.' },
        { nombre: 'Tree shaking y minificación', detalle: 'Se elimina el código no utilizado y se ofusca el resultado, reduciendo la superficie de ataque y el tamaño de los archivos.' },
        { nombre: 'Archivos con hash', detalle: 'Cada bundle se nombra con un hash de su contenido (main-ABC123.js): cualquier cambio genera un archivo nuevo y evita servir código alterado desde caché.' },
        { nombre: 'Lazy loading', detalle: 'Cada página se compila en un chunk independiente, aislando el código de cada sección.' },
      ],
    },
    {
      titulo: 'Angular en tiempo de ejecución',
      icono: '🛡️',
      puntos: [
        { nombre: 'Sanitización automática', detalle: 'Toda interpolación {{ }} se escapa, y los enlaces [innerHTML], [href], [src] y [style] se sanitizan para eliminar scripts y URLs peligrosas.' },
        { nombre: 'Prevención de XSS', detalle: 'Angular trata todos los valores como no confiables por defecto; los atributos on* y las URLs javascript: se eliminan (ver demostración abajo).' },
        { nombre: 'DomSanitizer', detalle: 'Solo se usa bypassSecurityTrustResourceUrl para el iframe de YouTube, con una URL fija escrita en el código, nunca con datos del usuario.' },
        { nombre: 'Protección XSRF', detalle: 'HttpClient de Angular incluye soporte para enviar el token XSRF-TOKEN en la cabecera X-XSRF-TOKEN. Esta app no envía formularios a un servidor, por lo que no hay superficie XSRF.' },
      ],
    },
    {
      titulo: 'Firebase Hosting',
      icono: '☁️',
      puntos: [
        { nombre: 'SSL/TLS automático', detalle: 'Firebase emite y renueva certificados gratuitamente; todo el tráfico va por HTTPS y HTTP se redirige automáticamente.' },
        { nombre: 'Cabeceras de seguridad', detalle: 'En firebase.json se configuran Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y Permissions-Policy.' },
        { nombre: 'Contenido estático e inmutable', detalle: 'Solo se suben archivos estáticos; no hay código de servidor que explotar. Cada deploy es una versión atómica que puede revertirse.' },
        { nombre: 'Aislamiento y CDN', detalle: 'El sitio se distribuye en la CDN global de Google, con protección contra DDoS, y aislado de otros proyectos.' },
      ],
    },
  ];
}
