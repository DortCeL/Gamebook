import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/login", "routes/login.tsx"),
	route("/signup", "routes/signup.tsx"),
	route("/profile", "routes/profile.tsx"),
	route("/posts/new", "routes/posts.new.tsx"),
	route("/posts/mine", "routes/posts.mine.tsx"),
	route("/posts/:id", "routes/posts.$id.tsx"),
] satisfies RouteConfig;
