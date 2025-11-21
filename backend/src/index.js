import express from "express";
import cors from "cors";

import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import favoriteRoutes from "../routes/favoriteRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(5000, () =>
  console.log("Backend running on port 5000")
);
