import { useState } from "react";
import { useProfile, useUpdateProfile } from "~/hooks/useProfile";
import EditProfileModal from "~/components/EditProfileModal";

export default function ProfilePage() {
	const {
		data: profile,
		isLoading: fetchingProfile,
		error: profileFetchError,
	} = useProfile();
	const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// Loading / error states (same as before)
	if (fetchingProfile) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto' />
					<p className='mt-4 text-gray-600'>Loading profile...</p>
				</div>
			</div>
		);
	}

	if (profileFetchError) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
				<div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center'>
					<p className='font-medium'>Failed to load profile</p>
					<p className='text-sm mt-1'>{(profileFetchError as Error).message}</p>
				</div>
			</div>
		);
	}

	if (!profile || !profile.user) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
				<p className='text-gray-500'>No user data available</p>
			</div>
		);
	}

	const { user, stats } = profile;

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4'>
			<div className='max-w-3xl mx-auto'>
				{/* Profile Card */}
				<div className='bg-white rounded-xl shadow-lg overflow-hidden'>
					<div className='h-32 bg-gradient-to-r from-blue-500 to-purple-600' />

					<div className='px-6 pb-6 -mt-12'>
						<div className='flex flex-col sm:flex-row items-center sm:items-end gap-4'>
							<div className='w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md shrink-0'>
								{user.avatarUrl ? (
									<img
										src={user.avatarUrl}
										alt={user.name}
										className='w-full h-full object-cover'
									/>
								) : (
									<div className='w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold'>
										{user.name?.charAt(0).toUpperCase() || "?"}
									</div>
								)}
							</div>
							<div className='flex-1 text-center sm:text-left'>
								<h1 className='text-2xl font-bold text-gray-900'>
									{user.name}
								</h1>
								<p className='text-gray-600'>@{user.gamertag}</p>
								<div className='flex flex-wrap justify-center sm:justify-start gap-2 mt-1'>
									<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
										{user.role}
									</span>
									{user.bio && (
										<span className='text-sm text-gray-500'>{user.bio}</span>
									)}
								</div>
							</div>
							<button
								onClick={() => setIsEditModalOpen(true)}
								className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition'
							>
								Edit Profile
							</button>
						</div>
					</div>

					<div className='border-t border-gray-100 px-6 py-4'>
						<div className='flex flex-wrap items-center justify-between gap-4'>
							<div className='flex gap-6'>
								<div>
									<p className='text-sm text-gray-500'>Total Posts</p>
									<p className='text-xl font-semibold text-gray-900'>
										{stats?.totalPosts ?? 0}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-500'>Email</p>
									<p className='text-sm text-gray-700'>{user.email}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='mt-6 text-center'>
					<a href='/' className='text-sm text-gray-500 hover:text-gray-700'>
						← Back to home
					</a>
				</div>
			</div>

			{/* Edit Modal */}
			<EditProfileModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				profile={profile}
				onUpdate={updateProfile}
				isUpdating={isUpdating}
			/>
		</div>
	);
}
