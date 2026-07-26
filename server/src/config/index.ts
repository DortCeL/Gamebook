import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
	try {
		const conn = await mongoose.connect(
			process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/default_db",
		);
		console.log(
			`🍃 [database]: MongoDB Connected to host: ${conn.connection.host}`,
		);
	} catch (error) {
		console.error(
			`❌ [database]: Connection error: ${(error as Error).message}`,
		);
		process.exit(1); // Stop the server if the database fails to connect
	}
};
