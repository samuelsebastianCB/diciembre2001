import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly menuAbierto = signal(false);

  protected readonly enlaces = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/datos', texto: 'Datos importantes' },
    { ruta: '/documentacion', texto: 'Documentación' },
    { ruta: '/seguridad', texto: 'Seguridad' },
  ];

  protected alternarMenu(): void {
    this.menuAbierto.update((v) => !v);
  }
}
