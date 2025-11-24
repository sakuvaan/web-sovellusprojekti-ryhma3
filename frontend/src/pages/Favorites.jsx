import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Favorites.css";

const API_URL = "http://localhost:5050";

const Favorites = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/favorites`)
      .then((res) => res.json())
      .then((data) => setLists(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="favorites">
      <h1>Lists made by people</h1>
      {lists.length === 0 && <p>No lists yet.</p>}

      <ul className="favorites-list">
        {lists.map((fav) => (
          <li key={fav.id} className="favorites-list-item">
            <strong>{fav.name}</strong>{" "}
            <span>by {fav.owner_email}</span>{" "}
            <Link
              to={`/favorites/${fav.id}`}
              className="fav-btn fav-btn-primary favorites-view-button"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
