# Portfolio Personal - Angular

Portfolio personal desarrollado con Angular y TypeScript, incluyendo un panel de administración completo para gestionar proyectos y experiencias laborales.

## 🚀 Características

- **Portfolio Frontend**: Diseño moderno y responsive
- **Panel de Administración**: CRUD completo para proyectos y experiencias
- **API Laravel**: Backend robusto con autenticación
- **Arquitectura Modular**: Organización siguiendo mejores prácticas de Angular

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios core, guards, interceptors
│   ├── features/
│   │   ├── admin/           # Panel de administración
│   │   │   ├── pages/       # Páginas del admin
│   │   │   ├── shared/      # Componentes y servicios del admin
│   │   │   └── admin.module.ts
│   │   └── portfolio/       # Frontend del portfolio
│   │       ├── pages/       # Páginas del portfolio
│   │       ├── shared/      # Componentes y servicios del portfolio
│   │       └── portfolio.module.ts
│   └── shared/              # Componentes compartidos
└── assets/                  # Imágenes y recursos estáticos
```

## 🛠️ Tecnologías

- **Frontend**: Angular 17, TypeScript, SCSS
- **Backend**: Laravel 11, PHP 8.2
- **Base de Datos**: SQLite (desarrollo) / MySQL (producción)
- **Autenticación**: Laravel Sanctum

## 🚀 Instalación y Uso

### Opción 1: Script Automático (Recomendado)

```bash
# Ejecutar el script que inicia ambos servidores
start-servers.bat
```

### Opción 2: Instalación Manual

#### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd angular-portafolio
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Configurar API Laravel

```bash
cd ../api-portafolio
composer install
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

#### 4. Iniciar Angular

```bash
ng serve
```

#### 5. Acceder a la aplicación

- **Portfolio**: http://localhost:4200
- **Admin**: http://localhost:4200/admin
- **API Laravel**: http://127.0.0.1:8000

## 📋 Funcionalidades

### Portfolio Frontend

- ✅ Visualización de proyectos destacados
- ✅ Lista completa de proyectos
- ✅ Experiencias laborales
- ✅ Diseño responsive
- ✅ Filtros por tecnología

### Panel de Administración

- ✅ Autenticación segura
- ✅ CRUD de proyectos
- ✅ CRUD de experiencias laborales
- ✅ Gestión de estados (activo/inactivo/borrador)
- ✅ Estadísticas en tiempo real
- ✅ Interfaz intuitiva

## 🖼️ Sistema de Upload de Imágenes

✅ **Completamente funcional** - Las imágenes se suben correctamente al servidor Laravel y son accesibles desde el frontend.

### Características:

- **Upload seguro**: Validación de tipos y tamaños de archivo
- **Optimización automática**: Redimensionamiento y compresión
- **Almacenamiento organizado**: Categorías por tipo (projects, works, temp)
- **URLs públicas**: Acceso directo desde el navegador
- **Fallback inteligente**: Funciona incluso si la API no está disponible

### Archivos de configuración:

- `SOLUCION-IMAGENES.md` - Documentación completa de la solución
- `start-servers.bat` - Script para iniciar ambos servidores

## 🔧 Configuración

### Variables de Entorno

```typescript
// src/environments/environment.ts
export const environment = {
	production: false,
	apiUrl: 'http://127.0.0.1:8000/api',
	appUrl: 'http://127.0.0.1:4200'
};
```

### API Endpoints

- **Frontend**: `/api/projects`, `/api/works`
- **Admin**: `/api/admin/projects`, `/api/admin/works`
- **Auth**: `/api/admin/login`, `/api/admin/logout`

## 📱 Responsive Design

El portfolio está optimizado para:

- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Pantallas grandes (1440px+)

## 🎨 Diseño

- **Paleta de colores**: Moderna y profesional
- **Tipografía**: Roboto y Poppins
- **Iconos**: Material Design Icons
- **Animaciones**: Transiciones suaves

## 🔒 Seguridad

- Autenticación con Laravel Sanctum
- Guards para rutas protegidas
- Validación de datos en frontend y backend
- Interceptores HTTP para manejo de errores

## 📈 Performance

- Lazy loading de módulos
- Optimización de imágenes
- Código splitting automático
- Service Workers para cache

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **Email**: tu-email@ejemplo.com
- **LinkedIn**: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- **GitHub**: [Tu Usuario](https://github.com/tu-usuario)

---

Desarrollado con ❤️ usando Angular y Laravel
