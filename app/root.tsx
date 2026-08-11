import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { AuthProvider } from "~/context/AuthContext";

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-gray-950">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<Outlet />
		</AuthProvider>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Something went wrong";

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "Page not found" : error.statusText;
	} else if (error instanceof Error) {
		message = error.message;
	}

	return (
		<main className="p-8 text-gray-100">
			<h1 className="text-xl font-bold text-red-400">Error</h1>
			<p className="mt-2">{message}</p>
		</main>
	);
}
