import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import friendRequestRoutes from "./routes/friendRequest.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();

app.use(
	cors({
		origin: ["http://localhost:5173", process.env.CLIENT_URL as string],
	}),
);
app.use(express.json());

app.get("/api/health", (_, res) => {
	res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/friend-requests", friendRequestRoutes);
app.use("/api/messages", messageRoutes);

export default app;
