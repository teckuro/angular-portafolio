export interface AdminProject {
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
	created_at: string;
	updated_at: string;
}

export interface AdminProjectCreate {
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

export interface AdminProjectUpdate extends Partial<AdminProjectCreate> {
	id: number;
}
