# Panel de Administración - Angular Portfolio

## Descripción

Este panel de administración permite gestionar el contenido del portfolio de manera dinámica a través de una interfaz web moderna y responsive. Se conecta con una API Laravel para el manejo de datos.

## Características

### 🔐 Autenticación y Autorización
- Sistema de login/logout seguro
- Roles de usuario (Admin, Super Admin)
- Protección de rutas con guards
- Tokens JWT para autenticación

### 📊 Dashboard
- Estadísticas en tiempo real
- Resumen de proyectos y experiencia laboral
- Acciones rápidas para gestión de contenido
- Interfaz moderna y responsive

### 🛠️ Gestión de Contenido
- **Proyectos**: Crear, editar, eliminar y gestionar proyectos
- **Experiencia Laboral**: Administrar historial profesional
- **Estados**: Control de visibilidad (Activo, Inactivo, Borrador)
- **Destacados**: Marcar contenido como destacado

### 🔧 Funcionalidades Técnicas
- Lazy loading de módulos
- Interceptores HTTP para autenticación
- Manejo de errores centralizado
- Validación de formularios
- Paginación y filtros

## Estructura del Proyecto

```
src/app/features/admin/
├── models/
│   ├── admin-user.model.ts
│   ├── admin-project.model.ts
│   └── admin-work.model.ts
├── services/
│   ├── admin-auth.service.ts
│   ├── admin-projects.service.ts
│   └── admin-works.service.ts
├── admin-login/
│   ├── admin-login.component.ts
│   ├── admin-login.component.html
│   └── admin-login.component.css
├── admin-dashboard/
│   ├── admin-dashboard.component.ts
│   ├── admin-dashboard.component.html
│   └── admin-dashboard.component.css
├── admin.module.ts
└── admin-routing.module.ts

src/app/core/
├── guards/
│   ├── admin-auth.guard.ts
│   └── admin-role.guard.ts
└── interceptors/
    └── admin-auth.interceptor.ts
```

## Instalación y Configuración

### 1. Dependencias Requeridas

Asegúrate de tener instalado:
- Node.js (v14 o superior)
- Angular CLI (v15 o superior)
- Laravel (v9 o superior)
- MySQL/PostgreSQL

### 2. Configuración del Frontend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api' // URL de tu API Laravel
};
```

### 3. Configuración del Backend

Sigue la documentación en `LARAVEL_API_DOCUMENTATION.md` para configurar la API Laravel.

### 4. Ejecutar el Proyecto

```bash
# Frontend (Angular)
ng serve

# Backend (Laravel)
php artisan serve
```

## Uso del Panel de Administración

### Acceso al Panel

1. Navega a `http://localhost:4200/admin/login`
2. Ingresa las credenciales de administrador
3. Serás redirigido al dashboard

### Credenciales por Defecto

```
Email: admin@example.com
Password: password
```

### Navegación

#### Dashboard (`/admin/dashboard`)
- **Estadísticas**: Vista general de proyectos y experiencia laboral
- **Acciones Rápidas**: Enlaces directos a funciones principales
- **Información del Usuario**: Perfil y rol del administrador

#### Gestión de Proyectos (`/admin/projects`)
- **Listar**: Ver todos los proyectos con filtros
- **Crear**: Agregar nuevos proyectos
- **Editar**: Modificar proyectos existentes
- **Eliminar**: Remover proyectos
- **Estados**: Cambiar visibilidad (Activo/Inactivo/Borrador)
- **Destacados**: Marcar proyectos como destacados

#### Gestión de Experiencia Laboral (`/admin/works`)
- **Listar**: Ver toda la experiencia laboral
- **Crear**: Agregar nuevas experiencias
- **Editar**: Modificar experiencias existentes
- **Eliminar**: Remover experiencias
- **Estados**: Control de visibilidad
- **Actual**: Marcar trabajo actual

### Roles y Permisos

#### Admin
- Gestión completa de proyectos
- Gestión completa de experiencia laboral
- Acceso al dashboard
- Edición de perfil personal

#### Super Admin
- Todas las funciones de Admin
- Configuración del sistema
- Gestión de usuarios administradores
- Acceso a logs y estadísticas avanzadas

## API Endpoints

### Autenticación
```
POST /api/admin/login
POST /api/admin/register
POST /api/admin/logout
GET /api/admin/profile
```

### Proyectos
```
GET /api/admin/projects
POST /api/admin/projects
GET /api/admin/projects/{id}
PUT /api/admin/projects/{id}
DELETE /api/admin/projects/{id}
PATCH /api/admin/projects/{id}/status
PATCH /api/admin/projects/{id}/featured
POST /api/admin/projects/{id}/image
GET /api/admin/projects/stats
```

### Experiencia Laboral
```
GET /api/admin/works
POST /api/admin/works
GET /api/admin/works/{id}
PUT /api/admin/works/{id}
DELETE /api/admin/works/{id}
PATCH /api/admin/works/{id}/status
PATCH /api/admin/works/{id}/current
GET /api/admin/works/stats
GET /api/admin/works/company/{company}
GET /api/admin/works/tech/{tech}
```

## Seguridad

### Autenticación
- Tokens JWT con expiración
- Almacenamiento seguro en localStorage
- Interceptor automático para headers de autorización
- Logout automático en tokens expirados

### Autorización
- Guards para protección de rutas
- Verificación de roles en componentes
- Middleware de autenticación en API

### Validación
- Validación de formularios en frontend
- Validación robusta en backend
- Sanitización de datos
- Manejo de errores centralizado

## Personalización

### Estilos
Los estilos están organizados por componente en archivos CSS separados. Puedes modificar:
- `admin-login.component.css` - Estilos del login
- `admin-dashboard.component.css` - Estilos del dashboard
- Variables CSS globales en `styles.css`

### Configuración
- **API URL**: Modificar en `environment.ts`
- **Roles**: Editar en `admin-user.model.ts`
- **Rutas**: Configurar en `admin-routing.module.ts`

### Extensiones
Para agregar nuevas funcionalidades:

1. **Nuevos Modelos**: Crear en `models/`
2. **Nuevos Servicios**: Crear en `services/`
3. **Nuevos Componentes**: Crear en carpetas separadas
4. **Nuevas Rutas**: Agregar en `admin-routing.module.ts`

## Troubleshooting

### Problemas Comunes

#### Error de CORS
```
Error: Access to XMLHttpRequest has been blocked by CORS policy
```
**Solución**: Configurar CORS en Laravel (`config/cors.php`)

#### Error de Autenticación
```
Error: 401 Unauthorized
```
**Solución**: Verificar token y configuración de Sanctum

#### Error de Rutas
```
Error: Cannot match any routes
```
**Solución**: Verificar configuración de rutas en Angular y Laravel

### Logs y Debugging

#### Frontend
```bash
# Ver logs en consola del navegador
F12 > Console

# Modo debug de Angular
ng serve --configuration=development
```

#### Backend
```bash
# Ver logs de Laravel
tail -f storage/logs/laravel.log

# Modo debug
APP_DEBUG=true en .env
```

## Mantenimiento

### Backups
- Respaldar base de datos regularmente
- Mantener copias de archivos de configuración
- Versionar cambios con Git

### Actualizaciones
- Mantener Angular y Laravel actualizados
- Revisar dependencias regularmente
- Probar en entorno de desarrollo antes de producción

### Monitoreo
- Revisar logs de errores
- Monitorear rendimiento
- Verificar seguridad regularmente

## Soporte

Para soporte técnico o preguntas:
1. Revisar la documentación de Laravel API
2. Consultar logs de errores
3. Verificar configuración de entorno
4. Contactar al equipo de desarrollo

## Licencia

Este proyecto está bajo la licencia MIT. Ver archivo LICENSE para más detalles.
