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

        const group = result.rows[0];

        await pool.query(
            `INSERT INTO group_members (group_id, user_id, role)
             VALUES ($1, $2, 'Owner')`,
            [group.id, userId]
        );

        res.status(201).json(group);
    } catch (err) {
        console.error("createGroup error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getGroups(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM groups"
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
  const groupId = req.params.groupId;

  try {
    const result = await pool.query(
      `SELECT gm.group_id, gm.user_id, gm.role, u.email
       FROM group_members gm
       JOIN users u ON u.id = gm.user_id
       WHERE gm.group_id = $1`,
      [groupId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getGroupMembers error:", err);
    res.status(500).json({ message: "Server error"});
  }
}

export async function createJoinRequest(req, res) {
  const groupId = req.params.groupId;
  const userId = req.userId || req.body.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO group_join_requests (group_id, user_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [groupId, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("createJoinRequest error:", err.message, err.detail);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
}

export async function acceptJoinRequest(req, res) {
  const requestId = req.params.requestId || req.body.requestId;

  try {
    const reqResult = await pool.query(
      `SELECT * FROM group_join_requests WHERE id = $1`,
      [requestId]
    );

    if (reqResult.rows.length === 0) {
      return res.status(404).json({ message: "Join request not found" });
    }

    const { group_id, user_id } = reqResult.rows[0];

    await pool.query(
      `UPDATE group_join_requests
       SET status = 'accepted'
       WHERE id = $1`,
      [requestId]
    );

    const memberResult = await pool.query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, 'Member')
       RETURNING *`,
      [group_id, user_id]
    );

    res.json(memberResult.rows[0]);
  } catch (err) {
    console.error("acceptJoinRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getPendingJoinRequests(req, res) {
  const groupId = req.params.groupId;

  try {
    const result = await pool.query(
      `SELECT gjr.id, gjr.group_id, gjr.user_id, gjr.status, gjr.created_at, u.email
       FROM group_join_requests gjr
       JOIN users u ON u.id = gjr.user_id
       WHERE gjr.group_id = $1 AND gjr.status = 'pending'
       ORDER BY gjr.created_at ASC`,
      [groupId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getPendingJoinRequests error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function rejectJoinRequest(req, res) {
  const requestId = req.params.requestId || req.body.requestId;

  try {
    const result = await pool.query(
      `UPDATE group_join_requests
       SET status = 'rejected'
       WHERE id = $1
       RETURNING *`,
      [requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Join request not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("rejectJoinRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function leaveGroup(req, res) {
  const groupId = req.params.groupId;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM group_members
       WHERE group_id = $1 AND user_id = $2
       RETURNING *`,
      [groupId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Member not found in group" });
    }

    res.json({ message: "Successfully left the group", member: result.rows[0] });
  } catch (err) {
    console.error("leaveGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function removeMember(req, res) {
  const groupId = req.params.groupId;
  const memberId = req.body.memberId;
  const ownerId = req.userId;

  if (!memberId) {
    return res.status(400).json({ message: "Member ID is required" });
  }

  try {
    const groupResult = await pool.query(
      "SELECT owner_id FROM groups WHERE id = $1",
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (groupResult.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ message: "Only the group owner can remove members" });
    }

    if (memberId === ownerId) {
      return res.status(400).json({ message: "Owner cannot remove themselves." });
    }

    const result = await pool.query(
      `DELETE FROM group_members
       WHERE group_id = $1 AND user_id = $2
       RETURNING *`,
      [groupId, memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Member not found in group" });
    }

    res.json({ message: "Member removed successfully", member: result.rows[0] });
  } catch (err) {
    console.error("removeMember error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteGroup(req, res) {
  const groupId = req.params.groupId;
  const userId = req.userId;

  try {
    const groupRes = await pool.query(
      "SELECT owner_id FROM groups WHERE id = $1",
      [groupId]
    );

    if (groupRes.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (groupRes.rows[0].owner_id !== userId) {
      return res.status(403).json({ message: "Only the owner can delete the group" });
    }

    await pool.query("BEGIN");

    await pool.query("DELETE FROM group_join_requests WHERE group_id = $1", [groupId]);
    await pool.query("DELETE FROM group_members WHERE group_id = $1", [groupId]);
    await pool.query("DELETE FROM groups WHERE id = $1", [groupId]);

    await pool.query("COMMIT");

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("deleteGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
