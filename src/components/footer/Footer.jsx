import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Estades CFP</h3>
            <p className="footer-text">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione
              recusandae magni sint quasi ducimus ipsa suscipit deleniti qui ad
              animi nobis repudiandae nemo facilis, deserunt saepe. Esse dolores
              optio temporibus.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Estades CFP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
