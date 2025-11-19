import React from "react";
import GuestModeButton from "./GuestModeButton";

const NoLogin = () => {
  return (
    <div>
      <div className="h-screen">
        <div className="Composer">
          <div className="NoteArea flex">
            <h1 className="text-xl text-pretty font-[Consolas] text-gray-600">
              <GuestModeButton />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoLogin;


