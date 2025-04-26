import { FileText, Grid2x2, LibraryBig, Play } from "lucide-react";

export const SVG = {
  dashboard: <Grid2x2 />,
  Notes: <FileText></FileText>,
  Decks: <LibraryBig></LibraryBig>,
  Play: <Play></Play>,
  Guide: (
    <div className="w-[26px] h-full">
      <svg
        viewBox="0 0 25 25"
        className="w-fit"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" className="fill-current" strokeWidth="20"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M7.90039 8.07954C7.90039 3.30678 15.4004 3.30682 15.4004 8.07955C15.4004 11.4886 11.9913 10.8067 11.9913 14.8976"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-current"
          ></path>{" "}
          <path
            d="M12 19.01L12.01 18.9989"
            className="stroke-current"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>
      </svg>
    </div>
  ),
};
