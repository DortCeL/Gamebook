import { useProfile /*useUpdateProfile*/ } from "../hooks/useAuth";

export default function ProfilePage() {
	const isLoggedIn = !!localStorage.getItem("token");
	const { data: profile, isLoading, error } = useProfile(isLoggedIn);
	// const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

	if (!isLoggedIn) return <p>Please log in</p>;
	if (isLoading) return <p>Loading profile...</p>;
	if (error) return <p>Error loading profile</p>;

	const handleUpdateName = () => {
		// updateProfile({ name: "New Name" });
	};

	return (
		<div>
			<h1>Welcome, {profile.name}</h1>
			<p>Email: {profile.email}</p>
			{/* <button onClick={handleUpdateName} disabled={isUpdating}>
				{isUpdating ? "Updating..." : "Update Name"}
			</button> */}
		</div>
	);
}
