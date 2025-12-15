import { pool } from "../config/db.js";

export async function createGroup(req, res) {
    const { name } = req.body;
    const userId = req.userId;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const result = await pool.query(
          "INSERT INTO groups (owner_id, name) VALUES ($1, $2) RETURNING id, name",
          [userId, name]
        );

        await pool.query(
          "INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'Owner')",
          [result.rows[0].id, userId]
        );

        res.status(201).json({
          id: result.rows[0].id,
          name: result.rows[0].name,
          members: 1,
          role: "Owner"
        });
    } catch (err) {
        console.error("createGroup error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getGroups(req, res) {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        gm.role,
        COUNT(gm2.user_id)::int AS members
      FROM group_members gm
      JOIN groups g ON g.id = gm.group_id
      JOIN group_members gm2 ON gm2.group_id = g.id
      WHERE gm.user_id = $1
      GROUP BY g.id, g.name, gm.role
      ORDER BY g.name
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getGroups error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getGroupMembers(req, res) {
  const groupId = req.params.groupId;

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

export async function getGroupDetails(req, res) {
  const groupId = req.params.groupId;

  try {
    const groupResult = await pool.query(
      `
      SELECT g.id, g.name, u.email AS owner_email
      FROM groups g
      JOIN users u ON u.id = g.owner_id
      WHERE g.id = $1
      `,
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    const group = groupResult.rows[0];

    const membersResult = await pool.query(
      `
      SELECT u.id, u.email, gm.role
      FROM group_members gm
      JOIN users u ON u.id = gm.user_id
      WHERE gm.group_id = $1
      `,
      [groupId]
    );

    group.members = membersResult.rows;

    const moviesResult = await pool.query(
      `
      SELECT id, tmdb_id, added_by
      FROM group_movies
      WHERE group_id = $1
      `,
      [groupId]
    );

    group.movies = moviesResult.rows;

    res.json(group);
  } catch (err) {
    console.error("getGroupDetails error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function joinGroup(req, res) {
  const groupId = req.params.groupId;
  const userId = req.userId;

  try {
    const exists = await pool.query(
      "SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Already a member" });
    }

    await pool.query(
      "INSERT INTO group_join_requests (group_id, user_id) VALUES ($1, $2)",
      [groupId, userId]
    );

    res.json({ message: "Sent a join request successfully" });
  } catch (err) {
    console.error("joinGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function leaveGroup(req, res) {
  const groupId = req.params.groupId;
  const userId = req.userId;

  try {
    const ownerCheck = await pool.query(
      "SELECT owner_id FROM groups WHERE id = $1",
      [groupId]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (ownerCheck.rows[0].owner_id === userId) {
      return res.status(400).json({ message: "Owner cannot leave the group" });
    }

    await pool.query(
      "DELETE FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );

    res.json({ message: "Left group successfully" });
  } catch (err) {
    console.error("leaveGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteGroup(req, res) {
  const groupId = req.params.groupId;
  const userId = req.userId;

  try {
    const groupCheck = await pool.query(
      "SELECT owner_id FROM groups WHERE id = $1",
      [groupId]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (groupCheck.rows[0].owner_id !== userId) {
      return res.status(403).json({ message: "Only owner can delete group" });
    }

    await pool.query("DELETE FROM group_members WHERE group_id = $1", [groupId]);
    await pool.query("DELETE FROM groups WHERE id = $1", [groupId]);

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("deleteGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function removeMember(req, res) {
  const groupId = req.params.groupId;
  const memberId = req.params.memberId;
  const userId = req.userId;

  try {
    const groupCheck = await pool.query(
      "SELECT owner_id FROM groups WHERE id = $1",
      [groupId]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (groupCheck.rows[0].owner_id !== userId) {
      return res.status(403).json({ message: "Only owner can remove members" });
    }

    if (memberId === userId) {
      return res.status(400).json({ message: "Owner cannot remove themselves" });
    }

    await pool.query(
      "DELETE FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, memberId]
    );

    res.json({ message: "Member removed successfully" });
  } catch (err) {
    console.error("removeMember error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getJoinRequests(req, res) {
  const groupId = req.params.groupId;
  const userId = req.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM group_join_requests WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getJoinRequests error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function approveJoinRequest(req, res) {
  const { groupId, userIdToApprove } = req.params;
  const ownerId = req.userId;

  try {
    const groupCheck = await pool.query("SELECT owner_id FROM groups WHERE id = $1", [groupId]);
    if (groupCheck.rows.length === 0) return res.status(404).json({ message: "Group not found" });
    if (groupCheck.rows[0].owner_id !== ownerId) return res.status(403).json({ message: "Only owner can approve requests" });

    await pool.query("INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'Member')", [groupId, userIdToApprove]);
    await pool.query("DELETE FROM group_join_requests WHERE group_id = $1 AND user_id = $2", [groupId, userIdToApprove]);

    res.json({ message: "Join request approved" });
  } catch (err) {
    console.error("approveJoinRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function rejectJoinRequest(req, res) {
  const { groupId, userIdToReject } = req.params;
  const ownerId = req.userId;

  try {
    const groupCheck = await pool.query("SELECT owner_id FROM groups WHERE id = $1", [groupId]);
    if (groupCheck.rows.length === 0) return res.status(404).json({ message: "Group not found" });
    if (groupCheck.rows[0].owner_id !== ownerId) return res.status(403).json({ message: "Only owner can reject requests" });

    await pool.query("DELETE FROM group_join_requests WHERE group_id = $1 AND user_id = $2", [groupId, userIdToReject]);

    res.json({ message: "Join request rejected" });
  } catch (err) {
    console.error("rejectJoinRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getPendingJoinRequests(req, res) {
  const { groupId } = req.params;
  const ownerId = req.userId;

  try {
    const groupCheck = await pool.query("SELECT owner_id FROM groups WHERE id = $1", [groupId]);
    if (groupCheck.rows.length === 0) return res.status(404).json({ message: "Group not found" });
    if (groupCheck.rows[0].owner_id !== ownerId) return res.status(403).json({ message: "Only owner can view join requests" });

    const result = await pool.query(
      `SELECT gjr.user_id, u.email
      FROM group_join_requests gjr
      JOIN users u ON u.id = gjr.user_id
      WHERE gjr.group_id = $1 AND gjr.status = 'pending'`,
      [groupId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getPendingJoinRequests error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function addMovieToGroup(req, res) {
  const { groupId } = req.params;
  const { tmdb_id } = req.body;
  const userId = req.userId;

  if (!tmdb_id) return res.status(400).json({ message: "tmdb_id is required" });

  try {
    const memberCheck = await pool.query(
      "SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: "You must be a group member to add movies" });
    }

    const exists = await pool.query(
      "SELECT * FROM group_movies WHERE group_id = $1 AND tmdb_id = $2",
      [groupId, tmdb_id]
    );
    if (exists.rows.length > 0) return res.status(400).json({ message: "Movie already added" });

    const result = await pool.query(
      "INSERT INTO group_movies (group_id, tmdb_id, added_by) VALUES ($1, $2, $3) RETURNING *",
      [groupId, tmdb_id, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("addMovieToGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function removeMovieFromGroup(req, res) {
  const { groupId, movieId } = req.params;
  const userId = req.userId;

  try {
    const memberCheck = await pool.query(
      "SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ message: "Not a group member" });
    }

    const movieCheck = await pool.query(
      "SELECT * FROM group_movies WHERE id = $1 AND group_id = $2",
      [movieId, groupId]
    );

    if (movieCheck.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found in group" });
    }

    await pool.query(
      "DELETE FROM group_movies WHERE id = $1 AND group_id = $2",
      [movieId, groupId]
    );

    res.json({ message: "Movie removed from group" });
  } catch (err) {
    console.error("removeMovieFromGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function discoverGroups(req, res) {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `
      SELECT 
        g.id,
        g.name,
        COUNT(gm.user_id)::int AS members
      FROM groups g
      LEFT JOIN group_members gm ON gm.group_id = g.id
      WHERE g.id NOT IN (
        SELECT group_id FROM group_members WHERE user_id = $1
      )
      GROUP BY g.id, g.name
      ORDER BY RANDOM()
      LIMIT 16
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("discoverGroups error:", err);
    res.status(500).json({ message: "Server error" });
  }
}