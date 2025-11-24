"use client";
import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";
import { RightToolTip } from "./RightToolTip";
import "../../globals.css";
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  link?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  link,
}) => {
  const { expanded } = useTheme();
  return (
    <li className="relative transition-all duration-300 transform overflow-visible">
      <Link
        className={` ${expanded
          ? "NavButton"
          : "sNavButton " +
          " w-full my-3 transform flex-1 pt-1 justify-center pb-1 object-center group relative"
          }`}
        href={link || "#"}
      >
        {icon}
        <span
          className={`overflow-hidden duration-300 transition-all ease-in-out ${expanded ? "w-52 ml-3" : "w-0"
            }`}
        >
          {text}
        </span>
        {!expanded && <RightToolTip text={text}></RightToolTip>}
      </Link>
    </li>
  );
};
