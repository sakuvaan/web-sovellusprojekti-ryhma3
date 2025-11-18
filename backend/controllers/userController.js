import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

export async function deleteAccount(req, res) {
  const userId = req.userId;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    return res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function changePassword(req, res) {
  const userId = req.userId;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be 8+ characters, contain one uppercase letter and one number.",
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "New passwords do not match" });
  }

  try {
    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSame = await bcrypt.compare(newPassword, user.password_hash);
    if (isSame) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as the old password" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      newHash,
      userId,
    ]);

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}