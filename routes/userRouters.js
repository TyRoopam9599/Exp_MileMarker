import express from "express";
import { authController } from "../controllers/authControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { editProfile } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/getuserdata", authMiddleware, authController);
router.put("/editProfile/:id", authMiddleware, editProfile);

export default router;
