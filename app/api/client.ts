import axios from "axios";
import { clearToken, getToken } from "./tokenHelpers";
import { getApiErrorMessage } from "~/utils/apiError";

export const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
	timeout: 10000,
});

api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Axios interceptor that handles 401 Unauthorized errors globally across all API requests
api.interceptors.response.use(
	// If successful, just pass the response through
	(response) => response, 	
	// If there's an error, handle it here
	(error) => {
		if (error.response?.status === 401 && typeof window !== "undefined") {
			const path = window.location.pathname;
			const isAuthPage = path === "/login" || path === "/signup";

			if (!isAuthPage) {
				clearToken();
				window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
			}
		}

		const message = getApiErrorMessage(error);
		return Promise.reject(new Error(message));
	},
);
