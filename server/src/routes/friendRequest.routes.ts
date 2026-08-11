import { Router } from "express";
import { FriendRequestController } from "../controllers/friendRequest.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", auth, FriendRequestController.send);
router.get("/incoming", auth, FriendRequestController.incoming);
router.get("/outgoing", auth, FriendRequestController.outgoing);
router.put("/:id/accept", auth, FriendRequestController.accept);

export default router;
