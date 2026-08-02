import { Router } from "express";
import { MessageController } from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.patch("/:messageId/read", authenticate, MessageController.markAsRead);

export default router;
