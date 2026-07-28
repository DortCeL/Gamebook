import { useMutation } from "@tanstack/react-query";
import { authApi } from "~/api";
import { setToken } from "~/api/tokenHelpers";
import { useNavigate } from "react-router";
import type { LoginPayload, SignupPayload } from "../../types";

export function useLogin() {
	return useMutation({
		mutationFn: async (body: LoginPayload) => await authApi.login(body),
		onSuccess: (data) => {
			setToken(data.token);
			console.log("token is", data.token);
		},
	});
}

// auto login after signup
export function useSignup() {
	return useMutation({
		mutationFn: async (body: SignupPayload) => {
			await authApi.signup(body);
			return authApi.login({
				email: body.email,
				password: body.password,
			});
		},
		onSuccess: (data) => {
			setToken(data.token);
		},
	});
}
