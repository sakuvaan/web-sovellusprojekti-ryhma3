import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import favoriteRoutes from "../routes/favoriteRoutes.js";
import reviewsRoutes from "../routes/reviewsRoutes.js";
import groupRoutes from "../routes/groupRoutes.js";
import homeRoutes from "../routes/homeRoutes.js";

const app = express();

app.use(cors({
  origin: "https://web-sovellusprojekti-ryhma3.onrender.com",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/home", homeRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

export default app;
