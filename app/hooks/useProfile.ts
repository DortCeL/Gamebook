import { type IProfile, type IUpdateProfile } from "./../../types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "~/api";

export function useProfile() {
	return useQuery<IProfile>({
		queryKey: ["profile"],
		queryFn: () => profileApi.getProfile(),
	});
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: IUpdateProfile) => profileApi.updateProfile(payload),
		onSuccess: () => {
			// Invalidate and refetch the profile query
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}
