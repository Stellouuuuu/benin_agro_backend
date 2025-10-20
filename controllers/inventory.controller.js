import db from "../db.js";

export const getAllInventoryItems = (req, res) => {
  db.query("SELECT * FROM inventory_items", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getInventoryItemById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM inventory_items WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Article introuvable" });
    res.json(results[0]);
  });
};

export const createInventoryItem = (req, res) => {
  const { sku, name, description, category, unit, unit_price, wholesale_price, stock, remainder, total_sold, total_amount_sold } = req.body;
  db.query(
    `INSERT INTO inventory_items 
    (sku, name, description, category, unit, unit_price, wholesale_price, stock, remainder, total_sold, total_amount_sold) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [sku, name, description, category, unit, unit_price, wholesale_price, stock, remainder, total_sold, total_amount_sold],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Article créé", id: results.insertId });
    }
  );
};

export const updateInventoryItem = (req, res) => {
  const { id } = req.params;
  const { sku, name, description, category, unit, unit_price, wholesale_price, stock, remainder, total_sold, total_amount_sold } = req.body;
  db.query(
    `UPDATE inventory_items 
     SET sku = ?, name = ?, description = ?, category = ?, unit = ?, unit_price = ?, wholesale_price = ?, stock = ?, remainder = ?, total_sold = ?, total_amount_sold = ? 
     WHERE id = ?`,
    [sku, name, description, category, unit, unit_price, wholesale_price, stock, remainder, total_sold, total_amount_sold, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Article mis à jour" });
    }
  );
};

export const deleteInventoryItem = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM inventory_items WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Article supprimé" });
  });
};
