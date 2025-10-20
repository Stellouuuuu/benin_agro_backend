import db from "../db.js";

// Obtenir toutes les cultures
export const getAllCrops = (req, res) => {
  db.query("SELECT * FROM crops", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Obtenir une culture par ID
export const getCropById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM crops WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Culture non trouvée" });
    res.json(results[0]);
  });
};

// Créer une culture
export const createCrop = (req, res) => {
  const { name, startMonth, endMonth, crop_type, water_needs } = req.body;

  db.query(
    "INSERT INTO crops (name, startMonth, endMonth, crop_type, water_needs) VALUES (?, ?, ?, ?, ?)",
    [name, startMonth, endMonth, crop_type, water_needs],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Culture créée", id: results.insertId });
    }
  );
};

// Mettre à jour une culture
export const updateCrop = (req, res) => {
  const { id } = req.params;
  const { name, startMonth, endMonth, crop_type, water_needs } = req.body;

  db.query(
    "UPDATE crops SET name = ?, startMonth = ?, endMonth = ?, crop_type = ?, water_needs = ? WHERE id = ?",
    [name, startMonth, endMonth, crop_type, water_needs, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Culture mise à jour" });
    }
  );
};

// Supprimer une culture
export const deleteCrop = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM crops WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Culture supprimée" });
  });
};
