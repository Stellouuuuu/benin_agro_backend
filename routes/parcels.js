import express from "express";
import { 
  getAllParcels, 
  getParcelById, 
  createParcel, 
  updateParcel, 
  deleteParcel 
} from "../controllers/parcels.controller.js";

const router = express.Router();

router.get("/", getAllParcels);
router.get("/:id", getParcelById);
router.post("/", createParcel);
router.put("/:id", updateParcel);
router.delete("/:id", deleteParcel);

export default router;
