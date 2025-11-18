import express from "express";
import { deleteAccount } from "../controllers/userController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { changePassword } from "../controllers/userController.js";

const router = express.Router();

router.delete("/delete", authRequired, deleteAccount);
router.post("/change-password", authRequired, changePassword);

export default router;
