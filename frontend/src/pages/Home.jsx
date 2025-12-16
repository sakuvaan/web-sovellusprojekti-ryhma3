import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const API_URL = "https://backend-umci.onrender.com";
const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY";
const TMDB_IMG = "https://image.tmdb.org/t/p/w200";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [favoriteLists, setFavoriteLists] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  const [popularGroups, setPopularGroups] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/home/latest-reviews`);
        const data = await res.json();

        if (!data.success) {
          console.error("Review fetch failed");
          setLoadingReviews(false);
          return;
        }

        const reviews = data.data;

        const detailedReviews = await Promise.all(
          reviews.map(async (review) => {
            try {
              const tmdbRes = await fetch(
                `https://api.themoviedb.org/3/movie/${review.tmdb_id}?language=en-US`,
                {
                  headers: {
                    Authorization: `Bearer ${TMDB_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              const movieData = await tmdbRes.json();

              return {
                ...review,
                movieTitle: movieData.title,
                posterPath: movieData.poster_path,
              };
            } catch (err) {
              console.error("TMDB fetch error:", err);
              return { ...review, movieTitle: "Unknown", posterPath: null };
            }
          })
        );

        setReviews(detailedReviews);
      } catch (err) {
        console.error("Latest review fetch error:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_URL}/api/favorites`);
        const data = await res.json();

        const latestFive = data.slice(-5).reverse();
        setFavoriteLists(latestFive);
      } catch (err) {
        console.error("Favorite fetch error:", err);
      } finally {
        setLoadingFavorites(false);
      }
    };

    const fetchPopularGroups = async () => {
      try {
        const res = await fetch(`${API_URL}/api/home/popular`);
        const data = await res.json();
        setPopularGroups(data);
      } catch (err) {
        console.error("Popular groups fetch error:", err);
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchReviews();
    fetchFavorites();
    fetchPopularGroups();
  }, []);

  return (
    <div className="home-container">
      <div className="recent-reviews">
        <h2>Recent Reviews</h2>
        {loadingReviews ? <p>Loading reviews...</p> : reviews.map((r) => (
          <div key={r.id} className="review-card">
            <img
              src={r.posterPath ? `${TMDB_IMG}${r.posterPath}` : "/placeholder_poster.jpg"}
              alt={r.movieTitle}
              className="review-poster"
            />
            <div className="review-content">
              <h3>
                <Link to={`/reviews/${r.tmdb_id}`}>{r.movieTitle}</Link>
              </h3>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <span key={star} className={`star ${star <= r.rating ? "filled" : ""}`}>★</span>
                ))}
              </div>
              <p className="review-text">{r.text}</p>
              <small className="review-meta">{r.email} — {new Date(r.created_at).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar">
      <div className="sidebar-section">
        <h2>Most Popular Groups</h2>

        {loadingPopular ? (
          <p>Loading groups...</p>
        ) : (
          popularGroups.map(group => (
            <div key={group.id} className="favorite-card">
              <div className="favorite-info">
                <p className="favorite-name">{group.name}</p>
                <small className="favorite-author">
                  {group.members} members
                </small>
              </div>

              <Link to={`/groups/${group.id}`}>
                <button className="favorite-open-btn">Open</button>
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-section">
        <h2>Discover Favorites</h2>

        {loadingFavorites ? (
          <p>Loading favorites...</p>
        ) : (
          favoriteLists.map(f => (
            <div key={f.id} className="favorite-card">
              <div className="favorite-info">
                <p className="favorite-name">{f.name}</p>
                <small className="favorite-author">by {f.owner_email}</small>
              </div>

              <Link to={`/favorites/${f.id}`}>
                <button className="favorite-open-btn">Open</button>
              </Link>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default Home;
