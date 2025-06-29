import { Router } from "express";
import {
   getJobs,
   getJobById,
   getJobLogs,
} from "../controllers/job.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

//secure route
router.route("/jobs").get(verifyJwt, getJobs);
router.route("/job-logs").get(verifyJwt, getJobLogs);
router.route("/job/:id").get(verifyJwt, getJobById);

export default router;
