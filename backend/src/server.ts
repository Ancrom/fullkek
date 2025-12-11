import express from "express";
import userRoutes from "./routes/user.routes.ts";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
