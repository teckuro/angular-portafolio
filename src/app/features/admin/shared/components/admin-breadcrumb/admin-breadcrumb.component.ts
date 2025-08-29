import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface BreadcrumbItem {
	label: string;
	url?: string;
	active?: boolean;
}

@Component({
	selector: 'app-admin-breadcrumb',
	templateUrl: './admin-breadcrumb.component.html',
	styleUrls: ['./admin-breadcrumb.component.css']
})
export class AdminBreadcrumbComponent implements OnInit, OnDestroy {
	breadcrumbs: BreadcrumbItem[] = [];
	private destroy$ = new Subject<void>();

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		// Inicializar breadcrumbs al cargar el componente
		this.updateBreadcrumbs();

		// Suscribirse a eventos de navegación
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {
				this.updateBreadcrumbs();
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private updateBreadcrumbs(): void {
		const currentUrl = this.router.url;
		this.breadcrumbs = this.buildBreadcrumbsFromUrl(currentUrl);
	}

	private buildBreadcrumbsFromUrl(url: string): BreadcrumbItem[] {
		const breadcrumbs: BreadcrumbItem[] = [];
		const segments = url.split('/').filter((segment) => segment !== '');

		// Siempre agregar "Inicio" como primer breadcrumb
		breadcrumbs.push({
			label: 'Inicio',
			url: '/admin/dashboard',
			active: false
		});

		let currentPath = '';

		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];

			// Saltar 'admin' ya que es el prefijo
			if (segment === 'admin') {
				continue;
			}

			currentPath += `/${segment}`;

			// Obtener el label del breadcrumb basado en el segmento
			const label = this.getBreadcrumbLabel(segment);

			// Si es el último segmento, marcar como activo
			const isActive = i === segments.length - 1;

			breadcrumbs.push({
				label: label,
				url: isActive ? undefined : currentPath,
				active: isActive
			});
		}

		return breadcrumbs;
	}

	getBreadcrumbLabel(route: string): string {
		const routeMap: { [key: string]: string } = {
			dashboard: 'Dashboard',
			projects: 'Proyectos',
			works: 'Experiencia Laboral',
			list: 'Lista',
			new: 'Nuevo',
			edit: 'Editar',
			profile: 'Mi Perfil',
			settings: 'Configuración'
		};

		return routeMap[route] || route;
	}
}
