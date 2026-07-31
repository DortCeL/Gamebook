import { Outlet } from "react-router";
import { requireAuth } from "~/auth/guards";

export async function clientLoader({ request }: { request: Request }) {
	requireAuth(request);
	return null;
}

clientLoader.hydrate = true as const; // loader runs in client side but this ensures it also runs client-side

export default function ProtectedLayout() {
	return <Outlet />;
}
