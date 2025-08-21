# Buenas Prácticas para Crear Módulos en Angular

## Comandos de Generación

### 1. Generar el módulo con routing

```bash
ng generate module prueba --routing --path=src/app/features
```

### 2. Generar páginas

```bash
ng generate component prueba/pages/prueba-home --path=src/app/features --skip-tests
ng generate component prueba/pages/prueba-detail --path=src/app/features --skip-tests
```

### 3. Generar componentes compartidos

```bash
ng generate component prueba/shared/components/prueba-card --path=src/app/features --skip-tests
ng generate component prueba/shared/components/prueba-list --path=src/app/features --skip-tests
```

### 4. Generar servicios

```bash
ng generate service prueba/shared/services/prueba --path=src/app/features --skip-tests
```

### 5. Generar guards (opcional)

```bash
ng generate guard prueba/shared/guards/prueba-auth --path=src/app/features --skip-tests
```

### 6. Generar interceptors (opcional)

```bash
ng generate interceptor prueba/shared/interceptors/prueba-auth --path=src/app/features --skip-tests
```

## Archivos a Crear Manualmente

### 7. Modelo de datos

**Archivo:** `src/app/features/prueba/shared/models/prueba.model.ts`

```typescript
export interface Prueba {
	id: number;
	title: string;
	description: string;
	createdAt: Date;
	isActive: boolean;
}

export interface PruebaResponse {
	data: Prueba[];
	total: number;
	page: number;
}
```

### 8. Servicio actualizado

**Archivo:** `src/app/features/prueba/shared/services/prueba.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prueba, PruebaResponse } from '../models/prueba.model';

@Injectable({
	providedIn: 'root'
})
export class PruebaService {
	private apiUrl = '/api/pruebas';

	constructor(private http: HttpClient) {}

	getPruebas(page: number = 1): Observable<PruebaResponse> {
		return this.http.get<PruebaResponse>(`${this.apiUrl}?page=${page}`);
	}

	getPruebaById(id: number): Observable<Prueba> {
		return this.http.get<Prueba>(`${this.apiUrl}/${id}`);
	}

	createPrueba(prueba: Partial<Prueba>): Observable<Prueba> {
		return this.http.post<Prueba>(this.apiUrl, prueba);
	}

	updatePrueba(id: number, prueba: Partial<Prueba>): Observable<Prueba> {
		return this.http.put<Prueba>(`${this.apiUrl}/${id}`, prueba);
	}

	deletePrueba(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
}
```

### 9. Routing del módulo

**Archivo:** `src/app/features/prueba/prueba-routing.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PruebaHomeComponent } from './pages/prueba-home/prueba-home.component';
import { PruebaDetailComponent } from './pages/prueba-detail/prueba-detail.component';

const routes: Routes = [
	{
		path: '',
		component: PruebaHomeComponent
	},
	{
		path: ':id',
		component: PruebaDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PruebaRoutingModule {}
```

### 10. Módulo principal

**Archivo:** `src/app/features/prueba/prueba.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Components
import { PruebaHomeComponent } from './pages/prueba-home/prueba-home.component';
import { PruebaDetailComponent } from './pages/prueba-detail/prueba-detail.component';
import { PruebaCardComponent } from './shared/components/prueba-card/prueba-card.component';
import { PruebaListComponent } from './shared/components/prueba-list/prueba-list.component';

// Services
import { PruebaService } from './shared/services/prueba.service';

// Routes
import { PruebaRoutingModule } from './prueba-routing.module';

@NgModule({
	declarations: [
		PruebaHomeComponent,
		PruebaDetailComponent,
		PruebaCardComponent,
		PruebaListComponent
	],
	imports: [CommonModule, HttpClientModule, PruebaRoutingModule],
	providers: [PruebaService]
})
export class PruebaModule {}
```

### 11. Archivo de índice

**Archivo:** `src/app/features/prueba/index.ts`

```typescript
// Prueba Pages
export { PruebaHomeComponent } from './pages/prueba-home/prueba-home.component';
export { PruebaDetailComponent } from './pages/prueba-detail/prueba-detail.component';

// Prueba Services
export { PruebaService } from './shared/services/prueba.service';

// Prueba Models
export { Prueba, PruebaResponse } from './shared/models/prueba.model';

// Prueba Components
export { PruebaCardComponent } from './shared/components/prueba-card/prueba-card.component';
export { PruebaListComponent } from './shared/components/prueba-list/prueba-list.component';

// Prueba Module
export { PruebaModule } from './prueba.module';
```

### 12. Routing principal

**Archivo:** `src/app/app-routing.module.ts`

```typescript
const routes: Routes = [
	// ... existing routes ...

	// Lazy loading del módulo prueba
	{
		path: 'prueba',
		loadChildren: () =>
			import('./features/prueba/prueba.module').then((m) => m.PruebaModule)
	}

	// ... existing routes ...
];
```

### 13. Índice principal

**Archivo:** `src/app/index.ts`

```typescript
// ... existing exports ...
export * from './features/prueba';
```

## Comandos Finales

### 14. Eliminar archivos de prueba

```bash
rm src/app/features/prueba/shared/services/prueba.service.spec.ts
```

### 15. Verificar compilación

```bash
ng build
```

### 16. Probar el módulo

```bash
ng serve
# Navegar a: http://localhost:4200/prueba
```

## Checklist de Verificación

- [ ] Módulo generado con routing
- [ ] Componentes creados (páginas y compartidos)
- [ ] Servicios generados
- [ ] Modelos de datos creados
- [ ] Rutas configuradas
- [ ] Módulo actualizado con imports
- [ ] Archivo de índice creado
- [ ] Routing principal actualizado
- [ ] Índice principal actualizado
- [ ] Archivos de prueba eliminados
- [ ] Proyecto compila correctamente
- [ ] Módulo accesible via URL

## URLs de Acceso

- **Lista**: `http://localhost:4200/prueba`
- **Detalle**: `http://localhost:4200/prueba/1`

## Estructura Final del Módulo

```
src/app/features/prueba/
├── pages/
│   ├── prueba-home/
│   │   ├── prueba-home.component.ts
│   │   ├── prueba-home.component.html
│   │   └── prueba-home.component.css
│   └── prueba-detail/
│       ├── prueba-detail.component.ts
│       ├── prueba-detail.component.html
│       └── prueba-detail.component.css
├── shared/
│   ├── components/
│   │   ├── prueba-card/
│   │   │   ├── prueba-card.component.ts
│   │   │   ├── prueba-card.component.html
│   │   │   └── prueba-card.component.css
│   │   └── prueba-list/
│   │       ├── prueba-list.component.ts
│   │       ├── prueba-list.component.html
│   │       └── prueba-list.component.css
│   ├── models/
│   │   └── prueba.model.ts
│   └── services/
│       └── prueba.service.ts
├── prueba.module.ts
├── prueba-routing.module.ts
└── index.ts
```

## Mejores Prácticas Implementadas

1. **Separación de Responsabilidades**: Cada módulo tiene una responsabilidad específica
2. **Lazy Loading**: Los feature modules se cargan bajo demanda
3. **Archivos de Índice**: Facilita las importaciones con barrel exports
4. **Estructura Consistente**: Todos los features siguen la misma estructura
5. **Core Module Singleton**: Previene múltiples instancias del core
6. **Eliminación de Archivos de Prueba**: Según preferencias del usuario

## Convenciones de Nomenclatura

- **Módulos**: `feature-name.module.ts`
- **Componentes**: `feature-name.component.ts`
- **Servicios**: `feature-name.service.ts`
- **Guards**: `feature-name.guard.ts`
- **Interceptors**: `feature-name.interceptor.ts`
- **Modelos**: `feature-name.model.ts`

## Importaciones Recomendadas

```typescript
// Importar desde el core
import { LoggerService, AdminAuthGuard } from '@app/core';

// Importar desde shared
import { LoadingSpinnerComponent } from '@app/shared';

// Importar desde features
import { PruebaModule } from '@app/features/prueba';
```

---

**Desarrollado siguiendo las mejores prácticas de Angular**


