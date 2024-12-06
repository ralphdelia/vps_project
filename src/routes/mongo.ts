import express from "express";
import Ping from "../models/mongo_model";

const mongoRouter = express.Router();

mongoRouter.get("/ping", async (req, res) => {
  try {
    const startTime = Date.now();
    const results = await Ping.find({});
    const dbTime = Date.now() - startTime;

    res.json(results.map((p) => ({ ...p.toObject(), dbTime })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

mongoRouter.post("/ping", async (req, res) => {
  try {
    const startTime = Date.now();
    let newPing = new Ping({ createdAt: new Date() });
    newPing = await newPing.save();
    const dbTime = Date.now() - startTime;

    res.json({ ...newPing.toObject(), dbTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

mongoRouter.delete("/ping", async (req, res) => {
  try {
    const startTime = Date.now();
    const deletedPing = await Ping.findOneAndDelete().sort({ createdAt: -1 });
    const dbTime = Date.now() - startTime;

    if (!deletedPing) {
      res.json({ pingDeleted: false });
      return;
    }

    res.json({ ...deletedPing.toObject(), dbTime, pingDeleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default mongoRouter;
