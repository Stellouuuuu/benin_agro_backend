import express from "express";
import db from "../db.js";

const router = express.Router();

// 🔹 GET : récupérer toutes les transactions
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      t.id,
      t.item_id AS itemId,
      t.type,
      t.quantity,
      t.date,
      t.user,
      t.notes,
      i.name AS itemName,
      i.category AS itemCategory
    FROM transactions t
    LEFT JOIN inventory_items i ON t.item_id = i.id
    ORDER BY t.date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// 🔹 POST : enregistrer une nouvelle transaction (entrée/sortie)
router.post("/", (req, res) => {
  const { itemId, type, quantity, date, user, notes } = req.body;

  if (!itemId || !type || !quantity || !date) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  // 1️⃣ Ajouter la transaction
  const insertSql = `
    INSERT INTO transactions (item_id, type, quantity, date, user, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(insertSql, [itemId, type, quantity, date, user || "Admin", notes || ""], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // 2️⃣ Mettre à jour le stock du produit concerné
    const updateSql =
      type === "in"
        ? "UPDATE inventory_items SET stock = stock + ? WHERE id = ?"
        : "UPDATE inventory_items SET stock = stock - ? WHERE id = ?";

    db.query(updateSql, [quantity, itemId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Transaction enregistrée avec succès !" });
    });
  });
});

export default router;
