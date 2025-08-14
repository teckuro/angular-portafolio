import { Injectable } from '@angular/core';
import { track } from '@vercel/analytics';

@Injectable({
	providedIn: 'root'
})
export class AnalyticsService {
	constructor() {
		// Constructor vacío intencional para servicio de analytics
	}

	/**
	 * Track page view
	 */
	trackPageView(page: string): void {
		track('page_view', { page });
	}

	/**
	 * Track section navigation
	 */
	trackSectionNavigation(section: string): void {
		track('section_navigation', { section });
	}

	/**
	 * Track project view
	 */
	trackProjectView(projectTitle: string): void {
		track('project_view', { project_title: projectTitle });
	}

	/**
	 * Track curriculum download
	 */
	trackCurriculumDownload(): void {
		track('curriculum_download');
	}

	/**
	 * Track social media click
	 */
	trackSocialMediaClick(platform: string): void {
		track('social_media_click', { platform });
	}

	/**
	 * Track contact action
	 */
	trackContactAction(method: string): void {
		track('contact_action', { method });
	}

	/**
	 * Track scroll depth
	 */
	trackScrollDepth(depth: number): void {
		track('scroll_depth', { depth });
	}

	/**
	 * Track time on page
	 */
	trackTimeOnPage(timeInSeconds: number): void {
		track('time_on_page', { time_in_seconds: timeInSeconds });
	}

	/**
	 * Track custom event
	 */
	trackCustomEvent(eventName: string, properties?: Record<string, any>): void {
		track(eventName, properties);
	}
}
