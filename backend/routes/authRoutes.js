import express from "express";
import { signup, signin, logout, getMe } from "../controllers/authController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/me", authRequired, getMe);

export default router;
