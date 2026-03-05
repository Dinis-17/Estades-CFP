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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countQuery = "SELECT COUNT(*) as total FROM Empresa WHERE actiu = TRUE";

  const dataQuery = `
    SELECT id_empresa, nom_empresa, comentaris_generals, branques 
    FROM Empresa 
    WHERE actiu = TRUE 
    ORDER BY nom_empresa ASC
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, (err, countResults) => {
    if (err) {
      console.error("Error al contar empreses:", err);
      return res.status(500).json({ error: "Error al obtenir empreses" });
    }

    const total = countResults[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataQuery, [limit, offset], (err, results) => {
      if (err) {
        console.error("Error en la consulta:", err);
        return res.status(500).json({ error: "Error al obtenir empreses" });
      }

      const empresasConBranques = results.map((empresa) => ({
        id: empresa.id_empresa,
        title: empresa.nom_empresa,
        description: empresa.comentaris_generals || "",
        branques: empresa.branques
          ? empresa.branques.split(",").map((b) => b.trim())
          : [],
      }));

      res.json({
        data: empresasConBranques,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    });
  });
});

app.get("/api/empreses/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Empresa WHERE id_empresa = ? AND actiu = TRUE";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error al obtenir empresa" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Empresa no trobada" });
    }

    const empresa = results[0];

    const empresaDetallada = {
      id: empresa.id_empresa,
      nom: empresa.nom_empresa,
      adreca: empresa.adreca,
      telefon: empresa.telefon,
      web: empresa.web,
      email: empresa.email,
      sens_div_func: empresa.sens_div_func,
      idoneitat: empresa.idoneitat,
      historial_incidents: empresa.historial_incidents,
      comentaris_generals: empresa.comentaris_generals,
      branques: empresa.branques
        ? empresa.branques.split(",").map((b) => b.trim())
        : [],
      actiu: empresa.actiu,
    };

    res.json(empresaDetallada);
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
