import express from "express";
import {
  createJobProfile,
  getJobs,
  getCompanyJobs,
  updateJobProfile,
  deleteJobProfile,
} from "../controllers/jobController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs); // Supports pagination
router.get("/company", verifyToken, checkRole("company"), getCompanyJobs);
router.post("/", verifyToken, checkRole("company"), createJobProfile);
router.put("/:id", verifyToken, checkRole("company"), updateJobProfile);
router.delete("/:id", verifyToken, checkRole("company"), deleteJobProfile);

export default router;
