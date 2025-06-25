import React from "react";
import ThemeToggler from "@/components/common/ThemeToggler";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

function Header() {
   return (
      <div className="w-full h-14 flex items-center justify-between px-4 bg-card border-b border-border">
         <Link href="/">
            <div className="flex items-center gap-2 font-bold text-lg cursor-pointer">
               Job Details
            </div>
         </Link>
         <div className="flex items-center gap-2">
            <ThemeToggler />
            <Link href="/logout">
               <Button variant="outline" className="cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
               </Button>
            </Link>
         </div>
      </div>
   );
}

export default Header;
