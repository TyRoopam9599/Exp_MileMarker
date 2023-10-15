import express from "express";
import { loginUser, resgiterUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", resgiterUser);
router.post("/login", loginUser);

export default router;
