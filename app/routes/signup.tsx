import { useNavigate } from "react-router";
import { useSignup } from "../hooks/useAuth";

export default function SignupPage() {
	const {
		mutate: SignupAndLogin,
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

		SignupAndLogin(
			{ email, password, name, gamertag },
			{
				onSuccess: () => {
					console.log("Signup and auto login successful!");
					navigate("/"); // or your protected page
				},
				onError: (err) => {
					console.error("Signup or auto login failed:", err);
					// You could show a more specific error message
				},
			},
		);
	};

	return (
		<div className='w-150'>
			<form onSubmit={handleSubmit}>
				<input name='fullname' type='text' required placeholder='full name' />
				<input name='gamertag' type='text' required placeholder='gamertag' />
				<input name='email' type='email' required placeholder='email' />
				<input
					name='password'
					type='password'
					required
					placeholder='passowrd'
				/>
				<button type='submit' disabled={signingUp}>
					{signingUp ? "Signing up..." : "Sign Up"}
				</button>
				{signupError && (
					<p style={{ color: "red" }}>{(signupError as Error).message}</p>
				)}
			</form>
		</div>
	);
}
