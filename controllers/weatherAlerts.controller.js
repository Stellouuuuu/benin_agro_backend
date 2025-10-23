import db from "../db.js";

// 📌 Récupérer toutes les alertes
export const getWeatherAlerts = (req, res) => {
  db.query("SELECT * FROM weather_alerts ORDER BY start_date DESC", (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur de récupération des alertes" });
    res.json(result);
  });
};

// 📌 Ajouter une alerte
export const addWeatherAlert = (req, res) => {
  const { region, start_date, end_date, severity, description } = req.body;
  if (!region || !start_date || !end_date || !severity) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const sql = "INSERT INTO weather_alerts (region, start_date, end_date, severity, description) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [region, start_date, end_date, severity, description], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur d’ajout" });
    res.json({ id: result.insertId, message: "Alerte ajoutée avec succès" });
  });
};

// 📌 Modifier une alerte
export const updateWeatherAlert = (req, res) => {
  const { id } = req.params;
  const { region, start_date, end_date, severity, description } = req.body;

  const sql = `
    UPDATE weather_alerts
    SET region=?, start_date=?, end_date=?, severity=?, description=?
    WHERE id=?`;
  db.query(sql, [region, start_date, end_date, severity, description, id], (err) => {
    if (err) return res.status(500).json({ error: "Erreur de mise à jour" });
    res.json({ message: "Alerte mise à jour" });
  });
};

// 📌 Supprimer une alerte
export const deleteWeatherAlert = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM weather_alerts WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Erreur de suppression" });
    res.json({ message: "Alerte supprimée" });
  });
};
