import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "da53db51149c361a14745577ab67caa6";

export async function signup(req, res) {
  const { email, password } = req.body;

  const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8+ characters, contain one uppercase letter and one number.",
    });
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, hash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ user, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function signin(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, email, created_at, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    delete user.password_hash;

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ user, token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
