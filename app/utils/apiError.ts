import { isAxiosError } from "axios";

type ApiErrorBody = {
	message?: string;
	success?: boolean;
};

export function getApiErrorMessage(
	error: unknown,
	fallback = "Something went wrong. Please try again.",
): string {
	if (isAxiosError<ApiErrorBody>(error)) {
		const serverMessage = error.response?.data?.message;
		if (typeof serverMessage === "string" && serverMessage.trim()) {
			return serverMessage;
		}

		if (error.code === "ECONNABORTED") {
			return "Request timed out. Please try again.";
		}

		if (!error.response) {
			return "Unable to reach the server. Check your connection and try again.";
		}

		const status = error.response.status;
		if (status === 404) {
			return "The requested resource was not found.";
		}
		if (status === 403) {
			return "You do not have permission to perform this action.";
		}
		if (status === 401) {
			return "Invalid or expired session. Please sign in again.";
		}
		if (status >= 500) {
			return "Server error. Please try again later.";
		}

		return fallback;
	}

	if (error instanceof Error && error.message.trim()) {
		return error.message;
	}

	return fallback;
}
