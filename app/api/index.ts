import type {
	LoginResponseData,
	LoginPayload,
	SignupPayload,
	IUpdateProfile,
	ApiResponse,
	ApiListResponse,
	SignupResponseData,
	IProfile,
	IPost,
	IComment,
	CreatePostPayload,
	CreateCommentPayload,
} from "../../types";
import { api } from "./client";
import { clearToken } from "./tokenHelpers";

// --- Auth API calls ---
export const authApi = {
	async login(payload: LoginPayload) {
		return api
			.post<ApiResponse<LoginResponseData>>("/auth/login", payload)
			.then((res) => res.data.data as LoginResponseData);
	},
	async signup(payload: SignupPayload) {
		return api
			.post<ApiResponse<SignupResponseData>>("/auth/register", payload)
			.then((res) => res.data.data as SignupResponseData);
	},

	logout: () => {
		clearToken();
	},
};

// --- Profile API calls ---
export const profileApi = {
	async getProfile() {
		const response = await api.get<ApiResponse<IProfile>>("/user/me");
		return response.data.data as IProfile;
	},

	async updateProfile(targetId: string, payload: IUpdateProfile) {
		const response = await api.patch<ApiResponse<IProfile>>(
			`/user/${targetId}`,
			payload,
		);
		return response.data.data as IProfile;
	},
};

// --- Post API calls ---
export const postApi = {
	async getAll(page = 1, limit = 10, authorId?: string) {
		const response = await api.get<ApiListResponse<IPost>>("/post", {
			params: { page, limit, ...(authorId ? { authorId } : {}) },
		});
		return response.data.data;
	},

	async getMyPosts(page = 1, limit = 10) {
		const response = await api.get<ApiListResponse<IPost>>("/post/myposts", {
			params: { page, limit },
		});
		return response.data.data;
	},

	async getById(id: string) {
		const response = await api.get<ApiResponse<IPost>>(`/post/${id}`);
		return response.data.data as IPost;
	},

	async create(payload: CreatePostPayload) {
		const response = await api.post<ApiResponse<IPost>>("/post", payload);
		return response.data.data as IPost;
	},

	async update(id: string, payload: Partial<CreatePostPayload>) {
		const response = await api.patch<ApiResponse<IPost>>(
			`/post/${id}`,
			payload,
		);
		return response.data.data as IPost;
	},

	async delete(id: string) {
		await api.delete(`/post/${id}`);
	},
};

// --- Comment API calls ---
export const commentApi = {
	async getByPost(postId: string, page = 1, limit = 20) {
		const response = await api.get<ApiListResponse<IComment>>(
			`/comments/post/${postId}`,
			{ params: { page, limit } },
		);
		return response.data.data;
	},

	async getReplies(commentId: string, page = 1, limit = 20) {
		const response = await api.get<ApiListResponse<IComment>>(
			`/comments/${commentId}/replies`,
			{ params: { page, limit } },
		);
		return response.data.data;
	},

	async create(payload: CreateCommentPayload) {
		const response = await api.post<ApiResponse<IComment>>(
			"/comments",
			payload,
		);
		return response.data.data as IComment;
	},

	async delete(id: string) {
		await api.delete(`/comments/${id}`);
	},
};
