API Offer&Sell (resumen)

Base: http://localhost:3000

POST /api/usuarios
Body JSON:
{ "nombre":"Ana", "contacto":"3001112233", "correo":"ana@example.com", "password":"123456" }
Respuestas: 201, 409, 400, 500

POST /api/login
Body JSON:
{ "correo":"ana@example.com", "password":"123456" }
Respuestas: 200, 401, 400, 500

GET /api/usuarios
Respuestas: 200, 500

GET /api/usuarios/:id
Respuestas: 200, 404, 500

PUT /api/usuarios/:id
Body JSON (ej.): { "nombre":"Ana María" }
Respuestas: 200, 400, 404, 500

DELETE /api/usuarios/:id
Respuestas: 204, 404, 500
