import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import dotenv from "dotenv";
import connectDb from "./db/connectDb.js";
import { ApiResponse } from "./utils/ApiResposne.js";


dotenv.config();
const app = express();

app.use(
   cors({ origin: process.env.CORS_ORIGIN.split(";"), credentials: true })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


app.get("/ping", (req, res) => {
   res.send("pong");
});

app.use((req, res, next) => {
   connectDb()
      .then(() => next())
      .catch(() =>
         res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"))
      );
});

import userRouter from "./routers/user.router.js";
import jobRouter from "./routers/job.router.js";

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/jobs", jobRouter);

app.use((err, req, res, next) => {
   if (err instanceof ApiError) {
      res.status(err.statusCode).json({
         success: false,
         message: err.message,
         errors: err.errors,
      });
   } else {
      console.error(err);
      res.status(500).json({
         success: false,
         message: err.message,
      });
   }
});

export { app };
