import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJobs,
  showStats,
} from "../controller/jobsController.js";
import express from "express";
const router = express.Router();

import authenticateUser from "../middleware/auth.js";

router
  .route("/")
  .post(authenticateUser, createJob)
  .get(authenticateUser, getAllJobs);
router.route("/stats").get(authenticateUser, showStats);
router
  .route("/:id")
  .delete(authenticateUser, deleteJob)
  .patch(authenticateUser, updateJobs);

export default router;
