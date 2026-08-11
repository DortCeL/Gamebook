import jwt from "jsonwebtoken";
import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import { Message } from "../models/Message.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

let io: Server | null = null;

// room name for two users: sort ids alphabetically
function chatRoom(userA: string, userB: string) {
	const [a, b] = [userA, userB].sort();
	return `room_${a}_${b}`;
}

export function initSocket(server: HttpServer) {
	io = new Server(server, {
		cors: {
			origin: ["http://localhost:5173", process.env.CLIENT_URL as string],
			credentials: true,
		},
	});

	// verify JWT from handshake
	io.use((socket: Socket, next: (err?: Error) => void) => {
		try {
			const token =
				(socket.handshake.auth?.token as string) ||
				(socket.handshake.query?.token as string);

			if (!token) return next(new Error("Unauthorized"));

			const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
			socket.data.userId = decoded._id;
			next();
		} catch {
			next(new Error("Unauthorized"));
		}
	});

	io.on("connection", (socket: Socket) => {
		const userId = socket.data.userId as string;

		// personal room so we can target this user
		socket.join(`user_${userId}`);

		// client wants to open chat with a friend
		socket.on("join_chat", ({ friendId }: { friendId: string }) => {
			const room = chatRoom(userId, friendId);
			socket.join(room);
		});

		// client sends a message
		socket.on(
			"send_message",
			async ({
				receiverId,
				text,
			}: {
				receiverId: string;
				text: string;
			}) => {
				if (!text?.trim()) return;

				// save to database
				const message = await Message.create({
					sender: userId,
					receiver: receiverId,
					text: text.trim(),
				});

				await message.populate("sender", "name gamertag avatar");

				const room = chatRoom(userId, receiverId);
				const payload = {
					_id: message._id,
					sender: message.sender,
					receiver: receiverId,
					text: message.text,
					createdAt: message.createdAt,
				};

				// both people in the chat room get the message
				io!.to(room).emit("receive_message", payload);
			},
		);
	});

	return io;
}
