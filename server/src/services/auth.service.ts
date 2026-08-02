import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
	static async register(
		name: string,
		email: string,
		password: string,
		gamertag: string,
	) {
		const exists = await User.findOne({ email });

		if (exists) {
			throw new Error("Email already exists");
		}

		const exists2 = await User.findOne({ gamertag });

		if (exists2) {
			throw new Error("Gamertag already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// SAVING USER TO DATABASE
		const userProfile: Partial<IUser> = {
			name,
			email,
			password: hashedPassword,
			gamertag,
			bio: "",
			avatarUrl: "",
		};

		const user = await User.create(userProfile);

		return {
			id: user._id,
			name: user.name,
			email: user.email,
			gamertag: user.gamertag,
			bio: user.bio,
			avatarUrl: user.avatarUrl,
		};
	}

	static async login(email: string, password: string) {
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			throw new Error("Invalid credentials");
		}

		const valid = await bcrypt.compare(password, user.password);

		if (!valid) {
			throw new Error("Invalid credentials");
		}

		const token = jwt.sign(
			{
				_id: user._id.toString(),
				role: user.role,
			},
			JWT_SECRET,
			{
				expiresIn: "7d",
			},
		);

		return {
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};
	}
}
