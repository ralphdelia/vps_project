import express from "express";
import { configDotenv } from "dotenv";
configDotenv();

import postgresRouter from "./routes/postgres";
import mongoRouter from "./routes/mongo";

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;

app.use(express.json());

app.use("/api/mongo", mongoRouter);
app.use("/api/postgres", postgresRouter);

app.get("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
