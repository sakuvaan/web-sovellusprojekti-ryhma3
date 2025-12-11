import express from "express";
import { deleteAccount, changePassword } from "../controllers/userController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.delete("/delete", authRequired, deleteAccount);
router.post("/change-password", authRequired, changePassword);

export default router;
