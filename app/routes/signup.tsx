import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authApi } from "~/api";
import { useAuth } from "~/context/AuthContext";

export default function SignupPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [form, setForm] = useState({
		name: "",
		gamertag: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await authApi.register(form);
			login(res.data.token, res.data.user);
			navigate("/", { replace: true });
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
				className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-3 text-gray-100"
			>
				<h1 className="text-xl font-bold text-green-400">Sign up</h1>

				{(["name", "gamertag", "email", "password"] as const).map((field) => (
					<input
						key={field}
						type={field === "password" ? "password" : field === "email" ? "email" : "text"}
						value={form[field]}
						onChange={(e) => setForm({ ...form, [field]: e.target.value })}
						placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
						required
						className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm"
					/>
				))}

				{error && <p className="text-sm text-red-400">{error}</p>}

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50"
				>
					{loading ? "..." : "Create account"}
				</button>

				<p className="text-sm text-gray-400 text-center">
					Have an account?{" "}
					<Link to="/login" className="text-green-400 hover:underline">
						Log in
					</Link>
				</p>
			</form>
		</div>
	);
}
