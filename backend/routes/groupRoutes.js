import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
    createGroup,
    getGroups,
    updateGroups,
    getGroupMembers,
    createJoinRequest,
    acceptJoinRequest,
    getPendingJoinRequests,
    rejectJoinRequest,
    leaveGroup,
    removeMember
} from "../controllers/groupsController.js";

const router = express.Router();

router.post("/", authRequired, createGroup);
router.get("/", authRequired, getGroups);
router.put("/update", authRequired, updateGroups);
router.get("/:groupId/members", authRequired, getGroupMembers);
router.get("/:groupId/join-requests", authRequired, getPendingJoinRequests);
router.post("/:groupId/join-requests", authRequired, createJoinRequest);
router.delete("/:groupId/members/leave", authRequired, leaveGroup);
router.delete("/:groupId/members/:memberId", authRequired, removeMember);
router.put("/join-requests/:requestId/accept", authRequired, acceptJoinRequest);
router.put("/join-requests/:requestId/reject", authRequired, rejectJoinRequest);

export default router;