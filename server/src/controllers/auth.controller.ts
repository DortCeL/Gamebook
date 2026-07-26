import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
	static async register(req: Request, res: Response) {
		try {
			const { name, email, password, gamertag } = req.body;

			const user = await AuthService.register(name, email, password, gamertag);

			return res.status(201).json({
				success: true,
				message: "User registered successfully",
				data: user,
			});
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			const data = await AuthService.login(email, password);

			return res.json({
				success: true,
				message: "Login successful",
				data,
			});
		} catch (error: any) {
			return res.status(401).json({
				success: false,
				message: error.message,
			});
		}
	}
}
