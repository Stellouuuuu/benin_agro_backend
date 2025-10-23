// controllers/dashboard.controller.js
import db from "../db.js";

export const getDashboardData = (req, res) => {
  const data = {};

  // 1️⃣ Récupérer les totaux
  const totalIncomeQuery = "SELECT SUM(amount) AS total FROM finances WHERE type = 'income'";
  const totalExpenseQuery = "SELECT SUM(amount) AS total FROM finances WHERE type = 'expense'";
  const lastFinancesQuery = "SELECT * FROM finances ORDER BY date DESC LIMIT 5";

  db.query(totalIncomeQuery, (err, incomeResult) => {
    if (err) return res.status(500).json({ error: "Erreur revenus" });
    data.totalIncome = incomeResult[0].total || 0;

    db.query(totalExpenseQuery, (err2, expenseResult) => {
      if (err2) return res.status(500).json({ error: "Erreur dépenses" });
      data.totalExpense = expenseResult[0].total || 0;
      data.balance = data.totalIncome - data.totalExpense;

      db.query(lastFinancesQuery, (err3, lastFinances) => {
        if (err3) return res.status(500).json({ error: "Erreur dernières opérations" });
        data.lastFinances = lastFinances;
        res.json(data);
      });
    });
  });
};
