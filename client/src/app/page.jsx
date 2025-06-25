"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Header from "@/components/common/Header";
import { login } from "@/store/userSlice/userSlice";
import toast from "react-hot-toast";
import DataTable from "@/components/common/DataTable";
import { useEffect, useState } from "react";
export default function Home() {
   const dispatch = useDispatch();
   const { loggedIn } = useSelector((state) => state.user);
   const [data, setDate] = useState([]);
   const router = useRouter();
   useEffect(() => {
      if (!loggedIn) {
         api.get("/api/v1/auth/current")
            .then((res) => {
               if (res.success) {
                  dispatch(login(res.data));
               } else {
                  router.push("/login");
               }
            })
            .catch((err) => {
               console.log(err);
               router.push("/login");
               toast.error(err.message || "Failed to get current user");
            });
      }
   }, []);

   useEffect(() => {
      api.get("/api/v1/jobs/job-logs")
         .then((res) => {
            if (res.success) {
               setDate(res.data);
            }
         })
         .catch((err) => {
            console.log(err);
            toast.error(err.message || "Failed to get jobs");
         });
   }, [setDate]);
   return (
      <div className="w-full h-full flex flex-col">
         <Header />
         <div className="flex-1 p-4">
            <h1 className="text-2xl font-bold">Job Logs</h1>
            <DataTable data={data} />
         </div>
      </div>
   );
}
