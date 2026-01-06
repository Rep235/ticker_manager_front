# 🚀 Guía de Contribución y Agregar Nuevas Features

## 1. Antes de Empezar

✅ **Verificar que tengas:**
- Node.js 18+ instalado
- PNPM instalado (`npm install -g pnpm`)
- Backend NestJS corriendo en `http://localhost:3000/api`
- `.env.local` configurado con `VITE_API_BASE_URL=http://localhost:3000/api`

✅ **Leer primero:**
- `/QUICK_START.md` - Setup rápido
- `/ARCHITECTURE.md` - Estructura del proyecto
- `/docs/ai/ui-architecture-contract.md` - Reglas obligatorias

---

## 2. Agregar una Nueva Página

### Paso 1: Crear archivo en `/src/pages`

```tsx
// src/pages/TicketFormPage.tsx
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const TicketFormPage = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Enviar a API
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <Card.Header title="Crear Ticket" />
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <Button type="submit" variant="primary">
              Crear
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};
```

### Paso 2: Agregar ruta en `/src/app/router.tsx`

```ts
// Importar página
import { TicketFormPage } from '../pages/TicketFormPage';

// Agregar ruta en el array
{
  path: '/tickets/new',
  element: <TicketFormPage />,
}
```

### Paso 3: Agregar enlace en `/src/components/common/Sidebar.tsx`

```tsx
{
  label: 'Nuevo Ticket',
  icon: Plus,
  href: '/tickets/new',
}
```

---

## 3. Agregar un Nuevo Hook de Feature

### Paso 1: Crear hook en `/src/features/feature/hooks`

```ts
// src/features/tickets/hooks/useCreateTicket.ts
import { useState } from 'react';
import { ticketService } from '../services/ticketService';
import { getErrorMessage } from '../../../lib/errorHandler';
import type { Ticket, CreateTicketPayload } from '../../../types';

interface UseCreateTicketState {
  loading: boolean;
  error: string | null;
}

export const useCreateTicket = () => {
  const [state, setState] = useState<UseCreateTicketState>({
    loading: false,
    error: null,
  });

  const createTicket = async (payload: CreateTicketPayload): Promise<Ticket> => {
    setState({ loading: true, error: null });
    try {
      const ticket = await ticketService.createTicket(payload);
      setState({ loading: false, error: null });
      return ticket;
    } catch (error) {
      const message = getErrorMessage(error);
      setState({ loading: false, error: message });
      throw error;
    }
  };

  return { ...state, createTicket };
};
```

### Paso 2: Exportar en `/src/features/feature/hooks/index.ts`

```ts
export { useCreateTicket } from './useCreateTicket';
```

### Paso 3: Usar en página

```tsx
import { useCreateTicket } from '../features/tickets/hooks';

const MyPage = () => {
  const { loading, error, createTicket } = useCreateTicket();

  const handleSubmit = async (data: CreateTicketPayload) => {
    await createTicket(data);
  };

  return <>{/* render */}</>;
};
```

---

## 4. Agregar un Nuevo Servicio

### Paso 1: Crear servicio en `/src/features/feature/services`

```ts
// src/features/reports/services/reportService.ts
import { httpClient } from '../../../services/http';
import type { Report } from '../../../types';

export const reportService = {
  async getReports(): Promise<Report[]> {
    const { data } = await httpClient.get<Report[]>('/reports');
    return data;
  },

  async getReportById(id: string): Promise<Report> {
    const { data } = await httpClient.get<Report>(`/reports/${id}`);
    return data;
  },

  async createReport(payload: CreateReportPayload): Promise<Report> {
    const { data } = await httpClient.post<Report>('/reports', payload);
    return data;
  },

  async updateReport(id: string, payload: UpdateReportPayload): Promise<Report> {
    const { data } = await httpClient.put<Report>(`/reports/${id}`, payload);
    return data;
  },

  async deleteReport(id: string): Promise<void> {
    await httpClient.delete(`/reports/${id}`);
  },
};
```

### Paso 2: Exportar en `/src/features/feature/services/index.ts`

```ts
export { reportService } from './reportService';
```

---

## 5. Agregar un Nuevo Tipo

### Editar `/src/types/index.ts`

```ts
// Agregar al final del archivo

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  createdAt: string;
  updatedAt: string;
}

export enum ReportType {
  TICKETS = 'TICKETS',
  USERS = 'USERS',
  CLIENTS = 'CLIENTS',
}

export interface CreateReportPayload {
  title: string;
  description: string;
  type: ReportType;
}

export interface UpdateReportPayload {
  title?: string;
  description?: string;
  type?: ReportType;
}
```

---

## 6. Agregar un Nuevo Componente UI

### Paso 1: Crear en `/src/components/ui`

```tsx
// src/components/ui/Badge.tsx
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant: 'primary' | 'success' | 'warning' | 'error';
}

export const Badge = ({ children, variant }: BadgeProps) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};
```

### Paso 2: Exportar en `/src/components/ui/index.ts`

```ts
export { Badge } from './Badge';
```

### Paso 3: Usar en cualquier lugar

```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="success">Activo</Badge>
```

---

## 7. Verificar Cumplimiento de Reglas

### ✅ Antes de hacer Commit

```bash
# 1. Verificar TypeScript
pnpm tsc --noEmit

# 2. Verificar lint
pnpm lint

# 3. Hacer build
pnpm build

# 4. Probar localmente
pnpm dev
```

### ✅ Checklist de Revisión

- [ ] **Tipos**: ¿Todos los datos están tipados? NO usar `any`
- [ ] **Importes**: ¿Rutas correctas? (contar `../`)
- [ ] **Componentes**: ¿Importados de `components/ui/`?
- [ ] **Servicios**: ¿En `features/*/services/`?
- [ ] **Hooks**: ¿En `features/*/hooks/`?
- [ ] **Estilos**: ¿Tailwind solo? NO CSS personalizado
- [ ] **Accesibilidad**: ¿aria-label en interactivos?
- [ ] **Responsive**: ¿mobile-first? `hidden md:flex`
- [ ] **Error Handling**: ¿getErrorMessage() usado?
- [ ] **Loading State**: ¿Mostrar spinner mientras carga?
- [ ] **Empty State**: ¿Mensaje si no hay datos?

---

## 8. Flujo de Trabajo Típico

### Scenario: Agregar búsqueda global

#### 1. Crear hook
```ts
// src/features/search/hooks/useGlobalSearch.ts
export const useGlobalSearch = (query: string) => {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (query.length > 2) {
      searchService.search(query).then(setResults);
    }
  }, [query]);
  
  return { results };
};
```

#### 2. Crear servicio
```ts
// src/features/search/services/searchService.ts
export const searchService = {
  async search(query: string) {
    const { data } = await httpClient.get('/search', { params: { q: query } });
    return data;
  }
};
```

#### 3. Agregar componente UI
```tsx
// src/components/common/SearchBar.tsx
export const SearchBar = ({ onSearch }: { onSearch: (q: string) => void }) => {
  return <Input placeholder="Buscar..." onChange={(e) => onSearch(e.target.value)} />;
};
```

#### 4. Usar en Header
```tsx
// En components/common/Header.tsx
const [query, setQuery] = useState('');
const { results } = useGlobalSearch(query);

<SearchBar onSearch={setQuery} />
{results.map(r => <SearchResult key={r.id} {...r} />)}
```

---

## 9. Estructura de Carpetas para Nueva Feature

```
src/features/newFeature/
├── hooks/
│   ├── useNewFeature.ts
│   ├── useCreateNewFeature.ts
│   └── index.ts
├── services/
│   ├── newFeatureService.ts
│   └── index.ts
├── index.ts
└── README.md (opcional)
```

---

## 10. Convenciones de Nombres

### Archivos
- **Componentes**: `PascalCase.tsx` - `Button.tsx`, `LoginForm.tsx`
- **Hooks**: `camelCase.ts` - `useAuth.ts`, `useTickets.ts`
- **Servicios**: `camelCase.ts` - `authService.ts`, `ticketService.ts`
- **Tipos**: Exportados en `types/index.ts`
- **Utilidades**: `camelCase.ts` - `errorHandler.ts`, `constants.ts`

### Variables
- **States**: `camelCase` - `isLoading`, `hasError`
- **Constants**: `UPPER_CASE` - `API_TIMEOUT`, `MAX_ITEMS`
- **Types**: `PascalCase` - `User`, `Ticket`, `CreateUserPayload`
- **Enums**: `PascalCase` - `TicketStatus`, `UserRole`

### Functions
- **Hooks**: `useCamelCase` - `useAuth`, `useTickets`
- **Event handlers**: `handleCamelCase` - `handleSubmit`, `handleDelete`
- **Services**: `camelCase` - `authService`, `ticketService`

---

## 11. Patrones de Error Handling

### ✅ Correcto
```ts
catch (error) {
  const message = getErrorMessage(error);
  setError(message);
  console.error('Operation failed:', message);
}
```

### ❌ Incorrecto
```ts
catch (error: any) {
  setError(error.message);
  console.error(error);
}
```

---

## 12. Patrones de Loading States

### ✅ Correcto
```tsx
if (loading) return <LoadingState />;
if (error) return <ErrorState message={error} />;
if (!data?.length) return <EmptyState />;

return <DataList data={data} />;
```

### ❌ Incorrecto
```tsx
return (
  <div>
    {loading && <Spinner />}
    {error && <p className="text-red-500">{error}</p>}
    {data?.map(item => <Item key={item.id} {...item} />)}
  </div>
);
```

---

## 13. Deployar Cambios

### Local Testing
```bash
# 1. Limpiar
rm -rf dist node_modules/.vite

# 2. Instalar dependencias
pnpm install

# 3. Dev server
pnpm dev

# 4. Visitar http://localhost:5173
```

### Build para Producción
```bash
# 1. Build
pnpm build

# 2. Verificar output
ls -la dist/

# 3. Test output
pnpm preview
```

---

## 14. Debugging Avanzado

### Ver estado actual del app
```tsx
// En cualquier componente
const handleDebug = () => {
  const token = localStorage.getItem('authToken');
  console.log({
    token: token ? '✅ Existe' : '❌ No existe',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    apiURL: import.meta.env.VITE_API_BASE_URL,
  });
};
```

### Monitorear requests
```tsx
// En Network tab (F12)
// Filtrar por XHR
// Ver cada request:
// - URL correcta?
// - Authorization header presente?
// - Response status 200/201?
// - Body correcto?
```

---

## 15. Recursos Útiles

- **React Docs**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com
- **Axios**: https://axios-http.com

---

## ❓ FAQ de Contribución

**P: ¿Necesito crear una nueva feature en features/?**
R: Sí, si es lógica de negocio (auth, tickets, users). Si es utilidad genérica, va en `lib/` o `hooks/`.

**P: ¿Puedo usar Context API?**
R: No, usa hooks con estado local. Context tiende a causar re-renders innecesarios.

**P: ¿Puedo agregar librerías?**
R: Consulta primero. Preferimos construir con lo que tenemos (React, Tailwind, lucide).

**P: ¿Cómo manejo errores de validación del formulario?**
R: Agregar a hook, mostrar en Input con error prop: `<Input error={errors.email} />`

**P: ¿Debo hacer commit antes de compilar?**
R: No, siempre verifica con `pnpm build` primero.

**P: ¿Cómo agrego un nuevo campo a User?**
R: 1) Agregar en `types/index.ts`, 2) Backend API, 3) Formulario en página, 4) Hook para enviar.

