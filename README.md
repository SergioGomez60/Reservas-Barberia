# Barber Reservation - Sistema de Reservas

Sistema de reservas para barbería con backend Node.js/Express y frontend Angular.

## Estructura del Proyecto

```
├── backend/
│   ├── models/           # Modelos de MongoDB
│   ├── routes/           # Rutas de la API
│   ├── src/
│   │   ├── index.js      # Servidor principal
│   │   └── seed.js       # Datos iniciales
│   ├── package.json
│   └── .env              # Variables de entorno
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Componentes Angular
    │   │   └── services/    # Servicios API
    │   ├── environments/
    │   └── styles.css
    └── angular.json
```

## Requisitos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- Angular CLI

## Instalación

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Configuración

### Backend

1. Crea un archivo `.env` en la carpeta `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/barber-reservations
PORT=5000
```

2. (Opcional) Ejecuta el seed para populate la base de datos:

```bash
npm run seed
```

Esto creará:
- 3 barberos de ejemplo
- 6 servicios de ejemplo

## Ejecución

### Backend

```bash
cd backend
npm start
```

El servidor se ejecutará en `http://localhost:5000`

### Frontend

```bash
cd frontend
ng serve
```

La aplicación se ejecutará en `http://localhost:4200`

## API Endpoints

### Barberos
- `GET /api/barbers` - Obtener todos los barberos
- `GET /api/barbers/:id` - Obtener un barbero
- `POST /api/barbers` - Crear barbero
- `PUT /api/barbers/:id` - Actualizar barbero
- `DELETE /api/barbers/:id` - Eliminar barbero

### Servicios
- `GET /api/services` - Obtener todos los servicios
- `GET /api/services/:id` - Obtener un servicio
- `POST /api/services` - Crear servicio
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio

### Citas
- `GET /api/appointments` - Obtener todas las citas
- `GET /api/appointments/date/:date` - Citas por fecha
- `GET /api/appointments/barber/:barberId` - Citas por barbero
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Eliminar cita

## Funcionalidades

- ✅ Reserva de citas con selección de barbero y servicio
- ✅ Visualización de horarios disponibles
- ✅ Validación de disponibilidad
- ✅ Interfaz responsiva
- ✅ API REST completa
- ✅ Base de datos MongoDB

## Tecnologías

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: Angular, TypeScript, HTML, CSS
