import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Profile.css";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5050/api/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h2>{user.email}</h2>
          <p>Member since: {new Date(user.created_at).toLocaleDateString("en-GB")}</p>
        </div>
      </div>

      <div className="profile-section reviews-section">
        <h3>Reviews</h3>
        <div className="reviews-list">
          <div className="review-item">
            <img
              src="https://m.media-amazon.com/images/M/MV5BN2FkMTRkNTUtYTI0NC00ZjI4LWI5MzUtMDFmOGY0NmU2OGY1XkEyXkFqcGc@._V1_.jpg"
              alt="Movie Poster"
              className="review-poster"
            />
            <div className="review-content">
              <h4>leffan nimi</h4>
              <p className="review-stars">★★★★☆</p>
              <p className="review-text">
                arvostelu tässä
              </p>
              <p className="review-date">2025-11-18</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-section favorites-section">
        <h3>Favorites</h3>
        <div className="favorites-list">
          <img
            src="https://m.media-amazon.com/images/M/MV5BN2FkMTRkNTUtYTI0NC00ZjI4LWI5MzUtMDFmOGY0NmU2OGY1XkEyXkFqcGc@._V1_.jpg"
            alt="Movie 1"
            className="favorite-poster"
          />
          <img
            src="https://m.media-amazon.com/images/M/MV5BN2FkMTRkNTUtYTI0NC00ZjI4LWI5MzUtMDFmOGY0NmU2OGY1XkEyXkFqcGc@._V1_.jpg"
            alt="Movie 2"
            className="favorite-poster"
          />
          <img
            src="https://m.media-amazon.com/images/M/MV5BN2FkMTRkNTUtYTI0NC00ZjI4LWI5MzUtMDFmOGY0NmU2OGY1XkEyXkFqcGc@._V1_.jpg"
            alt="Movie 3"
            className="favorite-poster"
          />
          <img
            src="https://m.media-amazon.com/images/M/MV5BN2FkMTRkNTUtYTI0NC00ZjI4LWI5MzUtMDFmOGY0NmU2OGY1XkEyXkFqcGc@._V1_.jpg"
            alt="Movie 4"
            className="favorite-poster"
          />
          <img
            src="https://m.media-amazon.com/images/M/MV5BN2FkMTRkNTUtYTI0NC00ZjI4LWI5MzUtMDFmOGY0NmU2OGY1XkEyXkFqcGc@._V1_.jpg"
            alt="Movie 5"
            className="favorite-poster"
          />
        </div>
      </div>

      <div className="profile-section groups-section">
        <h3>Groups</h3>
        <ul>
          <li className="group-item">
            eka grouppi <span className="group-members">(12 members)</span>
          </li>
          <li className="group-item">
            toka grouppi <span className="group-members">(5 members)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;