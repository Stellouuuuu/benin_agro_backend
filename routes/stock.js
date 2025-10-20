import express from "express";
import { 
  getAllStockMovements, 
  getStockMovementById, 
  createStockMovement, 
  updateStockMovement, 
  deleteStockMovement 
} from "../controllers/stock.controller.js";

const router = express.Router();

router.get("/", getAllStockMovements);
router.get("/:id", getStockMovementById);
router.post("/", createStockMovement);
router.put("/:id", updateStockMovement);
router.delete("/:id", deleteStockMovement);

export default router;
