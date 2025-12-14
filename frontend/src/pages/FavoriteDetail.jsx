import { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/NowAiring.css";
import "../css/FavoriteDetail.css";
import { AuthContext } from "../components/AuthContext";

const API_URL = "http://localhost:5050";

const TMDB_OPTIONS = {
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY",
    "Content-Type": "application/json",
  },
};

const FavoriteDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [favorite, setFavorite] = useState(null);
  const [movies, setMovies] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [error, setError] = useState("");

  const [showPicker, setShowPicker] = useState(false);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);  

  const searchRef = useRef(null);

  const searchMovies = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}&language=en-US`,
        TMDB_OPTIONS
      );

      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };
  
  useEffect(() => {
    fetch(`${API_URL}/api/favorites/${id}`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error");
        }
        return data;
      })
      .then((data) => {
        setFavorite(data.favorite);
        setMovies(data.movies);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchMovies(searchQuery);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!movies || movies.length === 0) {
      setMovieDetails([]);
      return;
    }

    const fetchDetails = async () => {
      try {
        const promises = movies.map((m) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${m.tmdb_id}?language=en-US`,
            TMDB_OPTIONS
          ).then((res) => res.json())
        );

        const results = await Promise.all(promises);

        const merged = results.map((details, index) => ({
          ...details,
          favoriteMovieId: movies[index].id,
        }));

        setMovieDetails(merged);
      } catch (err) {
        console.error("TMDB fetch error:", err);
      }
    };

    fetchDetails();
  }, [movies]);

  const handleDeleteMovie = async (favoriteMovieId) => {
    if (!user) {
      alert("You must be signed in to remove movies.");
      return;
    }

    if (!window.confirm("Remove this movie from the list?")) return;

    try {
      const res = await fetch(
        `${API_URL}/api/favorites/movies/${favoriteMovieId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMovieDetails((prev) =>
          prev.filter((m) => m.favoriteMovieId !== favoriteMovieId)
        );
        setMovies((prev) => prev.filter((m) => m.id !== favoriteMovieId));
      } else {
        alert(data.message || "Error removing movie");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openNowPlayingPicker = async () => {
    setShowPicker(true);
    setPickerError("");
    if (nowPlaying.length > 0) return;

    setPickerLoading(true);
    try {
      const res = await fetch(
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&region=FI&page=1",
        TMDB_OPTIONS
      );
      const data = await res.json();
      if (res.ok) {
        setNowPlaying(data.results || []);
      } else {
        setPickerError(data.status_message || "Error loading now playing");
      }
    } catch (err) {
      setPickerError(err.message);
    } finally {
      setPickerLoading(false);
    }
  };

  const handleAddMovie = async (movie) => {
    if (!user) {
      alert("You must be signed in to add movies.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/favorites/${id}/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tmdb_id: movie.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setMovies((prev) => [...prev, data]);

        setSearchQuery("");
        setSearchResults([]);
      } else {
        if (data.message === "Movie already in this list") {
          alert("This movie is already in your list.");
        } else {
          alert(data.message || "Error adding movie");
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!favorite) return <p>Loading...</p>;

  const isOwner = user && user.email === favorite.owner_email;

  return (
    <div id="nowAiring" className="favorite-detail">
      <h1>{favorite.name}</h1>
      <p>Owner: {favorite.owner_email}</p>

      {isOwner && (
        <button
          type="button"
          onClick={openNowPlayingPicker}
          className="fav-btn fav-btn-primary favorite-add-button"
        >
          Add movie from Now Playing
        </button>
      )}

      {isOwner && (
      <div className="favorite-search" ref={searchRef}>
        <input
          type="text"
          placeholder="Search any movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchLoading && <p>Searching...</p>}

        {!searchLoading && searchResults.length > 0 && (
          <div className="favorite-search-dropdown">
            {searchResults.slice(0, 6).map((movie) => {
              const alreadyInList = movies.some(
                (m) => m.tmdb_id === movie.id
              );

              return (
                <div key={movie.id} className="search-result-item">
                  <span>{movie.title}</span>
                  <button
                    type="button"
                    disabled={alreadyInList}
                    onClick={() => handleAddMovie(movie)}
                    className={
                      "fav-btn fav-btn-primary" +
                      (alreadyInList ? " favorite-btn-added" : "")
                    }
                  >
                    {alreadyInList ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}
      {showPicker && (
        <div className="favorite-picker">
          <h4>Now Playing movies</h4>
          {pickerLoading && <p>Loading...</p>}
          {pickerError && <p>{pickerError}</p>}
          {!pickerLoading && !pickerError && nowPlaying.length === 0 && (
            <p>No movies found.</p>
          )}

          <div className="movie-grid">
            {nowPlaying.map((movie) => {
              const alreadyInList = movies.some((m) => m.tmdb_id === movie.id);

              return (
                <div key={movie.id} className="movie-item">
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                    />
                  )}
                  <span>{movie.title}</span>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => !alreadyInList && handleAddMovie(movie)}
                      disabled={alreadyInList}
                      className={
                        "fav-btn fav-btn-primary favorite-picker-add-button" +
                        (alreadyInList ? " favorite-btn-added" : "")
                      }
                    >
                      {alreadyInList ? "Added" : "Add"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="fav-btn fav-btn-secondary favorite-picker-close-button"
          >
            Close
          </button>
        </div>
      )}

      <h3>Movies in this list</h3>
      {movieDetails.length === 0 && <p>No movies in this list yet.</p>}

      <div className="movie-grid">
        {movieDetails.map((movie) => (
          <div key={movie.favoriteMovieId} className="movie-item">
            <Link to={`/reviews/${movie.id}`} className="movie-link">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                />
              )}
              <span>{movie.title}</span>
            </Link>
            {isOwner && (
              <button
                type="button"
                onClick={() => handleDeleteMovie(movie.favoriteMovieId)}
                className="fav-btn fav-btn-danger favorite-remove-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteDetail;
