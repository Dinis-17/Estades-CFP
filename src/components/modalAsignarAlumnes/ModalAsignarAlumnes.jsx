import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./ModalAsignarAlumnes.scss";

const ModalAssignarAlumne = ({
  isOpen,
  onClose,
  empresaId,
  onAlumneAssignat,
}) => {
  const [alumnes, setAlumnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id_alumne: "",
    curs: "",
    especialitat: "",
    dataInici: "",
    dataFi: "",
    criteris_especifics: "",
    comentaris: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchAlumnes();
    }
  }, [isOpen]);

  const fetchAlumnes = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/alumnes");

      if (!response.ok) {
        throw new Error("Error al carregar alumnes");
      }

      const data = await response.json();
      setAlumnes(data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("No s'han pogut carregar els alumnes");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id_alumne ||
      !formData.curs ||
      !formData.dataInici ||
      !formData.dataFi
    ) {
      setError("Si us plau, omple tots els camps obligatoris");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/colaboracions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_empresa: empresaId,
          id_alumne: parseInt(formData.id_alumne),
          curs: formData.curs,
          especialitat: formData.especialitat,
          dataInici: formData.dataInici,
          dataFi: formData.dataFi,
          criteris_especifics: formData.criteris_especifics,
          comentaris: formData.comentaris,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al assignar alumne");
      }

      const result = await response.json();

      setFormData({
        id_alumne: "",
        curs: "",
        especialitat: "",
        dataInici: "",
        dataFi: "",
        criteris_especifics: "",
        comentaris: "",
      });

      if (onAlumneAssignat) {
        onAlumneAssignat(result);
      }

      onClose();
    } catch (err) {
      console.error("Error:", err);
      setError("No s'ha pogut assignar l'alumne");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Assignar Alumne</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="id_alumne">Alumne *</label>
            <select
              id="id_alumne"
              name="id_alumne"
              value={formData.id_alumne}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Selecciona un alumne</option>
              {alumnes.map((alumne) => (
                <option key={alumne.id} value={alumne.id}>
                  {alumne.nom} {alumne.cognom1} {alumne.cognom2}
                </option>
              ))}
            </select>
          </div>

          {/* Curs */}
          <div className="form-group">
            <label htmlFor="curs">Curs *</label>
            <input
              type="text"
              id="curs"
              name="curs"
              placeholder="Ex: 2025-2026"
              value={formData.curs}
              onChange={handleChange}
              required
            />
          </div>

          {/* Especialitat */}
          <div className="form-group">
            <label htmlFor="especialitat">Especialitat</label>
            <input
              type="text"
              id="especialitat"
              name="especialitat"
              placeholder="Ex: TSDP, TSSIX"
              value={formData.especialitat}
              onChange={handleChange}
            />
          </div>

          {/* Dates */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dataInici">Data Inici *</label>
              <input
                type="date"
                id="dataInici"
                name="dataInici"
                value={formData.dataInici}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataFi">Data Fi *</label>
              <input
                type="date"
                id="dataFi"
                name="dataFi"
                value={formData.dataFi}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="criteris_especifics">Criteris Específics</label>
            <textarea
              id="criteris_especifics"
              name="criteris_especifics"
              placeholder="Descripció dels criteris específics..."
              value={formData.criteris_especifics}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Comentaris */}
          <div className="form-group">
            <label htmlFor="comentaris">Comentaris</label>
            <textarea
              id="comentaris"
              name="comentaris"
              placeholder="Comentaris addicionals..."
              value={formData.comentaris}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel·lar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Assignant..." : "Assignar Alumne"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAssignarAlumne;
