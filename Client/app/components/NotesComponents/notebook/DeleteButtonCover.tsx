"use client";
import React, { SetStateAction } from "react";
// type notebook = {
//     id: string;
//     name: string;
// };

type payload = {
    id: string;
};

const DeleteButtonCover = ({
    // setNoteId,
    // notebooks,
    // setNotebookName,
    setModal,
    setPayload,
    noteId
}: {
    // setNoteId: React.Dispatch<SetStateAction<string>>;
    // notebooks: never[];
    // setNotebookName: React.Dispatch<SetStateAction<string>>;
    setModal: (prev: boolean) => void;
    setPayload: React.Dispatch<SetStateAction<payload | undefined>>;
    noteId?: string
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
        <>
            {noteId && <DeleteButton
                setModal={setModal}
                setPayload={setPayload}
                noteId={noteId}
            ></DeleteButton>}
        </>

    );
};

// type NotebookResponse = {
//     ok: boolean;
//     status: number;
// };
// type notebookF = {
//     id: string;
//     name: string;
//     score: number;
// };

// type GuestModeResponse = {
//     ok: boolean;
//     notebooks: [notebookF];
// };

// type NotebookObjectGuest = {
//     id: string;
//     name: string;
//     createdAt: string;
//     score: number;
// };

// type NotebookObjectServer = {
//     id: string;
//     name: string;
// };

// const MyForm = () => {
//     const { setNotebooksChanged } = useTheme();
//     const { toggleAlert } = useData();

//     return (

//         <div className="flex flex-row rounded w-fit">
//             <input
//                 className="NotebookBarInput"
//                 name="name"
//                 placeholder="Enter notebook name"
//                 required
//                 minLength={1}
//                 maxLength={20}
//             />
//         </div>
//     );
// };


export default DeleteButtonCover;


const DeleteButton = ({ setModal, setPayload, noteId }: {
    setModal: (prev: boolean) => void; setPayload: React.Dispatch<SetStateAction<payload | undefined>>;
    noteId?: string
}) => {
    return (
        <button
            title="deleteNotebook"
            className="WelcomeMessage group relative flex ease-in-out justify-start p-2 transition-all duration-300 mt-2 hover:bg-red-700 hover:-mt-2 rounded-t-xl"
            onClick={async () => {
                const payload = {
                    id: noteId
                } as payload;
                setModal(true);
                setPayload(payload);
            }}
        >Delete
        </button>
    )

}


