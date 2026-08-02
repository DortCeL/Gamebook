import "dotenv/config";
import { createServer } from "http";
import app from "./app.js";
import { connectDB } from "./config/index.js";
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 4060;

const server = createServer(app);
initSocket(server);

console.log("Connecting to database...");
connectDB()
	.then(() => {
		server.listen(PORT, () => {
			console.log(`🚀 Server listening on http://localhost:${PORT}`);
			console.log(`🔌 Socket.io ready on http://localhost:${PORT}`);
		});
	})
	.catch((err: unknown) => {
		console.error("💥 Failed to initialize server:", err);
	});
