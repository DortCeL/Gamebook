import Navbar from "~/components/Navbar";
import UserProfileView from "~/components/UserProfileView";
import { useProfile, useUpdateProfile } from "~/hooks/useProfile";
import type { IUpdateProfile } from "../../types";

// a page to display the profile of the current user
export default function ProfilePage() {
	const { data: profile, isLoading, error } = useProfile();
	const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

	// if the user updates their profile, update the profile
	const handleUpdateProfile = (
		variables: { targetId: string; payload: IUpdateProfile },
		options?: { onSuccess?: () => void },
	) => {
		updateProfile(variables, {
			onSuccess: () => options?.onSuccess?.(),
		});
	};

	// if the profile is loading, show a loading spinner
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
					<p className="mt-4 text-gray-600">Loading profile...</p>
				</div>
			</div>
		);
	}

	// if the profile fails to load, show a message
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
					<p className="font-medium">Failed to load profile</p>
					<p className="text-sm mt-1">{(error as Error).message}</p>
				</div>
			</div>
		);
	}

	// if the user is not found, show a message
	if (!profile?.user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<p className="text-gray-500">No user data available</p>
			</div>
		);
	}

	// display the profile of the current user
	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gray-50 py-12 px-4">
				<UserProfileView
					profile={profile}
					isOwnProfile
					onUpdateProfile={handleUpdateProfile}
					isUpdating={isUpdating}
				/>
			</div>
		</>
	);
}
