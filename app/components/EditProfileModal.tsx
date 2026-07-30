import { useState, useEffect } from "react";
import type { IProfile, IUpdateProfile } from "../../types";

interface EditProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	profile: IProfile;
	userId: string;
	onUpdate: (variables: { targetId: string; payload: IUpdateProfile }) => void;
	isUpdating: boolean;
}

export default function EditProfileModal({
	isOpen,
	onClose,
	profile,
	userId,
	onUpdate,
	isUpdating,
}: EditProfileModalProps) {
	// Form state
	const [name, setName] = useState("");
	const [gamertag, setGamertag] = useState("");
	const [bio, setBio] = useState("");
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarUrlInput, setAvatarUrlInput] = useState("");

	// Reset form when profile changes or modal opens
	useEffect(() => {
		if (profile && isOpen) {
			setName(profile.user.name || "");
			setGamertag(profile.user.gamertag || "");
			setBio(profile.user.bio || "");
			setAvatarPreview(profile.user.avatarUrl || null);
			setAvatarUrlInput("");
		}
	}, [profile, isOpen]);

	const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const url = e.target.value;
		setAvatarUrlInput(url);
		if (url.trim()) {
			setAvatarPreview(url.trim());
		} else {
			setAvatarPreview(profile.user.avatarUrl || null);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const payload: IUpdateProfile = {};

		if (name !== profile.user.name) payload.name = name;
		if (gamertag !== profile.user.gamertag) payload.gamertag = gamertag;
		if (bio !== profile.user.bio) payload.bio = bio;

		// Avatar URL
		if (avatarUrlInput.trim()) {
			payload.avatarUrl = avatarUrlInput.trim();
		}

		// If nothing changed, close
		if (Object.keys(payload).length === 0) {
			onClose();
			return;
		}

		onUpdate({ targetId: userId, payload });
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
			<div className='bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
				<div className='p-6'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-bold text-gray-900'>Edit Profile</h2>
						<button
							onClick={onClose}
							className='text-gray-500 hover:text-gray-700'
							aria-label='Close'
						>
							✕
						</button>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						{/* Avatar URL */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Avatar URL
							</label>
							<div className='flex items-center gap-4'>
								<div className='w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 shrink-0'>
									{avatarPreview ? (
										<img
											src={avatarPreview}
											alt='Avatar preview'
											className='w-full h-full object-cover'
										/>
									) : (
										<div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs'>
											No image
										</div>
									)}
								</div>
								<div className='flex-1'>
									<input
										id='avatar-url'
										type='url'
										value={avatarUrlInput}
										onChange={handleAvatarUrlChange}
										placeholder='Paste image URL from Facebook, etc.'
										className='w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
									/>
									<p className='text-xs text-gray-400 mt-1'>
										Paste a direct link to your profile picture (e.g., from
										Facebook, Twitter, or any hosting service)
									</p>
								</div>
							</div>
						</div>

						{/* Name */}
						<div>
							<label
								htmlFor='edit-name'
								className='block text-sm font-medium text-gray-700'
							>
								Name
							</label>
							<input
								id='edit-name'
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
							/>
						</div>

						{/* Gamertag */}
						<div>
							<label
								htmlFor='edit-gamertag'
								className='block text-sm font-medium text-gray-700'
							>
								Gamertag
							</label>
							<input
								id='edit-gamertag'
								type='text'
								value={gamertag}
								onChange={(e) => setGamertag(e.target.value)}
								className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
							/>
						</div>

						{/* Bio */}
						<div>
							<label
								htmlFor='edit-bio'
								className='block text-sm font-medium text-gray-700'
							>
								Bio
							</label>
							<textarea
								id='edit-bio'
								rows={3}
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none'
								placeholder='Tell us about yourself...'
							/>
						</div>

						{/* Actions */}
						<div className='flex gap-3 pt-2'>
							<button
								type='button'
								onClick={onClose}
								className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition'
							>
								Cancel
							</button>
							<button
								type='submit'
								disabled={isUpdating}
								className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-60'
							>
								{isUpdating ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
