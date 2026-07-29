import { Link, useNavigate } from "react-router";
import { authApi } from "~/api";
import { useProfile } from "~/hooks/useProfile";

export default function Navbar() {
	const { data: profile, isLoading } = useProfile();
	const navigate = useNavigate();

	const handleLogout = () => {
		authApi.logout();
		navigate("/login");
	};

	return (
		<nav className='bg-linear-to-r from-purple-800 to-pink-800 border-b border-gray-200 shadow-sm'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<Link to='/' className='text-2xl font-bold'>
						<span className='bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text'>
							Gamebook
						</span>
					</Link>

					{/* Right side – name + profile icon  AND SIGNOUT BUTTON*/}
					<div className='flex items-center gap-3'>
						<div className='flex items-center gap-3'>
							{isLoading ? (
								<>
									<div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
									<div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse' />
								</>
							) : (
								<Link
									to='/profile'
									className='flex items-center gap-3 hover:opacity-80 transition'
								>
									<span className='text-sm font-medium text-white max-w-xs truncate'>
										{profile?.user?.gamertag
											? `${profile.user.gamertag}`
											: profile?.user?.name || "User"}
									</span>
									<div className='w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition shrink-0'>
										{profile?.user?.avatarUrl ? (
											<img
												src={profile.user.avatarUrl}
												alt={profile.user.name || "Profile"}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm'>
												{profile?.user?.name?.charAt(0).toUpperCase() || "?"}
											</div>
										)}
									</div>
								</Link>
							)}
						</div>

						{/* Signout button */}
						<button
							className='bg-transparent border-gray-500 border-2 text-gray-300 hover:bg-red-500 hover:border-red-500 duration-300 hover:text-white'
							onClick={handleLogout}
						>
							Log out
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
