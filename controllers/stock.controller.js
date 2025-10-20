import db from "../db.js";

export const getAllStockMovements = (req, res) => {
  db.query("SELECT * FROM stock_movements", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getStockMovementById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM stock_movements WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Mouvement introuvable" });
    res.json(results[0]);
  });
};

export const createStockMovement = (req, res) => {
  const { item_id, type, quantity, unit_price, reference, notes, created_by } = req.body;
  db.query(
    `INSERT INTO stock_movements (item_id, type, quantity, unit_price, reference, notes, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [item_id, type, quantity, unit_price, reference, notes, created_by],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Mouvement ajouté", id: results.insertId });
    }
  );
};

export const updateStockMovement = (req, res) => {
  const { id } = req.params;
  const { item_id, type, quantity, unit_price, reference, notes } = req.body;
  db.query(
    `UPDATE stock_movements 
     SET item_id = ?, type = ?, quantity = ?, unit_price = ?, reference = ?, notes = ? 
     WHERE id = ?`,
    [item_id, type, quantity, unit_price, reference, notes, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Mouvement mis à jour" });
    }
  );
};

export const deleteStockMovement = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM stock_movements WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Mouvement supprimé" });
  });
};
