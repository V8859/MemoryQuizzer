"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import React from "react";
import "../../globals.css";

interface UserInfoProps {
  session?: {
    user: {
      image: string;
    };
  };
}

const UserInfo: React.FC<UserInfoProps> = ({ session }) => {
  const { expanded } = useTheme();
  //   console.log(session?.user.image);
  return (
    <>
      <>
        <div className="border-t flex p-3">
          <Image
            alt=""
            width={2.5}
            height={2.5}
            src={session?.user?.image}
            // alt={session?.user.image}
            className="w-10 h-10 rounded-md"
          ></Image>
          <div
            className={`flex justify-between items-center overflow-hidden transition all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading">
              <h4 className="font-semibold">{session?.user.name}</h4>
              <span className="text-xs font-small">{session?.user.email}</span>
            </div>
            <MoreVertical size={20}></MoreVertical>
          </div>
        </div>
      </>
    </>
  );
};

export default UserInfo;
