import { Outlet, redirect } from "react-router";
import { getToken } from "~/api/client";

export async function clientLoader({ request }: { request: Request }) {
	if (!getToken()) {
		const url = new URL(request.url);
		throw redirect(`/login?redirect=${encodeURIComponent(url.pathname)}`);
	}
	return null;
}

clientLoader.hydrate = true as const;

export default function ProtectedLayout() {
	return <Outlet />;
}
