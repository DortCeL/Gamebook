import { Link, useNavigate } from "react-router";
import { authApi } from "~/api";
import { useProfile } from "~/hooks/useProfile";

import { Avatar } from "~/components/Avatar";
import UserSearch from "~/components/UserSearch";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
	const { data: profile, isLoading } = useProfile();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleLogout = () => {
		// Clear ALL TanStack Query caches
		queryClient.clear()
		authApi.logout();
		navigate("/login");
	};

	return (
		<nav className='bg-linear-to-r from-purple-800 to-pink-800 border-b border-gray-200 shadow-sm'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<Link to='/' className='text-2xl font-bold'>
						<span className='bg-linear-to-r from-red-600 via-pink-600 to-orange-600 text-transparent bg-clip-text'>
							Gamebook
						</span>
					</Link>

					{/* Nav links */}
					<div className='hidden sm:flex items-center gap-4'>
						<Link to='/' className='text-sm text-white/90 hover:text-white'>
							Feed
						</Link>
						<Link
							to='/posts/new'
							className='text-sm text-white/90 hover:text-white'
						>
							New Post
						</Link>
						<Link
							to='/posts/mine'
							className='text-sm text-white/90 hover:text-white'
						>
							My Posts
						</Link>
						<Link
							to='/chat'
							className='text-sm text-white/90 hover:text-white'
						>
							Chat
						</Link>
					</div>

					<UserSearch />

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
									<Avatar
										src={profile?.user?.avatarUrl}
										alt={profile?.user?.name}
										fallback={profile?.user?.name}
										size="md"
									/>
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
