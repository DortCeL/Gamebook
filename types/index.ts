export interface IUser {
	_id: string;
	name: string;
	gamertag: string;
	email: string;
	avatarUrl?: string;
	bio?: string;
	role: "user" | "admin";
}

export interface IUpdateProfile {
	name?: string;
	gamertag?: string;
	bio?: string;
	avatarUrl?: string;
}

export interface SignupPayload {
	name: string;
	gamertag: string;
	email: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface LoginResponseData {
	token: string;
	user: { id: string; name: string; email: string; role: string };
}

export interface SignupResponseData {
	token: string;
	user: { id: string; name: string; email: string; gamertag: string };
}
