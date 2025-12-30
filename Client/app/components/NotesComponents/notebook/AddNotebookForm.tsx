import { guestMode, useData } from "@/app/context/DataContext";
import { useTheme } from "@/app/context/ThemeContext";
import { addNotebook } from "@/app/scripts/notebook";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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


const AddNotebookForm = () => {
    const { setNotebooksChanged } = useTheme();
    const { toggleAlert, setAddModal } = useData();
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
                    setAddModal(false)
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
        <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex-col top-0 left-0 h-full items-center justify-center flex fixed z-40 bg-gray-900/60 overflow-hidden">
                <div className="flex relative w-[25%] flex-col gap-1">
                    <h1 className="text-[--foreground] w-full text-center rounded-t py-2 bg-[--hoverColor]">Add Notebook</h1>
                    <button
                        title="close"
                        type="reset"
                        className="absolute top-2 right-1"
                        onClick={() => {
                            setAddModal(false);
                            // setData?.([]);
                        }}
                    >
                        <X />
                    </button>
                    <div className="w-full h-full bg-[--background]">
                        <div className="p-3 mt-1 w-full text-center">
                            <span className="w-full items-center text-center mb-2 flex-col flex">
                                <span>Enter notebook name</span>
                                <input
                                    className="PlayCardAreaSearchBox w-full"
                                    name="name"
                                    placeholder="e.g Astronomy, physics etc"
                                    required
                                    minLength={1}
                                    maxLength={20}
                                />
                            </span>

                        </div>
                        <div className="flex items-center justify-center w-full">
                            <button title="AddNotebook" className="ModalButton" type="submit">
                                Add
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <hr className="my-1  md:w-[100%]" />
        </form>
    );
};

export default AddNotebookForm;