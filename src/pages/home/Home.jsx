import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmpresas(currentPage);
  }, [currentPage]);

  const fetchEmpresas = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/empreses?page=${page}&limit=${itemsPerPage}`,
      );

      if (!response.ok) {
        throw new Error("Error al cargar empreses");
      }

      const data = await response.json();

      setResults(data.data);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="home-container">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar empreses..."
      />

      <div className="results-section">
        <div className="results-header">
          <p className="results-count">
            {loading
              ? "Carregant..."
              : `${filteredResults.length} resultats de ${totalItems} (Pàgina ${currentPage}/${totalPages})`}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => fetchEmpresas(currentPage)}>
              Reintentar
            </button>
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

        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Anterior
            </button>

            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;

                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`pagination-number ${
                        currentPage === pageNumber ? "active" : ""
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="pagination-dots">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Següent →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
