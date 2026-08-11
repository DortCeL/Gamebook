import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import type { User } from "../../types";
import { userApi } from "~/api";
import { clearToken, getToken, setToken } from "~/api/client";
import { disconnectSocket } from "~/api/socket";

type AuthContextType = {
	user: User | null;
	loading: boolean;
	login: (token: string, user: User) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	login: () => {},
	logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// on app load, if token exists try to fetch current user
	useEffect(() => {
		const token = getToken();
		if (!token) {
			setLoading(false);
			return;
		}

		userApi
			.me()
			.then((res) => setUser(res.data))
			.catch(() => clearToken())
			.finally(() => setLoading(false));
	}, []);

	function login(token: string, userData: User) {
		setToken(token);
		setUser(userData);
	}

	function logout() {
		clearToken();
		disconnectSocket();
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
