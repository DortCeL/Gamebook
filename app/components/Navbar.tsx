import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;

	return (
		<nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Link to="/" className="font-bold text-lg text-green-400">
					Gamebook
				</Link>
				<Link to="/" className="text-sm hover:text-green-300">
					Home
				</Link>
			</div>

			<div className="flex items-center gap-3 text-sm">
				{user ? (
					<>
						<Link
							to={`/profile/${user._id}`}
							className="hover:text-green-300"
						>
							My Profile
						</Link>
						<button
							type="button"
							onClick={() => {
								logout();
								navigate("/");
							}}
							className="border border-gray-600 px-2 py-1 rounded hover:bg-gray-800"
						>
							Logout
						</button>
					</>
				) : (
					<>
						<Link to={loginUrl} className="hover:text-green-300">
							Login
						</Link>
						<Link
							to="/signup"
							className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
						>
							Sign up
						</Link>
					</>
				)}
			</div>
		</nav>
	);
}
