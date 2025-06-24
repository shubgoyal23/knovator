import { Worker } from "bullmq";
import dotenv from "dotenv";
import { parseXML } from "../src/helpers/helpers.js";
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
      fetch(url)
         .then((res) => res.text())
         .then((data) => {
            const jsonData = parseXML(data);
            const links = jsonData.rss.channel.item;
            const insertData = [];
            console.log(links[0]);
            links.forEach((link) => {
               insertData.push({
                  title: link?.title?._text,
                  id: link?.id?._text,
                  link: link?.link?._text,
                  pubDate: link?.pubDate?._text,
                  description: link?.description?._cdata,
                  encoded: link?.["content:encoded"]?._cdata,
                  url: link?.url,
                  location: link?.["job_listing:location"]?._cdata,
                  job_type: link?.["job_listing:job_type"]?._cdata,
                  company: link?.["job_listing:company"]?._cdata,
               });
            });
            console.log(insertData[0]);
         });
   },
   { concurrency: 5, connection }
);
