import React, { useState, useEffect, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import "../css/Header.css"
import { useNavigate } from 'react-router'

const YearDropdown = ({ onYearChange }) => {
  const currentYear = new Date().getFullYear()
  const startYear = 1950

  const years = []
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year)
  }

  return (
    <>
      <label htmlFor="dropdown">Release Date: </label>
      <select
        id="year"
        style={{ width: '80px' }}
        onChange={(e) => onYearChange(e.target.value)}
      >
        <option key="any" value="">Any</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </>
  )
}

const Header = () => {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleSearch = (e) => {
    if (e.key === "Enter" && e.target.value.length > 0) {
      e.preventDefault()
      navigate(
        `/search?query=${e.target.value}&year=${document.querySelector(
          "#year"
        ).value}&include_adult=${document.querySelector("#include_adult").checked}`
      )
    }
  }

  const handleYearChange = (year) => {
    const searchValue = document.querySelector("input[type='text']").value
    const includeAdult = document.querySelector("#include_adult").checked

    if (searchValue.length > 0) {
      navigate(`/search?query=${searchValue}&year=${year}&include_adult=${includeAdult}`)
    }
  }


  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

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
        <input type="text" placeholder="Search..." onKeyDown={handleSearch} />
        <YearDropdown onYearChange={handleYearChange}/>
        <label htmlFor="include_adult">Show 18+ Movies</label>
        <input type="checkbox" id="include_adult" value="include_adult"/>
      </div>

      <div className="auth-buttons">

        {user ? (
          <div className="account-wrapper">

            <button className="account-btn" onClick={toggleDropdown}>
              Account ▾
            </button>

            {isDropdownOpen && (
              <div className="account-dropdown">
                <button className="dropdown-item">Profile</button>
                <button className="dropdown-item">Settings</button>
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
  )
}

export default Header