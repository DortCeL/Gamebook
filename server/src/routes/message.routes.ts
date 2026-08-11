import { Router } from "express";
import { MessageController } from "../controllers/message.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:friendId", auth, MessageController.getWithFriend);

export default router;
