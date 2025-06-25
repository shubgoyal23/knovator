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

async function addJobs(source, url) {
   await myQueue.add(
      "job_links",
      {
         source,
         url,
      },
      {
         removeOnComplete: {
            age: 3600,
         },
         removeOnFail: {
            age: 24 * 3600,
         },
      }
   );
   await myQueue.close();
}

addJobs("jobicy", "https://jobicy.com/?feed=job_feed")
   .then(() => {
      console.log("Job added and queue closed.");
      process.exit(0);
   })
   .catch((err) => {
      console.error("Error adding job:", err);
      process.exit(1);
   });
