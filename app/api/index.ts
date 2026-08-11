import type {
	ChatMessage,
	Comment,
	FriendRequest,
	Post,
	ProfileData,
	User,
} from "../../types";
import { api } from "./client";

export const authApi = {
	register(data: {
		name: string;
		gamertag: string;
		email: string;
		password: string;
	}) {
		return api.post<{ token: string; user: User }>("/auth/register", data);
	},
	login(data: { email: string; password: string }) {
		return api.post<{ token: string; user: User }>("/auth/login", data);
	},
};

export const userApi = {
	me() {
		return api.get<User>("/users/me");
	},
	getProfile(id: string) {
		return api.get<ProfileData>(`/users/${id}`);
	},
	update(id: string, data: { name?: string; gamertag?: string; avatar?: string }) {
		return api.put<User>(`/users/${id}`, data);
	},
};

export const postApi = {
	getFeed(page: number) {
		return api.get<{ posts: Post[]; page: number; hasMore: boolean }>(
			"/posts",
			{ params: { page } },
		);
	},
	getByUser(userId: string) {
		return api.get<Post[]>(`/posts/user/${userId}`);
	},
	create(data: { text: string; visibility?: string }) {
		return api.post<Post>("/posts", data);
	},
	update(id: string, data: { text?: string; visibility?: string }) {
		return api.put<Post>(`/posts/${id}`, data);
	},
	remove(id: string) {
		return api.delete(`/posts/${id}`);
	},
};

export const commentApi = {
	getByPost(postId: string) {
		return api.get<Comment[]>(`/posts/${postId}/comments`);
	},
	create(data: { postId: string; text: string; parentId?: string }) {
		return api.post<Comment>("/comments", data);
	},
	remove(id: string) {
		return api.delete(`/comments/${id}`);
	},
};

export const friendRequestApi = {
	send(userId: string) {
		return api.post<FriendRequest>("/friend-requests", { userId });
	},
	incoming() {
		return api.get<FriendRequest[]>("/friend-requests/incoming");
	},
	outgoing() {
		return api.get<FriendRequest[]>("/friend-requests/outgoing");
	},
	accept(id: string) {
		return api.put(`/friend-requests/${id}/accept`);
	},
};

export const messageApi = {
	getWithFriend(friendId: string) {
		return api.get<ChatMessage[]>(`/messages/${friendId}`);
	},
};
