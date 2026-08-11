import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("routes/_guest.tsx", [
		route("/login", "routes/login.tsx"),
		route("/signup", "routes/signup.tsx"),
	]),

	layout("routes/_public.tsx", [
		index("routes/home.tsx"),
		route("/profile/:userId", "routes/profile.$userId.tsx"),
	]),
	
	layout("routes/_protected.tsx", [
		route("/chat/:friendId", "routes/chat.$friendId.tsx"),
		route("/chat", "routes/chatPage.tsx"),
	]),
] satisfies RouteConfig;
