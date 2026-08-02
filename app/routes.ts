import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("routes/_guest.tsx", [
		route("/login", "routes/login.tsx"),
		route("/signup", "routes/signup.tsx"),
	]),
	layout("routes/_protected.tsx", [
		index("routes/home.tsx"),
		route("/profile", "routes/profile.tsx"),
		route("/users/:userId", "routes/users.$userId.tsx"),
		route("/posts/new", "routes/posts.new.tsx"),
		route("/posts/mine", "routes/posts.mine.tsx"),
		route("/posts/:id", "routes/posts.$id.tsx"),
		route("/chat", "routes/chat.tsx"),
		route("/chat/:friendId", "routes/chat.$friendId.tsx"),
	]),
] satisfies RouteConfig;
