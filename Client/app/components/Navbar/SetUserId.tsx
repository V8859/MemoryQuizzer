"use client";
import { useEffect } from "react";
const SetUserId = ({ userId }: { userId: string | null }) => {
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
      console.log("User ID stored in localStorage:", userId);
    }
  }, [userId]);

  return null;
};

export default SetUserId;
