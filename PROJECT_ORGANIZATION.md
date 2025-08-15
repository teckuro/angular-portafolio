# Organización del Proyecto - Mejores Prácticas

## 📁 Estructura del Proyecto

### Estructura General

```
angular-portafolio/
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios singleton, guards, interceptors
│   │   ├── shared/                  # Componentes, pipes, directivas compartidas
│   │   ├── features/                # Módulos de características
│   │   │   ├── admin/              # Panel de administración
│   │   │   └── portfolio/          # Portfolio público
│   │   ├── app.component.*
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── environments/
│   └── styles.css
├── docs/                           # Documentación del proyecto
├── scripts/                        # Scripts de automatización
└── README.md
```

## 🏗️ Arquitectura de Módulos

### Core Module

**Propósito**: Servicios singleton, guards, interceptors y configuraciones globales.

```typescript
// core/core.module.ts
@NgModule({
	imports: [CommonModule],
	providers: [
		AdminAuthInterceptor,
		AdminAuthGuard,
		AdminRoleGuard,
		LoggerService
	]
})
export class CoreModule {}
```

### Shared Module

**Propósito**: Componentes, pipes y directivas reutilizables.

```typescript
// shared/shared.module.ts
@NgModule({
	declarations: [LoadingSpinnerComponent, ConfirmDialogComponent],
	exports: [
		CommonModule,
		ReactiveFormsModule,
		LoadingSpinnerComponent,
		ConfirmDialogComponent
	]
})
export class SharedModule {}
```

### Feature Modules

**Propósito**: Módulos específicos de características con lazy loading.

#### Admin Module

```
admin/
├── components/                     # Componentes compartidos del admin
│   ├── admin-layout/
│   ├── admin-stats-card/
│   ├── admin-breadcrumb/
│   └── admin-components.module.ts
├── admin-works/                   # Gestión de experiencias laborales
│   ├── components/
│   │   ├── admin-works-list/
│   │   └── admin-work-form/
│   ├── services/
│   ├── models/
│   └── admin-works.module.ts
├── admin-projects/                # Gestión de proyectos
├── admin-profile/                 # Perfil del administrador
├── admin-settings/                # Configuraciones del sistema
├── admin-dashboard/               # Dashboard principal
├── admin-login/                   # Autenticación
├── services/                      # Servicios del admin
├── models/                        # Interfaces TypeScript
├── admin-routing.module.ts
└── admin.module.ts
```

## 📋 Convenciones de Nomenclatura

### Archivos y Carpetas

- **PascalCase**: Componentes, servicios, modelos
- **kebab-case**: Archivos y carpetas
- **camelCase**: Variables, métodos, propiedades

### Ejemplos

```
✅ Correcto:
- AdminWorksListComponent
- admin-works-list.component.ts
- admin-works-list.component.html
- admin-works-list.component.css

❌ Incorrecto:
- adminworkslistcomponent
- admin_works_list.component.ts
- AdminWorksList.component.ts
```

### Selectores de Componentes

```typescript
// ✅ Correcto
@Component({
  selector: 'app-admin-works-list'
})

// ❌ Incorrecto
@Component({
  selector: 'admin-works-list'
})
```

## 🔧 Organización de Componentes

### Estructura de un Componente

```
admin-works-list/
├── admin-works-list.component.ts
├── admin-works-list.component.html
├── admin-works-list.component.css
└── admin-works-list.component.spec.ts
```

### Patrón de Componentes

```typescript
@Component({
	selector: 'app-admin-works-list',
	templateUrl: './admin-works-list.component.html',
	styleUrls: ['./admin-works-list.component.css']
})
export class AdminWorksListComponent implements OnInit {
	// 1. Properties
	works: AdminWork[] = [];
	loading = false;
	error: string | null = null;

	// 2. Constructor
	constructor(
		private worksService: AdminWorksService,
		private router: Router
	) {}

	// 3. Lifecycle hooks
	ngOnInit(): void {
		this.loadWorks();
	}

	// 4. Public methods
	loadWorks(): void {
		/* ... */
	}
	createNewWork(): void {
		/* ... */
	}

	// 5. Private methods
	private handleError(error: any): void {
		/* ... */
	}
}
```

## 🎨 Organización de Estilos

### CSS Architecture

```css
/* 1. Layout */
.works-list-container {
	/* ... */
}

/* 2. Components */
.work-card {
	/* ... */
}
.work-header {
	/* ... */
}

/* 3. States */
.loading-container {
	/* ... */
}
.error-container {
	/* ... */
}

/* 4. Utilities */
.btn {
	/* ... */
}
.btn-primary {
	/* ... */
}

/* 5. Responsive */
@media (max-width: 768px) {
	/* ... */
}
```

### Variables CSS

```css
:root {
	/* Colors */
	--primary-color: #667eea;
	--secondary-color: #764ba2;
	--success-color: #28a745;
	--danger-color: #dc3545;

	/* Spacing */
	--spacing-xs: 0.25rem;
	--spacing-sm: 0.5rem;
	--spacing-md: 1rem;
	--spacing-lg: 1.5rem;

	/* Typography */
	--font-size-sm: 0.875rem;
	--font-size-base: 1rem;
	--font-size-lg: 1.125rem;
}
```

## 📦 Organización de Servicios

### Estructura de Servicios

```typescript
@Injectable({
	providedIn: 'root'
})
export class AdminWorksService {
	// 1. Properties
	private readonly API_URL = `${environment.apiUrl}/admin/works`;

	// 2. Constructor
	constructor(private http: HttpClient) {}

	// 3. Public methods (CRUD operations)
	getWorks(): Observable<AdminWork[]> {
		/* ... */
	}
	getWork(id: number): Observable<AdminWork> {
		/* ... */
	}
	createWork(work: Partial<AdminWork>): Observable<AdminWork> {
		/* ... */
	}
	updateWork(id: number, work: Partial<AdminWork>): Observable<AdminWork> {
		/* ... */
	}
	deleteWork(id: number): Observable<void> {
		/* ... */
	}

	// 4. Private methods
	private handleError(error: HttpErrorResponse): Observable<never> {
		/* ... */
	}
}
```

## 🛡️ Organización de Guards

### Auth Guard

```typescript
@Injectable({
	providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
	constructor(
		private authService: AdminAuthService,
		private router: Router
	) {}

	canActivate(): Observable<boolean> {
		return this.authService.currentUser$.pipe(
			take(1),
			map((user) => {
				if (user && this.authService.isAuthenticated()) {
					return true;
				} else {
					this.router.navigate(['/admin/login']);
					return false;
				}
			})
		);
	}
}
```

## 🎯 Organización de Modelos

### Interfaces TypeScript

```typescript
// models/admin-work.model.ts
export interface AdminWork {
	id: number;
	position: string;
	company: string;
	location: string;
	start_date: string;
	end_date?: string;
	description: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateWorkRequest {
	position: string;
	company: string;
	location: string;
	start_date: string;
	end_date?: string;
	description: string;
	is_active: boolean;
}
```

## 🚀 Lazy Loading

### Configuración de Rutas

```typescript
// app-routing.module.ts
const routes: Routes = [
	{
		path: 'admin',
		loadChildren: () =>
			import('./features/admin/admin.module').then((m) => m.AdminModule)
	}
];
```

### Rutas de Módulos

```typescript
// admin-routing.module.ts
const routes: Routes = [
	{
		path: 'works',
		loadChildren: () =>
			import('./admin-works/admin-works.module').then((m) => m.AdminWorksModule)
	}
];
```

## 📝 Documentación

### Comentarios en Código

```typescript
/**
 * Servicio para gestionar las experiencias laborales del administrador
 * Proporciona métodos CRUD para la entidad Work
 */
@Injectable({
	providedIn: 'root'
})
export class AdminWorksService {
	/**
	 * Obtiene todas las experiencias laborales
	 * @returns Observable con la lista de experiencias laborales
	 */
	getWorks(): Observable<AdminWork[]> {
		return this.http.get<AdminWork[]>(this.API_URL);
	}
}
```

### README de Módulos

Cada módulo debe tener su propio README.md explicando:

- Propósito del módulo
- Componentes incluidos
- Servicios disponibles
- Rutas configuradas
- Dependencias

## 🔄 Flujo de Desarrollo

### 1. Crear Nuevo Módulo

```bash
# 1. Crear estructura de carpetas
mkdir -p src/app/features/admin/admin-[feature]/components
mkdir -p src/app/features/admin/admin-[feature]/services
mkdir -p src/app/features/admin/admin-[feature]/models

# 2. Generar componentes
ng generate component features/admin/admin-[feature]/components/admin-[feature]-list
ng generate component features/admin/admin-[feature]/components/admin-[feature]-form

# 3. Generar servicios
ng generate service features/admin/admin-[feature]/services/admin-[feature]

# 4. Crear modelos TypeScript
# Crear archivo models/admin-[feature].model.ts
```

### 2. Configurar Módulo

```typescript
// admin-[feature].module.ts
@NgModule({
	declarations: [AdminFeatureListComponent, AdminFeatureFormComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		AdminComponentsModule
	],
	providers: [AdminFeatureService]
})
export class AdminFeatureModule {}
```

### 3. Configurar Rutas

```typescript
// admin-[feature]-routing.module.ts
const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full'
	},
	{
		path: 'list',
		component: AdminFeatureListComponent,
		data: { breadcrumb: 'Lista' }
	},
	{
		path: 'new',
		component: AdminFeatureFormComponent,
		data: { breadcrumb: 'Nuevo' }
	},
	{
		path: 'edit/:id',
		component: AdminFeatureFormComponent,
		data: { breadcrumb: 'Editar' }
	}
];
```

## ✅ Checklist de Mejores Prácticas

### Estructura

- [ ] Módulos organizados por características
- [ ] Lazy loading implementado
- [ ] Core y Shared modules separados
- [ ] Componentes en carpetas específicas

### Nomenclatura

- [ ] PascalCase para clases
- [ ] kebab-case para archivos
- [ ] camelCase para variables
- [ ] Prefijo 'app-' para selectores

### Componentes

- [ ] Un componente por archivo
- [ ] Interfaces TypeScript definidas
- [ ] Lifecycle hooks implementados
- [ ] Métodos privados/públicos organizados

### Servicios

- [ ] Inyección de dependencias correcta
- [ ] Manejo de errores implementado
- [ ] Tipado TypeScript completo
- [ ] Métodos CRUD organizados

### Estilos

- [ ] CSS modular por componente
- [ ] Variables CSS definidas
- [ ] Responsive design implementado
- [ ] Rem units utilizados

### Documentación

- [ ] README actualizado
- [ ] Comentarios en código crítico
- [ ] Interfaces documentadas
- [ ] Ejemplos de uso incluidos

Esta organización garantiza un código mantenible, escalable y fácil de entender para todo el equipo de desarrollo.
