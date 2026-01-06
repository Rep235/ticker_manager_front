# Guía Rápida - Ticket Manager Frontend

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear archivo de configuración
cp .env.example .env.local

# 3. Iniciar servidor de desarrollo
pnpm dev

# Abre http://localhost:5173
```

## 📋 Estado del Proyecto

✅ **Completo y funcional:**
- Arquitectura modular según contrato
- Autenticación (login/registro)
- CRUD de tickets, usuarios, clientes
- Sistema de comentarios
- Dashboard con estadísticas
- UI responsive y moderna
- Manejo de errores y estados de carga

## 🔑 Credenciales de Prueba

Para probar, primero registra un usuario nuevo en `/register` o usa existentes del backend.

## 📁 Estructura de Carpetas

```
src/
├── app/               → Router y configuración
├── pages/             → Componentes de página
├── components/
│   ├── ui/            → Botones, inputs, cards
│   └── common/        → Header, sidebar, alerts
├── features/
│   ├── auth/          → Autenticación
│   ├── tickets/       → Gestión de tickets
│   ├── users/         → Gestión de usuarios
│   └── clients/       → Gestión de clientes
├── services/          → Cliente HTTP (axios)
├── hooks/             → Hooks genéricos
├── lib/               → Utilidades
└── types/             → Tipos TypeScript
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev              # Servidor con hot reload
pnpm lint             # Verificar código
pnpm build            # Compilar para producción
pnpm preview          # Ver build localmente

# TypeScript
pnpm tsc --noEmit     # Verificar tipos sin compilar
```

## 🎨 Componentes Principales

### Login/Register
- `LoginPage.tsx` - Formulario de login
- `RegisterPage.tsx` - Formulario de registro

### Dashboard
- `DashboardPage.tsx` - Panel principal con estadísticas

### Tickets
- `TicketsPage.tsx` - Listado con filtros
- `TicketDetailPage.tsx` - Detalle y comentarios

### Administración
- `UsersPage.tsx` - Gestión de usuarios
- `ClientsPage.tsx` - Gestión de clientes

## 🔌 API Integration

El cliente HTTP (`services/http/client.ts`) conecta con:
```
http://localhost:3000/api
```

Configurable en `.env.local` con `VITE_API_BASE_URL`

## 📡 Endpoints Utilizados

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/register` | Registrarse |
| GET | `/tickets` | Listar tickets |
| POST | `/tickets` | Crear ticket |
| PUT | `/tickets/:id` | Actualizar ticket |
| DELETE | `/tickets/:id` | Eliminar ticket |
| GET | `/comments?ticketId=:id` | Comentarios |
| POST | `/comments` | Crear comentario |
| GET | `/users` | Listar usuarios |
| POST | `/users` | Crear usuario |
| GET | `/clients` | Listar clientes |
| POST | `/clients` | Crear cliente |

## 🎯 Funcionalidades Principales

### 1. Authentication
- [x] Login con email/password
- [x] Registro de nuevos usuarios
- [x] Rutas protegidas
- [x] Token JWT en localStorage

### 2. Tickets
- [x] Crear ticket
- [x] Listado con búsqueda y filtros
- [x] Detalle completo
- [x] Actualizar estado/prioridad
- [x] Eliminar ticket
- [x] Comentarios en ticket

### 3. Usuarios
- [x] Listar usuarios
- [x] Crear usuario
- [x] Ver estado (activo/inactivo)

### 4. Clientes
- [x] Listar clientes
- [x] Crear cliente
- [x] Planes (FREE, BASIC, PREMIUM, ENTERPRISE)

## ⚠️ Notas Importantes

1. **Autenticación:** El token se guarda en `localStorage` como `authToken`
2. **Errores 401:** Limpian automáticamente el token y redirigen a login
3. **TypeScript Estricto:** Todo debe estar tipado
4. **Tailwind Only:** No hay CSS personalizado, solo Tailwind classes
5. **Mobile First:** Responsive desde mobile hasta desktop

## 🐛 Debugging

```javascript
// Ver token actual
localStorage.getItem('authToken')

// Limpiar sesión
localStorage.removeItem('authToken')
window.location.href = '/login'
```

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "axios": "^1.13.2",
  "lucide-react": "^0.562.0",
  "tailwindcss": "^4.1.18"
}
```

## 🎓 Patrón de Componentes

### Componente UI Simple
```tsx
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button className="..." {...props}>{children}</button>
);
```

### Hook de Datos
```tsx
export const useTickets = () => {
  const [state, setState] = useState({ tickets: [], loading: false, error: null });
  const fetch = async () => { /* ... */ };
  useEffect(() => { fetch(); }, []);
  return { ...state, refetch: fetch };
};
```

### Página/Componente Contenedor
```tsx
const TicketsPage: React.FC = () => {
  const { tickets, loading, error } = useTickets();
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  return <div>/* render */</div>;
};
```

## 🔐 Seguridad

- JWT en localStorage (considera usar httpOnly en producción)
- CORS configurado en backend
- Validación de entrada en formularios
- Manejo de errores sin exponer sensibles

## 📞 Soporte

Para dudas o problemas:
1. Revisar `/docs/ai/` para contratos de arquitectura
2. Revisar comentarios en el código
3. Verificar tipos en `src/types/index.ts`
4. Usar DevTools de React/Vite

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0
