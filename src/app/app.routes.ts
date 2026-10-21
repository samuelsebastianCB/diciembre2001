import { Routes } from '@angular/router';

// Cada página se carga de forma diferida (lazy loading) para generar
// bundles más pequeños y aislados en la compilación de producción.
export const routes: Routes = [
  {
    path: '',
    title: 'Inicio | Diciembre 2001',
    loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'datos',
    title: 'Datos importantes | Diciembre 2001',
    loadComponent: () => import('./pages/datos/datos').then((m) => m.Datos),
  },
  {
    path: 'documentacion',
    title: 'Documentación técnica | Diciembre 2001',
    loadComponent: () =>
      import('./pages/documentacion/documentacion').then((m) => m.Documentacion),
  },
  {
    path: 'seguridad',
    title: 'Seguridad | Diciembre 2001',
    loadComponent: () => import('./pages/seguridad/seguridad').then((m) => m.Seguridad),
  },
  { path: '**', redirectTo: '' },
];
