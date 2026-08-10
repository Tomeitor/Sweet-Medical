# Sweet Medical

**Sweet Medical** es una aplicación web de gestión de turnos médicos desarrollada con una arquitectura de frontend React + backend Node.js/Express + MongoDB.

## 📌 Resumen del proyecto

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB + Mongoose
- Autenticación: JWT
- Validación: Zod
- Documentación de API: Swagger
- Pruebas: Jest
- Contenedores: Docker Compose opcional

## 🚀 Requisitos previos

Asegúrate de tener instalados en tu máquina:

- Node.js 20+ y npm
- MongoDB (si no vas a usar Docker)
- Docker y Docker Compose (opcional)

## 📁 Estructura principal

- `/backend`: servidor y API
- `/frontend`: aplicación React
- `/mongodb`: definición de servicio MongoDB opcional para Docker Compose
- `/docs`: documentación adicional del proyecto

## 🛠️ Configuración local

### 1. Ejecutar backend

1. Abrir terminal en `backend`
2. Instalar dependencias:

```bash
cd backend
npm install
```

3. Crear un archivo `.env` junto a `server.js` con estas variables:

```env
PORT=3000
PATH_APP=/api/v1
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=backend-grupo-02
```

4. Iniciar MongoDB localmente (si no usas Docker):

```bash
mongod
```

5. Iniciar el backend en modo desarrollo:

```bash
npm run dev
```

O iniciar en modo producción:

```bash
npm start
```

El backend quedará disponible en `http://localhost:3000` y la API bajo el prefijo `/api/v1`.

### 2. Ejecutar frontend

1. Abrir terminal en `frontend`
2. Instalar dependencias:

```bash
cd frontend
npm install
```

3. Iniciar la aplicación React:

```bash
npm run dev
```

4. Abrir el navegador en la URL que muestra Vite (normalmente `http://localhost:5173`).

> El frontend consumirá la API usando la variable `VITE_API_BASE_URL`. Si no se define, usa `http://localhost:3000/api/v1`.

## 🐳 Ejecución con Docker

### Levantar toda la aplicación con Docker Compose

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Esto iniciará:

- MongoDB en `mongodb://localhost:27017`
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5151`

### Detener los contenedores

```bash
docker compose down
```

## 🔧 Variables de entorno

### Backend (`backend/.env`)

- `PORT`: puerto del servidor Express (por defecto `3000`)
- `PATH_APP`: prefijo principal de la API (por defecto `/api/v1`)
- `MONGODB_URI`: URL de conexión a MongoDB
- `MONGODB_DB_NAME`: nombre de la base de datos

### Frontend

- `VITE_API_BASE_URL`: URL base de la API que usa el frontend

## 📌 Endpoints importantes

### Healthcheck

```http
GET http://localhost:3000/api/v1/healthcheck
```

### Documentación Swagger

```http
GET http://localhost:3000/docs
```

### Principales recursos expuestos

- `/api/v1/auth`: login y autenticación
- `/api/v1/medicos`: gestión de médicos
- `/api/v1/turnos`: creación, cancelación y modificaciones de turnos
- `/api/v1/disponibilidades`: horarios y disponibilidad médica

> El frontend también expone funcionalidades como agenda de pacientes, historial de turnos, propuestas de cambios y notificaciones.

## � Guía de uso básica

1. Inicia el backend y el frontend siguiendo los pasos anteriores.
2. Abre la aplicación en el navegador.
3. Selecciona el rol de usuario para ingresar como médico o paciente.
4. Usa las credenciales demo para iniciar sesión.
5. Explora las funcionalidades:
   - Ver médicos y disponibilidad.
   - Reservar y cancelar turnos.
   - Ver historial de turnos de paciente o médico.
   - Proponer cambios y responder notificaciones.

### Usuarios demo

El seed de datos incluye usuarios de ejemplo con la contraseña común:

- Contraseña: `Demo123!`

Usuarios de médicos:

- `ana.gomez`
- `juan.martinez`
- `carlos.lopez`
- `maria.rodriguez`
- `pedro.sanchez`
- `lucia.garcia`

Usuarios de pacientes:

- `juan.perez`
- `maria.lopez`
- `lucas.fernandez`
- `sofia.navarro`
- `martin.suarez`

> Incluir estas credenciales en el README es aceptable cuando son cuentas de prueba creadas específicamente para la demostración. No uses datos sensibles o reales.

## �🧪 Pruebas

El backend incluye tests con Jest.

```bash
cd backend
npm test
```

## 📚 Comandos relevantes

### Backend

- `npm start`: inicia el servidor con `.env`
- `npm run dev`: arranca el servidor con recarga automática
- `npm test`: ejecuta tests
- `npm run lint`: valida código con ESLint
- `npm run db:seed`: carga datos de ejemplo
- `npm run db:reset-seed`: reinicia la base de datos y carga datos de ejemplo

### Frontend

- `npm run dev`: arranca el frontend en modo desarrollo
- `npm run build`: genera el bundle de producción
- `npm run preview`: sirve el build para revisión local
- `npm run lint`: valida el frontend con ESLint

## 🧱 Arquitectura del backend

El backend está organizado en capas:

- `controllers`: lógica de entrada de las rutas
- `services`: lógica de negocio
- `repositories`: acceso a datos con MongoDB/Mongoose
- `routers`: definición de rutas y documentación Swagger
- `middlewares`: manejo de errores, autenticación y logging
- `schemas`: validación de datos de entrada con Zod

## 🎯 Qué se puede mostrar en el proyecto

- Integración de frontend y backend
- Autenticación JWT y manejo de sesiones
- Validación de datos con Zod
- Documentación automática con Swagger
- Docker Compose para toda la aplicación
- Tests automatizados con Jest
- Arquitectura en capas y buenas prácticas de proyecto

## 📂 Recursos adicionales

- Documentación API: `http://localhost:3000/docs`
- Código fuente backend: `backend/`
- Código fuente frontend: `frontend/`
