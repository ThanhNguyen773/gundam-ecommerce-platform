// middleware/optionalAuth.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			req.user = null; 
			return next();
		}

		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				req.user = null;
			} else {
				req.user = user;
			}
		} catch (err) {
		
			req.user = null;
		}

		next();
	} catch (err) {
		console.error("optionalAuth error:", err.message);
		req.user = null;
		next();
	}
};
