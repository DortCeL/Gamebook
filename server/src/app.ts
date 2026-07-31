import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();

// Global Middleware
app.use(cors({
	origin: [ "http://localhost:5173", process.env.CLIENT_URL as string], // deployed frontend URL, set in Railway env vars
})); // might give issue on frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core Routes
app.get("/", (_, res) => {
	res.send("Express server running with ES Modules!");
});

app.get("/api/health", (_, res) => {
	res.json({ status: "UP", timestamp: new Date() });
});

// Bind authentication endpoint groups
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comments", commentRoutes);

export default app;
