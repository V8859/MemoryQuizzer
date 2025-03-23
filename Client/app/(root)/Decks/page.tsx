import { Card } from "@/app/components/Decks/Card";
import Composer from "@/app/components/Decks/DecksComposer/Composer";
import NoLogin from "@/app/components/NoLogin";
import { Temp } from "@/app/components/Temp";
import { auth } from "@/auth";

import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <>
      {session && session?.user ? (
        <>
          <div className="h-screen">
            <Composer></Composer>
          </div>
        </>
      ) : (
        <NoLogin />
      )}
    </>
  );
};

export default page;
