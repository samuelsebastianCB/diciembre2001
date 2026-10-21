/**
 * Datos estáticos de la aplicación.
 * No se usa base de datos: la información vive en este archivo TypeScript
 * y se empaqueta en el bundle durante `ng build`.
 */

export type Categoria = 'Mundo' | 'Economía' | 'Tecnología' | 'Cultura';

export interface Evento {
  dia: number;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  destacado?: boolean;
}

/** Acontecimientos históricos de diciembre de 2001 */
export const EVENTOS_DICIEMBRE_2001: Evento[] = [
  {
    dia: 1,
    titulo: 'Nace la princesa Aiko de Japón',
    descripcion: 'Nace Aiko, hija única del entonces príncipe heredero Naruhito y la princesa Masako.',
    categoria: 'Mundo',
  },
  {
    dia: 2,
    titulo: 'Quiebra de Enron',
    descripcion:
      'Enron se declara en bancarrota, en ese momento la mayor quiebra de la historia de EE. UU., tras revelarse un enorme fraude contable.',
    categoria: 'Economía',
  },
  {
    dia: 3,
    titulo: 'Presentación del Segway',
    descripcion: 'Dean Kamen presenta el Segway PT, el transportador personal autoequilibrado, en televisión nacional.',
    categoria: 'Tecnología',
  },
  {
    dia: 5,
    titulo: 'Acuerdo de Bonn',
    descripcion:
      'Se firma en Alemania el Acuerdo de Bonn, que establece un gobierno provisional para Afganistán tras la caída del régimen talibán.',
    categoria: 'Mundo',
  },
  {
    dia: 6,
    titulo: '¡Mi nacimiento! 🎉',
    descripcion: 'Jueves 6 de diciembre de 2001: el día en que nací y el motivo de este proyecto.',
    categoria: 'Cultura',
    destacado: true,
  },
  {
    dia: 11,
    titulo: 'China ingresa a la OMC',
    descripcion:
      'China se convierte oficialmente en miembro de la Organización Mundial del Comercio, transformando la economía global.',
    categoria: 'Economía',
  },
  {
    dia: 13,
    titulo: 'Ataque al Parlamento de la India',
    descripcion: 'Un ataque armado contra el Parlamento en Nueva Delhi eleva las tensiones entre India y Pakistán.',
    categoria: 'Mundo',
  },
  {
    dia: 19,
    titulo: 'Estreno de "La Comunidad del Anillo"',
    descripcion:
      'Se estrena la primera película de la trilogía de El Señor de los Anillos de Peter Jackson, un hito del cine fantástico.',
    categoria: 'Cultura',
  },
  {
    dia: 20,
    titulo: 'Crisis en Argentina',
    descripcion:
      'En medio del "corralito" y las protestas del "cacerolazo", renuncia el presidente Fernando de la Rúa.',
    categoria: 'Economía',
  },
  {
    dia: 22,
    titulo: 'Hamid Karzai asume en Afganistán',
    descripcion: 'Karzai toma posesión como presidente de la Administración Provisional de Afganistán.',
    categoria: 'Mundo',
  },
  {
    dia: 22,
    titulo: 'Intento de atentado del "shoe bomber"',
    descripcion:
      'Richard Reid intenta detonar explosivos ocultos en su zapato en un vuelo París–Miami; desde entonces se revisan los zapatos en aeropuertos.',
    categoria: 'Mundo',
  },
];

/** Hitos importantes del año 2001 completo */
export const HITOS_2001 = [
  { mes: 'Enero', texto: 'Se lanza Wikipedia (15 de enero).' },
  { mes: 'Enero', texto: 'George W. Bush asume la presidencia de EE. UU.' },
  { mes: 'Marzo', texto: 'La estación espacial rusa Mir reingresa a la atmósfera.' },
  { mes: 'Abril', texto: 'Dennis Tito se convierte en el primer turista espacial.' },
  { mes: 'Septiembre', texto: 'Atentados del 11 de septiembre en Nueva York y Washington.' },
  { mes: 'Octubre', texto: 'Apple presenta el iPod y Microsoft lanza Windows XP.' },
  { mes: 'Noviembre', texto: 'Se estrena "Harry Potter y la piedra filosofal".' },
];
