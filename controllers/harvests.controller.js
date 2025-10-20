import db from "../db.js";

export const getAllHarvests = (req, res) => {
  db.query("SELECT * FROM harvests", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getHarvestById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM harvests WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Récolte non trouvée" });
    res.json(results[0]);
  });
};

export const createHarvest = (req, res) => {
  const { parcel_id, crop_id, date, quantity, unit, notes, created_by } = req.body;

  // 🔹 Transformation de la date pour être au format YYYY-MM-DD
  const dateOnly = new Date(date).toISOString().split("T")[0];

  db.query(
    "INSERT INTO harvests (parcel_id, crop_id, date, quantity, unit, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [parcel_id, crop_id, dateOnly, quantity, unit, notes || null, created_by],
    (err, results) => {
      if (err) {
        console.error("Erreur création récolte :", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Récolte créée", id: results.insertId });
    }
  );
};


export const updateHarvest = (req, res) => {
  const { id } = req.params;
  const { parcel_id, crop_id, date, quantity, unit, notes } = req.body;
  db.query(
    "UPDATE harvests SET parcel_id = ?, crop_id = ?, date = ?, quantity = ?, unit = ?, notes = ? WHERE id = ?",
    [parcel_id, crop_id, date, quantity, unit, notes, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Récolte mise à jour" });
    }
  );
};

export const deleteHarvest = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM harvests WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Récolte supprimée" });
  });
};
