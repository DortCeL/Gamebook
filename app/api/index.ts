import {
	type LoginResponseData,
	type LoginPayload,
	type SignupPayload,
	type IUpdateProfile,
	type ApiResponse,
	type SignupResponseData,
	type IProfile,
} from "../../types";
import { api } from "./client";
import { clearToken } from "./tokenHelpers";

// --- Auth API calls ---
export const authApi = {
	async login(payload: LoginPayload) {
		return api
			.post<ApiResponse<LoginResponseData>>("/auth/login", payload)
			.then((res) => res.data.data);
	},
	async signup(payload: SignupPayload) {
		return api
			.post<ApiResponse<SignupResponseData>>("/auth/register", payload)
			.then((res) => res.data.data);
	},

	logout: () => {
		// Remove token from storage
		clearToken();
		// Or if using cookies, clear them
		// document.cookie = "token=; Max-Age=0; path=/";
	},
};

// --- Profile API calls ---
export const profileApi = {
	async getProfile() {
		const response = await api.get<ApiResponse<IProfile>>("/user/me");
		return response.data.data; // full IProfile: { user, stats }
	},

	async updateProfile(payload: IUpdateProfile) {
		const response = await api.patch<ApiResponse<IProfile>>(
			"/user/me",
			payload,
		);
		return response.data.data; // EKHANE EKTU VUL ASE... stats return kore na. only user return kore but oita dia kaj nai i guess so i wouldnt change that lol
	},
};
