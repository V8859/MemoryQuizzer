import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
// import { Navbar } from "../components/Sidebar";
import { Sidebar } from "../components/Navbar/Navbar";
import { auth } from "@/auth";
import { getGuestMode } from "../GuestMode/GuestMode";
import NoLogin from "../components/NoLogin";
import { DataProvider } from "../context/DataContext";
import Alert from "../components/Alert";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const guestMode = await getGuestMode();

  return (
    <DataProvider>
      <ThemeProvider>
        <div className="flex w-full h-screen flex-row">
          <Sidebar />
          {(session && session?.user) || guestMode ? (
            <>
              <Alert timing={1000}></Alert>
              <div className="w-full h-screen md:m-5">{children}</div>
            </>
          ) : (
            <div className="w-full h-screen md:m-5">
              <NoLogin />
            </div>
          )}
        </div>
      </ThemeProvider>
    </DataProvider>
  );
}
