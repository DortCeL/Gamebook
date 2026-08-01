import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { userApi } from "~/api";
import type { IAuthor } from "../../types";
import { Avatar } from "~/components/Avatar";
import FriendActionButton from "~/components/FriendActionButton";
import { useProfile } from "~/hooks/useProfile";

// a component to search for users
export default function UserSearch() {
	const { data: currentProfile } = useProfile();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<IAuthor[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [searching, setSearching] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// debounce the search
	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			return;
		}

		// set a timer to search for users after 300ms
		const timer = setTimeout(async () => {
			setSearching(true);
			try {
				const users = await userApi.search(query.trim());
				setResults(users);
				setIsOpen(true);
			} finally {
				setSearching(false);
			}
		}, 300); // 300ms delay for debounce
		return () => clearTimeout(timer); // clears the previous timer for next debounce
	}, [query]); // debounce the search everytime query changes

	// if the user clicks outside the search container, close the search results
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// display the search input and results
	return (
		<div ref={containerRef} className="relative hidden md:block w-64">
			<input
				type="search"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onFocus={() => results.length > 0 && setIsOpen(true)}
				placeholder="Search users..."
				className="w-full py-2 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400"
			/>

			{/* display the search results */}
			{isOpen && (query.trim() || searching) && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-80 overflow-y-auto">
					{searching && (
						<p className="px-4 py-3 text-sm text-gray-500">Searching...</p>
					)}
					{!searching && results.length === 0 && (
						<p className="px-4 py-3 text-sm text-gray-500">No users found.</p>
					)}
					{results.map((user) => {
						const isSelf = user._id === currentProfile?.user?._id;

						return (
							<div
								key={user._id}
								className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0"
							>
								<Link
									to={isSelf ? "/profile" : `/users/${user._id}`}
									onClick={() => {
										setIsOpen(false);
										setQuery("");
									}}
									className="flex items-center gap-3 min-w-0 hover:opacity-80"
								>
									<Avatar
										src={user.avatarUrl}
										alt={user.name}
										fallback={user.name}
										size="sm"
									/>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-gray-900 truncate">
											{user.name}
										</p>
										<p className="text-xs text-gray-500">@{user.gamertag}</p>
									</div>
								</Link>
								{/* display the friend action button */}
								{!isSelf && (
									<div className="shrink-0 scale-90 origin-right">
										<FriendActionButton targetUserId={user._id} />
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
