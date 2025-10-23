import express from "express";
import {
  getWeatherAlerts,
  addWeatherAlert,
  updateWeatherAlert,
  deleteWeatherAlert,
} from "../controllers/weatherAlerts.controller.js";

const router = express.Router();

router.get("/", getWeatherAlerts);
router.post("/", addWeatherAlert);
router.put("/:id", updateWeatherAlert);
router.delete("/:id", deleteWeatherAlert);

export default router;
