import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
    createReview,
    getReviewsForMovie
} from "../controllers/reviewsController.js";

const router = express.Router();

router.post("/", authRequired, createReview);
router.get("/:tmdb_id", getReviewsForMovie);

export default router;
