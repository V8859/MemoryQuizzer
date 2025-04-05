"use client";
import { CirclePlus, Trash, X } from "lucide-react";
import { addNotebook } from "@/app/scripts/notebook";
import React, { SetStateAction } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { v4 as uuidv4 } from "uuid";
import { guestMode } from "@/app/context/DataContext";
type notebook = {
  id: string;
  name: string;
};

type payload = {
  id: string;
};

const Notebooks = ({
  setNoteId,
  notebooks,
  setNotebookName,
  setModal,
  setPayload,
}: {
  setNoteId: React.Dispatch<SetStateAction<string>>;
  notebooks: never[];
  setNotebookName: React.Dispatch<SetStateAction<string>>;
  setModal: (prev: boolean) => void;
  setPayload: React.Dispatch<SetStateAction<payload>>;
}) => {
  // useEffect(() => {
  //   if (guestMode) {
  //     const fetchNotebooks = async () => {
  //       const userId = localStorage.getItem("userId");
  //       if (userId) {
  //         const books = await getNotebooks(userId);
  //         setNotebooks(books);
  //       }
  //     };
  //     fetchNotebooks();
  //   }
  // }, []);

  return (
    <div className="NotebookBar BigDivShadow">
      <aside className="my-5 mx-1 rounded-xl items-center justify-center text-center md:text-left">
        <nav className="h-full flex flex-col items-center md:items-start justify-center">
          <>
            <MyForm notebook={notebooks}></MyForm>
          </>
          <h1 className="md:w-[100%] w-[50%] pr-[40px] pl-2 text-lg basicHeaderColor rounded">
            Notebooks
          </h1>
          <hr className="my-1 md:w-full" />
          <div className="flex md:w-full items-center overflow-y-auto overflow-x-hidden">
            <ul className=" flex flex-col w-full">
              {notebooks
                ? notebooks.map((notebook: notebook) => (
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
                  ))
                : ""}
            </ul>
          </div>
        </nav>
      </aside>
    </div>
  );
};

type NotebookResponse = {
  ok: boolean;
  status: number;
};
type notebookF = {
  id: string;
  name: string;
  score: number;
};

type GuestModeResponse = {
  ok: boolean;
  notebooks: [notebookF];
};

const MyForm = () => {
  const { setNotebooksChanged } = useTheme();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!guestMode) {
      if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
      }
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("id", userId); // Append user ID to the form data
    let payload;
    if (!guestMode)
      payload = {
        id: formData.get("id"),
        name: formData.get("name"),
      };
    else {
      payload = {
        id: uuidv4(),
        name: formData.get("name"),
        createdAt: new Date().toISOString(),
        score: 0,
      };
    }
    console.log("payloadNotebook", payload);
    console.log(guestMode);
    if (formData.get("name"))
      try {
        let data;
        if (guestMode) {
          const response: GuestModeResponse = await addNotebook(payload);
          data = response.notebooks;
        } else {
          const response: Response | NotebookResponse = await addNotebook(
            payload
          );
          data = response;
        }
        // console.log(data);
        if (!(data === "failed")) {
          // [...notebook, data];
          // setNotebooks(check);
          setNotebooksChanged((prev: number) => {
            return prev + 1;
          });
        }
      } catch (error) {
        console.log(error);
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
