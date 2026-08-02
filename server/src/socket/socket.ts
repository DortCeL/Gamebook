import jwt from "jsonwebtoken";
import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import type { CustomJwtPayload } from "../types/express.d.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

// Socket.io server instance
let io: Server | null = null;

// Map to store online users and their socket IDs
const onlineUsers = new Map<string, Set<string>>();

// Add a user to the online users map
function addOnlineUser(userId: string, socketId: string) {
    // If the user is not in the map, create a new set for them
	if (!onlineUsers.has(userId)) {
		onlineUsers.set(userId, new Set());
	}
	// Add the socket ID to the user's set
	onlineUsers.get(userId)!.add(socketId);
}

// Remove a user from the online users map
function removeOnlineUser(userId: string, socketId: string) {
	// Get the user's set of socket IDs
	const sockets = onlineUsers.get(userId);
	// If the user is not in the map, return
	if (!sockets) return;

	sockets.delete(socketId);
	if (sockets.size === 0) {
		onlineUsers.delete(userId);
	}
}

// Initialize the socket.io server
export function initSocket(server: HttpServer) {
	// Create a new socket.io server instance
	io = new Server(server, {
		cors: {
			origin: ["http://localhost:5173", process.env.CLIENT_URL as string],
			credentials: true,
		},
	});

	// Use a middleware to authenticate the user
	io.use((socket, next) => {
		try {
			// Get the token from the handshake
			const token =
				(socket.handshake.auth?.token as string | undefined) ||
				(socket.handshake.query?.token as string | undefined);

			if (!token) {
				return next(new Error("Unauthorized"));
			}

			const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
			socket.data.userId = decoded._id;
			next();
		} catch {
			next(new Error("Unauthorized"));
		}
	});

	io.on("connection", (socket: Socket) => {
		const userId = socket.data.userId as string;

		socket.join(`user:${userId}`);
		addOnlineUser(userId, socket.id);

		socket.emit("connected", { userId });

		socket.on("disconnect", () => {
			removeOnlineUser(userId, socket.id);
		});
	});

	return io;
}

export function getIO() {
	if (!io) {
		throw new Error("Socket.io has not been initialized.");
	}
	return io;
}

export function isUserOnline(userId: string) {
	return (onlineUsers.get(userId)?.size ?? 0) > 0;
}

export function sendToUser(userId: string, event: string, data: unknown) {
	if (!io) return;
	io.to(`user:${userId}`).emit(event, data);
}

/** Notify both users in a 1-on-1 chat */
export function notifyChatPartners(
	userA: string,
	userB: string,
	event: string,
	data: unknown,
) {
	sendToUser(userA, event, data);
	sendToUser(userB, event, data);
}

/** Socket event names used by the messaging feature */
export const SOCKET_EVENTS = {
	CONNECTED: "connected",
	MESSAGE_NEW: "message:new",
	MESSAGE_DELIVERED: "message:delivered",
	MESSAGE_READ: "message:read",
} as const;
