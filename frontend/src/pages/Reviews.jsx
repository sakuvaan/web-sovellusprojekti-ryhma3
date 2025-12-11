import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import '../css/Reviews.css';

const API_URL = "http://localhost:5050";

const Reviews = () => {
    const { id } = useParams(); // movie id
    const { user } = useContext(AuthContext);

    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState("");

    const averageRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
        : null;

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => setMovie(data));
    }, [id]);

    useEffect(() => {
        fetch(`${API_URL}/api/reviews/${id}`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((err) => console.error(err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in to leave a review");

        try {
            const res = await fetch(`${API_URL}/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    tmdb_id: id,
                    text: reviewText,
                    rating: rating
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setReviews((prev) => [data, ...prev]);
                setReviewText("");
                setRating("");
            } else {
                alert(data.message || "Error submitting review");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm("Delete this review?")) return;

        try {
            const res = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                setReviews(prev => prev.filter(r => r.id !== reviewId));
            } else {
                alert(data.message || "Error deleting review");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    if (!movie) return <p>Loading...</p>;

    return (
        <div>
            <h1>{movie.title}</h1>

            <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
            />
            {averageRating && (
                <div style={{ margin: "1rem 0", fontSize: "1.2rem" }}>
                    <strong>Average User Rating: </strong>
                    <span className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= Math.round(averageRating) ? "filled" : ""}`}
                            >
                                ★
                            </span>
                        ))}
                    </span>
                </div>
            )}
            <p>{movie.overview}</p>
            {user ? (
                <div style={{ marginTop: "2rem" }}>
                    <h2>Leave a Review</h2>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review..."
                            required
                        />
                        <br />
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= rating ? "filled" : ""}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <br />
                        <button type="submit">Submit Review</button>
                    </form>
                </div>
            ) : (
                <p><strong>You must be logged in to leave a review.</strong></p>
            )}

            <div style={{ marginTop: "2rem" }}>
                <h2>User Reviews</h2>

                {reviews.length === 0 && <p>No reviews yet.</p>}

                {reviews.map((r, i) => (
                    <div key={i} style={{ borderTop: "1px solid #ccc", padding: "10px 0" }}>
                        <p>
                            <strong>{r.email}</strong> —
                            <span className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${star <= r.rating ? "filled" : ""}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </span>
                        </p>
                        <p>{r.text}</p>
                        <small>{new Date(r.created_at).toLocaleString()}</small>

                        {user && r.email === user.email && (
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(r.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
