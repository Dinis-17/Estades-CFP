import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import { Search, SlidersHorizontal } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/empreses");

      if (!response.ok) {
        throw new Error("Error al cargar empreses");
      }

      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("No s'han pogut carregar les empreses.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((result) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      result.title.toLowerCase().includes(searchLower) ||
      result.description.toLowerCase().includes(searchLower) ||
      result.branques.some((branca) =>
        branca.toLowerCase().includes(searchLower),
      )
    );
  });

  const handleCardClick = (id) => {
    navigate(`/empreses/${id}`);
  };

  return (
    <div className="home-container">
      <div className="search-section">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-button">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="results-section">
        <div className="results-header">
          <p className="results-count">
            {loading ? "Carregant..." : `${filteredResults.length} resultats`}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={fetchEmpresas}>Reintentar</button>
          </div>
        )}

        <div className="results-list">
          {loading ? (
            <div className="loading">Carregant empreses...</div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <div
                key={result.id}
                className="result-card"
                onClick={() => handleCardClick(result.id)}
              >
                <div className="result-header">
                  <h3 className="result-title">{result.title}</h3>
                  <div className="result-tags">
                    {result.branques.map((branca, index) => (
                      <span
                        key={index}
                        className={`tag tag-${branca.toLowerCase()}`}
                      >
                        {branca}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="result-description">{result.description}</p>
              </div>
            ))
          ) : (
            <div className="no-results">
              No s'han trobat empreses que coinsideixin amb la teva cerca.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
