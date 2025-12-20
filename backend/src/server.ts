import express from "express";
import userRoutes from "./routes/user.routes";
import cors from "cors";

// mock users
import { seedUsers } from "../tests/users/users.seed";
import { UserService } from "./services/user.serviсe";
import { userRepository } from "./modules/user.repository";
seedUsers(new UserService(userRepository));
//

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

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
