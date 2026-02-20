import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
import { pool } from "./db";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

export const app = express();
const PORT = process.env.PORT;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

let server: any;

export async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");

    server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1);
  }
}

export async function stop() {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  await pool.end();
}

if (process.env.NODE_ENV != "test") {
  start();
}
