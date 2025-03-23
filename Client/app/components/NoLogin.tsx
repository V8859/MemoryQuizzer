import React from "react";

type Props = {};

const NoLogin = (props: Props) => {
  return (
    <div>
      <div className="h-screen">
        <div className="Composer">
          <div className="NoteArea flex">
            <h1 className="text-xl text-pretty font-[Consolas] text-gray-600">
              Please login or Continue as Guest
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoLogin;
