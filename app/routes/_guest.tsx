import { Outlet, redirect } from "react-router";
import { getToken } from "~/api/client";

export async function clientLoader() {
	if (getToken()) {
		throw redirect("/");
	}
	return null;
}

clientLoader.hydrate = true as const;

export default function GuestLayout() {
	return <Outlet />;
}
