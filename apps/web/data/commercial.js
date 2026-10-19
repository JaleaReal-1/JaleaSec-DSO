export const founders5 = {
  active: true,
  name: 'JaleaSec Founders 5',
  discount: 25,
  projectLimit: 5,
  // Define un número entre 0 y 5 solo cuando se haya verificado manualmente.
  availableSpots: null,
  terms: [
    'Promoción limitada a 5 proyectos web confirmados.',
    'No aplica a apps ni sistemas personalizados.',
    'Dominio, hosting y mantenimiento se cotizan aparte.',
    'Se requiere un adelanto del 50 % del precio acordado para confirmar el proyecto.',
  ],
};

export const webPackages = [
  {
    id: 'jalea-portfolio',
    name: 'Jalea Portfolio',
    segment: 'Universitarios',
    price: 480,
    promotionalPrice: 360,
    description: 'Portafolio de una página, hasta 4 secciones y 1 revisión.',
  },
  {
    id: 'jalea-negocio',
    name: 'Jalea Negocio',
    segment: 'Negocios',
    price: 920,
    promotionalPrice: 690,
    description: 'Landing page de hasta 5 secciones, galería, WhatsApp, SEO básico y 2 revisiones.',
  },
  {
    id: 'jalea-business',
    name: 'Jalea Business',
    segment: 'Negocios',
    price: 1600,
    promotionalPrice: 1200,
    description:
      'Sitio de hasta 4 páginas, diseño responsive, WhatsApp, SEO básico y 2 revisiones.',
  },
];

export const customSoftwareOffer = {
  name: 'Apps y sistemas personalizados',
  price: 'Únicamente bajo cotización',
};

export function formatSoles(value) {
  return `S/ ${new Intl.NumberFormat('es-PE').format(value)}`;
}

export function foundersMessage(packageName) {
  return `Hola, JaleaSec. Quiero acceder a Founders 5 con el paquete ${packageName}. Quisiera confirmar el alcance y la disponibilidad de la promoción.`;
}
