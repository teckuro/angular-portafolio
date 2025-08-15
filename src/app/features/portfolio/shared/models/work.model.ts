export interface Work {
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
	company_url?: string;
	status: 'active' | 'inactive' | 'draft';
}
