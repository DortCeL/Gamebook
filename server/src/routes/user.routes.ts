import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js"; // Update path as needed

const router = Router();

// Protected route: Users can delete their account
router.get("/me", authenticate, UserController.getProfile);
router.delete("/:id", authenticate, UserController.deleteAccount);
router.patch("/:id", authenticate, UserController.updateProfile);

export default router;
