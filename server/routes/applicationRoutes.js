import express from "express";
import { apply, getMyApplications } from "../controllers/applicationController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", verifyToken, checkRole("student"), apply);
router.get("/my", verifyToken, checkRole("student"), getMyApplications);

export default router;
