"use client";
import { CirclePlus, Trash, X } from "lucide-react";
import { addNotebook } from "@/app/scripts/notebook";
import React, { SetStateAction } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { v4 as uuidv4 } from "uuid";
import { guestMode, useData } from "@/app/context/DataContext";
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
  setPayload: React.Dispatch<SetStateAction<payload | undefined>>;
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
            <MyForm></MyForm>
          </>
          <h1 className="md:w-[100%] w-[50%] pr-[40px] pl-2 text-lg basicHeaderColor rounded">
            Notebooks
          </h1>
          <hr className="my-1 md:w-full" />
          <div className="flex md:w-full items-center overflow-y-scroll overflow-x-hidden">
            <ul className="flex flex-col w-full overflow-y-scroll flex-shrink">
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
                      title="deleteNotebook"
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

type NotebookObjectGuest = {
  id: string;
  name: string;
  createdAt: string;
  score: number;
};

type NotebookObjectServer = {
  id: string;
  name: string;
};

const MyForm = () => {
  const { setNotebooksChanged } = useTheme();
  const { toggleAlert } = useData();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    let userId;
    if (!guestMode) {
      userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
      }
      formData.append("id", userId);
    }

    let payload: NotebookObjectGuest | NotebookObjectServer;
    if (!guestMode)
      payload = {
        id: String(userId || ""),
        name: String(formData.get("name") || ""),
      };
    else {
      payload = {
        id: uuidv4(),
        name: String(formData.get("name") || ""),
        createdAt: new Date().toISOString(),
        score: 0,
      };
    }
    // console.log("payloadNotebook", payload);
    // console.log(guestMode);
    if (formData.get("name"))
      try {
        let data: { ok: boolean };
        if (guestMode) {
          const payloadGuest = payload as NotebookObjectGuest;
          const response: GuestModeResponse = await addNotebook(payloadGuest);
          data = response;
        } else {
          const payloadServer = payload as NotebookObjectServer;
          const response: Response | NotebookResponse = await addNotebook(
            payloadServer
          );
          data = response;
        }
        if (data.ok) {
          setNotebooksChanged((prev: number) => (prev += 1));
        } else {
          toggleAlert("Failed to add notebook", true);
        }
        // console.log(data);
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
        <button title="AddNotebook" className="w-full h-full" type="submit">
          <CirclePlus></CirclePlus>
        </button>
        <button title="ResetNotebookInput" type="reset">
          <X></X>
        </button>
      </div>
      <hr className="my-1  md:w-[100%]" />
    </form>
  );
};
export default Notebooks;
