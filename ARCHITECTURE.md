# Estructura Detallada del Proyecto

## 📂 Directorio `/src`

### 1️⃣ `/src/app` - Bootstrap y Configuración Global

Responsabilidad: Inicializar la aplicación, configurar ruteo y proveedores globales.

```
app/
├── App.tsx              # Componente raíz que renderiza RouterProvider
├── router.tsx           # Definición de todas las rutas
├── ProtectedRoute.tsx   # Wrapper para rutas autenticadas
└── index.ts             # Exporta App
```

**Clave:** Solo router y setup, NO lógica de negocio.

---

### 2️⃣ `/src/pages` - Componentes de Página

Responsabilidad: Coordinadores de página que usan hooks y componentes.

```
pages/
├── LoginPage.tsx             # Página de login
├── RegisterPage.tsx          # Página de registro
├── LayoutPage.tsx            # Layout compartido (header + sidebar + outlet)
├── DashboardPage.tsx         # Dashboard principal
├── TicketsPage.tsx           # Listado de tickets
├── TicketDetailPage.tsx      # Detalle de ticket
├── UsersPage.tsx             # Gestión de usuarios
└── ClientsPage.tsx           # Gestión de clientes
```

**Características:**
- Usan hooks (`useTickets`, `useUsers`, etc.)
- Componen componentes comunes
- Manejan estado y efectos
- NO llaman directamente a servicios

---

### 3️⃣ `/src/components` - Componentes Reutilizables

#### 📍 `/src/components/ui` - Componentes Atómicos

Componentes de diseño sin lógica de negocio.

```
ui/
├── Button.tsx      # Botón con variantes (primary, secondary, ghost, destructive)
├── Input.tsx       # Input con validación
├── Select.tsx      # Dropdown con opciones
├── Card.tsx        # Card, CardHeader, CardBody, CardFooter
├── Alert.tsx       # Alertas (error, success, warning, info)
└── index.ts        # Exporta todos
```

#### 📍 `/src/components/common` - Componentes Compuestos

Componentes que usan componentes UI.

```
common/
├── Header.tsx              # Barra superior con navegación
├── Sidebar.tsx             # Menú lateral con items de navegación
├── Breadcrumbs.tsx         # Migas de pan de navegación
├── States.tsx              # LoadingState, ErrorState, EmptyState
└── index.ts                # Exporta todos
```

**Reglas:**
- Sin estado global
- Props explícitas
- Tipadas con TypeScript
- Accesibles (aria-labels)

---

### 4️⃣ `/src/features` - Lógica de Negocio

Cada feature es un dominio independiente.

#### 📁 `/src/features/auth` - Autenticación

```
auth/
├── hooks/
│   ├── useAuth.ts        # Hook para obtener estado de auth
│   ├── useLogin.ts       # Hook para hacer login
│   ├── useRegister.ts    # Hook para registrarse
│   └── index.ts
├── services/
│   ├── authService.ts    # Llamadas a API (/auth/login, /auth/register)
│   └── index.ts
└── index.ts              # Exporta hooks públicos
```

#### 📁 `/src/features/tickets` - Gestión de Tickets

```
tickets/
├── hooks/
│   ├── useTickets.ts         # Listar todos los tickets
│   ├── useTicketDetail.ts    # Obtener detalle + actualizar + eliminar
│   ├── useComments.ts        # Obtener comentarios de ticket
│   └── index.ts
├── services/
│   ├── ticketService.ts      # CRUD de tickets
│   ├── commentService.ts     # CRUD de comentarios
│   └── index.ts
└── index.ts                  # Exporta hooks públicos
```

#### 📁 `/src/features/users` - Gestión de Usuarios

```
users/
├── hooks/
│   ├── useUsers.ts       # Listar usuarios
│   ├── useCreateUser.ts  # Crear usuario
│   └── index.ts
├── services/
│   ├── userService.ts    # CRUD de usuarios
│   └── index.ts
└── index.ts              # Exporta hooks públicos
```

#### 📁 `/src/features/clients` - Gestión de Clientes

```
clients/
├── hooks/
│   ├── useClients.ts       # Listar clientes
│   ├── useCreateClient.ts  # Crear cliente
│   └── index.ts
├── services/
│   ├── clientService.ts    # CRUD de clientes
│   └── index.ts
└── index.ts                # Exporta hooks públicos
```

**Estructura de Feature:**
```
feature/
├── hooks/        # Estado + lógica
├── services/     # Llamadas a API
└── types.ts      # Tipos específicos (si los hay)
```

---

### 5️⃣ `/src/services` - Servicios Externos

#### 📍 `/src/services/http`

Cliente HTTP centralizado.

```
http/
├── client.ts     # AxiosInstance con interceptores
└── index.ts      # Exporta httpClient
```

**Responsabilidades:**
- Crear instancia de axios
- Agregar interceptores (auth, errores)
- Manejar redirecciones 401

---

### 6️⃣ `/src/hooks` - Hooks Genéricos

Hooks reutilizables NO específicos de negocio.

```
hooks/
├── useLocalStorage.ts    # Manejo de localStorage (si se agrega)
├── useDebounce.ts        # Debounce genérico
└── ... (otros hooks genéricos)
```

**Nota:** Los hooks de feature están en `features/*/hooks/`

---

### 7️⃣ `/src/lib` - Utilidades y Helpers

Funciones puras sin React.

```
lib/
├── errorHandler.ts       # Normalizar errores de API
├── constants.ts          # Constantes globales
├── validators.ts         # Validaciones (si se agregan)
└── ... (otros helpers)
```

---

### 8️⃣ `/src/types` - Tipos TypeScript Globales

```
types/
└── index.ts              # Todos los tipos globales
```

**Contenido:**
- User, Ticket, Client, Comment
- Enums (TicketStatus, TicketPriority, ClientTier)
- Payloads de API (LoginPayload, CreateTicketPayload)
- ApiError

---

### 9️⃣ `/src/styles` - Estilos

```
styles/
├── index.css        # Entrada de Tailwind
└── App.css          # (Legacy, no usar)
```

**Política:** Solo Tailwind, NO CSS personalizado.

---

## 📊 Diagrama de Dependencias

```
pages/
  ↓
features/hooks/ + components/
  ↓
features/services/ + components/ui
  ↓
services/http
  ↓
API Backend
```

### Flujo de Datos

```
Page → useCustomHook → Service → httpClient → API
                         ↓
                      setState
                         ↓
                      Re-render
```

---

## 🎯 Patrones Comunes

### 1. Crear una Nueva Página

1. Crear `pages/NewPage.tsx`
2. Usar hooks para obtener datos: `const { data, loading } = useData()`
3. Renderizar con estados: loading → LoadingState, error → ErrorState
4. Agregar ruta en `app/router.tsx`

### 2. Crear un Hook de Feature

1. Crear `features/feature/hooks/useHook.ts`
2. Importar servicios: `import { service } from '../services'`
3. Usar `useState` + `useEffect`
4. Exportar en `features/feature/hooks/index.ts`

### 3. Crear un Servicio

1. Crear `features/feature/services/service.ts`
2. Importar `httpClient` desde `services/http`
3. Llamar endpoints: `httpClient.get`, `httpClient.post`, etc.
4. Retornar datos tipados

---

## 🔑 Archivos Clave

| Archivo | Propósito | Modificar Cuando |
|---------|-----------|------------------|
| `app/router.tsx` | Rutas de la app | Agregar página |
| `components/common/Sidebar.tsx` | Navegación | Agregar enlace |
| `types/index.ts` | Tipos globales | Cambiar modelo |
| `services/http/client.ts` | Cliente HTTP | Interceptores |
| `.env.local` | Variables de entorno | URL de API |

---

## 📝 Ejemplo: Agregar Nueva Feature

### 1. Crear estructura
```bash
mkdir -p src/features/notifications/{hooks,services}
```

### 2. Crear servicio (`notificationService.ts`)
```ts
import { httpClient } from '../../../services/http';

export const notificationService = {
  async getNotifications() {
    const { data } = await httpClient.get('/notifications');
    return data;
  }
};
```

### 3. Crear hook (`useNotifications.ts`)
```ts
import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    notificationService.getNotifications().then(setNotifications);
  }, []);
  
  return { notifications };
};
```

### 4. Usar en página
```tsx
const NotificationsPage = () => {
  const { notifications } = useNotifications();
  return <div>{/* render */}</div>;
};
```

---

## 🚨 Anti-patrones

❌ **NO hacer:**
```tsx
// ❌ NO: importar service directamente en página
import { service } from 'services';

// ❌ NO: llamar API en componente UI
const MyComponent = () => {
  useEffect(() => {
    fetch('/api/data').then(data => setData(data)); // ❌
  }, []);
};

// ❌ NO: crear feature en components
components/myFeature/hooks/useMyHook.ts // ❌

// ❌ NO: styles personalizado
<div style={{ color: 'blue' }}> {/* ❌ */}

// ❌ NO: exportar desde index sin nombramiento
export { default } from './Component'; // ❌
```

✅ **HACER:**
```tsx
// ✅ SÍ: usar hook en página
const MyPage = () => {
  const { data } = useMyData();
};

// ✅ SÍ: lógica en feature hook
export const useMyHook = () => {
  const [data, setData] = useState();
  useEffect(() => { /* fetch */ }, []);
  return { data };
};

// ✅ SÍ: exportar explícitamente
export { MyComponent } from './Component';

// ✅ SÍ: clases de Tailwind
<div className="text-blue-600">
```

---

## 📚 Documentación Relacionada

- Arquitectura: `/docs/ai/ui-architecture-contract.md`
- Patrones: `/docs/ai/ui-patterns.yaml`
- Diseño: `/docs/ai/ui-design-contract.md`
- Anti-patrones: `/docs/ai/ui-do-not.md`
- Estilo Visual: `/docs/ai/visual-style-contract.md`

