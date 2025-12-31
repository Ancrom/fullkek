import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./db";
import userRoutes from "./routes/user.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
		credentials: true,
  })
);

app.use(express.json());

app.use("/api", userRoutes);

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
