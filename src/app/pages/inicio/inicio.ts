import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Estrella {
  x: number;
  y: number;
  tam: number;
  retraso: number;
}

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, OnDestroy {
  /** Fecha de nacimiento: jueves 6 de diciembre de 2001 */
  private readonly nacimiento = new Date(2001, 11, 6);

  /** Estrellas generadas aleatoriamente para el fondo animado */
  protected readonly estrellas: Estrella[] = Array.from({ length: 120 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    tam: Math.random() * 2 + 0.5,
    retraso: Math.random() * 5,
  }));

  private readonly ahora = signal(new Date());
  private intervalo?: ReturnType<typeof setInterval>;

  /** Tiempo transcurrido desde el nacimiento, recalculado cada segundo */
  protected readonly transcurrido = computed(() => {
    const ms = this.ahora().getTime() - this.nacimiento.getTime();
    const segundos = Math.floor(ms / 1000);
    return {
      dias: Math.floor(segundos / 86400),
      horas: Math.floor(segundos / 3600),
      minutos: Math.floor(segundos / 60),
      segundos,
    };
  });

  /** Tarjetas interactivas que se voltean al hacer clic */
  protected readonly tarjetas = signal([
    { frente: '🌍 El mundo', reverso: 'Diciembre de 2001: el mundo vivía las secuelas del 11-S y el inicio de la guerra en Afganistán.', volteada: false },
    { frente: '💻 Tecnología', reverso: 'Ese año nacieron el iPod, Windows XP y Wikipedia. Internet comenzaba a cambiarlo todo.', volteada: false },
    { frente: '🎬 Cine', reverso: 'El 19 de diciembre se estrenó "El Señor de los Anillos: La Comunidad del Anillo".', volteada: false },
    { frente: '🚀 2001', reverso: 'El año que Kubrick imaginó en "2001: Odisea del espacio" (1968) finalmente llegó.', volteada: false },
  ]);

  ngOnInit(): void {
    this.intervalo = setInterval(() => this.ahora.set(new Date()), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  protected voltear(indice: number): void {
    this.tarjetas.update((lista) =>
      lista.map((t, i) => (i === indice ? { ...t, volteada: !t.volteada } : t)),
    );
  }
}
