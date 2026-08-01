import { Router } from "express";
import { FriendshipController } from "../controllers/friendship.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, FriendshipController.getFriends);
router.get("/requests/sent", authenticate, FriendshipController.getSentRequests);
router.get("/requests", authenticate, FriendshipController.getIncomingRequests);
router.post(
	"/request/:userId",
	authenticate,
	FriendshipController.sendRequest,
);
router.patch(
	"/accept/:requestId",
	authenticate,
	FriendshipController.acceptRequest,
);
router.patch(
	"/decline/:requestId",
	authenticate,
	FriendshipController.declineRequest,
);
router.delete(
	"/:friendshipId",
	authenticate,
	FriendshipController.removeFriendship,
);

export default router;
