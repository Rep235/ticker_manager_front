# ✅ Checklist Pre-Producción

## 🎯 Objetivo
Verificar que la aplicación está lista para producción antes de deployar.

---

## 1. Compilación y Build

- [ ] **Limpiar caché**: `rm -rf dist node_modules/.vite`
- [ ] **Instalar dependencias**: `pnpm install`
- [ ] **TypeScript compila**: `pnpm tsc --noEmit` (sin errores)
- [ ] **Build exitoso**: `pnpm build` (sin errores fatales)
- [ ] **Build size razonable**: `dist/assets/*.js < 500KB` (después de gzip)
- [ ] **Archivos generados**: Verificar que exista `dist/index.html` y assets

---

## 2. Configuración

- [ ] **`.env.local` existe**: `ls -la .env.local`
- [ ] **`VITE_API_BASE_URL` correcto**: Apunta a URL de producción
- [ ] **No hay secretos en `.env.local`**: Solo contiene URLs públicas
- [ ] **Variables documentadas**: Existe `.env.example` con todas las vars

### Ejemplo `.env.local` producción
```
VITE_API_BASE_URL=https://api.midominio.com/api
```

---

## 3. Autenticación y Seguridad

- [ ] **Token en localStorage**: Verificar que se guarde correctamente
- [ ] **Token se envía en headers**: Verificar en Network tab (F12)
- [ ] **Logout limpia token**: localStorage vacío después de logout
- [ ] **401 redirige a login**: Cualquier token inválido va a /login
- [ ] **No hay tokens en logs**: Console.log no contiene tokens
- [ ] **HTTPS en producción**: Solo production URLs con HTTPS
- [ ] **CORS configurado en backend**: Frontend puede hacer requests

---

## 4. Funcionalidad Principal

### Autenticación
- [ ] **Login funciona**: Introduce email/password válidos
- [ ] **Registro funciona**: Crear usuario nuevo exitosamente
- [ ] **Logout funciona**: Token se borra, redirige a /login
- [ ] **Sesión persiste**: Refrescar página mantiene sesión
- [ ] **Redireccionamiento funciona**: Página protegida → login sin token

### Tickets
- [ ] **Listar tickets**: Carga lista desde API
- [ ] **Buscar tickets**: Filtro por título funciona
- [ ] **Filtrar por status**: Dropdown de status filtra correctamente
- [ ] **Filtrar por priority**: Dropdown de priority filtra correctamente
- [ ] **Ver detalle**: Click en ticket abre detalle
- [ ] **Editar ticket**: Cambiar status/priority guarda en API
- [ ] **Crear comentario**: Agregar comentario en detalle
- [ ] **Listar comentarios**: Todos aparecen con autor y timestamp

### Usuarios
- [ ] **Listar usuarios**: Carga lista desde API
- [ ] **Crear usuario**: Formulario agrega usuario a API
- [ ] **Validación**: Email único, password 8+ caracteres
- [ ] **Eliminar usuario**: Delete button funciona

### Clientes
- [ ] **Listar clientes**: Carga lista desde API
- [ ] **Crear cliente**: Formulario agrega cliente a API
- [ ] **Mostrar tier**: Badge con color según ClientTier
- [ ] **Eliminar cliente**: Delete button funciona

### Dashboard
- [ ] **Cargar estadísticas**: Números de tickets, usuarios, clientes
- [ ] **Mostrar tickets recientes**: Widget con últimos 5 tickets
- [ ] **Actualizar datos**: Números corresponden con páginas específicas

---

## 5. UI/UX

### Responsividad
- [ ] **Mobile (320px)**: Layout se adapta a pantallas pequeñas
- [ ] **Tablet (768px)**: Sidebar se convierte en hamburger
- [ ] **Desktop (1024px+)**: Sidebar visible, layout completo
- [ ] **No hay scroll horizontal**: Contenido no desborda

### Estados de Carga
- [ ] **LoadingState aparece**: Mientras se cargan datos
- [ ] **ErrorState aparece**: Cuando hay error en API
- [ ] **EmptyState aparece**: Cuando no hay datos
- [ ] **Spinner anima**: LoadingState tiene animación

### Componentes
- [ ] **Botones funcionales**: onClick ejecuta acción
- [ ] **Inputs capturan valores**: onChange actualiza estado
- [ ] **Selects permiten seleccionar**: Opciones visibles
- [ ] **Cards tienen información clara**: Header, body, footer
- [ ] **Alerts se ven bien**: Error (rojo), Success (verde), Info (azul)

### Accesibilidad
- [ ] **Focus visible**: Tab key navega elementos
- [ ] **aria-labels presentes**: Elementos interactivos tienen etiquetas
- [ ] **Colores: Suficiente contraste**: Texto legible sobre fondo
- [ ] **Keyboard navigation funciona**: Enviar forma con Enter

---

## 6. Errores y Manejo

- [ ] **API error muestra mensaje**: Error legible al usuario
- [ ] **Red error tiene retry**: Botón para reintentar
- [ ] **400 Bad Request muestra qué faltó**: Validación clara
- [ ] **401 Unauthorized redirige**: A login automáticamente
- [ ] **403 Forbidden muestra "No acceso"**: Mensaje claro
- [ ] **500 Server error es genérico**: No expone detalles internos
- [ ] **Console sin errores**: F12 → Console está limpia
- [ ] **Console sin warnings**: Solo warnings normales de React

---

## 7. Performance

- [ ] **Página carga en < 3s**: En conexión 4G
- [ ] **Interacción es rápida**: Click a respuesta < 500ms
- [ ] **No hay memory leaks**: DevTools → Memory, sin crecimiento
- [ ] **Sin requests duplicadas**: Verificar Network tab
- [ ] **Imágenes optimizadas**: Si las hay, < 100KB c/u
- [ ] **Bundle size < 500KB**: Gzip, verificar en build

---

## 8. Navegación

- [ ] **Links de Sidebar funcionan**: Navegan a página correcta
- [ ] **Breadcrumbs navegables**: Click va a página padre
- [ ] **Back button funciona**: Browser back va a página anterior
- [ ] **URLs son semánticas**: `/tickets`, `/users`, etc.
- [ ] **Deep linking funciona**: Copiar URL y pegar carga página

---

## 9. Integración API

- [ ] **Base URL correcta**: Apunta a API en producción
- [ ] **Authorization header presente**: Bearer token en requests
- [ ] **Content-Type correcto**: application/json
- [ ] **Métodos HTTP correctos**: GET, POST, PUT, DELETE
- [ ] **Payloads correctos**: Campos que backend espera
- [ ] **Respuestas se mapean a tipos**: TypeScript tipos coinciden

### Verificar cada endpoint
```
GET /api/auth/me               → Obtener usuario actual
POST /api/auth/login            → Login
POST /api/auth/register         → Registro
POST /api/auth/logout           → Logout

GET /api/tickets                → Listar
POST /api/tickets               → Crear
GET /api/tickets/:id            → Detalle
PUT /api/tickets/:id            → Actualizar
DELETE /api/tickets/:id         → Eliminar

GET /api/tickets/:id/comments   → Comentarios
POST /api/tickets/:id/comments  → Crear comentario
PUT /api/comments/:id           → Editar comentario
DELETE /api/comments/:id        → Eliminar comentario

GET /api/users                  → Listar
POST /api/users                 → Crear
GET /api/users/:id              → Detalle
PUT /api/users/:id              → Actualizar
DELETE /api/users/:id           → Eliminar

GET /api/clients                → Listar
POST /api/clients               → Crear
GET /api/clients/:id            → Detalle
PUT /api/clients/:id            → Actualizar
DELETE /api/clients/:id         → Eliminar
```

---

## 10. Cross-Browser Testing

- [ ] **Chrome**: Funciona completamente
- [ ] **Firefox**: Funciona completamente
- [ ] **Safari**: Funciona completamente
- [ ] **Edge**: Funciona completamente
- [ ] **Mobile Safari (iOS)**: Responsive y funcional
- [ ] **Chrome Mobile**: Responsive y funcional

---

## 11. Documentación

- [ ] **README.md actualizado**: Instrucciones de setup
- [ ] **QUICK_START.md existe**: Guía rápida
- [ ] **ARCHITECTURE.md existe**: Explicación de estructura
- [ ] **CONTRIBUTING.md existe**: Cómo agregar features
- [ ] **TROUBLESHOOTING.md existe**: Solución de problemas
- [ ] **Comentarios en código**: Funciones complejas explicadas
- [ ] **Tipos documentados**: Interfaces con JSDoc (opcional)

---

## 12. Código Quality

- [ ] **No hay unused imports**: `import` que no se usan
- [ ] **No hay unused variables**: Variables sin usar
- [ ] **No hay `any` types**: Todos tipados correctamente
- [ ] **No hay console.log**: Excepto en development
- [ ] **Nombres descriptivos**: Variables/funciones claras
- [ ] **Funciones pequeñas**: < 50 líneas c/u
- [ ] **Componentes pequeños**: < 100 líneas c/u
- [ ] **Sin código duplicado**: DRY principle
- [ ] **Sin hardcoded URLs**: Variables de entorno

---

## 13. Seguridad

- [ ] **Tokens seguros**: localStorage (no ideal pero funciona)
- [ ] **No hay credenciales en código**: No hardcoded passwords
- [ ] **No hay secretos en repo**: .gitignore excluye .env.local
- [ ] **CORS bien configurado**: Solo origin permitido
- [ ] **No hay vulnerabilidades**: `pnpm audit`
- [ ] **Validación en frontend**: Para UX, pero validar en backend también

### Comando de verificación
```bash
pnpm audit
# Debe mostrar 0 vulnerabilities
```

---

## 14. Git y Control de Versión

- [ ] **`.gitignore` completo**: Excluye dist/, node_modules/, .env.local
- [ ] **Último commit tiene descripción**: Mensaje claro
- [ ] **No hay archivos sin trackear**: `git status` limpio
- [ ] **Ramas mergeadas**: No hay ramas viejas sin usar
- [ ] **Histórico limpio**: Commits lógicos y descriptivos

---

## 15. Deploy Checklist

### Antes de Deploy
- [ ] **Branch protegida**: main/master requiere review
- [ ] **CI/CD pasa**: Tests y linting pasan
- [ ] **Build producción exitoso**: `pnpm build`
- [ ] **Preview funciona**: `pnpm preview`
- [ ] **Secretos en lugar seguro**: Variables de entorno en platform

### Deploy a Hosting
- [ ] **Hosting configurado**: Vercel, Netlify, etc.
- [ ] **Environment variables seteadas**: En plataforma
- [ ] **Build command correcto**: `pnpm install && pnpm build`
- [ ] **Output directory**: `dist/`
- [ ] **SPA redirect configurado**: _redirects o SPA config
- [ ] **HTTPS habilitado**: Certificado SSL válido
- [ ] **CORS en backend actualizado**: Permitir nuevo origin

### Después de Deploy
- [ ] **URL accesible**: https://midominio.com carga
- [ ] **Assets cargan**: CSS, JS, imágenes visibles
- [ ] **API conecta**: Requests a backend funcionan
- [ ] **No hay errores de CORS**: Console limpia
- [ ] **Performance OK**: Pagina carga < 3s
- [ ] **Funcionalidad completa**: Todos features funcionan

---

## 16. Rollback Plan

Si algo falla en producción:

```bash
# 1. Verificar qué salió mal
# - Verificar Sentry/logs
# - Ver Network tab en browser
# - Revisar API responses

# 2. Revertir rápido
# - Vercel/Netlify: Revert to previous deployment
# - Manual: git revert, rebuild, redeploy

# 3. Comunicar
# - Equipo sabe
# - Status página actualizada (si tienes)
# - Clientes notificados

# 4. Post-mortem
# - Qué falló
# - Por qué no fue atrapado
# - Cómo prevenir en futuro
```

---

## 17. Monitoreo Post-Deploy

- [ ] **Error tracking habilitado**: Sentry, LogRocket, etc.
- [ ] **Analytics configurado**: Google Analytics o equivalente
- [ ] **Alertas seteadas**: Notificación si error rate sube
- [ ] **Health checks**: Monitorear endpoint key cada 5min
- [ ] **Dashboards creados**: Ver métricas importantes
- [ ] **Backups habilitados**: Si tienes base de datos

---

## 18. Script de Verificación Rápida

```bash
#!/bin/bash
echo "🚀 Pre-Production Checklist"

echo "1️⃣  TypeScript..."
pnpm tsc --noEmit || exit 1

echo "2️⃣  Build..."
pnpm build || exit 1

echo "3️⃣  Build size..."
ls -lh dist/assets/*.js | awk '{print $9, $5}'

echo "4️⃣  Dependencies..."
pnpm audit || exit 1

echo "5️⃣  All clear! ✅"
```

Guardar como `scripts/preproduction.sh` y ejecutar:
```bash
chmod +x scripts/preproduction.sh
./scripts/preproduction.sh
```

---

## 📋 Matriz de Verificación Rápida

| Categoría | Item | Status | Notas |
|-----------|------|--------|-------|
| Build | Compila sin errores | ☐ | |
| Build | Size < 500KB | ☐ | |
| Config | Variables de entorno | ☐ | |
| Config | HTTPS en prod | ☐ | |
| Auth | Login funciona | ☐ | |
| Auth | Token se envía | ☐ | |
| Features | CRUD tickets | ☐ | |
| Features | Usuarios | ☐ | |
| Features | Clientes | ☐ | |
| API | Endpoints correctos | ☐ | |
| UI | Responsive | ☐ | |
| UI | Sin errores console | ☐ | |
| Security | Sin hardcoded secrets | ☐ | |
| Security | Sin vulnerabilidades | ☐ | |
| Perf | < 3s load time | ☐ | |
| Docs | README actualizado | ☐ | |

---

## 🎯 Resumen

Cuando TODOS los checkboxes estén ✅, la aplicación está lista para producción.

**Última verificación antes de hacer click en "Deploy":**
```bash
# Terminal
pnpm build            # ✅ Compila
pnpm audit            # ✅ Sin vulnerabilidades
pnpm preview          # ✅ Previsualizar

# Browser
# Verificar http://localhost:4173
# - Login funciona
# - Tickets cargan
# - Sin errores en console
```

**Si todo está verde → DEPLOY** 🚀

