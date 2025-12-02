import express from "express";
import { getLatestReviews } from "../controllers/homeController.js";

const router = express.Router();

router.get("/latest-reviews", getLatestReviews);

export default router;
