import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  createFavorite,
  getMyFavorites,
  addMovieToFavorite,
  getFavoriteWithMovies,
  getAllFavorites,
  deleteFavorite,
  deleteMovieFromFavorite,
} from "../controllers/favoritesController.js";

const router = express.Router();

router.post("/", authRequired, createFavorite);
router.get("/me", authRequired, getMyFavorites);
router.post("/:id/movies", authRequired, addMovieToFavorite);

router.delete("/:id", authRequired, deleteFavorite);
router.delete("/movies/:movieId", authRequired, deleteMovieFromFavorite);

router.get("/", getAllFavorites);
router.get("/:id", getFavoriteWithMovies);


export default router;
