import NoLogin from "@/app/components/NoLogin";
import Composer from "@/app/components/Play/Composer";
import { auth } from "@/auth";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <div className="h-screen">
      <Composer />
    </div>
  );
};

export default page;
