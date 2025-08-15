export interface Project {
	id: number;
	title: string;
	description: string;
	short_description: string;
	image_url: string;
	project_url?: string;
	github_url?: string;
	tech_stack: string[];
	features: string[];
	status: 'active' | 'inactive' | 'draft';
	is_featured: boolean;
	order: number;
}
