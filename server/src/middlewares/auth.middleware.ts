import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/express.d.js"; // Update path as needed

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;

		// Check if Authorization header exists and follows 'Bearer <token>' format
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Access denied. No token provided.",
			});
		}

		// Extract token string
		const token = authHeader.split(" ")[1];

		// Verify token integrity and expiration
		const decoded = jwt.verify(token as string, JWT_SECRET) as CustomJwtPayload;

		// Attach decoded payload to request object (normalize _id to string)
		req.user = {
			...decoded,
			_id: String(decoded._id),
		};

		//*** DEBUGGING  SECTION DELETE LATER !!!
		// return res.status(420).json({ decodedToken: decoded, user: req.user });

		return next();
	} catch (error: any) {
		return res.status(401).json({
			success: false,
			message: "Invalid or expired token.",
		});
	}
};
