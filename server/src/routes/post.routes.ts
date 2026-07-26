import { Router } from "express";
import { PostController } from "../controllers/post.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js"; // Import your auth middleware

const router = Router();

// Public routes
router.get("/myposts", authenticate, PostController.getMyPosts);
router.get("/", PostController.getAll);
router.get("/:id", PostController.getById);

// Protected routes
router.post("/", authenticate, PostController.create);
router.patch("/:id", authenticate, PostController.update);
router.delete("/:id", authenticate, PostController.delete);

export default router;
