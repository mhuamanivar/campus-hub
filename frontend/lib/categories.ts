// Mapping between Prisma enum values and Spanish display labels

export const EVENT_CATEGORY_LABEL: Record<string, string> = {
  TECNOLOGIA:    "Tecnología",
  EMPRENDIMIENTO:"Emprendimiento",
  ARTE_CULTURA:  "Arte y Cultura",
  DEPORTES:      "Deportes",
  CIENCIA:       "Ciencia",
  VOLUNTARIADO:  "Voluntariado",
  MUSICA:        "Música",
  DISENO:        "Diseño",
  IDIOMAS:       "Idiomas",
  INVESTIGACION: "Investigación",
};

export const EVENT_CATEGORY_VALUE: Record<string, string> = Object.fromEntries(
  Object.entries(EVENT_CATEGORY_LABEL).map(([k, v]) => [v, k]),
);

export const EVENT_CATEGORIES = Object.keys(EVENT_CATEGORY_LABEL);

export const SERVICE_CATEGORY_LABEL: Record<string, string> = {
  TUTORIA:       "Tutoría",
  PROGRAMACION:  "Programación",
  DISENO:        "Diseño",
  MATEMATICAS:   "Matemáticas",
  FISICA:        "Física",
  QUIMICA:       "Química",
  IDIOMAS:       "Idiomas",
  ESTADISTICA:   "Estadística",
  REDACCION:     "Redacción",
  CONTABILIDAD:  "Contabilidad",
};

export const PRICE_TYPE_LABEL: Record<string, string> = {
  HORA: "hora", SESION: "sesión", PROYECTO: "proyecto", FIJO: "fijo",
};

export const PRICE_TYPE_VALUE: Record<string, string> = {
  "hora": "HORA", "sesión": "SESION", "proyecto": "PROYECTO", "fijo": "FIJO",
};

export const PRODUCT_CONDITION_LABEL: Record<string, string> = {
  NUEVO: "Nuevo", CASI_NUEVO: "Casi nuevo", USADO: "Usado", INTERCAMBIO: "Intercambio",
};

export const PRODUCT_CONDITION_VALUE: Record<string, string> = {
  "Nuevo": "NUEVO", "Casi nuevo": "CASI_NUEVO", "Usado": "USADO", "Intercambio": "INTERCAMBIO",
};

export const SERVICE_CATEGORY_VALUE: Record<string, string> = Object.fromEntries(
  Object.entries({
    TUTORIA: "Tutoría", PROGRAMACION: "Programación", DISENO: "Diseño",
    MATEMATICAS: "Matemáticas", FISICA: "Física", QUIMICA: "Química",
    IDIOMAS: "Idiomas", ESTADISTICA: "Estadística", REDACCION: "Redacción",
    CONTABILIDAD: "Contabilidad",
  }).map(([k, v]) => [v, k]),
);

export const SERVICE_CATEGORIES_ENUM = [
  "TUTORIA","PROGRAMACION","DISENO","MATEMATICAS","FISICA",
  "QUIMICA","IDIOMAS","ESTADISTICA","REDACCION","CONTABILIDAD",
];

export const PRODUCT_CATEGORIES_ENUM = [
  "LIBROS","APUNTES","CALCULADORAS","LAPTOPS","MATERIAL_DIBUJO",
  "INSTRUMENTOS","ROPA_UNIVERSITARIA","OTROS",
];

export const PRODUCT_CATEGORY_LABEL: Record<string, string> = {
  LIBROS:            "Libros",
  APUNTES:           "Apuntes",
  CALCULADORAS:      "Calculadoras",
  LAPTOPS:           "Laptops",
  MATERIAL_DIBUJO:   "Material de dibujo",
  INSTRUMENTOS:      "Instrumentos",
  ROPA_UNIVERSITARIA:"Ropa universitaria",
  OTROS:             "Otros",
};
