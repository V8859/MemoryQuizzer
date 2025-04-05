import { auth } from "@/auth";
import Composer from "../components/Dashboard/Composer";
import "../globals.css";
import { getGuestMode } from "../GuestMode/GuestMode";
import { session } from "./types";

export default async function Home() {
  const session: session | null = await auth();
  const guestMode = await getGuestMode();
  return (
    <div className="h-screen">
      <Composer
        userName={session ? session?.user?.name : guestMode ? "Guest" : ""}
      />
    </div>
  );
}
