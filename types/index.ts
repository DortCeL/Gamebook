// shared types — keep it simple

export interface User {
	_id: string;
	name: string;
	gamertag: string;
	email?: string;
	avatar?: string;
	friends?: User[];
}

export interface Post {
	_id: string;
	author: User;
	text: string;
	visibility: "public" | "friends";
	createdAt: string;
	updatedAt: string;
}

export interface Comment {
	_id: string;
	post: string;
	author: User;
	text: string;
	parent: string | null;
	createdAt: string;
}

export interface FriendRequest {
	_id: string;
	from: User;
	to: User;
	status: "pending" | "accepted";
	createdAt: string;
}

export interface ChatMessage {
	_id: string;
	sender: User;
	receiver: string;
	text: string;
	createdAt: string;
}

export interface ProfileData {
	user: User;
	postCount: number;
}
