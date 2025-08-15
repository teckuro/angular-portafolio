/**
 * Configuración para Analytics
 */
export const ANALYTICS_CONFIG = {
	// Eventos de navegación
	events: {
		PAGE_VIEW: 'page_view',
		SECTION_NAVIGATION: 'section_navigation',
		PROJECT_VIEW: 'project_view',
		CURRICULUM_DOWNLOAD: 'curriculum_download',
		SOCIAL_MEDIA_CLICK: 'social_media_click',
		CONTACT_ACTION: 'contact_action',
		SCROLL_DEPTH: 'scroll_depth',
		TIME_ON_PAGE: 'time_on_page',
		CURRICULUM_MODAL_OPEN: 'curriculum_modal_open',
		PROJECT_INTERACTION: 'project_interaction'
	},

	// Propiedades de eventos
	properties: {
		// Secciones del portfolio
		sections: {
			ABOUT: 'about',
			WORK: 'work',
			PROJECTS: 'projects'
		},

		// Plataformas de redes sociales
		socialPlatforms: {
			LINKEDIN: 'linkedin',
			GITHUB: 'github'
		},

		// Acciones de proyectos
		projectActions: {
			VIEW: 'view',
			DEMO_CLICK: 'demo_click',
			CODE_CLICK: 'code_click'
		},

		// Métodos de contacto
		contactMethods: {
			EMAIL: 'email',
			PHONE: 'phone',
			LINKEDIN: 'linkedin'
		}
	},

	// Configuración de scroll depth
	scrollDepth: {
		THRESHOLDS: [25, 50, 75, 100]
	},

	// Configuración de tiempo en página
	timeTracking: {
		MINIMUM_TIME: 5 // segundos mínimos para considerar una visita válida
	}
};

/**
 * Tipos de eventos de analytics
 */
export interface AnalyticsEvent {
	name: string;
	properties?: Record<string, any>;
}

/**
 * Configuración de tracking de scroll
 */
export interface ScrollTrackingConfig {
	thresholds: number[];
	debounceTime: number;
}
