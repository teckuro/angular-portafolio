# Portfolio Profesional - Juan Pablo Huerta

Portfolio personal desarrollado con Angular 11 que muestra mi experiencia profesional, proyectos y habilidades técnicas como Desarrollador Full Stack.

## 🚀 Características

- **Diseño Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- **Animaciones Fluidas**: Transiciones suaves y efectos visuales modernos
- **SEO Optimizado**: Meta tags, Open Graph y structured data para mejor posicionamiento
- **PWA Ready**: Configurado como Progressive Web App para instalación móvil
- **Navegación Suave**: Scroll automático entre secciones
- **Modal Interactivo**: Curriculum detallado con opción de descarga PDF

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular 11, TypeScript, HTML5, CSS3
- **Animaciones**: CSS Transitions, Intersection Observer API
- **SEO**: Meta tags, Open Graph, Twitter Cards, Schema.org
- **PWA**: Web App Manifest, Service Worker
- **Analytics**: Sistema manual de tracking + Vercel Analytics
- **Testing**: Jasmine, Karma
- **Herramientas**: Angular CLI, ESLint, Prettier

## 📱 Secciones del Portfolio

1. **Sobre Mí**: Descripción profesional y experiencia
2. **Experiencia Laboral**: Historial de trabajo con tecnologías utilizadas
3. **Proyectos**: Portfolio de proyectos desarrollados
4. **Curriculum**: Información detallada con opción de descarga

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 16+ (recomendado para compatibilidad)
- npm o yarn
- Angular CLI 11

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/teckuro/angular-portafolio.git

# Navegar al directorio
cd angular-portafolio

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

### Despliegue en Vercel

El proyecto está configurado para despliegue automático en Vercel:

1. **Configuración automática**: El archivo `vercel.json` maneja la configuración
2. **Build optimizado**: Usa `ng build --prod` para producción
3. **Routing**: Configurado para SPA (Single Page Application)
4. **Node.js**: Configurado para usar Node.js 16

```bash
# Despliegue manual (si es necesario)
vercel --prod
```

### Comandos Disponibles

```bash
# Servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests unitarios
npm test

# Ejecutar tests e2e
npm run e2e

# Linting
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios core
│   ├── features/
│   │   └── portfolio/        # Módulo principal
│   │       ├── models/       # Interfaces TypeScript
│   │       ├── services/     # Servicios de datos
│   │       └── components/   # Componentes del portfolio
│   └── shared/              # Componentes compartidos
├── assets/                  # Recursos estáticos
└── environments/           # Configuraciones de entorno
```

## 🎨 Características de Diseño

- **Paleta de Colores**: Azul profesional (#3b82f6)
- **Tipografía**: Inter (Google Fonts)
- **Layout**: Flexbox y CSS Grid
- **Responsive**: Mobile-first approach
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

## 📊 SEO, Performance y Analytics

- **Meta Tags**: Descripción, keywords, autor
- **Open Graph**: Optimizado para redes sociales
- **Structured Data**: Schema.org para motores de búsqueda
- **Performance**: Lazy loading, preload de recursos críticos
- **PWA**: Manifest y service worker para funcionalidad offline
- **Analytics**: Tracking de usuarios, navegación y interacciones

## 🧪 Testing

El proyecto incluye tests unitarios completos para:

- Componentes principales
- Servicios de datos
- Funcionalidades de navegación
- Animaciones y interacciones

## 📈 Mejoras Implementadas

### SEO

- ✅ Meta tags completos
- ✅ Open Graph y Twitter Cards
- ✅ Structured Data (Schema.org)
- ✅ Canonical URLs

### Animaciones

- ✅ Transiciones suaves
- ✅ Intersection Observer
- ✅ Efectos de parallax
- ✅ Animaciones de hover

### PWA

- ✅ Web App Manifest
- ✅ Meta tags para instalación
- ⚠️ Service Worker (removido por compatibilidad)

### Testing

- ✅ Tests unitarios completos
- ✅ Cobertura de funcionalidades principales

### Analytics

- ✅ Analytics manual implementado
- ✅ Tracking de navegación entre secciones
- ✅ Tracking de interacciones con proyectos
- ✅ Tracking de descargas de curriculum
- ✅ Tracking de clicks en redes sociales
- ✅ Tracking de profundidad de scroll
- ✅ Tracking de tiempo en página
- ✅ Compatible con Vercel Analytics (script externo)

## 👨‍💻 Autor

**Juan Pablo Huerta Saavedra**

- 📧 Email: teckuro6@gmail.com
- 📱 Teléfono: +56 9 57802607
- 📍 Ubicación: Viña del Mar, Chile
- 🔗 LinkedIn: [jphuerta1](https://www.linkedin.com/in/jphuerta1/)
- 🐙 GitHub: [teckuro](https://github.com/teckuro)

## 📄 Licencia

Este proyecto es de uso personal y educativo. Todos los derechos reservados.

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias y mejoras son bienvenidas a través de issues en GitHub.

---

**Desarrollado con ❤️ usando Angular 11**
