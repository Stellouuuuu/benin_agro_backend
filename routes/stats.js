import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * 🔹 Statistiques par catégorie (stock total par catégorie)
 * Exemple : pour les graphiques ou tableaux de bord
 */
router.get("/category-stats", (req, res) => {
  const sql = `
    SELECT 
      category AS name,
      SUM(stock) AS value
    FROM inventory_items
    GROUP BY category
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Erreur SQL /category-stats :", err);
      return res.status(500).json({ error: "Erreur SQL lors du calcul des statistiques" });
    }

    // Données avec couleurs dynamiques pour les graphiques
    const colors = ['#14B8A6', '#6B7280', '#EF4444', '#3B82F6', '#10B981'];
    const data = results.map((r, i) => ({
      ...r,
      fill: colors[i % colors.length]
    }));

    res.json(data);
  });
});

export default router;
