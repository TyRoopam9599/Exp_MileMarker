import express from "express";
import { authController } from "../controllers/authControllers.js";
import { editProfile } from "../controllers/userControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Route to get user data
router.post("/getuserdata", authController);

// Route to edit user profile
router.put("/editprofile/:id", editProfile);

export default router;
