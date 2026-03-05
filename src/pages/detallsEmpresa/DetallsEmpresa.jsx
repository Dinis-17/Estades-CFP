import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Plus,
} from "lucide-react";
import "./DetallsEmpresa.scss";

const DetallsEmpresa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  window.scrollTo(0, 0);

  useEffect(() => {
    const fetchEmpresaDetall = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/empreses/${id}`,
        );

        if (!response.ok) {
          throw new Error("Empresa no trobada");
        }

        const data = await response.json();
        setEmpresa(data);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No s'ha pogut carregar la informació de l'empresa.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresaDetall();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAssignarAlumne = () => {
    console.log("Assignar alumne btn");
  };

  if (loading) {
    return (
      <div className="detalls-container">
        <div className="loading">Carregant informació...</div>
      </div>
    );
  }

  if (error || !empresa) {
    return (
      <div className="detalls-container">
        <div className="error-state">
          <p>{error || "Empresa no trobada"}</p>
          <button onClick={handleBack} className="btn-back">
            Tornar enrere
          </button>
        </div>
      </div>
    );
  }

  const alumnes = [
    {
      id: 1,
      nom: "Alumne 1",
      branca: "TSDP 2",
      dataInici: "02/05/26",
      dataFi: "03/06/26",
    },
    {
      id: 2,
      nom: "Alumne 2",
      branca: "TSDP 2",
      dataInici: "02/05/26",
      dataFi: "03/06/26",
    },
    {
      id: 3,
      nom: "Alumne 3",
      branca: "TSDP 2",
      dataInici: "02/05/26",
      dataFi: "03/06/26",
    },
  ];

  return (
    <div className="detalls-container">
      <div className="detalls-header-top">
        <button onClick={handleBack} className="back-button">
          <ArrowLeft size={20} />
          <span>Tornar enrere</span>
        </button>
      </div>

      <div className="detalls-layout">
        <aside className="detalls-sidebar">
          <div className="sidebar-header">
            <h2 className="empresa-nom">{empresa.nom}</h2>
          </div>

          <div className="sidebar-info">
            <div className="info-item">
              <MapPin size={18} />
              <span>{empresa.adreca}</span>
            </div>

            <div className="info-item">
              <Phone size={18} />
              <span>{empresa.telefon}</span>
            </div>

            <div className="info-item">
              <Mail size={18} />
              <span>{empresa.email}</span>
            </div>

            {empresa.web && (
              <div className="info-item">
                <Globe size={18} />
                <a href={empresa.web} target="_blank" rel="noopener noreferrer">
                  {empresa.web}
                </a>
              </div>
            )}

            <div className="info-item status">
              <CheckCircle size={18} />
              <span>{empresa.actiu ? "Actiu" : "Inactiu"}</span>
            </div>
          </div>

          {empresa.comentaris_generals && (
            <div className="sidebar-section">
              <h3>Comentaris:</h3>
              <p className="comentaris-text">{empresa.comentaris_generals}</p>
            </div>
          )}
        </aside>

        <main className="detalls-content">
          <div className="content-header">
            <h1 className="page-title">{empresa.nom}</h1>
            <button className="btn-assignar" onClick={handleAssignarAlumne}>
              <Plus size={20} />
              Assignar Alumne
            </button>
          </div>

          <div className="alumnes-section">
            <table className="alumnes-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Branca</th>
                  <th>Data inici</th>
                  <th>Data fi</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody>
                {alumnes.length > 0 ? (
                  alumnes.map((alumne) => (
                    <tr key={alumne.id}>
                      <td>{alumne.nom}</td>
                      <td>{alumne.branca}</td>
                      <td>{alumne.dataInici}</td>
                      <td>{alumne.dataFi}</td>
                      <td>
                        <button className="btn-action">Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-alumnes">
                      No hi ha alumnes assignats a aquesta empresa
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetallsEmpresa;
