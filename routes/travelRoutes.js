import express from "express";
import {
  registerTravel,
  getTravels,
  getOneTravel,
  updateTravel,
  deleteTravel,
  searchTravel,
} from "../controllers/travelControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, registerTravel);
router.get("/", authMiddleware, getTravels);
router.get("/:id", authMiddleware, getOneTravel);
router.put("/:id", authMiddleware, updateTravel);
router.delete("/:id", authMiddleware, deleteTravel);
router.get("/search/location", authMiddleware, searchTravel);

export default router;
