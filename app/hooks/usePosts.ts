import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreatePostPayload, IPost } from "../../types";
import { postApi } from "~/api";

// get the posts of the current user
export function usePosts(page = 1, limit = 10) {
	return useQuery<IPost[]>({
		queryKey: ["posts", page, limit],
		queryFn: () => postApi.getAll(page, limit),
	});
}

// get the posts of a specific user
export function useUserPosts(authorId: string, page = 1, limit = 20) {
	return useQuery<IPost[]>({
		queryKey: ["posts", "author", authorId, page, limit],
		queryFn: () => postApi.getAll(page, limit, authorId),
		enabled: !!authorId,
	});
}

// get the posts of the current user
export function useMyPosts(page = 1, limit = 10) {
	return useQuery<IPost[]>({
		queryKey: ["myPosts", page, limit],
		queryFn: () => postApi.getMyPosts(page, limit),
	});
}

// get a specific post
export function usePost(id: string) {
	return useQuery<IPost>({
		queryKey: ["post", id],
		queryFn: () => postApi.getById(id),
		enabled: !!id,
	});
}

// create a new post
export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreatePostPayload) => postApi.create(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["myPosts"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}

// delete a post
export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => postApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["myPosts"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}
