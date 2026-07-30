import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentPayload, IComment } from "../../types";
import { commentApi } from "~/api";

export function useComments(postId: string) {
	return useQuery<IComment[]>({
		queryKey: ["comments", postId],
		queryFn: () => commentApi.getByPost(postId),
		enabled: !!postId,
	});
}

export function useReplies(commentId: string, enabled = true) {
	return useQuery<IComment[]>({
		queryKey: ["replies", commentId],
		queryFn: () => commentApi.getReplies(commentId),
		enabled: !!commentId && enabled,
	});
}

export function useCreateComment(postId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateCommentPayload) =>
			commentApi.create(payload),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["comments", postId] });
			if (variables.parentCommentId) {
				queryClient.invalidateQueries({
					queryKey: ["replies", variables.parentCommentId],
				});
			}
		},
	});
}

export function useDeleteComment(postId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => commentApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", postId] });
			queryClient.invalidateQueries({ queryKey: ["replies"] });
		},
	});
}
