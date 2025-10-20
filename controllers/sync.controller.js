import db from "../db.js";

export const getAllSyncLogs = (req, res) => {
  db.query("SELECT * FROM sync_logs ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createSyncLog = (req, res) => {
  const { module, action, status, details } = req.body;
  db.query(
    `INSERT INTO sync_logs (module, action, status, details) 
     VALUES (?, ?, ?, ?)`,
    [module, action, status, details],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Log de synchronisation ajouté", id: results.insertId });
    }
  );
};
