import { auth } from "@/auth";
import Composer from "../components/Dashboard/Composer";
import "../globals.css";
import NoLogin from "../components/NoLogin";
import { getGuestMode } from "../GuestMode/GuestMode";

export default async function Home() {
  const session: any = await auth();
  const guestMode = await getGuestMode();
  return (
    <div className="h-screen">
      <Composer
        userName={session ? session.user.name : guestMode ? "Guest" : ""}
      />
    </div>
  );
}
