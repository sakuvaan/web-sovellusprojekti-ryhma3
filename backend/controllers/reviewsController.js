import { pool } from "../config/db.js";

export async function createReview(req, res) {
    const { tmdb_id, text, rating } = req.body;
    const userId = req.userId;

    if (!tmdb_id || !text || !rating) {
        return res.status(400).json({ message: "All fields are required." });
    }
    const existing = await pool.query(
        "SELECT id FROM reviews WHERE user_id = $1 AND tmdb_id = $2",
        [userId, tmdb_id]
    );

    if (existing.rows.length > 0) {
        return res.status(400).json({ message: "You have already reviewed this movie." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO reviews (user_id, tmdb_id, rating, text)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, tmdb_id, rating, text, created_at`,
            [userId, tmdb_id, rating, text]
        );

        const userResult = await pool.query(
            "SELECT email FROM users WHERE id = $1",
            [userId]
        );

        res.status(201).json({
            ...result.rows[0],
            email: userResult.rows[0].email,
        });

    } catch (error) {
        console.error("createReview error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getReviewsForMovie(req, res) {
    const tmdb_id = req.params.tmdb_id;

    try {
        const result = await pool.query(
            `SELECT r.id, r.text, r.rating, r.created_at, u.email
             FROM reviews r
             JOIN users u ON u.id = r.user_id
             WHERE tmdb_id = $1
             ORDER BY r.created_at DESC`,
            [tmdb_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("getReviewsForMovie error:", error);
        res.status(500).json({ message: "Server error" });
    }
}
export async function deleteReview(req, res) {
    const reviewId = req.params.id;
    const userId = req.userId;

    try {
        const check = await pool.query(
            "SELECT user_id FROM reviews WHERE id = $1",
            [reviewId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (check.rows[0].user_id !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await pool.query(
            "DELETE FROM reviews WHERE id = $1",
            [reviewId]
        );

        return res.json({ success: true });

    } catch (error) {
        console.error("deleteReview error:", error);
        res.status(500).json({ message: "Server error" });
    }
}


