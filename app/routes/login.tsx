import { useNavigate } from "react-router";
import { useLogin } from "../hooks/useAuth";
import { useState } from "react";

export default function LoginPage() {
	const navigate = useNavigate();

	const [hittingRoute, setHittingRoute] = useState()


	const {
		mutate: login,
		isPending: isLoggingIn,
		error: loginError,
	} = useLogin();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		login(
			{ email, password },
			{
				onSuccess: () => {
					console.log("Login success from login.tsx");
					navigate("/profile");
				},
				onError: (err) => {
					console.error("Login error:", err);
				},
			},
		);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
			<div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-gray-900'>Welcome Back</h1>
					<p className='text-sm text-gray-500 mt-1'>Sign in to your account</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
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

					{loginError && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm'>
							{(loginError as Error).message}
						</div>
					)}

					<button
						type='submit'
						disabled={isLoggingIn}
						className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed'
					>
						{isLoggingIn ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<p className='text-center text-sm text-gray-500'>
					Don't have an account?{" "}
					<a
						href='/signup'
						className='text-blue-600 hover:underline font-medium'
					>
						Sign up
					</a>
				</p>
			</div>


			<h2 className="text-xl text-center">{hittingRoute}</h2>
		</div>
	);
}
