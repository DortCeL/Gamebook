import { useParams } from "react-router";
import Navbar from "~/components/Navbar";
import ChatBox from "~/components/ChatBox";

// still works if someone opens /chat/:friendId (e.g. Message from profile)
export default function ChatWithFriendPage() {
	const { friendId } = useParams();

	if (!friendId) {
		return <p className="p-8 text-gray-400">No friend selected.</p>;
	}

	return (
		<>
			<Navbar />
			<div className="max-w-2xl mx-auto px-4 py-4">
				<div className="bg-gray-800 border border-gray-700 rounded-lg text-white overflow-hidden">
					<ChatBox friendId={friendId} />
				</div>
			</div>
		</>
	);
}
