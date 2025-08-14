export interface AdminUser {
	id: number;
	name: string;
	email: string;
	role: 'admin' | 'super_admin';
	created_at: string;
	updated_at: string;
}

export interface AdminLoginRequest {
	email: string;
	password: string;
}

export interface AdminLoginResponse {
	user: AdminUser;
	token: string;
	expires_at: string;
}

export interface AdminRegisterRequest {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
}
