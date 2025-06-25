"use client";
import { api } from "@/lib/api";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "@/store/userSlice/userSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Logout = () => {
   const router = useRouter();
   const dispatch = useDispatch();
   const handleLogout = () => {
      api.get("/api/v1/auth/logout")
         .then((res) => {
            if (res.success) {
               dispatch(logout());
               toast.success("Logged out successfully");
               router.push("/login");
            }
         })
         .catch((err) => {
            console.log(err);
            toast.error(err.message || "Failed to logout");
         });
   };

   return (
      <div className="w-full h-screen flex items-center justify-center">
         <Button
            onClick={handleLogout}
            variant="outline"
            className="cursor-pointer"
         >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
         </Button>
      </div>
   );
};

export default Logout;
