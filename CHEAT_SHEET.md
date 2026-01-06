# 🎯 CHEAT SHEET - Referencia Rápida

## Comandos Frecuentes

```bash
# Desarrollo
pnpm install              # Instalar dependencias
pnpm dev                  # Iniciar servidor local (5173)
pnpm build                # Compilar para producción
pnpm preview              # Ver build compilado

# Verificación
pnpm tsc --noEmit         # Verificar TypeScript
pnpm lint                 # Verificar código

# Limpiar
rm -rf dist .vite         # Borrar caché
pnpm install              # Reinstalar todo
```

---

## Estructura de Carpetas

```
src/
├── app/router.tsx                 # Rutas de la app
├── pages/LoginPage.tsx            # Páginas (7 total)
├── features/
│   ├── auth/hooks/useAuth.ts      # Estado y lógica
│   ├── auth/services/authService  # Llamadas API
│   └── (idem para tickets, users, clients)
├── components/
│   ├── ui/Button.tsx              # Componentes base
│   └── common/Header.tsx           # Componentes compuestos
├── services/http/client.ts        # HTTP centralizado
├── types/index.ts                 # Tipos globales
└── lib/errorHandler.ts            # Utilidades
```

---

## Crear Nueva Página

```tsx
// src/pages/MyPage.tsx
import { useMyHook } from '../features/myfeature/hooks';
import { Button } from '../components/ui/Button';

export const MyPage = () => {
  const { data, loading, error } = useMyHook();
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  return <div className="p-6">{/* render */}</div>;
};
```

Luego agregar ruta en `src/app/router.tsx`.

---

## Crear Hook

```ts
// src/features/feature/hooks/useMyHook.ts
import { useState, useEffect } from 'react';
import { myService } from '../services/myService';
import { getErrorMessage } from '../../../lib/errorHandler';

export const useMyHook = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    myService.getAll()
      .then(setData)
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
```

---

## Crear Servicio

```ts
// src/features/feature/services/myService.ts
import { httpClient } from '../../../services/http';

export const myService = {
  async getAll() {
    const { data } = await httpClient.get('/resource');
    return data;
  },
  async create(payload: CreatePayload) {
    const { data } = await httpClient.post('/resource', payload);
    return data;
  },
};
```

---

## HTTP Client

```ts
// Ya está configurado en src/services/http/client.ts
import { httpClient } from '@/services/http';

// GET
const data = await httpClient.get<User>('/users');

// POST
const created = await httpClient.post<User>('/users', payload);

// PUT
const updated = await httpClient.put<User>('/users/1', payload);

// DELETE
await httpClient.delete('/users/1');

// Con interceptor de token automático!
```

---

## Componentes UI

```tsx
import { Button, Input, Select, Card, Alert } from '../components/ui';

<Button variant="primary" size="md" onClick={() => {}}>Click</Button>
<Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
<Select label="Status" options={options} value={status} onChange={setStatus} />

<Card>
  <Card.Header title="Title" />
  <Card.Body>Content</Card.Body>
  <Card.Footer>
    <Button>Save</Button>
  </Card.Footer>
</Card>

<Alert type="error" message="Error!" onClose={() => {}} />
```

---

## Componentes Comunes

```tsx
import { 
  Header, 
  Sidebar, 
  Breadcrumbs, 
  LoadingState, 
  ErrorState, 
  EmptyState 
} from '../components/common';

<Header />
<Sidebar />
<Breadcrumbs items={[{ label: 'Home', href: '/' }]} />
<LoadingState message="Cargando..." />
<ErrorState message={error} onRetry={() => {}} />
<EmptyState icon={SearchX} message="Sin resultados" />
```

---

## Estados de Carga

```tsx
const { data, loading, error } = useMyHook();

if (loading) return <LoadingState />;
if (error) return <ErrorState message={error} />;
if (!data?.length) return <EmptyState />;

return <DataList data={data} />;
```

---

## Rutas Protegidas

```tsx
// En router.tsx
{
  path: '/protected',
  element: <ProtectedRoute><ProtectedPage /></ProtectedRoute>,
}

// En ProtectedRoute.tsx
import { authService } from '../features/auth/services/authService';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};
```

---

## Filtrado y Búsqueda

```tsx
const [search, setSearch] = useState('');
const [status, setStatus] = useState('');

const filtered = tickets.filter(t =>
  (search === '' || t.title.toLowerCase().includes(search.toLowerCase())) &&
  (status === '' || t.status === status)
);

<Input value={search} onChange={e => setSearch(e.target.value)} />
<Select value={status} onChange={setStatus} options={statusOptions} />
```

---

## Error Handling

```ts
// Siempre usar getErrorMessage()
import { getErrorMessage } from '../lib/errorHandler';

try {
  await myService.doSomething();
} catch (error) {
  const message = getErrorMessage(error); // ✅ Tipado!
  setError(message);
}
```

---

## TypeScript - Tipos Comunes

```ts
// Obtener de src/types/index.ts
import type { User, Ticket, Client, Comment } from '../types';

// Crear types para payloads
interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Usar en funciones
const createUser = async (payload: CreateUserPayload): Promise<User> => {
  return await userService.create(payload);
};
```

---

## Variables de Entorno

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api

# En código
const baseURL = import.meta.env.VITE_API_BASE_URL;
```

---

## Tailwind - Clases Comunes

```tsx
// Layout
<div className="max-w-2xl mx-auto p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Spacing
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>

// Colors
<button className="bg-blue-600 hover:bg-blue-700 text-white">

// Responsive
<div className="hidden md:flex">Visible en desktop</div>

// Borders
<div className="border border-gray-300 rounded-lg">

// Shadows
<div className="shadow-md hover:shadow-lg">
```

---

## Debugging

```ts
// En browser console (F12)

// 1. Ver token
localStorage.getItem('authToken')

// 2. Ver usuario
JSON.parse(localStorage.getItem('user') || 'null')

// 3. Ver URL de API
import.meta.env.VITE_API_BASE_URL

// 4. Ver errores
console.error() // Buscar en console

// 5. Ver requests
F12 → Network → Filtrar por XHR
```

---

## Validación

```tsx
// Email
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Password 8+ chars
const isValidPassword = password.length >= 8;

// Mostrar en Input
<Input 
  value={password} 
  error={password.length < 8 ? 'Mínimo 8 caracteres' : undefined}
/>
```

---

## API Endpoints Comunes

```
POST   /auth/login          {email, password} → token
POST   /auth/register       {email, password, ...} → user
GET    /tickets             → Ticket[]
POST   /tickets             {title, description} → Ticket
PUT    /tickets/:id         {status, priority, ...} → Ticket
DELETE /tickets/:id         → void
GET    /users               → User[]
POST   /users               {email, password, ...} → User
GET    /clients             → Client[]
POST   /clients             {name, email, ...} → Client
```

---

## Checklist Antes de Commit

- [ ] `pnpm tsc --noEmit` - Sin errores TS
- [ ] `pnpm lint` - Sin errores críticos
- [ ] `pnpm build` - Build exitoso
- [ ] Probé la funcionalidad
- [ ] Responsive OK
- [ ] Sin console.errors

---

## Checklist Antes de Deploy

- [ ] `.env.local` configurado
- [ ] Backend accesible
- [ ] Login funciona
- [ ] Features principales testadas
- [ ] `pnpm build` OK
- [ ] Sin errores en console
- [ ] Responsive en mobile
- [ ] Build size < 500KB

---

## Links Útiles

```
Documentación:
• QUICK_START.md      - 15 min para empezar
• ARCHITECTURE.md     - Estructura del proyecto
• CONTRIBUTING.md     - Cómo agregar features
• TROUBLESHOOTING.md  - Solución de problemas
• DOCS_INDEX.md       - Índice completo

Referencias:
• project-reference.json - Referencia técnica
• docs/ai/*.md          - Contratos obligatorios

Externa:
• React Docs     https://react.dev
• TypeScript     https://www.typescriptlang.org
• Tailwind CSS   https://tailwindcss.com
```

---

## Atajos de Teclado VS Code

```
Ctrl+Shift+P    - Command Palette
Ctrl+L          - Seleccionar línea
Ctrl+D          - Multi-select
Ctrl+/          - Comentar
Ctrl+K Ctrl+C   - Comentar
Ctrl+K Ctrl+U   - Descomentar
F2              - Renombrar símbolo
Ctrl+Shift+O    - Symbol navigator
Ctrl+Alt+L      - Format code
```

---

## Estado de la App

```
Frontend:  ✅ React 19 + TypeScript 5 + Tailwind 4
Backend:   🔗 NestJS (http://localhost:3000/api)
Database:  📊 PostgreSQL (backend)
Build:     ⚡ Vite 7 (1.3s)
Bundle:    📦 358.85 kB gzip
Status:    🚀 Production Ready
```

---

## Si Algo No Funciona

1. Leer [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Buscar en [DOCS_INDEX.md](./DOCS_INDEX.md)
3. Verificar console (F12)
4. Verificar Network tab (F12)
5. Limpiar caché: `rm -rf dist .vite`
6. Reinstalar: `pnpm install`

---

**Última actualización:** 2024  
**Status:** ✅ Production Ready

Para más detalles: Ver documentación completa en DOCS_INDEX.md
