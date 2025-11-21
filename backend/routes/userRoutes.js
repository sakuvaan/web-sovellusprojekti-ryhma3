import express from "express";
import { deleteAccount, getProfile, changePassword } from "../controllers/userController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.delete("/delete", authRequired, deleteAccount);
router.post("/change-password", authRequired, changePassword);
router.get("/:id", getProfile);

export default router;
