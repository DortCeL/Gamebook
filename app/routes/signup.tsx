import { useNavigate } from "react-router";
import { useSignup } from "../hooks/useAuth";

export default function SignupPage() {
	const {
		mutate: signupAndLogin,
		isPending: signingUp,
		error: signupError,
	} = useSignup();
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const email = form.email.value;
		const password = form.password.value;
		const name = form.fullname.value;
		const gamertag = form.gamertag.value;

		signupAndLogin(
			{ email, password, name, gamertag },
			{
				onSuccess: () => {
					console.log("Signup and auto login successful!");
					navigate("/profile");
				},
				onError: (err) => {
					console.error("Signup or auto login failed:", err);
				},
			},
		);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
			<div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-gray-900'>Create Account</h1>
					<p className='text-sm text-gray-500 mt-1'>Join the community</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='fullname'
							className='block text-sm font-medium text-gray-700'
						>
							Full Name
						</label>
						<input
							id='fullname'
							name='fullname'
							type='text'
							required
							className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
							placeholder='John Doe'
						/>
					</div>

					<div>
						<label
							htmlFor='gamertag'
							className='block text-sm font-medium text-gray-700'
						>
							Gamertag
						</label>
						<input
							id='gamertag'
							name='gamertag'
							type='text'
							required
							className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
							placeholder='JohnnyGamer'
						/>
					</div>

					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'
						>
							Email
						</label>
						<input
							id='email'
							name='email'
							type='email'
							required
							className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
							placeholder='you@example.com'
						/>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'
						>
							Password
						</label>
						<input
							id='password'
							name='password'
							type='password'
							required
							className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
							placeholder='••••••••'
						/>
					</div>

					{signupError && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm'>
							{(signupError as Error).message}
						</div>
					)}

					<button
						type='submit'
						disabled={signingUp}
						className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed'
					>
						{signingUp ? "Signing up..." : "Sign Up"}
					</button>
				</form>

				<p className='text-center text-sm text-gray-500'>
					Already have an account?{" "}
					<a
						href='/login'
						className='text-blue-600 hover:underline font-medium'
					>
						Sign in
					</a>
				</p>
			</div>
		</div>
	);
}
