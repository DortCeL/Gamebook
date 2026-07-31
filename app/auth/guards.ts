import { redirect } from "react-router";
import { getToken } from "~/api/tokenHelpers";

export const PUBLIC_PATHS = ["/login", "/signup"] as const;

export function isAuthenticated(): boolean {
	return !!getToken();
}

export function getLoginRedirectUrl(request: Request): string {
	const { pathname } = new URL(request.url);

	if (PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number])) {
		return "/login";
	}

	return `/login?redirect=${encodeURIComponent(pathname)}`;
}

/** Redirect to login when there is no token. */
export function requireAuth(request: Request): void {
	if (!isAuthenticated()) {
		throw redirect(getLoginRedirectUrl(request));
	}
}

/** Redirect to home when already logged in (for login/signup pages). */
export function requireGuest(): void {
	if (isAuthenticated()) {
		throw redirect("/");
	}
}
