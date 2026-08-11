import { Router } from "express";
import { CommentController } from "../controllers/comment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", auth, CommentController.create);
router.put("/:id", auth, CommentController.update);
router.delete("/:id", auth, CommentController.remove);

export default router;
