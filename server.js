import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import parcelsRoutes from "./routes/parcels.js";
import cropsRoutes from "./routes/crops.js";
import harvestsRoutes from "./routes/harvests.js";
import inventoryRoutes from "./routes/inventory.js";
import financesRoutes from "./routes/finances.js";
import syncRoutes from "./routes/sync.js";
import transactionsRoutes from "./routes/transactions.js";
import statsRoutes from "./routes/stats.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: "http://localhost:8080", // ton frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/parcels", parcelsRoutes);
app.use("/api/crops", cropsRoutes);
app.use("/api/harvests", harvestsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/finances", financesRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api", statsRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Backend Agro Node.js fonctionne ✅" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
