import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FriendshipStatus, IFriendEntry, IFriendship } from "../../types";
import { friendsApi } from "~/api";

const friendsKeys = {
	all: ["friends"] as const,
	incoming: ["friends", "incoming"] as const,
	sent: ["friends", "sent"] as const,
};

export function useFriends() {
	return useQuery<IFriendEntry[]>({
		queryKey: friendsKeys.all,
		queryFn: () => friendsApi.list(),
	});
}

export function useIncomingFriendRequests() {
	return useQuery<IFriendship[]>({
		queryKey: friendsKeys.incoming,
		queryFn: () => friendsApi.getIncomingRequests(),
	});
}

export function useSentFriendRequests() {
	return useQuery<IFriendship[]>({
		queryKey: friendsKeys.sent,
		queryFn: () => friendsApi.getSentRequests(),
	});
}

function invalidateFriends(queryClient: ReturnType<typeof useQueryClient>) {
	queryClient.invalidateQueries({ queryKey: friendsKeys.all });
	queryClient.invalidateQueries({ queryKey: friendsKeys.incoming });
	queryClient.invalidateQueries({ queryKey: friendsKeys.sent });
}

export function useSendFriendRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) => friendsApi.sendRequest(userId),
		onSuccess: () => invalidateFriends(queryClient),
	});
}

export function useAcceptFriendRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (requestId: string) => friendsApi.acceptRequest(requestId),
		onSuccess: () => invalidateFriends(queryClient),
	});
}

export function useDeclineFriendRequest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (requestId: string) => friendsApi.declineRequest(requestId),
		onSuccess: () => invalidateFriends(queryClient),
	});
}

export function useRemoveFriendship() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (friendshipId: string) => friendsApi.remove(friendshipId),
		onSuccess: () => invalidateFriends(queryClient),
	});
}


// check if the user is a friend of the Target User, has an incoming request, or has a sent request
export function useFriendshipStatus(targetUserId: string) {
	const { data: friends } = useFriends();
	const { data: incoming } = useIncomingFriendRequests();
	const { data: sent } = useSentFriendRequests();
	
	return useMemo(() => {
		// search the user's friends list for the target user
		const friendEntry = friends?.find(
			(entry) => entry.friend._id === targetUserId,
		);
		// if the user is a friend, return the friendship status and the friendship id
		if (friendEntry) {
			return {
				status: "friends" as FriendshipStatus,
				friendshipId: friendEntry._id,
			};
		}

		// search the user's incoming requests list for the target user
		const incomingRequest = incoming?.find(
			(request) => request.requester._id === targetUserId,
		);
		// if the user has an incoming request, return the friendship status and the friendship id
		if (incomingRequest) {
			return {
				status: "incoming" as FriendshipStatus,
				friendshipId: incomingRequest._id,
			};
		}

		// search the user's sent requests list for the target user
		const sentRequest = sent?.find(
			(request) => request.recipient._id === targetUserId,
		);
		// if the user has a sent request, return the friendship status and the friendship id
		if (sentRequest) {
			return {
				status: "sent" as FriendshipStatus,
				friendshipId: sentRequest._id,
			};
		}

		// if the user is not a friend, has not sent a request, and has not received a request, return the friendship status and the friendship id
		return { status: "none" as FriendshipStatus, friendshipId: null };
	}, [friends, incoming, sent, targetUserId]);
}
