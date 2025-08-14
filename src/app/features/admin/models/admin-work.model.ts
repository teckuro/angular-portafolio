export interface AdminWork {
	id: number;
	company: string;
	position: string;
	description: string;
	start_date: string;
	end_date?: string;
	location: string;
	tech: string[];
	achievements: string[];
	is_current: boolean;
	company_url: string;
	status: 'active' | 'inactive' | 'draft';
	created_at: string;
	updated_at: string;
}

export interface AdminWorkCreate {
	company: string;
	position: string;
	description: string;
	start_date: string;
	end_date?: string;
	location: string;
	tech: string[];
	achievements: string[];
	is_current: boolean;
	company_url: string;
	status: 'active' | 'inactive' | 'draft';
}

export interface AdminWorkUpdate extends Partial<AdminWorkCreate> {
	id: number;
}
