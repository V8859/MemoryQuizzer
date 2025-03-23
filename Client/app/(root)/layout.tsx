import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
// import { Navbar } from "../components/Sidebar";
import { Sidebar } from "../components/Navbar/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <body>
        <div className="flex h-screen flex-row">
          <Sidebar />
          <div className="w-full h-screen md:m-5">{children}</div>
        </div>
      </body>
    </ThemeProvider>
  );
}
