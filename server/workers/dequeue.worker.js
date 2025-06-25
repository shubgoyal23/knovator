import { Worker } from "bullmq";
import dotenv from "dotenv";
import { parseXML } from "../src/helpers/helpers.js";
import { Job } from "../src/models/jobData.model.js";
import connectDb from "../src/db/connectDb.js";
import { ImportLog } from "../src/models/log.model.js";
dotenv.config();

const redis_conn = process.env.REDIS_HOST.split(":");
const connection = {
   host: redis_conn[0],
   port: redis_conn[1],
   password: process.env.REDIS_PWD,
};

const worker = new Worker(
   "jobs_links",
   async (job) => {
      const { source, url } = job.data;
      const data = await fetch(url);
      const textData = await data.text();
      const jsonData = parseXML(textData);
      const links = jsonData.rss.channel.item;
      const insertData = [];
      links.forEach((link) => {
         insertData.push({
            title: link?.title?._text,
            id: link?.id?._text,
            link: link?.link?._text,
            pubDate: link?.pubDate?._text,
            description: link?.description?._cdata,
            encoded: link?.["content:encoded"]?._cdata,
            url: link?.link?._text,
            location: link?.["job_listing:location"]?._cdata,
            job_type: link?.["job_listing:job_type"]?._cdata,
            company: link?.["job_listing:company"]?._cdata,
         });
      });
      await connectDb();
      const result = {
         totalFetched: insertData.length,
         newJobs: 0,
         updatedJobs: 0,
         failedJobs: [],
         source,
         link: url,
      };
      for (let i = 0; i < insertData.length; i++) {
         try {
            const job = await Job.updateOne(
               { id: insertData[i].id },
               insertData[i],
               { upsert: true}
            );
            if (job.modifiedCount > 0) {
               result.updatedJobs++;
            } else {
               result.newJobs++;
            }
         } catch (error) {
            result.failedJobs.push({
               jobId: insertData[i].id,
               reason: error.message,
            });
         }
      }
      await ImportLog.create(result);
   },
   { concurrency: 5, connection }
);
