import express from "express";
import { 
  getAllHarvests, 
  getHarvestById, 
  createHarvest, 
  updateHarvest, 
  deleteHarvest 
} from "../controllers/harvests.controller.js";

const router = express.Router();

router.get("/", getAllHarvests);
router.get("/:id", getHarvestById);
router.post("/", createHarvest);
router.put("/:id", updateHarvest);
router.delete("/:id", deleteHarvest);

export default router;
