import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const counterFilePath = path.join(__dirname, "counter.json");

if (!fs.existsSync(counterFilePath)) {
  fs.writeFileSync(counterFilePath, JSON.stringify({}));
}

const app = express();

app.use(express.json());

app.post("/counter/:bookId/incr", (req, res) => {
  const { bookId } = req.params;

  const counters = JSON.parse(fs.readFileSync(counterFilePath));

  counters[bookId] = (counters[bookId] || 0) + 1;

  fs.writeFileSync(counterFilePath, JSON.stringify(counters));

  res.status(200).json({ counter: counters[bookId] });
});

app.get("/counter/:bookId", (req, res) => {
  const { bookId } = req.params;

  const counters = JSON.parse(fs.readFileSync(counterFilePath));

  res.status(200).json({ counter: counters[bookId] || 0 });
});

const port = process.env.PORT || 3001;
app.listen(port);
