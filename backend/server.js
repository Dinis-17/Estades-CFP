require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Error connexió a MySQL:", err);
    process.exit(1);
  }
  console.log("Conectat a MySQL");
});

// ENDPOINTS
app.get("/api/empreses", (req, res) => {
  const query =
    "SELECT id_empresa, nom_empresa, comentaris_generals, branques FROM Empresa WHERE actiu = TRUE ORDER BY nom_empresa ASC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error al obtener empreses" });
    }

    const empresasConBranques = results.map((empresa) => ({
      id: empresa.id_empresa,
      title: empresa.nom_empresa,
      description: empresa.comentaris_generals || "",
      branques: empresa.branques
        ? empresa.branques.split(",").map((b) => b.trim())
        : [],
    }));

    res.json(empresasConBranques);
  });
});

app.get("/api/empreses/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Empresa WHERE id_empresa = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error al obtener empresa" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Empresa no trobada" });
    }

    res.json(results[0]);
  });
});

app.get("/api/empresas/buscar/:param", (req, res) => {
  const { param } = req.params;
  const query = `
    SELECT * FROM Empresa 
    WHERE actiu = TRUE 
    AND (nom_empresa LIKE ? OR adreca LIKE ? OR email LIKE ?)
    ORDER BY nom_empresa ASC
  `;
  const searchTerm = `%${param}%`;

  db.query(query, [searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error("Error en la búsqueda:", err);
      return res.status(500).json({ error: "Error al buscar empreses" });
    }
    res.json(results);
  });
});

app.post("/api/empreses", (req, res) => {
  const {
    nom_empresa,
    adreca,
    telefon,
    web,
    email,
    sens_div_func,
    idoneitat,
    historial_incidents,
    comentaris_generals,
  } = req.body;

  const query = `
    INSERT INTO Empresa 
    (nom_empresa, adreca, telefon, web, email, sens_div_func, idoneitat, historial_incidents, comentaris_generals) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      nom_empresa,
      adreca,
      telefon,
      web,
      email,
      sens_div_func,
      idoneitat,
      historial_incidents,
      comentaris_generals,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al crear empresa:", err);
        return res.status(500).json({ error: "Error al crear empresa" });
      }
      res.status(201).json({
        message: "Empresa creada",
        id: result.insertId,
      });
    },
  );
});

app.get("/", (req, res) => {
  res.json({ message: "API de Empreses funcionant" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corrent en http://localhost:${PORT}`);
});
