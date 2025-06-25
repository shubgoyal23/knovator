import { Job } from "../models/jobData.model.js";
import { ImportLog } from "../models/log.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getJobs = asyncHandler(async (req, res) => {
   const { page = 1, limit = 5 } = req.query;
   const jobsData = await Job.find()
      .skip((page - 1) * limit)
      .limit(limit);
   if (!jobsData) {
      throw new ApiError(404, "No jobs found");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, jobsData, "Jobs fetched successfully"));
});

const getJobById = asyncHandler(async (req, res) => {
   const { id } = req.params;

   if (!id) {
      throw new ApiError(401, "Job id is required to fetch job");
   }

   const job = await Job.findById(id);
   if (!job) {
      throw new ApiError(403, "Job not found");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, job, "Job fetched successfully"));
});

const getJobLogs = asyncHandler(async (req, res) => {
   const { page = 1, limit = 5 } = req.query;
   const jobLogs = await ImportLog.find()
      .skip((page - 1) * limit)
      .limit(limit);
   if (!jobLogs) {
      throw new ApiError(404, "No job logs found");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, jobLogs, "Job logs fetched successfully"));
});

export { getJobs, getJobById, getJobLogs };
