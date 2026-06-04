import 'dotenv/config';
import { PrismaClient, EventCategory, ServiceCategory, PriceType, ProductCategory, ProductCondition } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');


  const passwordHash = await bcrypt.hash('password123', 10);

  const organizer = await prisma.user.upsert({
    where: { email: 'sistemas@unsa.edu.pe' },
    update: {},
    create: {
      email: 'sistemas@unsa.edu.pe',
      passwordHash,
      name: 'Facultad de Sistemas',
      career: 'Ingeniería de Sistemas',
      role: 'ORGANIZER',
    },
  });

  const organizer2 = await prisma.user.upsert({
    where: { email: 'ingenieria@unsa.edu.pe' },
    update: {},
    create: {
      email: 'ingenieria@unsa.edu.pe',
      passwordHash,
      name: 'Facultad de Ingeniería',
      career: 'Ingeniería Industrial',
      role: 'ORGANIZER',
    },
  });

  const organizer3 = await prisma.user.upsert({
    where: { email: 'ia@unsa.edu.pe' },
    update: {},
    create: {
      email: 'ia@unsa.edu.pe',
      passwordHash,
      name: 'Club de IA UNSA',
      career: 'Ingeniería de Sistemas',
      role: 'ORGANIZER',
    },
  });

  const organizer4 = await prisma.user.upsert({
    where: { email: 'emprendimiento@unsa.edu.pe' },
    update: {},
    create: {
      email: 'emprendimiento@unsa.edu.pe',
      passwordHash,
      name: 'Centro de Emprendimiento',
      career: 'Administración',
      role: 'ORGANIZER',
    },
  });

  const organizer5 = await prisma.user.upsert({
    where: { email: 'cultura@unsa.edu.pe' },
    update: {},
    create: {
      email: 'cultura@unsa.edu.pe',
      passwordHash,
      name: 'Centro Cultural UNSA',
      career: 'Arte y Diseño',
      role: 'ORGANIZER',
    },
  });

  const organizer6 = await prisma.user.upsert({
    where: { email: 'deportes@unsa.edu.pe' },
    update: {},
    create: {
      email: 'deportes@unsa.edu.pe',
      passwordHash,
      name: 'Club de Ajedrez UNSA',
      career: 'Educación Física',
      role: 'ORGANIZER',
    },
  });

  const serviceOwner1 = await prisma.user.upsert({
    where: { email: 'carlos@unsa.edu.pe' },
    update: {},
    create: {
      email: 'carlos@unsa.edu.pe',
      passwordHash,
      name: 'Carlos Quispe',
      career: 'Ingeniería de Sistemas',
    },
  });

  const serviceOwner2 = await prisma.user.upsert({
    where: { email: 'ana@unsa.edu.pe' },
    update: {},
    create: {
      email: 'ana@unsa.edu.pe',
      passwordHash,
      name: 'Ana Torres',
      career: 'Ingeniería de Sistemas',
    },
  });

  const serviceOwner3 = await prisma.user.upsert({
    where: { email: 'lucia@unsa.edu.pe' },
    update: {},
    create: {
      email: 'lucia@unsa.edu.pe',
      passwordHash,
      name: 'Lucía Mamani',
      career: 'Arte y Diseño',
    },
  });

  const productOwner1 = await prisma.user.upsert({
    where: { email: 'pedro@unsa.edu.pe' },
    update: {},
    create: {
      email: 'pedro@unsa.edu.pe',
      passwordHash,
      name: 'Pedro Vargas',
      career: 'Ingeniería Civil',
    },
  });

  const productOwner2 = await prisma.user.upsert({
    where: { email: 'maria@unsa.edu.pe' },
    update: {},
    create: {
      email: 'maria@unsa.edu.pe',
      passwordHash,
      name: 'María Flores',
      career: 'Ingeniería Electrónica',
    },
  });

  const productOwner3 = await prisma.user.upsert({
    where: { email: 'diego@unsa.edu.pe' },
    update: {},
    create: {
      email: 'diego@unsa.edu.pe',
      passwordHash,
      name: 'Diego Paredes',
      career: 'Física',
    },
  });

  await prisma.user.upsert({
    where: { email: 'estudiante@unsa.edu.pe' },
    update: {},
    create: {
      email: 'estudiante@unsa.edu.pe',
      passwordHash,
      name: 'Estudiante Demo',
      career: 'Ingeniería de Sistemas',
      interests: {
        create: [
          { interest: 'TECNOLOGIA' },
          { interest: 'CIENCIA' },
          { interest: 'EMPRENDIMIENTO' },
        ],
      },
    },
  });

  console.log('Users created');


  const events = [
    {
      title: 'Hackathon UNSA 2026',
      category: EventCategory.TECNOLOGIA,
      date: new Date('2026-06-15T08:00:00-05:00'),
      location: 'Pabellón de Sistemas, UNSA',
      description:
        'Competencia de desarrollo de software de 48 horas. Forma tu equipo y construye soluciones innovadoras para problemas reales de la universidad.',
      capacity: 120,
      organizerId: organizer.id,
    },
    {
      title: 'Congreso de Ingeniería 2026',
      category: EventCategory.CIENCIA,
      date: new Date('2026-07-10T09:00:00-05:00'),
      location: 'Auditorio Principal, UNSA',
      description:
        'Congreso anual donde investigadores y estudiantes presentan sus proyectos. Ponencias magistrales, talleres y networking.',
      capacity: 300,
      organizerId: organizer2.id,
    },
    {
      title: 'Workshop de Inteligencia Artificial',
      category: EventCategory.TECNOLOGIA,
      date: new Date('2026-06-28T14:00:00-05:00'),
      location: 'Lab de Cómputo B, UNSA',
      description:
        'Taller práctico de IA con Python. Aprende modelos de machine learning, redes neuronales y casos de uso reales en industria.',
      capacity: 40,
      organizerId: organizer3.id,
    },
    {
      title: 'Feria de Emprendimiento',
      category: EventCategory.EMPRENDIMIENTO,
      date: new Date('2026-07-05T10:00:00-05:00'),
      location: 'Plaza Central, UNSA',
      description:
        'Exhibe tu startup o idea de negocio ante inversores y mentores. Premios para los mejores proyectos.',
      capacity: 200,
      organizerId: organizer4.id,
    },
    {
      title: 'Concierto de Rock Universitario',
      category: EventCategory.MUSICA,
      date: new Date('2026-06-20T18:00:00-05:00'),
      location: 'Estadio UNSA',
      description:
        'Bandas universitarias se presentan en el escenario más grande del campus. Entrada libre para estudiantes.',
      capacity: 500,
      organizerId: organizer5.id,
    },
    {
      title: 'Torneo de Ajedrez',
      category: EventCategory.DEPORTES,
      date: new Date('2026-07-01T09:00:00-05:00'),
      location: 'Sala de Usos Múltiples',
      description:
        'Torneo interuniversitario de ajedrez. Categorías principiante, intermedio y avanzado. Trofeos para los primeros lugares.',
      capacity: 64,
      organizerId: organizer6.id,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: {
        id: `seed-event-${event.title.replace(/\s+/g, '-').toLowerCase()}`,
      },
      update: {},
      create: {
        id: `seed-event-${event.title.replace(/\s+/g, '-').toLowerCase()}`,
        ...event,
      },
    });
  }

  console.log('Events created');


  await prisma.service.upsert({
    where: { id: 'seed-service-1' },
    update: {},
    create: {
      id: 'seed-service-1',
      title: 'Tutoría de Cálculo Diferencial',
      category: ServiceCategory.MATEMATICAS,
      description:
        'Clases personalizadas de cálculo. Explico desde cero: límites, derivadas, integrales. Más de 2 años de experiencia enseñando.',
      price: 25,
      priceType: PriceType.HORA,
      ownerId: serviceOwner1.id,
    },
  });

  await prisma.service.upsert({
    where: { id: 'seed-service-2' },
    update: {},
    create: {
      id: 'seed-service-2',
      title: 'Desarrollo de apps móviles Flutter',
      category: ServiceCategory.PROGRAMACION,
      description:
        'Desarrollo tu app móvil con Flutter para Android e iOS. Proyectos universitarios, tesis o emprendimientos.',
      price: 80,
      priceType: PriceType.PROYECTO,
      ownerId: serviceOwner2.id,
    },
  });

  await prisma.service.upsert({
    where: { id: 'seed-service-3' },
    update: {},
    create: {
      id: 'seed-service-3',
      title: 'Diseño de logos y branding',
      category: ServiceCategory.DISENO,
      description:
        'Creo tu identidad visual completa: logo, paleta de colores, tipografía. Entrega en 3 días hábiles.',
      price: 60,
      priceType: PriceType.PROYECTO,
      ownerId: serviceOwner3.id,
    },
  });

  console.log('Services created');


  await prisma.product.upsert({
    where: { id: 'seed-product-1' },
    update: {},
    create: {
      id: 'seed-product-1',
      title: 'Cálculo - James Stewart 8va edición',
      category: ProductCategory.LIBROS,
      description:
        'Libro en excelente estado, pocas marcas de lapicero. Ideal para Cálculo I y II.',
      price: 45,
      condition: ProductCondition.CASI_NUEVO,
      ownerId: productOwner1.id,
    },
  });

  await prisma.product.upsert({
    where: { id: 'seed-product-2' },
    update: {},
    create: {
      id: 'seed-product-2',
      title: 'Calculadora Casio fx-991LA Plus',
      category: ProductCategory.CALCULADORAS,
      description:
        'Calculadora científica en perfecto estado. La vendo porque ya me gradué. Incluye estuche original.',
      price: 70,
      condition: ProductCondition.USADO,
      ownerId: productOwner2.id,
    },
  });

  await prisma.product.upsert({
    where: { id: 'seed-product-3' },
    update: {},
    create: {
      id: 'seed-product-3',
      title: 'Apuntes de Física II - UNSA 2025',
      category: ProductCategory.APUNTES,
      description:
        'Apuntes completos del curso de Física II. Incluye todos los temas, ejercicios resueltos y fórmulas.',
      price: 15,
      condition: ProductCondition.NUEVO,
      ownerId: productOwner3.id,
    },
  });

  console.log('Products created');


  const resources = [
    { id: 'seed-res-1', name: 'Laptop HP EliteBook 840',      code: 'LAP-001', description: 'Intel Core i7, 16GB RAM, para proyectos de software' },
    { id: 'seed-res-2', name: 'Calculadora Casio fx-9750GIII', code: 'CAL-001', description: 'Calculadora gráfica para cursos de cálculo y estadística' },
    { id: 'seed-res-3', name: 'Kit de Arduino Uno',            code: 'ARD-001', description: 'Incluye placa, sensores, cables y manual' },
    { id: 'seed-res-4', name: 'Microscopio óptico',            code: 'MIC-001', description: 'Para laboratorios de biología y química' },
    { id: 'seed-res-5', name: 'Proyector Epson EX3280',        code: 'PRO-001', description: 'Para presentaciones y exposiciones' },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {},
      create: resource,
    });
  }

  console.log('Resources created');
  console.log('Seed complete!');
  console.log('');
  console.log('Demo accounts (password: password123):');
  console.log('  estudiante@unsa.edu.pe  — student account');
  console.log('  sistemas@unsa.edu.pe    — organizer account');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
