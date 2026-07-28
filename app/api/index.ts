import {
	type LoginResponseData,
	type LoginPayload,
	type SignupPayload,
	type IUpdateProfile,
	type ApiResponse,
	type SignupResponseData,
} from "../../types";
import { api } from "./client";

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
};

// // --- Profile API calls ---
// export const profileApi = {
// 	getProfile() {
// 		api.get("/me").then((res) => res.data);
// 	},
// 	updateProfile(data: IUpdateProfile) {
// 		api.patch("/profile", data).then((res) => res.data);
// 	},
// };
