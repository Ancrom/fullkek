import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./db";
import userRoutes from "./routes/user.routes";
import { log } from "console";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1);
  }
}

start();
