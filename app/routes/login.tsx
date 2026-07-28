import { useLogin } from "../hooks/useAuth";

export default function LoginPage() {
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
		const inputData = { email, password };

		login(inputData, {
			onSuccess: () => {
				// Redirect to dashboard or fetch profile
				console.log("Login success from login.tsx");
			},
			onError: (err) => {
				console.error("Login error:", err);
			},
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<input name='email' type='email' required />
			<input name='password' type='password' required />
			<button type='submit' disabled={isLoggingIn}>
				{isLoggingIn ? "Logging in..." : "Login"}
			</button>
			{loginError && (
				<p style={{ color: "red" }}>{(loginError as Error).message}</p>
			)}
		</form>
	);
}
