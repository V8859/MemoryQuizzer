"use client";
import { CirclePlus, Trash, X } from "lucide-react";
import {
  addNotebook,
  deleteNotebook,
  getNotebooks,
} from "@/app/scripts/notebook";
import React, { useEffect, useState } from "react";

type notebook = {
  id: string;
  name: string;
};

const Notebooks = ({
  setNoteId,
  setNotebooks,
  notebooks,
  setNotebookName,
  setModal,
  setPayload,
}: {
  setNoteId: any;
  setNotebooks: Function;
  notebooks: any;
  setNotebookName: Function;
  setModal: Function;
  setPayload: Function;
}) => {
  const [check, setCheck] = useState(false);

  // useEffect(() => {
  //   const fetchNotebooks = async () => {
  //     const userId = localStorage.getItem("userId");
  //     if (userId) {
  //       const books = await getNotebooks(userId);
  //       setNotebooks(books);
  //     }
  //   };
  //   fetchNotebooks();
  // }, [change]);
  return (
    <div className="NotebookBar BigDivShadow">
      <aside className="my-5 mx-1 rounded-xl items-center justify-center text-center md:text-left">
        <nav className="h-full flex flex-col items-center md:items-start justify-center">
          <>
            <MyForm notebook={notebooks} setNotebooks={setNotebooks}></MyForm>
          </>
          <h1 className="md:w-[100%] w-[50%] pr-[40px] pl-2 text-lg basicHeaderColor rounded">
            Notebooks
          </h1>
          <hr className="my-1 md:w-full" />
          <div className="flex md:w-full items-center overflow-y-auto overflow-x-hidden">
            <ul className=" flex flex-col w-full">
              {notebooks.map((notebook: notebook) => (
                <li
                  className="NoteItem"
                  key={notebook.id}
                  onClick={async () => {
                    // setData([]);
                    setNoteId(notebook.id);
                    setNotebookName(notebook.name);
                  }}
                >
                  {notebook.name}
                  <button
                    className="SizeChangeAnimation"
                    onClick={async () => {
                      const payload = {
                        id: notebook.id,
                      };
                      setModal(true);
                      setPayload(payload);
                    }}
                  >
                    <Trash className="w-4 h-4"></Trash>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </div>
  );
};

const MyForm = ({
  notebook,
  setNotebooks,
}: {
  notebook: any;
  setNotebooks: any;
}) => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    formData.append("id", userId); // Append user ID to the form data

    const payload = { id: formData.get("id"), name: formData.get("name") };
    // console.log(payload);
    if (formData.get("name"))
      try {
        const response = await addNotebook(payload);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        if (!(data === "failed")) {
          const check = [...notebook, data];
          setNotebooks(check);
        }
      } catch (error) {
        console.error("Error adding notebook:", error);
      }

    form.reset(); // Clear the form after submission
  };

  return (
    <form method="POST" onSubmit={handleSubmit} className="border-transparent">
      <div className="flex flex-row rounded w-fit">
        <input
          className="NotebookBarInput"
          name="name"
          placeholder="Enter notebook name"
          required
          minLength={1}
          maxLength={20}
        />
        <button type="submit">
          <CirclePlus></CirclePlus>
        </button>
        <button type="reset">
          <X></X>
        </button>
      </div>
      <hr className="my-1  md:w-[100%]" />
    </form>
  );
};
export default Notebooks;
