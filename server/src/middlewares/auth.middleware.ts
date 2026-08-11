import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// must be logged in
export function auth(req: any, res: any, next: any) {
	try {
		const header = req.headers.authorization;
		if (!header?.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Login required." });
		}

		const token = header.split(" ")[1];
		const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
		req.user = { _id: decoded._id };
		next();
	} catch {
		return res.status(401).json({ message: "Invalid or expired token." });
	}
}

// token optional... for public feed that shows extra posts if logged in
export function optionalAuth(req: any, res: any, next: any) {
	try {
		const header = req.headers.authorization;
		if (header?.startsWith("Bearer ")) {
			const token = header.split(" ")[1];
			const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
			req.user = { _id: decoded._id };
		}
	} catch {
		// ignore bad token, treat as guest
	}
	next();
}
