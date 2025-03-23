import { auth } from "@/auth";
import Composer from "../components/Dashboard/Composer";
import "../globals.css";
import NoLogin from "../components/NoLogin";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      {session && session?.user ? (
        <div className="h-screen">
          <Composer userName={session.user.name} />
        </div>
      ) : (
        <NoLogin></NoLogin>
      )}
    </div>
  );
}
