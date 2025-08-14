import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AnalyticsService {
	// Constructor vacío intencional para servicio de analytics

	/**
	 * Track page view
	 */
	trackPageView(page: string): void {
		this.track('page_view', { page });
	}

	/**
	 * Track section navigation
	 */
	trackSectionNavigation(section: string): void {
		this.track('section_navigation', { section });
	}

	/**
	 * Track project view
	 */
	trackProjectView(projectTitle: string): void {
		this.track('project_view', { project_title: projectTitle });
	}

	/**
	 * Track curriculum download
	 */
	trackCurriculumDownload(): void {
		this.track('curriculum_download');
	}

	/**
	 * Track social media click
	 */
	trackSocialMediaClick(platform: string): void {
		this.track('social_media_click', { platform });
	}

	/**
	 * Track contact action
	 */
	trackContactAction(method: string): void {
		this.track('contact_action', { method });
	}

	/**
	 * Track scroll depth
	 */
	trackScrollDepth(depth: number): void {
		this.track('scroll_depth', { depth });
	}

	/**
	 * Track time on page
	 */
	trackTimeOnPage(timeInSeconds: number): void {
		this.track('time_on_page', { time_in_seconds: timeInSeconds });
	}

	/**
	 * Track custom event
	 */
	trackCustomEvent(eventName: string, properties?: Record<string, any>): void {
		this.track(eventName, properties);
	}

	/**
	 * Manual tracking implementation
	 */
	private track(eventName: string, properties?: Record<string, any>): void {
		// Log to console for development
		console.log('Analytics Event:', eventName, properties);

		// Send to Vercel Analytics if available
		if (typeof window !== 'undefined' && (window as any).va) {
			(window as any).va(eventName, properties);
		}

		// Send to Google Analytics if available
		if (typeof window !== 'undefined' && (window as any).gtag) {
			(window as any).gtag('event', eventName, properties);
		}

		// Send to any other analytics service
		this.sendToAnalytics(eventName, properties);
	}

	/**
	 * Send to analytics services
	 */
	private sendToAnalytics(
		eventName: string,
		properties?: Record<string, any>
	): void {
		// Vercel Analytics
		if (typeof window !== 'undefined') {
			// Try to send to Vercel Analytics
			try {
				const data = {
					event: eventName,
					properties: properties || {},
					timestamp: Date.now(),
					url: window.location.href,
					userAgent: navigator.userAgent
				};

				// Send to Vercel Analytics endpoint
				fetch('/api/analytics', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				}).catch(() => {
					// Silently fail if endpoint doesn't exist
				});
			} catch (error) {
				// Silently fail if analytics fails
			}
		}
	}
}
