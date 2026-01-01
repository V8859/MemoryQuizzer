import { useData } from "@/app/context/DataContext";
import { importNotebook } from "@/app/scripts/notebook";
import { NoteObject } from "@/app/Types/NoteTypes";
import { Info, Loader, X } from "lucide-react";
import { SetStateAction, useState } from "react";
type payload = {
    id: string;
};

const deckSizes = {
    "small": 20,
    "medium": 40,
    "large": 60
} as const

type DeckSizeKey = 20 | 40 | 60


const CreateFromGenAI = ({
    // SetRefetch,
    setData,
    // setChange,
    // setNotebookName,
    // payload,
    setNotebooksChanged,
}: {
    SetRefetch: React.Dispatch<SetStateAction<boolean>>;
    setData?: React.Dispatch<SetStateAction<NoteObject[]>>;
    setChange: React.Dispatch<SetStateAction<never[]>>;
    setNotebookName: React.Dispatch<SetStateAction<string>>;
    setNotebooksChanged: React.Dispatch<SetStateAction<number>>;
    payload?: payload;
}) => {
    const { toggleAlert, setCreateModal } = useData();
    const [currentSize, setCurrentSize] = useState<DeckSizeKey>(deckSizes.small)
    const [enabled, setEnabled] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        // setCreateModal(false)
        try {
            setDisabled(true)
            const response = await fetch("api/gemini",
                {
                    method: 'POST',
                    body: formData
                }
            )
            if (!response.body) throw new Error("no response body")


            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let fullText = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunkText = decoder.decode(value, { stream: true });
                fullText += chunkText

                // ADD progress bar for later on

            }

            try {
                console.log(fullText)
                const res = JSON.parse(fullText)
                const an = await importNotebook(res)
                if (an) {
                    setNotebooksChanged((prev) => prev + 1)
                }
                toggleAlert("Saved everything")
                setCreateModal(false)
            } catch (err) {
                console.error("Streaming error: ", err)
            }

            // console.log(res)

        } catch (error) {
            console.error(error)
        } finally {
            setDisabled(false)
        }

    }

    return (
        <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget);
                console.log(formData);
                (async () => {
                    await handleSubmit(formData)
                })();
            }}

            className={`w-full top-0 left-0 h-full fixed z-40 bg-gray-900/60 overflow-hidden`}>
            <div className="w-full h-full flex items-center justify-center">
                <input type="hidden" className="hidden" name="Notebook_size" value={currentSize}></input>

                <div className="flex relative flex-col bg-[--background] rounded">
                    {!disabled ? <button
                        title="close"
                        type="reset"
                        className="absolute top-2 right-1"
                        onClick={() => {
                            setCreateModal(false);
                            setData?.([]);
                        }}
                    >
                        <X />
                    </button> : <Loader className="absolute animate-spin top-2 right-1" />}
                    <div className="text-[--foreground] w-full text-center rounded-t py-2 bg-[--hoverColor]">
                        Create noteook with Generative AI
                    </div>
                    <div className="p-3 mt-1 w-full text-center">
                        <div className={`${enabled ? "opacity-30" : ""}`}
                        >
                            <span className="w-full items-center text-center mb-2 flex-col flex">Please write the topic for your notes
                                <input name="Topic_name" className="PlayCardAreaSearchBox" title=" Subject"></input></span>
                            <hr className="mb-1"></hr>
                            <span className="w-full text-center">Choose your notebook size
                                <NotesSizes currentSize={currentSize} setCurrentSize={setCurrentSize} />
                            </span>
                            <hr className="mb-1"></hr>
                        </div>

                        <span className="flex gap-2 items-center justify-center">Upload your notes own notes
                            <input
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                                type="checkbox"
                            ></input>
                        </span>
                        <input name="Attached_notes" title="Upload" disabled={!enabled} className={`w-full flex items-center text-center justify-center ${!enabled ? "opacity-50 cursor-not-allowed" : " "}`} type="file" accept="application/pdf, text/plain, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, audio/mp3, image/jpeg, image/png, video/mp4"></input>
                        <span className="flex items-center justify-start gap-1 mt-1 text-xs text-gray-400"><Info className="w-4 h-4" />AI can make mistakes</span>


                        <div className="flex items-center justify-center">
                            <button title="submit" type="submit"
                                className="ModalButton"
                                disabled={disabled}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form >
    );
};

export default CreateFromGenAI




function NotesSizes({ setCurrentSize, currentSize }: { setCurrentSize: React.Dispatch<SetStateAction<DeckSizeKey>>, currentSize: number }) {

    const handleSizeChange = (payload: number) => {
        switch (payload) {
            case deckSizes.small:
                setCurrentSize(deckSizes.small)
                break;
            case deckSizes.medium:
                setCurrentSize(deckSizes.medium)
                break;
            case deckSizes.large:
                setCurrentSize(deckSizes.large)
                break;
            default:
                setCurrentSize(deckSizes.small)
                break
        }

    }

    return (<>
        <span className="flex justify-evenly mx-2 gap-3">
            <button type="button" className={`ModalButtonSelection border-2 transition-colors duration-500 ease-in-out ${currentSize === deckSizes.small ? "bg-[--hoverColor] border-green-400" : "bg-green-400 border-transparent"} `} title="small" onClick={() => {
                handleSizeChange(deckSizes.small)
            }}>Small</button>
            <button type="button" className={`ModalButtonSelection border-2 transition-colors duration-500 ease-in-out ${currentSize === deckSizes.medium ? "bg-[--hoverColor] border-blue-400" : "bg-blue-400 border-transparent"} `} title="medium" onClick={() => {
                handleSizeChange(deckSizes.medium)
            }}>Medium</button>
            <button type="button" className={`ModalButtonSelection border-2 transition-colors duration-500 ease-in-out ${currentSize === deckSizes.large ? "bg-[--hoverColor] border-red-700" : "bg-red-700 border-transparent"} `} title="large" onClick={() => {
                handleSizeChange(deckSizes.large)
            }}>Large</button>
        </span>
    </>)
}