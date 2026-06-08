export interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  attendees: number;
  capacity: number;
  organizerEmail: string;
  organizerName: string;
  createdAt: string;
}

export const CATEGORIES = [
  "Tecnología",
  "Emprendimiento",
  "Arte y Cultura",
  "Deportes",
  "Ciencia",
  "Voluntariado",
  "Música",
  "Diseño",
  "Idiomas",
  "Investigación",
] as const;

export const events: Event[] = [
  {
    id: 1,
    title: "Hackathon UNSA 2026",
    category: "Tecnología",
    date: "2026-06-15",
    location: "Pabellón de Sistemas, UNSA",
    description:
      "Competencia de desarrollo de software de 48 horas. Forma tu equipo y construye soluciones innovadoras para problemas reales de la universidad.",
    attendees: 0,
    capacity: 120,
    organizerEmail: "sistemas@unsa.edu.pe",
    organizerName: "Facultad de Sistemas",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Congreso de Ingeniería 2026",
    category: "Ciencia",
    date: "2026-07-10",
    location: "Auditorio Principal, UNSA",
    description:
      "Congreso anual donde investigadores y estudiantes presentan sus proyectos. Ponencias magistrales, talleres y networking.",
    attendees: 0,
    capacity: 300,
    organizerEmail: "ingenieria@unsa.edu.pe",
    organizerName: "Facultad de Ingeniería",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Workshop de Inteligencia Artificial",
    category: "Tecnología",
    date: "2026-06-28",
    location: "Lab de Cómputo B, UNSA",
    description:
      "Taller práctico de IA con Python. Aprende modelos de machine learning, redes neuronales y casos de uso reales en industria.",
    attendees: 0,
    capacity: 40,
    organizerEmail: "ia@unsa.edu.pe",
    organizerName: "Club de IA UNSA",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Feria de Emprendimiento",
    category: "Emprendimiento",
    date: "2026-07-05",
    location: "Plaza Central, UNSA",
    description:
      "Exhibe tu startup o idea de negocio ante inversores y mentores. Premios para los mejores proyectos.",
    attendees: 0,
    capacity: 200,
    organizerEmail: "emprendimiento@unsa.edu.pe",
    organizerName: "Centro de Emprendimiento",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Concierto de Rock Universitario",
    category: "Música",
    date: "2026-06-20",
    location: "Estadio UNSA",
    description:
      "Bandas universitarias se presentan en el escenario más grande del campus. Entrada libre para estudiantes.",
    attendees: 0,
    capacity: 500,
    organizerEmail: "cultura@unsa.edu.pe",
    organizerName: "Centro Cultural UNSA",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Torneo de Ajedrez",
    category: "Deportes",
    date: "2026-07-01",
    location: "Sala de Usos Múltiples",
    description:
      "Torneo interuniversitario de ajedrez. Categorías principiante, intermedio y avanzado. Trofeos para los primeros lugares.",
    attendees: 0,
    capacity: 64,
    organizerEmail: "deportes@unsa.edu.pe",
    organizerName: "Club de Ajedrez UNSA",
    createdAt: new Date().toISOString(),
  },
];