export interface AdminProject {
	id: number;
	title: string;
	description: string;
	date: string;
	tech: string[];
	image: string;
	demo_link: string;
	code_link: string;
	status: 'active' | 'inactive' | 'draft';
	featured: boolean;
	created_at: string;
	updated_at: string;
}

export interface AdminProjectCreate {
	title: string;
	description: string;
	date: string;
	tech: string[];
	image: string;
	demo_link: string;
	code_link: string;
	status: 'active' | 'inactive' | 'draft';
	featured: boolean;
}

export interface AdminProjectUpdate extends Partial<AdminProjectCreate> {
	id: number;
}
