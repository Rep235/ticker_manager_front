# 🐛 Troubleshooting y Errores Comunes

## 1. Errores de Rutas de Importación

### ❌ Error: "Cannot find module"

```
Error: Cannot find module '../../types/index'
```

**Causa:** Conteo incorrecto de `../`

**Solución:**

Contar desde el archivo actual:
```
src/
  features/
    auth/
      services/
        authService.ts  ← Aquí estamos (4 niveles desde src)
      
  types/
    index.ts           ← Aquí queremos ir

Conteo: auth → features → src = 3 niveles = ../../../
```

**Correcto:**
```ts
import { User } from '../../../types';  // ✅ 3 × ../
```

**Incorrecto:**
```ts
import { User } from '../../types';     // ❌ Solo 2 × ../
```

---

## 2. Errores de React Fast Refresh

### ❌ Error: "Fast refresh only works when a file only exports components"

**Causa:** Archivo exporta componentes Y variables/tipos/configuración

```tsx
// ❌ INCORRECTO: Mezclar componentes y rutas
export const router = createBrowserRouter([...]);
export const ProtectedRoute = () => { ... };
```

**Solución:** Separar en dos archivos

```tsx
// ✅ router.tsx - Solo rutas
export const router = createBrowserRouter([...]);

// ✅ ProtectedRoute.tsx - Solo componente
export const ProtectedRoute = () => { ... };
```

---

## 3. Errores de TypeScript: `any` type

### ❌ Error: "@typescript-eslint/no-explicit-any"

```ts
catch (error: any) {
  console.log(error.message);  // ❌ any no es seguro
}
```

**Solución:** Usar `getErrorMessage()` del utils

```ts
// ✅ Tipado correctamente
import { getErrorMessage } from '../../lib/errorHandler';

catch (error) {
  const message = getErrorMessage(error);  // ✅ Tipado
  console.log(message);
}
```

---

## 4. Errores en Hooks: useEffect

### ❌ Error: "React Hook has a missing dependency"

```tsx
useEffect(() => {
  fetchData();
}, []);  // ❌ fetchData no está incluido
```

**Solución:** Incluir todas las dependencias

```tsx
// ✅ Con dependencia
useEffect(() => {
  fetchData();
}, [fetchData]);

// ✅ O mover la función dentro
useEffect(() => {
  const fetchData = async () => { ... };
  fetchData();
}, []);
```

---

## 5. Errores de Token/Autenticación

### ❌ No se envía el token Bearer

**Causa:** Token no está en localStorage con clave correcta

**Verificar:**
```ts
// En browser console:
localStorage.getItem('authToken')  // Debe retornar el token
```

**Solución:** Verificar en `authService.ts`

```ts
// ✅ Guardar con clave correcta
localStorage.setItem('authToken', token);

// ✅ Leer con clave correcta
const token = localStorage.getItem('authToken');
```

---

## 6. Errores de CORS

### ❌ Error: "No 'Access-Control-Allow-Origin' header"

```
Access to XMLHttpRequest at 'http://localhost:3000/api/...' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Causa:** Backend no permite requests desde frontend

**Solución:** Verificar configuración de CORS en backend

Backend (NestJS):
```ts
// ✅ Habilitar CORS
app.enableCors({
  origin: 'http://localhost:5173',  // URL del frontend
  credentials: true
});
```

Frontend `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 7. Errores de Estado y Re-renders

### ❌ Componente no se actualiza

**Causa:** setState no se ejecuta o dependencies incorrectas

```tsx
const [data, setData] = useState([]);

useEffect(() => {
  fetchData().then(setData);
  // ❌ Falta dependencia de fetchData
}, []);
```

**Solución:**

```tsx
// ✅ Opción 1: Mover función dentro
useEffect(() => {
  const fetchData = async () => { ... };
  fetchData();
}, []);

// ✅ Opción 2: useCallback + dependencias
const fetchData = useCallback(async () => { ... }, []);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

---

## 8. Errores de Componentes Perdidos

### ❌ Error: "Cannot find module '@/components/..."

**Causa:** Ruta inválida o alias no configurado

```ts
// ❌ INCORRECTO (sin alias)
import { Button } from '@/components/ui/Button';

// ✅ CORRECTO (ruta relativa)
import { Button } from '../../components/ui/Button';
```

**Si querés usar alias:**

En `vite.config.ts`:
```ts
import react from '@vitejs/plugin-react';
import path from 'path';

export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

En `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 9. Errores de Build

### ❌ Build falla con "vite v... building client"

**Solución:** Limpiar caché y reconstruir

```bash
rm -rf dist .vite node_modules/.vite
pnpm install
pnpm build
```

### ❌ Build lento

**Verificar:**
```bash
pnpm build  # Cuánto tiempo tarda?

# Limpiar caché
rm -rf dist node_modules/.vite

# Reintentar
pnpm build
```

---

## 10. Errores de Variables de Entorno

### ❌ VITE_API_BASE_URL no se carga

**Causa:** Archivo `.env.local` no existe o mal nombrado

**Verificar:**
```bash
# Debe existir
ls -la .env.local

# Debe contener:
# VITE_API_BASE_URL=http://localhost:3000/api
```

**Solución:**

```bash
cp .env.example .env.local
# Editar .env.local con URL correcta
```

**En código:**
```ts
// ✅ Acceder a variable
const baseURL = import.meta.env.VITE_API_BASE_URL;
```

---

## 11. Errores de Componentes UI

### ❌ Button no se ve / no funciona

**Verificar:**
```tsx
// ✅ Uso correcto
<Button 
  variant="primary"
  size="md"
  onClick={handleClick}
  isLoading={loading}
>
  Enviar
</Button>

// ❌ Uso incorrecto
<Button style={{ color: 'red' }}>  {/* Tailwind, no inline styles */}
<Button disabled className="...">  {/* disabled está en props */}
```

### ❌ Input/Select no captura valor

**Verificar:**
```tsx
// ✅ Correcto
const [value, setValue] = useState('');

<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  label="Email"
/>

// ❌ Incorrecto
<input value={value} onChange={...} />  {/* Usar componente Input */}
```

---

## 12. Errores de Filtrado y Búsqueda

### ❌ Filter no funciona en TicketsPage

**Causa:** Estado de filtro no se sincroniza con búsqueda

```tsx
// ✅ Correcto
const [search, setSearch] = useState('');
const [status, setStatus] = useState('');

const filtered = tickets.filter(ticket => 
  (search === '' || ticket.title.toLowerCase().includes(search.toLowerCase())) &&
  (status === '' || ticket.status === status)
);
```

---

## 13. Errores de Comentarios

### ❌ Comentarios no se agregan

**Verificar:**
```ts
// En useComments hook:

// ✅ Crear comentario
const createComment = async (content: string) => {
  const newComment = await commentService.createComment(ticketId, {
    content,
    isInternal: false
  });
  setComments([...comments, newComment]);
};
```

---

## 14. Errores de Autenticación

### ❌ No puedo navegar a /dashboard

**Causa:** ProtectedRoute rechaza porque no hay token

**Verificar:**
```ts
// En authService.ts
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return token !== null;
};
```

**Debug:**
```ts
// En browser console
import { authService } from './src/features/auth/services/authService';
authService.isAuthenticated()  // Debe ser true
```

---

## 15. Errores de Lint (No son errores reales)

### ⚠️ ESLint: "Unexpected any type"

```
✖ Unexpected any type (@typescript-eslint/no-explicit-any)
```

**Solución:** Ignorar línea si es necesario

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const value: any = something;
```

---

## 🔧 Herramientas de Debug

### 1. Console Log
```ts
console.log('Estado:', { data, loading, error });
```

### 2. React DevTools
```bash
# Instalar extensión Chrome/Firefox
# Inspeccionar componentes en Tab "Components"
```

### 3. Network Tab (F12)
```
Ver request/response de API:
- ¿Status code 200?
- ¿Headers contienen Authorization?
- ¿Response tiene datos correctos?
```

### 4. Local Storage (F12)
```
Application → Local Storage → http://localhost:5173
Ver:
- authToken (debe existir después de login)
```

### 5. TypeScript Errors
```bash
# Verificar errores de TS sin hacer build
pnpm tsc --noEmit
```

---

## 📋 Checklist de Debug

Cuando algo no funciona:

- [ ] ¿Rutas de importación correctas? (Contar `../`)
- [ ] ¿Token en localStorage? (F12 → Application)
- [ ] ¿Backend en http://localhost:3000? (Verificar en terminal)
- [ ] ¿.env.local con VITE_API_BASE_URL correcta?
- [ ] ¿Componentes importados desde `/components/ui/`?
- [ ] ¿Hooks de feature importados desde `/features/*/hooks/`?
- [ ] ¿TypeScript strict mode pasando? (`pnpm tsc --noEmit`)
- [ ] ¿Console tiene errores? (F12 → Console)
- [ ] ¿Network tiene 401/403? (F12 → Network)
- [ ] ¿Caché necesita limpiar? (`rm -rf dist .vite`)

---

## 💬 Preguntas Frecuentes

### P: ¿Por qué mi componente no se renderiza?
**R:** Verificar que esté importado en la página y que no haya errores en console.

### P: ¿Por qué la API retorna 401?
**R:** Token inválido o expirado. Hacer logout y login de nuevo.

### P: ¿Por qué el filtro no funciona?
**R:** Verificar que el estado de filtro se actualice correctamente en onChange.

### P: ¿Puedo cambiar el diseño de colores?
**R:** Editar `tailwind.config.js` para cambiar tema, pero respeta el contract visual.

### P: ¿Cómo agrego un nuevo campo a un formulario?
**R:** Agregar a tipo en `types/index.ts`, luego a servicio, hook y página.

