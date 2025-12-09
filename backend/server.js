import express from "express";

const app = express();
const PORT = 5000;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.get("/", (req, res) => {
  res.send("Hello world");
});
app.get("/about", (req, res) => {
  res.send("About page");
});
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
