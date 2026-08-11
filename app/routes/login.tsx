import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { authApi } from "~/api";
import { useAuth } from "~/context/AuthContext";

export default function LoginPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirect") || "/";
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await authApi.login({ email, password });
			login(res.data.token, res.data.user);
			navigate(redirectTo, { replace: true });
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4 text-gray-100"
			>
				<h1 className="text-xl font-bold text-green-400">Login</h1>

				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
					className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					required
					className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm"
				/>

				{error && <p className="text-sm text-red-400">{error}</p>}

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50"
				>
					{loading ? "..." : "Sign In"}
				</button>

				<p className="text-sm text-gray-400 text-center">
					No account?{" "}
					<Link to="/signup" className="text-green-400 hover:underline">
						Sign up
					</Link>
				</p>
			</form>
		</div>
	);
}
