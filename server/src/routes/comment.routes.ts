import { Router } from "express";
import { CommentController } from "../controllers/comment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/post/:postId", CommentController.getByPost);
router.get("/:commentId/replies", CommentController.getReplies);

// Protected routes
router.post("/", authenticate, CommentController.create);
router.delete("/:id", authenticate, CommentController.delete);

export default router;
