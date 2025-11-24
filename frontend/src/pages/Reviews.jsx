import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const API_URL = "http://localhost:5050";

const Reviews = () => {
    const { id } = useParams(); //movie id
    const { user } = useContext(AuthContext);

    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState("");

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
        fetch(`${API_URL}/api/reviews/${id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
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
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
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
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
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

                        <input
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            placeholder="1–5"
                            min="1"
                            max="5"
                            required
                        />
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
            <strong>{r.email}</strong> — Rating: {r.rating}/5
        </p>
        <p>{r.text}</p>
        <small>{new Date(r.created_at).toLocaleString()}</small>

        {/* SHOW DELETE BUTTON IF USER OWNS REVIEW */}
        {user && r.email === user.email && (
            <button
                style={{ marginTop: "5px", color: "red" }}
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