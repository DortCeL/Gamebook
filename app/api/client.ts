import axios from "axios";
import { clearToken, getToken } from "./tokenHelpers";

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
			// typeof window check : Ensures this runs in the browser, not on the server (important for Next.js/SSR)
			const path = window.location.pathname;

			// checks if user is on public page (signup or login)
			const isAuthPage = path === "/login" || path === "/signup";

			// Only redirect if NOT already on login/signup (prevents infinite redirect loops)
			if (!isAuthPage) {
				clearToken();
				window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
			}
		}

		return Promise.reject(error);
	},
);
