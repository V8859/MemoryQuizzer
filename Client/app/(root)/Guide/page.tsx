import Composer from "@/app/components/Guide/Composer";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="h-screen overflow-hidden">
      <Composer></Composer>
    </div>
  );
};

export default page;
