export interface IUser {
	_id: string;
	name: string;
	gamertag: string;
	email: string;
	avatarUrl: string;
	bio: string;
	role: "user" | "admin";
}

export interface IUpdateProfile {
	name?: string;
	gamertag?: string;
	bio?: string;
	avatarUrl?: string;
}

export interface SignupPayload {
	name: string;
	gamertag: string;
	email: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data: T | T[];
}

export interface LoginResponseData {
	token: string;
	user: { id: string; name: string; email: string; role: string };
}

export interface SignupResponseData {
	token: string;
	user: { id: string; name: string; email: string; gamertag: string };
}

export interface IProfile {
	user: IUser;
	stats: {
		totalPosts: number;
	};
}

export interface IAuthor {
	_id: string;
	name?: string;
	gamertag?: string;
	avatarUrl?: string;
}

export interface IPost {
	_id: string;
	commentCount: number;
	author: string | IAuthor;
	type: "screenshot" | "review" | "text";
	game?: string;
	content?: string;
	images?: string[];
	visibility: "public" | "friends";
	createdAt: string;
	updatedAt: string;
}

export interface IComment {
	_id: string;
	post: string;
	author: string | IAuthor;
	content: string;
	parentComment?: string | null;
	createdAt: string;
	updatedAt: string;
	replyCount: number;
}

export interface CreatePostPayload {
	type?: IPost["type"];
	game?: string;
	content?: string;
	images?: string[];
	visibility?: IPost["visibility"];
}

export interface CreateCommentPayload {
	postId: string;
	content: string;
	parentCommentId?: string;
}

export interface ApiListResponse<T> {
	success: boolean;
	count?: number;
	message?: string;
	data: T[];
}

// a friendship between two users
export interface IFriendship {
	_id: string;
	requester: IAuthor;
	recipient: IAuthor;
	status: "pending" | "accepted" | "declined";
	createdAt: string;
	updatedAt: string;
}

// a list of friends for the current user
export interface IFriendEntry {
	_id: string;
	friend: IAuthor;
	since: string;
}

// the status of a friendship between two users
export type FriendshipStatus = "none" | "friends" | "sent" | "incoming";

export interface IMessageStatusEntry {
	user: string | IAuthor;
	deliveredAt?: string;
	readAt?: string;
}

export interface IMessage {
	_id: string;
	conversation: string;
	sender: string | IAuthor;
	content: string;
	deliveredTo: IMessageStatusEntry[];
	readBy: IMessageStatusEntry[];
	createdAt: string;
	updatedAt: string;
}

export interface IConversation {
	_id: string;
	participants: IAuthor[];
	lastMessage?: IMessage | null;
	lastMessageAt?: string;
	createdAt?: string;
	updatedAt?: string;
}
