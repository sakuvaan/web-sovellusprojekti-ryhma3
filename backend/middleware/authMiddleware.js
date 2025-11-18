import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing token" });

  const token = header.split(" ")[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "da53db51149c361a14745577ab67caa6";
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}