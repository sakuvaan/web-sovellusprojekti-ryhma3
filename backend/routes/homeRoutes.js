import express from "express";
import { getLatestReviews, getMostPopularGroups } from "../controllers/homeController.js";

const router = express.Router();

router.get("/latest-reviews", getLatestReviews);
router.get("/popular", getMostPopularGroups);

export default router;
