import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

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
export class AdminBreadcrumbComponent implements OnInit {
	breadcrumbs: BreadcrumbItem[] = [];

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe(() => {
				this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
			});
	}

	private createBreadcrumbs(
		route: ActivatedRoute,
		url = '',
		breadcrumbs: BreadcrumbItem[] = []
	): BreadcrumbItem[] {
		const children: ActivatedRoute[] = route.children;

		if (children.length === 0) {
			return breadcrumbs;
		}

		for (const child of children) {
			const routeURL: string = child.snapshot.url
				.map((segment) => segment.path)
				.join('/');
			if (routeURL !== '') {
				url += `/${routeURL}`;
			}

			const label = child.snapshot.data['breadcrumb'];
			if (label) {
				breadcrumbs.push({
					label: label,
					url: url,
					active: child.snapshot.url.length === 0
				});
			}

			return this.createBreadcrumbs(child, url, breadcrumbs);
		}

		return breadcrumbs;
	}

	getBreadcrumbLabel(route: string): string {
		const routeMap: { [key: string]: string } = {
			dashboard: 'Dashboard',
			projects: 'Proyectos',
			works: 'Experiencia Laboral',
			profile: 'Mi Perfil',
			settings: 'Configuración',
			new: 'Nuevo',
			edit: 'Editar'
		};

		return routeMap[route] || route;
	}
}
