import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", auth, UserController.me);
router.get("/:id", UserController.getById);
router.put("/:id", auth, UserController.update);

export default router;
