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

export async function getMostPopularGroups(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        COUNT(gm.user_id)::int AS members
      FROM groups g
      JOIN group_members gm ON gm.group_id = g.id
      GROUP BY g.id, g.name
      ORDER BY members DESC
      LIMIT 5
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getMostPopularGroups error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
