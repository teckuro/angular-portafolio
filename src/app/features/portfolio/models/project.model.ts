export interface Project {
	id: number;
	title: string;
	description: string;
	date: string;
	tech: string[];
	image: string;
	demoLink?: string;
	codeLink?: string;
}
