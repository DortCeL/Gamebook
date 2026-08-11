import { io, type Socket } from "socket.io-client";
import { getToken } from "./client";

let socket: Socket | null = null;

export function getSocket() {
	if (!socket) {
		socket = io(import.meta.env.VITE_API_URL as string, {
			auth: { token: getToken() },
			autoConnect: false,
		});
	}
	return socket;
}

export function connectSocket() {
	const s = getSocket();
	if (!s.connected) {
		s.auth = { token: getToken() };
		s.connect();
	}
	return s;
}

export function disconnectSocket() {
	if (socket?.connected) {
		socket.disconnect();
	}
}
