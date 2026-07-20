import Image from "next/image";
import { Bell } from "lucide-react";
<<<<<<< HEAD
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
=======
import Logout from "@/components/logout";

>>>>>>> aea6b4ce62f971d2dcfbd2d482ba93084597ab69



export default async function UserNav({id, name, buisnessName}: {id: string, name: string, buisnessName: string}) {
 
  
  return (
    <div>
      <section>
        {/* userNav user navigation profile details */}
        <div className="w-full  border-b border-gray-200 shadow-sm">
          {/* user profile */}
          <div className="p-2">
            <div className="flex justify-between items-center px-4 py-2">
              <div>
                <span>Dashboard</span>
              </div>

              <div className="flex  items-end gap-2">
                <div className="bg-gray-100 p-2 rounded-full mx-6 ">
                  <Bell className="h-5 w-5 text-[#0b7a75] dark:text-gray-400" />
                </div>
                <div className="w-0.5 h-10 bg-gray-300"></div>
                <div className="flex flex-col">
                  <span className="hidden md:block text-sm font-medium text-gray-900">
                    Business name:{buisnessName}
                  </span>
                  <span className="hidden md:block text-xs text-gray-500">
                    Username: {name}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    className="rounded-full object-cover w-10 h-10"
                    src="/profilePhoto.png"
                    alt="user profile photo"
                    width={40}
                    height={40}
                  />
                </div>
                <div> 
                  <Logout />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
