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

// Apply authMiddleware for all routes
router.use(authMiddleware);

router.post("/", registerTravel);
router.get("/", getTravels);
router.get("/:id", getOneTravel);
router.put("/:id", updateTravel);
router.delete("/:id", deleteTravel);

// You can create a nested router for search route
const searchRouter = express.Router();
searchRouter.get("/location", searchTravel);

router.use("/search", searchRouter);

export default router;
