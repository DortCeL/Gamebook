import { useParams } from "react-router";
import Navbar from "~/components/Navbar";
import ProfilePage from "~/components/ProfilePage";

export default function ProfileRoute() {
	const { userId } = useParams();
	if (!userId) return <p className="p-8 text-gray-400">Invalid profile.</p>;

	return (
		<div className="min-h-screen bg-gray-950 text-gray-100">
			<Navbar />
			<div className="px-4 py-6">
				<ProfilePage profileUserId={userId} />
			</div>
		</div>
	);
}
