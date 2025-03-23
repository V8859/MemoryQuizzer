import NoLogin from "@/app/components/NoLogin";
import Composer from "@/app/components/Play/Composer";
import { auth } from "@/auth";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <div>
      {session && session?.user ? (
        <div className="h-screen">
          <Composer />
        </div>
      ) : (
        <NoLogin></NoLogin>
      )}
    </div>
  );
};

export default page;
