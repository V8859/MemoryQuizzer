"use client";
import React, { useEffect, useState } from "react";

// Define the Temp component
export const Temp = () => {
  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    fetch("http://localhost:8080/api/home")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Failed to load data");
      });
  }, []);

  return (
    <div>
      {message}
      <SendMessageButton />
    </div>
  );
};

// Define the SendMessageButton component
const SendMessageButton = () => {
  return (
    <div>
      <button
        onClick={() => {
          createUser("Checkingaaaaaaaaaaaaaaa");
        }}
      >
        Submit
      </button>
    </div>
  );
};

// Define the createUser function
async function createUser(userData: string) {
  try {
    const response = await fetch("http://localhost:8080/api/user", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: userData,
    });
    if (!response.ok) throw new Error("Failed to create user");
    const result = await response.json();
    console.log("User created:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

export default Temp;
