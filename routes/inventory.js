import express from "express";
import { 
  getAllInventoryItems, 
  getInventoryItemById, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.get("/", getAllInventoryItems);
router.get("/:id", getInventoryItemById);
router.post("/", createInventoryItem);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

export default router;
