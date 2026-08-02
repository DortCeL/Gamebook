import { Router } from "express";
import { ConversationController } from "../controllers/conversation.controller.js";
import { MessageController } from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, ConversationController.list);
router.post("/", authenticate, ConversationController.create);
router.get(
	"/:conversationId/messages",
	authenticate,
	MessageController.list,
);
router.post(
	"/:conversationId/messages",
	authenticate,
	MessageController.send,
);
router.patch(
	"/:conversationId/read",
	authenticate,
	MessageController.markConversationAsRead,
);
router.get("/:id", authenticate, ConversationController.getById);

export default router;
