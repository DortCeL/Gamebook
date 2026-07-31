import { Outlet } from "react-router";
import { requireGuest } from "~/auth/guards";

export async function clientLoader() {
	requireGuest();
	return null;
}

clientLoader.hydrate = true as const; // loader runs in client side but this ensures it also runs client-side

export default function GuestLayout() {
	return <Outlet />;
}
