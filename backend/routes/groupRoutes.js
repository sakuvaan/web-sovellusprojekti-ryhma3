import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
    createGroup,
    getGroups,
    getGroupMembers,
    getGroupDetails,
    joinGroup,
    leaveGroup,
    deleteGroup,
    removeMember,
    getJoinRequests,
    getPendingJoinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    addMovieToGroup,
    removeMovieFromGroup,
    discoverGroups
} from "../controllers/groupsController.js";

const router = express.Router();

router.post("/", authRequired, createGroup);
router.get("/", authRequired, getGroups);

router.get("/discover", authRequired, discoverGroups);

router.get("/:groupId/members", authRequired, getGroupMembers);
router.get("/:groupId", authRequired, getGroupDetails);

router.post("/:groupId/join", authRequired, joinGroup);
router.post("/:groupId/leave", authRequired, leaveGroup);
router.delete("/:groupId", authRequired, deleteGroup);

router.delete("/:groupId/members/:memberId", authRequired, removeMember);

router.get("/:groupId/join-requests", authRequired, getJoinRequests);
router.get("/:groupId/join-requests/pending", authRequired, getPendingJoinRequests);

router.post("/:groupId/join-requests/:userIdToApprove/approve", authRequired, approveJoinRequest);
router.post("/:groupId/join-requests/:userIdToReject/reject", authRequired, rejectJoinRequest);

router.post("/:groupId/movies", authRequired, addMovieToGroup);
router.delete("/:groupId/movies/:movieId", authRequired, removeMovieFromGroup);

export default router;