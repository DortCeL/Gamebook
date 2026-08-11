import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export class AuthController {
	static async register(req: any, res: any) {
		try {
			const { name, gamertag, email, password } = req.body;

			if (!name || !gamertag || !email || !password) {
				return res.status(400).json({ message: "All fields are required." });
			}

			const exists = await User.findOne({
				$or: [{ email }, { gamertag }],
			});
			if (exists) {
				return res.status(400).json({ message: "Email or gamertag taken." });
			}

			const hashed = await bcrypt.hash(password, 10);
			const user = await User.create({
				name,
				gamertag,
				email,
				password: hashed,
			});

			const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
				expiresIn: "7d",
			});

			return res.status(201).json({
				token,
				user: {
					_id: user._id,
					name: user.name,
					gamertag: user.gamertag,
					email: user.email,
					avatar: user.avatar,
				},
			});
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async login(req: any, res: any) {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ email }).select("+password");
			if (!user) {
				return res.status(400).json({ message: "Invalid email or password." });
			}

			const ok = await bcrypt.compare(password, user.password);
			if (!ok) {
				return res.status(400).json({ message: "Invalid email or password." });
			}

			const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
				expiresIn: "7d",
			});

			return res.json({
				token,
				user: {
					_id: user._id,
					name: user.name,
					gamertag: user.gamertag,
					email: user.email,
					avatar: user.avatar,
				},
			});
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}
}
