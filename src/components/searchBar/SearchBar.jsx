import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import "./SearchBar.scss";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar...",
}) => {
  return (
    <div className="search-section">
      <div className="search-bar">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="filter-button">
          <SlidersHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
