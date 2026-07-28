import type { Route } from "./+types/home";
import SignupPage from "./signup";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Gamebook" },
		{ name: "description", content: "Welcome to gamebook" },
	];
}

export default function Home() {
	return <div>WELCOME</div>;
}
