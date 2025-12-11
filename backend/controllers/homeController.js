import { pool } from "../config/db.js";

export async function getLatestReviews(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT 
        reviews.id,
        reviews.tmdb_id,
        reviews.user_id,
        reviews.rating,
        reviews.text,
        reviews.created_at,
        users.email
      FROM reviews
      JOIN users ON users.id = reviews.user_id
      ORDER BY reviews.id DESC
      LIMIT 5
      `
    );

    return res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {
    console.error("Error fetching latest reviews:", err);
    return res.status(500).json({
      success: false,
      message: "Server error fetching latest reviews",
    });
  }
}
