# CampusHub

<div align="center">

### Plataforma universitaria que centraliza eventos, servicios, préstamos y marketplace estudiantil

[![Status](https://img.shields.io/badge/Estado-Completado-brightgreen)]()
[![Academic Project](https://img.shields.io/badge/Proyecto-Académico-blue)]()
[![University](https://img.shields.io/badge/UNSA-Arequipa-red)]()
[![License](https://img.shields.io/badge/Licencia-Educativa-green)]()

</div>

---

## Descripción

**CampusHub** es una plataforma digital full-stack para la Universidad Nacional de San Agustín de Arequipa (UNSA) que centraliza eventos académicos, servicios colaborativos, préstamos de recursos y un marketplace estudiantil en un único ecosistema digital.

---

## Stack Tecnológico

| Área | Tecnología |
|------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, React Hook Form, Zod |
| Backend | NestJS, TypeScript, Prisma ORM |
| Base de datos | PostgreSQL 16 (via Docker) |
| Autenticación | JWT (access + refresh tokens), Google OAuth 2.0 |
| Infraestructura | Docker Compose (BD), Node.js local (backend + frontend) |

---

## Módulos Implementados

| Módulo | Funcionalidades |
|--------|----------------|
| **Autenticación** | Registro, login, logout, refresh token, Google OAuth, sesión persistente |
| **Usuarios** | Perfil, carrera, intereses, edición de cuenta |
| **Eventos** | CRUD completo, feed con búsqueda y filtros, inscripción, QR de asistencia |
| **Asistencia QR** | Escáner por cámara en tiempo real, registro de asistentes |
| **Comentarios** | Comentarios anidados con respuestas, eliminación propia |
| **Reacciones** | 👍 ❤️ 🔥 👏 toggle por evento |
| **Servicios** | Publicar/buscar tutorías, programación, diseño y más |
| **Marketplace** | Publicar/buscar productos (venta e intercambio) |
| **Préstamos** | Catálogo de recursos académicos, solicitar y devolver |
| **Notificaciones** | In-app, conteo en tiempo real, marcar como leído |
| **Analítica** | Métricas de eventos, inscripciones, usuarios, tasa de asistencia |

---

## Estructura del Proyecto

```
campus-hub/
├── frontend/          # Next.js 16 → http://localhost:3000
├── backend/           # NestJS    → http://localhost:3001
├── docker-compose.yml # PostgreSQL 16 → localhost:5432
└── README.md
```

---

## Requisitos Previos

- [Node.js 20+](https://nodejs.org/) — **requerido por Next.js 16**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- npm 10+

---

## Instalación y Ejecución Local

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd campus-hub
```

### 2. Iniciar la base de datos

```bash
docker-compose up -d
```

PostgreSQL correrá en `localhost:5432`. Para verificar:

```bash
docker-compose ps
```

### 3. Configurar y correr el Backend

```bash
cd backend
cp .env.example .env
```

Editar `.env` y completar los valores (ver [Variables de Entorno](#variables-de-entorno)), luego:

```bash
npm install
npx prisma migrate deploy
npx prisma generate
npm run prisma:seed
npm run start:dev
```

El backend estará disponible en **http://localhost:3001**

### 4. Configurar y correr el Frontend

Abrir una nueva terminal:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

La aplicación estará disponible en **http://localhost:3000**

---

## Variables de Entorno

### Backend — `backend/.env`

```env
DATABASE_URL="postgresql://campushub:campushub_secret@localhost:5432/campushub"
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d
JWT_QR_SECRET=
JWT_QR_EXPIRES_IN=30d

# Obtener en: https://console.cloud.google.com (opcional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_API=true
```

---

## Cuentas de Demo

Todas las cuentas usan la contraseña `password123`:

| Email | Rol |
|-------|-----|
| `estudiante@unsa.edu.pe` | Estudiante (cuenta demo) |
| `sistemas@unsa.edu.pe` | Organizador |
| `carlos@unsa.edu.pe` | Proveedor de servicios |
| `pedro@unsa.edu.pe` | Vendedor en marketplace |

---

## Comandos Útiles

### Base de datos

```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f db
```

### Backend

```bash
cd backend

npm run start:dev          # Desarrollo con hot reload
npm run build              # Compilar
npm run start:prod         # Producción

npx prisma migrate dev     # Aplicar migraciones
npx prisma migrate reset   # Resetear BD
npm run prisma:seed        # Poblar con datos de demo
npx prisma generate        # Regenerar cliente tras cambios en schema
npx prisma studio          # Explorador visual → http://localhost:5555

npm run test               # Tests unitarios
npm run test:e2e           # Tests de integración
```

### Frontend

```bash
cd frontend

npm run dev     # Desarrollo
npm run build   # Build de producción
npm run start   # Iniciar build
npm run lint    # Linter
```

---

## Flujo Principal

```
Registro → Perfil → Feed de Eventos → Inscripción → QR de Asistencia → Analítica
```

---

## Equipo de Desarrollo

| Integrante |
|------------|
| Maria Solange Ezcurra Paima |
| Melsy Melany Huamaní Vargas |

**Universidad Nacional de San Agustín de Arequipa — Ingeniería de Sistemas — 2026**

---

## Licencia

Proyecto desarrollado con fines académicos para la Universidad Nacional de San Agustín de Arequipa.
