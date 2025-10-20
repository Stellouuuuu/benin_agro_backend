import express from "express";
import { 
  getAllSyncLogs, 
  createSyncLog 
} from "../controllers/sync.controller.js";

const router = express.Router();

router.get("/", getAllSyncLogs);
router.post("/", createSyncLog);

export default router;
