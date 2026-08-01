import { type IProfile, type IUpdateProfile } from "./../../types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "~/api";

// get the profile of the current user
export function useProfile() {
	return useQuery<IProfile>({
		queryKey: ["profile"],
		queryFn: () => profileApi.getProfile(),
	});
}

// get the profile of a specific user
export function useUserProfile(userId: string) {
	return useQuery<IProfile>({
		queryKey: ["profile", userId],
		queryFn: () => profileApi.getById(userId),
		enabled: !!userId,
	});
}

// update the profile of the current user
export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			targetId,
			payload,
		}: {
			targetId: string;
			payload: IUpdateProfile;
		}) => profileApi.updateProfile(targetId, payload),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			queryClient.invalidateQueries({
				queryKey: ["profile", variables.targetId],
			});
		},
	});
}
