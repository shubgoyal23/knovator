import { Worker } from 'bullmq';
import dotenv from "dotenv";
dotenv.config();

const redis_conn = process.env.REDIS_HOST.split(":");
const connection = {
   host: redis_conn[0],
   port: redis_conn[1],
   password: process.env.REDIS_PWD,
};

const worker = new Worker(
  'jobs_links',
  async job => {
    console.log(job);
  },
  { connection },
);