import { auth } from "@/auth";
import React from "react";
import { NoteList } from "@/app/components/NotesComponents/NoteList";
import Notebooks from "@/app/components/NotesComponents/notebook/Notebooks";
import { Composer } from "@/app/components/NotesComponents/Composer";
import NoLogin from "@/app/components/NoLogin";

const page = async () => {
  const session = await auth();

  return (
    <div className="h-screen">
      <Composer></Composer>
    </div>
  );
};
export default page;
