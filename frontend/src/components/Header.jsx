import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      {}
      <nav className="nav">
        <Link className={location.pathname === "/" ? "active" : ""} to="/">Home</Link>
        <Link className={location.pathname === "/now-airing" ? "active" : ""} to="/now-airing">Now Airing</Link>
        <Link className={location.pathname === "/reviews" ? "active" : ""} to="/reviews">Reviews</Link>
        <Link className={location.pathname === "/groups" ? "active" : ""} to="/groups">Groups</Link>
        <Link className={location.pathname === "/favorites" ? "active" : ""} to="/favorites">Favorites</Link>
        <Link className={location.pathname === "/signin" ? "active" : ""} to="/signin">login testi</Link>
        <Link className={location.pathname === "/signup" ? "active" : ""} to="/signup">signup testi</Link>
      </nav>

      {}
      <div className="search">
        <input type="text" placeholder="Search..." />
      </div>

      {}
      <div className="auth-buttons">
        <button className="signin">Sign in</button>
        <button className="signup">Sign up</button>
      </div>
    </header>
  );
};

export default Header;