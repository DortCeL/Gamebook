import { Router } from "express";
import { PostController } from "../controllers/post.controller.js";
import { CommentController } from "../controllers/comment.controller.js";
import { auth, optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", optionalAuth, PostController.getFeed);
router.get("/user/:userId", optionalAuth, PostController.getByUser);
router.post("/", auth, PostController.create);
router.put("/:id", auth, PostController.update);
router.delete("/:id", auth, PostController.remove);

// comments nested under posts
router.get("/:postId/comments", CommentController.getByPost);

export default router;
