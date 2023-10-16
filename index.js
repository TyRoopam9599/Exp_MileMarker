import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouters.js";
import authRouter from "./routes/authRoutes.js";
import travelRouter from "./routes/travelRoutes.js";
import pdfRouter from "./routes/pdfGenerate.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/travels", travelRouter);
app.use("/api/pdf", pdfRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: `Internafdsbfhgfl server error, ${err}` });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  connectDB();
});
