import { Queue } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

const redis_conn = process.env.REDIS_HOST.split(":");
const connection = {
   host: redis_conn[0],
   port: redis_conn[1],
   password: process.env.REDIS_PWD,
};

const myQueue = new Queue("jobs_links", { connection });

async function addJobs() {
   await myQueue.add("job_links", {
      source: "jobicy",
      url: "https://jobicy.com/?feed=job_feed",
   });
}

await addJobs();
