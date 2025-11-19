
import { setGuestMode } from "@/app/GuestMode/GuestMode";
import { ArrowBigLeft } from "lucide-react";

export default function GuestModeButton() {
    async function handleGuestMode() {
        "use server"; // tells Next this runs on the server
        await setGuestMode(true);
    }

    return (
        <form action={handleGuestMode}>
            <button className="text-blue-600 hover:text-blue-800 cursor-pointer flex justify-center items-center" type="submit">
                Continue as Guest {<div className="animate-pulse"><ArrowBigLeft /></div>}
            </button>
        </form>
    );
}
