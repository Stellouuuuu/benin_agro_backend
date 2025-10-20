import db from "../db.js";

// GET /api/parcels
export const getAllParcels = (req, res) => {
  db.query("SELECT * FROM parcels", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// GET /api/parcels/:id
export const getParcelById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM parcels WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Parcelle non trouvée" });
    res.json(results[0]);
  });
};

// POST /api/parcels
export const createParcel = (req, res) => {
  const { name, area, crop, status, lastActivity, soilType, irrigationStatus, rainfall, plantingDate, harvestDate, ph, organicMatter, notes } = req.body;

  db.query(
    `INSERT INTO parcels 
    (name, area, crop, status, lastActivity, soilType, irrigationStatus, rainfall, plantingDate, harvestDate, ph, organicMatter, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, area, crop, status, lastActivity, soilType, irrigationStatus, rainfall, plantingDate, harvestDate, ph, organicMatter, notes],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      db.query("SELECT * FROM parcels WHERE id = ?", [results.insertId], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(rows[0]);
      });
    }
  );
};



// PUT /api/parcels/:id
export const updateParcel = (req, res) => {
  const { id } = req.params;
  const { name, area, crop, status, lastActivity, soilType, irrigationStatus, rainfall, plantingDate, harvestDate, ph, organicMatter, notes } = req.body;

  db.query(
    `UPDATE parcels SET 
    name=?, area=?, crop=?, status=?, lastActivity=?, soilType=?, irrigationStatus=?, rainfall=?, plantingDate=?, harvestDate=?, ph=?, organicMatter=?, notes=? 
    WHERE id=?`,
    [name, area, crop, status, lastActivity, soilType, irrigationStatus, rainfall, plantingDate, harvestDate, ph, organicMatter, notes, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      db.query("SELECT * FROM parcels WHERE id = ?", [id], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(rows[0]);
      });
    }
  );
};



// DELETE /api/parcels/:id
export const deleteParcel = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM parcels WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Parcelle supprimée" });
  });
};
