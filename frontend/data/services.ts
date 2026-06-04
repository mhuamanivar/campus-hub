export interface Service {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  priceType: "hora" | "sesión" | "proyecto" | "fijo";
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  rating: number;
  reviewCount: number;
  type: "service"; // discriminador
}

export interface Product {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  condition: "nuevo" | "casi nuevo" | "usado" | "intercambio";
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  rating: number;
  reviewCount: number;
  type: "product"; // discriminador
}

export const SERVICE_CATEGORIES = [
  "Tutoría",
  "Programación",
  "Diseño",
  "Matemáticas",
  "Física",
  "Química",
  "Idiomas",
  "Estadística",
  "Redacción",
  "Contabilidad",
] as const;

export const PRODUCT_CATEGORIES = [
  "Libros",
  "Apuntes",
  "Calculadoras",
  "Laptops",
  "Material de dibujo",
  "Instrumentos",
  "Ropa universitaria",
  "Otros",
] as const;

// Datos de ejemplo
export const defaultServices: Service[] = [
  {
    id: 1,
    title: "Tutoría de Cálculo Diferencial",
    category: "Matemáticas",
    description: "Clases personalizadas de cálculo. Explico desde cero: límites, derivadas, integrales. Más de 2 años de experiencia enseñando.",
    price: 25,
    priceType: "hora",
    ownerName: "Carlos Quispe",
    ownerEmail: "carlos@unsa.edu.pe",
    createdAt: new Date().toISOString(),
    rating: 4.8,
    reviewCount: 12,
    type: "service",
  },
  {
    id: 2,
    title: "Desarrollo de apps móviles Flutter",
    category: "Programación",
    description: "Desarrollo tu app móvil con Flutter para Android e iOS. Proyectos universitarios, tesis o emprendimientos.",
    price: 80,
    priceType: "proyecto",
    ownerName: "Ana Torres",
    ownerEmail: "ana@unsa.edu.pe",
    createdAt: new Date().toISOString(),
    rating: 4.5,
    reviewCount: 7,
    type: "service",
  },
  {
    id: 3,
    title: "Diseño de logos y branding",
    category: "Diseño",
    description: "Creo tu identidad visual completa: logo, paleta de colores, tipografía. Entrega en 3 días hábiles.",
    price: 60,
    priceType: "proyecto",
    ownerName: "Lucía Mamani",
    ownerEmail: "lucia@unsa.edu.pe",
    createdAt: new Date().toISOString(),
    rating: 5.0,
    reviewCount: 5,
    type: "service",
  },
];

export const defaultProducts: Product[] = [
  {
    id: 101,
    title: "Cálculo - James Stewart 8va edición",
    category: "Libros",
    description: "Libro en excelente estado, pocas marcas de lapicero. Ideal para Cálculo I y II.",
    price: 45,
    condition: "casi nuevo",
    ownerName: "Pedro Vargas",
    ownerEmail: "pedro@unsa.edu.pe",
    createdAt: new Date().toISOString(),
    rating: 0,
    reviewCount: 0,
    type: "product",
  },
  {
    id: 102,
    title: "Calculadora Casio fx-991LA Plus",
    category: "Calculadoras",
    description: "Calculadora científica en perfecto estado. La vendo porque ya me gradué. Incluye estuche original.",
    price: 70,
    condition: "usado",
    ownerName: "María Flores",
    ownerEmail: "maria@unsa.edu.pe",
    createdAt: new Date().toISOString(),
    rating: 0,
    reviewCount: 0,
    type: "product",
  },
  {
    id: 103,
    title: "Apuntes de Física II - UNSA 2025",
    category: "Apuntes",
    description: "Apuntes completos del curso de Física II. Incluye todos los temas, ejercicios resueltos y fórmulas.",
    price: 15,
    condition: "nuevo",
    ownerName: "Diego Paredes",
    ownerEmail: "diego@unsa.edu.pe",
    createdAt: new Date().toISOString(),
    rating: 0,
    reviewCount: 0,
    type: "product",
  },
];