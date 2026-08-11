import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "~/components/Navbar";
import { messageApi, userApi } from "~/api";
import { connectSocket } from "~/api/socket";
import { useAuth } from "~/context/AuthContext";
import type { ChatMessage, User } from "../../types";
import { timeAgo } from "~/utils/timeAgo";

export default function ChatPage() {
	const { friendId } = useParams();
	const { user } = useAuth();
	const [friend, setFriend] = useState<User | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [text, setText] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!friendId) return;

		userApi.getProfile(friendId).then((res) => setFriend(res.data.user));
		messageApi.getWithFriend(friendId).then((res) => setMessages(res.data));

		const socket = connectSocket();
		socket.emit("join_chat", { friendId });

		socket.on("receive_message", (msg: ChatMessage) => {
			setMessages((prev) => {
				if (prev.some((m) => m._id === msg._id)) return prev;
				return [...prev, msg];
			});
		});

		return () => {
			socket.off("receive_message");
		};
	}, [friendId]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	function sendMessage(e: React.FormEvent) {
		e.preventDefault();
		if (!text.trim() || !friendId) return;

		const socket = connectSocket();
		socket.emit("send_message", { receiverId: friendId, text: text.trim() });
		setText("");
	}

	return (
		<div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
			<Navbar />

			<div className="max-w-2xl mx-auto w-full flex-1 flex flex-col px-4 py-4">
				<Link
					to={`/profile/${friendId}`}
					className="text-sm text-gray-400 mb-2 hover:text-green-400"
				>
					← Back to profile
				</Link>

				<div className="bg-gray-800 border border-gray-700 rounded-t-lg px-4 py-3">
					<p className="font-semibold">{friend?.name || "..."}</p>
					<p className="text-xs text-gray-400">@{friend?.gamertag}</p>
				</div>

				<div className="flex-1 bg-gray-900 border-x border-gray-700 overflow-y-auto p-4 space-y-3 min-h-[400px]">
					{messages.map((msg) => {
						const senderId =
							typeof msg.sender === "object" ? msg.sender._id : msg.sender;
						const isMe = senderId === user?._id;

						return (
							<div
								key={msg._id}
								className={`max-w-[80%] ${isMe ? "ml-auto text-right" : ""}`}
							>
								<p
									className={`inline-block px-3 py-2 rounded-lg text-sm ${
										isMe ? "bg-green-700" : "bg-gray-700"
									}`}
								>
									{msg.text}
								</p>
								<p className="text-xs text-gray-500 mt-0.5">
									{timeAgo(msg.createdAt)}
								</p>
							</div>
						);
					})}
					<div ref={bottomRef} />
				</div>

				<form
					onSubmit={sendMessage}
					className="flex gap-2 bg-gray-800 border border-gray-700 rounded-b-lg p-3"
				>
					<input
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder={`Message ${friend?.name || "friend"}`}
						className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm"
					/>
					<button
						type="submit"
						className="bg-green-600 px-4 py-2 rounded text-sm hover:bg-green-500"
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
}
