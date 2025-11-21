/*import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const Reviews = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => setMovie(data));
    }, [id]);

    if (!movie) return <p>Loading...</p>;

    return (
        <div>
            <h1>{movie.title}</h1>

            {movie.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                />
            )}

            <p>{movie.overview}</p>

            {user ? (
                <div>
                    <h2>Write a Review</h2>*/
                    {/* Review form goes here */}
/*                </div>
            ) : (
                <p>You must be logged in to write a review.</p>
            )}
        </div>
    );
};

export default Reviews;*/


import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const Reviews = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [movie, setMovie] = useState(null);

    // Local reviews if you don't yet have a backend:
    const [reviews, setReviews] = useState(() => {
        const saved = localStorage.getItem(`reviews_${id}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [reviewText, setReviewText] = useState("");
    const [score, setScore] = useState("");

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => setMovie(data));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) return alert("You must be logged in to leave a review");

        const newReview = {
            email: user.email,
            text: reviewText,
            score,
            createdAt: new Date().toISOString()
        };

        const updated = [...reviews, newReview];
        setReviews(updated);
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));

        setReviewText("");
        setScore("");
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

            {/* ⭐ Leave Review (only if logged in) */}
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
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            placeholder="Score (1–10)"
                            min="1"
                            max="10"
                            required
                        />
                        <br />

                        <button type="submit">Submit Review</button>
                    </form>
                </div>
            ) : (
                <p><strong>You must be logged in to leave a review.</strong></p>
            )}

            {/* ⭐ Show Reviews */}
            <div style={{ marginTop: "2rem" }}>
                <h2>User Reviews</h2>
                {reviews.length === 0 && <p>No reviews yet.</p>}

                {reviews.map((r, i) => (
                    <div key={i} style={{ borderTop: "1px solid #ccc", padding: "10px 0" }}>
                        <p><strong>{r.email}</strong> — Score: {r.score}/10</p>
                        <p>{r.text}</p>
                        <small>{new Date(r.createdAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;