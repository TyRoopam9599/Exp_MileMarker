import express from "express";
import { pdfControllers } from "../controllers/pdfControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/generate-report/:year/:month/:companyName/:companyAddress/:transport/:customerVisited",
  authMiddleware,
  pdfControllers
);

export default router;
