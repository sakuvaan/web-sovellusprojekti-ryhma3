import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../components/AuthContext";
import "../css/GroupPage.css";

const API_URL = "http://localhost:5050";

const GroupPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [group, setGroup] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinRequestPending, setJoinRequestPending] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const [groupMovies, setGroupMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchTimeout = useRef(null);

    const handleSearch = (query) => {
    setSearchQuery(query);

    if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
    }

    if (!query) {
        setSearchResults([]);
        return;
    }

    searchTimeout.current = setTimeout(async () => {
        setSearchLoading(true);
        try {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US`,
            {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY`,
                "Content-Type": "application/json",
            },
            }
        );
        if (!res.ok) throw new Error("Failed to fetch search results");
        const data = await res.json();
        setSearchResults(data.results || []);
        } catch (err) {
        console.error(err);
        } finally {
        setSearchLoading(false);
        }
    }, 500);
    };

  const handleAddMovie = async (tmdb_id) => {
    try {
        const res = await fetch(`${API_URL}/api/groups/${id}/movies`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdb_id }),
        });
        if (!res.ok) throw new Error("Failed to add movie");
        const newMovie = await res.json();
        fetchGroup();
        setSearchQuery(""); 
        setSearchResults([]);
    } catch (err) {
        alert(err.message);
    }
  };

  const fetchGroup = async () => {
    try {
      const res = await fetch(`${API_URL}/api/groups/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setGroup(data);
      fetchGroupMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const fetchGroupMovies = async (groupData) => {
  const groupToUse = groupData || group;
  if (!groupToUse) return;
  setMoviesLoading(true);
  try {
    const movies = groupToUse.movies || [];
    const moviesWithDetails = await Promise.all(
      movies.map(async (movie) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.tmdb_id}?language=en-US`,
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) throw new Error("Failed to fetch TMDB movie");
          const data = await res.json();
          return {
            id: movie.id,
            tmdb_id: movie.tmdb_id,
            title: data.title,
            banner: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
          };
        } catch (err) {
          console.error("TMDB fetch error:", err);
          return {
            id: movie.id,
            tmdb_id: movie.tmdb_id,
            title: "Unknown",
            banner: "https://via.placeholder.com/200x300?text=No+Image",
          };
        }
      })
    );
    setGroupMovies(moviesWithDetails);
  } catch (err) {
    console.error(err);
  } finally {
    setMoviesLoading(false);
  }
};

  useEffect(() => {
    fetchGroup();
  }, [id]);

  useEffect(() => {
    const fetchJoinRequest = async () => {
      if (!group || !user) return;
      const isMember = group.members?.some((m) => m.id === user.id);
      if (isMember) {
        setJoinRequestPending(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/groups/${id}/join-requests`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch join request");
        const data = await res.json();
        setJoinRequestPending(data.length > 0 && data[0].status === "pending");
      } catch (err) {
        console.error(err);
      }
    };
    fetchJoinRequest();
  }, [group, user, id]);

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/groups/${id}/join-requests/pending`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pending requests");
      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (userIdToApprove) => {
    try {
      const res = await fetch(`${API_URL}/api/groups/${id}/join-requests/${userIdToApprove}/approve`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to approve request");
      await fetchPendingRequests();
      await fetchGroup();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (userIdToReject) => {
    try {
      const res = await fetch(`${API_URL}/api/groups/${id}/join-requests/${userIdToReject}/reject`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reject request");
      await fetchPendingRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const res = await fetch(`${API_URL}/api/groups/${id}/join`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Failed to send join request");
      setJoinRequestPending(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const res = await fetch(`${API_URL}/api/groups/${id}/leave`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Failed to leave group");
      await fetchGroup();
      setJoinRequestPending(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      const res = await fetch(`${API_URL}/api/groups/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete group");
      alert("Group deleted successfully");
      window.location.href = "/groups";
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      const res = await fetch(`${API_URL}/api/groups/${id}/members/${memberId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to remove member");
      await fetchGroup();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading group...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>Group not found</p>;

  const isOwner = group.owner_email === user.email;
  const isMember = group.members?.some((m) => m.id === user.id);

  return (
    <div className="group-page">
      <div className="group-header">
        <h1>{group.name}</h1>

        {isOwner && (
          <div className="join-requests-container">
            <button
              className="join-requests-btn"
              onClick={() => {
                setShowRequestsDropdown(!showRequestsDropdown);
                fetchPendingRequests();
              }}
            >
              Join Requests ({pendingRequests.length})
            </button>

            {showRequestsDropdown && pendingRequests.length > 0 && (
              <div className="join-requests-dropdown">
                {pendingRequests.map((req) => (
                  <div key={req.user_id} className="join-request-item">
                    <span>{req.email}</span>
                    <button className="accept-btn" onClick={() => handleApprove(req.user_id)}>✓</button>
                    <button className="reject-btn" onClick={() => handleReject(req.user_id)}>X</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="group-header-buttons">
          {isOwner ? (
            <button className="delete-group-btn" onClick={handleDeleteGroup}>Delete Group</button>
          ) : isMember ? (
            <button className="leave-group-btn" onClick={handleLeaveGroup}>Leave Group</button>
          ) : joinRequestPending ? (
            <button className="join-group-btn pending" disabled>Pending Request</button>
          ) : (
            <button className="join-group-btn" onClick={handleJoinGroup}>Join Group</button>
          )}
        </div>
      </div>

      <p className="group-owner"><strong>Owner:</strong> {group.owner_email}</p>

      <div className="group-members">
        <h3>Members</h3>
        <div className="members-grid">
          {group.members?.map((member) => (
            <div key={member.id} className="member-card">
              <span className="member-email">{member.email}</span>
              <span className="member-role">{member.role}</span>
              {isOwner && member.role !== "Owner" && (
                <button className="remove-member-btn" onClick={() => handleRemoveMember(member.id)}>Remove</button>
              )}
            </div>
          ))}
        </div>
      </div>

        {isMember && (
        <div className="movie-search">
        <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
        />
        {searchLoading && <p>Searching...</p>}
        {searchResults.length > 0 && (
            <ul className="search-dropdown">
            {searchResults.map((movie) => (
                <li key={movie.id} onClick={() => handleAddMovie(movie.id)}>
                {movie.title} ({movie.release_date?.slice(0, 4) || "N/A"})
                </li>
            ))}
            </ul>
        )}
        </div>
        )}

        <div className="group-movies">
        <h3>Group Movies</h3>
        {moviesLoading ? (
            <p>Loading movies...</p>
        ) : groupMovies.length === 0 ? (
            <p>No movies added</p>
        ) : (
            <div className="movies-grid">
            {groupMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                <div className="movie-banner">
                    <img src={movie.banner} alt={movie.title} />
                </div>
                <div className="movie-title">{movie.title}</div>
                {isMember && (
                <button
                    className="remove-member-btn"
                    onClick={async () => {
                    if (!window.confirm(`Remove "${movie.title}" from group?`)) return;
                    try {
                        const res = await fetch(`${API_URL}/api/groups/${id}/movies/${movie.id}`, {
                        method: "DELETE",
                        credentials: "include",
                        });
                        if (!res.ok) throw new Error("Failed to remove movie");
                        fetchGroup();
                    } catch (err) {
                        alert(err.message);
                    }
                    }}>
                    Remove
                </button>
                )}
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
  );
};

export default GroupPage;
