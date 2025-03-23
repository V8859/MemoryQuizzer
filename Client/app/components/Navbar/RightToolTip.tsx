"use client";
import "../../globals.css";
export const RightToolTip = ({ text }: { text: string }) => {
  return (
    <div
      className={`h-full text-left absolute text-nowrap left-full top-1/2 -translate-y-1/2 rounded-r-md px-2 py-1 pointer-events-none transition-all duration:300 opacity-[0] group-hover:opacity-100 group-hover:visible textStyle `}
    >
      {text}
    </div>
  );
};
