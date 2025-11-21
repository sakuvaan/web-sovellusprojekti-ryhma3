import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "../css/Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link className={location.pathname === "/" ? "active" : ""} to="/">Home</Link>
        <Link className={location.pathname === "/now-airing" ? "active" : ""} to="/now-airing">Now Airing</Link>
        <Link className={location.pathname === "/reviews" ? "active" : ""} to="/reviews">Reviews</Link>
        <Link className={location.pathname === "/groups" ? "active" : ""} to="/groups">Groups</Link>
        <Link className={location.pathname === "/favorites" ? "active" : ""} to="/favorites">Favorites</Link>
      </nav>

      <div className="search">
        <input type="text" placeholder="Search..." />
      </div>

      <div className="auth-buttons">

        {user ? (
          <div className="account-wrapper">

            <button className="account-btn" onClick={toggleDropdown}>
              Account ▾
            </button>

            {isDropdownOpen && (
              <div className="account-dropdown">

                <button 
                className="dropdown-item"
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/profile");
                }}
                >
                  Profile
                </button>
                
                <Link to="/settings"><button className="dropdown-item">Settings</button></Link>
                <button className="dropdown-item logout" onClick={logout}>Logout</button>
              </div>
            )}

          </div>
        ) : (
          <>
            <Link to="/signin"><button className="signin">Sign in</button></Link>
            <Link to="/signup"><button className="signup">Sign up</button></Link>
          </>
        )}

      </div>
    </header>
  );
};

export default Header;