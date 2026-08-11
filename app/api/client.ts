import axios from "axios";

const TOKEN_KEY = "gamebook_token";

export function getToken() {
	return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
	localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// attach token to every request if we have one
api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
