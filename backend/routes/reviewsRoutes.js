import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
    createReview,
    getReviewsForMovie,
    deleteReview
} from "../controllers/reviewsController.js";

const router = express.Router();

router.post("/", authRequired, createReview);
router.get("/:tmdb_id", getReviewsForMovie);
router.delete("/:id", authRequired, deleteReview);

export default router;
