import React, { use } from "react";
import { SVG } from "../../Styles/GlobalStyles";
import { LogOut, LogIn, Palette, UserRoundSearch } from "lucide-react";
import { auth, signIn, signOut } from "@/auth";
import ToggleButton from "./ToggleButton";
import { CustomButton } from "./CustomButton";
import { SidebarItem } from "./SidebarItem";
import { ToggleThemeButton } from "./ToggleThemeButton";
import UserInfo from "./UserInfo";
import SetUserId from "./SetUserId";
import getUserOrCreate from "@/app/scripts/login";
import { getGuestMode, setGuestMode } from "@/app/GuestMode/GuestMode";
import SetGuestMode from "@/app/components/Navbar/SetGuestMode";
// interface SidebarContextProps {
//   expanded: boolean;
// }

// // interface SidebarProps {
// //   expanded: boolean;
// //   setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
// // }
// var expanded = false;

// const setExpanded = () => {
//   expanded = !expanded;
// };
// // const session = await auth();
export const Sidebar = async ({}) => {
  const guestMode = await getGuestMode();
  let userId = null;
  const session = await auth();
  if (!guestMode) {
    userId = await getUserOrCreate(
      session?.user?.name,
      session?.user?.email,
      session
    );
  }

  return (
    <div className="h-full item-center sticky NavbarTransitionStyle">
      <aside className=" h-[96%] m-1 my-5 ml-1 md:ml-3 BigDivShadow rounded-xl sticky">
        <nav className="Navbar">
          <div className="p-1 md:p-4 pb-2 flex justify-between items-center">
            <div></div>
            <ToggleButton></ToggleButton>
          </div>
          <ul className="flex-1 px-1 items-center justify-center">
            <SidebarItem icon={SVG.dashboard} text={"Dashboard"} link={"/"} />
            <SidebarItem icon={SVG.Notes} text={"Notes"} link={"/Notes"} />
            <SidebarItem icon={SVG.Decks} text={"Decks"} link={"/Decks"} />
            <SidebarItem icon={SVG.Play} text={"Play"} link={"/Play"} />
          </ul>
          <div className="flex flex-col justify-center items-center relative">
            {(session && session?.user) || guestMode ? (
              <>
                {session && session?.user ? (
                  <form
                    className="w-full mx-1 object-center justify-center flex"
                    action={async () => {
                      "use server";
                      if (session) {
                        await signOut({ redirectTo: "/" });
                      }
                    }}
                  >
                    {!guestMode ? (
                      <SetUserId remove={false} userId={userId}></SetUserId>
                    ) : (
                      ""
                    )}

                    <CustomButton
                      text="Logout"
                      icon={<LogOut></LogOut>}
                      tooltipText="Logout"
                      type="submit"
                    ></CustomButton>
                  </form>
                ) : (
                  <form
                    action={async () => {
                      "use server";
                      await setGuestMode(false);
                    }}
                  >
                    <SetUserId userId={userId} remove={true}></SetUserId>

                    <CustomButton
                      text="Logout"
                      icon={<LogOut></LogOut>}
                      tooltipText="Logout"
                      type="submit"
                    ></CustomButton>
                  </form>
                )}
              </>
            ) : (
              <>
                {/* <CustomButton
                  text="Login"
                  icon={<LogIn />}
                  currentStyles={currentStyles}
                  tooltipText="Login"
                  action={() => signIn("google")}
                ></CustomButton> */}
                {/* <form
                  className="w-full mx-1 object-center justify-center flex"
                  action={async () => {
                    "use server";
                    await signIn("google");
                  }}
                > */}
                <CustomButton
                  text="Login"
                  icon={<LogIn />}
                  tooltipText="Login"
                  // type="submit"
                  disabled={true}
                ></CustomButton>
                {/* </form> */}
              </>
            )}

            <div className="flex items-center mb-5">
              <span className="mx-2 text-gray-500">or</span>
            </div>
            {(session && session?.user) || guestMode ? (
              ""
            ) : (
              <form
                className="w-full mx-1 object-center justify-center flex"
                action={async () => {
                  "use server";
                  await setGuestMode(true);
                }}
              >
                <CustomButton
                  text="Continue as Guest"
                  icon={<UserRoundSearch />}
                  tooltipText="Continue as Guest"
                ></CustomButton>
              </form>
            )}
            {guestMode ? (
              <SetGuestMode guest={true}></SetGuestMode>
            ) : (
              <SetGuestMode guest={false}></SetGuestMode>
            )}

            <ToggleThemeButton icon={<Palette />}></ToggleThemeButton>
            {session && session?.user ? (
              <UserInfo session={session}></UserInfo>
            ) : (
              <>
                <SetUserId userId={null}></SetUserId>
              </>
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
};
