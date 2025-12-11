import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
    createGroup,
    getGroups,
    updateGroups,
    getGroupMembers
} from "../controllers/groupsController.js";

const router = express.Router();

router.post("/", authRequired, createGroup);
router.get("/", authRequired, getGroups);
router.put("/", authRequired, updateGroups);
router.get("/:groupId/members", authRequired, getGroupMembers);
export default router;