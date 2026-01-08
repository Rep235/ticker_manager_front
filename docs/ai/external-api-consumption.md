### Register / Registrarse

**EN:** Create a new user account. Users must be assigned to a company (`companyId` is required). New users are assigned the CLIENT role by default.

**ES:** Crear una nueva cuenta de usuario. Los usuarios deben asignarse a una compañía (`companyId` es obligatorio). Los nuevos usuarios reciben el rol CLIENT por defecto.

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
  "companyId": "00000000-0000-0000-0000-000000000001"  # <-- required/obligatorio
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
  "companyId": "00000000-0000-0000-0000-000000000001",  # <-- required/obligatorio
  "role": "AGENT"
}
```
**Response / Respuesta**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john.doe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "AGENT",
  "companyId": "00000000-0000-0000-0000-000000000001",
  "isActive": true,
  "createdAt": "2025-01-06T10:00:00.000Z"
}
```
# Frontend Integration Guide for Ticket Manager API

**Purpose:** This guide is designed for LLM agents developing a frontend UI that connects to the Ticket Manager API backend.

## Table of Contents
1. [API Overview](#api-overview)
2. [Architecture](#architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Common Patterns](#common-patterns)
7. [Error Handling](#error-handling)
8. [Frontend Implementation Guidance](#frontend-implementation-guidance)

---

## API Overview

### Technology Stack
- **Backend:** NestJS + TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger/OpenAPI available at `/api`
- **Base URL:** `http://localhost:3000` (configurable via `PORT` environment variable)


## 👥 Clients / Clientes (Deprecado)

> **[DEPRECATED]**
>
> La lógica de clientes ahora está centralizada en el módulo de usuarios (`users`). Para crear o gestionar cuentas de clientes, utiliza los endpoints de `users` y asigna el rol `CLIENT`.
>
> **No utilices endpoints específicos de clientes.**

**Ejemplo: Crear un usuario cliente**

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
  "phone": "+1234567890"
}
```
3. Most endpoints also require specific permissions
4. Responses use dedicated Response DTOs (no raw entities)
5. All IDs are UUIDs (not sequential integers)

---

## Authentication & Authorization

### Authentication Flow

#### 1. User Registration
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**
- New users are automatically assigned the `CLIENT` role
- Username: 3-100 chars, alphanumeric + dots, dashes, underscores
- Password: minimum 8 characters
- Email must be unique

#### 2. User Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Using the JWT Token
For all protected endpoints, include the token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authorization Model

#### User Roles
The system has three built-in roles:
- **ADMIN** - Full system access
- **AGENT** - Support agents who handle tickets
- **CLIENT** - Regular users who create tickets

#### Permissions
Permissions follow a resource-action pattern:
- **Resource:** `user`, `ticket`, `client`, `comment`, `permission`
- **Action:** `read`, `create`, `update`, `delete`, `manage`

**Example permissions:**
- `ticket:read` - Can view tickets
- `ticket:create` - Can create tickets
- `user:manage` - Can manage users (full CRUD)

#### Permission Requirements by Endpoint
Each protected endpoint specifies required permissions using the `@Permissions()` decorator:

| Endpoint | Permission Required |
|----------|-------------------|
| `GET /tickets` | `ticket:read` |
| `POST /tickets` | `ticket:create` |
| `PUT /tickets/:id` | `ticket:update` |
| `DELETE /tickets/:id` | `ticket:delete` |
| `GET /clients` | `client:read` |
| `POST /users` | `user:manage` |

---

## API Endpoints

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string (min 8 chars)",
  "firstName": "string",
  "lastName": "string"
}

Response 201: { "token": "string" }
Response 409: Email or username already exists
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response 200: { "token": "string" }
Response 400: Invalid credentials
```

---

### Tickets Endpoints

All ticket endpoints require authentication + specific permissions.

#### List All Tickets
```http
GET /tickets
Authorization: Bearer <token>

Response 200: TicketResponseDto[]
```

#### Get Ticket by ID
```http
GET /tickets/:id
Authorization: Bearer <token>

Response 200: TicketResponseDto
Response 404: Ticket not found
```

#### Create Ticket
```http
POST /tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "clientId": "uuid",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",  // optional
  "assignedAgentId": "uuid",  // optional
  "tags": ["string"],  // optional
  "dueDate": "ISO 8601 date string"  // optional
}

Response 201: TicketResponseDto
```

#### Update Ticket
```http
PUT /tickets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",  // optional
  "description": "string",  // optional
  "status": "OPEN | IN_PROGRESS | WAITING_ON_CLIENT | WAITING_ON_AGENT | RESOLVED | CLOSED | CANCELLED",  // optional
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",  // optional
  "assignedAgentId": "uuid",  // optional
  "closureReason": "RESOLVED | DUPLICATE | WONT_FIX | CANNOT_REPRODUCE | CLIENT_NO_RESPONSE | CANCELLED_BY_CLIENT | SPAM | OTHER",  // optional
  "closureNote": "string",  // optional
  "tags": ["string"],  // optional
  "dueDate": "ISO 8601 date string"  // optional
}

Response 200: TicketResponseDto
```

#### Delete Ticket
```http
DELETE /tickets/:id
Authorization: Bearer <token>

Response 204: No Content
Response 404: Ticket not found
```

---

### Clients Endpoints

#### List All Clients
```http
GET /clients
Authorization: Bearer <token>

Response 200: ClientResponseDto[]
```

#### Get Client by ID
```http
GET /clients/:id
Authorization: Bearer <token>

Response 200: ClientResponseDto
```

#### Create Client
```http
POST /clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "phone": "string",  // optional
  "company": "string",  // optional
  "tier": "FREE | BASIC | PREMIUM | ENTERPRISE"  // optional, defaults to FREE
}

Response 201: ClientResponseDto
```

#### Update Client
```http
PUT /clients/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",  // optional
  "email": "string",  // optional
  "phone": "string",  // optional
  "company": "string",  // optional
  "tier": "FREE | BASIC | PREMIUM | ENTERPRISE",  // optional
  "isActive": boolean  // optional
}

Response 200: ClientResponseDto
```

#### Delete Client
```http
DELETE /clients/:id
Authorization: Bearer <token>

Response 204: No Content
```

---

### Comments Endpoints

#### List All Comments
```http
GET /comments?ticketId=<uuid>
Authorization: Bearer <token>

Query Parameters:
  - ticketId (optional): Filter comments by ticket

Response 200: CommentResponseDto[]
```

#### Get Comment by ID
```http
GET /comments/:id
Authorization: Bearer <token>

Response 200: CommentResponseDto
```

#### Create Comment
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "string",
  "ticketId": "uuid",
  "authorId": "uuid",
  "isInternal": boolean  // optional, defaults to false
}

Response 201: CommentResponseDto
```

#### Update Comment
```http
PUT /comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "string",  // optional
  "isInternal": boolean  // optional
}

Response 200: CommentResponseDto
```

#### Delete Comment
```http
DELETE /comments/:id
Authorization: Bearer <token>

Response 204: No Content
```

---

### Users Endpoints

#### List All Users
```http
GET /users
Authorization: Bearer <token>

Response 200: UserResponseDto[]
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <token>

Response 200: UserResponseDto
```

#### Create User
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string (min 8 chars)",
  "firstName": "string",
  "lastName": "string",
  "isActive": boolean  // optional
}

Response 201: UserResponseDto
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",  // optional
  "email": "string",  // optional
  "password": "string",  // optional
  "firstName": "string",  // optional
  "lastName": "string",  // optional
  "isActive": boolean  // optional
}

Response 200: UserResponseDto
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <token>

Response 204: No Content
```

---

### Permissions Endpoints

#### List All Permissions
```http
GET /permissions
Authorization: Bearer <token>

Response 200: PermissionResponseDto[]
```

#### Get Permission by ID
```http
GET /permissions/:id
Authorization: Bearer <token>

Response 200: PermissionResponseDto
```

#### Create Permission
```http
POST /permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "resource": "string",
  "action": "string",
  "description": "string"  // optional
}

Response 201: PermissionResponseDto
```

#### Update Permission
```http
PUT /permissions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "resource": "string",  // optional
  "action": "string",  // optional
  "description": "string"  // optional
}

Response 200: PermissionResponseDto
```

#### Delete Permission
```http
DELETE /permissions/:id
Authorization: Bearer <token>

Response 204: No Content
```

#### Assign Permission to User
```http
POST /permissions/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "permissionId": "uuid"
}

Response 201: { "message": "Permission assigned successfully" }
```

#### Revoke Permission from User
```http
DELETE /permissions/revoke/:userId/:permissionId
Authorization: Bearer <token>

Response 204: No Content
```

#### Get User Permissions
```http
GET /permissions/user/:userId
Authorization: Bearer <token>

Response 200: PermissionResponseDto[]
```

---

## Data Models

### Enums

#### UserRole
```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  CLIENT = 'CLIENT'
}
```

#### ClientTier
```typescript
enum ClientTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}
```

#### TicketStatus
```typescript
enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_ON_CLIENT = 'WAITING_ON_CLIENT',
  WAITING_ON_AGENT = 'WAITING_ON_AGENT',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}
```

#### TicketPriority
```typescript
enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
```

#### ClosureReason
```typescript
enum ClosureReason {
  RESOLVED = 'RESOLVED',
  DUPLICATE = 'DUPLICATE',
  WONT_FIX = 'WONT_FIX',
  CANNOT_REPRODUCE = 'CANNOT_REPRODUCE',
  CLIENT_NO_RESPONSE = 'CLIENT_NO_RESPONSE',
  CANCELLED_BY_CLIENT = 'CANCELLED_BY_CLIENT',
  SPAM = 'SPAM',
  OTHER = 'OTHER'
}
```

---

### Response DTOs

#### TicketResponseDto
```typescript
{
  id: string;                           // UUID
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  clientId: string;                     // UUID
  assignedAgentId?: string | null;      // UUID
  closureReason?: ClosureReason | null;
  closureNote?: string | null;
  closedAt?: Date | null;               // ISO 8601 string
  dueDate?: Date | null;                // ISO 8601 string
  resolvedAt?: Date | null;             // ISO 8601 string
  responseTime?: number | null;         // minutes
  resolutionTime?: number | null;       // minutes
  tags: string[];                       // Array of tag strings
  attachments: string[];                // Array of URLs/identifiers
  createdAt: Date;                      // ISO 8601 string
  updatedAt: Date;                      // ISO 8601 string
}
```

#### ClientResponseDto
```typescript
{
  id: string;                           // UUID
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  tier: ClientTier;
  isActive: boolean;
  createdAt: Date;                      // ISO 8601 string
  updatedAt: Date;                      // ISO 8601 string
}
```

#### CommentResponseDto
```typescript
{
  id: string;                           // UUID
  content: string;
  isInternal: boolean;                  // true = internal note, false = public comment
  ticketId: string;                     // UUID
  authorId: string;                     // UUID
  createdAt: Date;                      // ISO 8601 string
  updatedAt: Date;                      // ISO 8601 string
}
```

#### UserResponseDto
```typescript
{
  id: string;                           // UUID
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;                      // ISO 8601 string
  updatedAt: Date;                      // ISO 8601 string
  // Note: password is NEVER included in responses
}
```

#### PermissionResponseDto
```typescript
{
  id: string;                           // UUID
  resource: string;                     // e.g., 'ticket', 'client', 'user'
  action: string;                       // e.g., 'read', 'create', 'update', 'delete', 'manage'
  description?: string;
  createdAt: Date;                      // ISO 8601 string
  updatedAt: Date;                      // ISO 8601 string
}
```

---

## Common Patterns

### Request Headers
All requests (except auth endpoints) must include:

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### HTTP Status Codes
- **200 OK** - Successful GET, PUT requests
- **201 Created** - Successful POST (resource created)
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Validation error or invalid input
- **401 Unauthorized** - Missing or invalid JWT token
- **403 Forbidden** - Valid token but insufficient permissions
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Resource already exists (e.g., duplicate email)
- **500 Internal Server Error** - Server error

### Validation Rules
All input is strictly validated:
- **UUID fields:** Must be valid UUID v4
- **Email fields:** Must be valid email format
- **String fields:** Check for `minLength`, `maxLength` constraints
- **Enum fields:** Must match exact enum values (case-sensitive)
- **Required vs Optional:** Check DTO definitions

### Date/Time Format
All dates are in **ISO 8601 format** with timezone:
```
2026-01-06T15:30:00.000Z
```

### Pagination
Currently, the API does **not implement pagination**. All list endpoints return complete arrays.
- Frontend should handle large datasets
- Consider implementing client-side pagination or infinite scroll

---

## Error Handling

### Error Response Format
All errors follow a standard format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Or with detailed validation errors:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

### Common Error Scenarios

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Cause:** Missing, expired, or invalid JWT token
**Fix:** Re-authenticate and get a new token

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Cause:** Valid token but user lacks required permission
**Fix:** Request the resource with an account that has appropriate permissions

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Ticket with ID abc123 not found"
}
```
**Cause:** Resource doesn't exist or was deleted
**Fix:** Verify the ID is correct

#### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```
**Cause:** Attempting to create a resource that violates uniqueness constraints
**Fix:** Use a different unique value (email, username)

---

## Frontend Implementation Guidance

### Technology Recommendations
Any modern frontend framework will work:
- **React** with TypeScript
- **Vue.js** with TypeScript
- **Angular** with TypeScript
- **Svelte** with TypeScript

**Why TypeScript?** The backend DTOs can be directly translated to TypeScript interfaces for type safety.

### Essential Features to Implement

#### 1. Authentication System
- Login page with email/password form
- Registration page with full form
- Token storage (localStorage or sessionStorage)
- Automatic token inclusion in API requests (interceptor/middleware)
- Token expiration handling and auto-logout
- Protected routes (redirect to login if not authenticated)

#### 2. Dashboard/Home
- Overview of tickets (open, in progress, resolved)
- Recent activity feed
- Quick stats (total tickets, clients, etc.)

#### 3. Ticket Management
- **List View:** Table/grid showing all tickets with filtering/sorting
  - Columns: ID, Title, Status, Priority, Client, Assigned Agent, Created Date
  - Filters: Status, Priority, Assigned Agent
  - Search by title/description
- **Detail View:** Full ticket information
  - All ticket fields
  - Comments section
  - Status change actions
  - Assignment functionality
- **Create/Edit Forms:** 
  - Title, description (required)
  - Client dropdown (searchable)
  - Priority selector
  - Agent assignment (optional)
  - Tags input
  - Due date picker

#### 4. Client Management
- Client list with CRUD operations
- Client detail view showing all tickets for that client
- Forms for creating/editing clients

#### 5. Comment System
- Display comments on ticket detail page
- Create new comments (with internal/public toggle)
- Edit/delete own comments
- Visual distinction between internal notes and public comments

#### 6. User Management (Admin only)
- User list
- Create/edit users
- Assign roles and permissions
- Activate/deactivate users

### State Management
Consider using:
- **React:** Redux Toolkit, Zustand, or React Query
- **Vue:** Pinia or Vuex
- **Angular:** NgRx or Services with RxJS

**Key state to manage:**
- Current user info (from JWT)
- Authentication status
- Current tickets, clients, users (with caching)
- UI state (filters, selected items)

### API Client Structure

#### Example: axios-based API client (TypeScript)

```typescript
// api/client.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### Example: API service methods

```typescript
// api/auth.service.ts
import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};
```

```typescript
// api/tickets.service.ts
import { apiClient } from './client';

export interface CreateTicketRequest {
  title: string;
  description: string;
  clientId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedAgentId?: string;
  tags?: string[];
  dueDate?: string;
}

export interface TicketResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  clientId: string;
  assignedAgentId?: string | null;
  closureReason?: string | null;
  closureNote?: string | null;
  closedAt?: string | null;
  dueDate?: string | null;
  resolvedAt?: string | null;
  responseTime?: number | null;
  resolutionTime?: number | null;
  tags: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export const ticketsService = {
  getAll: async (): Promise<TicketResponse[]> => {
    const response = await apiClient.get<TicketResponse[]>('/tickets');
    return response.data;
  },

  getById: async (id: string): Promise<TicketResponse> => {
    const response = await apiClient.get<TicketResponse>(`/tickets/${id}`);
    return response.data;
  },

  create: async (data: CreateTicketRequest): Promise<TicketResponse> => {
    const response = await apiClient.post<TicketResponse>('/tickets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTicketRequest>): Promise<TicketResponse> => {
    const response = await apiClient.put<TicketResponse>(`/tickets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  },
};
```

### UI/UX Best Practices

#### Status Indicators
Use color coding for ticket status and priority:

**Ticket Status Colors:**
- OPEN: Blue
- IN_PROGRESS: Orange
- WAITING_ON_CLIENT: Yellow
- WAITING_ON_AGENT: Purple
- RESOLVED: Green
- CLOSED: Gray
- CANCELLED: Red

**Priority Colors:**
- LOW: Light gray
- MEDIUM: Blue
- HIGH: Orange
- CRITICAL: Red

#### Forms
- Use controlled components with validation
- Show field-level errors from API validation
- Disable submit button during API calls
- Show loading states
- Success/error notifications after operations

#### Loading States
- Skeleton screens for lists
- Spinners for actions (creating, updating)
- Optimistic UI updates where appropriate

#### Accessibility
- Semantic HTML
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management (especially in modals)

---

## Advanced Features (Optional)

### Real-Time Updates
The current API does **not** support WebSockets or Server-Sent Events. Consider:
- Polling for updates (every 30-60 seconds)
- Manual refresh buttons
- Future: Add WebSocket support to backend for real-time notifications

### File Attachments
The `attachments` field on tickets is an array of strings (URLs/identifiers), but the API does **not** currently handle file uploads. To implement:
1. Add a separate file upload endpoint to the backend
2. Store files on disk or cloud storage (S3, etc.)
3. Return URLs and add them to the ticket's `attachments` array

### Analytics/Reporting
Create frontend-only analytics using the data:
- Average response/resolution times
- Tickets by status (pie chart)
- Tickets by priority (bar chart)
- Agent performance (tickets handled)
- Client activity (tickets created)

### Notifications
- Browser notifications for new comments on assigned tickets
- Email notifications (requires backend enhancement)

---

## Testing Checklist

### Manual Testing
1. **Authentication**
   - [ ] Register a new user
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials (should fail)
   - [ ] Access protected route without token (should redirect)
   - [ ] Token expiration handling

2. **Tickets**
   - [ ] Create a new ticket
   - [ ] List all tickets
   - [ ] View ticket details
   - [ ] Update ticket status
   - [ ] Assign agent to ticket
   - [ ] Add tags to ticket
   - [ ] Delete a ticket
   - [ ] Filter tickets by status
   - [ ] Filter tickets by priority

3. **Clients**
   - [ ] Create a new client
   - [ ] List all clients
   - [ ] Update client information
   - [ ] View client details with tickets
   - [ ] Delete a client

4. **Comments**
   - [ ] Add public comment to ticket
   - [ ] Add internal note to ticket
   - [ ] Edit own comment
   - [ ] Delete own comment
   - [ ] View comments filtered by ticket

5. **Permissions** (Admin only)
   - [ ] List all permissions
   - [ ] Assign permission to user
   - [ ] Revoke permission from user
   - [ ] View user's permissions

### Edge Cases
- Empty states (no tickets, no clients)
- Very long text in titles/descriptions
- Special characters in inputs
- Invalid UUIDs
- Expired tokens mid-session
- Network errors/offline state

---

## Swagger Documentation

The API provides interactive Swagger documentation at:
```
http://localhost:3000/api
```

**Benefits:**
- Visual API explorer
- Try out endpoints directly in browser
- See request/response schemas
- Download OpenAPI spec

**Usage:**
1. Start the backend server
2. Navigate to `http://localhost:3000/api`
3. Click "Authorize" and enter JWT token (get from login)
4. Test endpoints interactively

---

## Quick Start for Frontend Development

### 1. Setup Backend
```bash
# Clone and setup backend
cd ticket_manager_back
pnpm install

# Setup PostgreSQL database (via Docker)
docker-compose up -d

# Run migrations
pnpm migration:run

# Start backend server
pnpm start:dev
```

Backend will be available at `http://localhost:3000`

### 2. Create Test Data
Use Swagger UI (`http://localhost:3000/api`) or API client:

```typescript
// 1. Register a test user
POST /auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
// Save the returned token

// 2. Create a test client
POST /clients
{
  "name": "ACME Corporation",
  "email": "contact@acme.com",
  "company": "ACME Corp"
}
// Save the client ID

// 3. Create a test ticket
POST /tickets
{
  "title": "Login issue",
  "description": "Cannot login to dashboard",
  "clientId": "<client-id-from-step-2>",
  "priority": "HIGH"
}
```

### 3. Start Frontend Development
```bash
# Example with React + Vite
npm create vite@latest ticket-manager-frontend -- --template react-ts
cd ticket-manager-frontend
npm install axios react-router-dom

# Start development server
npm run dev
```

### 4. Connect to API
Follow the API client examples above to connect your frontend to `http://localhost:3000`.

---

## Security Considerations

### Token Storage
- **localStorage:** Persists across browser sessions (more convenient)
- **sessionStorage:** Cleared when tab is closed (more secure)
- **Cookies:** Requires backend CORS configuration and credentials

**Recommendation:** Use `localStorage` for development, consider `httpOnly` cookies for production.

### CORS
Backend must allow frontend origin. Check backend's CORS configuration if you encounter CORS errors.

### Input Sanitization
- Always trust the backend to validate input
- Display user-generated content safely (escape HTML)
- Prevent XSS attacks (use framework's built-in escaping)

### Password Handling
- Never store passwords in frontend state
- Clear password fields after submission
- Use `type="password"` for password inputs
- Consider showing password strength indicator

---

## Troubleshooting

### "401 Unauthorized" on every request
**Cause:** Token not being sent or invalid
**Fix:** 
1. Check if token exists in storage
2. Verify Authorization header format: `Bearer <token>`
3. Check if token expired (re-login)

### "403 Forbidden" on specific endpoints
**Cause:** User lacks required permission
**Fix:** 
1. Check user's role and permissions
2. Request the operation with an admin account
3. Verify permission requirements in this guide

### CORS errors
**Cause:** Backend not allowing frontend origin
**Fix:**
1. Check backend CORS configuration
2. Ensure frontend origin matches allowed origins
3. For development, backend should allow `http://localhost:<port>`

### Validation errors on form submission
**Cause:** Input doesn't match DTO requirements
**Fix:**
1. Check validation rules in this guide
2. Ensure all required fields are provided
3. Verify enum values match exactly (case-sensitive)
4. Check string length constraints

### "Network Error" or "Connection Refused"
**Cause:** Backend server not running
**Fix:**
1. Verify backend is running on `http://localhost:3000`
2. Check backend logs for errors
3. Ensure PostgreSQL database is running

---

## Summary

This Ticket Manager API provides a complete backend for a support ticket system with:
- ✅ JWT-based authentication
- ✅ Role-based access control with granular permissions
- ✅ Full CRUD operations for tickets, clients, comments, users, permissions
- ✅ Comprehensive validation and error handling
- ✅ RESTful design following best practices
- ✅ Interactive Swagger documentation

**Key Points for Frontend Development:**
1. All protected endpoints require `Authorization: Bearer <token>` header
2. Most endpoints require specific permissions (check the guide)
3. All IDs are UUIDs (not integers)
4. Dates are ISO 8601 strings
5. Enums are case-sensitive strings
6. No pagination currently implemented
7. File uploads not yet supported (attachments field is for URLs)

**Next Steps:**
1. Start the backend server
2. Explore the API via Swagger (`/api`)
3. Create test data
4. Build your frontend using the patterns and examples in this guide
5. Refer to the endpoint documentation for request/response formats

Good luck building your frontend! 🚀
