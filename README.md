Proyecto: Offer&Sell API

Descripción breve
- API para gestión de usuarios con Node.js, Express y MySQL.
- Incluye vistas EJS para prueba rápida y endpoints JSON.

Requisitos
- Node.js 18+
- MySQL 8+

Instalación
- npm i

Configuración
- Duplicar .env.example como .env y ajustar valores.
- Crear base y tabla ejecutando schema.sql.

Ejecución
- npm run dev  (desarrollo)
- npm start    (producción)

Rutas vistas
- /inicio
- /registro
- /login

Base URL API
- http://localhost:3000

Endpoints
- POST /api/usuarios
- POST /api/login
- GET /api/usuarios
- GET /api/usuarios/:id
- PUT /api/usuarios/:id
- DELETE /api/usuarios/:id
