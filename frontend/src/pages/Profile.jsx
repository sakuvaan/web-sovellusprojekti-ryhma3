import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import "../css/Profile.css";

const API_URL = "http://localhost:5050";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/favorites/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error(err));
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setFavorites((prev) => [data, ...prev]);
        setName("");
        setMessage("List created!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Error creating list");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage(err.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteList = async (id) => {
    if (!user) return;

    if (!window.confirm("Delete this list?")) return;

    try {
      const res = await fetch(`${API_URL}/api/favorites/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== id));
        setMessage("List deleted");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Error deleting list");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage(err.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCopyLink = async (shareUrl) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("Share link copied!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Could not copy link.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!user) {
    return <p>You must sign in to view your profile.</p>;
  }

  return (
    <div className="profile">
      <h1>My favorite lists</h1>
      <p>Logged in as: {user.email}</p>

      <form onSubmit={handleCreate} className="profile-form">
        <input
          type="text"
          placeholder="List name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="profile-input"
        />
        <button
          type="submit"
          className="fav-btn fav-btn-primary profile-create-button"
        >
          Create list
        </button>
      </form>

      {message && <div className="profile-message">{message}</div>}

      <h2>Your lists</h2>
      {favorites.length === 0 && <p>No lists yet.</p>}

      <ul className="profile-list">
        {favorites.map((fav) => {
          const shareUrl = `${window.location.origin}/favorites/${fav.id}`;

          return (
            <li key={fav.id} className="profile-list-item">
              <strong>{fav.name}</strong>

              {}
              <button
                className="fav-btn fav-btn-primary"
                onClick={() => (window.location.href = `/favorites/${fav.id}`)}
              >
                Open
              </button>

              {}
              <button
                className="fav-btn fav-btn-secondary"
                onClick={() => handleCopyLink(shareUrl)}
              >
                Share
              </button>

              {}
              <button
                className="fav-btn fav-btn-danger"
                onClick={() => handleDeleteList(fav.id)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Profile;
