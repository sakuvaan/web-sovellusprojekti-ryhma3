import { pool } from "../config/db.js";

export async function createFavorite(req, res) {
  const { name } = req.body;
  const userId = req.userId;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO favorites (user_id, name) VALUES ($1, $2) RETURNING *",
      [userId, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createFavorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getMyFavorites(req, res) {
  const userId = req.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getMyFavorites error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function addMovieToFavorite(req, res) {
  const userId = req.userId;
  const favoriteId = req.params.id;
  const { tmdb_id } = req.body;

  if (!tmdb_id) {
    return res.status(400).json({ message: "tmdb_id is required" });
  }

  try {
    const favResult = await pool.query(
      "SELECT user_id FROM favorites WHERE id = $1",
      [favoriteId]
    );

    if (favResult.rows.length === 0) {
      return res.status(404).json({ message: "Favorite list not found" });
    }

    if (favResult.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Not your list" });
    }

    const duplicateCheck = await pool.query(
      "SELECT id FROM favorite_movies WHERE favorite_id = $1 AND tmdb_id = $2",
      [favoriteId, tmdb_id]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ message: "Movie already in this list" });
    }

    const result = await pool.query(
      "INSERT INTO favorite_movies (favorite_id, tmdb_id) VALUES ($1, $2) RETURNING *",
      [favoriteId, tmdb_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("addMovieToFavorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getFavoriteWithMovies(req, res) {
  const favoriteId = req.params.id;

  try {
    const favResult = await pool.query(
      `SELECT f.id, f.name, f.created_at, u.email AS owner_email
       FROM favorites f
       JOIN users u ON u.id = f.user_id
       WHERE f.id = $1`,
      [favoriteId]
    );

    if (favResult.rows.length === 0) {
      return res.status(404).json({ message: "Favorite list not found" });
    }

    const moviesResult = await pool.query(
      "SELECT id, tmdb_id, added_at FROM favorite_movies WHERE favorite_id = $1",
      [favoriteId]
    );

    res.json({
      favorite: favResult.rows[0],
      movies: moviesResult.rows,
    });
  } catch (err) {
    console.error("getFavoriteWithMovies error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getAllFavorites(req, res) {
  try {
    const result = await pool.query(
      `SELECT f.id, f.name, f.created_at, u.email AS owner_email
       FROM favorites f
       JOIN users u ON u.id = f.user_id
       ORDER BY f.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getAllFavorites error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteFavorite(req, res) {
  const userId = req.userId;
  const favoriteId = req.params.id;

  try {
    const favResult = await pool.query(
      "SELECT user_id FROM favorites WHERE id = $1",
      [favoriteId]
    );

    if (favResult.rows.length === 0) {
      return res.status(404).json({ message: "Favorite list not found" });
    }

    if (favResult.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Not your list" });
    }

    await pool.query(
      "DELETE FROM favorite_movies WHERE favorite_id = $1",
      [favoriteId]
    );

    await pool.query("DELETE FROM favorites WHERE id = $1", [favoriteId]);

    res.json({ message: "Favorite list deleted" });
  } catch (err) {
    console.error("deleteFavorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteMovieFromFavorite(req, res) {
  const userId = req.userId;
  const movieId = req.params.movieId;

  try {
    const result = await pool.query(
      `SELECT f.user_id
       FROM favorite_movies fm
       JOIN favorites f ON fm.favorite_id = f.id
       WHERE fm.id = $1`,
      [movieId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found in favorites" });
    }

    if (result.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Not your list" });
    }

    await pool.query("DELETE FROM favorite_movies WHERE id = $1", [movieId]);

    res.json({ message: "Movie removed from favorite list" });
  } catch (err) {
    console.error("deleteMovieFromFavorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

