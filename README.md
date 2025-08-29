# 🚀 Angular Portfolio - Portafolio Profesional

Un portafolio web moderno y responsive desarrollado con Angular, que incluye un panel de administración completo para gestionar proyectos y experiencia laboral.

## 🌟 Características Principales

### 🎨 Frontend (Portfolio Público)

- **Diseño Moderno**: Interfaz elegante con efectos de cristal y gradientes
- **Tema Dinámico**: Cambio entre modo claro y oscuro
- **Responsive Design**: Optimizado para todos los dispositivos
- **Animaciones Suaves**: Transiciones fluidas y efectos visuales
- **SEO Optimizado**: Meta tags y estructura semántica

### 🔧 Panel de Administración

- **Dashboard Interactivo**: Estadísticas y métricas en tiempo real
- **Gestión de Proyectos**: CRUD completo para proyectos
- **Gestión de Experiencia**: Administración de trabajos y experiencia
- **Autenticación Segura**: Sistema de login con roles
- **Upload de Imágenes**: Subida y gestión de imágenes
- **Tema Dinámico**: Cambio de tema integrado en el admin

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Angular 11**: Framework principal
- **TypeScript**: Lenguaje de programación
- **SCSS/CSS**: Estilos con variables CSS y efectos modernos
- **Font Awesome**: Iconografía
- **RxJS**: Programación reactiva

### Deploy

- **Vercel**: Plataforma de despliegue
- **Node.js**: Runtime de JavaScript

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios core y guards
│   ├── features/
│   │   ├── admin/              # Panel de administración
│   │   │   ├── pages/          # Páginas del admin
│   │   │   ├── shared/         # Componentes compartidos del admin
│   │   │   └── services/       # Servicios del admin
│   │   └── portfolio/          # Portfolio público
│   │       ├── pages/          # Páginas del portfolio
│   │       └── shared/         # Componentes compartidos
│   └── shared/                 # Componentes globales
├── assets/                     # Imágenes y recursos estáticos
└── environments/               # Configuraciones de entorno
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 10-14)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/teckuro/angular-portafolio.git
   cd angular-portafolio
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**

   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:4201
   ```

### Scripts Disponibles

- `npm start`: Servidor de desarrollo
- `npm run build`: Construcción para producción
- `npm run test`: Ejecutar tests unitarios
- `npm run e2e`: Ejecutar tests end-to-end
- `npm run lint`: Verificar código con ESLint

## 🌐 Despliegue

### Vercel (Recomendado)

El proyecto está configurado para despliegue automático en Vercel:

1. Conectar el repositorio a Vercel
2. Configurar variables de entorno si es necesario
3. El despliegue se ejecuta automáticamente

**Configuración incluida:**

- `vercel.json` con rewrites para SPA routing
- Build command: `npm run build`
- Output directory: `dist/angular-portafolio`

### URL de Producción

- **Portfolio**: https://angular-portafolio.vercel.app
- **Admin**: https://angular-portafolio.vercel.app/admin

## 🎯 Funcionalidades del Admin

### Dashboard

- Estadísticas de proyectos y experiencia
- Gráficos interactivos
- Métricas en tiempo real

### Gestión de Proyectos

- Crear, editar y eliminar proyectos
- Upload de imágenes
- Categorización y tags
- Estados de publicación

### Gestión de Experiencia

- Administrar trabajos y experiencia laboral
- Fechas y descripciones
- Logos de empresas
- Ordenamiento cronológico

### Sistema de Usuarios

- Autenticación segura
- Roles de administrador
- Gestión de sesiones

## 🎨 Sistema de Temas

El proyecto incluye un sistema de temas dinámico:

### Características

- **Cambio en Tiempo Real**: Sin recarga de página
- **Persistencia**: El tema se mantiene entre sesiones
- **Consistencia**: Variables CSS globales
- **Flexibilidad**: Componente reutilizable con clases dinámicas

### Implementación

- Variables CSS para colores y efectos
- Componente `ThemeToggleComponent` reutilizable
- Estilos específicos para admin y portfolio
- Responsive design para todos los tamaños

## 📱 Responsive Design

### Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

### Características

- Layout adaptativo
- Navegación móvil optimizada
- Imágenes responsivas
- Touch-friendly en móviles

## 🔒 Seguridad

### Autenticación

- Guards de ruta para admin
- Interceptores HTTP
- Manejo de tokens
- Protección de rutas sensibles

### Validación

- Formularios reactivos
- Validación en frontend
- Sanitización de datos
- Manejo de errores

## 🧪 Testing

### Tests Unitarios

- Jasmine y Karma
- Cobertura de código
- Tests de componentes y servicios

### Tests E2E

- Protractor
- Tests de flujos completos
- Validación de funcionalidades críticas

## 📈 Performance

### Optimizaciones

- Lazy loading de módulos
- Compresión de assets
- Minificación de código
- Caching optimizado

### Métricas

- Lighthouse score > 90
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s

## 🤝 Contribución

### Guías de Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código

- ESLint para linting
- Prettier para formateo
- Conventional Commits
- TypeScript strict mode

## 👨‍💻 Autor

**Teckuro**

- GitHub: [@teckuro](https://github.com/teckuro)
- Portfolio: https://angular-portafolio.vercel.app

## 🙏 Agradecimientos

- Angular Team por el framework
- Vercel por el hosting
- Font Awesome por los iconos
- Comunidad de desarrolladores

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
