import { NavLink } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">
          <NavLink to="/">Estades CFP</NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
