export interface Work {
	id: number;
	company: string;
	position: string;
	description: string;
	startDate: string;
	endDate?: string; // Opcional para trabajos actuales
	location: string;
	tech: string[];
	achievements: string[];
	isCurrent: boolean;
	companyLogo?: string;
	companyUrl?: string;
}
