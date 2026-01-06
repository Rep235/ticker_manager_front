# Ticket Manager - Frontend

Sistema de gestión de tickets con interfaz React moderna.

## Descripción

Frontend SPA (Single Page Application) para el Ticket Manager que permite:
- ✅ Autenticación (login/registro)
- ✅ Gestión de tickets (CRUD)
- ✅ Gestión de usuarios
- ✅ Gestión de clientes
- ✅ Sistema de comentarios en tickets
- ✅ Interfaz responsive y moderna

## Arquitectura

El proyecto sigue la arquitectura definida en `docs/ai/ui-architecture-contract.md`:

```
src/
├── app/                  # Bootstrap y configuración global
│   ├── App.tsx
│   ├── router.tsx       # Configuración de rutas
│   └── ProtectedRoute.tsx
├── pages/               # Componentes de página (nivel de ruta)
├── components/          # Componentes reutilizables
│   ├── ui/              # Componentes de diseño (button, input, card, etc)
│   └── common/          # Componentes compuestos (header, sidebar, etc)
├── features/            # Lógica de negocio por dominio
│   ├── auth/            # Autenticación
│   ├── tickets/         # Gestión de tickets
│   ├── users/           # Gestión de usuarios
│   └── clients/         # Gestión de clientes
├── services/            # Servicios de API y externos
│   └── http/            # Cliente HTTP (axios)
├── hooks/               # Hooks genéricos reutilizables
├── lib/                 # Utilidades y helpers
├── types/               # Tipos globales de TypeScript
└── styles/              # Estilos CSS (solo Tailwind)
```

## Tecnologías

- **Framework:** React 19
- **Lenguaje:** TypeScript 5.9
- **Build Tool:** Vite 7
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios 1.13
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React 0.562

## Instalación

```bash
# Instalar dependencias
pnpm install

# Crear archivo .env.local
cp .env.example .env.local

# Actualizar VITE_API_BASE_URL si es necesario
# Por defecto: http://localhost:3000/api
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Verificar lint
pnpm lint

# Compilar para producción
pnpm build

# Preview de build
pnpm preview
```

## Variables de Entorno

```env
# URL de la API backend
VITE_API_BASE_URL=http://localhost:3000/api
```

## Rutas de la Aplicación

| Ruta | Componente | Autenticación | Descripción |
|------|-----------|---------------|------------|
| `/login` | LoginPage | ❌ No | Página de inicio de sesión |
| `/register` | RegisterPage | ❌ No | Página de registro |
| `/dashboard` | DashboardPage | ✅ Sí | Dashboard principal |
| `/tickets` | TicketsPage | ✅ Sí | Listado de tickets |
| `/tickets/:id` | TicketDetailPage | ✅ Sí | Detalle de ticket |
| `/users` | UsersPage | ✅ Sí | Gestión de usuarios |
| `/clients` | ClientsPage | ✅ Sí | Gestión de clientes |

## Características Principales

### 1. Autenticación
- Login y registro de usuarios
- Token JWT almacenado localmente
- Rutas protegidas automáticamente
- Redirección automática al login cuando expira sesión

### 2. Gestión de Tickets
- Listado con filtros (estado, prioridad, búsqueda)
- Creación de nuevos tickets
- Actualización de estado y prioridad
- Sistema de comentarios
- Asignación de agentes

### 3. Gestión de Usuarios
- Crear usuarios del sistema
- Listado de usuarios activos
- Control de permisos de rol

### 4. Gestión de Clientes
- CRUD de clientes
- Planes/tiers de cliente
- Estado activo/inactivo

## Componentes Principales

### UI Components (`components/ui/`)
- `Button.tsx` - Botón personalizado con variantes
- `Input.tsx` - Input con validación y errores
- `Select.tsx` - Dropdown de selección
- `Card.tsx` - Contenedor de contenido
- `Alert.tsx` - Alertas de estados

### Common Components (`components/common/`)
- `Header.tsx` - Barra superior con navegación
- `Sidebar.tsx` - Menú lateral responsive
- `Breadcrumbs.tsx` - Navegación por ruta
- `States.tsx` - Estados de carga, error, vacío

## State Management

El proyecto utiliza **React Hooks** para state management local:
- `useState` para estado local de componentes
- `useEffect` para efectos secundarios
- Hooks personalizados en `features/*/hooks/` para lógica de negocio
- Context implícito a través de props (sin Context API)

## Servicios y API

### HTTP Client (`services/http/client.ts`)
Cliente Axios centralizado que maneja:
- Autenticación automática (Bearer token)
- Interceptores de solicitud/respuesta
- Redirección automática en 401

### Feature Services
Cada feature tiene servicios para comunicarse con el backend:
- `authService` - Login y registro
- `ticketService` - CRUD de tickets
- `commentService` - CRUD de comentarios
- `userService` - Gestión de usuarios
- `clientService` - Gestión de clientes

## Hooks Custom

### Auth (`features/auth/hooks/`)
- `useAuth()` - Obtener estado de autenticación
- `useLogin()` - Hook para login
- `useRegister()` - Hook para registro

### Tickets (`features/tickets/hooks/`)
- `useTickets()` - Obtener lista de tickets
- `useTicketDetail()` - Obtener detalle de ticket
- `useComments()` - Obtener comentarios

### Users (`features/users/hooks/`)
- `useUsers()` - Obtener lista de usuarios
- `useCreateUser()` - Crear usuario

### Clients (`features/clients/hooks/`)
- `useClients()` - Obtener lista de clientes
- `useCreateClient()` - Crear cliente

## Estilos y Diseño

- **Framework CSS:** Tailwind CSS v4
- **Diseño:** Mobile-first responsive
- **Componentes:** Sin CSS personalizado, todo con Tailwind
- **Iconos:** Lucide React (189+ iconos)

### Patrón Visual
- Colores neutros con acentos en azul
- Bordes suaves (`rounded-lg` a `rounded-2xl`)
- Sombras sutiles
- Espaciado generoso
- Transiciones suaves

## Manejo de Errores

El proyecto incluye:
- Validación de formularios
- Mensajes de error en componentes
- Estados de carga en botones y contenedores
- Manejo de excepciones en servicios
- Utility `getErrorMessage()` para normalizar errores

## Desarrollo e Implementación

### Crear un Nuevo Componente
1. Crear en `components/ui/` o `components/common/`
2. Usar props tipadas con TypeScript
3. No usar estilos inline
4. Asegurar accesibilidad (aria-labels)

### Crear una Nueva Feature
1. Crear directorio en `features/<feature>/`
2. Crear subdirectorios: `hooks/`, `services/`, `types.ts`
3. Implementar servicios primero
4. Luego hooks de estado
5. Finalmente componentes de página

### Agregar una Nueva Ruta
1. Crear componente en `pages/`
2. Actualizar `app/router.tsx`
3. Agregar navegación en `Sidebar.tsx`

## Lint y Formato

```bash
# Ejecutar ESLint
pnpm lint

# ESLint está configurado con reglas estrictas:
# - No usar `any` sin justificar
# - Sin variables no usadas
# - Acceso directo a props sin destructuring
```

## Build y Deployment

```bash
# Compilar para producción
pnpm build

# Output en carpeta `dist/`
# Servir archivos estáticos con servidor HTTP
```

## Próximas Mejoras

- [ ] Implementar paginación en listados
- [ ] Agregar búsqueda avanzada
- [ ] Sistema de notificaciones
- [ ] Exportar datos a CSV/PDF
- [ ] Historial de cambios de tickets
- [ ] Validación en tiempo real
- [ ] Testing con Vitest
- [ ] Storybook para documentación de componentes

## Licencia

Licencia especificada en `/docs/ai/licensing-contract.md`

## Notas de Desarrollo

- Todos los paths de imports deben ser relativos desde la raíz `src/`
- Componentes deben ser funcionales (no class components)
- Usar TypeScript estricto en todos los archivos
- El estado debe fluir de arriba hacia abajo (unidireccional)
- Side effects deben estar en `useEffect` con dependencias explícitas
