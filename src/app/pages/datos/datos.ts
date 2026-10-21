import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Categoria, EVENTOS_DICIEMBRE_2001, HITOS_2001 } from '../../data/eventos';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.html',
  styleUrl: './datos.css',
})
export class Datos {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly hitos = HITOS_2001;
  protected readonly categorias: (Categoria | 'Todas')[] = ['Todas', 'Mundo', 'Economía', 'Tecnología', 'Cultura'];
  protected readonly filtro = signal<Categoria | 'Todas'>('Todas');

  /** Lista filtrada de forma reactiva según la categoría elegida */
  protected readonly eventos = computed(() => {
    const f = this.filtro();
    return f === 'Todas' ? EVENTOS_DICIEMBRE_2001 : EVENTOS_DICIEMBRE_2001.filter((e) => e.categoria === f);
  });

  // ---------- Video ----------
  /** Video local alojado en Firebase Hosting (carpeta public/video) */
  protected readonly videoLocal = 'video/diciembre2001.mp4';
  protected readonly videoLocalDisponible = signal(true);
  protected readonly fuente = signal<'hosting' | 'youtube'>('youtube');

  /**
   * URL de YouTube (tráiler de "2001: Odisea del espacio").
   * Angular bloquea por defecto URLs de recursos en un iframe; aquí se marca
   * como confiable de forma explícita porque es una URL fija escrita en el código
   * (nunca proviene del usuario).
   */
  protected readonly urlYoutube: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube-nocookie.com/embed/oR_e9y-bka0',
  );
}
