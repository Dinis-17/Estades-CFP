import React, { useState } from "react";
import "./Home.scss";
import { Search, SlidersHorizontal } from "lucide-react";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const results = [
    {
      id: 1,
      title: "Andorra Telecom",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
      tags: ["TSSIX", "TSDP"],
    },
    {
      id: 2,
      title: "Caldea",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
      tags: ["TSGA"],
    },
  ];

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
          <p className="results-count">{results.length} resultats</p>
        </div>

        <div className="results-list">
          {results.map((result) => (
            <div key={result.id} className="result-card">
              <div className="result-header">
                <h3 className="result-title">{result.title}</h3>
                <div className="result-tags">
                  {result.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`tag tag-${tag.toLowerCase()}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="result-description">{result.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
