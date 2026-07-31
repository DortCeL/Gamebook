import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/index.js";

const PORT = process.env.PORT || 4060;

console.log("Connecting to database...");
connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`🚀 Server listening on http://localhost:${PORT}`);
		});
	})
	.catch((err: unknown) => {
		console.error("💥 Failed to initialize server:", err);
	});
