import axios from "axios";
import { getToken } from "./tokenHelpers";

export const api = axios.create({
	baseURL: "http://localhost:4060/api",
	timeout: 10000,
});

// attach token to every request
api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
