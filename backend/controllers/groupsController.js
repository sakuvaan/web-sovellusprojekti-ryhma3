import { pool } from "../config/db.js";

export async function createGroup(req, res) {
    const { name } = req.body;
    const userId = req.userId;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const result = await pool.query(
        "INSERT INTO groups (owner_id, name) VALUES ($1, $2) RETURNING *",
        [userId, name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("createGroup error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getGroups(req, res) {
  const userId = req.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM group_members WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getGroups error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateGroups(req, res) {
  try {
    const result = await pool.query(
      `INSERT INTO group_members (group_id, user_id, role)
       SELECT id AS group_id,
       owner_id AS user_id,
       'Owner' AS role
       FROM groups`
    );
    res.status(200).json({ message: "Groups updated successfully", rows: result.rows });
  } catch (err) {
    console.error("updateGroups error:", err);
    res.status(500).json({ message: "Server error"});
  }
}

export async function getGroupMembers(req, res) {
  const userId = req.userId;
  const groupId = req.groupId;

  try {
    const result = await pool.query(
      "SELECT * FROM group_members WHERE group_id = $1",
      [groupId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getGroupMembers error:", err);
    res.status(500).json({ message: "Server error"});
  }
}