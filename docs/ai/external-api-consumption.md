# API Usage Examples / Ejemplos de Uso de la API

This document provides practical examples for using the Ticket Manager API.

Este documento proporciona ejemplos prácticos para usar la API de Ticket Manager.

## Setup / Configuración Inicial

### Check Setup Status / Verificar Estado de Setup

**EN:** Check if the system needs admin creation. Public endpoint (no auth required).

**ES:** Verificar si el sistema necesita crear admin. Endpoint público (sin autenticación requerida).

```bash
# Request / Petición
GET http://localhost:3000/setup/status
Content-Type: application/json

# Response / Respuesta
{
  "needsAdmin": true,
  "defaultCompanyId": "00000000-0000-0000-0000-000000000001"
}
```

### Create Admin / Crear Admin

**EN:** Create the first admin user. Automatically assigned to default company. Public endpoint (no auth required).

**ES:** Crear el primer usuario admin. Asignado automáticamente a la compañía por defecto. Endpoint público (sin autenticación requerida).

```bash
# Request / Petición
POST http://localhost:3000/setup/admin
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "firstName": "Admin",
  "lastName": "User",
  "companyName": "Mi Empresa"
}

# Response / Respuesta
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "admin",
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN",
  "companyId": "00000000-0000-0000-0000-000000000001",
  "isActive": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔐 Authentication / Autenticación

### Register / Registrarse

**EN:** Create a new user account. Users must be assigned to a company. New users are assigned the CLIENT role by default.

**ES:** Crear una nueva cuenta de usuario. Los usuarios deben asignarse a una compañía. Los nuevos usuarios reciben el rol CLIENT por defecto.

```bash
# Request / Petición
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyId": "00000000-0000-0000-0000-000000000001"
}

# Response / Respuesta
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john.doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CLIENT",
  "companyId": "00000000-0000-0000-0000-000000000001",
  "isActive": true,
  "createdAt": "2025-01-06T10:00:00.000Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login / Iniciar Sesión

**EN:** Obtain a JWT token by providing email and password.

**ES:** Obtener un token JWT proporcionando email y contraseña.

```bash
# Request / Petición
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

# Response / Respuesta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**EN:** Use the token in subsequent requests:

**ES:** Usa el token en peticiones subsecuentes:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👤 Users / Usuarios

### Create User / Crear Usuario

```bash
POST http://localhost:3000/users
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "username": "john.doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "AGENT"
}
```

### Get All Users / Obtener Todos los Usuarios

Soporta paginación opcional con `offset` y `limit` (máx 100) y filtro `companyId`.

```bash
GET http://localhost:3000/users?companyId=<company-uuid>&offset=0&limit=20
Authorization: Bearer <your-token>
```

### Get User by ID / Obtener Usuario por ID

```bash
GET http://localhost:3000/users/:id
Authorization: Bearer <your-token>
```

### Update User / Actualizar Usuario

```bash
PUT http://localhost:3000/users/:id
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "firstName": "Jonathan",
  "isActive": true
}
```

## 🏢 Companies / Compañías

### Get All Companies / Obtener Todas las Compañías

Soporta paginación opcional con `offset` y `limit` (máx 100).

```bash
GET http://localhost:3000/companies?offset=0&limit=20
Authorization: Bearer <your-token>
```

### Get Company by ID / Obtener Compañía por ID

```bash
GET http://localhost:3000/companies/:id
Authorization: Bearer <your-token>
```

### Create Company / Crear Compañía

```bash
POST http://localhost:3000/companies
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "description": "Leading tech solutions provider",
  "email": "info@acme.com",
  "phone": "+1234567890",
  "address": "123 Main Street, Suite 100",
  "tier": "PREMIUM",
  "rut": "76086428-5",
  "responsibleUserIds": ["uuid-of-responsible-user-1", "uuid-of-responsible-user-2"]
}
```

### Update Company / Actualizar Compañía

```bash
PATCH http://localhost:3000/companies/:id
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+1234567891",
  "tier": "ENTERPRISE",
  "rut": "76086428-5",
  "responsibleUserIds": ["uuid-of-responsible-user-1"]
}
```

### Delete Company / Eliminar Compañía

```bash
DELETE http://localhost:3000/companies/:id
Authorization: Bearer <your-token>
```

## 👥 Clients / Clientes

Note: Client features have been unified under `users` with role `CLIENT`. Use `users` endpoints and provide `role: CLIENT` to create or manage client accounts.

Example: Create a client user

```bash
POST http://localhost:3000/users
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "username": "acme.client",
  "email": "contact@acme.com",
  "password": "SecurePassword123!",
  "firstName": "Acme",
  "lastName": "Client",
  "role": "CLIENT",
  "companyId": "00000000-0000-0000-0000-000000000001",
  "phone": "+1234567890",
  "clientCompany": "Acme Corp"
}
```

## 🎫 Tickets

### Create Ticket / Crear Ticket

```bash
POST http://localhost:3000/tickets
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "Login issue on mobile app",
  "description": "Users are unable to login using the mobile application on iOS devices.",
  "priority": "HIGH",
  "clientId": "uuid-of-user-with-role-CLIENT",
  "tags": ["mobile", "ios", "login"]
}
```

### Get All Tickets / Obtener Todos los Tickets

Soporta paginación opcional con `offset` y `limit` (máx 100).

```bash
GET http://localhost:3000/tickets?offset=0&limit=20
Authorization: Bearer <your-token>
```

### Get Ticket by ID / Obtener Ticket por ID

```bash
GET http://localhost:3000/tickets/:id
Authorization: Bearer <your-token>

# Response / Respuesta
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Login issue on mobile app",
  "description": "Users are unable to login using the mobile application on iOS devices.",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "clientId": "6f1c6cde-3f0b-4f4d-95e5-2f2d8c1cb5f5",
  "assignedAgentId": "8c9f53e1-f13f-4276-a5f2-f7f94b260a74",
  "closureReason": null,
  "closureNote": null,
  "closedAt": null,
  "dueDate": "2025-01-19T23:59:59.000Z",
  "tags": ["mobile", "ios", "login"],
  "attachments": [],
  "createdAt": "2025-01-12T10:00:00.000Z",
  "updatedAt": "2025-01-12T14:30:00.000Z"
}
```

**EN:** Note: `assignedAgentId` is dynamically retrieved from the active ticket assignment. To track all assignments and reassignments, use the assignment history endpoint.

**ES:** Nota: `assignedAgentId` se obtiene dinámicamente de la asignación de ticket activa. Para rastrear todas las asignaciones y reasignaciones, usa el endpoint de historial de asignaciones.

### Update Ticket Status / Actualizar Estado del Ticket

**EN:** Update ticket status, priority, or assignment. When `assignedAgentId` changes, the previous assignment is automatically deactivated and a new one is created in the assignment history.

**ES:** Actualizar estado del ticket, prioridad o asignación. Cuando `assignedAgentId` cambia, la asignación anterior se desactiva automáticamente y se crea una nueva en el historial.

```bash
PUT http://localhost:3000/tickets/:id
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "assignedAgentId": "uuid-of-agent"
}
```

### Close Ticket / Cerrar Ticket

```bash
PUT http://localhost:3000/tickets/:id
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "status": "CLOSED",
  "closureReason": "RESOLVED",
  "closureNote": "Issue was resolved by updating the mobile app to version 2.1.0"
}
```

### Get Ticket Assignment History / Obtener Historial de Asignaciones del Ticket

**EN:** Get the complete history of agent assignments for a ticket. Shows who handled the ticket, when they were assigned, when reassigned, and reasons for changes.

**ES:** Obtener el historial completo de asignaciones de agentes para un ticket. Muestra quién manejó el ticket, cuándo fueron asignados, cuándo reasignados, y razones de los cambios.

```bash
GET http://localhost:3000/tickets/:id/assignments
Authorization: Bearer <your-token>

# Response / Respuesta
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "ticketId": "550e8400-e29b-41d4-a716-446655440000",
    "agentId": "550e8400-e29b-41d4-a716-446655440010",
    "agentName": "John Doe",
    "assignedBy": "550e8400-e29b-41d4-a716-446655440020",
    "assignedByName": "Admin User",
    "assignedAt": "2025-01-12T10:00:00.000Z",
    "unassignedAt": "2025-01-12T14:30:00.000Z",
    "reason": "Reassigned to specialist",
    "isActive": false
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "ticketId": "550e8400-e29b-41d4-a716-446655440000",
    "agentId": "550e8400-e29b-41d4-a716-446655440030",
    "agentName": "Jane Smith",
    "assignedBy": "550e8400-e29b-41d4-a716-446655440020",
    "assignedByName": "Admin User",
    "assignedAt": "2025-01-12T14:30:00.000Z",
    "unassignedAt": null,
    "reason": null,
    "isActive": true
  }
]
```

**EN:** Key fields:
- `isActive`: true if this is the current assignment
- `unassignedAt`: null if still active, set when assignment is replaced
- `reason`: Optional reason for assignment or reassignment
- The most recent assignment where `isActive = true` determines the `assignedAgentId` in the ticket response

**ES:** Campos clave:
- `isActive`: true si esta es la asignación actual
- `unassignedAt`: null si está activa, establecido cuando la asignación se reemplaza
- `reason`: Razón opcional para la asignación o reasignación
- La asignación más reciente donde `isActive = true` determina el `assignedAgentId` en la respuesta del ticket



## 💬 Comments / Comentarios

### Add Comment to Ticket / Agregar Comentario a Ticket

```bash
POST http://localhost:3000/comments
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "content": "I've investigated the issue and found that it's related to the OAuth token expiration.",
  "ticketId": "uuid-of-ticket",
  "authorId": "uuid-of-user",
  "isInternal": true
}
```

### Get Comments for Ticket / Obtener Comentarios de un Ticket

Soporta paginación opcional con `offset` y `limit` (máx 100) más filtro `ticketId`.

```bash
GET http://localhost:3000/comments?ticketId=uuid-of-ticket&offset=0&limit=20
Authorization: Bearer <your-token>
```

### Update Comment / Actualizar Comentario

```bash
PUT http://localhost:3000/comments/:id
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "content": "Updated information: The issue is now resolved in version 2.1.0"
}
```

## 🔑 Permissions / Permisos

### Get All Permissions / Obtener Todos los Permisos

Soporta paginación opcional con `offset` y `limit` (máx 100).

```bash
GET http://localhost:3000/permissions?offset=0&limit=50
Authorization: Bearer <your-token>
```

### Create Custom Permission / Crear Permiso Personalizado

```bash
POST http://localhost:3000/permissions
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "report:generate",
  "resource": "report",
  "action": "generate",
  "description": "Permission to generate reports"
}
```

### Assign Permission to User / Asignar Permiso a Usuario

```bash
POST http://localhost:3000/permissions/assign
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "userId": "uuid-of-user",
  "permissionId": "uuid-of-permission"
}
```

## 📊 Common Response Codes / Códigos de Respuesta Comunes

| Code | EN | ES |
|------|----|----|
| 200 | Success | Éxito |
| 201 | Created | Creado |
| 204 | No Content | Sin Contenido |
| 400 | Bad Request - Invalid data | Petición Incorrecta - Datos inválidos |
| 401 | Unauthorized - Invalid or missing token | No Autorizado - Token inválido o faltante |
| 403 | Forbidden - Insufficient permissions | Prohibido - Permisos insuficientes |
| 404 | Not Found | No Encontrado |
| 500 | Internal Server Error | Error Interno del Servidor |

## 🎯 Permission Examples / Ejemplos de Permisos

**EN:** The system uses resource:action format for permissions.

**ES:** El sistema usa el formato recurso:acción para permisos.

### Available Permissions / Permisos Disponibles

- `ticket:create` - Create new tickets / Crear nuevos tickets
- `ticket:read` - View tickets / Ver tickets
- `ticket:update` - Update tickets / Actualizar tickets
- `ticket:delete` - Delete tickets / Eliminar tickets
- `ticket:assign` - Assign tickets to agents / Asignar tickets a agentes
- `ticket:close` - Close tickets / Cerrar tickets
- `user:read` - View users / Ver usuarios
- `user:manage` - Manage users / Gestionar usuarios
- `permission:read` - View permissions / Ver permisos
- `permission:create` - Create permissions / Crear permisos
- `permission:assign` - Assign permissions / Asignar permisos
- `comment:create` - Create comments / Crear comentarios
- `comment:read` - View comments / Ver comentarios
- `comment:update` - Update comments / Actualizar comentarios
- `comment:delete` - Delete comments / Eliminar comentarios

## 🧪 Testing with cURL

### Login Example / Ejemplo de Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Create Ticket Example / Ejemplo de Crear Ticket

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Ticket",
    "description": "This is a test ticket",
    "priority": "MEDIUM",
    "clientId": "CLIENT_UUID"
  }'
```

## 📝 Notes / Notas

**EN:**
- All timestamps are in ISO 8601 format with timezone (UTC)
- UUIDs are used for all entity IDs
- Companies use `tier` (FREE, BASIC, PREMIUM, ENTERPRISE), `rut` (unique string), and `responsibleUserIds` (UUID array of users)
- Passwords are hashed using bcryptjs
- JWT tokens expire after 1 day by default (configurable via JWT_EXPIRES_IN)
- **Ticket Assignment:** The `assignedAgentId` field in ticket responses is dynamically calculated from the active ticket assignment (where `isActive = true`). To view the complete assignment history including reassignments and changes, use the GET /tickets/:id/assignments endpoint
- **Removed Fields:** The tickets table has been simplified and no longer stores `resolvedAt`, `responseTime`, or `resolutionTime`. These can be calculated on-demand from other fields if needed

**ES:**
- Todas las marcas de tiempo están en formato ISO 8601 con zona horaria (UTC)
- Se usan UUIDs para todos los IDs de entidades
- Las compañías usan `tier` (FREE, BASIC, PREMIUM, ENTERPRISE), `rut` (cadena única) y `responsibleUserIds` (arreglo de UUIDs de usuarios)
- Las contraseñas se hashean usando bcryptjs
- Los tokens JWT expiran después de 1 día por defecto (configurable vía JWT_EXPIRES_IN)
- **Asignación de Tickets:** El campo `assignedAgentId` en las respuestas de tickets se calcula dinámicamente de la asignación activa del ticket (donde `isActive = true`). Para ver el historial completo de asignaciones incluyendo reasignaciones y cambios, usa el endpoint GET /tickets/:id/assignments
- **Campos Eliminados:** La tabla de tickets ha sido simplificada y ya no almacena `resolvedAt`, `responseTime`, o `resolutionTime`. Estos pueden calcularse bajo demanda a partir de otros campos si es necesario
