// controllers/finances.controller.js
import db from "../db.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import fs from "fs-extra";
import path from "path";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const ensureDirs = (p) => {
  const dir = path.dirname(p);
  fs.ensureDirSync(dir);
};

export const getAllFinances = (req, res) => {
  db.query("SELECT * FROM finances ORDER BY date DESC", (err, results) => {
    if (err) {
      console.error("Erreur MySQL getAllFinances:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

export const getFinanceById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM finances WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ message: "Finance introuvable" });
    res.json(results[0]);
  });
};

export const createFinance = (req, res) => {
  const { parcel_id = null, type, category, amount, date, description = "", created_by = null } = req.body;
  db.query(
    `INSERT INTO finances (parcel_id, type, category, amount, date, description, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [parcel_id, type, category, amount, date, description, created_by],
    (err, result) => {
      if (err) {
        console.error("Erreur createFinance:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Finance ajoutée", id: result.insertId });
    }
  );
};

export const updateFinance = (req, res) => {
  const { id } = req.params;
  const { parcel_id = null, type, category, amount, date, description = "" } = req.body;
  db.query(
    `UPDATE finances SET parcel_id = ?, type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`,
    [parcel_id, type, category, amount, date, description, id],
    (err) => {
      if (err) {
        console.error("Erreur updateFinance:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Finance mise à jour" });
    }
  );
};

export const deleteFinance = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM finances WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Erreur deleteFinance:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Finance supprimée" });
  });
};

// ---- EXPORT EXCEL ----
export const exportFinancesToExcel = (req, res) => {
  db.query("SELECT * FROM finances ORDER BY date DESC", async (err, results) => {
    if (err) {
      console.error("Erreur exportFinancesToExcel - DB:", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Finances");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Parcelle", key: "parcel_id", width: 15 },
        { header: "Type", key: "type", width: 15 },
        { header: "Catégorie", key: "category", width: 20 },
        { header: "Montant", key: "amount", width: 15 },
        { header: "Date", key: "date", width: 15 },
        { header: "Description", key: "description", width: 30 },
        { header: "Créé par", key: "created_by", width: 20 },
      ];

      results.forEach((r) => worksheet.addRow(r));

      const filePath = path.resolve(`./exports/finances_${Date.now()}.xlsx`);
      ensureDirs(filePath);
      await workbook.xlsx.writeFile(filePath);

      cloudinary.uploader.upload(filePath, { resource_type: "raw", folder: "benin_agro_backend/exports", public_id: `finances_${Date.now()}` }, async (errUpload, uploadResult) => {
        // try { await fs.remove(filePath); } catch(e){ /* ignore */ }
        if (errUpload) {
          console.error("Erreur upload Cloudinary Excel:", errUpload);
          return res.status(500).json({ error: "Erreur upload Cloudinary" });
        }
        res.json({ message: "Export Excel réussi", url: uploadResult.secure_url });
      });
    } catch (e) {
      console.error("Erreur exportFinancesToExcel:", e);
      return res.status(500).json({ error: e.message });
    }
  });
};

// ---- EXPORT PDF ----
export const exportFinancesToPDF = (req, res) => {
  db.query("SELECT * FROM finances ORDER BY date DESC", (err, results) => {
    if (err) {
      console.error("Erreur exportFinancesToPDF - DB:", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      const doc = new PDFDocument({
        margin: 40,
        size: "A4", // Tu peux mettre "A3" si tu veux plus grand
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);

        cloudinary.uploader.upload_stream(
          { resource_type: "raw", folder: "benin_agro/exports", public_id: `finances_${Date.now()}` },
          (errUpload, uploadResult) => {
            if (errUpload) {
              console.error("Erreur upload Cloudinary PDF:", errUpload);
              return res.status(500).json({ error: "Erreur upload Cloudinary" });
            }
            res.json({ message: "Export PDF réussi", url: uploadResult.secure_url });
          }
        ).end(pdfBuffer);
      });

      // ===== Charger une police Unicode =====
      const fontPath = path.resolve("./fonts/DejaVuSans.ttf");
      if (fs.existsSync(fontPath)) {
        doc.registerFont("DejaVu", fontPath);
        doc.font("DejaVu");
      }

      // ===== TITRE =====
      doc.fontSize(22).text("📊 Rapport Financier", { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Date de génération : ${new Date().toLocaleString()}`, { align: "center" });
      doc.moveDown(1);

      // ===== Séparer Revenus et Dépenses =====
      const incomes = results.filter(f => f.type === "income");
      const expenses = results.filter(f => f.type === "expense");

      const formatAmount = (amount) => {
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XOF",
          maximumFractionDigits: 0
        }).format(amount);
      };

      const renderTable = (data, title) => {
        doc.fontSize(16).fillColor("black").text(title, { underline: true });
        doc.moveDown(0.5);

        // En-tête
        doc.fontSize(12).text("ID | Type | Catégorie | Montant | Date | Description");
        doc.moveDown(0.3);

        data.forEach(f => {
          const row = [
            f.id,
            f.type,
            f.category,
            formatAmount(f.amount),
            new Date(f.date).toLocaleDateString(),
            f.description || "-"
          ];
          doc.fontSize(10).text(row.join(" | "));
          doc.moveDown(0.2);
        });

        doc.moveDown(1);
      };

      renderTable(incomes, "Revenus");
      renderTable(expenses, "Dépenses");

      doc.end();
    } catch (e) {
      console.error("Erreur exportFinancesToPDF:", e);
      return res.status(500).json({ error: e.message });
    }
  });
};




// ---- IMPORT depuis le fichier uploadé (req.file.buffer) ----
export const importFinancesFromFile = (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Fichier manquant (envoyer en multipart/form-data, champ 'file')" });
    }

    console.log("✅ Fichier reçu :", {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
    const originalName = req.file.originalname || `import_${Date.now()}`;
    const fileExt = (originalName.split(".").pop() || "").toLowerCase();

    // 1) upload to Cloudinary (raw) from buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "benin_agro/imports", public_id: `finances_import_${Date.now()}` },
      async (errUpload, uploadResult) => {
        if (errUpload) {
          console.error("Erreur upload Cloudinary import:", errUpload);
          return res.status(500).json({ error: "Erreur upload Cloudinary" });
        }

        // 2) parse buffer localement (on a req.file.buffer)
        const financesData = [];
        const buffer = req.file.buffer;

        if (fileExt === "xlsx" || fileExt === "xls") {
          const workbook = new ExcelJS.Workbook();
          // load from buffer
          await workbook.xlsx.load(buffer);
          const sheet = workbook.worksheets[0];
          sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            financesData.push({
              parcel_id: row.getCell(1).value ?? null,
              type: (row.getCell(2).value ?? "expense").toString(),
              category: (row.getCell(3).value ?? "").toString(),
              amount: parseFloat(row.getCell(4).value) || 0,
              date: (row.getCell(5).value ?? new Date()).toString(),
              description: (row.getCell(6).value ?? "").toString(),
              created_by: 1,
            });
          });
        } else {
          // assume csv / text
          const csv = buffer.toString("utf8");
          const lines = csv.split("\n").map(l => l.trim()).filter(l => l.length>0);
          // assume header present
          const dataLines = lines.slice(1);
          dataLines.forEach(line => {
            const cols = line.split(",");
            const [parcel_id, type, category, amount, date, description] = cols.map(c => c?.trim());
            if (!type && !amount) return;
            financesData.push({
              parcel_id: parcel_id || null,
              type: type || "expense",
              category: category || "",
              amount: parseFloat(amount) || 0,
              date: date || new Date().toISOString().split("T")[0],
              description: description || "",
              created_by: 1,
            });
          });
        }

        // 3) insert into DB (one by one, callback style)
        if (financesData.length === 0) {
          return res.json({ message: "Aucune ligne à importer", cloudinaryFile: uploadResult.secure_url });
        }

          const sql =
    "INSERT INTO finances (parcel_id, type, category, amount, date, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)";

  const insertPromises = financesData.map((f) => {
    return new Promise((resolve, reject) => {
      db.query(sql, [f.parcel_id, f.type, f.category, f.amount, f.date, f.description, f.created_by], (err) => {
        if (err) {
          console.error("Erreur insertion ligne import:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  Promise.allSettled(insertPromises)
    .then((results) => {
      const failed = results.filter((r) => r.status === "rejected").length;
      const success = results.length - failed;
      if (failed > 0) {
        return res
          .status(207)
          .json({ message: `Import partiel : ${success} réussies, ${failed} erreurs`, cloudinaryFile: uploadResult.secure_url });
      }
      res.json({ message: `Import réussi (${success} lignes)`, cloudinaryFile: uploadResult.secure_url });
    })
    .catch((err) => {
      console.error("Erreur Promise.allSettled:", err);
      res.status(500).json({ error: "Erreur lors de l'import" });
    });

      }
    );

    // feed buffer to upload_stream
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("Erreur importFinancesFromFile:", err);
    res.status(500).json({ error: err.message });
  }
};
