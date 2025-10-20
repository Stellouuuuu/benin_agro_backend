// routes/finances.routes.js
import express from "express";
import multer from "multer";
import {
  getAllFinances,
  getFinanceById,
  createFinance,
  updateFinance,
  deleteFinance,
  exportFinancesToExcel,
  exportFinancesToPDF,
  importFinancesFromFile,
} from "../controllers/finances.controller.js";

const router = express.Router();

// === Configuration de Multer ===
// Stockage en mémoire (on ne sauvegarde pas de fichier localement)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// === Routes CRUD ===
router.get("/", getAllFinances);
router.get("/:id", getFinanceById);
router.post("/", createFinance);
router.put("/:id", updateFinance);
router.delete("/:id", deleteFinance);

// === Export ===
router.get("/export/excel", exportFinancesToExcel);
router.get("/export/pdf", exportFinancesToPDF);

// === Import (avec upload du fichier Excel/CSV) ===
router.post("/import", upload.single("file"), importFinancesFromFile);

export default router;
